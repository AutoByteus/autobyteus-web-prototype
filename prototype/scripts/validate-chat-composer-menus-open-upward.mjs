#!/usr/bin/env node
// Final validation + reference capture for Product ticket chat-composer-menus-open-upward.
// Usage: node prototype/scripts/validate-chat-composer-menus-open-upward.mjs [baseUrl] [outDir] [--capture]
// Enters through the normal default entry point `/` (lands on /chat), synthetic `populated` scenario.
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const base = process.argv[2] || 'http://127.0.0.1:3281'
const outDir = process.argv[3] || 'tickets/done/chat-composer-menus-open-upward/review-evidence/final-validation'
const capture = process.argv.includes('--capture')
const visDir = outDir.replace(/review-evidence\/.*$/, 'visual-references')
const CHROME = process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PH = 'Ask anything · / for skills · @ for an agent or team'
const style = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'

const act = {
  idle: async () => {},
  at: async p => { await p.getByPlaceholder(PH).first().click(); await p.keyboard.type('@') },
  slash: async p => { await p.getByPlaceholder(PH).first().click(); await p.keyboard.type('/') },
  ws: async p => { await p.getByRole('button', { name: /^Workspace: / }).first().click() },
  modelsub: async p => { await p.getByRole('button', { name: /^Model: / }).first().click(); await p.waitForTimeout(400); await p.locator('[data-test=chat-runtime-autobyteus]').first().hover() },
  think: async p => {
    await p.getByRole('button', { name: /^Model: / }).first().click(); await p.waitForTimeout(500)
    await p.locator('[data-test=chat-runtime-autobyteus]').first().click(); await p.waitForTimeout(600)
    await p.getByText(/reasoning-prototype/).first().click(); await p.waitForTimeout(700)
    await p.locator('[data-test=chat-thinking-trigger]').first().click()
  },
  runslash: async p => {
    await p.getByPlaceholder(PH).first().click(); await p.keyboard.type('Summarize the synthetic baseline.'); await p.keyboard.press('Enter'); await p.waitForTimeout(2500)
    await p.getByPlaceholder('Reply, or type / to use a skill').first().click(); await p.keyboard.type('/')
  },
}

const cases = [
  { id: 'CHK-001', vis: 'VIS-001-new-chat-composer-lower-1512x952', w: 1512, h: 952, action: 'idle', expect: 'idle' },
  { id: 'CHK-002', vis: 'VIS-002-at-menu-above-1512x952', w: 1512, h: 952, action: 'at', expect: 'above' },
  { id: 'CHK-003', vis: 'VIS-003-slash-menu-above-1512x952', w: 1512, h: 952, action: 'slash', expect: 'above' },
  { id: 'CHK-004', vis: 'VIS-004-workspace-menu-above-1512x952', w: 1512, h: 952, action: 'ws', expect: 'above' },
  { id: 'CHK-005', vis: 'VIS-005-model-menu-runtime-flyout-above-1512x952', w: 1512, h: 952, action: 'modelsub', expect: 'above' },
  { id: 'CHK-006', vis: 'VIS-006-thinking-menu-above-1512x952', w: 1512, h: 952, action: 'think', expect: 'above' },
  { id: 'CHK-007', vis: 'VIS-007-at-menu-above-1280x720', w: 1280, h: 720, action: 'at', expect: 'above' },
  { id: 'CHK-008', vis: 'VIS-008-at-menu-short-window-scrolls-1024x520', w: 1024, h: 520, action: 'at', expect: 'above' },
  { id: 'CHK-009', w: 1024, h: 440, action: 'at', expect: 'above' },
  { id: 'CHK-010', w: 1024, h: 440, action: 'ws', expect: 'above' },
  { id: 'CHK-011', w: 1024, h: 440, action: 'modelsub', expect: 'above' },
  { id: 'CHK-012', w: 1024, h: 440, action: 'think', expect: 'above' },
  { id: 'CHK-013', vis: 'VIS-009-narrow-bottom-sheet-preserved-390x844', w: 390, h: 844, action: 'at', expect: 'sheet' },
  { id: 'CHK-014', w: 390, h: 844, action: 'ws', expect: 'sheet' },
  { id: 'CHK-015', vis: 'VIS-010-run-view-slash-menu-preserved-1512x952', w: 1512, h: 952, action: 'runslash', expect: 'run-above' },
]

const MENU_SEL = '[data-test=chat-target-menu],[data-test=chat-skill-menu],[data-test=chat-model-menu],[data-test=chat-model-submenu],[data-test=chat-thinking-menu],[role=listbox][aria-label=Workspaces]'
const browser = await chromium.launch({ headless: true, executablePath: CHROME, args: ['--font-render-hinting=none'] })
await mkdir(outDir, { recursive: true }); if (capture) await mkdir(visDir, { recursive: true })
const results = []
for (const c of cases) {
  const ctx = await browser.newContext({ viewport: { width: c.w, height: c.h }, deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'UTC', colorScheme: 'light' })
  const external = []
  await ctx.route('**/*', r => { const u = new URL(r.request().url()); if (['127.0.0.1', 'localhost'].includes(u.hostname) || ['data:', 'blob:'].includes(u.protocol)) return r.continue(); external.push(u.href); return r.abort() })
  await ctx.addInitScript(() => { if (sessionStorage.getItem('__i')) return; sessionStorage.setItem('__i', '1'); localStorage.clear(); localStorage.setItem('autobyteus.localization.preference-mode', 'en'); localStorage.setItem('autobyteus.prototype.scenario', 'populated'); localStorage.setItem('autobyteus.prototype.context', 'desktop') })
  const page = await ctx.newPage(); const errors = []
  page.on('pageerror', e => errors.push(e.message))
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(2500)
  await page.addStyleTag({ content: style })
  let stepError = null
  try { await act[c.action](page) } catch (e) { stepError = e.message }
  await page.waitForTimeout(700)
  const g = await page.evaluate(sel => {
    const box = el => { const b = el.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, left: b.left, right: b.right } }
    const menus = [...document.querySelectorAll(sel)].filter(e => e.getBoundingClientRect().height > 0).map(e => {
      let p = e; while (p.parentElement && !['absolute', 'fixed'].includes(getComputedStyle(p).position)) p = p.parentElement
      const cb = getComputedStyle(p).position === 'fixed' ? null : p.offsetParent
      return { test: e.getAttribute('data-test') || e.getAttribute('aria-label'), box: box(p), fixed: getComputedStyle(p).position === 'fixed', anchorTop: cb ? cb.getBoundingClientRect().top : null, scrollable: [...p.querySelectorAll('*'), p].some(x => x.scrollHeight > x.clientHeight + 1 && getComputedStyle(x).overflowY === 'auto') }
    })
    const q = s => document.querySelector(s)
    return { path: location.pathname, vh: innerHeight, heading: q('[data-test=chat-new] h1') && box(q('[data-test=chat-new] h1')), hint: q('[data-test=chat-new-hint]') && box(q('[data-test=chat-new-hint]')), menus }
  }, MENU_SEL)
  const fails = []
  if (stepError) fails.push('step: ' + stepError)
  if (errors.length) fails.push('page errors')
  if (external.length) fails.push('external requests')
  if (c.expect !== 'run-above' && g.path !== '/chat') fails.push('default entry did not land on /chat')
  if (c.expect === 'idle' && c.h === 952 && Math.round(g.heading?.top ?? -1) !== 379) fails.push(`heading top ${g.heading?.top} != 379`)
  if (c.expect !== 'idle' && !g.menus.length) fails.push('no menu open')
  for (const m of g.menus) {
    if (m.box.top < 0 || m.box.bottom > g.vh) fails.push(`${m.test} off-screen`)
    if (c.expect === 'above' || c.expect === 'run-above') {
      if (m.test !== 'chat-model-submenu' && m.anchorTop !== null && m.box.bottom > m.anchorTop + 0.5) fails.push(`${m.test} not above its anchor`)
      if (g.hint && m.box.bottom > g.hint.top) fails.push(`${m.test} covers hint line`)
    }
    if (c.expect === 'sheet' && !(m.fixed && Math.round(g.vh - m.box.bottom) === 8)) fails.push(`${m.test} not bottom sheet`)
  }
  if (c.id === 'CHK-008' && !g.menus.some(m => m.scrollable)) fails.push('short-window menu does not scroll')
  if (capture && c.vis) await page.screenshot({ path: `${visDir}/${c.vis}.png` })
  results.push({ id: c.id, vis: c.vis ?? null, viewport: `${c.w}x${c.h}`, action: c.action, pass: fails.length === 0, fails, geometry: g })
  console.log(c.id, c.action, `${c.w}x${c.h}`, fails.length ? 'FAIL ' + fails.join('; ') : 'pass')
  await ctx.close()
}
await browser.close()
await writeFile(`${outDir}/results.json`, JSON.stringify({ generatedAt: new Date().toISOString(), base, total: results.length, passed: results.filter(r => r.pass).length, results }, null, 2))
console.log(`${results.filter(r => r.pass).length}/${results.length} pass`)
process.exit(results.every(r => r.pass) ? 0 : 1)
