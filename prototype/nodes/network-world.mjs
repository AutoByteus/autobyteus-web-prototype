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
  '192.168.2.40:29695': N.LAP, '192.168.2.31:29695': N.STU, '192.168.2.55:29695': N.NAS,
  '192.168.2.77:29695': { cause: 'refused' }, '192.168.2.90:29695': { other: N.SPARE_OTHER }, '192.168.2.99:29695': { cause: 'timeout' },
}

const addedAt = '2026-10-20T09:00:00.000Z'
const peer = (nodeId, name, baseUrl) => ({ nodeId, name, baseUrl, addedAt })

/** The nodes of a scenario. `nodes_states` adds a row in every state; every other scenario is the small network. */
export const buildNodes = (scenario) => {
  const states = scenario === 'nodes_states'
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
    [N.NAS]: node({
      id: N.NAS, selfName: 'nas', lan: true, switchOn: true, delayMs: 800, candidates: ['http://192.168.2.55:29695'],
      peers: [peer(N.E, 'Embedded Node', LAN_THIS)],
    }),
  }
}

const hostPortOf = (url) => {
  const text = String(url).trim().replace(/^[a-z]+:\/\//i, '').replace(/\/.*$/, '')
  const [host, port = '80'] = text.split(':')
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

/**
 * @param scenario the scenario name
 * @param options `boundNodeId`: the node this window is bound to; `extraListeners`: more addresses that answer as a node
 *   (for example the observation node's own address, as the bound node).
 */
export const createNetworkWorld = (scenario, options = {}) => {
  const nodes = buildNodes(scenario)
  const boundNodeId = options.boundNodeId || N.E
  const extraListeners = options.extraListeners || {}
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
    const peerView = (p) => ({ __typename: 'PeerNodeGql', nodeId: p.nodeId, name: p.name, baseUrl: p.baseUrl, addedAt: p.addedAt })
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
        if (!target.peers.some((p) => p.nodeId === nodeId)) return answer({ refusalCode: 'PEER_NOT_REGISTERED' }, r.delayMs)
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
        if (!target.peers.some((p) => p.nodeId === nodeId)) return answer({ refusalCode: 'PEER_NOT_REGISTERED' }, r.delayMs)
        return answer({ entries: target.offers.map((entry) => ({ __typename: 'PeerOfferEntryGql', name: entry.name, kind: entry.kind, description: entry.description ?? null })) }, r.delayMs + target.delayMs)
      }
      default: return null
    }
  }

  /** The operations of `graphql` (a bound node answers these through its own GraphQL endpoint). */
  const OPERATIONS = new Set(['GetRemoteCollaborationCapability', 'SetRemoteCollaborationEnabled', 'GetRemoteCollaborationSettings', 'GetPeerAddressCandidates',
    'ResolvePeerAddress', 'AddPeerNode', 'RenamePeerNode', 'RemovePeerNode', 'ChangePeerAddress', 'GetPeerNodeAvailability', 'GetPeerNodeOffer'])

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

  return { nodes, boundNodeId, graphql, OPERATIONS, windowRequest, reach: reachFrom }
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
