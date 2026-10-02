import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useProjectDesignStore } from '../project-review/useProjectDesignStore'
import { useTaskDesignStore } from '../project-review/useTaskDesignStore'
import { mergeTranscriptWithDraft } from '../../utils/voiceInputCapture'

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
  it('saves attachment metadata and retains it when editing text only', () => {
    const tasks = useTaskDesignStore()
    const attachments = [{ id: 'context-review', name: 'review-note.txt', size: 80, type: 'File' as const }]
    const task = tasks.create('project-prototype-launch', 'Review the note', attachments)
    attachments[0].name = 'Draft-only replacement'
    expect(task.attachments[0].name).toBe('review-note.txt')
    expect(tasks.update(task.projectId, task.taskId, 'Updated description')!.attachments[0].name).toBe('review-note.txt')
  })
  it('removes context files on save without changing task status or identity', () => {
    const tasks = useTaskDesignStore()
    const task = tasks.create('project-prototype-launch', 'Review', [{ id: 'file', name: 'note.txt', size: 30, type: 'File' }])
    const edited = tasks.update(task.projectId, task.taskId, 'Review', [])!
    expect(edited.attachments).toEqual([])
    expect(edited.taskId).toBe(task.taskId)
    expect(edited.status).toBe('TODO')
  })
  it('uses the agent input transcript-merge behavior without overwriting typed text', () => {
    expect(mergeTranscriptWithDraft('Typed detail', 'Voice detail')).toBe('Typed detail Voice detail')
    expect(mergeTranscriptWithDraft('', ' Voice detail ')).toBe('Voice detail')
    expect(mergeTranscriptWithDraft('Typed detail', '')).toBe('Typed detail')
  })
})
