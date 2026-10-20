import { chromium } from '/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/settings-update-notifications/node_modules/playwright-core/index.mjs';
const b = await chromium.launch(); const p = await (await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor: 2 })).newPage();
await p.goto('http://127.0.0.1:4681/chat'); await p.waitForTimeout(6000);
await p.click('[data-test="sidebar-notifications-updates"]'); await p.waitForTimeout(500);
await p.screenshot({ path: '/tmp/sun/shots/r15-00-panel-in-context-2x.png', clip: { x: 0, y: 380, width: 420, height: 520 } }); await b.close();
