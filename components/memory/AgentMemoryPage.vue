<template>
  <div class="flex min-h-0 flex-1 flex-col space-y-4" data-test="agent-memory-page">
    <!-- round 3 (the founder): one header row. Back and the agent's name on the left; the run filter (Episodic) and the
         Episodic / Semantic switch on the right. No ID line or copy button: the name says whose memory this is. -->
    <header class="flex flex-wrap items-center gap-x-4 gap-y-2.5 border-b border-gray-200 pb-3">
      <div class="flex min-w-0 flex-1 items-center gap-1.5">
        <button
          type="button"
          class="-ml-1.5 inline-flex flex-shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-sm font-medium text-gray-500 transition hover:bg-gray-200/60 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :aria-label="backLabel"
          :title="backLabel"
          data-test="memory-owner-back"
          @click="$emit('back')"
        >
          <Icon icon="heroicons:arrow-left-20-solid" class="h-4 w-4" aria-hidden="true" />
          <span class="max-w-[16rem] truncate">{{ backText }}</span>
        </button>
        <span class="flex-shrink-0 text-gray-300" aria-hidden="true">/</span>
        <h1 class="min-w-0 truncate text-lg font-semibold tracking-tight text-gray-900" :title="agentDefinitionId ?? name">{{ name }}</h1>
        <span v-if="subtitle" class="hidden min-w-0 truncate text-xs text-gray-500 lg:inline" data-test="agent-memory-places">{{ subtitle }}</span>
        <span v-if="imported" class="flex-shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">{{ $t('memory.components.memory.common.importedReadOnly') }}</span>
      </div>

      <div v-if="pane === 'episodic'" class="relative w-full sm:w-60">
        <Icon icon="heroicons:magnifying-glass-20-solid" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input v-model="filter" type="text" :placeholder="$t('memory.components.memory.AgentMemoryDetail.search_runs')" :aria-label="$t('memory.browse.filter_label')" class="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
      </div>

      <div class="flex w-full flex-shrink-0 rounded-lg bg-gray-200/75 p-0.5 sm:inline-flex sm:w-auto" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="pane === tab.id"
          class="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition focus:outline-none sm:flex-none sm:px-3.5 focus-visible:ring-2 focus-visible:ring-blue-500"
          :class="pane === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          :data-test="`agent-memory-tab-${tab.id}`"
          @click="$emit('changePane', tab.id)"
        >
          <!-- Below 640 px the short label ("Episodic", "Semantic") keeps both tabs on one line. -->
          <span class="sm:hidden">{{ tab.short }}</span><span class="hidden sm:inline">{{ tab.label }}</span>
          <span
            v-if="tab.id === 'episodic' && !browse.episodes.loading && browse.episodes.agentKey === episodesKey"
            class="rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none"
            :class="pane === tab.id ? 'bg-gray-100 text-gray-600' : 'text-gray-500'"
          >{{ browse.episodes.items.length }}</span>
        </button>
      </div>
    </header>

    <!-- Episodic memory: the agent's runs from every place it works, newest first. -->
    <template v-if="pane === 'episodic'">
      <div v-if="browse.episodes.loading && !visibleEpisodes.length" class="py-16 text-center text-sm text-gray-500">{{ $t('memory.components.memory.AgentMemoryDetail.loading_runs') }}</div>
      <div v-else-if="browse.episodes.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {{ browse.episodes.error }}
        <button class="ml-2 font-semibold underline" @click="$emit('retryEpisodes')">{{ $t('memory.results.retry') }}</button>
      </div>
      <div v-else-if="!browse.episodes.items.length" class="py-16 text-center text-sm text-gray-500">{{ $t('memory.agent.no_runs', { name }) }}</div>
      <div v-else-if="!visibleEpisodes.length" class="py-16 text-center text-sm text-gray-500">{{ $t('memory.components.memory.AgentMemoryDetail.no_runs_match_this_filter') }}</div>
      <div v-else class="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3" data-test="agent-episodes">
        <button v-for="episode in visibleEpisodes" :key="episode.key" class="flex flex-col justify-start rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-test="agent-episode" @click="$emit('openEpisode', episode)">
          <!-- round 3: no run ID line (it repeats the agent's name); the ID stays in the tooltip and the filter. -->
          <h3 class="break-words text-sm font-semibold text-gray-900" :title="episode.agentRunId">{{ episode.summary }}</h3>
          <p v-if="episode.placeName && showPlaces" class="mt-1.5 flex items-center gap-1 text-xs text-gray-600" data-test="agent-episode-place">
            <Icon :icon="episode.place === 'org' ? 'heroicons:building-office-2' : 'heroicons:user-group'" class="h-3.5 w-3.5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            <span class="truncate">{{ $t('memory.agent.in_place', { name: episode.placeName }) }}</span>
          </p>
          <!-- round 4: the workspace and the time share one line. -->
          <p v-if="episode.workspaceRootPath || episode.lastUpdatedAt" class="mt-1.5 flex min-w-0 items-baseline gap-2 text-xs text-gray-500">
            <span v-if="episode.workspaceRootPath" class="min-w-0 truncate" :title="episode.workspaceRootPath">{{ episode.workspaceRootPath }}</span>
            <span v-if="episode.lastUpdatedAt" class="ml-auto flex-shrink-0 text-gray-400">{{ formatTimestamp(episode.lastUpdatedAt) }}</span>
          </p>
        </button>
      </div>
    </template>

    <!-- Semantic memory: the agent's folder, read only, filling the remaining viewport height. -->
    <SemanticMemoryFolder v-else-if="agentDefinitionId" class="min-h-0 flex-1" :agent-definition-id="agentDefinitionId" :agent-name="name" :imported="imported" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import SemanticMemoryFolder from './SemanticMemoryFolder.vue';
import { useLocalization } from '~/composables/useLocalization';
import { useMemoryBrowseStore, type AgentEpisode } from '~/stores/memoryBrowseStore';
import { placesOf } from '~/prototype/memory-semantic/memoryOwnersFixture';

/**
 * semantic-memory-view-554 (design, round 3): one agent's memory, the same page wherever the agent is reached (Agents,
 * a team or an org). Episodic memory: its runs from every place, newest first; a run opens today's Work Journal /
 * Raw Traces inspector. Semantic memory: its folder. "Unattributed runs" has episodic memory only.
 */
export type AgentPane = 'episodic' | 'semantic';
/** backText: where Back goes, shown ("Memory" or the team or org); backLabel: its accessible name ("Back to …"). */
const props = defineProps<{ agentDefinitionId: string | null; name: string; pane: AgentPane; imported: boolean; backText: string; backLabel: string }>();
defineEmits<{ changePane: [pane: AgentPane]; openEpisode: [episode: AgentEpisode]; retryEpisodes: []; back: [] }>();

const { t, resolvedLocale } = useLocalization();
const browse = useMemoryBrowseStore();
const filter = ref('');
watch(() => props.agentDefinitionId, () => { filter.value = ''; });

const episodesKey = computed(() => props.agentDefinitionId ?? 'unattributed');
const tabs = computed(() => [
  { id: 'episodic' as const, label: t('memory.agent.episodic'), short: t('memory.agent.episodic_short') },
  ...(props.agentDefinitionId ? [{ id: 'semantic' as const, label: t('memory.agent.semantic'), short: t('memory.agent.semantic_short') }] : []),
]);

/** Team-local: "Belongs to <team>". Shared: "Also in <teams and orgs>". Unattributed: what the group is. */
const subtitle = computed(() => {
  if (!props.agentDefinitionId) return t('memory.agent.unattributed_note');
  const places = placesOf(props.agentDefinitionId);
  const home = places.find(place => place.local);
  // Reached through its own team, Back already names the team: no "Belongs to" repeating it.
  if (home) return home.name === props.backText ? '' : t('memory.agent.belongs_to', { name: home.name });
  const names = [...new Set(places.map(place => place.name))];
  return names.length ? t('memory.agent.also_in', { names: names.join(' · ') }) : '';
});

/** The place line only helps when the agent works in more than one place (standalone and in teams, or several teams). */
const showPlaces = computed(() => new Set(browse.episodes.items.map(episode => `${episode.place}:${episode.placeId ?? ''}`)).size > 1);

const visibleEpisodes = computed(() => {
  if (browse.episodes.agentKey !== episodesKey.value) return [];
  const cue = filter.value.trim().toLowerCase();
  if (!cue) return browse.episodes.items;
  return browse.episodes.items.filter(episode => [episode.summary, episode.agentRunId, episode.placeName ?? '', episode.workspaceRootPath ?? ''].some(value => value.toLowerCase().includes(cue)));
});

const formatTimestamp = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(resolvedLocale.value);
};
</script>
