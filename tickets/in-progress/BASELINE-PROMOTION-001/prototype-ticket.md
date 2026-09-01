# Prototype Ticket

## Identity And Scope

- Ticket / stable package: `BASELINE-PROMOTION-001`
- Title: Promote approved preview candidates into the default prototype baseline
- Status: `In Progress — validated; integration and promotion finalization pending`
- Mode: `Product Experience Prototyping`
- User authorization: On `2026-09-01`, after the preview-gating defect was identified and the Product Prototyper skills were updated, the user directed Product Prototyper to perform baseline promotion for the affected completed tickets.
- Affected approved packages: `AORG-FLAT-TEAM-001` and `REQPKG-NTHUI-001`.
- Audit-only completed packages: `REQPKG-TSUI-001` already uses the clean canonical route `/settings?section=token-usage`; `initial-prototype-baseline` is the accepted current-experience base and has no future-state preview candidate to promote.
- Critical journey: enter Agent Teams, Agent Orgs, their launch/configuration journeys, and the approved Workspace hierarchy through normal product navigation and clean URLs without `prototypeReview` or review-only query state.
- Non-goals: visual redesign, requirement changes, production implementation, replacement of approved fixtures, or changes to the already promoted Token Statistics surface.

## Repository And Baseline

- Canonical prototype repository/root: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Product ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/BASELINE-PROMOTION-001`
- Product ticket branch: `prototype/baseline-promotion-001`
- Integration/default branch: `personal`
- Accepted prototype base: `79093e9a781024844fe3d3678e93ab44386c1040`
- Source repository: `/home/autobyteus/workspace/autobyteus-workspace`
- Selected frontend: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web`
- Pinned source revision inherited from the accepted AORG baseline: `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Accepted Bootstrapper report: `/home/autobyteus/workspace/autobyteus-web-prototype/prototype-bootstrap-report.md`
- Approved UI authorities:
  - `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-001/ui-ux-spec.md`
  - `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/REQPKG-NTHUI-001/ui-ux-spec.md`

## Runtime Isolation

- Ticket-owned review port: `4195`
- Start command: `corepack pnpm dev --port 4195`
- Temporary state root: `/tmp/autobyteus-prototype-BASELINE-PROMOTION-001`
- Reset method: use a fresh browser context; clear `autobyteus.prototype.*` localStorage keys when exercising a different deterministic fixture.
- Runtime process: ticket-owned Nuxt preview on `4195` during validation; stop before cleanup.

## Promotion Contract

- Normal Agent Team route: `/agent-teams?view=team-list`.
- Normal Agent Org route: `/agent-orgs?view=org-list`.
- Normal Agent Org launch route: `/workspace?root=org&org=<id>&phase=config`.
- Normal standalone Agent Team launch route: `/workspace?root=team&team=<id>&phase=config`.
- Normal Workspace route: `/workspace`; the approved nested-hierarchy visual treatment is active without review query state.
- Historical review URLs may remain usable as evidence, but normal navigation must never introduce or depend on `prototypeReview`.

## Delivery And Validation

- UI/UX promotion supplement: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/BASELINE-PROMOTION-001/tickets/in-progress/BASELINE-PROMOTION-001/ui-ux-spec.md`
- Promotion audit: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/BASELINE-PROMOTION-001/tickets/in-progress/BASELINE-PROMOTION-001/promotion-audit.md`
- Default-entry browser evidence: `11/11` passed with zero browser errors at `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/BASELINE-PROMOTION-001/tickets/in-progress/BASELINE-PROMOTION-001/validation/default-entry/default-baseline-promotion-results.json`.
- Static validation: passed `git diff --check`, typecheck, lint, `12/12` unit tests, `13/13` prototype-boundary checks, and production build; see `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/BASELINE-PROMOTION-001/tickets/in-progress/BASELINE-PROMOTION-001/validation/static-validation.txt`.
- Final visual references: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/BASELINE-PROMOTION-001/tickets/in-progress/BASELINE-PROMOTION-001/visual-references/README.md`.
- Ticket commit/revision: `Pending`
- Promoted default baseline revision: `Pending`

## Outcome And Next Action

- Current outcome/status: `In Progress`.
- Integration result: `Pending`.
- Promotion result: `Pending`.
- Cleanup result: `Pending`.
- Next action: commit the validated promotion, integrate to `personal`, revalidate the canonical default entry points, record the promoted baseline revision, and close the ticket.
