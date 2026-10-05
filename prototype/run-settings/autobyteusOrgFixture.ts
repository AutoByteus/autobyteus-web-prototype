/**
 * run-settings-ui-unification: the real "AutoByteus Org" shape, so member settings can be reviewed
 * at a realistic size (3 Teams, 11 members) instead of the 2-member synthetic Org.
 *
 * Hand-written from the definition files in `autobyteus-agents` at `origin/main@d5233c3`
 * (`agent-orgs/autobyteus-org`, `agent-teams/{product,software-engineering,marketing}-team`,
 * `agents/computer-use-operator`). Only the structure and display text are copied: IDs, names,
 * member names, coordinators, ownership and a one-line description. No instructions, skills,
 * handoff text or account data. Like the source definitions, none sets a default model.
 */
import { buildTeamLocalAgentDefinitionId } from '~/utils/teamLocalDefinitionId'

type Ownership = 'SHARED' | 'TEAM_LOCAL'

const agent = (input: {
  id: string
  name: string
  description: string
  category: string
  ownershipScope: Ownership
  ownerTeamId?: string
  ownerTeamName?: string
}) => ({
  __typename: 'AgentDefinition',
  id: input.id,
  name: input.name,
  role: input.name,
  description: input.description,
  instructions: 'Illustrative design fixture: the real instructions are not copied.',
  category: input.category,
  avatarUrl: null,
  toolNames: [] as string[],
  inputProcessorNames: [] as string[],
  llmResponseProcessorNames: [] as string[],
  toolExecutionResultProcessorNames: [] as string[],
  toolInvocationPreprocessorNames: [] as string[],
  lifecycleProcessorNames: [] as string[],
  skillNames: [] as string[],
  skillScope: 'CONFIGURED',
  ownershipScope: input.ownershipScope,
  ownerOrgId: null,
  ownerTeamId: input.ownerTeamId ?? null,
  ownerTeamName: input.ownerTeamName ?? null,
  ownerApplicationId: null,
  ownerApplicationName: null,
  ownerPackageId: 'package-autobyteus-agents',
  ownerLocalApplicationId: null,
  defaultLaunchConfig: null,
})

type MemberInput = { memberName: string; localId: string; name: string; description: string } | { memberName: string; sharedId: string }

const TEAM_INPUTS: Array<{
  id: string
  name: string
  description: string
  category: string
  coordinatorMemberName: string
  members: MemberInput[]
}> = [
  {
    id: 'product-team',
    name: 'Product Team',
    description: 'Uses code-first UI/UX design to explore requirements visually and deliver approved UI/UX specifications backed by runnable UI references.',
    category: 'product-development',
    coordinatorMemberName: 'product_ui_ux_designer',
    members: [
      { memberName: 'product_ui_ux_designer', localId: 'product-ui-ux-designer', name: 'Product UI/UX Designer', description: 'Explores requirements visually or evolves product experiences into approved UI/UX specifications.' },
      { memberName: 'ui_baseline_bootstrapper', localId: 'ui-baseline-bootstrapper', name: 'UI Baseline Bootstrapper', description: 'Establishes or refreshes a browser-runnable baseline with UI parity to a selected product frontend.' },
    ],
  },
  {
    id: 'software-engineering-team',
    name: 'Software Engineering Team',
    description: 'A Solution Designer-led team that engineers approved requirements, then implements, reviews, validates and delivers the solution.',
    category: 'software-engineering',
    coordinatorMemberName: 'solution_designer',
    members: [
      { memberName: 'solution_designer', localId: 'solution-designer', name: 'solution designer', description: 'Owns investigation, requirements engineering, explicit user approval, architecture design and solution refinement.' },
      { memberName: 'architecture_reviewer', localId: 'architecture-reviewer', name: 'architecture reviewer', description: 'Reviews selected large or high-risk architecture packages before implementation.' },
      { memberName: 'implementation_engineer', localId: 'implementation-engineer', name: 'implementation engineer', description: 'Executes a completed design against approved requirements.' },
      { memberName: 'code_reviewer', localId: 'code-reviewer', name: 'code reviewer', description: 'Reviews selected large or high-risk implementation source.' },
      { memberName: 'api_e2e_engineer', localId: 'api-e2e-engineer', name: 'api e2e engineer', description: 'Owns API/E2E coverage for implementation packages.' },
      { memberName: 'delivery_engineer', localId: 'delivery-engineer', name: 'delivery engineer', description: 'Owns verified delivery, repository finalization and release work.' },
    ],
  },
  {
    id: 'marketing-team',
    name: 'Marketing Team',
    description: 'Creates channel-native marketing content with the user, publishes approved content and improves results through a build-measure-learn loop.',
    category: 'marketing-and-publishing',
    coordinatorMemberName: 'marketing_content_creator',
    members: [
      { memberName: 'marketing_content_creator', localId: 'marketing-content-creator', name: 'Marketing Content Creator', description: 'Creates channel-native marketing content with the user through a draft-feedback-approval loop.' },
      { memberName: 'marketing_performance_analyst', localId: 'marketing-performance-analyst', name: 'Marketing Performance Analyst', description: 'Measures published posts and runs the build-measure-learn loop.' },
      { memberName: 'computer_use_operator', sharedId: 'computer-use-operator' },
    ],
  },
]

export const AUTOBYTEUS_ORG_SHARED_AGENTS = [
  agent({
    id: 'computer-use-operator',
    name: 'Computer Use Operator',
    description: 'Completes user tasks on the computer through visible website UI, command-line tools and installed software.',
    category: 'computer-use',
    ownershipScope: 'SHARED',
  }),
]

export const AUTOBYTEUS_ORG_TEAM_LOCAL_AGENTS = TEAM_INPUTS.flatMap((team) => team.members
  .filter((member): member is Extract<MemberInput, { localId: string }> => 'localId' in member)
  .map((member) => agent({
    id: buildTeamLocalAgentDefinitionId(team.id, member.localId),
    name: member.name,
    description: member.description,
    category: team.category,
    ownershipScope: 'TEAM_LOCAL',
    ownerTeamId: team.id,
    ownerTeamName: team.name,
  })))

export const AUTOBYTEUS_ORG_AGENTS = [...AUTOBYTEUS_ORG_SHARED_AGENTS, ...AUTOBYTEUS_ORG_TEAM_LOCAL_AGENTS]

export const AUTOBYTEUS_ORG_TEAMS = TEAM_INPUTS.map((team) => ({
  __typename: 'AgentTeamDefinition',
  id: team.id,
  name: team.name,
  description: team.description,
  instructions: 'Illustrative design fixture: the real team instructions are not copied.',
  category: team.category,
  avatarUrl: null,
  coordinatorMemberName: team.coordinatorMemberName,
  revision: `${team.id}-design-fixture`,
  handoffs: [],
  ownershipScope: 'SHARED',
  ownerOrgId: null,
  ownerOrgName: null,
  ownerTeamId: null,
  ownerTeamName: null,
  ownerApplicationId: null,
  ownerApplicationName: null,
  ownerPackageId: 'package-autobyteus-agents',
  ownerLocalApplicationId: null,
  defaultLaunchConfig: null,
  nodes: team.members.map((member) => ({
    __typename: 'TeamMember',
    memberName: member.memberName,
    ref: 'localId' in member ? member.localId : member.sharedId,
    refScope: 'localId' in member ? 'TEAM_LOCAL' : 'SHARED',
  })),
}))

export const AUTOBYTEUS_ORG = {
  __typename: 'AgentOrgDefinition',
  id: 'autobyteus-org',
  name: 'AutoByteus Org',
  description: 'A cross-functional AutoByteus organization combining product experience, software engineering, and marketing execution through shared Teams.',
  instructions: 'Illustrative design fixture: the real Org instructions are not copied.',
  category: 'product-and-software',
  avatarUrl: null,
  revision: 'autobyteus-org-design-fixture',
  handoffs: [
    { __typename: 'AgentOrgHandoff', from: '/software_engineering_team/solution_designer', to: '/product_team/product_ui_ux_designer', rules: ['Product design requested.'] },
    { __typename: 'AgentOrgHandoff', from: '/product_team/product_ui_ux_designer', to: '/software_engineering_team/solution_designer', rules: ['Design completed, requirement impact, or blocked.'] },
    { __typename: 'AgentOrgHandoff', from: '/software_engineering_team/solution_designer', to: '/marketing_team/marketing_content_creator', rules: ['Approved package needs marketing.'] },
  ],
  members: TEAM_INPUTS.map((team) => ({
    __typename: 'AgentOrgMember',
    memberName: team.id.replace(/-/g, '_'),
    ref: team.id,
    refType: 'AGENT_TEAM',
    refScope: 'SHARED',
  })),
  defaultLaunchConfig: null,
}

const withFixture = <T extends { id: string }>(existing: readonly T[] | null | undefined, additions: readonly T[]): T[] => {
  const list = Array.isArray(existing) ? [...existing] : []
  for (const item of additions) if (!list.some((entry) => entry.id === item.id)) list.push(structuredClone(item))
  return list
}

/** Store state additions: the Org, its Teams and their agents join the captured catalog. */
export const withAutobyteusOrgDefinitions = (storeId: string, state: Record<string, any>): Record<string, any> | null => {
  if (storeId === 'agentDefinition') return { agentDefinitions: withFixture(state.agentDefinitions, AUTOBYTEUS_ORG_AGENTS as any[]) }
  if (storeId === 'agentTeamDefinition') return { agentTeamDefinitions: withFixture(state.agentTeamDefinitions, AUTOBYTEUS_ORG_TEAMS as any[]) }
  if (storeId === 'agentOrgDefinition') return { definitions: withFixture(state.definitions, [AUTOBYTEUS_ORG] as any[]) }
  return null
}

/** GraphQL read additions for the same definitions (lists and single Org references). */
export const withAutobyteusOrgOperation = (operationName: string, variables: Record<string, unknown>, data: Record<string, any> | null): Record<string, any> | null => {
  const id = typeof variables.id === 'string' ? variables.id : null
  switch (operationName) {
    case 'GetAgentDefinitions': return { ...data, agentDefinitions: withFixture(data?.agentDefinitions, AUTOBYTEUS_ORG_AGENTS as any[]) }
    case 'GetAgentTeamDefinitions': return { ...data, agentTeamDefinitions: withFixture(data?.agentTeamDefinitions, AUTOBYTEUS_ORG_TEAMS as any[]) }
    case 'GetAgentOrgDefinitions': return { ...data, agentOrgDefinitions: withFixture(data?.agentOrgDefinitions, [AUTOBYTEUS_ORG] as any[]) }
    case 'GetAgentOrgReferencedAgent':
      return data?.agentDefinition ? data : { ...data, agentDefinition: structuredClone(AUTOBYTEUS_ORG_AGENTS.find((entry) => entry.id === id) ?? null) }
    case 'GetAgentOrgReferencedTeam':
      return data?.agentTeamDefinition ? data : { ...data, agentTeamDefinition: structuredClone(AUTOBYTEUS_ORG_TEAMS.find((entry) => entry.id === id) ?? null) }
    default: return data
  }
}
