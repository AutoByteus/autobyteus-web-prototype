export type TokenUsageAnalyticsRangePreset = 'THIS_MONTH' | 'LAST_MONTH' | 'LAST_3_MONTHS' | 'LAST_12_MONTHS' | 'CUSTOM';
export type TokenUsageAnalyticsMetric = 'TOKENS' | 'COST';
export type TokenUsageAnalyticsGrouping = 'RUNTIME_MODEL' | 'RUNTIME' | 'PROVIDER' | 'MODEL';

// The pinned presentation consumes a GraphQL-shaped result. The prototype
// intentionally keeps that visible shape fixture-native rather than importing
// the production generated client or schema.
export type TokenUsageAnalyticsResult = any;
export type TokenUsageAnalyticsBreakdownRow = any;

export interface TokenUsageAnalyticsSelection {
  rangePreset: TokenUsageAnalyticsRangePreset;
  startDate: string;
  endDate: string;
  runtimeKind: string | null;
  providerKey: string | null;
  modelKey: string | null;
}
