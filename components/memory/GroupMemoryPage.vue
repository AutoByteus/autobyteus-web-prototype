<template>
  <div class="space-y-5" data-test="group-memory-page">
    <header>
      <div class="flex flex-wrap items-center gap-3">
        <h1 class="break-words text-xl font-semibold text-gray-900">{{ node.label }}</h1>
        <span v-if="imported" class="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">{{ $t('memory.components.memory.common.importedReadOnly') }}</span>
      </div>
      <p class="mt-1 text-sm text-gray-500">{{ node.kind === 'org' ? $t('memory.group.org') : $t('memory.group.team') }}</p>
      <p class="mt-0.5 break-all font-mono text-xs text-gray-400">{{ node.id }}</p>
    </header>

    <!-- Members and Runs. Room for a later team-, org- or global-level "shared facts" tab (not shown). -->
    <div class="inline-flex max-w-full overflow-x-auto rounded-lg border border-gray-200 bg-white p-1" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        role="tab"
        :aria-selected="pane === tab.id"
        class="flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        :class="pane === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        :data-test="`group-memory-tab-${tab.id}`"
        @click="$emit('changePane', tab.id)"
      >
        {{ tab.label }}
        <span class="text-xs font-semibold" :class="pane === tab.id ? 'text-blue-100' : 'text-gray-400'">{{ tab.count }}</span>
      </button>
    </div>

    <div v-if="pane === 'members'" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-test="group-members">
      <button v-for="member in node.children" :key="member.key" class="flex flex-col justify-start rounded-lg border border-gray-200 bg-white p-5 text-left transition hover:border-gray-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-test="group-member" @click="$emit('select', member.key)">
        <div class="flex min-w-0 items-center gap-2">
          <Icon :icon="member.kind === 'team' ? 'heroicons:user-group' : 'heroicons:user'" class="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          <h2 class="min-w-0 break-words text-base font-semibold text-gray-900">{{ member.label }}</h2>
        </div>
        <p class="mt-1 break-all font-mono text-xs text-gray-500">{{ member.id }}</p>
        <p v-if="member.kind === 'team'" class="mt-3 text-xs text-gray-500">{{ $t('memory.group.team') }} · {{ $t('memory.group.member_count', { count: (member.children ?? []).length }) }}</p>
        <p v-else-if="member.local === false" class="mt-3"><span class="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600" :title="$t('memory.browse.shared_help')">{{ $t('memory.group.shared_agent') }}</span></p>
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
import { computed } from 'vue';
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
const props = defineProps<{ node: OwnerNode; pane: GroupPane; imported: boolean }>();
defineEmits<{
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
const tabs = computed(() => [
  { id: 'members' as const, label: t('memory.group.members'), count: (props.node.children ?? []).length },
  { id: 'runs' as const, label: t('memory.group.runs'), count: props.node.count ?? list.value.total },
]);
</script>
