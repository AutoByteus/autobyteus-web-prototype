# Product Ticket: phone-baseline-refresh-279 (baseline refresh for autobyteus-279)

- Status: `Completed` (baseline accepted by the Product UI/UX Designer, 2026-11-18; integration below)
- Mode: baseline refresh (Bootstrapper), requested by the Product UI/UX Designer for the design ticket `ios-demo-mode-279`
- Why: the Solution Designer's round 2 verification (R2-02) found the phone (`/mobile`) reference behind the shipped source. Apple reviews the current build, so the demo must sit on today's phone screens. Verified with git: since the `/mobile` pin `e4f4b3e176`, `origin/personal@f7b4d68711` changed phone UI files (`components/mobile/runList/*`, `runScreen/MobileRunMenu.vue`, `MobileRunTargetView.vue`, `views/MobileNodeDesktop.vue`, `views/MobileBackgroundTasks.vue`, `views/MobileRunSettings.vue`, `utils/mobile/*`, `composables/mobile/*`). That includes autobyteus-525 (one phone-wide Text size under "On this phone" in the run list's ⋮), autobyteus-534 (three steps, a "Text size" header, Settings last in the run's ⋮), the VNC Control-mode Keyboard/Clipboard row and autobyteus-448 (an idle agent with running background tasks).
- Design repository: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket branch / worktree: `design/phone-baseline-refresh-279` / `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/phone-baseline-refresh-279`
- Accepted design base: `fc68a7a4d249029d672d6b398b6d6ce2835cbbdc`
- Selected source: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web` at `origin/personal@f7b4d68711`
- Established report: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md` (first section: phone-run-screen-baseline-refresh-506)
- After acceptance: commit, integrate into `personal`, then merge `personal` into `design/ios-demo-mode-279`.

## Bootstrapper result and acceptance (2026-11-18)

- Result: `Completed`, Refresh, phone (`/mobile`) only, source `origin/personal@f7b4d68711a0d0aa11ee3802b1264293d1c4ae8c` (1.5.13); desktop surfaces keep their pins. Report: `ui-baseline-report.md` first section; runbook first section; evidence `evidence/phone-baseline-refresh-279/` (30 pairs, `pixel-differences.txt`, `copied-files-audit.txt`).
- Accepted. Checked: the copied-files audit (38 phone UI files byte-identical to f7b4d68711; AgentEventMonitor.vue = source + the accepted design-only Reconnect notice; MobileRunSettings.vue = source except three imports to a local stand-in store); the data boundary (new data is invented: background tasks of `mx-apc-0001` and a Team member, one stopped-by-time-limit task; no copied content); the pairs (identical or clock-only, except the run-screen pairs whose conversation behind the menu sits at another scroll offset: bar and menu identical, report PR-04/PR-05); and the running baseline (run list ⋮ "On this phone": "Text size" header, three steps).
- Recorded gaps (not parity differences): two states baseline-only (another node's run Settings, a delegated agent's run screen), the source harness not keeping Saves, the pre-existing `llmStore.refreshCatalog` console error, Team/Org Settings checked on the baseline only.
