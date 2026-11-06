<template>
  <div
    class="flex flex-col bg-white"
    :class="resolvedPresentation === 'fullscreen' ? 'fixed inset-0 z-50' : 'relative min-h-0 flex-1 border-t border-slate-200'"
    data-testid="mobile-file-viewer"
  >
    <header class="flex h-12 shrink-0 items-center gap-1 border-b border-slate-200 pl-1 pr-3">
      <button type="button" class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-slate-600 active:bg-slate-100" aria-label="Back to files" @click="$emit('close')">
        <Icon icon="heroicons:arrow-left-20-solid" class="h-6 w-6" aria-hidden="true" />
      </button>
      <h1 class="min-w-0 flex-1 truncate px-1 text-base font-semibold">{{ node.name }}</h1>
    </header>

    <div class="min-h-0 flex-1 overflow-hidden">
      <p v-if="viewerError" class="px-4 py-10 text-center text-sm text-red-700" data-testid="mobile-file-preview-error">Couldn’t open this file.</p>
      <p v-else-if="isLoading && !waited" class="px-4 py-10 text-center text-sm text-slate-400" data-testid="mobile-file-preview-loading" role="status">Opening…</p>
      <p v-else-if="isUnsupported" class="px-4 py-10 text-center text-sm text-slate-500" data-testid="mobile-file-preview-unsupported">This file can’t be shown on the phone.</p>
      <p v-else-if="isTooLarge" class="px-4 py-10 text-center text-sm text-slate-500" data-testid="mobile-file-preview-large">This file is too large to show on the phone.</p>
      <!-- Design-only: this reference has no file service (a read that never answers), so after a moment a file shows invented text. -->
      <pre v-else-if="!fileState || !fileState.content" class="h-full overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-[0.8125rem] leading-6 text-slate-800" data-testid="mobile-file-preview-content">{{ sampleReferenceText(node.path) }}</pre>
      <div v-else class="h-full min-h-0 overflow-hidden" data-testid="mobile-file-preview-content">
        <FileViewer
          :file="viewerFile"
          :mode="viewerMode"
          :read-only="true"
          :loading="fileState?.isLoading ?? false"
          :error="fileState?.error ?? null"
          class="h-full w-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref as vueRef } from 'vue';
import { Icon } from '@iconify/vue';
import { sampleReferenceText } from '~/prototype/mobile-runs/mobileRunsFixture';
import { computed, ref } from 'vue';
import FileViewer from '~/components/fileExplorer/FileViewer.vue';
import { useMobileFileContextCoordinator } from '~/composables/mobile/useMobileFileContextCoordinator';
import type { FileDataType, FileOpenMode, OpenFileState } from '~/stores/fileExplorerState';
import type { MobileWorkContext } from '~/types/mobileWork';

const MOBILE_FILE_VIEW_MAX_CHARS = 120_000;

type MobileFileNode = {
  name: string;
  path: string;
  is_file: boolean;
};

const props = withDefaults(defineProps<{
  node: MobileFileNode;
  workspaceId: string;
  context: MobileWorkContext | null;
  fileState: OpenFileState | null;
  openError?: string | null;
  presentation?: 'fullscreen' | 'inline';
  allowAttach?: boolean;
}>(), {
  presentation: 'fullscreen',
  allowAttach: true,
});

defineEmits<{
  close: [];
}>();

const coordinator = useMobileFileContextCoordinator();
const resolvedPresentation = computed(() => props.presentation ?? 'fullscreen');
const shouldAllowAttach = computed(() => props.allowAttach ?? true);
const attachNotice = ref<string | null>(null);
const maxCharsLabel = MOBILE_FILE_VIEW_MAX_CHARS.toLocaleString();
const viewerError = computed(() => props.openError || props.fileState?.error || null);
const waited = vueRef(false);
onMounted(() => { window.setTimeout(() => { waited.value = true; }, 700); });
const isLoading = computed(() => Boolean(props.fileState?.isLoading));
const fileType = computed<FileDataType>(() => props.fileState?.type ?? 'Text');
const isUnsupported = computed(() => fileType.value === 'Unsupported');
const previewContent = computed(() => props.fileState?.content ?? '');
const previewLengthLabel = computed(() => previewContent.value.length.toLocaleString());
const isTooLarge = computed(() => fileType.value === 'Text' && previewContent.value.length > MOBILE_FILE_VIEW_MAX_CHARS);
const canAttach = computed(() => props.node.is_file);
const viewerMode = computed<FileOpenMode>(() => {
  const lowerPath = props.node.path.toLowerCase();
  if (fileType.value === 'Text' && (lowerPath.endsWith('.md') || lowerPath.endsWith('.markdown'))) {
    return 'preview';
  }
  return 'edit';
});
const viewerFile = computed(() => ({
  path: props.node.path,
  type: fileType.value,
  content: props.fileState?.content ?? null,
  url: props.fileState?.url ?? null,
  relativeResourceContext: props.fileState?.relativeResourceContext ?? null,
}));

function attachFile(): void {
  const result = coordinator.attachWorkspaceFile(props.node.path, props.context);
  if (result.target === 'none') {
    attachNotice.value = `Open this run before attaching ${result.attachment.displayName}.`;
    return;
  }
  const targetLabel = result.target === 'active-run'
    ? 'current run Chat context'
    : result.target === 'pending-team-run'
      ? 'pending team run context'
      : 'the next mobile run launch';
  attachNotice.value = result.attached
    ? `${result.attachment.displayName} added to ${targetLabel}.`
    : `${result.attachment.displayName} is already attached to ${targetLabel}.`;
}
</script>
