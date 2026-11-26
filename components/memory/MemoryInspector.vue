<template>
  <div class="mx-auto max-w-7xl space-y-4 px-5 py-4 sm:px-7 sm:py-5">
    <!-- round 3 (the founder): one header row like an owner's page. Back, the run (its agent only when Back does not
         already name it, then the run ID and workspace) and Work Journal / Raw Traces. -->
    <header class="flex flex-wrap items-center gap-x-4 gap-y-2.5 border-b border-gray-200 pb-3">
      <div class="flex min-w-0 flex-1 items-center gap-1.5">
        <button
          type="button"
          class="-ml-1.5 inline-flex flex-shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-sm font-medium text-gray-500 transition hover:bg-gray-200/60 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :aria-label="backLabel"
          :title="backLabel"
          @click="$emit('back')"
        >
          <Icon icon="heroicons:arrow-left-20-solid" class="h-4 w-4" aria-hidden="true" />
          <span class="max-w-[16rem] truncate">{{ backText || backLabel }}</span>
        </button>
        <span class="flex-shrink-0 text-gray-300" aria-hidden="true">/</span>
        <h1 :class="backNamesRun ? 'sr-only' : 'min-w-0 flex-shrink-0 truncate text-lg font-semibold tracking-tight text-gray-900'">{{ breadcrumb }}</h1>
        <!-- round 5: the run by its title when known (as its card showed it); run ID · workspace in the tooltip. -->
        <span v-if="runTitle" class="min-w-0 truncate text-sm font-medium text-gray-800" :title="metadataLine" data-test="memory-inspector-run-title">{{ runTitle }}</span>
        <span v-else-if="metadataLine" class="min-w-0 truncate font-mono text-xs text-gray-500" :title="metadataLine">{{ metadataLine }}</span>
        <span v-if="isImported" class="flex-shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">{{ $t('memory.components.memory.MemoryInspector.importedReadOnlyCorpus') }}</span>
      </div>

      <div v-if="store.target || folderRun" class="flex w-full flex-shrink-0 rounded-lg bg-gray-200/75 p-0.5 sm:inline-flex sm:w-auto" role="tablist">
        <button
          v-for="tab in visibleTabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab.id"
          class="flex-1 rounded-md px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:flex-none"
          :class="activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          @click="store.setActiveTab(tab.id)"
        >{{ tab.label }}</button>
      </div>
    </header>

    <div v-if="store.error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ store.error }}</div>
    <div v-if="!store.target && !folderRun" class="py-16 text-center text-sm text-gray-400">{{ $t('memory.components.memory.MemoryInspector.select_a_memory_entry_to_inspect') }}</div>

    <template v-else>
      <div class="min-h-[360px]">
        <div v-if="store.loading && !store.memoryView && store.activeTab !== 'journal'" class="py-16 text-center text-sm text-gray-500">{{ $t('memory.components.memory.MemoryInspector.loading_memory_view') }}</div>
        <WorkJournalTab v-else-if="folderRun || store.activeTab === 'journal'" @open-index="$emit('openIndex')" />
        <RawTracesTab
          v-else
          :traces="store.memoryView?.rawTraces ?? null"
          :raw-trace-files="store.memoryView?.rawTraceFiles ?? null"
          :selected-raw-trace-file-name="store.memoryView?.selectedRawTraceFileName ?? store.selectedRawTraceFileName"
          :limit="store.rawTraceLimit"
          :loading="store.loading"
          @updateLimit="store.setRawTraceLimit"
          @selectFile="store.setRawTraceFileName"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useMemoryInspectorStore } from '~/stores/memoryInspectorStore';
import type { MemoryInspectorTab } from '~/types/memory';
import WorkJournalTab from './WorkJournalTab.vue';
import RawTracesTab from './RawTracesTab.vue';

/** A run the memory index knows only by its folder: its Work Journal only (it has no memory view). */
type FolderRun = { runKey: string; runId: string; agentName: string | null; groupName: string | null };
/** backText: where Back goes, shown; backLabel: its accessible name ("Back to …"). */
const props = withDefaults(defineProps<{ backLabel?: string; backText?: string; runTitle?: string; folderRun?: FolderRun | null }>(), { backLabel: 'Back to Memory', backText: '', runTitle: '', folderRun: null });
defineEmits<{ back: []; openIndex: [] }>();

const store = useMemoryInspectorStore();
const tabs: Array<{ id: MemoryInspectorTab; label: string }> = [
  { id: 'journal', label: 'Work Journal' },
  { id: 'raw', label: 'Raw Traces' },
];
const visibleTabs = computed(() => (props.folderRun ? tabs.slice(0, 1) : tabs));
const activeTab = computed((): MemoryInspectorTab => (props.folderRun ? 'journal' : store.activeTab));

/** The run's name: the agent, or the member and its team. No path words: the page already says where you are. */
const breadcrumb = computed(() => {
  const folder = props.folderRun;
  if (folder) return [folder.agentName || folder.runId, folder.groupName].filter(Boolean).join(' · ');
  const target = store.target;
  if (!target) return '';
  if (target.kind === 'agent_run') return target.agentDisplayName || target.agentDefinitionId || target.runId;
  const member = target.memberName || target.memberAddress || target.agentRunId;
  const group = target.kind === 'org_member_run'
    ? (target.orgDefinitionName || target.orgDefinitionId || '')
    : (target.teamDefinitionName || target.teamDefinitionId || '');
  return group ? `${member} · ${group}` : member;
});

/** Back already says "Back to <this agent>": the name is not repeated on screen. */
const backNamesRun = computed(() => !!breadcrumb.value && props.backLabel.includes(breadcrumb.value));

const isImported = computed(() => store.target?.source?.type === 'IMPORTED');

/** The run ID and, when there is one, its workspace. */
const metadataLine = computed(() => {
  if (props.folderRun) return props.folderRun.runKey;
  const target = store.target;
  if (!target) return '';
  if (target.kind === 'agent_run') return [target.runId, target.workspaceRootPath].filter(Boolean).join(' · ');
  return target.agentRunId;
});
</script>
