import { createTokenUsageSummary } from '../shared/token-usage-fixture.js'
import {
  createTokenUsageAnalyticsResult,
  createTokenUsageRunStatistics,
} from '../shared/token-statistics-refresh-fixture.js'

const fixedNow = '2026-08-22T04:00:00.000Z'

export const scenarioCatalog = Object.freeze({
  populated: 'Synthetic catalog, histories, settings, applications, memory, media, and messaging data.',
  empty: 'Valid connected node with empty catalogs and histories.',
  error: 'GraphQL operations return a deterministic recoverable error.',
  permission_denied: 'Protected API calls are rejected with a deterministic permission response.',
  loading: 'Successful responses are delayed by 1.5 seconds so loading surfaces remain observable.',
  team_launch: 'Populated catalogs with an empty history and a deterministic newly launched Team execution.',
  apps_disabled: 'Connected populated data with Applications capability disabled.',
  projects_disabled: 'Connected populated data with the Projects capability at its initialized-disabled default.',
  bootstrap_error: 'Node health returns 503 and the Electron bridge can report startup failure.',
  token_empty: 'Token Statistics has full coverage but no tracked usage for the selected range.',
  token_partial: 'Token Statistics has tracked usage with partial history coverage and partial pricing.',
  token_unavailable: 'Token Statistics range predates analytics tracking and cannot be reconstructed.',
  token_mixed_currency: 'Token Statistics contains exact rows in currencies that cannot be combined.',
  token_local: 'Token Statistics contains only local usage with no API bill.',
  agy_runtime: 'Populated data where the Antigravity runtime is also available (its auto-approve control is locked on).',
  skill_source_issues: 'Populated data where one GitHub skill source failed to update and another has an incomplete removal.',
  skill_name_issues: 'Populated data where the skill catalog reports one duplicate-name conflict and one ignored runtime default copy (D-19 banner).',
})

export const baseState = () => ({
  scenario: 'populated',
  requestDelayMs: 0,
  applicationsEnabled: true,
  managedGatewayEnabled: true,
  projectsEnabled: true,
  operationFailures: {},
})

const agent = {
  __typename: 'AgentDefinition',
  id: 'agent-researcher',
  name: 'Research Assistant',
  role: 'Researches a bounded topic and summarizes evidence.',
  description: 'Synthetic local agent used only by the parity prototype.',
  instructions: 'Use the supplied synthetic workspace and return concise evidence.',
  category: 'General',
  avatarUrl: null,
  toolNames: ['web_search', 'read_file'],
  inputProcessorNames: [],
  llmResponseProcessorNames: [],
  toolExecutionResultProcessorNames: [],
  toolInvocationPreprocessorNames: [],
  lifecycleProcessorNames: [],
  skillNames: ['prototype-research'],
  skillScope: 'CONFIGURED',
  ownershipScope: 'SHARED',
  ownerTeamId: null,
  ownerTeamName: null,
  ownerApplicationId: null,
  ownerApplicationName: null,
  ownerPackageId: 'package-prototype',
  ownerLocalApplicationId: null,
  defaultLaunchConfig: {
    llmModelIdentifier: 'mock/gpt-prototype',
    runtimeKind: 'autobyteus',
    llmConfig: { temperature: 0.2 },
  },
}

const secondAgent = {
  ...agent,
  id: 'agent-writer',
  name: 'Documentation Writer',
  role: 'Turns reviewed evidence into product documentation.',
  description: 'A second deterministic synthetic agent.',
  toolNames: ['read_file', 'write_file'],
  skillNames: ['prototype-writing'],
}

// WEB-BASELINE-REFRESH-002: the built-in agent that backs a New chat at
// 57df63f (DEFAULT_CHAT_AGENT_DEFINITION_ID). Synthetic copy of its public
// identity so the Chat send journey is observable.
const dailyAssistant = {
  ...agent,
  id: 'autobyteus-daily-assistant',
  name: 'Daily Assistant',
  role: 'Daily Assistant',
  description: 'General-purpose assistant for everyday tasks, with access to all installed skills.',
  instructions: 'You are Daily Assistant, a general-purpose assistant.',
  toolNames: ['run_bash', 'read_url', 'search_web'],
  skillNames: [],
  skillScope: 'ALL_INSTALLED',
  ownerPackageId: null,
  defaultLaunchConfig: null,
}

const team = {
  __typename: 'AgentTeamDefinition',
  id: 'team-product',
  name: 'Product Review Team',
  description: 'A deterministic synthetic team with researcher and writer members.',
  instructions: 'Coordinate a safe product-review task using synthetic data.',
  category: 'Product',
  avatarUrl: null,
  coordinatorMemberName: 'researcher',
  revision: 'team-product-r1',
  handoffs: [],
  ownershipScope: 'SHARED',
  ownerOrgId: null,
  ownerOrgName: null,
  ownerTeamId: null,
  ownerTeamName: null,
  ownerApplicationId: null,
  ownerApplicationName: null,
  ownerPackageId: 'package-prototype',
  ownerLocalApplicationId: null,
  defaultLaunchConfig: {
    llmModelIdentifier: 'mock/gpt-prototype',
    runtimeKind: 'autobyteus',
    llmConfig: { temperature: 0.2 },
  },
  nodes: [
    { __typename: 'TeamMember', memberName: 'researcher', ref: 'agent-researcher', refScope: 'SHARED' },
    { __typename: 'TeamMember', memberName: 'writer', ref: 'agent-writer', refScope: 'SHARED' },
  ],
}

const workspace = {
  __typename: 'Workspace',
  workspaceId: 'workspace-prototype',
  name: 'prototype-workspace',
  // As on a real node, the display name is the folder name.
  displayName: 'prototype-workspace',
  config: {},
  workspaceRootPath: '/synthetic/prototype-workspace',
  absolutePath: '/synthetic/prototype-workspace',
  // WEB-BASELINE-REFRESH-004: the server's kinds are filesystem | skill | temp.
  kind: 'filesystem',
  isTemp: false,
}

// WEB-BASELINE-REFRESH-002: every node has the built-in temp workspace; the
// New chat at 57df63f uses it by default.
const tempWorkspace = {
  __typename: 'Workspace',
  workspaceId: 'temp_ws_default',
  name: 'temp_workspace',
  displayName: 'Temp Workspace',
  config: {},
  workspaceRootPath: '/synthetic/temp_workspace',
  absolutePath: '/synthetic/temp_workspace',
  kind: 'temp',
  isTemp: true,
}

const application = {
  __typename: 'Application',
  id: 'sample-app',
  localApplicationId: 'sample-app',
  packageId: 'prototype-app-package',
  name: 'Brief Studio',
  description: 'A synthetic embedded application for current-shell parity validation.',
  iconAssetPath: 'icons/prototype-app.svg',
  entryHtmlAssetPath: 'ui/index.html',
  writable: true,
  executionResourceSlots: [
    { slotKey: 'draftingAgent', required: true },
    { slotKey: 'reviewTeam', required: false },
  ],
  bundleResources: [
    { kind: 'agentDefinition', localId: 'drafting-agent', definitionId: 'agent-writer' },
    { kind: 'agentTeamDefinition', localId: 'review-team', definitionId: 'team-product' },
  ],
}

const run = {
  runId: 'run-research-001',
  agentRunId: 'run-research-001',
  agentDefinitionId: agent.id,
  agentName: agent.name,
  summary: 'Compare current navigation states',
  createdAt: fixedNow,
  lastUpdatedAt: fixedNow,
  archivedAt: null,
  terminatedAt: null,
  status: 'IDLE',
  isActive: false,
  shouldConnectStream: false,
  statusSource: 'stored',
  workspaceRootPath: workspace.workspaceRootPath,
  // 0a32261: this stored run brought a task Agent and a task Team in with `@`.
  hasCollaboration: true,
}

// WEB-BASELINE-REFRESH-004 (0a32261): the stored Agent-root collaboration view of
// `run`: one task Agent and one task Team (two members) added with `@`.
const agentRootLaunch = { runtimeKind: 'autobyteus', llmModelIdentifier: 'mock/gpt-prototype', llmConfig: { temperature: 0.2 }, autoExecuteTools: false, workspaceRootPath: '/synthetic/prototype-workspace' }
const agentRootCollaboration = {
  root_subject_kind: 'agent', root_run_id: run.runId,
  root_agent: {
    base_change_sequence: 1, is_active: false,
    execution_tree: {
      subjectKind: 'agent', createdAt: fixedNow,
      host: { address: '/research_assistant', agentRunId: run.runId, agentDefinitionId: agent.id },
      collaborators: [
        { kind: 'agent', address: '/documentation_writer', agentDefinitionId: 'agent-writer', agentRunId: 'collab-writer-001', platformAgentRunId: null, launchConfiguration: agentRootLaunch, addedAt: fixedNow, addedViaAgentRunId: run.runId },
        { kind: 'agent_team', address: '/product_review_team', teamDefinitionId: 'team-product', teamRunId: 'collab-team-001', coordinatorAddress: '/product_review_team/researcher',
          members: [
            { address: '/product_review_team/researcher', agentDefinitionId: 'agent-researcher', agentRunId: 'collab-team-researcher-001', platformAgentRunId: null },
            { address: '/product_review_team/writer', agentDefinitionId: 'agent-writer', agentRunId: 'collab-team-writer-001', platformAgentRunId: null },
          ],
          handoffs: [], defaultLaunchConfiguration: agentRootLaunch, taskExecutions: [], addedAt: fixedNow, addedViaAgentRunId: run.runId },
      ],
      taskExecutions: [],
    },
    communication_messages: { schemaVersion: 1, subjectKind: 'agent', hostRunId: run.runId, messages: [
      { messageId: 'collab-message-001', senderAgentRunId: 'collab-writer-001', receiverAgentRunId: run.runId, content: 'The navigation notes are drafted.', messageType: 'direct_message', referenceFiles: [], createdAt: fixedNow },
    ] },
    agent_statuses: [],
    agent_input_states: [],
  },
}
const agentRootMemberProjection = (variables) => ({
  agentRunId: variables.agentRunId, memberAddress: variables.memberAddress, summary: run.summary, lastActivityAt: fixedNow,
  conversation: [
    { kind: 'inter_agent_message', role: 'user', content: `You received a message from sender name: research assistant, sender address: /research_assistant, sender id: ${run.runId}\nmessage:\nPlease draft the navigation notes.`, senderAgentRunId: run.runId, senderAddress: '/research_assistant', ts: '2026-08-22T04:01:30.000Z' },
    // Long enough to scroll, so scrolling up past the top loads the earlier events (browse mode).
    { kind: 'message', role: 'assistant', content: `The navigation notes are drafted.\n\n${Array.from({ length: 24 }, (_, index) => `- Navigation state ${index + 1}: matched in the synthetic review.`).join('\n')}`, ts: '2026-08-22T04:02:30.000Z' },
  ],
  // 4dee901: a collaborator's earlier events are read from the host's package.
  activities: [], hasEarlierActiveTraceEvents: true,
})
// WEB-BASELINE-REFRESH-006 (4dee901): the earlier events of a task Agent, with one
// agent-to-agent delivery ("From <Sender>:" in browse mode) and the reply to it.
const agentRootMemberEarlierPage = (variables) => {
  const id = variables.agentRunId
  const delivery = (eventId, body, ms) => ({ eventId, turnGroupId: `${eventId}-turn`, occurredAtMs: Date.parse(ms), visuals: [
    { __typename: 'EventMonitorInterAgentVisual', kind: 'inter_agent', visualId: `${eventId}:inter-agent:0`, eventId, kindOrdinal: 0, senderAgentRunId: run.runId, senderAddress: null, attachments: [],
      text: `You received a message from sender name: research assistant, sender address: /research_assistant, sender id: ${run.runId}\nmessage:\n${body}` },
  ] })
  const reply = (eventId, turnGroupId, content, ms) => ({ eventId, turnGroupId, occurredAtMs: Date.parse(ms), visuals: [
    { __typename: 'EventMonitorAssistantTextVisual', kind: 'assistant_text', visualId: `${eventId}:assistant-text:0`, eventId, kindOrdinal: 0, content },
  ] })
  // The first page holds the two earlier events followed by the current window.
  return {
    beforeCursor: null, hasEarlier: false, loadedEarlierCount: 2, activeGeneration: '1', cursorStatus: 'VALID',
    events: [
      delivery(`${id}-earlier-1`, 'List the navigation states to compare.', '2026-08-22T03:58:00.000Z'),
      reply(`${id}-earlier-2`, `${id}-earlier-1-turn`, 'The four navigation states are listed in the synthetic notes.', '2026-08-22T03:59:00.000Z'),
      delivery(`${id}-current-1`, 'Please draft the navigation notes.', '2026-08-22T04:01:30.000Z'),
      reply(`${id}-current-2`, `${id}-current-1-turn`, 'The navigation notes are drafted.', '2026-08-22T04:02:30.000Z'),
    ],
  }
}

const launchConfiguration = (workspaceRootPath = '/synthetic/prototype-workspace') => ({
  runtime_kind: 'autobyteus', llm_model_identifier: 'mock/gpt-prototype', llm_config: { temperature: 0.2 },
  auto_execute_tools: false, workspace_root_path: workspaceRootPath,
})

const teamRootExecution = (teamRunId, memberRunIds) => ({
  address: '/',
  team_definition_id: 'team-product',
  team_definition_name: 'Product Review Team',
  team_run_id: teamRunId,
  coordinator_address: '/researcher',
  default_launch_configuration: launchConfiguration(),
  members: [
    { kind: 'configured_agent', address: '/researcher', agent_definition_id: 'agent-researcher', role: null, description: null, agent_run_id: memberRunIds[0], platform_agent_run_id: null, launch_configuration: launchConfiguration() },
    { kind: 'configured_agent', address: '/writer', agent_definition_id: 'agent-writer', role: null, description: null, agent_run_id: memberRunIds[1], platform_agent_run_id: null, launch_configuration: launchConfiguration() },
  ],
  collaborators: [],
  task_executions: [],
})

const teamRun = {
  teamRunId: 'team-run-001',
  teamDefinitionId: team.id,
  teamDefinitionName: team.name,
  summary: 'Review the current prototype baseline',
  createdAt: fixedNow,
  lastUpdatedAt: fixedNow,
  archivedAt: null,
  terminatedAt: null,
  status: 'IDLE',
  isActive: false,
  shouldConnectStream: false,
  coordinatorAddress: '/researcher',
  rootTeam: teamRootExecution('team-run-001', ['team-member-researcher-001', 'team-member-writer-001']),
  workspaceRootPath: workspace.workspaceRootPath,
  members: [
    { memberName: 'researcher', displayName: 'Research Assistant', memberAddress: '/researcher', agentRunId: 'team-member-researcher-001', agentDefinitionId: agent.id, agentName: agent.name, status: 'IDLE', runtimeKind: 'autobyteus', workspaceRootPath: '/synthetic/prototype-workspace' },
    { memberName: 'writer', displayName: 'Documentation Writer', memberAddress: '/writer', agentRunId: 'team-member-writer-001', agentDefinitionId: secondAgent.id, agentName: secondAgent.name, status: 'IDLE', runtimeKind: 'autobyteus', workspaceRootPath: '/synthetic/prototype-workspace' },
  ],
}

const createdTeamRunId = 'team-run-created-fixture'
const storedTeamExecutionTree = {
  created_at: fixedNow,
  archived_at: null,
  application_binding: null,
  handoffs: [],
  root_team: teamRootExecution('team-run-001', ['team-member-researcher-001', 'team-member-writer-001']),
}

const createdTeamExecutionTree = {
  created_at: fixedNow,
  archived_at: null,
  application_binding: null,
  handoffs: [],
  root_team: teamRootExecution(createdTeamRunId, ['team-member-researcher-created', 'team-member-writer-created']),
}

const org = {
  __typename: 'AgentOrgDefinition',
  id: 'org-product-launch',
  name: 'Product Launch Org',
  description: 'A deterministic synthetic organization with one direct agent and one reusable team.',
  instructions: 'Coordinate a safe synthetic product launch review.',
  category: 'Product',
  avatarUrl: null,
  revision: 'org-product-launch-r1',
  handoffs: [{ __typename: 'AgentOrgHandoff', from: '/analyst', to: '/review-team', rules: ['Hand off reviewed findings for documentation.'] }],
  members: [
    { __typename: 'AgentOrgMember', memberName: 'analyst', ref: 'agent-researcher', refType: 'AGENT', refScope: 'SHARED' },
    { __typename: 'AgentOrgMember', memberName: 'review-team', ref: 'team-product', refType: 'AGENT_TEAM', refScope: 'SHARED' },
  ],
  defaultLaunchConfig: { __typename: 'DefaultLaunchConfig', llmModelIdentifier: 'mock/gpt-prototype', runtimeKind: 'autobyteus', llmConfig: { temperature: 0.2 } },
}

const orgLaunchConfiguration = {
  runtimeKind: 'autobyteus', llmModelIdentifier: 'mock/gpt-prototype', llmConfig: { temperature: 0.2 },
  autoExecuteTools: false, workspaceRootPath: '/synthetic/prototype-workspace',
}

const orgRunId = 'org-run-001'
const orgExecutionTree = {
  subjectKind: 'agent_org',
  createdAt: fixedNow,
  archivedAt: null,
  applicationBinding: null,
  handoffs: [{ from: '/analyst', to: '/review-team', rules: ['Hand off reviewed findings for documentation.'] }],
  rootOrg: {
    address: '/',
    orgDefinitionId: org.id,
    orgDefinitionName: org.name,
    orgRunId,
    defaultLaunchConfiguration: orgLaunchConfiguration,
    members: [
      { address: '/analyst', agentDefinitionId: 'agent-researcher', role: null, description: null, agentRunId: 'org-member-analyst-001', platformAgentRunId: null, launchConfiguration: orgLaunchConfiguration },
      {
        address: '/review-team', teamDefinitionId: 'team-product', role: null, description: null, teamRunId: 'org-team-run-001',
        coordinatorAddress: '/review-team/researcher', defaultLaunchConfiguration: orgLaunchConfiguration,
        members: [
          { address: '/review-team/researcher', agentDefinitionId: 'agent-researcher', role: null, description: null, agentRunId: 'org-member-review-researcher-001', platformAgentRunId: null, launchConfiguration: orgLaunchConfiguration },
          { address: '/review-team/writer', agentDefinitionId: 'agent-writer', role: null, description: null, agentRunId: 'org-member-review-writer-001', platformAgentRunId: null, launchConfiguration: orgLaunchConfiguration },
        ],
        taskExecutions: [],
      },
    ],
    collaborators: [],
    taskExecutions: [],
  },
}

const orgEndpoints = [
  { __typename: 'DefinitionEndpoint', kind: 'agent', address: '/analyst', memberName: 'analyst', definitionId: 'agent-researcher', coordinatorAddress: null, coordinatorMemberName: null },
  { __typename: 'DefinitionEndpoint', kind: 'agent_team', address: '/review-team', memberName: 'review-team', definitionId: 'team-product', coordinatorAddress: '/review-team/researcher', coordinatorMemberName: 'researcher' },
]

const project = {
  __typename: 'Project',
  projectId: 'project-prototype-launch',
  name: 'Prototype Launch',
  description: 'Synthetic project linking the prototype workspace and its launch tasks.',
  createdAt: fixedNow,
  updatedAt: fixedNow,
  workspaces: [{ __typename: 'ProjectWorkspace', workspaceId: 'workspace-prototype', workspaceRootPath: '/synthetic/prototype-workspace', displayName: 'Prototype Workspace', description: 'Primary synthetic workspace for launch review.', addedAt: fixedNow, availability: 'AVAILABLE' }],
  taskCount: 3,
  openTaskCount: 2,
}

const projectTasks = [
  { __typename: 'ProjectTask', taskId: 'task-outline', projectId: project.projectId, description: 'Outline the launch checklist.', status: 'TODO', createdAt: fixedNow, updatedAt: fixedNow, contextFiles: [] },
  { __typename: 'ProjectTask', taskId: 'task-review', projectId: project.projectId, description: 'Review the synthetic navigation baseline.', status: 'IN_PROGRESS', createdAt: fixedNow, updatedAt: fixedNow, contextFiles: [] },
  { __typename: 'ProjectTask', taskId: 'task-publish', projectId: project.projectId, description: 'Publish the deterministic evidence summary.', status: 'DONE', createdAt: fixedNow, updatedAt: fixedNow, contextFiles: [] },
]

// WEB-BASELINE-REFRESH-004 (0a32261): Projects and Tasks are authored on pages.
// Saves, deletes and workspace links update this small in-memory copy, owned by
// the caller's `state` (the observation node or one browser context), so both
// sides show the same scripted outcome. Reset with the scenario.
const projectWorkspaceChoice = id => [workspace, ...createdWorkspaces].find(item => item.workspaceId === id)
const createdWorkspaces = []
export const createdWorkspaceFor = (rootPath) => {
  const root = String(rootPath || '').trim()
  const existing = [workspace, ...createdWorkspaces].find(item => item.workspaceRootPath === root)
  if (existing) return existing
  const name = root.split('/').filter(Boolean).at(-1) || root
  const created = { ...workspace, workspaceId: `workspace-created-${createdWorkspaces.length + 1}`, name, displayName: name, workspaceRootPath: root, absolutePath: root }
  createdWorkspaces.push(created)
  return created
}
export const projectData = (state) => {
  if (!state.projectData) {
    state.projectData = { projects: [structuredClone(project)], tasks: structuredClone(projectTasks), seq: 0 }
  }
  return state.projectData
}
const projectError = (message, code) => ({ __projectError: { message, extensions: { code } } })
const withCounts = (data, item) => {
  const tasks = data.tasks.filter(task => task.projectId === item.projectId)
  return { ...item, taskCount: tasks.length, openTaskCount: tasks.filter(task => task.status !== 'DONE').length }
}
const projectLinks = (links = [], previous = []) => links.map(link => {
  const kept = previous.find(item => item.workspaceId === link.workspaceId)
  const choice = projectWorkspaceChoice(link.workspaceId)
  return {
    __typename: 'ProjectWorkspace',
    workspaceId: link.workspaceId,
    workspaceRootPath: kept?.workspaceRootPath || choice?.workspaceRootPath || `/synthetic/${link.workspaceId}`,
    displayName: kept?.displayName || choice?.displayName || link.workspaceId,
    description: link.description || '',
    addedAt: kept?.addedAt || fixedNow,
    availability: 'AVAILABLE',
  }
})
const contextFilesFrom = (state, names = []) => names.map(name => state.taskContextFiles?.[name]).filter(Boolean)
export function projectMutationFixture(operationName, variables = {}, state) {
  const data = projectData(state)
  const input = variables.input || {}
  const find = id => data.projects.find(item => item.projectId === id)
  const named = name => data.projects.find(item => item.name.toLocaleLowerCase() === String(name).trim().toLocaleLowerCase() && item.projectId !== input.projectId)
  switch (operationName) {
    case 'CreateProject': {
      if (!String(input.name || '').trim()) return projectError('Project name is required.', 'PROJECT_NAME_REQUIRED')
      if (named(input.name)) return projectError('A Project with this name already exists.', 'PROJECT_NAME_TAKEN')
      const created = { __typename: 'Project', projectId: `project-created-${++data.seq}`, name: input.name.trim(), description: input.description || '', createdAt: fixedNow, updatedAt: fixedNow, workspaces: projectLinks(input.workspaces) }
      data.projects.push(created)
      return { createProject: withCounts(data, created) }
    }
    case 'UpdateProject': {
      const current = find(input.projectId)
      if (!current) return projectError('Project not found.', 'PROJECT_NOT_FOUND')
      if (named(input.name)) return projectError('A Project with this name already exists.', 'PROJECT_NAME_TAKEN')
      Object.assign(current, { name: input.name.trim(), description: input.description || '', updatedAt: fixedNow, ...(input.workspaces ? { workspaces: projectLinks(input.workspaces, current.workspaces) } : {}) })
      return { updateProject: withCounts(data, current) }
    }
    case 'DeleteProject': {
      data.projects = data.projects.filter(item => item.projectId !== variables.projectId)
      data.tasks = data.tasks.filter(task => task.projectId !== variables.projectId)
      return { deleteProject: true }
    }
    case 'AddProjectWorkspace':
    case 'UpdateProjectWorkspace':
    case 'RemoveProjectWorkspace': {
      const current = find(input.projectId)
      if (!current) return projectError('Project not found.', 'PROJECT_NOT_FOUND')
      const others = current.workspaces.filter(item => item.workspaceId !== input.workspaceId)
      const existing = current.workspaces.find(item => item.workspaceId === input.workspaceId)
      current.workspaces = operationName === 'RemoveProjectWorkspace' ? others
        : operationName === 'AddProjectWorkspace' ? [...current.workspaces, ...projectLinks([input])]
          : current.workspaces.map(item => item === existing ? { ...item, description: input.description || '' } : item)
      const field = operationName[0].toLowerCase() + operationName.slice(1)
      return { [field]: withCounts(data, current) }
    }
    case 'CreateProjectTask': {
      if (!String(input.description || '').trim()) return projectError('Task description is required.', 'TASK_DESCRIPTION_REQUIRED')
      const task = { __typename: 'ProjectTask', taskId: `task-created-${++data.seq}`, projectId: input.projectId, description: input.description.trim(), status: 'TODO', createdAt: fixedNow, updatedAt: `2026-08-22T05:${String(data.seq).padStart(2, '0')}:00.000Z`, contextFiles: contextFilesFrom(state, input.contextDraft?.storedFilenames) }
      data.tasks.push(task)
      return { createProjectTask: task }
    }
    case 'UpdateProjectTask': {
      const task = data.tasks.find(item => item.projectId === input.projectId && item.taskId === input.taskId)
      if (!task) return projectError('Task not found.', 'TASK_NOT_FOUND')
      const changes = input.contextChanges || {}
      task.description = input.description.trim()
      task.updatedAt = `2026-08-22T05:${String(++data.seq).padStart(2, '0')}:00.000Z`
      task.contextFiles = [...task.contextFiles.filter(file => !(changes.removeStoredFilenames || []).includes(file.storedFilename)), ...contextFilesFrom(state, changes.addStoredFilenames)]
      return { updateProjectTask: task }
    }
    case 'DeleteProjectTask': {
      data.tasks = data.tasks.filter(item => !(item.projectId === input.projectId && item.taskId === input.taskId))
      return { deleteProjectTask: true }
    }
    default:
      return null
  }
}

// Task context files: a draft upload returns a small synthetic file record
// (name and size from the browser file); nothing is stored.
export function taskContextUpload(state, file) {
  state.taskContextFiles ??= {}
  const index = Object.keys(state.taskContextFiles).length + 1
  const safe = String(file?.name || 'file').replace(/[^a-zA-Z0-9._-]/g, '_')
  const record = { storedFilename: `ctx_${index}__${safe}`, displayName: file?.name || 'file', mimeType: file?.type || 'application/octet-stream', sizeBytes: Number(file?.size || 0), locator: null }
  state.taskContextFiles[record.storedFilename] = record
  return record
}
// WEB-BASELINE-REFRESH-006 (4dee901): managed skill sources (default, local
// folder, public GitHub repositories). Import, check, update and remove update
// this small in-memory copy owned by the caller's `state`; reset with the scenario.
const githubSource = (sourceId, owner, slug, skillCount, status, installed, latest, lastError = null) => ({
  __typename: 'SkillSource', sourceId, sourceKind: 'GITHUB_REPOSITORY', path: `/synthetic/managed-skills/${slug}`, skillCount, isDefault: false,
  github: { repositoryUrl: `https://github.com/${owner}/${slug}`, defaultBranch: 'main', installedRevision: installed, latestRevision: latest, latestCheckedAt: latest ? fixedNow : null, status, lastError },
})
const baseSkillSources = (scenario) => [
  { __typename: 'SkillSource', sourceId: 'default', sourceKind: 'DEFAULT', path: '/synthetic/skills', skillCount: 1, isDefault: true, github: null },
  { __typename: 'SkillSource', sourceId: 'local-team-skills', sourceKind: 'LOCAL_PATH', path: '/synthetic/team-skills', skillCount: 2, isDefault: false, github: null },
  githubSource('github-docs-skills', 'synthetic-org', 'docs-skills', 3, 'UP_TO_DATE', '1f2e3d4c5b6a79880716', '1f2e3d4c5b6a79880716'),
  githubSource('github-review-skills', 'synthetic-org', 'review-skills', 2, 'UPDATE_AVAILABLE', '9a8b7c6d5e4f30211203', 'c0ffee1234abcd567890'),
  scenario === 'skill_source_issues'
    ? githubSource('github-legacy-skills', 'synthetic-org', 'legacy-skills', 1, 'UPDATE_FAILED', '5e5e5e5e5e5e5e5e5e5e', '6f6f6f6f6f6f6f6f6f6f', 'Synthetic update failed: the repository archive could not be read.')
    : githubSource('github-legacy-skills', 'synthetic-org', 'legacy-skills', 1, 'CHECK_FAILED', '5e5e5e5e5e5e5e5e5e5e', null, 'Synthetic check failed: the repository could not be reached.'),
  ...(scenario === 'skill_source_issues' ? [githubSource('github-old-skills', 'synthetic-org', 'old-skills', 0, 'REMOVING', '7a7a7a7a7a7a7a7a7a7a', null, 'Synthetic removal was interrupted.')] : []),
]
export const skillSourceData = (state) => {
  if (!state.skillSourceData) state.skillSourceData = { sources: state.scenario === 'empty' ? [] : baseSkillSources(state.scenario), seq: 0 }
  return state.skillSourceData
}
const skillSourceResult = (data, warnings = []) => ({ sources: structuredClone(data.sources), warnings })
export function skillSourceMutationFixture(operationName, variables = {}, state) {
  const data = skillSourceData(state)
  const find = id => data.sources.find(item => item.sourceId === id)
  switch (operationName) {
    case 'AddSkillSource':
      data.sources.push({ __typename: 'SkillSource', sourceId: `local-added-${++data.seq}`, sourceKind: 'LOCAL_PATH', path: String(variables.path), skillCount: 0, isDefault: false, github: null })
      return { addSkillSource: structuredClone(data.sources) }
    case 'RemoveSkillSource':
      data.sources = data.sources.filter(item => item.path !== variables.path)
      return { removeSkillSource: structuredClone(data.sources) }
    case 'ImportGitHubSkillSource': {
      const match = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/.exec(String(variables.repositoryUrl || '').trim())
      if (!match) return projectError('Enter a public GitHub repository root URL, for example https://github.com/owner/repository.', 'INVALID_GITHUB_REPOSITORY_URL')
      data.sources.push(githubSource(`github-imported-${++data.seq}`, match[1], match[2], 1, 'UP_TO_DATE', 'ab12cd34ef56ab78cd90', 'ab12cd34ef56ab78cd90'))
      return { importGitHubSkillSource: skillSourceResult(data) }
    }
    case 'CheckGitHubSkillSourceUpdates':
      // Scripted: every check reports each source's fixed synthetic status again.
      return { checkGitHubSkillSourceUpdates: skillSourceResult(data) }
    case 'UpdateGitHubSkillSource': {
      const source = find(variables.sourceId)
      if (source?.github) Object.assign(source.github, { installedRevision: source.github.latestRevision || source.github.installedRevision, status: 'UP_TO_DATE', lastError: null })
      return { updateGitHubSkillSource: skillSourceResult(data) }
    }
    case 'RemoveGitHubSkillSource':
      data.sources = data.sources.filter(item => item.sourceId !== variables.sourceId)
      return { removeGitHubSkillSource: skillSourceResult(data) }
    default:
      return null
  }
}
export const SKILL_SOURCE_MUTATIONS = new Set(['AddSkillSource', 'RemoveSkillSource', 'ImportGitHubSkillSource', 'CheckGitHubSkillSourceUpdates', 'UpdateGitHubSkillSource', 'RemoveGitHubSkillSource'])
export const PROJECT_MUTATIONS = new Set(['CreateProject', 'UpdateProject', 'DeleteProject', 'AddProjectWorkspace', 'UpdateProjectWorkspace', 'RemoveProjectWorkspace', 'CreateProjectTask', 'UpdateProjectTask', 'DeleteProjectTask'])

// History row for the deterministic TeamRun created by CreateAgentTeamRun.
const launchedTeamRunHistoryItem = {
  ...teamRun,
  teamRunId: 'team-run-created-fixture',
  summary: '',
  isActive: true,
  status: 'IDLE',
  rootTeam: teamRootExecution('team-run-created-fixture', ['team-member-researcher-created', 'team-member-writer-created']),
  members: teamRun.members.map((member, index) => ({ ...member, agentRunId: ['team-member-researcher-created', 'team-member-writer-created'][index] })),
}

const provider = {
  id: 'mock-provider',
  name: 'Prototype Models',
  providerType: 'mock',
  isCustom: false,
  baseUrl: 'mock://local',
  apiKeyConfigured: true,
  status: 'READY',
  statusMessage: 'Deterministic local fixture',
}

const model = {
  modelIdentifier: 'mock/gpt-prototype',
  name: 'Prototype Model',
  description: 'Deterministic model fixture; no inference request is made.',
  value: 'mock/gpt-prototype',
  canonicalName: 'mock/gpt-prototype',
  providerId: provider.id,
  providerName: provider.name,
  providerType: provider.providerType,
  runtime: 'autobyteus',
  hostUrl: 'mock://local',
  configSchema: {},
  maxContextTokens: 128000,
  activeContextTokens: 64000,
  maxInputTokens: 120000,
  maxOutputTokens: 8000,
  metadataProvenance: 'fixture',
}

// WEB-BASELINE-REFRESH-002: a second synthetic model whose config schema has a
// thinking switch and effort levels, so the Chat composer's thinking control
// and menu (shipped at 57df63f) are observable. No inference request is made.
const thinkingModel = {
  ...model,
  modelIdentifier: 'mock/reasoning-prototype',
  name: 'Reasoning Prototype Model',
  description: 'Deterministic model fixture with thinking settings; no inference request is made.',
  value: 'mock/reasoning-prototype',
  canonicalName: 'mock/reasoning-prototype',
  configSchema: {
    type: 'object',
    properties: {
      thinking_enabled: { type: 'boolean', title: 'Thinking', default: false },
      reasoning_effort: { type: 'string', title: 'Effort', enum: ['low', 'medium', 'high'], default: 'medium' },
    },
  },
}

const providerCatalogSnapshot = {
  __typename: 'ProviderModelCatalogSnapshotObject',
  runtimeKind: 'autobyteus',
  ownerProvider: { __typename: 'CatalogProviderObject', ...provider, catalogMode: 'STATIC' },
  sources: [{
    __typename: 'ModelSourceStatusObject',
    modelKind: 'LLM', state: 'READY', modelCount: 2,
    successfulUnitCount: 1, failedUnitCount: 0, safeMessage: null,
  }],
  llmModels: [{ __typename: 'ModelDetail', ...model }, { __typename: 'ModelDetail', ...thinkingModel }],
  audioModels: [], imageModels: [], videoModels: [],
}

const tool = {
  __typename: 'ToolDefinitionDetail',
  name: 'read_file',
  description: 'Reads a synthetic fixture file.',
  origin: 'LOCAL',
  category: 'File',
  argumentSchema: {
    __typename: 'ToolArgumentSchema',
    parameters: [{ __typename: 'ToolParameterDefinition', name: 'path', paramType: 'string', description: 'Synthetic file path', required: true, defaultValue: null, enumValues: null, jsonSchema: null }],
  },
}

const skill = {
  name: 'prototype-research',
  description: 'Demonstrates a deterministic synthetic skill.',
  content: '# Prototype Research\n\nUse only fixture evidence.',
  rootPath: '/synthetic/skills/prototype-research',
  fileCount: 2,
  isReadonly: false,
  isDisabled: false,
}

const memoryFlags = {
  latestMemoryAt: fixedNow,
  hasWorkingContext: true,
  hasEpisodic: true,
  hasSemantic: true,
  hasRawTraces: true,
  hasRawArchive: true,
}

const memoryStatus = {
  hub: { enabled: false, advertisedHubBaseUrl: 'http://127.0.0.1:4310', updatedAt: fixedNow },
  source: { enabled: false, sourceNodeId: 'prototype-node', displayName: 'Prototype Node', hubBaseUrl: '', hubTokenConfigured: false, hubTokenPreview: null, backgroundEnabled: false, intervalMs: 60000, batchSize: 50, updatedAt: fixedNow },
  connectionInfo: { hubEnabled: false, advertisedHubBaseUrl: 'http://127.0.0.1:4310', ingestEndpointUrl: 'http://127.0.0.1:4310/rest/memory-sync/ingest', healthEndpointUrl: 'http://127.0.0.1:4310/rest/health', secureTransportWarning: null, credentials: [] },
  sourceState: { jobState: 'IDLE', lastSuccessfulSyncAt: null, lastError: null, trackedFileCount: 0 },
  imports: [],
  oneTimePlaintextToken: null,
}

const gatewayStatus = (state, enabled = state.managedGatewayEnabled) => ({
  __typename: 'ManagedMessagingGatewayStatus',
  supported: true,
  enabled,
  lifecycleState: enabled ? 'RUNNING' : 'DISABLED',
  message: enabled ? 'Managed messaging gateway is running with synthetic fixtures.' : 'Managed messaging gateway is disabled.',
  lastError: null,
  activeVersion: enabled ? 'prototype-1.0.0' : null,
  desiredVersion: 'prototype-1.0.0',
  releaseTag: 'fixture',
  installedVersions: ['prototype-1.0.0'],
  bindHost: '127.0.0.1',
  bindPort: 4311,
  pid: enabled ? 4311 : null,
  providerConfig: {
    whatsappBusinessEnabled: false, whatsappBusinessSecret: '', wecomAppEnabled: false, wecomWebhookToken: '', wecomAppAccounts: [],
    discordEnabled: false, discordBotToken: '', discordAccountId: '', discordDiscoveryMaxCandidates: 50, discordDiscoveryTtlSeconds: 120,
    telegramEnabled: true, telegramBotToken: '', telegramAccountId: 'telegram-main', telegramPollingEnabled: true, telegramWebhookEnabled: false, telegramWebhookSecretToken: '',
  },
  providerStatusByProvider: {
    TELEGRAM: { provider: 'TELEGRAM', supported: true, selectedTransport: 'BUSINESS_API', configured: true, effectivelyEnabled: enabled, blockedReason: null, accountId: 'telegram-main' },
    DISCORD: { provider: 'DISCORD', supported: true, selectedTransport: 'BUSINESS_API', configured: false, effectivelyEnabled: false, blockedReason: 'Provider is not configured.', accountId: null },
  },
  supportedProviders: ['DISCORD', 'TELEGRAM'],
  excludedProviders: ['WHATSAPP', 'WECOM', 'WECHAT'],
  diagnostics: { fixture: true },
  runtimeReliabilityStatus: {
    runtime: {
      state: 'HEALTHY', criticalCode: null, updatedAt: fixedNow,
      workers: {
        inboundForwarder: { running: enabled, lastError: null, lastErrorAt: null },
        outboundSender: { running: enabled, lastError: null, lastErrorAt: null },
      },
      locks: {
        inbox: { ownerId: enabled ? 'prototype-gateway' : null, held: enabled, lost: false, lastHeartbeatAt: enabled ? fixedNow : null, lastError: null },
        outbox: { ownerId: enabled ? 'prototype-gateway' : null, held: enabled, lost: false, lastHeartbeatAt: enabled ? fixedNow : null, lastError: null },
      },
    },
    queue: { inboundDeadLetterCount: 0, inboundCompletedUnboundCount: 1, outboundDeadLetterCount: 0 },
  },
  runtimeRunning: enabled,
})

const paged = (entries) => ({ total: entries.length, page: 1, pageSize: 20, totalPages: entries.length ? 1 : 0, entries })

// Deterministic stored conversation projection shared by opened runs.
export const storedConversation = (request, reply) => [
  { kind: 'message', role: 'user', content: request, ts: '2026-08-22T04:01:00.000Z' },
  { kind: 'message', role: 'assistant', content: reply, ts: '2026-08-22T04:02:00.000Z' },
]

const writerDeliveryConversation = [
  { kind: 'inter_agent_message', role: 'user', content: 'You received a message from sender name: researcher, sender address: /researcher, sender id: team-member-researcher-001\nmessage:\nPlease document the synthetic review findings.', senderAgentRunId: 'team-member-researcher-001', senderAddress: '/researcher', ts: '2026-08-22T04:01:30.000Z' },
  { kind: 'message', role: 'assistant', content: 'The findings are documented in the synthetic review notes.', ts: '2026-08-22T04:02:30.000Z' },
]

export function fixtureContext(state) {
  const empty = state.scenario === 'empty'
  const appsEnabled = state.scenario === 'apps_disabled' ? false : state.applicationsEnabled
  const agents = empty ? [] : [agent, secondAgent, dailyAssistant]
  const teams = empty ? [] : [team]
  const applications = empty ? [] : [application]
  const workspaces = empty ? [] : [workspace, tempWorkspace]
  const skills = empty ? [] : [skill]
  const tools = empty ? [] : [tool]
  const orgs = empty ? [] : [org]
  const projectsEnabled = state.scenario === 'projects_disabled' ? false : state.projectsEnabled !== false
  const data = projectData(state)
  const projects = empty ? [] : data.projects.map(item => withCounts(data, item))
  return { empty, appsEnabled, agents, teams, applications, workspaces, skills, tools, orgs, projectsEnabled, projects }
}

export function operationFixture(operationName, variables = {}, state) {
  if (PROJECT_MUTATIONS.has(operationName)) return projectMutationFixture(operationName, variables, state)
  if (SKILL_SOURCE_MUTATIONS.has(operationName)) return skillSourceMutationFixture(operationName, variables, state)
  const c = fixtureContext(state)
  const tokenRunStatistics = createTokenUsageRunStatistics(state.scenario)
  const teamLaunchScenario = state.scenario === 'team_launch'
  const success = { success: true, message: 'Synthetic operation completed.' }
  const agentInput = variables.input || agent
  const teamInput = variables.input || team
  const configuredMcp = { __typename: 'StdioMcpServerConfig', serverId: 'prototype-files', transportType: 'STDIO', enabled: true, toolNamePrefix: 'prototype', command: 'mock-adapter', args: [], env: {}, cwd: '/synthetic' }
  const applicationPackage = { __typename: 'ApplicationPackage', packageId: 'prototype-app-package', displayName: 'Prototype Applications', sourceKind: 'BUILT_IN', sourceSummary: 'Deterministic synthetic bundle', rootPath: '/synthetic/applications', source: 'fixture', managedInstallPath: null, bundledSourceRootPath: '/synthetic/applications', applicationCount: 1, isPlatformOwned: true, isRemovable: false }
  const agentPackage = { __typename: 'AgentPackage', packageId: 'package-prototype', displayName: 'Prototype Agents', path: '/synthetic/agents', sourceKind: 'BUILT_IN', source: 'fixture', sharedAgentCount: 2, teamLocalAgentCount: 0, agentTeamCount: 1, applicationCount: 1, isDefault: true, isRemovable: false, updateInfo: { status: 'UP_TO_DATE', canCheck: true, canUpdate: false, canReload: true, message: 'Fixture is current.', installedRevision: 'fixture-1', latestRevision: 'fixture-1', checkedAt: fixedNow, lastError: null } }
  const runMemoryView = { runId: variables.runId || variables.agentRunId || run.runId, workingContext: [{ role: 'user', content: 'Review the synthetic baseline.', reasoning: null, toolPayload: null, ts: fixedNow }, { role: 'assistant', content: 'The deterministic fixture is ready.', reasoning: 'Fixture reasoning', toolPayload: null, ts: fixedNow }], episodic: '# Episode\nValidated current-state navigation.', semantic: '# Facts\nAll data in this view is synthetic.', rawTraceFiles: [{ fileName: 'segment-0001.jsonl', kind: 'active', recordCount: 1, segmentIndex: 1, firstTimestamp: fixedNow, lastTimestamp: fixedNow }], selectedRawTraceFileName: 'segment-0001.jsonl', rawTraces: [{ scope: 'agent', id: 'trace-1', traceType: 'message', sourceEvent: 'fixture', content: 'Deterministic trace entry', toolName: null, toolCallId: null, toolArgs: null, toolResult: null, toolError: null, media: null, turnId: 'turn-1', seq: 1, ts: fixedNow }] }
  const agentTokenSummary = createTokenUsageSummary({ runId: variables.runId || run.runId })
  const teamTokenSummary = createTokenUsageSummary({
    runId: variables.teamRunId || teamRun.teamRunId,
    rootTeamRunId: variables.teamRunId || teamRun.teamRunId,
    agentDefinitionId: null,
  })
  const teamMemberTokenSummary = createTokenUsageSummary({
    runId: variables.agentRunId || teamRun.members[0].agentRunId,
    rootTeamRunId: variables.teamRunId || teamRun.teamRunId,
    agentDefinitionId: teamRun.members[0].agentDefinitionId,
  })
  const requestedFolderPath = String(variables.folderPath || '').replace(/^\/+|\/+$/g, '')
  const folderChildren = requestedFolderPath === 'docs'
    ? {
        id: 'node-docs',
        name: 'docs',
        path: 'docs',
        is_file: false,
        children: [
          { id: 'node-evidence', name: 'evidence.md', path: 'docs/evidence.md', is_file: true, children: [] },
        ],
      }
    : {
        id: 'root',
        name: workspace.displayName,
        path: '',
        is_file: false,
        children: [
          { id: 'node-docs', name: 'docs', path: 'docs', is_file: false, children: [{ id: 'node-evidence', name: 'evidence.md', path: 'docs/evidence.md', is_file: true, children: [] }] },
          { id: 'node-requirements', name: 'requirements.md', path: 'requirements.md', is_file: true, children: [] },
        ],
      }

  const runModel = { llmModelIdentifier: model.modelIdentifier, providerName: provider.name, displayName: model.name, canonicalName: model.canonicalName, description: model.description, configSchema: {}, recommended: true }
  const runModelOptions = { currentModelIdentifier: model.modelIdentifier, unavailableReason: null, currentModel: runModel, replacements: [runModel] }
  const orgMemoryTargets = [
    { memberAddress: '/analyst', displayName: 'analyst', agentRunId: 'org-member-analyst-001', agentDefinitionId: agent.id, lastUpdatedAt: fixedNow, memory: memoryFlags },
    { memberAddress: '/review-team/researcher', displayName: 'researcher', agentRunId: 'org-member-review-researcher-001', agentDefinitionId: agent.id, lastUpdatedAt: fixedNow, memory: memoryFlags },
    { memberAddress: '/review-team/writer', displayName: 'writer', agentRunId: 'org-member-review-writer-001', agentDefinitionId: secondAgent.id, lastUpdatedAt: fixedNow, memory: memoryFlags },
  ]
  const fixtures = {
    GetAgentDefinitions: { agentDefinitions: c.agents },
    GetAgentOrgDefinitions: { agentOrgDefinitions: c.orgs },
    GetAgentOrgEndpointCatalog: { agentOrgEndpointCatalog: { __typename: 'DefinitionEndpointCatalog', from: orgEndpoints, to: orgEndpoints } },
    GetAgentOrgReferencedAgent: { agentDefinition: [agent, secondAgent].find(item => item.id === variables.id) || null },
    GetAgentOrgReferencedTeam: { agentTeamDefinition: variables.id === team.id ? team : null },
    ListCollaborationRootHistory: { listCollaborationRootHistory: c.empty || teamLaunchScenario ? [] : [{ __typename: 'AgentOrgRootHistoryObject', root_subject_kind: 'agent_org', root_run_id: orgRunId, created_at: fixedNow, archived_at: null, is_active: false, summary: 'Coordinate the synthetic launch review', org: orgExecutionTree }] },
    // 0a32261: one Org root's history row, re-read after the Org run is opened.
    GetAgentOrgRootHistory: { getAgentOrgRootHistory: variables.orgRunId === orgRunId && !c.empty ? { __typename: 'AgentOrgRootHistoryObject', root_subject_kind: 'agent_org', root_run_id: orgRunId, created_at: fixedNow, archived_at: null, is_active: false, summary: 'Coordinate the synthetic launch review', org: orgExecutionTree } : null },
    AgentOrgRunConfig: { getAgentOrgRunConfig: { orgRunId, executionTree: orgExecutionTree, isActive: false, editability: { editable: true, reason: null } } },
    GetAgentOrgExecutionCheckpoint: { getAgentOrgExecutionCheckpoint: { orgRunId, changeSequence: 1, hasOpenExecutionWork: false } },
    GetAgentOrgMemberRunProjection: { getAgentOrgMemberRunProjection: { agentRunId: variables.agentRunId || 'org-member-analyst-001', memberAddress: variables.memberAddress || '/analyst', summary: 'Coordinate the synthetic launch review', lastActivityAt: fixedNow, conversation: storedConversation('Coordinate the synthetic launch review.', 'The launch review is coordinated with the review team.'), activities: [], hasEarlierActiveTraceEvents: false } },
    GetAgentOrgMemberEventMonitorActiveTracePage: { getAgentOrgMemberEventMonitorActiveTracePage: { beforeCursor: null, hasEarlier: false, loadedEarlierCount: 0, activeGeneration: 0, cursorStatus: 'IDLE', events: [] } },
    AgentRunModelOptions: { agentRunModelOptions: runModelOptions },
    TeamRunModelOptions: { teamRunModelOptions: [{ scopeKind: 'team', scopeAddress: '/', ...runModelOptions }] },
    AgentOrgRunModelOptions: { agentOrgRunModelOptions: [{ scopeKind: 'org', scopeAddress: '/', ...runModelOptions }] },
    RuntimeCurrentModelDescriptors: { runtimeCurrentModelDescriptors: (variables.identifiers || []).map(identifier => ({ identifier, model: identifier === model.modelIdentifier ? { modelIdentifier: model.modelIdentifier, name: model.name, canonicalName: model.canonicalName, providerName: provider.name, providerType: provider.providerType, description: model.description, configSchema: {} } : null })) },
    GetProjectsCapability: { projectsCapability: { __typename: 'ProjectsCapability', enabled: c.projectsEnabled, settingKey: 'ENABLE_PROJECTS', source: c.projectsEnabled ? 'SERVER_SETTING' : 'INITIALIZED_DISABLED' } },
    SetProjectsEnabled: { setProjectsEnabled: { __typename: 'ProjectsCapability', enabled: Boolean(variables.enabled), settingKey: 'ENABLE_PROJECTS', source: 'SERVER_SETTING' } },
    GetProjects: { projects: c.projects },
    GetProject: { project: c.projects.find(item => item.projectId === variables.projectId) || null },
    GetProjectTasks: { projectTasks: c.empty ? [] : projectData(state).tasks.filter(task => task.projectId === variables.projectId) },
    ListAgentOrgsWithMemory: { listAgentOrgsWithMemory: paged(c.empty ? [] : [{ orgDefinitionId: org.id, orgDefinitionName: org.name, orgRunCount: 1, memberMemoryCount: 3, latestMemoryAt: fixedNow, memory: memoryFlags }]) },
    ListAgentOrgRunsWithMemory: { listAgentOrgRunsWithMemory: paged(c.empty ? [] : [{ orgRunId, orgDefinitionId: org.id, orgDefinitionName: org.name, summary: 'Coordinate the synthetic launch review', workspaceRootPath: workspace.workspaceRootPath, createdAt: fixedNow, lastUpdatedAt: fixedNow, memory: memoryFlags, memberTargets: orgMemoryTargets }]) },
    GetAgentTeamDefinitions: { agentTeamDefinitions: c.teams },
    GetAgentCustomizationOptions: { availableToolNames: c.tools.map(item => item.name), availableOptionalInputProcessorNames: [], availableOptionalLlmResponseProcessorNames: [], availableOptionalToolExecutionResultProcessorNames: [], availableOptionalToolInvocationPreprocessorNames: [], availableOptionalLifecycleProcessorNames: [] },
    GetApplicationsCapability: { applicationsCapability: { __typename: 'ApplicationsCapability', enabled: c.appsEnabled, scope: 'BOUND_NODE', settingKey: 'ENABLE_APPLICATIONS', source: 'INITIALIZED_FROM_DISCOVERED_APPLICATIONS' } },
    SetApplicationsEnabled: { setApplicationsEnabled: { __typename: 'ApplicationsCapability', enabled: Boolean(variables.enabled), scope: 'BOUND_NODE', settingKey: 'ENABLE_APPLICATIONS', source: 'SERVER_SETTING' } },
    ListApplications: { listApplications: c.applications },
    GetApplicationById: { application: c.applications.find(item => item.id === variables.id) || null },
    GetAllWorkspaces: { workspaces: c.workspaces },
    GetWorkspaceMetadata: { workspaceMetadata: workspace },
    CreateWorkspace: { createWorkspace: operationName === 'CreateWorkspace' && variables.input?.rootPath ? createdWorkspaceFor(variables.input.rootPath) : { ...workspace, ...agentInput } },
    RemoveWorkspace: { removeWorkspace: { ...success, workspaceId: variables.input?.workspaceId || workspace.workspaceId, workspaceRootPath: variables.input?.workspaceRootPath || workspace.workspaceRootPath } },
    GetSkills: { skills: c.skills },
    GetSkillNameIssues: { skillNameIssues: state.scenario === 'skill_name_issues' ? [
      { name: 'prototype-research', usedPath: '/synthetic/skills/prototype-research', ignoredPaths: ['/synthetic/agent-packages/research-pack/skills/prototype-research'], kind: 'conflict' },
      { name: 'code-review', usedPath: '/synthetic/skills/code-review', ignoredPaths: ['/synthetic/runtime-defaults/codex/skills/code-review'], kind: 'shadowed_runtime_default' },
    ] : [] },
    GetSkill: { skill: c.skills.find(item => item.name === variables.name) || null },
    GetSkillFileTree: { skillFileTree: JSON.stringify([{ name: 'SKILL.md', path: 'SKILL.md', isDirectory: false }, { name: 'references', path: 'references', isDirectory: true, children: [{ name: 'fixture.md', path: 'references/fixture.md', isDirectory: false }] }]) },
    GetSkillFileContent: { skillFileContent: variables.path === 'SKILL.md' ? skill.content : '# Fixture reference\nSynthetic evidence only.' },
    GetSkillSources: { skillSources: structuredClone(skillSourceData(state).sources), skillSourceRegistryError: null },
    ReloadSkillCatalog: { reloadSkillCatalog: { skills: c.skills, skillSources: structuredClone(skillSourceData(state).sources), skillSourceRegistryError: null } },
    CreateSkill: { createSkill: { ...skill, ...(variables.input || {}) } },
    UpdateSkill: { updateSkill: { ...skill, ...(variables.input || {}) } },
    DeleteSkill: { deleteSkill: success },
    UploadSkillFile: { uploadSkillFile: true }, DeleteSkillFile: { deleteSkillFile: true },
    DisableSkill: { disableSkill: { name: variables.name, isDisabled: true } }, EnableSkill: { enableSkill: { name: variables.name, isDisabled: false } },
    GetTools: { tools: c.tools },
    GetToolsGroupedByCategory: { toolsGroupedByCategory: c.empty ? [] : [{ __typename: 'ToolCategoryGroup', categoryName: 'File', tools: c.tools }] },
    ReloadToolSchema: { reloadToolSchema: { ...success, tool } },
    GetMcpServers: { mcpServers: c.empty ? [] : [configuredMcp] },
    PreviewMcpServerTools: { previewMcpServerTools: c.tools },
    ConfigureMcpServer: { configureMcpServer: { savedConfig: configuredMcp } },
    DeleteMcpServer: { deleteMcpServer: { __typename: 'McpMutationResult', ...success } },
    DiscoverAndRegisterMcpServerTools: { discoverAndRegisterMcpServerTools: { __typename: 'McpDiscoveryResult', ...success, discoveredTools: c.tools } },
    ImportMcpServerConfigs: { importMcpServerConfigs: { __typename: 'McpImportResult', ...success, importedCount: 1, failedCount: 0 } },
    GetProviderSettings: { providerSettings: c.empty ? [] : [{ provider, llmModels: [model, thinkingModel], audioModels: [], imageModels: [], videoModels: [] }] },
    GetAvailableLLMProvidersWithModels: { availableLlmProvidersWithModels: c.empty ? [] : [{ provider, models: [model, thinkingModel] }], availableAudioProvidersWithModels: [], availableImageProvidersWithModels: [], availableVideoProvidersWithModels: [] },
    GetProviderCredentialSettings: { providerCredentialSettings: c.empty ? [] : [{ provider: providerCatalogSnapshot.ownerProvider, apiKeyConfigured: true }] },
    GetProviderModelCatalogSnapshots: { providerModelCatalogSnapshots: c.empty ? [] : [providerCatalogSnapshot] },
    EnsureProviderModelCatalog: { ensureProviderModelCatalog: providerCatalogSnapshot },
    ReloadProviderModelCatalog: { reloadProviderModelCatalog: providerCatalogSnapshot },
    GetGeminiSetupConfig: { getGeminiSetupConfig: { activeMode: null, aiStudioConfigured: false, vertexExpressConfigured: false, vertexProject: { project: '', location: '' } } },
    GetQwenSetupStatus: { qwenSetupStatus: { effectiveBaseUrl: 'mock://local', endpointSource: 'fixture', apiKeyConfigured: true } },
    SaveProviderApiKey: { saveProviderApiKey: true }, SaveQwenConfiguration: { saveQwenConfiguration: { effectiveBaseUrl: 'mock://local', endpointSource: 'fixture', apiKeyConfigured: true } },
    ReloadLLMModels: { reloadLlmModels: true }, ReloadLLMProviderModels: { reloadLlmProviderModels: true },
    ProbeCustomProvider: { probeCustomProvider: { discoveredModels: [{ id: 'mock/custom', name: 'Custom Fixture Model' }] } },
    CreateCustomProvider: { createCustomProvider: true }, DeleteCustomProvider: { deleteCustomProvider: true },
    SaveGeminiAiStudio: { saveGeminiAiStudio: { activeMode: 'AI_STUDIO', aiStudioConfigured: true, vertexExpressConfigured: false, vertexProject: { project: '', location: '' } } },
    SaveGeminiVertexExpress: { saveGeminiVertexExpress: { activeMode: 'VERTEX_EXPRESS', aiStudioConfigured: false, vertexExpressConfigured: true, vertexProject: { project: '', location: '' } } },
    SaveGeminiVertexProject: { saveGeminiVertexProject: { activeMode: 'VERTEX_PROJECT', aiStudioConfigured: false, vertexExpressConfigured: false, vertexProject: { project: variables.project || 'prototype-project', location: variables.location || 'us-central1' } } },
    UseGeminiMode: { useGeminiMode: { activeMode: variables.mode, aiStudioConfigured: true, vertexExpressConfigured: true, vertexProject: { project: 'prototype-project', location: 'us-central1' } } },
    GetRuntimeAvailabilities: { runtimeAvailabilities: [{ __typename: 'RuntimeAvailabilityObject', runtimeKind: 'autobyteus', enabled: true, reason: null }] },
    // 0a32261: runtime availability is read per runtime kind.
    GetRuntimeAvailabilityKinds: { runtimeAvailabilityKinds: state.scenario === 'agy_runtime' ? ['autobyteus', 'antigravity_cli'] : ['autobyteus'] },
    GetRuntimeAvailability: { runtimeAvailability: { __typename: 'RuntimeAvailabilityObject', runtimeKind: variables.runtimeKind, enabled: variables.runtimeKind === 'autobyteus' || (state.scenario === 'agy_runtime' && variables.runtimeKind === 'antigravity_cli'), reason: null } },
    // 0a32261: the live-run `@` menu offers shared Agents and Teams that are not in the run.
    GetCollaboratorMentionCandidates: { collaboratorMentionCandidates: { availability: 'AVAILABLE', candidates: c.empty ? [] : [
      { kind: 'agent', definitionId: secondAgent.id, name: secondAgent.name, description: secondAgent.description, memberCount: null, coordinatorName: null },
      { kind: 'agent_team', definitionId: team.id, name: team.name, description: team.description, memberCount: team.nodes?.length ?? 2, coordinatorName: team.coordinatorMemberName || 'researcher' },
    ] } },
    GetAgentRunCollaboration: { agentRunCollaboration: variables.runId === run.runId && !c.empty ? agentRootCollaboration : null },
    GetAgentRunCollaborationMemberEventMonitorActiveTracePage: { agentRunCollaborationMemberEventMonitorActiveTracePage: variables.hostRunId === run.runId ? agentRootMemberEarlierPage(variables) : null },
    GetAgentRunCollaborationMemberProjection: { agentRunCollaborationMemberProjection: variables.hostRunId === run.runId ? agentRootMemberProjection(variables) : null },
    GetWorkingContextCompactionStrategies: { getWorkingContextCompactionStrategies: [{ id: 'default', name: 'Default' }] },
    ListWorkspaceRunHistory: { listWorkspaceRunHistory: c.empty || teamLaunchScenario ? [] : [{ workspaceRootPath: workspace.workspaceRootPath, workspaceName: workspace.displayName, agentDefinitions: [{ agentDefinitionId: agent.id, agentName: agent.name, runs: [run] }], teamDefinitions: [{ teamDefinitionId: team.id, teamDefinitionName: team.name, runs: state.launchedTeamRun ? [launchedTeamRunHistoryItem, teamRun] : [teamRun] }] }] },
    GetWorkspaceRunHistory: { workspaceRunHistory: c.empty ? null : { workspaceRootPath: workspace.workspaceRootPath, workspaceName: workspace.displayName, agentDefinitions: teamLaunchScenario ? [] : [{ agentDefinitionId: agent.id, agentName: agent.name, runs: [run] }], teamDefinitions: teamLaunchScenario ? [] : [{ teamDefinitionId: team.id, teamDefinitionName: team.name, runs: [teamRun] }] } },
    GetRunProjection: { getRunProjection: { runId: run.runId, summary: run.summary, lastActivityAt: fixedNow, conversation: storedConversation('Compare current navigation states.', 'The navigation states match the synthetic baseline.'), activities: [], hasEarlierActiveTraceEvents: false } },
    GetRunFileChanges: { getRunFileChanges: [{ id: 'file-change-1', runId: run.runId, path: 'README.md', type: 'modified', status: 'ready', sourceTool: 'write_file', sourceInvocationId: 'tool-1', content: '# Fixture', createdAt: fixedNow, updatedAt: fixedNow }] },
    GetRunEventMonitorActiveTracePage: { getRunEventMonitorActiveTracePage: { beforeCursor: null, hasEarlier: false, loadedEarlierCount: 0, activeGeneration: 0, cursorStatus: 'IDLE', events: [] } },
    GetTeamMemberEventMonitorActiveTracePage: { getTeamMemberEventMonitorActiveTracePage: { beforeCursor: null, hasEarlier: false, loadedEarlierCount: 0, activeGeneration: 0, cursorStatus: 'IDLE', events: [] } },
    GetTeamRunResumeConfig: { getTeamRunResumeConfig: variables.teamRunId === createdTeamRunId
      ? { teamRunId: createdTeamRunId, isActive: true, executionTree: createdTeamExecutionTree, modelConfigEditability: { editable: false, reason: null } }
      : { teamRunId: teamRun.teamRunId, isActive: false, executionTree: storedTeamExecutionTree, modelConfigEditability: { editable: true, reason: null } } },
    GetAgentOrgRunInspection: { getAgentOrgRunInspection: {
      root_subject_kind: 'agent_org', root_run_id: orgRunId,
      root_org: {
        base_change_sequence: 1, is_active: false, execution_tree: orgExecutionTree,
        communication_messages: { schemaVersion: 1, subjectKind: 'agent_org', orgRunId, messages: [] },
        // A stored (inactive) root reports no live AgentRun statuses.
        agent_statuses: [],
        agent_input_states: [],
      },
    } },
    GetTeamRunExecutionCheckpoint: { getTeamRunExecutionCheckpoint: { rootTeamRunId: teamRun.teamRunId, changeSequence: 1, hasOpenExecutionWork: false } },
    GetTeamMemberRunProjection: { getTeamMemberRunProjection: { agentRunId: variables.agentRunId || 'team-member-researcher-001', summary: teamRun.summary, lastActivityAt: fixedNow, conversation: String(variables.agentRunId || '').endsWith('-created') ? []
      // 0a32261: an agent-to-agent delivery opens the receiver's block with "From <Sender>:".
      : variables.agentRunId === 'team-member-writer-001' ? writerDeliveryConversation
        : storedConversation('Review the current prototype baseline.', 'The baseline review is complete; no blocking differences were found.'), activities: [], hasEarlierActiveTraceEvents: false } },
    GetTeamCommunicationMessages: { getTeamCommunicationMessages: [] },
    GetAgentRunResumeConfig: { getAgentRunResumeConfig: variables.runId === 'run-prepared-fixture'
      // The Chat first send (57df63f): Daily Assistant in the temp workspace.
      ? { runId: 'run-prepared-fixture', isActive: true, metadataConfig: { agentDefinitionId: dailyAssistant.id, workspaceRootPath: tempWorkspace.workspaceRootPath, llmModelIdentifier: model.modelIdentifier, llmConfig: {}, autoExecuteTools: true, runtimeKind: 'autobyteus', runtimeReference: null }, editableFields: { llmModelIdentifier: false, llmConfig: false, autoExecuteTools: false, workspaceRootPath: false, runtimeKind: false }, modelConfigEditability: { editable: false, reason: null } }
      : { runId: run.runId, isActive: false, metadataConfig: { agentDefinitionId: agent.id, workspaceRootPath: workspace.workspaceRootPath, llmModelIdentifier: model.modelIdentifier, llmConfig: {}, autoExecuteTools: false, runtimeKind: 'autobyteus', runtimeReference: null }, editableFields: { llmModelIdentifier: true, llmConfig: true, autoExecuteTools: true, workspaceRootPath: true, runtimeKind: true }, modelConfigEditability: { editable: false, reason: null } } },
    DeleteStoredRun: { deleteStoredRun: success }, ArchiveStoredRun: { archiveStoredRun: success }, DeleteStoredTeamRun: { deleteStoredTeamRun: success }, ArchiveStoredTeamRun: { archiveStoredTeamRun: success },
    CreateAgentRun: { createAgentRun: { agentRunId: 'run-created-fixture', runId: 'run-created-fixture', status: 'IDLE' } },
    PrepareAgentRun: { prepareAgentRun: { ...success, runId: 'run-prepared-fixture', activationState: 'PREPARED', preparedExpiresAt: null } },
    CancelPreparedAgentRun: { cancelPreparedAgentRun: success }, TerminateAgentRun: { terminateAgentRun: success }, RestoreAgentRun: { restoreAgentRun: { ...run, status: 'IDLE' } }, ApproveToolInvocation: { approveToolInvocation: success },
    CreateAgentTeamRun: { createAgentTeamRun: { __typename: 'CreateAgentTeamRunResult', ...success, teamRunId: createdTeamRunId, status: 'IDLE' } }, TerminateAgentTeamRun: { terminateAgentTeamRun: success }, RestoreAgentTeamRun: { restoreAgentTeamRun: { ...teamRun, status: 'IDLE' } },
    CreateAgentDefinition: { createAgentDefinition: { ...agent, ...agentInput, id: agentInput.id || 'agent-created-fixture' } }, UpdateAgentDefinition: { updateAgentDefinition: { ...agent, ...agentInput } }, DeleteAgentDefinition: { deleteAgentDefinition: success }, RefreshAgentDefinitionCatalog: { refreshAgentDefinitionCatalog: c.agents },
    CreateAgentTeamDefinition: { createAgentTeamDefinition: { ...team, ...teamInput, id: teamInput.id || 'team-created-fixture' } }, UpdateAgentTeamDefinition: { updateAgentTeamDefinition: { ...team, ...teamInput } }, DeleteAgentTeamDefinition: { deleteAgentTeamDefinition: success }, RefreshAgentTeamDefinitionCatalog: { refreshAgentTeamDefinitionCatalog: c.teams },
    GetServerSettings: {
      getServerSettings: [
        { __typename: 'ServerSetting', key: 'LOG_LEVEL', value: 'INFO', description: 'Synthetic log verbosity.', isEditable: true, isDeletable: true },
        { __typename: 'ServerSetting', key: 'DATA_DIR', value: '/synthetic/prototype-data', description: 'Isolated synthetic data directory.', isEditable: false, isDeletable: false },
      ],
      getEffectiveWorkingContextCompactionStrategyId: 'default',
      getEffectiveStreamingContentFlushIntervalMs: 50,
    },
    GetSearchConfig: { getSearchConfig: { provider: 'none', vaultHealth: 'healthy', instructionCode: null, serperStorageState: 'NOT_CONFIGURED', serpapiStorageState: 'NOT_CONFIGURED', vertexAiSearchStorageState: 'NOT_CONFIGURED', vertexAiSearchServingConfig: '' } },
    UpdateServerSetting: { updateServerSetting: true }, DeleteServerSetting: { deleteServerSetting: true }, SetSearchConfig: { setSearchConfig: true },
    GetAppDataMigrations: { getAppDataMigrations: c.empty ? [] : [{ migrationId: 'prototype-migration', displayName: 'Prototype fixture migration', description: 'No production data is touched.', status: 'COMPLETED', requiredOnStartup: false, recoveryAction: null, canRetry: false, attempts: 1, startedAt: fixedNow, completedAt: fixedNow, summary: 'Synthetic migration already complete.', errorMessage: null, logPath: null }] },
    RunAppDataMigration: { runAppDataMigration: { migrationId: variables.migrationId, status: 'COMPLETED', summary: 'Synthetic migration completed.' } },
    ManagedMessagingGatewayStatus: { managedMessagingGatewayStatus: gatewayStatus(state) },
    ManagedMessagingGatewayWeComAccounts: { managedMessagingGatewayWeComAccounts: [] },
    ManagedMessagingGatewayPeerCandidates: { managedMessagingGatewayPeerCandidates: { __typename: 'ManagedMessagingPeerCandidates', accountId: 'telegram-main', updatedAt: fixedNow, items: c.empty ? [] : [{ __typename: 'ManagedMessagingPeerCandidate', peerId: 'peer-prototype', peerType: 'direct', threadId: null, displayName: 'Prototype Reviewer', lastMessageAt: fixedNow }] } },
    EnableManagedMessagingGateway: { enableManagedMessagingGateway: gatewayStatus(state, true) }, DisableManagedMessagingGateway: { disableManagedMessagingGateway: gatewayStatus(state, false) }, UpdateManagedMessagingGateway: { updateManagedMessagingGateway: gatewayStatus(state) }, SaveManagedMessagingGatewayProviderConfig: { saveManagedMessagingGatewayProviderConfig: gatewayStatus(state) },
    ExternalChannelCapabilities: { externalChannelCapabilities: { __typename: 'ExternalChannelCapabilities', bindingCrudEnabled: true, reason: null, acceptedProviderTransportPairs: ['telegram:polling', 'discord:gateway'] } },
    ExternalChannelBindings: { externalChannelBindings: c.empty ? [] : [{ __typename: 'ExternalChannelBinding', id: 'binding-prototype', provider: 'telegram', transport: 'polling', accountId: 'telegram-main', peerId: 'peer-prototype', threadId: null, targetType: 'agent', targetAgentDefinitionId: agent.id, targetTeamDefinitionId: null, launchPreset: { workspaceRootPath: workspace.workspaceRootPath, llmModelIdentifier: model.modelIdentifier, runtimeKind: 'autobyteus', autoExecuteTools: false, llmConfig: {} }, teamLaunchPreset: null, teamRunId: null, updatedAt: fixedNow }] },
    ExternalChannelTeamDefinitionOptions: { externalChannelTeamDefinitionOptions: c.empty ? [] : [{ __typename: 'ExternalChannelTeamDefinitionOption', teamDefinitionId: team.id, teamDefinitionName: team.name, description: team.description, coordinatorMemberName: team.coordinatorMemberName, memberCount: team.nodes.length }] },
    UpsertExternalChannelBinding: { upsertExternalChannelBinding: { __typename: 'ExternalChannelBinding', id: 'binding-updated-fixture', ...(variables.input || {}), updatedAt: fixedNow } }, DeleteExternalChannelBinding: { deleteExternalChannelBinding: success },
    GetMemorySyncStatus: { getMemorySyncStatus: memoryStatus }, ListMemoryHubUrlCandidates: { listMemoryHubUrlCandidates: [{ id: 'current', kind: 'current', label: 'Current prototype node', baseUrl: 'http://127.0.0.1:4310', source: 'fixture' }] }, GetMemoryHubConnectionInfo: { getMemoryHubConnectionInfo: memoryStatus.connectionInfo },
    UpdateMemoryHubConfig: { updateMemoryHubConfig: memoryStatus }, UpdateMemorySyncSourceConfig: { updateMemorySyncSourceConfig: memoryStatus },
    CreateMemoryHubSourceCredential: { createMemoryHubSourceCredential: { plaintextToken: 'prototype_fixture_token', credential: { credentialId: 'credential-fixture', label: 'Prototype', boundSourceNodeId: 'prototype-node', createdAt: fixedNow, lastUsedAt: null, revokedAt: null, status: 'ACTIVE' } } },
    RegenerateMemoryHubSourceCredential: { regenerateMemoryHubSourceCredential: { plaintextToken: 'prototype_fixture_token_regenerated', credential: { credentialId: variables.credentialId, label: 'Prototype', boundSourceNodeId: 'prototype-node', createdAt: fixedNow, lastUsedAt: null, revokedAt: null, status: 'ACTIVE' } } },
    RevokeMemoryHubSourceCredential: { revokeMemoryHubSourceCredential: { credentialId: variables.credentialId, label: 'Prototype', boundSourceNodeId: 'prototype-node', createdAt: fixedNow, lastUsedAt: null, revokedAt: fixedNow, status: 'REVOKED' } },
    TestMemoryHubConnection: { testMemoryHubConnection: { ok: true, hubEnabled: false, sourceNodeId: 'prototype-node', authenticated: true, message: 'Deterministic fixture connection succeeded.' } },
    StartMemorySync: { startMemorySync: { startedAt: fixedNow, finishedAt: fixedNow, scannedFiles: 2, changedFiles: 1, unchangedFiles: 1, deferredFiles: 0, committedBatches: 1, duplicateBatches: 0 } },
    ListMemoryExplorerSources: { listMemoryExplorerSources: [{ key: 'local', type: 'local', label: 'This node', sourceNodeId: 'prototype-node', displayName: 'Prototype Node', readOnly: false, lastImportedAt: null, lastSyncStatus: null }] },
    ListAgentsWithMemory: { listAgentsWithMemory: paged(c.empty ? [] : [{ attribution: 'local', agentDefinitionId: agent.id, displayName: agent.name, stableId: agent.id, runCount: 1, latestMemoryAt: fixedNow, memory: memoryFlags }]) },
    ListAgentRunsWithMemory: { listAgentRunsWithMemory: paged(c.empty ? [] : [{ ...run, memory: memoryFlags }]) },
    ListAgentTeamsWithMemory: { listAgentTeamsWithMemory: paged(c.empty ? [] : [{ teamDefinitionId: team.id, teamDefinitionName: team.name, teamRunCount: 1, memberMemoryCount: 2, latestMemoryAt: fixedNow, memory: memoryFlags }]) },
    ListAgentTeamRunsWithMemory: { listAgentTeamRunsWithMemory: paged(c.empty ? [] : [{ ...teamRun, memory: memoryFlags, memberTargets: teamRun.members.map(member => ({ memberAddress: member.memberAddress, displayName: member.memberName, agentRunId: member.agentRunId, agentDefinitionId: member.agentDefinitionId, lastUpdatedAt: fixedNow, memory: memoryFlags })) }]) },
    GetAgentRunMemoryView: { getAgentRunMemoryView: runMemoryView }, GetTeamMemberRunMemoryView: { getTeamMemberRunMemoryView: runMemoryView },
    GetAgentOrgMemberRunMemoryView: { getAgentOrgMemberRunMemoryView: runMemoryView },
    GetAgentOrgMemberTokenUsageSummary: { getAgentOrgMemberTokenUsageSummary: teamMemberTokenSummary },
    GetAgentRunTokenUsageSummary: { getAgentRunTokenUsageSummary: agentTokenSummary },
    // 4dee901: a standalone run's usage including its collaborators and task copies.
    GetStandaloneRunTokenUsageSummary: { getStandaloneRunTokenUsageSummary: agentTokenSummary }, GetTeamRunTokenUsageSummary: { getTeamRunTokenUsageSummary: teamTokenSummary }, GetTeamMemberTokenUsageSummary: { getTeamMemberTokenUsageSummary: teamMemberTokenSummary },
    GetTokenUsageAnalytics: { tokenUsageAnalytics: createTokenUsageAnalyticsResult(variables.input || {}, state.scenario) },
    GetTokenUsageTaskStatisticsInPeriod: { tokenUsageTaskStatisticsInPeriod: { rows: tokenRunStatistics.taskRows } },
    GetUsageStatisticsInPeriod: { usageStatisticsInPeriod: tokenRunStatistics.modelRows },
    GetSkillImprovementCapability: { skillImprovementCapability: { supported: true, enabled: true, reason: null } }, GetAgentRunSkillImprovementEligibility: { agentRunSkillImprovementEligibility: { eligible: true, reason: null } }, GetTeamMemberSkillImprovementEligibility: { teamMemberSkillImprovementEligibility: { eligible: true, reason: null } }, GetSkillImprovementRunRecord: { skillImprovementRunRecord: null },
    SetSkillImprovementEnabled: { setSkillImprovementEnabled: { supported: true, enabled: Boolean(variables.enabled), reason: null } }, StartAgentRunSkillImprovement: { startAgentRunSkillImprovement: { improvementRunId: 'improvement-fixture', improverRunId: 'run-improver-fixture', record: { improvementRunId: 'improvement-fixture', status: 'RUNNING', createdAt: fixedNow } } }, StartTeamMemberSkillImprovement: { startTeamMemberSkillImprovement: { improvementRunId: 'improvement-fixture', improverRunId: 'run-improver-fixture', record: { improvementRunId: 'improvement-fixture', status: 'RUNNING', createdAt: fixedNow } } },
    GetAgentPackages: { agentPackages: c.empty ? [] : [agentPackage] }, ImportAgentPackage: { importAgentPackage: agentPackage }, RemoveAgentPackage: { removeAgentPackage: agentPackage }, ReloadAgentPackage: { reloadAgentPackage: agentPackage }, CheckAgentPackageUpdates: { checkAgentPackageUpdates: [agentPackage] }, UpdateAgentPackage: { updateAgentPackage: agentPackage },
    GetApplicationPackages: { applicationPackages: c.empty ? [] : [applicationPackage] }, GetApplicationPackageDetails: { applicationPackageDetails: { ...applicationPackage, __typename: 'ApplicationPackageDetails' } }, ImportApplicationPackage: { importApplicationPackage: [applicationPackage] }, RemoveApplicationPackage: { removeApplicationPackage: [applicationPackage] },
    GetFileContent: { fileContent: '# Prototype Workspace\n\nThis content is synthetic.' }, SearchFiles: { searchFiles: JSON.stringify([{ path: 'README.md', name: 'README.md', isDirectory: false }]) }, GetFolderChildren: { folderChildren: JSON.stringify(folderChildren) },
    WriteFileContent: { writeFileContent: true }, DeleteFileOrFolder: { deleteFileOrFolder: true }, MoveFileOrFolder: { moveFileOrFolder: true }, RenameFileOrFolder: { renameFileOrFolder: true }, CreateFileOrFolder: { createFileOrFolder: true },
  }

  return fixtures[operationName] || null
}

const draftingAgentRef = { source: 'bundle', kind: 'AGENT', localId: 'drafting-agent' }
const draftingBaseline = {
  slotKey: 'draftingAgent',
  executionResourceRef: draftingAgentRef,
  resourceDefinitionId: 'agent-writer',
  resourceKind: 'AGENT',
  leaves: [{
    memberAddress: null, displayName: 'Documentation Writer', agentDefinitionId: 'agent-writer',
    runtimeKind: 'autobyteus', llmModelIdentifier: 'mock/gpt-prototype', llmConfig: null,
    provenance: {
      runtimeKind: { kind: 'PACKAGE_AGENT_DEFAULT', agentDefinitionId: 'agent-writer' },
      llmModelIdentifier: { kind: 'PACKAGE_AGENT_DEFAULT', agentDefinitionId: 'agent-writer' },
      llmConfig: null,
    },
  }],
}

/** Current `ApplicationLaunchConfigurationView` REST contract for the synthetic application. */
export function applicationLaunchConfigurationView() {
  return {
    applicationId: 'sample-app',
    slots: [{
      slot: {
        slotKey: 'draftingAgent', name: 'Drafting agent', description: 'Drafts the synthetic product brief.',
        allowedExecutionResourceKinds: ['AGENT'], allowedExecutionResourceSources: ['bundle', 'shared'], required: true,
        supportedLaunchConfig: { AGENT: { llmModelIdentifier: true, runtimeKind: true, llmConfig: true, workspaceRootPath: false } },
        defaultExecutionResourceRef: draftingAgentRef,
      },
      packageBaseline: draftingBaseline,
      selectedResourceBaseline: draftingBaseline,
      savedOverride: null,
      savedOverrideState: 'ABSENT',
      effectiveConfiguration: {
        slotKey: 'draftingAgent', executionResourceRef: draftingAgentRef, resourceDefinitionId: 'agent-writer', resourceKind: 'AGENT',
        leaves: [{
          memberAddress: null, displayName: 'Documentation Writer', agentDefinitionId: 'agent-writer',
          runtimeKind: 'autobyteus', llmModelIdentifier: 'mock/gpt-prototype', llmConfig: null, workspaceRootPath: '/synthetic/applications/sample-app',
          provenance: {
            runtimeKind: { kind: 'PACKAGE_AGENT_DEFAULT', agentDefinitionId: 'agent-writer' },
            llmModelIdentifier: { kind: 'PACKAGE_AGENT_DEFAULT', agentDefinitionId: 'agent-writer' },
            llmConfig: null, workspaceRootPath: 'APPLICATION_RUNTIME',
          },
        }],
      },
      issues: [],
      canResetToPackageDefaults: false,
      updatedAt: null,
    }],
    readiness: { status: 'RUNNABLE', issues: [] },
  }
}

export function applicationAvailableExecutionResources() {
  return [
    { source: 'bundle', kind: 'AGENT', localId: 'drafting-agent', definitionId: 'agent-writer', name: 'Documentation Writer', applicationId: 'sample-app' },
    { source: 'shared', kind: 'AGENT', localId: null, definitionId: 'agent-researcher', name: 'Research Assistant', applicationId: null },
  ]
}

export function syntheticApplicationHtml() {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#f8fafc;color:#0f172a;font:14px system-ui,sans-serif}.shell{min-height:100vh;padding:32px}.badge{color:#2563eb;font-weight:700;text-transform:uppercase;letter-spacing:.12em}.card{margin-top:20px;max-width:760px;padding:24px;border:1px solid #cbd5e1;border-radius:16px;background:white;box-shadow:0 12px 30px #0f172a12}textarea{box-sizing:border-box;width:100%;min-height:180px;margin-top:16px;padding:12px;border:1px solid #94a3b8;border-radius:10px}button{margin-top:12px;border:0;border-radius:9px;background:#2563eb;color:white;padding:10px 16px;font-weight:650}</style></head><body><main class="shell"><div class="badge">Synthetic application fixture</div><section class="card"><h1>Brief Studio</h1><p>Draft a concise product brief using deterministic prototype resources.</p><textarea aria-label="Brief draft">Current-state baseline review</textarea><br><button type="button" onclick="this.textContent='Saved locally'">Save draft</button></section></main></body></html>`
}

export const exposedFixtures = Object.freeze({ agent, secondAgent, dailyAssistant, team, org, orgExecutionTree, project, projectTasks, workspace, tempWorkspace, application, run, teamRun, createdTeamExecutionTree, provider, model, thinkingModel, tool, skill, fixedNow })
