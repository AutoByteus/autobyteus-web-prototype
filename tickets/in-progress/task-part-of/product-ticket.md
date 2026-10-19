# Product Ticket — task-part-of

## Identity And Scope

- Ticket / request ID: `task-part-of` (the Solution Designer's package identifier). Supplied request identifier: Project Task
  `autobyteus-171` ("Task relationships, step 2: a "part of" relationship between Project Tasks"). There is no second ID.
- Title: A "part of" relationship between Project Tasks (a bigger Task and its parts), step 2 of Task relationships.
- Mode: `Product Experience Design`. It evolves the accepted AutoByteus Web baseline in place:
  - the Projects board (page and right-panel tab): the card;
  - the Task page and the tab's Task view;
  - the New / Edit task page;
  - the Task page's delete confirmation.
- Status: `Awaiting User Review` (review package sent 2026-10-19; review URL `http://127.0.0.1:4671/projects/project-desktop-app`)
- Requester: the Solution Designer (AgentRun `solution_designer_f5da9fb3e1e6434e914df387cc785cad`), for the user, 2026-10-19.
- Related requirements revision: `SR-003` (`requirements-doc.md` in
  `/Users/normy/autobyteus_org/autobyteus-worktrees/task-part-of/tickets/in-progress/task-part-of/`): UC-001–UC-007,
  REQ-001–REQ-017 (visuals: REQ-008 to REQ-012), AC-001–AC-018, SCN-001–SCN-011, DEC-001–DEC-019.
- The user's direction (2026-10-19): "because it will make Project Task management easier"; "see a bigger Task with its parts,
  how many parts are done"; stop writing "follow-up of X" notes; "follow the approved design language of step 1"; "Keep it
  small … do not add graphs, automatic status changes or notices unless the user asks"; "we want to make it simple"; relationships
  must be "actually practical".
- Decided behavior (the user, SR-003): one parent per Task of the same Project, any status; one level only; closing the last part
  does not close the parent; setting a parent DONE / CANCELLED sets its open parts the same way (agents do it; the app only
  displays status); deleting a parent leaves its parts without a parent; `depends on` unchanged; Temp tasks have none.
- Decision questions: where a part shows its parent and a parent its parts and progress (Task page, tab, card); how the card
  respects "keys only where they link"; whether the Dependencies card holds the new relation; the parent field on New / Edit
  task and how it blocks a part or a Task with parts; the optional "New part" shortcut, close hint and delete note; en / zh-CN.
- In scope / non-goals: see the requirements doc (no grouping, tree, graph or filter on the board; no notices; no
  agent-tool or server design).

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket folder: `tickets/in-progress/task-part-of/`
- Ticket worktree / branch: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/task-part-of`, `design/task-part-of`
- Accepted design base: `e5ad9d8963a13b875683c7893c9011edb6ff09ac` (`origin/personal`, fetched 2026-10-19)
- Source repository and selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`, `autobyteus-web`
- Baseline pin: `autobyteus-web@2f211340ee36` (v1.5.6-beta.1; `ui-baseline-report.md`, `WEB-BASELINE-REFRESH-010`).
- Baseline check (2026-10-19): the current source is `origin/personal@cba6b85122` (v1.5.6-beta.8). `git diff 2f21134 cba6b85122`
  over `autobyteus-web` changes one UI file, `components/projects/ProjectTaskBoard.vue` (a board search status line for
  "meaning search"), plus its composable, query and strings. Every component this ticket changes (`ProjectTaskRow`,
  `ProjectTaskDetail`, `TaskDependenciesSection`, `TaskDependencyBadge`, `TaskDependencyPicker`, `ProjectTaskDraftEditor`,
  `ProjectsPanelTaskDetail`) is identical between the two revisions. The baseline is current for this scope, so no
  Bootstrapper request was made. The board's meaning-search status line is not in the UI reference and is not touched here; a
  later baseline refresh can bring it in.
- Runtime isolation record: `corepack pnpm dev --port 4671 --host 127.0.0.1` (this ticket); scripts and scratch captures in
  `/tmp/tpo/`; in-memory fixtures, reset by reload.
- Design-only layers: `prototype/task-part-of/taskPartOfFixture.ts` (invented example parents and parts), the mutation rules of
  `prototype/source-observation/fixtures.mjs` (set / change / clear the parent; a deleted parent clears its parts' parent), and the
  `partOfTaskId` field in the types, query and store. The server's one-level, same-Project and cascade rules are not modelled.

## Delivery And Validation

- Review candidate (2026-10-19), UI reference changes (design-only, in the ticket worktree):
  - `components/projects/TaskPartsSection.vue` (new): the "Part of" / "Parts" card, page and tab;
  - `TaskPartsProgress.vue`, `TaskPartOfMarker.vue` (new): the two card indications; `ProjectTaskRow.vue` holds them with the badge;
  - `TaskPartOfPicker.vue` (new): the editor field; `ProjectTaskDraftEditor.vue`, `useProjectTaskDraft.ts`: parent state and `?partOf=`;
  - `ProjectTaskDetail.vue` (card and delete note), `panel/ProjectsPanelTaskDetail.vue` (tab);
  - `utils/projects/taskParts.ts` (derivations); `types/project.ts`, `graphql/queries/projectTaskQueries.ts`, `stores/projectTaskStore.ts`,
    `generated/graphql.ts` (the `partOfTaskId` field and input); localization en / zh-CN (`projects.parts.*`);
  - `prototype/task-part-of/taskPartOfFixture.ts`, `prototype/source-observation/fixtures.mjs`, `utils/apolloClient.ts` (example data and rules).
- Validation so far (port 4671): `visual-references/final-validation.mjs` 56/56; step-1 `final-validation.mjs` 14/14 (keys and
  `depends on` unchanged); `corepack pnpm typecheck` 0 errors; `corepack pnpm test` 17/17.
- Final references, spec, integration and cleanup: pending the user's approval.

## Outcome And Handoff

- Next expected action: the review package goes to the user; the Solution Designer receives the approved package.
