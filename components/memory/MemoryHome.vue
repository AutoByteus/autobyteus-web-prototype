<template>
  <div class="mx-auto flex min-h-full max-w-7xl flex-col px-5 py-4 sm:px-7 sm:py-5">
    <template v-if="section === 'search'">
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <div class="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 shadow-2xs" role="tablist" :aria-label="$t('memory.page.title')">
          <button
            v-for="item in sections"
            :key="item.id"
            type="button"
            role="tab"
            :aria-selected="section === item.id"
            class="flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            :class="section === item.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            :data-test="`memory-section-${item.id}`"
            @click="$emit('changeSection', item.id)"
          >
            {{ item.label }}
            <template v-if="item.id === 'index' && indexBadge">
              <MemorySpinner v-if="indexBadge.spinner" class="h-3.5 w-3.5" :class="section === 'index' ? 'text-white' : 'text-blue-600'" />
              <span v-else class="h-2 w-2 rounded-full" :class="indexBadge.dot" aria-hidden="true" />
              <span v-if="indexBadge.text" class="text-xs font-semibold" :class="section === 'index' ? 'text-blue-100' : 'text-blue-600'" data-test="memory-index-tab-badge">{{ indexBadge.text }}</span>
            </template>
          </button>
        </div>
      </div>
      <div class="space-y-4">
        <MemorySearchPanel :show-notice="!resultsCarryCoverage" :centered="search.status === 'idle'" @search="(query) => $emit('search', query)" @open-index="$emit('changeSection', 'index')" />
        <MemorySearchResults
          v-if="search.status !== 'idle'"
          :query="search.query"
          :status="search.status"
          :outcome="search.outcome"
          :error="search.error"
          :coverage="search.coverage"
          @clear="$emit('clearSearch')"
          @retry="search.runSearch(search.query)"
          @open="(result, match) => $emit('openResult', result, match)"
        />
      </div>
    </template>

    <template v-else-if="section === 'index'">
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <div class="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 shadow-2xs" role="tablist" :aria-label="$t('memory.page.title')">
          <button
            v-for="item in sections"
            :key="item.id"
            type="button"
            role="tab"
            :aria-selected="section === item.id"
            class="flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            :class="section === item.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            :data-test="`memory-section-${item.id}`"
            @click="$emit('changeSection', item.id)"
          >
            {{ item.label }}
            <template v-if="item.id === 'index' && indexBadge">
              <MemorySpinner v-if="indexBadge.spinner" class="h-3.5 w-3.5" :class="section === 'index' ? 'text-white' : 'text-blue-600'" />
              <span v-else class="h-2 w-2 rounded-full" :class="indexBadge.dot" aria-hidden="true" />
              <span v-if="indexBadge.text" class="text-xs font-semibold" :class="section === 'index' ? 'text-blue-100' : 'text-blue-600'" data-test="memory-index-tab-badge">{{ indexBadge.text }}</span>
            </template>
          </button>
        </div>
      </div>
      <MemoryIndexPanel />
    </template>

    <!-- Browse shares the single top bar row with the Browse | Search | Index switcher so the header stays compact. -->
    <MemoryBrowse
      v-else
      class="flex min-h-0 flex-1 flex-col"
      @change-source="(key) => $emit('changeSource', key)"
      @open-episode="(episode, nodeKey) => $emit('openEpisode', episode, nodeKey)"
      @inspect-member="(kind, node, runId, member, nodeKey) => $emit('inspectMember', kind, node, runId, member, nodeKey)"
    >
      <template #sections>
        <div class="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 shadow-2xs" role="tablist" :aria-label="$t('memory.page.title')">
          <button
            v-for="item in sections"
            :key="item.id"
            type="button"
            role="tab"
            :aria-selected="section === item.id"
            class="flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            :class="section === item.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            :data-test="`memory-section-${item.id}`"
            @click="$emit('changeSection', item.id)"
          >
            {{ item.label }}
            <template v-if="item.id === 'index' && indexBadge">
              <MemorySpinner v-if="indexBadge.spinner" class="h-3.5 w-3.5" :class="section === 'index' ? 'text-white' : 'text-blue-600'" />
              <span v-else class="h-2 w-2 rounded-full" :class="indexBadge.dot" aria-hidden="true" />
              <span v-if="indexBadge.text" class="text-xs font-semibold" :class="section === 'index' ? 'text-blue-100' : 'text-blue-600'" data-test="memory-index-tab-badge">{{ indexBadge.text }}</span>
            </template>
          </button>
        </div>
      </template>
    </MemoryBrowse>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useMemoryExplorerStore, type MemoryHomeTab } from '~/stores/memoryExplorerStore';
import type { MemorySection } from '~/stores/memorySearchStore';
import type { AgentOrgWithMemorySummary, AgentTeamWithMemorySummary, AgentWithMemorySummary } from '~/types/memory';
import { useMemorySearchStore } from '~/stores/memorySearchStore';
import type { SearchMatch, SearchResult } from '~/types/memorySearch';
import MemoryBadges from './MemoryBadges.vue';
import MemoryBrowse from './MemoryBrowse.vue';
import type { AgentEpisode, OwnerNode } from '~/stores/memoryBrowseStore';
import type { CollaborationMemberMemoryTargetSummary } from '~/types/memory';
import MemorySpinner from './MemorySpinner.vue';
import MemorySearchPanel from './MemorySearchPanel.vue';
import MemorySearchResults from './MemorySearchResults.vue';
import MemoryIndexPanel from './MemoryIndexPanel.vue';
import { useMemoryIndexView } from '~/composables/useMemoryIndexView';
import { useLocalization } from '~/composables/useLocalization';
import { useSemanticMemoryStore } from '~/stores/semanticMemoryStore';
import type { SemanticMemoryFolder } from '~/types/semanticMemory';

defineProps<{ section: MemorySection }>();
const emit = defineEmits<{
  changeSection: [section: MemorySection];
  search: [query: string];
  clearSearch: [];
  openResult: [result: SearchResult, match: SearchMatch];
  changeTab: [tab: MemoryHomeTab];
  changeSource: [sourceKey: string];
  selectAgent: [agent: AgentWithMemorySummary];
  selectTeam: [team: AgentTeamWithMemorySummary];
  selectOrg: [org: AgentOrgWithMemorySummary];
  selectSemantic: [folder: SemanticMemoryFolder];
  openEpisode: [episode: AgentEpisode, nodeKey: string];
  inspectMember: [kind: 'team' | 'org', node: OwnerNode, runId: string, member: CollaborationMemberMemoryTargetSummary, nodeKey: string];
}>();

const { t, resolvedLocale } = useLocalization();
const { badge: indexBadge } = useMemoryIndexView();
const sections: Array<{ id: MemorySection; label: string }> = [
  { id: 'browse', label: t('memory.tabs.browse') },
  { id: 'search', label: t('memory.tabs.search') },
  { id: 'index', label: t('memory.tabs.index') },
];
const store = useMemoryExplorerStore();
const search = useMemorySearchStore();
const searchInput = ref('');
/** The results already say how much is covered, so the Search tab does not repeat it. */
const resultsCarryCoverage = computed(() => search.status === 'ready' && !!search.coverage && (search.coverage.textPct < 100 || search.coverage.meaningPct < 100));

const tabText: Record<MemoryHomeTab, { search: string; empty: string }> = {
  agents: { search: 'memory.components.memory.MemoryHome.search_agents', empty: 'memory.components.memory.MemoryHome.no_agent_memories_yet' },
  teams: { search: 'memory.components.memory.MemoryHome.search_agent_teams', empty: 'memory.components.memory.MemoryHome.no_team_memories_yet' },
  orgs: { search: 'memory.components.memory.MemoryHome.search_agent_orgs', empty: 'memory.components.memory.MemoryHome.no_org_memories_yet' },
  semantic: { search: 'memory.semantic.filter_placeholder', empty: 'memory.semantic.no_match' },
};

/** semantic-memory-view-554 (design): Browse → Semantic Memory, filtered on the page as you type. */
const semantic = useSemanticMemoryStore();
const semanticState = computed(() => ({
  loading: semantic.folders.loading,
  error: semantic.folders.error,
  entries: semantic.visibleFolders,
  search: semantic.folders.search,
  page: 1,
  totalPages: 1,
}));
/** The node has no semantic folder at all (not a filter that matches nothing). */
const semanticEmptyNode = computed(() => semantic.folders.loaded && !semantic.folders.loading && !semantic.folders.error && semantic.folders.entries.length === 0);
const fileCountLabel = (count: number) => (count === 0 ? t('memory.semantic.no_files') : count === 1 ? t('memory.semantic.file_count_one') : t('memory.semantic.file_count', { count }));

const activeState = computed(() => {
  if (store.homeTab === 'semantic') return semanticState.value;
  if (store.homeTab === 'agents') return store.agents;
  return store.homeTab === 'teams' ? store.teams : store.orgs;
});

watch(() => [store.homeTab, store.agents.search, store.teams.search, store.orgs.search, semantic.folders.search], () => {
  searchInput.value = activeState.value.search;
}, { immediate: true });

const browseTabs: Array<{ id: MemoryHomeTab; label: string }> = [
  { id: 'agents', label: t('memory.components.memory.MemoryHome.agents') },
  { id: 'teams', label: t('memory.components.memory.MemoryHome.agent_teams') },
  { id: 'orgs', label: t('memory.components.memory.MemoryHome.agent_orgs') },
  { id: 'semantic', label: t('memory.semantic.tab') },
];
const cardClass = 'flex flex-col justify-start rounded-lg border border-gray-200 bg-white p-5 text-left transition hover:border-gray-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500';
const countClass = 'flex-shrink-0 whitespace-nowrap rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600';

const onSourceChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  emit('changeSource', value);
};

const selectTab = async (tab: MemoryHomeTab) => {
  if (store.homeTab === tab) return;
  store.setHomeTab(tab);
  emit('changeTab', tab);
};

const applySearch = async () => {
  const search = searchInput.value.trim();
  if (store.homeTab === 'semantic') return semantic.setSearch(search);
  if (store.homeTab === 'agents') await store.setAgentsSearch(search);
  else if (store.homeTab === 'teams') await store.setTeamsSearch(search);
  else await store.setOrgsSearch(search);
};

/** The filter applies as you type, like the Skills page. */
let filterTimer: ReturnType<typeof setTimeout> | null = null;
watch(searchInput, (value) => {
  if (value.trim() === activeState.value.search) return;
  if (filterTimer) clearTimeout(filterTimer);
  filterTimer = setTimeout(() => { void applySearch(); }, 300);
});

const retry = async () => store.fetchHomeTab(store.homeTab);

const changePage = async (page: number) => store.changeHomePage(store.homeTab, page);

const formatTimestamp = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(resolvedLocale.value);
};
</script>
