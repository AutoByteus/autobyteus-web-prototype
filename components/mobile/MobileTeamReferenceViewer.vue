<template>
  <div class="fixed inset-0 z-50 flex flex-col bg-white" data-testid="mobile-team-reference-viewer">
    <header class="flex h-12 shrink-0 items-center gap-2 border-b border-slate-200 pl-1 pr-3">
      <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full text-slate-600 active:bg-slate-100" aria-label="Back to messages" data-testid="mobile-team-reference-back" @click="$emit('close')">
        <Icon icon="heroicons:arrow-left-20-solid" class="h-6 w-6" aria-hidden="true" />
      </button>
      <Icon :icon="referenceFileIcon(reference)" class="h-5 w-5 shrink-0" aria-hidden="true" />
      <h1 class="min-w-0 flex-1 truncate text-base font-semibold">{{ referenceFileName(reference.path) }}</h1>
    </header>
    <pre v-if="previewText !== undefined" class="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-[0.8125rem] leading-6 text-slate-800" data-testid="mobile-team-reference-text">{{ previewText }}</pre>
    <div v-else class="min-h-0 flex-1 overflow-hidden bg-white">
      <CollaborationMessageReferenceViewer
        :content-path="contentPath"
        :reference="reference"
        :refresh-signal="refreshSignal"
        :disable-rich-text-preview="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import CollaborationMessageReferenceViewer from '~/components/workspace/collaboration/CollaborationMessageReferenceViewer.vue';
import type { TeamReferenceFile } from '~/types/teamReferenceFile';
import {
  referenceFileIcon,
  referenceFileName,
} from '~/utils/teamCommunication/referenceFilePresentation';

const props = defineProps<{
  teamRunId: string;
  messageId: string;
  reference: TeamReferenceFile;
  refreshSignal?: number;
  /** Design-only: shown instead of the file read through the team's message. */
  previewText?: string;
}>();

const contentPath = computed(() =>
  `team-runs/${encodeURIComponent(props.teamRunId)}/team-communication/messages/${encodeURIComponent(props.messageId)}/references/${encodeURIComponent(props.reference.referenceId)}/content`,
);

defineEmits<{
  close: [];
}>();
</script>
