<template>
  <form class="flex min-h-full flex-col" data-testid="mobile-run-setup" :inert="creating" :aria-busy="creating" @submit.prevent="createRun">
    <div class="flex-1">
      <MobileLaunchTargetPicker
        v-model="runChoice"
        label="Run"
        placeholder="Choose an agent or team"
        :items="runChoices"
        test-id="mobile-run-target-select"
        item-noun="agents and teams"
      />
      <MobileLaunchWorkspacePicker
        section="picker"
        :model-value="selectedWorkspaceId"
        :items="workspaceChoices"
        :is-refreshing="workspaceRefreshing"
        :is-loading-path="workspacePathLoading"
        :error-message="workspaceError"
        @update:model-value="selectWorkspace"
        @load-path="loadWorkspacePath"
      />

      <button
        type="button"
        class="flex h-14 w-full items-center justify-between text-left text-[0.9375rem] font-semibold text-slate-700 active:bg-slate-50"
        :aria-expanded="moreOpen"
        data-testid="mobile-run-more-options"
        @click="moreOpen = !moreOpen"
      >
        More options
        <Icon icon="heroicons:chevron-down-20-solid" class="h-5 w-5 text-slate-400 transition-transform" :class="moreOpen ? 'rotate-180' : ''" aria-hidden="true" />
      </button>
      <div v-if="moreOpen" data-testid="mobile-run-more-options-panel">
        <MobileLaunchRuntimeModelCard
          v-if="mode === 'agent' && agentConfigForSelectedTarget"
          variant="agent"
          :runtime-kind="agentConfigForSelectedTarget.runtimeKind"
          :llm-model-identifier="agentConfigForSelectedTarget.llmModelIdentifier"
          :seed-model-identifier="agentSeedModelIdentifier"
          :llm-config="agentConfigForSelectedTarget.llmConfig"
          @update:runtime-kind="updateRuntimeKind"
          @update:llm-model-identifier="updateLlmModelIdentifier"
          @update:llm-config="updateLlmConfig"
        />
        <MobileLaunchRuntimeModelCard
          v-else-if="mode === 'team' && teamConfigForSelectedTarget"
          variant="team"
          :runtime-kind="teamConfigForSelectedTarget.rootConfig.runtimeKind"
          :llm-model-identifier="teamConfigForSelectedTarget.rootConfig.llmModelIdentifier"
          :seed-model-identifier="teamSeedModelIdentifier"
          :llm-config="teamConfigForSelectedTarget.rootConfig.llmConfig"
          @update:runtime-kind="updateRuntimeKind"
          @update:llm-model-identifier="updateLlmModelIdentifier"
          @update:llm-config="updateLlmConfig"
        />
        <MobileLaunchRunOptionsCard
          v-if="activeConfig"
          :auto-execute-tools="autoExecuteTools"
          :runtime-kind="'rootConfig' in activeConfig ? activeConfig.rootConfig.runtimeKind : activeConfig.runtimeKind"
          @update:auto-execute-tools="setAutoExecuteTools"
        />
        <MobileLaunchWorkspacePicker
          section="path"
          :model-value="selectedWorkspaceId"
          :items="workspaceChoices"
          :is-refreshing="workspaceRefreshing"
          :is-loading-path="workspacePathLoading"
          :error-message="workspaceError"
          @load-path="loadWorkspacePath"
        />
      </div>

      <div v-if="draftAttachments.length" class="mt-3 flex flex-wrap gap-1.5" data-testid="mobile-run-setup-context-count">
        <span
          v-for="attachment in draftAttachments"
          :key="attachment.id"
          class="max-w-full truncate rounded-full border border-blue-200 bg-white px-2.5 py-1 text-xs font-semibold text-blue-800"
          data-testid="mobile-run-setup-context-item"
        >{{ attachment.displayName }}</span>
      </div>
      <p v-if="!canLaunch" class="mt-3 text-sm font-semibold text-amber-700" data-testid="mobile-run-setup-readiness">{{ blockingIssue }}</p>
      <p v-if="error" class="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" data-testid="mobile-run-setup-error">{{ error }}</p>
    </div>

    <div class="sticky bottom-0 -mx-4 bg-white px-4 pb-1 pt-2">
      <button
        type="submit"
        class="h-14 w-full rounded-2xl bg-blue-600 px-4 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!canLaunch || creating"
        data-testid="mobile-run-launch"
      >
        {{ creating ? 'Creating…' : 'Create run' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { Icon } from '@iconify/vue'
import MobileLaunchRunOptionsCard from '~/components/mobile/MobileLaunchRunOptionsCard.vue'
import MobileLaunchRuntimeModelCard from '~/components/mobile/MobileLaunchRuntimeModelCard.vue'
import MobileLaunchTargetPicker from '~/components/mobile/MobileLaunchTargetPicker.vue'
import MobileLaunchWorkspacePicker from '~/components/mobile/MobileLaunchWorkspacePicker.vue'
import { useMobileRunSetupController } from '~/composables/mobile/useMobileRunSetupController'
import type { MobileRunSetupIntent, MobileWorkContext } from '~/types/mobileWork'

const props = defineProps<{
  context: MobileWorkContext | null
  setupIntent?: MobileRunSetupIntent | null
}>()

const emit = defineEmits<{
  cancel: []
  launched: [context: MobileWorkContext]
  setupIntentConsumed: [revision: number]
}>()

const {
  mode,
  selectedAgentId,
  selectedTeamId,
  selectedWorkspaceId,
  creating,
  error,
  draftAttachments,
  agentChoices,
  teamChoices,
  workspaceChoices,
  workspaceError,
  workspaceRefreshing,
  workspacePathLoading,
  agentConfigForSelectedTarget,
  agentSeedModelIdentifier,
  teamConfigForSelectedTarget,
  teamSeedModelIdentifier,
  activeConfig,
  canLaunch,
  blockingIssue,
  autoExecuteTools,
  setMode,
  selectWorkspace,
  setAutoExecuteTools,
  updateRuntimeKind,
  updateLlmModelIdentifier,
  updateLlmConfig,
  loadWorkspacePath,
  createRun,
} = useMobileRunSetupController({
  context: toRef(props, 'context'),
  setupIntent: toRef(props, 'setupIntent'),
  onLaunched: (context) => emit('launched', context),
  onSetupIntentConsumed: (revision) => emit('setupIntentConsumed', revision),
})

const moreOpen = ref(false)

/** One list for starting: agents and teams together (a team is one more thing you can start). */
const runChoices = computed(() => [
  ...agentChoices.value.map((item) => ({ ...item, id: `agent:${item.id}`, group: 'Agents' })),
  ...teamChoices.value.map((item) => ({ ...item, id: `team:${item.id}`, group: 'Teams' })),
])
const runChoice = computed({
  get: () => (mode.value === 'agent' ? (selectedAgentId.value ? `agent:${selectedAgentId.value}` : '') : (selectedTeamId.value ? `team:${selectedTeamId.value}` : '')),
  set: (value: string) => {
    const [kind, ...rest] = value.split(':')
    const id = rest.join(':')
    if (kind === 'team') {
      setMode('team')
      selectedTeamId.value = id
      selectedAgentId.value = ''
    } else {
      setMode('agent')
      selectedAgentId.value = id
      selectedTeamId.value = ''
    }
  },
})

// Start from what is most likely: the Project Task Manager (else the first agent) and the first folder.
watch([agentChoices, workspaceChoices], () => {
  if (!selectedAgentId.value && !selectedTeamId.value && !props.setupIntent && agentChoices.value.length) {
    selectedAgentId.value = (agentChoices.value.find((item) => item.id === 'project-task-manager') ?? agentChoices.value[0]).id
  }
  if (!selectedWorkspaceId.value && workspaceChoices.value.length) selectWorkspace(workspaceChoices.value[0].id)
}, { immediate: true })
</script>
