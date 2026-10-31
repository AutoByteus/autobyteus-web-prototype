<template>
  <div
    class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50"
    :data-testid="`integration-icon-${item.id}`"
  >
    <img v-if="item.icon" :src="`/integrations-icons-${item.icon}.svg`" alt="" class="h-6 w-6" aria-hidden="true">
    <span v-else class="text-base font-semibold text-slate-500" aria-hidden="true">{{ item.name.charAt(0).toUpperCase() }}</span>
  </div>
</template>

<script setup lang="ts">
import type { IntegrationView } from '~/stores/integrationsStore'

defineProps<{ item: IntegrationView }>()
</script>
