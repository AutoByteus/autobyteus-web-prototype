<template>
  <section data-testid="mobile-team-messages-detail">
    <p v-if="!messages.length" class="px-4 py-10 text-center text-sm text-slate-500" data-testid="mobile-team-messages-empty">No messages yet</p>
    <template v-else>
      <article
        v-for="message in messages.slice(0, 20)"
        :key="message.messageId"
        class="border-b border-slate-100 px-4 py-3"
        data-testid="mobile-team-message-row"
      >
        <div class="flex items-baseline justify-between gap-3">
          <p class="min-w-0 truncate text-[0.9375rem] font-semibold text-slate-900">{{ counterpart(message) }}</p>
          <span class="shrink-0 text-xs text-slate-400">{{ formatTime(message.createdAt) }}</span>
        </div>
        <p class="mt-1 whitespace-pre-wrap break-words text-[0.9375rem] leading-6 text-slate-700">{{ message.content }}</p>

        <div v-if="message.referenceFiles.length" class="mt-1" data-testid="mobile-team-reference-list">
          <button
            v-for="reference in message.referenceFiles"
            :key="reference.referenceId"
            type="button"
            class="flex h-11 w-full items-center gap-3 text-left active:bg-slate-50"
            data-testid="mobile-team-reference-row"
            @click="openReference(message, reference)"
          >
            <Icon :icon="referenceFileIcon(reference)" class="h-5 w-5 shrink-0" aria-hidden="true" />
            <span class="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">{{ referenceFileName(reference.path) }}</span>
          </button>
        </div>
      </article>
    </template>

    <MobileTeamReferenceViewer
      v-if="selectedReferenceContext"
      :team-run-id="activeTeamContext ? activeTeamContext.view.getRootTeamRunId() : ''"
      :message-id="selectedReferenceContext.message.messageId"
      :reference="selectedReferenceContext.reference"
      :refresh-signal="referenceRefreshSignal"
      :preview-text="activeTeamContext ? undefined : sampleReferenceText(selectedReferenceContext.reference.path)"
      @close="selectedReferenceContext = null"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { sampleReferenceText, sampleTeamMessages } from '~/prototype/mobile-runs/mobileRunsFixture';
import MobileTeamReferenceViewer from '~/components/mobile/MobileTeamReferenceViewer.vue';
import { useAgentTeamContextsStore } from '~/stores/agentTeamContextsStore';
import { useAgentSelectionStore } from '~/stores/agentSelectionStore';
import type { CollaborationMessagePerspectiveRow } from '~/types/workspace/collaborationMessagesContextView';
import type { TeamReferenceFile } from '~/types/teamReferenceFile';
import type { MobileWorkContext } from '~/types/mobileWork';
import {
  referenceFileIcon,
  referenceFileName,
} from '~/utils/teamCommunication/referenceFilePresentation';
import { projectTeamCommunicationPerspective } from '~/utils/teamCommunication/teamCommunicationPerspective';

const props = defineProps<{
  context: MobileWorkContext | null;
}>();

const selectionStore = useAgentSelectionStore();
const teamContextsStore = useAgentTeamContextsStore();
const selectedReferenceContext = ref<{
  message: CollaborationMessagePerspectiveRow;
  reference: TeamReferenceFile;
} | null>(null);
const referenceRefreshSignal = ref(0);

const activeTeamContext = computed(() => {
  if (props.context?.kind !== 'team-run') return null;
  if (selectionStore.selectedType !== 'team' || selectionStore.selectedRunId !== props.context.teamRunId) return null;
  return teamContextsStore.getTeamContextById(props.context.teamRunId) ?? null;
});
const messages = computed<CollaborationMessagePerspectiveRow[]>(() => {
  const team = activeTeamContext.value;
  // Design-only: the reference carries no team context, so a member's run shows invented messages.
  if (!team) return props.context?.kind === 'agent-run' ? (sampleTeamMessages(props.context.runId) as CollaborationMessagePerspectiveRow[]) : [];
  return projectTeamCommunicationPerspective({
    view: team.view,
    messages: team.view.listCommunicationMessages(),
    focusedAgentRunId: team.view.getFocusedAgentRunId(),
  }).messages;
});

function openReference(
  message: CollaborationMessagePerspectiveRow,
  reference: TeamReferenceFile,
): void {
  if (
    selectedReferenceContext.value?.message.messageId === message.messageId
    && selectedReferenceContext.value.reference.referenceId === reference.referenceId
  ) {
    referenceRefreshSignal.value += 1;
  }
  selectedReferenceContext.value = { message, reference };
}

function messageLabel(message: CollaborationMessagePerspectiveRow): string {
  const raw = (message.messageType || 'message').replace(/[_-]+/g, ' ');
  return raw.replace(/\b\w/g, (char) => char.toUpperCase());
}

function counterpart(message: CollaborationMessagePerspectiveRow): string {
  const name = message.counterpartLabel || 'teammate';
  return message.direction === 'sent' ? `To ${name}` : `From ${name}`;
}

function formatTime(value: string): string {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return '';
  return new Date(timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
</script>
