# UI/UX Specification — Choose how the left panel shows your runs (Runs, Workspaces, Projects); Remove a folder only in the chat chooser

Canonical contract for the run section's header and for the chat folder chooser's "Remove". The final screenshots in `visual-references/` are normative: every visible detail is a requirement unless this document marks it illustrative. Folder names, run titles, agent names, times and counts are **illustrative** (invented).

## Status And User Confirmation

- Status: `Approved` (2026-11-05); integration `Pending` by the user's standing decision (2026-11-04): an approved design stays on its ticket branch until it is implemented, so the default branch keeps mirroring the shipped product.
- Request / ticket: `workspace-tree-vs-chooser` (Project Task `autobyteus-385`). Requirements basis: the Solution Designer's `requirements-doc.md` SR-003 (see Requirement Impact).
- Explicit user-confirmation reference: the user, in the Product UI/UX Designer's conversation, 2026-11-05: "this is really, really nice. It achieves all purposes … It's just different way of grouping" and, after the final review, "I'll approve this. I think this is the ones we want."
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket branch / worktree: `design/workspace-tree-vs-chooser` / `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/workspace-tree-vs-chooser`
- Accepted design base: `a0e18abb49320c8f3c4ad5cfad830863ca6684df`
- Source pin: baseline `origin/personal@d74f75a51a` (`ui-baseline-report.md`). The tree and chooser were checked against `origin/personal@3ef5e33eec`: the source implements the accepted `projects-left-navigation` design with no visible difference.
- Review URL (while in review): `http://127.0.0.1:3385/workspace`, the product's normal entry point (no preview switch).

## Problem And Design Rationale

- **User problem.** The Workspaces tree and the chat's folder chooser read one folder list, so taking a folder out of the tree also took it out of the chooser. The user wants every folder choosable for a new run, and a tree that does not have to list every folder.
- **Decision (the user's).** No folder or Project is hidden. Instead, one header button changes how the same runs are shown: **Runs** (no grouping), **Workspaces** (today's tree), **Projects** (today's Projects tree). The view is only a display setting. The user's words: "Hide the workspaces. Then we display plainly the agent runs … it's just a different way of grouping."
- **What this gives.** The Runs view lists runs only, so a folder with no runs is never shown there; the chat chooser always lists every folder; nothing is hidden, so nothing is stored on the server and the phone is unchanged. A folder is unregistered only by the chooser's deliberate "Remove".
- **Alternatives considered, rejected.** (a) Per-folder "Hide from Workspaces" with a dim "Hidden (N)" group (built and shown; dropped by the user: no hiding needed). (b) Hide with a "Show hidden folders" switch in the menu (same). (c) Keeping the tree's X: it unregistered the folder from the chooser, the bug itself. (d) Tabs for three views: three tabs plus the add button crowd a 320px panel; the menu also holds each view's add action.

## Visual Language

Existing product language only; no new colors, shadows or fonts.

- **Header** (run section, above the rows): white, 1px `gray-200` top border, `px-3 py-2`, one row. Left: the view's name, `text-sm font-semibold leading-5 text-gray-900`, `px-2 py-1`, `-ml-1`, truncated (`<h2 id="run-section-title">`). Right: the menu button, 24px square (`h-6 w-6`), `rounded-md`, 16px `heroicons:ellipsis-horizontal-20-solid`; idle `text-gray-500`, hover and open `bg-indigo-50 text-indigo-600`; 2px indigo focus ring (`focus-visible:ring-2 ring-indigo-500`).
- **Menu** (opens below the button, right-aligned): `w-56` (224px), `rounded-lg border border-gray-200 bg-white py-1 shadow-lg`, `z-30`, `mt-1`. Section label "View": `text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400`, `px-3 pb-1 pt-1.5`. Items: `px-3 py-1.5 text-sm`, 16px icon (`gray-500`) + label, hover and focus `bg-gray-100`; the current view is `font-medium text-gray-900` with a 16px `heroicons:check-20-solid` in `indigo-600` at the right. Order: Runs (`heroicons:queue-list`), Workspaces (`heroicons:folder`), Projects (`heroicons:briefcase`); then a `border-gray-100` separator and the view's add action with a 16px `heroicons:plus-20-solid`: "Add workspace" (Workspaces view), "New Project" (Projects view), none in Runs.
- **Runs view list**: exactly the approved `left-panel-super-agents` design (ConversationsList: newest first; delegated work nested; the newest 5 shown, "Show older (N)" and "Archive all older"; states empty / loading / error). It is specified by `tickets/in-progress/left-panel-super-agents/ui-ux-spec.md` (on branch `design/left-panel-super-agents`) and reused here without change.
- **Workspaces and Projects views**: unchanged except that the Workspaces folder row has **no remove (X) button**.
- **Chooser row** (chat folder chooser, "Your workspaces"): the row is a hover/focus `bg-gray-100` strip. The option button is unchanged (folder icon, name, path, check). At the far right, a 24px remove button (`h-6 w-6`, `mr-2 mt-1`, 16px `heroicons:x-mark-20-solid`), `text-gray-400`; on `md` and wider it is invisible until the row is hovered or focused (`opacity-0` to `100`, 150ms), and always visible below `md`; hover `bg-red-50 text-red-600`; focus ring `red-500/40`. Temp workspace has none.
- **Confirmation**: the existing `ConfirmationModal`, `typography-size large`, `variant danger` (title in `red-700`, red confirm button).

## Related Requirements And Acceptance Criteria

| ID | UI/UX obligation | Journey / screenshot |
| --- | --- | --- |
| REQ-001/AC-001 (as changed) | Every folder stays choosable in the chooser; the left panel can show runs with no folders | UXJ-001, UXJ-002; VIS-003, VIS-007 |
| REQ-002 / AC-002 | The chooser has "Remove" per user folder with a confirmation; the folder leaves every list; nothing on disk is deleted | UXJ-003; VIS-007, VIS-008, VIS-009 |
| REQ-004 / AC-005 | Remove is refused while a run is running in the folder, with today's message | UXJ-004; VIS-010 |

## Journey Inventory

| ID | Journey | Screenshots |
| --- | --- | --- |
| UXJ-001 | Open the app: the panel shows the Workspaces view (the default, unchanged) | VIS-001 |
| UXJ-002 | Choose a view from the header menu; the choice is remembered for this window; "Add workspace" / "New Project" is in the menu for its view | VIS-002…VIS-006, VIS-011, VIS-012, VIS-013 |
| UXJ-003 | Remove a folder from the chat chooser | VIS-007, VIS-008, VIS-009 |
| UXJ-004 | Remove refused while a run is running | VIS-010 |

### UXJ-001 / UXJ-002

1. First open: view Workspaces (title "Workspaces"; the tree of today). `⋯` opens the menu; arrow keys move between items, Enter chooses, Escape closes and returns focus to the button, Tab closes it, a click outside closes it. Choosing the current view only closes the menu.
2. Choosing **Runs** swaps the list for the Runs view and the title to "Runs". Choosing **Projects** shows the Projects tree and "Projects". The choice is kept in local storage per node (`autobyteus.leftPanel.runSectionMode.<node>`: `runs` | `workspaces` | `projects`) and applies after a reload.
3. "Add workspace" opens today's inline add form (Workspaces view); "New Project" opens the New Project page (Projects view). In the Runs view the menu has no add action.
4. The collapsed strip's run-section entry keeps its icon; its tooltip and name follow the view ("Workspaces", "Projects", "Your runs"). In a narrow window the same section is in the left drawer (VIS-013).
5. A folder with no runs is not listed in the Runs view. The Workspaces view still lists every folder (so a user starts a run in it from the tree or the chooser as today).

### UXJ-003 — Remove a folder (chat chooser)

1. New chat, then the folder chip: the menu lists Temp workspace and every user folder. Hover or focus a user folder: its remove button appears (VIS-007).
2. Click it: the confirmation "Remove folder" — "Remove **docs-site**? It will no longer be offered when you choose a folder, and its runs will not appear under Workspaces. Files, memories, artifacts, and run history are not deleted. Add the folder again to use it." — path line below — buttons Cancel and **Remove** (red). VIS-008.
3. Remove: the chooser closes; the folder is gone from the chooser and the Workspaces view; the success toast "docs-site removed. Files, memories, and run history were not deleted." VIS-009. If the removed folder was the chosen one, the chip falls back to Temp workspace.

### UXJ-004 — Refused

With a run running in the folder, Remove (after the confirmation) shows the error toast "Stop active runs before removing this workspace." and changes nothing. VIS-010.

## Screen And Surface Specification

| Surface | Purpose | Screenshots |
| --- | --- | --- |
| Run section header + menu, three views | Choose how runs are shown | VIS-001…VIS-006 |
| Menu keyboard focus | Focus ring on the button | VIS-011 |
| zh-CN | Chinese strings | VIS-012 |
| Narrow drawer (600x800) | Same menu in the drawer | VIS-013 |
| Chat chooser "Remove" | Hover, confirmation, done, refused | VIS-007…VIS-010 |

## Content And Copy (normative English; zh-CN in `localization/messages/zh-CN/workspaceFolders.ts`)

| Key | Text |
| --- | --- |
| Button title and aria-label | "View and add" |
| Menu section | "View" |
| Menu items | "Runs", "Workspaces", "Projects"; "Add workspace", "New Project" |
| Header title | "Runs" / "Workspaces" / "Projects" |
| Chooser remove button title and aria-label | "Remove {name}" |
| Confirmation | title "Remove folder"; body as in UXJ-003 step 2; buttons "Cancel", "Remove" |
| Success toast | "{name} removed. Files, memories, and run history were not deleted." |
| Refusal toast | "Stop active runs before removing this workspace." (the server's existing message) |

## Responsive, Accessibility, Motion

- Narrow (below the docked breakpoint): the section is in the left drawer; the menu is the same, anchored under the button inside the drawer (VIS-013). The chooser's remove button is always visible below `md`.
- Header title is an `h2` labelling the region (`role=region`, `aria-labelledby`). The button has `aria-haspopup=menu` and `aria-expanded`; the menu is `role=menu` with `menuitemradio` items (`aria-checked`) and a `menuitem` add action.
- Motion: the chooser's remove button fades in over 150ms (`transition-[opacity,color,background-color]`); no other new motion.

## Mocked Boundaries And Simulation

- The view is the real product control; it writes the same local-storage key the existing Workspaces | Projects choice used.
- "Remove" is answered by a small design-only store (`stores/workspaceFoldersStore.ts`, local storage `autobyteus.prototype.removedFolders`) and a plugin (`plugins/96.workspace-folders.client.ts`) that keeps the example folders and removes the removed ones from the UI reference's workspace store. Production: the existing `removeWorkspace` mutation and guard; no new server API.
- Example folders (`prototype/workspace-folders/workspaceFoldersFixture.ts`): `client-portal` (has runs), `docs-site`, `design-notes` (no runs). The Runs view's example runs are `prototype/conversations-list/conversationsFixture.ts` (reused from `left-panel-super-agents`). All illustrative.
- The refusal is scripted: in scenario `live_runs` the folder `prototype-workspace` has an active run.

## Requirement Impact (for the Solution Designer)

- No longer needed: REQ-001 (hide), REQ-003 (a hidden folder returns on a run), REQ-005 (hidden state on the server), AC-001, AC-003, AC-004, AC-006, AC-008, DEC-003, DEC-005, DEC-006, DEC-007. Nothing is hidden; no `shownInWorkspacesTree`, no hidden list, no hide/show commands.
- Still needed: REQ-002/AC-002 (chooser "Remove" with a confirmation) and REQ-004/AC-005 (refused while a run is running).
- New: the left panel's run section has three views (Runs, Workspaces, Projects) chosen from a header menu, remembered per window; the tree's folder X is removed. The Runs view is the approved `left-panel-super-agents` list; building this ticket builds that list.
- Wording decided by the design: tree X gone; chooser removal text as above (the old text said "Stored history for this folder will not appear under Workspaces unless you add the workspace again"; the new body says the folder "will no longer be offered when you choose a folder").
- Left unchanged and noted: the phone lists every folder; a delegation into a removed folder re-registers it as today (E-03).

## Design Findings

- The source's tree and chooser equal the accepted baseline; no baseline refresh was needed.
- `left-panel-super-agents` (approved, not implemented) is now a dependency of this design (the Runs view); its own ticket and this one should be implemented together or in that order.
- The strip icon (`ph:tree-view`) is unchanged; only its tooltip follows the view.
