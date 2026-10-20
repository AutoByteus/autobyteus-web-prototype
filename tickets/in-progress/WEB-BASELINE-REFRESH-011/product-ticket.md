# Product Ticket — WEB-BASELINE-REFRESH-011

## Identity And Scope

- Ticket / request ID: `WEB-BASELINE-REFRESH-011` (baseline ticket)
- Title: Refresh the AutoByteus Web baseline to `origin/personal@9227d61597`
- Status: `Baseline Needed`
- Requester: Product UI/UX Designer, 2026-10-20, for the design `settings-update-notifications` (Project Task
  autobyteus-212).
- Reason, verified with git: `git diff 2f21134 origin/personal@9227d61597 -- autobyteus-web` changes 176
  files. The Settings page this design evolves changed: a Server Settings → **Embedding** sub-section
  (`pages/settings.vue`, `components/settings/embedding/*`, `ServerSettingsManager.vue`, the settings
  messages). Other UI changed too. A full refresh keeps the pin single.
- Refresh policy:
  - where the source implements a surface the UI reference changed, the source wins;
  - accepted design-only changes are kept (Reconnect; the design-only example layers).
- Previous pin: `2f211340ee36b81cef74a74b2e042b5102c269d3` (`WEB-BASELINE-REFRESH-010`).
- Runs in parallel with the design worktree `settings-update-notifications`, which merges this refresh
  before its final references.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-011`
- Ticket branch: `design/web-baseline-refresh-011`
- Accepted design base: `cb384e3` (`origin/personal`, 2026-10-20)
- Source: `autobyteus-web`, selected authority `origin/personal@9227d61597fd7ef8f6324fc9092be24ed1684c8a`
- Product acceptance result and date: pending
- Integration target and result: `personal`, `Pending`
- Runtime isolation: the Bootstrapper uses free ports other than 3210 and 4681–4689 (design review).
- Cleanup result or blocker: `Pending`
- Ticket folder: `tickets/in-progress/WEB-BASELINE-REFRESH-011/`

## Outcome And Handoff

- Next expected action: UI Baseline Bootstrapper refreshes; Product reviews and accepts.
- Handoff outcome: `Baseline Needed` → `/product_team/ui_baseline_bootstrapper`
