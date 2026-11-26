<template>
  <!-- extensions-ui-516 (design, founder 2026-11-26): the list is two named sections; each node is in exactly one.
       "Controlled nodes": this AutoByteus has its access code (and a node added by address that still needs one).
       "Paired nodes": paired with this node, not controlled by this AutoByteus (other people's nodes). -->
  <section class="nodes-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" data-testid="node-list-card">
    <div class="px-5 pb-4 pt-5">
      <h3 class="text-base font-semibold text-slate-900">{{ t('nodes.sections.controlledTitle') }}</h3>
      <p class="mt-1 max-w-3xl text-sm text-slate-500">{{ t('nodes.sections.controlledLead') }}</p>
    </div>
    <!-- Add a node: above the list, as before (founder 2026-11-26) -->
    <AddNodePanel />
    <ul v-if="controlled.length" class="divide-y divide-slate-100" data-testid="node-list">
      <NodeRow v-for="row in controlled" :key="row.key" :row="row" @guide="emit('guide')" />
    </ul>
    <p v-else class="border-t border-slate-100 px-5 py-6 text-center text-sm text-slate-500" data-testid="node-list-empty">{{ t('nodes.sections.controlledEmpty') }}</p>
  </section>

  <section class="nodes-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" data-testid="paired-list-card">
    <div class="px-5 pb-4 pt-5">
      <h3 class="text-base font-semibold text-slate-900">{{ t('nodes.sections.pairedTitle') }}</h3>
      <p class="mt-1 max-w-3xl text-sm text-slate-500">{{ t('nodes.sections.pairedLead') }}</p>
    </div>
    <!-- private-network-661 (D-5): pair with someone else's node by its address, above the list like Add a node -->
    <PairByAddressPanel />
    <ul v-if="pairedOnly.length || network.outgoing.length" class="divide-y divide-slate-100" data-testid="paired-list">
      <!-- this node's requests by address: waiting for the other owner, or declined -->
      <li v-for="request in network.outgoing" :key="request.id" class="px-5 py-3.5" :data-testid="`pair-request-${request.address}`">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex min-w-0 items-start gap-3">
            <span class="mt-[7px] inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-slate-300" aria-hidden="true" />
            <div class="min-w-0">
              <p class="break-all font-mono text-sm font-semibold leading-6 text-slate-900">{{ request.address }}</p>
              <p v-if="request.phase === 'waiting'" class="mt-0.5 inline-flex items-center gap-1.5 text-xs leading-4 text-slate-600" role="status">
                <span class="h-3 w-3 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 motion-reduce:animate-none" aria-hidden="true" />{{ t('nodes.pairByAddress.waiting') }}
              </p>
              <p v-else class="mt-0.5 text-xs leading-4 text-slate-600" role="status" :data-testid="`pair-request-declined-${request.address}`">{{ t('nodes.pairByAddress.declined') }}</p>
            </div>
          </div>
          <div class="flex flex-shrink-0 items-center gap-2 pl-5 sm:pl-0">
            <button v-if="request.phase === 'waiting'" type="button" class="rounded px-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :data-testid="`pair-request-cancel-${request.address}`" @click="network.cancelOutgoing(request.id)">{{ t('nodes.privateNetwork.cancel') }}</button>
            <template v-else>
              <button type="button" class="h-8 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="network.pairByAddress(request.address)">{{ t('nodes.privateNetwork.found.pairAgain') }}</button>
              <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" :title="t('nodes.pairByAddress.dismiss')" :aria-label="t('nodes.pairByAddress.dismiss')" @click="network.cancelOutgoing(request.id)">
                <svg class="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6m1.5 0-.6 9a1.5 1.5 0 0 1-1.5 1.4H8.6A1.5 1.5 0 0 1 7.1 15L6.5 6" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </button>
            </template>
          </div>
        </div>
      </li>
      <NodeRow v-for="row in pairedOnly" :key="row.key" :row="row" @guide="emit('guide')" />
    </ul>
    <p v-else class="px-5 py-6 text-center text-sm text-slate-500" data-testid="paired-list-empty">{{ t('nodes.sections.pairedEmpty') }}</p>
  </section>

  <NodeChangeDialog @guide="emit('guide')" />
</template>

<style scoped>
/* The rows lay themselves out by the width of this card (container queries), not by the window's. */
.nodes-card { container-type: inline-size; }
</style>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import AddNodePanel from '~/components/settings/nodes/AddNodePanel.vue'
import NodeChangeDialog from '~/components/settings/nodes/NodeChangeDialog.vue'
import NodeRow from '~/components/settings/nodes/NodeRow.vue'
import PairByAddressPanel from '~/components/settings/nodes/PairByAddressPanel.vue'
import { usePrivateNetworkStore } from '~/stores/privateNetworkStore'
import { useLocalization } from '~/composables/useLocalization'
import { useNodeChangeDialogStore } from '~/stores/nodeChangeDialogStore'
import { useNodeListStore } from '~/stores/nodeListStore'

/** "Controlled nodes" (with Add node above its list) and "Paired nodes" (UIS-001, split by the founder 2026-11-26): every node once; each row is asked when the tab opens. */
const emit = defineEmits<{ guide: [] }>()
const { t } = useLocalization()
const store = useNodeListStore()
const dialog = useNodeChangeDialogStore()
const network = usePrivateNetworkStore()
/** A desktop entry means this AutoByteus lists the node to control it; a node only this node knows (its peer) is paired, not controlled. */
const controlled = computed(() => store.rows.filter((row) => row.entryIds.length > 0))
const pairedOnly = computed(() => store.rows.filter((row) => row.entryIds.length === 0))

onMounted(() => { void store.open() })
// Leaving the tab: answers on their way are ignored and a confirmation not running closes.
onBeforeUnmount(() => { store.close(); dialog.cancel() })
</script>
