/**
 * task-run-resources-workspace-cleanup (design): a Project Task Manager run in prototype-workspace.
 * Its Task runs appear under it in the Workspaces tree; the Task closure facts (DONE) decide which
 * of them are still listed.
 *
 * Hand-written and illustrative. Nothing runs. The user talks to the Manager in its own chat; the
 * Manager's scripted turn (managerTurn) is what its `update_project_task` / `delegate_task` calls
 * would do. The same two Tasks are in the Prototype Launch project, so the Projects page shows
 * their status. The records are never removed: DONE only closes the Task's runs, and the tree
 * leaves closed runs out. State survives a page reload (localStorage), like the real closure
 * record survives reload and restart.
 */
import { reactive } from 'vue'
import { exposedFixtures, storedConversation } from '~/prototype/source-observation/fixtures.mjs'

const { agent, run: baseRun, workspace, model, project } = exposedFixtures as Record<string, any>

export const MANAGER_RUN_ID = 'run-ptm-0001'
export const MANAGER_DEFINITION_ID = 'project-task-manager'
const MANAGER_ADDRESS = '/project_task_manager'
const STORAGE_KEY = 'autobyteus.design.taskRunCleanup.state.v2'
const createdAt = '2026-10-05T08:00:00.000Z'
const seconds = (iso: string) => Date.parse(iso) / 1000

const launch = { runtimeKind: 'autobyteus', llmModelIdentifier: model.modelIdentifier, llmConfig: null, autoExecuteTools: true, workspaceRootPath: workspace.workspaceRootPath }
const agentSource = (agentDefinitionId: string) => ({ kind: 'agent' as const, agentDefinitionId, launchConfiguration: launch })

export type TaskId = 'task-release-notes' | 'task-docs-review'
type TaskStatus = 'IN_PROGRESS' | 'DONE'
/** One delegation of a Task: the runs it started, closed together when the Task is DONE. */
type Round = { closed: boolean }
type TaskState = { status: TaskStatus; rounds: Round[] }
type Entry = Record<string, unknown>
type State = { tasks: Record<TaskId, TaskState>; transcript: Entry[]; seq: number }

const TASKS: ReadonlyArray<{ id: TaskId; title: string; assignee: string; words: RegExp }> = [
  { id: 'task-release-notes', title: 'Draft release notes', assignee: 'Release Notes Writer', words: /release|notes|writer/i },
  { id: 'task-docs-review', title: 'Review docs site', assignee: 'Docs Review Team', words: /review|site|docs review|team/i },
]
const taskOf = (id: TaskId) => TASKS.find((task) => task.id === id)!

const opening = (): Entry[] => [
  { kind: 'message', role: 'user', content: 'Plan the v2 docs release and get it done.', ts: seconds('2026-10-05T08:00:00.000Z') },
  { kind: 'message', role: 'assistant', content: 'I will split this into two Tasks in the Prototype Launch project and delegate them.', ts: seconds('2026-10-05T08:01:00.000Z') },
  { kind: 'tool_call', invocationId: 'ptm-call-1', toolName: 'delegate_task', toolArgs: { task_id: 'task-release-notes', recipient_address: '/release_notes_writer' }, toolResult: { status: 'started' }, ts: seconds('2026-10-05T08:02:00.000Z') },
  { kind: 'tool_call', invocationId: 'ptm-call-2', toolName: 'delegate_task', toolArgs: { task_id: 'task-docs-review', recipient_address: '/docs_review_team' }, toolResult: { status: 'started' }, ts: seconds('2026-10-05T08:02:10.000Z') },
  { kind: 'tool_call', invocationId: 'ptm-call-3', toolName: 'delegate_task', toolArgs: { description: 'Collect the changelog links for v2.', recipient_address: '/researcher' }, toolResult: { status: 'started' }, ts: seconds('2026-10-05T08:02:20.000Z') },
  { kind: 'message', role: 'assistant', content: 'Delegated:\n\n- **Draft release notes** → Release Notes Writer\n- **Review docs site** → Docs Review Team\n\nThe researcher is collecting the changelog links. Tell me when a Task is finished and I will close it.', ts: seconds('2026-10-05T08:03:00.000Z') },
]

const initialState = (): State => ({
  tasks: { 'task-release-notes': { status: 'IN_PROGRESS', rounds: [{ closed: false }] }, 'task-docs-review': { status: 'IN_PROGRESS', rounds: [{ closed: false }] } },
  transcript: opening(),
  seq: 3,
})
const load = (): State => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved?.tasks?.['task-release-notes'] && saved?.tasks?.['task-docs-review'] && Array.isArray(saved.transcript)) return saved
  } catch { /* ignore */ }
  return initialState()
}

/** Reactive: the tree and the conversation follow it live. */
export const closure = reactive<State & { revision: number }>({ ...load(), revision: 0 })
const persist = () => localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks: closure.tasks, transcript: closure.transcript, seq: closure.seq }))
const changed = () => { closure.revision += 1; persist() }

/** Restores the start of the example (browser console: `__resetTaskRunCleanup()`). */
export const resetTaskRunCleanup = () => { localStorage.removeItem(STORAGE_KEY); location.reload() }
;(window as any).__resetTaskRunCleanup = resetTaskRunCleanup

// --- Task runs, by delegation round ------------------------------------------------------

/** "Draft release notes": the assigned writer, plus a fact checker the writer delegated to (first round). */
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

/** "Review docs site": a Team with two members. */
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

const roundNodes = (taskId: TaskId, round: number) => taskId === 'task-release-notes' ? notesRound(round) : reviewRound(round)

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
    closure.tasks[task.id].rounds.forEach((_round, index) => {
      nodes.push(...roundNodes(task.id, index + 1))
      if (task.id === 'task-release-notes' && index === 0) nodes.push(descriptionOnly)
    })
  }
  return nodes
}

/** The ids of runs whose Task is DONE (the Task-side closure facts). */
const closedIds = (): Set<string> => {
  const ids = new Set<string>()
  for (const task of TASKS) {
    closure.tasks[task.id].rounds.forEach((round, index) => {
      if (round.closed) roundNodes(task.id, index + 1).flatMap(idsOf).forEach((id) => ids.add(id))
    })
  }
  return ids
}

/** Read by the Workspaces tree; reactive. */
export const isClosedTaskRun = (hostRunId: string, runId: string): boolean => {
  void closure.revision
  return hostRunId === MANAGER_RUN_ID && closedIds().has(runId)
}

// --- The Manager's turn (what its tools would do) ------------------------------------------

export type ManagerTurn = { reply: Entry[]; closedRunIds: string[]; reopened: boolean; closeLater: TaskId | null }

const call = (toolName: string, toolArgs: Record<string, unknown>, toolResult: unknown): Entry =>
  ({ kind: 'tool_call', invocationId: `ptm-call-${++closure.seq}`, toolName, toolArgs, toolResult, ts: Date.now() / 1000 })
const say = (content: string): Entry => ({ kind: 'message', role: 'assistant', content, ts: Date.now() / 1000 })

/**
 * The user's message to the Manager and the Manager's scripted answer. "The release notes are
 * good, close that task" → DONE; "delegate the docs review again" → reopen and delegate again.
 */
export const recordUserMessage = (text: string) => {
  closure.transcript.push({ kind: 'message', role: 'user', content: text, ts: Date.now() / 1000 })
  persist()
}

export const managerTurn = (text: string): ManagerTurn => {
  const named = TASKS.filter((task) => task.words.test(text))
  const again = /again|reopen|redo|re-?delegate|restart/i.test(text)
  const open = TASKS.filter((task) => closure.tasks[task.id].status === 'IN_PROGRESS')
  const done = TASKS.filter((task) => closure.tasks[task.id].status === 'DONE')
  const reply: Entry[] = []
  let closedRunIds: string[] = []
  let reopened = false

  // "Close it when the team reports back": the Manager waits, then closes the Task on its own.
  const later = /\b(when|once|after)\b/i.test(text)
  if (later && !again) {
    const target = (named.length ? named : open.length === 1 ? open : []).find((task) => closure.tasks[task.id].status === 'IN_PROGRESS')
    if (target) {
      const reply = [say(`OK. I will close **${target.title}** as soon as the ${target.assignee} reports back.`)]
      closure.transcript.push(...reply)
      changed()
      return { reply, closedRunIds: [], reopened: false, closeLater: target.id }
    }
  }

  if (again) {
    const target = (named.length ? named : done).find((task) => closure.tasks[task.id].status === 'DONE')
    if (!target) {
      reply.push(say(named.length ? `**${named[0]!.title}** is still in progress, so there is nothing to start again.` : 'Both Tasks are still in progress.'))
    } else {
      const state = closure.tasks[target.id]
      state.status = 'IN_PROGRESS'
      state.rounds.push({ closed: false })
      reopened = true
      reply.push(call('update_project_task', { task_id: target.id, status: 'IN_PROGRESS' }, { status: 'IN_PROGRESS' }))
      reply.push(call('delegate_task', { task_id: target.id, recipient_address: target.id === 'task-release-notes' ? '/release_notes_writer' : '/docs_review_team' }, { status: 'started' }))
      reply.push(say(`I reopened **${target.title}** and delegated it again to the ${target.assignee}.`))
    }
  } else {
    const target = (named.length ? named : open.length === 1 ? open : []).find((task) => closure.tasks[task.id].status === 'IN_PROGRESS')
    if (!target) {
      reply.push(say(open.length
        ? `Which Task is finished — ${open.map((task) => `**${task.title}**`).join(' or ')}?`
        : 'Both Tasks are already done.'))
    } else {
      const state = closure.tasks[target.id]
      const round = state.rounds.length
      state.status = 'DONE'
      state.rounds[round - 1]!.closed = true
      closedRunIds = roundNodes(target.id, round).flatMap(idsOf)
      reply.push(call('update_project_task', { task_id: target.id, status: 'DONE' }, { status: 'DONE' }))
      reply.push(say(`**${target.title}** is done. I marked the Task DONE, and its runs are stopped.`))
    }
  }
  closure.transcript.push(...reply)
  changed()
  return { reply, closedRunIds, reopened, closeLater: null }
}

/** The worker reports back and the Manager closes the Task on its own (a scripted timeline). */
export const managerClosesOnReport = (taskId: TaskId): ManagerTurn => {
  const task = taskOf(taskId)
  const state = closure.tasks[taskId]
  if (state.status === 'DONE') return { reply: [], closedRunIds: [], reopened: false, closeLater: null }
  const round = state.rounds.length
  state.status = 'DONE'
  state.rounds[round - 1]!.closed = true
  const reply = [
    say(`The ${task.assignee} reported back: **${task.title}** is finished.`),
    call('update_project_task', { task_id: taskId, status: 'DONE' }, { status: 'DONE' }),
    say(`I marked **${task.title}** DONE, and its runs are stopped.`),
  ]
  closure.transcript.push(...reply)
  changed()
  return { reply, closedRunIds: roundNodes(taskId, round).flatMap(idsOf), reopened: false, closeLater: null }
}

// --- GraphQL reads ---------------------------------------------------------------------

const managerRun = () => ({
  ...baseRun,
  runId: MANAGER_RUN_ID, agentRunId: MANAGER_RUN_ID,
  agentDefinitionId: MANAGER_DEFINITION_ID, agentName: 'Project Task Manager',
  summary: 'Plan the v2 docs release and get it done.',
  createdAt, lastUpdatedAt: '2026-10-05T08:03:00.000Z',
  // The Manager is live while it manages its Tasks; its streams are answered by the prototype socket.
  status: 'IDLE', isActive: true, shouldConnectStream: true, statusSource: 'live',
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

/** The Manager's collaboration root view; `active` for its live stream snapshot. */
export const managerCollaborationView = (active = false) => {
  const taskExecutions = allTaskExecutions()
  const collaborators = [
    { kind: 'agent', address: '/documentation_writer', agentDefinitionId: 'agent-writer', agentRunId: 'run-ptm-collab-writer', platformAgentRunId: null, launchConfiguration: launch, addedAt: createdAt, addedViaAgentRunId: MANAGER_RUN_ID },
  ]
  return {
    root_subject_kind: 'agent', root_run_id: MANAGER_RUN_ID,
    root_agent: {
      base_change_sequence: 1, is_active: active,
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
      { kind: 'inter_agent_message', role: 'user', content: `You received a message from sender name: project task manager, sender address: ${MANAGER_ADDRESS}, sender id: ${MANAGER_RUN_ID}\nmessage:\nTask "Draft release notes": summarize the v2 changes for users.`, senderAgentRunId: MANAGER_RUN_ID, senderAddress: MANAGER_ADDRESS, ts: seconds('2026-10-05T08:05:00.000Z') },
      { kind: 'message', role: 'assistant', content: 'Drafting the release notes now. I asked the fact checker to verify the version numbers and dates.', ts: seconds('2026-10-05T08:20:00.000Z') },
      { kind: 'message', role: 'assistant', content: 'Release notes are drafted in docs/release-notes-v2.md and fact-checked. Reporting back to the project task manager.', ts: seconds('2026-10-05T09:00:00.000Z') },
    ]
  }
  return storedConversation(`Work on your part of the v2 docs release (${name}).`, 'Working on it.')
}

/** The Manager's conversation so far (opening, then every turn). */
export const managerConversation = (): Entry[] => JSON.parse(JSON.stringify(closure.transcript))

const managerDefinition = (template: any) => ({
  ...template, id: MANAGER_DEFINITION_ID, name: 'Project Task Manager',
  description: 'Plans project Tasks, delegates them, and marks them done.', avatarUrl: null,
})

/** The Manager's two Tasks in the Prototype Launch project, with their current status. */
const projectTask = (task: (typeof TASKS)[number]) => ({
  __typename: 'ProjectTask', taskId: task.id, projectId: project.projectId, description: task.title,
  status: closure.tasks[task.id].status, createdAt, updatedAt: createdAt, contextFiles: [],
})

/** Keeps the project's copy of the two Tasks in step with the Manager's updates. */
export const syncProjectTasks = (projectState: { tasks: any[] } | null | undefined) => {
  if (!projectState) return
  for (const task of TASKS) {
    const existing = projectState.tasks.find((item: any) => item.taskId === task.id)
    if (existing) existing.status = closure.tasks[task.id].status
    else projectState.tasks.push(projectTask(task))
  }
}

/** Adds the Project Task Manager run to the populated fixture reads. */
export const withTaskManagerRun = (name: string, variables: Record<string, any>, data: any, scenario: string): any => {
  if (scenario !== 'populated' || !data) return data
  switch (name) {
    case 'ListWorkspaceRunHistory': {
      const entry = data.listWorkspaceRunHistory?.find((item: any) => item.workspaceRootPath === workspace.workspaceRootPath)
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
      return variables.runId === MANAGER_RUN_ID ? { agentRunCollaboration: managerCollaborationView() } : data
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
        ? { getAgentRunResumeConfig: { ...data.getAgentRunResumeConfig, runId: MANAGER_RUN_ID, isActive: true, metadataConfig: { ...data.getAgentRunResumeConfig.metadataConfig, agentDefinitionId: MANAGER_DEFINITION_ID } } }
        : data
    default:
      return data
  }
}
