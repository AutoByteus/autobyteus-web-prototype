<template>
  <MobileLaunchTargetPicker
    :model-value="modelValue"
    label="Folder"
    placeholder="Choose"
    :items="items.map((item) => ({ ...item, group: undefined }))"
    test-id="mobile-run-workspace-select"
    item-noun="folders"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #footer>
      <form class="flex gap-2" data-testid="mobile-run-workspace-path-card" @submit.prevent="submitLoadPath">
        <input
          id="mobile-run-workspace-path-input"
          v-model="pathDraft"
          class="h-12 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base"
          data-testid="mobile-run-workspace-path-input"
          placeholder="Open a folder by path"
          aria-label="Open a folder by path"
          autocomplete="off"
          :disabled="isLoadingPath"
        />
        <button
          type="submit"
          class="h-12 rounded-xl bg-blue-600 px-5 text-base font-semibold text-white disabled:opacity-50"
          data-testid="mobile-run-workspace-load"
          :disabled="!pathDraft.trim() || isLoadingPath"
        >{{ isLoadingPath ? 'Loading…' : 'Open' }}</button>
      </form>
      <p v-if="errorMessage" class="mt-2 text-sm text-red-700" data-testid="mobile-run-workspace-error">{{ errorMessage }}</p>
    </template>
  </MobileLaunchTargetPicker>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MobileLaunchTargetPicker from '~/components/mobile/MobileLaunchTargetPicker.vue'
import type { MobileLaunchPickerItem } from '~/types/mobileLaunch'

defineProps<{
  modelValue: string
  items: MobileLaunchPickerItem[]
  isRefreshing?: boolean
  isLoadingPath?: boolean
  errorMessage?: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'load-path': [path: string]
}>()

const pathDraft = ref('')
function submitLoadPath(): void {
  const path = pathDraft.value.trim()
  if (!path) return
  emit('load-path', path)
  pathDraft.value = ''
}
</script>
