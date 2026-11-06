<template>
  <section class="flex h-full flex-col overflow-hidden bg-white" data-testid="mobile-files">
    <!-- One bar: back, the title, and two icons. Search and filters are on demand, not a fixed block. -->
    <header class="flex h-12 shrink-0 items-center border-b border-slate-200 pl-1 pr-1" data-testid="mobile-files-bar">
      <button type="button" class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-slate-600 active:bg-slate-100" aria-label="Back to the conversation" data-testid="mobile-results-back" @click="$emit('back')">
        <Icon icon="heroicons:arrow-left-20-solid" class="h-6 w-6" aria-hidden="true" />
      </button>
      <template v-if="searching">
        <input
          ref="searchInput"
          v-model="search"
          type="search"
          class="h-10 min-w-0 flex-1 rounded-lg bg-slate-100 px-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
          :placeholder="searchPlaceholder"
          data-testid="mobile-files-search"
        />
        <button type="button" class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-slate-500 active:bg-slate-100" aria-label="Close search" @click="closeSearch">
          <Icon icon="heroicons:x-mark-20-solid" class="h-6 w-6" aria-hidden="true" />
        </button>
      </template>
      <template v-else>
        <h1 class="min-w-0 flex-1 truncate px-2 text-base font-semibold">Files</h1>
        <template v-if="activeWorkspace">
          <button type="button" class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-slate-600 active:bg-slate-100" aria-label="Search files" data-testid="mobile-files-search-open" @click="openSearch">
            <svg viewBox="0 0 20 20" class="h-6 w-6" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM2 8a6 6 0 1 1 10.89 3.48l4.31 4.3a1 1 0 0 1-1.4 1.42l-4.32-4.3A6 6 0 0 1 2 8Z" /></svg>
          </button>
          <button type="button" class="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-slate-600 active:bg-slate-100" aria-label="Filter files" data-testid="mobile-files-filters-toggle" @click="showFilters = true">
            <svg viewBox="0 0 20 20" class="h-6 w-6" fill="currentColor" aria-hidden="true"><path d="M3 5.5A.75.75 0 0 1 3.75 5h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.5Zm2.5 4.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 5.5 10Zm2.5 4.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z" /></svg>
            <span v-if="activeDiscoveryFilter !== 'all' || deepSearch" class="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" aria-label="Filter on" />
          </button>
        </template>
      </template>
    </header>

    <p v-if="activeWorkspace && attachNotice" class="shrink-0 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800" data-testid="mobile-files-attach-notice">{{ attachNotice }}</p>

    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <p v-if="!activeWorkspace" class="px-4 py-10 text-center text-sm text-slate-500" data-testid="mobile-files-no-workspace">
        {{ unavailableTitle }}
        <button v-if="canRetryWorkspaceResolution" type="button" class="ml-1 h-11 font-semibold text-blue-700 underline" data-testid="mobile-files-retry-workspace" @click="resolveWorkspaceForContext">Retry</button>
      </p>

      <template v-else>
        <!-- Where you are: one scrolling line, the last part is the current folder. -->
        <nav class="sticky top-0 z-10 flex h-11 items-center gap-1 overflow-x-auto whitespace-nowrap border-b border-slate-100 bg-white px-4 text-sm" aria-label="Folder" data-testid="mobile-files-sticky-context">
          <template v-for="(crumb, index) in breadcrumb" :key="crumb.path || 'root'">
            <Icon v-if="index > 0" icon="heroicons:chevron-right-20-solid" class="h-4 w-4 flex-shrink-0 text-slate-300" aria-hidden="true" />
            <button type="button" class="h-11 flex-shrink-0 px-1" :class="index === breadcrumb.length - 1 ? 'font-semibold text-slate-900' : 'text-slate-500'" @click="openCrumb(index)">
              {{ index === 0 ? workspaceTitle : crumb.name }}
            </button>
          </template>
          <span v-if="isSearchLoading" class="ml-2 flex-shrink-0 text-xs text-blue-700" data-testid="mobile-files-search-loading">Searching…</span>
          <span v-else-if="searchError" class="ml-2 flex-shrink-0 text-xs text-red-700" data-testid="mobile-files-search-error">{{ searchError }}</span>
        </nav>

        <ul v-if="visibleChildren.length" data-testid="mobile-files-list">
          <li v-for="node in visibleChildren" :key="node.id || node.path || node.name">
            <button
              type="button"
              class="flex min-h-[3.5rem] w-full items-center gap-3 border-b border-slate-100 px-4 py-2 text-left active:bg-slate-50 disabled:opacity-60"
              :class="previewNode && previewNode.path === node.path ? 'bg-blue-50' : ''"
              :disabled="isNodeBusy(node)"
              @click="openNode(node)"
            >
              <svg v-if="node.is_file" viewBox="0 0 20 20" class="h-6 w-6 flex-shrink-0 text-slate-400" fill="currentColor" aria-hidden="true"><path d="M4 4a2 2 0 0 1 2-2h4.59A2 2 0 0 1 12 2.59L15.41 6A2 2 0 0 1 16 7.41V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Z" /></svg>
              <svg v-else viewBox="0 0 20 20" class="h-6 w-6 flex-shrink-0 text-amber-400" fill="currentColor" aria-hidden="true"><path d="M2 6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Z" /></svg>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-[0.9375rem] font-medium text-slate-900">{{ node.name }}</span>
                <span v-if="node.path && node.path !== node.name && (search || deepSearch || activeDiscoveryFilter !== 'all')" class="block truncate text-xs text-slate-500">{{ node.path }}</span>
                <span v-if="!node.is_file && isFolderLoading(node.path)" class="block text-xs text-blue-700">Loading…</span>
                <span v-else-if="!node.is_file && getFolderError(node.path)" class="block text-xs text-red-700">{{ getFolderError(node.path) }}</span>
              </span>
              <Icon v-if="!node.is_file" icon="heroicons:chevron-right-20-solid" class="h-5 w-5 flex-shrink-0 text-slate-300" aria-hidden="true" />
            </button>
          </li>
        </ul>
        <p v-else class="px-4 py-10 text-center text-sm text-slate-500" data-testid="mobile-files-empty">{{ emptyMessage }}</p>
      </template>
    </div>

    <Teleport to="body">
      <div v-if="showFilters" class="fixed inset-0 z-50 flex flex-col justify-end" data-testid="mobile-files-advanced-filters">
        <button type="button" class="absolute inset-0 bg-slate-900/40" aria-label="Close" @click="showFilters = false" />
        <div class="relative flex max-h-[85dvh] flex-col rounded-t-2xl bg-white shadow-xl" role="dialog" aria-modal="true" aria-label="Filter files">
          <div class="mx-auto mt-2 h-1 w-10 flex-shrink-0 rounded-full bg-slate-300" aria-hidden="true" />
          <header class="flex h-14 flex-shrink-0 items-center justify-between pl-4 pr-2">
            <h2 class="text-lg font-semibold">Show</h2>
            <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full text-slate-500 active:bg-slate-100" aria-label="Close" @click="showFilters = false">
              <Icon icon="heroicons:x-mark-20-solid" class="h-6 w-6" aria-hidden="true" />
            </button>
          </header>
          <div class="overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button
              v-for="filter in discoveryFilters"
              :key="filter.id"
              type="button"
              class="flex min-h-[3.5rem] w-full items-center gap-3 px-4 text-left active:bg-slate-100"
              :class="activeDiscoveryFilter === filter.id ? 'bg-blue-50' : ''"
              :aria-current="activeDiscoveryFilter === filter.id ? 'true' : undefined"
              :data-testid="`mobile-files-filter-${filter.id}`"
              @click="activeDiscoveryFilter = filter.id; showFilters = false"
            >
              <span class="min-w-0 flex-1 text-base text-slate-900">{{ filter.label }}</span>
              <span class="text-sm text-slate-400">{{ filter.count }}</span>
              <Icon v-if="activeDiscoveryFilter === filter.id" icon="heroicons:check-circle-20-solid" class="h-6 w-6 flex-shrink-0 text-blue-600" aria-hidden="true" />
            </button>
            <div class="mx-4 my-1 border-t border-slate-100" />
            <div class="flex h-14 items-center gap-3 px-4">
              <span id="mobile-files-deep-label" class="flex-1 text-base text-slate-900">Search the whole workspace</span>
              <button
                type="button"
                role="switch"
                :aria-checked="deepSearch ? 'true' : 'false'"
                aria-labelledby="mobile-files-deep-label"
                class="relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition"
                :class="deepSearch ? 'bg-blue-600' : 'bg-slate-300'"
                data-testid="mobile-files-deep-search"
                @click="deepSearch = !deepSearch"
              >
                <span class="inline-block h-6 w-6 rounded-full bg-white shadow transition" :class="deepSearch ? 'translate-x-7' : 'translate-x-1'" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <MobileFileViewer
      v-if="previewNode && activeWorkspace"
      :node="previewNode"
      :workspace-id="activeWorkspace.workspaceId"
      :context="context"
      :file-state="previewFileState"
      :open-error="previewOpenError"
      :presentation="previewPresentation"
      :allow-attach="previewAllowAttach"
      @close="previewNode = null"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, toRef, watch } from 'vue';
import { Icon } from '@iconify/vue';
import MobileFileViewer from '~/components/mobile/MobileFileViewer.vue';
import { useMobileFileContextCoordinator } from '~/composables/mobile/useMobileFileContextCoordinator';
import {
  useMobileWorkspaceFileExplorer,
  type MobileWorkspaceFileNode,
} from '~/composables/mobile/useMobileWorkspaceFileExplorer';
import type { MobileWorkContext } from '~/types/mobileWork';
import { mobileWorkContextKey } from '~/types/mobileWork';
import { useMobileWorkStore } from '~/stores/mobileWorkStore';

const props = defineProps<{
  context: MobileWorkContext | null;
  /** Inside Results, which carries the title. */
  embedded?: boolean;
}>();

defineEmits<{
  back: [];
}>();

const searching = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);
function openSearch(): void {
  searching.value = true;
  void nextTick(() => searchInput.value?.focus());
}
function closeSearch(): void {
  searching.value = false;
  search.value = '';
}

const mobileExplorer = useMobileWorkspaceFileExplorer(toRef(props, 'context'));
const { getVisibleContextAttachments } = useMobileFileContextCoordinator();
const search = ref('');
const folderStack = ref<MobileWorkspaceFileNode[]>([]);
const previewNode = ref<MobileWorkspaceFileNode | null>(null);
const previewPresentation = ref<'fullscreen' | 'inline'>('fullscreen');
const previewAllowAttach = ref(true);
const previewRequestInFlightRevision = ref<number | null>(null);
const lastAttachmentCount = ref(0);
const deepSearch = ref(false);
const showFilters = ref(false);
const activeDiscoveryFilter = ref<'all' | 'recent' | 'attached' | 'markdown-code'>('all');
let searchDebounce: ReturnType<typeof setTimeout> | null = null;

const activeWorkspace = mobileExplorer.workspace;
const workspaceTitle = computed(() => activeWorkspace.value?.name || props.context?.title || 'Workspace files');
const workspaceSubtitle = computed(() => {
  if (activeWorkspace.value?.absolutePath) return activeWorkspace.value.absolutePath;
  if (mobileExplorer.requestedRootPath.value) return mobileExplorer.requestedRootPath.value;
  return 'Select a workspace to browse files.';
});
const currentFolder = computed<MobileWorkspaceFileNode | null>(() => folderStack.value.at(-1) ?? mobileExplorer.tree.value ?? null);
const currentFolderLabel = computed(() => currentFolder.value?.path || currentFolder.value?.name || workspaceTitle.value);
const breadcrumb = computed(() => {
  const root = mobileExplorer.tree.value;
  return root ? [root, ...folderStack.value.filter((node) => node !== root)] : [];
});
const loadedWorkspaceFiles = computed(() => mobileExplorer.tree.value ? flattenFiles(mobileExplorer.tree.value) : []);
const attachedFileNodes = computed<MobileWorkspaceFileNode[]>(() => getVisibleContextAttachments(props.context)
  .filter((attachment) => attachment.kind === 'workspace_path')
  .map((attachment) => ({
    id: attachment.id,
    name: attachment.displayName,
    path: attachment.locator,
    is_file: true,
    children: [],
    childrenLoaded: true,
  })));
const workspaceSearchMode = computed(() => (
  deepSearch.value
  && search.value.trim().length > 0
  && activeDiscoveryFilter.value !== 'recent'
  && activeDiscoveryFilter.value !== 'attached'
));
const sourceNodes = computed<MobileWorkspaceFileNode[]>(() => {
  if (activeDiscoveryFilter.value === 'attached') {
    return attachedFileNodes.value;
  }
  if (activeDiscoveryFilter.value === 'recent') {
    return mobileExplorer.recentFiles.value;
  }
  if (workspaceSearchMode.value) {
    return mobileExplorer.searchResults.value;
  }
  if (deepSearch.value) {
    return loadedWorkspaceFiles.value;
  }
  return currentFolder.value?.children ?? [];
});
const visibleChildren = computed<MobileWorkspaceFileNode[]>(() => {
  const query = search.value.trim().toLowerCase();
  let children = sourceNodes.value;
  if (activeDiscoveryFilter.value === 'markdown-code') {
    children = children.filter((child) => child.is_file && isMarkdownOrCodePath(child.path || child.name));
  }
  if (!query || workspaceSearchMode.value) return children;
  return children.filter((child) => `${child.name} ${child.path}`.toLowerCase().includes(query));
});
const discoveryFilters = computed(() => {
  const base = workspaceSearchMode.value ? mobileExplorer.searchResults.value : (deepSearch.value ? loadedWorkspaceFiles.value : (currentFolder.value?.children ?? []));
  return [
    { id: 'all' as const, label: deepSearch.value ? 'All files' : 'Folder', count: base.length },
    { id: 'recent' as const, label: 'Recent', count: mobileExplorer.recentFiles.value.length },
    { id: 'attached' as const, label: 'Attached', count: attachedFileNodes.value.length },
    { id: 'markdown-code' as const, label: 'Markdown/code', count: base.filter((child) => child.is_file && isMarkdownOrCodePath(child.path || child.name)).length },
  ];
});
const searchPlaceholder = computed(() => deepSearch.value
  ? 'Search full workspace files'
  : 'Filter current folder');
const attachNotice = computed(() => {
  const count = getVisibleContextAttachments(props.context).length;
  if (count <= lastAttachmentCount.value) return null;
  const targetLabel = props.context?.kind === 'agent-run' || props.context?.kind === 'team-run'
    ? 'Chat context'
    : 'the next mobile run launch';
  return `${count} file${count === 1 ? '' : 's'} attached to ${targetLabel}.`;
});
const unavailableTitle = computed(() => {
  if (mobileExplorer.resolutionStatus.value === 'resolving') return 'Loading workspace files';
  if (mobileExplorer.resolutionStatus.value === 'unresolved') return 'Workspace unavailable';
  if (mobileExplorer.resolutionStatus.value === 'no-workspace-context') return 'Choose a workspace';
  return 'Choose a workspace';
});
const unavailableIcon = computed(() => mobileExplorer.resolutionStatus.value === 'resolving' ? '⏳' : '📁');
const unavailableDetail = computed(() => {
  if (mobileExplorer.resolutionStatus.value === 'resolving') {
    return 'Resolving the selected context workspace before showing files.';
  }
  if (mobileExplorer.workspaceResolutionError.value) {
    return mobileExplorer.workspaceResolutionError.value;
  }
  if (mobileExplorer.requestedRootPath.value) {
    return `Files for ${mobileExplorer.requestedRootPath.value} are not available yet.`;
  }
  return 'Files stay focused on one selected workspace, run, or team run at a time.';
});
const canChooseWorkspace = computed(() => mobileExplorer.resolutionStatus.value !== 'resolving');
const canRetryWorkspaceResolution = computed(() => mobileExplorer.resolutionStatus.value === 'unresolved');
const emptyMessage = computed(() => {
  if (workspaceSearchMode.value) return 'No files matched the workspace search.';
  if (search.value.trim() || activeDiscoveryFilter.value !== 'all') return 'No files match this view.';
  return 'This folder is empty.';
});
const previewFileState = computed(() => previewNode.value ? mobileExplorer.getOpenFileState(previewNode.value.path) : null);
const previewOpenError = computed(() => previewNode.value ? mobileExplorer.getFileOpenError(previewNode.value.path) : null);
const mobileWorkStore = useMobileWorkStore();
const isSearchLoading = mobileExplorer.isSearchLoading;
const searchError = mobileExplorer.searchError;
const resolveWorkspaceForContext = mobileExplorer.resolveWorkspaceForContext;
const isFolderLoading = mobileExplorer.isFolderLoading;
const getFolderError = mobileExplorer.getFolderError;

async function openNode(node: MobileWorkspaceFileNode): Promise<void> {
  if (node.is_file) {
    lastAttachmentCount.value = getVisibleContextAttachments(props.context).length;
    previewPresentation.value = 'fullscreen';
    previewAllowAttach.value = true;
    previewNode.value = node;
    await mobileExplorer.openFileReadOnly(node.path);
    return;
  }
  const loaded = await mobileExplorer.ensureFolderChildren(node);
  if (loaded) {
    folderStack.value = [...folderStack.value, node];
  }
}

async function consumeEventMonitorPreviewRequest(): Promise<void> {
  const request = mobileWorkStore.pendingFilePreviewRequest;
  const currentContext = props.context;
  const resolvedWorkspaceId = activeWorkspace.value?.workspaceId || '';
  const clearRequest = (revision: number): void => {
    mobileWorkStore.consumeFilePreviewRequest(revision);
    if (previewRequestInFlightRevision.value === revision) {
      previewRequestInFlightRevision.value = null;
    }
  };
  if (
    !request
  ) {
    previewRequestInFlightRevision.value = null;
    return;
  }

  if (!currentContext || mobileWorkContextKey(currentContext) !== request.contextKey) {
    clearRequest(request.revision);
    return;
  }
  if (!resolvedWorkspaceId) {
    if (mobileExplorer.resolutionStatus.value === 'resolving') return;
    clearRequest(request.revision);
    return;
  }
  if (resolvedWorkspaceId !== request.workspaceId || previewRequestInFlightRevision.value === request.revision) {
    if (resolvedWorkspaceId !== request.workspaceId) {
      clearRequest(request.revision);
    }
    return;
  }

  const requestRevision = request.revision;
  previewRequestInFlightRevision.value = requestRevision;
  try {
    await mobileExplorer.openFileReadOnly(request.relativePath);
  } finally {
    const latestRequest = mobileWorkStore.pendingFilePreviewRequest;
    const latestContext = props.context;
    const latestWorkspaceId = activeWorkspace.value?.workspaceId || '';
    const stillCurrent = latestRequest?.revision === requestRevision
      && latestContext
      && mobileWorkContextKey(latestContext) === request.contextKey
      && latestWorkspaceId === request.workspaceId;

    if (stillCurrent) {
      previewPresentation.value = request.presentation;
      previewAllowAttach.value = false;
      previewNode.value = {
        id: `event-monitor-${requestRevision}`,
        name: request.relativePath.split('/').filter(Boolean).at(-1) || request.relativePath,
        path: request.relativePath,
        is_file: true,
        children: [],
        childrenLoaded: true,
      };
    }
    clearRequest(requestRevision);
  }
}

function openCrumb(index: number): void {
  if (index <= 0) {
    folderStack.value = [];
    return;
  }
  folderStack.value = folderStack.value.slice(0, index);
}

function isNodeBusy(node: MobileWorkspaceFileNode): boolean {
  return !node.is_file && mobileExplorer.isFolderLoading(node.path);
}

function flattenFiles(node: MobileWorkspaceFileNode): MobileWorkspaceFileNode[] {
  const children = node.children ?? [];
  return children.flatMap((child) => child.is_file ? [child] : flattenFiles(child));
}

function isMarkdownOrCodePath(path: string): boolean {
  return /\.(c|cc|cpp|cs|css|go|h|hpp|html|java|js|json|jsx|kt|less|log|lua|md|mjs|php|py|rb|rs|sass|scss|sh|sql|swift|toml|ts|tsx|txt|vue|xml|ya?ml)$/i.test(path);
}

function clearSearchDebounce(): void {
  if (searchDebounce) {
    clearTimeout(searchDebounce);
    searchDebounce = null;
  }
}

watch(
  () => [search.value, deepSearch.value, mobileExplorer.workspaceId.value ?? ''] as const,
  ([query, deep, workspaceId]) => {
    clearSearchDebounce();
    if (!workspaceId) return;
    if (!deep) {
      void mobileExplorer.searchFiles('');
      return;
    }
    searchDebounce = setTimeout(() => {
      void mobileExplorer.searchFiles(query.trim());
    }, 250);
  },
  { immediate: true },
);

watch(() => activeWorkspace.value?.workspaceId, () => {
  folderStack.value = [];
  previewNode.value = null;
  deepSearch.value = false;
  activeDiscoveryFilter.value = 'all';
});

watch(
  [
    () => mobileWorkStore.pendingFilePreviewRequest,
    () => activeWorkspace.value?.workspaceId || '',
    () => props.context ? mobileWorkContextKey(props.context) : '',
  ],
  () => { void consumeEventMonitorPreviewRequest(); },
  { immediate: true, deep: true },
);

onBeforeUnmount(clearSearchDebounce);
</script>
