# Product Ticket — WEB-BASELINE-REFRESH-010

## Identity And Scope

- Ticket / request ID: `WEB-BASELINE-REFRESH-010` (baseline ticket). Supplied request identifier: Project
  Task `autobyteus-134`.
- Title: Refresh the AutoByteus Web baseline to `origin/personal@2f211340ee` (v1.5.6-beta.1)
- Status: `Baseline Needed`
- Requester: `/project_task_manager` (AgentRun `project_task_manager_7c8dce0c4a8b44f88e776a83809dee03`),
  2026-10-18.
  - User go-ahead: "remember… we also need to update the UI/UX project for the baseline now."
  - The condition is met: the Task keys declutter (autobyteus-132) is in stable v1.5.5 (merge
    `be52a331a4`), and the design record was updated (autobyteus-133, `personal@d96a14f`).
- Reason: `git diff --stat 73f7432 origin/personal@2f21134 -- autobyteus-web` shows 318 files changed.
  The source now ships `task-keys-and-dependencies` (decluttered) and other changes on covered surfaces:
  - the Team status dot on tree Team rows;
  - the collapsible "Collaborators and delegated copies" list in run Settings;
  - per-member launch defaults and the delegated-copy model change;
  - Projects board and Task page changes;
  - the skill-update notice card in the chat;
  - the Token Meter's per-call TPS card;
  - and more.
- Refresh policy:
  - Where the source now implements a surface the UI reference changed, the source wins. Here that is the
    design-only Task keys and "depends on" from `task-keys-and-dependencies` / `task-keys-off-lists`.
  - Accepted design-only changes with no source equivalent are kept (agent-definition Reconnect; the
    design-only example data and layers).
- Previous pin: `73f743211c8b86c704acb33f216154e42b7a67b8` (`WEB-BASELINE-REFRESH-009`).

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-010`
- Ticket branch: `design/web-baseline-refresh-010`
- Accepted design base: `d96a14f` (`origin/personal`, 2026-10-18)
- Source: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`, `autobyteus-web`; selected authority
  `origin/personal@2f211340ee36b81cef74a74b2e042b5102c269d3`
- Product acceptance result and date: pending
- Integration target and result: `personal`, `Pending`
- Runtime isolation: the Bootstrapper picks free ports other than 3210.
- Cleanup result or blocker: `Pending`
- Ticket folder: `tickets/in-progress/WEB-BASELINE-REFRESH-010/`

## Outcome And Handoff

- Next expected action: UI Baseline Bootstrapper refreshes in this worktree; Product reviews and accepts.
- Handoff outcome: `Baseline Needed` → `/product_team/ui_baseline_bootstrapper`
