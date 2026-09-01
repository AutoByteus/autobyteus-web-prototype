<template>
  <div class="flex h-full flex-col bg-white" data-test="agent-org-run-config">
    <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <div class="space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Agent Org</label>
          <div class="block w-full cursor-not-allowed select-none rounded-md border border-transparent bg-slate-50 px-3 py-2 text-sm text-gray-500">
            {{ org.name }}
          </div>
        </div>

        <RuntimeModelConfigFields
          :runtime-kind="runtimeKind"
          :llm-model-identifier="llmModelIdentifier"
          :llm-config="llmConfig"
          runtime-help-text="Selects the runtime used by this organization run."
          model-label="Default LLM Model"
          model-help-text="Used across the organization unless a placement is customized."
          id-prefix="org-run"
          control-variant="quiet"
          @update:runtime-kind="runtimeKind = $event"
          @update:llm-model-identifier="llmModelIdentifier = $event"
          @update:llm-config="llmConfig = $event"
        />

        <div class="mt-8">
          <WorkspaceSelector
            :workspace-id="workspaceId"
            :is-loading="false"
            :error="workspaceError"
            :initial-path="workspacePath"
            control-variant="quiet"
            @select-existing="selectWorkspace"
            @workspace-input-change="handleWorkspaceInput"
          />
        </div>

        <div class="mt-4 flex items-center justify-between gap-4 py-2" data-test="org-auto-approve-row">
          <div class="min-w-0">
            <label for="org-auto-execute" class="block text-base text-gray-900">Auto approve tools</label>
            <p class="mt-1 text-xs leading-relaxed text-gray-500">Automatically allows tool calls and access requests for this run.</p>
          </div>
          <button
            id="org-auto-execute"
            type="button"
            role="switch"
            :aria-checked="autoExecuteTools"
            class="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :class="autoExecuteTools ? 'bg-blue-600' : 'bg-gray-200'"
            @click="autoExecuteTools = !autoExecuteTools"
          >
            <span class="sr-only">Auto approve tools</span>
            <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition" :class="autoExecuteTools ? 'translate-x-5' : 'translate-x-0'" />
          </button>
        </div>

        <div class="mt-4">
          <button
            type="button"
            data-test="org-member-overrides-toggle"
            class="flex w-full items-center justify-between rounded-md px-1 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            :aria-expanded="overridesExpanded"
            @click="overridesExpanded = !overridesExpanded"
          >
            <span>Member overrides</span>
            <Icon icon="heroicons:chevron-down-20-solid" class="h-4 w-4 text-gray-600 transition-transform" :class="overridesExpanded ? '' : '-rotate-90'" />
          </button>

          <div v-show="overridesExpanded" class="mt-3 overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm" data-test="org-member-overrides-panel">
            <AgentOrgPlacementOverrideRow
              v-for="agent in directAgents"
              :key="agent.address"
              :placement-key="agent.key"
              kind="agent"
              :name="agent.name"
              :address="agent.address"
              :expanded="editingPlacement === agent.address"
              :override="memberOverrides[agent.address]"
              :global-runtime-kind="runtimeKind"
              :global-llm-model="llmModelIdentifier"
              :global-llm-config="llmConfig"
              @toggle="togglePlacement(agent.address)"
              @update:override="setPlacementOverride(agent.address, $event)"
            />

            <section v-for="team in teams" :key="team.address" class="border-t border-slate-200 bg-slate-50/60">
              <AgentOrgPlacementOverrideRow
                :placement-key="team.key"
                kind="team"
                :name="team.name"
                :address="team.address"
                :detail="`Coordinator: ${team.coordinatorName}`"
                :expanded="editingPlacement === team.address"
                :override="memberOverrides[team.address]"
                :global-runtime-kind="runtimeKind"
                :global-llm-model="llmModelIdentifier"
                :global-llm-config="llmConfig"
                @toggle="togglePlacement(team.address)"
                @update:override="setPlacementOverride(team.address, $event)"
              />
              <div class="ml-6 border-l border-slate-200 bg-white">
                <AgentOrgPlacementOverrideRow
                  v-for="agent in team.agents"
                  :key="agent.address"
                  :placement-key="agent.key"
                  kind="agent"
                  :name="agent.name"
                  :address="agent.address"
                  :expanded="editingPlacement === agent.address"
                  :override="memberOverrides[agent.address]"
                  :global-runtime-kind="runtimeKind"
                  :global-llm-model="llmModelIdentifier"
                  :global-llm-config="llmConfig"
                  @toggle="togglePlacement(agent.address)"
                  @update:override="setPlacementOverride(agent.address, $event)"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 bg-gray-50 px-4 py-3">
      <button
        type="button"
        data-test="run-agent-org"
        class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!canRun"
        @click="runOrg"
      >
        Run Agent Org
      </button>
      <p v-if="!workspaceReady" class="mt-2 text-xs text-amber-700">Workspace is required to run an Agent Org.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import RuntimeModelConfigFields from '~/components/launch-config/RuntimeModelConfigFields.vue';
import WorkspaceSelector from '~/components/workspace/config/WorkspaceSelector.vue';
import AgentOrgPlacementOverrideRow from '~/components/workspace/config/AgentOrgPlacementOverrideRow.vue';
import { agentById, orgById, teamById } from '~/prototype/aorg-flat-team-fixtures';
import type { AgentRuntimeKind } from '~/types/agent/AgentRunConfig';
import type { MemberConfigOverride } from '~/types/agent/TeamRunConfig';
import { useAgentOrgPrototypeReview } from '~/composables/useAgentOrgPrototypeReview';
import { useWorkspaceStore } from '~/stores/workspace';
import { useRightSideTabs } from '~/composables/useRightSideTabs';

type AgentPlacement = { key: string; name: string; address: string };
type TeamPlacement = AgentPlacement & { coordinatorName: string; agents: AgentPlacement[] };

const route = useRoute();
const { push: pushExperienceRoute } = useAgentOrgPrototypeReview();
const workspaceStore = useWorkspaceStore();
const { setActiveTab } = useRightSideTabs();
const org = computed(() => orgById(String(route.query.org || 'software-development-department')));
const runtimeKind = ref<AgentRuntimeKind>('autobyteus');
const llmModelIdentifier = ref('mock/gpt-prototype');
const llmConfig = ref<Record<string, unknown> | null>({ temperature: 0.2 });
const autoExecuteTools = ref(false);
const workspaceId = ref<string | null>(null);
const workspacePath = ref('');
const workspaceError = ref<string | null>(null);
const overridesExpanded = ref(false);
const editingPlacement = ref<string | null>(null);
const memberOverrides = ref<Record<string, MemberConfigOverride>>({});

const canonicalSegment = (value: string): string => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
const directAgents = computed<AgentPlacement[]>(() => org.value.members
  .filter((member) => member.kind === 'agent')
  .map((member) => {
    const agent = agentById(member.ref);
    const segment = canonicalSegment(agent.name);
    return { key: `agent-${member.ref}`, name: agent.name, address: `/${segment}` };
  }));
const teams = computed<TeamPlacement[]>(() => org.value.members
  .filter((member) => member.kind === 'team')
  .map((member) => {
    const team = teamById(member.ref);
    const segment = canonicalSegment(team.id);
    return {
      key: `team-${member.ref}`,
      name: team.name,
      address: `/${segment}`,
      coordinatorName: agentById(team.coordinatorId).name,
      agents: team.agents.map((agentId) => {
        const agent = agentById(agentId);
        return {
          key: `agent-${member.ref}-${agentId}`,
          name: agent.name,
          address: `/${segment}/${canonicalSegment(agent.name)}`,
        };
      }),
    };
  }));

const workspaceReady = computed(() => Boolean(workspaceId.value || workspacePath.value.trim()));
const canRun = computed(() => workspaceReady.value && Boolean(runtimeKind.value && llmModelIdentifier.value));

const togglePlacement = (address: string): void => {
  editingPlacement.value = editingPlacement.value === address ? null : address;
};
const setPlacementOverride = (address: string, override: MemberConfigOverride | null): void => {
  const next = { ...memberOverrides.value };
  if (override) next[address] = override;
  else delete next[address];
  memberOverrides.value = next;
};
const selectWorkspace = (id: string): void => {
  workspaceId.value = id;
  const workspace = workspaceStore.workspaces[id];
  workspacePath.value = workspace?.absolutePath || workspace?.workspaceRootPath || workspace?.workspaceConfig?.root_path || workspace?.workspaceConfig?.rootPath || '';
  workspaceError.value = null;
  setActiveTab('files');
};
const handleWorkspaceInput = (input: { mode: 'existing' | 'new'; pendingPath: string }): void => {
  if (input.mode === 'new') {
    workspaceId.value = null;
    workspacePath.value = input.pendingPath.trim();
  } else if (!workspaceId.value) {
    workspacePath.value = '';
  }
  workspaceError.value = null;
};
const runOrg = async (): Promise<void> => {
  if (!canRun.value) {
    workspaceError.value = 'Choose or create a workspace before running this Agent Org.';
    return;
  }
  await pushExperienceRoute('/workspace', {
    root: 'org',
    org: org.value.id,
    phase: 'active',
  });
};
</script>
