<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4" data-testid="integration-sources-overlay" @click.self="close">
    <section
      ref="panelRef"
      class="flex max-h-[min(44rem,90vh)] w-full max-w-[42rem] flex-col overflow-hidden rounded-2xl bg-white shadow-xl focus:outline-none"
      :inert="confirmation ? true : undefined"
      role="dialog"
      aria-modal="true"
      aria-labelledby="integration-sources-title"
      :aria-busy="busy"
      tabindex="-1"
      data-testid="integration-sources-dialog"
      @keydown.esc.stop="close"
    >
      <header class="flex shrink-0 items-center justify-between gap-4 border-b border-slate-100 py-4 pl-4 pr-3 sm:pl-6 sm:pr-4">
        <h2 id="integration-sources-title" class="text-lg font-semibold text-slate-900">{{ t('integrations.sources.title') }}</h2>
        <button
          type="button"
          class="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :aria-label="t('integrations.dialog.close')"
          :title="t('integrations.dialog.close')"
          data-testid="integration-sources-close"
          @click="close"
        >
          <Icon icon="heroicons:x-mark" class="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      <div class="min-h-0 flex-1 overflow-y-auto">
        <p class="px-4 pb-1 pt-4 text-sm text-slate-500 sm:px-6">{{ t('integrations.sources.intro') }}</p>
        <ul class="divide-y divide-slate-100 py-1" role="list" :aria-label="t('integrations.sources.listLabel')" data-testid="integration-sources-list">
          <li
            v-for="source in store.sources"
            :key="source.sourceId"
            class="grid grid-cols-[2rem_minmax(0,1fr)_2rem] items-center gap-x-3 px-4 py-3 sm:grid-cols-[2rem_minmax(0,1fr)_auto_2rem] sm:px-6"
            :aria-busy="store.sourceBusy[source.sourceId] !== undefined"
            :data-testid="`integration-source-row-${source.sourceId}`"
          >
            <span class="row-span-3 mt-0.5 flex h-8 w-8 items-center justify-center self-start rounded-lg bg-slate-100 text-slate-600" aria-hidden="true">
              <Icon :icon="source.kind === 'local' ? 'heroicons:folder' : 'mdi:github'" class="h-[18px] w-[18px]" />
            </span>
            <span class="min-w-0 truncate text-sm font-medium leading-5 text-slate-900" :title="source.name">{{ source.name }}</span>
            <span class="hidden whitespace-nowrap text-right text-[13px] leading-5 tabular-nums text-slate-700 sm:block">
              {{ countLabel(source) }}
            </span>
            <span class="-my-1.5 flex justify-end">
              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="busy"
                :title="t('integrations.sources.remove')"
                :aria-label="t('integrations.sources.removeNamed', { name: source.name })"
                :data-testid="`integration-source-remove-${source.sourceId}`"
                @click="confirmation = { action: 'remove', source }"
              >
                <Icon icon="heroicons:trash" class="h-4 w-4" aria-hidden="true" />
              </button>
            </span>

            <span class="col-start-2 col-end-4 mt-0.5 min-w-0 truncate font-mono sm:col-end-5 text-[11.5px] leading-[18px] text-slate-500" :title="source.repositoryUrl">{{ source.repositoryUrl }}</span>

            <div class="col-start-2 col-end-4 mt-1.5 flex sm:col-end-5 min-h-6 min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              <span v-if="source.kind === 'local'" class="text-slate-600" :data-testid="`integration-source-status-${source.sourceId}`">{{ t('integrations.sources.localLabel') }}</span>
              <span v-else class="inline-flex items-center gap-1.5 font-medium" :class="statusTone(source).text" role="status" :data-testid="`integration-source-status-${source.sourceId}`">
                <Icon v-if="store.sourceBusy[source.sourceId]" icon="svg-spinners:ring-resize" class="h-3 w-3 text-slate-400" aria-hidden="true" />
                <span v-else class="h-1.5 w-1.5 rounded-full" :class="statusTone(source).dot" aria-hidden="true" />
                {{ statusLabel(source) }}
              </span>
              <span class="text-[13px] tabular-nums text-slate-500 sm:hidden">{{ countLabel(source) }}</span>
              <button
                v-if="source.kind === 'github' && source.status === 'UPDATE_AVAILABLE' && !store.sourceBusy[source.sourceId]"
                type="button"
                class="inline-flex h-6 items-center rounded-md border border-blue-200 bg-blue-50 px-2 text-xs font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="busy"
                :data-testid="`integration-source-update-${source.sourceId}`"
                @click="confirmation = { action: 'update', source }"
              >
                {{ t('integrations.sources.update') }}
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="message" class="shrink-0 border-t border-slate-100 px-4 py-3 sm:px-6">
        <p
          class="flex items-start gap-2 rounded-lg border px-3 py-2 text-[13px] leading-5"
          :class="message.kind === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-900'"
          :role="message.kind === 'error' ? 'alert' : 'status'"
          data-testid="integration-sources-message"
        >
          <Icon
            :icon="message.kind === 'error' ? 'heroicons:exclamation-circle-20-solid' : 'heroicons:check-circle-20-solid'"
            class="mt-0.5 h-4 w-4 shrink-0"
            :class="message.kind === 'error' ? 'text-red-500' : 'text-emerald-500'"
            aria-hidden="true"
          />
          <span class="min-w-0 break-words">{{ message.text }}</span>
        </p>
      </div>

      <footer class="flex shrink-0 justify-end border-t border-slate-100 bg-slate-50 px-4 py-3 sm:px-6">
        <button
          type="button"
          class="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          data-testid="integration-sources-done"
          @click="close"
        >
          {{ t('integrations.sources.done') }}
        </button>
      </footer>
    </section>

    <SkillSourceUpdateConfirmation
      :show="confirmation?.action === 'update'"
      :pending="confirming"
      :source="updateTarget"
      @confirm="confirmAction"
      @cancel="confirmation = null"
    />
    <ConfirmationModal
      :show="confirmation?.action === 'remove'"
      :pending="confirming"
      :title="t('integrations.sources.removeTitle')"
      :confirm-button-text="t('integrations.sources.remove')"
      variant="danger"
      @confirm="confirmAction"
      @cancel="confirmation = null"
    >
      <p v-if="confirmation" class="text-sm leading-6 text-slate-600" data-testid="integration-source-remove-confirm">
        {{ t(confirmation.source.kind === 'local' ? 'integrations.sources.removeBodyFolder' : 'integrations.sources.removeBody', {
          name: confirmation.source.name,
          skills: confirmation.source.skillCount === 1 ? t('integrations.sources.skillsOne') : t('integrations.sources.skillsMany', { count: confirmation.source.skillCount }),
        }) }}
        <span v-if="connectedNames.length > 0" class="mt-1 block" data-testid="integration-source-remove-connections">
          {{ t(connectedNames.length === 1 ? 'integrations.sources.removeConnections' : 'integrations.sources.removeConnectionsMany', { names: connectedNames.join(', ') }) }}
        </span>
      </p>
      <div v-if="confirmation" class="mt-3 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
        <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-slate-600 ring-1 ring-slate-200" aria-hidden="true">
          <Icon :icon="confirmation.source.kind === 'local' ? 'heroicons:folder' : 'mdi:github'" class="h-4 w-4" />
        </span>
        <span class="min-w-0">
          <span class="block truncate text-sm font-medium text-slate-900">{{ confirmation.source.name }}</span>
          <span class="mt-0.5 block break-all font-mono text-[11.5px] leading-4 text-slate-500">{{ confirmation.source.repositoryUrl }}</span>
        </span>
      </div>
    </ConfirmationModal>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import ConfirmationModal from '~/components/common/ConfirmationModal.vue'
import SkillSourceUpdateConfirmation, { type SkillSourceUpdateTarget } from '~/components/skills/SkillSourceUpdateConfirmation.vue'
import { useLocalization } from '~/composables/useLocalization'
import type { ImportedSource } from '~/prototype/integrations/integrationsDesignFixture'
import { IntegrationError, useIntegrationsStore } from '~/stores/integrationsStore'

const emit = defineEmits<{ close: []; notice: [text: string] }>()

const store = useIntegrationsStore()
const { t } = useLocalization()
const panelRef = ref<HTMLElement | null>(null)
const confirmation = ref<{ action: 'update' | 'remove'; source: ImportedSource } | null>(null)
const confirming = ref(false)
const message = ref<{ kind: 'success' | 'error'; text: string } | null>(null)
const busy = computed(() => confirming.value || Object.values(store.sourceBusy).some(Boolean))

// The connections that go with the source: an integration without its source has no card, so its token goes too.
const connectedNames = computed(() => {
  const source = confirmation.value?.action === 'remove' ? confirmation.value.source : null
  if (!source) return []
  return store.items.filter(item => source.integrationIds.includes(item.id) && item.phase === 'connected').map(item => item.name)
})

const updateTarget = computed<SkillSourceUpdateTarget | null>(() => {
  const source = confirmation.value?.action === 'update' ? confirmation.value.source : null
  return source ? {
    name: source.name, repositoryUrl: source.repositoryUrl, branch: 'main',
    installedRevision: source.installedRevision, latestRevision: source.latestRevision,
  } : null
})

const statusLabel = (source: ImportedSource) => {
  const pending = store.sourceBusy[source.sourceId]
  if (pending) return t(pending === 'update' ? 'integrations.sources.updating' : 'integrations.sources.removing')
  return t(source.status === 'UPDATE_AVAILABLE' ? 'integrations.sources.updateAvailable' : 'integrations.sources.upToDate')
}
const statusTone = (source: ImportedSource) => {
  if (store.sourceBusy[source.sourceId]) return { text: 'text-slate-500', dot: '' }
  return source.status === 'UPDATE_AVAILABLE'
    ? { text: 'text-amber-700', dot: 'bg-amber-500' }
    : { text: 'text-slate-600', dot: 'bg-emerald-500' }
}

const countLabel = (source: ImportedSource) => (source.integrationIds.length === 1
  ? t('integrations.sources.integrationsOne')
  : t('integrations.sources.integrationsMany', { count: source.integrationIds.length }))

const close = () => { if (!busy.value) emit('close') }

async function confirmAction() {
  const current = confirmation.value
  if (!current || confirming.value) return
  confirming.value = true
  message.value = null
  try {
    await store.sourceAction(current.source.sourceId, current.action)
    const text = t(current.action === 'update' ? 'integrations.sources.updated' : 'integrations.sources.removed', { name: current.source.name })
    // Nothing left to manage: the dialog closes and the page says what happened.
    if (store.sources.length === 0) { emit('notice', text); emit('close') } else message.value = { kind: 'success', text }
  } catch (cause) {
    const unreachable = cause instanceof IntegrationError && cause.code === 'GITHUB_UNREACHABLE'
    message.value = {
      kind: 'error',
      text: unreachable
        ? t('integrations.sources.errorUpdate', { name: current.source.name, reason: (cause as IntegrationError).detail })
        : t('integrations.sources.errorFailed'),
    }
  } finally {
    confirming.value = false
    confirmation.value = null
  }
}

let returnFocus: HTMLElement | null = null
onMounted(async () => {
  returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  await nextTick()
  panelRef.value?.focus()
})
onBeforeUnmount(() => { if (returnFocus?.isConnected) returnFocus.focus() })
</script>
