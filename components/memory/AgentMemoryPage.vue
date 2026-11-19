<template>
  <div class="space-y-5" data-test="agent-memory-page">
    <header>
      <div class="flex flex-wrap items-center gap-3">
        <h1 class="break-words text-xl font-semibold text-gray-900">{{ name }}</h1>
        <span v-if="imported" class="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">{{ $t('memory.components.memory.common.importedReadOnly') }}</span>
      </div>
      <p v-if="subtitle" class="mt-1 text-sm text-gray-500" data-test="agent-memory-places">{{ subtitle }}</p>
      <p v-if="agentDefinitionId" class="mt-0.5 break-all font-mono text-xs text-gray-400">{{ agentDefinitionId }}</p>
    </header>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="inline-flex rounded-lg border border-gray-200 bg-white p-1" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="pane === tab.id"
          class="flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :class="pane === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          :data-test="`agent-memory-tab-${tab.id}`"
          @click="$emit('changePane', tab.id)"
        >
          {{ tab.label }}
          <span v-if="tab.id === 'episodic' && !browse.episodes.loading && browse.episodes.agentKey === episodesKey" class="text-xs font-semibold" :class="pane === tab.id ? 'text-blue-100' : 'text-gray-400'">{{ browse.episodes.items.length }}</span>
        </button>
      </div>
      <div v-if="pane === 'episodic'" class="relative w-full sm:w-80">
        <Icon icon="heroicons:magnifying-glass-20-solid" class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input v-model="filter" type="text" :placeholder="$t('memory.components.memory.AgentMemoryDetail.search_runs')" :aria-label="$t('memory.browse.filter_label')" class="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
      </div>
    </div>

    <!-- Episodic memory: the agent's runs from every place it works, newest first. -->
    <template v-if="pane === 'episodic'">
      <div v-if="browse.episodes.loading && !visibleEpisodes.length" class="py-16 text-center text-sm text-gray-500">{{ $t('memory.components.memory.AgentMemoryDetail.loading_runs') }}</div>
      <div v-else-if="browse.episodes.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {{ browse.episodes.error }}
        <button class="ml-2 font-semibold underline" @click="$emit('retryEpisodes')">{{ $t('memory.results.retry') }}</button>
      </div>
      <div v-else-if="!browse.episodes.items.length" class="py-16 text-center text-sm text-gray-500">{{ $t('memory.agent.no_runs', { name }) }}</div>
      <div v-else-if="!visibleEpisodes.length" class="py-16 text-center text-sm text-gray-500">{{ $t('memory.components.memory.AgentMemoryDetail.no_runs_match_this_filter') }}</div>
      <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-test="agent-episodes">
        <button v-for="episode in visibleEpisodes" :key="episode.key" class="flex flex-col justify-start rounded-lg border border-gray-200 bg-white p-5 text-left transition hover:border-gray-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-test="agent-episode" @click="$emit('openEpisode', episode)">
          <h3 class="break-words text-base font-semibold text-gray-900">{{ episode.summary }}</h3>
          <p class="mt-1 break-all font-mono text-xs text-gray-500">{{ episode.agentRunId }}</p>
          <p v-if="episode.placeName && showPlaces" class="mt-1 flex items-center gap-1 text-xs text-gray-600" data-test="agent-episode-place">
            <Icon :icon="episode.place === 'org' ? 'heroicons:building-office-2' : 'heroicons:user-group'" class="h-3.5 w-3.5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            <span class="truncate">{{ $t('memory.agent.in_place', { name: episode.placeName }) }}</span>
          </p>
          <p v-if="episode.workspaceRootPath" class="mt-0.5 break-all text-xs text-gray-500">{{ episode.workspaceRootPath }}</p>
          <p v-if="episode.lastUpdatedAt" class="mt-3 text-xs text-gray-500">{{ formatTimestamp(episode.lastUpdatedAt) }}</p>
        </button>
      </div>
    </template>

    <!-- Semantic memory: the agent's folder (round 2), read only. -->
    <SemanticMemoryFolder v-else-if="agentDefinitionId" :agent-definition-id="agentDefinitionId" :agent-name="name" :imported="imported" />
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
const props = defineProps<{ agentDefinitionId: string | null; name: string; pane: AgentPane; imported: boolean }>();
defineEmits<{ changePane: [pane: AgentPane]; openEpisode: [episode: AgentEpisode]; retryEpisodes: [] }>();

const { t, resolvedLocale } = useLocalization();
const browse = useMemoryBrowseStore();
const filter = ref('');
watch(() => props.agentDefinitionId, () => { filter.value = ''; });

const episodesKey = computed(() => props.agentDefinitionId ?? 'unattributed');
const tabs = computed(() => [
  { id: 'episodic' as const, label: t('memory.agent.episodic') },
  ...(props.agentDefinitionId ? [{ id: 'semantic' as const, label: t('memory.agent.semantic') }] : []),
]);

/** Team-local: "Belongs to <team>". Shared: "Also in <teams and orgs>". Unattributed: what the group is. */
const subtitle = computed(() => {
  if (!props.agentDefinitionId) return t('memory.agent.unattributed_note');
  const places = placesOf(props.agentDefinitionId);
  const home = places.find(place => place.local);
  if (home) return t('memory.agent.belongs_to', { name: home.name });
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
