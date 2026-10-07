// project-manager-ux: replays a JSON list of browser steps against the running UI reference.
// Usage (from the design repository root): node prototype/scripts/project-manager-ux-drive.mjs <steps.json>
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire(process.cwd() + '/package.json')
const { chromium } = require('playwright-core')
const spec = JSON.parse(readFileSync(process.argv[2], 'utf8'))
const exe = process.env.PLAYWRIGHT_CHROME || process.env.HOME + '/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
const browser = await chromium.launch({ headless: true, executablePath: exe })
const ctx = await browser.newContext({ viewport: spec.viewport || { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'UTC', reducedMotion: spec.reducedMotion || 'no-preference' })
await ctx.addInitScript((init) => { if (!sessionStorage.getItem('__init')) { sessionStorage.setItem('__init','1'); if (init.clear) localStorage.clear(); localStorage.setItem('autobyteus.localization.preference-mode','en'); for (const [k,v] of Object.entries(init.ls||{})) localStorage.setItem(k,v) } }, { clear: spec.clear !== false, ls: spec.localStorage || {} })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', e => errors.push(e.message))
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
const base = spec.base || 'http://127.0.0.1:4560'
const out = []
for (const s of spec.steps) {
  try {
    if (s.goto) { await page.goto(base + s.goto, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(s.wait ?? 2500) }
    else if (s.click) { await page.locator(s.click).first().click({ timeout: 5000 }); await page.waitForTimeout(s.wait ?? 600) }
    else if (s.text) { await page.getByText(s.text, { exact: s.exact ?? false }).first().click({ timeout: 5000 }); await page.waitForTimeout(s.wait ?? 600) }
    else if (s.fill) { await page.locator(s.fill).first().fill(s.value); await page.waitForTimeout(s.wait ?? 200) }
    else if (s.press) { await page.keyboard.press(s.press); await page.waitForTimeout(s.wait ?? 400) }
    else if (s.sleep) { await page.waitForTimeout(s.sleep) }
    else if (s.eval) { out.push({ eval: await page.evaluate(s.eval) }) }
    else if (s.shot) { await page.mouse.move(s.mx ?? 1100, s.my ?? 880); await page.waitForTimeout(150); await page.screenshot({ path: s.shot, fullPage: !!s.full }); out.push({ shot: s.shot }) }
  } catch (e) { out.push({ step: s, error: String(e.message).slice(0, 300) }) }
}
console.log(JSON.stringify({ out, errors: errors.slice(0, 10) }, null, 1))
await browser.close()
