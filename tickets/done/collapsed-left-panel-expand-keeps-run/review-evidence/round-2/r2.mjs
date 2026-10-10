import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/collapsed-left-panel-expand-keeps-run/node_modules/playwright-core/index.mjs';
const B='http://127.0.0.1:4610', O='/tmp/clpe/r2/';
const browser = await chromium.launch();
const log = (...a) => console.log(...a);
const W = '[data-test="workspace-left-strip-workspaces"]';
const lit = (page) => page.evaluate(() => { const s=document.querySelector('[data-test="workspace-left-navigation-strip"]'); return [...s.querySelectorAll('button')].filter(b=>b.className.includes('bg-gray-100 text-gray-900')).map(b=>b.dataset.navKey).join(','); });
const sel = (page) => page.evaluate(() => { const c=document.querySelector('[data-test="workspace-history-tree-scroll"]'); const rows=[...c.querySelectorAll('[aria-current="true"],[aria-selected="true"]')]; const b=c.getBoundingClientRect(); const r=rows.at(-1); if(!r) return null; const x=r.getBoundingClientRect(); return {row:r.innerText.trim().replace(/\s+/g,' '), visible:x.top>=b.top&&x.bottom<=b.bottom, scrollTop:c.scrollTop, focused: document.activeElement===r}; });
const dockedChatLit = (page) => page.evaluate(() => document.querySelector('[data-test="app-left-panel-chat"]')?.className.includes('bg-gray-100 text-gray-900'));
const newPage = async (w=1440,h=900,scale=1) => { const p = await browser.newPage({ viewport:{width:w,height:h}, deviceScaleFactor: scale }); p.on('pageerror', e => log('PAGEERR', e.message)); return p; };

// SCN-001
{ const page = await newPage();
  await page.goto(B+'/projects'); await page.waitForTimeout(2500);
  await page.click('[data-test="app-left-panel-collapse"]'); await page.waitForTimeout(300);
  log('after collapse focus', await page.evaluate(()=>document.activeElement?.dataset.test), 'lit on /projects:', await lit(page));
  await page.getByText('Prototype Launch').first().click(); await page.waitForTimeout(1500);
  await (await page.$$('[data-testid^="project-task-worker-"]'))[0].click(); await page.waitForTimeout(2500);
  log('SCN-001 before', page.url(), 'lit:', await lit(page));
  await page.screenshot({ path: O+'R2-01-worker-open-collapsed-workspaces-lit-1440x900.png' });
  await page.click(W); await page.waitForTimeout(1500);
  log('SCN-001 after', page.url(), await sel(page), 'docked chat lit:', await dockedChatLit(page));
  await page.screenshot({ path: O+'R2-03-expanded-task-team-coordinator-revealed-1440x900.png' });
  await page.close(); }
// strip close-ups
{ const page = await newPage(1440,900,2);
  await page.goto(B+'/chat?id=run-ptm-0001'); await page.waitForTimeout(2500);
  await page.click('[data-test="app-left-panel-collapse"]'); await page.waitForTimeout(300);
  await page.evaluate(()=>document.activeElement.blur()); await page.mouse.move(700,400);
  await page.screenshot({ path: O+'R2-02a-strip-run-open-2x.png', clip:{x:0,y:0,width:220,height:900} });
  await page.hover(W); await page.waitForTimeout(300);
  await page.screenshot({ path: O+'R2-02b-strip-workspaces-hover-2x.png', clip:{x:0,y:0,width:220,height:520} });
  await page.goto(B+'/chat'); await page.waitForTimeout(2000);
  await page.click('[data-test="app-left-panel-collapse"]'); await page.waitForTimeout(300);
  await page.evaluate(()=>document.activeElement.blur());
  log('New chat lit:', await lit(page), 'collapsed?', await page.locator(W).count());
  await page.mouse.move(700,400);
  await page.screenshot({ path: O+'R2-02c-strip-new-chat-2x.png', clip:{x:0,y:0,width:220,height:900} });
  await page.close(); }
// SCN-002 nested
{ const page = await newPage();
  await page.goto(B+'/workspace'); await page.waitForTimeout(2500);
  await page.getByText('prototype-workspace', { exact: true }).first().click(); await page.waitForTimeout(400);
  for (const s of ['[data-test="workspace-team-definition-row-team-video"]','[data-test="workspace-team-row-team-run-video-0001"]']) { await page.click(s); await page.waitForTimeout(1500); }
  await page.click('text=post_production'); await page.waitForTimeout(800);
  await page.getByText('colorist', { exact: true }).first().click(); await page.waitForTimeout(1500);
  await page.click('[data-test="app-left-panel-collapse"]'); await page.waitForTimeout(400);
  log('SCN-002 lit:', await lit(page));
  await page.click(W); await page.waitForTimeout(1500);
  log('SCN-002 after', page.url(), await sel(page));
  await page.screenshot({ path: O+'R2-04-expanded-nested-subteam-member-revealed-1440x900.png' });
  await page.close(); }
// SCN-003 org at 620
{ const page = await newPage(1440,620);
  await page.goto(B+'/workspace'); await page.waitForTimeout(2500);
  await page.getByText('prototype-workspace', { exact: true }).first().click(); await page.waitForTimeout(400);
  await page.click('[data-test="agent-org-definition-org-product-launch"]'); await page.waitForTimeout(800);
  await page.click('[data-test="agent-org-run-open-org-run-001"]'); await page.waitForTimeout(2000);
  await page.click('[data-test="agent-org-team-row-org-team-run-001"]'); await page.waitForTimeout(1500);
  await page.locator('[data-test^="agent-org-agent-row-"]').last().click(); await page.waitForTimeout(1500);
  await page.click('[data-test="app-left-panel-collapse"]'); await page.waitForTimeout(400);
  log('SCN-003 lit:', await lit(page));
  await page.screenshot({ path: O+'R2-05a-org-member-open-collapsed-1440x620.png' });
  await page.focus(W); await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
  log('SCN-003 after (keyboard)', page.url(), await sel(page));
  await page.screenshot({ path: O+'R2-05-expanded-org-member-scrolled-focused-1440x620.png' });
  await page.close(); }
// SCN-005 narrow drawer
{ const page = await newPage(760,900);
  await page.goto(B+'/chat?id=run-ptm-0001'); await page.waitForTimeout(2500);
  log('narrow activation', await page.getAttribute('[data-test="workspace-left-navigation-strip"]','data-strip-activation'), 'lit:', await lit(page));
  await page.focus(W); await page.keyboard.press('Enter'); await page.waitForTimeout(1200);
  log('drawer', await page.locator('[data-test="app-left-navigation-drawer"]').count(), page.url(), await sel(page));
  await page.screenshot({ path: O+'R2-06-narrow-drawer-run-revealed-760x900.png' });
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
  log('after escape focus', await page.evaluate(()=>document.activeElement?.dataset.test));
  await page.close(); }
// SCN-004, AC-009, no run
{ const page = await newPage();
  await page.goto(B+'/chat?id=run-ptm-0001'); await page.waitForTimeout(2500);
  await page.click('[data-test="app-left-panel-collapse"]'); await page.waitForTimeout(300);
  await page.click('[data-test="workspace-left-navigation-strip"] [data-nav-key="agents"]'); await page.waitForTimeout(1200);
  log('SCN-004', page.url(), 'docked', await page.locator('[data-test="app-left-panel-shell"]').count());
  await page.goto(B+'/chat'); await page.waitForTimeout(2000);
  await page.locator('textarea').first().fill('Draft I am typing');
  await page.click('[data-test="app-left-panel-collapse"]'); await page.waitForTimeout(300);
  await page.click(W); await page.waitForTimeout(1000);
  log('AC-009', page.url(), await page.locator('textarea').first().inputValue(), 'selected:', await sel(page), 'docked chat lit:', await dockedChatLit(page));
  await page.close(); }
for (const H of [481, 540, 541]) { const page = await newPage(1440,H);
  await page.goto(B+'/chat?id=run-ptm-0001'); await page.waitForTimeout(2200);
  await page.click('[data-test="app-left-panel-collapse"]'); await page.waitForTimeout(300);
  log(H, await page.evaluate(() => { const s=document.querySelector('[data-test="workspace-left-navigation-strip"]'); return {sh:s.scrollHeight, ch:s.clientHeight}; }));
  await page.close(); }
await browser.close();
