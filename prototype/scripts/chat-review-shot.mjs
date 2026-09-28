#!/usr/bin/env node
// Disposable review aid for the chat-interface-entry ticket.
// Usage: node prototype/scripts/chat-review-shot.mjs <path> <out.png> [width] [height] [actionsFile]
// Optional env: SCENARIO, PROTOTYPE_BASE_URL, CLEAR=1, STORAGE='{"k":"v"}'
import { readFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const [, , path = '/', out = '/tmp/shot.png', width = '1440', height = '900', actionsFile] = process.argv
const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:3271'
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: Number(width), height: Number(height) },
  deviceScaleFactor: 1,
  locale: 'en-US',
  timezoneId: 'UTC',
  colorScheme: 'light',
})
const storage = process.env.STORAGE ? JSON.parse(process.env.STORAGE) : {}
await context.addInitScript(({ scenario, storage, clear }) => {
  if (sessionStorage.getItem('__shot_init')) return
  sessionStorage.setItem('__shot_init', '1')
  if (clear) localStorage.clear()
  if (scenario) localStorage.setItem('autobyteus.prototype.scenario', scenario)
  localStorage.setItem('autobyteus.localization.preference-mode', 'en')
  for (const [k, v] of Object.entries(storage)) localStorage.setItem(k, v)
}, { scenario: process.env.SCENARIO || '', storage, clear: process.env.CLEAR === '1' })
const page = await context.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push(e.message))
await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' }).catch(() => {})
await page.waitForTimeout(Number(process.env.WAIT || 1200))
if (actionsFile) {
  const src = await readFile(actionsFile, 'utf8')
  const fn = new Function('page', `return (async () => { ${src} })()`)
  await fn(page)
  await page.waitForTimeout(400)
}
await page.screenshot({ path: out, fullPage: process.env.FULL === '1' })
if (errors.length) console.log('ERRORS:\n' + errors.slice(0, 10).join('\n'))
console.log('saved', out)
await browser.close()
