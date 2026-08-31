#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { chromium } from 'playwright-core'
import sharp from 'sharp'
import { applyExperienceScenario } from '../shared/apply-experience-scenario.js'

const root = resolve(new URL('../..', import.meta.url).pathname)
const sourceBaseUrl = process.env.SOURCE_BASE_URL || 'http://127.0.0.1:4282'
const prototypeBaseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4180'
const mockBaseUrl = process.env.MOCK_BASE_URL || 'http://127.0.0.1:4382'
const outputRoot = resolve(root, 'evidence/AORG-FLAT-TEAM-001/baseline-correction')
const require = createRequire(import.meta.url)
const iconCollections = Object.fromEntries(
  ['heroicons', 'ph', 'mdi', 'svg-spinners', 'vscode-icons', 'logos']
    .map(prefix => [prefix, require(`@iconify-json/${prefix}/icons.json`)]),
)
const monacoRoot = resolve(root, 'node_modules/monaco-editor/min/vs')
const viewport = { width: 1440, height: 900 }
const sha256 = value => createHash('sha256').update(value).digest('hex')
const normalizedStyle = [
  '*,*::before,*::after{',
  'animation:none!important;',
  'transition:none!important;',
  'caret-color:transparent!important;',
  'scroll-behavior:auto!important;',
  '}',
].join('')

const cases = [
  {
    id: 'UXV-CORR-TASK-AGENT-001',
    inventoryId: 'UXB-CORR-TASK-AGENT-001',
    scenario: 'workspace_team_task_agent',
    name: 'Transient Task Agent row nested beneath its logical member',
    action: 'task-agent-visible',
  },
  {
    id: 'UXV-CORR-TASK-AGENT-002',
    inventoryId: 'UXB-CORR-TASK-AGENT-001',
    scenario: 'workspace_team_task_agent',
    name: 'Task Agent selection focuses the exact temporary AgentRun conversation',
    action: 'task-agent-selected',
  },
  {
    id: 'UXV-CORR-TASK-TEAM-001',
    inventoryId: 'UXB-CORR-TASK-TEAM-001',
    scenario: 'workspace_team_task_team',
    name: 'Transient Task Team is a collapsed disclosure row by default',
    action: 'task-team-collapsed',
  },
  {
    id: 'UXV-CORR-TASK-TEAM-002',
    inventoryId: 'UXB-CORR-TASK-TEAM-001',
    scenario: 'workspace_team_task_team',
    name: 'Task Team disclosure reveals the concrete child AgentRun',
    action: 'task-team-expanded',
  },
  {
    id: 'UXV-CORR-TASK-TEAM-003',
    inventoryId: 'UXB-CORR-TASK-TEAM-001',
    scenario: 'workspace_team_task_team',
    name: 'Task Team child selection focuses its exact conversation',
    action: 'task-team-child-selected',
  },
]

async function selectBackendScenario() {
  const response = await fetch(`${mockBaseUrl}/__prototype/scenario`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ scenario: 'populated', operationFailures: {} }),
  })
  if (!response.ok) throw new Error('Unable to select the controlled source observer fixture')
}

async function installNetworkBoundary(context) {
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('/monaco-editor@') && url.pathname.includes('/min/vs/')) {
      const relative = url.pathname.split('/min/vs/')[1]
      try {
        const body = await readFile(resolve(monacoRoot, relative))
        const contentType = relative.endsWith('.css')
          ? 'text/css'
          : relative.endsWith('.ttf')
            ? 'font/ttf'
            : relative.endsWith('.json')
              ? 'application/json'
              : 'text/javascript'
        return route.fulfill({ status: 200, contentType, body })
      } catch {
        return route.fulfill({ status: 404, body: 'missing local Monaco asset' })
      }
    }
    if (['api.iconify.design', 'api.simplesvg.com', 'api.unisvg.com'].includes(url.hostname)) {
      const prefix = url.pathname.split('/').pop()?.replace(/\.json$/, '')
      if (prefix && iconCollections[prefix]) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(iconCollections[prefix]),
        })
      }
    }
    if (
      url.protocol === 'data:'
      || url.protocol === 'blob:'
      || ['127.0.0.1', 'localhost'].includes(url.hostname)
    ) return route.continue()
    return route.abort('blockedbyclient')
  })
}

async function settle(page, waitMs = 350) {
  await page.waitForFunction(() => document.body?.innerText.trim().length > 0, undefined, { timeout: 20_000 })
  await page.waitForTimeout(waitMs)
  await page.addStyleTag({ content: normalizedStyle })
  await page.waitForTimeout(80)
}

const transientRows = page => page.locator('[data-test="workspace-team-transient-execution-row"]')
const taskAgentRow = page => transientRows(page).filter({ has: page.getByText('Task: Audit prototype dependency licenses', { exact: true }) })
const taskTeamRow = page => transientRows(page).filter({ has: page.getByText('Task: Review the implementation as a Team', { exact: true }) })
const taskTeamChildRow = page => transientRows(page).filter({ has: page.getByText('reviewer', { exact: true }) })

async function applyAction(page, testCase) {
  if (testCase.action.startsWith('task-agent')) {
    const writerDisclosure = page.locator(
      '[data-test="workspace-team-member-disclosure"][data-member-address="/product-review/evidence-writer"]',
    )
    await writerDisclosure.waitFor()
    await writerDisclosure.click()
    await taskAgentRow(page).waitFor()
    if (testCase.action === 'task-agent-selected') {
      await taskAgentRow(page).click()
      await page.getByText('The dedicated license audit is in progress.', { exact: true }).waitFor()
    }
    return {
      writerExpanded: await writerDisclosure.getAttribute('aria-expanded'),
      transientKinds: await transientRows(page).evaluateAll(nodes => nodes.map(node => node.getAttribute('data-transient-kind'))),
      taskAgentSelected: await taskAgentRow(page).getAttribute('aria-current'),
      focusedAgentRunId: await focusedAgentRunId(page),
      dedicatedConversationVisible: await page.getByText('The dedicated license audit is in progress.', { exact: true }).count() === 1,
    }
  }

  const teamRow = taskTeamRow(page)
  await teamRow.waitFor()
  if (testCase.action === 'task-team-expanded' || testCase.action === 'task-team-child-selected') {
    await teamRow.click()
    await taskTeamChildRow(page).waitFor()
  }
  if (testCase.action === 'task-team-child-selected') {
    await taskTeamChildRow(page).click()
    await page.getByText('The temporary review Team is checking the implementation.', { exact: true }).waitFor()
  }
  return {
    taskTeamExpanded: await teamRow.locator('[data-test="workspace-team-transient-disclosure"]').getAttribute('aria-expanded'),
    transientKinds: await transientRows(page).evaluateAll(nodes => nodes.map(node => node.getAttribute('data-transient-kind'))),
    taskTeamChildSelected: await taskTeamChildRow(page).count()
      ? await taskTeamChildRow(page).getAttribute('aria-current')
      : null,
    focusedAgentRunId: await focusedAgentRunId(page),
    childConversationVisible: await page.getByText('The temporary review Team is checking the implementation.', { exact: true }).count() === 1,
  }
}

async function focusedAgentRunId(page) {
  return page.evaluate(() => {
    const pinia = document.querySelector('#__nuxt')?.__vue_app__?.config?.globalProperties?.$pinia
    const teams = pinia?._s?.get('agentTeamContexts')
    const selected = pinia?._s?.get('agentSelection')
    const teamRunId = selected?.selectedTeamRunId || selected?.selectedRunId
    return teams?.teams?.get(teamRunId)?.view?.getFocusedAgentRunId?.() || null
  })
}

const roundedBox = box => box
  ? Object.fromEntries(Object.entries(box).map(([key, value]) => [key, Math.round(value * 1000) / 1000]))
  : null

async function rowEvidence(row) {
  if (await row.count() === 0) return null
  return row.first().evaluate(node => {
    const style = getComputedStyle(node)
    const label = node.querySelector('.node-label .truncate, .truncate')
    const labelStyle = label ? getComputedStyle(label) : null
    const rect = node.getBoundingClientRect()
    return {
      text: node.innerText,
      kind: node.getAttribute('data-transient-kind'),
      memberAddress: node.getAttribute('data-member-address'),
      title: node.getAttribute('title'),
      ariaLabel: node.getAttribute('aria-label'),
      ariaCurrent: node.getAttribute('aria-current'),
      role: node.getAttribute('role'),
      box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      style: {
        display: style.display,
        marginLeft: style.marginLeft,
        paddingLeft: style.paddingLeft,
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderColor: style.borderColor,
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
      },
      labelStyle: labelStyle ? {
        display: labelStyle.display,
        overflow: labelStyle.overflow,
        whiteSpace: labelStyle.whiteSpace,
        textOverflow: labelStyle.textOverflow,
      } : null,
    }
  })
}

async function captureEvidence(page, testCase, target, actionResult, browserErrors) {
  const leftPanel = page.locator('[data-test="app-left-panel-shell"]')
  const center = page.locator('[data-test="workspace-center-pane"]')
  await leftPanel.waitFor()
  await center.waitFor()
  const leftBox = await leftPanel.boundingBox()
  const centerBox = await center.boundingBox()
  if (!leftBox || !centerBox) throw new Error('Correction evidence boundary is unavailable')
  const clip = {
    x: Math.floor(Math.min(leftBox.x, centerBox.x)),
    y: Math.floor(Math.min(leftBox.y, centerBox.y)),
    width: Math.ceil(Math.max(leftBox.x + leftBox.width, centerBox.x + centerBox.width) - Math.min(leftBox.x, centerBox.x)),
    height: Math.ceil(Math.max(leftBox.y + leftBox.height, centerBox.y + centerBox.height) - Math.min(leftBox.y, centerBox.y)),
  }
  const directory = resolve(outputRoot, target)
  await mkdir(directory, { recursive: true })
  const screenshotPath = resolve(directory, `${testCase.id}-${target}.png`)
  const screenshot = await page.screenshot({ path: screenshotPath, clip })
  const taskAgent = await rowEvidence(taskAgentRow(page))
  const taskTeam = await rowEvidence(taskTeamRow(page))
  const taskTeamChild = await rowEvidence(taskTeamChildRow(page))
  const semantic = {
    route: new URL(page.url()).pathname,
    lang: await page.locator('html').getAttribute('lang'),
    transientKinds: await transientRows(page).evaluateAll(nodes => nodes.map(node => node.getAttribute('data-transient-kind'))),
    transientTexts: await transientRows(page).evaluateAll(nodes => nodes.map(node => node.innerText)),
    taskAgent,
    taskTeam,
    taskTeamChild,
    focusedAgentRunId: await focusedAgentRunId(page),
    eventMonitorText: await page.locator('[data-testid="agent-event-monitor"]').innerText(),
    exactConversation: {
      taskAgent: await page.getByText('The dedicated license audit is in progress.', { exact: true }).count(),
      taskTeamChild: await page.getByText('The temporary review Team is checking the implementation.', { exact: true }).count(),
    },
  }
  const geometry = {
    clip,
    leftPanel: roundedBox(leftBox),
    center: roundedBox(centerBox),
    eventMonitor: roundedBox(await page.locator('[data-testid="agent-event-monitor"]').boundingBox()),
  }
  return {
    id: testCase.id,
    inventoryId: testCase.inventoryId,
    name: testCase.name,
    scenario: testCase.scenario,
    target,
    viewport,
    screenshotPath,
    screenshotSha256: sha256(screenshot),
    semantic,
    semanticSha256: sha256(JSON.stringify(semantic)),
    geometry,
    geometrySha256: sha256(JSON.stringify(geometry)),
    actionResult,
    actionResultSha256: sha256(JSON.stringify(actionResult)),
    browserErrors,
  }
}

async function capture(browser, baseUrl, target, testCase) {
  const context = await browser.newContext({
    viewport,
    locale: 'en-US',
    colorScheme: 'light',
    reducedMotion: 'reduce',
    timezoneId: 'UTC',
  })
  await installNetworkBoundary(context)
  await context.addInitScript((scenario) => {
    localStorage.clear()
    localStorage.setItem('autobyteus.localization.preference-mode', 'en')
    localStorage.setItem('autobyteus.prototype.scenario', scenario)
    localStorage.setItem('autobyteus.prototype.context', 'desktop')
    localStorage.setItem('autobyteus.prototype.deferExperienceScenario', '1')
    const NativeWebSocket = window.WebSocket
    class ControlledFileExplorerWebSocket extends EventTarget {
      static CONNECTING = 0; static OPEN = 1; static CLOSING = 2; static CLOSED = 3
      CONNECTING = 0; OPEN = 1; CLOSING = 2; CLOSED = 3
      protocol = ''; extensions = ''; bufferedAmount = 0; binaryType = 'blob'
      readyState = ControlledFileExplorerWebSocket.CONNECTING
      onopen = null; onclose = null; onerror = null; onmessage = null
      constructor(url) {
        super()
        this.url = String(url)
        queueMicrotask(() => {
          this.readyState = ControlledFileExplorerWebSocket.OPEN
          this.onopen?.(new Event('open'))
          this.onmessage?.(new MessageEvent('message', {
            data: JSON.stringify({ type: 'CONNECTED', payload: { session_id: 'aorg-baseline-correction' } }),
          }))
        })
      }
      send() {}
      close() {
        this.readyState = ControlledFileExplorerWebSocket.CLOSED
        this.onclose?.(new CloseEvent('close', { code: 1000, reason: 'aorg baseline correction' }))
      }
    }
    const ControlledWebSocket = function (url, protocols) {
      if (String(url).includes('/ws/file-explorer/')) return new ControlledFileExplorerWebSocket(url)
      return protocols === undefined ? new NativeWebSocket(url) : new NativeWebSocket(url, protocols)
    }
    Object.assign(ControlledWebSocket, { CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 })
    ControlledWebSocket.prototype = NativeWebSocket.prototype
    window.WebSocket = ControlledWebSocket
  }, testCase.scenario)
  const page = await context.newPage()
  const browserErrors = []
  page.on('pageerror', error => browserErrors.push(`pageerror: ${error.message}`))
  page.on('console', message => {
    if (message.type() === 'error') browserErrors.push(`console: ${message.text()}`)
  })
  await page.goto(`${baseUrl}/workspace`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await settle(page, 900)
  await page.waitForFunction(
    () => Boolean(document.querySelector('#__nuxt')?.__vue_app__?.config?.globalProperties?.$pinia?._s),
    undefined,
    { timeout: 20_000 },
  )
  const applied = await page.evaluate(applyExperienceScenario, { scenario: testCase.scenario, context: 'desktop' })
  if (!applied?.applied) throw new Error(`${target} scenario was not applied: ${JSON.stringify(applied)}`)
  await settle(page, 550)
  const actionResult = await applyAction(page, testCase)
  await settle(page, 350)
  const result = await captureEvidence(page, testCase, target, actionResult, browserErrors)
  await context.close()
  return result
}

async function compareScreenshots(sourcePath, prototypePath, diffPath) {
  const [source, prototype] = await Promise.all([
    sharp(sourcePath).removeAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(prototypePath).removeAlpha().raw().toBuffer({ resolveWithObject: true }),
  ])
  if (
    source.info.width !== prototype.info.width
    || source.info.height !== prototype.info.height
    || source.info.channels !== prototype.info.channels
  ) {
    return {
      sameDimensions: false,
      sourceDimensions: source.info,
      prototypeDimensions: prototype.info,
      changedPixels: null,
      totalPixels: null,
      changedPixelRatio: null,
      maximumChannelDelta: null,
      normalizedRenderingNoiseOnly: false,
      diffPath: null,
    }
  }
  const diff = Buffer.alloc(source.data.length)
  let changedPixels = 0
  let maximumChannelDelta = 0
  for (let index = 0; index < source.data.length; index += source.info.channels) {
    let changed = false
    for (let channel = 0; channel < source.info.channels; channel += 1) {
      const delta = Math.abs(source.data[index + channel] - prototype.data[index + channel])
      diff[index + channel] = Math.min(255, delta * 12)
      if (delta > 0) changed = true
      maximumChannelDelta = Math.max(maximumChannelDelta, delta)
    }
    if (changed) changedPixels += 1
  }
  await mkdir(resolve(outputRoot, 'comparison'), { recursive: true })
  await sharp(diff, { raw: source.info }).png().toFile(diffPath)
  const totalPixels = source.info.width * source.info.height
  const changedPixelRatio = changedPixels / totalPixels
  return {
    sameDimensions: true,
    dimensions: { width: source.info.width, height: source.info.height },
    changedPixels,
    totalPixels,
    changedPixelRatio,
    maximumChannelDelta,
    normalizedRenderingNoiseOnly: changedPixelRatio <= 0.0005 && maximumChannelDelta <= 4,
    diffPath,
  }
}

const equalJson = (left, right) => JSON.stringify(left) === JSON.stringify(right)

await mkdir(outputRoot, { recursive: true })
await selectBackendScenario()
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking'],
})

const results = []
try {
  for (const testCase of cases) {
    const source = await capture(browser, sourceBaseUrl, 'source', testCase)
    const prototype = await capture(browser, prototypeBaseUrl, 'prototype', testCase)
    const diffPath = resolve(outputRoot, 'comparison', `${testCase.id}-diff.png`)
    const screenshot = await compareScreenshots(source.screenshotPath, prototype.screenshotPath, diffPath)
    const comparison = {
      semanticExact: equalJson(source.semantic, prototype.semantic),
      geometryExact: equalJson(source.geometry, prototype.geometry),
      actionExact: equalJson(source.actionResult, prototype.actionResult),
      screenshot,
      sourceBrowserErrors: source.browserErrors,
      prototypeBrowserErrors: prototype.browserErrors,
    }
    const pass = comparison.semanticExact
      && comparison.geometryExact
      && comparison.actionExact
      && comparison.screenshot.sameDimensions
      && (comparison.screenshot.changedPixels === 0 || comparison.screenshot.normalizedRenderingNoiseOnly)
      && source.browserErrors.length === 0
      && prototype.browserErrors.length === 0
    results.push({ ...testCase, source, prototype, comparison, result: pass ? 'Pass' : 'Fail' })
    process.stdout.write(`${testCase.id}: ${pass ? 'PASS' : 'FAIL'}\n`)
  }
} finally {
  await browser.close()
}

const passed = results.filter(result => result.result === 'Pass').length
const summary = {
  packageId: 'AORG-FLAT-TEAM-001',
  requestType: 'Correction',
  sourcePin: '8ef282ba77705180d985e7000d801f0e0068cdc1',
  sourceBaseUrl,
  prototypeBaseUrl,
  mockBaseUrl,
  browser: '/usr/bin/chromium',
  viewport,
  generatedAt: new Date().toISOString(),
  passed,
  total: results.length,
  result: passed === results.length ? 'Pass' : 'Fail',
  inventory: {
    'UXB-CORR-TASK-AGENT-001': results.filter(result => result.inventoryId === 'UXB-CORR-TASK-AGENT-001').every(result => result.result === 'Pass') ? 'Pass' : 'Fail',
    'UXB-CORR-TASK-TEAM-001': results.filter(result => result.inventoryId === 'UXB-CORR-TASK-TEAM-001').every(result => result.result === 'Pass') ? 'Pass' : 'Fail',
  },
}
await writeFile(resolve(outputRoot, 'aorg-flat-team-baseline-correction-results.json'), `${JSON.stringify(results, null, 2)}\n`)
await writeFile(resolve(outputRoot, 'aorg-flat-team-baseline-correction-summary.json'), `${JSON.stringify(summary, null, 2)}\n`)
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`)
if (summary.result !== 'Pass') process.exitCode = 1
