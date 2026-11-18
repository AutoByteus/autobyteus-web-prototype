// ios-demo-mode-279 (autobyteus-279): design-only state of the iOS app's demo.
//
// The iOS app opens its own `/mobile` screens on a built-in sample world ("Try demo" on the first screen, or the demo QR
// code `autobyteus://demo` scanned in the app or with the iPhone Camera). In this UI reference the app is the design
// route `/ios`; opening the demo sets a session flag and opens `/mobile`, whose screens then read the demo world below.
// Everything is invented. No node address, no credential, nothing is requested from anywhere.

import { MOBILE_RUNS } from '~/prototype/source-observation/mobile-world.mjs'
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
const REPLY_FILE = 'docs/release-notes-1.6.md'

const replyText = (content: string): string => {
  const asked = content.trim().replace(/\s+/g, ' ')
  const short = asked.length > 80 ? `${asked.slice(0, 77)}…` : asked
  return [
    `Here is how I would start on “${short}”.`,
    '',
    '1. Read what this run’s folder already has, starting with `docs/release-notes-1.6.md`.',
    '2. List the steps, who does each, and by when.',
    '3. Write the plan to the folder and post the short version here.',
    '',
    'This is the demo, so this answer is a sample. With your own node, your agent does the work and answers here the same way.',
  ].join('\n')
}

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
  const args = { path: REPLY_FILE }
  return [
    { delay: 150, frame: { type: 'AGENT_COMMAND_ACK', payload: { command_type: 'SEND_MESSAGE', run_id: runId, message_id: payload.message_id ?? '', dedupe_key: payload.dedupe_key ?? '', state: 'accepted', accepted: true, duplicate: false } } },
    { delay: 200, frame: status('running') },
    { delay: 100, frame: { type: 'TURN_STARTED', payload: { turn_id: turn } } },
    { delay: 700, frame: { type: 'SEGMENT_START', payload: { id: tool, turn_id: turn, segment_type: 'tool_call', metadata: { tool_name: 'read_file', arguments: args } } } },
    { delay: 200, frame: { type: 'SEGMENT_END', payload: { id: tool, turn_id: turn, metadata: { tool_name: 'read_file', arguments: args }, interrupted: false, reason: null, failed: false, error: null } } },
    { delay: 100, frame: { type: 'TOOL_EXECUTION_STARTED', payload: { invocation_id: tool, tool_name: 'read_file', turn_id: turn, arguments: args } } },
    { delay: 900, frame: { type: 'TOOL_EXECUTION_SUCCEEDED', payload: { invocation_id: tool, tool_name: 'read_file', turn_id: turn, arguments: args, result: 'Read 42 lines of docs/release-notes-1.6.md (sample file).' } } },
    { delay: 300, frame: { type: 'SEGMENT_START', payload: { id: text, turn_id: turn, segment_type: 'text', metadata: null } } },
    ...words(replyText(payload.content ?? '')).map((delta) => ({ delay: 70, frame: { type: 'SEGMENT_CONTENT', payload: { id: text, turn_id: turn, segment_type: 'text', delta } } })),
    { delay: 80, frame: { type: 'SEGMENT_END', payload: { id: text, turn_id: turn, metadata: null, interrupted: false, reason: null, failed: false, error: null } } },
    { delay: 120, frame: { type: 'TURN_COMPLETED', payload: { turn_id: turn, reason: null } } },
    { delay: 80, frame: status('idle') },
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
