<template>
  <section class="mt-6" data-test="run-members">
    <!-- Round 20: an optional heading and "Reset all" (only when something is customized). -->
    <div v-if="title || (customizedCount && !readOnly)" class="mb-2 flex items-baseline justify-between gap-3">
      <h3 v-if="title" class="min-w-0 text-xs font-medium text-gray-500">{{ title }}</h3>
      <button
        v-if="customizedCount && !readOnly"
        type="button"
        class="ml-auto rounded px-1 text-xs font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        data-test="run-members-reset-all"
        @click="emit('reset-all')"
      >
        {{ $t('runSettings.members.resetAll') }}
      </button>
    </div>
    <!-- No overflow clipping: member menus open outside the list. Without a heading (member panel)
         rows bleed into the panel padding; with one (saved run) they align with the card above. -->
    <div :class="title ? 'space-y-1.5' : '-mx-2 space-y-1.5'">
      <RunMemberRow
        v-for="node in nodes"
        :key="node.key"
        :node="node"
        :expanded-keys="expandedKeys"
        :locked="locked"
        :runtime-locked="runtimeLocked"
        :read-only="readOnly"
        @toggle="toggle"
        @update="(key, field, value) => emit('update', key, field, value)"
        @reset="(key, field) => emit('reset', key, field)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import RunMemberRow from './RunMemberRow.vue'
import { countCustomized, type RunMemberNode, type RunSettingField, type RunSettingFlags } from './runSettings'

const props = withDefaults(defineProps<{
  nodes: readonly RunMemberNode[]
  title?: string
  locked?: RunSettingFlags
  runtimeLocked?: boolean
  readOnly?: boolean
}>(), { title: '', locked: () => ({}), runtimeLocked: false, readOnly: false })

const emit = defineEmits<{
  (event: 'update', key: string, field: RunSettingField, value: unknown): void
  (event: 'reset', key: string, field: RunSettingField | null): void
  (event: 'reset-all'): void
}>()

const expandedKeys = ref<Set<string>>(new Set())
const toggle = (key: string) => {
  const next = new Set(expandedKeys.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expandedKeys.value = next
}
const customizedCount = computed(() => countCustomized(props.nodes))
</script>
