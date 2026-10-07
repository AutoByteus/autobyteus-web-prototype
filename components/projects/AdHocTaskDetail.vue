<template>
  <!-- project-manager-ux round 2: a Task with no Project, read only (only agents change it).
       Same page shape as a Project Task: Description, Reference files, Assigned to. -->
  <div class="h-full flex-1 overflow-auto bg-slate-50" data-testid="adhoc-task-page">
    <div class="w-full max-w-[1040px] px-4 py-5 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
        <NuxtLink :to="`/projects/${NO_PROJECT_ID}`" class="inline-flex min-h-9 items-center gap-1.5 rounded text-sm font-medium text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="adhoc-task-back"><Icon icon="heroicons:arrow-left" class="h-4 w-4" aria-hidden="true" />{{ t('projects.ui.backTasks') }}</NuxtLink>
        <span class="min-w-0 break-words border-l border-slate-300 pl-3 text-sm text-slate-500">{{ t('projects.adHoc.title') }}</span>
      </div>
      <p v-if="!list?.hasLoaded" role="status" class="mt-5 text-sm text-slate-500">{{ t('projects.components.projects.ProjectTaskBoard.loading') }}</p>
      <div v-else-if="!task" class="mt-5 rounded-xl border border-slate-200 bg-white p-6" role="status">
        <h1 class="text-lg font-semibold text-slate-900">{{ t('projects.ui.taskMissingTitle') }}</h1>
        <p class="mt-2 text-sm text-slate-600">{{ t('projects.ui.taskMissingHelp') }}</p>
        <NuxtLink :to="`/projects/${NO_PROJECT_ID}`" class="mt-4 inline-block text-sm font-medium text-blue-700">{{ t('projects.ui.backTasks') }}</NuxtLink>
      </div>
      <template v-else>
        <header class="mb-4 mt-4 flex flex-wrap items-center gap-3">
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900" data-testid="adhoc-task-heading">{{ t('projects.ui.taskDetails') }}</h1>
          <span class="rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset" :class="task.status === 'DONE' ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : 'bg-blue-50 text-blue-800 ring-blue-200'" data-testid="adhoc-task-status">{{ t(task.status === 'DONE' ? 'projects.adHoc.lane.done' : 'projects.adHoc.lane.open') }}</span>
        </header>
        <section class="overflow-hidden rounded-xl border border-slate-200 bg-white" aria-labelledby="adhoc-description-heading">
          <div class="p-5 sm:p-6">
            <h2 id="adhoc-description-heading" class="text-xs font-medium text-slate-500">{{ t('projects.ui.description') }}</h2>
            <p class="mt-3 max-w-[80ch] whitespace-pre-wrap break-words text-base leading-7 text-slate-800" data-testid="adhoc-task-description">{{ task.description }}</p>
            <section v-if="task.referenceFiles?.length" class="mt-6 border-t border-slate-100 pt-5" aria-labelledby="adhoc-reference-heading">
              <h2 id="adhoc-reference-heading" class="mb-2 text-sm font-medium text-slate-600">{{ t('projects.adHoc.referenceFiles') }} ({{ task.referenceFiles.length }})</h2>
              <ul class="space-y-1">
                <li v-for="path in task.referenceFiles" :key="path" class="flex min-w-0 items-center gap-2 text-sm text-slate-700"><Icon icon="heroicons:document-text" class="h-4 w-4 flex-shrink-0 text-slate-400" aria-hidden="true" /><span class="truncate font-mono text-[0.8125rem]" :title="path">{{ path }}</span></li>
              </ul>
            </section>
          </div>
        </section>
        <section class="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white" aria-labelledby="adhoc-workers-heading" data-testid="adhoc-task-assigned">
          <div class="p-5 sm:p-6">
            <h2 id="adhoc-workers-heading" class="text-xs font-medium text-slate-500">{{ t('projects.ui.workers') }}</h2>
            <ProjectTaskWorkers v-if="task.workers?.length" class="-mx-3 mt-2" density="detail" :workers="task.workers" />
            <p v-else class="mt-3 text-sm text-slate-500">{{ t('projects.ui.noWorkers') }}</p>
            <p v-if="task.workers?.some((worker) => worker.status === 'running' || worker.status === 'idle')" class="mt-3 text-xs leading-5 text-slate-400">{{ t('projects.ui.workersHelp') }}</p>
          </div>
        </section>
        <p class="mt-4 text-xs text-slate-400" data-testid="adhoc-task-read-only">{{ t('projects.adHoc.readOnly') }}</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import ProjectTaskWorkers from './ProjectTaskWorkers.vue'
import { useLocalization } from '~/composables/useLocalization'
import { useProjectTaskStore } from '~/stores/projectTaskStore'
import { NO_PROJECT_ID } from '~/prototype/project-manager/adHocTasksFixture'

const props = defineProps<{ taskId: string }>()
const { t } = useLocalization()
const store = useProjectTaskStore()
const list = computed(() => store.getList(NO_PROJECT_ID))
const task = computed(() => list.value?.tasks.find((item) => item.taskId === props.taskId) ?? null)
onMounted(() => { void store.fetchTasks(NO_PROJECT_ID).catch(() => undefined) })
onBeforeUnmount(() => store.releaseRead(NO_PROJECT_ID))
</script>
