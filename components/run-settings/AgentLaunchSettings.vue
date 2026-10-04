<template>
  <div class="mx-auto max-w-2xl" data-test="agent-launch-settings">
    <RunSubjectHeader kind="agent" :name="definitionName" :subtitle="$t('runSettings.kind.agent')" />
    <h3 class="mb-2 text-xs font-medium text-gray-500">{{ $t('runSettings.section.settings') }}</h3>
    <RunSettingsCard
      :values="values"
      @update:workspace="selectWorkspace"
      @update:model="selectModel"
      @update:thinking="config.llmConfig = $event"
      @update:approval="config.autoExecuteTools = $event"
    />
    <RunWorkspaceHint :workspace="values.workspace" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { AgentRunConfig } from '~/types/agent/AgentRunConfig'
import type { WorkspaceSelectionState } from '~/types/workspace/WorkspaceSelectionState'
import type { ChatDraftWorkspace } from '~/stores/chatDraftStore'
import { useAgentRunConfigStore } from '~/stores/agentRunConfigStore'
import { useWorkspaceStore } from '~/stores/workspace'
import RunSubjectHeader from './RunSubjectHeader.vue'
import RunSettingsCard from './RunSettingsCard.vue'
import RunWorkspaceHint from './RunWorkspaceHint.vue'
import { fromSelectionState, toChatWorkspace, toSelectionState, type RunModelChoice, type RunSettingsValues } from './runSettings'
import { useRunSettingsPresentation } from './useRunSettingsPresentation'

/** New Agent run: the four Chat settings in one card (run-settings-ui-unification, SCN-001). */
const props = defineProps<{
  config: AgentRunConfig
  definitionName: string
  workspaceSelection: WorkspaceSelectionState
}>()
const emit = defineEmits<{ (event: 'update:workspace-selection', value: WorkspaceSelectionState): void }>()

const runConfigStore = useAgentRunConfigStore()
const workspaceStore = useWorkspaceStore()
const presentation = useRunSettingsPresentation()

const values = computed<RunSettingsValues>(() => ({
  workspace: props.workspaceSelection.mode === 'new'
    ? fromSelectionState(props.workspaceSelection)
    : toChatWorkspace(props.config.workspaceId ?? props.workspaceSelection.existingWorkspaceId),
  runtimeKind: props.config.runtimeKind,
  llmModelIdentifier: props.config.llmModelIdentifier || '',
  llmConfig: props.config.llmConfig ?? null,
  autoExecuteTools: props.config.autoExecuteTools,
}))

const selectWorkspace = (workspace: ChatDraftWorkspace) => emit('update:workspace-selection', toSelectionState(workspace))

const selectModel = (choice: RunModelChoice) => runConfigStore.updateAgentConfig({
  runtimeKind: choice.runtimeKind as AgentRunConfig['runtimeKind'],
  llmModelIdentifier: choice.llmModelIdentifier,
  llmConfig: presentation.defaultConfigFor(choice),
})

// Like Chat, a new run starts in the temp workspace until another one is chosen.
onMounted(() => {
  if (values.value.workspace) return
  const temp = workspaceStore.tempWorkspace
  if (temp) selectWorkspace({ kind: 'existing', workspaceId: temp.workspaceId })
})
</script>
