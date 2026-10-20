// task-part-of: final visual references, captured after the user's approval (2026-10-19).
// WEB-BASELINE-REFRESH-011 copy: Playwright import and browser only. Expectations are unchanged. OUT must be outside tickets/.
// BASE=http://127.0.0.1:4671 OUT=./ node capture-references.mjs
import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-011/node_modules/playwright-core/index.mjs';
const B = process.env.BASE || 'http://127.0.0.1:4671', O = process.env.OUT || './';
const browser = await chromium.launch({ executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const PR = '/projects/project-desktop-app';
const page = async (w = 1440, h = 900, s = 1, locale) => { const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: s });
  if (locale) await ctx.addInitScript((l) => localStorage.setItem('autobyteus.localization.preference-mode', l), locale);
  const p = await ctx.newPage(); p.on('pageerror', (e) => console.log('PAGEERR', e.message)); return p; };
const go = async (p, path, wait = 4000) => { await p.goto(B + path); await p.waitForTimeout(wait); await p.mouse.move(5, 890); await p.evaluate(() => document.activeElement?.blur()); await p.waitForTimeout(300); };
const box = async (p, sel, pad = 8) => { const b = await p.locator(sel).first().boundingBox(); return { x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: b.width + pad * 2, height: b.height + pad * 2 }; };
const card = (id) => `[data-testid="project-task-row-${id}"]`;
const shot = (p, name, o = {}) => p.screenshot({ path: O + name + '.png', ...o });
const tab = async (p) => { await go(p, '/chat?id=run-ptm-0001', 6000); await p.getByText('Projects', { exact: true }).last().click(); await p.waitForTimeout(2000); await p.mouse.move(5, 890); };

{ const p = await page(); await go(p, PR, 6000); await shot(p, 'VIS-001-board-parents-and-parts-1440x900'); await p.context().close(); }
{ const p = await page(1440, 900, 2); await go(p, PR, 6000);
  for (const [id, name] of [['po-cross-node', 'VIS-002a-card-parent-2-of-4-2x'], ['po-history', 'VIS-002b-card-parent-all-done-2x'], ['po-sources', 'VIS-002c-card-parent-none-done-2x'], ['po-cn-team-view', 'VIS-002d-card-part-with-blocked-badge-2x'], ['po-cn-route', 'VIS-002e-card-part-2x'], ['po-themes', 'VIS-002f-card-parent-only-cancelled-parts-no-progress-2x']]) {
    await p.locator(card(id)).scrollIntoViewIfNeeded(); await p.mouse.move(5, 890); await p.waitForTimeout(200); await shot(p, name, { clip: await box(p, card(id), 0) }); }
  await p.context().close(); }
{ const p = await page(); for (const [path, name] of [
  [`${PR}/tasks/po-cross-node`, 'VIS-003-page-parent-2-of-4-1440x900'], [`${PR}/tasks/po-history`, 'VIS-004-page-parent-all-parts-done-1440x900'],
  [`${PR}/tasks/tk-agent-loop`, 'VIS-005-page-parent-no-parts-1440x900'], [`${PR}/tasks/po-voice`, 'VIS-006-page-cancelled-parent-1440x900'],
  [`${PR}/tasks/po-cn-team-view`, 'VIS-007a-page-part-of-todo-parent-1440x900'], [`${PR}/tasks/po-hardening-a`, 'VIS-007b-page-part-of-done-parent-1440x900'],
  [`${PR}/tasks/po-voice-play`, 'VIS-007c-page-part-of-cancelled-parent-1440x900'], [`${PR}/tasks/po-themes`, 'VIS-006b-page-parent-only-cancelled-parts-1440x900']]) { await go(p, path); await shot(p, name); } await p.context().close(); }
{ const p = await page(); await tab(p); await shot(p, 'VIS-008-tab-board-1440x900');
  await p.click(`${card('po-cross-node')} [data-testid="project-task-row-link"]`); await p.waitForTimeout(1500); await p.mouse.move(5, 890); await shot(p, 'VIS-009-tab-parent-1440x900');
  await p.click('[data-testid="task-part-row-po-cn-team-view"]'); await p.waitForTimeout(1500); await p.mouse.move(5, 890); await shot(p, 'VIS-010-tab-part-1440x900'); await p.context().close(); }
{ const p = await page();
  await go(p, `${PR}/tasks/tk-agent-loop/edit`); await shot(p, 'VIS-011a-editor-part-of-empty-1440x900-full', { fullPage: true });
  await p.locator('[data-testid="task-part-of-input"]').fill('node'); await p.waitForTimeout(300); await shot(p, 'VIS-011b-editor-part-of-search-parts-blocked-1440x900-full', { fullPage: true });
  await p.locator('[data-testid="task-part-of-input"]').fill('zzzz'); await p.waitForTimeout(300); await shot(p, 'VIS-011d-editor-part-of-no-match-1440x900-full', { fullPage: true });
  await go(p, `${PR}/tasks/po-cn-team-view/edit`); await shot(p, 'VIS-011c-editor-part-of-chosen-1440x900-full', { fullPage: true });
  await go(p, `${PR}/tasks/po-cross-node/edit`); await shot(p, 'VIS-011e-editor-task-with-parts-1440x900-full', { fullPage: true });
  await go(p, `${PR}/tasks/po-cross-node`); await p.click('[data-testid="task-parts-new"]'); await p.waitForTimeout(3000); await p.mouse.move(5, 890); await shot(p, 'VIS-012-new-part-parent-chosen-1440x900-full', { fullPage: true });
  await go(p, `${PR}/tasks/po-cross-node`); await p.click('[data-testid="task-page-delete"]'); await p.waitForTimeout(400); await p.mouse.move(5, 890); await shot(p, 'VIS-013-delete-parent-confirmation-1440x900'); await p.context().close(); }
{ const p = await page(1440, 900, 2); await go(p, '/projects/project-onboarding-redesign', 5000);
  await shot(p, 'VIS-014a-long-keys-board-2x', { clip: { x: 340, y: 250, width: 1080, height: 280 } });
  await go(p, '/projects/project-onboarding-redesign/tasks/po-ob-program'); await shot(p, 'VIS-014b-long-keys-parent-page-2x', { clip: { x: 340, y: 60, width: 1010, height: 520 } });
  await go(p, '/projects/project-onboarding-redesign/tasks/po-ob-emails'); await shot(p, 'VIS-014c-long-keys-part-page-2x', { clip: { x: 340, y: 60, width: 1010, height: 340 } }); await p.context().close(); }
{ const p = await page(760, 900); await go(p, PR, 6000); await shot(p, 'VIS-015-board-narrow-760x900'); await p.context().close(); }
{ const p = await page(1440, 900, 1, 'zh-CN');
  await go(p, `${PR}/tasks/po-cross-node`); await shot(p, 'VIS-016a-zh-CN-page-parent-1440x900');
  await go(p, `${PR}/tasks/po-cn-team-view`); await shot(p, 'VIS-016b-zh-CN-page-part-1440x900');
  await go(p, `${PR}/tasks/tk-agent-loop/edit`); await p.locator('[data-testid="task-part-of-input"]').fill('node'); await p.waitForTimeout(300); await shot(p, 'VIS-016c-zh-CN-editor-search-1440x900-full', { fullPage: true });
  await go(p, PR, 6000); await shot(p, 'VIS-016d-zh-CN-board-1440x900'); await p.context().close(); }
{ const p = await page(); await go(p, PR, 6000); await p.getByRole('button', { name: /Cancelled/ }).first().click(); await p.waitForTimeout(800); await p.mouse.move(5, 890); await shot(p, 'VIS-017-board-cancelled-lane-shown-1440x900'); await p.context().close(); }
await browser.close(); console.log('done');
