/**
 * task-run-resources-workspace-cleanup (design review only): the alternatives the reviewer can
 * compare for DEC-001 (how rows leave) and DEC-005 (an open worker conversation at DONE).
 * The proposal is the default; the alternatives exist only to be compared during review.
 */
import { reactive, watch } from 'vue'

const KEY = 'autobyteus.design.taskRunCleanup.options'

export type RemovalStyle = 'fade' | 'instant'
export type OpenConversationAtDone = 'manager' | 'notice'

const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} } })()

export const reviewOptions = reactive<{ removal: RemovalStyle; openConversation: OpenConversationAtDone }>({
  removal: saved.removal === 'instant' ? 'instant' : 'fade',
  openConversation: saved.openConversation === 'notice' ? 'notice' : 'manager',
})

watch(reviewOptions, () => localStorage.setItem(KEY, JSON.stringify(reviewOptions)), { deep: true })
