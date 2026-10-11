# Product Ticket — delegated-copy-task-locator

## Identity And Scope

- Ticket / request ID: `delegated-copy-task-locator`. Supplied request identifier: Project Task
  `project_task_be04657c-3a63-4215-b68f-dc2d0447baac` (Project `project_a1377344-25db-482a-97cc-ecfdb0fb495a`).
  There is no second ID.
- Title: Navigate from a delegated agent/team copy back to its Task.
- Mode: `Product Experience Design`. It evolves the accepted AutoByteus Web baseline: the Workspaces
  tree's Task-worker rows, the worker's run header, and the right panel's Projects tab.
- Status: `Baseline Needed`
- Requester: Project Task Manager (`/project_task_manager`, AgentRun
  `project_task_manager_7c8dce0c4a8b44f88e776a83809dee03`) for the user, 2026-10-11. The user decided on
  2026-10-11 that the Product Team designs the UI first. A separate implementation Task follows approval.
- User evidence: `23.png` (Workspaces tree: identical "software engineering team" / "agent package
  creator" rows under the Project Task Manager run, with no way to see their Task) and `24.png` (Task card
  worker line opens the copy; works today). Paths:
  - `/Users/normy/.autobyteus/server-data/projects/project_a1377344-25db-482a-97cc-ecfdb0fb495a/tasks/project_task_be04657c-3a63-4215-b68f-dc2d0447baac/context/ctx_ec617c160a18__23.png`
  - `/Users/normy/.autobyteus/server-data/projects/project_a1377344-25db-482a-97cc-ecfdb0fb495a/tasks/project_task_be04657c-3a63-4215-b68f-dc2d0447baac/context/ctx_52ffba315de3__24.png`
- Related requirements revision: none supplied (no `requirements-doc.md`; Solution Designer not involved yet).
- Critical journey: a delegated copy row in the Workspaces tree → a control at the row's end (and/or the
  copy's run header) → the right panel's Projects tab opens on the right Project, with that Task's card
  scrolled into view and highlighted (or its Task detail open).
- Decision questions (from the request):
  - icon button vs link; Task title on hover;
  - a Task that is DONE/CANCELLED or hidden by the board's filters (search, the Cancelled lane);
  - a copy that moved on to a follow-up Task (current Task, maybe history);
  - a copy whose Task has no Project (Temp tasks);
  - optionally a short Task label on otherwise identical rows.
- Related designs: `collapsed-left-panel-expand-keeps-run` (project_task_b2b0538a: reveal/scroll of the open
  run), delegated-team status colours (project_task_7a42fa46).
- Product paths confirmed in source `origin/personal@ff227eb`:
  - Task-worker rows: `components/workspace/history/AgentRunTaskRows.vue`,
    `WorkspaceTransientExecutionRow.vue` (`transientKind` `task_agent` / `task_team` / `task_team_child`);
    rows of a closed Task execution leave the listing (`agentRunCollaborationContext.isListed`).
  - Task card → worker: `components/projects/ProjectTaskRow.vue` / `TaskRoot*` (`project-task-worker-*`).
  - Right panel Projects tab: `components/projects/panel/*`, `stores/projectsPanelStore.ts` (Project/Temp
    picker, board, Task inside the tab).
  - Board filters: search; Cancelled lane hidden until "Cancelled (N)" (`CancelledTasksToggle.vue`, added after
    the baseline pin).
- In scope: Task-worker rows (task Agent, task Team, task Team member) of a standalone run; the copy's run
  header; the Projects tab locate/highlight behaviour; edge cases above; en/zh-CN strings.
- Non-goals: production implementation; server/API changes; `@` collaborator rows (not Task workers);
  Team/Org member rows that are not Task copies; `/mobile`.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
  (`https://github.com/AutoByteus/autobyteus-web-prototype.git`, default branch `personal`)
- Design ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/delegated-copy-task-locator`
- Design ticket branch: `design/delegated-copy-task-locator`
- Source repository and selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`, `autobyteus-web`
- Pinned source revision: `1cd1a3abc126df820e334c023621d0fb82de5b7b` (WEB-BASELINE-REFRESH-008)
- Accepted baseline revision: `dd89b84e70ad72afe6f847c229c17b1622b1da53` (`origin/personal`, fetched 2026-10-11)
- Baseline report: `ui-baseline-report.md` (repository root)
- Baseline check (2026-10-11): `git diff 1cd1a3a origin/personal@ff227eb -- autobyteus-web` changes 81 files.
  In-scope UI files:
  - Workspaces tree, run header, right panel shell: **unchanged**.
  - Projects Task status: **changed**. A CANCELLED status was added (`17e4299`, `814e41a`, `7f7b2c8`):
    `CancelledTasksToggle.vue`, `ProjectTaskBoard.vue`, `TempTaskBoard.vue`, `ProjectTaskDetail.vue`,
    `TempTaskDetail.vue`, `TempTasksLink.vue`, `ProjectCard.vue`, `panel/ProjectsPanelTaskDetail.vue`,
    `utils/projects/taskStatusPresentation.ts`, `types/project.ts`, `stores/projectTaskStore.ts`, and the
    `projects` en/zh-CN messages.
  - The baseline has no Cancelled status, toggle or lane. The request's "CANCELLED / hidden Cancelled lane"
    decision depends on it, so a focused refresh of these surfaces is needed before future-state work.
- Product acceptance result and date: pending (focused refresh requested 2026-10-11)
- Design revision for this ticket: pending
- Default-entry-point validation after integration: pending
- Integration target and result: `personal`, `Pending`
- Runtime isolation record: Product dev server port `4641` (stopped before the Bootstrapper handoff);
  scripts and captures under `/tmp/dctl/`; Bootstrapper picks its own ports. Fixture state is in-memory
  (reset by reload).
- Cleanup result or blocker: `Pending`
- Ticket folder: `tickets/in-progress/delegated-copy-task-locator/`

## Delivery And Validation

- UI/UX specification: pending
- Runnable UI reference entry point: `/chat?id=run-research-001` and `/workspace` (Workspaces tree), right
  panel **Projects**
- Visual-reference directory: pending
- Supporting artifact paths: pending
- Validation commands and results: pending
- User-confirmation reference: pending
- Mocked boundaries and known limitations: pending

## Outcome And Handoff

- Completed behavior and evidence: none yet
- Remaining product decisions: all decision questions above
- Next expected action: UI Baseline Bootstrapper completes the focused Refresh (Cancelled Task status) in
  this worktree; the Product UI/UX Designer reviews and accepts it, then starts the design.
- Handoff outcome from `get_handoff_rules`: `Baseline Needed`
- Matched recipient address, when a rule applies: `/product_team/ui_baseline_bootstrapper`
- Return context when no matching rule applies: n/a
