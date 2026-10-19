// search-model-settings: browser validation of Settings -> Server Settings -> Embedding (SRCH-001 .. SRCH-020).
// BASE=http://127.0.0.1:4691 node final-validation.mjs
// Time is driven by Playwright's clock, so every run is deterministic; state is in memory and resets on reload.
import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design/node_modules/playwright-core/index.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:4691';
const URL = `${BASE}/settings?section=server-settings&mode=embedding`;
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
let pass = 0, fail = 0;
const ok = (id, cond, note = '') => { if (cond) pass++; else fail++; console.log(`${cond ? 'PASS' : 'FAIL'} ${id} ${note}`); };
const open = async (scenario = '', locale = '', w = 1440, h = 1100) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(([s, l]) => { if (s) localStorage.setItem('autobyteus.prototype.scenario', s); if (l) localStorage.setItem('autobyteus.localization.preference-mode', l); }, [scenario, locale]);
  const p = await ctx.newPage(); p.errors = []; p.on('pageerror', (e) => p.errors.push(e.message));
  await p.clock.install({ time: 1000 }); await p.clock.pauseAt(2000); await p.goto(URL); await p.waitForTimeout(1500); await p.clock.runFor(800); await p.waitForTimeout(250); return p; };
const tick = async (p, ms) => { await p.clock.runFor(ms); await p.waitForTimeout(250); };
const t = (p, id) => p.locator(`[data-testid="${id}"]`);
const text = async (p, id) => ((await t(p, id).first().innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
const has = async (p, id) => (await t(p, id).count()) > 0;
const state = (p, id) => t(p, id).getAttribute('data-state');
const G = 'search-model-granite-small-english-r2', L = 'search-model-leaf-ir', M = 'search-model-embeddinggemma-2';

{ // SRCH-001 placement and entry
  const p = await open();
  const top = (await p.locator('[data-testid="settings-page-navigation"] > div > nav > ul > li > button span.text-left').allInnerTexts()).map((x) => x.trim());
  ok('SRCH-001a', !top.includes('Search') && top.join('|') === 'API Keys|Token Statistics|Display|Language|Local Tools|MCP Servers|Application Packages|Agent Packages|Server Settings|Extensions|Updates', `top-level nav unchanged: ${top.join(' | ')}`);
  const sub = (await p.locator('[data-testid^="settings-nav-server-settings-"]').allInnerTexts()).map((x) => x.trim());
  ok('SRCH-001b', sub.join('|') === 'Basics|Embedding|Advanced|Migrations', `Server Settings sub-sections: ${sub.join(' | ')}`);
  ok('SRCH-001c', (await t(p, 'settings-nav-server-settings-embedding').getAttribute('class')).includes('bg-gray-100') && await has(p, 'search-models-card') && await has(p, 'search-projects-card') && (await text(p, 'settings-search-panel')).includes('Embedding model'));
  await t(p, 'settings-nav-server-settings-advanced').click(); await tick(p, 800);
  ok('SRCH-001d', !(await has(p, 'settings-search-panel')));
  await t(p, 'settings-nav-server-settings-embedding').click(); await tick(p, 800);
  ok('SRCH-001e', await has(p, 'settings-search-panel') && p.errors.length === 0, `Embedding sub-section opens ${p.errors.join(';')}`);
  await p.context().close();
}
{ // SRCH-002 models and facts; SRCH-003 opening starts nothing
  const p = await open();
  ok('SRCH-002a', (await p.locator('[data-testid^="search-model-"][data-state]').count()) === 3);
  ok('SRCH-002b', (await state(p, G)) === 'active-ready' && await has(p, 'search-pill-active') && await has(p, 'search-pill-ready'));
  const f = await text(p, `${M}-facts`);
  ok('SRCH-002c', ['100+ languages', '346 MB', '~4 s per Task', 'Up to 1.5 GB RAM', 'Apache-2.0'].every((x) => f.includes(x)), f);
  ok('SRCH-002d', (await text(p, `${L}-facts`)).includes('Fastest') && (await text(p, `${G}-facts`)).includes('~0.5 s per Task'));
  ok('SRCH-002e', (await state(p, L)) === 'downloaded' && (await state(p, M)) === 'not_downloaded');
  ok('SRCH-002f', (await text(p, 'search-disk-total')) === 'On disk: 78 MB');
  ok('SRCH-002g', !(await has(p, `${G}-remove`)) && !(await has(p, `${G}-use`)), 'the Active model has no Remove and no Use');
  ok('SRCH-002h', (await has(p, `${L}-use`)) && (await has(p, `${L}-remove`)) && (await has(p, `${M}-download`)) && (await has(p, `${M}-use`)));
  const before = await text(p, 'search-project-list');
  await tick(p, 1); // nothing but the seeded work (Onboarding Redesign) moves
  ok('SRCH-003a', (await state(p, 'search-project-marketing-site')) === 'not_indexed' && (await state(p, 'search-project-prototype-launch')) === 'needs_update' && (await state(p, M)) === 'not_downloaded');
  await tick(p, 4000);
  ok('SRCH-003b', (await state(p, 'search-project-marketing-site')) === 'not_indexed' && (await state(p, 'search-project-release-notes')) === 'not_indexed' && (await state(p, M)) === 'not_downloaded', 'opening and waiting start no download and no indexing');
  ok('SRCH-003c', before.includes('Indexing 12 of 24') && (await text(p, 'search-project-onboarding-redesign-status')).includes('Indexing') , 'only the seeded run is working');
  await p.context().close();
}
{ // SRCH-004 download ahead, cancel; SRCH-005 complete, remove
  const p = await open();
  await t(p, `${M}-download`).click(); await tick(p, 4000);
  ok('SRCH-004a', (await state(p, M)) === 'downloading' && await has(p, `${M}-progress`) && !(await has(p, `${M}-use`)) && await has(p, `${M}-cancel`));
  const prog1 = await text(p, `${M}-progress`);
  await tick(p, 3000); const prog2 = await text(p, `${M}-progress`);
  ok('SRCH-004b', prog1 !== prog2 && /of 346 MB/.test(prog2) && /%/.test(prog2), `${prog1} -> ${prog2}`);
  ok('SRCH-004c', (await t(p, `${M}-progress`).locator('[role="progressbar"]').getAttribute('aria-valuemax')) === '346');
  await t(p, `${M}-cancel`).click(); await tick(p, 100);
  ok('SRCH-004d', (await state(p, M)) === 'not_downloaded' && (await text(p, `${M}-notice`)) === 'Download cancelled. No files were kept.' && (await text(p, 'search-disk-total')) === 'On disk: 78 MB');
  await t(p, `${M}-download`).click(); await tick(p, 25000);
  ok('SRCH-005a', (await state(p, M)) === 'downloaded' && (await text(p, `${M}-notice`)).includes('Downloaded and verified') && (await text(p, 'search-pill-downloaded')) !== undefined);
  ok('SRCH-005b', (await text(p, 'search-disk-total')) === 'On disk: 424 MB' && (await has(p, `${M}-remove`)));
  await t(p, `${M}-remove`).click(); await tick(p, 50);
  ok('SRCH-005c', await has(p, `${M}-remove-confirmation`) && (await text(p, `${M}-remove-confirmation`)).includes('This frees 346 MB'));
  await t(p, `${M}-remove-cancel`).click(); await tick(p, 50);
  ok('SRCH-005d', (await state(p, M)) === 'downloaded' && !(await has(p, `${M}-remove-confirmation`)));
  await t(p, `${M}-remove`).click(); await t(p, `${M}-remove-confirm`).click(); await tick(p, 50);
  ok('SRCH-005e', (await state(p, M)) === 'not_downloaded' && (await text(p, `${M}-notice`)) === 'Removed. 346 MB freed.' && (await text(p, 'search-disk-total')) === 'On disk: 78 MB');
  ok('SRCH-005f', p.errors.length === 0, p.errors.join(';'));
  await p.context().close();
}
{ // SRCH-006 switch with confirmation (not downloaded model)
  const p = await open();
  await t(p, `${M}-use`).click(); await tick(p, 100);
  const d = await text(p, 'search-switch-dialog');
  ok('SRCH-006a', d.includes('Use Google EmbeddingGemma 2?') && d.includes('Every Project has to be indexed again with this model.') && d.includes('meaning search finds exact matches only') && d.includes('Index all Projects') && d.includes('switching back later means indexing again'), d);
  ok('SRCH-006b', (await text(p, 'search-switch-cost-download')) === '346 MB, not downloaded yet' && (await text(p, 'search-switch-cost-indexing')) === '~4 s per Task' && (await text(p, 'search-switch-cost-memory')) === 'Up to 1.5 GB RAM');
  ok('SRCH-006c', await p.evaluate(() => document.activeElement?.getAttribute('data-testid')) === 'search-switch-cancel', 'focus starts on Cancel');
  await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
  ok('SRCH-006d', await p.evaluate(() => document.activeElement?.getAttribute('data-testid')) === 'search-switch-cancel', 'Tab stays inside the dialog');
  await p.keyboard.press('Escape'); await tick(p, 50);
  ok('SRCH-006e', !(await has(p, 'search-switch-dialog')) && (await state(p, G)) === 'active-ready' && (await state(p, M)) === 'not_downloaded', 'Esc cancels and changes nothing');
  await t(p, `${M}-use`).click(); await t(p, 'search-switch-cancel').click(); await tick(p, 50);
  ok('SRCH-006f', (await state(p, G)) === 'active-ready', 'Cancel changes nothing');
  await t(p, `${M}-use`).click(); await t(p, 'search-switch-confirm').click(); await tick(p, 2000);
  ok('SRCH-006g', (await state(p, M)) === 'active-preparing' && (await state(p, G)) === 'downloaded' && (await text(p, `${M}-preparing`)).includes('Downloading the model'));
  ok('SRCH-006h', (await text(p, 'search-projects-subtitle')) === 'Index state for Google EmbeddingGemma 2' && (await state(p, 'search-project-desktop-app')) === 'not_indexed');
  ok('SRCH-006i', await p.evaluate(() => document.activeElement?.getAttribute('data-testid')) === M, 'focus lands on the new Active row');
  await tick(p, 30000);
  ok('SRCH-006j', (await state(p, M)) === 'active-ready' && await has(p, `${G}-remove`) && !(await has(p, `${M}-remove`)));
  await p.context().close();
}
{ // SRCH-007 switch to a downloaded model; SRCH-008 index now / rebuild / index all
  const p = await open();
  await t(p, `${L}-use`).click(); await tick(p, 50);
  ok('SRCH-007a', (await text(p, 'search-switch-cost-download')) === 'Already downloaded' && !(await has(p, 'search-switch-cost-memory')));
  await t(p, 'search-switch-confirm').click(); await tick(p, 5000);
  ok('SRCH-007b', (await state(p, L)) === 'active-ready' && (await state(p, G)) === 'downloaded', 'a downloaded model prepares without a download');
  ok('SRCH-008a', (await state(p, 'search-project-desktop-app')) === 'not_indexed' && (await state(p, 'search-project-onboarding-redesign')) === 'not_indexed');
  await t(p, 'search-index-all').click(); await tick(p, 100);
  ok('SRCH-008b', (await state(p, 'search-project-desktop-app')) !== 'not_indexed' && !(await t(p, 'search-index-all').isEnabled()), 'Index all starts every Project and disables itself');
  await tick(p, 100000);
  const ready = await p.locator('[data-testid^="search-project-"][data-state="ready"]').count();
  ok('SRCH-008c', ready === 7 && (await text(p, 'search-project-desktop-app-status')) === 'Ready · 170 Tasks', `ready=${ready}`);
  await t(p, 'search-project-agent-runtime-rebuild').click(); await tick(p, 50);
  ok('SRCH-008d', (await text(p, 'search-project-agent-runtime-rebuild-confirmation')).includes('Rebuild “Agent Runtime” from scratch?'));
  await t(p, 'search-project-agent-runtime-rebuild-cancel').click(); await tick(p, 50);
  ok('SRCH-008e', (await state(p, 'search-project-agent-runtime')) === 'ready');
  await t(p, 'search-project-agent-runtime-rebuild').click(); await t(p, 'search-project-agent-runtime-rebuild-confirm').click(); await tick(p, 100);
  ok('SRCH-008f', ['waiting', 'indexing'].includes(await state(p, 'search-project-agent-runtime')));
  await tick(p, 20000);
  ok('SRCH-008g', (await state(p, 'search-project-agent-runtime')) === 'ready');
  await p.context().close();
}
{ // SRCH-009 per-Project Index now (Not indexed, Needs update) and leave-and-return
  const p = await open();
  ok('SRCH-009a', (await text(p, 'search-project-prototype-launch-status')) === 'Needs update · 3 changed' && await has(p, 'search-project-prototype-launch-index') && await has(p, 'search-project-prototype-launch-rebuild'));
  ok('SRCH-009b', (await has(p, 'search-project-marketing-site-index')) && !(await has(p, 'search-project-marketing-site-rebuild')) && !(await has(p, 'search-project-onboarding-redesign-index')) && !(await has(p, 'search-project-onboarding-redesign-rebuild')));
  await t(p, 'search-project-prototype-launch-index').click(); await tick(p, 100);
  const s1 = await text(p, 'search-project-prototype-launch-status');
  ok('SRCH-009c', /Waiting|Indexing 0 of 3|Indexing \d of 3/.test(s1), s1);
  await p.click('[data-testid="settings-nav-language"]'); await tick(p, 20000);
  await p.click('[data-testid="settings-nav-server-settings"]'); await tick(p, 500); await p.click('[data-testid="settings-nav-server-settings-embedding"]'); await tick(p, 800);
  ok('SRCH-009d', (await state(p, 'search-project-prototype-launch')) === 'ready' && (await text(p, 'search-project-prototype-launch-status')) === 'Ready · 58 Tasks', 'work continued while the page was left');
  await p.context().close();
}
{ // SRCH-010 offline failure and retry
  const p = await open('search_offline');
  await t(p, `${M}-download`).click(); await tick(p, 8000);
  ok('SRCH-010a', await has(p, `${M}-failed`) && (await text(p, `${M}-failed`)).includes('Download failed: Couldn’t reach the model host') && (await text(p, `${M}-failed`)).includes('No partial files were kept.') && (await state(p, M)) === 'not_downloaded');
  ok('SRCH-010b', await has(p, `${M}-retry`) && !(await has(p, `${M}-download`)) && await has(p, `${M}-use`));
  await t(p, `${M}-retry`).click(); await tick(p, 25000);
  ok('SRCH-010c', (await state(p, M)) === 'downloaded' && !(await has(p, `${M}-failed`)));
  await p.context().close();
}
{ // SRCH-011 active model unavailable, Retry at model level
  const p = await open('search_unavailable');
  ok('SRCH-011a', (await state(p, G)) === 'active-unavailable' && (await text(p, `${G}-unavailable`)).includes('Unavailable: The model files failed verification.') && (await text(p, `${G}-unavailable`)).includes('Exact-match search still works.'));
  ok('SRCH-011b', (await state(p, 'search-project-desktop-app')) === 'unavailable' && !(await has(p, 'search-project-desktop-app-rebuild')) && !(await has(p, 'search-project-marketing-site-index')) && !(await t(p, 'search-index-all').isEnabled()) && (await text(p, 'search-projects-unavailable-note')).includes('Retry the model above'));
  await t(p, `${G}-retry`).click(); await tick(p, 1000);
  ok('SRCH-011c', (await state(p, G)) === 'active-preparing');
  await tick(p, 4000);
  ok('SRCH-011d', (await state(p, G)) === 'active-ready' && (await state(p, 'search-project-desktop-app')) === 'ready');
  await p.context().close();
}
{ // SRCH-012 many Projects
  const p = await open('search_many_projects');
  ok('SRCH-012a', (await p.locator('[data-testid^="search-project-"][data-state]').count()) === 24 && await has(p, 'search-project-find'));
  await t(p, 'search-filter-needs').click(); await tick(p, 50);
  const needs = await p.locator('[data-testid^="search-project-"][data-state]').evaluateAll((els) => els.map((e) => e.getAttribute('data-state')));
  ok('SRCH-012b', needs.length === 8 && needs.every((s) => s === 'not_indexed' || s === 'needs_update'), `needs=${needs.length}`);
  await t(p, 'search-filter-all').click(); await t(p, 'search-project-find').fill('node'); await tick(p, 50);
  ok('SRCH-012c', (await p.locator('[data-testid^="search-project-"][data-state]').count()) === 1);
  await t(p, 'search-project-find').fill('zzzz'); await tick(p, 50);
  ok('SRCH-012d', await has(p, 'search-projects-no-match'));
  await p.context().close();
}
{ // SRCH-013 empty, loading, load error
  const p = await open('search_empty');
  ok('SRCH-013a', (await text(p, 'search-projects-empty')).includes('No Projects yet.') && !(await t(p, 'search-index-all').isEnabled()));
  await p.context().close();
  const q = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const pg = await q.newPage();
  await pg.clock.install({ time: 1000 }); await pg.clock.pauseAt(2000); await pg.goto(URL); await pg.waitForTimeout(1500);
  for (let i = 0; i < 30 && !(await has(pg, 'settings-search-panel')); i++) { await pg.clock.runFor(50); await pg.waitForTimeout(80); }
  ok('SRCH-013b', await has(pg, 'search-loading') && !(await has(pg, 'search-models-card')), 'loading skeleton before the status arrives');
  await q.close();
  const r = await open('search_load_failed');
  ok('SRCH-013c', await has(r, 'search-load-error'));
  await t(r, 'search-load-retry').click(); await tick(r, 1000);
  ok('SRCH-013d', await has(r, 'search-models-card') && !(await has(r, 'search-load-error')));
  await r.context().close();
}
{ // SRCH-014 zh-CN
  const p = await open('', 'zh-CN');
  const c = await text(p, 'settings-search-panel');
  ok('SRCH-014a', c.includes('嵌入让语义搜索') && c.includes('嵌入模型') && c.includes('项目索引') && c.includes('为所有项目建立索引') && c.includes('就绪 · 170 个任务'));
  await t(p, `${M}-use`).click(); await tick(p, 50);
  const d = await text(p, 'search-switch-dialog');
  ok('SRCH-014b', d.includes('使用 Google EmbeddingGemma 2？') && d.includes('所有项目都需要用此模型重新建立索引。') && d.includes('346 MB，尚未下载') && d.includes('约 4 秒/任务'));
  const latin = (c.match(/[A-Za-z]{4,}/g) || []).filter((w) => !/^(IBM|Granite|Embedding|Small|English|MongoDB|LEAF|Google|EmbeddingGemma|Apache|Desktop|Onboarding|Redesign|Marketing|Site|Prototype|Launch|Agent|Runtime|Billing|Cleanup|Release|Notes|Task|Tasks)$/i.test(w));
  ok('SRCH-014c', latin.length === 0, `untranslated: ${latin.join(',')}`);
  await p.context().close();
}
{ // SRCH-015 narrow layout, no horizontal overflow
  const p = await open('', '', 390, 900);
  const over = await p.evaluate(() => { const c = document.querySelector('[data-testid="settings-page-content"]'); return c.scrollWidth - c.clientWidth; });
  ok('SRCH-015a', over <= 0, `overflow ${over}`);
  await t(p, `${M}-download`).click(); await tick(p, 3000);
  const over2 = await p.evaluate(() => { const c = document.querySelector('[data-testid="settings-page-content"]'); return c.scrollWidth - c.clientWidth; });
  ok('SRCH-015b', over2 <= 0, `overflow while downloading ${over2}`);
  await p.context().close();
}
{ // SRCH-016 preserved Settings sections still open
  const p = await open();
  for (const [id, needle] of [['settings-nav-extensions', 'Optional capabilities'], ['settings-nav-updates', 'Current Version'], ['settings-nav-server-settings', 'Basics'], ['settings-nav-server-settings-advanced', 'All Settings'], ['settings-nav-server-settings-migrations', 'Migrations']]) {
    if (id.includes('advanced') || id.includes('migrations')) await t(p, 'settings-nav-server-settings').click().catch(() => {});
    await t(p, id).click(); await tick(p, 500);
    ok(`SRCH-016-${id}`, (await text(p, 'settings-page-layout')).includes(needle));
  }
  await p.context().close();
}
console.log(`\n${pass} passed, ${fail} failed`);
await browser.close();
process.exit(fail ? 1 : 0);
