#!/usr/bin/env node
// WEB-BASELINE-REFRESH-011 paired click-through probe for the surfaces changed between 2f21134 and
// origin/personal@9227d61: Settings → Server Settings → Embedding (8469d4b, 70bb036), meaning search on the
// Projects board (54e26d7, 722b9b3), "part of" on the board, Task page, tab and editor (179ddb9), and the bulk
// MCP import failures (df15c43, c5161ed). Same matched conditions and pass rule as probe-refresh-010.mjs.
// Design-only data is off on the baseline side.
// Usage: node probe-refresh-011.mjs [flow-id ...]
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
const OUT = resolve(root, process.env.FLOW_DIR || 'evidence/WEB-BASELINE-REFRESH-011/flows')
const CHROME = process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const style = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'

const sel = (selector, index = 0) => async page => { await page.locator(selector).nth(index).click(); await page.waitForTimeout(700) }
const wait = ms => async page => { await page.waitForTimeout(ms) }
const rightTab = name => async page => { await page.locator('[data-test="right-side-tab-list"]').getByText(name, { exact: true }).first().click(); await page.waitForTimeout(900) }
const PROJECT = '/projects/project-prototype-launch'
const EMB = '/settings?section=server-settings&mode=embedding'
const G = 'granite-embedding-small-english-r2', L = 'mdbr-leaf-ir', M = 'embeddinggemma-2'
const tid = (id) => sel(`[data-testid="${id}"]`)
const search = (value) => async page => { await page.locator('[data-testid="project-tasks-search-input"]').first().fill(value); await page.waitForTimeout(1500) }
// In-app navigation (a reload would reset the baseline's in-memory state).
const goto = (path) => async page => { await page.evaluate(to => document.querySelector('#__nuxt').__vue_app__.config.globalProperties.$router.push(to), path); await page.waitForTimeout(2500) }
const typeArea = (value) => async page => { await page.locator('textarea').first().fill(value); await page.waitForTimeout(400) }
const MCP_JSON_PARTIAL = JSON.stringify({ mcpServers: { 'synthetic-files': { command: 'synthetic-files-server', args: [] }, 'synthetic-broken': { args: ['--port', '9000'] } } }, null, 2)
const MCP_JSON_NONE = JSON.stringify({ mcpServers: { 'synthetic-broken': { args: ['--port', '9000'] }, 'synthetic-empty': {} } }, null, 2)
const MCP_JSON_OK = JSON.stringify({ mcpServers: { 'synthetic-files': { command: 'synthetic-files-server', args: [] } } }, null, 2)
const openBulkImport = async page => { await page.getByRole('button', { name: /Bulk Import/ }).first().click(); await page.waitForTimeout(800) }
const runImport = async page => { await page.getByRole('button', { name: /^Import/ }).last().click(); await page.waitForTimeout(1500) }

export const FLOWS = {
  // Settings → Server Settings → Embedding (8469d4b)
  'EMB-001': { title: 'Embedding: models (active ready, downloaded, not downloaded) and Project indexes', path: EMB, steps: [] },
  'EMB-002': { title: 'Embedding: download a model ahead; progress', path: EMB, steps: [tid(`embedding-model-${M}-download`), wait(3000)] },
  'EMB-003': { title: 'Embedding: the download completes', path: EMB, steps: [tid(`embedding-model-${M}-download`), wait(15000)] },
  'EMB-004': { title: 'Embedding: cancel a download', path: EMB, steps: [tid(`embedding-model-${M}-download`), wait(2500), tid(`embedding-model-${M}-cancel`), wait(1500)] },
  'EMB-005': { title: 'Embedding: Remove asks for confirmation', path: EMB, steps: [tid(`embedding-model-${L}-remove`)] },
  'EMB-006': { title: 'Embedding: confirm Remove', path: EMB, steps: [tid(`embedding-model-${L}-remove`), tid(`embedding-model-${L}-remove-confirm`), wait(1500)] },
  'EMB-007': { title: 'Embedding: keep the model', path: EMB, steps: [tid(`embedding-model-${L}-remove`), tid(`embedding-model-${L}-remove-cancel`)] },
  'EMB-008': { title: 'Embedding: switch dialog for a model that is not downloaded', path: EMB, steps: [tid(`embedding-model-${M}-use`)] },
  'EMB-009': { title: 'Embedding: switch dialog for a downloaded model', path: EMB, steps: [tid(`embedding-model-${L}-use`)] },
  'EMB-010': { title: 'Embedding: switch; the model prepares, Projects are not indexed', path: EMB, steps: [tid(`embedding-model-${L}-use`), tid('embedding-switch-confirm'), wait(1500)] },
  'EMB-011': { title: 'Embedding: after the switch the model is ready', path: EMB, steps: [tid(`embedding-model-${L}-use`), tid('embedding-switch-confirm'), wait(5000)] },
  'EMB-012': { title: 'Embedding: switch, then Index all Projects', path: EMB, steps: [tid(`embedding-model-${L}-use`), tid('embedding-switch-confirm'), wait(5000), tid('embedding-index-all'), wait(1500)] },
  'EMB-013': { title: 'Embedding: Rebuild asks for confirmation', path: EMB, steps: [tid('embedding-project-project-prototype-launch-rebuild')] },
  'EMB-014': { title: 'Embedding: confirm Rebuild; the Project indexes', path: EMB, steps: [tid('embedding-project-project-prototype-launch-rebuild'), tid('embedding-project-project-prototype-launch-rebuild-confirm'), wait(4500)] },
  'EMB-015': { title: 'Embedding (busy): every index state', path: EMB, scenario: 'embedding_busy', steps: [] },
  'EMB-016': { title: 'Embedding (busy): the Indexing filter', path: EMB, scenario: 'embedding_busy', steps: [async page => { await page.locator('[data-testid^="embedding-filter-"]').nth(2).click(); await page.waitForTimeout(600) }] },
  'EMB-017': { title: 'Embedding (many Projects): find a Project', path: EMB, scenario: 'embedding_many', steps: [async page => { await page.locator('[data-testid="embedding-project-find"]').fill('market'); await page.waitForTimeout(600) }] },
  'EMB-018': { title: 'Embedding (many Projects): find with no match', path: EMB, scenario: 'embedding_many', steps: [async page => { await page.locator('[data-testid="embedding-project-find"]').fill('zzz'); await page.waitForTimeout(600) }] },
  'EMB-029': { title: 'Embedding (many Projects): the list with Find', path: EMB, scenario: 'embedding_many', steps: [] },
  'EMB-030': { title: 'Embedding (many Projects): Needs indexing filter', path: EMB, scenario: 'embedding_many', steps: [async page => { await page.locator('[data-testid^="embedding-filter-"]').nth(1).click(); await page.waitForTimeout(600) }] },
  'EMB-019': { title: 'Embedding (busy): Index now on a Project that is not indexed', path: EMB, scenario: 'embedding_busy', steps: [tid('embedding-project-project-marketing-site-index'), wait(1500)] },
  'EMB-020': { title: 'Embedding: the active model is unavailable', path: EMB, scenario: 'embedding_unavailable', steps: [] },
  'EMB-021': { title: 'Embedding: retry the unavailable model', path: EMB, scenario: 'embedding_unavailable', steps: [tid(`embedding-model-${G}-retry`), wait(3500)] },
  'EMB-022': { title: 'Embedding: the first status read fails', path: EMB, scenario: 'embedding_load_failed', steps: [] },
  'EMB-023': { title: 'Embedding: Retry loads the section', path: EMB, scenario: 'embedding_load_failed', steps: [tid('embedding-load-retry'), wait(1500)] },
  'EMB-024': { title: 'Embedding (offline): a download fails', path: EMB, scenario: 'embedding_offline', steps: [tid(`embedding-model-${M}-download`), wait(4500)] },
  'EMB-032': { title: 'Embedding (offline): Retry the failed download; it completes', path: EMB, scenario: 'embedding_offline', steps: [tid(`embedding-model-${M}-download`), wait(4500), tid(`embedding-model-${M}-retry`), wait(15000)] },
  'EMB-033': { title: 'Embedding (offline): switch to a model whose download fails; the model is unavailable', path: EMB, scenario: 'embedding_offline', steps: [tid(`embedding-model-${M}-use`), tid('embedding-switch-confirm'), wait(4500)] },
  'EMB-034': { title: 'Embedding (offline): Retry the unavailable model; it downloads again', path: EMB, scenario: 'embedding_offline', steps: [tid(`embedding-model-${M}-use`), tid('embedding-switch-confirm'), wait(4500), tid(`embedding-model-${M}-retry`), wait(2500)] },
  'EMB-035': { title: 'Embedding (offline): Index all while the model prepares again', path: EMB, scenario: 'embedding_offline', steps: [tid(`embedding-model-${M}-use`), tid('embedding-switch-confirm'), wait(4500), tid(`embedding-model-${M}-retry`), wait(1000), tid('embedding-index-all'), wait(1500)] },
  'EMB-025': { title: 'Embedding (empty): no Projects', path: EMB, scenario: 'empty', steps: [] },
  'EMB-026': { title: 'Settings: Server Settings → Basics, then Embedding', path: '/settings?section=server-settings&mode=quick', steps: [tid('settings-nav-server-settings-embedding'), wait(1500)] },
  'EMB-027': { title: 'Embedding (390x844)', path: EMB, viewport: { width: 390, height: 844 }, steps: [] },
  'EMB-028': { title: 'Embedding (zh-CN)', path: EMB, locale: 'zh-CN', steps: [] },
  'EMB-031': { title: 'Embedding: Back to Workspace (the left panel mounts after Settings)', path: EMB, steps: [tid('settings-nav-back'), wait(2500)] },
  // Meaning search on the board (54e26d7)
  'SRC-001': { title: 'Board search: exact matches first', path: PROJECT, steps: [search('launch')] },
  'SRC-002': { title: 'Board search: related by meaning', path: PROJECT, steps: [search('checklists')] },
  'SRC-003': { title: 'Board search: no match', path: PROJECT, steps: [search('zzz')] },
  'SRC-004': { title: 'Board search while meaning search prepares (after a model switch)', path: EMB, steps: [tid(`embedding-model-${M}-use`), tid('embedding-switch-confirm'), wait(800), goto(PROJECT), search('checklists')] },
  'SRC-005': { title: 'Board search when meaning search is unavailable', path: PROJECT, scenario: 'embedding_unavailable', steps: [search('checklists')] },
  'SRC-006': { title: 'Board search: retry an unavailable model', path: PROJECT, scenario: 'embedding_unavailable', steps: [search('checklists'), tid('project-tasks-meaning-retry'), wait(2500)] },
  // "part of" (179ddb9)
  'PRT-001': { title: 'Board: part markers and the parent progress', path: PROJECT, steps: [] },
  'PRT-002': { title: 'Parent Task page: Parts (progress, cancelled part)', path: `${PROJECT}/tasks/task-outline`, steps: [] },
  'PRT-003': { title: 'Part Task page: Part of', path: `${PROJECT}/tasks/task-translate`, steps: [] },
  'PRT-004': { title: 'Edit a parent: Part of offers nothing (it has parts)', path: `${PROJECT}/tasks/task-outline/edit`, steps: [] },
  'PRT-005': { title: 'Edit a part: Part of chosen; open the list', path: `${PROJECT}/tasks/task-translate/edit`, steps: [tid('task-part-of-remove'), sel('[data-testid="task-part-of-input"]')] },
  'PRT-006': { title: 'Edit a part: remove Part of and Save', path: `${PROJECT}/tasks/task-translate/edit`, steps: [tid('task-part-of-remove'), sel('[data-testid="task-page-save"]'), wait(3800)] },
  'PRT-007': { title: 'Parts: New part opens New task with Part of set', path: `${PROJECT}/tasks/task-outline`, steps: [tid('task-parts-new'), wait(1200)] },
  'PRT-008': { title: 'New task as a part: Create', path: `${PROJECT}/tasks/task-outline`, steps: [tid('task-parts-new'), wait(1200), typeArea('Check the rollback steps.'), sel('[data-testid="task-page-save"]'), wait(3800)] },
  'PRT-009': { title: 'Projects tab: the parent with its parts', path: '/workspace', steps: [rightTab('Projects'), sel('[data-testid="project-task-row-task-outline"]')] },
  'PRT-010': { title: 'Parent Task page (zh-CN)', path: `${PROJECT}/tasks/task-outline`, locale: 'zh-CN', steps: [] },
  'PRT-011': { title: 'Board (390x844) with parts', path: PROJECT, viewport: { width: 390, height: 844 }, steps: [] },
  // Bulk MCP import (df15c43, c5161ed)
  'MCP-001': { title: 'MCP servers: Bulk Import view', path: '/settings?section=mcp-servers', steps: [openBulkImport] },
  'MCP-002': { title: 'Bulk import with one failing entry: partial notice and the failures in view', path: '/settings?section=mcp-servers', expect: '#bulk-import-failures', steps: [openBulkImport, typeArea(MCP_JSON_PARTIAL), runImport] },
  'MCP-004': { title: 'Bulk import where every entry fails: nothing imported', path: '/settings?section=mcp-servers', expect: '#bulk-import-failures', steps: [openBulkImport, typeArea(MCP_JSON_NONE), runImport] },
  'MCP-003': { title: 'Bulk import: every entry imported', path: '/settings?section=mcp-servers', steps: [openBulkImport, typeArea(MCP_JSON_OK), runImport] },
}

// The state each flow is about (checked on both sides before comparing).
const EXPECT = {
  'EMB-001': '[data-testid="embedding-model-granite-embedding-small-english-r2"][data-state="active-ready"]',
  'EMB-002': '[data-testid="embedding-model-embeddinggemma-2-progress"]', 'EMB-003': '[data-testid="embedding-model-embeddinggemma-2"][data-state="downloaded"]',
  'EMB-004': '[data-testid="embedding-model-embeddinggemma-2"][data-state="not_downloaded"]', 'EMB-005': '[data-testid="embedding-model-mdbr-leaf-ir-remove-confirmation"]',
  'EMB-006': '[data-testid="embedding-model-mdbr-leaf-ir"][data-state="not_downloaded"]', 'EMB-007': '[data-testid="embedding-model-mdbr-leaf-ir"][data-state="downloaded"]',
  'EMB-008': '[data-testid="embedding-switch-dialog"]', 'EMB-009': '[data-testid="embedding-switch-dialog"]',
  'EMB-010': '[data-testid="embedding-project-project-prototype-launch"][data-state="NOT_INDEXED"]', 'EMB-011': '[data-testid="embedding-model-mdbr-leaf-ir"][data-state="active-ready"]',
  'EMB-013': '[data-testid="embedding-project-project-prototype-launch-rebuild-confirmation"]', 'EMB-015': '[data-testid^="embedding-project-"][data-state="WAITING"]',
  'EMB-017': '[data-testid="embedding-project-project-marketing-site"]', 'EMB-018': '[data-testid="embedding-projects-no-match"]',
  'EMB-020': '[data-testid="embedding-model-granite-embedding-small-english-r2-unavailable"]', 'EMB-022': '[data-testid="embedding-load-error"]',
  'EMB-023': '[data-testid="embedding-models-card"]', 'EMB-024': '[data-testid="embedding-model-embeddinggemma-2-failed"]',
  'EMB-025': '[data-testid="embedding-projects-empty"]', 'EMB-029': '[data-testid="embedding-project-find"]',
  'EMB-032': '[data-testid="embedding-model-embeddinggemma-2"][data-state="downloaded"]', 'EMB-033': '[data-testid="embedding-model-embeddinggemma-2-unavailable"]',
  'EMB-034': '[data-testid="embedding-model-embeddinggemma-2-preparing"]', 'EMB-035': '[data-testid="embedding-project-project-prototype-launch"][data-state="WAITING"]',
  'SRC-001': '[data-testid="project-task-row-task-outline"]', 'SRC-003': '[data-testid="project-tasks-no-match"]',
  'SRC-004': '[data-testid="project-tasks-meaning-status"]', 'SRC-005': '[data-testid="project-tasks-meaning-retry"]',
  'PRT-001': '[data-testid="task-part-of-marker"]', 'PRT-002': '[data-testid="task-parts"]', 'PRT-003': '[data-testid="task-part-of"]',
  'PRT-004': '[data-testid="task-part-of-has-parts"]', 'PRT-005': '[data-testid="task-part-of-options"]', 'PRT-007': '[data-testid="task-part-of-selected"]',
  'MCP-001': 'textarea',
}
for (const [id, selector] of Object.entries(EXPECT)) if (FLOWS[id] && !FLOWS[id].expect) FLOWS[id].expect = selector

// Element probe: identical on both sides or the flow fails.
const PROBE_STYLES = ['display', 'background-color', 'color', 'border-top-color', 'border-top-width', 'border-radius', 'box-shadow', 'padding-top', 'padding-left', 'font-size', 'font-weight', 'line-height', 'opacity', 'width']
const PROBE_SELECTORS = [
  '[data-testid^="embedding-model-"][data-state]', '[data-testid$="-progress"]', '[data-testid$="-status"]', '[data-testid="embedding-disk-total"]', '[data-testid="embedding-switch-dialog"]', '[data-testid="embedding-switch-cost"]',
  '[data-testid^="embedding-project-"][data-state]', '[data-testid^="embedding-filter-"]', '[data-testid="embedding-announce"]', '[data-testid="embedding-action-error"]', '[data-testid="embedding-load-error"]',
  '[data-testid="project-tasks-meaning-status"]', '[data-testid^="project-task-row-task-"]',
  '[data-testid="task-part-of-marker"]', '[data-testid="task-parts-progress"]', '[data-testid="task-parts"]', '[data-testid="task-part-of"]', '[data-testid="task-part-of-picker"]', '[data-testid="task-part-of-selected"]',
  '#bulk-import-failures',
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
  // The state a flow is about must be on screen; otherwise both sides could agree on the wrong state.
  if (!stepError && flow.expect && (await page.locator(flow.expect).count()) === 0) stepError = `expected state missing: ${flow.expect}`
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
  // WEB-BASELINE-REFRESH-011: a fixture the pinned contract rejects shows the same zod issue text on both sides; it never passes.
  const contractRejected = /"code": "(?:invalid_type|invalid_union|invalid_value|unrecognized_keys)"/.test(s.text)
  const pass = probeEqual && !s.stepError && !p.stepError && s.text === p.text && s.route === p.route && Boolean(noise) && p.errors.length === 0 && p.external.length === 0 && !contractRejected
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
