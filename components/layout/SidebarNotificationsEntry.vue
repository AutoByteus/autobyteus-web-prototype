<template>
  <!-- settings-update-notifications (round 6): the entry to the Notification Center. The Settings row shows words,
       "4 updates", as one pill (blue while some are new, grey once all are read; gone when nothing waits); the strip
       keeps the outline icon with its count badge because it is one icon wide. Clicking toggles the Notification
       Center next to the entry. one entry per notification category with unread items, showing the
       category's icon and count; its name is "3 updates available". It opens the notification area, where each item
       has its actions.
       `inline`: the word pill ("3 updates") on the right of the Settings row in the docked left panel.
       `strip`: the icon with a count badge just above the cog in the collapsed strip. -->
  <template v-for="[category, count] in store.waitingByCategory" :key="category">
    <button
      v-if="variant === 'inline'"
      type="button"
      class="group relative inline-flex h-7 flex-shrink-0 items-center rounded-full px-3 text-xs font-semibold ring-1 ring-inset transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      :class="hasNew(category) ? 'bg-sky-100 text-sky-800 ring-sky-300 hover:bg-sky-200' : 'bg-gray-100 text-gray-700 ring-gray-200 hover:bg-gray-200'"
      :aria-label="description(category, count)"
      :aria-expanded="store.centerOpen"
      aria-haspopup="dialog"
      :data-test="`sidebar-notifications-${category}`"
      :data-new="hasNew(category) || undefined"
      @click="toggle($event, 'above')"
    >
      <span aria-hidden="true">{{ shortLabel(category, count) }}</span>
      <!-- What the count is made of, in words ("1 software update, 1 agent package update, 1 skill update"). -->
      <span v-if="!store.centerOpen" class="invisible absolute bottom-full right-0 z-50 mb-2 whitespace-nowrap rounded bg-gray-900 px-2.5 py-1.5 text-left text-xs font-normal leading-5 text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100" aria-hidden="true" data-test="sidebar-notifications-tooltip">
        <span v-for="line in detailLines()" :key="line" class="block">{{ line }}</span>
      </span>
    </button>
    <button
      v-else
      type="button"
      class="group relative mb-1 rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
      :aria-label="description(category, count)"
      :aria-expanded="store.centerOpen"
      aria-haspopup="dialog"
      :data-test="`sidebar-notifications-${category}`"
      :data-new="hasNew(category) || undefined"
      @click="toggle($event, 'right')"
    >
      <Icon :icon="CATEGORY_ICONS[category]" class="h-5 w-5" aria-hidden="true" />
      <span class="absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-center text-[10px] font-semibold leading-4 text-white ring-2 ring-white" :class="hasNew(category) ? 'bg-sky-700' : 'bg-gray-400'" aria-hidden="true">{{ count }}</span>
      <span v-if="!store.centerOpen" class="invisible absolute left-full z-50 ml-2 whitespace-nowrap rounded bg-gray-900 px-2.5 py-1.5 text-left text-xs leading-5 text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100" aria-hidden="true">
        <span class="block font-medium">{{ label(category, count) }}</span>
        <span v-for="line in detailLines()" :key="line" class="block text-gray-300">{{ line }}</span>
      </span>
    </button>
  </template>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useLocalization } from '~/composables/useLocalization'
import { CATEGORY_ICONS, useUpdateNotificationsStore, type NotificationCategory } from '~/stores/updateNotificationsStore'

defineProps<{ variant: 'inline' | 'strip' }>()
const { t } = useLocalization()
const store = useUpdateNotificationsStore()
const plural = (key: string, count: number) => t(`${key}.${count === 1 ? 'one' : 'other'}`, { count })
/** "1 update available" / "3 updates available" (each category has its own wording). */
const label = (category: NotificationCategory, count: number) => plural(`settings.notifications.sidebar.${category}`, count)
/** The pill's words: "3 updates". */
const shortLabel = (category: NotificationCategory, count: number) => plural(`settings.notifications.sidebar.${category}.short`, count)
/** One line per type: "1 software update", "1 agent package update", "1 skill update". */
const detailLines = () => store.waitingByKind.map(([kind, n]) => plural(`settings.notifications.sidebar.kind.${kind}`, n))
const details = () => detailLines().join(t('settings.notifications.sidebar.listSeparator'))
/** The entry's accessible name: "3 updates available: 1 software update, …". */
const description = (category: NotificationCategory, count: number) =>
  t('settings.notifications.sidebar.description', { summary: label(category, count), details: details() })
const hasNew = (category: NotificationCategory) => store.unreadByCategory.some(([entry]) => entry === category)
/** Opens (or closes) the Notification Center next to this entry: above the Settings row, or right of the strip icon. */
const toggle = (event: MouseEvent, side: 'above' | 'right') => {
  if (store.centerOpen) { store.closeCenter(); return }
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  store.openCenter(side === 'above'
    ? { side, left: 8, bottom: window.innerHeight - rect.top + 8 }
    : { side, left: rect.right + 8, bottom: Math.max(8, window.innerHeight - rect.bottom) })
}
</script>
