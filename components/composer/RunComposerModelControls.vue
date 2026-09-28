<template>
  <!-- chat-interface-entry: the same model + thinking controls as Chat, for a running
       agent (or the focused team/org member). The runtime is fixed for a run. -->
  <template v-if="config">
    <ChatModelPicker
      :runtime="runtime"
      :model-id="modelId"
      :thinking="thinking"
      locked-runtime
      :locked-reason="lockedReason"
      @select="onSelectModel"
    />
    <ChatEffortPicker :model-id="modelId" :thinking="thinking" :locked-reason="lockedReason" @select="onSelectThinking" />
  </template>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import ChatModelPicker from '~/components/chat/ChatModelPicker.vue'
import ChatEffortPicker from '~/components/chat/ChatEffortPicker.vue'
import { useActiveContextStore } from '~/stores/activeContextStore'
import { AgentStatus } from '~/types/agent/AgentStatus'
import { CHAT_RUNTIMES, type ChatCombo, type ChatRuntimeId } from '~/prototype/chat/chat-fixtures'
import { findModel } from '~/composables/chat/usePrototypeChat'

// Prototype-local thinking choice per run (the product stores this in the run's model config).
const thinkingByRun = reactive<Record<string, string>>({})

const activeContextStore = useActiveContextStore()
const context = computed(() => activeContextStore.activeAgentContext)
const config = computed(() => context.value?.config ?? null)
const runId = computed(() => context.value?.state.runId ?? '')
const runtime = computed<ChatRuntimeId>(() => {
  const kind = String(config.value?.runtimeKind || 'autobyteus')
  return (CHAT_RUNTIMES.some((item) => item.id === kind) ? kind : 'autobyteus') as ChatRuntimeId
})
const modelId = computed(() => String(config.value?.llmModelIdentifier || ''))
// Product rule: model settings change only while the run is stopped (not active).
const lockedReason = computed(() => context.value && context.value.state.currentStatus !== AgentStatus.Offline
  ? 'Locked while the run is live. Terminate the run from the Workspaces tree to change the model or thinking.'
  : null)
const thinking = computed(() => thinkingByRun[runId.value] ?? findModel(modelId.value)?.defaultThinking)

const onSelectModel = (combo: ChatCombo) => {
  if (!config.value || combo.modelId === modelId.value) return
  config.value.llmModelIdentifier = combo.modelId
  if (combo.thinking) thinkingByRun[runId.value] = combo.thinking
}
const onSelectThinking = (level: string) => {
  thinkingByRun[runId.value] = level
}
</script>
