<template>
  <div class="flex min-h-0 flex-1 flex-col space-y-4" data-test="memory-browse">
    <!-- Top-level Browse views (Global, Agents, Agent Teams, Agent Orgs) share one balanced top bar with Browse | Search | Index. -->
    <template v-if="nodeKey === 'global' || !node || node.kind === 'group'">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3">
          <slot name="sections" />
          <span class="hidden h-5 w-px bg-gray-200 sm:inline-block" aria-hidden="true" />
          <div class="flex flex-wrap items-center gap-1" role="tablist">
            <button
              v-for="tab in groupTabs"
              :key="tab.key"
              type="button"
              role="tab"
              :aria-selected="nodeKey === tab.key"
              class="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :class="nodeKey === tab.key ? 'bg-gray-200/80 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              :data-test="`memory-browse-tab-${tab.key}`"
              :title="tab.key === 'global' ? $t('memory.global.subtitle') : undefined"
              @click="select(tab.key)"
            >{{ $t(tab.label) }}</button>
          </div>
        </div>
        <div v-if="explorer.sources.length > 1" class="flex items-center gap-2">
          <label class="sr-only" for="memory-source-select">{{ $t('memory.components.memory.MemoryHome.memorySource') }}</label>
          <select id="memory-source-select" :value="explorer.selectedSource.key" class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm" @change="$emit('changeSource', ($event.target as HTMLSelectElement).value)">
            <option v-for="source in explorer.sources" :key="source.key" :value="source.key">{{ source.label }}</option>
          </select>
          <span v-if="imported" class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">{{ $t('memory.components.memory.common.importedReadOnly') }}</span>
        </div>
      </div>

      <!-- Global memory. round 4 (the founder: only what is needed): no title row; the selected Global tab says where
           you are, and its tooltip says what Global memory is. The heading stays for screen readers. -->
      <div v-if="nodeKey === 'global'" class="flex min-h-0 flex-1 flex-col" data-test="global-memory-page">
        <h1 class="sr-only">{{ $t('memory.global.title') }}</h1>
        <SemanticMemoryFolder class="min-h-0 flex-1" :agent-definition-id="GLOBAL_SEMANTIC_ID" :agent-name="$t('memory.global.title')" :imported="imported" global />
      </div>
      <div v-else-if="browse.loading && !browse.loaded" class="py-16 text-center text-sm text-gray-500">{{ $t('memory.components.memory.MemoryHome.loading_memory_catalog') }}</div>
      <div v-else-if="browse.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {{ browse.error }}
        <button class="ml-2 font-semibold underline" @click="load">{{ $t('memory.results.retry') }}</button>
      </div>
      <template v-else-if="node">
        <div v-if="!(node.children ?? []).length" class="py-16 text-center text-sm text-gray-500">{{ $t(emptyText[node.key]) }}</div>
        <div v-else class="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3" :data-test="`memory-group-cards-${node.key}`">
          <button v-for="child in node.children" :key="child.key" :class="cardClass" data-test="memory-owner-card" @click="select(child.key)">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <h2 class="truncate text-sm font-semibold text-gray-900" :title="child.kind === 'unattributed' ? child.label : child.id">{{ child.label }}</h2>
              </div>
              <span v-if="child.count && (child.kind === 'team' || child.kind === 'org')" :class="countClass">{{ child.count }} runs</span>
            </div>
            <p v-if="child.kind === 'team' || child.kind === 'org'" class="mt-2.5 text-xs text-gray-500">{{ (child.children ?? []).length }} {{ $t('memory.components.memory.MemoryHome.members') }}<span v-if="latestOf(child)"> · {{ formatTimestamp(latestOf(child)) }}</span></p>
            <p v-else-if="latestOf(child)" class="mt-2.5 text-xs text-gray-500">{{ formatTimestamp(latestOf(child)) }}</p>
          </button>
        </div>
      </template>
    </template>

    <!-- An owner's page is its own page (rounds 2–3, the founder): no Browse | Search | Index; Back, the owner's name and
         its switch share the page's one header row. -->
    <template v-else>
      <AgentMemoryPage
        v-if="node && (node.kind === 'agent' || node.kind === 'unattributed')"
        class="min-h-0 flex-1"
        :agent-definition-id="node.kind === 'agent' ? node.id : null"
        :name="node.label"
        :pane="pane === 'semantic' && node.kind === 'agent' ? 'semantic' : 'episodic'"
        :imported="imported"
        :back-text="backText"
        :back-label="backLabel"
        @back="select(parentKey)"
        @change-pane="(next) => select(nodeKey, next)"
        @open-episode="(episode) => $emit('openEpisode', episode, nodeKey)"
        @retry-episodes="loadEpisodes"
      />

      <GroupMemoryPage
        v-else-if="node && (node.kind === 'team' || node.kind === 'org')"
        class="min-h-0 flex-1"
        :node="node"
        :pane="pane === 'runs' ? 'runs' : 'members'"
        :imported="imported"
        :back-text="backText"
        :back-label="backLabel"
        @back="select(parentKey)"
        @change-pane="(next) => select(nodeKey, next)"
        @select="select"
        @search-runs="searchRuns"
        @change-runs-page="changeRunsPage"
        @retry-runs="loadRuns"
        @inspect-member="(runId, member) => $emit('inspectMember', node!.kind as 'team' | 'org', node!, runId, member, nodeKey)"
      />

      <div v-else-if="browse.loaded" class="py-16 text-center text-sm text-gray-500">{{ $t('memory.browse.not_found') }}</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AgentMemoryPage from './AgentMemoryPage.vue';
import GroupMemoryPage from './GroupMemoryPage.vue';
import SemanticMemoryFolder from './SemanticMemoryFolder.vue';
import { GLOBAL_SEMANTIC_ID } from '~/prototype/memory-semantic/semanticMemoryFixture';
import { useLocalization } from '~/composables/useLocalization';
import { useMemoryBrowseStore, type AgentEpisode, type OwnerNode } from '~/stores/memoryBrowseStore';
import { useMemoryExplorerStore } from '~/stores/memoryExplorerStore';
import type { CollaborationMemberMemoryTargetSummary } from '~/types/memory';

/**
 * semantic-memory-view-554 (design, round 4): Memory → Browse, organised by memory owner. Tabs Agents / Agent Teams /
 * Agent Orgs with their cards (Global, first since round 5, has semantic memory only). An agent card
 * opens the agent's page (Episodic and Semantic memory); a team or org card opens its page (Members and Runs), whose
 * members open their own pages. The open owner and its tab are in the address (`node`, `pane`), so Back from a run's
 * Work Journal returns to the same place.
 */
defineEmits<{
  changeSource: [sourceKey: string];
  openEpisode: [episode: AgentEpisode, nodeKey: string];
  inspectMember: [kind: 'team' | 'org', node: OwnerNode, runId: string, member: CollaborationMemberMemoryTargetSummary, nodeKey: string];
}>();

const route = useRoute();
const router = useRouter();
const { t, resolvedLocale } = useLocalization();
const browse = useMemoryBrowseStore();
const explorer = useMemoryExplorerStore();

const imported = computed(() => explorer.isImportedSource);
const queryValue = (key: string) => { const value = route.query[key]; return (Array.isArray(value) ? value[0] : value) ?? undefined; };
const nodeKey = computed(() => String(queryValue('node') ?? 'agents'));
const pane = computed(() => String(queryValue('pane') ?? ''));

const groupTabs = [
  { key: 'global', label: 'memory.global.tab' },
  { key: 'agents', label: 'memory.components.memory.MemoryHome.agents' },
  { key: 'teams', label: 'memory.components.memory.MemoryHome.agent_teams' },
  { key: 'orgs', label: 'memory.components.memory.MemoryHome.agent_orgs' },
];

const findNode = (nodes: OwnerNode[], key: string): OwnerNode | null => {
  for (const node of nodes) {
    if (node.key === key) return node;
    const found = findNode(node.children ?? [], key);
    if (found) return found;
  }
  return null;
};
const node = computed(() => findNode(browse.tree, nodeKey.value));
/** The card an owner page was opened from: its group's tab, or the team or org it was reached through. */
const parentKey = computed(() => (nodeKey.value.includes('/') ? nodeKey.value.slice(0, nodeKey.value.lastIndexOf('/')) : 'agents'));
/** Where Back goes, as the header shows it: "Memory" from a top-level tab, else the team's or org's name. */
const backText = computed(() => {
  const parent = parentKey.value;
  if (parent === 'agents' || parent === 'teams' || parent === 'orgs') return t('memory.page.title');
  return findNode(browse.tree, parent)?.label ?? '';
});
const backLabel = computed(() => {
  const parent = parentKey.value;
  if (parent === 'agents' || parent === 'teams' || parent === 'orgs') return t('memory.components.memory.AgentMemoryDetail.back_to_memory');
  return t('memory.semantic.back_to', { name: findNode(browse.tree, parent)?.label ?? '' });
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
const cardClass = 'flex flex-col justify-start rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500';
const countClass = 'flex-shrink-0 whitespace-nowrap rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600';

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
