# UI/UX Specification — AgentOrg And Flat AgentTeam

## Status And Approval

- Status: `Ready for User Review — Draft, non-normative`
- Ticket: `AORG-FLAT-TEAM-001`
- Prototype revision: `RV-007`
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
- Accepted prototype base: `893cde9dbcc5ccc8904cf08ba6b031668dff0041`
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
| Team create/edit | Accepted Basics/library/canvas/member-details hierarchy; Agent rows only; one coordinator radio; functional Team-owned handoff authoring |
| Team detail | Header, Description, Instructions, Handoffs, members, Run/Edit; member `View ↗` opens accepted Agent detail and Back returns to the same Team; no AgentOrg promotion |
| Org catalog | Same toolbar/card/action language as Teams; direct Agent and Team chips; no visible title/type/composition/coordinator/run-summary chrome |
| Org create/edit | Basics, separate Agent/Team member groups, Handoffs, Save/Cancel; no coordinator field |
| Org detail | Compact header, Description, Members, Handoffs; Team member card names its coordinator and opens Team detail; no duplicate description or aggregate summary facts |
| Org launch | Starts empty and disabled; exact Agent or Team selection enables Start; Team choice states the coordinator used for entry |
| Shared runtime/history | Typed Org/Team roots, exact entry, configured snapshot, accepted Task rows, disclosure, and selectable task child |

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
| Select Team coordinator | Radio becomes checked | Exactly one direct Team Agent is coordinator |
| Open Org launch | Start disabled | No implicit destination |
| Select exact Team entry | Selection highlight and coordinator summary | Start enabled |
| Expand/select task child | Disclosure and selection update | Runtime-only lineage is inspectable |

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
| Launch | Exact selection and navigated result | Run service and orchestration |
| Runtime/history | Root selection, disclosure, child focus | Streams, storage, restore, stop lifecycle |
| Referential integrity | Stale endpoint visibility and blocked save | Server-side transactions and migration |

Fixture names, handoff text, run IDs, statuses, and timestamps are illustrative.
The visible structure and behavior remain unapproved until confirmation.

## Non-Normative Review Evidence

All captures are under `review-evidence/rv-007/`:

| Review ID | Surface/state |
| --- | --- |
| `REV-AORG-001` | Baseline-native Team catalog |
| `REV-AORG-002` | Team authoring |
| `REV-AORG-003` | Clean AgentOrg catalog |
| `REV-AORG-004` | AgentOrg create |
| `REV-AORG-005` | Clean AgentOrg detail |
| `REV-AORG-006` | Exact Team launch entry |
| `REV-AORG-007` | AgentOrg runtime/history |
| `REV-AORG-008` | Standalone Team runtime/history |
| `REV-AORG-009`–`011` | Team detail, member actions, Agent detail |
| `REV-AORG-012` | Team-local From/To/When detail |
| `REV-AORG-013` | Team-local handoff editor |
| `REV-AORG-014` | AgentOrg From/To/When detail without redundant counts or coordinator-delivery copy |
| `REV-AORG-015` | Functional AgentOrg handoff authoring and save feedback |

## Review Questions

1. Is the AgentOrg detail now clean enough: Description only, simple Members, and Handoffs reduced to From, To, and When?
2. Does the functional Add/Edit/Delete/Reorder/Cancel/Save flow feel production-ready without unnecessary explanation?
3. Do Team and Org surfaces remain visually consistent while staying conceptually separate?
4. Is exact-entry launch and runtime/history clear enough for final approval?

## Consistency Check

- Corrected baseline accepted: `Yes`
- Requirements authority: `RER-012`
- RV-007 browser validation: `44/44 pass`, zero runtime errors
- Desktop and narrow validation: `Yes`
- Explicit final approval: `No — pending`
- Normative final references: `No — correctly pending approval`
