import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4197';
const ticketRoot = path.resolve(process.env.AORG_TEAM_STATUS_TICKET_ROOT || 'tickets/done/AORG-FLAT-TEAM-STATUS-001');
const evidenceRoot = path.resolve(process.env.AORG_TEAM_STATUS_EVIDENCE_ROOT || path.join(ticketRoot, 'review-evidence', 'rv-001'));
await fs.mkdir(evidenceRoot, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking'],
});

const results = [];
const runtimeErrors = [];
const record = (id, pass, evidence = {}) => results.push({ id, pass: Boolean(pass), evidence });
const reviewUrl = (state) => `${baseUrl}/workspace?root=org&org=software-development-department&phase=active&prototypeReview=aorg-team-status&statusState=${state}`;
const cleanActiveUrl = `${baseUrl}/workspace?root=org&org=software-development-department&phase=active`;
const freshPage = async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', error => runtimeErrors.push(`pageerror: ${error.stack || error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
  });
  await page.addInitScript(() => {
    localStorage.setItem('autobyteus.prototype.scenario', 'workspace_agent_org_active');
    localStorage.setItem('autobyteus.prototype.context', 'desktop');
    localStorage.setItem('autobyteus.app-left-panel.primary-nav-height', '240');
  });
  return page;
};

const activePage = await freshPage();
await activePage.goto(reviewUrl('active'), { waitUntil: 'networkidle' });
await activePage.locator('[data-test="history-org-execution-tree"]').waitFor();
const activeProductStatus = activePage.locator('[data-test="history-org-team-status-product-design-prototyping-team"]');
const activeEngineeringStatus = activePage.locator('[data-test="history-org-team-status-software-engineering-team"]');
record('AORG-STATUS-001-active-expanded-aggregate',
  await activeProductStatus.getAttribute('data-status') === 'running'
    && await activeEngineeringStatus.getAttribute('data-status') === 'initializing'
    && await activePage.locator('[data-test^="history-org-team-agent-"]').count() === 6,
  {
    productTeam: await activeProductStatus.getAttribute('data-status'),
    engineeringTeam: await activeEngineeringStatus.getAttribute('data-status'),
    exactConfiguredAgentRows: await activePage.locator('[data-test^="history-org-team-agent-"]').count(),
  });
record('AORG-STATUS-002-task-descendants-contribute',
  await activePage.locator('[data-test="history-task-agent-row"]').getAttribute('data-status') === 'running'
    && await activePage.locator('[data-test="history-task-team-child-row"]').getAttribute('data-status') === 'idle',
  {
    taskAgent: await activePage.locator('[data-test="history-task-agent-row"]').getAttribute('data-status'),
    taskTeamAgent: await activePage.locator('[data-test="history-task-team-child-row"]').getAttribute('data-status'),
  });
record('AORG-STATUS-003-accessible-without-color',
  await activeProductStatus.locator('[role="img"][aria-label="Team status: Running"]').count() === 1
    && await activeEngineeringStatus.locator('[role="img"][aria-label="Team status: Initializing"]').count() === 1,
  { labels: await activePage.locator('[data-test^="history-org-team-status-"] [role="img"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('aria-label'))) });
record('AORG-STATUS-004-no-mounted-team-lifecycle-controls',
  await activePage.getByRole('button', { name: /^(Stop|Restore|Archive)$/i }).count() === 0,
  { matchingControls: await activePage.getByRole('button', { name: /^(Stop|Restore|Archive)$/i }).count() });
await activePage.screenshot({ path: path.join(evidenceRoot, 'RV-001-mounted-team-status-active-expanded-1440x900.png') });
await activePage.close();

const collapsedPage = await freshPage();
await collapsedPage.goto(reviewUrl('collapsed'), { waitUntil: 'networkidle' });
await collapsedPage.locator('[data-test="history-org-execution-tree"]').waitFor();
record('AORG-STATUS-005-collapsed-visible',
  await collapsedPage.locator('[data-test^="history-org-team-status-"]').count() === 2
    && await collapsedPage.locator('[data-test^="history-org-team-agent-"]').count() === 0
    && await collapsedPage.locator('[data-test="history-org-team-product-design-prototyping-team"] [role="treeitem"]').getAttribute('aria-expanded') === 'false'
    && await collapsedPage.locator('[data-test="history-org-team-software-engineering-team"] [role="treeitem"]').getAttribute('aria-expanded') === 'false',
  {
    teamSignals: await collapsedPage.locator('[data-test^="history-org-team-status-"]').count(),
    visibleAgentRows: await collapsedPage.locator('[data-test^="history-org-team-agent-"]').count(),
  });
await collapsedPage.screenshot({ path: path.join(evidenceRoot, 'RV-002-mounted-team-status-active-collapsed-1440x900.png') });
await collapsedPage.close();

const historicalPage = await freshPage();
await historicalPage.goto(reviewUrl('historical'), { waitUntil: 'networkidle' });
await historicalPage.locator('[data-test="agent-org-historical-unfocused"]').waitFor();
const historicalStatuses = await historicalPage.locator('[data-test^="history-org-team-status-"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-status')));
record('AORG-STATUS-006-historical-terminal-truth',
  historicalStatuses.join(',') === 'error,idle'
    && !historicalStatuses.includes('running')
    && !historicalStatuses.includes('initializing')
    && await historicalPage.getByText('12m', { exact: true }).count() === 1,
  { statuses: historicalStatuses, lastActivity: '12m' });
const mountedTeamLifecycleControls = await historicalPage
  .locator('[data-test^="history-org-team-"]')
  .getByRole('button', { name: /^(Stop|Restore|Archive)$/i })
  .count();
const preservedStandaloneTeamHistory = await historicalPage
  .locator('[data-test="history-standalone-team-definition"]')
  .count();
record('AORG-STATUS-007-history-remains-org-owned',
  mountedTeamLifecycleControls === 0 && preservedStandaloneTeamHistory === 1,
  { mountedTeamLifecycleControls, preservedStandaloneTeamHistory });
await historicalPage.screenshot({ path: path.join(evidenceRoot, 'RV-003-mounted-team-status-stopped-historical-1440x900.png') });
await historicalPage.close();

const cleanActivePage = await freshPage();
await cleanActivePage.goto(cleanActiveUrl, { waitUntil: 'networkidle' });
await cleanActivePage.locator('[data-test="history-org-execution-tree"]').waitFor();
const cleanStatuses = await cleanActivePage
  .locator('[data-test^="history-org-team-status-"]')
  .evaluateAll(nodes => nodes.map(node => node.getAttribute('data-status')));
record('AORG-STATUS-009-default-route-promoted',
  !cleanActivePage.url().includes('prototypeReview')
    && cleanStatuses.join(',') === 'running,initializing'
    && await cleanActivePage.locator('[data-test^="history-org-team-agent-"]').count() === 6,
  {
    url: cleanActivePage.url(),
    teamStatuses: cleanStatuses,
    exactConfiguredAgentRows: await cleanActivePage.locator('[data-test^="history-org-team-agent-"]').count(),
  });
await cleanActivePage.close();

await browser.close();
record('AORG-STATUS-008-zero-browser-errors', runtimeErrors.length === 0, { runtimeErrors });

const summary = {
  baseUrl,
  generatedAt: new Date().toISOString(),
  passed: results.filter(result => result.pass).length,
  total: results.length,
  runtimeErrors,
  results,
};
await fs.writeFile(path.join(evidenceRoot, 'browser-validation.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
if (summary.passed !== summary.total) process.exitCode = 1;
