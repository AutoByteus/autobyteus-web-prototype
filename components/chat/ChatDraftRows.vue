<template>
  <!--
    chat-new-draft-kept-on-navigation: unsent New chats with content, directly under the Chat row
    (REQ-002), newest first. A row re-enters its draft (REQ-003); the × discards it (REQ-007).
  -->
  <ul
    v-if="rows.length"
    class="chat-draft-rows relative mt-0.5 space-y-px"
    data-test="chat-draft-rows"
    :aria-label="$t('shell.components.AppLeftPanel.drafts')"
  >
    <span class="pointer-events-none absolute bottom-1 left-5 top-1 w-px bg-gray-200" aria-hidden="true"></span>
    <TransitionGroup name="chat-draft-row">
      <li
        v-for="row in rows"
        :key="row.id"
        class="chat-draft-row group relative"
        :data-draft-id="row.id"
      >
        <button
          type="button"
          data-test="chat-draft-row"
          class="flex w-full min-w-0 flex-col rounded-md py-1.5 pl-9 pr-9 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
          :class="row.selected ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'"
          :aria-current="row.selected ? 'page' : undefined"
          :title="row.title"
          @click="emit('open', row.id)"
        >
          <span class="flex w-full min-w-0 items-center gap-1 text-[13px] leading-5" data-test="chat-draft-preview">
            <template v-if="row.preview">
              <span class="truncate">{{ row.preview }}</span>
            </template>
            <template v-else-if="!row.fileCount">
              <span class="truncate italic text-gray-400">{{ $t('shell.components.AppLeftPanel.draft_empty') }}</span>
            </template>
            <template v-else>
              <Icon icon="heroicons:paper-clip" class="h-3.5 w-3.5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              <span class="truncate text-gray-500">{{ filesLabel(row.fileCount) }}</span>
            </template>
          </span>
          <span class="flex w-full min-w-0 items-center gap-1 text-xs leading-4 text-gray-500" data-test="chat-draft-meta">
            <span class="flex-shrink-0 font-medium text-amber-700" data-test="chat-draft-marker">{{ $t('shell.components.AppLeftPanel.draft_marker') }}</span>
            <span class="flex-shrink-0 text-gray-300" aria-hidden="true">·</span>
            <Icon
              :icon="row.targetKind === 'team' ? 'heroicons:user-group' : 'heroicons:user'"
              class="h-3 w-3 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            <span class="min-w-0 truncate" data-test="chat-draft-target">{{ row.targetName }}</span>
            <template v-if="row.preview && row.fileCount">
              <span class="flex-shrink-0 text-gray-300" aria-hidden="true">·</span>
              <span class="inline-flex flex-shrink-0 items-center gap-0.5" data-test="chat-draft-files" :aria-label="filesLabel(row.fileCount)">
                <Icon icon="heroicons:paper-clip" class="h-3 w-3 text-gray-400" aria-hidden="true" />{{ row.fileCount }}
              </span>
            </template>
          </span>
        </button>

        <button
          type="button"
          data-test="chat-draft-discard"
          class="chat-draft-discard absolute right-1.5 top-1/2 inline-flex -translate-y-1/2 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-indigo-500 group-hover:opacity-100"
          :class="row.selected ? 'opacity-100' : 'opacity-0'"
          :title="$t('shell.components.AppLeftPanel.discard_draft')"
          :aria-label="`${$t('shell.components.AppLeftPanel.discard_draft')}: ${row.title}`"
          @click.stop="discard(row.id)"
        >
          <Icon icon="heroicons:x-mark" class="h-4 w-4" aria-hidden="true" />
        </button>
      </li>
    </TransitionGroup>
  </ul>
</template>

<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useChatDraftStore, type ChatDraft } from '~/stores/chatDraftStore'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useAgentTeamDefinitionStore } from '~/stores/agentTeamDefinitionStore'

const props = defineProps<{
  /** The New chat surface is showing (`/chat` without a run id). */
  onNewChat: boolean
}>()

const emit = defineEmits<{
  (event: 'open', id: string): void
  (event: 'discarded'): void
}>()

const { t } = useLocalization()
const chatDraftStore = useChatDraftStore()
const agentStore = useAgentDefinitionStore()
const teamStore = useAgentTeamDefinitionStore()

const targetName = (draft: ChatDraft): string => {
  if (draft.target.kind === 'team') {
    const teamId = draft.target.teamDefinitionId
    return teamStore.agentTeamDefinitions.find((team) => team.id === teamId)?.name ?? teamId
  }
  return agentStore.getAgentDefinitionById(draft.target.agentDefinitionId)?.name
    || draft.context.config.agentDefinitionName
    || draft.target.agentDefinitionId
}

/** One line: the typed text, else the chosen `/` skills; attachments only → no text preview. */
const previewOf = (draft: ChatDraft): string => {
  const text = draft.context.requirement.replace(/\s+/g, ' ').trim()
  if (text) return text
  if (draft.context.requestedSkillNames.length) return draft.context.requestedSkillNames.map((name) => `/${name}`).join(' ')
  return ''
}

const filesLabel = (count: number): string => (count === 1
  ? t('shell.components.AppLeftPanel.draft_file_one')
  : t('shell.components.AppLeftPanel.draft_files', { count }))

/**
 * Kept drafts with content, newest first. The open draft stays listed while it is open even if its
 * content is cleared, so the row never vanishes under the user's cursor (REQ-008: it goes once left).
 */
const rows = computed(() => {
  const listed = [...chatDraftStore.keptDrafts]
  const active = chatDraftStore.draft
  if (props.onNewChat && active && !listed.some((entry) => entry.id === active.id) && wasListed.has(active.id)) {
    listed.push(active)
    listed.sort((a, b) => b.createdAt - a.createdAt)
  }
  for (const entry of chatDraftStore.keptDrafts) wasListed.add(entry.id)
  return listed.map((entry) => {
    const preview = previewOf(entry)
    const fileCount = entry.context.contextFilePaths.length
    return {
      id: entry.id,
      preview,
      fileCount,
      targetKind: entry.target.kind,
      targetName: targetName(entry),
      selected: props.onNewChat && entry.id === chatDraftStore.activeDraftId,
      title: preview || (fileCount ? filesLabel(fileCount) : t('shell.components.AppLeftPanel.draft_empty')),
    }
  })
})
const wasListed = new Set<string>()

/** Whether the open New chat is a listed Draft row (it, not the Chat row, shows as selected). */
const selectedRowShown = computed(() => rows.value.some((row) => row.selected))
defineExpose({ selectedRowShown })

const discard = async (id: string) => {
  const ids = rows.value.map((row) => row.id)
  const index = ids.indexOf(id)
  const neighbour = ids[index + 1] ?? ids[index - 1] ?? null
  chatDraftStore.discardDraft(id)
  emit('discarded')
  await nextTick()
  // Keyboard focus stays in the list: the next row, else the previous one, else the Chat row.
  const target = neighbour
    ? document.querySelector<HTMLElement>(`[data-draft-id="${neighbour}"] [data-test="chat-draft-row"]`)
    : document.querySelector<HTMLElement>('[data-test="app-left-panel-chat"]')
  target?.focus()
}
</script>

<style scoped>
.chat-draft-row-enter-active,
.chat-draft-row-leave-active {
  transition: opacity 150ms ease-out, max-height 150ms ease-out;
  overflow: hidden;
  max-height: 3rem;
}

.chat-draft-row-enter-from,
.chat-draft-row-leave-to {
  opacity: 0;
  max-height: 0;
}

@media (hover: none) {
  .chat-draft-discard {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chat-draft-row-enter-active,
  .chat-draft-row-leave-active {
    transition: none;
  }
}
</style>
