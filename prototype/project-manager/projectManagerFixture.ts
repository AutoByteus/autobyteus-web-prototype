/**
 * project-manager-ux (design): the Projects board is the whiteboard. It follows the Project Task
 * Manager live, and each Task links to the agents and teams working on it.
 *
 * Hand-written and illustrative. Nothing runs and nothing is computed the way the product would:
 * - each Task lists the agents and teams started for it (its workers) with their status;
 * - a new Project Task Manager chat (any workspace) runs scripted turns (refreshTurn): the Manager
 *   creates the "Website Refresh" Project, writes three Tasks one by one, asks before each
 *   dispatch, delegates on "yes", reports a worker that could not start, and marks a Task DONE
 *   when the user says so.
 *
 * The "Prototype Launch" Manager conversation and its two Tasks come from
 * task-run-resources-workspace-cleanup (taskManagerRunFixture.ts) and keep that behavior.
 * State survives a reload (localStorage). Reset: `__resetProjectManager()` in the console.
 */
import { reactive } from 'vue'
import { exposedFixtures, storedConversation } from '~/prototype/source-observation/fixtures.mjs'
import { closure, MANAGER_RUN_ID, MANAGER_DEFINITION_ID, registerClosedRuns } from '~/prototype/task-run-cleanup/taskManagerRunFixture'
import type { ProjectTaskWorker } from '~/types/project'
import { adHocTasks, NO_PROJECT_ID, resetAdHocTasks } from '~/prototype/project-manager/adHocTasksFixture'

const { run: baseRun, workspace, model } = exposedFixtures as Record<string, any>

export const LAUNCH_PROJECT_ID = 'project-prototype-launch'
export const REFRESH_PROJECT_ID = 'project-website-refresh'
export const REFRESH_RUN_ID = 'run-ptm-0002'
export { MANAGER_RUN_ID, MANAGER_DEFINITION_ID }
const MANAGER_ADDRESS = '/project_task_manager'
const STORAGE_KEY = 'autobyteus.design.projectManager.state.v1'
const createdAt = '2026-10-06T09:00:00.000Z'

const launch = { runtimeKind: 'autobyteus', llmModelIdentifier: model.modelIdentifier, llmConfig: null, autoExecuteTools: true, workspaceRootPath: workspace.workspaceRootPath }
const agentSource = (agentDefinitionId: string) => ({ kind: 'agent' as const, agentDefinitionId, launchConfiguration: launch })

// --- The Website Refresh Project -------------------------------------------------------

export const refreshProject = {
  __typename: 'Project', projectId: REFRESH_PROJECT_ID, name: 'Website Refresh',
  description: 'Refresh the marketing site for the v2 launch.',
  createdAt, updatedAt: createdAt,
  workspaces: [{ __typename: 'ProjectWorkspace', workspaceId: 'workspace-prototype', workspaceRootPath: workspace.workspaceRootPath, displayName: 'Prototype Workspace', description: 'Site sources and copy.', addedAt: createdAt, availability: 'AVAILABLE' }],
  taskCount: 0, openTaskCount: 0,
}

type RefreshTaskId = 'task-site-audit' | 'task-homepage-copy' | 'task-homepage-build'
type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'
type Delegation = 'none' | 'started' | 'failed'
type RefreshTask = { id: RefreshTaskId; status: Status; delegation: Delegation; createdAt: string; updatedAt: string }
type Entry = Record<string, unknown>
/** stage: 0 not started · 1 asks to delegate the audit · 2 asks to delegate the copy · 3 build waits. */
type State = { started: boolean; projectCreated: boolean; summary: string | null; stage: number; tasks: RefreshTask[]; transcript: Entry[]; seq: number }

const REFRESH_TASKS: Record<RefreshTaskId, { title: string; worker: string; words: RegExp }> = {
  'task-site-audit': { title: 'Audit the current site pages', worker: 'Site Audit Team', words: /audit|pages/i },
  'task-homepage-copy': { title: 'Write the new homepage copy', worker: 'Copywriter', words: /copy|writ/i },
  'task-homepage-build': { title: 'Build the new homepage', worker: 'Frontend Developer', words: /build|develop|frontend/i },
}

const initialState = (): State => ({ started: false, projectCreated: false, summary: null, stage: 0, tasks: [], transcript: [], seq: 0 })
const load = (): State => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved && Array.isArray(saved.tasks) && Array.isArray(saved.transcript)) return saved
  } catch { /* ignore */ }
  return initialState()
}
/** Reactive: the board, the Tasks tool, the tree and the conversation follow it live. */
export const refresh = reactive<State & { revision: number }>({ ...load(), revision: 0 })
const persist = () => localStorage.setItem(STORAGE_KEY, JSON.stringify({ started: refresh.started, projectCreated: refresh.projectCreated, summary: refresh.summary, stage: refresh.stage, tasks: refresh.tasks, transcript: refresh.transcript, seq: refresh.seq }))
const changed = () => { refresh.revision += 1; persist() }

/** Restores the start of the example: no Website Refresh Project, no conversation. */
export const resetProjectManager = () => {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem('autobyteus.design.taskRunCleanup.state.v2')
  resetAdHocTasks()
  location.reload()
}
;(window as any).__resetProjectManager = resetProjectManager


// --- Workers -----------------------------------------------------------------------------

const agentWorker = (hostRunId: string, name: string, agentRunId: string, status: ProjectTaskWorker['status'], error: string | null = null): ProjectTaskWorker =>
  ({ kind: 'agent', name, hostRunId, agentRunId, teamRunId: null, openRunId: agentRunId, status, error })
const teamWorker = (hostRunId: string, name: string, teamRunId: string, coordinatorRunId: string, status: ProjectTaskWorker['status']): ProjectTaskWorker =>
  ({ kind: 'team', name, hostRunId, agentRunId: null, teamRunId, openRunId: coordinatorRunId, status, error: null })

/** The root of a Task: the one agent or team the Manager handed it to, with its status. A DONE Task's root is stopped. */
export const workersOf = (projectId: string, taskId: string): ProjectTaskWorker[] => {
  void refresh.revision
  void closure.revision
  if (projectId === LAUNCH_PROJECT_ID) {
    if (taskId === 'task-release-notes') {
      const state = closure.tasks['task-release-notes']
      const round = state.rounds.length
      const stopped = state.status === 'DONE'
      // Only the root: the agent the Manager handed the Task to. The fact checker the writer started
      // itself is not listed on the Task (it stays in the Workspaces tree under the Manager's run).
      return [agentWorker(MANAGER_RUN_ID, 'release notes writer', `run-ptm-notes-${round}-writer`, stopped ? 'stopped' : 'running')]
    }
    if (taskId === 'task-docs-review') {
      const state = closure.tasks['task-docs-review']
      const round = state.rounds.length
      return [teamWorker(MANAGER_RUN_ID, 'docs review team', `team-ptm-review-${round}`, `run-ptm-review-${round}-reviewer`, state.status === 'DONE' ? 'stopped' : 'running')]
    }
    return []
  }
  if (projectId === REFRESH_PROJECT_ID) {
    const task = refresh.tasks.find((item) => item.id === taskId)
    if (!task || task.delegation === 'none') return []
    const stopped = task.status === 'DONE'
    if (task.id === 'task-site-audit') return [teamWorker(REFRESH_RUN_ID, 'site audit team', 'team-ptm-audit', 'run-ptm-audit-auditor', stopped ? 'stopped' : 'running')]
    if (task.id === 'task-homepage-copy') return [agentWorker(REFRESH_RUN_ID, 'copywriter', 'run-ptm-copy-writer', stopped ? 'stopped' : 'running')]
    if (task.id === 'task-homepage-build') return [agentWorker(REFRESH_RUN_ID, 'frontend developer', 'run-ptm-build-dev', 'failed', 'No model is set for frontend developer.')]
  }
  return []
}

/** The Task a worker run serves, for the Workspaces tree and the worker's header. */
export const taskOfRun = (hostRunId: string, runId: string | null | undefined): { projectId: string; taskId: string; title: string } | null => {
  void refresh.revision
  if (!runId) return null
  if (hostRunId === MANAGER_RUN_ID) {
    if (/^run-ptm-notes-\d+-(writer|checker)$/.test(runId)) return { projectId: LAUNCH_PROJECT_ID, taskId: 'task-release-notes', title: 'Draft release notes' }
    if (/^(team-ptm-review-\d+|run-ptm-review-\d+-(reviewer|editor))$/.test(runId)) return { projectId: LAUNCH_PROJECT_ID, taskId: 'task-docs-review', title: 'Review docs site' }
  }
  if (hostRunId === REFRESH_RUN_ID) {
    if (/^(team-ptm-audit|run-ptm-audit-(auditor|seo))$/.test(runId)) return { projectId: REFRESH_PROJECT_ID, taskId: 'task-site-audit', title: REFRESH_TASKS['task-site-audit'].title }
    if (runId === 'run-ptm-copy-writer') return { projectId: REFRESH_PROJECT_ID, taskId: 'task-homepage-copy', title: REFRESH_TASKS['task-homepage-copy'].title }
  }
  return null
}

// A DONE Task's runs leave the tree (task-run-resources-workspace-cleanup), here for Website Refresh.
const auditDone = () => refresh.tasks.find((task) => task.id === 'task-site-audit')?.status === 'DONE'
const copyDone = () => refresh.tasks.find((task) => task.id === 'task-homepage-copy')?.status === 'DONE'
registerClosedRuns((hostRunId, runId) => {
  if (hostRunId !== REFRESH_RUN_ID) return false
  void refresh.revision
  if (/^(team-ptm-audit|run-ptm-audit-)/.test(runId)) return auditDone()
  if (runId === 'run-ptm-copy-writer') return copyDone()
  return false
})

// --- Project data -------------------------------------------------------------------------

const projectTask = (task: RefreshTask) => ({
  __typename: 'ProjectTask', taskId: task.id, projectId: REFRESH_PROJECT_ID, description: REFRESH_TASKS[task.id].title,
  status: task.status, createdAt: task.createdAt, updatedAt: task.updatedAt, contextFiles: [],
})

/** Adds Website Refresh (once the Manager created it) and its Tasks to the in-memory project data. */
export const syncRefreshProject = (projectState: { projects: any[]; tasks: any[] } | null | undefined) => {
  if (!projectState) return
  if (!refresh.projectCreated) return
  if (!projectState.projects.some((item: any) => item.projectId === REFRESH_PROJECT_ID)) projectState.projects.push(structuredClone(refreshProject))
  for (const task of refresh.tasks) {
    const existing = projectState.tasks.find((item: any) => item.taskId === task.id)
    if (existing) Object.assign(existing, { status: task.status, updatedAt: task.updatedAt })
    else projectState.tasks.push(projectTask(task))
  }
}

/** Every Task read carries its workers (the product would read them with the Task). */
export const withWorkers = (task: any) => ({ ...task, workers: workersOf(task.projectId, task.taskId) })

let projectDataSource: () => { projects: any[]; tasks: any[] } = () => ({ projects: [], tasks: [] })
export const registerProjectDataSource = (source: typeof projectDataSource) => { projectDataSource = source }
/** A Project's Tasks with their workers, as a live Task push would carry them. */
export const liveTasksOf = (projectId: string) =>
  structuredClone(projectDataSource().tasks.filter((task: any) => task.projectId === projectId)).map(withWorkers)

// --- The Manager's scripted turns (Website Refresh) ---------------------------------------

const now = () => new Date().toISOString()
const call = (toolName: string, toolArgs: Record<string, unknown>, toolResult: unknown): Entry =>
  ({ kind: 'tool_call', invocationId: `ptm2-call-${++refresh.seq}`, toolName, toolArgs, toolResult, ts: Date.now() / 1000 })
const say = (content: string): Entry => ({ kind: 'message', role: 'assistant', content, ts: Date.now() / 1000 })

/** One step of a turn: what the Manager adds to the conversation, and what changes on the board. */
export type TurnStep = { entries: () => Entry[]; apply?: () => void; delegated?: boolean; closedRunIds?: string[]; quiet?: boolean; projectChanged?: boolean }

const setTask = (id: RefreshTaskId, patch: Partial<RefreshTask>) => {
  const task = refresh.tasks.find((item) => item.id === id)
  if (task) Object.assign(task, patch, { updatedAt: now() })
}
const create = (id: RefreshTaskId): TurnStep => ({
  apply: () => { refresh.tasks.push({ id, status: 'TODO', delegation: 'none', createdAt: now(), updatedAt: now() }) },
  entries: () => [call('create_or_update_task', { project_id: REFRESH_PROJECT_ID, description: REFRESH_TASKS[id].title }, { task_id: id, status: 'TODO' })],
})
const recipient = (id: RefreshTaskId) => id === 'task-site-audit' ? '/site_audit_team' : id === 'task-homepage-copy' ? '/copywriter' : '/frontend_developer'
const delegate = (id: RefreshTaskId): TurnStep[] => [
  {
    delegated: true,
    apply: () => setTask(id, { delegation: 'started' }),
    entries: () => [call('delegate_task', { task_id: id, recipient_address: recipient(id) }, { status: 'started' })],
  },
  {
    apply: () => setTask(id, { status: 'IN_PROGRESS' }),
    entries: () => [call('create_or_update_task', { task_id: id, status: 'IN_PROGRESS' }, { status: 'IN_PROGRESS' })],
  },
]

const YES = /^\s*(yes|yep|yeah|sure|ok|okay|go ahead|go|do it|please|approve|delegate it|sounds good)\b/i
const NO = /^\s*(no|nope|wait|not yet|hold|stop|later)\b/i

/** Records the user's message; the first one names the conversation. */
export const recordRefreshUserMessage = (text: string) => {
  if (!refresh.summary) refresh.summary = text
  refresh.transcript.push({ kind: 'message', role: 'user', content: text, ts: Date.now() / 1000 })
  changed()
}

/** The Manager's answer to the user's message, as steps the UI shows one by one. */
export const refreshTurn = (text: string): TurnStep[] => {
  const steps: TurnStep[] = []
  const reply = (content: string) => steps.push({ entries: () => [say(content)] })
  const named = (Object.keys(REFRESH_TASKS) as RefreshTaskId[]).find((id) => REFRESH_TASKS[id].words.test(text))

  if (refresh.stage === 0) {
    reply('I will set this up as a Project, **Website Refresh**, and write its Tasks.')
    steps.push({
      projectChanged: true,
      apply: () => { refresh.projectCreated = true },
      entries: () => [call('create_or_update_project', { name: 'Website Refresh', description: refreshProject.description }, { project_id: REFRESH_PROJECT_ID })],
    })
    steps.push(create('task-site-audit'), create('task-homepage-copy'), create('task-homepage-build'))
    reply('Three Tasks are on the board. I suggest we start with **Audit the current site pages** and give it to the **Site Audit Team** (an auditor and an SEO reviewer).\n\nShall I delegate it?')
    steps.push({ quiet: true, entries: () => [], apply: () => { refresh.stage = 1 } })
    return steps
  }

  // "The audit is done, close it": the Manager marks the Task DONE; its workers stop.
  if (/\b(done|finished|complete|close)\b/i.test(text) && named) {
    const task = refresh.tasks.find((item) => item.id === named)
    if (!task || task.status !== 'IN_PROGRESS') {
      reply(`**${REFRESH_TASKS[named].title}** is not in progress, so there is nothing to close.`)
      return steps
    }
    steps.push({
      apply: () => setTask(named, { status: 'DONE' }),
      closedRunIds: named === 'task-site-audit' ? ['run-ptm-audit-auditor', 'run-ptm-audit-seo'] : ['run-ptm-copy-writer'],
      entries: () => [call('create_or_update_task', { task_id: named, status: 'DONE' }, { status: 'DONE' })],
    })
    reply(`**${REFRESH_TASKS[named].title}** is done. I marked the Task DONE, and its workers are stopped.`)
    return steps
  }

  // "Start the build anyway": the Frontend Developer cannot start; the Task stays in To Do.
  if (named === 'task-homepage-build' && refresh.stage >= 3) {
    steps.push({
      apply: () => setTask('task-homepage-build', { delegation: 'failed' }),
      entries: () => [call('delegate_task', { task_id: 'task-homepage-build', recipient_address: '/frontend_developer' }, { status: 'failed', message: 'No model is set for frontend developer.' })],
    })
    reply('The **Frontend Developer** could not start: no model is set for it. **Build the new homepage** stays in To Do. Set a model for the Frontend Developer, then tell me to try again.')
    return steps
  }

  if (NO.test(text) && (refresh.stage === 1 || refresh.stage === 2)) {
    reply('OK, I will wait. Nothing is delegated. Tell me when you want me to go ahead.')
    return steps
  }

  if (YES.test(text) && refresh.stage === 1) {
    steps.push(...delegate('task-site-audit'))
    reply('**Audit the current site pages** is with the Site Audit Team.\n\nNext: **Write the new homepage copy** for the **Copywriter**. Delegate it now?')
    steps.push({ quiet: true, entries: () => [], apply: () => { refresh.stage = 2 } })
    return steps
  }

  if (YES.test(text) && refresh.stage === 2) {
    steps.push(...delegate('task-homepage-copy'))
    reply('**Write the new homepage copy** is with the Copywriter.\n\n**Build the new homepage** needs the new copy first, so it stays in To Do until the copy is done.')
    steps.push({ quiet: true, entries: () => [], apply: () => { refresh.stage = 3 } })
    return steps
  }

  if (refresh.stage === 1) reply('Shall I delegate **Audit the current site pages** to the Site Audit Team? Answer yes or no.')
  else if (refresh.stage === 2) reply('Shall I delegate **Write the new homepage copy** to the Copywriter? Answer yes or no.')
  else reply('Tell me which Task is finished, for example "the audit is done", and I will close it.')
  return steps
}

/** Plays one step: board change first, then the Manager's entries. */
export const applyStep = (step: TurnStep) => {
  step.apply?.()
  refresh.transcript.push(...step.entries())
  changed()
  if (step.closedRunIds?.length) closure.revision += 1
}

export const refreshConversation = (): Entry[] => JSON.parse(JSON.stringify(refresh.transcript))

/** Registers the conversation the first message starts (PrepareAgentRun's result). */
export const startRefreshConversation = () => {
  refresh.started = true
  changed()
}

// --- Website Refresh Manager run: collaboration view and reads ----------------------------

const auditTeam = () => ({
  address: '/site_audit_team', teamRunId: 'team-ptm-audit', delegatorAgentRunId: REFRESH_RUN_ID, startedAt: createdAt,
  source: {
    kind: 'agent_team', teamDefinitionId: 'team-site-audit', coordinatorAddress: '/site_audit_team/auditor',
    members: [
      { address: '/site_audit_team/auditor', agentDefinitionId: 'agent-auditor' },
      { address: '/site_audit_team/seo_reviewer', agentDefinitionId: 'agent-seo-reviewer' },
    ],
    handoffs: [], defaultLaunchConfiguration: launch,
  },
  members: [
    { address: '/site_audit_team/auditor', agentRunId: 'run-ptm-audit-auditor', platformAgentRunId: null },
    { address: '/site_audit_team/seo_reviewer', agentRunId: 'run-ptm-audit-seo', platformAgentRunId: null },
  ],
  taskExecutions: [],
})
const copywriter = () => ({ address: '/copywriter', agentRunId: 'run-ptm-copy-writer', platformAgentRunId: null, delegatorAgentRunId: REFRESH_RUN_ID, startedAt: createdAt, source: agentSource('agent-copywriter') })

const refreshExecutions = () => {
  const started = (id: RefreshTaskId) => refresh.tasks.find((task) => task.id === id)?.delegation === 'started'
  const nodes: any[] = []
  if (started('task-site-audit')) nodes.push(auditTeam())
  if (started('task-homepage-copy')) nodes.push(copywriter())
  return nodes
}

export const refreshCollaborationView = (active = false) => {
  const taskExecutions = refreshExecutions()
  const statuses: any[] = []
  const status = (agentRunId: string, address: string, value: string) =>
    statuses.push({ member_address: address, agent_run_id: agentRunId, status: value, trigger: null, tool_name: null, error_message: null, error_details: null, recoverableBlock: null })
  if (taskExecutions.some((node) => node.teamRunId === 'team-ptm-audit')) {
    status('run-ptm-audit-auditor', '/site_audit_team/auditor', auditDone() ? 'offline' : 'running')
    status('run-ptm-audit-seo', '/site_audit_team/seo_reviewer', auditDone() ? 'offline' : 'idle')
  }
  if (taskExecutions.some((node) => node.agentRunId === 'run-ptm-copy-writer')) status('run-ptm-copy-writer', '/copywriter', copyDone() ? 'offline' : 'running')
  return {
    root_subject_kind: 'agent', root_run_id: REFRESH_RUN_ID,
    root_agent: {
      base_change_sequence: 1, is_active: active,
      execution_tree: {
        subjectKind: 'agent', createdAt,
        host: { address: MANAGER_ADDRESS, agentRunId: REFRESH_RUN_ID, agentDefinitionId: MANAGER_DEFINITION_ID },
        collaborators: [], taskExecutions,
      },
      communication_messages: { schemaVersion: 1, subjectKind: 'agent', hostRunId: REFRESH_RUN_ID, messages: [] },
      agent_statuses: statuses,
      agent_input_states: [],
    },
  }
}

const refreshRun = () => ({
  ...baseRun,
  runId: REFRESH_RUN_ID, agentRunId: REFRESH_RUN_ID,
  agentDefinitionId: MANAGER_DEFINITION_ID, agentName: 'Project Task Manager',
  summary: refresh.summary || 'Website Refresh',
  createdAt: now(), lastUpdatedAt: now(), lastActivityAt: now(),
  status: 'IDLE', isActive: true, shouldConnectStream: true, statusSource: 'live',
  hasCollaboration: refreshExecutions().length > 0,
})

const workerConversation = (agentRunId: string) => {
  if (agentRunId === 'run-ptm-audit-auditor') return [
    { kind: 'inter_agent_message', role: 'user', content: `You received a message from sender name: project task manager, sender address: ${MANAGER_ADDRESS}, sender id: ${REFRESH_RUN_ID}\nmessage:\nTask "Audit the current site pages": list every page, what is outdated, and what is missing.`, senderAgentRunId: REFRESH_RUN_ID, senderAddress: MANAGER_ADDRESS, ts: Date.now() / 1000 },
    { kind: 'message', role: 'assistant', content: 'Auditing the site now. The SEO reviewer is checking titles and descriptions.', ts: Date.now() / 1000 },
  ]
  if (agentRunId === 'run-ptm-copy-writer') return [
    { kind: 'inter_agent_message', role: 'user', content: `You received a message from sender name: project task manager, sender address: ${MANAGER_ADDRESS}, sender id: ${REFRESH_RUN_ID}\nmessage:\nTask "Write the new homepage copy": a headline, three feature blocks and a call to action for v2.`, senderAgentRunId: REFRESH_RUN_ID, senderAddress: MANAGER_ADDRESS, ts: Date.now() / 1000 },
    { kind: 'message', role: 'assistant', content: 'Drafting the homepage copy. I will start with the headline options.', ts: Date.now() / 1000 },
  ]
  return storedConversation('Work on your part of the Website Refresh.', 'Working on it.')
}

/** Adds the Website Refresh Manager run to the populated fixture reads, once it is started. */
export const withProjectManager = (name: string, variables: Record<string, any>, data: any, scenario: string): any => {
  if (scenario !== 'populated' || !data) return data
  switch (name) {
    case 'ListWorkspaceRunHistory':
    case 'GetWorkspaceRunHistory': {
      const entries = name === 'ListWorkspaceRunHistory' ? data.listWorkspaceRunHistory : [data.workspaceRunHistory]
      const entry = entries?.find((item: any) => item?.workspaceRootPath === workspace.workspaceRootPath)
      const managerGroup = entry?.agentDefinitions?.find((item: any) => item.agentDefinitionId === MANAGER_DEFINITION_ID)
      if (managerGroup && refresh.started && !managerGroup.runs.some((item: any) => item.runId === REFRESH_RUN_ID)) managerGroup.runs = [refreshRun(), ...managerGroup.runs]
      return data
    }
    case 'GetProjectTasks':
      // project-manager-ux round 2: the Tasks with no Project are read like a Project's Tasks here.
      if (variables.projectId === NO_PROJECT_ID) return { ...data, projectTasks: adHocTasks() }
      return { ...data, projectTasks: (data.projectTasks ?? []).map(withWorkers) }
    case 'GetAgentRunCollaboration':
      return variables.runId === REFRESH_RUN_ID ? { agentRunCollaboration: refreshCollaborationView() } : data
    case 'GetAgentRunCollaborationMemberProjection':
      return variables.hostRunId === REFRESH_RUN_ID
        ? { agentRunCollaborationMemberProjection: { agentRunId: variables.agentRunId, memberAddress: variables.memberAddress, summary: null, lastActivityAt: createdAt, conversation: workerConversation(variables.agentRunId), activities: [], hasEarlierActiveTraceEvents: false } }
        : data
    case 'GetAgentRunCollaborationMemberEventMonitorActiveTracePage':
      return variables.hostRunId === REFRESH_RUN_ID ? { agentRunCollaborationMemberEventMonitorActiveTracePage: null } : data
    case 'GetRunProjection':
      return variables.runId === REFRESH_RUN_ID
        ? { getRunProjection: { runId: REFRESH_RUN_ID, summary: refresh.summary, lastActivityAt: createdAt, conversation: refreshConversation(), activities: [], hasEarlierActiveTraceEvents: false } }
        : data
    case 'GetAgentRunResumeConfig':
      return variables.runId === REFRESH_RUN_ID
        ? { getAgentRunResumeConfig: { ...data.getAgentRunResumeConfig, runId: REFRESH_RUN_ID, isActive: true, metadataConfig: { ...data.getAgentRunResumeConfig.metadataConfig, agentDefinitionId: MANAGER_DEFINITION_ID } } }
        : data
    default:
      return data
  }
}
