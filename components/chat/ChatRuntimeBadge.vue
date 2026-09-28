<template>
  <span
    class="inline-flex flex-shrink-0 items-center justify-center rounded border font-semibold tracking-wide"
    :class="[runtime.tint, size === 'sm' ? 'h-5 w-6 text-[0.5625rem]' : 'h-6 w-7 text-[0.625rem]']"
    aria-hidden="true"
  >{{ runtime.monogram }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChatRuntimeId } from '~/prototype/chat/chat-fixtures'
import { findRuntime } from '~/composables/chat/usePrototypeChat'

const props = withDefaults(defineProps<{ runtimeId: ChatRuntimeId; size?: 'sm' | 'md' }>(), { size: 'md' })
const runtime = computed(() => findRuntime(props.runtimeId))
</script>
