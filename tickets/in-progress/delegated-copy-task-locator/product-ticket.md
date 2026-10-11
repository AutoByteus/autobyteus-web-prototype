# Product Ticket — delegated-copy-task-locator

## Identity And Scope

- Ticket / request ID: `delegated-copy-task-locator`. Supplied request identifier: Project Task
  `project_task_be04657c-3a63-4215-b68f-dc2d0447baac` (Project `project_a1377344-25db-482a-97cc-ecfdb0fb495a`).
  There is no second ID.
- Title: Navigate from a delegated agent/team copy back to its Task.
- Mode: `Product Experience Design`. It evolves the accepted AutoByteus Web baseline: the Workspaces
  tree's Task-worker rows, the worker's run header, and the right panel's Projects tab.
- Status: `Awaiting User Review`
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
- Product acceptance result and date: focused Refresh **accepted** 2026-10-11. Bootstrapper run
  `ui_baseline_bootstrapper_baaff6a19bd74d8b95fe08f18364661a`, report `ui-baseline-report.md`, evidence
  `evidence/delegated-copy-task-locator/`. Product review:
  - the 13 named files are byte-identical to `ff227eb` (`cmp`);
  - the new fixtures `task-retire` and `temp-task-faq` are invented;
  - the browser shows the toggle and Cancelled lane (page and right-panel tab).
  Mixed pin: Projects Task-status surfaces at `ff227eb`, everything else at `1cd1a3a`. Source observation
  passed on to engineering: `ring-slate-300` is never generated (tailwind does not scan `utils/`), so
  the Cancelled pill shows the default ring in the source and in the baseline.
- Design revision for this ticket: pending
- Default-entry-point validation after integration: pending
- Integration target and result: `personal`, `Pending`
- Runtime isolation record: Product dev server `corepack pnpm dev --port 4641 --host 127.0.0.1` (owned by
  this ticket, running for review); scripts and captures under `/tmp/dctl/` (copies kept in
  `review-evidence/`). Fixture state is in-memory (reset by reload).
- Cleanup result or blocker: `Pending`
- Ticket folder: `tickets/in-progress/delegated-copy-task-locator/`

## Proposed Design (round 1)

One recommended design. Alternatives are described in words, not built.

- **DEC-001 Task line on copy rows.**
  - A task Agent or task Team row whose copy has a Task shows the Task summary (first line, the
    card's one-line label) as a second line under the name.
  - Style: 11 px (`text-[0.6875rem]`), `leading-4`, regular weight, `gray-500` (`indigo-700` when the
    row is selected), truncated with an ellipsis.
  - Member rows of a team copy, `@` collaborator rows and copies with no known Task keep one line.
  - The branch elbow and the team disclosure stay on the name line.
  - This answers "which Task is this copy on?" at a glance and tells look-alike copies apart (23.png).
- **DEC-002 Row-end locate button (icon button, not a link).**
  - Placement: at the end of the copy row's name line.
  - Style: the tree's row-action button (20 × 20 px, 14 px `heroicons:clipboard-document-list-20-solid`,
    `gray-400`; hover `indigo-50` fill and `indigo-600` icon).
  - Revealed on row hover and keyboard focus (always shown below `md`), like the tree's archive and
    delete actions.
  - Tooltip and accessible name: "Show Task in Projects: <Task>". The row's accessible name ends with
    ", Task: <Task>".
  - Clicking it locates the Task (DEC-004). It does not open the copy or change the center view.
- **DEC-003 Task chip in the copy's run header.**
  - Shown when a task Agent, or any member of a task Team, is on screen: a chip after the status names the
    copy's current Task. Members show their team copy's Task.
  - Style: `border-slate-200`, white, `rounded-md`, `px-2 py-1`, 12 px medium `slate-600`, with the same
    14 px Task icon in `slate-400`; hover `slate-50` / `slate-300` border. It truncates; the name does not.
  - Click: locate (DEC-004). Accessible name "Task: <Task>. Show it in Projects".
  - It also covers a collapsed left panel (`collapsed-left-panel-expand-keeps-run`).
- **DEC-004 Locate = board + highlight, not Task detail.**
  - The right panel is revealed on **Projects** the same way the right strip reveals a tool: docked, or
    the drawer in narrow windows; a collapsed panel reopens.
  - The picker chooses the Task's Project, or **Temp tasks** for a Task with no Project. The choice is
    remembered like a manual pick.
  - A Task open inside the tab returns to the board.
  - The card scrolls to the centre (smooth; instant with reduced motion) and takes keyboard focus, so
    Enter opens it.
  - The card shows the board's live-change highlight (indigo-50 wash with a 2 px indigo-500 left bar,
    fading over 2.4 s); this matches the tree's selected-row colours.
  - Why the board: the lane shows the status and the neighbouring Tasks, and the detail is one Enter or
    click away.
- **DEC-005 Hidden by filters.**
  - A search that hides the Task is cleared.
  - A Cancelled Task turns on "Cancelled (N)" and is located in the Cancelled lane.
  - A Done Temp task past the first ten turns on "Show all".
  - Other filters stay as they are.
- **DEC-006 Done / Cancelled.** In the product, a copy's row leaves the tree once its Task is Done or
  Cancelled (`isListed`), and a closed copy cannot be opened from its card. So the row button and header
  chip almost always point at an open Task. DEC-005 covers a Task that closes just before the click.
- **DEC-007 Follow-up Tasks.**
  - A copy given a follow-up Task shows and locates its **current** Task: the open one updated last,
    else the one updated last.
  - Earlier Tasks are not listed. Their cards on the board still show the copy as their worker.
  - History in the tooltip or a menu was considered and not built: it adds a menu to a tree row, and the
    board already shows it.
- **DEC-008 No Project (Temp tasks).** Same behaviour; the picker switches to **Temp tasks**.
- Alternatives considered (not built):
  - a text link on the row;
  - opening the Task detail instead of the board;
  - showing the button always (noisy across many rows);
  - Task labels only on look-alike rows (inconsistent);
  - a Task column on the right of the row (too narrow at 320 px).
- Round 1 changes:
  - DC-001 `WorkspaceTransientExecutionRow.vue`: the Task line, the locate button, the name-line elbow
    and disclosure, and the accessible name.
  - DC-002 `AgentWorkspaceSurface.vue`: the header Task chip.
  - DC-003 `stores/taskLocatorStore.ts` (new), `composables/projects/useDelegatedCopyTask.ts` (new): the
    copy → current Task lookup and the locate request.
  - DC-004 `WorkspaceToolShell.vue`: locate reveals the Projects tab.
  - DC-004 `ProjectsPanel.vue`: shows the board.
  - DC-004 `ProjectTaskBoard.vue`, `TempTaskBoard.vue`: clear the hiding search, show Cancelled, show all
    Done.
  - DC-004 `ProjectTaskRow.vue`: scroll, focus and the located highlight.
  - DC-005 en / zh-CN strings `workspace.history.copyTask.*`.
  - DC-006 icon bundle: `clipboard-document-list-20-solid` / `-16-solid`.
  - DC-007 design-only fixture: `prototype/delegated-copy-tasks/delegatedCopyTasksFixture.ts`,
    `plugins/98.delegated-copy-tasks.client.ts`, `utils/apolloClient.ts` hook. It adds:
    - the "Project Task Manager" run `run-ptm-0001` with five copies;
    - the "Desktop App" Project with their Tasks, one Prototype Launch Task and one Temp task;
    - copy 3's Done Task and its follow-up Task.
    All of it is invented.
- Round 1 validation (Chromium, `review-evidence/round-1/r1*.mjs`, `r2*.mjs`):
  - Header chip on solution designer of copy 2 → Desktop App, "Members of a delegated team…" located
    and focused (R1-04).
  - Row button on agent package creator 1 → picker switches to Prototype Launch, Task located (R1-05).
  - Row button on agent package creator 2 → Temp tasks, Task located (R1-06).
  - Right panel collapsed → reopened on Projects; copy 3's follow-up Task "Image context files…"
    located (R1-07a/b).
  - Search "release" hides the Task → cleared, Task located (R1-08a/b).
  - A Task open in the tab → back to the board, Task located.
  - Keyboard: Tab from the row focuses the button (visible, focus ring) → Enter locates → focus is on
    the card → Enter opens the Task (R1-09).
  - 900 × 800: the right drawer opens on Desktop App with the Task located (R1-10).
  - `typecheck`, `lint`, `test` (15/15) and `validate:boundaries` pass.

## Round 1 Feedback And Round 2 (current proposal)

- User feedback on round 1 (2026-10-11), with a screenshot of the Research Assistant run:

  > To be honest, I wouldn't put the task description under the individual agent itself, because you put
  > task itself on an individual agent, but you don't have a way to put it under the task team. I would
  > still just start with only the icon, you know. I would start with the icon.

- Round 2:
  - DEC-001 is **withdrawn**. Copy rows have no Task line; every row is one line again.
  - DEC-002 is changed: the locate icon is **always shown** at the end of a task Agent or task Team row
    whose copy has a Task, because it is now the only cue that a row works on a Task. Rows without a
    Task (`@` collaborators, team members, unknown Task) have no icon.
  - The style is unchanged: 20 × 20 px, 14 px `clipboard-document-list-20-solid`, `gray-400`, hover
    `indigo-50` / `indigo-600`.
  - The tooltip ("Show Task in Projects: <Task>") and the row's accessible name (", Task: <Task>") still
    carry the Task title.
- Round 2 changes:
  - DC-008 `WorkspaceTransientExecutionRow.vue`: removed the Task line, the name-line elbow/disclosure
    override and the hover-only reveal.
  - DEC-003 (header chip) and DEC-004 to DEC-008 are unchanged.
- Round 2 validation (`review-evidence/round-2/r3.mjs`):
  - PTM run: an icon on all five copies, none on members (R2-01).
  - The row button locates "Members of a delegated team…" (R2-02).
  - Research Assistant run: the `@` collaborators have no icon; the two Task workers do (R2-03).

## Round 2 Feedback And Round 3 (current proposal)

- User feedback on round 2 (2026-10-11), with a screenshot of the documentation writer header and its
  chip:

  > Let's remove the one on the top as well. because since there's icon, I can click and navigate
  > directly.

- Round 3:
  - DEC-003 (header Task chip) is **withdrawn**. `AgentWorkspaceSurface.vue` is back to the accepted
    baseline (`a55ced2`), and the string `workspace.history.copyTask.chipLabel` is removed.
  - The only entry point is the always-shown row icon (DEC-002 as changed in round 2), followed by the
    locate behaviour (DEC-004 to DEC-008).
- Round 3 validation (`review-evidence/round-3/r4.mjs`):
  - The documentation writer copy's header has no chip (R3-01).
  - Its row icon locates "Review the synthetic navigation baseline." in Prototype Launch, highlighted
    (R3-02).

## Round 3 Question And Round 4 (two variants for comparison)

- User question (2026-10-11): why does only the individual agent get the Task link; was the task team
  forgotten? Answer: team copies with a Task do get it (the "software engineering team" rows of the PTM
  run). "product review team" in the Research Assistant run is an `@` collaborator with no Task.
- User request (2026-10-11):

  > Can we try two variants? ... one is the task icon ... Another one is a task summary under the
  > dedicated agent or dedicated agent team. What is your opinion? ... if there is a short summary like
  > the earlier one, and I can click the summary to navigate.

- Two review servers run the same worktree; the variant is a server setting, not a page control:
  - **Variant A** (`http://127.0.0.1:4641`): the round-3 design, an always-shown row icon.
  - **Variant B** (`http://127.0.0.1:4642`): no icon. A task Agent or task Team row with a Task shows the
    Task summary as a second line.
    - Style: 11 px, `gray-500`; on hover, an `indigo-700` underline. The line truncates; the elbow and
      disclosure stay on the name line.
    - Clicking the summary locates the Task (DEC-004); clicking elsewhere on the row opens the copy as before.
    - Tooltip and accessible name: "Show Task in Projects: <Task>".
- Review-only scaffolding, removed when the user chooses:
  - `nuxt.config.ts` `buildDir` (`DESIGN_BUILD_DIR`), `runtimeConfig.public.copyTaskVariant`
    (`NUXT_PUBLIC_COPY_TASK_VARIANT`) and the ignore of `.nuxt-variant-*`;
  - the `variant` branch in `WorkspaceTransientExecutionRow.vue`.
- Commands:
  - A: `DESIGN_BUILD_DIR=.nuxt-variant-a NUXT_PUBLIC_COPY_TASK_VARIANT=icon corepack pnpm exec nuxt dev --port 4641 --host 127.0.0.1`
  - B: `DESIGN_BUILD_DIR=.nuxt-variant-b NUXT_PUBLIC_COPY_TASK_VARIANT=summary corepack pnpm exec nuxt dev --port 4642 --host 127.0.0.1`
- Round 4 validation (`review-evidence/round-4/r5.mjs`):
  - A: 5 icons, no summaries (R4-A).
  - B: 5 summaries, no icons (R4-B). The hover underline shows (R4-B-hover). Clicking copy 2's summary
    locates "Members of a delegated team…" and the center keeps the PTM run (R4-B-located).
- Designer's recommendation: B. It answers the original problem (identical rows, 23.png) without hovering,
  and it covers team copies and agent copies alike. Its cost is one extra line per copy, and two click
  targets in one row (the name opens the copy, the summary opens the Task); the hover underline makes the
  second target clear.

## Delivery And Validation

- UI/UX specification: pending
- Runnable UI reference entry point: `http://127.0.0.1:4641/workspace` → prototype-workspace → Project Task
  Manager → "Dispatch the approved desktop app Tasks" (same as `/chat?id=run-ptm-0001`); right panel **Projects**
- Visual-reference directory: pending
- Supporting artifact paths: pending
- Validation commands and results: pending
- User-confirmation reference: pending
- Mocked boundaries and known limitations: pending

## Outcome And Handoff

- Completed behavior and evidence: none yet
- Remaining product decisions: all decision questions above
- Next expected action: user reviews round 1 at the review URL and gives feedback or approval.
- Handoff outcome from `get_handoff_rules`: `Baseline Needed`
- Matched recipient address, when a rule applies: `/product_team/ui_baseline_bootstrapper`
- Return context when no matching rule applies: n/a
