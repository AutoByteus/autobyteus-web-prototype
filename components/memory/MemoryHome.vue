<template>
  <div class="mx-auto max-w-6xl space-y-4 p-6">
    <nav class="flex gap-1 border-b border-gray-200" role="tablist" :aria-label="$t('memory.page.title')">
      <button
        v-for="item in sections"
        :key="item.id"
        type="button"
        role="tab"
        :aria-selected="section === item.id"
        class="-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        :class="section === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        :data-test="`memory-section-${item.id}`"
        @click="$emit('changeSection', item.id)"
      >
        {{ item.label }}
        <template v-if="item.id === 'index' && indexBadge">
          <Icon v-if="indexBadge.spinner" icon="svg-spinners:ring-resize" class="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
          <span v-else class="h-2 w-2 rounded-full" :class="indexBadge.dot" aria-hidden="true" />
          <span v-if="indexBadge.text" class="text-xs font-semibold text-blue-600" data-test="memory-index-tab-badge">{{ indexBadge.text }}</span>
        </template>
      </button>
    </nav>

    <template v-if="section === 'search'">
      <MemorySearchPanel @search="(query) => $emit('search', query)" @open-index="$emit('changeSection', 'index')" />
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
    </template>

    <MemoryIndexPanel v-else-if="section === 'index'" />

    <section v-else class="rounded-xl border border-gray-200 bg-white shadow-sm" data-test="memory-browse">
      <div class="border-b border-gray-100 p-4">
        <div v-if="store.sources.length > 1" class="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <label class="text-xs font-semibold uppercase tracking-wide text-slate-500" for="memory-source-select">{{ $t('memory.components.memory.MemoryHome.memorySource') }}</label>
              <select id="memory-source-select" :value="store.selectedSource.key" class="mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" @change="onSourceChange">
                <option v-for="source in store.sources" :key="source.key" :value="source.key">{{ source.label }}</option>
              </select>
            </div>
            <div class="text-sm text-slate-600">
              <span v-if="store.selectedSource.readOnly" class="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">{{ $t('memory.components.memory.common.importedReadOnly') }}</span>
              <span v-else class="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">{{ $t('memory.components.memory.MemoryHome.localRunnableMemory') }}</span>
              <p v-if="store.selectedSource.lastImportedAt" class="mt-1 text-xs text-slate-500">{{ $t('memory.components.memory.MemoryHome.lastImported', { timestamp: formatTimestamp(store.selectedSource.lastImportedAt) }) }}</p>
            </div>
          </div>
          <p v-if="store.sourceError" class="mt-2 text-xs text-red-600">{{ store.sourceError }}</p>
        </div>
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-wrap gap-2 lg:flex-shrink-0">
            <button class="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold" :class="tabClass('agents')" @click="selectTab('agents')">{{ $t('memory.components.memory.MemoryHome.agents') }}</button>
            <button class="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold" :class="tabClass('teams')" @click="selectTab('teams')">{{ $t('memory.components.memory.MemoryHome.agent_teams') }}</button>
            <button class="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold" :class="tabClass('orgs')" @click="selectTab('orgs')">{{ $t('memory.components.memory.MemoryHome.agent_orgs') }}</button>
          </div>
          <div class="flex min-w-0 flex-1 gap-2 lg:max-w-md">
            <input v-model="searchInput" type="text" :placeholder="$t(tabText[store.homeTab].search)" class="w-full min-w-0 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" @keyup.enter="applySearch" />
            <button class="flex-shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800" @click="applySearch">{{ $t('memory.browse.filter_button') }}</button>
          </div>
        </div>
      </div>

      <div class="p-4">
        <div v-if="activeState.loading && activeState.entries.length === 0" class="py-12 text-center text-sm text-gray-500">{{ $t('memory.components.memory.MemoryHome.loading_memory_catalog') }}</div>
        <div v-else-if="activeState.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {{ activeState.error }}
          <button class="ml-2 font-semibold underline" @click="retry">Retry</button>
        </div>
        <div v-else-if="activeState.entries.length === 0" class="py-12 text-center text-sm text-gray-500">
          {{ $t(tabText[store.homeTab].empty) }}
        </div>

        <div v-else class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <template v-if="store.homeTab === 'agents'">
          <button v-for="agent in store.agents.entries" :key="agent.stableId" class="flex flex-col justify-start rounded-xl border border-gray-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/40" @click="$emit('selectAgent', agent)">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h2 class="font-semibold text-gray-900">{{ agent.displayName }}</h2>
                <p class="mt-1 font-mono text-xs text-gray-500">{{ agent.stableId }}</p>
              </div>
              <span class="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">{{ agent.runCount }} runs</span>
            </div>
            <p v-if="agent.latestMemoryAt" class="mt-3 text-xs text-gray-500">{{ $t('memory.components.memory.MemoryHome.updated') }} {{ formatTimestamp(agent.latestMemoryAt) }}</p>
            <MemoryBadges class="mt-3" :memory="agent.memory" />
          </button>
          </template>

          <template v-else-if="store.homeTab === 'teams'">
          <button v-for="team in store.teams.entries" :key="team.teamDefinitionId" class="flex flex-col justify-start rounded-xl border border-gray-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/40" @click="$emit('selectTeam', team)">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h2 class="font-semibold text-gray-900">{{ team.teamDefinitionName }}</h2>
                <p class="mt-1 font-mono text-xs text-gray-500">{{ team.teamDefinitionId }}</p>
                <p v-if="team.isTaskTeam" class="mt-1.5 inline-flex items-center gap-1 rounded-[0.2rem] border border-dashed border-indigo-300 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-700" :title="team.startedByAgentName ? $t('memory.browse.task_team_started_by', { name: team.startedByAgentName }) : undefined" data-test="memory-task-team-tag">
                  <Icon icon="heroicons:user-group-20-solid" class="h-3 w-3" aria-hidden="true" />{{ $t('memory.browse.task_team') }}
                </p>
              </div>
              <span class="flex-shrink-0 whitespace-nowrap rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">{{ team.teamRunCount }} runs</span>
            </div>
            <p class="mt-3 text-xs text-gray-500">{{ team.memberMemoryCount }} {{ $t('memory.components.memory.MemoryHome.members') }}<span v-if="team.latestMemoryAt"> · {{ $t('memory.components.memory.MemoryHome.updated') }} {{ formatTimestamp(team.latestMemoryAt) }}</span></p>
            <MemoryBadges class="mt-3" :memory="team.memory" />
          </button>
          </template>

          <template v-else>
          <button v-for="org in store.orgs.entries" :key="org.orgDefinitionId" class="flex flex-col justify-start rounded-xl border border-gray-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/40" @click="$emit('selectOrg', org)">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h2 class="font-semibold text-gray-900">{{ org.orgDefinitionName }}</h2>
                <p class="mt-1 font-mono text-xs text-gray-500">{{ org.orgDefinitionId }}</p>
              </div>
              <span class="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">{{ org.orgRunCount }} runs</span>
            </div>
            <p class="mt-3 text-xs text-gray-500">{{ org.memberMemoryCount }} {{ $t('memory.components.memory.MemoryHome.members') }}<span v-if="org.latestMemoryAt"> · {{ $t('memory.components.memory.MemoryHome.updated') }} {{ formatTimestamp(org.latestMemoryAt) }}</span></p>
            <MemoryBadges class="mt-3" :memory="org.memory" />
          </button>
          </template>
        </div>
      </div>

      <footer class="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
        <button class="rounded-md border border-gray-200 px-3 py-1 disabled:opacity-50" :disabled="activeState.page <= 1" @click="changePage(activeState.page - 1)">Prev</button>
        <span>Page {{ activeState.page }} / {{ activeState.totalPages }}</span>
        <button class="rounded-md border border-gray-200 px-3 py-1 disabled:opacity-50" :disabled="activeState.page >= activeState.totalPages" @click="changePage(activeState.page + 1)">Next</button>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useMemoryExplorerStore, type MemoryHomeTab } from '~/stores/memoryExplorerStore';
import type { MemorySection } from '~/stores/memorySearchStore';
import type { AgentOrgWithMemorySummary, AgentTeamWithMemorySummary, AgentWithMemorySummary } from '~/types/memory';
import { useMemorySearchStore } from '~/stores/memorySearchStore';
import type { SearchMatch, SearchResult } from '~/prototype/memory-search/memoryDesignFixture';
import MemoryBadges from './MemoryBadges.vue';
import MemorySearchPanel from './MemorySearchPanel.vue';
import MemorySearchResults from './MemorySearchResults.vue';
import MemoryIndexPanel from './MemoryIndexPanel.vue';
import { useMemoryIndexView } from '~/composables/useMemoryIndexView';
import { useLocalization } from '~/composables/useLocalization';

const props = defineProps<{ section: MemorySection }>();
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
}>();

const { t } = useLocalization();
const { badge: indexBadge } = useMemoryIndexView();
const sections: Array<{ id: MemorySection; label: string }> = [
  { id: 'browse', label: t('memory.tabs.browse') },
  { id: 'search', label: t('memory.tabs.search') },
  { id: 'index', label: t('memory.tabs.index') },
];
const store = useMemoryExplorerStore();
const search = useMemorySearchStore();
const searchInput = ref('');

const tabText: Record<MemoryHomeTab, { search: string; empty: string }> = {
  agents: { search: 'memory.components.memory.MemoryHome.search_agents', empty: 'memory.components.memory.MemoryHome.no_agent_memories_yet' },
  teams: { search: 'memory.components.memory.MemoryHome.search_agent_teams', empty: 'memory.components.memory.MemoryHome.no_team_memories_yet' },
  orgs: { search: 'memory.components.memory.MemoryHome.search_agent_orgs', empty: 'memory.components.memory.MemoryHome.no_org_memories_yet' },
};

const activeState = computed(() => {
  if (store.homeTab === 'agents') return store.agents;
  return store.homeTab === 'teams' ? store.teams : store.orgs;
});

watch(() => [store.homeTab, store.agents.search, store.teams.search, store.orgs.search], () => {
  searchInput.value = activeState.value.search;
}, { immediate: true });

const tabClass = (tab: MemoryHomeTab) => store.homeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';

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
  if (store.homeTab === 'agents') await store.setAgentsSearch(search);
  else if (store.homeTab === 'teams') await store.setTeamsSearch(search);
  else await store.setOrgsSearch(search);
};

const retry = async () => store.fetchHomeTab(store.homeTab);

const changePage = async (page: number) => store.changeHomePage(store.homeTab, page);

const formatTimestamp = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};
</script>
