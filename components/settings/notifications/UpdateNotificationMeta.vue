<template>
  <!-- settings-update-notifications: kind and when it was found; a "New" dot for unread items (this visit). -->
  <p class="flex min-w-0 items-center gap-1.5 text-xs leading-5 text-gray-500" data-testid="update-notification-meta">
    <Icon :icon="KIND_ICONS[kind]" class="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
    <span class="flex-shrink-0 font-medium text-gray-600">{{ t(`settings.notifications.kind.${kind}`) }}</span>
    <span aria-hidden="true">·</span>
    <time class="min-w-0 truncate" :datetime="foundAt" :title="new Date(foundAt).toLocaleString(resolvedLocale)">{{ t('settings.notifications.found', { time: relative }) }}</time>
    <span v-if="isNew" class="ml-auto inline-flex flex-shrink-0 items-center gap-1 text-[11px] font-medium text-sky-700" data-testid="update-notification-new">
      <span class="h-2 w-2 rounded-full bg-sky-600" aria-hidden="true" />{{ t('settings.notifications.new') }}
    </span>
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useLocalization } from '~/composables/useLocalization'
import type { UpdateNotificationKind } from '~/stores/updateNotificationsStore'

const props = defineProps<{ kind: UpdateNotificationKind; foundAt: string; isNew: boolean }>()
const { t, resolvedLocale } = useLocalization()
/** Each kind's icon (a new kind adds one entry). */
const KIND_ICONS: Record<UpdateNotificationKind, string> = {
  app: 'heroicons:computer-desktop-20-solid',
  agent_package: 'heroicons:cube-20-solid',
  skill_source: 'heroicons:sparkles-20-solid',
}
/** "3 hours ago", "yesterday", "2 days ago" in the UI language. */
const relative = computed(() => {
  const seconds = Math.round((new Date(props.foundAt).getTime() - Date.now()) / 1000)
  const format = new Intl.RelativeTimeFormat(String(resolvedLocale.value || 'en'), { numeric: 'auto' })
  const abs = Math.abs(seconds)
  if (abs < 3600) return format.format(Math.round(seconds / 60), 'minute')
  if (abs < 86_400) return format.format(Math.round(seconds / 3600), 'hour')
  return format.format(Math.round(seconds / 86_400), 'day')
})
</script>
