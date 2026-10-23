<template>
  <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" data-testid="node-list-card">
    <div class="border-b border-slate-200 bg-slate-50 px-5 py-4">
      <div class="min-w-0">
        <h3 class="text-sm font-semibold text-gray-900">{{ t(k('list.title')) }}</h3>
        <p class="mt-0.5 text-xs text-gray-500">{{ t(k('list.description')) }}</p>
      </div>
    </div>

    <AddNodePanel />

    <ul v-if="store.rows.length" class="divide-y divide-slate-100" data-testid="node-list">
      <NodeRow v-for="row in store.rows" :key="row.key" :row="row" @guide="emit('guide')" />
    </ul>
    <p v-else class="px-5 py-6 text-sm text-slate-500" data-testid="node-list-empty">{{ t(k('list.empty')) }}</p>

    <NodeChangeDialog @guide="emit('guide')" />
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AddNodePanel from '~/components/settings/nodes/AddNodePanel.vue'
import NodeChangeDialog from '~/components/settings/nodes/NodeChangeDialog.vue'
import NodeRow from '~/components/settings/nodes/NodeRow.vue'
import { useNodeText } from '~/composables/useNodeText'
import { useNodeListStore } from '~/stores/nodeListStore'

const emit = defineEmits<{ guide: [] }>()
const { t, k } = useNodeText()
const store = useNodeListStore()

onMounted(() => store.open())
</script>
