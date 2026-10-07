<template>
  <!-- agent-definition-reconnect-ui: above the message box, like CollaboratorAddFailureNotice.
       Missing agent → one line with Reconnect (before the user sends anything). After a reconnect →
       a one-time confirmation, which ends with the run's next message or ×. -->
  <div v-if="notice || (missing && !errorCardIsLast)" class="mb-2" data-test="agent-reconnect-composer-notice">
    <div
      v-if="notice"
      class="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
      role="status"
      data-test="agent-reconnected-notice"
    >
      <Icon icon="heroicons:check-circle-20-solid" class="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" aria-hidden="true" />
      <div class="min-w-0 flex-1">
        <p class="font-medium">{{ $t('reconnect.done.title', { agent: notice.agentName }) }}</p>
        <p class="mt-0.5 text-xs text-emerald-800">{{ $t('reconnect.done.detail') }}</p>
        <p
          v-if="notice.instructionsFromNewSession"
          class="mt-1 text-xs text-emerald-800"
          data-test="agent-reconnected-instructions-note"
        >
          {{ $t('reconnect.done.instructions', { runtime: notice.runtime, agent: notice.agentName }) }}
        </p>
      </div>
      <button
        type="button"
        class="flex-shrink-0 rounded p-1 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        :aria-label="$t('reconnect.done.dismiss')"
        data-test="agent-reconnected-dismiss"
        @click="api.dismissNotice(notice.agentRunId)"
      >
        <Icon icon="heroicons:x-mark" class="h-4 w-4" aria-hidden="true" />
      </button>
    </div>

    <div
      v-else-if="missing"
      class="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
      role="status"
      data-test="agent-missing-notice"
    >
      <!-- In a narrow window the button moves under the text, aligned with it. -->
      <div class="flex min-w-[15rem] flex-1 items-start gap-2">
        <Icon icon="heroicons:exclamation-triangle-20-solid" class="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" aria-hidden="true" />
        <div class="min-w-0 flex-1">
          <p class="break-words font-medium">{{ $t('reconnect.notice.title', { id: missing.missingDefinitionId }) }}</p>
          <p class="mt-0.5 text-xs text-amber-800">{{ $t('reconnect.notice.detail') }}</p>
        </div>
      </div>
      <button
        type="button"
        class="ml-6 flex-shrink-0 rounded-md border border-amber-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
        :aria-label="$t('reconnect.actionAria', { name: missing.name })"
        data-test="agent-missing-reconnect"
        @click="dialogOpen = true"
      >
        {{ $t('reconnect.action') }}
      </button>
    </div>

    <ReconnectAgentDialog :open="dialogOpen" :missing="missing" @close="dialogOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useActiveContextStore } from '~/stores/activeContextStore'
import { useAgentReconnect } from '~/composables/agentReconnect/useAgentReconnect'
import ReconnectAgentDialog from './ReconnectAgentDialog.vue'

const active = useActiveContextStore()
const api = useAgentReconnect()
const dialogOpen = ref(false)

const runId = computed(() => active.activeWorkspaceTarget?.context.state.runId ?? null)
const missing = computed(() => api.missingForRun(runId.value))
const notice = computed(() => api.noticeFor(runId.value))

/** Right after a failed send the error card (with its own Reconnect) is the last item: one action at a time. */
const errorCardIsLast = computed(() => {
  const messages = active.activeWorkspaceTarget?.context.state.conversation?.messages ?? []
  const last: any = messages[messages.length - 1]
  const segment = last?.type === 'ai' ? last.segments?.[last.segments.length - 1] : null
  return segment?.type === 'error' && segment.code === 'AGENT_DEFINITION_MISSING'
})
</script>
