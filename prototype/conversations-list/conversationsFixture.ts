/**
 * left-panel-super-agents (design-only): more runs for the left panel's Conversations list, so that it shows what a
 * person who talks mostly to a few general agents ("super agents") and sometimes starts a team sees: a few parallel
 * conversations with one agent, coding-agent runs in several folders, direct team runs, and older runs behind "Show older".
 *
 * Everything here is invented and illustrative; nothing is read from a real node, and the titles are not anyone's real
 * conversations. Times are offsets from the moment the page loads, so the ages ("6m", "2h", "3d") are the same on every run.
 * It adds only stored run-history rows (the product's own `ListWorkspaceRunHistory` answer); the rows open the example
 * conversation of the baseline like every other stored run. Turned off with the other design-only layers
 * (`autobyteus.prototype.designOnlyLayers=off`).
 */
import { exposedFixtures } from '~/prototype/source-observation/fixtures.mjs'
import { PTM_RUN_ID } from '~/prototype/delegated-copy-tasks/delegatedCopyTasksFixture'

const { dailyAssistant, run: templateRun, teamRun: templateTeamRun, workspace, tempWorkspace } = exposedFixtures as Record<string, any>

const NOW = Date.now()
const ago = (minutes: number): string => new Date(NOW - minutes * 60_000).toISOString()
const H = 60, D = 24 * 60

const CLIENT_PORTAL = { workspaceRootPath: '/synthetic/client-portal', workspaceName: 'client-portal' }

type AgentRow = { id: string; name: string; summary: string; minutes: number; running?: boolean; live?: boolean; workspaceRootPath: string }
const agentRun = (n: number, row: AgentRow) => ({
  ...templateRun, runId: `conv-run-${String(n).padStart(3, '0')}`, agentRunId: `conv-run-${String(n).padStart(3, '0')}`,
  agentDefinitionId: row.id, agentName: row.name, summary: row.summary,
  createdAt: ago(row.minutes), lastUpdatedAt: ago(row.minutes), archivedAt: null, terminatedAt: null,
  // Stored runs are offline (gray dot); a live run is running (working) or idle (waiting for you).
  status: row.running ? 'RUNNING' : row.live ? 'IDLE' : 'OFFLINE', isActive: row.running === true || row.live === true, shouldConnectStream: row.running === true || row.live === true,
  workspaceRootPath: row.workspaceRootPath, hasCollaboration: false,
})

const DA = { id: dailyAssistant.id, name: dailyAssistant.name }
const CODEX = { id: 'codex', name: 'Codex' }
const APC = { id: 'agent-package-creator', name: 'Agent Package Creator' }
const PTM = { id: 'project-task-manager', name: 'Project Task Manager' }
const temp = tempWorkspace.workspaceRootPath as string
const proto = workspace.workspaceRootPath as string
const portal = CLIENT_PORTAL.workspaceRootPath

// Three parallel conversations with the Daily Assistant (one running), one Project Task Manager, coding runs, older runs.
const AGENT_ROWS: AgentRow[] = [
  { ...DA, summary: 'Draft the reply to the pilot customers about the new date', minutes: 6, workspaceRootPath: temp },
  { ...DA, summary: 'Plan the week: school pickups, dentist, budget review', minutes: 55, workspaceRootPath: temp },
  { ...CODEX, summary: 'Fix the failing probe test on the base branch', minutes: 5 * H, workspaceRootPath: proto },
  { ...DA, summary: 'hello', minutes: 9 * H, workspaceRootPath: temp },
  { ...CODEX, summary: 'Migrate the invoice export to the new API', minutes: 1 * D + 3 * H, workspaceRootPath: portal },
  { ...PTM, summary: 'Which Tasks are blocked this week?', minutes: 2 * D, workspaceRootPath: proto },
  { ...APC, summary: 'Make a Product Video Producer package for the marketing team', minutes: 3 * D, workspaceRootPath: temp },
  { ...DA, summary: 'Compare two flights to Berlin for the March trip', minutes: 4 * D, workspaceRootPath: temp },
  { ...CODEX, summary: 'Rename the export helpers and update the imports', minutes: 5 * D, workspaceRootPath: proto },
  { ...DA, summary: 'Summarize the lease renewal and list what to ask the landlord', minutes: 8 * D, workspaceRootPath: temp },
  { ...CODEX, summary: 'Add pagination to the customer list', minutes: 9 * D, workspaceRootPath: portal },
  { ...DA, summary: 'Ideas for a short talk on agent teams', minutes: 12 * D, workspaceRootPath: temp },
  { ...DA, summary: 'Draft a polite decline for the conference invitation', minutes: 15 * D, workspaceRootPath: temp },
  { ...CODEX, summary: 'Investigate the slow start of the desktop app', minutes: 17 * D, workspaceRootPath: proto },
  { ...DA, summary: 'Turn my notes into a checklist for the move', minutes: 21 * D, workspaceRootPath: temp },
  { ...APC, summary: 'Create a general skill for content management', minutes: 24 * D, workspaceRootPath: temp },
]

type TeamRow = { id: string; name: string; summary: string; minutes: number; running?: boolean; workspaceRootPath: string }
const TEAM_ROWS: TeamRow[] = [
  { id: 'software-engineering-team', name: 'Software Engineering Team', summary: 'Review the invoice export migration', minutes: 1 * D + 2 * H, workspaceRootPath: portal },
  { id: 'software-engineering-team', name: 'Software Engineering Team', summary: 'Simplify the NFS Guide and remove redundant steps', minutes: 6 * D, workspaceRootPath: proto },
  { id: 'classroom-simulation', name: 'Classroom Simulation', summary: 'Run a mock lesson on fractions for grade 4', minutes: 7 * D, workspaceRootPath: temp },
  { id: 'software-engineering-team', name: 'Software Engineering Team', summary: 'Code health analysis: check the source for dead exports', minutes: 10 * D, workspaceRootPath: proto },
  { id: 'bible-study', name: 'Bible Study', summary: 'Prepare a discussion guide for Sunday’s passage', minutes: 11 * D, workspaceRootPath: temp },
  { id: 'classroom-simulation', name: 'Classroom Simulation', summary: 'Role-play a parent meeting about homework', minutes: 14 * D, workspaceRootPath: temp },
  { id: 'software-engineering-team', name: 'Software Engineering Team', summary: 'Runtime switch for Team members, Org members', minutes: 16 * D, workspaceRootPath: proto },
  { id: 'kids-coloring-story', name: 'Kids Coloring Story', summary: 'A story about a fox who learns to share', minutes: 19 * D, workspaceRootPath: temp },
  { id: 'video-tutorial', name: 'Video Tutorial', summary: 'Script and storyboard for the first-run tutorial', minutes: 22 * D, workspaceRootPath: proto },
  { id: 'software-engineering-team', name: 'Software Engineering Team', summary: 'Model Router feedback: the router learns from choices', minutes: 26 * D, workspaceRootPath: proto },
]

const teamRun = (n: number, row: TeamRow) => {
  const id = `conv-team-${String(n).padStart(3, '0')}`
  const text = JSON.stringify(templateTeamRun).split(templateTeamRun.teamRunId).join(id).split('team-member-researcher-001').join(`${id}-member-a`).split('team-member-writer-001').join(`${id}-member-b`)
  const copy = JSON.parse(text)
  return {
    ...copy, teamRunId: id, teamDefinitionId: row.id, teamDefinitionName: row.name, summary: row.summary,
    createdAt: ago(row.minutes), lastUpdatedAt: ago(row.minutes), status: 'OFFLINE', isActive: false, shouldConnectStream: false,
    workspaceRootPath: row.workspaceRootPath,
    members: copy.members.map((member: any) => ({ ...member, workspaceRootPath: row.workspaceRootPath })),
  }
}

// Runs the user archived or deleted in this page's session: they do not come back on the next read (a reload resets them).
const gone = new Set<string>()
export const RUN_REMOVAL_MUTATIONS = ['ArchiveStoredRun', 'DeleteStoredRun', 'ArchiveStoredTeamRun', 'DeleteStoredTeamRun', 'ArchiveStoredAgentOrgRun', 'DeleteStoredAgentOrgRun']
/**
 * Answers an archive or delete of one run (the page's local mutation layer calls it) and remembers it, so the run does not
 * come back on the next read. Returns null for any other mutation.
 */
export const answerRunRemoval = (name: string, variables: Record<string, any>): Record<string, any> | null => {
  if (!RUN_REMOVAL_MUTATIONS.includes(name)) return null
  const id = String(variables.runId ?? variables.teamRunId ?? variables.orgRunId)
  gone.add(id)
  const field = name.charAt(0).toLowerCase() + name.slice(1)
  const result = { success: true, message: 'Synthetic operation completed.' }
  return { [field]: name.endsWith('OrgRun') ? { ...result, orgRunId: id } : result }
}
const withoutRemoved = (entry: any): any => {
  for (const group of entry.agentDefinitions ?? []) group.runs = (group.runs ?? []).filter((run: any) => !gone.has(run.runId))
  entry.agentDefinitions = (entry.agentDefinitions ?? []).filter((group: any) => group.runs.length > 0)
  for (const group of entry.teamDefinitions ?? []) group.runs = (group.runs ?? []).filter((run: any) => !gone.has(run.teamRunId))
  entry.teamDefinitions = (entry.teamDefinitions ?? []).filter((group: any) => group.runs.length > 0)
  return entry
}

const WORKSPACE_NAMES: Record<string, string> = {
  [temp]: tempWorkspace.displayName, [proto]: workspace.displayName, [portal]: CLIENT_PORTAL.workspaceName,
}

/** The stored runs this layer adds to one folder's history, grouped as the product groups them. */
const groupsFor = (root: string) => {
  const agentGroups = new Map<string, { agentDefinitionId: string; agentName: string; runs: any[] }>()
  AGENT_ROWS.forEach((row, index) => {
    if (row.workspaceRootPath !== root) return
    const group = agentGroups.get(row.id) ?? { agentDefinitionId: row.id, agentName: row.name, runs: [] }
    group.runs.push(agentRun(index + 1, row))
    agentGroups.set(row.id, group)
  })
  const teamGroups = new Map<string, { teamDefinitionId: string; teamDefinitionName: string; runs: any[] }>()
  TEAM_ROWS.forEach((row, index) => {
    if (row.workspaceRootPath !== root) return
    const group = teamGroups.get(row.id) ?? { teamDefinitionId: row.id, teamDefinitionName: row.name, runs: [] }
    group.runs.push(teamRun(index + 1, row))
    teamGroups.set(row.id, group)
  })
  return { agentDefinitions: [...agentGroups.values()], teamDefinitions: [...teamGroups.values()] }
}

const mergeGroups = <T extends Record<string, any>>(existing: T[], added: T[], key: string): T[] => {
  const result = existing.map((group) => ({ ...group }))
  for (const group of added) {
    const target = result.find((candidate) => candidate[key] === group[key])
    if (target) target.runs = [...group.runs, ...target.runs]
    else result.push(group)
  }
  return result
}

/** The Project Task Manager run of the delegated-copies example is what the user talked to a couple of hours ago. */
const refreshHostRun = (entry: any): void => {
  for (const group of entry.agentDefinitions ?? []) {
    for (const run of group.runs ?? []) {
      if (run.runId === PTM_RUN_ID) { run.createdAt = ago(2 * H + 20); run.lastUpdatedAt = run.createdAt }
      if (run.runId === templateRun.runId) { run.createdAt = ago(6 * D); run.lastUpdatedAt = run.createdAt }
    }
  }
}
const addTo = (entry: any): any => {
  const added = groupsFor(entry.workspaceRootPath)
  entry.agentDefinitions = mergeGroups(entry.agentDefinitions ?? [], added.agentDefinitions, 'agentDefinitionId')
  entry.teamDefinitions = mergeGroups(entry.teamDefinitions ?? [], added.teamDefinitions, 'teamDefinitionId')
  refreshHostRun(entry)
  return withoutRemoved(entry)
}

/** The agents of these runs are in the agent catalog, so their rows carry no missing-agent mark. */
export const CATALOG_ADDITIONS = [
  { id: CODEX.id, name: CODEX.name, role: 'Codes in a folder with the Codex runtime.', description: 'A coding agent that works in a project folder.' },
  { id: APC.id, name: APC.name, role: 'Creates agent packages.', description: 'Creates agent packages for a described job.' },
]

export const withConversationsList = (name: string, variables: Record<string, any>, data: any, scenario: string): any => {
  if (scenario !== 'populated' || !data) return data
  if (name === 'GetAgentDefinitions' && Array.isArray(data.agentDefinitions) && data.agentDefinitions.length) {
    const template = data.agentDefinitions[0]
    for (const addition of CATALOG_ADDITIONS) {
      if (!data.agentDefinitions.some((item: any) => item.id === addition.id)) data.agentDefinitions.push({ ...template, ...addition, avatarUrl: null })
    }
  }
  if (name === 'ListWorkspaceRunHistory' && Array.isArray(data.listWorkspaceRunHistory)) {
    const list = data.listWorkspaceRunHistory as any[]
    for (const root of [temp, portal]) {
      if (!list.some((entry) => entry.workspaceRootPath === root)) {
        list.push({ workspaceRootPath: root, workspaceName: WORKSPACE_NAMES[root], agentDefinitions: [], teamDefinitions: [] })
      }
    }
    list.forEach(addTo)
  }
  // The host run's open conversation says when it was last active (the live row reads it), so it is the one a couple of hours ago.
  if (name === 'GetRunProjection' && variables.runId === PTM_RUN_ID && data.getRunProjection) data.getRunProjection.lastActivityAt = ago(2 * H + 20)
  // An opened example run reads as the conversation its row says (the user's title, a short invented reply) and keeps its time.
  if (name === 'GetRunProjection' && String(variables.runId).startsWith('conv-run-') && data.getRunProjection) {
    const index = Number(String(variables.runId).slice('conv-run-'.length)) - 1
    const row = AGENT_ROWS[index]
    if (row) {
      const at = Date.parse(ago(row.minutes))
      data.getRunProjection = {
        ...data.getRunProjection, runId: variables.runId, summary: row.summary, lastActivityAt: new Date(at).toISOString(),
        conversation: [
          { kind: 'message', role: 'user', content: row.summary, ts: new Date(at).toISOString() },
          { kind: 'message', role: 'assistant', content: 'Here is a first pass. Tell me what to change and I will keep this conversation as the one place we work on it.', ts: new Date(at + 40_000).toISOString() },
        ],
        activities: [],
      }
    }
  }
  if (name === 'GetAgentRunResumeConfig' && String(variables.runId).startsWith('conv-run-') && data.getAgentRunResumeConfig) {
    const row = AGENT_ROWS[Number(String(variables.runId).slice('conv-run-'.length)) - 1]
    if (row) data.getAgentRunResumeConfig = { ...data.getAgentRunResumeConfig, runId: variables.runId, isActive: false, metadataConfig: { ...data.getAgentRunResumeConfig.metadataConfig, agentDefinitionId: row.id, workspaceRootPath: row.workspaceRootPath } }
  }
  if (name === 'GetWorkspaceRunHistory' && data.workspaceRunHistory && WORKSPACE_NAMES[data.workspaceRunHistory.workspaceRootPath]) {
    addTo(data.workspaceRunHistory)
  }
  return data
}
