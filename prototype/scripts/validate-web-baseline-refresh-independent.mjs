#!/usr/bin/env node
// Independent-run check (WEB-BASELINE-REFRESH-002, extended by -003 with the
// Background Tasks rows): exercises the built preview
// (PORT=<port> node .output/server/index.mjs; BASE/OUT override the defaults) with the pinned source and the
// observation node stopped, recording browser errors and non-local requests.
import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
const OUT = process.env.OUT || 'evidence/WEB-BASELINE-REFRESH-003/independent-preview'
const BASE = process.env.BASE || 'http://127.0.0.1:4195'
const PORT = new URL(BASE).port
await mkdir(OUT, { recursive: true })
const b = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const results = []
const run = async (id, path, steps = async () => {}) => {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US', timezoneId: 'UTC' })
  const external = []; const errors = []
  await ctx.route('**/*', route => { const u = new URL(route.request().url()); if (['127.0.0.1', 'localhost'].includes(u.hostname) && u.port === PORT || ['data:', 'blob:'].includes(u.protocol)) return route.continue(); external.push(u.href); return route.abort('blockedbyclient') })
  await ctx.addInitScript(() => { if (sessionStorage.getItem('i')) return; sessionStorage.setItem('i', '1'); localStorage.clear(); localStorage.setItem('autobyteus.localization.preference-mode', 'en') })
  const p = await ctx.newPage(); p.on('pageerror', e => errors.push(e.message)); p.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)) })
  await p.goto(BASE + path); await p.waitForTimeout(2500)
  let stepError = null; try { await steps(p) } catch (e) { stepError = e.message.split('\n')[0] }
  await p.waitForTimeout(1500)
  await p.screenshot({ path: `${OUT}/${id}.png` })
  const route = await p.evaluate(() => location.pathname + location.search)
  results.push({ id, path, route, stepError, errors, external }); console.log(id, route, 'stepError=', stepError, 'errors=', errors.length, 'external=', external.length)
  await ctx.close()
}
const composer = p => p.getByPlaceholder('Ask anything · / for skills · @ for an agent or team')
await run('IND-001-chat', '/')
await run('IND-002-chat-thinking-menu', '/chat', async p => { await p.getByRole('button', { name: /^Model: / }).click(); await p.waitForTimeout(500); await p.locator('[data-test="chat-runtime-autobyteus"]').click(); await p.waitForTimeout(500); await p.getByText(/reasoning-prototype/).first().click(); await p.waitForTimeout(500); await p.getByRole('button', { name: /^Thinking: / }).click() })
await run('IND-003-chat-send', '/chat', async p => { await composer(p).click(); await p.keyboard.type('Summarize the synthetic baseline.'); await p.keyboard.press('Enter'); await p.waitForTimeout(2500) })
await run('IND-004-workspace-team-run', '/workspace', async p => { await p.getByText('prototype-workspace', { exact: true }).first().click(); await p.waitForTimeout(700); await p.getByText('Product Review Team', { exact: true }).first().click(); await p.waitForTimeout(700); await p.getByText('Review the current prototype baseline', { exact: true }).first().click() })
await run('IND-005-skills-banner', '/skills', async p => { await p.evaluate(() => { localStorage.setItem('autobyteus.prototype.scenario', 'skill_name_issues') }); await p.reload(); await p.waitForTimeout(2500) })
await run('IND-006-agents', '/agents?view=list')
await run('IND-007-chat-background-tasks-empty', '/chat', async p => { await composer(p).click(); await p.keyboard.type('Summarize the synthetic baseline.'); await p.keyboard.press('Enter'); await p.waitForTimeout(2500); await p.locator('[data-test="background-tasks-header"]').click(); await p.locator('[data-test="background-tasks-empty"]').waitFor({ timeout: 5000 }) })
await writeFile(`${OUT}/results.json`, JSON.stringify({ generatedAt: new Date().toISOString(), base: BASE, note: 'Built preview (node .output/server/index.mjs) with the pinned source and the observation node stopped.', results }, null, 2))
await b.close()
