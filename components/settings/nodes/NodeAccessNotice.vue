<template>
  <div
    v-if="entryId && state === 'needs_connecting'"
    class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
    :data-testid="`node-access-${row.key}`"
  >
    <div class="flex items-start gap-2.5">
      <NodeNoticeIcon class="mt-0.5" tone="warn" />
      <p class="min-w-0 flex-1 leading-5">
        <span class="font-medium">{{ t(k('access.needsConnecting')) }}</span>
        {{ ' ' }}{{ t('nodes.nodeCode.needsText', { name: row.name }) }}
      </p>
    </div>
    <form class="mt-2 flex flex-wrap items-center gap-2 pl-6" @submit.prevent="connect">
      <label class="sr-only" :for="`setup-code-${row.key}`">{{ t('nodes.nodeCode.codeLabel', { name: row.name }) }}</label>
      <input
        :id="`setup-code-${row.key}`"
        v-model="code"
        type="text"
        autocomplete="off"
        spellcheck="false"
        class="h-8 w-72 max-w-full rounded-md border border-amber-300 bg-white px-2 font-mono text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        :placeholder="t('nodes.nodeCode.pastePlaceholder')"
        :data-testid="`node-access-code-${row.key}`"
      >
      <button
        type="submit"
        class="h-8 rounded-md border border-amber-300 bg-white px-3 text-xs font-medium text-amber-900 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60"
        :disabled="busy || !code.trim() || needsJoin"
        :data-testid="`node-access-connect-${row.key}`"
      >{{ busy ? t(k('access.connecting')) : t(k('access.connect')) }}</button>
    </form>
    <NodeJoinFirstNotice v-if="needsJoin && !error && read" inline class="mt-1.5 pl-6" :address="read.address" />
    <p v-if="error" class="mt-1.5 pl-6 text-sm text-red-700" role="alert" :data-testid="`node-access-error-${row.key}`">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import NodeNoticeIcon from '~/components/settings/nodes/NodeNoticeIcon.vue'
import NodeJoinFirstNotice from '~/components/settings/nodes/NodeJoinFirstNotice.vue'
import { usePrivateNetworkStore } from '~/stores/privateNetworkStore'
import { useLocalization } from '~/composables/useLocalization'
import { isNodeCodeUsed, markNodeCodeUsed, readNodeCode } from '~/prototype/nodes/nodeCode'
import { useNodeAccessStore } from '~/stores/nodeAccessStore'
import { useNodeListStore } from '~/stores/nodeListStore'
import type { NodeRow } from '~/stores/nodeRowStatus'
import { causeText, NODES_PAGE_KEY } from '~/utils/nodeConnectionErrorText'

/**
 * A remote or Docker node this AutoByteus holds no credential for (autobyteus-437 NAS-02, NAS-30): "Needs connecting",
 * where to get an access code for the node (the access-code command, or This node → Create access code) (pairing-contract §6; no terminal), and the field to paste it. Connected, the row is asked again.
 */
const props = defineProps<{ row: NodeRow }>()
const { t } = useLocalization()
const k = (key: string): string => `${NODES_PAGE_KEY}${key}`
const access = useNodeAccessStore()
const list = useNodeListStore()

const entryId = computed(() => (props.row.isEmbedded ? null : props.row.entryIds[0] ?? null))
const state = computed(() => (entryId.value ? access.stateOf(entryId.value) : null))
const code = ref('')
const network = usePrivateNetworkStore()
const read = computed(() => (code.value.trim() ? readNodeCode(code.value) : null))
/** private-network-661 (REQ-010): a code with a private-network address needs this computer's node on the private network first. */
const needsJoin = computed(() => network.needsJoinFor(read.value?.address))
const busy = ref(false)
const error = ref('')

const connect = async (): Promise<void> => {
  if (!entryId.value || busy.value) return
  busy.value = true
  error.value = ''
  try {
    // extensions-ui-516 (design, pairing-contract §6): an access code made on the node replaces the terminal's setup code.
    const read = readNodeCode(code.value)
    if (!read) { error.value = t('nodes.nodeCode.errorNotCode'); return }
    if (Date.parse(read.expiresAt) < Date.now()) { error.value = t('nodes.nodeCode.errorExpired'); return }
    if (isNodeCodeUsed(read.setupCode)) { error.value = t('nodes.nodeCode.errorUsed'); return }
    if (network.needsJoinFor(read.address)) return
    if (props.row.nodeId && read.nodeId !== props.row.nodeId) { error.value = t('nodes.nodeCode.errorOtherNode', { name: props.row.name }); return }
    const result = await access.connect(entryId.value, read.setupCode)
    if (result.ok) {
      markNodeCodeUsed(read.setupCode)
      code.value = ''
      list.askAgain(props.row.key)
      return
    }
    error.value = result.code === 'NODE_SETUP_CODE_INVALID' ? t(k('access.errorCode'))
      : result.code === 'NODE_NETWORK_REFUSED' ? causeText(t, 'network_refused', '')
        : t(k('access.errorOther'), { name: props.row.name, message: result.message })
  } finally {
    busy.value = false
  }
}
</script>
