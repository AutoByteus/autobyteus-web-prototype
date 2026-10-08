#!/usr/bin/env node
// WEB-BASELINE-REFRESH-008 paired click-through probe for the surfaces changed between
// origin/personal@10fb695 and @1cd1a3a: the right panel's Projects tab, Task roots and Temp
// tasks, path-only Project workspaces, Workspaces group archive, unified run settings (New chat
// target switcher, member line and drawer, Org launch page, Codex "Fast" control, start-surface
// tools), New chat Draft rows, and saved-run settings. Same matched conditions and pass rule as
// probe-chat-flows.mjs; design-only data is off on the baseline side (design-only-layers.ts).
// Usage: node probe-refresh-008.mjs [flow-id ...]
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
const OUT = resolve(root, process.env.FLOW_DIR || 'evidence/WEB-BASELINE-REFRESH-008/flows')
const CHROME = process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const style = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'

const role = (r, name) => async page => { await page.getByRole(r, { name }).first().click(); await page.waitForTimeout(700) }
const text = (value, exact = true) => async page => { await page.getByText(value, { exact }).first().click(); await page.waitForTimeout(700) }
const fill = (placeholder, value) => async page => { await page.getByPlaceholder(placeholder).first().fill(value); await page.waitForTimeout(600) }
const typeKeys = value => async page => { await page.keyboard.type(value, { delay: 30 }); await page.waitForTimeout(700) }
const NEW_CHAT_PLACEHOLDER = 'Ask anything · / for skills · @ for an agent or team'
const focusComposer = async page => { await page.getByPlaceholder(NEW_CHAT_PLACEHOLDER).first().click(); await page.waitForTimeout(300) }
const openModel = role('button', /^Model: /)
const sendFirst = async page => { await focusComposer(page); await page.keyboard.type('Summarize the synthetic baseline.', { delay: 20 }); await page.keyboard.press('Enter'); await page.waitForTimeout(2500) }
const sel = (selector, index = 0) => async page => { await page.locator(selector).nth(index).click(); await page.waitForTimeout(700) }
const hover = selector => async page => { await page.locator(selector).first().hover(); await page.waitForTimeout(400) }
const rightTab = name => async page => { await page.locator('[data-test="right-side-tab-list"]').getByText(name, { exact: true }).first().click(); await page.waitForTimeout(900) }
const pick = (selector, value) => async page => { await page.locator(selector).first().selectOption(value); await page.waitForTimeout(800) }
const ensureWorkspaceOpen = async page => {
  if (!(await page.getByText('Product Review Team', { exact: true }).first().isVisible().catch(() => false))) {
    await page.getByText('prototype-workspace', { exact: true }).first().click(); await page.waitForTimeout(900)
  }
}
const openStoredAgentRun = async page => { await ensureWorkspaceOpen(page); await text('Research Assistant')(page); await page.getByText('Compare current navigation states', { exact: false }).first().click(); await page.waitForTimeout(1200) }
const openStoredTeamRun = async page => {
  await ensureWorkspaceOpen(page)
  for (const label of ['Product Review Team', 'Review the current prototype baseline']) { await page.getByText(label, { exact: true }).first().click(); await page.waitForTimeout(900) }
}
const openWorkspace = role('button', /^Workspace: /)
const openSwitcher = sel('[data-test="run-target-switcher-trigger"]')
const pickCodexSol = async page => {
  await openModel(page)
  await page.locator('[data-test="chat-runtime-codex_app_server"]').first().click(); await page.waitForTimeout(700)
  await page.getByText('GPT-5.6 Sol', { exact: true }).first().click(); await page.waitForTimeout(800)
}

export const FLOWS = {
  // Right panel Projects tab (0fd2656, 0446c37)
  'PRJ-001': { title: 'Workspace: the Projects tab is first in the right panel and shows the board', path: '/workspace', steps: [rightTab('Projects')] },
  'PRJ-002': { title: 'Projects tab: choose Temp tasks in the picker', path: '/workspace', steps: [rightTab('Projects'), pick('[data-testid="projects-panel-picker-select"]', 'temp')] },
  'PRJ-003': { title: 'Projects tab: a card opens its Task inside the tab', path: '/workspace', steps: [rightTab('Projects'), text('Review the synthetic navigation baseline.')] },
  'PRJ-004': { title: 'Projects tab: back from the Task to the board', path: '/workspace', steps: [rightTab('Projects'), text('Review the synthetic navigation baseline.'), role('button', /Back/)] },
  'PRJ-005': { title: 'Projects tab: a Temp task opens inside the tab', path: '/workspace', steps: [rightTab('Projects'), pick('[data-testid="projects-panel-picker-select"]', 'temp'), text('Collect the changelog links for the synthetic release.')] },
  'PRJ-006': { title: 'Chat run: Projects tab beside the conversation', path: '/chat', steps: [sendFirst, rightTab('Projects')] },
  'PRJ-007': { title: 'Projects tab (zh-CN)', path: '/workspace', locale: 'zh-CN', steps: [rightTab('项目')] },
  // Projects pages: Task roots and Temp tasks (4d469b0, 7f08c33)
  'PRJ-010': { title: 'Projects: Temp tasks link opens the Temp tasks board', path: '/projects', steps: [sel('a[href="/projects/temp-tasks"]')] },
  'PRJ-011': { title: 'Temp tasks: a card opens the Temp task page', path: '/projects/temp-tasks', steps: [text('Collect the changelog links for the synthetic release.')] },
  'PRJ-012': { title: 'Task page: the running root opens its conversation in the hosting run', path: '/projects/project-prototype-launch/tasks/task-review', steps: [text('documentation writer')], settleMs: 6500 },
  'PRJ-013': { title: 'Board: the root line of a card opens the worker', path: '/projects/project-prototype-launch', steps: [text('documentation writer')], settleMs: 6500 },
  'PRJ-014': { title: 'Board: search filters cards', path: '/projects/project-prototype-launch', steps: [fill('Search tasks', 'translate')] },
  'PRJ-015': { title: 'Task page: a root that could not start shows its error', path: '/projects/project-prototype-launch/tasks/task-translate', steps: [] },
  'PRJ-016': { title: 'Task page: a closed (DONE) team root is muted, not openable', path: '/projects/project-prototype-launch/tasks/task-publish', steps: [] },
  // Path-only Project workspaces (9dad89b)
  'PRJ-020': { title: 'Edit Project: Workspaces tab', path: '/projects/project-prototype-launch/edit?tab=workspaces', steps: [] },
  'PRJ-021': { title: 'Edit Project: add a workspace row', path: '/projects/project-prototype-launch/edit?tab=workspaces', steps: [role('button', /Add workspace/)] },
  'PRJ-022': { title: 'Project Workspaces tab', path: '/projects/project-prototype-launch', steps: [text('Workspaces')] },
  // Workspaces tree (9faa6bc, d27880b, c21d312, af690af)
  'WSH-001': { title: 'Workspaces tree: runs with task rows; closed Task team left out', path: '/workspace', steps: [ensureWorkspaceOpen] },
  'WSH-002': { title: 'Workspaces tree: agent group header shows Archive all on hover', path: '/workspace', steps: [ensureWorkspaceOpen, hover('[data-test^="workspace-agent-group-archive-"]')] },
  'WSH-003': { title: 'Workspaces tree: Archive all asks for confirmation', path: '/workspace', steps: [ensureWorkspaceOpen, sel('[data-test="workspace-agent-group-archive-agent-researcher"]')] },
  'WSH-004': { title: 'Workspaces tree: confirm Archive all', path: '/workspace', steps: [ensureWorkspaceOpen, sel('[data-test="workspace-agent-group-archive-agent-researcher"]'), role('button', /^Archive all$/)], settleMs: 1500 },
  'WSH-005': { title: 'Workspaces tree: open the stored agent run with its task worker rows', path: '/workspace', steps: [openStoredAgentRun] },
  // New chat run settings (d45fe62, 81f9ff1, c37b81d, a92004c)
  'RST-001': { title: 'New chat: open the target switcher', path: '/chat', steps: [openSwitcher] },
  'RST-002': { title: 'New chat: switcher search filters', path: '/chat', steps: [openSwitcher, fill('Search', 'team')] },
  'RST-003': { title: 'New chat: choose a Team (members line)', path: '/chat', steps: [openSwitcher, sel('[data-test="run-target-switcher-option-team-product"]')] },
  'RST-004': { title: 'New chat: open the Team member settings drawer', path: '/chat', steps: [openSwitcher, sel('[data-test="run-target-switcher-option-team-product"]'), sel('[data-test="run-members-open"]')] },
  'RST-005': { title: 'New chat: choose an Agent Org (Org launch page)', path: '/chat', steps: [openSwitcher, sel('[data-test^="run-target-switcher-option-org"]')] },
  'RST-006': { title: 'New chat: Codex model with effort and Fast mode', path: '/chat', steps: [pickCodexSol] },
  'RST-007': { title: 'New chat: turn Fast mode on', path: '/chat', steps: [pickCodexSol, sel('[data-test="chat-model-option-service_tier"]')] },
  'RST-008': { title: 'New chat: show the right-side tools', path: '/chat', steps: [sel('[data-test="start-surface-tools-toggle"]')] },
  'RST-009': { title: 'Chat run: saved-run settings (Edit Config)', path: '/chat', steps: [sendFirst, role('button', 'Edit Config')] },
  'RST-010': { title: 'Stored agent run: saved-run settings', path: '/workspace', steps: [openStoredAgentRun, role('button', 'Edit Config')] },
  'RST-011': { title: 'Stored team run: saved-run settings with members', path: '/workspace', steps: [openStoredTeamRun, role('button', 'Edit Config')] },
  'RST-012': { title: 'New chat (390x844): target switcher', path: '/chat', viewport: { width: 390, height: 844 }, steps: [openSwitcher] },
  // New chat Draft rows (eef9633, 9e90200)
  'DRF-001': { title: 'New chat: typed text becomes a Draft row under Chat after leaving', path: '/chat', steps: [focusComposer, typeKeys('Plan the synthetic launch notes'), text('Agents')] },
  'DRF-002': { title: 'Draft row reopens the New chat with its text', path: '/chat', steps: [focusComposer, typeKeys('Plan the synthetic launch notes'), text('Agents'), sel('[data-test="chat-draft-row"]')] },
  'DRF-003': { title: 'Draft row discard', path: '/chat', steps: [focusComposer, typeKeys('Plan the synthetic launch notes'), text('Agents'), hover('[data-test="chat-draft-row"]'), sel('[data-test="chat-draft-discard"]')] },
  // Mentions in a run (e08c4a8, a2a7b37)
  // Desktop host (Electron bridge substituted by install-host-scenario.js on both sides): the
  // native folder picker restored in the shared workspace menu (39d0e99).
  'HOST-001': { title: 'Desktop host: New chat workspace menu offers Browse…', path: '/chat', context: 'electron_internal', steps: [openWorkspace] },
  'HOST-002': { title: 'Desktop host: Browse… fills the chosen folder path', path: '/chat', context: 'electron_internal', steps: [openWorkspace, text('Open another folder…'), sel('[data-test="chat-workspace-browse"]')] },
  'HOST-003': { title: 'Desktop host: Workspaces + adds a folder through the native picker', path: '/workspace', context: 'electron_internal', steps: [role('button', /Add workspace/)], settleMs: 1500 },
  'MEN-001': { title: 'Chat run: @ lists agents and teams', path: '/chat', steps: [sendFirst, async page => { await page.locator('textarea.composer-text').last().click(); await page.keyboard.type('@'); await page.waitForTimeout(800) }] },
}

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
  const file = resolve(OUT, target, `${id}.png`)
  await page.screenshot({ path: file })
  const text = await page.locator('body').innerText()
  // Draft run ids embed Date.now() (`temp-<ms>-<n>`); compare them by shape.
  const route = (await page.evaluate(() => location.pathname + location.search)).replace(/temp-\d+-/g, 'temp-<ms>-')
  await ctx.close()
  return { file, text, route, errors, stepError, external }
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
  const pass = !s.stepError && !p.stepError && s.text === p.text && s.route === p.route && Boolean(noise) && p.errors.length === 0 && p.external.length === 0
  results.push({ id, title: FLOWS[id].title, pass, noise, pixels: d, route: [s.route, p.route], textEqual: s.text === p.text, sourceStepError: s.stepError, prototypeStepError: p.stepError, sourceErrors: s.errors, prototypeErrors: p.errors, prototypeExternal: p.external })
  console.log(`${pass ? 'PASS' : 'FAIL'} ${id} ${FLOWS[id].title} text=${s.text === p.text} px=${d.changed} max=${d.max} ${s.stepError ? 'SRC-STEP ' + s.stepError : ''} ${p.stepError ? 'PROTO-STEP ' + p.stepError : ''} srcErr=${s.errors.length} protoErr=${p.errors.length}`)
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
