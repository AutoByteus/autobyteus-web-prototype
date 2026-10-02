import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project, ProjectWorkspace } from '~/types/project'

// Hand-written, illustrative domain fixtures. Browser memory only; reload resets.
const fixtureDate = '2026-08-22T04:00:00.000Z'
export const workspaceChoices = [
  { workspaceId: 'workspace-prototype', displayName: 'Prototype Workspace', workspaceRootPath: '/synthetic/prototype-workspace' },
  { workspaceId: 'workspace-docs', displayName: 'Documentation', workspaceRootPath: '/synthetic/documentation' },
]
const baselineProject: Project = {
  projectId: 'project-prototype-launch', name: 'Prototype Launch',
  description: 'Synthetic project linking the prototype workspace and its launch tasks.',
  createdAt: fixtureDate, updatedAt: fixtureDate, openTaskCount: 2,
  workspaces: [{ ...workspaceChoices[0], description: 'Primary synthetic workspace for launch review.', addedAt: fixtureDate, availability: 'AVAILABLE' }],
}

export const useProjectDesignStore = defineStore('projectDesignReview', () => {
  const scenario = typeof window === 'undefined' ? 'populated' : (localStorage.getItem('autobyteus.prototype.scenario') || 'populated')
  const projects = ref<Project[]>(scenario === 'empty' ? [] : [structuredClone(baselineProject)])
  const createdIds = ref<string[]>([])
  const deletedIds = ref<string[]>([])
  const listSearch = ref('')
  const projectById = (id: string) => projects.value.find(project => project.projectId === id) ?? null
  const save = (input: { projectId?: string; name: string; description: string; workspaces: ProjectWorkspace[] }): Project => {
    const previous = input.projectId ? projectById(input.projectId) : null
    const projectId = input.projectId || `project-review-${createdIds.value.length + 1}`
    const project: Project = {
      projectId, name: input.name, description: input.description,
      workspaces: input.workspaces.map(link => ({ ...link })),
      createdAt: previous?.createdAt || fixtureDate, updatedAt: fixtureDate,
      openTaskCount: previous?.openTaskCount || 0,
    }
    projects.value = [...projects.value.filter(item => item.projectId !== projectId), project]
    if (!input.projectId) createdIds.value.push(projectId)
    return project
  }
  const remove = (projectId: string) => {
    projects.value = projects.value.filter(project => project.projectId !== projectId)
    deletedIds.value.push(projectId)
  }
  const unlinkWorkspace = (projectId: string, workspaceId: string) => {
    const project = projectById(projectId)
    if (project) project.workspaces = project.workspaces.filter(link => link.workspaceId !== workspaceId)
  }
  return { projects, createdIds, deletedIds, listSearch, projectById, save, remove, unlinkWorkspace }
})
