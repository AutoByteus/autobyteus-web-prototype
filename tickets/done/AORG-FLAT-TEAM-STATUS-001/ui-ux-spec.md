# UI/UX Specification Supplement — Mounted AgentOrg Team Status

## Status And Authority

- Status: `Approved; repository integration and baseline promotion in progress`.
- Product ticket: `AORG-FLAT-TEAM-STATUS-001`.
- Stable requirements package: `AORG-FLAT-TEAM-001`.
- Requirements revision: `RER-020@bf5951867f87d1e5bb6eaa8bfc7b82b2c6f6cba5`.
- Related IDs: `BEH-011`, `REQ-028`, `AC-023`, `SCN-012`, `ORG-CASE-056`–`ORG-CASE-058`.
- Prior authority preserved: RV-012 and `BASELINE-PROMOTION-001`; this supplement changes only the mounted Team-row status omission.

## Focused Experience Contract

1. Every direct configured Team row inside an AgentOrg execution tree shows one Team aggregate status dot in the established position between disclosure and Team identity.
2. The Team dot coexists with every exact descendant Agent status dot; it never replaces or overwrites an Agent signal.
3. The Team aggregate folds configured and task-scoped descendant Agent statuses inside that exact Team branch only, using `running > initializing > error > idle > offline`.
4. The Team container, direct Org Agents, ancestors, sibling Teams, and outside rows do not contribute. Empty, missing, and unknown inputs resolve to `offline`.
5. Collapsing the Team hides descendants but leaves its aggregate status visible on the Team row.
6. Stopped/historical presentation derives from truthful terminal descendant projections and does not retain `running` or `initializing` without live authority.
7. The dot exposes `Team status: <State>` through accessible name and title. Color is not the only status communication.
8. The signal is presentation-only. It adds no mounted-Team Stop, restore, archive, polling, persistence, transport, focus, routing, readiness, command, or lifecycle behavior.

## Visual Treatment

- Reuse the existing `8 × 8px` solid status-dot grammar and five-state palette/motion already used by the Workspace hierarchy.
- Keep the existing Team disclosure, filled Team icon, label typography, connector rails, row height, selection treatment, and spacing.
- Insert the Team status dot with the same `6px` right spacing used by Agent status dots. No badge, count, legend, explanatory copy, or new row chrome is added.
- Expanded and collapsed Team rows remain visually identical except for disclosure orientation and descendant visibility.
- Historical Team dots use terminal colors with no live pulse when the projected inputs contain no `running` or `initializing` status.

## Deterministic Review States

- **Active / expanded:** Product Design & Prototyping aggregates to `running` because its own task-scoped descendant is running; Software Engineering aggregates to `initializing`, which outranks its error descendant.
- **Active / collapsed:** both Teams remain collapsed while the same branch-local aggregate dots remain visible.
- **Stopped / historical:** Product Design & Prototyping aggregates to `error`; Software Engineering aggregates to `idle`; neither retains live activity.

Fixture identities, exact status mixtures, messages, timestamps, and files are illustrative. Placement, hierarchy preservation, five-state fold, collapsed visibility, accessibility, historical truth, and lifecycle non-effects are normative.

## Responsive And Accessibility

- Preserve the approved responsive left-panel behavior; Team status remains a nonshrinking dot before Team identity while the label truncates first.
- `NestedTeamAggregateStatusDot` exposes `role="img"`, `aria-label="Team status: <State>"`, `title`, and `data-status`.
- Existing keyboard disclosure, exact Agent focus, tree roles, levels, and selection semantics remain unchanged.

## Mock Boundaries

All Agent states and state changes are deterministic local projections. No backend polling, persisted Team status, stream contract, transport field, lifecycle service, production command, or production architecture is implemented or implied.

## Approval And Final References

- User approval: explicit `approve` on `2026-09-01`; durable record: `user-decision-record.md`.
- The approved active/expanded experience is promoted on the clean product route `/workspace?root=org&org=software-development-department&phase=active`; it does not require `prototypeReview`.
- Pre-approval `RV-*` captures remain non-normative review evidence.

| ID | Approved state | Viewport | Stable file |
| --- | --- | --- | --- |
| `VIS-STATUS-001` | Active AgentOrg, configured Team branches expanded, Team and exact Agent signals coexisting on the clean product route | `1440 × 900` | `visual-references/VIS-STATUS-001-agent-org-mounted-team-status-active-expanded-desktop-1440x900.png` |
| `VIS-STATUS-002` | Active AgentOrg, configured Team branches collapsed, Team signals retained | `1440 × 900` | `visual-references/VIS-STATUS-002-agent-org-mounted-team-status-active-collapsed-desktop-1440x900.png` |
| `VIS-STATUS-003` | Stopped/historical AgentOrg with terminal Team projections and no stale live state | `1440 × 900` | `visual-references/VIS-STATUS-003-agent-org-mounted-team-status-stopped-historical-desktop-1440x900.png` |

The exact fixtures and status mixture are illustrative. Placement, branch-local five-state aggregation, collapsed visibility, accessible status naming, terminal historical truth, preservation of exact Agent indicators, and lifecycle non-effects are normative.

## Validation Evidence

- Focused browser validation: `9/9` checks passed with zero browser errors, including clean-route promotion; `review-evidence/rv-001/browser-validation.json`.
- Static validation: diff check, typecheck, lint, `15/15` tests, `13/13` prototype-boundary checks, and production build; `validation/static-validation.txt`.
- Final reference capture: three normative references with zero browser errors; `validation/final-reference-capture.txt` and `visual-references/visual-reference-manifest.json`.
