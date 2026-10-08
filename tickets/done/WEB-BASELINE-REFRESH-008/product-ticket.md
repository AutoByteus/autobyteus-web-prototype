# Product Ticket — WEB-BASELINE-REFRESH-008

## Identity And Scope

- Product ticket: `WEB-BASELINE-REFRESH-008`
- Title: Refresh the current-experience baseline to the latest `origin/personal`
- Mode: Product Experience Design — baseline refresh (UI Baseline Bootstrapper)
- Status: `Completed`
- Requester: user direction 2026-10-08, during review of `collapsed-left-panel-expand-keeps-run`:
  "I think the UI is not up to date ... there's no projects tab on the right side ... the real
  application has the projects tab on the left side of files."
- Dependent ticket: `collapsed-left-panel-expand-keeps-run` (design confirmed by the user; final
  validation and references paused until this refresh is accepted and merged).

## Repository And Baseline

- Canonical design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-008`
- Ticket branch: `design/web-baseline-refresh-008`, branched from fetched `origin/personal@afed67a`
- Accepted design base: `afed67a3c47af204f6b34bcd941c200093a3faf0`
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Current baseline pin: `10fb69504f99a615e0728ffdd6c1fcab0104ff05` (`ui-baseline-report.md`, WEB-BASELINE-REFRESH-007)
- New source authority: `origin/personal@1cd1a3abc126df820e334c023621d0fb82de5b7b` (fetched 2026-10-08)
- Verified frontend changes since the pin with no design-repo equivalent (examples, not a limit):
  - `0fd265652`, `0446c378c`: Projects tab first in the right panel (before Files), with the Project/Temp picker and a compact live board.
  - `4d469b0c5` and `useTaskRootNavigation`: Task roots hosted by Agent, Team and Org runs.
  - `9faa6bc75`: archive all runs from a Workspaces group header.
  - `d27880bf7`: people-group identity for Teams.
  - `9dad89bae`: absolute path-only workspace associations in Projects.

## Runtime (reserved for the Bootstrapper)

- Ports: UI reference dev `4620`, built preview `4621`, source `4622`, observation node `4623`
- Temporary state root: `/tmp/autobyteus-design-WEB-BASELINE-REFRESH-008`

## Status History

- 2026-10-08: opened; worktree from fetched `origin/personal@afed67a`; `Baseline Needed` (Refresh) sent to the UI Baseline Bootstrapper.
- 2026-10-08: the Bootstrapper returned `Completed` (Refresh): uncommitted candidate, pin `1cd1a3abc`. Reviewed and accepted (below); `Completed`.

## Acceptance Review (Product UI/UX Designer, 2026-10-08)

- Source re-fetched at review: superrepo `origin/personal` = `1cd1a3abc` (still current). Design `origin/personal` = `afed67a` (unchanged).
- Reviewed: `ui-baseline-report.md`, `mock-boundaries.md`, runbook, `flows/flow-results.json` (41/41).
- Paired source/UI-reference screenshots: `PRJ-006` (chat run with the Projects tab beside it) is identical.
- Own checks against the candidate dev server (port 4630, owned by this review):
  - `/chat`, `/workspace`, `/projects`, `/agents`, `/agent-teams`, `/agent-orgs`, `/settings`: 0 page errors, 0 non-local requests.
  - Collapsed panel → right Projects tab → In Progress card "documentation writer": the worker opens in the center, Projects stays selected, the strip stays collapsed with Chat lit. This matches the user's reported starting state.
  - `vue-tsc --noEmit -p tsconfig.prototype.json`: exit 0.
- Data boundary:
  - New fixtures (Task roots, Temp tasks, path-only Project workspaces, extra runtimes) are invented synthetic values (`/synthetic/...`, "Review the synthetic navigation baseline.").
  - The "AutoByteus Org" fixture copied from real agent definitions was removed. Good.
  - Optional cleanup, not a defect: `prototype/fixtures/runtime-state.json` and `source-state-snapshots.json` contain captured Apollo error stack traces with local `node_modules` paths. They were present before (5 at the base). These are captures of the source running on the synthetic node, not product or customer content.
- Superseded design-only layers (run-settings unification, task-run cleanup, project-manager-ux, chat drafts, folder picker): the source version wins, as the refresh policy says. The Reconnect design-only change is preserved.
- Coverage note (non-blocking): Task roots in fixtures are hosted by an Agent run only. Team- and Org-hosted roots use the same card UI. Their open path (Team view / Org inspect) is not in the fixtures.
- Decision: `Accepted`.
