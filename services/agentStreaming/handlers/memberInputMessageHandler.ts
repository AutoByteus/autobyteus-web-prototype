import type { AgentContext } from '~/types/agent/AgentContext';
import type { MemberInputMessagePayload } from '../protocol/messageTypes';
import {
  buildUserMessageFromProjectionPayload,
  upsertUserMessageByIdentity,
} from './userMessageProjection';
import { handleInterAgentMessage } from './teamHandler';

export const handleMemberInputMessage = (
  payload: MemberInputMessagePayload,
  context: AgentContext,
) => {
  // Prototype (cross-scope-agent-mentions SR-008, user decision): a message from another agent
  // shows who sent it ("From <sender>:"), not as a message from the user.
  const senderAgentRunId = payload.sender_agent_run_id?.trim();
  if (payload.input_origin === 'inter_agent_delivery' && senderAgentRunId) {
    return handleInterAgentMessage({
      ...(payload.message_id ? { message_id: payload.message_id } : {}),
      sender_agent_id: senderAgentRunId,
      recipient_role_name: '',
      content: payload.content ?? '',
      message_type: 'direct_message',
    }, context);
  }
  return upsertUserMessageByIdentity({
    context,
    userMessage: buildUserMessageFromProjectionPayload(payload),
    retainExistingNonExecutableContextFiles: true,
  });
};
