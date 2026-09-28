#!/usr/bin/env node
// Quick paired source/prototype probe used during the WEB-BASELINE-REFRESH-001 refresh.
import { chromium } from 'playwright-core'
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'
const require = createRequire(import.meta.url)
const icons = Object.fromEntries(['heroicons', 'ph', 'mdi', 'svg-spinners', 'vscode-icons', 'logos'].map(p => [p, require(`@iconify-json/${p}/icons.json`)]))
const SOURCE = process.env.SOURCE_BASE_URL || 'http://127.0.0.1:4291'
const PROTO = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4199'
const MOCK = process.env.MOCK_BASE_URL || 'http://127.0.0.1:4391'
const OUT = process.env.OUT || '/tmp/autobyteus-prototype-WEB-BASELINE-REFRESH-001/probe'
const CHROME = process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const paths = process.argv.slice(2)
const style = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'
const viewport = process.env.VIEWPORT === 'narrow' ? { width: 390, height: 844 } : { width: 1440, height: 900 }
const locale = process.env.LOCALE || 'en'
const scenario = process.env.SCENARIO || 'populated'
await fetch(`${MOCK}/__prototype/scenario`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scenario, operationFailures: {} }) })
const browser = await chromium.launch({ headless: true, executablePath: CHROME, args: ['--no-sandbox', '--disable-background-networking', '--font-render-hinting=none'] })
await mkdir(OUT, { recursive: true })
async function cap(base, tag, path) {
  const ctx = await browser.newContext({ viewport, locale: locale === 'zh-CN' ? 'zh-CN' : 'en-US', colorScheme: 'light', reducedMotion: 'reduce', timezoneId: 'UTC' })
  await ctx.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (['api.iconify.design', 'api.simplesvg.com', 'api.unisvg.com'].includes(url.hostname)) {
      const prefix = url.pathname.split('/').pop()?.replace(/\.json$/, '')
      if (prefix && icons[prefix]) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(icons[prefix]) })
    }
    if (['data:', 'blob:'].includes(url.protocol) || ['127.0.0.1', 'localhost'].includes(url.hostname)) return route.continue()
    return route.abort('blockedbyclient')
  })
  await ctx.addInitScript(({ locale, scenario }) => {
    if (sessionStorage.getItem('__probe_init')) return
    sessionStorage.setItem('__probe_init', '1')
    localStorage.clear()
    localStorage.setItem('autobyteus.localization.preference-mode', locale)
    localStorage.setItem('autobyteus.prototype.scenario', scenario)
    localStorage.setItem('autobyteus.prototype.context', 'desktop')
  }, { locale, scenario })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', e => errors.push('pageerror: ' + e.message))
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 300)) })
  await page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 60000 })
  if (path === '/') await page.waitForURL(u => u.pathname !== '/', { timeout: 5000 }).catch(() => {})
  await page.waitForFunction(() => document.body?.innerText.trim().length > 0, undefined, { timeout: 30000 }).catch(() => {})
  await page.waitForTimeout(Number(process.env.WAIT || 1500))
  await page.addStyleTag({ content: style })
  await page.waitForTimeout(80)
  const name = path.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'root'
  const file = resolve(OUT, `${name}.${process.env.VIEWPORT || 'desktop'}.${locale}.${tag}.png`)
  await page.screenshot({ path: file })
  const text = await page.locator('body').innerText()
  const route = await page.evaluate(() => location.pathname + location.search)
  await ctx.close()
  return { file, text, errors, route }
}
async function diff(a, b) {
  const [s, p] = await Promise.all([sharp(a).removeAlpha().raw().toBuffer({ resolveWithObject: true }), sharp(b).removeAlpha().raw().toBuffer({ resolveWithObject: true })])
  let changed = 0, max = 0, x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1
  const w = s.info.width
  for (let i = 0; i < s.data.length; i += 3) { let c = false; for (let k = 0; k < 3; k++) { const d = Math.abs(s.data[i + k] - p.data[i + k]); if (d) c = true; if (d > max) max = d } if (c) { changed++; const px = (i / 3) % w, py = Math.floor(i / 3 / w); x0 = Math.min(x0, px); y0 = Math.min(y0, py); x1 = Math.max(x1, px); y1 = Math.max(y1, py) } }
  return { changed, max, box: changed ? [x0, y0, x1, y1] : null }
}
const results = []
for (const path of paths) {
  const s = await cap(SOURCE, 'source', path)
  const p = await cap(PROTO, 'proto', path)
  const d = await diff(s.file, p.file)
  const textEq = s.text === p.text
  results.push({ path, route: [s.route, p.route], textEq, ...d, sErr: s.errors, pErr: p.errors })
  console.log(`${textEq && d.changed === 0 ? 'SAME' : 'DIFF'} ${path} text=${textEq} px=${d.changed} max=${d.max} box=${d.box} routes=${s.route}|${p.route} srcErr=${s.errors.length} protoErr=${p.errors.length}`)
  if (!textEq && process.env.SHOWTEXT) {
    const sl = s.text.split('\n'), pl = p.text.split('\n')
    const setP = new Set(pl), setS = new Set(sl)
    console.log('  source-only:', sl.filter(x => !setP.has(x)).slice(0, 15))
    console.log('  proto-only :', pl.filter(x => !setS.has(x)).slice(0, 15))
  }
  if (process.env.SHOWERR) { console.log('  sErr', s.errors.slice(0, 5)); console.log('  pErr', p.errors.slice(0, 8)) }
}
await writeFile(resolve(OUT, 'last-results.json'), JSON.stringify(results, null, 2))
await browser.close()
