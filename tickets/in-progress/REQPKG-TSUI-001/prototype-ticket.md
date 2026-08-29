# Prototype Ticket

## Identity And Scope

- Ticket / request ID: `REQPKG-TSUI-001`
- Title: Settings > Token Statistics professional hierarchy requirements visualizer
- Status: `In Progress`
- Mode: `Requirements Visualization`
- Related requirements revision: `RER-001`; Requirements branch commit `1b5c401e8c2ed7af7630a840e7294541cbf7ad6f`
- Related requirement, behavior, acceptance-criteria, and decision IDs: `BEH-001`–`BEH-006`; `REQ-001`–`REQ-014`; `AC-001`–`AC-014`; `DEC-001`–`DEC-004`
- Critical journey or product decision: Compare credible future-state treatments for the Token Statistics hierarchy, compact controls, primary-versus-secondary exact evidence, and the degree of Run-details visual unification across partial/no-comparison, full/comparable, filter, evidence, tab-transition, and constrained-width states.
- In scope: Requirements Visualization after an accepted current-experience baseline exists for Settings > Token Statistics at the required source pin.
- Non-goals: Future-state implementation before baseline acceptance; backend, GraphQL, persistence, accounting, quota, budget, forecast, alert, new Analytics dimensions, live Token Meter, other Settings redesign, automatic navigation collapse, historical backfill, or invented zero cost.

## Prototype Context

- Canonical prototype repository/root (separate from source repository): `/home/autobyteus/workspace/autobyteus-web-prototype`
- Active Product ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001`
- Product ticket branch: `prototype/reqpkg-tsui-001`
- Integration/default branch: `personal` (`origin/personal` is the accepted integration authority selected for this ticket)
- Accepted prototype base revision: `0e43f9d6e638c67f0f82bb1a5d7c7cd2fd930fd9`
- Source repository: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements`
- Selected frontend: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/autobyteus-web`
- Required source ref: `origin/personal`
- Pinned source revision: `9d0fd7c570d58da1af2c7a40279327c8a20a8093`
- Source constraint: Bootstrap current experience from the exact `origin/personal` pin above. Do not use Requirements commit `1b5c401e8c2ed7af7630a840e7294541cbf7ad6f` as the current-experience source.
- Existing accepted bootstrap report: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/prototype-bootstrap-report.md`
- Existing accepted bootstrap pin: `8ef282ba77705180d985e7000d801f0e0068cdc1` (not sufficient for this selected Token Statistics surface/source authority)
- Baseline gap: The accepted base contains the older Run-details-oriented Token Usage components but does not contain the production Analytics surface at the required pin. It lacks the source pin's `components/settings/token-usage/analytics/*`, `TokenUsageRunDetailsView.vue`, and `stores/tokenUsageAnalytics.ts` current-experience inventory.
- Bootstrap mode required: `Refresh` limited to Settings > Token Statistics current-experience parity at the explicitly selected source authority.
- Product acceptance result and date: `Accepted` as `PPA-TS-001` on 2026-08-29; see `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/baseline-acceptance.md`.
- Accepted Token Statistics baseline revision: `6ba98942c669329f70ba902db4a2880375ad52ad`
- Prototype revision for this ticket: Pending future-state visualization revision.
- Ticket folder: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001`

## Runtime Isolation

- Reserved prototype review port: `3261`
- Reserved pinned-source observation port: `4261`
- Current process ownership: Ticket-owned Nuxt preview on `3261` (`nuxt` child PID `30642`; exec session `23017`).
- Temporary/runtime state root: `/tmp/autobyteus-prototype-REQPKG-TSUI-001`
- Fixture ownership: Ticket-local synthetic fixtures only; no production credentials, services, or writes.
- Reset method: Stop only PIDs recorded for this ticket, then remove `/tmp/autobyteus-prototype-REQPKG-TSUI-001`; do not stop or reuse another ticket's process or state.

## Delivery And Validation

- UI/UX specification: Not applicable in exploratory Requirements Visualization mode.
- Runnable baseline entry point: `http://127.0.0.1:3261/settings?section=token-usage`; scenario selection uses `localStorage.setItem('autobyteus.prototype.scenario', '<scenario>')` followed by reload.
- Requirements-visualization brief: Pending cognition-first visualization work after baseline commit.
- Requirements-visualization design plan: Pending; frontend future-state code remains gated until the plan is `Ready to Build`.
- Requirements-visualization review: Pending implementation and browser validation.
- Current-state comparison evidence: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/evidence/token-statistics-refresh`.
- Future-state visual-reference directory: Pending exploratory visualizer implementation.
- Supporting canonical requirements artifacts:
  - `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/tickets/token-statistics-ui-redesign/requirements-doc.md`
  - `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/tickets/token-statistics-ui-redesign/investigation-notes.md`
  - `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/tickets/token-statistics-ui-redesign/requirements-revision-record.md`
- Validation performed: Bootstrapper `26/26` matched browser cases and `18/18` source presentation hash audit accepted; Product-owned browser checks `PPA-TS-001`–`PPA-TS-003` pass; test `11/11`, lint pass, boundaries `13/13`, and typecheck pass.
- User-confirmation reference: User explicitly confirmed that Token Statistics production parity must be established first and authorized creation of the ticket worktree.
- Mocked boundaries and known limitations: None designed yet. Bootstrap implementation must remain current-experience-only and use synthetic, locally resettable state.

## Outcome And Handoff

- Current outcome: `In Progress` — accepted baseline; cognition-first Requirements Visualization work next.
- Completed behavior and evidence: Product-owned isolated ticket worktree established; exact current Token Statistics surface refreshed from source pin `9d0fd7c…`; Bootstrapper evidence independently acceptance-tested as `PPA-TS-001`.
- Remaining product decisions: `DEC-001`–`DEC-004`; untouched until baseline acceptance.
- Next expected action: Complete the visualization brief and cognition-first design plan before implementing any future-state code.
- Integration result: `Pending`
- Cleanup result: `Pending`; retain the active worktree through bootstrap, visualization review, and repository finalization.
- Handoff outcome from `get_handoff_rules`: Matched `Baseline Needed` local bootstrap route.
- Matched recipient address, when a rule applies: `/product_design_prototyping_team/prototype_bootstrapper`
- Return context when no matching rule applies: Return `Baseline Needed` package to the calling workflow.
