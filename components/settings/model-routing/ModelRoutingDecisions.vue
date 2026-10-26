<template>
  <section class="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm" data-testid="model-routing-decisions" aria-labelledby="model-routing-decisions-heading">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div class="min-w-0 max-w-3xl">
        <h3 id="model-routing-decisions-heading" class="text-xl font-semibold leading-tight text-gray-900">{{ t('settings.modelRouting.decisions.title') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ t('settings.modelRouting.decisions.description') }}</p>
      </div>
      <div v-if="routing.delegations.length" class="flex flex-shrink-0 flex-wrap items-center gap-2" data-testid="model-routing-decisions-filters">
        <select v-model="sourceFilter" class="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30" :aria-label="t('settings.modelRouting.decisions.filterSource')" data-testid="model-routing-filter-source">
          <option value="">{{ t('settings.modelRouting.decisions.allSources') }}</option>
          <option v-for="source in SOURCES" :key="source" :value="source">{{ t(SOURCE_KEY[source]) }}</option>
        </select>
      </div>
    </div>

    <p v-if="!routing.enabled && routing.delegations.length" class="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700" data-testid="model-routing-decisions-off-note">{{ t('settings.modelRouting.decisions.offNote') }}</p>
    <p v-else-if="routing.enabled && status.kind !== 'active' && status.kind !== 'off'" class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800" data-testid="model-routing-decisions-inactive-note">{{ t('settings.modelRouting.decisions.inactiveNote') }}</p>

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
      <ul class="mt-5 space-y-3" data-testid="model-routing-decisions-list" :aria-label="t('settings.modelRouting.decisions.title')">
        <li
          v-for="task in visible"
          :id="`decision-${task.delegations[0].delegation.id}`"
          :key="task.taskKey"
          class="overflow-hidden rounded-2xl border transition-shadow"
          :class="task.delegations.some((item) => item.delegation.id === focusId) ? 'border-blue-300 ring-2 ring-blue-200' : 'border-slate-200'"
          :data-testid="`model-routing-task-${task.taskKey}`"
        >
          <!-- The Task: its key and title -->
          <div class="flex items-center gap-2 bg-slate-50/70 px-4 py-2.5">
            <span class="flex-shrink-0 text-sm font-medium text-slate-500"><TaskKey :task-key="task.taskKey" /></span>
            <p class="min-w-0 break-words text-sm font-semibold text-gray-900 sm:truncate" :title="task.taskTitle">{{ task.taskTitle }}</p>
          </div>

          <!-- Each delegation of the Task: to whom, by whom, when; then what each agent runs on -->
          <div v-for="item in task.delegations" :id="`decision-${item.delegation.id}`" :key="item.delegation.id" class="border-t border-slate-100" :data-testid="`model-routing-decision-${item.delegation.id}`">
            <div class="flex flex-col gap-1 px-4 pb-1 pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600">
                <span>{{ t('settings.modelRouting.decisions.delegatedTo', { target: item.delegation.targetName, delegator: item.delegation.delegatorName }) }}</span>
                <RemoteNodeChip v-if="item.delegation.node" :node-name="item.delegation.node" size="header" />
                <span class="text-gray-400" aria-hidden="true">·</span>
                <span>{{ decisionTime(item.delegation.at, locale, t) }}</span>
              </p>
              <button type="button" class="inline-flex flex-shrink-0 items-center gap-1 self-start whitespace-nowrap text-sm font-medium text-blue-700 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 sm:self-center" data-testid="model-routing-decision-open-run" @click="openRun(item.delegation.delegatorRunId)">
                {{ t('settings.modelRouting.decisions.openRun') }}<Icon icon="heroicons:arrow-top-right-on-square" class="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <p v-if="item.delegation.failure" class="mx-4 mt-1 flex items-start gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800" data-testid="model-routing-decision-failure">
              <Icon icon="heroicons:exclamation-triangle" class="mt-px h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              <span>{{ t('settings.modelRouting.decisions.failure', { reason: item.delegation.failure }) }}</span>
            </p>
            <ul class="px-4 pb-3 pt-1">
              <li v-for="choice in item.choices" :key="choice.agent" class="border-t border-slate-100 py-2.5 first:border-t-0" data-testid="model-routing-decision-row">
                <div class="grid gap-x-4 gap-y-0.5 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_7.5rem] sm:items-baseline">
                  <p class="truncate text-sm font-medium text-gray-900" :title="choice.agent">{{ choice.agent }}</p>
                  <p class="flex min-w-0 items-center gap-2 text-sm text-gray-800">
                    <span class="inline-block h-2.5 w-2.5 flex-shrink-0 translate-y-px rounded-[3px]" :style="{ backgroundColor: RUNTIME_COLORS[choice.runtime] }" aria-hidden="true"></span>
                    <span class="truncate"><span class="font-medium">{{ choice.runtimeName }}</span><span class="text-gray-400"> · </span>{{ choice.model }}</span>
                  </p>
                  <p class="text-xs font-medium sm:text-right" :class="choice.source === 'router' ? 'text-blue-700' : choice.source === 'inherited' ? 'text-amber-700' : 'text-gray-500'">{{ t(SOURCE_KEY[choice.source]) }}</p>
                </div>
                <p v-if="choice.reason" class="mt-0.5 text-xs text-gray-500 sm:ml-[13rem]" data-testid="model-routing-decision-reason">
                  <span v-if="choice.kind" class="mr-1.5 rounded-full bg-slate-100 px-2 py-px font-medium text-slate-600">{{ kindLabel(choice.kind, t) }}</span>{{ choice.reason }}
                </p>
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
    const choices = delegation.choices.filter((choice) => !sourceFilter.value || choice.source === sourceFilter.value)
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
