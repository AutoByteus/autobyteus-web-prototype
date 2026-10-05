/**
 * task-run-resources-workspace-cleanup (design): a Project Task Manager run in
 * prototype-workspace whose Task runs appear under it in the Workspaces tree, and the Task
 * closure facts (DONE) that decide which of those runs are still listed.
 *
 * Hand-written and illustrative. Nothing runs: the Manager "marks a Task DONE" through the review
 * panel (TaskDoneReviewPanel.vue), which stands in for its `update_project_task` call. The run's
 * data is never removed; DONE only records that the Task's runs are closed, and the tree leaves
 * closed runs out. The closure state survives a page reload (localStorage), like the real
 * closure record survives reload and restart.
 */
import { reactive } from 'vue'
import { exposedFixtures, storedConversation } from '~/prototype/source-observation/fixtures.mjs'

const { agent, run: baseRun, workspace, model } = exposedFixtures as Record<string, any>

export const MANAGER_RUN_ID = 'run-ptm-0001'
export const MANAGER_DEFINITION_ID = 'project-task-manager'
const MANAGER_ADDRESS = '/project_task_manager'
const STORAGE_KEY = 'autobyteus.design.taskRunCleanup.state'
const createdAt = '2026-10-05T08:00:00.000Z'

const launch = { runtimeKind: 'autobyteus', llmModelIdentifier: model.modelIdentifier, llmConfig: null, autoExecuteTools: true, workspaceRootPath: workspace.workspaceRootPath }
const agentSource = (agentDefinitionId: string) => ({ kind: 'agent' as const, agentDefinitionId, launchConfiguration: launch })

/** One delegation round of a Task: the runs it started, closed together when the Task is DONE. */
type Round = { closed: boolean }
type TaskId = 'task-notes' | 'task-review'
type ClosureState = { rounds: Record<TaskId, Round[]> }

export const TASKS: ReadonlyArray<{ id: TaskId; title: string; assignee: string }> = [
  { id: 'task-notes', title: 'Draft release notes', assignee: 'Release Notes Writer' },
  { id: 'task-review', title: 'Review docs site', assignee: 'Docs Review Team' },
]

const initialState = (): ClosureState => ({ rounds: { 'task-notes': [{ closed: false }], 'task-review': [{ closed: false }] } })
const load = (): ClosureState => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved?.rounds?.['task-notes']?.length && saved?.rounds?.['task-review']?.length) return saved
  } catch { /* ignore */ }
  return initialState()
}

/** Reactive closure facts: the tree and the main view follow them live. */
export const closure = reactive<ClosureState & { revision: number; lastClosed: { taskId: TaskId; runIds: string[] } | null }>({
  ...load(), revision: 0, lastClosed: null,
})
const persist = () => localStorage.setItem(STORAGE_KEY, JSON.stringify({ rounds: closure.rounds }))

// --- Task runs, by round ------------------------------------------------------------------

/** Task "Draft release notes": the assigned writer, plus a fact checker the writer delegated to (round 1). */
const notesRound = (round: number) => {
  const writer = `run-ptm-notes-${round}-writer`
  const nodes: any[] = [
    { address: '/release_notes_writer', agentRunId: writer, platformAgentRunId: null, delegatorAgentRunId: MANAGER_RUN_ID, startedAt: createdAt, source: agentSource('agent-release-notes-writer') },
  ]
  if (round === 1) {
    nodes.push({ address: '/fact_checker', agentRunId: `run-ptm-notes-${round}-checker`, platformAgentRunId: null, delegatorAgentRunId: writer, startedAt: createdAt, source: agentSource('agent-fact-checker') })
  }
  return nodes
}

/** Task "Review docs site": a Team with two members. */
const reviewRound = (round: number) => [{
  address: '/docs_review_team', teamRunId: `team-ptm-review-${round}`, delegatorAgentRunId: MANAGER_RUN_ID, startedAt: createdAt,
  source: {
    kind: 'agent_team', teamDefinitionId: 'team-docs-review', coordinatorAddress: '/docs_review_team/reviewer',
    members: [
      { address: '/docs_review_team/reviewer', agentDefinitionId: 'agent-reviewer' },
      { address: '/docs_review_team/editor', agentDefinitionId: 'agent-editor' },
    ],
    handoffs: [], defaultLaunchConfiguration: launch,
  },
  members: [
    { address: '/docs_review_team/reviewer', agentRunId: `run-ptm-review-${round}-reviewer`, platformAgentRunId: null },
    { address: '/docs_review_team/editor', agentRunId: `run-ptm-review-${round}-editor`, platformAgentRunId: null },
  ],
  taskExecutions: [],
}]

const roundNodes = (taskId: TaskId, round: number) => taskId === 'task-notes' ? notesRound(round) : reviewRound(round)

/** Every AgentRun and TeamRun id a node holds (a Team with its members). */
const idsOf = (node: any): string[] => 'agentRunId' in node
  ? [node.agentRunId]
  : [node.teamRunId, ...node.members.flatMap(idsOf), ...node.taskExecutions.flatMap(idsOf)]

/** A delegation without a Task (description only): no DONE, never closed. */
const descriptionOnly = { address: '/researcher', agentRunId: 'run-ptm-researcher', platformAgentRunId: null, delegatorAgentRunId: MANAGER_RUN_ID, startedAt: createdAt, source: agentSource('agent-researcher') }

/** All recorded executions, open and closed: DONE never removes the record. */
const allTaskExecutions = () => {
  const nodes: any[] = []
  for (const task of TASKS) {
    closure.rounds[task.id].forEach((_round, index) => {
      nodes.push(...roundNodes(task.id, index + 1))
      if (task.id === 'task-notes' && index === 0) nodes.push(descriptionOnly)
    })
  }
  return nodes
}

/** The ids of runs whose Task is DONE (the Task-side closure facts). */
const closedIds = (): Set<string> => {
  const ids = new Set<string>()
  for (const task of TASKS) {
    closure.rounds[task.id].forEach((round, index) => {
      if (round.closed) roundNodes(task.id, index + 1).flatMap(idsOf).forEach((id) => ids.add(id))
    })
  }
  return ids
}

/** Read by the Workspaces tree and the main view; reactive. */
export const isClosedTaskRun = (hostRunId: string, runId: string): boolean => {
  void closure.revision
  return hostRunId === MANAGER_RUN_ID && closedIds().has(runId)
}

export const taskStatus = (taskId: TaskId): 'open' | 'done' => closure.rounds[taskId].at(-1)!.closed ? 'done' : 'open'
export const roundCount = (taskId: TaskId): number => closure.rounds[taskId].length

// --- Review actions (stand-ins for the Manager's tool calls) ------------------------------

/** The Manager sets the Task to DONE: the open round's runs are closed. */
export const markTaskDone = (taskId: TaskId) => {
  const rounds = closure.rounds[taskId]
  const open = rounds.at(-1)!
  if (open.closed) return
  open.closed = true
  closure.lastClosed = { taskId, runIds: roundNodes(taskId, rounds.length).flatMap(idsOf) }
  closure.revision += 1
  persist()
}

/** The Manager reopens the Task and delegates it again: a new round of runs starts. */
export const reopenAndDelegate = (taskId: TaskId) => {
  closure.rounds[taskId].push({ closed: false })
  closure.lastClosed = null
  closure.revision += 1
  persist()
}

export const resetClosure = () => {
  closure.rounds = initialState().rounds
  closure.lastClosed = null
  closure.revision += 1
  localStorage.removeItem(STORAGE_KEY)
}

// --- GraphQL reads ---------------------------------------------------------------------

const managerRun = () => ({
  ...baseRun,
  runId: MANAGER_RUN_ID, agentRunId: MANAGER_RUN_ID,
  agentDefinitionId: MANAGER_DEFINITION_ID, agentName: 'Project Task Manager',
  summary: 'Plan and ship the v2 docs release',
  createdAt, lastUpdatedAt: '2026-10-05T09:10:00.000Z',
  status: 'IDLE', isActive: false, shouldConnectStream: false, statusSource: 'stored',
  hasCollaboration: true,
})

/** Live-looking statuses for the open runs; a closed run reports offline. */
const statuses = (executions: any[]) => {
  const closed = closedIds()
  const result: any[] = []
  const visit = (node: any) => {
    if ('agentRunId' in node) {
      const status = closed.has(node.agentRunId) ? 'offline' : node.agentRunId.endsWith('-writer') || node.agentRunId.endsWith('-reviewer') ? 'running' : 'idle'
      result.push({ member_address: node.address, agent_run_id: node.agentRunId, status, trigger: null, tool_name: null, error_message: null, error_details: null, recoverableBlock: null })
      return
    }
    node.members.forEach(visit)
    node.taskExecutions.forEach(visit)
  }
  executions.forEach(visit)
  return result
}

const collaboration = () => {
  const taskExecutions = allTaskExecutions()
  const collaborators = [
    { kind: 'agent', address: '/documentation_writer', agentDefinitionId: 'agent-writer', agentRunId: 'run-ptm-collab-writer', platformAgentRunId: null, launchConfiguration: launch, addedAt: createdAt, addedViaAgentRunId: MANAGER_RUN_ID },
  ]
  return {
    root_subject_kind: 'agent', root_run_id: MANAGER_RUN_ID,
    root_agent: {
      base_change_sequence: 1, is_active: false,
      execution_tree: {
        subjectKind: 'agent', createdAt,
        host: { address: MANAGER_ADDRESS, agentRunId: MANAGER_RUN_ID, agentDefinitionId: MANAGER_DEFINITION_ID },
        collaborators, taskExecutions,
      },
      // The Manager's Team tab: messages with its children, kept after their Task is DONE.
      communication_messages: { schemaVersion: 1, subjectKind: 'agent', hostRunId: MANAGER_RUN_ID, messages: [
        { messageId: 'ptm-msg-1', senderAgentRunId: MANAGER_RUN_ID, receiverAgentRunId: 'run-ptm-notes-1-writer', content: 'Task "Draft release notes": summarize the v2 changes for users.', messageType: 'direct_message', referenceFiles: [], createdAt: '2026-10-05T08:05:00.000Z' },
        { messageId: 'ptm-msg-2', senderAgentRunId: 'run-ptm-notes-1-writer', receiverAgentRunId: MANAGER_RUN_ID, content: 'Release notes are drafted in docs/release-notes-v2.md and fact-checked.', messageType: 'direct_message', referenceFiles: [], createdAt: '2026-10-05T09:00:00.000Z' },
        { messageId: 'ptm-msg-3', senderAgentRunId: MANAGER_RUN_ID, receiverAgentRunId: 'run-ptm-review-1-reviewer', content: 'Task "Review docs site": check every page for broken links.', messageType: 'direct_message', referenceFiles: [], createdAt: '2026-10-05T08:06:00.000Z' },
      ] },
      agent_statuses: statuses([...collaborators.map((entry) => ({ address: entry.address, agentRunId: entry.agentRunId })), ...taskExecutions])
        .map((status) => status.agent_run_id === 'run-ptm-collab-writer' ? { ...status, status: 'idle' } : status),
      agent_input_states: [],
    },
  }
}

const childConversation = (agentRunId: string, address: string) => {
  const name = address.split('/').filter(Boolean).at(-1)!.replace(/_/g, ' ')
  if (agentRunId.includes('-notes-') && agentRunId.endsWith('-writer')) {
    return [
      { kind: 'inter_agent_message', role: 'user', content: `You received a message from sender name: project task manager, sender address: ${MANAGER_ADDRESS}, sender id: ${MANAGER_RUN_ID}\nmessage:\nTask "Draft release notes": summarize the v2 changes for users.`, senderAgentRunId: MANAGER_RUN_ID, senderAddress: MANAGER_ADDRESS, ts: '2026-10-05T08:05:00.000Z' },
      { kind: 'message', role: 'assistant', content: 'Drafting the release notes now. I asked the fact checker to verify the version numbers and dates.', ts: '2026-10-05T08:20:00.000Z' },
      { kind: 'message', role: 'assistant', content: 'Release notes are drafted in docs/release-notes-v2.md and fact-checked. Reporting back to the project task manager.', ts: '2026-10-05T09:00:00.000Z' },
    ]
  }
  return storedConversation(`Work on your part of the v2 docs release (${name}).`, 'Working on it.')
}

export const managerConversation = () => {
  const entries: any[] = [
    { kind: 'message', role: 'user', content: 'Plan the v2 docs release and get it done.', ts: '2026-10-05T08:00:00.000Z' },
    { kind: 'message', role: 'assistant', content: 'I created two Tasks in the project and delegated them:\n\n- **Draft release notes** → Release Notes Writer\n- **Review docs site** → Docs Review Team\n\nI also asked the researcher to collect the changelog links.', ts: '2026-10-05T08:06:00.000Z' },
  ]
  if (taskStatus('task-notes') === 'done' || roundCount('task-notes') > 1) {
    entries.push({ kind: 'message', role: 'assistant', content: 'Release notes are written and checked. I marked **Draft release notes** as DONE.', ts: '2026-10-05T09:01:00.000Z' })
  }
  if (taskStatus('task-review') === 'done') {
    entries.push({ kind: 'message', role: 'assistant', content: 'The docs site review is finished. I marked **Review docs site** as DONE.', ts: '2026-10-05T09:10:00.000Z' })
  }
  return entries
}

const managerDefinition = (template: any) => ({
  ...template, id: MANAGER_DEFINITION_ID, name: 'Project Task Manager',
  description: 'Plans project Tasks, delegates them, and marks them done.', avatarUrl: null,
})

/** Adds the Project Task Manager run to the populated fixture reads. */
export const withTaskManagerRun = (name: string, variables: Record<string, any>, data: any, scenario: string): any => {
  if (scenario !== 'populated' || !data) return data
  switch (name) {
    case 'ListWorkspaceRunHistory': {
      const list = data.listWorkspaceRunHistory
      const entry = list?.find((item: any) => item.workspaceRootPath === workspace.workspaceRootPath)
      if (entry && !entry.agentDefinitions.some((item: any) => item.agentDefinitionId === MANAGER_DEFINITION_ID)) {
        entry.agentDefinitions = [...entry.agentDefinitions, { agentDefinitionId: MANAGER_DEFINITION_ID, agentName: 'Project Task Manager', runs: [managerRun()] }]
      }
      return data
    }
    case 'GetWorkspaceRunHistory': {
      const entry = data.workspaceRunHistory
      if (entry && entry.workspaceRootPath === workspace.workspaceRootPath && entry.agentDefinitions?.length) {
        entry.agentDefinitions = [...entry.agentDefinitions, { agentDefinitionId: MANAGER_DEFINITION_ID, agentName: 'Project Task Manager', runs: [managerRun()] }]
      }
      return data
    }
    case 'GetAgentDefinitions':
      if (Array.isArray(data.agentDefinitions) && !data.agentDefinitions.some((item: any) => item.id === MANAGER_DEFINITION_ID)) {
        data.agentDefinitions = [...data.agentDefinitions, managerDefinition(data.agentDefinitions[0] ?? agent)]
      }
      return data
    case 'GetAgentRunCollaboration':
      return variables.runId === MANAGER_RUN_ID ? { agentRunCollaboration: collaboration() } : data
    case 'GetAgentRunCollaborationMemberProjection':
      return variables.hostRunId === MANAGER_RUN_ID
        ? { agentRunCollaborationMemberProjection: { agentRunId: variables.agentRunId, memberAddress: variables.memberAddress, summary: null, lastActivityAt: createdAt, conversation: childConversation(variables.agentRunId, variables.memberAddress), activities: [], hasEarlierActiveTraceEvents: false } }
        : data
    case 'GetAgentRunCollaborationMemberEventMonitorActiveTracePage':
      return variables.hostRunId === MANAGER_RUN_ID ? { agentRunCollaborationMemberEventMonitorActiveTracePage: null } : data
    case 'GetRunProjection':
      return variables.runId === MANAGER_RUN_ID
        ? { getRunProjection: { runId: MANAGER_RUN_ID, summary: managerRun().summary, lastActivityAt: createdAt, conversation: managerConversation(), activities: [], hasEarlierActiveTraceEvents: false } }
        : data
    case 'GetAgentRunResumeConfig':
      return variables.runId === MANAGER_RUN_ID
        ? { getAgentRunResumeConfig: { ...data.getAgentRunResumeConfig, runId: MANAGER_RUN_ID, isActive: false, metadataConfig: { ...data.getAgentRunResumeConfig.metadataConfig, agentDefinitionId: MANAGER_DEFINITION_ID } } }
        : data
    default:
      return data
  }
}
