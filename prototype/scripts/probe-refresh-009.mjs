#!/usr/bin/env node
// WEB-BASELINE-REFRESH-009 paired click-through probe for the surfaces changed between the mixed pin
// (1cd1a3a / ff227eb) and origin/personal@73f7432: Task summaries under Task-worker rows and Task
// locate (6bd2b69, 9679123, 1949fa9), the collapsed left strip's Workspaces icon (1639cba, d0bf3db),
// the redesigned skill sources dialog (3fb98d2, a7d2fc8), definition load-issue badges, problem
// notices and Reload (f7fcf90, bd4c637, e89085f), member launch defaults and the delegated launch
// list (035b208), token meter compaction marker and note (9e8e5bf, d6a89cb, c0f1b9a), an open run
// closing when its group is archived (fd5f32b), the send rule (e259a02) and a signed-out Antigravity
// CLI (87b246c). Same matched conditions and pass rule as probe-refresh-008.mjs, plus an element
// probe that must be identical on both sides. Design-only data is off on the baseline side.
// Usage: node probe-refresh-009.mjs [flow-id ...]
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
const OUT = resolve(root, process.env.FLOW_DIR || 'evidence/WEB-BASELINE-REFRESH-009/flows')
const CHROME = process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const style = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'

const role = (r, name) => async page => { await page.getByRole(r, { name }).first().click(); await page.waitForTimeout(700) }
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
const summary = (text) => async page => { await page.locator('[data-test="workspace-task-worker-task-summary"]', { hasText: text }).first().click(); await page.waitForTimeout(900) }
const focusSummary = (text) => async page => { await page.locator('[data-test="workspace-task-worker-task-summary"]', { hasText: text }).first().focus(); await page.waitForTimeout(300) }
const openSources = async page => { await page.getByRole('button', { name: 'Sources', exact: true }).first().click(); await page.waitForTimeout(1200) }
const addSource = value => async page => { await page.locator('#skill-source-input').fill(value); await page.waitForTimeout(300); await page.locator('[data-testid="skill-sources-dialog"] button[type="submit"]').click(); await page.waitForTimeout(1500) }
const rowAction = (sourceId, name) => async page => { await page.locator(`[data-testid="skill-source-row-${sourceId}"]`).getByRole('button', { name }).first().click(); await page.waitForTimeout(900) }
const expandDetails = (selector, index = 0) => async page => { await page.locator(`${selector} > summary`).nth(index).click(); await page.waitForTimeout(500) }
const openSwitcher = sel('[data-test="run-target-switcher-trigger"]')
const chooseTeam = async page => { await openSwitcher(page); await sel('[data-test="run-target-switcher-option-team-product"]')(page); await page.waitForTimeout(800) }
const NEW_CHAT_PLACEHOLDER = 'Ask anything · / for skills · @ for an agent or team'
const sendFirst = async page => { await page.getByPlaceholder(NEW_CHAT_PLACEHOLDER).first().click(); await page.keyboard.type('Summarize the synthetic baseline.', { delay: 20 }); await page.keyboard.press('Enter'); await page.waitForTimeout(2500) }
const openTokenTab = async page => { await page.locator('[data-test="right-side-tab-list"]').getByText(/^Token/).first().click(); await page.waitForTimeout(1200) }
// The compaction note is live-session state (a completed compaction on the run's stream). As for the
// earlier compaction rows, the same mark is applied through the source's own store on both sides.
const markCompacted = async page => {
  const applied = await page.evaluate(() => {
    const pinia = document.querySelector('#__nuxt')?.__vue_app__?.config?.globalProperties?.$pinia
    const runId = pinia?._s.get('activeContext')?.activeAgentContext?.state?.runId
    const store = pinia?._s.get('tokenUsageMeter')
    if (!runId || !store?.markCompactionCompleted) return false
    store.markCompactionCompleted(runId)
    return true
  })
  if (!applied) throw new Error('token usage meter store or active run unavailable')
  await page.waitForTimeout(600)
}

export const FLOWS = {
  // Task summaries under Task-worker rows; "Show Task in Projects" (6bd2b69, 9679123, 1949fa9)
  'TSL-001': { title: 'Workspaces tree: Task-worker rows show their Task summary', path: '/workspace', steps: [openTree] },
  'TSL-002': { title: 'Task summary: shows the Project Task in the Projects tab, highlighted', path: '/workspace', steps: [openTree, summary('Review the synthetic navigation baseline.')], settleMs: 300 },
  'TSL-003': { title: 'Task summary: shows the Temp task on the Temp tasks board, highlighted', path: '/workspace', steps: [openTree, summary('Collect the changelog links')], settleMs: 300 },
  'TSL-004': { title: 'Task summary: the highlight ends after 2.4 s', path: '/workspace', steps: [openTree, summary('Review the synthetic navigation baseline.'), wait(3000)] },
  'TSL-005': { title: 'Task summary: Enter locates the Task and does not open the row', path: '/workspace', steps: [openTree, focusSummary('Review the synthetic navigation baseline.'), key('Enter')], settleMs: 300 },
  'TSL-006': { title: 'Task summary on a page without the right panel opens the run, then locates', path: '/agents?view=list', steps: [openTree, summary('Review the synthetic navigation baseline.'), wait(1500)], settleMs: 300 },
  'TSL-007': { title: 'Task summary while the run is open in Chat', path: '/workspace', steps: [openStoredAgentRun, summary('Collect the changelog links')], settleMs: 300 },
  'TSL-008': { title: 'Workspaces drawer (390x844): Task summaries', path: '/workspace', viewport: { width: 390, height: 844 }, steps: [sel('[data-test="workspace-left-strip-workspaces"]'), openTree] },
  'TSL-009': { title: 'Workspaces drawer (390x844): a summary closes the drawer and shows the Task, highlight ended', path: '/workspace', viewport: { width: 390, height: 844 }, steps: [sel('[data-test="workspace-left-strip-workspaces"]'), openTree, summary('Review the synthetic navigation baseline.'), wait(3000)] },
  // Collapsed left strip: Workspaces icon keeps the open run (1639cba, d0bf3db)
  'CLP-001': { title: 'Open run, left panel collapsed: the strip lights Workspaces', path: '/workspace', steps: [openStoredAgentRun, sel('[data-test="app-left-panel-collapse"]')] },
  'CLP-002': { title: 'Strip Workspaces icon opens the panel on the open run', path: '/workspace', steps: [openStoredAgentRun, sel('[data-test="app-left-panel-collapse"]'), sel('[data-test="workspace-left-strip-workspaces"]')] },
  'CLP-003': { title: 'New chat, left panel collapsed: the strip lights Chat', path: '/chat', steps: [sel('[data-test="app-left-panel-collapse"]')] },
  'CLP-004': { title: 'Strip hover tooltip on Workspaces', path: '/chat', steps: [sel('[data-test="app-left-panel-collapse"]'), hover('[data-test="workspace-left-strip-workspaces"]')] },
  // Redesigned skill sources dialog (3fb98d2, a7d2fc8)
  'SKN-001': { title: 'Skills: Sources opens the dialog', path: '/skills', steps: [openSources] },
  'SKN-002': { title: 'Skill sources: add a local folder', path: '/skills', steps: [openSources, addSource('/synthetic/more-skills')] },
  'SKN-003': { title: 'Skill sources: import a GitHub repository URL from the same input', path: '/skills', steps: [openSources, addSource('https://github.com/acme/launch-skills')], settleMs: 1500 },
  'SKN-004': { title: 'Skill sources: an invalid repository URL is rejected', path: '/skills', steps: [openSources, addSource('https://github.com/acme')] },
  'SKN-005': { title: 'Skill sources: Tab keeps focus inside the dialog', path: '/skills', steps: [openSources, key('Tab'), key('Tab'), key('Tab'), key('Tab'), key('Tab'), key('Tab'), key('Tab'), key('Tab')] },
  'SKN-006': { title: 'Skill sources: Update failed and Removal incomplete rows', path: '/skills', scenario: 'skill_source_issues', steps: [openSources] },
  'SKN-007': { title: 'Skill sources: Escape closes the dialog', path: '/skills', steps: [openSources, key('Escape')] },
  // The rows' own actions, replacing SKS-003-014 of probe-refresh-006.mjs (they drove the earlier dialog's controls).
  'SKN-008': { title: 'Skill sources: Try again on a source whose check failed', path: '/skills', steps: [openSources, rowAction('github-legacy-skills', /^Check .* again$/)] },
  'SKN-009': { title: 'Skill sources: Update opens the whole-source confirmation', path: '/skills', steps: [openSources, rowAction('github-review-skills', 'Update')] },
  'SKN-010': { title: 'Skill sources: confirm the update (up to date, success notice)', path: '/skills', steps: [openSources, rowAction('github-review-skills', 'Update'), async page => { await page.getByRole('button', { name: 'Update', exact: true }).last().click(); await page.waitForTimeout(1500) }] },
  'SKN-011': { title: 'Skill sources: Remove a GitHub source opens the delete confirmation', path: '/skills', steps: [openSources, rowAction('github-docs-skills', /^Remove /)] },
  'SKN-012': { title: 'Skill sources: confirm removing a GitHub source', path: '/skills', steps: [openSources, rowAction('github-docs-skills', /^Remove /), async page => { await page.getByRole('button', { name: 'Remove', exact: true }).last().click(); await page.waitForTimeout(1500) }] },
  'SKN-013': { title: 'Skill sources: Remove a local folder opens the unlink confirmation', path: '/skills', steps: [openSources, rowAction('local-team-skills', /^Remove /)] },
  'SKN-014': { title: 'Skill sources: Retry removal', path: '/skills', scenario: 'skill_source_issues', steps: [openSources, rowAction('github-old-skills', 'Retry removal')] },
  'SKN-015': { title: 'Skill sources: Done closes the dialog', path: '/skills', steps: [openSources, role('button', 'Done')] },
  // Definition load issues, problems and Reload (f7fcf90, bd4c637, 3cc1713, e89085f)
  'DEF-001': { title: 'Agents: expand a card load-issue badge', path: '/agents?view=list', scenario: 'definition_issues', steps: [expandDetails('[data-testid="definition-load-issue"]')] },
  'DEF-002': { title: 'Agents: expand the "Package folder unavailable" badge', path: '/agents?view=list', scenario: 'definition_issues', steps: [expandDetails('[data-testid="definition-load-issue"]', 1)] },
  'DEF-003': { title: 'Agents: expand the problems notice', path: '/agents?view=list', scenario: 'definition_issues', steps: [expandDetails('[data-testid="definition-problems-notice"]')] },
  'DEF-004': { title: 'Teams: expand the card badge (members could not be loaded) and the notice', path: '/agent-teams?view=team-list', scenario: 'definition_issues', steps: [expandDetails('[data-testid="definition-load-issue"]'), expandDetails('[data-testid="definition-problems-notice"]')] },
  'DEF-005': { title: 'Orgs: expand the card badge and the notice', path: '/agent-orgs?view=org-list', scenario: 'definition_issues', steps: [expandDetails('[data-testid="definition-load-issue"]'), expandDetails('[data-testid="definition-problems-notice"]')] },
  'DEF-006': { title: 'Agents: Reload reloads every agent package', path: '/agents?view=list', steps: [role('button', /^Reload$/), wait(800)] },
  'DEF-007': { title: 'Teams: Reload', path: '/agent-teams?view=team-list', steps: [role('button', /^Reload$/), wait(800)] },
  'DEF-008': { title: 'Agent Packages: auto-refresh state tooltip', path: '/settings?section=agent-packages', scenario: 'definition_issues', steps: [hover('[title="The agent-teams folder could not be read."]')] },
  // Member launch defaults and the delegated launch list (035b208)
  'RSN-001': { title: 'New chat Team: members seeded from their agent defaults (one cannot be used)', path: '/chat', steps: [chooseTeam, sel('[data-test="run-members-open"]')] },
  'RSN-002': { title: 'New chat Team: expand the member whose default cannot be used', path: '/chat', steps: [chooseTeam, sel('[data-test="run-members-open"]'), sel('[data-test="run-member-toggle"]', 1)] },
  // A fresh Run from the catalog seeds members from their agent defaults (the heading switcher does not).
  'RSN-006': { title: 'Team catalog Run: members seeded from agent defaults; one default cannot be used', path: '/agent-teams?view=team-list', steps: [role('button', 'Run'), wait(800), sel('[data-test="run-members-open"]')] },
  'RSN-007': { title: 'Team catalog Run: expand the member whose default cannot be used', path: '/agent-teams?view=team-list', steps: [role('button', 'Run'), wait(800), sel('[data-test="run-members-open"]'), sel('[data-test="run-member-toggle"]', 1)] },
  'RSN-008': { title: 'Org Run: Org launch page with seeded member rows', path: '/agent-orgs?view=org-detail&id=org-product-launch', steps: [sel('[data-test="run-organization"]'), wait(1200)] },
  'RSN-003': { title: 'Org launch page: members seeded from their defaults', path: '/chat', steps: [openSwitcher, sel('[data-test^="run-target-switcher-option-org"]'), wait(800)] },
  'RSN-004': { title: 'Stored Agent run settings: collaborators and delegated copies', path: '/workspace', steps: [openStoredAgentRun, role('button', 'Edit Config')] },
  'RSN-005': { title: 'Stored Team run settings (no delegated launches)', path: '/workspace', steps: [openStoredTeamRun, role('button', 'Edit Config')] },
  // Token meter (9e8e5bf, d6a89cb, c0f1b9a)
  'TKN-001': { title: 'Chat run Token tab: auto-compaction marker and label', path: '/chat', steps: [sendFirst, openTokenTab] },
  'TKN-002': { title: 'Chat run Token tab: "Compacted — updates on the next model call"', path: '/chat', steps: [sendFirst, openTokenTab, markCompacted] },
  'TKN-003': { title: 'Stored Agent run Token tab', path: '/workspace', steps: [openStoredAgentRun, openTokenTab] },
  // An open run whose group is archived closes to the workspace view (fd5f32b)
  'ARC-001': { title: 'Archive all while a run of the group is open', path: '/workspace', steps: [openStoredAgentRun, sel('[data-test="workspace-agent-group-archive-agent-researcher"]'), role('button', /^Archive all$/)], settleMs: 1500 },
  // Send rule (e259a02) and the runtime menu (87b246c)
  'CHS-001': { title: 'New chat: send is unavailable without text', path: '/chat', steps: [async page => { await page.getByPlaceholder(NEW_CHAT_PLACEHOLDER).first().click(); await page.keyboard.type('x'); await page.keyboard.press('Backspace'); await page.waitForTimeout(400) }] },
  'AGY-001': { title: 'Model menu: a signed-out Antigravity CLI is Unavailable with its reason', path: '/chat', scenario: 'agy_signed_out', steps: [role('button', /^Model: /)] },
  'AGY-002': { title: 'Model menu: hovering the unavailable runtime', path: '/chat', scenario: 'agy_signed_out', steps: [role('button', /^Model: /), hover('[data-test="chat-runtime-antigravity_cli"]')] },
  // zh-CN and narrow samples
  'ZH-001': { title: 'zh-CN: Workspaces tree Task summaries and locate', path: '/workspace', locale: 'zh-CN', steps: [openTree, summary('Review the synthetic navigation baseline.')], settleMs: 300 },
  'ZH-002': { title: 'zh-CN: Agents with load issues', path: '/agents?view=list', locale: 'zh-CN', scenario: 'definition_issues', steps: [expandDetails('[data-testid="definition-load-issue"]')] },
  'ZH-003': { title: 'zh-CN: Team members drawer with seeded rows', path: '/chat', locale: 'zh-CN', steps: [chooseTeam, sel('[data-test="run-members-open"]')] },
  'NAR-001': { title: '390x844: Skill sources dialog', path: '/skills', viewport: { width: 390, height: 844 }, steps: [openSources] },
  'NAR-002': { title: '390x844: Agents with load issues', path: '/agents?view=list', viewport: { width: 390, height: 844 }, scenario: 'definition_issues', steps: [] },
}

// Element probe: identical on both sides or the flow fails.
const PROBE_STYLES = ['display', 'background-color', 'color', 'border-top-color', 'border-top-width', 'border-radius', 'box-shadow', 'padding-top', 'padding-left', 'font-size', 'font-weight', 'line-height', 'text-decoration-line', 'outline-style', 'opacity']
const PROBE_SELECTORS = [
  '[data-test="workspace-task-worker-task-summary"]', '[data-testid^="project-task-row-task-"]', '[data-testid^="project-task-row-temp-"]',
  '[data-test="workspace-left-strip-workspaces"]', '[data-test="app-left-panel-chat"]', '[data-test="workspace-left-navigation-strip"] button',
  '[data-testid="skill-sources-dialog"]', '[data-testid^="skill-source-row-"]',
  '[data-testid="definition-load-issue"]', '[data-testid="definition-problems-notice"]',
  '[data-test="run-delegated-launch"]', '[data-test="run-delegated-source"]', '[data-test="run-delegated-fallback"]', '[data-test="run-member-launch-note"]', '[data-test^="run-member-"][data-test$="-summary"]',
  '[data-test="context-compaction-marker"]', '[data-test="context-compaction-label"]', '[data-test="context-compacted-note"]', '[data-test="context-bar-fill"]',
  '[data-test="chat-runtime-antigravity_cli"]', '[data-test="chat-runtime-reason"]', '[data-test="chat-runtime-unavailable"]',
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
