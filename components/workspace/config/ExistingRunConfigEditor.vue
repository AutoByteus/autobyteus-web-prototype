<template>
  <div class="flex min-h-0 flex-1 flex-col" :aria-busy="draftStore.loadingCanonical || draftStore.saving || draftStore.reconciling">
    <div v-if="!draft" class="flex-1 overflow-y-auto px-4 py-4">
      <div
        :role="draftStore.feedback?.kind === 'error' ? 'alert' : 'status'"
        class="rounded border px-3 py-2 text-sm"
        :class="draftStore.feedback?.kind === 'error'
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-blue-100 bg-blue-50 text-blue-700'"
      >
        {{ draftStore.feedback?.kind === 'error'
          ? draftStore.feedback.message
          : t('workspace.runModelConfig.loading') }}
      </div>
    </div>

    <!-- run-settings-ui-unification (SCN-004): saved-run settings in the run-settings vocabulary. -->
    <ExistingRunSettings
      v-else-if="existingSettings"
      :key="existingSettings.key"
      v-bind="existingSettings.props"
      @refresh="draftStore.retryCanonicalRefresh"
    />

    <div v-else class="flex-1 overflow-y-auto px-4 py-4">
      <div role="alert" class="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        {{ t('workspace.runModelConfig.runUnavailable') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAgentSelectionStore } from '~/stores/agentSelectionStore'
import { useRunHistoryStore } from '~/stores/runHistoryStore'
import { useExistingRunConfigStore } from '~/stores/existingRunConfigStore'
import { useAgentContextsStore } from '~/stores/agentContextsStore'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useWorkspaceStore } from '~/stores/workspace'
import type { AgentRunConfig } from '~/types/agent/AgentRunConfig'
import type { WorkspaceSelectionState } from '~/types/workspace/WorkspaceSelectionState'
import { projectExistingTeamRunFormModel } from '~/services/runConfigEditing/existingTeamRunFormModel'
import { projectExistingAgentOrgRunFormModel } from '~/services/runConfigEditing/existingAgentOrgRunFormModel'
import ExistingRunSettings from '~/components/run-settings/ExistingRunSettings.vue'
import { valuesFromResolved } from '~/components/run-settings/memberNodes'
import { toChatWorkspace } from '~/components/run-settings/runSettings'
import { useLocalization } from '~/composables/useLocalization'

const selection = useAgentSelectionStore()
const history = useRunHistoryStore()
const draftStore = useExistingRunConfigStore()
const contexts = useAgentContextsStore()
const definitions = useAgentDefinitionStore()
const { t } = useLocalization()
const { draft } = storeToRefs(draftStore)
const props = defineProps<{ target?: Readonly<{ kind: 'agent_org'; orgRunId: string }> | null }>()

type SelectedRunKind = 'agent' | 'team' | 'agent_org'
const selectedKind = computed<SelectedRunKind | null>(() => {
  if (props.target) return 'agent_org'
  const subject = selection.subject
  if (subject?.kind === 'agent_run') return 'agent'
  if (subject?.kind === 'team_run') return 'team'
  return null
})
const selectedRunId = computed(() => {
  if (props.target) return props.target.orgRunId
  const subject = selection.subject
  if (subject?.kind === 'agent_run') return subject.runId
  if (subject?.kind === 'team_run') return subject.rootTeamRunId
  return null
})

const selectedCanonical = computed(() => {
  const subject = selection.subject
  if (subject?.kind === 'agent_run') return history.resumeConfigByRunId[subject.runId] ?? null
  if (subject?.kind === 'team_run') return history.teamResumeConfigByTeamRunId[subject.rootTeamRunId] ?? null
  return null
})

watch([selectedKind, selectedRunId], ([kind, id]) => {
  if (!kind || !id) {
    draftStore.clear()
    return
  }
  if (kind === 'agent') void draftStore.loadAgentCanonical(id)
  else if (kind === 'team') void draftStore.loadTeamCanonical(id)
  else void draftStore.loadAgentOrgCanonical(id)
}, { immediate: true })

watch(selectedCanonical, (payload) => {
  if (!payload) return
  if ('runId' in payload) draftStore.applyCachedAgentLifecycle(payload)
  else draftStore.applyCachedTeamLifecycle(payload)
}, { deep: true })

onBeforeUnmount(() => draftStore.clear())

const agentConfig = computed<AgentRunConfig | null>(() => {
  const current = draft.value
  if (current?.kind !== 'agent') return null
  const hydrated = contexts.getConfigForRun(current.runId)
  return {
    agentDefinitionId: current.metadata.agentDefinitionId,
    agentDefinitionName: hydrated?.agentDefinitionName ?? 'Agent',
    agentAvatarUrl: hydrated?.agentAvatarUrl ?? null,
    runtimeKind: current.metadata.runtimeKind ?? 'autobyteus',
    ...current.draftSelection,
    workspaceId: hydrated?.workspaceId ?? null,
    workspaceMetadata: hydrated?.workspaceMetadata ?? null,
    autoExecuteTools: current.metadata.autoExecuteTools,
    isLocked: true,
  }
})
const agentDefinition = computed(() => agentConfig.value
  ? definitions.getAgentDefinitionById(agentConfig.value.agentDefinitionId) ?? { name: agentConfig.value.agentDefinitionName }
  : null)
const workspaceStore = useWorkspaceStore()
// A run reopened from history carries a history-derived workspace id; show the known workspace
// with the same root (e.g. the temp workspace) instead of an empty selector.
const agentWorkspaceSelection = computed<WorkspaceSelectionState>(() => {
  const rootPath = draft.value?.kind === 'agent' ? draft.value.metadata.workspaceRootPath : ''
  const workspaceId = agentConfig.value?.workspaceId ?? null
  const knownWorkspaceId = workspaceId && workspaceStore.workspaces[workspaceId]
    ? workspaceId
    : (rootPath ? workspaceStore.findWorkspaceInfoByRootPath(rootPath)?.workspaceId : null) ?? workspaceId
  return { mode: 'existing', existingWorkspaceId: knownWorkspaceId, newWorkspacePath: rootPath }
})
const agentModelConfigFieldErrors = computed<Record<string, string>>(() => Object.fromEntries(
  draftStore.fieldErrors.flatMap((error) => {
    const match = /^llmConfig\.([^.[]+)/.exec(error.path)
    return match ? [[match[1]!, error.message]] : []
  }),
))
const teamModelConfigFieldErrorsByAddress = computed<Record<string, Record<string, string>>>(() => {
  const byAddress: Record<string, Record<string, string>> = {}
  for (const error of draftStore.fieldErrors) {
    const match = /^(?:patches|modelPatches)\[(.+)]\.llmConfig\.([^.[]+)/.exec(error.path)
    if (!match) continue
    const addressErrors = byAddress[match[1]!] ??= {}
    addressErrors[match[2]!] = error.message
  }
  return byAddress
})
const teamFormModel = computed(() => {
  const current = draft.value
  if (current?.kind !== 'team') throw new Error('Existing Team form requires a Team draft.')
  return projectExistingTeamRunFormModel({
    tree: current.executionTree,
    planner: current.planner,
    isActive: current.isActive,
    modelConfigEditable: current.editability.editable && !current.isActive && !draftStore.reconciliationRequired,
    modelConfigReason: draftStore.reconciliationRequired ? 'REFRESH_REQUIRED' : current.editability.reason ?? null,
    modelOptionsByAddress: draftStore.modelOptionsByAddress,
    saving: draftStore.saving || draftStore.reconciling,
  })
})
const agentOrgFormModel = computed(() => {
  const current = draft.value
  if (current?.kind !== 'agent_org') throw new Error('Existing AgentOrg form requires an AgentOrg draft.')
  return projectExistingAgentOrgRunFormModel({
    workspaceDraft: current.workspaceDraft,
    tree: current.executionTree,
    planner: current.planner,
    isActive: current.isActive,
    modelConfigEditable: current.editability.editable && !current.isActive && !draftStore.reconciliationRequired,
    modelConfigReason: draftStore.reconciliationRequired ? 'REFRESH_REQUIRED' : current.editability.reason ?? null,
    modelOptionsByAddress: draftStore.modelOptionsByAddress,
    saving: draftStore.saving || draftStore.reconciling,
  })
})

// run-settings-ui-unification: deterministic review states the synthetic fixtures do not reach.
// localStorage `autobyteus.design.runSettings.existingState` = `refresh_required` | `model_unavailable`.
const designState = typeof window === 'undefined' ? null : window.localStorage.getItem('autobyteus.design.runSettings.existingState')
const existingSettings = computed(() => {
  const current = draft.value
  if (!current) return null
  const refreshRequired = draftStore.reconciliationRequired || current.editability.reason === 'REFRESH_REQUIRED' || designState === 'refresh_required'
  const common = {
    isActive: current.isActive,
    editable: current.editability.editable,
    refreshRequired,
    modelUnavailable: designState === 'model_unavailable',
  }
  if (current.kind === 'agent' && agentConfig.value) {
    const config = agentConfig.value
    return {
      key: `agent:${current.runId}`,
      props: {
        ...common,
        kind: 'agent' as const,
        name: agentDefinition.value?.name ?? config.agentDefinitionName,
        baseValues: {
          workspace: toChatWorkspace(agentWorkspaceSelection.value.existingWorkspaceId, current.metadata.workspaceRootPath),
          runtimeKind: config.runtimeKind,
          llmModelIdentifier: config.llmModelIdentifier || '',
          llmConfig: config.llmConfig ?? null,
          autoExecuteTools: config.autoExecuteTools,
        },
      },
    }
  }
  if (current.kind === 'team' || current.kind === 'agent_org') {
    const model = current.kind === 'team' ? teamFormModel.value : agentOrgFormModel.value
    return {
      key: `${current.kind}:${current.kind === 'team' ? current.teamRunId : (current as { orgRunId?: string }).orgRunId ?? ''}`,
      props: {
        ...common,
        kind: current.kind === 'team' ? 'team' as const : 'org' as const,
        name: model.definitionLabel,
        baseValues: valuesFromResolved(model.root.effectiveConfig),
        rootAddress: model.root.address,
        members: model.members,
      },
    }
  }
  return null
})
</script>
