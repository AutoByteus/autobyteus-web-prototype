# Product Ticket — WEB-BASELINE-REFRESH-009

## Identity And Scope

- Ticket / request ID: `WEB-BASELINE-REFRESH-009` (baseline ticket)
- Title: Refresh the AutoByteus Web baseline to `origin/personal@73f743211c`
- Status: `Baseline Needed`
- Requester: the user, 2026-10-13, while reviewing `task-keys-and-dependencies`:

  > I guess the baseline maybe need to be updated

- Reason, verified with git (2026-10-13):
  - `git diff 359d2c0 origin/personal@73f7432 -- autobyteus-web` shows 175 changed files.
  - In-scope UI changed: the source implemented the accepted design-only `delegated-copy-task-locator`,
    differently in places:
    - `TaskWorkerTaskSummary.vue`, `taskWorkerTaskStore.ts` (server-provided `TaskWorkerTask`) and
      `taskLocatorStore.ts`;
    - `WorkspaceTransientExecutionRow.vue`, `AgentRunTaskRows.vue`, `WorkspaceTeamExecutionTree.vue`;
    - `ProjectTaskRow.vue`, `ProjectTaskBoard.vue`, `TempTaskBoard.vue`, `ProjectsPanel.vue`,
      `WorkspaceToolShell.vue`;
    - Tailwind now scans `utils/`.
  - Other UI changed too: run settings, agent packages and definition problems, token usage meter
    compaction marks, chat drafts.
- Accepted baseline before the refresh: mixed pin (Projects Task-status surfaces at `ff227eb`, everything
  else at `1cd1a3a`) plus accepted design-only changes.
- Refresh policy:
  - where the source now implements a surface the UI reference had changed (the delegated-copy Task
    locator), the source wins;
  - accepted design-only changes with no source equivalent are kept (agent-definition Reconnect, the
    design-only example fixtures and layers).
- Paused by this refresh: `task-keys-and-dependencies` (round 1 at `6d071fd`, branch
  `design/task-keys-and-dependencies`). It is reconciled onto the refreshed baseline after acceptance.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-009`
- Ticket branch: `design/web-baseline-refresh-009`
- Accepted design base: `5f5cdf881b30689f103b418530c0bd1a22b1ed5a`
- Source: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`, `autobyteus-web`; selected authority
  `origin/personal@73f743211c` (full SHA in the Bootstrapper request)
- Baseline report: `ui-baseline-report.md` (to be updated by the Bootstrapper)
- Product acceptance result and date: pending
- Integration target and result: `personal`, `Pending`
- Runtime isolation record: the Bootstrapper picks free ports. Ports 4651 (`task-keys-and-dependencies`
  review) and 3210 are not to be used.
- Cleanup result or blocker: `Pending`
- Ticket folder: `tickets/in-progress/WEB-BASELINE-REFRESH-009/`

## Outcome And Handoff

- Next expected action: UI Baseline Bootstrapper refreshes in this worktree; the Product UI/UX Designer
  reviews and accepts the result.
- Handoff outcome: `Baseline Needed` → `/product_team/ui_baseline_bootstrapper`
