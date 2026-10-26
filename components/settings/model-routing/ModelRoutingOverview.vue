<template>
  <section class="px-1" data-testid="model-routing-overview" :aria-label="t('settings.modelRouting.overview.title')">
    <div class="flex items-center justify-end gap-3">
      <div class="flex flex-shrink-0 rounded-lg bg-slate-100 p-0.5" role="radiogroup" :aria-label="t('settings.modelRouting.overview.period')" data-testid="model-routing-period">
        <button
          v-for="option in PERIODS"
          :key="option"
          type="button"
          role="radio"
          :aria-checked="period === option"
          class="rounded-md px-3 py-1 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :class="period === option ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
          :data-testid="`model-routing-period-${option}`"
          @click="period = option"
        >{{ t(`settings.modelRouting.overview.period.${option}`) }}</button>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="!overview.total" class="mt-10 text-center" data-testid="model-routing-overview-empty">
      <p class="text-sm font-medium text-gray-700">{{ routing.delegations.length ? t('settings.modelRouting.overview.emptyPeriod') : t('settings.modelRouting.overview.empty') }}</p>
      <p class="mx-auto mt-1 max-w-xl text-sm text-gray-500">{{ routing.delegations.length ? t('settings.modelRouting.overview.emptyPeriodHint') : (routing.enabled ? t('settings.modelRouting.overview.emptyOnHint') : t('settings.modelRouting.overview.emptyOffHint')) }}</p>
      <button v-if="!routing.enabled && !routing.delegations.length" type="button" class="mt-3 text-sm font-medium text-blue-700 hover:text-blue-800" @click="emit('show-setup')">{{ t('settings.modelRouting.status.goToSetup') }}</button>
    </div>

    <template v-else>
      <!-- Who chose the launches: one number, one bar -->
      <div class="mt-6" data-testid="model-routing-overview-sources">
        <p class="text-gray-900"><span class="text-3xl font-semibold tabular-nums" data-tile="total">{{ overview.total }}</span> <span class="text-base text-gray-600">{{ t('settings.modelRouting.overview.total') }}</span></p>
        <div class="mt-3 flex h-2.5 w-full gap-0.5" role="img" :aria-label="sourceSummary">
          <span v-for="part in sourceParts" :key="part.source" class="h-full min-w-[3px] first:rounded-l last:rounded-r" :style="{ flexGrow: part.count, backgroundColor: part.color }" :title="`${part.label} · ${part.count}`"></span>
        </div>
        <ul class="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600" data-testid="model-routing-overview-source-legend">
          <li v-for="part in sourceParts" :key="part.source" class="inline-flex items-center gap-1.5">
            <span class="inline-block h-2.5 w-2.5 rounded-[3px]" :style="{ backgroundColor: part.color }" aria-hidden="true"></span>{{ part.label }} <span class="font-medium tabular-nums text-gray-900">{{ part.count }}</span> <span class="tabular-nums text-gray-400">{{ percent(part.count, overview.total) }}</span>
          </li>
        </ul>
        <p v-if="overview.failures" class="mt-2 text-sm text-amber-800">{{ t('settings.modelRouting.overview.failures', { count: overview.failures }) }}</p>
      </div>

      <!-- By task kind -->
      <div class="mt-10" data-testid="model-routing-overview-kinds">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 class="text-base font-semibold text-gray-900">{{ t('settings.modelRouting.overview.byKind.title') }}</h3>
          <ul class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500" :aria-label="t('settings.modelRouting.overview.byKind.legend')" data-testid="model-routing-overview-runtime-legend">
            <li v-for="runtime in usedRuntimes" :key="runtime.runtime" class="inline-flex items-center gap-1.5">
              <span class="inline-block h-2.5 w-2.5 rounded-[3px]" :style="{ backgroundColor: RUNTIME_COLORS[runtime.runtime] }" aria-hidden="true"></span>{{ runtime.name }}
            </li>
          </ul>
        </div>
        <ul class="mt-2 divide-y divide-slate-100" data-testid="model-routing-overview-kind-list">
          <li v-for="kind in overview.kinds" :key="kind.kind" :data-kind="kind.kind || 'none'">
            <button type="button" class="grid w-full items-center gap-x-4 gap-y-1 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:grid-cols-[9rem_minmax(0,1fr)_1.5rem]" :aria-expanded="open.has(kind.kind)" :data-testid="`model-routing-overview-details-${kind.kind || 'none'}`" @click="toggle(kind.kind)">
              <span class="min-w-0">
                <span class="block text-sm font-medium text-gray-900">{{ kindLabel(kind.kind || null, t) }}</span>
                <span v-if="!kind.kind" class="block text-xs text-gray-400">{{ t('settings.modelRouting.overview.notRoutedHint') }}</span>
              </span>
              <span class="flex min-w-0 items-center gap-3">
                <span class="flex h-2 gap-0.5" role="img" :aria-label="runtimeSummary(kind)" :style="{ width: `${Math.max(8, Math.round((kind.total / maxKindTotal) * 70))}%` }">
                  <span v-for="runtime in kind.runtimes" :key="runtime.runtime" class="h-full min-w-[3px] first:rounded-l last:rounded-r" :style="{ flexGrow: runtime.count, backgroundColor: RUNTIME_COLORS[runtime.runtime] }" :title="`${runtime.name} · ${runtime.count}`"></span>
                </span>
                <span class="flex-shrink-0 text-sm font-medium tabular-nums text-gray-700">{{ kind.total }}</span>
              </span>
              <Icon icon="heroicons:chevron-down" class="hidden h-4 w-4 text-gray-400 transition-transform sm:block" :class="open.has(kind.kind) ? 'rotate-180' : ''" aria-hidden="true" />
            </button>
            <ul v-if="open.has(kind.kind)" class="mb-3 ml-[9rem] space-y-1 pl-4" :data-testid="`model-routing-overview-models-${kind.kind || 'none'}`">
              <template v-for="runtime in kind.runtimes" :key="runtime.runtime">
                <li v-for="model in runtime.models" :key="`${runtime.runtime}-${model.model}`" class="flex items-center gap-2 text-sm text-gray-700">
                  <span class="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-[3px]" :style="{ backgroundColor: RUNTIME_COLORS[runtime.runtime] }" aria-hidden="true"></span>
                  <span class="min-w-0 flex-1 truncate"><span class="font-medium">{{ runtime.name }}</span><span class="text-gray-400"> · </span>{{ model.model }}</span>
                  <span class="tabular-nums text-gray-900">{{ model.count }}</span>
                  <span class="w-10 text-right text-xs tabular-nums text-gray-400">{{ percent(model.count, kind.total) }}</span>
                </li>
              </template>
            </ul>
          </li>
        </ul>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { routing, overviewFor, type KindStat, type Period, type RouterStatus } from '~/prototype/model-routing/modelRoutingState'
import { RUNTIME_COLORS, type RoutingSource } from '~/prototype/model-routing/modelRoutingData'
import { kindLabel, SOURCE_KEY } from './modelRoutingPresentation'

defineProps<{ status: RouterStatus }>()
const emit = defineEmits<{ (event: 'show-setup'): void }>()
const { t } = useLocalization()

const PERIODS: Period[] = ['7d', '30d', 'all']
// One colour per source. The router is the emphasis; the defaults are quiet greys; an inherited launch is the warm exception.
const SOURCE_COLOR: Record<RoutingSource, string> = { router: '#1e293b', agent_default: '#94a3b8', team_default: '#cbd5e1', inherited: '#f59e0b' }

const period = ref<Period>('30d')
const open = ref(new Set<string>())
const toggle = (kind: string): void => { const next = new Set(open.value); next.has(kind) ? next.delete(kind) : next.add(kind); open.value = next }

const overview = computed(() => overviewFor(period.value))
const percent = (part: number, total: number): string => (total ? `${Math.round((part / total) * 100)}%` : '—')

const sourceParts = computed(() => (['router', 'agent_default', 'team_default', 'inherited'] as RoutingSource[])
  .map((source) => ({ source, count: overview.value.bySource[source], label: t(SOURCE_KEY[source]), color: SOURCE_COLOR[source] }))
  .filter((part) => part.count > 0))
const sourceSummary = computed(() => sourceParts.value.map((part) => `${part.label} ${part.count}`).join(', '))
const maxKindTotal = computed(() => Math.max(1, ...overview.value.kinds.map((kind) => kind.total)))
const runtimeSummary = (kind: KindStat): string => kind.runtimes.map((runtime) => `${runtime.name} ${runtime.count}`).join(', ')
const usedRuntimes = computed(() => {
  const seen = new Map<string, string>()
  for (const kind of overview.value.kinds) for (const runtime of kind.runtimes) seen.set(runtime.runtime, runtime.name)
  return [...seen.entries()].map(([runtime, name]) => ({ runtime, name }))
})
</script>
