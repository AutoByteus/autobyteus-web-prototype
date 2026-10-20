<template>
  <!-- settings-update-notifications (round 2): each kind's larger icon tile, so kinds are told apart at a glance. -->
  <span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ring-1 ring-inset" :class="KIND_TILES[kind].tile" aria-hidden="true" :data-kind-tile="kind">
    <Icon :icon="KIND_TILES[kind].icon" class="h-5 w-5" />
  </span>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { UpdateNotificationKind } from '~/stores/updateNotificationsStore'

defineProps<{ kind: UpdateNotificationKind }>()
/** Each kind's icon and colour (a new kind adds one entry). */
const KIND_TILES: Record<UpdateNotificationKind, { icon: string; tile: string }> = {
  app: { icon: 'heroicons:computer-desktop-20-solid', tile: 'bg-sky-50 text-sky-600 ring-sky-100' },
  agent_package: { icon: 'heroicons:cube-20-solid', tile: 'bg-violet-50 text-violet-600 ring-violet-100' },
  skill_source: { icon: 'heroicons:sparkles-20-solid', tile: 'bg-amber-50 text-amber-600 ring-amber-100' },
}
</script>
