# UI/UX Specification — Choose how the left panel shows your runs (Runs, Workspaces, Projects); Remove a folder only in the chat chooser

Canonical contract for the run section's header and views, and for the chat folder chooser's "Remove". The final screenshots in `visual-references/` are normative: every visible detail is a requirement unless this document marks it illustrative. Folder names, Project names, run titles, agent names, times and counts are **illustrative** (invented).

## Status And User Confirmation

- Status: `Approved` (2026-11-05, first round; corrected and re-approved 2026-11-05). Integration `Pending` by the user's standing decision (2026-11-04): an approved design stays on its ticket branch until it is implemented, so the default branch keeps mirroring the shipped product.
- Request / ticket: `workspace-tree-vs-chooser` (Project Task `autobyteus-385`). Requirements basis: the Solution Designer's `requirements-doc.md` SR-004 (DEC-008, DEC-010, REQ-006…REQ-009, AC-009…AC-012).
- Explicit user-confirmation references (the user, in the Product UI/UX Designer's conversation, 2026-11-05): first round: "this is really, really nice. It achieves all purposes … It's just different way of grouping" and "I'll approve this. I think this is the ones we want."; correction round: the view menu has no "Add workspace" / "New Project" ("I have never used it to add workspace or project from there"), a view "will just be view" (no action buttons in the views), the chooser's X centred and larger, then "now everything is good now. approved".
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket branch / worktree: `design/workspace-tree-vs-chooser` / `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/workspace-tree-vs-chooser`
- Accepted design base: `a0e18abb49320c8f3c4ad5cfad830863ca6684df`
- Source pin: baseline `origin/personal@d74f75a51a` (`ui-baseline-report.md`). The tree and chooser were checked against `origin/personal@3ef5e33eec`: the source implements the accepted `projects-left-navigation` design with no visible difference.
- Review URL (while in review): `http://127.0.0.1:3385/workspace`, the product's normal entry point (no preview switch).

## Problem And Design Rationale

- **User problem.** The Workspaces tree and the chat's folder chooser read one folder list, so taking a folder out of the tree also took it out of the chooser. The user wants every folder choosable for a new run, and a left panel that shows where runs are, not every folder.
- **Decision (the user's).** No folder or Project is hidden by hand. One header button chooses how the same runs are shown: **Runs** (no grouping), **Workspaces** (today's tree), **Projects** (today's Projects tree). The view is only a display setting. Then, in the correction round: the Workspaces and Projects views list a folder or Project **only while it has at least one run** ("the left side anyway shows the agent run or agent team run … if there are no … we don't have to show them").
- **What this gives.** The chat chooser always lists every folder and the Projects page lists every Project; the left panel lists only what has runs. Nothing is hidden, so nothing is stored on the server and the phone is unchanged. A folder is unregistered only by the chooser's deliberate "Remove".
- **Alternatives considered, rejected.** (a) Per-folder "Hide from Workspaces" with a dim "Hidden (N)" group, and a "Show hidden folders" switch (built and shown; dropped). (b) Keeping the tree's X: it unregistered the folder from the chooser, the bug itself. (c) Three tabs: they crowd a 320px panel. (d) "Add workspace" / "New Project" in the view menu and in empty states (built, then removed by the user: folders are added from the chat chooser, Projects from the Projects page; a view only shows).

## Visual Language

Existing product language only; no new colors, shadows or fonts.

- **Header** (run section): white, 1px `gray-200` top border, `px-3 py-2`, one row. Left: the view's name, `text-sm font-semibold leading-5 text-gray-900`, `px-2 py-1`, `-ml-1`, truncated (`<h2 id="run-section-title">`). Right: the menu button, 24px square (`h-6 w-6`), `rounded-md`, 16px `heroicons:ellipsis-horizontal-20-solid`; idle `text-gray-500`, hover and open `bg-indigo-50 text-indigo-600`; 2px indigo focus ring (`focus-visible:ring-2 ring-indigo-500`).
- **Menu** (below the button, right-aligned): `w-56` (224px), `rounded-lg border border-gray-200 bg-white py-1 shadow-lg`, `z-30`, `mt-1`. Section label "View": `text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400`, `px-3 pb-1 pt-1.5`. Three items, `px-3 py-1.5 text-sm`, 16px icon (`gray-500`) + label, hover and focus `bg-gray-100`; the current view is `font-medium text-gray-900` with a 16px `heroicons:check-20-solid` in `indigo-600` at the right. Order: Runs (`heroicons:queue-list`), Workspaces (`heroicons:folder`), Projects (`heroicons:briefcase`). **No other item** (no add actions).
- **Runs view list**: the approved `left-panel-super-agents` design (ConversationsList), built in this ticket (DEC-008): newest first; delegated work nested; the newest 5 shown, "Show older (N)" and "Archive all older"; its own states (empty "No runs yet", loading, error). Specified by `tickets/in-progress/left-panel-super-agents/ui-ux-spec.md` (branch `design/left-panel-super-agents`), reused without change; row details are in that spec and in VIS-003.
- **Workspaces and Projects views**: today's trees, with these changes: the folder row has **no remove (X) button**; a folder or Project is listed only while it has a run (below); the empty states below.
- **Empty states** (centered, `px-3 py-5 text-center`): a 24px icon in `gray-300` (`heroicons:folder` or `heroicons:briefcase`), a title `mt-2 text-sm font-medium text-gray-700`, one line of help `mt-1 text-xs leading-5 text-gray-500`. **Text only: no buttons or links.**
- **Chooser row** (chat folder chooser, "Your workspaces"): the row is a `bg-gray-100` strip on hover or focus. The option button is unchanged (folder icon, name, path, check). At the far right, a remove button 28px square (`h-7 w-7`), vertically centered in the row (`self-center`, `mr-2`), 20px `heroicons:x-mark-20-solid`, `text-gray-400`; on `md` and wider it is invisible until the row is hovered or focused (opacity 0 to 100, 150ms), always visible below `md`; hover `bg-red-50 text-red-600`; focus ring `red-500/40`. Temp workspace has none.
- **Confirmation**: the existing `ConfirmationModal`, `typography-size large`, `variant danger` (title `red-700`, red confirm button).

## Related Requirements And Acceptance Criteria

| ID | UI/UX obligation | Journey / screenshots |
| --- | --- | --- |
| REQ-006 / AC-009 | Header menu "View" with Runs, Workspaces (default), Projects; the choice survives a reload; no add actions in the menu; strip tooltip follows the view | UXJ-001; VIS-001…VIS-006, VIS-011, VIS-013 |
| REQ-007 / AC-010 | No folder row in the Workspaces view has a remove button | VIS-001 |
| REQ-008 / AC-011 | The Runs view is the approved list; a folder without runs is not listed | UXJ-001; VIS-003 |
| REQ-009 / AC-012 | A folder or Project with no listed run is absent from its view, present in the chat chooser or on the Projects page; starting a run there makes it appear; archiving its last run makes it disappear | UXJ-002; VIS-001, VIS-005, VIS-014…VIS-017 |
| REQ-002 / AC-002 | The chooser has "Remove" per user folder with a confirmation; it leaves every list; nothing on disk is deleted | UXJ-003; VIS-007…VIS-009 |
| REQ-004 / AC-005 | Remove is refused while a run is running in the folder, with today's message | UXJ-004; VIS-010 |

## Journey Inventory

| ID | Journey | Screenshots |
| --- | --- | --- |
| UXJ-001 | Open the app (Workspaces view, default); choose a view from the header menu | VIS-001…VIS-006, VIS-011, VIS-012, VIS-013 |
| UXJ-002 | A folder or Project with no run is not listed; its first run makes it appear; empty views | VIS-001, VIS-005, VIS-014, VIS-015, VIS-016, VIS-017 |
| UXJ-003 | Remove a folder from the chat chooser | VIS-007, VIS-008, VIS-009 |
| UXJ-004 | Remove refused while a run is running | VIS-010 |

### UXJ-001 — Views

1. First open: the Workspaces view (title "Workspaces"; today's tree). `⋯` opens the menu; arrow keys move between items, Enter chooses, Escape closes and returns focus to the button, Tab or a click outside closes it. Choosing the current view only closes the menu.
2. **Runs** swaps the list for the Runs view and the title to "Runs". **Projects** shows the Projects tree and "Projects". The choice is kept per node in local storage (`autobyteus.leftPanel.runSectionMode.<node>`: `runs` | `workspaces` | `projects`) and applies after a reload.
3. The collapsed strip's run-section entry keeps its icon; its tooltip and name follow the view ("Workspaces", "Projects", "Your runs"). In a narrow window the same section is in the left drawer (VIS-013).

### UXJ-002 — What a view lists

1. **Rule.** A folder row (Temp workspace included) is listed only while it has at least one run the view lists: non-archived agent, team and Org runs of any status (a stopped run counts, so it stays reachable; a prepared or just-started run counts). A Project row is listed only while it has at least one run the Projects tree lists (its runs, delegated work). The chat chooser lists every folder; the Projects page lists every Project.
2. A folder with no run is therefore absent from the Workspaces view (VIS-001: `docs-site` and `design-notes` are not listed; they are in the chooser, VIS-007). A Project with no run is absent from the Projects view (VIS-005: "Customer Onboarding Experience Redesign" is not listed).
3. Start a run in a folder from the chat chooser: when the first message is sent the folder appears with its run (VIS-017). Archiving or deleting a folder's last run makes it disappear at the next refresh.
4. **Empty views** (text only): Workspaces with no folder that has a run (VIS-014): "No runs in any folder yet" — "A folder is listed here once it has a run. Start one with Chat and choose its folder." Projects with no Project on the node (VIS-015): "No Projects yet" — "Create a Project on the Projects page to run agents and teams for it and follow their work here." Projects that exist but none has a run (VIS-016): "No Project has a run yet" — "A Project is listed here once it has a run. Your Projects are on the Projects page." The Runs view keeps its own "No runs yet" state.
5. There is no "Add workspace" and no "New Project" in the left panel's run section. Folders are added with "Open another folder…" in the chat chooser (and where they are today: Projects editor, Org launch, Settings); Projects on the Projects page.

### UXJ-003 — Remove a folder (chat chooser)

1. New chat, then the folder chip: the menu lists Temp workspace and every user folder (also the ones the left panel does not list). Hover or focus a user folder: its X appears at the right, centered in the row (VIS-007).
2. Click it: "Remove folder" — "Remove **docs-site**? It will no longer be offered when you choose a folder, and its runs will not be listed in the left panel. Files, memories, artifacts, and run history are not deleted. Add the folder again to use it." — the path below — buttons Cancel and **Remove** (red). VIS-008.
3. Remove: the folder is gone from the chooser and the left panel; toast "docs-site removed. Files, memories, and run history were not deleted." (VIS-009). If it was the chosen folder, the chip falls back to Temp workspace.

### UXJ-004 — Refused

With a run running in the folder, Remove (after the confirmation) shows the error toast "Stop active runs before removing this workspace." and changes nothing (VIS-010).

## Screen And Surface Specification

| Surface | Purpose | Screenshots |
| --- | --- | --- |
| Run section header, menu, three views | Choose how runs are shown | VIS-001…VIS-006 |
| Menu keyboard focus | Focus ring on the button | VIS-011 |
| zh-CN | Chinese strings | VIS-012 |
| Narrow drawer (600x800) | Same menu in the drawer | VIS-013 |
| Empty views | Nothing with a run | VIS-014, VIS-015, VIS-016 |
| Folder appears with its first run | Rule in action | VIS-017 |
| Chat chooser "Remove" | Hover, confirmation, done, refused | VIS-007…VIS-010 |

## Content And Copy (normative English; zh-CN in `localization/messages/zh-CN/workspaceFolders.ts`)

| Where | Text |
| --- | --- |
| Menu button title and aria-label | "View" |
| Menu section / items | "View"; "Runs", "Workspaces", "Projects" |
| Header title | "Runs" / "Workspaces" / "Projects" |
| Empty views | as in UXJ-002 step 4 |
| Chooser remove button title and aria-label | "Remove {name}" |
| Confirmation | title "Remove folder"; body as in UXJ-003 step 2; buttons "Cancel", "Remove" |
| Success toast | "{name} removed. Files, memories, and run history were not deleted." |
| Refusal toast | "Stop active runs before removing this workspace." (the server's existing message) |

## Responsive, Accessibility, Motion

- Narrow: the section is in the left drawer; the menu is the same, under the button inside the drawer (VIS-013). The chooser's X is always visible below `md`.
- The header title is an `h2` labelling the region (`role=region`, `aria-labelledby`). The button has `aria-haspopup=menu` and `aria-expanded`; the menu is `role=menu` with `menuitemradio` items (`aria-checked`).
- Motion: the chooser's X fades in over 150ms; no other new motion.

## Mocked Boundaries And Simulation

- The view is the real product control (local-storage key above). The rule in UXJ-002 is a client-side filter over the run history the tree already loads (the folder's agent, team and Org runs; a Project's runs); no new server data.
- "Remove" is answered by a small design-only store and plugin (`stores/workspaceFoldersStore.ts`, `plugins/96.workspace-folders.client.ts`; local storage `autobyteus.prototype.removedFolders`). Production: the existing `removeWorkspace` mutation and guard; no new server API.
- Example folders (`prototype/workspace-folders/workspaceFoldersFixture.ts`): `client-portal` (has runs), `docs-site`, `design-notes` (no runs). Runs of the Runs view: `prototype/conversations-list/conversationsFixture.ts` (reused). All illustrative.
- Starting states (local storage, reload): `autobyteus.prototype.scenario` = `live_runs` (a run is running in `prototype-workspace`: the refusal) or `empty` (no folders, no runs: VIS-014); `autobyteus.prototype.projectsTree` = `none` (no Projects) or `no-runs` (Projects without runs).

## Requirement Impact (for the Solution Designer)

- Matches SR-004 as written (REQ-006…REQ-009, AC-009…AC-012, DEC-008, DEC-010), with these decisions of the correction round: (1) the view menu has **no** "Add workspace" or "New Project", the inline add-folder form is removed, and the empty states have no buttons; so the "open a new chat with that folder chosen" step is not needed; (2) the Workspaces empty state, the two Projects empty states and the chooser's Remove text (it now says "its runs will not be listed in the left panel") are specified above; (3) the strip tooltip follows the view.
- Wording change to REQ-006: the menu holds the three views only (not "the view's add action"); the button's name is "View".
- Left unchanged and noted: the phone lists every folder; a delegation into a removed folder re-registers it as today (E-03, DEC-009).

## Design Findings

- The source's tree and chooser equal the accepted baseline; no baseline refresh was needed.
- The Runs view is the core of `left-panel-super-agents`; this ticket builds it, and that ticket becomes unnecessary (DEC-008).
- The strip icon (`ph:tree-view`) is unchanged; only its tooltip follows the view.
- Obsolete code removed in the reference: the tree's folder X, the inline "Add workspace" form and its composable, the tabs.
