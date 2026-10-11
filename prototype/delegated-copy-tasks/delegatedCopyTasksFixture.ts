/**
 * delegated-copy-task-locator (design-only): a Project Task Manager run whose delegated copies look
 * alike in the Workspaces tree, and the Tasks they work on.
 *
 * Everything here is invented and illustrative; nothing is read from a real node:
 * - a stored standalone run `run-ptm-0001` of "Project Task Manager" in prototype-workspace;
 * - its Task workers (delegated copies): three `/software_engineering_team` copies and two
 *   `/agent_package_creator` copies;
 * - a "Desktop App" Project (most recently updated, so it is the Projects tab's default) with the
 *   copies' Tasks, one Task in the baseline's "Prototype Launch" Project, and one Temp task;
 * - copy 3 finished an earlier Task (Done) and was given a follow-up Task (In Progress).
 *
 * Turned off with the other design-only layers (`autobyteus.prototype.designOnlyLayers=off`).
 */
import { exposedFixtures, projectData } from '~/prototype/source-observation/fixtures.mjs'

const { workspace, project: launchProject } = exposedFixtures as Record<string, any>

export const PTM_RUN_ID = 'run-ptm-0001'
const PTM_DEFINITION_ID = 'project-task-manager'
const PTM_NAME = 'Project Task Manager'
/** Catalog entry fields (plugins/98.delegated-copy-tasks.client.ts adds them to a catalog row). */
export const PTM_DEFINITION = Object.freeze({ id: PTM_DEFINITION_ID, name: PTM_NAME, role: 'Plans Project Tasks and delegates them.', description: 'Plans Project Tasks and delegates them to agents and teams.', avatarUrl: null, ownershipScope: 'SHARED', ownerTeamId: null })
const DESKTOP_PROJECT_ID = 'project-desktop-app'

const createdAt = '2026-10-09T07:30:00.000Z'
const updatedAt = '2026-10-11T08:05:00.000Z'
const at = (minutes: number) => new Date(Date.parse('2026-10-11T07:00:00.000Z') + minutes * 60_000).toISOString()

const launch = { runtimeKind: 'autobyteus', llmModelIdentifier: 'mock/gpt-prototype', llmConfig: { temperature: 0.2 }, autoExecuteTools: false, workspaceRootPath: workspace.workspaceRootPath }

type Copy =
  | { kind: 'team'; teamRunId: string; address: string; members: { name: string; agentRunId: string }[] }
  | { kind: 'agent'; agentRunId: string; address: string }

const SET_MEMBERS = ['solution_designer', 'implementation_engineer', 'code_reviewer']
const setCopy = (n: string): Copy => ({
  kind: 'team', teamRunId: `ptm-set-${n}`, address: '/software_engineering_team',
  members: SET_MEMBERS.map((name) => ({ name, agentRunId: `ptm-set-${n}-${name}` })),
})
export const COPIES: readonly Copy[] = [
  setCopy('0001'),
  { kind: 'agent', agentRunId: 'ptm-apc-0001', address: '/agent_package_creator' },
  setCopy('0002'),
  { kind: 'agent', agentRunId: 'ptm-apc-0002', address: '/agent_package_creator' },
  setCopy('0003'),
]

const agentSourceFor = (address: string) => ({ kind: 'agent', agentDefinitionId: address.includes('package') ? 'agent-writer' : 'agent-researcher', launchConfiguration: launch })

const taskExecution = (copy: Copy) => copy.kind === 'agent'
  ? { address: copy.address, agentRunId: copy.agentRunId, platformAgentRunId: null, delegatorAgentRunId: PTM_RUN_ID, startedAt: createdAt, source: agentSourceFor(copy.address) }
  : {
      address: copy.address, teamRunId: copy.teamRunId, delegatorAgentRunId: PTM_RUN_ID, startedAt: createdAt,
      source: { kind: 'agent_team', teamDefinitionId: 'team-product', coordinatorAddress: `${copy.address}/solution_designer`,
        members: copy.members.map((member) => ({ address: `${copy.address}/${member.name}`, agentDefinitionId: 'agent-researcher' })),
        handoffs: [], defaultLaunchConfiguration: launch },
      members: copy.members.map((member) => ({ address: `${copy.address}/${member.name}`, agentRunId: member.agentRunId, platformAgentRunId: null })),
      taskExecutions: [],
    }

const collaboration = () => ({
  root_subject_kind: 'agent', root_run_id: PTM_RUN_ID,
  root_agent: {
    base_change_sequence: 1, is_active: false,
    execution_tree: {
      subjectKind: 'agent', createdAt,
      host: { address: '/project_task_manager', agentRunId: PTM_RUN_ID, agentDefinitionId: PTM_DEFINITION_ID },
      collaborators: [],
      taskExecutions: COPIES.map(taskExecution),
    },
    closed_task_executions: [],
    communication_messages: { schemaVersion: 1, subjectKind: 'agent', hostRunId: PTM_RUN_ID, messages: [] },
    agent_statuses: [],
    agent_input_states: [],
  },
})

// --- Tasks ---------------------------------------------------------------------------------

const root = (fields: Record<string, unknown>) => ({
  __typename: 'TaskRoot', kind: 'agent', recipientAddress: null, teamRunId: null,
  hostRoot: { __typename: 'TaskRootHost', kind: 'agent', runId: PTM_RUN_ID },
  start: 'started', startError: null, closed: false, status: 'offline', ...fields,
})
const teamRoot = (n: string, status = 'offline') => root({ kind: 'team', recipientAddress: '/software_engineering_team', teamRunId: `ptm-set-${n}`, ingressAgentRunId: `ptm-set-${n}-solution_designer`, status })
const agentRoot = (id: string, status = 'offline') => root({ recipientAddress: '/agent_package_creator', ingressAgentRunId: id, status })

const projectTask = (taskId: string, projectId: string, description: string, status: string, minutes: number, taskRoot: unknown) => ({
  __typename: 'ProjectTask', taskId, projectId, description, status, createdAt, updatedAt: at(minutes), contextFiles: [], root: taskRoot,
})

const desktopProject = {
  __typename: 'Project', projectId: DESKTOP_PROJECT_ID, name: 'AutoByteus',
  description: 'Synthetic project for the AutoByteus app release work.',
  createdAt, updatedAt,
  workspaces: [{ __typename: 'ProjectWorkspace', workspaceRootPath: workspace.workspaceRootPath, displayName: workspace.displayName ?? 'prototype-workspace', description: '', availability: 'AVAILABLE' }],
}

const designTasks = () => [
  projectTask('dct-token-meter', DESKTOP_PROJECT_ID,
    'Token Meter accuracy: the context fill reads 97% right after compaction\n- (A) "Latest prompt" fill stays at 97% until the next turn.\n- (B) The meter sometimes resets to 0%.', 'IN_PROGRESS', 50, teamRoot('0001', 'running')),
  projectTask('dct-member-reach', DESKTOP_PROJECT_ID,
    'Members of a delegated team can\'t reach the agent package creator\nThe team\'s members get "unknown recipient" when they message it.', 'IN_PROGRESS', 40, teamRoot('0002', 'idle')),
  projectTask('dct-base-tests', DESKTOP_PROJECT_ID,
    'Fix the pre-existing failing tests on the base branch\nThree suites fail before any change is applied.', 'DONE', 10, teamRoot('0003')),
  projectTask('dct-image-context', DESKTOP_PROJECT_ID,
    'Image context files don\'t reach the model on the first turn\nFollow-up to the base-branch test fix.', 'IN_PROGRESS', 45, teamRoot('0003')),
  projectTask('dct-work-journal', DESKTOP_PROJECT_ID,
    'Work Journal: a readable, runtime-independent record of each run', 'TODO', 30, null),
  projectTask('dct-release-notes', DESKTOP_PROJECT_ID,
    'Write the 1.5 release notes', 'TODO', 20, null),
  projectTask('dct-cancelled-tooltip', DESKTOP_PROJECT_ID,
    'Redesign the legacy token meter tooltip', 'CANCELLED', 5, root({ kind: 'team', recipientAddress: '/software_engineering_team', teamRunId: 'ptm-set-0000', ingressAgentRunId: 'ptm-set-0000-solution_designer', closed: true })),
  projectTask('dct-release-agent', launchProject.projectId,
    'Package the release-notes agent for the agent store\nInclude the skill folder and a sample prompt.', 'TODO', 35, agentRoot('ptm-apc-0001')),
]

const designTempTasks = () => [
  { __typename: 'TaskWithoutProject', taskId: 'dct-temp-onboarding', description: 'Draft an onboarding agent package for the pilot customers', status: 'IN_PROGRESS', referenceFiles: ['/synthetic/prototype-workspace/docs/pilot-brief.md'], createdAt, updatedAt: at(25), root: agentRoot('ptm-apc-0002', 'idle') },
]

/** Seeds this layer's Projects and Tasks into a browser context's fixture state (once per scenario). */
export const seedDelegatedCopyTasks = (state: Record<string, any>, scenario: string): void => {
  if (scenario !== 'populated') return
  const data = projectData(state)
  if (data.projects.some((item: any) => item.projectId === DESKTOP_PROJECT_ID)) return
  data.projects.unshift(structuredClone(desktopProject))
  data.tasks.push(...designTasks())
  data.tasksWithoutProject.push(...designTempTasks())
}

// --- Run history and the run's views --------------------------------------------------------

const historyRun = (template: Record<string, any>) => ({
  ...template,
  runId: PTM_RUN_ID, agentRunId: PTM_RUN_ID, agentDefinitionId: PTM_DEFINITION_ID, agentName: PTM_NAME,
  summary: 'Dispatch the approved desktop app Tasks', createdAt, lastUpdatedAt: updatedAt, lastActivityAt: updatedAt,
  archivedAt: null, terminatedAt: null, status: 'IDLE', isActive: false, shouldConnectStream: false,
  workspaceRootPath: workspace.workspaceRootPath, hasCollaboration: true,
})

const hostConversation = [
  { kind: 'message', role: 'user', content: 'Dispatch the approved desktop app Tasks.', ts: at(1) },
  { kind: 'message', role: 'assistant', content: 'Delegated five Tasks: three to copies of the Software Engineering Team and two to copies of the Agent Package Creator. Copy 3 finished the base-branch test fix and now has the image context follow-up.', ts: at(2) },
]

const memberConversation = (agentRunId: string) => [
  { kind: 'inter_agent_message', role: 'user', content: `You received a message from sender name: project task manager, sender address: /project_task_manager, sender id: ${PTM_RUN_ID}\nmessage:\nPlease work on the Task you were given.`, senderAgentRunId: PTM_RUN_ID, senderAddress: '/project_task_manager', ts: at(3) },
  { kind: 'message', role: 'assistant', content: agentRunId.includes('apc') ? 'The package skeleton is ready for review.' : 'Probe needs the workspace packages built. Running the server\'s prebuild step.', ts: at(4) },
]

export const withDelegatedCopyTasks = (name: string, variables: Record<string, any>, data: any, scenario: string): any => {
  if (scenario !== 'populated' || !data) return data
  switch (name) {
    case 'ListWorkspaceRunHistory': {
      const entry = data.listWorkspaceRunHistory?.find((item: any) => item.workspaceRootPath === workspace.workspaceRootPath)
      if (!entry || entry.agentDefinitions.some((item: any) => item.agentDefinitionId === PTM_DEFINITION_ID)) return data
      entry.agentDefinitions = [...entry.agentDefinitions, { agentDefinitionId: PTM_DEFINITION_ID, agentName: PTM_NAME, runs: [historyRun(entry.agentDefinitions?.[0]?.runs?.[0] ?? {})] }]
      return data
    }
    case 'GetWorkspaceRunHistory': {
      const entry = data.workspaceRunHistory
      if (!entry || entry.workspaceRootPath !== workspace.workspaceRootPath || !entry.agentDefinitions?.length) return data
      if (!entry.agentDefinitions.some((item: any) => item.agentDefinitionId === PTM_DEFINITION_ID)) {
        entry.agentDefinitions = [...entry.agentDefinitions, { agentDefinitionId: PTM_DEFINITION_ID, agentName: PTM_NAME, runs: [historyRun(entry.agentDefinitions[0].runs[0])] }]
      }
      return data
    }
    case 'GetRunProjection':
      return variables.runId === PTM_RUN_ID
        ? { getRunProjection: { runId: PTM_RUN_ID, summary: historyRun({}).summary, lastActivityAt: updatedAt, conversation: hostConversation, activities: [], hasEarlierActiveTraceEvents: false } }
        : data
    case 'GetAgentRunResumeConfig':
      return variables.runId === PTM_RUN_ID
        ? { getAgentRunResumeConfig: { ...data.getAgentRunResumeConfig, runId: PTM_RUN_ID, isActive: false,
            metadataConfig: { ...data.getAgentRunResumeConfig.metadataConfig, agentDefinitionId: PTM_DEFINITION_ID } } }
        : data
    case 'GetAgentRunCollaboration':
      return variables.runId === PTM_RUN_ID ? { agentRunCollaboration: collaboration() } : data
    case 'GetAgentRunCollaborationMemberProjection':
      return variables.hostRunId === PTM_RUN_ID
        ? { agentRunCollaborationMemberProjection: { agentRunId: variables.agentRunId, memberAddress: variables.memberAddress, summary: historyRun({}).summary, lastActivityAt: updatedAt, conversation: memberConversation(String(variables.agentRunId)), activities: [], hasEarlierActiveTraceEvents: false } }
        : data
    case 'GetAgentRunCollaborationMemberEventMonitorActiveTracePage':
      return variables.hostRunId === PTM_RUN_ID
        ? { agentRunCollaborationMemberEventMonitorActiveTracePage: { beforeCursor: null, hasEarlier: false, loadedEarlierCount: 0, activeGeneration: '1', cursorStatus: 'VALID', events: [] } }
        : data
    default:
      return data
  }
}
