import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/settings-update-notifications/node_modules/playwright-core/index.mjs';
const B=process.env.BASE||'http://127.0.0.1:4681', O=process.env.OUT||'/tmp/sun/shots/';
const browser = await chromium.launch(); const log=(...a)=>console.log(...a); const res=[];
const check=(id,ok,d)=>{res.push({id,ok,d}); log(ok?'PASS':'FAIL',id,JSON.stringify(d??null).slice(0,220));};
const page = async (w=1440,h=900,s=1,scenario=null,lang=null) => { const ctx = await browser.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:s }); const p = await ctx.newPage(); p.on('pageerror', e => log('PAGEERR', e.message));
  if (scenario || lang) await ctx.addInitScript(([sc,lg]) => { if (sc) localStorage.setItem('autobyteus.prototype.notifications', sc); if (lg) localStorage.setItem('autobyteus.localization.preference-mode', lg); }, [scenario, lang]); return p; };
const rail = '[data-testid="settings-notifications-rail"]';
const item = (id) => `${rail} [data-testid="update-notification-${id}"]`;
// N-001 sidebar entry (round 2) and read
{ const p = await page(); await p.goto(B+'/chat'); await p.waitForTimeout(6000);
  const panelText = await p.locator('[data-test="sidebar-notifications-updates"]').getAttribute('aria-label');
  await p.click('[data-test="app-left-panel-collapse"]').catch(()=>{}); await p.waitForTimeout(400);
  const stripLabel = await p.locator('button[data-test="sidebar-notifications-updates"]').getAttribute('aria-label');
  check('N-001 sidebar shows a labelled Updates entry (panel) and the icon with a count (strip)', panelText==='3 updates available' && stripLabel==='3 updates available', { panelText, stripLabel });
  await p.click('button[data-test="sidebar-notifications-updates"]'); await p.waitForTimeout(3500);
  check('N-002 the entry opens the notification area; items marked New this visit', /section=notifications/.test(p.url()) && await p.locator(`${rail} [data-testid="update-notification-new"]`).count()===3 && (await p.locator('[data-testid="settings-notifications-new-count"]').innerText())==='3 new', p.url());
  await p.click('[data-testid="settings-nav-back"]'); await p.waitForTimeout(3000);
  check('N-003 after viewing, the sidebar entry is gone (read)', await p.locator('[data-test="sidebar-notifications-updates"]').count()===0, null);
  await p.close(); }
// N-004.. actions
{ const p = await page(); await p.goto(B+'/settings?section=updates'); await p.waitForTimeout(6000);
  await p.click(`${item('pkg-autobyteus-agents')} [data-testid="update-notification-update"]`); await p.waitForTimeout(400);
  const updating = await p.locator(`${item('pkg-autobyteus-agents')} [data-testid="update-notification-updating"]`).count();
  await p.screenshot({ path: O+'r2-01-updating.png', clip:{x:1088,y:200,width:352,height:200} });
  await p.waitForTimeout(1800);
  check('N-004 package Update: updating, then updated', updating===1 && (await p.locator(item('pkg-autobyteus-agents')).getAttribute('data-state'))==='handled', await p.locator(`${item('pkg-autobyteus-agents')} [data-testid="update-notification-handled"]`).innerText().catch(()=>null));
  await p.click(`${item('pkg-research')} [data-testid="update-notification-update"]`); await p.waitForTimeout(2000);
  const err = await p.locator(`${item('pkg-research')} [data-testid="update-notification-error"]`).innerText().catch(()=>null);
  await p.locator(item('pkg-research')).scrollIntoViewIfNeeded(); await p.screenshot({ path: O+'r2-02-failed.png' });
  check('N-005 failed update shows the error and keeps the item; Try again', /Nothing was changed/.test(err||'') && (await p.locator(`${item('pkg-research')} [data-testid="update-notification-update"]`).innerText())==='Try again', err);
  await p.click(`${item('pkg-research')} [data-testid="update-notification-update"]`); await p.waitForTimeout(2000);
  check('N-006 Try again succeeds', (await p.locator(item('pkg-research')).getAttribute('data-state'))==='handled', null);
  await p.click(`${item('skills-autobyteus')} [data-testid="update-notification-update"]`); await p.waitForTimeout(500);
  const dialog = await p.locator('[data-testid="settings-notifications-confirm-source"]').count();
  await p.screenshot({ path: O+'r2-03-skill-confirm.png' });
  await p.getByRole('button', { name: 'Cancel' }).click(); await p.waitForTimeout(300);
  const afterCancel = await p.locator(item('skills-autobyteus')).getAttribute('data-state');
  await p.click(`${item('skills-autobyteus')} [data-testid="update-notification-update"]`); await p.waitForTimeout(400);
  await p.getByRole('button', { name: 'Update', exact: true }).last().click(); await p.waitForTimeout(2200);
  check('N-007 skill source Update asks the existing confirmation; Cancel changes nothing; confirm updates', dialog===1 && afterCancel==='waiting' && (await p.locator(item('skills-autobyteus')).getAttribute('data-state'))==='handled', afterCancel);
  await p.click(`${item('skills-design')} [data-testid="update-notification-clear"]`); await p.waitForTimeout(300);
  check('N-008 Clear removes an updated item', await p.locator(item('skills-design')).count()===0, null);
  // app
  await p.click(`${rail} [data-testid="update-notification-app"] [data-testid="update-notification-update"]`); await p.waitForTimeout(1200);
  const prog = await p.locator(`${rail} [data-testid="update-notification-app-progress"]`).innerText().catch(()=>null);
  const updStatus = await p.locator('[data-testid="settings-updates-status"]').innerText();
  await p.screenshot({ path: O+'r2-04-app-downloading.png' });
  await p.waitForTimeout(3500);
  const installBtn = await p.locator(`${rail} [data-testid="update-notification-install"]`).count();
  await p.screenshot({ path: O+'r2-05-app-downloaded.png' });
  await p.click(`${rail} [data-testid="update-notification-install"]`); await p.waitForTimeout(400);
  check('N-009 app: Download shows progress (also in Settings → Updates), then Install and restart', /Downloading \d+%/.test(prog||'') && installBtn===1 && await p.locator(`${rail} [data-testid="update-notification-app-installing"]`).count()===1, { prog, updStatus });
  await p.close(); }
// skip
{ const p = await page(); await p.goto(B+'/settings?section=display'); await p.waitForTimeout(6000);
  await p.click(`${item('pkg-autobyteus-agents')} [data-testid="update-notification-skip"]`);
  await p.click(`${rail} [data-testid="update-notification-app"] [data-testid="update-notification-skip"]`); await p.waitForTimeout(300);
  check('N-010 Skip this version removes the item (package and app)', await p.locator(item('pkg-autobyteus-agents')).count()===0 && await p.locator(`${rail} [data-testid="update-notification-app"]`).count()===0, null);
  await p.click(`${rail} [data-testid="settings-notifications-setting-toggle"]`); await p.waitForTimeout(300);
  check('N-011 turning background checks off keeps the list and says so', (await p.locator(`${rail} [data-testid="settings-notifications-setting-toggle"]`).getAttribute('aria-checked'))==='false' && await p.locator(`${rail} [data-testid="settings-notifications-off-notice"]`).count()===1, null);
  await p.close(); }
// scenarios
for (const [sc, id, expect] of [['empty','N-012 empty state (checks on)','Updates to the app'],['off','N-013 empty state with checks off','Background checks are off']]) {
  const p = await page(1440,900,1,sc); await p.goto(B+'/settings?section=display'); await p.waitForTimeout(6000);
  const t = await p.locator(`${rail} [data-testid="settings-notifications-empty"]`).innerText().catch(()=>'');
  check(id, t.includes('No updates waiting') && t.includes(expect), t.replace(/\n/g,' | '));
  await p.screenshot({ path: O+`r2-06-${sc}.png` });
  await p.goto(B+'/chat'); await p.waitForTimeout(3000);
  check(id+': no sidebar entry', await p.locator('[data-test="sidebar-notifications-updates"]').count()===0, null); await p.close(); }
{ const p = await page(1440,900,1,'browser'); await p.goto(B+'/settings?section=display'); await p.waitForTimeout(6000);
  check('N-014 browser window: no app notification', await p.locator(`${rail} [data-testid="update-notification-app"]`).count()===0 && await p.locator(`${rail} [data-testid^="update-notification-pkg"]`).count()>0, null); await p.close(); }
{ const p = await page(1440,900,1,'many'); await p.goto(B+'/settings?section=display'); await p.waitForTimeout(6000);
  check('N-015 many items scroll inside the rail', await p.locator(`${rail} li.update-notification`).count()===11, await p.locator(`${rail} li.update-notification`).count());
  await p.screenshot({ path: O+'r2-07-many.png' }); await p.close(); }
{ const p = await page(1440,900,1,null,'zh-CN'); await p.goto(B+'/settings?section=display'); await p.waitForTimeout(6000);
  const head = await p.locator(`${rail} h2`).innerText();
  const zhCat = await p.locator(`${rail} [data-testid="settings-notifications-category-updates"]`).innerText();
  check('N-016 zh-CN strings', head==='通知' && zhCat.startsWith('更新') && (await p.locator(`${rail} [data-testid="update-notification-skip"]`).first().innerText())==='跳过此版本', { head, zhCat });
  await p.goto(B+'/chat'); await p.waitForTimeout(3000);
  check('N-017 zh-CN sidebar entry', (await p.locator('[data-test="sidebar-notifications-updates"]').getAttribute('aria-label'))==='3 个可用更新', null);
  await p.screenshot({ path: O+'r2-08-zh-CN.png' }); await p.close(); }
await browser.close(); log(res.filter(r=>r.ok).length+'/'+res.length);
