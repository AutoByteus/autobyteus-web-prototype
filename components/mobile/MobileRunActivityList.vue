<template>
  <section data-testid="mobile-run-activity-list">
    <p v-if="!activities.length" class="px-4 py-10 text-center text-sm text-slate-500" data-testid="mobile-activity-empty">No activity yet</p>
    <template v-else>
      <MobileRunActivityItem
        v-for="activity in activities.slice(0, 30)"
        :key="activity.activityId"
        :activity="activity"
        :runtime-kind="runtimeKind"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import { useMobileFocusedRunIdentity } from '~/composables/mobile/useMobileFocusedRunIdentity';
import { useAgentActivityStore } from '~/stores/agentActivityStore';
import type { MobileWorkContext } from '~/types/mobileWork';
import MobileRunActivityItem from '~/components/mobile/MobileRunActivityItem.vue';

const props = defineProps<{
  context: MobileWorkContext | null;
}>();

const activityStore = useAgentActivityStore();
const { focusedRunId: runId, focusedAgentContext } = useMobileFocusedRunIdentity(toRef(props, 'context'));
const runtimeKind = computed(() => focusedAgentContext.value?.config.runtimeKind ?? null);
const activities = computed(() => {
  return runId.value ? activityStore.getActivities(runId.value) : [];
});
</script>
