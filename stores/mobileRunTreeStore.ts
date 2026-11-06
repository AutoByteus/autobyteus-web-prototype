import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  MOBILE_RUNS, PEERS, UNREACHABLE_NODES, flattenRunIds,
  type MobilePeer, type MobileRunNode,
} from '~/prototype/mobile-runs/mobileRunsFixture'

/** The newest runs shown before "Show older (N)": the desktop Runs view's rule (autobyteus-385). */
export const MOBILE_VISIBLE_RUNS = 5

export type MobileRunListState = 'loading' | 'ready' | 'empty' | 'error' | 'node-offline'

/** The scenario key seeds the starting state only (no visible control); see the runbook. */
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

export const useMobileRunTreeStore = defineStore('mobileRunTree', () => {
  const listState = ref<MobileRunListState>(startingState())
  /** Runs created from the phone in this session: they top the list, newest first. */
  const launched = ref<MobileRunNode[]>([])
  const runs = computed<MobileRunNode[]>(() => (listState.value === 'empty' && !launched.value.length ? [] : [...launched.value, ...(listState.value === 'empty' ? [] : MOBILE_RUNS)]))
  const showOlder = ref(false)
  /** Rows the user folded or unfolded. A run with delegated work starts unfolded; a team's members start folded. */
  const toggled = ref<Record<string, boolean>>({})
  const selectedId = ref<string | null>(null)
  const peers = ref<MobilePeer[]>(PEERS)
  const checkedAt = ref<string>('just now')

  const all = computed(() => flattenRunIds(runs.value))
  const byId = (id: string | null): MobileRunNode | null => (id ? all.value.find((node) => node.id === id) ?? null : null)

  const parentOf = (id: string): MobileRunNode | null =>
    all.value.find((node) => node.children?.some((child) => child.id === id)) ?? null
  /** Root first, the node last. */
  const pathTo = (id: string): MobileRunNode[] => {
    const node = byId(id)
    if (!node) return []
    const parent = parentOf(id)
    return parent ? [...pathTo(parent.id), node] : [node]
  }
  const rootOf = (id: string): MobileRunNode | null => pathTo(id)[0] ?? null

  const defaultExpanded = (node: MobileRunNode): boolean => node.kind === 'agent' || node.kind === 'org' ? true : false
  const isExpanded = (node: MobileRunNode): boolean => toggled.value[node.id] ?? defaultExpanded(node)
  const toggle = (node: MobileRunNode): void => { toggled.value = { ...toggled.value, [node.id]: !isExpanded(node) } }

  const visibleRuns = computed(() => (showOlder.value ? runs.value : runs.value.slice(0, MOBILE_VISIBLE_RUNS)))
  const olderCount = computed(() => Math.max(0, runs.value.length - MOBILE_VISIBLE_RUNS))

  /** The paired node's own reachability is separate from a peer's: a peer that is down never blocks the list. */
  const isNodeReachable = (node?: string): boolean => !node || !UNREACHABLE_NODES.has(node)

  /**
   * What a tap opens. A team or Org run opens its coordinator (its first member), as the desktop resolver does; a member or
   * an agent opens its own conversation.
   */
  const targetOf = (node: MobileRunNode): MobileRunNode =>
    (node.kind === 'team' || node.kind === 'org') && node.children?.length ? node.children[0] : node

  /** Descendants that wait for the user (optional element OPT-001), shown on a folded parent. */
  const needsYouBelow = (node: MobileRunNode): number =>
    flattenRunIds(node.children ?? []).filter((child) => child.needsYou).length

  function select(id: string | null): void { selectedId.value = id }
  /** The first message gives a new run its permanent id; the run keeps its place and stays open. */
  function renameLaunched(oldId: string, newId: string): void {
    launched.value = launched.value.map((node) => (node.id === oldId ? { ...node, id: newId } : node))
    if (selectedId.value === oldId) selectedId.value = newId
  }
  function addLaunched(node: MobileRunNode): void { launched.value = [node, ...launched.value.filter((item) => item.id !== node.id)] }
  function retry(): void {
    listState.value = 'loading'
    window.setTimeout(() => { listState.value = 'ready' }, 700)
  }

  return {
    listState, runs, visibleRuns, olderCount, showOlder, selectedId, peers, checkedAt, all,
    byId, addLaunched, renameLaunched, parentOf, pathTo, rootOf, isExpanded, toggle, isNodeReachable, targetOf, needsYouBelow, select, retry,
  }
})
