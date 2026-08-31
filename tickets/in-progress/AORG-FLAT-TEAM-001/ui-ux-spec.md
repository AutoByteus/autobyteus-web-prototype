# UI/UX Specification — AgentOrg And Flat AgentTeam

## Status And Approval

- Status: `Ready for User Review — Draft, non-normative`
- Ticket: `AORG-FLAT-TEAM-001`
- Prototype revision: `RV-009`
- Requirements authority: approved `RER-012`, commit `658d602a1`
- Explicit final approval: `Pending`
- Normative `VIS-*` references: `Pending approval`

This specification describes the runnable review candidate. It becomes a
requirements-defining supplement only after explicit user approval and final
validation of the approved state.

## Provenance

- Source frontend: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web`
- Source pin: `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Prototype repository: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001`
- Ticket branch: `prototype/aorg-flat-team-001`
- Accepted prototype base: `5561e3ac593a210ab7b3b8621c5daea31f95f08e`
- Runnable candidate commit: `c3221cf3faa6b7c6abab0b4c555b6b88f547cfd1`
- Review URL: `http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-detail&id=software-development-department`

## Experience Goal

The operator can distinguish and use:

1. an independently runnable AgentTeam containing direct Agents and exactly one direct Agent coordinator;
2. a coordinator-free AgentOrg containing direct Agents and references to reusable AgentTeams;
3. one explicit AgentOrg launch entry, with Team entry resolving through that Team's coordinator; and
4. shared runtime/history where Org and standalone-Team roots are distinct and Task Agent/Task Team rows remain runtime lineage.

The new behavior must look like a precise evolution of the accepted AutoByteus
product, not a separate concept demo.

## Requirements Coverage

| IDs | Candidate obligation |
| --- | --- |
| `REQ-001`, `AC-001` | Team authoring exposes direct Agents only and exactly one checked direct Agent coordinator |
| `REQ-002`, `REQ-003` | Org authoring exposes direct Agents and direct reusable Team references with no coordinator control |
| `REQ-004`, `AC-002` | Org launch requires an exact Agent or Team entry and never uses an implicit fallback |
| `REQ-006`, `REQ-019`–`REQ-023`, `AC-003`, `AC-014`–`AC-018` | Handoffs expose eligible From/To endpoints, ordered When guidance, full CRUD/reorder/cancel, definition validation, atomic save, ownership separation, and stale-member resolution |
| `REQ-011`, `AC-007` | Referenced Team remains independently launchable and retains its identity/history |
| `REQ-016`, `AC-011` | Runtime/history distinguishes Org and standalone-Team roots while Task identities remain runtime lineage |
| `REQ-018`, `AC-013` | Referenced Team remains the same Team identity without copied variants |

## Visual System

- Preserve the accepted shell, navigation, neutral page canvas, white cards, slate borders, compact system typography, icon language, radii, and restrained shadows.
- Use the accepted blue for primary actions and interactive Team/Org accents. AgentOrg does not introduce a purple sub-brand.
- Keep navigation as page context; catalog pages use a screen-reader heading rather than repeating a large visible title.
- Remove explanatory or categorical copy when location and structure already communicate it: no reusable eyebrow, per-card type badge, no-coordinator badge, direct-composition explainer, same-definition sentence, or Team-to-Org promotion.
- Do not display fabricated or unavailable AgentOrg summary data. AgentOrg detail Description contains description only; catalog/detail do not add Runs, Last run, or aggregate Handoff summary chrome.
- Desktop cards use 16–24px internal spacing, 12–16px radii, 1px slate borders, and restrained shadows. At 390px, cards stack without document-level horizontal overflow.

## Surface Specification

| Surface | Required structure and behavior |
| --- | --- |
| Team catalog | Accepted search/Reload/Create toolbar, Featured/All grouping, initials/category, Agent chips, baseline actions; no repeated Team/reusable labels |
| Team create/edit | Accepted Basics/library/canvas/member-details hierarchy; real drag/drop and click-to-add; selected canvas member with editable Member Name, Type, Source, Scope, and Coordinator; Agent rows only; exactly one coordinator in a valid definition; functional Team-owned handoff authoring |
| Team detail | Header, Description, Instructions, Handoffs, members, Run/Edit; member `View ↗` opens accepted Agent detail and Back returns to the same Team; no AgentOrg promotion |
| Org catalog | Same toolbar/card/action language as Teams; direct Agent and Team chips; no visible title/type/composition/coordinator/run-summary chrome |
| Org create/edit | Blank Name and Description; no Category; one **Add member** action opens an in-flow searchable Agent/Team tabbed chooser; member groups, Handoffs, Save/Cancel; no coordinator field and no member-picker overlay |
| Org detail | Compact header, Description, Members, Handoffs; Team member card names its coordinator and opens Team detail; no duplicate description or aggregate summary facts |
| Org launch | Starts empty and disabled; exact Agent or Team selection enables Start; Team choice states the coordinator used for entry |
| Shared runtime/history | Exact entry first opens the accepted Team or Agent run configuration. Run then opens the accepted Team or Agent Workspace. The left history separates AgentOrg roots from standalone Team roots; accepted Task Agent/Task Team rows remain nested under the entered Team execution and are selectable |

## Handoff Detail

One visible card represents one ordered Handoff:

- `From`: source Agent label and exact rooted address.
- `To`: eligible Agent or Team label and exact rooted address.
- `When`: one or more ordered natural-language guidance statements.

The card deliberately omits aggregate header counts, `Handoff` type labels,
endpoint type badges, per-card condition counts, and a repeated `Via
coordinator` block. A referenced Team's coordinator remains visible on the
adjacent Team member card and inspectable through Team detail. The handoff card
therefore remains a concise From → To → When record.

## Team Builder Preservation

- Create opens with an empty Team Canvas and empty Member Details, matching the accepted product.
- Each Agent Library row is a real HTML drag source and also has a click-to-add fallback.
- Team Canvas is a real drop target with visible drag-over feedback. Dropping or clicking creates a selected Agent placement and automatically assigns the first Agent as coordinator.
- Adding the same Agent again creates a unique placement name rather than silently ignoring the action.
- Selecting a canvas card drives Member Details. Member Name is editable; Type is Agent; Source identifies the Agent definition; Scope is visible; Coordinator is a real switch.
- Renaming a placement updates the canvas and endpoint options. Any Handoff still using the old address remains visible as unavailable and blocks atomic save.
- Removing the coordinator leaves the definition invalid until another direct Agent is explicitly assigned; it does not silently choose a replacement.
- The one intentional delta from the accepted builder is structural absence of the Team library/group and Team member badge. No Team can be dragged or added into a Team.

## Handoff Authoring

- **Add handoff** opens one inline editor; Save is blocked while the editor remains unapplied.
- `From` options include every configured Agent placement in scope. Org From excludes Teams; Team-local From includes direct Team Agents only.
- Org `To` options include direct Agents, Agents inside referenced Teams, and direct referenced Teams. Team-local To includes direct Team Agents only.
- `When` is a list of trimmed natural-language guidance textareas. The operator can add, delete, and reorder conditions.
- Apply updates the in-page definition draft. Cancel discards the open edit.
- Existing handoffs can be edited, deleted, and reordered.
- Duplicate effective From/To pairs and self-resolving delivery are rejected inline.
- Removing a member leaves the affected Handoff visible as unavailable and blocks the atomic definition save. No silent deletion or retargeting occurs.
- Successful save returns one clear local-prototype success message. Backend persistence remains mocked.
- Org surfaces change Org-owned Handoffs only. Team-local Handoffs remain owned and edited on the Team surface.

## Key Transitions

| Transition | Immediate feedback | Result |
| --- | --- | --- |
| Add/Edit Handoff | Inline editor opens | From, To, and ordered When become editable |
| Apply Handoff | Inline validation or concise success | Definition draft updates without saving the full Org/Team |
| Cancel Handoff | Editor closes | Unapplied values are discarded |
| Reorder Handoff/When | Item moves immediately | Ordered draft is visible |
| Remove referenced member | Endpoint becomes unavailable on affected cards | Full save is blocked until explicit resolution |
| Save definition | Full validation | One atomic local save success or understandable failure |
| Select Team coordinator | Selected Agent's switch becomes enabled and any previous coordinator switch clears | Exactly one direct Team Agent is coordinator |
| Open Org launch | Start disabled | No implicit destination |
| Select exact Team entry | Selection highlight and coordinator summary | Start enabled |
| Start exact Team/Agent entry | Accepted run-configuration form opens with no active run | Workspace selection is required before Run Team/Run Agent |
| Run configured entry | URL phase and history update | Accepted Team/Agent Workspace opens; no custom Org dashboard |
| Expand/select task child | Disclosure and selection update | Runtime-only lineage focuses the accepted conversation |

## Accessibility And Content

- Buttons, radios, selects, textareas, disclosure controls, and modal controls are keyboard reachable with visible focus.
- Edit controls have action-specific accessible names; reorder buttons announce the affected Handoff or When position.
- Validation appears adjacent to the field and in a collection summary when saving a stale definition.
- Color is never the sole state signal.
- Exact addresses use secondary monospace text and wrap rather than overflow.
- `When` guidance is descriptive natural language, not executable policy, scheduling, authorization, or automatic evaluation.

## Mock Boundaries

| Boundary | Real in prototype | Mocked production capability |
| --- | --- | --- |
| Definition authoring | Form interactions, eligibility, validation, CRUD, reorder, cancel, save feedback | API, durable persistence, permissions, concurrency |
| Launch | Exact selection, configuration-first transition, workspace-required feedback, and configured runtime transition | Run service and orchestration |
| Runtime/history | Accepted Agent/Team Workspace, root selection, Files tree, disclosure, and child focus | Streams, storage, restore, stop lifecycle |
| Referential integrity | Stale endpoint visibility and blocked save | Server-side transactions and migration |

Fixture names, handoff text, run IDs, statuses, and timestamps are illustrative.
The visible structure and behavior remain unapproved until confirmation.

## Non-Normative Review Evidence

All captures are under `review-evidence/rv-009/` and remain non-normative:

| Review ID | Surface/state |
| --- | --- |
| `REV-AORG-RV9-001`–`002` | Baseline-native Team catalog and precise Agent-only builder |
| `REV-AORG-RV9-003`–`005` | Clean AgentOrg catalog, in-flow authoring, and detail |
| `REV-AORG-RV9-006` | Exact Team launch entry with coordinator identity |
| `REV-AORG-RV9-007` | Exact Team entry on the accepted Team run-configuration surface |
| `REV-AORG-RV9-008` | Accepted Team Workspace with AgentOrg history, Files tree, Task Agent, and Task Team lineage |
| `REV-AORG-RV9-009`–`011` | Team detail, members, and preserved Agent detail |
| `REV-AORG-RV9-012`–`015` | Team-local and Org-owned Handoff detail/authoring |
| `REV-AORG-RV9-016` | Narrow Team builder |
| `REV-AORG-RV9-017` | Narrow in-flow AgentOrg member picker |

The accepted Bootstrapper parity evidence remains under the canonical
`evidence/AORG-FLAT-TEAM-001/baseline-correction*` roots. Final `VIS-*`
references are captured only after explicit approval.

## Review Questions

1. Does the Team builder preserve the product precisely while removing only Team-in-Team membership?
2. Is AgentOrg authoring clear with blank Name/Description and one in-flow **Add member** chooser for Agents and Teams?
3. Are AgentOrg detail and Handoffs clean enough: Description, Members, and From/To/When without redundant or fabricated facts?
4. Does exact-entry launch correctly lead through the accepted Team/Agent configuration before the accepted runtime?
5. Does shared history distinguish Org versus standalone-Team roots while keeping Task Agent/Task Team lineage truthful?

## Consistency Check

- Corrected baseline accepted: `Yes`
- Requirements authority: `RER-012`
- RV-009 browser validation: `55/55 pass`, zero runtime errors
- Desktop and narrow validation: `Yes`
- Explicit final approval: `No — pending`
- Normative final references: `No — correctly pending approval`
