<template>
  <div
    class="flex min-w-0 flex-1 flex-col overflow-y-auto bg-white transition-[padding] duration-200 ease-out motion-reduce:transition-none"
    :class="membersPanelOpen ? 'lg:pr-[30rem]' : ''"
    data-test="chat-new"
  >
    <div class="flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-[14vh] sm:px-6">
      <!-- run-settings-ui-unification (round 4): who you are talking to is the page heading, not a chip in the message box. -->
      <template v-if="identity">
        <!-- Round 6: an avatar only when the target has one, beside the name; no placeholder initials or icons. -->
        <div class="relative -top-6 flex max-w-full items-center justify-center gap-3 sm:-top-10" data-test="chat-new-target">
          <img
            v-if="identity.avatarUrl"
            :src="identity.avatarUrl"
            alt=""
            class="h-10 w-10 flex-shrink-0 rounded-full object-cover"
            data-test="chat-new-target-avatar"
          >
          <h1 class="min-w-0 break-words text-center text-[1.5rem] font-semibold leading-tight tracking-tight text-gray-900 sm:text-[1.75rem]" data-test="chat-new-target-name">{{ identity.name }}</h1>
        </div>
        <!-- Clean heading: the general agent keeps its skill and @ hint; others show only a line that adds information. -->
        <p v-if="identity.isDefault" class="mt-2 max-w-xl text-center text-sm text-gray-500" data-test="chat-new-subtitle">
          {{ $t('chat.new.subtitleDefaultBeforeSlash') }}
          <kbd class="rounded border border-gray-200 bg-gray-50 px-1 font-sans text-xs text-gray-600">/</kbd>
          {{ $t('chat.new.subtitleDefaultBetween') }}
          <kbd class="rounded border border-gray-200 bg-gray-50 px-1 font-sans text-xs text-gray-600">@</kbd>
          {{ $t('chat.new.subtitleDefaultAfterAt') }}
        </p>
        <p v-else-if="identity.subtitle" class="mt-2 max-w-xl text-center text-sm text-gray-500" data-test="chat-new-subtitle">{{ identity.subtitle }}</p>
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
          :skill-options="team || org ? null : options.skillOptions.value"
          :skills-all-installed="options.skillsAllInstalled.value"
          :target-options="options.targetOptions.value"
          :starting="draft.starting"
          :send-blocked-reason="sendBlockedReason"
          autofocus
          @select-target="chatDraftStore.setTarget"
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
          </template>
        </ChatComposer>

        <p class="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs text-gray-400" data-test="chat-new-hint">
          <template v-if="draft?.starting">
            {{ $t('chat.new.starting', { name: org ? org.name : team ? team.name : agentName, runtime: runtimeLabel }) }}
          </template>
          <template v-else>
            <Icon icon="heroicons:folder" class="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            <span class="truncate">{{ workspaceHint }}</span>
          </template>
        </p>
        <!-- run-settings-ui-unification (round 2): members follow the composer unless customized here. -->
        <ChatTargetMembers v-if="draft && (team || org) && !draft.starting" :key="draft.context.state.runId + (org?.id ?? team?.id ?? '')" class="mt-1.5" :draft="draft" @update:open="membersPanelOpen = $event" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import ChatComposer from '~/components/chat/ChatComposer.vue'
import ChatWorkspaceMenu from '~/components/chat/ChatWorkspaceMenu.vue'
import ChatApprovalToggle from '~/components/chat/ChatApprovalToggle.vue'
import ChatModelMenu from '~/components/chat/ChatModelMenu.vue'
import ChatThinkingControl from '~/components/chat/ChatThinkingControl.vue'
import ChatTargetMembers from '~/components/run-settings/ChatTargetMembers.vue'
import { useAgentOrgDefinitionStore } from '~/stores/agentOrgDefinitionStore'
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

const team = computed(() => {
  const current = draft.value?.target
  if (current?.kind !== 'team') return null
  return teamDefinitionStore.agentTeamDefinitions.find((entry) => entry.id === current.teamDefinitionId) ?? null
})
// Round 3: the member settings panel docks on the right; the composer moves left to stay visible.
const membersPanelOpen = ref(false)
const orgDefinitionStore = useAgentOrgDefinitionStore()
const org = computed(() => {
  const current = draft.value?.target
  if (current?.kind !== 'org') return null
  return orgDefinitionStore.byId(current.orgDefinitionId)
})
const identity = computed(() => {
  if (org.value) {
    return { kind: 'org' as const, isDefault: false, avatarUrl: org.value.avatarUrl ?? null, name: org.value.name, kindLabel: t('runSettings.kind.orgPlain'), subtitle: '' }
  }
  if (team.value) {
    return { kind: 'team' as const, isDefault: false, avatarUrl: team.value.avatarUrl ?? null, name: team.value.name, kindLabel: t('runSettings.kind.teamPlain'), subtitle: '' }
  }
  // Round 5: the general agent is shown the same way, so every New chat names who it talks to.
  if (agentName.value) {
    return { kind: 'agent' as const, isDefault: isDefaultAgent.value, avatarUrl: options.agentDefinition.value?.avatarUrl || draftContext.value?.config.agentAvatarUrl || null, name: agentName.value, kindLabel: t('runSettings.kind.agent'), subtitle: '' }
  }
  return null
})
const isDefaultAgent = computed(() => agentDefinitionId.value === DEFAULT_CHAT_AGENT_DEFINITION_ID)
const agentName = computed(() => options.agentDefinition.value?.name || draftContext.value?.config.agentDefinitionName || '')
const runtimeLabel = computed(() => runtimeKindToLabel(controls.runtimeKind.value))

const placeholder = computed(() => {
  if (org.value) return t('chat.new.placeholderOrg', { org: org.value.name })
  if (team.value) return t('chat.new.placeholderTeam', { team: team.value.name })
  if (!isDefaultAgent.value) return t('chat.new.placeholderAgent', { agent: agentName.value })
  return t('chat.new.placeholderDefault')
})

const selectedWorkspace = computed(() => {
  const workspace = draft.value?.workspace
  if (!workspace) return null
  if (workspace.kind === 'folder') {
    const name = workspace.rootPath.replace(/[/\\]+$/, '').split(/[/\\]/).pop() || workspace.rootPath
    return { isTemp: false, name, path: workspace.rootPath }
  }
  const info = workspaceStore.workspaces[workspace.workspaceId]
  const isTemp = !info || Boolean(info.isTemp) || info.workspaceId === workspaceStore.tempWorkspaceId
  return { isTemp, name: info?.name ?? '', path: info?.absolutePath ?? '' }
})
const workspaceHint = computed(() => {
  const workspace = selectedWorkspace.value
  if (!workspace) return ''
  return workspace.isTemp
    ? t('chat.new.hintTemp', { path: workspace.path })
    : t('chat.new.hintWorkspace', { workspace: workspace.name, path: workspace.path })
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
