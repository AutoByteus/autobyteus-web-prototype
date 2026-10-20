import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/settings-update-notifications/node_modules/playwright-core/index.mjs';
const B=process.env.BASE||'http://127.0.0.1:4681', O=process.env.OUT||'/tmp/sun/shots/';
const browser = await chromium.launch(); const log=(...a)=>console.log(...a); const res=[];
const check=(id,ok,d)=>{res.push({id,ok,d}); log(ok?'PASS':'FAIL',id,JSON.stringify(d??null).slice(0,200));};
const page = async (w=1440,h=900,scenario=null,lang=null) => { const ctx = await browser.newContext({ viewport:{width:w,height:h} }); const p = await ctx.newPage(); p.on('pageerror', e => log('PAGEERR', e.message));
  if (scenario || lang) await ctx.addInitScript(([sc,lg]) => { if (sc) localStorage.setItem('autobyteus.prototype.notifications', sc); if (lg) localStorage.setItem('autobyteus.localization.preference-mode', lg); }, [scenario, lang]); return p; };
const pill = '[data-test="sidebar-notifications-updates"]', center = '[data-testid="notification-center"]';
const card = (id) => `${center} [data-testid="notification-card-${id}"]`;
const full = '4 updates available: 1 software update, 2 agent package updates, 1 skill update';
{ const p = await page(); await p.goto(B+'/chat'); await p.waitForTimeout(6000);
  check('C-001 Settings row pill "4 updates", blue while new; name lists the types', (await p.locator(`${pill} span[aria-hidden="true"]`).first().innerText()).trim()==='4 updates' && await p.locator(pill).getAttribute('data-new')==='true' && await p.locator(pill).getAttribute('aria-label')===full, await p.locator(pill).getAttribute('aria-label'));
  await p.click(pill); await p.waitForTimeout(500);
  check('C-002 the pill opens the Notification Center in place (same page); 4 cards + 1 updated', p.url().endsWith('/chat') && await p.locator(`${center} li[data-testid^="notification-card-"]`).count()===5 && await p.locator(`${center} [data-testid="notification-card-new"]`).count()===3, p.url());
  check('C-003 opening marks them read: the pill turns grey', await p.locator(pill).getAttribute('data-new')===null && (await p.locator(pill).getAttribute('aria-expanded'))==='true', null);
  await p.click(`${card('pkg-autobyteus-agents')} [data-testid="notification-card-summary"]`); await p.waitForTimeout(200);
  check('C-004 clicking a card expands its details (repository, compare link)', await p.locator(`${card('pkg-autobyteus-agents')} [data-testid="notification-card-compare"]`).count()===1, null);
  await p.click(`${card('pkg-autobyteus-agents')} [data-testid="notification-card-update"]`); await p.waitForTimeout(300);
  const updating = await p.locator(`${card('pkg-autobyteus-agents')} [data-testid="notification-card-updating"]`).count();
  await p.waitForTimeout(1800);
  check('C-005 Update: updating, then updated', updating===1 && await p.locator(card('pkg-autobyteus-agents')).getAttribute('data-state')==='handled', null);
  await p.click(`${card('pkg-research')} [data-testid="notification-card-update"]`); await p.waitForTimeout(2000);
  const err = await p.locator(`${card('pkg-research')} [data-testid="notification-card-error"]`).innerText().catch(()=>null);
  await p.click(`${card('pkg-research')} [data-testid="notification-card-update"]`); await p.waitForTimeout(2000);
  check('C-006 failure shows the reason; Try again updates', /Nothing was changed/.test(err||'') && await p.locator(card('pkg-research')).getAttribute('data-state')==='handled', err);
  await p.click(`${card('skills-autobyteus')} [data-testid="notification-card-update"]`); await p.waitForTimeout(400);
  const dialog = await p.locator('[data-testid="notification-center-confirm-source"]').count();
  await p.getByRole('button', { name: 'Cancel' }).click(); await p.waitForTimeout(300);
  const stillOpen = await p.locator(center).count();
  const afterCancel = await p.locator(card('skills-autobyteus')).getAttribute('data-state');
  await p.click(`${card('skills-autobyteus')} [data-testid="notification-card-update"]`); await p.waitForTimeout(300);
  await p.getByRole('button', { name: 'Update', exact: true }).last().click(); await p.waitForTimeout(2200);
  check('C-007 skill Update asks the existing confirmation; Cancel keeps the panel and changes nothing; confirm updates', dialog===1 && stillOpen===1 && afterCancel==='waiting' && await p.locator(card('skills-autobyteus')).getAttribute('data-state')==='handled', null);
  await p.click(`${card('app')} [data-testid="notification-card-update"]`); await p.waitForTimeout(1200);
  const prog = await p.locator(`${card('app')} [data-testid="notification-card-progress"]`).innerText().catch(()=>null);
  await p.screenshot({ path: O+'r8-01-app-downloading.png' });
  await p.waitForTimeout(3500);
  const install = await p.locator(`${card('app')} [data-testid="notification-card-install"]`).count();
  check('C-008 app: Download with progress, then Install and restart', /Downloading \d+%/.test(prog||'') && install===1, prog);
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  check('C-009 Esc closes and returns focus to the entry', await p.locator(center).count()===0 && await p.evaluate(()=>document.activeElement?.getAttribute('data-test'))==='sidebar-notifications-updates', null);
  await p.click(pill); await p.waitForTimeout(300); await p.mouse.click(900,300); await p.waitForTimeout(300);
  check('C-010 a click outside closes it', await p.locator(center).count()===0, null);
  await p.click(pill); await p.waitForTimeout(300); await p.click('[data-testid="notification-center-settings"]'); await p.waitForTimeout(3000);
  check('C-011 the gear opens Settings → Notifications (full list and the background-check setting)', /section=notifications/.test(p.url()) && await p.locator('[data-testid="settings-notifications-section"] [data-testid="settings-notifications-setting-toggle"]').count()===1, p.url());
  await p.close(); }
{ const p = await page(); await p.goto(B+'/chat'); await p.waitForTimeout(6000);
  await p.click(pill); await p.waitForTimeout(300);
  await p.click(`${card('pkg-autobyteus-agents')} [data-testid="notification-card-skip"]`); await p.click(`${card('app')} [data-testid="notification-card-skip"]`); await p.waitForTimeout(300);
  check('C-012 Skip this version removes the card (package and app)', await p.locator(card('pkg-autobyteus-agents')).count()===0 && await p.locator(card('app')).count()===0, null);
  await p.click(`${card('skills-design')} [data-testid="notification-card-clear"]`); await p.waitForTimeout(200);
  check('C-013 Clear removes an updated card', await p.locator(card('skills-design')).count()===0, null);
  await p.close(); }
{ const p = await page(); await p.goto(B+'/chat'); await p.waitForTimeout(6000);
  await p.click('[data-test="app-left-panel-collapse"]'); await p.waitForTimeout(400);
  const stripName = await p.locator(`button${pill}`).getAttribute('aria-label');
  await p.click(`button${pill}`); await p.waitForTimeout(400);
  const box = await p.locator(center).boundingBox();
  check('C-014 collapsed strip: the icon with its count opens the panel beside it', stripName===full && box && box.x > 50, { stripName, x: box?.x });
  await p.close(); }
for (const [sc,id] of [['empty','C-015 nothing waiting: no entry on the Settings row'],['off','C-016 checks off and nothing waiting: no entry']]) {
  const p = await page(1440,900,sc); await p.goto(B+'/chat'); await p.waitForTimeout(6000);
  check(id, await p.locator(pill).count()===0, null);
  await p.goto(B+'/settings?section=notifications'); await p.waitForTimeout(3000);
  const t = await p.locator('[data-testid="settings-notifications-empty"]').innerText().catch(()=>'');
  check(id+': Settings section empty state', t.includes('No updates waiting'), t.replace(/\n/g,' | '));
  await p.close(); }
{ const p = await page(1440,900,'browser'); await p.goto(B+'/chat'); await p.waitForTimeout(6000); await p.click(pill); await p.waitForTimeout(300);
  check('C-017 browser window: no software update card', await p.locator(card('app')).count()===0 && (await p.locator(`${pill} span[aria-hidden="true"]`).first().innerText()).trim()==='3 updates', null); await p.close(); }
{ const p = await page(1440,900,null,'zh-CN'); await p.goto(B+'/chat'); await p.waitForTimeout(6000);
  const zhText = (await p.locator(`${pill} span[aria-hidden="true"]`).first().innerText()).trim();
  await p.click(pill); await p.waitForTimeout(400);
  const head = await p.locator(`${center} h2`).innerText();
  check('C-018 zh-CN', zhText==='4 个更新' && head==='通知' && (await p.locator(`${card('pkg-autobyteus-agents')} [data-testid="notification-card-kind"]`).innerText())==='智能体包更新', { zhText, head });
  await p.screenshot({ path: O+'r8-02-zh-CN.png' }); await p.close(); }
await browser.close(); log(res.filter(r=>r.ok).length+'/'+res.length);
