<template>
  <div class="mx-auto max-w-2xl" data-test="org-launch-settings">
    <RunSubjectHeader kind="org" :name="orgName" :subtitle="$t('runSettings.kind.org', { count: model.configurableAgentCount })" />

    <div class="mb-2 flex items-baseline justify-between gap-3">
      <h3 class="text-xs font-medium text-gray-500">{{ $t('runSettings.section.orgDefaults') }}</h3>
      <p class="hidden truncate text-xs text-gray-400 sm:block">{{ $t('runSettings.section.defaultsHint') }}</p>
    </div>
    <RunSettingsCard
      :values="rootValues"
      test-suffix="root"
      @update:workspace="emit('root-workspace', toSelectionState($event))"
      @update:model="emit('root-model', $event)"
      @update:thinking="emit('root-thinking', $event)"
      @update:approval="emit('root-approval', $event)"
    />
    <RunWorkspaceHint :workspace="rootValues.workspace" />

    <RunMembersSection
      :nodes="memberNodes"
      :inherited-label="$t('runSettings.inherited.org')"
      :defaults-label="$t('runSettings.members.usesOrgDefaults')"
      @update="updateMember"
      @reset="resetMember"
      @reset-all="resetAll"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EditableAgentOrgRunFormModel } from '~/utils/editableAgentOrgRunFormModel'
import type { AgentTeamAddress } from '~/types/agent/AgentTeamAddress'
import type { AgentConfigOverride, TeamScopeConfigOverride } from '~/types/agent/TeamRunConfig'
import type { WorkspaceSelectionState } from '~/types/workspace/WorkspaceSelectionState'
import type { ChatDraftWorkspace } from '~/stores/chatDraftStore'
import RunSubjectHeader from './RunSubjectHeader.vue'
import RunSettingsCard from './RunSettingsCard.vue'
import RunWorkspaceHint from './RunWorkspaceHint.vue'
import RunMembersSection from './RunMembersSection.vue'
import { buildEditableMemberNodes, customizedKeys, findMemberNode, overrideWith, overrideWithout } from './memberNodes'
import { toSelectionState, type RunModelChoice, type RunSettingField, type RunSettingsValues } from './runSettings'
import { useRunSettingsPresentation } from './useRunSettingsPresentation'

/**
 * New Org run (SCN-003): org defaults, then agents and teams placed in the Org as one compact
 * list. A placed team can choose its own workspace; its members customize model, thinking and
 * tool approval. Addresses appear only as tooltips.
 */
const props = defineProps<{
  orgName: string
  rootValues: RunSettingsValues
  model: EditableAgentOrgRunFormModel
}>()
const emit = defineEmits<{
  (event: 'root-workspace', value: WorkspaceSelectionState): void
  (event: 'root-model', value: RunModelChoice): void
  (event: 'root-thinking', value: Record<string, unknown> | null): void
  (event: 'root-approval', value: boolean): void
  (event: 'agent-override', address: AgentTeamAddress, value: AgentConfigOverride | null): void
  (event: 'team-override', address: AgentTeamAddress, value: TeamScopeConfigOverride | null): void
  (event: 'team-workspace', address: AgentTeamAddress, value: WorkspaceSelectionState): void
}>()

const presentation = useRunSettingsPresentation()
const memberNodes = computed(() => buildEditableMemberNodes(
  [...props.model.directAgents, ...props.model.mountedTeams], props.rootValues.workspace,
))

type MemberSource = { kind: 'agent'; override: AgentConfigOverride | undefined } | { kind: 'team'; override: TeamScopeConfigOverride | null }
const sourceFor = (address: string): MemberSource | null => {
  const direct = props.model.directAgents.find((agent) => agent.address === address)
  if (direct) return { kind: 'agent', override: direct.override as AgentConfigOverride | undefined }
  for (const team of props.model.mountedTeams) {
    if (team.address === address) return { kind: 'team', override: team.scope.override as TeamScopeConfigOverride | null }
    for (const child of team.children) {
      if (child.address === address && child.kind === 'agent') return { kind: 'agent', override: child.override as AgentConfigOverride | undefined }
    }
  }
  return null
}

const updateMember = (key: string, field: RunSettingField, value: unknown) => {
  const source = sourceFor(key)
  if (!source) return
  if (field === 'workspace') {
    emit('team-workspace', key, toSelectionState(value as ChatDraftWorkspace))
    return
  }
  if (source.kind === 'agent') emit('agent-override', key, overrideWith(source.override, field, value, presentation.defaultConfigFor))
  else emit('team-override', key, overrideWith(source.override, field, value, presentation.defaultConfigFor))
}

const resetMember = (key: string, field: RunSettingField | null) => {
  const source = sourceFor(key)
  if (!source) return
  if ((field === 'workspace' || field === null) && findMemberNode(memberNodes.value, key)?.customized.workspace && props.rootValues.workspace) {
    emit('team-workspace', key, toSelectionState(props.rootValues.workspace))
  }
  if (field === 'workspace') return
  if (source.kind === 'agent') emit('agent-override', key, overrideWithout(source.override, field))
  else emit('team-override', key, overrideWithout(source.override, field))
}

const resetAll = () => customizedKeys(memberNodes.value).forEach((key) => resetMember(key, null))
</script>
