# Experience Story — Approved Workspace Hierarchy

## Prototype Scope

- Request: Evolve the accepted AutoByteus Workspace history sidebar so a root Agent Team with nested teams reads as a compact organization/file tree without replacing the existing product surface.
- Related IDs: `BEH-001`–`BEH-005`; `REQ-001`–`REQ-012`; `AC-001`–`AC-008`; `DEC-001`–`DEC-003`.
- Critical journey: Open the real `/workspace` route, scan an expanded team run, expand sibling and deeper teams, select a concrete leaf, and recover long identity at supported widths/font presets.
- Non-goals: Backend, topology, persistence, Team editor, Team overview, global navigation, full-page org chart, drag/drop, or production implementation.

## Product Story

- Actor: Desktop/web users navigating team-run history, including keyboard and assistive-technology users.
- Goal: Trace every visible agent to its immediate team and distinguish configured teams, transient task teams, and agents at a glance.
- Starting context: The accepted Nuxt Workspace shell contains one Workspace, a team-definition group, two team runs, and one expanded active run.
- Observable success: Continuous file-tree rails plus node treatment communicate ancestry without color or indentation alone; disclosure and selection remain correct; responsive metadata stays secondary; full identity is recoverable; no horizontal overflow occurs at 260/320/520px or Default/Extra Large.

## Screen And States

| Surface ID | Purpose | Important States | Primary Actions | Final References |
| --- | --- | --- | --- | --- |
| `UI-NTH-001` | Existing Workspace history subtree | Subteams collapsed; one expanded; siblings/deeper expanded; selected leaf; focus recovery | Toggle structural teams, select concrete members, inspect identity/status | `VIS-001`–`VIS-005` |
| `UI-NTH-002` | Historical comparison evidence, not present on approved route | Rails/surfaces/hybrid; metadata variants; identity variants | Internal regression only | `review-evidence/rv-002`–`rv-006` |

## Critical Journey

| Step | State | Action / Event | Visible Feedback | Result |
| --- | --- | --- | --- | --- |
| 1 | Default | Open approved URL | Accepted product shell appears with five root-level execution rows and no review chrome | Hierarchy is immediately scannable |
| 2 | One team expanded | Activate Product Design | Chevron rotates; descendants appear on continuous rails | Membership remains attached to Product Design |
| 3 | Several/deep teams | Expand siblings and Design Systems | Correct `├─`/`└─` termination keeps groups distinct | Sibling memberships do not visually merge |
| 4 | Selected leaf | Select a concrete deeper agent | Ancestors reveal; pale-indigo orthogonal row and 2px accent appear | Selection and ancestry remain simultaneous |
| 5 | 260px + Extra Large | Focus a truncated row | Required controls remain visible; age/status yield; full identity tooltip stacks above following rows | Complete identity is recoverable without resize |
| 6 | Quiet refresh | Wait more than five seconds | No subtree resets | Local disclosure ownership is preserved |

## Approved Visual And Interaction Direction

- Information hierarchy: Definition group → task/team run → direct members and sibling teams → deeper teams/agents.
- Ancestry: Printed file-tree rails, no nested-team row cards, no crossing horizontal connectors.
- Team identity: Unboxed filled User group symbol plus semibold name; agents retain circular avatars; transient teams retain their dashed bolt treatment.
- Metadata: Responsive; age yields at 260/320px and is continuous at 520px.
- Selection: `#eef2ff` orthogonal row with straight 2px `#6366f1` inset left rule.
- Accessibility: `tree`/`treeitem`, levels, expanded state, selection, complete role/name/address/status labels, keyboard activation, and visible focus identity recovery.
- Product language: Existing Workspace shell, typography, density, status semantics, actions, and unaffected behaviors are preserved.

## Approved Product Decisions

| Decision ID | Approved Outcome | Approval |
| --- | --- | --- |
| `DEC-001` | Printed file-tree rails with continuous ancestor connections and terminating elbows | User approved 2026-08-30 |
| `DEC-002` | Responsive metadata density with hover/focus recovery at narrow widths | User approved 2026-08-30 |
| `DEC-003` | Filled User group symbol for configured teams, circular avatars for agents, separate transient marker | User approved 2026-08-30 |
