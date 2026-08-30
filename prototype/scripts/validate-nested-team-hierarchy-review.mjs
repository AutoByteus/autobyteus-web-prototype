import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4193';
const ticketRoot = path.resolve('tickets/in-progress/REQPKG-NTHUI-001');
const evidenceRoot = path.join(ticketRoot, 'review-evidence', 'rv-004');
await fs.mkdir(evidenceRoot, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking'],
});

const checks = [];
const failures = [];
const runtimeErrors = [];
const record = (id, pass, evidence) => {
  const result = { id, pass: Boolean(pass), evidence };
  checks.push(result);
  if (!result.pass) failures.push(result);
};

const params = (overrides = {}) => new URLSearchParams({
  prototypeReview: 'nested-team-hierarchy',
  reviewView: 'compare',
  hierarchy: 'hybrid',
  metadata: 'responsive',
  teamIdentity: 'header',
  panelWidth: '320',
  fontSize: 'default',
  treeState: 'deep',
  ...overrides,
});

const newPage = async (overrides = {}, viewport = { width: 1440, height: 1000 }) => {
  const page = await browser.newPage({ viewport });
  page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
  });
  await page.addInitScript(() => {
    localStorage.setItem('autobyteus.prototype.scenario', 'workspace_team_hierarchy_review');
    localStorage.setItem('autobyteus.prototype.context', 'desktop');
    localStorage.setItem('autobyteus.app-left-panel.primary-nav-height', '220');
  });
  await page.goto(`${baseUrl}/workspace?${params(overrides)}`, { waitUntil: 'networkidle' });
  await page.locator('[data-test="workspace-team-execution-tree"]').waitFor();
  await page.waitForTimeout(250);
  return page;
};

const fixtureSignature = async (page) => page.locator('[data-test="workspace-team-execution-tree"] [role="treeitem"]')
  .evaluateAll((rows) => rows.map((row) => ({
    kind: row.getAttribute('data-node-kind') || row.getAttribute('data-transient-kind'),
    role: row.getAttribute('role'),
    level: row.getAttribute('aria-level'),
    label: row.getAttribute('aria-label'),
  })));

const page = await newPage();
const shellBox = await page.locator('[data-test="app-left-panel-shell"]').boundingBox();
const reviewBox = await page.locator('[data-test="nested-hierarchy-review-panel"]').boundingBox();
record('NTH-RV4-001-real-workspace-entry', new URL(page.url()).pathname === '/workspace'
  && await page.locator('[data-test="workspace-adaptive-layout"]').count() === 1,
{ url: page.url() });
record('NTH-RV4-002-baseline-shell-preserved', await page.getByRole('button', { name: 'Agents', exact: true }).count() === 1
  && await page.getByRole('button', { name: 'Agent Teams', exact: true }).count() === 1
  && await page.getByRole('button', { name: 'Applications', exact: true }).count() === 1
  && await page.getByRole('button', { name: 'Skills', exact: true }).count() === 1,
{ shellNavigation: ['Agents', 'Agent Teams', 'Applications', 'Skills'] });
record('NTH-RV4-003-review-controls-outside-left-panel', shellBox && reviewBox && reviewBox.x >= shellBox.x + shellBox.width,
{ shellBox, reviewBox });
record('NTH-RV4-004-group-and-run-fixture', await page.locator('[data-test^="workspace-team-definition-row-"]').count() === 1
  && await page.locator('[data-test^="workspace-team-row-"]').count() === 2,
{ definitionGroups: 1, teamRuns: 2 });
record('NTH-RV4-005-deep-fixture', await page.locator('[data-test="workspace-team-execution-tree"] [role="treeitem"]').count() === 17
  && await page.locator('[data-test="workspace-team-transient-execution-row"]').count() === 3,
{ visibleRows: await page.locator('[data-test="workspace-team-execution-tree"] [role="treeitem"]').count(), transientRows: await page.locator('[data-test="workspace-team-transient-execution-row"]').count() });

const signatures = {};
for (const treatment of ['rails', 'surfaces', 'hybrid']) {
  const treatmentPage = await newPage({ hierarchy: treatment });
  signatures[treatment] = await fixtureSignature(treatmentPage);
  const tree = treatmentPage.locator('[data-test="workspace-team-execution-tree"]');
  record(`NTH-RV4-006-${treatment}`, await tree.getAttribute('data-hierarchy-treatment') === treatment,
    { treatment, rows: signatures[treatment].length });
  await treatmentPage.screenshot({
    path: path.join(evidenceRoot, `review-${treatment}-320-default.png`),
    fullPage: true,
  });
  await treatmentPage.close();
}
record('NTH-RV4-007-identical-content-across-ancestry-alternatives',
  JSON.stringify(signatures.rails) === JSON.stringify(signatures.surfaces)
    && JSON.stringify(signatures.rails) === JSON.stringify(signatures.hybrid),
  { signatureRows: signatures.rails.length });

const stateCounts = {};
for (const treeState of ['collapsed', 'one', 'several', 'deep', 'selected']) {
  const statePage = await newPage({ treeState });
  stateCounts[treeState] = await statePage.locator('[data-test="workspace-team-execution-tree"] [role="treeitem"]').count();
  if (treeState === 'selected') {
    const selected = statePage.locator('[data-test="workspace-team-execution-tree"] [aria-selected="true"]');
    const selectedLabel = await selected.getAttribute('aria-label');
    record('NTH-RV4-008-selected-leaf-and-ancestor-reveal', await selected.count() === 1
      && selectedLabel?.includes('Barrierefreiheit')
      && await statePage.locator('[role="treeitem"][data-member-address="/product-design"]').getAttribute('aria-expanded') === 'true'
      && await statePage.locator('[role="treeitem"][data-member-address="/product-design/design-systems"]').getAttribute('aria-expanded') === 'true',
    { selectedLabel });
  }
  await statePage.close();
}
record('NTH-RV4-009-state-progression', stateCounts.collapsed === 5
  && stateCounts.one > stateCounts.collapsed
  && stateCounts.several > stateCounts.one
  && stateCounts.deep > stateCounts.several
  && stateCounts.selected === stateCounts.deep,
{ stateCounts });

const interactionPage = await newPage({ treeState: 'deep' });
const productTeam = interactionPage.locator('[role="treeitem"][data-member-address="/product-design"]');
const softwareTeam = interactionPage.locator('[role="treeitem"][data-member-address="/software-engineering"]');
const selectedBefore = await interactionPage.locator('[data-test="workspace-team-execution-tree"] [aria-selected="true"]').getAttribute('aria-label');
const softwareBefore = await softwareTeam.getAttribute('aria-expanded');
await productTeam.click();
await interactionPage.waitForTimeout(80);
const selectedAfterClick = await interactionPage.locator('[data-test="workspace-team-execution-tree"] [aria-selected="true"]').getAttribute('aria-label');
record('NTH-RV4-010-structural-row-pointer-toggle', await productTeam.getAttribute('aria-expanded') === 'false'
  && await softwareTeam.getAttribute('aria-expanded') === softwareBefore
  && selectedBefore === selectedAfterClick,
{ selectedBefore, selectedAfterClick, softwareBefore, softwareAfter: await softwareTeam.getAttribute('aria-expanded') });
await productTeam.focus();
await interactionPage.keyboard.press('Enter');
await interactionPage.waitForTimeout(80);
record('NTH-RV4-011-structural-row-keyboard-toggle', await productTeam.getAttribute('aria-expanded') === 'true',
{ expanded: await productTeam.getAttribute('aria-expanded') });

const longNameRow = interactionPage.locator('[role="treeitem"][data-member-address="/product-design/research-operations"]');
await longNameRow.focus();
await interactionPage.waitForTimeout(50);
record('NTH-RV4-012-full-identity-pointer-keyboard-recovery',
  (await longNameRow.getAttribute('title'))?.includes('Research Operations Specialist With A Very Long Localized Role')
    && await longNameRow.locator('[role="tooltip"]').isVisible()
    && (await longNameRow.getAttribute('aria-label'))?.includes('level 2'),
{ title: await longNameRow.getAttribute('title'), ariaLabel: await longNameRow.getAttribute('aria-label') });
record('NTH-RV4-013-accessible-tree-semantics', await interactionPage.locator('[data-test="workspace-team-execution-tree"][role="tree"]').count() === 1
  && await productTeam.getAttribute('role') === 'treeitem'
  && await productTeam.getAttribute('aria-level') === '1'
  && await productTeam.getAttribute('aria-expanded') === 'true',
{ role: await productTeam.getAttribute('role'), level: await productTeam.getAttribute('aria-level') });
await interactionPage.waitForTimeout(5250);
record('NTH-RV4-014-quiet-refresh-preserves-expansion', await productTeam.getAttribute('aria-expanded') === 'true'
  && await softwareTeam.getAttribute('aria-expanded') === 'true',
{ waitedMs: 5250 });
await interactionPage.close();

const responsiveEvidence = [];
for (const panelWidth of ['260', '320', '520']) {
  for (const fontSize of ['default', 'extra-large']) {
    const responsivePage = await newPage({ panelWidth, fontSize, treeState: 'selected' });
    const box = await responsivePage.locator('[data-test="app-left-panel-shell"]').boundingBox();
    const overflow = await responsivePage.locator('[data-test="app-left-panel-shell"]').evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    const disclosures = await responsivePage.locator('[data-test="workspace-team-member-disclosure"], [data-test="workspace-team-transient-disclosure"]').count();
    responsiveEvidence.push({ panelWidth, fontSize, actualWidth: Math.round(box?.width || 0), overflow, disclosures });
    await responsivePage.close();
  }
}
record('NTH-RV4-015-width-font-matrix', responsiveEvidence.every((item) => item.actualWidth === Number(item.panelWidth)
  && item.overflow.scrollWidth === item.overflow.clientWidth
  && item.disclosures >= 5),
{ responsiveEvidence });

const metadataPage = await newPage({ panelWidth: '260', fontSize: 'extra-large', metadata: 'on-demand', teamIdentity: 'icon', hierarchy: 'rails', treeState: 'selected' });
const selectedRow = metadataPage.locator('[data-test="workspace-team-execution-tree"] [aria-selected="true"]');
const beforeOpacity = await selectedRow.locator('.member-status').evaluate((element) => getComputedStyle(element).opacity);
await selectedRow.focus();
await metadataPage.waitForTimeout(180);
const afterOpacity = await selectedRow.locator('.member-status').evaluate((element) => getComputedStyle(element).opacity);
record('NTH-RV4-016-on-demand-metadata-discoverable', beforeOpacity === '0' && afterOpacity === '1',
{ beforeOpacity, afterOpacity });
await metadataPage.screenshot({ path: path.join(evidenceRoot, 'review-rails-on-focus-260-extra-large.png'), fullPage: true });
await metadataPage.close();

const proposalPage = await newPage({
  reviewView: 'proposal',
  hierarchy: 'hybrid',
  metadata: 'responsive',
  teamIdentity: 'icon',
  panelWidth: '320',
  fontSize: 'default',
  treeState: 'collapsed',
});
const proposalTree = proposalPage.locator('[data-test="workspace-team-execution-tree"]');
record('NTH-RV4-017-clean-final-candidate-visible',
  await proposalPage.locator('[data-test="nested-hierarchy-review-panel"]').count() === 0
    && await proposalPage.getByText('Recommended Workspace hierarchy', { exact: true }).count() === 0
    && await proposalPage.getByText('Compare options', { exact: true }).count() === 0
    && await proposalTree.getAttribute('data-hierarchy-treatment') === 'hybrid'
    && await proposalTree.getAttribute('data-metadata-treatment') === 'responsive'
    && await proposalTree.getAttribute('data-team-identity') === 'icon'
    && await proposalPage.locator('[data-test="workspace-team-execution-tree"] [role="treeitem"]').count() === 5,
  {
    url: proposalPage.url(),
    visibleRows: await proposalPage.locator('[data-test="workspace-team-execution-tree"] [role="treeitem"]').count(),
  });
await proposalPage.screenshot({ path: path.join(evidenceRoot, 'clean-final-candidate-320-default.png'), fullPage: true });
await proposalPage.close();

record('NTH-RV4-018-no-runtime-errors', runtimeErrors.length === 0, { runtimeErrors });

const output = {
  package: 'nested-team-hierarchy-ui',
  revision: 'RV-004',
  mode: 'Requirements Visualization — clean baseline-native final candidate',
  baseUrl,
  generatedAt: new Date().toISOString(),
  result: failures.length === 0 ? 'PASS' : 'FAIL',
  passed: checks.length - failures.length,
  total: checks.length,
  checks,
  failures,
};
await fs.writeFile(path.join(ticketRoot, 'browser-validation-rv-004.json'), `${JSON.stringify(output, null, 2)}\n`);
await browser.close();
console.log(JSON.stringify({ result: output.result, passed: output.passed, total: output.total, failures }, null, 2));
if (failures.length > 0) process.exitCode = 1;
