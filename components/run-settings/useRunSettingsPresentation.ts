import { useChatModelCatalog } from '~/composables/chat/useChatModelCatalog'
import { useLocalization } from '~/composables/useLocalization'
import { useWorkspaceStore } from '~/stores/workspace'
import { buildChatThinkingMenu } from '~/components/chat/chatThinkingMenu'
import { runtimeShortLabel } from '~/utils/chat/chatDefaults'
import { runtimeKindToLabel } from '~/types/agent/AgentRunConfig'
import { explicitChatModelConfig, type ChatDraftWorkspace } from '~/stores/chatDraftStore'
import { isApprovalLockedForRuntime, type RunModelChoice, type RunSettingField, type RunSettingFlags, type RunSettingsValues } from './runSettings'

/** Labels for read-only values and collapsed member summaries, in the Chat controls' words. */
export function useRunSettingsPresentation() {
  const catalog = useChatModelCatalog()
  const workspaceStore = useWorkspaceStore()
  const { t } = useLocalization()

  const folderName = (rootPath: string) => rootPath.replace(/[/\\]+$/, '').split(/[/\\]/).pop() || rootPath

  const isTempWorkspace = (workspace: ChatDraftWorkspace | null) => workspace?.kind === 'existing'
    && (workspace.workspaceId === workspaceStore.tempWorkspace?.workspaceId
      || Boolean(workspaceStore.workspaces[workspace.workspaceId]?.isTemp))

  const workspaceName = (workspace: ChatDraftWorkspace | null): string => {
    if (!workspace) return ''
    if (workspace.kind === 'folder') return folderName(workspace.rootPath)
    if (isTempWorkspace(workspace)) return t('chat.workspace.temp')
    const info = workspaceStore.workspaces[workspace.workspaceId]
    return info?.name || folderName(info?.absolutePath || workspace.workspaceId)
  }

  const workspacePath = (workspace: ChatDraftWorkspace | null): string => {
    if (!workspace) return ''
    if (workspace.kind === 'folder') return workspace.rootPath
    const info = workspaceStore.workspaces[workspace.workspaceId]
    return info?.absolutePath || info?.workspaceConfig?.root_path || info?.workspaceConfig?.rootPath || ''
  }

  const ensureRuntime = (runtimeKind: string | null | undefined) => {
    if (runtimeKind) catalog.ensureCatalog(runtimeKind)
  }

  const modelLabel = (values: Pick<RunSettingsValues, 'runtimeKind' | 'llmModelIdentifier'>): string =>
    values.llmModelIdentifier ? catalog.modelLabel(values.runtimeKind, values.llmModelIdentifier) : ''

  const thinkingSchema = (values: Pick<RunSettingsValues, 'runtimeKind' | 'llmModelIdentifier'>) =>
    values.llmModelIdentifier ? catalog.schemaFor(values.runtimeKind, values.llmModelIdentifier) : null

  const thinkingMenu = (values: RunSettingsValues) =>
    buildChatThinkingMenu(thinkingSchema(values), values.llmConfig, (key) => t(key))

  const approvalLabel = (autoExecuteTools: boolean) =>
    autoExecuteTools ? t('chat.approval.autoApprove') : t('chat.approval.askFirst')

  /** Choosing a model applies that model's default thinking, as in Chat. */
  const defaultConfigFor = (choice: RunModelChoice): Record<string, unknown> | null =>
    explicitChatModelConfig(catalog.schemaFor(choice.runtimeKind, choice.llmModelIdentifier), null)

  return {
    catalog,
    defaultConfigFor,
    ensureRuntime,
    workspaceName,
    workspacePath,
    modelLabel,
    runtimeLabel: (runtimeKind: string) => runtimeKindToLabel(runtimeKind),
    runtimeShortLabel: (runtimeKind: string) => runtimeShortLabel(runtimeKind),
    thinkingSchema,
    thinkingMenu,
    approvalLabel,
  }
}
