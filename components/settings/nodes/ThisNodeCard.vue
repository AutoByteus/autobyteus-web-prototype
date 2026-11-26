<template>
  <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" data-testid="this-node-card">
    <div class="px-5 pb-4 pt-5">
      <h3 class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t(k('thisNode.title')) }}</h3>
      <div class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1" data-testid="this-node-name">
        <span class="text-lg font-semibold leading-7 text-slate-900">{{ nodeName }}</span>
        <span class="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize leading-4 text-slate-600">{{ nodeTypeLabel }}</span>
      </div>
      <p v-if="baseUrl" class="mt-0.5 break-all font-mono text-xs text-slate-500" data-testid="this-node-url">{{ baseUrl }}</p>
    </div>

    <!-- extensions-ui-516 (design, pairing-contract §9, founder 2026-11-25): no node-level "Remote collaboration" switch; a node works with exactly the nodes it is paired with. -->
    <!-- extensions-ui-516 (design, founder 2026-11-26): this node's private-network switches are this node's settings -->
    <PrivateNetworkCard part="thisNode" />

    <!-- extensions-ui-516 (design, DEC-015 item 7): who controls this node, with Revoke (owner windows) -->
    <ThisNodeControllers v-if="isOwnerWindow" :reachable-from-others="codeCanWork" />

    <!-- extensions-ui-516 (design, pairing-contract §6, DEC-015 item 6): Create access code only where the code can work: not on the
         desktop's own node while it is not on a private network (its address is reachable only from this computer). -->
    <div v-if="isOwnerWindow && codeCanWork" class="border-t border-slate-100 px-5 py-3" data-testid="this-node-control">
      <button
        type="button"
        class="-ml-1.5 flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        :aria-expanded="controlOpen"
        data-testid="this-node-control-toggle"
        @click="controlOpen = !controlOpen"
      >
        <svg class="h-4 w-4 text-slate-400 transition-transform" :class="controlOpen ? 'rotate-90' : ''" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
        {{ t('nodes.nodeCode.controlTitle') }}
      </button>
      <div v-if="controlOpen" class="mt-2 max-w-3xl pb-1">
        <p class="text-sm leading-6 text-slate-500">{{ t('nodes.nodeCode.controlLead') }}</p>
        <div class="mt-3">
          <NodeCodePanel :node-id="nodeId" :address="codeAddress" :node-name="nodeName" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import NodeCodePanel from '~/components/settings/nodes/NodeCodePanel.vue'
import PrivateNetworkCard from '~/components/settings/nodes/PrivateNetworkCard.vue'
import ThisNodeControllers from '~/components/settings/nodes/ThisNodeControllers.vue'
import { useLocalization } from '~/composables/useLocalization'
import { useNodeListStore } from '~/stores/nodeListStore'
import { usePrivateNetworkStore } from '~/stores/privateNetworkStore'
import { useNodeAccessStore } from '~/stores/nodeAccessStore'
import { useWindowNodeContextStore } from '~/stores/windowNodeContextStore'
import { NODES_PAGE_KEY } from '~/utils/nodeConnectionErrorText'

/** "This node": its name, type and address; "Visible on my private network"; in owner windows, "Create access code". Pairing is per node, in the Nodes list (pairing-contract §9). */
defineProps<{ nodeName: string; nodeTypeLabel: string; baseUrl?: string }>()

const { t } = useLocalization()
const k = (key: string): string => `${NODES_PAGE_KEY}${key}`
const store = useNodeListStore()
const controlOpen = ref(false)
const network = usePrivateNetworkStore()
/** The access code says where another AutoByteus reaches this node: its private address when joined, else this window's address of it. */
const nodeId = computed(() => store.thisNodeId ?? store.currentNode?.nodeId ?? 'srv_m9VFq2Lw')
const codeAddress = computed(() => (network.joined ? network.thisMachine.address : windowHost.value))
/** Making a node code on a node that has an owner is an owner action (NA-5): only windows holding the owner credential, never a phone. */
const windowNode = useWindowNodeContextStore()
const access = useNodeAccessStore()
const isOwnerWindow = computed(() => typeof window !== 'undefined' && Boolean(window.electronAPI)
  && (windowNode.isEmbeddedWindow || access.stateOf(windowNode.entryId) === 'connected'))
/**
 * One rule for every node (DEC-015 item 6): the code works only when another computer can reach the address it carries, i.e.
 * the node's private-network address, or a local-network address it is published on. A node on 127.0.0.1 / localhost only
 * (the Embedded node; a Docker node published on 127.0.0.1, NA-4) gets no Create access code until it is on a private network.
 */
const LOCAL_ONLY = /^(localhost|127\.|\[?::1\]?$|host\.docker\.internal)/i
const windowHost = computed(() => (store.currentNode?.baseUrl ?? '').replace(/^https?:\/\//, '').replace(/\/.*$/, ''))
const codeCanWork = computed(() => network.joined || (Boolean(windowHost.value) && !LOCAL_ONLY.test(windowHost.value)))
</script>
