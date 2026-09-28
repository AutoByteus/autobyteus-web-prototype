#!/usr/bin/env node
// Paired click-through probe for WEB-BASELINE-REFRESH-001 flow checks.
// Usage: node probe-flow.mjs <flow-id> ; steps defined below.
import { chromium } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'
const require = createRequire(import.meta.url)
const icons = Object.fromEntries(['heroicons', 'ph', 'mdi', 'svg-spinners', 'vscode-icons', 'logos'].map(p => [p, require(`@iconify-json/${p}/icons.json`)]))
const root = resolve(new URL('../..', import.meta.url).pathname)
const SOURCE = process.env.SOURCE_BASE_URL || 'http://127.0.0.1:4291'
const PROTO = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4199'
const MOCK = process.env.MOCK_BASE_URL || 'http://127.0.0.1:4391'
const OUT = resolve(root, process.env.FLOW_DIR || 'evidence/WEB-BASELINE-REFRESH-001/flows')
const CHROME = process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const style = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'

const click = text => async page => { await page.getByText(text, { exact: true }).first().click(); await page.waitForTimeout(900) }
const clickRole = (role, name) => async page => { await page.getByRole(role, { name, exact: true }).first().click(); await page.waitForTimeout(900) }
const chooseFirstWorkspace = async page => { await page.getByText('Select a workspace...', { exact: true }).first().click(); await page.waitForTimeout(400); await page.getByRole('listbox').getByRole('option').first().click(); await page.waitForTimeout(900) }
const type = text => async page => { await page.getByPlaceholder('Type a message...').first().fill(text); await page.waitForTimeout(400) }
const expandWorkspace = async page => { await page.getByText('prototype-workspace', { exact: true }).first().click(); await page.waitForTimeout(900) }

export const FLOWS = {
  'FLW-001': { title: 'Expand workspace history (Teams and Orgs groups)', path: '/workspace', steps: [expandWorkspace] },
  'FLW-002': { title: 'Open stored team run from workspace history', path: '/workspace', steps: [expandWorkspace, click('Product Review Team'), click('Review the current prototype baseline')] },
  'FLW-003': { title: 'Open stored Agent Org run from workspace history', path: '/workspace', steps: [expandWorkspace, click('Product Launch Org'), click('Coordinate the synthetic launch review')] },
  'FLW-004': { title: 'Agent catalog Run opens workspace launch configuration', path: '/agents?view=list', steps: [clickRole('button', 'Run')] },
  'FLW-005': { title: 'Team catalog Run opens Team launch configuration', path: '/agent-teams?view=team-list', steps: [clickRole('button', 'Run')] },
  'FLW-006': { title: 'Agent Org catalog Run opens Org launch configuration', path: '/agent-orgs?view=org-list', steps: [clickRole('button', 'Run')] },
  'FLW-007': { title: 'Projects: open create-project dialog', path: '/projects', steps: [clickRole('button', 'New project')] },
  'FLW-008': { title: 'Project detail: open add-task dialog', path: '/projects/project-prototype-launch', steps: [clickRole('button', 'New task')] },
  'FLW-009': { title: 'Agent Org create: required validation', path: '/agent-orgs?view=org-create', steps: [clickRole('button', 'Create Org')] },
  'FLW-010': { title: 'Primary navigation to Projects', path: '/agents?view=list', steps: [click('Projects')] },
  'FLW-011': { title: 'Stored team run: focus writer member', path: '/workspace', steps: [expandWorkspace, click('Product Review Team'), click('Review the current prototype baseline'), click('writer')] },
  'FLW-012': { title: 'Stored team run: compose a chat message', path: '/workspace', steps: [expandWorkspace, click('Product Review Team'), click('Review the current prototype baseline'), type('Please summarize the open questions.')] },
  'FLW-013': { title: 'Team catalog Run -> workspace -> Run Team launches and projects the new Team', path: '/agent-teams?view=team-list', steps: [clickRole('button', 'Run'), chooseFirstWorkspace, clickRole('button', 'Run Team')], settleMs: 6500 },
  'FLW-014': { title: 'Agent catalog Run -> workspace -> Run Agent launches a new agent run', path: '/agents?view=list', steps: [clickRole('button', 'Run'), chooseFirstWorkspace, clickRole('button', 'Run Agent')] },
  'FLW-015': { title: 'Stored Agent Org run: open analyst member conversation', path: '/workspace', steps: [expandWorkspace, click('Product Launch Org'), click('Coordinate the synthetic launch review'), click('analyst')] },
}

const requested = process.argv.slice(2)
const selected = requested.length ? requested : Object.keys(FLOWS)
await fetch(`${MOCK}/__prototype/scenario`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scenario: 'populated', operationFailures: {} }) })
const browser = await chromium.launch({ headless: true, executablePath: CHROME, args: ['--no-sandbox', '--disable-background-networking', '--font-render-hinting=none'] })
await mkdir(resolve(OUT, 'source'), { recursive: true }); await mkdir(resolve(OUT, 'prototype'), { recursive: true })

async function run(base, target, id) {
  const flow = FLOWS[id]
  await fetch(`${MOCK}/__prototype/scenario`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scenario: 'populated', operationFailures: {} }) })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US', colorScheme: 'light', reducedMotion: 'reduce', timezoneId: 'UTC' })
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
  await ctx.addInitScript(() => {
    if (sessionStorage.getItem('__flow_init')) return
    sessionStorage.setItem('__flow_init', '1')
    localStorage.clear()
    localStorage.setItem('autobyteus.localization.preference-mode', 'en')
    localStorage.setItem('autobyteus.prototype.scenario', 'populated')
    localStorage.setItem('autobyteus.prototype.context', 'desktop')
  })
  const page = await ctx.newPage()
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
  const route = await page.evaluate(() => location.pathname + location.search)
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
  const total = 1440 * 900
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
