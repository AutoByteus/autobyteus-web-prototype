import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { toQrCodeDataUrl } from '~/services/qr/qrCodeDataUrlService'
import { useNodeListStore } from '~/stores/nodeListStore'

/**
 * extensions-ui-516 (design only): the simulated private network and pairing over it (autobyteus-516, Part B), for every
 * network type in scope (private-network-types.md): a Tailscale account, your own Headscale server, a private network
 * hosted on this machine (designed now, built later), and your own VPN (an accepted address range only).
 *
 * In the product, the Private Network extension's server part runs the network program (joining, this machine, my
 * machines, join keys, hosting), and the node itself owns discovery and pairing (pairing-contract.md). Here one small
 * scripted world stands for both; every account, machine, address, domain, key and code below is invented.
 *
 * Starting state: `localStorage['autobyteus.prototype.extensions']` =
 *   `network_joined` / `network_trust` (Tailscale, joined; trust on) · `network_headscale` · `network_headscale_down`
 *   (server unreachable) · `network_host` (hosting on this machine) · `network_approval` (waiting for device approval in
 *   the Tailscale admin console; approved after about 10 s) · `network_signed_out` (Tailscale key expired) ·
 *   `network_vpn` (your own VPN only) · `network_restarting` (rejoining after a restart, 8 s). Any other value starts not joined.
 */

export type NetworkKind = 'tailscale' | 'headscale' | 'host'
export interface NetworkMachine {
  id: string
  name: string
  address: string
  account: string
  online: boolean
  isThisMachine?: boolean
  /** Tailscale: shared into this network from another tailnet. */
  shared?: boolean
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
export interface Hosting { domain: string; port: number; certificateUntil: string; reachable: boolean | null }

/** Accounts: Tailscale shows e-mail logins; a Headscale server (yours or hosted) shows its user names. */
const ACCOUNTS: Record<NetworkKind, { owner: string; bob: string; carol: string }> = {
  tailscale: { owner: 'alex@example.com', bob: 'bob@example.com', carol: 'carol@example.com' },
  headscale: { owner: 'alex', bob: 'bob', carol: 'carol' },
  host: { owner: 'alex', bob: 'bob', carol: 'carol' },
}
const machinesFor = (kind: NetworkKind): NetworkMachine[] => {
  const a = ACCOUNTS[kind]
  return [
    { id: 'm-home', name: 'home-mac', address: '100.88.10.10', account: a.owner, online: true, isThisMachine: true },
    { id: 'm-linux', name: 'linux-box', address: '100.88.30.30', account: a.owner, online: true },
    { id: 'm-office', name: 'office-mac', address: '100.88.20.20', account: a.owner, online: false },
    { id: 'm-pi', name: 'raspberrypi', address: '100.88.60.60', account: a.owner, online: true },
    { id: 'm-printer', name: 'hall-printer', address: '100.88.50.50', account: a.owner, online: true },
    { id: 'm-bob', name: 'bob-laptop', address: '100.88.40.40', account: a.bob, online: true },
    { id: 'm-carol', name: 'carol-server', address: '100.88.70.70', account: a.carol, online: true },
    // Tailscale only: a machine added with a tagged key belongs to the tag, never to a person; a machine shared from another tailnet.
    ...(kind === 'tailscale' ? [
      { id: 'm-ci', name: 'ci-runner', address: '100.88.80.80', account: 'tag:ci', online: true },
      { id: 'm-dana', name: 'dana-desktop', address: '100.88.90.90', account: 'dana@other.example', online: false, shared: true },
    ] : []),
  ]
}
const nodeIdOf = (tail: string) => `srv_${(tail + 'Pn7Wq8Mv5Tn2Bc7Hy4Lp9Gs6Jd1Fa0XeKu').slice(0, 36)}`
const FOUND: FoundNode[] = [
  // Owned by this desktop and already in its Nodes list (pairing-contract §7: Pair adds the peer relation, not a list entry).
  { nodeId: 'srv_l1nuxB0xPrivPn7Wq8Mv5Tn2Bc7Hy4Lp9Gs6', name: 'linux-box', machineId: 'm-linux', kind: 'own', phase: 'idle' },
  { nodeId: nodeIdOf('b0bL4pt0pPriv'), name: 'bob-laptop', machineId: 'm-bob', kind: 'teammate', phase: 'idle' },
  { nodeId: nodeIdOf('r4spb3rryPriv'), name: 'raspberrypi', machineId: 'm-pi', kind: 'unknown', phase: 'idle' },
]
const REQUESTS = (kind: NetworkKind): IncomingRequest[] => [
  { nodeId: nodeIdOf('c4r0lS3rvPriv'), name: 'carol-server', machineId: 'm-carol', account: ACCOUNTS[kind].carol, phase: 'idle' },
]
/** Pairing took well under a second on one Mac and join + pair 3.0 s (pairing-probe); a few scripted seconds here. */
const PAIR_MS = 2000
const TEAMMATE_ALLOWS_MS = 7000
const OWNER_DECLINES_MS = 6000
const APPROVAL_MS = 10_000

const later = (ms: number) => new Promise<void>((done) => setTimeout(done, ms))
const b64url = (text: string) => btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const randomText = (length: number) => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
  let out = ''
  for (let i = 0; i < length; i += 1) out += alphabet[Math.floor(Math.random() * alphabet.length)]
  return out
}
const startState = () => (typeof window === 'undefined' ? '' : String(localStorage.getItem('autobyteus.prototype.extensions') || ''))
const CIDR = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/
/** Private ranges only (Solution Designer, round 3): the public internet is never admitted; size alone decides nothing. */
const PRIVATE_V4: Array<[number, number]> = [[0x0a000000, 8], [0xac100000, 12], [0xc0a80000, 16], [0x64400000, 10]]
const ipv4 = (a: string[]) => a.reduce((n, x) => (n * 256) + Number(x), 0)
const inPrivateV4 = (base: number, prefix: number) => PRIVATE_V4.some(([net, bits]) => prefix >= bits && Math.floor(base / 2 ** (32 - bits)) === Math.floor(net / 2 ** (32 - bits)))
const HEADSCALE_USER = /^[a-z][a-z0-9-]{1,30}$/

export const usePrivateNetworkStore = defineStore('privateNetwork', () => {
  const seed = startState()
  const seededKind: NetworkKind = seed.startsWith('network_headscale') ? 'headscale' : seed === 'network_host' ? 'host' : 'tailscale'
  const seededJoined = ['network_joined', 'network_trust', 'network_headscale', 'network_headscale_down', 'network_host', 'network_signed_out', 'network_restarting'].includes(seed)

  const joined = ref(seededJoined)
  const network = ref<NetworkKind>(seededKind)
  const serverUrl = ref(seededKind === 'headscale' ? 'https://headscale.example.com' : '')
  const signingIn = ref(false)
  /** Tailscale device approval: the machine waits until an admin approves it in the admin console. */
  const awaitingApproval = ref(seed === 'network_approval')
  /** Tailscale node key expiry: the machine was signed out of the tailnet. */
  const signedOut = ref(seed === 'network_signed_out')
  /** Headscale: the coordination server cannot be reached. */
  const serverDown = ref(seed === 'network_headscale_down')
  /** T2: after the node restarts, the network program rejoins with its saved state (~12.6 s measured; 8 s here). */
  const rejoining = ref(seed === 'network_restarting')
  const hosting = ref<Hosting | null>(seed === 'network_host' ? { domain: 'net.example.com', port: 443, certificateUntil: '2027-02-20', reachable: true } : null)
  const vpnRanges = ref<string[]>(seed === 'network_vpn' ? ['10.8.0.0/24'] : [])
  const machines = ref<NetworkMachine[]>(machinesFor(seededKind))
  const discoverable = ref(seededJoined)
  const trustOwnMachines = ref(seed === 'network_trust')
  const found = ref<FoundNode[]>(seededJoined ? structuredClone(FOUND) : [])
  const requests = ref<IncomingRequest[]>(seededJoined ? REQUESTS(seededKind) : [])
  const paired = ref<PairedPeer[]>([])
  /** Set when this node has just joined: the card frame offers "Let my private network find this node" once. */
  const offerDiscovery = ref(false)
  let approvalStarted = false

  const thisMachine = computed(() => machines.value.find((m) => m.isThisMachine)!)
  const ownerAccount = computed(() => ACCOUNTS[network.value].owner)
  const accountLabel = (account: string) => {
    const a = ACCOUNTS[network.value]
    return account === a.owner ? 'you' : account === a.bob ? 'bob' : account === a.carol ? 'carol' : account
  }
  const machineOf = (id: string) => machines.value.find((m) => m.id === id)
  /** Where the network is, for the Nodes card's lead: "Tailscale · alex@example.com", "Headscale · headscale.example.com", … */
  const networkLabel = computed(() => network.value === 'tailscale' ? `Tailscale · ${ownerAccount.value}`
    : network.value === 'headscale' ? `Headscale · ${serverUrl.value.replace(/^https?:\/\//, '')}`
      : `hosted on this machine · ${hosting.value?.domain ?? ''}`)

  /** The extension's status() for this node: what its card says (extension-contract §4). */
  const status = computed<{ ready: boolean; message: string }>(() => {
    const vpn = vpnRanges.value.length ? ` Also accepting your own VPN: ${vpnRanges.value.join(', ')}.` : ''
    if (awaitingApproval.value) return { ready: false, message: 'Waiting for approval in your Tailscale admin console.' }
    if (signingIn.value) return { ready: false, message: 'Waiting for the sign-in to finish in your browser.' }
    if (!joined.value) {
      return vpnRanges.value.length
        ? { ready: true, message: `Accepting your own VPN: ${vpnRanges.value.join(', ')}. Not on a private network.` }
        : { ready: false, message: 'Not connected to a private network yet. Choose one below.' }
    }
    if (rejoining.value) return { ready: false, message: 'Rejoining your private network after a restart…' }
    if (signedOut.value) return { ready: false, message: 'Signed out of Tailscale: this machine’s key expired. Sign in again.' }
    if (serverDown.value) return { ready: false, message: 'Your Headscale server cannot be reached. Nobody can join or change anything; existing connections keep working for a while.' }
    if (network.value === 'host') {
      return hosting.value?.reachable === false
        ? { ready: true, message: `Hosting your private network at ${hosting.value.domain}, but it is not reachable from the internet yet.${vpn}` }
        : { ready: true, message: `Hosting your private network at ${hosting.value?.domain}; connected as ${thisMachine.value.name}.${vpn}` }
    }
    return { ready: true, message: `Connected to your private network as ${thisMachine.value.name}.${vpn}` }
  })

  function reset(): void {
    joined.value = false; signingIn.value = false; discoverable.value = false; trustOwnMachines.value = false
    awaitingApproval.value = false; signedOut.value = false; serverDown.value = false; hosting.value = null
    vpnRanges.value = []; found.value = []; requests.value = []; paired.value = []; offerDiscovery.value = false
  }

  function completeJoin(kind: NetworkKind): void {
    network.value = kind
    machines.value = machinesFor(kind)
    joined.value = true
    signingIn.value = false
    signedOut.value = false
    awaitingApproval.value = false
    offerDiscovery.value = true
    // Discovery runs when the node joins; the others answer only while their owners let them be found.
    found.value = structuredClone(FOUND)
    requests.value = []
  }

  /** The page asks for the state; a node waiting for device approval is approved after a while (scripted admin). */
  let rejoinStarted = false
  function touch(): void {
    if (rejoining.value && !rejoinStarted) { rejoinStarted = true; void later(8000).then(() => { rejoining.value = false }) }
    if (awaitingApproval.value && !approvalStarted) {
      approvalStarted = true
      void later(APPROVAL_MS).then(() => { if (awaitingApproval.value) completeJoin('tailscale') })
    }
  }

  /** "Sign in with Tailscale": the login link opens in the browser; the sign-in finishes there (scripted). Also "Sign in again". */
  async function signIn(): Promise<void> {
    signingIn.value = true
    await later(3200)
    if (!signingIn.value) return
    if (signedOut.value && joined.value) { signedOut.value = false; signingIn.value = false; return }
    completeJoin('tailscale')
  }
  function cancelSignIn(): void { signingIn.value = false }
  async function joinWithKey(kind: NetworkKind, key: string, url = ''): Promise<{ ok: boolean; error?: string }> {
    await later(1600)
    if (kind === 'headscale') {
      if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(:\d+)?\/?$/i.test(url.trim())) return { ok: false, error: 'Enter the server’s HTTPS address, for example https://headscale.example.com.' }
      if (/unreachable|offline/i.test(url)) return { ok: false, error: `${url.trim()} cannot be reached. Check the address, and that the server is running and reachable from this machine.` }
      if (!/^(hskey-auth-)?[A-Za-z0-9-]{12,}$/.test(key.trim())) return { ok: false, error: 'The server did not accept that join key: it may be mistyped, used or expired. Make a new one with headscale preauthkeys create.' }
      serverUrl.value = url.trim().replace(/\/$/, '')
    } else if (!/^tskey-auth-[A-Za-z0-9-]{12,}$/.test(key.trim())) {
      return { ok: false, error: 'Tailscale did not accept that auth key: it may be mistyped, used or expired. Make a new one in the admin console under Settings → Keys.' }
    }
    completeJoin(kind)
    return { ok: true }
  }
  /** An invite made on a host: `abhi_` + base64url of { server, key, for, expiresAt } (a code, not a link: the host serves no page). */
  async function joinWithInvite(text: string): Promise<{ ok: boolean; error?: string }> {
    let invite: { server?: string; key?: string; for?: string; expiresAt?: string } | null = null
    try {
      const body = String(text).trim().replace(/^abhi_/, '').replace(/-/g, '+').replace(/_/g, '/')
      if (String(text).trim().startsWith('abhi_')) invite = JSON.parse(atob(body + '==='.slice((body.length + 3) % 4)))
    } catch { invite = null }
    if (!invite?.server || !invite.key) { await later(500); return { ok: false, error: 'That is not an invite code. Ask the machine that hosts the network for a new invite and paste all of it.' } }
    if (invite.expiresAt && Date.parse(invite.expiresAt) < Date.now()) { await later(500); return { ok: false, error: 'This invite expired before it was used. Ask for a new one.' } }
    return joinWithKey('headscale', invite.key, invite.server)
  }

  /** Host a private network on this machine (designed now, built later): every step is provisional. */
  async function hostStep(step: 'server' | 'certificate' | 'reachable' | 'join', domain = '', port = 443): Promise<{ ok: boolean; error?: string }> {
    await later(step === 'certificate' ? 1500 : 1000)
    if (step === 'server') {
      if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(domain.trim())) return { ok: false, error: 'Enter a domain name that points to this machine, for example net.example.com.' }
      hosting.value = { domain: domain.trim().toLowerCase(), port, certificateUntil: '2027-02-20', reachable: null }
      return { ok: true }
    }
    if (step === 'certificate') return { ok: true }
    if (step === 'reachable') {
      // Scripted: a domain starting with "home." is not reachable the first time (the router's port forward is missing).
      const first = hosting.value && hosting.value.reachable === null && hosting.value.domain.startsWith('home.')
      if (hosting.value) hosting.value.reachable = !first
      return first ? { ok: false, error: `${hosting.value?.domain} is not reachable from the internet on port ${port}. At home, forward port ${port} on your router to this machine, then check again.` } : { ok: true }
    }
    completeJoin('host')
    return { ok: true }
  }
  async function checkReachable(): Promise<boolean> {
    await later(1200)
    if (hosting.value) hosting.value.reachable = true
    return true
  }

  /** Leave the network (switching type means leaving, joining the new one and pairing again). Hosting: the network ends for everyone. */
  async function leave(): Promise<void> {
    await later(1200)
    joined.value = false; hosting.value = null; signedOut.value = false; serverDown.value = false
    discoverable.value = false; trustOwnMachines.value = false; found.value = []; requests.value = []; offerDiscovery.value = false
  }

  function addRange(range: string): { ok: boolean; error?: string } {
    const text = range.trim().toLowerCase()
    const v6 = text.match(/^(fd[0-9a-f]{2}(?::[0-9a-f]{0,4}){0,7}(?:::)?)\/(\d{1,3})$/)
    const m = text.match(CIDR)
    const publicError = 'That range includes public internet addresses. AutoByteus is never opened to the internet: use your VPN’s private range (10.x, 172.16–31.x, 192.168.x, 100.64–127.x or fd00::/8).'
    if (v6) {
      if (Number(v6[2]) < 8 || Number(v6[2]) > 128) return { ok: false, error: publicError }
    } else {
      if (!m || m.slice(1, 5).some((n) => Number(n) > 255) || Number(m[5]) > 32) return { ok: false, error: 'Enter an address range like 10.8.0.0/24 or fd7a:115c::/48.' }
      if (!inPrivateV4(ipv4(m.slice(1, 5)), Number(m[5]))) return { ok: false, error: publicError }
    }
    if (!vpnRanges.value.includes(text)) vpnRanges.value = [...vpnRanges.value, text]
    return { ok: true }
  }
  /** Ranges larger than /16 (IPv4) or /48 (IPv6) are accepted with a warning. */
  const isLargeRange = (range: string) => { const bits = Number(range.split('/')[1]); return range.includes(':') ? bits < 48 : bits < 16 }
  function removeRange(range: string): void { vpnRanges.value = vpnRanges.value.filter((r) => r !== range) }

  /**
   * Hosting: an invite for a machine that already runs AutoByteus (the host's address and a one-time join key). A Headscale
   * join key belongs to one Headscale user, and that user is who "added by" shows: an invite for a teammate is made with the
   * teammate's own user (created on the host if new), never with yours, or their machine would count as yours.
   */
  async function makeInvite(forWhom: 'me' | 'teammate', teammate = ''): Promise<{ text: string; qr: string; expiresAt: number; user: string; teammate: boolean }> {
    const user = forWhom === 'teammate' ? teammate.trim().toLowerCase() : ownerAccount.value
    if (forWhom === 'teammate' && !HEADSCALE_USER.test(user)) throw new Error('Enter your teammate’s name in lowercase letters, numbers and dashes, for example bob. It becomes their own user on this network.')
    if (forWhom === 'teammate' && user === ownerAccount.value) throw new Error('That is your own user. Choose “For one of my machines” instead.')
    await later(600)
    const expiresAt = Date.now() + 24 * 60 * 60_000
    const text = `abhi_${b64url(JSON.stringify({ server: `https://${hosting.value?.domain ?? 'net.example.com'}`, key: `hskey-auth-${randomText(12)}-${randomText(24)}`, for: user, expiresAt: new Date(expiresAt).toISOString() }))}`
    return { text, qr: await toQrCodeDataUrl(text), expiresAt, user, teammate: forWhom === 'teammate' }
  }

  function setDiscoverable(value: boolean): void { discoverable.value = value; offerDiscovery.value = false }
  function dismissDiscoveryOffer(): void { offerDiscovery.value = false }
  function setTrust(value: boolean): void { trustOwnMachines.value = value }

  /** A paired node: in the simulated network it answers at its private address and both sides hold the pairing. */
  async function landInNodes(node: { nodeId: string; name: string; machineId: string }, role: 'own' | 'teammate', account: string): Promise<void> {
    const address = `http://${machineOf(node.machineId)?.address ?? '100.88.99.99'}:29695`
    const world = (window as any).__designNetworkWorld?.()
    world?.addPrivateNode({ nodeId: node.nodeId, name: node.name, address })
    paired.value = [...paired.value, { nodeId: node.nodeId, name: node.name, account, role }]
    // Your own node is already in the list (its owner credential lives there): pairing adds the peer relation only.
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
    await landInNodes(node, 'own', ownerAccount.value)
  }
  async function connect(nodeId: string): Promise<void> {
    const node = found.value.find((n) => n.nodeId === nodeId)
    if (!node) return
    node.phase = 'waiting'
    if (node.kind !== 'teammate') {
      // Scripted: the unknown machine's owner declines (pair-rejected, pairing-contract §4).
      await later(OWNER_DECLINES_MS)
      const waiting = found.value.find((n) => n.nodeId === nodeId)
      if (waiting && waiting.phase === 'waiting') waiting.phase = 'refused'
      return
    }
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
    joined, network, serverUrl, signingIn, awaitingApproval, signedOut, serverDown, rejoining, hosting, vpnRanges,
    machines, discoverable, trustOwnMachines, found, requests, paired, offerDiscovery,
    thisMachine, ownerAccount, accountLabel, machineOf, peerMark, networkLabel, status,
    reset, touch, signIn, cancelSignIn, joinWithKey, joinWithInvite, hostStep, checkReachable, leave, addRange, removeRange, isLargeRange,
    makeInvite,
    setDiscoverable, dismissDiscoveryOffer, setTrust, pair, connect, cancelConnect, allow, reject,
  }
})
