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
  const listeners = { server: new Set(), node: new Set(), update: new Set(), browser: new Set(), quitting: new Set() }
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
  const entry = (id, name, baseUrl, serverInstanceId) => ({ id, name, baseUrl, nodeType: 'remote', serverInstanceId, isSystem: false, createdAt: '2026-10-20T09:00:00.000Z', updatedAt: '2026-10-20T09:00:00.000Z' })
  const nodesRegistry = [
    { id: 'embedded-local', name: 'Embedded Node', baseUrl: 'http://127.0.0.1:29695', nodeType: 'embedded', serverInstanceId: 'srv_m9VFq2Lw', isSystem: true, createdAt: '2026-10-20T09:00:00.000Z', updatedAt: '2026-10-20T09:00:00.000Z' },
    entry('remote-docker', 'docker', 'http://localhost:8001', 'srv_ibJioK7n'),
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
      { id: 'embedded-local', name: 'Embedded Node', baseUrl, nodeType: 'embedded', capabilities: { terminal: true, fileExplorerStreaming: true }, capabilityProbeState: 'ready', isSystem: true, createdAt: '2026-08-22T04:00:00.000Z', updatedAt: '2026-08-22T04:00:00.000Z' },
      { id: 'remote-prototype', name: 'Prototype Remote Node', baseUrl, nodeType: 'remote', capabilities: { terminal: true, fileExplorerStreaming: true }, capabilityProbeState: 'ready', isSystem: false, createdAt: '2026-08-22T04:00:00.000Z', updatedAt: '2026-08-22T04:00:00.000Z' },
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
  const notifies = ['updates_waiting', 'updates_many'].includes(scenario)
  const hoursAgo = hours => new Date(Date.now() - hours * 3_600_000).toISOString()
  let update = {
    notification: notifies ? { version: '0.2.0-prototype', fromVersion: '0.1.0-prototype', foundAt: hoursAgo(2), read: false, state: 'waiting', handledVersion: null, releasePageUrl: 'https://github.com/synthetic-org/autobyteus-releases/releases/tag/v0.2.0-prototype' } : null,
    status: scenario === 'update_available' || notifies ? 'available' : scenario === 'update_error' ? 'error' : 'idle',
    currentVersion: '0.1.0-prototype', availableVersion: scenario === 'update_available' || notifies ? '0.2.0-prototype' : null,
    downloadPercent: null, downloadTransferredBytes: null, downloadTotalBytes: null,
    releaseNotes: scenario === 'update_available' || notifies ? 'Synthetic review update.' : null,
    message: scenario === 'update_error' ? 'Synthetic update service unavailable.' : '',
    errorKind: scenario === 'update_error' ? 'network' : null,
    errorOperation: scenario === 'update_error' ? 'manual-check' : null,
    checkedAt: scenario.startsWith('update_') ? checkedAt : null,
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

  window.electronAPI = {
    sendPing: () => {}, onPong: () => {},
    getServerStatus: async () => structuredClone(server),
    restartServer: async () => { setServer({ status: 'restarting', message: '' }); setTimeout(() => setServer({ status: 'running', message: '' }), 350); return structuredClone(server) },
    onServerStatus: callback => cleanup(listeners.server, callback),
    checkServerHealth: async () => server.status === 'running' ? { status: 'ok', data: { status: 'healthy' } } : server.status === 'error' ? { status: 'error', message: server.message } : { status: 'starting', message: 'Synthetic server is starting.' },
    openNodeWindow: async () => ({ windowId: 22, created: true }), focusNodeWindow: async () => ({ focused: true }), listNodeWindows: async () => [],
    getWindowContext: async () => ({ windowId: embedded ? 1 : 2, nodeId: embedded ? 'embedded-local' : nodesScenario ? 'remote-docker' : 'remote-prototype' }),
    upsertNodeRegistry: async change => {
      if (change.type === 'add') registry = { version: registry.version + 1, nodes: [...registry.nodes, change.node] }
      if (change.type === 'remove') registry = { version: registry.version + 1, nodes: registry.nodes.filter(node => node.id !== change.nodeId) }
      if (change.type === 'rename') registry = { version: registry.version + 1, nodes: registry.nodes.map(node => node.id === change.nodeId ? { ...node, name: change.name, updatedAt: '2026-08-22T04:10:00.000Z' } : node) }
      emit('node', registry); return structuredClone(registry)
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
    checkForAppUpdates: async () => setUpdate({ status: 'available', availableVersion: '0.2.0-prototype', releaseNotes: 'Synthetic review update.', checkedAt }),
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
    markAppUpdateNotificationRead: async () => setUpdate({ notification: update.notification ? { ...update.notification, read: true } : null }),
    clearAppUpdateNotification: async () => setUpdate({ notification: null }),
    installAppUpdateAndRestart: async () => ({ accepted: true }), onAppUpdateState: callback => cleanup(listeners.update, callback),
    getLogFilePath: async () => '/synthetic/logs/autobyteus-server.log', openLogFile: async () => ({ success: true }), openExternalLink: async () => ({ success: true }),
    readLogFile: async () => ({ success: true, content: '[04:00:00] Synthetic Agent Server ready\n[04:00:01] Listening on deterministic fixture boundary', filePath: '/synthetic/logs/autobyteus-server.log' }),
    readLocalTextFile: async () => ({ success: true, content: 'Synthetic local text content.' }), getPlatform: async () => 'linux', getAppLocale: async () => 'en',
    onAppQuitting: callback => cleanup(listeners.quitting, callback), startShutdown: () => {}, resetServerData: async () => ({ success: true }),
    showFolderDialog: async () => ({ canceled: false, path: '/synthetic/selected-folder' }), getPathForFile: async file => `/synthetic/${file.name}`,
    getExtensionsState: async () => structuredClone(extensions),
    installExtension: async () => extensionResult({ status: 'installed', enabled: true, message: 'Voice input is ready.', lastError: null, runtimeVersion: '1.0.0-prototype', modelVersion: 'tiny-prototype', backendKind: 'faster-whisper', installedAt: checkedAt }),
    enableExtension: async () => extensionResult({ enabled: true }), disableExtension: async () => extensionResult({ enabled: false }),
    updateVoiceInputSettings: async (_id, payload) => extensionResult({ settings: { ...extensions[0].settings, ...payload } }),
    removeExtension: async () => extensionResult({ status: 'not-installed', enabled: false, runtimeVersion: null, modelVersion: null, backendKind: null, installedAt: null }),
    reinstallExtension: async () => extensionResult({ status: 'installed', enabled: true, message: 'Voice input is ready.', lastError: null }),
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
