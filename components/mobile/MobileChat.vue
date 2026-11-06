<template>
  <section class="flex h-full min-h-0 flex-1 flex-col overflow-hidden" data-testid="mobile-chat">
    <AgentEventMonitor
      v-if="selectedAgentContext"
      :conversation="selectedAgentContext.state.conversation"
      :run-id="selectedAgentContext.state.runId"
      :agent-name="selectedAgentContext.config.agentDefinitionName"
      :agent-avatar-url="selectedAgentContext.config.agentAvatarUrl"
      :presentation-revision="selectedAgentContext.state.eventMonitorPresentationRevision"
      :has-earlier-active-trace-events="selectedAgentContext.state.hasEarlierActiveTraceEvents"
      :browse-subject="{ kind: 'run', runId: selectedAgentContext.state.runId }"
      class="min-h-0 flex-1 overflow-hidden"
    >
      <template #composerContext>
        <MobileComposerContextTray :context="context" />
      </template>
    </AgentEventMonitor>
    <AgentTeamEventMonitor v-else-if="selectedTeamContext" :before-send="beforeSend" class="min-h-0 flex-1 overflow-hidden">
      <template #composerContext>
        <p
          v-if="pendingTeamAttachmentError"
          class="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800"
          data-testid="mobile-team-pending-attachments-error"
        >
          {{ pendingTeamAttachmentError }}
        </p>
        <MobileComposerContextTray :context="context" />
      </template>
    </AgentTeamEventMonitor>
    <p v-else class="flex min-h-0 flex-1 items-center justify-center text-sm text-slate-400" role="status" data-testid="mobile-chat-opening">Opening…</p>
  </section>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import MobileComposerContextTray from '~/components/mobile/MobileComposerContextTray.vue';
import { useMobilePendingTeamRunAttachments } from '~/composables/mobile/useMobilePendingTeamRunAttachments';
import AgentEventMonitor from '~/components/workspace/agent/AgentEventMonitor.vue';
import AgentTeamEventMonitor from '~/components/workspace/team/AgentTeamEventMonitor.vue';
import { useAgentContextsStore } from '~/stores/agentContextsStore';
import { useAgentTeamContextsStore } from '~/stores/agentTeamContextsStore';
import { useAgentSelectionStore } from '~/stores/agentSelectionStore';
import type { MobileWorkContext } from '~/types/mobileWork';

const props = defineProps<{
  context: MobileWorkContext | null;
}>();

const selectionStore = useAgentSelectionStore();
const agentContextsStore = useAgentContextsStore();
const teamContextsStore = useAgentTeamContextsStore();
const {
  beforeSend,
  error: pendingTeamAttachmentError,
} = useMobilePendingTeamRunAttachments(toRef(props, 'context'));

const selectedAgentContext = computed(() => {
  if (props.context?.kind !== 'agent-run') return null;
  if (selectionStore.selectedType !== 'agent' || selectionStore.selectedRunId !== props.context.runId) return null;
  return agentContextsStore.getRun(props.context.runId) ?? null;
});
const selectedTeamContext = computed(() => {
  if (props.context?.kind !== 'team-run') return null;
  if (selectionStore.selectedType !== 'team' || selectionStore.selectedRunId !== props.context.teamRunId) return null;
  return teamContextsStore.getTeamContextById(props.context.teamRunId) ?? null;
});
</script>
