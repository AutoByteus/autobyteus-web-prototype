/**
 * The paired node's answers to the phone's own checks (the credential check and the public status), scripted by the
 * scenario. The UI reference has no node: this module answers those two requests so the phone's own check code runs and
 * shows the outcome the scenario names. Nothing is stored or contacted.
 *
 * Starting states (`autobyteus.prototype.scenario`, no visible control):
 * - `mobile_runs_node_offline`: the node does not answer ("Not reachable", the banner, "Retry");
 * - `mobile_phone_access_off`: the node answers that Phone Access is off ("Phone access off");
 * - `mobile_session_revoked`: the node no longer accepts the phone's credential (the pairing screen).
 */
const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

const scenario = (): string => { try { return localStorage.getItem('autobyteus.prototype.scenario') || '' } catch { return '' } }

/** A scripted answer for the request, or null when another layer answers it. A thrown TypeError is a node that does not answer. */
export const mobileNodeResponse = (url: URL, init?: RequestInit): Response | null => {
  // A media file the node serves (a conversation's image): the same invented picture the observation node serves.
  if (/^\/rest\/media\//.test(url.pathname) && (init?.method ?? 'GET').toUpperCase() === 'GET') {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640"><rect width="640" height="640" fill="#dbeafe"/><circle cx="320" cy="250" r="110" fill="#2563eb"/><text x="320" y="430" text-anchor="middle" font-family="system-ui" font-size="42" fill="#0f172a">Prototype media</text></svg>'
    return new Response(svg, { status: 200, headers: { 'content-type': 'image/svg+xml' } })
  }
  // The node's node desktop (the agent's virtual desktop of a Docker node): offered only by the scenarios that show it.
  if (url.pathname === '/rest/node-desktop') return json(200, { available: ['mobile_node_desktop', 'mobile_node_desktop_busy'].includes(scenario()) })
  const isStatus = url.pathname === '/rest/remote-access/status'
  const isCredentialCheck = url.pathname === '/graphql' && String(init?.body ?? '').includes('PhoneCredentialCheck')
  if (!isStatus && !isCredentialCheck) return null
  switch (scenario()) {
    case 'mobile_runs_node_offline': throw new TypeError('Failed to fetch')
    case 'mobile_phone_access_off':
      return json(403, { error: 'PHONE_ACCESS_DISABLED', code: 'PHONE_ACCESS_DISABLED', message: 'Phone Access is turned off.' })
    case 'mobile_session_revoked':
      return isCredentialCheck ? json(401, { error: 'REMOTE_ACCESS_DEVICE_REVOKED', code: 'REMOTE_ACCESS_DEVICE_REVOKED', message: 'This phone was revoked.' }) : null
    default:
      return isCredentialCheck ? json(200, { data: { __typename: 'Query' } }) : null
  }
}
