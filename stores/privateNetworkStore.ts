import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { toQrCodeDataUrl } from '~/services/qr/qrCodeDataUrlService'
import { useNodeStore } from '~/stores/nodeStore'
import { useNodeAccessStore } from '~/stores/nodeAccessStore'
import { useNodeListStore } from '~/stores/nodeListStore'

/**
 * extensions-ui-516 (design only): the simulated private network and pairing over it (autobyteus-516, Part B).
 *
 * In the product, the Private Network extension's server part runs the network program (joining, this machine, my
 * machines, connection codes), and the node itself owns discovery and pairing (pairing-contract.md). Here one small
 * scripted world stands for both; every account, machine, address, key and code below is invented. Nothing is contacted.
 *
 * Starting state: `localStorage['autobyteus.prototype.extensions']` = `network_joined` (joined, found nodes, one incoming
 * request) or `network_trust` (the same with "Trust machines I added" on). Any other value starts not joined.
 */

export type NetworkKind = 'tailscale' | 'headscale'
export interface NetworkMachine {
  id: string
  name: string
  address: string
  account: string
  online: boolean
  isThisMachine?: boolean
}
/** A node found through the network's machine list that answered `/autobyteus/info` (pairing-contract.md §7). */
export interface FoundNode {
  nodeId: string
  name: string
  machineId: string
  /** `own`: this desktop is its owner (one-click Pair); `teammate`: someone else's; `unknown`: on your account, but this desktop is not its owner. */
  kind: 'own' | 'teammate' | 'unknown'
  phase: 'idle' | 'pairing' | 'waiting' | 'refused'
}
export interface IncomingRequest {
  nodeId: string
  name: string
  machineId: string
  account: string
  phase: 'idle' | 'allowing'
}
export interface PairedPeer { nodeId: string; name: string; account: string; role: 'own' | 'teammate' }
export interface ConnectionCode { text: string; qr: string; expiresAt: number; machineCount: number }

const OWNER = 'alex@example.com'
const ACCOUNT_SHORT: Record<string, string> = { [OWNER]: 'you', 'bob@example.com': 'bob', 'carol@example.com': 'carol' }
const MACHINES: NetworkMachine[] = [
  { id: 'm-home', name: 'home-mac', address: '100.88.10.10', account: OWNER, online: true, isThisMachine: true },
  { id: 'm-linux', name: 'linux-box', address: '100.88.30.30', account: OWNER, online: true },
  { id: 'm-office', name: 'office-mac', address: '100.88.20.20', account: OWNER, online: false },
  { id: 'm-pi', name: 'raspberrypi', address: '100.88.60.60', account: OWNER, online: true },
  { id: 'm-printer', name: 'hall-printer', address: '100.88.50.50', account: OWNER, online: true },
  { id: 'm-bob', name: 'bob-laptop', address: '100.88.40.40', account: 'bob@example.com', online: true },
  { id: 'm-carol', name: 'carol-server', address: '100.88.70.70', account: 'carol@example.com', online: true },
]
const nodeIdOf = (tail: string) => `srv_${(tail + 'Pn7Wq8Mv5Tn2Bc7Hy4Lp9Gs6Jd1Fa0XeKu').slice(0, 36)}`
const FOUND: FoundNode[] = [
  { nodeId: nodeIdOf('l1nuxB0xPriv'), name: 'linux-box', machineId: 'm-linux', kind: 'own', phase: 'idle' },
  { nodeId: nodeIdOf('b0bL4pt0pPriv'), name: 'bob-laptop', machineId: 'm-bob', kind: 'teammate', phase: 'idle' },
  { nodeId: nodeIdOf('r4spb3rryPriv'), name: 'raspberrypi', machineId: 'm-pi', kind: 'unknown', phase: 'idle' },
]
const REQUESTS: IncomingRequest[] = [
  { nodeId: nodeIdOf('c4r0lS3rvPriv'), name: 'carol-server', machineId: 'm-carol', account: 'carol@example.com', phase: 'idle' },
]
/** Restart and revocation took 11–13 s in the probe; pairing here takes a visible but shorter, scripted time. */
const PAIR_MS = 4500
const TEAMMATE_ALLOWS_MS = 7000
const CODE_LIFETIME_MS = 10 * 60_000

const later = (ms: number) => new Promise<void>((done) => setTimeout(done, ms))
const b64url = (text: string) => btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const randomText = (length: number) => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
  let out = ''
  for (let i = 0; i < length; i += 1) out += alphabet[Math.floor(Math.random() * alphabet.length)]
  return out
}
const startState = () => (typeof window === 'undefined' ? '' : String(localStorage.getItem('autobyteus.prototype.extensions') || ''))

export const usePrivateNetworkStore = defineStore('privateNetwork', () => {
  const seed = startState()
  const seededJoined = seed === 'network_joined' || seed === 'network_trust'

  const joined = ref(seededJoined)
  const network = ref<NetworkKind>('tailscale')
  const serverUrl = ref('')
  const signingIn = ref(false)
  const machines = ref<NetworkMachine[]>(structuredClone(MACHINES))
  const discoverable = ref(seededJoined)
  const trustOwnMachines = ref(seed === 'network_trust')
  const found = ref<FoundNode[]>(seededJoined ? structuredClone(FOUND) : [])
  const requests = ref<IncomingRequest[]>(seededJoined ? structuredClone(REQUESTS) : [])
  const paired = ref<PairedPeer[]>([])
  /** Set when this node has just joined: the card frame offers "Let my private network find this node" once. */
  const offerDiscovery = ref(false)
  const code = ref<ConnectionCode | null>(null)

  const thisMachine = computed(() => machines.value.find((m) => m.isThisMachine)!)
  const accountLabel = (account: string) => ACCOUNT_SHORT[account] ?? account
  const machineOf = (id: string) => machines.value.find((m) => m.id === id)
  const ownerAccount = OWNER

  function reset(): void {
    joined.value = false; signingIn.value = false; discoverable.value = false; trustOwnMachines.value = false
    found.value = []; requests.value = []; paired.value = []; offerDiscovery.value = false; code.value = null
  }

  function completeJoin(kind: NetworkKind): void {
    network.value = kind
    joined.value = true
    signingIn.value = false
    offerDiscovery.value = true
    // Discovery runs when the node joins; the others answer only while their owners let them be found.
    found.value = structuredClone(FOUND)
    requests.value = []
  }

  /** "Sign in with Tailscale": the login link opens in the browser; the sign-in finishes there (scripted). */
  async function signIn(): Promise<void> {
    signingIn.value = true
    await later(3200)
    if (signingIn.value) completeJoin('tailscale')
  }
  function cancelSignIn(): void { signingIn.value = false }
  async function joinWithKey(kind: NetworkKind, key: string, url = ''): Promise<{ ok: boolean; error?: string }> {
    await later(1600)
    if (!/^(tskey-auth-|hskey-auth-)?[A-Za-z0-9-]{12,}$/.test(key.trim())) return { ok: false, error: 'That join key was not accepted. Check that it was copied whole and has not expired.' }
    if (kind === 'headscale') serverUrl.value = url.trim()
    completeJoin(kind)
    return { ok: true }
  }
  async function useConnectionCode(text: string): Promise<{ ok: boolean; error?: string }> {
    await later(1800)
    if (!text.trim().startsWith('abpn_') || text.trim().length < 120) return { ok: false, error: 'This is not a connection code. Copy the whole code from “Add a machine” on the other node.' }
    if (text.includes('EXPIRED')) return { ok: false, error: 'This code expired. Make a new one on the other node.' }
    completeJoin('tailscale')
    return { ok: true }
  }

  async function makeConnectionCode(): Promise<ConnectionCode> {
    const expiresAt = Date.now() + CODE_LIFETIME_MS
    const payload = JSON.stringify({
      joinKey: `tskey-auth-${randomText(12)}-${randomText(30)}`,
      owner: `${thisMachine.value.address}:29695`,
      grant: randomText(43),
      expiresAt: new Date(expiresAt).toISOString(),
    })
    const text = `abpn_${b64url(payload)}`
    code.value = { text, qr: await toQrCodeDataUrl(text), expiresAt, machineCount: machines.value.length }
    return code.value
  }
  function closeConnectionCode(): void { code.value = null }

  function setDiscoverable(value: boolean): void { discoverable.value = value; offerDiscovery.value = false }
  function dismissDiscoveryOffer(): void { offerDiscovery.value = false }
  function setTrust(value: boolean): void { trustOwnMachines.value = value }

  /** A paired node joins the Nodes list: in the simulated network it answers at its private address, both sides hold the pairing. */
  async function landInNodes(node: { nodeId: string; name: string; machineId: string }, role: 'own' | 'teammate', account: string): Promise<void> {
    const address = `http://${machineOf(node.machineId)?.address ?? '100.88.99.99'}:29695`
    const world = (window as any).__designNetworkWorld?.()
    world?.addPrivateNode({ nodeId: node.nodeId, name: node.name, address })
    paired.value = [...paired.value, { nodeId: node.nodeId, name: node.name, account, role }]
    const nodeStore = useNodeStore()
    if (role === 'own') {
      // Your own node: this desktop keeps its owner access, so its window opens from the list.
      try {
        const entry = await nodeStore.addRemoteNode({ name: node.name, baseUrl: address, nodeId: node.nodeId })
        await useNodeAccessStore().connect(entry.id, 'private-network-grant')
      } catch { /* already listed */ }
    }
    const list = useNodeListStore()
    await list.open()
    list.flashKey = node.nodeId
    setTimeout(() => { if (list.flashKey === node.nodeId) list.flashKey = null }, 2400)
  }

  async function pair(nodeId: string): Promise<void> {
    const node = found.value.find((n) => n.nodeId === nodeId)
    if (!node || node.kind !== 'own') return
    node.phase = 'pairing'
    await later(PAIR_MS)
    found.value = found.value.filter((n) => n.nodeId !== nodeId)
    await landInNodes(node, 'own', OWNER)
  }
  async function connect(nodeId: string): Promise<void> {
    const node = found.value.find((n) => n.nodeId === nodeId)
    if (!node) return
    node.phase = 'waiting'
    if (node.kind !== 'teammate') return // an unknown machine's owner never answers in this script
    await later(TEAMMATE_ALLOWS_MS)
    const still = found.value.find((n) => n.nodeId === nodeId)
    if (!still || still.phase !== 'waiting') return
    found.value = found.value.filter((n) => n.nodeId !== nodeId)
    await landInNodes(still, 'teammate', machineOf(still.machineId)?.account ?? '')
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
    await landInNodes(request, 'teammate', request.account)
  }
  function reject(nodeId: string): void { requests.value = requests.value.filter((r) => r.nodeId !== nodeId) }

  const peerMark = (nodeId: string | null) => (nodeId ? paired.value.find((p) => p.nodeId === nodeId) ?? null : null)

  return {
    joined, network, serverUrl, signingIn, machines, discoverable, trustOwnMachines, found, requests, paired, offerDiscovery, code,
    thisMachine, ownerAccount, accountLabel, machineOf, peerMark,
    reset, signIn, cancelSignIn, joinWithKey, useConnectionCode, makeConnectionCode, closeConnectionCode,
    setDiscoverable, dismissDiscoveryOffer, setTrust, pair, connect, cancelConnect, allow, reject,
  }
})
