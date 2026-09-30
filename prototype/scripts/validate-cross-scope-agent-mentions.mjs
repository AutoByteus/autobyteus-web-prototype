#!/usr/bin/env node
// Browser validation for the cross-scope-agent-mentions prototype (Team run `@` mentions).
// Usage: PROTOTYPE_BASE_URL=http://127.0.0.1:3282 node prototype/scripts/validate-cross-scope-agent-mentions.mjs [resultsPath]
import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const base = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:3282'
const resultsPath = process.argv[2] || ''
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) })
const results = []
const pageErrors = []
const externalRequests = []
const check = (id, title, pass, detail = '') => { results.push({ id, title, pass: Boolean(pass), detail: String(detail) }); console.log(`${pass ? 'PASS' : 'FAIL'} ${id} ${title}${detail ? ` — ${detail}` : ''}`) }

const openPage = async ({ width = 1512, height = 952, hash = '' } = {}) => {
  const context = await browser.newContext({ viewport: { width, height }, locale: 'en-US', timezoneId: 'UTC' })
  const page = await context.newPage()
  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') pageErrors.push(message.text().slice(0, 300)) })
  page.on('request', (request) => { const url = new URL(request.url()); if (!['127.0.0.1', 'localhost'].includes(url.hostname) && url.protocol.startsWith('http')) externalRequests.push(request.url()) })
  await page.goto(`${base}/workspace${hash}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  return page
}
const openTeamRun = async (page) => {
  await page.getByText('prototype-workspace', { exact: true }).first().click(); await page.waitForTimeout(800)
  await page.getByText('Product Review Team', { exact: true }).first().click(); await page.waitForTimeout(800)
  await page.getByText('Review the current prototype baseline', { exact: false }).first().click(); await page.waitForTimeout(1800)
}
const box = (page) => page.getByPlaceholder('Type a message...').first()
const menu = (page) => page.locator('[data-test="run-mention-menu"]')
const tree = (page) => page.locator('[data-test="workspace-team-execution-tree"]').first()
const type = async (page, text) => { await box(page).click(); await page.keyboard.type(text, { delay: 4 }); await page.waitForTimeout(350) }

// ---- Relay route (recommended): the focused agent brings the collaborator in ----
const page = await openPage()
await openTeamRun(page)
await type(page, 'the input box is too high. please talk to @')
check('V-01', '`@` opens the menu above the run composer (AC-001)', await menu(page).isVisible() && (await menu(page).boundingBox()).y + (await menu(page).boundingBox()).height <= (await box(page).boundingBox()).y)
const menuText = await menu(page).innerText()
check('V-02', 'Menu lists shared Agents and Teams and no Agent Org (AC-001)', /Agents/.test(menuText) && /Agent teams/.test(menuText) && !/Product Launch Org/.test(menuText))
check('V-03', 'Menu says who receives the message', /researcher gets your message and brings them into this run/.test(menuText), menuText.split('\n').at(-1))
check('V-04', 'Definitions already in the run are tagged "In this run"', await page.locator('[data-test="run-mention-option-agent-writer"] [data-test="run-mention-option-in-run"]').count() === 1
  && await page.locator('[data-test="run-mention-option-fixture-product-team"] [data-test="run-mention-option-in-run"]').count() === 0)
await page.keyboard.type('zzz', { delay: 4 }); await page.waitForTimeout(300)
check('V-05', 'No match shows the empty state and the Org note', /No agents or teams match/.test(await menu(page).innerText()) && /Agent Orgs can’t be mentioned/.test(await menu(page).innerText()))
await page.keyboard.press('Enter'); await page.waitForTimeout(300)
check('V-06', 'Enter with no match does not send', (await box(page).inputValue()).endsWith('@zzz') && await page.locator('[data-test="user-message-mention"]').count() === 0)
await page.keyboard.press('Escape'); await page.waitForTimeout(200)
check('V-07', 'Escape closes the menu and keeps the text', !(await menu(page).isVisible()) && (await box(page).inputValue()).endsWith('@zzz'))
for (let i = 0; i < 3; i += 1) await page.keyboard.press('Backspace')
await page.keyboard.type('prod', { delay: 4 }); await page.waitForTimeout(300)
await page.keyboard.press('Enter'); await page.waitForTimeout(300)
check('V-08', 'Enter chooses the highlighted option and inserts `@Product Team `', (await box(page).inputValue()) === 'the input box is too high. please talk to @Product Team ')
check('V-09', 'Composer shows the mention chip and the routing hint', await page.locator('[data-test="run-mention-chip-Product Team"]').isVisible()
  && (await page.locator('[data-test="agent-input-mention-hint"]').innerText()) === 'researcher gets this message and brings Product Team into this run.')
await page.locator('[data-test="run-mention-chip-Product Team"] button').click(); await page.waitForTimeout(250)
check('V-10', 'Removing the chip keeps the words and drops the mention', (await box(page).inputValue()) === 'the input box is too high. please talk to Product Team ' && await page.locator('[data-test="agent-input-mention-chips"]').count() === 0)
await box(page).fill(''); await type(page, 'the input box is too high. please talk to @prod')
await page.locator('[data-test="run-mention-option-fixture-product-team"]').click(); await page.waitForTimeout(200)
await page.keyboard.type('to fix the UI first', { delay: 4 })
await page.keyboard.press('Enter')
await page.waitForTimeout(1200)
check('V-11', 'Sent message shows the mention as an inline chip (AC-002)', (await page.locator('[data-test="user-message-mention"]').first().innerText()) === '@Product Team')
check('V-12', 'Composer is cleared after send', (await box(page).inputValue()) === '' && await page.locator('[data-test="agent-input-mention-chips"]').count() === 0)
await page.waitForTimeout(7500)
const treeText = (await tree(page).innerText()).replace(/\n+/g, ' | ')
check('V-13', 'Added Team and its members appear under the run (AC-003)', /product team \| Added \| Added by researcher \| PP \| product prototyper \| PB \| prototype bootstrapper/.test(treeText), treeText)
check('V-14', 'Added rows are distinct from configured members and from temporary task rows', await page.locator('[data-test="workspace-added-badge"]').count() === 1
  && await page.locator('[data-test="workspace-team-transient-execution-row"][data-added="true"]').count() === 3
  && await page.locator('[data-team-icon="temporary-task-team"]').count() === 0)
check('V-15', 'Focused conversation shows the join notice with an Open action', await page.locator('[data-test="run-mention-notice-added"]').isVisible() && /Product Team joined this run/.test(await page.locator('[data-test="run-mention-notice-added"]').innerText()))
check('V-16', 'Team tab shows the messages exchanged with the collaborator (AC-004)', await page.locator('[data-test="team-communication-message-row"]').count() === 2)
await page.locator('[data-test="run-mention-notice-open"]').click(); await page.waitForTimeout(900)
check('V-17', 'Open focuses the collaborator; header shows Added and the inherited settings (AC-003)', await page.locator('[data-test="team-workspace-added-badge"]').isVisible()
  && (await page.locator('[data-test="team-workspace-added-settings"]').innerText()) === 'Added to this run · uses this run’s settings: AutoByteus · mock/gpt-prototype · prototype-workspace')
await type(page, 'also keep the workspace hint under the box'); await page.keyboard.press('Enter'); await page.waitForTimeout(2600)
check('V-18', 'The user can chat with the added collaborator directly (SC-003)', /also keep the workspace hint under the box/.test(await page.locator('[data-testid="agent-event-monitor"]').innerText()))
await page.locator('[data-test^="workspace-team-member-"]').filter({ hasText: 'researcher' }).first().click(); await page.waitForTimeout(900)
await type(page, '@prod')
check('V-19', 'Re-mention: the added Team is tagged "In this run" in the menu (SC-005)', await page.locator('[data-test="run-mention-option-fixture-product-team"] [data-test="run-mention-option-in-run"]').count() === 1)
await page.locator('[data-test="run-mention-option-fixture-product-team"]').click(); await page.keyboard.type('also check the narrow layout', { delay: 4 }); await page.waitForTimeout(250)
check('V-20', 'Re-mention chip and hint say no second copy is started (SC-005)', await page.locator('[data-test="run-mention-chip-Product Team"][data-in-run="true"]').isVisible()
  && (await page.locator('[data-test="agent-input-mention-hint"]').innerText()) === 'researcher gets this message and passes it on. No second copy is started.')
await page.keyboard.press('Enter'); await page.waitForTimeout(4200)
check('V-21', 'Re-mention adds no duplicate row (AC-005)', await page.locator('[data-test="workspace-added-badge"]').count() === 1 && await page.locator('[data-test="workspace-team-transient-execution-row"][data-added="true"]').count() === 3)
await type(page, 'ask @mark'); await page.locator('[data-test="run-mention-option-fixture-marketing-team"]').click(); await page.keyboard.type('for launch copy', { delay: 4 })
const rowsBefore = await tree(page).locator('[role="treeitem"]').count()
await page.keyboard.press('Enter'); await page.waitForTimeout(4200)
check('V-22', 'Failure to add is visible and says nothing was added (AC-006)', /Couldn’t add Marketing Team to this run/.test(await page.locator('[data-test="run-mention-notice-failed"]').innerText()) && /Nothing was added\./.test(await page.locator('[data-test="run-mention-notice-failed"]').innerText()))
check('V-23', 'Failure leaves the run tree unchanged (AC-006)', await tree(page).locator('[role="treeitem"]').count() === rowsBefore, `${rowsBefore} rows`)
await page.locator('[data-test="run-mention-notice-dismiss"]').click(); await page.waitForTimeout(200)
check('V-24', 'Notices can be dismissed', await page.locator('[data-test="run-mention-notices"]').count() === 0)
await page.context().close()

// ---- Review-only comparison (Q1 option a): straight to the collaborator ----
const direct = await openPage({ hash: '#mentionRoute=direct' })
await openTeamRun(direct)
await type(direct, 'please talk to @prod'); await direct.locator('[data-test="run-mention-option-fixture-product-team"]').click(); await direct.keyboard.type('to fix the UI first', { delay: 4 }); await direct.waitForTimeout(250)
check('V-25', 'Direct variant hint says the message goes straight to the collaborator', (await direct.locator('[data-test="agent-input-mention-hint"]').innerText()) === 'This message goes straight to Product Team, which joins this run.')
await direct.keyboard.press('Enter'); await direct.waitForTimeout(3500)
check('V-26', 'Direct variant: view follows the message to the collaborator; "Added by you"; no Team messages', await direct.locator('[data-test="team-workspace-added-badge"]').isVisible()
  && /Added by you/.test(await tree(direct).innerText()) && await direct.locator('[data-test="team-communication-message-row"]').count() === 0)
await direct.context().close()

// ---- Narrow window and preserved behavior ----
const narrow = await openPage({ width: 1024, height: 640 })
await openTeamRun(narrow)
await type(narrow, 'talk to @')
const narrowBox = await menu(narrow).boundingBox()
check('V-27', 'Menu stays inside a 1024x640 window', narrowBox && narrowBox.y >= 0 && narrowBox.x >= 0 && narrowBox.x + narrowBox.width <= 1024 && narrowBox.y + narrowBox.height <= 640, JSON.stringify(narrowBox))
await narrow.context().close()

const chat = await openPage()
await chat.goto(`${base}/chat`, { waitUntil: 'networkidle' }); await chat.waitForTimeout(1000)
await chat.locator('[data-test="chat-message-input"]').click(); await chat.keyboard.type('@', { delay: 4 }); await chat.waitForTimeout(350)
const chatMenu = await chat.locator('[data-test="chat-target-menu"]').innerText().catch(() => '')
check('V-28', 'New chat `@` is unchanged: launch-target picker without run-only entries', /Chat with/.test(chatMenu) && !/Bring into this run/.test(chatMenu) && !/Marketing Team/.test(chatMenu) && !/In this run/.test(chatMenu))
await chat.context().close()

check('V-29', 'No page errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '))
check('V-30', 'No external requests', externalRequests.length === 0, externalRequests.slice(0, 3).join(' | '))
await browser.close()
const failed = results.filter((entry) => !entry.pass)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
if (resultsPath) { await mkdir(dirname(resultsPath), { recursive: true }); await writeFile(resultsPath, JSON.stringify({ base, checkedAt: new Date().toISOString(), passed: results.length - failed.length, total: results.length, results }, null, 2)) }
process.exit(failed.length ? 1 : 0)
