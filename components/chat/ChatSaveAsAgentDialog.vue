<template>
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4" data-test="chat-save-agent-dialog" @mousedown.self="emit('close')">
    <div role="dialog" aria-modal="true" aria-labelledby="chat-save-agent-title" class="w-full max-w-md rounded-xl bg-white shadow-2xl" @keydown.esc="emit('close')">
      <header class="border-b border-gray-100 px-5 pb-3 pt-4">
        <h2 id="chat-save-agent-title" class="text-base font-semibold text-gray-900">Save this setup as an agent</h2>
        <p class="mt-0.5 text-xs text-gray-500">Creates a new agent from the chat’s agent, skills and model. You can later add it to a team or org.</p>
      </header>
      <form class="space-y-4 px-5 py-4" @submit.prevent="emit('save', name)">
        <label class="block">
          <span class="text-xs font-medium text-gray-600">Agent name</span>
          <input ref="nameRef" v-model="name" type="text" class="mt-1 w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-900 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-200">
        </label>
        <dl class="space-y-2 text-sm">
          <div class="flex gap-3"><dt class="w-28 flex-shrink-0 text-gray-500">Based on</dt><dd class="text-gray-900">{{ agent.name }}</dd></div>
          <div class="flex gap-3"><dt class="w-28 flex-shrink-0 text-gray-500">Skills</dt>
            <dd class="flex flex-wrap gap-1"><span v-for="skill in agent.skills" :key="skill" class="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700">{{ skill }}</span></dd>
          </div>
          <div class="flex gap-3"><dt class="w-28 flex-shrink-0 text-gray-500">Default model</dt><dd class="text-gray-900">{{ runtimeLabel }} / {{ modelLabel }}<span v-if="thinking" class="text-gray-500"> · {{ thinking }}</span></dd></div>
        </dl>
        <footer class="flex justify-end gap-2 pt-1">
          <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50" @click="emit('close')">Cancel</button>
          <button type="submit" class="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50" :disabled="!name.trim()">Create agent</button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ChatAgent } from '~/prototype/chat/chat-fixtures'

const props = defineProps<{ agent: ChatAgent; runtimeLabel: string; modelLabel: string; thinking?: string; suggestedName: string }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'save', name: string): void }>()
const name = ref(props.suggestedName)
const nameRef = ref<HTMLInputElement | null>(null)
onMounted(() => nameRef.value?.select())
</script>
