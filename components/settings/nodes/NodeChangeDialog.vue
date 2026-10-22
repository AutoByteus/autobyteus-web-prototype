<template>
  <Teleport to="body">
    <div v-if="plan" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4" data-testid="node-change-overlay" @keydown.esc="onEscape">
      <div
        class="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-busy="plan.phase === 'running'"
        :data-testid="`node-change-dialog-${plan.kind}`"
      >
        <h3 :id="titleId" class="text-lg font-semibold" :class="plan.kind === 'remove' ? 'text-red-700' : 'text-gray-900'">{{ title }}</h3>
        <p class="mt-2 text-sm text-gray-600">{{ lead }}</p>

        <div class="mt-4 space-y-4">
          <section v-for="group in groups" :key="group.id" :data-testid="`node-change-group-${group.id}`">
            <h4 v-if="group.title" class="text-xs font-semibold text-slate-500">{{ group.title }}</h4>
            <ul :class="group.title ? 'mt-1.5 space-y-2' : 'space-y-2'">
              <li v-for="line in group.lines" :key="line.id" class="flex items-start gap-2.5 text-sm" :data-testid="`node-change-step-${line.id}`">
                <span class="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center text-xs" :class="markClass(line)" :aria-label="statusLabel(line)">
                  <span v-if="line.status === 'running'" class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                  <template v-else>{{ mark(line) }}</template>
                </span>
                <div class="min-w-0 flex-1">
                  <p :class="line.status === 'failed' ? 'text-red-800' : 'text-slate-800'">{{ stepText(line) }}</p>
                  <p v-if="line.id === 'registerHere' || line.id === 'registerThere'" class="mt-0.5">
                    <span v-if="line.name && line.wanted && line.name !== line.wanted" class="block text-xs text-slate-500" :data-testid="`node-change-name-taken-${line.id}`">{{ t(k('step.nameTaken'), { wanted: line.wanted }) }}</span>
                  </p>
                  <p v-if="line.id === 'registerThere' && line.status === 'todo'" class="mt-0.5 text-xs text-slate-500" :data-testid="`node-change-address-${line.id}`">
                    <!-- DEC-709 (pending the user): recommended option (b), the address is found once collaboration is on there. -->
                    <template v-if="line.findsLater">{{ t(k('step.findsLater'), { node: plan.nodeName }) }}</template>
                    <template v-else-if="line.addressPending">{{ t(k('step.finding'), { node: plan.nodeName }) }}</template>
                    <template v-else-if="line.address">{{ t(k('step.address'), { node: plan.nodeName, address: line.address }) }}</template>
                  </p>
                  <div v-if="line.status === 'failed' && line.error" class="mt-2">
                    <NodeAddressHint
                      v-if="line.error.kind === 'noAddress'"
                      :node="line.id === 'registerHere' ? plan.thisName : plan.nodeName"
                      :error="line.error"
                      :test-id="`node-change-hint-${line.id}`"
                      @use="(address) => store.confirmPlan(address)"
                      @guide="goGuide"
                    />
                    <p v-else class="text-sm text-red-700" role="alert" :data-testid="`node-change-error-${line.id}`">{{ errorText(line.error, plan.nodeName) }}</p>
                  </div>
                </div>
              </li>
            </ul>
          </section>
        </div>

        <p v-if="plan.phase === 'failed'" class="mt-4 text-sm text-slate-700" role="status" data-testid="node-change-partial">
          {{ plan.kind === 'remove' ? t(k('dialog.removeFailedThere'), { name: plan.nodeName }) : t(k('dialog.partial')) }}
        </p>
        <p v-else-if="plan.kind === 'off'" class="mt-4 text-sm text-slate-600">{{ t(k('dialog.offNote'), { name: plan.nodeName }) }}</p>
        <p v-else-if="plan.kind === 'remove'" class="mt-4 text-sm text-slate-600">{{ t(k('dialog.removeNote')) }}</p>
        <p v-if="plan.kind === 'on' || plan.kind === 'fix'" class="mt-4 text-xs text-slate-500" data-testid="node-change-trusted">{{ t(k('dialog.trusted')) }}</p>

        <div class="mt-6 flex justify-end gap-3">
          <template v-if="plan.phase === 'failed'">
            <button type="button" :class="cancelButton" data-testid="node-change-close" @click="store.cancelPlan()">{{ t(k('dialog.close')) }}</button>
            <button v-if="plan.kind !== 'remove'" type="button" :class="confirmClass" data-testid="node-change-retry" @click="store.confirmPlan()">{{ t(k('dialog.tryAgain')) }}</button>
          </template>
          <template v-else>
            <button type="button" :class="cancelButton" :disabled="plan.phase === 'running'" data-testid="node-change-cancel" @click="store.cancelPlan()">{{ t(k('dialog.cancel')) }}</button>
            <button ref="confirmButton" type="button" :class="confirmClass" :disabled="plan.phase === 'running'" data-testid="node-change-confirm" @click="store.confirmPlan()">
              {{ plan.phase === 'running' ? t(k('dialog.working')) : confirmLabel }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import NodeAddressHint from '~/components/settings/nodes/NodeAddressHint.vue'
import { useNodeText } from '~/composables/useNodeText'
import { useNodeListStore, type PlanLine } from '~/stores/nodeListStore'

const emit = defineEmits<{ guide: [] }>()
const { t, k, errorText } = useNodeText()
const store = useNodeListStore()
const plan = computed(() => store.plan)
const confirmButton = ref<HTMLButtonElement | null>(null)
const titleId = 'node-change-title'

watch(() => plan.value?.rowKey, async (key) => { if (key) { await nextTick(); confirmButton.value?.focus() } })

const cancelButton = 'rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50'
const confirmClass = computed(() => `inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 ${plan.value?.kind === 'remove' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}`)

const title = computed(() => {
  const p = plan.value!
  const key = p.kind === 'on' ? 'dialog.onTitle' : p.kind === 'fix' ? 'dialog.fixTitle' : p.kind === 'off' ? 'dialog.offTitle' : 'dialog.removeTitle'
  return t(k(key), { name: p.nodeName })
})
const lead = computed(() => {
  const p = plan.value!
  const key = p.kind === 'on' ? 'dialog.onLead' : p.kind === 'fix' ? 'dialog.fixLead' : p.kind === 'off' ? 'dialog.offLead' : 'dialog.removeLead'
  return t(k(key), { name: p.nodeName })
})
const confirmLabel = computed(() => {
  const p = plan.value!
  return t(k(p.kind === 'on' ? 'dialog.confirmOn' : p.kind === 'fix' ? 'dialog.confirmFix' : p.kind === 'off' ? 'dialog.confirmOff' : 'dialog.confirmRemove'))
})

const SIDE: Record<string, 'here' | 'there' | 'list'> = {
  turnOnHere: 'here', registerHere: 'here', unregisterHere: 'here',
  turnOnThere: 'there', registerThere: 'there', unregisterThere: 'there', removeFromList: 'list',
}

// Every change on both nodes, grouped by the node it happens on.
const groups = computed(() => {
  const p = plan.value!
  const result: { id: string; title: string; lines: PlanLine[] }[] = []
  // Turning off and removing are short: one plain list, each line already names its node.
  if (p.kind === 'off' || p.kind === 'remove') return [{ id: 'all', title: '', lines: p.lines }]
  const add = (id: 'here' | 'there' | 'list', title: string): void => {
    const lines = p.lines.filter((line) => SIDE[line.id] === id)
    if (lines.length) result.push({ id, title, lines })
  }
  add('here', t(k('dialog.here'), { name: p.thisName }))
  add('there', t(k('dialog.there'), { name: p.nodeName }))
  add('list', t(k('dialog.list')))
  return result
})

const stepText = (line: PlanLine): string => {
  const p = plan.value!
  switch (line.id) {
    case 'turnOnHere': return t(k('step.turnOnHere'))
    case 'registerHere': return t(k('step.registerHere'), { node: p.nodeName, name: line.name ?? '' })
    case 'turnOnThere': return t(k('step.turnOnThere'))
    case 'registerThere': return t(k('step.registerThere'), { name: line.name ?? '' })
    case 'unregisterHere': return t(k('step.unregisterHere'), { node: p.nodeName })
    case 'unregisterThere': return t(k('step.unregisterThere'), { node: p.nodeName })
    case 'removeFromList': return t(k('step.removeFromList'), { node: p.nodeName })
  }
}

const inConfirm = computed(() => plan.value?.phase === 'confirm')
const mark = (line: PlanLine): string => inConfirm.value ? '•' : line.status === 'done' ? '✓' : line.status === 'failed' ? '✗' : line.status === 'notRun' ? '○' : '•'
const markClass = (line: PlanLine): string => inConfirm.value ? 'text-slate-400' : line.status === 'done' ? 'font-bold text-emerald-600' : line.status === 'failed' ? 'font-bold text-red-600' : 'text-slate-400'
const statusLabel = (line: PlanLine): string => inConfirm.value ? '' : line.status === 'done' ? t(k('step.done')) : line.status === 'failed' ? t(k('step.failed')) : line.status === 'notRun' ? t(k('step.notRun')) : ''

const onEscape = (): void => { if (plan.value && plan.value.phase !== 'running') store.cancelPlan() }
const goGuide = (): void => { store.cancelPlan(); emit('guide') }
</script>
