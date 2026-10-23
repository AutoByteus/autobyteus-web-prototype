/**
 * remote-runs-in-tree (design-only): runs the Project Task Manager delegated to another node.
 *
 * The product's tree, conversation and composer are the real components. What is simulated sits
 * under them: the delegating node's server (it asks the other node and streams its events to the
 * window) is a fixture here, never a protocol. Everything is invented and illustrative; nothing
 * is read from a real node:
 * - nodes `docker` (reachable) and `office-mac` (not reachable);
 * - scenario `remote_runs`: the Project Task Manager run is live, with its five local copies and two
 *   copies on `docker` (a Marketing Team that is working, and a market researcher that is idle);
 * - scenario `remote_states`: one remote row in every state (working, idle, waiting, offline,
 *   not reachable) and no local copies.
 *
 * Turned off with the other design-only layers (`autobyteus.prototype.designOnlyLayers=off`).
 */
export const PTM_HOST_RUN_ID = 'run-ptm-0001'
// The default (populated) data carries the remote runs, so the review needs no setup; `remote_states` adds every state.
export const REMOTE_SCENARIOS = Object.freeze(['populated', 'remote_runs', 'remote_states'])
export const isRemoteScenario = (scenario: string): boolean => REMOTE_SCENARIOS.includes(scenario)

type Status = 'offline' | 'initializing' | 'idle' | 'running'
type Member = { name: string; agentRunId: string; status: Status }
type RemoteCopy =
  | { kind: 'team'; node: string; teamRunId: string; address: string; title: string; members: Member[] }
  | { kind: 'agent'; node: string; agentRunId: string; address: string; title: string; status: Status }

/** What the delegating node knows about a remote run: the node's name and, from the other node, its title. */
export type RemoteRunInfo = Readonly<{ nodeName: string; reachable: boolean; title: string | null }>

const NODES: Record<string, { reachable: boolean }> = { docker: { reachable: true }, 'office-mac': { reachable: false } }

const MARKETING_MEMBERS: Member[] = [
  { name: 'campaign_lead', agentRunId: 'ptm-mkt-0001-campaign_lead', status: 'running' },
  { name: 'copywriter', agentRunId: 'ptm-mkt-0001-copywriter', status: 'idle' },
  { name: 'designer', agentRunId: 'ptm-mkt-0001-designer', status: 'idle' },
]
const MARKETING_TITLE = 'Plan the 1.6 launch campaign across email, social and the website'
const RESEARCHER_TITLE = 'Compare competitor pricing pages for the desktop app'

const marketingTeam = (status?: Status): RemoteCopy => ({
  kind: 'team', node: 'docker', teamRunId: 'ptm-mkt-0001', address: '/marketing_team', title: MARKETING_TITLE,
  members: MARKETING_MEMBERS.map((member) => ({ ...member, status: status ?? member.status })),
})
const researcher = (status: Status = 'idle'): RemoteCopy => ({
  kind: 'agent', node: 'docker', agentRunId: 'ptm-mkr-0001', address: '/market_researcher', title: RESEARCHER_TITLE, status,
})

const supportTeam = (): RemoteCopy => ({ kind: 'team', node: 'office-mac', teamRunId: 'ptm-sup-0001', address: '/support_team', title: 'Triage the open desktop support threads',
  members: [
    { name: 'triage_lead', agentRunId: 'ptm-sup-0001-triage_lead', status: 'offline' },
    { name: 'answer_writer', agentRunId: 'ptm-sup-0001-answer_writer', status: 'offline' },
  ] })

const copiesFor = (scenario: string): RemoteCopy[] => {
  if (scenario === 'populated' || scenario === 'remote_runs') return [marketingTeam(), researcher('idle'), supportTeam()]
  if (scenario === 'remote_states') {
    return [
      marketingTeam(),
      researcher('idle'),
      { kind: 'agent', node: 'docker', agentRunId: 'ptm-trn-0001', address: '/translator', title: 'Translate the release notes into Chinese and German', status: 'initializing' },
      { kind: 'agent', node: 'docker', agentRunId: 'ptm-vid-0001', address: '/video_producer', title: 'Cut a 30 second teaser from the 1.6 demo recording', status: 'offline' },
      supportTeam(),
    ]
  }
  return []
}

/** Whether the scenario keeps the local copies next to the remote ones. */
export const keepsLocalCopies = (scenario: string): boolean => scenario !== 'remote_states'
/** The Project Task Manager run is live in both remote scenarios (it delegated them). */
export const hostIsLive = (scenario: string): boolean => isRemoteScenario(scenario)

const launch = (workspaceRootPath: string) => ({ runtimeKind: 'autobyteus', llmModelIdentifier: 'mock/gpt-prototype', llmConfig: { temperature: 0.2 }, autoExecuteTools: true, workspaceRootPath })
const createdAt = '2026-10-11T07:30:00.000Z'

export const remoteTaskExecutions = (scenario: string, workspaceRootPath: string, delegatorRunId: string): any[] => copiesFor(scenario).map((copy) => copy.kind === 'agent'
  ? { address: copy.address, agentRunId: copy.agentRunId, platformAgentRunId: null, delegatorAgentRunId: delegatorRunId, startedAt: createdAt,
      source: { kind: 'agent', agentDefinitionId: 'agent-researcher', launchConfiguration: launch(workspaceRootPath) } }
  : { address: copy.address, teamRunId: copy.teamRunId, delegatorAgentRunId: delegatorRunId, startedAt: createdAt,
      source: { kind: 'agent_team', teamDefinitionId: 'team-product', coordinatorAddress: `${copy.address}/${copy.members[0]!.name}`,
        members: copy.members.map((member) => ({ address: `${copy.address}/${member.name}`, agentDefinitionId: 'agent-researcher', launchConfiguration: launch(workspaceRootPath), followsTeam: true })),
        handoffs: [], defaultLaunchConfiguration: launch(workspaceRootPath) },
      members: copy.members.map((member) => ({ address: `${copy.address}/${member.name}`, agentRunId: member.agentRunId, platformAgentRunId: null })),
      taskExecutions: [] })

const statusRecord = (agentRunId: string, memberAddress: string, status: Status) => ({
  member_address: memberAddress, agent_run_id: agentRunId, status, trigger: null, tool_name: null, error_message: null, error_details: null, recoverableBlock: null,
})
/** The agents' statuses as the other node reports them (offline for an unreachable node). */
export const remoteAgentStatuses = (scenario: string): any[] => copiesFor(scenario).flatMap((copy) => copy.kind === 'agent'
  ? [statusRecord(copy.agentRunId, copy.address, copy.status)]
  : copy.members.map((member) => statusRecord(member.agentRunId, `${copy.address}/${member.name}`, member.status)))

// --- What the tree and the views know about a remote run ---------------------------------------

const infoOf = (copy: RemoteCopy): RemoteRunInfo => ({ nodeName: copy.node, reachable: NODES[copy.node]?.reachable !== false, title: copy.title })
const registry = (scenario: string): Map<string, RemoteRunInfo> => {
  const map = new Map<string, RemoteRunInfo>()
  for (const copy of copiesFor(scenario)) {
    const info = infoOf(copy)
    if (copy.kind === 'agent') map.set(copy.agentRunId, info)
    else { map.set(copy.teamRunId, info); copy.members.forEach((member) => map.set(member.agentRunId, info)) }
  }
  return map
}
const scenarioNow = (): string => { try { return localStorage.getItem('autobyteus.prototype.scenario') || 'populated' } catch { return 'populated' } }

/** The remote info of a run (an agent's or a Team's run ID) of the current scenario, or null for a local run. */
export const remoteRunInfo = (runId: string | null | undefined): RemoteRunInfo | null => {
  if (!runId) return null
  const scenario = scenarioNow()
  return isRemoteScenario(scenario) ? registry(scenario).get(runId) ?? null : null
}

/** Run IDs a stop of this reference ends (the agent, or a Team's members). */
const agentIdsOf = (scenario: string, reference: { agentRunId?: string | null; teamRunId?: string | null }): string[] => {
  for (const copy of copiesFor(scenario)) {
    if (copy.kind === 'agent' && copy.agentRunId === reference.agentRunId) return [copy.agentRunId]
    if (copy.kind === 'team' && copy.teamRunId === reference.teamRunId) return copy.members.map((member) => member.agentRunId)
  }
  return []
}

// --- Conversations (what the other node would answer for the open view) ------------------------

const at = (minutes: number) => Math.floor((Date.parse('2026-10-11T07:00:00.000Z') + minutes * 60_000) / 1000)
const fromManager = (text: string, minutes: number) => ({
  kind: 'inter_agent_message', role: 'user', senderAgentRunId: PTM_HOST_RUN_ID, senderAddress: '/project_task_manager', ts: at(minutes),
  content: `You received a message from sender name: project task manager, sender address: /project_task_manager, sender id: ${PTM_HOST_RUN_ID}\nmessage:\n${text}`,
})
const fromLead = (text: string, minutes: number) => ({
  kind: 'inter_agent_message', role: 'user', senderAgentRunId: 'ptm-mkt-0001-campaign_lead', senderAddress: '/marketing_team/campaign_lead', ts: at(minutes),
  content: `You received a message from sender name: campaign lead, sender address: /marketing_team/campaign_lead, sender id: ptm-mkt-0001-campaign_lead\nmessage:\n${text}`,
})

const CONVERSATIONS: Record<string, any[]> = {
  'ptm-mkt-0001-campaign_lead': [
    fromManager(MARKETING_TITLE, 3),
    { kind: 'reasoning', content: 'The brief names three audiences. I will fix the channel plan first, then ask the copywriter for the email sequence and the designer for the landing hero.', ts: at(4) },
    { kind: 'tool_call', invocationId: 'rm-inv-1', toolName: 'read_file', toolArgs: { path: 'docs/release-1.6-brief.md' },
      toolResult: '# Release 1.6\nAudiences: existing desktop users, teams evaluating AutoByteus, agent builders.\nLaunch week: 3–7 November.', ts: at(5) },
    { kind: 'message', role: 'assistant', content: 'The brief is clear: three audiences and a launch week of 3–7 November. The channel plan is drafted; the copywriter is writing the email sequence now.', ts: at(6) },
  ],
  'ptm-mkt-0001-copywriter': [
    fromLead('Draft the three-email sequence for the 1.6 launch: announcement, what is new, and the follow-up for evaluators.', 6),
    { kind: 'message', role: 'assistant', content: 'Draft ready. Email 1 subject: "AutoByteus 1.6 is here: teams that work across machines". I am polishing emails 2 and 3.', ts: at(7) },
  ],
  'ptm-mkt-0001-designer': [
    fromLead('Start the landing page hero once the first email is approved.', 7),
    { kind: 'message', role: 'assistant', content: 'Waiting for the approved first email. I have two hero layouts sketched.', ts: at(8) },
  ],
  'ptm-mkr-0001': [
    fromManager(RESEARCHER_TITLE, 3),
    { kind: 'tool_call', invocationId: 'rm-inv-2', toolName: 'web_search', toolArgs: { query: 'AI desktop agent app pricing 2026' },
      toolResult: 'Three comparable products; two changed their tiers in October.', ts: at(4) },
    { kind: 'message', role: 'assistant', content: 'The pricing table is ready: /workspace/pricing/competitors.csv. Two competitors changed their tiers in October; the summary sits at the top of the sheet.', ts: at(5) },
  ],
  'ptm-trn-0001': [fromManager('Translate the release notes into Chinese and German', 3)],
  'ptm-vid-0001': [
    fromManager('Cut a 30 second teaser from the 1.6 demo recording', 3),
    { kind: 'message', role: 'assistant', content: 'The teaser is cut and exported. Shutting down to free the machine.', ts: at(4) },
  ],
}

/** The open view of a run on another node, or an error when that node is not reachable; null for a local run. */
let timelineStarted = false
export const remoteMemberProjection = (agentRunId: string, summary: string, lastActivityAt: string): any | null => {
  const info = remoteRunInfo(agentRunId)
  if (!info) return null
  // The working coordinator carries on while its view is open: the stream plays its next steps (once per page load).
  if (info.reachable && agentRunId === LEAD_ID && scenarioNow() !== 'remote_states' && !timelineStarted) {
    timelineStarted = true
    window.dispatchEvent(new CustomEvent('prototype-remote-opened', { detail: { agentRunId } }))
  }
  if (!info.reachable) return { __projectError: { message: `${info.nodeName} is not reachable. The request timed out after 20 seconds.`, extensions: { code: 'PEER_UNREACHABLE' } } }
  return { agentRunCollaborationMemberProjection: { agentRunId, memberAddress: '', summary, lastActivityAt,
    conversation: structuredClone(CONVERSATIONS[agentRunId] ?? []), activities: [], hasEarlierActiveTraceEvents: false } }
}

// --- The live stream (the delegating node passes the other node's events on) -------------------

export const remoteStreamIsLive = (scenario: string, pathname: string): boolean =>
  isRemoteScenario(scenario) && pathname.includes('/ws/agent-collaboration/') && pathname.split('?')[0]!.endsWith(PTM_HOST_RUN_ID)

type Frame = Record<string, unknown>
let sequence = 1
const nextSequence = () => ++sequence
const event = (agentRunId: string, memberAddress: string, message: { type: string; payload: Record<string, unknown> }): Frame => ({
  type: 'ROOT_EXECUTION_EVENT',
  payload: { root_subject_kind: 'agent', root_run_id: PTM_HOST_RUN_ID, change_sequence: nextSequence(), event: { kind: 'agent_presentation', member_address: memberAddress, agent_run_id: agentRunId, message } },
})
const statusEvent = (agentRunId: string, memberAddress: string, status: Status): Frame => event(agentRunId, memberAddress, {
  type: 'AGENT_STATUS', payload: { status, trigger: null, tool_name: null, error_message: null, error_details: null, recoverableBlock: null },
})
const textSegment = (agentRunId: string, memberAddress: string, turnId: string, segmentId: string, text: string, kind: 'text' | 'reasoning' = 'text'): { delay: number; frame: Frame }[] => {
  const words = text.split(/(?<=\s)/)
  const chunks: string[] = []
  for (let i = 0; i < words.length; i += 3) chunks.push(words.slice(i, i + 3).join(''))
  return [
    { delay: 0, frame: event(agentRunId, memberAddress, { type: 'SEGMENT_START', payload: { segment_id: segmentId, turn_id: turnId, segment_type: kind, metadata: null } }) },
    ...chunks.map((delta) => ({ delay: 90, frame: event(agentRunId, memberAddress, { type: 'SEGMENT_CONTENT', payload: { segment_id: segmentId, turn_id: turnId, segment_type: kind, delta } }) })),
    { delay: 60, frame: event(agentRunId, memberAddress, { type: 'SEGMENT_END', payload: { segment_id: segmentId, turn_id: turnId, metadata: null, interrupted: false, reason: null, failed: false, error: null } }) },
  ]
}
const LEAD_ID = 'ptm-mkt-0001-campaign_lead'
const LEAD_ADDRESS = '/marketing_team/campaign_lead'

/** Scripted timeline of the working coordinator: a new tool call with its result, then a message, while the view is open. */
export const remoteTimeline = (): { delay: number; frame: Frame }[] => {
  const invocation = 'rm-live-inv-1'
  return [
    { delay: 3500, frame: event(LEAD_ID, LEAD_ADDRESS, { type: 'SEGMENT_START', payload: { segment_id: invocation, turn_id: 'rm-live-turn-1', segment_type: 'tool_call', metadata: { tool_name: 'send_message_to', arguments: { recipient: '/marketing_team/designer', content: 'Hero layouts are due after email 1 is approved.' } } } }) },
    { delay: 300, frame: event(LEAD_ID, LEAD_ADDRESS, { type: 'SEGMENT_END', payload: { segment_id: invocation, turn_id: 'rm-live-turn-1', metadata: null, interrupted: false, reason: null, failed: false, error: null } }) },
    { delay: 200, frame: event(LEAD_ID, LEAD_ADDRESS, { type: 'TOOL_EXECUTION_STARTED', payload: { invocation_id: invocation, tool_name: 'send_message_to', turn_id: 'rm-live-turn-1', arguments: { recipient: '/marketing_team/designer', content: 'Hero layouts are due after email 1 is approved.' } } }) },
    { delay: 900, frame: event(LEAD_ID, LEAD_ADDRESS, { type: 'TOOL_EXECUTION_SUCCEEDED', payload: { invocation_id: invocation, tool_name: 'send_message_to', turn_id: 'rm-live-turn-1', arguments: null, result: 'Delivered to /marketing_team/designer.' } }) },
    ...textSegment(LEAD_ID, LEAD_ADDRESS, 'rm-live-turn-1', 'rm-live-text-1', 'The designer has the schedule. I will review email 1 when the copywriter sends it.'),
    { delay: 600, frame: statusEvent(LEAD_ID, LEAD_ADDRESS, 'idle') },
  ]
}

const ack = (command: Record<string, any>, state: 'accepted' | 'failed', code: string | null, message: string | null): Frame => ({
  type: 'AGENT_COMMAND_ACK',
  payload: { root_subject_kind: 'agent', root_run_id: PTM_HOST_RUN_ID, command_id: command.command_id, command_type: command.type, target_agent_run_id: command.target_agent_run_id, state, code, message },
})

/** The other node's answer to a message the user sends to a remote run from this window. */
export const remoteSendReply = (scenario: string, payload: Record<string, any>): { delay: number; frame: Frame }[] => {
  const agentRunId: string = payload.target_agent_run_id
  const info = remoteRunInfo(agentRunId)
  const command = { ...payload, type: 'SEND_MESSAGE' }
  if (!info) return []
  if (!info.reachable) return [{ delay: 400, frame: ack(command, 'failed', 'PEER_UNREACHABLE', `${info.nodeName} is not reachable. The request timed out after 20 seconds.`) }]
  const address = agentRunId === 'ptm-mkr-0001' ? '/market_researcher' : agentRunId.startsWith('ptm-mkt-0001-') ? `/marketing_team/${agentRunId.replace('ptm-mkt-0001-', '')}` : `/${agentRunId}`
  const turn = `rm-reply-${payload.message_id}`
  const reply = agentRunId === LEAD_ID
    ? 'Status: the channel plan is done, the email sequence is in draft, and the designer is waiting for the first email to be approved.'
    : 'Noted. I will include it in my next update.'
  return [
    { delay: 150, frame: ack(command, 'accepted', null, null) },
    { delay: 60, frame: event(agentRunId, address, { type: 'MEMBER_INPUT_MESSAGE', payload: {
      message_id: payload.message_id, dedupe_key: payload.dedupe_key, content: payload.content, input_origin: 'user_message',
      received_at: new Date().toISOString(), context_file_paths: [], sender_agent_run_id: null, parent_communication_message_id: null } }) },
    { delay: 250, frame: statusEvent(agentRunId, address, 'running') },
    ...textSegment(agentRunId, address, turn, `${turn}-text`, reply),
    { delay: 200, frame: statusEvent(agentRunId, address, 'idle') },
  ]
}

/** Interrupt of a working remote agent: it reports idle. */
export const remoteInterruptReply = (payload: Record<string, any>): { delay: number; frame: Frame }[] => {
  const agentRunId: string = payload.target_agent_run_id
  if (!remoteRunInfo(agentRunId)) return []
  const address = agentRunId.startsWith('ptm-mkt-0001-') ? `/marketing_team/${agentRunId.replace('ptm-mkt-0001-', '')}` : '/market_researcher'
  return [
    { delay: 120, frame: ack({ ...payload, type: 'INTERRUPT_GENERATION' }, 'accepted', null, null) },
    { delay: 200, frame: statusEvent(agentRunId, address, 'idle') },
  ]
}

/** After a Stop of a remote copy from this window: the other node reports its agents offline. */
export const remoteStopFrames = (scenario: string, reference: { agentRunId?: string | null; teamRunId?: string | null }): Frame[] => {
  const copy = copiesFor(scenario).find((item) => item.kind === 'agent' ? item.agentRunId === reference.agentRunId : item.teamRunId === reference.teamRunId)
  if (!copy) return []
  const records = copy.kind === 'agent' ? [[copy.agentRunId, copy.address]] : copy.members.map((member) => [member.agentRunId, `${copy.address}/${member.name}`])
  return records.map(([id, address]) => statusEvent(id!, address!, 'offline'))
}
export const remoteAgentIdsOf = agentIdsOf

/** Scripted Stop results for a remote copy: it stops, and the stream then reports it offline. */
export const remoteStopResult = (scenario: string, reference: { agentRunId?: string | null; teamRunId?: string | null }): any | null => {
  if (!isRemoteScenario(scenario)) return null
  const ids = agentIdsOf(scenario, reference)
  if (!ids.length) return null
  const info = remoteRunInfo(ids[0])
  if (!info) return null
  if (!info.reachable) return { __projectError: { message: `${info.nodeName} is not reachable. The request timed out after 20 seconds.`, extensions: { code: 'PEER_UNREACHABLE' } } }
  return { stopDelegatedExecution: { __typename: 'StopDelegatedExecutionResult', success: true, outcome: 'STOPPED', message: `Stopped on ${info.nodeName}. Its next message resumes it.`, notStoppedUnattributed: 0 } }
}
