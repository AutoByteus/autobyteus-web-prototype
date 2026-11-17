import { computed } from 'vue'
import { useActiveContextStore } from '~/stores/activeContextStore'
import { useMobileRunTreeStore } from '~/stores/mobileRunTreeStore'
import type { MobileRunTreeRow } from '~/utils/mobile/mobileRunListRows'

/**
 * Stand-in for the phone's run list rows (the product builds them from the node's run history and the server's run
 * trees, `stores/mobileRunTreeStore.ts` holds the invented world instead): the same rows, the same folds, the open row.
 */
export function useMobileRunTree() {
  const world = useMobileRunTreeStore()
  const activeContext = useActiveContextStore()

  const rows = computed<MobileRunTreeRow[]>(() => world.rows)
  /** The open target's agent; its row is the open row. */
  const openAgentRunId = computed(() => activeContext.activeWorkspaceTarget?.context.state.runId ?? null)
  const openRowKey = computed(() => {
    const runId = openAgentRunId.value
    return runId ? rows.value.find((row) => row.avatar === 'agent' && (row.open as unknown as { id: string }).id === runId)?.key ?? null : null
  })
  const openRow = computed(() => rows.value.find((row) => row.key === openRowKey.value) ?? null)
  /** The open row's parent (the run screen's "in <parent>"); none for a top-level run. */
  const openRowParent = computed<MobileRunTreeRow | null>(() => {
    const index = rows.value.findIndex((row) => row.key === openRowKey.value)
    if (index < 0) return null
    const depth = rows.value[index]!.depth
    for (let at = index - 1; at >= 0; at -= 1) if (rows.value[at]!.depth < depth) return rows.value[at]!
    return null
  })

  const toggle = (fold: { id: string; key: string; depth: number }): void => {
    const node = world.byId(fold.id)
    if (node) world.toggle(fold.key, node, fold.depth)
  }
  /** Opens every fold on the path to a row, never closing one. */
  const revealRow = (key: string): void => {
    const target = world.allRows.find((row) => row.key === key)
    if (!target) return
    const top = world.allRows.find((row) => row.key === key.split('/')[0])
    if (top && !world.olderShown && world.older.some((node) => node.id === top.node.id)) world.olderShown = true
    let parentKey = target.parentKey
    while (parentKey) {
      world.open(parentKey)
      parentKey = world.allRows.find((row) => row.key === parentKey)?.parentKey ?? null
    }
  }
  const ensureTreeOf = async (_key: string): Promise<void> => undefined

  return {
    rows, openRowKey, openRow, openRowParent, toggle, revealRow, ensureTreeOf,
    setTeamExpanded: (_teamRunId: string, _expanded: boolean): void => undefined,
    toggleTeam: (_teamRunId: string): void => undefined,
    expandTeamMemberAncestors: (_teamRunId: string, _agentRunId: string): boolean => false,
  }
}
