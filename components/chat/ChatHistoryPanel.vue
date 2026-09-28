<template>
  <div class="flex h-full flex-col bg-white" data-test="chat-history-panel">
    <div class="border-t border-gray-200 px-2 pb-1 pt-2">
      <NuxtLink
        to="/chat"
        data-test="chat-new-chat"
        class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
      >
        <ChatGlyph name="pencil-square" class="h-4 w-4 flex-shrink-0" />
        New chat
      </NuxtLink>
    </div>
    <div class="flex items-center justify-between px-3 pb-1 pt-2">
      <h3 class="text-sm font-semibold text-gray-700">Chats</h3>
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto px-1 pb-2">
      <p v-if="!chat.state.chats.length" class="px-3 py-2 text-xs text-gray-400" data-test="chat-history-empty">No chats yet.</p>
      <section v-for="group in groups" :key="group.title" class="pb-1">
        <h4 class="px-3 pb-0.5 pt-2 text-[0.6875rem] font-medium text-gray-400">{{ group.title }}</h4>
        <div
          v-for="item in group.items"
          :key="item.id"
          class="group/chat-row flex items-center rounded-md text-sm transition-colors"
          :class="item.id === activeId ? 'bg-indigo-50 text-indigo-900' : 'text-gray-700 hover:bg-gray-50'"
        >
          <NuxtLink
            :to="{ path: '/chat', query: { id: item.id } }"
            class="flex min-w-0 flex-1 items-center px-2 py-1.5"
            :data-test="`chat-history-row-${item.id}`"
            :aria-current="item.id === activeId ? 'page' : undefined"
          >
            <span
              v-if="item.status === 'running'"
              class="mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"
              title="Running"
            ></span>
            <span class="truncate">{{ item.title }}</span>
          </NuxtLink>
          <span class="mr-2 flex-shrink-0 text-xs text-gray-400 md:group-hover/chat-row:hidden">{{ item.age }}</span>
          <button
            type="button"
            class="mr-1 hidden h-5 w-5 flex-shrink-0 items-center justify-center rounded text-gray-400 hover:bg-red-50 hover:text-red-600 md:group-hover/chat-row:inline-flex"
            :aria-label="`Delete chat ${item.title}`"
            title="Delete chat"
            @click="remove(item.id)"
          >
            <ChatGlyph name="trash" class="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatGlyph from '~/components/chat/ChatGlyph.vue'
import { usePrototypeChat } from '~/composables/chat/usePrototypeChat'

const chat = usePrototypeChat()
const route = useRoute()
const router = useRouter()
const activeId = computed(() => (typeof route.query.id === 'string' ? route.query.id : null))

const groups = computed(() => {
  const order = ['Today', 'Yesterday', 'Previous 7 days'] as const
  return order
    .map((title) => ({ title, items: chat.state.chats.filter((item) => item.group === title) }))
    .filter((group) => group.items.length)
})

const remove = (id: string) => {
  chat.deleteChat(id)
  if (activeId.value === id) void router.push('/chat')
}
</script>
