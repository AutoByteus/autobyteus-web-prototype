<template>
  <section class="" data-testid="model-routing-decisions" :aria-label="t('settings.modelRouting.decisions.title')">
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
      <button type="button" class="mt-2 text-sm font-medium text-blue-700 hover:text-blue-800" @click="emit('update:source', '')">{{ t('settings.modelRouting.decisions.clearFilters') }}</button>
    </div>

    <template v-else>
      <ul data-testid="model-routing-decisions-list" :aria-label="t('settings.modelRouting.decisions.title')">
        <li
          v-for="task in visible"
          :id="`decision-${task.delegations[0].delegation.id}`"
          :key="task.taskKey ?? NO_TASK"
          class="border-t border-slate-100 py-5 first:border-t-0 first:pt-0 transition-colors"
          :class="task.delegations.some((item) => item.delegation.id === focusId) ? '-mx-3 rounded-xl bg-blue-50/60 px-3 ring-1 ring-blue-200' : ''"
          :data-testid="`model-routing-task-${task.taskKey ?? NO_TASK}`"
        >
          <!-- The Task: its key (a link to it while it exists) and title; with one delegation its time and Open run at the right -->
          <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
            <div class="flex min-w-0 flex-1 basis-64 items-baseline gap-x-2">
              <template v-if="task.taskKey">
                <NuxtLink v-if="task.delegations[0].delegation.taskLink" :to="taskPath(task.delegations[0].delegation)" class="flex-shrink-0 text-sm text-gray-500 underline decoration-gray-300 underline-offset-2 hover:text-blue-700 hover:decoration-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="model-routing-task-link"><TaskKey :task-key="task.taskKey" /></NuxtLink>
                <span v-else class="flex-shrink-0 text-sm text-gray-400" :title="t('settings.modelRouting.decisions.taskGone')"><TaskKey :task-key="task.taskKey" /></span>
              </template>
              <p class="min-w-0 break-words text-base font-semibold text-gray-900" :title="task.taskTitle">{{ task.taskKey ? task.taskTitle : t('settings.modelRouting.decisions.noProjectTask') }}</p>
            </div>
            <p v-if="task.delegations.length === 1 && task.taskKey" class="flex flex-shrink-0 items-baseline gap-4 text-sm">
              <span class="whitespace-nowrap text-gray-400">{{ decisionTime(task.delegations[0].delegation.at, locale, t) }}</span>
              <button v-if="task.delegations[0].delegation.delegatorRunId" type="button" class="inline-flex items-center gap-1 whitespace-nowrap font-medium text-blue-700 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1" data-testid="model-routing-decision-open-run" :title="t('settings.modelRouting.decisions.openRunTitle', { delegator: task.delegations[0].delegation.delegatorName })" @click="openRun(task.delegations[0].delegation.delegatorRunId)">
                {{ t('settings.modelRouting.decisions.openRun') }}<Icon icon="heroicons:arrow-top-right-on-square" class="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </p>
          </div>

          <!-- Each delegation of the Task: a team is one folded row; an agent shows its launch -->
          <div v-for="item in task.delegations" :id="`decision-${item.delegation.id}`" :key="item.delegation.id" class="mt-2" :data-testid="`model-routing-decision-${item.delegation.id}`">
            <p v-if="!task.taskKey" class="mb-1 break-words text-sm font-medium text-gray-900">{{ item.delegation.taskTitle }}</p>
            <div v-if="showRow(task, item)" class="flex items-center justify-between gap-4">
              <component
                :is="isTeam(item.delegation) ? 'button' : 'div'"
                :type="isTeam(item.delegation) ? 'button' : undefined"
                :aria-expanded="isTeam(item.delegation) ? isOpen(item.delegation.id) : undefined"
                class="-ml-1 flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-1 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                :class="isTeam(item.delegation) ? 'hover:bg-slate-50' : ''"
                :data-testid="`model-routing-delegation-${item.delegation.id}`"
                @click="isTeam(item.delegation) && toggle(item.delegation.id)"
              >
                <Icon v-if="isTeam(item.delegation)" icon="heroicons:chevron-right-20-solid" class="h-4 w-4 flex-shrink-0 text-gray-400 transition-transform" :class="isOpen(item.delegation.id) ? 'rotate-90' : ''" aria-hidden="true" />
                <span class="font-medium text-gray-800">{{ item.delegation.targetName }}</span>
                <RemoteNodeChip v-if="item.delegation.node" :node-name="item.delegation.node" size="header" />
                <span v-if="item.delegation.from" class="text-gray-500">{{ t('settings.modelRouting.decisions.fromNode', { node: item.delegation.from }) }}</span>
                <template v-if="isTeam(item.delegation) && !isOpen(item.delegation.id)">
                  <span class="inline-flex items-center gap-1" aria-hidden="true"><span v-for="runtime in runtimesOf(item.choices)" :key="runtime" class="inline-block h-2.5 w-2.5 rounded-[3px]" :style="{ backgroundColor: RUNTIME_COLORS[runtime] }"></span></span>
                  <span class="text-gray-400">{{ t('settings.modelRouting.decisions.agentCount', { count: item.choices.length }) }}</span>
                  <Icon v-if="hasNote(item)" icon="heroicons:exclamation-triangle" class="h-3.5 w-3.5 flex-shrink-0 text-amber-600" :title="t('settings.modelRouting.decisions.hasNotes')" />
                </template>
              </component>
              <p v-if="task.delegations.length > 1 || !task.taskKey" class="flex flex-shrink-0 items-baseline gap-4 text-sm">
                <span class="whitespace-nowrap text-gray-400">{{ decisionTime(item.delegation.at, locale, t) }}</span>
                <button v-if="item.delegation.delegatorRunId" type="button" class="inline-flex items-center gap-1 whitespace-nowrap font-medium text-blue-700 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1" data-testid="model-routing-decision-open-run" :title="t('settings.modelRouting.decisions.openRunTitle', { delegator: item.delegation.delegatorName })" @click="openRun(item.delegation.delegatorRunId)">
                  {{ t('settings.modelRouting.decisions.openRun') }}<Icon icon="heroicons:arrow-top-right-on-square" class="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </p>
            </div>

            <template v-if="!isTeam(item.delegation) || isOpen(item.delegation.id)">
              <p v-if="item.delegation.failure" class="mt-1 flex items-start gap-1.5 pl-5 text-xs text-amber-800" data-testid="model-routing-decision-failure">
                <Icon icon="heroicons:exclamation-triangle" class="mt-px h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                <span>{{ t('settings.modelRouting.decisions.failure', { reason: item.delegation.failure }) }}</span>
              </p>
              <ul :class="isTeam(item.delegation) ? 'mt-1 pl-5' : showRow(task, item) ? 'mt-1' : ''">
                <li v-for="choice in item.choices" :key="choice.agent" class="py-1.5" data-testid="model-routing-decision-row">
                  <div class="grid gap-x-4 gap-y-0.5" :class="showName(task, item) ? 'sm:grid-cols-[14rem_minmax(0,1fr)]' : ''">
                    <p v-if="showName(task, item)" class="flex min-w-0 items-center gap-2 text-sm font-medium text-gray-900">
                      <span :class="isTeam(item.delegation) ? 'truncate' : ''" :title="nameOf(item, choice)">{{ nameOf(item, choice) }}</span>
                      <RemoteNodeChip v-if="!isTeam(item.delegation) && item.delegation.node" :node-name="item.delegation.node" size="header" />
                      <span v-if="!isTeam(item.delegation) && item.delegation.from" class="flex-shrink-0 text-xs font-normal text-gray-500">{{ t('settings.modelRouting.decisions.fromNode', { node: item.delegation.from }) }}</span>
                    </p>
                    <div class="min-w-0">
                      <p class="flex min-w-0 flex-wrap items-baseline gap-x-2 text-sm text-gray-800">
                        <span class="inline-block h-2.5 w-2.5 flex-shrink-0 translate-y-px self-center rounded-[3px]" :style="{ backgroundColor: RUNTIME_COLORS[choice.runtime] }" aria-hidden="true"></span>
                        <span class="min-w-0 truncate"><span class="font-medium">{{ choice.runtimeName }}</span><span class="text-gray-400"> · </span>{{ choice.model }}</span>
                        <span v-if="choice.source !== 'router'" class="flex-shrink-0 text-xs" :class="choice.source === 'inherited' ? 'text-amber-700' : 'text-gray-400'">{{ t(SOURCE_KEY[choice.source]) }}</span>
                      </p>
                      <p v-if="choice.reason" class="mt-0.5 text-xs text-gray-500" data-testid="model-routing-decision-reason">{{ choice.reason }}</p>
                      <p v-if="choice.skipped" class="mt-1 flex items-start gap-1 text-xs text-amber-700" data-testid="model-routing-decision-skipped">
                        <Icon icon="heroicons:exclamation-triangle" class="mt-px h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" /><span>{{ skippedText(choice) }}</span>
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </template>
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
import { decisionTime, SOURCE_KEY } from './modelRoutingPresentation'

const props = defineProps<{ status: RouterStatus; focusId: string | null; source: string }>()
const emit = defineEmits<{ (event: 'show-setup'): void; (event: 'update:source', value: string): void }>()
const { t, resolvedLocale } = useLocalization()
const router = useRouter()
const locale = computed(() => String(resolvedLocale.value || 'en'))

const SOURCES: RoutingSource[] = ['router', 'agent_default', 'team_default', 'inherited']
const PAGE = 8
const sourceFilter = computed(() => props.source)
const limit = ref(PAGE)


const NO_TASK = '__no_project_task__'
type TaskGroup = { taskKey: string | null; taskTitle: string; delegations: { delegation: RoutingDelegation; choices: RoutingChoice[] }[] }
/** One block per Project Task (its key), newest first; a Task delegated more than once lists each delegation under it. */
const tasks = computed<TaskGroup[]>(() => {
  const byKey = new Map<string, TaskGroup>()
  for (const delegation of routing.delegations) {
    const choices = delegation.choices.filter((choice) => !sourceFilter.value || (sourceFilter.value === 'router') === (choice.source === 'router'))
    if (!choices.length) continue
    const key = delegation.taskKey ?? NO_TASK
    const group = byKey.get(key) ?? { taskKey: delegation.taskKey, taskTitle: delegation.taskTitle, delegations: [] }
    group.delegations.push({ delegation, choices })
    byKey.set(key, group)
  }
  return [...byKey.values()]
})

const visible = computed(() => {
  const list = tasks.value.slice(0, limit.value)
  const focus = props.focusId ? tasks.value.findIndex((task) => task.delegations.some((item) => item.delegation.id === props.focusId)) : -1
  return focus >= list.length ? tasks.value.slice(0, focus + 1) : list
})

/** A team (several agents) is a folded row; an agent shows its launch. */
const isTeam = (delegation: RoutingDelegation): boolean => delegation.choices.length > 1
const opened = ref(new Set<string>())
const isOpen = (id: string): boolean => opened.value.has(id) || props.focusId === id
const toggle = (id: string): void => { const next = new Set(opened.value); next.has(id) ? next.delete(id) : next.add(id); opened.value = next }
const runtimesOf = (choices: RoutingChoice[]): string[] => [...new Set(choices.map((choice) => choice.runtime))]
const hasNote = (item: { delegation: RoutingDelegation; choices: RoutingChoice[] }): boolean => Boolean(item.delegation.failure || item.choices.some((choice) => choice.skipped))
const taskPath = (delegation: RoutingDelegation): string => `/projects/${delegation.taskLink!.projectId}/tasks/${delegation.taskLink!.taskId}`
/** The row with the delegation's name (and, with several delegations, its time and Open run) exists for a team, or when the Task header cannot carry them. */
type Item = { delegation: RoutingDelegation; choices: RoutingChoice[] }
const showRow = (task: TaskGroup, item: Item): boolean => isTeam(item.delegation) || task.delegations.length > 1 || !task.taskKey
/** An agent shows its name in the launch row when no row above shows it. */
const showName = (task: TaskGroup, item: Item): boolean => isTeam(item.delegation) || !showRow(task, item)
const nameOf = (item: Item, choice: RoutingChoice): string => (isTeam(item.delegation) ? choice.agent : item.delegation.targetName)
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
