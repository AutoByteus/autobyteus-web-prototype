# Product Ticket — WEB-BASELINE-REFRESH-010

## Identity And Scope

- Ticket / request ID: `WEB-BASELINE-REFRESH-010` (baseline ticket). Supplied request identifier: Project
  Task `autobyteus-134`.
- Title: Refresh the AutoByteus Web baseline to `origin/personal@2f211340ee` (v1.5.6-beta.1)
- Status: `Completed`
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
- Product acceptance result and date: **accepted** 2026-10-18. Bootstrapper run
  `ui_baseline_bootstrapper_baaff6a19bd74d8b95fe08f18364661a`; report `ui-baseline-report.md`; evidence
  `evidence/WEB-BASELINE-REFRESH-010/`.
- Product review:
  - Only 11 UI files under components, stores, composables, utils, localization, pages and types differ
    from `2f21134`: Reconnect (10) and `utils/apolloClient.ts`.
  - The design-only key and locator code is gone; the shipped components run.
  - The new `live-streams.mjs` frames are built from the synthetic fixtures.
  - typecheck 0 errors, lint 0 errors, tests 17/17, boundaries 13/13.
  - The Bootstrapper's evidence: new flows 44/44; regressions pass; matrix 106/108 (two rows without a
    visible difference, explained); built preview 39/39; build.
- Decisions on the Bootstrapper's questions (Product, 2026-10-18):
  1. Reconnect's collaborator case, re-homed on two delegated copies of `/tutorial_video_producer`: **kept**.
     The source has no collaborators. The design-only Reconnect intent ("a copy follows its agent") is
     preserved.
  2. Reconnect's `/post_production` sub-team: **removal accepted** (Teams are flat in the source).
  3. Approved references affected by source changes:
     - `task-keys-and-dependencies`: VIS-010–012 recaptured;
     - `delegated-copy-task-locator`: all VIS recaptured;
     - in both, the old captures moved to `superseded-2026-10-18/`, with revision notes in the specs. The
       designs are unchanged; the surroundings changed in the product.
     - The approved check scripts now import Playwright from the canonical checkout:
       - task keys 14/14;
       - Task locator 13/13 (Project name "AutoByteus", illustrative; SCN-011 revised for the removed
         collaborators).
     - Reconnect (design-only, not shipped) keeps its approved references. Its review scripts pass 7/7.
       The surrounding product changes in its captures are illustrative.
- The single pin is now `2f211340ee36b81cef74a74b2e042b5102c269d3`.
- Integration target and result: `personal`, `Completed`. Fast-forward `d96a14f..0212d6d`; the canonical
  checkout was fast-forwarded (and reinstalled with `pnpm install --force` for the vendored contracts);
  local = origin.
- Default-entry-point validation after integration: on the canonical checkout at `0212d6d`
  (`corepack pnpm dev --port 4673`), the approved checks pass: delegated-copy-task-locator 13/13 and
  task-keys-and-dependencies 14/14.
- Runtime isolation: the Bootstrapper picks free ports other than 3210.
- Cleanup result or blocker: `Completed`. Servers on ports 4671 and 4673 were stopped; the worktree and local branch are removed after this record (no remote ticket branch).
- Ticket folder: `tickets/done/WEB-BASELINE-REFRESH-010/`

## Outcome And Handoff

- Next expected action: integrate into `personal`; report to `/project_task_manager`.
- Handoff outcome: `Baseline Needed` → `/product_team/ui_baseline_bootstrapper` (delivered, Completed, accepted); then returned to the requester.
