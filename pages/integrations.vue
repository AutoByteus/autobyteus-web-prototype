<template>
  <div class="h-full overflow-auto bg-gray-50">
    <div class="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8" data-testid="integrations-page">
      <header class="mb-6">
        <h1 class="text-3xl font-semibold text-slate-900">{{ t('integrations.page.title') }}</h1>
        <p class="mt-1 text-sm text-slate-600">{{ t('integrations.page.description') }}</p>
      </header>

      <div v-if="!store.loaded" class="flex flex-col items-center gap-3 py-16 text-gray-500" data-testid="integrations-loading">
        <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" aria-hidden="true" />
        <p class="text-sm">{{ t('integrations.page.loading') }}</p>
      </div>

      <!-- The official repository cannot be reached and nothing is installed (REQ-009). -->
      <div
        v-else-if="store.repositoryUnreachable && store.items.length === 0"
        class="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm"
        data-testid="integrations-offline"
      >
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <Icon icon="heroicons:exclamation-triangle" class="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 class="mt-4 text-lg font-semibold text-gray-900">{{ t('integrations.offline.title') }}</h2>
        <p class="mx-auto mt-1 max-w-md text-sm text-gray-500">{{ t('integrations.offline.body', { repository: OFFICIAL_REPOSITORY }) }}</p>
        <p v-if="store.retryFailed" class="mt-3 text-sm text-red-600" role="status" data-testid="integrations-still-failing">
          {{ t('integrations.offline.stillFailing', { repository: OFFICIAL_REPOSITORY }) }}
        </p>
        <button
          type="button"
          class="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
          :disabled="store.retrying"
          data-testid="integrations-retry"
          @click="store.retry()"
        >
          <span v-if="store.retrying" class="inline-block h-4 w-4 animate-spin rounded-full border-b-2 border-white" aria-hidden="true" />
          {{ store.retrying ? t('integrations.offline.retrying') : t('integrations.offline.retry') }}
        </button>
      </div>

      <template v-else>
        <!-- The repository cannot be reached, but installed integrations still show. -->
        <div
          v-if="store.repositoryUnreachable"
          class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3"
          role="status"
          data-testid="integrations-offline-banner"
        >
          <p class="flex min-w-0 flex-1 basis-72 items-start gap-2 text-sm text-amber-900">
            <Icon icon="heroicons:exclamation-triangle" class="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" aria-hidden="true" />
            <span>{{ t('integrations.offline.banner', { repository: OFFICIAL_REPOSITORY }) }}</span>
          </p>
          <button
            type="button"
            class="inline-flex h-8 items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 text-sm font-medium text-amber-900 hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="store.retrying"
            data-testid="integrations-retry"
            @click="store.retry()"
          >
            <span v-if="store.retrying" class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-b-2 border-amber-700" aria-hidden="true" />
            {{ store.retrying ? t('integrations.offline.retrying') : t('integrations.offline.retry') }}
          </button>
        </div>

        <ul class="space-y-5" role="list" :aria-label="t('integrations.page.listLabel')">
          <li v-for="item in store.items" :key="item.id">
            <IntegrationCard :item="item" />
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import IntegrationCard from '~/components/integrations/IntegrationCard.vue'
import { useLocalization } from '~/composables/useLocalization'
import { OFFICIAL_REPOSITORY } from '~/prototype/integrations/integrationsDesignFixture'
import { useIntegrationsStore } from '~/stores/integrationsStore'

const store = useIntegrationsStore()
const { t } = useLocalization()

onMounted(() => { void store.load() })
</script>
