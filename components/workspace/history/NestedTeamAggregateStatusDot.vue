<template>
  <span
    class="inline-flex flex-shrink-0 items-center"
    role="img"
    :aria-label="statusLabel"
    :title="statusLabel"
    data-test="nested-team-aggregate-status-dot"
    :data-status="props.status"
  >
    <StatusDot :status="props.status" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import StatusDot from '~/components/workspace/common/StatusDot.vue';
import type { AgentStatus } from '~/types/agent/AgentStatus';

const props = defineProps<{ status: AgentStatus }>();
const statusLabel = computed(() => `Team status: ${props.status.charAt(0).toUpperCase()}${props.status.slice(1)}`);
</script>
