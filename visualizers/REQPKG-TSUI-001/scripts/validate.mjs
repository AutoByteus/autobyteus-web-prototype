import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname)
const ticketRoot = resolve(root, '../../tickets/in-progress/REQPKG-TSUI-001')
const visualRoot = resolve(ticketRoot, 'visual-references')
const evidenceRoot = resolve(ticketRoot, 'validation')
const baseUrl = process.env.VISUALIZER_BASE_URL || 'http://127.0.0.1:3262'
await mkdir(visualRoot, { recursive: true })
await mkdir(evidenceRoot, { recursive: true })

const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] })
const result = { generatedAt: new Date().toISOString(), baseUrl, revision: 'RV-007', checks: [], screenshots: [], browserErrors: [] }
const forbiddenProductLanguage = ['Dominant driver', 'Usage drivers', 'Leading drivers', 'Prior period', 'No comparable prior period', 'Prior period unavailable', '+28.2% from prior period', '+28.2%', 'Input / output']

const check = (id, name, pass, observed = null) => {
  result.checks.push({ id, name, pass, observed })
  if (!pass) throw new Error(`${id} failed: ${name}`)
}

async function contextFor(viewport, path = '/?direction=focus') {
  const context = await browser.newContext({ viewport, locale: 'en-US', timezoneId: 'UTC', colorScheme: 'light', reducedMotion: 'reduce' })
  const page = await context.newPage()
  page.on('pageerror', error => result.browserErrors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') result.browserErrors.push(message.text()) })
  await page.goto(new URL(path, baseUrl).href, { waitUntil: 'networkidle', timeout: 30_000 })
  return { context, page }
}

async function navigate(page, path) {
  await page.goto(new URL(path, baseUrl).href, { waitUntil: 'networkidle', timeout: 30_000 })
}

async function shot(page, id, file) {
  const path = resolve(visualRoot, `${id}-${file}.png`)
  await page.screenshot({ path, fullPage: true })
  result.screenshots.push({ id, path })
}

try {
  const desktop = await contextFor({ width: 1440, height: 1000 })
  const { page } = desktop
  let body = await page.locator('body').innerText()
  const forbiddenReviewChrome = ['Requirements visualization', 'Choose how Token Statistics should prioritize evidence', 'Visual direction', 'Journey state', 'Reset review']
  const focusedSummary = await page.evaluate(() => {
    const widths = [...document.querySelectorAll('.even-summary .summary-metric')].map(node => Math.round(node.getBoundingClientRect().width * 10) / 10)
    return { count: widths.length, widths, spread: Math.max(...widths) - Math.min(...widths) }
  })
  check('VAL-001', 'Focused partial URL opens with six equal cache-aware summary columns', body.includes('Partial coverage') && body.includes('152K') && body.includes('$0.87') && body.toLowerCase().includes('uncached input') && body.includes('93.74K') && body.toLowerCase().includes('cached input') && body.includes('21.26K') && body.toLowerCase().includes('output') && body.includes('37K') && body.toLowerCase().includes('cache hit rate') && body.includes('18.5%') && body.includes('Usage over time') && body.includes('Detailed usage') && focusedSummary.count === 6 && focusedSummary.spread <= 1 && forbiddenReviewChrome.every(text => !body.includes(text)) && forbiddenProductLanguage.every(text => !body.includes(text)), focusedSummary)
  await shot(page, 'VIS-001', 'direction-a-partial-desktop')

  await navigate(page, '/?direction=dense')
  body = await page.locator('body').innerText()
  check('VAL-002', 'Dense direction uses a separate clean URL with the same cache-aware truthful fixture', body.includes('Partial coverage since Aug 11') && body.includes('152K') && body.includes('$0.87') && body.toLowerCase().includes('uncached input') && body.toLowerCase().includes('cached input') && body.toLowerCase().includes('output') && body.toLowerCase().includes('cache hit rate') && body.includes('18.5%') && body.includes('Usage over time') && body.includes('Detailed usage') && forbiddenReviewChrome.every(text => !body.includes(text)) && forbiddenProductLanguage.every(text => !body.includes(text)))
  await shot(page, 'VIS-002', 'direction-b-partial-desktop')

  await navigate(page, '/?direction=focus')
  await page.getByRole('button', { name: /UTC range/ }).click()
  await page.getByRole('menuitem', { name: /Last month/ }).click()
  body = await page.locator('body').innerText()
  check('VAL-003', 'Product-native range selection reveals full coverage without reintroducing prior-period callouts', body.includes('Last month') && body.includes('Full coverage') && body.includes('$1.17') && forbiddenProductLanguage.every(text => !body.includes(text)))

  await navigate(page, '/?direction=focus')
  await page.getByRole('button', { name: /Filters/ }).click()
  await page.getByRole('button', { name: 'Apply filters' }).click()
  body = await page.locator('body').innerText()
  check('VAL-004', 'Product-native filter disclosure keeps one coherent cache-aware result together', body.includes('Filter current result') && body.includes('Runtime: Codex') && body.includes('80K') && body.includes('49.92K') && body.includes('11.28K') && body.includes('18.4%') && body.includes('Apply filters'))
  await shot(page, 'VIS-003', 'direction-a-filters-open-desktop')

  await navigate(page, '/?direction=dense')
  await page.getByLabel('Runtime').selectOption('codex')
  body = await page.locator('body').innerText()
  check('VAL-005', 'Dense product-native controls retain always-visible analytical context', body.includes('Runtime') && body.includes('Provider') && body.includes('Model') && body.includes('80K') && body.includes('Detailed usage') && forbiddenProductLanguage.every(text => !body.includes(text)))

  await navigate(page, '/?direction=focus')
  await page.getByRole('button', { name: 'Details' }).first().click()
  body = await page.locator('body').innerText()
  check('VAL-006', 'Focused evidence keeps primary columns visible and discloses secondary evidence in place', body.includes('Detailed usage') && body.includes('80,000') && body.includes('$0.42') && body.includes('52.6%') && body.toLowerCase().includes('cache read') && body.toLowerCase().includes('currency') && forbiddenProductLanguage.every(text => !body.includes(text)))
  await shot(page, 'VIS-004', 'direction-a-exact-evidence-desktop')

  await navigate(page, '/?direction=dense')
  await page.getByRole('row', { name: /Codex · GPT-5.6 Sol/ }).click()
  body = await page.locator('body').innerText()
  check('VAL-007', 'Dense row selection reveals a pinned exact-evidence inspector without changing values', body.includes('Detailed usage') && body.toLowerCase().includes('selected evidence') && body.includes('11,280') && body.includes('Partial price') && body.includes('Exact CSV fields remain unchanged') && forbiddenProductLanguage.every(text => !body.includes(text)))

  await navigate(page, '/?direction=focus')
  await page.getByRole('tab', { name: 'Run details' }).click()
  body = await page.locator('body').innerText()
  check('VAL-008', 'Focused Run details unifies the surface and preserves creation-time/lifetime semantics', body.includes('Range selects runs by creation time') && body.includes('lifetime usage') && body.includes('Product Review Team') && body.includes('/researcher') && body.includes('/writer'))
  await shot(page, 'VIS-005', 'direction-a-run-details-desktop')

  await navigate(page, '/?direction=dense')
  await page.getByRole('tab', { name: 'Run details' }).click()
  body = await page.locator('body').innerText()
  check('VAL-009', 'Dense Run details retains its table character inside the unified product shell', body.includes('Existing dense evidence retained inside the unified shell') && body.includes('Product Review Team') && body.includes('$0.9900'))
  await shot(page, 'VIS-006', 'direction-b-run-details-desktop')

  await navigate(page, '/?direction=focus&scene=narrow')
  body = await page.locator('body').innerText()
  check('VAL-010', 'Constrained composition keeps navigation open and the essential usage evidence visible', body.includes('Export CSV') && body.includes('Token Statistics') && body.includes('Usage over time') && forbiddenProductLanguage.every(text => !body.includes(text)))
  await shot(page, 'VIS-007', 'direction-a-constrained-frame-desktop')

  const separator = page.getByRole('separator', { name: 'Resize Settings navigation' })
  const before = Number(await separator.getAttribute('aria-valuenow'))
  await separator.focus()
  await page.keyboard.press('ArrowLeft')
  const after = Number(await separator.getAttribute('aria-valuenow'))
  check('VAL-011', 'Manual Settings navigation resize is keyboard operable', after === before - 8, { before, after })

  await navigate(page, '/?direction=focus')
  await page.getByRole('button', { name: 'Export CSV' }).click()
  body = await page.locator('body').innerText()
  check('VAL-012', 'Local export action gives immediate visible feedback', body.includes('Local CSV prepared for the applied result'))

  await page.waitForTimeout(100)
  const accessibility = await page.evaluate(() => {
    const interactive = [...document.querySelectorAll('button, select, [role=separator]')]
    const unnamed = interactive.filter(element => {
      const text = (element.textContent || '').trim()
      const labelled = element.getAttribute('aria-label') || element.getAttribute('title')
      const wrappingLabel = element.closest('label')?.textContent?.trim()
      return !text && !labelled && !wrappingLabel
    }).map(element => element.outerHTML.slice(0, 160))
    return {
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      activeAnimations: document.getAnimations().filter(animation => animation.playState === 'running').length,
      unnamed,
      h1Count: document.querySelectorAll('h1').length,
      tablists: document.querySelectorAll('[role=tablist]').length,
      liveRegions: document.querySelectorAll('[aria-live], [role=status]').length,
    }
  })
  check('VAL-013', 'Stable-state accessibility path has named controls, no redundant page title, product tabs, live feedback, and no active motion', accessibility.reducedMotion && accessibility.activeAnimations === 0 && accessibility.unnamed.length === 0 && accessibility.h1Count === 0 && accessibility.tablists >= 1 && accessibility.liveRegions >= 1, accessibility)
  await desktop.context.close()

  const narrow = await contextFor({ width: 390, height: 844 })
  const geometry = await narrow.page.evaluate(() => ({ viewport: innerWidth, documentWidth: document.documentElement.scrollWidth }))
  body = await narrow.page.locator('body').innerText()
  check('VAL-014', 'Actual narrow viewport avoids page overflow and retains the critical product controls and evidence', geometry.documentWidth === geometry.viewport && body.includes('Analytics') && body.includes('Run details') && body.includes('Export CSV') && body.includes('152K') && forbiddenReviewChrome.every(text => !body.includes(text)) && forbiddenProductLanguage.every(text => !body.includes(text)), geometry)
  await shot(narrow.page, 'VIS-008', 'direction-a-partial-narrow')
  await narrow.context.close()

  const model = await contextFor({ width: 1440, height: 1000 })
  await model.page.getByRole('tab', { name: 'Run details' }).click()
  await model.page.getByRole('radio', { name: 'Model' }).click()
  const modelHeaders = (await model.page.locator('.run-table thead th').allTextContents()).map(value => value.trim())
  body = await model.page.locator('body').innerText()
  check('VAL-015', 'Run-details model view uses only fields available in the current query contract', JSON.stringify(modelHeaders) === JSON.stringify(['Runtime / Model', 'Input', 'Output', 'Cache read', 'Thinking', 'Total cost']) && body.includes('11,280') && body.includes('5,640') && body.includes('No API bill'), modelHeaders)
  await model.context.close()

  const trend = await contextFor({ width: 1440, height: 1000 })
  const trendEvidence = await trend.page.evaluate(() => ({
    points: document.querySelectorAll('.trend-point').length,
    lines: document.querySelectorAll('.trend-line').length,
    bars: document.querySelectorAll('.bar, .bars, .bar-column').length,
    stems: document.querySelectorAll('.trend-stem').length,
    yAxisTitle: document.querySelector('.chart-y-axis > strong')?.textContent?.trim() ?? '',
    yLabels: [...document.querySelectorAll('.chart-y-labels span')].map(node => node.textContent?.trim()),
    xLabels: [...document.querySelectorAll('.line-x-labels span')].map(node => node.textContent?.trim()),
    plotBorderLeft: getComputedStyle(document.querySelector('.line-plot')).borderLeftStyle,
    plotBorderBottom: getComputedStyle(document.querySelector('.line-plot')).borderBottomStyle,
    plotBorderTop: getComputedStyle(document.querySelector('.line-plot')).borderTopStyle,
    plotBackgroundImage: getComputedStyle(document.querySelector('.line-plot')).backgroundImage,
    midpointGuide: getComputedStyle(document.querySelector('.line-plot'), '::before').content,
    label: document.querySelector('.line-chart-shell')?.getAttribute('aria-label') ?? '',
  }))
  await trend.page.getByRole('radio', { name: 'Cost' }).click()
  const costAxis = await trend.page.evaluate(() => ({
    title: document.querySelector('.chart-y-axis > strong')?.textContent?.trim() ?? '',
    label: document.querySelector('.line-chart-shell')?.getAttribute('aria-label') ?? '',
  }))
  check('VAL-016', 'Usage over time is an open-top coordinate plot with metric-aware Y-axis and no bars or point stems', trendEvidence.points === 29 && trendEvidence.lines === 1 && trendEvidence.bars === 0 && trendEvidence.stems === 0 && trendEvidence.yAxisTitle === 'Tokens' && trendEvidence.yLabels.length === 3 && trendEvidence.xLabels.length === 5 && trendEvidence.plotBorderLeft === 'solid' && trendEvidence.plotBorderBottom === 'solid' && trendEvidence.plotBorderTop === 'none' && trendEvidence.plotBackgroundImage === 'none' && trendEvidence.midpointGuide === '""' && trendEvidence.label.includes('X-axis: date in UTC') && trendEvidence.label.includes('Y-axis: tokens') && costAxis.title === 'Cost (USD)' && costAxis.label.includes('Y-axis: estimated cost in USD'), { tokenAxis: trendEvidence, costAxis })
  await trend.context.close()

  const languageAudit = await contextFor({ width: 1440, height: 1000 })
  const directionBodies = []
  for (const path of ['/?direction=focus', '/?direction=dense']) {
    await navigate(languageAudit.page, path)
    directionBodies.push(await languageAudit.page.locator('body').innerText())
  }
  const foundForbiddenLanguage = forbiddenProductLanguage.filter(text => directionBodies.some(value => value.includes(text)))
  check('VAL-017', 'Both clean directions omit prior-period, comparison, and driver terminology', foundForbiddenLanguage.length === 0, foundForbiddenLanguage)
  await languageAudit.context.close()

  check('VAL-018', 'No unexpected browser errors', result.browserErrors.length === 0, result.browserErrors)
  result.pass = true
} catch (error) {
  result.pass = false
  result.failure = error instanceof Error ? error.message : String(error)
} finally {
  await browser.close()
  await writeFile(resolve(evidenceRoot, 'browser-validation.json'), JSON.stringify(result, null, 2))
  console.log(JSON.stringify(result, null, 2))
  if (!result.pass) process.exitCode = 1
}
