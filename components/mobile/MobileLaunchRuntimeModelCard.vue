<template>
  <div data-testid="mobile-launch-runtime-model-card">
    <MobileLaunchTargetPicker
      :model-value="normalizedStoredRuntimeKind"
      label="Runtime"
      placeholder="Choose"
      :items="runtimeItems"
      :disabled="disabled"
      test-id="mobile-run-runtime-select"
      item-noun="runtimes"
      @update:model-value="updateRuntimeKind"
    />
    <MobileLaunchTargetPicker
      :model-value="llmModelIdentifier"
      label="Model"
      :placeholder="isLoadingModels ? 'Loading…' : 'Choose'"
      :items="modelItems"
      :disabled="disabled || !modelItems.length"
      :selected-label="selectedModelLabel"
      test-id="mobile-run-model-select"
      item-noun="models"
      @update:model-value="updateModel"
    />
    <p v-if="modelLoadError" class="py-2 text-sm text-red-700" role="alert">Couldn’t load the models.
      <button type="button" class="ml-1 h-11 font-semibold underline" @click="retry">Retry</button>
    </p>
    <ModelConfigSection
      v-if="modelConfigSchema"
      :key="llmModelIdentifier"
      :schema="modelConfigSchema"
      :model-config="llmConfig"
      :disabled="disabled"
      :apply-defaults="true"
      id-prefix="mobile-run"
      @update:config="(config: Record<string, unknown> | null) => $emit('update:llmConfig', config)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, toRef, watch } from 'vue'
import MobileLaunchTargetPicker from '~/components/mobile/MobileLaunchTargetPicker.vue'
import ModelConfigSection from '~/components/workspace/config/ModelConfigSection.vue'
import { normalizeScopedRuntimeKind, resolveEffectiveScopedRuntimeKind, useRuntimeScopedModelSelection } from '~/composables/useRuntimeScopedModelSelection'
import { useRuntimeCurrentModelDescriptor } from '~/composables/useRuntimeCurrentModelDescriptor'

const props = defineProps<{
  variant: 'agent' | 'team'
  runtimeKind: string
  llmModelIdentifier: string
  seedModelIdentifier?: string | null
  llmConfig?: Record<string, unknown> | null
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:runtimeKind', value: string): void
  (e: 'update:llmModelIdentifier', value: string): void
  (e: 'update:llmConfig', value: Record<string, unknown> | null): void
}>()

const {
  effectiveRuntimeKind, ensureModelsForRuntime, groupedModelOptions, hasModelIdentifier, isLoadingModels, isLoadingRuntime,
  modelLoadError, modelConfigSchemaByIdentifier, normalizedStoredRuntimeKind, reloadModelsForRuntime, runtimeOptions,
} = useRuntimeScopedModelSelection({ runtimeKind: toRef(props, 'runtimeKind'), loadCatalog: true })
const currentSeed = useRuntimeCurrentModelDescriptor(effectiveRuntimeKind, computed(() => props.seedModelIdentifier ?? null))

const runtimeItems = computed(() => runtimeOptions.value.filter((option) => option.enabled).map((option) => ({ id: option.value, label: option.label })))
const modelItems = computed(() => groupedModelOptions.value.flatMap((group) => group.items.map((item) => ({
  id: item.id, label: item.name, detail: item.description || undefined, group: group.label,
}))))
const selectedModelLabel = computed(() => {
  if (!props.llmModelIdentifier) return ''
  const item = modelItems.value.find((entry) => entry.id === props.llmModelIdentifier)
  if (item) return item.label
  return props.llmModelIdentifier === props.seedModelIdentifier ? (currentSeed.selectedDisplay.value || props.llmModelIdentifier) : props.llmModelIdentifier
})
const modelConfigSchema = computed(() => (props.llmModelIdentifier ? modelConfigSchemaByIdentifier(props.llmModelIdentifier) : null))

watch(() => props.runtimeKind, async (runtimeKind, previous) => {
  const normalized = normalizeScopedRuntimeKind(runtimeKind, false)
  if ((runtimeKind ?? '') !== normalized) { emit('update:runtimeKind', normalized); return }
  try { await ensureModelsForRuntime(resolveEffectiveScopedRuntimeKind(effectiveRuntimeKind.value)) } catch { return }
  if (typeof previous !== 'undefined' && props.llmModelIdentifier && !hasModelIdentifier(props.llmModelIdentifier) && props.llmModelIdentifier !== props.seedModelIdentifier) {
    emit('update:llmModelIdentifier', '')
    emit('update:llmConfig', null)
  }
}, { immediate: true })

function updateRuntimeKind(value: string): void {
  if (value === normalizedStoredRuntimeKind.value) return
  emit('update:runtimeKind', value)
  emit('update:llmModelIdentifier', '')
  emit('update:llmConfig', null)
}
function updateModel(value: string): void {
  if (value === props.llmModelIdentifier) return
  emit('update:llmModelIdentifier', value)
  emit('update:llmConfig', null)
}
function retry(): void { void reloadModelsForRuntime(resolveEffectiveScopedRuntimeKind(effectiveRuntimeKind.value)) }
void isLoadingRuntime
</script>
