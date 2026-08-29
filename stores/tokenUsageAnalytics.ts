import { defineStore } from 'pinia';
import { createTokenUsageAnalyticsResult } from '~/prototype/shared/token-statistics-refresh-fixture.js';
import type {
  TokenUsageAnalyticsRangePreset,
  TokenUsageAnalyticsResult,
  TokenUsageAnalyticsSelection,
} from '~/types/tokenUsageAnalytics';

const DAY_MS = 86_400_000;
const dateOnly = (date: Date): string => date.toISOString().slice(0, 10);
const utcToday = (): Date => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};
const monthStart = (date: Date, offset = 0): Date => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1));

export const rangeDatesForPreset = (preset: TokenUsageAnalyticsRangePreset): Pick<TokenUsageAnalyticsSelection, 'startDate' | 'endDate'> => {
  const today = utcToday();
  if (preset === 'LAST_MONTH') {
    return { startDate: dateOnly(monthStart(today, -1)), endDate: dateOnly(new Date(monthStart(today).getTime() - DAY_MS)) };
  }
  if (preset === 'LAST_3_MONTHS') return { startDate: dateOnly(monthStart(today, -2)), endDate: dateOnly(today) };
  if (preset === 'LAST_12_MONTHS') return { startDate: dateOnly(monthStart(today, -11)), endDate: dateOnly(today) };
  return { startDate: dateOnly(monthStart(today)), endDate: dateOnly(today) };
};

const defaultSelection = (): TokenUsageAnalyticsSelection => ({
  rangePreset: 'THIS_MONTH',
  ...rangeDatesForPreset('THIS_MONTH'),
  runtimeKind: null,
  providerKey: null,
  modelKey: null,
});

const scenario = (): string => typeof window === 'undefined'
  ? 'populated'
  : localStorage.getItem('autobyteus.prototype.scenario') || 'populated';
const toIsoStart = (date: string): string => `${date}T00:00:00.000Z`;
const toIsoEndExclusive = (date: string): string => new Date(Date.parse(`${date}T00:00:00.000Z`) + DAY_MS).toISOString();

interface TokenUsageAnalyticsState {
  selection: TokenUsageAnalyticsSelection;
  result: TokenUsageAnalyticsResult | null;
  loading: boolean;
  error: string | null;
  requestSequence: number;
  filterOptions: TokenUsageAnalyticsResult['filterOptions'];
}

export const useTokenUsageAnalyticsStore = defineStore('tokenUsageAnalytics', {
  state: (): TokenUsageAnalyticsState => ({
    selection: defaultSelection(),
    result: null,
    loading: false,
    error: null,
    requestSequence: 0,
    filterOptions: { runtimeKinds: [], providers: [], models: [] },
  }),
  actions: {
    setPreset(preset: TokenUsageAnalyticsRangePreset): void {
      this.selection.rangePreset = preset;
      if (preset !== 'CUSTOM') Object.assign(this.selection, rangeDatesForPreset(preset));
    },
    clearFilters(): void {
      this.selection.runtimeKind = null;
      this.selection.providerKey = null;
      this.selection.modelKey = null;
    },
    async fetch(): Promise<void> {
      const sequence = ++this.requestSequence;
      const selectedScenario = scenario();
      this.loading = true;
      this.error = null;
      this.result = null;
      try {
        if (selectedScenario === 'loading') await new Promise(resolve => window.setTimeout(resolve, 1_500));
        if (selectedScenario === 'error') throw new Error('Synthetic recoverable GraphQL failure.');
        const result = createTokenUsageAnalyticsResult({
          rangePreset: this.selection.rangePreset,
          startTime: toIsoStart(this.selection.startDate),
          endTimeExclusive: toIsoEndExclusive(this.selection.endDate),
          runtimeKind: this.selection.runtimeKind,
          providerKey: this.selection.providerKey,
          modelKey: this.selection.modelKey,
        }, selectedScenario) as TokenUsageAnalyticsResult;
        if (sequence === this.requestSequence) {
          this.result = result;
          this.filterOptions = result.filterOptions;
        }
      } catch (error) {
        if (sequence === this.requestSequence) this.error = error instanceof Error ? error.message : 'Unknown analytics error';
        throw error;
      } finally {
        if (sequence === this.requestSequence) this.loading = false;
      }
    },
  },
});
