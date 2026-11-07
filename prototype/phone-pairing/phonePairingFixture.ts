// one-step-phone-pairing (autobyteus-395): design-only synthetic state for the phone pairing surfaces.
// Everything here is invented: node names, addresses (RFC 5737 / `.example` names), phones and the inert QR payload.
// Nothing is requested from a node and no code in this file pairs anything.

import { addCollection } from '@iconify/vue'
import phoneIcons from '~/prototype/phone-pairing/icons.json'

/** Starting state of the desktop panel and the Android app. Remove the key and reload to reset. */
export const PHONE_STATE_KEY = 'autobyteus.prototype.phonePairing'
export const ANDROID_NODES_KEY = 'autobyteus.prototype.androidNodes'
export const ANDROID_SEEDED_KEY = 'autobyteus.prototype.androidSeededFor'
export const ANDROID_ACTIVE_KEY = 'autobyteus.prototype.androidActiveNode'
export const IN_APP_KEY = 'autobyteus.prototype.inAndroidApp'
/** The name of the one local network that was allowed on this computer (the answer is remembered per network). */
export const WIFI_ALLOWED_KEY = 'autobyteus.prototype.phoneWifiAllowedNetwork'

let iconsRegistered = false
export function registerPhonePairingIcons(): void {
  if (iconsRegistered) return
  iconsRegistered = true
  addCollection(phoneIcons as never)
}

export type DesktopPhoneScenario =
  | 'tailscale' // default: Tailscale with its secure web address
  | 'tailscale_no_https' // Tailscale on, the secure web address is not set up yet
  | 'company_address' // an admin set a fixed address for the node (company VPN)
  | 'vpn' // a VPN tunnel is up on this computer (trusted like Tailscale)
  | 'wifi_ask' // nothing installed, this local network not asked about yet
  | 'wifi_allowed' // nothing installed, this local network allowed earlier
  | 'wifi_new_network' // allowed on another network before; this one is new, so it asks again
  | 'nothing' // no network the phone could use
  | 'docker_unpublished' // a Docker node whose port is not published on the network
  | 'expired' // a code was shown and its five minutes ran out
  | 'no_phones' // nothing paired yet

export type AndroidScenario =
  | 'android_several' // default: three nodes, all online
  | 'android_first_launch' // no nodes yet
  | 'android_unreachable' // one node is not reachable
  | 'android_scan_cant_reach' // the next scanned code points at a node the phone cannot reach

export function readPhoneState(): string {
  if (typeof localStorage === 'undefined') return ''
  return localStorage.getItem(PHONE_STATE_KEY) || ''
}

export interface PairedPhone {
  id: string
  name: string
  via: 'Tailscale' | 'Wi-Fi'
  lastSeen: string
  revokedOn?: string
}

const ACTIVE_PHONES: PairedPhone[] = [
  { id: 'p1', name: 'Pixel 8', via: 'Tailscale', lastSeen: '2 minutes ago' },
  { id: 'p2', name: 'Galaxy Tab', via: 'Wi-Fi', lastSeen: 'Yesterday' },
]

const REVOKED_NAMES = ['Pixel 6', 'Phone', 'Galaxy S21', 'Phone', 'Moto G', 'Phone', 'Pixel 7a', 'Phone']

export function seedActivePhones(scenario: string): PairedPhone[] {
  return scenario === 'no_phones' ? [] : ACTIVE_PHONES.map((phone) => ({ ...phone }))
}

export function seedRevokedPhones(scenario: string): PairedPhone[] {
  const count = scenario === 'no_phones' ? 0 : 31
  return Array.from({ length: count }, (_, index) => ({
    id: `r${index}`,
    name: REVOKED_NAMES[index % REVOKED_NAMES.length],
    via: index % 3 === 0 ? 'Wi-Fi' : 'Tailscale',
    lastSeen: '',
    revokedOn: `Oct ${28 - (index % 27)}`,
  }))
}

export interface WaysPicture {
  company: { ready: boolean; address?: string }
  tailscale: { ready: boolean; https: boolean }
  vpn: { ready: boolean }
  wifi: { ready: boolean; networkName: string }
  blocked?: 'no_network' | 'docker_unpublished'
}

/** What detection finds on this computer for each of the four ways (synthetic, per starting state). */
export function waysFor(scenario: string): WaysPicture {
  const none: WaysPicture = { company: { ready: false }, tailscale: { ready: false, https: false }, vpn: { ready: false }, wifi: { ready: false, networkName: '' } }
  switch (scenario) {
    case 'tailscale_no_https':
      return { ...none, tailscale: { ready: true, https: false }, wifi: { ready: true, networkName: 'Home-5G' } }
    case 'company_address':
      return { ...none, company: { ready: true, address: 'autobyteus.example.com' }, wifi: { ready: true, networkName: 'Home-5G' } }
    case 'vpn':
      return { ...none, vpn: { ready: true }, wifi: { ready: true, networkName: 'Office-Staff' } }
    case 'wifi_ask':
    case 'wifi_allowed':
      return { ...none, wifi: { ready: true, networkName: 'Home-5G' } }
    case 'wifi_new_network':
      return { ...none, wifi: { ready: true, networkName: 'Cafe-Guest' } }
    case 'nothing':
      return { ...none, blocked: 'no_network' }
    case 'docker_unpublished':
      return { ...none, blocked: 'docker_unpublished' }
    default:
      return { ...none, tailscale: { ready: true, https: true }, wifi: { ready: true, networkName: 'Home-5G' } }
  }
}

/** The plain-words picture of the network around this computer (what the node worked out by itself). */
export interface NetworkPicture {
  kind: 'tailscale' | 'company' | 'vpn' | 'wifi' | 'nothing' | 'docker_unpublished'
  /** The local network the computer is on (illustrative name). */
  networkName?: string
  /** The fixed address an admin set for the node (illustrative `.example` name). */
  companyAddress?: string
  tailscaleHttps: boolean
  /** Is Tailscale installed and running here? (decides the hint and the "secure web address" option) */
  tailscaleRunning: boolean
}

export function networkFor(scenario: string): NetworkPicture {
  switch (scenario) {
    case 'tailscale_no_https':
      return { kind: 'tailscale', tailscaleHttps: false, tailscaleRunning: true }
    case 'company_address':
      return { kind: 'company', tailscaleHttps: false, tailscaleRunning: false, companyAddress: 'autobyteus.example.com' }
    case 'vpn':
      return { kind: 'vpn', tailscaleHttps: false, tailscaleRunning: false }
    case 'wifi_new_network':
      return { kind: 'wifi', tailscaleHttps: false, tailscaleRunning: false, networkName: 'Cafe-Guest' }
    case 'wifi_ask':
    case 'wifi_allowed':
      return { kind: 'wifi', tailscaleHttps: false, tailscaleRunning: false, networkName: 'Home-5G' }
    case 'nothing':
      return { kind: 'nothing', tailscaleHttps: false, tailscaleRunning: false }
    case 'docker_unpublished':
      return { kind: 'docker_unpublished', tailscaleHttps: false, tailscaleRunning: false }
    default:
      return { kind: 'tailscale', tailscaleHttps: true, tailscaleRunning: true }
  }
}

/** The pairing link the QR holds: inert. It carries a sample code that no node knows. */
export function sampleQrPayload(nodeName: string): string {
  const json = JSON.stringify({
    version: 1,
    serverBaseUrl: 'https://node.tail-example.ts.net',
    pairingCode: 'SAMPLE-NOT-A-REAL-CODE',
    expiresAt: '2026-11-07T00:00:00.000Z',
    serverName: nodeName,
    addresses: ['https://node.tail-example.ts.net', 'http://192.0.2.20:29695'],
  })
  const encoded = btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const origin = typeof window === 'undefined' ? 'http://localhost:3395' : window.location.origin
  return `${origin}/mobile?pairing=${encoded}`
}

/** Reads the node's name out of a pairing link; falls back to a plain name. */
export function nodeNameFromPairing(text: string): string {
  try {
    const raw = text.includes('pairing=') ? new URL(text, 'http://x').searchParams.get('pairing') || '' : text
    const padded = raw.replace(/-/g, '+').replace(/_/g, '/')
    const parsed = JSON.parse(decodeURIComponent(escape(atob(padded)))) as { serverName?: string }
    return parsed.serverName?.trim() || 'Desktop'
  } catch {
    return 'Desktop'
  }
}

// ---- The Android app's saved nodes (synthetic) ----

export interface AndroidNode {
  id: string
  name: string
  reachable: boolean
  /** Why the phone cannot reach it (plain words), when it cannot. */
  reason?: 'no_network' | 'asleep'
}

export const SCAN_QUEUE = ['Desktop', 'Docker node 1', 'Docker node 2', 'Office Mac']

export const reasonText = (node: { name: string }, reason: 'no_network' | 'asleep' | 'expired' | 'used' | 'not_autobyteus'): string => {
  switch (reason) {
    case 'no_network':
      return 'Connect to the same Wi-Fi or VPN as the computer, or turn on Tailscale.'
    case 'asleep':
      return `${node.name} didn’t answer. Check that the computer is on and awake.`
    case 'expired':
      return 'This code has expired. Make a new one on your computer.'
    case 'used':
      return 'This code was already used. Make a new one on your computer.'
    default:
      return 'That isn’t an AutoByteus QR code.'
  }
}

export function androidSeed(scenario: string): AndroidNode[] {
  if (scenario === 'android_first_launch') return []
  const nodes: AndroidNode[] = [
    { id: 'n-desktop', name: 'Desktop', reachable: true },
    { id: 'n-docker-1', name: 'Docker node 1', reachable: true },
    { id: 'n-docker-2', name: 'Docker node 2', reachable: true },
  ]
  if (scenario === 'android_unreachable') nodes[2] = { ...nodes[2], reachable: false, reason: 'no_network' }
  return nodes
}

export function loadAndroidNodes(): AndroidNode[] {
  const scenario = (readPhoneState() || 'android_several') as string
  const seededFor = localStorage.getItem(ANDROID_SEEDED_KEY)
  const stored = localStorage.getItem(ANDROID_NODES_KEY)
  if (stored && seededFor === scenario) {
    try {
      return JSON.parse(stored) as AndroidNode[]
    } catch {
      /* fall through to the seed */
    }
  }
  const seeded = androidSeed(scenario)
  saveAndroidNodes(seeded)
  localStorage.setItem(ANDROID_SEEDED_KEY, scenario)
  return seeded
}

export function saveAndroidNodes(nodes: AndroidNode[]): void {
  localStorage.setItem(ANDROID_NODES_KEY, JSON.stringify(nodes))
}

export function activeAndroidNodeName(): string | null {
  if (typeof localStorage === 'undefined') return null
  if (sessionStorage.getItem(IN_APP_KEY) !== '1') return null
  const id = localStorage.getItem(ANDROID_ACTIVE_KEY)
  if (!id) return null
  try {
    const nodes = JSON.parse(localStorage.getItem(ANDROID_NODES_KEY) || '[]') as AndroidNode[]
    return nodes.find((node) => node.id === id)?.name ?? null
  } catch {
    return null
  }
}

export function isInAndroidApp(): boolean {
  return typeof sessionStorage !== 'undefined' && sessionStorage.getItem(IN_APP_KEY) === '1'
}
