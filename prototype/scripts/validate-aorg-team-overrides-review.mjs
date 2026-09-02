import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4198';
const ticketRoot = path.resolve(process.env.AORG_TEAM_OVERRIDES_TICKET_ROOT || 'tickets/in-progress/AORG-TEAM-OVERRIDES-001');
const evidenceRoot = path.resolve(process.env.AORG_TEAM_OVERRIDES_EVIDENCE_ROOT || path.join(ticketRoot, 'review-evidence', 'rv-002'));
await fs.mkdir(evidenceRoot, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking'],
});

const results = [];
const runtimeErrors = [];
const record = (id, pass, evidence = {}) => results.push({ id, pass: Boolean(pass), evidence });
const reviewUrl = `${baseUrl}/workspace?root=org&org=software-development-department&phase=config&prototypeReview=aorg-team-overrides`;
const freshPage = async (viewport = { width: 1440, height: 900 }) => {
  const page = await browser.newPage({ viewport });
  page.on('pageerror', error => runtimeErrors.push(`pageerror: ${error.stack || error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
  });
  await page.addInitScript(() => {
    localStorage.setItem('autobyteus.prototype.scenario', 'workspace_agent_org_config');
    localStorage.setItem('autobyteus.prototype.context', 'desktop');
    localStorage.setItem('autobyteus.app-left-panel.primary-nav-height', '240');
  });
  await page.goto(reviewUrl, { waitUntil: 'networkidle' });
  await page.locator('[data-test="agent-org-run-config"]').waitFor();
  return page;
};
const teamSections = page => page.locator('[data-test="team-scope-config-editor"]');
const teamHeader = (page, index) => teamSections(page).nth(index).locator('button[aria-expanded]').first();
const openOuter = async page => {
  const toggle = page.locator('[data-test="org-member-overrides-toggle"]');
  if (await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click();
};
const expandTeam = async (page, index = 0) => {
  const header = teamHeader(page, index);
  if (await header.getAttribute('aria-expanded') !== 'true') await header.click();
  return header;
};

const initialPage = await freshPage();
const initialToggle = initialPage.locator('[data-test="org-member-overrides-toggle"]');
record('AORG-OVERRIDES-001-outer-collapsed-initially',
  await initialToggle.getAttribute('aria-expanded') === 'false'
    && await initialPage.locator('[data-test="org-member-overrides-panel"]').isHidden(),
  { outerExpanded: await initialToggle.getAttribute('aria-expanded') });
const outerDisclosureGeometry = await initialPage.evaluate(() => {
  const label = document.querySelector('[data-test="org-member-overrides-label"]')?.getBoundingClientRect();
  const chevron = document.querySelector('[data-test="org-member-overrides-chevron"]')?.getBoundingClientRect();
  return label && chevron
    ? { labelRight: label.right, chevronLeft: chevron.left, gap: chevron.left - label.right }
    : null;
});
record('AORG-OVERRIDES-002-chevron-adjacent-to-label',
  outerDisclosureGeometry !== null
    && outerDisclosureGeometry.gap >= 0
    && outerDisclosureGeometry.gap <= 8,
  { outerDisclosureGeometry });
await initialPage.screenshot({ path: path.join(evidenceRoot, 'RV2-001-initial-outer-collapsed-1440x900.png') });
await initialPage.close();

const collapsedPage = await freshPage();
await openOuter(collapsedPage);
const collapsedStates = await teamSections(collapsedPage).locator('button[aria-expanded]').evaluateAll(nodes => nodes.map(node => node.getAttribute('aria-expanded')));
const collapsedText = await teamSections(collapsedPage).evaluateAll(nodes => nodes.map(node => node.innerText));
record('AORG-OVERRIDES-003-all-mounted-teams-collapsed',
  collapsedStates.join(',') === 'false,false'
    && collapsedText[0].includes('Product Design & Prototyping')
    && collapsedText[0].includes('TEAM')
    && collapsedText[0].includes('/product_design_prototyping_team')
    && collapsedText[0].includes('Inherited')
    && collapsedText[1].includes('Software Engineering')
    && collapsedText[1].includes('/software_engineering_team')
    && collapsedText[1].includes('Inherited'),
  { collapsedStates, collapsedText });
record('AORG-OVERRIDES-004-direct-agent-preserved',
  await collapsedPage.locator('[data-test="org-direct-agent-overrides"] [data-test^="org-placement-"]').count() === 1,
  { directAgentRows: await collapsedPage.locator('[data-test="org-direct-agent-overrides"] [data-test^="org-placement-"]').count() });
await collapsedPage.locator('[data-test="agent-org-run-config"] > .overflow-y-auto').evaluate(node => { node.scrollTop = node.scrollHeight; });
await collapsedPage.screenshot({ path: path.join(evidenceRoot, 'RV2-002-outer-open-teams-collapsed-1440x900.png') });
await collapsedPage.close();

const expandedPage = await freshPage();
await openOuter(expandedPage);
const firstHeader = await expandTeam(expandedPage, 0);
const expandedStates = await teamSections(expandedPage).locator('button[aria-expanded]').evaluateAll(nodes => nodes.map(node => node.getAttribute('aria-expanded')));
const firstTeam = teamSections(expandedPage).first();
const memberRows = firstTeam.locator('[data-test="member-override-item"]');
const memberText = await memberRows.evaluateAll(nodes => nodes.map(node => node.innerText));
record('AORG-OVERRIDES-005-one-team-expanded-inherited',
  expandedStates.join(',') === 'true,false'
    && (await firstHeader.innerText()).includes('Inherited')
    && await memberRows.count() === 2
    && memberText.every(text => text.includes('Global default')),
  { expandedStates, teamHeader: await firstHeader.innerText(), memberText });
record('AORG-OVERRIDES-006-coordinator-secondary-identity',
  await firstTeam.getByText('Coordinator', { exact: true }).count() === 1,
  { coordinatorMarkers: await firstTeam.getByText('Coordinator', { exact: true }).count() });
await firstHeader.scrollIntoViewIfNeeded();
await expandedPage.screenshot({ path: path.join(evidenceRoot, 'RV2-003-team-expanded-inherited-1440x900.png') });

const teamSwitch = firstTeam.getByRole('switch').first();
const firstAgentCheckbox = memberRows.first().locator('input[type="checkbox"]');
await teamSwitch.click();
await firstAgentCheckbox.click();
const customizedBeforeCollapse = {
  teamHeader: await firstHeader.innerText(),
  teamAutoApprove: await teamSwitch.getAttribute('aria-checked'),
  firstAgent: await memberRows.first().innerText(),
  secondAgent: await memberRows.nth(1).innerText(),
};
await firstHeader.click();
const collapsedAfterDraft = await firstHeader.getAttribute('aria-expanded');
await firstHeader.click();
const customizedAfterReopen = {
  expanded: await firstHeader.getAttribute('aria-expanded'),
  teamHeader: await firstHeader.innerText(),
  teamAutoApprove: await teamSwitch.getAttribute('aria-checked'),
  firstAgent: await memberRows.first().innerText(),
  secondAgent: await memberRows.nth(1).innerText(),
};
record('AORG-OVERRIDES-007-team-and-agent-scope-local-customization',
  customizedBeforeCollapse.teamHeader.includes('Customized')
    && customizedBeforeCollapse.teamAutoApprove === 'true'
    && customizedBeforeCollapse.firstAgent.includes('Overridden')
    && !customizedBeforeCollapse.secondAgent.includes('Overridden'),
  customizedBeforeCollapse);
record('AORG-OVERRIDES-008-collapse-reopen-preserves-valid-draft',
  collapsedAfterDraft === 'false'
    && customizedAfterReopen.expanded === 'true'
    && customizedAfterReopen.teamHeader.includes('Customized')
    && customizedAfterReopen.teamAutoApprove === 'true'
    && customizedAfterReopen.firstAgent.includes('Overridden'),
  { collapsedAfterDraft, customizedAfterReopen });
await firstHeader.scrollIntoViewIfNeeded();
await expandedPage.screenshot({ path: path.join(evidenceRoot, 'RV2-004-team-agent-customized-reopened-1440x900.png') });
await expandedPage.close();

const agentOnlyPage = await freshPage();
await openOuter(agentOnlyPage);
const agentOnlyHeader = await expandTeam(agentOnlyPage, 0);
const agentOnlyMember = teamSections(agentOnlyPage).first().locator('[data-test="member-override-item"]').first();
await agentOnlyMember.locator('input[type="checkbox"]').click();
record('AORG-OVERRIDES-009-agent-only-does-not-customize-team',
  (await agentOnlyHeader.innerText()).includes('Inherited')
    && (await agentOnlyMember.innerText()).includes('Overridden'),
  { teamHeader: await agentOnlyHeader.innerText(), agentRow: await agentOnlyMember.innerText() });
await agentOnlyPage.close();

const narrowPage = await freshPage({ width: 390, height: 844 });
await openOuter(narrowPage);
const narrowHeaders = teamSections(narrowPage).locator('button[aria-expanded]');
const narrowGeometry = await narrowPage.evaluate(() => ({
  innerWidth: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
}));
record('AORG-OVERRIDES-010-responsive-no-overlay-or-horizontal-overflow',
  await narrowHeaders.count() === 2
    && narrowGeometry.scrollWidth <= narrowGeometry.innerWidth,
  { teamHeaders: await narrowHeaders.count(), narrowGeometry });
await narrowPage.locator('[data-test="agent-org-run-config"] > .overflow-y-auto').evaluate(node => { node.scrollTop = node.scrollHeight; });
await narrowPage.screenshot({ path: path.join(evidenceRoot, 'RV2-005-outer-open-teams-collapsed-narrow-390x844.png') });
await narrowPage.close();

const teamPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
teamPage.on('pageerror', error => runtimeErrors.push(`pageerror: ${error.stack || error.message}`));
teamPage.on('console', message => {
  if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
});
await teamPage.addInitScript(() => {
  localStorage.setItem('autobyteus.prototype.scenario', 'workspace_team_launch_refresh');
  localStorage.setItem('autobyteus.prototype.context', 'desktop');
  localStorage.setItem('autobyteus.app-left-panel.primary-nav-height', '240');
});
await teamPage.goto(`${baseUrl}/workspace`, { waitUntil: 'networkidle' });
const teamForm = teamPage.locator('[data-test="team-run-config-form"]');
await teamForm.waitFor();
const teamMemberToggle = teamPage.locator('[data-test="team-member-overrides-toggle"]');
record('AORG-OVERRIDES-011-agentteam-launch-baseline-preserved',
  await teamForm.getAttribute('data-mode') === 'editable'
    && await teamMemberToggle.getAttribute('aria-expanded') === 'false'
    && (await teamForm.innerText()).includes('Team Members Override (2)'),
  {
    mode: await teamForm.getAttribute('data-mode'),
    memberOverridesExpanded: await teamMemberToggle.getAttribute('aria-expanded'),
  });
await teamPage.close();

await browser.close();
record('AORG-OVERRIDES-012-zero-browser-errors', runtimeErrors.length === 0, { runtimeErrors });

const summary = {
  baseUrl,
  reviewUrl,
  generatedAt: new Date().toISOString(),
  passed: results.filter(result => result.pass).length,
  total: results.length,
  runtimeErrors,
  results,
};
await fs.writeFile(path.join(evidenceRoot, 'browser-validation.json'), `${JSON.stringify(summary, null, 2)}\n`);
await fs.writeFile(path.join(evidenceRoot, 'browser-validation.txt'), [
  `AgentOrg mounted-Team Member overrides review validation`,
  `URL: ${reviewUrl}`,
  `Result: ${summary.passed}/${summary.total} passed`,
  ...results.map(result => `${result.pass ? 'PASS' : 'FAIL'} ${result.id}`),
  `Browser errors: ${runtimeErrors.length}`,
].join('\n') + '\n');
console.log(JSON.stringify(summary, null, 2));
if (summary.passed !== summary.total) process.exitCode = 1;
