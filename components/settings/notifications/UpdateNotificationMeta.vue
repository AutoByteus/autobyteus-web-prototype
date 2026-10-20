<template>
  <!-- settings-update-notifications (round 4): the item's headline says its type in words ("Agent package update"),
       with the type's outline icon in the app's sidebar style (grey, no tile), and a "New" marker while unread. -->
  <p class="flex min-w-0 items-center gap-2" data-testid="update-notification-meta">
    <Icon :icon="KIND_ICONS[kind]" class="h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" :data-kind-icon="kind" />
    <span class="min-w-0 flex-1 truncate text-sm font-semibold leading-5 text-gray-900" data-testid="update-notification-kind">{{ t(`settings.notifications.kind.${kind}`) }}</span>
    <span v-if="isNew" class="inline-flex flex-shrink-0 items-center gap-1 text-[11px] font-medium text-sky-700" data-testid="update-notification-new">
      <span class="h-2 w-2 rounded-full bg-sky-600" aria-hidden="true" />{{ t('settings.notifications.new') }}
    </span>
  </p>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useLocalization } from '~/composables/useLocalization'
import type { UpdateNotificationKind } from '~/stores/updateNotificationsStore'

defineProps<{ kind: UpdateNotificationKind; isNew: boolean }>()
const { t } = useLocalization()
/** Each type's outline icon, from the same set as the sidebar (Skills uses `sparkles`). A new kind adds one. */
const KIND_ICONS: Record<UpdateNotificationKind, string> = {
  app: 'heroicons:computer-desktop',
  agent_package: 'heroicons:cube',
  skill_source: 'heroicons:sparkles',
}
</script>
