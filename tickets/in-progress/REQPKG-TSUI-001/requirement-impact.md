# Requirement Impact — User-Centered Token Statistics Priorities

- Package / ticket ID: `REQPKG-TSUI-001`
- Finding ID: `RI-001`
- Date: 2026-08-29
- Current visualization revision: `RV-006`
- Classification: `Requirement Impact`
- Status: User decision is represented in `RV-005`; Requirements Engineering must now revise the conflicting canonical requirements.

## User Resolution Received And Represented

The user has now made two of the product choices explicit:

1. Remove the `+28% from prior period` presentation and other visible
   prior-period comparison messaging from this hierarchy.
2. Remove the standalone `Dominant driver` presentation and stop using
   `driver` terminology because it is not intuitive.

`RV-005` implements those choices as exploratory evidence in both clean review
directions. Exact runtime/model identity evidence remains secondary under
`Detailed usage`; it is no longer described as a driver or elevated in a
standalone contributor card. This does not rewrite the canonical requirements
owned by Requirements Engineering.

`RV-006` is a presentation-only follow-up: it adds explicit X/Y axes to the
daily line and removes the confusing short vertical point guides. This uses the
same existing daily buckets and changes neither the Requirement Impact nor the
data contract.

## Exact User Feedback And Meaning

The user finds `Dominant driver` and `Usage drivers` difficult and
non-intuitive. Their actual first-view questions are:

1. How many tokens have I used this month?
2. How many tokens did I use on each day?
3. How much money did I spend in total and per day when Cost is selected?
4. How is token use composed: uncached/standard input, cached input, cache hit
   rate, and output?

The user considers cache rate especially important because it helps a
cost-sensitive user understand pricing efficiency. They question whether
prior-period percentage change and runtime/model contribution ranking deserve
any primary visibility.

## Current `Dominant driver` Semantics

`Dominant driver` is a Product visualization label, not a backend field. It is
the largest contribution row under the current metric/grouping **after the
current filters are applied**:

- with no filter, it is the largest contributor across all returned usage;
- with a Runtime/Provider/Model filter, it is the largest contributor only
  inside that filtered result;
- switching Tokens/Cost can change which contributor is largest;
- the underlying values come from existing `breakdownRows` and are not a new
  server fact.

That context dependence is part of why the term is not self-explanatory. The
same row already appears in the exact/ranked breakdown, so the standalone
first-view panel is also duplicative.

## Canonical Requirement Conflict

The feedback materially changes the current requirements rather than merely
restyling them:

| Current requirement | Conflict exposed by user feedback |
| --- | --- |
| `REQ-002`, `AC-001` require a dominant driver to be identifiable in the populated first view. | User does not consider this a primary question and finds the label unintuitive. |
| `REQ-004`, `REQ-005`, `AC-003`, `AC-004` preserve visible prior comparison and current/prior trend meaning. | User questions whether prior-period percentage comparison is useful at all. |
| `REQ-006`, `AC-005`, `AC-006` keep ranked usage-driver grouping and exhaustive identity evidence prominent/obtainable. | User considers runtime/model `driver` presentation secondary or irrelevant compared with token composition and cache efficiency. |
| `REQ-012`, `AC-011` preserve grouping/comparison behavior. | Requirements Engineering must decide whether the capability remains optional, moves behind disclosure, or is removed from this surface. |

Affected behavior/scenario references include `BEH-003`, `BEH-006`,
`SCN-001`–`SCN-004`, and decisions `DEC-001` and `DEC-003`.

## Data Feasibility Of The User's Preferred Metrics

The preferred first-view facts are available in the current source-pin
contract and do not require a backend change:

| User-facing metric | Current authoritative field/derivation |
| --- | --- |
| Total tokens | `selectedAggregate.totalTokens` |
| Total input | `selectedAggregate.grossInputTokens` |
| Uncached/standard input | `selectedAggregate.standardInputTokens` (label semantics must be confirmed) |
| Cached input | `selectedAggregate.cacheReadInputTokens` |
| Cache hit rate | `selectedAggregate.cacheReadInputTokenRate`, defined by the server as cached-read input divided by accounting/gross input |
| Output | `selectedAggregate.outputTokens` |
| Estimated spend | `selectedAggregate.estimatedApiTotalCost` plus current `selectedCostQuality` and currency rules |
| Daily tokens/cost | Current `trendBuckets`; `THIS_MONTH` uses `DAY` granularity |

Current `cacheState` also supports truthful positive, zero-reported,
not-reported, unsupported/local, and unknown presentation. The UI must not
invent `0%` when cache reporting is unavailable.

## Product Recommendation For Requirements Engineering To Resolve

1. Make monthly total tokens and estimated cost/status the primary summary.
2. Keep the point-marked daily line as the primary analytical view, with the
   existing Tokens/Cost switch.
3. Replace the standalone contributor panel with a compact token-composition
   summary: Total input, Cached input, Cache hit rate, and Output. If
   `Uncached input` is used, define it explicitly from the current contract.
4. Remove `driver` terminology from the primary surface. If identity evidence
   remains required, rename and move it behind a clear label such as
   `Detailed usage` or `Usage by runtime and model`.
5. Remove green success semantics from positive usage/cost change. If prior
   comparison remains, make it neutral and secondary or opt-in; Requirements
   Engineering must decide whether it remains a requirement at all.
6. Preserve exact CSV/accounting evidence and all current truth states even if
   identity breakdown is no longer on the first canvas.

## Remaining Decisions After `RV-005`

1. Which input label is canonical: `Uncached input`, `Standard input`, or a
   separately defined derived value?
2. Must Runtime/Provider/Model grouping remain user-facing, and if so, under
   what intuitive secondary label?
3. Should the remaining `Detailed usage` table stay visible below the trend or
   move behind another explicit disclosure?

Requirements Engineering must record the user-directed removal of prior
comparison and dominant-contributor presentation in the canonical requirements
before implementation work treats `RV-005` as authoritative. Product
Prototyper will not silently rewrite those requirements.
