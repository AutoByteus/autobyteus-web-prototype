#!/usr/bin/env node
// Browser validation + review captures for Product ticket chat-interface-entry.
// Usage: PROTOTYPE_BASE_URL=http://127.0.0.1:3271 OUT_DIR=/tmp/cie/journey node prototype/scripts/validate-chat-interface-entry.mjs
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright-core'

const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:3271'
const outDir = resolve(process.env.OUT_DIR || '/tmp/cie/journey')
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const results = []
let currentPage = null
const errors = []
const knownBaselineErrors = []
const $ = (page, id) => page.locator(`[data-test="${id}"]`)

async function open(path, { scenario = '', width = 1440, height = 900 } = {}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'UTC', colorScheme: 'light' })
  await context.addInitScript((selected) => {
    if (sessionStorage.getItem('__cie_init')) return
    sessionStorage.setItem('__cie_init', '1')
    localStorage.clear()
    if (selected) localStorage.setItem('autobyteus.prototype.scenario', selected)
    localStorage.setItem('autobyteus.localization.preference-mode', 'en')
  }, scenario)
  const page = await context.newPage()
  page.on('pageerror', (error) => {
    const text = `${error.message} @ ${(error.stack || '').split('\n').slice(1, 3).join(' | ')}`
    // Same pre-existing baseline upload gap, surfacing from the product's attachment presentation.
    if (/contextAttachmentPresentation|useContextAttachmentComposer/.test(text)) { knownBaselineErrors.push({ path, text }); return }
    errors.push({ path, text })
  })
  currentPage = page
  page.on('console', (message) => {
    if (message.type() !== 'error') return
    // Pre-existing baseline gap: the prototype's synthetic server does not simulate binary context-file uploads.
    if (/Error uploading context file/.test(message.text())) { knownBaselineErrors.push({ path, text: message.text() }); return }
    errors.push({ path, text: message.text() })
  })
  await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' }).catch(() => {})
  await page.waitForTimeout(900)
  return { context, page }
}

async function check(id, description, fn) {
  const errorsBefore = errors.length
  try {
    await fn()
    results.push({ id, description, pass: true, browserErrors: errors.slice(errorsBefore).map((e) => e.text) })
  } catch (error) {
    results.push({ id, description, pass: false, error: String(error?.message || error).split('\n').slice(0, 6).join(' | '), browserErrors: errors.slice(errorsBefore).map((e) => e.text) })
    await currentPage?.screenshot({ path: resolve(outDir, `FAIL-${id}.png`) }).catch(() => {})
  }
}
const expect = (condition, message) => { if (!condition) throw new Error(message) }
const FIXTURE_TEXT = resolve(outDir, 'notes.md')
const FIXTURE_IMAGE = resolve(outDir, 'screenshot.png')
await writeFile(FIXTURE_TEXT, '# Notes\n')
// 1x1 PNG
await writeFile(FIXTURE_IMAGE, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'))
const shot = (page, name) => page.screenshot({ path: resolve(outDir, `${name}.png`) })

// ---- Default scenario: desktop journey ----
{
  const { context, page } = await open('/agents?view=list')
  await check('CHK-001', 'Chat is the first primary navigation entry above Agents', async () => {
    const labels = await page.locator('[data-test="app-left-panel-primary-nav"] li button:first-child span').allInnerTexts()
    expect(labels[0] === 'Chat' && labels[1] === 'Agents', `nav order ${labels.join(',')}`)
  })
  await check('CHK-002', 'Clicking Chat opens the New chat composer', async () => {
    await page.locator('[data-test="app-left-panel-primary-nav"] li').first().locator('button').first().click()
    await page.waitForURL('**/chat')
    await $(page, 'chat-new').waitFor()
    expect(await $(page, 'chat-composer-input').evaluate((el) => el === document.activeElement), 'composer not focused')
  })
  await shot(page, '01-new-chat')
  await check('CHK-003', 'New chat defaults: built-in assistant (no agent picker), remembered model, temp workspace', async () => {
    expect(!(await $(page, 'chat-agent-trigger').count()) && !(await $(page, 'chat-agent-chip').count()), 'no agent picker or chip')
    expect(!(await $(page, 'chat-skills-trigger').count()), 'no Skills button; / and @ are typed')
    expect((await $(page, 'chat-context-files').innerText()).includes('Context Files (0)'), 'existing Context Files area (DEC-014)')
    expect(!(await $(page, 'composer-drop-overlay').count()), 'no custom drop overlay')
    expect((await $(page, 'chat-workspace-trigger').innerText()).includes('Temp workspace'), 'workspace')
    const model = await $(page, 'chat-model-trigger').innerText()
    expect(model.includes('Codex') && model.includes('gpt-5.5-codex'), `model ${model}`)
    expect((await $(page, 'chat-effort-trigger').innerText()).includes('High'), 'effort High')
    expect(await $(page, 'chat-send').isDisabled(), 'send should be disabled when empty')
  })
  await check('CHK-004', 'Model menu: search and runtime rows (no Recent list, DEC-011); runtime opens its models to the side', async () => {
    await $(page, 'chat-model-trigger').click()
    await $(page, 'chat-model-picker').waitFor()
    expect(!(await page.locator('[data-test^="chat-quick-pick-"]').count()) && !(await $(page, 'chat-model-picker').innerText()).includes('Recent'), 'no Recent section')
    for (const id of ['autobyteus', 'codex_app_server', 'claude_agent_sdk', 'antigravity_cli', 'grok_build']) {
      expect(await $(page, `chat-runtime-${id}`).isVisible(), `runtime ${id}`)
    }
    const box = await $(page, 'chat-model-picker').boundingBox()
    expect(box && box.width <= 320, `compact width ${box?.width}`)
    await $(page, 'chat-runtime-autobyteus').hover()
    await $(page, 'chat-model-submenu').waitFor()
    expect(await $(page, 'chat-model-option-qwen3-coder-30b').isVisible(), 'autobyteus models in submenu')
  })
  await shot(page, '02-model-menu-submenu')
  await check('CHK-005', 'A not-yet-loaded runtime shows loading, then its models', async () => {
    await $(page, 'chat-runtime-antigravity_cli').click()
    await $(page, 'chat-model-loading').waitFor({ timeout: 2000 })
    await shot(page, '03-model-menu-loading')
    await $(page, 'chat-model-option-ag:gemini-3-pro').waitFor({ timeout: 4000 })
  })
  await check('CHK-006', 'Grok Build is an available runtime with its own models by default', async () => {
    const row = $(page, 'chat-runtime-grok_build')
    expect(!(await row.getAttribute('aria-disabled')), 'enabled')
    await row.click()
    await $(page, 'chat-model-option-grok:grok-4.2').waitFor({ timeout: 4000 })
  })
  await check('CHK-007', 'Search is cross-runtime and labels each result with its runtime', async () => {
    await $(page, 'chat-model-search').fill('opus')
    await page.waitForTimeout(700)
    await shot(page, '04-model-menu-search')
    const sdk = await $(page, 'chat-model-option-sdk:claude-opus-5-5').innerText()
    const ab = await $(page, 'chat-model-option-claude-opus-5-5').innerText()
    expect(sdk.includes('Claude SDK') && ab.includes('AutoByteus'), `${sdk} / ${ab}`)
  })
  await check('CHK-008', 'Choosing a result updates the button and closes the menu', async () => {
    await $(page, 'chat-model-option-sdk:claude-opus-5-5').click()
    await page.waitForTimeout(200)
    expect(!(await $(page, 'chat-model-picker').count()), 'menu closed')
    const model = await $(page, 'chat-model-trigger').innerText()
    expect(model.includes('claude-opus-5-5') && model.includes('Claude SDK'), `button ${model}`)
    expect((await $(page, 'chat-effort-trigger').innerText()).includes('High'), 'default effort')
  })
  await check('CHK-009', 'Reasoning effort is a separate control', async () => {
    await $(page, 'chat-effort-trigger').click()
    await $(page, 'chat-effort-menu').waitFor()
    await shot(page, '05-effort-menu')
    await $(page, 'chat-effort-Low').click()
    expect((await $(page, 'chat-effort-trigger').innerText()).includes('Low'), 'effort Low')
  })
  await check('CHK-010', 'Skills: "/" opens a ranked skill menu (bare "/" lists all), Enter or click tags it; chips removable', async () => {
    const input = $(page, 'chat-composer-input')
    await input.click()
    await input.pressSequentially('/sk', { delay: 30 })
    await $(page, 'chat-skill-menu').waitFor()
    const first = await page.locator('[data-test="chat-skill-menu"] [role="option"]').first().innerText()
    expect(first.startsWith('skill-optimizer'), `prefix match ranked first: ${first}`)
    await shot(page, '06-skill-slash-menu')
    await page.keyboard.press('Enter')
    await $(page, 'chat-skill-chip-skill-optimizer').waitFor()
    expect((await input.inputValue()) === '', 'slash text removed')
    await input.pressSequentially('/', { delay: 30 })
    await $(page, 'chat-skill-menu').waitFor()
    expect((await page.locator('[data-test="chat-skill-menu"] [role="option"]').count()) >= 10, 'bare / lists all skills for browsing')
    await input.pressSequentially('shell', { delay: 20 })
    await $(page, 'chat-skill-option-shell-first-operating-practice').click()
    await $(page, 'chat-skill-chip-shell-first-operating-practice').waitFor()
    await input.pressSequentially('/research', { delay: 20 })
    await $(page, 'chat-skill-option-deep-research-article').click()
    await page.locator('[data-test="chat-skill-chip-deep-research-article"] button').click()
    expect(!(await $(page, 'chat-skill-chip-deep-research-article').count()), 'chip removed')
  })
  await check('CHK-011', 'Workspace picker: temp default, existing folders, open another folder', async () => {
    await $(page, 'chat-workspace-trigger').click()
    await $(page, 'chat-workspace-picker').waitFor()
    await shot(page, '07-workspace-picker')
    await $(page, 'chat-workspace-option-ws-agents').click()
    expect((await $(page, 'chat-workspace-trigger').innerText()).includes('autobyteus-agents'), 'workspace changed')
    expect((await $(page, 'chat-new-hint').innerText()).includes('autobyteus-agents'), 'hint path')
  })
  await check('CHK-012', 'A runtime row opens its models; choosing one sets the model (Codex App Server → gpt-5.5-codex)', async () => {
    await $(page, 'chat-model-trigger').click()
    await $(page, 'chat-runtime-codex_app_server').click()
    await $(page, 'chat-model-option-gpt-5.5-codex').click()
    expect((await $(page, 'chat-model-trigger').innerText()).includes('gpt-5.5-codex'), 'model set')
  })
  await check('CHK-013', 'Sending the first message starts a chat run and opens it', async () => {
    await $(page, 'chat-composer-input').fill('Help me write a skill for weekly planning')
    await $(page, 'chat-send').click()
    await page.waitForURL('**/chat?id=*', { timeout: 5000 })
    await $(page, 'chat-active').waitFor()
    expect((await $(page, 'chat-title').innerText()).includes('Help me write a skill'), 'title')
    await page.waitForTimeout(250)
    await shot(page, '08-active-streaming')
    await page.waitForTimeout(3000)
    const row = page.locator('[data-test="workspace-agent-run-row"]', { hasText: 'Help me write a skill' })
    expect(await row.count() === 1, 'new chat is a run in the Workspaces tree')
    expect((await row.getAttribute('class') || '').includes('bg-indigo-50'), 'row selected')
    expect((await $(page, 'chat-message-skills').first().innerText()).includes('/skill-optimizer'), 'sent message keeps skill chips')
    const reply = await page.locator('[data-test="chat-messages"]').innerText()
    expect(reply.includes('Loaded /skill-optimizer'), 'assistant uses tagged skill')
    await $(page, 'chat-message-skills').first().hover()
    await page.waitForTimeout(200)
    await shot(page, '09b-sent-as-tooltip')
    const sent = await $(page, 'chat-sent-as').first().innerText()
    expect(sent.toLowerCase().includes('sent to the agent as') && sent.includes('Use these skills for this request: skill-optimizer, shell-first-operating-practice.') && sent.includes('Help me write a skill'), `sent text ${sent}`)
    expect(reply.includes('Synthetic reply') || reply.includes('SKILL.md'), 'assistant reply streamed')
    expect(!(await $(page, 'chat-run-header').innerText()).includes('Running'), 'run returned to idle')
  })
  await shot(page, '09-active-chat')
  await check('CHK-014', 'Run view box is the product box (no model/thinking); ⚙ settings lock model/thinking while live; terminating in the tree unlocks them (R3)', async () => {
    expect((await $(page, 'chat-run-status').innerText()).includes('Idle'), 'live run shows Idle after the reply')
    expect(!(await $(page, 'chat-model-trigger').count()) && !(await $(page, 'chat-effort-trigger').count()) && !(await $(page, 'chat-composer-footer').count()), 'no model/thinking/footer in the run view box')
    await $(page, 'workspace-header-edit-config').click()
    await $(page, 'chat-run-settings').waitFor()
    expect((await $(page, 'chat-run-settings').innerText()).includes('Stop this run before changing model settings.'), 'live: product lock message')
    await shot(page, '10-active-model-locked')
    const runId = new URL(page.url()).searchParams.get('id')
    await page.locator(`[data-test="terminate-agent-run"][data-run-id="${runId}"]`).click()
    await page.waitForTimeout(400)
    expect((await $(page, 'chat-run-settings').innerText()).includes('This run is stopped.'), 'stopped: editable')
    await shot(page, '10c-stopped-model-menu')
    await $(page, 'run-config-back-to-events').click()
    await $(page, 'chat-active').waitFor()
    expect((await $(page, 'chat-run-status').innerText()).includes('Offline'), 'terminated from the tree: product status Offline')
    expect(!(await page.locator('[data-test="chat-event"]').count()), 'no divider notes in the conversation')
  })
  await check('CHK-015', 'Right side is the workspace frame (R3): full-height right tabs column, header over the middle column only, same bar height; collapse to the strip; a strip icon opens that tab', async () => {
    const panel = page.locator('[data-test="chat-run-frame"] [data-test="workspace-right-panel"]')
    const strip = page.locator('[data-test="chat-run-frame"] [data-test="workspace-right-tool-strip"]')
    if (!(await panel.count())) {
      await strip.locator('button[data-tab-name="progress"]').click()
      await panel.waitFor()
    }
    const tabs = (await panel.locator('[data-test="right-side-tab-list"] [role="tab"]').allInnerTexts()).map((t) => t.trim())
    expect(['Files', 'Terminal', 'Activity', 'Token', 'Artifacts', 'VNC Viewer'].every((name) => tabs.includes(name)), `tabs ${tabs.join(',')}`)
    expect(await page.locator('[data-test="chat-run-frame"] [data-test="workspace-right-resize-handle"]').count() === 1, 'same resize handle as the workspace views')
    const geo = await page.evaluate(() => {
      const r = (sel) => document.querySelector(sel)?.getBoundingClientRect()
      const header = r('[data-test="chat-run-header"]')
      const panel = r('[data-test="chat-run-frame"] [data-test="workspace-right-panel"]')
      const bar = document.querySelector('[data-test="chat-run-frame"] [data-test="workspace-right-panel"] [data-test="right-side-tab-list"]')?.parentElement?.getBoundingClientRect()
      return { headerRight: header.right, headerBottom: header.bottom, panelLeft: panel.left, panelTop: panel.top, barBottom: bar.bottom }
    })
    expect(geo.panelTop <= 1, `right column starts at the top of the window (${geo.panelTop})`)
    expect(geo.headerRight <= geo.panelLeft + 1, `header spans only the middle column (${geo.headerRight} vs ${geo.panelLeft})`)
    expect(Math.abs(geo.headerBottom - geo.barBottom) <= 1, `header and tab bar bottoms align (${geo.headerBottom} vs ${geo.barBottom})`)
    await shot(page, '11-active-workspace-panel')
    await panel.locator('[data-test="right-side-panel-toggle"]').click()
    await strip.waitFor()
    expect(!(await panel.count()), 'collapse control collapses to the strip')
    const icons = await strip.locator('button[data-tab-name]').evaluateAll((els) => els.map((el) => el.getAttribute('data-tab-name')))
    expect(['files', 'terminal', 'progress', 'usage', 'artifacts', 'vnc'].every((name) => icons.includes(name)), `strip icons ${icons.join(',')}`)
    await shot(page, '10b-right-tool-strip')
    for (const [name, label] of [['files', 'Files'], ['terminal', 'Terminal'], ['artifacts', 'Artifacts']]) {
      await strip.locator(`button[data-tab-name="${name}"]`).click()
      await panel.waitFor()
      const selected = (await panel.locator('[data-test="right-side-tab-list"] [role="tab"][aria-selected="true"]').innerText()).trim()
      expect(selected === label, `strip ${name} opened ${selected}`)
      await panel.locator('[data-test="right-side-panel-toggle"]').click()
      await strip.waitFor()
    }
  })
  await check('CHK-016', 'No chat ⋯ menu; archive/delete stay on the tree row (with confirmation)', async () => {
    expect(!(await $(page, 'chat-more').count()), 'no ⋯ menu')
    // Workspaces are collapsed by default (product behavior); open Temp workspace like a user would.
    const tempSection = page.locator('[data-test="app-left-panel-run-history"] section', { hasText: 'Temp workspace' }).first()
    await tempSection.locator('button', { hasText: 'Temp workspace' }).first().click()
    await tempSection.locator('button[aria-expanded]', { hasText: 'Daily Assistant' }).first().click()
    const row = page.locator('[data-test="workspace-agent-run-row"]', { hasText: 'Plan a weekend in Munich' })
    await row.hover()
    await row.locator('button[title]').last().click()
    await page.getByRole('button', { name: /delete/i }).last().click()
    await page.waitForTimeout(300)
    expect(!(await page.locator('[data-test="workspace-agent-run-row"]', { hasText: 'Plan a weekend in Munich' }).count()), 'deleted from tree')
  })
  await check('CHK-017', 'Clicking a single-agent run in the tree opens it in the chat view (Option B)', async () => {
    await page.locator('[data-test="workspace-agent-run-row"][data-run-id="chat-skill-review"]').click()
    await page.waitForURL('**/chat?id=chat-skill-review')
    expect((await $(page, 'chat-title').innerText()).includes('Improve the shell-first skill'), 'reopened in chat view')
    await shot(page, '12-tree-chat-selected')
  })
  await check('CHK-022', '+ on an agent in the tree starts a new chat: assistant by default, or that agent shown as a removable chip', async () => {
    const agentGroup = (name) => page.locator('button', { hasText: name }).filter({ has: page.locator('span') })
    await agentGroup('Daily Assistant').first().locator('xpath=..').locator('button').last().click()
    await page.waitForURL(/\/chat$/)
    expect(!(await $(page, 'chat-agent-chip').count()), 'assistant needs no chip')
    await page.locator('button', { hasText: 'autobyteus-workspace-superrepo' }).first().click()
    await agentGroup('Codex').first().waitFor()
    await agentGroup('Codex').first().locator('xpath=..').locator('button').last().click()
    await $(page, 'chat-agent-chip').waitFor()
    expect((await $(page, 'chat-agent-chip').innerText()).includes('Codex'), 'agent chip')
    await $(page, 'chat-composer-input').click()
    await $(page, 'chat-composer-input').pressSequentially('/', { delay: 30 })
    const codexSkills = (await page.locator('[data-test="chat-skill-menu"] [role="option"]').allInnerTexts()).map((t) => t.split('\n')[0].trim())
    expect(codexSkills.length === 1 && codexSkills[0] === 'software-engineering-workflow-skill', `/ lists only Codex's skills: ${codexSkills.join(',')}`)
    await page.keyboard.press('Escape')
    await $(page, 'chat-composer-input').fill('')
    expect((await $(page, 'chat-workspace-trigger').innerText()).includes('autobyteus-workspace-superrepo'), 'workspace preset')
    await shot(page, '19-new-chat-from-agent')
    await page.locator('[data-test="chat-agent-chip"] button').click()
    expect(!(await $(page, 'chat-agent-chip').count()), 'back to assistant')
  })
  await check('CHK-025', 'A skill tag alone can be sent; it is sent as the instruction only', async () => {
    await page.locator('[data-test="app-left-panel-primary-nav"] [data-test="chat-new-chat"]').click()
    await $(page, 'chat-new').waitFor()
    const input = $(page, 'chat-composer-input')
    await input.click()
    await input.pressSequentially('/deep', { delay: 30 })
    await page.keyboard.press('Enter')
    expect(!(await $(page, 'chat-send').isDisabled()), 'send enabled with only a tag')
    await $(page, 'chat-send').click()
    await page.waitForURL('**/chat?id=*')
    const sent = await $(page, 'chat-sent-as').first().innerText()
    expect(sent.trim().endsWith('Use the deep-research-article skill for this request.'), `sent ${sent}`)
    expect((await $(page, 'chat-title').innerText()).includes('/deep-research-article'), 'title from tag')
  })
  await check('CHK-026', '"@" addresses an agent or team; a team chat uses one shared model/workspace and opens in the real Team view', async () => {
    await page.locator('[data-test="app-left-panel-primary-nav"] [data-test="chat-new-chat"]').click()
    await $(page, 'chat-new').waitFor()
    const input = $(page, 'chat-composer-input')
    await input.click()
    await input.pressSequentially('@', { delay: 30 })
    await $(page, 'chat-target-menu').waitFor()
    const menu = await $(page, 'chat-target-menu').innerText()
    expect(menu.includes('Agents') && menu.includes('Agent teams') && menu.includes('Codex') && menu.includes('Product Review Team'), 'agents and teams listed')
    expect(!menu.includes('Daily Assistant'), 'Daily Assistant is the default, not listed')
    await input.pressSequentially('prod', { delay: 30 })
    await page.keyboard.press('Enter')
    await $(page, 'chat-team-chip').waitFor()
    expect((await input.inputValue()) === '', 'mention text removed')
    expect((await $(page, 'chat-team-note').innerText()).includes('All members use this model'), 'quick-path note')
    await shot(page, '20-team-chat-draft')
    await input.fill('Review the new chat design and list risks')
    await $(page, 'chat-send').click()
    await page.waitForURL('**/workspace', { timeout: 8000 })
    await page.locator('[data-test="app-left-panel-run-history"]', { hasText: 'Product Review Team' }).waitFor()
    await page.waitForTimeout(1200)
    await shot(page, '21-team-view-after-send')
  })
  await check('CHK-027', 'Chats follow the normal Workspaces tree rules: workspaces by name, collapsed unless holding the open chat, agents under each workspace', async () => {
    await page.goto(`${baseUrl}/chat`)
    await page.waitForTimeout(1200)
    const names = (await page.locator('[data-test="app-left-panel-run-history"] section > div button:first-child span.truncate').allInnerTexts()).map((t) => t.trim()).filter(Boolean)
    const sorted = [...names].sort((a, b) => a.localeCompare(b))
    expect(JSON.stringify(names) === JSON.stringify(sorted), `workspace order ${names.join(' | ')}`)
    expect(!(await page.locator('[data-test="workspace-agent-run-row"]').count()), 'all collapsed on a fresh New chat')
    await shot(page, '22-tree-normal-order')
  })
  await check('CHK-028', 'Auto-approve is on by default in every workspace, can be turned off; the run view header stays the product header (avatar, title, status only; R3)', async () => {
    await page.locator('[data-test="app-left-panel-primary-nav"] [data-test="chat-new-chat"]').click()
    await $(page, 'chat-new').waitFor()
    const toggle = $(page, 'chat-auto-approve')
    expect((await toggle.getAttribute('aria-pressed')) === 'true' && (await toggle.innerText()).includes('Auto-approve'), 'default on (temp)')
    await $(page, 'chat-workspace-trigger').click()
    await $(page, 'chat-workspace-option-ws-agents').click()
    expect((await toggle.getAttribute('aria-pressed')) === 'true', 'still on in a real folder (same behavior everywhere)')
    await toggle.click()
    expect((await toggle.innerText()).includes('Ask first'), 'turned off')
    await $(page, 'chat-composer-input').fill('Clean up old logs')
    await $(page, 'chat-send').click()
    await page.waitForURL('**/chat?id=*')
    const header = await $(page, 'chat-run-header').innerText()
    expect(!/Auto-approve|Ask first|Daily Assistant|autobyteus-agents/.test(header), `header has no agent/workspace/approval details: ${header}`)
    await page.locator('[data-test="app-left-panel-primary-nav"] [data-test="chat-new-chat"]').click()
    await $(page, 'chat-new').waitFor()
    expect((await $(page, 'chat-auto-approve').getAttribute('aria-pressed')) === 'true', 'next new chat is on again')
  })
  await check('CHK-029', 'Chat box attachments use the existing Context Files area (upload, list, thumbnails, Clear All); the sent message lists Context files', async () => {
    await page.locator('[data-test="app-left-panel-primary-nav"] [data-test="chat-new-chat"]').click()
    await $(page, 'chat-new').waitFor()
    await $(page, 'chat-file-input').setInputFiles([FIXTURE_TEXT, FIXTURE_IMAGE])
    await $(page, 'chat-context-file-notes.md').waitFor()
    await $(page, 'chat-context-image-screenshot.png').waitFor()
    expect((await $(page, 'chat-context-files-count').innerText()).includes('Context Files (2)'), 'count updates')
    expect(await $(page, 'chat-context-files-clear').isVisible(), 'Clear All shown')
    await $(page, 'chat-composer-input').fill('Use these files')
    await shot(page, '23-chat-attachments')
    await $(page, 'chat-send').click()
    await page.waitForURL('**/chat?id=*')
    expect((await $(page, 'chat-message-attachments').innerText()).includes('notes.md'), 'message lists context files')
  })
  await check('CHK-030', 'Team/org member views are unchanged (DEC-013): product box with Context Files row, no Chat footer or model controls', async () => {
    await page.goto(`${baseUrl}/workspace`)
    await page.waitForTimeout(1500)
    const section = page.locator('[data-test="app-left-panel-run-history"] section', { hasText: 'prototype-workspace' }).first()
    await section.locator('button', { hasText: 'prototype-workspace' }).first().click()
    await page.locator('button', { hasText: 'Product Review Team' }).first().click()
    await page.locator('[data-test="app-left-panel-run-history"]').getByText('Review the current prot', { exact: false }).first().click()
    await page.getByText('Context Files (0)').first().waitFor()
    expect(!(await $(page, 'chat-model-trigger').count()) && !(await $(page, 'chat-composer-footer').count()), 'no Chat controls in the team view')
    expect(!(await $(page, 'run-composer').count()), 'no unified-box changes in run views')
    await shot(page, '24-team-member-view-unchanged')
  })
  await check('CHK-023', 'The pencil on the Chat menu item opens a fresh New chat; no separate New chat row', async () => {
    const pencil = page.locator('[data-test="app-left-panel-primary-nav"] [data-test="chat-new-chat"]')
    expect(await pencil.count() === 1, 'pencil on Chat item')
    expect(!(await page.locator('[data-test="app-left-panel-run-history"] [data-test="chat-new-chat"]').count()), 'no New chat row in Workspaces area')
    await pencil.click()
    await page.waitForURL(/\/chat$/)
    await $(page, 'chat-new').waitFor()
    const model = await $(page, 'chat-model-trigger').innerText()
    expect(model.includes('gpt-5.5') && model.includes('Codex'), `new chat preselects the last-used runtime + model (DEC-011): ${model}`)
  })
  await check('CHK-018', 'Agents catalog is unchanged and still reachable', async () => {
    await page.locator('[data-test="app-left-panel-primary-nav"] li').nth(1).locator('button').first().click()
    await page.waitForURL('**/agents**')
    await page.getByRole('button', { name: 'Run', exact: true }).first().waitFor()
  })
  await context.close()
}

// ---- Catalog error scenario ----
{
  const { context, page } = await open('/chat', { scenario: 'chat_catalog_error' })
  await check('CHK-019', 'Catalog error shows retry and recovers', async () => {
    await $(page, 'chat-model-trigger').click()
    await $(page, 'chat-runtime-antigravity_cli').click()
    await $(page, 'chat-model-error').waitFor({ timeout: 4000 })
    await shot(page, '13-model-picker-error')
    await $(page, 'chat-model-retry').click()
    await $(page, 'chat-model-option-ag:gemini-3-pro').waitFor({ timeout: 4000 })
  })
  await context.close()
}

// ---- Unavailable runtime scenario ----
{
  const { context, page } = await open('/chat', { scenario: 'chat_runtime_unavailable' })
  await check('CHK-024', 'Scenario: a runtime missing on this machine reads Not installed with its reason and cannot open', async () => {
    await $(page, 'chat-model-trigger').click()
    const row = $(page, 'chat-runtime-grok_build')
    expect((await row.innerText()).includes('Not installed'), 'label')
    expect(await row.getAttribute('aria-disabled') === 'true', 'disabled')
    expect((await row.getAttribute('title') || '').includes('not found'), 'reason tooltip')
    await shot(page, '18-runtime-unavailable-scenario')
  })
  await context.close()
}

// ---- Landing (DEC-005) ----
{
  const { context, page } = await open('/chat?id=chat-skill-review')
  await check('CHK-032', 'The chat run header is the product run-view header: ⚙ opens the product run settings (model/thinking saved while Offline; not in the box), ＋ starts a new run of this agent (R3)', async () => {
    await $(page, 'chat-run-header').waitFor()
    const header = await $(page, 'chat-run-header').innerText()
    expect(!/Auto-approve|Ask first|Daily Assistant|autobyteus-agents/.test(header), `no duplicated agent/workspace/approval details: ${header}`)
    await $(page, 'workspace-header-edit-config').click()
    await $(page, 'chat-run-settings').waitFor()
    await page.getByText('Agent Configuration').first().waitFor()
    const settings = await $(page, 'chat-run-settings').innerText()
    expect(settings.includes('Daily Assistant') && settings.includes('Runtime is fixed') && settings.includes('Workspace is fixed') && settings.includes('Auto approve tools'), 'product run settings content')
    expect(!/not available in current capabilities|unavailable in current options/.test(settings), 'no fixture gaps in the settings view')
    expect(await $(page, 'save-existing-model-config').isDisabled(), 'Save disabled until something changes')
    await page.locator('[data-test="chat-run-settings"] select').last().selectOption('low')
    await $(page, 'save-existing-model-config').click()
    expect(await $(page, 'save-existing-model-config').isDisabled(), 'saved (nothing left to save)')
    expect((await page.locator('[data-test="chat-run-settings"] select').last().inputValue()) === 'low', 'saved thinking kept')
    await $(page, 'run-config-back-to-events').click()
    await $(page, 'chat-active').waitFor()
    expect(!(await $(page, 'chat-effort-trigger').count()), 'no thinking control in the run view box')
    await shot(page, '25-chat-run-settings-saved')
    await $(page, 'workspace-header-new-run').click()
    await $(page, 'chat-new').waitFor()
    expect((await $(page, 'chat-new-hint').innerText()).includes('autobyteus-agents'), 'new run keeps this agent and workspace')
  })
  await context.close()
}

{
  const { context, page } = await open('/')
  await check('CHK-031', 'The app lands on Chat (New chat) at startup (DEC-005)', async () => {
    await page.waitForURL(/\/chat$/, { timeout: 10000 })
    await $(page, 'chat-new').waitFor()
  })
  await context.close()
}

// ---- First run scenario ----
{
  const { context, page } = await open('/chat', { scenario: 'chat_first_run' })
  await check('CHK-020', 'First run: no chats, no quick picks, AutoByteus default model', async () => {
    expect(!(await page.locator('[data-test="workspace-agent-run-row"]').count()), 'no chat runs in the tree')
    const model = await $(page, 'chat-model-trigger').innerText()
    expect(model.includes('AutoByteus') && model.includes('gpt-5.5'), `default ${model}`)
    await $(page, 'chat-model-trigger').click()
    expect(!(await page.locator('[data-test^="chat-quick-pick-"]').count()), 'no recent pairs')
  })
  await shot(page, '14-first-run-picker')
  await context.close()
}

// ---- Narrow viewport ----
{
  const { context, page } = await open('/chat', { width: 390, height: 844 })
  await check('CHK-021', 'Narrow: composer controls wrap without overflow; picker fits the viewport', async () => {
    await shot(page, '15-narrow-new-chat')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
    expect(!overflow, 'horizontal overflow')
    await $(page, 'chat-model-trigger').click()
    const box = await $(page, 'chat-model-picker').boundingBox()
    expect(box && box.x >= 0 && box.x + box.width <= 391, `picker bounds ${JSON.stringify(box)}`)
    await shot(page, '16-narrow-model-menu')
    await $(page, 'chat-runtime-autobyteus').click()
    await $(page, 'chat-model-option-qwen3-coder-30b').waitFor()
    await shot(page, '17-narrow-model-menu-drilled')
  })
  await context.close()
}

await browser.close()
const summary = { generatedAt: new Date().toISOString(), baseUrl, total: results.length, passed: results.filter((r) => r.pass).length, results, browserErrors: errors, knownBaselineErrors }
await writeFile(resolve(outDir, 'results.json'), JSON.stringify(summary, null, 2))
for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'} ${r.id} ${r.description}${r.error ? ` — ${r.error}` : ''}`)
console.log(`${summary.passed}/${summary.total} passed; browser errors: ${errors.length}; known baseline upload errors: ${knownBaselineErrors.length}`)
for (const e of errors.slice(0, 8)) console.log('  ERR', e.path, e.text.slice(0, 200))
process.exit(summary.passed === summary.total ? 0 : 1)
