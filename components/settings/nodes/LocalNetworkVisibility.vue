<template>
  <!-- private-network-661 (design, D-6, REQ-018): this node's own switch for the local network, beside the private network's.
       It needs no extension: DNS-SD on the node's local network. Off by default. -->
  <div class="border-t border-slate-100" data-testid="local-network-visibility">
    <div class="px-5 pb-1 pt-4">
      <h4 class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('nodes.localNetwork.title') }}</h4>
    </div>
    <div class="px-5 pb-4 pt-2">
      <div class="flex items-center justify-between gap-4">
        <p id="ln-visible-label" class="min-w-0 text-sm font-medium text-slate-900">{{ t('nodes.localNetwork.label') }}</p>
        <div class="inline-flex flex-shrink-0 items-center gap-3 pt-0.5">
          <span class="text-sm font-medium" :class="network.visibleOnLocal ? 'text-emerald-700' : 'text-slate-500'" aria-hidden="true">{{ network.visibleOnLocal ? t('nodes.privateNetwork.on') : t('nodes.privateNetwork.off') }}</span>
          <button
            type="button"
            role="switch"
            :aria-checked="network.visibleOnLocal"
            aria-labelledby="ln-visible-label"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
            :class="network.visibleOnLocal ? 'bg-emerald-500' : 'bg-slate-300'"
            data-testid="local-network-visible-switch"
            @click="toggle"
          ><span aria-hidden="true" class="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none" :class="network.visibleOnLocal ? 'translate-x-5' : 'translate-x-0.5'" /></button>
        </div>
      </div>
      <p class="mt-0.5 max-w-2xl text-sm leading-6 text-slate-500">{{ t('nodes.localNetwork.help') }}</p>
      <p v-if="network.visibleOnLocal" class="mt-1 text-sm text-slate-600" data-testid="local-network-visible-as">{{ t('nodes.localNetwork.visibleAs', { name: nodeName }) }} <span class="font-mono text-xs text-slate-500">{{ network.localAddress }}</span></p>
      <!-- Turning it on while this node does not accept local-network connections (the existing per-network setting) -->
      <div v-if="asking" class="mt-2 max-w-2xl rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900" role="alertdialog" :aria-label="t('nodes.localNetwork.allowTitle')" data-testid="local-network-allow">
        <p class="font-medium">{{ t('nodes.localNetwork.allowTitle') }}</p>
        <p class="mt-0.5 leading-5">{{ t('nodes.localNetwork.allowBody') }}</p>
        <div class="mt-2 flex flex-wrap items-center gap-2">
          <button type="button" class="inline-flex h-8 items-center gap-2 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:opacity-60" :disabled="allowing" data-testid="local-network-allow-yes" @click="allow">
            <span v-if="allowing" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" aria-hidden="true" />{{ t('nodes.localNetwork.allowYes') }}
          </button>
          <button type="button" class="h-8 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :disabled="allowing" @click="asking = false">{{ t('nodes.privateNetwork.cancel') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLocalization } from '~/composables/useLocalization'
import { usePrivateNetworkStore } from '~/stores/privateNetworkStore'

/** "Visible on my local network" (REQ-018): announces this node's name and address on its local network while on. */
defineProps<{ nodeName: string }>()
const { t } = useLocalization()
const network = usePrivateNetworkStore()
const asking = ref(false)
const allowing = ref(false)
const toggle = (): void => {
  if (network.visibleOnLocal) { network.setVisibleOnLocal(false); return }
  if (network.localAllowed) { network.setVisibleOnLocal(true); return }
  asking.value = true
}
const allow = async (): Promise<void> => {
  allowing.value = true
  try { await network.allowLocalAndShow(); asking.value = false } finally { allowing.value = false }
}
</script>
