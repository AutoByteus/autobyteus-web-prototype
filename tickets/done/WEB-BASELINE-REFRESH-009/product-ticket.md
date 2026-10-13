# Product Ticket — WEB-BASELINE-REFRESH-009

## Identity And Scope

- Ticket / request ID: `WEB-BASELINE-REFRESH-009` (baseline ticket)
- Title: Refresh the AutoByteus Web baseline to `origin/personal@73f743211c`
- Status: `Completed`
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
- Product acceptance result and date: **accepted** 2026-10-13. Bootstrapper run
  `ui_baseline_bootstrapper_baaff6a19bd74d8b95fe08f18364661a`, report `ui-baseline-report.md`, evidence
  `evidence/WEB-BASELINE-REFRESH-009/`. Product review:
  - Of the UI files under components, stores, composables, utils, localization, pages and types, only 11
    differ from `73f7432`: Reconnect (10) and `utils/apolloClient.ts`. The tree-row difference is Reconnect
    only.
  - The design-only `useDelegatedCopyTask.ts` is removed (source wins).
  - The new fixture data (definition issues, launch sources) is invented.
  - In the browser, the example PTM run shows the source's Task summaries.
  - The Bootstrapper's evidence: flows 56/56; regressions pass; matrix 103/105 (two rows without a visible
    difference, explained); built preview 32/32; typecheck, lint, test 16/16, boundaries 13/13, build.
  - The pin is now single: `73f743211c8b86c704acb33f216154e42b7a67b8`.
- Integration target and result: `personal`, `Completed`. Fast-forward `5f5cdf8..0174b79`; the canonical checkout was fast-forwarded; local = origin. The default entry was checked before integration on the same tree (the PTM run and the tree's Task summaries).
- Runtime isolation record: the Bootstrapper picks free ports. Ports 4651 (`task-keys-and-dependencies`
  review) and 3210 are not to be used.
- Cleanup result or blocker: `Completed`. The check server on port 4652 was stopped; the ticket worktree and its local branch are removed after this record.
- Ticket folder: `tickets/done/WEB-BASELINE-REFRESH-009/`

## Outcome And Handoff

- Next expected action: reconcile `task-keys-and-dependencies` onto the refreshed `personal`.
- Handoff outcome: `Baseline Needed` → `/product_team/ui_baseline_bootstrapper` (delivered, Completed, accepted).
