<template>
  <!-- settings-update-notifications (round 3; round 4 restyled to the sidebar's grey outline icons, with a blue count): one entry per notification category with unread items, showing the
       category's icon and count; its name is "3 updates available". It opens the notification area, where each item
       has its actions.
       `inline`: a pill on the right of the Settings row in the docked left panel.
       `strip`: the icon with a count badge just above the cog in the collapsed strip. -->
  <template v-for="[category, count] in store.unreadByCategory" :key="category">
    <button
      v-if="variant === 'inline'"
      type="button"
      class="inline-flex h-9 flex-shrink-0 items-center gap-1.5 rounded-md px-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      :title="label(category, count)"
      :aria-label="label(category, count)"
      :data-test="`sidebar-notifications-${category}`"
      @click="open"
    >
      <Icon :icon="CATEGORY_ICONS[category]" class="h-5 w-5" aria-hidden="true" />
      <span class="min-w-[18px] rounded-full bg-sky-600 px-1.5 text-center text-[11px] font-semibold leading-[18px] text-white" aria-hidden="true">{{ count }}</span>
    </button>
    <button
      v-else
      type="button"
      class="group relative mb-1 rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
      :aria-label="label(category, count)"
      :data-test="`sidebar-notifications-${category}`"
      @click="open"
    >
      <Icon :icon="CATEGORY_ICONS[category]" class="h-5 w-5" aria-hidden="true" />
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

defineProps<{ variant: 'inline' | 'strip' }>()
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
