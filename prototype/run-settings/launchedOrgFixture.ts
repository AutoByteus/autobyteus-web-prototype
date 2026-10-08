/**
 * run-settings-ui-unification (SR-003): "Run Agent Org" opens the launched Org run in the UI
 * reference, whichever Org it is. Each CreateAgentOrgRun returns a new synthetic run id, and the Org
 * run reads (inspection, history, run config, member conversations, checkpoint) describe that run,
 * built from the launch request (root settings, team and agent overrides) and the Org / Team
 * definitions. Nothing runs; every agent waits idle for its first message.
 */

import { buildTeamLocalAgentDefinitionId } from '~/utils/teamLocalDefinitionId'

const LAUNCHED_ORG_RUN_PREFIX = 'org-run-launched-'

type LaunchConfiguration = {
  runtimeKind: string
  llmModelIdentifier: string
  llmConfig: Record<string, unknown> | null
  autoExecuteTools: boolean
  workspaceRootPath: string | null
}
type Override = { address: string; configuration: Partial<LaunchConfiguration> }
type OrgLaunchInput = {
  agentOrgDefinitionId: string
  rootConfiguration: LaunchConfiguration
  teamOverrides: Override[]
  agentOverrides: Override[]
}
type DefinitionMember = { memberName: string; ref: string; refType?: string | null; refScope?: string | null }
type OrgDefinition = { id: string; name: string; members: DefinitionMember[] }
type TeamDefinition = { id: string; name: string; coordinatorMemberName?: string | null; nodes: DefinitionMember[] }
export type OrgCatalogs = { orgs: readonly OrgDefinition[]; teams: readonly TeamDefinition[] }
type LaunchedOrgRun = { orgRunId: string; input: OrgLaunchInput; createdAt: string; stopped: boolean }

/** Launched runs, newest first (one browser context, reset on reload). */
const launchedRuns: LaunchedOrgRun[] = []

/** Run ids end in a short id the UI shows (last 4 characters), like real run ids. */
const shortId = (seed: string): string => {
  let hash = 2166136261
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return (hash >>> 0).toString(16).padStart(8, '0').slice(-4)
}

export const isLaunchedOrgRunId = (orgRunId: string): boolean => launchedRuns.some((run) => run.orgRunId === orgRunId)

/** CreateAgentOrgRun: remember what was launched and return a new run id. */
export const recordOrgLaunch = (variables: Record<string, unknown>): Record<string, unknown> => {
  const input = (variables as { input?: OrgLaunchInput }).input
  if (!input?.agentOrgDefinitionId || !input.rootConfiguration) {
    return { createAgentOrgRun: { __typename: 'CreateAgentOrgRunResult', success: false, message: 'Invalid launch request.', agentOrgRunId: null } }
  }
  const sequence = launchedRuns.length + 1
  const orgRunId = `${LAUNCHED_ORG_RUN_PREFIX}${sequence}-${shortId(`${input.agentOrgDefinitionId}#${sequence}`)}`
  // The request holds live (reactive) page values; keep a plain copy.
  launchedRuns.unshift({ orgRunId, input: JSON.parse(JSON.stringify(input)) as OrgLaunchInput, createdAt: new Date().toISOString(), stopped: false })
  return { createAgentOrgRun: { __typename: 'CreateAgentOrgRunResult', success: true, message: null, agentOrgRunId: orgRunId } }
}

/** TerminateAgentOrgRun: a launched run stops; later reads describe it as stopped. */
export const recordOrgTermination = (variables: Record<string, unknown>): Record<string, unknown> => {
  const run = launchedRuns.find((entry) => entry.orgRunId === variables.agentOrgRunId)
  if (run) run.stopped = true
  return { terminateAgentOrgRun: { __typename: 'TerminateAgentOrgRunResult', success: true, message: null } }
}

const slug = (address: string) => address.split('/').filter(Boolean).join('-')
const withOverride = (base: LaunchConfiguration, overrides: readonly Override[], address: string): LaunchConfiguration => {
  const override = overrides.find((entry) => entry.address === address)?.configuration
  return override ? { ...base, ...override } : base
}

const buildTeam = (run: LaunchedOrgRun, catalogs: OrgCatalogs, team: TeamDefinition, address: string, inherited: LaunchConfiguration): Record<string, unknown> => {
  const config = withOverride(inherited, run.input.teamOverrides, address)
  return {
    address,
    teamDefinitionId: team.id,
    role: null,
    description: null,
    teamRunId: `org-team-${slug(address)}-${shortId(`${run.orgRunId}#team${address}`)}`,
    coordinatorAddress: `${address}/${team.coordinatorMemberName ?? team.nodes[0]?.memberName ?? ''}`,
    defaultLaunchConfiguration: config,
    // A team-local agent is identified by its team and its local id, as in the product.
    members: team.nodes.map((node) => buildMember(run, catalogs, node.refScope === 'TEAM_LOCAL'
      ? { ...node, ref: buildTeamLocalAgentDefinitionId(team.id, node.ref) }
      : node, `${address}/${node.memberName}`, config)),
    taskExecutions: [],
  }
}

const buildMember = (run: LaunchedOrgRun, catalogs: OrgCatalogs, member: DefinitionMember, address: string, inherited: LaunchConfiguration): Record<string, unknown> => {
  const team = member.refType === 'AGENT_TEAM' ? catalogs.teams.find((entry) => entry.id === member.ref) : undefined
  if (team) return buildTeam(run, catalogs, team, address, inherited)
  return {
    address,
    agentDefinitionId: member.ref,
    role: null,
    description: null,
    agentRunId: `org-member-${slug(address)}-${shortId(`${run.orgRunId}#${address}`)}`,
    platformAgentRunId: null,
    launchConfiguration: withOverride(inherited, run.input.agentOverrides, address),
  }
}

const executionTree = (run: LaunchedOrgRun, catalogs: OrgCatalogs) => {
  const org = catalogs.orgs.find((entry) => entry.id === run.input.agentOrgDefinitionId)
  return {
    subjectKind: 'agent_org',
    createdAt: run.createdAt,
    archivedAt: null,
    applicationBinding: null,
    handoffs: [],
    rootOrg: {
      address: '/',
      orgDefinitionId: run.input.agentOrgDefinitionId,
      orgDefinitionName: org?.name ?? run.input.agentOrgDefinitionId,
      orgRunId: run.orgRunId,
      defaultLaunchConfiguration: run.input.rootConfiguration,
      members: (org?.members ?? []).map((member) => buildMember(run, catalogs, member, `/${member.memberName}`, run.input.rootConfiguration)),
      collaborators: [],
      taskExecutions: [],
    },
  }
}

/** A live run reports a status for every agent: all idle, waiting for the first message. */
const idleStatuses = (members: ReadonlyArray<Record<string, any>>): Array<Record<string, unknown>> => members.flatMap((member) =>
  Array.isArray(member.members)
    ? idleStatuses(member.members)
    : [{ member_address: member.address, agent_run_id: member.agentRunId, status: 'idle', trigger: null, tool_name: null, error_message: null, error_details: null, recoverableBlock: null }])

const historyRow = (run: LaunchedOrgRun, catalogs: OrgCatalogs) => ({
  __typename: 'AgentOrgRootHistoryObject', root_subject_kind: 'agent_org', root_run_id: run.orgRunId,
  created_at: run.createdAt, archived_at: null, is_active: !run.stopped, summary: '',
  org: executionTree(run, catalogs),
  // 1cd1a3a: Task executions closed by DONE (none for a launched Org).
  closed_task_executions: [],
})

/** Reads that describe the launched Org runs. The caller supplies the Org and Team catalogs. */
export const withLaunchedOrg = (
  operationName: string,
  variables: Record<string, unknown>,
  data: Record<string, any> | null,
  catalogs: () => OrgCatalogs,
): Record<string, any> | null => {
  if (!launchedRuns.length) return data
  if (operationName === 'ListCollaborationRootHistory') {
    const rows = launchedRuns.map((run) => historyRow(run, catalogs()))
    return { ...data, listCollaborationRootHistory: [...rows, ...((data?.listCollaborationRootHistory as unknown[]) ?? [])] }
  }
  const run = launchedRuns.find((entry) => entry.orgRunId === variables.orgRunId)
  if (!run) return data
  switch (operationName) {
    case 'GetAgentOrgRootHistory':
      return { ...data, getAgentOrgRootHistory: historyRow(run, catalogs()) }
    case 'GetAgentOrgRunInspection': {
      const tree = executionTree(run, catalogs())
      return {
        ...data,
        getAgentOrgRunInspection: {
          root_subject_kind: 'agent_org', root_run_id: run.orgRunId,
          root_org: {
            base_change_sequence: 1, is_active: !run.stopped, execution_tree: tree, closed_task_executions: [],
            communication_messages: { schemaVersion: 1, subjectKind: 'agent_org', orgRunId: run.orgRunId, messages: [] },
            // A stopped (inactive) root reports no live AgentRun statuses.
            agent_statuses: run.stopped ? [] : idleStatuses(tree.rootOrg.members as Array<Record<string, any>>),
            agent_input_states: [],
          },
        },
      }
    }
    case 'AgentOrgRunConfig':
      return { ...data, getAgentOrgRunConfig: { orgRunId: run.orgRunId, executionTree: executionTree(run, catalogs()), isActive: !run.stopped, editability: { editable: run.stopped, reason: null } } }
    case 'GetAgentOrgMemberRunProjection':
      // A just-launched member has no conversation yet.
      return { ...data, getAgentOrgMemberRunProjection: { agentRunId: variables.agentRunId, memberAddress: variables.memberAddress, summary: '', lastActivityAt: run.createdAt, conversation: [], activities: [], hasEarlierActiveTraceEvents: false } }
    case 'GetAgentOrgExecutionCheckpoint':
      return { ...data, getAgentOrgExecutionCheckpoint: { orgRunId: run.orgRunId, changeSequence: 1, hasOpenExecutionWork: false } }
    default:
      return data
  }
}
