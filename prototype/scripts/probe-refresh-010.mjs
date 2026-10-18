#!/usr/bin/env node
// WEB-BASELINE-REFRESH-010 paired click-through probe for the surfaces changed between 73f7432 and
// origin/personal@2f21134: Task keys and "Depends on" on the board, Task page, editor and the tab's
// Task view (29ca564 and the task-keys work), delegated copies in a run's Settings with model change
// (3126536, 0fb29b6, cd685b6), the stop of a running copy in Settings and the sidebar (3126536,
// 14f9b3c, 61e20a0), the universal Team status dot (d1a66fe), collaborators removed (5dd930d),
// flat Teams (065430d), the skill update notice (28fdf1d), the Token Meter's per-call TPS card
// (cd28a00, 5fe746a) and the NFS guide (c57ab71). Same matched conditions and pass rule as
// probe-refresh-009.mjs. Design-only data is off on the baseline side.
// Usage: node probe-refresh-010.mjs [flow-id ...]
import { chromium } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { installHostScenario } from '../shared/install-host-scenario.js'
const require = createRequire(import.meta.url)
const icons = Object.fromEntries(['heroicons', 'ph', 'mdi', 'svg-spinners', 'vscode-icons', 'logos'].map(p => [p, require(`@iconify-json/${p}/icons.json`)]))
const root = resolve(new URL('../..', import.meta.url).pathname)
const SOURCE = process.env.SOURCE_BASE_URL || 'http://127.0.0.1:4622'
const PROTO = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4620'
const MOCK = process.env.MOCK_BASE_URL || 'http://127.0.0.1:4623'
const OUT = resolve(root, process.env.FLOW_DIR || 'evidence/WEB-BASELINE-REFRESH-010/flows')
const CHROME = process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const style = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'

const sel = (selector, index = 0) => async page => { await page.locator(selector).nth(index).click(); await page.waitForTimeout(700) }
const hover = selector => async page => { await page.locator(selector).first().hover(); await page.waitForTimeout(400) }

const wait = ms => async page => { await page.waitForTimeout(ms) }
const key = name => async page => { await page.keyboard.press(name); await page.waitForTimeout(400) }
const ensureWorkspaceOpen = async page => {
  if (!(await page.getByText('Product Review Team', { exact: true }).first().isVisible().catch(() => false))) {
    await page.getByText('prototype-workspace', { exact: true }).first().click(); await page.waitForTimeout(900)
  }
}
const openStoredAgentRun = async page => { await ensureWorkspaceOpen(page); await page.getByText('Research Assistant', { exact: true }).first().click(); await page.waitForTimeout(700); await page.getByText('Compare current navigation states', { exact: false }).first().click(); await page.waitForTimeout(1500) }
const openStoredTeamRun = async page => { await ensureWorkspaceOpen(page); for (const label of ['Product Review Team', 'Review the current prototype baseline']) { await page.getByText(label, { exact: true }).first().click(); await page.waitForTimeout(900) } }
const openTree = async page => { await ensureWorkspaceOpen(page); await page.getByText('Research Assistant', { exact: true }).first().click(); await page.waitForTimeout(1500) }
const NEW_CHAT_PLACEHOLDER = 'Ask anything · / for skills · @ for an agent or team'
const sendFirst = async page => { await page.getByPlaceholder(NEW_CHAT_PLACEHOLDER).first().click(); await page.keyboard.type('Summarize the synthetic baseline.', { delay: 20 }); await page.keyboard.press('Enter'); await page.waitForTimeout(2500) }
const openTokenTab = async page => { await page.locator('[data-test="right-side-tab-list"]').getByText(/^Token/).first().click(); await page.waitForTimeout(1200) }

const rightTab = name => async page => { await page.locator('[data-test="right-side-tab-list"]').getByText(name, { exact: true }).first().click(); await page.waitForTimeout(900) }
const PROJECT = '/projects/project-prototype-launch'
const typeIn = (selector, value) => async page => { await page.locator(selector).first().click(); await page.keyboard.type(value, { delay: 20 }); await page.waitForTimeout(500) }
const openCopyModel = async page => { await page.locator('[data-test="run-member-detail"]').first().getByRole('button', { name: /mock\/gpt-prototype/ }).first().click(); await page.waitForTimeout(700) }
const chooseReasoningModel = async page => { await page.getByText(/reasoning-prototype|Reasoning Prototype/).first().click(); await page.waitForTimeout(800) }
const editConfig = async page => { await page.getByRole('button', { name: 'Edit Config' }).first().click(); await page.waitForTimeout(1500) }
const expandMember = key => async page => { await page.locator(`[data-test="run-member-${key}"] [data-test="run-member-toggle"]`).first().click(); await page.waitForTimeout(700) }
// The TPS value is live-session state (each model call's server-measured TPS on the run's stream). As
// for the compaction note, the same report is applied through the source's own store on both sides.
const reportTps = (method = 'generation') => async page => {
  const applied = await page.evaluate((how) => {
    const pinia = document.querySelector('#__nuxt')?.__vue_app__?.config?.globalProperties?.$pinia
    const runId = pinia?._s.get('activeContext')?.activeAgentContext?.state?.runId
    const store = pinia?._s.get('tokenUsageMeter')
    if (!runId || !store?.applyTokenUsageUpdated) return false
    store.applyTokenUsageUpdated({ usage_event_id: 'tps-probe-1', idempotency_key: 'tps-probe-1', run_id: runId, model_identifier: 'mock/gpt-prototype', output_throughput: { method: how, output_tokens: 412, duration_ms: 5150 } })
    return true
  }, method)
  if (!applied) throw new Error('token usage meter store or active run unavailable')
  await page.waitForTimeout(600)
}

export const FLOWS = {
  // Task keys and "Depends on" (2f21134)
  'TKY-001': { title: 'Board: no keys on cards; Blocked by (+1) and Dependency cancelled badges', path: PROJECT, steps: [] },
  'TKY-002': { title: 'Board: a dependency badge tooltip lists every dependency', path: PROJECT, steps: [hover('[data-testid="task-dependency-badge-blocked"]'), wait(600)] },
  'TKY-003': { title: 'Task page by long ID is replaced by the key URL; chip, Depends on, informs note', path: `${PROJECT}/tasks/task-translate`, steps: [] },
  'TKY-004': { title: 'Task page: a Done dependency (✓) and Required by', path: `${PROJECT}/tasks/task-review`, steps: [] },
  'TKY-005': { title: 'Task page: copy the key', path: `${PROJECT}/tasks/task-review`, steps: [sel('[data-testid="task-key-copy"]')], settleMs: 300 },
  'TKY-006': { title: 'Task page: a dependency row opens that Task', path: `${PROJECT}/tasks/task-translate`, steps: [sel('[data-testid="task-dependency-task-review"] a, [data-testid="task-dependency-task-review"]')] },
  'TKY-007': { title: 'Key URL in another letter case opens the Task', path: `${PROJECT}/tasks/PROTOTYPE-LAUNCH-3`, steps: [] },
  'TKY-008': { title: 'Edit task: the picker lists Tasks, a dependent one greyed "Depends on this Task"', path: `${PROJECT}/tasks/task-review/edit`, steps: [sel('[data-testid="task-dependency-input"]')] },
  'TKY-009': { title: 'Edit task: picker search by key or text', path: `${PROJECT}/tasks/task-review/edit`, steps: [typeIn('[data-testid="task-dependency-input"]', 'outline')] },
  'TKY-010': { title: 'Edit task: picker with no match', path: `${PROJECT}/tasks/task-review/edit`, steps: [typeIn('[data-testid="task-dependency-input"]', 'zzz')] },
  'TKY-011': { title: 'Edit task: Enter adds the first option; focus stays in the search', path: `${PROJECT}/tasks/task-review/edit`, steps: [typeIn('[data-testid="task-dependency-input"]', 'outline'), key('Enter')] },
  'TKY-012': { title: 'Edit task: remove a chosen dependency', path: `${PROJECT}/tasks/task-review/edit`, steps: [sel('[data-testid="task-dependency-remove"]')] },
  'TKY-013': { title: 'Edit task: Save stores the new dependencies (after the 3 s notice)', path: `${PROJECT}/tasks/task-review/edit`, steps: [typeIn('[data-testid="task-dependency-input"]', 'outline'), key('Enter'), sel('[data-testid="task-page-save"]'), wait(3800)] },
  'TKY-014': { title: 'New task: picker, then Create (after the 3 s notice)', path: `${PROJECT}/tasks/new`, steps: [typeIn('textarea', 'Write the rollback checklist.'), typeIn('[data-testid="task-dependency-input"]', 'translate'), key('Enter'), sel('[data-testid="task-page-save"]'), wait(3800)] },
  'TKY-021': { title: 'New task: Create shows "Task created." on the board', path: `${PROJECT}/tasks/new`, steps: [typeIn('textarea', 'Write the rollback checklist.'), typeIn('[data-testid="task-dependency-input"]', 'translate'), key('Enter'), sel('[data-testid="task-page-save"]'), async page => { await page.waitForURL(/notice=/, { timeout: 5000 }); await page.waitForTimeout(400) }], settleMs: 100 },
  'TKY-015': { title: 'Projects tab: Task view with the key chip and dependencies', path: '/workspace', steps: [rightTab('Projects'), sel('[data-testid="project-task-row-task-translate"]')] },
  'TKY-016': { title: 'Projects tab: a dependency opens inside the tab', path: '/workspace', steps: [rightTab('Projects'), sel('[data-testid="project-task-row-task-translate"]'), sel('[data-testid="task-dependency-task-review"] a, [data-testid="task-dependency-task-review"]')] },
  'TKY-017': { title: 'Temp task page: no key, no dependencies', path: '/projects/temp-tasks/tasks/temp-task-links', steps: [] },
  'TKY-018': { title: 'Task page (390x844)', path: `${PROJECT}/tasks/task-translate`, viewport: { width: 390, height: 844 }, steps: [] },
  'TKY-019': { title: 'Task page (zh-CN)', path: `${PROJECT}/tasks/task-translate`, locale: 'zh-CN', steps: [] },
  'TKY-020': { title: 'Board (zh-CN): badges', path: PROJECT, locale: 'zh-CN', steps: [] },
  // Delegated copies in a stopped run's Settings (3126536)
  'DLG-001': { title: 'Stored run Settings: Delegated copies, collapsed', path: '/workspace', steps: [openStoredAgentRun, editConfig] },
  'DLG-002': { title: 'Delegated copies: open an agent copy (editable while stopped; skipped default)', path: '/workspace', steps: [openStoredAgentRun, editConfig, expandMember('/documentation_writer@worker-writer-001')] },
  'DLG-003': { title: 'Delegated copies: open a Team copy (settings, members, coordinator)', path: '/workspace', steps: [openStoredAgentRun, editConfig, expandMember('/product_review_team@worker-team-review-001')] },
  'DLG-004': { title: 'Delegated copies: the model menu of a stopped copy', path: '/workspace', steps: [openStoredAgentRun, editConfig, expandMember('/documentation_writer@worker-writer-001'), openCopyModel] },
  'DLG-005': { title: 'Delegated copies: choose another model; the Save bar shows', path: '/workspace', steps: [openStoredAgentRun, editConfig, expandMember('/documentation_writer@worker-writer-001'), openCopyModel, chooseReasoningModel] },
  'DLG-006': { title: 'Delegated copies: Save; the row shows the chosen model', path: '/workspace', steps: [openStoredAgentRun, editConfig, expandMember('/documentation_writer@worker-writer-001'), openCopyModel, chooseReasoningModel, sel('[data-test="save-existing-model-config"]'), wait(2000)] },
  // Live stored runs (live_runs): Team status, a running copy's Stop (d1a66fe, 3126536, 14f9b3c)
  'LIV-001': { title: 'Workspaces tree: Team status dots (busy Team run, copy Team in error)', path: '/workspace', scenario: 'live_runs', steps: [openTree] },
  'LIV-002': { title: 'Workspaces tree: the running copy\'s red Stop, hovered', path: '/workspace', scenario: 'live_runs', steps: [openTree, hover('[data-test="workspace-delegated-stop"]')] },
  'LIV-003': { title: 'Live run Settings: running copy has Stop and a locked model', path: '/workspace', scenario: 'live_runs', steps: [openStoredAgentRun, editConfig, expandMember('/documentation_writer@worker-writer-001')] },
  'LIV-004': { title: 'Live run Settings: Stop a running copy', path: '/workspace', scenario: 'live_runs', steps: [openStoredAgentRun, editConfig, sel('[data-test="run-member-stop"]'), wait(1200)] },
  'LIV-005': { title: 'Workspaces tree: Stop a copy from its row', path: '/workspace', scenario: 'live_runs', steps: [openTree, sel('[data-test="workspace-delegated-stop"]'), wait(1200)] },
  'LIV-006': { title: 'Live Team run opened: Team status busy', path: '/workspace', scenario: 'live_runs', steps: [openStoredTeamRun] },
  'LIV-007': { title: 'Team status tooltip', path: '/workspace', scenario: 'live_runs', steps: [ensureWorkspaceOpen, hover('[data-test="team-aggregate-status-dot"]'), wait(800)] },
  'LIV-008': { title: 'Stored (not live) Team status: offline', path: '/workspace', steps: [ensureWorkspaceOpen, hover('[data-test="team-aggregate-status-dot"]'), wait(800)] },
  // Conversation and Token Meter
  'SKU-001': { title: 'Stored run conversation: "Skill updated" notice', path: '/workspace', steps: [openStoredAgentRun] },
  'TPS-001': { title: 'Token tab: TPS card without a measured call', path: '/chat', steps: [sendFirst, openTokenTab] },
  'TPS-002': { title: 'Token tab: TPS card with a generation reading', path: '/chat', steps: [sendFirst, openTokenTab, reportTps('generation')] },
  'TPS-003': { title: 'Token tab: TPS help expanded', path: '/chat', steps: [sendFirst, openTokenTab, reportTps('generation'), sel('[data-test="throughput-help"] > summary')] },
  'TPS-004': { title: 'Token tab: TPS end-to-end reading', path: '/chat', steps: [sendFirst, openTokenTab, reportTps('end_to_end'), sel('[data-test="throughput-help"] > summary')] },
  // Nodes → NFS guide (c57ab71)
  'NFS-001': { title: 'Nodes: NFS guide tab', path: '/nodes?tab=manage', steps: [async page => { await page.getByRole('tab', { name: 'NFS Guide' }).or(page.getByText('NFS Guide', { exact: true })).first().click(); await page.waitForTimeout(900) }] },
  // No release is published at 2f21134, so the guide's Copy buttons are disabled on both sides (no copy feedback state).
  'NFS-002': { title: 'Nodes: NFS guide (390x844)', path: '/nodes?tab=manage', viewport: { width: 390, height: 844 }, steps: [async page => { await page.getByText('NFS Guide', { exact: true }).first().click(); await page.waitForTimeout(900) }] },
  // Samples
  'NAR-001': { title: '390x844: Workspaces drawer with live Team status', path: '/workspace', scenario: 'live_runs', viewport: { width: 390, height: 844 }, steps: [sel('[data-test="workspace-left-strip-workspaces"]'), openTree] },
  'ZH-001': { title: 'zh-CN: delegated copies in Settings', path: '/workspace', locale: 'zh-CN', steps: [openStoredAgentRun, async page => { await page.getByRole('button', { name: /配置|Edit Config/ }).first().click(); await page.waitForTimeout(1500) }] },
}

// Element probe: identical on both sides or the flow fails.
const PROBE_STYLES = ['display', 'background-color', 'color', 'border-top-color', 'border-top-width', 'border-radius', 'box-shadow', 'padding-top', 'padding-left', 'font-size', 'font-weight', 'line-height', 'text-decoration-line', 'outline-style', 'opacity', 'animation-name']
const PROBE_SELECTORS = [
  '[data-testid="task-key"]', '[data-testid="task-key-chip"]', '[data-testid="task-key-copied"]', '[data-testid^="task-dependency-badge-"]', '[data-testid="task-dependencies"]', '[data-testid^="task-dependency-"]',
  '[data-test="team-aggregate-status-dot"]', '[data-test="workspace-delegated-stop"]', '[data-test="run-member-stop"]', '[data-test="run-member-stop-hint"]', '[data-test="run-member-badge"]', '[data-test="run-member-summary"]', '[data-test="run-member-launch-note"]', '[data-test="run-members-description"]', '[data-test="existing-run-save-bar"]',
  '[data-testid="system-task-notification-label"]', '[data-test="throughput-card"]', '[data-test="throughput-value"]', '[data-test="throughput-model"]', '[data-testid="nfs-guide-card"]', '[data-testid="nfs-copy-feedback"]',
]
const probeElements = page => page.evaluate(({ styles, selectors }) => {
  const pick = el => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect()
    return { tag: el.tagName, test: el.getAttribute('data-test') || el.getAttribute('data-testid'), ariaCurrent: el.getAttribute('aria-current'), ariaDisabled: el.getAttribute('aria-disabled'), ariaLabel: el.getAttribute('aria-label'), title: el.getAttribute('title'), open: el.hasAttribute('open') || undefined, disabled: el.disabled || undefined, text: el.innerText?.trim().slice(0, 120), rect: [r.x, r.y, r.width, r.height].map(v => Math.round(v * 10) / 10), style: Object.fromEntries(styles.map(s => [s, cs.getPropertyValue(s)])) }
  }
  const out = {}
  for (const selector of selectors) {
    const found = [...document.querySelectorAll(selector)].filter(el => el.getClientRects().length).slice(0, 12).map(pick)
    if (found.length) out[selector] = found
  }
  const a = document.activeElement
  out.focused = a ? (a.getAttribute('data-test') || a.getAttribute('data-testid') || a.id || a.tagName) : null
  out.sendDisabled = [...document.querySelectorAll('button[type="submit"], [data-test$="send-button"], [data-test="chat-send"]')].filter(el => el.getClientRects().length).map(el => [el.getAttribute('data-test'), el.disabled, el.getAttribute('aria-disabled')])
  return out
}, { styles: PROBE_STYLES, selectors: PROBE_SELECTORS })

const requested = process.argv.slice(2)
const selected = requested.length ? requested : Object.keys(FLOWS)
await fetch(`${MOCK}/__prototype/scenario`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scenario: 'populated', operationFailures: {} }) })
const browser = await chromium.launch({ headless: true, executablePath: CHROME, args: ['--no-sandbox', '--disable-background-networking', '--font-render-hinting=none'] })
await mkdir(resolve(OUT, 'source'), { recursive: true }); await mkdir(resolve(OUT, 'prototype'), { recursive: true })

async function run(base, target, id) {
  const flow = FLOWS[id]
  await fetch(`${MOCK}/__prototype/scenario`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scenario: flow.scenario || 'populated', operationFailures: {} }) })
  const ctx = await browser.newContext({ viewport: flow.viewport || { width: 1440, height: 900 }, locale: flow.locale === 'zh-CN' ? 'zh-CN' : 'en-US', colorScheme: 'light', reducedMotion: 'reduce', timezoneId: 'UTC' })
  const external = []
  await ctx.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (['api.iconify.design', 'api.simplesvg.com', 'api.unisvg.com'].includes(url.hostname)) {
      if (target === 'prototype') external.push(url.href)
      const prefix = url.pathname.split('/').pop()?.replace(/\.json$/, '')
      if (prefix && icons[prefix]) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(icons[prefix]) })
    }
    if (['data:', 'blob:'].includes(url.protocol) || ['127.0.0.1', 'localhost'].includes(url.hostname)) return route.continue()
    external.push(url.href); return route.abort('blockedbyclient')
  })
  // A desktop-host flow gets the same synthetic Electron bridge on the source side before it
  // starts; the baseline installs it itself from the context key (plugins/10).
  if (flow.context && target === 'source') {
    await ctx.addInitScript(({ installer, context, mock }) => {
      eval(`(${installer})`)({ context, scenario: 'populated', mockBaseUrl: mock })
    }, { installer: installHostScenario.toString(), context: flow.context, mock: MOCK })
  }
  await ctx.addInitScript(({ scenario, locale, context }) => {
    if (sessionStorage.getItem('__flow_init')) return
    sessionStorage.setItem('__flow_init', '1')
    localStorage.clear()
    localStorage.setItem('autobyteus.localization.preference-mode', locale)
    localStorage.setItem('autobyteus.prototype.scenario', scenario)
    localStorage.setItem('autobyteus.prototype.context', context)
    localStorage.setItem('autobyteus.prototype.designOnlyLayers', 'off')
  }, { scenario: flow.scenario || 'populated', locale: flow.locale || 'en', context: flow.context || 'desktop' })
  const page = await ctx.newPage()
  page.setDefaultTimeout(10000)
  const errors = []
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`))
  page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text().slice(0, 300)}`) })
  await page.goto(base + flow.path, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(1800)
  let stepError = null
  for (const [index, step] of flow.steps.entries()) {
    try { await step(page) } catch (error) { stepError = `step ${index + 1}: ${error.message.split('\n')[0]}`; break }
  }
  await page.waitForTimeout(flow.settleMs ?? 800)
  await page.addStyleTag({ content: style }); await page.waitForTimeout(60)
  const probe = await probeElements(page)
  const file = resolve(OUT, target, `${id}.png`)
  await page.screenshot({ path: file })
  const text = await page.locator('body').innerText()
  // Draft run ids embed Date.now() (`temp-<ms>-<n>`); compare them by shape.
  const route = (await page.evaluate(() => location.pathname + location.search)).replace(/temp-\d+-/g, 'temp-<ms>-')
  await ctx.close()
  return { file, text, route, errors, stepError, external, probe }
}
async function diff(a, b) {
  const [s, p] = await Promise.all([sharp(a).removeAlpha().raw().toBuffer(), sharp(b).removeAlpha().raw().toBuffer()])
  let changed = 0, max = 0, low = 0
  for (let i = 0; i < s.length; i += 3) { let d = 0; for (let k = 0; k < 3; k++) d = Math.max(d, Math.abs(s[i + k] - p[i + k])); if (d) { changed++; if (d <= 2) low++; if (d > max) max = d } }
  return { changed, max, low }
}
const results = []
for (const id of selected) {
  const s = await run(SOURCE, 'source', id)
  const p = await run(PROTO, 'prototype', id)
  const d = await diff(s.file, p.file)
  const viewport = FLOWS[id].viewport || { width: 1440, height: 900 }
  const total = viewport.width * viewport.height
  const noise = d.changed === 0 ? 'exact' : (d.changed / total <= 0.0001 && d.max <= 64) ? 'A-edge-antialiasing' : (d.low / d.changed >= 0.99 && d.max <= 16) ? 'B-compositing-rounding' : null
  const probeEqual = JSON.stringify(s.probe) === JSON.stringify(p.probe)
  const pass = probeEqual && !s.stepError && !p.stepError && s.text === p.text && s.route === p.route && Boolean(noise) && p.errors.length === 0 && p.external.length === 0
  results.push({ id, title: FLOWS[id].title, pass, probeEqual, probe: s.probe, prototypeProbe: probeEqual ? undefined : p.probe, noise, pixels: d, route: [s.route, p.route], textEqual: s.text === p.text, sourceStepError: s.stepError, prototypeStepError: p.stepError, sourceErrors: s.errors, prototypeErrors: p.errors, prototypeExternal: p.external })
  console.log(`${pass ? 'PASS' : 'FAIL'} ${id} ${FLOWS[id].title} text=${s.text === p.text} probe=${probeEqual} px=${d.changed} max=${d.max} ${s.stepError ? 'SRC-STEP ' + s.stepError : ''} ${p.stepError ? 'PROTO-STEP ' + p.stepError : ''} srcErr=${s.errors.length} protoErr=${p.errors.length}`)
  if (!pass && process.env.VERBOSE) {
    const sl = s.text.split('\n'), pl = p.text.split('\n'); const ps = new Set(pl), ss = new Set(sl)
    console.log('  source-only:', JSON.stringify(sl.filter(x => !ps.has(x)).slice(0, 12)))
    console.log('  proto-only :', JSON.stringify(pl.filter(x => !ss.has(x)).slice(0, 12)))
    if (s.errors.length) console.log('  srcErr', JSON.stringify(s.errors.slice(0, 3)))
    if (p.errors.length) console.log('  protoErr', JSON.stringify(p.errors.slice(0, 3)))
  }
}
await writeFile(resolve(OUT, `flow-results${process.env.RESULT_TAG ? '-' + process.env.RESULT_TAG : ''}.json`), JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2))
await browser.close()
