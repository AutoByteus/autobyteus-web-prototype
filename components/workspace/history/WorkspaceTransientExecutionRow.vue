<template>
  <div
    class="transient-execution-row relative flex min-h-7 w-full cursor-pointer items-center rounded-md text-sm transition-colors focus:outline-none"
    :class="[rowClasses, added
      ? 'is-added focus-visible:ring-2 focus-visible:ring-indigo-500'
      : 'border border-dashed border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 focus-visible:ring-1 focus-visible:ring-indigo-300']"
    :data-added="added ? 'true' : undefined"
    :style="rowStyle"
    data-test="workspace-team-transient-execution-row"
    data-row-kind="transient_execution"
    :data-node-kind="row.memberKind"
    :data-transient-kind="row.transientKind"
    :data-team-run-id="row.teamRunId"
    :data-member-address="row.memberAddress"
    :data-agent-run-id="row.agentRunId ?? undefined"
    :data-tree-depth="row.depth"
    :title="identityLabel"
    :aria-label="accessibleLabel"
    :aria-current="isSelected ? 'true' : undefined"
    :aria-selected="isSelected"
    :aria-busy="inspectionAttempt?.state === 'loading' ? 'true' : undefined"
    :aria-level="row.depth + 1"
    :aria-expanded="hasChildren ? expanded : undefined"
    role="treeitem"
    tabindex="0"
    @click="activateRow"
    @keydown.enter="activateRow"
    @keydown.space.prevent="activateRow"
  >
    <WorkspaceHierarchyBranches
      :depth="row.depth"
      :continuing-ancestor-depths="continuingAncestorDepths"
      :has-following-sibling="hasFollowingSibling"
    />

    <button
      v-if="hasChildren"
      type="button"
      class="ml-2 mr-1 inline-flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      :class="added ? 'mt-[0.4375rem] self-start' : ''"
      data-test="workspace-team-transient-disclosure"
      :data-team-run-id="row.teamRunId"
      :data-member-address="row.memberAddress"
      :aria-expanded="expanded"
      :aria-label="disclosureLabel"
      :title="disclosureLabel"
      @click.stop="$emit('toggle', row)"
      @keydown.enter.stop
      @keydown.space.stop
    >
      <Icon
        icon="heroicons:chevron-down-20-solid"
        class="h-3.5 w-3.5 transition-transform"
        :class="expanded ? 'rotate-0' : '-rotate-90'"
        aria-hidden="true"
      />
    </button>
    <span
      v-else
      class="ml-2 mr-1 h-3.5 w-3.5 flex-shrink-0"
      aria-hidden="true"
    />

    <div class="flex min-w-0 flex-1 py-1 pr-2" :class="added ? 'items-center' : 'items-start'">
      <span class="member-status inline-flex flex-shrink-0 items-center" :class="addedEntry ? 'self-start pt-[0.3125rem]' : ''">
        <StatusDot
          v-if="row.memberKind === 'agent' && added"
          class="mr-1.5"
          data-test="workspace-added-status-dot"
          :status="row.currentStatus"
        />
        <TeamAggregateStatusDot
          v-else-if="added"
          class="mr-1.5"
          :status="addedTeamStatus"
        />
        <StatusDot
          v-else-if="row.memberKind === 'agent'"
          class="mr-1.5"
          data-test="workspace-transient-status-dot"
          :status="row.currentStatus"
          variant="transient"
        />
      </span>
      <span
        v-if="row.memberKind === 'agent_team' && added"
        class="mr-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center self-start pt-0.5 text-slate-500"
        data-team-icon="user-group-solid"
        aria-hidden="true"
      >
        <Icon icon="heroicons:user-group-20-solid" class="h-4 w-4" />
      </span>
      <span
        v-else-if="row.memberKind === 'agent_team'"
        class="mr-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-[0.2rem] border border-dashed border-indigo-400 bg-white text-indigo-600"
        data-team-icon="temporary-task-team"
        aria-hidden="true"
      >
        <Icon icon="heroicons:bolt-20-solid" class="h-3 w-3" />
      </span>
      <span
        v-else-if="added"
        class="mr-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-[0.5625rem] font-semibold text-gray-600"
        :class="addedEntry ? 'mt-0.5 self-start' : ''"
        data-test="workspace-added-member-avatar"
        aria-hidden="true"
      >{{ initials }}</span>
      <span class="min-w-0 flex-1" :class="{ 'font-semibold': row.memberKind === 'agent_team' }">
        <span class="flex min-w-0 items-center gap-1.5">
          <span class="min-w-0 truncate">{{ row.displayName }}</span>
          <span
            v-if="addedEntry"
            class="flex-shrink-0 rounded-full border border-sky-200 bg-sky-50 px-1.5 text-[0.625rem] font-medium leading-4 text-sky-800"
            data-test="workspace-added-badge"
          >{{ t('workspace.members.added') }}</span>
        </span>
        <span
          v-if="startedByLabel"
          class="mt-0.5 block truncate text-[0.6875rem] text-slate-500"
          :class="added ? 'font-normal' : ''"
          data-test="workspace-transient-started-by"
        >{{ startedByLabel }}</span>
        <span
          v-if="inspectionAttempt?.state === 'loading'"
          class="mt-0.5 block text-[0.6875rem] font-medium text-indigo-700"
          role="status"
        >{{ t('workspace.task_monitor.loading') }}</span>
        <span
          v-else-if="inspectionAttempt?.state === 'error'"
          class="mt-0.5 flex items-center gap-1 text-[0.6875rem] font-medium text-red-700"
          role="alert"
        >
          <span>{{ t('workspace.task_monitor.load_error') }}</span>
          <button
            type="button"
            class="rounded px-1 py-0.5 underline focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
            :aria-label="t('workspace.task_monitor.retry_accessible')"
            @click.stop="emit('select', row)"
          >{{ t('workspace.task_monitor.retry') }}</button>
        </span>
      </span>
    </div>
    <span
      class="hierarchy-identity-tooltip pointer-events-none absolute left-2 right-2 top-full z-50 hidden break-words rounded-md bg-slate-900 px-2 py-1.5 text-left text-[0.6875rem] font-medium leading-4 text-white shadow-lg"
      role="tooltip"
    >{{ identityLabel }}</span>
  </div>
</template>

<script lang="ts">
const autoExpandedRowKeys = new Set<string>();
</script>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import StatusDot from '~/components/workspace/common/StatusDot.vue';
import TeamAggregateStatusDot from '~/components/workspace/history/TeamAggregateStatusDot.vue';
import { useAgentTeamContextsStore } from '~/stores/agentTeamContextsStore';
import WorkspaceHierarchyBranches from '~/components/workspace/history/WorkspaceHierarchyBranches.vue';
import { useLocalization } from '~/composables/useLocalization';
import { AgentStatus } from '~/types/agent/AgentStatus';
import type { RunHistoryTransientExecutionRow } from '~/stores/runHistoryTypes';
import { useRunHistoryStore } from '~/stores/runHistoryStore';
import { findAddedCollaborator } from '~/prototype/run-mentions/runMentionState';

const props = withDefaults(defineProps<{
  row: RunHistoryTransientExecutionRow;
  isSelected?: boolean;
  hasChildren?: boolean;
  expanded?: boolean;
  continuingAncestorDepths?: number[];
  hasFollowingSibling?: boolean;
}>(), {
  isSelected: false,
  hasChildren: false,
  expanded: false,
  continuingAncestorDepths: () => [],
  hasFollowingSibling: false,
});

const emit = defineEmits<{
  (e: 'select', row: RunHistoryTransientExecutionRow): void;
  (e: 'toggle', row: RunHistoryTransientExecutionRow): void;
}>();

const { t } = useLocalization();
const runHistoryStore = useRunHistoryStore();

// A collaborator brought into this run by an `@` mention (cross-scope-agent-mentions). It reads as
// a member of the run, not as a temporary task: solid row, member icon, and an "Added" badge on
// the row that was added (the Team row, or the Agent row for a single Agent).
const addedCollaborator = computed(() => findAddedCollaborator({
  rootRunId: props.row.teamRunId,
  teamRunId: props.row.teamRunIdForNode,
  agentRunId: props.row.agentRunId,
}));
const added = computed(() => Boolean(addedCollaborator.value));
const addedEntry = computed(() => Boolean(addedCollaborator.value)
  && (props.row.memberKind === 'agent_team' || addedCollaborator.value?.kind === 'agent'));
// An added Team shows one status for its members, like a configured Team branch.
const teamContextsStore = useAgentTeamContextsStore();
const addedTeamStatus = computed<AgentStatus>(() => {
  const view = teamContextsStore.getTeamContextById(props.row.teamRunId)?.view;
  const statuses = (addedCollaborator.value?.agentRunIds ?? [])
    .map((agentRunId) => view?.getAgentContext(agentRunId)?.state.currentStatus ?? AgentStatus.Offline);
  return [AgentStatus.Error, AgentStatus.Running, AgentStatus.Initializing, AgentStatus.Idle]
    .find((status) => statuses.includes(status)) ?? AgentStatus.Offline;
});
const initials = computed(() => props.row.displayName.split(/\s+/).filter(Boolean).slice(0, 2)
  .map((part) => part[0]?.toUpperCase() ?? '').join('') || 'AI');

const roleLabel = computed(() => t(
  added.value
    ? (props.row.memberKind === 'agent_team'
        ? 'workspace.history.hierarchy.role.added_team'
        : 'workspace.history.hierarchy.role.added_agent')
    : props.row.memberKind === 'agent_team'
      ? 'workspace.history.hierarchy.role.temporary_task_team'
      : 'workspace.history.hierarchy.role.temporary_task_agent',
));

const status = computed(() => props.row.currentStatus || AgentStatus.Offline);
const statusLabel = computed(() => t(`workspace.history.hierarchy.status.${status.value}`));
const startedByLabel = computed(() => {
  if (addedEntry.value) {
    return addedCollaborator.value?.addedByName
      ? t('workspace.members.added_by', { name: addedCollaborator.value.addedByName })
      : t('workspace.members.added_by_you');
  }
  return props.row.delegatedBy
    ? t('workspace.members.started_by', { name: props.row.delegatedBy })
    : '';
});
const inspectionAttempt = computed(() => props.row.agentRunId
  ? runHistoryStore.getTeamMemberInspectionAttempt(props.row.teamRunId, props.row.agentRunId)
  : null);

const identityLabel = computed(() => t('workspace.history.hierarchy.identity', {
  role: roleLabel.value,
  name: props.row.displayName,
  address: props.row.memberAddress,
}));

const accessibleLabel = computed(() => t('workspace.history.hierarchy.tree_item', {
  role: roleLabel.value,
  name: props.row.displayName,
  address: props.row.memberAddress,
  level: props.row.depth + 1,
  status: startedByLabel.value ? `${statusLabel.value}, ${startedByLabel.value}` : statusLabel.value,
}));

const disclosureLabel = computed(() => t(
  props.expanded
    ? 'workspace.history.hierarchy.collapse'
    : 'workspace.history.hierarchy.expand',
  { name: props.row.displayName },
));

const rowStyle = computed(() => ({
  paddingLeft: `calc((${props.row.depth} + 1) * 0.875rem)`,
}));

const rowClasses = computed(() => ({
  'is-selected text-indigo-900': props.isSelected,
  'text-gray-600': !props.isSelected,
  'hover:bg-gray-50': added.value && !props.isSelected,
}));

// A Team that was just added opens once so its members are visible; after that the user's
// own collapse/expand choice is kept.
onMounted(() => {
  if (!addedEntry.value || !props.hasChildren || props.expanded) return;
  if (autoExpandedRowKeys.has(props.row.rowKey)) return;
  autoExpandedRowKeys.add(props.row.rowKey);
  emit('toggle', props.row);
});

const activateRow = (): void => {
  if (props.hasChildren) emit('toggle', props.row);
  emit('select', props.row);
};
</script>

<style scoped>
.transient-execution-row {
  isolation: isolate;
}

.transient-execution-row > :not(.hierarchy-identity-tooltip):not(.hierarchy-branches) {
  position: relative;
  z-index: 2;
}

.transient-execution-row.is-selected {
  border-radius: 0;
  background-color: #eef2ff;
  box-shadow: inset 2px 0 #6366f1;
}

.transient-execution-row:focus-visible > .hierarchy-identity-tooltip {
  display: block;
}

.transient-execution-row:focus-visible {
  z-index: 60;
}

@media (prefers-reduced-motion: reduce) {
  .transient-execution-row,
  .transient-execution-row * {
    transition-duration: 0.01ms !important;
  }
}
</style>
