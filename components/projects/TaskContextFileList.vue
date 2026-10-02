<template>
  <div>
    <ul class="space-y-2" data-testid="task-context-file-list">
      <li v-for="file in files" :key="file.id" class="flex min-w-0 items-center gap-3 rounded-lg bg-slate-100 p-2.5" :data-testid="`task-context-file-${file.id}`">
        <button v-if="file.type === 'Image' && file.previewUrl" type="button" class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :aria-label="`Preview ${file.name}`" @click="previewId = previewId === file.id ? '' : file.id">
          <img :src="file.previewUrl" :alt="file.name" class="h-full w-full object-cover" />
        </button>
        <Icon v-else :icon="file.type === 'Audio' ? 'heroicons:musical-note' : 'heroicons:document-text'" class="h-5 w-5 flex-shrink-0 text-slate-500" aria-hidden="true" />
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-slate-700" :title="file.name" data-testid="task-context-file-name">{{ file.name }}</p>
          <p class="mt-0.5 text-xs text-slate-500">{{ file.type === 'Image' ? 'Image' : file.type === 'Audio' ? 'Audio file' : 'File' }} · {{ formatSize(file.size) }}</p>
        </div>
        <button v-if="editable" type="button" :disabled="disabled" class="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-red-100 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50" :aria-label="`Remove ${file.name}`" @click="emit('remove', file.id)"><Icon icon="heroicons:x-mark" class="h-4 w-4" aria-hidden="true" /></button>
      </li>
    </ul>
    <div v-if="previewFile" class="mt-3 rounded-lg border border-slate-200 bg-white p-3" data-testid="task-context-image-preview">
      <div class="mb-3 flex items-center justify-between gap-3"><p class="min-w-0 break-all text-xs text-slate-600">{{ previewFile.name }}</p><button type="button" class="min-h-9 flex-shrink-0 rounded px-2 text-sm text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="previewId = ''">Close preview</button></div>
      <img :src="previewFile.previewUrl" :alt="previewFile.name" class="mx-auto max-h-80 max-w-full rounded" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import type { TaskContextFile } from '~/prototype/project-review/useTaskDesignStore'
const props = defineProps<{ files: TaskContextFile[]; editable?: boolean; disabled?: boolean }>()
const emit = defineEmits<{ (event: 'remove', id: string): void }>()
const previewId = ref('')
const previewFile = computed(() => props.files.find(file => file.id === previewId.value))
const formatSize = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
</script>
