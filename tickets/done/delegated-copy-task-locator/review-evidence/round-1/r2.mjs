import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/delegated-copy-task-locator/node_modules/playwright-core/index.mjs';
const B='http://127.0.0.1:4641', O='./';
const browser = await chromium.launch();
const log=(...a)=>console.log(...a);
const np = async (w=1440,h=900) => { const p = await browser.newPage({ viewport:{width:w,height:h} }); p.on('pageerror', e => log('PAGEERR', e.message)); return p; };
const located = (p) => p.evaluate(()=>({ located: document.querySelector('[data-located]')?.dataset.testid ?? null, focus: document.activeElement?.closest('[data-testid^="project-task-row-"]:not([data-testid="project-task-row-link"])')?.dataset.testid ?? document.activeElement?.parentElement?.dataset.testid, picker: document.querySelector('[data-testid="projects-panel"] select')?.selectedOptions?.[0]?.text, search: document.querySelector('[data-testid="projects-panel"] input[type=search]')?.value }));
// A: right panel collapsed
{ const p = await np(); await p.goto(B+'/chat?id=run-ptm-0001'); await p.waitForTimeout(7000);
  const toggles = await p.$$('button[title], button[aria-label]');
  const t = await p.evaluate(()=>[...document.querySelectorAll('button')].map(b=>b.getAttribute('aria-label')||b.title).filter(Boolean).filter(x=>/panel/i.test(x)));
  log('panel toggles', t);
  await p.getByRole('button', { name: /Collapse right panel|Hide right panel|Close right panel/i }).first().click().catch(e=>log('no collapse btn'));
  await p.waitForTimeout(500);
  await p.screenshot({ path: O+'r2-A1-right-collapsed.png' });
  await p.locator('[data-transient-kind="task_team"]').nth(2).hover();
  await p.locator('[data-test="workspace-copy-task-locate"]').nth(4).click(); await p.waitForTimeout(900);
  log('A', await located(p));
  await p.screenshot({ path: O+'r2-A2-right-opened-located.png' }); await p.close(); }
// B: search hides it, and a Task open in the tab
{ const p = await np(); await p.goto(B+'/chat?id=run-ptm-0001'); await p.waitForTimeout(7000);
  await p.getByText('Projects', {exact:true}).last().click(); await p.waitForTimeout(1500);
  await p.fill('[data-testid="projects-panel"] input[type=search]', 'release'); await p.waitForTimeout(500);
  await p.screenshot({ path: O+'r2-B1-search-release.png' });
  await p.locator('[data-transient-kind="task_team"]').nth(0).hover();
  await p.locator('[data-test="workspace-copy-task-locate"]').nth(0).click(); await p.waitForTimeout(900);
  log('B search', await located(p));
  await p.screenshot({ path: O+'r2-B2-search-cleared-located.png' });
  // open a Task inside the tab then locate another
  await p.click('[data-testid="project-task-row-dct-work-journal"] [data-testid="project-task-row-link"]'); await p.waitForTimeout(800);
  log('detail open', await p.locator('[data-testid="projects-panel-task"]').count());
  await p.locator('[data-transient-kind="task_team"]').nth(1).hover();
  await p.locator('[data-test="workspace-copy-task-locate"]').nth(2).click(); await p.waitForTimeout(900);
  log('B detail->board', await p.locator('[data-testid="projects-panel-task"]').count(), await located(p));
  await p.close(); }
// C: keyboard
{ const p = await np(); await p.goto(B+'/chat?id=run-ptm-0001'); await p.waitForTimeout(7000);
  await p.locator('[data-transient-kind="task_agent"]').nth(0).focus(); await p.keyboard.press('Tab'); 
  log('C focused', await p.evaluate(()=>document.activeElement?.dataset.test), await p.evaluate(()=>getComputedStyle(document.activeElement).opacity));
  await p.screenshot({ path: O+'r2-C1-keyboard-focus.png', clip:{x:0,y:600,width:330,height:80} });
  await p.keyboard.press('Enter'); await p.waitForTimeout(900);
  log('C', await located(p));
  await p.keyboard.press('Enter'); await p.waitForTimeout(800);
  log('C enter opens task', await p.locator('[data-testid="projects-panel-task"]').count());
  await p.close(); }
// D: narrow window drawer
{ const p = await np(900,800); await p.goto(B+'/chat?id=run-ptm-0001'); await p.waitForTimeout(7000);
  await p.screenshot({ path: O+'r2-D1-narrow.png' });
  const n = await p.locator('[data-transient-kind="task_team"]').count(); log('D rows', n);
  if (n) { await p.locator('[data-transient-kind="task_team"]').nth(0).hover(); await p.locator('[data-test="workspace-copy-task-locate"]').nth(0).click(); await p.waitForTimeout(1000);
  log('D', await located(p)); await p.screenshot({ path: O+'r2-D2-narrow-drawer-located.png' }); }
  await p.close(); }
await browser.close();
