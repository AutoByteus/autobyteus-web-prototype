<template>
  <!-- extensions-ui-516 (design, founder 2026-11-26): the private network's parts of Manage Nodes, each in its own section.
       part="thisNode": this node's two switches (inside This node), or why the network is not ready;
       part="requests": Asking to pair; part="found": Found on your private network (Control or Pair). -->
  <template v-if="part === 'thisNode'">
    <div v-if="mode !== 'found'" class="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between" :data-testid="`private-network-card-${mode}`">
      <div class="flex min-w-0 items-start gap-3">
        <span class="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg" :class="mode === 'notReady' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'"><PrivateNetworkIcon /></span>
        <div class="min-w-0">
          <h4 class="text-sm font-semibold leading-6 text-slate-900">{{ t(k('title')) }}</h4>
          <p class="max-w-3xl text-sm leading-6" :class="mode === 'notReady' ? 'text-amber-900' : 'text-slate-500'" :lang="mode === 'notReady' ? 'en' : undefined">{{ setupText }}</p>
        </div>
      </div>
      <NuxtLink
        to="/settings?section=extensions"
        class="inline-flex h-9 flex-shrink-0 items-center justify-center self-start rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:self-auto"
        data-testid="private-network-setup-link"
      >{{ setupAction }}</NuxtLink>
    </div>
    <div v-else class="border-t border-slate-100" data-testid="private-network-card">
      <div class="px-5 pb-1 pt-4">
        <h4 class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t(k('title')) }}</h4>
        <p class="mt-0.5 text-sm text-slate-500">{{ t('nodes.sections.networkLine', { network: network.networkLabel }) }}</p>
      </div>
      <!-- Label and switch share a line; the explanation runs the card's width below (narrow windows too). -->
      <div class="px-5 pb-4 pt-3" data-testid="private-network-findable">
        <div class="flex items-center justify-between gap-4">
          <p id="pn-findable-label" class="min-w-0 text-sm font-medium text-slate-900">{{ t(k('findable.label')) }}</p>
          <SwitchControl :on="network.discoverable" labelled-by="pn-findable-label" test-id="private-network-findable-switch" @toggle="network.setDiscoverable(!network.discoverable)" />
        </div>
        <p class="mt-0.5 max-w-2xl text-sm leading-6 text-slate-500">{{ t(k('findable.help')) }}</p>
      </div>
    </div>
  </template>

  <!-- Asking to pair: only while someone asks -->
  <section v-else-if="part === 'requests' && shownRequests.length" class="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm" data-testid="private-network-requests">
    <div class="px-5 pb-3 pt-5">
      <h3 class="text-base font-semibold text-slate-900">{{ t(k('requests.title')) }}</h3>
      <p class="mt-1 max-w-3xl text-sm text-slate-500">{{ t('nodes.sections.requestsLead') }}</p>
    </div>
    <ul class="divide-y divide-slate-100 border-t border-slate-100">
      <li v-for="request in shownRequests" :key="request.nodeId" class="bg-blue-50/40 px-5 py-3.5" :data-testid="`private-network-request-${request.name}`">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="min-w-0">
            <!-- private-network-661 (D-5, REQ-008): by plain address the request names the address it gave; no account is known -->
            <p v-if="request.address" class="text-sm font-semibold text-slate-900">{{ t(k('requests.wantsAddress'), { name: request.name, address: request.address }) }}</p>
            <template v-else>
              <p class="text-sm font-semibold text-slate-900">{{ t(k('requests.wants'), { name: request.name, account: who(request.account ?? '') }) }}</p>
              <p class="mt-0.5 text-xs text-slate-500"><span class="font-mono">{{ network.machineOf(request.machineId)?.address }}</span></p>
            </template>
            <p class="mt-1.5 max-w-2xl text-sm leading-5 text-slate-600">{{ request.account ? t(k('requests.teammate'), { account: who(request.account) }) : t(k('requests.teammateAddress')) }}</p>
          </div>
          <div class="flex flex-shrink-0 items-center gap-2">
            <span v-if="request.phase === 'allowing'" class="inline-flex items-center gap-2 text-sm text-slate-600" role="status"><span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 motion-reduce:animate-none" aria-hidden="true" />{{ t(k('found.pairing')) }}</span>
            <template v-else>
              <button type="button" class="h-8 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :data-testid="`private-network-reject-${request.name}`" @click="network.reject(request.nodeId)">{{ t(k('requests.reject')) }}</button>
              <button type="button" class="h-8 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1" :data-testid="`private-network-accept-${request.name}`" @click="network.allow(request.nodeId)">{{ t(k('requests.accept')) }}</button>
            </template>
          </div>
        </div>
      </li>
    </ul>
  </section>

  <!-- Found on your private network: nodes in neither "Controlled nodes" nor "Paired nodes" -->
  <section v-else-if="part === 'found' && mode === 'found'" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" data-testid="private-network-found-card">
    <div class="flex items-start justify-between gap-4 px-5 pb-4 pt-5">
      <div class="min-w-0">
        <h3 class="text-base font-semibold text-slate-900">{{ t(k('found.title')) }}</h3>
        <p class="mt-1 max-w-3xl text-sm text-slate-500">{{ t('nodes.sections.foundLead', { network: network.networkLabel }) }}</p>
      </div>
      <button
        type="button"
        class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        :title="t(k('found.checkAgain'))"
        :aria-label="t(k('found.checkAgain'))"
        data-testid="private-network-check-again"
        @click="checkAgain"
      >
        <svg class="h-[18px] w-[18px]" :class="checking ? 'animate-spin motion-reduce:animate-none' : ''" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M16 10a6 6 0 1 1-1.76-4.24M16 4v3.5h-3.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </div>
    <ul v-if="shown.length" class="divide-y divide-slate-100 border-t border-slate-100" data-testid="private-network-found">
      <li v-for="node in shown" :key="node.nodeId" class="px-5 py-3.5" :data-testid="`private-network-found-${node.name}`">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex min-w-0 items-start gap-3">
            <span class="mt-[7px] inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full" :class="machine(node)?.online ? 'bg-emerald-500' : 'bg-slate-300'" role="img" :aria-label="machine(node)?.online ? t(k('found.online')) : t(k('found.offline'))" />
            <div class="min-w-0">
              <p class="text-sm font-semibold leading-6 text-slate-900">{{ node.name }}</p>
              <p class="text-xs leading-4 text-slate-500"><span class="font-mono">{{ machine(node)?.address }}</span> · {{ addedBy(node) }}</p>
              <p class="mt-1 text-xs font-medium" :class="KIND_CLASS[kindOf(node)]">{{ kindLine(node) }}</p>
            </div>
          </div>
          <div class="flex flex-shrink-0 items-center gap-2 pl-5 sm:pl-0">
            <template v-if="node.phase === 'refused'">
              <span class="text-sm text-slate-600" role="status" :data-testid="`private-network-declined-${node.name}`">{{ owner(node) ? t(k('found.declined'), { account: owner(node) }) : t(k('found.declinedUnknown')) }}</span>
              <button type="button" class="h-8 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="network.connect(node.nodeId)">{{ t(k('found.pairAgain')) }}</button>
            </template>
            <template v-else-if="node.phase === 'waiting'">
              <span class="text-sm text-slate-600" role="status">{{ owner(node) ? t(k('found.waiting'), { account: owner(node) }) : t(k('found.waitingUnknown')) }}</span>
              <button type="button" class="rounded px-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :data-testid="`private-network-cancel-${node.name}`" @click="network.cancelConnect(node.nodeId)">{{ t(k('found.cancel')) }}</button>
            </template>
            <!-- someone else's node: Pair sends a request; its owner accepts -->
            <button
              v-else-if="kindOf(node) === 'teammate'"
              type="button"
              class="h-8 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60"
              :disabled="!machine(node)?.online"
              :data-testid="`private-network-pair-${node.name}`"
              @click="network.connect(node.nodeId)"
            >{{ t(k('found.pair')) }}</button>
            <!-- a machine your account added: Control with its access code; it pairs from "Controlled nodes" afterwards -->
            <button
              v-else-if="controlOpen !== node.nodeId"
              type="button"
              class="h-8 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60"
              :disabled="!machine(node)?.online"
              :data-testid="`private-network-control-${node.name}`"
              @click="openControl(node)"
            >{{ t('nodes.sections.control') }}</button>
          </div>
        </div>
        <p v-if="kindOf(node) === 'unknown'" class="ml-5 mt-2 flex max-w-3xl items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-5 text-amber-900" :data-testid="`private-network-unknown-${node.name}`">
          <NodeNoticeIcon class="mt-0.5" tone="warn" />{{ t('nodes.sections.unknownWarning') }}
        </p>
        <!-- Control: the node's access code, inline -->
        <form v-if="controlOpen === node.nodeId" class="ml-5 mt-2 max-w-3xl" :data-testid="`private-network-control-form-${node.name}`" @submit.prevent="control(node)">
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
              :data-testid="`private-network-control-code-${node.name}`"
            >
            <button type="submit" class="h-9 rounded-md bg-blue-600 px-3.5 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:opacity-50" :disabled="controlBusy || !controlCode.trim() || controlNeedsJoin" :data-testid="`private-network-control-add-${node.name}`">{{ t('nodes.sections.controlAdd') }}</button>
            <button type="button" class="rounded px-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :disabled="controlBusy" @click="closeControl">{{ t(k('found.cancel')) }}</button>
          </div>
          <NodeJoinFirstNotice v-if="controlNeedsJoin && !controlError && controlRead" inline class="mt-1.5" :address="controlRead.address" />
          <p v-if="controlError" class="mt-1.5 text-sm text-red-600" role="alert" :data-testid="`private-network-control-error-${node.name}`">{{ controlError }}</p>
          <p v-else-if="controlStep" class="mt-1.5 flex items-center gap-2 text-sm text-slate-600" role="status"><span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 motion-reduce:animate-none" aria-hidden="true" />{{ controlStep }}</p>
          <p v-else-if="!controlNeedsJoin" class="mt-1.5 text-xs leading-5 text-slate-500">{{ t('nodes.sections.controlHint', { name: node.name }) }}</p>
          <!-- Design reference only: what access-code prints on that machine, so the flow can be tried here. -->
          <button type="button" class="mt-1.5 rounded border border-dashed border-slate-300 px-2 py-0.5 text-xs text-slate-500 hover:text-slate-800" :data-testid="`private-network-control-sample-${node.name}`" @click="sampleCode(node)">{{ t('nodes.sections.controlSample', { name: node.name }) }}</button>
        </form>
      </li>
    </ul>
    <p v-else class="border-t border-slate-100 px-5 py-6 text-center text-sm text-slate-500" data-testid="private-network-found-empty">{{ t(k('found.empty')) }}</p>
  </section>

</template>

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, onMounted, ref } from 'vue'
import NodeNoticeIcon from '~/components/settings/nodes/NodeNoticeIcon.vue'
import { useLocalization } from '~/composables/useLocalization'
import { useExtensionsStore } from '~/stores/extensionsStore'
import { useNodeStore } from '~/stores/nodeStore'
import { usePrivateNetworkStore, type FoundNode } from '~/stores/privateNetworkStore'
import { useNodeListStore } from '~/stores/nodeListStore'
import { makeNodeCode, readNodeCode } from '~/prototype/nodes/nodeCode'
import NodeJoinFirstNotice from '~/components/settings/nodes/NodeJoinFirstNotice.vue'
import { useAddWithAccessCode } from '~/prototype/nodes/addWithAccessCode'

/**
 * extensions-ui-516 (design, Part B): Manage Nodes → "Found on your private network" (pairing-contract.md §3–§7).
 * Finding grants nothing: your own node pairs with one click, someone else's node with Pair and its owner's Accept,
 * an unknown machine on your own account is flagged and never paired by one click.
 */
const props = defineProps<{ part: 'thisNode' | 'requests' | 'found' }>()
const { t } = useLocalization()
const k = (key: string) => `nodes.privateNetwork.${key}`
const network = usePrivateNetworkStore()
const extensions = useExtensionsStore()
const checking = ref(false)

const state = computed(() => extensions.list.find((item) => item.entry.id === 'private-network')?.state ?? null)
const installed = computed(() => state.value?.kind === 'installed')
/**
 * What this node's private network allows (private-network-661: Tailscale only): `found` on the joined tailnet; `notReady`
 * while Tailscale holds it (approval, sign-in expired, signed out, unreachable, rejoining, not joined); `setup` when not
 * installed or off.
 */
const mode = computed<'setup' | 'notReady' | 'found'>(() => {
  const s = state.value
  if (!s || s.kind !== 'installed' || !s.enabled) return 'setup'
  if (network.ready && s.ready) return 'found'
  return 'notReady'
})
/** Requests over the private network need it ready; a request by plain address (D-5) arrives without it. */
const shownRequests = computed(() => network.requests.filter((r) => r.address || mode.value === 'found'))
const setupText = computed(() => {
  if (mode.value === 'notReady') return state.value?.kind === 'installed' ? network.status.message : ''
  return installed.value ? t(k('setup.off')) : t(k('setup.lead'))
})
const setupAction = computed(() => (mode.value === 'setup' && !installed.value ? t(k('setup.action')) : t(k('setup.open'))))
const machine = (node: FoundNode) => network.machineOf(node.machineId)
/** "added by …"; a machine shared from another tailnet: "shared by …", or "shared with you" when Tailscale does not say by whom (REQ-016). */
const addedBy = (node: FoundNode) => {
  const m = machine(node)
  if (m?.shared) return m.account ? t(k('found.sharedBy'), { account: m.account }) : t(k('found.sharedUnknown'))
  return m?.account === network.ownerAccount ? t(k('found.addedByYou')) : t(k('found.addedBy'), { account: network.accountLabel(m?.account ?? '') })
}
/** Whose node it is, as far as the network says: "bob", "dana@other.example", or nobody known. */
const owner = (node: FoundNode) => who(machine(node)?.account ?? '')
const who = (account: string) => (network.accountLabel(account) === 'you' ? t(k('found.you')) : network.accountLabel(account))
const KIND_CLASS: Record<'teammate' | 'unknown', string> = { teammate: 'text-slate-600', unknown: 'text-amber-700' }
/** Found lists only nodes outside this app's Nodes list (pairing-contract §4); a node on your account that this app does not control is an unknown machine. */
const nodeStore = useNodeStore()
/** Found lists nodes in neither "Controlled nodes" (a desktop entry) nor "Paired nodes" (a peer of this node). */
const list = useNodeListStore()
const shown = computed(() => network.found.filter((node) => !nodeStore.nodes.some((entry) => entry.nodeId === node.nodeId)
  && !list.rows.some((row) => row.nodeId === node.nodeId)))
const kindOf = (node: FoundNode): 'teammate' | 'unknown' => (node.kind === 'teammate' ? 'teammate' : 'unknown')
const kindLine = (node: FoundNode) => kindOf(node) === 'teammate' ? (owner(node) ? t(k('found.kindTeammate'), { account: owner(node) }) : t(k('found.kindTeammateUnknown')))
  : t(k('found.kindUnknown'))

async function checkAgain(): Promise<void> {
  checking.value = true
  await new Promise((done) => setTimeout(done, 900))
  checking.value = false
}

onMounted(() => { void extensions.initialize(); if (props.part === 'thisNode') network.touch() })

// ---- Control: a machine your own account added, made a node this AutoByteus controls with its access code (pairing-contract §6)
const controlOpen = ref<string | null>(null)
const controlCode = ref('')
const controlError = ref('')
const controlStep = ref('')
const controlBusy = ref(false)
const adder = useAddWithAccessCode()
const controlRead = computed(() => (controlCode.value.trim() ? readNodeCode(controlCode.value) : null))
/** private-network-661 (REQ-010): a found node's code carries its private address; this computer's node must be on the network. */
const controlNeedsJoin = computed(() => network.needsJoinFor(controlRead.value?.address))
const openControl = (node: FoundNode): void => { controlOpen.value = node.nodeId; controlCode.value = ''; controlError.value = '' }
const closeControl = (): void => { controlOpen.value = null; controlCode.value = ''; controlError.value = '' }
/** Design only: the code `autobyteus-docker access-code` would print on that machine. */
const sampleCode = (node: FoundNode): void => { controlCode.value = makeNodeCode(node.nodeId, `${machine(node)?.address ?? '100.88.99.99'}:29695`).text; controlError.value = '' }
async function control(node: FoundNode): Promise<void> {
  if (controlBusy.value) return
  controlBusy.value = true
  controlError.value = ''
  try {
    const result = await adder.add(controlCode.value, { expectNodeId: node.nodeId, expectName: node.name, onStep: (step) => { controlStep.value = step } })
    if (!result.ok) { controlError.value = result.field === 'duplicate' ? t('settings.components.settings.NodesPage.add.duplicate', { name: result.existing }) : result.message; return }
    closeControl()
  } finally {
    controlStep.value = ''
    controlBusy.value = false
  }
}

const PrivateNetworkIcon = defineComponent({
  render: () => h('svg', { class: 'h-5 w-5', viewBox: '0 0 20 20', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6', 'aria-hidden': 'true' }, [
    h('circle', { cx: '10', cy: '4.5', r: '2' }), h('circle', { cx: '4.5', cy: '15', r: '2' }), h('circle', { cx: '15.5', cy: '15', r: '2' }),
    h('path', { d: 'M9 6.3 5.5 13.2M11 6.3l3.5 6.9M6.5 15h7', 'stroke-linecap': 'round' }),
  ]),
})
const SwitchControl = defineComponent({
  props: { on: Boolean, labelledBy: String, testId: String },
  emits: ['toggle'],
  setup(props, { emit }) {
    return () => h('div', { class: 'inline-flex flex-shrink-0 items-center gap-3 pt-0.5' }, [
      h('span', { class: ['text-sm font-medium', props.on ? 'text-emerald-700' : 'text-slate-500'], 'aria-hidden': 'true' }, props.on ? t(k('on')) : t(k('off'))),
      h('button', {
        type: 'button', role: 'switch', 'aria-checked': props.on, 'aria-labelledby': props.labelledBy, 'data-testid': props.testId,
        class: ['relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1', props.on ? 'bg-emerald-500' : 'bg-slate-300'],
        onClick: () => emit('toggle'),
      }, [h('span', { 'aria-hidden': 'true', class: ['inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none', props.on ? 'translate-x-5' : 'translate-x-0.5'] })]),
    ])
  },
})
</script>
