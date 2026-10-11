import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CopyTask } from '~/composables/projects/useDelegatedCopyTask'
import { useProjectsPanelStore } from '~/stores/projectsPanelStore'

/**
 * delegated-copy-task-locator (design): "Show Task in Projects" from a delegated copy's Task summary in
 * the Workspaces tree.
 *
 * `locate` records one request; the surfaces it touches respond to it:
 * - the workspace tool shell reveals the right panel on the Projects tab (docked, or the drawer);
 * - the Projects tab chooses the Task's Project (or Temp tasks) and shows its board;
 * - the board makes the Task visible (clears a search that hides it, shows the Cancelled lane for a
 *   Cancelled Task, shows all Done Temp tasks when it is past the first ten);
 * - the Task's card scrolls into view, takes focus and is highlighted.
 * Each surface handles a request once (`handled`), so remounting does not repeat it. A Task card handles
 * it per card instance while the request is fresh, so a card re-created by a board reload still shows it.
 */
export type TaskLocateRequest = Readonly<{
  seq: number
  /** When it was made; a card that mounts later acts on it only while it is fresh. */
  at: number
  taskId: string
  status: string
  choice: CopyTask['choice']
}>

export const useTaskLocatorStore = defineStore('taskLocator', () => {
  const request = ref<TaskLocateRequest | null>(null)
  const handled = ref<Record<string, number>>({})
  let seq = 0

  const locate = (target: CopyTask) => {
    useProjectsPanelStore().choose(target.choice)
    request.value = Object.freeze({ seq: ++seq, at: Date.now(), taskId: target.task.taskId, status: target.task.status, choice: target.choice })
  }

  /** True once per request and surface: the caller should act on it now. */
  const take = (surface: string, current: TaskLocateRequest | null): current is TaskLocateRequest => {
    if (!current || handled.value[surface] === current.seq) return false
    handled.value = { ...handled.value, [surface]: current.seq }
    return true
  }

  /** A card created up to this long after the request still scrolls to and highlights its Task. */
  const FRESH_MS = 3000
  const isFresh = (current: TaskLocateRequest) => Date.now() - current.at < FRESH_MS

  return { request, locate, take, isFresh }
})
