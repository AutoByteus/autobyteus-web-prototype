/**
 * Install a deterministic browser-side substitute for the Electron preload
 * bridge. The same function is injected before the pinned source starts and
 * called by the isolated prototype, so host-specific UI is compared under an
 * identical synthetic contract without bundling Electron.
 */
export function installHostScenario(options = {}) {
  const context = String(options.context || localStorage.getItem('autobyteus.prototype.context') || 'desktop')
  if (!context.startsWith('electron_')) return null

  const scenario = String(options.scenario || localStorage.getItem('autobyteus.prototype.scenario') || 'populated')
  const baseUrl = String(options.mockBaseUrl || 'http://127.0.0.1:4391').replace(/\/$/, '')
  const embedded = context === 'electron_internal'
  const listeners = { server: new Set(), node: new Set(), update: new Set(), browser: new Set(), quitting: new Set(), access: new Set(), autoUpdate: new Set() }
  const cleanup = (set, callback) => { set.add(callback); return () => set.delete(callback) }
  const urls = {
    graphql: `${baseUrl}/graphql`, rest: `${baseUrl}/rest`, graphqlWs: `${baseUrl.replace(/^http/, 'ws')}/graphql`,
    transcription: `${baseUrl}/rest/transcribe`, terminalWs: `${baseUrl.replace(/^http/, 'ws')}/ws/terminal`, health: `${baseUrl}/health`,
  }
  const serverStatusName = scenario === 'electron_starting' ? 'starting'
    : scenario === 'electron_error' ? 'error'
      : scenario === 'electron_restarting' ? 'restarting'
        : scenario === 'electron_shutdown' ? 'shutting-down' : 'running'
  let server = {
    status: serverStatusName,
    baseUrl,
    urls,
    message: serverStatusName === 'error' ? 'Synthetic embedded server failed to start.' : '',
  }
  // one-nodes-tab: the Nodes scenarios seed this desktop's list with the nodes of the simulated network
  // (prototype/nodes/nodeWorld.ts). The window's node is the embedded node, or Docker 8001 in an external window.
  const nodesScenario = scenario.startsWith('nodes_')
  const entry = (id, name, baseUrl, nodeId, extra = {}) => ({ id, name, baseUrl, nodeType: 'remote', nodeId, createdAt: '2026-10-20T09:00:00.000Z', updatedAt: '2026-10-20T09:00:00.000Z', ...extra })
  // extensions-nodes-baseline-refresh-516: Phone Setup's `remote_*` states add "Office Mac" (a node on another computer) at the address
  // the desktop uses for it, and an external window opens on it (prototype/nodes/network-world.mjs OFFICE_ADDRESS).
  const phoneState = String(options.phonePairing ?? localStorage.getItem('autobyteus.prototype.phonePairing') ?? '')
  const officeAddress = {
    remote_lan: 'http://192.168.2.60:29695', remote_tailscale: 'http://100.88.20.20:29695', remote_vpn: 'http://10.8.0.20:29695',
    remote_unreachable: 'http://localhost:29700', remote_nothing: 'http://localhost:29700',
  }[phoneState] || null
  // autobyteus-356: "Update automatically" is a registry field of a remote entry (Docker 8001's is on in the automatic-update scenarios).
  const dockerAutoUpdate = ['nodes_auto_updated', 'nodes_auto_failed'].includes(scenario)
  const nodesRegistry = [
    { id: 'embedded-local', name: 'Embedded Node', baseUrl: 'http://127.0.0.1:29695', nodeType: 'embedded', nodeId: 'srv_m9VFq2Lw', createdAt: '2026-10-20T09:00:00.000Z', updatedAt: '2026-10-20T09:00:00.000Z' },
    entry('remote-docker', 'docker', 'http://localhost:8001', 'srv_ibJioK7n', dockerAutoUpdate ? { autoUpdate: true } : {}),
    ...(officeAddress ? [entry('remote-office', 'Office Mac', officeAddress, 'srv_0ff1c3Mac')] : []),
    // extensions-ui-516 (design): linux-box, a node this desktop owns (set up earlier with a setup code), not yet paired with this node.
    ...(scenario === 'nodes_user' ? [entry('remote-linux-box', 'linux-box', 'http://192.168.2.50:29695', 'srv_l1nuxB0xPrivPn7Wq8Mv5Tn2Bc7Hy4Lp9Gs6')] : []),
    ...(scenario === 'nodes_states' ? [
      entry('remote-studio', 'studio', 'http://192.168.2.31:29695', 'srv_stUd10Ka9'),
      entry('remote-spare', 'spare', 'http://192.168.2.90:29695', 'srv_sp4r3Km1'),
      entry('remote-old-box', 'old-box', 'http://192.168.2.77:29695', 'srv_oldB0x2Mz'),
      entry('remote-edge', 'edge', 'http://192.168.2.99:29695', 'srv_edG3t7Hs'),
      entry('remote-nas', 'nas', 'http://192.168.2.55:29695', 'srv_n4sBo7Xe'),
      entry('remote-8003', '8003', 'http://localhost:8003', 'srv_Q3xKa8Zt'),
    ] : []),
  ]
  let registry = nodesScenario ? { version: 3, nodes: nodesRegistry } : {
    version: 3,
    nodes: [
      { id: 'embedded-local', name: 'Embedded Node', baseUrl, nodeType: 'embedded', createdAt: '2026-08-22T04:00:00.000Z', updatedAt: '2026-08-22T04:00:00.000Z' },
      { id: 'remote-prototype', name: 'Prototype Remote Node', baseUrl, nodeType: 'remote', createdAt: '2026-08-22T04:00:00.000Z', updatedAt: '2026-08-22T04:00:00.000Z' },
    ],
  }
  let extensions = [{
    id: 'voice-input', name: 'Voice Input', description: 'Record speech and transcribe it locally before sending.',
    status: scenario === 'extension_error' ? 'error' : scenario === 'extension_missing' ? 'not-installed' : 'installed',
    enabled: !['extension_error', 'extension_missing'].includes(scenario), settings: { languageMode: 'auto', audioInputDeviceId: null },
    message: scenario === 'extension_error' ? 'Synthetic runtime verification failed.' : 'Voice input is ready.', installProgress: null,
    installedAt: '2026-08-22T04:00:00.000Z', runtimeVersion: '1.0.0-prototype', modelVersion: 'tiny-prototype', backendKind: 'faster-whisper',
    lastError: scenario === 'extension_error' ? 'Synthetic runtime verification failed.' : null,
  }]
  const checkedAt = '2026-08-22T04:05:00.000Z'
  // WEB-BASELINE-REFRESH-012: in the update-notification scenarios the desktop shell holds a waiting app update
  // (the Notification Center's "Software update" row). Its Download plays progress; nothing downloads.
  const notifies = ['updates_waiting', 'updates_many', 'updates_off', 'updates_auto_on', 'updates_backoff', 'updates_discover'].includes(scenario)
  const hoursAgo = hours => new Date(Date.now() - hours * 3_600_000).toISOString()
  let update = {
    notification: notifies ? { version: '0.2.0-prototype', fromVersion: '0.1.0-prototype', foundAt: hoursAgo(2), read: false, state: 'waiting', handledVersion: null, releasePageUrl: 'https://github.com/synthetic-org/autobyteus-releases/releases/tag/v0.2.0-prototype' } : null,
    // update-checks-and-auto-updates: Settings → Updates states: found by a check, checked and current, a failed periodic check, checks off.
    status: scenario === 'update_available' || notifies ? 'available' : scenario === 'update_error' || scenario === 'update_check_failed' ? 'error'
      : scenario === 'update_up_to_date' ? 'no-update' : 'idle',
    currentVersion: '0.1.0-prototype', availableVersion: scenario === 'update_available' || notifies ? '0.2.0-prototype' : null,
    downloadPercent: null, downloadTransferredBytes: null, downloadTotalBytes: null,
    releaseNotes: scenario === 'update_available' || notifies ? 'Synthetic review update.' : null,
    message: scenario === 'update_error' ? 'Synthetic update service unavailable.' : '',
    errorKind: scenario === 'update_error' || scenario === 'update_check_failed' ? 'network' : null,
    errorOperation: scenario === 'update_error' ? 'manual-check' : scenario === 'update_check_failed' ? 'auto-check' : null,
    checkedAt: scenario === 'update_up_to_date' ? hoursAgo(0.2) : scenario === 'update_check_failed' ? hoursAgo(0.4) : scenario.startsWith('update_') ? checkedAt : notifies ? hoursAgo(0.5) : null,
    // The app's own periodic check (REQ-012/013): on by default, every 60 minutes. Nothing is requested; only the state is kept.
    autoCheck: { enabled: scenario !== 'update_checks_off', intervalMinutes: 60 },
    // package-clone-auto-update-457 (autobyteus-356): "Update automatically" for the app, off until the user turns it on.
    automaticUpdate: false, automaticInstallPreparing: false,
  }
  let browser = { activeTabId: 'browser-tab-1', sessions: [{ tab_id: 'browser-tab-1', title: 'Prototype browser', url: 'https://example.invalid/prototype', deviceEmulation: { mode: 'desktop', profile: null } }] }
  const emit = (key, value) => listeners[key].forEach(callback => callback(structuredClone(value)))
  const setServer = next => { server = { ...server, ...next }; emit('server', server); return structuredClone(server) }
  const setUpdate = next => { update = { ...update, ...next }; emit('update', update); return structuredClone(update) }
  const setBrowser = next => { browser = { ...browser, ...next }; emit('browser', browser); return structuredClone(browser) }
  const extensionResult = patch => {
    extensions = extensions.map(item => item.id === 'voice-input' ? { ...item, ...patch } : item)
    return structuredClone(extensions)
  }

  // ---- extensions-nodes-baseline-refresh-516: this desktop's node access (autobyteus-437). The embedded node is connected by its launch
  // credential; a remote node is connected once a setup code was exchanged. Every remote entry of the scenario starts connected, except
  // Docker 8001 in the `nodes_access*` scenarios; a node added on the page needs connecting. A code is accepted after 0.7 s, or refused
  // by the scenario (scripted; nothing is exchanged). Disconnect forgets the credential.
  const accessRefusal = {
    nodes_access_code_invalid: { code: 'NODE_SETUP_CODE_INVALID', message: 'The setup code is not valid.' },
    nodes_access_network_refused: { code: 'NODE_NETWORK_REFUSED', message: 'This node does not accept connections from this network.' },
    nodes_access_unreachable: { code: 'NODE_UNREACHABLE', message: 'Failed to fetch' },
  }[scenario] || null
  const connectedEntries = new Set(registry.nodes.filter(node => node.nodeType !== 'embedded'
    && !(scenario.startsWith('nodes_access') && node.id === 'remote-docker')).map(node => node.id))
  const accessStates = () => Object.fromEntries(registry.nodes.map(node => [node.id, node.nodeType === 'embedded' || connectedEntries.has(node.id) ? 'connected' : 'needs_connecting']))
  const later = (ms) => new Promise(done => setTimeout(done, ms))
  // ---- autobyteus-356: automatic node updates. The desktop checks a node at once when its switch turns on: if the node is older than
  // this app and can update in place, it asks the node to update (the simulated node plays its scripted update) and follows it every
  // 10 s until it ends. One entry per node; the windows get it by broadcast.
  const appVersion = '0.1.0-prototype'
  const autoUpdates = scenario === 'nodes_auto_updated'
    ? { 'remote-docker': { version: appVersion, requestedAt: new Date(Date.now() - 50 * 60_000).toISOString(), outcome: 'AUTO_UPDATED', reason: null, read: false } }
    : scenario === 'nodes_auto_failed'
      ? { 'remote-docker': { version: appVersion, requestedAt: new Date(Date.now() - 50 * 60_000).toISOString(), outcome: 'AUTO_FAILED', reason: 'The download stopped before it finished.', read: false } }
      : {}
  const setAutoUpdate = (entryId, value) => {
    if (value) autoUpdates[entryId] = value
    else delete autoUpdates[entryId]
    emit('autoUpdate', autoUpdates)
  }
  const nodeUpdateUrl = (entryId) => {
    const node = registry.nodes.find(item => item.id === entryId)
    return node ? `${String(node.baseUrl).replace(/\/+$/, '')}/rest/node-update` : null
  }
  const readNode = async (entryId) => {
    const url = nodeUpdateUrl(entryId)
    if (!url) return null
    try { const response = await window.fetch(`${url}?target=${encodeURIComponent(appVersion)}`); return response.ok ? await response.json() : null } catch { return null }
  }
  async function checkNodeForAutoUpdate(entryId) {
    const status = await readNode(entryId)
    if (!status || status.inPlaceUpdate !== 'available' || status.updateBlocker || status.target?.relation !== 'newer') return
    const requestedAt = new Date().toISOString()
    let response = null
    try { response = await window.fetch(nodeUpdateUrl(entryId), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ version: appVersion }) }) } catch { /* not reached */ }
    if (!response || response.status !== 202) {
      const answer = response ? await response.json().catch(() => null) : null
      setAutoUpdate(entryId, { version: appVersion, requestedAt, outcome: 'AUTO_FAILED', reason: answer?.message || (response ? `HTTP ${response.status}` : 'The node could not be reached.'), read: false })
      return
    }
    setAutoUpdate(entryId, { version: appVersion, requestedAt, outcome: 'PENDING', reason: null, read: false })
    for (let tick = 0; tick < 90; tick += 1) {
      await later(10_000)
      const now = await readNode(entryId)
      const state = now?.update?.state
      if (state === 'succeeded') return setAutoUpdate(entryId, { version: appVersion, requestedAt, outcome: 'AUTO_UPDATED', reason: null, read: false })
      if (state === 'failed' || state === 'refused') return setAutoUpdate(entryId, { version: appVersion, requestedAt, outcome: 'AUTO_FAILED', reason: now.update.message || null, read: false })
    }
  }

  // The simulated install's steps: manifest, runtime download (with bytes), extract, runtime and model bootstrap.
  const INSTALL_STEPS = [
    ['fetching-manifest', null, 'Fetching the runtime manifest…'], ['downloading-runtime', 0, 'Downloading the voice runtime…'],
    ['downloading-runtime', 35, 'Downloading the voice runtime…'], ['downloading-runtime', 70, 'Downloading the voice runtime…'],
    ['downloading-runtime', 100, 'Downloading the voice runtime…'], ['extracting-runtime', null, 'Extracting the voice runtime…'],
    ['bootstrapping-runtime', null, 'Preparing the voice runtime…'], ['bootstrapping-model', null, 'Preparing the speech model…'],
  ]
  const playInstall = async () => {
    const total = 48_000_000
    for (const [phase, percent, message] of INSTALL_STEPS) {
      extensionResult({ status: 'installing', enabled: false, message, lastError: null, installProgress: { phase, percent, bytesReceived: percent === null ? null : Math.round(total * percent / 100), bytesTotal: percent === null ? null : total } })
      await later(750)
    }
  }
  window.electronAPI = {
    getNodeAccessStates: async () => accessStates(),
    onNodeAccessChanged: callback => cleanup(listeners.access, callback),
    connectNode: async (entryId) => {
      await later(700)
      if (!registry.nodes.some(node => node.id === entryId && node.nodeType === 'remote')) return { ok: false, code: 'NODE_ENTRY_NOT_FOUND', message: 'This node is not in the node list.' }
      if (accessRefusal) return { ok: false, ...accessRefusal }
      connectedEntries.add(entryId)
      emit('access', accessStates())
      return { ok: true, states: accessStates() }
    },
    disconnectNode: async (entryId) => {
      await later(400)
      connectedEntries.delete(entryId)
      emit('access', accessStates())
      return { ok: true, states: accessStates() }
    },
    getNodeAutoUpdateState: async () => structuredClone(autoUpdates),
    onNodeAutoUpdateChanged: callback => cleanup(listeners.autoUpdate, callback),
    markNodeAutoUpdateRead: async (entryId) => {
      if (autoUpdates[entryId]) autoUpdates[entryId] = { ...autoUpdates[entryId], read: true }
      return structuredClone(autoUpdates)
    },
    recheckNodeAutoUpdate: async (entryId) => {
      const failed = autoUpdates[entryId]
      if (failed?.outcome !== 'AUTO_FAILED') return
      const status = await readNode(entryId)
      if (status?.version === failed.version) setAutoUpdate(entryId, null)
    },
    sendPing: () => {}, onPong: () => {},
    getServerStatus: async () => structuredClone(server),
    restartServer: async () => { setServer({ status: 'restarting', message: '' }); setTimeout(() => setServer({ status: 'running', message: '' }), 350); return structuredClone(server) },
    onServerStatus: callback => cleanup(listeners.server, callback),
    checkServerHealth: async () => server.status === 'running' ? { status: 'ok', data: { status: 'healthy' } } : server.status === 'error' ? { status: 'error', message: server.message } : { status: 'starting', message: 'Synthetic server is starting.' },
    openNodeWindow: async () => ({ windowId: 22, created: true }), focusNodeWindow: async () => ({ focused: true }), listNodeWindows: async () => [],
    // extensions-ui-516 (design): `localStorage['autobyteus.prototype.windowEntry']` binds a node window to another entry (e.g. remote-linux-box).
    getWindowContext: async () => ({ windowId: embedded ? 1 : 2, entryId: embedded ? 'embedded-local' : (typeof localStorage !== 'undefined' && localStorage.getItem('autobyteus.prototype.windowEntry')) || (officeAddress ? 'remote-office' : nodesScenario ? 'remote-docker' : 'remote-prototype') }),
    upsertNodeRegistry: async change => {
      if (change.type === 'add') registry = { version: registry.version + 1, nodes: [...registry.nodes, change.node] }
      if (change.type === 'remove') registry = { version: registry.version + 1, nodes: registry.nodes.filter(node => node.id !== change.entryId) }
      if (change.type === 'rename') registry = { version: registry.version + 1, nodes: registry.nodes.map(node => node.id === change.entryId ? { ...node, name: change.name, updatedAt: '2026-08-22T04:10:00.000Z' } : node) }
      if (change.type === 'identify') registry = { version: registry.version + 1, nodes: registry.nodes.map(node => node.id === change.entryId ? { ...node, nodeId: change.nodeId } : node) }
      if (change.type === 'set-auto-update') {
        if (scenario === 'nodes_auto_save_fails') throw new Error('The node list could not be saved.')
        registry = { version: registry.version + 1, nodes: registry.nodes.map(node => node.id === change.entryId ? { ...node, autoUpdate: Boolean(change.enabled) } : node) }
      }
      if (change.type === 'remove') { connectedEntries.delete(change.entryId); delete autoUpdates[change.entryId] }
      emit('node', registry)
      emit('access', accessStates())
      if (change.type === 'set-auto-update' && change.enabled) void checkNodeForAutoUpdate(change.entryId)
      return structuredClone(registry)
    },
    getNodeRegistrySnapshot: async () => structuredClone(registry), onNodeRegistryUpdated: callback => cleanup(listeners.node, callback),
    getBrowserShellSnapshot: async () => structuredClone(browser),
    openBrowserTab: async request => setBrowser({ activeTabId: 'browser-tab-2', sessions: [...browser.sessions, { tab_id: 'browser-tab-2', title: request.title || 'New tab', url: request.url || 'about:blank', deviceEmulation: { mode: 'desktop', profile: null } }] }),
    navigateBrowserTab: async request => setBrowser({ sessions: browser.sessions.map(tab => tab.tab_id === request.browserSessionId || tab.tab_id === request.tabId ? { ...tab, url: request.url, title: request.url } : tab) }),
    reloadBrowserTab: async () => structuredClone(browser), focusBrowserTab: async id => setBrowser({ activeTabId: id }), setActiveBrowserTab: async id => setBrowser({ activeTabId: id }),
    updateBrowserHostBounds: async () => structuredClone(browser), setBrowserDeviceEmulation: async () => structuredClone(browser),
    closeBrowserShellSession: async id => setBrowser({ activeTabId: browser.activeTabId === id ? null : browser.activeTabId, sessions: browser.sessions.filter(tab => tab.tab_id !== id) }),
    onBrowserShellSnapshotUpdated: callback => cleanup(listeners.browser, callback),
    getAppUpdateState: async () => structuredClone(update),
    // A pressed "Check for Updates" works with automatic checks off; it reports the true result and time.
    checkForAppUpdates: async () => ['update_up_to_date', 'update_checks_off', 'update_check_failed'].includes(scenario)
      ? setUpdate({ status: 'no-update', availableVersion: null, errorKind: null, errorOperation: null, message: '', checkedAt: new Date().toISOString() })
      : setUpdate({ status: 'available', availableVersion: '0.2.0-prototype', releaseNotes: 'Synthetic review update.', checkedAt: new Date().toISOString() }),
    downloadAppUpdate: async () => {
      if (!update.notification) return setUpdate({ status: 'downloaded', downloadPercent: 100, downloadTransferredBytes: 1024, downloadTotalBytes: 1024, message: 'Update downloaded.' })
      const started = setUpdate({ status: 'downloading', downloadPercent: 0, downloadTransferredBytes: 0, downloadTotalBytes: 1024, message: '' })
      for (let step = 1; step <= 5; step += 1) {
        setTimeout(() => setUpdate(step < 5
          ? { status: 'downloading', downloadPercent: step * 20, downloadTransferredBytes: step * 205, downloadTotalBytes: 1024 }
          : { status: 'downloaded', downloadPercent: 100, downloadTransferredBytes: 1024, downloadTotalBytes: 1024, message: 'Update downloaded.' }), step * 500)
      }
      return started
    },
    setAppUpdateAutoCheck: async settings => {
      const next = { ...update.autoCheck, ...settings }
      const valid = Number.isInteger(next.intervalMinutes) && next.intervalMinutes >= 15 && next.intervalMinutes <= 1440
      if (!valid) return { accepted: false, state: structuredClone(update) }
      return { accepted: true, state: setUpdate({ autoCheck: next }) }
    },
    setAppUpdateAutomatic: async enabled => {
      if (typeof enabled !== 'boolean') return { accepted: false, persisted: false, state: structuredClone(update) }
      return { accepted: true, persisted: true, state: setUpdate({ automaticUpdate: enabled }) }
    },
    markAppUpdateNotificationRead: async () => setUpdate({ notification: update.notification ? { ...update.notification, read: true } : null }),
    clearAppUpdateNotification: async () => setUpdate({ notification: null }),
    installAppUpdateAndRestart: async () => ({ accepted: true }), onAppUpdateState: callback => cleanup(listeners.update, callback),
    getLogFilePath: async () => '/synthetic/logs/autobyteus-server.log', openLogFile: async () => ({ success: true }), openExternalLink: async () => ({ success: true }),
    readLogFile: async () => ({ success: true, content: '[04:00:00] Synthetic Agent Server ready\n[04:00:01] Listening on deterministic fixture boundary', filePath: '/synthetic/logs/autobyteus-server.log' }),
    readLocalTextFile: async () => ({ success: true, content: 'Synthetic local text content.' }), getPlatform: async () => 'linux', getAppLocale: async () => 'en',
    onAppQuitting: callback => cleanup(listeners.quitting, callback), startShutdown: () => {}, resetServerData: async () => ({ success: true }),
    showFolderDialog: async () => ({ canceled: false, path: '/synthetic/selected-folder' }), getPathForFile: async file => `/synthetic/${file.name}`,
    getExtensionsState: async () => structuredClone(extensions),
    // extensions-nodes-baseline-refresh-516: an install plays the desktop's visible steps (about 6 s; the store polls the state) and then
    // resolves installed. Nothing is downloaded.
    installExtension: async () => { await playInstall(); return extensionResult({ status: 'installed', enabled: true, message: 'Voice input is ready.', lastError: null, installProgress: null, runtimeVersion: '1.0.0-prototype', modelVersion: 'tiny-prototype', backendKind: 'faster-whisper', installedAt: checkedAt }) },
    enableExtension: async () => extensionResult({ enabled: true }), disableExtension: async () => extensionResult({ enabled: false }),
    updateVoiceInputSettings: async (_id, payload) => extensionResult({ settings: { ...extensions[0].settings, ...payload } }),
    removeExtension: async () => extensionResult({ status: 'not-installed', enabled: false, runtimeVersion: null, modelVersion: null, backendKind: null, installedAt: null }),
    reinstallExtension: async () => { await playInstall(); return extensionResult({ status: 'installed', enabled: true, message: 'Voice input is ready.', lastError: null, installProgress: null }) },
    openExtensionFolder: async () => ({ success: true }), transcribeVoiceInput: async () => ({ ok: true, text: 'Synthetic transcription.', detectedLanguage: 'en', noSpeech: false, error: null }),
  }
  window.__AUTOBYTEUS_HOST_MOCK__ = {
    context, scenario, get server() { return structuredClone(server) },
    setServerStatus(status, message = '') { return setServer({ status, message }) },
    requestShutdown() { listeners.quitting.forEach(callback => callback()) },
    recoverServer() { return setServer({ status: 'running', message: '' }) },
  }
  return window.__AUTOBYTEUS_HOST_MOCK__
}
