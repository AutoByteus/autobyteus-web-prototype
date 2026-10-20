// runtime-lifecycle-review: final browser validation of Settings -> Agent Runtimes (RTM-001..RTM-020).
// BASE=http://127.0.0.1:4701 node final-validation.mjs
// Time is driven by Playwright's clock (the page's timers are paused and advanced by the script), so every run is deterministic.
import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design/node_modules/playwright-core/index.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:4701';
const URL = `${BASE}/settings?section=agent-runtimes`;
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
let pass = 0, fail = 0, group = '';
const check = (name, ok, extra = '') => { if (ok) pass += 1; else { fail += 1; console.log(`FAIL ${group} ${name} ${extra}`); } };
const open = async ({ scenario = '', context = '', locale = '', w = 1440, h = 900, run = 2400, url = URL } = {}) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(([s, c, l]) => { if (s) localStorage.setItem('autobyteus.prototype.scenario', s); if (c) localStorage.setItem('autobyteus.prototype.context', c); if (l) localStorage.setItem('autobyteus.localization.preference-mode', l); }, [scenario, context, locale]);
  const p = await ctx.newPage(); p.on('pageerror', (e) => { fail += 1; console.log('PAGEERR', e.message); });
  await p.clock.install({ time: 1000 }); await p.clock.pauseAt(2000); await p.goto(url); await p.waitForTimeout(1500);
  if (run) { await p.clock.runFor(run); await p.waitForTimeout(250); }
  return p;
};
const tick = async (p, ms) => { await p.clock.runFor(ms); await p.waitForTimeout(250); };
const t = (p, id) => p.locator(`[data-testid="${id}"]`);
const text = async (p, id) => (await t(p, id).first().innerText()).replace(/\s+/g, ' ').trim();
const has = async (p, id) => (await t(p, id).count()) > 0;
const done = (p) => p.context().close();

group = 'RTM-001 entry and navigation';
{ const p = await open();
  const nav = await p.locator('[data-testid="settings-nav-ai-runtimes"]').innerText();
  check('menu item reads Agent Runtimes', nav.trim() === 'Agent Runtimes', nav);
  const order = await p.locator('[data-testid="settings-page-navigation"] li button').allInnerTexts();
  const labels = order.map((x) => x.trim()).filter(Boolean);
  check('item sits right after API Keys', labels[1] === 'API Keys' && labels[2] === 'Agent Runtimes', labels.slice(0, 4).join('|'));
  check('title', (await text(p, 'ai-runtimes-card')).startsWith('Agent Runtimes'));
  check('description uses "runtimes"', (await text(p, 'ai-runtimes-description')) === 'The agent runtimes AutoByteus uses on this node. They normally update themselves; use Update when one has not.');
  check('node line', /^Embedded Node\s*·\s*This computer$/.test(await text(p, 'ai-runtimes-node')));
  check('no "engine" wording anywhere', !/engine/i.test(await p.locator('[data-testid="ai-runtimes-card"]').innerText()));
  await p.locator('[data-testid="settings-nav-display"]').click(); await tick(p, 50);
  check('selecting another section hides the page', !(await has(p, 'ai-runtimes-card')));
  await t(p, 'settings-nav-ai-runtimes').click(); await tick(p, 50);
  check('selecting it again shows the page', await has(p, 'ai-runtimes-card'));
  await done(p); }

group = 'RTM-002 open: independent checks';
{ const p = await open({ run: 0 });
  await tick(p, 300); check('loading skeleton first', await has(p, 'ai-runtimes-loading'));
  await tick(p, 500); // load done at 700 ms; checks start
  check('rows appear; installed versions known at once', (await text(p, 'runtime-claude-installed')).includes('2.1.302'));
  check('Claude is checking', (await text(p, 'runtime-claude-status')) === 'Checking for updates…');
  check('Check again shows Checking… and is disabled', (await t(p, 'ai-runtimes-check-again').isDisabled()) && (await text(p, 'ai-runtimes-check-again')) === 'Checking…');
  await tick(p, 600); // Codex answers 650 ms after the checks start
  check('Codex resolved first (Up to date)', (await text(p, 'runtime-codex-status')) === 'Up to date');
  check('Claude and Antigravity still checking', (await text(p, 'runtime-claude-status')) === 'Checking for updates…' && (await text(p, 'runtime-antigravity-status')) === 'Checking for updates…');
  await tick(p, 1500);
  check('all resolved', (await text(p, 'runtime-claude-status')) === 'Update available (version 2.1.304)' && (await text(p, 'runtime-antigravity-status')) === 'Up to date');
  check('Checked just now shows', (await text(p, 'ai-runtimes-checked')) === 'Checked just now');
  await tick(p, 150000);
  check('Checked N min ago', /^Checked 2 min ago$/.test(await text(p, 'ai-runtimes-checked')), await text(p, 'ai-runtimes-checked'));
  await done(p); }

group = 'RTM-003 default rows';
{ const p = await open();
  const row = async (id) => ({ inst: await text(p, `runtime-${id}-installed`), upd: await text(p, `runtime-${id}-updates`), acc: await text(p, `runtime-${id}-account`) });
  const c = await row('codex'), cl = await row('claude'), a = await row('antigravity'), g = await row('grok');
  check('Codex', c.inst.endsWith('0.163.0') && c.upd.endsWith('Up to date') && c.acc.endsWith('Not signed in'), JSON.stringify(c));
  check('Claude', cl.inst.endsWith('2.1.302') && cl.upd.endsWith('Update available (version 2.1.304)') && cl.acc.endsWith('Signed in'), JSON.stringify(cl));
  check('Antigravity', a.inst.endsWith('1.4.3') && a.acc.endsWith('Not signed in'), JSON.stringify(a));
  check('Grok not installed', g.inst.endsWith('Not installed') && g.upd.includes('Install instructions') && g.acc.includes('Not applicable'), JSON.stringify(g));
  const link = t(p, 'runtime-grok-install-link');
  check('install link opens a new tab, noopener', (await link.getAttribute('target')) === '_blank' && (await link.getAttribute('rel')).includes('noopener') && (await link.getAttribute('href')).startsWith('https://'));
  check('no actions on a not-installed row', (await t(p, 'runtime-grok-actions').locator('button').count()) === 0);
  check('Update only on Claude', (await has(p, 'runtime-claude-update')) && !(await has(p, 'runtime-codex-update')) && !(await has(p, 'runtime-antigravity-update')));
  check('Sign in on Codex and Antigravity only', (await has(p, 'runtime-codex-signin-button')) && (await has(p, 'runtime-antigravity-signin-button')) && !(await has(p, 'runtime-claude-signin-button')));
  check('Not signed in with a button shows no command-line hint', !(await has(p, 'runtime-codex-signin-hint')));
  await done(p); }

group = 'RTM-004 update success';
{ const p = await open();
  await t(p, 'runtime-claude-update').click(); await tick(p, 100);
  check('button becomes Updating… (disabled)', (await text(p, 'runtime-claude-updating')) === 'Updating…' && await t(p, 'runtime-claude-updating').isDisabled());
  check('progress shows the vendor command', (await text(p, 'runtime-claude-progress')).startsWith('claude update · Checking for updates'));
  check('progress bar has a name', (await t(p, 'runtime-claude-outcome').locator('[role=progressbar]').getAttribute('aria-label')) === 'Claude: Updating…');
  check('other rows keep their buttons', await has(p, 'runtime-codex-signin-button'));
  await tick(p, 1200); check('step: Downloading', (await text(p, 'runtime-claude-progress')).includes('Downloading 2.1.304…'));
  await tick(p, 1100); check('step: Installing', (await text(p, 'runtime-claude-progress')).includes('Installing…'));
  await tick(p, 1100); check('step: Finishing up', (await text(p, 'runtime-claude-progress')).includes('Finishing up…'));
  await tick(p, 1100);
  check('result: Updated from 2.1.302 to 2.1.304.', (await text(p, 'runtime-claude-updated')) === 'Updated from 2.1.302 to 2.1.304.');
  check('version is now 2.1.304 and the page re-checks', (await text(p, 'runtime-claude-installed')).endsWith('2.1.304') && (await text(p, 'runtime-claude-status')) === 'Checking for updates…');
  await tick(p, 1100);
  check('after re-check: Up to date, no Update button', (await text(p, 'runtime-claude-status')) === 'Up to date' && !(await has(p, 'runtime-claude-update')));
  check('announcement', (await text(p, 'ai-runtimes-announce')).includes('Claude updated to 2.1.304.'));
  await t(p, 'ai-runtimes-check-again').click(); await tick(p, 2500);
  check('Check again clears the old result', !(await has(p, 'runtime-claude-updated')));
  await done(p); }

group = 'RTM-005 update failure';
{ const p = await open({ scenario: 'runtimes_update_fails' });
  await t(p, 'runtime-claude-update').click(); await tick(p, 3500);
  check('failure message', (await text(p, 'runtime-claude-update-failed')).startsWith('Update failed. Version 2.1.302 is unchanged.'));
  check('vendor error shown verbatim', (await text(p, 'runtime-claude-update-failed')).includes("claude update: EACCES: permission denied, rename '/usr/local/bin/claude'"));
  check('button is Try again; version unchanged', (await text(p, 'runtime-claude-update')) === 'Try again' && (await text(p, 'runtime-claude-installed')).endsWith('2.1.302'));
  await t(p, 'runtime-claude-update').click(); await tick(p, 100);
  check('Try again starts again', await has(p, 'runtime-claude-updating') && !(await has(p, 'runtime-claude-update-failed')));
  await done(p); }

group = 'RTM-006 agents running';
{ const p = await open({ scenario: 'runtimes_agents_running' });
  check('reason shown with count', (await text(p, 'runtime-claude-blocked')) === 'Update unavailable while 2 agents are running.');
  const b = t(p, 'runtime-claude-update');
  check('button is aria-disabled and described by the reason', (await b.getAttribute('aria-disabled')) === 'true' && (await b.getAttribute('aria-describedby')) === 'runtime-claude-blocked');
  await b.click({ force: true }); await tick(p, 100);
  check('clicking does nothing', !(await has(p, 'runtime-claude-updating')));
  await tick(p, 10000);
  check('one agent left: singular', (await text(p, 'runtime-claude-blocked')) === 'Update unavailable while 1 agent is running.');
  await tick(p, 12000);
  check('agents done: reason gone, Update enabled', !(await has(p, 'runtime-claude-blocked')) && (await t(p, 'runtime-claude-update').getAttribute('aria-disabled')) === null);
  await t(p, 'runtime-claude-update').click(); await tick(p, 100);
  check('Update now starts', await has(p, 'runtime-claude-updating'));
  await done(p); }

group = 'RTM-007 browser sign-in (Codex)';
{ const p = await open();
  await t(p, 'runtime-codex-signin-button').click(); await tick(p, 100);
  check('button Signing in… disabled', (await text(p, 'runtime-codex-signin-button')) === 'Signing in…' && await t(p, 'runtime-codex-signin-button').isDisabled());
  check('waiting line + Cancel', (await text(p, 'runtime-codex-signin-waiting')) === 'Finish signing in to Codex in your browser.' && await has(p, 'runtime-codex-signin-cancel'));
  await t(p, 'runtime-codex-signin-cancel').click(); await tick(p, 100);
  check('Cancel returns to Sign in', (await text(p, 'runtime-codex-signin-button')) === 'Sign in' && !(await has(p, 'runtime-codex-signin-waiting')));
  await t(p, 'runtime-codex-signin-button').click(); await tick(p, 5200);
  check('signs in: Signed in, button gone', (await text(p, 'runtime-codex-signin')) === 'Signed in' && !(await has(p, 'runtime-codex-signin-button')));
  check('announcement', (await text(p, 'ai-runtimes-announce')) === 'Codex is signed in.');
  await done(p); }

group = 'RTM-008 sign-in does not finish';
{ const p = await open({ scenario: 'runtimes_sign_in_fails' });
  await t(p, 'runtime-codex-signin-button').click(); await tick(p, 5200);
  check('failure message + Try again', (await text(p, 'runtime-codex-signin-failed')) === "Sign-in didn't finish. Try again." && (await text(p, 'runtime-codex-signin-button')) === 'Try again');
  check('still Not signed in', (await text(p, 'runtime-codex-account')).includes('Not signed in'));
  await t(p, 'runtime-codex-signin-button').click(); await tick(p, 100);
  check('Try again restarts', await has(p, 'runtime-codex-signin-waiting'));
  await done(p); }

group = 'RTM-009 Antigravity terminal sign-in';
{ const p = await open();
  await t(p, 'runtime-antigravity-signin-button').click(); await tick(p, 200);
  check('terminal opens with focus', (await p.evaluate(() => document.activeElement?.getAttribute('data-testid'))) === 'runtime-antigravity-signin-terminal');
  const term = await text(p, 'runtime-antigravity-signin-terminal');
  check('terminal runs agy and waits for Enter', term.includes('$ agy') && term.includes('Press Enter to sign in.'));
  const steps = await text(p, 'runtime-antigravity-signin-steps');
  check('two steps; first current', steps.includes('Press Enter in the terminal') && steps.includes('Finish signing in to Antigravity in your browser') && (await t(p, 'runtime-antigravity-signin-steps').locator('[aria-current=step]').innerText()).includes('Press Enter'));
  check('terminal has an accessible name', (await t(p, 'runtime-antigravity-signin-terminal').getAttribute('aria-label')) === 'Antigravity sign-in terminal');
  await p.keyboard.press('Enter'); await tick(p, 200);
  check('Enter: browser opening, step 2 current', (await text(p, 'runtime-antigravity-signin-terminal')).includes('Opening your browser…') && (await t(p, 'runtime-antigravity-signin-steps').locator('[aria-current=step]').innerText()).includes('Finish signing in'));
  await tick(p, 4000);
  check('detected: Signed in in the terminal and the row', (await text(p, 'runtime-antigravity-signin-terminal')).includes('Signed in.') && (await text(p, 'runtime-antigravity-signin')) === 'Signed in');
  await tick(p, 1500);
  check('terminal closes by itself', !(await has(p, 'runtime-antigravity-signin-terminal')));
  await done(p); }
{ const p = await open();
  await t(p, 'runtime-antigravity-signin-button').click(); await tick(p, 200);
  await t(p, 'runtime-antigravity-signin-cancel').click(); await tick(p, 100);
  check('Close returns to Sign in', (await text(p, 'runtime-antigravity-signin-button')) === 'Sign in' && !(await has(p, 'runtime-antigravity-signin-terminal')));
  await done(p); }

group = 'RTM-010 command-line fallback';
{ const p = await open({ scenario: 'runtimes_signed_out' });
  check('Claude: Not signed in + hint, no button', (await text(p, 'runtime-claude-account')).includes('Not signed in') && (await text(p, 'runtime-claude-signin-hint')) === 'Sign in from its command line.' && !(await has(p, 'runtime-claude-signin-button')));
  check('Codex, Antigravity and Grok have a Sign in button', (await has(p, 'runtime-codex-signin-button')) && (await has(p, 'runtime-antigravity-signin-button')) && (await has(p, 'runtime-grok-signin-button')));
  await done(p); }

group = 'RTM-011 mixed (agents running, check failed, not installed, signed out)';
{ const p = await open({ scenario: 'runtimes_mixed' });
  check('Codex not installed', (await text(p, 'runtime-codex-installed')).includes('Not installed') && await has(p, 'runtime-codex-install-link'));
  check('Claude blocked', await has(p, 'runtime-claude-blocked'));
  check('Antigravity check failed, still works', (await text(p, 'runtime-antigravity-status')) === 'Check failed' && (await text(p, 'runtime-antigravity-check-failed-note')) === "Couldn't reach the update source. Antigravity still works.");
  check('installed version still shown on a failed check', (await text(p, 'runtime-antigravity-installed')).endsWith('1.4.3'));
  check('Grok Not signed in with a button', (await text(p, 'runtime-grok-account')).includes('Not signed in') && await has(p, 'runtime-grok-signin-button'));
  await done(p); }

group = 'RTM-012 all failed checks';
{ const p = await open({ scenario: 'runtimes_check_failed' });
  const n = await p.locator('[data-testid$="-check-failed-note"]').count();
  check('each installed runtime says Check failed on its own', n === 3, String(n));
  await done(p); }

group = 'RTM-013 load error';
{ const p = await open({ scenario: 'runtimes_load_failed', run: 1000 });
  check('error with Retry', (await text(p, 'ai-runtimes-load-error')).startsWith("Couldn't read the agent runtimes on this node."));
  await t(p, 'ai-runtimes-load-retry').click(); await tick(p, 600);
  check('Retry shows loading then rows', await has(p, 'runtime-claude') || await has(p, 'ai-runtimes-loading'));
  await tick(p, 2500);
  check('rows after retry', (await text(p, 'runtime-claude-status')) === 'Update available (version 2.1.304)');
  await done(p); }

group = 'RTM-014 remote node';
{ const p = await open({ context: 'electron_remote' });
  check('node line names the remote node', /^Prototype Remote Node\s*·\s*Remote node$/.test(await text(p, 'ai-runtimes-node')));
  check('status-only note', (await text(p, 'ai-runtimes-remote-note')) === "Status only. Update these runtimes on that node's computer.");
  check('Update available is shown, no Update or Sign in buttons', (await text(p, 'runtime-codex-status')) === 'Update available (version 0.163.0)' && (await p.locator('[data-testid$="-update"], [data-testid$="-signin-button"]').count()) === 0);
  check('Check again works on a remote node', await t(p, 'ai-runtimes-check-again').isEnabled());
  await done(p); }

group = 'RTM-015 zh-CN';
{ const p = await open({ locale: 'zh-CN' });
  check('title and menu', (await text(p, 'ai-runtimes-card')).startsWith('智能体运行时') && (await p.locator('[data-testid="settings-nav-ai-runtimes"]').innerText()).trim() === '智能体运行时');
  check('status words', (await text(p, 'runtime-claude-status')) === '有可用更新（版本 2.1.304）' && (await text(p, 'runtime-codex-status')) === '已是最新');
  await done(p); }

group = 'RTM-016 narrow 390 px';
{ const p = await open({ w: 390, h: 1100, scenario: 'runtimes_mixed' });
  const o = await p.evaluate(() => { const c = document.querySelector('[data-testid="settings-page-content"]'); return [c.scrollWidth, c.clientWidth]; });
  check('no horizontal overflow', o[0] <= o[1], o.join('/'));
  check('labels show on narrow', (await t(p, 'runtime-claude-installed').innerText()).includes('Installed'));
  await done(p); }
{ const p = await open({ w: 390, h: 1100 });
  await t(p, 'runtime-antigravity-signin-button').click(); await tick(p, 200);
  const o = await p.evaluate(() => { const c = document.querySelector('[data-testid="settings-page-content"]'); return [c.scrollWidth, c.clientWidth]; });
  check('terminal fits without overflow', o[0] <= o[1], o.join('/'));
  await done(p); }

group = 'RTM-017 keyboard';
{ const p = await open();
  await t(p, 'ai-runtimes-check-again').focus(); await p.keyboard.press('Enter'); await tick(p, 100);
  check('Check again by keyboard', (await text(p, 'runtime-claude-status')) === 'Checking for updates…');
  await tick(p, 2000);
  await t(p, 'runtime-claude-update').focus(); await p.keyboard.press('Space'); await tick(p, 100);
  check('Update by keyboard', await has(p, 'runtime-claude-updating'));
  await t(p, 'runtime-codex-signin-button').focus(); await p.keyboard.press('Enter'); await tick(p, 100);
  check('Sign in by keyboard', await has(p, 'runtime-codex-signin-waiting'));
  await done(p); }

group = 'RTM-018 nothing to do';
{ const p = await open({ scenario: 'runtimes_all_current' });
  const n = await p.locator('[data-testid$="-status"]').allInnerTexts();
  check('every runtime Up to date', n.length === 4 && n.every((x) => x.trim() === 'Up to date'), n.join('|'));
  check('no Update button', (await p.locator('[data-testid$="-update"]').count()) === 0);
  await done(p); }

group = 'RTM-019 leave and return';
{ const p = await open();
  await t(p, 'runtime-claude-update').click(); await tick(p, 1500);
  await t(p, 'settings-nav-display').click(); await tick(p, 4000);
  await t(p, 'settings-nav-ai-runtimes').click(); await tick(p, 200);
  check('the update kept running while away and finished', (await has(p, 'runtime-claude-updated')) || (await text(p, 'runtime-claude-installed')).endsWith('2.1.304'));
  await tick(p, 2000);
  check('returning re-checks', (await text(p, 'runtime-claude-status')) === 'Up to date');
  await done(p); }

group = 'RTM-020 accessibility structure';
{ const p = await open();
  check('list has a label', (await p.locator('ul[aria-label="Agent runtimes on this node"]').count()) === 1);
  check('live region present', (await t(p, 'ai-runtimes-announce').getAttribute('aria-live')) === 'polite');
  check('column header row hidden from AT (cells carry their labels)', (await p.locator('[data-testid="ai-runtimes-list"] > div[aria-hidden=true]').count()) === 1);
  check('Update button has a name with the runtime', (await t(p, 'runtime-claude-update').getAttribute('aria-label')) === 'Update Claude');
  check('install link says it opens in a browser', (await t(p, 'runtime-grok-install-link').innerText()).includes('opens in your browser'));
  await done(p); }

console.log(`\nAgent Runtimes validation: ${pass} passed, ${fail} failed`);
await browser.close();
process.exit(fail ? 1 : 0);
