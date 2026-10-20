<template>
  <!-- settings-update-notifications: the app update, which replaces the self-opening bottom-right card. It reads the
       same state as Settings → Updates; Download and Install only run when pressed. -->
  <li class="update-notification px-4 py-3.5 text-gray-900" data-testid="update-notification-app" :data-state="app.status" :data-new="isNew || undefined">
    <UpdateNotificationMeta kind="app" :found-at="store.appFoundAt ?? new Date().toISOString()" :is-new="isNew" />
    <p class="mt-1.5 text-sm font-semibold leading-5 text-gray-900" data-testid="update-notification-name">{{ t('settings.notifications.app.name', { version: app.availableVersion }) }}</p>
    <p class="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs leading-5 text-gray-600" data-testid="update-notification-revisions">
      <span>{{ app.currentVersion }}</span>
      <Icon icon="heroicons:arrow-right-20-solid" class="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
      <span class="font-medium text-gray-900">{{ app.availableVersion }}</span>
      <span aria-hidden="true">·</span>
      <span>{{ t(app.updateChannel === 'beta' ? 'settings.notifications.app.channel.beta' : 'settings.notifications.app.channel.stable') }}</span>
    </p>

    <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
      <button
        v-if="app.releaseNotes"
        type="button"
        class="inline-flex items-center gap-1 rounded text-xs font-medium text-sky-700 hover:text-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        :aria-expanded="notesOpen"
        aria-controls="update-notification-app-notes"
        data-testid="update-notification-release-notes-toggle"
        @click="notesOpen = !notesOpen"
      ><Icon icon="heroicons:chevron-right-20-solid" class="h-3.5 w-3.5 transition-transform" :class="notesOpen ? 'rotate-90' : ''" aria-hidden="true" />{{ t('settings.notifications.releaseNotes') }}</button>
      <a
        :href="releaseUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 rounded text-xs font-medium text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        data-testid="update-notification-release-page"
      >{{ t('settings.notifications.releasePage') }}<Icon icon="heroicons:arrow-top-right-on-square-20-solid" class="h-3.5 w-3.5" aria-hidden="true" /></a>
    </div>
    <p v-if="notesOpen && app.releaseNotes" id="update-notification-app-notes" class="mt-2 whitespace-pre-line rounded-md bg-gray-50 px-3 py-2 text-xs leading-5 text-gray-700" data-testid="update-notification-release-notes">{{ app.releaseNotes }}</p>

    <!-- Download progress, then ready to install, then restarting. -->
    <div v-if="app.status === 'downloading'" class="mt-2.5" role="status" data-testid="update-notification-app-progress">
      <p class="text-xs leading-5 text-gray-600">{{ t('settings.notifications.app.downloading', { percent: Math.round(app.downloadPercent ?? 0) }) }}</p>
      <div class="mt-1 h-1.5 w-full rounded-full bg-gray-200" aria-hidden="true">
        <div class="h-1.5 rounded-full bg-sky-600 transition-all" :style="{ width: `${Math.max(0, Math.min(100, app.downloadPercent ?? 0))}%` }" />
      </div>
    </div>
    <p v-if="app.status === 'downloaded'" class="mt-2 text-xs leading-5 text-emerald-700" data-testid="update-notification-app-downloaded">{{ t('settings.notifications.app.downloaded') }}</p>
    <p v-if="app.status === 'installing'" class="mt-2 inline-flex items-center gap-1.5 text-xs leading-5 text-emerald-700" role="status" data-testid="update-notification-app-installing">
      <Icon icon="heroicons:arrow-path-20-solid" class="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />{{ t('settings.notifications.app.installing') }}
    </p>
    <div v-if="app.status === 'error'" class="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-800" role="alert" data-testid="update-notification-error">
      {{ t('settings.notifications.app.failed') }}
    </div>

    <div v-if="app.status !== 'downloading' && app.status !== 'installing'" class="mt-2.5 flex flex-wrap items-center gap-2">
      <button
        v-if="app.status === 'available' || app.status === 'error'"
        type="button"
        class="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1"
        data-testid="update-notification-update"
        @click="app.downloadUpdate()"
      >{{ t(app.status === 'error' ? 'settings.notifications.tryAgain' : 'settings.notifications.app.download') }}</button>
      <button
        v-if="app.status === 'downloaded'"
        type="button"
        class="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
        data-testid="update-notification-install"
        @click="app.installUpdateAndRestart()"
      >{{ t('settings.notifications.app.install') }}</button>
      <button
        v-if="app.status === 'available' || app.status === 'error'"
        type="button"
        class="rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        :title="t('settings.notifications.skipHint')"
        data-testid="update-notification-skip"
        @click="store.skipApp()"
      >{{ t('settings.notifications.skip') }}</button>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useLocalization } from '~/composables/useLocalization'
import { useAppUpdateStore } from '~/stores/appUpdateStore'
import { useUpdateNotificationsStore } from '~/stores/updateNotificationsStore'
import UpdateNotificationMeta from './UpdateNotificationMeta.vue'

const { t } = useLocalization()
const app = useAppUpdateStore()
const store = useUpdateNotificationsStore()
const notesOpen = ref(false)
const isNew = computed(() => store.isNew('app') || store.appUnread)
const releaseUrl = computed(() => `https://github.com/AutoByteus/autobyteus/releases/tag/v${app.availableVersion}`)
</script>
