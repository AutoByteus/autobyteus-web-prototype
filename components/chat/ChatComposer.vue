<template>
  <!-- chat-interface-entry R2 (DEC-014): the Chat box is the product's existing
       message box (same frame, Context Files area, textarea, mic and send), plus
       Chat-only features: skill/agent chips, the "/" and "@" menus, and a footer
       row with workspace, auto-approve, runtime + model and thinking. -->
  <div
    ref="rootRef"
    class="relative rounded-xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-300"
    data-test="chat-composer"
  >
    <div class="overflow-hidden rounded-t-xl">
      <ChatContextFilesArea :model-value="attachments" @update:model-value="(value) => emit('update:attachments', value)" />
    </div>

    <div class="border-t border-gray-100">
      <div class="flex flex-col bg-white">
        <!-- Chat-only: tagged skills and an optional non-default agent/team -->
        <div v-if="hasChips()" class="flex flex-wrap items-center gap-1.5 px-3 pt-2.5" data-test="chat-skill-chips">
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
        </div>

        <!-- Same textarea, mic and send as the product box -->
        <div class="relative flex-grow">
          <textarea
            ref="textareaRef"
            :value="modelValue"
            data-test="chat-composer-input"
            class="w-full px-3 py-2.5 border-0 focus:ring-0 focus:outline-none resize-none bg-transparent text-[0.9375rem] leading-6"
            :style="{ height: `${height}px`, minHeight: `${MIN_HEIGHT}px`, maxHeight: `${MAX_HEIGHT}px` }"
            :placeholder="placeholder"
            :aria-label="placeholder"
            :disabled="starting"
            @input="onInput"
            @click="detectSlash"
            @keydown="onTextareaKeydown"
          ></textarea>

        </div>

        <div
          v-if="voice !== 'idle'"
          class="mx-3 mb-2 flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium"
          :class="voice === 'recording' ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'"
          data-test="composer-voice-status"
        >
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full" :class="voice === 'recording' ? 'animate-pulse bg-red-500' : 'bg-blue-500'"></span>
            <span>{{ voice === 'recording' ? 'Recording... Tap stop when you are done.' : 'Transcribing voice input...' }}</span>
          </div>
          <span v-if="voice === 'recording'" class="tabular-nums text-[0.6875rem] text-current/80">0:0{{ voiceSeconds }}</span>
        </div>
      </div>
    </div>

    <!-- Chat-only footer: what can still be changed for this chat -->
    <div class="flex flex-wrap items-center gap-0.5 rounded-b-xl border-t border-gray-100 bg-white px-2 py-1.5" data-test="chat-composer-footer">
      <slot name="left" />
      <div class="ml-auto flex items-center gap-0.5">
        <slot name="right" />
        <span class="w-1"></span>
        <!-- Mic, then send/stop: the last items of the footer row (product button styles) -->
        <button
          v-if="voiceAvailable || voice !== 'idle'"
          type="button"
          data-test="composer-voice"
          class="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          :class="voice === 'recording' ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400/50'"
          :title="voice === 'recording' ? 'Stop recording' : 'Start voice input'"
          :disabled="voice === 'transcribing' || starting"
          @click="toggleVoice"
        >
          <Icon :icon="voice === 'recording' ? 'heroicons:stop-solid' : 'heroicons:microphone-solid'" class="h-4 w-4" />
        </button>
        <button
          v-if="running"
          type="button"
          data-test="chat-stop"
          class="flex h-8 w-8 items-center justify-center text-white rounded-full focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm bg-red-600 hover:bg-red-700 focus:ring-red-500/50"
          title="Stop generation"
          aria-label="Stop generation"
          @click="emit('stop')"
        >
          <Icon icon="heroicons:stop-solid" class="h-4 w-4" />
        </button>
        <button
          v-else
          type="button"
          data-test="chat-send"
          class="flex h-8 w-8 items-center justify-center text-white rounded-full focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/50"
          :disabled="!canSend"
          :title="sendBlockedReason || 'Send message'"
          :aria-label="sendBlockedReason || 'Send message'"
          @click="submit"
        >
          <span v-if="starting" class="block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
          <Icon v-else icon="heroicons:paper-airplane-solid" class="h-4 w-4" />
        </button>
      </div>
    </div>

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
        <li v-if="!filteredSkills.length" class="px-2 py-3 text-center text-[0.8125rem] text-gray-500">{{ availableSkills && !availableSkills.length ? 'This agent has no skills' : 'No skills match' }}</li>
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
        <span>{{ availableSkills && availableSkills.length < CHAT_SKILLS.length ? "This agent's skills" : 'All skills are available' }}</span>
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
import ChatContextFilesArea from '~/components/chat/ChatContextFilesArea.vue'
import { useVoiceInputStore } from '~/stores/voiceInputStore'
import type { ChatAttachment } from '~/prototype/chat/chat-fixtures'
import { CHAT_AGENTS, CHAT_ASSISTANT_ID, CHAT_SKILLS, CHAT_TEAMS } from '~/prototype/chat/chat-fixtures'
import { useChatPopover } from '~/composables/chat/useChatPopover'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder: string
  skills?: string[]
  /** Skills the addressed agent has (Daily Assistant: all installed skills). Undefined = all. */
  availableSkills?: string[]
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
// Same sizing as the product text area.
const MIN_HEIGHT = 56
const MAX_HEIGHT = 220
const height = ref(MIN_HEIGHT)
const canSend = computed(() => !props.starting && !props.sendBlockedReason && (props.modelValue.trim().length > 0 || props.skills.length > 0 || props.attachments.length > 0))
// Evaluated at render time: slots are not reactive, so this must not be a computed.
const hasChips = () => props.skills.length > 0 || Boolean(slots.chips)

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
  const pool = props.availableSkills ? CHAT_SKILLS.filter((skill) => props.availableSkills!.includes(skill.name)) : CHAT_SKILLS
  if (!q) return pool
  const rank = (name: string, description: string) => name.startsWith(q) ? 0 : name.includes(q) ? 1 : description.toLowerCase().includes(q) ? 2 : 3
  return pool
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
  height.value = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, el.scrollHeight))
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
