# Product Ticket — WEB-BASELINE-REFRESH-007

## Identity And Scope

- Product ticket: `WEB-BASELINE-REFRESH-007`
- Title: Refresh the current-experience baseline to the latest `origin/personal`
- Mode: Product Experience Design — baseline refresh (UI Baseline Bootstrapper)
- Status: `Completed`
- Requester: user direction 2026-10-05 ("keep it aligned now … After the baseline is up to date,
  then you can continue"); follow-up to `WEB-BASELINE-REFRESH-006`, because source
  `origin/personal` advanced while 006 ran.
- Dependent ticket: `run-settings-ui-unification` (round 9 paused).

## Repository And Baseline

- Canonical design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-007`
- Ticket branch: `design/web-baseline-refresh-007`, branched from fetched `origin/personal@ab8b23d`
- Accepted design base: `ab8b23d`
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Current baseline pin: `4dee901d6163ca7053916fa1edc295afbfd7a6da`
- New source authority: `origin/personal@10fb69504f99a615e0728ffdd6c1fcab0104ff05` (fetched 2026-10-05)
- Known frontend change since the pin: `3467656` Background Tasks panel shows the shell command
  (BackgroundTaskPanel, backgroundTaskHandler, stream message types, team stream DTO adapter,
  backgroundTask type).

## Runtime (reserved for the Bootstrapper)

- Ports: UI reference dev `4541`, built preview `4542`, source `4543`, observation node `4544`
- Temporary state root: `/tmp/autobyteus-design-WEB-BASELINE-REFRESH-007`

## Status History

- 2026-10-05: opened; worktree from fetched `origin/personal`; `Baseline Needed` (Refresh) sent to
  the UI Baseline Bootstrapper.
- 2026-10-05: Bootstrapper returned `Completed`; reviewed and accepted; `Completed`.

## Acceptance Review (Product UI/UX Designer, 2026-10-05)

- Source re-fetched at review: `origin/personal` still `10fb695` (baseline fully current).
- Own checks: 5 synced Background Tasks files and ChatNewSurface byte-identical to the pin;
  matrix 97/97; independent preview 14/14 with no errors or non-local requests.
- No fixtures or mock data changed; DATA-001 (store-state captures) remains the user-deferred gap.
- Decision: `Accepted`.
