/**
 * run-settings-ui-unification — shared vocabulary for the run settings card and member list.
 *
 * Every run surface (new Agent / Team / Org launch, saved-run settings, member customization)
 * shows the same four settings with the Chat composer's controls: Workspace, Model (with its
 * runtime), Thinking and Tool approval.
 */
import type { ChatDraftWorkspace } from '~/stores/chatDraftStore'

export type RunSettingField = 'workspace' | 'model' | 'thinking' | 'approval'
export const ALL_RUN_SETTING_FIELDS: readonly RunSettingField[] = ['workspace', 'model', 'thinking', 'approval']
/** DEC-002 (proposed): members customize model (+runtime), thinking and tool approval. */
export const MEMBER_RUN_SETTING_FIELDS: readonly RunSettingField[] = ['model', 'thinking', 'approval']
/** Teams placed in an Org additionally choose their own workspace. */
export const TEAM_PLACEMENT_RUN_SETTING_FIELDS: readonly RunSettingField[] = ALL_RUN_SETTING_FIELDS

export interface RunSettingsValues {
  workspace: ChatDraftWorkspace | null
  runtimeKind: string
  llmModelIdentifier: string
  llmConfig: Record<string, unknown> | null
  autoExecuteTools: boolean
}

export type RunSettingFlags = Partial<Record<RunSettingField, boolean>>

export interface RunModelChoice {
  runtimeKind: string
  llmModelIdentifier: string
}

/** One configurable member or placed team in the member list. */
export interface RunMemberNode {
  key: string
  kind: 'agent' | 'team'
  name: string
  isCoordinator?: boolean
  values: RunSettingsValues
  /** Fields this node sets itself instead of inheriting. */
  customized: RunSettingFlags
  fields: readonly RunSettingField[]
  children?: readonly RunMemberNode[]
  /** Address or path, shown only as a tooltip. */
  detail?: string
  /** SR-005: the parent's model config, so thinking and each other model setting reset on their own. */
  inheritedLlmConfig?: Record<string, unknown> | null
}

/** Runtimes that always auto-approve tools (source `origin/personal@26b555126`). */
export const isApprovalLockedForRuntime = (runtimeKind: string | null | undefined): boolean =>
  runtimeKind === 'antigravity_cli'

export const hasCustomization = (flags: RunSettingFlags): boolean =>
  Object.values(flags).some(Boolean)

export const countCustomized = (nodes: readonly RunMemberNode[]): number =>
  nodes.reduce((total, node) => total
    + (hasCustomization(node.customized) ? 1 : 0)
    + countCustomized(node.children ?? []), 0)

export const toChatWorkspace = (
  workspaceId: string | null | undefined,
  rootPath?: string | null,
): ChatDraftWorkspace | null => {
  if (workspaceId) return { kind: 'existing', workspaceId }
  if (rootPath) return { kind: 'folder', rootPath }
  return null
}

export const sameWorkspace = (left: ChatDraftWorkspace | null, right: ChatDraftWorkspace | null): boolean => {
  if (!left || !right) return left === right
  if (left.kind === 'existing' && right.kind === 'existing') return left.workspaceId === right.workspaceId
  if (left.kind === 'folder' && right.kind === 'folder') return left.rootPath === right.rootPath
  return false
}

/** The fields an override object sets, in run-settings terms. */
export const customizedFromOverride = (override: Readonly<{
  runtimeKind?: unknown
  llmModelIdentifier?: unknown
  llmConfig?: unknown
  autoExecuteTools?: unknown
  workspace?: unknown
}> | null | undefined): RunSettingFlags => ({
  model: Boolean(override && (override.runtimeKind !== undefined || override.llmModelIdentifier !== undefined)),
  thinking: Boolean(override && override.llmConfig !== undefined),
  approval: Boolean(override && override.autoExecuteTools !== undefined),
  workspace: Boolean(override && override.workspace !== undefined),
})
