#!/usr/bin/env node
// WEB-BASELINE-REFRESH-004 paired click-through probe for the surfaces that
// changed between origin/personal@e9aa4a7 and @0a32261: page-based Project and
// Task authoring, the live-run `@` mention (single inline highlight), the
// "From <Sender>:" delivery block, the locked Antigravity auto-approve control
// and the run-configuration forms without the run-level skill access option.
// Same matched conditions and pass rule as probe-flow.mjs: identical visible
// text and route, screenshot equal up to edge anti-aliasing or compositing
// rounding, no prototype browser errors and no non-local requests.
// Usage: node probe-refresh-004.mjs [flow-id-prefix ...]
import { chromium } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'
const require = createRequire(import.meta.url)
const icons = Object.fromEntries(['heroicons', 'ph', 'mdi', 'svg-spinners', 'vscode-icons', 'logos'].map(p => [p, require(`@iconify-json/${p}/icons.json`)]))
const root = resolve(new URL('../..', import.meta.url).pathname)
const SOURCE = process.env.SOURCE_BASE_URL || 'http://127.0.0.1:4533'
const PROTO = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4531'
const MOCK = process.env.MOCK_BASE_URL || 'http://127.0.0.1:4534'
const OUT = resolve(root, process.env.FLOW_DIR || 'evidence/WEB-BASELINE-REFRESH-004/refresh-flows')
const CHROME = process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const style = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'
const PROJECT = '/projects/project-prototype-launch'

const wait = ms => page => page.waitForTimeout(ms)
const tid = (id, action = 'click') => async page => { await page.getByTestId(id).first()[action](); await page.waitForTimeout(800) }
const fillTid = (id, value) => async page => { await page.getByTestId(id).first().fill(value); await page.waitForTimeout(500) }
const fillSel = (selector, value) => async page => { await page.locator(selector).first().fill(value); await page.waitForTimeout(500) }
const role = (r, name) => async page => { await page.getByRole(r, { name, exact: true }).first().click(); await page.waitForTimeout(900) }
const text = value => async page => { await page.getByText(value, { exact: true }).first().click(); await page.waitForTimeout(900) }
const press = key => async page => { await page.keyboard.press(key); await page.waitForTimeout(700) }
const typeKeys = value => async page => { await page.keyboard.type(value, { delay: 30 }); await page.waitForTimeout(800) }
const selectTid = (id, value) => async page => { await page.getByTestId(id).first().selectOption(value); await page.waitForTimeout(500) }
const attach = async page => {
  await page.locator('input[type="file"]').first().setInputFiles({ name: 'launch-notes.txt', mimeType: 'text/plain', buffer: Buffer.from('Synthetic launch notes.\n') })
  await page.waitForTimeout(1200)
}
// WEB-BASELINE-REFRESH-004: with the server's real workspace kind the synthetic workspace can
// already be expanded; open it only when its runs are not shown.
const ensureWorkspaceOpen = async page => {
  if (!(await page.getByText('Product Review Team', { exact: true }).first().isVisible().catch(() => false))) {
    await page.getByText('prototype-workspace', { exact: true }).first().click(); await page.waitForTimeout(900)
  }
}
const openStoredTeamRun = async page => {
  await ensureWorkspaceOpen(page)
  for (const label of ['Product Review Team', 'Review the current prototype baseline']) { await text(label)(page) }
}
const openStoredOrgRun = async page => {
  await ensureWorkspaceOpen(page)
  for (const label of ['Product Launch Org', 'Coordinate the synthetic launch review']) { await text(label)(page) }
}
const openStoredAgentRun = async page => {
  await ensureWorkspaceOpen(page)
  for (const label of ['Research Assistant', 'Compare current navigation states']) { await text(label)(page) }
}
const focusRunComposer = async page => { await page.locator('textarea.composer-text').last().click(); await page.waitForTimeout(500) }

export const FLOWS = {
  // Projects list and Project authoring pages (0a32261).
  'PRJ-001': { title: 'Projects list: New project opens the create page', path: '/projects', steps: [tid('projects-new-button')] },
  'PRJ-002': { title: 'Create project: empty name is rejected', path: '/projects/new', steps: [tid('project-form-submit')] },
  'PRJ-003': { title: 'Create project: Add workspace adds an existing-workspace row', path: '/projects/new', steps: [tid('project-add-workspace-inline')] },
  'PRJ-004': { title: 'Create project: unchosen workspace row is rejected', path: '/projects/new', steps: [fillSel('#project-editor-name', 'Launch Review'), tid('project-add-workspace-inline'), tid('project-form-submit')] },
  'PRJ-005': { title: 'Create project: New folder row with empty path is rejected', path: '/projects/new', steps: [fillSel('#project-editor-name', 'Launch Review'), tid('project-add-workspace-inline'), tid('workspace-mode-new-0'), tid('project-form-submit')] },
  'PRJ-006': { title: 'Create project with an existing workspace opens it with the created notice', path: '/projects/new', steps: [fillSel('#project-editor-name', 'Launch Review'), fillSel('#project-editor-description', 'Synthetic review project.'), tid('project-add-workspace-inline'), selectTid('workspace-select-0', 'workspace-prototype'), tid('project-form-submit'), wait(800)] },
  'PRJ-007': { title: 'Create project with a taken name shows the name error', path: '/projects/new', steps: [fillSel('#project-editor-name', 'Prototype Launch'), tid('project-form-submit')] },
  'PRJ-008': { title: 'Create project with a new folder workspace', path: '/projects/new', steps: [fillSel('#project-editor-name', 'Folder Review'), tid('project-add-workspace-inline'), tid('workspace-mode-new-0'), fillTid('workspace-path-0', '/synthetic/folder-review'), tid('project-form-submit'), wait(800)] },
  'PRJ-009': { title: 'Project detail: Edit opens the edit page', path: PROJECT, steps: [tid('project-edit-button')] },
  'PRJ-010': { title: 'Edit project: Save changes returns with the saved notice', path: `${PROJECT}/edit`, steps: [fillSel('#project-editor-description', 'Updated synthetic description.'), tid('project-form-submit'), wait(800)] },
  'PRJ-011': { title: 'Project detail: Workspaces tab', path: PROJECT, steps: [tid('project-tab-workspaces')] },
  'PRJ-012': { title: 'Project detail: Delete opens the confirmation', path: PROJECT, steps: [tid('project-delete-button')] },
  'PRJ-013': { title: 'Project detail: confirm delete returns to the (empty) list', path: PROJECT, steps: [tid('project-delete-button'), tid('project-delete-confirm'), wait(800)] },
  'PRJ-014': { title: 'Project detail: task search with no match', path: PROJECT, steps: [fillTid('project-tasks-search-input', 'zzz')] },
  'PRJ-015': { title: 'Projects list: search with no match', path: '/projects', steps: [fillTid('projects-search-input', 'zzz')] },
  // Task authoring pages (0a32261).
  'TSK-001': { title: 'Project detail: New task opens the task page', path: PROJECT, steps: [tid('project-tasks-new-button')] },
  'TSK-002': { title: 'New task: empty description is rejected', path: `${PROJECT}/tasks/new`, steps: [tid('task-page-save')] },
  'TSK-003': { title: 'New task: create returns to the board with the created notice', path: `${PROJECT}/tasks/new`, steps: [fillTid('task-page-description-input', 'Draft the synthetic release notes.\nCover the three launch surfaces.'), tid('task-page-save'), wait(800)] },
  'TSK-004': { title: 'New task: attach a context file', path: `${PROJECT}/tasks/new`, steps: [attach] },
  'TSK-005': { title: 'New task with a context file shows the file count on the board', path: `${PROJECT}/tasks/new`, steps: [fillTid('task-page-description-input', 'Review the attached notes.'), attach, tid('task-page-save'), wait(800)] },
  'TSK-006': { title: 'Board: open a task', path: PROJECT, steps: [tid('project-task-row-task-outline')] },
  'TSK-007': { title: 'Task detail: Edit task opens the edit page', path: `${PROJECT}/tasks/task-outline`, steps: [tid('task-page-edit')] },
  'TSK-008': { title: 'Edit task: save returns to the task', path: `${PROJECT}/tasks/task-outline/edit`, steps: [fillTid('task-page-description-input', 'Outline the launch checklist.\nInclude rollback steps.'), tid('task-page-save'), wait(800)] },
  'TSK-009': { title: 'Task detail: Delete task opens the confirmation', path: `${PROJECT}/tasks/task-outline`, steps: [tid('task-page-delete')] },
  'TSK-010': { title: 'Task detail: confirm delete returns to the board with the deleted notice', path: `${PROJECT}/tasks/task-outline`, steps: [tid('task-page-delete'), tid('task-page-delete-confirm'), wait(800)] },
  'TSK-011': { title: 'New task (narrow)', path: `${PROJECT}/tasks/new`, viewport: 'narrow', steps: [fillTid('task-page-description-input', 'Narrow task.')] },
  'TSK-012': { title: 'Unknown task shows Task not found', path: `${PROJECT}/tasks/task-missing`, steps: [] },
  // Live-run `@` mention (0a32261: single native inline highlight, server candidates).
  'MEN-001': { title: 'Stored Team run composer shows the @ placeholder', path: '/workspace', steps: [openStoredTeamRun, focusRunComposer] },
  'MEN-002': { title: 'Stored Team run: @ opens the live-run mention menu', path: '/workspace', steps: [openStoredTeamRun, focusRunComposer, typeKeys('@')] },
  'MEN-003': { title: 'Stored Team run: @ query filters the menu', path: '/workspace', steps: [openStoredTeamRun, focusRunComposer, typeKeys('@Doc')] },
  'MEN-004': { title: 'Stored Team run: choosing a candidate leaves one inline highlighted mention', path: '/workspace', steps: [openStoredTeamRun, focusRunComposer, typeKeys('Ask '), typeKeys('@Doc'), press('Enter'), typeKeys('to help.')] },
  'MEN-005': { title: 'Stored Team run: Team candidate chosen with the mouse', path: '/workspace', steps: [openStoredTeamRun, focusRunComposer, typeKeys('@'), text('Product Review Team')] },
  'MEN-006': { title: 'Stored Team run: Escape closes the @ menu', path: '/workspace', steps: [openStoredTeamRun, focusRunComposer, typeKeys('@'), press('Escape')] },
  'MEN-007': { title: 'Stored Org run member: @ opens the live-run mention menu', path: '/workspace', steps: [openStoredOrgRun, text('analyst'), focusRunComposer, typeKeys('@')] },
  'MEN-010': { title: 'Stored Team run: @ query without a match shows the empty hint', path: '/workspace', steps: [openStoredTeamRun, focusRunComposer, typeKeys('@zzz')] },
  'MEN-008': { title: 'Stored Team run writer: "From <Sender>:" delivery block', path: '/workspace', steps: [openStoredTeamRun, text('writer')] },
  'MEN-009': { title: 'Stored Team run writer: delivery details expanded', path: '/workspace', steps: [openStoredTeamRun, text('writer'), tid('inter-agent-toggle')] },
  // Task Agents and task Teams of a stored standalone Agent run (0a32261).
  'AGR-001': { title: 'Stored Agent run: opening it lists its task Agent and task Team', path: '/workspace', steps: [openStoredAgentRun] },
  'AGR-002': { title: 'Stored Agent run: open the task Agent conversation', path: '/workspace', steps: [openStoredAgentRun, text('documentation writer')] },
  'AGR-003': { title: 'Stored Agent run: task Team row opens its coordinator', path: '/workspace', steps: [openStoredAgentRun, text('product review team')] },
  'AGR-004': { title: 'Stored Agent run: the run row returns to the host conversation', path: '/workspace', steps: [openStoredAgentRun, text('documentation writer'), async page => { await page.locator('[data-test="workspace-agent-run-row"][data-run-id="run-research-001"]').first().click(); await page.waitForTimeout(900) }] },
  'AGR-005': { title: 'Stored Agent run: Team tab lists the task Agent message', path: '/workspace', steps: [openStoredAgentRun, text('Team')] },
  // Runtime/approval and run configuration (0a32261).
  'CFG-001': { title: 'New chat: Antigravity runtime shows the locked auto-approve control', path: '/chat', scenario: 'agy_runtime', steps: [
    async page => { await page.getByRole('button', { name: /^Model: / }).first().click(); await page.waitForTimeout(700) },
    async page => { await page.locator('[data-test="chat-runtime-antigravity_cli"]').first().click(); await page.waitForTimeout(700) },
    async page => { await page.getByText(/gpt-prototype/).first().click(); await page.waitForTimeout(900) },
  ] },
  'CFG-002': { title: 'Agent catalog Run: launch form (fresh launch auto-approve, no skill access)', path: '/agents?view=list', steps: [async page => { await page.getByRole('button', { name: 'Run', exact: true }).nth(2).click(); await page.waitForTimeout(1200) }] },
  'CFG-003': { title: 'Team catalog Run: launch form and member overrides', path: '/agent-teams?view=team-list', steps: [role('button', 'Run'), wait(600)] },
  'CFG-004': { title: 'Stored Team run: run settings (Edit Config)', path: '/workspace', steps: [openStoredTeamRun, async page => { await page.getByTitle(/Edit Config|Run settings/i).first().click().catch(async () => { await page.getByRole('button', { name: /Edit Config|Run settings/i }).first().click() }); await page.waitForTimeout(1200) }] },
  'CFG-005': { title: 'Server settings (advanced): compaction model settings', path: '/settings?section=server-settings&mode=advanced', steps: [wait(600)] },
}

const requested = process.argv.slice(2)
const selected = Object.keys(FLOWS).filter(id => !requested.length || requested.some(prefix => id.startsWith(prefix)))
const browser = await chromium.launch({ headless: true, executablePath: CHROME, args: ['--no-sandbox', '--disable-background-networking', '--font-render-hinting=none'] })
await mkdir(resolve(OUT, 'source'), { recursive: true }); await mkdir(resolve(OUT, 'prototype'), { recursive: true })
const viewportFor = name => name === 'narrow' ? { width: 390, height: 844 } : { width: 1440, height: 900 }

async function run(base, target, id) {
  const flow = FLOWS[id]
  const scenario = flow.scenario || 'populated'
  // Restores the observation node's synthetic data (Project/Task saves) before every run.
  await fetch(`${MOCK}/__prototype/scenario`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scenario, operationFailures: {} }) })
  const viewport = viewportFor(flow.viewport)
  const ctx = await browser.newContext({ viewport, locale: 'en-US', colorScheme: 'light', reducedMotion: 'reduce', timezoneId: 'UTC' })
  const external = []
  await ctx.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (['api.iconify.design', 'api.simplesvg.com', 'api.unisvg.com'].includes(url.hostname)) {
      if (target === 'prototype') external.push(url.href)
      const prefix = url.pathname.split('/').pop()?.replace(/\.json$/, '')
      if (prefix && icons[prefix]) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(icons[prefix]) })
    }
    if (['data:', 'blob:'].includes(url.protocol) || ['127.0.0.1', 'localhost'].includes(url.hostname)) return route.continue()
    external.push(url.href); return route.abort('blockedbyclient')
  })
  await ctx.addInitScript(({ scenario }) => {
    if (sessionStorage.getItem('__flow_init')) return
    sessionStorage.setItem('__flow_init', '1')
    localStorage.clear()
    localStorage.setItem('autobyteus.localization.preference-mode', 'en')
    localStorage.setItem('autobyteus.prototype.scenario', scenario)
    localStorage.setItem('autobyteus.prototype.context', 'desktop')
  }, { scenario })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(`pageerror: ${e.message.slice(0, 400)}`))
  page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text().slice(0, 300)}`) })
  await page.goto(base + flow.path, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(1800)
  let stepError = null
  for (const [index, step] of flow.steps.entries()) {
    try { await step(page) } catch (error) { stepError = `step ${index + 1}: ${error.message.split('\n')[0]}`; break }
  }
  await page.waitForTimeout(flow.settleMs ?? 800)
  await page.addStyleTag({ content: style }); await page.waitForTimeout(60)
  const file = resolve(OUT, target, `${id}.png`)
  await page.screenshot({ path: file })
  const bodyText = await page.locator('body').innerText()
  const composerValue = await page.locator('textarea.composer-text').count() ? await page.locator('textarea.composer-text').last().inputValue({ timeout: 2000 }).catch(() => null) : null
  const route = (await page.evaluate(() => location.pathname + location.search)).replace(/temp-\d+-/g, 'temp-<ms>-')
  await ctx.close()
  return { file, text: `${bodyText}\n[composer]${composerValue ?? ''}`, route, errors, stepError, external, viewport }
}
async function diff(a, b) {
  const [s, p] = await Promise.all([sharp(a).removeAlpha().raw().toBuffer(), sharp(b).removeAlpha().raw().toBuffer()])
  let changed = 0, max = 0, low = 0
  for (let i = 0; i < s.length; i += 3) { let d = 0; for (let k = 0; k < 3; k++) d = Math.max(d, Math.abs(s[i + k] - p[i + k])); if (d) { changed++; if (d <= 2) low++; if (d > max) max = d } }
  return { changed, max, low }
}
const results = []
for (const id of selected) {
  const s = await run(SOURCE, 'source', id)
  const p = await run(PROTO, 'prototype', id)
  const d = await diff(s.file, p.file)
  const total = s.viewport.width * s.viewport.height
  const noise = d.changed === 0 ? 'exact' : (d.changed / total <= 0.0001 && d.max <= 64) ? 'A-edge-antialiasing' : (d.low / d.changed >= 0.99 && d.max <= 16) ? 'B-compositing-rounding' : null
  const pass = !s.stepError && !p.stepError && s.text === p.text && s.route === p.route && Boolean(noise) && p.errors.length === 0 && p.external.length === 0
  results.push({ id, title: FLOWS[id].title, scenario: FLOWS[id].scenario || 'populated', viewport: FLOWS[id].viewport || 'desktop', pass, noise, pixels: d, route: [s.route, p.route], textEqual: s.text === p.text, sourceStepError: s.stepError, prototypeStepError: p.stepError, sourceErrors: s.errors, prototypeErrors: p.errors, prototypeExternal: p.external })
  console.log(`${pass ? 'PASS' : 'FAIL'} ${id} ${FLOWS[id].title} text=${s.text === p.text} route=${s.route === p.route ? s.route : s.route + ' vs ' + p.route} px=${d.changed} max=${d.max} ${s.stepError ? 'SRC-STEP ' + s.stepError : ''} ${p.stepError ? 'PROTO-STEP ' + p.stepError : ''} srcErr=${s.errors.length} protoErr=${p.errors.length}`)
  if (!pass && process.env.VERBOSE) {
    const sl = s.text.split('\n'), pl = p.text.split('\n'); const ps = new Set(pl), ss = new Set(sl)
    console.log('  source-only:', JSON.stringify(sl.filter(x => !ps.has(x)).slice(0, 12)))
    console.log('  proto-only :', JSON.stringify(pl.filter(x => !ss.has(x)).slice(0, 12)))
    if (s.errors.length) console.log('  srcErr', JSON.stringify(s.errors.slice(0, 3)))
    if (p.errors.length) console.log('  protoErr', JSON.stringify(p.errors.slice(0, 3)))
  }
}
await writeFile(resolve(OUT, `flow-results${process.env.RESULT_TAG ? '-' + process.env.RESULT_TAG : ''}.json`), JSON.stringify({ generatedAt: new Date().toISOString(), source: SOURCE, prototype: PROTO, mock: MOCK, results }, null, 2))
await browser.close()
