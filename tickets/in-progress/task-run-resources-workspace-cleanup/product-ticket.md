# Product Ticket — task-run-resources-workspace-cleanup

## Identity And Scope

- Product ticket: `task-run-resources-workspace-cleanup`. This is the stable package identifier;
  there is no second ID.
- Stable package: `task-run-resources-workspace-cleanup`, solution revision `SR-002`.
- Title: Task agent runs leave the Workspaces tree when their Task is DONE.
- Mode: `Product Experience Design` (evolves the accepted AutoByteus Web baseline).
- Status: `Awaiting User Review` (round 1).
- Requester: Solution Designer (`/solution_designer`) for the user, 2026-10-05.
  - User: "@Product Team could you ask ui to work on UI first then".
- Request package:
  `/Users/normy/autobyteus_org/autobyteus-worktrees/task-run-resources-workspace-cleanup/tickets/in-progress/task-run-resources-workspace-cleanup/product-design-request.md`
- Requirements context: `requirements-doc.md` and `investigation-notes.md` in the same folder.
  Status `Ready for Approval`; not approved.
- In-scope IDs: BEH-002–004, REQ-001–006, REQ-008, REQ-009, AC-001, AC-004, AC-008, AC-009,
  SCN-001–004, DEC-001–006.
- User's words (via the request): "when it's created, it appears; when it's done, cleaned up, it
  disappears."

## Decision Questions

DEC-001 to DEC-006:

- the removal moment and its feedback;
- which rows leave;
- a worker conversation that is open at DONE;
- the Manager's Team-tab history;
- access to finished work;
- consistency across Agent, Team and Org roots.

## Repository And Baseline

- Canonical design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
  (default branch `personal`, remote `origin` = `AutoByteus/autobyteus-web-prototype`).
- Ticket worktree:
  `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/task-run-resources-workspace-cleanup`
- Ticket branch: `design/task-run-resources-workspace-cleanup`
- Accepted design base: `origin/personal@6718986`, fetched 2026-10-05. The local `personal` was
  equal to it.
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Baseline source pin: `origin/personal@10fb695` (`ui-baseline-report.md`,
  WEB-BASELINE-REFRESH-007, accepted).
- Source drift checked at intake (2026-10-05). Source `origin/personal` = `68261f8`; the solution
  base is `8885116`. The `autobyteus-web` changes since the pin are:
  - tests, docs and a test fixture;
  - the comment wording in `chatDraftStore`;
  - the Projects Task editor (`ProjectTaskDraftEditor`, `TaskDescriptionComposer`).

  None of them touch the Workspaces tree, the Task rows or the agent run view. The baseline is
  applicable, so no refresh was requested. `agentRunCollaborationContext.ts` is identical to the
  solution worktree's source.

## Runtime

- Review server: `corepack pnpm dev --port 4530` in the ticket worktree. The process is owned
  by this ticket; the log is `/tmp/autobyteus-design-task-run-cleanup-dev.log`.
- Review URL: <http://127.0.0.1:4530/workspace?prototypeReview=task-run-cleanup>
  - The query turns on the design review panel for the browser session (sessionStorage
    `autobyteus.design.taskRunCleanup.review`).
- Fixture state: browser-local.
  - Task closure: `localStorage['autobyteus.design.taskRunCleanup.state']`, so it survives a
    reload like the real closure record.
  - Review options: `localStorage['autobyteus.design.taskRunCleanup.options']`.
  - Reset with the panel's **Reset** button or by removing both keys.

## Mock Data Added

All of it is hand-written and illustrative:

- `prototype/task-run-cleanup/taskManagerRunFixture.ts` (~16 KB):
  - one "Project Task Manager" run in prototype-workspace;
  - two Tasks:
    - "Draft release notes": a release notes writer, plus a fact checker the writer delegated to;
    - "Review docs site": a Docs Review Team with reviewer and editor;
  - one delegation without a Task (researcher) and one `@` collaborator (documentation writer);
  - three Manager ↔ worker messages for the Team tab;
  - the worker and Manager conversations;
  - the closure facts per delegation round (DONE closes a round; Reopen adds a round).

  The records are never removed; the tree leaves closed runs out.
- `prototype/task-run-cleanup/reviewOptions.ts` (~1 KB): the DEC-001 and DEC-005 alternatives.
- `prototype/task-run-cleanup/TaskDoneReviewPanel.vue` (~6 KB) and
  `plugins/95.task-run-cleanup-review.client.ts`: the design review panel (not product UI).

## Design Changes (round 1, proposal)

- `components/workspace/history/AgentRunTaskRows.vue`:
  - Task rows sit in a `TransitionGroup`;
  - a leaving row fades and its height closes in 200 ms, ease-out;
  - the rows below move with it;
  - there is no enter animation;
  - with reduced motion, the change is instant.
- `services/agentCollaboration/agentRunCollaborationContext.ts`: `listTaskRows` leaves out
  closed runs (an Agent, or a Team with everything under it).
- `stores/agentRunCollaborationStore.ts`:
  - a closed run can't be selected;
  - if the selected child's Task becomes DONE, the selection goes back to the run's own agent
    (proposal);
  - with the alternative, a closed child is read-only.
- `components/workspace/agent/AgentWorkspaceView.vue` and `AgentWorkspaceSurface.vue`: the
  alternative's notice, "This Task is done. Its runs have stopped and are no longer listed." with
  **Back to {{name}}** (en and zh-CN).
- `utils/apolloClient.ts`: serves the fixture.
- `tailwind.config.js`: includes the review panel.

## Findings

- F-001 (supports DEC-005): the product already returns to the host's own conversation when the
  selected child leaves the run's view (`agentRunCollaborationStore.publish`). The proposal
  matches it.
- F-002 (supports DEC-003): the Team tab's messages do not link into member runs. Keeping the
  messages of hidden runs leaves no dead link. The visual risk is low; the remaining risk is the
  technical one, R-001 (client correlation of message participants).
- F-003 (pre-existing, carried from run-settings-ui-unification F-001): the baseline's captured
  store snapshots (`prototype/fixtures/runtime-state.json`, `source-state-snapshots.json`, MBs)
  do not meet the data-boundary rule. This ticket adds none.

## Status History

- 2026-10-05: opened from the Solution Designer request (SR-002). Both repos fetched; worktree
  created from `origin/personal@6718986`. Baseline applicable (no in-scope source change since the
  pin). `In Progress`.
- 2026-10-05: round 1 built and browser-validated (see `review-round-1.md`).
  `Awaiting User Review`.
