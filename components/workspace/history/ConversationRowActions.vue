<template>
  <!-- The row's actions, exactly the trees' run-row actions: Stop while it runs; Archive and Delete on hover or focus; the time. -->
  <div class="flex items-center gap-1 leading-5" data-test="conversation-actions">
    <button
      v-if="stoppable"
      type="button"
      data-test="terminate-agent-run"
      class="inline-flex h-5 w-5 items-center justify-center rounded text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-400"
      :title="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.terminate_run')"
      :aria-label="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.terminate_run')"
      :disabled="busyStop"
      @click.stop="emit('stop')"
    >
      <Icon icon="heroicons:stop-20-solid" class="h-3.5 w-3.5" />
    </button>
    <button
      v-if="archivable"
      type="button"
      data-test="archive-run"
      class="inline-flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-[opacity,color,background-color] duration-150 hover:bg-amber-50 hover:text-amber-600 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 md:opacity-0 md:group-hover/run-row:opacity-100 md:group-focus-within/run-row:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
      :title="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.archive_run')"
      :aria-label="$t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.archive_run')"
      :disabled="busyArchive"
      @click.stop="emit('archive')"
    >
      <Icon icon="heroicons:archive-box-20-solid" class="h-3.5 w-3.5" />
    </button>
    <button
      v-if="deletable"
      type="button"
      data-test="delete-run"
      class="inline-flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-[opacity,color,background-color] duration-150 hover:bg-red-50 hover:text-red-600 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 md:opacity-0 md:group-hover/run-row:opacity-100 md:group-focus-within/run-row:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
      :title="$t(deleteRemovesDraft ? 'workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.remove_draft_run' : 'workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.delete_run_permanently')"
      :aria-label="$t(deleteRemovesDraft ? 'workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.remove_draft_run' : 'workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.delete_run_permanently')"
      :disabled="busyDelete"
      @click.stop="emit('delete')"
    >
      <Icon icon="heroicons:trash-20-solid" class="h-3.5 w-3.5" />
    </button>
    <span class="text-xs text-gray-400">{{ time }}</span>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

withDefaults(defineProps<{
  running?: boolean
  stoppable?: boolean
  archivable?: boolean
  deletable?: boolean
  deleteRemovesDraft?: boolean
  busyStop?: boolean
  busyArchive?: boolean
  busyDelete?: boolean
  time: string
}>(), { running: false, stoppable: false, archivable: false, deletable: false, deleteRemovesDraft: false, busyStop: false, busyArchive: false, busyDelete: false })
const emit = defineEmits<{ (event: 'stop'): void; (event: 'archive'): void; (event: 'delete'): void }>()
</script>
