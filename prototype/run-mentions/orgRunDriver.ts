/**
 * Org run driver. An Org execution context is built from one complete view, and a new
 * delegated child makes the product reload that view from the server. The prototype does the
 * same locally: a structural change rebuilds the context from an updated view and keeps every
 * existing conversation; Agent events and Org tab messages go through the context's own
 * `applyEvent`.
 */
import { shallowReactive } from 'vue'
import type { AgentOrgExecutionViewDto } from '@autobyteus/collaboration-stream-contracts'
import { useAgentOrgContextsStore } from '~/stores/agentOrgContextsStore'
import { useRunHistoryStore } from '~/stores/runHistoryStore'
import { AgentOrgExecutionContext, type AgentOrgContextEntry } from '~/services/agentOrgExecution/agentOrgExecutionContext'
import { parseAgentTeamAddress } from '~/types/agent/AgentTeamAddress'
import { createCollaboratorContext, type RunDriver } from './runMentionPlayer'
import { addRunMentionOrgSource, resumedOrgRunIds } from './runMentionState'

type View = AgentOrgExecutionViewDto
type TaskExecution = View['execution_tree']['rootOrg']['taskExecutions'][number]

export const createOrgRunDriver = (orgRunId: string): RunDriver | null => {
  const store = useAgentOrgContextsStore()
  const history = useRunHistoryStore()
  const current = (): AgentOrgExecutionContext => {
    const context = store.contextFor(orgRunId)
    if (!context) throw new Error(`Org run '${orgRunId}' is not open.`)
    return context
  }
  const initial = store.contextFor(orgRunId)
  const focused = initial?.index.selectedAgent(initial.selection) ?? null
  const focusedContext = focused ? initial!.getAgentContext(focused.agentRunId) : null
  if (!initial || !focused || !focusedContext) return null

  /** Publishes a context for `view`, keeping every existing conversation and status. */
  const rebuild = (view: View, added: readonly AgentOrgContextEntry[] = []): void => {
    const previous = current()
    const entries = [...previous.listAgentContextEntries(), ...added]
    const candidate = shallowReactive(new AgentOrgExecutionContext({
      orgRunId,
      view: {
        ...view,
        is_active: true,
        base_change_sequence: previous.changeSequence,
        agent_statuses: entries.map((entry) => ({
          member_address: entry.memberAddress, agent_run_id: entry.agentRunId,
          status: (entry.context.state.currentStatus ?? 'offline') as View['agent_statuses'][number]['status'],
          trigger: null, tool_name: null, error_message: null, error_details: null,
        })),
      },
      entries,
    }))
    candidate.select(previous.selection)
    store.contexts = { ...store.contexts, [orgRunId]: candidate }
    history.applyAgentOrgActivity(orgRunId, true)
  }

  const apply = (event: Parameters<AgentOrgExecutionContext['applyEvent']>[1]): void => {
    const context = current()
    context.applyEvent(context.changeSequence + 1, event)
  }

  return {
    rootRunId: orgRunId,
    focusedAgentRunId: focused.agentRunId,
    focusedContext,
    addressOf: (agentRunId) => current().index.agents.get(agentRunId)?.address ?? agentRunId,
    activate: () => {
      resumedOrgRunIds.add(orgRunId)
      if (current().phase !== 'live') rebuild(current().view)
    },
    present: (agentRunId, event) => apply({
      kind: 'agent_presentation', member_address: current().index.requireAgent(agentRunId).address,
      agent_run_id: agentRunId, message: event,
    }),
    communication: (senderAgentRunId, receiverAgentRunId, content, messageId) => apply({
      kind: 'communication',
      message: { messageId, senderAgentRunId, receiverAgentRunId, content, messageType: 'direct_message', referenceFiles: [], createdAt: new Date().toISOString() },
    }),
    startTask: (plan, definition, delegatorAgentRunId) => {
      const view = current().view
      const root = view.execution_tree.rootOrg
      const launch = structuredClone(root.defaultLaunchConfiguration)
      const startedAt = new Date().toISOString()
      const delegator = delegatorAgentRunId ? { delegatorAgentRunId } : {}
      const agentSource = (agent: typeof plan.agents[number]) => ({
        address: agent.address, agentDefinitionId: agent.agentDefinitionId, role: null, description: null,
        agentRunId: `${agent.agentRunId}-source`, platformAgentRunId: null, launchConfiguration: launch,
      })
      // The collaborator is not a configured Org member: its identity and inherited settings come from here.
      addRunMentionOrgSource(orgRunId, plan.teamRunId
        ? {
            address: plan.address, teamDefinitionId: definition.id, role: null, description: null,
            teamRunId: `${plan.teamRunId}-source`, coordinatorAddress: plan.agents[0]!.address,
            defaultLaunchConfiguration: launch, members: plan.agents.map(agentSource), taskExecutions: [],
          }
        : agentSource(plan.agents[0]!))
      const execution: TaskExecution = plan.teamRunId
        ? {
            address: plan.address, teamRunId: plan.teamRunId, taskExecutions: [], startedAt, ...delegator,
            members: plan.agents.map((agent) => ({ address: agent.address, agentRunId: agent.agentRunId, platformAgentRunId: null })),
          }
        : { address: plan.address, agentRunId: plan.base, platformAgentRunId: null, startedAt, ...delegator }
      rebuild({
        ...view,
        execution_tree: { ...view.execution_tree, rootOrg: { ...root, taskExecutions: [...root.taskExecutions, execution] } },
      }, plan.agents.map((agent) => Object.freeze({
        agentRunId: agent.agentRunId,
        memberAddress: parseAgentTeamAddress(agent.address),
        context: createCollaboratorContext({
          agentRunId: agent.agentRunId, address: agent.address, agentDefinitionId: agent.agentDefinitionId,
          runtimeKind: launch.runtimeKind, llmModelIdentifier: launch.llmModelIdentifier, llmConfig: launch.llmConfig,
          autoExecuteTools: launch.autoExecuteTools, skillAccessMode: launch.skillAccessMode,
          workspaceMetadata: focusedContext.config.workspaceMetadata,
        }),
      })))
    },
    configuredEntry: (definition) => {
      const context = current()
      for (const member of context.executionTree.rootOrg.members) {
        if ('agentRunId' in member) {
          if (definition.kind === 'agent' && member.agentDefinitionId === definition.id) return member.agentRunId
          continue
        }
        if (definition.kind === 'team' && member.teamDefinitionId === definition.id) return context.index.coordinator(member.teamRunId).agentRunId
        const agent = definition.kind === 'agent' ? member.members.find((entry) => entry.agentDefinitionId === definition.id) : null
        if (agent) return agent.agentRunId
      }
      return null
    },
    refresh: () => history.refreshRunNavigationTopology('agent-org-activity'),
  }
}
