<template>
  <!-- agent-definition-reconnect-ui (round 2): one short line above the message box.
       Missing agent → name + Reconnect. After a reconnect → "Reconnected to X" until the next message or ×. -->
  <div v-if="notice || (missing && !errorCardIsLast)" class="mb-2" data-test="agent-reconnect-composer-notice">
    <div
      v-if="notice"
      class="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 py-1.5 pl-3 pr-1.5 text-[0.8125rem] text-emerald-900"
      role="status"
      data-test="agent-reconnected-notice"
    >
      <Icon icon="heroicons:check-circle-20-solid" class="h-4 w-4 flex-shrink-0 text-emerald-500" aria-hidden="true" />
      <p class="min-w-0 flex-1 truncate">
        {{ $t('reconnect.done.title', { agent: notice.agentName }) }}
        <span
          v-if="notice.instructionsFromNewSession"
          class="text-emerald-700"
          :title="$t('reconnect.done.instructionsTitle', { runtime: notice.runtime })"
          data-test="agent-reconnected-instructions-note"
        > · {{ $t('reconnect.done.instructions', { runtime: notice.runtime }) }}</span>
      </p>
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
      class="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 py-1.5 pl-3 pr-1.5 text-[0.8125rem] text-amber-900"
      role="status"
      data-test="agent-missing-notice"
    >
      <Icon icon="heroicons:exclamation-triangle-20-solid" class="h-4 w-4 flex-shrink-0 text-amber-500" aria-hidden="true" />
      <p class="min-w-0 flex-1 truncate" :title="$t('reconnect.notice.title', { id: missing.missingDefinitionId })">
        {{ $t('reconnect.notice.title', { id: missing.missingDefinitionId }) }}
      </p>
      <button
        type="button"
        class="flex-shrink-0 rounded-md px-2 py-1 text-[0.8125rem] font-medium text-amber-900 hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
