import { projectAgentOrgReference } from '~/services/agentOrgExecution/agentOrgReferenceProjection'
import { parseAgentTeamAddress } from '~/types/agent/AgentTeamAddress'
import type {
  CollaborationMessageMemberIdentity,
  CollaborationMessagePerspectiveRow,
  CollaborationMessagesContextView,
} from '~/types/workspace/collaborationMessagesContextView'
import { participantMessagesOf, mobileRunNode } from '~/prototype/mobile-runs/mobileRunsFixture'

/**
 * Stand-in for the node's stored participant messages (the product loads them with `collaborationParticipantMessages` when
 * the Messages screen shows them): the focused member's rows of the invented world, newest first, seen from that member.
 * Other runs keep the view they had.
 */
export const withMobileMessages = (view: CollaborationMessagesContextView): CollaborationMessagesContextView => {
  const world = participantMessagesOf(view.focusedAgentRunId)
  if (!world.messages.length) return { ...view, loadMessages: () => undefined, messagesStatus: () => ({ state: 'loaded', error: null }) }
  const identityOf = (agentRunId: string): CollaborationMessageMemberIdentity | null => {
    const node = mobileRunNode(agentRunId)
    return node ? Object.freeze({ kind: 'configured' as const, address: parseAgentTeamAddress(`/${node.name}`), label: node.name.replace(/[_-]+/g, ' ') }) : null
  }
  const rows: readonly CollaborationMessagePerspectiveRow[] = world.messages.flatMap((message): CollaborationMessagePerspectiveRow[] => {
    const sent = message.senderAgentRunId === view.focusedAgentRunId
    const counterpartAgentRunId = sent ? message.receiverAgentRunId : message.senderAgentRunId
    const counterpart = identityOf(counterpartAgentRunId)
    if (!counterpart) return []
    return [Object.freeze({
      messageId: message.messageId, senderAgentRunId: message.senderAgentRunId, receiverAgentRunId: message.receiverAgentRunId,
      content: message.content, messageType: message.messageType, createdAt: message.createdAt,
      referenceFiles: Object.freeze((message.referenceFiles as string[]).map((filePath) => projectAgentOrgReference(message.messageId, filePath, message.createdAt))),
      direction: sent ? 'sent' as const : 'received' as const, counterpartAgentRunId, counterpart,
    })]
  }).sort((left, right) => right.createdAt.localeCompare(left.createdAt) || left.messageId.localeCompare(right.messageId))
  return { ...view, listMessages: () => rows, loadMessages: () => undefined, messagesStatus: () => ({ state: 'loaded', error: null }) }
}
