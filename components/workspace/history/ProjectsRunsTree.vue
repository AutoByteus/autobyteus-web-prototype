<template>
  <!-- projects-left-navigation: the Projects mode of the run section. Each Project is a section shaped like a workspace's
       (agent and team groups, runs, delegated runs with their Task line). -->
  <div data-test="projects-runs-tree">
    <!-- First read. -->
    <div
      v-if="tree.read === 'loading' && !tree.hasLoaded"
      class="px-3 py-4 text-xs text-gray-500"
      role="status"
      data-test="projects-tree-loading"
    >{{ t('projectsTree.loading') }}</div>

    <!-- The first read failed: nothing to keep. -->
    <div
      v-else-if="tree.read === 'error' && !tree.hasLoaded"
      class="px-3 py-4"
      role="alert"
      data-test="projects-tree-error"
    >
      <p class="text-xs text-red-600">{{ t('projectsTree.error') }}</p>
      <button
        type="button"
        class="mt-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        data-test="projects-tree-retry"
        @click="tree.retry()"
      >{{ t('projectsTree.retry') }}</button>
    </div>

    <template v-else>
      <!-- A later read failed: the last good tree stays (REQ-011). -->
      <div
        v-if="tree.read === 'error'"
        class="mx-2 mb-1 flex items-center justify-between gap-2 rounded-md bg-red-50 px-2.5 py-1.5"
        role="alert"
        data-test="projects-tree-stale-error"
      >
        <p class="min-w-0 text-xs leading-4 text-red-700">{{ t('projectsTree.staleError') }}</p>
        <button
          type="button"
          class="flex-shrink-0 rounded px-1.5 py-0.5 text-xs font-medium text-red-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          data-test="projects-tree-retry"
          @click="tree.retry()"
        >{{ t('projectsTree.retry') }}</button>
      </div>

      <!-- No Projects on this node. -->
      <div
        v-if="tree.projectNodes.length === 0"
        class="px-3 py-5 text-center"
        data-test="projects-tree-empty"
      >
        <Icon icon="heroicons:briefcase" class="mx-auto h-6 w-6 text-gray-300" aria-hidden="true" />
        <p class="mt-2 text-sm font-medium text-gray-700">{{ t('projectsTree.emptyTitle') }}</p>
        <p class="mt-1 text-xs leading-5 text-gray-500">{{ t('projectsTree.emptyHelp') }}</p>
        <NuxtLink
          to="/projects/new"
          class="mt-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          data-test="projects-tree-empty-new"
        >{{ t('projectsTree.newProject') }}</NuxtLink>
      </div>

      <div v-else class="space-y-1">
        <WorkspaceHistoryWorkspaceSection
          v-for="entry in tree.projectNodes"
          :key="entry.node.stableKey"
          :workspace-node="entry.node"
          :workspace-teams="entry.teams"
          :workspace-team-history-groups="entry.teamHistoryGroups"
          :state="state"
          :avatars="avatars"
          :actions="actions"
          :project-scope="{
            projectId: entry.project.projectId,
            name: entry.project.name,
            selected: tree.selectedProjectId === entry.project.projectId,
            isStartedUnder: (runId: string) => tree.isStartedUnder(entry.project.projectId, runId),
          }"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import WorkspaceHistoryWorkspaceSection from '~/components/workspace/history/WorkspaceHistoryWorkspaceSection.vue';
import type {
  WorkspaceHistoryAvatarBindings,
  WorkspaceHistorySectionActions,
  WorkspaceHistorySectionState,
} from '~/components/workspace/history/workspaceHistorySectionContracts';
import { useLocalization } from '~/composables/useLocalization';
import { useProjectsTreeStore } from '~/stores/projectsTreeStore';

defineProps<{
  state: WorkspaceHistorySectionState;
  avatars: WorkspaceHistoryAvatarBindings;
  actions: WorkspaceHistorySectionActions;
}>();

const { t } = useLocalization();
const tree = useProjectsTreeStore();
</script>
