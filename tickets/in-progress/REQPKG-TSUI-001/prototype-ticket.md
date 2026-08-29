# Prototype Ticket

## Identity And Scope

- Ticket / request ID: `REQPKG-TSUI-001`
- Title: Settings > Token Statistics professional hierarchy requirements visualizer
- Status: `In Progress`
- Mode: `Requirements Visualization`
- Related requirements revision: `RER-007`; Requirements branch commit `26a55026e09135b84bed145026c0cc1f55d069ee`
- Related requirement, behavior, acceptance-criteria, and decision IDs: `BEH-001`–`BEH-006`; `REQ-001`–`REQ-016`; `AC-001`–`AC-016`; `DEC-001`–`DEC-008`
- Critical journey or product decision: Select between two clean product-only future-state treatments for hierarchy, compact controls, primary-versus-secondary exact evidence, and Run-details unification across partial/full coverage, filter, evidence, tab-transition, and constrained-width states, without prior-period or contributor callouts.
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
- Prototype revision containing the current `RV-007` visualizer, feasibility audit, and evidence: `Pending RV-007 commit`
- Ticket folder: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001`
- Integration target and result: The accepted baseline commits `6ba98942c669329f70ba902db4a2880375ad52ad` and `16638137bdb8ebe627507dac6c3c8bdbc5edf9d6` are on `origin/personal`. The user-confirmed exploratory `RV-007` work remains only on `prototype/reqpkg-tsui-001`; final-prototype integration has not started.
- Cleanup result: Deferred. Retain the active worktree and review runtimes while Requirements Engineering reconciles the final user decisions and the separate Final Prototype stage follows.

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
- Requirements-visualization design plan: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/requirements-visualization-design-plan.md`; revision `RV-007`, status `Ready to Build`.
- Requirements-visualization review: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/requirements-visualization-review.md`; revision `RV-007`, status `User Confirmed — Final Prototype Requested`.
- Current-contract feasibility audit: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/implementation-feasibility-audit.md`; classification `Achievable with current source-pin data and GraphQL contracts after correction`.
- Requirement-impact record: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/requirement-impact.md`; `RI-001` records the final `DEC-007`/`DEC-008` user decisions and final-prototype request that still require canonical Requirements Engineering reconciliation.
- Visualizer source: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/visualizers/REQPKG-TSUI-001`
- Future-state visual-reference directory: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/visual-references`
- Current-state comparison evidence: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/evidence/token-statistics-refresh`
- Visualizer template revision: Agent repository `a6af4fd689a1c6cb1ec1f06c07d0b6011a8c8679`; template last changed in `e9a158b4cb80d4fa54d0c495d6ba862a34cf874d`.
- Active capabilities: React, Vite, TypeScript, CSS, inline SVG, deterministic local state, Playwright browser validation.
- Omitted optional capabilities: Motion, Three.js, React Three Fiber, and Drei; the comparison does not depend on animation or spatial reasoning.
- Validation commands and results: `npm run build` passed; `npm run validate` passed `18/18`; Chromium desktop `1440x1000`, constrained composition, actual narrow `390x844`, UTC/English/light/reduced-motion; zero browser errors; no page-level narrow overflow; named controls; no redundant `h1`; zero active animations; local export status; keyboard navigation resize; Run-details model columns limited to current-query fields; six equal focus-summary columns; coherent filtered cache composition; open-top Tokens/Cost axes; 29 daily points, one line, zero bars, and zero point stems; zero forbidden prior/comparison/driver/Input-output-ratio wording.
- Validation evidence: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/validation`; browser `18/18` pass and pinned-source contract audit `PASS`.
- User-confirmation reference: User feedback on 2026-08-29 rejected visible prototype chrome (`RV-002`), required current-contract feasibility (`RV-003`), selected the point-marked daily line (`RV-004`), removed prior/comparison/driver presentation (`RV-005`), required conventional axes (`RV-006`), selected `Uncached input`, six equal summary columns, visible secondary `Detailed usage`, and confirmed the current focused Analytics plus light Run-details treatment as the final direction (`RV-007`).
- Mocked boundaries and known limitations: Synthetic locally resettable fixtures; no production runtime or persistent export. Loading/error/empty/local/mixed-currency/localization/custom-date/sorting permutations remain established by the accepted baseline but are not exhaustively re-rendered in this focused visual comparison. This Requirements Visualization must not be treated as a complete implementation-ready final prototype.

## Outcome And Handoff

- Current outcome: `Requirement Impact`
- Completed behavior and evidence: Accepted Token Statistics baseline is durably integrated through `origin/personal` revision `16638137bdb8ebe627507dac6c3c8bdbc5edf9d6`. `RV-007` adds the open-top plot, cache-aware six-column summary, `Uncached input` terminology, and retained visible `Detailed usage`; `18/18` browser checks pass. The user explicitly confirms the focused Analytics and light Run-details direction as final for implementation.
- First-view simplicity evidence: Product-only DOM and screenshots contain no visualization heading, prior/comparison/contributor/driver surface, Input/Output ratio, or top plot ceiling. Six equal summary metrics and the daily line are immediately scannable before the secondary exact table.
- Motion/comprehension evidence: No decision-relevant motion; stable states persist. Automated checks establish the interaction/result relationship, and the user explicitly confirms satisfaction with the complete current page.
- Remaining product decisions: None in the focused visualizer. Requirements Engineering must record `DEC-007 = Uncached input`, `DEC-008 = Detailed usage visible with grouping control`, the focused filter treatment, light Run-details unification, and the user's request for Final Prototype mode.
- Next expected action: Requirements Engineering reconciles the final user decisions and issues the exact Final Prototype package. Product Prototyper then creates the final runnable prototype at the repository root, canonical `ui-ux-spec.md`, normative final screenshots, validation package, and completed-prototype handoff. Do not treat the temporary visualizer project or its review images as that final normative package.
- Handoff outcome from `get_handoff_rules`: `Requirement Impact` matched the Requirements Engineering resolution route.
- Matched recipient address, when a rule applies: `/requirements_engineering_team/requirements_engineer`
- Return context when no matching rule applies: Return the review-ready package to the user or calling workflow.
