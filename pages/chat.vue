<template>
  <div class="flex h-full bg-white" data-test="chat-page">
    <!-- New chat -->
    <div v-if="!activeId" class="flex min-w-0 flex-1 flex-col overflow-y-auto" data-test="chat-new">
      <div class="flex flex-1 flex-col items-center justify-center px-4 pb-[14vh] pt-10 sm:px-6">
        <h1 class="text-center text-[1.75rem] font-semibold tracking-tight text-gray-900">What should we work on?</h1>
        <p class="mt-2 max-w-xl text-center text-sm text-gray-500">
          Chat with one agent. It runs like any other agent run, with its tools and skills.
        </p>
        <div class="mt-8 w-full max-w-3xl">
          <ChatComposer
            ref="newComposerRef"
            v-model="state.draft.text"
            size="large"
            autofocus
            :placeholder="`Ask ${draftAgent.name} anything…`"
            :starting="state.starting"
            :send-blocked-reason="draftBlockedReason"
            @send="startChat"
            @attach="chat.showToast('Context files: same attach flow as agent runs (not simulated).')"
          >
            <template #left>
              <ChatAgentPicker :agent-id="state.draft.agentId" @select="selectAgent" />
              <ChatWorkspacePicker :workspace-id="state.draft.workspaceId" @select="(id) => (state.draft.workspaceId = id)" />
            </template>
            <template #right>
              <ChatModelPicker
                :runtime="state.draft.runtime"
                :model-id="state.draft.modelId"
                :thinking="state.draft.thinking"
                @select="chat.setDraftCombo"
              />
            </template>
          </ChatComposer>
          <p class="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs text-gray-400" data-test="chat-new-hint">
            <template v-if="state.starting">
              Starting {{ draftAgent.name }} on {{ draftRuntime.label }}…
            </template>
            <template v-else-if="draftAgent.defaultLaunch">
              Using {{ draftAgent.name }}’s default model. Change it anytime before you send.
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

    <!-- Active chat -->
    <template v-else>
      <div class="flex min-w-0 flex-1 flex-col" data-test="chat-active">
        <header class="flex h-14 flex-shrink-0 items-center gap-3 border-b border-gray-200 px-4">
          <span class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-[0.625rem] font-semibold text-slate-600">{{ activeAgent.initials }}</span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <h1 class="truncate text-[0.9375rem] font-semibold text-gray-900" data-test="chat-title">{{ activeChat.title }}</h1>
              <span v-if="activeChat.status === 'running'" class="inline-flex flex-shrink-0 items-center gap-1.5 text-xs text-gray-600">
                <span class="h-2 w-2 rounded-full bg-blue-500"></span>Running
              </span>
            </div>
            <p class="flex items-center gap-1.5 truncate text-xs text-gray-500">
              <span class="truncate">{{ activeAgent.name }}</span>
              <span class="text-gray-300">·</span>
              <ChatGlyph name="folder" class="h-3.5 w-3.5 flex-shrink-0" />
              <span class="truncate" :title="activeWorkspace.path">{{ activeWorkspace.name }}</span>
            </p>
          </div>
          <button
            type="button"
            class="rounded-md p-2 transition-colors"
            :class="state.workspacePanelOpen ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'"
            :aria-pressed="state.workspacePanelOpen ? 'true' : 'false'"
            aria-label="Show files, terminal and activity"
            title="Files, terminal and activity"
            data-test="chat-toggle-workspace-panel"
            @click="state.workspacePanelOpen = !state.workspacePanelOpen"
          >
            <ChatGlyph name="panel-right" class="h-5 w-5" />
          </button>
          <div ref="menuRootRef" class="relative">
            <button
              ref="menuTriggerRef"
              type="button"
              class="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="More chat actions"
              :aria-expanded="menu.open.value ? 'true' : 'false'"
              data-test="chat-more"
              @click="menu.toggle"
            >
              <ChatGlyph name="ellipsis" class="h-5 w-5" />
            </button>
            <div v-if="menu.open.value" role="menu" class="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <button type="button" role="menuitem" class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50" data-test="chat-save-as-agent" @click="openSave">
                <ChatGlyph name="user-plus" class="h-4 w-4 text-gray-500" /> Save setup as agent…
              </button>
              <button type="button" role="menuitem" class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50" @click="removeActive">
                <ChatGlyph name="trash" class="h-4 w-4" /> Delete chat
              </button>
            </div>
          </div>
        </header>

        <div ref="scrollRef" class="min-h-0 flex-1 overflow-y-auto" data-test="chat-messages">
          <div class="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6">
            <template v-for="message in activeChat.messages" :key="message.id">
              <div v-if="message.role === 'user'" class="flex items-start gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-sky-200 bg-white">
                  <ChatGlyph name="person" class="h-8 w-8 text-sky-600" />
                </div>
                <div class="min-w-0 flex-1 whitespace-pre-wrap break-words pt-1.5 leading-6 text-gray-900">{{ message.text }}</div>
              </div>
              <div v-else-if="message.role === 'assistant'" class="flex items-start gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                  <span class="text-xs font-semibold tracking-wide text-slate-600">{{ activeAgent.initials }}</span>
                </div>
                <div class="min-w-0 flex-1 whitespace-pre-wrap break-words pt-1.5 leading-6 text-gray-900">
                  {{ message.text }}<span v-if="message.streaming" class="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-gray-400"></span>
                </div>
              </div>
              <div v-else class="flex items-center gap-3 text-xs text-gray-400" data-test="chat-event">
                <span class="h-px flex-1 bg-gray-200"></span>
                <span>{{ message.text }}</span>
                <span class="h-px flex-1 bg-gray-200"></span>
              </div>
            </template>
          </div>
        </div>

        <div class="mx-auto w-full max-w-3xl flex-shrink-0 px-4 pb-4 sm:px-6">
          <ChatComposer
            v-model="followUp"
            :placeholder="`Message ${activeAgent.name}…`"
            :running="activeChat.status === 'running'"
            @send="sendFollowUp"
            @stop="chat.stopChat(activeChat.id)"
            @attach="chat.showToast('Context files: same attach flow as agent runs (not simulated).')"
          >
            <template #right>
              <ChatModelPicker
                :runtime="activeChat.runtime"
                :model-id="activeChat.modelId"
                :thinking="activeChat.thinking"
                locked-runtime
                @select="(combo) => chat.switchChatModel(activeChat!.id, combo)"
              />
            </template>
          </ChatComposer>
        </div>
      </div>
      <ChatWorkspacePanel
        v-if="state.workspacePanelOpen"
        class="hidden lg:flex"
        :workspace="activeWorkspace"
        @close="state.workspacePanelOpen = false"
      />
    </template>

    <ChatSaveAsAgentDialog
      v-if="saveOpen && activeChat"
      :agent="activeAgent"
      :runtime-label="findRuntime(activeChat.runtime).shortLabel"
      :model-label="findModel(activeChat.modelId)?.name ?? activeChat.modelId"
      :thinking="activeChat.thinking"
      :suggested-name="`${activeAgent.name} – ${activeChat.title}`.slice(0, 48)"
      @close="saveOpen = false"
      @save="onSaved"
    />

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
import ChatAgentPicker from '~/components/chat/ChatAgentPicker.vue'
import ChatComposer from '~/components/chat/ChatComposer.vue'
import ChatGlyph from '~/components/chat/ChatGlyph.vue'
import ChatModelPicker from '~/components/chat/ChatModelPicker.vue'
import ChatSaveAsAgentDialog from '~/components/chat/ChatSaveAsAgentDialog.vue'
import ChatWorkspacePanel from '~/components/chat/ChatWorkspacePanel.vue'
import ChatWorkspacePicker from '~/components/chat/ChatWorkspacePicker.vue'
import { findAgent, findModel, findRuntime, usePrototypeChat } from '~/composables/chat/usePrototypeChat'
import { useChatPopover } from '~/composables/chat/useChatPopover'

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
  if (!draftRuntime.value.enabled) return `${draftRuntime.value.label} is unavailable. Choose another runtime.`
  if (!findModel(state.draft.modelId)) return 'Choose a model to start.'
  return null
})

const selectAgent = (id: string) => {
  chat.setDraftAgent(id)
}

const startChat = async () => {
  const created = await chat.startChat()
  if (created) await router.push({ path: '/chat', query: { id: created.id } })
}

const followUp = ref('')
const sendFollowUp = () => {
  if (!activeChat.value) return
  chat.sendInChat(activeChat.value.id, followUp.value)
  followUp.value = ''
}

const scrollRef = ref<HTMLElement | null>(null)
const scrollToEnd = () => nextTick(() => {
  if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight
})
watch(() => [activeId.value, activeChat.value?.messages.length, activeChat.value?.messages.at(-1)?.text], scrollToEnd, { immediate: true })

const menuRootRef = ref<HTMLElement | null>(null)
const menuTriggerRef = ref<HTMLElement | null>(null)
const menu = useChatPopover(menuRootRef, menuTriggerRef, 200)
const saveOpen = ref(false)
const openSave = () => {
  menu.close(false)
  saveOpen.value = true
}
const onSaved = (name: string) => {
  saveOpen.value = false
  chat.showToast(`Agent “${name}” created (prototype only).`)
}
const removeActive = () => {
  menu.close(false)
  if (!activeChat.value) return
  chat.deleteChat(activeChat.value.id)
  void router.push('/chat')
}
</script>
