# Prototype Ticket

## Identity And Scope

- Product ticket: `WEB-BASELINE-REFRESH-001`
- Stable requirements package: `chat-interface-entry` (the user requested this refresh before continuing that package)
- Title: AutoByteus Web full current-experience baseline refresh to latest `origin/personal`
- Status: `Completed`
- Mode: `Current-experience baseline refresh supporting Product Experience Prototyping`
- Action boundary: independently refresh the established AutoByteus Web current-experience baseline from the explicitly selected latest source authority. No future-state chat behavior is included.
- Request (user, 2026-09-28): "bring my base, this web project, the baseline to the latest, like the original project … so that we can develop on top of the latest."

## Repository And Baseline

- Canonical prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`
- Product task worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/WEB-BASELINE-REFRESH-001`
- Product ticket branch: `prototype/web-baseline-refresh-001`
- Integration/default branch: `personal`
- Accepted prototype base: `ba67ac069e6cf0bb95a7342a7e25185f08a0d4e4`
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Explicit source authority: `origin/personal@fcd3e83a4ca931ba52ed19bd37b8df3050ee529e` (latest after `git fetch`, 2026-09-28; source `autobyteus-web` working tree clean)
- Previous primary pin: `8ef282ba77705180d985e7000d801f0e0068cdc1` (308 `autobyteus-web` commits behind the new authority), with later focused refreshes recorded in the report.
- Bootstrap report: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/WEB-BASELINE-REFRESH-001/prototype-bootstrap-report.md`

## Known Drift Observed During Intake (not a prescription)

Observed while starting `chat-interface-entry`: source-only primary navigation entry (capability-gated) and existing-run model-replacement behavior in the run configuration surfaces. These are recorded for Product acceptance review only; the Bootstrapper independently discovers the complete drift.

## Affected Active Tickets

- `chat-interface-entry` — paused at `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/chat-interface-entry` (branch `prototype/chat-interface-entry`, base `ba67ac0`, uncommitted WIP). Resume after this refresh is accepted and integrated; reconcile deliberately onto the refreshed base.

## Runtime

- Bootstrapper-owned candidate and observation ports: to be recorded by the Bootstrapper (avoid `3210`, `3271`).
- Temporary state root: `/tmp/autobyteus-prototype-WEB-BASELINE-REFRESH-001`.

## Status History

- 2026-09-28: opened; `Baseline Needed` — fixed Refresh payload sent to `/product_team/prototype_bootstrapper`.
- 2026-09-28: Bootstrapper returned `Completed — Refresh` (82/82 page/state rows, 15/15 flows, 13/13 host rows, independent preview clean).
- 2026-09-28: Product Prototyper reviewed evidence, re-ran lint/test/boundaries/typecheck, browser spot-checked, and accepted. `Completed`.

## Finalization

- Product acceptance: `Accepted` — `tickets/done/WEB-BASELINE-REFRESH-001/validation/product-acceptance.txt`
- Accepted superseded/removed prototype changes: the user asked for the baseline to match the original project; source implementations win (AgentOrg flat team, Team overrides, mounted-Team status, nested hierarchy review, Token Statistics, Handoff manager) and prototype-only review scaffolding is removed.
- Known limitation: legacy `workspace_*`/`mobile_*` rich-state injector is not source-verified at this pin; later tickets add focused fixtures.
- Integration result: see commit history on `personal` (fast-forward of this ticket branch).
- Cleanup result: Bootstrapper candidate server (port 4199) stopped; ticket worktree removed after integration.
