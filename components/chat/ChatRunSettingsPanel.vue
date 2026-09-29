<template>
  <!-- chat-interface-entry R3: the chat run's ⚙ opens the product's existing-run
       settings view (RunConfigPanel selection mode + ExistingRunConfigEditor +
       AgentRunConfigForm), fed with the prototype chat run. Production reuses the
       real editor for this agent run. -->
  <div class="flex h-full flex-col bg-white" data-test="chat-run-settings">
    <div class="flex items-center justify-between border-b border-gray-200 px-4 py-2">
      <h3 class="truncate text-sm font-semibold text-gray-800">{{ $t('workspace.components.workspace.config.RunConfigPanel.title.agentConfiguration') }}</h3>
      <button
        type="button"
        data-test="run-config-back-to-events"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md text-indigo-600 transition-colors hover:bg-indigo-50"
        :title="$t('workspace.components.workspace.config.RunConfigPanel.return_to_event_view')"
        :aria-label="$t('workspace.components.workspace.config.RunConfigPanel.back_to_event_view')"
        @click="emit('close')"
      >
        <Icon icon="heroicons:arrow-long-left-20-solid" aria-hidden="true" class="h-4 w-5" />
      </button>
    </div>

    <div class="flex min-h-0 flex-1 flex-col">
      <div class="flex-1 overflow-y-auto px-4 py-4">
        <AgentRunConfigForm
          :config="agentConfig"
          :agent-definition="{ name: agent.name }"
          :workspace-loading-state="{ isLoading: false, error: null, loadedPath: workspace.path }"
          :workspace-selection="{ mode: 'existing', existingWorkspaceId: workspace.id, newWorkspacePath: '' }"
          :workspace-locked="true"
          :runtime-locked="true"
          :existing-run="true"
          :existing-model-config-editable="!chatRun.active"
          :existing-model-config-reason="chatRun.active ? 'RUN_ACTIVE' : null"
          :original-model-identifier="chatRun.modelId"
          :model-options="modelOptions"
          @selection-change="onSelectionChange"
        />
      </div>

      <div class="border-t border-gray-200 bg-gray-50 px-4 py-3">
        <button
          type="button"
          data-test="save-existing-model-config"
          class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!canSave"
          @click="save"
        >
          {{ $t('workspace.runModelConfig.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRuntimeAvailabilityStore } from '~/stores/runtimeAvailabilityStore'
import { useWorkspaceStore } from '~/stores/workspace'
import { Icon } from '@iconify/vue'
import AgentRunConfigForm from '~/components/workspace/config/AgentRunConfigForm.vue'
import type { ExistingRunModelChoice, ExistingRunModelOptionsState, ExistingRunModelSelection } from '~/types/agent/ExistingRunModelConfigDraft'
import { CHAT_MODELS, type ChatModel } from '~/prototype/chat/chat-fixtures'
import { findAgent, usePrototypeChat } from '~/composables/chat/usePrototypeChat'

const props = defineProps<{ chatId: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const chat = usePrototypeChat()
const chatRun = computed(() => chat.state.chats.find((item) => item.id === props.chatId)!)
const agent = computed(() => findAgent(chatRun.value.agentId))
const workspace = computed(() => chat.findWorkspace(chatRun.value.workspaceId))

// The prototype's illustrative thinking levels become one schema parameter (DEC-009).
const schemaFor = (model: ChatModel): Record<string, unknown> | null => model.thinkingLevels?.length
  ? { type: 'object', properties: { reasoning_effort: { type: 'string', title: 'Reasoning effort', enum: model.thinkingLevels.map((level) => level.toLowerCase()), default: (model.defaultThinking ?? model.thinkingLevels[0]).toLowerCase() } } }
  : null
const choiceFor = (model: ChatModel): ExistingRunModelChoice => ({
  llmModelIdentifier: model.id,
  providerName: model.provider,
  displayName: model.name,
  canonicalName: model.name,
  description: model.description ?? null,
  configSchema: schemaFor(model),
  recommended: false,
})
const runtimeModels = computed(() => CHAT_MODELS.filter((model) => model.runtime === chatRun.value.runtime))
const modelOptions = computed<ExistingRunModelOptionsState>(() => {
  const current = runtimeModels.value.find((model) => model.id === chatRun.value.modelId) ?? null
  return {
    status: 'ready',
    options: {
      currentModelIdentifier: chatRun.value.modelId,
      currentModel: current ? choiceFor(current) : null,
      replacements: runtimeModels.value.filter((model) => model.id !== chatRun.value.modelId).map(choiceFor),
      unavailableReason: null,
    },
  }
})

// Prototype glue: the product form reads runtime availability and the workspace
// inventory from product stores; register this chat run's runtime and workspace.
onMounted(() => {
  const availability = useRuntimeAvailabilityStore()
  if (!availability.availabilityByKind(chatRun.value.runtime as never)) {
    availability.availabilities = [...availability.availabilities, { runtimeKind: chatRun.value.runtime, enabled: true, reason: null } as never]
  }
  const workspaces = useWorkspaceStore()
  if (!workspaces.workspaces[workspace.value.id]) {
    workspaces.workspaces[workspace.value.id] = { workspaceId: workspace.value.id, name: workspace.value.name, workspaceConfig: {}, absolutePath: workspace.value.path }
  }
})

const configFor = (thinking: string | null | undefined) => thinking ? { reasoning_effort: thinking.toLowerCase() } : null
const selection = ref<ExistingRunModelSelection>({ llmModelIdentifier: chatRun.value.modelId, llmConfig: configFor(chatRun.value.thinking) })
watch(() => [chatRun.value.modelId, chatRun.value.thinking, chatRun.value.active], () => {
  selection.value = { llmModelIdentifier: chatRun.value.modelId, llmConfig: configFor(chatRun.value.thinking) }
})

const agentConfig = computed(() => ({
  agentDefinitionId: agent.value.id,
  agentDefinitionName: agent.value.name,
  agentAvatarUrl: null,
  runtimeKind: chatRun.value.runtime,
  llmModelIdentifier: selection.value.llmModelIdentifier,
  llmConfig: selection.value.llmConfig,
  workspaceId: workspace.value.id,
  workspaceMetadata: null,
  autoExecuteTools: chatRun.value.autoApprove !== false,
  skillAccessMode: 'PRELOADED_ONLY',
  isLocked: true,
}))

const onSelectionChange = (value: ExistingRunModelSelection) => {
  selection.value = value
}
const selectedThinking = computed(() => {
  const effort = selection.value.llmConfig?.reasoning_effort
  if (typeof effort !== 'string') return null
  const model = CHAT_MODELS.find((item) => item.id === selection.value.llmModelIdentifier)
  return model?.thinkingLevels?.find((level) => level.toLowerCase() === effort) ?? null
})
const canSave = computed(() => !chatRun.value.active && (
  selection.value.llmModelIdentifier !== chatRun.value.modelId || (selectedThinking.value ?? null) !== (chatRun.value.thinking ?? null)
))
const save = () => {
  if (!canSave.value) return
  chat.switchChatModel(chatRun.value.id, { runtime: chatRun.value.runtime, modelId: selection.value.llmModelIdentifier, thinking: selectedThinking.value ?? undefined })
}
</script>
