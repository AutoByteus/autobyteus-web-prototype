<template>
  <section class="mt-6" data-test="run-members">
    <div class="mb-2 flex items-baseline justify-between gap-3">
      <div class="min-w-0">
        <h3 class="text-xs font-medium text-gray-500">{{ title || $t('runSettings.members.title') }}</h3>
        <p v-if="hint" class="mt-0.5 text-xs text-gray-400">{{ hint }}</p>
      </div>
      <div class="flex items-baseline gap-2 text-xs">
        <span v-if="!flat" :class="customizedCount ? 'text-gray-700' : 'text-gray-400'" data-test="run-members-count">
          {{ customizedCount ? $t('runSettings.members.customizedCount', { count: customizedCount }) : $t('runSettings.members.noneCustomized') }}
        </span>
        <button
          v-if="customizedCount && !readOnly"
          type="button"
          class="rounded px-1 font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          data-test="run-members-reset-all"
          @click="emit('reset-all')"
        >
          {{ $t('runSettings.members.resetAll') }}
        </button>
      </div>
    </div>
    <!-- No overflow clipping: member menus open outside the list. -->
    <div :class="flat ? 'divide-y divide-gray-100 border-y border-gray-100' : 'divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white [&>*:first-child>div:first-child]:rounded-t-lg [&>*:last-child>div:last-child]:rounded-b-lg [&>*:last-child>div:first-child]:rounded-b-lg'">
      <RunMemberRow
        v-for="node in nodes"
        :key="node.key"
        :node="node"
        :expanded-keys="expandedKeys"
        :inherited-label="inheritedLabel"
        :defaults-label="defaultsLabel"
        :locked="locked"
        :runtime-locked="runtimeLocked"
        :read-only="readOnly"
        :flat="flat"
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
  hint?: string
  /** Marker for a member value that follows the defaults above ("Team default" / "Org default"). */
  inheritedLabel: string
  /** Collapsed-row text for a member with no customization ("Team defaults" / "Org defaults"). */
  defaultsLabel: string
  locked?: RunSettingFlags
  runtimeLocked?: boolean
  readOnly?: boolean
  /** Plain list with hairline dividers (member panel). */
  flat?: boolean
}>(), { title: '', hint: '', locked: () => ({}), runtimeLocked: false, readOnly: false, flat: false })

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
