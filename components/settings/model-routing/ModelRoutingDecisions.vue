<template>
  <section class="px-1" data-testid="model-routing-decisions" :aria-label="t('settings.modelRouting.decisions.title')">
    <div v-if="routing.delegations.length" class="flex items-center justify-end gap-3" data-testid="model-routing-decisions-filters">
      <select v-model="sourceFilter" class="h-9 flex-shrink-0 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30" :aria-label="t('settings.modelRouting.decisions.filterSource')" data-testid="model-routing-filter-source">
        <option value="">{{ t('settings.modelRouting.decisions.allSources') }}</option>
        <option value="router">{{ t('settings.modelRouting.source.router') }}</option>
        <option value="not_router">{{ t('settings.modelRouting.decisions.filterNotRouted') }}</option>
      </select>
    </div>

    <p v-if="!routing.enabled && routing.delegations.length" class="mt-4 text-sm text-gray-500" data-testid="model-routing-decisions-off-note">{{ t('settings.modelRouting.decisions.offNote') }}</p>
    <p v-else-if="routing.enabled && status.kind !== 'active' && status.kind !== 'off'" class="mt-4 text-sm text-amber-800" data-testid="model-routing-decisions-inactive-note">{{ t('settings.modelRouting.decisions.inactiveNote') }}</p>

    <!-- Empty -->
    <div v-if="!routing.delegations.length" class="mt-5 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center" data-testid="model-routing-decisions-empty">
      <p class="text-sm font-medium text-gray-700">{{ routing.enabled ? t('settings.modelRouting.decisions.emptyOn') : t('settings.modelRouting.decisions.emptyOff') }}</p>
      <p class="mx-auto mt-1 max-w-xl text-sm text-gray-500">{{ routing.enabled ? t('settings.modelRouting.decisions.emptyOnHint') : t('settings.modelRouting.decisions.emptyOffHint') }}</p>
      <button v-if="!routing.enabled" type="button" class="mt-3 text-sm font-medium text-blue-700 hover:text-blue-800" @click="emit('show-setup')">{{ t('settings.modelRouting.status.goToSetup') }}</button>
    </div>

    <div v-else-if="!tasks.length" class="mt-5 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center" data-testid="model-routing-decisions-no-match">
      <p class="text-sm text-gray-600">{{ t('settings.modelRouting.decisions.noMatch') }}</p>
      <button type="button" class="mt-2 text-sm font-medium text-blue-700 hover:text-blue-800" @click="sourceFilter = ''">{{ t('settings.modelRouting.decisions.clearFilters') }}</button>
    </div>

    <template v-else>
      <ul class="mt-4" data-testid="model-routing-decisions-list" :aria-label="t('settings.modelRouting.decisions.title')">
        <li
          v-for="task in visible"
          :id="`decision-${task.delegations[0].delegation.id}`"
          :key="task.taskKey"
          class="border-t border-slate-100 py-5 first:border-t-0 transition-colors"
          :class="task.delegations.some((item) => item.delegation.id === focusId) ? '-mx-3 rounded-xl bg-blue-50/60 px-3 ring-1 ring-blue-200' : ''"
          :data-testid="`model-routing-task-${task.taskKey}`"
        >
          <!-- The Task: its key and title -->
          <div class="flex items-baseline gap-2">
            <span class="flex-shrink-0 text-sm text-gray-400"><TaskKey :task-key="task.taskKey" /></span>
            <p class="min-w-0 break-words text-base font-semibold text-gray-900" :title="task.taskTitle">{{ task.taskTitle }}</p>
          </div>

          <!-- Each delegation of the Task: to whom, by whom, when; then what each agent runs on -->
          <div v-for="item in task.delegations" :id="`decision-${item.delegation.id}`" :key="item.delegation.id" class="mt-2" :data-testid="`model-routing-decision-${item.delegation.id}`">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
              <span class="text-gray-700">{{ item.delegation.targetName }}</span>
              <RemoteNodeChip v-if="item.delegation.node" :node-name="item.delegation.node" size="header" />
              <span class="text-gray-400">{{ decisionTime(item.delegation.at, locale, t) }}</span>
              <button type="button" class="ml-auto inline-flex flex-shrink-0 items-center gap-1 whitespace-nowrap font-medium text-blue-700 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1" data-testid="model-routing-decision-open-run" :title="t('settings.modelRouting.decisions.openRunTitle', { delegator: item.delegation.delegatorName })" @click="openRun(item.delegation.delegatorRunId)">
                {{ t('settings.modelRouting.decisions.openRun') }}<Icon icon="heroicons:arrow-top-right-on-square" class="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <p v-if="item.delegation.failure" class="mt-2 flex items-start gap-1.5 text-xs text-amber-800" data-testid="model-routing-decision-failure">
              <Icon icon="heroicons:exclamation-triangle" class="mt-px h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              <span>{{ t('settings.modelRouting.decisions.failure', { reason: item.delegation.failure }) }}</span>
            </p>
            <ul class="mt-2">
              <li v-for="choice in item.choices" :key="choice.agent" class="py-1.5" data-testid="model-routing-decision-row">
                <div class="grid gap-x-4 gap-y-0.5 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
                  <div class="min-w-0">
                    <p class="truncate text-sm font-medium text-gray-900" :title="choice.agent">{{ choice.agent }}</p>
                    <p v-if="choice.kind" class="text-xs text-gray-400">{{ kindLabel(choice.kind, t) }}</p>
                  </div>
                  <div class="min-w-0">
                    <p class="flex min-w-0 items-center gap-2 text-sm text-gray-800">
                      <span class="inline-block h-2.5 w-2.5 flex-shrink-0 translate-y-px rounded-[3px]" :style="{ backgroundColor: RUNTIME_COLORS[choice.runtime] }" aria-hidden="true"></span>
                      <span class="truncate"><span class="font-medium">{{ choice.runtimeName }}</span><span class="text-gray-400"> · </span>{{ choice.model }}</span>
                      <span v-if="choice.source !== 'router'" class="ml-auto flex-shrink-0 pl-3 text-xs" :class="choice.source === 'inherited' ? 'text-amber-700' : 'text-gray-400'">{{ t(SOURCE_KEY[choice.source]) }}</span>
                    </p>
                    <p v-if="choice.reason" class="mt-0.5 text-xs text-gray-500" data-testid="model-routing-decision-reason">{{ choice.reason }}</p>
                  </div>
                </div>
                <p v-if="choice.skipped" class="mt-1 flex items-start gap-1 text-xs text-amber-700 sm:ml-[13rem]" data-testid="model-routing-decision-skipped">
                  <Icon icon="heroicons:exclamation-triangle" class="mt-px h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" /><span>{{ skippedText(choice) }}</span>
                </p>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div class="mt-4 flex items-center justify-between gap-3 text-sm text-gray-500">
        <p>{{ t('settings.modelRouting.decisions.shown', { shown: visible.length, total: tasks.length }) }}</p>
        <button v-if="visible.length < tasks.length" type="button" class="inline-flex min-h-9 items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1" data-testid="model-routing-decisions-more" @click="limit += PAGE">{{ t('settings.modelRouting.decisions.showMore') }}</button>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { buildAgentRunChatRoute } from '~/services/workspace/workspaceNavigationService'
import { routing, type RouterStatus } from '~/prototype/model-routing/modelRoutingState'
import { RUNTIME_COLORS, RUNTIME_NAMES, type RoutingChoice, type RoutingDelegation, type RoutingSource } from '~/prototype/model-routing/modelRoutingData'
import TaskKey from '~/components/projects/TaskKey.vue'
import RemoteNodeChip from '~/components/workspace/remote/RemoteNodeChip.vue'
import { decisionTime, kindLabel, SOURCE_KEY } from './modelRoutingPresentation'

const props = defineProps<{ status: RouterStatus; focusId: string | null }>()
const emit = defineEmits<{ (event: 'show-setup'): void }>()
const { t, resolvedLocale } = useLocalization()
const router = useRouter()
const locale = computed(() => String(resolvedLocale.value || 'en'))

const SOURCES: RoutingSource[] = ['router', 'agent_default', 'team_default', 'inherited']
const PAGE = 8
const sourceFilter = ref('')
const limit = ref(PAGE)


type TaskGroup = { taskKey: string; taskTitle: string; delegations: { delegation: RoutingDelegation; choices: RoutingChoice[] }[] }
/** One block per Project Task (its key), newest first; a Task delegated more than once lists each delegation under it. */
const tasks = computed<TaskGroup[]>(() => {
  const byKey = new Map<string, TaskGroup>()
  for (const delegation of routing.delegations) {
    const choices = delegation.choices.filter((choice) => !sourceFilter.value || (sourceFilter.value === 'router') === (choice.source === 'router'))
    if (!choices.length) continue
    const group = byKey.get(delegation.taskKey) ?? { taskKey: delegation.taskKey, taskTitle: delegation.taskTitle, delegations: [] }
    group.delegations.push({ delegation, choices })
    byKey.set(delegation.taskKey, group)
  }
  return [...byKey.values()]
})

const visible = computed(() => {
  const list = tasks.value.slice(0, limit.value)
  const focus = props.focusId ? tasks.value.findIndex((task) => task.delegations.some((item) => item.delegation.id === props.focusId)) : -1
  return focus >= list.length ? tasks.value.slice(0, focus + 1) : list
})

const skippedText = (choice: RoutingChoice): string => choice.skipped
  ? t('runSettings.delegated.fallback', {
    layer: t(`runSettings.delegated.layer.${choice.skipped.layer}`),
    model: `${RUNTIME_NAMES[choice.skipped.runtime] ?? choice.skipped.runtime} · ${choice.skipped.model}`,
    detail: choice.skipped.detail,
  })
  : ''
const openRun = (runId: string): void => { void router.push(buildAgentRunChatRoute(runId)) }

onMounted(() => {
  if (!props.focusId) return
  void nextTick(() => document.getElementById(`decision-${props.focusId}`)?.scrollIntoView({ block: 'center' }))
})
</script>
