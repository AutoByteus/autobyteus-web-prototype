import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/delegated-copy-task-locator/node_modules/playwright-core/index.mjs';
const B='http://127.0.0.1:4641', O='./';
const browser = await chromium.launch(); const log=(...a)=>console.log(...a);
{ const p = await browser.newPage({ viewport:{width:1440,height:900}, deviceScaleFactor:2 }); await p.goto(B+'/chat?id=run-ptm-0001'); await p.waitForTimeout(7000);
  await p.locator('[data-transient-kind="task_agent"]').nth(0).focus(); await p.keyboard.press('Tab'); await p.waitForTimeout(400);
  log('opacity', await p.evaluate(()=>getComputedStyle(document.activeElement).opacity));
  await p.screenshot({ path: O+'r2b-C1-keyboard-focus-2x.png', clip:{x:0,y:600,width:330,height:80} }); await p.close(); }
{ const p = await browser.newPage({ viewport:{width:1440,height:900} }); await p.goto(B+'/chat?id=run-ptm-0001'); await p.waitForTimeout(7000);
  await p.click('[data-test="right-side-panel-toggle"]'); await p.waitForTimeout(600);
  await p.screenshot({ path: O+'r2b-A1-right-collapsed.png' });
  await p.locator('[data-transient-kind="task_team"]').nth(2).hover(); await p.locator('[data-test="workspace-copy-task-locate"]').nth(4).click(); await p.waitForTimeout(1000);
  log('A located', await p.evaluate(()=>document.querySelector('[data-located]')?.dataset.testid));
  await p.screenshot({ path: O+'r2b-A2-right-opened-located.png' }); await p.close(); }
await browser.close();
