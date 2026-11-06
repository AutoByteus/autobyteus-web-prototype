<template>
  <div class="flex h-14 items-center gap-3 border-b border-slate-100" data-testid="mobile-launch-run-options-card">
    <span class="flex-1 text-[0.9375rem] text-slate-500" id="mobile-run-auto-approve-label">Auto approve tools</span>
    <button
      type="button"
      class="relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 disabled:opacity-60"
      :class="checked ? 'bg-blue-600' : 'bg-slate-300'"
      role="switch"
      :aria-checked="checked ? 'true' : 'false'"
      aria-labelledby="mobile-run-auto-approve-label"
      data-testid="mobile-run-auto-approve-tools-switch"
      :disabled="disabled || locked"
      @click="$emit('update:autoExecuteTools', !autoExecuteTools)"
    >
      <span class="inline-block h-6 w-6 rounded-full bg-white shadow transition" :class="checked ? 'translate-x-7' : 'translate-x-1'" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { effectiveAutoExecuteTools, isAutoApproveLockedForRuntime } from '~/utils/agentRunRuntimeDraftPolicy'

const props = withDefaults(defineProps<{
  autoExecuteTools: boolean
  runtimeKind?: string
  disabled?: boolean
}>(), {
  runtimeKind: 'autobyteus',
  disabled: false,
})

defineEmits<{
  'update:autoExecuteTools': [value: boolean]
}>()

const locked = computed(() => isAutoApproveLockedForRuntime(props.runtimeKind))
const checked = computed(() => effectiveAutoExecuteTools(props.runtimeKind, props.autoExecuteTools))
</script>
