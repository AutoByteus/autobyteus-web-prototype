import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useMobileRunTreeStore } from '~/stores/mobileRunTreeStore'

/**
 * Stand-in for the product's run list store ("Your runs": which top-level runs are rows, and the fold over the runs
 * beyond the newest five). The product builds it from the node's run history; here the invented world is the history.
 */
export const useRunListStore = defineStore('runList', () => {
  const world = useMobileRunTreeStore()
  const entries = computed(() => world.runs.map((node) => ({ key: `${node.kind}:${node.id}`, runId: node.id, kind: node.kind })))
  const olderEntries = computed(() => world.older)
  const shownEntries = computed(() => world.shown)
  const olderShown = computed(() => world.olderShown)
  const setOlderShown = (shown: boolean): void => { world.olderShown = shown && world.older.length > 0 }
  const showRun = (runId: string): void => {
    if (!world.olderShown && world.older.some((node) => node.id === runId)) world.olderShown = true
  }
  const entryOf = (runId: string) => entries.value.find((entry) => entry.runId === runId) ?? null
  return { entries, olderEntries, shownEntries, olderShown, setOlderShown, showRun, entryOf }
})
