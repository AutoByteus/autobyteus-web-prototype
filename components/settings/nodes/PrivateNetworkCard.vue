<template>
  <!-- Not set up on this window's node: one line that says what it is and where to set it up. -->
  <section
    v-if="!ready"
    class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    data-testid="private-network-card-setup"
  >
    <div class="flex min-w-0 items-start gap-3">
      <span class="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><PrivateNetworkIcon /></span>
      <div class="min-w-0">
        <h3 class="text-sm font-semibold leading-6 text-slate-900">{{ t(k('title')) }}</h3>
        <p class="text-sm leading-6 text-slate-500">{{ installed ? t(k('setup.notJoined')) : t(k('setup.lead')) }}</p>
      </div>
    </div>
    <NuxtLink
      to="/settings?section=extensions"
      class="inline-flex h-9 flex-shrink-0 items-center justify-center self-start rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:self-auto"
      data-testid="private-network-setup-link"
    >{{ installed ? t(k('setup.join')) : t(k('setup.action')) }}</NuxtLink>
  </section>

  <section v-else class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" data-testid="private-network-card">
    <div class="flex items-start justify-between gap-4 px-5 pb-4 pt-5">
      <div class="min-w-0">
        <h3 class="flex items-center gap-2 text-base font-semibold text-slate-900">
          {{ t(k('found.title')) }}
        </h3>
        <p class="mt-1 max-w-3xl text-sm text-slate-500">{{ t(k('found.lead'), { network: networkName, account: network.ownerAccount }) }}</p>
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

    <!-- This node's two switches -->
    <div class="divide-y divide-slate-100 border-t border-slate-100">
      <div class="flex items-start justify-between gap-6 px-5 py-4" data-testid="private-network-findable">
        <div class="min-w-0">
          <p id="pn-findable-label" class="text-sm font-medium text-slate-900">{{ t(k('findable.label')) }}</p>
          <p class="mt-0.5 max-w-2xl text-sm leading-6 text-slate-500">{{ t(k('findable.help')) }}</p>
        </div>
        <SwitchControl :on="network.discoverable" labelled-by="pn-findable-label" test-id="private-network-findable-switch" @toggle="network.setDiscoverable(!network.discoverable)" />
      </div>
      <div class="flex items-start justify-between gap-6 px-5 py-4" data-testid="private-network-trust">
        <div class="min-w-0">
          <p id="pn-trust-label" class="text-sm font-medium text-slate-900">{{ t(k('trust.label')) }}</p>
          <p class="mt-0.5 max-w-2xl text-sm leading-6 text-slate-500">{{ network.trustOwnMachines ? t(k('trust.helpOn'), { account: network.ownerAccount }) : t(k('trust.helpOff')) }}</p>
          <p v-if="network.trustOwnMachines" class="mt-2 flex max-w-2xl items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-5 text-amber-900" data-testid="private-network-trust-warning">
            <NodeNoticeIcon class="mt-0.5" tone="warn" />{{ t(k('trust.risk')) }}
          </p>
        </div>
        <SwitchControl :on="network.trustOwnMachines" labelled-by="pn-trust-label" test-id="private-network-trust-switch" @toggle="toggleTrust" />
      </div>
    </div>

    <!-- Incoming: someone asks to pair -->
    <div v-if="network.requests.length" class="border-t border-slate-100 px-5 py-4" data-testid="private-network-requests">
      <h4 class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t(k('requests.title')) }}</h4>
      <ul class="mt-2 space-y-2">
        <li v-for="request in network.requests" :key="request.nodeId" class="rounded-lg border border-blue-200 bg-blue-50/60 px-4 py-3" :data-testid="`private-network-request-${request.name}`">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0">
              <p class="text-sm font-semibold text-slate-900">{{ t(k('requests.wants'), { name: request.name }) }}</p>
              <p class="mt-0.5 text-xs text-slate-500">
                <span class="font-mono">{{ network.machineOf(request.machineId)?.address }}</span> · {{ addedBy(request.account) }}
              </p>
              <p class="mt-1.5 max-w-2xl text-sm leading-5 text-slate-600">{{ t(k('requests.teammate'), { account: who(request.account) }) }}</p>
            </div>
            <div class="flex flex-shrink-0 items-center gap-2">
              <template v-if="request.phase === 'allowing'">
                <span class="inline-flex items-center gap-2 text-sm text-slate-600" role="status"><span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 motion-reduce:animate-none" aria-hidden="true" />{{ t(k('found.pairing')) }}</span>
              </template>
              <template v-else>
                <button type="button" class="h-8 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :data-testid="`private-network-reject-${request.name}`" @click="network.reject(request.nodeId)">{{ t(k('requests.reject')) }}</button>
                <button type="button" class="h-8 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1" :data-testid="`private-network-allow-${request.name}`" @click="network.allow(request.nodeId)">{{ t(k('requests.allow')) }}</button>
              </template>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Found: AutoByteus nodes on the private network, not paired with this node yet -->
    <ul v-if="network.found.length" class="divide-y divide-slate-100 border-t border-slate-100" data-testid="private-network-found">
      <li v-for="node in network.found" :key="node.nodeId" class="px-5 py-3.5" :data-testid="`private-network-found-${node.name}`">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex min-w-0 items-start gap-3">
            <span class="mt-[7px] inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full" :class="machine(node)?.online ? 'bg-emerald-500' : 'bg-slate-300'" role="img" :aria-label="machine(node)?.online ? t(k('found.online')) : t(k('found.offline'))" />
            <div class="min-w-0">
              <p class="text-sm font-semibold leading-6 text-slate-900">{{ node.name }}</p>
              <p class="text-xs leading-4 text-slate-500"><span class="font-mono">{{ machine(node)?.address }}</span> · {{ addedBy(machine(node)?.account ?? '') }}</p>
              <p class="mt-1 text-xs font-medium" :class="KIND_CLASS[node.kind]">{{ kindLine(node) }}</p>
            </div>
          </div>
          <div class="flex flex-shrink-0 items-center gap-2 pl-5 sm:pl-0">
            <template v-if="node.phase === 'pairing'">
              <span class="inline-flex items-center gap-2 text-sm text-slate-600" role="status"><span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 motion-reduce:animate-none" aria-hidden="true" />{{ t(k('found.pairing')) }}</span>
            </template>
            <template v-else-if="node.phase === 'refused'">
              <span class="text-sm text-slate-600" role="status" :data-testid="`private-network-declined-${node.name}`">{{ machine(node)?.account === network.ownerAccount ? t(k('found.ownerDeclined')) : t(k('found.declined'), { account: who(machine(node)?.account ?? '') }) }}</span>
              <button type="button" class="h-8 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="network.connect(node.nodeId)">{{ t(k('found.connectAgain')) }}</button>
            </template>
            <template v-else-if="node.phase === 'waiting'">
              <span class="text-sm text-slate-600" role="status">{{ t(k('found.waiting'), { account: machine(node)?.account === network.ownerAccount ? t(k('found.itsOwner')) : who(machine(node)?.account ?? '') }) }}</span>
              <button type="button" class="rounded px-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :data-testid="`private-network-cancel-${node.name}`" @click="network.cancelConnect(node.nodeId)">{{ t(k('found.cancel')) }}</button>
            </template>
            <button
              v-else-if="node.kind === 'own'"
              type="button"
              class="h-8 rounded-md bg-blue-600 px-3.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:opacity-60"
              :disabled="!machine(node)?.online"
              :data-testid="`private-network-pair-${node.name}`"
              @click="network.pair(node.nodeId)"
            >{{ t(k('found.pair')) }}</button>
            <button
              v-else
              type="button"
              class="h-8 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60"
              :disabled="!machine(node)?.online"
              :data-testid="`private-network-connect-${node.name}`"
              @click="network.connect(node.nodeId)"
            >{{ t(k('found.connect')) }}</button>
          </div>
        </div>
        <p v-if="node.kind === 'unknown'" class="ml-5 mt-2 flex max-w-3xl items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-5 text-amber-900" :data-testid="`private-network-unknown-${node.name}`">
          <NodeNoticeIcon class="mt-0.5" tone="warn" />{{ t(k('found.unknownWarning')) }}
        </p>
        <p v-if="node.phase === 'pairing'" class="ml-5 mt-1.5 text-xs text-slate-500">{{ t(k('found.pairingNote'), { name: node.name }) }}</p>
      </li>
    </ul>
    <p v-else-if="!network.requests.length" class="border-t border-slate-100 px-5 py-6 text-center text-sm text-slate-500" data-testid="private-network-found-empty">{{ t(k('found.empty')) }}</p>
  </section>

  <!-- Turning automatic trust on is a security decision: say what it allows. -->
  <Teleport to="body">
    <div v-if="confirmTrust" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="confirmTrust = false" @keydown.esc="confirmTrust = false">
      <div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl" role="alertdialog" aria-modal="true" aria-labelledby="pn-trust-title" aria-describedby="pn-trust-text" data-testid="private-network-trust-dialog">
        <h3 id="pn-trust-title" class="text-lg font-semibold text-gray-900">{{ t(k('trust.confirmTitle')) }}</h3>
        <p id="pn-trust-text" class="mt-2 text-sm leading-6 text-gray-600">{{ t(k('trust.confirmText'), { account: network.ownerAccount }) }}</p>
        <p class="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-5 text-amber-900"><NodeNoticeIcon class="mt-0.5" tone="warn" />{{ t(k('trust.risk')) }}</p>
        <div class="mt-6 flex justify-end gap-2">
          <button ref="trustCancel" type="button" class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="confirmTrust = false">{{ t(k('trust.cancel')) }}</button>
          <button type="button" class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" data-testid="private-network-trust-confirm" @click="trustOn">{{ t(k('trust.confirm')) }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, onMounted, ref } from 'vue'
import NodeNoticeIcon from '~/components/settings/nodes/NodeNoticeIcon.vue'
import { useLocalization } from '~/composables/useLocalization'
import { useExtensionsStore } from '~/stores/extensionsStore'
import { usePrivateNetworkStore, type FoundNode } from '~/stores/privateNetworkStore'

/**
 * extensions-ui-516 (design, Part B): Manage Nodes → "Found on your private network" (pairing-contract.md §3–§7).
 * Finding grants nothing: your own node pairs with one click, someone else's node with Connect and its owner's Allow,
 * an unknown machine on your own account is flagged and never paired by one click.
 */
const { t } = useLocalization()
const k = (key: string) => `nodes.privateNetwork.${key}`
const network = usePrivateNetworkStore()
const extensions = useExtensionsStore()
const confirmTrust = ref(false)
const trustCancel = ref<HTMLButtonElement | null>(null)
const checking = ref(false)

const state = computed(() => extensions.list.find((item) => item.entry.id === 'private-network')?.state ?? null)
const installed = computed(() => state.value?.kind === 'installed')
const ready = computed(() => state.value?.kind === 'installed' && state.value.enabled && network.joined)
const networkName = computed(() => (network.network === 'headscale' ? 'Headscale' : 'Tailscale'))
const machine = (node: FoundNode) => network.machineOf(node.machineId)
const addedBy = (account: string) => (account === network.ownerAccount ? t(k('found.addedByYou')) : t(k('found.addedBy'), { account: network.accountLabel(account) }))
const who = (account: string) => (network.accountLabel(account) === 'you' ? t(k('found.you')) : network.accountLabel(account))
const KIND_CLASS: Record<FoundNode['kind'], string> = { own: 'text-emerald-700', teammate: 'text-slate-600', unknown: 'text-amber-700' }
const kindLine = (node: FoundNode) => node.kind === 'own' ? t(k('found.kindOwn'))
  : node.kind === 'teammate' ? t(k('found.kindTeammate'), { account: who(machine(node)?.account ?? '') })
    : t(k('found.kindUnknown'))

async function checkAgain(): Promise<void> {
  checking.value = true
  await new Promise((done) => setTimeout(done, 900))
  checking.value = false
}
async function toggleTrust(): Promise<void> {
  if (network.trustOwnMachines) { network.setTrust(false); return }
  confirmTrust.value = true
  await nextTick()
  trustCancel.value?.focus()
}
/**
 * "Trust machines I added" acts on this node as the receiving side (pairing-contract §4 row 2): machines of the owner's
 * account that ask to pair are paired without asking. Nodes found here still need Pair from this side.
 */
function trustOn(): void {
  confirmTrust.value = false
  network.setTrust(true)
}

onMounted(() => { void extensions.initialize() })

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
