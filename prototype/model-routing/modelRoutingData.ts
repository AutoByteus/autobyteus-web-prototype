/**
 * delegated-runtime-model-routing (design-only): Settings → Model Routing, the router conversation and the
 * choices shown in run Settings. Everything here is invented and illustrative; nothing is read from a real node.
 *
 * - The anchor "now" is fixed (2026-10-26 09:40 UTC) so every screen is repeatable.
 * - Runtimes and models are the ones of the "Agent runtimes now" fixture (`node-settings-fixtures.mjs`).
 * - Scenarios (local-storage key `autobyteus.prototype.scenario`):
 *     `populated`        Model Routing on, router active, a month of decisions, a taught knowledge note
 *     `routing_off`      switched off after use: history and knowledge kept
 *     `routing_fresh`    a node that never used it: off, nothing recorded
 *     `routing_on_empty` on and active, nothing recorded yet
 *     `routing_not_set`  on, the router has no runtime/model yet
 *     `routing_blocked`  on, the router's model is blocked by a used-up limit
 */
export const ANCHOR_MS = Date.parse('2026-10-26T09:40:00.000Z')
const DAY = 86_400_000
const HOUR = 3_600_000
const MIN = 60_000

export type RoutingSource = 'router' | 'agent_default' | 'team_default' | 'inherited'

export type RoutingChoice = Readonly<{
  /** The agent name as the delegation result and the Settings rows name it. */
  agent: string
  /** The agent's own run ID in this delegated copy (links a Settings row to its decision); null when no row is shown. */
  agentRunId: string | null
  kind: string | null
  runtime: string
  runtimeName: string
  model: string
  source: RoutingSource
  /** The router's one-sentence reason, or the note for an inherited launch. */
  reason: string | null
  /** A configured layer skipped before this choice (shown in the result, in the Settings row and in Decisions). */
  skipped?: Readonly<{ layer: 'agent_default' | 'team_default'; runtime: string; model: string; detail: string }>
}>

export type RoutingDelegation = Readonly<{
  id: string
  at: number
  /** The Project Task this copy works on (its key and title). */
  /** The Project Task's key; absent when the delegation is not for a saved Project Task. */
  taskKey: string | null
  taskTitle: string
  targetAddress: string
  targetName: string
  delegatorRunId: string
  delegatorName: string
  /** The node that runs the copy when it is not this one (its own router decided; the choice is recorded there, and shown here on the run's link). */
  node: string | null
  /** A delegation another node made to this node: the node it came from (its run is on that node, so it cannot be opened here). */
  from?: string | null
  /** The router failed or was not active: the note shown with the inherited launches. */
  failure: string | null
  choices: readonly RoutingChoice[]
}>

export const RUNTIME_NAMES: Readonly<Record<string, string>> = {
  codex_app_server: 'Codex', claude_agent_sdk: 'Claude', antigravity_cli: 'Antigravity', grok_build: 'Grok', autobyteus: 'AutoByteus',
}
/** Categorical slots in fixed order (validated palette: blue, orange, aqua, magenta, yellow). One runtime keeps its colour everywhere. */
export const RUNTIME_COLORS: Readonly<Record<string, string>> = {
  codex_app_server: '#2a78d6', claude_agent_sdk: '#eb6834', antigravity_cli: '#1baf7a', grok_build: '#e87ba4', autobyteus: '#eda100',
}

const CODEX = { runtime: 'codex_app_server', runtimeName: 'Codex', model: 'gpt-prototype-codex' }
const SONNET = { runtime: 'claude_agent_sdk', runtimeName: 'Claude', model: 'prototype-sonnet' }
const HAIKU = { runtime: 'claude_agent_sdk', runtimeName: 'Claude', model: 'prototype-haiku' }
const AGY = { runtime: 'antigravity_cli', runtimeName: 'Antigravity', model: 'prototype-agy' }
const LARGE = { runtime: 'autobyteus', runtimeName: 'AutoByteus', model: 'gpt-prototype-large' }

const SET = '/software_engineering_team'
const choice = (agent: string, kind: string | null, on: typeof CODEX, source: RoutingSource, reason: string | null, extra: Partial<RoutingChoice> = {}): RoutingChoice =>
  ({ agent, agentRunId: null, kind: source === 'router' ? kind : null, ...on, source, reason, ...extra })

const delegation = (n: number, ago: number, title: string, targetAddress: string, choices: RoutingChoice[], extra: Partial<RoutingDelegation> = {}): RoutingDelegation => ({
  id: `dec-${String(n).padStart(3, '0')}`, at: ANCHOR_MS - ago, taskKey: `autobyteus-${n < 100 ? 60 - n : 143 - n}`, taskTitle: title, targetAddress,
  targetName: targetAddress.slice(1).replace(/_/g, ' '), delegatorRunId: 'run-ptm-0001', delegatorName: 'Project Task Manager',
  node: null, failure: null, choices, ...extra,
})

/** The newest first. The first three are the Project Task Manager run's copies (their `agentRunId`s link the run's Settings rows). */
const recent = (): RoutingDelegation[] => [
  delegation(1, 28 * MIN, 'Image context files don\'t reach the model on the first turn', SET, [
    choice('solution_designer', 'design', SONNET, 'agent_default', null),
    choice('implementation_engineer', 'implementation', CODEX, 'router', 'Codex is signed in with 88% of its 5-hour limit left and fits a focused fix in the server.', { skipped: { layer: 'agent_default', runtime: 'claude_agent_sdk', model: 'prototype-opus', detail: 'Opus is blocked until Oct 28, 09:00 (Opus · weekly).' } }),
    choice('code_reviewer', 'code review', SONNET, 'router', 'Review wants a long context; Claude Sonnet has 1M tokens and its limit is not used up.'),
  ]),
  delegation(2, 2 * HOUR + 10 * MIN, 'Members of a delegated team can\'t reach the agent package creator', SET, [
    choice('solution_designer', 'design', SONNET, 'agent_default', null),
    choice('implementation_engineer', 'implementation', CODEX, 'router', 'Codex fits server changes and has the most limit left today.'),
    choice('code_reviewer', 'code review', SONNET, 'router', 'Claude Sonnet reviews the diff against the design with a long context.'),
  ]),
  delegation(3, 5 * HOUR + 40 * MIN, 'Token Meter accuracy: the context fill reads 97% right after compaction', SET, [
    choice('solution_designer', 'design', SONNET, 'agent_default', null),
    choice('implementation_engineer', 'implementation', CODEX, 'router', 'Codex is signed in, its models are not blocked, and the weekly limit still has 41% left.'),
    choice('code_reviewer', 'code review', SONNET, 'team_default', null),
  ]),
  delegation(4, 1 * DAY + 3 * HOUR, 'Write the 1.5 release notes', '/agent_package_creator', [
    choice('agent_package_creator', 'writing', AGY, 'router', 'You taught the router that writing goes to Antigravity; it is signed in.'),
  ]),
  delegation(5, 1 * DAY + 6 * HOUR, 'Compare competitor pricing pages for the desktop app', '/market_researcher', [
    choice('market_researcher', 'research', LARGE, 'router', 'A research Task needs web reading, not code; the AutoByteus provider has balance and no limit.'),
  ], { node: 'docker' }),
  delegation(6, 2 * DAY + 2 * HOUR, 'Plan the 1.6 launch campaign across email, social and the website', '/marketing_team', [
    choice('campaign_lead', 'writing', AGY, 'router', 'Campaign copy is writing; Antigravity is preferred for writing.'),
    choice('copywriter', 'writing', AGY, 'router', 'Same Task kind, same runtime, so the copy stays consistent.'),
    choice('designer', 'design', SONNET, 'router', 'Layout notes need a strong design model; Claude Sonnet has limit left.'),
  ], { node: 'docker' }),
  delegation(7, 2 * DAY + 9 * HOUR, 'Fix the pre-existing failing tests on the base branch', SET, [
    choice('solution_designer', 'design', SONNET, 'agent_default', null),
    choice('implementation_engineer', 'testing', CODEX, 'router', 'Test repair is repetitive; Codex is quick on it and had 94% of its 5-hour limit left.'),
    choice('code_reviewer', 'code review', SONNET, 'team_default', null),
  ]),
  delegation(8, 3 * DAY + 4 * HOUR, 'Triage the open desktop support threads', '/support_team', [
    choice('triage_lead', 'other', SONNET, 'inherited', 'The Model Router could not choose (no valid answer in 60 s); this agent runs on the delegating run\'s Claude · prototype-sonnet.'),
    choice('answer_writer', 'other', SONNET, 'inherited', 'The Model Router could not choose (no valid answer in 60 s); this agent runs on the delegating run\'s Claude · prototype-sonnet.'),
  ], { failure: 'no valid answer within 60 seconds.', node: null }),
  delegation(9, 4 * DAY + 1 * HOUR, 'Work Journal: a readable, runtime-independent record of each run', SET, [
    choice('solution_designer', 'design', SONNET, 'agent_default', null),
    choice('implementation_engineer', 'implementation', CODEX, 'router', 'Codex has the most limit left; the Task is a server and web change.'),
    choice('code_reviewer', 'code review', HAIKU, 'router', 'A small diff: a fast, cheap model is enough for the first review pass.'),
  ]),
  delegation(10, 5 * DAY + 5 * HOUR, 'Redesign the legacy token meter tooltip', SET, [
    choice('solution_designer', 'design', SONNET, 'agent_default', null),
    choice('implementation_engineer', 'implementation', CODEX, 'router', 'Small UI change; Codex has limit left.'),
    choice('code_reviewer', 'code review', SONNET, 'team_default', null),
  ]),
  delegation(11, 8 * DAY + 2 * HOUR, 'Draft an onboarding agent package for the pilot customers', '/agent_package_creator', [
    choice('agent_package_creator', 'writing', AGY, 'router', 'Writing goes to Antigravity (taught); the package is mostly prompts and text.'),
  ]),
  delegation(12, 10 * DAY + 7 * HOUR, 'Package the release-notes agent for the agent store', '/agent_package_creator', [
    choice('agent_package_creator', 'writing', SONNET, 'agent_default', null),
  ]),
  delegation(13, 12 * DAY + 3 * HOUR, 'Research how other tools show usage limits', '/market_researcher', [
    choice('market_researcher', 'research', LARGE, 'router', 'Web research; the AutoByteus provider has balance.'),
  ]),
  delegation(14, 15 * DAY + 8 * HOUR, 'Update the NFS guide for the new Docker commands', SET, [
    choice('solution_designer', 'design', SONNET, 'agent_default', null),
    choice('implementation_engineer', 'implementation', CODEX, 'router', 'Codex is the default choice for code and docs in the repo.'),
    choice('code_reviewer', 'code review', SONNET, 'team_default', null),
  ]),
  delegation(15, 19 * DAY + 2 * HOUR, 'Add computer-use checks to the browser tool', SET, [
    choice('solution_designer', 'design', SONNET, 'agent_default', null),
    choice('implementation_engineer', 'computer use', AGY, 'router', 'Needs a desktop to click through; Antigravity ran browser Tasks well in the past.'),
    choice('code_reviewer', 'code review', SONNET, 'team_default', null),
  ]),
  delegation(16, 24 * DAY + 6 * HOUR, 'Translate the release notes into Chinese and German', '/translator', [
    choice('translator', 'writing', SONNET, 'router', 'Translation is writing; Antigravity was not signed in that day, so Claude Sonnet.'),
  ], { node: 'docker' }),
]

/** Older history for the "All" period: the same kinds of work, every choice kept compact. */
const older = (): RoutingDelegation[] => {
  const rows: Array<[string, string, number]> = [
    ['Prepare the 1.4 release checklist', SET, 0], ['Write the onboarding email sequence', '/agent_package_creator', 1],
    ['Compare model prices for the token page', '/market_researcher', 2], ['Fix the Windows installer path bug', SET, 3],
    ['Draft the support FAQ', '/agent_package_creator', 4], ['Add retry to the update check', SET, 0],
    ['Document the Docker node setup', '/agent_package_creator', 1], ['Summarize the open design questions', '/market_researcher', 2],
    ['Test the paired phone flow', SET, 3], ['Clean up unused icons', '/agent_package_creator', 4],
    ['Review the memory sync copy', SET, 0], ['Check the Antigravity sign-in flow', '/agent_package_creator', 1],
  ]
  const patterns: RoutingChoice[][] = [
    [choice('solution_designer', 'design', SONNET, 'agent_default', null), choice('implementation_engineer', 'implementation', CODEX, 'router', 'Codex fits server work and had limit left.'), choice('code_reviewer', 'code review', SONNET, 'team_default', null)],
    [choice('agent_package_creator', 'writing', SONNET, 'router', 'Writing: Claude Sonnet writes clear prose.')],
    [choice('market_researcher', 'research', LARGE, 'router', 'Web research on the AutoByteus provider.')],
    [choice('solution_designer', 'design', SONNET, 'agent_default', null), choice('implementation_engineer', 'testing', CODEX, 'router', 'Test repair on Codex.'), choice('code_reviewer', 'code review', HAIKU, 'router', 'Small diff; a fast model.')],
    [choice('agent_package_creator', null, SONNET, 'inherited', 'Model Routing was off; this agent ran on the delegating run\'s launch.')],
  ]
  return rows.map(([title, address, pattern], index) => delegation(100 + index, (34 + index * 9) * DAY, title, address, patterns[pattern].map((item) => ({ ...item }))))
}

/** The run IDs of the Project Task Manager run's copies, by delegation, so a Settings row finds its decision. */
export const COPY_RUN_IDS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  'dec-001': { solution_designer: 'ptm-set-0003-solution_designer', implementation_engineer: 'ptm-set-0003-implementation_engineer', code_reviewer: 'ptm-set-0003-code_reviewer' },
  'dec-002': { solution_designer: 'ptm-set-0002-solution_designer', implementation_engineer: 'ptm-set-0002-implementation_engineer', code_reviewer: 'ptm-set-0002-code_reviewer' },
  'dec-003': { solution_designer: 'ptm-set-0001-solution_designer', implementation_engineer: 'ptm-set-0001-implementation_engineer', code_reviewer: 'ptm-set-0001-code_reviewer' },
}

export const allDelegations = (): RoutingDelegation[] => [...recent(), ...older()].map((item) => ({
  ...item,
  choices: item.choices.map((entry) => ({ ...entry, agentRunId: COPY_RUN_IDS[item.id]?.[entry.agent] ?? null })),
}))

export type KnowledgeVersion = Readonly<{ text: string; at: number }>

export const KNOWLEDGE_CURRENT = `Writing goes to Antigravity. Design stays on Claude Sonnet; use Opus only when a Task asks for it. Research goes to the AutoByteus provider (it reads the web, no code).

Codex is best for backend code, but its weekly limit is the tight one (41% left on Oct 26, resets Oct 30); its 5-hour limit refills overnight. Opus is used up until Oct 28, 09:00. Antigravity reports no limits, so treat it as available when signed in. Haiku reviews small diffs well.
`

export const KNOWLEDGE_PREVIOUS = `Writing goes to Antigravity. Design stays on Claude Sonnet; use Opus only when a Task asks for it.

Codex's weekly limit is the tight one (41% left on Oct 26, resets Oct 30). Opus is used up until Oct 28, 09:00.
`

/** What another node (office-mac) delegated to this node: this node's router chose; the delegating run is on the other node. */
const incoming = (): RoutingDelegation[] => [
  { id: 'inc-001', at: ANCHOR_MS - 3 * HOUR, taskKey: null, taskTitle: 'Plan the 1.6 launch campaign across email, social and the website', targetAddress: '/marketing_team', targetName: 'marketing team',
    delegatorRunId: '', delegatorName: 'Project Task Manager', node: null, from: 'office-mac', failure: null, choices: [
      choice('campaign_lead', 'writing', AGY, 'router', 'Campaign copy is writing; Antigravity is preferred for writing.'),
      choice('copywriter', 'writing', AGY, 'router', 'Same Task kind, same runtime, so the copy stays consistent.'),
      choice('designer', 'design', SONNET, 'router', 'Layout notes need a strong design model; Claude Sonnet has limit left.'),
    ] },
  { id: 'inc-002', at: ANCHOR_MS - 1 * DAY - 6 * HOUR, taskKey: null, taskTitle: 'Compare competitor pricing pages for the desktop app', targetAddress: '/market_researcher', targetName: 'market researcher',
    delegatorRunId: '', delegatorName: 'Project Task Manager', node: null, from: 'office-mac', failure: null, choices: [
      choice('market_researcher', 'research', LARGE, 'router', 'A research Task needs web reading, not code; the AutoByteus provider has balance and no limit.'),
    ] },
]

export type RoutingScenario = Readonly<{
  enabled: boolean
  router: Readonly<{ runtime: string; model: string }> | null
  delegations: readonly RoutingDelegation[]
  /** Copies this node's runs delegated to other nodes (shown on the run's Settings rows and in the delegate_task result; their decisions are on those nodes). */
  outgoing: readonly RoutingDelegation[]
  knowledge: Readonly<{ current: KnowledgeVersion; previous: KnowledgeVersion | null }> | null
}>

const CLAUDE_ROUTER = { runtime: 'claude_agent_sdk', model: 'prototype-sonnet' }

export const incomingDelegations = incoming

export const scenarioFor = (name: string): RoutingScenario => {
  const full = allDelegations()
  const local = full.filter((item) => !item.node)
  const outgoing = full.filter((item) => item.node)
  const knowledge = {
    current: { text: KNOWLEDGE_CURRENT, at: ANCHOR_MS - 2 * HOUR - 25 * MIN },
    previous: { text: KNOWLEDGE_PREVIOUS, at: ANCHOR_MS - 1 * DAY - 6 * HOUR },
  }
  const none = { delegations: [], outgoing: [], knowledge: null }
  switch (name) {
    case 'routing_off': return { enabled: false, router: CLAUDE_ROUTER, delegations: local, outgoing, knowledge }
    case 'routing_fresh': return { enabled: false, router: null, ...none }
    case 'routing_on_empty': return { enabled: true, router: CLAUDE_ROUTER, ...none }
    case 'routing_not_set': return { enabled: true, router: null, ...none }
    case 'routing_blocked': return { enabled: true, router: { runtime: 'codex_app_server', model: 'gpt-prototype-codex-mini' }, delegations: local, outgoing, knowledge }
    default: return { enabled: true, router: CLAUDE_ROUTER, delegations: local, outgoing, knowledge }
  }
}
