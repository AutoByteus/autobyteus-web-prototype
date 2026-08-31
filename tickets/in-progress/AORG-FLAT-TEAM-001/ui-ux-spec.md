# UI/UX Specification — AgentOrg And Flat AgentTeam

## Status And Approval

- Status: `Awaiting User Review — draft and non-normative`
- Ticket: `AORG-FLAT-TEAM-001`
- Prototype revision: `RV-010`
- Requirements authority: approved `RER-013`, commit `86df311c4`
- Runnable candidate commit: `e0a45e4cfcb14bb489438e89f4bc5856b2ea3714`
- Explicit final approval: `Pending`
- Normative `VIS-*` references: `Pending approval`

This specification describes the runnable review candidate. It becomes a
requirements-defining UI/UX supplement only after explicit user approval and
final validation. All current `REV-*` screenshots are non-normative review
evidence.

## Provenance

- Source frontend: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web`
- Source pin: `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Prototype repository: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001`
- Ticket branch: `prototype/aorg-flat-team-001`
- Accepted prototype base: `5561e3ac593a210ab7b3b8621c5daea31f95f08e`
- Configuration URL: `http://127.0.0.1:4194/workspace?prototypeReview=agent-org-flat&root=org&org=software-development-department&phase=config`

## Experience Goal

The operator can:

1. author and run an independent AgentTeam containing direct Agents and exactly one direct Agent coordinator;
2. author a coordinator-free AgentOrg containing direct Agents and references to reusable AgentTeams;
3. configure and launch the complete AgentOrg scope without choosing a communication recipient first;
4. focus an exact mounted Agent or direct Team from the active workspace sidebar when communication is required; and
5. read Org roots, standalone-Team roots, mounted members, and task-scoped runtime lineage without a recursive configured-Team mental model.

The experience is a focused evolution of the accepted AutoByteus product, not a
separate concept application.

## Requirements Coverage

| IDs | RV-010 obligation |
| --- | --- |
| `REQ-001`, `AC-001` | Team authoring exposes direct Agents only and exactly one direct Agent coordinator |
| `REQ-002`, `REQ-003` | Org authoring exposes direct Agents and direct reusable Team references with no coordinator control |
| `REQ-004`, `REQ-019`, `REQ-024`, `AC-002`, `AC-014`, `AC-019` | Org Run enters one configuration; launch activates the full scope unfocused; exact focus is required only for a recipient-requiring interaction; no fallback |
| `REQ-006`, `REQ-019`–`REQ-023`, `AC-003`, `AC-014`–`AC-018` | Handoffs expose eligible From/To endpoints, ordered When, CRUD/reorder/cancel, validation, atomic save, ownership separation, and stale-member resolution |
| `REQ-011`, `AC-007` | Referenced Team remains independently launchable and retains identity/defaults/history |
| `REQ-016`, `AC-011` | Runtime/history distinguishes Org and standalone-Team roots while Task identities remain runtime lineage |
| `REQ-018`, `AC-013` | Referenced Team remains the same Team identity without copied variants |

## Visual System

- Preserve the accepted shell, navigation, neutral page canvas, white surfaces, slate borders, compact typography, icon language, radii, restrained shadows, and blue/indigo primary-action treatment.
- AgentOrg does not introduce a purple sub-brand or custom runtime dashboard.
- Navigation supplies page context; catalog pages avoid repeating a large visible Agent Teams/Agent Orgs title.
- Omit copy that merely repeats structure or architecture: no reusable eyebrow, per-card type badge, no-coordinator badge, direct-composition explainer, same-definition sentence, or Team-to-Org promotion.
- Do not show unavailable/fabricated Org summary data such as Last run, Runs, or redundant member/Handoff count strips.
- Desktop uses the accepted three-panel Workspace. Narrow `390×844` layouts use the accepted collapsed navigation and responsive panel behavior without overlays or document-level horizontal overflow.

## Surface Specification

| Surface | Required structure and behavior |
| --- | --- |
| Team catalog | Accepted search/Reload/Create toolbar, Featured/All grouping, initials/category, Agent chips, and baseline actions; no repeated Team/reusable labels |
| Team create/edit | Accepted Basics/library/canvas/member-details hierarchy; real HTML drag/drop and click fallback; Agent-only members; editable placement detail; exactly one coordinator in a valid definition; Team-owned Handoff authoring |
| Team detail | Header, Description, Instructions, Handoffs, members, Run/Edit; member `View ↗` opens Agent detail; no AgentOrg promotion |
| Org catalog | Baseline toolbar/card/action language; direct Agent and Team chips; no visible title/type/composition/coordinator/run-summary chrome |
| Org create/edit | Name and Description only; no Category; one **Add member** action expands an in-flow searchable Agent/Team chooser; no modal/overlay; members, Handoffs, Save/Cancel |
| Org detail | Header, Description, Members, Handoffs; Team member names its coordinator and opens Team detail; no duplicated description or aggregate/fabricated facts |
| Org configuration | Run opens directly here. Show Agent Org definition, Runtime, Default LLM Model, Workspace Directory, Auto approve tools, collapsed Member overrides, and Run Agent Org. Do not show a communication-recipient selector. |
| Active Org workspace | Show the complete mounted scope in the left sidebar. Start with no selected member. Center only prompts **Choose an Agent or Team**. Selecting a member reuses the accepted Agent or Team workspace. |
| Shared runtime/history | Distinguish the AgentOrg definition/run from standalone Team definitions; direct Agents and referenced Teams are siblings in the Org execution; Team Agents are children of their Team placement; Task Agent/Task Team rows are runtime lineage under the owning Team execution. |

## AgentOrg Configuration And Launch

### Root Configuration

- **Agent Org** is read-only and identifies the definition being launched.
- **Runtime**, **Default LLM Model**, **Workspace Directory**, and **Auto approve tools** follow the accepted Team configuration control language and spacing.
- Workspace is required before Run Agent Org becomes available. The blocked state gives one adjacent, actionable message.
- Configuration controls how the full mounted Org scope runs. It does not choose or imply a communication recipient.

### Placement Overrides

- **Member overrides** is collapsed by default and has no count badge.
- When expanded, direct Org Agents and referenced Teams are top-level rows; exact Agents inside a referenced Team are indented child rows.
- Each row shows the readable name and exact placement address. Team rows also show their coordinator as inspectable secondary identity.
- A Team placement override applies within that mounted Team unless an exact Agent placement override is present.
- An exact Agent placement override is the most specific configuration.
- A visible `Custom` state appears only on a placement that actually has an override.
- Editing Org-run configuration never mutates the referenced Agent or Team definition or its standalone defaults.

### Launch And Focus

1. Selecting **Run** from AgentOrg detail navigates directly to Org configuration.
2. Selecting **Run Agent Org** after complete validation activates all configured Agent and Team placements in one Org execution scope.
3. No Agent/Team is initially focused. Launch, inspection, history, and other non-recipient navigation remain usable.
4. The center shows only the minimal next action: choose an Agent or Team from the active AgentOrg in the sidebar.
5. Selecting a direct Agent focuses that exact mounted Agent.
6. Selecting a direct Team opens the Team workspace through its exact direct Agent coordinator.
7. Selecting an Agent under a Team focuses that exact mounted Team Agent.
8. There is no Org coordinator, automatic first member, name-based selection, or implicit fallback.

## Handoff Detail And Authoring

One visible card represents one ordered Handoff:

- **From**: one eligible source Agent and its exact rooted address.
- **To**: one eligible Agent or direct Team and its exact rooted address.
- **When**: one or more ordered, trimmed natural-language guidance statements.

The card omits aggregate counts, type labels, endpoint badges, per-card condition
counts, and repeated `Via coordinator` copy. A Team destination's coordinator is
inspectable through the adjacent Team member and Team detail.

- Add/Edit opens one inline editor; Cancel discards the unapplied draft.
- From/To options respect Org or Team-local ownership and eligibility.
- When conditions can be added, deleted, and reordered.
- Existing Handoffs can be edited, deleted, and reordered.
- Duplicate effective From/To pairs and self-resolving delivery are rejected.
- Removing or renaming an endpoint leaves the affected Handoff visible as unavailable and blocks full save until explicitly resolved.
- Save validates the complete definition and returns one clear atomic local-prototype success/failure result.

## Key Transitions

| Transition | Immediate feedback | Result |
| --- | --- | --- |
| AgentOrg detail → Run | Direct navigation | One Org configuration surface opens; no entry selector |
| Expand Member overrides | Mounted scope tree appears | Team and exact Agent placement configuration is inspectable/editable |
| Run with missing Workspace | Adjacent blocked message | No execution starts |
| Run valid Org configuration | Route and history update | Full mounted scope becomes active with no initial focus |
| Select direct Agent | Sidebar selection and workspace header update | Exact Agent conversation becomes active |
| Select direct Team | Sidebar selection and Team workspace update | Team coordinator becomes the communication focus |
| Select Team Agent | Nested member selection updates | Exact mounted Agent becomes Team focus |
| Add/Edit Handoff | Inline editor opens | From, To, and ordered When become editable |
| Remove referenced endpoint | Affected Handoff remains unavailable | Full save is blocked until explicit resolution |

## Responsive And Accessibility

- No AgentOrg member picker or configuration control uses a modal overlay.
- At `390×844`, labels, fields, switch, overrides disclosure, and Run action remain readable and reachable without horizontal overflow.
- Buttons, switches, selects, disclosure controls, inputs, textareas, and reorder controls are keyboard reachable with visible focus.
- Exact addresses wrap or truncate safely and remain inspectable; color is not the sole state signal.
- Validation appears adjacent to the blocked action/field and uses concise actionable wording.

## Mock Boundaries

| Boundary | Real in prototype | Mocked production capability |
| --- | --- | --- |
| Definition authoring | Form interactions, eligibility, validation, CRUD/reorder/cancel, save feedback | API, durable persistence, permissions, concurrency |
| Org configuration | Root controls, mounted placement hierarchy, Team/Agent override editing, workspace-required validation | Runtime catalog/service, persistence, orchestration |
| Launch | Direct configuration transition and full-scope active state | Actual Agent/Team process creation and stop lifecycle |
| Runtime/focus | Unfocused state, exact sidebar selection, accepted Agent/Team workspace, Files tree, task lineage | Streams, storage, restore, model/tool execution |
| Referential integrity | Stale endpoint visibility and blocked save | Server-side transactions and migrations |

Fixture names, messages, run IDs, status, file content, and timestamps are
illustrative. The visible interaction model and layout remain unapproved until
explicit user confirmation.

## Non-Normative Review Evidence

All captures are under `review-evidence/rv-010/`; the manifest is
`review-evidence/rv-010/capture-manifest.json`.

| Review ID | Surface/state |
| --- | --- |
| `REV-AORG-RV10-001`–`002`, `018`–`019`, `011`–`013`, `016` | Preserved flat AgentTeam catalog, builder, detail/members, Agent detail, Team-local Handoffs, and narrow builder |
| `REV-AORG-RV10-003`–`005`, `014`–`015`, `020` | AgentOrg catalog, authoring, detail, clean Handoffs, Handoff editor, and narrow in-flow member picker |
| `REV-AORG-RV10-006` | AgentOrg Run opens configuration directly |
| `REV-AORG-RV10-007` | Mounted Team/Agent placement override hierarchy |
| `REV-AORG-RV10-008` | Full AgentOrg scope active with no initial focus |
| `REV-AORG-RV10-009` | Exact direct Agent focus from the sidebar |
| `REV-AORG-RV10-010` | Direct Team focus through its coordinator |
| `REV-AORG-RV10-017` | Narrow AgentOrg configuration without overlay |

Final `VIS-*` references are captured only after explicit approval and final
validation.

## Review Questions

1. Does AgentOrg Run now enter the correct single configuration surface without a pre-launch member selector?
2. Is the Member overrides hierarchy clear and restrained enough while showing the Org → Team → exact Agent configuration precedence?
3. After launch, is the unfocused full scope understandable, and do direct Agent/Team sidebar selections behave as expected?
4. Does Team selection correctly enter through the Team coordinator without implying an Org coordinator or fallback?
5. Do the Team, Org authoring, Handoff, task-lineage, Files, and narrow responsive surfaces preserve the accepted product precisely?

## Consistency Check

- Corrected baseline accepted: `Yes`
- Requirements authority: `RER-013`
- RV-010 browser validation: `56/56 pass`, `20` captures, zero runtime errors
- Typecheck/lint/tests/boundaries/build: `Pass`
- Desktop and narrow validation: `Yes`
- Explicit final approval: `No — pending`
- Normative final references: `No — correctly pending approval`
