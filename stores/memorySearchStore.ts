import { defineStore } from 'pinia';
import {
  ACTIVE_MODEL,
  initialIndexStatus,
  scriptedSearch,
  type IndexStatus,
  type SearchOutcome,
  type StepId,
} from '~/prototype/memory-search/memoryDesignFixture';

/**
 * Memory search and the memory index, as the Memory page sees them (work-journal-search, design-only).
 * The search and the pipeline are scripted under the interface: a cue is answered from fixed topics and the
 * index steps advance on a timer. The page depends only on the result fields and the step states shown.
 */
export type SearchStatus = 'idle' | 'loading' | 'ready' | 'error';
/** The three tabs of the Memory page. */
export type MemorySection = 'search' | 'browse' | 'index';

interface MemorySearchState {
  query: string;
  status: SearchStatus;
  outcome: SearchOutcome | null;
  error: string | null;
  /** How much of memory the search read when it ran. */
  coverage: { textPct: number; meaningPct: number } | null;
  index: IndexStatus | null;
  requestId: number;
}

const SCENARIO_KEY = 'autobyteus.prototype.scenario';
const scenarioName = (): string => {
  try { return localStorage.getItem(SCENARIO_KEY) || 'populated'; } catch { return 'populated'; }
};

const ORDER: StepId[] = ['runs', 'journals', 'text', 'meaning'];
/** Items one 400 ms tick finishes per step (accelerated: the real first build takes about an hour). */
const TICK_SIZE: Record<StepId, number> = { runs: 700, journals: 170, text: 320, meaning: 48 };
let timer: ReturnType<typeof setInterval> | null = null;

const pct = (done: number, total: number) => (total ? Math.floor((done / total) * 100) : 0);

export const useMemorySearchStore = defineStore('memorySearchStore', {
  state: (): MemorySearchState => ({ query: '', status: 'idle', outcome: null, error: null, coverage: null, index: null, requestId: 0 }),

  getters: {
    step: (state) => (id: StepId) => state.index?.steps.find(s => s.id === id) ?? null,
    textPct(): number { const s = this.step('text'); return s ? pct(s.done, s.total) : 0; },
    meaningPct(): number { const s = this.step('meaning'); return s ? pct(s.done, s.total) : 0; },
    /** Search reads the text index: it works as soon as any journal is in it. */
    searchReady(): boolean { return (this.step('text')?.done ?? 0) > 0; },
    isBuilding: (state) => state.index?.phase === 'building',
    modelChanged: (state) => !!state.index && state.index.phase === 'ready' && !!state.index.builtWithModel && state.index.builtWithModel !== state.index.activeModel,
  },

  actions: {
    /** Seeds the starting state for the scenario once per page load; a running index keeps going. */
    loadIndexStatus() {
      if (this.index) return;
      this.index = initialIndexStatus(scenarioName());
      if (this.index.phase === 'building') this.startTicking();
    },

    startIndex() {
      if (!this.index || this.isBuilding) return;
      this.index.phase = 'building';
      this.index.steps.forEach((s) => { if (s.state === 'failed') { s.state = 'waiting'; s.message = null; } });
      this.startTicking();
    },

    rebuild() {
      if (!this.index || this.isBuilding) return;
      this.index.steps.forEach((s) => { s.state = 'waiting'; s.done = 0; s.message = null; });
      this.index.builtWithModel = null;
      this.index.updatedAt = null;
      this.index.phase = 'building';
      this.startTicking();
    },

    startTicking() {
      if (timer) clearInterval(timer);
      this.advance();
      timer = setInterval(() => this.advance(), 400);
    },

    advance() {
      const index = this.index;
      if (!index || index.phase !== 'building') { if (timer) { clearInterval(timer); timer = null; } return; }
      const current = index.steps.find(s => s.state !== 'done');
      if (!current) { this.finish(); return; }
      current.state = 'running';
      current.done = Math.min(current.total, current.done + TICK_SIZE[current.id]);
      if (current.done >= current.total) {
        current.state = 'done';
        if (ORDER.every(id => index.steps.find(s => s.id === id)?.state === 'done')) this.finish();
      }
    },

    finish() {
      if (!this.index) return;
      this.index.phase = 'ready';
      this.index.builtWithModel = ACTIVE_MODEL;
      this.index.updatedAt = new Date().toISOString();
      if (timer) { clearInterval(timer); timer = null; }
    },

    async runSearch(cue: string) {
      const query = cue.trim();
      this.query = query;
      if (!query) { this.clearSearch(); return; }
      const requestId = ++this.requestId;
      this.status = 'loading';
      this.error = null;
      await new Promise<void>(done => setTimeout(done, 450));
      if (requestId !== this.requestId) return;
      if (scenarioName() === 'memory_search_fails') {
        this.status = 'error';
        this.error = 'The search could not be completed.';
        return;
      }
      this.outcome = scriptedSearch(query, 10);
      this.coverage = { textPct: this.textPct, meaningPct: this.meaningPct };
      this.status = 'ready';
    },

    clearSearch() {
      this.requestId += 1;
      this.query = '';
      this.status = 'idle';
      this.outcome = null;
      this.error = null;
      this.coverage = null;
    },
  },
});
