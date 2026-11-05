# Product Ticket: workspace-tree-vs-chooser (Project Task autobyteus-385)

- Status: `Awaiting User Review`
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
