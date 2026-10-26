// The node's REST answers that the retained source screens read through its axios service (`/rest/...`): today the Phone
// Setup tab (Phone Access settings, the addresses a phone can use, paired devices, a pairing QR). One small in-memory state
// per caller (`state.restState`, reset with the scenario), shared by the observation node (mock-node.mjs) and the baseline
// (plugins/00 axios adapter), so both show the same scripted outcome. Every value is invented; nothing is paired or stored.

const at = '2026-08-22T04:00:00.000Z'
const device = (id, name, extra = {}) => ({ deviceId: id, displayName: name, clientFacingBaseUrl: 'http://192.168.2.10:29695', createdAt: at, lastSeenAt: at, revokedAt: null, ...extra })

const restStateOf = (state) => (state.restState ??= {
  phoneAccessEnabled: false, updatedAt: at,
  active: [device('device-synthetic-phone', 'Synthetic phone')], revoked: [device('device-old-tablet', 'Old tablet', { revokedAt: '2026-08-21T10:00:00.000Z' })],
})
const candidates = [
  { id: 'lan-192-168-2-10', kind: 'lan', label: 'Wi-Fi (192.168.2.10)', serverBaseUrl: 'http://192.168.2.10:29695', source: 'en0' },
  { id: 'loopback', kind: 'loopback', label: 'This computer only', serverBaseUrl: 'http://127.0.0.1:29695', source: 'lo0' },
]

/** `{ status, json }` for a REST request this file answers, or `null`. `pathname` has no `/rest` prefix. */
export const restFixture = (method, pathname, body, state) => {
  const rest = restStateOf(state)
  const settings = () => ({ settings: { phoneAccessEnabled: rest.phoneAccessEnabled, updatedAt: rest.updatedAt, updatedBy: 'loopback-desktop' } })
  if (pathname === '/remote-access/settings') {
    if (method === 'PUT') { rest.phoneAccessEnabled = Boolean(body?.phoneAccessEnabled); rest.updatedAt = '2026-08-22T04:05:00.000Z' }
    return { status: 200, json: settings() }
  }
  if (pathname === '/remote-access/address-candidates') return { status: 200, json: { candidates: structuredClone(candidates) } }
  if (pathname === '/remote-access/devices') return { status: 200, json: { devices: structuredClone(rest.active) } }
  if (pathname === '/remote-access/devices/revoked') return { status: 200, json: { devices: structuredClone(rest.revoked) } }
  const revoke = pathname.match(/^\/remote-access\/devices\/([^/]+)$/)
  if (revoke && method === 'DELETE') {
    const found = rest.active.find(item => item.deviceId === revoke[1])
    if (found) { rest.active = rest.active.filter(item => item !== found); rest.revoked = [...rest.revoked, { ...found, revokedAt: '2026-08-22T04:10:00.000Z' }] }
    return { status: 200, json: { device: found ? { ...found, revokedAt: '2026-08-22T04:10:00.000Z' } : null } }
  }
  if (pathname === '/remote-access/pairing-sessions' && method === 'POST') {
    const serverBaseUrl = body?.serverBaseUrl || candidates[0].serverBaseUrl
    const payload = { version: 1, serverBaseUrl, pairingCode: 'SYNTH-4821', expiresAt: '2026-08-22T04:15:00.000Z', serverName: 'Embedded Node' }
    return { status: 200, json: { payload, qrText: `autobyteus://pair?code=${payload.pairingCode}`, mobileUrl: `${serverBaseUrl}/mobile` } }
  }
  return null
}
