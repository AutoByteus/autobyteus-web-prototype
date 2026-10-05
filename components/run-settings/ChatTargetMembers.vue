<template>
  <div class="w-full" data-test="chat-target-members" :data-open="open ? 'true' : 'false'">
    <!-- One quiet line: the lazy path never needs to open it. -->
    <p class="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-center text-xs text-gray-400 [&>*]:whitespace-nowrap" data-test="chat-members-line">
      <template v-if="customizedCount">
        <span class="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" aria-hidden="true"></span>
        <span class="text-gray-600">{{ $t('runSettings.chat.customizedMembers', { count: customizedCount, total: memberCount }) }}</span>
        <span aria-hidden="true">·</span>
        <button ref="triggerRef" type="button" class="font-medium text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40" aria-haspopup="dialog" :aria-expanded="open ? 'true' : 'false'" data-test="chat-members-toggle" @click="toggle">
          {{ $t('runSettings.chat.edit') }}
        </button>
        <span aria-hidden="true">·</span>
        <button type="button" class="font-medium text-gray-500 hover:text-gray-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40" data-test="chat-members-reset" @click="members.resetAll()">
          {{ $t('runSettings.chat.reset') }}
        </button>
      </template>
      <template v-else>
        <Icon icon="heroicons:user-group" class="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
        <span>{{ $t('runSettings.chat.allMembers', { count: memberCount }) }}</span>
        <span aria-hidden="true">·</span>
        <button ref="triggerRef" type="button" class="font-medium text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40" aria-haspopup="dialog" :aria-expanded="open ? 'true' : 'false'" data-test="chat-members-toggle" @click="toggle">
          {{ $t('runSettings.chat.customize') }}
        </button>
      </template>
    </p>

    <!-- Round 3: member settings slide in from the right edge; the composer stays visible and usable. -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-transform duration-200 ease-out motion-reduce:transition-none"
        enter-from-class="translate-x-full"
        leave-active-class="transition-transform duration-150 ease-in motion-reduce:transition-none"
        leave-to-class="translate-x-full"
      >
        <aside
          v-if="open"
          ref="panelRef"
          role="dialog"
          aria-modal="false"
          :aria-label="$t('runSettings.chat.panelTitle')"
          class="fixed inset-y-0 right-0 z-40 flex max-w-full flex-col border-l border-gray-200 bg-white shadow-[-8px_0_24px_-12px_rgba(15,23,42,0.18)]"
          :style="{ width: `${width}px` }"
          data-test="chat-members-panel"
        >
          <!-- Round 16: drag the left edge to widen or narrow the panel; the width is remembered.
               Round 19: no grip; the edge shows a thin blue line on hover and the resize cursor. -->
          <div
            role="separator"
            aria-orientation="vertical"
            tabindex="0"
            :aria-label="$t('runSettings.chat.resizeAria')"
            :aria-valuenow="width"
            :aria-valuemin="MIN_WIDTH"
            :aria-valuemax="maxWidth()"
            class="group absolute inset-y-0 -left-1.5 z-10 flex w-3 cursor-col-resize touch-none justify-center focus:outline-none max-sm:hidden"
            data-test="chat-members-resize"
            @pointerdown="startResize"
            @dblclick="setWidth(DEFAULT_WIDTH, true)"
            @keydown.left.prevent="setWidth(width + 24, true)"
            @keydown.right.prevent="setWidth(width - 24, true)"
          >
            <span
              class="h-full w-0.5 transition-colors duration-100"
              :class="resizing ? 'bg-blue-500' : 'bg-transparent group-hover:bg-blue-400 group-focus-visible:bg-blue-500'"
              aria-hidden="true"
            ></span>
          </div>
          <header class="flex items-start gap-3 border-b border-gray-200 px-5 py-4">
            <span class="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600" aria-hidden="true">
              <Icon :icon="draft.target.kind === 'org' ? 'heroicons:building-office-2' : 'heroicons:user-group'" class="h-[1.125rem] w-[1.125rem]" />
            </span>
            <div class="min-w-0 flex-1">
              <h2 class="truncate text-[0.9375rem] font-semibold leading-5 text-gray-900">{{ $t('runSettings.chat.panelTitle') }}</h2>
              <p class="mt-0.5 truncate text-xs text-gray-500">{{ targetName }}</p>
            </div>
            <button
              ref="closeRef"
              type="button"
              class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              :aria-label="$t('runSettings.chat.close')"
              data-test="chat-members-close"
              @click="close"
            >
              <Icon icon="heroicons:x-mark" class="h-4 w-4" aria-hidden="true" />
            </button>
          </header>

          <div class="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-2">
            <!-- Round 13: members only. The defaults are the message box beside the panel (one place to
                 change them). -->
            <RunMembersSection
              class="!mt-0"
              :nodes="members.nodes.value"
              @update="members.update"
              @reset="members.reset"
              @reset-all="members.resetAll"
            />
          </div>

          <!-- Round 12: only the action; the blue dots and the line under the message box carry the count. -->
          <footer class="flex items-center justify-end border-t border-gray-200 bg-gray-50 px-5 py-3">
            <button
              type="button"
              class="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              data-test="chat-members-done"
              @click="close"
            >
              {{ $t('runSettings.chat.done') }}
            </button>
          </footer>
        </aside>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, toRef } from 'vue'
import { Icon } from '@iconify/vue'
import type { ChatDraft } from '~/stores/chatDraftStore'
import { useAgentTeamDefinitionStore } from '~/stores/agentTeamDefinitionStore'
import { useAgentOrgDefinitionStore } from '~/stores/agentOrgDefinitionStore'
import RunMembersSection from './RunMembersSection.vue'
import { useChatTargetMembers } from './useChatTargetMembers'

/**
 * run-settings-ui-unification: member customization for a Team or Org New chat, reached from
 * one line under the composer and edited in a panel that slides in from the right (round 3).
 */
const props = defineProps<{ draft: ChatDraft }>()
const members = useChatTargetMembers(toRef(props, 'draft'))
const teamStore = useAgentTeamDefinitionStore()
const orgStore = useAgentOrgDefinitionStore()

const open = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const closeRef = ref<HTMLElement | null>(null)
const memberCount = computed(() => members.memberCount.value)
const customizedCount = computed(() => members.customizedCount.value)

const targetName = computed(() => {
  const target = props.draft.target
  if (target.kind === 'team') return teamStore.agentTeamDefinitions.find((team) => team.id === target.teamDefinitionId)?.name ?? ''
  if (target.kind === 'org') return orgStore.byId(target.orgDefinitionId)?.name ?? ''
  return ''
})

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
  (event: 'update:width', value: number): void
  (event: 'update:resizing', value: boolean): void
}>()

// Round 16: the panel's width can be dragged from its left edge and is remembered.
const WIDTH_STORAGE_KEY = 'autobyteus.chat.memberPanelWidth'
const DEFAULT_WIDTH = 480
const MIN_WIDTH = 400
/** Leave the message box at least 360px beside the panel; never wider than 960px. */
const maxWidth = () => Math.max(MIN_WIDTH, Math.min(960, window.innerWidth - 360))
const clampWidth = (value: number) => Math.round(Math.min(maxWidth(), Math.max(MIN_WIDTH, value)))
const storedWidth = Number(typeof localStorage !== 'undefined' ? localStorage.getItem(WIDTH_STORAGE_KEY) : NaN)
const width = ref(Number.isFinite(storedWidth) && storedWidth > 0 ? storedWidth : DEFAULT_WIDTH)
const resizing = ref(false)
const setWidth = (value: number, persist = false) => {
  width.value = clampWidth(value)
  emit('update:width', width.value)
  if (persist) localStorage.setItem(WIDTH_STORAGE_KEY, String(width.value))
}
const startResize = (event: PointerEvent) => {
  if (event.button !== 0) return
  event.preventDefault()
  resizing.value = true
  emit('update:resizing', true)
  const previousCursor = document.body.style.cursor
  const previousSelect = document.body.style.userSelect
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  const onMove = (move: PointerEvent) => setWidth(window.innerWidth - move.clientX)
  const onUp = () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onUp)
    document.body.style.cursor = previousCursor
    document.body.style.userSelect = previousSelect
    resizing.value = false
    emit('update:resizing', false)
    setWidth(width.value, true)
  }
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onUp)
}
const onWindowResize = () => setWidth(width.value)
// Escape closes an open menu inside the panel first, then the panel.
const onDocumentKey = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !open.value) return
  if (document.querySelector('[data-test="chat-members-panel"] [role="menu"], [data-test="chat-members-panel"] [data-test="chat-workspace-menu"]')) return
  close()
}
const toggle = async () => {
  if (open.value) { close(); return }
  setWidth(width.value)
  open.value = true
  emit('update:open', true)
  document.addEventListener('keydown', onDocumentKey)
  window.addEventListener('resize', onWindowResize)
  await nextTick()
  closeRef.value?.focus()
}
const close = () => {
  open.value = false
  emit('update:open', false)
  document.removeEventListener('keydown', onDocumentKey)
  window.removeEventListener('resize', onWindowResize)
  void nextTick(() => triggerRef.value?.focus())
}
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onDocumentKey)
  window.removeEventListener('resize', onWindowResize)
  emit('update:open', false)
})
</script>
