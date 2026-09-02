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
            :model="{
              mode: 'editable',
              selection: workspaceSelection,
              isLoading: false,
              error: workspaceError,
            }"
            :auto-select-default="false"
            control-variant="quiet"
            @update:model-value="selectWorkspace"
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
            aria-controls="org-member-overrides-panel"
            @click="overridesExpanded = !overridesExpanded"
          >
            <span class="flex min-w-0 items-center gap-1.5">
              <span class="truncate" data-test="org-member-overrides-label">Member overrides</span>
              <Icon
                icon="heroicons:chevron-down-20-solid"
                class="h-4 w-4 flex-shrink-0 text-gray-600 transition-transform"
                :class="overridesExpanded ? '' : '-rotate-90'"
                data-test="org-member-overrides-chevron"
                aria-hidden="true"
              />
            </span>
          </button>

          <div
            v-show="overridesExpanded"
            id="org-member-overrides-panel"
            class="mt-3 space-y-3"
            data-test="org-member-overrides-panel"
          >
            <div v-if="directAgents.length" class="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm" data-test="org-direct-agent-overrides">
              <AgentOrgPlacementOverrideRow
                v-for="agent in directAgents"
                :key="agent.address"
                :placement-key="agent.key"
                kind="agent"
                :name="agent.name"
                :address="agent.address"
                :expanded="editingPlacement === agent.address"
                :override="agentOverrides[agent.address]"
                :global-runtime-kind="runtimeKind"
                :global-llm-model="llmModelIdentifier"
                :global-llm-config="llmConfig"
                :global-auto-execute-tools="autoExecuteTools"
                @toggle="togglePlacement(agent.address)"
                @update:override="setAgentOverride(agent.address, $event)"
              />
            </div>

            <TeamMemberConfigTree
              :member-nodes="teamNodes"
              :disabled="false"
              team-model-help-text="Agents in this Team inherit this value unless customized."
              @update-team="setTeamOverride"
              @reset-team="resetTeamOverride"
              @update-agent="setAgentOverride"
              @update:workspace-selection="setTeamWorkspaceSelection"
            />
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
import TeamMemberConfigTree from '~/components/workspace/config/TeamMemberConfigTree.vue';
import { agentById, orgById, teamById } from '~/prototype/aorg-flat-team-fixtures';
import type { AgentRuntimeKind } from '~/types/agent/AgentRunConfig';
import type {
  AgentConfigOverride,
  ResolvedTeamRunLaunchConfig,
  TeamScopeConfigOverride,
} from '~/types/agent/TeamRunConfig';
import type {
  EditableTeamFormAgentNode,
  EditableTeamFormTeamNode,
  EditableTeamScopeFormModel,
} from '~/types/agent/EditableTeamRunFormModel';
import type { WorkspaceSelectionState } from '~/types/workspace/WorkspaceSelectionState';
import type { WorkspaceMetadata } from '~/types/workspace/WorkspaceMetadata';
import {
  hasMeaningfulLaunchOverride,
  hasMeaningfulMemberOverride,
  resolveEffectiveMemberLlmConfig,
  resolveEffectiveMemberLlmModelIdentifier,
  resolveEffectiveMemberRuntimeKind,
} from '~/utils/teamRunConfigUtils';
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
const workspaceSelection = ref<WorkspaceSelectionState>({
  mode: 'existing',
  existingWorkspaceId: null,
  newWorkspacePath: '',
});
const workspaceError = ref<string | null>(null);
const overridesExpanded = ref(false);
const editingPlacement = ref<string | null>(null);
const teamOverrides = ref<Record<string, TeamScopeConfigOverride>>({});
const agentOverrides = ref<Record<string, AgentConfigOverride>>({});

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

const workspaceMetadataFor = (selection: WorkspaceSelectionState, address = '/'): WorkspaceMetadata | null => {
  if (selection.mode === 'existing' && selection.existingWorkspaceId) {
    const workspace = workspaceStore.workspaces[selection.existingWorkspaceId];
    const rootPath = workspace?.absolutePath || workspace?.workspaceRootPath || workspace?.workspaceConfig?.root_path || workspace?.workspaceConfig?.rootPath || '';
    if (!rootPath) return null;
    return {
      workspaceId: selection.existingWorkspaceId,
      workspaceRootPath: rootPath,
      displayName: workspace?.displayName || workspace?.name || selection.existingWorkspaceId,
      kind: 'filesystem',
    };
  }
  const rootPath = selection.newWorkspacePath.trim();
  if (!rootPath) return null;
  return {
    workspaceId: `draft-${canonicalSegment(address) || 'org'}`,
    workspaceRootPath: rootPath,
    displayName: rootPath.split('/').filter(Boolean).at(-1) || 'New Workspace',
    kind: 'filesystem',
  };
};
const rootWorkspaceMetadata = computed(() => workspaceMetadataFor(workspaceSelection.value));
const rootLaunchConfig = computed<ResolvedTeamRunLaunchConfig>(() => ({
  runtimeKind: runtimeKind.value,
  workspaceId: rootWorkspaceMetadata.value?.workspaceId ?? null,
  workspaceMetadata: rootWorkspaceMetadata.value,
  workspaceRootPath: rootWorkspaceMetadata.value?.workspaceRootPath ?? null,
  llmModelIdentifier: llmModelIdentifier.value,
  llmConfig: llmConfig.value,
  autoExecuteTools: autoExecuteTools.value,
  skillAccessMode: 'PRELOADED_ONLY',
}));
const resolveLaunchConfig = (
  baseline: Readonly<ResolvedTeamRunLaunchConfig>,
  override?: AgentConfigOverride | TeamScopeConfigOverride | null,
): ResolvedTeamRunLaunchConfig => ({
  ...baseline,
  runtimeKind: resolveEffectiveMemberRuntimeKind(override, baseline.runtimeKind),
  llmModelIdentifier: resolveEffectiveMemberLlmModelIdentifier(override, baseline.llmModelIdentifier),
  llmConfig: resolveEffectiveMemberLlmConfig(override, baseline.llmConfig),
  autoExecuteTools: override?.autoExecuteTools ?? baseline.autoExecuteTools,
  ...('workspace' in (override ?? {}) && override?.workspace
    ? {
        workspaceId: override.workspace.workspaceId,
        workspaceMetadata: override.workspace.workspaceMetadata,
        workspaceRootPath: override.workspace.workspaceMetadata?.workspaceRootPath ?? null,
      }
    : {}),
});
const workspaceSelectionForTeam = (address: string, effective: Readonly<ResolvedTeamRunLaunchConfig>): WorkspaceSelectionState => {
  const override = teamOverrides.value[address];
  if (override?.workspace?.workspaceId) {
    return { mode: 'existing', existingWorkspaceId: override.workspace.workspaceId, newWorkspacePath: override.workspace.workspaceMetadata?.workspaceRootPath ?? '' };
  }
  if (override?.workspace?.workspaceMetadata?.workspaceRootPath) {
    return { mode: 'new', existingWorkspaceId: null, newWorkspacePath: override.workspace.workspaceMetadata.workspaceRootPath };
  }
  if (!override?.workspace) return { ...workspaceSelection.value };
  if (effective.workspaceId) return { mode: 'existing', existingWorkspaceId: effective.workspaceId, newWorkspacePath: effective.workspaceRootPath ?? '' };
  return { mode: 'new', existingWorkspaceId: null, newWorkspacePath: effective.workspaceRootPath ?? '' };
};
const teamNodes = computed<EditableTeamFormTeamNode[]>(() => teams.value.map((team) => {
  const teamOverride = teamOverrides.value[team.address];
  const effectiveTeamConfig = resolveLaunchConfig(rootLaunchConfig.value, teamOverride);
  const scope: EditableTeamScopeFormModel = {
    mode: 'editable',
    address: team.address,
    displayName: team.name,
    effectiveConfig: effectiveTeamConfig,
    isCustomized: hasMeaningfulLaunchOverride(teamOverride),
    inheritedConfig: rootLaunchConfig.value,
    override: teamOverride ?? null,
    workspaceSelection: workspaceSelectionForTeam(team.address, effectiveTeamConfig),
    workspaceOperation: { status: 'idle', error: null },
    runtimeCatalogState: { status: 'ready', error: null },
  };
  const children: EditableTeamFormAgentNode[] = team.agents.map((agent) => {
    const agentOverride = agentOverrides.value[agent.address];
    return {
      mode: 'editable',
      kind: 'agent',
      address: agent.address,
      displayName: agent.name,
      isCoordinator: agent.name === team.coordinatorName,
      isCustomized: hasMeaningfulMemberOverride(agentOverride),
      override: agentOverride,
      baselineConfig: effectiveTeamConfig,
      effectiveConfig: resolveLaunchConfig(effectiveTeamConfig, agentOverride),
      runtimeCatalogState: { status: 'ready', error: null },
    };
  });
  return {
    mode: 'editable',
    kind: 'agent_team',
    address: team.address,
    scope,
    children,
  };
}));

const workspaceReady = computed(() => Boolean(rootLaunchConfig.value.workspaceRootPath));
const canRun = computed(() => workspaceReady.value && Boolean(runtimeKind.value && llmModelIdentifier.value));

const togglePlacement = (address: string): void => {
  editingPlacement.value = editingPlacement.value === address ? null : address;
};
const setTeamOverride = (address: string, override: TeamScopeConfigOverride | null): void => {
  const next = { ...teamOverrides.value };
  if (hasMeaningfulLaunchOverride(override)) next[address] = override!;
  else delete next[address];
  teamOverrides.value = next;
};
const resetTeamOverride = (address: string): void => setTeamOverride(address, null);
const setAgentOverride = (address: string, override: AgentConfigOverride | null): void => {
  const next = { ...agentOverrides.value };
  if (override) next[address] = override;
  else delete next[address];
  agentOverrides.value = next;
};
const setTeamWorkspaceSelection = (address: string, selection: WorkspaceSelectionState): void => {
  const metadata = workspaceMetadataFor(selection, address);
  const current = teamOverrides.value[address] ?? {};
  const inherited = rootLaunchConfig.value;
  const selectedWorkspaceId = selection.mode === 'existing' ? selection.existingWorkspaceId : null;
  const isInherited = selectedWorkspaceId === inherited.workspaceId
    && (metadata?.workspaceRootPath ?? null) === inherited.workspaceRootPath;
  const next: TeamScopeConfigOverride = { ...current };
  if (!metadata || isInherited) delete next.workspace;
  else next.workspace = { workspaceId: selectedWorkspaceId, workspaceMetadata: metadata };
  setTeamOverride(address, next);
};
const selectWorkspace = (selection: WorkspaceSelectionState): void => {
  workspaceSelection.value = selection;
  workspaceError.value = null;
  if (selection.mode === 'existing' && selection.existingWorkspaceId) setActiveTab('files');
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
