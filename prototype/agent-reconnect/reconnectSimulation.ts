/**
 * agent-definition-reconnect-ui (design): what the server does, scripted beneath the UI.
 *
 * - Sending to a run whose agent is missing: the run cannot restore. The user's message is shown,
 *   then the AGENT_DEFINITION_MISSING error, and the run's status is Error (as in the product).
 * - Reconnect: the run record's agent reference changes; nothing else (same run, address, history,
 *   session). The result lists the affected runs and, per run, whether the new instructions apply
 *   now or only from a new session (Antigravity / Grok keep a resumed session's instructions).
 * - After a reconnect, a message continues the same conversation with a scripted reply.
 *
 * Optional hidden seed for the server's rejections (no visible control), consumed by the next
 * Reconnect:
 *   localStorage.setItem('autobyteus.design.agentReconnect.failNext',
 *     'AGENT_RUN_ACTIVE' | 'AGENT_DEFINITION_REBIND_PENDING' | 'RUN_ACTIVE' | 'DEFINITION_NOT_FOUND' | 'ERROR')
 */
import { useAgentContextsStore } from '~/stores/agentContextsStore'
import { useAgentRunStore } from '~/stores/agentRunStore'
import { useAgentTeamRunStore } from '~/stores/agentTeamRunStore'
import { useActiveContextStore } from '~/stores/activeContextStore'
import { AgentStatus } from '~/types/agent/AgentStatus'
import { buildConversationFromProjection } from '~/services/runHydration/runProjectionConversation'
import {
  KEEPS_SESSION_INSTRUCTIONS, OWNED_OUTSIDE_CATALOG, SUBJECTS, addEntries, continuedReply, ownerOf, recordReconnect,
  reconnectedTo, subjectFor, transcriptOf, type ReconnectSubject,
} from './agentReconnectFixture'

export const AGENT_DEFINITION_MISSING = 'AGENT_DEFINITION_MISSING'
const FAIL_KEY = 'autobyteus.design.agentReconnect.failNext'

export type ReconnectRejection = 'AGENT_RUN_ACTIVE' | 'AGENT_DEFINITION_REBIND_PENDING' | 'RUN_ACTIVE' | 'DEFINITION_NOT_FOUND' | 'ERROR'
export type ReconnectResult =
  | { success: true; affectedRuns: Array<{ agentRunId: string; runtimeKind: string; instructionsTakeEffect: 'NEXT_MESSAGE' | 'NEW_SESSION' }> }
  | { success: false; code: ReconnectRejection; message: string }

const REJECTIONS: ReadonlySet<string> = new Set(['AGENT_RUN_ACTIVE', 'AGENT_DEFINITION_REBIND_PENDING', 'RUN_ACTIVE', 'DEFINITION_NOT_FOUND', 'ERROR'])

/** L1: the exact `agentDefinition(id)` lookup — finds agents that are not listed in the catalog. */
export const agentDefinitionLookup = (definitionId: string): boolean => OWNED_OUTSIDE_CATALOG.has(definitionId)

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * The server's reconnect: only the agent reference of the record that owns it changes (the run, or
 * the placement a sourceless copy inherits from). Every copy inheriting it is affected too (L3).
 */
export const reconnectAgentRunOnServer = async (agentRunId: string, definition: { id: string; name: string }): Promise<ReconnectResult> => {
  await pause(450)
  const subject = subjectFor(agentRunId)
  if (!subject) return { success: false, code: 'ERROR', message: 'Run not found.' }
  const fail = localStorage.getItem(FAIL_KEY)
  if (fail && REJECTIONS.has(fail)) {
    localStorage.removeItem(FAIL_KEY)
    return { success: false, code: fail as ReconnectRejection, message: fail === 'ERROR' ? 'The run record could not be saved.' : fail }
  }
  const owner = ownerOf(subject)
  recordReconnect(owner.agentRunId, definition)
  const affected = SUBJECTS.filter((entry) => entry === owner || entry.inheritsFrom === owner.agentRunId)
  return {
    success: true,
    affectedRuns: affected.map((entry) => ({
      agentRunId: entry.agentRunId,
      runtimeKind: entry.runtimeKind,
      instructionsTakeEffect: KEEPS_SESSION_INSTRUCTIONS.has(entry.runtimeKind) ? 'NEW_SESSION' as const : 'NEXT_MESSAGE' as const,
    })),
  }
}

const now = () => Date.now() / 1000

/** The conversation as stored: projection entries, with each error after the message it answered. */
const render = (subject: ReconnectSubject, context: any) => {
  const entries = transcriptOf(subject.agentRunId)
  const conversation = buildConversationFromProjection(subject.agentRunId, entries.filter((entry) => entry.kind !== 'error') as any, {
    agentDefinitionId: context.config.agentDefinitionId,
    agentName: context.config.agentDefinitionName || 'Agent',
    llmModelIdentifier: context.config.llmModelIdentifier,
  }) as any
  let users = 0
  for (const entry of entries) {
    if (entry.kind === 'message' && entry.role === 'user') users += 1
    if (entry.kind !== 'error') continue
    let seen = 0
    const index = conversation.messages.findIndex((message: any) => message.type === 'user' && ++seen === users)
    conversation.messages.splice(index + 1, 0, {
      type: 'ai', text: 'Error Occurred', timestamp: new Date(Number(entry.ts) * 1000), isComplete: true,
      segments: [{ type: 'error', code: entry.code, message: entry.message }],
    })
  }
  context.state.conversation = conversation
}

/** One message to one of the example runs: the error while its agent is missing, a reply after. */
const deliver = async (subject: ReconnectSubject, context: any, text: string) => {
  addEntries(subject.agentRunId, [{ kind: 'message', role: 'user', content: text, ts: now() }])
  render(subject, context)
  if (!reconnectedTo(subject.agentRunId)) {
    // The run cannot restore: no runtime starts; the error stays in the conversation (DEC-013).
    await pause(350)
    addEntries(subject.agentRunId, [{
      kind: 'error', code: AGENT_DEFINITION_MISSING,
      message: `Agent definition '${subject.missingDefinitionId}' no longer exists.`, ts: now(),
    }])
    render(subject, context)
    context.state.currentStatus = AgentStatus.Error
    return
  }
  context.state.currentStatus = AgentStatus.Running
  await pause(1100)
  addEntries(subject.agentRunId, [{ kind: 'message', role: 'assistant', content: continuedReply(subject.agentRunId, text), ts: now() }])
  render(subject, context)
  context.state.currentStatus = AgentStatus.Idle
}

/** Renders an example run's stored conversation (including earlier errors) into its open context. */
export const renderExampleRun = (agentRunId: string, context: any) => {
  const subject = subjectFor(agentRunId)
  if (subject && context) render(subject, context)
}

export const installReconnectSimulation = (): void => {
  const agentRun = useAgentRunStore()
  const contexts = useAgentContextsStore()
  const teamRun = useAgentTeamRunStore()
  const active = useActiveContextStore()

  const standaloneSend = agentRun.sendUserInputAndSubscribe.bind(agentRun)
  agentRun.sendUserInputAndSubscribe = async (...args: any[]) => {
    const context = contexts.activeRun as any
    const subject = subjectFor(context?.state.runId)
    if (!subject) return (standaloneSend as any)(...args)
    const text = String(context.requirement || '').trim()
    if (!text) return
    context.requirement = ''
    context.contextFilePaths = []
    await deliver(subject, context, text)
  }

  const teamSend = (teamRun as any).sendMessageToFocusedMember?.bind(teamRun)
  ;(teamRun as any).sendMessageToFocusedMember = async (...args: any[]) => {
    const target = active.activeWorkspaceTarget as any
    const context = target?.context
    const subject = subjectFor(context?.state.runId)
    if (!subject) return teamSend?.(...args)
    const text = String(args[0] ?? context.requirement ?? '').trim()
    if (!text) return
    context.requirement = ''
    context.contextFilePaths = []
    await deliver(subject, context, text)
  }
}
