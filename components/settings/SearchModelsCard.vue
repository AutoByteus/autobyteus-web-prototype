<template>
  <section class="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm" data-testid="search-models-card" aria-labelledby="search-models-heading">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div class="min-w-0 max-w-3xl">
        <h3 id="search-models-heading" class="text-2xl font-semibold leading-tight text-gray-900">{{ t('settings.search.models.title') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ t('settings.search.models.description') }}</p>
      </div>
      <p class="flex-shrink-0 text-sm text-gray-500 sm:pt-1.5" data-testid="search-disk-total">{{ t('settings.search.models.disk', { size: mb(diskMb) }) }}</p>
    </div>

    <ul class="mt-5 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200" :aria-label="t('settings.search.models.listLabel')">
      <li
        v-for="model in CATALOG"
        :key="model.id"
        tabindex="-1"
        class="px-4 py-4 focus:outline-none"
        :class="isActive(model) ? 'bg-blue-50/40' : 'bg-white'"
        :data-testid="`search-model-${model.id}`"
        :data-state="rowState(model)"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div class="min-w-0">
            <div class="flex flex-wrap items-baseline gap-x-2">
              <h4 class="text-base font-semibold text-gray-900">{{ model.name }}</h4>
              <span v-if="model.id === DEFAULT_ID" class="text-xs text-gray-400">{{ t('settings.search.models.defaultTag') }}</span>
            </div>

            <!-- one status line: a dot and plain words, never a boxed pill -->
            <p class="mt-1 flex flex-wrap items-center gap-x-2 text-sm">
              <template v-if="isActive(model)">
                <span class="font-medium text-blue-700" data-testid="search-pill-active">{{ t('settings.search.state.active') }}</span>
                <span class="text-gray-300" aria-hidden="true">·</span>
                <span v-if="state.readiness.kind === 'ready'" class="inline-flex items-center gap-1.5 text-green-700" data-testid="search-pill-ready"><span class="h-1.5 w-1.5 rounded-full bg-green-600"></span>{{ t('settings.search.readiness.ready') }}</span>
                <span v-else-if="state.readiness.kind === 'preparing'" class="inline-flex items-center gap-1.5 text-amber-700" data-testid="search-pill-preparing"><span class="h-3 w-3 animate-spin rounded-full border-2 border-amber-300 border-t-amber-600"></span>{{ t('settings.search.readiness.preparing') }}</span>
                <span v-else class="inline-flex items-center gap-1.5 text-red-700" data-testid="search-pill-unavailable"><span class="h-1.5 w-1.5 rounded-full bg-red-600"></span>{{ t('settings.search.readiness.unavailable') }}</span>
              </template>
              <span v-else-if="runtime(model).file === 'downloading'" class="inline-flex items-center gap-1.5 text-amber-700" data-testid="search-pill-downloading"><span class="h-3 w-3 animate-spin rounded-full border-2 border-amber-300 border-t-amber-600"></span>{{ t('settings.search.state.downloading') }}</span>
              <span v-else-if="runtime(model).file === 'downloaded'" class="text-gray-700" data-testid="search-pill-downloaded">{{ t('settings.search.state.downloaded') }}</span>
              <span v-else class="text-gray-400" data-testid="search-pill-not-downloaded">{{ t('settings.search.state.notDownloaded') }}</span>

            </p>

            <!-- the catalog facts: one quiet line (labels live in the aria text) -->
            <p class="mt-1.5 flex flex-wrap gap-x-3 text-sm text-gray-500 sm:gap-x-0" :data-testid="`search-model-${model.id}-facts`">
              <span v-for="(fact, i) in facts(model)" :key="fact.id" class="whitespace-nowrap"><span v-if="i > 0" class="mx-1.5 hidden text-gray-300 sm:inline" aria-hidden="true">·</span><span class="sr-only">{{ fact.label }}: </span>{{ fact.value }}</span>
            </p>

            <!-- progress: a bar and one line, no box -->
            <div v-if="runtime(model).file === 'downloading' && !isActive(model)" class="mt-3 max-w-md" :data-testid="`search-model-${model.id}-progress`">
              <div class="h-1.5 overflow-hidden rounded-full bg-gray-100" role="progressbar" :aria-label="`${model.name}: ${t('settings.search.state.downloading')}`" aria-valuemin="0" :aria-valuemax="model.sizeMb" :aria-valuenow="runtime(model).downloadedMb">
                <div class="h-full rounded-full bg-blue-500 transition-all duration-300" :style="{ width: `${percent(model)}%` }"></div>
              </div>
              <p class="mt-1.5 text-xs text-gray-500">{{ t('settings.search.progress.download', { done: runtime(model).downloadedMb, total: model.sizeMb }) }} · {{ percent(model) }}%</p>
            </div>
            <div v-if="isActive(model) && state.readiness.kind === 'preparing'" class="mt-3 max-w-md" :data-testid="`search-model-${model.id}-preparing`">
              <template v-if="state.readiness.phase === 'download'">
                <div class="h-1.5 overflow-hidden rounded-full bg-gray-100" role="progressbar" :aria-label="`${model.name}: ${t('settings.search.readiness.preparing')}`" aria-valuemin="0" :aria-valuemax="model.sizeMb" :aria-valuenow="runtime(model).downloadedMb">
                  <div class="h-full rounded-full bg-blue-500 transition-all duration-300" :style="{ width: `${percent(model)}%` }"></div>
                </div>
                <p class="mt-1.5 text-xs text-gray-500">{{ t('settings.search.progress.preparingDownload', { done: runtime(model).downloadedMb, total: model.sizeMb }) }} · {{ percent(model) }}%</p>
              </template>
              <template v-else>
                <div class="h-1.5 overflow-hidden rounded-full bg-gray-100"><div class="h-full w-1/3 animate-pulse rounded-full bg-blue-500"></div></div>
                <p class="mt-1.5 text-xs text-gray-500">{{ t('settings.search.progress.preparingLoad') }}</p>
              </template>
            </div>

            <!-- problems and outcomes: plain text lines -->
            <div v-if="isActive(model) && state.readiness.kind === 'unavailable'" class="mt-3 text-sm" role="alert" :data-testid="`search-model-${model.id}-unavailable`">
              <p class="text-red-700">{{ t('settings.search.unavailable.reason', { reason: t(state.readiness.reasonKey) }) }}</p>
              <p class="mt-0.5 text-gray-500">{{ t('settings.search.unavailable.exactStillWorks') }}</p>
            </div>
            <div v-if="runtime(model).failureKey && !isActive(model)" class="mt-3 text-sm" role="alert" :data-testid="`search-model-${model.id}-failed`">
              <p class="text-red-700">{{ t('settings.search.failed.reason', { reason: t(runtime(model).failureKey!) }) }}</p>
              <p class="mt-0.5 text-gray-500">{{ t('settings.search.failed.noPartial') }}</p>
            </div>
            <p v-if="runtime(model).noticeKey && !isActive(model) && runtime(model).file !== 'downloading'" class="mt-3 text-sm text-gray-500" role="status" :data-testid="`search-model-${model.id}-notice`">{{ t(runtime(model).noticeKey!, runtime(model).noticeParams) }}</p>
          </div>

          <div class="flex flex-shrink-0 flex-wrap items-center gap-2" :data-testid="`search-model-${model.id}-actions`">
            <template v-if="runtime(model).file === 'downloading' && !isActive(model)">
              <button type="button" :class="secondaryButton" :data-testid="`search-model-${model.id}-cancel`" @click="cancelDownload(model.id)">{{ t('settings.search.actions.cancel') }}</button>
            </template>
            <template v-else-if="isActive(model)">
              <button v-if="state.readiness.kind === 'unavailable'" type="button" :class="secondaryButton" :data-testid="`search-model-${model.id}-retry`" @click="retryModel()">{{ t('settings.search.actions.retry') }}</button>
            </template>
            <template v-else-if="!runtime(model).confirmingRemove">
              <button v-if="runtime(model).file === 'not_downloaded' && !runtime(model).failureKey" type="button" :class="secondaryButton" :data-testid="`search-model-${model.id}-download`" @click="startDownload(model.id)">{{ t('settings.search.actions.download') }}</button>
              <button v-if="runtime(model).failureKey" type="button" :class="secondaryButton" :data-testid="`search-model-${model.id}-retry`" @click="startDownload(model.id)">{{ t('settings.search.actions.retry') }}</button>
              <button type="button" :class="secondaryButton" :data-testid="`search-model-${model.id}-use`" @click="$emit('use', model.id)">{{ t('settings.search.actions.use') }}</button>
              <button v-if="runtime(model).file === 'downloaded'" type="button" :class="textDangerButton" :data-testid="`search-model-${model.id}-remove`" @click="askRemove(model.id, true)">{{ t('settings.search.actions.remove') }}</button>
            </template>
          </div>
        </div>

        <!-- Remove: inline confirmation -->
        <div v-if="runtime(model).confirmingRemove" class="mt-3 flex flex-col gap-3 rounded-lg bg-gray-50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between" role="group" :aria-label="t('settings.search.actions.remove')" :data-testid="`search-model-${model.id}-remove-confirmation`" @keydown.esc.prevent="askRemove(model.id, false)">
          <p class="text-sm text-gray-700">{{ t('settings.search.removeConfirm.text', { name: model.name, size: model.sizeMb }) }}</p>
          <div class="flex flex-shrink-0 items-center gap-2">
            <button type="button" class="inline-flex min-h-9 items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1" :data-testid="`search-model-${model.id}-remove-confirm`" @click="removeModel(model.id)">{{ t('settings.search.actions.remove') }}</button>
            <button type="button" :class="secondaryButton" :data-testid="`search-model-${model.id}-remove-cancel`" @click="askRemove(model.id, false)">{{ t('settings.search.actions.cancel') }}</button>
          </div>
        </div>
      </li>
    </ul>
    <p class="mt-3 text-xs text-gray-500">{{ t('settings.search.models.footnote') }}</p>
  </section>
</template>

<script setup lang="ts">
import {
  askRemove, cancelDownload, CATALOG, removeModel, retryModel, startDownload, useSearchSettingsState,
  type CatalogModel, type ModelRuntime,
} from '~/prototype/search-settings/searchSettingsFixture'

defineEmits<{ (e: 'use', id: CatalogModel['id']): void }>()

const { t } = useLocalization()
const { state, diskMb } = useSearchSettingsState()
const DEFAULT_ID = 'granite-small-english-r2'

const runtime = (model: CatalogModel): ModelRuntime => state.models[model.id]
const isActive = (model: CatalogModel) => state.activeId === model.id
const mb = (value: number) => t('settings.search.facts.size', { mb: value })
const percent = (model: CatalogModel) => Math.round((runtime(model).downloadedMb / model.sizeMb) * 100)
// Two facts at most: the language label (optional, from the catalog) and the download size (always known).
const facts = (model: CatalogModel) => [
  { id: 'languages', label: t('settings.search.facts.languages'), value: t(`settings.search.facts.languagesValue.${model.id}`) },
  { id: 'size', label: t('settings.search.facts.download'), value: t('settings.search.facts.size', { mb: model.sizeMb }) },
]
const rowState = (model: CatalogModel) => (isActive(model) ? `active-${state.readiness.kind}` : runtime(model).file)

const secondaryButton = 'inline-flex min-h-9 items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1'
const textDangerButton = 'inline-flex min-h-9 items-center rounded-md px-2.5 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1'
</script>
