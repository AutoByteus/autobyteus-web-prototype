// task-part-of: validation of the approved "part of" design against the running UI reference.
// WEB-BASELINE-REFRESH-011 copy: Playwright import and browser only. Expectations are unchanged. OUT must be outside tickets/.
// BASE=http://127.0.0.1:4671 node final-validation.mjs   (CHROME=<executable> to use a system Chromium)
import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-011/node_modules/playwright-core/index.mjs';
const B = process.env.BASE || 'http://127.0.0.1:4671';
const browser = await chromium.launch({ executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
let pass = 0, fail = 0;
const check = (id, ok, detail = '') => { ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'} ${id}${ok ? '' : ' :: ' + detail}`); };
const open = async (path, { w = 1440, h = 900, locale } = {}) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  if (locale) await ctx.addInitScript((l) => localStorage.setItem('autobyteus.localization.preference-mode', l), locale);
  const p = await ctx.newPage(); p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await p.goto(B + path); await p.waitForTimeout(path.startsWith('/chat') ? 6000 : 4000); return p;
};
const text = async (p, sel) => ((await p.locator(sel).first().innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
const count = (p, sel) => p.locator(sel).count();
const card = (id) => `[data-testid="project-task-row-${id}"]`;
const PROJECT = '/projects/project-desktop-app';

// PART-001 board cards: parent progress, part marker, no key line, flat lanes.
{
  const p = await open(PROJECT);
  check('PART-001a parent card "2 of 4 done"', (await text(p, `${card('po-cross-node')} [data-testid="task-parts-progress"]`)) === '2 of 4 done');
  check('PART-001b all-done parent "3 of 3 done"', (await text(p, `${card('po-history')} [data-testid="task-parts-progress"]`)) === '3 of 3 done');
  check('PART-001c no-part-done parent "0 of 2 done"', (await text(p, `${card('po-sources')} [data-testid="task-parts-progress"]`)) === '0 of 2 done');
  check('PART-001d part card "Part of autobyteus-25"', (await text(p, `${card('po-cn-route')} [data-testid="task-part-of-marker"]`)) === 'Part of autobyteus-25');
  check('PART-001e part card carries Blocked badge and marker together', (await count(p, `${card('po-cn-team-view')} [data-testid="task-dependency-badge-blocked"]`)) === 1 && (await count(p, `${card('po-cn-team-view')} [data-testid="task-part-of-marker"]`)) === 1);
  check('PART-001f a Task with neither shows no relation line', (await count(p, `${card('tk-agent-loop')} [data-testid="task-part-of-marker"], ${card('tk-agent-loop')} [data-testid="task-parts-progress"]`)) === 0);
  check('PART-001g parts stay in their own status lanes (flat board)', (await count(p, `[data-testid="project-task-row-po-cn-envelope"]`)) === 1 && (await p.evaluate(() => { const row = document.querySelector('[data-testid="project-task-row-po-cn-envelope"]'); const col = row?.closest('section, [data-testid*="lane"], div[class*="rounded-xl"]'); return (col?.innerText || '').includes('Done'); })));
  check('PART-001h only-cancelled-parts parent shows no progress', (await count(p, `${card('po-themes')} [data-testid="task-parts-progress"]`)) === 0);
  const tooltip = await p.locator(`${card('po-cross-node')} [data-testid="task-parts-progress"]`).getAttribute('title');
  check('PART-001i progress tooltip names cancelled parts', tooltip === '2 of 4 done · 1 cancelled', tooltip);
  const marker = await p.locator(`${card('po-cn-route')} [data-testid="task-part-of-marker"]`).getAttribute('title');
  check('PART-001j marker tooltip: key, summary, status', marker === 'Part of autobyteus-25: Cross-node collaboration: agents on different nodes work on one Project (To Do)', marker);
  await p.context().close();
}
// PART-002 parent's Task page.
{
  const p = await open(`${PROJECT}/tasks/po-cross-node`);
  check('PART-002a five rows, key order', (await count(p, '[data-testid="task-parts"] [data-testid^="task-part-row-"]')) === 5);
  check('PART-002b progress and cancelled count', (await text(p, '[data-testid="task-parts-summary"]')) === '2 of 4 done · 1 cancelled');
  check('PART-002c close hint while open parts', (await count(p, '[data-testid="task-parts-close-hint"]')) === 1);
  check('PART-002d New part link', (await p.locator('[data-testid="task-parts-new"]').getAttribute('href')) === `${PROJECT}/tasks/new?partOf=po-cross-node`);
  check('PART-002e no Part of card on a parent', (await count(p, '[data-testid="task-part-of"]')) === 0);
  check('PART-002f Dependencies card unchanged', (await text(p, '[data-testid="task-dependencies"]')) === 'Dependencies Depends on None Required by None');
  await p.locator('[data-testid="task-part-row-po-cn-folder"]').click(); await p.waitForTimeout(2500);
  check('PART-002g a row opens that Task (cancelled part)', p.url().endsWith('/tasks/po-cn-folder') || p.url().endsWith('/tasks/autobyteus-23'), p.url());
  await p.context().close();
}
// PART-003 no parts, all-done parent, closed parents, only-cancelled parts.
{
  let p = await open(`${PROJECT}/tasks/tk-agent-loop`);
  check('PART-003a empty state', (await text(p, '[data-testid="task-parts"]')) === 'Parts No parts yet. New part');
  await p.context().close();
  p = await open(`${PROJECT}/tasks/po-history`);
  check('PART-003b all parts done, parent still In Progress', (await text(p, '[data-testid="task-parts-progress-text"]')) === '3 of 3 done' && (await text(p, '[data-testid="task-page-status"]')) === 'In Progress');
  await p.context().close();
  p = await open(`${PROJECT}/tasks/po-voice`);
  check('PART-003c Cancelled parent: 1 of 1 done · 1 cancelled, no close hint', (await text(p, '[data-testid="task-parts-summary"]')) === '1 of 1 done · 1 cancelled' && (await count(p, '[data-testid="task-parts-close-hint"]')) === 0);
  await p.context().close();
  p = await open(`${PROJECT}/tasks/po-themes`);
  check('PART-003d only cancelled parts: "1 cancelled" alone', (await text(p, '[data-testid="task-parts-summary"]')) === '1 cancelled');
  await p.context().close();
}
// PART-004 part's Task page: parent with status; opens the parent.
{
  for (const [id, parentKey, status] of [['po-cn-route', 'autobyteus-25', 'To Do'], ['po-hardening-a', 'autobyteus-6', 'Done'], ['po-voice-play', 'autobyteus-3', 'Cancelled']]) {
    const p = await open(`${PROJECT}/tasks/${id}`);
    const row = await text(p, '[data-testid="task-part-of"] [data-testid^="task-part-row-"]');
    check(`PART-004 ${id}: Part of ${parentKey} (${status})`, row.startsWith(parentKey) && row.includes(status), row);
    check(`PART-004 ${id}: no Parts card, no New part`, (await count(p, '[data-testid="task-parts"]')) === 0 && (await count(p, '[data-testid="task-parts-new"]')) === 0);
    if (id === 'po-cn-route') { await p.locator('[data-testid^="task-part-row-"]').first().click(); await p.waitForTimeout(2500); check('PART-004 row opens the parent', p.url().includes('po-cross-node') || p.url().includes('autobyteus-25'), p.url()); }
    await p.context().close();
  }
}
// PART-005 right-panel tab: board cards, parent view, part view, rows open inside the tab, read only.
{
  const p = await open('/chat?id=run-ptm-0001');
  await p.getByText('Projects', { exact: true }).last().click(); await p.waitForTimeout(2000);
  check('PART-005a tab card progress', (await text(p, `${card('po-cross-node')} [data-testid="task-parts-progress"]`)) === '2 of 4 done');
  await p.locator(`${card('po-cross-node')} [data-testid="project-task-row-link"]`).click(); await p.waitForTimeout(1500);
  check('PART-005b tab parent view', (await text(p, '[data-testid="task-parts-summary"]')) === '2 of 4 done · 1 cancelled' && (await count(p, '[data-testid="task-parts-new"]')) === 0);
  await p.locator('[data-testid="task-part-row-po-cn-team-view"]').click(); await p.waitForTimeout(1500);
  check('PART-005c a row opens the part inside the tab', (await text(p, '[data-testid="projects-panel-task-status"]')) === 'To Do' && (await count(p, '[data-testid="task-part-of"]')) === 1 && p.url().includes('/chat'));
  await p.locator('[data-testid="task-part-of"] [data-testid^="task-part-row-"]').click(); await p.waitForTimeout(1500);
  check('PART-005d the parent row opens the parent inside the tab', (await count(p, '[data-testid="task-parts"]')) === 1);
  await p.context().close();
}
// PART-006 editor: choose / change / clear; blocked options; a Task with parts; New part prefill.
{
  let p = await open(`${PROJECT}/tasks/tk-agent-loop/edit`);
  check('PART-006a empty field, label and placeholder', (await text(p, '[data-testid="task-part-of-picker"] label')) === 'Part of (optional)' && (await p.locator('[data-testid="task-part-of-input"]').getAttribute('placeholder')) === 'Choose a Task · Search by key or text');
  await p.locator('[data-testid="task-part-of-input"]').click(); await p.keyboard.type('autobyteus-2'); await p.waitForTimeout(300);
  const blocked = await p.locator('[data-testid="task-part-of-option-po-cn-route"]').getAttribute('aria-disabled');
  check('PART-006b a Task that is a part is listed but cannot be chosen', blocked === 'true' && (await text(p, '[data-testid="task-part-of-option-po-cn-route"]')).includes('Already part of a Task'));
  check('PART-006c the Task itself is not offered', (await count(p, '[data-testid="task-part-of-option-tk-agent-loop"]')) === 0);
  await p.locator('[data-testid="task-part-of-option-po-cn-route"]').click({ force: true }); await p.waitForTimeout(200);
  check('PART-006d clicking a blocked option changes nothing', (await count(p, '[data-testid="task-part-of-selected"]')) === 0);
  await p.locator('[data-testid="task-part-of-input"]').fill('cross-node'); await p.waitForTimeout(300);
  check('PART-006e search by text finds the parent', (await count(p, '[data-testid="task-part-of-option-po-cross-node"]')) === 1);
  await p.keyboard.press('ArrowDown'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  check('PART-006f chosen row; list closes; placeholder changes', (await text(p, '[data-testid="task-part-of-selected"]')).startsWith('autobyteus-25') && (await count(p, '[data-testid="task-part-of-options"]')) === 0 && (await p.locator('[data-testid="task-part-of-input"]').getAttribute('placeholder')).startsWith('Choose another Task'));
  await p.locator('[data-testid="task-page-save"]').click(); await p.waitForTimeout(2500);
  check('PART-006g saved: the Task page shows Part of autobyteus-25', (await text(p, '[data-testid="task-part-of"] [data-testid^="task-part-row-"]')).startsWith('autobyteus-25'));
  await p.locator('[data-testid="task-part-row-po-cross-node"]').click(); await p.waitForTimeout(2500);
  check('PART-006h the parent now lists it: "2 of 5 done · 1 cancelled"', (await text(p, '[data-testid="task-parts-summary"]')) === '2 of 5 done · 1 cancelled', await text(p, '[data-testid="task-parts-summary"]'));
  await p.goto(B + `${PROJECT}/tasks/tk-agent-loop/edit`); await p.waitForTimeout(3000);
  // The in-memory example data resets on reload; re-check clear and change on a Task that starts with a parent.
  await p.context().close();
  p = await open(`${PROJECT}/tasks/po-cn-team-view/edit`);
  check('PART-006i Edit starts with the current parent', (await text(p, '[data-testid="task-part-of-selected"]')).startsWith('autobyteus-25'));
  await p.locator('[data-testid="task-part-of-input"]').fill('Run history'); await p.keyboard.press('ArrowDown'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  check('PART-006j choosing replaces the parent', (await text(p, '[data-testid="task-part-of-selected"]')).startsWith('autobyteus-14'));
  await p.locator('[data-testid="task-part-of-remove"]').click(); await p.waitForTimeout(200);
  check('PART-006k remove clears; focus goes to the search', (await count(p, '[data-testid="task-part-of-selected"]')) === 0 && (await p.evaluate(() => document.activeElement?.getAttribute('data-testid'))) === 'task-part-of-input');
  await p.locator('[data-testid="task-page-save"]').click(); await p.waitForTimeout(2500);
  check('PART-006l saved without a parent: the page shows the Parts card', (await count(p, '[data-testid="task-part-of"]')) === 0 && (await count(p, '[data-testid="task-parts"]')) === 1);
  await p.context().close();
  p = await open(`${PROJECT}/tasks/po-cross-node/edit`);
  check('PART-006m a Task with parts cannot get a parent', (await count(p, '[data-testid="task-part-of-input"]')) === 0 && (await text(p, '[data-testid="task-part-of-has-parts"]')) === "This Task has parts, so it can't be part of another Task.");
  check('PART-006n the Depends on field is unchanged and present', (await count(p, '[data-testid="task-dependency-input"]')) === 1);
  await p.context().close();
  p = await open(`${PROJECT}/tasks/po-cross-node`);
  await p.locator('[data-testid="task-parts-new"]').click(); await p.waitForTimeout(3000);
  check('PART-006o New part opens New task with the parent chosen', p.url().includes('/tasks/new') && (await text(p, '[data-testid="task-part-of-selected"]')).startsWith('autobyteus-25'));
  await p.locator('textarea').first().fill('Add a node picker to the Team view'); await p.locator('[data-testid="task-page-save"]').click(); await p.waitForTimeout(2500);
  check('PART-006p new part on the board: marker; parent progress "2 of 5 done"', (await count(p, '[data-testid="task-part-of-marker"]')) >= 6 && (await text(p, `${card('po-cross-node')} [data-testid="task-parts-progress"]`)) === '2 of 5 done');
  await p.context().close();
}
// PART-007 delete a parent: the confirmation mentions the parts; parts stay without a parent.
{
  const p = await open(`${PROJECT}/tasks/po-cross-node`);
  await p.locator('[data-testid="task-page-delete"]').click(); await p.waitForTimeout(300);
  check('PART-007a confirmation mentions the parts', (await text(p, '[data-testid="task-page-delete-parts-note"]')) === 'Its 5 parts stay as separate Tasks.');
  await p.locator('[data-testid="task-page-delete-confirm"]').click(); await p.waitForTimeout(3000);
  check('PART-007b the parts stay on the board without the marker', (await count(p, card('po-cn-route'))) === 1 && (await count(p, `${card('po-cn-route')} [data-testid="task-part-of-marker"]`)) === 0);
  await p.context().close();
  const q = await open(`${PROJECT}/tasks/po-hardening-c`);
  await q.locator('[data-testid="task-page-delete"]').click(); await q.waitForTimeout(300);
  check('PART-007c a part\'s confirmation has no parts note', (await count(q, '[data-testid="task-page-delete-parts-note"]')) === 0);
  await q.context().close();
}
// PART-008 long keys and long summaries; narrow board.
{
  let p = await open('/projects/project-onboarding-redesign/tasks/po-ob-emails');
  const row = await text(p, '[data-testid="task-part-of"] [data-testid^="task-part-row-"]');
  check('PART-008a long key and long summary in the Part of row', row.includes('customer-onboarding') && row.includes('-11'), row);
  check('PART-008b no horizontal overflow on the page', await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  await p.context().close();
  p = await open(PROJECT, { w: 760, h: 900 });
  check('PART-008c narrow board: the chips fit inside the cards', await p.evaluate(() => [...document.querySelectorAll('[data-testid="project-task-row-relations"]')].every((el) => el.scrollWidth <= el.parentElement.clientWidth + 1)));
  await p.context().close();
}
// PART-009 zh-CN strings.
{
  let p = await open(`${PROJECT}/tasks/po-cross-node`, { locale: 'zh-CN' });
  check('PART-009a zh-CN parent card', (await text(p, '[data-testid="task-parts-summary"]')) === '4 个中已完成 2 个 · 1 个已取消' && (await text(p, '[data-testid="task-parts"] h2')) === '子任务' && (await text(p, '[data-testid="task-parts-new"]')) === '新建子任务');
  await p.context().close();
  p = await open(`${PROJECT}/tasks/po-cn-route`, { locale: 'zh-CN' });
  check('PART-009b zh-CN part card', (await text(p, '[data-testid="task-part-of"] h2')) === '所属任务');
  await p.context().close();
}
await browser.close();
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
