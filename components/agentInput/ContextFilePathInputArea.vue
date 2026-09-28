<template>
  <!-- chat-interface-entry: unified message box. Attachments render as the shared
       chip row only when present; upload, drop and paste are driven by the box. -->
  <input
    ref="fileInputRef"
    type="file"
    multiple
    class="hidden"
    :disabled="!activeContextStore.activeAgentContext"
    @change="onFileSelect"
  />
  <div
    v-if="displayedItems.length > 0"
    id="context-file-list"
    class="flex flex-wrap items-center gap-1.5 px-3 pt-3"
    data-test="context-file-chips"
  >
    <ComposerAttachmentChips
      :items="chipItems"
      @open="(key) => openByKey(key)"
      @remove="(key) => removeByKey(key)"
      @clear="clearAllContextFilePaths"
    />
  </div>

  <FullScreenImageModal
    v-if="selectedImageUrl"
    :visible="isImageModalVisible"
    :image-url="selectedImageUrl"
    alt-text="Context image preview"
    @close="closeImagePreview"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useContextAttachmentComposer } from '~/composables/useContextAttachmentComposer';
import { useActiveContextStore } from '~/stores/activeContextStore';
import { useContextFileUploadStore } from '~/stores/contextFileUploadStore';
import { useFileExplorerStore } from '~/stores/fileExplorer';
import { useWindowNodeContextStore } from '~/stores/windowNodeContextStore';
import { useWorkspaceStore } from '~/stores/workspace';
import type { AgentContext } from '~/types/agent/AgentContext';
import type { TreeNode } from '~/utils/fileExplorer/TreeNode';
import { getFilePathsFromFolder } from '~/utils/fileExplorer/fileUtils';
import { getContextAttachmentIcon } from '~/utils/contextFiles/contextAttachmentIcons';
import {
  buildAgentDraftContextFileOwner,
  buildOrgMemberDraftContextFileOwner,
  buildTeamMemberDraftContextFileOwner,
} from '~/utils/contextFiles/contextFileOwner';
import FullScreenImageModal from '~/components/common/FullScreenImageModal.vue';
import ComposerAttachmentChips, { type ComposerAttachmentItem } from '~/components/composer/ComposerAttachmentChips.vue';

const activeContextStore = useActiveContextStore();
const contextFileUploadStore = useContextFileUploadStore();
const fileExplorerStore = useFileExplorerStore();
const windowNodeContextStore = useWindowNodeContextStore();
const workspaceStore = useWorkspaceStore();

const activeContext = computed(() => activeContextStore.activeAgentContext);
const workspaceId = computed(
  () =>
    activeContext.value?.config.workspaceMetadata?.workspaceId ??
    activeContext.value?.config.workspaceId ??
    workspaceStore.activeWorkspaceMetadata?.workspaceId ??
    workspaceStore.activeWorkspace?.workspaceId ??
    null,
);
const isEmbeddedElectronRuntime = computed(
  () => windowNodeContextStore.isEmbeddedWindow && typeof window !== 'undefined' && Boolean(window.electronAPI),
);

const fileInputRef = ref<HTMLInputElement | null>(null);
const isContextListExpanded = ref(true);
const isImageModalVisible = ref(false);
const selectedImageUrl = ref<string | null>(null);

const resolveDraftOwnerForContext = (targetContext: AgentContext | null) => {
  const target = activeContextStore.activeWorkspaceTarget;
  if (!targetContext || !target || target.context !== targetContext) return null;
  // Configured Org drafts remain editable during transport synchronization;
  // retained task/standalone read-only targets do not acquire upload authority.
  if (target.access === 'read_only' && target.kind !== 'agent_org_direct_agent'
    && target.kind !== 'agent_org_team_member') return null;
  if ('root' in target) return buildOrgMemberDraftContextFileOwner(target.root.orgRunId, target.context.state.runId);
  if (target.kind === 'standalone_agent') return buildAgentDraftContextFileOwner(target.context.state.runId);
  return buildTeamMemberDraftContextFileOwner(target.team.rootRunId, target.team.focusedMemberAddress);
};

const getTargetForContext = (targetContext: AgentContext | null) => {
  if (!targetContext) {
    return null;
  }

  return {
    key: targetContext.state.runId,
    subject: targetContext,
    attachments: targetContext.contextFilePaths,
    draftOwner: resolveDraftOwnerForContext(targetContext),
  };
};

const {
  displayedItems,
  thumbnailItems,
  regularItems,
  appendLocatorAttachments,
  appendWorkspaceLocators,
  uploadFiles,
  openAttachment,
  removeItem,
  clearCurrentTargetAttachments,
  markImagePreviewAsFailed,
} = useContextAttachmentComposer<AgentContext>({
  getCurrentTarget: () => getTargetForContext(activeContext.value),
  commitAttachments: (target, updater) => {
    target.subject.contextFilePaths = updater(target.subject.contextFilePaths);
  },
  openWorkspaceFile: (locator, resolvedWorkspaceId) => {
    if (!resolvedWorkspaceId) return;
    const open = (workspaceIdToOpen: string) => fileExplorerStore.openFile(locator, workspaceIdToOpen);
    if (workspaceStore.workspaces[resolvedWorkspaceId]) {
      open(resolvedWorkspaceId);
      return;
    }
    const reference =
      activeContext.value?.config.workspaceMetadata ||
      workspaceStore.workspaceMetadataById[resolvedWorkspaceId] ||
      workspaceStore.activeWorkspaceMetadata;
    if (!reference) {
      return;
    }
    workspaceStore.ensureWorkspaceMetadata(reference)
      .then((workspace) => open(workspace.workspaceId))
      .catch((error) => console.warn('Failed to activate workspace for attachment:', error));
  },
  getWorkspaceId: () => workspaceId.value,
  getIsEmbeddedElectronRuntime: () => isEmbeddedElectronRuntime.value,
});

const toggleContextList = (): void => {
  if (displayedItems.value.length > 0) {
    isContextListExpanded.value = !isContextListExpanded.value;
    return;
  }
  isContextListExpanded.value = true;
};

const closeImagePreview = (): void => {
  isImageModalVisible.value = false;
  selectedImageUrl.value = null;
};

const openItem = (item: (typeof displayedItems.value)[number]): void => {
  if (item.isUploading || !item.attachment) {
    return;
  }

  if (item.type === 'Image' && item.previewUrl) {
    selectedImageUrl.value = item.previewUrl;
    isImageModalVisible.value = true;
    return;
  }

  openAttachment(item.attachment);
};

const handleRemoveItem = (item: (typeof displayedItems.value)[number]): void => {
  void removeItem(item);
};

const clearAllContextFilePaths = async (): Promise<void> => {
  await clearCurrentTargetAttachments();
  isContextListExpanded.value = true;
};

const triggerFileInput = (): void => {
  if (activeContext.value) {
    fileInputRef.value?.click();
  }
};

const onFileSelect = async (event: Event): Promise<void> => {
  const input = event.target as HTMLInputElement;
  const files = input.files ? Array.from(input.files) : [];
  if (files.length > 0) {
    isContextListExpanded.value = true;
    await uploadFiles(files);
  }
  input.value = '';
};

const onFileDrop = async (event: DragEvent): Promise<void> => {
  const targetContext = activeContext.value;
  if (!targetContext) {
    return;
  }

  const target = getTargetForContext(targetContext);
  if (!target) {
    return;
  }

  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) {
    return;
  }

  const dragData = dataTransfer.getData('application/json');
  if (dragData) {
    try {
      const droppedNode = JSON.parse(dragData) as TreeNode;
      appendWorkspaceLocators(getFilePathsFromFolder(droppedNode), target);
      isContextListExpanded.value = true;
    } catch (error) {
      console.error('Failed to parse dropped file explorer payload:', error);
    }
    return;
  }

  if (windowNodeContextStore.isEmbeddedWindow && dataTransfer.files.length > 0 && window.electronAPI) {
    const nativePaths = (
      await Promise.all(Array.from(dataTransfer.files).map((file) => window.electronAPI.getPathForFile(file)))
    ).filter((value): value is string => Boolean(value));
    appendWorkspaceLocators(nativePaths, target);
    isContextListExpanded.value = true;
    return;
  }

  if (dataTransfer.files.length > 0) {
    isContextListExpanded.value = true;
    await uploadFiles(Array.from(dataTransfer.files), target);
  }
};

const onPaste = async (event: ClipboardEvent): Promise<void> => {
  const targetContext = activeContext.value;
  const clipboardData = event.clipboardData;
  if (!targetContext || !clipboardData) {
    return;
  }

  const target = getTargetForContext(targetContext);
  if (!target) {
    return;
  }

  const fileLikes = Array.from(clipboardData.items ?? [])
    .filter((item) => item.kind === 'file')
    .map((item) => item.getAsFile())
    .filter((file): file is File => file !== null);

  if (fileLikes.length > 0) {
    event.preventDefault();
    isContextListExpanded.value = true;
    await uploadFiles(fileLikes, target);
    return;
  }

  const pastedText = clipboardData.getData('text/plain');
  if (!pastedText.trim()) {
    return;
  }

  event.preventDefault();
  await appendLocatorAttachments(pastedText.split(/\r?\n/), target);
  isContextListExpanded.value = true;
};

watch(
  () => displayedItems.value.length,
  (itemCount) => {
    if (itemCount === 0 && !isContextListExpanded.value) {
      isContextListExpanded.value = true;
    }
  },
);

const chipItems = computed<ComposerAttachmentItem[]>(() => displayedItems.value.map((item) => ({
  key: item.key,
  label: item.label,
  kind: item.type === 'Image' && item.previewUrl ? 'image' : 'file',
  previewUrl: item.previewUrl ?? null,
  uploading: Boolean(item.isUploading),
})));
const openByKey = (key: string): void => {
  const item = displayedItems.value.find((candidate) => candidate.key === key);
  if (item) openItem(item);
};
const removeByKey = (key: string): void => {
  const item = displayedItems.value.find((candidate) => candidate.key === key);
  if (item) handleRemoveItem(item);
};

defineExpose({ triggerFileInput, onFileDrop, onPaste, hasItems: computed(() => displayedItems.value.length > 0) });
</script>

<style scoped>
.thumbnail-button {
  display: inline-flex;
  width: 42px;
  height: 42px;
  border-radius: 0.375rem;
  overflow: hidden;
  border: 1px solid #d1d5db;
  transition: box-shadow 0.2s ease;
}

.thumbnail-button:hover {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.35);
}

.thumbnail-row-container {
  overflow-x: auto;
  padding: 0.125rem 0.125rem 0.375rem 0.125rem;
}

.thumbnail-row {
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
  min-width: max-content;
}

.thumbnail-card {
  position: relative;
  flex: 0 0 auto;
}

.thumbnail-remove-button {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background-color: #ef4444;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.thumbnail-card:hover .thumbnail-remove-button {
  opacity: 1;
}

.thumbnail-remove-button:disabled {
  opacity: 0.55;
}

.thumbnail-uploading {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  font-size: 0.625rem;
  line-height: 1;
  color: #1d4ed8;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
}

.context-image-thumbnail,
.thumbnail-fallback {
  width: 42px;
  height: 42px;
}

.context-image-thumbnail {
  object-fit: cover;
  display: block;
  background: #f3f4f6;
}

.thumbnail-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  background: #f3f4f6;
}
</style>
