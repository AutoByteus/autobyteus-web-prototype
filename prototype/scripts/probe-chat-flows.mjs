#!/usr/bin/env node
// WEB-BASELINE-REFRESH-002 paired click-through probe for the Chat entry
// surface shipped at origin/personal@57df63f (composer menus, thinking,
// skills, targets, approval, send) plus the D-19 Skills banner and nav changes.
// Same matched conditions and pass rule as probe-flow.mjs.
// Usage: node probe-chat-flows.mjs [flow-id ...]
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
const OUT = resolve(root, process.env.FLOW_DIR || 'evidence/WEB-BASELINE-REFRESH-002/chat-flows')
const CHROME = process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const style = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'


const role = (r, name) => async page => { await page.getByRole(r, { name }).first().click(); await page.waitForTimeout(700) }
const text = (value, exact = true) => async page => { await page.getByText(value, { exact }).first().click(); await page.waitForTimeout(700) }
const fill = (placeholder, value) => async page => { await page.getByPlaceholder(placeholder).first().fill(value); await page.waitForTimeout(600) }
const press = key => async page => { await page.keyboard.press(key); await page.waitForTimeout(700) }
const typeKeys = value => async page => { await page.keyboard.type(value, { delay: 30 }); await page.waitForTimeout(700) }
const NEW_CHAT_PLACEHOLDER = 'Ask anything · / for skills · @ for an agent or team'
const focusComposer = async page => { await page.getByPlaceholder(NEW_CHAT_PLACEHOLDER).first().click(); await page.waitForTimeout(300) }
const openWorkspace = role('button', /^Workspace: /)
const openModel = role('button', /^Model: /)
const pickReasoning = async page => {
  await openModel(page)
  await page.locator('[data-test="chat-runtime-autobyteus"]').first().click(); await page.waitForTimeout(700)
  await page.getByText(/reasoning-prototype/).first().click(); await page.waitForTimeout(800)
}
const sendFirst = async page => { await focusComposer(page); await page.keyboard.type('Summarize the synthetic baseline.', { delay: 20 }); await page.keyboard.press('Enter'); await page.waitForTimeout(2500) }
const openThinking = role('button', /^Thinking: /)

export const FLOWS = {
  'CHT-001': { title: 'New chat: open workspace menu', path: '/chat', steps: [openWorkspace] },
  'CHT-002': { title: 'New chat: workspace menu search filters', path: '/chat', steps: [openWorkspace, fill('Search workspaces', 'proto')] },
  'CHT-003': { title: 'New chat: choose an existing workspace', path: '/chat', steps: [openWorkspace, text('prototype-workspace')] },
  'CHT-004': { title: 'New chat: open another folder, relative path validation', path: '/chat', steps: [openWorkspace, text('Open another folder…'), fill('/Users/you/project', 'relative/folder'), role('button', 'Use folder')] },
  'CHT-005': { title: 'New chat: open model menu', path: '/chat', steps: [openModel] },
  'CHT-006': { title: 'New chat: model menu search', path: '/chat', steps: [openModel, fill('Search models', 'reason')] },
  'CHT-007': { title: 'New chat: choose the thinking-capable model (thinking control appears)', path: '/chat', steps: [pickReasoning] },
  'CHT-008': { title: 'New chat: open thinking menu', path: '/chat', steps: [pickReasoning, openThinking] },
  'CHT-009': { title: 'New chat: choose a thinking effort', path: '/chat', steps: [pickReasoning, openThinking, text('High')] },
  'CHT-010': { title: 'New chat: toggle auto-approve to ask first', path: '/chat', steps: [role('button', /Auto-approve tools is on/)] },
  'CHT-011': { title: 'New chat: / opens the skill menu', path: '/chat', steps: [focusComposer, typeKeys('/')] },
  'CHT-012': { title: 'New chat: choose a skill (tag chip)', path: '/chat', steps: [focusComposer, typeKeys('/'), press('Enter')] },
  'CHT-013': { title: 'New chat: @ opens the agent/team menu', path: '/chat', steps: [focusComposer, typeKeys('@')] },
  'CHT-014': { title: 'New chat: address a team with @', path: '/chat', steps: [focusComposer, typeKeys('@'), text('Product Review Team')] },
  'CHT-015': { title: 'New chat: address another agent with @', path: '/chat', steps: [focusComposer, typeKeys('@'), text('Documentation Writer')] },
  'CHT-016': { title: 'New chat: type a message (send enabled)', path: '/chat', steps: [focusComposer, typeKeys('Summarize the synthetic baseline.')] },
  'CHT-017': { title: 'New chat: send opens the chat run view', path: '/chat', steps: [focusComposer, typeKeys('Summarize the synthetic baseline.'), press('Enter')], settleMs: 2500 },
  'CHT-018': { title: 'Chat nav item from Agents opens New chat', path: '/agents?view=list', steps: [text('Chat')] },
  'CHT-019': { title: 'Collapse the left panel from the Chat row', path: '/chat', steps: [role('button', 'Collapse left panel')] },
  'CHT-020': { title: 'New chat (pencil) from the Workspaces page', path: '/workspace', steps: [role('button', 'New chat')] },
  'CHT-021': { title: 'New chat: model menu runtime drill-in lists models', path: '/chat', steps: [openModel, async page => { await page.locator('[data-test="chat-runtime-autobyteus"]').first().click(); await page.waitForTimeout(700) }] },
  'CHT-022': { title: 'Chat run: open run settings (Edit Config)', path: '/chat', steps: [sendFirst, role('button', 'Edit Config')] },
  'CHT-023': { title: 'Chat run: header + starts a New chat', path: '/chat', steps: [sendFirst, role('button', 'New Agent')] },
  'CHT-024': { title: 'Chat run: reply in the run composer', path: '/chat', steps: [sendFirst, fill('Reply, or type / to use a skill', 'Add the open questions.'), press('Enter')], settleMs: 1500 },
  'CHT-025': { title: 'Chat run: right tool shell Files tab', path: '/chat', steps: [sendFirst, text('Files')] },
  'CHT-026': { title: 'Chat run: collapse the right tool shell', path: '/chat', steps: [sendFirst, role('button', 'Toggle Sidebar')] },
  'CHT-027': { title: 'Chat run: reopen the chat from the Workspaces tree after leaving', path: '/chat', steps: [sendFirst, text('Agents'), text('Summarize the synthetic baseline.')], settleMs: 1500 },
  'CHT-028': { title: 'Workspaces tree: + on the Daily Assistant row after a chat opens a New chat preset to it', path: '/chat', steps: [sendFirst, role('button', 'New run with this agent')] },
  'CHT-029': { title: 'Chat run: / skill menu in the run composer', path: '/chat', steps: [sendFirst, async page => { await page.getByPlaceholder('Reply, or type / to use a skill').first().click(); await page.keyboard.type('/'); await page.waitForTimeout(700) }] },
  // Narrow viewport: the composer menus become bottom sheets (sampled).
  'CHT-030': { title: 'New chat (390x844): model menu as a bottom sheet', path: '/chat', viewport: { width: 390, height: 844 }, steps: [openModel] },
  'CHT-031': { title: 'New chat (390x844): workspace menu as a bottom sheet', path: '/chat', viewport: { width: 390, height: 844 }, steps: [openWorkspace] },
  'SKL-001': { title: 'Skills: name-issues banner expands details', path: '/skills', scenario: 'skill_name_issues', steps: [role('button', 'Show details')] },
}

const requested = process.argv.slice(2)
const selected = requested.length ? requested : Object.keys(FLOWS)
await fetch(`${MOCK}/__prototype/scenario`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scenario: 'populated', operationFailures: {} }) })
const browser = await chromium.launch({ headless: true, executablePath: CHROME, args: ['--no-sandbox', '--disable-background-networking', '--font-render-hinting=none'] })
await mkdir(resolve(OUT, 'source'), { recursive: true }); await mkdir(resolve(OUT, 'prototype'), { recursive: true })

async function run(base, target, id) {
  const flow = FLOWS[id]
  await fetch(`${MOCK}/__prototype/scenario`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scenario: flow.scenario || 'populated', operationFailures: {} }) })
  const ctx = await browser.newContext({ viewport: flow.viewport || { width: 1440, height: 900 }, locale: 'en-US', colorScheme: 'light', reducedMotion: 'reduce', timezoneId: 'UTC' })
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
  await ctx.addInitScript(scenario => {
    if (sessionStorage.getItem('__flow_init')) return
    sessionStorage.setItem('__flow_init', '1')
    localStorage.clear()
    localStorage.setItem('autobyteus.localization.preference-mode', 'en')
    localStorage.setItem('autobyteus.prototype.scenario', scenario)
    localStorage.setItem('autobyteus.prototype.context', 'desktop')
  }, flow.scenario || 'populated')
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
