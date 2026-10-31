#!/usr/bin/env node
// Designer's scratch screenshot helper for projects-left-navigation: node pln-shot.mjs <path> <out.png> [width height] 
import { chromium } from 'playwright-core'
const [path = '/workspace', out = '/tmp/pln-shots/x.png', w = '1440', h = '900'] = process.argv.slice(2)
const BASE = process.env.BASE || 'http://127.0.0.1:4960'
const CHROME = process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const browser = await chromium.launch({ headless: true, executablePath: CHROME })
const page = await (await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 })).newPage()
page.on('pageerror', e => console.log('PAGEERROR', e.message))
await page.goto(BASE + path, { waitUntil: 'load' })
await page.waitForTimeout(4000)
await page.screenshot({ path: out })
await browser.close()
