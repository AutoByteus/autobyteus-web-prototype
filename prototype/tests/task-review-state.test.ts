import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useProjectDesignStore } from '../project-review/useProjectDesignStore'
import { useTaskDesignStore } from '../project-review/useTaskDesignStore'

describe('Task page review synthetic state', () => {
  beforeEach(() => setActivePinia(createPinia()))
  it('keeps all three accepted board states', () => {
    expect(useTaskDesignStore().tasksFor('project-prototype-launch').map(task => task.status)).toEqual(['TODO', 'IN_PROGRESS', 'DONE'])
  })
  it('creates a To Do task with all description lines and updates the visible count', () => {
    const projects = useProjectDesignStore()
    const project = projects.save({ name: 'Review', description: '', workspaces: [] })
    const tasks = useTaskDesignStore()
    const task = tasks.create(project.projectId, 'Summary\nExpected outcome')
    expect(task.status).toBe('TODO')
    expect(tasks.taskById(project.projectId, task.taskId)?.description).toBe('Summary\nExpected outcome')
    expect(project.openTaskCount).toBe(1)
  })
  it('edits description without changing identity or status', () => {
    const tasks = useTaskDesignStore()
    const previous = tasks.taskById('project-prototype-launch', 'task-review')!
    const edited = tasks.update(previous.projectId, previous.taskId, 'Edited\nFull detail')!
    expect(edited.taskId).toBe(previous.taskId)
    expect(edited.status).toBe('IN_PROGRESS')
    expect(edited.createdAt).toBe(previous.createdAt)
  })
  it('deletes only the selected task and keeps other projects intact', () => {
    const tasks = useTaskDesignStore()
    const created = tasks.create('another-project', 'Other work')
    tasks.remove('project-prototype-launch', 'task-outline')
    expect(tasks.tasksFor('project-prototype-launch')).toHaveLength(2)
    expect(tasks.taskById('another-project', created.taskId)).not.toBeNull()
    expect(useProjectDesignStore().projectById('project-prototype-launch')?.openTaskCount).toBe(1)
  })
  it('retains per-project search and resets records on a fresh session', () => {
    const tasks = useTaskDesignStore()
    tasks.searchByProject['project-prototype-launch'] = 'launch'
    tasks.create('project-prototype-launch', 'Temporary work')
    expect(tasks.searchByProject['project-prototype-launch']).toBe('launch')
    setActivePinia(createPinia())
    expect(useTaskDesignStore().tasks).toHaveLength(3)
    expect(useTaskDesignStore().searchByProject).toEqual({})
  })
})
