// WEB-BASELINE-REFRESH-010: a copy of tickets/done/task-keys-and-dependencies/visual-references/final-validation.mjs; only the
// Playwright import (the original worktree is gone) and the browser executable differ. Expectations are unchanged.
import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-010/node_modules/playwright-core/index.mjs';
const B=process.env.BASE||'http://127.0.0.1:4661', O=process.env.OUT||'./';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }); const log=(...a)=>console.log(...a); const res=[];
const check=(id,ok,d)=>{res.push({id,ok,d}); log(ok?'PASS':'FAIL',id,JSON.stringify(d));};
const ctx = await browser.newContext({ viewport:{width:1440,height:900}, permissions:['clipboard-read','clipboard-write'] });
const p = await ctx.newPage(); p.on('pageerror', e => log('PAGEERR', e.message));
const badge = (id) => p.locator(`[data-testid="project-task-row-${id}"] [data-testid^="task-dependency-badge-"]`);
await p.goto(B+'/projects/project-desktop-app'); await p.waitForTimeout(5000);
check('KEY-001 (revised 2026-10-17) board cards show no key line; badges keep the key', await p.locator('[data-testid="project-task-row-key"]').count()===0 && await p.locator('[data-testid="project-task-row-tk-agent-loop"]').innerText().then(t=>!/^autobyteus-/.test(t.trim())), await p.locator('[data-testid="project-task-row-tk-agent-loop"]').innerText().then(t=>t.split('\n')[0]));
check('DEP-001 one open blocker', (await badge('tk-agent-loop').innerText()).replace(/\s+/g,' ').trim()==='Blocked by autobyteus-35', await badge('tk-agent-loop').innerText());
check('DEP-002 several blockers: first by key, +N; title lists all', (await badge('tk-keys-build').innerText()).replace(/\s+/g,' ').trim()==='Blocked by autobyteus-38 +1' && (await badge('tk-keys-build').getAttribute('title')).includes('autobyteus-39 (In Progress)'), await badge('tk-keys-build').getAttribute('title'));
check('DEP-003 only Done dependencies: no badge', await badge('tk-locator-build').count()===0 && await badge('dct-image-context').count()===0, null);
check('DEP-004 cancelled dependency badge', (await badge('dct-release-notes').innerText()).replace(/\s+/g,' ').trim()==='Dependency cancelled: autobyteus-31', null);
// Edit: add a dependency to Work Journal (33) on 35, check cycle on agent loop
await p.goto(B+'/projects/project-desktop-app/tasks/tk-compaction/edit'); await p.waitForTimeout(2500);
await p.click('[data-testid="task-dependency-input"]'); await p.fill('[data-testid="task-dependency-input"]', 'agent loop'); await p.waitForTimeout(300);
const opt = p.locator('[data-testid="task-dependency-option-tk-agent-loop"]');
check('DEP-005 a Task that depends on this one cannot be chosen (no loop)', (await opt.getAttribute('aria-disabled'))==='true' && (await opt.innerText()).includes('Depends on this Task'), await opt.innerText());
await p.screenshot({ path: O+'r1-cycle.png' });
await p.goto(B+'/projects/project-desktop-app/tasks/dct-work-journal/edit'); await p.waitForTimeout(2500);
await p.click('[data-testid="task-dependency-input"]'); await p.keyboard.type('35'); await p.waitForTimeout(300); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
check('DEP-006 keyboard: type and Enter adds a dependency', await p.locator('[data-testid="task-dependency-selected-tk-compaction"]').count()===1, null);
await p.screenshot({ path: O+'r1-editor-added.png' });
await p.click('[data-testid="task-page-save"]'); await p.waitForTimeout(2000);
check('DEP-007 saved: detail lists it', (await p.locator('[data-testid="task-dependencies-depends-on"]').innerText()).includes('autobyteus-35'), p.url());
await p.click('[data-testid="task-back-to-board"]'); await p.waitForTimeout(2500);
check('DEP-008 board badge appears after save', (await badge('dct-work-journal').innerText()).includes('autobyteus-35'), null);
await p.click('[data-testid="project-task-row-tk-compaction"] [data-testid="project-task-row-link"]'); await p.waitForTimeout(2500);
check('DEP-009 inverse: Required by lists both dependents', (await p.locator('[data-testid="task-dependencies-required-by"]').innerText()).includes('autobyteus-33') && (await p.locator('[data-testid="task-dependencies-required-by"]').innerText()).includes('autobyteus-36'), await p.locator('[data-testid="task-dependencies-required-by"]').innerText());
// remove
await p.click('[data-testid="task-dependency-dct-work-journal"]'); await p.waitForTimeout(2000);
await p.click('[data-testid="task-page-edit"]'); await p.waitForTimeout(2000);
await p.click('[data-testid="task-dependency-selected-tk-compaction"] [data-testid="task-dependency-remove"]'); await p.click('[data-testid="task-page-save"]'); await p.waitForTimeout(2000);
await p.click('[data-testid="task-back-to-board"]'); await p.waitForTimeout(2500);
check('DEP-010 removed: badge gone', await badge('dct-work-journal').count()===0, null);
// new task gets next key
await p.click('[data-testid="project-tasks-new-button"]'); await p.waitForTimeout(2500);
await p.fill('#task-page-description', 'Follow-up: show Task keys in agent tool output'); 
await p.click('[data-testid="task-dependency-input"]'); await p.keyboard.type('39'); await p.keyboard.press('Enter');
await p.click('[data-testid="task-page-save"]'); await p.waitForTimeout(2500);
const newCard = p.locator('[data-testid^="project-task-row-task-created-"]').first();
const newBadge = (await newCard.locator('[data-testid^="task-dependency-badge-"]').innerText()).replace(/\s+/g,' ').trim();
await newCard.locator('[data-testid="project-task-row-link"]').click(); await p.waitForTimeout(2000);
const chip = await p.locator('[data-testid="task-key-chip"] [data-testid="task-key"]').getAttribute('data-key');
check('KEY-002 a new Task gets the next number (autobyteus-41, on its Task page) and its dependency', chip==='autobyteus-41' && newBadge==='Blocked by autobyteus-39', { chip, newBadge });
// copy
await p.goto(B+'/projects/project-desktop-app/tasks/tk-agent-loop'); await p.waitForTimeout(2500);
await p.click('[data-testid="task-key-copy"]'); await p.waitForTimeout(200);
const clip = await p.evaluate(()=>navigator.clipboard.readText().catch(()=>null));
check('KEY-003 copy key: clipboard and "Copied"', clip==='autobyteus-36' && await p.locator('[data-testid="task-key-copied"]').count()===1, clip);
await p.screenshot({ path: O+'r1-copied.png', clip:{x:340,y:60,width:700,height:70} });
await p.goto(B+'/chat?id=run-ptm-0001'); await p.waitForTimeout(6000);
const sums = await p.locator('[data-test="workspace-task-worker-task-summary"]').evaluateAll(els=>els.map(e=>[e.innerText, e.getAttribute('aria-label')]));
check('TREE-001 (revised 2026-10-17) tree Task summary has no key; tooltip "Show Task in Projects: <summary>"', sums.length===5 && sums.every(([t,a])=>!/^(autobyteus|prototype-launch)-\d/.test(t) && a==='Show Task in Projects: '+t), sums.slice(0,2));
await browser.close();
log(res.filter(r=>r.ok).length+'/'+res.length);
