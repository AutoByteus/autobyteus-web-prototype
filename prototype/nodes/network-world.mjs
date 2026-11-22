// A small simulated network of AutoByteus nodes: what the Nodes page (Manage Nodes) and the node-to-node collaboration
// settings talk to. UI-reference simulation only: in the product, this node's server and the other nodes' servers answer
// these questions. Every node, name, address, node ID, delay and offer below is invented. Nothing is contacted.
//
// One world is the state of all nodes. It answers two kinds of requests:
//   - `graphql(nodeId, operationName, variables)`: the GraphQL operations a node's server answers for the settings of
//     remote collaboration (switch, peers, address candidates, offers, availability);
//   - `windowRequest(url, request)`: what this window gets when it asks an address directly (a node's identity at
//     `/rest/remote-access/status`, or a node's GraphQL as the other node's settings API), or how the request fails.
// The observation node (mock-node.mjs) and the baseline (utils/apolloClient.ts, plugins/00) both answer from here, so
// both sides show the same scripted outcome. Written as plain ECMAScript with no imports, so the browser harness can
// also run it.

const id = (tail) => `srv_${(tail + 'Zr3Wq8Mv5Tn2Bc7Hy4Lp9Gs6Jd1Fa0XeKu').slice(0, 36)}`
export const NODE_IDS = {
  E: id('k3mQ9VfEmbedLw2dNb4'), D1: id('ibJioK7nDockerP5Rt8'), D3: id('Q3xKa8ZtDocker3Hy6'), D4: id('d4Hh1WcPDocker4Ms2'), D5: id('x5Rn7BeYDocker5Tq9'),
  LAP: id('lapT0p4VuLaptopZc3'), STU: id('stUd10Ka9StudioJw5'), NAS: id('n4sBo7XeNasBoxFd8'), SPARE: id('sp4r3Km1SpareBxL2'),
  SPARE_OTHER: id('unRegd5JqOtherNdG7'), OLD: id('oldB0x2MzOldBoxVn4'), EDGE: id('edG3t7HsEdgeNodeP6'), OLD_EMBEDDED: id('oldEmb3ddOlderNodeK9'),
  // extensions-nodes-baseline-refresh-516: a node registered before nodes paired (autobyteus-437), and a node on another computer
  // that a desktop window can be opened on (Phone Setup's "remote" wording).
  LAB: id('l4bN0d3PreP4ir3dQ1'), OFFICE: id('0ff1c3MacRem0teW7'),
}
const N = NODE_IDS
const LAN_THIS = 'http://192.168.2.10:29695'

const agent = (name, description) => ({ name, kind: 'agent', ...(description ? { description } : {}) })
const team = (name, description) => ({ name, kind: 'agent_team', ...(description ? { description } : {}) })
const DOCKER_OFFER = [
  agent('Build Runner', 'Runs the project build and reports failing steps.'),
  agent('Code Reviewer', 'Reviews a change and lists risks before merge.'),
  agent('Data Cleaner', 'Normalizes CSV exports and flags odd rows.'),
  agent('Log Analyst'),
  agent('Release Notes Writer', 'Drafts release notes from merged changes.'),
  agent('Test Author', 'Writes unit tests for a given module.'),
  agent('Translator', 'Translates product copy between English and Chinese.'),
  team('Release Crew', 'Build Runner, Test Author and Release Notes Writer working through a release.'),
  team('Review Panel', 'Two reviewers and a moderator for a second opinion.'),
]
const STUDIO_NAMES = [
  'Brand Voice Editor', 'Caption Writer', 'Color Palette Picker', 'Copy Editor', 'Deck Outliner', 'Font Pairing Advisor',
  'Icon Curator', 'Image Describer', 'Layout Critic', 'Logo Brief Writer', 'Moodboard Builder', 'Motion Brief Writer',
  'Naming Brainstormer', 'Poster Designer', 'Proofreader', 'Social Post Planner', 'Storyboard Artist', 'Style Guide Keeper',
  'Tagline Tester', 'Thumbnail Ideator', 'Tone Checker', 'UX Copy Reviewer', 'Video Script Writer', 'Visual QA',
]
const STUDIO_OFFER = [
  ...STUDIO_NAMES.map((name, index) => index % 3 === 1 ? agent(name) : agent(name, `Studio agent for ${name.toLowerCase()} tasks.`)),
  team('Campaign Team', 'Plans and drafts a campaign from a brief.'),
  team('Launch Visuals Team', 'Moodboard, posters and thumbnails for a launch.'),
  team('Localization Team', 'Translates and proofreads in several languages.'),
  team('Pitch Deck Team', 'Outline, copy and visuals for a pitch deck.'),
  team('Rebrand Team'),
  team('Social Calendar Team', 'Plans a month of posts and drafts each one.'),
  team('Video Team', 'Script, storyboard and captions for a short video.'),
]
const EIGHT_THREE_OFFER = [
  agent('Code Reviewer', 'Reviews a change and lists risks before merge.'),
  agent('Researcher', 'Searches the web and summarizes what it finds.'),
  agent('Writer'),
  team('Software Team', 'Design, build and test a change.'),
]
const EMBEDDED_OFFER = [
  agent('Project Planner', 'Breaks a goal into tasks and tracks them.'),
  agent('Doc Writer', 'Drafts and edits documentation.'),
  team('Product Team', 'Plans, designs and reviews a product change.'),
]

const eight = (port) => [`http://localhost:${port}`, `http://host.docker.internal:${port}`, `http://172.17.0.4:${port}`]
const node = (n) => ({ docker: false, switchOn: false, peers: [], offers: [], delayMs: 900, candidates: [], ...n })

/** Where each address answers, as the window (this desktop) and every non-Docker node see it. */
const LISTENERS = {
  'localhost:29695': N.E, '127.0.0.1:29695': N.E, '192.168.2.10:29695': N.E,
  'localhost:8001': N.D1, 'localhost:8003': N.D3, 'localhost:8004': N.D4, 'localhost:8005': N.D5,
  '192.168.2.40:29695': N.LAP, '192.168.2.31:29695': N.STU, '192.168.2.55:29695': N.NAS, '192.168.2.45:29695': N.LAB,
  '192.168.2.77:29695': { cause: 'refused' }, '192.168.2.90:29695': { other: N.SPARE_OTHER }, '192.168.2.99:29695': { cause: 'timeout' },
}

const addedAt = '2026-10-20T09:00:00.000Z'
// `paired`: both nodes hold their shared peer secret (autobyteus-437); a registration made before nodes paired is not.
const peer = (nodeId, name, baseUrl, paired = true) => ({ nodeId, name, baseUrl, addedAt, paired })

// What each node's server says about its own version and in-place update (`GET /rest/node-update`), and what happens when this
// window asks it to update (`POST`). Every value is scripted and invented. `APP_VERSION` is the version of this app in the
// simulated desktop (installHostScenario); the node's `relation` is where that version stands: `newer` = this app is newer
// than the node (the node can be offered the update).
//   mode: 'available' | 'unavailable' | 'error' (the answer's `inPlaceUpdate`) | 'noEndpoint' (an older server that has no such endpoint)
//   run: how a requested update goes: 'success' | 'failed' | 'refused' | 'undelivered' | 'lost' (the node never comes back);
//   running: the update was already started by another window when the page opens.
export const APP_VERSION = '0.1.0-prototype'
const SAME = { version: APP_VERSION, relation: 'same', mode: 'available' }
const OLDER = { version: '0.0.9-prototype', relation: 'newer', mode: 'available', run: 'success' }
const UPDATE_SCENARIOS = {
  nodes_update_refused: { run: 'refused' },
  nodes_update_failed: { run: 'failed' },
  nodes_update_lost: { run: 'lost' },
  nodes_update_undelivered: { run: 'undelivered' },
  nodes_update_running: { running: true },
  nodes_update_error: { mode: 'error', message: 'The update service of this node did not answer.' },
  nodes_update_unknown: { version: null, relation: 'same', mode: 'unavailable' },
  // autobyteus-356: the desktop already updated Docker 8001 automatically (it now runs this app's version)
  nodes_auto_updated: { version: APP_VERSION, relation: 'same' },
}
const serverOf = (scenario, nodeId) => {
  const states = scenario === 'nodes_states'
  if (nodeId === N.D1) return { ...OLDER, ...(UPDATE_SCENARIOS[scenario] ?? {}) }
  if (states && nodeId === N.LAP) return { version: '0.2.0-prototype', relation: 'older', mode: 'available' }
  if (states && nodeId === N.NAS) return { version: null, relation: 'same', mode: 'noEndpoint' }
  if (states && nodeId === N.D3) {
    return { ...OLDER, run: undefined, blocker: { code: 'AGENTS_RUNNING', message: 'Agents are running on this node. Update it when they have finished.' } }
  }
  return { ...SAME }
}

/** The nodes of a scenario. `nodes_states` adds a row in every state; every other scenario is the small network. */
export const buildNodes = (scenario) => {
  const states = scenario === 'nodes_states'
  const nodes = buildNodeList(scenario, states)
  for (const [nodeId, entry] of Object.entries(nodes)) entry.server = serverOf(scenario, nodeId)
  // nodes_empty_offer: the docker node shares no Agents or Agent Teams (the empty offer).
  if (scenario === 'nodes_empty_offer') nodes[N.D1].offers = []
  return nodes
}
const buildNodeList = (scenario, states) => {
  return {
    [N.E]: node({
      id: N.E, selfName: 'Embedded Node', switchOn: true, switchSet: true, delayMs: 300, offers: EMBEDDED_OFFER,
      candidates: ['http://127.0.0.1:29695', 'http://host.docker.internal:29695', LAN_THIS],
      peers: [
        peer(N.D1, 'docker', 'http://localhost:8001'),
        ...(states ? [
          peer(N.STU, 'studio', 'http://192.168.2.31:29695'), peer(N.LAP, 'laptop', 'http://192.168.2.40:29695'),
          peer(N.SPARE, 'spare', 'http://192.168.2.90:29695'), peer(N.OLD, 'old-box', 'http://192.168.2.77:29695'),
          peer(N.EDGE, 'edge', 'http://192.168.2.99:29695'),
          // registered before nodes paired: "Not paired yet" with Pair again (autobyteus-437)
          peer(N.LAB, 'lab', 'http://192.168.2.45:29695', false),
        ] : []),
      ],
    }),
    [N.D1]: node({
      id: N.D1, selfName: 'docker', docker: true, switchOn: true, delayMs: 900, candidates: eight(8001), offers: DOCKER_OFFER,
      peers: [peer(N.E, 'Embedded Node', 'http://host.docker.internal:29695')],
    }),
    [N.D3]: node({ id: N.D3, selfName: '8003', docker: true, switchOn: false, delayMs: 700, candidates: eight(8003), offers: EIGHT_THREE_OFFER }),
    [N.D4]: node({ id: N.D4, selfName: '8004', docker: true, switchOn: false, delayMs: 700, candidates: eight(8004), offers: EIGHT_THREE_OFFER.slice(0, 2), noAddressForOthers: true }),
    [N.D5]: node({ id: N.D5, selfName: '8005', docker: true, switchOn: false, delayMs: 700, candidates: eight(8005), offers: EIGHT_THREE_OFFER.slice(0, 1), failOnce: true }),
    [N.STU]: node({ id: N.STU, selfName: 'studio', lan: true, switchOn: false, delayMs: 1400, candidates: ['http://192.168.2.31:29695'], offers: STUDIO_OFFER }),
    [N.LAP]: node({
      id: N.LAP, selfName: 'laptop', lan: true, switchOn: true, delayMs: 1100, candidates: ['http://192.168.2.40:29695'], offers: EIGHT_THREE_OFFER.slice(0, 3),
      // laptop already has a node named "Embedded Node" (an older one), so this node is registered there as "Embedded Node 2".
      peers: [peer(N.OLD_EMBEDDED, 'Embedded Node', 'http://192.168.2.20:29695')],
    }),
    [N.LAB]: node({
      id: N.LAB, selfName: 'lab', lan: true, switchOn: true, delayMs: 800, candidates: ['http://192.168.2.45:29695'], offers: EIGHT_THREE_OFFER.slice(0, 2),
      peers: [peer(N.E, 'Embedded Node', LAN_THIS, false)],
    }),
    // Phone Setup on a node on another computer (the `remote_*` phone states): "Office Mac".
    [N.OFFICE]: node({ id: N.OFFICE, selfName: 'Office Mac', lan: true, switchOn: false, delayMs: 500, candidates: [] }),
    [N.NAS]: node({
      id: N.NAS, selfName: 'nas', lan: true, switchOn: true, delayMs: 800, candidates: ['http://192.168.2.55:29695'],
      peers: [peer(N.E, 'Embedded Node', LAN_THIS)],
    }),
  }
}

const hostPortOf = (url) => {
  const https = /^https:\/\//i.test(String(url).trim())
  const text = String(url).trim().replace(/^[a-z]+:\/\//i, '').replace(/\/.*$/, '')
  const [host, port = https ? '443' : '80'] = text.split(':')
  return { host: host.toLowerCase(), port }
}
const isLoopback = (host) => host === 'localhost' || host === '127.0.0.1' || host === '::1'
const failDelay = (cause) => cause === 'timeout' ? 20000 : cause === 'refused' ? 500 : 700

/** Who answers at `url`, asked by `from`: this window (`null`) or a node (whose own view of the address applies). */
const reach = (nodes, url, from, extraListeners = {}) => {
  const { host, port } = hostPortOf(url)
  const caller = from ? nodes[from] : null
  const fromDocker = Boolean(caller?.docker)
  const fail = (cause, extra = {}) => ({ ok: false, cause, host, delayMs: failDelay(cause), ...extra })
  let key = `${host}:${port}`
  if (host === 'host.docker.internal') {
    if (!fromDocker) return fail('dns')
    key = `localhost:${port}`
  } else if (fromDocker && isLoopback(host)) {
    return fail('refused', { loopbackInContainer: true })
  } else if (caller?.lan && isLoopback(host)) {
    return fail('refused')
  }
  const hit = LISTENERS[key] ?? extraListeners[key]
  if (hit === undefined) {
    if (host.includes('slow')) return fail('timeout')
    if (host.includes('nohost')) return fail('dns')
    if (host.includes('notab') || port === '80' || port === '443') return fail('notAutobyteus')
    return fail('refused')
  }
  if (typeof hit === 'string') {
    const target = nodes[hit]
    if (target?.downUntil && Date.now() < target.downUntil) return fail('refused')
    return { ok: true, nodeId: hit, delayMs: target?.delayMs ?? 700 }
  }
  if ('cause' in hit) return fail(hit.cause)
  return { ok: true, nodeId: hit.other, delayMs: 900 }
}

// the server's words for what one address answered
const RESULT_OF_CAUSE = { refused: 'refused', timeout: 'timeout', dns: 'not_found', notAutobyteus: 'not_autobyteus' }
const REASON_OF_CAUSE = { refused: 'refused', timeout: 'timeout', dns: 'not_found', notAutobyteus: 'unreachable' }

const NAME_RULE = /^[A-Za-z0-9][A-Za-z0-9 _.-]{0,63}$/
const fail = (message, code, extensions = {}) => ({ errors: [{ message, extensions: { code, ...extensions } }] })
const isHttpUrl = (value) => /^https?:\/\/[^\s/?#]+$/i.test(String(value).trim().replace(/\/+$/, ''))

// ---- Phone Setup (extensions-nodes-baseline-refresh-516, the source's Phones panel of autobyteus-395/426): what each node reports about
// the network of the computer it runs on (`GET /rest/remote-access/network`), and which of those addresses answer this window. The
// phone state is the design's existing starting-state key (`autobyteus.prototype.phonePairing`); every name and address is invented
// (RFC 1918 / CGNAT ranges, `.example` and `.ts.net` names). This computer is "Home Mac"; Docker 8001 runs on it; "Office Mac" is a
// node on another computer.
export const PHONE_STATES = ['tailscale', 'tailscale_no_https', 'company_address', 'vpn', 'wifi_ask', 'wifi_allowed', 'wifi_new_network', 'nothing',
  'docker_unpublished', 'remote_unreachable', 'remote_lan', 'remote_tailscale', 'remote_vpn', 'remote_nothing', 'expired', 'no_phones', 'access_off']
const HOME_TS = { address: '100.88.10.10', dnsName: 'home-mac.tail0c0ffee.ts.net' }
/** The address the desktop uses for "Office Mac" in each remote state (an SSH tunnel on this computer where the node has no usable way). */
export const OFFICE_ADDRESS = {
  remote_lan: 'http://192.168.2.60:29695', remote_tailscale: 'http://100.88.20.20:29695', remote_vpn: 'http://10.8.0.20:29695',
  remote_unreachable: 'http://localhost:29700', remote_nothing: 'http://localhost:29700',
}
export const phoneStateOf = (value) => (PHONE_STATES.includes(value) ? value : 'tailscale')
const phoneFacts = (phone, nodeId) => {
  const facts = { computerName: '', runsInContainer: false, configuredBaseUrl: null, tailscale: null, vpnAddresses: [], localNetwork: null }
  const lan = (networkId, address, allowed = false) => ({ networkId, addresses: [address], allowed })
  if (nodeId === N.OFFICE) {
    facts.computerName = 'Office Mac'
    if (phone === 'remote_lan') facts.localNetwork = lan('net-office-lan', '192.168.2.60')
    if (phone === 'remote_tailscale') { facts.tailscale = { address: '100.88.20.20', dnsName: null }; facts.localNetwork = lan('net-office-lan', '192.168.7.20') }
    if (phone === 'remote_vpn') facts.vpnAddresses = ['10.8.0.20']
    if (phone === 'remote_unreachable') { facts.tailscale = { address: '100.88.20.30', dnsName: null }; facts.localNetwork = lan('net-office-lan', '192.168.7.20') }
    return facts
  }
  if (nodes_in_container.has(nodeId)) return { ...facts, computerName: 'c0ntainer8001', runsInContainer: true }
  if (nodeId !== N.E) return { ...facts, computerName: 'node' }
  facts.computerName = 'Home Mac'
  if (phone === 'nothing') return facts
  const home = phone === 'wifi_new_network' ? 'net-cafe-guest' : 'net-home-5g'
  facts.localNetwork = lan(home, '192.168.2.10', phone === 'wifi_allowed')
  if (['tailscale', 'tailscale_no_https', 'expired', 'no_phones', 'access_off', 'docker_unpublished'].includes(phone) || phone.startsWith('remote_')) facts.tailscale = { ...HOME_TS }
  if (phone === 'company_address') facts.configuredBaseUrl = 'https://autobyteus.example.com'
  if (phone === 'vpn') facts.vpnAddresses = ['10.8.0.6']
  return facts
}
const nodes_in_container = new Set([N.D1, N.D3, N.D4, N.D5])
/** The addresses of the phone state that answer this window (and the node that answers there). */
const phoneListeners = (phone) => {
  const facts = phoneFacts(phone, N.E)
  const listeners = {}
  if (facts.tailscale) {
    listeners['100.88.10.10:29695'] = N.E
    // the secure web address answers once `tailscale serve` was run on this computer
    if (phone !== 'tailscale_no_https' && phone !== 'docker_unpublished') listeners['home-mac.tail0c0ffee.ts.net:443'] = N.E
  }
  if (facts.configuredBaseUrl) listeners['autobyteus.example.com:443'] = N.E
  for (const address of facts.vpnAddresses) listeners[`${address}:29695`] = N.E
  // Docker 8001's port is published on this computer's network, except in `docker_unpublished`.
  if (phone !== 'docker_unpublished') { listeners['192.168.2.10:8001'] = N.D1; listeners['100.88.10.10:8001'] = N.D1 }
  const office = OFFICE_ADDRESS[phone]
  if (office) listeners[office.replace(/^https?:\/\//, '')] = N.OFFICE
  if (phone === 'remote_lan') listeners['192.168.2.60:29695'] = N.OFFICE
  if (phone === 'remote_tailscale') listeners['100.88.20.20:29695'] = N.OFFICE
  if (phone === 'remote_vpn') listeners['10.8.0.20:29695'] = N.OFFICE
  return listeners
}

/**
 * @param scenario the scenario name
 * @param options `boundNodeId`: the node this window is bound to; `extraListeners`: more addresses that answer as a node
 *   (for example the observation node's own address, as the bound node).
 */
export const createNetworkWorld = (scenario, options = {}) => {
  const nodes = buildNodes(scenario)
  const boundNodeId = options.boundNodeId || N.E
  const phone = phoneStateOf(options.phone)
  const extraListeners = { ...phoneListeners(phone), ...(options.extraListeners || {}) }
  // The local networks a node keeps an answer for ("allow phones on this network"), by node and network.
  const allowedNetworks = new Map()
  const networkOf = (nodeId) => {
    const facts = phoneFacts(phone, nodeId)
    const answer = facts.localNetwork && allowedNetworks.get(`${nodeId}|${facts.localNetwork.networkId}`)
    if (answer !== undefined && facts.localNetwork) facts.localNetwork.allowed = answer
    return facts
  }
  const setNetworkAllowed = (nodeId, networkId, allowed) => { allowedNetworks.set(`${nodeId}|${networkId}`, Boolean(allowed)) }
  const invites = new Map()
  const reachFrom = (url, from) => reach(nodes, url, from, extraListeners)
  const cleanUrl = (url) => String(url).trim().replace(/\/+$/, '')
  const sameHostPort = (a, b) => { const x = hostPortOf(a), y = hostPortOf(b); return x.host === y.host && x.port === y.port }

  /** The failure of reaching `url` from `from` as the server's `PEER_UNREACHABLE` error carries it. */
  const unreachableError = (r, address) => fail(`${address} could not be reached.`, 'PEER_UNREACHABLE', {
    reason: REASON_OF_CAUSE[r.cause], address,
    attempts: [{ address, result: RESULT_OF_CAUSE[r.cause] }],
    ...(r.loopbackInContainer ? { loopbackInContainer: true } : {}),
  })

  /** One node's server answers a GraphQL operation (the settings of remote collaboration). Returns `{ answer, delayMs }`. */
  const graphql = (nodeId, operationName, variables = {}) => {
    const self = nodes[nodeId]
    if (!self) return { answer: fail(`Unknown node ${nodeId}.`, 'REMOTE_COLLABORATION_SETTINGS_FAILED'), delayMs: 100 }
    const capability = () => ({ __typename: 'RemoteCollaborationCapabilityGql', enabled: self.switchOn, settingKey: 'ENABLE_REMOTE_COLLABORATION', source: self.switchSet ? 'SERVER_SETTING' : 'DEFAULT_DISABLED' })
    const peerView = (p) => ({ __typename: 'PeerNodeGql', nodeId: p.nodeId, name: p.name, baseUrl: p.baseUrl, addedAt: p.addedAt, paired: p.paired !== false })
    const needSwitch = () => self.switchOn ? null : fail('Remote collaboration is off on this node.', 'REMOTE_COLLABORATION_OFF')
    const done = (answer, delayMs = 150) => ({ answer, delayMs })
    switch (operationName) {
      case 'GetRemoteCollaborationCapability': return done({ data: { remoteCollaborationCapability: capability() } })
      case 'SetRemoteCollaborationEnabled': {
        self.switchOn = Boolean(variables.enabled)
        self.switchSet = true
        return done({ data: { setRemoteCollaborationEnabled: capability() } })
      }
      case 'GetRemoteCollaborationSettings': return done({ data: { peerNodes: self.peers.map(peerView) } })
      case 'GetPeerAddressCandidates': return done({ data: { peerAddressCandidates: [...self.candidates] } })
      case 'ResolvePeerAddress': {
        const off = needSwitch(); if (off) return done(off)
        const wanted = variables.nodeId
        const baseUrls = variables.baseUrls || []
        const attempts = []
        let delay = 0
        for (const url of baseUrls) {
          const r = reachFrom(url, nodeId)
          delay += Math.min(r.delayMs, 700)
          if (r.ok && r.nodeId === wanted) return done({ data: { resolvePeerAddress: url } }, delay)
          attempts.push({ address: url, result: r.ok ? 'different_node' : RESULT_OF_CAUSE[r.cause] })
        }
        const first = reachFrom(baseUrls[0] ?? '', nodeId)
        return done(fail(`No address of the node answered.`, 'PEER_UNREACHABLE', {
          reason: first.ok ? 'unreachable' : REASON_OF_CAUSE[first.cause], address: baseUrls[0], attempts,
          ...(self.noAddressForOthers || first.loopbackInContainer ? { loopbackInContainer: true } : {}),
        }), delay)
      }
      case 'AddPeerNode': {
        const input = variables.input || {}
        const off = needSwitch(); if (off) return done(off)
        if (!NAME_RULE.test(String(input.name || '').trim())) return done(fail('The name is not valid.', 'PEER_NAME_INVALID'))
        if (!isHttpUrl(input.baseUrl)) return done(fail('The address is not valid.', 'PEER_URL_INVALID'))
        if (input.nodeId === nodeId) return done(fail('That is this node.', 'PEER_IS_THIS_NODE'))
        if (self.peers.some((p) => p.name.toLowerCase() === String(input.name).trim().toLowerCase() && p.nodeId !== input.nodeId)) return done(fail(`This node already has a node named ${input.name}.`, 'PEER_NAME_TAKEN'))
        const address = cleanUrl(input.baseUrl)
        const r = reachFrom(address, nodeId)
        if (!r.ok) return done(r.cause === 'notAutobyteus' ? fail('Not an AutoByteus node.', 'PEER_NOT_AUTOBYTEUS') : unreachableError(r, address), r.delayMs)
        if (r.nodeId !== input.nodeId) return done(fail('A different node answers at that address.', 'PEER_IDENTITY_MISMATCH'), r.delayMs)
        const added = peer(input.nodeId, String(input.name).trim(), address)
        self.peers = [...self.peers.filter((p) => p.nodeId !== added.nodeId), { ...added, addedAt: new Date().toISOString() }]
        return done({ data: { addPeerNode: peerView(self.peers.find((p) => p.nodeId === added.nodeId)) } }, r.delayMs)
      }
      // autobyteus-437: pairing. This node makes an invite for one other node (10 minutes, single use); the other node accepts it,
      // finds this node's address itself, and both register each other with their shared secret (here: `paired: true`).
      case 'CreatePeerInvite': {
        const off = needSwitch(); if (off) return done(off)
        self.inviteSeq = (self.inviteSeq ?? 0) + 1
        const inviteText = `abinv1.${nodeId}.${self.inviteSeq}`
        invites.set(inviteText, { inviter: nodeId, used: false })
        return done({ data: { createPeerInvite: { __typename: 'PeerInviteGql', inviteText, expiresAt: new Date(Date.now() + 10 * 60_000).toISOString() } } })
      }
      case 'AcceptPeerInvite': {
        const off = needSwitch(); if (off) return done(off)
        const invite = invites.get(String(variables.inviteText || ''))
        if (!invite || invite.used) return done(fail('The invite was used or expired.', 'PEER_INVITE_INVALID'))
        const inviter = nodes[invite.inviter]
        const name = String(variables.name || '').trim()
        const nameThere = String(variables.nameOnInviter || self.selfName).trim()
        if (!NAME_RULE.test(name) || !NAME_RULE.test(nameThere)) return done(fail('The name is not valid.', 'PEER_NAME_INVALID'))
        if (invite.inviter === nodeId) return done(fail('That is this node.', 'PEER_IS_THIS_NODE'))
        if (self.peers.some((p) => p.name.toLowerCase() === name.toLowerCase() && p.nodeId !== invite.inviter)) return done(fail(`This node already has a node named ${name}.`, 'PEER_NAME_TAKEN'))
        if (inviter.peers.some((p) => p.nodeId === nodeId && p.paired !== false)) return done(fail('Already paired.', 'PEER_ALREADY_REGISTERED'))
        // each node finds the other's address itself: the first of the other's own addresses (or the window's) that answers
        const findAddress = (from, target) => {
          let delay = 0
          for (const url of target.candidates) {
            const r = reachFrom(url, from)
            delay += Math.min(r.delayMs, 700)
            if (r.ok && r.nodeId === target.id) return { address: url, delay }
          }
          return { address: null, delay, first: reachFrom(target.candidates[0] ?? '', from) }
        }
        const there = findAddress(nodeId, inviter)
        const back = there.address ? findAddress(invite.inviter, self) : null
        const delay = there.delay + (back?.delay ?? 0)
        if (!there.address || !back?.address || inviter.noAddressForOthers || self.noAddressForOthers) {
          const missing = !there.address ? there : back
          const first = missing?.first ?? { ok: true }
          return done(fail('No address of the node answered.', 'PEER_UNREACHABLE', {
            reason: first.ok ? 'unreachable' : REASON_OF_CAUSE[first.cause], address: (missing === there ? inviter : self).candidates[0],
            attempts: [], ...(inviter.noAddressForOthers || self.noAddressForOthers || first.loopbackInContainer ? { loopbackInContainer: true } : {}),
          }), delay)
        }
        invite.used = true
        const now = new Date().toISOString()
        self.peers = [...self.peers.filter((p) => p.nodeId !== invite.inviter), { ...peer(invite.inviter, name, there.address), addedAt: now }]
        inviter.peers = [...inviter.peers.filter((p) => p.nodeId !== nodeId), { ...peer(nodeId, nameThere, back.address), addedAt: now }]
        return done({ data: { acceptPeerInvite: peerView(self.peers.find((p) => p.nodeId === invite.inviter)) } }, delay)
      }
      case 'RenamePeerNode': {
        const found = self.peers.find((p) => p.nodeId === variables.nodeId)
        if (!found) return done(fail('That node is not registered here.', 'PEER_NOT_REGISTERED'))
        if (!NAME_RULE.test(String(variables.name || '').trim())) return done(fail('The name is not valid.', 'PEER_NAME_INVALID'))
        if (self.peers.some((p) => p.nodeId !== found.nodeId && p.name.toLowerCase() === String(variables.name).trim().toLowerCase())) return done(fail(`This node already has a node named ${variables.name}.`, 'PEER_NAME_TAKEN'))
        found.name = String(variables.name).trim()
        return done({ data: { renamePeerNode: peerView(found) } })
      }
      case 'RemovePeerNode': {
        self.peers = self.peers.filter((p) => p.nodeId !== variables.nodeId)
        return done({ data: { removePeerNode: true } })
      }
      case 'ChangePeerAddress': {
        const found = self.peers.find((p) => p.nodeId === variables.nodeId)
        if (!found) return done(fail('That node is not registered here.', 'PEER_NOT_REGISTERED'))
        if (!isHttpUrl(variables.baseUrl)) return done(fail('The address is not valid.', 'PEER_URL_INVALID'))
        const address = cleanUrl(variables.baseUrl)
        const r = reachFrom(address, nodeId)
        if (!r.ok) return done(r.cause === 'notAutobyteus' ? fail('Not an AutoByteus node.', 'PEER_NOT_AUTOBYTEUS') : unreachableError(r, address), r.delayMs)
        if (r.nodeId !== found.nodeId) return done(fail('A different node answers at that address.', 'PEER_IDENTITY_MISMATCH'), r.delayMs)
        found.baseUrl = address
        return done({ data: { changePeerAddress: peerView(found) } }, r.delayMs)
      }
      case 'GetPeerNodeAvailability': {
        // Asked on node B about the node `nodeId` (here: the one that asks): does that node admit B now?
        const target = nodes[variables.nodeId]
        const registered = self.peers.find((p) => p.nodeId === variables.nodeId)
        const answer = (a, delayMs) => done({ data: { peerNodeAvailability: { __typename: 'PeerNodeAvailabilityGql', available: false, refusalCode: null, unreachableReason: null, ...a } } }, delayMs)
        if (!self.switchOn) return answer({ refusalCode: 'REMOTE_COLLABORATION_OFF' })
        if (!registered) return answer({ refusalCode: 'PEER_NOT_REGISTERED' })
        const r = reachFrom(registered.baseUrl, nodeId)
        if (!r.ok) return answer({ refusalCode: 'PEER_UNREACHABLE', unreachableReason: REASON_OF_CAUSE[r.cause] }, r.delayMs)
        if (r.nodeId !== variables.nodeId) return answer({ refusalCode: 'PEER_IDENTITY_MISMATCH' }, r.delayMs)
        if (!target?.switchOn) return answer({ refusalCode: 'REMOTE_COLLABORATION_OFF' }, r.delayMs)
        const there = target.peers.find((p) => p.nodeId === nodeId)
        if (!there) return answer({ refusalCode: 'PEER_NOT_REGISTERED' }, r.delayMs)
        if (registered.paired === false || there.paired === false) return answer({ refusalCode: 'PEER_NOT_PAIRED' }, r.delayMs)
        return answer({ available: true }, r.delayMs)
      }
      case 'GetPeerNodeOffer': {
        const registered = self.peers.find((p) => p.nodeId === variables.nodeId)
        const answer = (a, delayMs) => done({ data: { peerNodeOffer: { __typename: 'PeerNodeOfferGql', entries: null, refusalCode: null, unreachableReason: null, ...a } } }, delayMs)
        if (!self.switchOn) return answer({ refusalCode: 'REMOTE_COLLABORATION_OFF' })
        if (!registered) return answer({ refusalCode: 'PEER_NOT_REGISTERED' })
        const r = reachFrom(registered.baseUrl, nodeId)
        if (!r.ok) return answer({ refusalCode: 'PEER_UNREACHABLE', unreachableReason: REASON_OF_CAUSE[r.cause] }, r.delayMs)
        const target = nodes[r.nodeId]
        if (r.nodeId !== variables.nodeId) return answer({ refusalCode: 'PEER_IDENTITY_MISMATCH' }, r.delayMs)
        if (!target.switchOn) return answer({ refusalCode: 'REMOTE_COLLABORATION_OFF' }, r.delayMs)
        const there = target.peers.find((p) => p.nodeId === nodeId)
        if (!there) return answer({ refusalCode: 'PEER_NOT_REGISTERED' }, r.delayMs)
        if (registered.paired === false || there.paired === false) return answer({ refusalCode: 'PEER_NOT_PAIRED' }, r.delayMs)
        return answer({ entries: target.offers.map((entry) => ({ __typename: 'PeerOfferEntryGql', name: entry.name, kind: entry.kind, description: entry.description ?? null })) }, r.delayMs + target.delayMs)
      }
      default: return null
    }
  }

  /** The operations of `graphql` (a bound node answers these through its own GraphQL endpoint). */
  const OPERATIONS = new Set(['GetRemoteCollaborationCapability', 'SetRemoteCollaborationEnabled', 'GetRemoteCollaborationSettings', 'GetPeerAddressCandidates',
    'ResolvePeerAddress', 'AddPeerNode', 'CreatePeerInvite', 'AcceptPeerInvite', 'RenamePeerNode', 'RemovePeerNode', 'ChangePeerAddress', 'GetPeerNodeAvailability', 'GetPeerNodeOffer'])

  // A requested update plays on a timeline from the request (seconds): checking, downloading, preparing, restarting, then the
  // node does not answer while it restarts, then it answers with the new version. 'failed' stops after downloading; 'lost' never answers again.
  const UPDATE_STEPS = [[0, 'checking'], [3, 'downloading'], [7, 'preparing'], [10, 'restarting']]
  const RESTART_ENDS = 19
  const idle = { state: 'idle', targetVersion: null, step: null, code: null, message: null }
  const nodeUpdate = (target, parsed, request, delayMs) => {
    const server = target?.server
    // the node answers its update endpoint quickly (a status line, unlike the offer's list)
    delayMs = 120
    if (!server || server.mode === 'noEndpoint') return { status: 404, text: '<html>Not Found</html>', delayMs }
    const wanted = parsed.searchParams.get('target')
    if ((request.method || 'GET').toUpperCase() === 'POST') {
      let body = request.body
      if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
      if (server.run === 'refused') {
        return { status: 409, json: { refused: 'NEEDS_NEW_IMAGE', message: 'This node runs an image that cannot update itself.' }, delayMs: delayMs + 100 }
      }
      if (server.run === 'undelivered') return { status: 500, text: '', delayMs: delayMs + 100 }
      server.startedAt = Date.now()
      server.lastUpdate = null
      server.targetVersion = body?.version ?? wanted ?? APP_VERSION
      return { status: 202, json: { accepted: true }, delayMs: delayMs + 100 }
    }
    if (server.running) { server.running = false; server.startedAt = Date.now() - 1000; server.targetVersion = APP_VERSION }
    // the node keeps its last in-place update (C1 `update`) until the next request
    const answer = { inPlaceUpdate: server.mode, version: server.version, ...(server.message ? { message: server.message } : {}), update: server.lastUpdate ?? idle }
    if (server.blocker) answer.updateBlocker = server.blocker
    const seconds = server.startedAt ? (Date.now() - server.startedAt) / 1000 : -1
    if (seconds >= 0) {
      const step = [...UPDATE_STEPS].reverse().find(([from]) => seconds >= from)[1]
      const running = { state: 'running', targetVersion: server.targetVersion, step, code: null, message: null }
      if (server.run === 'failed' && seconds >= 7) {
        answer.update = { state: 'failed', targetVersion: server.targetVersion, step: 'downloading', code: 'DOWNLOAD_FAILED', message: 'The download stopped before it finished.' }
      } else if (server.run === 'lost' && seconds >= 13) {
        return { failure: 'refused', delayMs: 500 }
      } else if (seconds < 13) {
        answer.update = running
      } else if (seconds < RESTART_ENDS) {
        return { failure: 'refused', delayMs: 500 }
      } else {
        answer.version = server.targetVersion
        server.version = server.targetVersion
        server.relation = 'same'
        server.startedAt = null
        answer.update = { state: 'succeeded', targetVersion: server.targetVersion, step: null, code: null, message: null }
        server.lastUpdate = answer.update
      }
    }
    if (wanted) {
      answer.target = { version: wanted, relation: server.relation }
      if (answer.update.state === 'succeeded') answer.target.relation = 'same'
    }
    return { status: 200, json: answer, delayMs: delayMs }
  }

  /**
   * This window asks an address directly. Returns `{ failure: cause, delayMs }` when the request gets no answer (the
   * browser reports only that it failed), or `{ status, json, text, delayMs }`.
   */
  const windowRequest = (url, request = {}) => {
    let parsed
    try { parsed = new URL(url) } catch { return { failure: 'refused', delayMs: 100 } }
    const r = reachFrom(parsed.origin, null)
    if (!r.ok) {
      if (r.cause === 'notAutobyteus') return { status: 404, text: '<html>Not Found</html>', delayMs: r.delayMs }
      return { failure: r.cause, delayMs: r.delayMs }
    }
    const target = nodes[r.nodeId]
    if (parsed.pathname === '/rest/remote-access/status') {
      if (r.nodeId === N.SPARE_OTHER) return { status: 200, json: { phoneAccessEnabled: true, pairingAvailable: true, nodeId: N.SPARE_OTHER, serverName: 'spare' }, delayMs: r.delayMs }
      return { status: 200, json: { phoneAccessEnabled: true, pairingAvailable: true, nodeId: r.nodeId, serverName: target?.selfName ?? 'node' }, delayMs: r.delayMs }
    }
    // Phone Setup: a node's report of its computer's network, and its answer for a local network (asked of the desktop's own
    // node from another node's window).
    if (parsed.pathname === '/rest/remote-access/network') return { status: 200, json: { network: networkOf(r.nodeId) }, delayMs: Math.min(r.delayMs, 200) }
    const allow = parsed.pathname.match(/^\/rest\/remote-access\/network\/local-networks\/([^/]+)$/)
    if (allow && String(request.method || 'GET').toUpperCase() === 'PUT') {
      let body = request.body
      if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
      setNetworkAllowed(r.nodeId, decodeURIComponent(allow[1]), body?.allowed)
      return { status: 200, json: { networkId: decodeURIComponent(allow[1]), allowed: Boolean(body?.allowed) }, delayMs: 150 }
    }
    if (parsed.pathname === '/rest/node-update') return nodeUpdate(r.nodeId === N.SPARE_OTHER ? { server: { ...SAME } } : target, parsed, request, r.delayMs)
    if (r.nodeId === boundNodeId && parsed.pathname !== '/graphql') return { proxy: true, delayMs: 0 }
    if (parsed.pathname === '/graphql') {
      let body = request.body
      if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
      const operationName = body?.operationName || String(body?.query || '').match(/\b(?:query|mutation)\s+([A-Za-z0-9_]+)/)?.[1]
      // This window's own node answers every other operation itself (its own GraphQL endpoint).
      if (r.nodeId === boundNodeId && !OPERATIONS.has(operationName)) return { proxy: true, delayMs: 0 }
      const isWrite = /\bmutation\b/.test(String(body?.query || ''))
      // A node that restarts: its first write from this window fails once, and it stays away for 8 s (scripted).
      if (isWrite && target?.failOnce) {
        target.failOnce = false
        target.downUntil = Date.now() + 8000
        return { failure: 'refused', delayMs: 500 }
      }
      const result = graphql(r.nodeId, operationName, body?.variables || {})
      if (!result) return { status: 200, json: { data: null, errors: [{ message: `Unknown operation ${operationName}.` }] }, delayMs: r.delayMs }
      return { status: 200, json: result.answer, delayMs: r.delayMs + result.delayMs }
    }
    return { status: 404, text: 'Not found', delayMs: r.delayMs }
  }

  return { nodes, boundNodeId, graphql, OPERATIONS, windowRequest, reach: reachFrom, phone, networkOf, setNetworkAllowed }
}

/** The desktop's own list of nodes (the entries) at the start of a scenario, as the host bridge returns it. */
export const desktopEntries = (scenario) => {
  const t = '2026-10-20T09:00:00.000Z'
  const entry = (entryId, name, baseUrl, nodeId, extra = {}) => ({ id: entryId, name, baseUrl, nodeType: 'remote', ...(nodeId ? { nodeId } : {}), createdAt: t, updatedAt: t, ...extra })
  return [
    entry('embedded-local', 'Embedded Node', 'http://127.0.0.1:29695', N.E, { nodeType: 'embedded' }),
    entry('remote-docker', 'docker', 'http://localhost:8001', N.D1),
    ...(scenario === 'nodes_states' ? [
      entry('remote-studio', 'studio', 'http://192.168.2.31:29695', N.STU),
      entry('remote-spare', 'spare', 'http://192.168.2.90:29695', N.SPARE),
      entry('remote-old-box', 'old-box', 'http://192.168.2.77:29695', N.OLD),
      entry('remote-edge', 'edge', 'http://192.168.2.99:29695', N.EDGE),
      entry('remote-nas', 'nas', 'http://192.168.2.55:29695', N.NAS),
      entry('remote-8003', '8003', 'http://localhost:8003', N.D3),
    ] : []),
  ]
}
