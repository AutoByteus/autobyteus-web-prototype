import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4195';
const completedTicketRoot = path.resolve('tickets/done/BASELINE-PROMOTION-001');
const defaultTicketRoot = await fs.access(completedTicketRoot)
  .then(() => completedTicketRoot)
  .catch(() => path.resolve('tickets/in-progress/BASELINE-PROMOTION-001'));
const ticketRoot = process.env.PROMOTION_EVIDENCE_ROOT
  ? path.resolve(process.env.PROMOTION_EVIDENCE_ROOT)
  : defaultTicketRoot;
const evidenceRoot = path.join(ticketRoot, 'validation', 'default-entry');
const visualRoot = path.join(ticketRoot, 'visual-references');
await fs.mkdir(evidenceRoot, { recursive: true });
await fs.mkdir(visualRoot, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking'],
});

const results = [];
const runtimeErrors = [];
const record = (id, pass, evidence = {}) => results.push({ id, pass: Boolean(pass), evidence });
const cleanUrl = (page) => !new URL(page.url()).searchParams.has('prototypeReview');
const freshPage = async ({ scenario = 'populated', viewport = { width: 1440, height: 900 } } = {}) => {
  const page = await browser.newPage({ viewport });
  page.on('pageerror', error => runtimeErrors.push(`pageerror: ${error.stack || error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
  });
  await page.addInitScript(({ selectedScenario }) => {
    localStorage.setItem('autobyteus.prototype.scenario', selectedScenario);
    localStorage.setItem('autobyteus.prototype.context', 'desktop');
    localStorage.setItem('autobyteus.app-left-panel.primary-nav-height', '240');
  }, { selectedScenario: scenario });
  return page;
};

const teamPage = await freshPage();
await teamPage.goto(`${baseUrl}/agent-teams?view=team-list`, { waitUntil: 'networkidle' });
record('PROMOTE-001-clean-agent-team-default',
  cleanUrl(teamPage)
    && await teamPage.locator('[data-test="flat-agent-team-experience"]').count() === 1
    && await teamPage.locator('[data-test^="team-card-"]').count() === 3
    && await teamPage.getByRole('button', { name: 'Agent Orgs', exact: true }).count() === 1,
  { url: teamPage.url(), cards: await teamPage.locator('[data-test^="team-card-"]').count() });
await teamPage.locator('[data-test^="team-card-"]').first().getByRole('button', { name: 'Run', exact: true }).click();
await teamPage.waitForURL(url => url.pathname === '/workspace' && url.searchParams.get('root') === 'team' && url.searchParams.get('phase') === 'config');
await teamPage.getByText('Team Definition', { exact: true }).waitFor();
record('PROMOTE-002-clean-agent-team-configuration',
  cleanUrl(teamPage)
    && await teamPage.getByText('Product Design & Prototyping', { exact: true }).count() >= 1
    && await teamPage.getByRole('button', { name: 'Run Team', exact: true }).count() === 1
    && await teamPage.locator('[data-test="team-run-blocking-issue"]').count() === 1,
  { url: teamPage.url(), teamDefinition: 'Product Design & Prototyping' });
await teamPage.screenshot({ path: path.join(visualRoot, 'VIS-PROMOTE-001-agent-team-config-clean-route-desktop-1440x900.png') });
await teamPage.getByRole('button', { name: 'Select a workspace...', exact: true }).click();
await teamPage.getByText('/synthetic/prototype-workspace', { exact: true }).click();
await teamPage.getByRole('button', { name: 'Run Team', exact: true }).click();
await teamPage.waitForURL(url => url.pathname === '/workspace' && url.searchParams.get('root') === 'team' && url.searchParams.get('phase') === 'active');
await teamPage.getByText('Product Design & Prototyping', { exact: true }).first().waitFor();
record('PROMOTE-002A-clean-agent-team-active',
  cleanUrl(teamPage)
    && await teamPage.locator('[data-test="agent-org-run-history"]').count() === 0
    && await teamPage.locator('[data-test^="workspace-team-definition-row-"]').count() >= 1
    && await teamPage.getByText('Product Design & Prototyping', { exact: true }).count() >= 1,
  { url: teamPage.url(), historyRoot: 'standalone Agent Team' });
await teamPage.screenshot({ path: path.join(visualRoot, 'VIS-PROMOTE-004-agent-team-active-clean-route-desktop-1440x900.png') });
await teamPage.close();

const engineeringTeamPage = await freshPage();
await engineeringTeamPage.goto(`${baseUrl}/agent-teams?view=team-list`, { waitUntil: 'networkidle' });
await engineeringTeamPage.locator('[data-test="team-card-software-engineering-team"]').getByRole('button', { name: 'Run', exact: true }).click();
await engineeringTeamPage.getByText('Team Definition', { exact: true }).waitFor();
await engineeringTeamPage.getByRole('button', { name: 'Select a workspace...', exact: true }).click();
await engineeringTeamPage.getByText('/synthetic/prototype-workspace', { exact: true }).click();
await engineeringTeamPage.getByRole('button', { name: 'Run Team', exact: true }).click();
await engineeringTeamPage.waitForURL(url => url.pathname === '/workspace' && url.searchParams.get('team') === 'software-engineering-team' && url.searchParams.get('phase') === 'active');
await engineeringTeamPage.locator('[data-test^="workspace-team-definition-row-"]').click();
const engineeringMemberCount = await engineeringTeamPage.locator('[data-test^="workspace-team-member-team-run-software-engineering-team-"]').count();
record('PROMOTE-002B-exact-selected-team-membership',
  cleanUrl(engineeringTeamPage)
    && await engineeringTeamPage.getByText('Software Engineering', { exact: true }).count() >= 1
    && engineeringMemberCount === 4,
  { url: engineeringTeamPage.url(), teamDefinition: 'Software Engineering', memberCount: engineeringMemberCount });
await engineeringTeamPage.close();

const orgPage = await freshPage();
await orgPage.goto(`${baseUrl}/agent-orgs?view=org-list`, { waitUntil: 'networkidle' });
record('PROMOTE-003-clean-agent-org-default',
  cleanUrl(orgPage)
    && await orgPage.locator('[data-test="agent-org-experience"]').count() === 1
    && await orgPage.locator('[data-test^="org-card-"]').count() === 2,
  { url: orgPage.url(), cards: await orgPage.locator('[data-test^="org-card-"]').count() });
await orgPage.locator('[data-test="org-card-software-development-department"]').getByRole('button', { name: 'Run', exact: true }).click();
await orgPage.waitForURL(url => url.pathname === '/workspace' && url.searchParams.get('root') === 'org' && url.searchParams.get('phase') === 'config');
await orgPage.locator('[data-test="agent-org-run-config"]').waitFor();
record('PROMOTE-004-clean-agent-org-configuration',
  cleanUrl(orgPage)
    && await orgPage.locator('[data-test="agent-org-run-config"]').count() === 1
    && await orgPage.locator('[data-test="run-agent-org"]').isDisabled(),
  { url: orgPage.url(), initialRunDisabled: true });
await orgPage.getByRole('button', { name: 'Select a workspace...', exact: true }).click();
await orgPage.getByText('/synthetic/prototype-workspace', { exact: true }).click();
await orgPage.locator('[data-test="run-agent-org"]').click();
await orgPage.waitForURL(url => url.pathname === '/workspace' && url.searchParams.get('root') === 'org' && url.searchParams.get('phase') === 'active');
await orgPage.locator('[data-test="agent-org-active-unfocused"]').waitFor();
record('PROMOTE-005-clean-agent-org-active',
  cleanUrl(orgPage)
    && await orgPage.locator('[data-test="history-org-root"]').count() === 1
    && await orgPage.locator('[data-test="agent-org-active-unfocused"]').count() === 1,
  { url: orgPage.url(), initialFocus: null });
await orgPage.screenshot({ path: path.join(visualRoot, 'VIS-PROMOTE-002-agent-org-active-clean-route-desktop-1440x900.png') });
await orgPage.close();

const hierarchyPage = await freshPage({ scenario: 'workspace_team_hierarchy_review' });
await hierarchyPage.goto(`${baseUrl}/workspace`, { waitUntil: 'networkidle' });
await hierarchyPage.locator('[data-test="workspace-team-execution-tree"]').first().waitFor();
record('PROMOTE-006-clean-workspace-hierarchy',
  cleanUrl(hierarchyPage)
    && await hierarchyPage.locator('[data-test="workspace-team-execution-tree"].hierarchy-rails').count() >= 1
    && await hierarchyPage.locator('[data-team-icon="user-group-solid"]').count() >= 1
    && await hierarchyPage.locator('[data-test="nested-hierarchy-review-panel"]').count() === 0,
  {
    url: hierarchyPage.url(),
    railsTrees: await hierarchyPage.locator('[data-test="workspace-team-execution-tree"].hierarchy-rails').count(),
    teamIcons: await hierarchyPage.locator('[data-team-icon="user-group-solid"]').count(),
    reviewControls: await hierarchyPage.locator('[data-test="nested-hierarchy-review-panel"]').count(),
  });
await hierarchyPage.screenshot({ path: path.join(visualRoot, 'VIS-PROMOTE-003-workspace-hierarchy-clean-route-desktop-1440x900.png') });
await hierarchyPage.close();

const navigationPage = await freshPage();
await navigationPage.goto(`${baseUrl}/agent-teams?view=team-list`, { waitUntil: 'networkidle' });
await navigationPage.getByRole('button', { name: 'Agent Orgs', exact: true }).click();
await navigationPage.waitForURL(url => url.pathname === '/agent-orgs');
await navigationPage.getByRole('button', { name: 'Agent Teams', exact: true }).click();
await navigationPage.waitForURL(url => url.pathname === '/agent-teams');
record('PROMOTE-007-primary-navigation-stays-clean', cleanUrl(navigationPage), { url: navigationPage.url() });
await navigationPage.close();

const tokenPage = await freshPage({ scenario: 'token_partial' });
await tokenPage.goto(`${baseUrl}/settings?section=token-usage`, { waitUntil: 'networkidle' });
record('PROMOTE-008-token-statistics-clean-route-regression',
  cleanUrl(tokenPage)
    && await tokenPage.getByRole('tab', { name: 'Analytics', exact: true }).count() === 1
    && await tokenPage.getByRole('tab', { name: 'Run details', exact: true }).count() === 1,
  { url: tokenPage.url() });
await tokenPage.close();

await browser.close();
record('PROMOTE-009-zero-browser-errors', runtimeErrors.length === 0, { runtimeErrors });

const summary = {
  baseUrl,
  generatedAt: new Date().toISOString(),
  passed: results.filter(result => result.pass).length,
  total: results.length,
  runtimeErrors,
  results,
};
await fs.writeFile(path.join(evidenceRoot, 'default-baseline-promotion-results.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
if (summary.passed !== summary.total) process.exitCode = 1;
