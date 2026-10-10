#!/usr/bin/env node
// skill-sources-dialog-redesign: behaviour checks through the product's own controls.
// Usage: PROTOTYPE_BASE_URL=http://127.0.0.1:4731 node validate.mjs [output.json]
import { writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4731'
const out = process.argv[2]
const browser = await chromium.launch({ headless: true })
const checks = []
const errors = []
const external = []

async function open({ scenario = 'populated', context = 'electron_internal', width = 1440, height = 900 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, locale: 'en-US' })
  await ctx.addInitScript(([s, c]) => {
    if (sessionStorage.getItem('ssdr-init')) return
    sessionStorage.setItem('ssdr-init', '1')
    localStorage.clear()
    localStorage.setItem('autobyteus.prototype.scenario', s)
    localStorage.setItem('autobyteus.prototype.context', c)
    localStorage.setItem('autobyteus.localization.preference-mode', 'en')
  }, [scenario, context])
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseUrl })
  const page = await ctx.newPage()
  page.on('pageerror', e => errors.push(e.message))
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('request', r => { const u = new URL(r.url()); if (!['127.0.0.1', 'localhost'].includes(u.hostname) && u.protocol.startsWith('http')) external.push(r.url()) })
  await page.goto(`${baseUrl}/skills`, { waitUntil: 'domcontentloaded' })
  const btn = page.locator('.skills-toolbar button', { hasText: 'Sources' }).first()
  await btn.waitFor({ timeout: 30_000 })
  await page.waitForTimeout(300)
  await btn.click()
  await page.getByTestId('skill-sources-dialog').waitFor()
  await settle(page)
  return { ctx, page }
}
const settle = page => page.waitForFunction(() => {
  const d = document.querySelector('[data-testid="skill-sources-dialog"]')
  return d && d.getAttribute('aria-busy') !== 'true' && d.querySelectorAll('.source-row').length > 0
}, undefined, { timeout: 15_000 })
const dialogOpen = page => page.getByTestId('skill-sources-dialog').isVisible().catch(() => false)
const row = (page, id) => page.getByTestId(`skill-source-row-${id}`)
async function check(id, description, fn) {
  try { const detail = await fn(); checks.push({ id, description, pass: true, detail }); console.log('PASS', id, description) }
  catch (e) { checks.push({ id, description, pass: false, detail: String(e.message || e).slice(0, 300) }); console.log('FAIL', id, description, String(e.message || e).slice(0, 200)) }
}
const expect = (cond, msg) => { if (!cond) throw new Error(msg) }

await check('V01', 'Order: Default first, then by path; counts and kinds shown', async () => {
  const { ctx, page } = await open()
  const rows = await page.$$eval('.source-row', els => els.map(e => ({ kind: e.dataset.sourceKind, name: e.querySelector('.source-name')?.textContent.trim(), count: e.querySelector('.count')?.textContent.trim(), path: e.querySelector('.source-path')?.textContent.trim() })))
  await ctx.close()
  expect(rows[0].kind === 'DEFAULT', 'default not first')
  expect(rows.some(r => r.count === '56 skills') && rows.some(r => r.count === 'No skills') && rows.some(r => r.count === '1 skill'), 'counts missing')
  return rows
})
await check('V02', 'Default has no Remove; every other row has Remove (or Retry removal)', async () => {
  const { ctx, page } = await open({ scenario: 'skill_source_issues' })
  const d = await row(page, 'default').locator('.remove, .retry-removal').count()
  const others = await page.$$eval('.source-row:not([data-source-kind="DEFAULT"])', els => els.map(e => e.querySelectorAll('.remove, .retry-removal').length))
  await ctx.close()
  expect(d === 0, 'default has remove'); expect(others.every(n => n === 1), 'missing remove')
  return { default: d, others }
})
await check('V03', 'Remove: cancel keeps the source; confirm unlinks and shows success', async () => {
  const { ctx, page } = await open()
  await row(page, 'local-team-skills').locator('.remove').click()
  await page.getByText('Unlink this local source?').waitFor()
  await page.getByRole('button', { name: 'Cancel' }).click()
  await page.waitForTimeout(400)
  expect(await row(page, 'local-team-skills').count() === 1, 'removed after cancel')
  await row(page, 'local-team-skills').locator('.remove').click()
  await page.getByRole('button', { name: 'Remove', exact: true }).click()
  await page.locator('.success-alert').waitFor()
  const left = await row(page, 'local-team-skills').count()
  const msg = await page.locator('.success-alert').innerText()
  await ctx.close()
  expect(left === 0, 'not removed'); return msg
})
await check('V04', 'GitHub remove uses the delete-copy message', async () => {
  const { ctx, page } = await open()
  await row(page, 'github-docs-skills').locator('.remove').click()
  await page.getByText('Delete this downloaded skill source').waitFor()
  await ctx.close(); return 'removeWarning shown'
})
await check('V05', 'Update: confirmation, Updating… busy state, then Up to date', async () => {
  const { ctx, page } = await open()
  await row(page, 'github-review-skills').locator('.update').click()
  await page.getByText('Update entire skill source?').waitFor()
  await page.getByRole('button', { name: 'Update', exact: true }).last().click()
  await row(page, 'github-review-skills').getByText('Updating…').waitFor()
  const disabled = await page.locator('.source-row .remove').first().isDisabled()
  await settle(page); await page.locator('.success-alert').waitFor()
  const status = await row(page, 'github-review-skills').locator('.status').innerText()
  await ctx.close()
  expect(disabled, 'actions not disabled while busy'); expect(/Up to date/.test(status), status); return status
})
await check('V06', 'Check again shows Checking… and disables actions', async () => {
  const { ctx, page } = await open()
  await row(page, 'github-docs-skills').locator('.check').click()
  await row(page, 'github-docs-skills').getByText('Checking…').waitFor()
  const addDisabled = await page.locator('#skill-source-input').isDisabled()
  await settle(page); await ctx.close()
  expect(addDisabled, 'add form not disabled'); return 'ok'
})
await check('V07', 'Removal incomplete: Retry removal opens the confirmation; no Check again', async () => {
  const { ctx, page } = await open({ scenario: 'skill_source_issues' })
  const checkCount = await row(page, 'github-old-skills').locator('.check').count()
  await row(page, 'github-old-skills').locator('.retry-removal').click()
  await page.getByText('Delete this downloaded skill source').waitFor()
  await ctx.close(); expect(checkCount === 0, 'check shown'); return 'ok'
})
await check('V08', 'Add local folder: success refreshes list and clears input', async () => {
  const { ctx, page } = await open()
  await page.locator('#skill-source-input').fill('/Users/alex/Projects/prompt-kits')
  await page.getByRole('button', { name: 'Add Folder' }).click()
  await page.locator('.success-alert').waitFor(); await settle(page)
  const value = await page.locator('#skill-source-input').inputValue()
  const added = await page.locator('.source-name', { hasText: 'prompt-kits' }).count()
  await ctx.close(); expect(value === '' && added === 1, 'not added'); return 'ok'
})
await check('V09', 'Add local folder: error keeps the typed path', async () => {
  const { ctx, page } = await open()
  await page.locator('#skill-source-input').fill('/Users/alex/missing-dir')
  await page.getByRole('button', { name: 'Add Folder' }).click()
  await page.locator('.error-alert').waitFor()
  const value = await page.locator('#skill-source-input').inputValue()
  await ctx.close(); expect(value === '/Users/alex/missing-dir', 'input cleared'); return value
})
await check('V10', 'Duplicate skill name opens the existing conflict dialog; path kept', async () => {
  const { ctx, page } = await open()
  await page.locator('#skill-source-input').fill('/Users/alex/duplicate-skills')
  await page.getByRole('button', { name: 'Add Folder' }).click()
  await page.getByTestId('skill-name-conflict-dialog').waitFor()
  await page.getByRole('button', { name: 'OK' }).click()
  const value = await page.locator('#skill-source-input').inputValue()
  const open_ = await dialogOpen(page)
  await ctx.close(); expect(value === '/Users/alex/duplicate-skills' && open_, 'state lost'); return value
})
await check('V11', 'GitHub mode: trust hint, import, invalid URL error keeps URL', async () => {
  const { ctx, page } = await open()
  await page.getByRole('button', { name: 'GitHub', exact: true }).click()
  await page.getByText('Import only sources you trust').waitFor()
  const browse = await page.getByRole('button', { name: 'Browse…' }).count()
  await page.locator('#skill-source-input').fill('https://gitlab.com/x/y')
  await page.getByRole('button', { name: 'Import repository' }).click()
  await page.locator('.error-alert').waitFor(); await settle(page)
  const kept = await page.locator('#skill-source-input').inputValue()
  await page.locator('#skill-source-input').fill('https://github.com/acme-labs/new-skills')
  await page.getByRole('button', { name: 'Import repository' }).click()
  await page.locator('.success-alert').waitFor(); await settle(page)
  const added = await page.locator('.source-name', { hasText: 'acme-labs/new-skills' }).count()
  await ctx.close(); expect(browse === 0 && kept === 'https://gitlab.com/x/y' && added === 1, JSON.stringify({ browse, kept, added })); return 'ok'
})
await check('V12', 'Browse… (DEC-002) only in the local embedded desktop app; fills the path', async () => {
  const a = await open()
  await a.page.getByRole('button', { name: 'Browse…' }).click()
  await a.page.waitForTimeout(200)
  const value = await a.page.locator('#skill-source-input').inputValue()
  await a.ctx.close()
  const b = await open({ context: 'desktop' })
  const browserCount = await b.page.getByRole('button', { name: 'Browse…' }).count(); await b.ctx.close()
  const c = await open({ context: 'electron_external' })
  const remoteCount = await c.page.getByRole('button', { name: 'Browse…' }).count(); await c.ctx.close()
  expect(value === '/synthetic/selected-folder' && browserCount === 0 && remoteCount === 0, JSON.stringify({ value, browserCount, remoteCount }))
  return { value, browserCount, remoteCount }
})
await check('V13', 'Close paths: ×, Done, overlay click, Esc; Esc ignored while confirming', async () => {
  const results = {}
  for (const how of ['x', 'done', 'overlay', 'esc']) {
    const { ctx, page } = await open()
    if (how === 'x') await page.getByRole('button', { name: 'Close' }).click()
    if (how === 'done') await page.getByRole('button', { name: 'Done' }).click()
    if (how === 'overlay') await page.mouse.click(30, 450)
    if (how === 'esc') await page.keyboard.press('Escape')
    await page.waitForTimeout(200)
    results[how] = !(await dialogOpen(page))
    await ctx.close()
  }
  const { ctx, page } = await open()
  await row(page, 'local-team-skills').locator('.remove').click()
  await page.getByText('Unlink this local source?').waitFor()
  await page.keyboard.press('Escape'); await page.waitForTimeout(200)
  results.escWhileConfirming_dialogStillOpen = await dialogOpen(page)
  await ctx.close()
  expect(Object.values(results).every(Boolean), JSON.stringify(results)); return results
})
await check('V14', 'Keyboard: focus starts in the dialog, Tab stays inside, icon buttons have names', async () => {
  const { ctx, page } = await open()
  const inside = await page.evaluate(() => document.querySelector('[data-testid="skill-sources-dialog"]')?.contains(document.activeElement))
  for (let i = 0; i < 60; i++) await page.keyboard.press('Tab')
  const stillInside = await page.evaluate(() => document.querySelector('[data-testid="skill-sources-dialog"]')?.contains(document.activeElement))
  const unnamed = await page.$$eval('[data-testid="skill-sources-dialog"] button', bs => bs.filter(b => !(b.getAttribute('aria-label') || b.textContent.trim())).length)
  const labels = await page.$$eval('.source-row .remove, .source-row .check, .source-row .copy-path', bs => bs.slice(0, 4).map(b => b.getAttribute('aria-label')))
  await ctx.close()
  expect(inside && stillInside && unnamed === 0, JSON.stringify({ inside, stillInside, unnamed })); return labels
})
await check('V15', 'Copy path writes the full path; tooltip carries the full path', async () => {
  const { ctx, page } = await open()
  const r = row(page, 'local-research-library')
  const title = await r.locator('.source-path').getAttribute('title')
  await r.locator('.copy-path').click()
  const clip = await page.evaluate(() => navigator.clipboard.readText())
  const label = await r.locator('.copy-path').getAttribute('aria-label')
  await ctx.close()
  expect(clip === title && title.endsWith('skills-library') && label === 'Copied', JSON.stringify({ clip, title, label })); return clip
})
await check('V16', 'Many sources: only the list scrolls; header, add area, footer stay visible', async () => {
  const { ctx, page } = await open({ scenario: 'skill_sources_many' })
  const metrics = await page.locator('.sources-scroll').evaluate(el => ({ scrollHeight: el.scrollHeight, clientHeight: el.clientHeight }))
  await page.locator('.sources-scroll').evaluate(el => { el.scrollTop = el.scrollHeight })
  const visible = await Promise.all(['#skill-sources-title', '#skill-source-input', '.btn-done'].map(s => page.locator(s).isVisible()))
  const inViewport = await page.evaluate(() => ['#skill-sources-title', '#skill-source-input', '.btn-done'].every(s => { const r = document.querySelector(s).getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight }))
  await ctx.close()
  expect(metrics.scrollHeight > metrics.clientHeight && visible.every(Boolean) && inViewport, JSON.stringify({ metrics, visible, inViewport })); return metrics
})
await check('V17', 'Registry error and import warning alerts', async () => {
  const a = await open({ scenario: 'skill_sources_registry_error' })
  const reg = await a.page.locator('.error-alert').innerText(); await a.ctx.close()
  const b = await open()
  await b.page.getByRole('button', { name: 'GitHub', exact: true }).click()
  await b.page.locator('#skill-source-input').fill('https://github.com/acme-labs/notes-with-warnings')
  await b.page.getByRole('button', { name: 'Import repository' }).click()
  await b.page.locator('.warning-alert').waitFor()
  const warn = await b.page.locator('.warning-alert').innerText(); await b.ctx.close()
  return { reg, warn }
})

await browser.close()
const summary = { baseUrl, passed: checks.filter(c => c.pass).length, failed: checks.filter(c => !c.pass).length, browserErrors: errors, externalRequests: external, checks }
if (out) await writeFile(out, JSON.stringify(summary, null, 2))
console.log(JSON.stringify({ passed: summary.passed, failed: summary.failed, browserErrors: errors.length, externalRequests: external.length }))
