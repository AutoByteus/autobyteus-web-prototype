const shot = async (n) => { await page.waitForTimeout(500); await page.screenshot({ path: `/tmp/adr/n-${n}.png` }) }
await page.evaluate(() => { const p = document.querySelector('#__nuxt').__vue_app__.config.globalProperties.$pinia; })
await page.goto(page.url().replace('/workspace', '/chat?id=run-tvp-0001'), { waitUntil: 'networkidle' }).catch(() => {})
await page.waitForTimeout(2000)
await shot('a-run')
const btn = page.locator('[data-test="agent-missing-reconnect"]')
if (await btn.count()) { await btn.click(); await shot('b-dialog') }
