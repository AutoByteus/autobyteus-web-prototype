// WEB-BASELINE-REFRESH-012 (origin/personal@9e7a458): the node-side state behind three Settings areas the source
// added after 9227d61, as one small in-memory "server" state per caller (`state.nodeSettings`), reset with the scenario.
// The observation node (mock-node.mjs) and the baseline (utils/apolloClient.ts) both answer from here, so both sides
// show the same scripted outcome. Nothing is checked, downloaded, installed or contacted; every value is invented.
//
// - Notification Center and "Update checks" (autobyteus-209): `GetUpdateNotifications`, `MarkUpdateNotificationsRead`,
//   `ClearUpdateNotification`, `GetUpdateChecksCapability`, `SetUpdateChecksEnabled`. Updating a package or a skill
//   source (the source's own existing mutations) marks its notification handled.
// - Settings → Agent Runtimes (runtime-lifecycle-review): `AgentRuntimes` and its four mutations. Work moves one step
//   per read of `AgentRuntimes`, so the observation node and the baseline advance alike.
// - update-checks-and-auto-updates (autobyteus-210, design-only): a fourth category (`AGENT_RUNTIME`, the desktop's own node),
//   automatic outcomes on the notifications (`outcome`), the node's check intervals and automatic-update switches
//   (`GetUpdateAutomationSettings`, `SetUpdateAutomationSettings`), and a scripted timeline: turning a switch on applies
//   the waiting updates of that kind a few seconds later (the product does it within about a minute).
// - (Nodes → Remote Collaboration was merged into Manage Nodes by one-nodes-tab; its simulation is prototype/nodes/nodeWorld.ts.)

const HOUR = 3_600_000
const hoursAgo = (hours) => new Date(Date.now() - hours * HOUR).toISOString()
const sha = (seed) => (seed.repeat(10) + '0000000000000000000000000000000000000000').slice(0, 40)
const failure = (message, code) => ({ __projectError: { message, extensions: { code } } })

export const NODE_SETTINGS_MUTATIONS = new Set([
  'MarkUpdateNotificationsRead', 'ClearUpdateNotification', 'SetUpdateChecksEnabled', 'SetUpdateAutomationSettings', 'UpdateAgentPackage',
  'CheckAgentRuntimes', 'UpdateAgentRuntime', 'StartAgentRuntimeSignIn', 'CancelAgentRuntimeSignIn',
])

// ---------------------------------------------------------------- Notification Center
const notification = (fields) => ({
  __typename: 'UpdateNotification', defaultBranch: 'main', read: false, state: 'WAITING', handledRevision: null, handledAt: null,
  outcome: null, outcomeReason: null, runningAgentCount: 0, autoScript: 'updated', ...fields,
})
const source = (kind, sourceId, name, repo, seed, latest, hours, extra = {}) => notification({
  kind, sourceId, name, repositoryUrl: `https://github.com/synthetic-org/${repo}`, installedRevision: sha(seed), latestRevision: sha(latest), foundAt: hoursAgo(hours), ...extra,
})
const waitingNotifications = () => [
  source('AGENT_PACKAGE', 'package-research-pack', 'Research Pack', 'research-pack', 'a1b2c3d4', '9f8e7d6c', 3),
  source('AGENT_PACKAGE', 'package-docs-pack', 'Docs Pack With A Rather Long Name For A Package', 'docs-pack-with-a-rather-long-name-for-a-package', '0a1b2c3d', 'e8f9a0b1', 30, { read: true, autoScript: 'failed' }),
  // Same repository and revisions as the Skill Sources dialog's "review-skills" source (fixtures.mjs).
  notification({ kind: 'SKILL_SOURCE', sourceId: 'github-review-skills', name: 'review-skills', repositoryUrl: 'https://github.com/synthetic-org/review-skills',
    installedRevision: '9a8b7c6d5e4f30211203', latestRevision: 'c0ffee1234abcd567890', foundAt: hoursAgo(5), autoScript: 'local' }),
  notification({ kind: 'SKILL_SOURCE', sourceId: 'github-docs-skills', name: 'docs-skills', repositoryUrl: 'https://github.com/synthetic-org/docs-skills',
    installedRevision: '1f2e3d4c5b6a79880716', latestRevision: '1f2e3d4c5b6a79880716', foundAt: hoursAgo(75), read: true, state: 'HANDLED',
    handledRevision: '1f2e3d4c5b6a79880716', handledAt: hoursAgo(70) }),
]
const manyNotifications = () => [
  ...waitingNotifications(),
  ...['data-wrangling', 'video-production', 'customer-support'].map((slug, index) => source('AGENT_PACKAGE', `package-${slug}`, `${slug}-pack`, `${slug}-pack`, `${index}1${index}2${index}3`, `${index}9${index}8${index}7`, 8 + index * 9, { read: index > 0 })),
  ...['writing', 'browser-automation'].map((slug, index) => source('SKILL_SOURCE', `github-${slug}-skills`, `${slug}-skills`, `${slug}-skills`, `${index}4${index}5${index}6`, `${index}6${index}5${index}4`, 12 + index * 8)),
]
const oneNotification = () => [source('AGENT_PACKAGE', 'package-research-pack', 'Research Pack', 'research-pack', 'a1b2c3d4', '9f8e7d6c', 3)]

// autobyteus-210: the outcomes of automatic updates, as the node would have recorded them (every value invented).
const REASON_ARCHIVE = 'GitHub answered 502 while downloading the repository archive.'
const REASON_VENDOR = 'synthetic-agy update: could not write to /usr/local/bin. Permission denied.'
const autoUpdated = (fields) => ({ state: 'HANDLED', read: false, outcome: 'AUTO_UPDATED', handledRevision: fields.latestRevision, handledAt: hoursAgo(1), ...fields })
const outcomeNotifications = () => [
  // packages: updated automatically (unread), failed, local changes
  source('AGENT_PACKAGE', 'package-research-pack', 'Research Pack', 'research-pack', 'a1b2c3d4', '9f8e7d6c', 3, autoUpdated({ latestRevision: sha('9f8e7d6c'), foundAt: hoursAgo(1.2), handledAt: hoursAgo(1) })),
  source('AGENT_PACKAGE', 'package-docs-pack', 'Docs Pack With A Rather Long Name For A Package', 'docs-pack-with-a-rather-long-name-for-a-package', '0a1b2c3d', 'e8f9a0b1', 2,
    { outcome: 'AUTO_FAILED', outcomeReason: REASON_ARCHIVE, autoScript: 'failed' }),
  source('AGENT_PACKAGE', 'package-data-wrangling', 'data-wrangling-pack', 'data-wrangling-pack', '3c4d5e6f', '7a8b9c0d', 4, { outcome: 'AUTO_SKIPPED_LOCAL_CHANGES', autoScript: 'local' }),
  // skill sources: local changes; an older automatic update, already seen
  notification({ kind: 'SKILL_SOURCE', sourceId: 'github-review-skills', name: 'review-skills', repositoryUrl: 'https://github.com/synthetic-org/review-skills',
    installedRevision: '9a8b7c6d5e4f30211203', latestRevision: 'c0ffee1234abcd567890', foundAt: hoursAgo(5), outcome: 'AUTO_SKIPPED_LOCAL_CHANGES', autoScript: 'local' }),
  notification({ kind: 'SKILL_SOURCE', sourceId: 'github-docs-skills', name: 'docs-skills', repositoryUrl: 'https://github.com/synthetic-org/docs-skills',
    installedRevision: '0d1e2f3a4b5c69788695', latestRevision: '1f2e3d4c5b6a79880716', foundAt: hoursAgo(75), read: true, state: 'HANDLED', outcome: 'AUTO_UPDATED',
    handledRevision: '1f2e3d4c5b6a79880716', handledAt: hoursAgo(74) }),
]
export const UPDATE_SCENARIOS = new Set(['updates_waiting', 'updates_many', 'updates_one', 'updates_off', 'updates_auto_on', 'updates_outcomes_only', 'updates_backoff', 'updates_discover'])
/** Scenarios whose Agent Runtimes page also has newer versions (the runtime category of the Notification Center). */
const RUNTIME_UPDATE_SCENARIOS = new Set(['updates_waiting', 'updates_many', 'updates_off', 'updates_auto_on', 'updates_backoff'])

// ---------------------------------------------------------------- Agent Runtimes
const RUNTIME_ORDER = ['codex_app_server', 'claude_agent_sdk', 'antigravity_cli', 'grok_build']
const INSTALL_URL = {
  codex_app_server: 'https://example.invalid/install/codex', claude_agent_sdk: 'https://example.invalid/install/claude',
  antigravity_cli: 'https://example.invalid/install/antigravity', grok_build: 'https://example.invalid/install/grok',
}
const UPDATE_COMMAND = {
  codex_app_server: 'synthetic-codex update', claude_agent_sdk: 'synthetic-claude update', antigravity_cli: 'synthetic-agy update', grok_build: 'synthetic-grok update',
}
const UPDATE_STEPS = ['Resolving the latest version', 'Downloading the update', 'Installing the update']
// Reads a check needs before a runtime's answer arrives (the vendor sources answer one by one).
const CHECK_READS = { codex_app_server: 1, claude_agent_sdk: 2, antigravity_cli: 2, grok_build: 2 }
const SIGN_IN_READS = 3
const runtime = (kind, fields) => ({
  kind, installed: true, version: null, latest: null, checkFails: false, updateFails: false, account: 'SIGNED_IN', route: 'BROWSER', agents: 0,
  checking: 0, updatesState: 'NOT_CHECKED', accountState: 'UNKNOWN', checkedAt: null, operation: null, signInFails: false, ...fields,
})
const runtimeRows = (scenario) => {
  const rows = [
    runtime('codex_app_server', { version: '0.163.0', latest: '0.163.0', account: 'SIGNED_IN', route: 'BROWSER' }),
    runtime('claude_agent_sdk', { version: '2.1.302', latest: '2.1.304', account: 'SIGNED_IN', route: 'COMMAND_LINE' }),
    runtime('antigravity_cli', { version: '1.4.3', latest: '1.4.3', account: 'SIGNED_OUT', route: 'COMMAND_LINE' }),
    runtime('grok_build', { installed: false, account: 'NOT_APPLICABLE', route: 'BROWSER' }),
  ]
  const row = (kind) => rows.find(item => item.kind === kind)
  if (scenario === 'runtimes_mixed') {
    Object.assign(row('codex_app_server'), { installed: false, version: null, latest: null, account: 'NOT_APPLICABLE' })
    Object.assign(row('claude_agent_sdk'), { agents: 2 })
    Object.assign(row('antigravity_cli'), { checkFails: true, account: 'UNKNOWN' })
    Object.assign(row('grok_build'), { installed: true, version: '1.0.62', latest: '1.0.62', account: 'SIGNED_OUT', route: 'BROWSER' })
  }
  if (scenario === 'runtimes_blocked') {
    Object.assign(row('codex_app_server'), { latest: '0.164.0', agents: 1 })
    Object.assign(row('claude_agent_sdk'), { agents: 3 })
  }
  // autobyteus-210: the update scenarios have newer runtime versions too (Codex free to update, Claude with running agents).
  if (RUNTIME_UPDATE_SCENARIOS.has(scenario)) {
    Object.assign(row('codex_app_server'), { version: '0.163.0', latest: '0.164.0', agents: 0 })
    Object.assign(row('claude_agent_sdk'), { agents: 2 })
    if (scenario === 'updates_auto_on') {
      // Codex was updated automatically an hour ago; Antigravity's automatic update failed.
      Object.assign(row('codex_app_server'), { version: '0.164.0', latest: '0.164.0' })
      Object.assign(row('antigravity_cli'), { version: '1.4.3', latest: '1.4.4', updateFails: true })
    }
  }
  if (RUNTIME_UPDATE_SCENARIOS.has(scenario)) {
    // The node's periodic check has already read each runtime's newest version (REQ-020).
    for (const item of rows) if (item.installed && item.latest) Object.assign(item, { updatesState: item.latest !== item.version ? 'UPDATE_AVAILABLE' : 'UP_TO_DATE', accountState: item.account, checkedAt: hoursAgo(0.3) })
  }
  if (scenario === 'runtimes_update_fails') Object.assign(row('claude_agent_sdk'), { updateFails: true })
  if (scenario === 'runtimes_sign_in_fails') Object.assign(row('codex_app_server'), { account: 'SIGNED_OUT', signInFails: true })
  return rows
}
const failedUpdateOutput = (kind) => `${UPDATE_COMMAND[kind]}: step 3 of 3 failed\nThe installer exited with code 1.\nNothing was changed.`

const resolveRow = (item) => {
  item.checking = 0
  item.checkedAt = new Date().toISOString()
  if (item.checkFails) { item.updatesState = 'CHECK_FAILED'; item.accountState = item.account === 'UNKNOWN' ? 'UNKNOWN' : item.account; return }
  item.updatesState = item.latest && item.latest !== item.version ? 'UPDATE_AVAILABLE' : 'UP_TO_DATE'
  item.accountState = item.account
}
/** One step of the running checks, updates and sign-ins (one per read of `AgentRuntimes`). */
const advanceRuntimes = (ns) => {
  for (const item of ns.runtimes.rows) {
    if (item.checking > 0) { item.checking -= 1; if (item.checking === 0) resolveRow(item) }
    const operation = item.operation
    if (operation?.state !== 'RUNNING') continue
    operation.steps += 1
    if (operation.kind === 'UPDATE') {
      if (operation.steps <= UPDATE_STEPS.length) { operation.step = UPDATE_STEPS[operation.steps - 1]; continue }
      if (item.updateFails) item.operation = { ...operation, state: 'FAILED', step: null, error: failedUpdateOutput(item.kind) }
      else {
        const to = operation.toVersion
        Object.assign(item, { version: to, updatesState: 'UP_TO_DATE', checkedAt: new Date().toISOString() })
        item.operation = { ...operation, state: 'SUCCEEDED', step: null }
        // autobyteus-210: a successful update from the Notification Center (or a pass) handles the runtime's notification.
        const note = ns.notifications.find(entry => entry.kind === 'AGENT_RUNTIME' && entry.sourceId === item.kind)
        if (note && note.state === 'WAITING') Object.assign(note, { state: 'HANDLED', read: true, outcome: operation.automatic ? 'AUTO_UPDATED' : null, handledRevision: to, handledAt: new Date().toISOString() })
      }
    } else if (operation.steps >= SIGN_IN_READS) {
      if (item.signInFails) item.operation = { kind: 'SIGN_IN', state: 'DID_NOT_FINISH', command: null, step: null, fromVersion: null, toVersion: null, error: null, steps: 0 }
      else { item.account = 'SIGNED_IN'; item.accountState = 'SIGNED_IN'; item.operation = null }
    }
  }
}
const runtimeView = (item) => ({
  __typename: 'AgentRuntime', runtimeKind: item.kind, installed: item.installed, installedVersion: item.installed ? item.version : null,
  updates: { __typename: 'AgentRuntimeUpdates', state: item.installed ? item.checking > 0 ? 'CHECKING' : item.updatesState : 'NOT_CHECKED', latestVersion: item.installed && item.updatesState === 'UPDATE_AVAILABLE' ? item.latest : null },
  account: { __typename: 'AgentRuntimeAccount', state: !item.installed ? 'NOT_APPLICABLE' : item.checking > 0 ? 'CHECKING' : item.accountState },
  signInRoute: item.route, installInstructionsUrl: INSTALL_URL[item.kind], runningAgentCount: item.agents,
  operation: item.operation ? { __typename: 'AgentRuntimeOperation', kind: item.operation.kind, state: item.operation.state, command: item.operation.command, step: item.operation.step,
    fromVersion: item.operation.fromVersion, toVersion: item.operation.toVersion, error: item.operation.error } : null,
  checkedAt: item.checkedAt,
})

// ---------------------------------------------------------------- state
const RUNTIME_NAMES = { codex_app_server: 'Codex', claude_agent_sdk: 'Claude', antigravity_cli: 'Antigravity', grok_build: 'Grok' }
/** The runtime category's notifications: one per installed runtime whose newest version is newer (REQ-020). */
const runtimeNotifications = (rows, scenario) => rows
  .filter(item => item.installed && item.latest && item.version && item.latest !== item.version)
  .map((item) => {
    const base = notification({ kind: 'AGENT_RUNTIME', sourceId: item.kind, name: RUNTIME_NAMES[item.kind], repositoryUrl: '', defaultBranch: null,
      installedRevision: item.version, latestRevision: item.latest, foundAt: hoursAgo(item.kind === 'codex_app_server' ? 1.5 : 6), read: item.kind !== 'codex_app_server' && scenario !== 'updates_auto_on', runningAgentCount: item.agents })
    if (scenario === 'updates_auto_on') {
      if (item.kind === 'claude_agent_sdk') return { ...base, outcome: 'AUTO_WAITING', read: true }
      if (item.kind === 'antigravity_cli') return { ...base, outcome: 'AUTO_FAILED', outcomeReason: REASON_VENDOR, foundAt: hoursAgo(3), read: false }
    }
    return base
  })
const automationDefaults = (scenario) => ({
  packageIntervalMinutes: 30, skillIntervalMinutes: 30, runtimeIntervalMinutes: 60,
  autoUpdatePackages: ['updates_auto_on', 'updates_off', 'updates_outcomes_only'].includes(scenario), autoUpdateSkills: scenario === 'updates_auto_on', autoUpdateRuntimes: scenario === 'updates_auto_on',
  waitUntil: scenario === 'updates_backoff' ? new Date(Date.now() + 23 * 60_000).toISOString() : null,
})
const nodeSettingsState = (state) => {
  if (state.nodeSettings) return state.nodeSettings
  const scenario = state.scenario
  const runtimes = { rows: runtimeRows(scenario), reads: 0 }
  const sources = scenario === 'updates_many' ? manyNotifications() : scenario === 'updates_auto_on' ? outcomeNotifications()
    : scenario === 'updates_outcomes_only' ? [outcomeNotifications()[0]]
      : scenario === 'updates_waiting' || scenario === 'updates_off' || scenario === 'updates_backoff' ? waitingNotifications()
        : UPDATE_SCENARIOS.has(scenario) ? oneNotification() : []
  state.nodeSettings = {
    notifications: [...sources, ...(RUNTIME_UPDATE_SCENARIOS.has(scenario) ? runtimeNotifications(runtimes.rows, scenario) : [])],
    updateChecksEnabled: scenario !== 'updates_off', updateChecksSet: false, failOncePackages: new Set(['package-docs-pack']),
    automation: automationDefaults(scenario), timers: {},
    runtimes,
  }
  // autobyteus-210: a check finds an update some seconds after the page opened (the node's pass found it).
  if (scenario === 'updates_discover') {
    setTimeout(() => {
      state.nodeSettings.notifications.push(source('AGENT_PACKAGE', 'package-research-pack', 'Research Pack', 'research-pack', 'a1b2c3d4', '9f8e7d6c', 0.05))
      notifyChanged()
    }, 7000)
  }
  return state.nodeSettings
}
/** The window reads again (the product's change feed: `update_notifications_changed`). */
const notifyChanged = () => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('prototype-update-notifications-changed')) }
const find = (ns, kind, sourceId) => ns.notifications.find(item => item.kind === kind && item.sourceId === sourceId)
/** An update of a package or skill source ran (their existing mutations): its waiting notification is handled. */
export const markNotificationHandled = (state, kind, sourceId) => {
  const item = find(nodeSettingsState(state), kind, sourceId)
  if (item && item.state === 'WAITING') Object.assign(item, { state: 'HANDLED', read: true, outcome: null, outcomeReason: null, handledRevision: item.latestRevision, handledAt: new Date().toISOString() })
}
const AUTO_DELAY_MS = 3500
const KIND_OF_SETTING = { autoUpdatePackages: 'AGENT_PACKAGE', autoUpdateSkills: 'SKILL_SOURCE', autoUpdateRuntimes: 'AGENT_RUNTIME' }
/** The node's pass applies the waiting updates of a kind (scripted per source: updated, failed, or local changes). */
const applyAutomatic = (ns, kind) => {
  const settingOn = Object.entries(KIND_OF_SETTING).some(([setting, k]) => k === kind && ns.automation[setting])
  if (!settingOn || !ns.updateChecksEnabled) return
  for (const item of ns.notifications.filter(entry => entry.kind === kind && entry.state === 'WAITING')) {
    const at = new Date().toISOString()
    if (item.autoScript === 'local') Object.assign(item, { outcome: 'AUTO_SKIPPED_LOCAL_CHANGES', outcomeReason: null, read: false })
    else if (item.autoScript === 'failed') Object.assign(item, { outcome: 'AUTO_FAILED', outcomeReason: REASON_ARCHIVE, read: false })
    else if (kind === 'AGENT_RUNTIME') {
      const row = ns.runtimes.rows.find(entry => entry.kind === item.sourceId)
      if (row && row.agents > 0) Object.assign(item, { outcome: 'AUTO_WAITING', outcomeReason: null, runningAgentCount: row.agents })
      else if (row && row.operation?.state !== 'RUNNING') {
        row.operation = { kind: 'UPDATE', state: 'RUNNING', command: UPDATE_COMMAND[row.kind], step: null, fromVersion: row.version, toVersion: row.latest, error: null, steps: 0, automatic: true }
        // The vendor update runs on the node; the window learns of its end through the feed.
        const timer = setInterval(() => { advanceRuntimes(ns); if (row.operation?.state !== 'RUNNING') { clearInterval(timer); notifyChanged() } }, 700)
      }
    } else Object.assign(item, { state: 'HANDLED', read: false, outcome: 'AUTO_UPDATED', outcomeReason: null, handledRevision: item.latestRevision, handledAt: at })
  }
  notifyChanged()
}
/** Turning a switch on applies what already waits soon after (REQ-006; the product: within about a minute). */
const scheduleAutomatic = (ns, kind) => {
  clearTimeout(ns.timers[kind])
  ns.timers[kind] = setTimeout(() => applyAutomatic(ns, kind), AUTO_DELAY_MS)
}
/** `UpdateAgentPackage`: the package update; one package's first update fails (scripted), a retry succeeds. */
export const agentPackageUpdate = (state, packageId, packages) => {
  const ns = nodeSettingsState(state)
  if (ns.failOncePackages.has(packageId) && find(ns, 'AGENT_PACKAGE', packageId)?.state === 'WAITING') {
    ns.failOncePackages.delete(packageId)
    return failure('Synthetic update failed: the repository archive could not be read.', 'AGENT_PACKAGE_UPDATE_FAILED')
  }
  markNotificationHandled(state, 'AGENT_PACKAGE', packageId)
  return { updateAgentPackage: packages }
}

const RUNTIME_ID = 'runtimeKind'

/** The Settings answers of this file, or `undefined` when the operation is not one of them. */
export const nodeSettingsOperation = (operationName, variables, state) => {
  const ns = (() => { switch (operationName) {
    case 'GetUpdateNotifications': case 'MarkUpdateNotificationsRead': case 'ClearUpdateNotification': case 'GetUpdateChecksCapability': case 'SetUpdateChecksEnabled':
    case 'GetUpdateAutomationSettings': case 'SetUpdateAutomationSettings':
    case 'AgentRuntimes': case 'CheckAgentRuntimes': case 'UpdateAgentRuntime': case 'StartAgentRuntimeSignIn': case 'CancelAgentRuntimeSignIn':
      return nodeSettingsState(state)
    default: return null
  } })()
  if (!ns) return undefined
  const list = () => structuredClone(ns.notifications)
  switch (operationName) {
    case 'GetUpdateNotifications': return { updateNotifications: list() }
    case 'MarkUpdateNotificationsRead':
      for (const item of ns.notifications) if (item.state === 'WAITING' || item.outcome === 'AUTO_UPDATED') item.read = true
      return { markUpdateNotificationsRead: list() }
    case 'ClearUpdateNotification':
      ns.notifications = ns.notifications.filter(item => !(item.kind === variables.kind && item.sourceId === variables.sourceId && item.state === 'HANDLED'))
      return { clearUpdateNotification: list() }
    case 'GetUpdateChecksCapability':
      return { updateChecksCapability: { __typename: 'UpdateChecksCapability', enabled: ns.updateChecksEnabled, settingKey: 'ENABLE_UPDATE_CHECKS', source: ns.updateChecksSet ? 'SERVER_SETTING' : 'DEFAULT_ENABLED' } }
    case 'SetUpdateChecksEnabled':
      ns.updateChecksEnabled = Boolean(variables.enabled); ns.updateChecksSet = true
      if (ns.updateChecksEnabled) for (const [setting, kind] of Object.entries(KIND_OF_SETTING)) if (ns.automation[setting]) scheduleAutomatic(ns, kind)
      return { setUpdateChecksEnabled: { __typename: 'UpdateChecksCapability', enabled: ns.updateChecksEnabled, settingKey: 'ENABLE_UPDATE_CHECKS', source: 'SERVER_SETTING' } }

    case 'GetUpdateAutomationSettings': return { updateAutomationSettings: { __typename: 'UpdateAutomationSettings', ...ns.automation } }
    case 'SetUpdateAutomationSettings': {
      const input = variables.input || {}
      for (const key of ['packageIntervalMinutes', 'skillIntervalMinutes', 'runtimeIntervalMinutes']) {
        if (input[key] !== undefined && !(Number.isInteger(input[key]) && input[key] >= 15 && input[key] <= 1440)) return failure('Enter an interval from 15 minutes to 24 hours.', 'INVALID_UPDATE_INTERVAL')
      }
      const before = { ...ns.automation }
      Object.assign(ns.automation, Object.fromEntries(Object.entries(input).filter(([key, value]) => key in before && value !== undefined)))
      for (const [setting, kind] of Object.entries(KIND_OF_SETTING)) {
        if (ns.automation[setting] && !before[setting]) scheduleAutomatic(ns, kind)
        if (!ns.automation[setting] && before[setting]) clearTimeout(ns.timers[kind])
      }
      return { setUpdateAutomationSettings: { __typename: 'UpdateAutomationSettings', ...ns.automation } }
    }
    case 'AgentRuntimes': {
      const rt = ns.runtimes
      rt.reads += 1
      if (state.scenario === 'runtimes_load_failed' && rt.reads === 1) return failure('Synthetic agent runtimes read failure.', 'AGENT_RUNTIMES_READ_FAILED')
      advanceRuntimes(ns)
      return { agentRuntimes: RUNTIME_ORDER.map(kind => runtimeView(rt.rows.find(item => item.kind === kind))) }
    }
    case 'CheckAgentRuntimes':
      for (const item of ns.runtimes.rows) if (item.installed && item.checking === 0 && item.operation?.state !== 'RUNNING') item.checking = CHECK_READS[item.kind]
      return { checkAgentRuntimes: true }
    case 'UpdateAgentRuntime': {
      const item = ns.runtimes.rows.find(row => row.kind === variables[RUNTIME_ID])
      // Refused while the runtime's agents run or another operation runs: nothing starts.
      if (!item || !item.installed || item.agents > 0 || item.operation?.state === 'RUNNING') return { updateAgentRuntime: false }
      if (item.updatesState !== 'UPDATE_AVAILABLE' && item.operation?.state !== 'FAILED') return { updateAgentRuntime: false }
      item.operation = { kind: 'UPDATE', state: 'RUNNING', command: UPDATE_COMMAND[item.kind], step: null, fromVersion: item.version, toVersion: item.latest, error: null, steps: 0 }
      return { updateAgentRuntime: true }
    }
    case 'StartAgentRuntimeSignIn': {
      const item = ns.runtimes.rows.find(row => row.kind === variables[RUNTIME_ID])
      if (!item || !item.installed || item.operation?.state === 'RUNNING' || item.route !== 'BROWSER') return { startAgentRuntimeSignIn: false }
      item.operation = { kind: 'SIGN_IN', state: 'RUNNING', command: null, step: null, fromVersion: null, toVersion: null, error: null, steps: 0 }
      return { startAgentRuntimeSignIn: true }
    }
    case 'CancelAgentRuntimeSignIn': {
      const item = ns.runtimes.rows.find(row => row.kind === variables[RUNTIME_ID])
      if (item?.operation?.kind === 'SIGN_IN' && item.operation.state === 'RUNNING') item.operation = null
      return { cancelAgentRuntimeSignIn: true }
    }

    default: return undefined
  }
}
