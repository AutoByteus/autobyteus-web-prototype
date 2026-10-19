<template>
  <section class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm" data-testid="search-projects-card" aria-labelledby="search-projects-heading">
    <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
      <div class="min-w-0">
        <h3 id="search-projects-heading" class="text-lg font-semibold text-gray-900">{{ t('settings.search.projects.title') }}</h3>
        <p class="mt-1 text-sm text-gray-500" data-testid="search-projects-subtitle">{{ t('settings.search.projects.subtitle', { model: activeModel.name }) }}</p>
      </div>
      <button
        type="button"
        :class="primaryButton"
        :disabled="!canIndexAll"
        :title="canIndexAll ? undefined : (unavailable ? t('settings.search.projects.unavailableNote') : t('settings.search.projects.indexAllDone'))"
        data-testid="search-index-all"
        @click="indexAll"
      >{{ t('settings.search.projects.indexAll') }}</button>
    </div>
    <p class="mt-3 text-sm text-gray-600">{{ t('settings.search.projects.help') }}</p>

    <p v-if="state.projects.length === 0" class="mt-5 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600" data-testid="search-projects-empty">{{ t('settings.search.projects.empty') }}</p>

    <template v-else>
      <div v-if="!unavailable || state.projects.length > 8" class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div v-if="!unavailable" class="flex flex-wrap gap-2" role="group" :aria-label="t('settings.search.projects.filterLabel')" data-testid="search-project-filters">
          <button
            v-for="chip in chips"
            :key="chip.id"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
            :class="filter === chip.id ? 'border-blue-200 bg-blue-50 font-medium text-blue-800' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'"
            :aria-pressed="filter === chip.id"
            :data-testid="`search-filter-${chip.id}`"
            @click="filter = chip.id"
          >{{ t(`settings.search.projects.filter.${chip.id}`) }}<span :class="filter === chip.id ? 'text-blue-700' : 'text-gray-400'">{{ chip.count }}</span></button>
        </div>
        <label v-if="state.projects.length > 8" class="relative block sm:w-56">
          <span class="sr-only">{{ t('settings.search.projects.findLabel') }}</span>
          <svg class="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.45 4.39l3.58 3.58a.75.75 0 1 1-1.06 1.06l-3.58-3.58A7 7 0 0 1 2 9Z" clip-rule="evenodd"/></svg>
          <input v-model="query" type="search" class="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" :placeholder="t('settings.search.projects.findPlaceholder')" data-testid="search-project-find" />
        </label>
      </div>

      <ul class="mt-3 divide-y divide-gray-100 rounded-lg border border-gray-200" :aria-label="t('settings.search.projects.listLabel')" data-testid="search-project-list">
        <li v-for="p in visible" :key="p.id" class="px-4 py-3" :data-testid="`search-project-${p.id}`" :data-state="displayState(p)">
          <div class="flex flex-col gap-2 sm:min-h-[2.5rem] sm:flex-row sm:items-center sm:gap-4">
            <div class="min-w-0 sm:w-[30%]">
              <p class="truncate text-sm font-medium text-gray-900" :title="p.name">{{ p.name }}</p>
            </div>
            <div class="min-w-0 flex-1 text-sm" :data-testid="`search-project-${p.id}-status`">
              <template v-if="displayState(p) === 'indexing'">
                <div class="flex items-center gap-2 text-amber-800">
                  <span class="h-3 w-3 flex-shrink-0 animate-spin rounded-full border-2 border-amber-300 border-t-amber-700"></span>
                  <span>{{ t('settings.search.projects.state.indexing', { done: p.done, total: p.total }) }}</span>
                </div>
                <div class="mt-1.5 h-1.5 max-w-xs overflow-hidden rounded-full bg-amber-100" role="progressbar" :aria-label="`${p.name}: ${t('settings.search.projects.filter.indexing')}`" aria-valuemin="0" :aria-valuemax="p.total" :aria-valuenow="p.done">
                  <div class="h-full rounded-full bg-amber-500 transition-all duration-300" :style="{ width: `${Math.round((p.done / p.total) * 100)}%` }"></div>
                </div>
              </template>
              <div v-else-if="displayState(p) === 'waiting'" class="flex items-center gap-2 text-gray-500">
                <span class="h-3 w-3 flex-shrink-0 rounded-full border-2 border-gray-300"></span>
                <span>{{ state.readiness.kind === 'preparing' ? t('settings.search.projects.state.waitingModel') : t('settings.search.projects.state.waiting') }}</span>
              </div>
              <div v-else-if="displayState(p) === 'ready'" class="flex items-center gap-2 text-green-700">
                <svg class="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.86-9.64a.75.75 0 0 0-1.22-.88l-3.3 4.58-1.78-1.78a.75.75 0 0 0-1.06 1.06l2.4 2.4a.75.75 0 0 0 1.14-.1l3.82-5.28Z" clip-rule="evenodd"/></svg>
                <span>{{ p.tasks === 1 ? t('settings.search.projects.state.readyOne') : t('settings.search.projects.state.ready', { count: p.tasks }) }}</span>
              </div>
              <div v-else-if="displayState(p) === 'needs_update'" class="flex items-center gap-2 text-amber-800">
                <span class="h-2 w-2 flex-shrink-0 rounded-full bg-amber-500"></span>
                <span>{{ t('settings.search.projects.state.needsUpdate', { count: p.changed }) }}</span>
              </div>
              <div v-else-if="displayState(p) === 'unavailable'" class="flex items-center gap-2 text-red-700">
                <span class="h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></span>
                <span>{{ t('settings.search.projects.state.unavailable') }}</span>
              </div>
              <div v-else class="flex items-center gap-2 text-gray-600">
                <span class="h-2 w-2 flex-shrink-0 rounded-full bg-gray-300"></span>
                <span>{{ t('settings.search.projects.state.notIndexed') }}</span>
              </div>
            </div>
            <div class="flex flex-shrink-0 flex-wrap items-center gap-2 sm:w-[14.5rem] sm:justify-end">
              <template v-if="!p.confirmingRebuild">
                <button v-if="canIndex(p)" type="button" :class="secondaryButtonAccent" :data-testid="`search-project-${p.id}-index`" @click="indexNow(p.id)">{{ t('settings.search.projects.indexNow') }}</button>
                <button v-if="canRebuild(p)" type="button" :class="secondaryButton" :data-testid="`search-project-${p.id}-rebuild`" @click="askRebuild(p.id, true)">{{ t('settings.search.projects.rebuild') }}</button>
              </template>
            </div>
          </div>

          <div v-if="p.confirmingRebuild" class="mt-3 flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between" role="group" :aria-label="t('settings.search.projects.rebuild')" :data-testid="`search-project-${p.id}-rebuild-confirmation`" @keydown.esc.prevent="askRebuild(p.id, false)">
            <p class="text-sm text-gray-700">{{ t('settings.search.projects.rebuildConfirm', { name: p.name }) }}</p>
            <div class="flex flex-shrink-0 items-center gap-2">
              <button type="button" :class="primaryButton" :data-testid="`search-project-${p.id}-rebuild-confirm`" @click="rebuild(p.id)">{{ t('settings.search.projects.rebuild') }}</button>
              <button type="button" :class="secondaryButton" :data-testid="`search-project-${p.id}-rebuild-cancel`" @click="askRebuild(p.id, false)">{{ t('settings.search.actions.cancel') }}</button>
            </div>
          </div>
        </li>
        <li v-if="visible.length === 0" class="px-4 py-6 text-center text-sm text-gray-500" data-testid="search-projects-no-match">{{ t('settings.search.projects.noMatch') }}</li>
      </ul>
      <p v-if="unavailable" class="mt-3 text-sm text-red-700" data-testid="search-projects-unavailable-note">{{ t('settings.search.projects.unavailableNote') }}</p>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  askRebuild, indexAll, indexNow, rebuild, useSearchSettingsState, type ProjectRuntime,
} from '~/prototype/search-settings/searchSettingsFixture'

const { t } = useLocalization()
const { state, activeModel, unavailable, canIndexAll } = useSearchSettingsState()

type Filter = 'all' | 'needs' | 'indexing' | 'ready'
const filter = ref<Filter>('all')
const query = ref('')

const displayState = (p: ProjectRuntime) => (unavailable.value ? 'unavailable' : p.state)
const isBusy = (p: ProjectRuntime) => p.state === 'indexing' || p.state === 'waiting'
const canIndex = (p: ProjectRuntime) => !unavailable.value && (p.state === 'not_indexed' || p.state === 'needs_update')
const canRebuild = (p: ProjectRuntime) => !unavailable.value && (p.state === 'ready' || p.state === 'needs_update')

const matches = (p: ProjectRuntime, id: Filter) =>
  id === 'all'
  || (id === 'needs' && (p.state === 'not_indexed' || p.state === 'needs_update'))
  || (id === 'indexing' && isBusy(p))
  || (id === 'ready' && p.state === 'ready')

const chips = computed(() => (['all', 'needs', 'indexing', 'ready'] as Filter[]).map((id) => ({
  id, count: state.projects.filter((p) => matches(p, id)).length,
})))

const visible = computed(() => state.projects.filter((p) =>
  (unavailable.value || matches(p, filter.value)) && p.name.toLowerCase().includes(query.value.trim().toLowerCase())))

const primaryButton = 'inline-flex min-h-9 items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
const secondaryButton = 'inline-flex min-h-9 items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1'
const secondaryButtonAccent = 'inline-flex min-h-9 items-center rounded-md border border-blue-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1'
</script>
