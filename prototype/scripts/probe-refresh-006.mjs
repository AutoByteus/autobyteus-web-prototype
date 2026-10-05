#!/usr/bin/env node
// WEB-BASELINE-REFRESH-006 paired click-through probe for the surfaces that
// changed between origin/personal@0a32261 and @4dee901: managed skill sources
// (local folders and public GitHub repositories), agent-to-agent rows in the
// event-monitor browse mode (read from the host package for a task Agent), and
// a standalone run's token usage including its collaborators.
// Same matched conditions and pass rule as probe-flow.mjs: identical visible
// text and route, screenshot equal up to edge anti-aliasing or compositing
// rounding, no prototype browser errors and no non-local requests.
// Usage: node probe-refresh-006.mjs [flow-id-prefix ...]
import { chromium } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'
const require = createRequire(import.meta.url)
const icons = Object.fromEntries(['heroicons', 'ph', 'mdi', 'svg-spinners', 'vscode-icons', 'logos'].map(p => [p, require(`@iconify-json/${p}/icons.json`)]))
const root = resolve(new URL('../..', import.meta.url).pathname)
const SOURCE = process.env.SOURCE_BASE_URL || 'http://127.0.0.1:4543'
const PROTO = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4541'
const MOCK = process.env.MOCK_BASE_URL || 'http://127.0.0.1:4544'
const OUT = resolve(root, process.env.FLOW_DIR || 'evidence/WEB-BASELINE-REFRESH-006/refresh-flows')
const CHROME = process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const style = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'

const wait = ms => page => page.waitForTimeout(ms)
const tid = (id, action = 'click') => async page => { await page.getByTestId(id).first()[action](); await page.waitForTimeout(800) }
const fillSel = (selector, value) => async page => { await page.locator(selector).first().fill(value); await page.waitForTimeout(500) }
const role = (r, name) => async page => { await page.getByRole(r, { name, exact: true }).first().click(); await page.waitForTimeout(900) }
const text = value => async page => { await page.getByText(value, { exact: true }).first().click(); await page.waitForTimeout(900) }
// WEB-BASELINE-REFRESH-004: with the server's real workspace kind the synthetic workspace can
// already be expanded; open it only when its runs are not shown.
const ensureWorkspaceOpen = async page => {
  if (!(await page.getByText('Product Review Team', { exact: true }).first().isVisible().catch(() => false))) {
    await page.getByText('prototype-workspace', { exact: true }).first().click(); await page.waitForTimeout(900)
  }
}
const openStoredTeamRun = async page => {
  await ensureWorkspaceOpen(page)
  for (const label of ['Product Review Team', 'Review the current prototype baseline']) { await text(label)(page) }
}
const openStoredOrgRun = async page => {
  await ensureWorkspaceOpen(page)
  for (const label of ['Product Launch Org', 'Coordinate the synthetic launch review']) { await text(label)(page) }
}
const openStoredAgentRun = async page => {
  await ensureWorkspaceOpen(page)
  for (const label of ['Research Assistant', 'Compare current navigation states']) { await text(label)(page) }
}

const openSources = async page => { await page.getByRole('button', { name: 'Sources', exact: true }).first().click(); await page.waitForTimeout(1200) }
const sourceRow = (url) => page => page.locator('article.source-row', { hasText: url }).first()
const rowButton = (url, name) => async page => { await sourceRow(url)(page).getByRole('button', { name, exact: true }).click(); await page.waitForTimeout(900) }
const dialogScroll = async page => { await page.locator('.dialog .content').first().evaluate(el => { el.scrollTop = el.scrollHeight }); await page.waitForTimeout(300) }
const scrollUpForEarlier = async page => {
  await page.mouse.move(650, 300)
  for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, -400); await page.waitForTimeout(400) }
  await page.waitForTimeout(1500)
}
const openTaskAgent = async page => { await openStoredAgentRun(page); await text('documentation writer')(page) }
const openTokenTab = async page => { await page.locator('[data-test="right-side-tab-list"]').getByText(/^Token/).first().click(); await page.waitForTimeout(1200) }
const GH_DOCS = 'https://github.com/synthetic-org/docs-skills'
const GH_REVIEW = 'https://github.com/synthetic-org/review-skills'
const GH_LEGACY = 'https://github.com/synthetic-org/legacy-skills'
const GH_OLD = 'https://github.com/synthetic-org/old-skills'

export const FLOWS = {
  // Managed skill sources (4dee901).
  'SKS-001': { title: 'Skills: Sources opens the dialog (default, up to date, check failed)', path: '/skills', steps: [openSources] },
  'SKS-002': { title: 'Skill sources: scrolled to the update-available row, local folder and the add form', path: '/skills', steps: [openSources, dialogScroll] },
  'SKS-003': { title: 'Skill sources: GitHub mode of the add form', path: '/skills', steps: [openSources, dialogScroll, role('button', 'GitHub')] },
  'SKS-004': { title: 'Skill sources: import a public GitHub repository', path: '/skills', steps: [openSources, role('button', 'GitHub'), fillSel('#skill-source-input', 'https://github.com/acme/launch-skills'), role('button', 'Import repository'), wait(800), dialogScroll] },
  'SKS-005': { title: 'Skill sources: an invalid repository URL is rejected', path: '/skills', steps: [openSources, role('button', 'GitHub'), fillSel('#skill-source-input', 'not a repository'), role('button', 'Import repository'), wait(800)] },
  'SKS-006': { title: 'Skill sources: add a local folder', path: '/skills', steps: [openSources, fillSel('#skill-source-input', '/synthetic/extra-skills'), role('button', 'Add Folder'), wait(800), dialogScroll] },
  'SKS-007': { title: 'Skill sources: Check again on a GitHub source', path: '/skills', steps: [openSources, rowButton(GH_DOCS, 'Check again')] },
  'SKS-008': { title: 'Skill sources: Update opens the whole-source confirmation', path: '/skills', steps: [openSources, rowButton(GH_REVIEW, 'Update')] },
  'SKS-009': { title: 'Skill sources: confirm update (up to date, success notice)', path: '/skills', steps: [openSources, rowButton(GH_REVIEW, 'Update'), async page => { await page.locator('.confirm-source').waitFor(); await page.getByRole('button', { name: 'Update', exact: true }).last().click(); await page.waitForTimeout(1200) }] },
  'SKS-010': { title: 'Skill sources: Remove a GitHub source opens the delete confirmation', path: '/skills', steps: [openSources, rowButton(GH_LEGACY, 'Remove')] },
  'SKS-011': { title: 'Skill sources: confirm GitHub source removal', path: '/skills', steps: [openSources, rowButton(GH_LEGACY, 'Remove'), async page => { await page.getByRole('button', { name: 'Remove', exact: true }).last().click(); await page.waitForTimeout(1200) }] },
  'SKS-012': { title: 'Skill sources: Remove a local folder opens the unlink confirmation', path: '/skills', steps: [openSources, dialogScroll, rowButton('/synthetic/team-skills', 'Remove')] },
  'SKS-013': { title: 'Skill sources: update failed and incomplete removal states', path: '/skills', scenario: 'skill_source_issues', steps: [openSources, dialogScroll] },
  'SKS-014': { title: 'Skill sources: Retry removal', path: '/skills', scenario: 'skill_source_issues', steps: [openSources, dialogScroll, rowButton(GH_OLD, 'Retry removal')] },
  'SKS-015': { title: 'Skill sources: Done closes the dialog', path: '/skills', steps: [openSources, role('button', 'Done')] },
  'SKS-016': { title: 'Skill sources (narrow)', path: '/skills', viewport: 'narrow', steps: [openSources] },
  // Event-monitor browse mode (4dee901).
  'BRW-001': { title: 'Task Agent conversation (scrollable, earlier events available)', path: '/workspace', steps: [openTaskAgent] },
  'BRW-002': { title: 'Task Agent: scrolling up loads earlier events from the host package, with "From <Sender>:" rows', path: '/workspace', steps: [openTaskAgent, scrollUpForEarlier] },
  'BRW-003': { title: 'Task Agent browse: back to the latest', path: '/workspace', steps: [openTaskAgent, scrollUpForEarlier, tid('event-monitor-jump-to-latest')] },
  // Standalone run token usage (4dee901).
  'TOK-001': { title: 'Stored Agent run: Token tab shows the run roll-up', path: '/workspace', steps: [openStoredAgentRun, openTokenTab] },
  'TOK-002': { title: 'Task Agent: Token tab', path: '/workspace', steps: [openTaskAgent, openTokenTab] },
  // The Token tab now runs the source's own meter store for every run kind (see the report).
  'TOK-004': { title: 'Stored Team run member: Token tab', path: '/workspace', steps: [openStoredTeamRun, openTokenTab] },
  'TOK-005': { title: 'Stored Org run member: Token tab', path: '/workspace', steps: [openStoredOrgRun, text('analyst'), openTokenTab] },
  'TOK-003': { title: 'Chat run: Token tab', path: '/chat', steps: [async page => { await page.getByPlaceholder('Ask anything · / for skills · @ for an agent or team').first().click(); await page.keyboard.type('Summarize the synthetic baseline.', { delay: 20 }); await page.keyboard.press('Enter'); await page.waitForTimeout(2500) }, openTokenTab] },
}

const requested = process.argv.slice(2)
const selected = Object.keys(FLOWS).filter(id => !requested.length || requested.some(prefix => id.startsWith(prefix)))
const browser = await chromium.launch({ headless: true, executablePath: CHROME, args: ['--no-sandbox', '--disable-background-networking', '--font-render-hinting=none'] })
await mkdir(resolve(OUT, 'source'), { recursive: true }); await mkdir(resolve(OUT, 'prototype'), { recursive: true })
const viewportFor = name => name === 'narrow' ? { width: 390, height: 844 } : { width: 1440, height: 900 }

async function run(base, target, id) {
  const flow = FLOWS[id]
  const scenario = flow.scenario || 'populated'
  // Restores the observation node's synthetic data (Project/Task saves) before every run.
  await fetch(`${MOCK}/__prototype/scenario`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scenario, operationFailures: {} }) })
  const viewport = viewportFor(flow.viewport)
  const ctx = await browser.newContext({ viewport, locale: 'en-US', colorScheme: 'light', reducedMotion: 'reduce', timezoneId: 'UTC' })
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
  await ctx.addInitScript(({ scenario }) => {
    if (sessionStorage.getItem('__flow_init')) return
    sessionStorage.setItem('__flow_init', '1')
    localStorage.clear()
    localStorage.setItem('autobyteus.localization.preference-mode', 'en')
    localStorage.setItem('autobyteus.prototype.scenario', scenario)
    localStorage.setItem('autobyteus.prototype.context', 'desktop')
  }, { scenario })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(`pageerror: ${e.message.slice(0, 400)}`))
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
  const bodyText = await page.locator('body').innerText()
  const composerValue = await page.locator('textarea.composer-text').count() ? await page.locator('textarea.composer-text').last().inputValue({ timeout: 2000 }).catch(() => null) : null
  const route = (await page.evaluate(() => location.pathname + location.search)).replace(/temp-\d+-/g, 'temp-<ms>-')
  await ctx.close()
  return { file, text: `${bodyText}\n[composer]${composerValue ?? ''}`, route, errors, stepError, external, viewport }
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
  const total = s.viewport.width * s.viewport.height
  const noise = d.changed === 0 ? 'exact' : (d.changed / total <= 0.0001 && d.max <= 64) ? 'A-edge-antialiasing' : (d.low / d.changed >= 0.99 && d.max <= 16) ? 'B-compositing-rounding' : null
  const pass = !s.stepError && !p.stepError && s.text === p.text && s.route === p.route && Boolean(noise) && p.errors.length === 0 && p.external.length === 0
  results.push({ id, title: FLOWS[id].title, scenario: FLOWS[id].scenario || 'populated', viewport: FLOWS[id].viewport || 'desktop', pass, noise, pixels: d, route: [s.route, p.route], textEqual: s.text === p.text, sourceStepError: s.stepError, prototypeStepError: p.stepError, sourceErrors: s.errors, prototypeErrors: p.errors, prototypeExternal: p.external })
  console.log(`${pass ? 'PASS' : 'FAIL'} ${id} ${FLOWS[id].title} text=${s.text === p.text} route=${s.route === p.route ? s.route : s.route + ' vs ' + p.route} px=${d.changed} max=${d.max} ${s.stepError ? 'SRC-STEP ' + s.stepError : ''} ${p.stepError ? 'PROTO-STEP ' + p.stepError : ''} srcErr=${s.errors.length} protoErr=${p.errors.length}`)
  if (!pass && process.env.VERBOSE) {
    const sl = s.text.split('\n'), pl = p.text.split('\n'); const ps = new Set(pl), ss = new Set(sl)
    console.log('  source-only:', JSON.stringify(sl.filter(x => !ps.has(x)).slice(0, 12)))
    console.log('  proto-only :', JSON.stringify(pl.filter(x => !ss.has(x)).slice(0, 12)))
    if (s.errors.length) console.log('  srcErr', JSON.stringify(s.errors.slice(0, 3)))
    if (p.errors.length) console.log('  protoErr', JSON.stringify(p.errors.slice(0, 3)))
  }
}
await writeFile(resolve(OUT, `flow-results${process.env.RESULT_TAG ? '-' + process.env.RESULT_TAG : ''}.json`), JSON.stringify({ generatedAt: new Date().toISOString(), source: SOURCE, prototype: PROTO, mock: MOCK, results }, null, 2))
await browser.close()
