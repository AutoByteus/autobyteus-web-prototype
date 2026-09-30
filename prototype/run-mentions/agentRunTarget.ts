/**
 * Workspace target for a standalone Agent run that has (or is about to get) task Agents or
 * task Teams (cross-scope-agent-mentions). It swaps the center conversation to the focused
 * child, routes a send to the local run, and supplies the Team tab's messages once a child exists.
 */
import type { AgentContext } from '~/types/agent/AgentContext'
import type { ActiveAgentWorkspaceTarget } from '~/types/workspace/activeAgentWorkspaceTarget'
import type {
  CollaborationMessageMemberIdentity,
  CollaborationMessagePerspectiveRow,
  CollaborationMessagesContextView,
} from '~/types/workspace/collaborationMessagesContextView'
import { parseAgentTeamAddress } from '~/types/agent/AgentTeamAddress'
import { DRAFT_RUN_ID_PREFIX } from '~/utils/runTreeProjectionConstants'
import { agentRunScope, draftMentionKeys, standaloneAgentAddress, type AgentRunScope } from './runMentionState'

const nameAt = (address: string): string => address.split('/').filter(Boolean).at(-1) ?? address

const messagesView = (scope: AgentRunScope, root: AgentContext, focusedRunId: string): CollaborationMessagesContextView => {
  const rootRunId = scope.rootRunId
  const addressOf = (agentRunId: string): string => agentRunId === rootRunId
    ? standaloneAgentAddress(root.config.agentDefinitionName)
    : scope.children.get(agentRunId)?.address ?? `/${agentRunId}`
  const identity = (agentRunId: string): CollaborationMessageMemberIdentity => {
    const address = parseAgentTeamAddress(addressOf(agentRunId))
    return agentRunId === rootRunId
      ? Object.freeze({ address, label: root.config.agentDefinitionName || nameAt(address), kind: 'configured' })
      : Object.freeze({ address, label: nameAt(address), kind: 'delegated', hostRunId: rootRunId, executionRunId: agentRunId })
  }
  return Object.freeze({
    rootKind: 'agent_team',
    rootRunId,
    focusedAgentRunId: focusedRunId,
    focusedMemberAddress: parseAgentTeamAddress(addressOf(focusedRunId)),
    memberIdentityByAgentRunId: () => Object.freeze(Object.fromEntries(
      [rootRunId, ...scope.children.keys()].map((agentRunId) => [agentRunId, identity(agentRunId)]))),
    listMessages: () => Object.freeze(scope.messages.flatMap((message): CollaborationMessagePerspectiveRow[] => {
      const sent = message.senderAgentRunId === focusedRunId
      if (!sent && message.receiverAgentRunId !== focusedRunId) return []
      const counterpartAgentRunId = sent ? message.receiverAgentRunId : message.senderAgentRunId
      return [Object.freeze({
        messageId: message.messageId, senderAgentRunId: message.senderAgentRunId, receiverAgentRunId: message.receiverAgentRunId,
        content: message.content, messageType: 'direct_message', createdAt: message.createdAt, referenceFiles: Object.freeze([]),
        direction: sent ? 'sent' : 'received', counterpartAgentRunId, counterpart: identity(counterpartAgentRunId),
      })]
    }).sort((left, right) => right.createdAt.localeCompare(left.createdAt) || left.messageId.localeCompare(right.messageId))),
    referenceContentPath: () => '',
  })
}

/**
 * Returns the target for the selected standalone Agent run, or null to keep the product's own
 * target (launch drafts, and runs the local run does not drive).
 */
export const resolveAgentRunTarget = (
  root: AgentContext,
  productInteraction: { send(): Promise<void>; interrupt(): Promise<void>; decideTool(invocationId: string, approved: boolean, reason: string | null): Promise<void> },
): ActiveAgentWorkspaceTarget | null => {
  const rootRunId = root.state.runId
  if (rootRunId.startsWith(DRAFT_RUN_ID_PREFIX)) return null
  const scope = agentRunScope(rootRunId)
  const child = scope?.focusedRunId ? scope.children.get(scope.focusedRunId) ?? null : null
  const context = child?.context ?? root
  const focusedRunId = context.state.runId
  return Object.freeze({
    kind: 'standalone_agent', access: 'live', context,
    interaction: Object.freeze({
      send: async () => {
        // A plain message in a run without children keeps the product's own send.
        const local = window.__AUTOBYTEUS_PROTOTYPE_AGENT_RUN_SEND__
        const usesLocalRun = Boolean(agentRunScope(rootRunId)) || draftMentionKeys(focusedRunId).length > 0
        if (local && usesLocalRun) await local(context.requirement)
        else await productInteraction.send()
      },
      interrupt: productInteraction.interrupt,
      decideTool: productInteraction.decideTool,
    }),
    browse: Object.freeze({ kind: 'run', runId: focusedRunId }),
    ...(scope && scope.children.size > 0 ? { collaborationMessages: messagesView(scope, root, focusedRunId) } : {}),
  }) as ActiveAgentWorkspaceTarget
}
