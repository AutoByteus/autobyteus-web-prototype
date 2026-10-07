<template>
  <!-- project-manager-ux: who works on a Task. A running or idle worker opens its run; a worker
       that could not start shows why; a Done Task's workers are stopped and cannot be opened. -->
  <ul
    v-if="workers.length"
    class="space-y-0.5"
    :class="density === 'row' ? 'mt-2' : ''"
    :aria-label="t('projects.worker.listLabel')"
    data-testid="project-task-workers"
  >
    <li v-for="worker in workers" :key="worker.openRunId ?? worker.name">
      <component
        :is="openable(worker) ? 'button' : 'div'"
        :type="openable(worker) ? 'button' : undefined"
        class="group/worker flex w-full min-w-0 items-center gap-1.5 rounded-md text-left"
        :class="[
          density === 'detail' ? 'min-h-10 px-3 py-2 text-sm' : 'min-h-7 px-1.5 py-1 text-xs',
          openable(worker) ? 'hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500' : '',
          density === 'row' ? '-mx-1.5' : '',
        ]"
        :aria-label="openable(worker) ? t('projects.worker.open', { name: worker.name }) : undefined"
        :title="worker.error ?? undefined"
        :data-testid="`project-task-worker-${worker.status}`"
        @click.stop.prevent="openable(worker) && open(worker)"
      >
        <span
          v-if="worker.kind === 'team'"
          class="inline-flex flex-shrink-0 items-center justify-center text-slate-500"
          :class="density === 'detail' ? 'h-5 w-5' : 'h-4 w-4'"
          aria-hidden="true"
        ><Icon icon="heroicons:bolt-20-solid" :class="density === 'detail' ? 'h-4 w-4' : 'h-3.5 w-3.5'" /></span>
        <span
          v-else
          class="inline-flex flex-shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600"
          :class="density === 'detail' ? 'h-5 w-5 text-[0.5625rem]' : 'h-4 w-4 text-[0.5rem]'"
          aria-hidden="true"
        >{{ initials(worker.name) }}</span>
        <span class="min-w-0 truncate" :class="[worker.kind === 'team' ? 'font-semibold' : 'font-medium', worker.status === 'stopped' ? 'text-slate-400' : 'text-slate-700']">{{ worker.name }}</span>
        <span class="ml-auto inline-flex flex-shrink-0 items-center gap-1.5 pl-2" :class="worker.status === 'failed' ? 'font-medium text-red-600' : 'text-slate-500'">
          <Icon v-if="worker.status === 'failed'" icon="heroicons:exclamation-circle-20-solid" class="h-3.5 w-3.5" aria-hidden="true" />
          <StatusDot v-else :status="DOT[worker.status]" />
          {{ t(`projects.worker.status.${worker.status}`) }}
        </span>
        <Icon
          v-if="openable(worker)"
          icon="heroicons:chevron-right-20-solid"
          class="h-3.5 w-3.5 flex-shrink-0 text-slate-300 group-hover/worker:text-slate-500"
          aria-hidden="true"
        />
        <!-- A row that cannot be opened keeps the chevron's space, so every status lines up. -->
        <span v-else class="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
      </component>
      <p v-if="worker.status === 'failed' && worker.error && density !== 'row'" class="px-1.5 pb-1 text-xs leading-5 text-red-600" :class="density === 'detail' ? 'px-3' : 'pl-7'">{{ worker.error }}</p>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import StatusDot from '~/components/workspace/common/StatusDot.vue'
import { useLocalization } from '~/composables/useLocalization'
import { openTaskWorker } from '~/composables/projects/useTaskWorkerNavigation'
import { AgentStatus } from '~/types/agent/AgentStatus'
import type { ProjectTaskWorker } from '~/types/project'

const props = withDefaults(defineProps<{
  workers?: ProjectTaskWorker[]
  /** `row`: on a board row; `card`: in the Tasks tool; `detail`: on the Task page. */
  density?: 'row' | 'card' | 'detail'
}>(), { workers: () => [], density: 'card' })

const { t } = useLocalization()
const DOT: Record<ProjectTaskWorker['status'], AgentStatus> = {
  running: AgentStatus.Running, idle: AgentStatus.Idle, failed: AgentStatus.Error, stopped: AgentStatus.Offline,
}
const workers = computed(() => props.workers)
const openable = (worker: ProjectTaskWorker) => Boolean(worker.openRunId) && (worker.status === 'running' || worker.status === 'idle')
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || 'AI'
const open = (worker: ProjectTaskWorker) => { void openTaskWorker(worker) }
</script>
