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
              <span class="truncate font-medium">{{ orgName }}</span>
            </button>

            <div v-if="orgExpanded && isActive" class="ml-3 mt-0.5 space-y-0.5">
              <div class="group flex items-center justify-between rounded-md px-2 py-1 text-sm transition-colors" :class="isOrgRunSelected ? 'bg-indigo-50 text-indigo-900' : 'text-gray-700 hover:bg-gray-50'">
                <button type="button" class="flex min-w-0 flex-1 items-center text-left" :aria-expanded="orgRunExpanded" data-test="history-org-root" @click="selectOrgRun">
                  <Icon icon="heroicons:chevron-down-20-solid" class="mr-1 h-3.5 w-3.5 text-gray-400 transition-transform" :class="orgRunExpanded ? 'rotate-0' : '-rotate-90'" />
                  <span class="mr-1.5 h-2 w-2 flex-none rounded-full bg-emerald-500" aria-label="Running" />
                  <span class="truncate font-medium">New - {{ orgName }}</span>
                </button>
                <span class="ml-2 text-xs text-gray-400">now</span>
              </div>

              <div v-if="orgRunExpanded" class="ml-3 space-y-0.5" data-test="history-org-execution-tree">
                <button v-if="entryKind === 'agent'" type="button" class="flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors" :class="isDirectAgentSelected ? 'bg-indigo-50 text-indigo-900' : 'text-gray-700 hover:bg-gray-50'" data-test="history-org-direct-agent" @click="selectOrgRun">
                  <span class="mr-1.5 h-2 w-2 flex-none rounded-full bg-emerald-500" />
                  <span class="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.5625rem] font-semibold text-gray-600">RE</span>
                  <span class="truncate">requirements_engineer</span>
                </button>
                <div v-else class="flex items-center rounded-md px-2 py-1.5 text-sm text-gray-600">
                  <span class="mr-1.5 h-2 w-2 flex-none rounded-full bg-gray-300" />
                  <span class="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.5625rem] font-semibold text-gray-600">RE</span>
                  <span class="truncate">requirements_engineer</span>
                </div>

                <div class="rounded-md" data-test="history-configured-team-placement">
                  <button type="button" class="flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors" :class="entryKind === 'team' ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-500'" :aria-expanded="entryKind === 'team' && enteredTeamExpanded" :disabled="entryKind !== 'team'" @click="enteredTeamExpanded = !enteredTeamExpanded">
                    <Icon icon="heroicons:chevron-down-20-solid" class="mr-1 h-3.5 w-3.5 text-gray-400 transition-transform" :class="entryKind === 'team' && enteredTeamExpanded ? 'rotate-0' : '-rotate-90'" />
                    <Icon icon="heroicons:user-group-20-solid" class="mr-1.5 h-4 w-4 text-gray-500" />
                    <span class="truncate font-medium">Product Design &amp; Prototyping</span>
                  </button>

                  <div v-if="entryKind === 'team' && enteredTeamExpanded" class="ml-3 space-y-0.5">
                    <button type="button" class="flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors" :class="focusedAgentRunId === coordinatorRunId ? 'bg-indigo-50 text-indigo-900' : entryKind === 'team' ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-500'" :disabled="entryKind !== 'team'" @click="focusTeamMember(coordinatorRunId)">
                      <span class="mr-1.5 h-2 w-2 flex-none rounded-full" :class="entryKind === 'team' ? 'bg-emerald-500' : 'bg-gray-300'" />
                      <span class="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.5625rem] font-semibold text-gray-600">PP</span>
                      <span class="truncate">product_prototyper</span>
                    </button>
                    <button type="button" class="flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors" :class="focusedAgentRunId === bootstrapperRunId ? 'bg-indigo-50 text-indigo-900' : entryKind === 'team' ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-500'" :disabled="entryKind !== 'team'" @click="focusTeamMember(bootstrapperRunId)">
                      <span class="mr-1.5 h-2 w-2 flex-none rounded-full" :class="entryKind === 'team' ? 'bg-emerald-500' : 'bg-gray-300'" />
                      <span class="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.5625rem] font-semibold text-gray-600">PB</span>
                      <span class="truncate">prototype_bootstrapper</span>
                    </button>
                    <button v-if="entryKind === 'team'" type="button" class="ml-3 flex w-[calc(100%_-_0.75rem)] items-center rounded-md bg-indigo-50/70 px-2 py-1.5 text-left text-sm text-indigo-900 transition-colors hover:bg-indigo-50" :class="focusedAgentRunId === taskAgentRunId ? 'ring-1 ring-indigo-200' : ''" data-test="history-task-agent-row" @click="focusTeamMember(taskAgentRunId)">
                      <Icon icon="svg-spinners:ring-resize" class="mr-1.5 h-3.5 w-3.5 flex-none text-indigo-600" />
                      <span class="truncate">Task: Audit prototype dependency licenses</span>
                    </button>
                    <button v-if="entryKind === 'team'" type="button" class="flex w-full items-center rounded-md bg-indigo-50/70 px-2 py-1.5 text-left text-sm text-indigo-900 transition-colors hover:bg-indigo-50" :aria-expanded="taskTeamExpanded" data-test="history-task-team-row" @click="taskTeamExpanded = !taskTeamExpanded">
                      <Icon icon="heroicons:chevron-down-20-solid" class="mr-1 h-3.5 w-3.5 text-indigo-400 transition-transform" :class="taskTeamExpanded ? 'rotate-0' : '-rotate-90'" />
                      <Icon icon="svg-spinners:ring-resize" class="mr-1.5 h-3.5 w-3.5 flex-none text-indigo-600" />
                      <span class="truncate">Task: Review the implementation as a Team</span>
                    </button>
                    <button v-if="entryKind === 'team' && taskTeamExpanded" type="button" class="ml-5 flex w-[calc(100%_-_1.25rem)] items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors" :class="focusedAgentRunId === taskTeamChildRunId ? 'bg-indigo-50 text-indigo-900' : 'text-gray-700 hover:bg-gray-50'" data-test="history-task-team-child-row" @click="focusTeamMember(taskTeamChildRunId)">
                      <span class="mr-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                      <span class="truncate">reviewer</span>
                    </button>
                  </div>
                </div>

                <div class="flex items-center rounded-md px-2 py-1.5 text-sm text-gray-500">
                  <Icon icon="heroicons:chevron-right-20-solid" class="mr-1 h-3.5 w-3.5 text-gray-400" />
                  <Icon icon="heroicons:user-group-20-solid" class="mr-1.5 h-4 w-4 text-gray-500" />
                  <span class="truncate font-medium">Software Engineering</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-1 px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">Teams</div>
          <div class="rounded-md">
            <button type="button" class="flex w-full items-center rounded-md px-2 py-1 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50" :aria-expanded="standaloneTeamExpanded" data-test="history-standalone-team-definition" @click="standaloneTeamExpanded = !standaloneTeamExpanded">
              <Icon icon="heroicons:chevron-down-20-solid" class="mr-1 h-3.5 w-3.5 text-gray-400 transition-transform" :class="standaloneTeamExpanded ? 'rotate-0' : '-rotate-90'" />
              <span class="mr-1.5 h-2 w-2 flex-none rounded-full bg-gray-300" />
              <span class="mr-1.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-gray-200 text-[0.625rem] font-semibold text-gray-600">RR</span>
              <span class="truncate font-medium">Release Readiness</span>
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
import { useRunHistoryStore } from '~/stores/runHistoryStore';

defineEmits(['run-selected', 'run-created']);

const route = useRoute();
const selection = useAgentSelectionStore();
const teamContexts = useAgentTeamContextsStore();
const runHistory = useRunHistoryStore();
const workspaceExpanded = ref(true);
const orgExpanded = ref(true);
const orgRunExpanded = ref(true);
const enteredTeamExpanded = ref(true);
const taskTeamExpanded = ref(true);
const standaloneTeamExpanded = ref(false);

const orgName = computed(() => route.query.org === 'product-release-organization' ? 'Product Release Organization' : 'Software Development Department');
const entryKind = computed<'agent' | 'team'>(() => String(route.query.entry || '').startsWith('agent:') ? 'agent' : 'team');
const entryId = computed(() => String(route.query.entry || '').split(':')[1] || (entryKind.value === 'agent' ? 'requirements-engineer' : 'product-design-prototyping-team'));
const isActive = computed(() => route.query.phase === 'active');
const teamRunId = computed(() => `org-team-run-${entryId.value}`);
const agentRunId = computed(() => `org-agent-run-${entryId.value}`);
const coordinatorRunId = 'org-team-member-product-prototyper';
const bootstrapperRunId = 'org-team-member-prototype-bootstrapper';
const taskAgentRunId = 'task-agent-license-audit';
const taskTeamChildRunId = 'task-team-review:reviewer';
const focusedAgentRunId = computed(() => teamContexts.getTeamContextById(teamRunId.value)?.view.getFocusedAgentRunId() || null);
const isOrgRunSelected = computed(() => isActive.value && selection.selectedRunId === (entryKind.value === 'team' ? teamRunId.value : agentRunId.value));
const isDirectAgentSelected = computed(() => entryKind.value === 'agent' && selection.selectedRunId === agentRunId.value);

const selectOrgRun = (): void => {
  if (!isActive.value) return;
  orgRunExpanded.value = true;
  selection.selectRun(entryKind.value === 'team' ? teamRunId.value : agentRunId.value, entryKind.value);
};

const focusTeamMember = async (agentRunIdValue: string): Promise<void> => {
  if (entryKind.value !== 'team' || !isActive.value) return;
  selection.selectRun(teamRunId.value, 'team');
  await runHistory.focusTeamMemberAndEnsureHydrated(teamRunId.value, agentRunIdValue);
};
</script>
