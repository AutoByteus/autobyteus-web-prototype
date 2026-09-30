/**
 * Standalone Agent run driver. A standalone Agent run has no children today, so the task
 * Agents and task Teams it gains here, their conversations and their messages live in the
 * prototype's `AgentRunScope`. Agent events still go through the product's own projector.
 */
import { reactive } from 'vue'
import { useRunHistoryStore } from '~/stores/runHistoryStore'
import { dispatchAgentStreamMessage } from '~/services/agentStreaming/agentStreamMessageProjector'
import { toAgentPresentationProjectionMessage } from '~/services/agentStreaming/teamStreamDtoAdapters'
import { parseAgentTeamAddress } from '~/types/agent/AgentTeamAddress'
import { createCollaboratorContext, type RunDriver } from './runMentionPlayer'
import { agentRunScope, ensureAgentRunScope, resumedAgentRunIds, standaloneAgentAddress } from './runMentionState'
import { selectedStandaloneAgentRun } from './runMentionScopes'

export const createAgentRunDriver = (): RunDriver | null => {
  const root = selectedStandaloneAgentRun()
  if (!root) return null
  const rootRunId = root.state.runId
  const history = useRunHistoryStore()
  const existing = agentRunScope(rootRunId)
  const focusedChild = existing?.focusedRunId ? existing.children.get(existing.focusedRunId) ?? null : null
  const contextOf = (agentRunId: string) => agentRunId === rootRunId ? root : agentRunScope(rootRunId)?.children.get(agentRunId)?.context ?? null
  const addressOf = (agentRunId: string): string => agentRunId === rootRunId
    ? standaloneAgentAddress(root.config.agentDefinitionName)
    : agentRunScope(rootRunId)?.children.get(agentRunId)?.address ?? agentRunId

  return {
    rootRunId,
    focusedAgentRunId: focusedChild ? existing!.focusedRunId! : rootRunId,
    focusedContext: focusedChild?.context ?? root,
    addressOf,
    activate: () => {
      resumedAgentRunIds.add(rootRunId)
      history.markRunAsActive(rootRunId)
    },
    present: (agentRunId, event) => {
      const context = contextOf(agentRunId)
      if (!context) return
      const message = toAgentPresentationProjectionMessage(event, agentRunId)
      // A child is not a run in the history tree, so it uses the projection target that skips
      // standalone-run navigation effects.
      if (agentRunId === rootRunId) dispatchAgentStreamMessage(message, { kind: 'standalone', context, runId: rootRunId })
      else dispatchAgentStreamMessage(message, {
        kind: 'agent_org_member', context, orgRunId: rootRunId, agentRunId, memberAddress: parseAgentTeamAddress(addressOf(agentRunId)),
      })
    },
    communication: (senderAgentRunId, receiverAgentRunId, content, messageId) => {
      ensureAgentRunScope(rootRunId).messages.push({ messageId, senderAgentRunId, receiverAgentRunId, content, createdAt: new Date().toISOString() })
    },
    startTask: (plan) => {
      const scope = ensureAgentRunScope(rootRunId)
      for (const agent of plan.agents) {
        const context = createCollaboratorContext({
          agentRunId: agent.agentRunId, address: agent.address, agentDefinitionId: agent.agentDefinitionId,
          runtimeKind: String(root.config.runtimeKind), llmModelIdentifier: root.config.llmModelIdentifier,
          llmConfig: root.config.llmConfig ?? null, autoExecuteTools: root.config.autoExecuteTools,
          skillAccessMode: String(root.config.skillAccessMode), workspaceMetadata: root.config.workspaceMetadata,
        })
        // Reactive like a Team member's context, so status and conversation updates render.
        context.state = reactive(context.state) as typeof context.state
        scope.children.set(agent.agentRunId, { address: agent.address, context: reactive(context) as typeof context })
      }
      if (plan.teamRunId) scope.expandedTeamRunIds.push(plan.teamRunId)
    },
    configuredEntry: (definition) =>
      definition.kind === 'agent' && definition.id === root.config.agentDefinitionId ? rootRunId : null,
    focus: (agentRunId) => { ensureAgentRunScope(rootRunId).focusedRunId = agentRunId === rootRunId ? null : agentRunId },
    refresh: () => history.refreshRunNavigationTopology('run-reconcile'),
  }
}
