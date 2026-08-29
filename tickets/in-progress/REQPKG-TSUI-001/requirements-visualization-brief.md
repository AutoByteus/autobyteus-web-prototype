# Requirements Visualization Brief

- Package / ticket ID: `REQPKG-TSUI-001`
- Revision: `RV-002`
- Mode: Requirements Visualization
- Requirements / behavior / acceptance-criteria IDs: `BEH-001`–`BEH-006`; `REQ-001`–`REQ-014`; `AC-001`–`AC-014`; decisions `DEC-001`–`DEC-004`
- Decision question: Which of two credible Token Statistics compositions should govern the future hierarchy, control density, exact-evidence disclosure, and degree of Run-details unification?
- User or stakeholder who must understand or decide: The user, supported by Requirements Engineering.
- Critical journey or interaction to visualize: Open two clean product-only URLs—one per direction—against the same populated partial/no-comparison fixture, then use only product-native controls to exercise full/comparable, filters, exact evidence, Run details, and constrained-width behavior before selecting a direction.
- States that must be shown: Populated partial coverage with no comparison; full coverage with comparable prior period; compact filter interaction; ranked plus exact driver evidence; Run-details transition; constrained-width composition.
- Alternatives or comparisons:
  - `Direction A — Focused hierarchy`: large total/trend, dominant driver adjacent, unavailable comparison reduced to inline context, secondary filters and accounting metadata disclosed on demand, fully unified Run-details presentation.
  - `Direction B — Dense explorer`: compact metric band, always-visible analytical controls, trend and drivers share the first canvas, exact evidence uses a denser ledger/inspector pattern, Run details receives shell/control unification while retaining its denser table character.
- Constraints: Preserve all current UTC presets/custom validation, filters, metric/grouping, one-result coherence, exact evidence, local CSV, coverage/pricing/local/mixed-currency semantics, accessibility, Run-details creation-time/lifetime semantics, no redundant content title, and wholly manual Settings-navigation sizing.
- Non-goals: Backend/GraphQL/persistence/accounting changes; quota/budget/forecast/alert features; new Analytics dimensions; live Token Meter or other Settings redesign; automatic navigation collapse; fake historical backfill; invented zero cost; final normative UI approval.
- Existing frontend / prototype repository context: Accepted current-experience baseline `6ba98942c669329f70ba902db4a2880375ad52ad` in Product worktree `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001`, sourced from `origin/personal` pin `9d0fd7c570d58da1af2c7a40279327c8a20a8093`.
- Success signal: A reviewer can state which direction better supports first-scan comprehension and why, while confirming whether its controls, evidence disclosure, Run-details treatment, and narrow behavior preserve trust and usability.
- Known unknowns: User preference between the two clean product compositions; whether secondary filters should default open; whether Run details should be fully restyled or only visually bridged.
- Revision trigger: User feedback rejected the persistent visualization heading, explanatory copy, direction/journey controls, selection summary, and footer as distracting and unlike the intended product.

## Visualization Scope

- What the user should be able to see: Only the proposed Settings product surface—no visualization heading, explanation, direction selector, journey selector, summary strip, or footer—while total use, cost/status, coverage, trend, comparison availability, and dominant driver remain visible in the first frame.
- What the user should be able to interact with: Use product-native range/metric/filter/export/grouping/evidence/tab controls and manually resize the Settings navigation. Direction A/B and deterministic review-state entry are selected by separate clean URL parameters rather than visible prototype chrome.
- What is mocked: Deterministic token/cost fixtures, dates, chart bars/lines, provider/model/run identities, filter result, disclosure state, CSV result feedback, and constrained-width frame.
- What must not be implied as production behavior: No production queries, persistence, accounting recomputation, pricing lookup, CSV storage, source navigation policy change, or approved final UI contract.

## Review Questions

1. Does Direction A or Direction B make actual usage, truthful coverage, and the dominant driver easiest to scan without elevating unavailable comparison?
2. Which control and exact-evidence treatment is compact enough while keeping active context, secondary accounting data, and export discoverable?
3. Should Run details adopt the selected direction fully, or keep its existing dense table with only shell/control/state unification?
