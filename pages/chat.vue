<template>
  <div class="flex h-full bg-white" data-test="chat-page">
    <!-- New chat -->
    <div v-if="!activeId" class="flex min-w-0 flex-1 flex-col overflow-y-auto" data-test="chat-new">
      <div class="flex flex-1 flex-col items-center justify-center px-4 pb-[14vh] pt-10 sm:px-6">
        <h1 class="text-center text-[1.75rem] font-semibold tracking-tight text-gray-900">What should we work on?</h1>
        <p v-if="draftTeam" class="mt-2 max-w-xl text-center text-sm text-gray-500">
          Your message goes to {{ draftTeam.name }}’s coordinator.
        </p>
        <p v-else-if="!isAssistantDraft" class="mt-2 max-w-xl text-center text-sm text-gray-500">
          Chat with {{ draftAgent.name }}, using its own tools and skills.
        </p>
        <p v-else class="mt-2 max-w-xl text-center text-sm text-gray-500">
          All your skills are available. Type <kbd class="rounded border border-gray-200 bg-gray-50 px-1 font-sans text-xs text-gray-600">/</kbd> to use a skill, or <kbd class="rounded border border-gray-200 bg-gray-50 px-1 font-sans text-xs text-gray-600">@</kbd> to chat with an agent or team.
        </p>
        <div class="mt-8 w-full max-w-3xl">
          <ChatComposer
            ref="newComposerRef"
            v-model="state.draft.text"
            v-model:skills="state.draft.skills"
            :available-skills="draftTeam ? [] : draftAgent.skills"
            v-model:attachments="state.draft.attachments"
            size="large"
            autofocus
            mentions
            :placeholder="draftTeam ? `Message ${draftTeam.name}…` : isAssistantDraft ? 'Ask anything · / for skills · @ for an agent or team' : `Ask ${draftAgent.name} anything…`"
            :starting="state.starting"
            :send-blocked-reason="draftBlockedReason"
            @send="startChat"
            @select-target="onSelectTarget"
          >
            <template v-if="draftTeam" #chips>
              <span class="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 py-0.5 pl-1 pr-1 text-xs font-medium text-gray-700" data-test="chat-team-chip">
                <span class="inline-flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white text-[0.5rem] font-semibold text-slate-600">{{ draftTeam.initials }}</span>
                {{ draftTeam.name }}
                <button type="button" class="rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700" :aria-label="`Chat with the assistant instead of ${draftTeam.name}`" title="Use the assistant instead" @click="chat.setDraftAgent(CHAT_ASSISTANT_ID)">
                  <ChatGlyph name="x" class="h-3 w-3" />
                </button>
              </span>
            </template>
            <template v-else-if="!isAssistantDraft" #chips>
              <span class="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 py-0.5 pl-1 pr-1 text-xs font-medium text-gray-700" data-test="chat-agent-chip">
                <span class="inline-flex h-4 w-4 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-[0.5rem] font-semibold text-slate-600">{{ draftAgent.initials }}</span>
                {{ draftAgent.name }}
                <button type="button" class="rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700" :aria-label="`Chat with the assistant instead of ${draftAgent.name}`" title="Use the assistant instead" @click="chat.setDraftAgent(CHAT_ASSISTANT_ID)">
                  <ChatGlyph name="x" class="h-3 w-3" />
                </button>
              </span>
            </template>
            <template #left>
              <ChatWorkspacePicker :workspace-id="state.draft.workspaceId" @select="(id) => (state.draft.workspaceId = id)" />
              <ChatAutoApproveToggle v-model="state.draft.autoApprove" />
            </template>
            <template #right>
              <ChatModelPicker
                :runtime="state.draft.runtime"
                :model-id="state.draft.modelId"
                :thinking="state.draft.thinking"
                @select="chat.setDraftCombo"
              />
              <ChatEffortPicker
                :model-id="state.draft.modelId"
                :thinking="state.draft.thinking"
                @select="(level) => (state.draft.thinking = level)"
              />
            </template>
          </ChatComposer>
          <p class="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs text-gray-400" data-test="chat-new-hint">
            <template v-if="state.starting">
              Starting {{ draftTeam ? draftTeam.name : draftAgent.name }} on {{ draftRuntime.label }}…
            </template>
            <template v-else-if="draftTeam">
              <span data-test="chat-team-note">All members use this model, the {{ draftWorkspace.isTemp ? 'temp workspace' : draftWorkspace.name }} and this approval setting. For per-member setup, start it from
                <NuxtLink to="/agent-teams?view=team-list" class="font-medium text-blue-700 hover:underline">Agent Teams</NuxtLink>.</span>
            </template>
            <template v-else>
              <ChatGlyph name="folder" class="h-3.5 w-3.5" />
              <span class="truncate">Files are saved in {{ draftWorkspace.isTemp ? 'the temp workspace' : draftWorkspace.name }} · {{ draftWorkspace.path }}</span>
            </template>
          </p>
        </div>
      </div>
    </div>

    <!-- Missing chat -->
    <div v-else-if="!activeChat" class="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center" data-test="chat-missing">
      <p class="text-base font-semibold text-gray-800">This chat no longer exists</p>
      <NuxtLink to="/chat" class="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">New chat</NuxtLink>
    </div>

    <!-- Active chat: the product's workspace frame (same right tabs column, strip,
         resize handle and drawer as the Agent Team / Agent Org views); the chat
         column is its center pane. -->
    <WorkspaceAdaptiveLayout v-else :show-file-content="false" data-test="chat-run-frame">
      <template #center>
        <div class="flex h-full min-w-0 flex-col bg-white" data-test="chat-active">
          <!-- Same header structure and styling as the product run views. -->
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-3 py-2 sm:px-4" data-test="chat-run-header">
            <div class="flex h-10 min-w-0 flex-1 items-center space-x-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-[0.625rem] font-semibold tracking-wide text-slate-600">{{ activeAgent.initials }}</div>
              <h4 class="max-w-[45%] shrink-0 truncate text-base font-medium text-gray-800" :title="activeChat.title" data-test="chat-title">{{ activeChat.title }}</h4>
              <AgentStatusDisplay class="flex-shrink-0" :status="activeChat.status === 'running' ? 'running' : activeChat.active ? 'idle' : 'offline'" data-test="chat-run-status" />
              <p
                class="hidden min-w-0 flex-1 truncate border-l border-gray-200 pl-3 text-sm text-gray-500 md:block"
                :title="`${activeAgent.name} · ${activeWorkspace.name} (${activeWorkspace.path}) · ${activeChat.autoApprove === false ? 'Ask first' : 'Auto-approve'}`"
                data-test="chat-run-meta"
              >
                <span>{{ activeAgent.name }}</span>
                <span class="mx-1.5 text-gray-300">·</span>
                <ChatGlyph name="folder" class="-mt-0.5 mr-1 inline h-4 w-4 align-middle" />
                <span>{{ activeWorkspace.name }}</span>
                <span class="mx-1.5 text-gray-300">·</span>
                <span
                  :class="activeChat.autoApprove === false ? 'text-amber-700' : ''"
                  data-test="chat-header-approval"
                ><ChatGlyph :name="activeChat.autoApprove === false ? 'shield-hand' : 'shield-check'" class="-mt-0.5 mr-1 inline h-4 w-4 align-middle" />{{ activeChat.autoApprove === false ? 'Ask first' : 'Auto-approve' }}</span>
              </p>
            </div>
          </div>

          <div ref="scrollRef" class="min-h-0 flex-1 overflow-y-auto" data-test="chat-messages">
            <div class="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6">
              <template v-for="message in activeChat.messages" :key="message.id">
                <div v-if="message.role === 'user'" class="flex items-start gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-sky-200 bg-white">
                    <ChatGlyph name="person" class="h-8 w-8 text-sky-600" />
                  </div>
                  <div class="min-w-0 flex-1 pt-1.5">
                    <div
                      v-if="message.skills?.length"
                      class="group/skills relative mb-1.5 flex flex-wrap gap-1.5"
                      data-test="chat-message-skills"
                      tabindex="0"
                      :aria-describedby="`sent-as-${message.id}`"
                    >
                      <span v-for="name in message.skills" :key="name" class="inline-flex cursor-default items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 text-xs font-medium text-indigo-700">
                        <Icon icon="heroicons:sparkles" class="h-3.5 w-3.5" />/{{ name }}
                      </span>
                      <div
                        :id="`sent-as-${message.id}`"
                        role="tooltip"
                        data-test="chat-sent-as"
                        class="pointer-events-none absolute left-0 top-full z-20 mt-1.5 w-max max-w-md rounded-md bg-gray-900 px-2.5 py-2 text-xs leading-5 text-gray-100 opacity-0 shadow-lg transition-opacity duration-100 group-hover/skills:opacity-100 group-focus/skills:opacity-100"
                      >
                        <span class="block text-[0.6875rem] font-medium uppercase tracking-wide text-gray-400">Sent to the agent as</span>
                        <span class="block whitespace-pre-wrap">{{ message.sentText }}</span>
                      </div>
                    </div>
                    <div v-if="message.text" class="whitespace-pre-wrap break-words leading-6 text-gray-900">{{ message.text }}</div>
                    <div v-if="message.attachments?.length" class="mt-2" data-test="chat-message-attachments">
                      <p class="text-xs font-medium text-gray-500">Context files</p>
                      <ul class="mt-1 flex flex-wrap gap-2">
                        <li v-for="item in message.attachments" :key="item.id">
                          <span v-if="item.previewUrl" class="block h-12 w-12 overflow-hidden rounded-md border border-sky-200 bg-sky-50"><img :src="item.previewUrl" :alt="item.name" class="h-full w-full object-cover"></span>
                          <span v-else class="inline-block max-w-full truncate rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-xs text-sky-700">{{ item.name }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div v-else-if="message.role === 'assistant'" class="flex items-start gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                    <span class="text-xs font-semibold tracking-wide text-slate-600">{{ activeAgent.initials }}</span>
                  </div>
                  <div class="min-w-0 flex-1 whitespace-pre-wrap break-words pt-1.5 leading-6 text-gray-900">
                    {{ message.text }}<span v-if="message.streaming" class="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-gray-400"></span>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="mx-auto w-full max-w-3xl flex-shrink-0 px-4 pb-4 sm:px-6">
            <ChatComposer
              v-model="followUp"
              v-model:skills="followUpSkills"
              :available-skills="activeAgent.skills"
              v-model:attachments="followUpAttachments"
              :placeholder="activeAgent.id === CHAT_ASSISTANT_ID ? 'Reply, or type / to use a skill' : `Message ${activeAgent.name}…`"
              :running="activeChat.status === 'running'"
              @send="sendFollowUp"
              @stop="chat.stopChat(activeChat.id)"
            >
              <template #right>
                <ChatModelPicker
                  :runtime="activeChat.runtime"
                  :model-id="activeChat.modelId"
                  :thinking="activeChat.thinking"
                  locked-runtime
                  :locked-reason="activeChat.active ? LIVE_RUN_LOCK : null"
                  @select="(combo) => chat.switchChatModel(activeChat!.id, combo)"
                />
                <ChatEffortPicker
                  :model-id="activeChat.modelId"
                  :thinking="activeChat.thinking"
                  :locked-reason="activeChat.active ? LIVE_RUN_LOCK : null"
                  @select="(level) => chat.switchChatModel(activeChat!.id, { runtime: activeChat!.runtime, modelId: activeChat!.modelId, thinking: level })"
                />
              </template>
            </ChatComposer>
          </div>
        </div>
      </template>
    </WorkspaceAdaptiveLayout>

    <div
      v-if="state.toast"
      role="status"
      class="pointer-events-none fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white shadow-lg"
      data-test="chat-toast"
    >{{ state.toast }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { CHAT_ASSISTANT_ID, type ChatAttachment } from '~/prototype/chat/chat-fixtures'
import ChatComposer from '~/components/chat/ChatComposer.vue'
import ChatGlyph from '~/components/chat/ChatGlyph.vue'
import ChatModelPicker from '~/components/chat/ChatModelPicker.vue'
import ChatEffortPicker from '~/components/chat/ChatEffortPicker.vue'
import WorkspaceAdaptiveLayout from '~/components/layout/WorkspaceAdaptiveLayout.vue'
import AgentStatusDisplay from '~/components/workspace/agent/AgentStatusDisplay.vue'
import ChatWorkspacePicker from '~/components/chat/ChatWorkspacePicker.vue'
import ChatAutoApproveToggle from '~/components/chat/ChatAutoApproveToggle.vue'
import { findAgent, findModel, findRuntime, findTeam, usePrototypeChat } from '~/composables/chat/usePrototypeChat'

const chat = usePrototypeChat()
const { state } = chat
const route = useRoute()
const router = useRouter()

const activeId = computed(() => (typeof route.query.id === 'string' ? route.query.id : null))
const activeChat = computed(() => state.chats.find((item) => item.id === activeId.value) ?? null)
const activeAgent = computed(() => findAgent(activeChat.value?.agentId ?? state.draft.agentId))
const activeWorkspace = computed(() => chat.findWorkspace(activeChat.value?.workspaceId ?? state.draft.workspaceId))

const draftAgent = computed(() => findAgent(state.draft.agentId))
const draftRuntime = computed(() => findRuntime(state.draft.runtime))
const draftWorkspace = computed(() => chat.findWorkspace(state.draft.workspaceId))
const draftBlockedReason = computed(() => {
  if (!state.draft.text.trim() && !state.draft.skills.length) return null
  if (!draftRuntime.value.enabled) return `${draftRuntime.value.label} is unavailable. Choose another runtime.`
  if (!findModel(state.draft.modelId)) return 'Choose a model to start.'
  return null
})

const draftTeam = computed(() => findTeam(state.draft.teamId))
const LIVE_RUN_LOCK = 'Locked while the run is live. Terminate the run from the Workspaces tree to change the model or thinking.'
const isAssistantDraft = computed(() => state.draft.agentId === CHAT_ASSISTANT_ID && !state.draft.teamId)
const onSelectTarget = (target: { kind: 'agent' | 'team'; id: string }) => {
  if (target.kind === 'team') chat.setDraftTeam(target.id)
  else chat.setDraftAgent(target.id)
}

const startChat = async () => {
  if (state.draft.teamId) {
    const team = await chat.startTeamChat()
    if (team) await router.push('/workspace')
    return
  }
  const created = await chat.startChat()
  if (created) await router.push({ path: '/chat', query: { id: created.id } })
}

const followUp = ref('')
const followUpSkills = ref<string[]>([])
const followUpAttachments = ref<ChatAttachment[]>([])
const sendFollowUp = () => {
  if (!activeChat.value) return
  chat.sendInChat(activeChat.value.id, followUp.value, followUpSkills.value, followUpAttachments.value)
  followUp.value = ''
  followUpSkills.value = []
  followUpAttachments.value = []
}

const scrollRef = ref<HTMLElement | null>(null)
const scrollToEnd = () => nextTick(() => {
  if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight
})
watch(() => [activeId.value, activeChat.value?.messages.length, activeChat.value?.messages.at(-1)?.text], scrollToEnd, { immediate: true })

</script>
