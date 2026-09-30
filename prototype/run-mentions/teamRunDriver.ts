/** Team run driver: feeds Team stream messages into the mounted Team execution view. */
import { markRaw } from 'vue'
import type { TaskExecutionDto, TeamStreamServerMessage } from '@autobyteus/team-stream-contracts'
import { useAgentTeamContextsStore } from '~/stores/agentTeamContextsStore'
import { useRunHistoryStore } from '~/stores/runHistoryStore'
import { dispatchAgentStreamMessage } from '~/services/agentStreaming/agentStreamMessageProjector'
import { toAgentProjectionMessage } from '~/services/agentStreaming/teamStreamDtoAdapters'
import { collectConfiguredAgents, collectConfiguredTeams } from '~/services/teamExecution/teamExecutionTreeSelectors'
import type { RunDriver } from './runMentionPlayer'
import { resumedTeamRunIds, runMentionState } from './runMentionState'

type StreamMessage = Exclude<TeamStreamServerMessage,
  { type: 'CONNECTED' | 'TEAM_RUN_LIFECYCLE' | 'TEAM_EXECUTION_VIEW_SNAPSHOT' | 'AGENT_COMMAND_ACK' }>

export const createTeamRunDriver = (): RunDriver | null => {
  const team = useAgentTeamContextsStore().activeTeamContext
  const focusedContext = team?.view.getFocusedAgentContext() ?? null
  if (!team || !focusedContext) return null
  const view = team.view
  const rootRunId = view.getRootTeamRunId()
  const history = useRunHistoryStore()

  const emit = (message: { type: string; payload: Record<string, unknown> }): void => {
    const sequenced = {
      ...message, payload: { ...message.payload, change_sequence: view.getChangeSequence() + 1 },
    } as unknown as StreamMessage
    const result = view.applyMessage(sequenced)
    if (result.disposition === 'rejected') {
      console.warn(`Prototype Team run rejected '${message.type}' (${result.code}): ${result.message}`)
      return
    }
    for (const effect of result.effects) {
      if (effect.kind === 'reconcile_team_navigation') {
        history.refreshRunNavigationTopology('team-stream-structure')
      } else if (effect.kind === 'dispatch_agent') {
        const context = view.getAgentContext(effect.agentRunId)
        if (!context) continue
        dispatchAgentStreamMessage(toAgentProjectionMessage(effect.message, effect.agentRunId), {
          kind: 'team_member', context, teamRunId: rootRunId, agentRunId: effect.agentRunId,
          memberAddress: view.getMemberAddress(effect.agentRunId)!,
        })
      }
    }
  }

  return {
    rootRunId,
    focusedAgentRunId: focusedContext.state.runId,
    focusedContext,
    addressOf: (agentRunId) => view.getMemberAddress(agentRunId) ?? agentRunId,
    activate: () => {
      resumedTeamRunIds.add(rootRunId)
      if (view.setRootTeamActive(true).disposition !== 'applied') return
      history.applyRunNavigationEffect({ kind: 'team_run', teamRunId: rootRunId, isActive: true }, { kind: 'PRESENTATION' })
      history.refreshRunNavigationTopology('team-stream-lifecycle')
    },
    present: (agentRunId, event) => emit({
      type: event.type,
      // The Team stream correlates a member input by its recipient, every other Agent event by its run.
      payload: event.type === 'MEMBER_INPUT_MESSAGE'
        ? { ...event.payload, recipient_agent_run_id: agentRunId }
        : { ...event.payload, agent_run_id: agentRunId },
    }),
    communication: (senderAgentRunId, receiverAgentRunId, content, messageId) => emit({
      type: 'TEAM_COMMUNICATION_MESSAGE',
      payload: { message: {
        message_id: messageId, sender_agent_run_id: senderAgentRunId, receiver_agent_run_id: receiverAgentRunId,
        content, message_type: 'direct_message', reference_files: [], created_at: new Date().toISOString(),
      } },
    }),
    startTask: (plan, _definition, delegatorAgentRunId) => {
      const launch = structuredClone(view.getExecutionTree().root_team.default_launch_configuration)
      const startedAt = new Date().toISOString()
      // The collaborator is not a configured member: its identity and inherited settings come from here.
      for (const agent of plan.agents) {
        runMentionState.agentSourceByRunId[agent.agentRunId] = markRaw({
          address: agent.address, agentDefinitionId: agent.agentDefinitionId, launchConfiguration: launch,
        })
      }
      const execution: TaskExecutionDto = plan.teamRunId
        ? {
            kind: 'task_team', address: plan.address, team_run_id: plan.teamRunId, task_executions: [],
            members: plan.agents.map((agent) => ({ kind: 'task_team_agent' as const, address: agent.address, agent_run_id: agent.agentRunId, platform_agent_run_id: null })),
            delegator_agent_run_id: delegatorAgentRunId, started_at: startedAt,
          }
        : { kind: 'task_agent', address: plan.address, agent_run_id: plan.base, platform_agent_run_id: null, delegator_agent_run_id: delegatorAgentRunId, started_at: startedAt }
      emit({ type: 'TASK_EXECUTION_STARTED', payload: { parent_team_run_id: rootRunId, execution } })
    },
    configuredEntry: (definition) => {
      const tree = view.getExecutionTree()
      const agents = collectConfiguredAgents(tree)
      const agent = definition.kind === 'agent'
        ? agents.find((entry) => entry.agent_definition_id === definition.id)
        : agents.find((entry) => entry.address === (definition.id === tree.root_team.team_definition_id
          ? tree.root_team.coordinator_address
          : collectConfiguredTeams(tree).find((entry) => entry.team_definition_id === definition.id)?.coordinator_address))
      return agent?.agent_run_id ?? null
    },
    focus: (agentRunId) => { view.focusAgent(agentRunId) },
    refresh: () => history.refreshRunNavigationTopology('team-stream-structure'),
  }
}
