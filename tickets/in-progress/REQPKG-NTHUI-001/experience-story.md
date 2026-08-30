# Experience Story

## Prototype Scope

- Prototype request: Evolve the accepted AutoByteus Workspace history sidebar so a root Agent Team with nested teams can be reviewed as a compact organization tree without replacing the existing product surface.
- Related behavior, requirement, and acceptance-criteria IDs: `BEH-001`–`BEH-005`; `REQ-001`–`REQ-012`; `AC-001`–`AC-008`.
- Decision questions: `DEC-001` ancestry grammar; `DEC-002` status/age density; `DEC-003` team-node identity.
- Critical journey: Open the real `/workspace` route, inspect the same expanded team run, compare the three decision dimensions, exercise collapsed/deep/selected states, and stress the actual left panel at 260/320/520px and Default/Extra Large.
- Non-goals: Backend, topology, persistence, Team editor, right-side Team overview, global navigation, full-page org chart, drag/drop, or production implementation.

## Product Story

- Actor: A desktop/web user navigating team-run history, including keyboard and assistive-technology users.
- Goal: Trace every visible agent to its immediate team and distinguish team, task/run, configured member, and temporary task execution at a glance.
- Starting context: The accepted Nuxt Workspace shell is running with one Workspace, one team-definition group, two team runs, and the active run expanded.
- Observable success: Ancestry is communicated by at least two non-color cues, disclosure and selection semantics remain intact, metadata is subordinate, full identity is recoverable, and supported widths/font presets do not create horizontal overflow.

## Screens And States

| Screen / Surface ID | Purpose | Entry Condition | Important States | Primary Actions | Exit / Destination |
| --- | --- | --- | --- | --- | --- |
| UI-001 | Existing Workspace product surface | Open the RV-002 `/workspace` URL | Existing shell, selected team member, files/tools panels, Workspace history | Use the product normally; resize/collapse panels | Existing product destinations |
| UI-002 | Existing Workspace history subtree | Expand Workspace → definition → active team run | Subteams collapsed, one expanded, siblings expanded, deeper expanded, selected deep leaf | Toggle structural teams; select concrete members; inspect identity/status | Focused member remains in Workspace |
| UI-003 | Review-only controls, outside the left panel | RV-002 query is active | DEC-001/002/003 choices; tree state; actual width/font | Change one dimension while preserving fixture content | Same `/workspace` route with updated query |

## Critical Journey

| Step | Screen / State | User Action Or System Event | Visible Feedback | Resulting State / Destination | Decision Evidence |
| --- | --- | --- | --- | --- | --- |
| 1 | UI-001 / hybrid, responsive metadata, header identity | Open the review URL | The accepted Workspace shell appears; only the history subtree is changed | Active team run is expanded | Baseline-native connection is directly reviewable |
| 2 | UI-003 / DEC-001 | Switch Rails, Surfaces, Hybrid | The same 17 deep-tree rows use a different ancestry grammar | Fixture and product shell remain identical | Compare connection continuity versus containment weight |
| 3 | UI-003 / DEC-002 | Switch Full, Responsive, On focus | Age/status density changes without changing node identity | Metadata stays accessible in labels/titles and on focus when hidden | Compare scan noise and continuous availability |
| 4 | UI-003 / DEC-003 | Switch Icon, Header, Band | Team nodes change shape/typography/role placement; agents retain circular avatars | Node role remains programmatically explicit | Compare compactness versus explicit team emphasis |
| 5 | UI-003 / responsive stress | Choose 260 and Extra Large, then Selected deep leaf | Actual product width becomes 260px and root font becomes 125%; selected ancestors are expanded | Deep leaf remains selected and controls remain operable | Validate worst-case density and identity recovery |
| 6 | UI-002 / keyboard | Focus a structural team row and press Enter/Space; focus a long label | Only that subtree toggles; visible tooltip and accessible label expose full role/name/address | No fabricated Agent selection | Validates preserved interaction and accessibility intent |

## Important Alternate And Failure Paths

| Scenario | Trigger | Expected Experience | Recovery / Next Action | Why It Matters |
| --- | --- | --- | --- | --- |
| Subteams collapsed | Select `Subteams collapsed` | Root coordinator/direct member and three sibling subteams remain visible | Expand one team | Establishes first-scan hierarchy |
| Transient task team | Select `Deeper team expanded` | Dashed outline, bolt/structural shape, and explicit temporary role distinguish it | Toggle independently | Preserves temporary execution identity |
| Truncated name | 260px + Extra Large | Ellipsis remains apparent; focus/hover exposes the complete role, name, and address | Read tooltip or accessible name | Satisfies recovery without widening the panel |
| Quiet refresh | Keep a subtree expanded for more than five seconds | Expansion remains unchanged | Continue review | Preserves local disclosure ownership |

## Visual And Interaction Direction

- Information hierarchy: Definition group → task/team run → direct root members and sibling teams → deeper teams/agents. Name and relationship precede status and age.
- Navigation: The existing product navigation and `/workspace` route remain unchanged.
- Interaction model: Existing row-body disclosure and concrete-member selection are retained; query-backed controls only select review variants.
- Feedback model: Existing hover, focus, selected indigo, activity status, and run actions remain; review-only choice buttons show pressed state.
- Responsive behavior: The review controls apply the product's actual 260–520px left-panel width and actual Default/Extra Large app font preset.
- Accessibility intent: `tree`/`treeitem`, level, expanded, selected, role, name, address, and status are programmatically determinable; full identity is also visually exposed on hover/focus.
- Product visual language: Existing white/gray compact sidebar, indigo selection, status dots, 4–6px radii, Iconify assets, and product typography are preserved.

## Open Product Decisions

| Decision ID | Question / Alternatives | Prototype Evidence Planned | Decision Owner |
| --- | --- | --- | --- |
| DEC-001 | Rails vs nested surfaces vs hybrid | Identical deep fixture and review captures at 320px | User |
| DEC-002 | Full vs responsive vs focus-revealed status/age | Actual 260/320/520px and Default/Extra Large matrix | User |
| DEC-003 | Structural icon vs two-line team header vs emphasized band | Same teams/agents with role-aware accessible labels | User |
