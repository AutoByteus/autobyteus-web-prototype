<template>
  <div
    class="space-y-0.5"
    :data-test="`run-settings-card${testSuffix ? `-${testSuffix}` : ''}`"
  >
    <template v-for="field in fields" :key="field">
    <div
      class="flex min-h-[2.25rem] items-center gap-2"
      :data-test="`run-setting-${field}`"
      :data-state="isLocked(field) ? 'locked' : isInherited(field) ? 'inherited' : isCustomized(field) ? 'customized' : 'set'"
    >
      <!-- Rounds 15/16/20: labels and values read as clearly as the message box; no row dividers. -->
      <span class="w-24 flex-shrink-0 text-[0.8125rem] text-gray-900">{{ fieldLabel(field) }}</span>

      <div class="flex min-w-0 flex-1 flex-col items-start [&>div>button]:max-w-full [&>div]:max-w-full">
        <!-- Workspace -->
        <template v-if="field === 'workspace'">
          <span v-if="isLocked('workspace')" class="inline-flex max-w-full items-center gap-1.5 px-2 py-1 text-[0.8125rem] leading-5 text-gray-600" :title="presentation.workspacePath(values.workspace)" :aria-label="lockedAria(field, presentation.workspaceName(values.workspace))" data-test="run-setting-locked">
            <Icon icon="heroicons:folder" class="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
            <span class="truncate">{{ presentation.workspaceName(values.workspace) }}</span>
            <Icon icon="heroicons:lock-closed" class="h-3 w-3 flex-shrink-0 text-gray-300" aria-hidden="true" />
          </span>
          <ChatWorkspaceMenu
            v-else-if="values.workspace"
            :workspace="values.workspace"
            placement="auto"
            @select="emit('update:workspace', $event)"
          />
          <button
            v-else
            type="button"
            class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.8125rem] leading-5 text-amber-700 hover:bg-gray-100"
            @click="emit('choose-workspace')"
          >
            <Icon icon="heroicons:folder" class="h-4 w-4" aria-hidden="true" />{{ $t('runSettings.row.workspace') }}
          </button>
        </template>

        <!-- Model (with its runtime) -->
        <template v-else-if="field === 'model'">
          <span v-if="isLocked('model')" class="inline-flex max-w-full items-center gap-1.5 px-2 py-1 text-[0.8125rem] leading-5" :aria-label="lockedAria(field, `${modelText} · ${presentation.runtimeLabel(values.runtimeKind)}`)" data-test="run-setting-locked">
            <span class="truncate font-medium text-gray-700">{{ modelText }}</span>
            <span class="truncate whitespace-nowrap text-gray-400">{{ presentation.runtimeShortLabel(values.runtimeKind) }}</span>
            <Icon icon="heroicons:lock-closed" class="h-3 w-3 flex-shrink-0 text-gray-300" aria-hidden="true" />
          </span>
          <ChatModelMenu
            v-else
            :runtime-kind="values.runtimeKind"
            :llm-model-identifier="values.llmModelIdentifier"
            :model-label="modelText"
            placement="auto"
            :align="nested ? 'right' : 'left'"
            :runtime-locked="runtimeLocked"
            :drill-in="nested"
            @select="emit('update:model', $event)"
          />
          <p v-if="modelUnavailable" class="px-2 pb-1 text-xs leading-5 text-amber-700" data-test="run-setting-model-unavailable">
            {{ $t('runSettings.model.unavailable', { runtime: presentation.runtimeLabel(values.runtimeKind) }) }}
          </p>
        </template>

        <!-- Thinking -->
        <template v-else-if="field === 'thinking'">
          <span v-if="thinkingHidden" class="px-2 py-1 text-[0.8125rem] leading-5 text-gray-500" data-test="run-setting-thinking-unavailable">
            {{ values.llmModelIdentifier ? $t('runSettings.thinking.unavailable') : '—' }}
          </span>
          <span v-else-if="isLocked('thinking')" class="inline-flex items-center gap-1 px-2 py-1 text-[0.8125rem] leading-5 text-gray-600" :aria-label="lockedAria(field, thinkingSummary)" data-test="run-setting-locked">
            <Icon icon="heroicons:light-bulb" class="h-3.5 w-3.5" :class="thinkingActive ? 'text-gray-500' : 'text-gray-300'" aria-hidden="true" />
            <span>{{ thinkingSummary }}</span>
            <Icon icon="heroicons:lock-closed" class="ml-0.5 h-3 w-3 text-gray-300" aria-hidden="true" />
          </span>
          <ChatThinkingControl
            v-else
            :schema="thinkingSchema"
            :llm-config="values.llmConfig"
            placement="auto"
            :align="nested ? 'right' : 'left'"
            @update="emit('update:thinking', $event)"
          />
        </template>

        <!-- Tool approval -->
        <template v-else>
          <span v-if="isLocked('approval') && !approvalRuntimeLocked" class="inline-flex items-center gap-1.5 px-2 py-1 text-[0.8125rem] leading-5 text-gray-600" :aria-label="lockedAria(field, presentation.approvalLabel(values.autoExecuteTools))" data-test="run-setting-locked">
            <Icon :icon="values.autoExecuteTools ? 'heroicons:shield-check' : 'heroicons:shield-exclamation'" class="h-4 w-4 text-gray-400" aria-hidden="true" />
            <span>{{ presentation.approvalLabel(values.autoExecuteTools) }}</span>
            <Icon icon="heroicons:lock-closed" class="h-3 w-3 text-gray-300" aria-hidden="true" />
          </span>
          <ChatApprovalToggle
            v-else
            :model-value="approvalRuntimeLocked || values.autoExecuteTools"
            :locked="approvalRuntimeLocked"
            @update:model-value="emit('update:approval', $event)"
          />
        </template>
      </div>

      <!-- Trailing: inherited marker or reset for a member's own value -->
      <button
        v-if="canReset(field)"
        type="button"
        class="flex-shrink-0 rounded px-1.5 py-0.5 text-xs font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        :aria-label="$t('runSettings.inherited.resetAria', { setting: fieldLabel(field) })"
        data-test="run-setting-reset"
        @click="resetField(field)"
      >
        {{ $t('runSettings.inherited.reset') }}
      </button>
    </div>

    <!-- SR-005 (REQ-022): the model's other settings (e.g. Codex Fast mode), one row each under Thinking,
         with the same control as the message box. Locked with the thinking rules (running saved run). -->
    <div
      v-for="option in (field === 'thinking' ? modelOptions : [])"
      :key="option.key"
      class="flex min-h-[2.25rem] items-center gap-2"
      :data-test="`run-setting-option-${option.key}`"
      :data-state="isLocked('thinking') ? 'locked' : optionCustomized(option.key) ? 'customized' : customized ? 'inherited' : 'set'"
    >
      <span class="w-24 flex-shrink-0 text-[0.8125rem] text-gray-900">{{ option.title }}</span>
      <div class="flex min-w-0 flex-1 flex-col items-start">
        <span v-if="isLocked('thinking')" class="inline-flex items-center gap-1 px-2 py-1 text-[0.8125rem] leading-5 text-gray-600" :aria-label="t('runSettings.locked.fixedAria', { setting: option.title, value: lockedOptionText(option) })" data-test="run-setting-locked">
          <Icon :icon="option.set ? `${option.icon}-solid` : option.icon" class="h-3.5 w-3.5" :class="option.set ? 'text-gray-500' : 'text-gray-300'" aria-hidden="true" />
          <span>{{ lockedOptionText(option) }}</span>
          <Icon icon="heroicons:lock-closed" class="ml-0.5 h-3 w-3 text-gray-300" aria-hidden="true" />
        </span>
        <ChatModelOptionControl
          v-else
          :option="option"
          placement="auto"
          :align="nested ? 'right' : 'left'"
          @update="emit('update:thinking', applyModelOption(values.llmConfig, option.key, $event))"
        />
      </div>
      <button
        v-if="resettable && optionCustomized(option.key)"
        type="button"
        class="flex-shrink-0 rounded px-1.5 py-0.5 text-xs font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        :aria-label="$t('runSettings.inherited.resetAria', { setting: option.title })"
        :data-test="`run-setting-option-reset-${option.key}`"
        @click="emit('update:thinking', applyModelOption(values.llmConfig, option.key, inheritedLlmConfig?.[option.key]))"
      >
        {{ $t('runSettings.inherited.reset') }}
      </button>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import ChatWorkspaceMenu from '~/components/chat/ChatWorkspaceMenu.vue'
import ChatModelMenu from '~/components/chat/ChatModelMenu.vue'
import ChatThinkingControl from '~/components/chat/ChatThinkingControl.vue'
import ChatModelOptionControl from '~/components/chat/ChatModelOptionControl.vue'
import { applyModelOption, buildModelOptions, withoutModelOptions, type ModelOption } from '~/components/chat/chatModelOptions'
import ChatApprovalToggle from '~/components/chat/ChatApprovalToggle.vue'
import { useLocalization } from '~/composables/useLocalization'
import type { ChatDraftWorkspace } from '~/stores/chatDraftStore'
import {
  ALL_RUN_SETTING_FIELDS,
  isApprovalLockedForRuntime,
  type RunModelChoice,
  type RunSettingField,
  type RunSettingFlags,
  type RunSettingsValues,
} from './runSettings'
import { useRunSettingsPresentation } from './useRunSettingsPresentation'

const props = withDefaults(defineProps<{
  values: RunSettingsValues
  fields?: readonly RunSettingField[]
  /** Which fields a member sets itself; the rest follow the team/org settings. */
  customized?: RunSettingFlags | null
  /** Fields that cannot change for this run (saved runtime/workspace, active run). */
  locked?: RunSettingFlags
  /** A saved run keeps its runtime: the model menu lists only that runtime's models. */
  runtimeLocked?: boolean
  modelUnavailable?: boolean
  /** Saved runs show what differs but offer no per-field reset. */
  resettable?: boolean
  nested?: boolean
  testSuffix?: string
  /**
   * SR-005: the parent's model config for a member (undefined elsewhere), so thinking and each other
   * model setting are marked "Customized" and reset on their own.
   */
  inheritedLlmConfig?: Record<string, unknown> | null
}>(), {
  fields: () => ALL_RUN_SETTING_FIELDS,
  customized: null,
  locked: () => ({}),
  runtimeLocked: false,
  modelUnavailable: false,
  resettable: true,
  nested: false,
  testSuffix: '',
  inheritedLlmConfig: undefined,
})

const emit = defineEmits<{
  (event: 'update:workspace', value: ChatDraftWorkspace): void
  (event: 'update:model', value: RunModelChoice): void
  (event: 'update:thinking', value: Record<string, unknown> | null): void
  (event: 'update:approval', value: boolean): void
  (event: 'reset', field: RunSettingField): void
  (event: 'choose-workspace'): void
}>()

const { t } = useLocalization()
const presentation = useRunSettingsPresentation()

watch(() => props.values.runtimeKind, (runtimeKind) => presentation.ensureRuntime(runtimeKind), { immediate: true })

const fieldLabel = (field: RunSettingField) => ({
  workspace: t('runSettings.row.workspace'),
  model: t('runSettings.row.model'),
  thinking: t('runSettings.row.thinking'),
  approval: t('runSettings.row.tools'),
})[field]

const isLocked = (field: RunSettingField) => Boolean(props.locked[field])
const modelOptions = computed<ModelOption[]>(() => buildModelOptions(thinkingSchema.value, props.values.llmConfig, t('chat.modelOption.default')))
const sameJson = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null)
/** With the parent's config known, Thinking counts as customized only when the thinking settings differ. */
const thinkingDiffers = computed(() => props.inheritedLlmConfig === undefined
  || !sameJson(withoutModelOptions(thinkingSchema.value, props.values.llmConfig), withoutModelOptions(thinkingSchema.value, props.inheritedLlmConfig)))
const isCustomized = (field: RunSettingField) => Boolean(props.customized?.[field]) && (field !== 'thinking' || thinkingDiffers.value)
const optionCustomized = (key: string) => Boolean(props.customized?.thinking) && props.inheritedLlmConfig !== undefined && !isLocked('thinking')
  && !sameJson(props.values.llmConfig?.[key], props.inheritedLlmConfig?.[key])
const lockedOptionText = (option: ModelOption) => option.kind === 'toggle'
  ? (option.set ? option.onLabel : t('chat.modelOption.off'))
  : option.valueLabel
/** Thinking's Reset keeps a member's own other settings (e.g. Fast mode); each has its own Reset. */
const resetField = (field: RunSettingField) => {
  if (field !== 'thinking' || props.inheritedLlmConfig === undefined) { emit('reset', field); return }
  let next = withoutModelOptions(thinkingSchema.value, props.inheritedLlmConfig)
  for (const option of modelOptions.value) next = applyModelOption(next, option.key, props.values.llmConfig?.[option.key])
  emit('update:thinking', next)
}
const isInherited = (field: RunSettingField) => Boolean(props.customized) && !isCustomized(field) && !isLocked(field)
  && !(field === 'thinking' && thinkingHidden.value) && !(field === 'approval' && approvalRuntimeLocked.value)
/** A runtime that always auto-approves makes the approval value fixed, not a customization. */
const canReset = (field: RunSettingField) => props.resettable && isCustomized(field) && !isLocked(field)
  && !(field === 'approval' && approvalRuntimeLocked.value)
const lockedAria = (field: RunSettingField, value: string) => t('runSettings.locked.fixedAria', { setting: fieldLabel(field), value })

const modelText = computed(() => presentation.modelLabel(props.values))
const thinkingSchema = computed(() => presentation.thinkingSchema(props.values))
const thinking = computed(() => presentation.thinkingMenu(props.values))
const thinkingHidden = computed(() => thinking.value.mode === 'hidden')
const thinkingSummary = computed(() => thinking.value.mode === 'hidden' ? '' : thinking.value.summary)
const thinkingActive = computed(() => thinking.value.mode !== 'hidden' && thinking.value.active)
const approvalRuntimeLocked = computed(() => isApprovalLockedForRuntime(props.values.runtimeKind))
</script>
