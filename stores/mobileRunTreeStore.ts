import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  MOBILE_RUNS, PEERS, UNREACHABLE_NODES, flattenRunIds, type MobilePeer, type MobileRunNode,
} from '~/prototype/mobile-runs/mobileRunsFixture'
import type { MobileRunTreeRow } from '~/utils/mobile/mobileRunListRows'

/** How many runs show before "Show older (N)". */
export const MOBILE_VISIBLE_RUNS = 5

/** What the first history read found: the scenario key seeds the starting state only (no visible control); see the runbook. */
export type MobileRunListState = 'loading' | 'ready' | 'empty' | 'error' | 'node-offline'
const startingState = (): MobileRunListState => {
  if (typeof localStorage === 'undefined') return 'ready'
  switch (localStorage.getItem('autobyteus.prototype.scenario')) {
    case 'mobile_runs_loading': return 'loading'
    case 'mobile_runs_empty': return 'empty'
    case 'mobile_runs_error': return 'error'
    case 'mobile_runs_node_offline': return 'node-offline'
    default: return 'ready'
  }
}

/** The page's own start: the ages ("2m", "6h") count from here, so they are the same on every run. */
const PAGE_START = Date.now()
const ago = (minutes: number): string => new Date(PAGE_START - minutes * 60_000).toISOString()

/** A top-level run's key (`agent:<runId>`, as the product's run list keys it) and a tree row's (`<run key>/<node id>`). */
const topKey = (node: MobileRunNode): string => `${node.kind === 'member' ? 'agent' : node.kind}:${node.id}`

/**
 * Stand-in under the phone's run list (the product reads the node's run history and the server's run trees): the invented
 * world's runs as the phone's rows, the folds the user toggled, the runs created from the phone in this session. It holds
 * no view of its own; the screens are the source's components.
 */
export const useMobileRunTreeStore = defineStore('mobileRunTree', () => {
  const listState = ref<MobileRunListState>(startingState())
  /** Runs created from the phone in this session: they top the list, newest first. */
  const launched = ref<MobileRunNode[]>([])
  const olderShown = ref(false)
  /** Rows the user folded or unfolded, by row key. */
  const toggled = ref<Record<string, boolean>>({})
  const peers = ref<MobilePeer[]>(PEERS)

  const runs = computed<MobileRunNode[]>(() => (listState.value === 'ready' || listState.value === 'node-offline' ? [...launched.value, ...MOBILE_RUNS] : [...launched.value]))
  const all = computed(() => flattenRunIds(runs.value))
  const byId = (id: string | null | undefined): MobileRunNode | null => (id ? all.value.find((node) => node.id === id) ?? null : null)
  const parentOf = (id: string): MobileRunNode | null => all.value.find((node) => node.children?.some((child) => child.id === id)) ?? null
  const isNodeReachable = (node?: string): boolean => !node || !UNREACHABLE_NODES.has(node)

  const shown = computed(() => (olderShown.value ? runs.value : runs.value.slice(0, MOBILE_VISIBLE_RUNS)))
  const older = computed(() => runs.value.slice(MOBILE_VISIBLE_RUNS))

  /** Agent runs and delegated agents start unfolded, a Team's or an Org's members as the phone folds them (org runs open). */
  const defaultExpanded = (node: MobileRunNode, depth: number): boolean => (depth === 0 ? node.kind !== 'team' : node.kind === 'agent')
  const isExpanded = (key: string, node: MobileRunNode, depth: number): boolean => toggled.value[key] ?? defaultExpanded(node, depth)
  const toggle = (key: string, node: MobileRunNode, depth: number): void => { toggled.value = { ...toggled.value, [key]: !isExpanded(key, node, depth) } }
  const open = (key: string): void => { toggled.value = { ...toggled.value, [key]: true } }

  /** A tree row's key: its listed run's key and the row's own (`<kind>:<run id>`, built from identities only, never position). */
  const treeKeyOf = (top: MobileRunNode, node: MobileRunNode, parent: MobileRunNode): string => {
    const kind = node.kind === 'team' ? (node.node ? 'peer_team' : 'team')
      : node.kind === 'member' ? (top.kind === 'org' ? 'org_agent' : parent.node ? 'peer_member' : 'team_member')
        : (node.node ? 'peer_agent' : 'agent')
    return `${topKey(top)}/${kind}:${node.id}`
  }
  const rowOf = (node: MobileRunNode, depth: number, key: string): MobileRunTreeRow => {
    const children = node.children ?? []
    const expanded = children.length > 0 && isExpanded(key, node, depth)
    const remote = node.node && node.kind !== 'member' ? { nodeName: node.node, reachable: isNodeReachable(node.node) } : null
    return Object.freeze({
      key, depth, avatar: node.kind === 'team' ? 'team' : node.kind === 'org' ? 'org' : 'agent', name: node.name,
      // A delegated row of this node shows no second line (a Task's summary would); a peer's run shows its title.
      title: depth === 0 || (node.node && node.kind !== 'member') ? node.summary : '',
      status: node.status, remote, hasChildren: children.length > 0, expanded,
      fold: children.length > 0 ? ({ kind: 'world', id: node.id, key, depth } as never) : null,
      open: { kind: 'world', id: node.id } as never,
      lastActivityAt: depth === 0 ? ago(node.minutes) : null,
    }) as MobileRunTreeRow
  }
  const rowsOf = (top: MobileRunNode, node: MobileRunNode, parent: MobileRunNode | null, depth: number): MobileRunTreeRow[] => {
    const key = parent ? treeKeyOf(top, node, parent) : topKey(node)
    const row = rowOf(node, depth, key)
    return [row, ...(row.expanded ? (node.children ?? []).flatMap((child) => rowsOf(top, child, node, depth + 1)) : [])]
  }
  const rows = computed<MobileRunTreeRow[]>(() => shown.value.flatMap((node) => rowsOf(node, node, null, 0)))

  /** Every row's key and node, folded or not (for finding the row a route names, and an open run's row). */
  const allRows = computed(() => {
    const out: Array<{ key: string; node: MobileRunNode; depth: number; parentKey: string | null }> = []
    const visit = (top: MobileRunNode, node: MobileRunNode, parent: MobileRunNode | null, parentKey: string | null, depth: number): void => {
      const key = parent ? treeKeyOf(top, node, parent) : topKey(node)
      out.push({ key, node, depth, parentKey })
      for (const child of node.children ?? []) visit(top, child, node, key, depth + 1)
    }
    for (const node of runs.value) visit(node, node, null, null, 0)
    return out
  })

  /** What a tap opens: a Team's or an Org's run opens its coordinator (its first member), as the product does. */
  const targetOf = (node: MobileRunNode): MobileRunNode => ((node.kind === 'team' || node.kind === 'org') && node.children?.length ? node.children[0]! : node)
  function addLaunched(node: MobileRunNode): void { launched.value = [node, ...launched.value.filter((item) => item.id !== node.id)] }
  function renameLaunched(oldId: string, newId: string): void {
    launched.value = launched.value.map((node) => (node.id === oldId ? { ...node, id: newId } : node))
  }
  function retry(): void {
    listState.value = 'loading'
    window.setTimeout(() => { listState.value = 'ready' }, 700)
  }

  return {
    listState, runs, shown, older, olderShown, peers, all, rows, allRows, launched,
    byId, parentOf, isNodeReachable, isExpanded, toggle, open, targetOf, addLaunched, renameLaunched, retry,
  }
})
