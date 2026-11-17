/**
 * Design layer of autobyteus-458 (change a run's runtime and model from the phone). Every runtime, model, limit and time here
 * is invented and illustrative. The node's answers are scripted: a run's current selection is held in memory per run, a model
 * marked `limit` cannot run now, and `refusedUntilRefresh` models answer the node's plain refusal on the first Save.
 */
import { computed, reactive } from 'vue';

export interface RunModel { id: string; name: string; detail?: string; limit?: { until: string | null }; refusedUntilRefresh?: boolean }
export interface RunRuntime { id: string; name: string; models: RunModel[] }

export const RUN_RUNTIMES: RunRuntime[] = [
  {
    id: 'claude_code', name: 'Claude Code',
    models: [
      { id: 'cc-opus', name: 'Opus', detail: 'Most capable', limit: { until: '3:40 pm' } },
      { id: 'cc-sonnet', name: 'Sonnet', detail: 'Balanced' },
      { id: 'cc-haiku', name: 'Haiku', detail: 'Fast and light' },
      { id: 'cc-sonnet-old', name: 'Sonnet (earlier version)', detail: 'Being retired', refusedUntilRefresh: true },
    ],
  },
  {
    id: 'codex', name: 'Codex',
    models: [
      { id: 'cx-large', name: 'Codex Large', detail: 'Longest tasks' },
      { id: 'cx-mini', name: 'Codex Mini', detail: 'Quick edits', limit: { until: null } },
    ],
  },
  {
    id: 'autobyteus', name: 'AutoByteus',
    models: [
      { id: 'ab-a', name: 'Orion 4 Pro', detail: 'Provider: Orion' },
      { id: 'ab-b', name: 'Orion 4 Mini', detail: 'Provider: Orion' },
      { id: 'ab-c', name: 'Lumen 2 Large', detail: 'Provider: Lumen' },
    ],
  },
  { id: 'gemini_cli', name: 'Gemini CLI', models: [{ id: 'gm-1', name: 'Gemini Pro', detail: 'Limit reached for today', limit: { until: 'tomorrow 9:00 am' } }] },
];

export const runtimeOf = (id: string): RunRuntime | undefined => RUN_RUNTIMES.find((runtime) => runtime.id === id);
export const modelOf = (runtimeId: string, modelId: string): RunModel | undefined => runtimeOf(runtimeId)?.models.find((model) => model.id === modelId);
/** A runtime with no model that can run now. */
export const runtimeBlocked = (id: string): { until: string | null } | null => {
  const models = runtimeOf(id)?.models ?? [];
  const limited = models.filter((model) => model.limit);
  return models.length && limited.length === models.length ? limited[0]!.limit! : null;
};

const SESSION_KEY = 'autobyteus.prototype.runModelSelections';
const stored = (): Record<string, { runtime: string; model: string }> => {
  try { return JSON.parse(window.sessionStorage.getItem(SESSION_KEY) || '{}'); } catch { return {}; }
};
const selections = reactive<Record<string, { runtime: string; model: string }>>(typeof window === 'undefined' ? {} : stored());
const refreshed = reactive<Record<string, boolean>>({});

/** The run's current selection; a run with none yet starts on Claude Code · Opus (the model whose limit is out). */
export function useRunModelSelection(runId: () => string) {
  const current = computed(() => selections[runId()] ?? { runtime: 'claude_code', model: 'cc-opus' });
  const save = (runtime: string, model: string): { ok: true } | { ok: false; message: string } => {
    const chosen = modelOf(runtime, model);
    if (chosen?.refusedUntilRefresh && !refreshed[`${runtime}:${model}`]) {
      return { ok: false, message: `“${chosen.name}” is not offered by ${runtimeOf(runtime)?.name} now. Refresh the model list and choose again.` };
    }
    selections[runId()] = { runtime, model };
    try { window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(selections)); } catch { /* memory only */ }
    return { ok: true };
  };
  /** The node's list is read again: a model it no longer offers disappears. */
  const refreshList = (runtime: string): void => { for (const model of runtimeOf(runtime)?.models ?? []) if (model.refusedUntilRefresh) refreshed[`${runtime}:${model.id}`] = true; };
  const isOffered = (runtime: string, model: RunModel): boolean => !(model.refusedUntilRefresh && refreshed[`${runtime}:${model.id}`]);
  return { current, save, refreshList, isOffered };
}

/** Runs stopped from the phone this session (the opened run then shows Stopped, not Running again). */
const stopped = reactive<Record<string, boolean>>({});
export const hasBeenStopped = (runId: string): boolean => Boolean(stopped[runId]);
export const markStopped = (runId: string): void => { stopped[runId] = true; };
