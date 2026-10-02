import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useProjectDesignStore, workspaceChoices } from '../project-review/useProjectDesignStore'

describe('Project review synthetic state', () => {
  beforeEach(() => setActivePinia(createPinia()))
  it('allows creating without any workspace', () => {
    const store = useProjectDesignStore()
    const saved = store.save({ name: 'Review', description: '', workspaces: [] })
    expect(saved.workspaces).toEqual([])
    expect(store.createdIds).toContain(saved.projectId)
  })
  it('keeps independent workspace descriptions', () => {
    const store = useProjectDesignStore()
    const links = workspaceChoices.map((workspace, index) => ({ ...workspace, description: `Role ${index}`, addedAt: '2026-08-22T04:00:00.000Z', availability: 'AVAILABLE' as const }))
    const saved = store.save({ name: 'Review', description: '', workspaces: links })
    expect(saved.workspaces.map(workspace => workspace.description)).toEqual(['Role 0', 'Role 1'])
  })
  it('edits the same Project identity without replacing task status', () => {
    const store = useProjectDesignStore()
    const original = store.projectById('project-prototype-launch')!
    const saved = store.save({ projectId: original.projectId, name: 'Edited', description: '', workspaces: original.workspaces })
    expect(saved.projectId).toBe(original.projectId)
    expect(saved.openTaskCount).toBe(2)
    expect(store.createdIds).toEqual([])
  })
  it('starts a fresh resettable fixture on a new store instance', () => {
    const store = useProjectDesignStore()
    store.save({ name: 'Review', description: '', workspaces: [] })
    setActivePinia(createPinia())
    expect(useProjectDesignStore().createdIds).toEqual([])
    expect(useProjectDesignStore().projects).toHaveLength(1)
  })
})
