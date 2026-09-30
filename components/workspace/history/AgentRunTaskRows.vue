<template>
  <!-- Task Agents and task Teams under a standalone Agent run (cross-scope-agent-mentions). -->
  <div
    v-if="rows.length"
    class="team-execution-tree ml-3 space-y-0.5"
    role="tree"
    :aria-label="t('workspace.history.hierarchy.tree_label', { name: label })"
    data-test="workspace-agent-run-task-tree"
    :data-run-id="runId"
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WorkspaceTransientExecutionRow from '~/components/workspace/history/WorkspaceTransientExecutionRow.vue'
import { useLocalization } from '~/composables/useLocalization'
import type { RunHistoryTransientExecutionRow } from '~/stores/runHistoryTypes'
import { addedCollaborators, agentRunScope } from '~/prototype/run-mentions/runMentionState'

const props = defineProps<{
  runId: string
  label: string
  /** The run is the selected run in the workspace. */
  runSelected: boolean
}>()
const emit = defineEmits<{ (event: 'select-run'): void }>()
const { t } = useLocalization()

const nameAt = (address: string): string => address.split('/').filter(Boolean).at(-1) ?? address
const scope = computed(() => agentRunScope(props.runId))
const isExpanded = (row: RunHistoryTransientExecutionRow): boolean =>
  Boolean(row.teamRunIdForNode && scope.value?.expandedTeamRunIds.includes(row.teamRunIdForNode))

const rows = computed(() => {
  const current = scope.value
  if (!current) return []
  const flat: RunHistoryTransientExecutionRow[] = []
  const agentRow = (agentRunId: string, depth: number, transientKind: 'task_agent' | 'task_team_child'): RunHistoryTransientExecutionRow => {
    const child = current.children.get(agentRunId)!
    return {
      kind: 'transient_execution', transientKind, rowKey: `agent:${agentRunId}`, teamRunId: props.runId,
      memberAddress: child.address, agentRunId, teamRunIdForNode: null, memberKind: 'agent',
      displayName: nameAt(child.address), currentStatus: child.context.state.currentStatus, delegatedBy: null,
      depth, hasChildren: false,
    } as RunHistoryTransientExecutionRow
  }
  for (const record of addedCollaborators(props.runId)) {
    if (!record.teamRunId) { flat.push(agentRow(record.entryAgentRunId, 0, 'task_agent')); continue }
    flat.push({
      kind: 'transient_execution', transientKind: 'task_team', rowKey: `team:${record.teamRunId}`, teamRunId: props.runId,
      memberAddress: record.address, agentRunId: null, teamRunIdForNode: record.teamRunId, memberKind: 'agent_team',
      displayName: nameAt(record.address), currentStatus: null, delegatedBy: null, depth: 0, hasChildren: true,
    } as RunHistoryTransientExecutionRow)
    if (current.expandedTeamRunIds.includes(record.teamRunId)) {
      record.agentRunIds.forEach((agentRunId) => flat.push(agentRow(agentRunId, 1, 'task_team_child')))
    }
  }
  const hasSibling = (index: number, depth: number): boolean => {
    for (let next = index + 1; next < flat.length; next += 1) {
      if (flat[next]!.depth < depth) return false
      if (flat[next]!.depth === depth) return true
    }
    return false
  }
  return flat.map((row, index) => ({
    row,
    continuingAncestorDepths: Array.from({ length: row.depth }, (_, depth) => depth).filter((depth) => hasSibling(index, depth)),
    hasFollowingSibling: hasSibling(index, row.depth),
  }))
})

const isSelected = (row: RunHistoryTransientExecutionRow): boolean =>
  props.runSelected && row.agentRunId !== null && scope.value?.focusedRunId === row.agentRunId

const toggle = (row: RunHistoryTransientExecutionRow): void => {
  const current = scope.value
  if (!current || !row.teamRunIdForNode) return
  current.expandedTeamRunIds = current.expandedTeamRunIds.includes(row.teamRunIdForNode)
    ? current.expandedTeamRunIds.filter((id) => id !== row.teamRunIdForNode)
    : [...current.expandedTeamRunIds, row.teamRunIdForNode]
}

/** Opens the task Agent's conversation; a task Team row opens its first member (the coordinator). */
const select = (row: RunHistoryTransientExecutionRow): void => {
  const current = scope.value
  if (!current) return
  const record = addedCollaborators(props.runId).find((entry) => entry.teamRunId && entry.teamRunId === row.teamRunIdForNode)
  current.focusedRunId = row.agentRunId ?? record?.entryAgentRunId ?? null
  if (!props.runSelected) emit('select-run')
}
</script>
