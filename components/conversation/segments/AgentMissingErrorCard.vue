<template>
  <!-- agent-definition-reconnect-ui: the AGENT_DEFINITION_MISSING error. It names the missing agent,
       says what happened and offers Reconnect; it stays in the conversation (DEC-013). Once the run
       is reconnected it turns grey and says which agent the run uses now. -->
  <div
    v-if="!resolvedAgent"
    class="my-3 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
    role="alert"
    data-test="agent-missing-error-card"
  >
    <Icon icon="heroicons:exclamation-circle-20-solid" class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" aria-hidden="true" />
    <div class="min-w-0 flex-1">
      <p class="text-sm font-semibold text-red-900">{{ $t('reconnect.card.title', { id: definitionId }) }}</p>
      <p class="mt-1 text-sm leading-5 text-red-800">{{ $t('reconnect.card.detail') }}</p>
      <button
        v-if="missing"
        type="button"
        class="mt-3 inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
        :aria-label="$t('reconnect.actionAria', { name: missing.name })"
        data-test="agent-missing-error-reconnect"
        @click="dialogOpen = true"
      >
        <Icon icon="heroicons:link-20-solid" class="h-4 w-4 text-gray-500" aria-hidden="true" />
        {{ $t('reconnect.action') }}
      </button>
    </div>
    <ReconnectAgentDialog :open="dialogOpen" :missing="missing" @close="dialogOpen = false" />
  </div>
  <div
    v-else
    class="my-3 flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
    data-test="agent-missing-error-card-resolved"
  >
    <Icon icon="heroicons:exclamation-circle-20-solid" class="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
    <div class="min-w-0 flex-1">
      <p class="text-sm font-semibold text-gray-700">{{ $t('reconnect.card.title', { id: definitionId }) }}</p>
      <p class="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
        <Icon icon="heroicons:check-circle-20-solid" class="h-4 w-4 flex-shrink-0 text-emerald-500" aria-hidden="true" />
        <span>{{ $t('reconnect.card.resolved', { agent: resolvedAgent.name }) }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import type { ErrorSegment } from '~/types/segments'
import { useActiveContextStore } from '~/stores/activeContextStore'
import { useAgentReconnect } from '~/composables/agentReconnect/useAgentReconnect'
import ReconnectAgentDialog from '~/components/workspace/reconnect/ReconnectAgentDialog.vue'

const props = defineProps<{ segment: ErrorSegment }>()

const active = useActiveContextStore()
const api = useAgentReconnect()
const dialogOpen = ref(false)
const runId = computed(() => active.activeWorkspaceTarget?.context.state.runId ?? null)
const missing = computed(() => api.missingForRun(runId.value))
/** The id named by the error ("Agent definition 'x' no longer exists."). */
const definitionId = computed(() => /'([^']+)'/.exec(props.segment.message)?.[1] ?? missing.value?.missingDefinitionId ?? '')
const resolvedAgent = computed(() => (missing.value ? null : api.reconnectedAgent(runId.value)))
</script>
