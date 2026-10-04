import type { RouteLocationRaw } from 'vue-router'
import { useAgentContextsStore } from '~/stores/agentContextsStore'
import { useAgentRunStore } from '~/stores/agentRunStore'
import { useAgentSelectionStore } from '~/stores/agentSelectionStore'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useAgentTeamDefinitionStore } from '~/stores/agentTeamDefinitionStore'
import { useAgentTeamRunStore } from '~/stores/agentTeamRunStore'
import { useTeamRunConfigStore } from '~/stores/teamRunConfigStore'
import { useLLMProviderConfigStore } from '~/stores/llmProviderConfig'
import { useChatDraftStore, type ChatDraft, type ChatDraftWorkspace } from '~/stores/chatDraftStore'
import { useRuntimeAvailabilityStore } from '~/stores/runtimeAvailabilityStore'
import { useWorkspaceStore } from '~/stores/workspace'
import { effectiveAutoExecuteTools } from '~/utils/agentRunRuntimeDraftPolicy'
import { useWorkspaceCenterViewStore } from '~/stores/workspaceCenterViewStore'
import {
  ensureRunHistoryWorkspaceByRootPath,
  resolveRunHistoryWorkspaceMetadataByRootPath,
} from '~/stores/runHistoryLoadActions'
import { runtimeKindToLabel } from '~/types/agent/AgentRunConfig'
import type { WorkspaceMetadata } from '~/types/workspace/WorkspaceMetadata'
import { workspaceMetadataFromWorkspaceInfo } from '~/utils/workspaceMetadata'
import { writeChatLastModel } from '~/utils/chat/chatLastModelPreference'
import { isTemporaryRunId } from '~/utils/chat/chatDefaults'
import { buildAgentRunChatRoute } from '~/services/workspace/workspaceNavigationService'
import { localizationRuntime } from '~/localization/runtime/localizationRuntime'
import { buildAgentDraftContextFileOwner } from '~/utils/contextFiles/contextFileOwner'
import { normalizeMemberAddress } from '~/utils/teamDefinitionMembers'
import { buildChatTeamLaunchConfig } from '~/services/chat/chatTeamLaunchConfig'
import type { TeamLaunchDraftId } from '~/types/agent/TeamLaunchDraft'
import type { AgentConfigOverride } from '~/types/agent/TeamRunConfig'
import { useAgentOrgDefinitionStore } from '~/stores/agentOrgDefinitionStore'
import { useAgentOrgRunStore } from '~/stores/agentOrgRunStore'
import { useRunHistoryStore } from '~/stores/runHistoryStore'
import { toAgentOrgPlacementLaunchConfiguration } from '~/utils/agentOrgLaunchPatch'

const t = (key: string, params?: Record<string, string | number>): string =>
  localizationRuntime.translate(key, params)

export type ChatLaunchNavigate = (route: RouteLocationRaw) => Promise<unknown>

/** A launch is blocked when the draft cannot start a run; the reason labels the disabled send button. */
export type ChatLaunchReadiness = Readonly<{ ready: true }> | Readonly<{ ready: false; reason: string }>

export const resolveChatLaunchReadiness = (draft: ChatDraft): ChatLaunchReadiness => {
  const config = draft.context.config
  const availability = useRuntimeAvailabilityStore()
  if (draft.target.kind === 'agent') {
    const definitions = useAgentDefinitionStore()
    if (definitions.agentDefinitions.length > 0
      && !definitions.getAgentDefinitionById(draft.target.agentDefinitionId)) {
      return { ready: false, reason: t('chat.launch.agentUnavailable') }
    }
  } else if (draft.target.kind === 'org') {
    const orgId = draft.target.orgDefinitionId
    if (!useAgentOrgDefinitionStore().byId(orgId)) {
      return { ready: false, reason: t('chat.launch.orgUnavailable') }
    }
  } else {
    const teamId = draft.target.teamDefinitionId
    if (!useAgentTeamDefinitionStore().agentTeamDefinitions.some((team) => team.id === teamId)) {
      return { ready: false, reason: t('chat.launch.teamUnavailable') }
    }
  }
  if (availability.hasFetched && !availability.isRuntimeEnabled(config.runtimeKind)) {
    return {
      ready: false,
      reason: t('chat.launch.runtimeUnavailable', { runtime: runtimeKindToLabel(config.runtimeKind) }),
    }
  }
  if (!config.llmModelIdentifier) {
    return { ready: false, reason: t('chat.launch.chooseModel') }
  }
  return { ready: true }
}

/** Resolve the draft's workspace choice into a workspace id + metadata, creating one for a new folder. */
export const resolveChatWorkspace = async (
  workspace: ChatDraftWorkspace,
): Promise<{ workspaceId: string; workspaceMetadata: WorkspaceMetadata }> => {
  const workspaceStore = useWorkspaceStore()
  if (workspace.kind === 'existing') {
    const info = workspaceStore.workspaces[workspace.workspaceId]
    const metadata = workspaceStore.workspaceMetadataById[workspace.workspaceId]
      ?? (info ? workspaceMetadataFromWorkspaceInfo(info) : null)
    if (metadata) {
      return { workspaceId: workspace.workspaceId, workspaceMetadata: metadata }
    }
    const rootPath = info?.absolutePath
    if (!rootPath) throw new Error(t('chat.launch.workspaceUnavailable'))
    return resolveChatWorkspace({ kind: 'folder', rootPath })
  }
  const workspaceId = await ensureRunHistoryWorkspaceByRootPath(workspace.rootPath)
  const workspaceMetadata = workspaceId
    ? await resolveRunHistoryWorkspaceMetadataByRootPath(workspace.rootPath)
    : null
  if (!workspaceId || !workspaceMetadata) throw new Error(t('chat.launch.workspaceUnavailable'))
  return { workspaceId, workspaceMetadata }
}

/**
 * Launch a New chat addressed to an agent through the existing first-send path.
 *
 * Order (D-04): mark starting → register + select the draft context → await the first send
 * (which presents its own failures) → route to `/chat?id=<selected id>` → reset the draft.
 * On success the selected id is the promoted run id; a first send that failed before
 * promotion lands on the still-registered `temp-*` context, where its error is shown.
 */
export const launchAgentChat = async (
  draft: ChatDraft,
  deps: { navigate: ChatLaunchNavigate },
): Promise<{ runId: string }> => {
  if (draft.target.kind !== 'agent') throw new Error('launchAgentChat requires an agent-addressed draft.')
  const readiness = resolveChatLaunchReadiness(draft)
  if (!readiness.ready) throw new Error(readiness.reason)

  const chatDraftStore = useChatDraftStore()
  const agentContextsStore = useAgentContextsStore()
  const selectionStore = useAgentSelectionStore()
  chatDraftStore.markStarting(draft)

  const context = draft.context
  try {
    const { workspaceId, workspaceMetadata } = await resolveChatWorkspace(draft.workspace)
    context.config.workspaceId = workspaceId
    context.config.workspaceMetadata = workspaceMetadata
    context.config.autoExecuteTools = effectiveAutoExecuteTools(context.config.runtimeKind, draft.autoExecuteTools)
    context.config.isLocked = false
    selectionStore.beginSelectionIntent()
    agentContextsStore.registerDraftRun(context)
  } catch (error) {
    // Nothing was registered: the New chat stays as it was, with its text and files.
    chatDraftStore.clearStarting(draft)
    throw error
  }

  await useAgentRunStore().sendUserInputAndSubscribe()

  const runId = selectionStore.selectedType === 'agent' && selectionStore.selectedRunId
    ? selectionStore.selectedRunId
    : context.state.runId
  if (!isTemporaryRunId(context.state.runId)) {
    writeChatLastModel({
      runtimeKind: context.config.runtimeKind,
      llmModelIdentifier: context.config.llmModelIdentifier,
    })
  }
  await deps.navigate(buildAgentRunChatRoute(runId))
  // The context now belongs to agentContextsStore; the New chat page gets a fresh draft.
  chatDraftStore.startNewChat()
  return { runId }
}

/**
 * Launch a New chat addressed to a team (REQ-010): a root-only launch draft with the chat's
 * runtime, model, thinking, workspace and approval for all members, focused on the coordinator.
 * The first message goes to the coordinator through the existing Team send, finalizing the
 * attachments uploaded under the chat draft. The user lands in the existing Team view.
 */
export const launchTeamChat = async (
  draft: ChatDraft,
  deps: { navigate: ChatLaunchNavigate },
): Promise<{ teamRunId: string | null }> => {
  if (draft.target.kind !== 'team') throw new Error('launchTeamChat requires a team-addressed draft.')
  const readiness = resolveChatLaunchReadiness(draft)
  if (!readiness.ready) throw new Error(readiness.reason)

  const chatDraftStore = useChatDraftStore()
  const selectionStore = useAgentSelectionStore()
  const teamRunConfigStore = useTeamRunConfigStore()
  // The Team view opens on the new team's conversation, never on settings left open for another run.
  useWorkspaceCenterViewStore().showChat()
  const teamDefinitionId = draft.target.teamDefinitionId
  const definition = useAgentTeamDefinitionStore().agentTeamDefinitions.find((team) => team.id === teamDefinitionId)
  if (!definition) throw new Error(t('chat.launch.teamUnavailable'))
  chatDraftStore.markStarting(draft)

  const context = draft.context
  let teamDraftId: TeamLaunchDraftId | null = null
  try {
    const { workspaceId, workspaceMetadata } = await resolveChatWorkspace(draft.workspace)
    const config = buildChatTeamLaunchConfig(definition, {
      runtimeKind: context.config.runtimeKind,
      llmModelIdentifier: context.config.llmModelIdentifier,
      llmConfig: context.config.llmConfig ?? null,
      workspaceId,
      workspaceMetadata,
      autoExecuteTools: effectiveAutoExecuteTools(context.config.runtimeKind, draft.autoExecuteTools),
    })
    // Team launch readiness checks the chosen runtime's catalog on the team config owner.
    const catalogs = useLLMProviderConfigStore()
    // run-settings-ui-unification (round 2): members may use other runtimes than the defaults.
    const runtimeKinds = new Set([context.config.runtimeKind, ...Object.values(draft.memberSettings)
      .map((settings) => settings.runtimeKind).filter((kind): kind is string => Boolean(kind))])
    for (const runtimeKind of runtimeKinds) {
      await catalogs.fetchProvidersWithModels(runtimeKind)
      teamRunConfigStore.setRuntimeModelCatalog(runtimeKind, catalogs.models(runtimeKind))
    }
    selectionStore.beginSelectionIntent()
    teamDraftId = teamRunConfigStore.createDraft(config, normalizeMemberAddress(definition.coordinatorMemberName))
    selectionStore.selectTeamDraftWithoutShellNavigation(teamDraftId)
    // run-settings-ui-unification (round 2): members customized in New chat launch with their own settings.
    for (const [agentAddress, settings] of Object.entries(draft.memberSettings)) {
      const { workspace: _workspace, ...override } = settings
      if (Object.keys(override).length) {
        teamRunConfigStore.applyConfigEdit({ kind: 'set_agent_override', agentAddress, override: override as AgentConfigOverride })
      }
    }
  } catch (error) {
    chatDraftStore.clearStarting(draft)
    throw error
  }

  try {
    await useAgentTeamRunStore().sendMessageToFocusedMember(
      context.requirement,
      [...context.contextFilePaths],
      { attachmentDraftOwner: buildAgentDraftContextFileOwner(context.state.runId) },
    )
  } catch (error) {
    // The launch failed before any message was recorded: stay on New chat with the draft intact
    // and leave no orphan Team launch draft behind.
    if (teamDraftId) {
      try {
        if (selectionStore.selectedDraftId === teamDraftId) selectionStore.clearSelectionWithoutShellNavigation()
        teamRunConfigStore.removeDraft(teamDraftId)
      } catch (cleanupError) {
        console.warn('Failed to discard the Team launch draft after a failed chat launch:', cleanupError)
      }
    }
    chatDraftStore.clearStarting(draft)
    throw error
  }

  const teamRunId = selectionStore.selectedType === 'team' ? selectionStore.selectedRunId : null
  if (teamRunId) {
    writeChatLastModel({
      runtimeKind: context.config.runtimeKind,
      llmModelIdentifier: context.config.llmModelIdentifier,
    })
  }
  await deps.navigate('/workspace')
  chatDraftStore.startNewChat()
  return { teamRunId }
}

/**
 * run-settings-ui-unification (round 2): launch a New chat addressed to an Agent Org with the
 * composer's settings as Org defaults and each customized agent or placed team as an override.
 * The UI reference launches through the same Org launch path as the Org Run form and lands in
 * the same Org view; delivering the first message to the Org is a production concern.
 */
export const launchOrgChat = async (
  draft: ChatDraft,
  deps: { navigate: ChatLaunchNavigate },
): Promise<{ orgRunId: string }> => {
  if (draft.target.kind !== 'org') throw new Error('launchOrgChat requires an org-addressed draft.')
  const readiness = resolveChatLaunchReadiness(draft)
  if (!readiness.ready) throw new Error(readiness.reason)
  const chatDraftStore = useChatDraftStore()
  const orgId = draft.target.orgDefinitionId
  const org = useAgentOrgDefinitionStore().byId(orgId)
  if (!org) throw new Error(t('chat.launch.orgUnavailable'))
  chatDraftStore.markStarting(draft)
  try {
    const { workspaceMetadata } = await resolveChatWorkspace(draft.workspace)
    const teamAddresses = new Set(org.members.filter((member) => member.refType === 'AGENT_TEAM').map((member) => `/${member.memberName}`))
    const teamOverrides: Array<{ address: string; configuration: Record<string, unknown> }> = []
    const agentOverrides: Array<{ address: string; configuration: Record<string, unknown> }> = []
    for (const [address, settings] of Object.entries(draft.memberSettings)) {
      const { workspace, ...patch } = settings
      const workspaceRootPath = workspace ? (await resolveChatWorkspace(workspace)).workspaceMetadata.workspaceRootPath : null
      const configuration = toAgentOrgPlacementLaunchConfiguration(patch, workspaceRootPath)
      if (!Object.keys(configuration).length) continue
      ;(teamAddresses.has(address) ? teamOverrides : agentOverrides).push({ address, configuration })
    }
    const context = draft.context
    const orgRunId = await useAgentOrgRunStore().launch({
      agentOrgDefinitionId: org.id,
      rootConfiguration: {
        runtimeKind: context.config.runtimeKind,
        llmModelIdentifier: context.config.llmModelIdentifier,
        llmConfig: context.config.llmConfig ?? null,
        autoExecuteTools: draft.autoExecuteTools,
        skillAccessMode: 'PRELOADED_ONLY',
        workspaceRootPath: workspaceMetadata.workspaceRootPath,
      },
      teamOverrides,
      agentOverrides,
    })
    void useRunHistoryStore().refreshTreeQuietly()
    writeChatLastModel({ runtimeKind: context.config.runtimeKind, llmModelIdentifier: context.config.llmModelIdentifier })
    await deps.navigate({ path: '/workspace', query: { rootSubjectKind: 'agent_org', definitionId: org.id, orgRunId, mode: 'active' } })
    chatDraftStore.startNewChat()
    return { orgRunId }
  } catch (error) {
    chatDraftStore.clearStarting(draft)
    throw error
  }
}
