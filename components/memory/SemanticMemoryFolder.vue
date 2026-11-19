<template>
  <div class="flex flex-col" data-test="semantic-memory-folder">
    <!-- An imported source: semantic memory is not synced (REQ-008). -->
    <div v-if="imported" class="py-12 text-center" data-test="semantic-memory-not-synced">
      <h2 class="text-sm font-medium text-gray-700">{{ $t('memory.semantic.not_synced_title') }}</h2>
      <p class="mx-auto mt-1 max-w-lg text-sm text-gray-500">{{ $t('memory.semantic.not_synced_body_detail') }}</p>
    </div>

    <div v-else-if="store.folderLoading && !folder" class="py-12 text-center text-sm text-gray-500">{{ $t('memory.semantic.loading_folder') }}</div>
    <div v-else-if="store.folderError" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ store.folderError }}
      <button class="ml-2 font-semibold underline" @click="store.openFolder(agentDefinitionId)">{{ $t('memory.results.retry') }}</button>
    </div>

    <!-- A missing folder is not created by the view; it appears when the agent next runs. An empty one says so too (REQ-005). -->
    <div v-else-if="folder && (!folder.exists || folder.files.length === 0)" class="py-12 text-center" data-test="semantic-memory-empty">
      <h2 class="text-sm font-medium text-gray-700">{{ $t('memory.semantic.missing_title') }}</h2>
      <p class="mx-auto mt-1 max-w-lg text-sm text-gray-500">{{ folder.exists ? $t('memory.semantic.empty_body', { name: agentName }) : $t('memory.semantic.missing_body', { name: agentName }) }}</p>
    </div>

    <template v-else-if="folder && workspaceId">
      <p class="mb-3 break-all font-mono text-xs text-gray-500" data-test="semantic-memory-path"><span class="select-all">{{ folder.folderPath }}</span></p>
      <!-- The folder as the Skills page shows a skill's folder, read only: the file explorer and the Files panel's tabs.
           Below 768 px the file list sits above the open file. -->
      <div class="flex h-[64vh] min-h-[420px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white md:flex-row" data-test="semantic-memory-explorer">
        <div class="flex max-h-[38vh] w-full flex-shrink-0 flex-col border-b border-gray-200 bg-gray-50 md:max-h-none md:w-[260px] md:border-b-0 md:border-r">
          <FileExplorer :workspace-id="workspaceId" read-only />
        </div>
        <div class="flex min-h-[320px] min-w-0 flex-1 flex-col">
          <FileExplorerTabs :workspace-id="workspaceId" read-only />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import FileExplorer from '~/components/fileExplorer/FileExplorer.vue';
import FileExplorerTabs from '~/components/fileExplorer/FileExplorerTabs.vue';
import { useSemanticMemoryStore } from '~/stores/semanticMemoryStore';
import { useWorkspaceStore } from '~/stores/workspace';

/**
 * semantic-memory-view-554 (design): an agent's semantic memory folder, read only (REQ-005…008): the agent page's
 * Semantic memory tab (round 3). A transient read-only workspace is rooted at the folder (never listed in the
 * Workspaces sidebar or a picker); the file explorer and the Files panel's tabs show it in their read-only mode: no
 * context menu, rename, drag and drop or upload, preview only, a symbolic link listed as "Link · not opened", and the
 * search box searches file names inside this folder. A missing folder is never created by the view.
 */
const props = defineProps<{ agentDefinitionId: string; agentName: string; imported: boolean }>();

const store = useSemanticMemoryStore();
const workspaceStore = useWorkspaceStore();

const folder = computed(() => (store.agentDefinitionId === props.agentDefinitionId ? store.folder : null));

const workspaceId = ref<string | null>(null);
const release = () => {
  if (workspaceId.value) workspaceStore.unregisterSkillWorkspace(workspaceId.value);
  workspaceId.value = null;
};

watch(() => [props.agentDefinitionId, props.imported] as const, () => {
  if (props.imported) store.clearFolder();
  else void store.openFolder(props.agentDefinitionId);
}, { immediate: true });

/** The workspace exists only while a folder with files is shown. */
watch(() => [props.imported, folder.value?.agentDefinitionId, folder.value?.exists, folder.value?.files.length] as const, async () => {
  release();
  const current = folder.value;
  if (props.imported || !current?.exists || !current.files.length) return;
  const id = workspaceStore.registerSemanticMemoryWorkspace(current.agentDefinitionId, props.agentName, current.folderPath);
  await workspaceStore.fetchFolderChildren(id, '');
  workspaceId.value = id;
}, { immediate: true });

onBeforeUnmount(release);
</script>
