# Product Ticket — WEB-BASELINE-REFRESH-006

## Identity And Scope

- Product ticket: `WEB-BASELINE-REFRESH-006`
- Title: Refresh the current-experience baseline to the latest `origin/personal`
- Mode: Product Experience Design — baseline refresh (UI Baseline Bootstrapper)
- Status: `Completed`
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
- 2026-10-05: Bootstrapper returned `Completed`; reviewed and accepted; `Completed`.

## Acceptance Review (Product UI/UX Designer, 2026-10-05)

- Own checks: 11 sampled files byte-identical to `4dee901` (skill sources, token usage, collaboration
  store, inter-agent delivery, chat surfaces and stores); matrix 97/97; refresh flows 24/24;
  independent preview 13 rows with no errors or non-local requests; browser check of the Skill
  Sources dialog and New chat on port 4541.
- Token tab correction confirmed: the old design-only rule that forced per-run token reads to fail
  is removed, so stored Team member and Org member Token tabs now match the product (TOK-004/005).
- Data boundary: route snapshots remain store-state captures (runtime-state.json 2.9 MB,
  source-state-snapshots.json 5.0 MB) — the pre-existing DATA-001 gap the user deferred; recorded,
  not resolved.
- Source re-fetched at review: `origin/personal` advanced to `10fb695`; the only frontend change after
  `4dee901` is `3467656` (Background Tasks panel shows the shell command). Follow-up refresh
  `WEB-BASELINE-REFRESH-007` opened for it so the baseline is fully current.
- Decision: `Accepted`.
