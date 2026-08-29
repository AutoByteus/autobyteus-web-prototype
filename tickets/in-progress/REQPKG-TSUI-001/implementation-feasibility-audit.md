# Token Statistics Visualization — Current-Contract Feasibility Audit

- Package / ticket ID: `REQPKG-TSUI-001`
- Audit revision: `FA-001`
- Visualization revision assessed: `RV-004`
- Audit date: 2026-08-29
- Source authority: `origin/personal` at `9d0fd7c570d58da1af2c7a40279327c8a20a8093`
- Classification: `Achievable with the current source-pin data and GraphQL contracts after one unsupported illustrative column was removed`

## Conclusion

The remaining proposed Token Statistics presentation does not require a new
backend field, GraphQL operation, persistence model, accounting calculation,
or historical backfill. Its visible facts are either already returned by the
current analytics and Run-details queries or are deterministic client-side
formatting/ranking calculations already present in the source frontend.

This conclusion is about **data and contract feasibility**. `RV-003` remains an
exploratory Requirements Visualization, not a complete implementation-ready
prototype. A final prototype/implementation must still exercise every existing
loading, error, empty, coverage, pricing, local, mixed-currency, comparison,
custom-date, sorting, and localization behavior instead of copying the
visualizer's fixed fixture.

## Current Contract Mapping

| Proposed UI fact or action | Current source-pin authority | Feasibility rule |
| --- | --- | --- |
| UTC preset/custom range and applied period | `TokenUsageAnalyticsInputGraphql`; `appliedRange`; `TokenUsageAnalyticsRangePolicy`; `stores/tokenUsageAnalytics.ts` | Reuse current input, validation, and fixed UTC conversion; layout may change. |
| Runtime/provider/model filters and active context | `filterOptions`, `appliedFilters`, current analytics store selection | Populate and summarize the current query options; no new filter dimension. |
| Total, input, output, and estimated cost | `selectedAggregate` and `TokenUsageCostSummaryAggregateFields` | Format existing exact fields; never recompute accounting from rounded chart values. |
| Coverage and tracking start | `coverage.status`, `coverage.coverageStart` | Restyle current FULL/PARTIAL/UNAVAILABLE truth; never infer pre-coverage zero. |
| Price quality, currency, local/no-bill, and missing dimensions | `selectedCostQuality`, row/bucket `costQuality`, aggregate `apiCostStatus` | Preserve current nullable/status-aware rendering. |
| Per-active-day value | `activeDayCount` plus `selectedAggregate.totalTokens` | Current result already returns the authoritative active-day count. |
| Prior absolute/percentage change and no-comparison state | `comparisonAggregate`, `comparisonCoverage`, `comparisonCostQuality`, `comparisonRange` | Current frontend already derives delta/percentage only when coverage/value/currency are comparable. |
| Usage trend and current/prior pace | `trendBuckets`, `comparisonBuckets`, bucket aggregate/cost quality | Recompose current bucket data; exact accessible bucket evidence remains required. |
| Dominant driver and ranked drivers | `breakdownRows`, row aggregate, `tokenUsageBreakdownShare` | No new query. Token view may use server token ordering; cost view must rank client-side by comparable cost rather than blindly taking row zero. |
| Runtime/model/provider identity | Breakdown row identity and display-name fields | Reuse current display projection; do not hard-code production names. |
| Primary exact tokens/cost/share and secondary input/output/cache/reasoning/status/currency | Breakdown row `aggregate` plus `costQuality` | All proposed disclosure fields exist in the current aggregate fragment. |
| Grouping choices | Current `RUNTIME_MODEL`, `RUNTIME`, `PROVIDER`, `MODEL` UI grouping | Continue current client-side grouping over one coherent result. |
| Local CSV | `serializeTokenUsageAnalyticsCsv` / `downloadTokenUsageAnalyticsCsv` | Keep current exact rows, context, and local Blob download; visual feedback may change. |
| Run-details Task/Model, dates, hierarchy, model diagnostics, and costs | Existing Run-details GraphQL queries, `TokenUsageTaskStatisticsRow`, `TokenUsageRuntimeModelStatisticsRow`, and current table components | Visual restyling only; creation-time selection and lifetime totals remain distinct from Analytics. |
| Manual Settings navigation width | Existing Settings shell/resizer | CSS/layout responsiveness only; no data or automatic collapse change. |

## Unsupported Item Found And Corrected

The initial exploratory Run-details model table displayed a `Runs` count. The
current `TokenUsageRuntimeModelStatisticsRow` and
`GET_TOKEN_USAGE_STATISTICS` contract do **not** return an authoritative run
count. Deriving it from hierarchical task rows could double-count and would not
be a safe presentation-only change.

`RV-003` removes that column and its illustrative values. Browser validation
`VAL-015` now asserts that the model view exposes only current-contract fields:
Runtime/Model, Input, Output, Cache read, Thinking, and Total cost.

## Source Evidence

- Analytics query: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/autobyteus-web/graphql/queries/token_usage_analytics_queries.ts`
- Aggregate fragment: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/autobyteus-web/graphql/queries/token_usage_cost_summary_fragment.ts`
- Analytics store and UTC/coherence behavior: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/autobyteus-web/stores/tokenUsageAnalytics.ts`
- Current presentation derivations: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/autobyteus-web/utils/tokenUsageAnalyticsPresentation.ts`
- Current exact CSV: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/autobyteus-web/utils/tokenUsageAnalyticsCsv.ts`
- Server result and sorted breakdown: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/autobyteus-server-ts/src/token-usage/providers/token-usage-analytics-provider.ts`
- Server domain result: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/autobyteus-server-ts/src/token-usage/domain/token-usage-analytics.ts`
- Run-details queries: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/autobyteus-web/graphql/queries/token_usage_run_statistics_queries.ts`
- Run-details types: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/autobyteus-web/types/tokenUsageRunStatistics.ts`
- Preserved visible-field truth contract: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/tickets/done/token-statistics-analytics/token-usage-analytics-data-contract.md`

All source-code evidence above was audited at the required pin, not from the
Requirements commit as an alternate current-experience authority.

Machine-readable-style validation log:
`/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/validation/contract-feasibility-audit.txt`
records the resolved source pin, required analytics/aggregate/Run-details field
checks, server token-breakdown ordering, and absence of the unsupported column;
result `PASS`.

## Implementation Guardrails

1. Bind the approved presentation to the current Pinia stores and generated
   GraphQL types; do not transplant the visualizer's hard-coded fixture.
2. Keep a single analytics query result coherent across summary, charts,
   breakdown, exact evidence, filters, grouping, and export.
3. Derive compact values, percentages, shares, and dominant-driver ranking
   client-side only from exact returned values, with current comparability and
   currency rules.
4. Preserve the current pace/comparison evidence even where the focused
   exploratory first view reduces unavailable comparison to concise context.
5. Preserve current Custom validation, retry, loading, empty, uncovered,
   partial/full, mixed-currency, local/no-bill, sorting, expansion, exact CSV,
   localization, and accessibility behavior.
6. Treat any future design request for a field outside the mapped contracts as
   Requirement Impact before implementation; do not silently invent it.
