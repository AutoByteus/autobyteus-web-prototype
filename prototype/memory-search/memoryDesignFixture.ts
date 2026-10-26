/**
 * work-journal-search (design-only): the Memory page with memory search, the Work Journal view and the memory index.
 *
 * Everything here is invented and illustrative. Nothing is read from a real node, a real run or a real journal:
 * - agents, runs, teams and task teams (names, IDs, workspaces, days) are made up;
 * - the memory search is scripted: a cue is matched to a few topics by keywords and answers a fixed, ordered result
 *   (the product's real search, its ranking and its index are not implemented);
 * - a Work Journal file is generated line by line from small word pools and a seeded random generator, with a few
 *   planted passages (the passages the scripted results point at). IPs and domains use the documentation ranges
 *   (203.0.113.x, 198.51.100.x, *.example.net).
 *
 * Turned off with the other design-only layers (`autobyteus.prototype.designOnlyLayers=off`).
 */

export type MemoryScenario = string

export const NOW = '2026-10-26T09:30:00.000Z'
const DAY = 86_400_000

/* ------------------------------------------------------------------ memory index (pipeline) */

export type StepId = 'runs' | 'journals' | 'text' | 'meaning'
export type StepState = 'waiting' | 'running' | 'done' | 'failed'
export interface IndexStep { id: StepId; state: StepState; done: number; total: number; message?: string | null }
export type IndexPhase = 'needs_index' | 'building' | 'ready' | 'failed'
export interface IndexStatus {
  phase: IndexPhase
  steps: IndexStep[]
  /** The embedding model the meaning index was built with, and the one chosen on Server Settings → Embedding now. */
  builtWithModel: string | null
  activeModel: string
  updatedAt: string | null
}

export const RUN_COUNT = 3654
export const FILE_COUNT = 7385
export const ACTIVE_MODEL = 'nomic-embed-text v1.5'
const OLD_MODEL = 'granite-embedding R2'

const steps = (state: Record<StepId, [StepState, number]>, message?: Partial<Record<StepId, string>>): IndexStep[] => (
  (['runs', 'journals', 'text', 'meaning'] as StepId[]).map(id => ({
    id,
    state: state[id][0],
    done: state[id][1],
    total: id === 'text' || id === 'meaning' ? FILE_COUNT : RUN_COUNT,
    message: message?.[id] ?? null,
  }))
)

/** The starting state of the memory index for a scenario (a reload resets it). */
export const initialIndexStatus = (scenario: MemoryScenario): IndexStatus => {
  const done = (n: number): [StepState, number] => ['done', n]
  const ready: IndexStatus = {
    phase: 'ready',
    steps: steps({ runs: done(RUN_COUNT), journals: done(RUN_COUNT), text: done(FILE_COUNT), meaning: done(FILE_COUNT) }),
    builtWithModel: ACTIVE_MODEL,
    activeModel: ACTIVE_MODEL,
    updatedAt: new Date(Date.parse(NOW) - 3 * 60_000).toISOString(),
  }
  switch (scenario) {
    case 'memory_not_indexed':
      return {
        phase: 'needs_index',
        steps: steps({ runs: ['waiting', 0], journals: ['waiting', 0], text: ['waiting', 0], meaning: ['waiting', 0] }),
        builtWithModel: null, activeModel: ACTIVE_MODEL, updatedAt: null,
      }
    case 'memory_meaning_running':
      return { ...ready, phase: 'building', steps: steps({ runs: done(RUN_COUNT), journals: done(RUN_COUNT), text: done(FILE_COUNT), meaning: ['running', 2806] }), updatedAt: null }
    case 'memory_index_failed':
      return {
        phase: 'failed',
        steps: steps(
          { runs: done(RUN_COUNT), journals: ['failed', 2240], text: ['waiting', 0], meaning: ['waiting', 0] },
          { journals: 'The memory folder could not be read (permission denied).' },
        ),
        builtWithModel: null, activeModel: ACTIVE_MODEL, updatedAt: null,
      }
    case 'memory_model_changed':
      return { ...ready, builtWithModel: OLD_MODEL }
    default:
      return ready
  }
}

/* ------------------------------------------------------------------ names and small helpers */

const hash = (text: string): number => {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}
const rng = (seed: string) => {
  let a = hash(seed)
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const pick = <T>(items: readonly T[], r: () => number): T => items[Math.floor(r() * items.length)]
const iso = (day: string, time = '09:00:00') => `${day}T${time}.000Z`
const hex = (seed: string, n = 8) => hash(seed).toString(16).padStart(8, '0').slice(0, n)
/** A member's own run ID: its own folder, not derived from the team run's ID (so lists do not repeat the same prefix). */
const memberRunId = (teamRunId: string, name: string) => `${name.split('_')[0].slice(0, 4)}_${hex(`${teamRunId}/${name}`)}`

/* ------------------------------------------------------------------ runs the scripted search can point at */

export type Strength = 'strong' | 'fair' | 'weak'
export type MatchKind = 'text' | 'meaning'

interface JournalFileSpec { name: string; lines: number; kb: number; days: string[]; open?: boolean }
interface Planted { file: string; day: string; offset: number; lines: string[] }
interface RunSpec {
  runId: string
  agentDefinitionId: string | null
  agentName: string
  kind: 'agent' | 'team' | 'org'
  team?: { definitionId: string; name: string; runId: string; taskTeam?: boolean }
  member?: string
  workspace: string | null
  summary: string
  files: JournalFileSpec[]
  planted: Planted[]
}

const file = (name: string, lines: number, kb: number, days: string[], open = false): JournalFileSpec => ({ name, lines, kb, days, open })

const SERVER_HELPER = 'server-helper_a41f9c07'
const DAILY_DDNS = 'daily_3be2d6a9'
const SET_RUN = 'set_5c18e0b2'
const PTM_RUN = 'project-task-manager_9d7a33f1'
const RESEARCH_DNS = 'researcher_6a02bd55'
const ORG_RUN = 'org_b7c14e90'
const DAILY_GAME = 'daily_c0de52aa'
const DAILY_ZH = 'daily_77ae10b3'
const UNATTRIBUTED_RUN = 'claude_7d21c0e4'
const NOTES_RUN = 'release-notes-writer_12ab90ce'
const RESEARCH_GAME = 'researcher_2f6d91b3'

export const RUNS: RunSpec[] = [
  {
    runId: SERVER_HELPER, agentDefinitionId: 'server-helper', agentName: 'Server Helper', kind: 'agent', workspace: '/Users/dev/home-lab',
    summary: 'Keep the home domain pointing at the router',
    files: [
      file('work_journal_000001.md', 4210, 318, ['2026-08-12', '2026-08-13', '2026-08-14']),
      file('work_journal_000002.md', 12904, 1210, ['2026-08-15', '2026-08-16', '2026-08-17', '2026-08-18', '2026-08-19']),
      file('work_journal_000003.md', 48213, 3480, ['2026-08-20', '2026-08-21', '2026-08-22', '2026-08-23', '2026-08-24']),
      file('work_journal_000004.md', 9872, 804, ['2026-08-24', '2026-08-25']),
      file('work_journal_active.md', 1305, 96, ['2026-08-25'], true),
    ],
    planted: [
      { file: 'work_journal_000004.md', day: '2026-08-25', offset: 412, lines: [
        '[09:14:02] Command: ssh admin@203.0.113.7 \'crontab -l\' → exit 0',
        '    */5 * * * * /usr/local/bin/ddns-update.sh home.example.net',
        '    # updates the A record for home.example.net when the router address changes',
        '    [↗](../raw_traces_000004.jsonl#rec_00412)',
      ] },
      { file: 'work_journal_000002.md', day: '2026-08-16', offset: 88, lines: [
        '[14:02:31] User: Our router address changes every few days. Can we set up a dynamic DNS updater',
        '    for home.example.net so I can always reach the server?',
        '    [↗](../raw_traces_000002.jsonl#rec_00088)',
      ] },
    ],
  },
  {
    runId: DAILY_DDNS, agentDefinitionId: 'agent-daily', agentName: 'Daily Assistant', kind: 'agent', workspace: '/Users/dev/notes',
    summary: 'Read this week\'s reading list',
    files: [file('work_journal_000001.md', 2140, 160, ['2026-09-02', '2026-09-03']), file('work_journal_active.md', 640, 48, ['2026-09-04'], true)],
    planted: [
      { file: 'work_journal_000001.md', day: '2026-09-03', offset: 311, lines: [
        '[10:41:09] Command: cat reading-list/home-networking.md → exit 0',
        '    - "Dynamic DNS for people who forgot their router password" (blog post, saved 2026-08-30)',
        '    [↗](../raw_traces_000001.jsonl#rec_00311)',
      ] },
    ],
  },
  {
    runId: memberRunId(SET_RUN, 'implementation_engineer'), agentDefinitionId: 'implementation-engineer', agentName: 'implementation_engineer', kind: 'team',
    team: { definitionId: 'software-engineering-team', name: 'Software Engineering Team', runId: SET_RUN, taskTeam: true }, member: 'implementation_engineer',
    workspace: '/Users/dev/projects/netpanel', summary: 'Router settings page',
    files: [file('work_journal_000001.md', 6120, 540, ['2026-09-11', '2026-09-12']), file('work_journal_active.md', 2210, 190, ['2026-09-12', '2026-09-13'], true)],
    planted: [
      { file: 'work_journal_active.md', day: '2026-09-13', offset: 905, lines: [
        '[16:20:44] Edit file: src/pages/dns-settings.vue → ok',
        '    + <p class="hint">Updates your domain when your public address changes (DDNS).</p>',
        '    + <DdnsStatus :record="record" />',
        '    [↗](../raw_traces_active.jsonl#rec_00905)',
      ] },
    ],
  },
  {
    runId: PTM_RUN, agentDefinitionId: 'project-task-manager', agentName: 'Project Task Manager', kind: 'agent', workspace: '/Users/dev/projects/netpanel',
    summary: 'Plan the router settings work',
    files: [file('work_journal_000001.md', 3380, 290, ['2026-09-10', '2026-09-11']), file('work_journal_active.md', 1020, 84, ['2026-09-11'], true)],
    planted: [
      { file: 'work_journal_000001.md', day: '2026-09-10', offset: 202, lines: [
        '[11:05:18] Tool: create_project_task → ok',
        '    title: "Show DDNS status on the DNS settings page"',
        '    [↗](../raw_traces_000001.jsonl#rec_00202)',
      ] },
    ],
  },
  {
    runId: RESEARCH_DNS, agentDefinitionId: 'agent-researcher', agentName: 'Research Assistant', kind: 'agent', workspace: '/Users/dev/research',
    summary: 'Compare DNS providers',
    files: [file('work_journal_active.md', 1880, 150, ['2026-07-21', '2026-07-22'], true)],
    planted: [
      { file: 'work_journal_active.md', day: '2026-07-22', offset: 640, lines: [
        '[08:57:12] Search web: "which DNS providers offer an update API" → 5 results',
        '    1. Provider A: HTTPS endpoint, token per record',
        '    2. Provider B: legacy dyndns2 protocol',
        '    [↗](../raw_traces_active.jsonl#rec_00640)',
      ] },
    ],
  },
  {
    runId: memberRunId(ORG_RUN, 'analyst'), agentDefinitionId: 'agent-researcher', agentName: 'analyst', kind: 'org',
    team: { definitionId: 'org-launch', name: 'Launch Org', runId: ORG_RUN }, member: 'analyst', workspace: '/Users/dev/projects/launch',
    summary: 'Coordinate the synthetic launch review',
    files: [file('work_journal_active.md', 1460, 120, ['2026-06-30', '2026-07-01'], true)],
    planted: [
      { file: 'work_journal_active.md', day: '2026-07-01', offset: 702, lines: [
        '[13:30:21] Agent: The status page now lists the domain updater as "planned". I have not checked',
        '    whether the nightly job runs on the new server.',
        '    [↗](../raw_traces_active.jsonl#rec_00702)',
      ] },
    ],
  },
  {
    runId: UNATTRIBUTED_RUN, agentDefinitionId: null, agentName: UNATTRIBUTED_RUN, kind: 'agent', workspace: null,
    summary: UNATTRIBUTED_RUN,
    files: [file('work_journal_active.md', 520, 41, ['2026-07-02'], true)],
    planted: [
      { file: 'work_journal_active.md', day: '2026-07-02', offset: 180, lines: [
        '[18:09:50] User: remind me how the update script for the domain was called',
        '    [↗](../raw_traces_active.jsonl#rec_00180)',
      ] },
    ],
  },
  {
    runId: NOTES_RUN, agentDefinitionId: 'release-notes-writer', agentName: 'Release Notes Writer', kind: 'agent', workspace: '/Users/dev/projects/netpanel',
    summary: 'Draft the 0.4 release notes',
    files: [file('work_journal_active.md', 940, 77, ['2026-08-29', '2026-08-30'], true)],
    planted: [
      { file: 'work_journal_active.md', day: '2026-08-30', offset: 410, lines: [
        '[15:44:03] Write file: notes/0.4.md → ok',
        '    - Settings: new "Dynamic DNS" section (beta).',
        '    [↗](../raw_traces_active.jsonl#rec_00410)',
      ] },
    ],
  },
  {
    runId: DAILY_GAME, agentDefinitionId: 'agent-daily', agentName: 'Daily Assistant', kind: 'agent', workspace: '/Users/dev/kids-games',
    summary: 'A small game for my niece',
    files: [file('work_journal_000001.md', 3900, 330, ['2026-09-20', '2026-09-21']), file('work_journal_active.md', 1180, 99, ['2026-09-22'], true)],
    planted: [
      { file: 'work_journal_active.md', day: '2026-09-22', offset: 520, lines: [
        '[19:12:40] Write file: game/race.js → ok',
        '    // the bunny sprints, the tortoise keeps a steady pace; the tortoise wins if the bunny naps',
        '    const napChance = 0.35',
        '    [↗](../raw_traces_active.jsonl#rec_00520)',
      ] },
      { file: 'work_journal_000001.md', day: '2026-09-20', offset: 140, lines: [
        '[20:03:11] User: Make a game where a bunny and a tortoise race. Keep it simple, my niece is six.',
        '    [↗](../raw_traces_000001.jsonl#rec_00140)',
      ] },
    ],
  },
  {
    runId: RESEARCH_GAME, agentDefinitionId: 'agent-researcher', agentName: 'Research Assistant', kind: 'agent', workspace: '/Users/dev/research',
    summary: 'Fables and their morals',
    files: [file('work_journal_active.md', 760, 61, ['2026-08-03'], true)],
    planted: [
      { file: 'work_journal_active.md', day: '2026-08-03', offset: 300, lines: [
        '[12:20:15] Agent: In the fable the slow animal wins because the fast one stops to rest.',
        '    Possible morals: steady effort beats talent that is not used.',
        '    [↗](../raw_traces_active.jsonl#rec_00300)',
      ] },
    ],
  },
  {
    runId: DAILY_ZH, agentDefinitionId: 'agent-daily', agentName: 'Daily Assistant', kind: 'agent', workspace: '/Users/dev/notes',
    summary: '家里的服务器',
    files: [file('work_journal_active.md', 1390, 118, ['2026-09-14', '2026-09-15'], true)],
    planted: [
      { file: 'work_journal_active.md', day: '2026-09-15', offset: 622, lines: [
        '[21:08:33] User: 家里的域名要自动更新到新的 IP 地址，之前说过用什么方法来着？',
        '    [↗](../raw_traces_active.jsonl#rec_00622)',
      ] },
    ],
  },
]

const runById = new Map(RUNS.map(run => [run.runId, run]))

/* ------------------------------------------------------------------ lists: agents, runs, teams, orgs */

const flags = (hasJournal = true) => ({ latestMemoryAt: NOW, hasWorkJournal: hasJournal, hasRawTraces: true, hasRawArchive: false })
const paged = <T>(entries: T[], variables: Record<string, any>) => {
  const search = String(variables.search || '').trim().toLowerCase()
  const pageSize = Number(variables.pageSize) || 25
  const page = Math.max(1, Number(variables.page) || 1)
  const total = entries.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  return { total, page, pageSize, totalPages, entries: entries.slice((page - 1) * pageSize, page * pageSize), search }
}
const matches = (search: string, ...values: Array<string | null | undefined>) => !search || values.some(value => String(value ?? '').toLowerCase().includes(search))

interface AgentSpec { id: string | null; name: string; runs: number; latest: string; attribution: 'DEFINITION' | 'UNATTRIBUTED' }
const AGENTS: AgentSpec[] = [
  { id: 'project-task-manager', name: 'Project Task Manager', runs: 22, latest: '2026-10-26T08:41:00.000Z', attribution: 'DEFINITION' },
  { id: 'agent-daily', name: 'Daily Assistant', runs: 31, latest: '2026-10-26T07:12:00.000Z', attribution: 'DEFINITION' },
  { id: 'agent-researcher', name: 'Research Assistant', runs: 14, latest: '2026-10-24T16:20:00.000Z', attribution: 'DEFINITION' },
  // Retired and renamed agents: named as recorded at the time of the run, nothing depends on today's definitions.
  { id: 'release-notes-writer', name: 'Release Notes Writer', runs: 6, latest: '2026-08-30T15:50:00.000Z', attribution: 'DEFINITION' },
  { id: 'server-helper', name: 'Server Helper', runs: 5, latest: '2026-08-25T09:30:00.000Z', attribution: 'DEFINITION' },
  { id: null, name: 'Unattributed runs', runs: 9, latest: '2026-07-02T18:20:00.000Z', attribution: 'UNATTRIBUTED' },
]

const TITLES = ['hello', 'hello', 'Summarize the open questions', 'Rename the helper and update callers', 'Why is the nightly job slow?', 'Check the weekly notes', 'hello', 'Tidy the project folder', 'Add a retry to the upload helper', 'Draft the status update']
const WORKSPACES = ['/Users/dev/projects/netpanel', '/Users/dev/notes', '/Users/dev/research', '/Users/dev/home-lab', '/Users/dev/projects/launch']
const fillerRun = (agent: AgentSpec, index: number) => {
  const r = rng(`${agent.id}:${index}`)
  const day = new Date(Date.parse(agent.latest) - (index + 1) * 3.3 * DAY).toISOString()
  const prefix = (agent.id ?? 'claude').replace(/[^a-z0-9-]/g, '')
  return {
    runId: `${prefix}_${hex(`${agent.id}${index}`)}`,
    agentDefinitionId: agent.id, agentName: agent.attribution === 'UNATTRIBUTED' ? null : agent.name,
    summary: agent.attribution === 'UNATTRIBUTED' ? `${prefix}_${hex(`${agent.id}${index}`)}` : pick(TITLES, r),
    workspaceRootPath: agent.attribution === 'UNATTRIBUTED' ? null : pick(WORKSPACES, r),
    createdAt: day, lastUpdatedAt: day, memory: flags(),
  }
}

const agentRuns = (agent: AgentSpec) => {
  const curated = RUNS.filter(run => run.kind === 'agent' && run.agentDefinitionId === agent.id).map(run => ({
    runId: run.runId, agentDefinitionId: run.agentDefinitionId, agentName: run.agentName, summary: run.summary, workspaceRootPath: run.workspace,
    createdAt: iso(run.files[0].days[0]), lastUpdatedAt: iso(run.files[run.files.length - 1].days.at(-1)!), memory: flags(),
  }))
  const fillers = Array.from({ length: Math.max(0, Math.min(agent.runs, 16) - curated.length) }, (_, i) => fillerRun(agent, i))
  return [...curated, ...fillers].sort((a, b) => b.lastUpdatedAt.localeCompare(a.lastUpdatedAt))
}

interface TeamSpec { id: string; name: string; runs: number; members: number; latest: string; task: boolean; startedBy?: string }
const TEAMS: TeamSpec[] = [
  // A task team: started by an agent (here the Project Task Manager), not from a team definition. It is listed like any team.
  { id: 'software-engineering-team', name: 'Software Engineering Team', runs: 48, members: 144, latest: '2026-10-26T08:12:00.000Z', task: true, startedBy: 'Project Task Manager' },
  { id: 'team-product', name: 'Product Review Team', runs: 3, members: 6, latest: '2026-10-19T14:02:00.000Z', task: false },
]
const SET_MEMBERS = ['solution_designer', 'implementation_engineer', 'code_reviewer']
const teamRuns = (team: TeamSpec) => Array.from({ length: Math.min(team.runs, 8) }, (_, i) => {
  const runId = i === 0 && team.id === 'software-engineering-team' ? SET_RUN : `${team.id.slice(0, 3)}_${hex(`${team.id}${i}`)}`
  const day = new Date(Date.parse(team.latest) - i * 2.6 * DAY).toISOString()
  const rootGroup = team.task ? [{ teamRunId: runId, address: `/${team.id}`, displayName: team.name, kind: 'TASK_TEAM' as const, startedAt: day }] : []
  return {
    teamRunId: runId, teamDefinitionId: team.id, teamDefinitionName: team.name, summary: team.task ? pick(TITLES.filter(t => t !== 'hello'), rng(runId)) : 'Review the launch plan',
    workspaceRootPath: WORKSPACES[i % WORKSPACES.length], createdAt: day, lastUpdatedAt: day, memory: flags(),
    memberTargets: (team.task ? SET_MEMBERS : ['reviewer', 'writer']).map(name => ({
      memberAddress: `/${name}`, displayName: name, agentRunId: memberRunId(runId, name), agentDefinitionId: name, executionKind: team.task ? 'TASK_TEAM_MEMBER' : 'CONFIGURED',
      startedAt: day, groupPath: team.task ? [] : [], lastUpdatedAt: day, memory: flags(),
    })),
    __rootGroup: rootGroup,
  }
})

const orgRuns = () => [{
  orgRunId: ORG_RUN, orgDefinitionId: 'org-launch', orgDefinitionName: 'Launch Org', summary: 'Coordinate the synthetic launch review', workspaceRootPath: '/Users/dev/projects/launch',
  createdAt: '2026-06-30T09:00:00.000Z', lastUpdatedAt: '2026-07-01T14:00:00.000Z', memory: flags(),
  memberTargets: ['analyst', 'writer'].map(name => ({ memberAddress: `/${name}`, displayName: name, agentRunId: memberRunId(ORG_RUN, name), agentDefinitionId: 'agent-researcher', executionKind: 'CONFIGURED', startedAt: null, groupPath: [], lastUpdatedAt: '2026-07-01T14:00:00.000Z', memory: flags() })),
}]

/**
 * The design layer over the baseline's memory answers: the lists the Memory page reads. Only the memory list
 * operations are replaced; everything else the page asks (sources, the run's working context and raw traces)
 * keeps the baseline's answers.
 */
export const withMemoryDesign = (name: string, variables: Record<string, any>, data: any, scenario: MemoryScenario): any => {
  const search = String(variables.search || '').trim().toLowerCase()
  const empty = scenario === 'empty'
  switch (name) {
    case 'ListMemoryExplorerSources':
      return data
    case 'ListAgentsWithMemory':
      return { listAgentsWithMemory: paged(empty ? [] : AGENTS.filter(a => matches(search, a.name, a.id)).map(a => ({
        attribution: a.attribution, agentDefinitionId: a.id, displayName: a.name, stableId: a.id ?? 'unattributed', runCount: a.runs, latestMemoryAt: a.latest, memory: flags(),
      })), variables) }
    case 'ListAgentRunsWithMemory': {
      const selector = variables.selector || {}
      const agent = AGENTS.find(a => (selector.attribution === 'UNATTRIBUTED' ? a.attribution === 'UNATTRIBUTED' : a.id === selector.agentDefinitionId)) ?? AGENTS[2]
      return { listAgentRunsWithMemory: paged(agentRuns(agent).filter(r => matches(search, r.summary, r.runId, r.workspaceRootPath)), variables) }
    }
    case 'ListAgentTeamsWithMemory':
      return { listAgentTeamsWithMemory: paged(empty ? [] : TEAMS.filter(t => matches(search, t.name, t.id)).map(t => ({
        teamDefinitionId: t.id, teamDefinitionName: t.name, teamRunCount: t.runs, memberMemoryCount: t.members, latestMemoryAt: t.latest, memory: flags(), isTaskTeam: t.task, startedByAgentName: t.startedBy ?? null,
      })), variables) }
    case 'ListAgentTeamRunsWithMemory': {
      const team = TEAMS.find(t => t.id === variables.teamDefinitionId) ?? TEAMS[0]
      return { listAgentTeamRunsWithMemory: paged(teamRuns(team).filter(r => matches(search, r.summary, r.teamRunId, r.workspaceRootPath)).map(({ __rootGroup, ...run }) => run), variables) }
    }
    case 'ListAgentOrgsWithMemory':
      return { listAgentOrgsWithMemory: paged(empty ? [] : [{ orgDefinitionId: 'org-launch', orgDefinitionName: 'Launch Org', orgRunCount: 1, memberMemoryCount: 2, latestMemoryAt: '2026-07-01T14:00:00.000Z', memory: flags() }], variables) }
    case 'ListAgentOrgRunsWithMemory':
      return { listAgentOrgRunsWithMemory: paged(orgRuns(), variables) }
    default:
      return data
  }
}

/* ------------------------------------------------------------------ memory search (scripted) */

export interface SearchMatch {
  file: string
  fromLine: number
  toLine: number
  day: string
  snippet: string[]
  kind: MatchKind
  strength: Strength
}
export interface SearchResult {
  runId: string
  agentName: string
  team: { name: string; runId: string; kind: 'team' | 'org' } | null
  member: string | null
  agentDefinitionId: string | null
  workspace: string | null
  firstDay: string
  latestDay: string
  matches: SearchMatch[]
}
export interface SearchOutcome { cue: string; results: SearchResult[]; weakOnly: boolean }

const dayStarts = (spec: JournalFileSpec): number[] => spec.days.map((_, i) => 9 + Math.floor((i * (spec.lines - 9)) / spec.days.length))

const plantedRange = (spec: RunSpec, planted: Planted): [number, number] => {
  const f = spec.files.find(x => x.name === planted.file)!
  const startOfDay = dayStarts(f)[f.days.indexOf(planted.day)] + 1
  const from = startOfDay + planted.offset % Math.max(20, Math.floor(f.lines / f.days.length) - 20)
  return [from, from + planted.lines.length - 1]
}

const makeResult = (runId: string, picks: Array<{ file: string; kind: MatchKind; strength: Strength }>): SearchResult => {
  const spec = runById.get(runId)!
  const matches: SearchMatch[] = picks.map((pick) => {
    const planted = spec.planted.find(p => p.file === pick.file) ?? spec.planted[0]
    const [fromLine] = plantedRange(spec, planted)
    const snippet = planted.lines.filter(line => !/\[↗\]/.test(line))
    return { file: planted.file, fromLine, toLine: fromLine + snippet.length - 1, day: planted.day, snippet, kind: pick.kind, strength: pick.strength }
  })
  matches.sort((a, b) => b.day.localeCompare(a.day))
  const days = spec.planted.map(p => p.day).sort()
  return {
    runId, agentName: spec.agentName, agentDefinitionId: spec.agentDefinitionId,
    team: spec.team ? { name: spec.team.name, runId: spec.team.runId, kind: spec.kind === 'org' ? 'org' : 'team' } : null,
    member: spec.member ?? null, workspace: spec.workspace, firstDay: days[0], latestDay: days[days.length - 1], matches,
  }
}

const ddnsResults = (): SearchResult[] => [
  makeResult(SERVER_HELPER, [{ file: 'work_journal_000004.md', kind: 'text', strength: 'strong' }, { file: 'work_journal_000002.md', kind: 'meaning', strength: 'strong' }]),
  makeResult(memberRunId(SET_RUN, 'implementation_engineer'), [{ file: 'work_journal_active.md', kind: 'text', strength: 'strong' }]),
  makeResult(PTM_RUN, [{ file: 'work_journal_000001.md', kind: 'text', strength: 'fair' }]),
  makeResult(DAILY_DDNS, [{ file: 'work_journal_000001.md', kind: 'text', strength: 'fair' }]),
  makeResult(NOTES_RUN, [{ file: 'work_journal_active.md', kind: 'text', strength: 'fair' }]),
  makeResult(RESEARCH_DNS, [{ file: 'work_journal_active.md', kind: 'meaning', strength: 'fair' }]),
  makeResult(memberRunId(ORG_RUN, 'analyst'), [{ file: 'work_journal_active.md', kind: 'meaning', strength: 'weak' }]),
  makeResult(UNATTRIBUTED_RUN, [{ file: 'work_journal_active.md', kind: 'meaning', strength: 'weak' }]),
]
const gameResults = (): SearchResult[] => [
  makeResult(DAILY_GAME, [{ file: 'work_journal_active.md', kind: 'text', strength: 'strong' }, { file: 'work_journal_000001.md', kind: 'text', strength: 'strong' }]),
  makeResult(RESEARCH_GAME, [{ file: 'work_journal_active.md', kind: 'meaning', strength: 'fair' }]),
]
const chineseResults = (): SearchResult[] => [
  makeResult(DAILY_ZH, [{ file: 'work_journal_active.md', kind: 'text', strength: 'strong' }]),
  makeResult(SERVER_HELPER, [{ file: 'work_journal_000002.md', kind: 'meaning', strength: 'strong' }]),
  makeResult(UNATTRIBUTED_RUN, [{ file: 'work_journal_active.md', kind: 'meaning', strength: 'fair' }]),
]
const weakResults = (): SearchResult[] => [
  makeResult(RESEARCH_GAME, [{ file: 'work_journal_active.md', kind: 'meaning', strength: 'weak' }]),
  makeResult(NOTES_RUN, [{ file: 'work_journal_active.md', kind: 'meaning', strength: 'weak' }]),
  makeResult(DAILY_DDNS, [{ file: 'work_journal_000001.md', kind: 'meaning', strength: 'weak' }]),
]

/** The scripted answer to a cue: a few topics matched by keywords; anything else gets only weak matches. */
export const scriptedSearch = (cue: string, limit = 10): SearchOutcome => {
  const text = cue.trim().toLowerCase()
  let results: SearchResult[]
  if (/[一-鿿]/.test(text)) results = chineseResults()
  else if (/ddns|dns|domain|router|dynamic/.test(text)) results = ddnsResults()
  else if (/bunny|tortoise|rabbit|turtle|race|game/.test(text)) results = gameResults()
  else results = weakResults()
  const weakOnly = results.every(result => result.matches.every(match => match.strength === 'weak'))
  return { cue: cue.trim(), results: results.slice(0, limit), weakOnly }
}

/* ------------------------------------------------------------------ Work Journal files and lines */

export interface JournalFileInfo {
  name: string
  lines: number
  sizeKb: number
  firstDay: string
  lastDay: string
  days: Array<{ day: string; line: number }>
  open: boolean
}

const genericFiles = (runId: string): JournalFileSpec[] => {
  const r = rng(`files:${runId}`)
  const first = new Date(Date.parse(NOW) - (20 + Math.floor(r() * 100)) * DAY)
  const dayOf = (n: number) => new Date(first.getTime() + n * DAY).toISOString().slice(0, 10)
  const closed = r() > 0.5
  const lines = 300 + Math.floor(r() * 1500)
  return closed
    ? [file('work_journal_000001.md', lines, Math.round(lines * 0.085), [dayOf(0), dayOf(1)]), file('work_journal_active.md', 200 + Math.floor(r() * 400), 30, [dayOf(2)], true)]
    : [file('work_journal_active.md', lines, Math.round(lines * 0.085), [dayOf(0), dayOf(1)], true)]
}

export const specFor = (runId: string): RunSpec | null => runById.get(runId) ?? null
export const filesFor = (runId: string): JournalFileSpec[] => runById.get(runId)?.files ?? genericFiles(runId)

export const journalFiles = (runId: string): JournalFileInfo[] => filesFor(runId).map(spec => ({
  name: spec.name, lines: spec.lines, sizeKb: spec.kb, firstDay: spec.days[0], lastDay: spec.days[spec.days.length - 1], open: !!spec.open,
  days: dayStarts(spec).map((line, i) => ({ day: spec.days[i], line })),
}))

const ACTIONS = ['Command', 'Command', 'Command', 'Edit file', 'Write file', 'Tool', 'Search web'] as const
const REQUESTS = [
  'Please check why the nightly backup job is slow.', 'Add a retry to the upload helper and keep the logs short.', 'Summarize the open questions in notes/ideas.md.',
  'Rename the helper and update every caller.', 'Can you tidy the project folder? Keep the README.', 'Draft the status update for Friday.',
  'The build fails on the second step. What changed?', 'Look at the failing test and tell me what you think.',
]
const REPLIES = [
  'The job copies the same folder twice. I changed it to copy once and the run time dropped.', 'I added a retry with three attempts and a short pause between them.',
  'Three questions are still open: the retry limit, the log format and who owns the folder.', 'Renamed in four files; the tests pass.',
  'I moved the old drafts to archive/ and left the README where it was.', 'The status update is in notes/status-friday.md; please read it before I send it.',
]
const PATHS = ['src/helpers/upload.ts', 'src/jobs/backup.ts', 'notes/ideas.md', 'scripts/clean.sh', 'README.md', 'docs/plan.md', 'config/jobs.json', 'tests/upload.test.ts']
const COMMANDS = ['ls -la', 'cat', 'sed -n \'1,80p\'', 'grep -n TODO', 'npm test', 'git status --short', 'curl -sI https://status.example.net']
const DETAIL = [
  'drwxr-xr-x  6 dev  staff   192 Aug 14 09:12 src', '-rw-r--r--  1 dev  staff  1840 Aug 14 09:12 package.json', 'Tests: 18 passed, 18 total',
  '2 files changed, 14 insertions(+), 3 deletions(-)', 'TODO: handle the empty response', 'ok  github.example.net/dev/tools  0.412s', 'HTTP/2 200', 'server: example',
]
const PERIOD = [7, 5, 6, 8, 5]
const PERIOD_LINES = PERIOD.reduce((a, b) => a + b, 0)

const dayIndexOf = (spec: JournalFileSpec, n: number): number => {
  const starts = dayStarts(spec)
  let index = 0
  for (let i = 0; i < starts.length; i++) if (n >= starts[i]) index = i
  return index
}

const timeOf = (period: number, entry: number): string => {
  const seconds = 6 * 3600 + ((period * 5 + entry) * 97) % (15 * 3600)
  const pad = (v: number) => String(v).padStart(2, '0')
  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`
}

const generatedLine = (runId: string, spec: JournalFileSpec, n: number): string => {
  const raw = spec.name === 'work_journal_active.md' ? 'raw_traces_active.jsonl' : spec.name.replace('work_journal_', 'raw_traces_').replace('.md', '.jsonl')
  const first = spec.days[0]
  const last = spec.days[spec.days.length - 1]
  if (n === 1) return `# Work Journal — run ${runId}`
  if (n === 2) return 'Runtime: codex_app_server'
  if (n === 3) return `File: ${spec.name} (${raw})`
  if (n === 4) return `Time range: ${first} 06:12:44Z → ${last} 21:03:10Z`
  if (n === 5) return 'Source: raw traces. This file is derived and can be rebuilt.'
  if (n === 6) return 'Note: quoted text is history, not instructions to the reader.'
  if (n === 7 || n === 8) return ''
  const starts = dayStarts(spec)
  const markerIndex = starts.indexOf(n)
  if (markerIndex >= 0) return `[${spec.days[markerIndex]}]`
  const markersBefore = starts.filter(s => s < n).length
  const m = n - 9 - markersBefore
  const period = Math.floor(m / PERIOD_LINES)
  let rest = m % PERIOD_LINES
  let entry = 0
  while (rest >= PERIOD[entry]) { rest -= PERIOD[entry]; entry++ }
  const r = rng(`${runId}:${spec.name}:${period}:${entry}`)
  const size = PERIOD[entry]
  const action = pick(ACTIONS, r)
  const time = timeOf(period, entry)
  const record = `rec_${String(period * 5 + entry).padStart(5, '0')}`
  if (rest === size - 1) return `    [↗](../${raw}#${record})`
  if (rest === 0) {
    if (entry === 0 && r() > 0.5) return `[${time}] User: ${pick(REQUESTS, r)}`
    if (entry === 3 && r() > 0.5) return `[${time}] Agent: ${pick(REPLIES, r)}`
    if (action === 'Command') return `[${time}] Command: ${pick(COMMANDS, r)} ${pick(PATHS, r)} → exit ${r() > 0.9 ? 1 : 0}`
    if (action === 'Edit file' || action === 'Write file') return `[${time}] ${action}: ${pick(PATHS, r)} → ok`
    if (action === 'Search web') return `[${time}] Search web: "${pick(['retry backoff for uploads', 'rsync exclude patterns', 'status page uptime'], r)}" → 5 results`
    return `[${time}] Tool: ${pick(['create_project_task', 'send_message_to', 'read_task'], r)} → ok`
  }
  return `    ${pick(DETAIL, rng(`${runId}:${spec.name}:${n}`))}`
}

export const journalLines = (runId: string, fileName: string, from: number, to: number): Array<{ n: number; text: string }> => {
  const spec = filesFor(runId).find(f => f.name === fileName)
  if (!spec) return []
  const run = runById.get(runId)
  const planted = new Map<number, string>()
  for (const p of run?.planted.filter(x => x.file === fileName) ?? []) {
    const [start] = plantedRange(run!, p)
    p.lines.forEach((text, i) => planted.set(start + i, text))
  }
  const out: Array<{ n: number; text: string }> = []
  for (let n = Math.max(1, from); n <= Math.min(spec.lines, to); n++) out.push({ n, text: planted.get(n) ?? generatedLine(runId, spec, n) })
  return out
}

export const dayOfLine = (runId: string, fileName: string, n: number): string => {
  const spec = filesFor(runId).find(f => f.name === fileName)
  return spec ? spec.days[dayIndexOf(spec, n)] : ''
}

export const journalDays = (runId: string, fileName: string): string[] => filesFor(runId).find(f => f.name === fileName)?.days ?? []
