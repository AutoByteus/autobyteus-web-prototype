export type AgentFixture = {
  id: string;
  name: string;
  role: string;
  description: string;
  instructions: string;
  initials: string;
};

export type FlatTeamFixture = {
  id: string;
  name: string;
  description: string;
  instructions: string;
  category: string;
  coordinatorId: string;
  agents: string[];
  handoffs: number;
  runs: number;
  lastRun: string;
};

export type AgentOrgMemberFixture =
  | { kind: 'agent'; ref: string }
  | { kind: 'team'; ref: string };

export type AgentOrgFixture = {
  id: string;
  name: string;
  description: string;
  category: string;
  members: AgentOrgMemberFixture[];
  handoffs: number;
  runs: number;
  lastRun: string;
};

export const agents: AgentFixture[] = [
  {
    id: 'requirements-engineer',
    name: 'requirements_engineer',
    role: 'Independent Agent',
    description: 'Owns requirements, acceptance criteria, and product-intent traceability.',
    instructions: 'Investigate the product context, preserve requirement traceability, and make acceptance decisions explicit.',
    initials: 'RE',
  },
  {
    id: 'product-prototyper',
    name: 'product_prototyper',
    role: 'Team coordinator',
    description: 'Coordinates product experience prototyping and review packages.',
    instructions: 'Evolve accepted product experiences, coordinate focused prototype work, and return precise review evidence.',
    initials: 'PP',
  },
  {
    id: 'prototype-bootstrapper',
    name: 'prototype_bootstrapper',
    role: 'Agent',
    description: 'Establishes current-experience parity in Product-owned worktrees.',
    instructions: 'Reproduce the selected current experience exactly and return runnable parity evidence to the Team coordinator.',
    initials: 'PB',
  },
  {
    id: 'architecture-designer',
    name: 'architecture_designer',
    role: 'Team coordinator',
    description: 'Creates actionable architecture designs from approved requirements.',
    instructions: 'Coordinate the engineering Team from approved requirements and route implementation and review work explicitly.',
    initials: 'AD',
  },
  {
    id: 'implementation-engineer',
    name: 'implementation_engineer',
    role: 'Agent',
    description: 'Implements approved packages and validates the scoped behavior.',
    instructions: 'Implement the approved package, preserve scoped behavior, and report validation evidence and limitations.',
    initials: 'IE',
  },
  {
    id: 'code-reviewer',
    name: 'code_reviewer',
    role: 'Agent',
    description: 'Reviews implementation source and assesses failure origin.',
    instructions: 'Review the selected implementation proportionately and identify actionable findings with evidence.',
    initials: 'CR',
  },
  {
    id: 'delivery-engineer',
    name: 'delivery_engineer',
    role: 'Agent',
    description: 'Finalizes reviewed changes and prepares delivery evidence.',
    instructions: 'Finalize validated changes and prepare a precise delivery package without expanding product scope.',
    initials: 'DE',
  },
];

export const flatTeams: FlatTeamFixture[] = [
  {
    id: 'product-design-prototyping-team',
    name: 'Product Design & Prototyping',
    description: 'Creates product-facing prototypes and preserves current-experience fidelity.',
    instructions: 'Coordinate product experience work through product_prototyper and use the Team handoffs for specialist baseline work.',
    category: 'Product',
    coordinatorId: 'product-prototyper',
    agents: ['product-prototyper', 'prototype-bootstrapper'],
    handoffs: 2,
    runs: 18,
    lastRun: '2h ago',
  },
  {
    id: 'software-engineering-team',
    name: 'Software Engineering',
    description: 'Designs, implements, reviews, validates, and delivers product changes.',
    instructions: 'Coordinate engineering work through architecture_designer and route implementation, review, validation, and delivery explicitly.',
    category: 'Engineering',
    coordinatorId: 'architecture-designer',
    agents: ['architecture-designer', 'implementation-engineer', 'code-reviewer', 'delivery-engineer'],
    handoffs: 6,
    runs: 42,
    lastRun: '31m ago',
  },
  {
    id: 'release-readiness-team',
    name: 'Release Readiness',
    description: 'Handles final product verification and delivery readiness.',
    instructions: 'Coordinate final verification and delivery preparation through delivery_engineer.',
    category: 'Operations',
    coordinatorId: 'delivery-engineer',
    agents: ['delivery-engineer', 'code-reviewer'],
    handoffs: 2,
    runs: 9,
    lastRun: 'Yesterday',
  },
];

export const agentOrgs: AgentOrgFixture[] = [
  {
    id: 'software-development-department',
    name: 'Software Development Department',
    description: 'One collaboration scope combining an independent requirements Agent with reusable Product and Engineering Teams.',
    category: 'Department',
    members: [
      { kind: 'agent', ref: 'requirements-engineer' },
      { kind: 'team', ref: 'product-design-prototyping-team' },
      { kind: 'team', ref: 'software-engineering-team' },
    ],
    handoffs: 8,
    runs: 27,
    lastRun: 'Active now',
  },
  {
    id: 'product-release-organization',
    name: 'Product Release Organization',
    description: 'A focused organization that composes existing Product and Release Teams without copying their definitions.',
    category: 'Program',
    members: [
      { kind: 'team', ref: 'product-design-prototyping-team' },
      { kind: 'team', ref: 'release-readiness-team' },
      { kind: 'agent', ref: 'requirements-engineer' },
    ],
    handoffs: 5,
    runs: 6,
    lastRun: '3d ago',
  },
];

export const agentById = (id: string): AgentFixture => (
  agents.find((agent) => agent.id === id) ?? agents[0]
);

export const teamById = (id: string): FlatTeamFixture => (
  flatTeams.find((team) => team.id === id) ?? flatTeams[0]
);

export const orgById = (id: string): AgentOrgFixture => (
  agentOrgs.find((org) => org.id === id) ?? agentOrgs[0]
);
