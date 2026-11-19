/**
 * semantic-memory-view-554 (design, round 3): who owns memory, as the Memory page's Browse tree shows it.
 *
 * Owners form a tree: Agent Orgs hold Agent Teams and agents; Agent Teams hold agents; an agent is the leaf. A
 * team-local agent belongs to its team. A shared agent (a standalone definition) may be a member of several teams or
 * orgs, and it has one memory: every place it appears opens the same agent page. In the product the tree comes from
 * the definitions (team and org members); here it is invented and illustrative, and it matches the Memory page's
 * synthetic world (prototype/memory-search/memoryDesignFixture.ts): `member` is the member name its runs carry.
 */

export interface OwnerMember {
  agentDefinitionId: string
  name: string
  /** The member name in the team's or org's runs. */
  member: string
  /** Team-local (belongs here) or a shared, standalone agent. */
  local: boolean
}

export interface TeamOwner { id: string; name: string; members: OwnerMember[] }
export interface OrgOwner { id: string; name: string; teams: string[]; members: OwnerMember[] }

const local = (teamId: string, member: string, name: string): OwnerMember =>
  ({ agentDefinitionId: `team-local-agent:${teamId}:${member}`, name, member, local: true })

export const TEAM_OWNERS: TeamOwner[] = [
  {
    id: 'software-engineering-team', name: 'Software Engineering Team', members: [
      local('software-engineering-team', 'solution_designer', 'Solution Designer'),
      local('software-engineering-team', 'implementation_engineer', 'Implementation Engineer'),
      local('software-engineering-team', 'code_reviewer', 'Code Reviewer'),
      { agentDefinitionId: 'computer-use-operator', name: 'Computer Use Operator', member: 'computer_use_operator', local: false },
    ],
  },
  {
    id: 'team-product', name: 'Product Review Team', members: [
      local('team-product', 'reviewer', 'Reviewer'),
      { agentDefinitionId: 'agent-researcher', name: 'Research Assistant', member: 'writer', local: false },
    ],
  },
]

export const ORG_OWNERS: OrgOwner[] = [
  {
    id: 'org-launch', name: 'Launch Org', teams: ['team-product'], members: [
      { agentDefinitionId: 'agent-researcher', name: 'Research Assistant', member: 'analyst', local: false },
    ],
  },
]

/** Shared agents that have no standalone runs yet but belong in Agents (they are standalone definitions). */
export const SHARED_AGENTS_WITHOUT_RUNS = [{ agentDefinitionId: 'computer-use-operator', name: 'Computer Use Operator' }]

/** Where an agent works (its teams and orgs), for its page header and its episodes. */
export const placesOf = (agentDefinitionId: string) => [
  ...TEAM_OWNERS.flatMap(team => team.members.filter(m => m.agentDefinitionId === agentDefinitionId).map(m => ({ kind: 'team' as const, id: team.id, name: team.name, member: m.member, local: m.local }))),
  ...ORG_OWNERS.flatMap(org => org.members.filter(m => m.agentDefinitionId === agentDefinitionId).map(m => ({ kind: 'org' as const, id: org.id, name: org.name, member: m.member, local: m.local }))),
]
