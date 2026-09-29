#!/usr/bin/env node
// Final reference screenshots (VIS-*) for Product ticket chat-interface-entry.
// Captured only after explicit user confirmation. Each state starts from a clean,
// deterministic browser context.
// Usage: PROTOTYPE_BASE_URL=http://127.0.0.1:3271 node prototype/scripts/capture-chat-interface-entry-final.mjs
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { deflateSync } from 'node:zlib'
import { chromium } from 'playwright-core'

// Minimal valid PNG (illustrative screenshot fixture: blue-to-teal gradient).
function makePng(width, height) {
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0 })
  const crc = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 }
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]) }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0
  const rows = []
  for (let y = 0; y < height; y++) { const row = [0]; for (let x = 0; x < width; x++) row.push(40 + Math.round((x / width) * 30), 120 + Math.round((y / height) * 80), 220 - Math.round((x / width) * 60)); rows.push(Buffer.from(row)) }
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(Buffer.concat(rows))), chunk('IEND', Buffer.alloc(0))])
}

const root = resolve(new URL('../..', import.meta.url).pathname)
const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:3271'
const outDir = resolve(root, process.env.VIS_DIR || 'tickets/done/chat-interface-entry/visual-references')
await mkdir(outDir, { recursive: true })
const fixtureDir = resolve(outDir, '.fixtures')
await mkdir(fixtureDir, { recursive: true })
const FIXTURE_TEXT = resolve(fixtureDir, 'notes.md')
const FIXTURE_IMAGE = resolve(fixtureDir, 'screenshot.png')
await writeFile(FIXTURE_TEXT, '# Notes\n')
await writeFile(FIXTURE_IMAGE, makePng(64, 48))

const browser = await chromium.launch({ headless: true })
const references = []
const errors = []
const $ = (page, id) => page.locator(`[data-test="${id}"]`)

async function open(path, { scenario = '', context = '', width = 1440, height = 900 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'UTC', colorScheme: 'light', reducedMotion: 'reduce' })
  await ctx.addInitScript(({ scenario, context }) => {
    if (sessionStorage.getItem('__vis_init')) return
    sessionStorage.setItem('__vis_init', '1')
    localStorage.clear()
    if (scenario) localStorage.setItem('autobyteus.prototype.scenario', scenario)
    if (context) localStorage.setItem('autobyteus.prototype.context', context)
    localStorage.setItem('autobyteus.localization.preference-mode', 'en')
  }, { scenario, context })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => { if (!/contextAttachmentPresentation|useContextAttachmentComposer/.test(e.stack || '')) errors.push(`${path}: ${e.message}`) })
  await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' }).catch(() => {})
  await page.waitForTimeout(1200)
  await page.mouse.move(1430, 890)
  return { ctx, page }
}

async function capture(id, slug, meta, prepare, options = {}) {
  const width = options.width || 1440
  const height = options.height || 900
  const { ctx, page } = await open(options.path || '/chat', { ...options, width, height })
  try {
    await prepare(page)
    await page.waitForTimeout(350)
    const filename = `${id}-${slug}-${width}x${height}.png`
    const path = resolve(outDir, filename)
    await page.screenshot({ path, animations: 'disabled' })
    const bytes = await readFile(path)
    references.push({ id, filename, viewport: `${width}x${height}`, ...meta, sha256: createHash('sha256').update(bytes).digest('hex') })
    console.log('captured', filename)
  } catch (error) {
    console.log('FAILED', id, String(error.message).split('\n')[0])
    errors.push(`${id}: ${String(error.message).split('\n')[0]}`)
  } finally {
    await ctx.close()
  }
}

const sendFirst = async (page, text) => {
  await $(page, 'chat-composer-input').fill(text)
  await $(page, 'chat-send').click()
  await page.waitForURL('**/chat?id=*')
  await page.waitForTimeout(3200)
  await page.mouse.move(1430, 890)
}
const openTeamRun = async (page) => {
  const section = page.locator('[data-test="app-left-panel-run-history"] section', { hasText: 'prototype-workspace' }).first()
  await section.locator('button', { hasText: 'prototype-workspace' }).first().click()
  await page.locator('button', { hasText: 'Product Review Team' }).first().click()
  await page.locator('[data-test="app-left-panel-run-history"]').getByText('Review the current prot', { exact: false }).first().click()
  await $(page, 'run-composer').waitFor()
  await page.waitForTimeout(800)
}

await capture('VIS-001', 'new-chat-default', { surface: 'UIS-001 New chat', state: 'Default: Chat box (Context Files area, textarea, footer with send), Daily Assistant, Temp workspace, Auto-approve, last-used model', journeys: 'UXJ-001' }, async () => {})
await capture('VIS-002', 'model-menu-search-runtimes', { surface: 'UIS-003 Model menu', state: 'Open: search, Runtimes (no Recent)', journeys: 'UXJ-002' }, async (page) => {
  await $(page, 'chat-model-trigger').click()
  await $(page, 'chat-model-picker').waitFor()
})
await capture('VIS-003', 'model-menu-runtime-submenu', { surface: 'UIS-003 Model menu', state: 'Runtime submenu (AutoByteus models by provider)', journeys: 'UXJ-002' }, async (page) => {
  await $(page, 'chat-model-trigger').click()
  await $(page, 'chat-runtime-autobyteus').hover()
  await $(page, 'chat-model-submenu').waitFor()
})
await capture('VIS-004', 'model-menu-search', { surface: 'UIS-003 Model menu', state: 'Cross-runtime search "opus"', journeys: 'UXJ-002' }, async (page) => {
  await $(page, 'chat-model-trigger').click()
  await $(page, 'chat-model-search').fill('opus')
  await page.waitForTimeout(900)
})
await capture('VIS-005', 'model-menu-loading', { surface: 'UIS-003 Model menu', state: 'Runtime catalog loading (Antigravity CLI)', journeys: 'UXJ-002' }, async (page) => {
  await $(page, 'chat-model-trigger').click()
  await $(page, 'chat-runtime-antigravity_cli').click()
  await $(page, 'chat-model-loading').waitFor()
})
await capture('VIS-006', 'model-menu-catalog-error', { surface: 'UIS-003 Model menu', state: 'Catalog error with Retry', journeys: 'UXJ-002' }, async (page) => {
  await $(page, 'chat-model-trigger').click()
  await $(page, 'chat-runtime-antigravity_cli').click()
  await $(page, 'chat-model-error').waitFor({ timeout: 5000 })
}, { scenario: 'chat_catalog_error' })
await capture('VIS-007', 'model-menu-runtime-not-installed', { surface: 'UIS-003 Model menu', state: 'Runtime not installed (Grok Build)', journeys: 'UXJ-002' }, async (page) => {
  await $(page, 'chat-model-trigger').click()
  await $(page, 'chat-model-picker').waitFor()
}, { scenario: 'chat_runtime_unavailable' })
await capture('VIS-008', 'thinking-menu', { surface: 'UIS-004 Thinking control', state: 'Open (illustrative effort levels)', journeys: 'UXJ-002' }, async (page) => {
  await $(page, 'chat-effort-trigger').click()
  await $(page, 'chat-effort-menu').waitFor()
})
await capture('VIS-009', 'workspace-menu', { surface: 'UIS-005 Workspace menu', state: 'Open: Temp workspace default, your workspaces, open another folder', journeys: 'UXJ-003' }, async (page) => {
  await $(page, 'chat-workspace-trigger').click()
  await $(page, 'chat-workspace-picker').waitFor()
})
await capture('VIS-010', 'skill-slash-menu', { surface: 'UIS-006 Skill menu', state: '"/sk" ranked matches', journeys: 'UXJ-004' }, async (page) => {
  await $(page, 'chat-composer-input').click()
  await $(page, 'chat-composer-input').pressSequentially('/sk', { delay: 30 })
  await $(page, 'chat-skill-menu').waitFor()
})
await capture('VIS-011', 'composer-chips-attachments-ask-first', { surface: 'UIS-002 Chat box', state: 'Context Files (2) list with image thumbnail and file row + skill chips + text; Ask first', journeys: 'UXJ-004, UXJ-008' }, async (page) => {
  const input = $(page, 'chat-composer-input')
  await input.click()
  await input.pressSequentially('/skill-opt', { delay: 20 })
  await page.keyboard.press('Enter')
  await input.pressSequentially('/shell', { delay: 20 })
  await page.keyboard.press('Enter')
  await $(page, 'chat-file-input').setInputFiles([FIXTURE_TEXT, FIXTURE_IMAGE])
  await input.pressSequentially('Tighten this skill using the attached notes', { delay: 5 })
  await $(page, 'chat-auto-approve').click()
})
await capture('VIS-012', 'at-agent-team-menu', { surface: 'UIS-007 Agent/team menu', state: '"@" lists Agents and Agent teams', journeys: 'UXJ-005' }, async (page) => {
  await $(page, 'chat-composer-input').click()
  await $(page, 'chat-composer-input').pressSequentially('@', { delay: 30 })
  await $(page, 'chat-target-menu').waitFor()
})
await capture('VIS-013', 'team-chat-draft', { surface: 'UIS-001 New chat', state: 'Addressed to a team: team chip, coordinator subtitle, quick-path note', journeys: 'UXJ-006' }, async (page) => {
  await $(page, 'chat-composer-input').click()
  await $(page, 'chat-composer-input').pressSequentially('@prod', { delay: 30 })
  await page.keyboard.press('Enter')
  await $(page, 'chat-team-chip').waitFor()
  await $(page, 'chat-composer-input').fill('Review the new chat design and list risks')
})
await capture('VIS-014', 'agent-chat-draft-codex-skills', { surface: 'UIS-001 New chat', state: 'Addressed to Codex: agent chip; "/" lists only Codex skills', journeys: 'UXJ-005' }, async (page) => {
  await $(page, 'chat-composer-input').click()
  await $(page, 'chat-composer-input').pressSequentially('@cod', { delay: 30 })
  await page.keyboard.press('Enter')
  await $(page, 'chat-agent-chip').waitFor()
  await $(page, 'chat-composer-input').pressSequentially('/', { delay: 30 })
  await $(page, 'chat-skill-menu').waitFor()
})
// R3: after the first message the chat run is shown as a normal agent view in the
// product workspace frame (right tabs column open by default: shared product setting).
await capture('VIS-015', 'chat-run-view-live', { surface: 'UIS-008 Chat run view', state: 'Live run (Idle): product header (avatar, title, status, ⚙ ＋), product box (Context Files, textarea, send; no model/thinking), right tabs column open; tree row selected with Terminate', journeys: 'UXJ-001, UXJ-009' }, async (page) => {
  const input = $(page, 'chat-composer-input')
  await input.click()
  await input.pressSequentially('/skill-opt', { delay: 20 })
  await page.keyboard.press('Enter')
  await sendFirst(page, 'Help me write a skill for weekly planning')
})
await capture('VIS-016', 'sent-as-tooltip', { surface: 'UIS-008 Chat run view', state: 'Hover skill chips: "Sent to the agent as"', journeys: 'UXJ-004' }, async (page) => {
  const input = $(page, 'chat-composer-input')
  await input.click()
  await input.pressSequentially('/skill-opt', { delay: 20 })
  await page.keyboard.press('Enter')
  await sendFirst(page, 'Help me write a skill for weekly planning')
  await $(page, 'chat-message-skills').first().hover()
})
await capture('VIS-017', 'chat-run-settings-stopped', { surface: 'UIS-013 Run settings (⚙)', state: 'Terminated run (Offline): product Agent Configuration, model + thinking editable, runtime and workspace fixed, Save', journeys: 'UXJ-007' }, async (page) => {
  await sendFirst(page, 'Help me write a skill for weekly planning')
  const runId = new URL(page.url()).searchParams.get('id')
  await page.locator(`[data-test="terminate-agent-run"][data-run-id="${runId}"]`).click()
  await page.waitForTimeout(400)
  await $(page, 'workspace-header-edit-config').click()
  await $(page, 'chat-run-settings').waitFor()
  await page.mouse.move(1430, 890)
})
await capture('VIS-026', 'chat-run-settings-live-locked', { surface: 'UIS-013 Run settings (⚙)', state: 'Live run: model and thinking locked ("Stop this run before changing model settings.")', journeys: 'UXJ-007' }, async (page) => {
  await sendFirst(page, 'Help me write a skill for weekly planning')
  await $(page, 'workspace-header-edit-config').click()
  await $(page, 'chat-run-settings').waitFor()
  await page.mouse.move(1430, 890)
})
await capture('VIS-018', 'right-tool-panel-open', { surface: 'UIS-009 Right tabs (workspace frame)', state: 'Panel reopened from the strip on Artifacts', journeys: 'UXJ-009' }, async (page) => {
  await page.locator('[data-test="chat-run-frame"] [data-test="right-side-panel-toggle"]').click()
  await page.locator('[data-test="chat-run-frame"] [data-test="workspace-right-tool-strip"] button[data-tab-name="artifacts"]').click()
  await page.locator('[data-test="chat-run-frame"] [data-test="workspace-right-panel"]').waitFor()
  await page.mouse.move(1430, 890)
}, { path: '/chat?id=chat-skill-review' })
await capture('VIS-019', 'stored-chat-strip-collapsed', { surface: 'UIS-008 Chat run view', state: 'Stored chat (Offline), right tabs collapsed to the strip', journeys: 'UXJ-001, UXJ-009' }, async (page) => {
  await page.locator('[data-test="chat-run-frame"] [data-test="right-side-panel-toggle"]').click()
  await page.locator('[data-test="chat-run-frame"] [data-test="workspace-right-tool-strip"]').waitFor()
  await page.mouse.move(1430, 890)
}, { path: '/chat?id=chat-skill-review' })
await capture('VIS-027', 'narrow-chat-run-view', { surface: 'UIS-008 Chat run view', state: 'Narrow viewport: left and right strips (product responsive policy)', journeys: 'UXJ-001, UXJ-009' }, async () => {}, { path: '/chat?id=chat-skill-review', width: 390, height: 844 })
await capture('VIS-021', 'workspaces-tree-normal-order', { surface: 'UIS-011 Workspaces tree', state: 'Normal product ordering; Daily Assistant group like any agent', journeys: 'UXJ-001' }, async (page) => {
  const temp = page.locator('[data-test="app-left-panel-run-history"] section', { hasText: 'Temp workspace' }).first()
  await temp.locator('button', { hasText: 'Temp workspace' }).first().click()
  await temp.locator('button[aria-expanded]', { hasText: 'Daily Assistant' }).first().click()
  await page.mouse.move(1430, 890)
})
await capture('VIS-022', 'first-run-model-menu', { surface: 'UIS-003 Model menu', state: 'First run: no last-used value, runtime default (AutoByteus)', journeys: 'UXJ-002' }, async (page) => {
  await $(page, 'chat-model-trigger').click()
  await $(page, 'chat-model-picker').waitFor()
}, { scenario: 'chat_first_run' })
await capture('VIS-023', 'narrow-new-chat', { surface: 'UIS-001 New chat', state: 'Narrow viewport', journeys: 'UXJ-001' }, async () => {}, { width: 390, height: 844 })
await capture('VIS-024', 'narrow-model-bottom-sheet', { surface: 'UIS-003 Model menu', state: 'Narrow bottom sheet', journeys: 'UXJ-002' }, async (page) => {
  await $(page, 'chat-model-trigger').click()
  await $(page, 'chat-model-picker').waitFor()
}, { width: 390, height: 844 })
await capture('VIS-025', 'chat-with-voice-available', { surface: 'UIS-002 Chat box', state: 'Voice Input extension installed: mic before send in the footer (desktop app)', journeys: 'UXJ-008' }, async (page) => {
  await $(page, 'composer-voice').waitFor({ timeout: 6000 })
}, { context: 'electron_internal' })

await browser.close()
await writeFile(resolve(outDir, 'manifest.json'), JSON.stringify({ capturedAt: new Date().toISOString(), baseUrl, references, errors }, null, 2))
console.log(`${references.length} references; errors: ${errors.length}`)
for (const e of errors) console.log('  ERR', e)
