<template>
  <div class="flex min-h-0 flex-1 flex-col" data-test="semantic-memory-folder">
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
      <h2 class="text-sm font-medium text-gray-700">{{ global ? $t('memory.global.missing_title') : $t('memory.semantic.missing_title') }}</h2>
      <p class="mx-auto mt-1 max-w-lg text-sm text-gray-500">{{ global ? (folder.exists ? $t('memory.global.empty_body') : $t('memory.global.missing_body')) : folder.exists ? $t('memory.semantic.empty_body', { name: agentName }) : $t('memory.semantic.missing_body', { name: agentName }) }}</p>
    </div>

    <template v-else-if="folder && workspaceId">
      <!-- Read-only split-pane reader filling the remaining height. round 4 (the founder: only what is needed): no
           full-width path bar; the folder's path is a "Copy folder path" action at the foot of the file list, which
           has room to spare, with the path in its tooltip. -->
      <div class="flex min-h-[460px] flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:h-[calc(100vh-110px)]" data-test="semantic-memory-explorer">
        <div class="flex min-h-0 flex-1 flex-col md:flex-row">
          <div class="semantic-memory-sidebar flex max-h-[34vh] w-full flex-shrink-0 flex-col border-b border-gray-200 bg-gray-50/70 md:max-h-none md:w-[280px] lg:w-[300px] md:border-b-0 md:border-r">
            <FileExplorer class="min-h-0 flex-1" :workspace-id="workspaceId" read-only />
            <button
              type="button"
              class="mx-2 mb-2 inline-flex flex-shrink-0 items-center gap-1.5 self-start rounded-md px-2 py-1 text-xs text-gray-500 transition hover:bg-gray-200/70 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :title="folder.folderPath"
              :aria-label="copiedPath ? 'Copied' : `Copy folder path ${folder.folderPath}`"
              data-test="semantic-memory-path"
              @click="copyPath"
            >
              <Icon :icon="copiedPath ? 'heroicons:check-20-solid' : 'heroicons:clipboard-document'" class="h-3.5 w-3.5" :class="copiedPath ? 'text-green-600' : ''" aria-hidden="true" />
              <span>{{ copiedPath ? 'Copied' : 'Copy folder path' }}</span>
            </button>
          </div>
          <div class="semantic-memory-reader flex min-h-[320px] min-w-0 flex-1 flex-col bg-white">
            <FileExplorerTabs :workspace-id="workspaceId" read-only />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import FileExplorer from '~/components/fileExplorer/FileExplorer.vue';
import FileExplorerTabs from '~/components/fileExplorer/FileExplorerTabs.vue';
import { useSemanticMemoryStore } from '~/stores/semanticMemoryStore';
import { useWorkspaceStore } from '~/stores/workspace';
import { useFileExplorerStore } from '~/stores/fileExplorer';

/**
 * semantic-memory-view-554 & memory-layout-balance-608 (design): an agent's or global semantic memory folder, read only.
 * A transient read-only workspace is rooted at the folder (never listed in the Workspaces sidebar or a picker); the
 * file explorer and the Files panel's tabs show it in their read-only mode with balanced split-pane proportions and
 * proportional Markdown document typography.
 */
/** `global`: the node's Global memory, not an agent's. */
const props = defineProps<{ agentDefinitionId: string; agentName: string; imported: boolean; global?: boolean }>();

const store = useSemanticMemoryStore();
const workspaceStore = useWorkspaceStore();
const fileExplorerStore = useFileExplorerStore();

const folder = computed(() => (store.agentDefinitionId === props.agentDefinitionId ? store.folder : null));

const workspaceId = ref<string | null>(null);
const copiedPath = ref(false);
let copiedTimer: ReturnType<typeof setTimeout> | null = null;

const copyPath = async () => {
  const path = folder.value?.folderPath;
  if (!path) return;
  try { await navigator.clipboard?.writeText(path); } catch { /* noop */ }
  copiedPath.value = true;
  if (copiedTimer) clearTimeout(copiedTimer);
  copiedTimer = setTimeout(() => { copiedPath.value = false; }, 1500);
};

const release = () => {
  if (workspaceId.value) workspaceStore.unregisterSkillWorkspace(workspaceId.value);
  workspaceId.value = null;
};

watch(() => [props.agentDefinitionId, props.imported] as const, () => {
  copiedPath.value = false;
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
  // Auto-open the first root-level document (or first readable file) so the reader pane is immediately populated.
  const firstFile = current.files.find(f => f.kind !== 'link' && f.relativePath && !f.relativePath.includes('/'))
    ?? current.files.find(f => f.kind !== 'link' && f.relativePath);
  if (firstFile) {
    void fileExplorerStore.openFilePreview(firstFile.relativePath, id);
  }
}, { immediate: true });

onBeforeUnmount(() => {
  if (copiedTimer) clearTimeout(copiedTimer);
  release();
});
</script>

<style scoped>
/* Align the file explorer search box cleanly with the right pane's tab bar height. */
.semantic-memory-sidebar :deep(.file-explorer) {
  padding-top: 0;
  /* The list takes the height left above "Copy folder path". */
  height: auto;
}
.semantic-memory-sidebar :deep(.file-explorer > div:first-child) {
  height: 46px;
  margin-bottom: 0;
  padding: 0 0.625rem;
  border-bottom: 1px solid #e5e7eb;
}
.semantic-memory-sidebar :deep(.file-explorer-content) {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.semantic-memory-sidebar :deep(.file-header) {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: 0.8125rem;
}
.semantic-memory-sidebar :deep(.file-header span) {
  font-size: 0.8125rem;
}

/* Remove inner card chrome inside the outer Semantic memory container. */
.semantic-memory-reader :deep(#contentViewer) {
  border-radius: 0;
  box-shadow: none;
}

/* Proportional Markdown typography tailored for the compact Semantic memory document viewer. */
.semantic-memory-reader :deep(.markdown-renderer-segments) {
  max-width: 74ch;
  padding: 0.75rem 1.25rem 1.5rem;
}
.semantic-memory-reader :deep(.markdown-body) {
  font-size: 0.875rem;
  line-height: 1.65;
  color: #374151;
}
.semantic-memory-reader :deep(.markdown-body h1) {
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.015em;
  color: #111827;
  margin-top: 0;
  margin-bottom: 0.9rem;
  padding-bottom: 0.55rem;
  border-bottom: 1px solid #f3f4f6;
}
.semantic-memory-reader :deep(.markdown-body h2) {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.35;
  color: #111827;
  margin-top: 1.4rem;
  margin-bottom: 0.55rem;
}
.semantic-memory-reader :deep(.markdown-body h3) {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
  color: #1f2937;
  margin-top: 1.15rem;
  margin-bottom: 0.4rem;
}
.semantic-memory-reader :deep(.markdown-body p) {
  margin-top: 0;
  margin-bottom: 0.75rem;
}
.semantic-memory-reader :deep(.markdown-body ul),
.semantic-memory-reader :deep(.markdown-body ol) {
  margin-top: 0.35rem;
  margin-bottom: 0.85rem;
  padding-left: 1.35rem;
}
.semantic-memory-reader :deep(.markdown-body li) {
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
}
.semantic-memory-reader :deep(.markdown-body code) {
  font-size: 0.8125rem;
  font-weight: 400;
  background-color: #f3f4f6;
  color: #1f2937;
  padding: 0.125rem 0.35rem;
  border-radius: 0.25rem;
}
.semantic-memory-reader :deep(.markdown-body code::before),
.semantic-memory-reader :deep(.markdown-body code::after) {
  content: none;
}
.semantic-memory-reader :deep(.markdown-body pre code) {
  background-color: transparent;
  padding: 0;
}
.semantic-memory-reader :deep(.markdown-body table) {
  font-size: 0.8125rem;
}
</style>
