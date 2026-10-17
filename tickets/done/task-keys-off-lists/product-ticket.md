# Product Ticket — task-keys-off-lists

## Identity And Scope

- Ticket / request ID: `task-keys-off-lists`. Supplied request identifier: Project Task `autobyteus-133`.
- Title: Design record — Task keys no longer show on board cards or in the Workspaces tree.
- Mode: `Product Experience Design` (revision of the approved `task-keys-and-dependencies` record).
- Status: `Completed`
- Requester: `/project_task_manager` (AgentRun `project_task_manager_7c8dce0c4a8b44f88e776a83809dee03`),
  2026-10-17, on behalf of autobyteus-132's Solution Designer (`requirements-doc.md` SR-001, Approved).
- The user's direction (2026-10-17, after beta v1.5.5-beta.3):
  - "we don't need to show that on the UI… it's only used to link";
  - "remove the task key from displaying on the left side as well… show it like previous".
- In scope: the spec text (DEC-001, DEC-008 and the affected sections), the affected references and the
  runnable UI reference.
- Not changed: everything else in the approved record (key chip, dependency rows, badge, picker, editing).

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket folder: `tickets/done/task-keys-off-lists/`
- Ticket worktree / branch: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/task-keys-off-lists`,
  `design/task-keys-off-lists` (base `1ebf4c6`)
- Source pin of the baseline: `autobyteus-web@73f743211c`.
- Follow-up note: `origin/personal` (`aa84fd0`, 2026-10-17) has since shipped `task-keys-and-dependencies`
  in the source (`TaskKey.vue`, `TaskKeyChip.vue`, `TaskDependency*.vue`). autobyteus-132 (the declutter)
  is not on `personal` yet. When it ships, a baseline refresh should replace the design-only implementation
  of keys with the source's, as was done for the Task locator in `WEB-BASELINE-REFRESH-009`. Not done
  here: this request is the record update.
- Runtime isolation: `corepack pnpm dev --port 4661` (this ticket); scripts and captures in `/tmp/tkol/`
  (copies in the record's `visual-references/`).

## Delivery And Validation

- UI reference changes:
  - DC-001: `components/projects/ProjectTaskRow.vue` drops the key line.
  - DC-002: `components/workspace/history/TaskWorkerTaskSummary.vue` is restored to the source
    (`73f7432`); no key.
  - DC-003: removed the `taskKey` of the Task worker answer (`types/project.ts` `TaskWorkerTask`, the
    `GetTaskWorkerTasks` query, `stores/taskWorkerTaskStore.ts` restored to the source, the design-only
    `withTaskKeys` and its `apolloClient.ts` hook). This mirrors REQ-004.
- Record changes in `tickets/done/task-keys-and-dependencies/`:
  - `ui-ux-spec.md`: Revision History; DEC-001 and DEC-008 revised; the affected layout, journeys, surfaces,
    accessibility, data and VIS rows updated.
  - The superseded references moved to `visual-references/superseded-2026-10-17/`.
  - Recaptured: VIS-001, VIS-002a–d, VIS-009b, VIS-010, VIS-012, VIS-013, VIS-015. VIS-009c added.
  - Validation and capture scripts updated.
  - `product-ticket.md`: revision note.
- Validation (2026-10-17, port 4661):
  - `final-validation.mjs` passes 14/14:
    - KEY-001: no card key line, badges keep keys;
    - KEY-002: the new Task's key `autobyteus-41` on its page;
    - KEY-003: copy;
    - DEP-001 to DEP-010: unchanged;
    - TREE-001: the tree summary has no key, and its name is "Show Task in Projects: <summary>".
  - typecheck 0 errors; tests 16/16.
- User-confirmation reference: the user's own direction above (the decision itself, relayed by the PM).
- Default-entry-point validation after integration: `Completed`. On the canonical checkout at
  `personal@1796bbb`, `corepack pnpm dev --port 4663` with `final-validation.mjs` (BASE 4663) passed 14/14.
- Integration: `Completed`. Fast-forward `1ebf4c6..1796bbb` (design commit `17ad7e3`); the canonical
  checkout was fast-forwarded; local = origin. This record commit follows the same sequence.
- Cleanup: `Completed`. Servers on ports 4661 and 4663 were stopped; the worktree and local branch are
  removed after this record (no remote ticket branch was pushed).

## Outcome And Handoff

- Next expected action: `/project_task_manager` closes autobyteus-133. A baseline refresh is recommended after autobyteus-132 ships (see the follow-up note).
- Handoff: no `get_handoff_rules` rule matches a completed record update; it is returned to the requester.
