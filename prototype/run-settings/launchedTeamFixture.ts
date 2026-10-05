/**
 * run-settings-ui-unification: a Team launched from New chat opens its own run in the UI reference,
 * whichever Team it is. The base fixture's CreateAgentTeamRun always returned the Product Review
 * Team's tree, so any other Team (e.g. the AutoByteus Org's Software Engineering Team) failed with
 * "Launched Team is missing '/<coordinator>'". This builds the launched run's tree and history row from
 * the launch request itself (members, agents, settings) and the Team definition (name, coordinator).
 * Nothing runs; the run view, tree and settings simply reflect what was launched.
 */

const CREATED_TEAM_RUN_ID = 'team-run-created-fixture'

type LaunchRecord = {
  runtimeKind: string
  llmModelIdentifier: string
  llmConfig: Record<string, unknown> | null
  autoExecuteTools: boolean
  workspaceRootPath: string | null
}
type TeamLaunchInput = {
  teamDefinitionId: string
  teamConfigs: Array<LaunchRecord & { teamAddress: string }>
  memberConfigs: Array<LaunchRecord & { memberAddress: string; agentDefinitionId: string }>
}
type TeamDefinition = { id: string; name: string; coordinatorMemberName?: string | null }
type AgentDefinition = { id: string; name: string }

let launched: TeamLaunchInput | null = null

/** CreateAgentTeamRun: remember what was launched (one browser context, reset on reload). */
export const recordTeamLaunch = (variables: Record<string, unknown>): void => {
  const input = (variables as { input?: TeamLaunchInput }).input
  if (input?.teamDefinitionId && Array.isArray(input.memberConfigs)) launched = input
}

const launchConfiguration = (record: LaunchRecord | undefined) => ({
  runtime_kind: record?.runtimeKind ?? 'autobyteus',
  llm_model_identifier: record?.llmModelIdentifier ?? '',
  llm_config: record?.llmConfig ?? null,
  auto_execute_tools: Boolean(record?.autoExecuteTools),
  workspace_root_path: record?.workspaceRootPath ?? null,
})
const memberName = (address: string) => address.split('/').filter(Boolean).pop() ?? address
const memberRunId = (address: string) => `team-member-${memberName(address)}-created`

const rootTeam = (input: TeamLaunchInput, team: TeamDefinition | null) => ({
  address: '/',
  team_definition_id: input.teamDefinitionId,
  team_definition_name: team?.name ?? input.teamDefinitionId,
  team_run_id: CREATED_TEAM_RUN_ID,
  coordinator_address: `/${team?.coordinatorMemberName ?? memberName(input.memberConfigs[0]?.memberAddress ?? '')}`,
  default_launch_configuration: launchConfiguration(input.teamConfigs.find((scope) => scope.teamAddress === '/') ?? input.memberConfigs[0]),
  members: input.memberConfigs.map((member) => ({
    kind: 'configured_agent',
    address: member.memberAddress,
    agent_definition_id: member.agentDefinitionId,
    role: null,
    description: null,
    agent_run_id: memberRunId(member.memberAddress),
    platform_agent_run_id: null,
    launch_configuration: launchConfiguration(member),
  })),
  collaborators: [],
  task_executions: [],
})

/**
 * Reads that describe the launched run: its resume config (tree) and its history row. The caller
 * supplies the Team and Agent catalogs (base fixture + the AutoByteus Org fixture).
 */
export const withLaunchedTeam = (
  operationName: string,
  variables: Record<string, unknown>,
  data: Record<string, any> | null,
  catalogs: { teams: readonly TeamDefinition[]; agents: readonly AgentDefinition[] },
): Record<string, any> | null => {
  const input = launched
  if (!input || !data) return data
  const team = catalogs.teams.find((entry) => entry.id === input.teamDefinitionId) ?? null
  const tree = rootTeam(input, team)

  if (operationName === 'GetTeamRunResumeConfig' && variables.teamRunId === CREATED_TEAM_RUN_ID) {
    const current = data.getTeamRunResumeConfig ?? {}
    return { ...data, getTeamRunResumeConfig: { ...current, executionTree: { ...(current.executionTree ?? {}), root_team: tree } } }
  }

  if (operationName === 'ListWorkspaceRunHistory' && Array.isArray(data.listWorkspaceRunHistory)) {
    const groups = structuredClone(data.listWorkspaceRunHistory) as Array<Record<string, any>>
    let template: Record<string, any> | null = null
    for (const group of groups) {
      for (const teamGroup of group.teamDefinitions ?? []) {
        const index = (teamGroup.runs ?? []).findIndex((run: { teamRunId?: string }) => run.teamRunId === CREATED_TEAM_RUN_ID)
        if (index >= 0) { template = teamGroup.runs[index]; teamGroup.runs.splice(index, 1) }
      }
      group.teamDefinitions = (group.teamDefinitions ?? []).filter((teamGroup: { runs?: unknown[] }) => teamGroup.runs?.length)
    }
    if (!template) return data
    const workspaceRootPath = input.teamConfigs.find((scope) => scope.teamAddress === '/')?.workspaceRootPath ?? null
    let target = groups.find((group) => group.workspaceRootPath === workspaceRootPath)
    if (!target && workspaceRootPath) {
      target = { workspaceRootPath, workspaceName: memberName(workspaceRootPath), agentDefinitions: [], teamDefinitions: [] }
      groups.push(target)
    }
    target ??= groups[0]
    if (!target) return data
    const agentName = (id: string) => catalogs.agents.find((agent) => agent.id === id)?.name ?? memberName(id)
    const historyItem = {
      ...template,
      teamDefinitionId: input.teamDefinitionId,
      teamDefinitionName: team?.name ?? input.teamDefinitionId,
      coordinatorAddress: tree.coordinator_address,
      rootTeam: tree,
      workspaceRootPath: workspaceRootPath ?? template.workspaceRootPath,
      members: input.memberConfigs.map((member) => ({
        memberName: memberName(member.memberAddress),
        displayName: agentName(member.agentDefinitionId),
        memberAddress: member.memberAddress,
        agentRunId: memberRunId(member.memberAddress),
        agentDefinitionId: member.agentDefinitionId,
        agentName: agentName(member.agentDefinitionId),
        status: 'IDLE',
        runtimeKind: member.runtimeKind,
        workspaceRootPath: member.workspaceRootPath,
      })),
    }
    const existing = (target.teamDefinitions ?? []).find((teamGroup: { teamDefinitionId?: string }) => teamGroup.teamDefinitionId === input.teamDefinitionId)
    if (existing) existing.runs = [historyItem, ...(existing.runs ?? [])]
    else target.teamDefinitions = [...(target.teamDefinitions ?? []), { teamDefinitionId: input.teamDefinitionId, teamDefinitionName: team?.name ?? input.teamDefinitionId, runs: [historyItem] }]
    return { ...data, listWorkspaceRunHistory: groups }
  }
  return data
}
