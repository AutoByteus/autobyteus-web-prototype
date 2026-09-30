#!/usr/bin/env node
// Captures the normative final references (VIS-001…) for the cross-scope-agent-mentions ticket.
// Usage: PROTOTYPE_BASE_URL=http://127.0.0.1:3283 node prototype/scripts/capture-cross-scope-agent-mentions-final.mjs [ticketRoot]
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-core'

const base = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:3283'
const ticketRoot = path.resolve(process.argv[2] || 'tickets/in-progress/cross-scope-agent-mentions')
const out = path.join(ticketRoot, 'visual-references')
await fs.mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) })
const errors = []
const references = []
const style = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'

const open = async (viewport = { width: 1512, height: 952 }) => {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'UTC', colorScheme: 'light' })
  // A fixed clock keeps timestamps in the references stable.
  await context.addInitScript(() => {
    const fixed = new Date('2026-09-30T10:00:00.000Z').getTime(); let tick = 0
    const RealDate = Date
    // eslint-disable-next-line no-global-assign
    Date = class extends RealDate { constructor(...args) { super(...(args.length ? args : [fixed + (tick += 1000)])) } static now() { return fixed + (tick += 1000) } }
  })
  const page = await context.newPage()
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text().slice(0, 300)) })
  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await page.goto(`${base}/workspace`, { waitUntil: 'networkidle' }); await page.waitForTimeout(1500)
  await page.addStyleTag({ content: style })
  return page
}
const shot = async (page, id, name, state, viewport = '1512x952') => {
  const filename = `${id}-${name}-${viewport}.png`
  // Park the pointer in an empty corner so no hover state shows.
  const size = page.viewportSize()
  await page.mouse.move(size.width - 3, size.height - 3)
  await page.waitForTimeout(250)
  await page.screenshot({ path: path.join(out, filename) })
  const sha256 = crypto.createHash('sha256').update(await fs.readFile(path.join(out, filename))).digest('hex')
  references.push({ id, filename, viewport, state, sha256 })
  console.log('captured', filename)
}
const box = (page) => page.getByPlaceholder(/Type a message|Message |Reply/).first()
const type = async (page, text) => { await box(page).click(); await page.keyboard.type(text, { delay: 4 }); await page.waitForTimeout(350) }
const mention = async (page, query, id, rest) => { await type(page, query); await page.locator(`[data-test="run-mention-option-${id}"]`).click(); await page.keyboard.type(rest, { delay: 4 }); await page.waitForTimeout(250) }
const expandWorkspace = async (page) => { await page.getByText('prototype-workspace', { exact: true }).first().click(); await page.waitForTimeout(800) }
const openTeamRun = async (page) => {
  await page.getByText('Product Review Team', { exact: true }).first().click(); await page.waitForTimeout(700)
  await page.getByText('Review the current prototype baseline', { exact: false }).first().click(); await page.waitForTimeout(1800)
}

// ---- Team run ----
let page = await open()
await expandWorkspace(page); await openTeamRun(page)
await type(page, 'the input box is too high. please talk to @')
await shot(page, 'VIS-001', 'team-run-at-menu', 'Team run, focused on researcher: `@` menu open above the composer; only standalone Agents and Agent Teams that are not in the run are listed.')
await page.keyboard.type('zzz', { delay: 4 }); await page.waitForTimeout(300)
await shot(page, 'VIS-002', 'team-run-at-menu-empty', 'Team run: `@zzz` has no match; empty state with the Agent Org note.')
for (let i = 0; i < 3; i += 1) await page.keyboard.press('Backspace')
await page.keyboard.type('prod', { delay: 4 }); await page.waitForTimeout(300)
await page.locator('[data-test="run-mention-option-fixture-product-team"]').click(); await page.keyboard.type('to fix the UI first', { delay: 4 }); await page.waitForTimeout(300)
await shot(page, 'VIS-003', 'team-run-composer-mention-chip', 'Team run: `@Product Team` chosen; chip row above the text, `@Product Team` inline in the text.')
await page.keyboard.press('Enter'); await page.waitForTimeout(9000)
await shot(page, 'VIS-004', 'team-run-task-team-added', 'Team run after send: mention chip in the sent message, `delegate_task` call, task Team and its members in the run tree, Team tab with the later message from the task Team.')
await page.locator('[data-test="workspace-team-transient-execution-row"]').filter({ hasText: 'product prototyper' }).click(); await page.waitForTimeout(1500)
await shot(page, 'VIS-005', 'team-run-task-member-conversation', 'Team run: task Team member focused; the delegated brief is the system task notice at the top of its conversation.')
await page.locator('[data-test^="workspace-team-member-"]').filter({ hasText: 'researcher' }).first().click(); await page.waitForTimeout(1200)
await mention(page, 'ask @comp', 'fixture-computer-use-agent', 'to publish the release note'); await page.keyboard.press('Enter'); await page.waitForTimeout(9000)
await shot(page, 'VIS-006', 'team-run-task-agent-and-task-team', 'Team run with a task Agent and a task Team under the run: task rows with solid status dot and initials, no "Started by" line, straight branch line.')
await mention(page, 'ask @mark', 'fixture-marketing-team', 'for launch copy'); await page.keyboard.press('Enter'); await page.waitForTimeout(5000)
await shot(page, 'VIS-007', 'team-run-add-failed-notice', 'Team run: the collaborator could not be brought in; failure notice above the composer, run tree unchanged.')
await page.context().close()

// ---- Org run ----
page = await open()
await expandWorkspace(page)
await page.getByText('Product Launch Org', { exact: true }).first().click(); await page.waitForTimeout(700)
await page.getByText('Coordinate the synthetic launch review', { exact: false }).first().click(); await page.waitForTimeout(1500)
await page.getByText('analyst', { exact: true }).first().click(); await page.waitForTimeout(1500)
await type(page, 'please ask @')
await shot(page, 'VIS-008', 'org-run-at-menu', 'Org run, focused on analyst: `@` menu; the Org, its members and its teams are not listed.')
await page.keyboard.type('comp', { delay: 4 }); await page.waitForTimeout(300)
await page.locator('[data-test="run-mention-option-fixture-computer-use-agent"]').click(); await page.keyboard.type('to publish the release note', { delay: 4 })
await page.keyboard.press('Enter'); await page.waitForTimeout(9000)
await mention(page, '@prod', 'fixture-product-team', 'please fix the UI first'); await page.keyboard.press('Enter'); await page.waitForTimeout(9000)
await shot(page, 'VIS-009', 'org-run-task-agent-and-task-team', 'Org run with a task Agent and a task Team under the Org run; Org tab with the later messages.')
await page.locator('[data-test^="agent-org-run-children-"]').getByText('computer use agent', { exact: true }).click(); await page.waitForTimeout(1500)
await shot(page, 'VIS-010', 'org-run-task-agent-conversation', 'Org run: task Agent focused; system task notice, its reply, composer available.')
await page.context().close()

// ---- Standalone Agent run ----
page = await open()
await expandWorkspace(page)
await page.locator('[data-test="workspace-agent-row"]').first().click(); await page.waitForTimeout(700)
await page.locator('[data-test="workspace-agent-run-row"]').first().click(); await page.waitForTimeout(2500)
await page.addStyleTag({ content: style })
await type(page, 'please ask @')
await shot(page, 'VIS-011', 'agent-run-at-menu', 'Standalone Agent run (Research Assistant): `@` menu; the run\'s own agent is not listed.')
await page.keyboard.type('comp', { delay: 4 }); await page.waitForTimeout(300)
await page.locator('[data-test="run-mention-option-fixture-computer-use-agent"]').click(); await page.keyboard.type('to publish the release note', { delay: 4 })
await page.keyboard.press('Enter'); await page.waitForTimeout(9000)
await mention(page, '@prod', 'fixture-product-team', 'please fix the UI first'); await page.keyboard.press('Enter'); await page.waitForTimeout(9000)
await shot(page, 'VIS-012', 'agent-run-task-agent-and-task-team', 'Standalone Agent run with a task Agent and a task Team listed under the run row; Team tab present with the later messages.')
await page.locator('[data-test="workspace-agent-run-task-tree"]').getByText('computer use agent', { exact: true }).click(); await page.waitForTimeout(1500)
await shot(page, 'VIS-013', 'agent-run-task-agent-conversation', 'Standalone Agent run: task Agent focused; header titled by its name; run row no longer highlighted.')
await page.context().close()

// ---- Smaller window ----
page = await open({ width: 1024, height: 640 })
await expandWorkspace(page); await openTeamRun(page)
await type(page, 'talk to @')
await shot(page, 'VIS-014', 'team-run-at-menu-small-window', 'Team run in a 1024x640 window: the `@` menu stays inside the window above the composer.', '1024x640')
await page.context().close()

await browser.close()
await fs.writeFile(path.join(out, 'manifest.json'), JSON.stringify({ base, capturedAt: new Date().toISOString(), references }, null, 2))
if (errors.length) { console.error('Browser errors:\n' + errors.slice(0, 10).join('\n')); process.exit(1) }
console.log(`${references.length} references captured, 0 browser errors`)
