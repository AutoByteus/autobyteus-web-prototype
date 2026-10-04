# Product Ticket — WEB-BASELINE-REFRESH-004

## Identity And Scope

- Product ticket: `WEB-BASELINE-REFRESH-004`
- Title: Refresh the current-experience baseline to the latest `origin/personal`
- Mode: Product Experience Design — baseline refresh (UI Baseline Bootstrapper)
- Status: `Completed`
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
- 2026-10-04: Bootstrapper returned `Completed`; reviewed and accepted; `Completed`.

## Acceptance Review (Product UI/UX Designer, 2026-10-04)

- Bootstrapper result: `Completed` (`ui-baseline-report.md`); candidate uncommitted, no Bootstrapper commit.
- Source authority re-checked at review: `origin/personal` advanced to `1b9739c`; the only
  `autobyteus-web` change after `0a32261` is a test file (`agentStatusHandler.spec.ts`), so the pin
  `0a32261` remains the current UI authority.
- Own checks: 12 sampled synced files byte-identical to the pin (composer, chat, run forms,
  localization, left panel, sidebar strip); matrix 97/97 confirmed (S015 rerun recorded in
  `summary-rerun-S015.json`); refresh flows and independent preview without failures.
- Own browser check (port 4531): New chat; live-run `@` mention now one native inline highlight
  (the issue the user found); Agent run form with auto-approve on by default and no skill access
  row; Projects in navigation; Memory absent exactly as in the pinned left panel.
- Supersessions confirmed (source wins, all shipped): cross-scope-agent-mentions(-sr008) scripted
  local run removed; project-task-manager-foundations prototype pages replaced by source pages;
  composer-mention-discoverability shipped version adopted.
- Fixture-kind correction confirmed: synthetic workspaces use the server's real kinds
  (filesystem/temp); the stored Research Assistant run now appears through the source's own code.
- Data boundary: the route snapshots remain store-state captures from the source app running
  against the synthetic observation node (runtime-state.json 2.9 MB, source-state-snapshots.json
  5.0 MB). Values are synthetic; the capture mechanism and size do not meet the current
  data-boundary rule. This is the pre-existing DATA-001 gap the user explicitly deferred
  (composer-mention-discoverability UI-CLOSE-001); it is recorded, not resolved, and is reported
  to the user again.
- Decision: `Accepted` for UI parity.
