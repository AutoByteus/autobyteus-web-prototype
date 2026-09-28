<template>
  <!-- chat-interface-entry: the unified message box, shared look with Chat.
       Attachments as chips (only when present); 📎, drop and paste anywhere;
       footer: 📎 … model · thinking · 🎤 · send/stop. -->
  <div
    ref="rootRef"
    class="relative rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow focus-within:border-gray-300 focus-within:shadow-md"
    data-test="run-composer"
    @dragover.prevent="dragging = true"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
    @paste="onPaste"
  >
    <div
      v-if="dragging"
      class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/80 text-sm font-medium text-blue-700"
      data-test="composer-drop-overlay"
    >
      Drop files to attach
    </div>
    <ContextFilePathInputArea ref="filesRef" />
    <AgentUserInputTextArea :before-send="beforeSend" :placeholder="placeholder">
      <template #footer-left>
        <button
          type="button"
          class="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          title="Attach files (or drag, drop, paste)"
          aria-label="Attach files"
          data-test="run-composer-attach"
          @click="filesRef?.triggerFileInput()"
        >
          <ChatGlyph name="paperclip" class="h-4 w-4" />
        </button>
      </template>
      <template #footer-right>
        <RunComposerModelControls />
      </template>
    </AgentUserInputTextArea>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ContextFilePathInputArea from '~/components/agentInput/ContextFilePathInputArea.vue';
import AgentUserInputTextArea from '~/components/agentInput/AgentUserInputTextArea.vue';
import RunComposerModelControls from '~/components/composer/RunComposerModelControls.vue';
import ChatGlyph from '~/components/chat/ChatGlyph.vue';

defineProps<{
  beforeSend?: () => void | Promise<void>;
  placeholder?: string;
}>();

const rootRef = ref<HTMLElement | null>(null);
const filesRef = ref<InstanceType<typeof ContextFilePathInputArea> | null>(null);
const dragging = ref(false);

const onDragLeave = (event: DragEvent) => {
  if (!rootRef.value?.contains(event.relatedTarget as Node | null)) dragging.value = false;
};
const onDrop = (event: DragEvent) => {
  dragging.value = false;
  void filesRef.value?.onFileDrop(event);
};
// Only pasted files (e.g. screenshots) become attachments; pasted text goes into
// the message. (The old per-row "paste file paths" behavior is not carried over.)
const onPaste = (event: ClipboardEvent) => {
  const hasFiles = Array.from(event.clipboardData?.items ?? []).some((item) => item.kind === 'file');
  if (hasFiles) void filesRef.value?.onPaste(event);
};
</script>
