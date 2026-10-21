<template>
  <section class="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm" data-testid="remote-collaboration-availability">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="text-xl font-semibold text-gray-900">{{ t('settings.components.settings.RemoteCollaboration.availability.title') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ t('settings.components.settings.RemoteCollaboration.availability.note') }}</p>
      </div>
      <button
        v-if="switchOn"
        type="button"
        class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:text-slate-300"
        :disabled="offers.shared.phase === 'loading'"
        :title="t('settings.components.settings.RemoteCollaboration.availability.refresh')"
        :aria-label="t('settings.components.settings.RemoteCollaboration.availability.refresh')"
        data-testid="remote-collaboration-availability-refresh"
        @click="offers.loadShared()"
      >
        <svg class="h-4 w-4" :class="offers.shared.phase === 'loading' ? 'animate-spin' : ''" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M16 10a6 6 0 1 1-1.8-4.3" stroke-linecap="round" /><path d="M16.2 3v3.2h-3.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <p
      v-if="!switchOn"
      class="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
      data-testid="remote-collaboration-availability-off-notice"
    >
      {{ t('settings.components.settings.RemoteCollaboration.availability.switchOff') }}
    </p>

    <div v-else class="mt-4" aria-live="polite">
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
        <p v-if="attention.length" class="mb-1 text-sm font-medium text-slate-800" data-testid="remote-collaboration-attention-title">
          {{ t('settings.components.settings.RemoteCollaboration.availability.attentionTitle', { count: attention.length }) }}
        </p>
        <ul v-if="attention.length" class="divide-y divide-slate-100 border-t border-slate-100" data-testid="remote-collaboration-attention-list">
          <li v-for="entry in attention" :key="entry.key" class="py-3" data-testid="remote-collaboration-attention-entry">
            <div class="flex items-start justify-between gap-3">
              <p class="min-w-0 text-sm font-medium text-slate-900 break-words">
                {{ entry.name }}
                <span class="ml-1.5 text-xs font-normal text-slate-400">{{ entry.kind === 'AGENT' ? t('settings.components.settings.RemoteCollaboration.availability.kindAgent') : t('settings.components.settings.RemoteCollaboration.availability.kindTeam') }}</span>
              </p>
              <span
                class="inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="entry.readiness.state === 'no_default' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'"
                :data-testid="`remote-collaboration-readiness-${entry.readiness.state}`"
              >
                {{ entry.readiness.state === 'no_default' ? t('settings.components.settings.RemoteCollaboration.availability.noDefault') : t('settings.components.settings.RemoteCollaboration.availability.cannotRun') }}
              </span>
            </div>
            <p class="mt-1 text-sm text-slate-600" data-testid="remote-collaboration-readiness-reason">
              {{ reasonOf(entry) }}
              <NuxtLink
                :to="settingsPath(entry)"
                class="ml-1 whitespace-nowrap font-medium text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                data-testid="remote-collaboration-settings-link"
              >
                {{ entry.kind === 'AGENT' ? t('settings.components.settings.RemoteCollaboration.availability.link.agent') : t('settings.components.settings.RemoteCollaboration.availability.link.team') }} →
              </NuxtLink>
            </p>
          </li>
        </ul>

        <p v-if="!attention.length" class="flex items-center gap-1.5 text-sm font-medium text-emerald-700" data-testid="remote-collaboration-availability-all-ready">
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m4.5 10.5 3.5 3.5 7.5-8" stroke-linecap="round" stroke-linejoin="round" /></svg>
          {{ t('settings.components.settings.RemoteCollaboration.availability.allReady') }}
        </p>

      </template>

      <div class="mt-4 border-t border-slate-100 pt-3">
        <button
          type="button"
          class="flex items-center gap-2 rounded-md py-1 text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :aria-expanded="rulesOpen"
          data-testid="remote-collaboration-availability-rules-toggle"
          @click="rulesOpen = !rulesOpen"
        >
          <svg class="h-4 w-4 text-slate-400 transition-transform" :class="rulesOpen ? 'rotate-90' : ''" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
          {{ t('settings.components.settings.RemoteCollaboration.availability.rulesTitle') }}
        </button>
        <ul v-if="rulesOpen" class="mt-2 list-disc space-y-1 pl-10 text-sm text-gray-500" data-testid="remote-collaboration-availability-rules">
          <li>{{ t('settings.components.settings.RemoteCollaboration.availability.rule.runtime') }}</li>
          <li>{{ t('settings.components.settings.RemoteCollaboration.availability.rule.workspace') }}</li>
          <li>{{ t('settings.components.settings.RemoteCollaboration.availability.rule.login') }}</li>
          <li>{{ t('settings.components.settings.RemoteCollaboration.availability.rule.refused') }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocalization } from '~/composables/useLocalization'
import type { SharedEntry } from '~/prototype/remote-collaboration/offersScript'
import { useRemoteCollaborationOffersStore } from '~/stores/remoteCollaborationOffersStore'

defineProps<{ switchOn: boolean }>()

const { t } = useLocalization()
const offers = useRemoteCollaborationOffersStore()
const rulesOpen = ref(false)

const attention = computed(() => offers.shared.entries.filter((entry) => entry.readiness.state !== 'ready').sort((a, b) => a.name.localeCompare(b.name)))

const reasonOf = (entry: SharedEntry): string => {
  const base = 'settings.components.settings.RemoteCollaboration.availability.reason.'
  const readiness = entry.readiness
  if (readiness.state === 'cannot_run') return t(`${base}cannotRun`, { reason: readiness.reason })
  if (readiness.state === 'no_default' && readiness.member) return t(`${base}noDefaultMember`, { member: readiness.member })
  return t(`${base}noDefaultAgent`)
}

const settingsPath = (entry: SharedEntry): string => entry.kind === 'AGENT'
  ? `/agents?view=edit&id=${encodeURIComponent(entry.definitionId)}`
  : `/agent-teams?view=team-edit&id=${encodeURIComponent(entry.definitionId)}`
</script>
