#!/usr/bin/env node
import { chromium } from 'playwright-core'
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import sharp from 'sharp'

const root = resolve(new URL('../..', import.meta.url).pathname)
const sourceBaseUrl = process.env.SOURCE_BASE_URL || 'http://127.0.0.1:4261'
const prototypeBaseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:3261'
const mockBaseUrl = process.env.MOCK_BASE_URL || 'http://127.0.0.1:4361'
const sourcePin = '9d0fd7c570d58da1af2c7a40279327c8a20a8093'
const outputRoot = resolve(root, 'evidence/token-statistics-refresh')
const style = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'
const require = createRequire(import.meta.url)
const icons = Object.fromEntries(['heroicons', 'ph', 'mdi', 'svg-spinners', 'vscode-icons', 'logos'].map(prefix => [prefix, require(`@iconify-json/${prefix}/icons.json`)]))
const sha256 = value => createHash('sha256').update(value).digest('hex')

const cases = Object.freeze([
  { id: 'UXV-TS-001', inventory: 'UXB-TS-001', name: 'Analytics full comparable populated', scenario: 'populated', viewport: 'desktop', locale: 'en' },
  { id: 'UXV-TS-002', inventory: 'UXB-TS-001', name: 'Analytics full comparable narrow', scenario: 'populated', viewport: 'narrow', locale: 'en' },
  { id: 'UXV-TS-003', inventory: 'UXB-TS-002', name: 'Analytics covered empty', scenario: 'token_empty', viewport: 'desktop', locale: 'en' },
  { id: 'UXV-TS-004', inventory: 'UXB-TS-003', name: 'Analytics partial coverage and pricing', scenario: 'token_partial', viewport: 'desktop', locale: 'en' },
  { id: 'UXV-TS-005', inventory: 'UXB-TS-004', name: 'Analytics unavailable pre-coverage range', scenario: 'token_unavailable', viewport: 'desktop', locale: 'en' },
  { id: 'UXV-TS-006', inventory: 'UXB-TS-005', name: 'Analytics retryable error', scenario: 'error', viewport: 'desktop', locale: 'en' },
  { id: 'UXV-TS-007', inventory: 'UXB-TS-006', name: 'Analytics loading skeleton', scenario: 'loading', viewport: 'desktop', locale: 'en', loading: true },
  { id: 'UXV-TS-008', inventory: 'UXB-TS-007', name: 'Analytics mixed-currency cost evidence', scenario: 'token_mixed_currency', viewport: 'desktop', locale: 'en', action: 'costMetric' },
  { id: 'UXV-TS-009', inventory: 'UXB-TS-008', name: 'Analytics custom range inline validation', scenario: 'populated', viewport: 'desktop', locale: 'en', action: 'customInvalid' },
  { id: 'UXV-TS-010', inventory: 'UXB-TS-009', name: 'Analytics runtime filter and clear control', scenario: 'populated', viewport: 'desktop', locale: 'en', action: 'runtimeFilter' },
  { id: 'UXV-TS-011', inventory: 'UXB-TS-010', name: 'Run details task table', scenario: 'populated', viewport: 'desktop', locale: 'en', action: 'runDetails' },
  { id: 'UXV-TS-012', inventory: 'UXB-TS-011', name: 'Run details expanded Team hierarchy', scenario: 'populated', viewport: 'desktop', locale: 'en', action: 'expandTeam' },
  { id: 'UXV-TS-013', inventory: 'UXB-TS-012', name: 'Run details cost breakdown disclosure', scenario: 'populated', viewport: 'desktop', locale: 'en', action: 'costDetails' },
  { id: 'UXV-TS-014', inventory: 'UXB-TS-013', name: 'Run details model grouping', scenario: 'populated', viewport: 'desktop', locale: 'en', action: 'modelGrouping' },
  { id: 'UXV-TS-015', inventory: 'UXB-TS-014', name: 'Run details explicit empty state', scenario: 'token_empty', viewport: 'desktop', locale: 'en', action: 'runDetails' },
  { id: 'UXV-TS-016', inventory: 'UXB-TS-015', name: 'Run details retryable error', scenario: 'error', viewport: 'desktop', locale: 'en', action: 'runDetails' },
  { id: 'UXV-TS-017', inventory: 'UXB-TS-016', name: 'Analytics Simplified Chinese locale', scenario: 'populated', viewport: 'desktop', locale: 'zh-CN' },
  { id: 'UXV-TS-018', inventory: 'UXB-TS-010', name: 'Run details narrow layout', scenario: 'populated', viewport: 'narrow', locale: 'en', action: 'runDetails' },
  { id: 'UXV-TS-019', inventory: 'UXB-TS-017', name: 'Analytics Last month preset applied', scenario: 'populated', viewport: 'desktop', locale: 'en', action: 'lastMonth' },
  { id: 'UXV-TS-020', inventory: 'UXB-TS-009', name: 'Analytics filter cleared and result restored', scenario: 'populated', viewport: 'desktop', locale: 'en', action: 'filterClear' },
  { id: 'UXV-TS-021', inventory: 'UXB-TS-008', name: 'Analytics valid custom range applied', scenario: 'populated', viewport: 'desktop', locale: 'en', action: 'customApply' },
  { id: 'UXV-TS-022', inventory: 'UXB-TS-005', name: 'Analytics explicit retry remains recoverable', scenario: 'error', viewport: 'desktop', locale: 'en', action: 'retryError' },
  { id: 'UXV-TS-023', inventory: 'UXB-TS-011', name: 'Run details task sort changed', scenario: 'populated', viewport: 'desktop', locale: 'en', action: 'sortTask' },
  { id: 'UXV-TS-024', inventory: 'UXB-TS-018', name: 'Analytics CSV export download', scenario: 'populated', viewport: 'desktop', locale: 'en', action: 'exportCsv' },
  { id: 'UXV-TS-025', inventory: 'UXB-TS-019', name: 'Run details edited date range fetched', scenario: 'populated', viewport: 'desktop', locale: 'en', action: 'runDateFetch' },
  { id: 'UXV-TS-026', inventory: 'UXB-TS-007', name: 'Analytics local-only no-API-bill evidence', scenario: 'token_local', viewport: 'desktop', locale: 'en', action: 'costMetric' },
])
const requestedIds = new Set(String(process.env.TOKEN_REFRESH_IDS || '').split(',').map(value => value.trim()).filter(Boolean))
const selectedCases = requestedIds.size ? cases.filter(item => requestedIds.has(item.id)) : cases

const viewportFor = value => value === 'narrow' ? { width: 390, height: 844 } : { width: 1440, height: 900 }

async function selectBackendScenario(scenario) {
  const response = await fetch(`${mockBaseUrl}/__prototype/scenario`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ scenario, operationFailures: {} }),
  })
  if (!response.ok) throw new Error(`Unable to select source scenario ${scenario}: ${response.status}`)
}

async function settle(page, item) {
  await page.waitForFunction(() => document.body?.innerText.includes('Token Statistics') || document.body?.innerText.includes('Token 统计'), undefined, { timeout: 20_000 })
  if (item.loading) {
    await page.waitForSelector('[aria-busy="true"]', { timeout: 5_000 })
    return
  }
  if (item.scenario === 'error') {
    await page.waitForSelector('[role="alert"]', { timeout: 10_000 })
  } else {
    await page.waitForFunction(() => document.body?.innerText.includes('Token usage analytics loaded.') || document.body?.innerText.includes('Token 用量分析已加载。'), undefined, { timeout: 20_000 })
  }
  // Chart.js draws its canvas series after the Vue content settles. Compare
  // only terminal frames so animation progress is not mistaken for drift.
  await page.waitForTimeout(1_400)
}

async function chooseRunDetails(page) {
  await page.getByRole('tab', { name: /Run details|运行详情/ }).click()
  await page.waitForTimeout(500)
}

async function applyAction(page, item) {
  if (!item.action) return null
  if (item.action === 'costMetric') {
    await page.getByRole('radio', { name: /Estimated cost|预估费用/ }).click()
  } else if (item.action === 'customInvalid') {
    await page.getByRole('button', { name: /Custom|自定义/, exact: true }).click()
    const dates = page.locator('input[type="date"]')
    await dates.nth(0).fill('2026-08-29')
    await dates.nth(1).fill('2026-08-20')
    await page.waitForSelector('[role="alert"]')
  } else if (item.action === 'runtimeFilter') {
    await page.locator('section[aria-label] select').nth(0).selectOption('codex_app_server')
    await page.waitForFunction(() => document.body?.innerText.includes('Filters active') && document.body?.innerText.includes('80K'), undefined, { timeout: 10_000 })
  } else if (item.action === 'runDetails') {
    await chooseRunDetails(page)
  } else if (item.action === 'expandTeam') {
    await chooseRunDetails(page)
    await page.getByRole('button', { name: /Expand team members|展开团队成员/ }).click()
  } else if (item.action === 'costDetails') {
    await chooseRunDetails(page)
    await page.getByRole('button', { name: /Show cost details for Product Review Team|显示 Product Review Team 的费用详情/ }).click()
  } else if (item.action === 'modelGrouping') {
    await chooseRunDetails(page)
    await page.locator('select[aria-label="Result grouping"],select[aria-label="结果分组"]').selectOption('model')
  } else if (item.action === 'lastMonth') {
    await page.getByRole('button', { name: /Last month|上月/, exact: true }).click()
    await page.waitForFunction(() => document.body?.innerText.includes('Jul 1, 2026') || document.body?.innerText.includes('2026年7月1日'), undefined, { timeout: 10_000 })
  } else if (item.action === 'filterClear') {
    await page.locator('section[aria-label] select').nth(0).selectOption('codex_app_server')
    await page.waitForFunction(() => document.body?.innerText.includes('Filters active') || document.body?.innerText.includes('筛选已启用'), undefined, { timeout: 10_000 })
    await page.getByRole('button', { name: /Clear filters|清除筛选/ }).click()
    await page.waitForFunction(() => document.body?.innerText.includes('All tracked usage') || document.body?.innerText.includes('全部已跟踪用量'), undefined, { timeout: 10_000 })
  } else if (item.action === 'customApply') {
    await page.getByRole('button', { name: /Custom|自定义/, exact: true }).click()
    const dates = page.locator('input[type="date"]')
    await dates.nth(0).fill('2026-08-10')
    await dates.nth(1).fill('2026-08-20')
    await page.getByRole('button', { name: /Apply|应用/, exact: true }).click()
    await page.waitForFunction(() => document.body?.innerText.includes('Aug 10, 2026') || document.body?.innerText.includes('2026年8月10日'), undefined, { timeout: 10_000 })
  } else if (item.action === 'retryError') {
    await page.getByRole('button', { name: /Retry|重试/, exact: true }).click()
    await page.waitForSelector('[role="alert"]')
  } else if (item.action === 'sortTask') {
    await chooseRunDetails(page)
    await page.getByRole('button', { name: /Sort Task \/ Run ascending|按任务 \/ 运行升序排序/ }).click()
  } else if (item.action === 'exportCsv') {
    const downloadEvent = page.waitForEvent('download')
    await page.getByRole('button', { name: /Export CSV|导出 CSV/ }).click()
    const download = await downloadEvent
    await page.waitForTimeout(150)
    return { suggestedFilename: download.suggestedFilename() }
  } else if (item.action === 'runDateFetch') {
    await chooseRunDetails(page)
    const dates = page.locator('input[type="date"]')
    await dates.nth(0).fill('2026-08-15')
    await dates.nth(1).fill('2026-08-25')
    await page.getByRole('button', { name: /Fetch Statistics|获取统计数据/ }).click()
  }
  await page.waitForTimeout(1_400)
  return null
}

async function geometryAndSemantics(page) {
  return page.evaluate(() => {
    const round = value => Math.round(value * 10) / 10
    const selector = 'button,input,select,table,canvas,[role="alert"],[aria-busy="true"]'
    const elements = [...document.querySelectorAll(selector)].filter(element => {
      const rect = element.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    }).map(element => {
      const rect = element.getBoundingClientRect()
      const computed = getComputedStyle(element)
      return {
        tag: element.tagName,
        role: element.getAttribute('role'),
        label: element.getAttribute('aria-label'),
        text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 140),
        selected: element.getAttribute('aria-selected') || element.getAttribute('aria-checked'),
        expanded: element.getAttribute('aria-expanded'),
        disabled: 'disabled' in element ? Boolean(element.disabled) : null,
        rect: [round(rect.x), round(rect.y), round(rect.width), round(rect.height)],
        style: [computed.display, computed.position, computed.fontFamily, computed.fontSize, computed.fontWeight, computed.color, computed.backgroundColor, computed.borderRadius],
      }
    })
    return {
      route: location.pathname + location.search,
      lang: document.documentElement.lang,
      bodyText: document.body.innerText,
      scroll: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
      tabState: [...document.querySelectorAll('[role="tab"]')].map(tab => ({ text: tab.textContent?.trim(), selected: tab.getAttribute('aria-selected') })),
      alertText: [...document.querySelectorAll('[role="alert"]')].map(node => node.textContent?.trim()),
      elements,
    }
  })
}

async function capture(browser, baseUrl, target, item) {
  const context = await browser.newContext({
    viewport: viewportFor(item.viewport),
    locale: item.locale === 'zh-CN' ? 'zh-CN' : 'en-US',
    timezoneId: 'UTC',
    colorScheme: 'light',
    reducedMotion: 'reduce',
  })
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (['api.iconify.design', 'api.simplesvg.com', 'api.unisvg.com'].includes(url.hostname)) {
      const prefix = url.pathname.split('/').pop()?.replace(/\.json$/, '')
      if (prefix && icons[prefix]) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(icons[prefix]) })
    }
    if (url.protocol === 'data:' || url.protocol === 'blob:' || ['127.0.0.1', 'localhost'].includes(url.hostname)) return route.continue()
    return route.abort('blockedbyclient')
  })
  await context.addInitScript(({ locale, scenario }) => {
    localStorage.clear()
    localStorage.setItem('autobyteus.localization.preference-mode', locale)
    localStorage.setItem('autobyteus.prototype.scenario', scenario)
    localStorage.setItem('autobyteus.prototype.context', 'desktop')
  }, { locale: item.locale, scenario: item.scenario })
  const page = await context.newPage()
  const browserErrors = []
  const expectedBrowserErrors = []
  const recordBrowserError = message => {
    if (item.scenario === 'error' && message.includes('Synthetic recoverable GraphQL failure.')) expectedBrowserErrors.push(message)
    else browserErrors.push(message)
  }
  page.on('pageerror', error => recordBrowserError(error.message))
  page.on('console', message => { if (message.type() === 'error') recordBrowserError(message.text()) })
  await page.goto(`${baseUrl}/settings?section=token-usage`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await settle(page, item)
  const actionResult = item.loading ? null : await applyAction(page, item)
  await page.addStyleTag({ content: style })
  await page.waitForTimeout(80)
  const fileName = `${item.id}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${item.viewport}.png`
  const screenshotPath = resolve(outputRoot, target, fileName)
  const screenshot = await page.screenshot({ path: screenshotPath, fullPage: false })
  const semantic = await geometryAndSemantics(page)
  // Let the controlled source observer finish delayed loading requests before
  // closing the page; otherwise Chromium correctly aborts them and obscures
  // the intended loading-frame evidence with transport teardown noise.
  if (item.loading) await page.waitForTimeout(1_650)
  await context.close()
  return {
    target,
    screenshotPath,
    screenshotSha256: sha256(screenshot),
    bodyTextSha256: sha256(semantic.bodyText),
    semantic,
    actionResult,
    browserErrors,
    expectedBrowserErrors,
  }
}

async function perceptualDifference(sourcePath, prototypePath, diffPath) {
  const [source, prototype] = await Promise.all([
    sharp(sourcePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(prototypePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
  ])
  if (source.info.width !== prototype.info.width || source.info.height !== prototype.info.height) {
    return { dimensionsEqual: false, changedPixels: null, totalPixels: null, changedPixelRatio: 1, maximumChannelDelta: 255 }
  }
  const diff = Buffer.alloc(source.data.length)
  let changedPixels = 0
  let maximumChannelDelta = 0
  for (let index = 0; index < source.data.length; index += 4) {
    let changed = false
    for (let channel = 0; channel < 3; channel += 1) {
      const delta = Math.abs(source.data[index + channel] - prototype.data[index + channel])
      maximumChannelDelta = Math.max(maximumChannelDelta, delta)
      changed ||= delta > 0
      diff[index + channel] = Math.min(255, delta * 4)
    }
    diff[index + 3] = 255
    if (changed) changedPixels += 1
  }
  const totalPixels = source.info.width * source.info.height
  if (changedPixels) await sharp(diff, { raw: { width: source.info.width, height: source.info.height, channels: 4 } }).png().toFile(diffPath)
  return {
    dimensionsEqual: true,
    changedPixels,
    totalPixels,
    changedPixelRatio: changedPixels / totalPixels,
    maximumChannelDelta,
    normalizedRenderingNoiseOnly: changedPixels / totalPixels <= 0.0003 && maximumChannelDelta <= 16,
  }
}

await Promise.all(['source', 'prototype', 'comparison', 'machine'].map(directory => mkdir(resolve(outputRoot, directory), { recursive: true })))
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking'],
})
const results = []
try {
  for (const item of selectedCases) {
    await selectBackendScenario(item.scenario)
    const source = await capture(browser, sourceBaseUrl, 'source', item)
    await selectBackendScenario(item.scenario)
    const prototype = await capture(browser, prototypeBaseUrl, 'prototype', item)
    const diffPath = resolve(outputRoot, 'comparison', `${item.id}-diff.png`)
    const perceptual = await perceptualDifference(source.screenshotPath, prototype.screenshotPath, diffPath)
    const bodyTextEqual = source.bodyTextSha256 === prototype.bodyTextSha256
    const geometryEqual = JSON.stringify(source.semantic) === JSON.stringify(prototype.semantic)
    const screenshotEqual = source.screenshotSha256 === prototype.screenshotSha256
    const actionResultEqual = JSON.stringify(source.actionResult) === JSON.stringify(prototype.actionResult)
    const pass = bodyTextEqual && geometryEqual && actionResultEqual && (screenshotEqual || perceptual.normalizedRenderingNoiseOnly)
    const comparison = { screenshotEqual, bodyTextEqual, geometryEqual, actionResultEqual, perceptual, diffPath: perceptual.changedPixels ? diffPath : null, pass }
    results.push({ item, source, prototype, comparison })
    process.stdout.write(`${pass ? 'PASS' : 'FAIL'} ${item.id} ${item.name}\n`)
  }
} finally {
  await selectBackendScenario('populated').catch(() => undefined)
  await browser.close()
}

const summary = {
  generatedAt: new Date().toISOString(),
  sourcePin,
  sourceBaseUrl,
  prototypeBaseUrl,
  mockBaseUrl,
  chromiumPath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  cases: results.length,
  passed: results.filter(result => result.comparison.pass).length,
  failed: results.filter(result => !result.comparison.pass).map(result => result.item.id),
  byteExactScreenshots: results.filter(result => result.comparison.screenshotEqual).length,
  sourceBrowserErrorCases: results.filter(result => result.source.browserErrors.length).map(result => result.item.id),
  prototypeBrowserErrorCases: results.filter(result => result.prototype.browserErrors.length).map(result => result.item.id),
}
await writeFile(resolve(outputRoot, 'machine', 'token-statistics-refresh-results.json'), JSON.stringify({ summary, results }, null, 2))
await writeFile(resolve(outputRoot, 'machine', 'token-statistics-refresh-summary.json'), JSON.stringify(summary, null, 2))
if (summary.failed.length) process.exitCode = 1
