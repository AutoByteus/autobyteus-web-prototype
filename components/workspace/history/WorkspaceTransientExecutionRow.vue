<template>
  <div
    class="transient-execution-row relative flex w-full cursor-pointer items-center rounded-md bg-indigo-50/40 text-sm transition-colors hover:bg-indigo-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-300"
    :class="rowClasses"
    :style="rowStyle"
    data-test="workspace-team-transient-execution-row"
    data-row-kind="transient_execution"
    :data-transient-kind="row.transientKind"
    :data-team-run-id="row.teamRunId"
    :data-member-address="row.memberAddress"
    :data-tree-depth="row.depth"
    :title="prototypeReviewActive ? identityLabel : $t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.temporary_execution_title')"
    :aria-label="ariaLabel"
    :aria-current="isSelected ? 'true' : undefined"
    :aria-selected="prototypeReviewActive ? isSelected : undefined"
    :aria-level="prototypeReviewActive ? row.depth + 1 : undefined"
    :aria-expanded="prototypeReviewActive && hasChildren ? expanded : undefined"
    :role="prototypeReviewActive ? 'treeitem' : 'button'"
    tabindex="0"
    @click="activateRow"
    @keydown.enter="activateRow"
    @keydown.space.prevent="activateRow"
  >
    <button
      v-if="hasChildren"
      type="button"
      class="hierarchy-disclosure ml-2 mr-1 inline-flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      data-test="workspace-team-transient-disclosure"
      :data-team-run-id="row.teamRunId"
      :data-member-address="row.memberAddress"
      :aria-expanded="expanded"
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

    <div class="hierarchy-row-content flex min-w-0 flex-1 items-center py-1 pr-2">
      <span class="member-status inline-flex flex-shrink-0 items-center">
        <StatusDot
          v-if="row.memberKind === 'agent'"
          class="mr-1.5"
          data-test="workspace-transient-status-dot"
          :status="row.currentStatus"
          variant="transient"
        />
      </span>
      <span
        v-if="prototypeReviewActive && row.memberKind === 'agent_team'"
        class="mr-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-[0.2rem] border border-dashed border-indigo-400 bg-white text-indigo-600"
        aria-hidden="true"
      >
        <Icon icon="heroicons:bolt-20-solid" class="h-3 w-3" />
      </span>
      <span class="node-label min-w-0 flex-1">
        <span
          v-if="prototypeReviewActive && row.memberKind === 'agent_team' && teamIdentity === 'header'"
          class="block truncate text-[0.5625rem] font-semibold uppercase leading-3 tracking-[0.12em] text-indigo-600"
        >Temporary task team</span>
        <span class="block truncate">{{ row.displayName }}</span>
      </span>
      <span
        v-if="prototypeReviewActive && row.memberKind === 'agent_team' && teamIdentity === 'band'"
        class="ml-1 flex-shrink-0 text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-indigo-600"
      >Task team</span>
    </div>
    <span
      v-if="prototypeReviewActive"
      class="hierarchy-identity-tooltip pointer-events-none absolute left-2 right-2 top-full z-50 hidden break-words rounded-md bg-slate-900 px-2 py-1.5 text-left text-[0.6875rem] font-medium leading-4 text-white shadow-lg"
      role="tooltip"
    >{{ identityLabel }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import StatusDot from '~/components/workspace/common/StatusDot.vue';
import type { RunHistoryTransientExecutionRow } from '~/stores/runHistoryTypes';

const props = withDefaults(defineProps<{
  row: RunHistoryTransientExecutionRow;
  isSelected?: boolean;
  hasChildren?: boolean;
  expanded?: boolean;
  prototypeReviewActive?: boolean;
  hierarchyTreatment?: 'rails' | 'surfaces' | 'hybrid';
  metadataTreatment?: 'full' | 'responsive' | 'on-demand';
  teamIdentity?: 'icon' | 'header' | 'band';
  panelWidth?: 260 | 320 | 520;
  fontSize?: 'default' | 'extra-large';
}>(), {
  isSelected: false,
  hasChildren: false,
  expanded: false,
  prototypeReviewActive: false,
  hierarchyTreatment: 'hybrid',
  metadataTreatment: 'responsive',
  teamIdentity: 'header',
  panelWidth: 320,
  fontSize: 'default',
});

const emit = defineEmits<{
  (e: 'select', row: RunHistoryTransientExecutionRow): void;
  (e: 'toggle', row: RunHistoryTransientExecutionRow): void;
}>();

const rowStyle = computed(() => ({
  ...(props.prototypeReviewActive
    ? {
        '--tree-depth': String(props.row.depth),
        paddingLeft: `calc(${props.row.depth} * 0.875rem)`,
      }
    : { marginLeft: `${props.row.depth * 12}px` }),
}));

const identityLabel = computed(() => {
  const role = props.row.memberKind === 'agent_team' ? 'Temporary task team' : 'Temporary task agent';
  return `${role} · ${props.row.displayName} · ${props.row.memberAddress}`;
});

const ariaLabel = computed(() => props.prototypeReviewActive
  ? `${identityLabel.value}, level ${props.row.depth + 1}, ${props.row.currentStatus || 'offline'}`
  : `${props.row.displayName}. ${props.row.memberAddress}`);

const rowClasses = computed(() => [
  props.isSelected ? 'is-selected text-indigo-900 ring-1 ring-indigo-200' : 'text-gray-600',
  props.prototypeReviewActive ? [
    `hierarchy-${props.hierarchyTreatment}`,
    `metadata-${props.metadataTreatment}`,
    `identity-${props.teamIdentity}`,
    props.row.memberKind === 'agent_team' ? 'node-team' : 'node-agent',
  ] : [],
]);

const activateRow = (): void => {
  if (props.hasChildren) {
    emit('toggle', props.row);
  }
  emit('select', props.row);
};
</script>

<style scoped>
.transient-execution-row[class*="hierarchy-"] {
  isolation: isolate;
  min-height: 1.75rem;
  border: 1px dashed #c7d2fe;
}

.transient-execution-row[class*="hierarchy-"] > :not(.hierarchy-identity-tooltip) {
  position: relative;
  z-index: 2;
}

.hierarchy-rails::before,
.hierarchy-hybrid::before {
  position: absolute;
  z-index: 0;
  top: -0.2rem;
  bottom: -0.2rem;
  left: 0;
  width: calc((var(--tree-depth) + 1) * 0.875rem);
  background-image: repeating-linear-gradient(to right, transparent 0, transparent calc(0.875rem - 1px), #cbd5e1 calc(0.875rem - 1px), #cbd5e1 0.875rem);
  content: '';
}

.hierarchy-rails::after,
.hierarchy-hybrid::after {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: calc(var(--tree-depth) * 0.875rem + 0.4rem);
  width: 0.65rem;
  height: 1px;
  background: #94a3b8;
  content: '';
}

.hierarchy-surfaces {
  border-left: 3px solid #a5b4fc;
  background-color: #f5f7ff;
}

.identity-band.node-team {
  border-left-width: 4px;
  font-weight: 650;
}

.is-selected {
  background-color: #eef2ff !important;
  box-shadow: inset 3px 0 #4f46e5;
}

.metadata-on-demand .member-status {
  max-width: 0;
  margin: 0;
  overflow: hidden;
  opacity: 0;
}

.metadata-on-demand:hover .member-status,
.metadata-on-demand:focus .member-status,
.metadata-on-demand:focus-within .member-status {
  max-width: 2rem;
  margin-right: 0.375rem;
  opacity: 1;
}

.transient-execution-row:hover > .hierarchy-identity-tooltip,
.transient-execution-row:focus > .hierarchy-identity-tooltip,
.transient-execution-row:focus-within > .hierarchy-identity-tooltip {
  display: block;
}
</style>
