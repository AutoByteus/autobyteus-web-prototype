/**
 * Scripted Team run for the `cross-scope-agent-mentions` ticket.
 *
 * Sending a message in a Team run has no backend in this prototype. This
 * simulator plays a deterministic run through the same client path the real
 * stream uses: it feeds Team stream messages into the mounted Team execution
 * view and applies the resulting effects, so the conversation, the run tree
 * and the Team tab are rendered by the product's own presentation code. No
 * model, runtime, persistence or network is involved.
 */
import { markRaw } from 'vue'
import type { TaskExecutionDto, TeamStreamServerMessage } from '@autobyteus/team-stream-contracts'
import { useAgentTeamContextsStore } from '~/stores/agentTeamContextsStore'
import { useRunHistoryStore } from '~/stores/runHistoryStore'
import { dispatchAgentStreamMessage } from '~/services/agentStreaming/agentStreamMessageProjector'
import { toAgentProjectionMessage } from '~/services/agentStreaming/teamStreamDtoAdapters'
import { collectConfiguredAgents, collectConfiguredTeams } from '~/services/teamExecution/teamExecutionTreeSelectors'
import { memberAddressBasename, type AgentTeamAddress } from '~/types/agent/AgentTeamAddress'
import type { AgentTeamContext } from '~/types/agent/AgentTeamContext'
import { listRunMentionDefinitions, textHasMention } from '~/composables/agentInput/useRunMentions'
import { runMentionScript } from './runMentionFixtures'
import {
  addedCollaborators,
  clearDraftMentions,
  draftMentionKeys,
  pushRunMentionNotice,
  resumedTeamRunIds,
  runMentionRoute,
  runMentionState,
  type AddedCollaborator,
  type RunMentionDefinition,
} from './runMentionState'

type StreamMessage = Exclude<TeamStreamServerMessage,
  { type: 'CONNECTED' | 'TEAM_RUN_LIFECYCLE' | 'TEAM_EXECUTION_VIEW_SNAPSHOT' | 'AGENT_COMMAND_ACK' }>
type Sequenced<T> = T extends { payload: infer P } ? Omit<T, 'payload'> & { payload: Omit<P, 'change_sequence'> } : never

let serial = 0
const nextId = (prefix: string): string => `${prefix}-${Date.now().toString(36)}-${(serial += 1)}`
const wait = (ms: number): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, ms))
const slug = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const createRun = (team: AgentTeamContext) => {
  const view = team.view
  const rootRunId = view.getRootTeamRunId()
  const history = useRunHistoryStore()

  const emit = (message: Sequenced<StreamMessage>): void => {
    const sequenced = {
      ...message,
      payload: { ...message.payload, change_sequence: view.getChangeSequence() + 1 },
    } as unknown as StreamMessage
    const result = view.applyMessage(sequenced)
    if (result.disposition === 'rejected') {
      console.warn(`Prototype run rejected '${message.type}' (${result.code}): ${result.message}`)
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

  const activate = (): void => {
    resumedTeamRunIds.add(rootRunId)
    if (view.setRootTeamActive(true).disposition !== 'applied') return
    history.applyRunNavigationEffect({ kind: 'team_run', teamRunId: rootRunId, isActive: true }, { kind: 'PRESENTATION' })
    history.refreshRunNavigationTopology('team-stream-lifecycle')
  }

  const status = (agentRunId: string, value: 'initializing' | 'idle' | 'running'): void => {
    emit({ type: 'AGENT_STATUS', payload: { agent_run_id: agentRunId, status: value, trigger: null, tool_name: null, error_message: null, error_details: null } })
    history.refreshRunNavigationTopology('team-stream-structure')
  }

  const input = (agentRunId: string, content: string, origin: 'user_message' | 'inter_agent_delivery', senderAgentRunId: string | null, parentMessageId: string | null): void => {
    const messageId = nextId('input')
    emit({ type: 'MEMBER_INPUT_MESSAGE', payload: {
      recipient_agent_run_id: agentRunId, message_id: messageId, dedupe_key: messageId, content,
      input_origin: origin, received_at: new Date().toISOString(), context_file_paths: [],
      sender_agent_run_id: senderAgentRunId, parent_communication_message_id: parentMessageId,
    } })
  }

  const text = (agentRunId: string, turnId: string, content: string): void => {
    const segmentId = nextId('segment')
    emit({ type: 'SEGMENT_START', payload: { agent_run_id: agentRunId, segment_id: segmentId, turn_id: turnId, segment_type: 'text', metadata: null } })
    emit({ type: 'SEGMENT_CONTENT', payload: { agent_run_id: agentRunId, segment_id: segmentId, turn_id: turnId, segment_type: 'text', delta: content } })
    emit({ type: 'SEGMENT_END', payload: { agent_run_id: agentRunId, segment_id: segmentId, turn_id: turnId, metadata: null, interrupted: false, reason: null, failed: false, error: null } })
  }

  const toolStart = (agentRunId: string, turnId: string, toolName: string, args: Record<string, string>): string => {
    const invocationId = nextId('tool')
    const metadata = { tool_name: toolName, arguments: args }
    emit({ type: 'SEGMENT_START', payload: { agent_run_id: agentRunId, segment_id: invocationId, turn_id: turnId, segment_type: 'tool_call', metadata } })
    emit({ type: 'SEGMENT_END', payload: { agent_run_id: agentRunId, segment_id: invocationId, turn_id: turnId, metadata, interrupted: false, reason: null, failed: false, error: null } })
    emit({ type: 'TOOL_EXECUTION_STARTED', payload: { agent_run_id: agentRunId, invocation_id: invocationId, tool_name: toolName, turn_id: turnId, arguments: args } })
    return invocationId
  }

  const toolEnd = (agentRunId: string, turnId: string, invocationId: string, toolName: string, args: Record<string, string>, error: string | null): void => {
    if (error) emit({ type: 'TOOL_EXECUTION_FAILED', payload: { agent_run_id: agentRunId, invocation_id: invocationId, tool_name: toolName, turn_id: turnId, arguments: args, error } })
    else emit({ type: 'TOOL_EXECUTION_SUCCEEDED', payload: { agent_run_id: agentRunId, invocation_id: invocationId, tool_name: toolName, turn_id: turnId, arguments: args, result: { accepted: true } } })
  }

  const teamMessage = (senderAgentRunId: string, receiverAgentRunId: string, content: string): string => {
    const messageId = nextId('team-message')
    emit({ type: 'TEAM_COMMUNICATION_MESSAGE', payload: { message: {
      message_id: messageId, sender_agent_run_id: senderAgentRunId, receiver_agent_run_id: receiverAgentRunId,
      content, message_type: 'direct_message', reference_files: [], created_at: new Date().toISOString(),
    } } })
    input(receiverAgentRunId, content, 'inter_agent_delivery', senderAgentRunId, messageId)
    return messageId
  }

  const turnStart = (agentRunId: string): string => {
    const turnId = nextId('turn')
    emit({ type: 'TURN_STARTED', payload: { agent_run_id: agentRunId, turn_id: turnId } })
    return turnId
  }
  const turnEnd = (agentRunId: string, turnId: string): void => {
    emit({ type: 'TURN_COMPLETED', payload: { agent_run_id: agentRunId, turn_id: turnId, reason: null } })
    status(agentRunId, 'idle')
  }

  /** Adds the definition to this run as a fresh child and returns its record. */
  const addCollaborator = (definition: RunMentionDefinition, delegatorAgentRunId: string | null): AddedCollaborator => {
    const tree = view.getExecutionTree()
    const address = `/${definition.name.toLowerCase()}`
    const base = `${rootRunId}-added-${slug(definition.name)}`
    const launch = structuredClone(tree.root_team.default_launch_configuration)
    const startedAt = new Date().toISOString()
    let execution: TaskExecutionDto
    let agents: Array<{ agentRunId: string; address: string; agentDefinitionId: string }>
    if (definition.kind === 'team') {
      agents = definition.members.map((member) => ({
        agentRunId: `${base}-${slug(member.name)}`, address: `${address}/${member.name}`, agentDefinitionId: member.agentDefinitionId,
      }))
      execution = {
        kind: 'task_team', address, team_run_id: base, task_executions: [],
        members: agents.map((agent) => ({ kind: 'task_team_agent' as const, address: agent.address, agent_run_id: agent.agentRunId, platform_agent_run_id: null })),
        delegator_agent_run_id: delegatorAgentRunId, started_at: startedAt,
      }
    } else {
      agents = [{ agentRunId: base, address, agentDefinitionId: definition.id }]
      execution = { kind: 'task_agent', address, agent_run_id: base, platform_agent_run_id: null, delegator_agent_run_id: delegatorAgentRunId, started_at: startedAt }
    }
    // The collaborator inherits the host run's runtime, model and workspace (REQ-004).
    for (const agent of agents) {
      // Raw (non-reactive) so the execution view can clone it.
      runMentionState.agentSourceByRunId[agent.agentRunId] = markRaw({
        address: agent.address, agentDefinitionId: agent.agentDefinitionId, launchConfiguration: launch,
      })
    }
    const record: AddedCollaborator = {
      definitionKey: definition.key, kind: definition.kind, name: definition.name, address,
      teamRunId: definition.kind === 'team' ? base : null,
      agentRunIds: agents.map((agent) => agent.agentRunId), entryAgentRunId: agents[0]!.agentRunId,
      addedByName: delegatorAgentRunId ? memberAddressBasename(view.getMemberAddress(delegatorAgentRunId) as AgentTeamAddress) : null,
      addedAt: startedAt,
    }
    runMentionState.addedByRoot[rootRunId] = [...addedCollaborators(rootRunId), record]
    emit({ type: 'TASK_EXECUTION_STARTED', payload: { parent_team_run_id: rootRunId, execution } })
    return record
  }

  /** The AgentRun that receives a message for a definition already in this run. */
  const existingEntry = (definition: RunMentionDefinition): { agentRunId: string; name: string } | null => {
    const added = addedCollaborators(rootRunId).find((entry) => entry.definitionKey === definition.key)
    if (added) return { agentRunId: added.entryAgentRunId, name: memberAddressBasename(view.getMemberAddress(added.entryAgentRunId) as AgentTeamAddress) }
    const tree = view.getExecutionTree()
    const agents = collectConfiguredAgents(tree)
    const agent = definition.kind === 'agent'
      ? agents.find((entry) => entry.agent_definition_id === definition.id)
      : agents.find((entry) => entry.address === (definition.id === tree.root_team.team_definition_id
        ? tree.root_team.coordinator_address
        : collectConfiguredTeams(tree).find((team) => team.team_definition_id === definition.id)?.coordinator_address))
    return agent ? { agentRunId: agent.agent_run_id, name: memberAddressBasename(agent.address as AgentTeamAddress) } : null
  }

  return { view, rootRunId, activate, status, input, text, toolStart, toolEnd, teamMessage, turnStart, turnEnd, addCollaborator, existingEntry }
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
    const replyToName = memberAddressBasename(run.view.getMemberAddress(replyToAgentRunId) as AgentTeamAddress)
    const args = { recipient_address: run.view.getMemberAddress(replyToAgentRunId) as string, content: runMentionScript.collaboratorReport(replyToName) }
    const invocationId = run.toolStart(entryAgentRunId, turnId, 'send_message_to', args)
    await wait(500)
    run.toolEnd(entryAgentRunId, turnId, invocationId, 'send_message_to', args, null)
    run.teamMessage(entryAgentRunId, replyToAgentRunId, args.content)
  }
  run.turnEnd(entryAgentRunId, turnId)
}

const playRelay = async (run: Run, focusedAgentRunId: string, content: string, mentions: readonly RunMentionDefinition[]): Promise<void> => {
  run.input(focusedAgentRunId, content, 'user_message', null, null)
  await wait(350)
  run.status(focusedAgentRunId, 'running')
  const turnId = run.turnStart(focusedAgentRunId)
  if (!mentions.length) {
    await wait(700)
    run.text(focusedAgentRunId, turnId, 'Understood. I\'ll take it from here.')
    run.turnEnd(focusedAgentRunId, turnId)
    return
  }
  const replies: Array<Promise<void>> = []
  for (const definition of mentions) {
    const existing = run.existingEntry(definition)
    if (existing) {
      // SC-005: already in this run. Message the existing member; never start a second copy.
      await wait(700)
      const args = { recipient_address: run.view.getMemberAddress(existing.agentRunId) as string, content: runMentionScript.brief(content) }
      const invocationId = run.toolStart(focusedAgentRunId, turnId, 'send_message_to', args)
      await wait(600)
      run.toolEnd(focusedAgentRunId, turnId, invocationId, 'send_message_to', args, null)
      if (existing.agentRunId !== focusedAgentRunId) run.teamMessage(focusedAgentRunId, existing.agentRunId, args.content)
      run.text(focusedAgentRunId, turnId, runMentionScript.relayExisting(definition.name, existing.name))
      if (existing.agentRunId !== focusedAgentRunId) replies.push(playCollaboratorReply(run, existing.agentRunId, null, false))
      continue
    }
    await wait(700)
    run.text(focusedAgentRunId, turnId, runMentionScript.relayPlan(definition.name))
    await wait(600)
    const brief = runMentionScript.brief(content)
    const args = { recipient_address: `/${definition.name.toLowerCase()}`, description: brief }
    const invocationId = run.toolStart(focusedAgentRunId, turnId, 'delegate_task', args)
    await wait(1200)
    if (definition.unrunnableReason) {
      // SC-006: visible failure; the run tree is unchanged.
      run.toolEnd(focusedAgentRunId, turnId, invocationId, 'delegate_task', args, `${definition.name} cannot run in this run. ${definition.unrunnableReason}`)
      run.text(focusedAgentRunId, turnId, runMentionScript.relayFailed(definition.name, definition.unrunnableReason))
      pushRunMentionNotice({
        id: nextId('notice'), rootRunId: run.rootRunId, agentRunId: focusedAgentRunId, kind: 'failed',
        definitionKey: definition.key, definitionName: definition.name, detail: definition.unrunnableReason, entryAgentRunId: null,
      })
      continue
    }
    const record = run.addCollaborator(definition, focusedAgentRunId)
    run.status(record.entryAgentRunId, 'initializing')
    run.toolEnd(focusedAgentRunId, turnId, invocationId, 'delegate_task', args, null)
    run.teamMessage(focusedAgentRunId, record.entryAgentRunId, brief)
    const entryName = memberAddressBasename(run.view.getMemberAddress(record.entryAgentRunId) as AgentTeamAddress)
    await wait(500)
    run.text(focusedAgentRunId, turnId, runMentionScript.relayDone(definition.name, definition.kind === 'team' ? entryName : definition.name))
    pushRunMentionNotice({
      id: nextId('notice'), rootRunId: run.rootRunId, agentRunId: focusedAgentRunId, kind: 'added',
      definitionKey: definition.key, definitionName: definition.name, detail: entryName, entryAgentRunId: record.entryAgentRunId,
    })
    replies.push(playCollaboratorReply(run, record.entryAgentRunId, focusedAgentRunId, true))
  }
  run.turnEnd(focusedAgentRunId, turnId)
  await Promise.all(replies)
}

/** Review-only comparison (Q1 option a): the message goes straight to the collaborator. */
const playDirect = async (run: Run, focusedAgentRunId: string, content: string, mentions: readonly RunMentionDefinition[]): Promise<void> => {
  const history = useRunHistoryStore()
  for (const definition of mentions) {
    if (definition.unrunnableReason) {
      pushRunMentionNotice({
        id: nextId('notice'), rootRunId: run.rootRunId, agentRunId: focusedAgentRunId, kind: 'failed',
        definitionKey: definition.key, definitionName: definition.name, detail: definition.unrunnableReason, entryAgentRunId: null,
      })
      continue
    }
    const existing = run.existingEntry(definition)
    const entryAgentRunId = existing?.agentRunId ?? run.addCollaborator(definition, null).entryAgentRunId
    if (!existing) run.status(entryAgentRunId, 'initializing')
    run.input(entryAgentRunId, content, 'user_message', null, null)
    // The message lives in the collaborator's conversation, so the view follows it there.
    run.view.focusAgent(entryAgentRunId)
    history.refreshRunNavigationTopology('team-stream-structure')
    await playCollaboratorReply(run, entryAgentRunId, null, true)
  }
}

/**
 * Replaces the Team run send for the prototype. Mentions are the definitions
 * chosen from `@` in the focused composer that are still present in the text.
 */
export const simulateTeamRunSend = async (content: string): Promise<void> => {
  const team = useAgentTeamContextsStore().activeTeamContext
  const context = team?.view.getFocusedAgentContext() ?? null
  if (!team || !context) return
  const focusedAgentRunId = context.state.runId
  const chosen = draftMentionKeys(focusedAgentRunId)
  const mentions = listRunMentionDefinitions()
    .filter((definition) => chosen.includes(definition.key) && textHasMention(content, definition.name))
  context.requirement = ''
  context.contextFilePaths = []
  clearDraftMentions(focusedAgentRunId)
  const run = createRun(team)
  // A new message replaces the previous outcome notices of this conversation.
  runMentionState.noticesByRoot[run.rootRunId] = (runMentionState.noticesByRoot[run.rootRunId] ?? [])
    .filter((notice) => notice.agentRunId !== focusedAgentRunId)
  run.activate()
  if (runMentionRoute() === 'direct' && mentions.length) await playDirect(run, focusedAgentRunId, content, mentions)
  else await playRelay(run, focusedAgentRunId, content, mentions)
}
