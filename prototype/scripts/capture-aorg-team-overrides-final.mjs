import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4198';
const ticketRoot = path.resolve(process.env.AORG_TEAM_OVERRIDES_TICKET_ROOT || 'tickets/in-progress/AORG-TEAM-OVERRIDES-001');
const visualRoot = path.join(ticketRoot, 'visual-references');
const validationRoot = path.join(ticketRoot, 'validation');
await fs.mkdir(visualRoot, { recursive: true });
await fs.mkdir(validationRoot, { recursive: true });

const cleanRoute = '/workspace?root=org&org=software-development-department&phase=config';
const cleanUrl = `${baseUrl}${cleanRoute}`;
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking'],
});
const errors = [];
const results = [];
const references = [];
const record = (id, pass, evidence = {}) => results.push({ id, pass: Boolean(pass), evidence });
const attachErrors = page => {
  page.on('pageerror', error => errors.push(`pageerror: ${error.stack || error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
};
const freshPage = async (viewport = { width: 1440, height: 900 }) => {
  const page = await browser.newPage({ viewport });
  attachErrors(page);
  await page.addInitScript(() => {
    localStorage.setItem('autobyteus.prototype.context', 'desktop');
    localStorage.setItem('autobyteus.app-left-panel.primary-nav-height', '240');
    localStorage.removeItem('autobyteus.prototype.scenario');
  });
  await page.goto(cleanUrl, { waitUntil: 'networkidle' });
  await page.locator('[data-test="agent-org-run-config"]').waitFor();
  return page;
};
const capture = async (page, id, fileName, state, viewport, requirements) => {
  const filePath = path.join(visualRoot, fileName);
  await page.screenshot({ path: filePath });
  references.push({ id, fileName, route: cleanRoute, state, viewport, requirements, illustrativeFixtureContent: true });
};
const teamSections = page => page.locator('[data-test="team-scope-config-editor"]');
const teamHeader = (page, index = 0) => teamSections(page).nth(index).locator('button[aria-expanded]').first();
const openOuter = async page => {
  const toggle = page.locator('[data-test="org-member-overrides-toggle"]');
  if (await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click();
};

const desktop = { width: 1440, height: 900 };
const initial = await freshPage(desktop);
const initialToggle = initial.locator('[data-test="org-member-overrides-toggle"]');
record('FINAL-AORG-OVERRIDES-001-clean-default-route',
  !new URL(initial.url()).searchParams.has('prototypeReview')
    && await initialToggle.getAttribute('aria-expanded') === 'false'
    && await initial.locator('[data-test="org-member-overrides-label"]').innerText() === 'Member overrides (7)',
  { url: initial.url(), expanded: await initialToggle.getAttribute('aria-expanded'), label: await initial.locator('[data-test="org-member-overrides-label"]').innerText() });
await capture(initial, 'VIS-OVR-001', 'VIS-OVR-001-member-overrides-collapsed-desktop-1440x900.png', 'Initial AgentOrg configuration; outer Member overrides collapsed', desktop, ['BEH-012', 'REQ-029', 'AC-024', 'ORG-CASE-059']);
await initial.close();

const collapsed = await freshPage(desktop);
await openOuter(collapsed);
const collapsedStates = await teamSections(collapsed).locator('button[aria-expanded]').evaluateAll(nodes => nodes.map(node => node.getAttribute('aria-expanded')));
record('FINAL-AORG-OVERRIDES-002-mounted-teams-collapsed',
  collapsedStates.join(',') === 'false,false'
    && await collapsed.locator('[data-test="org-direct-agent-overrides"] [data-test^="org-placement-"]').count() === 1,
  { collapsedStates });
await collapsed.locator('[data-test="agent-org-run-config"] > .overflow-y-auto').evaluate(node => { node.scrollTop = node.scrollHeight; });
await capture(collapsed, 'VIS-OVR-002', 'VIS-OVR-002-member-overrides-open-teams-collapsed-desktop-1440x900.png', 'Outer Member overrides open; every mounted Team independently collapsed', desktop, ['BEH-012', 'REQ-029', 'AC-024', 'ORG-CASE-059']);
await collapsed.close();

const expanded = await freshPage(desktop);
await openOuter(expanded);
const firstHeader = teamHeader(expanded, 0);
await firstHeader.click();
const expandedStates = await teamSections(expanded).locator('button[aria-expanded]').evaluateAll(nodes => nodes.map(node => node.getAttribute('aria-expanded')));
const firstTeam = teamSections(expanded).first();
const memberRows = firstTeam.locator('[data-test="member-override-item"]');
record('FINAL-AORG-OVERRIDES-003-one-team-expanded-inherited',
  expandedStates.join(',') === 'true,false'
    && (await firstHeader.innerText()).includes('Inherited')
    && await memberRows.count() === 2
    && (await memberRows.evaluateAll(nodes => nodes.map(node => node.innerText))).every(text => text.includes('Global default')),
  { expandedStates, header: await firstHeader.innerText(), memberCount: await memberRows.count() });
await firstHeader.scrollIntoViewIfNeeded();
await capture(expanded, 'VIS-OVR-003', 'VIS-OVR-003-team-expanded-inherited-desktop-1440x900.png', 'Product Design & Prototyping expanded; Team and exact Agents inherited; sibling Team collapsed', desktop, ['BEH-012', 'REQ-029', 'AC-024', 'ORG-CASE-060']);

const teamSwitch = firstTeam.getByRole('switch').first();
const firstAgentCheckbox = memberRows.first().locator('input[type="checkbox"]');
await teamSwitch.click();
await firstAgentCheckbox.click();
await firstHeader.click();
const collapsedAfterEdit = await firstHeader.getAttribute('aria-expanded');
await firstHeader.click();
const reopenedState = {
  expanded: await firstHeader.getAttribute('aria-expanded'),
  header: await firstHeader.innerText(),
  teamAutoApprove: await teamSwitch.getAttribute('aria-checked'),
  firstAgent: await memberRows.first().innerText(),
  secondAgent: await memberRows.nth(1).innerText(),
};
record('FINAL-AORG-OVERRIDES-004-selective-customization-persists',
  collapsedAfterEdit === 'false'
    && reopenedState.expanded === 'true'
    && reopenedState.header.includes('Customized')
    && reopenedState.teamAutoApprove === 'true'
    && reopenedState.firstAgent.includes('Overridden')
    && !reopenedState.secondAgent.includes('Overridden'),
  { collapsedAfterEdit, reopenedState });
await firstHeader.scrollIntoViewIfNeeded();
await capture(expanded, 'VIS-OVR-004', 'VIS-OVR-004-team-customized-reopened-desktop-1440x900.png', 'Team-level customization retained after collapse and reopen', desktop, ['BEH-012', 'REQ-029', 'AC-024', 'ORG-CASE-061']);
await memberRows.first().scrollIntoViewIfNeeded();
await capture(expanded, 'VIS-OVR-005', 'VIS-OVR-005-exact-agent-customized-desktop-1440x900.png', 'Exact Agent override shown independently inside customized Team placement', desktop, ['BEH-012', 'REQ-029', 'AC-024', 'ORG-CASE-061']);
await expanded.close();

const agentOnly = await freshPage(desktop);
await openOuter(agentOnly);
const agentOnlyHeader = teamHeader(agentOnly, 0);
await agentOnlyHeader.click();
const agentOnlyRow = teamSections(agentOnly).first().locator('[data-test="member-override-item"]').first();
await agentOnlyRow.locator('input[type="checkbox"]').click();
record('FINAL-AORG-OVERRIDES-005-agent-only-scope-isolation',
  (await agentOnlyHeader.innerText()).includes('Inherited')
    && (await agentOnlyRow.innerText()).includes('Overridden'),
  { teamHeader: await agentOnlyHeader.innerText(), agent: await agentOnlyRow.innerText() });
await agentOnly.close();

const narrowViewport = { width: 390, height: 844 };
const narrow = await freshPage(narrowViewport);
await openOuter(narrow);
const narrowGeometry = await narrow.evaluate(() => ({ innerWidth: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
record('FINAL-AORG-OVERRIDES-006-narrow-no-overflow',
  narrowGeometry.scrollWidth <= narrowGeometry.innerWidth
    && await teamSections(narrow).count() === 2,
  { narrowGeometry, teamCount: await teamSections(narrow).count() });
await narrow.locator('[data-test="agent-org-run-config"] > .overflow-y-auto').evaluate(node => { node.scrollTop = node.scrollHeight; });
await capture(narrow, 'VIS-OVR-006', 'VIS-OVR-006-member-overrides-narrow-390x844.png', 'Narrow AgentOrg Member overrides; no overlay or horizontal overflow', narrowViewport, ['QR-009', 'REQ-029', 'AC-024']);
await narrow.close();

await browser.close();
record('FINAL-AORG-OVERRIDES-007-zero-browser-errors', errors.length === 0, { errors });

const summary = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  cleanUrl,
  passed: results.filter(result => result.pass).length,
  total: results.length,
  errors,
  results,
};
const manifest = {
  ticket: 'AORG-TEAM-OVERRIDES-001',
  stablePackage: 'AORG-FLAT-TEAM-001',
  requirementsRevision: 'RER-022@b985df2ed66b4b2874dd9dae66cd256b6348a795',
  approvalReference: 'User message on 2026-09-02: “Okay, now I approve. Thanks, I confirm it\'s done.”',
  route: cleanRoute,
  references,
};
await fs.writeFile(path.join(visualRoot, 'visual-reference-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
await fs.writeFile(path.join(validationRoot, 'final-browser-validation.json'), `${JSON.stringify(summary, null, 2)}\n`);
await fs.writeFile(path.join(validationRoot, 'final-browser-validation.txt'), [
  'AgentOrg mounted-Team Member overrides final clean-route validation',
  `URL: ${cleanUrl}`,
  `Result: ${summary.passed}/${summary.total} passed`,
  ...results.map(result => `${result.pass ? 'PASS' : 'FAIL'} ${result.id}`),
  `Browser errors: ${errors.length}`,
].join('\n') + '\n');
console.log(JSON.stringify(summary, null, 2));
if (summary.passed !== summary.total) process.exitCode = 1;
