#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright-core'

const root = resolve(new URL('../..', import.meta.url).pathname)
const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:3261'
const outputRoot = resolve(root, 'tickets/done/REQPKG-TSUI-001/visual-references')
await mkdir(outputRoot, { recursive: true })

const references = []
const browserErrors = []
const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] })

async function openScenario(scenario, width = 1440, height = 900) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    locale: 'en-US',
    timezoneId: 'UTC',
    colorScheme: 'light',
    reducedMotion: 'reduce',
    acceptDownloads: false,
  })
  await context.addInitScript(selectedScenario => {
    localStorage.clear()
    localStorage.setItem('autobyteus.prototype.scenario', selectedScenario)
    localStorage.setItem('autobyteus.localization.preference-mode', 'en')
  }, scenario)
  const page = await context.newPage()
  page.on('console', message => { if (message.type() === 'error') browserErrors.push({ scenario, text: message.text() }) })
  page.on('pageerror', error => browserErrors.push({ scenario, text: error.message }))
  await page.goto(`${baseUrl}/settings?section=token-usage`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => document.body?.innerText.includes('Token usage analytics loaded.'), undefined, { timeout: 20_000 })
  await page.waitForTimeout(150)
  return { context, page }
}

async function capture({ id, filename, scenario, state, viewport, journeys, requirements, acceptanceCriteria, prepare, captureLocator }) {
  const { context, page } = await openScenario(scenario, viewport.width, viewport.height)
  try {
    if (prepare) await prepare(page)
    await page.waitForTimeout(150)
    const path = resolve(outputRoot, filename)
    if (captureLocator) await captureLocator(page).screenshot({ path, animations: 'disabled' })
    else await page.screenshot({ path, animations: 'disabled' })
    const bytes = await readFile(path)
    references.push({
      visualId: id,
      filename,
      path,
      scenario,
      state,
      viewport,
      journeys,
      requirements,
      acceptanceCriteria,
      sha256: createHash('sha256').update(bytes).digest('hex'),
      byteLength: bytes.length,
    })
  } finally {
    await context.close()
  }
}

try {
  await capture({
    id: 'VIS-009',
    filename: 'VIS-009-final-analytics-partial-desktop-1440x900.png',
    scenario: 'token_partial',
    state: 'Analytics · partial coverage · Tokens · all usage',
    viewport: { width: 1440, height: 900 },
    journeys: ['UXJ-001', 'SCN-001'],
    requirements: ['REQ-001', 'REQ-002', 'REQ-004', 'REQ-005', 'REQ-009', 'REQ-012', 'REQ-015', 'REQ-016'],
    acceptanceCriteria: ['AC-001', 'AC-003', 'AC-004', 'AC-013', 'AC-015', 'AC-016'],
  })

  await capture({
    id: 'VIS-010',
    filename: 'VIS-010-final-analytics-filters-open-desktop-1440x900.png',
    scenario: 'populated',
    state: 'Analytics · focused Filters disclosure open',
    viewport: { width: 1440, height: 900 },
    journeys: ['UXJ-003', 'SCN-003'],
    requirements: ['REQ-003', 'REQ-009', 'REQ-011', 'REQ-012'],
    acceptanceCriteria: ['AC-002', 'AC-010', 'AC-011'],
    prepare: async page => {
      await page.getByRole('button', { name: /^Filters/ }).click()
      await page.locator('#token-usage-filter-panel').waitFor({ state: 'visible' })
    },
  })

  await capture({
    id: 'VIS-011',
    filename: 'VIS-011-final-detailed-usage-expanded-desktop-1440x900.png',
    scenario: 'populated',
    state: 'Analytics · Detailed usage · Provider grouping · exact row disclosed',
    viewport: { width: 1440, height: 900 },
    journeys: ['UXJ-003', 'SCN-003'],
    requirements: ['REQ-006', 'REQ-008', 'REQ-009', 'REQ-011', 'REQ-012', 'REQ-016'],
    acceptanceCriteria: ['AC-005', 'AC-006', 'AC-008', 'AC-010', 'AC-011', 'AC-016'],
    prepare: async page => {
      const section = page.locator('[data-testid="detailed-usage-section"]')
      await section.getByLabel('Breakdown grouping').selectOption('PROVIDER')
      await section.getByRole('button', { name: 'Details', exact: true }).first().click()
      await section.scrollIntoViewIfNeeded()
    },
    captureLocator: page => page.locator('[data-testid="detailed-usage-section"]'),
  })

  await capture({
    id: 'VIS-012',
    filename: 'VIS-012-final-analytics-cost-full-desktop-1440x900.png',
    scenario: 'populated',
    state: 'Analytics · full coverage · Cost (USD)',
    viewport: { width: 1440, height: 900 },
    journeys: ['UXJ-002', 'SCN-002'],
    requirements: ['REQ-002', 'REQ-004', 'REQ-005', 'REQ-007', 'REQ-008', 'REQ-012', 'REQ-015', 'REQ-016'],
    acceptanceCriteria: ['AC-001', 'AC-003', 'AC-004', 'AC-007', 'AC-008', 'AC-011', 'AC-015', 'AC-016'],
    prepare: async page => {
      await page.getByRole('radio', { name: 'Cost', exact: true }).click()
      await page.getByText('Cost (USD)', { exact: true }).waitFor()
    },
  })

  await capture({
    id: 'VIS-013',
    filename: 'VIS-013-final-run-details-task-expanded-desktop-1440x900.png',
    scenario: 'populated',
    state: 'Run details · Task grouping · Team hierarchy expanded',
    viewport: { width: 1440, height: 900 },
    journeys: ['UXJ-005', 'SCN-005'],
    requirements: ['REQ-001', 'REQ-009', 'REQ-011', 'REQ-013', 'REQ-014'],
    acceptanceCriteria: ['AC-010', 'AC-012', 'AC-013'],
    prepare: async page => {
      await page.getByRole('tab', { name: 'Run details' }).click()
      await page.getByText('The date range selects runs by creation time; totals show each selected run’s lifetime usage.').waitFor()
      await page.getByRole('button', { name: 'Expand team members' }).click()
      await page.getByText(/\/researcher/).first().waitFor()
    },
  })

  await capture({
    id: 'VIS-014',
    filename: 'VIS-014-final-run-details-model-desktop-1440x900.png',
    scenario: 'populated',
    state: 'Run details · Model grouping',
    viewport: { width: 1440, height: 900 },
    journeys: ['UXJ-005', 'SCN-005'],
    requirements: ['REQ-001', 'REQ-009', 'REQ-011', 'REQ-013', 'REQ-014'],
    acceptanceCriteria: ['AC-010', 'AC-012', 'AC-013'],
    prepare: async page => {
      await page.getByRole('tab', { name: 'Run details' }).click()
      await page.getByRole('radio', { name: 'Model', exact: true }).click()
      await page.getByText('LLM Model', { exact: true }).waitFor()
    },
  })

  await capture({
    id: 'VIS-015',
    filename: 'VIS-015-final-analytics-partial-narrow-390x844.png',
    scenario: 'token_partial',
    state: 'Analytics · partial coverage · narrow/mobile-equivalent',
    viewport: { width: 390, height: 844 },
    journeys: ['UXJ-004', 'SCN-004'],
    requirements: ['REQ-002', 'REQ-003', 'REQ-009', 'REQ-011', 'REQ-014', 'REQ-015', 'REQ-016'],
    acceptanceCriteria: ['AC-001', 'AC-002', 'AC-005', 'AC-010', 'AC-013', 'AC-015', 'AC-016'],
  })
} finally {
  await browser.close()
}

if (browserErrors.length) throw new Error(`Browser errors while capturing final references:\n${JSON.stringify(browserErrors, null, 2)}`)

const manifest = {
  packageId: 'REQPKG-TSUI-001',
  status: 'Normative final references captured after explicit user approval',
  approvalReference: 'User explicitly approved the final product prototype in conversation on 2026-08-29.',
  requirementsRevision: 'RER-009',
  requirementsCommit: '6aa6ba066faf041ff1fa221cee5b956fd7e537b5',
  sourcePin: '9d0fd7c570d58da1af2c7a40279327c8a20a8093',
  baseUrl,
  capturedAt: new Date().toISOString(),
  browserErrors,
  references,
}
await writeFile(resolve(outputRoot, 'final-reference-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Captured ${references.length} normative Token Statistics final references.`)
