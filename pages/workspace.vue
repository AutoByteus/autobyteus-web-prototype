<template>
  <div class="flex flex-col h-full bg-gray-100 font-sans text-gray-800">
    <AgentOrgRuntimeExperience v-if="agentOrgReviewActive" />
    <template v-else>
      <WorkspaceAdaptiveLayout :show-file-content="showFileContent" />
      <NestedTeamHierarchyReviewPanel />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useFileExplorerStore } from '~/stores/fileExplorer';
import { useServerSettingsStore } from '~/stores/serverSettings';
import { useWorkspaceStore } from '~/stores/workspace';
import { useWorkspaceRouteSelection } from '~/composables/workspace/useWorkspaceRouteSelection';
import WorkspaceAdaptiveLayout from '~/components/layout/WorkspaceAdaptiveLayout.vue';
import NestedTeamHierarchyReviewPanel from '~/components/workspace/history/NestedTeamHierarchyReviewPanel.vue';
import AgentOrgRuntimeExperience from '~/components/workspace/AgentOrgRuntimeExperience.vue';
import { useAgentOrgPrototypeReview } from '~/composables/useAgentOrgPrototypeReview';

const fileExplorerStore = useFileExplorerStore();
const serverSettingsStore = useServerSettingsStore();
const workspaceStore = useWorkspaceStore();
const { active: agentOrgReviewActive } = useAgentOrgPrototypeReview();

useWorkspaceRouteSelection();

const showFileContent = computed(() => {
    const wsId = workspaceStore.activeWorkspace?.workspaceId || workspaceStore.activeWorkspaceMetadata?.workspaceId;
    return wsId ? fileExplorerStore.getOpenFiles(wsId).length > 0 : false;
});

onMounted(() => {
  console.log('Workspace.vue: Mounted. Fetching server settings and loading profiles...');

  serverSettingsStore.fetchServerSettings().catch(error => {
    console.error('Workspace.vue: Failed to fetch server settings on mount:', error);
  });
});
</script>
