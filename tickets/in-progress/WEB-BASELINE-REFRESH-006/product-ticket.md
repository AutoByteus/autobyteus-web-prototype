# Product Ticket — WEB-BASELINE-REFRESH-006

## Identity And Scope

- Product ticket: `WEB-BASELINE-REFRESH-006`
- Title: Refresh the current-experience baseline to the latest `origin/personal`
- Mode: Product Experience Design — baseline refresh (UI Baseline Bootstrapper)
- Status: `Baseline Needed` (Refresh)
- Requester: user, 2026-10-05: "There are new changes in the baseline. The UI baseline bootstrap
  should keep it aligned now … After the baseline is up to date, then you can continue."
  Standing direction (2026-10-04): keep the local design repo up to date and branch from
  `origin/personal`.
- Replaces the withdrawn `WEB-BASELINE-REFRESH-005` (same source authority; cancelled before any
  commit, worktree removed).
- Dependent ticket: `run-settings-ui-unification` (`design/run-settings-ui-unification` @ `f8615b7`,
  round 9 work in progress, paused) — rebased onto the refreshed `origin/personal` after acceptance.

## Repository And Baseline

- Canonical design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- `origin/personal` fetched 2026-10-05 = `8fdf0b7` (equal to local `personal`)
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-006`
- Ticket branch: `design/web-baseline-refresh-006`, branched from `origin/personal@8fdf0b7`
- Accepted design base: `8fdf0b7`
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Current baseline pin: `0a32261d681e19491264a03a652ba23d1f8b8248`
- New source authority: `origin/personal@4dee901d6163ca7053916fa1edc295afbfd7a6da` (re-fetched 2026-10-05)
- Known frontend changes since the pin (38 files): Skills managed GitHub sources, event monitor
  browse rows, token usage workspace scope, agent-run collaboration context/store, inter-agent
  delivery, standalone-agent-run-root.

## Runtime (reserved for the Bootstrapper)

- Ports: UI reference dev `4541`, built preview `4542`, source `4543`, observation node `4544`
- Temporary state root: `/tmp/autobyteus-design-WEB-BASELINE-REFRESH-006`

## Status History

- 2026-10-05: opened on user direction; worktree from fetched `origin/personal`; `Baseline Needed`
  (Refresh) sent to the UI Baseline Bootstrapper.
