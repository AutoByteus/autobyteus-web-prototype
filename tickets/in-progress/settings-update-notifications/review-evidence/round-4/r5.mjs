import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/settings-update-notifications/node_modules/playwright-core/index.mjs';
const B='http://127.0.0.1:4681', O='/tmp/sun/shots/';
const browser = await chromium.launch();
for (const lang of ['en','zh-CN']) {
  const ctx = await browser.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:2 });
  await ctx.addInitScript((lg) => localStorage.setItem('autobyteus.localization.preference-mode', lg), lang);
  const p = await ctx.newPage(); p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto(B+'/chat'); await p.waitForTimeout(6000); await p.mouse.move(700,300);
  await p.screenshot({ path: O+`r5-01-settings-row-${lang}-2x.png`, clip:{x:0,y:820,width:330,height:80} });
  await p.click('[data-test="app-left-panel-collapse"]'); await p.waitForTimeout(500); await p.mouse.move(700,300);
  await p.screenshot({ path: O+`r5-02-strip-${lang}-2x.png`, clip:{x:0,y:780,width:60,height:120} });
  await p.click('[data-test="app-left-panel-expand"], button[aria-label*="xpand"]').catch(()=>{});
  await p.goto(B+'/settings?section=updates'); await p.waitForTimeout(4000); await p.mouse.move(700,890);
  await p.screenshot({ path: O+`r5-03-rail-${lang}-2x.png`, clip:{x:1088,y:0,width:352,height:900} });
  await ctx.close(); }
await browser.close();
