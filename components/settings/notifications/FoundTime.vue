<template>
  <!-- settings-update-notifications: "Found 3 hours ago" in the UI language (full time on hover). -->
  <time :datetime="foundAt" :title="new Date(foundAt).toLocaleString(resolvedLocale)" data-testid="update-notification-found">{{ t('settings.notifications.found', { time: relative }) }}</time>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocalization } from '~/composables/useLocalization'

const props = defineProps<{ foundAt: string }>()
const { t, resolvedLocale } = useLocalization()
const relative = computed(() => {
  const seconds = Math.round((new Date(props.foundAt).getTime() - Date.now()) / 1000)
  const format = new Intl.RelativeTimeFormat(String(resolvedLocale.value || 'en'), { numeric: 'auto' })
  const abs = Math.abs(seconds)
  if (abs < 3600) return format.format(Math.round(seconds / 60), 'minute')
  if (abs < 86_400) return format.format(Math.round(seconds / 3600), 'hour')
  return format.format(Math.round(seconds / 86_400), 'day')
})
</script>
