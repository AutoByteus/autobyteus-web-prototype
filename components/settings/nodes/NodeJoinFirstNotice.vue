<template>
  <!-- private-network-661 (REQ-010): this computer reaches a private address only through its own node's Private Network.
       One notice wherever an access code is pasted: Add a node, a Needs connecting row, Found → Control. -->
  <!-- inline: inside a row that already has an amber notice (Needs connecting, Found → Control): text and link, no second box -->
  <p v-if="inline" class="text-sm leading-5 text-amber-900" role="status" data-testid="node-join-first">
    {{ t('nodes.nodeCode.needsJoin', { address: address.replace(/:\d+$/, '') }) }}
    <NuxtLink to="/settings?section=extensions" class="whitespace-nowrap font-medium text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="node-join-first-link">{{ action }}</NuxtLink>
  </p>
  <div v-else class="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900" role="status" data-testid="node-join-first">
    <div class="flex min-w-0 flex-1 basis-56 items-start gap-2.5">
      <NodeNoticeIcon class="mt-0.5" tone="warn" />
      <p class="min-w-0 flex-1 leading-5">{{ t('nodes.nodeCode.needsJoin', { address: address.replace(/:\d+$/, '') }) }}</p>
    </div>
    <NuxtLink to="/settings?section=extensions" class="inline-flex h-7 flex-shrink-0 items-center rounded-md border border-amber-300 bg-white px-2.5 text-xs font-medium text-amber-900 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="node-join-first-link">{{ action }}</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NodeNoticeIcon from '~/components/settings/nodes/NodeNoticeIcon.vue'
import { useLocalization } from '~/composables/useLocalization'
import { useExtensionsStore } from '~/stores/extensionsStore'

defineProps<{ address: string; inline?: boolean }>()
const { t } = useLocalization()
const extensions = useExtensionsStore()
/** "Set up Private Network" when this node has no Private Network; "Open Private Network" when it is installed but not on the network. */
const action = computed(() => {
  const s = extensions.list.find((item) => item.entry.id === 'private-network')?.state
  return s?.kind === 'installed' ? t('nodes.privateNetwork.setup.open') : t('nodes.privateNetwork.setup.action')
})
</script>
