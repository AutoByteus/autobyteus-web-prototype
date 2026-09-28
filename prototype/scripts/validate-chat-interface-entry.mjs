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
const errors = []
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
  page.on('pageerror', (error) => errors.push({ path, text: error.message }))
  page.on('console', (message) => { if (message.type() === 'error') errors.push({ path, text: message.text() }) })
  await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' }).catch(() => {})
  await page.waitForTimeout(900)
  return { context, page }
}

async function check(id, description, fn) {
  try {
    await fn()
    results.push({ id, description, pass: true })
  } catch (error) {
    results.push({ id, description, pass: false, error: String(error?.message || error).split('\n')[0] })
  }
}
const expect = (condition, message) => { if (!condition) throw new Error(message) }
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
  await check('CHK-003', 'New chat defaults: last agent, remembered model, temp workspace', async () => {
    expect((await $(page, 'chat-agent-trigger').innerText()).includes('Daily Assistant'), 'agent')
    expect((await $(page, 'chat-workspace-trigger').innerText()).includes('Temp workspace'), 'workspace')
    const model = await $(page, 'chat-model-trigger').innerText()
    expect(model.includes('Codex') && model.includes('gpt-5.5-codex'), `model ${model}`)
    expect((await $(page, 'chat-effort-trigger').innerText()).includes('High'), 'effort High')
    expect(await $(page, 'chat-send').isDisabled(), 'send should be disabled when empty')
  })
  await check('CHK-004', 'Model menu: search, Recent pairs, runtime rows; runtime opens its models to the side', async () => {
    await $(page, 'chat-model-trigger').click()
    await $(page, 'chat-model-picker').waitFor()
    expect(await page.locator('[data-test^="chat-quick-pick-"]').count() === 3, 'three recent pairs')
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
  await check('CHK-010', 'Agent picker lists agents; agent default model is applied', async () => {
    await $(page, 'chat-agent-trigger').click()
    await $(page, 'chat-agent-picker').waitFor()
    await shot(page, '06-agent-picker')
    await $(page, 'chat-agent-option-agent-researcher').click()
    const model = await $(page, 'chat-model-trigger').innerText()
    expect(model.includes('claude-sonnet-5'), `agent default ${model}`)
    expect((await $(page, 'chat-new-hint').innerText()).includes('default model'), 'hint')
    await $(page, 'chat-agent-trigger').click()
    await $(page, 'chat-agent-option-daily-assistant').click()
  })
  await check('CHK-011', 'Workspace picker: temp default, existing folders, open another folder', async () => {
    await $(page, 'chat-workspace-trigger').click()
    await $(page, 'chat-workspace-picker').waitFor()
    await shot(page, '07-workspace-picker')
    await $(page, 'chat-workspace-option-ws-agents').click()
    expect((await $(page, 'chat-workspace-trigger').innerText()).includes('autobyteus-agents'), 'workspace changed')
    expect((await $(page, 'chat-new-hint').innerText()).includes('autobyteus-agents'), 'hint path')
  })
  await check('CHK-012', 'Quick pick restores a recent runtime+model in one click', async () => {
    await $(page, 'chat-model-trigger').click()
    await $(page, 'chat-quick-pick-codex_app_server|gpt-5.5-codex').click()
    expect((await $(page, 'chat-model-trigger').innerText()).includes('gpt-5.5-codex'), 'quick pick')
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
    const reply = await page.locator('[data-test="chat-messages"]').innerText()
    expect(reply.includes('Synthetic reply') || reply.includes('SKILL.md'), 'assistant reply streamed')
    expect(!(await page.locator('[data-test="chat-active"] header').innerText()).includes('Running'), 'run returned to idle')
  })
  await shot(page, '09-active-chat')
  await check('CHK-014', 'Mid-chat picker keeps the runtime and switches the model', async () => {
    await $(page, 'chat-model-trigger').click()
    await $(page, 'chat-runtime-locked-note').waitFor()
    expect(!(await page.locator('[data-test^="chat-runtime-"][data-runtime]').count()), 'no runtime rows mid-chat')
    await shot(page, '10-active-model-menu-locked')
    await $(page, 'chat-model-option-codex:gpt-5.5').click()
    await $(page, 'chat-event').last().waitFor()
    expect((await $(page, 'chat-event').last().innerText()).includes('Model switched to gpt-5.5'), 'event row')
  })
  await check('CHK-015', 'Workspace panel is hidden by default and opens on demand', async () => {
    expect(!(await $(page, 'chat-workspace-panel').count()), 'hidden by default')
    await $(page, 'chat-toggle-workspace-panel').click()
    await $(page, 'chat-workspace-panel').waitFor()
  })
  await shot(page, '11-active-workspace-panel')
  await check('CHK-016', 'No chat ⋯ menu; archive/delete stay on the tree row (with confirmation)', async () => {
    expect(!(await $(page, 'chat-more').count()), 'no ⋯ menu')
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
  await check('CHK-022', '+ on an agent in a workspace starts a new chat with that agent and workspace', async () => {
    const agentRow = page.locator('button[aria-expanded]', { hasText: 'Daily Assistant' }).filter({ has: page.locator('span') }).first()
    await agentRow.locator('xpath=..').locator('button').last().click()
    await page.waitForURL('**/chat')
    await $(page, 'chat-new').waitFor()
    expect((await $(page, 'chat-agent-trigger').innerText()).includes('Daily Assistant'), 'agent preset')
  })
  await check('CHK-023', 'The pencil on the Chat menu item opens a fresh New chat; no separate New chat row', async () => {
    const pencil = page.locator('[data-test="app-left-panel-primary-nav"] [data-test="chat-new-chat"]')
    expect(await pencil.count() === 1, 'pencil on Chat item')
    expect(!(await page.locator('[data-test="app-left-panel-run-history"] [data-test="chat-new-chat"]').count()), 'no New chat row in Workspaces area')
    await pencil.click()
    await page.waitForURL(/\/chat$/)
    await $(page, 'chat-new').waitFor()
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
const summary = { generatedAt: new Date().toISOString(), baseUrl, total: results.length, passed: results.filter((r) => r.pass).length, results, browserErrors: errors }
await writeFile(resolve(outDir, 'results.json'), JSON.stringify(summary, null, 2))
for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'} ${r.id} ${r.description}${r.error ? ` — ${r.error}` : ''}`)
console.log(`${summary.passed}/${summary.total} passed; browser errors: ${errors.length}`)
for (const e of errors.slice(0, 8)) console.log('  ERR', e.path, e.text.slice(0, 200))
process.exit(summary.passed === summary.total ? 0 : 1)
