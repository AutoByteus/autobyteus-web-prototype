import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useNodeListStore } from '~/stores/nodeListStore'
import { APP_VERSION, NODE_IDS } from '~/prototype/nodes/network-world.mjs'

/**
 * extensions-ui-516 / private-network-661 (design only): the simulated private network and pairing (autobyteus-661, Stage 2,
 * Tailscale first, D-1). The Private Network extension's server part runs the network program (sign-in, this machine, my
 * machines); the node itself owns discovery and pairing with node keys on every connection (pairing-contract.md, D-2). Here
 * one small scripted world stands for both; every account, machine, address, key and code below is invented.
 *
 * Starting state of the network: `localStorage['autobyteus.prototype.extensions']` =
 *   `network_joined` (on the owner's tailnet) · `network_approval` (waiting for device approval in the Tailscale admin console;
 *   approved after about 10 s) · `network_expired` (Tailscale key expiry) · `network_signed_out` (signed out or removed in the
 *   admin console) · `network_unreachable` (Tailscale cannot be reached; back after about 12 s on the Private Network page) ·
 *   `network_blocked` (the tailnet's access rules block AutoByteus from reaching linux-box) · `network_shared_unknown` (a shared
 *   machine whose account Tailscale does not report) · `network_restarting` (rejoining after a restart, 8 s) ·
 *   `network_not_joined` (installed and on, not signed in yet). Without a `network_*` value Private Network is not installed.
 * Starting state of pairing: `localStorage['autobyteus.prototype.pairing']` =
 *   `after_update` (D-3: the three pairings made before the update show "Pair again": docker runs an older AutoByteus,
 *   linux-box is controlled, bob-laptop is someone else's; an old pairing stays until it is paired again) · `address_request` (a node asks to pair by its plain address).
 * Pair by address, scripted by the address typed: 192.168.1.30 accepts (dana-mac), 192.168.1.40 declines, 192.168.1.50 runs an
 *   does not accept the request (as an older AutoByteus would); any other address has no AutoByteus node.
 */

export interface NetworkMachine {
  id: string
  name: string
  address: string
  /** The Tailscale login that added it; `''` when Tailscale does not report it (a shared machine, PoC 2a). */
  account: string
  online: boolean
  isThisMachine?: boolean
  /** Shared into this tailnet from someone else's tailnet (REQ-016). */
  shared?: boolean
  /** Online, but the tailnet's access rules do not let this node reach AutoByteus on it (REQ-017). */
  blocked?: boolean
}
/** A node found through the network's machine list that answered `/autobyteus/info` (pairing-contract.md §4). */
export interface FoundNode {
  nodeId: string
  name: string
  machineId: string
  /** `own`: this desktop controls it (one-click Pair on its row); `teammate`: someone else's; `unknown`: on your account, not controlled here. */
  kind: 'own' | 'teammate' | 'unknown'
  phase: 'idle' | 'pairing' | 'waiting' | 'refused'
}
export interface IncomingRequest {
  nodeId: string
  name: string
  /** Over the private network: the caller's machine and account; by plain address: the address it gave (D-5). */
  machineId: string | null
  account: string | null
  address: string | null
  phase: 'idle' | 'allowing'
}
export interface PairedPeer { nodeId: string; name: string; account: string | null; role: 'own' | 'teammate'; machineId: string | null; via: 'network' | 'address' }
/** Pair by plain address with someone else's node (D-5): this node's outstanding request (pairing-contract §1). */
export interface OutgoingRequest { id: string; address: string; phase: 'waiting' | 'declined' }
/** A node announcing itself on this local network (pairing-contract §4b): name, address, node ID; no account. */
export interface LocalNode { nodeId: string; name: string; address: string; answer: 'accept' | 'decline'; phase: 'idle' | 'waiting' | 'declined' }
/** A pairing made before the update (D-3): its row stays and shows "Pair again". */
export interface LegacyPeer { nodeId: string; role: 'own' | 'teammate'; phase: 'idle' | 'pairing' | 'waiting' | 'declined' }

const OWNER = 'alex@example.com'
const BOB = 'bob@example.com'
const CAROL = 'carol@example.com'
const DANA = 'dana@other.example'
const machinesFor = (seed: string): NetworkMachine[] => [
  { id: 'm-home', name: 'home-mac', address: '100.88.10.10', account: OWNER, online: true, isThisMachine: true },
  { id: 'm-linux', name: 'linux-box', address: '100.88.30.30', account: OWNER, online: true, blocked: seed === 'network_blocked' },
  { id: 'm-office', name: 'office-mac', address: '100.88.20.20', account: OWNER, online: false },
  { id: 'm-pi', name: 'raspberrypi', address: '100.88.60.60', account: OWNER, online: true },
  { id: 'm-printer', name: 'hall-printer', address: '100.88.50.50', account: OWNER, online: true },
  { id: 'm-bob', name: 'bob-laptop', address: '100.88.40.40', account: BOB, online: true },
  { id: 'm-carol', name: 'carol-server', address: '100.88.70.70', account: CAROL, online: true },
  // A machine added with a tagged key belongs to the tag, never to a person; a machine shared from another tailnet.
  { id: 'm-ci', name: 'ci-runner', address: '100.88.80.80', account: 'tag:ci', online: true },
  { id: 'm-dana', name: 'dana-desktop', address: '100.88.90.90', account: seed === 'network_shared_unknown' ? '' : DANA, online: true, shared: true },
]
const nodeIdOf = (tail: string) => `srv_${(tail + 'Pn7Wq8Mv5Tn2Bc7Hy4Lp9Gs6Jd1Fa0XeKu').slice(0, 36)}`
const FOUND: FoundNode[] = [
  // Controlled by this desktop and already in its Nodes list: never shown under Found (pairing-contract §4).
  { nodeId: NODE_IDS.LINUX, name: 'linux-box', machineId: 'm-linux', kind: 'own', phase: 'idle' },
  { nodeId: nodeIdOf('b0bL4pt0pPriv'), name: 'bob-laptop', machineId: 'm-bob', kind: 'teammate', phase: 'idle' },
  { nodeId: nodeIdOf('r4spb3rryPriv'), name: 'raspberrypi', machineId: 'm-pi', kind: 'unknown', phase: 'idle' },
  // REQ-016: a teammate's machine shared with you from their own tailnet.
  { nodeId: nodeIdOf('d4n4D3skt0pSh'), name: 'dana-desktop', machineId: 'm-dana', kind: 'teammate', phase: 'idle' },
]
const NETWORK_REQUEST: IncomingRequest = { nodeId: nodeIdOf('c4r0lS3rvPriv'), name: 'carol-server', machineId: 'm-carol', account: CAROL, address: null, phase: 'idle' }
const ADDRESS_REQUEST: IncomingRequest = { nodeId: nodeIdOf('d4n4M4cAddr'), name: 'dana-mac', machineId: null, account: null, address: '192.168.1.30:29695', phase: 'idle' }
/** The founder's data, synthesized (AC-011): three pairings made before the update. */
const BOB_OLD = { nodeId: nodeIdOf('b0bL4pt0pL4n'), name: 'bob-laptop', address: 'http://192.168.1.20:29695' }
/** Pairing took well under a second on one Mac (pairing-probe); a few scripted seconds here. */
const PAIR_MS = 2000
const TEAMMATE_ALLOWS_MS = 7000
const OWNER_DECLINES_MS = 6000
const APPROVAL_MS = 10_000
const BACK_ONLINE_MS = 12_000

const later = (ms: number) => new Promise<void>((done) => setTimeout(done, ms))
const startState = () => (typeof window === 'undefined' ? '' : String(localStorage.getItem('autobyteus.prototype.extensions') || ''))
const pairingState = () => (typeof window === 'undefined' ? '' : String(localStorage.getItem('autobyteus.prototype.pairing') || ''))
/**
 * Design seed `autobyteus.prototype.thisComputerNetwork` = `off`: the window is bound to another node (e.g. a Docker node on the
 * private network) while this computer's own node is not on the private network (REQ-010).
 */
export const THIS_COMPUTER_OFF = typeof window !== 'undefined' && localStorage.getItem('autobyteus.prototype.thisComputerNetwork') === 'off'
const world = () => (typeof window === 'undefined' ? null : (window as any).__designNetworkWorld?.())
/** Tailscale's addresses (100.64.0.0/10, fd7a:115c:a1e0::/48): an address only a machine on the tailnet reaches. */
export const isPrivateNetworkAddress = (address: string): boolean => {
  const host = address.trim().replace(/^https?:\/\//, '').replace(/^\[/, '').split(/[\]/]/)[0]!.replace(/:\d+$/, '')
  const m = host.match(/^100\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/)
  return Boolean(m && Number(m[1]) >= 64 && Number(m[1]) <= 127) || /^fd7a:115c:a1e0:/i.test(host)
}

export const usePrivateNetworkStore = defineStore('privateNetwork', () => {
  const seed = startState()
  const seededJoined = seed.startsWith('network_') && seed !== 'network_approval' && seed !== 'network_not_joined'

  const joined = ref(seededJoined)
  const signingIn = ref(false)
  /** Tailscale device approval: the machine waits until an admin approves it in the admin console. */
  const awaitingApproval = ref(seed === 'network_approval')
  /** Tailscale key expiry: this machine's sign-in expired. */
  const expired = ref(seed === 'network_expired')
  /** Signed out of the tailnet (logged out, or the machine removed in the admin console). */
  const signedOut = ref(seed === 'network_signed_out')
  /** Tailscale cannot be reached from this computer (offline, or its servers unreachable); the program keeps trying. */
  const unreachable = ref(seed === 'network_unreachable')
  /** T2: after the node restarts, the network program rejoins with its saved state (~12.6 s measured; 8 s here). */
  const rejoining = ref(seed === 'network_restarting')
  const machines = ref<NetworkMachine[]>(machinesFor(seed))
  const discoverable = ref(seededJoined)
  const found = ref<FoundNode[]>(seededJoined ? structuredClone(FOUND) : [])
  const requests = ref<IncomingRequest[]>([
    ...(seededJoined && seed !== 'network_unreachable' ? [structuredClone(NETWORK_REQUEST)] : []),
    ...(pairingState() === 'address_request' ? [structuredClone(ADDRESS_REQUEST)] : []),
  ])
  const paired = ref<PairedPeer[]>([])
  const outgoing = ref<OutgoingRequest[]>([])
  const legacy = ref<LegacyPeer[]>([])
  /** Set when this node has just joined: the card frame offers "Make this node visible on your private network?" once. */
  const offerDiscovery = ref(false)
  let approvalStarted = false
  let backOnlineStarted = false

  // Under the node-key model a paired node runs this version: outside `after_update`, the paired docker node is current
  // (an older node cannot hold a node-key pairing; it shows Pair again with the update note, below).
  if (pairingState() !== 'after_update') {
    const w = world()
    if (w && w.nodes[NODE_IDS.D1]) w.nodes[NODE_IDS.D1].server = { version: APP_VERSION, relation: 'same', mode: 'available' }
  }
  // D-3: the pairings made before the update stay listed, unpaired (no secret), until paired again.
  if (pairingState() === 'after_update') {
    const w = world()
    if (w && !w.__afterUpdateSeeded) {
      w.__afterUpdateSeeded = true
      w.setPaired(NODE_IDS.D1, false)
      w.addPeerAt({ nodeId: NODE_IDS.LINUX, name: 'linux-box', address: 'http://192.168.2.50:29695', paired: false })
      w.addPeerAt({ ...BOB_OLD, paired: false })
    }
    legacy.value = [
      { nodeId: NODE_IDS.D1, role: 'own', phase: 'idle' },
      { nodeId: NODE_IDS.LINUX, role: 'own', phase: 'idle' },
      { nodeId: BOB_OLD.nodeId, role: 'teammate', phase: 'idle' },
    ]
  }

  const thisMachine = computed(() => machines.value.find((m) => m.isThisMachine)!)
  const ownerAccount = OWNER
  const accountLabel = (account: string | null) => !account ? '' : account === OWNER ? 'you' : account === BOB ? 'bob' : account === CAROL ? 'carol' : account
  const machineOf = (id: string | null) => (id ? machines.value.find((m) => m.id === id) : undefined)
  const blockedMachines = computed(() => machines.value.filter((m) => m.blocked && m.online))
  /** Where the network is, for Manage Nodes: "Tailscale · alex@example.com". */
  const networkLabel = computed(() => `Tailscale · ${OWNER}`)
  /** Ready for discovery and pairing: joined and not held by a Tailscale condition. */
  const ready = computed(() => joined.value && !rejoining.value && !expired.value && !signedOut.value && !unreachable.value)
  /** This computer's own node is on the private network: the desktop reaches private addresses through it (REQ-010, G1). */
  const thisComputerOnNetwork = computed(() => ready.value && !THIS_COMPUTER_OFF)
  /** An access code whose address only a machine on the private network reaches, while this computer's node is not on it. */
  const needsJoinFor = (address: string | null | undefined) => Boolean(address && isPrivateNetworkAddress(address) && !thisComputerOnNetwork.value)

  /** The extension's status() for this node: what its card says (extension-contract §4; REQ-015, REQ-017). */
  const status = computed<{ ready: boolean; message: string }>(() => {
    if (awaitingApproval.value) return { ready: false, message: 'Waiting for approval in your Tailscale admin console.' }
    if (signingIn.value) return { ready: false, message: 'Waiting for the sign-in to finish in your browser.' }
    if (!joined.value) return { ready: false, message: 'Not on your private network yet. Sign in with Tailscale below.' }
    if (rejoining.value) return { ready: false, message: 'Rejoining your private network after a restart…' }
    if (expired.value) return { ready: false, message: 'Your Tailscale sign-in expired. Sign in again.' }
    if (signedOut.value) return { ready: false, message: 'Signed out of Tailscale. Sign in again.' }
    if (unreachable.value) return { ready: false, message: 'Tailscale can’t be reached from this computer. Trying again by itself.' }
    const blocked = blockedMachines.value
    if (blocked.length) return { ready: true, message: `Connected as ${thisMachine.value.name}, but your tailnet’s access rules block AutoByteus on ${blocked.map((m) => m.name).join(', ')}.` }
    return { ready: true, message: `Connected to your private network as ${thisMachine.value.name}.` }
  })

  function reset(): void {
    joined.value = false; signingIn.value = false; discoverable.value = false
    awaitingApproval.value = false; expired.value = false; signedOut.value = false; unreachable.value = false
    found.value = []; requests.value = requests.value.filter((r) => r.address); offerDiscovery.value = false
  }

  function completeJoin(): void {
    machines.value = machinesFor('')
    joined.value = true
    signingIn.value = false
    expired.value = false
    signedOut.value = false
    awaitingApproval.value = false
    offerDiscovery.value = true
    // Discovery runs when the node joins; the others answer only while their owners let them be found.
    found.value = structuredClone(FOUND)
  }

  /** The page asks for the state: scripted actors (the admin approves; Tailscale comes back; the restart ends). */
  let rejoinStarted = false
  function touch(): void {
    if (rejoining.value && !rejoinStarted) { rejoinStarted = true; void later(8000).then(() => { rejoining.value = false }) }
    if (awaitingApproval.value && !approvalStarted) {
      approvalStarted = true
      void later(APPROVAL_MS).then(() => { if (awaitingApproval.value) completeJoin() })
    }
    if (unreachable.value && !backOnlineStarted) {
      backOnlineStarted = true
      void later(BACK_ONLINE_MS).then(() => { unreachable.value = false })
    }
  }

  /** "Sign in with Tailscale": the login link opens in the browser; the sign-in finishes there (scripted). Also "Sign in again". */
  async function signIn(): Promise<void> {
    signingIn.value = true
    await later(3200)
    if (!signingIn.value) return
    if ((expired.value || signedOut.value) && joined.value) { expired.value = false; signedOut.value = false; signingIn.value = false; return }
    completeJoin()
  }
  function cancelSignIn(): void { signingIn.value = false }
  async function joinWithKey(key: string): Promise<{ ok: boolean; error?: string }> {
    await later(1600)
    if (!/^tskey-auth-[A-Za-z0-9-]{12,}$/.test(key.trim())) {
      return { ok: false, error: 'Tailscale did not accept that auth key: it may be mistyped, used or expired. Make a new one in the admin console under Settings → Keys.' }
    }
    completeJoin()
    return { ok: true }
  }

  /** Leave the tailnet. Pairings stay; over the private network they reach this node again only as the same machine. */
  async function leave(): Promise<void> {
    await later(1200)
    joined.value = false; expired.value = false; signedOut.value = false; unreachable.value = false
    discoverable.value = false; found.value = []; requests.value = requests.value.filter((r) => r.address); offerDiscovery.value = false
  }

  function setDiscoverable(value: boolean): void { discoverable.value = value; offerDiscovery.value = false }
  function dismissDiscoveryOffer(): void { offerDiscovery.value = false }

  const flash = async (nodeId: string): Promise<void> => {
    const list = useNodeListStore()
    await list.open()
    list.flashKey = nodeId
    setTimeout(() => { if (list.flashKey === nodeId) list.flashKey = null }, 2400)
  }
  /** A pair completed: both sides hold the other's record (pairing-contract §1). */
  async function landInNodes(node: { nodeId: string; name: string; machineId: string | null; address?: string }, role: 'own' | 'teammate', account: string | null, via: 'network' | 'address'): Promise<void> {
    const address = node.address ?? `http://${machineOf(node.machineId)?.address ?? '100.88.99.99'}:29695`
    world()?.addPrivateNode({ nodeId: node.nodeId, name: node.name, address })
    paired.value = [...paired.value.filter((p) => p.nodeId !== node.nodeId), { nodeId: node.nodeId, name: node.name, account, role, machineId: node.machineId, via }]
    await flash(node.nodeId)
  }

  async function pair(nodeId: string): Promise<void> {
    const node = found.value.find((n) => n.nodeId === nodeId)
    // Only for a node this AutoByteus controls (its row in "Controlled nodes"): it decides for both sides.
    if (!node || node.kind === 'teammate') return
    node.phase = 'pairing'
    await later(PAIR_MS)
    found.value = found.value.filter((n) => n.nodeId !== nodeId)
    await landInNodes(node, 'own', OWNER, 'network')
  }
  async function connect(nodeId: string): Promise<void> {
    const node = found.value.find((n) => n.nodeId === nodeId)
    if (!node) return
    node.phase = 'waiting'
    if (node.kind !== 'teammate') {
      // Scripted: the unknown machine's owner declines (pair-rejected, pairing-contract §2).
      await later(OWNER_DECLINES_MS)
      const waiting = found.value.find((n) => n.nodeId === nodeId)
      if (waiting && waiting.phase === 'waiting') waiting.phase = 'refused'
      return
    }
    await later(TEAMMATE_ALLOWS_MS)
    const still = found.value.find((n) => n.nodeId === nodeId)
    if (!still || still.phase !== 'waiting') return
    found.value = found.value.filter((n) => n.nodeId !== nodeId)
    await landInNodes(still, 'teammate', machineOf(still.machineId)?.account || null, 'network')
  }
  function cancelConnect(nodeId: string): void {
    const node = found.value.find((n) => n.nodeId === nodeId)
    if (node) node.phase = 'idle'
  }
  async function allow(nodeId: string): Promise<void> {
    const request = requests.value.find((r) => r.nodeId === nodeId)
    if (!request) return
    request.phase = 'allowing'
    await later(PAIR_MS)
    requests.value = requests.value.filter((r) => r.nodeId !== nodeId)
    await landInNodes({ ...request, address: request.address ? `http://${request.address}` : undefined }, 'teammate', request.account, request.address ? 'address' : 'network')
  }
  function reject(nodeId: string): void { requests.value = requests.value.filter((r) => r.nodeId !== nodeId) }

  /**
   * Unpair (pairing-contract §1: the peer record is removed by Unpair, on both sides). Your own node stays in the Nodes list with
   * this AutoByteus's control; a teammate's node leaves the list (one found on the private network is back under Found).
   */
  async function unpair(nodeId: string): Promise<void> {
    const peer = paired.value.find((p) => p.nodeId === nodeId)
    if (!peer) return
    await later(900)
    world()?.removePrivatePeer(nodeId)
    paired.value = paired.value.filter((p) => p.nodeId !== nodeId)
    if (peer.via === 'network' && !found.value.some((n) => n.nodeId === nodeId)) found.value = [...found.value, { nodeId, name: peer.name, machineId: peer.machineId!, kind: peer.role === 'own' ? 'own' : 'teammate', phase: 'idle' }]
    await useNodeListStore().open()
  }

  // ---- Pair again (D-3, REQ-012): a pairing made before the update
  const legacyOf = (nodeId: string | null) => (nodeId ? legacy.value.find((l) => l.nodeId === nodeId) ?? null : null)
  /** Own node: one click (pairing-contract §3 case 1). Someone else's: Pair → their owner Accepts (the address the row keeps). */
  async function pairAgain(nodeId: string): Promise<void> {
    const entry = legacyOf(nodeId)
    if (!entry || entry.phase === 'pairing' || entry.phase === 'waiting') return
    entry.phase = entry.role === 'own' ? 'pairing' : 'waiting'
    await later(entry.role === 'own' ? PAIR_MS : TEAMMATE_ALLOWS_MS)
    if (entry.phase !== 'pairing' && entry.phase !== 'waiting') return
    world()?.setPaired(nodeId, true)
    legacy.value = legacy.value.filter((l) => l.nodeId !== nodeId)
    if (entry.role === 'teammate') paired.value = [...paired.value, { nodeId, name: BOB_OLD.name, account: null, role: 'teammate', machineId: null, via: 'address' }]
    await flash(nodeId)
  }
  function cancelPairAgain(nodeId: string): void { const entry = legacyOf(nodeId); if (entry) entry.phase = 'idle' }
  // ---- Pair by address with someone else's node (D-5, REQ-008): Pair → its owner Accepts / Rejects; Cancel
  const ADDRESS_NODES: Record<string, { nodeId: string; name: string; answer: 'accept' | 'decline' | 'refused' }> = {
    '192.168.1.30': { nodeId: nodeIdOf('d4n4M4cAddr'), name: 'dana-mac', answer: 'accept' },
    '192.168.1.40': { nodeId: nodeIdOf('3v3B0xAddr'), name: 'eve-box', answer: 'decline' },
    // F-4 (DESIGN.md rule 9): no version check for someone else's node: an older one simply does not accept the request.
    '192.168.1.50': { nodeId: nodeIdOf('fr4nkPcAddr'), name: 'frank-pc', answer: 'refused' },
  }
  const normalized = (text: string): string | null => {
    const v = text.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '')
    const m = v.match(/^([a-z0-9.-]+|\[[0-9a-f:]+\])(?::(\d{1,5}))?$/i)
    return m ? `${m[1]!.toLowerCase()}:${m[2] ?? '29695'}` : null
  }
  /**
   * Asks the node at an address to pair. The UI gives the checks of the form (this node, a node you control, already paired)
   * before calling; here: no answer, the request not accepted (e.g. an older AutoByteus), or the request waits for its owner.
   */
  async function pairByAddress(text: string): Promise<{ ok: true } | { ok: false; error: 'format' | 'noNode' | 'refused'; address?: string }> {
    const address = normalized(text)
    if (!address) return { ok: false, error: 'format' }
    await later(1200)
    const target = ADDRESS_NODES[address.replace(/:\d+$/, '')]
    if (!target) return { ok: false, error: 'noNode', address }
    if (target.answer === 'refused') return { ok: false, error: 'refused', address }
    const id = `${address}#${Date.now()}`
    outgoing.value = [...outgoing.value.filter((o) => o.address !== address), { id, address, phase: 'waiting' }]
    void later(target.answer === 'accept' ? TEAMMATE_ALLOWS_MS : OWNER_DECLINES_MS).then(async () => {
      const still = outgoing.value.find((o) => o.id === id)
      if (!still || still.phase !== 'waiting') return
      if (target.answer === 'decline') { still.phase = 'declined'; return }
      outgoing.value = outgoing.value.filter((o) => o.id !== id)
      await landInNodes({ nodeId: target.nodeId, name: target.name, machineId: null, address: `http://${address}` }, 'teammate', null, 'address')
    })
    return { ok: true }
  }
  /** Cancel drops the outstanding request: a later Accept is refused, nothing is stored (pairing-contract §3). */
  function cancelOutgoing(id: string): void { outgoing.value = outgoing.value.filter((o) => o.id !== id) }
  const addressFormOf = normalized

  // ---- Local network (D-6, REQ-018, REQ-019; pairing-contract §4b): DNS-SD on one network segment, no accounts.
  // Design seed `autobyteus.prototype.localDiscovery` = a comma list of `office` (colleagues' nodes announce on this network),
  // `allowed` (this node accepts local-network connections), `visible` (this node announces itself). Default: nothing announces,
  // not allowed, not visible.
  const localSeed = typeof window === 'undefined' ? [] : String(localStorage.getItem('autobyteus.prototype.localDiscovery') || '').split(',')
  /** The existing per-network setting "Wi-Fi/LAN allowed on this network" (Phone Setup), kept on this computer's node. */
  const localAllowed = ref(localSeed.includes('allowed') || localSeed.includes('visible'))
  const visibleOnLocal = ref(localSeed.includes('visible'))
  /** The address this node announces (its local-network address): what colleagues see and could type. */
  const localAddress = '192.168.2.10:29695'
  const LOCAL_ANNOUNCED: LocalNode[] = [
    { nodeId: nodeIdOf('d4n4M4cAddr'), name: 'dana-mac', address: '192.168.1.30:29695', answer: 'accept', phase: 'idle' },
    // Also on the tailnet (the same nodeId as Found on your private network): shown once, under the private network (§4b).
    { nodeId: nodeIdOf('b0bL4pt0pPriv'), name: 'bob-laptop', address: '192.168.1.20:29695', answer: 'accept', phase: 'idle' },
    { nodeId: nodeIdOf('3v3B0xAddr'), name: 'eve-box', address: '192.168.1.40:29695', answer: 'decline', phase: 'idle' },
    // The owner's own machine, not controlled here: Control with its access code (the code carries a local address).
    { nodeId: nodeIdOf('stud10M4cL4n'), name: 'studio-mac', address: '192.168.1.60:29695', answer: 'decline', phase: 'idle' },
  ]
  const localFound = ref<LocalNode[]>(localSeed.includes('office') ? structuredClone(LOCAL_ANNOUNCED) : [])
  function setVisibleOnLocal(value: boolean): void { if (!value || localAllowed.value) visibleOnLocal.value = value }
  /** "Allow and make visible": the node accepts this local network (the existing setting), then announces itself. */
  async function allowLocalAndShow(): Promise<void> { await later(700); localAllowed.value = true; visibleOnLocal.value = true }
  async function pairLocal(nodeId: string): Promise<void> {
    const node = localFound.value.find((n) => n.nodeId === nodeId)
    if (!node) return
    node.phase = 'waiting'
    await later(node.answer === 'accept' ? TEAMMATE_ALLOWS_MS : OWNER_DECLINES_MS)
    const still = localFound.value.find((n) => n.nodeId === nodeId)
    if (!still || still.phase !== 'waiting') return
    if (still.answer === 'decline') { still.phase = 'declined'; return }
    localFound.value = localFound.value.filter((n) => n.nodeId !== nodeId)
    await landInNodes({ nodeId, name: still.name, machineId: null, address: `http://${still.address}` }, 'teammate', null, 'address')
  }
  function cancelLocal(nodeId: string): void { const node = localFound.value.find((n) => n.nodeId === nodeId); if (node) node.phase = 'idle' }
  /** A node seen on both networks appears once, under the private network, which knows who added it (§4b). */
  const localShownIds = computed(() => new Set(ready.value ? found.value.map((n) => n.nodeId) : []))

  /** A node this AutoByteus controls that the private network also found: its row's Pair pairs it in one click (pairing-contract §3 case 1, §4). */
  const ownOnNetwork = (nodeId: string | null) => (nodeId && ready.value ? found.value.find((n) => n.nodeId === nodeId && n.kind !== 'teammate') ?? null : null)
  const peerMark = (nodeId: string | null) => (nodeId ? paired.value.find((p) => p.nodeId === nodeId) ?? null : null)

  return {
    joined, signingIn, awaitingApproval, expired, signedOut, unreachable, rejoining, ready, thisComputerOnNetwork, needsJoinFor,
    machines, discoverable, found, requests, paired, outgoing, legacy, offerDiscovery, blockedMachines,
    thisMachine, ownerAccount, accountLabel, machineOf, peerMark, ownOnNetwork, legacyOf, networkLabel, status, addressFormOf,
    reset, touch, signIn, cancelSignIn, joinWithKey, leave,
    setDiscoverable, dismissDiscoveryOffer, pair, connect, cancelConnect, allow, reject, unpair,
    pairAgain, cancelPairAgain, pairByAddress, cancelOutgoing,
    localAllowed, visibleOnLocal, localAddress, localFound, localShownIds, setVisibleOnLocal, allowLocalAndShow, pairLocal, cancelLocal,
  }
})
