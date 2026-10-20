// runtime-lifecycle-review: final visual references, captured after the user's approval (2026-10-20).
// BASE=http://127.0.0.1:4701 OUT=./ node capture-references.mjs
// Time is driven by Playwright's clock (the page's timers are paused), so every capture is deterministic.
import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design/node_modules/playwright-core/index.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:4701', OUT = process.env.OUT || './';
const URL = `${BASE}/settings?section=agent-runtimes`;
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const open = async (w, h, { scenario = '', context = '', locale = '', run = 2400 } = {}) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(([s, c, l]) => { if (s) localStorage.setItem('autobyteus.prototype.scenario', s); if (c) localStorage.setItem('autobyteus.prototype.context', c); if (l) localStorage.setItem('autobyteus.localization.preference-mode', l); }, [scenario, context, locale]);
  const p = await ctx.newPage(); p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await p.clock.install({ time: 1000 }); await p.clock.pauseAt(2000); await p.goto(URL); await p.waitForTimeout(1800);
  if (run) { await p.clock.runFor(run); await p.waitForTimeout(300); }
  return p;
};
const tick = async (p, ms) => { await p.clock.runFor(ms); await p.waitForTimeout(350); };
const t = (p, id) => p.locator(`[data-testid="${id}"]`);
const shot = async (p, name, o = {}) => { await p.clock.runFor(150); await p.waitForTimeout(300); /* lets the icon set render under the paused clock */ await p.mouse.move(5, p.viewportSize().height - 5); await p.evaluate(() => document.activeElement?.blur?.()); await p.waitForTimeout(250); await p.screenshot({ path: `${OUT}${name}.png`, ...o }); await p.context().close(); };
const D = [1440, 760];

{ const p = await open(...D); await shot(p, 'VIS-001-default-1440x760'); }
{ const p = await open(...D, { scenario: 'runtimes_mac' }); await shot(p, 'VIS-002-your-mac-all-installed-1440x760'); }
{ const p = await open(...D, { run: 1900 }); await shot(p, 'VIS-003-checking-runtimes-resolve-one-by-one-1440x760'); }
{ const p = await open(...D); await t(p, 'runtime-claude-update').click(); await tick(p, 2300); await shot(p, 'VIS-004-claude-updating-1440x760'); }
{ const p = await open(...D); await t(p, 'runtime-claude-update').click(); await tick(p, 4600); await shot(p, 'VIS-005-claude-updated-rechecking-1440x760'); }
{ const p = await open(...D, { scenario: 'runtimes_update_fails' }); await t(p, 'runtime-claude-update').click(); await tick(p, 3600); await shot(p, 'VIS-006-claude-update-failed-1440x760'); }
{ const p = await open(...D, { scenario: 'runtimes_agents_running' }); await shot(p, 'VIS-007-update-unavailable-agents-running-1440x760'); }
{ const p = await open(...D); await t(p, 'runtime-codex-signin-button').click(); await tick(p, 300); await shot(p, 'VIS-008-codex-signing-in-1440x760'); }
{ const p = await open(...D, { scenario: 'runtimes_sign_in_fails' }); await t(p, 'runtime-codex-signin-button').click(); await tick(p, 5300); await shot(p, 'VIS-009-codex-sign-in-failed-1440x760'); }
{ const p = await open(...D); await t(p, 'runtime-antigravity-signin-button').click(); await tick(p, 300); await shot(p, 'VIS-010-antigravity-terminal-press-enter-1440x760'); }
{ const p = await open(...D); await t(p, 'runtime-antigravity-signin-button').click(); await tick(p, 300); await p.keyboard.press('Enter'); await tick(p, 500); await shot(p, 'VIS-011-antigravity-terminal-finish-in-browser-1440x760'); }
{ const p = await open(...D); await t(p, 'runtime-antigravity-signin-button').click(); await tick(p, 300); await p.keyboard.press('Enter'); await tick(p, 4100); await shot(p, 'VIS-012-antigravity-signed-in-terminal-closing-1440x760'); }
{ const p = await open(...D, { scenario: 'runtimes_signed_out' }); await shot(p, 'VIS-013-all-signed-out-claude-command-line-1440x760'); }
{ const p = await open(...D, { scenario: 'runtimes_mixed' }); await shot(p, 'VIS-014-mixed-not-installed-check-failed-blocked-1440x760'); }
{ const p = await open(...D, { scenario: 'runtimes_all_current' }); await shot(p, 'VIS-015-all-up-to-date-1440x760'); }
{ const p = await open(...D, { scenario: 'runtimes_check_failed' }); await shot(p, 'VIS-016-all-checks-failed-1440x760'); }
{ const p = await open(...D, { run: 0 }); await tick(p, 300); await shot(p, 'VIS-017-loading-1440x760'); }
{ const p = await open(...D, { scenario: 'runtimes_load_failed', run: 1200 }); await shot(p, 'VIS-018-load-error-1440x760'); }
{ const p = await open(...D, { context: 'electron_remote' }); await shot(p, 'VIS-019-remote-node-status-only-1440x760'); }
{ const p = await open(...D, { locale: 'zh-CN' }); await shot(p, 'VIS-020-zh-CN-default-1440x760'); }
{ const p = await open(...D, { locale: 'zh-CN' }); await t(p, 'runtime-antigravity-signin-button').click(); await tick(p, 300); await shot(p, 'VIS-021-zh-CN-terminal-1440x760'); }
{ const p = await open(390, 1500, { scenario: 'runtimes_mixed' }); await shot(p, 'VIS-022-narrow-mixed-390x1500', { fullPage: true }); }
{ const p = await open(390, 1500); await t(p, 'runtime-antigravity-signin-button').click(); await tick(p, 300); await shot(p, 'VIS-023-narrow-terminal-390x1500', { fullPage: true }); }
await browser.close();
