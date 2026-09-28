<template>
  <div v-if="levels.length" ref="rootRef" class="relative">
    <button
      ref="triggerRef"
      type="button"
      data-test="chat-effort-trigger"
      class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[0.8125rem] leading-5 text-gray-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
      :class="[
        lockedReason ? 'cursor-default text-gray-400' : 'hover:bg-gray-100 hover:text-gray-700',
        popover.open.value ? 'bg-gray-100 text-gray-700' : '',
      ]"
      :aria-expanded="popover.open.value ? 'true' : 'false'"
      aria-haspopup="menu"
      :aria-label="lockedReason ? `Reasoning effort: ${value}. Locked: ${lockedReason}` : `Reasoning effort: ${value}. Change`"
      :aria-disabled="lockedReason ? 'true' : undefined"
      :title="lockedReason || 'Reasoning effort'"
      :data-locked="lockedReason ? 'true' : undefined"
      @click="!lockedReason && toggle()"
    >
      <ChatGlyph :name="lockedReason ? 'lock' : 'bulb'" class="h-3.5 w-3.5" />
      <span>{{ value }}</span>
      <ChatGlyph name="chevron-down" class="h-3 w-3 text-gray-400" />
    </button>
    <div
      v-if="popover.open.value"
      ref="menuRef"
      role="menu"
      aria-label="Reasoning effort"
      data-test="chat-effort-menu"
      class="absolute right-0 z-50 w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
      :class="popover.placement.value === 'above' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'"
      @keydown="onKeydown"
    >
      <p class="px-2 pb-0.5 pt-1 text-[0.6875rem] font-medium text-gray-400">Reasoning effort</p>
      <button
        v-for="level in levels"
        :key="level"
        type="button"
        role="menuitemradio"
        :aria-checked="level === value ? 'true' : 'false'"
        :data-test="`chat-effort-${level}`"
        class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[0.8125rem] text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
        @click="choose(level)"
      >
        <span class="flex-1">{{ level }}</span>
        <ChatGlyph v-if="level === value" name="check" class="h-4 w-4 text-blue-600" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import ChatGlyph from '~/components/chat/ChatGlyph.vue'
import { findModel } from '~/composables/chat/usePrototypeChat'
import { useChatPopover } from '~/composables/chat/useChatPopover'

const props = defineProps<{ modelId: string; thinking?: string; lockedReason?: string | null }>()
const emit = defineEmits<{ (e: 'select', value: string): void }>()

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const popover = useChatPopover(rootRef, triggerRef, 200)
const levels = computed(() => findModel(props.modelId)?.thinkingLevels ?? [])
const value = computed(() => props.thinking ?? findModel(props.modelId)?.defaultThinking ?? levels.value[0])

const toggle = async () => {
  await popover.toggle()
  if (popover.open.value) {
    await nextTick()
    menuRef.value?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus()
  }
}
const choose = (level: string) => {
  emit('select', level)
  popover.close(true)
}
const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  const items = Array.from(menuRef.value?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? [])
  const index = items.indexOf(document.activeElement as HTMLElement)
  event.preventDefault()
  items[event.key === 'ArrowDown' ? Math.min(items.length - 1, index + 1) : Math.max(0, index - 1)]?.focus()
}
</script>
