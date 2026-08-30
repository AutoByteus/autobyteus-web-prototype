export type DecisionId = "DEC-001" | "DEC-002" | "DEC-003";
export type Grammar = "rails" | "surfaces" | "hybrid";
export type MetadataMode = "always" | "responsive" | "on-demand";
export type IdentityMode = "icon-label" | "header" | "band";
export type PanelWidth = 260 | 320 | 520;
export type FontPreset = "default" | "extra-large";
export type Scenario = "collapsed" | "one" | "several" | "deep" | "selected";
export type Status = "active" | "idle" | "error" | "offline";
export type NodeKind = "agent" | "team" | "transient-team" | "transient-agent";

export interface TeamNode {
  id: string;
  name: string;
  role: string;
  kind: NodeKind;
  status: Status;
  age: string;
  children?: TeamNode[];
}

export interface TreatmentOption<T extends string> {
  id: T;
  label: string;
  summary: string;
  evidence: string;
}

export const decisions: Array<{ id: DecisionId; short: string; question: string }> = [
  {
    id: "DEC-001",
    short: "Ancestry",
    question: "Which compact hierarchy treatment makes every parent path easiest to trace?",
  },
  {
    id: "DEC-002",
    short: "Metadata",
    question: "How much status and age should remain continuously visible at narrow widths?",
  },
  {
    id: "DEC-003",
    short: "Team identity",
    question: "How should team nodes differ from runs and agents without relying on color or a small badge?",
  },
];

export const grammarOptions: TreatmentOption<Grammar>[] = [
  {
    id: "rails",
    label: "Connector rails",
    summary: "Continuous branch lines make the route from parent to child explicit.",
    evidence: "Look for immediate parent tracing when sibling teams are open together.",
  },
  {
    id: "surfaces",
    label: "Nested surfaces",
    summary: "Each expanded team owns a softly bounded descendant region.",
    evidence: "Look for subtree separation and the width cost at 260px.",
  },
  {
    id: "hybrid",
    label: "Compact hybrid",
    summary: "A restrained rail and team header work together without a full nested card.",
    evidence: "Look for whether the two cues remain clear without feeling busy.",
  },
];

export const metadataOptions: TreatmentOption<MetadataMode>[] = [
  {
    id: "always",
    label: "Always visible",
    summary: "Every row retains both status and age as a fixed trailing column.",
    evidence: "Look for whether repeated ages overpower names or squeeze long identities.",
  },
  {
    id: "responsive",
    label: "Responsive priority",
    summary: "Status stays visible; child ages yield at 260px and return from 320px upward.",
    evidence: "At 260px, focus or hover still exposes the exact age in the identity tooltip.",
  },
  {
    id: "on-demand",
    label: "Child age on demand",
    summary: "Runs and teams keep recency; agent age moves to hover/focus disclosure.",
    evidence: "Look for whether discoverability remains sufficient without a repeated age column.",
  },
];

export const identityOptions: TreatmentOption<IdentityMode>[] = [
  {
    id: "icon-label",
    label: "Icon + role label",
    summary: "Teams use a square organization glyph and visible role word; agents stay circular.",
    evidence: "Look for fast type recognition even when the name truncates.",
  },
  {
    id: "header",
    label: "Header typography",
    summary: "Team rows become compact two-level headers with role above the name.",
    evidence: "Look for whether stronger semantics justify the added row height.",
  },
  {
    id: "band",
    label: "Compact team band",
    summary: "A notched full-row band marks each team boundary; agents remain plain rows.",
    evidence: "Look for clear separation without turning every team into a heavy card.",
  },
];

export const fixture: TeamNode[] = [
  {
    id: "coordinator",
    name: "head_of_software_development",
    role: "Root coordinator · Agent",
    kind: "agent",
    status: "active",
    age: "4m",
  },
  {
    id: "release_observer",
    name: "release_observer_for_cross_platform_delivery",
    role: "Direct member · Agent",
    kind: "agent",
    status: "offline",
    age: "2d",
  },
  {
    id: "requirements",
    name: "requirements_engineering_team",
    role: "Configured nested team · Aggregate status",
    kind: "team",
    status: "active",
    age: "8m",
    children: [
      {
        id: "requirements_engineer",
        name: "requirements_engineer",
        role: "Team member · Agent",
        kind: "agent",
        status: "active",
        age: "8m",
      },
      {
        id: "research_ops",
        name: "research_operations_and_localization_assurance_team",
        role: "Configured nested team · Aggregate status",
        kind: "team",
        status: "offline",
        age: "1d",
        children: [
          {
            id: "localization_reviewer",
            name: "localization_accessibility_reviewer",
            role: "Team member · Agent",
            kind: "agent",
            status: "offline",
            age: "1d",
          },
        ],
      },
    ],
  },
  {
    id: "product_design",
    name: "product_design_and_prototyping_team",
    role: "Configured nested team · Aggregate status",
    kind: "team",
    status: "active",
    age: "11m",
    children: [
      {
        id: "product_prototyper",
        name: "product_prototyper",
        role: "Team member · Agent",
        kind: "agent",
        status: "active",
        age: "11m",
      },
      {
        id: "prototype_bootstrapper",
        name: "prototype_bootstrapper_with_current_experience_parity_focus",
        role: "Team member · Agent",
        kind: "agent",
        status: "idle",
        age: "23m",
      },
    ],
  },
  {
    id: "software_engineering",
    name: "software_engineering_team",
    role: "Configured nested team · Aggregate status",
    kind: "team",
    status: "error",
    age: "6m",
    children: [
      {
        id: "architecture_designer",
        name: "architecture_designer",
        role: "Team member · Agent",
        kind: "agent",
        status: "idle",
        age: "37m",
      },
      {
        id: "implementation_engineer",
        name: "implementation_engineer_for_workspace_navigation",
        role: "Team member · Agent",
        kind: "agent",
        status: "active",
        age: "6m",
      },
      {
        id: "runtime_quality",
        name: "runtime_quality_and_delivery_team",
        role: "Configured nested team · Aggregate status",
        kind: "team",
        status: "error",
        age: "14m",
        children: [
          {
            id: "api_e2e_engineer",
            name: "api_e2e_engineer_for_nested_team_history_regressions",
            role: "Team member · Agent",
            kind: "agent",
            status: "active",
            age: "14m",
          },
          {
            id: "code_reviewer",
            name: "code_reviewer",
            role: "Team member · Agent",
            kind: "agent",
            status: "error",
            age: "19m",
          },
          {
            id: "delivery_engineer",
            name: "delivery_engineer",
            role: "Team member · Agent",
            kind: "agent",
            status: "offline",
            age: "2h",
          },
        ],
      },
    ],
  },
  {
    id: "transient_incident",
    name: "investigate_authentication_migration_regression",
    role: "Transient task team · Aggregate status",
    kind: "transient-team",
    status: "active",
    age: "3m",
    children: [
      {
        id: "transient_investigator",
        name: "authentication_log_investigator_7",
        role: "Transient task member · Agent",
        kind: "transient-agent",
        status: "active",
        age: "3m",
      },
      {
        id: "transient_reviewer",
        name: "migration_result_reviewer_2",
        role: "Transient task member · Agent",
        kind: "transient-agent",
        status: "idle",
        age: "5m",
      },
    ],
  },
];

export const scenarioExpansions: Record<Scenario, string[]> = {
  collapsed: [],
  one: ["requirements"],
  several: ["requirements", "product_design", "software_engineering"],
  deep: ["software_engineering", "runtime_quality"],
  selected: ["requirements", "product_design", "software_engineering", "runtime_quality", "transient_incident"],
};

export const scenarioLabels: Record<Scenario, string> = {
  collapsed: "Nested teams collapsed",
  one: "One team expanded",
  several: "Several sibling teams expanded",
  deep: "Deeper team expanded",
  selected: "Selected leaf + ancestor path",
};

export const statusLabels: Record<Status, string> = {
  active: "Active",
  idle: "Idle",
  error: "Error",
  offline: "Offline",
};

const flattenNodes = (nodes: TeamNode[], parentId: string | null = null): Array<TeamNode & { parentId: string | null }> =>
  nodes.flatMap((node) => [
    { ...node, parentId },
    ...(node.children ? flattenNodes(node.children, node.id) : []),
  ]);

export const flatFixture = flattenNodes(fixture);
export const nodeById = new Map(flatFixture.map((node) => [node.id, node]));

export const ancestorsFor = (id: string | null): string[] => {
  if (!id) return [];
  const ancestors: string[] = [];
  let cursor = nodeById.get(id)?.parentId ?? null;
  while (cursor) {
    ancestors.push(cursor);
    cursor = nodeById.get(cursor)?.parentId ?? null;
  }
  return ancestors;
};

export const currentOption = <T extends string>(options: TreatmentOption<T>[], id: T) =>
  options.find((option) => option.id === id)!;
