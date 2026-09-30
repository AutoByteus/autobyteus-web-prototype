/**
 * Scope-independent script for the `cross-scope-agent-mentions` prototype.
 *
 * A message sent in a live run has no backend here. The player runs one
 * deterministic script against a `RunDriver`, which applies each step through
 * the client path of its run kind (Team run, Org run or standalone Agent run),
 * so conversations, the run tree and the Team/Org tab are rendered by the
 * product's own presentation code. No model, runtime or network is involved.
 */
import type { AgentPresentationMessage } from '@autobyteus/agent-presentation-contracts'
import type { AgentContext } from '~/types/agent/AgentContext'
import { AgentContext as AgentContextClass } from '~/types/agent/AgentContext'
import { AgentRunState } from '~/types/agent/AgentRunState'
import { AgentStatus } from '~/types/agent/AgentStatus'
import type { AgentRunConfig, AgentRuntimeKind, SkillAccessMode } from '~/types/agent/AgentRunConfig'
import type { WorkspaceMetadata } from '~/types/workspace/WorkspaceMetadata'
import { initializeRuntimeStatusState } from '~/services/runStatus/agentRuntimeStatusState'
import { listRunMentionDefinitions, textHasMention } from '~/composables/agentInput/useRunMentions'
import { runMentionScript } from './runMentionFixtures'
import {
  addedCollaborators,
  clearDraftMentions,
  draftMentionKeys,
  pushRunMentionNotice,
  runMentionRoute,
  runMentionState,
  type AddedCollaborator,
  type RunMentionDefinition,
} from './runMentionState'

/** One Agent presentation event without its run correlation (the driver adds that). */
export type PresentationEvent = AgentPresentationMessage

export interface CollaboratorPlan {
  address: string
  /** Task Team run ID, or the task Agent's run ID for a single Agent. */
  base: string
  teamRunId: string | null
  agents: ReadonlyArray<{ agentRunId: string; address: string; agentDefinitionId: string; name: string }>
}

export interface RunDriver {
  readonly rootRunId: string
  readonly focusedAgentRunId: string
  readonly focusedContext: AgentContext
  addressOf(agentRunId: string): string
  /** Marks the run as active (a stored run is resumed by sending a message). */
  activate(): void
  present(agentRunId: string, event: PresentationEvent): void
  /** Records one inter-agent message for the Team/Org tab. */
  communication(senderAgentRunId: string, receiverAgentRunId: string, content: string, messageId: string): void
  /** Starts the planned task Agent or task Team under the run. */
  startTask(plan: CollaboratorPlan, definition: RunMentionDefinition, delegatorAgentRunId: string | null): void
  /** The AgentRun of a configured member that already runs this definition, if any. */
  configuredEntry(definition: RunMentionDefinition): string | null
  focus(agentRunId: string): void
  /** Re-projects the run tree after a structural or status change. */
  refresh(): void
}

let serial = 0
export const nextId = (prefix: string): string => `${prefix}-${Date.now().toString(36)}-${(serial += 1)}`
const wait = (ms: number): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, ms))
const slug = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const nameAt = (address: string): string => address.split('/').filter(Boolean).at(-1) ?? address

export const planCollaborator = (rootRunId: string, definition: RunMentionDefinition): CollaboratorPlan => {
  const address = `/${definition.name.toLowerCase()}`
  const base = `${rootRunId}-added-${slug(definition.name)}`
  return definition.kind === 'team'
    ? {
        address, base, teamRunId: base,
        agents: definition.members.map((member) => ({
          agentRunId: `${base}-${slug(member.name)}`, address: `${address}/${member.name}`,
          agentDefinitionId: member.agentDefinitionId, name: member.name,
        })),
      }
    : { address, base, teamRunId: null, agents: [{ agentRunId: base, address, agentDefinitionId: definition.id, name: definition.name.toLowerCase() }] }
}

/** A conversation context for a collaborator; it uses the host run's runtime, model and workspace (REQ-004). */
export const createCollaboratorContext = (input: {
  agentRunId: string
  address: string
  agentDefinitionId: string
  runtimeKind: string
  llmModelIdentifier: string
  llmConfig: Record<string, unknown> | null
  autoExecuteTools: boolean
  skillAccessMode: string
  workspaceMetadata: WorkspaceMetadata | null
}): AgentContext => {
  const now = new Date().toISOString()
  const config: AgentRunConfig = {
    agentDefinitionId: input.agentDefinitionId,
    agentDefinitionName: nameAt(input.address),
    llmModelIdentifier: input.llmModelIdentifier,
    runtimeKind: input.runtimeKind as AgentRuntimeKind,
    workspaceId: input.workspaceMetadata?.workspaceId ?? null,
    workspaceMetadata: input.workspaceMetadata,
    autoExecuteTools: input.autoExecuteTools,
    skillAccessMode: input.skillAccessMode as SkillAccessMode,
    llmConfig: input.llmConfig ? structuredClone(input.llmConfig) : null,
    isLocked: true,
  }
  const state = new AgentRunState(input.agentRunId, {
    id: input.agentRunId, messages: [], createdAt: now, updatedAt: now,
    agentDefinitionId: input.agentDefinitionId, agentName: nameAt(input.address),
    llmModelIdentifier: input.llmModelIdentifier,
  })
  initializeRuntimeStatusState(state, AgentStatus.Offline)
  return new AgentContextClass(config, state)
}

const createRun = (driver: RunDriver) => {
  const status = (agentRunId: string, value: 'initializing' | 'idle' | 'running'): void => {
    driver.present(agentRunId, { type: 'AGENT_STATUS', payload: { status: value, trigger: null, tool_name: null, error_message: null, error_details: null } })
    driver.refresh()
  }
  const input = (agentRunId: string, content: string, origin: 'user_message' | 'inter_agent_delivery', senderAgentRunId: string | null, parentMessageId: string | null): void => {
    const messageId = nextId('input')
    driver.present(agentRunId, { type: 'MEMBER_INPUT_MESSAGE', payload: {
      message_id: messageId, dedupe_key: messageId, content, input_origin: origin, received_at: new Date().toISOString(),
      context_file_paths: [], sender_agent_run_id: senderAgentRunId, parent_communication_message_id: parentMessageId,
    } })
  }
  const text = (agentRunId: string, turnId: string, content: string): void => {
    const segmentId = nextId('segment')
    driver.present(agentRunId, { type: 'SEGMENT_START', payload: { segment_id: segmentId, turn_id: turnId, segment_type: 'text', metadata: null } })
    driver.present(agentRunId, { type: 'SEGMENT_CONTENT', payload: { segment_id: segmentId, turn_id: turnId, segment_type: 'text', delta: content } })
    driver.present(agentRunId, { type: 'SEGMENT_END', payload: { segment_id: segmentId, turn_id: turnId, metadata: null, interrupted: false, reason: null, failed: false, error: null } })
  }
  const toolStart = (agentRunId: string, turnId: string, toolName: string, args: Record<string, string>): string => {
    const invocationId = nextId('tool')
    const metadata = { tool_name: toolName, arguments: args }
    driver.present(agentRunId, { type: 'SEGMENT_START', payload: { segment_id: invocationId, turn_id: turnId, segment_type: 'tool_call', metadata } })
    driver.present(agentRunId, { type: 'SEGMENT_END', payload: { segment_id: invocationId, turn_id: turnId, metadata, interrupted: false, reason: null, failed: false, error: null } })
    driver.present(agentRunId, { type: 'TOOL_EXECUTION_STARTED', payload: { invocation_id: invocationId, tool_name: toolName, turn_id: turnId, arguments: args } })
    return invocationId
  }
  const toolEnd = (agentRunId: string, turnId: string, invocationId: string, toolName: string, args: Record<string, string>, result: Record<string, string | boolean | null> = { accepted: true }): void => {
    driver.present(agentRunId, { type: 'TOOL_EXECUTION_SUCCEEDED', payload: { invocation_id: invocationId, tool_name: toolName, turn_id: turnId, arguments: args, result } })
  }
  /**
   * The delegated work packet as the product delivers it today: a system task notification in
   * the child's conversation (never a Team/Org tab message), with the delegator's address and run ID.
   */
  const taskNotification = (agentRunId: string, delegatorAgentRunId: string, description: string): void => {
    driver.present(agentRunId, { type: 'SYSTEM_TASK_NOTIFICATION', payload: {
      sender: { kind: 'system' },
      content: [
        `Task delegator address: ${driver.addressOf(delegatorAgentRunId)}`,
        `Task delegator AgentRun ID: ${delegatorAgentRunId}`,
        '', 'Description:', description,
      ].join('\n'),
    } })
  }
  /** A `send_message_to` delivery: one Team/Org tab message plus the recipient's input. */
  const message = (senderAgentRunId: string, receiverAgentRunId: string, content: string): void => {
    const messageId = nextId('message')
    driver.communication(senderAgentRunId, receiverAgentRunId, content, messageId)
    input(receiverAgentRunId, content, 'inter_agent_delivery', senderAgentRunId, messageId)
  }
  const turnStart = (agentRunId: string): string => {
    const turnId = nextId('turn')
    driver.present(agentRunId, { type: 'TURN_STARTED', payload: { turn_id: turnId } })
    return turnId
  }
  const turnEnd = (agentRunId: string, turnId: string): void => {
    driver.present(agentRunId, { type: 'TURN_COMPLETED', payload: { turn_id: turnId, reason: null } })
    status(agentRunId, 'idle')
  }
  const addCollaborator = (definition: RunMentionDefinition, delegatorAgentRunId: string | null): AddedCollaborator => {
    const plan = planCollaborator(driver.rootRunId, definition)
    const record: AddedCollaborator = {
      definitionKey: definition.key, kind: definition.kind, name: definition.name, address: plan.address,
      teamRunId: plan.teamRunId, agentRunIds: plan.agents.map((agent) => agent.agentRunId),
      entryAgentRunId: plan.agents[0]!.agentRunId,
      addedByName: delegatorAgentRunId ? nameAt(driver.addressOf(delegatorAgentRunId)) : null,
      addedAt: new Date().toISOString(),
    }
    driver.startTask(plan, definition, delegatorAgentRunId)
    runMentionState.addedByRoot[driver.rootRunId] = [...addedCollaborators(driver.rootRunId), record]
    driver.refresh()
    return record
  }
  /** The AgentRun that receives a message for a definition already in this run. */
  const existingEntry = (definition: RunMentionDefinition): string | null =>
    addedCollaborators(driver.rootRunId).find((entry) => entry.definitionKey === definition.key)?.entryAgentRunId
    ?? driver.configuredEntry(definition)
  return { driver, status, input, text, toolStart, toolEnd, taskNotification, message, turnStart, turnEnd, addCollaborator, existingEntry }
}

type Run = ReturnType<typeof createRun>

/** The collaborator's entry agent acknowledges, works briefly, and reports back. */
const playCollaboratorReply = async (run: Run, entryAgentRunId: string, replyToAgentRunId: string | null, firstContact: boolean): Promise<void> => {
  await wait(500)
  run.status(entryAgentRunId, 'running')
  const turnId = run.turnStart(entryAgentRunId)
  await wait(700)
  run.text(entryAgentRunId, turnId, firstContact ? runMentionScript.collaboratorAck : runMentionScript.collaboratorReportShort)
  if (replyToAgentRunId && firstContact) {
    await wait(1100)
    const args = { target_agent_run_id: replyToAgentRunId, content: runMentionScript.collaboratorReport(nameAt(run.driver.addressOf(replyToAgentRunId))) }
    const invocationId = run.toolStart(entryAgentRunId, turnId, 'send_message_to', args)
    await wait(500)
    run.toolEnd(entryAgentRunId, turnId, invocationId, 'send_message_to', args)
    run.message(entryAgentRunId, replyToAgentRunId, args.content)
  }
  run.turnEnd(entryAgentRunId, turnId)
}

const playRelay = async (run: Run, content: string, mentions: readonly RunMentionDefinition[]): Promise<void> => {
  const focused = run.driver.focusedAgentRunId
  run.input(focused, content, 'user_message', null, null)
  await wait(350)
  run.status(focused, 'running')
  const turnId = run.turnStart(focused)
  if (!mentions.length) {
    await wait(700)
    run.text(focused, turnId, runMentionScript.plainReply)
    run.turnEnd(focused, turnId)
    return
  }
  const replies: Array<Promise<void>> = []
  for (const definition of mentions) {
    const existing = run.existingEntry(definition)
    if (existing) {
      // SC-005: already in this run. Message the existing member; never start a second copy.
      await wait(700)
      const args = { target_agent_run_id: existing, content: runMentionScript.brief(content) }
      const invocationId = run.toolStart(focused, turnId, 'send_message_to', args)
      await wait(600)
      run.toolEnd(focused, turnId, invocationId, 'send_message_to', args)
      if (existing !== focused) run.message(focused, existing, args.content)
      run.text(focused, turnId, runMentionScript.relayExisting(definition.name, nameAt(run.driver.addressOf(existing))))
      if (existing !== focused) replies.push(playCollaboratorReply(run, existing, null, false))
      continue
    }
    await wait(700)
    run.text(focused, turnId, runMentionScript.relayPlan(definition.name))
    await wait(600)
    const brief = runMentionScript.brief(content)
    const args = { recipient_address: `/${definition.name.toLowerCase()}`, description: brief }
    const invocationId = run.toolStart(focused, turnId, 'delegate_task', args)
    await wait(1200)
    if (definition.unrunnableReason) {
      // SC-006: visible failure; the run tree is unchanged. As in the product today,
      // `delegate_task` returns normally with no run ID and the reason.
      run.toolEnd(focused, turnId, invocationId, 'delegate_task', args,
        { target_agent_run_id: null, message: `${definition.name} cannot run in this run. ${definition.unrunnableReason}` })
      run.text(focused, turnId, runMentionScript.relayFailed(definition.name, definition.unrunnableReason))
      pushRunMentionNotice({
        id: nextId('notice'), rootRunId: run.driver.rootRunId, agentRunId: focused, kind: 'failed',
        definitionKey: definition.key, definitionName: definition.name, detail: definition.unrunnableReason,
      })
      continue
    }
    const record = run.addCollaborator(definition, focused)
    run.status(record.entryAgentRunId, 'initializing')
    run.toolEnd(focused, turnId, invocationId, 'delegate_task', args, { target_agent_run_id: record.entryAgentRunId })
    run.taskNotification(record.entryAgentRunId, focused, brief)
    await wait(500)
    run.text(focused, turnId, runMentionScript.relayDone(definition.name,
      definition.kind === 'team' ? nameAt(run.driver.addressOf(record.entryAgentRunId)) : definition.name))
    replies.push(playCollaboratorReply(run, record.entryAgentRunId, focused, true))
  }
  run.turnEnd(focused, turnId)
  await Promise.all(replies)
}

/** Review-only comparison (Q1 option a): the message goes straight to the collaborator. */
const playDirect = async (run: Run, content: string, mentions: readonly RunMentionDefinition[]): Promise<void> => {
  for (const definition of mentions) {
    if (definition.unrunnableReason) {
      pushRunMentionNotice({
        id: nextId('notice'), rootRunId: run.driver.rootRunId, agentRunId: run.driver.focusedAgentRunId, kind: 'failed',
        definitionKey: definition.key, definitionName: definition.name, detail: definition.unrunnableReason,
      })
      continue
    }
    const existing = run.existingEntry(definition)
    const entryAgentRunId = existing ?? run.addCollaborator(definition, null).entryAgentRunId
    if (!existing) run.status(entryAgentRunId, 'initializing')
    run.input(entryAgentRunId, content, 'user_message', null, null)
    // The message lives in the collaborator's conversation, so the view follows it there.
    run.driver.focus(entryAgentRunId)
    run.driver.refresh()
    await playCollaboratorReply(run, entryAgentRunId, null, true)
  }
}

/**
 * Answers a message the product's own send already delivered (the first message of a chat),
 * so the run settles at Idle and the user can continue the conversation.
 */
export const playReplyOnly = async (driver: RunDriver): Promise<void> => {
  driver.activate()
  const run = createRun(driver)
  const focused = driver.focusedAgentRunId
  await wait(350)
  run.status(focused, 'running')
  const turnId = run.turnStart(focused)
  await wait(700)
  run.text(focused, turnId, runMentionScript.plainReply)
  run.turnEnd(focused, turnId)
}

/**
 * Plays one sent message. Mentions are the definitions chosen from `@` in the
 * focused composer that are still present in the text.
 */
export const playRunSend = async (driver: RunDriver, content: string): Promise<void> => {
  const focused = driver.focusedAgentRunId
  const context = driver.focusedContext
  const chosen = draftMentionKeys(focused)
  const mentions = listRunMentionDefinitions()
    .filter((definition) => chosen.includes(definition.key) && textHasMention(content, definition.name))
  context.requirement = ''
  context.contextFilePaths = []
  clearDraftMentions(focused)
  // A new message replaces the previous outcome notices of this conversation.
  runMentionState.noticesByRoot[driver.rootRunId] = (runMentionState.noticesByRoot[driver.rootRunId] ?? [])
    .filter((notice) => notice.agentRunId !== focused)
  driver.activate()
  const run = createRun(driver)
  if (runMentionRoute() === 'direct' && mentions.length) await playDirect(run, content, mentions)
  else await playRelay(run, content, mentions)
}
