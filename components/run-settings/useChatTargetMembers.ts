import { computed, ref, watch, type Ref } from 'vue'
import { useAgentTeamDefinitionStore } from '~/stores/agentTeamDefinitionStore'
import { useAgentOrgDefinitionStore } from '~/stores/agentOrgDefinitionStore'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import type { ChatDraftWorkspace, ChatMemberSettings } from '~/stores/chatDraftStore'
import type { MemberSettingsSource } from './memberSettingsSource'
import { loadAgentOrgDefinitionReferences, type AgentOrgDefinitionReferences } from '~/services/agentOrgDefinition/agentOrgDefinitionReferences'
import {
  customizedFromOverride,
  MEMBER_RUN_SETTING_FIELDS,
  TEAM_PLACEMENT_RUN_SETTING_FIELDS,
  type RunMemberNode,
  type RunSettingField,
  type RunSettingsValues,
} from './runSettings'
import { allMemberKeys, countCustomizedOf, overrideWith, overrideWithout } from './memberNodes'
import { useRunSettingsPresentation } from './useRunSettingsPresentation'

/**
 * run-settings-ui-unification: the members of a Team (New chat) or an Org (Org launch page), with
 * the composer's or the Org card's settings as their defaults and each member's own exceptions.
 */
export function useChatTargetMembers(source: Ref<MemberSettingsSource | null>) {
  const teamStore = useAgentTeamDefinitionStore()
  const orgStore = useAgentOrgDefinitionStore()
  const agentStore = useAgentDefinitionStore()
  const presentation = useRunSettingsPresentation()

  const defaults = computed<RunSettingsValues | null>(() => source.value?.defaults ?? null)

  const settingsFor = (address: string): ChatMemberSettings => source.value?.memberSettings[address] ?? {}
  const apply = (base: RunSettingsValues, own: ChatMemberSettings): RunSettingsValues => ({
    workspace: own.workspace ?? base.workspace,
    runtimeKind: own.runtimeKind ?? base.runtimeKind,
    llmModelIdentifier: own.llmModelIdentifier ?? base.llmModelIdentifier,
    llmConfig: own.llmConfig !== undefined ? own.llmConfig : base.llmConfig,
    autoExecuteTools: own.autoExecuteTools ?? base.autoExecuteTools,
  })

  /** Choosing a model records its default thinking; only a different choice counts as customized thinking. */
  const flagsFor = (own: ChatMemberSettings, values: RunSettingsValues) => {
    const flags = customizedFromOverride(own)
    if (flags.thinking && own.llmModelIdentifier && JSON.stringify(own.llmConfig ?? null)
      === JSON.stringify(presentation.defaultConfigFor({ runtimeKind: values.runtimeKind, llmModelIdentifier: values.llmModelIdentifier }) ?? null)) {
      flags.thinking = false
    }
    return flags
  }

  const agentNode = (address: string, name: string, base: RunSettingsValues, isCoordinator = false): RunMemberNode => {
    const own = settingsFor(address)
    const values = apply(base, own)
    return {
      key: address,
      kind: 'agent',
      name,
      isCoordinator,
      values,
      customized: { ...flagsFor(own, values), workspace: false },
      fields: MEMBER_RUN_SETTING_FIELDS,
      detail: address,
    }
  }

  // Org members may be owned by the Org, so they are read like the Org launch form reads them.
  const orgReferences = ref<{ orgId: string; snapshot: AgentOrgDefinitionReferences } | null>(null)
  const org = computed(() => source.value?.target.kind === 'org' ? orgStore.byId(source.value.target.orgDefinitionId) ?? null : null)
  watch(org, async (value) => {
    if (!value || orgReferences.value?.orgId === value.id) return
    try {
      const snapshot = await loadAgentOrgDefinitionReferences(value.id, value.members.map((member) => ({ ...member })), {
        getCatalogAgentById: agentStore.getAgentDefinitionById,
        getCatalogTeamById: teamStore.getCatalogAgentTeamDefinitionById,
      })
      orgReferences.value = { orgId: value.id, snapshot }
    } catch (error) {
      console.warn('Failed to read the Org members:', error)
    }
  }, { immediate: true })

  const nodes = computed<RunMemberNode[]>(() => {
    const current = source.value
    const base = defaults.value
    if (!current || !base) return []
    if (current.target.kind === 'team') {
      const teamId = current.target.teamDefinitionId
      const team = teamStore.agentTeamDefinitions.find((entry) => entry.id === teamId)
      return (team?.nodes ?? []).map((node) => agentNode(`/${node.memberName.trim()}`, node.memberName.trim(), base,
        node.memberName === team?.coordinatorMemberName))
    }
    if (current.target.kind === 'org' && org.value) {
      const snapshot = orgReferences.value?.orgId === org.value.id ? orgReferences.value.snapshot : null
      return org.value.members.map((member) => {
        const address = `/${member.memberName}`
        if (member.refType === 'AGENT') {
          return agentNode(address, snapshot?.agents[member.ref]?.name ?? member.memberName, base)
        }
        const team = snapshot?.teams[member.ref] ?? teamStore.getCatalogAgentTeamDefinitionById(member.ref) ?? null
        const own = settingsFor(address)
        const teamValues = apply(base, own)
        return {
          key: address,
          kind: 'team' as const,
          name: team?.name ?? member.memberName,
          values: teamValues,
          customized: flagsFor(own, teamValues),
          fields: TEAM_PLACEMENT_RUN_SETTING_FIELDS,
          children: (team?.nodes ?? []).map((node) => agentNode(`${address}/${node.memberName}`, node.memberName, teamValues,
            node.memberName === team?.coordinatorMemberName)),
          detail: address,
        }
      })
    }
    return []
  })

  const memberCount = computed(() => nodes.value.reduce((total, node) => total + (node.kind === 'team' ? (node.children?.length ?? 0) : 1), 0))
  const customizedCount = computed(() => countCustomizedOf(nodes.value))

  const update = (address: string, field: RunSettingField, value: unknown) => {
    const current = settingsFor(address)
    if (field === 'workspace') {
      source.value?.setMemberSettings(address, { ...current, workspace: value as ChatDraftWorkspace })
      return
    }
    source.value?.setMemberSettings(address, overrideWith(current, field, value, presentation.defaultConfigFor))
  }
  const reset = (address: string, field: RunSettingField | null) => {
    source.value?.setMemberSettings(address, overrideWithout(settingsFor(address), field))
  }
  const resetAll = () => source.value?.resetAllMemberSettings()

  return { nodes, memberCount, customizedCount, allKeys: computed(() => allMemberKeys(nodes.value)), update, reset, resetAll }
}
