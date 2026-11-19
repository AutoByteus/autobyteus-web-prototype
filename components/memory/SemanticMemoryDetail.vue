<template>
  <div class="mx-auto max-w-7xl space-y-5 p-8" data-test="semantic-memory-detail">
    <button class="text-sm font-medium text-blue-600 hover:underline" @click="$emit('back')">← {{ backLabel }}</button>

    <header>
      <div class="flex flex-wrap items-center gap-3">
        <h1 class="break-words text-xl font-semibold text-gray-900">{{ title }}</h1>
        <span v-if="imported" class="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">{{ $t('memory.components.memory.common.importedReadOnly') }}</span>
      </div>
      <p class="mt-1 break-words text-sm text-gray-500">
        {{ $t('memory.semantic.open') }}<template v-if="folderPath"> · <span class="select-all break-all font-mono text-xs text-gray-500" data-test="semantic-memory-path">{{ folderPath }}</span></template>
      </p>
    </header>

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

    <!-- A missing or empty folder says so (REQ-005). -->
    <div v-else-if="folder && (!folder.exists || folder.files.length === 0)" class="py-12 text-center" data-test="semantic-memory-empty">
      <h2 class="text-sm font-medium text-gray-700">{{ $t('memory.semantic.missing_title') }}</h2>
      <p class="mx-auto mt-1 max-w-lg text-sm text-gray-500">{{ folder.exists ? $t('memory.semantic.empty_body', { name: title }) : $t('memory.semantic.missing_body', { name: title }) }}</p>
    </div>

    <div v-else-if="folder" class="grid gap-4 xl:grid-cols-[17rem_minmax(0,1fr)]">
      <nav class="hidden xl:block" :aria-label="$t('memory.semantic.files')">
        <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{{ $t('memory.semantic.files') }} · {{ folder.files.length.toLocaleString(resolvedLocale) }}{{ folder.truncated ? '+' : '' }}</h3>
        <ul class="max-h-[66vh] space-y-1 overflow-y-auto pr-1" data-test="semantic-memory-files">
          <li v-for="item in folder.files" :key="item.relativePath">
            <button
              v-if="item.kind === 'file'"
              type="button"
              class="w-full rounded-lg border px-3 py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :class="item.relativePath === store.open.relativePath ? 'border-blue-300 bg-blue-50' : 'border-transparent hover:bg-gray-50'"
              :aria-current="item.relativePath === store.open.relativePath ? 'true' : undefined"
              data-test="semantic-memory-file"
              @click="select(item)"
            >
              <span class="block truncate font-mono text-xs" :title="item.relativePath"><span class="text-gray-400">{{ folderOf(item.relativePath) }}</span><span class="font-semibold text-gray-800">{{ nameOf(item.relativePath) }}</span></span>
              <span class="mt-0.5 block text-[11px] text-gray-500">{{ formatTime(item.modifiedAt) }} · {{ formatSize(item.sizeBytes) }}</span>
            </button>
            <!-- A symbolic link: listed with its name and that it is a link; never entered or opened (REQ-007). -->
            <div v-else class="cursor-default rounded-lg border border-transparent px-3 py-2" :title="$t('memory.semantic.link_help')" aria-disabled="true" data-test="semantic-memory-link">
              <span class="flex items-center gap-1.5 font-mono text-xs text-gray-500">
                <Icon icon="heroicons:link-20-solid" class="h-3.5 w-3.5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                <span class="min-w-0 truncate"><span class="text-gray-400">{{ folderOf(item.relativePath) }}</span>{{ nameOf(item.relativePath) }}</span>
              </span>
              <span class="mt-0.5 block text-[11px] text-gray-400">{{ $t('memory.semantic.link_not_opened') }}</span>
            </div>
          </li>
        </ul>
        <p v-if="folder.truncated" class="mt-2 px-3 text-[11px] text-gray-500" data-test="semantic-memory-truncated">{{ $t('memory.semantic.truncated', { count: (5000).toLocaleString(resolvedLocale) }) }}</p>
      </nav>

      <div class="min-w-0">
        <div class="xl:hidden">
          <label class="text-xs font-semibold text-gray-600" for="semantic-memory-file-select">{{ $t('memory.semantic.file') }}</label>
          <select id="semantic-memory-file-select" class="mb-3 mt-1 block w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs" :value="store.open.relativePath ?? ''" @change="selectByPath(($event.target as HTMLSelectElement).value)">
            <option v-for="item in folder.files" :key="item.relativePath" :value="item.relativePath" :disabled="item.kind !== 'file'">{{ item.relativePath }}{{ item.kind === 'file' ? '' : ` (${$t('memory.semantic.link_not_opened')})` }}</option>
          </select>
          <p v-if="folder.truncated" class="-mt-1 mb-3 text-[11px] text-gray-500">{{ $t('memory.semantic.truncated', { count: (5000).toLocaleString(resolvedLocale) }) }}</p>
        </div>

        <div v-if="openFile" class="overflow-hidden rounded-lg border border-gray-200 bg-white" data-test="semantic-memory-content">
          <div class="border-b border-gray-100 px-3 py-2">
            <p class="truncate font-mono text-xs font-semibold text-gray-800">{{ openFile.relativePath }}</p>
            <p class="text-[11px] text-gray-500">{{ formatSize(openFile.sizeBytes) }} · {{ $t('memory.semantic.modified', { time: formatTime(openFile.modifiedAt) }) }}</p>
          </div>
          <!-- A file the node refuses: the Memory page's error style, in the Files panel's words. -->
          <div v-if="store.open.errorKey" class="h-[62vh] min-h-[320px] p-4" data-test="semantic-memory-file-error">
            <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{{ $t(store.open.errorKey) }}</div>
          </div>
          <div v-else class="h-[62vh] min-h-[320px]">
            <FileViewer
              :file="{ path: openFile.relativePath, type: store.open.type ?? 'Unsupported', content: store.open.content, url: store.open.url }"
              mode="preview"
              :read-only="true"
              :loading="store.open.loading"
              class="h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import FileViewer from '~/components/fileExplorer/FileViewer.vue';
import { useLocalization } from '~/composables/useLocalization';
import { useSemanticMemoryStore } from '~/stores/semanticMemoryStore';
import type { SemanticMemoryFile } from '~/types/semanticMemory';

/**
 * semantic-memory-view-554 (design): one agent's semantic memory folder, read only (REQ-005…008).
 * Files newest first on the left (a select below 1280 px, as the Work Journal does); the open file on the right in
 * the Files panel's viewer, in its read-only preview. A link row is listed and never opened.
 */
const props = defineProps<{ agentDefinitionId: string; agentName: string | null; backLabel: string; imported: boolean }>();
const emit = defineEmits<{ back: []; selectFile: [relativePath: string] }>();

const { resolvedLocale } = useLocalization();
const store = useSemanticMemoryStore();

const folder = computed(() => (store.agentDefinitionId === props.agentDefinitionId ? store.folder : null));
const openFile = computed(() => (folder.value ? store.openFile : null));
const title = computed(() => props.agentName || props.agentDefinitionId);
const folderPath = computed(() => (props.imported ? null : folder.value?.folderPath ?? null));

const select = (item: SemanticMemoryFile) => {
  if (item.kind !== 'file') return;
  void store.openEntry(item);
  emit('selectFile', item.relativePath);
};
const selectByPath = (relativePath: string) => {
  const item = folder.value?.files.find(file => file.relativePath === relativePath);
  if (item) select(item);
};

const folderOf = (path: string) => (path.includes('/') ? path.slice(0, path.lastIndexOf('/') + 1) : '');
const nameOf = (path: string) => path.slice(path.lastIndexOf('/') + 1);

const formatTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(resolvedLocale.value, { dateStyle: 'medium', timeStyle: 'short' });
};
const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};
</script>
