/**
 * Design layer of autobyteus-458 (Settings of a run on the phone). The runtimes and models are the New run screen's own (the same
 * stores and rows, so names and lists are the product's everywhere); this file only holds what the node would decide, scripted:
 * which runs were stopped from the phone, and the node's refusal when the starting state `mobile_settings_refused` is set
 * (`localStorage` `autobyteus.prototype.scenario`).
 */
import { reactive } from 'vue';

const stopped = reactive<Record<string, boolean>>({});
/** Runs stopped from the phone this session (the opened run then shows Stopped, not Running again). */
export const hasBeenStopped = (runId: string): boolean => Boolean(stopped[runId]);
export const markStopped = (runId: string): void => { stopped[runId] = true; };

/** The node answers Save with its plain refusal (scenario `mobile_settings_refused`). */
export const saveIsRefused = (): boolean => {
  try { return window.localStorage.getItem('autobyteus.prototype.scenario') === 'mobile_settings_refused'; } catch { return false; }
};
