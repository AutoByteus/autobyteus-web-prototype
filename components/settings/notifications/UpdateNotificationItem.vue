<template>
  <!-- settings-update-notifications: one GitHub agent package or skill source with an update. -->
  <li
    class="update-notification px-4 py-3.5"
    :class="item.state === 'handled' ? 'text-gray-500' : 'text-gray-900'"
    :data-testid="`update-notification-${item.id}`"
    :data-state="item.state"
    :data-new="isNew || undefined"
  >
    <UpdateNotificationMeta :kind="item.kind" :found-at="item.foundAt" :is-new="isNew" />
    <p class="mt-1.5 line-clamp-2 break-words text-sm font-semibold leading-5" :class="item.state === 'handled' ? 'text-gray-600' : 'text-gray-900'" data-testid="update-notification-name">{{ item.name }}</p>
    <p class="truncate text-xs leading-5 text-gray-500" :title="item.repository" data-testid="update-notification-repository">{{ item.repository }}</p>

    <!-- What changed: installed → latest, and GitHub's compare page. -->
    <p v-if="item.state !== 'handled'" class="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-xs leading-5 text-gray-600" data-testid="update-notification-revisions">
      <span>{{ item.branch }}</span>
      <span class="font-mono text-[11.5px]" :title="item.installedRevision">{{ shortRevision(item.installedRevision) }}</span>
      <Icon icon="heroicons:arrow-right-20-solid" class="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
      <span class="font-mono text-[11.5px] font-medium text-gray-900" :title="item.latestRevision">{{ shortRevision(item.latestRevision) }}</span>
    </p>
    <a
      v-if="item.state !== 'handled'"
      :href="compareUrlOf(item)"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-0.5 inline-flex items-center gap-1 rounded text-xs font-medium text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      data-testid="update-notification-compare"
    >{{ t('settings.notifications.compare') }}<Icon icon="heroicons:arrow-top-right-on-square-20-solid" class="h-3.5 w-3.5" aria-hidden="true" /></a>

    <!-- Updated (by any path): kept quietly until cleared or superseded. -->
    <p v-if="item.state === 'handled'" class="mt-1.5 flex items-center gap-1.5 text-xs leading-5 text-emerald-700" data-testid="update-notification-handled">
      <Icon icon="heroicons:check-circle-20-solid" class="h-4 w-4" aria-hidden="true" />
      <span>{{ t('settings.notifications.handled', { revision: shortRevision(item.latestRevision) }) }}</span>
    </p>

    <div v-if="item.state === 'failed'" class="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-800" role="alert" data-testid="update-notification-error">
      <p class="font-medium">{{ t('settings.notifications.failed') }}</p>
      <p v-if="item.error" class="mt-0.5 break-words text-red-700">{{ item.error }}</p>
    </div>

    <div class="mt-2.5 flex flex-wrap items-center gap-2">
      <button
        v-if="item.state === 'waiting' || item.state === 'failed'"
        type="button"
        class="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1"
        data-testid="update-notification-update"
        @click="emit('update', item)"
      >{{ t(item.state === 'failed' ? 'settings.notifications.tryAgain' : 'settings.notifications.update') }}</button>
      <span
        v-else-if="item.state === 'updating'"
        class="inline-flex items-center gap-1.5 rounded-md bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-800"
        role="status"
        data-testid="update-notification-updating"
      ><Icon icon="heroicons:arrow-path-20-solid" class="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />{{ t('settings.notifications.updating') }}</span>
      <button
        v-if="item.state === 'waiting' || item.state === 'failed'"
        type="button"
        class="rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        :title="t('settings.notifications.skipHint')"
        data-testid="update-notification-skip"
        @click="store.skipSource(item.id)"
      >{{ t('settings.notifications.skip') }}</button>
      <button
        v-if="item.state === 'handled'"
        type="button"
        class="-ml-2.5 rounded-md px-2.5 py-1 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        data-testid="update-notification-clear"
        @click="store.skipSource(item.id)"
      >{{ t('settings.notifications.clear') }}</button>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useLocalization } from '~/composables/useLocalization'
import { compareUrlOf, shortRevision, useUpdateNotificationsStore, type SourceUpdateNotification } from '~/stores/updateNotificationsStore'
import UpdateNotificationMeta from './UpdateNotificationMeta.vue'

const props = defineProps<{ item: SourceUpdateNotification }>()
const emit = defineEmits<{ (event: 'update', item: SourceUpdateNotification): void }>()
const { t } = useLocalization()
const store = useUpdateNotificationsStore()
// "New" marks items still waiting; an item updated during the visit drops it.
const isNew = computed(() => props.item.state !== 'handled' && (store.isNew(props.item.id) || props.item.unread))
</script>
