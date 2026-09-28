<template>
  <!-- Shared attachment row for every message box (Chat and run views). -->
  <template v-for="item in items" :key="item.key">
    <span
      v-if="item.kind === 'image'"
      class="group relative inline-flex h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50"
      :data-test="`composer-attachment-${item.label}`"
    >
      <button type="button" class="h-full w-full" :title="item.label" :aria-label="`Preview ${item.label}`" :disabled="item.uploading" @click="emit('open', item.key)">
        <img v-if="item.previewUrl" :src="item.previewUrl" :alt="item.label" class="h-full w-full object-cover">
        <span v-else class="flex h-full w-full items-center justify-center text-[0.625rem] text-gray-400">IMG</span>
      </button>
      <span v-if="item.uploading" class="absolute inset-0 flex items-center justify-center bg-white/70">
        <span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500"></span>
      </span>
      <button
        type="button"
        class="absolute right-0.5 top-0.5 hidden h-4 w-4 items-center justify-center rounded-full bg-gray-900/70 text-white group-hover:flex"
        :aria-label="`Remove ${item.label}`"
        :disabled="item.uploading"
        @click.stop="emit('remove', item.key)"
      >
        <svg class="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
    </span>
    <span
      v-else
      class="inline-flex max-w-[16rem] items-center gap-1 rounded-md border border-gray-200 bg-gray-50 py-0.5 pl-1.5 pr-1 text-xs text-gray-700"
      :data-test="`composer-attachment-${item.label}`"
    >
      <svg class="h-3.5 w-3.5 flex-shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
      <button type="button" class="truncate hover:underline" :title="item.label" :disabled="item.uploading" @click="emit('open', item.key)">{{ item.label }}</button>
      <span v-if="item.uploading" class="ml-0.5 h-3 w-3 flex-shrink-0 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500" aria-label="Uploading"></span>
      <button
        v-else
        type="button"
        class="rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
        :aria-label="`Remove ${item.label}`"
        @click.stop="emit('remove', item.key)"
      >
        <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
    </span>
  </template>
  <button
    v-if="items.length > 1"
    type="button"
    class="rounded px-1.5 py-0.5 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600"
    data-test="composer-attachments-clear"
    @click="emit('clear')"
  >
    Clear all
  </button>
</template>

<script setup lang="ts">
export interface ComposerAttachmentItem {
  key: string
  label: string
  kind: 'image' | 'file'
  previewUrl?: string | null
  uploading?: boolean
}

defineProps<{ items: ComposerAttachmentItem[] }>()
const emit = defineEmits<{
  (e: 'open', key: string): void
  (e: 'remove', key: string): void
  (e: 'clear'): void
}>()
</script>
