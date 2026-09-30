// Disposable review aid: capture new-chat menu geometry + screenshot. Usage: node geom.mjs <baseUrl> <outPrefix> <w> <h> <action:at|ws|model|think|slash|none>
import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/chat-composer-menus-open-upward/node_modules/playwright-core/index.mjs'
const [, , base, out, w = '1512', h = '952', action = 'at'] = process.argv
const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--font-render-hinting=none'] })
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'UTC' })
await ctx.route('**/*', r => { const u = new URL(r.request().url()); return ['127.0.0.1', 'localhost'].includes(u.hostname) || ['data:', 'blob:'].includes(u.protocol) ? r.continue() : r.abort() })
await ctx.addInitScript(() => { if (sessionStorage.getItem('__i')) return; sessionStorage.setItem('__i', '1'); localStorage.clear(); localStorage.setItem('autobyteus.localization.preference-mode', 'en'); localStorage.setItem('autobyteus.prototype.scenario', 'populated'); localStorage.setItem('autobyteus.prototype.context', 'desktop') })
const page = await ctx.newPage(); const errors = []
page.on('pageerror', e => errors.push(e.message))
await page.goto(base + '/chat', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(2500)
const ph = page.getByPlaceholder('Ask anything · / for skills · @ for an agent or team').first()
if (action === 'at' || action === 'slash') { await ph.click(); await page.keyboard.type(action === 'at' ? '@' : '/'); }
if (action === 'ws') await page.getByRole('button', { name: /^Workspace: / }).first().click()
if (action === 'model') await page.getByRole('button', { name: /^Model: / }).first().click()
if (action === 'modelsub') { await page.getByRole('button', { name: /^Model: / }).first().click(); await page.waitForTimeout(400); await page.locator('[data-test=chat-runtime-autobyteus]').first().hover() }
if (action === 'think') {
  await page.getByRole('button', { name: /^Model: / }).first().click(); await page.waitForTimeout(500)
  await page.locator('[data-test=chat-runtime-autobyteus]').first().click(); await page.waitForTimeout(600)
  await page.getByText(/reasoning-prototype/).first().click(); await page.waitForTimeout(700)
  await page.locator('[data-test=chat-thinking-trigger]').first().click().catch(e => errors.push('think:' + e.message))
}
if (action === 'runslash') { await ph.click(); await page.keyboard.type('Summarize the synthetic baseline.'); await page.keyboard.press('Enter'); await page.waitForTimeout(2500); await page.getByPlaceholder('Reply, or type / to use a skill').first().click(); await page.keyboard.type('/') }
if (action === 'wsq') { await page.getByRole('button', { name: /^Workspace: / }).first().click(); await page.waitForTimeout(300); await page.keyboard.type('proto') }
await page.waitForTimeout(700)
const g = await page.evaluate(() => {
  const r = el => { if (!el) return null; const b = el.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom), left: Math.round(b.left), h: Math.round(b.height) } }
  const menus = [...document.querySelectorAll('[data-test=chat-target-menu],[data-test=chat-skill-menu],[data-test=chat-model-menu],[data-test=chat-model-submenu],[data-test=chat-thinking-menu],[role=listbox][aria-label=Workspaces]')].filter(e => e.getBoundingClientRect().height > 0).map(e => { let p = e; while (p.parentElement && !(getComputedStyle(p).position === 'absolute' || getComputedStyle(p).position === 'fixed')) p = p.parentElement; return { label: e.getAttribute('aria-label'), box: r(p), cls: p.className.slice(0, 160) } })
  return { vh: innerHeight, heading: r(document.querySelector('[data-test=chat-new] h1')), composer: r(document.querySelector('[data-test=chat-new] .max-w-3xl')), hint: r(document.querySelector('[data-test=chat-new-hint]')), menus }
})
await page.screenshot({ path: out + '.png' })
console.log(JSON.stringify({ ...g, errors }))
await browser.close()
