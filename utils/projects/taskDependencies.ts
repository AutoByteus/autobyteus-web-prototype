import type { ProjectTask } from '~/types/project'

/**
 * task-keys-and-dependencies (design): "depends on" between Tasks of one Project. It informs and never
 * prevents work. It also records follow-ups ("B depends on A", often created after A is Done).
 */

/** The key's number (for ordering); 0 without a key. */
export const taskKeyNumber = (task: Pick<ProjectTask, 'taskKey'>): number => Number(String(task.taskKey ?? '').split('-').at(-1)) || 0
const byKey = (a: ProjectTask, b: ProjectTask) => taskKeyNumber(a) - taskKeyNumber(b)

/** The Tasks this Task depends on that still exist, in key order. */
export const dependenciesOf = (task: ProjectTask, tasks: readonly ProjectTask[]): ProjectTask[] => {
  const ids = new Set(task.dependsOnTaskIds ?? [])
  return tasks.filter((item) => ids.has(item.taskId) && item.taskId !== task.taskId).sort(byKey)
}

/** The Tasks that depend on this one ("Required by": derived, never stored), in key order. */
export const requiredByOf = (task: ProjectTask, tasks: readonly ProjectTask[]): ProjectTask[] =>
  tasks.filter((item) => item.taskId !== task.taskId && (item.dependsOnTaskIds ?? []).includes(task.taskId)).sort(byKey)

export type DependencyBadge =
  | { kind: 'blocked'; first: ProjectTask; more: number; all: ProjectTask[] }
  | { kind: 'cancelled'; first: ProjectTask; more: number; all: ProjectTask[] }

/**
 * The card badge of an open Task (To Do / In Progress):
 * - "Blocked by <key>" while any dependency is To Do or In Progress (+N for more open ones);
 * - otherwise "Dependency cancelled: <key>" when a dependency was cancelled;
 * - nothing when every dependency is Done, or for a Done / Cancelled Task.
 */
export const dependencyBadgeOf = (task: ProjectTask, tasks: readonly ProjectTask[]): DependencyBadge | null => {
  if (task.status === 'DONE' || task.status === 'CANCELLED') return null
  const all = dependenciesOf(task, tasks)
  const open = all.filter((item) => item.status === 'TODO' || item.status === 'IN_PROGRESS')
  if (open.length) return { kind: 'blocked', first: open[0]!, more: open.length - 1, all }
  const cancelled = all.filter((item) => item.status === 'CANCELLED')
  if (cancelled.length) return { kind: 'cancelled', first: cancelled[0]!, more: cancelled.length - 1, all }
  return null
}

/** Tasks that may not be chosen as this Task's dependency: itself and every Task that (in)directly depends on it. */
export const dependencyCycleIds = (taskId: string | undefined, tasks: readonly ProjectTask[]): Set<string> => {
  const blocked = new Set<string>()
  if (!taskId) return blocked
  blocked.add(taskId)
  let changed = true
  while (changed) {
    changed = false
    for (const item of tasks) {
      if (blocked.has(item.taskId)) continue
      if ((item.dependsOnTaskIds ?? []).some((id) => blocked.has(id))) { blocked.add(item.taskId); changed = true }
    }
  }
  return blocked
}
