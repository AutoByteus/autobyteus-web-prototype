<template>
  <!-- settings-update-notifications (round 8): one update inside its type's card (the app, one agent package or one
       skill source). The name and the change; clicking them expands the details in place; the actions are on the
       entry. In a card with several entries, each entry also shows its time and "New" dot. -->
  <li :class="grouped ? 'py-2.5 first:pt-1.5 last:pb-0' : ''" :data-testid="`notification-entry-${id}`" :data-state="state">
    <button
      type="button"
      class="block w-full rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      :aria-expanded="expanded"
      :aria-controls="detailsId"
      data-testid="notification-entry-summary"
      @click="expanded = !expanded"
    >
      <span class="flex items-baseline gap-2">
        <span class="min-w-0 flex-1 truncate text-[13px] leading-5" :class="[grouped ? 'font-medium' : '', state === 'handled' ? 'text-gray-500' : grouped ? 'text-gray-900' : 'text-gray-800']" :title="name" data-testid="notification-entry-name">{{ name }}</span>
        <template v-if="grouped">
          <span class="flex-shrink-0 text-[11px] leading-5 text-gray-500" :title="new Date(foundAt).toLocaleString(resolvedLocale)">{{ shortRelativeTime(foundAt, String(resolvedLocale || 'en')) }}</span>
          <span v-if="isNew" class="h-2 w-2 flex-shrink-0 self-center rounded-full bg-sky-700" data-testid="notification-entry-new" />
          <span v-if="isNew" class="sr-only">{{ t('settings.notifications.new') }}</span>
        </template>
      </span>
      <span class="flex flex-wrap items-center gap-x-1.5 text-xs leading-5 text-gray-500" data-testid="notification-entry-change">
        <template v-if="state === 'handled'">
          <Icon icon="heroicons:check-circle-20-solid" class="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          <span class="text-emerald-700">{{ t('settings.notifications.handled', { revision: to }) }}</span>
        </template>
        <template v-else>
          <span v-if="branch">{{ branch }}</span>
          <span :class="kind === 'app' ? '' : 'font-mono text-[11px]'">{{ from }}</span>
          <Icon icon="heroicons:arrow-right-20-solid" class="h-3 w-3 text-gray-400" aria-hidden="true" />
          <span class="font-medium text-gray-800" :class="kind === 'app' ? '' : 'font-mono text-[11px]'">{{ to }}</span>
        </template>
      </span>
    </button>

    <!-- Details: what changed and where. -->
    <div v-if="expanded" :id="detailsId" class="mt-1.5 space-y-1 text-xs leading-5 text-gray-600" data-testid="notification-entry-details">
      <p v-if="repository" class="truncate" :title="repository">{{ repository }}</p>
      <a v-if="compareUrl" :href="compareUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 rounded font-medium text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500" data-testid="notification-entry-compare">{{ t('settings.notifications.compare') }}<Icon icon="heroicons:arrow-top-right-on-square-20-solid" class="h-3.5 w-3.5" aria-hidden="true" /></a>
      <template v-if="kind === 'app'">
        <p v-if="app.releaseNotes" class="whitespace-pre-line rounded-md bg-gray-50 px-2.5 py-1.5 text-gray-700" data-testid="notification-entry-release-notes">{{ app.releaseNotes }}</p>
        <a :href="releaseUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 rounded font-medium text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">{{ t('settings.notifications.releasePage') }}<Icon icon="heroicons:arrow-top-right-on-square-20-solid" class="h-3.5 w-3.5" aria-hidden="true" /></a>
      </template>
    </div>

    <!-- Progress and results, in place. -->
    <div v-if="kind === 'app' && app.status === 'downloading'" class="mt-2" role="status" data-testid="notification-entry-progress">
      <p class="text-xs leading-5 text-gray-600">{{ t('settings.notifications.app.downloading', { percent: Math.round(app.downloadPercent ?? 0) }) }}</p>
      <div class="mt-1 h-1.5 w-full rounded-full bg-gray-200" aria-hidden="true"><div class="h-1.5 rounded-full bg-sky-700 transition-all" :style="{ width: `${Math.max(0, Math.min(100, app.downloadPercent ?? 0))}%` }" /></div>
    </div>
    <p v-if="kind === 'app' && app.status === 'downloaded'" class="mt-1.5 text-xs leading-5 text-emerald-700">{{ t('settings.notifications.app.downloaded') }}</p>
    <p v-if="kind === 'app' && app.status === 'installing'" class="mt-1.5 inline-flex items-center gap-1.5 text-xs leading-5 text-emerald-700" role="status"><Icon icon="heroicons:arrow-path-20-solid" class="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />{{ t('settings.notifications.app.installing') }}</p>
    <p v-if="state === 'failed'" class="mt-1.5 rounded-md bg-red-50 px-2.5 py-1.5 text-xs leading-5 text-red-800" role="alert" data-testid="notification-entry-error">{{ kind === 'app' ? t('settings.notifications.app.failed') : t('settings.notifications.failed') }}<span v-if="error" class="block text-red-700">{{ error }}</span></p>

    <!-- Actions on the entry. -->
    <div v-if="state !== 'busy'" class="mt-2 flex flex-wrap items-center gap-1.5">
      <template v-if="kind === 'app'">
        <button v-if="app.status === 'available' || app.status === 'error'" type="button" :class="primary" data-testid="notification-entry-update" @click="app.downloadUpdate()">{{ t(app.status === 'error' ? 'settings.notifications.tryAgain' : 'settings.notifications.app.download') }}</button>
        <button v-if="app.status === 'downloaded'" type="button" class="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" data-testid="notification-entry-install" @click="app.installUpdateAndRestart()">{{ t('settings.notifications.app.install') }}</button>
      </template>
      <template v-else-if="item">
        <button v-if="item.state === 'waiting' || item.state === 'failed'" type="button" :class="primary" data-testid="notification-entry-update" @click="emit('update', item)">{{ t(item.state === 'failed' ? 'settings.notifications.tryAgain' : 'settings.notifications.update') }}</button>
        <span v-else-if="item.state === 'updating'" class="inline-flex items-center gap-1.5 rounded-md bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800" role="status" data-testid="notification-entry-updating"><Icon icon="heroicons:arrow-path-20-solid" class="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />{{ t('settings.notifications.updating') }}</span>
        <button v-if="item.state === 'handled'" type="button" :class="secondary" data-testid="notification-entry-clear" @click="store.clearSource(item.id)">{{ t('settings.notifications.clear') }}</button>
      </template>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useLocalization } from '~/composables/useLocalization'
import { useAppUpdateStore } from '~/stores/appUpdateStore'
import { compareUrlOf, shortRevision, useUpdateNotificationsStore, type SourceUpdateNotification, type UpdateNotificationKind } from '~/stores/updateNotificationsStore'
import { shortRelativeTime } from './notificationTime'

/** `item` for an agent package or skill source; none for the app update. `grouped`: one of several in its card. */
const props = defineProps<{ item?: SourceUpdateNotification; grouped?: boolean }>()
const emit = defineEmits<{ (event: 'update', item: SourceUpdateNotification): void }>()
const { t, resolvedLocale } = useLocalization()
const store = useUpdateNotificationsStore()
const app = useAppUpdateStore()
const expanded = ref(false)
const detailsId = `notification-entry-details-${Math.random().toString(36).slice(2, 8)}`
const primary = 'rounded-md bg-sky-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500'
const secondary = 'rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500'

const kind = computed<UpdateNotificationKind>(() => props.item?.kind ?? 'app')
const id = computed(() => props.item?.id ?? 'app')
const name = computed(() => props.item?.name ?? t('settings.notifications.app.name', { version: app.availableVersion }))
const branch = computed(() => props.item?.branch ?? '')
const from = computed(() => props.item ? shortRevision(props.item.installedRevision) : app.currentVersion)
const to = computed(() => props.item ? shortRevision(props.item.latestRevision) : app.availableVersion ?? '')
const repository = computed(() => props.item?.repository ?? '')
const compareUrl = computed(() => props.item ? compareUrlOf(props.item) : '')
const releaseUrl = computed(() => `https://github.com/AutoByteus/autobyteus/releases/tag/v${app.availableVersion}`)
const foundAt = computed(() => props.item?.foundAt ?? store.appFoundAt ?? new Date().toISOString())
const error = computed(() => props.item?.error ?? null)
/** waiting / updating / failed / handled for sources; the app maps its update status. */
const state = computed(() => {
  if (props.item) return props.item.state
  if (app.status === 'error') return 'failed'
  if (app.status === 'downloading' || app.status === 'installing') return 'busy'
  return 'waiting'
})
const isNew = computed(() => state.value !== 'handled' && (props.item ? store.isNew(props.item.id) || props.item.unread : store.isNew('app') || store.appUnread))
</script>
