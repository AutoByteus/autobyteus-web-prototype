<template>
  <!-- Settings (autobyteus-458 and 506, UIS-011): the open run's runtime and model, changed while the run is stopped, and the
       phone's text size (one setting for every run). A running
       run says "Stop run" first; a model whose usage limit is out is marked in its list; the change applies when the next
       message is sent. A Team or Org member has its own settings: this screen is always the open member's. -->
  <section class="fixed inset-0 z-20 flex h-[100dvh] flex-col bg-white text-slate-900" data-testid="mobile-run-settings">
    <MobileScreenBar title="Settings" @back="$emit('back')" />

    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4">
      <h2 class="pt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">This run</h2>
      <div class="flex items-center gap-2 py-3" data-testid="mobile-run-settings-subject">
        <span class="h-2.5 w-2.5 flex-shrink-0 rounded-full" :class="dotClass" aria-hidden="true" />
        <span class="min-w-0 flex-1">
          <span class="block truncate text-base font-semibold leading-5">{{ displayName }}</span>
          <span class="block truncate text-xs leading-4 text-slate-500">{{ subtitle }}</span>
        </span>
      </div>
      <p v-if="parentName" class="-mt-1 pb-2 text-[0.8125rem] leading-5 text-slate-500" data-testid="mobile-run-settings-member-note">
        These settings are for {{ displayName }} only. Open another member from the run list to change theirs.
      </p>

      <div v-if="working" class="mb-2 rounded-xl border border-amber-200 bg-amber-50 p-3" role="status" data-testid="mobile-run-settings-running">
        <p class="text-[0.9375rem] font-semibold text-amber-900">This run is working</p>
        <p class="mt-0.5 text-sm text-amber-900">Stop it to change its runtime and model. Everything in the conversation stays.</p>
        <button
          type="button"
          class="mt-3 h-12 w-full rounded-xl border border-amber-300 bg-white text-base font-semibold text-amber-900 active:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          data-testid="mobile-run-settings-stop"
          @click="stopRun"
        >Stop run</button>
      </div>

      <MobileChoiceSheet
        :model-value="draftRuntime"
        label="Runtime"
        :items="runtimeItems"
        :disabled="working"
        test-id="mobile-run-settings-runtime"
        item-noun="runtimes"
        @update:model-value="chooseRuntime"
      />
      <MobileChoiceSheet
        :model-value="draftModel"
        label="Model"
        placeholder="Choose"
        :items="modelItems"
        :disabled="working"
        test-id="mobile-run-settings-model"
        item-noun="models"
        @update:model-value="chooseModel"
      >
        <template #footer>
          <ModelListRefreshControl touch :refreshing="false" :failed="false" @refresh="refreshModels" />
        </template>
      </MobileChoiceSheet>

      <p v-if="currentLimit && !working && !changed" class="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900" data-testid="mobile-run-settings-limit">
        <Icon icon="heroicons:clock-20-solid" class="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" aria-hidden="true" />
        <span>{{ currentModelName }} has no usage left{{ currentLimit.until ? ` until ${currentLimit.until}` : '' }}. Choose another model to carry on.</span>
      </p>

      <p v-if="error" class="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert" data-testid="mobile-run-settings-error">{{ error }}</p>
      <div v-if="saved" class="mt-3 rounded-xl border border-green-200 bg-green-50 p-3" role="status" data-testid="mobile-run-settings-saved">
        <p class="flex items-center gap-2 text-[0.9375rem] font-semibold text-green-900">
          <Icon icon="heroicons:check-circle-20-solid" class="h-5 w-5 text-green-600" aria-hidden="true" />Saved
        </p>
        <p class="mt-0.5 text-sm text-green-900">{{ displayName }} will use {{ runtimeOf(current.runtime)?.name }} · {{ modelOf(current.runtime, current.model)?.name }} when you send your next message, for example “continue”.</p>
        <button type="button" class="mt-3 h-12 w-full rounded-xl bg-white text-base font-semibold text-green-900 ring-1 ring-green-300 active:bg-green-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="mobile-run-settings-to-conversation" @click="$emit('back')">Back to the conversation</button>
      </div>
      <p v-else class="mt-3 flex items-start gap-2 text-[0.8125rem] leading-5 text-slate-500" data-testid="mobile-run-settings-next-message">
        <Icon icon="heroicons:information-circle-20-solid" class="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
        A change applies when you send your next message.
      </p>
      <button
        type="button"
        class="mt-4 h-12 w-full rounded-xl bg-blue-600 px-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
        :disabled="!canSave"
        data-testid="mobile-run-settings-save"
        @click="save"
      >Save</button>

      <h2 class="mt-8 text-xs font-semibold uppercase tracking-wide text-slate-500">Text size</h2>
      <p class="mt-1 text-[0.8125rem] leading-5 text-slate-500">For the conversation of every run on this phone.</p>
      <div class="mt-3 grid grid-cols-4 gap-2" role="group" aria-label="Text size" data-testid="mobile-text-size">
        <button
          v-for="(size, index) in PHONE_TEXT_SIZES"
          :key="size.id"
          type="button"
          class="flex h-14 flex-col items-center justify-center rounded-xl border leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :class="textSize.sizeId.value === size.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700 active:bg-slate-100'"
          :aria-pressed="textSize.sizeId.value === size.id"
          :data-testid="`mobile-text-size-${size.id}`"
          @click="textSize.set(size.id)"
        >
          <span class="font-medium" :style="{ fontSize: `${14 + index * 4}px` }" aria-hidden="true">A</span>
          <span class="mt-1.5 text-[0.6875rem]">{{ size.label }}</span>
        </button>
      </div>
      <p class="mt-3 rounded-xl bg-slate-50 p-3 text-slate-800" :style="{ fontSize: `${textSize.px.value}px`, lineHeight: 1.5 }" data-testid="mobile-text-size-sample">
        The pilot customers get three changes that matter to them, and one date that moved.
      </p>
      <div class="h-6" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { PHONE_TEXT_SIZES, usePhoneTextSize } from '~/composables/mobile/usePhoneTextSize';
import MobileScreenBar from '~/components/mobile/MobileScreenBar.vue';
import MobileChoiceSheet from '~/components/mobile/newRun/MobileChoiceSheet.vue';
import ModelListRefreshControl from '~/components/common/ModelListRefreshControl.vue';
import { RUN_RUNTIMES, markStopped, modelOf, runtimeBlocked, runtimeOf, useRunModelSelection } from '~/prototype/mobile-runs/runModelFixture';
import { useTargetConversation } from '~/composables/workspace/useTargetConversation';
import { mobileRunStatusLabel } from '~/utils/mobile/mobileRunStatusLabel';
import { agentStatusDotClass } from '~/utils/workspaceStatusDotPresentation';
import type { ActiveAgentWorkspaceTarget } from '~/types/workspace/activeAgentWorkspaceTarget';

const props = defineProps<{ target: ActiveAgentWorkspaceTarget; parentName: string | null }>();
defineEmits<{ (event: 'back'): void }>();

const textSize = usePhoneTextSize();
const { displayName } = useTargetConversation(() => props.target);
const { current, save: saveSelection, refreshList, isOffered } = useRunModelSelection(() => props.target.context.state.runId);

const status = computed(() => props.target.context.state.currentStatus);
/** The node changes a stopped run only: a running or starting run answers "not editable". */
const working = computed(() => ['running', 'initializing'].includes(String(status.value).toLowerCase()));
const dotClass = computed(() => agentStatusDotClass(status.value));
const subtitle = computed(() => {
  const state = mobileRunStatusLabel(status.value);
  return props.parentName ? `${state} · in ${props.parentName}` : state;
});
const stopRun = (): void => { markStopped(props.target.context.state.runId); (props.target.context.state as { currentStatus: string }).currentStatus = 'offline'; };

const draftRuntime = ref(current.value.runtime);
const draftModel = ref(current.value.model);
const error = ref('');
const saved = ref(false);
watch(() => props.target.context.state.runId, () => { draftRuntime.value = current.value.runtime; draftModel.value = current.value.model; error.value = ''; saved.value = false; });

const runtimeItems = computed(() => RUN_RUNTIMES.map((runtime) => {
  const blocked = runtimeBlocked(runtime.id);
  return { id: runtime.id, label: runtime.name, unavailable: blocked ? `Limit reached${blocked.until ? ` · back at ${blocked.until}` : ''}` : undefined };
}));
const modelItems = computed(() => (runtimeOf(draftRuntime.value)?.models ?? [])
  .filter((model) => isOffered(draftRuntime.value, model))
  .map((model) => ({
    id: model.id, label: model.name, detail: model.detail,
    unavailable: model.limit ? `Limit reached${model.limit.until ? ` · back at ${model.limit.until}` : ''}` : undefined,
  })));
const currentModel = computed(() => modelOf(current.value.runtime, current.value.model));
const currentModelName = computed(() => currentModel.value?.name ?? '');
const currentLimit = computed(() => currentModel.value?.limit ?? null);

const chooseRuntime = (id: string): void => {
  draftRuntime.value = id;
  draftModel.value = ''; // a runtime's own models: the model is chosen again
  error.value = ''; saved.value = false;
};
const chooseModel = (id: string): void => { draftModel.value = id; error.value = ''; saved.value = false; };
const refreshModels = (): void => {
  refreshList(draftRuntime.value);
  if (draftModel.value && !modelItems.value.some((item) => item.id === draftModel.value)) draftModel.value = '';
  error.value = '';
};

const changed = computed(() => draftRuntime.value !== current.value.runtime || draftModel.value !== current.value.model);
const canSave = computed(() => !working.value && changed.value && Boolean(draftModel.value));
const save = (): void => {
  const outcome = saveSelection(draftRuntime.value, draftModel.value);
  if (outcome.ok) { error.value = ''; saved.value = true; } else { error.value = outcome.message; saved.value = false; }
};
</script>
