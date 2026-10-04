import { useRouter } from 'vue-router'
import { useChatDraftStore, type ChatDraftWorkspace, type ChatMemberSettings } from '~/stores/chatDraftStore'
import { useWorkspaceStore } from '~/stores/workspace'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useAgentTeamDefinitionStore } from '~/stores/agentTeamDefinitionStore'
import { useAgentOrgDefinitionStore } from '~/stores/agentOrgDefinitionStore'
import { loadAgentOrgDefinitionReferences } from '~/services/agentOrgDefinition/agentOrgDefinitionReferences'
import { readAgentOrgRunInspection } from '~/services/agentOrgExecution/agentOrgRunInspection'
import { buildEditableAgentOrgRunSeed } from '~/services/runConfigEditing/agentOrgRunLaunchSeed'
import type { AgentConfigOverride, TeamRunConfig, TeamScopeConfigOverride, TeamWorkspaceSelection } from '~/types/agent/TeamRunConfig'
import type { WorkspaceSelectionState } from '~/types/workspace/WorkspaceSelectionState'
import { sameWorkspace } from '~/components/run-settings/runSettings'

/**
 * run-settings-ui-unification: every way of starting a run opens New chat addressed to its
 * agent, team or org. The composer's settings are the run's settings; members are customized
 * from the line under the composer. "+" on a running Team or Org (round 8) opens the same New
 * chat prefilled with that run's settings and member customizations.
 */
export function useStartRunInChat() {
  const router = useRouter()
  const chatDraftStore = useChatDraftStore()
  const workspaceStore = useWorkspaceStore()

  const open = async () => { await router.push('/chat') }

  const fromRootPath = (rootPath: string | null | undefined): ChatDraftWorkspace | null => {
    if (!rootPath) return null
    const known = workspaceStore.findWorkspaceInfoByRootPath(rootPath)
    return known ? { kind: 'existing', workspaceId: known.workspaceId } : { kind: 'folder', rootPath }
  }
  const fromTeamWorkspace = (workspace: TeamWorkspaceSelection | null | undefined): ChatDraftWorkspace | null => {
    if (!workspace) return null
    if (workspace.workspaceId && workspaceStore.workspaces[workspace.workspaceId]) return { kind: 'existing', workspaceId: workspace.workspaceId }
    return fromRootPath(workspace.workspaceMetadata?.workspaceRootPath)
  }
  const fromSelection = (selection: WorkspaceSelectionState | null | undefined): ChatDraftWorkspace | null => {
    if (!selection) return null
    if (selection.mode === 'existing') return selection.existingWorkspaceId ? { kind: 'existing', workspaceId: selection.existingWorkspaceId } : null
    return fromRootPath(selection.newWorkspacePath.trim())
  }
  const memberSettings = (override: AgentConfigOverride | TeamScopeConfigOverride, workspace?: ChatDraftWorkspace | null): ChatMemberSettings => {
    const { workspace: _ignored, ...rest } = override as TeamScopeConfigOverride
    return { ...rest, ...(workspace ? { workspace } : {}) }
  }

  /** Copy one run's settings into the draft (defaults, then each member's own settings). */
  const applyCopiedSettings = (copied: {
    runtimeKind: string
    llmModelIdentifier: string
    llmConfig: Record<string, unknown> | null
    autoExecuteTools: boolean
    workspace: ChatDraftWorkspace | null
    members: Record<string, ChatMemberSettings>
  }) => {
    if (copied.workspace) chatDraftStore.setWorkspace(copied.workspace)
    if (copied.llmModelIdentifier) {
      chatDraftStore.setModel({ runtimeKind: copied.runtimeKind, llmModelIdentifier: copied.llmModelIdentifier })
      chatDraftStore.setThinkingConfig(copied.llmConfig)
    }
    chatDraftStore.setAutoExecuteTools(copied.autoExecuteTools)
    for (const [address, settings] of Object.entries(copied.members)) {
      if (Object.keys(settings).length) chatDraftStore.setMemberSettings(address, settings)
    }
  }

  return {
    runAgent: async (agentDefinitionId: string) => {
      chatDraftStore.startNewChat({ agentDefinitionId })
      await open()
    },
    runTeam: async (teamDefinitionId: string) => {
      chatDraftStore.startNewChat()
      chatDraftStore.setTarget({ kind: 'team', teamDefinitionId })
      await open()
    },
    runOrg: async (orgDefinitionId: string) => {
      chatDraftStore.startNewChat()
      chatDraftStore.setTarget({ kind: 'org', orgDefinitionId })
      await open()
    },

    /** "+" on a running Team: New chat with that run's copied launch settings. */
    runTeamFromCopy: async (copy: TeamRunConfig) => {
      chatDraftStore.startNewChat()
      chatDraftStore.setTarget({ kind: 'team', teamDefinitionId: copy.teamDefinitionId })
      applyCopiedSettings({
        runtimeKind: copy.rootConfig.runtimeKind,
        llmModelIdentifier: copy.rootConfig.llmModelIdentifier,
        llmConfig: copy.rootConfig.llmConfig ?? null,
        autoExecuteTools: copy.rootConfig.autoExecuteTools,
        workspace: fromTeamWorkspace(copy.rootConfig.workspace),
        members: Object.fromEntries(Object.entries(copy.agentOverrides).map(([address, override]) => [address, memberSettings(override)])),
      })
      await open()
    },

    /** "+" on a running Org: New chat with the source Org run's launch settings. */
    runOrgFromRun: async (orgDefinitionId: string, sourceOrgRunId: string) => {
      const org = useAgentOrgDefinitionStore().byId(orgDefinitionId)
      chatDraftStore.startNewChat()
      chatDraftStore.setTarget({ kind: 'org', orgDefinitionId })
      if (org) {
        try {
          const selected = { ...org, members: org.members.map((member) => ({ ...member })) }
          const [references, source] = await Promise.all([
            loadAgentOrgDefinitionReferences(selected.id, selected.members, {
              getCatalogAgentById: useAgentDefinitionStore().getAgentDefinitionById,
              getCatalogTeamById: useAgentTeamDefinitionStore().getCatalogAgentTeamDefinitionById,
            }),
            readAgentOrgRunInspection(sourceOrgRunId),
          ])
          if (source && !references.unavailable.length) {
            const seed = buildEditableAgentOrgRunSeed(source.execution_tree, selected, references,
              Object.values(workspaceStore.workspaceMetadataById))
            const rootWorkspace = fromSelection(seed.workspaceSelection)
            // A placed team counts as customized only where its workspace differs from the Org's.
            const teamWorkspace = (address: string) => {
              const workspace = fromSelection(seed.teamWorkspaceSelections[address])
              return workspace && !sameWorkspace(workspace, rootWorkspace) ? workspace : null
            }
            applyCopiedSettings({
              runtimeKind: seed.runtimeKind,
              llmModelIdentifier: seed.llmModelIdentifier,
              llmConfig: seed.llmConfig,
              autoExecuteTools: seed.autoExecuteTools,
              workspace: rootWorkspace,
              members: {
                ...Object.fromEntries(Object.entries(seed.agentOverrides).map(([address, override]) => [address, memberSettings(override)])),
                ...Object.fromEntries(Object.keys({ ...seed.teamOverrides, ...seed.teamWorkspaceSelections }).map((address) => [
                  address,
                  memberSettings(seed.teamOverrides[address] ?? {}, teamWorkspace(address)),
                ])),
              },
            })
          }
        } catch (error) {
          // The Org still opens in New chat with its defaults; nothing is lost by not copying.
          console.warn('Could not copy the Org run settings into New chat:', error)
        }
      }
      await open()
    },
  }
}
