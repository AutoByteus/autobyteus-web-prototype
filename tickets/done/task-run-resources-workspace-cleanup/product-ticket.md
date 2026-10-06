# Product Ticket — task-run-resources-workspace-cleanup

## Identity And Scope

- Product ticket: `task-run-resources-workspace-cleanup`. This is the stable package identifier; there is no second ID.
- Stable package: `task-run-resources-workspace-cleanup`, solution revision `SR-002`.
- Title: Delegated runs leave the Workspaces tree when their Task is DONE.
- Mode: `Product Experience Design` (evolves the accepted AutoByteus Web baseline).
- Status: `Completed` (user confirmation 2026-10-06: "perfect. i like the UI. now i confirm").
- Requester: Solution Designer (`/solution_designer`) for the user, 2026-10-05.
  - User: "@Product Team could you ask ui to work on UI first then".
- Request package:
  `/Users/normy/autobyteus_org/autobyteus-worktrees/task-run-resources-workspace-cleanup/tickets/in-progress/task-run-resources-workspace-cleanup/product-design-request.md`
- Requirements context: `requirements-doc.md` and `investigation-notes.md` in the same folder.
  Status `Ready for Approval` (SR-002); not approved yet.
- In-scope IDs: BEH-001–006, REQ-001–009, AC-001, AC-002, AC-004–006, AC-008, AC-009, SCN-001–004,
  DEC-001–006.

## Decisions (user-confirmed design)

- DEC-001: every run delegated for the Task leaves the tree when the Task is DONE (assigned agent,
  further delegations, helpers, a Team with its members). The rows leave with a 200 ms fade;
  new rows appear at once. There is no toast: the Manager's own conversation is the feedback.
- DEC-002: hiding follows closure (DONE) and holds after reload.
- DEC-003: the Team tab keeps messages with runs that are no longer listed.
- DEC-004: there is no in-app access to finished runs; the data stays on disk.
- DEC-005: an open worker conversation returns to the Manager when its Task becomes DONE.
- DEC-006: the same rule, row style and motion apply under Agent, Agent Team and Agent Org roots.
- Design change in the same area (user feedback): delegated rows drop the dashed indigo box and
  tint, and read like every other tree row; a delegated Team keeps only its bolt icon, in slate.
- User clarification (2026-10-06): an agent delegating to another agent or to an Agent Team
  behaves exactly as designed. There is no new marker for Task-linked runs.

## Repository And Baseline

- Canonical design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
  (default branch `personal`, remote `origin` = `AutoByteus/autobyteus-web-prototype`).
- Ticket worktree:
  `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/task-run-resources-workspace-cleanup`
- Ticket branch: `design/task-run-resources-workspace-cleanup`
- Accepted design base: `origin/personal@6718986` (unchanged at finalization, 2026-10-06).
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Baseline source pin: `origin/personal@10fb695` (`ui-baseline-report.md`,
  WEB-BASELINE-REFRESH-007, accepted).
- Source drift, intake (2026-10-05): source `68261f8`. No change to the tree, rows or run view.
- Source drift, finalization (2026-10-06): source `d9ffaa7`.
  - The Task-row files are byte-identical to the pin: `WorkspaceTransientExecutionRow.vue`,
    `AgentRunTaskRows.vue`, `services/agentCollaboration/*` and `agentRunCollaborationStore.ts`.
  - The other changes are the production implementation of the already-designed
    run-settings-ui-unification, plus non-visible wiring in `WorkspaceAgentRunsTreePanel.vue`.
  - No baseline refresh is needed.

## Runtime

- Review server: `corepack pnpm dev --port 4530` in the ticket worktree. The process is owned
  by this ticket; the log is `/tmp/autobyteus-design-task-run-cleanup-dev.log`.
- Entry: the normal product URL `/workspace`. No preview switch is needed.
- Fixture state: browser-local (`localStorage['autobyteus.design.taskRunCleanup.state.v2']`).
  It survives a reload; reset with `__resetTaskRunCleanup()` in the browser console.

## Mock Data And Simulation (hand-written, illustrative, ~32 KB in total)

- `prototype/task-run-cleanup/taskManagerRunFixture.ts`:
  - one live "Project Task Manager" run in prototype-workspace;
  - two Tasks:
    - "Draft release notes": a release notes writer, plus a fact checker the writer delegated to;
    - "Review docs site": a Docs Review Team with reviewer and editor;
  - one delegation without a Task (researcher) and one `@` collaborator (documentation writer);
  - three Manager ↔ worker messages for the Team tab;
  - the conversations;
  - closure facts per delegation round;
  - the Manager's scripted turns:
    - close now;
    - close "when the team reports back" (a scripted timeline);
    - reopen and delegate again.

  The same two Tasks are in the Prototype Launch fixture project, so the Projects board shows
  their status.
- `plugins/95.task-run-cleanup.client.ts`: everything beneath the UI.
  - The prototype socket answers the Manager's streams the way the server would: the agent
    stream reports Idle, and the collaboration stream sends the tree snapshot.
  - A message typed in the Manager's real message box runs its scripted turn.
- `utils/apolloClient.ts`: serves the fixture and keeps the project copy of the Tasks in step.

## Design Changes

- `components/workspace/history/WorkspaceTransientExecutionRow.vue`:
  - delegated rows have no dashed box or tint;
  - hover `gray-50`;
  - focus ring `2px indigo-500`;
  - Team icon: the bolt only, in `slate-500`.
- `components/workspace/history/AgentRunTaskRows.vue`:
  - the rows sit in a `TransitionGroup`;
  - leave: 200 ms ease-out fade and height collapse;
  - no enter motion;
  - reduced motion: no animation;
  - a leaving row leaves the accessibility tree, and its focus moves to the run row.
- `services/agentCollaboration/agentRunCollaborationContext.ts`: `listTaskRows` leaves out
  closed runs; the records stay in the view.
- `stores/agentRunCollaborationStore.ts`:
  - a closed run can't be selected;
  - a selection on a closed run returns to the run's own agent.

## Findings

- F-001 (DEC-005): the product already returns to the host when the selected child leaves the view.
- F-002 (DEC-003): Team-tab messages do not link into runs, so keeping them leaves no dead link.
  R-001 is technical.
- F-003: the product has no user control for Task status; only agent tools change it. The
  Projects-page path proposed briefly in round 2 was dropped before it was built.
- F-004 (pre-existing, carried from run-settings-ui-unification F-001): the baseline's captured
  store snapshots (`prototype/fixtures/runtime-state.json`, `source-state-snapshots.json`, MBs)
  do not meet the data-boundary rule. This ticket adds none.
- Process (round 1, recorded at the user's request): a floating review panel and A/B switches
  were built on top of the product. The user rejected them, and they were removed. The agent
  package was updated through `/agent_package_creator`, with uncommitted changes in
  `autobyteus-agents/agent-teams/product-team`:
  - actor-caused changes go through the actor's real surface;
  - one committed design;
  - a visual review of changed screens;
  - no preview-only controls.

## Validation (2026-10-06, final)

- Browser at desktop 1055×738 and narrow 390×844, all through the normal entry `/workspace`:
  - the Manager opens live (Idle); its delegated rows use the clean style;
  - "close that task" in the Manager's chat: Running → `update_project_task` and reply → Idle,
    and exactly that Task's rows leave;
  - deferred close while reading *reviewer*: the view returns to the Manager, the Manager row is
    selected, and the Team and its members leave;
  - reload: closed runs stay hidden;
  - "delegate the docs review again": only the new instance appears;
  - Team tab: all 3 messages are listed;
  - Projects board: Done / In Progress follow the Manager;
  - a focused leaving row moves focus to the run row and gets `aria-hidden`.
- Checks: `pnpm typecheck` passes; `pnpm test` passes 14/14; `pnpm lint` passes.
- Limitation: in a background browser tab, animation frames pause, so a leaving row finishes its
  fade when the tab becomes visible. This is standard browser behavior.

## Status History

- 2026-10-05: opened from the Solution Designer request (SR-002). Worktree created from
  `origin/personal@6718986`. Baseline applicable. `In Progress`.
- 2026-10-05: round 1 (review panel with Mark DONE plus A/B switches) built and sent.
  `Awaiting User Review`.
- 2026-10-06: user feedback. The Task rows looked unclean; the panel and switches were not real
  UI/UX. `In Progress`.
- 2026-10-06: round 2.
  - Panel and switches removed.
  - DONE through the Manager's own chat (live run, scripted turns beneath the UI).
  - Clean delegated rows.
  - The user liked it ("really really nice design").
- 2026-10-06: user clarification that delegated agents and Teams stay as designed.
  User confirmation: "perfect. i like the UI. now i confirm".
- 2026-10-06: final validation; VIS-001–008 captured; `ui-ux-spec.md` written. `Completed`.

## Finalization

- Integration: fast-forward push of `design/task-run-resources-workspace-cleanup` to
  `origin/personal`, then fast-forward of the canonical checkout. Revisions are in the handoff.
- Baseline promotion: not required separately. The approved experience is the default
  `/workspace` UI (no preview state).
- Cleanup: stop the review server on 4530 and remove the ticket worktree after the handoff. The
  branch is kept under repository policy.
