// embedding-model-settings: final visual references, captured after the user's approval (2026-10-19).
// WEB-BASELINE-REFRESH-011 copy (harness: a capture that stops on a missing element is logged SKIPPED and the run continues): Playwright import, browser, data-testids (search-* -> the shipped embedding-*; Project ids carry the source projectId prefix) and scenario keys (search_* -> embedding_*, search_empty -> empty). Expectations are unchanged.
// BASE=http://127.0.0.1:4691 OUT=./ node capture-references.mjs
// Time is driven by Playwright's clock (the page's timers are paused), so every capture is deterministic.
import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-011/node_modules/playwright-core/index.mjs';
// OUT must be a folder outside tickets/; the approved references are never overwritten.
const BASE = process.env.BASE || 'http://127.0.0.1:4691', OUT = process.env.OUT || './';
const URL = `${BASE}/settings?section=server-settings&mode=embedding`;
const browser = await chromium.launch({ executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const open = async (w, h, { scenario = '', locale = '', run = 800 } = {}) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(([s, l]) => { if (s) localStorage.setItem('autobyteus.prototype.scenario', s); if (l) localStorage.setItem('autobyteus.localization.preference-mode', l); }, [scenario, locale]);
  const p = await ctx.newPage(); p.setDefaultTimeout(4000); p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await p.clock.install({ time: 1000 }); await p.clock.pauseAt(2000); await p.goto(URL); await p.waitForTimeout(1800);
  if (run) { await p.clock.runFor(run); await p.waitForTimeout(300); }
  return p;
};
const tick = async (p, ms) => { await p.clock.runFor(ms); await p.waitForTimeout(350); };
const t = (p, id) => p.locator(`[data-testid="${id}"]`);
const shot = async (p, name, o = {}) => { await p.mouse.move(5, p.viewportSize().height - 5); await p.evaluate(() => document.activeElement?.blur?.()); await p.waitForTimeout(250); await p.screenshot({ path: `${OUT}${name}.png`, ...o }); await p.context().close(); };
const M = 'embedding-model-embeddinggemma-2', L = 'embedding-model-mdbr-leaf-ir';
const D = [1440, 1180];

try { const p = await open(...D); await shot(p, 'VIS-001-embedding-default-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(...D); await t(p, `${M}-download`).click(); await tick(p, 7000); await shot(p, 'VIS-002-download-ahead-progress-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(...D, { scenario: 'embedding_offline' }); await t(p, `${M}-download`).click(); await tick(p, 8000); await shot(p, 'VIS-003-download-failed-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(...D); await t(p, `${M}-use`).click(); await tick(p, 100); await shot(p, 'VIS-004-switch-dialog-not-downloaded-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(...D); await t(p, `${L}-use`).click(); await tick(p, 100); await shot(p, 'VIS-005-switch-dialog-downloaded-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(...D); await t(p, `${L}-use`).click(); await t(p, 'embedding-switch-confirm').click(); await tick(p, 5000); await shot(p, 'VIS-006-after-switch-all-projects-not-indexed-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(...D); await t(p, `${M}-use`).click(); await t(p, 'embedding-switch-confirm').click(); await tick(p, 5000); await t(p, 'embedding-index-all').click(); await tick(p, 1000); await shot(p, 'VIS-007-switch-preparing-index-all-waiting-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(...D); await t(p, `${L}-remove`).click(); await tick(p, 100); await shot(p, 'VIS-008-remove-confirmation-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(...D); await t(p, 'embedding-project-project-desktop-app-rebuild').click(); await tick(p, 100); await shot(p, 'VIS-009-rebuild-confirmation-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(...D); await t(p, 'embedding-project-project-prototype-launch-index').click(); await tick(p, 8000); await shot(p, 'VIS-010-needs-update-indexing-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(...D, { scenario: 'embedding_unavailable' }); await shot(p, 'VIS-011-model-unavailable-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(1440, 2000, { scenario: 'search_many_projects' }); await shot(p, 'VIS-012-many-projects-1440x2000'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(1440, 1500, { scenario: 'search_many_projects' }); await t(p, 'embedding-filter-needs').click(); await t(p, 'embedding-project-find').fill('p'); await tick(p, 100); await shot(p, 'VIS-013-many-projects-filtered-1440x1500'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(...D, { scenario: 'empty' }); await shot(p, 'VIS-014-no-projects-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(...D, { run: 0 }); await shot(p, 'VIS-015-loading-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(...D, { scenario: 'embedding_load_failed' }); await shot(p, 'VIS-016-load-error-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(...D, { locale: 'zh-CN' }); await shot(p, 'VIS-017-zh-CN-default-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(...D, { locale: 'zh-CN' }); await t(p, `${M}-use`).click(); await tick(p, 100); await shot(p, 'VIS-018-zh-CN-switch-dialog-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { const p = await open(...D, { locale: 'zh-CN', scenario: 'embedding_offline' }); await t(p, `${M}-download`).click(); await tick(p, 8000); await shot(p, 'VIS-019-zh-CN-download-failed-1440x1180'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
for (const [i, top] of [[0, 0], [1, 700], [2, 1400]]) {
  const p = await open(390, 1100); await p.evaluate((y) => { document.querySelector('[data-testid="settings-page-content"]').scrollTop = y; }, top); await p.waitForTimeout(200);
  await shot(p, `VIS-020${'abc'[i]}-narrow-390x1100-scroll-${top}`);
}
try { const p = await open(390, 1100); await t(p, `${M}-use`).click(); await tick(p, 100); await shot(p, 'VIS-021-narrow-switch-dialog-390x1100'); } catch (e) { console.log('SKIPPED', e.message.split('\n')[0]); for (const c of browser.contexts()) await c.close().catch(() => {}) }
await browser.close(); console.log('done');
