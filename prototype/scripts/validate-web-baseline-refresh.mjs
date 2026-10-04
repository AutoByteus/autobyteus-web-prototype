#!/usr/bin/env node
// WEB-BASELINE-REFRESH-001/-002 paired source/prototype route and state matrix.
//
// Runs the pinned source (served from an exact export against the synthetic
// observation node) and the independently runnable prototype under identical
// browser, viewport, locale, theme, motion, font, asset and fixture conditions,
// and compares visible text, route, semantic controls, DOM geometry/computed
// style signature and the rendered screenshot for every row.
import { chromium } from 'playwright-core'
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import sharp from 'sharp'

const root = resolve(new URL('../..', import.meta.url).pathname)
const sourceBaseUrl = process.env.SOURCE_BASE_URL || 'http://127.0.0.1:4291'
const prototypeBaseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4199'
const mockBaseUrl = process.env.MOCK_BASE_URL || 'http://127.0.0.1:4391'
const chromiumPath = process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const evidenceRoot = resolve(root, process.env.EVIDENCE_DIR || 'evidence/WEB-BASELINE-REFRESH-001/matrix')
const normalizedStyle = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'
const require = createRequire(import.meta.url)
const iconCollections = Object.fromEntries(['heroicons', 'ph', 'mdi', 'svg-spinners', 'vscode-icons', 'logos'].map(prefix => [prefix, require(`@iconify-json/${prefix}/icons.json`)]))
const sha256 = value => createHash('sha256').update(value).digest('hex')

export const ROUTES = [
  '/', '/agents?view=list', '/agents?view=create', '/agents?view=detail&id=agent-researcher', '/agents?view=edit&id=agent-researcher', '/agents?view=unsupported',
  '/agent-teams?view=team-list', '/agent-teams?view=team-create', '/agent-teams?view=team-detail&id=team-product', '/agent-teams?view=team-edit&id=team-product', '/agent-teams?view=unsupported',
  '/agent-orgs?view=org-list', '/agent-orgs?view=org-create', '/agent-orgs?view=org-detail&id=org-product-launch', '/agent-orgs?view=org-edit&id=org-product-launch',
  '/applications', '/applications/sample-app', '/skills', '/skills?skill=prototype-research',
  '/memory?view=home&tab=agents', '/memory?view=home&tab=teams', '/memory?view=home&tab=orgs',
  '/memory?view=agent-detail&agentDefinitionId=agent-researcher&agentName=Research%20Assistant',
  '/memory?view=team-detail&teamDefinitionId=team-product&teamName=Product%20Review%20Team',
  '/memory?view=org-detail&orgDefinitionId=org-product-launch&orgName=Product%20Launch%20Org',
  '/memory?view=unsupported',
  '/nodes?tab=manage', '/nodes?tab=memorySync', '/nodes?tab=phoneSetup', '/nodes?tab=dockerGuide',
  '/projects', '/projects/project-prototype-launch',
  '/workspace', '/tools', '/media',
  ...['api-keys', 'token-usage', 'display', 'language', 'local-tools', 'mcp-servers', 'application-packages', 'agent-packages',
    'server-settings&mode=quick', 'server-settings&mode=advanced', 'server-settings&mode=migrations', 'extensions', 'updates']
    .map(section => `/settings?section=${section}`),
  // WEB-BASELINE-REFRESH-002: the Chat entry surface shipped at 57df63f.
  '/chat',
  // WEB-BASELINE-REFRESH-004 (0a32261): Project and Task authoring pages.
  '/projects/new', '/projects/project-prototype-launch/edit', '/projects/project-prototype-launch/tasks/new',
  '/projects/project-prototype-launch/tasks/task-outline', '/projects/project-prototype-launch/tasks/task-outline/edit',
]

const VARIANTS = [
  { suffix: 'DEN', viewport: 'desktop', locale: 'en' },
  { suffix: 'DZH', viewport: 'desktop', locale: 'zh-CN' },
  { suffix: 'NEN', viewport: 'narrow', locale: 'en' },
  { suffix: 'NZH', viewport: 'narrow', locale: 'zh-CN' },
]

const routeRows = ROUTES.flatMap((path, index) => VARIANTS.map(variant => ({
  id: `WBR-R${String(index + 1).padStart(3, '0')}-${variant.suffix}`,
  kind: 'route', path, scenario: 'populated', ...variant,
})))

const stateRows = [
  { id: 'WBR-S001', path: '/agents?view=list', scenario: 'empty' },
  { id: 'WBR-S002', path: '/applications', scenario: 'empty' },
  { id: 'WBR-S003', path: '/memory', scenario: 'empty' },
  { id: 'WBR-S004', path: '/skills', scenario: 'empty' },
  { id: 'WBR-S005', path: '/projects', scenario: 'empty' },
  { id: 'WBR-S006', path: '/agent-orgs?view=org-list', scenario: 'empty' },
  { id: 'WBR-S007', path: '/applications', scenario: 'apps_disabled' },
  { id: 'WBR-S008', path: '/projects', scenario: 'projects_disabled' },
  { id: 'WBR-S009', path: '/workspace', scenario: 'projects_disabled' },
  { id: 'WBR-S010', path: '/settings?section=server-settings&mode=quick', scenario: 'projects_disabled' },
  { id: 'WBR-S011', path: '/agents?view=list', scenario: 'loading', waitMs: 250 },
  { id: 'WBR-S012', path: '/agents?view=list', scenario: 'error' },
  { id: 'WBR-S013', path: '/mobile', scenario: 'populated', mobile: 'unpaired', viewport: 'narrow' },
  { id: 'WBR-S014', path: '/mobile', scenario: 'populated', mobile: 'paired', viewport: 'narrow' },
  { id: 'WBR-S015', path: '/mobile?unsupported=desktopSettings', scenario: 'populated', mobile: 'paired', viewport: 'narrow' },
  { id: 'WBR-S016', path: '/mobile', scenario: 'permission_denied', mobile: 'paired', viewport: 'narrow' },
  { id: 'WBR-S017', path: '/skills', scenario: 'skill_name_issues' },
  // WEB-BASELINE-REFRESH-004: Antigravity runtime available (locked auto-approve).
  { id: 'WBR-S018', path: '/chat', scenario: 'agy_runtime' },
].map(row => ({ kind: 'state', viewport: 'desktop', locale: 'en', ...row }))

// Proportionate coverage: every route in the primary configuration (desktop,
// English) plus a representative narrow/zh-CN sample of the main surfaces and
// the surfaces whose layout changes materially. MATRIX_MODE=full restores the
// complete route x viewport x locale matrix.
const SAMPLED_ALTERNATES = new Set([
  'WBR-R002-NEN', 'WBR-R002-DZH', 'WBR-R007-NZH', 'WBR-R012-NEN', 'WBR-R012-DZH', 'WBR-R014-NZH',
  'WBR-R016-NEN', 'WBR-R020-NZH', 'WBR-R027-NEN', 'WBR-R031-NEN', 'WBR-R031-DZH', 'WBR-R032-NZH',
  'WBR-R033-NEN', 'WBR-R033-DZH', 'WBR-R033-NZH', 'WBR-R037-NZH', 'WBR-R039-NEN', 'WBR-R043-DZH',
  'WBR-R049-NEN', 'WBR-R049-DZH',
  'WBR-R050-NEN', 'WBR-R050-DZH', 'WBR-R052-NEN', 'WBR-R053-NEN', 'WBR-R053-NZH',
])
const primaryRows = process.env.MATRIX_MODE === 'full'
  ? routeRows
  : routeRows.filter(row => row.suffix === 'DEN' || SAMPLED_ALTERNATES.has(row.id))
const allRows = [...primaryRows, ...stateRows]
const requested = new Set(String(process.env.MATRIX_IDS || '').split(',').map(value => value.trim()).filter(Boolean))
const requestedPrefix = process.env.MATRIX_PREFIX || ''
const rows = allRows.filter(row => (!requested.size || requested.has(row.id)) && row.id.startsWith(requestedPrefix))

const viewportFor = name => name === 'narrow' ? { width: 390, height: 844 } : { width: 1440, height: 900 }

async function setScenario(name) {
  const response = await fetch(`${mockBaseUrl}/__prototype/scenario`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scenario: name, operationFailures: {} }),
  })
  if (!response.ok) throw new Error(`Unable to select scenario ${name}`)
}

async function capture(browser, baseUrl, target, row) {
  const context = await browser.newContext({ viewport: viewportFor(row.viewport), locale: row.locale === 'zh-CN' ? 'zh-CN' : 'en-US', colorScheme: 'light', reducedMotion: 'reduce', timezoneId: 'UTC' })
  const externalRequests = []
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (['api.iconify.design', 'api.simplesvg.com', 'api.unisvg.com'].includes(url.hostname)) {
      const prefix = url.pathname.split('/').pop()?.replace(/\.json$/, '')
      if (target === 'prototype') externalRequests.push(url.href)
      if (prefix && iconCollections[prefix]) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(iconCollections[prefix]) })
    }
    if (url.protocol === 'data:' || url.protocol === 'blob:' || ['127.0.0.1', 'localhost'].includes(url.hostname)) return route.continue()
    externalRequests.push(url.href)
    return route.abort('blockedbyclient')
  })
  await context.addInitScript(({ locale, mobile, mock, scenario }) => {
    if (sessionStorage.getItem('__wbr_init')) return
    sessionStorage.setItem('__wbr_init', '1')
    localStorage.clear()
    localStorage.setItem('autobyteus.localization.preference-mode', locale)
    localStorage.setItem('autobyteus.prototype.scenario', scenario || 'populated')
    localStorage.setItem('autobyteus.prototype.context', mobile || 'desktop')
    if (mobile === 'paired') {
      localStorage.setItem('autobyteus.remote_access.mobile_session.v1', JSON.stringify({
        version: 1, nodeId: 'mobile-paired-node', serverBaseUrl: mock, credential: 'prototype_mobile_session',
        device: { deviceId: 'prototype-phone', displayName: 'Prototype phone', clientFacingBaseUrl: mock, createdAt: '2026-08-22T04:00:00.000Z', lastSeenAt: '2026-08-22T04:00:00.000Z', revokedAt: null },
        pairedAt: '2026-08-22T04:00:00.000Z',
      }))
    }
  }, { locale: row.locale, mobile: row.mobile, mock: mockBaseUrl, scenario: row.scenario })
  const page = await context.newPage()
  const browserErrors = []
  page.on('pageerror', error => browserErrors.push(`pageerror: ${error.message}`))
  page.on('console', message => { if (message.type() === 'error') browserErrors.push(`console: ${message.text().slice(0, 400)}`) })
  await page.goto(baseUrl + row.path, { waitUntil: 'domcontentloaded', timeout: 60000 })
  if (row.path === '/' || row.scenario.endsWith('_disabled')) await page.waitForURL(url => url.pathname !== new URL(baseUrl + row.path).pathname, { timeout: 5000 }).catch(() => undefined)
  await page.waitForTimeout(row.waitMs ?? 1500)
  await page.waitForFunction(() => (document.body?.innerText.trim().length || 0) > 0, undefined, { timeout: row.waitMs ? 1500 : 15000 }).catch(() => undefined)
  if (!row.waitMs) {
    await page.waitForFunction(() => Array.from(document.querySelectorAll('svg.iconify')).every(icon => icon.querySelector('path,g,rect,circle,line,polyline,polygon')), undefined, { timeout: 10000 }).catch(() => undefined)
    await page.waitForFunction(async () => {
      const signature = () => `${document.body?.innerText || ''}\n${document.body?.innerHTML.length || 0}`
      const first = signature()
      await new Promise(done => setTimeout(done, 250))
      const second = signature()
      await new Promise(done => setTimeout(done, 250))
      return first === second && second === signature()
    }, undefined, { timeout: 15000 }).catch(() => undefined)
  }
  await page.addStyleTag({ content: normalizedStyle })
  await page.waitForTimeout(60)
  const directory = resolve(evidenceRoot, target)
  await mkdir(directory, { recursive: true })
  const screenshotPath = resolve(directory, `${row.id}.png`)
  const screenshot = await page.screenshot({ path: screenshotPath })
  const bodyText = await page.locator('body').innerText()
  const dom = await page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect()
      if (!rect.width || !rect.height) return false
      const style = getComputedStyle(element)
      return style.visibility !== 'hidden' && style.display !== 'none'
    }
    const round = value => Math.round(value * 2) / 2
    const elements = Array.from(document.body.querySelectorAll('*')).filter(visible)
    return {
      route: location.pathname + location.search,
      lang: document.documentElement.lang,
      controls: Array.from(document.body.querySelectorAll('button,input,select,textarea,a,[role]')).map(node => ({ tag: node.tagName, role: node.getAttribute('role'), label: node.getAttribute('aria-label'), text: node.textContent?.trim().slice(0, 120), disabled: 'disabled' in node ? Boolean(node.disabled) : undefined })),
      geometry: elements.map(element => {
        const rect = element.getBoundingClientRect()
        const style = getComputedStyle(element)
        return [element.tagName, round(rect.x), round(rect.y), round(rect.width), round(rect.height), style.color, style.backgroundColor, style.borderTopColor, style.fontSize, style.fontWeight].join('|')
      }),
    }
  })
  await context.close()
  return {
    target, screenshotPath, screenshotSha256: sha256(screenshot), bodyText, bodyTextSha256: sha256(bodyText),
    route: dom.route, lang: dom.lang, controlsSha256: sha256(JSON.stringify(dom.controls)), geometry: dom.geometry,
    geometrySha256: sha256(JSON.stringify(dom.geometry)), browserErrors, externalRequests,
  }
}

async function perceptual(sourcePath, prototypePath, row) {
  const [source, prototype] = await Promise.all([
    sharp(sourcePath).removeAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(prototypePath).removeAlpha().raw().toBuffer({ resolveWithObject: true }),
  ])
  if (source.info.width !== prototype.info.width || source.info.height !== prototype.info.height) {
    return { dimensionsEqual: false, changedPixels: null, changedPixelRatio: 1, maximumChannelDelta: 255, changedBox: null, noiseClass: null }
  }
  const width = source.info.width
  let changedPixels = 0; let maximumChannelDelta = 0; let lowDeltaPixels = 0
  let x0 = Infinity; let y0 = Infinity; let x1 = -1; let y1 = -1
  const diff = Buffer.alloc(source.data.length)
  for (let index = 0; index < source.data.length; index += 3) {
    let delta = 0
    for (let channel = 0; channel < 3; channel += 1) delta = Math.max(delta, Math.abs(source.data[index + channel] - prototype.data[index + channel]))
    const gray = Math.round(source.data[index] * 0.15 + 216)
    if (delta) {
      changedPixels += 1
      if (delta <= 2) lowDeltaPixels += 1
      maximumChannelDelta = Math.max(maximumChannelDelta, delta)
      const pixel = index / 3; const x = pixel % width; const y = Math.floor(pixel / width)
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y)
      diff[index] = 255; diff[index + 1] = 0; diff[index + 2] = 0
    } else { diff[index] = gray; diff[index + 1] = gray; diff[index + 2] = gray }
  }
  const totalPixels = width * source.info.height
  const changedPixelRatio = changedPixels / totalPixels
  let diffPath = null
  if (changedPixels) {
    await mkdir(resolve(evidenceRoot, 'diff'), { recursive: true })
    diffPath = resolve(evidenceRoot, 'diff', `${row.id}.png`)
    await sharp(diff, { raw: { width, height: source.info.height, channels: 3 } }).png().toFile(diffPath)
  }
  // Same bound as the established baseline comparison: at most 0.01% of the
  // frame (antialiased SVG/border-corner edge pixels) with identical text,
  // route and controls. Geometry and computed-style signatures are recorded
  // alongside and must also be identical for an exact pass.
  return {
    dimensionsEqual: true, changedPixels, totalPixels, changedPixelRatio, maximumChannelDelta,
    changedBox: changedPixels ? [x0, y0, x1, y1] : null, diffPath,
    lowDeltaPixels,
    // Class A: sub-region antialiasing (the established baseline bound).
    // Class B: compositing/alpha-blend rounding - at least 99% of changed
    // pixels differ by <=2/255 and none by more than 16/255. Both classes also
    // require identical text, route, controls, geometry and computed styles.
    noiseClass: changedPixelRatio <= 0.0001 && maximumChannelDelta <= 64 ? 'A-edge-antialiasing'
      : changedPixels && lowDeltaPixels / changedPixels >= 0.99 && maximumChannelDelta <= 16 ? 'B-compositing-rounding' : null,
  }
}

const browser = await chromium.launch({ headless: true, executablePath: chromiumPath, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking', '--font-render-hinting=none'] })
const results = []
try {
  for (const row of rows) {
    await setScenario(row.scenario)
    const source = await capture(browser, sourceBaseUrl, 'source', row)
    await setScenario(row.scenario)
    const prototype = await capture(browser, prototypeBaseUrl, 'prototype', row)
    const pixels = await perceptual(source.screenshotPath, prototype.screenshotPath, row)
    const comparison = {
      routeEqual: source.route === prototype.route,
      bodyTextEqual: source.bodyTextSha256 === prototype.bodyTextSha256,
      controlsEqual: source.controlsSha256 === prototype.controlsSha256,
      geometryEqual: source.geometrySha256 === prototype.geometrySha256,
      screenshotEqual: source.screenshotSha256 === prototype.screenshotSha256,
      pixels,
      prototypeBrowserErrors: prototype.browserErrors.length,
      prototypeExternalRequests: prototype.externalRequests.length,
    }
    comparison.pass = comparison.routeEqual && comparison.bodyTextEqual && comparison.controlsEqual && comparison.geometryEqual
      && (comparison.screenshotEqual || Boolean(pixels.noiseClass))
      && prototype.browserErrors.length === 0 && prototype.externalRequests.length === 0
    const geometryDelta = comparison.geometryEqual ? [] : (() => {
      const other = new Set(prototype.geometry)
      const mine = new Set(source.geometry)
      return [...source.geometry.filter(entry => !other.has(entry)).slice(0, 6).map(entry => `S ${entry}`), ...prototype.geometry.filter(entry => !mine.has(entry)).slice(0, 6).map(entry => `P ${entry}`)]
    })()
    delete source.geometry; delete prototype.geometry
    results.push({ row, source, prototype, comparison, geometryDelta })
    process.stdout.write(`${comparison.pass ? 'PASS' : 'FAIL'} ${row.id} ${row.scenario} ${row.path} text=${comparison.bodyTextEqual} geo=${comparison.geometryEqual} px=${pixels.changedPixels} max=${pixels.maximumChannelDelta}${source.route !== prototype.route ? ` routes=${source.route}|${prototype.route}` : ''}${prototype.browserErrors.length ? ` protoErrors=${prototype.browserErrors.length}` : ''}\n`)
    if (!comparison.pass && process.env.VERBOSE) {
      if (!comparison.bodyTextEqual) {
        const s = source.bodyText.split('\n'); const p = prototype.bodyText.split('\n'); const ps = new Set(p); const ss = new Set(s)
        process.stdout.write(`   source-only: ${JSON.stringify(s.filter(line => !ps.has(line)).slice(0, 8))}\n   proto-only: ${JSON.stringify(p.filter(line => !ss.has(line)).slice(0, 8))}\n`)
      }
      if (geometryDelta.length) process.stdout.write(`   geometry: ${JSON.stringify(geometryDelta)}\n`)
      if (prototype.browserErrors.length) process.stdout.write(`   protoErrors: ${JSON.stringify(prototype.browserErrors.slice(0, 4))}\n`)
    }
  }
} finally {
  await setScenario('populated').catch(() => undefined)
  await browser.close()
}

await mkdir(evidenceRoot, { recursive: true })
const tag = process.env.RESULT_TAG ? `-${process.env.RESULT_TAG}` : ''
await writeFile(resolve(evidenceRoot, `results${tag}.json`), `${JSON.stringify({ generatedAt: new Date().toISOString(), sourceBaseUrl, prototypeBaseUrl, mockBaseUrl, chromiumPath, normalizedStyle, rows: results }, null, 2)}\n`)
const summary = {
  generatedAt: new Date().toISOString(),
  total: results.length,
  passed: results.filter(result => result.comparison.pass).length,
  exactPixelRows: results.filter(result => result.comparison.screenshotEqual).length,
  noiseOnlyRows: results.filter(result => !result.comparison.screenshotEqual && result.comparison.pass).map(result => ({ id: result.row.id, noiseClass: result.comparison.pixels.noiseClass, changedPixels: result.comparison.pixels.changedPixels, maximumChannelDelta: result.comparison.pixels.maximumChannelDelta })),
  failed: results.filter(result => !result.comparison.pass).map(result => result.row.id),
  sourceBrowserErrorRows: results.filter(result => result.source.browserErrors.length).map(result => result.row.id),
  prototypeBrowserErrorRows: results.filter(result => result.prototype.browserErrors.length).map(result => result.row.id),
}
await writeFile(resolve(evidenceRoot, `summary${tag}.json`), `${JSON.stringify(summary, null, 2)}\n`)
process.stdout.write(`${summary.passed}/${summary.total} pass; exact-pixel ${summary.exactPixelRows}; failed ${summary.failed.length}\n`)
if (summary.failed.length) process.exitCode = 1
