import { computed, type ComputedRef } from 'vue'
import { useProjectStore } from '~/stores/projectStore'
import { TEMP_TASKS_LIST_ID, useProjectTaskStore } from '~/stores/projectTaskStore'
import type { ProjectTask, TaskWithoutProject } from '~/types/project'
import { isOpenTaskStatus } from '~/utils/projects/taskStatusPresentation'

/**
 * delegated-copy-task-locator (design): the Task a delegated copy is working on.
 *
 * A copy is an agent copy (its AgentRun) or a team copy (its TeamRun; its members share the team's
 * Task). A Task's root names the copy it was handed to (`ingressAgentRunId`, `teamRunId`). A copy
 * that was given a follow-up Task is the root of several Tasks; its current Task is the open one
 * (To Do / In Progress) updated last, else the one updated last.
 *
 * In the UI reference the lookup reads the same Task lists the Projects tab shows. Production may
 * read the copy's assignment from the server instead; only the visible result is specified.
 */
export type CopyRef = Readonly<{ agentRunId: string } | { teamRunId: string }>
export type CopyTask = Readonly<{
  task: ProjectTask | TaskWithoutProject
  /** The Projects tab choice that shows the Task. */
  choice: Readonly<{ kind: 'project'; projectId: string } | { kind: 'temp' }>
}>

let loadStarted = false

export const useDelegatedCopyTasks = () => {
  const projects = useProjectStore()
  const tasks = useProjectTaskStore()

  const ensureLoaded = () => {
    if (loadStarted) return
    loadStarted = true
    void tasks.fetchTasks(TEMP_TASKS_LIST_ID).catch(() => undefined)
    void projects.fetchProjects().then((list) => {
      for (const project of list) void tasks.fetchTasks(project.projectId).catch(() => undefined)
    }).catch(() => { loadStarted = false })
  }

  const allTasks = computed<CopyTask[]>(() => [
    ...projects.projects.flatMap((project) => (tasks.getList(project.projectId)?.tasks ?? [])
      .map((task) => ({ task, choice: { kind: 'project' as const, projectId: project.projectId } }))),
    ...(tasks.getTempList()?.tasks ?? []).map((task) => ({ task, choice: { kind: 'temp' as const } })),
  ])

  const taskFor = (copy: CopyRef | null): CopyTask | null => {
    if (!copy) return null
    const matches = allTasks.value.filter(({ task }) => {
      const root = task.root
      if (!root) return false
      return 'teamRunId' in copy ? root.teamRunId === copy.teamRunId : !root.teamRunId && root.ingressAgentRunId === copy.agentRunId
    })
    if (!matches.length) return null
    const latest = (list: CopyTask[]) => [...list].sort((a, b) => b.task.updatedAt.localeCompare(a.task.updatedAt))[0]!
    const open = matches.filter(({ task }) => isOpenTaskStatus(task.status))
    return latest(open.length ? open : matches)
  }

  return { ensureLoaded, taskFor }
}

/** The current Task of one copy, kept up to date with the Task lists. */
export const useDelegatedCopyTask = (copy: ComputedRef<CopyRef | null>): ComputedRef<CopyTask | null> => {
  const lookup = useDelegatedCopyTasks()
  lookup.ensureLoaded()
  return computed(() => lookup.taskFor(copy.value))
}
