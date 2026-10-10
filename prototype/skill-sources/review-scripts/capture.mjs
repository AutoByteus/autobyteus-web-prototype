#!/usr/bin/env node
// skill-sources-dialog-redesign: drives the Manage Skill Sources dialog through the product's own
// controls (Skills page -> Sources) and captures each review state.
// Usage: PROTOTYPE_BASE_URL=http://127.0.0.1:4731 node capture.mjs <output-dir> [shot-id ...]
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright-core'

const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4731'
const outDir = resolve(process.argv[2] || '/tmp/skill-sources-dialog-redesign/shots')
const only = new Set(process.argv.slice(3))
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const results = []
const browserErrors = []
const externalRequests = []

async function open({ scenario = 'populated', width = 1440, height = 900, context = 'electron_internal', locale = 'en', wait = true }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, locale: 'en-US', timezoneId: 'Europe/Berlin', colorScheme: 'light' })
  await ctx.addInitScript(([s, c, l]) => {
    if (sessionStorage.getItem('ssdr-init')) return
    sessionStorage.setItem('ssdr-init', '1')
    localStorage.clear()
    localStorage.setItem('autobyteus.prototype.scenario', s)
    localStorage.setItem('autobyteus.prototype.context', c)
    localStorage.setItem('autobyteus.localization.preference-mode', l)
  }, [scenario, context, locale])
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseUrl })
  const page = await ctx.newPage()
  page.on('console', m => { if (m.type() === 'error') browserErrors.push({ scenario, text: m.text() }) })
  page.on('pageerror', e => browserErrors.push({ scenario, text: e.message }))
  page.on('request', r => { const u = new URL(r.url()); if (!['127.0.0.1', 'localhost'].includes(u.hostname) && !u.protocol.startsWith('data')) externalRequests.push(r.url()) })
  await page.goto(`${baseUrl}/skills`, { waitUntil: 'domcontentloaded' })
  const sourcesButton = page.locator('.skills-toolbar button', { hasText: locale === 'zh-CN' ? '来源' : 'Sources' }).first()
  await sourcesButton.waitFor({ timeout: 30_000 })
  await page.waitForTimeout(400)
  await sourcesButton.click()
  const dialog = page.getByTestId('skill-sources-dialog')
  await dialog.waitFor()
  if (wait) await settle(page)
  return { ctx, page, dialog }
}

async function settle(page) {
  await page.waitForFunction(() => {
    const d = document.querySelector('[data-testid="skill-sources-dialog"]')
    return d && d.getAttribute('aria-busy') !== 'true' && d.querySelectorAll('.source-row').length > 0
  }, undefined, { timeout: 15_000 })
  await page.waitForTimeout(250)
}

const row = (page, id) => page.getByTestId(`skill-source-row-${id}`)

const shots = [
  { id: 'R01', name: 'populated-mixed-list', run: async () => open({}) },
  { id: 'R02', name: 'opening-checking-github', run: async () => { const o = await open({ wait: false }); await o.page.waitForSelector('.source-row'); await o.page.waitForTimeout(350); return o } },
  { id: 'R03', name: 'github-issues-update-failed-removal-incomplete', run: async () => {
    const o = await open({ scenario: 'skill_source_issues' })
    await o.page.locator('.sources-scroll').evaluate(el => { el.scrollTop = el.scrollHeight })
    await o.page.waitForTimeout(200); return o } },
  { id: 'R04', name: 'many-sources-scrolled', run: async () => {
    const o = await open({ scenario: 'skill_sources_many' })
    await o.page.locator('.sources-scroll').evaluate(el => { el.scrollTop = 420 })
    await o.page.waitForTimeout(200); return o } },
  { id: 'R05', name: 'add-github-trust-hint', run: async () => {
    const o = await open({})
    await o.page.locator('#skill-source-input').fill('https://github.com/acme-labs/writing-skills')
    return o } },
  { id: 'R06', name: 'add-local-browse-filled', run: async () => {
    const o = await open({})
    await o.page.getByRole('button', { name: 'Browse…' }).click()
    await o.page.waitForTimeout(200); return o } },
  { id: 'R07', name: 'add-local-working', run: async () => {
    const o = await open({})
    await o.page.locator('#skill-source-input').fill('/Users/alex/Projects/prompt-kits/skills')
    await o.page.getByRole('button', { name: 'Add', exact: true }).click()
    await o.page.waitForTimeout(200); return o } },
  { id: 'R08', name: 'add-local-success', run: async () => {
    const o = await open({})
    await o.page.locator('#skill-source-input').fill('/Users/alex/Projects/prompt-kits/skills')
    await o.page.getByRole('button', { name: 'Add', exact: true }).click()
    await o.page.waitForSelector('.success-alert'); await settle(o.page); return o } },
  { id: 'R09', name: 'add-local-error-kept-input', run: async () => {
    const o = await open({})
    await o.page.locator('#skill-source-input').fill('/Users/alex/Projects/missing-folder')
    await o.page.getByRole('button', { name: 'Add', exact: true }).click()
    await o.page.waitForSelector('.error-alert'); await settle(o.page); return o } },
  { id: 'R10', name: 'remove-confirmation-local', run: async () => {
    const o = await open({})
    await row(o.page, 'local-research-library').locator('.remove').click()
    await o.page.waitForTimeout(400); return o } },
  { id: 'R11', name: 'remove-confirmation-github', run: async () => {
    const o = await open({})
    await row(o.page, 'github-docs-skills').locator('.remove').click()
    await o.page.waitForTimeout(400); return o } },
  { id: 'R12', name: 'update-confirmation', run: async () => {
    const o = await open({})
    await row(o.page, 'github-review-skills').locator('.update').click()
    await o.page.waitForTimeout(400); return o } },
  { id: 'R13', name: 'updating-busy', run: async () => {
    const o = await open({})
    await row(o.page, 'github-review-skills').locator('.update').click()
    await o.page.waitForTimeout(400)
    await o.page.getByRole('button', { name: 'Update', exact: true }).last().click()
    await o.page.waitForTimeout(300); return o } },
  { id: 'R14', name: 'registry-error', run: async () => open({ scenario: 'skill_sources_registry_error' }) },
  { id: 'R15', name: 'import-warning', run: async () => {
    const o = await open({})
    await o.page.locator('#skill-source-input').fill('https://github.com/acme-labs/notes-with-warnings')
    await o.page.getByRole('button', { name: 'Add', exact: true }).click()
    await o.page.waitForSelector('.warning-alert', { timeout: 10_000 }); await settle(o.page); return o } },
  { id: 'R16', name: 'duplicate-name-conflict', run: async () => {
    const o = await open({})
    await o.page.locator('#skill-source-input').fill('/Users/alex/Downloads/duplicate-skills')
    await o.page.getByRole('button', { name: 'Add', exact: true }).click()
    await o.page.getByTestId('skill-name-conflict-dialog').waitFor({ timeout: 10_000 }); await o.page.waitForTimeout(300); return o } },
  { id: 'R17', name: 'keyboard-focus-remove', run: async () => {
    const o = await open({})
    await row(o.page, 'local-codex').locator('.remove').focus()
    await o.page.keyboard.press('Shift+Tab'); await o.page.keyboard.press('Tab')
    await o.page.waitForTimeout(150); return o } },
  { id: 'R18', name: 'hover-row-tooltip-target', run: async () => {
    const o = await open({})
    await row(o.page, 'local-research-library').hover()
    await row(o.page, 'local-research-library').locator('.remove').hover()
    await o.page.waitForTimeout(200); return o } },
  { id: 'R19', name: 'narrow-mobile', run: async () => open({ width: 390, height: 844, context: 'desktop' }) },
  { id: 'R20', name: 'narrow-mobile-add', run: async () => {
    const o = await open({ width: 390, height: 844, context: 'desktop' })
    await o.page.locator('.sources-scroll').evaluate(el => { el.scrollTop = el.scrollHeight })
    return o } },
  { id: 'R21', name: 'zh-cn', run: async () => open({ locale: 'zh-CN' }) },
  { id: 'R22', name: 'browser-context-no-browse', run: async () => open({ context: 'desktop' }) },
  { id: 'R23', name: 'small-window-1024x700', run: async () => open({ width: 1024, height: 700 }) },
]

for (const shot of shots) {
  if (only.size && !only.has(shot.id)) continue
  let o
  try {
    o = await shot.run()
    const file = resolve(outDir, `${shot.id}-${shot.name}.png`)
    await o.page.screenshot({ path: file })
    const vp = o.page.viewportSize()
    results.push({ id: shot.id, name: shot.name, file, viewport: `${vp.width}x${vp.height}`, ok: true })
    console.log('ok', shot.id, shot.name)
  } catch (error) {
    results.push({ id: shot.id, name: shot.name, ok: false, error: String(error.message || error).slice(0, 400) })
    console.log('FAIL', shot.id, String(error.message || error).slice(0, 300))
  } finally { await o?.ctx.close() }
}
await browser.close()
await writeFile(resolve(outDir, 'capture-results.json'), JSON.stringify({ baseUrl, results, browserErrors, externalRequests }, null, 2))
console.log(JSON.stringify({ failures: results.filter(r => !r.ok).length, browserErrors: browserErrors.length, externalRequests: externalRequests.length }))
