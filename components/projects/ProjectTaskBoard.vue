<template>
  <div class="project-task-board" data-testid="project-task-board">
    <div class="flex items-center gap-3">
      <div class="relative min-w-0 flex-1">
        <label :for="searchId" class="sr-only">{{ t('projects.components.projects.ProjectTaskBoard.searchLabel') }}</label>
        <Icon icon="heroicons:magnifying-glass" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input :id="searchId" v-model="searchQuery" type="search" data-testid="project-tasks-search-input" class="block min-h-11 w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" :placeholder="t('projects.components.projects.ProjectTaskBoard.searchPlaceholder')" />
      </div>
      <NuxtLink :to="`/projects/${projectId}/tasks/new`" class="inline-flex min-h-11 flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 sm:px-4" data-testid="project-tasks-new-button"><Icon icon="heroicons:plus" class="h-4 w-4" aria-hidden="true" />{{ t('projects.components.projects.ProjectTaskBoard.newTask') }}</NuxtLink>
    </div>

    <p v-if="boardState === 'loading'" class="mt-4 rounded-xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-500" role="status" data-testid="project-tasks-loading">{{ t('projects.components.projects.ProjectTaskBoard.loading') }}</p>
    <div v-else-if="boardState === 'error'" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert" data-testid="project-tasks-error"><p class="font-semibold">{{ t('projects.components.projects.ProjectTaskBoard.loadFailed') }}</p><p class="mt-1">{{ loadError }}</p><button type="button" class="mt-3 rounded-md border border-red-300 bg-white px-3 py-2 text-sm" @click="load(true)">{{ t('projects.common.retry') }}</button></div>
    <div v-else-if="isNoMatch" class="mt-4 rounded-xl border border-slate-200 bg-white py-12 text-center" role="status" data-testid="project-tasks-no-match"><Icon icon="heroicons:magnifying-glass" class="mx-auto h-6 w-6 text-slate-300" aria-hidden="true" /><p class="mt-3 text-sm font-medium text-slate-700">No matching tasks</p><p class="mt-1 text-xs text-slate-500">Try another search.</p><button type="button" class="mt-4 min-h-10 rounded-md px-3 text-sm font-medium text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="project-tasks-clear-search" @click="clearSearch">Clear search</button></div>

    <div v-else class="project-task-board__columns mt-6" data-testid="project-task-columns">
      <section v-for="status in PROJECT_TASK_STATUSES" :key="status" class="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white" :aria-labelledby="columnHeadingId(status)" :data-testid="`project-task-column-${status}`">
        <h2 :id="columnHeadingId(status)" class="flex min-h-12 items-center gap-2 border-b border-slate-200 bg-slate-50/60 px-4 py-3 text-sm font-semibold text-slate-700">{{ t(TASK_STATUS_LABEL_KEYS[status]) }}<span class="text-xs font-normal text-slate-500" data-testid="project-task-column-count">{{ columns[status].length }}</span></h2>
        <p v-if="columns[status].length === 0" class="px-4 py-7 text-center text-xs text-slate-500" data-testid="project-task-column-empty">{{ t('projects.components.projects.ProjectTaskBoard.noTasks') }}</p>
        <ul v-else class="divide-y divide-slate-100"><li v-for="task in columns[status]" :key="task.taskId"><ProjectTaskCard :task="task" /></li></ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import ProjectTaskCard from '~/components/projects/ProjectTaskCard.vue'
import { useLocalization } from '~/composables/useLocalization'
import { useProjectTaskStore } from '~/stores/projectTaskStore'
import { useWindowNodeContextStore } from '~/stores/windowNodeContextStore'
import { PROJECT_TASK_STATUSES, type ProjectTask, type ProjectTaskStatus } from '~/types/project'
import { TASK_STATUS_LABEL_KEYS } from '~/utils/projects/taskStatusLabelKey'
import { useProjectDesignStore } from '~/prototype/project-review/useProjectDesignStore'
import { useTaskDesignStore, type TaskContextFile } from '~/prototype/project-review/useTaskDesignStore'

const props = defineProps<{ projectId: string }>()

const { t } = useLocalization()
const projectTaskStore = useProjectTaskStore()
const windowNodeContextStore = useWindowNodeContextStore()

const uid = Math.random().toString(36).slice(2, 8)
const searchId = `project-tasks-search-${uid}`
const columnHeadingId = (status: ProjectTaskStatus) => `project-task-column-${status}-${uid}`

const review = useProjectDesignStore()
const taskReview = useTaskDesignStore()
const searchQuery = computed({
  get: () => taskReview.searchByProject[props.projectId] || '',
  set: value => { taskReview.searchByProject[props.projectId] = value },
})
const list = computed(() => review.projectById(props.projectId) ? { status: 'ready', tasks: taskReview.tasksFor(props.projectId), error: null } : projectTaskStore.getList(props.projectId))
const tasks = computed<Array<ProjectTask & { attachments?: TaskContextFile[] }>>(() => list.value?.tasks ?? [])
const boardState = computed(() => {
  if (!list.value || (list.value.status === 'loading' && tasks.value.length === 0)) return 'loading'
  return list.value.status === 'error' ? 'error' : 'ready'
})
const loadError = computed(() => list.value?.error?.message ?? null)

// Search is presentation-only; status grouping remains unchanged.
const matchingTasks = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()
  return tasks.value.filter(task => !query || task.description.toLocaleLowerCase().includes(query))
})

const columns = computed<Record<ProjectTaskStatus, ProjectTask[]>>(() => {
  const grouped: Record<ProjectTaskStatus, ProjectTask[]> = { TODO: [], IN_PROGRESS: [], DONE: [] }
  for (const task of matchingTasks.value) {
    grouped[task.status].push(task)
  }
  return grouped
})

const isNoMatch = computed(() => tasks.value.length > 0 && matchingTasks.value.length === 0)

const load = (force = false): void => {
  if (review.projectById(props.projectId)) return
  void projectTaskStore.fetchTasks(props.projectId, force).catch(() => undefined)
}

const clearSearch = (): void => {
  searchQuery.value = ''
  document.getElementById(searchId)?.focus()
}

onMounted(() => load(true))

watch(() => props.projectId, () => {
  load(true)
})

// The store drops its lists when the window is rebound to another node; reload for the new node.
watch(() => windowNodeContextStore.bindingRevision, () => load(true))
</script>

<style scoped>
.project-task-board { container-type: inline-size; container-name: project-task-board; }
.project-task-board__columns { display: grid; gap: 1rem; grid-template-columns: minmax(0, 1fr); }
@container project-task-board (min-width: 752px) { .project-task-board__columns { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
</style>
