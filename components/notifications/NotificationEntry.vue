<template>
  <!-- settings-update-notifications (round 11): one update as a row, App Store style. Left: the name (with the blue
       "New" dot in a fixed gutter), and below it the change and when it was found. Right: its one action (Download /
       Install and restart / Update / Try again / Clear, or "Updating…"). Clicking the name or the change expands the
       details in place; progress and errors show under the row, full width. -->
  <li class="relative py-2.5" :data-testid="`notification-entry-${id}`" :data-state="state">
    <span v-if="isNew" class="absolute -left-[11px] top-[18px] h-1.5 w-1.5 rounded-full bg-sky-700" aria-hidden="true" data-testid="notification-entry-new" />
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="block min-w-0 flex-1 rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        :aria-expanded="expanded"
        :aria-controls="detailsId"
        data-testid="notification-entry-summary"
        @click="expanded = !expanded"
      >
        <span class="block truncate text-[13px] font-medium leading-5" :class="state === 'handled' ? 'text-gray-500' : 'text-gray-900'" :title="name" data-testid="notification-entry-name">
          <span v-if="isNew" class="sr-only">{{ t('settings.notifications.new') }}: </span>{{ name }}
        </span>
        <span class="flex flex-wrap items-center gap-x-1.5 text-xs leading-5 text-gray-500" data-testid="notification-entry-change">
          <template v-if="state === 'handled'">
            <Icon icon="heroicons:check-circle-20-solid" class="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            <span class="text-emerald-700">{{ t('settings.notifications.handled', { revision: to }) }}</span>
          </template>
          <template v-else>
            <span :class="kind === 'app' ? '' : 'font-mono text-[11px]'">{{ from }}</span>
            <Icon icon="heroicons:arrow-right-20-solid" class="h-3 w-3 text-gray-400" aria-hidden="true" />
            <span class="font-medium text-gray-700" :class="kind === 'app' ? '' : 'font-mono text-[11px]'">{{ to }}</span>
            <span aria-hidden="true">·</span>
            <span :title="new Date(foundAt).toLocaleString(resolvedLocale)" data-testid="notification-entry-time">{{ shortRelativeTime(foundAt, String(resolvedLocale || 'en')) }}</span>
          </template>
        </span>
      </button>

      <!-- The one action, on the right. -->
      <div v-if="action" class="flex-shrink-0">
        <span v-if="action === 'updating'" class="inline-flex items-center gap-1.5 text-xs font-medium text-sky-800" role="status" data-testid="notification-entry-updating"><Icon icon="heroicons:arrow-path-20-solid" class="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />{{ t('settings.notifications.updating') }}</span>
        <button v-else-if="action === 'install'" type="button" class="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" data-testid="notification-entry-install" @click="app.installUpdateAndRestart()">{{ t('settings.notifications.app.install') }}</button>
        <button v-else-if="action === 'clear'" type="button" class="rounded-full px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500" data-testid="notification-entry-clear" @click="item && store.clearSource(item.id)">{{ t('settings.notifications.clear') }}</button>
        <button v-else type="button" class="rounded-full bg-sky-700 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500" :aria-label="`${actionLabel}: ${name}`" data-testid="notification-entry-update" @click="runUpdate">{{ actionLabel }}</button>
      </div>
    </div>

    <!-- Details: where and what changed. -->
    <div v-if="expanded" :id="detailsId" class="mt-1.5 space-y-1 text-xs leading-5 text-gray-600" data-testid="notification-entry-details">
      <p v-if="repository" class="truncate" :title="`${repository} · ${branch}`">{{ repository }} · {{ branch }}</p>
      <a v-if="compareUrl" :href="compareUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 rounded font-medium text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500" data-testid="notification-entry-compare">{{ t('settings.notifications.compare') }}<Icon icon="heroicons:arrow-top-right-on-square-20-solid" class="h-3.5 w-3.5" aria-hidden="true" /></a>
      <template v-if="kind === 'app'">
        <p v-if="app.releaseNotes" class="whitespace-pre-line rounded-md bg-gray-50 px-2.5 py-1.5 text-gray-700" data-testid="notification-entry-release-notes">{{ app.releaseNotes }}</p>
        <a :href="releaseUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 rounded font-medium text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">{{ t('settings.notifications.releasePage') }}<Icon icon="heroicons:arrow-top-right-on-square-20-solid" class="h-3.5 w-3.5" aria-hidden="true" /></a>
      </template>
    </div>

    <!-- Progress and results, under the row. -->
    <div v-if="kind === 'app' && app.status === 'downloading'" class="mt-2" role="status" data-testid="notification-entry-progress">
      <div class="flex items-center justify-between text-xs leading-5 text-gray-600"><span>{{ t('settings.notifications.app.downloading', { percent: Math.round(app.downloadPercent ?? 0) }) }}</span></div>
      <div class="mt-1 h-1.5 w-full rounded-full bg-gray-200" aria-hidden="true"><div class="h-1.5 rounded-full bg-sky-700 transition-all" :style="{ width: `${Math.max(0, Math.min(100, app.downloadPercent ?? 0))}%` }" /></div>
    </div>
    <p v-if="kind === 'app' && app.status === 'downloaded'" class="mt-1 text-xs leading-5 text-emerald-700">{{ t('settings.notifications.app.downloaded') }}</p>
    <p v-if="kind === 'app' && app.status === 'installing'" class="mt-1 inline-flex items-center gap-1.5 text-xs leading-5 text-emerald-700" role="status"><Icon icon="heroicons:arrow-path-20-solid" class="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />{{ t('settings.notifications.app.installing') }}</p>
    <p v-if="state === 'failed'" class="mt-1.5 rounded-md bg-red-50 px-2.5 py-1.5 text-xs leading-5 text-red-800" role="alert" data-testid="notification-entry-error">{{ kind === 'app' ? t('settings.notifications.app.failed') : t('settings.notifications.failed') }}<span v-if="error" class="block text-red-700">{{ error }}</span></p>
  </li>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useLocalization } from '~/composables/useLocalization'
import { useAppUpdateStore } from '~/stores/appUpdateStore'
import { compareUrlOf, shortRevision, useUpdateNotificationsStore, type SourceUpdateNotification, type UpdateNotificationKind } from '~/stores/updateNotificationsStore'
import { shortRelativeTime } from './notificationTime'

/** `item` for an agent package or skill source; none for the app update. */
const props = defineProps<{ item?: SourceUpdateNotification }>()
const emit = defineEmits<{ (event: 'update', item: SourceUpdateNotification): void }>()
const { t, resolvedLocale } = useLocalization()
const store = useUpdateNotificationsStore()
const app = useAppUpdateStore()
const expanded = ref(false)
const detailsId = `notification-entry-details-${Math.random().toString(36).slice(2, 8)}`

const kind = computed<UpdateNotificationKind>(() => props.item?.kind ?? 'app')
const id = computed(() => props.item?.id ?? 'app')
const name = computed(() => props.item?.name ?? t('settings.notifications.app.name'))
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

/** The row's one action. */
const action = computed<'update' | 'retry' | 'install' | 'updating' | 'clear' | null>(() => {
  if (!props.item) {
    if (app.status === 'available') return 'update'
    if (app.status === 'error') return 'retry'
    if (app.status === 'downloaded') return 'install'
    return null
  }
  return ({ waiting: 'update', failed: 'retry', updating: 'updating', handled: 'clear' } as const)[props.item.state]
})
const actionLabel = computed(() => {
  if (action.value === 'retry') return t('settings.notifications.tryAgain')
  return t(kind.value === 'app' ? 'settings.notifications.app.download' : 'settings.notifications.update')
})
const runUpdate = () => {
  if (props.item) emit('update', props.item)
  else void app.downloadUpdate()
}
</script>
