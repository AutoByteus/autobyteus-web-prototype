#!/usr/bin/env node
// delegated-copy-task-locator focused refresh: paired click-through probe for the CANCELLED Task
// status added between origin/personal@1cd1a3a and @ff227eb (17e4299, 814e41a, 7f7b2c8): the
// "Cancelled (N)" toggle, the Cancelled lane, the Cancelled pills, and the open counts, on the
// full Projects pages and in the right panel's compact Projects tab. Same matched conditions and
// pass rule as probe-refresh-008.mjs, plus an element probe that must be identical on both
// sides: the toggle's aria-pressed, title, text and computed style; the lane order and grid
// columns; each status pill's text and computed style; and the focused element.
// Usage: node probe-cancelled-status.mjs [flow-id ...]
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
const OUT = resolve(root, process.env.FLOW_DIR || 'evidence/delegated-copy-task-locator/cancelled-status')
const CHROME = process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const style = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'

const role = (r, name) => async page => { await page.getByRole(r, { name }).first().click(); await page.waitForTimeout(700) }
const text = (value, exact = true) => async page => { await page.getByText(value, { exact }).first().click(); await page.waitForTimeout(700) }
const fill = (placeholder, value) => async page => { await page.getByPlaceholder(placeholder).first().fill(value); await page.waitForTimeout(600) }
const sel = (selector, index = 0) => async page => { await page.locator(selector).nth(index).click(); await page.waitForTimeout(700) }
const hover = selector => async page => { await page.locator(selector).first().hover(); await page.waitForTimeout(400) }
const rightTab = name => async page => { await page.locator('[data-test="right-side-tab-list"]').getByText(name, { exact: true }).first().click(); await page.waitForTimeout(900) }
const pick = (selector, value) => async page => { await page.locator(selector).first().selectOption(value); await page.waitForTimeout(800) }
const DESIGN_ONLY_HIDE = '[data-test="workspace-left-strip-workspaces"],[data-test="workspace-left-strip-workspaces-divider"]{visibility:hidden!important}'
const PROJECT = '/projects/project-prototype-launch'
const toggle = (scope = 'project-tasks') => sel(`[data-testid="${scope}-cancelled-toggle"]`)
const panelTab = rightTab('Projects')
const panelTemp = pick('[data-testid="projects-panel-picker-select"]', 'temp')
const key = name => async page => { await page.keyboard.press(name); await page.waitForTimeout(500) }
const focusSearch = selector => async page => { await page.locator(selector).first().focus(); await page.waitForTimeout(200) }

export const FLOWS = {
  // Project board (ProjectTaskBoard.vue, CancelledTasksToggle.vue)
  'CAN-001': { title: 'Project board: "Cancelled (1)" toggle off; three lanes; the Cancelled Task hidden', path: PROJECT, steps: [] },
  'CAN-002': { title: 'Project board: toggle on shows the Cancelled lane last (four columns)', path: PROJECT, steps: [toggle()] },
  'CAN-003': { title: 'Project board: toggle off again hides the lane', path: PROJECT, steps: [toggle(), toggle()] },
  'CAN-004': { title: 'Project board: toggle hover', path: PROJECT, steps: [hover('[data-testid="project-tasks-cancelled-toggle"]')] },
  'CAN-005': { title: 'Project board: keyboard focus on the toggle and Space turns it on', path: PROJECT, steps: [focusSearch('[data-testid="project-tasks-search-input"]'), key('Tab'), key('Space')] },
  'CAN-006': { title: 'Project board: search matching only a hidden Cancelled Task shows No match', path: PROJECT, steps: [fill('Search tasks', 'banner')] },
  'CAN-007': { title: 'Project board: the same search with the toggle on shows it in the Cancelled lane', path: PROJECT, steps: [fill('Search tasks', 'banner'), toggle()] },
  'CAN-008': { title: 'Project board: a Cancelled card opens its Task page with the Cancelled pill', path: PROJECT, steps: [toggle(), text('Retire the unused synthetic welcome banner.')] },
  'CAN-009': { title: 'Project board: every visit starts hidden (toggle on, open a Task, back to tasks)', path: PROJECT, steps: [toggle(), text('Retire the unused synthetic welcome banner.'), role('link', /Back to tasks/)] },
  'CAN-010': { title: 'Task page: Cancelled pill and closed agent root', path: `${PROJECT}/tasks/task-retire`, steps: [] },
  'CAN-011': { title: 'Task page: To Do pill', path: `${PROJECT}/tasks/task-outline`, steps: [] },
  'CAN-012': { title: 'Task page: In Progress pill', path: `${PROJECT}/tasks/task-review`, steps: [] },
  'CAN-013': { title: 'Task page: Done pill', path: `${PROJECT}/tasks/task-publish`, steps: [] },
  'CAN-014': { title: 'No Cancelled Tasks: delete the only Cancelled Task; the board has no toggle', path: `${PROJECT}/tasks/task-retire`, steps: [sel('[data-testid="task-page-delete"]'), sel('[data-testid="task-page-delete-confirm"]')], settleMs: 1200 },
  // Projects list (ProjectCard.vue, TempTasksLink.vue): open counts leave Done and Cancelled out
  'CAN-020': { title: 'Projects: card open-task count and Temp tasks count leave Cancelled out', path: '/projects', steps: [] },
  // Temp tasks board and page (TempTaskBoard.vue, TempTaskDetail.vue)
  'CAN-030': { title: 'Temp tasks: "Cancelled (1)" toggle off; Open and Done lanes', path: '/projects/temp-tasks', steps: [] },
  'CAN-031': { title: 'Temp tasks: toggle on shows the Cancelled lane last (three columns)', path: '/projects/temp-tasks', steps: [toggle('temp-tasks')] },
  'CAN-032': { title: 'Temp tasks: search matching only the hidden Cancelled task shows No match', path: '/projects/temp-tasks', steps: [fill('Search tasks', 'FAQ')] },
  'CAN-033': { title: 'Temp tasks: the same search with the toggle on', path: '/projects/temp-tasks', steps: [fill('Search tasks', 'FAQ'), toggle('temp-tasks')] },
  'CAN-034': { title: 'Temp task page: Cancelled pill', path: '/projects/temp-tasks/tasks/temp-task-faq', steps: [] },
  'CAN-035': { title: 'Temp task page: Open pill', path: '/projects/temp-tasks/tasks/temp-task-links', steps: [] },
  'CAN-036': { title: 'No Cancelled Tasks: empty Temp tasks board has no toggle', path: '/projects/temp-tasks', scenario: 'empty', steps: [] },
  // Right panel Projects tab (compact boards, ProjectsPanelTaskDetail.vue)
  'CAN-040': { title: 'Projects tab: compact board with the toggle off', path: '/workspace', steps: [panelTab] },
  'CAN-041': { title: 'Projects tab: toggle on stacks the Cancelled lane last', path: '/workspace', steps: [panelTab, toggle()] },
  'CAN-042': { title: 'Projects tab: a Cancelled Project Task opens in the tab with the Cancelled pill', path: '/workspace', steps: [panelTab, toggle(), text('Retire the unused synthetic welcome banner.')] },
  'CAN-043': { title: 'Projects tab: a To Do Project Task pill in the tab', path: '/workspace', steps: [panelTab, text('Outline the launch checklist.')] },
  'CAN-044': { title: 'Projects tab: an In Progress Project Task pill in the tab', path: '/workspace', steps: [panelTab, text('Review the synthetic navigation baseline.')] },
  'CAN-045': { title: 'Projects tab: a Done Project Task pill in the tab', path: '/workspace', steps: [panelTab, text('Publish the deterministic evidence summary.')] },
  'CAN-046': { title: 'Projects tab: Temp tasks with the toggle off', path: '/workspace', steps: [panelTab, panelTemp] },
  'CAN-047': { title: 'Projects tab: Temp tasks with the toggle on', path: '/workspace', steps: [panelTab, panelTemp, toggle('temp-tasks')] },
  'CAN-048': { title: 'Projects tab: a Cancelled Temp task in the tab', path: '/workspace', steps: [panelTab, panelTemp, toggle('temp-tasks'), text('Draft a synthetic FAQ for the paused pilot.')] },
  'CAN-049': { title: 'Projects tab: an Open Temp task pill in the tab', path: '/workspace', steps: [panelTab, panelTemp, text('Check the synthetic glossary for duplicates.')] },
  'CAN-050': { title: 'Projects tab: Temp search matching only the hidden Cancelled task', path: '/workspace', steps: [panelTab, panelTemp, fill('Search tasks', 'FAQ')] },
  // Locale and narrow samples
  'CAN-060': { title: 'Project board (zh-CN): toggle on', path: PROJECT, locale: 'zh-CN', steps: [toggle()] },
  'CAN-061': { title: 'Temp tasks (zh-CN): toggle off, then the Cancelled task page', path: '/projects/temp-tasks/tasks/temp-task-faq', locale: 'zh-CN', steps: [] },
  'CAN-062': { title: 'Project board (zh-CN): toggle off', path: PROJECT, locale: 'zh-CN', steps: [] },
  'CAN-070': { title: 'Project board (390x844): toggle on, single column', path: PROJECT, viewport: { width: 390, height: 844 }, steps: [toggle()] },
  'CAN-071': { title: 'Temp tasks (390x844): toggle on, single column', path: '/projects/temp-tasks', viewport: { width: 390, height: 844 }, steps: [toggle('temp-tasks')] },
}

// Element probe: identical on both sides or the flow fails.
const PROBE_STYLES = ['display', 'background-color', 'color', 'border-top-color', 'border-top-width', 'border-radius', 'box-shadow', 'padding-top', 'padding-left', 'padding-right', 'font-size', 'font-weight', 'line-height', 'min-height', 'gap', 'margin-left', 'grid-template-columns', 'outline-style']
const probeElements = page => page.evaluate(styles => {
  const pick = el => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect()
    return { testid: el.getAttribute('data-testid'), ariaPressed: el.getAttribute('aria-pressed'), title: el.getAttribute('title'), text: el.innerText?.trim().slice(0, 80), rect: [r.x, r.y, r.width, r.height].map(v => Math.round(v * 10) / 10), style: Object.fromEntries(styles.map(s => [s, cs.getPropertyValue(s)])) }
  }
  const q = s => [...document.querySelectorAll(s)].filter(el => el.getClientRects().length).map(pick)
  return {
    toggles: q('[data-testid$="-cancelled-toggle"]'),
    refresh: q('[data-testid="project-tasks-refresh"],[data-testid="temp-tasks-refresh"]'),
    grids: q('[data-testid="project-task-columns"],[data-testid="temp-task-lanes"]'),
    lanes: q('[data-testid^="project-task-column-"]:not([data-testid="project-task-column-count"]):not([data-testid="project-task-column-empty"]),[data-testid^="temp-task-lane-"]:not([data-testid="temp-task-lane-count"])').map(l => ({ testid: l.testid, text: l.text, rect: l.rect })),
    pills: q('[data-testid="task-page-status"],[data-testid="temp-task-status"],[data-testid="projects-panel-task-status"]'),
    noMatch: q('[data-testid="project-tasks-no-match"],[data-testid="temp-tasks-no-match"]').map(n => n.text),
    focused: (() => { const a = document.activeElement; return a ? (a.getAttribute('data-testid') || a.tagName) : null })(),
  }
}, PROBE_STYLES)

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
  // The narrow strip's Workspaces icon is the accepted design-only change of
  // collapsed-left-panel-expand-keeps-run (no source equivalent): hidden on the baseline side
  // only for the screenshot; it sits after every source strip item, so nothing else moves.
  if (target === 'prototype') { await page.addStyleTag({ content: DESIGN_ONLY_HIDE }); await page.waitForTimeout(60) }
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
