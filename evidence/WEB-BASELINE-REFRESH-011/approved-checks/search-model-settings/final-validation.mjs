// embedding-model-settings: browser validation of Settings -> Server Settings -> Embedding (SRCH-001 .. SRCH-020).
// WEB-BASELINE-REFRESH-011 copy (harness: each SRCH block that stops on a missing element is recorded as one FAIL and the run continues; 4 s locator timeout): Playwright import, browser, data-testids (search-* -> the shipped embedding-*; Project ids carry the source projectId prefix) and scenario keys (search_* -> embedding_*, search_empty -> empty, search_many_projects -> embedding_many). Expectations are unchanged.
// BASE=http://127.0.0.1:4691 node final-validation.mjs
// Time is driven by Playwright's clock, so every run is deterministic; state is in memory and resets on reload.
import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-011/node_modules/playwright-core/index.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:4691';
const URL = `${BASE}/settings?section=server-settings&mode=embedding`;
const browser = await chromium.launch({ executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
let pass = 0, fail = 0;
const ok = (id, cond, note = '') => { if (cond) pass++; else fail++; console.log(`${cond ? 'PASS' : 'FAIL'} ${id} ${note}`); };
const open = async (scenario = '', locale = '', w = 1440, h = 1100) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(([s, l]) => { if (s) localStorage.setItem('autobyteus.prototype.scenario', s); if (l) localStorage.setItem('autobyteus.localization.preference-mode', l); }, [scenario, locale]);
  const p = await ctx.newPage(); p.setDefaultTimeout(4000); p.errors = []; p.on('pageerror', (e) => p.errors.push(e.message));
  await p.clock.install({ time: 1000 }); await p.clock.pauseAt(2000); await p.goto(URL); await p.waitForTimeout(1500); await p.clock.runFor(800); await p.waitForTimeout(250); return p; };
const tick = async (p, ms) => { await p.clock.runFor(ms); await p.waitForTimeout(250); };
const t = (p, id) => p.locator(`[data-testid="${id}"]`);
const text = async (p, id) => ((await t(p, id).first().innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
const has = async (p, id) => (await t(p, id).count()) > 0;
// REFRESH-011 harness: the shipped rows write `data-state` in upper case (READY, NOT_INDEXED); compare case-insensitively.
const state = async (p, id) => (await t(p, id).getAttribute('data-state'))?.toLowerCase();
const G = 'embedding-model-granite-embedding-small-english-r2', L = 'embedding-model-mdbr-leaf-ir', M = 'embedding-model-embeddinggemma-2';

try { // SRCH-001 placement and entry
  const p = await open();
  const top = (await p.locator('[data-testid="settings-page-navigation"] > div > nav > ul > li > button span.text-left').allInnerTexts()).map((x) => x.trim());
  ok('SRCH-001a', !top.includes('Search') && top.join('|') === 'API Keys|Token Statistics|Display|Language|Local Tools|MCP Servers|Application Packages|Agent Packages|Server Settings|Extensions|Updates', `top-level nav unchanged: ${top.join(' | ')}`);
  const sub = (await p.locator('[data-testid^="settings-nav-server-settings-"]').allInnerTexts()).map((x) => x.trim());
  ok('SRCH-001b', sub.join('|') === 'Basics|Embedding|Advanced|Migrations', `Server Settings sub-sections: ${sub.join(' | ')}`);
  ok('SRCH-001c', (await t(p, 'settings-nav-server-settings-embedding').getAttribute('class')).includes('bg-gray-100') && await has(p, 'embedding-models-card') && await has(p, 'embedding-projects-card') && (await text(p, 'settings-embedding-panel')).includes('Embedding model'));
  await t(p, 'settings-nav-server-settings-advanced').click(); await tick(p, 800);
  ok('SRCH-001d', !(await has(p, 'settings-embedding-panel')));
  await t(p, 'settings-nav-server-settings-embedding').click(); await tick(p, 800);
  ok('SRCH-001e', await has(p, 'settings-embedding-panel') && p.errors.length === 0, `Embedding sub-section opens ${p.errors.join(';')}`);
  await p.context().close();
} catch (e) { ok(`SRCH-001-aborted`, false, `block stopped: ${e.message.split('\n')[0]}`); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { // SRCH-002 models and facts; SRCH-003 opening starts nothing
  const p = await open();
  ok('SRCH-002a', (await p.locator('[data-testid^="embedding-model-"][data-state]').count()) === 3);
  ok('SRCH-002b', (await state(p, G)) === 'active-ready' && await has(p, 'embedding-pill-active') && await has(p, 'embedding-pill-ready'));
  const f = await text(p, `${M}-facts`);
  ok('SRCH-002c', f.includes('100+ languages') && f.includes('346 MB') && !/Apache|per Task|RAM|Fastest|Memory/.test(f), f);
  ok('SRCH-002d', (await text(p, `${L}-facts`)).includes('English') && (await text(p, `${L}-facts`)).includes('24 MB') && (await text(p, `${G}-facts`)).includes('55 MB') && !/Apache|per Task|RAM|Fastest|Memory/.test(await text(p, 'embedding-models-card')), 'only language and size are shown');
  ok('SRCH-002i', (await t(p, 'embedding-source-link').getAttribute('href')) === 'https://huggingface.co' && (await text(p, 'embedding-models-footnote')) === 'Used for meaning search. Downloaded from Hugging Face.' && !(await text(p, `${M}-facts`)).includes('Hugging') && !(await text(p, `${G}-facts`)).includes('Hugging'), 'the source is said once, in the card footnote, not on every row');
  ok('SRCH-002e', (await state(p, L)) === 'downloaded' && (await state(p, M)) === 'not_downloaded');
  ok('SRCH-002f', (await text(p, 'embedding-disk-total')) === 'On disk: 79 MB');
  ok('SRCH-002g', !(await has(p, `${G}-remove`)) && !(await has(p, `${G}-use`)), 'the Active model has no Remove and no Use');
  ok('SRCH-002h', (await has(p, `${L}-use`)) && (await has(p, `${L}-remove`)) && (await has(p, `${M}-download`)) && (await has(p, `${M}-use`)));
  const before = await text(p, 'embedding-project-list');
  await tick(p, 1); // nothing but the seeded work (Onboarding Redesign) moves
  ok('SRCH-003a', (await state(p, 'embedding-project-project-marketing-site')) === 'not_indexed' && (await state(p, 'embedding-project-project-prototype-launch')) === 'needs_update' && (await state(p, M)) === 'not_downloaded');
  await tick(p, 4000);
  ok('SRCH-003b', (await state(p, 'embedding-project-project-marketing-site')) === 'not_indexed' && (await state(p, 'embedding-project-project-release-notes')) === 'not_indexed' && (await state(p, M)) === 'not_downloaded', 'opening and waiting start no download and no indexing');
  ok('SRCH-003c', before.includes('Indexing 12 of 24') && (await text(p, 'embedding-project-project-onboarding-redesign-status')).includes('Indexing') , 'only the seeded run is working');
  await p.context().close();
} catch (e) { ok(`SRCH-002-aborted`, false, `block stopped: ${e.message.split('\n')[0]}`); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { // SRCH-004 download ahead, cancel; SRCH-005 complete, remove
  const p = await open();
  await t(p, `${M}-download`).click(); await tick(p, 4000);
  ok('SRCH-004a', (await state(p, M)) === 'downloading' && await has(p, `${M}-progress`) && !(await has(p, `${M}-use`)) && await has(p, `${M}-cancel`));
  const prog1 = await text(p, `${M}-progress`);
  await tick(p, 3000); const prog2 = await text(p, `${M}-progress`);
  ok('SRCH-004b', prog1 !== prog2 && /of 346 MB/.test(prog2) && /%/.test(prog2), `${prog1} -> ${prog2}`);
  ok('SRCH-004c', (await t(p, `${M}-progress`).locator('[role="progressbar"]').getAttribute('aria-valuemax')) === '346');
  await t(p, `${M}-cancel`).click(); await tick(p, 100);
  ok('SRCH-004d', (await state(p, M)) === 'not_downloaded' && (await text(p, 'embedding-disk-total')) === 'On disk: 79 MB');
  await t(p, `${M}-download`).click(); await tick(p, 25000);
  ok('SRCH-005a', (await state(p, M)) === 'downloaded');
  ok('SRCH-005b', (await text(p, 'embedding-disk-total')) === 'On disk: 425 MB' && (await has(p, `${M}-remove`)));
  await t(p, `${M}-remove`).click(); await tick(p, 50);
  ok('SRCH-005c', await has(p, `${M}-remove-confirmation`) && (await text(p, `${M}-remove-confirmation`)).includes('This frees 346 MB'));
  await t(p, `${M}-remove-cancel`).click(); await tick(p, 50);
  ok('SRCH-005d', (await state(p, M)) === 'downloaded' && !(await has(p, `${M}-remove-confirmation`)));
  await t(p, `${M}-remove`).click(); await t(p, `${M}-remove-confirm`).click(); await tick(p, 50);
  ok('SRCH-005e', (await state(p, M)) === 'not_downloaded' && (await text(p, 'embedding-disk-total')) === 'On disk: 79 MB');
  ok('SRCH-005f', p.errors.length === 0, p.errors.join(';'));
  await p.context().close();
} catch (e) { ok(`SRCH-004-aborted`, false, `block stopped: ${e.message.split('\n')[0]}`); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { // SRCH-006 switch with confirmation (not downloaded model)
  const p = await open();
  await t(p, `${M}-use`).click(); await tick(p, 100);
  const d = await text(p, 'embedding-switch-dialog');
  ok('SRCH-006a', d.includes('Use Google EmbeddingGemma 2?') && d.includes('Every Project has to be indexed again with this model.') && d.includes('meaning search finds exact matches only'), d);
  ok('SRCH-006b', (await text(p, 'embedding-switch-cost-download')) === '346 MB, not downloaded yet' && !(await has(p, 'embedding-switch-cost-indexing')) && !(await has(p, 'embedding-switch-cost-memory')), 'the dialog states the download size only');
  ok('SRCH-006c', await p.evaluate(() => document.activeElement?.getAttribute('data-testid')) === 'embedding-switch-cancel', 'focus starts on Cancel');
  await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
  ok('SRCH-006d', await p.evaluate(() => document.activeElement?.getAttribute('data-testid')) === 'embedding-switch-cancel', 'Tab stays inside the dialog');
  await p.keyboard.press('Escape'); await tick(p, 50);
  ok('SRCH-006e', !(await has(p, 'embedding-switch-dialog')) && (await state(p, G)) === 'active-ready' && (await state(p, M)) === 'not_downloaded', 'Esc cancels and changes nothing');
  await t(p, `${M}-use`).click(); await t(p, 'embedding-switch-cancel').click(); await tick(p, 50);
  ok('SRCH-006f', (await state(p, G)) === 'active-ready', 'Cancel changes nothing');
  await t(p, `${M}-use`).click(); await t(p, 'embedding-switch-confirm').click(); await tick(p, 2000);
  ok('SRCH-006g', (await state(p, M)) === 'active-preparing' && (await state(p, G)) === 'downloaded' && (await text(p, `${M}-preparing`)).includes('Downloading the model'));
  ok('SRCH-006h', (await text(p, 'embedding-projects-subtitle')) === 'Using Google EmbeddingGemma 2.' && (await state(p, 'embedding-project-project-desktop-app')) === 'not_indexed');
  ok('SRCH-006i', await p.evaluate(() => document.activeElement?.getAttribute('data-testid')) === M, 'focus lands on the new Active row');
  await tick(p, 30000);
  ok('SRCH-006j', (await state(p, M)) === 'active-ready' && await has(p, `${G}-remove`) && !(await has(p, `${M}-remove`)));
  await p.context().close();
} catch (e) { ok(`SRCH-006-aborted`, false, `block stopped: ${e.message.split('\n')[0]}`); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { // SRCH-007 switch to a downloaded model; SRCH-008 index now / rebuild / index all
  const p = await open();
  await t(p, `${L}-use`).click(); await tick(p, 50);
  ok('SRCH-007a', (await text(p, 'embedding-switch-cost-download')) === 'Already downloaded');
  await t(p, 'embedding-switch-confirm').click(); await tick(p, 5000);
  ok('SRCH-007b', (await state(p, L)) === 'active-ready' && (await state(p, G)) === 'downloaded', 'a downloaded model prepares without a download');
  ok('SRCH-008a', (await state(p, 'embedding-project-project-desktop-app')) === 'not_indexed' && (await state(p, 'embedding-project-project-onboarding-redesign')) === 'not_indexed');
  await t(p, 'embedding-index-all').click(); await tick(p, 100);
  ok('SRCH-008b', (await state(p, 'embedding-project-project-desktop-app')) !== 'not_indexed' && !(await t(p, 'embedding-index-all').isEnabled()), 'Index all starts every Project and disables itself');
  await tick(p, 100000);
  const ready = await p.locator('[data-testid^="embedding-project-project-"][data-state="ready" i]').count();
  ok('SRCH-008c', ready === 7 && (await text(p, 'embedding-project-project-desktop-app-status')) === 'Ready · 170 Tasks', `ready=${ready}`);
  await t(p, 'embedding-project-project-agent-runtime-rebuild').click(); await tick(p, 50);
  ok('SRCH-008d', (await text(p, 'embedding-project-project-agent-runtime-rebuild-confirmation')).includes('Rebuild “Agent Runtime” from scratch?'));
  await t(p, 'embedding-project-project-agent-runtime-rebuild-cancel').click(); await tick(p, 50);
  ok('SRCH-008e', (await state(p, 'embedding-project-project-agent-runtime')) === 'ready');
  await t(p, 'embedding-project-project-agent-runtime-rebuild').click(); await t(p, 'embedding-project-project-agent-runtime-rebuild-confirm').click(); await tick(p, 100);
  ok('SRCH-008f', ['waiting', 'indexing'].includes(await state(p, 'embedding-project-project-agent-runtime')));
  await tick(p, 20000);
  ok('SRCH-008g', (await state(p, 'embedding-project-project-agent-runtime')) === 'ready');
  await p.context().close();
} catch (e) { ok(`SRCH-007-aborted`, false, `block stopped: ${e.message.split('\n')[0]}`); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { // SRCH-009 per-Project Index now (Not indexed, Needs update) and leave-and-return
  const p = await open();
  ok('SRCH-009a', (await text(p, 'embedding-project-project-prototype-launch-status')) === 'Needs update · 3 changed' && await has(p, 'embedding-project-project-prototype-launch-index') && await has(p, 'embedding-project-project-prototype-launch-rebuild'));
  ok('SRCH-009b', (await has(p, 'embedding-project-project-marketing-site-index')) && !(await has(p, 'embedding-project-project-marketing-site-rebuild')) && !(await has(p, 'embedding-project-project-onboarding-redesign-index')) && !(await has(p, 'embedding-project-project-onboarding-redesign-rebuild')));
  await t(p, 'embedding-project-project-prototype-launch-index').click(); await tick(p, 100);
  const s1 = await text(p, 'embedding-project-project-prototype-launch-status');
  ok('SRCH-009c', /Waiting|Indexing 0 of 3|Indexing \d of 3/.test(s1), s1);
  await p.click('[data-testid="settings-nav-language"]'); await tick(p, 20000);
  await p.click('[data-testid="settings-nav-server-settings"]'); await tick(p, 500); await p.click('[data-testid="settings-nav-server-settings-embedding"]'); await tick(p, 800);
  ok('SRCH-009d', (await state(p, 'embedding-project-project-prototype-launch')) === 'ready' && (await text(p, 'embedding-project-project-prototype-launch-status')) === 'Ready · 58 Tasks', 'work continued while the page was left');
  await p.context().close();
} catch (e) { ok(`SRCH-009-aborted`, false, `block stopped: ${e.message.split('\n')[0]}`); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { // SRCH-010 offline failure and retry
  const p = await open('embedding_offline');
  await t(p, `${M}-download`).click(); await tick(p, 8000);
  ok('SRCH-010a', await has(p, `${M}-failed`) && (await text(p, `${M}-failed`)).includes('Download failed: Couldn’t reach huggingface.co') && (await state(p, M)) === 'not_downloaded');
  ok('SRCH-010b', await has(p, `${M}-retry`) && !(await has(p, `${M}-download`)) && await has(p, `${M}-use`));
  await t(p, `${M}-retry`).click(); await tick(p, 25000);
  ok('SRCH-010c', (await state(p, M)) === 'downloaded' && !(await has(p, `${M}-failed`)));
  await p.context().close();
} catch (e) { ok(`SRCH-010-aborted`, false, `block stopped: ${e.message.split('\n')[0]}`); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { // SRCH-011 active model unavailable, Retry at model level
  const p = await open('embedding_unavailable');
  ok('SRCH-011a', (await state(p, G)) === 'active-unavailable' && (await text(p, `${G}-unavailable`)).includes('Unavailable: The model files failed verification.'));
  ok('SRCH-011b', (await state(p, 'embedding-project-project-desktop-app')) === 'unavailable' && !(await has(p, 'embedding-project-project-desktop-app-rebuild')) && !(await has(p, 'embedding-project-project-marketing-site-index')) && !(await t(p, 'embedding-index-all').isEnabled()));
  await t(p, `${G}-retry`).click(); await tick(p, 1000);
  ok('SRCH-011c', (await state(p, G)) === 'active-preparing');
  await tick(p, 4000);
  ok('SRCH-011d', (await state(p, G)) === 'active-ready' && (await state(p, 'embedding-project-project-desktop-app')) === 'ready');
  await p.context().close();
} catch (e) { ok(`SRCH-011-aborted`, false, `block stopped: ${e.message.split('\n')[0]}`); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { // SRCH-012 many Projects
  const p = await open('embedding_many');
  ok('SRCH-012a', (await p.locator('[data-testid^="embedding-project-project-"][data-state]').count()) === 24 && await has(p, 'embedding-project-find'));
  await t(p, 'embedding-filter-needs').click(); await tick(p, 50);
  const needs = await p.locator('[data-testid^="embedding-project-project-"][data-state]').evaluateAll((els) => els.map((e) => e.getAttribute('data-state')?.toLowerCase()));
  ok('SRCH-012b', needs.length === 8 && needs.every((s) => s === 'not_indexed' || s === 'needs_update'), `needs=${needs.length}`);
  await t(p, 'embedding-filter-all').click(); await t(p, 'embedding-project-find').fill('node'); await tick(p, 50);
  ok('SRCH-012c', (await p.locator('[data-testid^="embedding-project-project-"][data-state]').count()) === 1);
  await t(p, 'embedding-project-find').fill('zzzz'); await tick(p, 50);
  ok('SRCH-012d', await has(p, 'embedding-projects-no-match'));
  await p.context().close();
} catch (e) { ok(`SRCH-012-aborted`, false, `block stopped: ${e.message.split('\n')[0]}`); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { // SRCH-013 empty, loading, load error
  const p = await open('empty');
  ok('SRCH-013a', (await text(p, 'embedding-projects-empty')).includes('No Projects yet.') && !(await t(p, 'embedding-index-all').isEnabled()));
  await p.context().close();
  const q = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const pg = await q.newPage(); pg.setDefaultTimeout(4000);
  await pg.clock.install({ time: 1000 }); await pg.clock.pauseAt(2000); await pg.goto(URL); await pg.waitForTimeout(1500);
  for (let i = 0; i < 30 && !(await has(pg, 'settings-embedding-panel')); i++) { await pg.clock.runFor(50); await pg.waitForTimeout(80); }
  ok('SRCH-013b', await has(pg, 'embedding-loading') && !(await has(pg, 'embedding-models-card')), 'loading skeleton before the status arrives');
  await q.close();
  const r = await open('embedding_load_failed');
  ok('SRCH-013c', await has(r, 'embedding-load-error'));
  await t(r, 'embedding-load-retry').click(); await tick(r, 1000);
  ok('SRCH-013d', await has(r, 'embedding-models-card') && !(await has(r, 'embedding-load-error')));
  await r.context().close();
} catch (e) { ok(`SRCH-013-aborted`, false, `block stopped: ${e.message.split('\n')[0]}`); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { // SRCH-014 zh-CN
  const p = await open('', 'zh-CN');
  const c = await text(p, 'settings-embedding-panel');
  ok('SRCH-014a', c.includes('嵌入模型') && c.includes('项目索引') && c.includes('为所有项目建立索引') && c.includes('就绪 · 170 个任务'));
  await t(p, `${M}-use`).click(); await tick(p, 50);
  const d = await text(p, 'embedding-switch-dialog');
  ok('SRCH-014b', d.includes('使用 Google EmbeddingGemma 2？') && d.includes('所有项目都需要用此模型重新建立索引。') && d.includes('346 MB，尚未下载'));
  const latin = (c.match(/[A-Za-z]{4,}/g) || []).filter((w) => !/^(IBM|Granite|Embedding|Small|English|MongoDB|LEAF|Google|EmbeddingGemma|Apache|Desktop|Onboarding|Redesign|Marketing|Site|Prototype|Launch|Agent|Runtime|Billing|Cleanup|Release|Notes|Task|Tasks|Hugging|Face)$/i.test(w));
  ok('SRCH-014c', latin.length === 0, `untranslated: ${latin.join(',')}`);
  await p.context().close();
} catch (e) { ok(`SRCH-014-aborted`, false, `block stopped: ${e.message.split('\n')[0]}`); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { // SRCH-015 narrow layout, no horizontal overflow
  const p = await open('', '', 390, 900);
  const over = await p.evaluate(() => { const c = document.querySelector('[data-testid="settings-page-content"]'); return c.scrollWidth - c.clientWidth; });
  ok('SRCH-015a', over <= 0, `overflow ${over}`);
  await t(p, `${M}-download`).click(); await tick(p, 3000);
  const over2 = await p.evaluate(() => { const c = document.querySelector('[data-testid="settings-page-content"]'); return c.scrollWidth - c.clientWidth; });
  ok('SRCH-015b', over2 <= 0, `overflow while downloading ${over2}`);
  await p.context().close();
} catch (e) { ok(`SRCH-015-aborted`, false, `block stopped: ${e.message.split('\n')[0]}`); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { // SRCH-017 a switch to a model whose download fails; Retry at model level; Index all while the model prepares
  const p = await open('embedding_offline');
  await t(p, `${M}-use`).click(); await t(p, 'embedding-switch-confirm').click(); await tick(p, 8000);
  ok('SRCH-017a', (await state(p, M)) === 'active-unavailable' && (await text(p, `${M}-unavailable`)).includes('Couldn’t reach huggingface.co') && (await state(p, 'embedding-project-project-desktop-app')) === 'unavailable');
  await t(p, `${M}-retry`).click(); await tick(p, 2000);
  ok('SRCH-017b', (await state(p, M)) === 'active-preparing');
  await t(p, 'embedding-index-all').click(); await tick(p, 100);
  ok('SRCH-017c', (await text(p, 'embedding-project-project-marketing-site-status')) === 'Waiting for the model…', 'Index all while the model prepares waits for it');
  await tick(p, 40000);
  ok('SRCH-017d', (await state(p, M)) === 'active-ready' && ['indexing', 'ready'].includes(await state(p, 'embedding-project-project-desktop-app')), 'indexing starts once the model is ready');
  await tick(p, 120000);
  ok('SRCH-017e', (await p.locator('[data-testid^="embedding-project-project-"][data-state="ready" i]').count()) === 7);
  await p.context().close();
} catch (e) { ok(`SRCH-017-aborted`, false, `block stopped: ${e.message.split('\n')[0]}`); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { // SRCH-018 keyboard focus follows the inline confirmations; completions are announced
  const p = await open();
  await t(p, `${L}-remove`).focus(); await p.keyboard.press('Enter'); await tick(p, 100);
  ok('SRCH-018a', await p.evaluate(() => document.activeElement?.getAttribute('data-testid')) === `${L}-remove-cancel`.replace('embedding-model-mdbr-leaf-ir', 'embedding-model-mdbr-leaf-ir'), 'focus moves to Cancel in the Remove confirmation');
  await p.keyboard.press('Escape'); await tick(p, 100);
  ok('SRCH-018b', await p.evaluate(() => document.activeElement?.getAttribute('data-testid')) === `${L}-remove` && !(await has(p, `${L}-remove-confirmation`)), 'Esc closes it and focus returns to Remove');
  await t(p, 'embedding-project-project-desktop-app-rebuild').click(); await tick(p, 100);
  ok('SRCH-018c', await p.evaluate(() => document.activeElement?.getAttribute('data-testid')) === 'embedding-project-project-desktop-app-rebuild-cancel');
  await t(p, 'embedding-project-project-desktop-app-rebuild-confirm').click(); await tick(p, 100);
  ok('SRCH-018d', await p.evaluate(() => document.activeElement?.getAttribute('data-testid')) === 'embedding-project-project-desktop-app', 'after confirming, focus lands on the Project row');
  await tick(p, 30000);
  ok('SRCH-018e', (await text(p, 'embedding-announce')).endsWith('indexed.'), await text(p, 'embedding-announce'));
  await t(p, `${M}-download`).click(); await tick(p, 30000);
  ok('SRCH-018f', (await text(p, 'embedding-announce')) === 'Google EmbeddingGemma 2 downloaded.');
  await p.context().close();
} catch (e) { ok(`SRCH-018-aborted`, false, `block stopped: ${e.message.split('\n')[0]}`); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { // SRCH-019 sizes follow the catalog's file bytes (decimal MB): 55 + 24 + 346 = 425
  const p = await open();
  const sz = async (m) => (await text(p, `${m}-facts`)).match(/(\d+) MB/)?.[1];
  ok('SRCH-019', (await sz(G)) === '55' && (await sz(L)) === '24' && (await sz(M)) === '346', 'sizes follow the catalog file bytes');
  await p.context().close();
} catch (e) { ok(`SRCH-019-aborted`, false, `block stopped: ${e.message.split('\n')[0]}`); for (const c of browser.contexts()) await c.close().catch(() => {}) }
try { // SRCH-016 preserved Settings sections still open
  const p = await open();
  for (const [id, needle] of [['settings-nav-extensions', 'Optional capabilities'], ['settings-nav-updates', 'Current Version'], ['settings-nav-server-settings', 'Basics'], ['settings-nav-server-settings-advanced', 'All Settings'], ['settings-nav-server-settings-migrations', 'Migrations']]) {
    if (id.includes('advanced') || id.includes('migrations')) await t(p, 'settings-nav-server-settings').click().catch(() => {});
    await t(p, id).click(); await tick(p, 500);
    ok(`SRCH-016-${id}`, (await text(p, 'settings-page-layout')).includes(needle));
  }
  await p.context().close();
} catch (e) { ok(`SRCH-016-aborted`, false, `block stopped: ${e.message.split('\n')[0]}`); for (const c of browser.contexts()) await c.close().catch(() => {}) }
console.log(`\n${pass} passed, ${fail} failed`);
await browser.close();
process.exit(fail ? 1 : 0);
