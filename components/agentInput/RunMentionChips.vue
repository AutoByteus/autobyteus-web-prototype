<template>
  <span
    v-for="chip in chips"
    :key="chip.key"
    class="inline-flex max-w-full items-center gap-1 rounded-md border py-0.5 pl-1.5 pr-1 text-xs font-medium"
    :class="chip.inRun ? 'border-gray-200 bg-gray-50 text-gray-700' : 'border-sky-200 bg-sky-50 text-sky-800'"
    :data-test="`run-mention-chip-${chip.name}`"
    :data-in-run="chip.inRun ? 'true' : 'false'"
  >
    <Icon :icon="chip.kind === 'team' ? 'heroicons:user-group-20-solid' : 'heroicons:user-20-solid'" class="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
    <span class="truncate">@{{ chip.name }}</span>
    <span v-if="chip.inRun" class="flex-shrink-0 font-normal text-gray-500">· {{ $t('chat.mentions.inRun') }}</span>
    <button
      type="button"
      class="rounded p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
      :class="chip.inRun ? 'text-gray-400 hover:bg-gray-100 hover:text-gray-700' : 'text-sky-500 hover:bg-sky-100 hover:text-sky-800'"
      :aria-label="$t('chat.mentions.removeMention', { name: chip.name })"
      @click="emit('remove', chip)"
    >
      <Icon icon="heroicons:x-mark" class="h-3 w-3" aria-hidden="true" />
    </button>
  </span>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { RunMentionChip } from '~/composables/agentInput/useRunMentions'

/** Removable `@mention` chips for the collaborators named in a live-run message box. */
defineProps<{ chips: readonly RunMentionChip[] }>()
const emit = defineEmits<{ (event: 'remove', chip: RunMentionChip): void }>()
</script>
