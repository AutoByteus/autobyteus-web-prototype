<template>
  <div class="flex h-full flex-col bg-white" data-test="agent-org-run-history">
    <div class="flex items-center justify-between border-t border-gray-200 px-3 py-2">
      <h3 class="text-sm font-semibold text-gray-700">Workspaces</h3>
      <button type="button" class="inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600" aria-label="Add workspace">
        <Icon icon="heroicons:plus-20-solid" class="h-4 w-4" />
      </button>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-1 pb-2">
      <section class="rounded-md">
        <button type="button" class="flex w-full min-w-0 items-center rounded-md px-2 py-1.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50" :aria-expanded="workspaceExpanded" @click="workspaceExpanded = !workspaceExpanded">
          <Icon icon="heroicons:chevron-down-20-solid" class="mr-1.5 h-4 w-4 text-gray-400 transition-transform" :class="workspaceExpanded ? 'rotate-0' : '-rotate-90'" />
          <Icon icon="heroicons:folder-20-solid" class="mr-1.5 h-4 w-4 text-gray-500" />
          <span class="truncate">Prototype Workspace</span>
        </button>

        <div v-if="workspaceExpanded" class="ml-2 mt-0.5 space-y-1">
          <div class="px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">Agent Orgs</div>
          <div class="rounded-md">
            <button type="button" class="flex w-full items-center rounded-md px-2 py-1 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50" :aria-expanded="orgExpanded" data-test="history-org-definition" @click="orgExpanded = !orgExpanded">
              <Icon icon="heroicons:chevron-down-20-solid" class="mr-1 h-3.5 w-3.5 text-gray-400 transition-transform" :class="orgExpanded ? 'rotate-0' : '-rotate-90'" />
              <span class="mr-1.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded bg-gray-100 text-gray-600"><Icon icon="heroicons:building-office-2-20-solid" class="h-3.5 w-3.5" /></span>
              <span class="truncate font-medium">{{ org.name }}</span>
            </button>

            <div v-if="orgExpanded && showOrgRun" class="ml-3 mt-0.5 space-y-0.5">
              <div class="group flex items-center justify-between rounded-md px-2 py-1 text-sm text-gray-700">
                <button type="button" class="flex min-w-0 flex-1 items-center text-left" :aria-expanded="orgRunExpanded" data-test="history-org-root" @click="orgRunExpanded = !orgRunExpanded">
                  <Icon icon="heroicons:chevron-down-20-solid" class="mr-1 h-3.5 w-3.5 text-gray-400 transition-transform" :class="orgRunExpanded ? 'rotate-0' : '-rotate-90'" />
                  <span class="mr-1.5 h-2 w-2 flex-none rounded-full" :class="statusReview.historical.value ? 'bg-gray-400' : 'bg-emerald-500'" :aria-label="statusReview.historical.value ? 'Stopped' : 'Running'" />
                  <span class="truncate font-medium">New - {{ org.name }}</span>
                </button>
                <span class="ml-2 text-xs text-gray-400">{{ statusReview.historical.value ? '12m' : 'now' }}</span>
              </div>

              <div v-if="orgRunExpanded" class="team-execution-tree ml-3 space-y-0.5" role="tree" :aria-label="`${org.name} execution hierarchy`" data-test="history-org-execution-tree">
                <template v-for="displayRow in visibleRows" :key="displayRow.row.key">
                  <button
                    v-if="displayRow.row.kind === 'direct_agent'"
                    type="button"
                    class="org-execution-row relative flex min-h-7 w-full items-center rounded-md text-left text-sm transition-colors"
                    :class="isRunSelected(displayRow.row.agent.runId, 'agent') ? 'is-selected text-indigo-900' : 'text-gray-600 hover:bg-gray-50'"
                    :style="rowStyle(displayRow.row.depth)"
                    :data-test="`history-org-agent-${displayRow.row.agent.id}`"
                    :data-status="displayRow.row.agent.status"
                    :aria-level="displayRow.row.depth + 1"
                    role="treeitem"
                    @click="selectDirectAgent(displayRow.row.agent.runId)"
                  >
                    <WorkspaceHierarchyBranches :depth="displayRow.row.depth" :continuing-ancestor-depths="displayRow.continuingAncestorDepths" :has-following-sibling="displayRow.hasFollowingSibling" />
                    <span class="ml-2 mr-1 h-3.5 w-3.5 flex-none" aria-hidden="true" />
                    <StatusDot class="mr-1.5" :status="displayRow.row.agent.status" />
                    <span class="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.5625rem] font-semibold text-gray-600">{{ displayRow.row.agent.initials }}</span>
                    <span class="truncate">{{ displayRow.row.agent.name }}</span>
                  </button>

                  <div v-else-if="displayRow.row.kind === 'team'" class="rounded-md" :data-test="`history-org-team-${displayRow.row.team.id}`">
                    <button
                      type="button"
                      class="org-execution-row relative flex min-h-7 w-full items-center rounded-md text-left text-sm transition-colors"
                      :class="isRunSelected(displayRow.row.team.runId, 'team') ? 'is-selected text-indigo-900' : 'text-gray-600 hover:bg-gray-50'"
                      :style="rowStyle(displayRow.row.depth)"
                      :aria-expanded="isTeamExpanded(displayRow.row.team.id)"
                      :aria-level="displayRow.row.depth + 1"
                      role="treeitem"
                      @click="selectTeam(displayRow.row.team)"
                    >
                      <WorkspaceHierarchyBranches :depth="displayRow.row.depth" :continuing-ancestor-depths="displayRow.continuingAncestorDepths" :has-following-sibling="displayRow.hasFollowingSibling" />
                      <Icon icon="heroicons:chevron-down-20-solid" class="ml-2 mr-1 h-3.5 w-3.5 flex-none text-gray-400 transition-transform" :class="isTeamExpanded(displayRow.row.team.id) ? 'rotate-0' : '-rotate-90'" />
                      <span
                        class="mr-1.5"
                        :data-test="`history-org-team-status-${displayRow.row.team.id}`"
                        :data-status="teamAggregateStatus(displayRow.row.team)"
                      >
                        <NestedTeamAggregateStatusDot :status="teamAggregateStatus(displayRow.row.team)" />
                      </span>
                      <Icon icon="heroicons:user-group-20-solid" class="mr-1.5 h-4 w-4 flex-none text-gray-500" />
                      <span class="truncate font-semibold">{{ displayRow.row.team.name }}</span>
                    </button>
                  </div>

                  <button
                    v-else-if="displayRow.row.kind === 'team_agent'"
                    type="button"
                    class="org-execution-row relative flex min-h-7 w-full items-center rounded-md text-left text-sm transition-colors"
                    :class="isTeamMemberFocused(displayRow.row.team.runId, displayRow.row.agent.runId) ? 'is-selected text-indigo-900' : 'text-gray-600 hover:bg-gray-50'"
                    :style="rowStyle(displayRow.row.depth)"
                    :data-test="`history-org-team-agent-${displayRow.row.agent.id}`"
                    :data-status="displayRow.row.agent.status"
                    :aria-level="displayRow.row.depth + 1"
                    role="treeitem"
                    @click="focusTeamAgent(displayRow.row.team.runId, displayRow.row.agent.runId)"
                  >
                    <WorkspaceHierarchyBranches :depth="displayRow.row.depth" :continuing-ancestor-depths="displayRow.continuingAncestorDepths" :has-following-sibling="displayRow.hasFollowingSibling" />
                    <span class="ml-2 mr-1 h-3.5 w-3.5 flex-none" aria-hidden="true" />
                    <StatusDot class="mr-1.5" :status="displayRow.row.agent.status" />
                    <span class="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.5625rem] font-semibold text-gray-600">{{ displayRow.row.agent.initials }}</span>
                    <span class="min-w-0 flex-1 truncate">{{ displayRow.row.agent.name }}</span>
                    <span v-if="displayRow.row.agent.id === displayRow.row.team.coordinatorId" class="mr-2 ml-1 text-[0.625rem] text-gray-400" aria-label="Coordinator">◆</span>
                  </button>

                  <div
                    v-else-if="displayRow.row.kind === 'task_agent'"
                    class="org-execution-row relative flex min-h-7 w-full items-center rounded-md bg-indigo-50/70 text-sm text-indigo-900"
                    :style="rowStyle(displayRow.row.depth)"
                    data-test="history-task-agent-row"
                    :data-status="displayRow.row.status"
                    :aria-level="displayRow.row.depth + 1"
                    role="treeitem"
                  >
                    <WorkspaceHierarchyBranches :depth="displayRow.row.depth" :continuing-ancestor-depths="displayRow.continuingAncestorDepths" :has-following-sibling="displayRow.hasFollowingSibling" />
                    <span class="ml-2 mr-1 h-3.5 w-3.5 flex-none" aria-hidden="true" />
                    <StatusDot class="mr-1.5" :status="displayRow.row.status" variant="transient" />
                    <span class="truncate">Task: Audit prototype dependency licenses</span>
                  </div>

                  <button
                    v-else-if="displayRow.row.kind === 'task_team'"
                    type="button"
                    class="org-execution-row relative flex min-h-7 w-full items-center rounded-md bg-indigo-50/70 text-left text-sm text-indigo-900 transition-colors hover:bg-indigo-50"
                    :style="rowStyle(displayRow.row.depth)"
                    :aria-expanded="taskTeamExpanded"
                    :aria-level="displayRow.row.depth + 1"
                    data-test="history-task-team-row"
                    role="treeitem"
                    @click="taskTeamExpanded = !taskTeamExpanded"
                  >
                    <WorkspaceHierarchyBranches :depth="displayRow.row.depth" :continuing-ancestor-depths="displayRow.continuingAncestorDepths" :has-following-sibling="displayRow.hasFollowingSibling" />
                    <Icon icon="heroicons:chevron-down-20-solid" class="ml-2 mr-1 h-3.5 w-3.5 text-indigo-400 transition-transform" :class="taskTeamExpanded ? 'rotate-0' : '-rotate-90'" />
                    <Icon icon="heroicons:user-group-20-solid" class="mr-1.5 h-4 w-4 text-indigo-600" />
                    <span class="truncate">Task: Review the implementation as a Team</span>
                  </button>

                  <div
                    v-else
                    class="org-execution-row relative flex min-h-7 w-full items-center rounded-md text-sm text-gray-600"
                    :style="rowStyle(displayRow.row.depth)"
                    data-test="history-task-team-child-row"
                    :data-status="displayRow.row.status"
                    :aria-level="displayRow.row.depth + 1"
                    role="treeitem"
                  >
                    <WorkspaceHierarchyBranches :depth="displayRow.row.depth" :continuing-ancestor-depths="displayRow.continuingAncestorDepths" :has-following-sibling="displayRow.hasFollowingSibling" />
                    <span class="ml-2 mr-1 h-3.5 w-3.5 flex-none" aria-hidden="true" />
                    <StatusDot class="mr-1.5" :status="displayRow.row.status" />
                    <span class="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.5625rem] font-semibold text-gray-600">RV</span>
                    <span class="truncate">reviewer</span>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <div class="px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">Teams</div>
          <div class="rounded-md">
            <button type="button" data-test="history-standalone-team-definition" class="flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50" :aria-expanded="standaloneTeamExpanded" @click="standaloneTeamExpanded = !standaloneTeamExpanded">
              <Icon icon="heroicons:chevron-down-20-solid" class="mr-1 h-3.5 w-3.5 text-gray-400 transition-transform" :class="standaloneTeamExpanded ? 'rotate-0' : '-rotate-90'" />
              <span class="mr-1.5 h-2 w-2 rounded-full bg-gray-300" />
              <Icon icon="heroicons:user-group-20-solid" class="mr-1.5 h-4 w-4 text-gray-500" />
              <span class="truncate">Release Readiness</span>
            </button>
            <div v-if="standaloneTeamExpanded" class="ml-3 rounded-md px-2 py-1.5 text-sm text-gray-500">Release readiness review</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import WorkspaceHierarchyBranches from '~/components/workspace/history/WorkspaceHierarchyBranches.vue';
import NestedTeamAggregateStatusDot from '~/components/workspace/history/NestedTeamAggregateStatusDot.vue';
import StatusDot from '~/components/workspace/common/StatusDot.vue';
import { useAgentSelectionStore } from '~/stores/agentSelectionStore';
import { useAgentTeamContextsStore } from '~/stores/agentTeamContextsStore';
import { agentById, orgById, teamById } from '~/prototype/aorg-flat-team-fixtures';
import { AgentStatus } from '~/types/agent/AgentStatus';
import { aggregateAgentStatuses } from '~/utils/aggregateAgentStatuses';
import { useMountedTeamStatusPrototypeReview } from '~/composables/useMountedTeamStatusPrototypeReview';

type RuntimeAgent = ReturnType<typeof agentById> & { runId: string; status: AgentStatus };
type RuntimeTeam = ReturnType<typeof teamById> & { runId: string; agents: RuntimeAgent[] };
type OrgTreeRow =
  | { key: string; kind: 'direct_agent'; depth: 0; agent: RuntimeAgent }
  | { key: string; kind: 'team'; depth: 0; team: RuntimeTeam }
  | { key: string; kind: 'team_agent'; depth: 1; team: RuntimeTeam; agent: RuntimeAgent }
  | { key: string; kind: 'task_agent'; depth: 1; status: AgentStatus }
  | { key: string; kind: 'task_team'; depth: 1 }
  | { key: string; kind: 'task_team_agent'; depth: 2; status: AgentStatus };
type VisibleOrgTreeRow = { row: OrgTreeRow; continuingAncestorDepths: number[]; hasFollowingSibling: boolean };

const emit = defineEmits(['run-selected', 'run-created']);
const route = useRoute();
const statusReview = useMountedTeamStatusPrototypeReview();
const selection = useAgentSelectionStore();
const teamContexts = useAgentTeamContextsStore();
const workspaceExpanded = ref(true);
const orgExpanded = ref(true);
const orgRunExpanded = ref(true);
const taskTeamExpanded = ref(true);
const standaloneTeamExpanded = ref(false);
const expandedTeamIds = ref(new Set<string>(['product-design-prototyping-team', 'software-engineering-team']));

const org = computed(() => orgById(String(route.query.org || 'software-development-department')));
const isActive = computed(() => route.query.phase === 'active' && !statusReview.historical.value);
const showOrgRun = computed(() => route.query.phase === 'active');
const activeStatusByAgentId: Record<string, AgentStatus> = {
  'requirements-engineer': AgentStatus.Idle,
  'product-prototyper': AgentStatus.Idle,
  'prototype-bootstrapper': AgentStatus.Offline,
  'architecture-designer': AgentStatus.Idle,
  'implementation-engineer': AgentStatus.Error,
  'code-reviewer': AgentStatus.Initializing,
  'delivery-engineer': AgentStatus.Offline,
};
const historicalStatusByAgentId: Record<string, AgentStatus> = {
  'requirements-engineer': AgentStatus.Idle,
  'product-prototyper': AgentStatus.Idle,
  'prototype-bootstrapper': AgentStatus.Error,
  'architecture-designer': AgentStatus.Idle,
  'implementation-engineer': AgentStatus.Idle,
  'code-reviewer': AgentStatus.Offline,
  'delivery-engineer': AgentStatus.Offline,
};
const agentStatus = (agentId: string): AgentStatus => (
  statusReview.historical.value
    ? historicalStatusByAgentId[agentId] ?? AgentStatus.Offline
    : activeStatusByAgentId[agentId] ?? AgentStatus.Offline
);
const taskAgentStatus = computed(() => statusReview.historical.value ? AgentStatus.Offline : AgentStatus.Running);
const taskTeamAgentStatus = computed(() => statusReview.historical.value ? AgentStatus.Offline : AgentStatus.Idle);
const directAgents = computed<RuntimeAgent[]>(() => org.value.members
  .filter((member) => member.kind === 'agent')
  .map((member) => {
    const agent = agentById(member.ref);
    return { ...agent, runId: `org-agent-run-${agent.id}`, status: agentStatus(agent.id) };
  }));
const teams = computed<RuntimeTeam[]>(() => org.value.members
  .filter((member) => member.kind === 'team')
  .map((member) => {
    const team = teamById(member.ref);
    return {
      ...team,
      runId: `org-team-run-${team.id}`,
      agents: team.agents.map((agentId) => {
        const agent = agentById(agentId);
        return { ...agent, runId: `org-team-${team.id}-member-${agent.id}`, status: agentStatus(agent.id) };
      }),
    };
  }));

const treeRows = computed<OrgTreeRow[]>(() => {
  const rows: OrgTreeRow[] = directAgents.value.map((agent) => ({ key: `direct-agent-${agent.id}`, kind: 'direct_agent', depth: 0, agent }));
  for (const team of teams.value) {
    rows.push({ key: `team-${team.id}`, kind: 'team', depth: 0, team });
    if (!isTeamExpanded(team.id)) continue;
    rows.push(...team.agents.map((agent) => ({ key: `team-${team.id}-agent-${agent.id}`, kind: 'team_agent' as const, depth: 1 as const, team, agent })));
    if (team.id !== 'product-design-prototyping-team') continue;
    rows.push({ key: 'task-agent-audit', kind: 'task_agent', depth: 1, status: taskAgentStatus.value });
    rows.push({ key: 'task-team-review', kind: 'task_team', depth: 1 });
    if (taskTeamExpanded.value) rows.push({ key: 'task-team-reviewer', kind: 'task_team_agent', depth: 2, status: taskTeamAgentStatus.value });
  }
  return rows;
});

const visibleRows = computed<VisibleOrgTreeRow[]>(() => {
  const hasFollowingSiblingAtDepth = (index: number, depth: number): boolean => {
    for (let nextIndex = index + 1; nextIndex < treeRows.value.length; nextIndex += 1) {
      const nextDepth = treeRows.value[nextIndex].depth;
      if (nextDepth < depth) return false;
      if (nextDepth === depth) return true;
    }
    return false;
  };
  return treeRows.value.map((row, index) => ({
    row,
    continuingAncestorDepths: Array.from({ length: row.depth }, (_, depth) => depth)
      .filter((depth) => hasFollowingSiblingAtDepth(index, depth)),
    hasFollowingSibling: hasFollowingSiblingAtDepth(index, row.depth),
  }));
});

const rowStyle = (depth: number): Record<string, string> => ({ paddingLeft: `calc((${depth} + 1) * 0.875rem)` });
const teamAggregateStatus = (team: RuntimeTeam): AgentStatus => aggregateAgentStatuses([
  ...team.agents.map((agent) => agent.status),
  ...(team.id === 'product-design-prototyping-team'
    ? [taskAgentStatus.value, taskTeamAgentStatus.value]
    : []),
]);
const isRunSelected = (runId: string, type: 'agent' | 'team'): boolean => selection.selectedType === type && selection.selectedRunId === runId;
const isTeamExpanded = (teamId: string): boolean => expandedTeamIds.value.has(teamId);
const toggleTeam = (teamId: string): void => {
  const next = new Set(expandedTeamIds.value);
  next.has(teamId) ? next.delete(teamId) : next.add(teamId);
  expandedTeamIds.value = next;
};
const selectDirectAgent = (runId: string): void => {
  if (!isActive.value) return;
  selection.selectRun(runId, 'agent');
  emit('run-selected');
};
const selectTeam = (team: RuntimeTeam): void => {
  if (!isActive.value) return;
  if (!isTeamExpanded(team.id)) toggleTeam(team.id);
  const coordinator = team.agents.find((agent) => agent.id === team.coordinatorId);
  if (coordinator) teamContexts.focusMember(team.runId, coordinator.runId);
  selection.selectRun(team.runId, 'team');
  emit('run-selected');
};
const focusTeamAgent = (teamRunId: string, agentRunId: string): void => {
  if (!isActive.value) return;
  teamContexts.focusMember(teamRunId, agentRunId);
  selection.selectRun(teamRunId, 'team');
  emit('run-selected');
};
const isTeamMemberFocused = (teamRunId: string, agentRunId: string): boolean => (
  selection.selectedType === 'team'
  && selection.selectedRunId === teamRunId
  && teamContexts.getTeamContextById(teamRunId)?.view.getFocusedAgentRunId() === agentRunId
);

watch(statusReview.state, (state) => {
  expandedTeamIds.value = state === 'collapsed'
    ? new Set<string>()
    : new Set<string>(['product-design-prototyping-team', 'software-engineering-team']);
}, { immediate: true });
</script>

<style scoped>
.org-execution-row {
  isolation: isolate;
}

.org-execution-row > :not(.hierarchy-branches) {
  position: relative;
  z-index: 2;
}

.org-execution-row.is-selected {
  border-radius: 0;
  background-color: #eef2ff;
  box-shadow: inset 2px 0 #6366f1;
}
</style>
