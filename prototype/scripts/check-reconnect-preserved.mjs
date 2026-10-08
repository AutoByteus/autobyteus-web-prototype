#!/usr/bin/env node
// WEB-BASELINE-REFRESH-008: the accepted design-only Reconnect change (agent-definition-reconnect-ui,
// no source equivalent) is preserved on the refreshed baseline. Runs the ticket's own review scripts
// (prototype/agent-reconnect/review-scripts) against the baseline with design-only data on, and
// records step failures, browser errors and non-local requests. Screenshots go to /tmp/adr and are
// copied into the evidence folder.
import { chromium } from 'playwright-core'
import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
const root = resolve(new URL('../..', import.meta.url).pathname)
const BASE = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4620'
const OUT = resolve(root, process.env.OUT || 'evidence/WEB-BASELINE-REFRESH-008/reconnect-preserved')
const scripts = resolve(root, 'prototype/agent-reconnect/review-scripts')
await mkdir('/tmp/adr', { recursive: true }); await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor
const results = []
for (const file of (await readdir(scripts)).filter(name => name.endsWith('.js')).sort()) {
  const narrow = file.startsWith('narrow')
  const ctx = await browser.newContext({ viewport: narrow ? { width: 390, height: 844 } : { width: 1440, height: 900 }, locale: 'en-US', timezoneId: 'UTC', reducedMotion: 'reduce' })
  const external = []; const errors = []
  await ctx.route('**/*', route => { const u = new URL(route.request().url()); if (['127.0.0.1', 'localhost'].includes(u.hostname) || ['data:', 'blob:'].includes(u.protocol)) return route.continue(); external.push(u.href); return route.abort('blockedbyclient') })
  await ctx.addInitScript(() => { if (sessionStorage.getItem('i')) return; sessionStorage.setItem('i', '1'); localStorage.clear(); localStorage.setItem('autobyteus.localization.preference-mode', 'en') })
  const page = await ctx.newPage(); page.setDefaultTimeout(8000)
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)) })
  await page.goto(`${BASE}/workspace`); await page.waitForTimeout(2500)
  let stepError = null
  try { await new AsyncFunction('page', await readFile(resolve(scripts, file), 'utf8'))(page) } catch (error) { stepError = error.message.split('\n')[0] }
  results.push({ script: file, stepError, errors, external, pass: !stepError && !errors.length && !external.length })
  console.log(`${!stepError && !errors.length && !external.length ? 'PASS' : 'FAIL'} ${file} step=${stepError} errors=${errors.length} external=${external.length}`)
  await ctx.close()
}
await browser.close()
await cp('/tmp/adr', OUT, { recursive: true })
await writeFile(resolve(OUT, 'results.json'), JSON.stringify({ generatedAt: new Date().toISOString(), base: BASE, results }, null, 2))
