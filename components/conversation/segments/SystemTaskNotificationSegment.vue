<template>
  <div
    class="system-task-notification mb-4 text-gray-900 dark:text-slate-100"
    :class="isRoutingRequest ? 'rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/40' : ''"
    data-testid="system-task-notification-segment"
    role="note"
    :aria-label="isSkillUpdate
      ? $t('workspace.components.conversation.segments.SystemTaskNotificationSegment.skillUpdated')
      : isRoutingRequest
        ? $t('workspace.components.conversation.segments.SystemTaskNotificationSegment.routingRequest')
        : $t('workspace.components.conversation.segments.SystemTaskNotificationSegment.system_task_notification')"
  >
    <div
      v-if="isSkillUpdate"
      class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400"
      data-testid="system-task-notification-label"
    >
      {{ $t('workspace.components.conversation.segments.SystemTaskNotificationSegment.skillUpdated') }}
    </div>
    <!-- delegated-runtime-model-routing: a routing request the platform hands the Model Router, labelled like the skill-update notice. -->
    <div
      v-else-if="isRoutingRequest"
      class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400"
      data-testid="system-task-notification-label"
    >
      {{ $t('workspace.components.conversation.segments.SystemTaskNotificationSegment.routingRequest') }}
    </div>
    <MarkdownRenderer
      :content="segment.content"
      :enable-event-monitor-file-actions="enableEventMonitorFileActions"
      @file-path-action="emit('file-path-action', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SystemTaskNotificationSegment } from '~/types/segments';
import MarkdownRenderer from '~/components/conversation/segments/renderer/MarkdownRenderer.vue';
import type { AbsoluteFilePathAction } from '~/utils/eventMonitorFilePaths/absoluteFilePathAction';

/** The platform's skill update notice: its sender, or its header (replayed history). */
const SKILL_UPDATE_NOTICE_SENDER_ID = 'system.skill_update_notifier';
const SKILL_UPDATE_NOTICE_HEADER = '[Platform notice — skill updated]';

const props = withDefaults(defineProps<{
  segment: SystemTaskNotificationSegment;
  enableEventMonitorFileActions?: boolean;
}>(), { enableEventMonitorFileActions: false });

const emit = defineEmits<{
  (event: 'file-path-action', action: AbsoluteFilePathAction): void;
}>();

const ROUTING_REQUEST_SENDER_ID = 'system.model_router';
const isRoutingRequest = computed(() => props.segment.senderId === ROUTING_REQUEST_SENDER_ID);
const isSkillUpdate = computed(() =>
  props.segment.senderId === SKILL_UPDATE_NOTICE_SENDER_ID
  || props.segment.content.startsWith(SKILL_UPDATE_NOTICE_HEADER));
</script>
