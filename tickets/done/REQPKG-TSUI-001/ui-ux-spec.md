# Token Statistics Final UI/UX Specification

This is the approved Product-owned final-prototype supplement for
`REQPKG-TSUI-001`. The user explicitly confirmed the actual runnable after
verifying that CSV export was removed. The final screenshots listed below were
captured afterward and are normative for their recorded surfaces and states.

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `REQPKG-TSUI-001` — Settings > Token Statistics redesign
- Related requirements revision ID: `RER-009`; commit `6aa6ba066faf041ff1fa221cee5b956fd7e537b5`
- Related requirement, behavior, acceptance-criteria, scenario, and decision IDs: `BEH-001`–`BEH-006`; `REQ-001`–`REQ-016`; `AC-001`–`AC-016`; `SCN-001`–`SCN-007`; resolved `DEC-001`–`DEC-009`
- Runnable prototype repository/root: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Product worktree used during review: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001` (removed after completion)
- Approval review URL: `http://127.0.0.1:3261/settings?section=token-usage`; canonical self-start route: `http://127.0.0.1:3210/settings?section=token-usage`
- Explicit user-confirmation reference: On 2026-08-29, after Product confirmed that the Export CSV UI, preparation/download functionality, requests, files, and replacement workflow were absent, the user stated: “okay. i approve the final product prototype. now”. This approval applies to the actual runnable at the recorded review URL, not only RV-007.
- Final validation date: 2026-08-29 UTC — post-approval typecheck, lint, 12 tests, 13/13 boundaries, Nuxt build, and 19/19 browser validation passed before final capture.

## Repository And Baseline Provenance

- Source repository: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements`
- Selected frontend application or product surface: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/autobyteus-web`; Settings > Token Statistics
- Pinned source commit or revision: required `origin/personal` pin `9d0fd7c570d58da1af2c7a40279327c8a20a8093`
- Prototype repository/root: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Prototype revision or commit: Approved runnable behavior revision `3de6227769c33cfdbefa42f22b44a0de83329563`; accepted baseline implementation `6ba98942c669329f70ba902db4a2880375ad52ad`; accepted pre-ticket integration tip `16638137bdb8ebe627507dac6c3c8bdbc5edf9d6`. The completed ticket/package revision and integration result are recorded in `prototype-ticket.md`.
- Ticket folder: `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/REQPKG-TSUI-001`
- Bootstrap report path: `/home/autobyteus/workspace/autobyteus-web-prototype/prototype-bootstrap-report.md`
- Exploratory direction provenance: RV-007 content `726f414a4f1acf2e32e859c7b6e8a90584d1b6d6`; review metadata `578efc4e3d4929fcce55e1c130f1c6092fda7f44`. The visualizer and its images are historical decision evidence, not this package's normative final reference.

## Scope And Experience Goal

- User or actor: A user reviewing token consumption, estimated API spend, cache efficiency, exact accounting evidence, or run-level usage.
- Context: Settings > Token Statistics in the existing AutoByteus web visual language, at desktop, manually constrained Settings content width, and narrow/mobile-equivalent width.
- Goal: Answer how many tokens were used, how much estimated API cost accumulated, how usage changed by day, and how input was divided between standard/cache-miss, cached-read, and output tokens without low-value comparison or contributor chrome.
- Observable success: Six equal cache-aware summary peers lead Analytics; one readable open-top Tokens/Cost daily line follows; visible `Detailed usage` provides exact contextual evidence; Run details remains semantically intact but visually coherent; all truth states remain explicit; CSV export and all other rejected presentation are absent.
- In-scope surfaces and journeys: Analytics populated/partial/full/cost/filter/detail states, coverage/pricing/cache/loading/empty/error states, narrow response, localization, Settings manual navigation resize, and Run details Task/Model paths.
- Non-goals: Any backend, GraphQL, persistence, accounting, migration, pricing, quota, budget, forecast, alert, new analytics dimension, historical backfill, other Settings redesign, automatic navigation behavior, export replacement, or production architecture prescription.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| `BEH-001`; `REQ-001`; `AC-014` | Present Analytics and Run details as one coherent professional Settings surface using the active application language. | `UXJ-001`, `UXJ-005`; `UIS-001`, `UIS-005` |
| `REQ-002`; `REQ-016`; `AC-001`; `AC-016` | Render six equal summary peers in the fixed order Total, Uncached, Cached, Output, Cost, Cache hit; emphasize Total without extra width and preserve exact cache semantics. | `UXJ-001`, `UXJ-007`; `UIS-002` |
| `BEH-002`; `REQ-003`; `AC-002` | Use a compact UTC range / Filters / Tokens-Cost toolbar and explicit Runtime/Provider/Model Apply/Clear panel; no export action. | `UXJ-002`, `UXJ-004`; `UIS-001`, `UIS-003` |
| `REQ-004`; `AC-003` | Render no prior-period percentage, message, series, pace chart, comparison-unavailable state, contributor callout, or success-colored consumption increase. | All Analytics journeys and states |
| `REQ-005`; `REQ-015`; `AC-004`; `AC-015` | Use one open-top daily Tokens/Cost line with explicit left/bottom axes, metric-aware Y title, legible scale/ticks, 29 point markers in the monthly fixture, one midpoint guide, and exact accessible buckets. | `UXJ-001`, `UXJ-002`; `UIS-004` |
| `REQ-006`; `AC-005`; `AC-006` | Keep `Detailed usage` visible below the trend with visible grouping and row disclosure; never use `driver` terminology or a standalone contributor hierarchy. | `UXJ-003`; `UIS-004` |
| `REQ-007`; `REQ-008`; `AC-007`; `AC-008` | Apply consistent slate/blue/emerald/amber/rose semantic styling, compact locale-aware summaries, and authoritative exact on-page values. | All surfaces; English and Simplified Chinese states |
| `REQ-009`; `AC-002`; `AC-005` | Reflow without page-level clipping as the manually controlled Settings content width narrows; contain necessary exact-table overflow. | `UXJ-004`; narrow and resized states |
| `BEH-004`; `REQ-010`; `AC-009` | Keep loading, error, empty, uncovered, coverage, pricing, mixed-currency, and local/no-bill states calm, truthful, non-stale, and recoverable. | `UXJ-006`; `UIS-006` |
| `REQ-011`; `AC-007`; `AC-010` | Preserve semantic tabs, named controls/radiogroups/disclosures, logical focus, visible focus, live status, non-color cues, and exact chart/table alternatives. | All journeys; especially `UXJ-002`, `UXJ-004` |
| `REQ-012`; `AC-011` | Preserve UTC presets/custom validation, filters, metric, one-result coherence, truth semantics, and exact on-page evidence; remove every CSV control/action/file/request path without replacement. | `UXJ-001`–`UXJ-004`, `UXJ-006` |
| `BEH-005`; `REQ-013`; `AC-012` | Lightly unify Run-details shell, typography, spacing, controls/states, tables, and Task/Model placement while preserving creation-time selection and lifetime totals, hierarchy, sorting, expansion, costs, and migration guidance. | `UXJ-005`; `UIS-005` |
| `REQ-014`; `AC-013` | Keep the selected navigation item as orientation; do not add a large in-content title or automatically alter Settings navigation width. | `UXJ-001`, `UXJ-004`; `UIS-001` |

## Production-Quality Experience And Visual Specification

- Existing product language to preserve: Existing AutoByteus Settings shell, tab treatment, Tailwind-based rounded surfaces, slate neutrals, blue selection/action color, existing localization system, and established resizable navigation.
- Information hierarchy: Tabs orient first; a compact control toolbar defines the current query; six equal summary peers answer the current-period questions; the daily trend answers when usage occurred; visible `Detailed usage` supplies secondary exact identity/accounting evidence; Run details remains a sibling investigation flow.
- Navigation and orientation: `Analytics` is selected by default; `Run details` is always available as a sibling tab. The Settings navigation item remains the only page title. No redundant large content heading appears.
- Grid, dimensions, layout, spacing, and density:
  - Main Analytics and Run-details content uses a `1600px` maximum width and responsive `16/20/24px` outer padding.
  - Main surfaces use `16px` radii, `slate-200` one-pixel borders, white fill, and restrained small shadows.
  - Summary uses one-pixel dividers and equal peers: 2 columns below 720px container width, 3 from 720px, and 6 from 1040px. Each metric cell has at least 128px height.
  - Trend chart is 270px high on desktop and 205px at narrow width; its Y-label gutter is 56px desktop / 46px narrow.
  - Exact tables use contained horizontal overflow and minimum widths only within their own surface; the page itself must not overflow horizontally.
- Typography, font assets, sizes, weights, line heights, and wrapping: Preserve the application font stack. Use 11px bold uppercase tracking for compact labels/table headers, 12–14px support text, 16px section headings, 24px peer values, and 36px Total value. Use tabular numerals for quantities and cost. Supporting definitions wrap rather than truncate; the main displayed metric may truncate only with its full value in `title`.
- Color values and semantic roles: `slate-950/900` primary text; `slate-600/500` secondary text; `slate-200/100/50` structure; `blue-700/600/500` primary metric, series, actions, and focus; `emerald-800/50` full coverage; `amber-900/200/50` partial/unpriced/mixed warnings; `rose-700` validation errors. Status meaning always includes text.
- Surfaces, borders, radii, shadows, and elevation: Use flat white cards with single borders and subtle shadows. Do not reintroduce a generic card for every metric or a visually dominant coverage banner. The plot has left and bottom axes only; no top ceiling/border.
- Controls, icons, imagery, and media assets: Use labeled native/select/date controls and compact segmented controls. `Filters` is a named button with active count/context. The filter panel contains Runtime, Provider, Model and explicit Apply/Clear. There is no Export CSV control and no replacement icon/action. No decorative imagery is introduced.
- Hover, active, focus, selected, disabled, validation, and feedback treatment: Blue selected state with text and/or `aria-checked`; slate hover fill for rows; 2px blue focus rings; disabled/loading opacity and cursor; amber or rose text/surface for errors; focus returns to the Filters trigger when the panel closes.
- Motion, easing, duration, and reduced-motion behavior: No decision-critical animation. Small control/chevron transitions may use existing short product transitions; loading may use the existing spinner. Reduced-motion must not remove meaning.

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related Behavior / Requirement / AC IDs |
| --- | --- | --- | --- | --- | --- |
| `UXJ-001` / `SCN-001` | Token-usage viewer, populated partial coverage | Analytics, This month, all usage, Tokens | Understand current totals, cache composition, daily usage, and coverage | Six peers, 29-point trend, and visible Detailed usage are understood without rejected chrome | `REQ-001`–`REQ-005`, `REQ-012`, `REQ-015`, `REQ-016`; `AC-001`–`AC-004`, `AC-011`, `AC-015`, `AC-016` |
| `UXJ-002` / `SCN-002` | Token-usage viewer, complete cost | Populated Analytics | Compare Tokens and Cost for the same applied result | Same daily chart changes to authoritative currency units and truthful cost evidence | `REQ-004`, `REQ-005`, `REQ-007`, `REQ-012`; `AC-003`, `AC-004`, `AC-011` |
| `UXJ-003` / `SCN-003` | Evidence-oriented user | Multiple identity rows | Filter, regroup, and open exact evidence | Contextual Runtime/Provider/Model evidence and exact token/cost components are visible | `REQ-003`, `REQ-006`, `REQ-012`; `AC-002`, `AC-005`, `AC-006`, `AC-011` |
| `UXJ-004` / `SCN-004` | Keyboard/touch user at constrained width | Wide navigation or 390px viewport | Use controls, chart, detail, and tabs without clipping | Primary tasks remain named, readable, and usable; contained table overflow remains accessible | `REQ-003`, `REQ-009`, `REQ-011`, `REQ-014`; `AC-002`, `AC-005`, `AC-010`, `AC-013` |
| `UXJ-005` / `SCN-005` | Run investigator | Analytics selected | Inspect Task/Model lifetime usage | Lightly unified Run-details table or hierarchy is available with unchanged semantics | `REQ-001`, `REQ-013`; `AC-012` |
| `UXJ-006` / `SCN-006` | User/system | Loading, empty, uncovered, error, partial pricing, mixed, or local state | Understand truth and recover where applicable | State is explicit, non-stale, and action remains adjacent | `REQ-010`–`REQ-012`; `AC-009`, `AC-010` |
| `UXJ-007` / `SCN-007` | Cache accounting viewer | Positive, zero-reported, not-reported, unsupported/local, or unknown | Interpret cache efficiency without invented values | Percentage appears only when authoritative; otherwise truthful text; cache write remains secondary exact evidence | `REQ-016`; `AC-016` |

## Journey Details

### UXJ-001 — Scan current usage

1. Open Settings > Token Statistics. `Analytics` is selected and focus/order remains logical.
2. Review UTC range, `Filters`, Tokens/Cost, and applied context in the compact toolbar.
3. Scan the fixed six-peer summary row in order. Total receives blue 36px emphasis but no extra width.
4. Read coverage and pricing support text without losing the primary numbers.
5. Interpret the daily line from explicit Y and X axes. At the validated month, exactly 29 markers and five desktop UTC ticks represent the daily buckets.
6. Continue directly to visible `Detailed usage`; no separate contributor, pace, ratio, comparison, or export surface intervenes.

### UXJ-002 — Switch metric

1. Activate `Cost` in the metric radiogroup.
2. Keep the same applied query/filter context.
3. Change the Y title to `Cost (USD)` or the authoritative comparable currency, update scale labels and point/tooltips/exact bucket values, and retain one line.
4. When monetary buckets are unsafe, show the explanatory state rather than plotting zero.

### UXJ-003 — Filter and inspect exact evidence

1. Open `Filters`; Runtime, Provider, and Model fields become visible with Apply and Clear.
2. Apply one or more values. The trigger shows active count/context and one coherent result refreshes.
3. In `Detailed usage`, select Runtime + model, Runtime, Provider, or Model.
4. Open a row through its `Details` disclosure. Show Uncached input, Cached input, Cache write, Total input, Output, Thinking included, cost status, and currency.
5. Closing the filter disclosure by keyboard returns focus to `Filters`.

### UXJ-004 — Constrained width

1. Resize Settings navigation manually or use a 390px viewport.
2. Toolbar controls wrap without page overflow. Summary peers reflow equally while preserving order.
3. Trend retains left/bottom axes, Y unit, 29 markers, and three essential UTC ticks at narrow width.
4. Dense exact tables scroll only within their bordered surface.

### UXJ-005 — Run details

1. Activate `Run details`.
2. Choose creation-date start/end values; validation prevents missing or inverted ranges.
3. Choose Task or Model next to `Fetch Statistics`, then fetch.
4. Task preserves hierarchical expansion, sorting, lifetime totals, Team rows, cost evidence, and state guidance. Model preserves its current columns without an unsupported `Runs` count.
5. The visible helper explains that date selection is by run creation time and returned totals are lifetime totals.

### UXJ-006 / UXJ-007 — Truth states

Render loading, error/retry, covered-empty, uncovered, partial/full coverage, missing/partial pricing, mixed currency, local/no-bill, and all cache states with text and non-color cues. Never invent a zero cost or zero cache rate; never leave stale values appearing current after a failed/new selection.

## Screen And Surface Specification

| Surface ID | Purpose | Entry Conditions | Structure And Hierarchy | Important States | Primary Actions | Exit / Next Action | Visual IDs |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `UIS-001` Analytics shell/toolbar | Orient and define the current result | Token Statistics opens | Tabs, compact query controls, applied context; no content title/export | Default, custom validation, filters open/applied | Change range, open/apply/clear filters, Tokens/Cost | Summary and trend update coherently | `VIS-009`, `VIS-010`, `VIS-012`, `VIS-015` |
| `UIS-002` Summary | Answer current total/cost/cache composition | Populated result | Coverage context above six equal peers; Total typographically primary | Full/partial/uncovered; complete/partial/mixed/local; five cache states | Scan/read exact/support text | Trend | `VIS-009`, `VIS-012`, `VIS-015`; state variants `FPV-013/014` |
| `UIS-003` Filter disclosure | Configure Runtime/Provider/Model | `Filters` activated | Three labeled fields with Apply/Clear | Empty, active count, keyboard close | Apply, clear, close | Coherent result / trigger focus | `VIS-010` |
| `UIS-004` Trend and Detailed usage | Show daily series and exact evidence | Populated result | One open-top line, exact bucket disclosure, visible Detailed usage and grouping | Tokens, Cost, unavailable Cost, grouping, row open | Switch metric, open buckets/details, regroup | Run details or further investigation | `VIS-009`, `VIS-011`, `VIS-012`, `VIS-015` |
| `UIS-005` Run details | Investigate run lifetime usage | Run details tab | Date creation controls, Task/Model beside Fetch, helper, unified state/table | Loading, error/migration, empty, Task, Team expanded, Model | Fetch, group, sort, expand | Return to Analytics | `VIS-013`, `VIS-014`; state variants `FPV-010`–`FPV-012` |
| `UIS-006` Result states | Preserve trust/recovery | Query lifecycle/state fixture | Calm bordered status or skeleton, explicit text/action | Loading, error, empty, unavailable, pricing/local/mixed/cache variants | Retry or alter query | Valid result | `VIS-009`, `VIS-012`; deterministic state evidence `FPV-013/014` |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| `TR-001` Analytics default | Choose UTC preset | Selection updates and result loads | Applied preset result | One local synthetic query result; UTC fixed | Inspect or change controls |
| `TR-002` Toolbar | Choose Custom | Date fields and validation appear | Valid custom range or inline error | Local selection only | Apply/correct/close |
| `TR-003` Toolbar | Open Filters | Named panel opens | Runtime/Provider/Model visible | Draft filter values | Apply/Clear/Escape |
| `TR-004` Filters | Apply | Panel closes; focus returns; count/context updates | Coherent filtered result | Local fixture projection | Inspect summary/trend/detail |
| `TR-005` Filters | Clear | Values clear and result refreshes | All tracked usage | Local fixture projection | Refilter |
| `TR-006` Analytics | Tokens/Cost | Selected segment changes | Same trend in selected metric | Presentation state only; no extra request required | Inspect exact buckets |
| `TR-007` Detailed usage | Change grouping | Header/rows regroup | Contextual grouped evidence | Local grouping projection | Open a row |
| `TR-008` Detailed usage row | Details | `aria-expanded` and chevron update | Exact component evidence row appears | Disclosure state only | Hide details |
| `TR-009` Tabs | Run details | Selected tab changes | Unified Run-details surface | Existing run fixture | Fetch/group/inspect |
| `TR-010` Run details | Fetch valid dates | Loading state | Task or Model results | Synthetic local query by creation time | Sort/expand/switch grouping |
| `TR-011` Run details | Missing/inverted date | Inline alert | Request is not run | No state mutation | Correct date |
| `TR-012` Error | Retry | Loading feedback | Current valid result or repeated error | Synthetic resettable query | Continue or revise query |

## State Behavior

| Surface / State | Trigger | Required Presentation And Message | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Analytics / full coverage | Full range within coverage | Compact green `Full coverage` badge and tracking date | Normal controls | Change range/filter | `VIS-010`, `VIS-012` |
| Analytics / partial coverage | Range begins before coverage | Compact amber `Partial coverage`, tracking date, and partial pricing text if applicable | Normal controls | Narrow range/filter | `VIS-009`, `VIS-015` |
| Analytics / uncovered | Range predates coverage | Truthful unavailable message; no fabricated totals/comparison | Change range/filter | Choose covered range | `FPV-014` deterministic evidence |
| Analytics / loading | Applied query starts | Skeleton/busy state and live announcement; no stale result presented as current | Wait | Result/error | Validation evidence only unless final capture selected |
| Analytics / error | Fixture/query failure | Calm actionable error with Retry | Retry/change query | New result | Validation evidence only unless final capture selected |
| Analytics / covered empty | Valid covered result contains no usage | Explicit empty explanation | Change range/filter | New result | Validation evidence only unless final capture selected |
| Cost / partial or missing | Incomplete pricing | Cost marked partial/unpriced with invoice disclaimer; never invented zero | Switch metric/change context | Comparable result | `VIS-009`; `FPV-014` |
| Cost / mixed currency | Non-comparable currencies | `Mixed`/currency-unavailable text; unsafe line is not plotted | Switch Tokens/filter | Comparable result | Validation evidence only unless final capture selected |
| Cost / local | Local usage | `Local · no API bill`; no `$0` invention | Switch metric/filter | Other usage | Validation evidence only unless final capture selected |
| Cache / positive or zero-reported | Authoritative rate present | Exact percentage plus cached/total input support | Inspect detail | Change query | `VIS-009`, `VIS-012`; zero state `FPV-013` |
| Cache / not reported, unsupported, unknown | Authoritative percentage absent | `Not reported`, `Not supported`, or `Unknown`; never synthetic `0%` | Inspect exact detail | Change query | Validation evidence |
| Run details / migration error | History migration required | Localized actionable guidance without internal error token | Follow guidance/change range | Valid data | Validation evidence |

## Responsive And Platform Behavior

- Desktop validation uses Chromium at a representative 1440px-wide viewport. Six equal summary peers appear when the summary container is at least 1040px.
- Manually narrower Settings content reflows the summary to three or two equal peers without altering navigation automatically.
- Narrow validation uses 390×844. The page document remains 390px wide; toolbar wraps, summary uses two equal peers, trend uses a 46px Y gutter and three visible UTC ticks, and exact tables scroll internally.
- Web and browser-mode prototype surfaces define this visual package. Existing Electron-visible Settings shell behavior is preserved by the accepted baseline; the final feature adds no Electron-native capability.

## Accessibility And Keyboard Behavior

- Analytics/Run details remain semantic tabs; Tokens/Cost and Task/Model remain named radiogroups.
- Range, Filters, Apply, Clear, Details, Retry, and fetch/date controls have meaningful programmatic names and visible focus treatment.
- Escape closes the focused disclosure and returns focus to its trigger.
- Coverage/pricing/cache/error meaning is expressed in text and not by color alone.
- The daily chart is focusable and exposes every exact bucket in its accessible name; an on-page exact bucket table remains available.
- `Detailed usage` row buttons expose `aria-expanded` and controlled detail rows; hover is never required.
- There is no Export CSV control or export action in the accessibility tree.

## Content, Labels, Validation, And Feedback

- Use `Total tokens`, `Uncached input`, `Cached input`, `Output`, `Estimated API cost`, and `Cache hit rate` in that order.
- `Uncached input` support text: “Standard/cache-miss-rate input; excludes cached reads and cache writes.” This value maps only to `standardInputTokens`.
- Use `Usage over time`, `Daily points · exact buckets remain available`, `Tokens`, `Cost`, `Cost (<currency>)`, `Date (UTC)`, `Exact bucket data`, and `Detailed usage`.
- Use `Runtime + model`, `Runtime`, `Provider`, and `Model` for exact-evidence grouping.
- Do not use `Dominant driver`, `Usage drivers`, any user-facing `driver` term, prior/previous/comparison messaging, Input/Output ratio, Export CSV, or replacement export/report/share/download language.
- Custom date validation prevents missing or inverted ranges. Run-details helper text must preserve creation-time selection and lifetime-total meaning.
- English and Simplified Chinese remain within the existing localization boundary; numbers/dates/currencies use locale-aware formatting and UTC dates.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | Prototype Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Analytics result | Summary, coverage, trend, filters, exact rows | Deterministic local object with one-result coherence | Reuse current approved result/query semantics; no contract change authorized |
| `standardInputTokens` | Uncached input | Rendered directly with precise standard/cache-miss definition | Must remain distinct from cache reads and cache writes |
| Cache state/rate | Cache hit card | Positive/zero percentage or truthful unavailable text from fixture state | Reuse authoritative server state; never compute a false zero |
| Daily buckets | Line/chart accessibility | 29 deterministic monthly buckets with exact text/table | Reuse existing chronological buckets and quality/currency rules |
| Cost quality/currency | Cost card/line/rows | Complete, partial, missing, mixed, and local fixtures | No price/accounting/conversion change authorized |
| Filters/grouping | Query context and exact evidence | Local deterministic projection and grouping | Production continues existing filter/query behavior |
| Run details | Task/Model tables | Local deterministic creation-time query/lifetime totals | Production continues existing query/store semantics and migration guidance |
| CSV/export | None | UI, accessibility action, utility, object URL, click, file, and request path are absent | Production must remove the former local CSV control/functionality; no replacement |
| Runtime/services | Entire prototype | Browser-only local fixtures; no backend/Electron/persistence | Production architecture is owned downstream and is not prescribed here |

## Final Visual Reference Inventory

`VIS-009`–`VIS-015` were captured from the approved runnable only after the
explicit user approval above and after post-approval validation. They are the
normative final references. Earlier `VIS-001`–`VIS-008` remain exploratory
RV-007 history and are not final normative images. Files under
`review-evidence/` remain non-normative review aids.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| `VIS-009` | `UXJ-001` / `SCN-001`; Analytics partial coverage, Tokens | 1440×900 | `visual-references/VIS-009-final-analytics-partial-desktop-1440x900.png` | Compact toolbar; six equal peers/order/emphasis; partial coverage/pricing; open-top 29-point line; no comparison/driver/ratio/export. Maps `REQ-001`, `REQ-002`, `REQ-004`, `REQ-005`, `REQ-009`, `REQ-012`, `REQ-015`, `REQ-016`; `AC-001`, `AC-003`, `AC-004`, `AC-013`, `AC-015`, `AC-016`. | Dates, values, provider/model identities are illustrative. |
| `VIS-010` | `UXJ-003` / `SCN-003`; focused Filters open | 1440×900 | `visual-references/VIS-010-final-analytics-filters-open-desktop-1440x900.png` | Named Filters trigger; Runtime/Provider/Model; Apply/Clear; applied context; responsive compact control hierarchy. Maps `REQ-003`, `REQ-009`, `REQ-011`, `REQ-012`; `AC-002`, `AC-010`, `AC-011`. | Option values are illustrative; fields/actions are normative. |
| `VIS-011` | `UXJ-003` / `SCN-003`; Detailed usage Provider grouping, row expanded | 1440×900 browser context; cropped surface | `visual-references/VIS-011-final-detailed-usage-expanded-desktop-1440x900.png` | Visible neutral section/grouping; identity/token/cost/share rows; Uncached/Cached/Cache write/Total input/Output/Thinking exact disclosure; local truth. Maps `REQ-006`, `REQ-008`, `REQ-009`, `REQ-011`, `REQ-012`, `REQ-016`; `AC-005`, `AC-006`, `AC-008`, `AC-010`, `AC-011`, `AC-016`. | Row names and amounts are illustrative; fields, disclosure hierarchy, and state semantics are normative. |
| `VIS-012` | `UXJ-002` / `SCN-002`; Analytics full coverage, Cost (USD) | 1440×900 | `visual-references/VIS-012-final-analytics-cost-full-desktop-1440x900.png` | Same six-peer hierarchy; Cost selection; metric-aware `Cost (USD)` Y title/scale; one line; complete estimate; no prior series. Maps `REQ-002`, `REQ-004`, `REQ-005`, `REQ-007`, `REQ-008`, `REQ-012`, `REQ-015`, `REQ-016`; `AC-001`, `AC-003`, `AC-004`, `AC-007`, `AC-008`, `AC-011`, `AC-015`, `AC-016`. | USD values/dates are illustrative; currency-aware behavior is normative. |
| `VIS-013` | `UXJ-005` / `SCN-005`; Run details Task, Team expanded | 1440×900 | `visual-references/VIS-013-final-run-details-task-expanded-desktop-1440x900.png` | Unified shell/spacing/control/table; Task beside Fetch; creation-time/lifetime helper; hierarchy/cost disclosure; contained table overflow. Maps `REQ-001`, `REQ-009`, `REQ-011`, `REQ-013`, `REQ-014`; `AC-010`, `AC-012`, `AC-013`. | Task/Team/run names, dates, and values are illustrative; semantics/hierarchy are normative. |
| `VIS-014` | `UXJ-005` / `SCN-005`; Run details Model | 1440×900 | `visual-references/VIS-014-final-run-details-model-desktop-1440x900.png` | Model grouping beside Fetch; model table styling and cost/cache evidence; no unsupported Runs count. Maps `REQ-001`, `REQ-009`, `REQ-011`, `REQ-013`, `REQ-014`; `AC-010`, `AC-012`, `AC-013`. | Model/runtime names and values are illustrative; visible columns and absence of Runs are normative. |
| `VIS-015` | `UXJ-004` / `SCN-004`; Analytics partial coverage, narrow | 390×844 | `visual-references/VIS-015-final-analytics-partial-narrow-390x844.png` | Manual Settings shell policy; wrapped compact controls; two equal summary peers; fixed order/readability; no page-level overflow. Maps `REQ-002`, `REQ-003`, `REQ-009`, `REQ-011`, `REQ-014`, `REQ-015`, `REQ-016`; `AC-001`, `AC-002`, `AC-005`, `AC-010`, `AC-013`, `AC-015`, `AC-016`. | Fixture values are illustrative; 6→3→2 reflow and narrow readability are normative. |

The machine-readable hashes, capture conditions, and exact ID mappings are in
`visual-references/final-reference-manifest.json`.

## Linked Prototype Evidence

- Runnable prototype: `http://127.0.0.1:3261/settings?section=token-usage`
- Prototype ticket record: `prototype-ticket.md`
- Run instructions: `prototype-runbook.md`
- Behavior evidence: `ui-behavior-test-matrix.md` and `validation/final-prototype/browser-validation.json`
- Relevant supporting prototype artifacts: `prototype-assumptions.md`, `prototype-change-log.md`, `experience-story.md`, baseline report, feasibility audit, and prior RV-007 review record.
- Relevant journeys/scenarios: `UXJ-001`–`UXJ-007`; `SCN-001`–`SCN-007`; `FPV-001`–`FPV-019`.
- Mocked boundaries and limitations: Browser-local synthetic fixtures and simulated query transitions; no production services, persistence, credentials, customer data, production writes, Electron runtime, or export path.

## Implementation Fidelity Boundary

- Exact behavior and visible design implementation must preserve: The stated hierarchy, fixed summary order/equality, labels, support text, chart geometry/point/tick rules, control naming/placement, visible Detailed usage, Run-details semantics, truth states, responsive behavior, focus/accessibility behavior, localization boundary, and complete CSV absence.
- Prototype-only state, fixtures, and simulated mechanisms that do not prescribe production architecture: LocalStorage scenario selection, deterministic fixtures, local grouping/filter projection, scripted delays/errors, and browser-only host context.
- Fixture content or visible details explicitly allowed to vary: Illustrative dates, counts, costs, provider/model/runtime/task/Team names, exact row order when valid data sorts differently, and number of rows. Field meanings, state labels, six-column order, and interaction behavior may not vary.
- Permitted responsive or platform variation: Summary may reflow 6→3→2 equal peers; the narrow trend may reduce nonessential X ticks 5→3; contained table scrolling is allowed. Core facts/actions may not disappear.
- Existing design-system constraints: Use the active AutoByteus application font, icons, localization, focus language, slate/blue token family, Settings shell, and manual navigation policy rather than a new brand.

## Out Of Scope

Backend/GraphQL/persistence/accounting/pricing changes; quota/budget/forecast/alerts; new Analytics dimensions; live Token Meter/other Settings redesign; historical reconstruction; automatic navigation collapse; redundant page title; visible comparison/contributor/driver/ratio presentation; CSV or replacement export/report/share/download; unsupported Run-details fields.

## Open Decisions And Risks

- Product behavior decisions: None; `DEC-001`–`DEC-009` are resolved.
- Process gate: None. The actual final runnable is explicitly approved.
- Production risk for downstream implementation: Preserve one-result/query semantics and exact/cost/cache truth while refactoring presentation; ensure the local CSV path is completely removed without adding requests; implement the approved open-top chart accessibly in the production charting stack.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Prototype repository/root, source pin, and prototype revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes — primary page, controls, exact evidence, both Run-details groupings, and narrow layout are captured; deterministic secondary state variants are linked through validation`
- Prototype, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes — visually inspected after capture; dense table overflow is intentionally contained as specified`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Prototype-repository artifact and visual-reference paths agree with this specification: `Yes`
