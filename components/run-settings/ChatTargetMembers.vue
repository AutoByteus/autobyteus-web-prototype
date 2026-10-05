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
          class="fixed inset-y-0 right-0 z-40 flex w-full max-w-[30rem] flex-col border-l border-gray-200 bg-white shadow-[-8px_0_24px_-12px_rgba(15,23,42,0.18)]"
          data-test="chat-members-panel"
        >
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
            <!-- What every member gets unless changed: the composer's settings, read-only here. -->
            <!-- Round 13: members only. The defaults are the message box beside the panel (one place to
                 change them); an opened member shows what it inherits, muted. -->
            <RunMembersSection
              class="!mt-0"
              flat
              :nodes="members.nodes.value"
              :inherited-label="$t('runSettings.chat.inheritedLabel')"
              :defaults-label="$t('runSettings.chat.defaultsLabel')"
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

const emit = defineEmits<{ (event: 'update:open', value: boolean): void }>()
// Escape closes an open menu inside the panel first, then the panel.
const onDocumentKey = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !open.value) return
  if (document.querySelector('[data-test="chat-members-panel"] [role="menu"], [data-test="chat-members-panel"] [data-test="chat-workspace-menu"]')) return
  close()
}
const toggle = async () => {
  if (open.value) { close(); return }
  open.value = true
  emit('update:open', true)
  document.addEventListener('keydown', onDocumentKey)
  await nextTick()
  closeRef.value?.focus()
}
const close = () => {
  open.value = false
  emit('update:open', false)
  document.removeEventListener('keydown', onDocumentKey)
  void nextTick(() => triggerRef.value?.focus())
}
onBeforeUnmount(() => { document.removeEventListener('keydown', onDocumentKey); emit('update:open', false) })
</script>
