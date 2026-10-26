# Product Ticket — WEB-BASELINE-REFRESH-013

## Identity And Scope

- Ticket / request ID: `WEB-BASELINE-REFRESH-013` (baseline ticket)
- Title: Refresh the AutoByteus Web baseline to `origin/personal@d74f75a51a` (adds Settings → Model Routing, "Show internal agents", delegated-copy rows)
- Status: `Completed` (accepted by Product 2026-10-26)
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

## Product Acceptance (2026-10-26)

- Bootstrapper result: `Completed` (Refresh), report `ui-baseline-report.md`, evidence `evidence/WEB-BASELINE-REFRESH-013/`, pin `d74f75a51ab7dc47d42a13f33e0f943c3a230ad7`.
- Sync check (Product): `components/settings/model-routing/*` (5 files), `ShowInternalAgentsCard.vue`, `utils/runSettings/delegatedLaunchRows.ts`, and the en and zh-CN
  `modelRoutingSettings.ts` compared byte for byte with `d74f75a51a:autobyteus-web/…`: all identical.
- Data origin (Product): the Model Routing runtimes, limits, models and balances (`prototype/source-observation/fixtures.mjs`, scenarios `routing_*`) are hand-written
  and invented; the node network, remote runs and update fixtures are invented as in earlier refreshes. No real data. No test, `validate:*` or `capture:*` script was added;
  `package.json` and the lockfile are unchanged.
- Browser (Product, port 4820): `/settings?section=model-routing` shows the Model Routing page with "Agent runtimes now", the Embedded Node line, Check again, and the Codex
  limits (88% / 41% left, reset times) and "2 models · 1 blocked".
- Decisions on the Bootstrapper's questions: (1) the approved references of `one-nodes-tab`, `remote-runs-in-tree` and `update-checks-and-auto-updates` stay as those designs'
  record and are not recaptured (a finished design is a record of what the user approved); (2) the design example data for remote runs stays in the default scenario;
  (3) the 3.5 s automatic-update delay stays (a design simplification); (4) Reconnect's collaborator case on delegated copies stays open and is out of scope.
- Runtime: dev server 4820 stopped.
