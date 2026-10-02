<template>
  <NuxtLink
    :to="`/projects/${task.projectId}/tasks/${task.taskId}`"
    class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-blue-300 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
    :aria-label="summary"
    :data-testid="`project-task-card-${task.taskId}`"
  >
    <span class="line-clamp-3 whitespace-pre-line break-words text-sm leading-5 text-slate-800" data-testid="project-task-card-text">{{ task.description }}</span>
    <span v-if="task.attachments?.length" class="mt-2 inline-flex items-center gap-1 text-xs text-slate-500" data-testid="task-card-file-count"><Icon icon="heroicons:paper-clip" class="h-3.5 w-3.5" aria-hidden="true" />{{ task.attachments.length }} {{ task.attachments.length === 1 ? 'file' : 'files' }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { ProjectTask } from '~/types/project'
import type { TaskContextFile } from '~/prototype/project-review/useTaskDesignStore'
import { taskSummary } from '~/utils/projects/taskSummary'

// A card shows only the Task's description (up to 3 lines); its accessible name is the summary.
const props = defineProps<{ task: ProjectTask & { attachments?: TaskContextFile[] } }>()

const summary = computed(() => taskSummary(props.task.description))
</script>
