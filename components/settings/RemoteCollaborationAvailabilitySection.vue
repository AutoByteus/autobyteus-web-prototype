<template>
  <section class="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm" data-testid="remote-collaboration-availability">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="text-xl font-semibold text-gray-900">{{ t('settings.components.settings.RemoteCollaboration.availability.title') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ t('settings.components.settings.RemoteCollaboration.availability.note') }}</p>
      </div>
      <button
        v-if="switchOn"
        type="button"
        class="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
        :disabled="offers.shared.phase === 'loading'"
        data-testid="remote-collaboration-availability-refresh"
        @click="offers.loadShared()"
      >
        {{ t('settings.components.settings.RemoteCollaboration.availability.refresh') }}
      </button>
    </div>

    <ul class="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-500" data-testid="remote-collaboration-availability-rules">
      <li>{{ t('settings.components.settings.RemoteCollaboration.availability.rule.runtime') }}</li>
      <li>{{ t('settings.components.settings.RemoteCollaboration.availability.rule.workspace') }}</li>
      <li>{{ t('settings.components.settings.RemoteCollaboration.availability.rule.login') }}</li>
      <li>{{ t('settings.components.settings.RemoteCollaboration.availability.rule.refused') }}</li>
    </ul>

    <p
      v-if="!switchOn"
      class="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
      data-testid="remote-collaboration-availability-off-notice"
    >
      {{ t('settings.components.settings.RemoteCollaboration.availability.switchOff') }}
    </p>

    <div v-else class="mt-4 border-t border-slate-100 pt-4" aria-live="polite">
      <p v-if="offers.shared.phase === 'loading' || offers.shared.phase === 'idle'" class="flex items-center gap-2 text-sm text-slate-500" data-testid="remote-collaboration-availability-loading">
        <span class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-b-2 border-slate-500" aria-hidden="true" />
        {{ t('settings.components.settings.RemoteCollaboration.availability.loading') }}
      </p>
      <p v-else-if="offers.shared.phase === 'error'" class="text-sm text-red-700" role="alert" data-testid="remote-collaboration-availability-error">
        {{ t('settings.components.settings.RemoteCollaboration.availability.error') }}
        <button type="button" class="font-medium underline" @click="offers.loadShared()">{{ t('settings.components.settings.RemoteCollaboration.availability.retry') }}</button>
      </p>
      <p v-else-if="offers.shared.entries.length === 0" class="text-sm text-slate-500" data-testid="remote-collaboration-availability-empty">
        {{ t('settings.components.settings.RemoteCollaboration.availability.empty') }}
      </p>
      <template v-else>
        <p class="mb-3 text-sm font-medium" :class="attention === 0 ? 'text-emerald-700' : 'text-slate-700'" data-testid="remote-collaboration-availability-summary">
          {{ summary }}
        </p>
        <RemoteCollaborationOfferList :entries="offers.shared.entries" test-id="remote-collaboration-shared-offer" />
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RemoteCollaborationOfferList from '~/components/settings/RemoteCollaborationOfferList.vue'
import { useLocalization } from '~/composables/useLocalization'
import { useRemoteCollaborationOffersStore } from '~/stores/remoteCollaborationOffersStore'

defineProps<{ switchOn: boolean }>()

const { t } = useLocalization()
const offers = useRemoteCollaborationOffersStore()

const attention = computed(() => offers.shared.entries.filter((entry) => entry.readiness.state !== 'ready').length)
const summary = computed(() => {
  const shared = offers.shared.entries.length
  return attention.value === 0
    ? t('settings.components.settings.RemoteCollaboration.availability.summaryAllReady', { shared })
    : t('settings.components.settings.RemoteCollaboration.availability.summary', { shared, ready: shared - attention.value, attention: attention.value })
})
</script>
