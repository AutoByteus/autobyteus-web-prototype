import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/task-keys-off-lists/node_modules/playwright-core/index.mjs';
const B=process.env.BASE||'http://127.0.0.1:4661', O=process.env.OUT||'./';
const browser = await chromium.launch(); const log=(...a)=>console.log(...a);
const page = async (w=1440,h=900,s=1) => { const ctx = await browser.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:s, permissions:['clipboard-read','clipboard-write'] }); const p = await ctx.newPage(); p.on('pageerror', e => log('PAGEERR', e.message)); return p; };
const rest = async (p) => { await p.mouse.move(5,890); await p.evaluate(()=>document.activeElement?.blur()); await p.waitForTimeout(300); };
const box = async (p, sel) => { const b = await p.locator(sel).first().boundingBox(); return { x: Math.max(0,b.x-8), y: Math.max(0,b.y-8), width: b.width+16, height: b.height+16 }; };
{ const p = await page(); await p.goto(B+'/projects/project-desktop-app'); await p.waitForTimeout(6000); await rest(p);
  await p.screenshot({ path: O+'VIS-001-board-dependency-badges-1440x900.png' }); await p.close(); }
{ const p = await page(1440,900,2); await p.goto(B+'/projects/project-desktop-app'); await p.waitForTimeout(6000); await rest(p);
  for (const [id,name] of [['tk-keys-build','VIS-002a-card-blocked-by-several-2x'],['tk-agent-loop','VIS-002b-card-blocked-by-one-2x'],['dct-release-notes','VIS-002c-card-dependency-cancelled-2x'],['tk-locator-build','VIS-002d-card-dependencies-done-no-badge-2x']]) {
    await p.screenshot({ path: O+name+'.png', clip: await box(p, `[data-testid="project-task-row-${id}"]`) }); }
  await p.close(); }
{ const p = await page(); await p.goto(B+'/projects/project-desktop-app'); await p.waitForTimeout(5000);
  for (const [id,name] of [['tk-keys-build','VIS-003-detail-depends-on-blocked-1440x900'],['dct-image-context','VIS-004-detail-depends-on-done-follow-up-1440x900'],['tk-locator-design','VIS-005-detail-required-by-1440x900']]) {
    await p.click(`[data-testid="project-task-row-${id}"] [data-testid="project-task-row-link"]`); await p.waitForTimeout(2000); await rest(p);
    await p.screenshot({ path: O+name+'.png' }); await p.click('[data-testid="task-back-to-board"]'); await p.waitForTimeout(1500); }
  await p.close(); }
{ const p = await page(1440,900,2); await p.goto(B+'/projects/project-desktop-app/tasks/tk-agent-loop'); await p.waitForTimeout(5000);
  await p.click('[data-testid="task-key-copy"]'); await p.mouse.move(5,890); await p.waitForTimeout(200);
  await p.screenshot({ path: O+'VIS-006-key-chip-copied-2x.png', clip: await box(p, '[data-testid="task-page-heading"] >> xpath=..') }); await p.close(); }
{ const p = await page(); await p.goto(B+'/projects/project-desktop-app/tasks/tk-agent-loop/edit'); await p.waitForTimeout(5000);
  await rest(p); await p.screenshot({ path: O+'VIS-007a-edit-depends-on-field-1440x900.png', fullPage: true });
  await p.click('[data-testid="task-dependency-input"]'); await p.waitForTimeout(400);
  await p.screenshot({ path: O+'VIS-007b-edit-depends-on-search-open-1440x900.png', fullPage: true }); await p.close(); }
{ const p = await page(); await p.goto(B+'/projects/project-desktop-app/tasks/tk-compaction/edit'); await p.waitForTimeout(5000);
  await p.click('[data-testid="task-dependency-input"]'); await p.keyboard.type('agent loop'); await p.waitForTimeout(400);
  await p.screenshot({ path: O+'VIS-008-edit-depends-on-loop-not-allowed-1440x900.png', fullPage: true }); await p.close(); }
{ const p = await page(); await p.goto(B+'/chat?id=run-ptm-0001'); await p.waitForTimeout(6000);
  await p.getByText('Projects', {exact:true}).last().click(); await p.waitForTimeout(2000); await rest(p);
  await p.screenshot({ path: O+'VIS-010-right-panel-board-badges-1440x900.png' });
  await p.click('[data-testid="project-task-row-tk-agent-loop"] [data-testid="project-task-row-link"]'); await p.waitForTimeout(1500); await rest(p);
  await p.screenshot({ path: O+'VIS-011-right-panel-task-key-and-dependencies-1440x900.png' }); await p.close(); }
{ const p = await page(1440,900,2); await p.goto(B+'/chat?id=run-ptm-0001'); await p.waitForTimeout(6000); await rest(p);
  await p.screenshot({ path: O+'VIS-012-tree-task-summary-2x.png', clip:{x:0,y:410,width:320,height:440} }); await p.close(); }
{ const p = await page(1440,900,2); await p.goto(B+'/projects/project-onboarding-redesign'); await p.waitForTimeout(5000); await rest(p);
  await p.screenshot({ path: O+'VIS-013-long-key-badge-board-2x.png', clip:{x:340,y:250,width:1080,height:170} });
  await p.click('[data-testid="project-task-row-ob-checklist"] [data-testid="project-task-row-link"]'); await p.waitForTimeout(2000); await rest(p);
  await p.screenshot({ path: O+'VIS-014-long-key-detail-2x.png', clip:{x:340,y:60,width:1010,height:460} }); await p.close(); }
{ const p = await page(760,900); await p.goto(B+'/projects/project-desktop-app'); await p.waitForTimeout(6000); await rest(p);
  await p.screenshot({ path: O+'VIS-015-board-narrow-760x900.png' }); await p.close(); }
await browser.close(); log('done');
