/**
 * run-settings-ui-unification (SR-003): "Run Agent Org" opens the launched Org run in the UI
 * reference, whichever Org it is. CreateAgentOrgRun returns one synthetic run id, and the Org run
 * reads (inspection, history, run config, checkpoint) describe that run, built from the launch
 * request (root settings, team and agent overrides) and the Org / Team definitions. Nothing runs.
 */

export const CREATED_ORG_RUN_ID = 'org-run-created-fixture'

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
type DefinitionMember = { memberName: string; ref: string; refType?: string | null }
type OrgDefinition = { id: string; name: string; members: DefinitionMember[] }
type TeamDefinition = { id: string; name: string; coordinatorMemberName?: string | null; nodes: Array<DefinitionMember & { refScope?: string | null }> }
export type OrgCatalogs = { orgs: readonly OrgDefinition[]; teams: readonly TeamDefinition[] }

let launched: { input: OrgLaunchInput; createdAt: string } | null = null

/** CreateAgentOrgRun: remember what was launched (one browser context, reset on reload). */
export const recordOrgLaunch = (variables: Record<string, unknown>): Record<string, unknown> => {
  const input = (variables as { input?: OrgLaunchInput }).input
  if (!input?.agentOrgDefinitionId || !input.rootConfiguration) {
    return { createAgentOrgRun: { __typename: 'CreateAgentOrgRunResult', success: false, message: 'Invalid launch request.', agentOrgRunId: null } }
  }
  launched = { input, createdAt: new Date().toISOString() }
  return { createAgentOrgRun: { __typename: 'CreateAgentOrgRunResult', success: true, message: null, agentOrgRunId: CREATED_ORG_RUN_ID } }
}

const slug = (address: string) => address.split('/').filter(Boolean).join('-')
const withOverride = (base: LaunchConfiguration, overrides: readonly Override[], address: string): LaunchConfiguration => {
  const override = overrides.find((entry) => entry.address === address)?.configuration
  return override ? { ...base, ...override } : base
}

const buildTeam = (input: OrgLaunchInput, catalogs: OrgCatalogs, team: TeamDefinition, address: string, inherited: LaunchConfiguration): Record<string, unknown> => {
  const config = withOverride(inherited, input.teamOverrides, address)
  return {
    address,
    teamDefinitionId: team.id,
    role: null,
    description: null,
    teamRunId: `org-team-${slug(address)}-created`,
    coordinatorAddress: `${address}/${team.coordinatorMemberName ?? team.nodes[0]?.memberName ?? ''}`,
    defaultLaunchConfiguration: config,
    members: team.nodes.map((node) => buildMember(input, catalogs, node, `${address}/${node.memberName}`, config)),
    taskExecutions: [],
  }
}

const buildMember = (input: OrgLaunchInput, catalogs: OrgCatalogs, member: DefinitionMember, address: string, inherited: LaunchConfiguration): Record<string, unknown> => {
  const team = member.refType === 'AGENT_TEAM' ? catalogs.teams.find((entry) => entry.id === member.ref) : undefined
  if (team) return buildTeam(input, catalogs, team, address, inherited)
  return {
    address,
    agentDefinitionId: member.ref,
    role: null,
    description: null,
    agentRunId: `org-member-${slug(address)}-created`,
    platformAgentRunId: null,
    launchConfiguration: withOverride(inherited, input.agentOverrides, address),
  }
}

const executionTree = (input: OrgLaunchInput, catalogs: OrgCatalogs, createdAt: string) => {
  const org = catalogs.orgs.find((entry) => entry.id === input.agentOrgDefinitionId)
  return {
    subjectKind: 'agent_org',
    createdAt,
    archivedAt: null,
    applicationBinding: null,
    handoffs: [],
    rootOrg: {
      address: '/',
      orgDefinitionId: input.agentOrgDefinitionId,
      orgDefinitionName: org?.name ?? input.agentOrgDefinitionId,
      orgRunId: CREATED_ORG_RUN_ID,
      defaultLaunchConfiguration: input.rootConfiguration,
      members: (org?.members ?? []).map((member) => buildMember(input, catalogs, member, `/${member.memberName}`, input.rootConfiguration)),
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

/** Reads that describe the launched Org run. The caller supplies the Org and Team catalogs. */
export const withLaunchedOrg = (
  operationName: string,
  variables: Record<string, unknown>,
  data: Record<string, any> | null,
  catalogs: () => OrgCatalogs,
): Record<string, any> | null => {
  if (!launched) return data
  const isCreated = variables.orgRunId === CREATED_ORG_RUN_ID
  const historyRow = () => ({
    __typename: 'AgentOrgRootHistoryObject', root_subject_kind: 'agent_org', root_run_id: CREATED_ORG_RUN_ID,
    created_at: launched!.createdAt, archived_at: null, is_active: true, summary: '',
    org: executionTree(launched!.input, catalogs(), launched!.createdAt),
  })
  switch (operationName) {
    case 'ListCollaborationRootHistory':
      return { ...data, listCollaborationRootHistory: [historyRow(), ...((data?.listCollaborationRootHistory as unknown[]) ?? [])] }
    case 'GetAgentOrgRootHistory':
      return isCreated ? { ...data, getAgentOrgRootHistory: historyRow() } : data
    case 'GetAgentOrgRunInspection': {
      if (!isCreated) return data
      const tree = executionTree(launched.input, catalogs(), launched.createdAt)
      return {
        ...data,
        getAgentOrgRunInspection: {
          root_subject_kind: 'agent_org', root_run_id: CREATED_ORG_RUN_ID,
          root_org: {
            base_change_sequence: 1, is_active: true, execution_tree: tree,
            communication_messages: { schemaVersion: 1, subjectKind: 'agent_org', orgRunId: CREATED_ORG_RUN_ID, messages: [] },
            agent_statuses: idleStatuses(tree.rootOrg.members as Array<Record<string, any>>),
            agent_input_states: [],
          },
        },
      }
    }
    case 'AgentOrgRunConfig':
      return isCreated
        ? { ...data, getAgentOrgRunConfig: { orgRunId: CREATED_ORG_RUN_ID, executionTree: executionTree(launched.input, catalogs(), launched.createdAt), isActive: true, editability: { editable: false, reason: null } } }
        : data
    case 'GetAgentOrgMemberRunProjection':
      // A just-launched member has no conversation yet.
      return isCreated
        ? { ...data, getAgentOrgMemberRunProjection: { agentRunId: variables.agentRunId, memberAddress: variables.memberAddress, summary: '', lastActivityAt: launched.createdAt, conversation: [], activities: [], hasEarlierActiveTraceEvents: false } }
        : data
    case 'GetAgentOrgExecutionCheckpoint':
      return isCreated ? { ...data, getAgentOrgExecutionCheckpoint: { orgRunId: CREATED_ORG_RUN_ID, changeSequence: 1, hasOpenExecutionWork: false } } : data
    default:
      return data
  }
}
