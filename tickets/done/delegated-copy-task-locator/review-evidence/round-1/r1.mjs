import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/delegated-copy-task-locator/node_modules/playwright-core/index.mjs';
const B='http://127.0.0.1:4641', O='./';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1440,height:900} });
page.on('pageerror', e => console.log('PAGEERR', e.message));
page.on('console', m => { if (m.type()==='error') console.log('CONSOLE', m.text().slice(0,300)); });
await page.goto(B+'/chat?id=run-ptm-0001'); await page.waitForTimeout(7000);
await page.screenshot({ path: O+'r1-01-tree.png' });
const teams = page.locator('[data-transient-kind="task_team"]');
await teams.nth(1).hover(); await page.waitForTimeout(400);
await page.screenshot({ path: O+'r1-02-hover.png', clip:{x:0,y:340,width:330,height:560} });
// open copy 2 (coordinator)
await teams.nth(1).click(); await page.waitForTimeout(2500);
await page.screenshot({ path: O+'r1-03-copy-open.png' });
// locate via header chip
await page.click('[data-test="agent-workspace-copy-task"]'); await page.waitForTimeout(700);
await page.screenshot({ path: O+'r1-04-located.png' });
console.log('focused', await page.evaluate(()=>document.activeElement?.closest('[data-testid^=project-task-row-]')?.dataset.testid));
// locate agent package creator #1 (Prototype Launch) via row button
const apc = page.locator('[data-transient-kind="task_agent"]');
await apc.nth(0).hover(); await page.locator('[data-test="workspace-copy-task-locate"]').nth(1).click(); await page.waitForTimeout(700);
await page.screenshot({ path: O+'r1-05-located-other-project.png' });
await apc.nth(1).hover(); await page.locator('[data-test="workspace-copy-task-locate"]').nth(3).click(); await page.waitForTimeout(700);
await page.screenshot({ path: O+'r1-06-located-temp.png' });
console.log(await page.evaluate(()=>[...document.querySelectorAll('[data-test="workspace-copy-task-locate"]')].map(b=>b.dataset.taskId)));
await browser.close();
