/**
 * run-settings-ui-unification: a Team launched from New chat opens its own run in the UI reference,
 * whichever Team it is, as many times as it is launched. The base fixture's CreateAgentTeamRun always
 * returned one run with the Product Review Team's tree, so any other Team failed with "Launched Team
 * is missing '/<coordinator>'", and a second launch failed with "TeamRun … is already registered".
 * Each launch now gets its own run id; its tree and history row are built from the launch request
 * (members, agents, settings) and the Team definition (name, coordinator). The first launch keeps the
 * base fixture's ids. Nothing runs; the run view, tree and settings reflect what was launched.
 */

/** The base fixture's id for a created TeamRun: the first launch in a browser context. */
const BASE_CREATED_TEAM_RUN_ID = 'team-run-created-fixture'

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
type LaunchedTeamRun = { teamRunId: string; input: TeamLaunchInput; launchedAt: string }

/** Launched runs, newest first (one browser context, reset on reload). */
const launchedRuns: LaunchedTeamRun[] = []

/** Run ids end in a short id the UI shows (last 4 characters), like real run ids. */
const shortId = (seed: string): string => {
  let hash = 2166136261
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return (hash >>> 0).toString(16).padStart(8, '0').slice(-4)
}

export const isLaunchedTeamRunId = (teamRunId: unknown): boolean =>
  typeof teamRunId === 'string' && launchedRuns.some((run) => run.teamRunId === teamRunId)

/** CreateAgentTeamRun: remember what was launched and answer with a new run id. */
export const recordTeamLaunch = (variables: Record<string, unknown>, data: Record<string, any> | null): Record<string, any> | null => {
  const input = (variables as { input?: TeamLaunchInput }).input
  if (!input?.teamDefinitionId || !Array.isArray(input.memberConfigs)) return data
  const sequence = launchedRuns.length + 1
  const teamRunId = sequence === 1 ? BASE_CREATED_TEAM_RUN_ID : `team-run-launched-${sequence}-${shortId(`${input.teamDefinitionId}#${sequence}`)}`
  // The request holds live (reactive) page values; keep a plain copy.
  launchedRuns.unshift({ teamRunId, input: JSON.parse(JSON.stringify(input)) as TeamLaunchInput, launchedAt: new Date().toISOString() })
  return { ...data, createAgentTeamRun: { ...(data?.createAgentTeamRun ?? { __typename: 'CreateAgentTeamRunResult', success: true, message: null, status: 'IDLE' }), teamRunId } }
}

const launchConfiguration = (record: LaunchRecord | undefined) => ({
  runtime_kind: record?.runtimeKind ?? 'autobyteus',
  llm_model_identifier: record?.llmModelIdentifier ?? '',
  llm_config: record?.llmConfig ?? null,
  auto_execute_tools: Boolean(record?.autoExecuteTools),
  workspace_root_path: record?.workspaceRootPath ?? null,
})
const memberName = (address: string) => address.split('/').filter(Boolean).pop() ?? address
const memberRunId = (run: LaunchedTeamRun, address: string) => run.teamRunId === BASE_CREATED_TEAM_RUN_ID
  ? `team-member-${memberName(address)}-created`
  : `team-member-${memberName(address)}-${shortId(`${run.teamRunId}#${address}`)}`

const rootTeam = (run: LaunchedTeamRun, team: TeamDefinition | null) => ({
  address: '/',
  team_definition_id: run.input.teamDefinitionId,
  team_definition_name: team?.name ?? run.input.teamDefinitionId,
  team_run_id: run.teamRunId,
  coordinator_address: `/${team?.coordinatorMemberName ?? memberName(run.input.memberConfigs[0]?.memberAddress ?? '')}`,
  default_launch_configuration: launchConfiguration(run.input.teamConfigs.find((scope) => scope.teamAddress === '/') ?? run.input.memberConfigs[0]),
  members: run.input.memberConfigs.map((member) => ({
    kind: 'configured_agent',
    address: member.memberAddress,
    agent_definition_id: member.agentDefinitionId,
    role: null,
    description: null,
    agent_run_id: memberRunId(run, member.memberAddress),
    platform_agent_run_id: null,
    launch_configuration: launchConfiguration(member),
  })),
  collaborators: [],
  task_executions: [],
})

/**
 * Reads that describe the launched runs: their resume configs (trees) and history rows. The caller
 * supplies the Team and Agent catalogs (base fixture + the AutoByteus Org fixture).
 */
export const withLaunchedTeam = (
  operationName: string,
  variables: Record<string, unknown>,
  data: Record<string, any> | null,
  catalogs: { teams: readonly TeamDefinition[]; agents: readonly AgentDefinition[] },
): Record<string, any> | null => {
  if (!launchedRuns.length || !data) return data
  const teamOf = (run: LaunchedTeamRun) => catalogs.teams.find((entry) => entry.id === run.input.teamDefinitionId) ?? null

  if (operationName === 'GetTeamRunResumeConfig') {
    const run = launchedRuns.find((entry) => entry.teamRunId === variables.teamRunId)
    if (!run) return data
    const current = data.getTeamRunResumeConfig ?? {}
    return {
      ...data,
      getTeamRunResumeConfig: {
        ...current,
        teamRunId: run.teamRunId,
        isActive: true,
        modelConfigEditability: { editable: false, reason: null },
        executionTree: {
          ...(current.executionTree ?? {}),
          created_at: run.launchedAt,
          archived_at: null,
          application_binding: null,
          handoffs: [],
          root_team: rootTeam(run, teamOf(run)),
        },
      },
    }
  }

  // A launched member has no conversation yet.
  if (operationName === 'GetTeamMemberRunProjection' && launchedRuns.some((run) =>
    run.input.memberConfigs.some((member) => memberRunId(run, member.memberAddress) === variables.agentRunId))) {
    return { ...data, getTeamMemberRunProjection: { ...(data.getTeamMemberRunProjection ?? {}), summary: '', conversation: [], activities: [] } }
  }

  if (operationName === 'ListWorkspaceRunHistory' && Array.isArray(data.listWorkspaceRunHistory)) {
    const groups = structuredClone(data.listWorkspaceRunHistory) as Array<Record<string, any>>
    let template: Record<string, any> | null = null
    for (const group of groups) {
      for (const teamGroup of group.teamDefinitions ?? []) {
        const index = (teamGroup.runs ?? []).findIndex((run: { teamRunId?: string }) => run.teamRunId === BASE_CREATED_TEAM_RUN_ID)
        if (index >= 0) { template = teamGroup.runs[index]; teamGroup.runs.splice(index, 1) }
      }
      group.teamDefinitions = (group.teamDefinitions ?? []).filter((teamGroup: { runs?: unknown[] }) => teamGroup.runs?.length)
    }
    if (!template) return data
    const agentName = (id: string) => catalogs.agents.find((agent) => agent.id === id)?.name ?? memberName(id)
    // Oldest first, so each newer run is placed above the previous one.
    for (const run of [...launchedRuns].reverse()) {
      const team = teamOf(run)
      const tree = rootTeam(run, team)
      const workspaceRootPath = run.input.teamConfigs.find((scope) => scope.teamAddress === '/')?.workspaceRootPath ?? null
      let target = groups.find((group) => group.workspaceRootPath === workspaceRootPath)
      if (!target && workspaceRootPath) {
        target = { workspaceRootPath, workspaceName: memberName(workspaceRootPath), agentDefinitions: [], teamDefinitions: [] }
        groups.push(target)
      }
      target ??= groups[0]
      if (!target) continue
      const historyItem = {
        ...template,
        teamRunId: run.teamRunId,
        // Started just now, not at the fixture's fixed date.
        createdAt: run.launchedAt,
        lastUpdatedAt: run.launchedAt,
        teamDefinitionId: run.input.teamDefinitionId,
        teamDefinitionName: team?.name ?? run.input.teamDefinitionId,
        coordinatorAddress: tree.coordinator_address,
        rootTeam: tree,
        workspaceRootPath: workspaceRootPath ?? template.workspaceRootPath,
        members: run.input.memberConfigs.map((member) => ({
          memberName: memberName(member.memberAddress),
          displayName: agentName(member.agentDefinitionId),
          memberAddress: member.memberAddress,
          agentRunId: memberRunId(run, member.memberAddress),
          agentDefinitionId: member.agentDefinitionId,
          agentName: agentName(member.agentDefinitionId),
          status: 'IDLE',
          runtimeKind: member.runtimeKind,
          workspaceRootPath: member.workspaceRootPath,
        })),
      }
      const existing = (target.teamDefinitions ?? []).find((teamGroup: { teamDefinitionId?: string }) => teamGroup.teamDefinitionId === run.input.teamDefinitionId)
      if (existing) existing.runs = [historyItem, ...(existing.runs ?? [])]
      else target.teamDefinitions = [...(target.teamDefinitions ?? []), { teamDefinitionId: run.input.teamDefinitionId, teamDefinitionName: team?.name ?? run.input.teamDefinitionId, runs: [historyItem] }]
    }
    return { ...data, listWorkspaceRunHistory: groups }
  }
  return data
}
