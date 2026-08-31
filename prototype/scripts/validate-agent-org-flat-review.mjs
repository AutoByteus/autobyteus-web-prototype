import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4194';
const ticketRoot = path.resolve('tickets/in-progress/AORG-FLAT-TEAM-001');
const evidenceRoot = path.join(ticketRoot, 'review-evidence', 'rv-002');
await fs.mkdir(evidenceRoot, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking'],
});

const checks = [];
const failures = [];
const runtimeErrors = [];
const captures = [];
const record = (id, pass, evidence) => {
  const result = { id, pass: Boolean(pass), evidence };
  checks.push(result);
  if (!result.pass) failures.push(result);
};

const query = (values) => new URLSearchParams({ prototypeReview: 'agent-org-flat', ...values }).toString();
const openPage = async (route, viewport = { width: 1440, height: 900 }) => {
  const page = await browser.newPage({ viewport });
  page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
  });
  await page.addInitScript(() => {
    localStorage.setItem('autobyteus.prototype.scenario', 'populated');
    localStorage.setItem('autobyteus.prototype.context', 'desktop');
    localStorage.setItem('autobyteus.app-left-panel.primary-nav-height', '220');
  });
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  return page;
};

const capture = async (page, id, filename, state) => {
  const outputPath = path.join(evidenceRoot, filename);
  await page.screenshot({ path: outputPath, fullPage: false });
  captures.push({ id, filename, state, url: page.url(), viewport: page.viewportSize() });
};

const teamList = await openPage(`/agent-teams?${query({ view: 'team-list' })}`);
record('AORG-RV2-001-team-catalog',
  await teamList.getByRole('heading', { name: 'Agent Teams', exact: true }).count() === 1
    && await teamList.locator('[data-test^="team-card-"]').count() === 3
    && await teamList.getByText('Reusable', { exact: true }).count() === 3,
  { cards: await teamList.locator('[data-test^="team-card-"]').count() });
record('AORG-RV2-002-separated-primary-navigation',
  await teamList.getByRole('button', { name: 'Agent Teams', exact: true }).count() === 1
    && await teamList.getByRole('button', { name: 'Agent Orgs', exact: true }).count() === 1,
  { navigation: ['Agent Teams', 'Agent Orgs'] });
record('AORG-RV2-003-team-card-flat-contract',
  await teamList.getByText('Agent members only', { exact: true }).count() === 1
    && await teamList.getByText('Nested Teams', { exact: true }).count() === 0
    && await teamList.locator('[data-test="agent-org-run-history"]').count() === 0,
  { nestedTeamMetric: 0, runtimeSpecificHistoryOnCatalog: 0 });
await capture(teamList, 'REV-AORG-001', 'REV-AORG-001-agent-team-catalog.png', 'Agent Team catalog with reusable flat Teams');
await teamList.close();

const teamCreate = await openPage(`/agent-teams?${query({ view: 'team-create' })}`);
const coordinatorRadios = teamCreate.locator('input[type="radio"]');
record('AORG-RV2-004-team-authoring-agent-only',
  await teamCreate.getByRole('heading', { name: 'Create Agent Team' }).count() === 1
    && await teamCreate.getByRole('button', { name: 'Add Agent' }).count() === 1
    && await teamCreate.getByRole('button', { name: 'Add Team' }).count() === 0,
  { addAgent: 1, addTeam: 0 });
record('AORG-RV2-005-exactly-one-team-coordinator',
  await coordinatorRadios.count() === 2
    && await coordinatorRadios.evaluateAll((radios) => radios.filter((radio) => radio.checked).length === 1),
  { radios: await coordinatorRadios.count(), checked: await coordinatorRadios.evaluateAll((radios) => radios.filter((radio) => radio.checked).length) });
await capture(teamCreate, 'REV-AORG-002', 'REV-AORG-002-agent-team-authoring.png', 'Agent-only Team authoring with one direct coordinator');
await teamCreate.close();

const orgList = await openPage(`/agent-orgs?${query({ view: 'org-list' })}`);
record('AORG-RV2-006-org-catalog',
  await orgList.getByRole('heading', { name: 'Agent Orgs', exact: true }).count() === 1
    && await orgList.locator('[data-test^="org-card-"]').count() === 2
    && await orgList.getByText('No coordinator', { exact: true }).count() >= 2,
  { cards: await orgList.locator('[data-test^="org-card-"]').count() });
record('AORG-RV2-007-org-direct-composition',
  await orgList.getByText('requirements_engineer', { exact: true }).count() >= 1
    && await orgList.getByText('Product Design & Prototyping', { exact: true }).count() >= 1
    && await orgList.getByText('1 level', { exact: true }).count() === 2,
  { directKinds: ['agent', 'team'], configuredLevels: 1 });
await capture(orgList, 'REV-AORG-003', 'REV-AORG-003-agent-org-catalog.png', 'Agent Org catalog with direct Agent and Team composition');
await orgList.close();

const orgCreate = await openPage(`/agent-orgs?${query({ view: 'org-create' })}`);
record('AORG-RV2-008-org-authoring-membership',
  await orgCreate.getByRole('heading', { name: 'Create Agent Org' }).count() === 1
    && await orgCreate.getByRole('button', { name: 'Add Agent' }).count() === 1
    && await orgCreate.getByRole('button', { name: 'Add Team' }).count() === 1,
  { memberPickers: ['Agent', 'Team'] });
record('AORG-RV2-009-org-has-no-coordinator-control',
  await orgCreate.locator('input[type="radio"]').count() === 0
    && await orgCreate.getByText('No Organization coordinator', { exact: false }).count() === 1,
  { coordinatorControls: 0 });
await capture(orgCreate, 'REV-AORG-004', 'REV-AORG-004-agent-org-authoring.png', 'Agent Org authoring with independent Agents and referenced Teams');
await orgCreate.close();

const orgDetail = await openPage(`/agent-orgs?${query({ view: 'org-detail', id: 'software-development-department' })}`);
record('AORG-RV2-010-team-reference-preservation',
  await orgDetail.getByText('Same Team definition · standalone history preserved', { exact: true }).count() === 2
    && await orgDetail.getByText('No coordinator', { exact: true }).count() >= 1,
  { referencedTeams: 2 });
await capture(orgDetail, 'REV-AORG-005', 'REV-AORG-005-agent-org-detail.png', 'Org detail showing referenced reusable Teams and no Org coordinator');
await orgDetail.getByRole('button', { name: 'Run Organization' }).click();
await orgDetail.locator('[data-test="org-launch-modal"]').waitFor();
record('AORG-RV2-011-org-launch-requires-entry',
  await orgDetail.locator('[data-test="start-org-run"]').isDisabled()
    && await orgDetail.getByText('has no coordinator or default recipient', { exact: false }).count() === 1,
  { initialStartDisabled: true });
await orgDetail.locator('input[value="team:product-design-prototyping-team"]').check();
record('AORG-RV2-012-team-entry-resolves-through-coordinator',
  await orgDetail.locator('[data-test="start-org-run"]').isEnabled()
    && await orgDetail.getByText('Product Design & Prototyping through product_prototyper', { exact: false }).count() === 1,
  { entry: 'team:product-design-prototyping-team', coordinator: 'product_prototyper' });
await capture(orgDetail, 'REV-AORG-006', 'REV-AORG-006-agent-org-exact-entry-launch.png', 'Exact Team entry selected; Team coordinator is explicit');
await orgDetail.locator('[data-test="start-org-run"]').click();
await orgDetail.waitForURL(/\/workspace/);
await orgDetail.locator('[data-test="agent-org-runtime-experience"]').waitFor();
record('AORG-RV2-013-launch-carries-exact-entry',
  new URL(orgDetail.url()).searchParams.get('entry') === 'team:product-design-prototyping-team'
    && await orgDetail.getByText('Through coordinator product_prototyper', { exact: true }).count() === 1,
  { url: orgDetail.url() });
record('AORG-RV2-014-runtime-root-kinds',
  await orgDetail.locator('[data-test="history-org-root"]').count() === 1
    && await orgDetail.locator('[data-test="history-team-root"]').count() === 1,
  { roots: ['Org', 'Team'] });
record('AORG-RV2-015-task-team-is-runtime-lineage',
  await orgDetail.getByText('Task work', { exact: true }).count() === 0
    && await orgDetail.getByText('Runtime execution lineage', { exact: true }).count() === 1
    && await orgDetail.locator('[data-test="history-task-agent-row"]').count() === 1
    && await orgDetail.locator('[data-test="history-task-team-row"]').count() === 1
    && await orgDetail.getByText('not authored nesting', { exact: false }).count() === 1,
  { taskPresentation: 'source-current temporary rows within owning Team execution', genericTaskWorkSections: 0 });
record('AORG-RV2-016-task-team-disclosure-and-child-focus',
  await orgDetail.locator('[data-test="history-task-team-row"]').getAttribute('aria-expanded') === 'false',
  { initialTaskTeamDisclosure: 'collapsed' });
await orgDetail.locator('[data-test="history-task-team-row"]').click();
await orgDetail.locator('[data-test="history-task-team-child-row"]').waitFor();
await orgDetail.locator('[data-test="history-task-team-child-row"]').click();
await orgDetail.waitForURL(/focus=task-team-accessibility/);
await orgDetail.locator('[data-test="selected-runtime-execution"]').waitFor();
record('AORG-RV2-017-task-team-child-is-selectable-runtime-identity',
  new URL(orgDetail.url()).searchParams.get('focus') === 'task-team-accessibility:reviewer'
    && await orgDetail.locator('[data-test="selected-runtime-execution"]').count() === 1
    && await orgDetail.locator('[data-test="selected-runtime-execution"]').filter({ hasText: 'Temporary child AgentRun inside the Task Team execution.' }).count() === 1,
  { focusedExecution: 'task-team-accessibility:reviewer' });
await capture(orgDetail, 'REV-AORG-007', 'REV-AORG-007-agent-org-runtime-history.png', 'Shared runtime/history with explicit Agent Org root and task lineage');
await orgDetail.locator('[data-test="history-team-root"]').click();
await orgDetail.waitForURL(/root=team/);
record('AORG-RV2-018-standalone-team-history-remains-distinct',
  await orgDetail.getByText('Standalone Agent Team run', { exact: true }).count() === 1
    && await orgDetail.getByText('Coordinator-led lifecycle', { exact: true }).count() === 1,
  { root: 'standalone Agent Team' });
await capture(orgDetail, 'REV-AORG-008', 'REV-AORG-008-standalone-team-runtime-history.png', 'Shared runtime/history with standalone Team root');
await orgDetail.close();

const narrow = await openPage(`/agent-orgs?${query({ view: 'org-detail', id: 'software-development-department' })}`, { width: 390, height: 844 });
const overflow = await narrow.evaluate(() => ({ viewport: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
record('AORG-RV2-019-narrow-layout', overflow.scrollWidth === overflow.viewport
  && await narrow.getByRole('heading', { name: 'Software Development Department' }).count() === 1,
{ overflow });
await narrow.close();

record('AORG-RV2-020-no-runtime-errors', runtimeErrors.length === 0, { runtimeErrors });

const result = {
  package: 'AORG-FLAT-TEAM-001',
  revision: 'RV-002',
  mode: 'Product Experience Prototyping',
  baseUrl,
  generatedAt: new Date().toISOString(),
  result: failures.length === 0 ? 'PASS' : 'FAIL',
  checks,
  failures,
  runtimeErrors,
  captures,
};
await fs.writeFile(path.join(ticketRoot, 'browser-validation-rv-002.json'), `${JSON.stringify(result, null, 2)}\n`);
await fs.writeFile(path.join(evidenceRoot, 'capture-manifest.json'), `${JSON.stringify({ package: result.package, revision: result.revision, captures, reviewStatus: 'Non-normative pending user approval' }, null, 2)}\n`);
await browser.close();

console.log(JSON.stringify({ result: result.result, checks: checks.length, failures, runtimeErrors, captures: captures.length }, null, 2));
if (failures.length > 0 || runtimeErrors.length > 0) process.exitCode = 1;
