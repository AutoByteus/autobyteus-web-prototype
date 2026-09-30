#!/usr/bin/env node
// Disposable review aid: drives the cross-scope-agent-mentions journey and saves non-normative screenshots.
// Usage: node journey.mjs [outDir]   (env: PROTOTYPE_BASE_URL, ROUTE=relay|direct)
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'
const base = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:3282'
const out = process.argv[2] || new URL('.', import.meta.url).pathname
const route = process.env.ROUTE || 'relay'
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1512, height: 952 } })
const errors = []
page.on('pageerror', (e) => errors.push('PAGEERR ' + e.message))
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE ' + m.text().slice(0, 300)) })
const shot = (name) => page.screenshot({ path: `${out}/${route}-${name}.png` })
const box = () => page.getByPlaceholder('Type a message...').first()

await page.goto(`${base}/workspace#mentionRoute=${route}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
await page.getByText('prototype-workspace', { exact: true }).first().click(); await page.waitForTimeout(900)
await page.getByText('Product Review Team', { exact: true }).first().click(); await page.waitForTimeout(900)
await page.getByText('Review the current prototype baseline', { exact: false }).first().click(); await page.waitForTimeout(2000)
await shot('01-run-open')

await box().click()
await page.keyboard.type('the input box is too high. please talk to @', { delay: 5 })
await page.waitForTimeout(500)
await shot('02-at-menu')
await page.keyboard.type('zzz', { delay: 5 }); await page.waitForTimeout(400)
await shot('03-at-menu-empty')
for (let i = 0; i < 3; i += 1) await page.keyboard.press('Backspace')
await page.keyboard.type('prod', { delay: 5 }); await page.waitForTimeout(400)
await shot('04-at-menu-filtered')
await page.locator('[data-test="run-mention-option-fixture-product-team"]').click(); await page.waitForTimeout(300)
await page.keyboard.type('to fix the UI first', { delay: 5 }); await page.waitForTimeout(300)
await shot('05-composer-chip')
await page.keyboard.press('Enter')
await page.waitForTimeout(1600); await shot('06-sent')
await page.waitForTimeout(2600); await shot('07-added')
await page.waitForTimeout(4500); await shot('08-settled')
console.log('tree:', (await page.locator('[data-test="workspace-team-execution-tree"]').first().innerText()).replace(/\n+/g, ' | '))

if (route === 'relay') {
  // Team tab from the focused agent's perspective is already visible; open the added collaborator.
  await page.locator('[data-test="run-mention-notice-open"]').click(); await page.waitForTimeout(1200)
  await shot('09-collaborator-focused')
  await box().click(); await page.keyboard.type('also keep the workspace hint under the box', { delay: 5 })
  await page.keyboard.press('Enter'); await page.waitForTimeout(2600)
  await shot('10-collaborator-direct-chat')

  // SC-005: mention it again from the original agent.
  await page.locator('[data-test^="workspace-team-member-"]').filter({ hasText: 'researcher' }).first().click(); await page.waitForTimeout(1200)
  await box().click(); await page.keyboard.type('@prod', { delay: 5 }); await page.waitForTimeout(400)
  await shot('11-remention-menu')
  await page.locator('[data-test="run-mention-option-fixture-product-team"]').click()
  await page.keyboard.type('also check the narrow layout', { delay: 5 }); await page.waitForTimeout(300)
  await shot('12-remention-chip')
  await page.keyboard.press('Enter'); await page.waitForTimeout(4500)
  await shot('13-remention-settled')
  console.log('tree after re-mention:', (await page.locator('[data-test="workspace-team-execution-tree"]').first().innerText()).replace(/\n+/g, ' | '))

  // SC-006: a collaborator that cannot run with this run's settings.
  await box().click(); await page.keyboard.type('ask @mark', { delay: 5 }); await page.waitForTimeout(400)
  await page.locator('[data-test="run-mention-option-fixture-marketing-team"]').click()
  await page.keyboard.type('for launch copy', { delay: 5 })
  await page.keyboard.press('Enter'); await page.waitForTimeout(4200)
  await shot('14-failed')
  console.log('tree after failure:', (await page.locator('[data-test="workspace-team-execution-tree"]').first().innerText()).replace(/\n+/g, ' | '))
}
console.log(errors.length ? 'ERRORS:\n' + errors.slice(0, 15).join('\n') : 'no page errors')
await browser.close()
