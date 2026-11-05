# Product Ticket: workspace-tree-vs-chooser (Project Task autobyteus-385)

- Status: `Design Completed` (user-approved 2026-11-05; the Result Correction round re-approved the same day: "now everything is good now. approved"); integration `Pending`
- Mode: Product Experience Design (evolves the accepted baseline)
- Requested by: Solution Designer run `solution_designer_8dc321539e5e490ea700d6e7f58d14ff`, at the user's request
- Request: `/Users/normy/autobyteus_org/autobyteus-worktrees/workspace-tree-vs-chooser/tickets/in-progress/workspace-tree-vs-chooser/product-design-request.md`
- Design repository: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket branch / worktree: `design/workspace-tree-vs-chooser` / `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/workspace-tree-vs-chooser`
- Accepted design base: `a0e18abb49320c8f3c4ad5cfad830863ca6684df` (`origin/personal`, fetched 2026-11-05)
- Baseline: accepted (`ui-baseline-report.md`); the source's tree and chooser were checked against `origin/personal@3ef5e33eec`: the source implements the accepted `projects-left-navigation` design, no visible difference.
- Runtime: UI reference `corepack pnpm dev --port 3385`, `http://127.0.0.1:3385/workspace`; process owned by this ticket; reset: remove the local-storage keys below and reload.

## Design direction (the user's, 2026-11-05)

1. First sketch (per-folder "hide", a dim "Hidden (N)" group): built, then dropped.
2. The user: no hiding of folders or Projects at all. Instead one header button that switches the left panel between three **views**: Runs (no grouping; the approved `left-panel-super-agents` list), Workspaces (today's tree), Projects (today's Projects tree).
3. The tree's "X" (which unregistered the folder from the chat's chooser too) is removed. Removing a folder is only the chat chooser's "Remove", with a confirmation.

## Requirement impact (to the Solution Designer)

REQ-001, REQ-003, REQ-005, AC-001, AC-003, AC-004, AC-006, AC-008 and DEC-003, DEC-005, DEC-006, DEC-007 (the hidden list, "Show", running folders) no longer apply: nothing is hidden and nothing is stored on the server. REQ-002 / AC-002 and REQ-004 / AC-005 stay (chooser "Remove"; refused while a run is running).

## Local-storage keys (starting state / memory of the UI reference)

- `autobyteus.leftPanel.runSectionMode.<node>`: `runs` | `workspaces` | `projects` (the chosen view; default `workspaces`)
- `autobyteus.prototype.removedFolders`: folders removed from the chooser in this browser (remove the key to reset)

## Result

- UI/UX spec: `tickets/in-progress/workspace-tree-vs-chooser/ui-ux-spec.md`; final screenshots `visual-references/VIS-001…VIS-013`; runbook section in `ui-reference-runbook.md`.
- Ticket commits: first round `48fc230f`, `34fa3b8f`; Result Correction round: see the latest commit of `design/workspace-tree-vs-chooser` (base `a0e18abb`). Final screenshots `visual-references/VIS-001…VIS-017`.
- Integration: `Pending`, by the user's standing decision (2026-11-04, left-panel-super-agents): an approved design stays on its ticket branch until it is implemented, so `personal` keeps mirroring the shipped product. The branch is pushed to `origin`; it is merged into `personal` only after the Solution Designer reports it implemented and the user confirms. Worktree and branch are kept on purpose; the UI reference process was stopped.
- Default branch `personal`: local and `origin` at `a0e18abb` (unchanged).
- Note: this design reuses the approved `left-panel-super-agents` Runs list (copied files, not a merge).

## Result Correction round (2026-11-05)

DEC-010 / REQ-009: the Workspaces and Projects views list a folder or Project only while it has a run. The user also removed "Add workspace" / "New Project" from the view menu and the empty states (the inline add-folder form and its composable are deleted), asked for the chooser's X to be centered and larger, and approved.
