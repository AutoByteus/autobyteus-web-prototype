<template>
  <div class="flex h-full flex-col bg-white" data-test="agent-org-run-config">
    <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <div v-if="org" class="mx-auto max-w-2xl space-y-4">
        <!-- run-settings-ui-unification: org defaults + compact placements list in the Chat vocabulary. -->
        <OrgLaunchSettings
          v-if="initializationReady && formModel"
          :key="configStore.draftEpoch"
          :org-name="org.name"
          :root-values="rootRunSettings"
          :model="formModel"
          @root-workspace="handleWorkspaceSelection"
          @root-model="selectRootModel"
          @root-thinking="configStore.setRootLlmConfig"
          @root-approval="configStore.setRootAutoExecuteTools"
          @agent-override="configStore.setAgentOverride"
          @team-override="(address, value) => value ? configStore.setTeamOverride(address, value) : configStore.resetTeamOverride(address)"
          @team-workspace="handleTeamWorkspaceSelection"
        />
        <p v-if="initializationError" role="alert" class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" data-test="org-seed-error">
          {{ initializationError }}
          <button type="button" class="ml-2 underline" data-test="org-seed-retry" @click="retryInitialization++">{{ t('workspace.agentOrg.runConfig.retryInitialization') }}</button>
        </p>
        <p
          v-if="referenceDiagnostic"
          :role="referenceDiagnostic.unavailable ? 'alert' : 'status'"
          class="rounded-md border p-3 text-sm"
          :class="referenceDiagnostic.unavailable ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-100 bg-blue-50 text-blue-700'"
          data-test="org-config-reference-diagnostic"
        >
          {{ referenceDiagnostic.message }}
        </p>
        <p v-if="projectionError" role="alert" class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" data-test="org-config-projection-error">
          {{ projectionError }}
        </p>
        <p v-if="launchError" role="alert" class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {{ launchError }}
        </p>
        <p
          v-if="modelSchemaBlockingDiagnostic && !modelSchemaBlockingDiagnostic.missing"
          id="org-model-schema-status"
          :role="modelSchemaBlockingDiagnostic.neutral ? 'status' : 'alert'"
          class="rounded-md border p-3 text-sm"
          :class="modelSchemaBlockingDiagnostic.neutral
            ? 'border-blue-100 bg-blue-50 text-blue-700'
            : 'border-red-200 bg-red-50 text-red-700'"
          data-test="org-config-schema-diagnostic"
        >
          {{ modelSchemaBlockingDiagnostic.message }}
        </p>
      </div>
      <div v-else class="flex h-full flex-col items-center justify-center gap-3 text-gray-500" :role="catalogError || catalogLoaded ? 'alert' : 'status'">
        {{ catalogError || (catalogLoaded ? t('workspace.agentOrg.inspectionUnavailable') : t('workspace.agentOrg.runConfig.loading')) }}
        <button v-if="catalogError || catalogLoaded" type="button" class="underline" @click="loadCatalogs">{{ t('workspace.agentOrg.runConfig.retryInitialization') }}</button>
      </div>
    </div>
    <div class="border-t border-gray-200 bg-gray-50 px-4 py-3">
      <button
        type="button"
        data-test="run-agent-org"
        class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!canRun || orgRunStore.launching"
        :aria-describedby="modelSchemaBlockingDiagnostic ? 'org-model-schema-status' : undefined"
        @click="runOrg"
      >
        {{ orgRunStore.launching ? t('workspace.agentOrg.runConfig.starting') : t('workspace.agentOrg.runConfig.run') }}
      </button>
      <p v-if="initializationReady && !workspaceReady" class="mt-2 text-xs text-amber-700">{{ t('runSettings.validation.workspaceRequired') }}</p>
      <p v-else-if="modelSchemaBlockingDiagnostic?.missing" class="mt-2 text-xs text-amber-700" data-test="org-run-model-required">{{ modelSchemaBlockingDiagnostic.message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import OrgLaunchSettings from '~/components/run-settings/OrgLaunchSettings.vue'
import { fromSelectionState, type RunModelChoice, type RunSettingsValues } from '~/components/run-settings/runSettings'
import { useRunSettingsPresentation } from '~/components/run-settings/useRunSettingsPresentation'
import { useLocalization } from '~/composables/useLocalization'
import { useRightSideTabs } from '~/composables/useRightSideTabs'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useAgentOrgDefinitionStore } from '~/stores/agentOrgDefinitionStore'
import { useAgentOrgRunConfigStore } from '~/stores/agentOrgRunConfigStore'
import { useAgentOrgRunStore } from '~/stores/agentOrgRunStore'
import { useAgentTeamDefinitionStore } from '~/stores/agentTeamDefinitionStore'
import { useWorkspaceStore } from '~/stores/workspace'
import { useRunHistoryStore } from '~/stores/runHistoryStore'
import type { AgentTeamAddress } from '~/types/agent/AgentTeamAddress'
import type { ResolvedTeamRunLaunchConfig, TeamScopeConfigOverride } from '~/types/agent/TeamRunConfig'
import type { RuntimeModelConfigSchemaState } from '~/types/agent/RuntimeModelConfigSchemaState'
import type { WorkspaceMetadata } from '~/types/workspace/WorkspaceMetadata'
import type { WorkspaceSelectionState } from '~/types/workspace/WorkspaceSelectionState'
import { projectEditableAgentOrgRunFormModel } from '~/utils/editableAgentOrgRunFormModel'
import { hasMeaningfulLaunchOverride } from '~/utils/teamRunConfigUtils'
import { loadAgentOrgDefinitionReferences, type AgentOrgDefinitionReferences } from '~/services/agentOrgDefinition/agentOrgDefinitionReferences'
import { readAgentOrgRunInspection } from '~/services/agentOrgExecution/agentOrgRunInspection'
import { buildEditableAgentOrgRunSeed } from '~/services/runConfigEditing/agentOrgRunLaunchSeed'
import { toAgentOrgPlacementLaunchConfiguration } from '~/utils/agentOrgLaunchPatch'
import { effectiveAutoExecuteTools, isAutoApproveLockedForRuntime } from '~/utils/agentRunRuntimeDraftPolicy'

const route = useRoute()
const router = useRouter()
const orgStore = useAgentOrgDefinitionStore()
const agentStore = useAgentDefinitionStore()
const teamStore = useAgentTeamDefinitionStore()
const orgRunStore = useAgentOrgRunStore()
const runHistoryStore = useRunHistoryStore()
const configStore = useAgentOrgRunConfigStore()
const workspaceStore = useWorkspaceStore()
const { setActiveTab } = useRightSideTabs()
const { t } = useLocalization()
const {
  runtimeKind, llmModelIdentifier, llmConfig, autoExecuteTools, workspaceSelection,
  teamOverrides, agentOverrides, projectionError, launchError,
  firstModelSchemaBlock, allModelSchemaScopesReady,
} = storeToRefs(configStore)

const autoApproveLocked = computed(() => isAutoApproveLockedForRuntime(runtimeKind.value))
const effectiveRootAutoExecuteTools = computed(() => effectiveAutoExecuteTools(runtimeKind.value, autoExecuteTools.value))

const definitionId = computed(() => String(route.query.definitionId || ''))
const org = computed(() => orgStore.byId(definitionId.value))
const workspaceLoading = ref(false)
const workspaceError = ref<string | null>(null)
const editingDirectAgent = ref<AgentTeamAddress | null>(null)
const sourceOrgRunId = computed(() => String(route.query.sourceOrgRunId || ''))
const intentKey = computed(() => JSON.stringify([definitionId.value, sourceOrgRunId.value]))
const initializedIntent = ref<string | null>(null)
const initializationReady = computed(() => initializedIntent.value === intentKey.value)
const initializationError = ref<string | null>(null)
const retryInitialization = ref(0)
let initializedSource: Awaited<ReturnType<typeof readAgentOrgRunInspection>> | null = null
watch(intentKey, () => { initializedIntent.value = null; initializedSource = null }, { flush: 'sync' })

watch([org, intentKey], ([value, intent]) => {
  if (!value || sourceOrgRunId.value || initializedIntent.value === intent) return
  configStore.begin({ definitionId: value.id, ...value.defaultLaunchConfig })
  initializedIntent.value = intent
  editingDirectAgent.value = null
}, { immediate: true })

// A public catalog is not an inventory of the selected Org's owned definitions.
const referenceKey = computed(() => org.value ? JSON.stringify([
  org.value.id, org.value.revision,
  org.value.members.map(({ memberName, ref, refType, refScope }) => [memberName, ref, refType, refScope]),
]) : null)
const references = ref<{
  key: string | null
  status: 'loading' | 'ready' | 'unavailable'
  snapshot: AgentOrgDefinitionReferences | null
}>({ key: null, status: 'loading', snapshot: null })
const referencesReady = computed(() => Boolean(referenceKey.value
  && references.value.key === referenceKey.value && references.value.status === 'ready'))
const referenceDiagnostic = computed(() => {
  if (!org.value || initializationError.value || (referencesReady.value && initializationReady.value)) return null
  const unavailable = references.value.key === referenceKey.value && references.value.status === 'unavailable'
  return {
    unavailable,
    message: unavailable
      ? t('workspace.agentOrg.runConfig.referencesUnavailable', {
          references: references.value.snapshot?.unavailable.join(', ') || org.value.name,
        })
      : t('workspace.agentOrg.runConfig.referencesLoading'),
  }
})
watch([referenceKey, intentKey, retryInitialization], async ([key, intent], _previous, onCleanup) => {
  let current = true
  onCleanup(() => { current = false })
  initializationError.value = null
  references.value = { key, status: 'loading', snapshot: null }
  if (!key || !org.value) return
  const selected = { ...org.value, members: org.value.members.map(member => ({ ...member })) }
  const sourceId = sourceOrgRunId.value
  try {
    const snapshotRequest = loadAgentOrgDefinitionReferences(selected.id, selected.members, {
      getCatalogAgentById: agentStore.getAgentDefinitionById,
      getCatalogTeamById: teamStore.getCatalogAgentTeamDefinitionById,
    })
    const [snapshot, source] = await Promise.all([
      snapshotRequest,
      sourceId && initializedIntent.value !== intent ? readAgentOrgRunInspection(sourceId) : null,
    ])
    if (!current || referenceKey.value !== key || intentKey.value !== intent) return
    if (snapshot.unavailable.length && !sourceId) {
      references.value = { key, status: 'unavailable', snapshot }
      return
    }
    if (snapshot.unavailable.length) throw new Error(t('workspace.agentOrg.runConfig.referencesUnavailable', { references: snapshot.unavailable.join(', ') }))
    const sourceSnapshot = source ?? initializedSource
    if (sourceId && !sourceSnapshot) throw new Error(t('workspace.agentOrg.inspectionUnavailable'))
    const seed = sourceId && sourceSnapshot ? buildEditableAgentOrgRunSeed(sourceSnapshot.execution_tree, selected, snapshot,
      Object.values(workspaceStore.workspaceMetadataById)) : null
    if (initializedIntent.value !== intent) {
      if (seed) configStore.beginFromSeed(seed)
      else configStore.begin({ definitionId: selected.id, ...selected.defaultLaunchConfig })
      initializedSource = source
      initializedIntent.value = intent
      editingDirectAgent.value = null
    }
    references.value = { key, status: snapshot.unavailable.length ? 'unavailable' : 'ready', snapshot }
  } catch (cause) {
    if (current && referenceKey.value === key && intentKey.value === intent) {
      if (sourceId) initializationError.value = cause instanceof Error ? cause.message : String(cause)
      references.value = { key, status: 'unavailable', snapshot: null }
    }
  }
}, { immediate: true })

const workspaceMetadata = (workspaceId: string | null): WorkspaceMetadata | null => {
  if (!workspaceId) return null
  const workspace = workspaceStore.workspaces[workspaceId]
  return workspaceStore.workspaceMetadataById[workspaceId]
    ?? (workspace ? workspaceStore.registerWorkspaceInfoMetadata(workspace) : null)
    ?? null
}
const rootWorkspacePath = computed(() => {
  if (workspaceSelection.value.mode === 'new') return workspaceSelection.value.newWorkspacePath.trim() || null
  const metadata = workspaceMetadata(workspaceSelection.value.existingWorkspaceId)
  return metadata?.workspaceRootPath?.trim() || null
})
const rootConfig = computed<Readonly<ResolvedTeamRunLaunchConfig>>(() => Object.freeze({
  runtimeKind: runtimeKind.value,
  workspaceId: workspaceSelection.value.mode === 'existing' ? workspaceSelection.value.existingWorkspaceId : null,
  workspaceMetadata: workspaceSelection.value.mode === 'existing' ? workspaceMetadata(workspaceSelection.value.existingWorkspaceId) : null,
  workspaceRootPath: rootWorkspacePath.value,
  llmModelIdentifier: llmModelIdentifier.value,
  llmConfig: llmConfig.value,
  autoExecuteTools: effectiveRootAutoExecuteTools.value,
}))
const projection = computed(() => {
  if (!org.value || !referencesReady.value || !initializationReady.value) return null
  return projectEditableAgentOrgRunFormModel({
    orgDefinition: org.value,
    rootConfig: rootConfig.value,
    teamOverrides: teamOverrides.value,
    agentOverrides: agentOverrides.value,
    getTeamDefinitionById: (id) => references.value.snapshot?.teams[id] ?? null,
    getAgentDisplayNameById: (id) => references.value.snapshot?.agents[id]?.name ?? null,
    workspaceSelectionFor: (address, effective) => configStore.teamWorkspaceSelectionFor(address) ?? {
      mode: effective.workspaceId ? 'existing' : 'new',
      existingWorkspaceId: effective.workspaceId,
      newWorkspacePath: effective.workspaceRootPath ?? '',
    },
    workspaceOperationFor: configStore.teamWorkspaceOperationFor,
    runtimeCatalogStateFor: (address) => configStore.modelSchemaStateFor(address).status === 'loading'
      ? { status: 'loading', error: null }
      : { status: 'ready', error: null },
  })
})
watch(projection, (result) => {
  configStore.setProjectionError(result?.status === 'blocked' ? result.diagnostic.message : null)
}, { immediate: true })
const formModel = computed(() => projection.value?.status === 'ready' ? projection.value.model : null)
watch(formModel, (model) => {
  if (!model) return
  configStore.reconcileModelSchemaScopes([
    '/',
    ...model.directAgents.map((agent) => agent.address),
    ...model.mountedTeams.flatMap((team) => [team.address, ...team.children.map((agent) => agent.address)]),
  ])
}, { immediate: true })
// run-settings-ui-unification (REQ-003): name the agent or team, never the raw address.
const scopeNames = computed<Record<string, string>>(() => {
  const names: Record<string, string> = { '/': org.value?.name ?? '' }
  const model = formModel.value
  if (!model) return names
  model.directAgents.forEach((agent) => { names[agent.address] = agent.displayName })
  model.mountedTeams.forEach((team) => {
    names[team.address] = team.scope.displayName
    team.children.forEach((child) => { names[child.address] = child.kind === 'agent' ? child.displayName : child.scope.displayName })
  })
  return names
})
const modelSchemaBlockingDiagnostic = computed(() => {
  if (!initializationReady.value) return null
  const blocked = firstModelSchemaBlock.value
  if (!blocked) return null
  const missing = blocked.state.reason === 'model_required'
  const name = scopeNames.value[blocked.address] || org.value?.name || ''
  const message = missing
    ? (blocked.address === '/' ? t('runSettings.validation.modelRequired') : t('runSettings.validation.memberModelRequired', { name }))
    : blocked.state.status === 'loading'
      ? t('runSettings.validation.modelsLoading')
      : t('workspace.agentOrg.runConfig.schemaBlocked', {
          address: name,
          error: blocked.state.message || t('workspace.agentOrg.runConfig.schemaUnavailable'),
        })
  return Object.freeze({ status: blocked.state.status, message, missing, neutral: missing || blocked.state.status === 'loading' })
})
// The run-settings card has no per-field schema editor: a scope is ready once it has a model.
watch([formModel, llmModelIdentifier], ([model, rootModel]) => {
  if (!model) return
  const ready = { status: 'ready', message: null } as const
  const missing = { status: 'invalid', message: null, reason: 'model_required' } as const
  configStore.setModelSchemaState('/', rootModel?.trim() ? ready : missing)
  const visit = (address: string, identifier: string | null | undefined) =>
    configStore.setModelSchemaState(address, identifier?.trim() ? ready : missing)
  model.directAgents.forEach((agent) => visit(agent.address, agent.effectiveConfig.llmModelIdentifier))
  model.mountedTeams.forEach((team) => {
    visit(team.address, team.scope.effectiveConfig.llmModelIdentifier)
    team.children.forEach((child) => visit(child.address, child.kind === 'agent' ? child.effectiveConfig.llmModelIdentifier : child.scope.effectiveConfig.llmModelIdentifier))
  })
}, { immediate: true, flush: 'post' })
const rootRunSettings = computed<RunSettingsValues>(() => ({
  workspace: fromSelectionState(workspaceSelection.value),
  runtimeKind: runtimeKind.value,
  llmModelIdentifier: llmModelIdentifier.value,
  llmConfig: llmConfig.value,
  autoExecuteTools: effectiveRootAutoExecuteTools.value,
}))
const runSettingsPresentation = useRunSettingsPresentation()
const selectRootModel = (choice: RunModelChoice) => {
  if (choice.runtimeKind !== runtimeKind.value) configStore.setRootRuntimeKind(choice.runtimeKind)
  configStore.setRootLlmModelIdentifier(choice.llmModelIdentifier)
  configStore.setRootLlmConfig(runSettingsPresentation.defaultConfigFor(choice))
}
const workspaceReady = computed(() => Boolean(rootWorkspacePath.value))
const teamWorkspacesReady = computed(() => Object.entries(configStore.teamWorkspaceSelections).every(
  ([address, selection]) => {
    if (configStore.teamWorkspaceOperationFor(address).status === 'error') return false
    return selection.mode === 'existing' ? Boolean(selection.existingWorkspaceId) : Boolean(selection.newWorkspacePath.trim())
  },
))
const canRun = computed(() => Boolean(
  org.value && initializationReady.value && referencesReady.value && formModel.value && runtimeKind.value && llmModelIdentifier.value.trim() && workspaceReady.value
    && teamWorkspacesReady.value && allModelSchemaScopesReady.value,
))

const handleWorkspaceSelection = (selection: WorkspaceSelectionState) => {
  configStore.setWorkspaceSelection(selection, 'explicit')
  workspaceError.value = null
  if (selection.mode === 'existing' && selection.existingWorkspaceId) setActiveTab('files')
}
const toggleDirectAgent = (address: AgentTeamAddress) => {
  editingDirectAgent.value = editingDirectAgent.value === address ? null : address
}
const handleModelSchemaState = (address: string, state: RuntimeModelConfigSchemaState) => {
  configStore.setModelSchemaState(address as AgentTeamAddress, state)
}
const withoutWorkspace = (override: TeamScopeConfigOverride | undefined): TeamScopeConfigOverride | null => {
  const next = { ...(override ?? {}) }
  delete next.workspace
  return hasMeaningfulLaunchOverride(next) ? next : null
}
const handleTeamWorkspaceSelection = (address: AgentTeamAddress, selection: WorkspaceSelectionState) => {
  configStore.setTeamWorkspaceSelection(address, selection)
  const current = teamOverrides.value[address]
  if (selection.mode === 'existing' && selection.existingWorkspaceId) {
    const metadata = workspaceMetadata(selection.existingWorkspaceId)
    if (!metadata) {
      configStore.setTeamWorkspaceOperation(address, {
        status: 'error',
        error: t('workspace.agentOrg.runConfig.workspaceUnavailable', { workspaceId: selection.existingWorkspaceId }),
      })
      return
    }
    const matchesRoot = rootConfig.value.workspaceId === selection.existingWorkspaceId
      && rootConfig.value.workspaceRootPath === metadata.workspaceRootPath
    configStore.setTeamOverride(address, matchesRoot ? withoutWorkspace(current) : {
      ...(current ?? {}), workspace: { workspaceId: selection.existingWorkspaceId, workspaceMetadata: metadata },
    })
    setActiveTab('files')
    return
  }
  const path = selection.newWorkspacePath.trim()
  configStore.setTeamOverride(address, path && path !== rootConfig.value.workspaceRootPath ? {
    ...(withoutWorkspace(current) ?? {}),
    workspace: { workspaceId: null, workspaceMetadata: null },
  } : withoutWorkspace(current))
}
const resolveRootWorkspacePath = async (): Promise<string> => {
  if (workspaceSelection.value.mode === 'new') {
    const path = workspaceSelection.value.newWorkspacePath.trim()
    if (!path) throw new Error(t('workspace.agentOrg.runConfig.workspacePathRequired'))
    workspaceLoading.value = true
    try {
      await workspaceStore.createWorkspace({ root_path: path })
      setActiveTab('files')
      return path
    } finally {
      workspaceLoading.value = false
    }
  }
  const path = rootWorkspacePath.value
  if (!path) throw new Error(t('workspace.agentOrg.runConfig.workspacePathUnavailable'))
  return path
}
const prepareTeamWorkspacePaths = async (): Promise<Record<AgentTeamAddress, string>> => {
  const paths: Record<AgentTeamAddress, string> = {}
  const created = new Map<string, Promise<string>>()
  for (const [address, override] of Object.entries(teamOverrides.value)) {
    const selection = configStore.teamWorkspaceSelectionFor(address)
    const path = selection?.mode === 'new'
      ? selection.newWorkspacePath.trim()
      : override.workspace?.workspaceMetadata?.workspaceRootPath?.trim() || ''
    if (!path) continue
    if (selection?.mode === 'new') {
      configStore.setTeamWorkspaceOperation(address, { status: 'loading', error: null })
      try {
        const request = created.get(path) ?? workspaceStore.createWorkspace({ root_path: path }).then(() => path)
        created.set(path, request)
        paths[address] = await request
        configStore.setTeamWorkspaceOperation(address, { status: 'idle', error: null })
      } catch (cause) {
        const detail = cause instanceof Error ? cause.message : String(cause)
        configStore.setTeamWorkspaceOperation(address, { status: 'error', error: detail })
        throw cause
      }
    } else paths[address] = path
  }
  return paths
}
const runOrg = async () => {
  if (!org.value || !formModel.value || !canRun.value || orgRunStore.launching) return
  configStore.setLaunchError(null)
  try {
    const workspaceRootPath = await resolveRootWorkspacePath()
    const teamWorkspacePaths = await prepareTeamWorkspacePaths()
    const serializedTeams = Object.entries(teamOverrides.value).map(([address, override]) => ({
      address,
      configuration: toAgentOrgPlacementLaunchConfiguration(override, teamWorkspacePaths[address]),
    })).filter((item) => Object.keys(item.configuration).length)
    const serializedAgents = Object.entries(agentOverrides.value).map(([address, override]) => ({
      address,
      configuration: toAgentOrgPlacementLaunchConfiguration(override),
    })).filter((item) => Object.keys(item.configuration).length)
    const orgRunId = await orgRunStore.launch({
      agentOrgDefinitionId: org.value.id,
      rootConfiguration: {
        runtimeKind: runtimeKind.value,
        llmModelIdentifier: llmModelIdentifier.value,
        llmConfig: llmConfig.value,
        autoExecuteTools: effectiveRootAutoExecuteTools.value,
        workspaceRootPath,
      },
      teamOverrides: serializedTeams,
      agentOverrides: serializedAgents,
    })
    void runHistoryStore.refreshAgentOrgHistoryItem(orgRunId)
    await router.replace({
      path: '/workspace',
      query: { rootSubjectKind: 'agent_org', definitionId: org.value.id, orgRunId, mode: 'active' },
    })
  } catch (cause) {
    configStore.setLaunchError(cause instanceof Error ? cause.message : String(cause))
  }
}

const applyAvailableRootDefault = (): void => {
  if (initializationReady.value && !sourceOrgRunId.value) configStore.selectDefaultRootWorkspace(workspaceStore.tempWorkspaceId)
}

watch([() => workspaceStore.tempWorkspaceId, initializationReady], applyAvailableRootDefault)

const catalogLoaded = ref(false)
const catalogError = ref<string | null>(null)
const loadCatalogs = async () => {
  catalogLoaded.value = false
  catalogError.value = null
  try {
    await Promise.all([
      orgStore.fetchAll(),
      agentStore.fetchAllAgentDefinitions(),
      teamStore.fetchAllAgentTeamDefinitions(),
      workspaceStore.fetchAllWorkspaces(),
    ])
    applyAvailableRootDefault()
    catalogLoaded.value = true
  } catch (cause) { catalogError.value = cause instanceof Error ? cause.message : String(cause) }
}
onMounted(loadCatalogs)
</script>
