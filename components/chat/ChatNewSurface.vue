<template>
  <div
    class="flex min-w-0 flex-1 flex-col overflow-y-auto bg-white"
    :class="[membersPanelOpen ? 'lg:pr-[var(--members-panel-width)]' : '', membersPanelResizing ? '' : 'transition-[padding] duration-200 ease-out motion-reduce:transition-none']"
    :style="{ '--members-panel-width': `${membersPanelWidth}px` }"
    data-test="chat-new"
  >
    <div class="flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-[14vh] sm:px-6">
      <!-- run-settings-ui-unification (round 4): who you are talking to is the page heading, not a chip in the message box. -->
      <template v-if="identity">
        <!-- Round 6: an avatar only when the target has one, beside the name; no placeholder initials or icons. -->
        <!-- Round 32: the heading is also where you choose who to chat with (Agents and Agent Teams). -->
        <div class="relative -top-6 flex max-w-full items-center justify-center sm:-top-10" data-test="chat-new-target">
          <ChatTargetSwitcher
            :name="identity.name"
            :avatar-url="identity.avatarUrl"
            :options="switcherOptions"
            :current-key="currentTargetKey"
            :disabled="Boolean(draft?.starting)"
            @choose="chooseTarget"
          />
        </div>
        <!-- Clean heading: the general agent keeps its skill and @ hint; others show only a line that adds information. -->
        <p v-if="identity.isDefault" class="mt-2 max-w-xl text-center text-sm text-gray-500" data-test="chat-new-subtitle">
          {{ $t('chat.new.subtitleDefaultBeforeSlash') }}
          <kbd class="rounded border border-gray-200 bg-gray-50 px-1 font-sans text-xs text-gray-600">/</kbd>
          {{ $t('chat.new.subtitleDefaultBetween') }}
          <kbd class="rounded border border-gray-200 bg-gray-50 px-1 font-sans text-xs text-gray-600">@</kbd>
          {{ $t('chat.new.subtitleDefaultAfterAt') }}
        </p>
      </template>
      <template v-else>
        <h1 class="text-center text-[1.75rem] font-semibold tracking-tight text-gray-900">{{ $t('chat.new.heading') }}</h1>
        <p class="mt-2 max-w-xl text-center text-sm text-gray-500" data-test="chat-new-subtitle">
          {{ $t('chat.new.subtitleDefaultBeforeSlash') }}
          <kbd class="rounded border border-gray-200 bg-gray-50 px-1 font-sans text-xs text-gray-600">/</kbd>
          {{ $t('chat.new.subtitleDefaultBetween') }}
          <kbd class="rounded border border-gray-200 bg-gray-50 px-1 font-sans text-xs text-gray-600">@</kbd>
          {{ $t('chat.new.subtitleDefaultAfterAt') }}
        </p>
      </template>

      <div class="mt-8 w-full max-w-3xl">
        <ChatComposer
          v-if="draft && target"
          ref="composerRef"
          :target="target"
          :placeholder="placeholder"
          :skill-options="team ? null : options.skillOptions.value"
          :skills-all-installed="options.skillsAllInstalled.value"
          :target-options="mentionOptions"
          :mention-focused-name="mentionFocusedName"
          :starting="draft.starting"
          :send-blocked-reason="sendBlockedReason"
          autofocus
        >
          <template #footer-left>
            <ChatWorkspaceMenu :workspace="draft.workspace" @select="chatDraftStore.setWorkspace" />
            <ChatApprovalToggle
              :model-value="effectiveAutoExecuteTools(controls.runtimeKind.value, draft.autoExecuteTools)"
              :locked="isAutoApproveLockedForRuntime(controls.runtimeKind.value)"
              @update:model-value="chatDraftStore.setAutoExecuteTools"
            />
          </template>
          <template #footer-right>
            <ChatModelMenu
              :runtime-kind="controls.runtimeKind.value"
              :llm-model-identifier="controls.llmModelIdentifier.value"
              :model-label="controls.modelLabel.value"
              @select="controls.selectModel"
            />
            <ChatThinkingControl
              :schema="controls.thinkingSchema.value"
              :llm-config="controls.llmConfig.value"
              @update="controls.selectThinking"
            />
            <!-- SR-005 (REQ-022): the model's other settings (e.g. Codex Fast mode), one chip each. -->
            <ChatModelOptionControl
              v-for="option in modelOptions"
              :key="option.key"
              :option="option"
              compact-on-phone
              @update="controls.selectThinking(applyModelOption(controls.llmConfig.value, option.key, $event))"
            />
          </template>
        </ChatComposer>

        <!-- Round 17: no "Files are saved in …" line; the workspace control already names the
             workspace and shows its path on hover. Only the starting state is announced here. -->
        <p v-if="draft?.starting" class="mt-2.5 text-center text-xs text-gray-400" data-test="chat-new-hint">
          {{ $t('chat.new.starting', { name: team ? team.name : agentName, runtime: runtimeLabel }) }}
        </p>
        <!-- run-settings-ui-unification (round 2): members follow the composer unless customized here. -->
        <ChatTargetMembers v-if="memberSource && !draft?.starting" :key="memberSource.key" class="mt-2.5" :source="memberSource" @update:open="membersPanelOpen = $event" @update:width="membersPanelWidth = $event" @update:resizing="membersPanelResizing = $event" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ChatComposer from '~/components/chat/ChatComposer.vue'
import ChatWorkspaceMenu from '~/components/chat/ChatWorkspaceMenu.vue'
import ChatApprovalToggle from '~/components/chat/ChatApprovalToggle.vue'
import ChatModelMenu from '~/components/chat/ChatModelMenu.vue'
import ChatThinkingControl from '~/components/chat/ChatThinkingControl.vue'
import ChatModelOptionControl from '~/components/chat/ChatModelOptionControl.vue'
import { applyModelOption, buildModelOptions } from '~/components/chat/chatModelOptions'
import ChatTargetMembers from '~/components/run-settings/ChatTargetMembers.vue'
import ChatTargetSwitcher from '~/components/chat/ChatTargetSwitcher.vue'
import { useRunTargetSwitcher, type RunTargetOption } from '~/composables/runSettings/useRunTargetSwitcher'
import { chatDraftMemberSource } from '~/components/run-settings/memberSettingsSource'
import { useChatDraftModelControls } from '~/components/chat/chatDraftModelControls'
import { createChatDraftComposerTarget } from '~/composables/chat/chatDraftComposerTarget'
import { useChatComposerOptions } from '~/composables/chat/useChatComposerOptions'
import { useChatDraftStore } from '~/stores/chatDraftStore'
import { useAgentTeamDefinitionStore } from '~/stores/agentTeamDefinitionStore'
import { useWorkspaceStore } from '~/stores/workspace'
import { resolveChatLaunchReadiness } from '~/services/chat/chatLaunchService'
import { hasSendableDraft } from '~/services/runSubmission/agentPrimaryAction'
import { runtimeKindToLabel } from '~/types/agent/AgentRunConfig'
import { DEFAULT_CHAT_AGENT_DEFINITION_ID } from '~/utils/chat/chatDefaults'
import { effectiveAutoExecuteTools, isAutoApproveLockedForRuntime } from '~/utils/agentRunRuntimeDraftPolicy'
import { useLocalization } from '~/composables/useLocalization'

const router = useRouter()
const { t } = useLocalization()
const chatDraftStore = useChatDraftStore()
const teamDefinitionStore = useAgentTeamDefinitionStore()
const workspaceStore = useWorkspaceStore()
const composerRef = ref<InstanceType<typeof ChatComposer> | null>(null)

const draft = computed(() => chatDraftStore.draft)
const draftContext = computed(() => draft.value?.context ?? null)
// One composer target per draft identity; a reset draft gets a fresh target.
const target = computed(() => (draft.value
  ? createChatDraftComposerTarget(draft.value, { navigate: (route) => router.push(route) })
  : null))

const agentDefinitionId = computed(() => (draft.value?.target.kind === 'agent' ? draft.value.target.agentDefinitionId : null))
const options = useChatComposerOptions(agentDefinitionId)
const controls = useChatDraftModelControls()
const modelOptions = computed(() => buildModelOptions(controls.thinkingSchema.value, controls.llmConfig.value, t('chat.modelOption.default')))

const team = computed(() => {
  const current = draft.value?.target
  if (current?.kind !== 'team') return null
  return teamDefinitionStore.agentTeamDefinitions.find((entry) => entry.id === current.teamDefinitionId) ?? null
})
// Round 3: the member settings panel docks on the right; the composer moves left to stay visible.
const membersPanelOpen = ref(false)
// Round 16: the panel can be dragged wider; the page makes room for its current width.
const membersPanelWidth = ref(480)
const membersPanelResizing = ref(false)
// SR-003: Agent Orgs are not chat targets (an Org has no recipient); a Team's members are
// customized through the shared members line and drawer.
const memberSource = computed(() => draft.value && team.value ? chatDraftMemberSource(draft.value, {
  setMemberSettings: chatDraftStore.setMemberSettings,
  resetAllMemberSettings: chatDraftStore.resetAllMemberSettings,
}) : null)
const identity = computed(() => {
  if (team.value) {
    return { kind: 'team' as const, isDefault: false, avatarUrl: team.value.avatarUrl ?? null, name: team.value.name }
  }
  // Round 5: the general agent is shown the same way, so every New chat names who it talks to.
  if (agentName.value) {
    return { kind: 'agent' as const, isDefault: isDefaultAgent.value, avatarUrl: options.agentDefinition.value?.avatarUrl || draftContext.value?.config.agentAvatarUrl || null, name: agentName.value }
  }
  return null
})
// Round 9: `@` always brings a collaborator in; who you talk to is set by how the chat started.
// The agent or team already being addressed is not offered again.
const mentionOptions = computed(() => options.targetOptions.value.filter((option) => {
  const current = draft.value?.target
  if (!current) return true
  if (current.kind === 'agent') return !(option.kind === 'agent' && option.id === current.agentDefinitionId)
  if (current.kind === 'team') return !(option.kind === 'team' && option.id === current.teamDefinitionId)
  return true
}))
/** Who receives the message and brings the collaborator in (menu footer). */
const mentionFocusedName = computed(() => {
  if (team.value) return team.value.coordinatorMemberName || team.value.name
  return agentName.value
})
const isDefaultAgent = computed(() => agentDefinitionId.value === DEFAULT_CHAT_AGENT_DEFINITION_ID)
// Round 32/34: the heading switcher lists Agents (Daily Assistant first), Agent Teams and Agent Orgs.
const runTargets = useRunTargetSwitcher()
const switcherOptions = runTargets.options
const currentTargetKey = computed(() => {
  const current = draft.value?.target
  if (!current) return ''
  return current.kind === 'team' ? `team:${current.teamDefinitionId}` : `agent:${current.agentDefinitionId}`
})
const chooseTarget = (option: RunTargetOption) => {
  const current = draft.value
  // An Agent Org has no recipient: it starts on the Org launch page with these settings.
  if (option.kind === 'org') {
    void runTargets.openOrg(option.id, current ? {
      workspace: current.workspace,
      runtimeKind: current.context.config.runtimeKind,
      llmModelIdentifier: current.context.config.llmModelIdentifier,
      llmConfig: current.context.config.llmConfig ?? null,
      autoExecuteTools: current.autoExecuteTools,
    } : null)
    return
  }
  chatDraftStore.setTarget(option.kind === 'team' ? { kind: 'team', teamDefinitionId: option.id } : { kind: 'agent', agentDefinitionId: option.id })
  void nextTick(() => document.querySelector<HTMLTextAreaElement>('[data-test="chat-new"] textarea')?.focus())
}
const agentName = computed(() => options.agentDefinition.value?.name || draftContext.value?.config.agentDefinitionName || '')
const runtimeLabel = computed(() => runtimeKindToLabel(controls.runtimeKind.value))

const placeholder = computed(() => {
  if (team.value) return t('chat.new.placeholderTeam', { team: team.value.name })
  if (!isDefaultAgent.value) return t('chat.new.placeholderAgent', { agent: agentName.value })
  return t('chat.new.placeholderDefault')
})

const sendBlockedReason = computed(() => {
  const current = draft.value
  if (!current || !hasSendableDraft(current.context, { attachmentsAreSendable: true })) return null
  const readiness = resolveChatLaunchReadiness(current)
  return readiness.ready ? null : readiness.reason
})

onMounted(() => {
  chatDraftStore.ensureDraft()
  if (!workspaceStore.workspacesFetched) void workspaceStore.fetchAllWorkspaces().catch(() => undefined)
})
</script>
