<template>
  <!-- Outcome of an `@` mention in this conversation: a collaborator joined the run, or could not be added. -->
  <div v-if="notices.length" class="mb-2 space-y-2" data-test="run-mention-notices">
    <div
      v-for="notice in notices"
      :key="notice.id"
      class="flex items-start gap-2 rounded-lg border px-3 py-2 text-sm"
      :class="notice.kind === 'failed' ? 'border-red-200 bg-red-50 text-red-800' : 'border-sky-200 bg-sky-50 text-sky-900'"
      :role="notice.kind === 'failed' ? 'alert' : 'status'"
      :data-test="`run-mention-notice-${notice.kind}`"
    >
      <Icon
        :icon="notice.kind === 'failed' ? 'heroicons:exclamation-triangle-20-solid' : 'heroicons:user-plus-20-solid'"
        class="mt-0.5 h-4 w-4 flex-shrink-0"
        :class="notice.kind === 'failed' ? 'text-red-500' : 'text-sky-600'"
        aria-hidden="true"
      />
      <div class="min-w-0 flex-1">
        <p class="font-medium">
          {{ notice.kind === 'failed'
            ? $t('chat.mentions.noticeFailed', { name: notice.definitionName })
            : $t('chat.mentions.noticeAdded', { name: notice.definitionName }) }}
        </p>
        <p class="mt-0.5 text-xs" :class="notice.kind === 'failed' ? 'text-red-700' : 'text-sky-800'">
          {{ notice.kind === 'failed'
            ? $t('chat.mentions.noticeFailedDetail', { reason: notice.detail })
            : $t('chat.mentions.noticeAddedDetail') }}
        </p>
      </div>
      <button
        v-if="notice.kind === 'added' && notice.entryAgentRunId"
        type="button"
        class="flex-shrink-0 rounded-md border border-sky-300 bg-white px-2 py-1 text-xs font-medium text-sky-800 hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        data-test="run-mention-notice-open"
        @click="open(notice.id, notice.entryAgentRunId)"
      >{{ $t('chat.mentions.noticeOpen', { name: notice.detail }) }}</button>
      <button
        type="button"
        class="flex-shrink-0 rounded p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        :class="notice.kind === 'failed' ? 'text-red-400 hover:bg-red-100 hover:text-red-700' : 'text-sky-500 hover:bg-sky-100 hover:text-sky-800'"
        :aria-label="$t('chat.mentions.noticeDismiss')"
        data-test="run-mention-notice-dismiss"
        @click="dismissRunMentionNotice(rootRunId, notice.id)"
      >
        <Icon icon="heroicons:x-mark" class="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { dismissRunMentionNotice, runMentionNotices } from '~/prototype/run-mentions/runMentionState'

const props = defineProps<{ rootRunId: string; agentRunId: string }>()
const emit = defineEmits<{ (event: 'open', agentRunId: string): void }>()
const notices = computed(() => runMentionNotices(props.rootRunId, props.agentRunId))
const open = (noticeId: string, agentRunId: string) => {
  dismissRunMentionNotice(props.rootRunId, noticeId)
  emit('open', agentRunId)
}
</script>
