# Product Ticket — collapsed-left-panel-expand-keeps-run

## Identity And Scope

- Ticket / request ID: `collapsed-left-panel-expand-keeps-run`. This is the stable package identifier; there is no second ID.
- Title: Expand the collapsed left panel without leaving the open run, and see that run in the Workspaces tree.
- Mode: `Product Experience Design`. It evolves the accepted AutoByteus Web baseline: left strip, docked panel, drawer and Workspaces tree.
- Status: `Awaiting User Review` (round 1)
- Requester: Solution Designer (`/software_engineering_team/solution_designer`, AgentRun `solution_designer_6856168b4a8d4175a6896c5eac1b26e2`) for the user, 2026-10-08.
  - User: "delegate a task to @Product Team to work on the UI first thanks"
- Request package: `/Users/normy/autobyteus_org/autobyteus-worktrees/collapsed-left-panel-expand-keeps-run/tickets/in-progress/collapsed-left-panel-expand-keeps-run/product-design-request.md`
- Related requirements revision: `requirements-doc.md` SR-001, status `Ready for Approval` (not approved).
- Related IDs: REQ-001–007; AC-001–010; BEH-001–005, BEH-007; SCN-001–005; DEC-001–004; U-001, U-002.
- Critical journey: SCN-001. With the panel collapsed, a Task worker is open. The user clicks Expand left panel. The panel docks, the same worker stays open, and its row is selected and visible in the tree.
- In scope:
  - the strip's expand control (DEC-001)
  - the strip navigation icons (DEC-002)
  - revealing the open run when the panel appears, for every run kind
  - the narrow-window drawer
  - keyboard focus
  - en/zh-CN strings
- Non-goals:
  - right strip/panel
  - `/mobile`
  - keyboard shortcut
  - keeping other manual tree expansions (DEC-003)
  - auto-scroll while the panel is already docked (DEC-004)

## Proposed Design (round 1)

- DEC-001 = A. A dedicated **Expand left panel** control is the strip's first item:
  - the same panel glyph as the docked panel's Collapse left panel button, at the strip's 20 px icon size
  - the strip's standard button: `p-2`, `rounded-md`, `gray-500`, hover `bg-gray-100`
  - the standard dark tooltip; never shown as active
  - a 24 × 1 px `gray-200` divider separates it from the navigation icons
  - it expands only: no route, run, draft or right-panel change
- DEC-002 = a. The navigation icons are unchanged: they expand the panel and go to their page.
- Reveal when the panel appears (docked expand, drawer open):
  - the open run's row is selected and all its ancestors are opened, including a member's nested sub-team rows
  - if the row is not fully visible, the tree scrolls once so the row is centred and its siblings show; a row already in view does not move
  - a user scroll, press or key in the tree cancels a pending reveal
  - nothing else opens or closes
- Focus:
  - after expanding (docked), focus moves to the panel's Collapse left panel button; after collapsing, focus moves to Expand left panel
  - in the drawer, Escape or the backdrop returns focus to Expand left panel
- Short windows (481–540 px tall, where the strip still shows): the divider hides and the icon gap goes from 8 px to 4 px, so Settings stays visible.
- Strings: en "Expand left panel"; zh-CN "展开左侧面板".

## Alternatives (described, not built)

- DEC-001 B, Chat icon only expands while a run is open. Not recommended:
  - Chat means New chat everywhere else (docked row, pencil, documented contract), so one icon would change meaning based on hidden state
  - the other icons would still navigate
  - with no run open there is still no way to expand without navigating
- DEC-001 C, A and B. Not recommended: it adds B's inconsistency for no extra capability once A exists.
- DEC-002 b, icons navigate but stay collapsed. A coherent option for people who keep the panel collapsed, but:
  - it changes a documented strip contract (`workspace_layout.md`)
  - the left strip would then work differently from the right strip, whose icons do open the panel
  - it is not needed to solve the request

  Can be built if the user wants to see it.

## Repository And Baseline

- Canonical design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`, default branch `personal`, remote `origin` = `https://github.com/AutoByteus/autobyteus-web-prototype.git`.
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/collapsed-left-panel-expand-keeps-run`
- Ticket branch: `design/collapsed-left-panel-expand-keeps-run`
- Accepted design base: `origin/personal@afed67a3c47af204f6b34bcd941c200093a3faf0` (fetched 2026-10-08; local `personal` equal, no unpushed work).
- Selected frontend (read-only): `autobyteus-web`. Request source is `/Users/normy/autobyteus_org/autobyteus-worktrees/collapsed-left-panel-expand-keeps-run/autobyteus-web` @ `3a2496c95b16b0f7e0cedc7afdf615ada00b2267`.
- Baseline report and source pin: `ui-baseline-report.md`, WEB-BASELINE-REFRESH-007 (accepted), pin `10fb69504f99a615e0728ffdd6c1fcab0104ff05`, plus the accepted design tickets since.
- Applicability check at intake (scoped surfaces vs. request source `3a2496c95`):
  - Identical: `LeftSidebarStrip.vue`, `layouts/default.vue`, `utils/layout/responsiveStripActivation.ts`, `composables/useWorkspaceHistoryTreeState.ts`, `WorkspaceHierarchyBranches.vue`.
  - `AppLeftPanel.vue`: only the New chat click wiring differs; markup and styles are identical.
  - Tree rows and tree panel differ only by other tickets' work:
    - source-side: group archive, Task Team icon, row-leave motion
    - design-side: Reconnect markers
  - None of these touch the strip, the expand path or the reveal. No baseline correction is needed for the changed area.
- Known baseline gap (outside the changed area, recorded, not blocking):
  - Gap: the right-panel **Projects tab** (source `0fd265652`, "a Projects tab in the right panel") and **Team/Org-hosted Task cards** (`useTaskRootNavigation`) are not in the UI reference.
  - The UI reference's Task worker links live on the Projects pages and open Agent-hosted workers only.
  - Effect on this review: REQ-005 makes the reveal independent of the entry point, so the review uses the baseline's real entries:
    - Projects page Task worker link (Agent-hosted Task)
    - tree opens before collapsing (Team member, nested sub-team member, Org member)
  - Recommended follow-up: a focused baseline refresh for the right-panel Projects tab and Team/Org-hosted Task cards.
- Baseline also lacks a right-panel Team-tab member list. The Team tab shows team messages here, so the Team-tab entry path cannot be exercised either.
- Legacy scenario `workspace_team_hierarchy_review` throws `Invalid AgentTeam address 'undefined'` in the current baseline. It is not used.

## Runtime

- Review server: `corepack pnpm dev --port 4610` in the ticket worktree. This ticket owns the process; the log is `/tmp/autobyteus-design-collapsed-left-expand-dev.log`.
- Entry: normal product URLs (`/projects`, `/workspace`, `/chat?id=…`). No preview switch, overlay or scenario key.
- State: panel visibility and tree expansion are in memory. Project-manager fixtures persist in localStorage; reset with `__resetProjectManager()`.

## Design Changes (UI reference)

- DC-001 `components/layout/LeftSidebarStrip.vue`:
  - Expand left panel control (first item) and divider
  - `handleExpandClick` (redock or drawer; focus to Collapse after docking)
  - short-window spacing
  - `data-nav-key="expand-left-panel"` so drawer focus returns
- DC-002 `localization/messages/{en,zh-CN}/shell.generated.ts`: `shell.components.layout.LeftSidebarStrip.expand_left_panel`.
- DC-003 `components/AppLeftPanel.vue`: `data-test="app-left-panel-collapse"`; after collapse, focus moves to Expand left panel.
- DC-004 `composables/useWorkspaceHistoryTreeState.ts`: the Team reveal also opens the focused member's sub-team ancestor rows (fixes U-002).
- DC-005 `components/workspace/history/useRevealSelectedTreeRow.ts` (new) and `WorkspaceAgentRunsTreePanel.vue`: scroll the open run's row into view when the panel appears.
- DC-006 `components/workspace/history/WorkspaceHistoryWorkspaceSection.vue`: `aria-current="true"` on the selected standalone Agent run row (a11y, and the scroll target).
- DC-007 `prototype/agent-reconnect/agentReconnectFixture.ts`:
  - synthetic nested sub-team `/post_production` (colorist, sound_designer) in Video Team
  - colorist transcript
  - illustrative fixture only

## Validation (round 1)

Probes in `review-evidence/round-1/*.mjs` (Playwright, Chromium, against `http://127.0.0.1:4610`):

- SCN-001 / AC-001:
  - `/projects` → collapse → Prototype Launch → "docs review team" worker → center shows reviewer, panel stays collapsed
  - Expand: URL unchanged (`/chat?id=run-ptm-0001`); center and right Team tab unchanged
  - Tree: "reviewer" selected under "docs review team", visible; focus is on Collapse left panel
- SCN-002 / AC-002, nested:
  - Video Team → post_production → colorist → collapse → Expand: URL unchanged; `post_production` reopened, colorist `[CURRENT]` and visible
  - Without DC-004 the same run left `post_production` closed and colorist hidden (U-002 confirmed)
- SCN-003 / AC-003 / AC-004, Org:
  - Product Launch Org → run → review team → writer → collapse → Expand: writer selected and visible; URL unchanged
  - At 1440×620 the tree scrolled 239 px to reveal it; at 1440×900 there was no scroll (already visible)
- SCN-004 / AC-006: the strip Agents icon still expands the panel and goes to `/agents?view=list`.
- SCN-005 / AC-005, 760×900:
  - the strip is `open-drawer`; Tab reaches Expand left panel first; Enter opens the drawer with the open run selected; URL unchanged
  - Escape returns focus to Expand left panel
- AC-009: on New chat with typed text, collapse → Expand: `/chat` unchanged, text kept, nothing newly selected.
- Strip fit at 481/500/540/541/900 px tall: no overflow. The divider hides at ≤540 px.
- `npx vue-tsc --noEmit -p tsconfig.prototype.json`: 0 errors.

## Outcome And Handoff

- Interim review aids (not normative): `review-evidence/round-1/R1-01…R1-07*.png`.
- Remaining product decisions: user confirmation of DEC-001 A and DEC-002 a; DEC-003/DEC-004 proposed out of scope.
- Next expected action: user review of the running UI reference, then revise or confirm.
- Handoff outcome from `get_handoff_rules`: pending (interim `Awaiting User Review`).
