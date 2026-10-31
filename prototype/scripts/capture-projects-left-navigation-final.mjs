#!/usr/bin/env node
// Final visual references of the `projects-left-navigation` ticket (VIS-001 …), captured from the running UI reference
// through its normal entry (/workspace and /chat). Only seeds local storage (mode, locale, starting state); every state is
// reached by clicking the real controls.
//   PROTOTYPE_BASE_URL=http://127.0.0.1:4960 node prototype/scripts/capture-projects-left-navigation-final.mjs
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(new URL('../..', import.meta.url).pathname)
const BASE = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4960'
const CHROME = process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = resolve(root, 'tickets/done/projects-left-navigation/visual-references')
const MODE_KEY = 'autobyteus.leftPanel.runSectionMode.embedded-local'
const SEED_KEY = 'autobyteus.prototype.projectsTree'
const style = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'
const DESKTOP = { width: 1440, height: 900 }
const NARROW = { width: 600, height: 800 }

const sel = (css) => async (page) => { await page.locator(css).first().click(); await page.waitForTimeout(600) }
const hover = (css) => async (page) => { await page.locator(css).first().hover(); await page.waitForTimeout(400) }
const focusKey = (css) => async (page) => { await page.locator(css).first().focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(300) }
const type = (text) => async (page) => { await page.locator('textarea').first().fill(text); await page.waitForTimeout(300) }
const send = async (page) => { await page.keyboard.press('Enter'); await page.waitForTimeout(3500) }
const wait = (ms) => async (page) => { await page.waitForTimeout(ms) }
const away = async (page) => { await page.evaluate(() => { const active = document.activeElement; if (active && active.closest && active.closest('[data-test=app-left-panel-run-history]')) active.blur() }); await page.mouse.move(700, 880); await page.waitForTimeout(300) }
const projectRow = (id, part) => `[data-project-id=${id}] [data-test=${part}]`
const AUTOBYTEUS = 'project-desktop-app', LAUNCH = 'project-prototype-launch', ONBOARDING = 'project-onboarding-redesign'
const rightProjectsTab = async (page) => { await page.mouse.click(1044, 33); await page.waitForTimeout(900) }

const refs = [
  { id: 'VIS-001', file: 'VIS-001-workspaces-mode-desktop-1440x900.png', mode: 'workspaces', steps: [sel('[data-test=workspace-row] button'), away] },
  { id: 'VIS-002', file: 'VIS-002-projects-mode-autobyteus-board-desktop-1440x900.png', mode: 'projects', steps: [rightProjectsTab, sel(projectRow(AUTOBYTEUS, 'project-row-select')), sel('[data-test=workspace-agent-row] >> text=Project Task Manager'), away] },
  { id: 'VIS-003', file: 'VIS-003-projects-mode-prototype-launch-shared-run-desktop-1440x900.png', mode: 'projects', steps: [rightProjectsTab, sel(projectRow(LAUNCH, 'project-row-select')), sel('[data-test=workspace-agent-row] >> text=Project Task Manager'), away] },
  { id: 'VIS-004', file: 'VIS-004-project-without-runs-desktop-1440x900.png', mode: 'projects', steps: [sel(projectRow(ONBOARDING, 'project-row-select')), away] },
  { id: 'VIS-005', file: 'VIS-005-no-projects-desktop-1440x900.png', mode: 'projects', seed: 'none', steps: [wait(500)] },
  { id: 'VIS-006', file: 'VIS-006-projects-loading-desktop-1440x900.png', mode: 'projects', seed: 'loading', loadWait: 600, steps: [] },
  { id: 'VIS-007', file: 'VIS-007-projects-read-error-desktop-1440x900.png', mode: 'projects', seed: 'error', steps: [wait(500)] },
  { id: 'VIS-008', file: 'VIS-008-projects-refresh-error-keeps-tree-desktop-1440x900.png', mode: 'projects', seed: 'stale-error', steps: [wait(6500)] },
  { id: 'VIS-009', file: 'VIS-009-start-under-project-desktop-1440x900.png', mode: 'projects', steps: [sel(projectRow(AUTOBYTEUS, 'project-run-add')), wait(1200), away] },
  { id: 'VIS-010', file: 'VIS-010-new-chat-plain-desktop-1440x900.png', mode: 'workspaces', steps: [sel('[data-test=app-left-panel-new-chat]'), wait(1200), away] },
  { id: 'VIS-011', file: 'VIS-011-chip-menu-workspaces-tab-desktop-1440x900.png', mode: 'workspaces', steps: [sel('[data-test=app-left-panel-new-chat]'), wait(1200), sel('[data-test=chat-workspace-trigger]'), wait(300)] },
  { id: 'VIS-012', file: 'VIS-012-chip-menu-projects-tab-desktop-1440x900.png', mode: 'workspaces', steps: [sel('[data-test=app-left-panel-new-chat]'), wait(1200), sel('[data-test=chat-workspace-trigger]'), sel('[data-test=chat-target-tab-projects]')] },
  { id: 'VIS-013', file: 'VIS-013-start-project-without-folder-desktop-1440x900.png', mode: 'projects', steps: [sel(projectRow(ONBOARDING, 'project-run-add')), wait(1200), away] },
  { id: 'VIS-014', file: 'VIS-014-start-project-with-folder-overridden-desktop-1440x900.png', mode: 'projects', steps: [sel(projectRow(AUTOBYTEUS, 'project-run-add')), wait(1200), sel('[data-test=chat-workspace-trigger]'), sel('[data-test=chat-target-tab-workspaces]'), sel('[data-test=chat-workspace-option-temp]'), away] },
  { id: 'VIS-015', file: 'VIS-015-run-listed-under-project-after-send-desktop-1440x900.png', mode: 'projects', steps: [sel(projectRow(AUTOBYTEUS, 'project-run-add')), wait(1200), type('Summarize the open desktop Tasks.'), send, away] },
  { id: 'VIS-016', file: 'VIS-016-start-from-plain-chat-choosing-project-desktop-1440x900.png', mode: 'workspaces', steps: [sel('[data-test=app-left-panel-new-chat]'), wait(1200), sel('[data-test=chat-workspace-trigger]'), sel('[data-test=chat-target-tab-projects]'), sel('[data-test=chat-project-option-project-prototype-launch]'), away] },
  { id: 'VIS-017', file: 'VIS-017-project-agent-picker-no-orgs-desktop-1440x900.png', mode: 'projects', steps: [sel(projectRow(AUTOBYTEUS, 'project-run-add')), wait(1200), sel('[data-test=chat-new-target] button'), wait(400)] },
  { id: 'VIS-018', file: 'VIS-018-project-row-hover-add-desktop-1440x900.png', mode: 'projects', steps: [hover(`[data-project-id=${LAUNCH}]`)] },
  { id: 'VIS-019', file: 'VIS-019-project-row-keyboard-focus-desktop-1440x900.png', mode: 'projects', steps: [focusKey(projectRow(AUTOBYTEUS, 'project-row-select'))] },
  { id: 'VIS-020', file: 'VIS-020-group-archive-all-in-project-desktop-1440x900.png', mode: 'projects', steps: [sel(projectRow(LAUNCH, 'project-row-select')), hover('[data-agent-definition-id=agent-researcher]'), sel('[data-test=workspace-agent-group-archive-agent-researcher]'), wait(300)] },
  { id: 'VIS-021', file: 'VIS-021-collapsed-strip-projects-mode-desktop-1440x900.png', mode: 'projects', steps: [sel('[data-test=app-left-panel-collapse]'), away] },
  { id: 'VIS-022', file: 'VIS-022-projects-mode-zh-CN-desktop-1440x900.png', mode: 'projects', locale: 'zh-CN', steps: [sel(projectRow(LAUNCH, 'project-row-select')), sel('[data-test=workspace-agent-row] >> text=Project Task Manager'), away] },
  { id: 'VIS-023', file: 'VIS-023-chip-menu-projects-tab-zh-CN-desktop-1440x900.png', mode: 'workspaces', locale: 'zh-CN', steps: [sel('[data-test=app-left-panel-new-chat]'), wait(1200), sel('[data-test=chat-workspace-trigger]'), sel('[data-test=chat-target-tab-projects]')] },
  { id: 'VIS-024', file: 'VIS-024-collapsed-strip-narrow-600x800.png', mode: 'projects', viewport: NARROW, steps: [wait(300)] },
  { id: 'VIS-025', file: 'VIS-025-projects-drawer-narrow-600x800.png', mode: 'projects', viewport: NARROW, steps: [sel('[data-test=workspace-left-strip-workspaces]'), wait(500), sel(projectRow(LAUNCH, 'project-row-select')), wait(300)] },
]

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ headless: true, executablePath: CHROME })
const only = new Set((process.env.ONLY || '').split(',').filter(Boolean))
for (const ref of refs) {
  if (only.size && !only.has(ref.id)) continue
  const context = await browser.newContext({ viewport: ref.viewport || DESKTOP, deviceScaleFactor: 1, locale: ref.locale === 'zh-CN' ? 'zh-CN' : 'en-US' })
  await context.addInitScript(({ modeKey, mode, seedKey, seed, locale }) => {
    localStorage.setItem(modeKey, mode)
    if (seed) localStorage.setItem(seedKey, seed); else localStorage.removeItem(seedKey)
    localStorage.setItem('autobyteus.localization.preference-mode', locale)
  }, { modeKey: MODE_KEY, mode: ref.mode, seedKey: SEED_KEY, seed: ref.seed || '', locale: ref.locale || 'en' })
  const page = await context.newPage()
  page.on('pageerror', (error) => console.log(ref.id, 'PAGEERROR', error.message))
  await page.goto(`${BASE}/workspace`, { waitUntil: 'load' })
  await page.addStyleTag({ content: style })
  await page.waitForTimeout(ref.loadWait ?? 3500)
  for (const step of ref.steps) await step(page)
  await page.screenshot({ path: resolve(OUT, ref.file) })
  console.log('captured', ref.id, ref.file)
  await context.close()
}
await browser.close()
