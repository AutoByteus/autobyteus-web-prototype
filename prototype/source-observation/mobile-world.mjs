/**
 * The phone's synthetic world: the runs a paired node lists, each run's tree, a conversation that shows every message and
 * segment type, the Activity, Messages, Files and Artifacts of a run. Everything is invented and illustrative; nothing is
 * read from a real node and no title is anyone's real conversation.
 *
 * It is plain data and pure functions, so the UI reference (the phone's stand-in stores, `utils/apolloClient.ts`) and the
 * disposable observation node that serves the pinned source for comparison read the same world. Times are offsets from the
 * moment a page loads, so the ages ("2m", "6h", "3d") are the same on every run.
 *
 * Nodes (invented): `docker` is reachable, `office-mac` is not.
 */

/** Minutes since the last activity (top-level runs and delegated runs). */
const member = (id, name, status, extra = {}) => ({ id, kind: 'member', name, status, minutes: 3, ...extra })

const SET_MEMBERS = (n, designerStatus, engineerStatus, reviewerStatus) => [
  member(`mx-set-${n}-solution_designer`, 'solution_designer', designerStatus),
  member(`mx-set-${n}-implementation_engineer`, 'implementation_engineer', engineerStatus),
  member(`mx-set-${n}-code_reviewer`, 'code_reviewer', reviewerStatus),
]

/** Top-level runs, newest first (the order the product's Runs view settles: last activity). */
export const MOBILE_RUNS = [
  {
    id: 'mx-ptm-0001', kind: 'agent', name: 'Project Task Manager', summary: 'Dispatch the approved desktop app Tasks', status: 'running', minutes: 2,
    children: [
      {
        id: 'mx-set-0001', kind: 'team', name: 'Software Engineering Team', summary: 'Image context files don’t reach the model on the first turn', status: 'running', minutes: 4,
        children: [
          ...SET_MEMBERS('0001', 'idle', 'running', 'idle'),
          // A task agent started by a team member sits at the member's level, as on the desktop.
          { id: 'mx-set-0001-code-searcher', kind: 'agent', name: 'Code Searcher', summary: 'Find where context files are attached', status: 'running', minutes: 1 },
        ],
      },
      { id: 'mx-apc-0001', kind: 'agent', name: 'Agent Package Creator', summary: 'Package the release-notes agent for the agent store', status: 'idle', minutes: 9 },
      {
        id: 'mx-set-0002', kind: 'team', name: 'Software Engineering Team', summary: 'Members of a delegated team can’t reach the package creator', status: 'idle', minutes: 18,
        children: SET_MEMBERS('0002', 'idle', 'idle', 'idle'),
      },
      {
        id: 'mx-mkt-0001', kind: 'team', name: 'Marketing Team', summary: 'Plan the 1.6 launch campaign across email, social and the website', status: 'running', minutes: 6, node: 'docker',
        children: [
          member('mx-mkt-0001-campaign_lead', 'campaign_lead', 'running', { node: 'docker' }),
          member('mx-mkt-0001-copywriter', 'copywriter', 'idle', { node: 'docker' }),
          member('mx-mkt-0001-designer', 'designer', 'idle', { node: 'docker' }),
        ],
      },
      { id: 'mx-mkr-0001', kind: 'agent', name: 'Market Researcher', summary: 'Compare competitor pricing pages for the desktop app', status: 'idle', minutes: 31, node: 'docker' },
      {
        id: 'mx-sup-0001', kind: 'team', name: 'Support Team', summary: 'Triage the open desktop support threads', status: 'offline', minutes: 45, node: 'office-mac',
        children: [
          member('mx-sup-0001-triage_lead', 'triage_lead', 'offline', { node: 'office-mac' }),
          member('mx-sup-0001-answer_writer', 'answer_writer', 'offline', { node: 'office-mac' }),
        ],
      },
    ],
  },
  { id: 'mx-da-0001', kind: 'agent', name: 'Daily Assistant', summary: 'Summarize the 1.6 release notes for the pilot customers', status: 'idle', minutes: 6 },
  {
    id: 'mx-org-0001', kind: 'org', name: 'Product Launch Org', summary: 'Prepare the 1.6 launch', status: 'running', minutes: 24,
    children: [
      member('mx-org-0001-launch_lead', 'launch_lead', 'running', { minutes: 24 }),
      member('mx-org-0001-content_writer', 'content_writer', 'idle', { minutes: 40 }),
      member('mx-org-0001-release_manager', 'release_manager', 'idle', { minutes: 52 }),
    ],
  },
  {
    id: 'mx-set-0003', kind: 'team', name: 'Software Engineering Team', summary: 'Review the invoice export migration', status: 'idle', minutes: 26 * 60,
    children: SET_MEMBERS('0003', 'offline', 'offline', 'offline'),
  },
  { id: 'mx-cdx-0001', kind: 'agent', name: 'Codex', summary: 'Fix the failing probe test on the base branch', status: 'offline', minutes: 5 * 60 },
  { id: 'mx-da-0002', kind: 'agent', name: 'Daily Assistant', summary: 'Plan the week: school pickups, dentist, budget review', status: 'offline', minutes: 55 },
  { id: 'mx-da-0003', kind: 'agent', name: 'Daily Assistant', summary: 'hello', status: 'offline', minutes: 9 * 60 },
  { id: 'mx-ptm-0002', kind: 'agent', name: 'Project Task Manager', summary: 'Which Tasks are blocked this week?', status: 'offline', minutes: 2 * 24 * 60 },
  { id: 'mx-apc-0002', kind: 'agent', name: 'Agent Package Creator', summary: 'Make a Product Video Producer package for the marketing team', status: 'offline', minutes: 3 * 24 * 60 },
  { id: 'mx-da-0004', kind: 'agent', name: 'Daily Assistant', summary: 'Compare two flights to Berlin for the March trip', status: 'offline', minutes: 4 * 24 * 60 },
  { id: 'mx-cdx-0002', kind: 'agent', name: 'Codex', summary: 'Rename the export helpers and update the imports', status: 'offline', minutes: 5 * 24 * 60 },
  { id: 'mx-set-0004', kind: 'team', name: 'Software Engineering Team', summary: 'Simplify the NFS Guide and remove redundant steps', status: 'offline', minutes: 6 * 24 * 60, children: SET_MEMBERS('0004', 'offline', 'offline', 'offline') },
  { id: 'mx-da-0005', kind: 'agent', name: 'Daily Assistant', summary: 'Summarize the lease renewal and list what to ask the landlord', status: 'offline', minutes: 8 * 24 * 60 },
].sort((a, b) => a.minutes - b.minutes)

/** The peer nodes the paired node knows. Invented. */
export const PEERS = [
  { name: 'docker', reachable: true, agents: 6, teams: 3 },
  { name: 'office-mac', reachable: false, agents: 4, teams: 2 },
]
export const UNREACHABLE_NODES = new Set(['office-mac'])

export const flattenRuns = (nodes) => nodes.flatMap((node) => [node, ...flattenRuns(node.children ?? [])])
const BY_ID = new Map(flattenRuns(MOBILE_RUNS).map((node) => [node.id, node]))
export const worldNode = (id) => BY_ID.get(String(id ?? '')) ?? null
export const isWorldRunId = (id) => BY_ID.has(String(id ?? ''))

/** The run whose conversation shows every message and segment type, in one scrollable conversation. */
export const RICH_RUN_ID = 'mx-da-0001'

/** The agent definition a run's name stands for (`utils/apolloClient.ts` fills the id of the fixture's definitions). */
export const AGENT_NAME_BY_RUN = (node) => node?.name ?? 'Daily Assistant'

const iso = (at, offset = 0) => new Date(at + offset).toISOString()
const stamp = (at, offset) => new Date(at + offset)

/** Projection entries of an opened run (`GetRunProjection`): a short invented conversation. */
export const projectionEntriesFor = (node, at) => {
  const seconds = (offset) => Math.floor((at + offset) / 1000)
  if (node.id === 'mx-ptm-0001') {
    return [
      { kind: 'message', role: 'user', content: 'Dispatch the approved desktop app Tasks.', ts: seconds(0) },
      { kind: 'tool_call', invocationId: 'mx-ptm-d1', toolName: 'delegate_task', toolArgs: { recipient_address: '/software_engineering_team', description: 'Image context files don’t reach the model on the first turn' }, toolResult: 'Started Software Engineering Team.', ts: seconds(10_000) },
      { kind: 'tool_call', invocationId: 'mx-ptm-d2', toolName: 'delegate_task', toolArgs: { recipient_address: '/marketing_team', node: 'docker', description: 'Plan the 1.6 launch campaign' }, toolResult: 'Started Marketing Team on node docker.', ts: seconds(20_000) },
      { kind: 'message', role: 'assistant', content: 'Delegated six Tasks: two to copies of the Software Engineering Team, one to the Agent Package Creator, two to the Marketing Team and the Market Researcher on docker, and one to the Support Team on office-mac. I will report when they finish.', ts: seconds(40_000) },
    ]
  }
  if (node.kind === 'member') {
    return [
      { kind: 'inter_agent_message', role: 'user', content: 'You received a message from sender name: project task manager, sender address: /project_task_manager, sender id: project_task_manager\nmessage:\nPlease work on the Task you were assigned.', ts: seconds(0) },
      { kind: 'message', role: 'assistant', content: 'I will post the result here when it is ready.', ts: seconds(40_000) },
    ]
  }
  return [
    { kind: 'message', role: 'user', content: node.summary, ts: seconds(0) },
    { kind: 'message', role: 'assistant', content: 'Here is a first pass. Tell me what to change and I will keep this conversation as the one place we work on it.', ts: seconds(40_000) },
  ]
}

const MARKDOWN_ANSWER = [
  '## Release 1.6 at a glance',
  '',
  'The pilot customers get **three changes** that matter to them, and one date that moved. Here is the short version; the longer notes are in `docs/release-notes-1.6.md`.',
  '',
  '### What changed',
  '',
  '1. The export screen now keeps your filters when you leave and come back.',
  '2. Invoices can be sent in the customer’s language, with the *currency* formatted for their country.',
  '3. A failed import now says which row failed, not only that something did.',
  '',
  '### Before you upgrade',
  '',
  '- Back up the `exports/` folder.',
  '- Update the connector to **2.4** or later.',
  '- Re-run the sample import once; it takes about a minute.',
  '',
  'The upgrade check looks like this:',
  '',
  '```bash',
  'pnpm run upgrade:check --target 1.6',
  '```',
  '',
  'and the settings file keeps this shape:',
  '',
  '```json',
  '{',
  '  "release": "1.6",',
  '  "keepFilters": true,',
  '  "invoiceLanguage": "customer"',
  '}',
  '```',
  '',
  'A small helper that formats the date for the announcement:',
  '',
  '```ts',
  'export function announcementDate(date: Date, locale = "en-GB"): string {',
  '  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(date)',
  '}',
  '```',
  '',
  '| Area | Before | In 1.6 |',
  '| --- | --- | --- |',
  '| Export filters | Reset on leave | Kept |',
  '| Invoice language | Account language | Customer language |',
  '| Import errors | Count only | Row and reason |',
  '',
  '> The new date is **Thursday, 12 March**. Everything above ships together.',
  '',
  'Questions? Reply here and I will draft the message for the pilot customers.',
].join('\n')

const TERMINAL_LOG = ['9f3a1c2 Keep export filters when leaving the screen', '4b7d0e8 Format invoice currency by customer country', 'c21e5a9 Name the failing row in import errors', 'a07f6b3 Update connector minimum to 2.4', '5de8c40 Fix the intro typo in the release notes']

/**
 * The invented conversation of the rich run, as the conversation store holds it (`Conversation`): a user message with
 * attachments, then an agent answer with every segment type, a second user message, and an agent turn with an inter-agent
 * message, a system task notification and a final text. Built in the page (the node's stored run has no such mix).
 */
export const richConversation = (runId, at) => {
  const tool = (extra) => ({ logs: [], result: null, error: null, arguments: {}, ...extra })
  return {
    id: runId,
    createdAt: iso(at, 0),
    updatedAt: iso(at, 90_000),
    agentName: 'Daily Assistant',
    messages: [
      {
        type: 'user',
        timestamp: stamp(at, 0),
        text: 'Summarize the 1.6 release notes for the pilot customers. Check the changelog, show me the latest commits and fix the typo in the intro.',
        contextFilePaths: [
          { kind: 'workspace_path', id: 'ctx-1', locator: 'docs/release-notes-1.6.md', displayName: 'release-notes-1.6.md', type: 'Markdown' },
          { kind: 'workspace_path', id: 'ctx-2', locator: 'docs/dashboard-before.png', displayName: 'dashboard-before.png', type: 'Image' },
          { kind: 'workspace_path', id: 'ctx-3', locator: 'docs/pilot-customers.csv', displayName: 'pilot-customers.csv', type: 'Csv' },
        ],
      },
      {
        type: 'ai',
        timestamp: stamp(at, 8_000),
        text: '',
        isComplete: true,
        segments: [
          { type: 'think', content: 'The pilot customers care about the new date and the migration steps. I should read the changelog first, then look at the latest commits, fix the typo and write the summary.' },
          { type: 'text', content: 'I’ll start by reading the changelog and the commit history.' },
          { type: 'tool_call', invocationId: 'mx-rich-t1', toolName: 'read_file', ...tool({ arguments: { path: 'docs/release-notes-1.6.md' }, status: 'success', result: 'Read 84 lines.' }) },
          { type: 'tool_call', invocationId: 'mx-rich-t2', toolName: 'fetch_url', ...tool({ arguments: { url: 'https://example.com/status/1.6' }, status: 'error', error: 'The request timed out after 30 seconds.' }) },
          { type: 'terminal_command', invocationId: 'mx-rich-t3', toolName: 'run_terminal_command', command: 'git log --oneline -5', description: 'Show the five latest commits', ...tool({ arguments: { command: 'git log --oneline -5' }, status: 'success', logs: TERMINAL_LOG, result: { stdout: TERMINAL_LOG.join('\n'), exit_code: 0 } }) },
          { type: 'edit_file', invocationId: 'mx-rich-t4', toolName: 'edit_file', path: 'docs/release-notes-1.6.md', language: 'markdown', originalContent: '@@ -1,3 +1,3 @@\n-# Release 1.6 — whats new\n+# Release 1.6 — what’s new\n \n This release keeps your filters.', ...tool({ arguments: { path: 'docs/release-notes-1.6.md' }, status: 'success', result: 'Edited docs/release-notes-1.6.md.' }) },
          { type: 'write_file', invocationId: 'mx-rich-t5', toolName: 'write_file', path: 'docs/pilot-summary.md', language: 'markdown', originalContent: '# Pilot summary\n\nThree changes, one new date: Thursday, 12 March.\n', ...tool({ arguments: { path: 'docs/pilot-summary.md' }, status: 'success', result: 'Wrote docs/pilot-summary.md.' }) },
          { type: 'terminal_command', invocationId: 'mx-rich-t6', toolName: 'run_terminal_command', command: 'pnpm run upgrade:check --target 1.6', description: 'Run the upgrade check', ...tool({ arguments: { command: 'pnpm run upgrade:check --target 1.6' }, status: 'executing', logs: ['Checking connector version…'] }) },
          { type: 'text', content: MARKDOWN_ANSWER },
          { type: 'media', mediaType: 'image', urls: ['/rest/media/images/release-1-6-banner.svg'] },
          { type: 'error', code: 'PROVIDER_OVERLOADED', message: 'The model provider is busy. Try again in a moment.', details: 'Request mx-synthetic-0042 was refused with status 529.', providerStatus: 529, providerCode: 'overloaded', providerRequestId: 'req-synthetic-0042' },
        ],
      },
      {
        type: 'user',
        timestamp: stamp(at, 70_000),
        text: 'Thanks. Anything the project manager said that I should know?',
      },
      {
        type: 'ai',
        timestamp: stamp(at, 80_000),
        text: '',
        isComplete: true,
        segments: [
          { type: 'inter_agent_message', senderAgentRunId: 'mx-ptm-0001', recipientRoleName: '', messageType: 'agent_message', content: 'The pilot customers asked for the new date in writing. Please include it in the summary and mention the connector minimum.' },
          { type: 'system_task_notification', senderId: 'system', content: '[Platform notice — skill updated]\nThe following skills you use changed on disk since you last read them:\n- release-notes (/synthetic/skills/release-notes/SKILL.md): SKILL.md' },
          { type: 'text', content: 'Yes: they want the date **in writing**, and the connector minimum (`2.4`) mentioned. Both are in the summary I wrote.' },
        ],
      },
    ],
  }
}

/** What the run's Activity screen lists, as the projection of a stored run carries it (`GetRunProjection.activities`). */
export const activitiesFor = (node, at) => {
  if (!node || node.status === 'offline') return []
  const tool = (n, toolName, type, contextText, status, args, extra = {}) => ({
    kind: 'tool', invocationId: `${node.id}-a${n}`, toolName, type, status, contextText, arguments: args, logs: [],
    result: status === 'success' ? 'ok' : null, error: null, ts: Math.floor((at + n * 20_000) / 1000), ...extra,
  })
  if (node.id === 'mx-ptm-0001') {
    return [
      tool(1, 'delegate_task', 'tool_call', '/software_engineering_team', 'success', { recipient_address: '/software_engineering_team' }),
      tool(2, 'delegate_task', 'tool_call', '/marketing_team on docker', 'success', { recipient_address: '/marketing_team', node: 'docker' }),
      tool(3, 'delegate_task', 'tool_call', '/support_team on office-mac', 'success', { recipient_address: '/support_team', node: 'office-mac' }),
    ]
  }
  if (node.id === RICH_RUN_ID) {
    return [
      tool(1, 'read_file', 'tool_call', 'docs/release-notes-1.6.md', 'success', { path: 'docs/release-notes-1.6.md' }),
      tool(2, 'fetch_url', 'tool_call', 'https://example.com/status/1.6', 'error', { url: 'https://example.com/status/1.6' }, { error: 'The request timed out after 30 seconds.' }),
      tool(3, 'run_terminal_command', 'terminal_command', 'git log --oneline -5', 'success', { command: 'git log --oneline -5' }, { logs: TERMINAL_LOG, result: { stdout: TERMINAL_LOG.join('\n'), exit_code: 0 } }),
      tool(4, 'edit_file', 'edit_file', 'docs/release-notes-1.6.md', 'success', { path: 'docs/release-notes-1.6.md' }),
      tool(5, 'write_file', 'write_file', 'docs/pilot-summary.md', 'success', { path: 'docs/pilot-summary.md' }),
      tool(6, 'run_terminal_command', 'terminal_command', 'pnpm run upgrade:check --target 1.6', 'executing', { command: 'pnpm run upgrade:check --target 1.6' }, { logs: ['Checking connector version…'] }),
    ]
  }
  if (node.kind === 'member' || node.kind === 'agent') {
    return [
      tool(1, 'read_file', 'tool_call', 'src/context/upload.ts', 'success', { path: 'src/context/upload.ts' }),
      tool(2, 'edit_file', 'edit_file', 'src/context/upload.ts', 'success', { path: 'src/context/upload.ts' }),
      tool(3, 'run_terminal_command', 'terminal_command', 'pnpm test upload', node.status === 'running' ? 'executing' : 'success', { command: 'pnpm test upload' }),
    ]
  }
  return []
}

/** The background tasks of a run (Activity, above the tool calls). */
export const backgroundTasksFor = (node, at) => {
  if (!node) return []
  const sec = (offset) => iso(at, offset)
  // phone-baseline-refresh-279 (autobyteus-448): an idle delegated agent with two background tasks running, and a Team
  // member with one (its Team row shows the sum).
  if (node.id === 'mx-apc-0001') {
    return [
      { taskId: 'mx-bg-apc-1', kind: 'shell', description: 'Bundle the release-notes agent', command: 'pnpm run package:agent --watch', status: 'running', summary: null, endReason: null, exitCode: null, startedAt: sec(20_000) },
      { taskId: 'mx-bg-apc-2', kind: 'shell', description: 'Validate the package manifest', command: 'pnpm run package:validate --watch', status: 'running', summary: null, endReason: null, exitCode: null, startedAt: sec(25_000) },
    ]
  }
  if (node.id === 'mx-set-0002-implementation_engineer') {
    return [{ taskId: 'mx-bg-set-1', kind: 'shell', description: 'Run the package tests', command: 'pnpm test --watch', status: 'running', summary: null, endReason: null, exitCode: null, startedAt: sec(15_000) }]
  }
  if (node.id !== RICH_RUN_ID && node.id !== 'mx-ptm-0001') return []
  return [
    { taskId: 'mx-bg-1', kind: 'shell', description: 'Watch the upgrade check', command: 'pnpm run upgrade:check --watch', status: 'running', summary: null, endReason: null, startedAt: sec(30_000), exitCode: null },
    { taskId: 'mx-bg-2', kind: 'shell', description: 'Build the release notes site', command: 'pnpm run docs:build', status: 'completed', summary: 'exit code 0', endReason: null, startedAt: sec(10_000), exitCode: 0 },
    { taskId: 'mx-bg-3', kind: 'shell', description: 'Index the changelog', command: 'pnpm run docs:index', status: 'failed', summary: 'exit code 1', endReason: null, startedAt: sec(5_000), exitCode: 1 },
    // phone-baseline-refresh-279: a task the runtime stopped at its time limit (its end line, not the summary).
    { taskId: 'mx-bg-4', kind: 'shell', description: 'Crawl the docs for broken links', command: 'pnpm run docs:links', status: 'stopped', summary: 'Task was stopped after reaching its background time limit', endReason: 'time_limit', startedAt: sec(2_000), exitCode: null },
  ]
}

/** How many background tasks a run's agent has running (its status's count, autobyteus-448); a stopped run has none. */
export const backgroundTasksRunningOf = (node) => (!node || node.status === 'offline' ? 0
  : backgroundTasksFor(node, 0).filter((task) => task.status === 'running').length)

/**
 * The messages one participant sent or received in its Team (`collaborationParticipantMessages`, as the node answers it):
 * a member's run shows them under Messages. Counterparts are the other members of the same Team.
 */
export const participantMessagesFor = (node, at) => {
  if (!node || node.kind !== 'member') return { messages: [], pastParticipants: [] }
  const team = flattenRuns(MOBILE_RUNS).find((n) => (n.kind === 'team' || n.kind === 'org') && n.children?.some((c) => c.id === node.id))
  const others = (team?.children ?? []).filter((c) => c.id !== node.id)
  if (!others.length) return { messages: [], pastParticipants: [] }
  const row = (n, from, to, content, referenceFiles = []) => ({
    messageId: `${node.id}-m${n}`, senderAgentRunId: from.id, receiverAgentRunId: to.id, content, messageType: 'direct_message',
    referenceFiles, createdAt: iso(at, n * 90_000),
  })
  return {
    messages: [
      row(1, others[0], node, 'Requirements are approved. Start with the first-turn upload path and keep the change small.', ['docs/requirements.md', 'docs/design-spec.md']),
      row(2, node, others[0], 'Found it: the context files are attached after the first send. I am moving the attach step before it.', ['src/context/upload.ts']),
      row(3, others[others.length - 1], node, 'Please add a test for the first-turn case before you hand over.'),
    ],
    pastParticipants: [],
  }
}

/** What an opened reference file shows. Invented. */
export const referenceText = (path) => path.endsWith('.ts')
  ? 'export function attachContextFiles(run: Run, files: ContextFile[]): void {\n  // Attach before the first send so the model sees them on turn one.\n  for (const file of files) run.context.add(file)\n}\n'
  : path.includes('design')
    ? '# Design: first-turn context files\n\nAttach the context files while the run is created, not after the first message is sent.\n\n## Changes\n- Move the attach step before the first send.\n- Keep the files when the run is promoted to its permanent id.\n'
    : '# Requirements: first-turn context files\n\n- A context file added before the first message reaches the model on that message.\n- A failed upload is shown on the run, not silently dropped.\n'

/** The workspace's files (Files screen): a small invented tree. */
export const WORKSPACE_FILES = {
  'README.md': '# Prototype workspace\n\nA small invented project used to show the phone’s Files screen.\n',
  'docs/release-notes-1.6.md': '# Release 1.6 — what’s new\n\nThis release keeps your filters.\n\n- Export filters are kept\n- Invoices in the customer’s language\n- Import errors name the row\n',
  'docs/pilot-summary.md': '# Pilot summary\n\nThree changes, one new date: Thursday, 12 March.\n',
  'src/context/upload.ts': 'export function attachContextFiles(run: Run, files: ContextFile[]): void {\n  for (const file of files) run.context.add(file)\n}\n',
  'src/index.ts': 'export * from "./context/upload"\n',
  'package.json': '{\n  "name": "prototype-workspace",\n  "version": "1.6.0"\n}\n',
}

const LAUNCH = {
  runtime_kind: 'autobyteus', llm_model_identifier: 'mock/gpt-prototype', llm_config: { temperature: 0.2 },
  auto_execute_tools: false, workspace_root_path: '/synthetic/prototype-workspace',
}

/** A world Team run's stored execution tree (`GetTeamRunResumeConfig`): its members are the node's children. */
export const teamResumeConfigFor = (node, at) => {
  const members = node.children ?? []
  return {
    teamRunId: node.id, isActive: false,
    executionTree: {
      created_at: iso(at), archived_at: null, application_binding: null, handoffs: [],
      root_team: {
        address: '/', team_definition_id: 'team-product', team_definition_name: node.name, team_run_id: node.id,
        coordinator_address: `/${members[0]?.name}`, default_launch_configuration: LAUNCH,
        members: members.map((m) => ({
          kind: 'configured_agent', address: `/${m.name}`, agent_definition_id: 'agent-researcher', role: null, description: null,
          agent_run_id: m.id, platform_agent_run_id: null, launch_configuration: LAUNCH,
        })),
      },
    },
    closedTaskExecutions: [], remoteTaskExecutions: [], modelConfigEditability: { editable: true, reason: null },
  }
}

/** The team a member belongs to, for a member's conversation. */
export const teamOfMember = (memberId) => flattenRuns(MOBILE_RUNS).find((n) => (n.kind === 'team' || n.kind === 'org') && n.children?.some((c) => c.id === memberId)) ?? null

/** The workspace search's answer: the paths of the node's folder tree (invented) that contain the query. */
export const searchFilePaths = (query) => ['docs/evidence.md', 'requirements.md'].filter((path) => path.toLowerCase().includes(String(query ?? '').trim().toLowerCase()))

/** The files a run wrote or edited (`GetRunFileChanges`: the Artifacts screen). Only the rich run has any. */
export const fileChangesFor = (node, at) => {
  if (!node || node.id !== RICH_RUN_ID) return []
  const change = (n, path, type, sourceTool, content, status = 'available') => ({
    id: `${node.id}:${path}`, runId: node.id, path, type, status, sourceTool, sourceInvocationId: `mx-rich-t${n}`, content,
    createdAt: iso(at, n * 5_000), updatedAt: iso(at, n * 5_000),
  })
  return [
    change(5, 'docs/pilot-summary.md', 'file', 'write_file', '# Pilot summary\n\nThree changes, one new date: **Thursday, 12 March**.\n\n- Export filters are kept\n- Invoices in the customer’s language\n- Import errors name the row\n'),
    change(4, 'docs/release-notes-1.6.md', 'file', 'edit_file', '# Release 1.6 — what’s new\n\nThis release keeps your filters.\n'),
    change(7, 'docs/dashboard-after.png', 'image', 'generated_output', null, 'pending'),
  ]
}
