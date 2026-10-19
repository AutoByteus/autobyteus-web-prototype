// search-model-settings: final visual references, captured after the user's approval (2026-10-19).
// BASE=http://127.0.0.1:4691 OUT=./ node capture-references.mjs
// Time is driven by Playwright's clock (the page's timers are paused), so every capture is deterministic.
import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design/node_modules/playwright-core/index.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:4691', OUT = process.env.OUT || './';
const URL = `${BASE}/settings?section=server-settings&mode=embedding`;
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const open = async (w, h, { scenario = '', locale = '', run = 800 } = {}) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(([s, l]) => { if (s) localStorage.setItem('autobyteus.prototype.scenario', s); if (l) localStorage.setItem('autobyteus.localization.preference-mode', l); }, [scenario, locale]);
  const p = await ctx.newPage(); p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await p.clock.install({ time: 1000 }); await p.clock.pauseAt(2000); await p.goto(URL); await p.waitForTimeout(1800);
  if (run) { await p.clock.runFor(run); await p.waitForTimeout(300); }
  return p;
};
const tick = async (p, ms) => { await p.clock.runFor(ms); await p.waitForTimeout(350); };
const t = (p, id) => p.locator(`[data-testid="${id}"]`);
const shot = async (p, name, o = {}) => { await p.mouse.move(5, p.viewportSize().height - 5); await p.evaluate(() => document.activeElement?.blur?.()); await p.waitForTimeout(250); await p.screenshot({ path: `${OUT}${name}.png`, ...o }); await p.context().close(); };
const M = 'search-model-embeddinggemma-2', L = 'search-model-mdbr-leaf-ir';
const D = [1440, 1180];

{ const p = await open(...D); await shot(p, 'VIS-001-embedding-default-1440x1180'); }
{ const p = await open(...D); await t(p, `${M}-download`).click(); await tick(p, 7000); await shot(p, 'VIS-002-download-ahead-progress-1440x1180'); }
{ const p = await open(...D, { scenario: 'search_offline' }); await t(p, `${M}-download`).click(); await tick(p, 8000); await shot(p, 'VIS-003-download-failed-1440x1180'); }
{ const p = await open(...D); await t(p, `${M}-use`).click(); await tick(p, 100); await shot(p, 'VIS-004-switch-dialog-not-downloaded-1440x1180'); }
{ const p = await open(...D); await t(p, `${L}-use`).click(); await tick(p, 100); await shot(p, 'VIS-005-switch-dialog-downloaded-1440x1180'); }
{ const p = await open(...D); await t(p, `${L}-use`).click(); await t(p, 'search-switch-confirm').click(); await tick(p, 5000); await shot(p, 'VIS-006-after-switch-all-projects-not-indexed-1440x1180'); }
{ const p = await open(...D); await t(p, `${M}-use`).click(); await t(p, 'search-switch-confirm').click(); await tick(p, 5000); await t(p, 'search-index-all').click(); await tick(p, 1000); await shot(p, 'VIS-007-switch-preparing-index-all-waiting-1440x1180'); }
{ const p = await open(...D); await t(p, `${L}-remove`).click(); await tick(p, 100); await shot(p, 'VIS-008-remove-confirmation-1440x1180'); }
{ const p = await open(...D); await t(p, 'search-project-desktop-app-rebuild').click(); await tick(p, 100); await shot(p, 'VIS-009-rebuild-confirmation-1440x1180'); }
{ const p = await open(...D); await t(p, 'search-project-prototype-launch-index').click(); await tick(p, 8000); await shot(p, 'VIS-010-needs-update-indexing-1440x1180'); }
{ const p = await open(...D, { scenario: 'search_unavailable' }); await shot(p, 'VIS-011-model-unavailable-1440x1180'); }
{ const p = await open(1440, 2000, { scenario: 'search_many_projects' }); await shot(p, 'VIS-012-many-projects-1440x2000'); }
{ const p = await open(1440, 1500, { scenario: 'search_many_projects' }); await t(p, 'search-filter-needs').click(); await t(p, 'search-project-find').fill('p'); await tick(p, 100); await shot(p, 'VIS-013-many-projects-filtered-1440x1500'); }
{ const p = await open(...D, { scenario: 'search_empty' }); await shot(p, 'VIS-014-no-projects-1440x1180'); }
{ const p = await open(...D, { run: 0 }); await shot(p, 'VIS-015-loading-1440x1180'); }
{ const p = await open(...D, { scenario: 'search_load_failed' }); await shot(p, 'VIS-016-load-error-1440x1180'); }
{ const p = await open(...D, { locale: 'zh-CN' }); await shot(p, 'VIS-017-zh-CN-default-1440x1180'); }
{ const p = await open(...D, { locale: 'zh-CN' }); await t(p, `${M}-use`).click(); await tick(p, 100); await shot(p, 'VIS-018-zh-CN-switch-dialog-1440x1180'); }
{ const p = await open(...D, { locale: 'zh-CN', scenario: 'search_offline' }); await t(p, `${M}-download`).click(); await tick(p, 8000); await shot(p, 'VIS-019-zh-CN-download-failed-1440x1180'); }
for (const [i, top] of [[0, 0], [1, 700], [2, 1400]]) {
  const p = await open(390, 1100); await p.evaluate((y) => { document.querySelector('[data-testid="settings-page-content"]').scrollTop = y; }, top); await p.waitForTimeout(200);
  await shot(p, `VIS-020${'abc'[i]}-narrow-390x1100-scroll-${top}`);
}
{ const p = await open(390, 1100); await t(p, `${M}-use`).click(); await tick(p, 100); await shot(p, 'VIS-021-narrow-switch-dialog-390x1100'); }
await browser.close(); console.log('done');
