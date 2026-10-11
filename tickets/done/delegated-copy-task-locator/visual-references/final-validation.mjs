import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/delegated-copy-task-locator/node_modules/playwright-core/index.mjs';
const B = process.env.BASE || 'http://127.0.0.1:4641', O = process.env.OUT || './';
const browser = await chromium.launch(); const log=(...a)=>console.log(...a);
const results = [];
const check = (id, ok, detail) => { results.push({ id, ok, detail }); log(ok ? 'PASS' : 'FAIL', id, JSON.stringify(detail)); };
const state = (p) => p.evaluate(()=>({ located: document.querySelector('[data-located]')?.dataset.testid ?? null,
  focused: document.activeElement?.closest('[data-testid^="project-task-row-"]')?.parentElement?.closest('[data-testid^="project-task-row-"]')?.dataset.testid ?? document.activeElement?.parentElement?.dataset.testid ?? null,
  picker: document.querySelector('[data-testid="projects-panel"] select')?.selectedOptions?.[0]?.text ?? null,
  search: document.querySelector('[data-testid="projects-panel"] input[type=search]')?.value ?? null,
  cancelledPressed: document.querySelector('[data-testid="projects-panel"] [data-testid$="-cancelled-toggle"]')?.getAttribute('aria-pressed') ?? null,
  center: document.querySelector('[data-test="agent-workspace-title"]')?.innerText ?? null }));
const open = async (w=1440,h=900,scale=1,url='/chat?id=run-ptm-0001') => { const p = await browser.newPage({ viewport:{width:w,height:h}, deviceScaleFactor:scale }); p.on('pageerror', e => log('PAGEERR', e.message)); await p.goto(B+url); await p.waitForTimeout(6500); await p.mouse.move(700,500); return p; };
const summary = (p,n) => p.locator('[data-test="workspace-copy-task-summary"]').nth(n);

// VIS-001/002 tree with summaries
{ const p = await open();
  const n = await p.locator('[data-test="workspace-copy-task-summary"]').count();
  const texts = await p.locator('[data-test="workspace-copy-task-summary"]').allInnerTexts();
  check('SCN-001 five copies show their Task summary; members none', n===5 && await p.locator('[data-transient-kind="task_team_child"] [data-test="workspace-copy-task-summary"]').count()===0, texts);
  await p.screenshot({ path: O+'VIS-001-ptm-run-copies-with-task-summaries-desktop-1440x900.png' });
  await p.close(); }
{ const p = await open(1440,900,2);
  await p.screenshot({ path: O+'VIS-002-copy-rows-task-summary-closeup-2x.png', clip:{x:0,y:410,width:320,height:440} });
  await summary(p,2).hover(); await p.waitForTimeout(300);
  await p.screenshot({ path: O+'VIS-003-task-summary-hover-closeup-2x.png', clip:{x:0,y:410,width:320,height:440} });
  // selected copy row (open copy 2 coordinator via row name)
  await p.locator('[data-transient-kind="task_team"]').nth(1).locator('span.truncate').first().click(); await p.waitForTimeout(2000);
  await p.locator('[data-transient-kind="task_team"]').nth(1).locator('[data-test="workspace-team-transient-disclosure"]').click(); await p.waitForTimeout(500);
  await p.mouse.move(700,500); await p.evaluate(()=>document.activeElement?.blur()); await p.waitForTimeout(300);
  const s = await state(p);
  check('SCN-007 row name still opens the copy (not the Task)', s.center==='solution designer' && s.located===null, s);
  await p.screenshot({ path: O+'VIS-004-copy-open-row-summary-unchanged-closeup-2x.png', clip:{x:0,y:410,width:320,height:440} });
  await p.close(); }
// VIS-005 summary click -> Desktop App located
{ const p = await open();
  await summary(p,2).click(); await p.mouse.move(700,500); await p.waitForTimeout(1100);
  const s = await state(p);
  check('SCN-002 summary locates the Task in its Project; center unchanged', s.located==='project-task-row-dct-member-reach' && s.picker==='Desktop App' && s.focused==='project-task-row-dct-member-reach' && s.center?.startsWith('Dispatch'), s);
  await p.screenshot({ path: O+'VIS-005-summary-click-task-located-desktop-app-1440x900.png' });
  await summary(p,1).click(); await p.mouse.move(700,500); await p.waitForTimeout(1100);
  const s2 = await state(p);
  check('SCN-003 another Project: picker switches to Prototype Launch', s2.located==='project-task-row-dct-release-agent' && s2.picker==='Prototype Launch', s2);
  await p.screenshot({ path: O+'VIS-006-task-located-other-project-prototype-launch-1440x900.png' });
  await summary(p,3).click(); await p.mouse.move(700,500); await p.waitForTimeout(1100);
  const s3 = await state(p);
  check('SCN-004 no Project: picker switches to Temp tasks', s3.located==='project-task-row-dct-temp-onboarding' && s3.picker==='Temp tasks', s3);
  await p.screenshot({ path: O+'VIS-007-task-located-temp-tasks-1440x900.png' });
  await summary(p,4).click(); await p.mouse.move(700,500); await p.waitForTimeout(1100);
  const s4 = await state(p);
  check('SCN-005 follow-up copy locates its current Task', s4.located==='project-task-row-dct-image-context', s4);
  await p.screenshot({ path: O+'VIS-008-follow-up-copy-current-task-located-1440x900.png' });
  // Task open in tab -> board
  await p.click('[data-testid="project-task-row-dct-work-journal"] [data-testid="project-task-row-link"]'); await p.waitForTimeout(800);
  const detail = await p.locator('[data-testid="projects-panel-task"]').count();
  await summary(p,0).click(); await p.mouse.move(700,500); await p.waitForTimeout(1100);
  const s5 = await state(p);
  check('SCN-006c a Task open in the tab returns to the board', detail===1 && await p.locator('[data-testid="projects-panel-task"]').count()===0 && s5.located==='project-task-row-dct-token-meter', s5);
  await p.close(); }
// search hides it
{ const p = await open();
  await p.getByText('Projects', {exact:true}).last().click(); await p.waitForTimeout(1500);
  await p.fill('[data-testid="projects-panel"] input[type=search]', 'release'); await p.waitForTimeout(500);
  await p.screenshot({ path: O+'VIS-009a-panel-search-hides-task-1440x900.png' });
  await summary(p,0).click(); await p.mouse.move(700,500); await p.waitForTimeout(1100);
  const s = await state(p);
  check('SCN-006a a hiding search is cleared', s.search==='' && s.located==='project-task-row-dct-token-meter', s);
  await p.screenshot({ path: O+'VIS-009b-search-cleared-task-located-1440x900.png' });
  // Cancelled: an agent cancels the Task just before the click (scripted under the UI via the store, as the live feed would)
  const r = await p.evaluate(async () => {
    const pinia = document.querySelector('#__nuxt').__vue_app__.config.globalProperties.$pinia;
    const tasks = pinia._s.get('projectTasks'); const locator = pinia._s.get('taskLocator');
    const task = tasks.getList('project-desktop-app').tasks.find(t => t.taskId === 'dct-cancelled-tooltip');
    locator.locate({ task, choice: { kind: 'project', projectId: 'project-desktop-app' } });
    await new Promise(r => setTimeout(r, 1100));
    return true; });
  const s2 = await state(p);
  check('SCN-006b (defensive) a Cancelled Task turns on the Cancelled lane', s2.cancelledPressed==='true' && s2.located==='project-task-row-dct-cancelled-tooltip', s2);
  await p.screenshot({ path: O+'VIS-010-cancelled-task-located-cancelled-lane-1440x900.png' });
  await p.close(); }
// collapsed right panel
{ const p = await open();
  await p.click('[data-test="right-side-panel-toggle"]'); await p.waitForTimeout(600);
  await p.screenshot({ path: O+'VIS-011a-right-panel-collapsed-1440x900.png' });
  await summary(p,4).click(); await p.mouse.move(700,500); await p.waitForTimeout(1200);
  const s = await state(p);
  check('SCN-008 a collapsed right panel reopens on Projects', s.located==='project-task-row-dct-image-context' && s.picker==='Desktop App', s);
  await p.screenshot({ path: O+'VIS-011b-right-panel-reopened-task-located-1440x900.png' });
  await p.close(); }
// keyboard
{ const p = await open(1440,900,2);
  await p.locator('[data-transient-kind="task_agent"]').nth(0).focus(); await p.keyboard.press('Tab'); await p.waitForTimeout(300);
  const f = await p.evaluate(()=>document.activeElement?.dataset.test);
  await p.screenshot({ path: O+'VIS-012-task-summary-keyboard-focus-closeup-2x.png', clip:{x:0,y:600,width:320,height:100} });
  await p.keyboard.press('Enter'); await p.waitForTimeout(1100);
  const s = await state(p);
  await p.keyboard.press('Enter'); await p.waitForTimeout(800);
  check('SCN-009 keyboard: Tab to summary, Enter locates and focuses the card, Enter opens it', f==='workspace-copy-task-summary' && s.focused==='project-task-row-dct-release-agent' && await p.locator('[data-testid="projects-panel-task"]').count()===1, { f, ...s });
  await p.close(); }
// narrow drawer
{ const p = await open(900,800);
  await summary(p,0).click(); await p.mouse.move(700,500); await p.waitForTimeout(1200);
  const s = await state(p);
  check('SCN-010 narrow window: the drawer opens on Projects', s.located==='project-task-row-dct-token-meter', s);
  await p.screenshot({ path: O+'VIS-013-narrow-window-drawer-task-located-900x800.png' });
  await p.close(); }
// collaborators have no summary
{ const p = await open(1440,900,2,'/chat?id=run-research-001');
  const rows = await p.evaluate(()=>[...document.querySelectorAll('[data-row-kind=transient_execution]')].map(r=>[r.dataset.agentRunId||r.dataset.memberAddress, !!r.querySelector('[data-test="workspace-copy-task-summary"]')]));
  check('SCN-011 `@` collaborators have no summary; Task workers do', JSON.stringify(rows)===JSON.stringify([['collab-writer-001',false],['/product_review_team',false],['collab-team-researcher-001',false],['collab-team-writer-001',false],['worker-writer-001',true],['worker-temp-researcher-001',true]]), rows);
  await p.screenshot({ path: O+'VIS-014-collaborators-without-summary-task-workers-with-closeup-2x.png', clip:{x:0,y:410,width:320,height:290} });
  await p.close(); }
await browser.close();
const fs = await import('node:fs'); fs.writeFileSync(O+'final-validation-results.json', JSON.stringify(results, null, 2));
log(results.filter(r=>r.ok).length + '/' + results.length + ' pass');
