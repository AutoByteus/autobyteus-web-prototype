// settings-update-notifications: final VIS references (after user approval). BASE=<url> OUT=<dir>/ node capture-references.mjs
import { chromium } from 'playwright-core';
const B = process.env.BASE || 'http://127.0.0.1:4681', O = process.env.OUT;
const b = await chromium.launch(); const done = []; const errs = [];
const pill = '[data-test="sidebar-notifications-updates"]', center = '[data-testid="notification-center"]';
const entry = (id) => `${center} [data-testid="notification-entry-${id}"]`;
const page = async ({ w = 1440, h = 900, scenario = null, lang = null } = {}) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(e.message));
  if (scenario || lang) await ctx.addInitScript(([sc, lg]) => { if (sc) localStorage.setItem('autobyteus.prototype.notifications', sc); if (lg) localStorage.setItem('autobyteus.localization.preference-mode', lg); }, [scenario, lang]);
  return p; };
const shot = async (p, id, name, w = 1440, h = 900) => { const f = `${id}-${name}-${w}x${h}.png`; await p.screenshot({ path: O + f }); done.push(f); };
const open = async (p, sel = pill) => { await p.locator(sel).filter({ visible: true }).first().click(); await p.waitForTimeout(400); };
const chat = async (o = {}) => { const p = await page(o); await p.goto(B + '/chat'); await p.waitForTimeout(6000); return p; };
const basics = async (o = {}) => { const p = await page(o); await p.goto(B + '/settings?section=server-settings'); await p.waitForTimeout(4500); await p.locator('[data-testid="update-checks-card"]').scrollIntoViewIfNeeded(); await p.waitForTimeout(300); return p; };

{ const p = await chat(); await shot(p, 'VIS-001', 'entry-new');
  await p.hover(pill); await p.waitForTimeout(400); await shot(p, 'VIS-002', 'entry-hover-types');
  await open(p); await shot(p, 'VIS-003', 'panel-open');
  await p.mouse.click(900, 300); await p.mouse.move(900, 40); await p.waitForTimeout(400); await shot(p, 'VIS-004', 'entry-seen');
  await open(p); await p.click(`${entry('pkg-autobyteus-agents')} [data-testid="notification-entry-summary"]`); await p.waitForTimeout(200); await shot(p, 'VIS-005', 'package-details');
  await p.click(`${entry('pkg-autobyteus-agents')} [data-testid="notification-entry-summary"]`); await p.click(`${entry('app')} [data-testid="notification-entry-summary"]`); await p.waitForTimeout(200); await shot(p, 'VIS-006', 'app-release-notes');
  await p.click(`${entry('app')} [data-testid="notification-entry-summary"]`);
  await p.click(`${entry('pkg-autobyteus-agents')} [data-testid="notification-entry-update"]`); await p.waitForTimeout(300); await shot(p, 'VIS-007', 'package-updating');
  await p.waitForTimeout(1800); await shot(p, 'VIS-008', 'package-updated-clear');
  await p.click(`${entry('pkg-research')} [data-testid="notification-entry-update"]`); await p.waitForTimeout(2000); await shot(p, 'VIS-009', 'package-failed-try-again');
  await p.click(`${entry('skills-autobyteus')} [data-testid="notification-entry-update"]`); await p.waitForTimeout(500); await shot(p, 'VIS-010', 'skill-update-confirmation');
  await p.getByRole('button', { name: 'Cancel' }).click(); await p.waitForTimeout(300);
  await p.click(`${entry('app')} [data-testid="notification-entry-update"]`); await p.waitForTimeout(1200); await shot(p, 'VIS-011', 'app-downloading');
  await p.waitForTimeout(3500); await shot(p, 'VIS-012', 'app-downloaded-install');
  await p.click(`${entry('app')} [data-testid="notification-entry-install"]`); await p.waitForTimeout(400); await shot(p, 'VIS-013', 'app-installing');
  await p.close(); }
{ const p = await chat(); await open(p); await p.keyboard.press('Tab'); await p.waitForTimeout(200); await shot(p, 'VIS-014', 'keyboard-focus-first-control'); await p.close(); }
{ const p = await chat({ scenario: 'many' }); await open(p); await shot(p, 'VIS-015', 'many-show-more');
  await p.click(`${center} [data-testid="notification-card-agent_package"] [data-testid="notification-card-more"]`); await p.waitForTimeout(300); await shot(p, 'VIS-016', 'many-expanded'); await p.close(); }
{ const p = await chat(); await p.click('[data-test="app-left-panel-collapse"]'); await p.waitForTimeout(500); await p.mouse.move(900, 40); await shot(p, 'VIS-017', 'strip-entry');
  await open(p); await shot(p, 'VIS-018', 'strip-panel-open'); await p.close(); }
{ const p = await chat({ scenario: 'browser' }); await open(p); await shot(p, 'VIS-019', 'browser-window-no-software');
  await p.click(`${entry('pkg-autobyteus-agents')} [data-testid="notification-entry-update"]`); await p.click(`${entry('pkg-research')} [data-testid="notification-entry-update"]`); await p.waitForTimeout(2000);
  await p.click(`${entry('pkg-research')} [data-testid="notification-entry-update"]`); await p.click(`${entry('skills-autobyteus')} [data-testid="notification-entry-update"]`); await p.waitForTimeout(300);
  await p.getByRole('button', { name: 'Update', exact: true }).last().click(); await p.waitForTimeout(2200);
  for (const id of ['pkg-autobyteus-agents', 'pkg-research', 'skills-autobyteus', 'skills-design']) { await p.click(`${entry(id)} [data-testid="notification-entry-clear"]`); await p.waitForTimeout(150); }
  await p.waitForTimeout(300); await shot(p, 'VIS-020', 'panel-all-cleared-empty'); await p.close(); }
{ const p = await chat({ scenario: 'empty' }); await shot(p, 'VIS-021', 'nothing-waiting-no-entry'); await p.close(); }
{ const p = await basics(); await shot(p, 'VIS-022', 'update-checks-card-on'); await p.close(); }
{ const p = await basics({ scenario: 'off' }); await shot(p, 'VIS-023', 'update-checks-card-off'); await p.close(); }
{ const p = await chat({ lang: 'zh-CN' }); await open(p); await shot(p, 'VIS-024', 'panel-open-zh-CN'); await p.close(); }
{ const p = await basics({ lang: 'zh-CN' }); await shot(p, 'VIS-025', 'update-checks-card-zh-CN'); await p.close(); }
{ const p = await chat({ w: 1000, h: 760 }); await open(p); await shot(p, 'VIS-026', 'panel-open-compact', 1000, 760); await p.close(); }
{ const p = await chat({ w: 390, h: 844 }); await shot(p, 'VIS-027', 'narrow-strip-entry', 390, 844); await open(p); await shot(p, 'VIS-028', 'narrow-panel-open', 390, 844); await p.close(); }
await b.close(); console.log(done.length + ' references'); console.log('page errors: ' + JSON.stringify(errs).slice(0, 300));
