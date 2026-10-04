<template>
  <div class="mx-auto max-w-2xl" data-test="team-launch-settings">
    <RunSubjectHeader kind="team" :name="model.definitionLabel" :subtitle="$t('runSettings.kind.team', { count: memberCount })" />

    <div class="mb-2 flex items-baseline justify-between gap-3">
      <h3 class="text-xs font-medium text-gray-500">{{ $t('runSettings.section.teamDefaults') }}</h3>
      <p class="hidden truncate text-xs text-gray-400 sm:block">{{ $t('runSettings.section.defaultsHint') }}</p>
    </div>
    <RunSettingsCard
      :values="rootValues"
      test-suffix="root"
      @update:workspace="emit('update:workspace-selection', model.root.address, toSelectionState($event))"
      @update:model="selectRootModel"
      @update:thinking="emit('edit', { kind: 'set_root_llm_config', llmConfig: $event })"
      @update:approval="emit('edit', { kind: 'set_root_auto_execute_tools', autoExecuteTools: $event })"
    />
    <RunWorkspaceHint :workspace="rootValues.workspace" />

    <RunMembersSection
      :nodes="memberNodes"
      :inherited-label="$t('runSettings.inherited.team')"
      :defaults-label="$t('runSettings.members.usesTeamDefaults')"
      @update="updateMember"
      @reset="resetMember"
      @reset-all="resetAll"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useWorkspaceStore } from '~/stores/workspace'
import type { EditableTeamRunFormModel } from '~/types/agent/EditableTeamRunFormModel'
import type { AgentTeamAddress } from '~/types/agent/AgentTeamAddress'
import type { AgentConfigOverride, TeamScopeConfigOverride } from '~/types/agent/TeamRunConfig'
import type { TeamLaunchConfigEdit } from '~/types/agent/TeamLaunchDraft'
import type { WorkspaceSelectionState } from '~/types/workspace/WorkspaceSelectionState'
import type { ChatDraftWorkspace } from '~/stores/chatDraftStore'
import RunSubjectHeader from './RunSubjectHeader.vue'
import RunSettingsCard from './RunSettingsCard.vue'
import RunWorkspaceHint from './RunWorkspaceHint.vue'
import RunMembersSection from './RunMembersSection.vue'
import { allMemberKeys, buildEditableMemberNodes, customizedKeys, findMemberNode, overrideWith, overrideWithout, valuesFromResolved } from './memberNodes'
import { fromSelectionState, toSelectionState, type RunModelChoice, type RunSettingField } from './runSettings'
import { useRunSettingsPresentation } from './useRunSettingsPresentation'

/** New Team run: team defaults + a compact "defaults and exceptions" member list (SCN-002). */
const props = defineProps<{ model: EditableTeamRunFormModel }>()
const emit = defineEmits<{
  (event: 'edit', value: TeamLaunchConfigEdit): void
  (event: 'update:workspace-selection', address: AgentTeamAddress, value: WorkspaceSelectionState): void
}>()

const presentation = useRunSettingsPresentation()

const rootWorkspace = computed(() => fromSelectionState(props.model.root.workspaceSelection))
const rootValues = computed(() => valuesFromResolved(props.model.root.effectiveConfig, rootWorkspace.value))
const memberNodes = computed(() => buildEditableMemberNodes(props.model.members, rootWorkspace.value))
const memberCount = computed(() => allMemberKeys(memberNodes.value).length)

const selectRootModel = (choice: RunModelChoice) => {
  if (choice.runtimeKind !== props.model.root.effectiveConfig.runtimeKind) {
    emit('edit', { kind: 'set_root_runtime', runtimeKind: choice.runtimeKind })
  }
  emit('edit', { kind: 'set_root_model', llmModelIdentifier: choice.llmModelIdentifier })
  emit('edit', { kind: 'set_root_llm_config', llmConfig: presentation.defaultConfigFor(choice) })
}

type MemberSource = { kind: 'agent'; override: AgentConfigOverride | undefined } | { kind: 'team'; override: TeamScopeConfigOverride | null }
const sourceFor = (address: string): MemberSource | null => {
  const visit = (nodes: EditableTeamRunFormModel['members']): MemberSource | null => {
    for (const node of nodes) {
      if (node.address === address) return node.kind === 'agent'
        ? { kind: 'agent', override: node.override as AgentConfigOverride | undefined }
        : { kind: 'team', override: node.scope.override as TeamScopeConfigOverride | null }
      if (node.kind !== 'agent') {
        const found = visit(node.children)
        if (found) return found
      }
    }
    return null
  }
  return visit(props.model.members)
}

const updateMember = (key: string, field: RunSettingField, value: unknown) => {
  const source = sourceFor(key)
  if (!source) return
  if (field === 'workspace') {
    emit('update:workspace-selection', key, toSelectionState(value as ChatDraftWorkspace))
    return
  }
  if (source.kind === 'agent') {
    emit('edit', { kind: 'set_agent_override', agentAddress: key, override: overrideWith(source.override, field, value, presentation.defaultConfigFor) })
  } else {
    emit('edit', { kind: 'set_team_override', teamAddress: key, override: overrideWith(source.override, field, value, presentation.defaultConfigFor) })
  }
}

const resetMember = (key: string, field: RunSettingField | null) => {
  const source = sourceFor(key)
  if (!source) return
  if (field === 'workspace' || (field === null && findMemberNode(memberNodes.value, key)?.customized.workspace)) {
    if (rootWorkspace.value) emit('update:workspace-selection', key, toSelectionState(rootWorkspace.value))
    if (field === 'workspace') return
  }
  if (source.kind === 'agent') {
    emit('edit', { kind: 'set_agent_override', agentAddress: key, override: overrideWithout(source.override, field) })
  } else if (field === null) {
    emit('edit', { kind: 'reset_team_override', teamAddress: key })
  } else {
    emit('edit', { kind: 'set_team_override', teamAddress: key, override: overrideWithout(source.override, field) })
  }
}

// Like Chat, a new run starts in the temp workspace until another one is chosen.
const workspaceStore = useWorkspaceStore()
onMounted(() => {
  if (rootWorkspace.value) return
  const temp = workspaceStore.tempWorkspace
  if (temp) emit('update:workspace-selection', props.model.root.address, toSelectionState({ kind: 'existing', workspaceId: temp.workspaceId }))
})

const resetAll = () => customizedKeys(memberNodes.value).forEach((key) => resetMember(key, null))
</script>
