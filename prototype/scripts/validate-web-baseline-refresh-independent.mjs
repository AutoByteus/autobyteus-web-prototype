#!/usr/bin/env node
// Independent-run check (WEB-BASELINE-REFRESH-002, extended by -003 with the
// Background Tasks rows, and by -004 with Projects pages, the live-run `@` menu and Agent-run task
// rows, and by -008 with the Projects tab, Task roots, Temp tasks, run settings, Draft rows, group
// archive and the preserved Reconnect design): exercises the built preview
// (PORT=<port> node .output/server/index.mjs; BASE/OUT override the defaults) with the pinned source and the
// observation node stopped, recording browser errors and non-local requests.
import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
const OUT = process.env.OUT || 'evidence/WEB-BASELINE-REFRESH-008/independent-preview'
const BASE = process.env.BASE || 'http://127.0.0.1:4621'
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
const openWorkspace = async p => { if (!(await p.getByText('Product Review Team', { exact: true }).first().isVisible().catch(() => false))) { await p.getByText('prototype-workspace', { exact: true }).first().click(); await p.waitForTimeout(700) } }
const openTeamRun = async p => { await openWorkspace(p); await p.getByText('Product Review Team', { exact: true }).first().click(); await p.waitForTimeout(700); await p.getByText('Review the current prototype baseline', { exact: true }).first().click(); await p.waitForTimeout(900) }
await run('IND-004-workspace-team-run', '/workspace', openTeamRun)
await run('IND-005-skills-banner', '/skills', async p => { await p.evaluate(() => { localStorage.setItem('autobyteus.prototype.scenario', 'skill_name_issues') }); await p.reload(); await p.waitForTimeout(2500) })
await run('IND-006-agents', '/agents?view=list')
await run('IND-007-chat-background-tasks-empty', '/chat', async p => { await composer(p).click(); await p.keyboard.type('Summarize the synthetic baseline.'); await p.keyboard.press('Enter'); await p.waitForTimeout(2500); await p.locator('[data-test="background-tasks-header"]').click(); await p.locator('[data-test="background-tasks-empty"]').waitFor({ timeout: 5000 }) })
// WEB-BASELINE-REFRESH-004 (0a32261)
await run('IND-008-project-create', '/projects/new', async p => { await p.locator('#project-editor-name').fill('Launch Review'); await p.getByTestId('project-add-workspace-inline').click(); await p.getByTestId('workspace-select-0').selectOption('/synthetic/prototype-workspace'); await p.getByTestId('project-form-submit').click(); await p.getByTestId('project-save-notice').waitFor({ timeout: 5000 }) })
await run('IND-009-task-create', '/projects/project-prototype-launch/tasks/new', async p => { await p.getByTestId('task-page-description-input').fill('Draft the synthetic release notes.'); await p.getByTestId('task-page-save').click(); await p.getByText('Draft the synthetic release notes.').first().waitFor({ timeout: 5000 }) })
await run('IND-010-team-run-mention-menu', '/workspace', async p => { await openTeamRun(p); await p.locator('textarea.composer-text').last().click(); await p.keyboard.type('@'); await p.locator('[data-test="run-mention-menu"]').waitFor({ timeout: 5000 }) })
await run('IND-011-agent-run-task-rows', '/workspace', async p => { await openWorkspace(p); await p.getByText('Research Assistant', { exact: true }).first().click(); await p.waitForTimeout(700); await p.getByText('Compare current navigation states', { exact: true }).first().click(); await p.locator('[data-test="workspace-agent-run-task-tree"]').waitFor({ timeout: 5000 }) })
// WEB-BASELINE-REFRESH-006 (4dee901)
await run('IND-012-skill-source-import', '/skills', async p => { await p.getByRole('button', { name: 'Sources', exact: true }).click(); await p.getByRole('button', { name: 'GitHub', exact: true }).click(); await p.locator('#skill-source-input').fill('https://github.com/acme/launch-skills'); await p.getByRole('button', { name: 'Import repository', exact: true }).click(); await p.getByText('https://github.com/acme/launch-skills').waitFor({ timeout: 5000 }) })
await run('IND-013-task-agent-token', '/workspace', async p => { await openWorkspace(p); await p.getByText('Research Assistant', { exact: true }).first().click(); await p.waitForTimeout(700); await p.getByText('Compare current navigation states', { exact: true }).first().click(); await p.waitForTimeout(700); await p.getByText('documentation writer', { exact: true }).first().click(); await p.waitForTimeout(900); await p.locator('[data-test="right-side-tab-list"]').getByText(/^Token/).first().click(); await p.getByText('Latest prompt').first().waitFor({ timeout: 5000 }) })
// WEB-BASELINE-REFRESH-007 (10fb695)
await run('IND-014-background-task-command', '/chat', async p => {
  await composer(p).click(); await p.keyboard.type('Summarize the synthetic baseline.'); await p.keyboard.press('Enter'); await p.waitForTimeout(2500)
  await p.evaluate(() => {
    const pinia = document.querySelector('#__nuxt').__vue_app__.config.globalProperties.$pinia
    const runId = pinia._s.get('activeContext').activeAgentContext.state.runId
    pinia._s.get('agentBackgroundTask').upsertTask(runId, { taskId: 'bg-cmd-1', kind: 'shell', description: 'Wait for the synthetic release workflow', command: 'gh run watch 42 --exit-status', status: 'running', summary: null, startedAt: '2026-08-22T04:03:00.000Z' })
  })
  await p.locator('[data-test="background-tasks-header"]').click(); await p.locator('[data-test="background-task-command"]').click()
  await p.locator('[data-test="background-task-command"][aria-expanded="true"]').waitFor({ timeout: 5000 })
})
// WEB-BASELINE-REFRESH-008 (1cd1a3a)
const rightTab = async (p, name) => { await p.locator('[data-test="right-side-tab-list"]').getByText(name, { exact: true }).first().click(); await p.waitForTimeout(800) }
await run('IND-015-projects-tab', '/workspace', async p => { await rightTab(p, 'Projects'); await p.getByTestId('projects-panel-picker-select').selectOption('temp'); await p.getByText('Collect the changelog links for the synthetic release.').first().click(); await p.waitForTimeout(800) })
await run('IND-016-task-root-opens-worker', '/projects/project-prototype-launch/tasks/task-review', async p => { await p.getByText('documentation writer', { exact: true }).first().click(); await p.waitForURL(/\/chat\?id=/, { timeout: 8000 }) })
await run('IND-017-temp-task-page', '/projects/temp-tasks', async p => { await p.getByText('Collect the changelog links for the synthetic release.').first().click(); await p.waitForURL(/temp-tasks\/tasks\//, { timeout: 5000 }) })
await run('IND-018-codex-fast', '/chat', async p => { await p.getByRole('button', { name: /^Model: / }).click(); await p.locator('[data-test="chat-runtime-codex_app_server"]').click(); await p.getByText('GPT-5.6 Sol', { exact: true }).first().click(); await p.locator('[data-test="chat-model-option-service_tier"]').click(); await p.waitForTimeout(500) })
await run('IND-019-draft-row', '/chat', async p => { await composer(p).click(); await p.keyboard.type('Plan the synthetic launch notes'); await p.getByText('Agents', { exact: true }).first().click(); await p.locator('[data-test="chat-draft-row"]').waitFor({ timeout: 5000 }) })
await run('IND-020-org-launch', '/chat', async p => { await p.locator('[data-test="run-target-switcher-trigger"]').click(); await p.locator('[data-test="run-target-switcher-option-org-product-launch"]').click(); await p.waitForTimeout(1500); await p.locator('[data-test="org-launch-run"]').click(); await p.waitForURL(/mode=active/, { timeout: 8000 }) })
await run('IND-021-archive-all', '/workspace', async p => { await openWorkspace(p); await p.locator('[data-test="workspace-agent-group-archive-agent-researcher"]').click(); await p.getByRole('button', { name: /^Archive all$/ }).click(); await p.getByText('Archived 1 run.').waitFor({ timeout: 5000 }) })
await run('IND-022-reconnect-preserved', '/workspace', async p => { await p.getByText('prototype-workspace').first().click(); await p.waitForTimeout(800); await p.locator('[data-agent-definition-id="tutorial-video-producer"]').first().click(); await p.waitForTimeout(400); await p.getByText('Turn the v2 launch notes').first().click(); await p.waitForTimeout(1500); const box = p.locator('textarea').first(); await box.click(); await box.fill('Make the first cut.'); await box.press('Enter'); await p.locator('[data-test="agent-missing-error-reconnect"]').click(); await p.locator('[data-test="reconnect-dialog-search"]').waitFor({ timeout: 5000 }) })
await writeFile(`${OUT}/results.json`, JSON.stringify({ generatedAt: new Date().toISOString(), base: BASE, note: 'Built preview (node .output/server/index.mjs) with the pinned source and the observation node stopped.', results }, null, 2))
await b.close()
