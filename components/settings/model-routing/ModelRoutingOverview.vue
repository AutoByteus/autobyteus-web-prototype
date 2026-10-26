<template>
  <section class="flex flex-col gap-5" data-testid="model-routing-overview" aria-labelledby="model-routing-overview-heading">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0 max-w-3xl px-1">
        <h3 id="model-routing-overview-heading" class="text-xl font-semibold leading-tight text-gray-900">{{ t('settings.modelRouting.overview.title') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ t('settings.modelRouting.overview.description') }}</p>
      </div>
      <div class="flex flex-shrink-0 rounded-lg bg-slate-200/70 p-1" role="radiogroup" :aria-label="t('settings.modelRouting.overview.period')" data-testid="model-routing-period">
        <button
          v-for="option in PERIODS"
          :key="option"
          type="button"
          role="radio"
          :aria-checked="period === option"
          class="rounded-md px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :class="period === option ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
          :data-testid="`model-routing-period-${option}`"
          @click="period = option"
        >{{ t(`settings.modelRouting.overview.period.${option}`) }}</button>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="!overview.total" class="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center" data-testid="model-routing-overview-empty">
      <p class="text-sm font-medium text-gray-700">{{ routing.delegations.length ? t('settings.modelRouting.overview.emptyPeriod') : t('settings.modelRouting.overview.empty') }}</p>
      <p class="mx-auto mt-1 max-w-xl text-sm text-gray-500">{{ routing.delegations.length ? t('settings.modelRouting.overview.emptyPeriodHint') : (routing.enabled ? t('settings.modelRouting.overview.emptyOnHint') : t('settings.modelRouting.overview.emptyOffHint')) }}</p>
      <button v-if="!routing.enabled && !routing.delegations.length" type="button" class="mt-3 text-sm font-medium text-blue-700 hover:text-blue-800" @click="emit('show-setup')">{{ t('settings.modelRouting.status.goToSetup') }}</button>
    </div>

    <template v-else>
      <!-- Router versus defaults -->
      <section class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm" :aria-label="t('settings.modelRouting.overview.sourcesLabel')" data-testid="model-routing-overview-sources">
        <div class="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          <article v-for="tile in tiles" :key="tile.id" class="flex min-h-28 min-w-0 flex-col bg-white px-4 py-4 sm:px-5" :data-tile="tile.id">
            <p class="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-slate-500">{{ tile.label }}</p>
            <p class="mt-2 truncate font-bold tracking-tight tabular-nums" :class="tile.primary ? 'text-4xl text-blue-700' : 'text-2xl text-slate-950'">{{ tile.value }}</p>
            <p class="mt-auto pt-2 text-xs leading-5 text-slate-500">{{ tile.detail }}</p>
          </article>
        </div>
        <div class="bg-white px-4 pb-4 pt-3 sm:px-5">
          <div class="flex h-2.5 w-full gap-0.5" role="img" :aria-label="sourceSummary">
            <span v-for="part in sourceParts" :key="part.source" class="h-full min-w-[3px] first:rounded-l last:rounded-r" :style="{ flexGrow: part.count, backgroundColor: part.color }" :title="`${part.label} · ${part.count}`"></span>
          </div>
          <ul class="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600" data-testid="model-routing-overview-source-legend">
            <li v-for="part in sourceParts" :key="part.source" class="inline-flex items-center gap-1.5">
              <span class="inline-block h-2.5 w-2.5 rounded-[3px]" :style="{ backgroundColor: part.color }" aria-hidden="true"></span>{{ part.label }} <span class="font-semibold tabular-nums text-slate-800">{{ part.count }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- By task kind -->
      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm" aria-labelledby="model-routing-by-kind-heading" data-testid="model-routing-overview-kinds">
        <div class="flex flex-col gap-2 px-6 pb-3 pt-5 sm:flex-row sm:items-start sm:justify-between">
          <div class="min-w-0">
            <h4 id="model-routing-by-kind-heading" class="text-base font-semibold text-gray-900">{{ t('settings.modelRouting.overview.byKind.title') }}</h4>
            <p class="mt-0.5 text-sm text-gray-500">{{ t('settings.modelRouting.overview.byKind.description') }}</p>
          </div>
          <ul class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600" :aria-label="t('settings.modelRouting.overview.byKind.legend')" data-testid="model-routing-overview-runtime-legend">
            <li v-for="runtime in usedRuntimes" :key="runtime.runtime" class="inline-flex items-center gap-1.5">
              <span class="inline-block h-2.5 w-2.5 rounded-[3px]" :style="{ backgroundColor: RUNTIME_COLORS[runtime.runtime] }" aria-hidden="true"></span>{{ runtime.name }}
            </li>
          </ul>
        </div>
        <div class="hidden grid-cols-[11rem_4.5rem_minmax(0,1fr)_5rem] gap-4 border-y border-slate-100 bg-slate-50 px-6 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-slate-500 lg:grid" aria-hidden="true">
          <span>{{ t('settings.modelRouting.decisions.col.kind') }}</span><span class="text-right">{{ t('settings.modelRouting.overview.col.agents') }}</span><span>{{ t('settings.modelRouting.overview.col.runtimes') }}</span><span class="text-right">{{ t('settings.modelRouting.overview.col.details') }}</span>
        </div>
        <ul class="divide-y divide-slate-100" data-testid="model-routing-overview-kind-list">
          <li v-for="kind in overview.kinds" :key="kind.kind" :data-kind="kind.kind || 'none'">
            <div class="grid items-center gap-x-4 gap-y-1.5 px-6 py-3 lg:grid-cols-[11rem_4.5rem_minmax(0,1fr)_5rem]">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-900">{{ kindLabel(kind.kind || null, t) }}</p>
                <p v-if="!kind.kind" class="text-xs text-gray-500">{{ t('settings.modelRouting.overview.notRoutedHint') }}</p>
              </div>
              <p class="text-sm font-semibold tabular-nums text-gray-900 lg:text-right">{{ kind.total }}<span class="font-normal text-gray-500 lg:hidden"> {{ t('settings.modelRouting.overview.col.agentsInline') }}</span></p>
              <div class="min-w-0">
                <div class="flex h-2.5 gap-0.5" role="img" :aria-label="runtimeSummary(kind)" :style="{ width: `${Math.max(12, Math.round((kind.total / maxKindTotal) * 100))}%` }">
                  <span v-for="runtime in kind.runtimes" :key="runtime.runtime" class="h-full min-w-[3px] first:rounded-l last:rounded-r" :style="{ flexGrow: runtime.count, backgroundColor: RUNTIME_COLORS[runtime.runtime] }" :title="`${runtime.name} · ${runtime.count}`"></span>
                </div>
                <p class="mt-1 truncate text-xs text-slate-600">{{ kind.runtimes.map((runtime) => `${runtime.name} ${runtime.count}`).join(' · ') }}</p>
              </div>
              <p class="lg:text-right">
                <button type="button" class="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :aria-expanded="open.has(kind.kind)" :data-testid="`model-routing-overview-details-${kind.kind || 'none'}`" @click="toggle(kind.kind)">
                  {{ t('settings.modelRouting.overview.col.details') }}<Icon icon="heroicons:chevron-down" class="h-3.5 w-3.5 transition-transform" :class="open.has(kind.kind) ? 'rotate-180' : ''" aria-hidden="true" />
                </button>
              </p>
            </div>
            <ul v-if="open.has(kind.kind)" class="border-t border-slate-100 bg-slate-50/60 px-6 py-3" :data-testid="`model-routing-overview-models-${kind.kind || 'none'}`">
              <template v-for="runtime in kind.runtimes" :key="runtime.runtime">
                <li v-for="model in runtime.models" :key="`${runtime.runtime}-${model.model}`" class="flex items-center gap-2 py-1 text-sm text-gray-800">
                  <span class="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-[3px]" :style="{ backgroundColor: RUNTIME_COLORS[runtime.runtime] }" aria-hidden="true"></span>
                  <span class="min-w-0 flex-1 truncate"><span class="font-medium">{{ runtime.name }}</span><span class="text-gray-400"> · </span>{{ model.model }}</span>
                  <span class="tabular-nums text-gray-700">{{ model.count }}</span>
                  <span class="w-12 text-right text-xs tabular-nums text-gray-500">{{ percent(model.count, kind.total) }}</span>
                </li>
              </template>
            </ul>
          </li>
        </ul>
      </section>
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

const tiles = computed(() => {
  const o = overview.value
  const defaults = o.bySource.agent_default + o.bySource.team_default
  return [
    { id: 'total', label: t('settings.modelRouting.overview.tile.total'), value: String(o.total), primary: true, detail: t('settings.modelRouting.overview.tile.totalDetail') },
    { id: 'router', label: t('settings.modelRouting.overview.tile.router'), value: percent(o.bySource.router, o.total), primary: false, detail: t('settings.modelRouting.overview.tile.routerDetail', { count: o.bySource.router }) },
    { id: 'defaults', label: t('settings.modelRouting.overview.tile.defaults'), value: percent(defaults, o.total), primary: false, detail: t('settings.modelRouting.overview.tile.defaultsDetail', { count: defaults }) },
    { id: 'inherited', label: t('settings.modelRouting.overview.tile.inherited'), value: percent(o.bySource.inherited, o.total), primary: false, detail: o.failures ? t('settings.modelRouting.overview.tile.inheritedFailures', { count: o.bySource.inherited, failures: o.failures }) : t('settings.modelRouting.overview.tile.inheritedDetail', { count: o.bySource.inherited }) },
  ]
})
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
