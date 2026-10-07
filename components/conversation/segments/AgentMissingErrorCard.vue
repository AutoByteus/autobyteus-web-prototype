<template>
  <!-- agent-definition-reconnect-ui (round 2): one row — what happened and Reconnect. It stays in the
       conversation (DEC-013); after a reconnect it turns grey and names the agent used now. -->
  <div
    v-if="!resolvedAgent"
    class="my-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 py-1.5 pl-3 pr-1.5 text-sm text-red-800"
    role="alert"
    data-test="agent-missing-error-card"
  >
    <Icon icon="heroicons:exclamation-circle-20-solid" class="h-4 w-4 flex-shrink-0 text-red-500" aria-hidden="true" />
    <p class="min-w-0 flex-1 truncate" :title="$t('reconnect.card.title', { id: definitionId })">{{ $t('reconnect.card.title', { id: definitionId }) }}</p>
    <button
      v-if="missing"
      type="button"
      class="flex-shrink-0 rounded-md px-2 py-1 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      :aria-label="$t('reconnect.actionAria', { name: missing.name })"
      data-test="agent-missing-error-reconnect"
      @click="dialogOpen = true"
    >
      {{ $t('reconnect.action') }}
    </button>
    <ReconnectAgentDialog :open="dialogOpen" :missing="missing" @close="dialogOpen = false" />
  </div>
  <p
    v-else
    class="my-3 flex items-center gap-2 text-sm text-gray-500"
    data-test="agent-missing-error-card-resolved"
  >
    <Icon icon="heroicons:check-circle-20-solid" class="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
    <span class="min-w-0 truncate">{{ $t('reconnect.card.resolved', { id: definitionId, agent: resolvedAgent.name }) }}</span>
  </p>
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
