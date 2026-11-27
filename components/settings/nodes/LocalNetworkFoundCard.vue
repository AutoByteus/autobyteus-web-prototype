<template>
  <!-- private-network-661 (design, D-6, REQ-018/019; pairing-contract §4b): AutoByteus nodes announcing on this local network,
       in neither Controlled nodes nor Paired nodes, and not already under Found on your private network. No accounts here:
       each row is "<name> at <address>"; Pair is pairing by address (its owner accepts); Control takes the node's access code. -->
  <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" data-testid="local-network-found-card">
    <div class="flex items-start justify-between gap-4 px-5 pb-4 pt-5">
      <div class="min-w-0">
        <h3 class="text-base font-semibold text-slate-900">{{ t('nodes.localNetwork.foundTitle') }}</h3>
        <p class="mt-1 max-w-3xl text-sm text-slate-500">{{ t('nodes.localNetwork.foundLead') }}</p>
      </div>
      <button
        type="button"
        class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        :title="t('nodes.privateNetwork.found.checkAgain')"
        :aria-label="t('nodes.privateNetwork.found.checkAgain')"
        data-testid="local-network-look-again"
        @click="lookAgain"
      >
        <svg class="h-[18px] w-[18px]" :class="looking ? 'animate-spin motion-reduce:animate-none' : ''" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M16 10a6 6 0 1 1-1.76-4.24M16 4v3.5h-3.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </div>
    <ul v-if="shown.length" class="divide-y divide-slate-100 border-t border-slate-100" data-testid="local-network-found">
      <li v-for="node in shown" :key="node.nodeId" class="px-5 py-3.5" :data-testid="`local-network-found-${node.name}`">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex min-w-0 items-start gap-3">
            <span class="mt-[7px] inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-500" role="img" :aria-label="t('nodes.privateNetwork.found.online')" />
            <p class="min-w-0 break-words text-sm leading-6 text-slate-500"><span class="font-semibold text-slate-900">{{ node.name }}</span> {{ t('nodes.localNetwork.at') }} <span class="font-mono text-xs">{{ node.address }}</span></p>
          </div>
          <div class="flex flex-shrink-0 items-center gap-2 pl-5 sm:pl-0">
            <template v-if="node.phase === 'waiting'">
              <span class="text-sm text-slate-600" role="status">{{ t('nodes.privateNetwork.found.waitingUnknown') }}</span>
              <button type="button" class="rounded px-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :data-testid="`local-network-cancel-${node.name}`" @click="network.cancelLocal(node.nodeId)">{{ t('nodes.privateNetwork.found.cancel') }}</button>
            </template>
            <template v-else-if="controlOpen !== node.nodeId">
              <span v-if="node.phase === 'declined'" class="text-sm text-slate-600" role="status">{{ t('nodes.privateNetwork.found.declinedUnknown') }}</span>
              <button type="button" :class="BUTTON" :data-testid="`local-network-control-${node.name}`" @click="openControl(node)">{{ t('nodes.sections.control') }}</button>
              <button type="button" :class="BUTTON" :data-testid="`local-network-pair-${node.name}`" @click="network.pairLocal(node.nodeId)">{{ node.phase === 'declined' ? t('nodes.privateNetwork.found.pairAgain') : t('nodes.privateNetwork.found.pair') }}</button>
            </template>
          </div>
        </div>
        <!-- Control: the node's access code, inline (as under Found on your private network) -->
        <form v-if="controlOpen === node.nodeId" class="ml-5 mt-2 max-w-3xl" :data-testid="`local-network-control-form-${node.name}`" @submit.prevent="control(node)">
          <p class="mb-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-5 text-amber-900"><NodeNoticeIcon class="mt-0.5" tone="warn" />{{ t('nodes.sections.unknownWarning') }}</p>
          <div class="flex flex-wrap items-center gap-2">
            <input
              v-model="controlCode"
              type="text"
              spellcheck="false"
              autocomplete="off"
              class="h-9 min-w-0 flex-1 basis-64 rounded-lg border border-slate-300 bg-white px-3 font-mono text-xs text-slate-900 shadow-sm placeholder:font-sans placeholder:text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              :class="controlError ? 'border-red-300' : ''"
              :placeholder="t('nodes.nodeCode.fieldPlaceholder')"
              :aria-label="t('nodes.nodeCode.codeLabel', { name: node.name })"
              :disabled="controlBusy"
              :data-testid="`local-network-control-code-${node.name}`"
            >
            <button type="submit" class="h-9 rounded-md bg-blue-600 px-3.5 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:opacity-50" :disabled="controlBusy || !controlCode.trim()">{{ t('nodes.sections.controlAdd') }}</button>
            <button type="button" class="rounded px-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :disabled="controlBusy" @click="closeControl">{{ t('nodes.privateNetwork.found.cancel') }}</button>
          </div>
          <p v-if="controlError" class="mt-1.5 text-sm text-red-600" role="alert">{{ controlError }}</p>
          <p v-else-if="controlStep" class="mt-1.5 flex items-center gap-2 text-sm text-slate-600" role="status"><span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 motion-reduce:animate-none" aria-hidden="true" />{{ controlStep }}</p>
          <p v-else class="mt-1.5 text-xs leading-5 text-slate-500">{{ t('nodes.sections.controlHint', { name: node.name }) }}</p>
          <!-- Design reference only: what access-code prints on that machine, so the flow can be tried here. -->
          <button type="button" class="mt-1.5 rounded border border-dashed border-slate-300 px-2 py-0.5 text-xs text-slate-500 hover:text-slate-800" :data-testid="`local-network-control-sample-${node.name}`" @click="controlCode = makeNodeCode(node.nodeId, node.address).text">{{ t('nodes.sections.controlSample', { name: node.name }) }}</button>
        </form>
      </li>
    </ul>
    <p v-else class="border-t border-slate-100 px-5 py-6 text-center text-sm text-slate-500" data-testid="local-network-found-empty">{{ t('nodes.localNetwork.empty') }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import NodeNoticeIcon from '~/components/settings/nodes/NodeNoticeIcon.vue'
import { useLocalization } from '~/composables/useLocalization'
import { makeNodeCode } from '~/prototype/nodes/nodeCode'
import { useAddWithAccessCode } from '~/prototype/nodes/addWithAccessCode'
import { useNodeListStore } from '~/stores/nodeListStore'
import { useNodeStore } from '~/stores/nodeStore'
import { usePrivateNetworkStore, type LocalNode } from '~/stores/privateNetworkStore'

const { t } = useLocalization()
const network = usePrivateNetworkStore()
const nodeStore = useNodeStore()
const list = useNodeListStore()
const BUTTON = 'h-8 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
const hostPort = (url: string | null | undefined): string => String(url ?? '').replace(/^https?:\/\//i, '').replace(/\/+$/, '')
/** Minus the nodes this app controls, the nodes this node is paired with, and those already found on the private network. */
const shown = computed(() => network.localFound.filter((node) => !network.localShownIds.has(node.nodeId)
  && !nodeStore.nodes.some((entry) => entry.nodeId === node.nodeId)
  && !list.rows.some((row) => row.nodeId === node.nodeId || [row.windowAddress, row.peer?.baseUrl].some((u) => u && hostPort(u) === node.address))))

const looking = ref(false)
const lookAgain = async (): Promise<void> => { looking.value = true; await new Promise((done) => setTimeout(done, 900)); looking.value = false }

const controlOpen = ref<string | null>(null)
const controlCode = ref('')
const controlError = ref('')
const controlStep = ref('')
const controlBusy = ref(false)
const adder = useAddWithAccessCode()
const openControl = (node: LocalNode): void => { controlOpen.value = node.nodeId; controlCode.value = ''; controlError.value = '' }
const closeControl = (): void => { controlOpen.value = null; controlCode.value = ''; controlError.value = '' }
async function control(node: LocalNode): Promise<void> {
  if (controlBusy.value) return
  controlBusy.value = true
  controlError.value = ''
  try {
    const result = await adder.add(controlCode.value, { expectNodeId: node.nodeId, expectName: node.name, onStep: (step) => { controlStep.value = step } })
    if (!result.ok) { controlError.value = result.field === 'duplicate' ? t('settings.components.settings.NodesPage.add.duplicate', { name: result.existing }) : result.message; return }
    network.localFound = network.localFound.filter((n) => n.nodeId !== node.nodeId)
    closeControl()
  } finally {
    controlStep.value = ''
    controlBusy.value = false
  }
}
</script>
