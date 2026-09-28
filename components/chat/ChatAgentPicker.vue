<template>
  <div ref="rootRef" class="relative">
    <button
      ref="triggerRef"
      type="button"
      data-test="chat-agent-trigger"
      class="inline-flex max-w-[14rem] items-center gap-1.5 rounded-md px-2 py-1 text-[0.8125rem] leading-5 text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
      :class="popover.open.value ? 'bg-gray-100' : ''"
      :aria-expanded="popover.open.value ? 'true' : 'false'"
      aria-haspopup="listbox"
      :aria-label="`Agent: ${agent.name}. Change agent`"
      :title="`Agent: ${agent.name}`"
      @click="toggle"
    >
      <span class="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-[0.5625rem] font-semibold text-slate-600">{{ agent.initials }}</span>
      <span class="truncate font-medium text-gray-800">{{ agent.name }}</span>
      <ChatGlyph name="chevron-down" class="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
    </button>

    <div v-if="popover.open.value" class="fixed inset-0 z-40 bg-black/20 sm:hidden" aria-hidden="true"></div>
    <div
      v-if="popover.open.value"
      data-test="chat-agent-picker"
      class="absolute left-0 z-50 flex w-[22rem] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-xl max-sm:fixed max-sm:inset-x-2 max-sm:bottom-2 max-sm:top-auto max-sm:m-0 max-sm:w-auto max-sm:max-w-none max-sm:!max-h-[80vh]"
      :class="popover.placement.value === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'"
      :style="{ maxHeight: `${popover.maxHeight.value}px` }"
    >
      <h4 class="px-3 pb-1 pt-3 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">Chat with</h4>
      <ul ref="listRef" role="listbox" aria-label="Agents" class="min-h-0 flex-1 overflow-y-auto pb-1" @keydown="onKeydown">
        <li v-for="item in CHAT_AGENTS" :key="item.id" role="option" :aria-selected="item.id === agentId ? 'true' : 'false'">
          <button
            type="button"
            data-option
            :data-test="`chat-agent-option-${item.id}`"
            class="flex w-full items-start gap-2.5 px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
            @click="choose(item.id)"
          >
            <span class="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-[0.625rem] font-semibold text-slate-600">{{ item.initials }}</span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium" :class="item.id === agentId ? 'text-blue-700' : 'text-gray-900'">{{ item.name }}</span>
              <span class="block truncate text-xs text-gray-500">{{ item.description }}</span>
              <span v-if="item.defaultLaunch" class="mt-0.5 block truncate text-[0.6875rem] text-gray-400">Default model: {{ findRuntime(item.defaultLaunch.runtime).shortLabel }} / {{ findModel(item.defaultLaunch.modelId)?.name }}</span>
            </span>
            <ChatGlyph v-if="item.id === agentId" name="check" class="mt-1 h-4 w-4 flex-shrink-0 text-blue-600" />
          </button>
        </li>
      </ul>
      <footer class="flex items-center justify-between gap-2 border-t border-gray-100 bg-gray-50/70 px-3 py-2 text-xs text-gray-500">
        <span class="min-w-0 truncate">The agent sets the tools and skills.</span>
        <NuxtLink to="/agents?view=list" class="inline-flex flex-shrink-0 items-center gap-1 whitespace-nowrap font-medium text-blue-700 hover:underline">
          Manage agents <ChatGlyph name="arrow-right" class="h-3 w-3" />
        </NuxtLink>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import ChatGlyph from '~/components/chat/ChatGlyph.vue'
import { CHAT_AGENTS } from '~/prototype/chat/chat-fixtures'
import { findAgent, findModel, findRuntime } from '~/composables/chat/usePrototypeChat'
import { useChatPopover } from '~/composables/chat/useChatPopover'

const props = defineProps<{ agentId: string }>()
const emit = defineEmits<{ (e: 'select', value: string): void }>()

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const popover = useChatPopover(rootRef, triggerRef, 420)
const agent = computed(() => findAgent(props.agentId))

const options = () => Array.from(listRef.value?.querySelectorAll<HTMLElement>('[data-option]') ?? [])
const toggle = async () => {
  await popover.toggle()
  if (popover.open.value) {
    await nextTick()
    const list = options()
    const selectedIndex = CHAT_AGENTS.findIndex((item) => item.id === props.agentId)
    list[Math.max(0, selectedIndex)]?.focus()
  }
}
const choose = (id: string) => {
  emit('select', id)
  popover.close(true)
}
const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  const list = options()
  const index = list.indexOf(document.activeElement as HTMLElement)
  event.preventDefault()
  const next = event.key === 'ArrowDown' ? Math.min(list.length - 1, index + 1) : Math.max(0, index - 1)
  list[next]?.focus()
}
</script>
