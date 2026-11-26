<template>
  <!-- extensions-ui-516 (design, founder 2026-11-26): the list is two named sections; each node is in exactly one.
       "Controlled nodes": this AutoByteus has its access code (and a node added by address that still needs one).
       "Paired nodes": paired with this node, not controlled by this AutoByteus (other people's nodes). -->
  <section class="nodes-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" data-testid="node-list-card">
    <div class="px-5 pb-4 pt-5">
      <h3 class="text-base font-semibold text-slate-900">{{ t('nodes.sections.controlledTitle') }}</h3>
      <p class="mt-1 max-w-3xl text-sm text-slate-500">{{ t('nodes.sections.controlledLead') }}</p>
    </div>
    <ul v-if="controlled.length" class="divide-y divide-slate-100 border-t border-slate-100" data-testid="node-list">
      <NodeRow v-for="row in controlled" :key="row.key" :row="row" @guide="emit('guide')" />
    </ul>
    <p v-else class="border-t border-slate-100 px-5 py-6 text-center text-sm text-slate-500" data-testid="node-list-empty">{{ t('nodes.sections.controlledEmpty') }}</p>
    <AddNodePanel />
  </section>

  <section class="nodes-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" data-testid="paired-list-card">
    <div class="px-5 pb-4 pt-5">
      <h3 class="text-base font-semibold text-slate-900">{{ t('nodes.sections.pairedTitle') }}</h3>
      <p class="mt-1 max-w-3xl text-sm text-slate-500">{{ t('nodes.sections.pairedLead') }}</p>
    </div>
    <ul v-if="pairedOnly.length" class="divide-y divide-slate-100 border-t border-slate-100" data-testid="paired-list">
      <NodeRow v-for="row in pairedOnly" :key="row.key" :row="row" @guide="emit('guide')" />
    </ul>
    <p v-else class="border-t border-slate-100 px-5 py-6 text-center text-sm text-slate-500" data-testid="paired-list-empty">{{ t('nodes.sections.pairedEmpty') }}</p>
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
import { useLocalization } from '~/composables/useLocalization'
import { useNodeChangeDialogStore } from '~/stores/nodeChangeDialogStore'
import { useNodeListStore } from '~/stores/nodeListStore'

/** "Controlled nodes" (with Add node at its end) and "Paired nodes" (UIS-001, split by the founder 2026-11-26): every node once; each row is asked when the tab opens. */
const emit = defineEmits<{ guide: [] }>()
const { t } = useLocalization()
const store = useNodeListStore()
const dialog = useNodeChangeDialogStore()
/** A desktop entry means this AutoByteus lists the node to control it; a node only this node knows (its peer) is paired, not controlled. */
const controlled = computed(() => store.rows.filter((row) => row.entryIds.length > 0))
const pairedOnly = computed(() => store.rows.filter((row) => row.entryIds.length === 0))

onMounted(() => { void store.open() })
// Leaving the tab: answers on their way are ignored and a confirmation not running closes.
onBeforeUnmount(() => { store.close(); dialog.cancel() })
</script>
