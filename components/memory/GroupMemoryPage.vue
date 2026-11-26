<template>
  <div class="space-y-4" data-test="group-memory-page">
    <!-- round 3 (the founder): one header row, like an agent's page. Back and the team's or org's name on the left;
         Members / Runs on the right. No ID line or copy button. -->
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
        <!-- round 4: no "Agent Team" / "Agent Org" label (the name and Members / Runs say it); it is in the tooltip. -->
        <h1 class="min-w-0 truncate text-lg font-semibold tracking-tight text-gray-900" :title="`${node.kind === 'org' ? $t('memory.group.org') : $t('memory.group.team')} · ${node.id}`">{{ node.label }}</h1>
        <span v-if="imported" class="flex-shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">{{ $t('memory.components.memory.common.importedReadOnly') }}</span>
      </div>

      <!-- round 4: the Runs filter sits in the header row, like an agent's run filter. -->
      <div v-if="pane === 'runs'" class="relative w-full sm:w-60">
        <Icon icon="heroicons:magnifying-glass-20-solid" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input v-model="runFilter" type="text" :placeholder="$t('memory.components.memory.CollaborationMemoryDetail.search_runs')" :aria-label="$t('memory.browse.filter_label')" class="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" data-test="group-runs-filter" />
      </div>

      <!-- Members and Runs. Room for a later team-, org- or global-level "shared facts" tab (not shown). -->
      <div class="flex w-full flex-shrink-0 rounded-lg bg-gray-200/75 p-0.5 sm:inline-flex sm:w-auto" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="pane === tab.id"
          class="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3.5 py-1.5 text-sm font-medium transition focus:outline-none sm:flex-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :class="pane === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          :data-test="`group-memory-tab-${tab.id}`"
          @click="$emit('changePane', tab.id)"
        >
          <span>{{ tab.label }}</span>
          <span
            class="rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none"
            :class="pane === tab.id ? 'bg-gray-100 text-gray-600' : 'text-gray-500'"
          >{{ tab.count }}</span>
        </button>
      </div>
    </header>

    <div v-if="pane === 'members'" class="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3" data-test="group-members">
      <button v-for="member in node.children" :key="member.key" class="flex flex-col justify-start rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-test="group-member" @click="$emit('select', member.key)">
        <div class="flex min-w-0 items-center gap-2">
          <Icon :icon="member.kind === 'team' ? 'heroicons:user-group' : 'heroicons:user'" class="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
          <h2 class="min-w-0 truncate text-sm font-semibold text-gray-900" :title="member.id">{{ member.label }}</h2>
        </div>
        <p v-if="member.kind === 'team'" class="mt-2.5 text-xs text-gray-500">{{ $t('memory.group.team') }} · {{ $t('memory.group.member_count', { count: (member.children ?? []).length }) }}</p>
        <p v-else-if="member.local === false" class="mt-2.5"><span class="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600" :title="$t('memory.browse.shared_help')">{{ $t('memory.group.shared_agent') }}</span></p>
      </button>
    </div>

    <CollaborationMemoryDetail
      v-else
      embedded
      :title="node.label"
      :rows="rows"
      :loading="list.loading"
      :error="list.error"
      :page="list.page"
      :total-pages="list.totalPages"
      :search="list.search"
      :read-only="imported"
      @search="(search) => $emit('searchRuns', search)"
      @change-page="(page) => $emit('changeRunsPage', page)"
      @retry="$emit('retryRuns')"
      @inspect-member="(runId, member) => $emit('inspectMember', runId, member)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import CollaborationMemoryDetail from './CollaborationMemoryDetail.vue';
import { useLocalization } from '~/composables/useLocalization';
import { useMemoryExplorerStore } from '~/stores/memoryExplorerStore';
import type { OwnerNode } from '~/stores/memoryBrowseStore';
import type { CollaborationMemberMemoryTargetSummary, CollaborationRunMemoryRow } from '~/types/memory';

/**
 * semantic-memory-view-554 (design, round 3): a team's or an org's memory: its members (each opens its agent or team
 * page) and its own runs (today's team or org runs with their members).
 */
export type GroupPane = 'members' | 'runs';
const props = defineProps<{ node: OwnerNode; pane: GroupPane; imported: boolean; backText: string; backLabel: string }>();
const emit = defineEmits<{
  back: [];
  changePane: [pane: GroupPane];
  select: [key: string];
  searchRuns: [search: string];
  changeRunsPage: [page: number];
  retryRuns: [];
  inspectMember: [runId: string, member: CollaborationMemberMemoryTargetSummary];
}>();

const { t } = useLocalization();
const explorer = useMemoryExplorerStore();
const list = computed(() => (props.node.kind === 'org' ? explorer.orgRuns : explorer.teamRuns));
const rows = computed((): CollaborationRunMemoryRow[] => (props.node.kind === 'org'
  ? explorer.orgRuns.entries.map(run => ({ ...run, runId: run.orgRunId }))
  : explorer.teamRuns.entries.map(run => ({ ...run, runId: run.teamRunId }))));
/** The Runs filter applies as you type (300 ms), as the run list's own filter did. */
const runFilter = ref(list.value.search);
watch(() => list.value.search, (value) => { if (value !== runFilter.value.trim()) runFilter.value = value; });
let filterTimer: ReturnType<typeof setTimeout> | null = null;
watch(runFilter, (value) => {
  if (value.trim() === list.value.search) return;
  if (filterTimer) clearTimeout(filterTimer);
  filterTimer = setTimeout(() => emit('searchRuns', runFilter.value.trim()), 300);
});

const tabs = computed(() => [
  { id: 'members' as const, label: t('memory.group.members'), count: (props.node.children ?? []).length },
  { id: 'runs' as const, label: t('memory.group.runs'), count: props.node.count ?? list.value.total },
]);
</script>
