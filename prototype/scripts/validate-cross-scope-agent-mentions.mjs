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

// ---- Team run: the focused agent receives the message and brings the collaborator in ----
const page = await openPage()
await openTeamRun(page)
await type(page, 'the input box is too high. please talk to @')
check('V-01', '`@` opens the menu above the run composer (AC-001)', await menu(page).isVisible() && (await menu(page).boundingBox()).y + (await menu(page).boundingBox()).height <= (await box(page).boundingBox()).y)
const menuText = await menu(page).innerText()
check('V-02', 'Menu lists shared Agents and Teams and no Agent Org (AC-001)', /Agents/.test(menuText) && /Agent teams/.test(menuText) && !/Product Launch Org/.test(menuText))
check('V-03', 'Menu says who receives the message', /researcher gets your message and brings them into this run/.test(menuText), menuText.split('\n').at(-1))
check('V-04', 'Only what is not in the run is offered: the run\'s own team and its members are left out', await page.locator('[data-test="run-mention-option-agent-writer"]').count() === 0
  && await page.locator('[data-test="run-mention-option-agent-researcher"]').count() === 0 && await page.locator('[data-test="run-mention-option-team-product"]').count() === 0
  && await page.locator('[data-test="run-mention-option-fixture-product-team"]').count() === 1 && await page.locator('[data-test="run-mention-option-fixture-computer-use-agent"]').count() === 1)
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
check('V-09', 'Composer shows the mention chip and no extra explanatory text', await page.locator('[data-test="run-mention-chip-Product Team"]').isVisible()
  && (await page.locator('[data-test="agent-input-mention-chips"]').innerText()).trim() === '@Product Team')
await page.locator('[data-test="run-mention-chip-Product Team"] button').click(); await page.waitForTimeout(250)
check('V-10', 'Removing the chip keeps the words and drops the mention', (await box(page).inputValue()) === 'the input box is too high. please talk to Product Team ' && await page.locator('[data-test="agent-input-mention-chips"]').count() === 0)
await box(page).fill(''); await type(page, 'the input box is too high. please talk to @prod')
await page.locator('[data-test="run-mention-option-fixture-product-team"]').click(); await page.waitForTimeout(200)
await page.keyboard.type('to fix the UI first', { delay: 4 })
await page.keyboard.press('Enter')
await page.waitForTimeout(1200)
check('V-11', 'Sent message shows the mention as an inline chip (AC-002)', (await page.locator('[data-test="user-message-mention"]').first().innerText()) === '@Product Team')
check('V-12', 'Composer is cleared after send', (await box(page).inputValue()) === '' && await page.locator('[data-test="agent-input-mention-chips"]').count() === 0)
const offlineRow = page.locator('[data-test="workspace-team-transient-execution-row"]').filter({ hasText: 'product prototyper' })
check('V-49', 'The collaborator is added when the message is sent and shows Offline before its first message (D-R2)', await offlineRow.count() === 1
  && /Offline/i.test(await offlineRow.getAttribute('aria-label') ?? ''), await offlineRow.getAttribute('aria-label').catch(() => ''))
await page.waitForTimeout(7500)
const treeText = (await tree(page).innerText()).replace(/\n+/g, ' | ')
check('V-13', 'The Team and its members appear under the run (AC-003)', /product team \| PP \| product prototyper \| PB \| prototype bootstrapper/.test(treeText), treeText)
check('V-14', 'It uses the existing task Team presentation with no "Added" text', await page.locator('[data-test="workspace-team-transient-execution-row"]').count() === 3
  && await page.locator('[data-team-icon="temporary-task-team"]').count() === 1
  && !/Added|Started by/.test(treeText))
check('V-15', 'Success shows no notice above the composer; the tree is the signal', await page.locator('[data-test="run-mention-notices"]').count() === 0)
const teamRows = async (target) => (await target.locator('[data-test="team-communication-message-row"]').allInnerTexts()).join(' || ')
check('V-16', 'Team tab shows the briefing row to the collaborator and its later report (AC-004)', await page.locator('[data-test="team-communication-message-row"]').count() === 2
  && /to product prototyper/.test(await teamRows(page)) && /from product prototyper/.test(await teamRows(page)), await teamRows(page))
check('V-50', 'The focused agent briefs the collaborator with `send_message_to`, not `delegate_task`', /send_message_to/.test(await page.locator('[data-testid="agent-event-monitor"]').innerText())
  && !/delegate_task/.test(await page.locator('[data-testid="agent-event-monitor"]').innerText()))
await page.locator('[data-test="workspace-team-transient-execution-row"]').filter({ hasText: 'product prototyper' }).click(); await page.waitForTimeout(1500)
check('V-17', 'Clicking the task row focuses the collaborator with its conversation and no load error', (await page.locator('[data-testid="team-workspace-surface"] h4').innerText()) === 'product prototyper'
  && /Got it/.test(await page.locator('[data-testid="agent-event-monitor"]').innerText())
  && /The user asked: “?"?the input box is too high/.test(await page.locator('[data-testid="agent-event-monitor"]').innerText())
  && await page.locator('[data-testid="system-task-notification-segment"]').count() === 0
  && !/Couldn't load activity/.test(await tree(page).innerText()))
await type(page, 'also keep the workspace hint under the box'); await page.keyboard.press('Enter'); await page.waitForTimeout(2600)
check('V-18', 'The user can chat with the added collaborator directly (SC-003)', /also keep the workspace hint under the box/.test(await page.locator('[data-testid="agent-event-monitor"]').innerText()))
await page.locator('[data-test^="workspace-team-member-"]').filter({ hasText: 'researcher' }).first().click(); await page.waitForTimeout(900)
await type(page, '@prod')
check('V-19', 'Once brought in, the Team is no longer offered (SC-005)', await page.locator('[data-test="run-mention-option-fixture-product-team"]').count() === 0)
check('V-20', 'Typing its name now shows the empty state', /No agents or teams match/.test(await menu(page).innerText()))
await page.keyboard.press('Escape'); await box(page).fill(''); await page.waitForTimeout(200)
check('V-21', 'No duplicate row exists (AC-005)', await page.locator('[data-test="workspace-team-transient-execution-row"]').count() === 3)
await type(page, 'ask @mark'); await page.locator('[data-test="run-mention-option-fixture-marketing-team"]').click(); await page.keyboard.type('for launch copy', { delay: 4 })
const rowsBefore = await tree(page).locator('[role="treeitem"]').count()
const monitorBefore = await page.locator('[data-testid="agent-event-monitor"]').innerText()
await page.keyboard.press('Enter'); await page.waitForTimeout(2500)
check('V-22', 'Failure to add is visible on send and says nothing was added (AC-006, D-R1)', /Couldn’t add Marketing Team to this run/.test(await page.locator('[data-test="run-mention-notice-failed"]').innerText()) && /Nothing was added\./.test(await page.locator('[data-test="run-mention-notice-failed"]').innerText()))
check('V-23', 'Failure leaves the run tree unchanged (AC-006)', await tree(page).locator('[role="treeitem"]').count() === rowsBefore, `${rowsBefore} rows`)
check('V-51', 'Failure blocks the send: the draft and its chip stay, no message and no agent turn (D-R1)', (await box(page).inputValue()) === 'ask @Marketing Team for launch copy'
  && await page.locator('[data-test="run-mention-chip-Marketing Team"]').count() === 1
  && await page.locator('[data-test="user-message-mention"]', { hasText: '@Marketing Team' }).count() === 0
  && !/brief Marketing Team/.test(await page.locator('[data-testid="agent-event-monitor"]').innerText()), monitorBefore.length)
await page.locator('[data-test="run-mention-notice-dismiss"]').click(); await page.waitForTimeout(200)
check('V-24', 'Notices can be dismissed', await page.locator('[data-test="run-mention-notices"]').count() === 0)
await page.context().close()

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

// ---- Org run (SC-007) ----
const org = await openPage()
await org.getByText('prototype-workspace', { exact: true }).first().click(); await org.waitForTimeout(800)
await org.getByText('Product Launch Org', { exact: true }).first().click(); await org.waitForTimeout(800)
await org.getByText('Coordinate the synthetic launch review', { exact: false }).first().click(); await org.waitForTimeout(1500)
await org.getByText('analyst', { exact: true }).first().click(); await org.waitForTimeout(1500)
const orgTree = () => org.locator('[data-test^="agent-org-run-children-"]').first()
await type(org, 'please ask @')
const orgMenu = await menu(org).innerText()
check('V-31', 'Org run: `@` opens the same menu; the Org, its members and its teams are not offered', /Bring into this run/.test(orgMenu) && /analyst gets your message/.test(orgMenu)
  && await org.locator('[data-test="run-mention-option-team-product"]').count() === 0 && await org.locator('[data-test="run-mention-option-agent-researcher"]').count() === 0 && !/Product Launch Org/.test(orgMenu))
await org.keyboard.type('comp', { delay: 4 }); await org.waitForTimeout(300)
await org.locator('[data-test="run-mention-option-fixture-computer-use-agent"]').click(); await org.keyboard.type('to publish the release note', { delay: 4 })
await org.keyboard.press('Enter'); await org.waitForTimeout(8000)
const orgTreeText = (await orgTree().innerText()).replace(/\n+/g, ' | ')
check('V-32', 'Org run: the task Agent appears under the Org run with member-style marker and no "Started by"', /computer use agent/.test(orgTreeText) && !/Started by|Added/.test(orgTreeText)
  && await org.locator('[data-test="agent-org-task-agent-avatar"]').count() === 1, orgTreeText)
check('V-33', 'Org run: the Org tab shows the briefing row and the later report', await org.locator('[data-test="team-communication-message-row"]').count() === 2
  && /to computer use agent/.test(await teamRows(org)) && /from computer use agent/.test(await teamRows(org)), await teamRows(org))
await orgTree().getByText('computer use agent', { exact: true }).click(); await org.waitForTimeout(1500)
check('V-34', 'Org run: the collaborator\'s conversation starts with the briefing as a message, no task notice', /The user asked: “?"?please ask @Computer Use Agent/.test(await org.locator('[data-testid="agent-event-monitor"]').innerText())
  && await org.locator('[data-testid="system-task-notification-segment"]').count() === 0)
await type(org, 'also post it on the company page'); await org.keyboard.press('Enter'); await org.waitForTimeout(2600)
check('V-35', 'Org run: the user can chat with the task Agent directly', /also post it on the company page/.test(await org.locator('[data-testid="agent-event-monitor"]').innerText())
  && /Understood/.test(await org.locator('[data-testid="agent-event-monitor"]').innerText()))
await orgTree().getByText('analyst', { exact: true }).click(); await org.waitForTimeout(1200)
await type(org, '@prod'); await org.locator('[data-test="run-mention-option-fixture-product-team"]').click(); await org.keyboard.type('please fix the UI first', { delay: 4 })
await org.keyboard.press('Enter'); await org.waitForTimeout(8000)
check('V-36', 'Org run: a task Team and its members appear under the Org run', /product team \| PP \| product prototyper \| PB \| prototype bootstrapper/.test((await orgTree().innerText()).replace(/\n+/g, ' | ')), (await orgTree().innerText()).replace(/\n+/g, ' | '))
await type(org, 'ask @mark'); await org.locator('[data-test="run-mention-option-fixture-marketing-team"]').click(); await org.keyboard.type('for launch copy', { delay: 4 })
await org.keyboard.press('Enter'); await org.waitForTimeout(2500)
check('V-37', 'Org run: a failure shows the notice, keeps the draft and adds nothing', /Couldn’t add Marketing Team to this run/.test(await org.locator('[data-test="run-mention-notice-failed"]').innerText())
  && !/marketing team/.test(await orgTree().innerText()) && (await box(org).inputValue()) === 'ask @Marketing Team for launch copy')
await org.context().close()

// ---- Standalone Agent run ----
const agent = await openPage()
await agent.goto(`${base}/chat`, { waitUntil: 'networkidle' }); await agent.waitForTimeout(1000)
await agent.locator('[data-test="chat-message-input"]').click(); await agent.keyboard.type('help me plan the release', { delay: 4 })
await agent.keyboard.press('Enter'); await agent.waitForTimeout(3500)
const agentBox = () => agent.getByPlaceholder(/Reply|Message /).first()
const agentType = async (text) => { await agentBox().click(); await agent.keyboard.type(text, { delay: 4 }); await agent.waitForTimeout(350) }
check('V-38', 'Agent run: the first chat message gets a reply and the run is Idle', /Understood/.test(await agent.locator('[data-testid="agent-event-monitor"]').innerText())
  && /Idle/.test(await agent.locator('[data-testid="agent-workspace-surface"], [data-testid="team-workspace-surface"]').first().innerText().catch(() => agent.locator('body').innerText())))
await agentType('please ask @comp')
check('V-39', 'Agent run: `@` opens the menu in the run view', await menu(agent).isVisible() && /Daily Assistant gets your message/.test(await menu(agent).innerText()))
await agent.locator('[data-test="run-mention-option-fixture-computer-use-agent"]').click(); await agent.keyboard.type('to publish the release note', { delay: 4 })
await agent.keyboard.press('Enter'); await agent.waitForTimeout(8000)
const agentTree = () => agent.locator('[data-test="workspace-agent-run-task-tree"]').first()
check('V-40', 'Agent run: the collaborator appears under the run row and the Team tab shows the briefing and the report', /computer use agent/.test(await agentTree().innerText())
  && await agent.locator('[data-test="team-communication-message-row"]').count() === 2)
await agentTree().getByText('computer use agent', { exact: true }).click(); await agent.waitForTimeout(1200)
check('V-41', 'Agent run: clicking the collaborator opens its conversation (briefing as a message), titled by its name', /The user asked: “?"?please ask @Computer Use Agent/.test(await agent.locator('[data-testid="agent-event-monitor"]').innerText())
  && await agent.locator('[data-testid="system-task-notification-segment"]').count() === 0
  && await agent.locator('h4', { hasText: 'computer use agent' }).count() === 1)
await agentType('also post it on the company page'); await agent.keyboard.press('Enter'); await agent.waitForTimeout(2600)
check('V-42', 'Agent run: the user can chat with the task Agent directly', /also post it on the company page/.test(await agent.locator('[data-testid="agent-event-monitor"]').innerText()))
await agent.locator('[data-test="workspace-agent-run-row"]').first().click(); await agent.waitForTimeout(1200)
check('V-43', 'Agent run: clicking the run row returns to the run\'s own conversation', /help me plan the release/.test(await agent.locator('[data-testid="agent-event-monitor"]').innerText())
  && !/also post it on the company page/.test(await agent.locator('[data-testid="agent-event-monitor"]').innerText()))
await agentType('@prod'); await agent.locator('[data-test="run-mention-option-fixture-product-team"]').click(); await agent.keyboard.type('please fix the UI first', { delay: 4 })
await agent.keyboard.press('Enter'); await agent.waitForTimeout(8000)
check('V-44', 'Agent run: a task Team and its members appear under the run row', /product team \| PP \| product prototyper \| PB \| prototype bootstrapper/.test((await agentTree().innerText()).replace(/\n+/g, ' | ')), (await agentTree().innerText()).replace(/\n+/g, ' | '))
await agent.context().close()

// ---- Stored standalone Agent run opened from the tree, and switching between runs ----
const stored = await openPage()
await stored.getByText('prototype-workspace', { exact: true }).first().click(); await stored.waitForTimeout(800)
check('V-45', 'A stored standalone Agent run is listed in the Workspaces tree', await stored.locator('[data-test="workspace-agent-row"]').filter({ hasText: 'Research Assistant' }).count() === 1)
await stored.locator('[data-test="workspace-agent-row"]').first().click(); await stored.waitForTimeout(700)
await stored.locator('[data-test="workspace-agent-run-row"]').first().click(); await stored.waitForTimeout(2500)
const storedBox = () => stored.getByPlaceholder(/Reply|Message |Type a message/).first()
const storedMonitor = () => stored.locator('[data-testid="agent-event-monitor"]').innerText()
await storedBox().click(); await stored.keyboard.type('please ask @comp', { delay: 4 }); await stored.waitForTimeout(350)
await stored.locator('[data-test="run-mention-option-fixture-computer-use-agent"]').click(); await stored.keyboard.type('to publish the release note', { delay: 4 })
await stored.keyboard.press('Enter'); await stored.waitForTimeout(8000)
check('V-46', 'Stored Agent run: the task Agent appears under the run and the run settles at Idle', /computer use agent/.test(await stored.locator('[data-test="workspace-agent-run-task-tree"]').innerText())
  && /Idle/.test(await stored.locator('[data-testid="agent-workspace-surface"]').innerText()))
await stored.getByText('Product Review Team', { exact: true }).first().click(); await stored.waitForTimeout(800)
await stored.getByText('Review the current prototype baseline', { exact: false }).first().click(); await stored.waitForTimeout(2200)
check('V-47', 'Opening a Team run after a standalone Agent run works', await stored.locator('[data-testid="team-workspace-surface"]').count() === 1)
await stored.locator('[data-test="workspace-agent-run-row"]').first().click(); await stored.waitForTimeout(2500)
check('V-48', 'Returning to the Agent run keeps its conversation and task row', /I sent Computer Use Agent the brief/.test(await storedMonitor())
  && await stored.locator('[data-test="workspace-agent-run-task-tree"]').count() === 1)
await stored.context().close()

check('V-29', 'No page errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '))
check('V-30', 'No external requests', externalRequests.length === 0, externalRequests.slice(0, 3).join(' | '))
await browser.close()
const failed = results.filter((entry) => !entry.pass)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
if (resultsPath) { await mkdir(dirname(resultsPath), { recursive: true }); await writeFile(resultsPath, JSON.stringify({ base, checkedAt: new Date().toISOString(), passed: results.length - failed.length, total: results.length, results }, null, 2)) }
process.exit(failed.length ? 1 : 0)
