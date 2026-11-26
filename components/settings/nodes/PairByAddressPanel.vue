<template>
  <!-- private-network-661 (design, D-5, REQ-008): pair with someone else's node by its plain address; its owner accepts. It replaces
       today's invite text. Same band as "Add a node" above the Controlled nodes list. -->
  <form class="border-y border-slate-200 bg-slate-50 px-5 pb-4 pt-3.5" data-testid="pair-by-address" @submit.prevent="submit">
    <h4 class="mb-2.5 text-sm font-semibold text-slate-900">{{ t('nodes.pairByAddress.title') }}</h4>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div class="min-w-0 sm:w-[26rem]">
        <input
          v-model="address"
          type="text"
          spellcheck="false"
          autocomplete="off"
          class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 font-mono text-[0.8125rem] text-slate-900 shadow-sm transition placeholder:font-sans placeholder:text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          :class="error ? 'border-red-300' : ''"
          :placeholder="t('nodes.pairByAddress.placeholder')"
          :aria-label="t('nodes.pairByAddress.label')"
          :aria-invalid="Boolean(error)"
          :disabled="busy"
          data-testid="pair-by-address-input"
        >
        <p v-if="error" class="mt-1.5 text-sm text-red-600" role="alert" data-testid="pair-by-address-error">{{ error }}</p>
      </div>
      <button
        type="submit"
        class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:opacity-50"
        :disabled="busy"
        data-testid="pair-by-address-submit"
      >
        <span v-if="busy" class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
        <RemoteCollaborationIcon v-else size-class="h-4 w-4" />
        {{ busy ? t('nodes.pairByAddress.reaching') : t('nodes.pairByAddress.submit') }}
      </button>
    </div>
    <p v-if="!error" class="mt-2 text-xs leading-5 text-slate-500" data-testid="pair-by-address-hint">{{ t('nodes.pairByAddress.hint') }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RemoteCollaborationIcon from '~/components/settings/nodes/RemoteCollaborationIcon.vue'
import { useLocalization } from '~/composables/useLocalization'
import { useNodeListStore } from '~/stores/nodeListStore'
import { usePrivateNetworkStore } from '~/stores/privateNetworkStore'

/**
 * Pair by address (pairing-contract §3 case 2 over a plain address): `/pair` with a request ID; the other node shows
 * "<name> at <address> wants to pair" until its owner Accepts or Rejects. A node this AutoByteus controls pairs from its own
 * row (one Pair per node, DC-068); this node and nodes already paired are named, not asked.
 */
const { t } = useLocalization()
const network = usePrivateNetworkStore()
const list = useNodeListStore()
const address = ref('')
const error = ref('')
const busy = ref(false)

const hostPort = (url: string | null | undefined): string => String(url ?? '').trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '').toLowerCase()
const THIS_NODE = ['localhost:29695', '127.0.0.1:29695', '192.168.2.10:29695', '100.88.10.10:29695']

async function submit(): Promise<void> {
  if (busy.value) return
  error.value = ''
  const typed = network.addressFormOf(address.value)
  if (!typed) { error.value = t('nodes.pairByAddress.errorFormat'); return }
  if (THIS_NODE.includes(typed)) { error.value = t('nodes.pairByAddress.errorThisNode'); return }
  const row = list.rows.find((r) => [r.windowAddress, r.peer?.baseUrl].some((u) => u && hostPort(u) === typed))
  if (row) {
    const legacy = network.legacyOf(row.nodeId)
    error.value = row.entryIds.length
      ? t(legacy ? 'nodes.pairByAddress.errorControlledAgain' : 'nodes.pairByAddress.errorControlled', { name: row.name })
      : legacy ? t('nodes.pairByAddress.errorLegacy', { name: row.name }) : t('nodes.pairByAddress.errorPaired', { name: row.name })
    return
  }
  busy.value = true
  try {
    const result = await network.pairByAddress(typed)
    if (result.ok) { address.value = ''; return }
    error.value = result.error === 'refused' ? t('nodes.pairByAddress.errorRefused', { address: result.address ?? typed })
      : result.error === 'noNode' ? t('nodes.pairByAddress.errorNoNode', { address: result.address ?? typed }) : t('nodes.pairByAddress.errorFormat')
  } finally {
    busy.value = false
  }
}
</script>
