<template>
  <div
    ref="rootRef"
    class="relative rounded-xl border bg-white shadow-sm transition-shadow focus-within:border-gray-300 focus-within:shadow-md"
    :class="size === 'large' ? 'border-gray-300' : 'border-gray-200'"
    data-test="chat-composer"
    @dragover.prevent="dragging = true"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
    @paste="onPaste"
  >
    <input ref="fileInputRef" type="file" multiple class="hidden" data-test="chat-file-input" @change="onFileSelect">
    <!-- Drop overlay -->
    <div
      v-if="dragging"
      class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/80 text-sm font-medium text-blue-700"
      data-test="composer-drop-overlay"
    >
      Drop files to attach
    </div>
    <!-- Tagged skills (and an optional non-default agent) -->
    <div v-if="hasChips()" class="flex flex-wrap items-center gap-1.5 px-3 pt-3" data-test="chat-skill-chips">
      <slot name="chips" />
      <span
        v-for="name in skills"
        :key="name"
        class="inline-flex max-w-full items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 py-0.5 pl-1.5 pr-1 text-xs font-medium text-indigo-700"
        :data-test="`chat-skill-chip-${name}`"
      >
        <Icon icon="heroicons:sparkles" class="h-3.5 w-3.5 flex-shrink-0" />
        <span class="truncate">/{{ name }}</span>
        <button
          type="button"
          class="rounded p-0.5 text-indigo-400 hover:bg-indigo-100 hover:text-indigo-700"
          :aria-label="`Remove skill ${name}`"
          @click="removeSkill(name)"
        >
          <ChatGlyph name="x" class="h-3 w-3" />
        </button>
      </span>
      <ComposerAttachmentChips :items="attachmentItems" @open="openAttachment" @remove="removeAttachment" @clear="emit('update:attachments', [])" />
    </div>

    <textarea
      ref="textareaRef"
      :value="modelValue"
      data-test="chat-composer-input"
      class="block w-full resize-none border-0 bg-transparent px-4 text-[0.9375rem] leading-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
      :class="hasChips() ? 'pt-2 pb-1' : size === 'large' ? 'pt-4 pb-2' : 'pt-3 pb-1'"
      :style="{ height: `${height}px` }"
      :placeholder="placeholder"
      :aria-label="placeholder"
      :disabled="starting"
      @input="onInput"
      @click="detectSlash"
      @keydown="onTextareaKeydown"
    ></textarea>

    <div class="flex flex-wrap items-center gap-0.5 px-2 pb-2 pt-1">
      <button
        type="button"
        class="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        title="Attach files (or drag, drop, paste)"
        aria-label="Attach files"
        data-test="chat-attach"
        @click="fileInputRef?.click()"
      >
        <ChatGlyph name="paperclip" class="h-4 w-4" />
      </button>
      <slot name="left" />
      <div class="ml-auto flex items-center gap-0.5">
        <slot name="right" />
        <span class="w-1"></span>
        <button
          v-if="voiceAvailable || voice !== 'idle'"
          type="button"
          data-test="composer-voice"
          class="flex h-8 w-8 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          :class="voice === 'recording' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'"
          :title="voice === 'recording' ? 'Stop recording' : 'Start voice input'"
          :aria-label="voice === 'recording' ? 'Stop recording' : 'Start voice input'"
          :disabled="voice === 'transcribing' || starting"
          @click="toggleVoice"
        >
          <Icon :icon="voice === 'recording' ? 'heroicons:stop-solid' : 'heroicons:microphone-solid'" class="h-4 w-4" />
        </button>
        <button
          v-if="running"
          type="button"
          data-test="chat-stop"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          title="Stop generation"
          aria-label="Stop generation"
          @click="emit('stop')"
        >
          <ChatGlyph name="stop" class="h-4 w-4" />
        </button>
        <button
          v-else
          type="button"
          data-test="chat-send"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="!canSend"
          :title="sendBlockedReason || 'Send message'"
          :aria-label="sendBlockedReason || 'Send message'"
          @click="submit"
        >
          <span v-if="starting" class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
          <ChatGlyph v-else name="send" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div
      v-if="voice !== 'idle'"
      class="mx-3 mb-2 flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium"
      :class="voice === 'recording' ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'"
      data-test="composer-voice-status"
    >
      <span class="flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full" :class="voice === 'recording' ? 'animate-pulse bg-red-500' : 'bg-blue-500'"></span>
        {{ voice === 'recording' ? 'Listening… click stop when done' : 'Transcribing voice input…' }}
      </span>
      <span v-if="voice === 'recording'" class="tabular-nums text-[0.6875rem]">0:0{{ voiceSeconds }}</span>
    </div>

    <FullScreenImageModal
      v-if="previewUrl"
      :visible="Boolean(previewUrl)"
      :image-url="previewUrl"
      alt-text="Attachment preview"
      @close="previewUrl = null"
    />

    <!-- Skill menu: opened by the Skills button or by typing "/" -->
    <div
      v-if="picker.open.value"
      data-test="chat-skill-menu"
      class="absolute left-2 z-50 flex w-[23rem] max-w-[calc(100%-1rem)] flex-col rounded-lg border border-gray-200 bg-white text-left shadow-lg"
      :class="picker.placement.value === 'above' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'"
    >
      <p class="border-b border-gray-100 px-3 py-1.5 text-[0.6875rem] text-gray-400">
        <template v-if="menuKind === 'target'">Chat with <span class="font-medium text-gray-600">@{{ slashQuery }}</span> · ↑↓ to move, Enter to choose</template>
        <template v-else>Skills matching <span class="font-medium text-gray-600">/{{ slashQuery }}</span> · ↑↓ to move, Enter to add</template>
      </p>
      <ul v-if="menuKind === 'target'" role="listbox" aria-label="Agents and teams" class="max-h-64 overflow-y-auto p-1" data-test="chat-target-menu">
        <li v-if="!filteredTargets.length" class="px-2 py-3 text-center text-[0.8125rem] text-gray-500">No agents or teams match</li>
        <template v-for="(target, index) in filteredTargets" :key="target.key">
          <li v-if="index === 0 || filteredTargets[index - 1].group !== target.group" class="px-2 pb-0.5 pt-1.5 text-[0.6875rem] font-medium text-gray-400">{{ target.group }}</li>
          <li role="option" :aria-selected="index === highlight ? 'true' : 'false'">
            <button
              type="button"
              :data-test="`chat-target-option-${target.id}`"
              class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left focus:outline-none"
              :class="index === highlight ? 'bg-gray-100' : 'hover:bg-gray-50'"
              @mouseenter="highlight = index"
              @mousedown.prevent
              @click="chooseTarget(index)"
            >
              <span
                class="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center text-[0.5625rem] font-semibold text-slate-600"
                :class="target.kind === 'team' ? 'rounded-md border border-gray-200 bg-gray-50' : 'rounded-full border border-emerald-200 bg-emerald-50'"
              >{{ target.initials }}</span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-[0.8125rem] font-medium text-gray-900">{{ target.name }}</span>
                <span class="block truncate text-xs text-gray-500">{{ target.description }}</span>
              </span>
            </button>
          </li>
        </template>
      </ul>
      <ul v-else role="listbox" aria-label="Skills" class="max-h-64 overflow-y-auto p-1">
        <li v-if="!filteredSkills.length" class="px-2 py-3 text-center text-[0.8125rem] text-gray-500">No skills match</li>
        <li v-for="(skill, index) in filteredSkills" :key="skill.name" role="option" :aria-selected="index === highlight ? 'true' : 'false'">
          <button
            type="button"
            :data-test="`chat-skill-option-${skill.name}`"
            class="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left focus:outline-none"
            :class="index === highlight ? 'bg-gray-100' : 'hover:bg-gray-50'"
            @mouseenter="highlight = index"
            @mousedown.prevent
            @click="chooseSkill(skill.name)"
          >
            <Icon icon="heroicons:sparkles" class="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-[0.8125rem] font-medium text-gray-900">{{ skill.name }}</span>
              <span class="block truncate text-xs text-gray-500">{{ skill.description }}</span>
            </span>
            <ChatGlyph v-if="skills.includes(skill.name)" name="check" class="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
          </button>
        </li>
      </ul>
      <footer v-if="menuKind === 'target'" class="border-t border-gray-100 px-3 py-1.5 text-xs text-gray-400">
        Teams: your message goes to the coordinator
      </footer>
      <footer v-else class="flex items-center justify-between border-t border-gray-100 px-3 py-1.5 text-xs text-gray-400">
        <span>All skills are available to the assistant</span>
        <NuxtLink to="/skills" class="inline-flex items-center gap-1 whitespace-nowrap font-medium text-blue-700 hover:underline">
          Manage skills <ChatGlyph name="arrow-right" class="h-3 w-3" />
        </NuxtLink>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useSlots, watch } from 'vue'
import { Icon } from '@iconify/vue'
import ChatGlyph from '~/components/chat/ChatGlyph.vue'
import ComposerAttachmentChips, { type ComposerAttachmentItem } from '~/components/composer/ComposerAttachmentChips.vue'
import FullScreenImageModal from '~/components/common/FullScreenImageModal.vue'
import { useVoiceInputStore } from '~/stores/voiceInputStore'
import type { ChatAttachment } from '~/prototype/chat/chat-fixtures'
import { CHAT_AGENTS, CHAT_ASSISTANT_ID, CHAT_SKILLS, CHAT_TEAMS } from '~/prototype/chat/chat-fixtures'
import { useChatPopover } from '~/composables/chat/useChatPopover'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder: string
  skills?: string[]
  attachments?: ChatAttachment[]
  size?: 'large' | 'normal'
  running?: boolean
  starting?: boolean
  sendBlockedReason?: string | null
  autofocus?: boolean
  /** Enable "@" to address an agent or team (new chats only). */
  mentions?: boolean
}>(), { skills: () => [], attachments: () => [], size: 'normal', running: false, starting: false, sendBlockedReason: null, autofocus: false, mentions: false })

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:skills', value: string[]): void
  (e: 'update:attachments', value: ChatAttachment[]): void
  (e: 'send'): void
  (e: 'stop'): void
  (e: 'attach'): void
  (e: 'select-target', value: { kind: 'agent' | 'team'; id: string }): void
}>()

const slots = useSlots()
const rootRef = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const minHeight = computed(() => (props.size === 'large' ? 88 : 52))
const height = ref(minHeight.value)
const canSend = computed(() => !props.starting && !props.sendBlockedReason && (props.modelValue.trim().length > 0 || props.skills.length > 0 || props.attachments.length > 0))
// Evaluated at render time: slots are not reactive, so this must not be a computed.
const hasChips = () => props.skills.length > 0 || props.attachments.length > 0 || Boolean(slots.chips)

// Attachments (prototype-native: local files, previews via object URLs)
const fileInputRef = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const previewUrl = ref<string | null>(null)
const attachmentItems = computed<ComposerAttachmentItem[]>(() => props.attachments.map((item) => ({ key: item.id, label: item.name, kind: item.kind, previewUrl: item.previewUrl })))
let attachmentCounter = 0
const addFiles = (files: File[]) => {
  if (!files.length) return
  const next = files.map((file) => ({
    id: `att-${Date.now().toString(36)}-${attachmentCounter++}`,
    name: file.name || 'pasted-image.png',
    kind: (file.type.startsWith('image/') ? 'image' : 'file') as ChatAttachment['kind'],
    previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
  }))
  emit('update:attachments', [...props.attachments, ...next])
  nextTick(() => textareaRef.value?.focus())
}
const onFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  addFiles(Array.from(input.files ?? []))
  input.value = ''
}
const onDragLeave = (event: DragEvent) => {
  if (!rootRef.value?.contains(event.relatedTarget as Node | null)) dragging.value = false
}
const onDrop = (event: DragEvent) => {
  dragging.value = false
  addFiles(Array.from(event.dataTransfer?.files ?? []))
}
const onPaste = (event: ClipboardEvent) => {
  const files = Array.from(event.clipboardData?.files ?? [])
  if (files.length) {
    event.preventDefault()
    addFiles(files)
  }
}
const removeAttachment = (key: string) => emit('update:attachments', props.attachments.filter((item) => item.id !== key))
const openAttachment = (key: string) => {
  const item = props.attachments.find((candidate) => candidate.id === key)
  if (item?.previewUrl) previewUrl.value = item.previewUrl
}

// Voice input: shown only when the Voice Input extension is installed and enabled
// (same rule as the run views). Recording is simulated in the prototype.
const voiceInputStore = useVoiceInputStore()
const voiceAvailable = computed(() => voiceInputStore.isAvailable)
const voice = ref<'idle' | 'recording' | 'transcribing'>('idle')
const voiceSeconds = ref(0)
let voiceTimer: ReturnType<typeof setInterval> | null = null
const toggleVoice = () => {
  if (voice.value === 'idle') {
    voice.value = 'recording'
    voiceSeconds.value = 0
    voiceTimer = setInterval(() => { voiceSeconds.value = Math.min(9, voiceSeconds.value + 1) }, 1000)
    return
  }
  if (voice.value === 'recording') {
    if (voiceTimer) clearInterval(voiceTimer)
    voice.value = 'transcribing'
    setTimeout(() => {
      const spoken = 'Summarize what we have so far and suggest next steps.'
      emit('update:modelValue', props.modelValue ? `${props.modelValue} ${spoken}` : spoken)
      voice.value = 'idle'
      nextTick(() => { resize(); textareaRef.value?.focus() })
    }, 900)
  }
}

// Skill menu state
// The menu opens only from typing "/" (skills) or "@" (agents/teams).
const picker = useChatPopover(rootRef, textareaRef, 340)
const pickerMode = ref<'slash'>('slash')
const menuKind = ref<'skill' | 'target'>('skill')
const slashQuery = ref('')
const slashStart = ref(-1)
const highlight = ref(0)
const activeQuery = computed(() => slashQuery.value.trim().toLowerCase())
// Rank: name prefix, then name contains, then description contains.
const filteredSkills = computed(() => {
  const q = activeQuery.value
  if (!q) return CHAT_SKILLS
  const rank = (name: string, description: string) => name.startsWith(q) ? 0 : name.includes(q) ? 1 : description.toLowerCase().includes(q) ? 2 : 3
  return CHAT_SKILLS
    .map((skill, index) => ({ skill, index, score: rank(skill.name, skill.description) }))
    .filter((item) => item.score < 3)
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map((item) => item.skill)
})
watch(activeQuery, () => { highlight.value = 0 })

const filteredTargets = computed(() => {
  const q = activeQuery.value
  const all = [
    ...CHAT_AGENTS.filter((agent) => agent.id !== CHAT_ASSISTANT_ID).map((agent) => ({ key: `agent:${agent.id}`, kind: 'agent' as const, id: agent.id, name: agent.name, initials: agent.initials, description: agent.description, group: 'Agents' })),
    ...CHAT_TEAMS.map((team) => ({ key: `team:${team.id}`, kind: 'team' as const, id: team.id, name: team.name, initials: team.initials, description: `${team.memberCount} members · coordinator ${team.coordinator}`, group: 'Agent teams' })),
  ]
  if (!q) return all
  return all.filter((item) => item.name.toLowerCase().includes(q) || item.id.includes(q))
})
const activeCount = computed(() => (menuKind.value === 'target' ? filteredTargets.value.length : filteredSkills.value.length))

const resize = () => {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  height.value = Math.min(240, Math.max(minHeight.value, el.scrollHeight))
  el.style.height = `${height.value}px`
}

const detectSlash = () => {
  const el = textareaRef.value
  if (!el) return
  const before = el.value.slice(0, el.selectionStart ?? el.value.length)
  const match = /(^|\s)([/@])([\w.-]*)$/.exec(before)
  if (match && (match[2] === '/' || props.mentions)) {
    pickerMode.value = 'slash'
    menuKind.value = match[2] === '@' ? 'target' : 'skill'
    slashQuery.value = match[3]
    slashStart.value = before.length - match[3].length - 1
    if (!picker.open.value) void picker.show()
  } else if (picker.open.value && pickerMode.value === 'slash') {
    picker.close(false)
  }
}

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
  nextTick(() => { resize(); detectSlash() })
}

const addSkill = (name: string) => {
  if (!props.skills.includes(name)) emit('update:skills', [...props.skills, name])
}
const removeSkill = (name: string) => {
  emit('update:skills', props.skills.filter((item) => item !== name))
  nextTick(() => textareaRef.value?.focus())
}

const chooseSkill = (name: string) => {
  if (pickerMode.value === 'slash' && slashStart.value >= 0) {
    const el = textareaRef.value
    const caret = el?.selectionStart ?? props.modelValue.length
    const next = (props.modelValue.slice(0, slashStart.value) + props.modelValue.slice(caret)).replace(/^\s+/, '')
    emit('update:modelValue', next)
    addSkill(name)
    picker.close(false)
    nextTick(() => {
      resize()
      const pos = Math.min(slashStart.value, next.length)
      textareaRef.value?.focus()
      textareaRef.value?.setSelectionRange(pos, pos)
    })
  } else {
    addSkill(name)
    picker.close(false)
    nextTick(() => textareaRef.value?.focus())
  }
}

const removeTriggerText = () => {
  const el = textareaRef.value
  const caret = el?.selectionStart ?? props.modelValue.length
  const next = (props.modelValue.slice(0, slashStart.value) + props.modelValue.slice(caret)).replace(/^\s+/, '')
  emit('update:modelValue', next)
  nextTick(() => {
    resize()
    const pos = Math.min(slashStart.value, next.length)
    textareaRef.value?.focus()
    textareaRef.value?.setSelectionRange(pos, pos)
  })
}

const chooseTarget = (index: number) => {
  const target = filteredTargets.value[index]
  if (!target) return
  removeTriggerText()
  picker.close(false)
  emit('select-target', { kind: target.kind, id: target.id })
}

const chooseHighlighted = () => {
  if (menuKind.value === 'target') chooseTarget(highlight.value)
  else if (filteredSkills.value[highlight.value]) chooseSkill(filteredSkills.value[highlight.value].name)
}

const moveHighlight = (delta: number) => {
  const count = activeCount.value
  if (!count) return
  highlight.value = (highlight.value + delta + count) % count
}

const onTextareaKeydown = (event: KeyboardEvent) => {
  if (picker.open.value && pickerMode.value === 'slash') {
    if (event.key === 'ArrowDown') { event.preventDefault(); moveHighlight(1); return }
    if (event.key === 'ArrowUp') { event.preventDefault(); moveHighlight(-1); return }
    if ((event.key === 'Enter' || event.key === 'Tab') && activeCount.value) {
      event.preventDefault()
      chooseHighlighted()
      return
    }
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); picker.close(false); return }
  }
  if (event.key === 'Enter' && !event.shiftKey && !event.altKey && !event.metaKey && !event.ctrlKey) {
    event.preventDefault()
    submit()
  }
}

const submit = () => {
  if (props.running || !canSend.value) return
  emit('send')
}
watch(() => props.modelValue, (value) => { if (!value) nextTick(resize) })
onMounted(() => {
  if (props.autofocus) textareaRef.value?.focus()
  void voiceInputStore.initialize().catch(() => undefined)
})
defineExpose({ focus: () => textareaRef.value?.focus() })
</script>
