// The node's REST answers that the source screens read through its axios service (`/rest/...`): the Phone Setup tab (the source's
// Phones panel since extensions-nodes-baseline-refresh-516: phone access, the node's network report, the allowed local network, a
// pairing code, connected phones). One small in-memory state per caller (`state.restState`, reset with the scenario and the phone
// state), shared by the observation node (mock-node.mjs) and the baseline (plugins/00 axios adapter), so both show the same scripted
// outcome. The network facts come from the simulated network of nodes (prototype/nodes/network-world.mjs). Every value is invented;
// nothing is paired or stored.

const MINUTE = 60_000
const PHONE_NAMES = ['Pixel 6', 'Phone', 'Galaxy S21', 'Phone', 'Moto G', 'Phone', 'Pixel 7a', 'Phone']
const WAYS = ['tailscale', 'local_network', 'tailscale', 'vpn', 'tailscale', 'local_network']

const restStateOf = (state) => {
  if (state.restState) return state.restState
  const phone = state.phonePairing || 'tailscale'
  const now = Date.now()
  const iso = (offsetMs) => new Date(now + offsetMs).toISOString()
  const device = (id, name, extra = {}) => ({ deviceId: id, displayName: name, clientFacingBaseUrl: 'http://192.168.2.10:29695', connectionWay: null, createdAt: iso(-30 * 24 * 60 * MINUTE), lastSeenAt: null, revokedAt: null, ...extra })
  const none = phone === 'no_phones'
  state.restState = {
    phoneAccessEnabled: phone !== 'access_off',
    updatedAt: iso(-24 * 60 * MINUTE),
    sessions: 0,
    active: none ? [] : [
      device('device-pixel-8', 'Pixel 8', { connectionWay: 'tailscale', lastSeenAt: iso(-2 * MINUTE) }),
      device('device-galaxy-tab', 'Galaxy Tab', { connectionWay: 'local_network', lastSeenAt: iso(-26 * 60 * MINUTE) }),
      device('device-new-phone', 'Phone', { connectionWay: 'tailscale', lastSeenAt: null }),
    ],
    // a long history (the list scrolls inside its fold); some phones paired before the way was recorded
    revoked: none ? [] : Array.from({ length: 31 }, (_, index) => device(`device-revoked-${index}`, PHONE_NAMES[index % PHONE_NAMES.length], {
      connectionWay: index % 7 === 6 ? null : WAYS[index % WAYS.length],
      revokedAt: iso(-(index + 1) * 26 * 60 * MINUTE),
    })),
  }
  return state.restState
}

const base64Url = (text) => {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * `{ status, json }` for a REST request this file answers, or `null`. `pathname` has no `/rest` prefix. `world` is the caller's
 * simulated network of nodes; this node is its bound node.
 */
export const restFixture = (method, pathname, body, state, world) => {
  const rest = restStateOf(state)
  const settings = () => ({ settings: { phoneAccessEnabled: rest.phoneAccessEnabled, updatedAt: rest.updatedAt, updatedBy: 'loopback-desktop' } })
  if (pathname === '/remote-access/settings') {
    if (method === 'PUT') { rest.phoneAccessEnabled = Boolean(body?.phoneAccessEnabled); rest.updatedAt = new Date().toISOString() }
    return { status: 200, json: settings() }
  }
  if (pathname === '/remote-access/status' && world) {
    return { status: 200, json: { phoneAccessEnabled: rest.phoneAccessEnabled, pairingAvailable: rest.phoneAccessEnabled, nodeId: world.boundNodeId } }
  }
  if (pathname === '/remote-access/network' && world) return { status: 200, json: { network: world.networkOf(world.boundNodeId) } }
  const allow = pathname.match(/^\/remote-access\/network\/local-networks\/([^/]+)$/)
  if (allow && method === 'PUT' && world) {
    const networkId = decodeURIComponent(allow[1])
    world.setNetworkAllowed(world.boundNodeId, networkId, body?.allowed)
    return { status: 200, json: { networkId, allowed: Boolean(body?.allowed) } }
  }
  if (pathname === '/remote-access/devices' && method === 'DELETE') {
    const at = new Date().toISOString()
    rest.revoked = [...rest.active.map(item => ({ ...item, revokedAt: at })), ...rest.revoked]
    rest.active = []
    return { status: 200, json: { revoked: rest.revoked.length } }
  }
  if (pathname === '/remote-access/devices') return { status: 200, json: { devices: structuredClone(rest.active) } }
  if (pathname === '/remote-access/devices/revoked') return { status: 200, json: { devices: structuredClone(rest.revoked) } }
  const revoke = pathname.match(/^\/remote-access\/devices\/([^/]+)$/)
  if (revoke && method === 'DELETE') {
    const found = rest.active.find(item => item.deviceId === decodeURIComponent(revoke[1]))
    const at = new Date().toISOString()
    if (found) { rest.active = rest.active.filter(item => item !== found); rest.revoked = [{ ...found, revokedAt: at }, ...rest.revoked] }
    return { status: 200, json: { device: found ? { ...found, revokedAt: at } : null } }
  }
  if (pathname === '/remote-access/pairing-sessions' && method === 'POST') {
    // A code lives 5 minutes; in the `expired` phone state it runs out after 4 seconds (to show the expired code).
    const lifetimeMs = state.phonePairing === 'expired' ? 4000 : 5 * MINUTE
    rest.sessions += 1
    const serverBaseUrl = String(body?.serverBaseUrl || 'http://192.168.2.10:29695').replace(/\/+$/, '')
    const payload = { version: 1, serverBaseUrl, pairingCode: `SYNTH-${4820 + rest.sessions}`, expiresAt: new Date(Date.now() + lifetimeMs).toISOString(), serverName: String(body?.serverName || 'AutoByteus Desktop') }
    const mobileUrl = `${serverBaseUrl}/mobile?pairing=${base64Url(JSON.stringify(payload))}`
    return { status: 200, json: { sessionId: `pairing-session-${rest.sessions}`, payload, qrText: mobileUrl, mobileUrl } }
  }
  if (/^\/remote-access\/pairing-sessions\/[^/]+$/.test(pathname) && method === 'DELETE') return { status: 200, json: { discarded: true } }
  return null
}
