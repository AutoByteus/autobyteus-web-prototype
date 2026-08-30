# Prototype Ticket

## Identity And Scope

- Ticket / request ID: `REQPKG-NTHUI-001`
- Stable package identifier: `nested-team-hierarchy-ui`
- Title: Workspace nested-team hierarchy visual-language comparison
- Status: `Awaiting User Review`
- Related requirements revision: `RER-001` (`Draft — Requirements Visualization Needed`; no approval claimed)
- Related requirement, behavior, acceptance-criteria, and decision IDs: `BEH-001`–`BEH-005`; `REQ-001`–`REQ-012`; `AC-001`–`AC-008`; `DEC-001`–`DEC-003`
- Critical journey or product decision: Compare compact ancestry grammar, narrow-width metadata density, and team-node identity using one identical deep Workspace-history fixture.
- In scope: One team-definition group with multiple runs; one expanded run; root members; three sibling configured subteams; a deeper nested subteam; one transient task team; collapsed/expanded/selected states; mixed statuses; long names; 260/320/520px; Default/Extra Large; pointer/keyboard disclosure and identity recovery.
- Non-goals: Backend/topology/status/persistence changes; Team definition editor; right-side Team overview; mobile/global navigation; full-page org chart; drag/drop; global typography; final or production implementation.

## Prototype Context

- Prototype repository/root (separate from source repository): `/home/autobyteus/workspace/autobyteus-web-prototype`
- Prototype ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001`
- Prototype ticket branch: `prototype/reqpkg-nthui-001`
- Source repository and selected frontend: requirements worktree root `/home/autobyteus/workspace/autobyteus-workspace-nested-team-hierarchy-ui-requirements`; selected frontend `/home/autobyteus/workspace/autobyteus-workspace-nested-team-hierarchy-ui-requirements/autobyteus-web`
- Pinned source revision: `5cb39c65630b5b0baae7b4813f6e8cd798851e97` observed at intake on 2026-08-30; this is a recorded context pin, not a user-imposed refresh constraint.
- Accepted baseline revision: `550e8bd8737ddb645cc12f674d693bed76a09e9f` on canonical `personal`; the Product-accepted current-experience baseline remains applicable to the Workspace/sidebar interaction language.
- Bootstrap report: `/home/autobyteus/workspace/autobyteus-web-prototype/prototype-bootstrap-report.md`
- Product acceptance result and date: Existing accepted current-experience prototype reused; no new bootstrap is required for this ticket.
- Prototype revision for this ticket: `RV-001`; exact implementation commit will be recorded after the durable review package commit.
- Integration target and result: Canonical `personal`; `Pending` because the clarification loop is open.
- Runtime isolation record (port / process / temporary state): Loopback `127.0.0.1:4193`; npm PID `55202`; Vite preview PID `55219`; deterministic in-memory fixture only; durable browser output under `tickets/in-progress/REQPKG-NTHUI-001/validation`; reset by page reload or `Reset tree`.
- Cleanup result or blocker: `Preserved for review`; cleanup remains pending while user clarification is open.
- Ticket folder: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001/tickets/in-progress/REQPKG-NTHUI-001`

## Delivery And Validation

- UI/UX specification: Not created; Requirements Visualization mode is exploratory and non-normative.
- Runnable prototype entry point: `http://127.0.0.1:4193/`; run from `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001/visualizers/REQPKG-NTHUI-001` with `npm run preview -- --port 4193` after `npm run build`.
- Visual-reference directory: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001/tickets/in-progress/REQPKG-NTHUI-001/visual-references`
- Supporting artifact paths: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001/tickets/in-progress/REQPKG-NTHUI-001/requirements-visualization-brief.md`; `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001/tickets/in-progress/REQPKG-NTHUI-001/requirements-visualization-design-plan.md`; `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001/tickets/in-progress/REQPKG-NTHUI-001/requirements-visualization-review.md`; validation and visual-reference manifest under this ticket folder.
- Validation commands and results: `npm run build` passed; controlled system-Chromium validation passed `55/55` with zero console/page errors; actual 260/320/520px treatments, 100%/125% type, keyboard/focus/hover/disclosure/selection/reveal/refresh/actions, identical fixture signatures, ARIA state, and reduced motion are recorded in `validation/browser-validation.json`; loopback HTTP returned 200.
- User-confirmation reference: None; Requirements Engineering explicitly classified this as exploratory clarification, not approval.
- Mocked boundaries and known limitations: Synthetic topology, statuses, ages, task-run actions, and refresh; no production services, persistence, topology mutation, live status, or run lifecycle.

## Outcome And Handoff

- Completed behavior and evidence: `RV-001` review-ready visualizer compares connector rails, nested surfaces, and hybrid ancestry; full/responsive/on-demand metadata; and three non-color team-node treatments on the same product-grounded fixture. It preserves the required disclosure, structural selection, concrete member selection, selected ancestor reveal, exact/aggregate status, transient identity, quiet refresh, and run-action availability in deterministic form.
- Remaining product decisions: `DEC-001`–`DEC-003` remain open and must be decided by the user; the starting selections are explicitly not recommendations.
- Next expected action: Requirements Engineering conducts user review at the loopback URL, records the three decisions, and requests a focused revision or confirms clarification complete.
- Handoff outcome from `get_handoff_rules`: Pending review-ready result.
- Matched recipient address, when a rule applies: Must be obtained dynamically after persistence and validation.
- Return context when no matching rule applies: Return the review package to the caller/user.
