import { agentById, flatTeams, teamById } from '~/prototype/aorg-flat-team-fixtures';

export type HandoffEndpointKind = 'agent' | 'team';

export type HandoffEndpointOption = {
  id: string;
  kind: HandoffEndpointKind;
  label: string;
  address: string;
  group: string;
  coordinatorLabel?: string;
  coordinatorAddress?: string;
};

export type PrototypeHandoff = {
  id: string;
  fromAddress: string;
  toAddress: string;
  when: string[];
};

export type TeamAgentPlacement = {
  placementId: string;
  agentId: string;
  memberName: string;
};

const orgHandoffs: Record<string, PrototypeHandoff[]> = {
  'software-development-department': [
    {
      id: 'org-requirements-to-product',
      fromAddress: '/requirements_engineer',
      toAddress: '/product_design_prototyping_team',
      when: [
        'Requirements and acceptance criteria are ready for product experience design.',
        'Prototype clarification is needed before architecture proceeds.',
      ],
    },
    {
      id: 'org-product-to-engineering',
      fromAddress: '/product_design_prototyping_team/product_prototyper',
      toAddress: '/software_engineering_team',
      when: [
        'The prototype is explicitly approved and ready for implementation planning.',
      ],
    },
  ],
  'product-release-organization': [
    {
      id: 'org-product-to-release',
      fromAddress: '/product_design_prototyping_team/product_prototyper',
      toAddress: '/release_readiness_team',
      when: ['Approved product work is ready for release-readiness verification.'],
    },
  ],
};

const teamHandoffs: Record<string, PrototypeHandoff[]> = {
  'product-design-prototyping-team': [
    {
      id: 'team-product-to-bootstrap',
      fromAddress: '/product_prototyper',
      toAddress: '/prototype_bootstrapper',
      when: [
        'An accepted current-experience baseline is missing.',
        'A named baseline gap requires correction.',
      ],
    },
    {
      id: 'team-bootstrap-to-product',
      fromAddress: '/prototype_bootstrapper',
      toAddress: '/product_prototyper',
      when: ['The baseline candidate and comparison evidence are ready for Product review.'],
    },
  ],
  'software-engineering-team': [
    {
      id: 'team-architecture-to-implementation',
      fromAddress: '/architecture_designer',
      toAddress: '/implementation_engineer',
      when: ['The approved architecture package is ready for implementation.'],
    },
    {
      id: 'team-implementation-to-review',
      fromAddress: '/implementation_engineer',
      toAddress: '/code_reviewer',
      when: ['Implementation and scoped validation are complete.'],
    },
  ],
  'release-readiness-team': [
    {
      id: 'team-delivery-to-review',
      fromAddress: '/delivery_engineer',
      toAddress: '/code_reviewer',
      when: ['Final delivery evidence needs an independent readiness check.'],
    },
  ],
};

export const cloneHandoffs = (handoffs: PrototypeHandoff[]): PrototypeHandoff[] => (
  handoffs.map((handoff) => ({ ...handoff, when: [...handoff.when] }))
);

export const orgHandoffsFor = (orgId: string): PrototypeHandoff[] => (
  cloneHandoffs(orgHandoffs[orgId] ?? [])
);

export const teamHandoffsFor = (teamId: string): PrototypeHandoff[] => (
  cloneHandoffs(teamHandoffs[teamId] ?? [])
);

const orgAgentEndpoint = (agentId: string): HandoffEndpointOption => {
  const agent = agentById(agentId);
  return {
    id: `org-agent:${agentId}`,
    kind: 'agent',
    label: agent.name,
    address: `/${agent.name}`,
    group: 'Direct Agents',
  };
};

const mountedTeamAgentEndpoint = (teamId: string, agentId: string): HandoffEndpointOption => {
  const team = teamById(teamId);
  const agent = agentById(agentId);
  return {
    id: `team-agent:${teamId}:${agentId}`,
    kind: 'agent',
    label: agent.name,
    address: `/${team.id.replaceAll('-', '_')}/${agent.name}`,
    group: `${team.name} · Agents`,
  };
};

const teamEndpoint = (teamId: string): HandoffEndpointOption => {
  const team = teamById(teamId);
  const coordinator = agentById(team.coordinatorId);
  const teamAddress = `/${team.id.replaceAll('-', '_')}`;
  return {
    id: `team:${teamId}`,
    kind: 'team',
    label: team.name,
    address: teamAddress,
    group: 'Teams',
    coordinatorLabel: coordinator.name,
    coordinatorAddress: `${teamAddress}/${coordinator.name}`,
  };
};

export const buildOrgHandoffOptions = (agentIds: string[], teamIds: string[]): {
  from: HandoffEndpointOption[];
  to: HandoffEndpointOption[];
} => {
  const directAgents = agentIds.map(orgAgentEndpoint);
  const mountedAgents = teamIds.flatMap((teamId) => teamById(teamId).agents.map((agentId) => mountedTeamAgentEndpoint(teamId, agentId)));
  return {
    from: [...directAgents, ...mountedAgents],
    to: [...directAgents, ...teamIds.map(teamEndpoint), ...mountedAgents],
  };
};

export const buildTeamHandoffOptions = (agentIds: string[]): {
  from: HandoffEndpointOption[];
  to: HandoffEndpointOption[];
} => {
  const options = agentIds.map((agentId) => {
    const agent = agentById(agentId);
    return {
      id: `team-local-agent:${agentId}`,
      kind: 'agent' as const,
      label: agent.name,
      address: `/${agent.name}`,
      group: 'Team Agents',
    };
  });
  return { from: options, to: options };
};

export const buildTeamHandoffOptionsFromPlacements = (placements: TeamAgentPlacement[]): {
  from: HandoffEndpointOption[];
  to: HandoffEndpointOption[];
} => {
  const options = placements.map((placement) => ({
    id: `team-local-agent:${placement.placementId}`,
    kind: 'agent' as const,
    label: placement.memberName,
    address: `/${placement.memberName}`,
    group: 'Team Agents',
  }));
  return { from: options, to: options };
};

export const allTeamIds = (): string[] => flatTeams.map((team) => team.id);
