import type { EditableTeamFormMemberNode } from '~/types/agent/EditableTeamRunFormModel'
import type { ExistingTeamFormMemberNode } from '~/types/agent/ExistingTeamRunFormModel'
import type { ResolvedTeamRunLaunchConfig } from '~/types/agent/TeamRunConfig'
import type { ChatDraftWorkspace } from '~/stores/chatDraftStore'
import {
  customizedFromOverride,
  fromSelectionState,
  MEMBER_RUN_SETTING_FIELDS,
  sameWorkspace,
  TEAM_PLACEMENT_RUN_SETTING_FIELDS,
  toChatWorkspace,
  type RunMemberNode,
  type RunModelChoice,
  type RunSettingField,
  type RunSettingFlags,
  type RunSettingsValues,
} from './runSettings'

type OverrideShape = {
  runtimeKind?: string
  llmModelIdentifier?: string
  llmConfig?: Record<string, unknown> | null
  autoExecuteTools?: boolean
}

export const valuesFromResolved = (
  config: Readonly<ResolvedTeamRunLaunchConfig>,
  workspace?: ChatDraftWorkspace | null,
): RunSettingsValues => ({
  workspace: workspace ?? toChatWorkspace(config.workspaceId, config.workspaceRootPath),
  runtimeKind: config.runtimeKind,
  llmModelIdentifier: config.llmModelIdentifier || '',
  llmConfig: config.llmConfig ?? null,
  autoExecuteTools: config.autoExecuteTools,
})

/** Launch draft member tree → run-settings member rows (team placements keep their own workspace). */
export const buildEditableMemberNodes = (
  nodes: readonly EditableTeamFormMemberNode[],
  parentWorkspace: ChatDraftWorkspace | null,
): RunMemberNode[] => nodes.map((node) => {
  if (node.kind === 'agent') {
    return {
      key: node.address,
      kind: 'agent',
      name: node.displayName,
      isCoordinator: node.isCoordinator,
      values: valuesFromResolved(node.effectiveConfig, parentWorkspace),
      customized: customizedFromOverride(node.override),
      fields: MEMBER_RUN_SETTING_FIELDS,
      detail: node.address,
    }
  }
  const teamWorkspace = fromSelectionState(node.scope.workspaceSelection)
    ?? toChatWorkspace(node.scope.effectiveConfig.workspaceId, node.scope.effectiveConfig.workspaceRootPath)
  const customized = customizedFromOverride(node.scope.override)
  customized.workspace = Boolean(teamWorkspace && parentWorkspace && !sameWorkspace(teamWorkspace, parentWorkspace))
  return {
    key: node.address,
    kind: 'team',
    name: node.scope.displayName,
    values: valuesFromResolved(node.scope.effectiveConfig, teamWorkspace),
    customized,
    fields: TEAM_PLACEMENT_RUN_SETTING_FIELDS,
    children: buildEditableMemberNodes(node.children, teamWorkspace),
    detail: node.address,
  }
})

/** What a saved member sets itself, compared with its parent's saved values. */
const ownSettings = (base: RunSettingsValues, parentBase: RunSettingsValues): RunSettingFlags => ({
  model: base.runtimeKind !== parentBase.runtimeKind || base.llmModelIdentifier !== parentBase.llmModelIdentifier,
  thinking: JSON.stringify(base.llmConfig ?? null) !== JSON.stringify(parentBase.llmConfig ?? null),
  approval: base.autoExecuteTools !== parentBase.autoExecuteTools,
  workspace: !sameWorkspace(base.workspace, parentBase.workspace),
})

/** A member that follows its parent follows the parent's unsaved edit too. */
const inheritParentEdit = (base: RunSettingsValues, own: RunSettingFlags, parent: RunSettingsValues): RunSettingsValues => ({
  ...base,
  ...(own.model ? {} : { runtimeKind: parent.runtimeKind, llmModelIdentifier: parent.llmModelIdentifier }),
  ...(own.model || own.thinking ? {} : { llmConfig: parent.llmConfig }),
})

/**
 * Saved run member tree. `edits` overlays local model/thinking changes; `parent` is the edited
 * parent and `parentBase` its saved values, so inheritance is judged on what the run saved.
 */
export const buildExistingMemberNodes = (
  nodes: readonly ExistingTeamFormMemberNode[],
  edits: Readonly<Record<string, Partial<RunSettingsValues>>>,
  parent: RunSettingsValues,
  parentBase: RunSettingsValues,
): RunMemberNode[] => nodes.map((node) => {
  const resolved = node.kind === 'agent' ? node.effectiveConfig : node.scope.effectiveConfig
  const saved = valuesFromResolved(resolved)
  const base = { ...saved, workspace: saved.workspace ?? parentBase.workspace }
  const own = ownSettings(base, parentBase)
  const edit = edits[node.address]
  const values = { ...inheritParentEdit(base, own, parent), ...edit }
  const customized: RunSettingFlags = {
    model: own.model || Boolean(edit?.llmModelIdentifier),
    thinking: own.thinking || edit?.llmConfig !== undefined,
    approval: own.approval,
    workspace: node.kind === 'agent' ? false : own.workspace || edit?.workspace !== undefined,
  }
  if (node.kind === 'agent') {
    return {
      key: node.address,
      kind: 'agent',
      name: node.displayName,
      isCoordinator: node.isCoordinator,
      values,
      customized,
      fields: MEMBER_RUN_SETTING_FIELDS,
      detail: node.address,
    }
  }
  return {
    key: node.address,
    kind: 'team',
    name: node.scope.displayName,
    values,
    customized,
    fields: TEAM_PLACEMENT_RUN_SETTING_FIELDS,
    children: buildExistingMemberNodes(node.children, edits, values, base),
    detail: node.address,
  }
})

export const findMemberNode = (nodes: readonly RunMemberNode[], key: string): RunMemberNode | null => {
  for (const node of nodes) {
    if (node.key === key) return node
    const child = findMemberNode(node.children ?? [], key)
    if (child) return child
  }
  return null
}

/** Apply one run-settings edit to an override object (model choice also applies its default thinking). */
export const overrideWith = <T extends OverrideShape>(
  current: Readonly<T> | null | undefined,
  field: Exclude<RunSettingField, 'workspace'>,
  value: unknown,
  defaultConfigFor: (choice: RunModelChoice) => Record<string, unknown> | null,
): T => {
  const next = { ...(current ?? {}) } as T
  if (field === 'model') {
    const choice = value as RunModelChoice
    next.runtimeKind = choice.runtimeKind
    next.llmModelIdentifier = choice.llmModelIdentifier
    next.llmConfig = defaultConfigFor(choice)
  } else if (field === 'thinking') {
    next.llmConfig = value as Record<string, unknown> | null
  } else {
    next.autoExecuteTools = value as boolean
  }
  return next
}

/** Remove one field (or every field) so the member follows its defaults again. */
export const overrideWithout = <T extends OverrideShape & { workspace?: unknown }>(
  current: Readonly<T> | null | undefined,
  field: RunSettingField | null,
): T | null => {
  if (!current || field === null) return null
  const next = { ...current } as T
  if (field === 'model') {
    delete next.runtimeKind
    delete next.llmModelIdentifier
    delete next.llmConfig
  } else if (field === 'thinking') delete next.llmConfig
  else if (field === 'approval') delete next.autoExecuteTools
  else delete next.workspace
  return Object.keys(next).length ? next : null
}

export const allMemberKeys = (nodes: readonly RunMemberNode[]): string[] =>
  nodes.flatMap((node) => [node.key, ...allMemberKeys(node.children ?? [])])

export const customizedKeys = (nodes: readonly RunMemberNode[]): string[] =>
  nodes.flatMap((node) => [
    ...(Object.values(node.customized as RunSettingFlags).some(Boolean) ? [node.key] : []),
    ...customizedKeys(node.children ?? []),
  ])

/** Members and placed teams that set something themselves. */
export const countCustomizedOf = (nodes: readonly RunMemberNode[]): number => customizedKeys(nodes).length
