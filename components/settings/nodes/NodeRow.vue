<template>
  <li
    class="transition-colors duration-700"
    :class="store.flashKey === row.key ? 'bg-blue-50/70' : ''"
    :data-testid="`node-row-${row.key}`"
  >
    <div class="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4">
      <div class="flex min-w-0 flex-1 basis-60 items-start gap-3">
        <button
          type="button"
          class="-ml-2 -mt-1.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :aria-expanded="expanded"
          :aria-label="expanded ? t(k('row.collapse'), { name: row.name }) : t(k('row.expand'), { name: row.name })"
          :data-testid="`node-expand-${row.key}`"
          @click="expanded = !expanded"
        >
          <svg class="h-4 w-4 transition-transform" :class="expanded ? 'rotate-90' : ''" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <span class="mt-1.5 inline-flex h-3 w-3 flex-shrink-0 items-center justify-center" role="img" :aria-label="dotLabel" :title="dotLabel" :data-testid="`node-dot-${row.key}`">
          <span v-if="checking" class="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500" />
          <span v-else class="inline-block h-2.5 w-2.5 rounded-full" :class="dotClass" />
        </span>
        <div class="min-w-0 flex-1">
          <template v-if="renaming">
            <input
              ref="renameInput"
              v-model="renameDraft"
              type="text"
              class="w-full max-w-xs rounded-md border border-blue-400 bg-white px-2 py-0.5 text-sm font-semibold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
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
              class="group -mx-1 inline-flex max-w-full items-center gap-1.5 rounded px-1 text-left text-sm font-semibold text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :title="t(k('row.rename'))"
              :aria-label="`${t(k('row.rename'))}: ${row.name}`"
              :data-testid="`node-name-${row.key}`"
              @click="startRename"
            >
              <span class="truncate">{{ row.name }}</span>
              <svg class="h-3.5 w-3.5 flex-shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m13.5 4.5 2 2M4 16l.7-3.1L13.8 3.8a1.4 1.4 0 0 1 2 0l.4.4a1.4 1.4 0 0 1 0 2l-9.1 9.1L4 16Z" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
            <p v-else class="truncate text-sm font-semibold text-slate-900" :data-testid="`node-name-${row.key}`">{{ row.name }}</p>
            <p class="mt-0.5 break-all font-mono text-xs text-slate-500" :data-testid="`node-url-${row.key}`">{{ shownUrl }}</p>
          </template>
        </div>
      </div>

      <div class="ml-auto flex items-center gap-3">
        <span class="inline-flex items-center gap-2">
          <span :class="row.collaborating ? 'text-emerald-600' : 'text-slate-400'" :title="t(k('row.agentsHint'))" role="img" :aria-label="t(k('row.agentsHint'))" data-testid="node-collab-icon">
            <RemoteCollaborationIcon size-class="h-5 w-5" />
          </span>
          <button
            type="button"
            role="switch"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed"
            :class="[row.collaborating ? 'bg-emerald-500' : 'bg-slate-300', row.collaborating && !store.switchOn ? 'opacity-60' : '', switchDisabled ? 'opacity-50' : '']"
            :aria-checked="row.collaborating"
            :aria-label="t(k('row.agentsLabel'), { name: row.name })"
            :title="switchDisabled && !row.collaborating && !checking ? t(k('row.unreachableSwitch'), { name: row.name }) : undefined"
            :disabled="switchDisabled"
            :data-testid="`node-agents-switch-${row.key}`"
            @click="toggleAgents"
          >
            <span aria-hidden="true" class="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform" :class="row.collaborating ? 'translate-x-5' : 'translate-x-0.5'" />
          </button>
        </span>
        <button
          v-if="canOpen"
          type="button"
          class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :data-testid="`node-open-${row.key}`"
          @click="store.openNode(row.key)"
        >{{ t('settings.components.settings.NodeManager.open') }}</button>

        <button
          v-if="!row.isEmbedded"
          type="button"
          class="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          :title="t(k('row.removeNode'), { name: row.name })"
          :aria-label="t(k('row.removeNode'), { name: row.name })"
          :data-testid="`node-remove-${row.key}`"
          @click="store.requestRemove(row.key)"
        >
          <svg class="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6m1.5 0-.6 9a1.5 1.5 0 0 1-1.5 1.4H8.6A1.5 1.5 0 0 1 7.1 15L6.5 6" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <span v-else class="inline-block h-8 w-8" aria-hidden="true" />
      </div>
    </div>

    <div v-if="checking || line" class="px-5 pb-4 pl-[5rem]" aria-live="polite">
      <p v-if="checking" class="flex items-center gap-2 text-sm text-slate-500" :data-testid="`node-line-${row.key}`">
        {{ t(k('row.checkingLine'), { name: row.name }) }}
      </p>
      <div
        v-else-if="line"
        class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg px-3 py-2 text-sm"
        :class="lineClass"
        :data-testid="`node-line-${row.key}`"
      >
        <p class="min-w-0 flex-1 basis-64">
          <span aria-hidden="true" class="mr-1.5">{{ line.tone === 'error' ? '✗' : line.tone === 'warn' ? '⚠' : 'ⓘ' }}</span>
          <span v-if="lineHead" class="font-medium">{{ lineHead }}</span>
          {{ ' ' }}{{ lineText }}
        </p>
        <button v-if="lineFixLabel" type="button" :class="lineButtonClass" :data-testid="`node-fix-${row.key}`" @click="runFix">{{ lineFixLabel }}</button>
      </div>
    </div>

    <div v-if="expanded" class="border-t border-slate-100 bg-slate-50/60 px-5 py-4 pl-[5rem]" :data-testid="`node-details-${row.key}`">
      <div v-if="row.collaborating" :data-testid="`node-directions-${row.key}`">
        <div class="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[max-content_max-content_1fr]">
        <div v-for="dir in directions" :key="dir.id" class="grid gap-x-6 gap-y-0.5 sm:col-span-3 sm:grid-cols-subgrid sm:items-baseline" :data-testid="`node-direction-${dir.id}-${row.key}`">
          <span class="font-medium text-slate-700">{{ dir.label }}</span>
          <span class="inline-flex items-center gap-1.5" :class="dir.toneClass">
            <span v-if="dir.checking" class="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500" aria-hidden="true" />
            <span v-else aria-hidden="true">{{ dir.mark }}</span>
            {{ dir.status }}
          </span>
          <span class="min-w-0 break-all font-mono text-xs text-slate-500">
            <template v-if="dir.via">{{ t(k('dir.via'), { address: dir.via }) }}</template>
            <button
              v-if="dir.id === 'out' && inspection"
              type="button"
              class="ml-2 rounded font-sans text-xs font-medium text-blue-700 hover:text-blue-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :data-testid="`node-change-address-${row.key}`"
              @click="startAddress"
            >{{ t(k('address.change')) }}</button>
          </span>
        </div>
        </div>

        <div v-if="editingAddress" class="mt-3 max-w-xl" :data-testid="`node-address-editor-${row.key}`">
          <label class="block text-xs font-medium text-slate-600" :for="`addr-${row.key}`">{{ t(k('address.label'), { name: row.name }) }}</label>
          <div class="mt-1 flex flex-wrap items-center gap-2">
            <input
              :id="`addr-${row.key}`"
              v-model="addressDraft"
              type="text"
              class="w-full max-w-sm rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-sm shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              :data-testid="`node-address-input-${row.key}`"
              @keydown.enter.prevent="saveAddress()"
              @keydown.esc.prevent="editingAddress = false"
            >
            <button type="button" :class="primaryButton" :disabled="addressBusy" :data-testid="`node-address-save-${row.key}`" @click="saveAddress()">{{ addressBusy ? t(k('address.checking')) : t(k('address.save')) }}</button>
            <button type="button" :class="secondaryButton" @click="editingAddress = false">{{ t(k('address.cancel')) }}</button>
          </div>
          <div v-if="addressError" class="mt-2">
            <NodeAddressHint
              v-if="addressError.kind === 'noAddress'"
              :node="store.thisName"
              :error="addressError"
              :test-id="`node-address-hint-${row.key}`"
              @use="(address) => saveAddress(address)"
              @guide="emit('guide')"
            />
            <p v-else class="text-sm text-red-600" role="alert" :data-testid="`node-address-error-${row.key}`">{{ errorText(addressError, row.name) }}</p>
          </div>
        </div>
      </div>
      <p v-else-if="!checking" class="max-w-2xl text-sm text-slate-600" :data-testid="`node-off-state-${row.key}`">{{ t(k('detail.offState'), { name: row.name }) }}</p>

      <div v-if="row.collaborating && lastRunSteps.length" class="mt-3 text-sm" :data-testid="`node-steps-${row.key}`">
        <p class="font-medium text-slate-700">{{ t(k('detail.steps')) }}</p>
        <ul class="mt-1 space-y-0.5">
          <li v-for="step in lastRunSteps" :key="step.id" class="flex items-baseline gap-2" :class="step.status === 'failed' ? 'text-red-700' : step.status === 'done' ? 'text-slate-600' : 'text-slate-500'">
            <span aria-hidden="true">{{ step.status === 'done' ? '✓' : step.status === 'failed' ? '✗' : '○' }}</span>
            <span>{{ stepText(step) }}<span v-if="step.status === 'failed' && step.error"> — {{ errorText(step.error, row.name) }}</span></span>
          </li>
        </ul>
      </div>

      <div v-if="row.collaborating && offers" class="mt-4" :data-testid="`node-offers-${row.key}`">
        <RemoteCollaborationOfferDisclosure
          v-if="offers.length"
          :entries="offers"
          :footer="checkedAt"
          :test-id="`node-offer-${row.key}`"
        />
        <p v-else class="text-sm text-slate-500" :data-testid="`node-offer-empty-${row.key}`">{{ t(k('detail.emptyOffer'), { name: row.name }) }}</p>
      </div>
      <p v-else-if="row.collaborating && !checking && !offers" class="mt-4 text-sm text-slate-500" :data-testid="`node-offer-none-${row.key}`">{{ t(k('detail.offersUnavailable'), { name: row.name }) }}</p>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-slate-400">
        <span v-if="row.nodeId">{{ t(k('detail.nodeId')) }} <span class="font-mono">{{ row.nodeId }}</span></span>
        <span class="inline-flex items-center gap-1">
          <span v-if="checkedAt && !checking">{{ checkedAt }}</span>
          <button
            type="button"
            class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:text-slate-300"
            :disabled="checking"
            :title="t(k('detail.checkAgain'), { name: row.name })"
            :aria-label="t(k('detail.checkAgain'), { name: row.name })"
            :data-testid="`node-refresh-${row.key}`"
            @click="store.askAgain(row.key)"
          >
            <svg class="h-4 w-4" :class="checking ? 'animate-spin' : ''" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path d="M16 10a6 6 0 1 1-1.8-4.3" stroke-linecap="round" /><path d="M16.2 3v3.2h-3.2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </span>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import RemoteCollaborationIcon from '~/components/settings/nodes/RemoteCollaborationIcon.vue'
import NodeAddressHint from '~/components/settings/nodes/NodeAddressHint.vue'
import RemoteCollaborationOfferDisclosure from '~/components/settings/RemoteCollaborationOfferDisclosure.vue'
import { useNodeText } from '~/composables/useNodeText'
import { useLocalization } from '~/composables/useLocalization'
import type { DirState } from '~/prototype/nodes/nodeWorld'
import { useNodeListStore, type NodeRow, type PlanLine, type StepError } from '~/stores/nodeListStore'

const props = defineProps<{ row: NodeRow }>()
const emit = defineEmits<{ guide: [] }>()

const { t, k, causeText, errorText, dirLabel } = useNodeText()
const { resolvedLocale } = useLocalization()
const store = useNodeListStore()

const primaryButton = 'rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300'
const secondaryButton = 'rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400'

const expanded = computed({ get: () => Boolean(store.expanded[props.row.key]), set: (value: boolean) => { store.expanded[props.row.key] = value } })
const renaming = ref(false)
const renameDraft = ref('')
const renameError = ref('')
const renameInput = ref<HTMLInputElement | null>(null)
const editingAddress = ref(false)
const addressDraft = ref('')
const addressBusy = ref(false)
const addressError = ref<StepError | { kind: 'different' } | null>(null)

const inspection = computed(() => store.inspectionOf(props.row.key))
const checking = computed(() => store.isChecking(props.row.key))
const line = computed(() => store.lineOf(props.row))
const offers = computed(() => store.offersOf(props.row.key))

const shownUrl = computed(() => props.row.url.replace(/^https?:\/\//, ''))

const reachable = computed(() => inspection.value?.windowReach.ok === true)
const different = computed(() => inspection.value?.thisToIt.state === 'different')
const dotClass = computed(() => !inspection.value ? 'bg-slate-300' : different.value ? 'bg-red-500' : reachable.value ? 'bg-emerald-500' : 'border-2 border-slate-400 bg-white')
const dotLabel = computed(() => checking.value ? t(k('row.checking')) : reachable.value && !different.value ? t(k('row.reachable')) : t(k('row.notReachable')))

const canOpen = computed(() => {
  if (!store.hasOpen) return false
  if (props.row.desktopId) return true
  return reachable.value
})

const switchDisabled = computed(() => {
  if (!props.row.nodeId || checking.value) return true
  // A node that does not answer cannot be set up; turning it off stays possible.
  if (!props.row.collaborating && !reachable.value) return true
  return false
})

const toggleAgents = (): void => {
  if (props.row.collaborating) store.requestOff(props.row.key)
  else store.requestOn(props.row.key)
}

const lineClass = computed(() => line.value?.tone === 'error' ? 'border border-red-200 bg-red-50 text-red-900' : line.value?.tone === 'warn' ? 'border border-amber-200 bg-amber-50 text-amber-900' : '-ml-3 text-slate-600')
const lineButtonClass = computed(() => `rounded-md border px-3 py-1 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
  line.value?.tone === 'error' ? 'border-red-300 bg-white text-red-800 hover:bg-red-100' : line.value?.tone === 'warn' ? 'border-amber-300 bg-white text-amber-900 hover:bg-amber-100' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`)

const lineHead = computed(() => {
  const l = line.value
  if (!l) return ''
  if (l.kind === 'unreachable') return t(k('line.unreachableHead'))
  if (l.kind === 'partial') return t(k('line.partialHead'), { name: props.row.name })
  return ''
})
const lineText = computed(() => {
  const l = line.value
  if (!l) return ''
  const name = props.row.name
  switch (l.kind) {
    case 'unreachable': return causeText(l.cause!, l.host ?? '')
    case 'partial': return errorText(l.partialError!, name)
    case 'offThere': return t(k('line.offThere'), { name })
    case 'notRegisteredThere': return t(k('line.notRegisteredThere'), { name })
    case 'different': return t(k('line.different'))
    case 'notRegisteredHereInfo': return t(k('line.notRegisteredHere'), { name })
    case 'agentsOff': return t(k('line.agentsOff'), { name })
    default: return ''
  }
})
const lineFixLabel = computed(() => {
  const l = line.value
  if (!l) return ''
  if (l.kind === 'notRegisteredHereInfo' || l.kind === 'agentsOff') return t(k('line.fixTurnOn'))
  switch (l.fix) {
    case 'turnOnThere': return t(k('line.fixOffThere'))
    case 'registerThere': return t(k('line.fixRegisterThere'))
    case 'changeAddress': return t(k('line.fixChangeAddress'))
    case 'checkAgain': return t(k('line.fixCheckAgain'))
    case 'tryAgain': return t(k('line.fixTryAgain'))
    default: return ''
  }
})
const runFix = (): void => {
  const l = line.value
  if (!l) return
  if (l.kind === 'notRegisteredHereInfo' || l.kind === 'agentsOff') return store.requestOn(props.row.key)
  switch (l.fix) {
    case 'turnOnThere': case 'registerThere': case 'tryAgain': return store.requestFix(props.row.key)
    case 'checkAgain': return store.askAgain(props.row.key)
    case 'changeAddress': expanded.value = true; return startAddress()
  }
}

// ---- directions (expanded row)
const directions = computed(() => {
  const ins = inspection.value
  const name = props.row.name
  const make = (id: 'out' | 'in', label: string, dir: DirState | undefined, via: string | null) => {
    if (!ins || !dir) return { id, label, status: t(k('dir.checking')), checking: true, mark: '', toneClass: 'text-slate-500', via: null as string | null }
    const good = dir.state === 'working'
    const info = dir.state === 'offHere' || dir.state === 'offThere' || dir.state === 'notRegisteredHere' || dir.state === 'notRegisteredThere'
    return {
      id, label, checking: false, status: dirLabel(dir, name), mark: good ? '✓' : info ? '⚠' : '✗',
      toneClass: good ? 'text-emerald-700' : info ? 'text-amber-700' : 'text-red-700', via: via ? via.replace(/^https?:\/\//, 'http://') : null,
    }
  }
  const showChecking = checking.value
  return [
    make('out', t(k('dir.thisToIt'), { name }), showChecking ? undefined : ins?.thisToIt, ins?.viaThis ?? null),
    make('in', t(k('dir.itToThis'), { name }), showChecking ? undefined : ins?.itToThis, ins?.viaIt ?? null),
  ]
})

const checkedAt = computed(() => {
  const state = store.runtime[props.row.key]
  if (state?.phase !== 'settled') return ''
  return t(k('detail.checkedAt'), { time: new Date(state.checkedAt).toLocaleTimeString(resolvedLocale.value, { hour: '2-digit', minute: '2-digit' }) })
})

// ---- what happened in the last run (visible while a part is still missing)
const lastRunSteps = computed<PlanLine[]>(() => {
  const run = store.lastRuns[props.row.key]
  const unfinished = inspection.value && (inspection.value.thisToIt.state !== 'working' || inspection.value.itToThis.state !== 'working')
  return run && run.kind !== 'off' && unfinished && run.lines.some((l) => l.status === 'failed') ? run.lines : []
})
const stepText = (step: PlanLine): string => {
  const node = props.row.name
  switch (step.id) {
    case 'turnOnHere': return t(k('step.turnOnHere'))
    case 'registerHere': return t(k('step.registerHere'), { node, name: step.name ?? '' })
    case 'turnOnThere': return `${t(k('dialog.there'), { name: node })}: ${t(k('step.turnOnThere'))}`
    case 'registerThere': return `${t(k('dialog.there'), { name: node })}: ${t(k('step.registerThere'), { name: step.name ?? '' })}`
    default: return ''
  }
}

// ---- change address
const startAddress = (): void => {
  addressDraft.value = inspection.value?.viaThis ?? props.row.url
  addressError.value = null
  editingAddress.value = true
}
const saveAddress = async (address?: string): Promise<void> => {
  if (addressBusy.value) return
  if (address) addressDraft.value = address
  addressBusy.value = true
  addressError.value = null
  const result = await store.changeAddress(props.row.key, addressDraft.value)
  addressBusy.value = false
  if (result.ok) editingAddress.value = false
  else addressError.value = result.error
}

// ---- rename: click the name, type, Enter (Esc cancels)
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
  renameError.value = result.error === 'taken' ? t(k('rename.errorTaken'), { name: renameDraft.value.trim() }) : t(k('rename.errorName'))
}
</script>
