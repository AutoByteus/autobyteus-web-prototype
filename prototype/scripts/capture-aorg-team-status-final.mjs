import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4197';
const ticketRoot = path.resolve(process.env.AORG_TEAM_STATUS_TICKET_ROOT || 'tickets/done/AORG-FLAT-TEAM-STATUS-001');
const outputRoot = path.join(ticketRoot, 'visual-references');
await fs.mkdir(outputRoot, { recursive: true });

const references = [
  {
    id: 'VIS-STATUS-001',
    filename: 'VIS-STATUS-001-agent-org-mounted-team-status-active-expanded-desktop-1440x900.png',
    state: 'Active AgentOrg with configured Team branches expanded; Team aggregate status coexists with exact configured and task-scoped Agent statuses.',
    route: '/workspace?root=org&org=software-development-department&phase=active',
  },
  {
    id: 'VIS-STATUS-002',
    filename: 'VIS-STATUS-002-agent-org-mounted-team-status-active-collapsed-desktop-1440x900.png',
    state: 'Active AgentOrg with configured Team branches collapsed; each Team aggregate remains visible while descendants are hidden.',
    route: '/workspace?root=org&org=software-development-department&phase=active&prototypeReview=aorg-team-status&statusState=collapsed',
  },
  {
    id: 'VIS-STATUS-003',
    filename: 'VIS-STATUS-003-agent-org-mounted-team-status-stopped-historical-desktop-1440x900.png',
    state: 'Stopped historical AgentOrg projection; Team aggregates use terminal descendant truth without retaining live running or initializing state.',
    route: '/workspace?root=org&org=software-development-department&phase=active&prototypeReview=aorg-team-status&statusState=historical',
  },
];

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking'],
});

const runtimeErrors = [];
for (const reference of references) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', error => runtimeErrors.push(`${reference.id} pageerror: ${error.stack || error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') runtimeErrors.push(`${reference.id} console: ${message.text()}`);
  });
  await page.addInitScript(() => {
    localStorage.setItem('autobyteus.prototype.scenario', 'workspace_agent_org_active');
    localStorage.setItem('autobyteus.prototype.context', 'desktop');
    localStorage.setItem('autobyteus.app-left-panel.primary-nav-height', '240');
  });
  await page.goto(`${baseUrl}${reference.route}`, { waitUntil: 'networkidle' });
  await page.locator('[data-test="history-org-execution-tree"]').waitFor();
  await page.screenshot({ path: path.join(outputRoot, reference.filename) });
  await page.close();
}
await browser.close();

if (runtimeErrors.length > 0) {
  throw new Error(`Final reference capture observed browser errors:\n${runtimeErrors.join('\n')}`);
}

const items = [];
for (const reference of references) {
  const bytes = await fs.readFile(path.join(outputRoot, reference.filename));
  items.push({
    ...reference,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    viewport: { width: 1440, height: 900 },
    fixtureContent: 'Illustrative deterministic prototype data; placement, hierarchy preservation, aggregate semantics, collapsed visibility, accessibility, historical truth, and lifecycle non-effects are normative.',
  });
}

const capturedAt = new Date().toISOString();
await fs.writeFile(path.join(outputRoot, 'visual-reference-manifest.json'), `${JSON.stringify({
  productTicket: 'AORG-FLAT-TEAM-STATUS-001',
  stableRequirementsPackage: 'AORG-FLAT-TEAM-001',
  outcome: 'Prototype Completed',
  requirementsAuthority: 'RER-020@bf5951867f87d1e5bb6eaa8bfc7b82b2c6f6cba5',
  capturedAfterApproval: true,
  capturedAt,
  runtimeErrors,
  items,
}, null, 2)}\n`);

await fs.writeFile(path.join(outputRoot, 'README.md'), `# Final Visual References — Mounted AgentOrg Team Status\n\nThese references were captured after explicit user approval on 2026-09-01.\n\n- \`VIS-STATUS-001\`: active, expanded, and promoted on the clean AgentOrg workspace route.\n- \`VIS-STATUS-002\`: active and collapsed, proving Team aggregates remain visible without Agent descendants.\n- \`VIS-STATUS-003\`: stopped/historical terminal projection with no stale live Team state.\n\nSee \`visual-reference-manifest.json\` for stable paths, routes, viewport, hashes, and normative fixture boundaries.\n`);

console.log(JSON.stringify({ capturedAt, references: items.length, runtimeErrors }, null, 2));
