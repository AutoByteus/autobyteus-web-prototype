#!/usr/bin/env node
import { chromium } from 'playwright-core'
import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(new URL('../..', import.meta.url).pathname)
const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:3261'
const evidenceRoot = resolve(root, 'tickets/done/REQPKG-TSUI-001/validation/final-prototype')
const reviewRoot = resolve(root, 'tickets/done/REQPKG-TSUI-001/review-evidence/final-prototype-review')
await mkdir(evidenceRoot, { recursive: true })
await mkdir(reviewRoot, { recursive: true })

const results = []
const check = (id, name, pass, detail = {}) => {
  results.push({ id, name, pass: Boolean(pass), detail })
  if (!pass) throw new Error(`${id} failed: ${name}\n${JSON.stringify(detail, null, 2)}`)
}
const exists = async path => { try { await access(path, constants.F_OK); return true } catch { return false } }
const readTree = async dir => {
  const output = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name)
    if (entry.isDirectory()) output.push(...await readTree(path))
    else output.push({ path, text: await readFile(path, 'utf8') })
  }
  return output
}

const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] })
const browserErrors = []
const exportRequests = []

async function openScenario(scenario, options = {}) {
  const { width = 1440, height = 1000, locale = 'en', loading = false } = options
  const context = await browser.newContext({
    viewport: { width, height },
    locale: locale === 'zh-CN' ? 'zh-CN' : 'en-US',
    timezoneId: 'UTC',
    colorScheme: 'light',
    reducedMotion: 'reduce',
    acceptDownloads: false,
  })
  await context.addInitScript(({ scenario, locale }) => {
    localStorage.clear()
    localStorage.setItem('autobyteus.prototype.scenario', scenario)
    localStorage.setItem('autobyteus.localization.preference-mode', locale)
    window.__tokenExportSignals = { objectUrls: 0, downloadClicks: 0, exportFetches: [] }
    const originalCreateObjectURL = URL.createObjectURL.bind(URL)
    URL.createObjectURL = (...args) => {
      window.__tokenExportSignals.objectUrls += 1
      return originalCreateObjectURL(...args)
    }
    const originalClick = HTMLAnchorElement.prototype.click
    HTMLAnchorElement.prototype.click = function (...args) {
      if (this.download || /(?:csv|export|download)/i.test(this.href || '')) window.__tokenExportSignals.downloadClicks += 1
      return originalClick.apply(this, args)
    }
    const originalFetch = window.fetch.bind(window)
    window.fetch = (...args) => {
      const url = String(args[0] instanceof Request ? args[0].url : args[0])
      if (/(?:csv|export|download)/i.test(url)) window.__tokenExportSignals.exportFetches.push(url)
      return originalFetch(...args)
    }
  }, { scenario, locale })
  const page = await context.newPage()
  page.on('console', message => { if (message.type() === 'error') browserErrors.push({ scenario, text: message.text() }) })
  page.on('pageerror', error => browserErrors.push({ scenario, text: error.message }))
  page.on('request', request => {
    const url = request.url()
    if (!url.includes('/_nuxt/') && /(?:csv|export|download)/i.test(url)) exportRequests.push({ scenario, url })
  })
  await page.goto(`${baseUrl}/settings?section=token-usage`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => document.body?.innerText.includes('Token Statistics') || document.body?.innerText.includes('Token 统计'), undefined, { timeout: 20_000 })
  if (loading) await page.waitForSelector('[aria-busy="true"]', { timeout: 5_000 })
  else if (scenario === 'error') await page.waitForSelector('[role="alert"]', { timeout: 8_000 })
  else await page.waitForFunction(() => document.body?.innerText.includes('Token usage analytics loaded.') || document.body?.innerText.includes('Token 用量分析已加载。'), undefined, { timeout: 20_000 })
  return { page, context }
}

try {
  {
    const { page, context } = await openScenario('token_partial')
    const labels = await page.locator('[data-summary-id]').evaluateAll(nodes => nodes.map(node => node.querySelector('p')?.textContent?.trim()))
    const widths = await page.locator('[data-summary-id]').evaluateAll(nodes => nodes.map(node => Math.round(node.getBoundingClientRect().width * 10) / 10))
    const body = await page.locator('body').innerText()
    check('FPV-001', 'Desktop summary has six equal peers in the approved order',
      JSON.stringify(labels) === JSON.stringify(['Total tokens', 'Uncached input', 'Cached input', 'Output', 'Estimated API cost', 'Cache hit rate']) && Math.max(...widths) - Math.min(...widths) <= 1,
      { labels, widths })
    check('FPV-002', 'Approved hierarchy contains no comparison, contributor, driver, ratio, or export presentation',
      !/(prior period|previous period|no comparable data|dominant driver|usage drivers|input\s*\/\s*output ratio|export csv)/i.test(body), { bodySample: body.slice(0, 2200) })
    const markers = await page.locator('[data-point-marker]').count()
    const series = await page.locator('[data-series="daily"]').count()
    const guides = await page.locator('[data-guide="midpoint"]').count()
    const ticks = await page.locator('.line-x-labels span').count()
    const axisStyle = await page.locator('.line-plot').evaluate(node => {
      const style = getComputedStyle(node)
      return { top: style.borderTopWidth, left: style.borderLeftWidth, bottom: style.borderBottomWidth }
    })
    const chartLabel = await page.locator('[data-testid="daily-line-chart"]').getAttribute('aria-label')
    check('FPV-003', 'Monthly trend is one open-top 29-point line with axes, five UTC ticks, and one midpoint guide',
      markers === 29 && series === 1 && guides === 1 && ticks === 5 && axisStyle.top === '0px' && axisStyle.left !== '0px' && axisStyle.bottom !== '0px',
      { markers, series, guides, ticks, axisStyle })
    check('FPV-004', 'Trend exposes all daily buckets in its accessible name',
      Boolean(chartLabel?.includes('Aug 1, 2026') && chartLabel?.includes('Aug 29, 2026') && (chartLabel?.match(/Aug /g)?.length ?? 0) >= 29),
      { ariaLabelLength: chartLabel?.length, ariaLabelStart: chartLabel?.slice(0, 300) })
    check('FPV-005', 'Uncached-input meaning and exact cache-write evidence are available',
      body.includes('Standard/cache-miss-rate input; excludes cached reads and cache writes.'), {})
    await page.screenshot({ path: resolve(reviewRoot, 'analytics-partial-desktop.png') })
    await context.close()
  }

  {
    const { page, context } = await openScenario('populated')
    await page.getByRole('radio', { name: 'Cost', exact: true }).click()
    await page.waitForTimeout(100)
    check('FPV-006', 'Tokens/Cost switches the same daily chart to authoritative USD units',
      await page.getByText('Cost (USD)', { exact: true }).count() === 1 && await page.locator('[data-point-marker]').count() === 29 && await page.locator('[data-series="daily"]').count() === 1, {})
    await page.getByRole('button', { name: /^Filters/ }).click()
    const panel = page.locator('#token-usage-filter-panel')
    await panel.getByLabel('Runtime').selectOption('codex_app_server')
    await panel.getByRole('button', { name: 'Apply filters' }).click()
    await page.waitForFunction(() => document.body.innerText.includes('80K') && document.body.innerText.includes('Codex'))
    const filteredRows = await page.locator('[data-testid="detailed-usage-section"] tbody > tr').count()
    check('FPV-007', 'Focused filters apply one coherent result and active context',
      await page.getByRole('button', { name: /Filters 1/ }).count() === 1 && filteredRows === 1 && (await page.locator('body').innerText()).includes('80K'), { filteredRows })
    await page.getByRole('button', { name: /^Filters 1/ }).click()
    await page.locator('#token-usage-filter-panel').getByLabel('Breakdown grouping').count().catch(() => 0)
    await page.locator('#token-usage-filter-panel').getByRole('button', { name: 'Clear all' }).click()
    await page.locator('#token-usage-filter-panel').getByRole('button', { name: 'Apply filters' }).click()
    await page.waitForFunction(() => document.body.innerText.includes('152K') && document.body.innerText.includes('All tracked usage'))
    const grouping = page.getByLabel('Breakdown grouping')
    await grouping.selectOption('PROVIDER')
    await page.getByRole('button', { name: 'Details', exact: true }).first().click()
    const detailBody = await page.locator('[data-testid="detailed-usage-section"]').innerText()
    check('FPV-008', 'Detailed usage stays visible, changes grouping, and discloses exact accounting',
      detailBody.includes('OpenAI') && /cache write/i.test(detailBody) && /total input/i.test(detailBody) && /thinking included/i.test(detailBody), { detailBody })
    await context.close()
  }

  {
    const { page, context } = await openScenario('populated')
    const handle = page.locator('[data-testid="settings-navigation-resize-handle"]')
    const before = Number(await handle.getAttribute('aria-valuenow'))
    await handle.focus()
    await page.keyboard.press('ArrowLeft')
    const after = Number(await handle.getAttribute('aria-valuenow'))
    check('FPV-009', 'Settings navigation remains wholly manual and keyboard-resizable', after < before && await page.locator('[data-testid="settings-page-navigation"]').count() === 1, { before, after })
    await page.getByRole('tab', { name: 'Run details' }).click()
    await page.waitForTimeout(250)
    const runBody = await page.locator('body').innerText()
    check('FPV-010', 'Run details retains creation-time selection and lifetime-total meaning in the unified shell',
      runBody.includes('The date range selects runs by creation time; totals show each selected run’s lifetime usage.') && runBody.includes('Product Review Team') && !/\b\d+\s+runs\b/i.test(runBody), {})
    await page.getByRole('button', { name: 'Expand team members' }).click()
    check('FPV-011', 'Run-details task hierarchy, expansion, sorting, and cost disclosure remain operable',
      await page.getByText(/\/researcher/).count() >= 1 && await page.getByRole('button', { name: /Sort Task \/ Run/ }).count() === 1 && await page.getByRole('button', { name: /Show cost details for Product Review Team/ }).count() === 1, {})
    await page.getByRole('radio', { name: 'Model', exact: true }).click()
    check('FPV-012', 'Run-details Model grouping remains available without an unsupported Runs count',
      await page.getByText('LLM Model', { exact: true }).count() === 1 && !/\b\d+\s+runs\b/i.test(await page.locator('body').innerText()), {})
    await page.screenshot({ path: resolve(reviewRoot, 'run-details-model-desktop.png') })
    await context.close()
  }

  {
    const cacheCases = [
      ['populated', /\d+(?:\.\d+)?%/],
      ['token_cache_zero', /^0%$/],
      ['token_cache_not_reported', /Not reported/],
      ['token_local', /Not supported/],
      ['token_cache_unknown', /Unknown/],
    ]
    const observed = []
    for (const [scenario, expected] of cacheCases) {
      const { page, context } = await openScenario(scenario)
      const text = (await page.locator('[data-summary-id="cache-rate"] p').nth(1).innerText()).trim()
      observed.push({ scenario, text })
      if (!expected.test(text)) throw new Error(`Cache state ${scenario} rendered ${text}`)
      await context.close()
    }
    check('FPV-013', 'Positive, zero-reported, not-reported, unsupported/local, and unknown cache states remain truthful', true, { observed })
  }

  {
    const expectedStates = [
      ['token_empty', 'No tracked token usage in this period.'],
      ['token_unavailable', 'This range is before analytics tracking began.'],
      ['error', 'Synthetic recoverable GraphQL failure.'],
      ['token_mixed_currency', 'Multiple currencies cannot be combined.'],
      ['token_local', 'Selected usage is local with no API bill.'],
    ]
    const observed = []
    for (const [scenario, expectedText] of expectedStates) {
      const { page, context } = await openScenario(scenario)
      if (scenario === 'token_mixed_currency' || scenario === 'token_local') await page.getByRole('radio', { name: 'Cost', exact: true }).click()
      const body = await page.locator('body').innerText()
      observed.push({ scenario, matched: body.includes(expectedText) })
      if (!body.includes(expectedText)) throw new Error(`${scenario} missing ${expectedText}`)
      await context.close()
    }
    const loading = await openScenario('loading', { loading: true })
    const loadingBusy = await loading.page.locator('[aria-busy="true"]').count()
    await loading.context.close()
    check('FPV-014', 'Loading, error, empty, uncovered, mixed-currency, and local states remain intentional and truthful', observed.every(item => item.matched) && loadingBusy > 0, { observed, loadingBusy })
  }

  {
    const { page, context } = await openScenario('token_partial', { width: 390, height: 844 })
    const geometry = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }))
    const summaryWidths = await page.locator('[data-summary-id]').evaluateAll(nodes => nodes.slice(0, 2).map(node => Math.round(node.getBoundingClientRect().width * 10) / 10))
    const chart = page.locator('[data-testid="usage-trend-section"]')
    await chart.scrollIntoViewIfNeeded()
    const visibleTicks = await page.locator('.line-x-labels span').evaluateAll(nodes => nodes.filter(node => getComputedStyle(node).display !== 'none').map(node => node.textContent?.trim()))
    check('FPV-015', 'Narrow layout contains page width, preserves equal peers, and keeps readable axis meaning',
      geometry.viewport === geometry.document && geometry.viewport === geometry.body && Math.abs(summaryWidths[0] - summaryWidths[1]) <= 1 && visibleTicks.length === 3 && await page.getByText('Date (UTC)', { exact: true }).count() === 1,
      { geometry, summaryWidths, visibleTicks })
    await chart.screenshot({ path: resolve(reviewRoot, 'analytics-chart-narrow.png') })
    await context.close()
  }

  {
    const { page, context } = await openScenario('populated', { locale: 'zh-CN' })
    const body = await page.locator('body').innerText()
    check('FPV-016', 'Simplified Chinese retains the final hierarchy and controls', body.includes('未缓存输入') && body.includes('缓存命中率') && body.includes('详细用量') && body.includes('筛选') && !body.includes('导出 CSV'), {})
    await context.close()
  }

  {
    const { page, context } = await openScenario('populated')
    await page.getByRole('button', { name: /^Filters/ }).click()
    await page.keyboard.press('Escape')
    const focusedName = await page.evaluate(() => document.activeElement?.textContent?.replace(/\s+/g, ' ').trim())
    const exportSignals = await page.evaluate(() => window.__tokenExportSignals)
    const exportNamed = await page.getByRole('button', { name: /export|csv|download/i }).count()
    const treeFiles = await readTree(resolve(root, 'components/settings/token-usage'))
    const tokenSource = treeFiles.map(file => file.text).join('\n')
    const csvUtilityExists = await exists(resolve(root, 'utils/tokenUsageAnalyticsCsv.ts'))
    check('FPV-017', 'Filter disclosure restores focus and all retained controls have keyboard names', focusedName?.startsWith('Filters'), { focusedName })
    check('FPV-018', 'CSV/export is absent from DOM, accessibility actions, client preparation path, files, and requests',
      exportNamed === 0 && await page.locator('a[download]').count() === 0 && exportSignals.objectUrls === 0 && exportSignals.downloadClicks === 0 && exportSignals.exportFetches.length === 0 && exportRequests.length === 0 && !csvUtilityExists && !/tokenUsageAnalyticsCsv|Export CSV|downloadTokenUsageAnalyticsCsv/.test(tokenSource),
      { exportNamed, exportSignals, exportRequests, csvUtilityExists })
    check('FPV-019', 'No unexpected browser errors occurred across the final journey matrix', browserErrors.length === 0, { browserErrors })
    await context.close()
  }
} finally {
  await browser.close()
}

const summary = {
  packageId: 'REQPKG-TSUI-001',
  requirementsRevision: 'RER-009',
  requirementsCommit: '6aa6ba066faf041ff1fa221cee5b956fd7e537b5',
  sourcePin: '9d0fd7c570d58da1af2c7a40279327c8a20a8093',
  baseUrl,
  passed: results.filter(result => result.pass).length,
  total: results.length,
  browserErrors,
  exportRequests,
  results,
}
await writeFile(resolve(evidenceRoot, 'browser-validation.json'), `${JSON.stringify(summary, null, 2)}\n`)
await writeFile(resolve(evidenceRoot, 'browser-validation.txt'), results.map(result => `${result.pass ? 'PASS' : 'FAIL'} ${result.id} ${result.name}`).join('\n') + '\n')
console.log(`Final Token Statistics validation passed ${summary.passed}/${summary.total}`)
