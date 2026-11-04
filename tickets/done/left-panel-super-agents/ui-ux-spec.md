# UI/UX Specification — A Simpler Left Panel: Your Runs, With Their Delegated Work

Canonical contract for the run section of the AutoByteus Web left panel after the Workspaces and Projects views are removed. The final screenshots in `visual-references/` are normative: every visible detail in them is a requirement unless this document marks it illustrative. Example run titles, agent and team names, times and counts in them are **illustrative** (invented; no real conversations).

## Status And User Confirmation

- Status: `Approved` (2026-11-03)
- Request / ticket: `left-panel-super-agents` (Project Task `autobyteus-378`, Project `project_a1377344-25db-482a-97cc-ecfdb0fb495a`). No second ID.
- Related requirements revision ID: SR-001 (`requirements-doc.md` Draft: PRES-001…005, DEC-001). Decision DEC-001 (what the panel shows; keep, hide or remove the two trees) is answered here by the user: **remove**.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Review URL: the product's normal entry point, `http://127.0.0.1:4970/workspace` while the ticket was in review (no preview switch).
- Explicit user-confirmation reference: the user, in the Product UI/UX Designer's conversation, 2026-11-03: "Do we really need to show older is nice. It's good to have show older … I guess that's it, check the consistency and if everything is consistent then we are done." The consistency check is recorded under Final Consistency Check. The user's own decisions during the review are under Key UX decisions.
- Final check date: 2026-11-03

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`; software worktree read by the design (read only): `/Users/normy/autobyteus_org/autobyteus-worktrees/left-panel-super-agents` (branch `codex/left-panel-super-agents`, base `origin/personal@fe351591f2`, v1.5.11).
- Selected frontend application or product surface: `autobyteus-web`: the left panel's run section (`AppLeftPanel`, `components/workspace/history/*`) and its strip entry.
- Pinned source commit or revision: baseline `origin/personal@d74f75a51ab7dc47d42a13f33e0f943c3a230ad7`; scoped refreshes as in `ui-baseline-report.md`. Checked against `fe351591f2` on 2026-11-03: the baseline's left panel renders like the user's three v1.5.11 screenshots (page list, Workspaces | Projects switch, folder and Project rows, runs, delegated rows with node chips and Task lines). The source refactored its history components (`RunSectionSwitch`, `RunDefinitionGroups`, `ProjectHistorySection`, a "run shown" reveal flag) without a visible difference, and this ticket replaces that surface, so no refresh was requested.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Accepted design base: `88e0e322b6b638f29d3a666e72d64a849301a08a` (`origin/personal`, fetched 2026-11-03)
- UI reference revision or commit: ticket branch `design/left-panel-super-agents`; the integrated revision is in `product-ticket.md`.
- Ticket folder: `tickets/done/left-panel-super-agents/`
- Baseline report path: `ui-baseline-report.md` (repository root)

## Problem And Design Rationale

- **User problem and intent.** The left panel has a Workspaces tree and a Projects tree (a switch between them) that group runs by folder or Project. The user: "Do we really need to display workspaces and even have a Projects tab? … this is the intermediary." The groupings and the draggable history section existed because starting sessions under workspaces produced hundreds of rows. He now talks to one orchestrating agent (today the Project Task Manager; the Daily Assistant may become it): "whenever I have something to do, I talk to it". It delegates to specialist agents and teams, created for a Task and released when the Task closes, so little ever shows.
- **Key UX decisions and why.** Most are the user's own decisions in review.
  1. **Remove the Workspaces and Projects views, the switch, the header "+" and every group header** (user: "we don't need the workspaces and the project anymore … it's just do not group it underneath"). Nothing in the platform is removed: agent, team and Org runs can still be started from their pages and New chat, and the folder or Project is still chosen in the New chat chip. Only where runs are shown changes.
  2. **No special "super agent".** Orchestration is just tools an agent is configured with (user: "the agent orchestration capability are simply just those tools"). The panel ranks and labels no agent. It lists the runs you started, newest first; what a run delegated is nested under it, live, as today, and leaves when its Task closes. Another machine's work is the same row with its machine chip (`docker`, `office-mac`).
  3. **Hand-started runs stay until archived or deleted** (user: "it stays the same as the current behavior … they can archive by themselves"). They are rare, so the list stays short.
  4. **"Show older" is kept** (user: "show older is nice … functionality could be there"). The newest 5 runs show; the rest sit behind "Show older (N)". It is also the one way to clear a backlog (his data: about 40 old agent runs and about 200 team runs): opened, it adds **Archive all older**, with the confirmation of today's group "Archive all".
  5. **No history section, slider or "Earlier runs" door.** The page-list / run-section divider is unchanged (existing behavior); the run section is short, so it rarely needs resizing. The Memory page stays what it is (it only reads runs; it cannot resume, archive or delete).
  6. **No header text.** A bordered section with the rows needs no title; the strip entry's tooltip and the region's accessible name say "Your runs".
- **Alternatives considered and why they were rejected.**
  - A Workspaces | Projects | Conversations switch, or a "view" menu keeping the trees: rejected by the user as extra complexity once little shows.
  - A header search and a folder or Project filter (built and shown in review round 1, then removed): a list this short does not need them.
  - A fixed "super agent" row, or one row per agent with its latest conversation (built, shown, replaced): inconsistent with "orchestration is just tools"; hand-started runs would disappear from view.
  - Listing a hand-started run only while it runs: rejected, because a stopped run would then be unreachable and could not be resumed.
  - Making the Chat row open the standing conversation instead of a new chat: not decided; left as today (see Open Decisions).

## Scope And Experience Goal

- **User or actor:** the user, in the desktop app, node-local.
- **Context:** the left panel's run section (docked, drawer, collapsed strip), under the unchanged page list.
- **Goal:** see at a glance the work in progress (the runs you started and what they delegated) and open any of it, with nothing grouped by folder or Project.
- **Observable success:** the user opens the app, sees the few runs that matter with their live task tree, opens a run or a delegated copy and the center, Files and Terminal follow it, stops or archives a run from its row, and reaches an older run through "Show older".
- **In-scope surfaces and journeys:** UXJ-001…UXJ-006 below.
- **Non-goals:** the New chat start surface and its folder or Project chip (unchanged); the right Projects board and Task authoring; the Memory page; the page list; mobile `/mobile`; the Chat row's behavior; a tutorial for orchestration.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| DEC-001 | Remove the Workspaces and Projects views and the switch; one list | UXJ-001; UIS-001; VIS-001 |
| PRES-001 (every run findable and resumable) | Every non-archived run is a row (newest 5) or behind "Show older"; opening it resumes it. Archived runs stay on the Memory page (read only) | UXJ-002, UXJ-005; UIS-001, UIS-004; VIS-001, VIS-006 |
| PRES-002 (the right board opens Task workers) | Not a UI decision: the board's worker lines need the run history loaded whenever the panel is not mounted (docked, drawer or strip). See Open Decisions | UIS-005 |
| PRES-003 (Stop, Archive, Delete) | On the row, exactly as in the trees; "Archive all older" in the fold | UXJ-004; UIS-002; VIS-005, VIS-007 |
| PRES-004 (Files and Terminal follow the focused agent; copies keep their Project folder) | Unchanged; shown with a run open | UXJ-003; VIS-002, VIS-003 |
| PRES-005 (no stored data deleted) | The view preference is dropped; no data is touched | UIS-001 |

## Visual Language

Reuse the product's existing language; the run section changes only where noted. Values are the ones in the UI reference (`components/workspace/history/ConversationsList.vue`, `ConversationRowActions.vue`).

- **Section.** White background, 1px `gray-200` top border, then 8px (`pt-2`) before the first row. The scroll region has `px-1 pb-2` and owns the vertical scroll (the existing owner). No header row.
- **Row.** `rounded-md`, `text-sm`, 2px between rows (`space-y-0.5`). Idle: `text-gray-700`, hover `bg-gray-50`. Open (selected): `bg-indigo-50 text-indigo-900`; its second line `text-indigo-700`. Three zones, left to right: disclosure cell, main button, actions.
  - Disclosure cell: `ml-1`, 14px (`h-3.5 w-3.5`) chevron `gray-400`, aligned to the first line (`mt-[0.4375rem]`); rotated −90° when folded. Rows without delegated work (and Org rows without members) keep an empty cell of the same width so every status dot aligns.
  - Main button: `py-1 pl-1.5 pr-1`; a 20px-high line box holds the status dot (existing `StatusDot` / `TeamAggregateStatusDot`, `mr-1.5`; an Org run shows a 8px dot, `emerald-500` live, `gray-300` stopped), then the identity at 20px: an agent's avatar or initials in a `gray-200` circle (10px, semibold, `gray-600`), a team's avatar or `heroicons:user-group-20-solid` in a circle, an Org's avatar or `heroicons:building-office-2-20-solid` in a square-cornered `gray-100` box (`rounded`). Then two lines: the **name** (agents `font-medium`; teams and Orgs `font-semibold`; one line, truncated) and the **summary** (the run's title; 11px, `leading-4`, `font-normal`, `gray-500`; truncated). A missing agent keeps the existing amber triangle after its name.
  - Actions (right, `py-1 pr-2`, 4px gap, 20px targets, `leading-5`): Stop = red square icon (`red-500`, hover `red-50`) while running; Archive and Delete = 14px icons `gray-400`, hover `amber-600` / `red-600` with a faint fill, visible on row hover or focus on `md` and wider, always visible below `md`; then the age (`text-xs gray-400`, existing format "6m", "2h", "3d", "3w"). Disabled states and titles are the existing ones.
- **Delegated rows** under a run: the existing nested tree, unchanged (elbow lines, the `docker` / `office-mac` chips, two-line name and Task summary, per-copy Stop, team member disclosure).
- **Fold bar** ("Show older (N)" and "Archive all older"): a row `mx-1 mt-1`, `text-xs font-medium gray-500`, buttons `px-2 py-1.5 rounded-md`, hover `bg-gray-50` (Archive all older: hover `bg-amber-50 text-amber-700`, with the 14px archive icon). It sits under the list.
- **Focus.** The existing 2px indigo ring (`focus-visible:ring-2 ring-indigo-500`) on the row's main button, the disclosure and the fold buttons.
- **Text.** Default font (the app's), sizes as above; no new colors, borders or shadows.

### New Or Changed Components

| Component | Purpose | States | Source/Reference Notes |
| --- | --- | --- | --- |
| Run row (agent, team, Org) | One run you started, with its delegated work | idle, hover, open, running (Stop), folded, with/without delegated work, missing agent | `ConversationsList.vue`; reuses `AgentRunTaskRows`, `WorkspaceTeamExecutionTree`, `WorkspaceAgentOrgHistoryCollection` (new `bare` mode: only the member tree) |
| Row actions | Stop, Archive, Delete, age | as above | `ConversationRowActions.vue` (same controls and titles as the trees' run rows) |
| Fold bar | "Show older (N)" / "Show fewer", "Archive all older" | closed, open, no archivable runs | in `ConversationsList.vue` |
| Run section | Container and states | populated, empty, loading, read error, refresh error | `WorkspaceAgentRunsTreePanel.vue` (rewritten) |

Removed from the run section: the Workspaces | Projects switch; the header "+" (add a workspace / new Project); the inline add-workspace form; workspace rows (with "remove from workspaces"); Project rows (with "+"); agent-group headers (avatar, name, count, "Archive all runs", "+"); team-definition group headers and their "Archive all"; Org-definition group headers and their "Archive all"; the "TEAMS" and "ORGS" labels; the remove-workspace confirmation.

## Journey Inventory

| Journey ID | Journey | Requirement / AC IDs | Final screenshot IDs |
| --- | --- | --- | --- |
| UXJ-001 | Open the app: the run section shows your runs, newest first, each with its delegated work | DEC-001, PRES-001 | VIS-001, VIS-015 |
| UXJ-002 | Open a run (agent, team or Org): it is marked; center, Files and Terminal follow it | PRES-001, PRES-004 | VIS-002, VIS-008 |
| UXJ-003 | Open a delegated copy: the copy's row is marked; its conversation opens | PRES-004 | VIS-003 |
| UXJ-004 | Stop, Archive or Delete a run from its row; fold or unfold its delegated work | PRES-003 | VIS-004, VIS-005, VIS-001 (Stop) |
| UXJ-005 | Find an older run: Show older, open it; clear a backlog with Archive all older | PRES-001, PRES-003 | VIS-006, VIS-007 |
| UXJ-006 | Empty, loading and error states; collapsed strip and narrow drawer | DEC-001 | VIS-009…VIS-014 |

## Journey Details

### UXJ-001 — The run section

1. Preconditions: the node has run history (scenario `populated`, the default).
2. The panel shows the page list, the divider, then the run section: rows newest first (by last activity, one rule; a running run is not moved up). The newest 5 show. Each run with delegated work shows it nested under it, expanded, live.
3. Visible outcome: no tabs, no header, no folder or Project rows. VIS-001.

### UXJ-002 — Open a run

1. Click a row (agent, team or Org). An agent run opens in Chat (`/chat?id=…`); a team run opens its coordinator in the Team view; an Org run opens its Org view and its member tree opens under the row.
2. The row is marked (selected); the right panel's Files shows that run's folder (the existing contextual behavior). VIS-002, VIS-008.
3. A stopped Org shows "Select a member from the historical run in the sidebar to continue from its saved state": its members are the rows under it (VIS-008).

### UXJ-003 — Open a delegated copy

Click a nested row: the copy's conversation opens, its row is marked, the parent row is not. Clicking a copy's Task line shows the Task on the Projects board (existing). VIS-003.

### UXJ-004 — Row actions and fold

1. Stop (red square) is on a running row; it stops that run (existing behavior and failure toast).
2. Archive (stored, stopped runs) hides the run from the list at once and shows the existing toast; Delete asks for the existing confirmation and then removes it.
3. The chevron of a run with delegated work folds or unfolds that work for this session; folding never stops anything. VIS-004, VIS-005.

### UXJ-005 — Older runs

1. Under the list, "Show older (N)" (N = runs beyond the newest 5) opens the rest of the runs in the same list. The button then reads "Show fewer", and **Archive all older** appears beside it. VIS-006.
2. Archive all older asks "Archive all runs?" — "Older runs · N runs will be hidden from history." with the buttons Cancel and Archive all (existing dialog); it archives every run beyond the newest 5 that is not running. If any of them is running, nothing is archived and the toast "Stop running runs first." shows (as for a group's "Archive all"). VIS-007.
3. Opening a run that is in the older part (for example from a link) opens the fold so its row is visible.

### UXJ-006 — States

Empty: a single row-shaped invitation (chat icon, "No runs yet", help text that wraps). Loading: "Loading…". Read error: "Couldn’t load your runs." and Retry; a refresh error keeps the list and shows "Couldn’t refresh." with Retry above it. Collapsed strip: the run-section icon (`heroicons:queue-list`) under the page icons; its tooltip and name are "Your runs". Narrow window: the same section in the left drawer.

## Screen And Surface Specification

| Surface ID | Surface | Purpose | Final screenshot IDs |
| --- | --- | --- | --- |
| UIS-001 | Run section, populated | The list | VIS-001, VIS-015 |
| UIS-002 | Row states and actions | Open, hover, focus, Stop, Archive, Delete | VIS-002, VIS-005, VIS-016 |
| UIS-003 | Delegated work | Nested copies; open copy; folded | VIS-003, VIS-004 |
| UIS-004 | Fold bar | Show older, Archive all older and its confirmation | VIS-006, VIS-007 |
| UIS-005 | States, strip, drawer | Empty, loading, error, collapsed strip, narrow | VIS-009…VIS-014 |
| UIS-006 | New chat chip (unchanged) | Where the folder (and, once Projects exist, the Project) is chosen for a new run | VIS-017 |

## Interaction And State Transitions

| Transition ID | From | Trigger | To | Visible outcome |
| --- | --- | --- | --- | --- |
| UIT-001 | List | Click an agent row | Chat run view | Row marked; Files shows the run's folder |
| UIT-002 | List | Click a team row | Team run | Row marked; its member tree opens (existing team disclosure) |
| UIT-003 | List | Click an Org row | Org run | Row marked; member tree opens |
| UIT-004 | List | Click a nested copy | The copy's conversation | Copy row marked |
| UIT-005 | List | Chevron on a run | Delegated work folded / unfolded | Rows hide or show; nothing stops |
| UIT-006 | Running row | Stop | Run stopping, then stopped | Existing behavior |
| UIT-007 | Stopped row | Archive | Row leaves | Toast "Run archived." (existing text) |
| UIT-008 | Stopped row | Delete | Confirmation, then row leaves | Existing dialog |
| UIT-009 | Fold closed | "Show older (N)" | Fold open | Remaining runs listed; "Show fewer" and "Archive all older" shown |
| UIT-010 | Fold open | "Archive all older" | Confirmation, then older runs leave | Toast "Archived N runs." (existing text); the fold closes when nothing remains beyond 5 |
| UIT-011 | Any | Open a run that is in the older part | Fold open | The row is in view and marked |
| UIT-012 | Strip | The run-section icon | Panel docks or the drawer opens | Existing; never changes the open run |

## State Behavior

| State | Condition | Visible Behavior | Recovery / Next Action |
| --- | --- | --- | --- |
| Populated | At least one run | Rows as specified | — |
| Empty | No run in history | One invitation row "No runs yet" + help | Click it: New chat |
| Loading | First read in flight | "Loading…" | — |
| Read error | First read failed | "Couldn’t load your runs." + Retry | Retry |
| Refresh error | A later refresh failed | The list stays; "Couldn’t refresh." + Retry above | Retry |
| Missing agent | A run's agent no longer exists | Amber triangle after the name (existing) | Existing reconnect flow |
| Fewer than 6 runs | — | No fold bar | — |
| Run opened elsewhere | Open run is beyond the newest 5 | Fold opens | — |

## Content, Labels, Validation, And Feedback

English strings (Chinese `zh-CN` counterparts are in `localization/messages/zh-CN/projects.ts`; both are normative):

| Where | Text |
| --- | --- |
| Region name / strip tooltip | "Your runs" |
| Fold buttons | "Show older ({{count}})", "Show fewer", "Archive all older" |
| Confirmation (existing dialog) | Title "Archive all runs?"; message "Older runs · {{runs}} will be hidden from history."; buttons "Cancel", "Archive all" |
| Empty | "No runs yet" / "Start with Chat. Work an agent delegates appears under its run and leaves when it is done." |
| Loading / errors | "Loading…" / "Couldn’t load your runs." / "Couldn’t refresh." / "Retry" |
| Disclosure | "Show delegated work of {{name}}" / "Hide delegated work of {{name}}" |
| Row tooltip | "{{name}} · {{folder}}" (folder "Temp workspace" for the temp workspace; omitted when none) |
| Row actions, toasts, delete dialog | Existing texts, unchanged |

## Responsive And Platform Behavior

- Docked (≥ the existing breakpoints), collapsed strip, and the left drawer are unchanged presentations of the same section (VIS-012…VIS-014).
- Below the `md` breakpoint (touch), Archive and Delete are always visible on a stored row, not only on hover.
- Narrow (600 × 800): the drawer lists the same rows; no horizontal scrolling; the nested tree keeps its elbows.

## Accessibility And Keyboard Behavior

- The section is a labelled region ("Your runs"); the list is a `list` named "Your runs"; each run row's main control is a button that carries `aria-current="true"` when open; team and Org rows carry `aria-expanded`.
- The disclosure is a separate button with `aria-expanded` and "Show/Hide delegated work of …".
- Tab order per row: disclosure, main button, Stop, Archive, Delete; then the next row; the fold bar last. Archive and Delete are reachable by keyboard (visible on focus).
- Existing delegated-row semantics (tree, treeitem) are unchanged.
- The open run is revealed (scrolled into view) when the panel appears and a run is shown, exactly as in the trees; opening a run in the older part opens the fold first.

## Motion And Transitions

Existing: the chevron rotates 90° with the product's `transition-transform`; delegated rows of a closed Task leave with the existing row-leave motion; no new animation.

## Data, Contract, And Mock Boundaries

- The list is a projection of the run history the app already loads (agent runs per folder, team runs, Org runs, delegated copies); it needs no new data. Folder and Project names are only used in a row's tooltip.
- Mock data (invented; no real titles): `prototype/conversations-list/conversationsFixture.ts` adds about 26 stored runs (Daily Assistant, Codex, Project Task Manager, Agent Package Creator, teams, in the temp workspace and two folders) to the baseline's runs (the Project Task Manager run with delegated copies on this node and on `docker` and `office-mac`, the Research Assistant, the Video Team, the Product Review Team, the Product Launch Org). Times are offsets from page load. The example conversations that open from the added rows are two invented messages.
- Simulated: Archive and Delete are answered locally and remembered until a reload (`prototype/conversations-list/conversationsFixture.ts`, `utils/apolloClient.ts`, `plugins/00.prototype-state.client.ts`).
- Not playable in the reference: a Task closing live and its copies leaving (existing mechanism); Stop actually stopping a run.
- Scenarios: `empty`, `loading`, `error` (existing, `autobyteus.prototype.scenario`) show the three states.

## Final Visual Reference Inventory

All 1440 × 900 unless noted; paths relative to this ticket's `visual-references/`.

| Screenshot ID | File | Viewport | Surface / State | Journey / Transition | Normative or illustrative content |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | `VIS-001-default-nothing-open-desktop-1440x900.png` | 1440×900 | Run section, nothing open | UXJ-001 | Layout normative; run names and times illustrative |
| VIS-002 | `VIS-002-open-run-highlighted-files-follows-desktop-1440x900.png` | 1440×900 | Run open, Files tab | UXJ-002, UIT-001 | same |
| VIS-003 | `VIS-003-delegated-copy-open-desktop-1440x900.png` | 1440×900 | Delegated copy open | UXJ-003, UIT-004 | same |
| VIS-004 | `VIS-004-task-tree-folded-desktop-1440x900.png` | 1440×900 | Delegated work folded | UIT-005 | same |
| VIS-005 | `VIS-005-row-hover-archive-delete-desktop-1440x900.png` | 1440×900 | Row hover | UXJ-004 | same |
| VIS-006 | `VIS-006-show-older-open-desktop-1440x900.png` | 1440×900 | Fold open | UIT-009 | same |
| VIS-007 | `VIS-007-archive-all-older-confirmation-desktop-1440x900.png` | 1440×900 | Confirmation | UIT-010 | Count illustrative |
| VIS-008 | `VIS-008-org-run-open-members-desktop-1440x900.png` | 1440×900 | Org run open with members | UIT-003 | same |
| VIS-009 | `VIS-009-empty-desktop-1440x900.png` | 1440×900 | Empty | UXJ-006 | Text normative |
| VIS-010 | `VIS-010-loading-desktop-1440x900.png` | 1440×900 | Loading | UXJ-006 | Text normative |
| VIS-011 | `VIS-011-read-error-desktop-1440x900.png` | 1440×900 | Read error | UXJ-006 | Text normative |
| VIS-012 | `VIS-012-collapsed-strip-desktop-1440x900.png` | 1440×900 | Collapsed strip, tooltip | UIT-012 | Normative |
| VIS-013 | `VIS-013-collapsed-strip-narrow-600x800.png` | 600×800 | Strip, narrow | UXJ-006 | Normative |
| VIS-014 | `VIS-014-drawer-narrow-600x800.png` | 600×800 | Drawer, narrow | UXJ-006 | Layout normative |
| VIS-015 | `VIS-015-default-zh-CN-desktop-1440x900.png` | 1440×900 | Chinese | UXJ-001 | UI text normative; run content illustrative |
| VIS-016 | `VIS-016-row-keyboard-focus-desktop-1440x900.png` | 1440×900 | Keyboard focus on a row | UIS-002 | Normative |
| VIS-017 | `VIS-017-new-chat-chip-folder-choice-desktop-1440x900.png` | 1440×900 | New chat chip menu (unchanged) | UIS-006 | Unchanged baseline; shown for context |

## Linked UI Reference Evidence

- Runnable UI reference: the design repository root (`corepack pnpm install --ignore-workspace --frozen-lockfile`, `corepack pnpm dev --port 4970`), `http://127.0.0.1:4970/workspace`.
- Runbook: `ui-reference-runbook.md` (repository root), section `left-panel-super-agents`.
- Change log: `design-change-log.md` (this folder). Ticket record: `product-ticket.md`.
- Baseline: `ui-baseline-report.md` and the user's three screenshots, `evidence/intake/` of the software ticket (`/Users/normy/autobyteus_org/autobyteus-worktrees/left-panel-super-agents/tickets/in-progress/left-panel-super-agents/evidence/intake/`).

## Implementation Fidelity Boundary

Engineering matches the screenshots and this document for the section's look, copy, states and behavior; it keeps the product's existing row components, nested delegated rows, row actions and dialogs. The reference's stores, fixtures, scenario keys and component split are not a prescription.

## Out Of Scope

The Chat row's behavior; the New chat chip; the Projects board and Task authoring; the Memory page; the page list and the divider; adding a way to remove a folder from "your workspaces" list (see Open Decisions); the orchestration tutorial; mobile.

## Open Decisions And Risks

1. **Run history load (engineering).** The history is loaded today by the Workspaces tree panel when it mounts, and the right board's worker lines need it (investigation E-003, E-004). This panel still loads it while it is shown; with the left panel collapsed to the strip nothing mounts it. Engineering moves the load, whatever the layout. The flat list also needs every non-archived run (the tree loads the 6 newest per agent and a folder's history on expansion): load them all or page them is a technical decision.
2. **Chat row.** Today it opens a fresh New chat each time, and the pencil does the same. With one orchestrating agent, opening that agent's most recent conversation may fit better. Not decided; unchanged here.
3. **Removing a folder from "your workspaces".** The tree's "x" on a workspace row (non-destructive) is gone with the tree; the New chat chip menu lists folders and "Open another folder…" but has no remove. Where to remove a folder from the list needs a decision (not designed).
4. **Folder and Project per run.** A row shows neither; they are in its tooltip, in the right panel's Files, and as searchable words nowhere (no search). If the user later wants to see them on the row, a muted folder name on the summary line is the first option.
5. **Preference migration.** The old per-node view choice (`autobyteus.leftPanel.runSectionMode.<node>`) is no longer read; nothing needs migrating.
6. **Memory page.** It only reads runs (Work Journal, Raw Traces): an archived run cannot be resumed from it. If the user wants archived runs resumable, that is a separate request.
7. **Another machine.** A copy delegated to another node shows as a nested row with its node chip, as today; the node's own panel is not designed.

## Final Consistency Check

Checked in the browser on 2026-11-03 against the running reference (`http://127.0.0.1:4970/workspace`): the default view; opening an agent, a delegated copy, a team and an Org run (the stopped Org shows its member rows); Stop is present on a live row; Archive and Delete on rows (the run leaves and does not return on refresh); Show older, Show fewer, Archive all older and its confirmation; folding the delegated work; the open run staying marked and revealed; the empty, loading and error scenarios; the collapsed strip with its tooltip; the 600 px drawer; Chinese; keyboard focus; the New chat chip (unchanged). Findings fixed during the check: an error text that still said "agents", the empty-state help clipped to one line, Archive and Delete doing nothing in the reference (now simulated), a stopped Org with no member rows (member tree restored under the Org row), and unused Workspaces/Projects code removed from the reference. No unresolved visual or behavioral difference remains between the reference, this document and the screenshots.
