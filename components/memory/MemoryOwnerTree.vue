<template>
  <nav :aria-label="$t('memory.browse.tree_label')" data-test="memory-owner-tree">
    <div v-for="group in groups" :key="group.key" class="mb-3 last:mb-0">
      <button
        type="button"
        class="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        :class="selectedKey === group.key ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
        :aria-current="selectedKey === group.key ? 'page' : undefined"
        :data-test="`memory-tree-group-${group.key}`"
        @click="$emit('select', group.key)"
      >
        <span>{{ groupLabel(group.key) }}</span>
        <span class="font-normal normal-case tracking-normal text-gray-400">{{ (group.children ?? []).length }}</span>
      </button>
      <p v-if="!(group.children ?? []).length && filtering" class="px-2 py-1 text-xs text-gray-400">{{ $t('memory.browse.no_match') }}</p>
      <ul class="mt-0.5 space-y-0.5">
        <MemoryOwnerTreeRow v-for="node in group.children" :key="node.key" :node="node" :depth="0" :selected-key="selectedKey" :open="open" :filtering="filtering" @select="(key) => $emit('select', key)" @toggle="toggle" />
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import MemoryOwnerTreeRow from './MemoryOwnerTreeRow.vue';
import { useLocalization } from '~/composables/useLocalization';
import type { OwnerNode } from '~/stores/memoryBrowseStore';

/**
 * semantic-memory-view-554 (design, round 3): Browse's tree of memory owners. Agents, Agent Teams (each with its
 * member agents) and Agent Orgs (each with its teams and agents). A group heading opens the group's overview cards;
 * a row opens that owner's page. Teams and orgs start open; while a filter is typed every match shows with its parents.
 */
defineProps<{ groups: OwnerNode[]; selectedKey: string; filtering: boolean }>();
defineEmits<{ select: [key: string] }>();

const { t } = useLocalization();
/** Closed rows (teams and orgs start open). */
const open = reactive<Record<string, boolean>>({});
const toggle = (key: string) => { open[key] = open[key] === false; };
const groupLabel = (key: string) => t(key === 'agents' ? 'memory.components.memory.MemoryHome.agents' : key === 'teams' ? 'memory.components.memory.MemoryHome.agent_teams' : 'memory.components.memory.MemoryHome.agent_orgs');
</script>
