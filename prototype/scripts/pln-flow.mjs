#!/usr/bin/env node
// scratch: node pln-flow.mjs out.png "step;step" [w h]; steps: click:<text> | clicksel:<css> | wait:<ms> | goto:<path> | key:<k> | fill:<css>=<text>
import { chromium } from 'playwright-core'
const [out, stepsArg = '', w = '1440', h = '900'] = process.argv.slice(2)
const BASE = process.env.BASE || 'http://127.0.0.1:4960'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const browser = await chromium.launch({ headless: true, executablePath: CHROME })
const ctx = await browser.newContext({ viewport: { width: +w, height: +h } })
const page = await ctx.newPage()
page.on('pageerror', e => console.log('PAGEERROR', e.message))
await page.goto(BASE + '/workspace', { waitUntil: 'load' }); await page.waitForTimeout(3500)
for (const s of stepsArg.split(';').filter(Boolean)) {
  const [k, ...r] = s.split(':'); const v = r.join(':')
  if (k === 'click') await page.getByText(v, { exact: true }).first().click()
  else if (k === 'clicksel') await page.locator(v).first().click()
  else if (k === 'goto') { await page.goto(BASE + v, { waitUntil: 'load' }); await page.waitForTimeout(3000) }
  else if (k === 'ls') { const [a, ...b] = v.split('='); await page.evaluate(([x, y]) => localStorage.setItem(x, y), [a, b.join('=')]) }
  else if (k === 'reload') { await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(3500) }
  else if (k === 'mouse') { const [x, y] = v.split(',').map(Number); await page.mouse.click(x, y) }
  else if (k === 'hover') await page.locator(v).first().hover()
  else if (k === 'key') await page.keyboard.press(v)
  else if (k === 'wait') await page.waitForTimeout(+v)
  else if (k === 'js') console.log(JSON.stringify(await page.evaluate(v)))
  await page.waitForTimeout(700)
}
await page.screenshot({ path: out })
await browser.close()
