<template>
  <div
    class="space-y-0.5"
    :data-test="`run-settings-card${testSuffix ? `-${testSuffix}` : ''}`"
  >
    <div
      v-for="field in fields"
      :key="field"
      class="flex min-h-[2.25rem] items-center gap-2"
      :data-test="`run-setting-${field}`"
      :data-state="isLocked(field) ? 'locked' : isInherited(field) ? 'inherited' : customized?.[field] ? 'customized' : 'set'"
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
          <p v-if="modelNote" class="px-2 pb-1 text-xs leading-5 text-gray-500" data-test="run-setting-model-note">{{ modelNote }}</p>
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
        @click="emit('reset', field)"
      >
        {{ $t('runSettings.inherited.reset') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import ChatWorkspaceMenu from '~/components/chat/ChatWorkspaceMenu.vue'
import ChatModelMenu from '~/components/chat/ChatModelMenu.vue'
import ChatThinkingControl from '~/components/chat/ChatThinkingControl.vue'
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
  /** Secondary line under the model, e.g. saved settings the model no longer offers. */
  modelNote?: string | null
  /** Saved runs show what differs but offer no per-field reset. */
  resettable?: boolean
  nested?: boolean
  testSuffix?: string
}>(), {
  fields: () => ALL_RUN_SETTING_FIELDS,
  customized: null,
  locked: () => ({}),
  runtimeLocked: false,
  modelUnavailable: false,
  modelNote: null,
  resettable: true,
  nested: false,
  testSuffix: '',
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
const isInherited = (field: RunSettingField) => Boolean(props.customized) && !props.customized?.[field] && !isLocked(field)
  && !(field === 'thinking' && thinkingHidden.value) && !(field === 'approval' && approvalRuntimeLocked.value)
/** A runtime that always auto-approves makes the approval value fixed, not a customization. */
const canReset = (field: RunSettingField) => props.resettable && Boolean(props.customized?.[field]) && !isLocked(field)
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
