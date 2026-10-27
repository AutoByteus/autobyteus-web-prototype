import { defineStore } from 'pinia';
import {
  journalFiles,
  journalLines,
  type JournalFileInfo,
} from '~/prototype/memory-search/memoryDesignFixture';

/**
 * The Work Journal view of one run (work-journal-search, design-only): a run's journal is several Markdown files and
 * a file can be several MB, so lines are read in windows around a line and shown one window at a time.
 */
export const JOURNAL_WINDOW = 300;

export interface JournalFocus {
  file: string;
  fromLine: number;
  toLine: number;
  cue?: string | null;
  kind?: 'text' | 'meaning' | null;
  /** The search words found in the matched lines (a text match); empty for a meaning match. */
  words?: string[] | null;
}

interface JournalState {
  runId: string | null;
  files: JournalFileInfo[];
  loading: boolean;
  error: string | null;
  selectedFile: string | null;
  from: number;
  to: number;
  lines: Array<{ n: number; text: string }>;
  focus: JournalFocus | null;
  /** Bumped on every jump so the view scrolls even when the same line is chosen again. */
  jump: { line: number; token: number } | null;
}

const delay = () => new Promise<void>(done => setTimeout(done, 140));

export const useMemoryJournalStore = defineStore('memoryJournalStore', {
  state: (): JournalState => ({ runId: null, files: [], loading: false, error: null, selectedFile: null, from: 1, to: 0, lines: [], focus: null, jump: null }),

  getters: {
    current: (state): JournalFileInfo | null => state.files.find(f => f.name === state.selectedFile) ?? null,
    /** Files that hold the matched lines, for the marker in the file list. */
    focusFile: (state): string | null => state.focus?.file ?? null,
  },

  actions: {
    async open(runId: string, focus: JournalFocus | null) {
      this.loading = true;
      this.error = null;
      this.runId = runId;
      this.focus = focus;
      await delay();
      this.files = journalFiles(runId);
      this.loading = false;
      if (!this.files.length) { this.selectedFile = null; this.lines = []; return; }
      const target = focus && this.files.some(f => f.name === focus.file) ? focus : null;
      this.selectedFile = target ? target.file : this.files[0].name;
      this.showAround(target ? target.fromLine : 1, !!target);
    },

    showAround(line: number, scroll: boolean) {
      const file = this.current;
      if (!file) return;
      const clamped = Math.min(Math.max(1, line), file.lines);
      const half = Math.floor(JOURNAL_WINDOW / 2);
      this.from = Math.max(1, clamped - half);
      this.to = Math.min(file.lines, this.from + JOURNAL_WINDOW - 1);
      this.from = Math.max(1, this.to - JOURNAL_WINDOW + 1);
      this.lines = journalLines(this.runId!, file.name, this.from, this.to);
      this.jump = { line: clamped, token: (this.jump?.token ?? 0) + 1 };
      if (!scroll) this.jump = { line: this.from, token: this.jump.token };
    },

    selectFile(name: string, line = 1) {
      if (!this.files.some(f => f.name === name)) return;
      this.selectedFile = name;
      this.showAround(line, line > 1);
    },

    gotoLine(line: number) {
      if (!Number.isFinite(line)) return;
      this.showAround(Math.round(line), true);
    },

    loadEarlier() {
      const file = this.current;
      if (!file || this.from <= 1) return;
      const from = Math.max(1, this.from - JOURNAL_WINDOW);
      this.lines = [...journalLines(this.runId!, file.name, from, this.from - 1), ...this.lines];
      this.from = from;
    },

    loadLater() {
      const file = this.current;
      if (!file || this.to >= file.lines) return;
      const to = Math.min(file.lines, this.to + JOURNAL_WINDOW);
      this.lines = [...this.lines, ...journalLines(this.runId!, file.name, this.to + 1, to)];
      this.to = to;
    },

    clear() {
      this.runId = null; this.files = []; this.selectedFile = null; this.lines = []; this.focus = null; this.error = null; this.jump = null;
    },
  },
});
