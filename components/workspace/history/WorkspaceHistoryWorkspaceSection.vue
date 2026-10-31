<template>
  <section class="rounded-md">
    <!-- projects-left-navigation: a Project's row. The chevron only opens or closes it; the name selects it (the
         right Projects board follows) and opens it when closed; "+" runs an agent or team under it. -->
    <div
      v-if="projectScope"
      class="group/project-row flex items-center rounded-md text-sm transition-colors focus-within:bg-gray-50"
      :class="projectScope.selected ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'"
      data-test="project-row"
      :data-project-id="projectScope.projectId"
    >
      <button
        type="button"
        class="flex flex-shrink-0 items-center self-stretch rounded-l-md py-1.5 pl-2 pr-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
        data-test="project-row-disclosure"
        :aria-expanded="state.isWorkspaceExpanded(workspacePresentationId)"
        :aria-label="t(state.isWorkspaceExpanded(workspacePresentationId) ? 'projectsTree.collapseProject' : 'projectsTree.expandProject', { name: projectScope.name })"
        :title="t(state.isWorkspaceExpanded(workspacePresentationId) ? 'projectsTree.collapseProject' : 'projectsTree.expandProject', { name: projectScope.name })"
        @click="state.toggleWorkspace(workspaceNode)"
      >
        <Icon
          icon="heroicons:chevron-down-20-solid"
          class="h-4 w-4 text-gray-400 transition-transform"
          :class="state.isWorkspaceExpanded(workspacePresentationId) ? 'rotate-0' : '-rotate-90'"
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        class="flex min-w-0 flex-1 items-center py-1.5 pr-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
        data-test="project-row-select"
        :aria-current="projectScope.selected ? 'true' : undefined"
        :title="t('projectsTree.selectProject', { name: projectScope.name })"
        @click="actions.onSelectProject?.(projectScope.projectId)"
      >
        <Icon icon="heroicons:folder" class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-500" aria-hidden="true" />
        <span class="truncate" :class="projectScope.selected ? 'font-semibold' : ''">{{ projectScope.name }}</span>
      </button>
      <button
        type="button"
        class="mr-2 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        data-test="project-run-add"
        :title="t('projectsTree.runUnderProject', { name: projectScope.name })"
        :aria-label="t('projectsTree.runUnderProject', { name: projectScope.name })"
        @click="actions.onCreateProjectRun?.(projectScope.projectId, null)"
      >
        <Icon icon="heroicons:plus-20-solid" class="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
    <div
      v-else
      class="group/workspace-row flex items-center rounded-md text-sm text-gray-700 transition-colors hover:bg-gray-50 focus-within:bg-gray-50"
      data-test="workspace-row"
      :data-workspace-id="workspaceNode.workspaceId"
      :data-workspace-root="workspaceNode.workspaceRootPath"
      :aria-expanded="state.isWorkspaceExpanded(workspacePresentationId)"
    >
      <button
        type="button"
        class="flex min-w-0 flex-1 items-center px-2 py-1.5 text-left"
        :aria-expanded="state.isWorkspaceExpanded(workspacePresentationId)"
        @click="state.toggleWorkspace(workspaceNode)"
      >
        <Icon
          icon="heroicons:chevron-down-20-solid"
          class="mr-1.5 h-4 w-4 text-gray-400 transition-transform"
          :class="state.isWorkspaceExpanded(workspacePresentationId) ? 'rotate-0' : '-rotate-90'"
        />
        <Icon icon="heroicons:folder-20-solid" class="mr-1.5 h-4 w-4 text-gray-500" />
        <span class="truncate">{{ workspaceDisplayName }}</span>
      </button>
      <button
        v-if="workspaceNode.canRemoveFromWorkspaces"
        type="button"
        class="mr-1 inline-flex h-6 w-6 items-center justify-center rounded text-gray-400 transition-[opacity,color,background-color] duration-150 hover:bg-red-50 hover:text-red-600 focus:opacity-100 md:opacity-0 md:group-hover/workspace-row:opacity-100 md:group-focus-within/workspace-row:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
        :title="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.remove_from_workspaces')"
        :aria-label="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.remove_from_workspaces')"
        :disabled="state.isWorkspaceRemoving(workspaceNode.workspaceId)"
        @click.stop="actions.onRemoveWorkspace(workspaceNode)"
      >
        <Icon icon="heroicons:x-mark-20-solid" class="h-4 w-4" />
      </button>
    </div>

    <div v-if="state.isWorkspaceExpanded(workspacePresentationId)" class="ml-2 mt-0.5 space-y-1">
      <div
        v-if="!projectScope && state.isWorkspaceHistoryLoading(workspaceNode.workspaceId)"
        class="px-3 py-1 text-xs text-gray-400"
      >{{$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.loading_workspace_history')}}</div>
      <div
        v-if="!projectScope && state.workspaceHistoryError(workspaceNode.workspaceId)"
        class="px-3 py-1 text-xs text-red-500"
      >{{ state.workspaceHistoryError(workspaceNode.workspaceId) }}</div>
      <div
        v-if="!state.isWorkspaceHistoryLoading(workspaceNode.workspaceId)
          && !state.workspaceHistoryError(workspaceNode.workspaceId)
          && workspaceNode.agents.length === 0
          && workspaceTeams.length === 0
          && !(workspaceNode.agentOrgDefinitions?.length)"
        class="px-3 py-1 text-xs text-gray-400"
      >{{ projectScope ? t('projectsTree.noRuns') : $t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.no_task_history_in_this_workspace') }}</div>

      <div
        v-for="agentNode in workspaceNode.agents"
        :key="agentNode.agentDefinitionId"
        class="rounded-md"
      >
        <div
          class="group/agent-header flex items-center justify-between rounded-md px-2 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-50"
        >
          <button
            type="button"
            class="flex min-w-0 flex-1 items-center text-left"
            data-test="workspace-agent-row"
            :data-workspace-root="workspaceNode.workspaceRootPath"
            :data-agent-definition-id="agentNode.agentDefinitionId"
            :aria-expanded="state.isAgentExpanded(workspacePresentationId, agentNode.agentDefinitionId)"
            @click="state.toggleAgent(workspacePresentationId, agentNode.agentDefinitionId)"
          >
            <Icon
              icon="heroicons:chevron-down-20-solid"
              class="mr-1 h-3.5 w-3.5 text-gray-400 transition-transform"
              :class="state.isAgentExpanded(workspacePresentationId, agentNode.agentDefinitionId) ? 'rotate-0' : '-rotate-90'"
            />
            <span
              class="mr-1.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-[0.625rem] font-semibold text-gray-600"
            >
              <img
                v-if="avatars.showAgentAvatar(workspaceNode.workspaceRootPath, agentNode.agentDefinitionId, agentNode.agentAvatarUrl)"
                :src="agentNode.agentAvatarUrl || ''"
                :alt="`${agentNode.agentName} avatar`"
                class="h-full w-full object-cover"
                @error="avatars.onAgentAvatarError(workspaceNode.workspaceRootPath, agentNode.agentDefinitionId, agentNode.agentAvatarUrl)"
              >
              <span v-else>{{ avatars.getAgentInitials(agentNode.agentName) }}</span>
            </span>
            <span class="truncate font-medium">{{ agentNode.agentName }}</span>
            <span class="ml-1 text-xs text-gray-400">({{ agentNode.runs.length }})</span>
            <!-- agent-definition-reconnect-ui: the agent of these runs no longer exists. -->
            <Icon
              v-if="reconnect.isDefinitionMissing(agentNode.agentDefinitionId)"
              icon="heroicons:exclamation-triangle-20-solid"
              class="ml-1.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500"
              role="img"
              :aria-label="$t('reconnect.tree.missing', { id: agentNode.agentDefinitionId })"
              data-test="workspace-agent-missing"
            />
          </button>

          <div class="ml-2 flex flex-shrink-0 items-center gap-1">
          <button
            v-if="actions.onArchiveAgentGroup && canArchiveAgentGroup(agentNode)"
            type="button"
            :data-test="`workspace-agent-group-archive-${agentNode.agentDefinitionId}`"
            class="inline-flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-[opacity,color,background-color] duration-150 hover:bg-amber-50 hover:text-amber-600 focus:opacity-100 md:opacity-0 md:group-hover/agent-header:opacity-100 md:group-focus-within/agent-header:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
            :title="$t('workspace.history.groupArchive.archiveAll')"
            :aria-label="$t('workspace.history.groupArchive.archiveAll')"
            :disabled="isGroupArchiving(projectScope ? `agent_runs:${workspaceNode.stableKey}:${agentNode.agentDefinitionId}` : agentGroupArchiveKey(workspaceNode.workspaceRootPath, agentNode.agentDefinitionId))"
            @click.stop="actions.onArchiveAgentGroup(workspaceNode, agentNode)"
          >
            <Icon icon="heroicons:archive-box-20-solid" class="h-3.5 w-3.5" />
          </button>
          <!-- agent-definition-reconnect-ui: no new run with an agent that no longer exists. -->
          <button
            v-if="!reconnect.isDefinitionMissing(agentNode.agentDefinitionId)"
            type="button"
            class="inline-flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
            :title="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.new_run_with_this_agent')"
            @click="createGroupRun(agentNode.agentDefinitionId)"
          >
            <Icon icon="heroicons:plus-20-solid" class="h-4 w-4" />
          </button>
          </div>
        </div>

        <div
          v-if="state.isAgentExpanded(workspacePresentationId, agentNode.agentDefinitionId)"
          class="ml-3 space-y-0.5"
        >
          <template v-for="run in agentNode.runs" :key="run.runId">
          <button
            type="button"
            data-test="workspace-agent-run-row"
            :data-run-id="run.runId"
            :aria-current="state.selectedRunId === run.runId && !collaboration.selectedChild(run.runId) ? 'true' : undefined"
            class="group/run-row flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors"
            :class="state.selectedRunId === run.runId && !collaboration.selectedChild(run.runId)
              ? 'bg-indigo-50 text-indigo-900'
              : 'text-gray-700 hover:bg-gray-50'"
            @click="selectAgentRun(run)"
          >
            <div class="min-w-0 flex items-center">
              <StatusDot class="mr-2" :status="run.currentStatus" />
              <span class="truncate">
                {{ formatRunLabel(run.summary) }}
              </span>
            </div>
            <div class="ml-2 flex flex-shrink-0 items-center gap-1">
              <button
                v-if="run.isActive"
                type="button"
                data-test="terminate-agent-run"
                :data-run-id="run.runId"
                class="inline-flex h-5 w-5 items-center justify-center rounded text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:text-gray-400 disabled:hover:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
                :title="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.terminate_run')"
                :aria-label="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.terminate_run')"
                :disabled="state.isRunTerminating(run.runId)"
                @click.stop="actions.onTerminateRun(run.runId)"
              >
                <Icon icon="heroicons:stop-20-solid" class="h-3.5 w-3.5" />
              </button>
              <button
                v-else-if="run.source === 'draft'"
                type="button"
                class="inline-flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-[opacity,color,background-color] duration-150 hover:bg-red-50 hover:text-red-600 md:opacity-0 md:group-hover/run-row:opacity-100 md:group-focus-within/run-row:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                :title="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.remove_draft_run')"
                :disabled="state.isRunDeleting(run.runId)"
                @click.stop="actions.onDeleteRun(run)"
              >
                <Icon icon="heroicons:trash-20-solid" class="h-3.5 w-3.5" />
              </button>
              <button
                v-else-if="run.source === 'history' && !run.isActive"
                type="button"
                class="inline-flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-[opacity,color,background-color] duration-150 hover:bg-amber-50 hover:text-amber-600 md:opacity-0 md:group-hover/run-row:opacity-100 md:group-focus-within/run-row:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                :title="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.archive_run')"
                :disabled="state.isRunArchiving(run.runId) || state.isRunDeleting(run.runId)"
                @click.stop="actions.onArchiveRun(run)"
              >
                <Icon icon="heroicons:archive-box-20-solid" class="h-3.5 w-3.5" />
              </button>
              <button
                v-if="run.source === 'history' && !run.isActive"
                type="button"
                class="inline-flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-[opacity,color,background-color] duration-150 hover:bg-red-50 hover:text-red-600 md:opacity-0 md:group-hover/run-row:opacity-100 md:group-focus-within/run-row:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                :title="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.delete_run_permanently')"
                :disabled="state.isRunDeleting(run.runId) || state.isRunArchiving(run.runId)"
                @click.stop="actions.onDeleteRun(run)"
              >
                <Icon icon="heroicons:trash-20-solid" class="h-3.5 w-3.5" />
              </button>
              <span class="text-xs text-gray-400">
                {{ formatRelativeTime(run.lastActivityAt) }}
              </span>
            </div>
          </button>
          <!-- Task Agents and task Teams brought into this run with `@`. -->
          <AgentRunTaskRows
            :run-id="run.runId"
            :label="formatRunLabel(run.summary)"
            :run-selected="state.selectedRunId === run.runId"
            :has-collaboration="run.hasCollaboration === true"
            :project-scope="projectScope ? { projectId: projectScope.projectId, startedUnder: projectScope.isStartedUnder(run.runId) } : null"
            @select-run="actions.onSelectRun(run)"
            @open-run="selectAgentRun(run)"
          />
          </template>
        </div>
      </div>

      <div
        v-if="workspaceTeams.length > 0"
        class="mt-1 space-y-0.5"
      >
        <div class="px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">
          Teams
        </div>
        <div
          v-for="group in groupedTeamDefinitions"
          :key="group.key"
          class="rounded-md"
        >
          <div class="group/team-header flex items-center rounded-md px-2 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-50">
          <button
            type="button"
            class="flex min-w-0 flex-1 items-center text-left"
            :data-test="`workspace-team-definition-row-${group.key}`"
            :aria-expanded="state.isTeamDefinitionExpanded(workspacePresentationId, group.key)"
            @click="state.toggleTeamDefinition(workspacePresentationId, group.key)"
          >
            <Icon
              icon="heroicons:chevron-down-20-solid"
              class="mr-1 h-3.5 w-3.5 text-gray-400 transition-transform"
              :class="state.isTeamDefinitionExpanded(workspacePresentationId, group.key) ? 'rotate-0' : '-rotate-90'"
            />
            <TeamAggregateStatusDot
              class="mr-1.5"
              :status="teamDefinitionGroupStatus(group.runs)"
            />
            <span
              class="mr-1.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-[0.625rem] font-semibold text-gray-600"
            >
              <img
                v-if="avatars.showTeamAvatar(group.representativeRun)"
                :key="avatars.getTeamAvatarUrl(group.representativeRun)"
                :src="avatars.getTeamAvatarUrl(group.representativeRun)"
                :alt="`${group.teamDefinitionName} avatar`"
                class="h-full w-full object-cover"
                @error="avatars.onTeamAvatarError(group.representativeRun, ($event.target as HTMLImageElement).getAttribute('src') || '')"
              >
              <Icon v-else icon="heroicons:user-group-20-solid" class="h-3.5 w-3.5" />
            </span>
            <span class="truncate font-medium">{{ group.teamDefinitionName }}</span>
            <span class="ml-1 text-xs text-gray-400">({{ group.runs.length }})</span>
          </button>
          <button
            v-if="actions.onArchiveTeamGroup"
            type="button"
            :data-test="`workspace-team-group-archive-${group.key}`"
            class="ml-2 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-gray-400 transition-[opacity,color,background-color] duration-150 hover:bg-amber-50 hover:text-amber-600 focus:opacity-100 md:opacity-0 md:group-hover/team-header:opacity-100 md:group-focus-within/team-header:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
            :title="$t('workspace.history.groupArchive.archiveAll')"
            :aria-label="$t('workspace.history.groupArchive.archiveAll')"
            :disabled="isGroupArchiving(teamGroupArchiveKey(workspacePresentationId, group.key))"
            @click.stop="actions.onArchiveTeamGroup(workspacePresentationId, group)"
          >
            <Icon icon="heroicons:archive-box-20-solid" class="h-3.5 w-3.5" />
          </button>
          <button
            v-if="projectScope && actions.onCreateProjectRun"
            type="button"
            :data-test="`project-team-group-add-${group.key}`"
            class="ml-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            :title="t('projectsTree.newTeamRun')"
            :aria-label="t('projectsTree.newTeamRun')"
            @click.stop="actions.onCreateProjectRun(projectScope.projectId, { kind: 'team', definitionId: group.teamDefinitionId })"
          >
            <Icon icon="heroicons:plus-20-solid" class="h-4 w-4" aria-hidden="true" />
          </button>
          </div>

          <div v-if="state.isTeamDefinitionExpanded(workspacePresentationId, group.key)" class="ml-3 mt-0.5 space-y-0.5">
            <div
              v-for="team in group.runs"
              :key="team.teamRunId"
              class="rounded-md"
            >
              <div class="group/team-row flex items-center justify-between rounded-md px-2 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                <button
                  type="button"
                  class="flex min-w-0 flex-1 items-center text-left"
                  :data-test="`workspace-team-row-${team.teamRunId}`"
                  :aria-expanded="state.isTeamExpanded(team.teamRunId)"
                  @click="actions.onSelectTeam(team, workspaceNode.workspaceId)"
                >
                  <Icon
                    icon="heroicons:chevron-down-20-solid"
                    class="mr-1 h-3.5 w-3.5 flex-shrink-0 text-gray-400 transition-transform"
                    :class="state.isTeamExpanded(team.teamRunId) ? 'rotate-0' : '-rotate-90'"
                    data-test="workspace-team-run-disclosure"
                  />
                  <TeamAggregateStatusDot
                    class="mr-1.5"
                    :status="teamRunStatus(team)"
                  />
                  <span class="truncate font-medium">{{ formatTeamRunLabel(team) }}</span>
                </button>

                <div class="ml-2 flex flex-shrink-0 items-center gap-1">
                  <button
                    v-if="team.isActive"
                    type="button"
                    class="inline-flex h-5 w-5 items-center justify-center rounded text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:text-gray-400 disabled:hover:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
                    :title="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.terminate_team')"
                    :aria-label="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.terminate_team')"
                    :disabled="state.isTeamTerminating(team.teamRunId)"
                    @click.stop="actions.onTerminateTeam(team.teamRunId)"
                  >
                    <Icon icon="heroicons:stop-20-solid" class="h-3.5 w-3.5" />
                  </button>
                  <button
                    v-if="!team.isActive && team.deleteLifecycle === 'READY'"
                    type="button"
                    class="inline-flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-[opacity,color,background-color] duration-150 hover:bg-amber-50 hover:text-amber-600 md:opacity-0 md:group-hover/team-row:opacity-100 md:group-focus-within/team-row:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                    :title="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.archive_team_history')"
                    :disabled="state.isTeamArchiving(team.teamRunId) || state.isTeamDeleting(team.teamRunId) || state.isTeamTerminating(team.teamRunId)"
                    @click.stop="actions.onArchiveTeam(team)"
                  >
                    <Icon icon="heroicons:archive-box-20-solid" class="h-3.5 w-3.5" />
                  </button>
                  <button
                    v-if="!team.isActive && team.deleteLifecycle === 'READY'"
                    type="button"
                    class="inline-flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-[opacity,color,background-color] duration-150 hover:bg-red-50 hover:text-red-600 md:opacity-0 md:group-hover/team-row:opacity-100 md:group-focus-within/team-row:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                    :title="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.delete_team_history_permanently')"
                    :aria-label="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.delete_team_history_permanently')"
                    :disabled="state.isTeamDeleting(team.teamRunId) || state.isTeamArchiving(team.teamRunId) || state.isTeamTerminating(team.teamRunId)"
                    @click.stop="actions.onDeleteTeam(team)"
                  >
                    <Icon icon="heroicons:trash-20-solid" class="h-3.5 w-3.5" />
                  </button>
                  <span class="text-xs text-gray-400">
                    {{ formatRelativeTime(team.lastActivityAt) }}
                  </span>
                </div>
              </div>

              <WorkspaceTeamExecutionTree
                v-if="state.isTeamExpanded(team.teamRunId)"
                :team="team"
                :tree-label="formatTeamRunLabel(team)"
                :avatars="avatars"
                :is-team-selected="state.isTeamRunSelected(team.teamRunId)"
                :is-row-expanded="(rowKey: string) => isTeamDisplayRowExpanded(team, rowKey)"
                :format-relative-time="formatRelativeTime"
                @select="(row: import('~/stores/runHistoryTypes').RunHistoryTeamExecutionRow) => selectTeamDisplayRow(team, row)"
                @toggle="(row: import('~/stores/runHistoryTypes').RunHistoryTeamExecutionRow) => toggleTeamDisplayRow(team, row)"
                @open-run="actions.onOpenTeamRun(team, workspaceNode.workspaceId)"
              />
            </div>
          </div>
        </div>
      </div>

      <WorkspaceAgentOrgHistoryCollection
        :avatars="avatars"
        :workspace-id="workspacePresentationId"
        :groups="workspaceNode.agentOrgDefinitions ?? []"
        :state="state"
        :actions="actions"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import StatusDot from '~/components/workspace/common/StatusDot.vue';
import TeamAggregateStatusDot from '~/components/workspace/history/TeamAggregateStatusDot.vue';
import { teamDefinitionGroupStatus, teamRunStatus } from '~/components/workspace/history/workspaceHistoryTeamBranchStatus';
import WorkspaceTeamExecutionTree from '~/components/workspace/history/WorkspaceTeamExecutionTree.vue';
import WorkspaceAgentOrgHistoryCollection from '~/components/workspace/history/WorkspaceAgentOrgHistoryCollection.vue';
import AgentRunTaskRows from '~/components/workspace/history/AgentRunTaskRows.vue';
import { useAgentRunCollaborationStore } from '~/stores/agentRunCollaborationStore';
import type {
  WorkspaceHistoryAvatarBindings,
  WorkspaceHistorySectionActions,
  WorkspaceHistorySectionState,
} from '~/components/workspace/history/workspaceHistorySectionContracts';
import {
  buildWorkspaceTeamDefinitionDisplayGroups,
  type WorkspaceHistoryTeamDefinitionDisplayGroup,
} from '~/components/workspace/history/workspaceHistoryTeamDefinitionGroups';
import {
  formatRunLabel,
  formatTeamRunLabel,
} from '~/components/workspace/history/workspaceHistoryRunLabels';
import type {
  RunHistoryTeamExecutionRow,
  TeamRunHistoryDefinitionGroup,
  TeamTreeNode,
} from '~/stores/runHistoryTypes';
import type { WorkspaceHistoryWorkspaceNode } from '~/stores/runHistoryTypes';
import { NO_WORKSPACE_HISTORY_ROOT } from '~/utils/runTreeProjection';
import { useLocalization } from '~/composables/useLocalization';
import { useAgentReconnect } from '~/composables/agentReconnect/useAgentReconnect';
import {
  agentGroupArchiveKey,
  canArchiveAgentGroup,
  teamGroupArchiveKey,
} from '~/composables/useWorkspaceHistoryGroupArchive';

const props = defineProps<{
  workspaceNode: WorkspaceHistoryWorkspaceNode;
  workspaceTeams: TeamTreeNode[];
  workspaceTeamHistoryGroups: TeamRunHistoryDefinitionGroup[];
  state: WorkspaceHistorySectionState;
  avatars: WorkspaceHistoryAvatarBindings;
  actions: WorkspaceHistorySectionActions;
  /** projects-left-navigation: set in Projects mode; the node is then a Project, not a folder. */
  projectScope?: { projectId: string; name: string; selected: boolean; isStartedUnder: (runId: string) => boolean } | null;
}>();
const { t } = useLocalization();
const reconnect = useAgentReconnect();
const collaboration = useAgentRunCollaborationStore();
/** The run row shows the run's own agent again (not a task child under it). */
const selectAgentRun = (run: Parameters<typeof props.actions.onSelectRun>[0]) => {
  collaboration.selectChild(run.runId, null);
  return props.actions.onSelectRun(run);
};
const workspacePresentationId = computed(() => props.workspaceNode.stableKey);
/** "+" on an agent group: another run of that agent, in the folder (Workspaces) or under the Project (Projects). */
const createGroupRun = (agentDefinitionId: string) => props.projectScope
  ? props.actions.onCreateProjectRun?.(props.projectScope.projectId, { kind: 'agent', definitionId: agentDefinitionId })
  : props.actions.onCreateRun(props.workspaceNode.workspaceRootPath, agentDefinitionId);
const workspaceDisplayName = computed(() => props.workspaceNode.workspaceRootPath === NO_WORKSPACE_HISTORY_ROOT
  ? t('workspace.agentOrg.history.noWorkspace')
  : props.workspaceNode.workspaceName);
const isGroupArchiving = (groupKey: string): boolean => props.state.isGroupArchiving?.(groupKey) ?? false;

const groupedTeamDefinitions = computed<WorkspaceHistoryTeamDefinitionDisplayGroup[]>(() =>
  buildWorkspaceTeamDefinitionDisplayGroups(
    props.workspaceTeamHistoryGroups,
    props.workspaceTeams,
  ),
);

const relativeTimeTick = ref(0);
let relativeTimeTimer: ReturnType<typeof setInterval> | null = null;
const formatRelativeTime = (isoTime: string): string => {
  void relativeTimeTick.value;
  return props.state.formatRelativeTime(isoTime);
};
onMounted(() => {
  relativeTimeTimer = setInterval(() => { relativeTimeTick.value += 1; }, 60_000);
});
onBeforeUnmount(() => {
  if (relativeTimeTimer !== null) clearInterval(relativeTimeTimer);
});

const isTeamDisplayRowExpanded = (
  team: TeamTreeNode,
  rowKey: string,
): boolean => props.state.isTeamMemberExpanded(
  workspacePresentationId.value,
  team.teamRunId,
  rowKey,
);

const toggleTeamDisplayRow = (
  team: TeamTreeNode,
  row: RunHistoryTeamExecutionRow,
): void => props.state.toggleTeamMember(
  workspacePresentationId.value,
  team.teamRunId,
  row.rowKey,
);

const selectTeamDisplayRow = (
  team: TeamTreeNode,
  row: RunHistoryTeamExecutionRow,
): Promise<void> | void => {
  if (!row.agentRunId) return;
  return props.actions.onSelectTeamMember({
    teamRunId: team.teamRunId,
    memberAddress: row.memberAddress,
    agentRunId: row.agentRunId,
  }, props.workspaceNode.workspaceId);
};

</script>
