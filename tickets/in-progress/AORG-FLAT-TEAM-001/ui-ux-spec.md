# UI/UX Specification — AgentOrg And Flat AgentTeam

## Status And User Confirmation

- Status: `Ready for User Review — Draft, non-normative`
- Ticket: `AORG-FLAT-TEAM-001`
- Requirements revision: `RER-010`
- Related IDs: `BEH-001`, `BEH-004`, `BEH-006`; `REQ-001`–`REQ-004`, `REQ-011`, `REQ-016`, `REQ-018`, `REQ-019`; `AC-001`, `AC-002`, `AC-007`, `AC-011`, `AC-013`, `AC-014`; `SCN-001`, `SCN-002`, `SCN-006`, `SCN-007`.
- Review URL: `http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-list`
- Explicit user approval: `Pending`
- Final validation and normative `VIS-*` references: `Pending approval`

This draft describes the candidate currently under review. It does not become a
requirements-defining supplement until the user explicitly approves it and the
final references are captured from the validated approved revision.

## Repository And Baseline Provenance

- Source repository: `/home/autobyteus/workspace/autobyteus-workspace`
- Selected frontend: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web`
- Source pin: `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Prototype repository: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001`
- Ticket branch: `prototype/aorg-flat-team-001`
- Accepted prototype base: `893cde9dbcc5ccc8904cf08ba6b031668dff0041`
- Review candidate revision: `RV-004` at `8022a0d6c9adeb3fcb913b910a8f001e1c8bb50f`
- Bootstrap correction report: `/home/autobyteus/workspace/autobyteus-web-prototype/prototype-bootstrap-report.md`
- Baseline acceptance: `/home/autobyteus/workspace/autobyteus-web-prototype/evidence/AORG-FLAT-TEAM-001/baseline-correction/product-acceptance/product-acceptance.md`

## Scope And Experience Goal

An operator can distinguish and use:

1. a reusable, independently runnable AgentTeam containing direct Agents and exactly one direct Agent coordinator;
2. a coordinator-free AgentOrg containing direct independent Agents and references to reusable AgentTeams;
3. an AgentOrg launch requiring one exact Agent or Team entry; and
4. shared runtime/history that states whether the root is an Org or standalone Team while keeping Task Agent/Task Team rows temporary and runtime-only.

Recursive configured Team/Org authoring, Org coordinators, implicit entry
fallbacks, copied Team variants, backend architecture, migration, and unrelated
product redesign are out of scope.

## Requirements Coverage

| Requirement / AC | Candidate UI obligation |
| --- | --- |
| `REQ-001`, `AC-001` | Team create/edit exposes Agents only and one selected coordinator radio |
| `REQ-002`, `REQ-003` | Org create/edit separates independent Agents from reusable Team references and exposes no Org coordinator |
| `REQ-004`, `AC-002` | Org launch action stays disabled until an exact entry is selected; Team entry names its coordinator |
| `REQ-011`, `AC-007` | Reusable Team remains independently launchable with distinct history |
| `REQ-016`, `AC-011` | Active/history roots display `Org` or `Team`; Task identities remain runtime lineage |
| `REQ-018`, `AC-013` | Referenced Team states same definition and preserved standalone history |
| `REQ-019`, `AC-014`, `SCN-007` | All four requested journeys are reviewable as one coherent product model |

## Production-Quality Visual Specification

- Preserve the accepted AutoByteus shell: 320px desktop left panel, primary navigation, resizable history section, white/neutral surfaces, system sans typography, compact tree rows, and existing icon language.
- Preserve the accepted AgentTeam catalog rather than replacing it: search/Reload/Create Team toolbar; Featured teams and All teams grouping; two-column cards; initials tile; title, description, and category; blue Agent chips; right-aligned Run and View Details actions; and three compact metrics. The only catalog semantic substitution is `Runs` in place of the now-obsolete `Nested Teams` metric.
- Preserve the accepted AgentTeam authoring hierarchy: title and template action; inset Basics panel; Agent Library, Team Canvas, and Member Details columns; LLM configuration; checklist; and footer actions. The requirements-driven delta removes the Team library and all Team/Org member choices while keeping one Agent coordinator radio.
- Preserve the accepted AgentTeam detail hierarchy: bordered Back action; neutral header card with initials/category/summary pills; Description facts; Team-local handoffs; and member cards. Replace nested-Team facts with Runs and a same-definition AgentOrg reuse statement rather than adding new type/reuse chrome.
- The selected `Agent Teams` navigation item is the visible page context. Keep one screen-reader-only `h1`, but do not repeat a visible page title, Team-type badge, reusable badge, or reusable explanatory eyebrow on every catalog card.
- AgentTeams use blue identity accents; AgentOrgs use violet identity accents; neutral slate remains the default content and form language.
- Temporary Task Agent and Task Team execution rows use the accepted source-current pale-indigo `Task:` presentation with animated/reduced-motion-compatible spinner identity. They appear within the owning Team execution, not as a separate configured section.
- Catalog/detail content uses a responsive card grid with 16–24px internal spacing, 12–16px radii, 1px slate borders, and restrained shadows.
- Primary actions use high-contrast blue; destructive stop uses red outline; secondary actions use neutral outline.
- Selected root uses pale indigo plus a 2px left inset accent. Temporary selected execution uses an indigo ring without implying configured membership.
- Disabled launch is visually muted and non-interactive. Exact selection produces an inline success summary before Start becomes available.
- At 390px, content becomes single-column and must not create document-level horizontal overflow.

## Journey Inventory

| Journey ID | Starting state | Completion state |
| --- | --- | --- |
| `UXJ-AORG-001` | AgentTeam catalog | Team create/edit/detail communicates direct Agents and exactly one coordinator |
| `UXJ-AORG-002` | AgentOrg catalog | Org create/edit/detail communicates direct Agent/Team composition and no coordinator |
| `UXJ-AORG-003` | Org detail | Exact Agent or Team entry selected; Team coordinator resolved visibly; run started |
| `UXJ-AORG-004` | Org runtime | Org root, standalone Team root, configured scope, Task Agent, and Task Team lineage are distinguishable |

## Surface And Behavior Specification

| Surface | Required structure and behavior |
| --- | --- |
| Team catalog | Selected `Agent Teams` navigation plus screen-reader heading; baseline search/Reload/Create toolbar, Featured/All grouping, initials/category cards, blue Agent chips, Coordinator/Members/Runs metrics, and baseline Run/View Details actions; no redundant visible Team/reusable labels |
| Team create/edit | Agent rows only; coordinator radio group with one selected value; no Add Team action; validation note |
| Team detail | Agent membership, coordinator, Team-local handoffs, standalone run/history, reuse statement |
| Org catalog | `Agent Orgs` navigation and title; direct Agent/Team chips; one configured level; no coordinator |
| Org create/edit | Organization details; Independent Agents; Reusable Agent Teams; Org-scoped handoffs; no coordinator control |
| Org detail | Direct Agent and referenced Team groups; same-definition/history statements; Run Organization |
| Org launch | Modal opens with no entry and disabled Start; exact Agent/Team radios; selected Team states coordinator; no fallback copy |
| Shared runtime | Typed root header, exact selected entry, configured snapshot, execution lineage, activity, and root-identity explanation |
| Shared history | Typed active/history root badges; Team placement; Task Agent below logical Agent; Task Team disclosure and selectable child |

## Key Transitions

| Transition | Immediate feedback | Result |
| --- | --- | --- |
| Select Team coordinator | Radio becomes checked | Exactly one direct Agent coordinator |
| Open Org launch | Modal and disabled Start | No implicit destination |
| Select exact Team entry | Radio highlight and exact-entry status | Start enabled; Team coordinator named |
| Start Org | Route carries root, Org, and entry query | AgentOrg runtime opens |
| Expand Task Team | Chevron opens; child AgentRun appears | Runtime lineage is inspectable without changing definition |
| Select task child | Row selection and focused-execution panel | Temporary AgentRun identity is explicit |
| Select standalone Team root | Root selection moves to Team | Standalone Team runtime and coordinator lifecycle appear |

## Accessibility And Content

- Buttons, radios, disclosure controls, modal close, and navigation are semantic and keyboard reachable.
- Selected/expanded states use native `aria-current`/`aria-expanded` or checked state where applicable.
- Color is paired with text/icon identity (`Org`, `Team`, `Task:`) rather than acting as the sole signal.
- Labels explicitly say `No coordinator`, `Exact entry`, `Through coordinator`, `Configured Team placement`, and `Temporary execution` to prevent conceptual ambiguity.
- Focus and selected treatments preserve readable contrast and do not remove browser keyboard semantics.

## Data And Mock Boundaries

| Boundary | Prototype behavior | Production gap |
| --- | --- | --- |
| Definitions | Deterministic in-memory Agents, Teams, Orgs, handoffs | API, validation, persistence, permissions |
| Launch | Real selection and navigation over synthetic run | Run service, orchestration, recovery |
| Runtime/history | Real disclosure, root selection, task focus over fixtures | Streams, durable history, stop/restore |
| Reuse | Same fixture identity shown across Team and Org surfaces | Identity store and referential integrity |

Fixture names, counts, descriptions, run IDs, timestamps, statuses, and activity
copy are illustrative. The visible structural distinctions, labels, controls,
states, spacing, and interaction behavior become normative only after approval.

## Review Evidence — Non-Normative

| Review ID | Surface/state | Viewport | Path |
| --- | --- | --- | --- |
| `REV-AORG-001` | Baseline-native Team catalog | 1440×900 | `review-evidence/rv-004/REV-AORG-001-agent-team-catalog.png` |
| `REV-AORG-002` | Baseline-native Team authoring | 1440×900 | `review-evidence/rv-004/REV-AORG-002-agent-team-authoring.png` |
| `REV-AORG-003` | Org catalog | 1440×900 | `review-evidence/rv-004/REV-AORG-003-agent-org-catalog.png` |
| `REV-AORG-004` | Org authoring | 1440×900 | `review-evidence/rv-004/REV-AORG-004-agent-org-authoring.png` |
| `REV-AORG-005` | Org detail | 1440×900 | `review-evidence/rv-004/REV-AORG-005-agent-org-detail.png` |
| `REV-AORG-006` | Exact Team entry selected | 1440×900 | `review-evidence/rv-004/REV-AORG-006-agent-org-exact-entry-launch.png` |
| `REV-AORG-007` | Org runtime and task child focus | 1440×900 | `review-evidence/rv-004/REV-AORG-007-agent-org-runtime-history.png` |
| `REV-AORG-008` | Standalone Team runtime | 1440×900 | `review-evidence/rv-004/REV-AORG-008-standalone-team-runtime-history.png` |
| `REV-AORG-009` | Baseline-native Team detail | 1440×900 | `review-evidence/rv-004/REV-AORG-009-agent-team-detail.png` |

## Final Visual Reference Inventory

Pending explicit user approval. No review capture is a final `VIS-*` reference.

## Open Decisions

- User approval or requested revision of the restored baseline-native AgentTeam catalog and the new AgentOrg visual identity.
- User approval or requested revision of the exact-entry modal wording and density.
- User approval or requested revision of the source-current Task row placement inside the future AgentOrg runtime.

## Current Consistency Check

- Applicable corrected baseline accepted: `Yes`
- Four requested journeys runnable: `Yes`
- RV-004 browser validation: `24/24 pass`, zero runtime errors
- Desktop and narrow validation: `Yes`
- User confirmation recorded: `No — pending`
- Final normative references captured: `No — correctly pending approval`
