<template>
  <aside class="flex h-full w-[22rem] flex-shrink-0 flex-col border-l border-gray-200 bg-white" data-test="chat-workspace-panel" aria-label="Workspace panel">
    <div class="flex items-center border-b border-gray-200 pr-1">
      <div role="tablist" aria-label="Workspace panel tabs" class="flex min-w-0 flex-1">
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          role="tab"
          :aria-selected="active === tab ? 'true' : 'false'"
          class="relative px-4 py-3 text-sm transition-colors"
          :class="active === tab ? 'font-medium text-blue-600' : 'text-gray-600 hover:text-gray-900'"
          @click="active = tab"
        >
          {{ tab }}
          <span v-if="active === tab" class="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-blue-600"></span>
        </button>
      </div>
      <button type="button" class="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Close workspace panel" title="Close" @click="emit('close')">
        <ChatGlyph name="x" class="h-4 w-4" />
      </button>
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto">
      <div v-if="active === 'Files'" class="p-3">
        <p class="mb-2 flex items-center gap-1.5 truncate text-xs text-gray-500" :title="workspace.path">
          <ChatGlyph name="folder" class="h-3.5 w-3.5 flex-shrink-0" /> {{ workspace.path }}
        </p>
        <ul class="space-y-0.5 text-sm text-gray-700">
          <li v-for="file in files" :key="file" class="truncate rounded px-2 py-1 hover:bg-gray-50" :style="{ paddingLeft: `${8 + (file.split('/').length - 1) * 14}px` }">{{ file.split('/').pop() }}</li>
        </ul>
      </div>
      <pre v-else-if="active === 'Terminal'" class="p-3 font-mono text-xs leading-5 text-gray-900">→ Terminal initialized
{{ workspace.path }} $</pre>
      <ul v-else class="divide-y divide-gray-100 text-sm">
        <li v-for="item in activity" :key="item" class="px-3 py-2 text-gray-700">{{ item }}</li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ChatGlyph from '~/components/chat/ChatGlyph.vue'
import type { ChatWorkspace } from '~/prototype/chat/chat-fixtures'

const props = defineProps<{ workspace: ChatWorkspace }>()
const emit = defineEmits<{ (e: 'close'): void }>()
const tabs = ['Files', 'Terminal', 'Activity'] as const
const active = ref<(typeof tabs)[number]>('Files')

// Illustrative synthetic workspace content.
const files = computed(() => props.workspace.isTemp
  ? ['notes.md']
  : ['skills', 'skills/shell-first-operating-practice', 'skills/shell-first-operating-practice/SKILL.md', 'agents', 'agents/daily-assistant', 'README.md'])
const activity = ['Read skills/shell-first-operating-practice/SKILL.md', 'Listed agents/daily-assistant', 'Searched the web: "skill authoring checklist"']
</script>
