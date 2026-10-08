# UI/UX Specification — Workspaces in the collapsed left strip

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `collapsed-left-panel-expand-keeps-run` (Product ticket = stable package identifier)
- Related requirements revision ID: `SR-001`, status `Ready for Approval`. The user asked for UI first. This design changes the draft; see "Requirement impact" below.
- Related IDs: REQ-001–007; AC-001–010; BEH-001–005, BEH-007; SCN-001–005; DEC-001–004; U-001, U-002.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL (normal entry point, no preview switch): `http://127.0.0.1:4610/chat?id=run-research-001` (and `/workspace`)
- Explicit user-confirmation reference (2026-10-08):
  - Round 1 (dedicated "Expand left panel" toggle at the top of the strip) was rejected: "This is not really a dedicated one ... it looks really strange. Do we have other options?"
  - Root cause requested and agreed: "What do you think the root problem is? ... Maybe we have some navigation problems in general."
  - Direction: "Yeah, put a separate icon on so that I can experience it."
  - Divider: "The separator looks nice. Maybe we make the separator looks a little bit lighter."
  - Design confirmation: "Okay, I think this design is okay. I think this design is okay with a separate icon. Do it, because this will solve our navigation problem."
  - Icon: "I guess tree is a good one", and then "i am fine with the tree icon you chosed earlier ... the tree icon is good. I confirm".
- Final validation date: 2026-10-08, on the refreshed baseline (WEB-BASELINE-REFRESH-008, source pin `1cd1a3abc`).

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web`. Surfaces: the collapsed left strip (`LeftSidebarStrip`), the docked left panel (`AppLeftPanel`), the narrow-window drawer and the Workspaces tree.
- Pinned source commit or revision: `origin/personal@1cd1a3abc126df820e334c023621d0fb82de5b7b`. Baseline refreshed for this ticket by `WEB-BASELINE-REFRESH-008`, accepted and integrated as `9232842`.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- UI reference revision or commit: recorded in `product-ticket.md` (Finalization).
- Ticket folder: `tickets/done/collapsed-left-panel-expand-keeps-run/`
- Baseline report path: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md` (WEB-BASELINE-REFRESH-008)

## Problem And Design Rationale

- **User problem and intent:**
  - The user keeps the left panel collapsed. They open a worker from an In Progress Task card in the right Projects tab, then want the panel back to see that run in the tree: which team or member it is, its siblings, its status.
  - Every strip icon also changes the page. Chat opens New chat, so the run is lost.
- **Root cause (agreed with the user):**
  - The collapsed strip keeps only the page icons. The Workspaces tree, where the open run lives, has no place in it.
  - Chat is lit on any `/chat` route, including an open run (`/chat?id=…`), but clicking it opens New chat. The lit icon takes the user away from where they are.
  - Team and Org runs (`/workspace`) light no strip icon at all.
- **Key UX decisions:**
  1. **Workspaces gets its own strip icon (DEC-001 option D).** It sits after the page icons, behind a light divider, as Workspaces sits below the page list in the docked panel. The strip reads as the panel, shrunk.
  2. **The lit icon is where you are.**
     - Workspaces is lit whenever a run is open, of any kind.
     - Chat is lit only on New chat, in the strip and in the docked Chat row.
  3. **Workspaces opens the panel on the open run and never changes the page.**
     - The run's row is selected, its ancestors open, and it is scrolled into view.
     - It works like the right strip's icons, which open their panel without navigating.
  4. **Page icons keep their meaning (DEC-002 a):** they open the panel and go to their page.
  5. **No separate expand/collapse glyph in the strip.** The docked panel's collapse button is unchanged.
- **Alternatives considered:**
  - Round 1, a dedicated "Expand left panel" toggle (DEC-001 A): built and rejected by the user as visually foreign. It fixed the symptom but left the misleading Chat highlight and the missing location for Team/Org runs.
  - DEC-001 B/C, Chat only expands while a run is open: it gives one icon two meanings based on hidden state. Not built.
  - Auto-open the left panel when a run is opened from a Task card (user's idea), not recommended:
    - it overrides an explicit collapse
    - it is inconsistent across entry points
    - it covers the content in the narrow drawer
    - it leaves the Chat trap

    The user chose the Workspaces icon.
  - DEC-002 b, page icons navigate but stay collapsed: changes a documented contract. Not needed.
  - Workspaces glyph candidates: stack, list, tree, file tree, folders, briefcase, layers (`review-evidence/round-2/R2-08-workspaces-icon-candidates-2x.png`). Tree was chosen:
    - it shows what the click opens
    - it doesn't look like any other strip icon
    - Folders looks like the adjacent Projects folder

## Scope And Experience Goal

- User or actor: a desktop user who keeps the left panel collapsed.
- Context: wide window (strip redocks the panel) and narrow/short window (strip opens the drawer).
- Goal: get back to the open run's place in the tree without leaving it.
- Observable success:
  - With the panel collapsed and a worker open from a Task card, the Workspaces icon is lit.
  - One click docks the panel. The route, the center, the right panel/tab and any draft are unchanged.
  - The worker's row is selected and visible in the tree.
- In-scope surfaces and journeys:
  - the strip (Workspaces icon, divider, highlight rule, short-window spacing)
  - the docked Chat row highlight
  - revealing the open run when the panel appears (docked or drawer)
  - focus movement
  - en/zh-CN strings
- Non-goals:
  - right strip/panel
  - `/mobile`
  - keyboard shortcut
  - keeping other manual tree expansions (DEC-003)
  - auto-scroll while the panel is already docked (DEC-004)
  - changing what Chat, the pencil or page icons do when clicked

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-001 / AC-010 (superseded by D) | The strip shows a **Workspaces** icon (tree glyph) after the page icons. It has a tooltip and accessible name "Workspaces" / "工作区", is keyboard focusable, and Enter/Space activate it. Present in both strip modes. | UXJ-001, UXJ-005; VIS-001, VIS-002 |
| REQ-002 / AC-001, AC-005, AC-009 | Activating Workspaces shows the panel (docked or drawer) and changes nothing else: route, open run, center, draft text, right panel/tab. | UXJ-001–005; VIS-003, VIS-007 |
| REQ-003, REQ-005 / AC-001–AC-004 | When the panel appears with a run open, the run's row is selected, all ancestors open (incl. nested sub-team rows), scrolled into view if not fully visible. This applies to any entry point. | UXJ-001–004; VIS-003, VIS-004, VIS-005 |
| REQ-004 / AC-008 | The reveal opens no other run and selects nothing else. | all |
| REQ-006 / AC-009 | With no run open, Workspaces just shows the panel; nothing newly selected. | UXJ-006 |
| REQ-007 / AC-006, AC-007 (amended) | Page icons unchanged. The docked collapse button, Chat row and pencil clicks are unchanged. **Changed:** Chat is highlighted only on New chat (`/chat` with no run id), in both the strip and the docked Chat row. | UXJ-006, UXJ-007; VIS-006, VIS-003 |
| New (Workspaces highlight) | Workspaces is highlighted while a run is open: `/chat?id=…` (Agent run), `/workspace` (Team/Org run). | VIS-001, VIS-004 setup |

Requirement impact for Solution Designer:
- DEC-001 → D.
- REQ-001 / AC-010 → Workspaces icon instead of "Expand left panel".
- REQ-007 / AC-006 / AC-007 → Chat highlight rule changes.
- New highlight rule for Workspaces.

## Visual Language

- **Existing product language to preserve:** the strip is a 50 px white column with a `gray-200` right border and `py-4`. Its icon buttons are `p-2` (36 × 36), `rounded-md`, 20 px glyph, `gray-500`, hover `bg-gray-100`. The dark tooltip is `gray-900`, white `text-xs`, `px-2 py-1`, `rounded`, 8 px to the right.
- **Layout structure:** page icons (Chat … Nodes), then the divider, then Workspaces, all in one column with an 8 px gap. Settings stays pinned at the bottom.
- **Grid, dimensions, spacing:**
  - Divider: 24 × 1 px, centred, with the column's 8 px gap above and below.
  - Workspaces button: 36 × 36.
  - Windows ≤ 540 px tall: the divider is hidden and the column gap becomes 4 px.
- **Typography:** tooltip only, unchanged from the other strip items.
- **Color values (project palette in `tailwind.config.js`):**
  - divider `gray-100` `#e6e6e6`
  - icon `gray-500` `#808080`
  - lit icon `gray-900` `#1a1a1a` on `gray-100` `#e6e6e6`
  - tooltip `gray-900`
- **Surfaces, borders, radii, shadows:** unchanged; `rounded-md` button.
- **Controls, icons:** Workspaces glyph is Phosphor `ph:tree-view` (bundled `@iconify-json/ph`, the same set as Memory's `ph:brain`), at `h-5 w-5`.
- **Hover, active, focus, selected:**
  - Hover: `bg-gray-100`.
  - Lit (run open): `bg-gray-100 text-gray-900` plus `aria-current="location"`.
  - Never "pressed".
  - Focus: the browser focus ring, as for the other strip buttons.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Strip Workspaces button | Opens the left panel on the open run; shows where you are | default, hover + tooltip, lit (run open), keyboard focus; redock vs. drawer activation | `components/layout/LeftSidebarStrip.vue` |
| Strip divider | Separates pages from your work | shown (> 540 px tall), hidden (≤ 540 px) | same |
| Chat highlight rule | Chat lit only on New chat | strip icon and docked Chat row | `composables/useShellPrimaryNavigation.ts` (`isRunOpen`) |
| Tree reveal on appear | Select, open ancestors (incl. nested sub-team rows) and scroll the open run's row into view | docked expand, drawer open, app start | `composables/useWorkspaceHistoryTreeState.ts`, `components/workspace/history/useRevealSelectedTreeRow.ts` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Desktop, wide, panel collapsed | Agent run open; right Projects tab; worker opened from an In Progress Task card | See that worker in the tree | Panel docked; worker row selected and visible; route/center/right tab unchanged | SCN-001, REQ-001–005, AC-001 |
| UXJ-002 | Desktop, wide, panel collapsed | Team member inside a nested sub-team open | See the member in its sub-team | Sub-team rows open; member selected and visible | SCN-002, AC-002, U-002 |
| UXJ-003 | Desktop, short-ish window, collapsed, keyboard | Org member open, far down the tree | See the member | Tree scrolled to centre the row; row focused | SCN-003, AC-003, AC-004 |
| UXJ-004 | Narrow window | Run open, strip in drawer mode | See the run | Drawer opens with the run revealed; Escape returns focus to Workspaces | SCN-005, AC-005 |
| UXJ-005 | Desktop, wide, collapsed | Any page | Go to a page | Page icon docks the panel and navigates (unchanged) | SCN-004, AC-006 |
| UXJ-006 | Desktop, collapsed | New chat (typed text or none) | Open the panel | Chat lit, Workspaces not; Workspaces opens the panel, draft text kept, nothing selected | REQ-006, AC-009 |
| UXJ-007 | Desktop, docked | Run open | Collapse | The panel's collapse button collapses it; focus lands on Workspaces | BEH-003, AC-007 |

## Journey Details

- **UXJ-001** (VIS-001 → VIS-003):
  1. The panel is collapsed and an Agent run is open, with the right Projects tab showing the board.
  2. The user clicks an In Progress card's worker line ("documentation writer"). The worker opens in the center; the strip stays collapsed; **Workspaces is lit and Chat is not**.
  3. The user clicks Workspaces. The panel docks immediately, with no animation (unchanged).
  4. The tree shows the host run and its task rows, with "documentation writer" selected (`bg-indigo-50`, indigo text, inset rail).
  5. The URL, the center header and the right Projects tab are unchanged. The docked Chat row is not lit.
  6. Focus moves to the Workspaces section and then onto the selected row (a focus ring only after keyboard use).
- **UXJ-002** (VIS-004): opening the colorist inside Video Team › post_production, then collapsing, then Workspaces. The panel docks with post_production opened and colorist selected. Before this design the sub-team stayed closed and the member was hidden (U-002, confirmed).
- **UXJ-003** (VIS-005):
  1. Org member "writer" is open and the panel is collapsed; focus is on Workspaces (after collapse).
  2. Enter docks the panel. The tree scrolls once so the row is centred (here by 247 px at 1440 × 620), and focus is on the row.
- **Reveal rules:**
  - The scroll happens only if the row is not fully visible, and centres it so its siblings show.
  - The reveal waits up to 3 s for rows that load after the panel appears.
  - Any wheel, press or key inside the tree cancels a pending reveal.
  - Other groups are not touched.
- **UXJ-004** (VIS-007): narrow window; the strip shows the same Workspaces icon, lit. Click or Enter opens the drawer with the run selected; drawer focus handling is unchanged. Escape or the backdrop closes it and returns focus to Workspaces.
- **UXJ-005:** the page icons are unchanged (dock + navigate).
- **UXJ-006** (VIS-006): on New chat, Chat is lit and Workspaces is not. Workspaces docks the panel; the typed text stays; no run is selected (a Draft row may show as selected per its own approved design).
- **UXJ-007:** the docked collapse button collapses the panel (unchanged); focus moves to the strip's Workspaces icon.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Collapsed left strip | Any route, panel collapsed | Pages, plus Workspaces to return to your work | Page icons · divider · Workspaces … Settings (bottom) | VIS-001, VIS-002, VIS-006, VIS-008 |
| UIS-002 | Docked left panel with revealed run | After Workspaces (wide) | Show where the open run sits | Page rows; Workspaces tree with the run selected and in view | VIS-003, VIS-004, VIS-005 |
| UIS-003 | Left drawer with revealed run | After Workspaces (narrow) | Same, as an overlay | Drawer over content; tree with the run selected | VIS-007 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Strip, wide, run open | Click / Enter / Space on Workspaces | Panel docks | UIS-002 with the run revealed; focus moves to the row | None: no route, run, draft or right-panel change | Browse tree; collapse |
| TR-002 | Strip, narrow/short | Click / Enter / Space on Workspaces | Drawer opens | UIS-003 with the run revealed | None | Escape/backdrop: close, focus returns to Workspaces |
| TR-003 | Strip, no run open | Workspaces | Panel docks / drawer opens | Panel shown; nothing newly selected | None | — |
| TR-004 | Any, collapsed | Run opened (Task card, Team tab, tree, first send) | Workspaces lights up; Chat unlights | Strip shows location | — | TR-001 |
| TR-005 | Docked | Collapse button | Panel collapses | Strip; focus on Workspaces | — | TR-001 |
| TR-006 | Strip | Page icon | Panel docks, page changes | Unchanged behavior | Route change | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Strip / run open | `/chat?id=…` or `/workspace` | Workspaces lit; Chat not lit | All strip icons | — | VIS-001 |
| Strip / New chat | `/chat` (no id) | Chat lit; Workspaces not lit | All | — | VIS-006 |
| Strip / other page | e.g. `/projects`, `/agents` | That page's icon lit; Workspaces not lit | All | — | (unchanged rule) |
| Strip / hover Workspaces | pointer | Tooltip "Workspaces" | — | — | VIS-002 |
| Strip / short window | height ≤ 540 px (> 480, where the strip is still shown) | Divider hidden; 4 px gap; Settings visible | All | — | VIS-008 |
| Tree / row off-screen | panel appears | Row centred in the tree | — | User scroll cancels | VIS-005 |
| Tree / row already visible | panel appears | No scroll | — | — | VIS-003, VIS-004 |
| Tree / run's rows not loaded yet | panel appears | Reveal applies when rows arrive (≤ 3 s) | — | — | — |

## Content, Labels, Validation, And Feedback

- Product voice: existing nav labels.
- Exact labels: en "Workspaces"; zh-CN "工作区". The key is `shell.navigation.workspaces`, and the strings match the docked panel's "Workspaces" section heading.
- Empty, error and recovery messages: N/A. No new messages.

### Form And Input Validation

N/A — no inputs.

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Wide desktop, user-collapsed | strip activation `redock-panel` | Strip with Workspaces | Workspaces docks the panel |
| Narrow or short window | strip activation `open-drawer` (existing policy) | Same strip | Workspaces opens the drawer |
| Short window with strip | 481–540 px tall | Divider hidden, 4 px gap | — |
| `/mobile` | — | Out of scope | — |

## Accessibility And Keyboard Behavior

- Accessibility target: the existing product (keyboard reachable, named controls).
- Focus order, movement and return:
  - Workspaces follows Nodes in tab order.
  - After collapse, focus goes to Workspaces.
  - After a docking Workspaces, focus goes to the Workspaces section and then to the revealed row.
  - When the drawer closes, focus returns to Workspaces.
- Keyboard: native button; Enter/Space.
- Roles, names and states: `aria-label` and `title` are "Workspaces"; `aria-current="location"` while lit. The selected standalone Agent run row now carries `aria-current="true"`, like the other tree rows.
- Contrast: the icon uses the strip's existing colors. The divider is decorative (`aria-hidden`).

## Motion And Transitions

- Unchanged — follows baseline. The panel docks without animation; the drawer slide is unchanged.
- The tree scroll is instant (no smooth scroll), because the panel has just appeared.
- Reduced motion: N/A (no new motion).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| "Run open" | Workspaces/Chat highlight | Route rule: `/chat` with `id`, or `/workspace` | Same rule on the real routes; engineering may use the selection state if equivalent |
| Tree rows load after the panel mounts | Reveal timing | Synthetic fixtures; reveal waits up to 3 s | Real tree fetch; the reveal must wait for the run's rows (R-001) |
| Nested sub-team ancestry | UXJ-002 | `expandTeamMemberAncestors` for the team's focused member during the reveal | Same, for Task-card, Team-tab and first-send opens |
| Video Team › post_production, colorist, sound_designer | UXJ-002 | Illustrative synthetic fixture added by this ticket | — |
| Task roots | UXJ-001 | Baseline fixtures have Agent-hosted roots only | Team/Org-hosted Task cards must reveal the same way (REQ-005) |

## Final Visual Reference Inventory

All images are in `visual-references/`. They were captured after confirmation, on the merged ticket branch at the refreshed baseline.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001: collapsed, worker open from the Projects tab | 1440×900 | `visual-references/VIS-001-collapsed-run-open-workspaces-lit-desktop-1440x900.png` | Workspaces after the divider, lit; Chat not lit; Projects tab still selected | Run, task, worker and conversation text |
| VIS-002 | UIS-001 hover | 1440×900 crop @2x | `visual-references/VIS-002-strip-workspaces-lit-hover-tooltip-desktop-1440x900-crop-2x.png` | Tree glyph, lit fill, divider tone, tooltip | Conversation text |
| VIS-003 | UXJ-001 result | 1440×900 | `visual-references/VIS-003-workspaces-opens-panel-run-revealed-desktop-1440x900.png` | Docked; worker row selected and in view; Chat row not lit; center and Projects tab unchanged | Tree names and counts |
| VIS-004 | UXJ-002 result | 1440×900 | `visual-references/VIS-004-nested-subteam-member-revealed-desktop-1440x900.png` | Nested sub-team opened, member selected | Team/member names; Reconnect warning icons (other approved design) |
| VIS-005 | UXJ-003 result (keyboard) | 1440×620 | `visual-references/VIS-005-org-member-scrolled-into-view-keyboard-focus-desktop-1440x620.png` | Tree scrolled to the member; keyboard focus ring on the row | Org names; exact scroll offset |
| VIS-006 | UXJ-006, New chat | 1440×900 | `visual-references/VIS-006-collapsed-new-chat-chat-lit-desktop-1440x900.png` | Chat lit, Workspaces not lit | — |
| VIS-007 | UXJ-004 drawer | 760×900 | `visual-references/VIS-007-narrow-window-drawer-run-revealed-760x900.png` | Drawer with the open run selected | Drawer initial focus on Chat is existing behavior |
| VIS-008 | Short window strip | 1440×500 | `visual-references/VIS-008-short-window-strip-desktop-1440x500.png` | Divider hidden, tighter gap, Settings visible | — |

## Linked UI Reference Evidence

- Runnable UI reference: design repository default branch `personal` (after integration). Ticket worktree during review: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/collapsed-left-panel-expand-keeps-run`.
- Ticket record: `product-ticket.md`
- Run instructions: `corepack pnpm install --ignore-workspace --frozen-lockfile && corepack pnpm dev --port 3210`. Open `/chat?id=run-research-001`, collapse the panel, open the right Projects tab, and click "documentation writer".
- Relevant supporting artifacts: `review-evidence/round-1/` (rejected toggle), `review-evidence/round-2/` (Workspaces icon, divider, icon candidates, probes), `review-evidence/final/final.mjs`.
- Journeys: UXJ-001–007; transitions TR-001–006.
- Mocked boundaries and limitations: see Data, Contract, And Mock Boundaries.

## Implementation Fidelity Boundary

- Must preserve exactly:
  - placement, glyph, colors, spacing and the short-window rule
  - highlight rules for Workspaces and Chat
  - no navigation on Workspaces
  - reveal behavior (select, open ancestors incl. nested sub-teams, scroll only when needed, centred)
  - focus movement
  - strings
- The UI reference's route-based `isRunOpen`, the MutationObserver-based reveal wait and the `data-nav-key` used for drawer focus return are simulations. They do not prescribe production architecture.
- May vary: fixture names and counts, the exact scroll offset, and the reveal wait limit (a short wait that tolerates normal tree loading).
- Design-system constraints: existing strip button style; icon from the bundled Phosphor set.

## Out Of Scope

- DEC-003: keeping other manual tree expansions across collapse → expand. Proposed out of scope; the user did not ask for it.
- DEC-004: auto-scroll when a run opens while the panel is already docked. Proposed out of scope; the user did not ask for it.
- Right strip/panel, `/mobile`, keyboard shortcut, auto-opening the panel on run open.

## Open Decisions And Risks

- Requirement impact for Solution Designer (above): DEC-001 → D; REQ-001/AC-010 and REQ-007/AC-006/AC-007 amended; new Workspaces highlight rule.
- R-001: the reveal must wait for the run's rows after mount.
- R-002: the existing probe D11 reopens via the strip Chat icon; it should use Workspaces.
- The baseline has no Team- or Org-hosted Task-card fixtures. Those entry points are covered by REQ-005 and must be checked in the product.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes`
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
