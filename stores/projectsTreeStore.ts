import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useProjectStore } from '~/stores/projectStore'
import { useProjectsPanelStore } from '~/stores/projectsPanelStore'
import { useRunHistoryStore } from '~/stores/runHistoryStore'
import { useWindowNodeContextStore } from '~/stores/windowNodeContextStore'
import { normalizeRootPath } from '~/stores/runHistoryReadModel'
import type {
  AgentOrgHistoryDefinitionGroup,
  TeamRunHistoryDefinitionGroup,
  TeamTreeNode,
  WorkspaceHistoryWorkspaceNode,
} from '~/stores/runHistoryTypes'
import type { RunTreeAgentNode } from '~/utils/runTreeProjection'
import type { Project } from '~/types/project'
import { PROJECT_RUN_LINKS, type ProjectRunLink } from '~/prototype/projects-left-navigation/projectRunLinks'

/** What the left panel's run section shows: today's Workspaces tree, or the Projects tree. */
export type RunSectionMode = 'workspaces' | 'projects'
export type ProjectsTreeRead = 'loading' | 'ready' | 'error'

export const RUN_SECTION_MODE_STORAGE_PREFIX = 'autobyteus.leftPanel.runSectionMode.'
/**
 * Design-only starting state of the Projects tree (a local-storage seed, read once; no visible control sets it):
 * `loading` (the first read takes a few seconds), `error` (the first read fails; Retry succeeds), `stale-error`
 * (the first read works; the next refresh fails once; Retry succeeds), `none` (the node has no Projects).
 */
export const PROJECTS_TREE_SEED_KEY = 'autobyteus.prototype.projectsTree'

const storage = (): Storage | null => (typeof window !== 'undefined' && window.localStorage ? window.localStorage : null)
const readSeed = (): string => { try { return storage()?.getItem(PROJECTS_TREE_SEED_KEY) ?? '' } catch { return '' } }
const wait = (ms: number) => new Promise<void>((done) => setTimeout(done, ms))

/** The Project's first linked folder (the primary one, REQ-005), or null when it has none. */
export const firstFolderOf = (project: Pick<Project, 'workspaces'> | null | undefined): string | null =>
  project?.workspaces?.[0]?.workspaceRootPath?.trim() || null

export type ProjectTreeNode = Readonly<{
  project: Project
  node: WorkspaceHistoryWorkspaceNode
  teams: TeamTreeNode[]
  teamHistoryGroups: TeamRunHistoryDefinitionGroup[]
  runCount: number
}>

/**
 * The Projects mode of the left panel (REQ-001…003, REQ-011): the remembered mode, the read state of the
 * Projects tree, and each Project's runs grouped like a workspace's. The UI reference derives a Project's runs
 * from the example run links (`prototype/projects-left-navigation/projectRunLinks.ts`) plus runs started under a
 * Project during the session; the product reads them from Task records and a "started under" record.
 */
export const useProjectsTreeStore = defineStore('projectsTree', () => {
  const node = useWindowNodeContextStore()
  const projectStore = useProjectStore()
  const panel = useProjectsPanelStore()
  const runHistory = useRunHistoryStore()
  const seed = readSeed()

  // --- Mode (REQ-001): remembered per node; switching changes only the tree. ---
  const storageKey = () => `${RUN_SECTION_MODE_STORAGE_PREFIX}${node.entryId}`
  const mode = ref<RunSectionMode>('workspaces')
  const readMode = () => { mode.value = storage()?.getItem(storageKey()) === 'projects' ? 'projects' : 'workspaces' }
  readMode()
  watch(() => node.entryId, readMode)
  const setMode = (next: RunSectionMode) => {
    mode.value = next
    try { storage()?.setItem(storageKey(), next) } catch { /* kept for this session */ }
  }

  // --- Read state (REQ-011): loading, ready, error with Retry; a failed refresh keeps the last good tree. ---
  const read = ref<ProjectsTreeRead>(seed === 'loading' ? 'loading' : 'ready')
  const errorMessage = ref<string | null>(null)
  const hasLoaded = ref(false)
  let failuresLeft = seed === 'error' || seed === 'stale-error' ? 1 : 0
  let reads = 0
  let inFlight: Promise<void> | null = null

  const load = (options: { quiet?: boolean } = {}): Promise<void> => {
    if (inFlight) return inFlight
    if (!options.quiet && !hasLoaded.value) read.value = 'loading'
    inFlight = (async () => {
      const readNumber = ++reads
      try {
        if (seed === 'loading' && readNumber === 1) await wait(6000)
        else await wait(350)
        // `error`: the first read fails. `stale-error`: the read after the first one fails.
        const failsNow = failuresLeft > 0 && (seed === 'error' ? readNumber === 1 : readNumber === 2)
        if (failsNow) { failuresLeft -= 1; throw new Error('Synthetic read failure.') }
        await Promise.all([projectStore.fetchProjects(true).catch(() => undefined), runHistory.fetchTree().catch(() => undefined)])
        hasLoaded.value = true
        errorMessage.value = null
        read.value = 'ready'
      } catch (cause) {
        errorMessage.value = cause instanceof Error ? cause.message : String(cause)
        read.value = 'error'
      } finally {
        inFlight = null
      }
    })()
    return inFlight
  }
  const retry = () => load()

  // --- Runs started under a Project in this session (REQ-004): listed at once, and in Workspaces under their folder. ---
  const startedUnderLinks = ref<Record<string, ProjectRunLink[]>>({})
  const recordStartedUnder = (projectId: string, link: Omit<ProjectRunLink, 'startedUnder'>) => {
    const current = startedUnderLinks.value[projectId] ?? []
    if (current.some((entry) => entry.runId === link.runId)) return
    startedUnderLinks.value = { ...startedUnderLinks.value, [projectId]: [...current, { ...link, startedUnder: true }] }
  }
  const linksOf = (projectId: string): ProjectRunLink[] => [...(PROJECT_RUN_LINKS[projectId] ?? []), ...(startedUnderLinks.value[projectId] ?? [])]
  /** Whether the run was started under the Project (its Temp-task work then belongs there too, REQ-008). */
  const isStartedUnder = (projectId: string, runId: string): boolean => linksOf(projectId).some((link) => link.runId === runId && link.startedUnder)

  // --- The tree (REQ-002, REQ-003). ---
  const projects = computed<Project[]>(() => (seed === 'none' ? [] : projectStore.projects))

  const buildNode = (project: Project): ProjectTreeNode => {
    const links = linksOf(project.projectId)
    const idsOf = (kind: ProjectRunLink['kind']) => new Set(links.filter((link) => link.kind === kind).map((link) => link.runId))
    const agentIds = idsOf('agent'); const teamIds = idsOf('team'); const orgIds = idsOf('org')

    const workspaces = runHistory.getTreeNodes()
    // One agent group per agent, across the Project's runs' folders (a Project's runs may live in several folders).
    const agents = new Map<string, RunTreeAgentNode>()
    for (const workspace of workspaces) {
      for (const agent of workspace.agents) {
        const runs = agent.runs.filter((run) => agentIds.has(run.runId))
        if (!runs.length) continue
        const group = agents.get(agent.agentDefinitionId)
        if (group) group.runs.push(...runs)
        else agents.set(agent.agentDefinitionId, { ...agent, runs: [...runs] })
      }
    }
    const orgGroups = new Map<string, AgentOrgHistoryDefinitionGroup>()
    for (const workspace of workspaces) {
      for (const group of workspace.agentOrgDefinitions ?? []) {
        const runs = group.runs.filter((run) => orgIds.has(run.rootRunId))
        if (!runs.length) continue
        const existing = orgGroups.get(group.definitionId)
        if (existing) existing.runs.push(...runs)
        else orgGroups.set(group.definitionId, { ...group, stableKey: `${project.projectId}:${group.stableKey}`, runs: [...runs] })
      }
    }
    const teams = runHistory.getTeamNodes().filter((team) => teamIds.has(team.teamRunId))
    const teamHistoryGroups: TeamRunHistoryDefinitionGroup[] = []
    for (const workspace of runHistory.workspaceGroups ?? []) {
      for (const group of workspace.teamDefinitions) {
        const runs = group.runs.filter((run) => teamIds.has(run.teamRunId))
        if (runs.length) teamHistoryGroups.push({ ...group, runs })
      }
    }
    const folder = firstFolderOf(project)
    const stableKey = `project:${project.projectId}`
    const agentNodes = [...agents.values()]
    return {
      project,
      teams,
      teamHistoryGroups,
      runCount: agentNodes.reduce((sum, agent) => sum + agent.runs.length, 0) + teams.length + [...orgGroups.values()].reduce((sum, group) => sum + group.runs.length, 0),
      node: {
        workspaceId: stableKey,
        workspaceRootPath: folder ? normalizeRootPath(folder) : '',
        workspaceName: project.name,
        workspaceKind: 'filesystem',
        canRemoveFromWorkspaces: false,
        agents: agentNodes,
        stableKey,
        agentOrgDefinitions: [...orgGroups.values()],
      } as WorkspaceHistoryWorkspaceNode,
    }
  }

  const projectNodes = computed<ProjectTreeNode[]>(() => projects.value.map(buildNode))
  const projectById = (projectId: string): Project | null => projects.value.find((project) => project.projectId === projectId) ?? null

  // --- The right board follows the selected Project (REQ-002, REQ-007); it is the board's own remembered choice. ---
  const selectedProjectId = computed<string | null>(() => (panel.choice.kind === 'project' ? panel.choice.projectId : null))
  const selectProject = (projectId: string) => panel.choose({ kind: 'project', projectId })

  return {
    mode, setMode,
    read, errorMessage, hasLoaded, load, retry,
    projects, projectNodes, projectById, linksOf, isStartedUnder, recordStartedUnder,
    selectedProjectId, selectProject,
  }
})
