# Product Ticket — WEB-BASELINE-REFRESH-013

## Identity And Scope

- Ticket / request ID: `WEB-BASELINE-REFRESH-013` (baseline ticket)
- Title: Refresh the AutoByteus Web baseline to `origin/personal@d74f75a51a` (adds Settings → Model Routing, "Show internal agents", delegated-copy rows)
- Status: `Baseline Needed` (request sent to the UI Baseline Bootstrapper 2026-10-26)
- Requester: Product UI/UX Designer, 2026-10-26, for the design `delegated-runtime-model-routing` (engineering Task autobyteus-32, Model Router).
- Reason, verified with git: the Model Routing page (`components/settings/model-routing/*`, source merge `eac8ee6dfc`, autobyteus-303),
  the "Show internal agents" card (`components/settings/ShowInternalAgentsCard.vue`, merge `e34321789d`, autobyteus-308) and the
  changed delegated-copy rows (`utils/runSettings/delegatedLaunchRows.ts`, `5af1a03e11`) are not in the current pin `9e7a458808`.
  The baseline has no Settings → Model Routing page, and the design extends exactly that page. The frontend differs in 407 files
  (108 commits) between the pin and `origin/personal`.
- Refresh policy: the source wins where it implements a surface; accepted design-only changes are kept. Single pin, whole frontend, as in earlier refreshes.
- Selected source authority: `origin/personal@d74f75a51ab7dc47d42a13f33e0f943c3a230ad7` (also the engineering base of autobyteus-32).
- Previous pin: `9e7a45880865912442f4188e6d2a58d99b10a54c` (`WEB-BASELINE-REFRESH-012`).

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-013`
- Ticket branch: `design/web-baseline-refresh-013`
- Accepted design base: `5f5fb4c9d1f0f1c6477653359d3952363ea728a7` (`origin/personal`, fetched 2026-10-26)
- Integration target and result: `personal`, `Pending`
- Runtime isolation: the Bootstrapper uses free ports other than 3210, 4781–4790 (the design's own).
- Cleanup: `Pending`
- Ticket folder: `tickets/in-progress/WEB-BASELINE-REFRESH-013/`

## Outcome And Handoff

- Next expected action: the Bootstrapper returns `Completed` or `Blocked`; the Product UI/UX Designer reviews, accepts and
  integrates the refresh into `personal`; the design `delegated-runtime-model-routing` then merges `personal`.
