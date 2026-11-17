import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Stand-in for the product's run status store. Only the peer Retry is simulated: it waits for the other node's answer
 * ("Checking {node}…"), and the reference's remote node stays down, so the answer does not change anything.
 */
export const useRunStatusStore = defineStore('runStatus', () => {
  const checking = ref<Record<string, true>>({})
  const isChecking = (runId: string): boolean => Boolean(checking.value[runId])
  const retryPeers = (runIds: readonly string[]): void => {
    checking.value = { ...checking.value, ...Object.fromEntries(runIds.map((runId) => [runId, true as const])) }
    window.setTimeout(() => {
      const next = { ...checking.value }
      for (const runId of runIds) delete next[runId]
      checking.value = next
    }, 1500)
  }
  return { checking, isChecking, retryPeers }
})
