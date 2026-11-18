// ios-demo-mode-279 (autobyteus-279): design-only state of the iOS app's demo.
//
// The iOS app opens its own `/mobile` screens on a built-in sample world ("Try demo" on the first screen, or the demo QR
// code `autobyteus://demo` scanned in the app or with the iPhone Camera). In this UI reference the app is the design
// route `/ios`; opening the demo sets a session flag and opens `/mobile`, whose screens then read the demo world below.
// Everything is invented. No node address, no credential, nothing is requested from anywhere.

import { MOBILE_RUNS, RICH_RUN_ID } from '~/prototype/source-observation/mobile-world.mjs'
import type { MobileRunNode } from '~/prototype/mobile-runs/mobileRunsFixture'

/** The demo is open in the iOS app (this browser tab stands for the app; a cold launch starts on the first screen). */
export const IOS_DEMO_KEY = 'autobyteus.prototype.iosDemo'
/** The page runs inside the iOS app (set by `/ios` when it opens a page). */
export const IN_IOS_APP_KEY = 'autobyteus.prototype.inIosApp'
/** The demo's welcome card was closed during this visit of the demo. */
export const DEMO_WELCOME_CLOSED_KEY = 'autobyteus.prototype.iosDemoWelcomeClosed'

/** What the demo QR code holds: the app's own URL scheme (registered by the iOS app), no address and no secret. */
export const DEMO_QR_CONTENT = 'autobyteus://demo'

export const isIosDemo = (): boolean => {
  try { return typeof sessionStorage !== 'undefined' && sessionStorage.getItem(IOS_DEMO_KEY) === '1' } catch { return false }
}
export const isInIosApp = (): boolean => {
  try { return typeof sessionStorage !== 'undefined' && sessionStorage.getItem(IN_IOS_APP_KEY) === '1' } catch { return false }
}

/** Opens the demo: its run list, with fresh sample data (what an earlier visit changed is gone). */
export function enterIosDemo(): void {
  sessionStorage.setItem(IN_IOS_APP_KEY, '1')
  sessionStorage.setItem(IOS_DEMO_KEY, '1')
  sessionStorage.removeItem(DEMO_WELCOME_CLOSED_KEY)
  window.location.assign('/mobile')
}

/** Leave demo: back to the app's first screen. The demo keeps nothing. */
export function leaveIosDemo(): void {
  sessionStorage.removeItem(IOS_DEMO_KEY)
  sessionStorage.removeItem(DEMO_WELCOME_CLOSED_KEY)
  window.location.assign('/ios')
}

/**
 * The demo's runs: the phone's sample world with everything on the demo itself. The demo has no other nodes, so no row
 * says "Runs on <node>" or "Not reachable".
 */
const local = (node: MobileRunNode): MobileRunNode => {
  const { node: _otherNode, children, ...rest } = node
  return { ...rest, ...(children ? { children: children.map(local) } : {}) }
}
export const DEMO_RUNS: MobileRunNode[] = (MOBILE_RUNS as MobileRunNode[]).map(local)

/** The Project Task Manager's closing message in the demo (the shared world's names nodes the demo does not have). */
export const DEMO_PTM_SUMMARY = 'Delegated six Tasks: two to copies of the Software Engineering Team, one to the Agent Package Creator, two to the Marketing Team and the Market Researcher, and one to the Support Team. I will report when they finish.'

// --- Scripted replies -----------------------------------------------------------------------------------------------
// A message sent to an agent in the demo gets an answer in that agent's own conversation: it starts working, reads a
// file of the run's folder (a tool call with its result), then writes its answer. Played on the agent's own stream.

type Frame = Record<string, unknown>

const quoted = (content: string): string => {
  const asked = content.trim().replace(/\s+/g, ' ')
  return asked.length > 80 ? `${asked.slice(0, 77)}…` : asked
}
const SAMPLE_LINE = 'This is the demo, so this answer is a sample. With your own computer, your agent does the work and answers here the same way.'
/** The showcase run continues its own work (its release notes); any other run, a new one too, looks at its own folder. */
const replyFor = (runId: string, content: string): { tool: string; args: Record<string, unknown>; result: string; text: string } => (runId === RICH_RUN_ID
  ? {
      tool: 'read_file', args: { path: 'docs/release-notes-1.6.md' }, result: 'Read 18 lines of docs/release-notes-1.6.md.',
      text: [`Here is how I would start on “${quoted(content)}”.`, '', '1. Take the three changes and the date from `docs/release-notes-1.6.md`.', '2. Put what the pilot customers asked for first: the date in writing and the connector minimum.', '3. Write it to the folder and post the short version here.', '', SAMPLE_LINE].join('\n'),
    }
  : {
      tool: 'list_directory', args: { path: 'demo-workspace' }, result: 'README.md, docs/, launch/, src/',
      text: [`Here is how I would start on “${quoted(content)}”.`, '', '1. Look through this run’s folder for what is already there.', '2. Do the work step by step: read and write files, run commands, or ask other agents for help.', '3. Post the result here and keep the files in the folder.', '', SAMPLE_LINE].join('\n'),
    })

const words = (text: string): string[] => {
  const parts = text.split(/(?<=\s)/)
  const chunks: string[] = []
  for (let i = 0; i < parts.length; i += 3) chunks.push(parts.slice(i, i + 3).join(''))
  return chunks
}

/** The frames of one scripted answer, with the delay before each (ms). */
export function demoReplyFrames(runId: string, payload: { message_id?: string; dedupe_key?: string; content?: string }): { delay: number; frame: Frame }[] {
  const turn = `demo-turn-${payload.message_id ?? Date.now()}`
  const tool = `${turn}-read`
  const text = `${turn}-text`
  const status = (value: 'running' | 'idle'): Frame => ({ type: 'AGENT_STATUS', payload: { status: value, trigger: null, tool_name: null, error_message: null, error_details: null, recoverableBlock: null } })
  const reply = replyFor(runId, payload.content ?? '')
  const args = reply.args
  return [
    { delay: 0, frame: { __demoStatus: { runId, status: 'running' } } },
    { delay: 150, frame: { type: 'AGENT_COMMAND_ACK', payload: { command_type: 'SEND_MESSAGE', run_id: runId, message_id: payload.message_id ?? '', dedupe_key: payload.dedupe_key ?? '', state: 'accepted', accepted: true, duplicate: false } } },
    { delay: 200, frame: status('running') },
    { delay: 100, frame: { type: 'TURN_STARTED', payload: { turn_id: turn } } },
    { delay: 700, frame: { type: 'SEGMENT_START', payload: { id: tool, turn_id: turn, segment_type: 'tool_call', metadata: { tool_name: reply.tool, arguments: args } } } },
    { delay: 200, frame: { type: 'SEGMENT_END', payload: { id: tool, turn_id: turn, metadata: { tool_name: reply.tool, arguments: args }, interrupted: false, reason: null, failed: false, error: null } } },
    { delay: 100, frame: { type: 'TOOL_EXECUTION_STARTED', payload: { invocation_id: tool, tool_name: reply.tool, turn_id: turn, arguments: args } } },
    { delay: 900, frame: { type: 'TOOL_EXECUTION_SUCCEEDED', payload: { invocation_id: tool, tool_name: reply.tool, turn_id: turn, arguments: args, result: reply.result } } },
    { delay: 300, frame: { type: 'SEGMENT_START', payload: { id: text, turn_id: turn, segment_type: 'text', metadata: null } } },
    ...words(reply.text).map((delta) => ({ delay: 70, frame: { type: 'SEGMENT_CONTENT', payload: { id: text, turn_id: turn, segment_type: 'text', delta } } })),
    { delay: 80, frame: { type: 'SEGMENT_END', payload: { id: text, turn_id: turn, metadata: null, interrupted: false, reason: null, failed: false, error: null } } },
    { delay: 120, frame: { type: 'TURN_COMPLETED', payload: { turn_id: turn, reason: null } } },
    { delay: 80, frame: status('idle') },
    { delay: 0, frame: { __demoStatus: { runId, status: 'idle' } } },
  ]
}

// --- The iOS app's start screen (design route `/ios`) ----------------------------------------------------------------

/** Starting state of `/ios`: `ios_first_launch` (default) or `ios_several` (two nodes saved). Remove the key to reset. */
export const IOS_START_KEY = 'autobyteus.prototype.iosStart'

/** The nodes saved on the iPhone in a starting state (invented names). */
export const iosSeedNodes = (start: string): Array<{ id: string; name: string; reachable: boolean }> =>
  start === 'ios_several'
    ? [{ id: 'n-desktop', name: 'Desktop', reachable: true }, { id: 'n-office-mac', name: 'Office Mac', reachable: true }]
    : []

// --- The demo's showcase content -------------------------------------------------------------------------------------
// The phone's sample world shows every state, including failures, for design work. The demo shows the app working:
// its showcase conversation keeps every kind of content (thinking, tool calls, a terminal, file edits, a long formatted
// answer, a picture, a message from another agent) and leaves out the failure states and internal platform notices.

const DROPPED_SEGMENTS = new Set(['error', 'system_task_notification'])
type Segment = Record<string, any>

const finishTool = (segment: Segment): Segment => (segment.status === 'executing'
  ? { ...segment, status: 'success', logs: ['Checking connector version…', 'Connector 2.4 found. Ready to upgrade to 1.6.'], result: { stdout: 'Connector 2.4 found. Ready to upgrade to 1.6.', exit_code: 0 } }
  : segment)

/** A message from another agent names it as the product does from a run ID shaped `<name>_<hex>` (Project Task Manager). */
const namedSender = (segment: Segment): Segment => (segment.type === 'inter_agent_message' && segment.senderAgentRunId === 'mx-ptm-0001'
  ? { ...segment, senderAgentRunId: 'project_task_manager_4f2a9c1e' }
  : segment)

export function demoConversation(conversation: any): any {
  return {
    ...conversation,
    messages: conversation.messages.map((message: any) => (message.segments
      ? { ...message, segments: message.segments.filter((segment: Segment) => !DROPPED_SEGMENTS.has(segment.type) && segment.status !== 'error').map(finishTool).map(namedSender) }
      : message)),
  }
}
export const demoActivities = (activities: Segment[]): Segment[] => activities.filter((item) => item.status !== 'error').map(finishTool)
export const demoBackgroundTasks = (tasks: Segment[]): Segment[] => tasks.filter((task) => task.status !== 'failed')

/** The conversation's picture in the demo: an invented chart (no real data). */
export const DEMO_IMAGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600">
<rect width="960" height="600" rx="24" fill="#f8fafc"/>
<text x="56" y="84" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="600" fill="#0f172a">Release 1.6 · what pilot customers asked for</text>
<text x="56" y="124" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="#64748b">Sample chart · requests per change</text>
<g font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="#334155">
<text x="56" y="214">Keep export filters</text><rect x="330" y="186" width="520" height="40" rx="8" fill="#2563eb"/><text x="866" y="214" fill="#0f172a" font-weight="600">26</text>
<text x="56" y="304">Invoice language</text><rect x="330" y="276" width="380" height="40" rx="8" fill="#3b82f6"/><text x="726" y="304" fill="#0f172a" font-weight="600">19</text>
<text x="56" y="394">Name the failing row</text><rect x="330" y="366" width="300" height="40" rx="8" fill="#60a5fa"/><text x="646" y="394" fill="#0f172a" font-weight="600">15</text>
<text x="56" y="484">Connector 2.4</text><rect x="330" y="456" width="160" height="40" rx="8" fill="#93c5fd"/><text x="506" y="484" fill="#0f172a" font-weight="600">8</text>
</g>
</svg>`

/** The demo's model catalog: the sample models say they are samples (the demo makes no model request). */
export function demoModelNames<T>(state: T): T {
  if (!state) return state
  return JSON.parse(JSON.stringify(state)
    .replace(/mock\/gpt-prototype/g, 'demo/sample-model')
    .replace(/mock\/reasoning-prototype/g, 'demo/sample-reasoning-model')
    .replace(/Reasoning Prototype Model/g, 'Sample reasoning model')
    .replace(/Prototype Model/g, 'Sample model')
    .replace(/Deterministic model fixture with thinking settings; no inference request is made\./g, 'A sample model with thinking settings. Its answers are scripted.')
    .replace(/Deterministic model fixture; no inference request is made\./g, 'A sample model. Its answers are scripted.')
    .replace(/prototype-workspace/g, 'demo-workspace')) as T
}

// --- The demo's folder (Files, Artifacts, opened files) --------------------------------------------------------------
// One sample folder for the demo's runs, holding the files the conversations name. Invented content, no placeholders.

const RELEASE_NOTES = [
  '# Release 1.6 — what’s new',
  '',
  'Release 1.6 ships on **Thursday, 12 March**. It brings three changes the pilot customers asked for.',
  '',
  '## Changes',
  '',
  '- **Export filters are kept.** Leave the export screen and come back: your filters are still set.',
  '- **Invoices in the customer’s language.** Invoices use the customer’s language and their country’s currency format.',
  '- **Import errors name the row.** A failed import says which row failed and why.',
  '',
  '## Before you upgrade',
  '',
  '1. Back up the `exports/` folder.',
  '2. Update the connector to 2.4 or later.',
  '3. Run the sample import once; it takes about a minute.',
  '',
].join('\n')

export const DEMO_FILES: Record<string, string> = {
  'README.md': '# Pilot launch\n\nThe folder the sample agents work in: the 1.6 release notes, the pilot customers’ summary, the launch plan and a small code change.\n\n- `docs/` release notes, pilot summary, customer list, screenshots\n- `launch/` announcement, pilot email, release checklist\n- `src/` the export screen change\n',
  'docs/release-notes-1.6.md': RELEASE_NOTES,
  'docs/pilot-summary.md': '# Pilot summary\n\nThree changes, one new date: **Thursday, 12 March**.\n\n- Export filters are kept\n- Invoices in the customer’s language\n- Import errors name the row\n\nThe pilot customers asked for the date in writing and for the connector minimum (2.4).\n',
  'docs/pilot-customers.csv': 'customer,country,language,connector\nNorthwind Traders,DE,German,2.4\nBlue Harbor Foods,NL,Dutch,2.3\nCedar & Pine Studio,US,English,2.4\nLumen Clinics,FR,French,2.2\n',
  'docs/dashboard-before.png': '',
  'docs/dashboard-after.png': '',
  'launch/announcement.md': '# AutoByteus 1.6 is here\n\nYour export filters now stay put, invoices speak your customer’s language, and a failed import tells you exactly which row to fix.\n\nRelease 1.6 is available on Thursday, 12 March.\n',
  'launch/pilot-email.md': 'Subject: Release 1.6 on Thursday, 12 March\n\nHello,\n\nThank you for testing 1.6 with us. It ships on Thursday, 12 March, with the three changes you asked for. Please update the connector to 2.4 before you upgrade.\n\nThe release notes are attached.\n',
  'launch/checklist.md': '# Release checklist — 1.6\n\n- [x] Release notes final\n- [x] Pilot email approved\n- [ ] Connector 2.4 build published\n- [ ] Announcement scheduled for Thursday, 12 March\n',
  'src/export/filters.ts': 'export function restoreFilters(saved: ExportFilters | null): ExportFilters {\n  // Keep the filters the user set when they come back to the export screen.\n  return saved ?? defaultFilters()\n}\n',
}
export const isDemoImage = (path: string): boolean => /\.(png|jpe?g|svg)(?=$|[&#?])/i.test(path)
export const demoFileText = (path: string): string => DEMO_FILES[String(path).replace(/^\/+/, '')] ?? `# ${String(path).split('/').pop()}\n\nA sample file of the demo.\n`
export const demoSearch = (query: string): string[] => Object.keys(DEMO_FILES).filter((path) => path.toLowerCase().includes(String(query ?? '').trim().toLowerCase()))

/** The pictures of the demo's folder: invented screens, no real data. */
export const demoImageFor = (path: string): string => (/before/i.test(path)
  ? `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600"><rect width="960" height="600" rx="24" fill="#f8fafc"/><text x="56" y="84" font-family="system-ui,-apple-system,sans-serif" font-size="34" font-weight="600" fill="#0f172a">Export · before 1.6</text><text x="56" y="124" font-family="system-ui,-apple-system,sans-serif" font-size="22" fill="#64748b">Sample screen · filters reset when you leave</text><rect x="56" y="170" width="848" height="56" rx="10" fill="#e2e8f0"/><text x="80" y="206" font-family="system-ui,-apple-system,sans-serif" font-size="22" fill="#64748b">Filters: none</text><g fill="#cbd5e1"><rect x="56" y="256" width="848" height="40" rx="8"/><rect x="56" y="312" width="848" height="40" rx="8"/><rect x="56" y="368" width="848" height="40" rx="8"/><rect x="56" y="424" width="848" height="40" rx="8"/></g></svg>`
  : DEMO_IMAGE_SVG)

// --- Team and Org members: conversations, Activity and Messages that fit their work -----------------------------------

type Entry = Record<string, unknown>
const fromAgent = (name: string, address: string, text: string, ts: number): Entry => ({
  kind: 'inter_agent_message', role: 'user', ts,
  content: `You received a message from sender name: ${name}, sender address: ${address}, sender id: ${address.replace(/^\//, '')}\nmessage:\n${text}`,
})
const said = (content: string, ts: number): Entry => ({ kind: 'message', role: 'assistant', content, ts })
const toolCall = (id: string, toolName: string, toolArgs: Record<string, unknown>, toolResult: string, ts: number): Entry => ({ kind: 'tool_call', invocationId: id, toolName, toolArgs, toolResult, ts })

const MEMBER_WORK: Record<string, (s: (minutes: number) => number) => Entry[]> = {
  'mx-org-0001-launch_lead': (s) => [
    { kind: 'message', role: 'user', content: 'Prepare the 1.6 launch: the announcement, the email to the pilot customers and the release checklist.', ts: s(0) },
    toolCall('lead-1', 'read_file', { path: 'docs/release-notes-1.6.md' }, 'Read 18 lines.', s(1)),
    toolCall('lead-2', 'send_message_to', { recipient: '/content_writer', content: 'Draft the announcement and the pilot email from docs/release-notes-1.6.md.' }, 'Delivered to /content_writer.', s(2)),
    toolCall('lead-3', 'send_message_to', { recipient: '/release_manager', content: 'Prepare the release checklist for Thursday, 12 March.' }, 'Delivered to /release_manager.', s(3)),
    said('I asked content_writer for the announcement and the pilot email, and release_manager for the checklist. I will review both and post the launch plan here.', s(4)),
  ],
  'mx-org-0001-content_writer': (s) => [
    fromAgent('launch lead', '/launch_lead', 'Draft the announcement and the pilot email from docs/release-notes-1.6.md.', s(0)),
    toolCall('cw-1', 'read_file', { path: 'docs/release-notes-1.6.md' }, 'Read 18 lines.', s(1)),
    toolCall('cw-2', 'write_file', { path: 'launch/announcement.md' }, 'Wrote launch/announcement.md.', s(2)),
    toolCall('cw-3', 'write_file', { path: 'launch/pilot-email.md' }, 'Wrote launch/pilot-email.md.', s(3)),
    said('Both drafts are in `launch/`: the announcement and the pilot email. The email asks the customers to update the connector to 2.4 first.', s(4)),
  ],
  'mx-org-0001-release_manager': (s) => [
    fromAgent('launch lead', '/launch_lead', 'Prepare the release checklist for Thursday, 12 March.', s(0)),
    toolCall('rm-1', 'write_file', { path: 'launch/checklist.md' }, 'Wrote launch/checklist.md.', s(1)),
    said('The checklist is in `launch/checklist.md`. Two items wait for the connector 2.4 build; everything else is done.', s(2)),
  ],
  'mx-set-0001-implementation_engineer': (s) => [
    fromAgent('solution designer', '/solution_designer', 'Requirements are approved: keep the export filters when the user leaves the export screen. Keep the change small.', s(0)),
    toolCall('ie-1', 'read_file', { path: 'src/export/filters.ts' }, 'Read 4 lines.', s(1)),
    toolCall('ie-2', 'edit_file', { path: 'src/export/filters.ts' }, 'Edited src/export/filters.ts.', s(2)),
    toolCall('ie-3', 'run_terminal_command', { command: 'pnpm test export' }, '12 tests passed.', s(3)),
    said('The export screen now restores the saved filters. The tests pass; handing over to code_reviewer.', s(4)),
  ],
}

/** A member's conversation in the demo; members without their own get a short one about their Team's work. */
export function demoMemberEntries(node: { id: string; name: string }, team: { name: string; summary: string } | null, at: number): Entry[] {
  const s = (minutes: number): number => Math.floor((at + minutes * 60_000) / 1000)
  const own = MEMBER_WORK[node.id]
  if (own) return own(s)
  return [
    fromAgent('coordinator', '/coordinator', team ? `${team.summary}. Please take your part of it.` : 'Please take your part of the Task.', s(0)),
    said(team ? `On it: my part of “${team.summary}”. I will post the result here.` : 'On it. I will post the result here.', s(1)),
  ]
}

/** A member's Activity in the demo: the tool calls of its conversation. */
export function demoMemberActivities(node: { id: string; status: string }, at: number): Entry[] | null {
  const own = MEMBER_WORK[node.id]
  if (!own) return null
  const s = (minutes: number): number => Math.floor((at + minutes * 60_000) / 1000)
  return own(s).filter((entry) => entry.kind === 'tool_call').map((entry, n) => ({
    kind: 'tool', invocationId: `${node.id}-demo-a${n}`, toolName: entry.toolName,
    type: entry.toolName === 'write_file' ? 'write_file' : entry.toolName === 'edit_file' ? 'edit_file' : entry.toolName === 'run_terminal_command' ? 'terminal_command' : 'tool_call',
    status: 'success', contextText: Object.values(entry.toolArgs as Record<string, unknown>)[0], arguments: entry.toolArgs, logs: [], result: entry.toolResult, error: null, ts: entry.ts,
  }))
}

/** Messages among an Org's or a Team's members in the demo, about their own work. */
const LAUNCH_MESSAGES: Array<[string, string, string, string[]]> = [
  ['launch_lead', 'content_writer', 'Draft the announcement and the pilot email from docs/release-notes-1.6.md.', ['docs/release-notes-1.6.md']],
  ['launch_lead', 'release_manager', 'Prepare the release checklist for Thursday, 12 March.', []],
  ['content_writer', 'launch_lead', 'Both drafts are ready for your review.', ['launch/announcement.md', 'launch/pilot-email.md']],
  ['release_manager', 'launch_lead', 'Checklist done. Two items wait for the connector 2.4 build.', ['launch/checklist.md']],
]
export function demoParticipantMessages(node: { id: string; name: string }, members: Array<{ id: string; name: string }>, at: number): { messages: Entry[]; pastParticipants: Entry[] } | null {
  if (!node.id.startsWith('mx-org-0001-')) return null
  const byName = new Map(members.map((member) => [member.name, member]))
  const messages = LAUNCH_MESSAGES
    .filter(([from, to]) => from === node.name || to === node.name)
    .map(([from, to, content, files], n) => ({
      messageId: `${node.id}-demo-m${n}`, senderAgentRunId: byName.get(from)?.id ?? from, receiverAgentRunId: byName.get(to)?.id ?? to,
      content, messageType: 'direct_message', referenceFiles: files, createdAt: new Date(at + (n + 1) * 90_000).toISOString(),
    }))
  return { messages, pastParticipants: [] }
}

/** The demo folder as a tree (Files): folders first, then files, by name; every folder already loaded. */
export function demoFolderTree<T>(rootName: string, makeNode: (name: string, path: string, isFile: boolean, children: T[], id: string) => T): { root: T; byId: Record<string, T> } {
  type Dir = { dirs: Map<string, Dir>; files: string[] }
  const top: Dir = { dirs: new Map(), files: [] }
  for (const path of Object.keys(DEMO_FILES)) {
    const parts = path.split('/')
    let dir = top
    for (const part of parts.slice(0, -1)) {
      if (!dir.dirs.has(part)) dir.dirs.set(part, { dirs: new Map(), files: [] })
      dir = dir.dirs.get(part)!
    }
    dir.files.push(parts[parts.length - 1]!)
  }
  const byId: Record<string, T> = {}
  const build = (dir: Dir, prefix: string): T[] => [
    ...[...dir.dirs.keys()].sort().map((name) => {
      const path = prefix ? `${prefix}/${name}` : name
      const node = makeNode(name, path, false, build(dir.dirs.get(name)!, path), `demo-dir:${path}`)
      byId[`demo-dir:${path}`] = node
      return node
    }),
    ...[...dir.files].sort().map((name) => {
      const path = prefix ? `${prefix}/${name}` : name
      const node = makeNode(name, path, true, [], `demo-file:${path}`)
      byId[`demo-file:${path}`] = node
      return node
    }),
  ]
  const root = makeNode(rootName, '', false, build(top, ''), 'root')
  byId.root = root
  return { root, byId }
}
