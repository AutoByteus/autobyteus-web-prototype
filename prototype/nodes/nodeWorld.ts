// Nodes page (design one-nodes-tab): a small simulated network of AutoByteus nodes.
// UI-reference simulation only. In the product, this node's server and the other nodes' servers answer these questions.
// Every node, name, address, node ID, delay and offer below is illustrative and invented for this design.

import type { OfferEntry } from '~/prototype/remote-collaboration/offersScript'
import { DOCKER_OFFER, STUDIO_OFFER, EIGHT_THREE_OFFER, EMBEDDED_OFFER } from '~/prototype/remote-collaboration/offersScript'

export type Cause = 'refused' | 'timeout' | 'dns' | 'notAutobyteus'

export interface WorldPeer { nodeId: string; name: string; baseUrl: string }

export interface WorldNode {
  id: string
  selfName: string
  docker: boolean
  /** Runs on another machine of the private network: its own `localhost` is not this desktop. */
  lan?: boolean
  switchOn: boolean
  peers: WorldPeer[]
  offers: OfferEntry[]
  /** How long this node takes to answer a request, in ms. */
  delayMs: number
  /** How other nodes may reach this node, in the order this node lists them. */
  candidates: string[]
  /** Scripted: the node's next write from this window fails once, and it stays away for 8 s (a node that restarts). */
  failOnce?: boolean
  downUntil?: number
  /** Scripted: this node runs in Docker and cannot find an address for the node that registers on it (the loopback hint). */
  noAddressForOthers?: boolean
}

export type Reach =
  | { ok: true; nodeId: string; delayMs: number }
  | { ok: false; cause: Cause; host: string; delayMs: number; loopbackInContainer?: boolean }

const DEFAULT_REFUSED_MS = 500

// ---------------------------------------------------------------- the network
const E = 'srv_m9VFq2Lw'
const D1 = 'srv_ibJioK7n'
const D3 = 'srv_Q3xKa8Zt'
const D4 = 'srv_d4Hh1WcP'
const D5 = 'srv_x5Rn7BeY'
const LAP = 'srv_lapT0p4Vu'
const STU = 'srv_stUd10Ka9'
const NAS = 'srv_n4sBo7Xe'
const SPARE = 'srv_sp4r3Km1'
const SPARE_OTHER = 'srv_unRegd5Jq'
const OLD = 'srv_oldB0x2Mz'
const EDGE = 'srv_edG3t7Hs'

export const NODE_IDS = { E, D1, D3, D4, D5, LAP, STU, NAS, SPARE, OLD, EDGE }

const LAN_THIS = 'http://192.168.2.10:29695'

const eight = (port: number): string[] => [`http://localhost:${port}`, `http://host.docker.internal:${port}`, `http://172.17.0.4:${port}`]

const node = (n: Partial<WorldNode> & Pick<WorldNode, 'id' | 'selfName'>): WorldNode => ({
  docker: false, switchOn: false, peers: [], offers: [], delayMs: 900, candidates: [], ...n,
})

/** Where each address answers, as the window (this desktop) and every non-Docker node see it. */
const LISTENERS: Record<string, string | { cause: Cause } | { other: string }> = {
  'localhost:29695': E, '127.0.0.1:29695': E, '192.168.2.10:29695': E,
  'localhost:8001': D1, 'localhost:8003': D3, 'localhost:8004': D4, 'localhost:8005': D5,
  '192.168.2.40:29695': LAP, '192.168.2.31:29695': STU, '192.168.2.55:29695': NAS,
  '192.168.2.77:29695': { cause: 'refused' }, '192.168.2.90:29695': { other: SPARE_OTHER }, '192.168.2.99:29695': { cause: 'timeout' },
}

export const buildWorld = (scenario: string): Record<string, WorldNode> => {
  const states = scenario === 'nodes_states'
  const nodes: Record<string, WorldNode> = {
    [E]: node({
      id: E, selfName: 'Embedded Node', switchOn: true, delayMs: 300, offers: EMBEDDED_OFFER,
      candidates: ['http://127.0.0.1:29695', 'http://host.docker.internal:29695', LAN_THIS],
      peers: [
        { nodeId: D1, name: 'docker', baseUrl: 'http://localhost:8001' },
        ...(states ? [
          { nodeId: STU, name: 'studio', baseUrl: 'http://192.168.2.31:29695' },
          { nodeId: LAP, name: 'laptop', baseUrl: 'http://192.168.2.40:29695' },
          { nodeId: SPARE, name: 'spare', baseUrl: 'http://192.168.2.90:29695' },
          { nodeId: OLD, name: 'old-box', baseUrl: 'http://192.168.2.77:29695' },
          { nodeId: EDGE, name: 'edge', baseUrl: 'http://192.168.2.99:29695' },
        ] : []),
      ],
    }),
    [D1]: node({
      id: D1, selfName: 'docker', docker: true, switchOn: true, delayMs: 900, candidates: eight(8001), offers: DOCKER_OFFER,
      peers: [{ nodeId: E, name: 'Embedded Node', baseUrl: 'http://host.docker.internal:29695' }],
    }),
    [D3]: node({ id: D3, selfName: '8003', docker: true, switchOn: false, delayMs: 700, candidates: eight(8003), offers: EIGHT_THREE_OFFER }),
    [D4]: node({ id: D4, selfName: '8004', docker: true, switchOn: false, delayMs: 700, candidates: eight(8004), offers: EIGHT_THREE_OFFER.slice(0, 2), noAddressForOthers: true }),
    [D5]: node({ id: D5, selfName: '8005', docker: true, switchOn: false, delayMs: 700, candidates: eight(8005), offers: EIGHT_THREE_OFFER.slice(0, 1), failOnce: true }),
    [STU]: node({ id: STU, selfName: 'studio', lan: true, switchOn: false, delayMs: 1400, candidates: ['http://192.168.2.31:29695'], offers: STUDIO_OFFER }),
    [LAP]: node({
      id: LAP, selfName: 'laptop', lan: true, switchOn: true, delayMs: 1100, candidates: ['http://192.168.2.40:29695'], offers: EIGHT_THREE_OFFER.slice(0, 3),
      // laptop already has a node named "Embedded Node" (an older one), so this node is registered there as "Embedded Node 2".
      peers: [{ nodeId: 'srv_oldEmb3dd', name: 'Embedded Node', baseUrl: 'http://192.168.2.20:29695' }],
    }),
    [NAS]: node({
      id: NAS, selfName: 'nas', lan: true, switchOn: true, delayMs: 800, candidates: ['http://192.168.2.55:29695'],
      peers: [{ nodeId: E, name: 'Embedded Node', baseUrl: LAN_THIS }],
    }),
  }
  return nodes
}

// ---------------------------------------------------------------- reaching an address
const hostPortOf = (url: string): { host: string; port: string } => {
  const text = url.trim().replace(/^[a-z]+:\/\//i, '').replace(/\/.*$/, '')
  const [host, port = '80'] = text.split(':')
  return { host: host.toLowerCase(), port }
}

export const hostPort = (url: string): string => {
  const { host, port } = hostPortOf(url)
  return `${host}:${port}`
}

const isLoopback = (host: string): boolean => host === 'localhost' || host === '127.0.0.1' || host === '::1'

const failDelay = (cause: Cause): number => cause === 'timeout' ? 20000 : cause === 'refused' ? DEFAULT_REFUSED_MS : 700

/** Who answers at `url`, asked by `from`: this window, or a node (whose own view of the address applies). */
export const reach = (world: Record<string, WorldNode>, url: string, from: 'window' | string): Reach => {
  const { host, port } = hostPortOf(url)
  const caller = from === 'window' ? null : world[from]
  const fromDocker = Boolean(caller?.docker)
  const fail = (cause: Cause, extra: Partial<Extract<Reach, { ok: false }>> = {}): Reach =>
    ({ ok: false, cause, host, delayMs: failDelay(cause), ...extra })

  let key = `${host}:${port}`
  if (host === 'host.docker.internal') {
    if (!fromDocker) return fail('dns')
    key = `localhost:${port}`
  } else if (fromDocker && isLoopback(host)) {
    return fail('refused', { loopbackInContainer: true })
  } else if (caller?.lan && isLoopback(host)) {
    return fail('refused')
  }
  const hit = LISTENERS[key]
  if (hit === undefined) {
    if (host.includes('slow')) return fail('timeout')
    if (host.includes('nohost')) return fail('dns')
    if (host.includes('notab') || port === '80' || port === '443') return fail('notAutobyteus')
    return fail('refused')
  }
  if (typeof hit === 'string') {
    const target = world[hit]
    if (target?.downUntil && Date.now() < target.downUntil) return fail('refused')
    return { ok: true, nodeId: hit, delayMs: target?.delayMs ?? 700 }
  }
  if ('cause' in hit) return fail(hit.cause)
  return { ok: true, nodeId: hit.other, delayMs: 900 }
}

// ---------------------------------------------------------------- directions
export type DirState =
  | { state: 'working' }
  | { state: 'offHere' } | { state: 'offThere' }
  | { state: 'notRegisteredHere' } | { state: 'notRegisteredThere' }
  | { state: 'unreachable'; cause: Cause; host: string; loopbackInContainer?: boolean }
  | { state: 'different' }

export interface Inspection {
  windowReach: Reach
  /** This node → it. */
  thisToIt: DirState
  /** It → this node. */
  itToThis: DirState
  /** The address this node uses for it, and the address it uses for this node. */
  viaThis: string | null
  viaIt: string | null
  /** The collaboration is set on this node (the Agents switch). */
  registeredHere: boolean
  registeredThere: boolean
  itSwitchOn: boolean | null
  offers: OfferEntry[] | null
  delayMs: number
}

const unreachable = (r: Extract<Reach, { ok: false }>): DirState => ({ state: 'unreachable', cause: r.cause, host: r.host, loopbackInContainer: r.loopbackInContainer })

/** What the page learns about one node, in one request that takes as long as that node needs (never more than 20 s). */
export const inspect = (world: Record<string, WorldNode>, thisId: string, nodeId: string | null, url: string): Inspection => {
  const T = world[thisId]
  const windowReach = reach(world, url, 'window')
  const B = windowReach.ok ? world[windowReach.nodeId] : undefined
  const peerOnT = nodeId ? T.peers.find((p) => p.nodeId === nodeId) : undefined
  const registeredHere = Boolean(peerOnT)
  const base = { windowReach, viaThis: peerOnT?.baseUrl ?? null, registeredHere, delayMs: windowReach.delayMs }
  if (!windowReach.ok) {
    const dir = unreachable(windowReach)
    return { ...base, thisToIt: dir, itToThis: dir, viaIt: null, registeredThere: false, itSwitchOn: null, offers: null }
  }
  if (nodeId && windowReach.nodeId !== nodeId) {
    return { ...base, thisToIt: { state: 'different' }, itToThis: { state: 'different' }, viaIt: null, registeredThere: false, itSwitchOn: null, offers: null }
  }
  const peerOnB = B?.peers.find((p) => p.nodeId === thisId)
  let thisToIt: DirState
  if (!T.switchOn) thisToIt = { state: 'offHere' }
  else if (!peerOnT) thisToIt = { state: 'notRegisteredHere' }
  else {
    const r = reach(world, peerOnT.baseUrl, thisId)
    if (!r.ok) thisToIt = unreachable(r)
    else if (r.nodeId !== nodeId) thisToIt = { state: 'different' }
    else if (!B!.switchOn) thisToIt = { state: 'offThere' }
    else if (!peerOnB) thisToIt = { state: 'notRegisteredThere' }
    else thisToIt = { state: 'working' }
  }
  let itToThis: DirState
  if (!B!.switchOn) itToThis = { state: 'offThere' }
  else if (!peerOnB) itToThis = { state: 'notRegisteredThere' }
  else {
    const r = reach(world, peerOnB.baseUrl, B!.id)
    if (!r.ok) itToThis = unreachable(r)
    else if (!T.switchOn) itToThis = { state: 'offHere' }
    else if (!peerOnT) itToThis = { state: 'notRegisteredHere' }
    else itToThis = { state: 'working' }
  }
  return {
    ...base, thisToIt, itToThis, viaIt: peerOnB?.baseUrl ?? null, registeredThere: Boolean(peerOnB),
    itSwitchOn: B!.switchOn, offers: thisToIt.state === 'working' ? B!.offers : null,
  }
}

// ---------------------------------------------------------------- names
const NAME_RULE = /^[A-Za-z0-9][A-Za-z0-9 _.-]{0,63}$/
export const isValidName = (name: string): boolean => NAME_RULE.test(name.trim())

/** The name rule of the product: invalid runs become "-", then the name is made unique with " 2", " 3", … */
export const registrationName = (wanted: string, taken: string[]): string => {
  let name = wanted.replace(/[^A-Za-z0-9 _.-]+/g, '-').replace(/^[^A-Za-z0-9]+/, '').slice(0, 64) || 'node'
  const lower = new Set(taken.map((t) => t.toLowerCase()))
  if (!lower.has(name.toLowerCase())) return name
  for (let i = 2; ; i += 1) {
    const candidate = `${name.slice(0, 64 - ` ${i}`.length)} ${i}`
    if (!lower.has(candidate.toLowerCase())) return candidate
  }
}

// ---------------------------------------------------------------- address resolution on a node that is registering another
export type Resolved =
  | { ok: true; url: string; delayMs: number }
  | { ok: false; firstTried: string; loopbackInContainer: boolean; suggestion: string | null; delayMs: number }

/** `on` tries the candidates of `of`, and keeps the first one that answers with the right node ID. */
export const resolveAddress = (world: Record<string, WorldNode>, on: string, of: string, first?: string): Resolved => {
  const caller = world[on]
  const candidates = world[of].candidates
  if (caller.noAddressForOthers && !first) {
    const firstTried = 'http://127.0.0.1:29695'
    return {
      ok: false, firstTried, loopbackInContainer: true, delayMs: 700,
      suggestion: `http://host.docker.internal:${hostPortOf(firstTried).port}`,
    }
  }
  const order = first ? [first, ...candidates.filter((c) => c !== first)] : candidates
  for (const url of order) {
    const r = reach(world, url, on)
    if (r.ok && r.nodeId === of) return { ok: true, url, delayMs: 600 }
  }
  return { ok: false, firstTried: order[0], loopbackInContainer: false, suggestion: null, delayMs: 700 }
}
