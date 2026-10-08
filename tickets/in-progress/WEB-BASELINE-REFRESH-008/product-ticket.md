# Product Ticket — WEB-BASELINE-REFRESH-008

## Identity And Scope

- Product ticket: `WEB-BASELINE-REFRESH-008`
- Title: Refresh the current-experience baseline to the latest `origin/personal`
- Mode: Product Experience Design — baseline refresh (UI Baseline Bootstrapper)
- Status: `Baseline Needed`
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
