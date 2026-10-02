<template>
  <div class="h-full flex-1 overflow-auto bg-slate-50" data-testid="project-editor-page">
    <div class="mx-auto w-full max-w-[880px] px-4 py-6 sm:px-8 sm:py-8">
      <NuxtLink :to="backTarget" class="inline-flex min-h-9 items-center gap-1.5 rounded text-sm font-medium text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="project-editor-back">
        <Icon icon="heroicons:arrow-left" class="h-4 w-4" aria-hidden="true" />
        {{ isEdit ? 'Back to project' : 'Projects' }}
      </NuxtLink>

      <header class="mb-7 mt-3">
        <h1 ref="heading" tabindex="-1" class="text-3xl font-semibold tracking-tight text-slate-900 outline-none">{{ isEdit ? 'Edit project' : 'New project' }}</h1>
        <p class="mt-2 max-w-xl text-sm leading-6 text-slate-600">{{ isEdit ? 'Update the name and description of your project.' : 'Give your project a name, then optionally add the workspaces it brings together.' }}</p>
      </header>

      <div v-if="isEdit && !existing" class="rounded-xl border border-slate-200 bg-white p-6" role="status">
        <h2 class="font-semibold text-slate-900">Project not found</h2>
        <p class="mt-2 text-sm text-slate-600">It may have been deleted, or it belongs to a different node.</p>
        <NuxtLink to="/projects" class="mt-4 inline-block text-sm font-medium text-blue-700">Back to projects</NuxtLink>
      </div>

      <form v-else novalidate @submit.prevent="submit">
        <section class="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="project-details-heading">
          <h2 id="project-details-heading" class="text-base font-semibold text-slate-900">Project details</h2>
          <div class="mt-5">
            <label for="project-editor-name" class="block text-sm font-medium text-slate-700">Name <span class="font-normal text-slate-400">(required)</span></label>
            <input id="project-editor-name" v-model="name" maxlength="200" required type="text" placeholder="e.g. Customer portal" :disabled="saving" :aria-invalid="nameError ? 'true' : 'false'" :aria-describedby="nameError ? 'project-editor-name-error' : undefined" class="mt-2 block min-h-11 w-full rounded-md border bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 sm:text-sm" :class="nameError ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'" data-testid="project-name-input" />
            <p v-if="nameError" id="project-editor-name-error" class="mt-2 text-sm text-red-600" role="alert" data-testid="project-name-error">{{ nameError }}</p>
          </div>
          <div class="mt-5">
            <label for="project-editor-description" class="block text-sm font-medium text-slate-700">Description <span class="font-normal text-slate-400">(optional)</span></label>
            <textarea id="project-editor-description" v-model="description" rows="3" :disabled="saving" placeholder="What is this project about?" class="mt-2 block w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base leading-6 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" data-testid="project-description-input" />
          </div>
        </section>

        <section class="mt-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="project-workspaces-heading" data-testid="project-create-workspaces">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <h2 id="project-workspaces-heading" class="text-base font-semibold text-slate-900">Workspaces</h2>
              <span class="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">Optional</span>
            </div>
            <button type="button" :disabled="saving" class="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50" data-testid="project-add-workspace-inline" @click="addWorkspace">
              <Icon icon="heroicons:plus" class="h-4 w-4" aria-hidden="true" />Add workspace
            </button>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-500">Add the folders involved in this project and describe what each one is for. You can also do this later.</p>

          <div v-if="rows.length === 0" class="mt-5 flex gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/60 p-4" data-testid="project-create-workspaces-empty">
            <Icon icon="heroicons:folder" class="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden="true" />
            <div><p class="text-sm font-medium text-slate-600">No workspaces added</p><p class="mt-1 text-sm leading-5 text-slate-500">Create the project now, or add a workspace before continuing.</p></div>
          </div>

          <div v-for="(row, index) in rows" :key="row.key" class="mt-5 rounded-lg border border-slate-200 bg-slate-50/50 p-4 sm:p-5" :data-testid="`project-workspace-draft-${index}`">
            <div class="mb-4 flex items-center justify-between gap-3">
              <h3 class="text-sm font-semibold text-slate-700">Workspace {{ index + 1 }}</h3>
              <button type="button" :disabled="saving" class="inline-flex min-h-9 items-center gap-1.5 rounded px-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :aria-label="`Remove workspace ${index + 1}`" @click="rows.splice(index, 1)"><Icon icon="heroicons:x-mark" class="h-4 w-4" aria-hidden="true" />Remove</button>
            </div>
            <div class="grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-100 p-1" :aria-label="`Workspace ${index + 1} source`">
              <button v-for="mode in (['existing', 'new'] as const)" :key="mode" type="button" :disabled="saving" :aria-pressed="row.mode === mode" class="min-h-10 rounded-md px-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :class="row.mode === mode ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'" @click="row.mode = mode; row.error = ''">{{ mode === 'existing' ? 'Existing workspace' : 'New folder' }}</button>
            </div>
            <div class="mt-4">
              <label :for="`workspace-choice-${row.key}`" class="block text-sm font-medium text-slate-700">{{ row.mode === 'existing' ? 'Workspace' : 'Folder path' }}</label>
              <select v-if="row.mode === 'existing'" :id="`workspace-choice-${row.key}`" v-model="row.workspaceId" :disabled="saving" :aria-invalid="Boolean(row.error)" :aria-describedby="row.error ? `workspace-error-${row.key}` : undefined" class="mt-2 block min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" :data-testid="`workspace-select-${index}`">
                <option value="" disabled>Select a workspace</option>
                <option v-for="workspace in availableChoices(row)" :key="workspace.workspaceId" :value="workspace.workspaceId">{{ workspace.displayName }}</option>
              </select>
              <input v-else :id="`workspace-choice-${row.key}`" v-model="row.path" :disabled="saving" type="text" placeholder="/path/to/workspace" :aria-invalid="Boolean(row.error)" :aria-describedby="row.error ? `workspace-error-${row.key}` : undefined" class="mt-2 block min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" :data-testid="`workspace-path-${index}`" />
              <p v-if="row.mode === 'existing' && selectedChoice(row)" class="mt-2 break-all font-mono text-xs leading-5 text-slate-500">{{ selectedChoice(row)?.workspaceRootPath }}</p>
              <p v-if="row.mode === 'new'" class="mt-2 text-xs leading-5 text-slate-500">Use a folder on this project's node. Adding it here does not move or copy its files.</p>
              <p v-if="row.error" :id="`workspace-error-${row.key}`" class="mt-2 text-sm text-red-600" role="alert">{{ row.error }}</p>
            </div>
            <div class="mt-4">
              <label :for="`workspace-description-${row.key}`" class="block text-sm font-medium text-slate-700">Description <span class="font-normal text-slate-400">(optional)</span></label>
              <textarea :id="`workspace-description-${row.key}`" v-model="row.description" :disabled="saving" rows="2" placeholder="e.g. Frontend application and UI components" class="mt-2 block w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base leading-6 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" :data-testid="`workspace-description-${index}`" />
            </div>
          </div>
        </section>

        <div class="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5 pb-2">
          <NuxtLink :to="backTarget" class="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:flex-none" data-testid="project-editor-cancel">Cancel</NuxtLink>
          <button type="submit" :disabled="saving" class="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-blue-600 px-5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60 sm:flex-none" data-testid="project-form-submit">{{ saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create project' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectDesignStore, workspaceChoices } from '~/prototype/project-review/useProjectDesignStore'
import type { ProjectWorkspace } from '~/types/project'

const props = defineProps<{ projectId?: string }>()
const route = useRoute()
const router = useRouter()
const review = useProjectDesignStore()
const isEdit = computed(() => Boolean(props.projectId))
const existing = computed(() => props.projectId ? review.projectById(props.projectId) : null)
const name = ref(existing.value?.name || '')
const description = ref(existing.value?.description || '')
const nameError = ref('')
const saving = ref(false)
const heading = ref<HTMLElement | null>(null)
const backTarget = computed(() => isEdit.value ? `/projects/${props.projectId}${route.query.tab === 'workspaces' ? '?tab=workspaces' : ''}` : '/projects')
type WorkspaceDraft = { key: number; mode: 'existing' | 'new'; workspaceId: string; path: string; description: string; error: string; original?: ProjectWorkspace }
let nextKey = 0
const rows = ref<WorkspaceDraft[]>((existing.value?.workspaces || []).map(link => ({ key: nextKey++, mode: 'existing', workspaceId: link.workspaceId, path: '', description: link.description, error: '', original: link })))
const selectedChoice = (row: WorkspaceDraft) => workspaceChoices.find(workspace => workspace.workspaceId === row.workspaceId) || (row.original?.workspaceId === row.workspaceId ? row.original : undefined)
const availableChoices = (row: WorkspaceDraft) => {
  const choices = row.original && !workspaceChoices.some(workspace => workspace.workspaceId === row.original?.workspaceId) ? [...workspaceChoices, row.original] : workspaceChoices
  return choices.filter(workspace => workspace.workspaceId === row.workspaceId || !rows.value.some(other => other.key !== row.key && other.mode === 'existing' && other.workspaceId === workspace.workspaceId))
}
const addWorkspace = async () => {
  const key = nextKey++
  rows.value.push({ key, mode: 'existing', workspaceId: '', path: '', description: '', error: '' })
  await nextTick()
  document.getElementById(`workspace-choice-${key}`)?.focus()
}
const submit = async () => {
  if (saving.value) return
  nameError.value = ''
  if (!name.value.trim()) nameError.value = 'Enter a project name.'
  else if (review.projects.some(project => project.projectId !== props.projectId && project.name.toLocaleLowerCase() === name.value.trim().toLocaleLowerCase())) nameError.value = 'A project with this name already exists. Choose a different name.'
  if (nameError.value) {
    await nextTick()
    document.getElementById('project-editor-name')?.focus()
    return
  }
  for (const row of rows.value) row.error = row.mode === 'existing' && !row.workspaceId ? 'Choose a workspace, or remove this entry to continue.' : row.mode === 'new' && !row.path.trim() ? 'Enter a folder path, or remove this entry to continue.' : ''
  const invalid = rows.value.find(row => row.error)
  if (invalid) {
    await nextTick()
    document.getElementById(`workspace-choice-${invalid.key}`)?.focus()
    return
  }
  const links: ProjectWorkspace[] = rows.value.map(row => {
    const choice = row.mode === 'existing' ? selectedChoice(row)! : { workspaceId: `workspace-review-${row.key}`, displayName: row.path.trim().split(/[\\/]/).filter(Boolean).at(-1) || 'Workspace', workspaceRootPath: row.path.trim() }
    return { ...choice, description: row.description.trim(), availability: 'AVAILABLE', addedAt: '2026-08-22T04:00:00.000Z' }
  })
  saving.value = true
  // Scripted local save, not filesystem registration, persistence or API logic.
  await new Promise(resolve => window.setTimeout(resolve, 250))
  const saved = review.save({ projectId: props.projectId, name: name.value.trim(), description: description.value.trim(), workspaces: links })
  await router.push({ path: `/projects/${saved.projectId}`, query: { notice: isEdit.value ? 'saved' : 'created', ...((!isEdit.value && links.length > 0) || route.query.tab === 'workspaces' ? { tab: 'workspaces' } : {}) } })
}
onMounted(async () => {
  heading.value?.focus()
  if (route.query.addWorkspace === '1') await addWorkspace()
  else if (route.query.workspace) {
    const row = rows.value.find(row => row.workspaceId === route.query.workspace)
    if (row) document.getElementById(`workspace-description-${row.key}`)?.focus()
  }
})
</script>
