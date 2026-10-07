# Product Ticket — project-manager-ux

## Identity And Scope

- Product ticket: `project-manager-ux`. This is the stable package identifier; there is no second ID.
- Title: The Projects board follows the Project Task Manager live, and each Task links to its assigned agent or team.
- Mode: `Product Experience Design` (evolves the accepted AutoByteus Web baseline).
- Status: `Completed` (user confirmation 2026-10-07: "Perfect, I'm satisfied. I'm satisfied now. It's confirmed").
- Requester: Solution Designer (`/solution_designer`, run `solution_designer_69105bca29404516b69ac95a79d0dbd6`) for the user, 2026-10-06.
  - User: "dedicate a task to @Product Team so i could discuss with product team to work on the UI. after the UI is done. then we come back to work."
- Request package:
  `/Users/normy/autobyteus_org/autobyteus-worktrees/project-manager-ux/tickets/in-progress/project-manager-ux/product-design-request.md`
- Requirements context (Draft, SR-001, not approved): `requirements-doc.md`, `investigation-notes.md` in the same folder.
- In-scope IDs: BEH-001–005, REQ-001–006, UC-001–004, SCN-001–004, DEC-001–005.

## Decision Questions

- DEC-001 entry point (Project, conversation, or both linked).
- Live Tasks while talking to the Manager.
- Task ↔ worker links, both directions.
- The Manager recognizable as the organizer in the left panel.
- DEC-004 (optional): Task cards in the conversation; phasing.
- DEC-002 which agent is a Project's Manager; DEC-003 one or several Manager conversations per Project.

## Constraints

- Task statuses stay TODO / IN_PROGRESS / DONE and are set only by agents; the UI shows them read-only.
- DONE stops a Task's workers (their rows leave the tree, as designed in task-run-resources-workspace-cleanup).
- The Manager asks for approval of each dispatch in chat. No auto-dispatch, no auto-DONE by the UI.
- Projects stays behind `ENABLE_PROJECTS` (off by default), desktop only.
- Existing Projects pages, manual Task authoring, Chat/`@` and the workspace-grouped run tree stay usable.
- Process rules from earlier tickets (user feedback): one committed design on the real product surfaces,
  actor-caused changes happen through the actor's real surface (the Manager's chat with scripted turns),
  no review panels, A/B switches or preview-only controls.

## Repository And Baseline

- Canonical design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
  (default branch `personal`, remote `origin` = `AutoByteus/autobyteus-web-prototype`).
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/project-manager-ux`
- Ticket branch: `design/project-manager-ux`
- Accepted design base: `origin/personal@a38bd6e` (fetched 2026-10-06; local `personal` equal).
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web` (read only).
- Baseline source pin: `origin/personal@10fb695` (`ui-baseline-report.md`, WEB-BASELINE-REFRESH-007, accepted).
- Source drift at intake (source `origin/personal@f48dbfb`):
  - Most `autobyteus-web` changes since the pin are the production implementation of already-designed
    tickets (run-settings-ui-unification, task-run-resources-workspace-cleanup).
  - Known UI difference outside the changed surfaces: the source simplified the Task editor copy
    (`ProjectTaskDraftEditor.vue`, `TaskDescriptionComposer.vue`: no help lines, no "Task details" heading).
    This ticket does not change the Task editor. Recorded for a later baseline refresh; not requested.
  - `AgentRunTaskRows.vue` in the source uses a shared `useLeavingTreeRows` helper; same visible behavior.
- Pre-existing data-boundary note F-004 (carried from earlier tickets): the baseline's captured store
  snapshots (`prototype/fixtures/*.json`) are generated from synthetic observation state (DATA-001
  assessment: not copied production data, but not hand-authored). Tracked by the open
  `project-task-manager-baseline-correction` ticket. This ticket adds only small hand-written fixtures.

## Runtime

- Review server: `corepack pnpm dev --port 4560` in the ticket worktree, owned by this ticket.
  Log: `/tmp/autobyteus-design-project-manager-ux-dev.log`.
- Entry: the normal product URLs (`/projects`, `/workspace`, `/chat`). No preview switch.
- Disposable review driver (not committed): `/tmp/pmux/drive.mjs` (Playwright, 1440×900).

## Status History

- 2026-10-06: opened from the Solution Designer request (SR-001). Worktree created from
  `origin/personal@a38bd6e`. Baseline applicable. `In Progress`.
- 2026-10-06: round 1 (Manager bar on the Project page, Tasks tab beside the chat, Project grouping
  and Task labels in the tree, Project/Task header chips, New chat Project binding) shown.
  `Awaiting User Review`.
- 2026-10-06: user feedback: no "Talk to manager"; the Manager stays an ordinary run in the left
  panel. Keep the Task → worker link ("we can link the task team ... the linking is really nice")
  and make the Projects page update in real time while the Manager works. `In Progress`.
- 2026-10-06: round 2: everything else from round 1 removed (also the worker → Task back-link).
  Kept: workers on board rows and the Task page (click opens the worker), live Project/Task push
  with a 2.4 s highlight. Demo: a new Project Task Manager chat creates "Website Refresh" and its
  Tasks. `Awaiting User Review`.
- 2026-10-07: user decision: a Task shows only its root, the one agent or team the Manager
  handed it to; clicking opens exactly that run (a team opens its coordinator). Helpers a worker
  started itself are not listed on the Task. Member count dropped so team names fit.
  Open question for Solution Designer (user request): can all run resources linked to a Task
  (including helpers) be shown later? Investigation notes say the server records every run
  started for a Task with its role and assigner.
- 2026-10-07: user feedback: the left panel changed (Manager disappeared, groups collapsed) when
  moving to the Projects list or a Task page. Finding F-005: a UI reference defect, not product
  behavior. In the source the left panel is in `layouts/default.vue` and stays mounted across
  pages, keeping its runs and expansion state. The reference re-applied each route's captured
  store snapshot on navigation. Fixed in `plugins/00.prototype-state.client.ts`: after the first
  page, the left-panel stores are not reset on `/projects*` routes. Requirement for the product:
  the left panel keeps its runs and open/closed state while the user moves between Chat and the
  Projects pages (preserved behavior).
- 2026-10-07: copy: Task page section "Workers" renamed "Assigned to" (user asked for the most
  intuitive wording); empty: "Not assigned to an agent or team yet."; line under it: "When the
  Task is Done, this agent or team stops."
- 2026-10-07: consistency check (user asked; finish if consistent, else update for another test):
  - fixed: the line under "Assigned to" showed on Done ("Stopped") and "Couldn't start"; now only
    while the agent or team is Running or Idle;
  - fixed: status labels did not line up (only openable rows had the ›); a non-openable row keeps
    the chevron's space;
  - cleaned: unused helper role and member count removed from the Task-root contract.
  - States checked in the browser at 1440×900: live Project and Task arrival (highlight), To Do
    not assigned, Running (opens worker), team opens coordinator, Couldn't start with reason,
    Done → Stopped (not openable, runs leave the tree), left panel unchanged across pages.
  - `pnpm typecheck`, `pnpm lint`, `pnpm test` (14/14) pass. `Awaiting User Review`.
- 2026-10-07: user test: on a Task page, clicking "reviewer" in the left panel only highlighted
  it; the conversation did not open. Finding F-006 (product defect too, exposed by the left panel
  keeping its state): `AgentRunTaskRows.vue` (source line 85, same in the reference) opens the
  run only when it is not already selected (`if (!props.runSelected) emit('select-run')`). From a
  Projects page the Manager run is still selected, so nothing navigates. Fixed in the reference:
  the click also opens the run when the user is not on its view (`/chat?id=<run>` or
  `/workspace`). Requirement: a click on any left-panel row opens that conversation from any page.
  Verified from the Task page and the board: reviewer, editor, the Manager's run row, and the
  docs review team row (opens its coordinator, reviewer). `Awaiting User Review`.
- 2026-10-07: user confirmation: "Perfect, I'm satisfied. I'm satisfied now. It's confirmed".
  Final validation through the normal entries (`/workspace`, `/projects`); VIS-001–010 captured;
  `ui-ux-spec.md` written. `Completed`.

## Decisions (user-confirmed design)

- No Manager entry, bar, binding or marking: the Manager is an ordinary run in the left panel.
- The Projects list, board and Task page update live while agents work (arrived/moved highlight 2.4 s).
- A Task shows its root only (the agent or team the Manager handed it to) with Running / Idle /
  Couldn't start / Stopped; click opens it, a team opens its coordinator.
- Task page section "Assigned to"; empty "Not assigned to an agent or team yet."
- The left panel keeps its state across pages; every row click opens its conversation from any page.
- Rejected: Talk to manager bar, Tasks tab beside the chat, Project grouping and Task labels in the
  tree, Project/Task header chips, New chat Project binding, helper runs on a Task.
- Open for Solution Designer: whether all runs linked to a Task (incl. helpers) can be shown later.

## Artifacts

- `ui-ux-spec.md`, `visual-references/VIS-001`–`VIS-010`, `review-evidence/capture-*.json`.
- Design changes: `components/projects/ProjectTaskWorkers.vue` (new), `ProjectTaskRow.vue`,
  `ProjectTaskDetail.vue`, `components/workspace/history/AgentRunTaskRows.vue`,
  `stores/projectTaskStore.ts`, `stores/projectStore.ts`, `types/project.ts`,
  `composables/projects/useTaskWorkerNavigation.ts` (new), localization `projects.ts` (en, zh-CN).
- Simulation: `prototype/project-manager/projectManagerFixture.ts`, `plugins/96.project-manager.client.ts`,
  `utils/apolloClient.ts`, `prototype/task-run-cleanup/taskManagerRunFixture.ts` (closure hook),
  `plugins/00.prototype-state.client.ts` (left panel kept on `/projects*`).
  Hand-written fixtures, about 32 KB; no captured data.
- Validation: `pnpm typecheck`, `pnpm lint`, `pnpm test` (14/14) pass.

## Finalization

- Integration: fast-forward push of `design/project-manager-ux` to `origin/personal`, then
  fast-forward of the canonical checkout. Revisions are in the handoff.
- Baseline promotion: not required separately; the approved experience is the default UI.
- Cleanup: review server stopped and ticket worktree removed after the handoff; branch kept.
