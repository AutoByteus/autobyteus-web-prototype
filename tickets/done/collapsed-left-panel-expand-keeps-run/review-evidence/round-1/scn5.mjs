import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/collapsed-left-panel-expand-keeps-run/node_modules/playwright-core/index.mjs';
const browser = await chromium.launch();
const out = (...a) => console.log(...a);
// SCN-005: narrow window drawer
{
  const page = await browser.newPage({ viewport: { width: 760, height: 900 } });
  page.on('pageerror', e => out('PAGEERR', e.message));
  await page.goto('http://127.0.0.1:4610/chat?id=run-ptm-0001');
  await page.waitForTimeout(2500);
  out('strip activation', await page.getAttribute('[data-test="workspace-left-navigation-strip"]', 'data-strip-activation'));
  await page.screenshot({ path: '/tmp/clpe/s5-narrow-strip.png' });
  await page.keyboard.press('Tab');
  out('first tab focus:', await page.evaluate(() => document.activeElement?.getAttribute('data-test') || document.activeElement?.tagName));
  await page.focus('[data-test="workspace-left-strip-expand"]');
  await page.keyboard.press('Enter'); await page.waitForTimeout(1200);
  out('drawer?', await page.locator('[data-test="app-left-navigation-drawer"]').count(), page.url());
  out(await page.evaluate(() => { const c=document.querySelector('[data-test="workspace-history-tree-scroll"]'); const rows=[...c.querySelectorAll('[aria-current="true"],[aria-selected="true"]')]; return rows.map(r=>r.innerText.trim().replace(/\s+/g,' ')); }));
  await page.screenshot({ path: '/tmp/clpe/s5-drawer.png' });
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
  out('after escape focus:', await page.evaluate(() => document.activeElement?.getAttribute('data-test')), page.url());
  await page.close();
}
// SCN-004: strip nav icon unchanged (expand + navigate)
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://127.0.0.1:4610/chat?id=run-ptm-0001'); await page.waitForTimeout(2500);
  await page.click('[data-test="app-left-panel-collapse"]'); await page.waitForTimeout(300);
  await page.click('[data-test="workspace-left-navigation-strip"] [data-nav-key="agents"]'); await page.waitForTimeout(1200);
  out('SCN-004 agents icon ->', page.url(), 'docked:', await page.locator('[data-test="app-left-panel-shell"]').count());
  // AC-009 New chat draft kept
  await page.goto('http://127.0.0.1:4610/chat'); await page.waitForTimeout(2000);
  await page.locator('textarea').first().fill('Draft I am typing');
  await page.click('[data-test="app-left-panel-collapse"]'); await page.waitForTimeout(300);
  await page.click('[data-test="workspace-left-strip-expand"]'); await page.waitForTimeout(800);
  out('AC-009', page.url(), 'textarea:', await page.locator('textarea').first().inputValue(), 'selected rows:', await page.locator('[data-test="workspace-history-tree-scroll"] [aria-current="true"]').count());
  await page.close();
}
// strip at 500 height
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 500 } });
  await page.goto('http://127.0.0.1:4610/chat?id=run-ptm-0001'); await page.waitForTimeout(2500);
  await page.click('[data-test="app-left-panel-collapse"]'); await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/clpe/strip-500.png', clip: {x:0,y:0,width:200,height:500} });
  out('strip overflow', await page.evaluate(() => { const s=document.querySelector('[data-test="workspace-left-navigation-strip"]'); return {sh:s.scrollHeight, ch:s.clientHeight}; }));
  await page.close();
}
await browser.close();
