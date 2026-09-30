# Prototype Ticket

## Identity And Scope

- Product ticket: `WEB-BASELINE-REFRESH-002`
- Stable requirements package: `chat-composer-menus-open-upward` (this refresh is a prerequisite for that package; no requirements are inputs to the refresh)
- Title: AutoByteus Web current-experience baseline refresh to `origin/personal@57df63f07`
- Status: `Baseline Needed`
- Mode: `Current-experience baseline refresh supporting Product Experience Prototyping`
- Action boundary: independently refresh the established AutoByteus Web current-experience baseline from the explicitly selected source authority. No future-state behavior is included.

## Why A Refresh Is Required

The Solution Designer's request (`chat-composer-menus-open-upward`, SR-001) targets the shipped new-chat surface at `origin/personal@57df63f07` (user screenshot 2026-09-30). The accepted prototype baseline is pinned to `fcd3e83a4`; since then `autobyteus-web` changed in 389 files, including the production implementation of the chat surface and the unprototyped `chat-composer-polish` delivery. Known perceptible drift on the affected surface (recorded for acceptance review only, not a prescription): new-chat vertical bias (prototype `pb-[14vh]` vs source `pb-[6vh]`), workspace menu search, and thinking-menu single list. Future-state work must not start on this stale surface.

## Repository And Baseline

- Canonical prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`
- Product task worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/WEB-BASELINE-REFRESH-002`
- Product ticket branch: `prototype/web-baseline-refresh-002`
- Integration/default branch: `personal`
- Accepted prototype base: `ef5f90998a12dd42c52b422de3ea0634f0e2e887`
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Explicit source authority: `origin/personal@57df63f079363ccab4f2301213f9d8a3458f72fa` (fetched 2026-09-30)
- Previous primary pin: `fcd3e83a4ca931ba52ed19bd37b8df3050ee529e`
- Established bootstrap report: `/Users/normy/autobyteus_org/autobyteus-web-prototype/prototype-bootstrap-report.md` (refresh result expected at `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/WEB-BASELINE-REFRESH-002/prototype-bootstrap-report.md`)

## Affected Active Tickets

- `chat-composer-menus-open-upward` — opened at `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/chat-composer-menus-open-upward` (branch `prototype/chat-composer-menus-open-upward`, base `ef5f909`, ticket record only). Future-state work resumes after this refresh is accepted and integrated; merge the refreshed `personal` deliberately.

## Runtime

- Bootstrapper-owned candidate and observation ports: to be recorded by the Bootstrapper (avoid `3210`, `3271`, `3281`).
- Temporary state root: `/tmp/autobyteus-prototype-WEB-BASELINE-REFRESH-002`.

## Status History

- 2026-09-30: opened; `Baseline Needed` — fixed Refresh payload sent to the Bootstrapper route.

## Finalization

- Product acceptance: Pending
- Integration result: Pending
- Cleanup result: Pending
