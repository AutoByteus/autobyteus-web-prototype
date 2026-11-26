<template>
  <!-- extensions-ui-516 (design, founder 2026-11-25): one form; the access code is a field of it, not a second mode. Pasting a
       code fills in the address (and the name when it is empty); without a code the node is listed and asks for one. -->
  <form class="border-t border-slate-200 bg-slate-50 px-5 pb-4 pt-3.5" data-testid="add-node-panel" @submit.prevent="submit">
    <h4 class="mb-2.5 text-sm font-semibold text-slate-900">{{ network.joined ? t('nodes.sections.addTitle') : t('nodes.sections.addTitlePlain') }}</h4>
    <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.4fr)_auto_auto] xl:items-start">
      <div>
        <input
          v-model="draft.address"
          type="text"
          class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 font-mono text-[0.8125rem] text-slate-900 shadow-sm transition placeholder:font-sans placeholder:text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          :class="errors.address ? 'border-red-300' : ''"
          :placeholder="t(k('add.addressPlaceholder'))"
          :aria-label="t(k('add.address'))"
          :aria-invalid="Boolean(errors.address)"
          :disabled="busy"
          data-testid="add-node-address"
        >
        <p v-if="errors.address" class="mt-1.5 text-sm text-red-600" role="alert" data-testid="add-node-address-error">{{ errors.address }}</p>
      </div>
      <div>
        <input
          v-model="draft.name"
          type="text"
          class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          :class="errors.name ? 'border-red-300' : ''"
          :placeholder="codeRead ? t('nodes.nodeCode.namePlaceholderWithCode') : t(k('add.namePlaceholder'))"
          :aria-label="t(k('add.name'))"
          :aria-invalid="Boolean(errors.name)"
          :disabled="busy"
          data-testid="add-node-name"
        >
        <p v-if="errors.name" class="mt-1.5 text-sm text-red-600" role="alert" data-testid="add-node-name-error">{{ errors.name }}</p>
      </div>
      <div class="md:col-span-2 xl:col-span-1">
        <input
          v-model="draft.code"
          type="text"
          spellcheck="false"
          autocomplete="off"
          class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 font-mono text-xs text-slate-900 shadow-sm transition placeholder:font-sans placeholder:text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          :class="codeError ? 'border-red-300' : ''"
          :placeholder="t('nodes.nodeCode.fieldPlaceholder')"
          :aria-label="t('nodes.nodeCode.label')"
          :aria-invalid="Boolean(codeError)"
          :disabled="busy"
          data-testid="add-node-code"
          @input="onCode"
        >
        <p v-if="codeError" class="mt-1.5 text-sm text-red-600" role="alert" data-testid="add-node-code-error">{{ codeError }}</p>
        <p v-else-if="codeRead && !codeStep" class="mt-1.5 text-xs text-emerald-700" data-testid="add-node-code-read">{{ t('nodes.nodeCode.readOk', { address: codeRead.address }) }}</p>
      </div>
      <!-- extensions-ui-516 (design, pairing-contract §9): pairing on add is a choice, not a switch -->
      <label class="inline-flex h-10 flex-shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700" :title="t(k('add.collaborateHint'))">
        <input v-model="draft.collaborate" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" :disabled="busy" data-testid="add-node-collaborate">
        {{ t(k('add.collaborate')) }}
      </label>
      <button
        type="submit"
        class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:opacity-50"
        :disabled="busy"
        data-testid="add-node-submit"
      >
        <svg v-if="!busy" class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 4.5v11M4.5 10h11" stroke-linecap="round" /></svg>
        <span v-else class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
        {{ busy ? t(k('add.checking')) : t(k('add.submit')) }}
      </button>
    </div>

    <p v-if="codeStep" class="mt-2 flex items-center gap-2 text-sm text-slate-600" role="status" data-testid="add-node-code-step">
      <span class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 motion-reduce:animate-none" aria-hidden="true" />{{ codeStep }}
    </p>
    <p v-else-if="duplicate" class="mt-3 flex items-center gap-2 text-sm text-blue-700" role="status" data-testid="add-node-duplicate"><NodeNoticeIcon tone="info" />{{ t(k('add.duplicate'), { name: duplicate }) }}</p>
    <p v-else class="mt-2 text-xs leading-5 text-slate-500" data-testid="add-node-hint">{{ t('nodes.nodeCode.formHint') }}</p>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import NodeNoticeIcon from '~/components/settings/nodes/NodeNoticeIcon.vue'
import { useLocalization } from '~/composables/useLocalization'
import { useNodeChangeDialogStore } from '~/stores/nodeChangeDialogStore'
import { isValidNodeName, useNodeListStore } from '~/stores/nodeListStore'
import { NODES_PAGE_KEY } from '~/utils/nodeConnectionErrorText'
import { readNodeCode } from '~/prototype/nodes/nodeCode'
import { accessCodeAddress, useAddWithAccessCode } from '~/prototype/nodes/addWithAccessCode'
import { useNodeAccessStore } from '~/stores/nodeAccessStore'
import { usePrivateNetworkStore } from '~/stores/privateNetworkStore'

/**
 * The always-open add form (UIS-003; extensions-ui-516 design, founder 2026-11-25): Address, Name, Access code, Pair with it,
 * Add node, in one form. An access code (pairing-contract §6) fills in the address; its setup code is exchanged for this app's
 * owner credential, so the node is added under this AutoByteus's control. Without a code the node is listed and its row asks
 * for one ("Needs connecting").
 */
const { t } = useLocalization()
const k = (key: string): string => `${NODES_PAGE_KEY}${key}`
const store = useNodeListStore()
const dialog = useNodeChangeDialogStore()
/** "Add a node that isn't found" while a private network finds nodes; plain "Add a node" without one. */
const network = usePrivateNetworkStore()
const access = useNodeAccessStore()

const draft = reactive({ address: '', name: '', code: '', collaborate: true })
const errors = reactive({ address: '', name: '' })
const duplicate = ref('')
const busy = ref(false)
const codeError = ref('')
const codeStep = ref('')
const codeRead = computed(() => (draft.code.trim() ? readNodeCode(draft.code) : null))

/** Pasting a code fills in the address it names; a text that is not a code says so at once. */
const onCode = (): void => {
  codeError.value = ''
  if (!draft.code.trim()) return
  const code = codeRead.value
  if (!code) { codeError.value = t('nodes.nodeCode.errorNotCode'); return }
  draft.address = accessCodeAddress(code.address)
}

const reset = (): void => { draft.address = ''; draft.name = ''; draft.code = ''; draft.collaborate = true }

const adder = useAddWithAccessCode()
const addWithCode = async (): Promise<void> => {
  busy.value = true
  try {
    const result = await adder.add(draft.code, { name: draft.name, typedAddress: draft.address, onStep: (step) => { codeStep.value = step } })
    if (!result.ok) {
      if (result.field === 'duplicate') duplicate.value = result.existing
      else if (result.field === 'address') errors.address = result.message
      else codeError.value = result.message
      return
    }
    const pair = draft.collaborate
    reset()
    // Pair with it: the decision for both sides of a node this AutoByteus now controls (no confirmation; pairing-contract §3).
    if (pair) void dialog.pairDirect(result.nodeId)
  } catch (cause) {
    codeError.value = cause instanceof Error ? cause.message : String(cause)
  } finally {
    codeStep.value = ''
    busy.value = false
  }
}

const submit = async (): Promise<void> => {
  if (busy.value) return
  errors.address = ''
  errors.name = ''
  codeError.value = ''
  duplicate.value = ''
  if (draft.code.trim()) {
    if (draft.name.trim() && !isValidNodeName(draft.name)) { errors.name = t(k('add.errorName')); return }
    await addWithCode(); return
  }
  busy.value = true
  try {
    const collaborate = draft.collaborate
    const result = await store.addNode({ address: draft.address, name: draft.name, collaborate })
    if (result.ok) {
      // Success is silent: the row appears and is highlighted; the form is ready for the next node.
      reset()
      // Pair with it: a node added by address is not under this AutoByteus's control yet; it pairs once its row's access
      // code connects it (Solution Designer 2026-11-25), or at once when it already is.
      if (collaborate) {
        const entryId = store.rowByKey(result.key)?.entryIds[0]
        if (entryId && access.stateOf(entryId) === 'connected') void dialog.pairDirect(result.key)
        else if (entryId) dialog.pairAfterControl = [...dialog.pairAfterControl, entryId]
      }
    } else if (result.error === 'invalid') {
      if (result.address) errors.address = t(k('add.errorAddress'))
      if (result.name) errors.name = t(k('add.errorName'))
    } else {
      duplicate.value = result.existing
    }
  } finally {
    busy.value = false
  }
}
</script>
