import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/collapsed-left-panel-expand-keeps-run/node_modules/playwright-core/index.mjs';
const B='http://127.0.0.1:4610', V=process.env.V+'/';
const browser = await chromium.launch();
const log = (...a) => console.log(...a);
const W='[data-test="workspace-left-strip-workspaces"]', C='[data-test="app-left-panel-collapse"]';
const lit = (p) => p.evaluate(() => { const s=document.querySelector('[data-test="workspace-left-navigation-strip"]'); return s ? [...s.querySelectorAll('button')].filter(b=>b.className.includes('bg-gray-100 text-gray-900')).map(b=>b.dataset.navKey).join(',') : 'no-strip'; });
const sel = (p) => p.evaluate(() => { const c=document.querySelector('[data-test="workspace-history-tree-scroll"]'); const rows=[...c.querySelectorAll('[aria-current="true"],[aria-selected="true"]')]; const b=c.getBoundingClientRect(); const r=rows.at(-1); if(!r) return null; const x=r.getBoundingClientRect(); return {row:r.innerText.trim().replace(/\s+/g,' '), visible:x.top>=b.top&&x.bottom<=b.bottom, scrollTop:Math.round(c.scrollTop), focused: document.activeElement===r}; });
const header = (p) => p.evaluate(() => document.querySelector('main')?.innerText.split('\n')[0]);
const activeRightTab = (p) => p.evaluate(() => [...document.querySelectorAll('button')].find(b => /^Projects$/.test(b.innerText.trim()) && getComputedStyle(b).color === 'rgb(37, 99, 235)') ? 'Projects' : [...document.querySelectorAll('button')].filter(b=>getComputedStyle(b).color==='rgb(37, 99, 235)').map(b=>b.innerText.trim()).join('|'));
const dockedChatLit = (p) => p.evaluate(() => document.querySelector('[data-test="app-left-panel-chat"]')?.className.includes('bg-gray-100 text-gray-900'));
const np = async (w=1440,h=900,s=1) => { const p = await browser.newPage({ viewport:{width:w,height:h}, deviceScaleFactor:s }); p.errs=[]; p.on('pageerror', e => p.errs.push(e.message)); return p; };
const calm = async (p) => { await p.evaluate(()=>document.activeElement?.blur()); await p.mouse.move(700,450); await p.waitForTimeout(250); };

// SCN-001 — the user's journey from the right Projects tab
{ const p = await np();
  await p.goto(B+'/chat?id=run-research-001'); await p.waitForTimeout(3000);
  await p.click(C); await p.waitForTimeout(400);
  await p.getByText('Projects', { exact: true }).last().click(); await p.waitForTimeout(1500);
  await p.getByText('documentation writer', { exact: true }).last().click(); await p.waitForTimeout(3000);
  const url = p.url(); log('SCN-001 before:', url, 'header:', await header(p), 'lit:', await lit(p), 'rightTab:', await activeRightTab(p));
  await calm(p); await p.screenshot({ path: V+'VIS-001-collapsed-run-open-workspaces-lit-desktop-1440x900.png' });
  await p.click(W); await p.waitForTimeout(1800);
  log('SCN-001 after:', p.url()===url ? 'URL unchanged' : 'URL CHANGED '+p.url(), 'header:', await header(p), 'rightTab:', await activeRightTab(p), await sel(p), 'dockedChatLit:', await dockedChatLit(p));
  await p.mouse.move(700,450); await p.waitForTimeout(250);
  await p.screenshot({ path: V+'VIS-003-workspaces-opens-panel-run-revealed-desktop-1440x900.png' });
  log('errors', p.errs); await p.close(); }
// strip close-up + hover
{ const p = await np(1440,900,2);
  await p.goto(B+'/chat?id=run-research-001'); await p.waitForTimeout(3000);
  await p.click(C); await p.waitForTimeout(300); await calm(p);
  await p.hover(W); await p.waitForTimeout(350);
  await p.screenshot({ path: V+'VIS-002-strip-workspaces-lit-hover-tooltip-desktop-1440x900-crop-2x.png', clip:{x:0,y:0,width:240,height:520} });
  await p.close(); }
// New chat
{ const p = await np();
  await p.goto(B+'/chat'); await p.waitForTimeout(2500);
  await p.click(C); await p.waitForTimeout(300); await calm(p);
  log('New chat lit:', await lit(p));
  await p.screenshot({ path: V+'VIS-006-collapsed-new-chat-chat-lit-desktop-1440x900.png' });
  await p.locator('textarea').first().fill('Draft I am typing');
  await p.click(W); await p.waitForTimeout(1200);
  log('AC-009:', p.url(), await p.locator('textarea').first().inputValue(), 'selected:', await sel(p));
  await p.close(); }
// SCN-002 nested
{ const p = await np();
  await p.goto(B+'/workspace'); await p.waitForTimeout(3000);
  await p.getByText('prototype-workspace',{exact:true}).first().click(); await p.waitForTimeout(500);
  for (const s of ['[data-test="workspace-team-definition-row-team-video"]','[data-test="workspace-team-row-team-run-video-0001"]']) { await p.click(s); await p.waitForTimeout(1500); }
  await p.click('text=post_production'); await p.waitForTimeout(800);
  await p.getByText('colorist',{exact:true}).first().click(); await p.waitForTimeout(1800);
  const url=p.url();
  await p.click(C); await p.waitForTimeout(400); log('SCN-002 lit:', await lit(p));
  await p.click(W); await p.waitForTimeout(1800);
  log('SCN-002 after:', p.url()===url?'URL unchanged':'URL CHANGED', 'header:', await header(p), await sel(p));
  await p.mouse.move(700,450); await p.waitForTimeout(250);
  await p.screenshot({ path: V+'VIS-004-nested-subteam-member-revealed-desktop-1440x900.png' });
  log('errors', p.errs); await p.close(); }
// SCN-003 org, short window, keyboard
{ const p = await np(1440,620);
  await p.goto(B+'/workspace'); await p.waitForTimeout(3000);
  await p.getByText('prototype-workspace',{exact:true}).first().click(); await p.waitForTimeout(500);
  await p.click('[data-test="agent-org-definition-org-product-launch"]'); await p.waitForTimeout(800);
  await p.click('[data-test="agent-org-run-open-org-run-001"]'); await p.waitForTimeout(2000);
  await p.click('[data-test="agent-org-team-row-org-team-run-001"]'); await p.waitForTimeout(1500);
  await p.locator('[data-test^="agent-org-agent-row-"]').last().click(); await p.waitForTimeout(1800);
  const url=p.url();
  await p.click(C); await p.waitForTimeout(400); log('SCN-003 lit:', await lit(p), 'focus:', await p.evaluate(()=>document.activeElement?.dataset.test));
  await p.mouse.move(700,300); await p.keyboard.press('Enter'); await p.waitForTimeout(1800);
  log('SCN-003 after:', p.url()===url?'URL unchanged':'URL CHANGED', 'header:', await header(p), await sel(p));
  await p.screenshot({ path: V+'VIS-005-org-member-scrolled-into-view-keyboard-focus-desktop-1440x620.png' });
  log('errors', p.errs); await p.close(); }
// SCN-005 narrow drawer
{ const p = await np(760,900);
  await p.goto(B+'/chat?id=run-research-001'); await p.waitForTimeout(3000);
  log('narrow:', await p.getAttribute('[data-test="workspace-left-navigation-strip"]','data-strip-activation'), 'lit:', await lit(p));
  await p.focus(W); await p.keyboard.press('Enter'); await p.waitForTimeout(1500);
  log('drawer:', await p.locator('[data-test="app-left-navigation-drawer"]').count(), p.url(), await sel(p));
  await p.screenshot({ path: V+'VIS-007-narrow-window-drawer-run-revealed-760x900.png' });
  await p.keyboard.press('Escape'); await p.waitForTimeout(600);
  log('after Escape focus:', await p.evaluate(()=>document.activeElement?.dataset.test));
  await p.close(); }
// 390 mobile-width sanity (strip/drawer)
{ const p = await np(390,844);
  await p.goto(B+'/chat?id=run-research-001'); await p.waitForTimeout(3000);
  log('390:', await p.locator(W).count() ? 'strip shown' : 'no strip', p.errs);
  await p.screenshot({ path: '/tmp/clpe/390.png' });
  await p.close(); }
// SCN-004
{ const p = await np();
  await p.goto(B+'/chat?id=run-research-001'); await p.waitForTimeout(2500);
  await p.click(C); await p.waitForTimeout(300);
  await p.click('[data-test="workspace-left-navigation-strip"] [data-nav-key="agents"]'); await p.waitForTimeout(1500);
  log('SCN-004:', p.url(), 'docked:', await p.locator('[data-test="app-left-panel-shell"]').count());
  await p.close(); }
// short window
for (const H of [481, 500, 540, 541]) { const p = await np(1440,H);
  await p.goto(B+'/chat?id=run-research-001'); await p.waitForTimeout(2500);
  await p.click(C); await p.waitForTimeout(300);
  log(H, await p.evaluate(() => { const s=document.querySelector('[data-test="workspace-left-navigation-strip"]'); return {sh:s.scrollHeight, ch:s.clientHeight, divider:getComputedStyle(s.querySelector('[data-test="workspace-left-strip-workspaces-divider"]')).display}; }));
  if (H===500) { await calm(p); await p.screenshot({ path: V+'VIS-008-short-window-strip-desktop-1440x500.png' }); }
  await p.close(); }
await browser.close();
