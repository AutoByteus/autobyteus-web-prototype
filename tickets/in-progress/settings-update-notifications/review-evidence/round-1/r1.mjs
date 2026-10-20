import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/settings-update-notifications/node_modules/playwright-core/index.mjs';
const B='http://127.0.0.1:4681', O='/tmp/sun/shots/';
const browser = await chromium.launch(); const log=(...a)=>console.log(...a);
const page = async (w=1440,h=900,s=1) => { const p = await browser.newPage({ viewport:{width:w,height:h}, deviceScaleFactor:s }); p.on('pageerror', e => log('PAGEERR', e.message)); p.on('console', m => { if (m.type()==='error') log('CONSOLE', m.text().slice(0,160)); }); return p; };
{ const p = await page(); await p.goto(B+'/chat'); await p.waitForTimeout(6000);
  log('dots', await p.locator('[data-test="settings-notifications-indicator"]').count(), await p.locator('button[data-nav-key="settings"]').getAttribute('aria-label').catch(()=>null));
  await p.screenshot({ path: O+'r1-01-chat-docked.png' });
  await p.click('[data-test="app-left-panel-collapse"]').catch(()=>{}); await p.waitForTimeout(500);
  await p.screenshot({ path: O+'r1-02-strip-dot-2x.png', clip:{x:0,y:820,width:60,height:80} });
  await p.click('button[data-nav-key="settings"]'); await p.waitForTimeout(4000);
  log('url', p.url());
  await p.screenshot({ path: O+'r1-03-settings-wide.png' });
  await p.goto(B+'/settings?section=updates'); await p.waitForTimeout(4000);
  await p.screenshot({ path: O+'r1-04-updates-with-rail.png' });
  await p.close(); }
{ const p = await page(1100,860); await p.goto(B+'/settings?section=notifications'); await p.waitForTimeout(6000);
  await p.screenshot({ path: O+'r1-05-narrow-section.png' }); await p.close(); }
await browser.close();
