<template>
  <!-- Task Agents and task Teams brought into a standalone Agent run with `@`. Rows of a DONE Task leave with motion. -->
  <TransitionGroup
    v-if="rendered"
    tag="div"
    name="tree-row"
    class="team-execution-tree ml-3 space-y-0.5"
    role="tree"
    :aria-label="t('workspace.history.hierarchy.tree_label', { name: label })"
    data-test="workspace-agent-run-task-tree"
    :data-run-id="runId"
    @before-leave="onBeforeLeave"
    @after-leave="onRowLeaveSettled"
    @leave-cancelled="onRowLeaveSettled"
  >
    <WorkspaceTransientExecutionRow
      v-for="display in visibleRows"
      :key="display.row.rowKey"
      :row="display.row"
      :team-status="display.teamStatus ?? undefined"
      :is-selected="isSelected(display.row)"
      :has-children="display.row.hasChildren"
      :expanded="isExpanded(display.row)"
      :continuing-ancestor-depths="display.continuingAncestorDepths"
      :has-following-sibling="display.hasFollowingSibling"
      :task="taskOf(display.row)"
      :stop-root="{ rootKind: 'AGENT', rootRunId: runId }"
      @select="select"
      @toggle="toggle"
      @locate-task="(task: TaskWorkerTask) => locate(task, () => emit('open-run'))"
    />
  </TransitionGroup>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import WorkspaceTransientExecutionRow from '~/components/workspace/history/WorkspaceTransientExecutionRow.vue'
import { useLeavingTreeRows } from '~/components/workspace/history/useLeavingTreeRows'
import { useLocalization } from '~/composables/useLocalization'
import { useTaskWorkerTasks } from '~/composables/projects/useTaskWorkerTasks'
import type { RunHistoryTransientExecutionRow } from '~/stores/runHistoryTypes'
import { useAgentRunCollaborationStore } from '~/stores/agentRunCollaborationStore'
import type { TaskWorkerTask } from '~/types/project'

const props = defineProps<{
  runId: string
  label: string
  /** The run is the selected run in the workspace. */
  runSelected: boolean
  /** The run has a stored collaboration package. */
  hasCollaboration: boolean
  /**
   * projects-left-navigation (REQ-008): in Projects mode under Project P, only the run's delegated work for P's Tasks,
   * plus work that belongs to no Project Task (Temp tasks) when the run was started under P. Null in Workspaces.
   */
  projectScope?: { projectId: string; startedUnder: boolean } | null
}>()
/**
 * `select-run` opens the run with its last selected child; `open-run` opens the run's own conversation, as
 * clicking the run row does (a Task summary located from a page without a right panel, REQ-012).
 */
const emit = defineEmits<{ (event: 'select-run'): void; (event: 'open-run'): void }>()
const { t } = useLocalization()
const collaboration = useAgentRunCollaborationStore()

// The stored view is read without restoring the run; a live run is kept current by its stream.
const loadStored = () => {
  if (props.hasCollaboration && !collaboration.contextFor(props.runId)) void collaboration.inspect(props.runId)
}
onMounted(loadStored)
watch(() => props.hasCollaboration, loadStored)

const rows = computed(() => collaboration.taskRows(props.runId))
// Task workers show their current Task's summary; it locates the Task in Projects.
const { taskOf, locate } = useTaskWorkerTasks(() => rows.value.map((display) => display.row))
// Projects mode: a top-level worker is listed under Project P when its Task is P's, or has no Project and the run was
// started under P; its members and sub-work follow it. Connectors are recomputed for the rows that remain.
const visibleRows = computed(() => {
  const scope = props.projectScope
  if (!scope) return rows.value
  let keepGroup = false
  const kept = rows.value.filter((display) => {
    if (display.row.depth === 0) {
      const task = taskOf(display.row)
      keepGroup = task ? task.projectId === scope.projectId || (task.projectId === null && scope.startedUnder) : scope.startedUnder
    }
    return keepGroup
  })
  const lastTop = kept.map((display) => display.row.depth).lastIndexOf(0)
  return kept.map((display, index) => {
    if (display.row.depth === 0) return { ...display, hasFollowingSibling: index < lastTop }
    // A deeper row keeps its ancestors' connector at depth 0 only while another top-level row follows.
    let nextTopFollows = false
    for (let ahead = index + 1; ahead < kept.length; ahead += 1) if (kept[ahead].row.depth === 0) { nextTopFollows = true; break }
    return { ...display, continuingAncestorDepths: display.continuingAncestorDepths.filter((depth) => depth !== 0 || nextTopFollows) }
  })
})
// The run row directly precedes this tree.
const { leaving, onBeforeLeave, onLeaveSettled } = useLeavingTreeRows(
  (tree) => tree.previousElementSibling instanceof HTMLElement ? tree.previousElementSibling : null)
// The tree stays mounted while its last rows leave (their leave hooks need the group); once they
// have settled, the empty list is not rendered.
const rendered = ref(false)
watch(() => visibleRows.value.length > 0, (hasRows) => { if (hasRows) rendered.value = true }, { immediate: true })
const onRowLeaveSettled = (): void => {
  onLeaveSettled()
  if (leaving.value === 0 && visibleRows.value.length === 0) rendered.value = false
}
const isExpanded = (row: RunHistoryTransientExecutionRow): boolean =>
  Boolean(row.teamRunIdForNode && collaboration.isTaskTeamExpanded(props.runId, row.teamRunIdForNode))
const isSelected = (row: RunHistoryTransientExecutionRow): boolean =>
  props.runSelected && row.agentRunId !== null && collaboration.selectedChild(props.runId) === row.agentRunId

const toggle = (row: RunHistoryTransientExecutionRow): void => {
  if (row.teamRunIdForNode) collaboration.toggleTaskTeam(props.runId, row.teamRunIdForNode)
}

/**
 * Opens the task Agent's conversation; a task Team row opens its coordinator. The run is always
 * (re)opened as well, so a click opens the conversation from any page, also when this run is
 * already the selected run (F-006); re-selecting the current run only navigates.
 */
const select = (row: RunHistoryTransientExecutionRow): void => {
  const context = collaboration.contextFor(props.runId)
  if (!context) return
  const agentRunId = row.agentRunId ?? (row.teamRunIdForNode ? context.index.coordinatorRunIdOf(row.teamRunIdForNode) : null)
  collaboration.selectChild(props.runId, agentRunId)
  emit('select-run')
}
</script>

<style scoped src="./treeRowLeave.css"></style>
