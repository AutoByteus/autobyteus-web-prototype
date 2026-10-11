# Product Ticket — task-keys-and-dependencies

## Identity And Scope

- Ticket / request ID: `task-keys-and-dependencies`. Supplied request identifier: Project Task
  `project_task_21c58d74-129a-454e-ae56-cffec4274aaf`. There is no second ID.
- Title: Readable Task keys and a "depends on" relationship (step 1 of Task relationships).
- Mode: `Product Experience Design`. It evolves the accepted AutoByteus Web baseline:
  - the Projects board (page and right-panel tab);
  - the Task detail (page and tab);
  - the New / Edit task page;
  - the Workspaces-tree Task summary approved in `delegated-copy-task-locator`.
- Status: `Awaiting User Review`
- Requester: Project Task Manager (`/project_task_manager`, AgentRun
  `project_task_manager_7c8dce0c4a8b44f88e776a83809dee03`) for the user, 2026-10-11.
- Related requirements revision: none (design first; a separate implementation Task follows approval).
- Agreed model, from the requester's messages of 2026-10-11:
  - **Keys:** `<project name in lower case>-<number>`, numbered per Project in creation order. Existing
    Tasks get keys too. A key never changes, even if the Project is renamed. The long ID stays underneath.
  - **Stored:** exactly one directed relationship, `depends on`, set on the later Task. It covers ordering
    and follow-ups ("B depends on A", often created after A is Done). There is no separate follow-up type.
  - **Derived:**
    - the card badge "Blocked by <key>", only while a dependency is not Done;
    - the inverse on the other Task, "Required by <key>", never stored.
  - **Detail:** "Depends on" always lists every dependency, including Done ones ("autobyteus-37 · Done ✓").
  - **Never prevents work.** Wording changes need the user's approval.
- Decision questions:
  - key placement and prominence, and a copy action;
  - the badge with several blockers;
  - a Cancelled dependency;
  - whether a user can add or remove dependencies in the app;
  - cross-Project dependencies;
  - long keys;
  - fit with the board, the detail and the tree's Task summary.
- In scope:
  - keys on cards, the detail page, the tab's Task view and the tree's Task summary;
  - the Blocked / cancelled badge;
  - the Depends on / Required by lists;
  - the "Depends on" field on New / Edit task;
  - en / zh-CN strings.
- Non-goals:
  - parent / child, duplicate, graphs, filters, automatic notices;
  - agent tool output and tool input (implementation step);
  - keys for Temp tasks;
  - full Projects-page search by key beyond the existing text search.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Design ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/task-keys-and-dependencies`
- Design ticket branch: `design/task-keys-and-dependencies`
- Source repository and selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`, `autobyteus-web`
- Pinned source revision (mixed pin, from `ui-baseline-report.md`):
  - Projects Task-status surfaces at `ff227eb`;
  - everything else at `1cd1a3a`.
- Baseline check (2026-10-11): `git diff ff227eb origin/personal@359d2c0` shows no change under
  `components/projects`, `utils/projects`, `types/project.ts`, `stores/projectTaskStore.ts`, the `projects`
  messages or `pages/projects`. The tree and layout changes since `1cd1a3a` are the shipped
  collapsed-left-panel work, which the baseline already carries as an accepted design. The baseline is
  current for this scope, so no Bootstrapper request was made.
- Accepted baseline revision: `5f5cdf881b30689f103b418530c0bd1a22b1ed5a` (`origin/personal`)
- Baseline report: `ui-baseline-report.md`
- Design revision for this ticket: pending
- Default-entry-point validation after integration: pending
- Integration target and result: `personal`, `Pending`
- Runtime isolation record:
  - `corepack pnpm dev --port 4651 --host 127.0.0.1` (this ticket);
  - scripts and captures in `/tmp/tkd/` (copies in `review-evidence/`);
  - in-memory fixtures, reset by reload.
- Cleanup result or blocker: `Pending`
- Ticket folder: `tickets/in-progress/task-keys-and-dependencies/`

## Proposed Design (round 1)

One recommended design.

- **DEC-001 Key on cards.** A quiet line above the summary: `autobyteus-36`, 12 px medium `slate-500`. It
  appears on every Project Task card (the board page and the right-panel tab).
- **DEC-002 Key on the Task detail.**
  - A chip after the status pill: `autobyteus-36` with a copy button (border `slate-200`, white,
    `rounded-md`, 14 px medium).
  - Copy writes the key to the clipboard; the button turns `emerald-700` with a check and "Copied" for 1.5 s.
  - The same chip appears in the right panel's Task view, beside the status.
- **DEC-003 Badge on open cards (To Do / In Progress) only.**
  - **Blocked:** "Blocked by autobyteus-35" (amber-50 / amber-800 / ring amber-200, link icon) while any
    dependency is To Do or In Progress.
  - **Several blockers:** the first open one by key number, then "+N" ("Blocked by autobyteus-38 +1").
    Hovering lists all dependencies with their status.
  - **Cancelled:** "Dependency cancelled: autobyteus-31" (white / slate-600 / ring slate-300, x-circle
    icon) when no dependency is open but one was cancelled. A cancelled dependency is never silently
    treated as unblocked.
  - Nothing once all dependencies are Done, or on Done / Cancelled cards.
- **DEC-004 Detail lists.**
  - "Depends on": every dependency, Done ones included. Each row shows the key, the status pill (Done
    has a ✓) and the summary, and links to that Task.
  - "Only informs: work on this Task can start at any time." while blocked.
  - "Required by" is derived: the Tasks that depend on this one.
  - An empty list shows "None".
  - In the right-panel tab, a row opens that Task inside the tab.
- **DEC-005 Users can set dependencies** with a "Depends on (optional)" field on New task and Edit task.
  - Help text: "Tasks in <Project> that come first, including a Task this one follows up. It never stops
    work on this Task."
  - Chosen Tasks appear as rows with a remove button.
  - A search box ("Add a Task · Search by key or text") lists up to 8 Tasks of **this Project only**,
    newest key first.
  - A Task that already depends on this one, directly or not, is shown greyed out with "Depends on this
    Task" and cannot be chosen (no loops).
  - Keyboard: arrows and Enter; Esc closes the list. The list closes after a choice.
  - Agents set the same field through their tools (implementation step).
- **DEC-006 Cross-Project dependencies are not offered.**
- **DEC-007 Long keys.** Where the whole key fits it is shown whole. Where it does not (badge, narrow
  rows), the Project part is shortened in the middle and the number stays visible
  ("customer-onboarding-experie…-12"). The full key is in the tooltip.
- **DEC-008 Tree.** The approved Task summary on delegated-copy rows leads with the key:
  "autobyteus-29 Token Meter accuracy…". The key is medium weight.
- **DEC-009 Temp tasks** have no key and no dependencies (keys are per Project).
- Alternatives considered (not built):
  - the key inline before the title (it competes with the title);
  - the key in the card footer (hard to scan);
  - a badge with every blocker listed (too wide);
  - read-only dependencies with agents setting them (possible; it removes DEC-005);
  - `temp-N` keys for Temp tasks.
- Open questions for the user:
  - DEC-005: should users edit dependencies in the app?
  - Key prefix collision: after a Project is renamed, a new Project could take the old name and reuse
    the prefix. Engineering should reserve a prefix per Project.
- Round 1 changes:
  - DC-001 `types/project.ts` (`taskKey`, `dependsOnTaskIds`) and the `projectTaskQueries` fragment.
  - DC-002 `utils/projects/taskDependencies.ts` (dependencies, required by, badge, loop set).
  - DC-003 `TaskKey.vue`, `TaskKeyChip.vue`, `TaskDependencyBadge.vue`, `TaskDependenciesSection.vue`,
    `TaskDependencyPicker.vue` (new).
  - DC-004 `ProjectTaskRow.vue` (key, badge), `ProjectTaskDetail.vue` (chip, section),
    `ProjectsPanelTaskDetail.vue` / `ProjectsPanel.vue` (chip, section, open inside the tab),
    `ProjectTaskDraftEditor.vue` + `useProjectTaskDraft.ts` + `projectTaskStore.ts` (Depends on field and
    save).
  - DC-005 `WorkspaceTransientExecutionRow.vue` (the key in the tree summary).
  - DC-006 en / zh-CN `projects.key.*` and `projects.deps.*`.
  - DC-007 icon bundle: `link-20-solid`, `x-circle-20-solid`, `check-20-solid`.
  - DC-008 design-only fixture `prototype/task-keys/taskKeysFixture.ts` and its `apolloClient.ts` hooks.
    The example "Desktop App" Project is renamed "AutoByteus". It adds the dependency Tasks and the long-name
    Project. All of it is invented.
- Round 1 validation (`review-evidence/round-1/r1.mjs`, Chromium): **13/13**.
  - keys on every card;
  - one blocker; several blockers with "+1" and a hover list;
  - only Done dependencies → no badge; cancelled dependency;
  - no loop in the picker;
  - keyboard add, save, then the badge on the board;
  - Required by;
  - remove → badge gone;
  - a new Task gets `autobyteus-41`;
  - copy → clipboard "autobyteus-36" and "Copied".
  - `typecheck` passes.

## Delivery And Validation

- UI/UX specification: pending
- Runnable UI reference entry point:
  - `http://127.0.0.1:4651/projects/project-desktop-app` (the AutoByteus board);
  - `/projects/project-onboarding-redesign` (long keys);
  - `/chat?id=run-ptm-0001` (tree and right-panel tab).
- Visual-reference directory: pending
- Supporting artifact paths: `review-evidence/round-1/`
- Validation commands and results: see Round 1 validation
- User-confirmation reference: pending
- Mocked boundaries and known limitations: key assignment and dependency storage are scripted in the
  browser fixture; production assigns keys on the server.

## Outcome And Handoff

- Completed behavior and evidence: round 1 ready for review
- Remaining product decisions: DEC-005 (editing in the app); key wording and placement on review
- Next expected action: user reviews round 1
- Handoff outcome from `get_handoff_rules`: pending
- Matched recipient address, when a rule applies: pending
- Return context when no matching rule applies: `/project_task_manager`
