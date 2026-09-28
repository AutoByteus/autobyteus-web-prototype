<template>
  <div
    class="rounded-xl border bg-white shadow-sm transition-shadow focus-within:border-gray-300 focus-within:shadow-md"
    :class="size === 'large' ? 'border-gray-300' : 'border-gray-200'"
    data-test="chat-composer"
  >
    <textarea
      ref="textareaRef"
      :value="modelValue"
      data-test="chat-composer-input"
      class="block w-full resize-none border-0 bg-transparent px-4 text-[0.9375rem] leading-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
      :class="size === 'large' ? 'pt-4 pb-2' : 'pt-3 pb-1'"
      :style="{ height: `${height}px` }"
      :placeholder="placeholder"
      :aria-label="placeholder"
      :disabled="starting"
      @input="onInput"
      @keydown.enter.exact.prevent="submit"
    ></textarea>
    <div class="flex flex-wrap items-center gap-1.5 px-2.5 pb-2.5 pt-1">
      <button
        type="button"
        class="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        title="Add context files"
        aria-label="Add context files"
        data-test="chat-attach"
        @click="emit('attach')"
      >
        <ChatGlyph name="paperclip" class="h-4 w-4" />
      </button>
      <slot name="left" />
      <div class="ml-auto flex items-center gap-1.5">
        <slot name="right" />
        <button
          v-if="running"
          type="button"
          data-test="chat-stop"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          title="Stop generation"
          aria-label="Stop generation"
          @click="emit('stop')"
        >
          <ChatGlyph name="stop" class="h-4 w-4" />
        </button>
        <button
          v-else
          type="button"
          data-test="chat-send"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="!canSend"
          :title="sendBlockedReason || 'Send message'"
          :aria-label="sendBlockedReason || 'Send message'"
          @click="submit"
        >
          <span v-if="starting" class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
          <ChatGlyph v-else name="send" class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import ChatGlyph from '~/components/chat/ChatGlyph.vue'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder: string
  size?: 'large' | 'normal'
  running?: boolean
  starting?: boolean
  sendBlockedReason?: string | null
  autofocus?: boolean
}>(), { size: 'normal', running: false, starting: false, sendBlockedReason: null, autofocus: false })

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'send'): void
  (e: 'stop'): void
  (e: 'attach'): void
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const minHeight = computed(() => (props.size === 'large' ? 88 : 52))
const height = ref(minHeight.value)
const canSend = computed(() => !props.starting && !props.sendBlockedReason && props.modelValue.trim().length > 0)

const resize = () => {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  height.value = Math.min(240, Math.max(minHeight.value, el.scrollHeight))
  el.style.height = `${height.value}px`
}
const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
  nextTick(resize)
}
const submit = () => {
  if (props.running || !canSend.value) return
  emit('send')
}
watch(() => props.modelValue, (value) => { if (!value) nextTick(resize) })
onMounted(() => {
  if (props.autofocus) textareaRef.value?.focus()
})
defineExpose({ focus: () => textareaRef.value?.focus() })
</script>
