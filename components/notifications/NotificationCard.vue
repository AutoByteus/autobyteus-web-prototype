<template>
  <!-- settings-update-notifications (round 6): one compact notification card in the Notification Center, in the
       manner of macOS notifications. The type in words, the time and a "New" dot; the name and the change in two
       short lines; the actions on the card. Clicking the summary expands the details (what changed, links). -->
  <li class="rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-200/80" :data-testid="`notification-card-${id}`" :data-state="state">
    <div class="flex items-start gap-2.5">
      <span class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600" aria-hidden="true">
        <Icon :icon="KIND_ICONS[kind]" class="h-5 w-5" />
      </span>
      <div class="min-w-0 flex-1">
        <button
          type="button"
          class="block w-full rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          :aria-expanded="expanded"
          :aria-controls="detailsId"
          data-testid="notification-card-summary"
          @click="expanded = !expanded"
        >
          <span class="flex items-baseline gap-2">
            <span class="min-w-0 flex-1 truncate text-[13px] font-semibold leading-5 text-gray-900" data-testid="notification-card-kind">{{ t(`settings.notifications.kind.${kind}`) }}</span>
            <span class="flex-shrink-0 text-[11px] leading-5 text-gray-500" :title="new Date(foundAt).toLocaleString(resolvedLocale)">{{ shortTime }}</span>
            <span v-if="isNew" class="h-2 w-2 flex-shrink-0 self-center rounded-full bg-sky-600" data-testid="notification-card-new" />
            <span v-if="isNew" class="sr-only">{{ t('settings.notifications.new') }}</span>
          </span>
          <span class="block truncate text-[13px] leading-5" :class="state === 'handled' ? 'text-gray-500' : 'text-gray-800'" data-testid="notification-card-name">{{ name }}</span>
          <span class="flex flex-wrap items-center gap-x-1.5 text-xs leading-5 text-gray-500" data-testid="notification-card-change">
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
        <div v-if="expanded" :id="detailsId" class="mt-1.5 space-y-1 text-xs leading-5 text-gray-600" data-testid="notification-card-details">
          <p v-if="repository" class="truncate" :title="repository">{{ repository }}</p>
          <a v-if="compareUrl" :href="compareUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 rounded font-medium text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500" data-testid="notification-card-compare">{{ t('settings.notifications.compare') }}<Icon icon="heroicons:arrow-top-right-on-square-20-solid" class="h-3.5 w-3.5" aria-hidden="true" /></a>
          <template v-if="kind === 'app'">
            <p v-if="releaseNotes" class="whitespace-pre-line rounded-md bg-gray-50 px-2.5 py-1.5 text-gray-700" data-testid="notification-card-release-notes">{{ releaseNotes }}</p>
            <a :href="releaseUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 rounded font-medium text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">{{ t('settings.notifications.releasePage') }}<Icon icon="heroicons:arrow-top-right-on-square-20-solid" class="h-3.5 w-3.5" aria-hidden="true" /></a>
          </template>
        </div>

        <!-- Progress and results. -->
        <div v-if="kind === 'app' && app.status === 'downloading'" class="mt-2" role="status" data-testid="notification-card-progress">
          <p class="text-xs leading-5 text-gray-600">{{ t('settings.notifications.app.downloading', { percent: Math.round(app.downloadPercent ?? 0) }) }}</p>
          <div class="mt-1 h-1.5 w-full rounded-full bg-gray-200" aria-hidden="true"><div class="h-1.5 rounded-full bg-sky-600 transition-all" :style="{ width: `${Math.max(0, Math.min(100, app.downloadPercent ?? 0))}%` }" /></div>
        </div>
        <p v-if="kind === 'app' && app.status === 'downloaded'" class="mt-1.5 text-xs leading-5 text-emerald-700">{{ t('settings.notifications.app.downloaded') }}</p>
        <p v-if="kind === 'app' && app.status === 'installing'" class="mt-1.5 inline-flex items-center gap-1.5 text-xs leading-5 text-emerald-700" role="status"><Icon icon="heroicons:arrow-path-20-solid" class="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />{{ t('settings.notifications.app.installing') }}</p>
        <p v-if="state === 'failed'" class="mt-1.5 rounded-md bg-red-50 px-2.5 py-1.5 text-xs leading-5 text-red-800" role="alert" data-testid="notification-card-error">{{ kind === 'app' ? t('settings.notifications.app.failed') : t('settings.notifications.failed') }}<span v-if="error" class="block text-red-700">{{ error }}</span></p>

        <!-- Actions on the card. -->
        <div v-if="state !== 'busy'" class="mt-2 flex flex-wrap items-center gap-1.5">
          <template v-if="kind === 'app'">
            <button v-if="app.status === 'available' || app.status === 'error'" type="button" :class="primary" data-testid="notification-card-update" @click="app.downloadUpdate()">{{ t(app.status === 'error' ? 'settings.notifications.tryAgain' : 'settings.notifications.app.download') }}</button>
            <button v-if="app.status === 'downloaded'" type="button" class="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" data-testid="notification-card-install" @click="app.installUpdateAndRestart()">{{ t('settings.notifications.app.install') }}</button>
            <button v-if="app.status === 'available' || app.status === 'error'" type="button" :class="secondary" :title="t('settings.notifications.skipHint')" data-testid="notification-card-skip" @click="store.skipApp()">{{ t('settings.notifications.skip') }}</button>
          </template>
          <template v-else-if="item">
            <button v-if="item.state === 'waiting' || item.state === 'failed'" type="button" :class="primary" data-testid="notification-card-update" @click="emit('update', item)">{{ t(item.state === 'failed' ? 'settings.notifications.tryAgain' : 'settings.notifications.update') }}</button>
            <span v-else-if="item.state === 'updating'" class="inline-flex items-center gap-1.5 rounded-md bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800" role="status" data-testid="notification-card-updating"><Icon icon="heroicons:arrow-path-20-solid" class="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />{{ t('settings.notifications.updating') }}</span>
            <button v-if="item.state === 'waiting' || item.state === 'failed'" type="button" :class="secondary" :title="t('settings.notifications.skipHint')" data-testid="notification-card-skip" @click="store.skipSource(item.id)">{{ t('settings.notifications.skip') }}</button>
            <button v-if="item.state === 'handled'" type="button" :class="secondary" data-testid="notification-card-clear" @click="store.skipSource(item.id)">{{ t('settings.notifications.clear') }}</button>
          </template>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useLocalization } from '~/composables/useLocalization'
import { useAppUpdateStore } from '~/stores/appUpdateStore'
import { compareUrlOf, shortRevision, useUpdateNotificationsStore, type SourceUpdateNotification, type UpdateNotificationKind } from '~/stores/updateNotificationsStore'

/** `item` for an agent package or skill source; none for the app update. */
const props = defineProps<{ item?: SourceUpdateNotification }>()
const emit = defineEmits<{ (event: 'update', item: SourceUpdateNotification): void }>()
const { t, resolvedLocale } = useLocalization()
const store = useUpdateNotificationsStore()
const app = useAppUpdateStore()
const expanded = ref(false)
const detailsId = `notification-card-details-${Math.random().toString(36).slice(2, 8)}`
const primary = 'rounded-md bg-sky-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500'
const secondary = 'rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500'

/** Each type's outline icon, from the sidebar's set. A new kind adds one. */
const KIND_ICONS: Record<UpdateNotificationKind, string> = {
  app: 'heroicons:computer-desktop', agent_package: 'heroicons:cube', skill_source: 'heroicons:sparkles',
}
const kind = computed<UpdateNotificationKind>(() => props.item?.kind ?? 'app')
const id = computed(() => props.item?.id ?? 'app')
const name = computed(() => props.item?.name ?? t('settings.notifications.app.name', { version: app.availableVersion }))
const branch = computed(() => props.item?.branch ?? '')
const from = computed(() => props.item ? shortRevision(props.item.installedRevision) : app.currentVersion)
const to = computed(() => props.item ? shortRevision(props.item.latestRevision) : app.availableVersion ?? '')
const repository = computed(() => props.item?.repository ?? '')
const compareUrl = computed(() => props.item ? compareUrlOf(props.item) : '')
const releaseNotes = computed(() => props.item ? '' : app.releaseNotes)
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
/** "3 hr. ago", "yesterday" (short, as in macOS notifications). */
const shortTime = computed(() => {
  const seconds = Math.round((new Date(foundAt.value).getTime() - Date.now()) / 1000)
  const format = new Intl.RelativeTimeFormat(String(resolvedLocale.value || 'en'), { numeric: 'auto', style: 'short' })
  const abs = Math.abs(seconds)
  if (abs < 3600) return format.format(Math.round(seconds / 60), 'minute')
  if (abs < 86_400) return format.format(Math.round(seconds / 3600), 'hour')
  return format.format(Math.round(seconds / 86_400), 'day')
})
</script>
