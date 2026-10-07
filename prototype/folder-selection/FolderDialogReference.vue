<template>
  <!-- Browser-only stand-in for the OS-owned directory chooser. Not a proposed app dialog. -->
  <dialog ref="dialog" class="folder-system-dialog" :aria-label="t('chat.workspace.systemTitle')" @cancel.prevent="finish(null)">
    <header class="border-b border-gray-200 px-5 py-4">
      <h2 class="text-sm font-semibold text-gray-900">{{ t('chat.workspace.systemTitle') }}</h2>
      <p class="mt-1 text-xs text-gray-500">/synthetic</p>
    </header>
    <div class="min-h-48 p-3" role="radiogroup" :aria-label="t('chat.workspace.systemFolders')">
      <label v-for="folder in folders" :key="folder" class="flex cursor-default items-center gap-3 rounded px-3 py-2.5 text-sm" :class="selected === folder ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'">
        <input v-model="selected" type="radio" name="reference-folder" :value="folder" class="sr-only peer" />
        <Icon icon="heroicons:folder-solid" class="h-5 w-5" :class="selected === folder ? 'text-white' : 'text-blue-400'" aria-hidden="true" />
        <span class="peer-focus-visible:underline">{{ folder }}</span>
      </label>
    </div>
    <footer class="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3">
      <button type="button" class="rounded-md border border-gray-300 bg-white px-5 py-1.5 text-xs text-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500" @click="finish(null)">{{ t('chat.workspace.cancel') }}</button>
      <button type="button" class="rounded-md bg-blue-600 px-5 py-1.5 text-xs font-medium text-white disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" :disabled="!selected" @click="finish(`/synthetic/${selected}`)">{{ t('chat.workspace.systemOpen') }}</button>
    </footer>
  </dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useLocalization } from '~/composables/useLocalization'
const props = defineProps<{ currentPath: string }>()
const emit = defineEmits<{ (event: 'result', path: string | null): void }>()
const { t } = useLocalization()
const dialog = ref<HTMLDialogElement | null>(null)
const folders = ['client-portal', 'design-system', 'prototype-workspace']
const currentName = props.currentPath.split('/').pop() ?? ''
const selected = ref(folders.includes(currentName) ? currentName : '')
const finish = (path: string | null) => { dialog.value?.close(); emit('result', path) }
// A native window owns Escape while open. Mirror that in the browser before the app's popover.
const interceptEscape = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  event.preventDefault(); event.stopImmediatePropagation(); finish(null)
}
onMounted(() => { dialog.value?.showModal(); window.addEventListener('keydown', interceptEscape, true) })
onBeforeUnmount(() => { window.removeEventListener('keydown', interceptEscape, true); dialog.value?.close() })
</script>

<style scoped>
.folder-system-dialog { width: 520px; max-width: calc(100vw - 32px); padding: 0; border: 1px solid #d1d5db; border-radius: 12px; box-shadow: 0 20px 60px #0003; }
.folder-system-dialog::backdrop { background: #0003; }
</style>
