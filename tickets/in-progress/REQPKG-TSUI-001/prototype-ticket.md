# Prototype Ticket

## Identity And Scope

- Ticket / request ID: `REQPKG-TSUI-001`
- Title: Settings > Token Statistics professional hierarchy requirements visualizer
- Status: `Blocked`
- Mode: `Requirements Visualization`
- Related requirements revision: `RER-001`; Requirements branch commit `1b5c401e8c2ed7af7630a840e7294541cbf7ad6f`
- Related requirement, behavior, acceptance-criteria, and decision IDs: `BEH-001`–`BEH-006`; `REQ-001`–`REQ-014`; `AC-001`–`AC-014`; `DEC-001`–`DEC-004`
- Critical journey or product decision: Select between two clean product-only future-state treatments for hierarchy, compact controls, primary-versus-secondary exact evidence, and Run-details unification across partial/no-comparison, full/comparable, filter, evidence, tab-transition, and constrained-width states.
- In scope: Exploratory Requirements Visualization after acceptance of the exact current-experience Token Statistics baseline.
- Non-goals: Final normative UI approval; backend, GraphQL, persistence, accounting, quota, budget, forecast, alerts, new Analytics dimensions, live Token Meter, unrelated Settings redesign, automatic navigation collapse, fake historical backfill, or invented zero cost.

## Prototype Context

- Canonical prototype repository/root: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Active Product ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001`
- Product ticket branch: `prototype/reqpkg-tsui-001`
- Integration/default branch: `personal` (`origin/personal` is the accepted integration authority selected for this ticket)
- Accepted prototype base revision: `0e43f9d6e638c67f0f82bb1a5d7c7cd2fd930fd9`
- Accepted baseline integration tip on `origin/personal`: `16638137bdb8ebe627507dac6c3c8bdbc5edf9d6` (pushed as a fast-forward on 2026-08-29).
- Source repository: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements`
- Selected frontend: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/autobyteus-web`
- Required source ref and pinned revision: `origin/personal` at `9d0fd7c570d58da1af2c7a40279327c8a20a8093`
- Source constraint: Requirements commit `1b5c401e8c2ed7af7630a840e7294541cbf7ad6f` was not used as the current-experience source.
- Bootstrap report: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/prototype-bootstrap-report.md`
- Product acceptance result and date: Accepted 2026-08-29; see `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/baseline-acceptance.md`.
- Accepted Token Statistics baseline revision: `6ba98942c669329f70ba902db4a2880375ad52ad`
- Baseline metadata revision: `16638137bdb8ebe627507dac6c3c8bdbc5edf9d6`
- Prototype revision containing the current `RV-004` visualizer, feasibility audit, and evidence: `d2ede144bab4d2e4210c862dd38fae2243def89d`
- Ticket folder: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001`
- Integration target and result: The accepted baseline commits `6ba98942c669329f70ba902db4a2880375ad52ad` and `16638137bdb8ebe627507dac6c3c8bdbc5edf9d6` are now on `origin/personal`. The exploratory `RV-004` work remains only on `prototype/reqpkg-tsui-001` while user review is open.
- Cleanup result: Deferred. Retain the active worktree and review runtimes while status is `Awaiting User Review`.

## Runtime Isolation

- Baseline review: `http://127.0.0.1:3261/settings?section=token-usage`; ticket-owned Nuxt PID `30642`, exec session `23017`.
- Requirements visualizer: ticket-owned Vite process on port `3262`, exec session `75463`.
- Direction A review URL: `http://127.0.0.1:3262/?direction=focus`
- Direction B review URL: `http://127.0.0.1:3262/?direction=dense`
- Deterministic optional scene values: `comparable`, `filters`, `evidence`, `runs`, `narrow` through `scene` query parameter.
- Temporary/runtime state root: `/tmp/autobyteus-prototype-REQPKG-TSUI-001`
- Fixture ownership: Ticket-local synthetic fixtures only; no production credentials, customer data, services, or writes.
- Reset method: Reload a clean direction URL for the default partial state. Stop only PIDs recorded for this ticket during terminal cleanup.

## Delivery And Validation

- UI/UX specification: Not applicable in exploratory Requirements Visualization mode.
- Requirements-visualization brief: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/requirements-visualization-brief.md`
- Requirements-visualization design plan: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/requirements-visualization-design-plan.md`; revision `RV-004`, status `Ready to Build`.
- Requirements-visualization review: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/requirements-visualization-review.md`; revision `RV-004`, status `Ready for Review`.
- Current-contract feasibility audit: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/implementation-feasibility-audit.md`; classification `Achievable with current source-pin data and GraphQL contracts after correction`.
- Requirement-impact record: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/requirement-impact.md`; `RI-001` requires Requirements Engineering resolution before `RV-005`.
- Visualizer source: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/visualizers/REQPKG-TSUI-001`
- Future-state visual-reference directory: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/visual-references`
- Current-state comparison evidence: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/evidence/token-statistics-refresh`
- Visualizer template revision: Agent repository `a6af4fd689a1c6cb1ec1f06c07d0b6011a8c8679`; template last changed in `e9a158b4cb80d4fa54d0c495d6ba862a34cf874d`.
- Active capabilities: React, Vite, TypeScript, CSS, inline SVG, deterministic local state, Playwright browser validation.
- Omitted optional capabilities: Motion, Three.js, React Three Fiber, and Drei; the comparison does not depend on animation or spatial reasoning.
- Validation commands and results: `npm run build` passed; `npm run validate` passed `17/17`; Chromium desktop `1440x1000`, constrained composition, actual narrow `390x844`, UTC/English/light/reduced-motion; zero browser errors; no page-level narrow overflow; named controls; no redundant `h1`; zero active animations; local export status; keyboard navigation resize; Run-details model columns limited to current-query fields; Usage over time verified as 29 daily points, one line, and zero bars.
- Validation evidence: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/validation`; browser `16/16` pass and pinned-source contract audit `PASS`.
- User-confirmation reference: User feedback on 2026-08-29 rejected visible Requirements Visualization metadata/chrome (`RV-002`), required explicit proof that downstream implementation can use the current data structure without invented facts (`RV-003`), and preferred a point-marked line/curve over vertical bars for usage over time (`RV-004`).
- Mocked boundaries and known limitations: Synthetic locally resettable fixtures; no production runtime or persistent export. Loading/error/empty/local/mixed-currency/localization/custom-date/sorting permutations remain established by the accepted baseline but are not exhaustively re-rendered in this focused visual comparison. This Requirements Visualization must not be treated as a complete implementation-ready final prototype.

## Outcome And Handoff

- Current outcome: `Requirement Impact`
- Completed behavior and evidence: Accepted Token Statistics baseline is durably integrated through `origin/personal` revision `16638137bdb8ebe627507dac6c3c8bdbc5edf9d6`. `RV-004` retains the current-contract audit and clean product-only URLs, and replaces usage bars with a data-supported 29-point daily line; `17/17` browser checks pass.
- First-view simplicity evidence: Product-only DOM and screenshots contain no visualization heading, direction/journey selector, selection strip, reset control, or explanatory footer. Primary usage, coverage, trend, missing comparison, and dominant driver remain scannable in the initial view.
- Motion/comprehension evidence: No decision-relevant motion; stable states persist. Automated checks establish the interaction/result relationship, but human preference and comprehension remain unconfirmed.
- Remaining product decisions: Whether dominant-contributor and runtime/model grouping remain optional or are removed; whether prior comparison remains optional/secondary or is removed; canonical labels/definitions for uncached/standard input, cached input, cache hit rate, and output; existing `DEC-001`–`DEC-004` consequences.
- Next expected action: Requirements Engineering revises or reaffirms the affected requirements from `RI-001`; Product Prototyper then produces `RV-005`. Do not treat `RV-004` as a final implementation direction.
- Handoff outcome from `get_handoff_rules`: `Requirement Impact` matched the Requirements Engineering resolution route.
- Matched recipient address, when a rule applies: `/requirements_engineering_team/requirements_engineer`
- Return context when no matching rule applies: Return the review-ready package to the user or calling workflow.
