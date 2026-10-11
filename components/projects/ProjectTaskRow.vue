<template>
  <!-- The row opens the Task (a stretched link); the Task's root sits beneath the text and opens the
       worker. A Task that just arrived or moved live is highlighted for 2.4 s (project-manager-ux). -->
  <div
    ref="rowRef"
    class="project-task-row relative px-4 py-3.5 transition-colors hover:bg-slate-50"
    :class="[live ? `is-live-${live}` : '', located ? 'is-located' : '']"
    :data-testid="`project-task-row-${task.taskId}`"
    :data-live="live || undefined"
    :data-located="located || undefined"
  >
    <component
      ref="linkRef"
      :is="activation === 'route' ? NuxtLink : 'button'"
      v-bind="activation === 'route' ? { to: taskRoute } : { type: 'button' }"
      class="block w-full text-left after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-blue-500"
      :aria-label="label"
      data-testid="project-task-row-link"
      @click="activation === 'select' && emit('select', task.taskId)"
    >
      <span class="line-clamp-2 break-words text-sm font-medium leading-6 text-slate-800" data-testid="project-task-row-text">{{ summary }}</span>
      <span v-if="preview" class="mt-1 line-clamp-2 break-words text-xs leading-5 text-slate-500" data-testid="project-task-row-preview">{{ preview }}</span>
      <span v-if="fileCount" class="mt-2 inline-flex items-center gap-1 text-xs text-slate-500" data-testid="task-row-file-count"><Icon icon="heroicons:paper-clip" class="h-3.5 w-3.5" aria-hidden="true" />{{ t(fileCount === 1 ? 'projects.ui.fileCountOne' : 'projects.ui.fileCount', {count: fileCount}) }}</span>
    </component>
    <ProjectTaskWorkers v-if="task.root" class="relative z-10" density="row" :root="task.root" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, resolveComponent, watch } from 'vue'
import { Icon } from '@iconify/vue'
import type { ProjectTask, TaskWithoutProject } from '~/types/project'
import ProjectTaskWorkers from './ProjectTaskWorkers.vue'
import { useLocalization } from '~/composables/useLocalization'
import { useProjectTaskStore } from '~/stores/projectTaskStore'
import { useTaskLocatorStore } from '~/stores/taskLocatorStore'
import { taskCardPreview, taskCardSummary, taskSummaryLabel } from '~/utils/projects/taskSummary'

// The first line is the summary; remaining lines are a quieter context preview. Each is bounded
// before rendering and clamped to 2 lines by CSS; the Task page shows the full description.
/**
 * `route` (the Projects pages): the row links to the Task page. `select` (the right panel's Projects
 * tab): it emits `select` so the Task opens inside the tab; same visuals.
 */
const props = withDefaults(defineProps<{ task: ProjectTask | TaskWithoutProject; activation?: 'route' | 'select' }>(), { activation: 'route' })
const NuxtLink = resolveComponent('NuxtLink')
const emit = defineEmits<{ (event: 'select', taskId: string): void }>()

const {t} = useLocalization()
const store = useProjectTaskStore()
const summary = computed(() => taskCardSummary(props.task.description))
const preview = computed(() => taskCardPreview(props.task.description))
const label = computed(() => taskSummaryLabel(props.task.description))
const taskRoute = computed(() => 'projectId' in props.task
  ? `/projects/${props.task.projectId}/tasks/${props.task.taskId}`
  : `/projects/temp-tasks/tasks/${props.task.taskId}`)
const fileCount = computed(() => 'contextFiles' in props.task ? props.task.contextFiles?.length ?? 0 : 0)
const live = computed(() => store.liveChanges[props.task.taskId] ?? null)

// delegated-copy-task-locator (design): "Show Task in Projects" scrolls this card into view in the
// Projects tab, focuses it (Enter opens the Task) and highlights it like a live change (2.4 s).
const locator = useTaskLocatorStore()
const rowRef = ref<HTMLElement | null>(null)
const linkRef = ref<any>(null)
const located = ref(false)
let locatedTimer: ReturnType<typeof setTimeout> | null = null
watch(() => locator.request, async (request) => {
  if (props.activation !== 'select' || !request || request.taskId !== props.task.taskId) return
  if (!locator.take(`row:${props.task.taskId}`, request)) return
  // Let the panel (or drawer) open and the board settle before scrolling.
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 180))
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  rowRef.value?.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' })
  const link = (linkRef.value?.$el ?? linkRef.value) as HTMLElement | null
  link?.focus({ preventScroll: true })
  located.value = false
  await nextTick()
  located.value = true
  if (locatedTimer) clearTimeout(locatedTimer)
  locatedTimer = setTimeout(() => { located.value = false }, 2400)
}, { immediate: true })
</script>

<style scoped>
/* A Task an agent just wrote (or moved) shows a soft indigo wash and left bar that fade over 2.4 s. */
.project-task-row.is-live-moved { animation: task-live 2400ms ease-out both; }
/* delegated-copy-task-locator: a located Task shows the same wash and bar as a moved one. */
.project-task-row.is-located { animation: task-live 2400ms ease-out both; }
.project-task-row.is-live-arrived { animation: task-arrive 2400ms ease-out both; }
@keyframes task-live {
  0%, 35% { background-color: #eef2ff; box-shadow: inset 2px 0 #6366f1; }
  100% { background-color: transparent; box-shadow: inset 2px 0 transparent; }
}
@keyframes task-arrive {
  0% { opacity: 0; transform: translateY(-4px); background-color: #eef2ff; box-shadow: inset 2px 0 #6366f1; }
  8% { opacity: 1; transform: none; }
  35% { background-color: #eef2ff; box-shadow: inset 2px 0 #6366f1; }
  100% { background-color: transparent; box-shadow: inset 2px 0 transparent; }
}
@media (prefers-reduced-motion: reduce) {
  .project-task-row.is-live-moved, .project-task-row.is-live-arrived, .project-task-row.is-located { animation: none; background-color: #eef2ff; box-shadow: inset 2px 0 #6366f1; }
}
</style>
