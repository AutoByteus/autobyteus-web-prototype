<template>
  <!-- settings-update-notifications (round 13): one section per type of update in the panel (no card box, border or
       shadow; sections are separated by one thin line in the panel). A small grey header (the type's icon and name in words) and then the updates as rows, App Store style: the name,
       the change and time below it, and the one action on the right. Long lists show the first three and
       "Show N more". -->
  <li class="px-4 pb-1.5 pt-3" :data-testid="`notification-card-${kind}`">
    <h3 :id="headingId" class="flex items-center gap-1.5 text-xs font-medium leading-5 text-gray-500" data-testid="notification-card-title">
      <Icon :icon="KIND_ICONS[kind]" class="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span class="truncate">{{ t(items.length > 1 ? `settings.notifications.kindGroup.${kind}` : `settings.notifications.kind.${kind}`) }}</span>
    </h3>
    <ul :aria-labelledby="headingId">
      <NotificationEntry v-if="kind === 'app'" />
      <NotificationEntry v-for="item in shown" v-else :key="item.id" :item="item" @update="emit('update', $event)" />
    </ul>
    <button
      v-if="hiddenCount > 0"
      type="button"
      class="mb-2 rounded-md text-xs font-medium text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      :aria-expanded="showAll"
      data-testid="notification-card-more"
      @click="showAll = !showAll"
    >{{ showAll ? t('settings.notifications.showLess') : t('settings.notifications.showMore', { count: hiddenCount }) }}</button>
  </li>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useLocalization } from '~/composables/useLocalization'
import type { SourceUpdateNotification, UpdateNotificationKind } from '~/stores/updateNotificationsStore'
import NotificationEntry from './NotificationEntry.vue'

/** `items`: this type's agent packages or skill sources, waiting first; none for the app update. */
const props = withDefaults(defineProps<{ kind: UpdateNotificationKind; items?: SourceUpdateNotification[] }>(), { items: () => [] })
const emit = defineEmits<{ (event: 'update', item: SourceUpdateNotification): void }>()
const { t } = useLocalization()
const headingId = `notification-card-heading-${Math.random().toString(36).slice(2, 8)}`
const LIMIT = 3
const showAll = ref(false)

/** Each type's outline icon, from the sidebar's set. A new kind adds one. */
const KIND_ICONS: Record<UpdateNotificationKind, string> = {
  app: 'heroicons:computer-desktop', agent_package: 'heroicons:cube', skill_source: 'heroicons:sparkles',
}
const shown = computed(() => (showAll.value ? props.items : props.items.slice(0, LIMIT)))
/** How many are behind "Show N more" (kept while expanded, so the button can read "Show less"). */
const hiddenCount = computed(() => Math.max(0, props.items.length - LIMIT))
</script>
