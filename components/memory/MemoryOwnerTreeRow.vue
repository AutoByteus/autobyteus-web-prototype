<template>
  <li>
    <div
      class="group flex items-center rounded-md text-sm"
      :class="selected ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'"
      :style="{ paddingLeft: `${depth * 1}rem` }"
    >
      <button
        v-if="hasChildren"
        type="button"
        class="flex h-7 w-5 flex-shrink-0 items-center justify-center text-gray-400 hover:text-gray-600"
        :aria-label="isOpen ? $t('memory.browse.collapse') : $t('memory.browse.expand')"
        :aria-expanded="isOpen"
        @click="$emit('toggle', node.key)"
      >
        <Icon icon="heroicons:chevron-right-20-solid" class="h-4 w-4 transition-transform duration-150 motion-reduce:transition-none" :class="isOpen ? 'rotate-90' : ''" aria-hidden="true" />
      </button>
      <span v-else class="w-5 flex-shrink-0" aria-hidden="true" />
      <button
        type="button"
        class="flex min-w-0 flex-1 items-center gap-2 rounded-md py-1.5 pr-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        :aria-current="selected ? 'page' : undefined"
        :data-test="`memory-tree-row`"
        :data-node="node.key"
        @click="$emit('select', node.key)"
      >
        <Icon :icon="icon" class="h-4 w-4 flex-shrink-0" :class="selected ? 'text-blue-600' : 'text-gray-400'" aria-hidden="true" />
        <span class="min-w-0 flex-1 truncate" :class="selected ? 'font-medium' : ''" :title="node.label">{{ node.label }}</span>
        <span v-if="node.kind === 'agent' && node.local === false" class="flex-shrink-0 rounded bg-gray-100 px-1 text-[10px] font-medium text-gray-500" :title="$t('memory.browse.shared_help')">{{ $t('memory.browse.shared') }}</span>
        <!-- Teams and orgs show their own runs; an agent's runs come from every place it works, counted on its page. -->
        <span v-if="node.count && (node.kind === 'team' || node.kind === 'org')" class="flex-shrink-0 text-xs text-gray-400">{{ node.count }}</span>
      </button>
    </div>
    <ul v-if="hasChildren && isOpen" class="mt-0.5 space-y-0.5">
      <MemoryOwnerTreeRow v-for="child in node.children" :key="child.key" :node="child" :depth="depth + 1" :selected-key="selectedKey" :open="open" :filtering="filtering" @select="(key) => $emit('select', key)" @toggle="(key) => $emit('toggle', key)" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import type { OwnerNode } from '~/stores/memoryBrowseStore';

defineOptions({ name: 'MemoryOwnerTreeRow' });
const props = defineProps<{ node: OwnerNode; depth: number; selectedKey: string; open: Record<string, boolean>; filtering: boolean }>();
defineEmits<{ select: [key: string]; toggle: [key: string] }>();

const selected = computed(() => props.selectedKey === props.node.key);
const hasChildren = computed(() => (props.node.children ?? []).length > 0);
const isOpen = computed(() => props.filtering || props.open[props.node.key] !== false);
const icon = computed(() => ({
  agent: 'heroicons:user',
  unattributed: 'heroicons:question-mark-circle',
  team: 'heroicons:user-group',
  org: 'heroicons:building-office-2',
  group: 'heroicons:folder',
}[props.node.kind]));
</script>
