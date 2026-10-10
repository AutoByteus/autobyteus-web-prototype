import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/collapsed-left-panel-expand-keeps-run/node_modules/playwright-core/index.mjs';
const browser = await chromium.launch();
for (const H of [481, 500, 540, 541, 900]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: H } });
  await page.goto('http://127.0.0.1:4610/chat?id=run-ptm-0001'); await page.waitForTimeout(2200);
  await page.click('[data-test="app-left-panel-collapse"]'); await page.waitForTimeout(300);
  console.log(H, await page.evaluate(() => { const s=document.querySelector('[data-test="workspace-left-navigation-strip"]'); const set=s.querySelector('[data-nav-key="settings"]').getBoundingClientRect(); return {sh:s.scrollHeight, ch:s.clientHeight, settingsBottom:set.bottom, divider: getComputedStyle(s.querySelector('[data-test="workspace-left-strip-expand-divider"]')).display}; }));
  if (H===500) await page.screenshot({ path: '/tmp/clpe/strip-500.png', clip: {x:0,y:0,width:200,height:500} });
  await page.close();
}
const page = await browser.newPage({ viewport: { width: 760, height: 900 } });
await page.goto('http://127.0.0.1:4610/chat?id=run-ptm-0001'); await page.waitForTimeout(2200);
await page.focus('[data-test="workspace-left-strip-expand"]'); await page.keyboard.press('Enter'); await page.waitForTimeout(800);
await page.keyboard.press('Escape'); await page.waitForTimeout(600);
console.log('after escape focus:', await page.evaluate(() => document.activeElement?.getAttribute('data-test')));
await browser.close();
