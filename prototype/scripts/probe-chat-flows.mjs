#!/usr/bin/env node
// WEB-BASELINE-REFRESH-002 paired click-through probe for the Chat entry
// surface shipped at origin/personal@57df63f (composer menus, thinking,
// skills, targets, approval, send) plus the D-19 Skills banner and nav changes.
// Same matched conditions and pass rule as probe-flow.mjs.
// WEB-BASELINE-REFRESH-003 added the BGT-* Background Tasks rows (e9aa4a7).
// Usage: node probe-chat-flows.mjs [flow-id ...]
import { chromium } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'
const require = createRequire(import.meta.url)
const icons = Object.fromEntries(['heroicons', 'ph', 'mdi', 'svg-spinners', 'vscode-icons', 'logos'].map(p => [p, require(`@iconify-json/${p}/icons.json`)]))
const root = resolve(new URL('../..', import.meta.url).pathname)
const SOURCE = process.env.SOURCE_BASE_URL || 'http://127.0.0.1:4543'
const PROTO = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4541'
const MOCK = process.env.MOCK_BASE_URL || 'http://127.0.0.1:4544'
const OUT = resolve(root, process.env.FLOW_DIR || 'evidence/WEB-BASELINE-REFRESH-007/chat-flows')
const CHROME = process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const style = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'


const role = (r, name) => async page => { await page.getByRole(r, { name }).first().click(); await page.waitForTimeout(700) }
const text = (value, exact = true) => async page => { await page.getByText(value, { exact }).first().click(); await page.waitForTimeout(700) }
const fill = (placeholder, value) => async page => { await page.getByPlaceholder(placeholder).first().fill(value); await page.waitForTimeout(600) }
const press = key => async page => { await page.keyboard.press(key); await page.waitForTimeout(700) }
const typeKeys = value => async page => { await page.keyboard.type(value, { delay: 30 }); await page.waitForTimeout(700) }
const NEW_CHAT_PLACEHOLDER = 'Ask anything · / for skills · @ for an agent or team'
const focusComposer = async page => { await page.getByPlaceholder(NEW_CHAT_PLACEHOLDER).first().click(); await page.waitForTimeout(300) }
const openWorkspace = role('button', /^Workspace: /)
const openModel = role('button', /^Model: /)
const pickReasoning = async page => {
  await openModel(page)
  await page.locator('[data-test="chat-runtime-autobyteus"]').first().click(); await page.waitForTimeout(700)
  await page.getByText(/reasoning-prototype/).first().click(); await page.waitForTimeout(800)
}
const sendFirst = async page => { await focusComposer(page); await page.keyboard.type('Summarize the synthetic baseline.', { delay: 20 }); await page.keyboard.press('Enter'); await page.waitForTimeout(2500) }
const openThinking = role('button', /^Thinking: /)
// WEB-BASELINE-REFRESH-003 (origin/personal@e9aa4a7): Background Tasks replaced
// the To-Do section of the Activity tab. The source store is live-only, so the
// same synthetic task snapshots are upserted through it in source and prototype.
const BACKGROUND_TASKS = [
  { taskId: 'bg-task-1', kind: 'shell', description: 'Run the synthetic parity capture', status: 'running', summary: null, startedAt: '2026-08-22T04:03:00.000Z' },
  { taskId: 'bg-task-2', kind: 'subagent', description: 'Compare current UI surfaces', status: 'completed', summary: 'Compared the synthetic workspace surfaces and recorded every matched state. No perceptible difference was found in the sampled screens, and the evidence folder lists each compared surface with its viewport.', startedAt: '2026-08-22T04:02:00.000Z' },
  { taskId: 'bg-task-3', kind: 'monitor', description: 'Watch the synthetic build log', status: 'failed', summary: 'Synthetic monitor exited with code 1.', startedAt: '2026-08-22T04:01:00.000Z' },
  { taskId: 'bg-task-4', kind: 'workflow', description: '', status: 'stopped', summary: null, startedAt: '2026-08-22T04:00:30.000Z' },
]
// WEB-BASELINE-REFRESH-007 (10fb695): a shell task shows its exact command after the kind label
// (monospace, truncated, click to expand); a command equal to the title is not repeated.
const COMMAND_TASKS = [
  { taskId: 'bg-cmd-1', kind: 'shell', description: 'Wait for the synthetic release workflow', command: 'gh run watch 42 --exit-status', status: 'running', summary: null, startedAt: '2026-08-22T04:03:00.000Z' },
  { taskId: 'bg-cmd-2', kind: 'shell', description: 'Build the synthetic bundle', command: 'pnpm build', status: 'failed', summary: 'Synthetic build exited with code 1.', startedAt: '2026-08-22T04:02:00.000Z' },
  { taskId: 'bg-cmd-3', kind: 'shell', description: 'Poll the synthetic release list', command: 'cd /synthetic/prototype-workspace && for i in $(seq 1 110); do gh run list --workflow release.yml --limit 1; sleep 30; done\necho finished', status: 'completed', summary: 'Polling finished after the synthetic release completed.', startedAt: '2026-08-22T04:01:00.000Z' },
  { taskId: 'bg-cmd-4', kind: 'shell', description: 'npm run dev', command: 'npm run dev ', status: 'running', summary: null, startedAt: '2026-08-22T04:00:30.000Z' },
]
const seedCommandTasks = async page => {
  const applied = await page.evaluate(tasks => {
    const pinia = document.querySelector('#__nuxt')?.__vue_app__?.config?.globalProperties?.$pinia
    const runId = pinia?._s.get('activeContext')?.activeAgentContext?.state?.runId
    const store = pinia?._s.get('agentBackgroundTask')
    if (!runId || !store) return false
    for (const task of tasks) store.upsertTask(runId, task)
    return true
  }, COMMAND_TASKS)
  if (!applied) throw new Error('background-task store or active run unavailable')
  await page.waitForTimeout(500)
}
const clickCommand = index => async page => { await page.locator('[data-test="background-task-command"]').nth(index).click(); await page.waitForTimeout(400) }
const seedTasks = async page => {
  const applied = await page.evaluate(tasks => {
    const pinia = document.querySelector('#__nuxt')?.__vue_app__?.config?.globalProperties?.$pinia
    const runId = pinia?._s.get('activeContext')?.activeAgentContext?.state?.runId
    const store = pinia?._s.get('agentBackgroundTask')
    if (!runId || !store) return false
    for (const task of tasks) store.upsertTask(runId, task)
    return true
  }, BACKGROUND_TASKS)
  if (!applied) throw new Error('background-task store or active run unavailable')
  await page.waitForTimeout(500)
}
const openActivityTab = async page => { await page.locator('[data-test="right-side-tab-list"]').getByText(/^(Activity|活动)$/).first().click(); await page.waitForTimeout(700) }
const toggleBackgroundTasks = async page => { await page.locator('[data-test="background-tasks-header"]').first().click(); await page.waitForTimeout(500) }
// WEB-BASELINE-REFRESH-004: with the server's real workspace kind the synthetic workspace can
// already be expanded; open it only when its runs are not shown.
const ensureWorkspaceOpen = async page => {
  if (!(await page.getByText('Product Review Team', { exact: true }).first().isVisible().catch(() => false))) {
    await page.getByText('prototype-workspace', { exact: true }).first().click(); await page.waitForTimeout(900)
  }
}
const openStoredTeamRun = async page => {
  await ensureWorkspaceOpen(page)
  for (const label of ['Product Review Team', 'Review the current prototype baseline']) { await page.getByText(label, { exact: true }).first().click(); await page.waitForTimeout(900) }
}

// WEB-BASELINE-REFRESH-004 (0a32261): compaction status (stopped phase and gray tone added) and the
// collaborator add-failure notice are live-only, so the same synthetic values are applied through
// the source's own store/context in source and prototype, as for the Background Tasks rows.
const COMPACTIONS = [
  { kind: 'compaction', activityId: 'cmp-1', phase: 'completed', message: 'Context compacted', timestamp: '2026-08-22T04:03:00.000Z', compactedBlockCount: 12, summaryCharCount: 1840, summaryTokenCount: 460, summarizerProvider: 'autobyteus', completionStatus: 'completed', compactionModelIdentifier: 'mock/gpt-prototype' },
  { kind: 'compaction', activityId: 'cmp-2', phase: 'failed', message: 'Context compaction failed', timestamp: '2026-08-22T04:04:00.000Z', completionStatus: 'failed', completionReason: 'Synthetic summarizer timeout.' },
  { kind: 'compaction', activityId: 'cmp-3', phase: 'stopped', message: 'Context compaction stopped', timestamp: '2026-08-22T04:05:00.000Z' },
  { kind: 'compaction', activityId: 'cmp-4', phase: 'started', message: 'Compacting context…', timestamp: '2026-08-22T04:06:00.000Z' },
]
const seedCompactions = async page => {
  const applied = await page.evaluate(items => {
    const pinia = document.querySelector('#__nuxt')?.__vue_app__?.config?.globalProperties?.$pinia
    const runId = pinia?._s.get('activeContext')?.activeAgentContext?.state?.runId
    const store = pinia?._s.get('agentActivity')
    if (!runId || !store) return false
    for (const item of items) store.upsertCompactionActivity(runId, { ...item, timestamp: new Date(item.timestamp) })
    return true
  }, COMPACTIONS)
  if (!applied) throw new Error('activity store or active run unavailable')
  await page.waitForTimeout(600)
}
const seedAddFailure = async page => {
  const applied = await page.evaluate(() => {
    const pinia = document.querySelector('#__nuxt')?.__vue_app__?.config?.globalProperties?.$pinia
    const context = pinia?._s.get('activeContext')?.activeWorkspaceTarget?.context
    if (!context) return false
    context.collaboratorAddFailure = Object.freeze({ name: 'Documentation Writer', reason: 'The synthetic node could not start this collaborator.' })
    return true
  })
  if (!applied) throw new Error('active composer context unavailable')
  await page.waitForTimeout(500)
}
const runComposer = async page => { await page.locator('textarea.composer-text').last().click(); await page.waitForTimeout(300) }

export const FLOWS = {
  'CHT-001': { title: 'New chat: open workspace menu', path: '/chat', steps: [openWorkspace] },
  'CHT-002': { title: 'New chat: workspace menu search filters', path: '/chat', steps: [openWorkspace, fill('Search workspaces', 'proto')] },
  'CHT-003': { title: 'New chat: choose an existing workspace', path: '/chat', steps: [openWorkspace, text('prototype-workspace')] },
  'CHT-004': { title: 'New chat: open another folder, relative path validation', path: '/chat', steps: [openWorkspace, text('Open another folder…'), fill('/Users/you/project', 'relative/folder'), role('button', 'Use folder')] },
  'CHT-005': { title: 'New chat: open model menu', path: '/chat', steps: [openModel] },
  'CHT-006': { title: 'New chat: model menu search', path: '/chat', steps: [openModel, fill('Search models', 'reason')] },
  'CHT-007': { title: 'New chat: choose the thinking-capable model (thinking control appears)', path: '/chat', steps: [pickReasoning] },
  'CHT-008': { title: 'New chat: open thinking menu', path: '/chat', steps: [pickReasoning, openThinking] },
  'CHT-009': { title: 'New chat: choose a thinking effort', path: '/chat', steps: [pickReasoning, openThinking, text('High')] },
  'CHT-010': { title: 'New chat: toggle auto-approve to ask first', path: '/chat', steps: [role('button', /Auto-approve tools is on/)] },
  'CHT-011': { title: 'New chat: / opens the skill menu', path: '/chat', steps: [focusComposer, typeKeys('/')] },
  'CHT-012': { title: 'New chat: choose a skill (tag chip)', path: '/chat', steps: [focusComposer, typeKeys('/'), press('Enter')] },
  'CHT-013': { title: 'New chat: @ opens the agent/team menu', path: '/chat', steps: [focusComposer, typeKeys('@')] },
  'CHT-014': { title: 'New chat: address a team with @', path: '/chat', steps: [focusComposer, typeKeys('@'), text('Product Review Team')] },
  'CHT-015': { title: 'New chat: address another agent with @', path: '/chat', steps: [focusComposer, typeKeys('@'), text('Documentation Writer')] },
  'CHT-016': { title: 'New chat: type a message (send enabled)', path: '/chat', steps: [focusComposer, typeKeys('Summarize the synthetic baseline.')] },
  'CHT-017': { title: 'New chat: send opens the chat run view', path: '/chat', steps: [focusComposer, typeKeys('Summarize the synthetic baseline.'), press('Enter')], settleMs: 2500 },
  'CHT-018': { title: 'Chat nav item from Agents opens New chat', path: '/agents?view=list', steps: [text('Chat')] },
  'CHT-019': { title: 'Collapse the left panel from the Chat row', path: '/chat', steps: [role('button', 'Collapse left panel')] },
  'CHT-020': { title: 'New chat (pencil) from the Workspaces page', path: '/workspace', steps: [role('button', 'New chat')] },
  'CHT-021': { title: 'New chat: model menu runtime drill-in lists models', path: '/chat', steps: [openModel, async page => { await page.locator('[data-test="chat-runtime-autobyteus"]').first().click(); await page.waitForTimeout(700) }] },
  'CHT-022': { title: 'Chat run: open run settings (Edit Config)', path: '/chat', steps: [sendFirst, role('button', 'Edit Config')] },
  'CHT-023': { title: 'Chat run: header + starts a New chat', path: '/chat', steps: [sendFirst, role('button', 'New Agent')] },
  // WEB-BASELINE-REFRESH-004 (0a32261): a live chat run's composer offers `@`, so its placeholder
  // reads "Ask anything · @ for an agent or team"; the composer is located as the run textarea.
  'CHT-024': { title: 'Chat run: reply in the run composer', path: '/chat', steps: [sendFirst, async page => { await page.locator('textarea.composer-text').last().fill('Add the open questions.'); await page.waitForTimeout(600) }, press('Enter')], settleMs: 1500 },
  'CHT-025': { title: 'Chat run: right tool shell Files tab', path: '/chat', steps: [sendFirst, text('Files')] },
  'CHT-026': { title: 'Chat run: collapse the right tool shell', path: '/chat', steps: [sendFirst, role('button', 'Toggle Sidebar')] },
  'CHT-027': { title: 'Chat run: reopen the chat from the Workspaces tree after leaving', path: '/chat', steps: [sendFirst, text('Agents'), text('Summarize the synthetic baseline.')], settleMs: 1500 },
  'CHT-028': { title: 'Workspaces tree: + on the Daily Assistant row after a chat opens a New chat preset to it', path: '/chat', steps: [sendFirst, role('button', 'New run with this agent')] },
  'CHT-029': { title: 'Chat run: / skill menu in the run composer', path: '/chat', steps: [sendFirst, async page => { await page.locator('textarea.composer-text').last().click(); await page.keyboard.type('/'); await page.waitForTimeout(700) }] },
  'CHT-032': { title: 'Chat run: @ opens the live-run mention menu (0a32261)', path: '/chat', steps: [sendFirst, async page => { await page.locator('textarea.composer-text').last().click(); await page.keyboard.type('@'); await page.waitForTimeout(800) }] },
  'CHT-033': { title: 'Chat run: a reply with an @ mention shows the inline mention chip (0a32261)', path: '/chat', steps: [sendFirst, runComposer, typeKeys('@Doc'), press('Enter'), typeKeys('please review.'), press('Enter')], settleMs: 1500 },
  'CHT-034': { title: 'Chat run: collaborator add-failure notice above the composer (0a32261)', path: '/chat', steps: [sendFirst, seedAddFailure] },
  'CHT-035': { title: 'Chat run: dismiss the collaborator add-failure notice', path: '/chat', steps: [sendFirst, seedAddFailure, async page => { await page.locator('[data-test="collaborator-add-failure-dismiss"]').first().click(); await page.waitForTimeout(400) }] },
  'CMP-001': { title: 'Chat run: compaction status rows (completed, failed, stopped, started) (0a32261)', path: '/chat', steps: [sendFirst, seedCompactions] },
  'CMP-002': { title: 'Chat run: Activity tab compaction items', path: '/chat', steps: [sendFirst, seedCompactions, openActivityTab] },
  // Narrow viewport: the composer menus become bottom sheets (sampled).
  'CHT-030': { title: 'New chat (390x844): model menu as a bottom sheet', path: '/chat', viewport: { width: 390, height: 844 }, steps: [openModel] },
  'CHT-031': { title: 'New chat (390x844): workspace menu as a bottom sheet', path: '/chat', viewport: { width: 390, height: 844 }, steps: [openWorkspace] },
  'BGT-001': { title: 'Chat run: Activity tab shows Background Tasks (collapsed, 0 running) above Activity', path: '/chat', steps: [sendFirst, openActivityTab] },
  'BGT-002': { title: 'Chat run: expand Background Tasks, empty state', path: '/chat', steps: [sendFirst, openActivityTab, toggleBackgroundTasks] },
  'BGT-003': { title: 'Chat run: task snapshots arrive, collapsed header counts update', path: '/chat', steps: [sendFirst, openActivityTab, seedTasks] },
  'BGT-004': { title: 'Chat run: Background Tasks list (running, completed, failed, stopped; untitled fallback)', path: '/chat', steps: [sendFirst, openActivityTab, seedTasks, toggleBackgroundTasks] },
  'BGT-005': { title: 'Chat run: expand a finished task summary', path: '/chat', steps: [sendFirst, openActivityTab, seedTasks, toggleBackgroundTasks, async page => { await page.locator('[data-test="background-task-summary"]').first().click(); await page.waitForTimeout(400) }] },
  'BGT-006': { title: 'Chat run: collapse Background Tasks again (both sections collapsed)', path: '/chat', steps: [sendFirst, openActivityTab, seedTasks, toggleBackgroundTasks, toggleBackgroundTasks] },
  'BGT-007': { title: 'Chat run: tasks arriving on the Files tab do not switch tabs (To-Do auto-switch removed)', path: '/chat', steps: [sendFirst, openActivityTab, text('Files'), seedTasks] },
  'BGT-008': { title: 'Stored team run: Activity tab Background Tasks for the focused member', path: '/workspace', steps: [openStoredTeamRun, openActivityTab, seedTasks, toggleBackgroundTasks] },
  'BGT-009': { title: 'Stored team run (zh-CN): Background Tasks list', path: '/workspace', locale: 'zh-CN', steps: [openStoredTeamRun, openActivityTab, seedTasks, toggleBackgroundTasks] },
  'BGT-010': { title: 'Chat run: shell tasks show their command after the kind label (10fb695)', path: '/chat', steps: [sendFirst, openActivityTab, seedCommandTasks, toggleBackgroundTasks] },
  'BGT-011': { title: 'Chat run: a long command expands on click', path: '/chat', steps: [sendFirst, openActivityTab, seedCommandTasks, toggleBackgroundTasks, clickCommand(2)] },
  'BGT-012': { title: 'Chat run: an expanded command collapses again', path: '/chat', steps: [sendFirst, openActivityTab, seedCommandTasks, toggleBackgroundTasks, clickCommand(2), clickCommand(2)] },
  'BGT-013': { title: 'Chat run: the command expands independently of the finished task summary', path: '/chat', steps: [sendFirst, openActivityTab, seedCommandTasks, toggleBackgroundTasks, clickCommand(1)] },
  'BGT-014': { title: 'Stored team run (zh-CN): shell task commands', path: '/workspace', locale: 'zh-CN', steps: [openStoredTeamRun, openActivityTab, seedCommandTasks, toggleBackgroundTasks] },
  'BGT-015': { title: 'Chat run (390x844): shell task commands', path: '/chat', viewport: { width: 390, height: 844 }, steps: [sendFirst, async page => { await page.getByRole('button', { name: /^Activity$/ }).first().click(); await page.waitForTimeout(800) }, seedCommandTasks, toggleBackgroundTasks] },
  'SKL-001': { title: 'Skills: name-issues banner expands details', path: '/skills', scenario: 'skill_name_issues', steps: [role('button', 'Show details')] },
}

const requested = process.argv.slice(2)
const selected = requested.length ? requested : Object.keys(FLOWS)
await fetch(`${MOCK}/__prototype/scenario`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scenario: 'populated', operationFailures: {} }) })
const browser = await chromium.launch({ headless: true, executablePath: CHROME, args: ['--no-sandbox', '--disable-background-networking', '--font-render-hinting=none'] })
await mkdir(resolve(OUT, 'source'), { recursive: true }); await mkdir(resolve(OUT, 'prototype'), { recursive: true })

async function run(base, target, id) {
  const flow = FLOWS[id]
  await fetch(`${MOCK}/__prototype/scenario`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scenario: flow.scenario || 'populated', operationFailures: {} }) })
  const ctx = await browser.newContext({ viewport: flow.viewport || { width: 1440, height: 900 }, locale: flow.locale === 'zh-CN' ? 'zh-CN' : 'en-US', colorScheme: 'light', reducedMotion: 'reduce', timezoneId: 'UTC' })
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
  await ctx.addInitScript(({ scenario, locale }) => {
    if (sessionStorage.getItem('__flow_init')) return
    sessionStorage.setItem('__flow_init', '1')
    localStorage.clear()
    localStorage.setItem('autobyteus.localization.preference-mode', locale)
    localStorage.setItem('autobyteus.prototype.scenario', scenario)
    localStorage.setItem('autobyteus.prototype.context', 'desktop')
  }, { scenario: flow.scenario || 'populated', locale: flow.locale || 'en' })
  const page = await ctx.newPage()
  page.setDefaultTimeout(10000)
  const errors = []
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`))
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
  const text = await page.locator('body').innerText()
  // Draft run ids embed Date.now() (`temp-<ms>-<n>`); compare them by shape.
  const route = (await page.evaluate(() => location.pathname + location.search)).replace(/temp-\d+-/g, 'temp-<ms>-')
  await ctx.close()
  return { file, text, route, errors, stepError, external }
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
  const viewport = FLOWS[id].viewport || { width: 1440, height: 900 }
  const total = viewport.width * viewport.height
  const noise = d.changed === 0 ? 'exact' : (d.changed / total <= 0.0001 && d.max <= 64) ? 'A-edge-antialiasing' : (d.low / d.changed >= 0.99 && d.max <= 16) ? 'B-compositing-rounding' : null
  const pass = !s.stepError && !p.stepError && s.text === p.text && s.route === p.route && Boolean(noise) && p.errors.length === 0 && p.external.length === 0
  results.push({ id, title: FLOWS[id].title, pass, noise, pixels: d, route: [s.route, p.route], textEqual: s.text === p.text, sourceStepError: s.stepError, prototypeStepError: p.stepError, sourceErrors: s.errors, prototypeErrors: p.errors, prototypeExternal: p.external })
  console.log(`${pass ? 'PASS' : 'FAIL'} ${id} ${FLOWS[id].title} text=${s.text === p.text} px=${d.changed} max=${d.max} ${s.stepError ? 'SRC-STEP ' + s.stepError : ''} ${p.stepError ? 'PROTO-STEP ' + p.stepError : ''} srcErr=${s.errors.length} protoErr=${p.errors.length}`)
  if (!pass && process.env.VERBOSE) {
    const sl = s.text.split('\n'), pl = p.text.split('\n'); const ps = new Set(pl), ss = new Set(sl)
    console.log('  source-only:', JSON.stringify(sl.filter(x => !ps.has(x)).slice(0, 12)))
    console.log('  proto-only :', JSON.stringify(pl.filter(x => !ss.has(x)).slice(0, 12)))
    if (s.errors.length) console.log('  srcErr', JSON.stringify(s.errors.slice(0, 3)))
    if (p.errors.length) console.log('  protoErr', JSON.stringify(p.errors.slice(0, 3)))
  }
}
await writeFile(resolve(OUT, `flow-results${process.env.RESULT_TAG ? '-' + process.env.RESULT_TAG : ''}.json`), JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2))
await browser.close()
