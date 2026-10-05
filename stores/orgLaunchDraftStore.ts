import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { ChatDraftWorkspace, ChatMemberSettings } from '~/stores/chatDraftStore'
import { useAgentOrgDefinitionStore } from '~/stores/agentOrgDefinitionStore'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useAgentTeamDefinitionStore } from '~/stores/agentTeamDefinitionStore'
import { useAgentOrgRunStore } from '~/stores/agentOrgRunStore'
import { useRunHistoryStore } from '~/stores/runHistoryStore'
import { useRuntimeAvailabilityStore } from '~/stores/runtimeAvailabilityStore'
import { useWorkspaceStore } from '~/stores/workspace'
import { resolveChatWorkspace } from '~/services/chat/chatLaunchService'
import { loadAgentOrgDefinitionReferences } from '~/services/agentOrgDefinition/agentOrgDefinitionReferences'
import { readAgentOrgRunInspection } from '~/services/agentOrgExecution/agentOrgRunInspection'
import { buildEditableAgentOrgRunSeed } from '~/services/runConfigEditing/agentOrgRunLaunchSeed'
import { toAgentOrgPlacementLaunchConfiguration } from '~/utils/agentOrgLaunchPatch'
import { effectiveAutoExecuteTools } from '~/utils/agentRunRuntimeDraftPolicy'
import { normalizeDefaultLaunchConfig } from '~/types/launch/defaultLaunchConfig'
import { DEFAULT_AGENT_RUNTIME_KIND, runtimeKindToLabel } from '~/types/agent/AgentRunConfig'
import { readChatLastModel, writeChatLastModel } from '~/utils/chat/chatLastModelPreference'
import { TEMP_WORKSPACE_ID } from '~/utils/chat/chatDefaults'
import { useLLMProviderConfigStore } from '~/stores/llmProviderConfig'
import { localizationRuntime } from '~/localization/runtime/localizationRuntime'
import type { WorkspaceSelectionState } from '~/types/workspace/WorkspaceSelectionState'
import type { AgentConfigOverride, TeamScopeConfigOverride } from '~/types/agent/TeamRunConfig'
import { sameWorkspace } from '~/components/run-settings/runSettings'

const t = (key: string, params?: Record<string, string | number>): string => localizationRuntime.translate(key, params)

/** Design-only review states the synthetic fixtures do not reach (UI reference only). */
const DESIGN_STATE_KEY = 'autobyteus.design.runSettings.orgLaunchState'
const designState = (): string | null => (typeof window === 'undefined' ? null : window.localStorage.getItem(DESIGN_STATE_KEY))

/**
 * run-settings-ui-unification (SR-003): the Org launch page's draft. An Org is not a chat target
 * (it has no recipient), so it starts from this page: the four run settings, member overrides and
 * "Run". "+" on an Org run prefills it from that run.
 */
export type OrgLaunchDraft = {
  key: string
  orgDefinitionId: string
  sourceOrgRunId: string | null
  workspace: ChatDraftWorkspace | null
  runtimeKind: string
  llmModelIdentifier: string
  llmConfig: Record<string, unknown> | null
  autoExecuteTools: boolean
  memberSettings: Record<string, ChatMemberSettings>
  /** `preparing` while a "+" prefill is read; `launching` while the Org starts. */
  phase: 'preparing' | 'ready' | 'launching'
  error: string | null
}

export type OrgLaunchReadiness = Readonly<{ ready: true }> | Readonly<{ ready: false; reason: string }>

let draftSequence = 0

export const useOrgLaunchDraftStore = defineStore('orgLaunchDraft', () => {
  const draft = ref<OrgLaunchDraft | null>(null)

  const tempWorkspace = (): ChatDraftWorkspace => ({ kind: 'existing', workspaceId: useWorkspaceStore().tempWorkspaceId ?? TEMP_WORKSPACE_ID })
  const fromRootPath = (rootPath: string | null | undefined): ChatDraftWorkspace | null => {
    if (!rootPath) return null
    const known = useWorkspaceStore().findWorkspaceInfoByRootPath(rootPath)
    return known ? { kind: 'existing', workspaceId: known.workspaceId } : { kind: 'folder', rootPath }
  }
  const fromSelection = (selection: WorkspaceSelectionState | null | undefined): ChatDraftWorkspace | null => {
    if (!selection) return null
    if (selection.mode === 'existing') return selection.existingWorkspaceId ? { kind: 'existing', workspaceId: selection.existingWorkspaceId } : null
    return fromRootPath(selection.newWorkspacePath.trim())
  }

  /** Org default launch config, else the last model used in chat, else the default runtime's first model. */
  /** Settings carried from another start page (heading switcher), so a switch keeps what the user chose. */
  type CarriedSettings = Pick<OrgLaunchDraft, 'workspace' | 'runtimeKind' | 'llmModelIdentifier' | 'llmConfig' | 'autoExecuteTools'>
  const start = (orgDefinitionId: string, sourceOrgRunId: string | null = null, carried: CarriedSettings | null = null): OrgLaunchDraft => {
    const org = useAgentOrgDefinitionStore().byId(orgDefinitionId)
    const defaults = normalizeDefaultLaunchConfig(org?.defaultLaunchConfig)
    const last = readChatLastModel()
    const model = defaults?.runtimeKind && defaults.llmModelIdentifier
      ? { runtimeKind: defaults.runtimeKind, llmModelIdentifier: defaults.llmModelIdentifier, llmConfig: defaults.llmConfig ?? null }
      : last ? { runtimeKind: last.runtimeKind, llmModelIdentifier: last.llmModelIdentifier, llmConfig: null } : { runtimeKind: DEFAULT_AGENT_RUNTIME_KIND, llmModelIdentifier: '', llmConfig: null }
    draft.value = {
      key: `org-launch-${++draftSequence}`,
      orgDefinitionId,
      sourceOrgRunId,
      workspace: tempWorkspace(),
      ...model,
      autoExecuteTools: true,
      ...(carried && !sourceOrgRunId ? {
        workspace: carried.workspace ?? tempWorkspace(),
        autoExecuteTools: carried.autoExecuteTools,
        ...(carried.llmModelIdentifier ? { runtimeKind: carried.runtimeKind, llmModelIdentifier: carried.llmModelIdentifier, llmConfig: carried.llmConfig } : {}),
      } : {}),
      memberSettings: {},
      phase: sourceOrgRunId ? 'preparing' : 'ready',
      error: null,
    }
    const current = draft.value
    if (sourceOrgRunId) void prefillFromRun(current)
    else if (!current.llmModelIdentifier) void defaultRuntimeModel(current)
    return current
  }

  /** As New chat does last: the default runtime's first model. */
  const defaultRuntimeModel = async (target: OrgLaunchDraft) => {
    const catalogs = useLLMProviderConfigStore()
    try {
      await catalogs.fetchProvidersWithModels(DEFAULT_AGENT_RUNTIME_KIND)
      const first = catalogs.models(DEFAULT_AGENT_RUNTIME_KIND)[0]
      if (first && draft.value?.key === target.key && !target.llmModelIdentifier) {
        Object.assign(target, { runtimeKind: DEFAULT_AGENT_RUNTIME_KIND, llmModelIdentifier: first, llmConfig: null })
      }
    } catch (error) {
      console.warn('Failed to resolve the Org launch default model:', error)
    }
  }

  /** "+" on an Org run: the source run's settings and member overrides. */
  const prefillFromRun = async (target: OrgLaunchDraft) => {
    const org = useAgentOrgDefinitionStore().byId(target.orgDefinitionId)
    try {
      if (!org || !target.sourceOrgRunId) return
      const selected = { ...org, members: org.members.map((member) => ({ ...member })) }
      const [references, source] = await Promise.all([
        loadAgentOrgDefinitionReferences(selected.id, selected.members, {
          getCatalogAgentById: useAgentDefinitionStore().getAgentDefinitionById,
          getCatalogTeamById: useAgentTeamDefinitionStore().getCatalogAgentTeamDefinitionById,
        }),
        readAgentOrgRunInspection(target.sourceOrgRunId),
      ])
      if (draft.value?.key !== target.key || !source || references.unavailable.length) return
      const seed = buildEditableAgentOrgRunSeed(source.execution_tree, selected, references,
        Object.values(useWorkspaceStore().workspaceMetadataById))
      const rootWorkspace = fromSelection(seed.workspaceSelection) ?? tempWorkspace()
      const settings = (override: AgentConfigOverride | TeamScopeConfigOverride, workspace?: ChatDraftWorkspace | null): ChatMemberSettings => {
        const { workspace: _ignored, ...rest } = override as TeamScopeConfigOverride
        return { ...rest, ...(workspace ? { workspace } : {}) }
      }
      const teamWorkspace = (address: string) => {
        const workspace = fromSelection(seed.teamWorkspaceSelections[address])
        return workspace && !sameWorkspace(workspace, rootWorkspace) ? workspace : null
      }
      const members: Record<string, ChatMemberSettings> = {
        ...Object.fromEntries(Object.entries(seed.agentOverrides).map(([address, override]) => [address, settings(override)])),
        ...Object.fromEntries(Object.keys({ ...seed.teamOverrides, ...seed.teamWorkspaceSelections }).map((address) => [
          address, settings(seed.teamOverrides[address] ?? {}, teamWorkspace(address)),
        ])),
      }
      Object.assign(target, {
        workspace: rootWorkspace,
        ...(seed.llmModelIdentifier ? { runtimeKind: seed.runtimeKind, llmModelIdentifier: seed.llmModelIdentifier, llmConfig: seed.llmConfig } : {}),
        autoExecuteTools: seed.autoExecuteTools,
        memberSettings: Object.fromEntries(Object.entries(members).filter(([, value]) => Object.keys(value).length)),
      })
    } catch (error) {
      // The page still opens with the Org's defaults; nothing is lost by not copying.
      console.warn('Could not copy the Org run settings:', error)
    } finally {
      if (draft.value?.key === target.key && target.phase === 'preparing') target.phase = 'ready'
    }
  }

  const update = (patch: Partial<Pick<OrgLaunchDraft, 'workspace' | 'runtimeKind' | 'llmModelIdentifier' | 'llmConfig' | 'autoExecuteTools'>>) => {
    if (!draft.value) return
    Object.assign(draft.value, patch, { error: null })
  }
  /** Replace one member's own settings; null or an empty object returns it to the Org's settings. */
  const setMemberSettings = (address: string, settings: ChatMemberSettings | null) => {
    if (!draft.value) return
    const next = { ...draft.value.memberSettings }
    if (settings && Object.keys(settings).length) next[address] = settings
    else delete next[address]
    draft.value.memberSettings = next
  }
  const resetAllMemberSettings = () => { if (draft.value) draft.value.memberSettings = {} }

  const isOrgAvailable = (current: OrgLaunchDraft): boolean =>
    Boolean(useAgentOrgDefinitionStore().byId(current.orgDefinitionId)) && designState() !== 'unavailable'

  const readiness = (current: OrgLaunchDraft): OrgLaunchReadiness => {
    if (!isOrgAvailable(current)) return { ready: false, reason: t('runSettings.orgLaunch.unavailable') }
    const availability = useRuntimeAvailabilityStore()
    if (availability.hasFetched && !availability.isRuntimeEnabled(current.runtimeKind)) {
      return { ready: false, reason: t('chat.launch.runtimeUnavailable', { runtime: runtimeKindToLabel(current.runtimeKind) }) }
    }
    if (!current.llmModelIdentifier) return { ready: false, reason: t('chat.launch.chooseModel') }
    return { ready: true }
  }

  /** Run: the Org's settings as root configuration, each customized member as an override. */
  const launch = async (navigate: (route: RouteLocationRaw) => Promise<unknown>): Promise<void> => {
    const current = draft.value
    if (!current || current.phase !== 'ready' || !readiness(current).ready) return
    const org = useAgentOrgDefinitionStore().byId(current.orgDefinitionId)
    if (!org) return
    current.phase = 'launching'
    current.error = null
    try {
      if (designState() === 'launch_failed') {
        await new Promise((resolve) => setTimeout(resolve, 600))
        throw new Error('Design review state: launch failed.')
      }
      const { workspaceMetadata } = await resolveChatWorkspace(current.workspace ?? tempWorkspace())
      const teamAddresses = new Set(org.members.filter((member) => member.refType === 'AGENT_TEAM').map((member) => `/${member.memberName}`))
      const teamOverrides: Array<{ address: string; configuration: Record<string, unknown> }> = []
      const agentOverrides: Array<{ address: string; configuration: Record<string, unknown> }> = []
      for (const [address, settings] of Object.entries(current.memberSettings)) {
        const { workspace, ...patch } = settings
        const workspaceRootPath = workspace ? (await resolveChatWorkspace(workspace)).workspaceMetadata.workspaceRootPath : null
        const configuration = toAgentOrgPlacementLaunchConfiguration(patch, workspaceRootPath)
        if (!Object.keys(configuration).length) continue
        ;(teamAddresses.has(address) ? teamOverrides : agentOverrides).push({ address, configuration })
      }
      const orgRunId = await useAgentOrgRunStore().launch({
        agentOrgDefinitionId: org.id,
        rootConfiguration: {
          runtimeKind: current.runtimeKind,
          llmModelIdentifier: current.llmModelIdentifier,
          llmConfig: current.llmConfig ?? null,
          autoExecuteTools: effectiveAutoExecuteTools(current.runtimeKind, current.autoExecuteTools),
          workspaceRootPath: workspaceMetadata.workspaceRootPath,
        },
        teamOverrides,
        agentOverrides,
      })
      void useRunHistoryStore().refreshTreeQuietly()
      writeChatLastModel({ runtimeKind: current.runtimeKind, llmModelIdentifier: current.llmModelIdentifier })
      await navigate({ path: '/workspace', query: { rootSubjectKind: 'agent_org', definitionId: org.id, orgRunId, mode: 'active' } })
      if (draft.value === current) draft.value = null
    } catch (error) {
      console.warn('Failed to start the Agent Org:', error)
      if (draft.value === current) {
        current.phase = 'ready'
        current.error = t('runSettings.orgLaunch.failed')
      }
    }
  }

  return { draft, start, update, setMemberSettings, resetAllMemberSettings, readiness, isOrgAvailable, launch }
})
