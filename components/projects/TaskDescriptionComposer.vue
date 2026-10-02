<template>
  <div class="mt-3 rounded-xl border bg-white shadow-sm focus-within:ring-2" :class="error ? 'border-red-400 focus-within:ring-red-500/20' : 'border-slate-300 focus-within:border-blue-400 focus-within:ring-blue-500/20'" data-testid="task-description-composer" @dragover.prevent @drop.prevent="onDrop" @paste="onPaste">
    <input ref="fileInput" type="file" multiple class="hidden" :disabled="disabled || adding" @change="onSelect" />
    <div class="border-b border-slate-100 px-3 py-2">
      <div class="flex min-w-0 items-center gap-2">
        <button type="button" class="flex min-h-11 min-w-0 flex-1 flex-wrap items-center gap-1.5 rounded px-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :aria-expanded="expanded" aria-controls="task-composer-context-files" @click="expanded = !expanded">
          <Icon v-if="attachments.length" icon="heroicons:chevron-right" class="h-4 w-4 flex-shrink-0 text-slate-500" :class="expanded ? 'rotate-90' : ''" aria-hidden="true" />
          <span class="text-xs font-medium text-slate-700">Context Files ({{ attachments.length }})</span>
          <span v-if="!attachments.length" class="text-xs text-slate-400">Drag, paste or upload</span>
        </button>
        <button type="button" :disabled="disabled || adding" title="Attach files" aria-label="Attach files" class="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50" data-testid="task-attach-files" @click="fileInput?.click()"><Icon icon="heroicons:plus" class="h-5 w-5" aria-hidden="true" /></button>
      </div>
      <div v-if="expanded && attachments.length" id="task-composer-context-files" class="pb-1">
        <TaskContextFileList :files="attachments" editable :disabled="disabled || adding" @remove="removeFile" />
        <div class="mt-2 flex items-center justify-between gap-2">
          <p v-if="adding" class="text-xs text-blue-600" role="status">Adding context files…</p><span v-else></span>
          <button type="button" :disabled="disabled || adding" class="min-h-9 rounded px-2 text-xs font-medium text-blue-700 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50" data-testid="task-clear-files" @click="emit('update:attachments', [])">Clear all</button>
        </div>
      </div>
    </div>

    <textarea id="task-page-description" :value="modelValue" rows="8" :disabled="disabled" :placeholder="placeholder" :aria-invalid="error ? 'true' : 'false'" :aria-describedby="error ? 'task-page-help task-page-error' : 'task-page-help'" class="block w-full resize-y rounded-none border-0 bg-transparent px-3 py-3 text-base leading-6 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 sm:text-sm" data-testid="task-page-description-input" @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)" @keydown.enter.ctrl.exact.prevent="emit('save')" @keydown.enter.meta.exact.prevent="emit('save')" />

    <div v-if="voicePhase !== 'idle' || voiceMessage" class="mx-3 mb-3 rounded-lg border px-3 py-2.5 text-xs leading-5" :class="voicePhase === 'recording' ? 'border-red-200 bg-red-50 text-red-700' : voiceError ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'" :role="voiceError ? 'alert' : 'status'" data-testid="task-voice-status">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="flex items-center gap-2"><span v-if="voicePhase !== 'idle'" class="h-2 w-2 flex-shrink-0 rounded-full" :class="voicePhase === 'recording' ? 'animate-pulse bg-red-500 motion-reduce:animate-none' : 'bg-blue-500'"></span>{{ voiceStatus }}</span>
        <button v-if="voicePhase === 'recording'" type="button" class="min-h-8 rounded px-1 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500" data-testid="task-voice-cancel" @click="cancelVoice">Cancel recording</button>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2 rounded-b-xl border-t border-slate-100 px-3 py-2">
      <p class="text-xs text-slate-500">Ctrl+Enter or ⌘+Enter to save</p>
      <button type="button" :disabled="disabled || voicePhase === 'starting' || voicePhase === 'transcribing'" :aria-label="voicePhase === 'recording' ? 'Stop recording' : 'Start voice input'" :title="voicePhase === 'recording' ? 'Stop recording' : 'Start voice input'" class="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full shadow-sm transition-colors focus:outline-none focus-visible:ring-2 disabled:opacity-50" :class="voicePhase === 'recording' ? 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400'" data-testid="task-voice-button" @click="toggleVoice"><Icon :icon="voicePhase === 'recording' ? 'heroicons:stop-solid' : voicePhase === 'starting' || voicePhase === 'transcribing' ? 'heroicons:arrow-path-solid' : 'heroicons:microphone-solid'" class="h-5 w-5" :class="voicePhase === 'starting' || voicePhase === 'transcribing' ? 'animate-spin motion-reduce:animate-none' : ''" aria-hidden="true" /></button>
    </div>
  </div>
  <p class="mt-2 text-xs leading-5 text-slate-400" data-testid="task-input-demo-boundary">Voice uses a sample transcript in this prototype; no microphone access. Files stay in this browser session.</p>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import TaskContextFileList from './TaskContextFileList.vue'
import type { TaskContextFile } from '~/prototype/project-review/useTaskDesignStore'
import { mergeTranscriptWithDraft } from '~/utils/voiceInputCapture'

const props = defineProps<{ modelValue: string; attachments: TaskContextFile[]; disabled?: boolean; error?: string; placeholder: string; demoOutcome?: string }>()
const emit = defineEmits<{ (event: 'update:modelValue', value: string): void; (event: 'update:attachments', files: TaskContextFile[]): void; (event: 'pending', value: boolean): void; (event: 'save'): void }>()
const fileInput = ref<HTMLInputElement | null>(null)
const expanded = ref(true)
const adding = ref(false)
const voicePhase = ref<'idle' | 'starting' | 'recording' | 'transcribing'>('idle')
const voiceMessage = ref('')
const voiceError = ref(false)
let nextFileId = 1
let voiceTimer: ReturnType<typeof setTimeout> | undefined
let addingTimer: ReturnType<typeof setTimeout> | undefined
const voiceStatus = computed(() => voicePhase.value === 'starting' ? 'Starting voice input…' : voicePhase.value === 'recording' ? 'Demo recording… Tap stop when you are done.' : voicePhase.value === 'transcribing' ? 'Transcribing voice input…' : voiceMessage.value)
watch([voicePhase, adding], () => emit('pending', voicePhase.value !== 'idle' || adding.value), { immediate: true })
const cancelVoice = () => {
  if (voiceTimer !== undefined) clearTimeout(voiceTimer)
  voicePhase.value = 'idle'
  voiceMessage.value = ''
  voiceError.value = false
}
const toggleVoice = () => {
  if (props.disabled) return
  voiceMessage.value = ''
  voiceError.value = false
  if (voicePhase.value === 'idle') {
    voicePhase.value = 'starting'
    voiceTimer = setTimeout(() => { voicePhase.value = 'recording' }, 250)
  } else if (voicePhase.value === 'recording') {
    voicePhase.value = 'transcribing'
    voiceTimer = setTimeout(() => {
      voicePhase.value = 'idle'
      if (props.demoOutcome === 'error') {
        voiceError.value = true
        voiceMessage.value = 'Voice input could not be transcribed. Your description is unchanged. Try again or type instead.'
      } else if (props.demoOutcome === 'no-speech') {
        voiceMessage.value = 'No speech detected. Try again or type the description.'
      } else {
        emit('update:modelValue', mergeTranscriptWithDraft(props.modelValue, 'Review the project flow and list the remaining improvements.'))
        voiceMessage.value = 'Sample transcription added. Review or edit the text before saving.'
      }
    }, 800)
  }
}
const addFiles = (files: File[]) => {
  if (props.disabled || adding.value || !files.length) return
  const entries: TaskContextFile[] = files.map(file => ({ id: `context-${Date.now()}-${nextFileId++}`, name: file.name, size: file.size, type: file.type.startsWith('image/') ? 'Image' : file.type.startsWith('audio/') ? 'Audio' : 'File', ...(file.type.startsWith('image/') ? { previewUrl: URL.createObjectURL(file) } : {}) }))
  emit('update:attachments', [...props.attachments, ...entries])
  expanded.value = true
  adding.value = true
  addingTimer = setTimeout(() => { adding.value = false }, 300)
}
const removeFile = (id: string) => emit('update:attachments', props.attachments.filter(file => file.id !== id))
const onSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  addFiles(Array.from(input.files || []))
  input.value = ''
}
const onDrop = (event: DragEvent) => addFiles(Array.from(event.dataTransfer?.files || []))
const onPaste = (event: ClipboardEvent) => {
  const files = Array.from(event.clipboardData?.files || [])
  if (files.length) { event.preventDefault(); addFiles(files) }
}
onBeforeUnmount(() => {
  if (voiceTimer !== undefined) clearTimeout(voiceTimer)
  if (addingTimer !== undefined) clearTimeout(addingTimer)
})
</script>
