<template>
  <div class="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8" data-testid="settings-search-panel">
    <header class="space-y-2">
      <p class="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">{{ t('settings.search.eyebrow') }}</p>
      <h2 class="text-3xl font-semibold text-gray-900">{{ t('settings.search.title') }}</h2>
      <p class="max-w-2xl text-sm leading-6 text-gray-600">{{ t('settings.search.description') }}</p>
    </header>

    <div v-if="state.loadStatus === 'loading'" class="flex flex-col gap-6" data-testid="search-loading" aria-busy="true">
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="h-5 w-40 animate-pulse rounded bg-gray-100"></div>
        <div class="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-gray-100"></div>
        <div class="mt-5 space-y-3">
          <div v-for="n in 3" :key="n" class="h-[116px] animate-pulse rounded-lg border border-gray-100 bg-gray-50"></div>
        </div>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="h-5 w-40 animate-pulse rounded bg-gray-100"></div>
        <div class="mt-5 space-y-3">
          <div v-for="n in 3" :key="n" class="h-10 animate-pulse rounded-lg bg-gray-50"></div>
        </div>
      </div>
    </div>

    <div v-else-if="state.loadStatus === 'error'" class="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700" role="alert" data-testid="search-load-error">
      <span>{{ t('settings.search.loadError') }}</span>
      <button type="button" class="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500" data-testid="search-load-retry" @click="retryLoad">{{ t('settings.search.retry') }}</button>
    </div>

    <template v-else>
      <SearchModelsCard @use="switchTarget = $event" />
      <SearchProjectIndexesCard />
    </template>

    <SearchModelSwitchDialog v-if="switchTarget" :model-id="switchTarget" @cancel="switchTarget = null" @confirm="confirmSwitch" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import SearchModelsCard from '~/components/settings/SearchModelsCard.vue'
import SearchProjectIndexesCard from '~/components/settings/SearchProjectIndexesCard.vue'
import SearchModelSwitchDialog from '~/components/settings/SearchModelSwitchDialog.vue'
import { initSearchSettings, retryLoad, useModel, useSearchSettingsState, type ModelId } from '~/prototype/search-settings/searchSettingsFixture'

const { t } = useLocalization()
const { state } = useSearchSettingsState()
const switchTarget = ref<ModelId | null>(null)

// Opening the section only reads status (REQ-005): initSearchSettings seeds and shows; it starts nothing.
onMounted(() => initSearchSettings())

// After the switch, focus lands on the new Active row so the change is announced and keyboard users keep their place.
const confirmSwitch = async () => {
  const id = switchTarget.value
  if (id) useModel(id)
  switchTarget.value = null
  if (id) {
    await nextTick()
    document.querySelector<HTMLElement>(`[data-testid="search-model-${id}"]`)?.focus()
  }
}
</script>
