<template>
  <!-- Task Agents and task Teams brought into a standalone Agent run with `@`. -->
  <!-- task-run-resources-workspace-cleanup: the rows of a Task that is DONE leave the tree (DEC-001). -->
  <TransitionGroup
    v-if="rows.length || leaving"
    tag="div"
    :name="removalTransition"
    class="team-execution-tree ml-3 space-y-0.5"
    role="tree"
    :aria-label="t('workspace.history.hierarchy.tree_label', { name: label })"
    data-test="workspace-agent-run-task-tree"
    :data-run-id="runId"
    @before-leave="leaving += 1"
    @after-leave="leaving -= 1"
  >
    <WorkspaceTransientExecutionRow
      v-for="display in rows"
      :key="display.row.rowKey"
      :row="display.row"
      :is-selected="isSelected(display.row)"
      :has-children="display.row.hasChildren"
      :expanded="isExpanded(display.row)"
      :continuing-ancestor-depths="display.continuingAncestorDepths"
      :has-following-sibling="display.hasFollowingSibling"
      @select="select"
      @toggle="toggle"
    />
  </TransitionGroup>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import WorkspaceTransientExecutionRow from '~/components/workspace/history/WorkspaceTransientExecutionRow.vue'
import { useLocalization } from '~/composables/useLocalization'
import type { RunHistoryTransientExecutionRow } from '~/stores/runHistoryTypes'
import { useAgentRunCollaborationStore } from '~/stores/agentRunCollaborationStore'
import { reviewOptions } from '~/prototype/task-run-cleanup/reviewOptions'

const props = defineProps<{
  runId: string
  label: string
  /** The run is the selected run in the workspace. */
  runSelected: boolean
  /** The run has a stored collaboration package. */
  hasCollaboration: boolean
}>()
const emit = defineEmits<{ (event: 'select-run'): void }>()
const { t } = useLocalization()
const collaboration = useAgentRunCollaborationStore()

// The stored view is read without restoring the run; a live run is kept current by its stream.
const loadStored = () => {
  if (props.hasCollaboration && !collaboration.contextFor(props.runId)) void collaboration.inspect(props.runId)
}
onMounted(loadStored)
watch(() => props.hasCollaboration, loadStored)

const rows = computed(() => collaboration.taskRows(props.runId))
// Rows only animate when they leave; a new row appears at once, as today.
const removalTransition = computed(() => reviewOptions.removal === 'fade' ? 'task-row' : 'task-row-instant')
const leaving = ref(0)
const isExpanded = (row: RunHistoryTransientExecutionRow): boolean =>
  Boolean(row.teamRunIdForNode && collaboration.isTaskTeamExpanded(props.runId, row.teamRunIdForNode))
const isSelected = (row: RunHistoryTransientExecutionRow): boolean =>
  props.runSelected && row.agentRunId !== null && collaboration.selectedChild(props.runId) === row.agentRunId

const toggle = (row: RunHistoryTransientExecutionRow): void => {
  if (row.teamRunIdForNode) collaboration.toggleTaskTeam(props.runId, row.teamRunIdForNode)
}

/** Opens the task Agent's conversation; a task Team row opens its coordinator. */
const select = (row: RunHistoryTransientExecutionRow): void => {
  const context = collaboration.contextFor(props.runId)
  if (!context) return
  const agentRunId = row.agentRunId ?? (row.teamRunIdForNode ? context.index.coordinatorOf(row.teamRunIdForNode).agentRunId : null)
  collaboration.selectChild(props.runId, agentRunId)
  if (!props.runSelected) emit('select-run')
}
</script>

<style scoped>
/* A leaving row fades and its height closes (200 ms); the rows below move up with it. */
.task-row-leave-active {
  overflow: hidden;
  transition: opacity 200ms ease-out, max-height 200ms ease-out, margin-top 200ms ease-out, border-width 200ms ease-out;
}
.task-row-leave-from {
  opacity: 1;
  max-height: 2rem;
}
.task-row-leave-to {
  opacity: 0;
  max-height: 0;
  min-height: 0;
  margin-top: 0 !important;
  border-width: 0;
}
.task-row-move {
  transition: transform 200ms ease-out;
}
.task-row-enter-active,
.task-row-instant-enter-active,
.task-row-instant-leave-active {
  transition: none;
}
@media (prefers-reduced-motion: reduce) {
  .task-row-leave-active,
  .task-row-move {
    transition: none;
  }
}
</style>
