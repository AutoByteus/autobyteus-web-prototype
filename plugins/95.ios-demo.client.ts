import { defineNuxtPlugin } from '#app'
import type { Pinia } from 'pinia'
import { demoModelNames, isIosDemo } from '~/prototype/ios-demo/iosDemo'
import { demoAgentStopped } from '~/prototype/ios-demo/iosDemoActions'
import { useAgentRunStore } from '~/stores/agentRunStore'

/**
 * ios-demo-mode-279 (design layer): scripted outcomes of the demo's actions that the reference otherwise leaves silent,
 * and the demo's sample names. Only active while the iOS app's demo is open.
 * - Stop in a demo conversation: the agent stops working and is Idle, on its screen and in the run list.
 * - The agents' default models and New run's choice name the demo's sample models (the demo makes no model request).
 */
const NAMED_STORES = new Set(['agentDefinition', 'agentTeamDefinition', 'agentRunConfig'])

/** Renames the reference's placeholder models in a store's plain values (Maps and Sets are left alone). */
function renameModels(store: { $state: Record<string, unknown>; $patch: (patch: Record<string, unknown>) => void }): void {
  const patch: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(store.$state)) {
    if (!value || typeof value !== 'object' || value instanceof Map || value instanceof Set) continue
    let text = ''
    try { text = JSON.stringify(value) } catch { continue }
    if (!text.includes('-prototype')) continue
    patch[key] = demoModelNames(JSON.parse(text))
  }
  if (Object.keys(patch).length) store.$patch(patch)
}

export default defineNuxtPlugin((nuxtApp) => {
  if (!isIosDemo()) return
  useAgentRunStore().$onAction(({ name, args, after }) => {
    if (name !== 'interruptGeneration') return
    const runId = String(args[0] ?? '')
    after(() => { window.setTimeout(() => demoAgentStopped(runId), 300) })
  })
  const pinia = nuxtApp.$pinia as Pinia & { _s: Map<string, any> }
  pinia.use(({ store }) => {
    if (!NAMED_STORES.has(store.$id)) return
    renameModels(store)
    store.$onAction(({ after }: { after: (fn: () => void) => void }) => after(() => renameModels(store)))
  })
  for (const store of pinia._s.values()) {
    if (!NAMED_STORES.has(store.$id)) continue
    renameModels(store)
    store.$onAction(({ after }: { after: (fn: () => void) => void }) => after(() => renameModels(store)))
  }
})
