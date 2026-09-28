<template>
  <!-- chat-interface-entry R2 (DEC-014): prototype mirror of the product's
       ContextFilePathInputArea — same markup, styling and drag/paste/upload
       behavior — driven by prototype-local attachments. Production reuses the
       real component. -->
  <div
    class="bg-white px-3 py-2"
    data-file-drop-target="true"
    data-test="chat-context-files"
    @dragover.prevent
    @drop.prevent="onFileDrop"
    @paste="onPaste"
  >
    <input
      ref="fileInputRef"
      type="file"
      multiple
      class="hidden"
      data-test="chat-file-input"
      @change="onFileSelect"
    />

    <div class="flex items-center justify-between" :class="{ 'mb-2': expanded && modelValue.length > 0 }">
      <div
        class="flex items-center flex-grow cursor-pointer px-1 py-1 rounded hover:bg-gray-50 transition-colors"
        role="button"
        aria-controls="chat-context-file-list"
        :aria-expanded="expanded"
        @click="toggleList"
      >
        <div class="flex items-center">
          <svg
            v-if="modelValue.length > 0"
            class="w-5 h-5 transform transition-transform text-gray-600 mr-2 flex-shrink-0"
            :class="{ 'rotate-90': expanded }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span class="font-medium text-xs text-gray-700" data-test="chat-context-files-count">Context Files ({{ modelValue.length }})</span>
          <span v-if="modelValue.length === 0" class="text-xs text-gray-400 ml-1.5">(drag, paste, or upload)</span>
        </div>
      </div>

      <button
        class="text-blue-500 hover:text-white hover:bg-blue-500 transition-colors duration-200 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2 flex-shrink-0"
        title="Upload files"
        aria-label="Upload files"
        data-test="chat-attach"
        @click.stop="fileInputRef?.click()"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6V18M18 12H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <div v-if="expanded && modelValue.length > 0" id="chat-context-file-list" class="space-y-2">
      <div v-if="imageItems.length > 0" class="thumbnail-row-container">
        <div class="thumbnail-row">
          <div v-for="item in imageItems" :key="item.id" class="thumbnail-card group" :data-test="`chat-context-image-${item.name}`">
            <button
              type="button"
              class="thumbnail-button"
              :title="item.name"
              aria-label="Open image preview"
              @click="previewUrl = item.previewUrl ?? null"
            >
              <img v-if="item.previewUrl" :src="item.previewUrl" alt="Context image thumbnail" class="context-image-thumbnail" />
              <div v-else class="thumbnail-fallback"><i class="fas fa-image"></i></div>
            </button>
            <button class="thumbnail-remove-button" title="Remove this file" aria-label="Remove file" @click.stop="remove(item.id)">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ul v-if="fileItems.length > 0" class="space-y-2">
        <li
          v-for="item in fileItems"
          :key="item.id"
          class="bg-gray-100 p-2 rounded transition-colors duration-300 flex items-start justify-between hover:bg-gray-200 group"
          :data-test="`chat-context-file-${item.name}`"
        >
          <div class="flex items-start space-x-2 flex-grow min-w-0">
            <i :class="['fas', iconFor(item.name), 'text-gray-500 w-4 flex-shrink-0']"></i>
            <div class="min-w-0 flex-grow">
              <button type="button" class="text-sm text-left text-gray-600 truncate group-hover:underline cursor-pointer block w-full" :title="item.name">
                {{ item.name }}
              </button>
            </div>
          </div>
          <button
            class="text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 ml-2 flex-shrink-0"
            title="Remove this file"
            aria-label="Remove file"
            @click.stop="remove(item.id)"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </li>
      </ul>
    </div>

    <div v-if="modelValue.length > 0" class="flex justify-end pt-2 mt-2">
      <button
        class="px-2.5 py-1 border border-blue-100 text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200 flex items-center text-xs"
        data-test="chat-context-files-clear"
        @click.stop="emit('update:modelValue', [])"
      >
        <i class="fas fa-trash-alt mr-2"></i>Clear All
      </button>
    </div>
  </div>

  <FullScreenImageModal
    v-if="previewUrl"
    :visible="Boolean(previewUrl)"
    :image-url="previewUrl"
    alt-text="Context image preview"
    @close="previewUrl = null"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import FullScreenImageModal from '~/components/common/FullScreenImageModal.vue'
import type { ChatAttachment } from '~/prototype/chat/chat-fixtures'

const props = defineProps<{ modelValue: ChatAttachment[] }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: ChatAttachment[]): void }>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const expanded = ref(true)
const previewUrl = ref<string | null>(null)
const imageItems = computed(() => props.modelValue.filter((item) => item.kind === 'image' && item.previewUrl))
const fileItems = computed(() => props.modelValue.filter((item) => !(item.kind === 'image' && item.previewUrl)))

let counter = 0
const nextId = () => `att-${Date.now().toString(36)}-${counter++}`
const addFiles = (files: File[]) => {
  if (!files.length) return
  const next = files.map((file) => ({
    id: nextId(),
    name: file.name || 'pasted-image.png',
    kind: (file.type.startsWith('image/') ? 'image' : 'file') as ChatAttachment['kind'],
    previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
  }))
  expanded.value = true
  emit('update:modelValue', [...props.modelValue, ...next])
}
// Same as the product: pasted text lines are treated as file paths.
const addPaths = (paths: string[]) => {
  const next = paths.map((path) => path.trim()).filter(Boolean).map((path) => ({ id: nextId(), name: path, kind: 'file' as const, previewUrl: null }))
  if (!next.length) return
  expanded.value = true
  emit('update:modelValue', [...props.modelValue, ...next])
}
const onFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  addFiles(Array.from(input.files ?? []))
  input.value = ''
}
const onFileDrop = (event: DragEvent) => addFiles(Array.from(event.dataTransfer?.files ?? []))
const onPaste = (event: ClipboardEvent) => {
  const files = Array.from(event.clipboardData?.items ?? []).filter((item) => item.kind === 'file').map((item) => item.getAsFile()).filter((file): file is File => file !== null)
  if (files.length) { event.preventDefault(); addFiles(files); return }
  const text = event.clipboardData?.getData('text/plain') ?? ''
  if (text.trim()) { event.preventDefault(); addPaths(text.split(/\r?\n/)) }
}
const toggleList = () => {
  expanded.value = props.modelValue.length > 0 ? !expanded.value : true
}
const remove = (id: string) => emit('update:modelValue', props.modelValue.filter((item) => item.id !== id))
const iconFor = (name: string) => /\.(md|txt)$/i.test(name) ? 'fa-file-lines' : /\.pdf$/i.test(name) ? 'fa-file-pdf' : /\.(csv|xlsx)$/i.test(name) ? 'fa-file-excel' : 'fa-file'
</script>

<style scoped>
.thumbnail-button {
  display: inline-flex;
  width: 42px;
  height: 42px;
  border-radius: 0.375rem;
  overflow: hidden;
  border: 1px solid #d1d5db;
  transition: box-shadow 0.2s ease;
}
.thumbnail-button:hover { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.35); }
.thumbnail-row-container { overflow-x: auto; padding: 0.125rem 0.125rem 0.375rem 0.125rem; }
.thumbnail-row { display: flex; align-items: flex-start; gap: 0.375rem; min-width: max-content; }
.thumbnail-card { position: relative; flex: 0 0 auto; }
.thumbnail-remove-button {
  position: absolute; top: -5px; right: -5px; width: 18px; height: 18px; border-radius: 9999px;
  display: inline-flex; align-items: center; justify-content: center; color: #ffffff; background-color: #ef4444;
  opacity: 0; transition: opacity 0.2s ease;
}
.thumbnail-card:hover .thumbnail-remove-button { opacity: 1; }
.context-image-thumbnail, .thumbnail-fallback { width: 42px; height: 42px; }
.context-image-thumbnail { object-fit: cover; display: block; background: #f3f4f6; }
.thumbnail-fallback { display: flex; align-items: center; justify-content: center; color: #6b7280; background: #f3f4f6; }
</style>
