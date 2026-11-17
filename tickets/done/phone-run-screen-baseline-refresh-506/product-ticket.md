# Product Ticket: phone-run-screen-baseline-refresh-506 (baseline ticket for Project Task autobyteus-506)

- Status: `Completed` (baseline accepted 2026-11-17)
- Mode: scoped baseline Refresh (the phone, `/mobile`) by the UI Baseline Bootstrapper
- Design repository: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Branch / worktree: `design/phone-run-screen-baseline-refresh-506` / `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/phone-run-screen-baseline-refresh-506`
- Accepted base: `b017f0881e5e62551a1774dd40f95e00c6d655a4`
- Source pin: `origin/personal@e4f4b3e1765669cf2c411652770199234ff6c214` (release 1.5.13-beta.7), `autobyteus-web` read only, clean
- Report: `ui-baseline-report.md` (scoped refresh section on top); runbook `ui-reference-runbook.md`; evidence `evidence/phone-run-screen-baseline-refresh-506/`
- Acceptance check (designer): started with `corepack pnpm dev --port 4506`; opened `/mobile` at 412 px, 3x; the run "Summarize the 1.6 release notes for the pilot customers" renders the source's conversation (bubbles, tool cards, errors); data origin: `prototype/source-observation/mobile-world.mjs` is invented (header states it, no real node/run read); evidence shows pixel-identical comparison at 412 px for the compared surfaces; known gaps (report) accepted, none a UI parity difference.
