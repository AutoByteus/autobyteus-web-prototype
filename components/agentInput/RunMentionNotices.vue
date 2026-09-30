<template>
  <!-- An `@` mention that could not be brought into this run. Success needs no notice: the run tree shows it. -->
  <div v-if="notices.length" class="mb-2 space-y-2" data-test="run-mention-notices">
    <div
      v-for="notice in notices"
      :key="notice.id"
      class="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
      role="alert"
      data-test="run-mention-notice-failed"
    >
      <Icon icon="heroicons:exclamation-triangle-20-solid" class="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" aria-hidden="true" />
      <div class="min-w-0 flex-1">
        <p class="font-medium">{{ $t('chat.mentions.noticeFailed', { name: notice.definitionName }) }}</p>
        <p class="mt-0.5 text-xs text-red-700">{{ $t('chat.mentions.noticeFailedDetail', { reason: notice.detail }) }}</p>
      </div>
      <button
        type="button"
        class="flex-shrink-0 rounded p-1 text-red-400 hover:bg-red-100 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
const notices = computed(() => runMentionNotices(props.rootRunId, props.agentRunId))
</script>
