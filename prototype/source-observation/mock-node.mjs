#!/usr/bin/env node
import http from 'node:http'
import { URL } from 'node:url'
import { WebSocketServer } from 'ws'
import { liveStreamFrames } from './live-streams.mjs'
import { applicationAvailableExecutionResources, applicationLaunchConfigurationView, baseState, networkWorldOf, operationFixture, scenarioCatalog, syntheticApplicationHtml, taskContextUpload } from './fixtures.mjs'
import { createSchemaFiller } from './schema-filler.mjs'
import { restFixture } from './rest-fixtures.mjs'
import { subscribeNotificationChanges } from './node-settings-fixtures.mjs'

// Optional comparison hook (disposable scaffolding): a module that adds what the baseline's design layers answer, so the pinned source
// can show the same data. `graphqlHook(name, variables, data, state)` and `wsHook(ws, pathname, state)`.
const hookModule = process.env.PROTOTYPE_MOCK_HOOK ? await import(process.env.PROTOTYPE_MOCK_HOOK) : null
const port = Number(process.env.PROTOTYPE_MOCK_PORT || 4310)
const host = process.env.PROTOTYPE_MOCK_HOST || '127.0.0.1'
const state = baseState()
const requestLog = []
const completeWithSchema = createSchemaFiller(new URL('../../generated/graphql.ts', import.meta.url).pathname)

function applyScenario(name) {
  if (!scenarioCatalog[name]) throw new Error(`Unknown scenario: ${name}`)
  state.scenario = name
  state.requestDelayMs = name === 'loading' ? 1500 : 0
  state.launchedTeamRun = false
  state.projectData = null
  state.skillSourceData = null
  state.taskContextFiles = {}
  state.archivedAgentGroup = false
  state.delegatedSelections = null
  state.embedding = null
  state.nodeSettings = null
  state.world = null
  state.serverSettings = null
  state.network = null
  state.restState = null
}

applyScenario(process.env.PROTOTYPE_SCENARIO || 'populated')

const send = (res, status, body, contentType = 'application/json; charset=utf-8') => {
  res.writeHead(status, {
    'content-type': contentType,
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'content-type, authorization, x-autobyteus-mobile-session',
    'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'cache-control': 'no-store',
  })
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body))
}

const readBody = async (req) => {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (!chunks.length) return {}
  const text = Buffer.concat(chunks).toString('utf8')
  try { return JSON.parse(text) } catch { return { raw: text } }
}

const operationNameFrom = (payload) => payload.operationName || String(payload.query || '').match(/\b(?:query|mutation)\s+([A-Za-z0-9_]+)/)?.[1] || 'AnonymousOperation'
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || `${host}:${port}`}`)
  if (req.method === 'OPTIONS') return send(res, 204, '')

  if (url.pathname === '/__prototype/health') {
    return send(res, 200, { ok: true, adapter: 'autobyteus-prototype-mock-node', state, scenarios: scenarioCatalog, requestCount: requestLog.length })
  }
  if (url.pathname === '/__prototype/requests') return send(res, 200, { requests: requestLog.slice(-500) })
  // one-nodes-tab: the browser harness forwards what its window asks another node's address to the simulated network.
  if (url.pathname === '/__network/request' && req.method === 'POST') {
    const input = await readBody(req)
    return send(res, 200, networkWorldOf(state).windowRequest(input.url, input.request || {}))
  }
  if (url.pathname === '/__prototype/scenario') {
    if (req.method === 'GET') return send(res, 200, { state, scenarios: scenarioCatalog })
    try {
      const input = await readBody(req)
      if (input.scenario) applyScenario(input.scenario)
      if (Number.isFinite(input.requestDelayMs)) state.requestDelayMs = Math.max(0, Number(input.requestDelayMs))
      if (typeof input.designLayers === 'string') state.designLayers = input.designLayers
      if (typeof input.hostContext === 'string') { state.hostContext = input.hostContext; state.world = null }
      if (typeof input.applicationsEnabled === 'boolean') state.applicationsEnabled = input.applicationsEnabled
      if (typeof input.managedGatewayEnabled === 'boolean') state.managedGatewayEnabled = input.managedGatewayEnabled
      if (input.operationFailures && typeof input.operationFailures === 'object') state.operationFailures = { ...input.operationFailures }
      return send(res, 200, { ok: true, state })
    } catch (error) {
      return send(res, 400, { ok: false, message: error.message })
    }
  }

  if (state.scenario === 'loading' || state.requestDelayMs) {
    await new Promise(resolve => setTimeout(resolve, state.requestDelayMs || 1500))
  }

  if (url.pathname === '/rest/health' || url.pathname === '/health') {
    return state.scenario === 'bootstrap_error'
      ? send(res, 503, { status: 'error', message: 'Synthetic node bootstrap failure.' })
      : send(res, 200, { status: 'ok', version: 'prototype-1.0.0', fixture: true })
  }

  if (url.pathname === '/graphql') {
    const payload = req.method === 'GET'
      ? { query: url.searchParams.get('query'), operationName: url.searchParams.get('operationName'), variables: JSON.parse(url.searchParams.get('variables') || '{}') }
      : await readBody(req)
    const operationName = operationNameFrom(payload)
    requestLog.push({ at: new Date().toISOString(), method: req.method, path: url.pathname, operationName, scenario: state.scenario })
    if (state.scenario === 'permission_denied') return send(res, 403, { errors: [{ message: 'Synthetic permission denied.', extensions: { code: 'FORBIDDEN' } }] })
    if (state.scenario === 'error' || state.operationFailures[operationName]) {
      return send(res, 200, { data: null, errors: [{ message: state.operationFailures[operationName] || 'Synthetic recoverable GraphQL failure.', extensions: { code: 'PROTOTYPE_FIXTURE_ERROR', operationName } }] })
    }
    // WEB-BASELINE-REFRESH-008: the source lists runtimes in the order their availability
    // checks answer (parallel requests). Answer them in inventory order so observation is
    // deterministic (autobyteus, codex_app_server, claude_agent_sdk, antigravity_cli).
    if (operationName === 'GetRuntimeAvailability') {
      const order = ['autobyteus', 'codex_app_server', 'claude_agent_sdk', 'antigravity_cli'].indexOf(payload.variables?.runtimeKind)
      await new Promise(resolve => setTimeout(resolve, 40 * Math.max(0, order)))
    }
    state.lastDelayMs = 0
    let fixture = operationFixture(operationName, payload.variables || {}, state)
    if (hookModule?.graphqlHook) fixture = hookModule.graphqlHook(operationName, payload.variables || {}, fixture, state)
    if (state.lastDelayMs) await new Promise(resolve => setTimeout(resolve, state.lastDelayMs))
    if (fixture?.__projectError) return send(res, 200, { data: null, errors: [fixture.__projectError] })
    // Like the real node, a created TeamRun appears as active in later history reads.
    if (operationName === 'CreateAgentTeamRun') state.launchedTeamRun = true
    const data = completeWithSchema(payload.query, payload.operationName, fixture || {})
    return send(res, 200, { data, extensions: { prototypeFixture: true, operationName, scenario: state.scenario } })
  }

  if (state.scenario === 'permission_denied' && url.pathname.startsWith('/rest/')) {
    return send(res, 403, { detail: 'Synthetic permission denied.', code: 'PROTOTYPE_FORBIDDEN' })
  }

  if (url.pathname.startsWith('/rest/')) requestLog.push({ at: new Date().toISOString(), method: req.method, path: url.pathname, scenario: state.scenario })

  if (url.pathname.startsWith('/rest/') && url.pathname !== '/rest/remote-access/status' && url.pathname !== '/rest/remote-access/pairing-exchanges') {
    const body = req.method === 'GET' ? {} : await readBody(req)
    const answer = restFixture(req.method, url.pathname.slice('/rest'.length), body, state)
    if (answer) return send(res, answer.status, answer.json)
  }
  if (url.pathname === '/rest/remote-access/status') {
    const world = networkWorldOf(state)
    return send(res, 200, { phoneAccessEnabled: true, pairingAvailable: true, nodeId: world.boundNodeId, serverName: world.nodes[world.boundNodeId].selfName })
  }
  if (url.pathname === '/rest/remote-access/pairing-exchanges' && req.method === 'POST') {
    const input = await readBody(req)
    if (input.pairingToken === 'denied') return send(res, 401, { detail: 'Synthetic pairing token rejected.' })
    return send(res, 200, {
      credential: 'prototype_mobile_session',
      serverBaseUrl: `http://${host}:${port}`,
      device: { deviceId: 'prototype-phone', displayName: input.deviceName || 'Phone', clientFacingBaseUrl: `http://${host}:${port}`, createdAt: '2026-08-22T04:00:00.000Z', lastSeenAt: '2026-08-22T04:00:00.000Z', revokedAt: null },
    })
  }
  if (url.pathname === '/rest/media') {
    const category = url.searchParams.get('category') || 'images'
    const data = state.scenario === 'empty' ? [] : [{ filename: `prototype-${category}.svg`, category, url: `http://${host}:${port}/rest/media/${category}/prototype-${category}.svg`, size: 2400, createdAt: '2026-08-22T04:00:00.000Z' }]
    return send(res, 200, { files: data, pagination: { currentPage: 1, totalPages: data.length ? 1 : 0, totalFiles: data.length, limit: 20 } })
  }
  if (/^\/rest\/media\//.test(url.pathname)) {
    if (req.method === 'DELETE') return send(res, 200, { success: true })
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640"><rect width="640" height="640" fill="#dbeafe"/><circle cx="320" cy="250" r="110" fill="#2563eb"/><text x="320" y="430" text-anchor="middle" font-family="system-ui" font-size="42" fill="#0f172a">Prototype media</text></svg>`
    return send(res, 200, svg, 'image/svg+xml')
  }
  if (/\/execution-resource-configurations$/.test(url.pathname)) return send(res, 200, applicationLaunchConfigurationView())
  if (url.pathname.includes('/available-execution-resources')) return send(res, 200, applicationAvailableExecutionResources())
  if (url.pathname.includes('/application-bundles/') && url.pathname.endsWith('/ui/index.html')) return send(res, 200, syntheticApplicationHtml(), 'text/html; charset=utf-8')
  if (url.pathname.includes('/application-bundles/') && url.pathname.endsWith('prototype-app.svg')) {
    return send(res, 200, '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="14" fill="#2563eb"/><path d="M18 20h28v24H18z" fill="white"/><path d="M23 27h18M23 33h14M23 39h10" stroke="#2563eb" stroke-width="3"/></svg>', 'image/svg+xml')
  }
  if (url.pathname.includes('/application-bundles/') || url.pathname.includes('/applications/')) return send(res, 200, { ok: true, fixture: true })
  if (url.pathname.includes('/content') || url.pathname.includes('/file-change-content')) return send(res, 200, '# Synthetic file\n\nFixture content only.', 'text/plain; charset=utf-8')
  // Project Task context files (0a32261): draft begin/upload/remove/discard.
  if (/^\/rest\/projects\/[^/]+\/task-context-drafts$/.test(url.pathname) && req.method === 'POST') {
    state.taskDraftSeq = (state.taskDraftSeq || 0) + 1
    return send(res, 200, { draftId: `draft-${state.taskDraftSeq}` })
  }
  if (/^\/rest\/projects\/[^/]+\/task-context-drafts\/[^/]+\/context-files$/.test(url.pathname) && req.method === 'POST') {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    const body = Buffer.concat(chunks)
    const name = /filename="([^"]+)"/.exec(body.toString('latin1'))?.[1] || 'file'
    const type = /Content-Type: ([^\r\n]+)/i.exec(body.toString('latin1'))?.[1] || 'application/octet-stream'
    const start = body.indexOf('\r\n\r\n') + 4
    const end = body.lastIndexOf('\r\n--')
    return send(res, 200, taskContextUpload(state, { name, type, size: Math.max(0, end - start) }))
  }
  if (/^\/rest\/projects\/[^/]+\/(task-context-drafts|tasks)\//.test(url.pathname)) {
    if (req.method === 'DELETE') return send(res, 200, { ok: true })
    return send(res, 200, '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#dbeafe"/></svg>', 'image/svg+xml')
  }
  if (url.pathname.startsWith('/rest/drafts/') || url.pathname.startsWith('/rest/context-files/')) return send(res, 200, { storedFilename: 'ctx_prototype__fixture.txt', originalFilename: 'fixture.txt', locator: '/rest/context-files/ctx_prototype__fixture.txt', mediaType: 'text/plain', size: 42 })
  if (url.pathname.startsWith('/rest/')) return send(res, 200, { ok: true, fixture: true, path: url.pathname })

  return send(res, 404, { message: 'Prototype mock route not found.', path: url.pathname })
})

const wss = new WebSocketServer({ noServer: true })
server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, ws => wss.emit('connection', ws, req))
})
wss.on('connection', (ws, req) => {
  const pathname = new URL(req.url || '/', `http://${req.headers.host || `${host}:${port}`}`).pathname
  // WEB-BASELINE-REFRESH-010: a live stored run's stream (live_runs scenario) answers with its view.
  // WEB-BASELINE-REFRESH-012: the update-notifications feed greets every connection; the greeting makes the
  // window read its notifications (the baseline's local WebSocket plays the same greeting).
  if (pathname === '/ws/update-notifications') {
    setTimeout(() => ws.send(JSON.stringify({ type: 'connected' })), 20)
    const stop = subscribeNotificationChanges(() => { if (ws.readyState === 1) ws.send(JSON.stringify({ type: 'update_notifications_changed' })) })
    ws.on('close', stop)
  }
  const liveFrames = liveStreamFrames(state, pathname)
  if (liveFrames) setTimeout(() => { for (const frame of liveFrames) ws.send(JSON.stringify(frame)) }, 20)
  hookModule?.wsHook?.(ws, pathname, state)
  if (pathname.startsWith('/ws/file-explorer/')) {
    ws.send(JSON.stringify({ type: 'CONNECTED', payload: { session_id: `fixture-${pathname.split('/').pop() || 'workspace'}` } }))
  }
  ws.on('message', raw => {
    let message = null
    try { message = JSON.parse(raw.toString()) } catch {}
    if (message?.type === 'connection_init') return ws.send(JSON.stringify({ type: 'connection_ack', payload: { fixture: true } }))
    if (message?.type === 'ping') return ws.send(JSON.stringify({ type: 'pong' }))
    if (pathname.includes('/terminal')) return ws.send(JSON.stringify({ type: 'output', data: String(message?.data || message?.input || '') }))
    if (message?.type === 'subscribe' && message.id) return ws.send(JSON.stringify({ id: message.id, type: 'next', payload: { data: {} } }))
  })
  ws.on('error', () => {})
})

server.listen(port, host, () => {
  process.stdout.write(`[prototype-mock-node] listening on http://${host}:${port} scenario=${state.scenario}\n`)
})

// A browser that aborts a request (a page closing mid-request) must not stop the observation node.
process.on('unhandledRejection', () => {})
const close = () => server.close(() => process.exit(0))
process.on('SIGINT', close)
process.on('SIGTERM', close)
