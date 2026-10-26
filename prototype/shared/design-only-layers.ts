/**
 * Accepted design-only changes with no source equivalent (today: agent-definition-reconnect-ui)
 * are part of the baseline and on by default. Source-versus-baseline comparison runs turn their
 * synthetic data off with this local-storage key, because the pinned source has no such surface.
 * It is evidence infrastructure: no visible control sets it.
 */
export const DESIGN_ONLY_LAYERS_KEY = 'autobyteus.prototype.designOnlyLayers'

export const designOnlyLayersEnabled = (): boolean => {
  try { return localStorage.getItem(DESIGN_ONLY_LAYERS_KEY) !== 'off' } catch { return true }
}

/**
 * The Reconnect layer on its own: comparison runs of surfaces the source now ships with their example data (the remote runs of the
 * Project Task Manager run) keep that data on and this layer off (`autobyteus.prototype.designOnlyLayers` = `no-reconnect`).
 */
export const reconnectLayerEnabled = (): boolean => {
  try { return !['off', 'no-reconnect'].includes(localStorage.getItem(DESIGN_ONLY_LAYERS_KEY) ?? '') } catch { return true }
}
