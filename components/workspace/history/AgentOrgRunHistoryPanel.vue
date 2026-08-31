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

            <div v-if="orgExpanded && isActive" class="ml-3 mt-0.5 space-y-0.5">
              <div class="group flex items-center justify-between rounded-md px-2 py-1 text-sm text-gray-700">
                <button type="button" class="flex min-w-0 flex-1 items-center text-left" :aria-expanded="orgRunExpanded" data-test="history-org-root" @click="orgRunExpanded = !orgRunExpanded">
                  <Icon icon="heroicons:chevron-down-20-solid" class="mr-1 h-3.5 w-3.5 text-gray-400 transition-transform" :class="orgRunExpanded ? 'rotate-0' : '-rotate-90'" />
                  <span class="mr-1.5 h-2 w-2 flex-none rounded-full bg-emerald-500" aria-label="Running" />
                  <span class="truncate font-medium">New - {{ org.name }}</span>
                </button>
                <span class="ml-2 text-xs text-gray-400">now</span>
              </div>

              <div v-if="orgRunExpanded" class="ml-3 space-y-0.5" data-test="history-org-execution-tree">
                <button
                  v-for="agent in directAgents"
                  :key="agent.runId"
                  type="button"
                  class="flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors"
                  :class="isRunSelected(agent.runId, 'agent') ? 'bg-indigo-50 text-indigo-900' : 'text-gray-700 hover:bg-gray-50'"
                  :data-test="`history-org-agent-${agent.id}`"
                  @click="selectDirectAgent(agent.runId)"
                >
                  <span class="mr-1.5 h-2 w-2 flex-none rounded-full bg-emerald-500" />
                  <span class="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.5625rem] font-semibold text-gray-600">{{ agent.initials }}</span>
                  <span class="truncate">{{ agent.name }}</span>
                </button>

                <div v-for="team in teams" :key="team.id" class="rounded-md" :data-test="`history-org-team-${team.id}`">
                  <button
                    type="button"
                    class="flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors"
                    :class="isRunSelected(team.runId, 'team') ? 'bg-indigo-50 text-indigo-900' : 'text-gray-700 hover:bg-gray-50'"
                    :aria-expanded="isTeamExpanded(team.id)"
                    @click="selectTeam(team)"
                  >
                    <Icon icon="heroicons:chevron-down-20-solid" class="mr-1 h-3.5 w-3.5 text-gray-400 transition-transform" :class="isTeamExpanded(team.id) ? 'rotate-0' : '-rotate-90'" />
                    <Icon icon="heroicons:user-group-20-solid" class="mr-1.5 h-4 w-4 text-gray-500" />
                    <span class="truncate font-medium">{{ team.name }}</span>
                  </button>

                  <div v-if="isTeamExpanded(team.id)" class="ml-3 space-y-0.5">
                    <button
                      v-for="agent in team.agents"
                      :key="agent.runId"
                      type="button"
                      class="flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors"
                      :class="isTeamMemberFocused(team.runId, agent.runId) ? 'bg-indigo-50 text-indigo-900' : 'text-gray-700 hover:bg-gray-50'"
                      :data-test="`history-org-team-agent-${agent.id}`"
                      @click="focusTeamAgent(team.runId, agent.runId)"
                    >
                      <span class="mr-1.5 h-2 w-2 flex-none rounded-full bg-emerald-500" />
                      <span class="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.5625rem] font-semibold text-gray-600">{{ agent.initials }}</span>
                      <span class="min-w-0 flex-1 truncate">{{ agent.name }}</span>
                      <span v-if="agent.id === team.coordinatorId" class="ml-1 text-[0.625rem] text-gray-400" aria-label="Coordinator">◆</span>
                    </button>

                    <template v-if="team.id === 'product-design-prototyping-team'">
                      <div class="ml-3 flex items-center rounded-md bg-indigo-50/70 px-2 py-1.5 text-sm text-indigo-900" data-test="history-task-agent-row">
                        <Icon icon="svg-spinners:ring-resize" class="mr-1.5 h-3.5 w-3.5 flex-none text-indigo-600" />
                        <span class="truncate">Task: Audit prototype dependency licenses</span>
                      </div>
                      <button type="button" class="flex w-full items-center rounded-md bg-indigo-50/70 px-2 py-1.5 text-left text-sm text-indigo-900 transition-colors hover:bg-indigo-50" :aria-expanded="taskTeamExpanded" data-test="history-task-team-row" @click="taskTeamExpanded = !taskTeamExpanded">
                        <Icon icon="heroicons:chevron-down-20-solid" class="mr-1 h-3.5 w-3.5 text-indigo-400 transition-transform" :class="taskTeamExpanded ? 'rotate-0' : '-rotate-90'" />
                        <Icon icon="heroicons:user-group-20-solid" class="mr-1.5 h-4 w-4 text-indigo-600" />
                        <span class="truncate">Task: Review the implementation as a Team</span>
                      </button>
                      <div v-if="taskTeamExpanded" class="ml-3 flex items-center rounded-md px-2 py-1.5 text-sm text-gray-600" data-test="history-task-team-child-row">
                        <span class="mr-1.5 h-2 w-2 flex-none rounded-full bg-emerald-500" />
                        <span class="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.5625rem] font-semibold text-gray-600">RV</span>
                        <span class="truncate">reviewer</span>
                      </div>
                    </template>
                  </div>
                </div>
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
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import { useAgentSelectionStore } from '~/stores/agentSelectionStore';
import { useAgentTeamContextsStore } from '~/stores/agentTeamContextsStore';
import { agentById, orgById, teamById } from '~/prototype/aorg-flat-team-fixtures';

const emit = defineEmits(['run-selected', 'run-created']);
const route = useRoute();
const selection = useAgentSelectionStore();
const teamContexts = useAgentTeamContextsStore();
const workspaceExpanded = ref(true);
const orgExpanded = ref(true);
const orgRunExpanded = ref(true);
const taskTeamExpanded = ref(true);
const standaloneTeamExpanded = ref(false);
const expandedTeamIds = ref(new Set<string>(['product-design-prototyping-team', 'software-engineering-team']));

const org = computed(() => orgById(String(route.query.org || 'software-development-department')));
const isActive = computed(() => route.query.phase === 'active');
const directAgents = computed(() => org.value.members
  .filter((member) => member.kind === 'agent')
  .map((member) => {
    const agent = agentById(member.ref);
    return { ...agent, runId: `org-agent-run-${agent.id}` };
  }));
const teams = computed(() => org.value.members
  .filter((member) => member.kind === 'team')
  .map((member) => {
    const team = teamById(member.ref);
    return {
      ...team,
      runId: `org-team-run-${team.id}`,
      agents: team.agents.map((agentId) => {
        const agent = agentById(agentId);
        return { ...agent, runId: `org-team-${team.id}-member-${agent.id}` };
      }),
    };
  }));

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
const selectTeam = (team: { id: string; runId: string; coordinatorId: string; agents: Array<{ id: string; runId: string }> }): void => {
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
</script>
