# Requirements Visualization Brief

- Package / ticket ID: `REQPKG-TSUI-001`
- Revision: `RV-007`
- Mode: Requirements Visualization
- Requirements / behavior / acceptance-criteria IDs: `BEH-001`–`BEH-006`; `REQ-001`–`REQ-014`; `AC-001`–`AC-014`; decisions `DEC-001`–`DEC-004`
- Decision question: Does a conventional open-top coordinate plot plus a cache-aware total summary answer the user's real cost questions more directly?
- User or stakeholder who must understand or decide: The user, supported by Requirements Engineering.
- Critical journey or interaction to visualize: Open two clean product-only URLs—one per direction—against the same populated partial-coverage fixture, then use only product-native controls to exercise full coverage, filters, exact evidence, Run details, and constrained-width behavior before selecting a direction.
- States that must be shown: Populated partial coverage; full coverage; compact filter interaction; exact usage evidence; Run-details transition; constrained-width composition.
- Alternatives or comparisons:
  - `Direction A — Focused hierarchy`: large total/trend, cost and input/output composition adjacent, secondary filters and accounting metadata disclosed on demand, fully unified Run-details presentation.
  - `Direction B — Dense explorer`: compact metric band, always-visible analytical controls, full-width trend, and a denser `Detailed usage` ledger/inspector pattern; Run details receives shell/control unification while retaining its denser table character.
- Constraints: Preserve all current UTC presets/custom validation, filters, metric/grouping, one-result coherence, exact evidence, local CSV, coverage/pricing/local/mixed-currency semantics, accessibility, Run-details creation-time/lifetime semantics, no redundant content title, and wholly manual Settings-navigation sizing.
- Non-goals: Backend/GraphQL/persistence/accounting changes; quota/budget/forecast/alert features; new Analytics dimensions; live Token Meter or other Settings redesign; automatic navigation collapse; fake historical backfill; invented zero cost; final normative UI approval.
- Existing frontend / prototype repository context: Accepted current-experience baseline `6ba98942c669329f70ba902db4a2880375ad52ad` in Product worktree `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001`, sourced from `origin/personal` pin `9d0fd7c570d58da1af2c7a40279327c8a20a8093`.
- Success signal: A reviewer can state which direction better supports first-scan comprehension and why, while confirming whether its controls, evidence disclosure, Run-details treatment, and narrow behavior preserve trust and usability.
- Known unknowns: User preference between the two clean product compositions; whether secondary filters should default open; whether Run details should be fully restyled or only visually bridged.
- Revision triggers: User feedback rejected the persistent visualization chrome (`RV-002`), required explicit current-contract feasibility (`RV-003`), preferred a point-marked line over bars (`RV-004`), removed prior-period plus dominant/usage-driver presentation (`RV-005`), and requested explicit axes without vertical point stems (`RV-006`). The user then rejected the chart's top “ceiling” guide and directed the total summary to show Uncached input, Cached input, Output, and Cache hit rate instead of an Input/Output ratio (`RV-007`).

## Visualization Scope

- What the user should be able to see: Only the proposed Settings product surface—no visualization wrapper—while total use, cost/status, coverage, and the daily Tokens/Cost trend dominate the first frame. No prior-period percentage, standalone dominant-contributor panel, or `driver` terminology appears.
- Usage-over-time form: A conventional open-top coordinate chart with an explicit labeled Y-axis, a visible X-axis with date ticks, one restrained midpoint guide, and a point marker for each returned chronological bucket. There is no top border/guide, no vertical point stem, and no bar.
- Total-summary form: Total tokens, Uncached input, Cached input, Output, Estimated API cost, and Cache hit rate each occupy a separate equal-width summary column. Typography supplies hierarchy; no metric receives an oversized structural column. Cache hit rate replaces the unhelpful Input/Output ratio.
- What the user should be able to interact with: Use product-native range/metric/filter/export/grouping/evidence/tab controls and manually resize the Settings navigation. Direction A/B and deterministic review-state entry are selected by separate clean URL parameters rather than visible prototype chrome.
- What is mocked: Deterministic token/cost fixtures, dates, chart line/points, provider/model/run identities, filter result, disclosure state, CSV result feedback, and constrained-width frame.
- What must not be implied as production behavior: No production queries, persistence, accounting recomputation, pricing lookup, CSV storage, source navigation policy change, or approved final UI contract.

## Review Questions

1. Does removing prior comparison and contributor ranking from the first view make monthly/daily usage and cost easier to understand?
2. Is `Detailed usage` / `Usage by runtime and model` intuitive enough for the remaining secondary identity evidence, or should it be deferred further?
3. Should Run details adopt the selected direction fully, or keep its existing dense table with only shell/control/state unification?
