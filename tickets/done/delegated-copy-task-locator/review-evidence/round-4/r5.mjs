import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/delegated-copy-task-locator/node_modules/playwright-core/index.mjs';
const O='./';
const browser = await chromium.launch();
for (const [port, name] of [[4641,'A-icon'],[4642,'B-summary']]) {
  const p = await browser.newPage({ viewport:{width:1440,height:900}, deviceScaleFactor:2 });
  p.on('pageerror', e => console.log(name,'PAGEERR', e.message));
  await p.goto(`http://127.0.0.1:${port}/chat?id=run-ptm-0001`); await p.waitForTimeout(8000);
  await p.goto(`http://127.0.0.1:${port}/chat?id=run-ptm-0001`); await p.waitForTimeout(6000);
  await p.mouse.move(700,500);
  console.log(name, 'icons', await p.locator('[data-test="workspace-copy-task-locate"]').count(), 'summaries', await p.locator('[data-test="workspace-copy-task-summary"]').count());
  await p.screenshot({ path: O+`r5-${name}-tree-2x.png`, clip:{x:0,y:410,width:320,height:440} });
  if (name==='B-summary') {
    await p.locator('[data-test="workspace-copy-task-summary"]').nth(2).hover(); await p.waitForTimeout(300);
    await p.screenshot({ path: O+`r5-${name}-hover-2x.png`, clip:{x:0,y:410,width:320,height:440} });
    await p.locator('[data-test="workspace-copy-task-summary"]').nth(2).click(); await p.waitForTimeout(1000);
    console.log('B located', await p.evaluate(()=>document.querySelector('[data-located]')?.dataset.testid), 'center title', await p.locator('[data-test="agent-workspace-title"]').innerText());
    await p.screenshot({ path: O+`r5-${name}-located-1440x900.png` });
  }
  await p.close();
}
await browser.close();
