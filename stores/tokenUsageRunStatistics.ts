import { defineStore } from 'pinia';
import { createTokenUsageRunStatistics } from '~/prototype/shared/token-statistics-refresh-fixture.js';
import type {
  TokenUsageRuntimeModelStatisticsRow,
  TokenUsageTaskStatisticsRow,
} from '~/types/tokenUsageRunStatistics';

interface TokenUsageStatisticsState {
  taskRows: TokenUsageTaskStatisticsRow[];
  modelRows: TokenUsageRuntimeModelStatisticsRow[];
  loading: boolean;
  error: string | null;
}

const scenario = (): string => typeof window === 'undefined'
  ? 'populated'
  : localStorage.getItem('autobyteus.prototype.scenario') || 'populated';

export const useTokenUsageRunStatisticsStore = defineStore('tokenUsageRunStatistics', {
  state: (): TokenUsageStatisticsState => ({
    taskRows: [],
    modelRows: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchStatistics(_startTime: string, _endTime: string): Promise<void> {
      this.loading = true;
      this.error = null;
      const selectedScenario = scenario();
      try {
        if (selectedScenario === 'loading') await new Promise(resolve => window.setTimeout(resolve, 1_500));
        if (selectedScenario === 'error') throw new Error('Synthetic recoverable GraphQL failure.');
        const fixture = createTokenUsageRunStatistics(selectedScenario);
        this.taskRows = fixture.taskRows as TokenUsageTaskStatisticsRow[];
        this.modelRows = fixture.modelRows as TokenUsageRuntimeModelStatisticsRow[];
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An unknown error occurred';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {
    getTaskRows: (state): TokenUsageTaskStatisticsRow[] => state.taskRows,
    getModelRows: (state): TokenUsageRuntimeModelStatisticsRow[] => state.modelRows,
    isLoading: (state): boolean => state.loading,
    getError: (state): string | null => state.error,
  },
});
