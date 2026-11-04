<template>
  <div class="workspace-history-panel flex h-full flex-col bg-white">
    <!-- left-panel-super-agents: the run section is your runs, newest first, each with the work it delegated nested underneath,
         live. No Workspaces or Projects view and no tabs; usually it is one run, because an agent with orchestration tools does the rest. -->
    <div class="border-t border-gray-200 pt-2" aria-hidden="true"></div>
    <div
      ref="treeScrollRef"
      id="run-section-panel"
      role="region"
      :aria-label="t('conversations.title')"
      class="min-h-0 flex-1 overflow-y-auto px-1 pb-2"
      data-test="workspace-history-tree-scroll"
    >
      <ConversationsList
        :workspace-nodes="workspaceNodes"
        :teams-of="workspaceTeams"
        :team-groups-of="workspaceTeamHistoryGroups"
        :loading="runHistoryStore.loading"
        :load-error="runHistoryStore.historyFamilyErrors?.workspace || runHistoryStore.agentOrgHistoryError || null"
        :on-retry="retryRunHistory"
        :state="sectionState"
        :avatars="sectionAvatarBindings"
        :actions="sectionActions"
      />
    </div>

    <ConfirmationModal
      :show="showDeleteConfirmation"
      :title="deleteConfirmationTitle"
      :message="deleteConfirmationMessage"
      :confirm-button-text="deleteConfirmationConfirmText"
      variant="danger"
      typography-size="large"
      @confirm="confirmDeleteRun"
      @cancel="closeDeleteConfirmation"
    />

  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import ConfirmationModal from '~/components/common/ConfirmationModal.vue';
import ConversationsList from '~/components/workspace/history/ConversationsList.vue';
import type {
  WorkspaceHistoryAvatarBindings,
  WorkspaceHistorySectionActions,
  WorkspaceHistorySectionState,
} from '~/components/workspace/history/workspaceHistorySectionContracts';
import { useRunHistoryStore } from '~/stores/runHistoryStore';
import { useAgentSelectionStore } from '~/stores/agentSelectionStore';
import { useAgentRunStore } from '~/stores/agentRunStore';
import { useAgentTeamRunStore } from '~/stores/agentTeamRunStore';
import { useAgentOrgRunStore } from '~/stores/agentOrgRunStore';
import { useAgentOrgContextsStore } from '~/stores/agentOrgContextsStore';
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore';
import { useAgentOrgDefinitionStore } from '~/stores/agentOrgDefinitionStore';
import { useAgentTeamDefinitionStore } from '~/stores/agentTeamDefinitionStore';
import { useToasts } from '~/composables/useToasts';
import { useRunHistoryAvatarState } from '~/composables/useRunHistoryAvatarState';
import { useWorkspaceHistorySelectionActions } from '~/composables/useWorkspaceHistorySelectionActions';
import { useWorkspaceHistoryTreeState } from '~/composables/useWorkspaceHistoryTreeState';
import { useRevealSelectedTreeRow } from '~/components/workspace/history/useRevealSelectedTreeRow';
import { chatRouteRunId } from '~/services/workspace/workspaceNavigationService';
import { useWorkspaceHistoryMutations } from '~/composables/useWorkspaceHistoryMutations';
import { useWorkspaceHistorySubjectActions } from '~/composables/useWorkspaceHistorySubjectActions';
import { useLocalization } from '~/composables/useLocalization';

const props = withDefaults(defineProps<{
  /** Whether the center shows a run (`useShellPrimaryNavigation().isWorkspacesActive`); gates the reveal. */
  runShown?: boolean;
}>(), { runShown: false });

const emit = defineEmits<{
  (e: 'run-selected', payload: { type: 'agent'; runId: string }): void;
  (e: 'run-selected', payload: { type: 'team'; runId: string }): void;
}>();

const HISTORY_REFRESH_INTERVAL_MS = 5000;

const runHistoryStore = useRunHistoryStore();
const agentOrgRunStore = useAgentOrgRunStore();
const agentOrgContextsStore = useAgentOrgContextsStore();
const route = useRoute() as ReturnType<typeof useRoute> | undefined;
const router = useRouter();
const selectionStore = useAgentSelectionStore();
const agentRunStore = useAgentRunStore();
const teamRunStore = useAgentTeamRunStore();
const { stopPendingTeamIds } = storeToRefs(teamRunStore);
const agentDefinitionStore = useAgentDefinitionStore();
const agentTeamDefinitionStore = useAgentTeamDefinitionStore();
const agentOrgDefinitionStore = useAgentOrgDefinitionStore();
const { addToast } = useToasts();
const { t } = useLocalization();
const addWorkspaceToast = (message: string, type: 'success' | 'error' | 'warning' | 'info'): void => {
  addToast(message, type === 'warning' ? 'info' : type);
};

const selectedAgentOrg = computed(() => {
  if (route?.query.rootSubjectKind !== 'agent_org') return null;
  const rootRunId = String(route.query.orgRunId || '').trim();
  if (!rootRunId) return null;
  return {
    rootRunId,
    focusAddress: agentOrgContextsStore.contextFor(rootRunId)?.selectedAddress ?? null,
    selection: agentOrgContextsStore.contextFor(rootRunId)?.selection ?? null,
  };
});
const treeState = useWorkspaceHistoryTreeState({
  runHistoryStore,
  selectionStore,
  selectedAgentOrg,
});
// When the panel appears, the open run's row is brought into view, only while a run is shown in the center
// (`runShown`: the shell's run highlight, passed by the host panel).
const treeScrollRef = ref<HTMLElement | null>(null);
useRevealSelectedTreeRow(treeScrollRef, computed(() => props.runShown));
const { workspaceNodes, workspaceTeams, workspaceTeamHistoryGroups } = treeState;
const { execute: executeSubjectAction } = useWorkspaceHistorySubjectActions();
const {
  getOrgAvatarUrl,
  showOrgAvatar,
  onOrgAvatarError,
  getAgentInitials,
  getTeamAvatarUrl,
  getTeamMemberDisplayName,
  getTeamMemberInitials,
  getTeamMemberAvatarUrl,
  showAgentAvatar,
  showTeamAvatar,
  showTeamMemberAvatar,
  onAgentAvatarError,
  onTeamAvatarError,
  onTeamMemberAvatarError,
} = useRunHistoryAvatarState({
  loading: computed(() => runHistoryStore.loading),
  agentDefinitions: computed(() => agentDefinitionStore.agentDefinitions),
  teamDefinitions: computed(() => agentTeamDefinitionStore.agentTeamDefinitions),
  orgDefinitions: computed(() => agentOrgDefinitionStore.definitions),
});

/** Leaves the Agent Org route when the open Org run was archived or deleted. */
const leaveRemovedAgentOrgRoute = async (orgRunId: string): Promise<void> => {
  if (route?.query.rootSubjectKind !== 'agent_org' || String(route.query.orgRunId || '').trim() !== orgRunId) return;
  await router.replace({ path: '/workspace' });
};

const {
  terminatingRunIds,
  deletingRunIds,
  deletingTeamIds,
  deletingAgentOrgIds,
  archivingRunIds,
  archivingTeamIds,
  archivingAgentOrgIds,
  showDeleteConfirmation,
  deleteConfirmationTitle,
  deleteConfirmationConfirmText,
  deleteConfirmationMessage,
  onTerminateRun,
  onTerminateTeam,
  onArchiveRun,
  onArchiveTeam,
  onArchiveAgentOrg,
  onDeleteRun,
  onDeleteTeam,
  onDeleteAgentOrg,
  closeDeleteConfirmation,
  confirmDeleteRun,
} = useWorkspaceHistoryMutations({
  terminateRun: (runId: string) => agentRunStore.terminateRun(runId),
  terminateTeamRun: (teamRunId: string) => teamRunStore.terminateTeamRun(teamRunId),
  removeDraftRun: async (runId: string) => {
    await agentRunStore.closeAgent(runId, { terminate: false });
    return true;
  },
  deleteRun: (runId: string) => runHistoryStore.deleteRun(runId),
  deleteTeamRun: (teamRunId: string) => runHistoryStore.deleteTeamRun(teamRunId),
  deleteAgentOrgRun: (orgRunId: string) => runHistoryStore.deleteAgentOrgRun(orgRunId),
  archiveRun: (runId: string) => runHistoryStore.archiveRun(runId),
  archiveTeamRun: (teamRunId: string) => runHistoryStore.archiveTeamRun(teamRunId),
  archiveAgentOrgRun: (orgRunId: string) => runHistoryStore.archiveAgentOrgRun(orgRunId),
  onAgentOrgMutationSuccess: (orgRunId: string) => leaveRemovedAgentOrgRoute(orgRunId),
  addToast: addWorkspaceToast,
  stopPendingTeamIds,
});

const {
  onSelectRun,
  onSelectTeam,
  onOpenTeamRun,
  onSelectTeamMember,
} = useWorkspaceHistorySelectionActions({
  runHistoryStore,
  selectionStore,
  setTeamExpanded: treeState.setTeamExpanded,
  toggleTeam: treeState.toggleTeam,
  expandTeamMemberAncestors: treeState.expandTeamMemberAncestors,
  emitRunSelected: (payload) => {
    if (payload.type === 'agent') {
      emit('run-selected', { type: 'agent', runId: payload.runId });
      return;
    }
    emit('run-selected', { type: 'team', runId: payload.runId });
  },
  startPresetChat: async () => undefined,
  presentTeamStreamRecoveryFeedback: (feedback) => {
    const key = feedback === 'wait'
      ? 'workspace.components.workspace.history.WorkspaceAgentRunsTreePanel.stream_recovery_wait'
      : 'workspace.components.workspace.history.WorkspaceAgentRunsTreePanel.stream_recovery_retry';
    addToast(t(key), 'info');
  },
});

const sectionState: WorkspaceHistorySectionState = {
  get selectedRunId() {
    // On Chat, the highlighted row is the displayed chat (none on New chat).
    if (route?.path?.startsWith('/chat')) return chatRouteRunId(route.query);
    return treeState.selectedRunId.value;
  },
  isTeamRunSelected: (teamRunId: string) =>
    selectionStore.selectedType === 'team' && selectionStore.selectedRunId === teamRunId,
  isRunTerminating: (runId: string) => Boolean(terminatingRunIds.value[runId]),
  isTeamTerminating: (teamRunId: string) => Boolean(stopPendingTeamIds.value[teamRunId]),
  isRunDeleting: (runId: string) => Boolean(deletingRunIds.value[runId]),
  isTeamDeleting: (teamRunId: string) => Boolean(deletingTeamIds.value[teamRunId]),
  isRunArchiving: (runId: string) => Boolean(archivingRunIds.value[runId]),
  isTeamArchiving: (teamRunId: string) => Boolean(archivingTeamIds.value[teamRunId]),
  formatRelativeTime: (isoTime: string) => runHistoryStore.formatRelativeTime(isoTime),
  isTeamExpanded: treeState.isTeamExpanded,
  isTeamMemberExpanded: treeState.isTeamMemberExpanded,
  toggleTeamMember: treeState.toggleTeamMember,
  isAgentOrgRunExpanded: treeState.isAgentOrgRunExpanded,
  toggleAgentOrgRun: treeState.toggleAgentOrgRun,
  isAgentOrgTeamExpanded: treeState.isAgentOrgTeamExpanded,
  toggleAgentOrgTeam: treeState.toggleAgentOrgTeam,
  isAgentOrgTaskTeamExpanded: treeState.isAgentOrgTaskTeamExpanded,
  toggleAgentOrgTaskTeam: treeState.toggleAgentOrgTaskTeam,
  isAgentOrgRunSelected: treeState.isAgentOrgRunSelected,
  isAgentOrgMemberSelected: treeState.isAgentOrgMemberSelected,
  agentOrgTerminationError: (rootRunId: string) => agentOrgRunStore.terminationErrors[rootRunId] ?? agentOrgContextsStore.errorFor(rootRunId),
  agentOrgContextFor: (rootRunId: string) => agentOrgContextsStore.contextFor(rootRunId),
  isAgentOrgTerminating: (rootRunId: string) => Boolean(agentOrgContextsStore.operations[rootRunId]) || agentOrgRunStore.terminatingRunIds.has(rootRunId),
  isAgentOrgDeleting: (rootRunId: string) => Boolean(deletingAgentOrgIds.value[rootRunId]),
  isAgentOrgArchiving: (rootRunId: string) => Boolean(archivingAgentOrgIds.value[rootRunId]),
};

const sectionAvatarBindings: WorkspaceHistoryAvatarBindings = {
  showAgentAvatar,
  onAgentAvatarError,
  getOrgAvatarUrl,
  showOrgAvatar,
  onOrgAvatarError,
  getAgentInitials,
  showTeamAvatar,
  getTeamAvatarUrl,
  onTeamAvatarError,
  showTeamMemberAvatar,
  getTeamMemberAvatarUrl,
  onTeamMemberAvatarError,
  getTeamMemberDisplayName,
  getTeamMemberInitials,
};

const sectionActions: WorkspaceHistorySectionActions = {
  onSelectRun,
  onTerminateRun,
  onArchiveRun,
  onDeleteRun,
  onSelectTeam,
  onOpenTeamRun,
  onTerminateTeam,
  onArchiveTeam,
  onDeleteTeam,
  onSelectTeamMember,
  onOpenAgentOrgRun: (run) => executeSubjectAction({
    rootSubjectKind: 'agent_org', rootRunId: run.rootRunId, action: 'open',
  }),
  onSelectAgentOrgMember: (run, memberAddress) => executeSubjectAction({
    rootSubjectKind: 'agent_org', rootRunId: run.rootRunId, action: 'select', memberAddress,
  }),
  onInspectAgentOrgExecution: (run, agentRunId, memberAddress) => executeSubjectAction({
    rootSubjectKind: 'agent_org', rootRunId: run.rootRunId, action: 'inspect', agentRunId, memberAddress,
  }),
  onArchiveAgentOrg,
  onDeleteAgentOrg,
  onTerminateAgentOrg: (run) => executeSubjectAction({
    rootSubjectKind: 'agent_org', rootRunId: run.rootRunId, action: 'stop',
  }).catch(() => undefined),
};

const retryRunHistory = (): void => { void runHistoryStore.fetchTree().catch(() => undefined); };

let refreshTimerId: ReturnType<typeof setInterval> | null = null;

onMounted(async () => {
  await Promise.all([
    runHistoryStore.loadWorkspaceCatalogForNavigation().catch(() => undefined),
    runHistoryStore.fetchTree().catch(() => undefined),
    agentDefinitionStore.fetchAllAgentDefinitions().catch(() => undefined),
    agentTeamDefinitionStore.fetchAllAgentTeamDefinitions().catch(() => undefined),
    agentOrgDefinitionStore.fetchAll().catch(() => undefined),
  ]);
  refreshTimerId = setInterval(() => {
    void runHistoryStore.refreshTreeQuietly();
  }, HISTORY_REFRESH_INTERVAL_MS);
});

onBeforeUnmount(() => {
  if (refreshTimerId !== null) {
    clearInterval(refreshTimerId);
    refreshTimerId = null;
  }
});
</script>

<style scoped>
.workspace-history-panel {
  container: workspace-history-panel / inline-size;
}
</style>
