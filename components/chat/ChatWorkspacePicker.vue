<template>
  <div ref="rootRef" class="relative">
    <button
      ref="triggerRef"
      type="button"
      data-test="chat-workspace-trigger"
      class="inline-flex max-w-[15rem] items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1 text-[0.8125rem] leading-5 text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
      :class="popover.open.value ? 'bg-gray-50 ring-2 ring-blue-500/30' : ''"
      :aria-expanded="popover.open.value ? 'true' : 'false'"
      aria-haspopup="listbox"
      :aria-label="`Workspace: ${workspace.name}. Change workspace`"
      :title="workspace.path"
      @click="toggle"
    >
      <ChatGlyph name="folder" class="h-4 w-4 flex-shrink-0 text-gray-500" />
      <span class="truncate">{{ workspace.name }}</span>
      <ChatGlyph name="chevron-down" class="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
    </button>

    <div v-if="popover.open.value" class="fixed inset-0 z-40 bg-black/20 sm:hidden" aria-hidden="true"></div>
    <div
      v-if="popover.open.value"
      data-test="chat-workspace-picker"
      class="absolute left-0 z-50 flex w-96 max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-xl max-sm:fixed max-sm:inset-x-2 max-sm:bottom-2 max-sm:top-auto max-sm:m-0 max-sm:w-auto max-sm:max-w-none max-sm:!max-h-[80vh]"
      :class="popover.placement.value === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'"
      :style="{ maxHeight: `${popover.maxHeight.value}px` }"
    >
      <div ref="listRef" class="min-h-0 flex-1 overflow-y-auto pb-1 pt-1.5" @keydown="onKeydown">
        <template v-for="section in sections" :key="section.title">
          <h4 v-if="section.title && section.items.length" class="px-3 pb-1 pt-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">{{ section.title }}</h4>
          <button
            v-for="item in section.items"
            :key="item.id"
            type="button"
            data-option
            :data-test="`chat-workspace-option-${item.id}`"
            class="flex w-full items-start gap-2.5 px-3 py-1.5 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
            @click="choose(item.id)"
          >
            <ChatGlyph name="folder" class="mt-0.5 h-4 w-4 flex-shrink-0" :class="item.isTemp ? 'text-gray-400' : 'text-gray-500'" />
            <span class="min-w-0 flex-1">
              <span class="flex items-center gap-1.5 text-sm font-medium" :class="item.id === workspaceId ? 'text-blue-700' : 'text-gray-900'">
                <span class="truncate">{{ item.name }}</span>
                <span v-if="item.isTemp" class="rounded bg-gray-100 px-1.5 py-px text-[0.625rem] font-medium uppercase tracking-wide text-gray-500">Default</span>
              </span>
              <span class="block truncate text-xs text-gray-500">{{ item.isTemp ? 'Scratch folder for quick chats' : item.path }}</span>
            </span>
            <ChatGlyph v-if="item.id === workspaceId" name="check" class="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
          </button>
        </template>
      </div>
      <form v-if="adding" class="space-y-2 border-t border-gray-100 px-3 py-2.5" data-test="chat-workspace-add-form" @submit.prevent="confirmAdd">
        <label for="chat-workspace-path" class="text-xs font-medium text-gray-600">Folder path</label>
        <input
          id="chat-workspace-path"
          ref="pathRef"
          v-model="path"
          type="text"
          class="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-900 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-200"
          :class="error ? 'border-red-300' : ''"
          placeholder="/Users/you/project"
          @keydown.esc.stop.prevent="adding = false"
        >
        <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
        <div class="flex justify-end gap-2">
          <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50" @click="adding = false">Cancel</button>
          <button type="submit" class="rounded-md border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-50">Use folder</button>
        </div>
      </form>
      <footer v-else class="border-t border-gray-100 p-1">
        <button type="button" data-test="chat-workspace-add" class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50" @click="startAdd">
          <ChatGlyph name="plus" class="h-4 w-4 text-gray-500" /> Open another folder…
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import ChatGlyph from '~/components/chat/ChatGlyph.vue'
import { usePrototypeChat } from '~/composables/chat/usePrototypeChat'
import { useChatPopover } from '~/composables/chat/useChatPopover'

const props = defineProps<{ workspaceId: string }>()
const emit = defineEmits<{ (e: 'select', value: string): void }>()

const chat = usePrototypeChat()
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const pathRef = ref<HTMLInputElement | null>(null)
const popover = useChatPopover(rootRef, triggerRef, 420)
const adding = ref(false)
const path = ref('')
const error = ref('')

const workspace = computed(() => chat.findWorkspace(props.workspaceId))
const sections = computed(() => [
  { title: '', items: chat.allWorkspaces.value.filter((item) => item.isTemp) },
  { title: 'Your workspaces', items: chat.allWorkspaces.value.filter((item) => !item.isTemp) },
])

const toggle = async () => {
  adding.value = false
  await popover.toggle()
  if (popover.open.value) {
    await nextTick()
    listRef.value?.querySelector<HTMLElement>('[data-option]')?.focus()
  }
}
const choose = (id: string) => {
  emit('select', id)
  popover.close(true)
}
const startAdd = async () => {
  adding.value = true
  path.value = ''
  error.value = ''
  await nextTick()
  pathRef.value?.focus()
}
const confirmAdd = () => {
  if (!path.value.trim().startsWith('/') && !path.value.trim().startsWith('~')) {
    error.value = 'Enter an absolute folder path.'
    return
  }
  const created = chat.addWorkspace(path.value)
  adding.value = false
  choose(created.id)
}
const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  const list = Array.from(listRef.value?.querySelectorAll<HTMLElement>('[data-option]') ?? [])
  const index = list.indexOf(document.activeElement as HTMLElement)
  event.preventDefault()
  const next = event.key === 'ArrowDown' ? Math.min(list.length - 1, index + 1) : Math.max(0, index - 1)
  list[next]?.focus()
}
</script>
