# Product Ticket — collapsed-left-panel-expand-keeps-run

## Identity And Scope

- Ticket / request ID: `collapsed-left-panel-expand-keeps-run`. This is the stable package identifier; there is no second ID.
- Title: Expand the collapsed left panel without leaving the open run, and see that run in the Workspaces tree.
- Mode: `Product Experience Design`. It evolves the accepted AutoByteus Web baseline: left strip, docked panel, drawer and Workspaces tree.
- Status: `Completed`
- Requester: Solution Designer (`/software_engineering_team/solution_designer`, AgentRun `solution_designer_6856168b4a8d4175a6896c5eac1b26e2`) for the user, 2026-10-08.
  - User: "delegate a task to @Product Team to work on the UI first thanks"
- Request package: `/Users/normy/autobyteus_org/autobyteus-worktrees/collapsed-left-panel-expand-keeps-run/tickets/done/collapsed-left-panel-expand-keeps-run/product-design-request.md`
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

## Round 1 Feedback And Round 2 (current proposal)

- Round 1 feedback from the user: "This is not really a dedicated one ... it looks really strange. Do we have other options? ... What do you think the root problem is? ... Maybe we have some navigation problems in general."
- Root cause, verified in the source:
  - The collapsed strip keeps only the page icons. The Workspaces tree (where the open run is) has no strip icon.
  - `isShellPrimaryRouteActive('chat')` is true on any `/chat` path, including `/chat?id=<run>`, but clicking Chat opens New chat. The lit icon takes the user away from the run.
  - Team and Org runs (`/workspace`) light no strip icon.
  - Left-strip icons are pages; right-strip icons are panel tabs.
- User suggestion considered: auto-open the left panel when a run is opened from a Task card. Advised against as the main fix:
  - it overrides an explicit collapse
  - it is inconsistent across entry points
  - it covers the content in the narrow drawer
  - it leaves the Chat trap
- User decision: "Yeah, put a separate icon on so that I can experience it." The user also said: "I'm not sure whether this is good or not."
- Requirement Impact: sent to Solution Designer (AgentRun `solution_designer_6856168b4a8d4175a6896c5eac1b26e2`, delivered 2026-10-08) as exploratory and pending the user's decision.
- Round 2 design (DEC-001 option D):
  - **Workspaces icon:**
    - Placed in the collapsed strip after the page icons, behind a 24 × 1 px `gray-100` (#e6e6e6) divider, mirroring the docked panel's Workspaces section below the page list.
    - Glyph `ph:tree-view` at 20 px (chosen by the user; was `heroicons:rectangle-stack`); standard strip button and tooltip "Workspaces" / "工作区".
    - Lit (`bg-gray-100 text-gray-900`, `aria-current="location"`) whenever a run is open: `/chat?id=…` or `/workspace` (Team/Org).
    - Click: shows the panel (docked, or the drawer) with the open run revealed: selected, ancestors open, scrolled into view. It never navigates.
    - With no run open it just shows the panel.
  - **Chat:** lit only on New chat (`/chat` with no id), in the strip and the docked Chat row. Its click is unchanged (always New chat).
  - **Removed:** the round 1 Expand left panel toggle, its divider and its string.
  - **Unchanged:** the page icons (DEC-002 a) and the docked panel's collapse button.
  - **Focus:**
    - collapse moves focus to the Workspaces icon
    - Workspaces (docked) moves focus to the Workspaces section, then onto the open run's row once it is revealed (a focus ring shows only after keyboard use)
    - the drawer returns focus to Workspaces on Escape or backdrop
  - **Short windows (≤540 px tall):** the divider hides and the gap goes from 8 px to 4 px.
- Round 2 changes:
  - DC-008 `LeftSidebarStrip.vue`: toggle replaced by the Workspaces icon (`handleWorkspacesClick`).
  - DC-009 `useShellPrimaryNavigation.ts`: `isRunOpen`; Chat is active only when no run is open.
  - DC-010 strings: `shell.navigation.workspaces`; `expand_left_panel` removed.
  - DC-011 `AppLeftPanel.vue`: focus after collapse goes to Workspaces.
  - DC-012 `useRevealSelectedTreeRow.ts`: focus the revealed row when opened from Workspaces.
  - DC-013 `LeftSidebarStrip.vue`: divider lightened from `gray-200` (#cccccc) to `gray-100` (#e6e6e6), the strip's own hover/active fill. User: "The separator looks nice. Maybe we make the separator looks a little bit lighter." Evidence: `review-evidence/round-2/R2-07-strip-lighter-divider-2x.png`.
- Round 2 validation (`review-evidence/round-2/r2.mjs`, Chromium):
  - SCN-001 (1440×900): Workspaces lit while collapsed. Click: URL `/chat?id=run-ptm-0001` unchanged; reviewer selected, visible and focused; docked Chat row not lit.
  - SCN-002: colorist in nested post_production revealed, visible and focused; `/workspace` unchanged.
  - SCN-003 (1440×620, keyboard): writer revealed, tree scrolled 239 px, focused; URL unchanged.
  - SCN-005 (760×900): Workspaces lit; Enter opens the drawer with the host run selected; Escape returns focus to Workspaces.
  - SCN-004: Agents icon goes to `/agents?view=list` and docks.
  - New chat: Chat lit, Workspaces not.
  - AC-009: draft text kept; nothing selected.
  - Strip at 481/540/541 px tall: no overflow.
  - `vue-tsc`: 0 errors.

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

- Interim review aids (not normative): `review-evidence/round-1/` (superseded) and `review-evidence/round-2/`.
- Remaining product decisions: user confirmation of DEC-001 D (Workspaces icon, Chat highlight) and DEC-002 a; DEC-003/DEC-004 proposed out of scope.
- Next expected action: user review of the running UI reference, then revise or confirm.
- Handoff outcome from `get_handoff_rules`: pending (interim `Awaiting User Review`).

## User Confirmation And Pause (2026-10-08)

- User confirmation of the round-2 design: "Okay, I think this design is okay. I think this design is okay with a separate icon. Do it, because this will solve our navigation problem."
- Still open, pending the user's choice: the Workspaces icon glyph. Candidates are in `review-evidence/round-2/R2-08-workspaces-icon-candidates-2x.png`; the current glyph is `heroicons:rectangle-stack`.
- The user flagged the outdated baseline: "I think the UI is not up to date ... there's no projects tab on the right side ... the real application has the projects tab on the left side of files."
  - This is the gap already recorded under Repository And Baseline.
  - Opened `WEB-BASELINE-REFRESH-008`: worktree `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-008`, refresh to `origin/personal@1cd1a3abc`.
  - `Baseline Needed` (Refresh) was sent to the UI Baseline Bootstrapper.
- After the refresh is accepted and integrated:
  1. Merge `origin/personal` into this ticket branch.
  2. Revalidate SCN-001 from the real right-panel Projects tab, and SCN-002/003 from Team- and Org-hosted Task cards.
  3. Capture the final VIS references, write `ui-ux-spec.md`, and finalize.
- Icon decision (2026-10-08): the user said "I guess tree is a good one", in agreement with the recommendation of candidate C, `ph:tree-view` (Phosphor, already bundled; same set as Memory).
  - DC-014 `LeftSidebarStrip.vue`: the Workspaces glyph becomes `ph:tree-view`.
  - Evidence: `review-evidence/round-2/R2-09-strip-tree-icon-hover-2x.png`.
- Tree icon confirmed again: "i am fine with the tree icon you chosed earlier ... the tree icon is good. I confirm by the way."

## Baseline Refresh And Final Validation (2026-10-08)

- `WEB-BASELINE-REFRESH-008` was returned `Completed` by the Bootstrapper, then reviewed and accepted. It was integrated into `personal` as `9232842`; the new source pin is `1cd1a3abc`.
- Merged `origin/personal` into this ticket branch (`86f6c67`). The only conflict was the `AppLeftPanel.vue` vue import line, resolved to `computed, nextTick, onMounted`.
- After the merge, the Vite dependency cache had to be cleared (stale vendored `@autobyteus/collaboration-stream-contracts`). This is local dev state only.
- Final validation (`review-evidence/final/final.mjs`, log `final.log`), Chromium, port 4610, normal entry points, 0 page errors:
  - SCN-001 (1440×900): `/chat?id=run-research-001` → collapse → right **Projects** tab → In Progress "documentation writer".
    - The worker opens; Workspaces is lit and Chat is not.
    - Workspaces: URL unchanged, header unchanged, Projects tab still selected.
    - "documentation writer" is selected, visible and focused; the docked Chat row is not lit.
  - SCN-002: Video Team › post_production › colorist → collapse → Workspaces: URL unchanged; colorist selected, visible and focused.
  - SCN-003 (1440×620, keyboard): Org writer → collapse; focus is on Workspaces; Enter: tree scrolled 247 px, row focused; URL unchanged.
  - SCN-005 (760×900): `open-drawer`, Workspaces lit; Enter opens the drawer with the run selected; Escape returns focus to Workspaces.
  - SCN-004: the Agents icon goes to `/agents?view=list` and docks.
  - New chat: Chat lit. AC-009: draft text kept, nothing selected.
  - Strip at 481/500/540/541 px tall: no overflow; the divider is hidden at ≤540.
  - 390×844: the strip renders with no errors.
  - `vue-tsc --noEmit -p tsconfig.prototype.json`: exit 0.
- Final references: `visual-references/VIS-001`–`VIS-008`, captured after confirmation.
- UI/UX specification: `ui-ux-spec.md`.

## Final Decisions For Solution Designer

- DEC-001: **D**. A Workspaces icon (Phosphor tree glyph) in the collapsed strip after the page icons and a light divider. It is lit while a run is open and opens the panel on that run without navigating. User-confirmed.
- Chat highlight: lit only on New chat (strip and docked Chat row). Part of the confirmed design.
- DEC-002: **a**. Page icons are unchanged. This is part of the confirmed design; the user did not ask to change it.
- DEC-003, DEC-004: out of scope as proposed. The user raised neither.
- Requirement impact: REQ-001/AC-010 and REQ-007/AC-006/AC-007 amended; new Workspaces highlight rule. See `ui-ux-spec.md`.

## Finalization

- Design revision: validated commit `6478eec`; ticket closed in `744152a`. Outside `tickets/`, the default branch's app code is byte-identical to the validated commit.
- Integration: `Completed`. The ticket branch fast-forwarded `origin/personal` (`9232842` → `744152a`, plus this record). The canonical checkout `/Users/normy/autobyteus_org/autobyteus-web-design` was fast-forwarded.
- Default-entry-point validation after integration: canonical checkout on port 4611, `/chat?id=run-research-001` → collapse → Projects tab → "documentation writer" → Workspaces. URL unchanged; "documentation writer" selected; 0 page errors. The server was stopped.
- Cleanup: review server on port 4610 stopped. Ticket worktree removed after this record was pushed. Branch `design/collapsed-left-panel-expand-keeps-run` kept locally, as for earlier tickets.
- Handoff: `get_handoff_rules` has no rule for `Design Completed` (only `Baseline Needed`). The result goes back to the requester, Solution Designer AgentRun `solution_designer_6856168b4a8d4175a6896c5eac1b26e2`.
