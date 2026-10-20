<template>
  <!-- settings-update-notifications (round 8): one card per type of update, in the manner of macOS notifications.
       The type's icon and its name in words; then its updates (the app; each agent package; each skill source), each
       with its change and its own actions in place. With one update the card reads "Agent package update" and shows
       the time; with several it reads "Agent package updates  2" and each entry shows its own time. Long lists show
       the first three and "Show N more". -->
  <li class="rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-200/80" :data-testid="`notification-card-${kind}`">
    <div class="flex items-start gap-2.5">
      <span class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600" aria-hidden="true">
        <Icon :icon="KIND_ICONS[kind]" class="h-5 w-5" />
      </span>
      <div class="min-w-0 flex-1">
        <h3 :id="headingId" class="flex items-baseline gap-2">
          <span class="min-w-0 flex-1 truncate text-[13px] font-semibold leading-5 text-gray-900" data-testid="notification-card-title">
            {{ t(grouped ? `settings.notifications.kindGroup.${kind}` : `settings.notifications.kind.${kind}`) }}<span v-if="grouped && waiting" class="ml-1.5 font-normal text-gray-500" data-testid="notification-card-count">{{ waiting }}</span>
          </span>
          <template v-if="!grouped">
            <span class="flex-shrink-0 text-[11px] font-normal leading-5 text-gray-500" :title="new Date(firstFoundAt).toLocaleString(resolvedLocale)">{{ shortRelativeTime(firstFoundAt, String(resolvedLocale || 'en')) }}</span>
            <span v-if="firstIsNew" class="h-2 w-2 flex-shrink-0 self-center rounded-full bg-sky-700" data-testid="notification-entry-new" />
            <span v-if="firstIsNew" class="sr-only">{{ t('settings.notifications.new') }}</span>
          </template>
        </h3>
        <ul :class="grouped ? 'divide-y divide-gray-100' : ''" :aria-labelledby="headingId">
          <NotificationEntry v-if="kind === 'app'" />
          <NotificationEntry v-for="item in shown" v-else :key="item.id" :item="item" :grouped="grouped" @update="emit('update', $event)" />
        </ul>
        <button
          v-if="hiddenCount > 0"
          type="button"
          class="mt-2 rounded-md text-xs font-medium text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          :aria-expanded="showAll"
          data-testid="notification-card-more"
          @click="showAll = !showAll"
        >{{ showAll ? t('settings.notifications.showLess') : t('settings.notifications.showMore', { count: hiddenCount }) }}</button>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useLocalization } from '~/composables/useLocalization'
import { useUpdateNotificationsStore, type SourceUpdateNotification, type UpdateNotificationKind } from '~/stores/updateNotificationsStore'
import NotificationEntry from './NotificationEntry.vue'
import { shortRelativeTime } from './notificationTime'

/** `items`: this type's agent packages or skill sources, waiting first; none for the app update. */
const props = withDefaults(defineProps<{ kind: UpdateNotificationKind; items?: SourceUpdateNotification[] }>(), { items: () => [] })
const emit = defineEmits<{ (event: 'update', item: SourceUpdateNotification): void }>()
const { t, resolvedLocale } = useLocalization()
const store = useUpdateNotificationsStore()
const headingId = `notification-card-heading-${Math.random().toString(36).slice(2, 8)}`
const LIMIT = 3
const showAll = ref(false)

/** Each type's outline icon, from the sidebar's set. A new kind adds one. */
const KIND_ICONS: Record<UpdateNotificationKind, string> = {
  app: 'heroicons:computer-desktop', agent_package: 'heroicons:cube', skill_source: 'heroicons:sparkles',
}
const grouped = computed(() => props.kind !== 'app' && props.items.length > 1)
const waiting = computed(() => props.items.filter((item) => item.state !== 'handled').length)
const shown = computed(() => (showAll.value ? props.items : props.items.slice(0, LIMIT)))
/** How many are behind "Show N more" (kept while expanded, so the button can read "Show less"). */
const hiddenCount = computed(() => Math.max(0, props.items.length - LIMIT))
/** With a single update, the card's header carries its time and "New" dot. */
const first = computed(() => props.items[0])
const firstFoundAt = computed(() => first.value?.foundAt ?? store.appFoundAt ?? new Date().toISOString())
const firstIsNew = computed(() => first.value
  ? first.value.state !== 'handled' && (store.isNew(first.value.id) || first.value.unread)
  : store.isNew('app') || store.appUnread)
</script>
