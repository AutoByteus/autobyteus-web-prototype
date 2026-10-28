// BASE=http://127.0.0.1:4940 OUT=./ node capture-waiting-references.mjs   (page clock paused and driven by the script; scenario embedding_busy seeds the starting state only)
import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design/node_modules/playwright-core/index.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:4940', OUT = process.env.OUT || './';
const URL = `${BASE}/settings?section=server-settings&mode=embedding`;
const browser = await chromium.launch();
const open = async (w, h, { scenario = '', locale = '' } = {}) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(([s, l]) => { if (s) localStorage.setItem('autobyteus.prototype.scenario', s); if (l) localStorage.setItem('autobyteus.localization.preference-mode', l); }, [scenario, locale]);
  const p = await ctx.newPage(); p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await p.clock.install({ time: 1000 }); await p.clock.pauseAt(2000); await p.goto(URL); await p.waitForTimeout(1800);
  await p.clock.runFor(800); await p.waitForTimeout(300);
  return p;
};
const tick = async (p, ms) => { await p.clock.runFor(ms); await p.waitForTimeout(350); };
const t = (p, id) => p.locator(`[data-testid="${id}"]`);
const txt = async (p) => (await t(p, 'embedding-project-list').innerText()).replace(/\n+/g, ' | ');
const shot = async (p, name) => { await p.mouse.move(5, p.viewportSize().height - 5); await p.evaluate(() => document.activeElement?.blur?.()); await p.waitForTimeout(250); await p.screenshot({ path: `${OUT}${name}.png` }); await p.context().close(); };
const D = [1440, 1180]; const G = 'embedding-model-mdbr-leaf-ir';
{ const p = await open(...D); await t(p, 'embedding-model-embeddinggemma-2-use').click(); await t(p, 'embedding-switch-confirm').click(); await tick(p, 5000); await t(p, 'embedding-index-all').click(); await tick(p, 1000); console.log('007', await txt(p), '|', (await t(p,'embedding-models-card').innerText()).replace(/\n+/g,' | ')); await shot(p, 'VIS-007-switch-preparing-index-all-waiting-1440x1180'); }
{ const p = await open(...D, { scenario: 'embedding_busy' }); console.log('010a', await txt(p)); await t(p, 'embedding-project-project-prototype-launch-index').click(); await tick(p, 8000); console.log('010', await txt(p)); await shot(p, 'VIS-010-needs-update-indexing-1440x1180'); }
{ const p = await open(...D, { scenario: 'embedding_busy', locale: 'zh-CN' }); console.log('022', await txt(p)); await shot(p, 'VIS-022-zh-CN-waiting-1440x1180'); }
await browser.close(); console.log('done');
