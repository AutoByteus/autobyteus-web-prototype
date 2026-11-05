<template>
  <!-- left-panel-super-agents: the run section's default view. One list of the runs the user started (agents, teams and orgs),
       most recent first; delegated work stays nested under the run that delegated it. Folders and Projects are only
       searchable words here; the two trees they used to need are the view menu's other options. -->
  <div data-test="conversations-list">
    <div v-if="loading && entries.length === 0" class="px-3 py-4 text-xs text-gray-500" role="status" data-test="conversations-loading">
      {{ t('conversations.loading') }}
    </div>

    <div v-else-if="loadError && entries.length === 0" class="px-3 py-4" role="alert" data-test="conversations-error">
      <p class="text-xs text-red-600">{{ t('conversations.error') }}</p>
      <button type="button" class="mt-2 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" data-test="conversations-retry" @click="onRetry">
        {{ t('conversations.retry') }}
      </button>
    </div>

    <template v-else>
      <p v-if="loadError" class="flex items-center gap-2 px-3 py-1.5 text-xs text-red-600" role="alert" data-test="conversations-stale-error">
        <span>{{ t('conversations.staleError') }}</span>
        <button type="button" class="rounded px-1 font-medium underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" @click="onRetry">{{ t('conversations.retry') }}</button>
      </p>

      <button v-if="rows.length === 0" type="button" class="flex w-full items-start rounded-md px-2 py-1 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" data-test="conversations-empty" @click="runStart.newChat()">
        <span class="ml-[1.125rem] mr-1.5 inline-flex h-5 flex-shrink-0 items-center"><span class="mr-1.5 h-2 w-2 rounded-full bg-gray-300" aria-hidden="true" /></span>
        <span class="mr-1.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-[0.625rem] font-semibold text-gray-600" aria-hidden="true"><Icon icon="heroicons:chat-bubble-left-right" class="h-3.5 w-3.5" /></span>
        <span class="min-w-0 flex-1">
          <span class="block truncate font-medium">{{ t('conversations.emptyTitle') }}</span>
          <span class="block text-[0.6875rem] leading-4 text-gray-500">{{ t('conversations.emptyHelp') }}</span>
        </span>
      </button>

      <template v-else>
        <ul class="space-y-0.5" role="list" :aria-label="t('conversations.listLabel')">
          <li v-for="entry in rows" :key="entry.key" class="rounded-md" data-test="conversation" :data-kind="entry.kind" :data-run-id="entry.runId">
            <!-- An agent's run. -->
            <template v-if="entry.kind === 'agent'">
              <div
                class="group/run-row flex w-full items-stretch rounded-md text-sm transition-colors"
                :class="agentSelected(entry.run) ? 'bg-indigo-50 text-indigo-900' : 'text-gray-700 hover:bg-gray-50'"
              >
                <button
                  v-if="hasDelegated(entry.run)"
                  type="button"
                  class="ml-1 mt-[0.4375rem] inline-flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center self-start rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  data-test="conversation-disclosure"
                  :aria-expanded="!isCollapsed(entry.key)"
                  :aria-label="t(isCollapsed(entry.key) ? 'conversations.expand' : 'conversations.collapse', { name: entry.name })"
                  :title="t(isCollapsed(entry.key) ? 'conversations.expand' : 'conversations.collapse', { name: entry.name })"
                  @click="toggleCollapsed(entry.key)"
                >
                  <Icon icon="heroicons:chevron-down-20-solid" class="h-3.5 w-3.5 transition-transform" :class="isCollapsed(entry.key) ? '-rotate-90' : 'rotate-0'" aria-hidden="true" />
                </button>
                <span v-else class="ml-1 h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                <button
                  type="button"
                  data-test="workspace-agent-run-row"
                  :data-run-id="entry.run.runId"
                  class="flex min-w-0 flex-1 items-start py-1 pl-1.5 pr-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
                  :aria-current="agentSelected(entry.run) ? 'true' : undefined"
                  :title="rowTitle(entry)"
                  @click="selectAgentRun(entry.run)"
                >
                  <span class="inline-flex h-5 flex-shrink-0 items-center"><StatusDot class="mr-1.5" :status="entry.run.currentStatus" /></span>
                  <span class="mr-1.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-[0.625rem] font-semibold text-gray-600" aria-hidden="true">
                    <img
                      v-if="avatars.showAgentAvatar(entry.workspaceRootPath, entry.agent.agentDefinitionId, entry.agent.agentAvatarUrl)"
                      :src="entry.agent.agentAvatarUrl || ''"
                      :alt="`${entry.name} avatar`"
                      class="h-full w-full object-cover"
                      @error="avatars.onAgentAvatarError(entry.workspaceRootPath, entry.agent.agentDefinitionId, entry.agent.agentAvatarUrl)"
                    >
                    <span v-else>{{ avatars.getAgentInitials(entry.name) }}</span>
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="flex items-center">
                      <span class="truncate font-medium">{{ entry.name }}</span>
                      <Icon
                        v-if="reconnect.isDefinitionMissing(entry.agent.agentDefinitionId)"
                        icon="heroicons:exclamation-triangle-20-solid"
                        class="ml-1.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500"
                        role="img"
                        :aria-label="$t('reconnect.tree.missing', { id: entry.agent.agentDefinitionId })"
                        data-test="workspace-agent-missing"
                      />
                    </span>
                    <span class="block truncate text-[0.6875rem] font-normal leading-4" :class="agentSelected(entry.run) ? 'text-indigo-700' : 'text-gray-500'">{{ entry.label }}</span>
                  </span>
                </button>
                <div class="flex flex-shrink-0 items-start gap-1 py-1 pr-2">
                  <RowActions
                    :running="entry.run.isActive"
                    :stoppable="entry.run.isActive"
                    :archivable="entry.run.source === 'history' && !entry.run.isActive"
                    :deletable="(entry.run.source === 'history' && !entry.run.isActive) || entry.run.source === 'draft'"
                    :delete-removes-draft="entry.run.source === 'draft'"
                    :busy-stop="state.isRunTerminating(entry.run.runId)"
                    :busy-archive="state.isRunArchiving(entry.run.runId) || state.isRunDeleting(entry.run.runId)"
                    :busy-delete="state.isRunDeleting(entry.run.runId) || state.isRunArchiving(entry.run.runId)"
                    :time="relative(entry.run.lastActivityAt)"
                    @stop="actions.onTerminateRun(entry.run.runId)"
                    @archive="actions.onArchiveRun(entry.run)"
                    @delete="actions.onDeleteRun(entry.run)"
                  />
                </div>
              </div>
              <!-- Task Agents and task Teams this run delegated to; they leave when their Task closes. -->
              <AgentRunTaskRows
                v-show="!isCollapsed(entry.key)"
                :run-id="entry.run.runId"
                :label="entry.label"
                :run-selected="state.selectedRunId === entry.run.runId"
                :has-collaboration="entry.run.hasCollaboration === true"
                @select-run="actions.onSelectRun(entry.run)"
                @open-run="selectAgentRun(entry.run)"
              />
            </template>

            <!-- A team's run. -->
            <template v-else-if="entry.kind === 'team'">
              <div
                class="group/run-row flex w-full items-stretch rounded-md text-sm transition-colors"
                :class="state.isTeamRunSelected(entry.team.teamRunId) ? 'bg-indigo-50 text-indigo-900' : 'text-gray-700 hover:bg-gray-50'"
              >
                <span class="ml-1 mt-[0.4375rem] inline-flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center self-start text-gray-400" aria-hidden="true">
                  <Icon icon="heroicons:chevron-down-20-solid" class="h-3.5 w-3.5 transition-transform" :class="state.isTeamExpanded(entry.team.teamRunId) ? 'rotate-0' : '-rotate-90'" data-test="workspace-team-run-disclosure" />
                </span>
                <button
                  type="button"
                  :data-test="`workspace-team-row-${entry.team.teamRunId}`"
                  class="flex min-w-0 flex-1 items-start py-1 pl-1.5 pr-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
                  :aria-expanded="state.isTeamExpanded(entry.team.teamRunId)"
                  :aria-current="state.isTeamRunSelected(entry.team.teamRunId) ? 'true' : undefined"
                  :title="rowTitle(entry)"
                  @click="actions.onSelectTeam(entry.team, entry.workspaceId)"
                >
                  <span class="inline-flex h-5 flex-shrink-0 items-center"><TeamAggregateStatusDot class="mr-1.5" :status="teamRunStatus(entry.team)" /></span>
                  <span class="mr-1.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-600" aria-hidden="true">
                    <img
                      v-if="avatars.showTeamAvatar(entry.team)"
                      :key="avatars.getTeamAvatarUrl(entry.team)"
                      :src="avatars.getTeamAvatarUrl(entry.team)"
                      :alt="`${entry.name} avatar`"
                      class="h-full w-full object-cover"
                      @error="avatars.onTeamAvatarError(entry.team, ($event.target as HTMLImageElement).getAttribute('src') || '')"
                    >
                    <Icon v-else icon="heroicons:user-group-20-solid" class="h-3.5 w-3.5" />
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block truncate font-semibold">{{ entry.name }}</span>
                    <span class="block truncate text-[0.6875rem] font-normal leading-4" :class="state.isTeamRunSelected(entry.team.teamRunId) ? 'text-indigo-700' : 'text-gray-500'">{{ entry.label }}</span>
                  </span>
                </button>
                <div class="flex flex-shrink-0 items-start gap-1 py-1 pr-2">
                  <RowActions
                    :running="entry.team.isActive"
                    :stoppable="entry.team.isActive"
                    :archivable="!entry.team.isActive && entry.team.deleteLifecycle === 'READY'"
                    :deletable="!entry.team.isActive && entry.team.deleteLifecycle === 'READY'"
                    :busy-stop="state.isTeamTerminating(entry.team.teamRunId)"
                    :busy-archive="state.isTeamArchiving(entry.team.teamRunId) || state.isTeamDeleting(entry.team.teamRunId) || state.isTeamTerminating(entry.team.teamRunId)"
                    :busy-delete="state.isTeamDeleting(entry.team.teamRunId) || state.isTeamArchiving(entry.team.teamRunId) || state.isTeamTerminating(entry.team.teamRunId)"
                    :time="relative(entry.team.lastActivityAt)"
                    @stop="actions.onTerminateTeam(entry.team.teamRunId)"
                    @archive="actions.onArchiveTeam(entry.team)"
                    @delete="actions.onDeleteTeam(entry.team)"
                  />
                </div>
              </div>
              <WorkspaceTeamExecutionTree
                v-if="state.isTeamExpanded(entry.team.teamRunId)"
                :team="entry.team"
                :tree-label="entry.label"
                :avatars="avatars"
                :is-team-selected="state.isTeamRunSelected(entry.team.teamRunId)"
                :is-row-expanded="(rowKey: string) => state.isTeamMemberExpanded(entry.workspaceId, entry.team.teamRunId, rowKey)"
                :format-relative-time="relative"
                @select="(row: RunHistoryTeamExecutionRow) => selectTeamRow(entry, row)"
                @toggle="(row: RunHistoryTeamExecutionRow) => state.toggleTeamMember(entry.workspaceId, entry.team.teamRunId, row.rowKey)"
                @open-run="actions.onOpenTeamRun(entry.team, entry.workspaceId)"
              />
            </template>

            <!-- An Agent Org's run; its members and delegated work are its tree, opened with the row. -->
            <template v-else>
              <div
                class="group/run-row flex w-full items-stretch rounded-md text-sm transition-colors"
                :class="orgSelected(entry.orgRun) ? 'bg-indigo-50 text-indigo-900' : 'text-gray-700 hover:bg-gray-50'"
              >
                <span class="ml-1 mt-[0.4375rem] inline-flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center self-start text-gray-400" aria-hidden="true">
                  <Icon icon="heroicons:chevron-down-20-solid" class="h-3.5 w-3.5 transition-transform" :class="state.isAgentOrgRunExpanded?.(entry.orgRun.rootRunId) ? 'rotate-0' : '-rotate-90'" :data-test="`agent-org-run-disclosure-${entry.orgRun.rootRunId}`" />
                </span>
                <button
                  type="button"
                  :data-test="`agent-org-run-open-${entry.orgRun.rootRunId}`"
                  :aria-expanded="state.isAgentOrgRunExpanded?.(entry.orgRun.rootRunId) ?? false"
                  class="flex min-w-0 flex-1 items-start py-1 pl-1.5 pr-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
                  :aria-current="orgSelected(entry.orgRun) ? 'true' : undefined"
                  :title="rowTitle(entry)"
                  @click="openOrg(entry)"
                >
                  <span class="inline-flex h-5 flex-shrink-0 items-center"><span class="mr-1.5 h-2 w-2 rounded-full" :class="entry.orgRun.isActive ? 'bg-emerald-500' : 'bg-gray-300'" aria-hidden="true" /></span>
                  <span class="mr-1.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-gray-100 text-gray-600" aria-hidden="true">
                    <img v-if="avatars.showOrgAvatar(entry.definitionId)" :key="avatars.getOrgAvatarUrl(entry.definitionId)" :src="avatars.getOrgAvatarUrl(entry.definitionId)" :alt="entry.name" class="h-full w-full object-cover" @error="avatars.onOrgAvatarError(entry.definitionId, ($event.target as HTMLImageElement).getAttribute('src') || '')">
                    <Icon v-else icon="heroicons:building-office-2-20-solid" class="h-3.5 w-3.5" />
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block truncate font-semibold">{{ entry.name }}</span>
                    <span class="block truncate text-[0.6875rem] font-normal leading-4" :class="orgSelected(entry.orgRun) ? 'text-indigo-700' : 'text-gray-500'">{{ entry.label }}</span>
                  </span>
                </button>
                <div class="flex flex-shrink-0 items-start gap-1 py-1 pr-2">
                  <RowActions
                    :running="entry.orgRun.isActive"
                    :stoppable="entry.orgRun.isActive"
                    :archivable="!entry.orgRun.isActive"
                    :deletable="!entry.orgRun.isActive"
                    :busy-stop="state.isAgentOrgTerminating?.(entry.orgRun.rootRunId) ?? false"
                    :busy-archive="(state.isAgentOrgArchiving?.(entry.orgRun.rootRunId) ?? false) || (state.isAgentOrgDeleting?.(entry.orgRun.rootRunId) ?? false)"
                    :busy-delete="(state.isAgentOrgArchiving?.(entry.orgRun.rootRunId) ?? false) || (state.isAgentOrgDeleting?.(entry.orgRun.rootRunId) ?? false)"
                    :time="relative(entry.orgRun.createdAt)"
                    @stop="actions.onTerminateAgentOrg?.(entry.orgRun)"
                    @archive="actions.onArchiveAgentOrg?.(entry.orgRun)"
                    @delete="actions.onDeleteAgentOrg?.(entry.orgRun)"
                  />
                </div>
              </div>
              <WorkspaceAgentOrgHistoryCollection
                bare
                :avatars="avatars"
                :workspace-id="entry.workspaceId"
                :groups="[{ stableKey: `org:${entry.definitionId}`, definitionId: entry.definitionId, name: entry.name, runs: [entry.orgRun] }]"
                :state="state"
                :actions="actions"
              />
            </template>
          </li>
        </ul>

        <!-- The older hand-started runs: a quiet fold; open, it also offers the one bulk clean-up. -->
        <div v-if="olderRuns.length > 0" class="mx-1 mt-1 flex items-center justify-between text-xs" data-test="conversations-older-bar">
          <button
            type="button"
            class="rounded-md px-2 py-1.5 font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            data-test="conversations-show-older"
            :aria-expanded="showingOlder ? 'true' : 'false'"
            @click="showingOlder = !showingOlder"
          >{{ showingOlder ? t('conversations.showFewer') : t('conversations.showOlder', { count: olderRuns.length }) }}</button>
          <button
            v-if="showingOlder && archivable.length > 0"
            type="button"
            class="inline-flex items-center gap-1 rounded-md px-2 py-1.5 font-medium text-gray-500 transition-colors hover:bg-amber-50 hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            data-test="conversations-archive-older"
            @click="requestArchiveOlder"
          >
            <Icon icon="heroicons:archive-box-20-solid" class="h-3.5 w-3.5" aria-hidden="true" />
            {{ t('conversations.archiveOlder') }}
          </button>
        </div>
      </template>
    </template>

    <ConfirmationModal
      :show="pendingArchive !== null"
      :title="$t('workspace.history.groupArchive.confirmTitle')"
      :message="archiveMessage"
      :confirm-button-text="$t('workspace.history.groupArchive.confirmButton')"
      variant="primary"
      typography-size="large"
      @confirm="confirmArchiveOlder"
      @cancel="pendingArchive = null"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRunStart } from '~/composables/runSettings/useRunStart'
import { Icon } from '@iconify/vue'
import StatusDot from '~/components/workspace/common/StatusDot.vue'
import TeamAggregateStatusDot from '~/components/workspace/history/TeamAggregateStatusDot.vue'
import AgentRunTaskRows from '~/components/workspace/history/AgentRunTaskRows.vue'
import WorkspaceTeamExecutionTree from '~/components/workspace/history/WorkspaceTeamExecutionTree.vue'
import WorkspaceAgentOrgHistoryCollection from '~/components/workspace/history/WorkspaceAgentOrgHistoryCollection.vue'
import ConversationRowActions from '~/components/workspace/history/ConversationRowActions.vue'
import { teamRunStatus } from '~/components/workspace/history/workspaceHistoryTeamBranchStatus'
import { buildWorkspaceTeamDefinitionDisplayGroups } from '~/components/workspace/history/workspaceHistoryTeamDefinitionGroups'
import { formatRunLabel, formatTeamRunLabel } from '~/components/workspace/history/workspaceHistoryRunLabels'
import type { WorkspaceHistoryAvatarBindings, WorkspaceHistorySectionActions, WorkspaceHistorySectionState } from '~/components/workspace/history/workspaceHistorySectionContracts'
import type { AgentOrgRunHistoryItem, RunHistoryTeamExecutionRow, TeamRunHistoryDefinitionGroup, TeamTreeNode, WorkspaceHistoryWorkspaceNode } from '~/stores/runHistoryTypes'
import type { RunTreeAgentNode, RunTreeRow } from '~/utils/runTreeProjection'
import { NO_WORKSPACE_HISTORY_ROOT } from '~/utils/runTreeProjection'
import { useAgentRunCollaborationStore } from '~/stores/agentRunCollaborationStore'
import { useRunHistoryStore } from '~/stores/runHistoryStore'
import { useProjectsTreeStore } from '~/stores/projectsTreeStore'
import { useAgentReconnect } from '~/composables/agentReconnect/useAgentReconnect'
import { useLocalization } from '~/composables/useLocalization'
import { useToasts } from '~/composables/useToasts'
import ConfirmationModal from '~/components/common/ConfirmationModal.vue'
import { escapeHtml } from '~/utils/escapeHtml'

const RowActions = ConversationRowActions

const props = defineProps<{
  workspaceNodes: WorkspaceHistoryWorkspaceNode[]
  teamsOf: (workspaceRootPath: string) => TeamTreeNode[]
  teamGroupsOf: (workspaceRootPath: string) => TeamRunHistoryDefinitionGroup[]
  loading: boolean
  loadError: string | null
  onRetry: () => void
  state: WorkspaceHistorySectionState
  avatars: WorkspaceHistoryAvatarBindings
  actions: WorkspaceHistorySectionActions
}>()

const { t } = useLocalization()
const runStart = useRunStart()
const { addToast } = useToasts()
const reconnect = useAgentReconnect()
const collaboration = useAgentRunCollaborationStore()
const runHistory = useRunHistoryStore()
const projectsTree = useProjectsTreeStore()

type Base = { key: string; runId: string; at: number; name: string; label: string; folder: string; workspaceId: string; workspaceRootPath: string; projects: string[] }
type AgentEntry = Base & { kind: 'agent'; agent: RunTreeAgentNode; run: RunTreeRow }
type TeamEntry = Base & { kind: 'team'; team: TeamTreeNode }
type OrgEntry = Base & { kind: 'org'; definitionId: string; orgRun: AgentOrgRunHistoryItem }
type Entry = AgentEntry | TeamEntry | OrgEntry

const folderName = (node: WorkspaceHistoryWorkspaceNode): string => {
  if (node.workspaceRootPath === NO_WORKSPACE_HISTORY_ROOT) return ''
  return node.workspaceKind === 'temp' ? t('conversations.folderTemp') : node.workspaceName
}
const asTime = (iso: string): number => { const value = Date.parse(iso); return Number.isFinite(value) ? value : 0 }

/** Project names a run is listed under (search words only; the Projects view is where they group). */
const projectNamesOf = (runId: string): string[] => projectsTree.projects
  .filter((project) => projectsTree.linksOf(project.projectId).some((link) => link.runId === runId && link.startedUnder))
  .map((project) => project.name)

// Every run the trees list, flattened: the same stored data, one row each.
const entries = computed<Entry[]>(() => {
  const seen = new Set<string>()
  const result: Entry[] = []
  for (const node of props.workspaceNodes) {
    const folder = folderName(node)
    for (const agent of node.agents) {
      for (const run of agent.runs) {
        const key = `agent:${run.runId}`
        if (seen.has(key)) continue
        seen.add(key)
        result.push({ kind: 'agent', key, runId: run.runId, at: asTime(run.lastActivityAt), name: agent.agentName, label: formatRunLabel(run.summary), folder, workspaceId: node.workspaceId, workspaceRootPath: node.workspaceRootPath, projects: projectNamesOf(run.runId), agent, run })
      }
    }
    const groups = buildWorkspaceTeamDefinitionDisplayGroups(props.teamGroupsOf(node.workspaceRootPath), props.teamsOf(node.workspaceRootPath))
    for (const group of groups) {
      for (const team of group.runs) {
        const key = `team:${team.teamRunId}`
        if (seen.has(key)) continue
        seen.add(key)
        result.push({ kind: 'team', key, runId: team.teamRunId, at: asTime(team.lastActivityAt), name: group.teamDefinitionName, label: formatTeamRunLabel(team), folder, workspaceId: node.workspaceId, workspaceRootPath: node.workspaceRootPath, projects: projectNamesOf(team.teamRunId), team })
      }
    }
    for (const group of node.agentOrgDefinitions ?? []) {
      for (const orgRun of group.runs) {
        const key = `org:${orgRun.rootRunId}`
        if (seen.has(key)) continue
        seen.add(key)
        result.push({ kind: 'org', key, runId: orgRun.rootRunId, at: asTime(orgRun.createdAt), name: group.name, label: orgRun.summary || t('workspace.agentOrg.history.newRun', { name: group.name }), folder, workspaceId: node.workspaceId, workspaceRootPath: node.workspaceRootPath, projects: projectNamesOf(orgRun.rootRunId), definitionId: group.definitionId, orgRun })
      }
    }
  }
  // Running first would reorder rows while the user reads them; recency is the one rule.
  return result.sort((a, b) => b.at - a.at)
})

// --- Your runs, newest first -----------------------------------------------------------------------------------
// Any agent, team or Org you started (from its page or New chat), ungrouped and kept until archived or deleted. What a run
// delegated sits under it (orchestration is just tools an agent has), live, and leaves when its Task closes.
/** How many runs show before "Show older". */
const SHOWN = 5
const showingOlder = ref(false)
const olderRuns = computed<Entry[]>(() => entries.value.slice(SHOWN))
const rows = computed<Entry[]>(() => showingOlder.value ? entries.value : entries.value.slice(0, SHOWN))
// The open run is always inside what shows.
watch(() => props.state.selectedRunId, (runId) => {
  if (runId && olderRuns.value.some((entry) => entry.runId === runId)) showingOlder.value = true
}, { immediate: true })

// --- Archive all older: the one bulk action, over exactly the runs the fold lists -------------------------------
const isRunning = (entry: Entry): boolean => entry.kind === 'agent' ? entry.run.isActive : entry.kind === 'team' ? entry.team.isActive : entry.orgRun.isActive
const archivable = computed(() => olderRuns.value.filter((entry) => entry.kind === 'agent'
  ? entry.run.source === 'history'
  : entry.kind === 'team' ? entry.team.deleteLifecycle === 'READY' : true))
const pendingArchive = ref<Entry[] | null>(null)
const countLabel = (count: number): string => count === 1 ? t('workspace.history.groupArchive.runCountOne') : t('workspace.history.groupArchive.runCountOther', { count })
const archiveMessage = computed(() => pendingArchive.value
  ? escapeHtml(t('workspace.history.groupArchive.confirmCountedRuns', { name: t('conversations.olderRuns'), runs: countLabel(pendingArchive.value.length) }))
  : '')
const requestArchiveOlder = (): void => {
  // As for a group's "Archive all": nothing is archived while one of the runs is still running.
  if (archivable.value.some(isRunning)) { addToast(t('workspace.history.groupArchive.stopRunningFirst'), 'info'); return }
  pendingArchive.value = archivable.value.slice()
}
const confirmArchiveOlder = async (): Promise<void> => {
  const targets = pendingArchive.value ?? []
  pendingArchive.value = null
  const agentIds = targets.filter((entry) => entry.kind === 'agent').map((entry) => entry.runId)
  const teamIds = targets.filter((entry) => entry.kind === 'team').map((entry) => entry.runId)
  const orgIds = targets.filter((entry) => entry.kind === 'org').map((entry) => entry.runId)
  let failed = 0
  for (const id of agentIds) { try { await runHistory.archiveRun(id) } catch { failed += 1 } }
  if (teamIds.length) { try { failed += (await runHistory.archiveTeamRuns(teamIds)).failedRunIds.length } catch { failed += teamIds.length } }
  if (orgIds.length) { try { failed += (await runHistory.archiveAgentOrgRuns(orgIds)).failedRunIds.length } catch { failed += orgIds.length } }
  const archivedCount = targets.length - failed
  if (failed === 0) addToast(t('workspace.history.groupArchive.archived', { runs: countLabel(archivedCount) }), 'success')
  else if (archivedCount === 0) addToast(t('workspace.history.groupArchive.failed'), 'error')
  else addToast(t('workspace.history.groupArchive.archivedWithFailures', { runs: countLabel(archivedCount), failed }), 'error')
  if (entries.value.length <= SHOWN) showingOlder.value = false
}

// --- Rows --------------------------------------------------------------------------------------------------------
const rowTitle = (entry: Entry): string => entry.folder ? t('conversations.rowTitle', { name: entry.name, folder: entry.folder }) : entry.name
const agentSelected = (run: RunTreeRow): boolean => props.state.selectedRunId === run.runId && !collaboration.selectedChild(run.runId)
const orgSelected = (run: AgentOrgRunHistoryItem): boolean => props.state.isAgentOrgRunSelected?.(run.rootRunId) ?? false
const selectAgentRun = (run: RunTreeRow): Promise<void> | void => {
  collaboration.selectChild(run.runId, null)
  return props.actions.onSelectRun(run)
}
// Opening an Org run shows its members under it, so a stopped Org can continue from a member's saved state.
const openOrg = (entry: OrgEntry): Promise<unknown> | void => {
  if (!props.state.isAgentOrgRunExpanded?.(entry.orgRun.rootRunId)) props.state.toggleAgentOrgRun?.(entry.orgRun.rootRunId)
  return props.actions.onOpenAgentOrgRun?.(entry.orgRun)
}
const selectTeamRow = (entry: TeamEntry, row: RunHistoryTeamExecutionRow): Promise<void> | void => {
  if (!row.agentRunId) return
  return props.actions.onSelectTeamMember({ teamRunId: entry.team.teamRunId, memberAddress: row.memberAddress, agentRunId: row.agentRunId }, entry.workspaceId)
}

// Delegated work under a run is shown (as in the trees) and can be hidden per run for this session.
const collapsed = ref<Record<string, boolean>>({})
const isCollapsed = (key: string): boolean => collapsed.value[key] === true
const toggleCollapsed = (key: string): void => { collapsed.value = { ...collapsed.value, [key]: !collapsed.value[key] } }
const hasDelegated = (run: RunTreeRow): boolean => run.hasCollaboration === true && collaboration.taskRows(run.runId).length > 0

const relativeTimeTick = ref(0)
let relativeTimeTimer: ReturnType<typeof setInterval> | null = null
const relative = (iso: string): string => { void relativeTimeTick.value; return props.state.formatRelativeTime(iso) }
onMounted(() => { relativeTimeTimer = setInterval(() => { relativeTimeTick.value += 1 }, 60_000) })
onBeforeUnmount(() => { if (relativeTimeTimer !== null) clearInterval(relativeTimeTimer) })

</script>
