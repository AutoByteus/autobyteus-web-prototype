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
const prototypeBaseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4199'
const mockBaseUrl = process.env.MOCK_BASE_URL || 'http://127.0.0.1:4383'
const outputRoot = resolve(root, 'evidence/AORG-FLAT-TEAM-001/team-launch-baseline-refresh')
const require = createRequire(import.meta.url)
const iconCollections = Object.fromEntries(
  ['heroicons', 'ph', 'mdi', 'svg-spinners', 'vscode-icons', 'logos']
    .map(prefix => [prefix, require(`@iconify-json/${prefix}/icons.json`)]),
)
const monacoRoot = resolve(root, 'node_modules/monaco-editor/min/vs')
const sha256 = value => createHash('sha256').update(value).digest('hex')
const normalizedStyle = [
  '*,*::before,*::after{',
  'animation:none!important;',
  'transition:none!important;',
  'caret-color:transparent!important;',
  'scroll-behavior:auto!important;',
  '}',
].join('')

const desktop = { width: 1440, height: 900 }
const narrow = { width: 390, height: 844 }
const allCases = [
  {
    id: 'UXV-TEAM-LAUNCH-REFRESH-001', inventoryId: 'UXB-TEAM-LAUNCH-ROOT-001',
    name: 'Flat AgentTeam launch defaults and blocking workspace feedback', action: 'default', viewport: desktop,
  },
  {
    id: 'UXV-TEAM-LAUNCH-REFRESH-002', inventoryId: 'UXB-TEAM-LAUNCH-ROOT-001',
    name: 'Runtime-scoped model picker with source labels and descriptions', action: 'model-picker', viewport: desktop,
  },
  {
    id: 'UXV-TEAM-LAUNCH-REFRESH-003', inventoryId: 'UXB-TEAM-LAUNCH-WORKSPACE-001',
    name: 'Existing workspace selection makes the AgentTeam launch ready', action: 'workspace-existing', viewport: desktop,
  },
  {
    id: 'UXV-TEAM-LAUNCH-REFRESH-004', inventoryId: 'UXB-TEAM-LAUNCH-WORKSPACE-001',
    name: 'New workspace path authoring controls launch readiness', action: 'workspace-new', viewport: desktop,
  },
  {
    id: 'UXV-TEAM-LAUNCH-REFRESH-005', inventoryId: 'UXB-TEAM-LAUNCH-ROOT-001',
    name: 'Root Auto approve tools switch updates launch intent', action: 'root-auto-approve', viewport: desktop,
  },
  {
    id: 'UXV-TEAM-LAUNCH-REFRESH-006', inventoryId: 'UXB-TEAM-LAUNCH-MEMBERS-001',
    name: 'Keyboard-opened AgentTeam member disclosure with inherited values', action: 'members-inherited', viewport: desktop,
  },
  {
    id: 'UXV-TEAM-LAUNCH-REFRESH-007', inventoryId: 'UXB-TEAM-LAUNCH-MEMBERS-001',
    name: 'Per-Agent auto-approve override and visible customized state', action: 'member-override', viewport: desktop,
  },
  {
    id: 'UXV-TEAM-LAUNCH-REFRESH-008', inventoryId: 'UXB-TEAM-LAUNCH-RESPONSIVE-001',
    name: 'Narrow viewport AgentTeam launch form and recovery feedback', action: 'default', viewport: narrow,
  },
]
const cases = process.env.CASE_ID
  ? allCases.filter(testCase => testCase.id === process.env.CASE_ID)
  : allCases

async function selectBackendScenario() {
  const response = await fetch(`${mockBaseUrl}/__prototype/scenario`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
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
        const contentType = relative.endsWith('.css') ? 'text/css' : relative.endsWith('.ttf') ? 'font/ttf' : relative.endsWith('.json') ? 'application/json' : 'text/javascript'
        return route.fulfill({ status: 200, contentType, body })
      } catch {
        return route.fulfill({ status: 404, body: 'missing local Monaco asset' })
      }
    }
    if (['api.iconify.design', 'api.simplesvg.com', 'api.unisvg.com'].includes(url.hostname)) {
      const prefix = url.pathname.split('/').pop()?.replace(/\.json$/, '')
      if (prefix && iconCollections[prefix]) {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(iconCollections[prefix]) })
      }
    }
    if (url.protocol === 'data:' || url.protocol === 'blob:' || ['127.0.0.1', 'localhost'].includes(url.hostname)) return route.continue()
    return route.abort('blockedbyclient')
  })
}

async function settle(page, waitMs = 300) {
  await page.waitForFunction(() => document.body?.innerText.trim().length > 0, undefined, { timeout: 20_000 })
  await page.waitForTimeout(waitMs)
  await page.addStyleTag({ content: normalizedStyle })
  await page.waitForTimeout(100)
}

const modelTrigger = page => page.getByText('Default LLM Model (Global)', { exact: true }).locator('..').getByRole('button').first()
const memberToggle = page => page.locator('[data-test="team-member-overrides-toggle"]')
const runButton = page => page.getByRole('button', { name: 'Run Team', exact: true })

async function chooseWorkspace(page) {
  await page.getByRole('button', { name: 'Select a workspace...', exact: true }).click()
  await page.locator('li').filter({ hasText: '/synthetic/prototype-workspace' }).click()
  await page.getByText('Workspace: prototype-workspace', { exact: true }).waitFor()
}

async function applyAction(page, testCase) {
  if (testCase.action === 'model-picker') {
    await modelTrigger(page).click()
    const search = page.getByPlaceholder('Search models...')
    await search.waitFor()
    await search.fill('prototype')
  } else if (testCase.action === 'workspace-existing') {
    await chooseWorkspace(page)
  } else if (testCase.action === 'workspace-new') {
    await page.getByRole('tab', { name: 'New', exact: true }).click()
    const input = page.getByPlaceholder('/absolute/path/to/workspace', { exact: true })
    await input.fill('/synthetic/new-team-workspace')
    await page.waitForFunction(() => {
      const button = Array.from(document.querySelectorAll('button')).find(node => node.textContent?.trim() === 'Run Team')
      return button && !button.disabled
    })
  } else if (testCase.action === 'root-auto-approve') {
    await page.locator('#team-scope-root-auto-execute').click()
  } else if (testCase.action === 'members-inherited') {
    await memberToggle(page).focus()
    await page.keyboard.press('Enter')
    await page.locator('[data-test="member-override-item"]').first().waitFor()
  } else if (testCase.action === 'member-override') {
    await memberToggle(page).click()
    const firstMember = page.locator('[data-test="member-override-item"]').first()
    await firstMember.waitFor()
    await firstMember.locator('input[type="checkbox"]').click()
    await firstMember.getByText('Overridden', { exact: true }).waitFor()
  }
  await page.waitForTimeout(180)
  return page.evaluate(() => {
    const pinia = document.querySelector('#__nuxt')?.__vue_app__?.config?.globalProperties?.$pinia
    const teamRunConfig = pinia?._s?.get('teamRunConfig')
    const draft = teamRunConfig?.selectedDraft
    const config = draft?.config ?? null
    return {
      draftId: draft?.draftId ?? null,
      config,
      workspaceAuthoring: draft?.teamWorkspaceAuthoringByTeamAddress ?? null,
      launchReadiness: teamRunConfig?.launchReadiness ?? null,
    }
  })
}

const round = value => Math.round(value * 1000) / 1000
const roundedBox = box => box ? Object.fromEntries(Object.entries(box).map(([key, value]) => [key, round(value)])) : null
async function optionalBox(locator) {
  return await locator.count() ? roundedBox(await locator.first().boundingBox()) : null
}
async function elementEvidence(locator) {
  if (await locator.count() === 0) return null
  return locator.first().evaluate(node => {
    const style = getComputedStyle(node)
    const rect = node.getBoundingClientRect()
    return {
      text: node.innerText,
      role: node.getAttribute('role'),
      ariaChecked: node.getAttribute('aria-checked'),
      ariaExpanded: node.getAttribute('aria-expanded'),
      ariaSelected: node.getAttribute('aria-selected'),
      disabled: 'disabled' in node ? node.disabled : null,
      checked: 'checked' in node ? node.checked : null,
      indeterminate: 'indeterminate' in node ? node.indeterminate : null,
      className: node.getAttribute('class'),
      box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      style: {
        display: style.display, color: style.color, backgroundColor: style.backgroundColor,
        borderColor: style.borderColor, borderRadius: style.borderRadius, boxShadow: style.boxShadow,
        fontFamily: style.fontFamily, fontSize: style.fontSize, lineHeight: style.lineHeight,
      },
    }
  })
}

async function captureEvidence(page, testCase, target, actionResult, browserErrors) {
  const screenshotDirectory = resolve(outputRoot, target)
  await mkdir(screenshotDirectory, { recursive: true })
  const screenshotPath = resolve(screenshotDirectory, `${testCase.id}-${target}.png`)
  const center = await page.locator('[data-test="workspace-center-pane"]').boundingBox()
  if (!center) throw new Error(`${target} workspace center pane is unavailable`)
  const clip = {
    x: Math.max(0, Math.floor(center.x)), y: 0,
    width: testCase.viewport.width - Math.max(0, Math.floor(center.x)), height: testCase.viewport.height,
  }
  const screenshot = await page.screenshot({
    path: screenshotPath,
    clip,
    // The accepted prototype intentionally contains later shell/right-tool
    // work. Mask that preserved area so this refresh comparison remains
    // scoped to the current-source AgentTeam launch surface and its teleported
    // model picker.
    mask: [page.locator('[data-test="workspace-right-panel"]')],
  })
  const centerText = await page.locator('[data-test="workspace-center-pane"]').innerText()
  const members = page.locator('[data-test="member-override-item"]')
  const semantic = {
    route: new URL(page.url()).pathname,
    language: await page.locator('html').getAttribute('lang'),
    centerText,
    activeElement: await page.evaluate(() => ({
      tag: document.activeElement?.tagName ?? null,
      placeholder: document.activeElement?.getAttribute?.('placeholder') ?? null,
      text: /^(BUTTON|A)$/.test(document.activeElement?.tagName ?? '') ? document.activeElement?.textContent?.trim() ?? null : null,
    })),
    runtime: await elementEvidence(page.locator('#team-scope-root-runtime-kind')),
    modelTrigger: await elementEvidence(modelTrigger(page)),
    modelSearch: await elementEvidence(page.getByPlaceholder('Search models...')),
    workspaceTabs: await page.getByRole('tab').evaluateAll(nodes => nodes.map(node => ({ text: node.textContent?.trim(), selected: node.getAttribute('aria-selected'), disabled: node.disabled }))),
    workspaceButton: await elementEvidence(page.getByRole('button', { name: /Select a workspace|prototype-workspace/, exact: false })),
    newWorkspaceInput: await elementEvidence(page.getByPlaceholder('/absolute/path/to/workspace', { exact: true })),
    rootAutoApprove: await elementEvidence(page.locator('#team-scope-root-auto-execute')),
    memberToggle: await elementEvidence(memberToggle(page)),
    memberRows: await members.evaluateAll(nodes => nodes.map(node => node.innerText)),
    memberAutoApprove: await members.count() ? await elementEvidence(members.first().locator('input[type="checkbox"]')) : null,
    runButton: await elementEvidence(runButton(page)),
    blockingIssue: await elementEvidence(page.locator('[data-test="team-run-blocking-issue"]')),
  }
  const geometry = {
    viewport: testCase.viewport,
    screenshotClip: clip,
    center: roundedBox(center),
    form: await optionalBox(page.locator('[data-test="team-run-config-form"]')),
    runButton: await optionalBox(runButton(page)),
    memberPanel: await optionalBox(page.locator('[data-test="team-member-overrides-panel"]')),
    modelPopover: await optionalBox(page.getByPlaceholder('Search models...').locator('..').locator('..')),
  }
  return {
    id: testCase.id, inventoryId: testCase.inventoryId, name: testCase.name,
    scenario: 'workspace_team_launch_refresh', action: testCase.action, target,
    viewport: testCase.viewport, screenshotPath, screenshotSha256: sha256(screenshot),
    semantic, semanticSha256: sha256(JSON.stringify(semantic)),
    geometry, geometrySha256: sha256(JSON.stringify(geometry)),
    actionResult, actionResultSha256: sha256(JSON.stringify(actionResult)), browserErrors,
  }
}

async function capture(browser, baseUrl, target, testCase) {
  const context = await browser.newContext({
    viewport: testCase.viewport, locale: 'en-US', colorScheme: 'light', reducedMotion: 'reduce', timezoneId: 'UTC',
  })
  await installNetworkBoundary(context)
  await context.addInitScript(() => {
    localStorage.clear()
    localStorage.setItem('autobyteus.localization.preference-mode', 'en')
    localStorage.setItem('autobyteus.prototype.scenario', 'workspace_team_launch_refresh')
    localStorage.setItem('autobyteus.prototype.context', 'desktop')
    localStorage.setItem('autobyteus.prototype.deferExperienceScenario', '1')
    localStorage.setItem('autobyteus.app-left-panel.primary-nav-height', '240')
  })
  const page = await context.newPage()
  const browserErrors = []
  page.on('pageerror', error => browserErrors.push(`pageerror: ${error.message}`))
  page.on('console', message => { if (message.type() === 'error') browserErrors.push(`console: ${message.text()}`) })
  const startPath = testCase.viewport.width < 600 ? '/agent-teams?view=team-list' : '/workspace'
  await page.goto(`${baseUrl}${startPath}`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  if (testCase.viewport.width < 600) {
    await page.waitForFunction(() => {
      const stores = document.querySelector('#__nuxt')?.__vue_app__?.config?.globalProperties?.$pinia?._s
      return Boolean(stores?.has('agentDefinition') && stores?.has('agentTeamDefinition'))
    }, undefined, { timeout: 20_000 })
    await page.evaluate(() => {
      void document.querySelector('#__nuxt')?.__vue_app__?.config?.globalProperties?.$router?.push('/workspace')
    })
    await page.waitForURL(`${baseUrl}/workspace`, { timeout: 20_000 })
  }
  await page.waitForFunction(() => {
    const stores = document.querySelector('#__nuxt')?.__vue_app__?.config?.globalProperties?.$pinia?._s
    return Boolean(stores && [
      'agentContexts', 'agentSelection', 'workspace', 'agentDefinition',
      'agentTeamDefinition', 'agentRunConfig', 'teamRunConfig', 'workspaceCenterView',
    ].every(id => stores.has(id)))
  }, undefined, { timeout: 20_000 })
  // Let ordinary source/bootstrap reads settle, then install the exact same
  // deterministic fixture last in both applications.
  await settle(page, 900)
  const applied = await page.evaluate(applyExperienceScenario, { scenario: 'workspace_team_launch_refresh', context: 'desktop' })
  if (!applied?.applied) throw new Error(`${target} scenario was not applied: ${JSON.stringify(applied)}`)
  await settle(page, 500)
  await page.locator('[data-test="team-run-config-form"]').waitFor({ timeout: 20_000 })
  const actionResult = await applyAction(page, testCase)
  await settle(page, 220)
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
    sameDimensions: true, dimensions: { width: source.info.width, height: source.info.height },
    changedPixels, totalPixels, changedPixelRatio, maximumChannelDelta,
    normalizedRenderingNoiseOnly:
      (changedPixelRatio <= 0.0005 && maximumChannelDelta <= 4)
      || changedPixels <= 8,
    diffPath,
  }
}

const equalJson = (left, right) => JSON.stringify(left) === JSON.stringify(right)
await mkdir(outputRoot, { recursive: true })
await selectBackendScenario()
const browser = await chromium.launch({
  headless: true, executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
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
      screenshot, sourceBrowserErrors: source.browserErrors, prototypeBrowserErrors: prototype.browserErrors,
    }
    const pass = comparison.semanticExact && comparison.geometryExact && comparison.actionExact
      && comparison.screenshot.sameDimensions
      && (comparison.screenshot.changedPixels === 0 || comparison.screenshot.normalizedRenderingNoiseOnly)
      && source.browserErrors.length === 0 && prototype.browserErrors.length === 0
    results.push({ ...testCase, scenario: 'workspace_team_launch_refresh', source, prototype, comparison, result: pass ? 'Pass' : 'Fail' })
    process.stdout.write(`${testCase.id}: ${pass ? 'PASS' : 'FAIL'}\n`)
  }
} finally {
  await browser.close()
}
const passed = results.filter(result => result.result === 'Pass').length
const summary = {
  packageId: 'AORG-FLAT-TEAM-001', requestType: 'Refresh',
  sourcePin: '5fb16658e7bd2aefd750f99eb596a17382e161ac',
  sourceBaseUrl, prototypeBaseUrl, mockBaseUrl,
  browser: process.env.CHROMIUM_PATH || '/usr/bin/chromium', generatedAt: new Date().toISOString(),
  passed, total: results.length, result: passed === results.length ? 'Pass' : 'Fail',
  inventory: Object.fromEntries([...new Set(cases.map(testCase => testCase.inventoryId))].map(inventoryId => [
    inventoryId,
    results.filter(result => result.inventoryId === inventoryId).every(result => result.result === 'Pass') ? 'Pass' : 'Fail',
  ])),
}
await writeFile(resolve(outputRoot, 'team-launch-refresh-results.json'), `${JSON.stringify(results, null, 2)}\n`)
await writeFile(resolve(outputRoot, 'team-launch-refresh-summary.json'), `${JSON.stringify(summary, null, 2)}\n`)
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`)
if (summary.result !== 'Pass') process.exitCode = 1
