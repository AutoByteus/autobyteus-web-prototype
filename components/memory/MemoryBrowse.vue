<template>
  <div class="flex flex-col gap-5 xl:flex-row xl:items-start" data-test="memory-browse">
    <!-- The tree of memory owners. Below 1280 px it sits above the page. -->
    <aside class="w-full flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white xl:sticky xl:top-8 xl:w-72">
      <div class="space-y-2 border-b border-gray-100 p-3">
        <div v-if="explorer.sources.length > 1" class="flex items-center gap-2">
          <label class="sr-only" for="memory-source-select">{{ $t('memory.components.memory.MemoryHome.memorySource') }}</label>
          <select id="memory-source-select" :value="explorer.selectedSource.key" class="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm" @change="$emit('changeSource', ($event.target as HTMLSelectElement).value)">
            <option v-for="source in explorer.sources" :key="source.key" :value="source.key">{{ source.label }}</option>
          </select>
          <span v-if="imported" class="flex-shrink-0 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">{{ $t('memory.components.memory.common.importedReadOnly') }}</span>
        </div>
        <div class="relative">
          <Icon icon="heroicons:magnifying-glass-20-solid" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input v-model="filter" type="text" :placeholder="$t('memory.browse.filter_tree')" :aria-label="$t('memory.browse.filter_label')" class="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" data-test="memory-tree-filter" />
        </div>
      </div>
      <div class="max-h-[40vh] overflow-y-auto p-2 xl:max-h-[calc(100vh-12rem)]">
        <div v-if="browse.loading && !browse.loaded" class="px-2 py-6 text-center text-sm text-gray-500">{{ $t('memory.components.memory.MemoryHome.loading_memory_catalog') }}</div>
        <div v-else-if="browse.error" class="m-1 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {{ browse.error }}
          <button class="ml-1 font-semibold underline" @click="load">{{ $t('memory.results.retry') }}</button>
        </div>
        <MemoryOwnerTree v-else :groups="browse.visibleTree" :selected-key="nodeKey" :filtering="!!filter.trim()" @select="select" />
      </div>
    </aside>

    <section class="min-w-0 flex-1">
      <!-- A group heading: its overview cards (today's Browse cards). -->
      <template v-if="node?.kind === 'group'">
        <div v-if="!(node.children ?? []).length" class="py-16 text-center text-sm text-gray-500">{{ filter.trim() ? $t('memory.browse.no_match') : $t(emptyText[node.key]) }}</div>
        <div v-else class="grid gap-4 md:grid-cols-2 2xl:grid-cols-3" :data-test="`memory-group-cards-${node.key}`">
          <button v-for="child in node.children" :key="child.key" :class="cardClass" @click="select(child.key)">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h2 class="break-words text-base font-semibold text-gray-900">{{ child.label }}</h2>
                <p class="mt-1 break-all font-mono text-xs text-gray-500">{{ child.kind === 'unattributed' ? 'unattributed' : child.id }}</p>
              </div>
              <span v-if="child.count && (child.kind === 'team' || child.kind === 'org')" :class="countClass">{{ child.count }} runs</span>
            </div>
            <p v-if="child.kind === 'team' || child.kind === 'org'" class="mt-3 text-xs text-gray-500">{{ (child.children ?? []).length }} {{ $t('memory.components.memory.MemoryHome.members') }}<span v-if="latestOf(child)"> · {{ formatTimestamp(latestOf(child)) }}</span></p>
            <p v-else-if="latestOf(child)" class="mt-3 text-xs text-gray-500">{{ formatTimestamp(latestOf(child)) }}</p>
          </button>
        </div>
      </template>

      <AgentMemoryPage
        v-else-if="node && (node.kind === 'agent' || node.kind === 'unattributed')"
        :agent-definition-id="node.kind === 'agent' ? node.id : null"
        :name="node.label"
        :pane="pane === 'semantic' && node.kind === 'agent' ? 'semantic' : 'episodic'"
        :imported="imported"
        @change-pane="(next) => select(nodeKey, next)"
        @open-episode="(episode) => $emit('openEpisode', episode, nodeKey)"
        @retry-episodes="loadEpisodes"
      />

      <GroupMemoryPage
        v-else-if="node && (node.kind === 'team' || node.kind === 'org')"
        :node="node"
        :pane="pane === 'runs' ? 'runs' : 'members'"
        :imported="imported"
        @change-pane="(next) => select(nodeKey, next)"
        @select="select"
        @search-runs="searchRuns"
        @change-runs-page="changeRunsPage"
        @retry-runs="loadRuns"
        @inspect-member="(runId, member) => $emit('inspectMember', node!.kind as 'team' | 'org', node!, runId, member, nodeKey)"
      />

      <div v-else-if="browse.loaded" class="py-16 text-center text-sm text-gray-500">{{ $t('memory.browse.not_found') }}</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import MemoryOwnerTree from './MemoryOwnerTree.vue';
import AgentMemoryPage from './AgentMemoryPage.vue';
import GroupMemoryPage from './GroupMemoryPage.vue';
import { useLocalization } from '~/composables/useLocalization';
import { useMemoryBrowseStore, type AgentEpisode, type OwnerNode } from '~/stores/memoryBrowseStore';
import { useMemoryExplorerStore } from '~/stores/memoryExplorerStore';
import type { CollaborationMemberMemoryTargetSummary } from '~/types/memory';

/**
 * semantic-memory-view-554 (design, round 3): Memory → Browse. A tree of memory owners on the left (Agents, Agent
 * Teams, Agent Orgs) and the selected owner's memory on the right. The selection and its tab are in the address
 * (`node`, `pane`), so Back from a run's Work Journal returns to the same place.
 */
defineEmits<{
  changeSource: [sourceKey: string];
  openEpisode: [episode: AgentEpisode, nodeKey: string];
  inspectMember: [kind: 'team' | 'org', node: OwnerNode, runId: string, member: CollaborationMemberMemoryTargetSummary, nodeKey: string];
}>();

const route = useRoute();
const router = useRouter();
const { resolvedLocale } = useLocalization();
const browse = useMemoryBrowseStore();
const explorer = useMemoryExplorerStore();

const imported = computed(() => explorer.isImportedSource);
const queryValue = (key: string) => { const value = route.query[key]; return (Array.isArray(value) ? value[0] : value) ?? undefined; };
const nodeKey = computed(() => String(queryValue('node') ?? 'agents'));
const pane = computed(() => String(queryValue('pane') ?? ''));

const filter = ref(browse.filter);
watch(filter, value => browse.setFilter(value));

const findNode = (nodes: OwnerNode[], key: string): OwnerNode | null => {
  for (const node of nodes) {
    if (node.key === key) return node;
    const found = findNode(node.children ?? [], key);
    if (found) return found;
  }
  return null;
};
/** The selected owner (from the whole tree, so a filter never hides the open page); a group from the filtered tree. */
const node = computed(() => {
  const key = nodeKey.value;
  if (key === 'agents' || key === 'teams' || key === 'orgs') return findNode(browse.visibleTree, key);
  return findNode(browse.tree, key);
});

const select = (key: string, nextPane?: string) => router.push({
  path: '/memory',
  query: Object.fromEntries(Object.entries({ source: queryValue('source'), view: 'home', section: 'browse', node: key, pane: nextPane }).filter(([, value]) => value)) as Record<string, string>,
});

const load = () => browse.loadOwners(explorer.selectedSourceInput);
const loadEpisodes = () => {
  const current = node.value;
  if (current?.kind === 'agent') void browse.loadEpisodes(current.id, explorer.selectedSourceInput);
  else if (current?.kind === 'unattributed') void browse.loadEpisodes(null, explorer.selectedSourceInput);
};
const loadRuns = () => {
  const current = node.value;
  if (current?.kind === 'team') void explorer.fetchTeamRuns(current.id);
  else if (current?.kind === 'org') void explorer.fetchOrgRuns(current.id);
};
const searchRuns = (search: string) => {
  const current = node.value;
  if (current?.kind === 'team') void explorer.setTeamRunsSearch(current.id, search);
  else if (current?.kind === 'org') void explorer.setOrgRunsSearch(current.id, search);
};
const changeRunsPage = (page: number) => {
  const current = node.value;
  if (current?.kind === 'team') void explorer.changeTeamRunsPage(current.id, page);
  else if (current?.kind === 'org') void explorer.changeOrgRunsPage(current.id, page);
};

watch(() => explorer.selectedSource.key, () => { void load(); }, { immediate: true });
/** Each owner page loads what it shows: an agent's episodes, a team's or org's runs. */
watch(() => [node.value?.key, node.value?.kind, pane.value, explorer.selectedSource.key, browse.loaded] as const, () => {
  const current = node.value;
  if (!current) return;
  if (current.kind === 'agent' || current.kind === 'unattributed') loadEpisodes();
  if ((current.kind === 'team' || current.kind === 'org') && pane.value === 'runs') {
    if (current.kind === 'team') explorer.setSelectedTeamFromRoute(current.id, current.label);
    else explorer.setSelectedOrgFromRoute(current.id, current.label);
    loadRuns();
  }
}, { immediate: true });

const emptyText: Record<string, string> = {
  agents: 'memory.components.memory.MemoryHome.no_agent_memories_yet',
  teams: 'memory.components.memory.MemoryHome.no_team_memories_yet',
  orgs: 'memory.components.memory.MemoryHome.no_org_memories_yet',
};
const cardClass = 'flex flex-col justify-start rounded-lg border border-gray-200 bg-white p-5 text-left transition hover:border-gray-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500';
const countClass = 'flex-shrink-0 whitespace-nowrap rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600';

const latestOf = (child: OwnerNode): string | null => {
  if (child.kind === 'team') return browse.teams.find(team => team.teamDefinitionId === child.id)?.latestMemoryAt ?? null;
  if (child.kind === 'org') return browse.orgs.find(org => org.orgDefinitionId === child.id)?.latestMemoryAt ?? null;
  if (child.kind === 'unattributed') return browse.agents.find(agent => agent.attribution === 'UNATTRIBUTED')?.latestMemoryAt ?? null;
  return browse.agents.find(agent => agent.agentDefinitionId === child.id)?.latestMemoryAt ?? null;
};
const formatTimestamp = (value: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(resolvedLocale.value);
};
</script>
