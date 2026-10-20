<template>
  <!-- settings-update-notifications (round 2): a labelled entry per notification category with unread items, just
       above Settings ("3 updates available"). It opens the notification area, where each item has its actions.
       `panel`: a row in the docked left panel. `strip`: the category icon with a count in the collapsed strip. -->
  <template v-for="[category, count] in store.unreadByCategory" :key="category">
    <button
      v-if="variant === 'panel'"
      type="button"
      class="mb-1 flex w-full items-center gap-2.5 rounded-md bg-sky-50 px-3 py-2 text-left text-sm font-medium text-sky-900 ring-1 ring-inset ring-sky-200 transition-colors hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      :data-test="`sidebar-notifications-${category}`"
      @click="open"
    >
      <Icon :icon="CATEGORY_ICONS[category]" class="h-5 w-5 flex-shrink-0 text-sky-600" aria-hidden="true" />
      <span class="min-w-0 flex-1 truncate">{{ label(category, count) }}</span>
      <Icon icon="heroicons:chevron-right-20-solid" class="h-4 w-4 flex-shrink-0 text-sky-500" aria-hidden="true" />
    </button>
    <button
      v-else
      type="button"
      class="group relative mb-1 rounded-md p-2 transition-colors hover:bg-sky-50"
      :aria-label="label(category, count)"
      :data-test="`sidebar-notifications-${category}`"
      @click="open"
    >
      <Icon :icon="CATEGORY_ICONS[category]" class="h-5 w-5 text-sky-600" aria-hidden="true" />
      <span class="absolute right-0 top-0 min-w-[16px] rounded-full bg-sky-600 px-1 text-center text-[10px] font-semibold leading-4 text-white ring-2 ring-white" aria-hidden="true">{{ count }}</span>
      <span class="invisible absolute left-full z-50 ml-2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100" aria-hidden="true">{{ label(category, count) }}</span>
    </button>
  </template>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { useLocalization } from '~/composables/useLocalization'
import { CATEGORY_ICONS, useUpdateNotificationsStore, type NotificationCategory } from '~/stores/updateNotificationsStore'

defineProps<{ variant: 'panel' | 'strip' }>()
const emit = defineEmits<{ (event: 'navigate'): void }>()
const { t } = useLocalization()
const store = useUpdateNotificationsStore()
const router = useRouter()
/** "1 update available" / "3 updates available" (each category has its own wording). */
const label = (category: NotificationCategory, count: number) =>
  t(count === 1 ? `settings.notifications.sidebar.${category}.one` : `settings.notifications.sidebar.${category}.other`, { count })
const open = async () => {
  emit('navigate')
  await router.push('/settings?section=notifications')
}
</script>
