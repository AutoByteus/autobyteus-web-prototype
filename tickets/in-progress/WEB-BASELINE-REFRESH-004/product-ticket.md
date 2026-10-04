# Product Ticket — WEB-BASELINE-REFRESH-004

## Identity And Scope

- Product ticket: `WEB-BASELINE-REFRESH-004`
- Title: Refresh the current-experience baseline to the latest `origin/personal`
- Mode: Product Experience Design — baseline refresh (UI Baseline Bootstrapper)
- Status: `Baseline Needed` (Refresh)
- Requester: user, 2026-10-04, during `run-settings-ui-unification` review. User found the live-run
  `@` mention still shown on two lines in the design app although the product shipped the
  single inline mention, and directed: "You have to make sure that the local is always up to
  date. Then branch from … origin personal … It's extremely important."
- Dependent ticket: `run-settings-ui-unification` (`design/run-settings-ui-unification` @ `6436116`,
  `Awaiting User Review`, round 7a) is paused for design edits until this refresh is accepted and
  integrated; it is then rebuilt on the refreshed `origin/personal` and revalidated.

## Repository And Baseline

- Canonical design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Remote: `origin` = `https://github.com/AutoByteus/autobyteus-web-prototype.git`; `origin/personal`
  fetched 2026-10-04 = `a714bb234e0a609c7c704fb09b6562f831febce2` (equal to local `personal` after
  the user's push)
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-004`
- Ticket branch: `design/web-baseline-refresh-004`, branched from `origin/personal@a714bb2`
- Accepted design base: `a714bb234e0a609c7c704fb09b6562f831febce2`
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Current baseline pin: `e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71` (`ui-baseline-report.md`)
- New source authority (explicitly selected by the user): `origin/personal@0a32261d681e19491264a03a652ba23d1f8b8248`
  (fetched 2026-10-04 11:04 +0200)
- Established report: `ui-baseline-report.md`
- Known shipped changes since the pin include `006fd69` single native inline mention highlight
  (approved design `composer-mention-discoverability`, never integrated into the design repo),
  `8a4177f` General Agent identity, `e5edfaf` Antigravity always auto-approve, `4bf2d44` fresh
  launches default to auto-approve, `cf401a5` run-level skill access mode removed.

## Runtime (reserved for the Bootstrapper)

- Ports: UI reference dev `4531`, built preview `4532`, source `4533`, observation node `4534`
- Temporary state root: `/tmp/autobyteus-design-WEB-BASELINE-REFRESH-004`

## Status History

- 2026-10-04: opened on explicit user direction; worktree from fetched `origin/personal`;
  `Baseline Needed` (Refresh) sent to the UI Baseline Bootstrapper.
