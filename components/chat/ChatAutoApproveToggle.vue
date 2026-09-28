<template>
  <button
    type="button"
    data-test="chat-auto-approve"
    class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.8125rem] leading-5 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    :class="modelValue ? 'text-gray-600' : 'text-amber-700'"
    :aria-pressed="modelValue ? 'true' : 'false'"
    :aria-label="modelValue ? 'Auto-approve tools is on. Tools run without asking. Turn off to ask first.' : 'Ask first is on. Tools ask before running. Turn on auto-approve.'"
    :title="modelValue ? 'Tools run without asking. Click to ask before running tools.' : 'Tools ask before running. Click to let tools run without asking.'"
    @click="emit('update:modelValue', !modelValue)"
  >
    <ChatGlyph :name="modelValue ? 'shield-check' : 'shield-hand'" class="h-4 w-4" />
    <span>{{ modelValue ? 'Auto-approve' : 'Ask first' }}</span>
  </button>
</template>

<script setup lang="ts">
import ChatGlyph from '~/components/chat/ChatGlyph.vue'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()
</script>
