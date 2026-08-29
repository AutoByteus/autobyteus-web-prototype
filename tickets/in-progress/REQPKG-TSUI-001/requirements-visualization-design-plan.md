# Requirements Visualization Design Plan

- Package / ticket ID: `REQPKG-TSUI-001`
- Revision: `RV-004`
- Decision question: Which composition should govern future Token Statistics hierarchy, density, evidence disclosure, and Run-details cohesion?
- One-sentence user takeaway: The user can compare two credible treatments over the same truthful states and explain which one makes real usage dominant without weakening exact evidence.
- Chosen visual form: Two clean product-only compositions selected by URL, each retaining real product-native interaction. Usage over time is a line chart with point markers and restrained vertical guides rather than vertical bars.
- Why this is the smallest suitable representation: User feedback establishes that persistent visualization chrome obscures the product decision. Two clean URLs preserve exact composition and let the product itself carry the comparison; state-specific evidence is reached through the proposed controls rather than an external journey navigator.
- Alternatives considered and rejected: Persistent review headers/selectors were built in RV-001 and explicitly rejected by the user as distracting; a floating review drawer would still add non-product surface; static screenshots alone would remove interaction; side-by-side pages would shrink content; animation would add irrelevant motion. Vertical bars were rejected in RV-004 because the user's primary reading task is the shape of usage across chronological buckets; an area fill was rejected because it would add visual mass and could imply continuous volume between discrete buckets.
- Implementation technology selected after the design gate: Ticket-scoped React/Vite/TypeScript visualizer copied from the required scaffold, using plain React state and CSS only. `motion`, Three.js, React Three Fiber, and Drei remain installed but intentionally unused.

## Visible Model

- Initial view: A full-viewport Settings > Token Statistics product surface, Direction A by default, populated partial coverage/no comparison, with no external visualization copy or controls.
- Actors or objects to show: Settings navigation and manual resize handle; Analytics/Run-details tabs; compact product controls; primary usage evidence; a bucket-based line with visible point markers; secondary evidence disclosure.
- States to show: Partial/no comparison; full/comparable; filters open; exact driver evidence open; Run details; constrained width.
- Relationship or causal distinction: Separate clean Direction A/B URLs change hierarchy and disclosure strategy while data truth stays fixed; product-native actions expose the corresponding filter/evidence/Run-details state.
- Trend truth rule: Each marker corresponds to one exact returned bucket. The connecting line supports trend perception but does not replace the exact bucket value or accessible text alternative. No invented interpolation is used for accounting.
- Details intentionally hidden or deferred: Secondary filter fields remain behind `Filters`; accounting metadata remains behind row evidence; Run child/member rows remain behind expansion; exact chart bucket tables are acknowledged but not fully reproduced because exact-row strategy is the decision focus.

## Motion Design

- Motion purpose, or why motion is not needed: No decision-relevant motion is needed. Immediate, labeled stable-state replacement makes composition comparison easier and avoids requiring memory of animation phases.
- Motion phases and order: Not applicable; only brief nonessential CSS hover/focus feedback.
- Teaching pace and consequence dwell: Stable states remain until the reviewer changes direction or journey.
- Pause, replay, reset, step-through, slow, or skip controls: Not applicable to stable-state comparison. Reloading a clean URL restores its default partial/no-comparison fixture and navigation width.
- Reduced-motion and stable-state equivalent: All decision meaning is already available in stable states; `prefers-reduced-motion` disables cosmetic transitions.
- Which changes must not happen instantaneously: None; no causal path is being taught.

## Interaction Storyboard

1. **Show:** One clean product composition over the rejected-current-state fixture, with real usage visually dominant and unavailable comparison reduced to proportionate inline context.
2. **User action:** Operate range, filters, evidence disclosure, Analytics/Run-details tabs, or manual navigation sizing; compare the second clean URL separately.
3. **Visible consequence:** The product surface reveals the decision-relevant state without external review chrome or changed truth semantics.
4. **Simplified boundary:** Mock/simulation boundaries remain in the review artifact and handoff rather than being drawn over the product UI.

## Cognitive Foundation Check

- How does the first view avoid unnecessary cognitive load? It is only the proposed product: one Settings shell, one selected Token Statistics view, one primary evidence hierarchy, and no visualization wrapper.
- What is the simplicity budget for this visualizer? One clean product surface per URL, existing product tabs plus compact product controls, one primary hierarchy, and at most one product disclosure open at a time.
- What is progressively disclosed, and when? Filters, secondary accounting evidence, and Run child rows appear only through their product-native controls; constrained behavior appears through actual viewport or Settings-navigation resizing.
- What text is necessary to name the model without repeating it? Product labels and truthful status copy only. Direction/tradeoff and mock-boundary text stays outside the rendered product in the review package.
- How can the user pause, replay, reset, or understand the result without motion? States never auto-advance; refresh restores a deterministic clean product state, and separate URLs preserve each direction without hidden animation history.
- Can a first-time observer follow the full motion sequence at the chosen teaching pace? Not applicable; no teaching motion is used.
- What will demonstrate that the user understood the intended relationship? The reviewer can name a preferred direction and cite how it treats totals/trend, missing comparison, controls, exact evidence, and Run details without claiming that the fixture changed.

## Truthful Boundaries

- Mocked data or behavior: Synthetic current/prior totals, trend points, driver rows, coverage/pricing evidence, filter result, run rows, disclosure state, export feedback, and manual frame/nav sizing.
- Intentionally omitted behavior: Backend fetches, persisted settings, real CSV bytes, all loading/error/empty screens, full localization permutations, full accounting tables, and unrelated Settings pages.
- Why the omissions are safe for this question: The requirements decision is visual hierarchy and disclosure; current truth semantics and omitted states remain protected by the accepted baseline and are not being redefined here.
- What the visualizer must not imply about the product: It is not final approval, a production architecture, an authorization to change analytics semantics, or permission to collapse Settings navigation automatically.

## Design Gate

- [x] The first view presents one decision question and one focused journey.
- [x] The visible model fits the simplicity budget and excludes unnecessary dashboard, navigation, identifier, and implementation surface.
- [x] The user can identify the action and consequence without a long explanation or hidden prior state.
- [x] Secondary detail is deferred behind intentional progressive disclosure.
- [x] Decision-relevant motion is slow enough to follow, holds the consequence, and avoids unrelated simultaneous movement. (No decision-relevant motion is used; stable state persists.)
- [x] The same decision-relevant meaning is available without motion or 3D.
- Status: `Ready to Build`
- Remaining design concern: Separate direction URLs must be clearly listed in the handoff so removal of on-page review chrome does not make the comparison undiscoverable. Final implementation must use exact returned day/week/month buckets and preserve the accessible exact bucket table.
- Evidence for the decision: User feedback on RV-001 explicitly requested removal of all visualization content above and below the product so the review shows only what could become the product; RV-004 explicitly prefers a point-marked line/curve over bars for daily/monthly usage; the accepted baseline supplies the truth contract.
