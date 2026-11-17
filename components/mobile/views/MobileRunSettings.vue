<template>
  <!-- Settings (autobyteus-458, UIS-011): the open run's runtime and model, changed while the run is stopped. A running
       run shows one "Stop run" button first; a change applies at the next message (not said on the screen). A Team or Org member has its own settings: this screen is always the open member's. -->
  <section class="fixed inset-0 z-20 flex h-[100dvh] flex-col bg-white text-slate-900" data-testid="mobile-run-settings">
    <MobileScreenBar title="Settings" @back="$emit('back')" />

    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4">
      <div class="flex items-center gap-2 py-3" data-testid="mobile-run-settings-subject">
        <span class="h-2.5 w-2.5 flex-shrink-0 rounded-full" :class="dotClass" aria-hidden="true" />
        <span class="min-w-0 flex-1">
          <span class="block truncate text-base font-semibold leading-5">{{ displayName }}</span>
          <span class="block truncate text-xs leading-4 text-slate-500">{{ subtitle }}</span>
        </span>
      </div>

      <button
        v-if="working"
        type="button"
        class="mb-2 h-12 w-full rounded-xl border border-slate-300 bg-white text-base font-semibold text-slate-800 active:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        data-testid="mobile-run-settings-stop"
        @click="stopRun"
      >Stop run</button>

      <MobileRuntimeModelRows
        :runtime-kind="draftRuntime"
        :llm-model-identifier="draftModel"
        :seed-model-identifier="savedModel"
        :llm-config="draftConfig"
        :disabled="working"
        @update:runtime-kind="chooseRuntime"
        @update:llm-model-identifier="chooseModel"
        @update:llm-config="draftConfig = $event"
      />

      <p v-if="error" class="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert" data-testid="mobile-run-settings-error">{{ error }}</p>
    </div>

    <div class="flex-shrink-0 border-t border-slate-100 bg-white px-4 pb-3 pt-2">
      <button
        type="button"
        class="h-14 w-full rounded-2xl bg-blue-600 px-4 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!canSave"
        data-testid="mobile-run-settings-save"
        @click="save"
      >Save</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import MobileScreenBar from '~/components/mobile/MobileScreenBar.vue';
import MobileRuntimeModelRows from '~/components/mobile/newRun/MobileRuntimeModelRows.vue';
import { agentRuntimeName } from '@autobyteus/agent-presentation-contracts';
import { markStopped, saveIsRefused } from '~/prototype/mobile-runs/runSettingsFixture';
import { useTargetConversation } from '~/composables/workspace/useTargetConversation';
import { mobileRunStatusLabel } from '~/utils/mobile/mobileRunStatusLabel';
import { agentStatusDotClass } from '~/utils/workspaceStatusDotPresentation';
import type { ActiveAgentWorkspaceTarget } from '~/types/workspace/activeAgentWorkspaceTarget';

const props = defineProps<{ target: ActiveAgentWorkspaceTarget; parentName: string | null }>();
const emit = defineEmits<{ (event: 'back'): void }>();

const { displayName } = useTargetConversation(() => props.target);

const status = computed(() => props.target.context.state.currentStatus);
/** The node changes a stopped run only: a running or starting run answers "not editable". */
const working = computed(() => ['running', 'initializing'].includes(String(status.value).toLowerCase()));
const dotClass = computed(() => agentStatusDotClass(status.value));
const subtitle = computed(() => {
  const state = mobileRunStatusLabel(status.value);
  return props.parentName ? `${state} · in ${props.parentName}` : state;
});
const stopRun = (): void => { markStopped(props.target.context.state.runId); (props.target.context.state as { currentStatus: string }).currentStatus = 'offline'; };

/** The run's saved selection is the run's own config (what the desktop's Settings of an existing run edits). */
const config = computed(() => props.target.context.config as { runtimeKind: string; llmModelIdentifier: string; llmConfig?: Record<string, unknown> | null });
const savedRuntime = computed(() => config.value.runtimeKind);
const savedModel = computed(() => config.value.llmModelIdentifier);

const draftRuntime = ref(savedRuntime.value);
const draftModel = ref(savedModel.value);
const draftConfig = ref<Record<string, unknown> | null>(config.value.llmConfig ?? null);
const error = ref('');
watch(() => props.target.context.state.runId, () => {
  draftRuntime.value = savedRuntime.value; draftModel.value = savedModel.value; draftConfig.value = config.value.llmConfig ?? null; error.value = '';
});

// A runtime's own models: the rows clear the model when the runtime changes and the model is chosen again.
const chooseRuntime = (kind: string): void => { draftRuntime.value = kind; error.value = ''; };
const chooseModel = (id: string): void => { draftModel.value = id; error.value = ''; };

const changed = computed(() => draftRuntime.value !== savedRuntime.value || draftModel.value !== savedModel.value);
const canSave = computed(() => !working.value && changed.value && Boolean(draftModel.value));
const save = (): void => {
  if (saveIsRefused()) {
    error.value = `“${draftModel.value}” is not offered by ${agentRuntimeName(draftRuntime.value)} now. Refresh the model list and choose again.`;
    return;
  }
  Object.assign(config.value, { runtimeKind: draftRuntime.value, llmModelIdentifier: draftModel.value, llmConfig: draftConfig.value });
  emit('back'); // saved: back to the conversation, nothing else said
};
</script>
