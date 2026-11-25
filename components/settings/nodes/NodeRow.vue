<template>
  <li class="nr transition-colors duration-700" :class="store.flashKey === row.key ? 'bg-blue-50/70' : 'hover:bg-slate-50/60'" :data-testid="`node-row-${row.key}`">
    <div class="nr-grid px-5 py-3.5">
      <!-- who: status dot, name (click to rename), address -->
      <div class="nr-name flex min-w-0 items-start gap-3">
        <span class="mt-[5px] inline-flex h-3 w-3 flex-shrink-0 items-center justify-center" role="img" :aria-label="dotLabel" :title="dotLabel" :data-testid="`node-dot-${row.key}`">
          <span v-if="view.checking" class="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500" />
          <span v-else class="inline-block h-2.5 w-2.5 rounded-full" :class="dotClass" />
        </span>
        <div class="min-w-0 flex-1">
          <template v-if="renaming">
            <input
              ref="renameInput"
              v-model="renameDraft"
              type="text"
              class="h-7 w-full max-w-xs rounded-md border border-blue-400 bg-white px-2 text-sm font-semibold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              :aria-label="t(k('rename.label'), { name: row.name })"
              :aria-invalid="Boolean(renameError)"
              :data-testid="`node-rename-input-${row.key}`"
              @keydown.enter.prevent="saveRename"
              @keydown.esc.prevent="cancelRename"
              @blur="saveRename"
            >
            <p v-if="renameError" class="mt-1 text-sm text-red-600" role="alert" :data-testid="`node-rename-error-${row.key}`">{{ renameError }}</p>
          </template>
          <template v-else>
            <button
              v-if="!row.isEmbedded"
              type="button"
              class="group -mx-1.5 inline-flex max-w-full items-center gap-1.5 rounded-md px-1.5 text-left text-sm font-semibold leading-6 text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :title="t(k('row.rename'))"
              :aria-label="`${t(k('row.rename'))}: ${row.name}`"
              :data-testid="`node-name-${row.key}`"
              @click="startRename"
            >
              <span class="truncate">{{ row.name }}</span>
              <svg class="h-3.5 w-3.5 flex-shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m13.5 4.5 2 2M4 16l.7-3.1L13.8 3.8a1.4 1.4 0 0 1 2 0l.4.4a1.4 1.4 0 0 1 0 2l-9.1 9.1L4 16Z" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
            <p v-else class="truncate text-sm font-semibold leading-6 text-slate-900" :data-testid="`node-name-${row.key}`">{{ row.name }}</p>
            <p class="break-all font-mono text-xs leading-4 text-slate-500" :data-testid="`node-url-${row.key}`">{{ shownUrl }}</p>
          </template>
        </div>
      </div>

      <!-- extensions-ui-516 (design, pairing-contract §9): Paired is the only collaboration state; how it was paired, whose it is, Unpair -->
      <div v-if="paired" class="nr-paired text-xs leading-4 text-slate-500" :data-testid="`node-paired-${row.key}`">
        <p class="flex flex-wrap items-center gap-1.5">
          <span class="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 font-medium text-emerald-700" :data-testid="`node-paired-mark-${row.key}`"><RemoteCollaborationIcon size-class="h-3.5 w-3.5" />{{ t('nodes.privateNetwork.paired') }}</span>
          <span v-if="privateMark" class="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600" :data-testid="`node-private-${row.key}`">{{ t('nodes.privateNetwork.rowTag') }}</span>
          <button v-if="!unpairAsk && !unpairing" type="button" class="rounded px-1 font-medium text-slate-600 underline-offset-2 hover:text-red-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" :data-testid="`node-unpair-${row.key}`" @click="askUnpair">{{ t('nodes.privateNetwork.unpair') }}</button>
          <span v-if="unpairing" class="inline-flex items-center gap-1.5" role="status"><span class="h-3 w-3 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500 motion-reduce:animate-none" aria-hidden="true" />{{ t('nodes.privateNetwork.unpairing') }}</span>
        </p>
        <p class="mt-1">{{ privateMark?.role === 'teammate' ? t('nodes.privateNetwork.rowTeammate', { account: privateNetwork.accountLabel(privateMark.account) }) : t('nodes.privateNetwork.pairedLine') }}</p>
      </div>

      <!-- server: version and in-place update (remote nodes) -->
      <div class="nr-server min-w-0">
        <NodeServerUpdate v-if="serverAsked" :row="row" part="cell" />
      </div>

      <!-- offer: what the node shares; opens the list and the connection details -->
      <div class="nr-offer min-w-0">
        <RemoteCollaborationOfferToggle
          v-if="showDetails"
          v-model:open="expanded"
          :entries="view.offers ?? []"
          :label="summaryLabel"
          :test-id="`node-offer-${row.key}`"
        />
      </div>

      <!-- pairing (pairing-contract §9): Pair on a node that is not paired; a paired node shows its mark under the name -->
      <div class="nr-collab"><span v-if="!paired && pairingHere" class="inline-flex h-8 items-center gap-2 text-sm text-slate-600" role="status" :data-testid="`node-pairing-${row.key}`"><span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 motion-reduce:animate-none" aria-hidden="true" />{{ t('nodes.privateNetwork.found.pairing') }}</span><button
        v-else-if="!paired && row.nodeId"
        type="button"
        class="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        :title="switchDisabled && !view.checking ? t(k('row.unreachableSwitch'), { name: row.name }) : t('nodes.privateNetwork.pairedLine')"
        :aria-label="t('nodes.privateNetwork.pairRowLabel', { name: row.name })"
        :disabled="switchDisabled"
        :data-testid="`node-pair-${row.key}`"
        @click="pairRow"
      ><RemoteCollaborationIcon size-class="h-4 w-4 text-slate-500" />{{ t('nodes.privateNetwork.pairRow') }}</button></div>

      <!-- actions: Open and Remove, in fixed slots so the rows line up -->
      <div class="nr-actions flex items-center justify-end gap-1">
        <button
          v-if="store.canOpen(row.key) && privateMark?.role !== 'teammate'"
          type="button"
          class="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :title="t(k('row.openNode'), { name: row.name })"
          :aria-label="t(k('row.openNode'), { name: row.name })"
          :data-testid="`node-open-${row.key}`"
          @click="store.openNode(row.key)"
        >
          <svg class="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M11 3.5h5.5V9M16.2 3.8 9.5 10.5M8 4.5H5.5A2 2 0 0 0 3.5 6.5v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V12" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <span v-else-if="store.hasOpen" class="inline-block h-8 w-8" aria-hidden="true" />
        <button
          v-if="!row.isEmbedded && privateMark?.role !== 'teammate'"
          type="button"
          class="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          :title="t(k('row.removeNode'), { name: row.name })"
          :aria-label="t(k('row.removeNode'), { name: row.name })"
          :data-testid="`node-remove-${row.key}`"
          @click="dialog.request('remove', row.key)"
        >
          <svg class="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6m1.5 0-.6 9a1.5 1.5 0 0 1-1.5 1.4H8.6A1.5 1.5 0 0 1 7.1 15L6.5 6" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <span v-else class="inline-block h-8 w-8" aria-hidden="true" />
      </div>
    </div>

    <!-- extensions-ui-516 (design): Unpair confirmation, below the row like its notices -->
    <div v-if="unpairAsk && paired" class="mx-5 mb-3.5 -mt-0.5 flex max-w-2xl sm:ml-[2.75rem] flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-700" role="alertdialog" :aria-label="t('nodes.privateNetwork.unpair')" :data-testid="`node-unpair-confirm-${row.key}`">
      <span class="min-w-0 flex-1 basis-56">{{ privateMark?.role === 'teammate' ? t('nodes.privateNetwork.unpairTeammate', { name: row.name, account: privateNetwork.accountLabel(privateMark.account) }) : t('nodes.privateNetwork.unpairOwn', { name: row.name }) }}</span>
      <button type="button" class="h-7 rounded-md bg-red-600 px-2.5 font-medium text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" :data-testid="`node-unpair-yes-${row.key}`" @click="unpair">{{ t('nodes.privateNetwork.unpair') }}</button>
      <button type="button" class="h-7 rounded-md border border-slate-300 bg-white px-2.5 font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="unpairAsk = false">{{ t('nodes.privateNetwork.cancel') }}</button>
    </div>
    <!-- notices: one shape for the checking line, the fixing line and the server notice -->
    <div v-if="view.checking || view.line || serverAsked || needsConnecting" class="space-y-2 px-5 pb-3.5 -mt-0.5 empty:hidden sm:pl-[2.75rem]" aria-live="polite">
      <NodeAccessNotice v-if="needsConnecting" :row="row" />
      <p v-if="view.checking" class="text-sm leading-5 text-slate-500" :data-testid="`node-line-${row.key}`">
        {{ t(k('row.checkingLine'), { name: row.name }) }}
      </p>
      <div v-else-if="view.line" class="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 rounded-lg border px-3 py-2 text-sm" :class="lineClass" :data-testid="`node-line-${row.key}`">
        <div class="flex min-w-0 flex-1 basis-56 items-start gap-2.5">
          <NodeNoticeIcon class="mt-0.5" :tone="lineTone" />
          <p class="min-w-0 flex-1 leading-5">
            <span v-if="lineHead" class="font-medium">{{ lineHead }}</span>
            {{ ' ' }}{{ lineText }}
          </p>
        </div>
        <button type="button" :class="lineButtonClass" :data-testid="`node-fix-${row.key}`" @click="runFix">{{ lineFixLabel }}</button>
      </div>
      <NodeServerUpdate v-if="serverAsked" :row="row" part="notice" />
    </div>

    <!-- details: the full offer list, then the connection details -->
    <div v-if="showDetails && expanded" class="px-5 pb-4 sm:pl-[2.75rem]" :data-testid="`node-details-${row.key}`">
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <RemoteCollaborationOfferList v-if="(view.offers ?? []).length" :entries="view.offers ?? []" :test-id="`node-offer-${row.key}-list`" />
        <div :class="(view.offers ?? []).length ? 'mt-4 border-t border-slate-100 pt-4' : ''">
          <NodeConnectionDetails ref="details" :row="row" @guide="emit('guide')" />
        </div>
      </div>
    </div>
  </li>
</template>

<style scoped>
/* One grid per row. Wide: who | server | offer | collaboration | actions. Medium: who | collaboration | actions, then server, then offer,
   under the name. Narrow: who | actions, then server, offer and collaboration. The widths are those of the Nodes card, not the window.
   Every cell below the first line spans all columns, including the 1fr one, so it never widens the auto columns: the capsules and
   the icons stay in line from row to row. The space between lines is each cell's own top margin, not a row gap, so an empty server or
   offer cell (a node never reached) leaves no gap behind. */
.nr-grid { display: grid; align-items: start; column-gap: 1rem;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas: 'name actions' 'paired paired' 'server server' 'offer offer' 'collab collab'; }
.nr-paired { grid-area: paired; padding-left: 1.5rem; margin-top: 0.375rem; }
.nr-name { grid-area: name; padding-top: 0.125rem; }
.nr-server { grid-area: server; padding-left: 1.5rem; padding-top: 0.125rem; margin-top: 0.5rem; }
.nr-offer { grid-area: offer; padding-left: 1.5rem; padding-top: 0.375rem; margin-top: 0.5rem; }
.nr-collab { grid-area: collab; justify-self: start; margin-left: 1.5rem; margin-top: 0.5rem; }
.nr-actions { grid-area: actions; min-width: 2rem; height: 2.25rem; }
.nr-server:empty, .nr-offer:empty, .nr-collab:empty { display: none; }
@container (min-width: 38rem) {
  .nr-collab { justify-self: end; margin-left: 0; margin-top: 0; }
  .nr-grid { grid-template-columns: minmax(0, 1fr) auto auto; grid-template-areas: 'name collab actions' 'paired paired paired' 'server server server' 'offer offer offer'; }
}
@container (min-width: 64rem) {
  .nr-grid { grid-template-columns: minmax(0, 1.3fr) 16rem minmax(0, 1fr) 6rem auto; grid-template-areas: 'name server offer collab actions' 'paired server offer collab actions';
    grid-template-rows: auto 1fr; }
  .nr-paired { align-self: start; }
  .nr-server { padding-left: 0; padding-top: 0.125rem; margin-top: 0; }
  .nr-offer { padding-left: 0; margin-top: 0; }
  .nr-server:empty, .nr-offer:empty, .nr-collab:empty { display: block; }
}
</style>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import NodeAccessNotice from '~/components/settings/nodes/NodeAccessNotice.vue'
import RemoteCollaborationIcon from '~/components/settings/nodes/RemoteCollaborationIcon.vue'
import NodeNoticeIcon from '~/components/settings/nodes/NodeNoticeIcon.vue'
import NodeConnectionDetails from '~/components/settings/nodes/NodeConnectionDetails.vue'
import NodeServerUpdate from '~/components/settings/nodes/NodeServerUpdate.vue'
import RemoteCollaborationOfferList from '~/components/settings/RemoteCollaborationOfferList.vue'
import RemoteCollaborationOfferToggle from '~/components/settings/RemoteCollaborationOfferToggle.vue'
import { useLocalization } from '~/composables/useLocalization'
import { useNodeAccessStore } from '~/stores/nodeAccessStore'
import { usePrivateNetworkStore } from '~/stores/privateNetworkStore'
import { useNodeChangeDialogStore } from '~/stores/nodeChangeDialogStore'
import { useNodeListStore } from '~/stores/nodeListStore'
import type { NodeRow } from '~/stores/nodeRowStatus'
import { causeText, failureText, NODES_PAGE_KEY } from '~/utils/nodeConnectionErrorText'

/** One node (UIS-002): dot, name (click to rename), address, Pair or the Paired mark with Unpair (pairing-contract §9), Open, Remove; its server version and
 * in-place update (remote nodes); one line; details. */
const props = defineProps<{ row: NodeRow }>()
const privateNetwork = usePrivateNetworkStore()
const privateMark = computed(() => privateNetwork.peerMark(props.row.nodeId))
const unpairAsk = ref(false)
const unpairing = ref(false)
/** Unpair: one confirmation below the row for every paired node; each side removes the other (over the private network with
 * a signed /unpaired, pairing-contract §2; for a pairing made by address the app does both sides). The steps are not shown. */
const askUnpair = (): void => { unpairAsk.value = true }
const unpair = async (): Promise<void> => {
  unpairAsk.value = false; unpairing.value = true
  try { if (privateMark.value) await privateNetwork.unpair(props.row.nodeId!); else await dialog.unpairDirect(props.row.key) } finally { unpairing.value = false }
}
/** Pair: a node of yours that the private network found pairs in one click (pairing-contract §3 case 1); another node by address, with the change dialog. */
const pairingHere = computed(() => privateNetwork.ownOnNetwork(props.row.nodeId)?.phase === 'pairing')
const pairRow = (): void => { if (privateNetwork.ownOnNetwork(props.row.nodeId)) void privateNetwork.pair(props.row.nodeId!); else dialog.request('connect', props.row.key) }
// The node's server version is an owner read: a node this desktop has no key for cannot answer it (autobyteus-437).
const serverAsked = computed(() => !props.row.isEmbedded && !needsConnecting.value)
const emit = defineEmits<{ guide: [] }>()

const { t } = useLocalization()
const k = (key: string): string => `${NODES_PAGE_KEY}${key}`
const store = useNodeListStore()
const dialog = useNodeChangeDialogStore()
const details = ref<InstanceType<typeof NodeConnectionDetails> | null>(null)

// ---- this desktop's credential for a remote node (autobyteus-437): Needs connecting, or Disconnect.
const access = useNodeAccessStore()
onMounted(() => { void access.initialize() })
const accessEntryId = computed(() => (props.row.isEmbedded ? null : props.row.entryIds[0] ?? null))
const needsConnecting = computed(() => Boolean(accessEntryId.value) && access.stateOf(accessEntryId.value!) === 'needs_connecting')
// extensions-ui-516 (design, founder 2026-11-25): no separate "disconnect" icon on the row; Unpair is the one control for ending a pairing.

const view = computed(() => store.views[props.row.key]!)
const collaborating = computed(() => Boolean(props.row.peer))
const paired = computed(() => collaborating.value || Boolean(privateMark.value))
const showDetails = computed(() => collaborating.value && !view.value.checking)
const expanded = computed({ get: () => Boolean(store.expanded[props.row.key]), set: (value: boolean) => { store.expanded[props.row.key] = value } })
const shownUrl = computed(() => (props.row.windowAddress ?? props.row.peer?.baseUrl ?? '').replace(/^https?:\/\//, ''))

const summaryLabel = computed(() => {
  if (view.value.offers === null) return t(k('detail.connection'))
  return view.value.offers.length ? undefined : t(k('detail.emptyOffer'), { name: props.row.name })
})

const dotClass = computed(() => view.value.different ? 'bg-red-500'
  : view.value.reachable === true ? 'bg-emerald-500'
    : view.value.reachable === false ? 'border-2 border-slate-400 bg-white' : 'bg-slate-300')
const dotLabel = computed(() => view.value.checking ? t(k('row.checking'))
  : view.value.reachable === true && !view.value.different ? t(k('row.reachable')) : t(k('row.notReachable')))

const switchDisabled = computed(() => !props.row.nodeId || view.value.checking || dialog.preparing === props.row.key
  // A node that does not answer cannot be set up; turning collaboration off stays possible.
  || (!collaborating.value && view.value.reachable !== true))

const lineTone = computed(() => view.value.line?.tone === 'error' ? 'error' : view.value.line?.tone === 'warn' ? 'warn' : 'info')
const lineClass = computed(() => lineTone.value === 'error' ? 'border-red-200 bg-red-50 text-red-900'
  : lineTone.value === 'warn' ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-700')
const lineButtonClass = computed(() => `h-7 flex-shrink-0 rounded-md border bg-white px-2.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
  lineTone.value === 'error' ? 'border-red-300 text-red-800 hover:bg-red-100'
    : lineTone.value === 'warn' ? 'border-amber-300 text-amber-900 hover:bg-amber-100' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`)

const lineHead = computed(() => {
  const line = view.value.line
  if (line?.kind === 'unreachable') return t(k('line.unreachableHead'))
  if (line?.kind === 'partial') return t(k('line.partialHead'), { name: props.row.name })
  return ''
})
const lineText = computed(() => {
  const line = view.value.line
  const name = props.row.name
  switch (line?.kind) {
    case 'unreachable': return causeText(t, line.cause, line.host ?? '')
    case 'partial': return line.error ? failureText(t, line.error, { node: name, name: line.stepName }) : ''
    case 'offThere': return t(k('line.offThere'), { name })
    case 'notRegisteredThere': return t(k('line.notRegisteredThere'), { name })
    case 'notPaired': return t(k('line.notPaired'), { name })
    case 'different': return t(k('line.different'))
    case 'notRegisteredHereInfo': return t(k('line.notRegisteredHere'), { name })
    case 'agentsOff': return t(k('line.agentsOff'), { name })
    default: return ''
  }
})
const FIX_LABEL = { turnOnThere: 'line.fixOffThere', pairAgain: 'line.fixPairAgain', changeAddress: 'line.fixChangeAddress',
  checkAgain: 'line.fixCheckAgain', tryAgain: 'line.fixTryAgain', turnOn: 'line.fixTurnOn' } as const
const lineFixLabel = computed(() => view.value.line ? t(k(FIX_LABEL[view.value.line.fix])) : '')

/** Every button that changes another node opens the confirmation first (REQ-706); Check again asks the row again. */
const runFix = async (): Promise<void> => {
  switch (view.value.line?.fix) {
    case 'turnOn': return dialog.request('connect', props.row.key)
    case 'turnOnThere': case 'pairAgain': case 'tryAgain': return dialog.request('finish', props.row.key)
    case 'checkAgain': return store.askAgain(props.row.key)
    case 'changeAddress':
      expanded.value = true
      await nextTick()
      details.value?.startAddress()
  }
}

// ---- rename: click the name, type, Enter or click away (Esc cancels)
const renaming = ref(false)
const renameDraft = ref('')
const renameError = ref('')
const renameInput = ref<HTMLInputElement | null>(null)
let renameSaving = false
const startRename = async (): Promise<void> => {
  renameDraft.value = props.row.name
  renameError.value = ''
  renaming.value = true
  await nextTick()
  renameInput.value?.focus()
  renameInput.value?.select()
}
const cancelRename = (): void => { renameSaving = true; renaming.value = false; renameError.value = ''; renameSaving = false }
const saveRename = async (): Promise<void> => {
  if (renameSaving || !renaming.value) return
  if (renameDraft.value.trim() === props.row.name) { renaming.value = false; renameError.value = ''; return }
  renameSaving = true
  const result = await store.renameNode(props.row.key, renameDraft.value)
  renameSaving = false
  if (result.ok) { renaming.value = false; renameError.value = ''; return }
  renameError.value = result.error === 'taken' ? t(k('rename.errorTaken'), { name: renameDraft.value.trim() })
    : result.failure && result.failure.code !== 'PEER_NAME_INVALID' ? failureText(t, result.failure, { node: props.row.name }) : t(k('rename.errorName'))
}
</script>
