import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useNodeStore } from '~/stores/nodeStore'
import { useWindowNodeContextStore } from '~/stores/windowNodeContextStore'
import type { OfferEntry } from '~/prototype/remote-collaboration/offersScript'
import {
  buildWorld, hostPort, inspect, isValidName, NODE_IDS, reach, registrationName, resolveAddress,
  type Cause, type DirState, type Inspection, type WorldNode, type WorldPeer,
} from '~/prototype/nodes/nodeWorld'

/**
 * Manage Nodes: one list of nodes, each once (design one-nodes-tab).
 * UI-reference state: the nodes' answers are scripted in prototype/nodes/nodeWorld.ts; in the product this node's server
 * and the other nodes' servers answer. Nothing here polls: a node is asked when the tab opens, when it is added, when
 * collaboration turns on and when the owner asks again.
 */

export interface NodeRow {
  /** The node ID (`srv_…`) when known; `d:<desktop id>` for a node this desktop has never reached. */
  key: string
  nodeId: string | null
  desktopId: string | null
  name: string
  /** Where this desktop opens the node (its list entry), or the address this node uses when only the peer list has it. */
  url: string
  isEmbedded: boolean
  collaborating: boolean
}

export type RowPhase = { phase: 'checking'; token: number } | { phase: 'settled'; inspection: Inspection; checkedAt: string }

export type StepId =
  | 'turnOnHere' | 'registerHere' | 'turnOnThere' | 'registerThere'
  | 'unregisterHere' | 'unregisterThere' | 'removeFromList'

export type StepError =
  | { kind: 'unreachable'; cause: Cause; host: string }
  | { kind: 'noAddress'; firstTried: string; loopbackInContainer: boolean; suggestion: string | null }

export interface PlanLine {
  id: StepId
  name?: string
  /** The name the node would like; `name` differs when it was already taken and got a number. */
  wanted?: string
  /** `registerThere`: the address the other node will use for this node, when it can be shown now. */
  address?: string | null
  /** The other node finds the address once collaboration is on there (DEC-709, recommended option b). */
  findsLater?: boolean
  addressPending?: boolean
  status: 'todo' | 'running' | 'done' | 'failed' | 'notRun'
  error?: StepError
}

export type PlanKind = 'on' | 'off' | 'remove' | 'fix'

export interface Plan {
  kind: PlanKind
  rowKey: string
  nodeName: string
  thisName: string
  lines: PlanLine[]
  phase: 'confirm' | 'running' | 'done' | 'failed'
  /** First address to try when the owner picks the suggested one ("Use this"). */
  firstAddress?: string
}

export interface LastRun { kind: PlanKind; lines: PlanLine[] }

export interface Banner { tone: 'info'; key: string; params: Record<string, string>; cause?: Cause; rowKey?: string }

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

let nextToken = 1

export const useNodeListStore = defineStore('nodeList', () => {
  const nodeStore = useNodeStore()
  const windowNode = useWindowNodeContextStore()

  let world: Record<string, WorldNode> | null = null
  const thisId = ref<string>(NODE_IDS.E)
  const switchOn = ref(false)
  const switchBusy = ref(false)
  const peers = ref<WorldPeer[]>([])
  const runtime = ref<Record<string, RowPhase>>({})
  const lastRuns = ref<Record<string, LastRun>>({})
  const plan = ref<Plan | null>(null)
  const banner = ref<Banner | null>(null)
  const flashKey = ref<string | null>(null)
  /** Rows the owner has expanded; a row opens by itself once collaboration with it has been set up, so its result is visible. */
  const expanded = ref<Record<string, boolean>>({})
  const opened = ref(false)

  const currentNode = computed(() => nodeStore.getNodeById(windowNode.nodeId))
  const thisName = computed(() => currentNode.value?.name ?? 'Node')
  const hasOpen = computed(() => typeof window !== 'undefined' && Boolean((window as any).electronAPI?.openNodeWindow))

  const syncPeers = (): void => { peers.value = world ? structuredClone(world[thisId.value].peers) : [] }

  const scenarioName = (): string => {
    try { return localStorage.getItem('autobyteus.prototype.scenario') || 'populated' } catch { return 'populated' }
  }

  /** One world per page load; the window's node decides which node is "this node". */
  const ensureWorld = (): void => {
    if (world) return
    world = buildWorld(scenarioName())
    const entry = currentNode.value
    thisId.value = entry?.serverInstanceId ?? NODE_IDS.E
    switchOn.value = world[thisId.value].switchOn
    syncPeers()
  }

  // ------------------------------------------------------------ rows (one per node)
  const rows = computed<NodeRow[]>(() => {
    const own = currentNode.value
    const result: NodeRow[] = []
    const matched = new Set<string>()
    for (const entry of nodeStore.nodes) {
      if (entry.id === own?.id) continue
      const nodeId = entry.serverInstanceId ?? null
      const peer = nodeId ? peers.value.find((p) => p.nodeId === nodeId) : undefined
      if (nodeId) matched.add(nodeId)
      result.push({
        key: nodeId ?? `d:${entry.id}`, nodeId, desktopId: entry.id,
        name: peer?.name ?? entry.name, url: entry.baseUrl, isEmbedded: entry.nodeType === 'embedded', collaborating: Boolean(peer),
      })
    }
    for (const peer of peers.value) {
      if (matched.has(peer.nodeId)) continue
      result.push({ key: peer.nodeId, nodeId: peer.nodeId, desktopId: null, name: peer.name, url: peer.baseUrl, isEmbedded: false, collaborating: true })
    }
    return result
  })

  const rowByKey = (key: string): NodeRow | undefined => rows.value.find((r) => r.key === key)

  // ------------------------------------------------------------ asking a node (tab opens, node added, switch on, owner asks)
  const ask = (row: NodeRow): void => {
    if (!world) return
    const token = nextToken++
    runtime.value[row.key] = { phase: 'checking', token }
    const delay = inspect(world, thisId.value, row.nodeId, row.url).delayMs
    setTimeout(() => {
      const current = runtime.value[row.key]
      if (!world || !current || current.phase !== 'checking' || current.token !== token) return
      const inspection = inspect(world, thisId.value, row.nodeId, row.url)
      runtime.value[row.key] = { phase: 'settled', inspection, checkedAt: new Date().toISOString() }
    }, delay)
  }

  const open = async (): Promise<void> => {
    await nodeStore.initializeRegistry()
    ensureWorld()
    if (opened.value) return
    opened.value = true
    rows.value.forEach(ask)
  }

  const askAgain = (key: string): void => {
    const row = rowByKey(key)
    if (row) ask(row)
  }

  const askAll = (): void => rows.value.forEach(ask)

  // ------------------------------------------------------------ this node's switch (REQ-709)
  const setSwitch = async (on: boolean): Promise<void> => {
    ensureWorld()
    if (switchBusy.value) return
    switchBusy.value = true
    await wait(350)
    world![thisId.value].switchOn = on
    switchOn.value = on
    switchBusy.value = false
    askAll()
  }

  // ------------------------------------------------------------ row view: what the row says and what fixes it
  const inspectionOf = (key: string): Inspection | null => {
    const state = runtime.value[key]
    return state?.phase === 'settled' ? state.inspection : null
  }

  const isChecking = (key: string): boolean => runtime.value[key]?.phase !== 'settled'

  type Fix = 'turnOnThere' | 'registerThere' | 'changeAddress' | 'checkAgain' | 'tryAgain'
  interface RowLine { tone: 'warn' | 'error' | 'info'; kind: DirState['state'] | 'partial' | 'notRegisteredHereInfo' | 'agentsOff'; dir?: DirState; cause?: Cause; host?: string; fix?: Fix; partialError?: StepError }

  /** One line under a row, only when something needs the owner, with the one action that fixes it. */
  const lineOf = (row: NodeRow): RowLine | null => {
    const ins = inspectionOf(row.key)
    if (!ins) return null
    // A step that did not finish is a row state of its own, with the button that finishes it (even while the node is away).
    const run = lastRuns.value[row.key]
    if (run && run.kind !== 'off' && run.kind !== 'remove' && row.collaborating && switchOn.value) {
      const unfinished = ins.thisToIt.state !== 'working' || ins.itToThis.state !== 'working'
      const failed = run.lines.find((l) => l.status === 'failed')
      if (unfinished && failed?.error) return { tone: 'warn', kind: 'partial', partialError: failed.error, fix: 'tryAgain' }
    }
    if (!ins.windowReach.ok) return { tone: 'info', kind: 'unreachable', dir: ins.thisToIt, cause: ins.windowReach.cause, host: ins.windowReach.host, fix: 'checkAgain' }
    if (ins.thisToIt.state === 'different') return { tone: 'error', kind: 'different', dir: ins.thisToIt, fix: 'changeAddress' }
    if (!row.collaborating) {
      // The other node has registered this node, but this node has not registered it.
      if (ins.registeredThere && ins.itSwitchOn) return { tone: 'info', kind: 'notRegisteredHereInfo', dir: ins.itToThis }
      // Reachable, but agents are not connected yet: say so in plain words, with the button that connects them.
      return { tone: 'info', kind: 'agentsOff', fix: 'turnOn' as any }
    }
    if (!switchOn.value) return null
    const dir = ins.thisToIt
    if (dir.state === 'unreachable') return { tone: 'info', kind: 'unreachable', dir, cause: dir.cause, host: dir.host, fix: 'checkAgain' }
    if (dir.state === 'offThere') return { tone: 'warn', kind: 'offThere', dir, fix: 'turnOnThere' }
    if (dir.state === 'notRegisteredThere') return { tone: 'warn', kind: 'notRegisteredThere', dir, fix: 'registerThere' }
    return null
  }

  // ------------------------------------------------------------ plans: every change on both nodes, confirmed once
  const w = (): Record<string, WorldNode> => world!

  const planOn = (row: NodeRow, kind: PlanKind): Plan => {
    const T = w()[thisId.value]
    const B = w()[row.nodeId!]
    const peerOnT = T.peers.find((p) => p.nodeId === B.id)
    const peerOnB = B.peers.find((p) => p.nodeId === T.id)
    const lines: PlanLine[] = []
    if (!T.switchOn) lines.push({ id: 'turnOnHere', status: 'todo' })
    if (!peerOnT) {
      lines.push({ id: 'registerHere', name: registrationName(row.name, T.peers.map((p) => p.name)), wanted: row.name, status: 'todo' })
    }
    if (!B.switchOn) lines.push({ id: 'turnOnThere', status: 'todo' })
    if (!peerOnB) {
      const line: PlanLine = {
        id: 'registerThere', name: registrationName(thisName.value, B.peers.map((p) => p.name)), wanted: thisName.value, status: 'todo',
        findsLater: !B.switchOn, addressPending: B.switchOn, address: null,
      }
      lines.push(line)
    }
    return { kind, rowKey: row.key, nodeName: row.name, thisName: thisName.value, lines, phase: 'confirm' }
  }

  const planOff = (row: NodeRow, kind: 'off' | 'remove'): Plan => {
    const lines: PlanLine[] = []
    if (row.collaborating) {
      lines.push({ id: 'unregisterHere', name: row.name, status: 'todo' })
      lines.push({ id: 'unregisterThere', name: thisName.value, status: 'todo' })
    }
    if (kind === 'remove') lines.push({ id: 'removeFromList', name: row.name, status: 'todo' })
    return { kind, rowKey: row.key, nodeName: row.name, thisName: thisName.value, lines, phase: 'confirm' }
  }

  /** The other node's address for this node is shown in the confirmation once found, when its switch is already on. */
  const showAddressWhenFound = (p: Plan, row: NodeRow): void => {
    const B = w()[row.nodeId!]
    const line = p.lines.find((l) => l.id === 'registerThere' && l.addressPending)
    if (!line) return
    const resolved = resolveAddress(w(), B.id, thisId.value)
    setTimeout(() => {
      const current = plan.value?.lines.find((l) => l.id === 'registerThere')
      if (!current || plan.value?.rowKey !== row.key) return
      current.addressPending = false
      current.address = resolved.ok ? resolved.url : null
    }, resolved.delayMs)
  }
  const requestOn = (key: string): void => {
    const row = rowByKey(key)
    if (!row || !row.nodeId) return
    ensureWorld()
    plan.value = planOn(row, 'on')
    showAddressWhenFound(plan.value, row)
  }
  const requestFix = (key: string): void => {
    const row = rowByKey(key)
    if (!row || !row.nodeId) return
    plan.value = planOn(row, 'fix')
    showAddressWhenFound(plan.value, row)
  }
  const requestOff = (key: string): void => {
    const row = rowByKey(key)
    if (row) plan.value = planOff(row, 'off')
  }
  const requestRemove = (key: string): void => {
    const row = rowByKey(key)
    if (row) plan.value = planOff(row, 'remove')
  }
  const cancelPlan = (): void => { plan.value = null }

  const failWith = (line: PlanLine, error: StepError): false => { line.status = 'failed'; line.error = error; return false }

  /** B-side writes come from this window to the other node's server; a node that is away refuses them. */
  const writeToOther = (line: PlanLine, B: WorldNode): boolean => {
    if (B.failOnce) {
      B.failOnce = false
      B.downUntil = Date.now() + 8000
      return failWith(line, { kind: 'unreachable', cause: 'refused', host: hostPort(w()[thisId.value].peers.find((p) => p.nodeId === B.id)?.baseUrl ?? '') })
    }
    if (B.downUntil && Date.now() < B.downUntil) return failWith(line, { kind: 'unreachable', cause: 'refused', host: '' })
    return true
  }

  const perform = (p: Plan, line: PlanLine, row: NodeRow): boolean => {
    const T = w()[thisId.value]
    const B = row.nodeId ? w()[row.nodeId] : undefined
    switch (line.id) {
      case 'turnOnHere': T.switchOn = true; switchOn.value = true; return true
      case 'registerHere': {
        const resolved = resolveAddress(w(), T.id, B!.id)
        if (!resolved.ok) return failWith(line, { kind: 'noAddress', firstTried: resolved.firstTried, loopbackInContainer: resolved.loopbackInContainer, suggestion: resolved.suggestion })
        T.peers.push({ nodeId: B!.id, name: line.name!, baseUrl: resolved.url })
        return true
      }
      case 'turnOnThere': if (!writeToOther(line, B!)) return false; B!.switchOn = true; return true
      case 'registerThere': {
        if (!writeToOther(line, B!)) return false
        const resolved = resolveAddress(w(), B!.id, T.id, p.firstAddress)
        if (!resolved.ok) return failWith(line, { kind: 'noAddress', firstTried: resolved.firstTried, loopbackInContainer: resolved.loopbackInContainer, suggestion: resolved.suggestion })
        B!.peers.push({ nodeId: T.id, name: line.name!, baseUrl: resolved.url })
        line.address = resolved.url
        return true
      }
      case 'unregisterHere': T.peers = T.peers.filter((peer) => peer.nodeId !== B!.id); return true
      case 'unregisterThere': {
        if (!writeToOther(line, B!)) return false
        B!.peers = B!.peers.filter((peer) => peer.nodeId !== T.id)
        return true
      }
      case 'removeFromList': {
        if (row.desktopId) void nodeStore.removeRemoteNode(row.desktopId)
        return true
      }
    }
  }

  const confirmPlan = async (firstAddress?: string): Promise<void> => {
    const p = plan.value
    if (!p) return
    const row = rowByKey(p.rowKey)
    if (!row || !world) { plan.value = null; return }
    p.firstAddress = firstAddress ?? p.firstAddress
    p.phase = 'running'
    // A retry runs only what is left; steps that were done stay done.
    p.lines.forEach((line) => { if (line.status === 'failed' || line.status === 'notRun') { line.status = 'todo'; line.error = undefined } })
    let anyFailed = false
    for (const line of p.lines) {
      if (line.status === 'done') continue
      if (anyFailed && p.kind !== 'remove') { line.status = 'notRun'; continue }
      line.status = 'running'
      await wait(550)
      const ok = perform(p, line, row)
      if (ok) line.status = 'done'
      else anyFailed = true
      syncPeers()
    }
    syncPeers()
    p.phase = anyFailed ? 'failed' : 'done'
    lastRuns.value[row.key] = { kind: p.kind, lines: JSON.parse(JSON.stringify(p.lines)) as PlanLine[] }
    if (p.kind === 'remove') {
      delete runtime.value[row.key]
      delete lastRuns.value[row.key]
    } else {
      ask(rowByKey(row.key) ?? row)
    }
    if (!anyFailed) {
      if (p.kind === 'on' || p.kind === 'fix') delete lastRuns.value[row.key]
      await wait(700) // the last step shows done before the dialog closes
      plan.value = null
    }
  }

  // ------------------------------------------------------------ add, rename, change address
  type AddResult =
    | { ok: true; key: string }
    | { ok: false; error: 'address' | 'name' | 'duplicate'; existing?: string }

  const normalizeUrl = (address: string): string | null => {
    const text = address.trim().replace(/\/+$/, '')
    if (!text) return null
    const withScheme = /^[a-z]+:\/\//i.test(text) ? text : `http://${text}`
    return /^https?:\/\/[^\s/:]+(:\d{1,5})?$/i.test(withScheme) ? withScheme : null
  }

  const addNode = async (input: { address: string; name: string; collaborate: boolean }): Promise<AddResult> => {
    ensureWorld()
    const url = normalizeUrl(input.address)
    if (!url) return { ok: false, error: 'address' }
    if (!isValidName(input.name)) return { ok: false, error: 'name' }
    const name = input.name.trim()
    const sameUrl = rows.value.find((r) => hostPort(r.url) === hostPort(url))
    if (sameUrl) { flash(sameUrl.key); return { ok: false, error: 'duplicate', existing: sameUrl.name } }
    // The window checks who answers, for at most 1.5 s; a slower node is added and keeps checking in its row.
    const probe = reach(w(), url, 'window')
    await wait(Math.min(probe.delayMs, 1500))
    if (probe.ok) {
      const sameNode = rows.value.find((r) => r.nodeId === probe.nodeId)
      if (sameNode) { flash(sameNode.key); return { ok: false, error: 'duplicate', existing: sameNode.name } }
    }
    const added = await nodeStore.addRemoteNode({
      name, baseUrl: url, serverInstanceId: probe.ok ? probe.nodeId : undefined, openWindow: false,
    })
    const key = probe.ok ? probe.nodeId : `d:${added.id}`
    flash(key)
    ask(rowByKey(key) ?? { key, nodeId: probe.ok ? probe.nodeId : null, desktopId: added.id, name, url, isEmbedded: false, collaborating: false })
    if (probe.ok) {
      banner.value = { tone: 'info', key: 'added', params: { name }, rowKey: key }
      if (input.collaborate) requestOn(key)
    } else if (probe.delayMs > 1500) {
      banner.value = { tone: 'info', key: 'addedChecking', params: { name }, rowKey: key }
    } else {
      banner.value = { tone: 'info', key: input.collaborate ? 'addedUnreachableCollab' : 'addedUnreachable', params: { name, host: probe.host }, cause: probe.cause, rowKey: key }
    }
    return { ok: true, key }
  }

  const dismissBanner = (): void => { banner.value = null }

  let flashTimer: ReturnType<typeof setTimeout> | null = null
  const flash = (key: string): void => {
    flashKey.value = key
    if (flashTimer) clearTimeout(flashTimer)
    flashTimer = setTimeout(() => { flashKey.value = null }, 2500)
  }

  const renameNode = async (key: string, next: string): Promise<{ ok: true } | { ok: false; error: 'name' | 'taken' }> => {
    const row = rowByKey(key)
    const name = next.trim()
    if (!row) return { ok: false, error: 'name' }
    if (!isValidName(name)) return { ok: false, error: 'name' }
    if (rows.value.some((r) => r.key !== key && r.name.toLowerCase() === name.toLowerCase())) return { ok: false, error: 'taken' }
    await wait(150)
    if (row.desktopId && !row.isEmbedded) await nodeStore.renameNode(row.desktopId, name)
    const peer = world?.[thisId.value].peers.find((p) => p.nodeId === row.nodeId)
    if (peer) peer.name = name
    syncPeers()
    return { ok: true }
  }

  type ChangeResult =
    | { ok: true }
    | { ok: false; error: StepError | { kind: 'different' } }

  /** Change the address this node uses for a node: this node checks who answers there, and keeps it only when the node ID matches. */
  const changeAddress = async (key: string, address: string): Promise<ChangeResult> => {
    const row = rowByKey(key)
    const url = normalizeUrl(address)
    if (!row || !url) return { ok: false, error: { kind: 'unreachable', cause: 'refused', host: address.trim() } }
    const T = w()[thisId.value]
    const r = reach(w(), url, T.id)
    await wait(Math.min(r.delayMs, 900))
    if (!r.ok) {
      const suggestion = r.loopbackInContainer ? `http://host.docker.internal:${url.split(':').pop()}` : null
      return {
        ok: false,
        error: r.loopbackInContainer
          ? { kind: 'noAddress', firstTried: url, loopbackInContainer: true, suggestion }
          : { kind: 'unreachable', cause: r.cause, host: r.host },
      }
    }
    if (r.nodeId !== row.nodeId) return { ok: false, error: { kind: 'different' } }
    const peer = T.peers.find((p) => p.nodeId === row.nodeId)
    if (peer) peer.baseUrl = url
    syncPeers()
    askAgain(key)
    return { ok: true }
  }

  const openNode = async (key: string): Promise<void> => {
    const row = rowByKey(key)
    const api = (window as any).electronAPI
    if (!row || !api?.openNodeWindow) return
    // A node only this node knows (a peer) gets a desktop entry at its first Open, once this window has reached it.
    if (!row.desktopId && row.nodeId) {
      await nodeStore.addRemoteNode({ name: row.name, baseUrl: row.url, serverInstanceId: row.nodeId, openWindow: true })
      return
    }
    if (row.desktopId) await api.openNodeWindow(row.desktopId)
  }

  const offersOf = (key: string): OfferEntry[] | null => inspectionOf(key)?.offers ?? null

  return {
    thisId, switchOn, switchBusy, peers, rows, plan, banner, flashKey, expanded, lastRuns, hasOpen, thisName, currentNode,
    open, ensureWorld, askAgain, setSwitch, inspectionOf, isChecking, lineOf, offersOf, runtime,
    requestOn, requestFix, requestOff, requestRemove, cancelPlan, confirmPlan,
    addNode, dismissBanner, renameNode, changeAddress, openNode, rowByKey,
  }
})
