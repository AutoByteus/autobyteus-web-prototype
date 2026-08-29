# Token Statistics Baseline Acceptance

## Decision

- Acceptance ID: `PPA-TS-001`
- Date: `2026-08-29`
- Result: `Accepted`
- Accepted boundary: Settings > Token Statistics current experience at source `origin/personal` pin `9d0fd7c570d58da1af2c7a40279327c8a20a8093`
- Product ticket: `REQPKG-TSUI-001`
- Product worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001`
- Ticket branch: `prototype/reqpkg-tsui-001`
- Bootstrap report: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/prototype-bootstrap-report.md`
- Accepted baseline commit: Pending creation by Product Prototyper; this report will be updated with the durable revision immediately after commit.

## Acceptance Basis

Product Prototyper reviewed the candidate rather than accepting the Bootstrapper summary by assertion.

1. Confirmed the exact source pin and the explicit exclusion of Requirements commit `1b5c401e8c2ed7af7630a840e7294541cbf7ad6f` from current-experience authority.
2. Inspected the current Analytics partial/no-comparison composition and the Run-details task table from the Bootstrapper's matched browser captures.
3. Confirmed the presentation hash audit: `18/18` selected source-owned presentation, utility, and localization files are SHA-256 exact to the pinned source; zero mismatches.
4. Confirmed the matched comparison summary: `26/26` visual/interaction cases pass, `13` screenshots are byte exact, remaining canvas differences are subpixel-only, and both source/prototype unexpected browser-error lists are empty.
5. Ran Product-owned browser acceptance on the candidate at `http://127.0.0.1:3261/settings?section=token-usage`:
   - `PPA-TS-001`: populated partial-coverage/no-comparison state exposes partial coverage, unavailable comparison, `152K` tokens, and `$0.87` partial cost evidence — pass.
   - `PPA-TS-002`: Analytics -> Run details -> Team expansion preserves creation-time/lifetime guidance, Product Review Team and Research Assistant rows, and `/researcher` plus `/writer` members — pass.
   - `PPA-TS-003`: `390×844` view keeps Analytics/Run details, Export CSV, and total usage accessible with document width equal to viewport width — pass.
   - Browser errors across these acceptance journeys: `0`.
6. Re-ran Product-owned CLI validation:
   - `corepack pnpm test`: `3` files / `11` tests pass.
   - `corepack pnpm lint`: pass.
   - `corepack pnpm validate:boundaries`: `13/13` pass.
   - `corepack pnpm typecheck`: pass; only the accepted-base duplicate-getter warnings remain.

## Evidence

- Product browser result: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/acceptance/baseline-browser-acceptance.json`
- Product browser screenshots:
  - `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/acceptance/PPA-TS-001-partial-baseline-desktop.png`
  - `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/acceptance/PPA-TS-002-run-details-expanded-desktop.png`
  - `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/acceptance/PPA-TS-003-populated-baseline-narrow.png`
- Product CLI log: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/acceptance/baseline-cli-validation.txt`
- Product typecheck log: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/acceptance/baseline-typecheck.txt`
- Bootstrap machine summary: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/evidence/token-statistics-refresh/machine/token-statistics-refresh-summary.json`
- Presentation audit: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/evidence/token-statistics-refresh/machine/presentation-source-hash-audit.json`

## Boundaries And Result

- The accepted baseline proves the selected browser-observable Token Statistics experience, not production architecture or integration.
- Synthetic usage, task, run, cost, and failure fixtures are illustrative; visible semantics and current presentation are exact to the pin.
- No future-state requirements or redesign were incorporated into the baseline.
- Known user-facing discrepancy inside the accepted boundary: none.
- Baseline acceptance unblocks the cognition-first Requirements Visualization design pass for `DEC-001`–`DEC-004`.
