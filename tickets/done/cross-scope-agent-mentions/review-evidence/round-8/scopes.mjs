#!/usr/bin/env node
// Disposable review aid: drives `@` mentions in an Org run and a standalone Agent run and saves screenshots.
// Usage: node scopes.mjs [outDir] [org|agent]   (env: PROTOTYPE_BASE_URL)
import { chromium } from 'playwright-core'
const base = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:3282'
const out = process.argv[2] || new URL('.', import.meta.url).pathname
const only = process.argv[3] || ''
const browser = await chromium.launch({ headless: true })
const run = async (name, open) => {
  const page = await browser.newPage({ viewport: { width: 1512, height: 952 } })
  const logs = []
  page.on('pageerror', (e) => logs.push('PAGEERR ' + e.message))
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !/Duplicated|Vue warn|Router warn/.test(m.text())) logs.push(m.type() + ' ' + m.text().slice(0, 400)) })
  const box = () => page.getByPlaceholder(/Type a message|Message |Reply/).first()
  const shot = (step) => page.screenshot({ path: `${out}/${name}-${step}.png` })
  await page.goto(`${base}/workspace`, { waitUntil: 'networkidle' }); await page.waitForTimeout(1500)
  await page.getByText('prototype-workspace', { exact: true }).first().click(); await page.waitForTimeout(900)
  await open(page)
  await shot('01-open')
  await box().click(); await page.keyboard.type('please ask @', { delay: 5 }); await page.waitForTimeout(500)
  await shot('02-menu')
  await page.keyboard.type('comp', { delay: 5 }); await page.waitForTimeout(300)
  await page.locator('[data-test="run-mention-option-fixture-computer-use-agent"]').click(); await page.keyboard.type('to publish the release note', { delay: 5 }); await page.waitForTimeout(300)
  await shot('03-chip')
  await page.keyboard.press('Enter'); await page.waitForTimeout(8000)
  await shot('04-agent-added')
  await box().click(); await page.keyboard.type('@prod', { delay: 5 }); await page.waitForTimeout(300)
  await page.locator('[data-test="run-mention-option-fixture-product-team"]').click(); await page.keyboard.type('please fix the UI first', { delay: 5 })
  await page.keyboard.press('Enter'); await page.waitForTimeout(8000)
  await shot('05-team-added')
  await page.getByText('product prototyper', { exact: true }).first().click(); await page.waitForTimeout(1500)
  await shot('06-task-member-open')
  await box().click(); await page.keyboard.type('also check the narrow layout', { delay: 5 }); await page.keyboard.press('Enter'); await page.waitForTimeout(3000)
  await shot('07-task-member-chat')
  console.log(name, logs.length ? logs.slice(0, 12).join('\n') : 'no page errors')
  await page.close()
}
if (!only || only === 'org') await run('org', async (page) => {
  await page.getByText('Product Launch Org', { exact: true }).first().click(); await page.waitForTimeout(900)
  await page.getByText('Coordinate the synthetic launch review', { exact: false }).first().click(); await page.waitForTimeout(1500)
  await page.getByText('analyst', { exact: true }).first().click(); await page.waitForTimeout(1500)
})
// A standalone Agent run: start a chat (Daily Assistant), then mention from the run view.
if (!only || only === 'agent') await run('agent', async (page) => {
  await page.goto(`${base}/chat`, { waitUntil: 'networkidle' }); await page.waitForTimeout(1200)
  await page.locator('[data-test="chat-message-input"]').click(); await page.keyboard.type('help me plan the release', { delay: 5 })
  await page.keyboard.press('Enter'); await page.waitForTimeout(3500)
})
await browser.close()
