# UI/UX Specification — Workspace Nested-Team Hierarchy

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `REQPKG-NTHUI-001`; stable package `nested-team-hierarchy-ui`
- Related requirements revision ID: `RER-001` (Requirements Engineering reconciliation required)
- Related IDs: `BEH-001`–`BEH-005`; `REQ-001`–`REQ-012`; `AC-001`–`AC-008`; `DEC-001`–`DEC-003`
- Runnable prototype repository/root: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Approved review URL: `http://127.0.0.1:4193/workspace?prototypeReview=nested-team-hierarchy&reviewView=proposal&hierarchy=rails&metadata=responsive&teamIdentity=icon&panelWidth=320&fontSize=default&treeState=collapsed`
- Explicit user-confirmation reference: On 2026-08-30 the user stated they were satisfied with and approved the current hierarchy UI, font, color, and symbol. The user explicitly preferred the filled User group symbol over the later outline trial.
- Final validation date: 2026-08-30

## Repository And Baseline Provenance

- Source repository: `/home/autobyteus/workspace/autobyteus-workspace-nested-team-hierarchy-ui-requirements`
- Selected frontend: `/home/autobyteus/workspace/autobyteus-workspace-nested-team-hierarchy-ui-requirements/autobyteus-web`; Workspace history sidebar
- Pinned source context revision: `5cb39c65630b5b0baae7b4813f6e8cd798851e97`
- Prototype repository/root: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Accepted prototype baseline: `550e8bd8737ddb645cc12f674d693bed76a09e9f`
- Approved UI implementation revision: `801b571093a3388eb21efea17515529ff9b89f51`
- Ticket branch/worktree: `prototype/reqpkg-nthui-001`; `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001`
- Ticket folder: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001/tickets/done/REQPKG-NTHUI-001`
- Bootstrap report: `/home/autobyteus/workspace/autobyteus-web-prototype/prototype-bootstrap-report.md`

The source pin is recorded context rather than a user-imposed refresh constraint. The accepted current-experience prototype is the preservation baseline. This specification defines only the approved Workspace history hierarchy delta.

## Scope And Experience Goal

- User: Desktop/web users scanning Agent Team run history, including keyboard and assistive-technology users.
- Context: A Workspace history team-definition group contains multiple team runs. One run is expanded and contains direct members, configured nested teams, a deeper nested team, and a transient task team.
- Goal: Make the expanded run read as a compact organization/file tree so every visible child can be traced to its immediate parent without relying on color, a small `TEAM` badge, or indentation alone.
- Observable success: Parentage is visibly continuous; team, agent, and transient team nodes are distinguishable; controls remain usable at 260–520px and Default–Extra Large font presets; full truncated identity is recoverable; existing disclosure, selection, status, and run actions remain unchanged.
- In scope: Workspace history execution tree, nested-team disclosure, selected-row presentation, team-node symbol, responsive status/age density, focus/hover identity recovery, and accessibility semantics.
- Non-goals: Backend/topology/status/persistence changes; Team definition editor; Team overview; mobile/global navigation; a full-page org chart; drag/drop; global typography changes; production implementation.

## Related Requirements And Acceptance Criteria

| IDs | UI/UX Obligation | Covered State / Journey |
| --- | --- | --- |
| `REQ-001`–`REQ-004`; `AC-001`, `AC-002` | Present the run subtree as a coherent hierarchy using continuous rails plus node-role treatment. | Default, one expanded team, several siblings, deep team, selected leaf |
| `REQ-005`, `REQ-010`; `AC-002`, `AC-003`, `AC-008` | Preserve selection, disclosure, valid selection targets, ancestor reveal, quiet refresh, status semantics, and run actions. | Pointer/keyboard toggle, selected path, five-second refresh probe |
| `REQ-006`–`REQ-008`, `REQ-012`; `AC-004`, `AC-005` | Keep hierarchy primary at 260/320/520px and supported font presets; make hidden metadata and complete identity discoverable. | 260px Extra Large focus, 320px default, 520px default |
| `REQ-003`, `REQ-009`; `AC-006` | Distinguish configured team, transient task team, and agent without color alone. | Mixed configured/transient deep tree |
| `REQ-011`; `AC-007` | Expose tree level, selection, role, name, and disclosure state programmatically and operate disclosures by keyboard. | Tree/treeitem semantics and keyboard activation |

## Production-Quality Experience And Visual Specification

### Existing Product Language To Preserve

- Keep the accepted AutoByteus Workspace shell, left-panel structure, section labels, white/gray compact palette, typography, 260–520px resize policy, application font presets, run rows, status dots, relative time, and team-run actions unchanged outside the focused execution subtree.
- Keep the existing one-line compact row rhythm. The proposed hierarchy does not add cards, group panels, helper copy, review controls, or a separate organization-chart surface.

### Information Hierarchy

1. Workspace and `TEAMS` section.
2. Team-definition row.
3. Task/team-run row.
4. Direct root members and sibling team nodes.
5. Descendants of expanded teams, including deeper configured teams and transient task teams.

Within an execution row, the scan order is connector/disclosure → status → node-type symbol/avatar → name → secondary age. Team names use stronger weight than agent names. Status and age never outrank ancestry or identity.

### Grid, Dimensions, Spacing, And Density

- Execution row minimum height: `1.75rem` (28px at the default root size).
- Depth increment: `0.875rem` (14px) per level.
- The current-level branch reserves `0.5rem` (8px) horizontally.
- Continuing ancestor rails occupy the exact rail coordinate for their level; they do not create row boxes.
- Disclosure control: `0.875rem × 0.875rem` with 0.5rem left margin and 0.25rem right margin.
- Configured team icon and agent avatar: `1rem × 1rem`.
- Content retains the existing 0.25rem vertical row padding and 0.5rem right padding.
- Nested teams are collapsed by default. Expanding a node changes only that subtree.

### Printed File-Tree Connectors

- Connector grammar is the familiar printed file tree: continuous vertical rails with `├─`/`└─`-style terminating elbows.
- Continuing ancestor rail color: Tailwind `slate-300` (`#cbd5e1`); current branch line color: `#94a3b8`.
- Line thickness: 1px.
- Each horizontal branch begins at the vertical rail coordinate and extends right only; it must not cross through the vertical rail.
- The current row vertical segment ends at the row midpoint for a last sibling and continues through the row only when another sibling follows at that level.
- Rails remain visible across related rows; indentation alone is never the only ancestry cue.

### Typography

- Preserve the product's existing font family and application font-size settings.
- Execution rows use the existing `text-sm` size and line rhythm.
- Configured team names use weight 600; agent names retain normal row weight.
- Do not show a repeated `TEAM` badge or an additional two-line team header in the approved compact state.
- Truncated text uses ellipsis and remains one line. Complete role, display name, and address are available through pointer title and keyboard-focus tooltip/accessible label.

### Color, Surfaces, Borders, And Elevation

- Normal rows remain on the existing white sidebar with no team-row card, border, background panel, or shadow.
- Hover retains the existing light gray row background.
- Selected row background: `#eef2ff`.
- Selected accent: straight 2px inset left rule, `#6366f1`.
- Selected row radius: 0. No rounded outline or oversized stripe.
- Configured team icon color: Tailwind `slate-500`; it has no border, box, or background.
- Transient task-team rows preserve their light indigo surface and dashed `#c7d2fe` border plus separate dashed bolt marker.
- Keyboard identity tooltip: `slate-900` background, white text, compact 0.6875rem/1rem typography, medium weight, 0.375rem radius, and shadow. The focused row stacks at z-index 60 so later rows cannot paint over the tooltip.

### Controls, Icons, And Node Identity

- Configured Agent Team: unboxed filled `heroicons:user-group-20-solid`, 16px, plus semibold team name and disclosure when children exist.
- Configured agent: existing 16px circular avatar/initials treatment.
- Transient task team: existing separate dashed square with `heroicons:bolt-20-solid`; do not replace it with the configured-team symbol.
- Status: exact status dot for agents; aggregate descendant status dot for nested teams.
- Disclosure: existing chevron-down icon rotates for collapsed state; the row body and dedicated disclosure both preserve current subtree-toggle behavior.

### Hover, Focus, Selected, And Feedback Treatment

- Pointer hover uses the existing light gray feedback and reveals age at 260/320px.
- Keyboard focus uses the existing indigo focus ring and reveals the full identity tooltip; the tooltip must stack above following rows.
- A concrete member selection uses the orthogonal pale-indigo background and 2px inset rule. Parent rails and node role remain visible through selection.
- A structural team row with no agent run toggles its subtree and must not fabricate a member selection.
- Selected deep members automatically reveal their ancestor path.
- No error, offline, active, or idle color may replace the node-type or ancestry cues.

### Metadata Density

- At 520px, status and age remain continuously visible.
- At 320px and 260px, repeated member age collapses from the continuous scan and reveals on row hover or keyboard focus.
- At 260px, depth-2 status may also collapse and reveal on hover/focus so the disclosure and name remain operable.
- Complete status/role/name/address remains included in accessible labels even when a visual metadata token yields.
- Metadata reveal uses the existing 120ms max-width/opacity/margin transition. Under `prefers-reduced-motion: reduce`, hierarchy transitions reduce to 0.01ms.

## Journey Inventory

| Journey ID | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- |
| `UXJ-NTH-001` | Active team run expanded; nested teams collapsed | Scan root members and sibling teams | Tree roles and parentage are legible without opening every branch | `REQ-001`–`REQ-003`; `AC-001` |
| `UXJ-NTH-002` | Several sibling teams visible | Expand one or more teams and a deeper team | Every descendant remains visibly attached to its immediate parent | `REQ-002`, `REQ-004`, `REQ-010`; `AC-002`, `AC-003` |
| `UXJ-NTH-003` | Deep leaf exists | Select the leaf | Ancestor path reveals; selection remains distinct without erasing rails | `REQ-005`, `REQ-010`; `AC-002` |
| `UXJ-NTH-004` | 260px panel, Extra Large font, long names | Focus/hover a truncated row | Full role/name/address is recoverable; controls do not overlap | `REQ-006`, `REQ-007`, `REQ-012`; `AC-004` |
| `UXJ-NTH-005` | Configured and transient teams visible | Compare and toggle node types | Configured team, agent, and transient task team remain distinct | `REQ-003`, `REQ-009`; `AC-006` |

## Journey Details

### UXJ-NTH-001 — Default Scan

Open the approved Workspace route. The team-definition and active-run grouping remain unchanged. Direct root members and three sibling configured teams appear under the run using connected rails. Configured team rows are semibold with the filled User group symbol; agents retain circular avatars. Nested teams start collapsed.

### UXJ-NTH-002 — Independent Disclosure

Activate a configured or transient structural team row by pointer, Enter, or Space. Only that subtree changes. `aria-expanded` updates, the disclosure rotates, the rail continues through visible descendants, and unrelated sibling state remains unchanged. Quiet refresh must not reset expansion.

### UXJ-NTH-003 — Selected Descendant

Select a concrete leaf. If an ancestor is collapsed, reveal the necessary ancestor path. Apply the approved selection background and inset accent only to the selected row. Do not select a structural team that has no concrete agent-run target.

### UXJ-NTH-004 — Narrow Identity Recovery

At 260px with Extra Large font, truncate long row labels without clipping disclosure, status, or selection. Hover or keyboard-focus the row to expose the complete role, display name, and address. The focus tooltip overlays subsequent rows cleanly and does not change panel width.

### UXJ-NTH-005 — Configured And Transient Identity

Render configured teams and transient task teams within the same connector grammar. Use the filled User group icon only for configured teams. Preserve the transient dashed surface and bolt marker so temporary execution identity remains independent of status color.

## Screen And Surface Specification

| Surface ID | Purpose | Important States | Primary Actions | Visual IDs |
| --- | --- | --- | --- | --- |
| `UIS-NTH-001` | Workspace history hierarchy | Default collapsed, one team expanded, deep tree, selected leaf, focus recovery | Scan, expand/collapse, select, inspect identity | `VIS-001`–`VIS-005` |

## Interaction And State Transitions

| Transition ID | From State | Trigger | Immediate Feedback | Resulting State |
| --- | --- | --- | --- | --- |
| `TR-NTH-004` | Structural team expanded | Click row/disclosure or activate with keyboard | Chevron rotates; descendant rows leave | Only that subtree collapsed |
| `TR-NTH-005` | Structural team collapsed | Click row/disclosure or activate with keyboard | Chevron rotates; rails and descendants enter | Only that subtree expanded |
| `TR-NTH-006` | Leaf not selected | Activate concrete member | Pale-indigo row and 2px left rule | Leaf selected; ancestor path visible |
| `TR-NTH-007` | Long label truncated | Hover or keyboard focus | Age/status reveal as allowed; full identity appears | Identity recoverable without resize |
| `TR-NTH-008` | One or more teams expanded | Quiet refresh | No disruptive feedback | Expansion remains unchanged |

## Responsive And Platform Behavior

- Supported desktop/web panel widths: 260px minimum, 320px default, 520px maximum.
- Supported application fonts: Default, Large, Extra Large; Extra Large is 125% root scaling.
- The hierarchy must not introduce horizontal overflow at any supported width/font combination.
- At narrow widths, names truncate before required controls. Responsive metadata yields as specified above.
- Mobile/global navigation is outside this ticket; do not extrapolate the sidebar treatment into a new mobile information architecture.

## Accessibility And Keyboard Behavior

- The execution subtree is exposed as `role="tree"`; each visible row is `role="treeitem"`.
- Each tree item exposes `aria-level`; structural nodes expose `aria-expanded`; selection exposes `aria-selected` and the existing `aria-current` where applicable.
- Accessible names include node role, display name, address, level, and status.
- Row activation works by Enter and Space. Disclosure controls remain independently operable.
- Focus indicators, filled team symbol versus circular avatar, semibold team label, and continuous rails provide non-color identity/hierarchy cues.
- Full truncated identity is available to keyboard users through a visible focus tooltip and to assistive technology through the accessible label.

## Content, Labels, Validation, And Feedback

- User-defined team and agent names are preserved verbatim and may truncate visually.
- Do not derive new display names from addresses or underscore conventions.
- Tooltip identity format: `<role> · <display name> · <member address>`.
- Relative times and status labels preserve existing product formatting and semantics.
- Fixture names, statuses, ages, addresses, and summaries in the prototype are illustrative, not mandated product copy.

## Data, Contract, And Mock Boundaries

| Boundary | UI Dependency | Prototype Behavior | Production Requirement / Unknown |
| --- | --- | --- | --- |
| Execution topology | Ordered tree rows, depth, member kind, children | Synthetic in-memory fixture | Consume existing production execution-tree contracts; no contract change |
| Status/age | Agent exact status, team aggregate status, run last activity | Deterministic synthetic values | Preserve existing status aggregation and relative-time semantics |
| Selection/conversation | Valid concrete agent-run target | Prototype Pinia selection with synthetic conversation | Preserve existing valid-target behavior; no fabricated team selection |
| Quiet refresh | Expansion ownership | Scripted no-op refresh | Preserve component-local expansion across quiet data refresh |
| Review route/query | Deterministic fixture and width/font state | Prototype-only query/localStorage | Do not implement review controls or fixture selection in production |

## Final Visual Reference Inventory

All references were captured after explicit user approval from implementation revision `801b571093a3388eb21efea17515529ff9b89f51`. Visible fixture values are illustrative; layout, hierarchy, typography, colors, symbols, state styling, and responsive behavior are normative.

| Visual ID | State | Viewport / Panel | Image Path | Requirements-Defining Details | Illustrative / Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| `VIS-001` | Default, nested teams collapsed | 1440×1000 / 320px / Default | `visual-references/VIS-001-workspace-hierarchy-default-320.png` | Clean product route, compact file-tree rails, filled User group icon, default selection, no review UI | Fixture names/statuses/ages |
| `VIS-002` | Product Design expanded | 1440×1000 / 320px / Default | `visual-references/VIS-002-workspace-hierarchy-one-team-expanded-320.png` | Ancestor continuation, last-sibling elbows, agent/team identity | Fixture content |
| `VIS-003` | Deep leaf selected | 1440×1000 / 320px / Default | `visual-references/VIS-003-workspace-hierarchy-selected-deep-leaf-320.png` | Ancestor reveal, orthogonal selection, configured/transient grammar | Selected fixture leaf |
| `VIS-004` | Long row keyboard-focused | 1440×1000 / 260px / Extra Large | `visual-references/VIS-004-workspace-hierarchy-focus-recovery-260-xl.png` | Narrow truncation, focus, metadata reveal, unobscured full-identity tooltip | Focused fixture row/text |
| `VIS-005` | Deep tree expanded | 1440×1000 / 520px / Default | `visual-references/VIS-005-workspace-hierarchy-deep-tree-520.png` | Multiple sibling/deeper teams, continuous age at wide width, transient team distinction | Fixture topology/content |

## Linked Prototype Evidence

- Runnable prototype source: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001`
- Ticket record: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001/tickets/done/REQPKG-NTHUI-001/prototype-ticket.md`
- Run instructions: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001/tickets/done/REQPKG-NTHUI-001/prototype-runbook.md`
- Browser validation: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001/tickets/done/REQPKG-NTHUI-001/browser-validation-rv-006.json` — 24/24 pass, zero runtime errors
- Visual manifest: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001/tickets/done/REQPKG-NTHUI-001/visual-references/visual-reference-manifest.json` — five post-approval captures, zero runtime errors
- Supporting artifacts: `experience-story.md`, `ui-behavior-test-matrix.md`, `prototype-assumptions.md`, `prototype-change-log.md`, `review-guide.md`, `requirement-impact.md`, `user-decision-record.md`

## Implementation Fidelity Boundary

- Preserve exactly: connector grammar, node identity, selection geometry/color, hierarchy typography, responsive metadata behavior, accessible hierarchy/state, focus tooltip stacking, and all preserved Workspace interactions.
- Prototype-only: query parameters, localStorage scenario, synthetic topology/data, blocked production network, prototype fixture stores, and capture automation. These do not prescribe production architecture.
- Allowed content variation: real team/agent names, avatars, statuses, ages, addresses, run summaries, and number/depth of nodes.
- Allowed responsive variation: only the specified metadata yielding/truncation across supported panel widths/font presets; hierarchy and required controls must remain intact.
- Existing constraints: use the production Workspace history data model, status aggregation, valid selection targets, application font settings, and panel resize policy.

## Out Of Scope

Production backend and topology changes; new persistence; team definition editing; Team overview redesign; mobile/global navigation; drag/drop hierarchy management; full-page org chart; global font changes; production architecture or implementation.

## Open Decisions And Risks

- `DEC-001`–`DEC-003`: none; resolved by the explicit user approval recorded above.
- Requirements Engineering must reconcile `RER-001` so the canonical requirements and acceptance criteria point to this approved supplement and final references.
- Production performance at extremely large tree sizes was not evaluated; representative hierarchy depth and density were validated only for this design decision.

## Final Consistency Check

- User confirmation recorded: `Yes`
- Repository/root, source pin, accepted base, and implementation revision recorded: `Yes`
- Ticket record, folder, and linked artifacts agree: `Yes`
- In-scope journeys specified: `Yes`
- Required states have final visual references: `Yes`
- Prototype, screenshots, and specification agree: `Yes`
- Final visuals contain no unintended review chrome, clipping, connector crossing, or focus-tooltip paint overlap: `Yes`
- Fixture variation identified: `Yes`
- Mocked boundaries and production gaps explicit: `Yes`
