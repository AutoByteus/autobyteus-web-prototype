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
