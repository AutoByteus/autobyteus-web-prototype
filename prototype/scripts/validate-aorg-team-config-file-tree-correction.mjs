#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { chromium } from 'playwright-core'
import sharp from 'sharp'
import { applyExperienceScenario } from '../shared/apply-experience-scenario.js'

const root = resolve(new URL('../..', import.meta.url).pathname)
const sourceBaseUrl = process.env.SOURCE_BASE_URL || 'http://127.0.0.1:4283'
const prototypeBaseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4183'
const mockBaseUrl = process.env.MOCK_BASE_URL || 'http://127.0.0.1:4383'
const outputRoot = resolve(root, 'evidence/AORG-FLAT-TEAM-001/baseline-correction-2')
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
    id: 'UXV-CORR-TEAM-RUN-CONFIG-001',
    inventoryId: 'UXB-CORR-TEAM-RUN-CONFIG-001',
    scenario: 'workspace_team_run_config_correction',
    name: 'Editable Team run configuration with missing-workspace feedback',
    action: 'team-config-required',
  },
  {
    id: 'UXV-CORR-TEAM-RUN-CONFIG-002',
    inventoryId: 'UXB-CORR-TEAM-RUN-CONFIG-001',
    scenario: 'workspace_team_run_config_correction',
    name: 'Inspectable Team member override disclosure',
    action: 'team-config-members',
  },
  {
    id: 'UXV-CORR-TEAM-RUN-CONFIG-003',
    inventoryId: 'UXB-CORR-TEAM-RUN-CONFIG-001',
    scenario: 'workspace_team_run_config_correction',
    name: 'Chosen workspace makes the Team configuration launch-ready',
    action: 'team-config-ready',
  },
  {
    id: 'UXV-CORR-TEAM-RUN-CONFIG-004',
    inventoryId: 'UXB-CORR-TEAM-RUN-CONFIG-001',
    scenario: 'workspace_team_run_config_correction',
    name: 'Team auto-approve control updates the draft visibly',
    action: 'team-config-auto-approve',
  },
  {
    id: 'UXV-CORR-TEAM-RUN-CONFIG-005',
    inventoryId: 'UXB-CORR-TEAM-RUN-CONFIG-001',
    scenario: 'workspace_team_active',
    name: 'Selected existing Team run configuration is read-only',
    action: 'team-config-read-only',
  },
  {
    id: 'UXV-CORR-WORKSPACE-FILE-TREE-001',
    inventoryId: 'UXB-CORR-WORKSPACE-FILE-TREE-001',
    scenario: 'workspace_file_tree_correction',
    name: 'Populated workspace tree and active Markdown preview',
    action: 'file-tree-populated',
  },
  {
    id: 'UXV-CORR-WORKSPACE-FILE-TREE-002',
    inventoryId: 'UXB-CORR-WORKSPACE-FILE-TREE-001',
    scenario: 'workspace_file_tree_correction',
    name: 'Workspace folder collapse hides descendants',
    action: 'file-tree-collapsed',
  },
  {
    id: 'UXV-CORR-WORKSPACE-FILE-TREE-003',
    inventoryId: 'UXB-CORR-WORKSPACE-FILE-TREE-001',
    scenario: 'workspace_file_tree_correction',
    name: 'Workspace file selection updates the active row, tab, and preview',
    action: 'file-tree-file-selected',
  },
  {
    id: 'UXV-CORR-WORKSPACE-FILE-TREE-004',
    inventoryId: 'UXB-CORR-WORKSPACE-FILE-TREE-001',
    scenario: 'workspace_file_tree_correction',
    name: 'Workspace folder context menu exposes the exact source actions',
    action: 'file-tree-context-menu',
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
    if (url.protocol === 'data:' || url.protocol === 'blob:' || ['127.0.0.1', 'localhost'].includes(url.hostname)) {
      return route.continue()
    }
    return route.abort('blockedbyclient')
  })
}

async function settle(page, waitMs = 350) {
  await page.waitForFunction(() => document.body?.innerText.trim().length > 0, undefined, { timeout: 20_000 })
  await page.waitForTimeout(waitMs)
  await page.addStyleTag({ content: normalizedStyle })
  await page.waitForTimeout(80)
}

const docsRow = page => page.locator('.file-item').filter({ has: page.getByText('docs', { exact: true }) }).first()
const evidenceRow = page => page.locator('.file-item').filter({ has: page.getByText('evidence.md', { exact: true }) }).last()

async function chooseWorkspace(page) {
  await page.getByRole('button', { name: 'Select a workspace...', exact: true }).click()
  await page.locator('li').filter({ hasText: '/synthetic/prototype-workspace' }).click()
  await page.getByText('Workspace: prototype-workspace', { exact: true }).waitFor()
}

async function applyAction(page, testCase) {
  if (testCase.action === 'team-config-members') {
    const toggle = page.locator('[data-test="team-member-overrides-toggle"]')
    await toggle.click()
    await page.locator('[data-test="member-override-item"]').first().waitFor()
  } else if (testCase.action === 'team-config-ready') {
    await chooseWorkspace(page)
  } else if (testCase.action === 'team-config-auto-approve') {
    await chooseWorkspace(page)
    await page.locator('#team-auto-execute').click()
  } else if (testCase.action === 'team-config-read-only') {
    await page.locator('[data-test="workspace-header-edit-config"]').click()
    await page.getByText('Selected team run configuration is read-only. Start a new team run to use different runtime or model settings.', { exact: true }).waitFor()
  } else if (testCase.action === 'file-tree-collapsed') {
    await docsRow(page).click()
    await page.waitForFunction(() => !Array.from(document.querySelectorAll('.file-item')).some(node => node.querySelector('.file-header')?.textContent?.trim() === 'evidence.md'))
  } else if (testCase.action === 'file-tree-file-selected') {
    await evidenceRow(page).click()
    await page.getByRole('heading', { name: 'Evidence report', exact: true }).waitFor()
  } else if (testCase.action === 'file-tree-context-menu') {
    await docsRow(page).click({ button: 'right' })
    await page.locator('.menu-item').filter({ hasText: 'Add File' }).waitFor()
  }
  return page.evaluate(() => {
    const pinia = document.querySelector('#__nuxt')?.__vue_app__?.config?.globalProperties?.$pinia
    const store = id => pinia?._s?.get(id)
    const teamRunConfig = store('teamRunConfig')
    const fileExplorer = store('fileExplorer')
    const fileState = fileExplorer?.fileExplorerStateByWorkspace instanceof Map
      ? fileExplorer.fileExplorerStateByWorkspace.get('workspace-prototype')
      : null
    return {
      teamDraft: teamRunConfig?.selectedDraft ? {
        draftId: teamRunConfig.selectedDraft.draftId,
        workspaceId: teamRunConfig.selectedDraft.config.workspaceId,
        autoExecuteTools: teamRunConfig.selectedDraft.config.autoExecuteTools,
        memberOverrides: teamRunConfig.selectedDraft.config.memberOverrides,
        canLaunch: teamRunConfig.launchReadiness?.canLaunch ?? null,
      } : null,
      fileTree: fileState ? {
        openFolders: { ...fileState.openFolders },
        openFiles: fileState.openFiles.map(file => ({ path: file.path, type: file.type, mode: file.mode })),
        activeFile: fileState.activeFile,
      } : null,
    }
  })
}

const roundedBox = box => box
  ? Object.fromEntries(Object.entries(box).map(([key, value]) => [key, Math.round(value * 1000) / 1000]))
  : null

async function elementEvidence(locator) {
  if (await locator.count() === 0) return null
  return locator.first().evaluate(node => {
    const style = getComputedStyle(node)
    const rect = node.getBoundingClientRect()
    return {
      text: node.innerText,
      role: node.getAttribute('role'),
      ariaExpanded: node.getAttribute('aria-expanded'),
      ariaCurrent: node.getAttribute('aria-current'),
      ariaSelected: node.getAttribute('aria-selected'),
      disabled: 'disabled' in node ? node.disabled : null,
      className: node.getAttribute('class'),
      box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      style: {
        display: style.display,
        color: style.color,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
      },
    }
  })
}

async function captureEvidence(page, testCase, target, actionResult, browserErrors) {
  const screenshotDirectory = resolve(outputRoot, target)
  await mkdir(screenshotDirectory, { recursive: true })
  const screenshotPath = resolve(screenshotDirectory, `${testCase.id}-${target}.png`)
  const screenshot = await page.screenshot({ path: screenshotPath })
  const bodyText = await page.locator('body').innerText()
  const semantic = {
    route: new URL(page.url()).pathname,
    lang: await page.locator('html').getAttribute('lang'),
    activeElement: await page.evaluate(() => ({
      tag: document.activeElement?.tagName || null,
      id: document.activeElement?.id || null,
      dataTest: document.activeElement?.getAttribute?.('data-test') || null,
      text: document.activeElement && /^(BUTTON|A)$/.test(document.activeElement.tagName)
        ? document.activeElement.textContent?.trim() || null
        : null,
    })),
    teamConfig: {
      title: await page.getByText('Team Definition', { exact: true }).count(),
      definition: await page.getByText('Product Review Team', { exact: true }).count(),
      runtimeValue: await page.locator('#team-run-runtime-kind').count() ? await page.locator('#team-run-runtime-kind').inputValue() : null,
      runtimeDisabled: await page.locator('#team-run-runtime-kind').count() ? await page.locator('#team-run-runtime-kind').isDisabled() : null,
      autoApprove: await elementEvidence(page.locator('#team-auto-execute')),
      memberToggle: await elementEvidence(page.locator('[data-test="team-member-overrides-toggle"]')),
      memberRows: await page.locator('[data-test="member-override-item"]').allInnerTexts(),
      blockingIssue: bodyText.includes('Workspace is required to run a team.'),
      readyWorkspace: bodyText.includes('Workspace: prototype-workspace'),
      readOnlyNotice: bodyText.includes('Selected team run configuration is read-only. Start a new team run to use different runtime or model settings.'),
      runDisabled: await page.getByRole('button', { name: 'Run Team', exact: true }).count()
        ? await page.getByRole('button', { name: 'Run Team', exact: true }).isDisabled()
        : null,
    },
    fileTree: {
      rows: await page.locator('.file-item').evaluateAll(nodes => nodes.map(node => ({
        text: node.querySelector('.file-header')?.textContent?.trim() || '',
        className: node.getAttribute('class'),
      }))),
      docs: await elementEvidence(docsRow(page)),
      evidence: await elementEvidence(evidenceRow(page)),
      activeTabs: await page.locator('#contentViewer').count() ? await page.locator('#contentViewer').innerText() : '',
      markdownRequirements: await page.getByRole('heading', { name: 'Prototype requirements', exact: true }).count(),
      markdownEvidence: await page.getByRole('heading', { name: 'Evidence report', exact: true }).count(),
      contextMenu: await page.locator('.menu-item').allInnerTexts(),
    },
  }
  const geometry = {
    viewport,
    left: roundedBox(await page.locator('[data-test="app-left-panel-shell"]').boundingBox()),
    center: roundedBox(await page.locator('[data-test="workspace-center-pane"]').boundingBox()),
    right: roundedBox(await page.locator('[data-test="workspace-right-panel"]').boundingBox()),
    fileExplorer: roundedBox(await page.locator('.file-explorer').count()
      ? await page.locator('.file-explorer').boundingBox()
      : null),
    teamForm: roundedBox(await page.locator('[data-test="team-member-overrides-toggle"]').count()
      ? await page.locator('[data-test="team-member-overrides-toggle"]').boundingBox()
      : null),
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
  await context.addInitScript(scenario => {
    localStorage.clear()
    localStorage.setItem('autobyteus.localization.preference-mode', 'en')
    localStorage.setItem('autobyteus.prototype.scenario', scenario)
    localStorage.setItem('autobyteus.prototype.context', 'desktop')
    localStorage.setItem('autobyteus.prototype.deferExperienceScenario', '1')
    localStorage.setItem('autobyteus.app-left-panel.primary-nav-height', '240')
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
          this.onmessage?.(new MessageEvent('message', { data: JSON.stringify({ type: 'CONNECTED', payload: { session_id: 'aorg-correction-2' } }) }))
        })
      }
      send() {}
      close() {
        this.readyState = ControlledFileExplorerWebSocket.CLOSED
        this.onclose?.(new CloseEvent('close', { code: 1000, reason: 'aorg correction 2' }))
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
  await settle(page, 300)
  const result = await captureEvidence(page, testCase, target, actionResult, browserErrors)
  await context.close()
  return result
}

async function compareScreenshots(sourcePath, prototypePath, diffPath) {
  const [source, prototype] = await Promise.all([
    sharp(sourcePath).removeAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(prototypePath).removeAlpha().raw().toBuffer({ resolveWithObject: true }),
  ])
  if (source.info.width !== prototype.info.width || source.info.height !== prototype.info.height || source.info.channels !== prototype.info.channels) {
    return { sameDimensions: false, changedPixels: null, changedPixelRatio: null, maximumChannelDelta: null, normalizedRenderingNoiseOnly: false, diffPath: null }
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
  inventory: Object.fromEntries(
    ['UXB-CORR-TEAM-RUN-CONFIG-001', 'UXB-CORR-WORKSPACE-FILE-TREE-001'].map(inventoryId => [
      inventoryId,
      results.filter(result => result.inventoryId === inventoryId).every(result => result.result === 'Pass') ? 'Pass' : 'Fail',
    ]),
  ),
}
await writeFile(resolve(outputRoot, 'aorg-team-config-file-tree-correction-results.json'), `${JSON.stringify(results, null, 2)}\n`)
await writeFile(resolve(outputRoot, 'aorg-team-config-file-tree-correction-summary.json'), `${JSON.stringify(summary, null, 2)}\n`)
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`)
if (summary.result !== 'Pass') process.exitCode = 1
