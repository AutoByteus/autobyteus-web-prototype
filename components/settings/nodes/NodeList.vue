<template>
  <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" data-testid="node-list-card">
    <div class="border-b border-slate-200 bg-slate-50 px-5 py-4">
      <div class="min-w-0">
        <h3 class="text-sm font-semibold text-gray-900">{{ t(k('list.title')) }}</h3>
        <p class="mt-0.5 text-xs text-gray-500">{{ t(k('list.description')) }}</p>
      </div>
    </div>

    <AddNodePanel />

    <div
      v-if="store.banner"
      class="flex items-start justify-between gap-3 border-b border-blue-100 bg-blue-50 px-5 py-3 text-sm text-blue-900"
      role="status"
      data-testid="node-list-banner"
    >
      <p>
        ⓘ {{ bannerText }}
      </p>
      <button type="button" class="flex-shrink-0 rounded text-xs font-medium text-blue-700 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="node-list-banner-dismiss" @click="store.dismissBanner()">{{ t(k('banner.dismiss')) }}</button>
    </div>

    <ul v-if="store.rows.length" class="divide-y divide-slate-100" data-testid="node-list">
      <NodeRow v-for="row in store.rows" :key="row.key" :row="row" @guide="emit('guide')" />
    </ul>
    <p v-else class="px-5 py-6 text-sm text-slate-500" data-testid="node-list-empty">{{ t(k('list.empty')) }}</p>

    <NodeChangeDialog @guide="emit('guide')" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AddNodePanel from '~/components/settings/nodes/AddNodePanel.vue'
import NodeChangeDialog from '~/components/settings/nodes/NodeChangeDialog.vue'
import NodeRow from '~/components/settings/nodes/NodeRow.vue'
import { useNodeText } from '~/composables/useNodeText'
import { useNodeListStore } from '~/stores/nodeListStore'

const emit = defineEmits<{ guide: [] }>()
const { t, k, causeText } = useNodeText()
const store = useNodeListStore()

const bannerText = computed(() => {
  const banner = store.banner
  if (!banner) return ''
  const base = t(k(`banner.${banner.key}`), banner.params)
  return banner.cause ? `${base} ${causeText(banner.cause, banner.params.host ?? '')}` : base
})

onMounted(() => store.open())
</script>
