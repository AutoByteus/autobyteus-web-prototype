import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProjectTask } from '~/types/project'
import { useProjectDesignStore } from './useProjectDesignStore'

const fixtureDate = '2026-08-22T04:00:00.000Z'
const projectId = 'project-prototype-launch'
export interface TaskContextFile {
  id: string
  name: string
  size: number
  type: 'Image' | 'Audio' | 'File'
  /** Browser-local object URL only; never a server upload or persisted file. */
  previewUrl?: string
}
export type TaskReviewRecord = ProjectTask & { attachments: TaskContextFile[] }
// Handwritten illustrative values matching the accepted board's three states.
const baselineTasks: TaskReviewRecord[] = [
  { taskId: 'task-outline', projectId, description: 'Outline the launch checklist.', status: 'TODO', createdAt: fixtureDate, updatedAt: fixtureDate, attachments: [] },
  { taskId: 'task-review', projectId, description: 'Review the synthetic navigation baseline.', status: 'IN_PROGRESS', createdAt: fixtureDate, updatedAt: fixtureDate, attachments: [] },
  { taskId: 'task-publish', projectId, description: 'Publish the deterministic evidence summary.', status: 'DONE', createdAt: fixtureDate, updatedAt: fixtureDate, attachments: [] },
]

export const useTaskDesignStore = defineStore('taskDesignReview', () => {
  const scenario = typeof window === 'undefined' ? 'populated' : (localStorage.getItem('autobyteus.prototype.scenario') || 'populated')
  const tasks = ref<TaskReviewRecord[]>(scenario === 'empty' ? [] : structuredClone(baselineTasks))
  const searchByProject = ref<Record<string, string>>({})
  let nextId = 1
  const tasksFor = (id: string) => tasks.value.filter(task => task.projectId === id)
  const taskById = (id: string, taskId: string) => tasksFor(id).find(task => task.taskId === taskId) ?? null
  const syncCount = (id: string) => {
    const project = useProjectDesignStore().projectById(id)
    if (project) project.openTaskCount = tasksFor(id).filter(task => task.status !== 'DONE').length
  }
  const create = (id: string, description: string, attachments: TaskContextFile[] = []) => {
    const task: TaskReviewRecord = { taskId: `task-review-created-${nextId++}`, projectId: id, description, status: 'TODO', createdAt: fixtureDate, updatedAt: fixtureDate, attachments: attachments.map(file => ({ ...file })) }
    tasks.value = [task, ...tasks.value]
    syncCount(id)
    return task
  }
  const update = (id: string, taskId: string, description: string, attachments?: TaskContextFile[]) => {
    const current = taskById(id, taskId)
    if (!current) return null
    const task = { ...current, description, attachments: (attachments ?? current.attachments ?? []).map(file => ({ ...file })) }
    tasks.value = [task, ...tasks.value.filter(item => item !== current)]
    return task
  }
  const remove = (id: string, taskId: string) => {
    tasks.value = tasks.value.filter(task => task.projectId !== id || task.taskId !== taskId)
    syncCount(id)
  }
  const forget = (id: string) => {
    tasks.value = tasks.value.filter(task => task.projectId !== id)
    delete searchByProject.value[id]
  }
  // Memory-only UI simulation: no status transition, agent execution or backend.
  return { tasks, searchByProject, tasksFor, taskById, create, update, remove, forget }
})
