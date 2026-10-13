#!/usr/bin/env node
// WEB-BASELINE-REFRESH-009: the design-only delegated-copy example data (prototype/delegated-copy-tasks/,
// plugins/98) on the source's Task summary and locate (1949fa9, 9679123). Baseline only, design-only
// data on: the Project Task Manager run lists five look-alike copies, each with its current Task; a
// summary shows its Task in Projects, on its own board, highlighted.
import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
const root = resolve(new URL('../..', import.meta.url).pathname)
const BASE = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4620'
const OUT = resolve(root, process.env.OUT || 'evidence/WEB-BASELINE-REFRESH-009/design-only-delegated-copy')
await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const results = []
const check = (id, ok, detail) => { results.push({ id, ok, detail }); console.log(ok ? 'PASS' : 'FAIL', id, JSON.stringify(detail)) }
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US', reducedMotion: 'reduce', timezoneId: 'UTC' })
const external = []; const errors = []
await ctx.route('**/*', route => { const u = new URL(route.request().url()); if (['127.0.0.1', 'localhost'].includes(u.hostname) || ['data:', 'blob:'].includes(u.protocol)) return route.continue(); external.push(u.href); return route.abort('blockedbyclient') })
await ctx.addInitScript(() => { if (sessionStorage.getItem('i')) return; sessionStorage.setItem('i', '1'); localStorage.clear(); localStorage.setItem('autobyteus.localization.preference-mode', 'en') })
const page = await ctx.newPage()
page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)) })
await page.goto(`${BASE}/chat?id=run-ptm-0001`); await page.waitForTimeout(4000)
const summaries = page.locator('[data-test="workspace-task-worker-task-summary"]')
const texts = await summaries.allInnerTexts()
check('DCE-001 copies show their current Task', texts.length === 5 && texts.some(t => t.startsWith('Image context files')) && !texts.some(t => t.startsWith('Fix the pre-existing')), texts)
await page.screenshot({ path: `${OUT}/DCE-001-tree.png` })
await summaries.filter({ hasText: 'Image context files' }).first().click(); await page.waitForTimeout(700)
const located = await page.evaluate(() => ({ board: document.querySelector('[data-testid="projects-panel-picker-select"]')?.selectedOptions?.[0]?.textContent?.trim(), focused: document.activeElement?.closest('[data-testid^="project-task-row-"]:not([data-testid="project-task-row-link"])')?.getAttribute('data-testid') }))
check('DCE-002 a summary shows its Task on its Project board', located.board === 'Desktop App' && located.focused === 'project-task-row-dct-image-context', located)
await page.screenshot({ path: `${OUT}/DCE-002-located.png` })
await summaries.filter({ hasText: 'Draft an onboarding agent package' }).first().click(); await page.waitForTimeout(700)
const temp = await page.evaluate(() => ({ board: document.querySelector('[data-testid="projects-panel-picker-select"]')?.selectedOptions?.[0]?.textContent?.trim(), focused: document.activeElement?.closest('[data-testid^="project-task-row-"]:not([data-testid="project-task-row-link"])')?.getAttribute('data-testid') }))
check('DCE-003 a Temp task summary shows the Temp tasks board', temp.focused === 'project-task-row-dct-temp-onboarding', temp)
await page.screenshot({ path: `${OUT}/DCE-003-temp.png` })
check('DCE-004 no browser error and no non-local request', errors.length === 0 && external.length === 0, { errors, external })
await writeFile(`${OUT}/results.json`, JSON.stringify({ generatedAt: new Date().toISOString(), base: BASE, results }, null, 2))
await browser.close()
