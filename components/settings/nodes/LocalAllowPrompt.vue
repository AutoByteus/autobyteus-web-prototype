<template>
  <!-- private-network-661 (design, F-5; pairing-contract §4b): pairing over the local network needs this node to accept
       local-network connections: the other owner's Accept, and later the peer's requests, come back as new connections. -->
  <div class="max-w-2xl rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900" role="alertdialog" :aria-label="t('nodes.localNetwork.allowTitle')" data-testid="local-allow-prompt">
    <p class="font-medium">{{ t('nodes.localNetwork.allowTitle') }}</p>
    <p class="mt-0.5 leading-5">{{ t('nodes.localNetwork.allowPairBody') }}</p>
    <div class="mt-2 flex flex-wrap items-center gap-2">
      <button type="button" class="inline-flex h-8 items-center gap-2 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:opacity-60" :disabled="busy" data-testid="local-allow-pair" @click="allow">
        <span v-if="busy" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" aria-hidden="true" />{{ t('nodes.localNetwork.allowPair') }}
      </button>
      <button type="button" class="h-8 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :disabled="busy" @click="emit('cancel')">{{ t('nodes.privateNetwork.cancel') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLocalization } from '~/composables/useLocalization'
import { usePrivateNetworkStore } from '~/stores/privateNetworkStore'

/** "Allow and pair": the node accepts this local network (the existing per-network setting), then the Pair goes ahead. */
const emit = defineEmits<{ allowed: []; cancel: [] }>()
const { t } = useLocalization()
const network = usePrivateNetworkStore()
const busy = ref(false)
const allow = async (): Promise<void> => {
  busy.value = true
  try { await network.allowLocal(); emit('allowed') } finally { busy.value = false }
}
</script>
