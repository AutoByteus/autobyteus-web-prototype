import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4194';
const ticketRoot = path.resolve('tickets/in-progress/AORG-FLAT-TEAM-001');
const evidenceRoot = path.join(ticketRoot, 'review-evidence', 'rv-012');
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
  page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.stack || error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
  });
  await page.addInitScript(() => {
    localStorage.setItem('autobyteus.prototype.scenario', 'populated');
    localStorage.setItem('autobyteus.prototype.context', 'desktop');
    localStorage.setItem('autobyteus.app-left-panel.primary-nav-height', '220');
  });
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(800);
  return page;
};

const capture = async (page, id, filename, state) => {
  const outputPath = path.join(evidenceRoot, filename);
  await page.screenshot({ path: outputPath, fullPage: false });
  captures.push({ id, filename, state, url: page.url(), viewport: page.viewportSize() });
};

const teamList = await openPage(`/agent-teams?${query({ view: 'team-list' })}`);
record('AORG-RV12-001-team-catalog',
  await teamList.getByRole('heading', { name: 'Agent Teams', exact: true }).count() === 1
    && await teamList.locator('h1.sr-only').filter({ hasText: 'Agent Teams' }).count() === 1
    && await teamList.locator('[data-test^="team-card-"]').count() === 3
    && await teamList.getByRole('button', { name: 'Create Team', exact: true }).count() === 1,
  { visiblePageTitle: false, accessiblePageHeading: true, cards: await teamList.locator('[data-test^="team-card-"]').count() });
record('AORG-RV12-002-separated-primary-navigation',
  await teamList.getByRole('button', { name: 'Agent Teams', exact: true }).count() === 1
    && await teamList.getByRole('button', { name: 'Agent Orgs', exact: true }).count() === 1,
  { navigation: ['Agent Teams', 'Agent Orgs'] });
record('AORG-RV12-003-team-catalog-preserves-baseline-visual-language',
  await teamList.getByPlaceholder('Search teams by name').count() === 1
    && await teamList.getByRole('button', { name: 'Reload', exact: true }).count() === 1
    && await teamList.getByRole('heading', { name: 'Featured teams', exact: true }).count() === 1
    && await teamList.getByRole('heading', { name: 'All teams', exact: true }).count() === 1
    && await teamList.getByText('Reusable collaboration units', { exact: true }).count() === 0
    && await teamList.getByText('Agent Team', { exact: true }).count() === 0
    && await teamList.getByText('Reusable', { exact: true }).count() === 0
    && await teamList.getByText('Agent members only', { exact: true }).count() === 0
    && await teamList.getByText('Each Team contains direct Agents and has one coordinator.', { exact: true }).count() === 0
    && await teamList.getByText('Nested Teams', { exact: true }).count() === 0
    && await teamList.locator('[data-test="agent-org-run-history"]').count() === 0,
  { preservedBaselineElements: ['search', 'reload', 'create', 'featured', 'all', 'initials', 'category', 'member chips', 'right actions'], redundantTypeLabels: 0, nestedTeamMetric: 0 });
const reloadButton = teamList.getByRole('button', { name: 'Reload', exact: true });
await reloadButton.click();
record('AORG-RV12-021-baseline-reload-feedback',
  await teamList.getByRole('button', { name: 'Reloading…', exact: true }).isDisabled(),
  { immediateFeedback: 'Reloading…', disabledDuringReload: true });
await teamList.waitForTimeout(500);
const teamSearch = teamList.getByPlaceholder('Search teams by name');
await teamSearch.fill('Release');
record('AORG-RV12-022-baseline-search-behavior',
  await teamList.locator('[data-test^="team-card-"]').count() === 1
    && await teamList.getByRole('heading', { name: 'Featured teams', exact: true }).count() === 0
    && await teamList.getByRole('heading', { name: 'All teams', exact: true }).count() === 0,
  { query: 'Release', matchingCards: 1 });
await teamSearch.fill('');
await capture(teamList, 'REV-AORG-RV12-001', 'REV-AORG-RV12-001-agent-team-catalog.png', 'Baseline-native flat Agent Team catalog; only obsolete nesting semantics are removed');
await teamList.close();

const teamCreate = await openPage(`/agent-teams?${query({ view: 'team-create' })}`);
const productLibraryItem = teamCreate.locator('[data-test="team-library-agent-product-prototyper"]');
const teamCanvasDropTarget = teamCreate.locator('[data-test="team-canvas-drop-target"]');
record('AORG-RV12-004-team-authoring-agent-only',
  await teamCreate.getByRole('heading', { name: 'Create Agent Team' }).count() === 1
    && await teamCreate.getByRole('heading', { name: 'Agent Library', exact: true }).count() === 1
    && await teamCreate.getByRole('heading', { name: 'Team Canvas', exact: true }).count() === 1
    && await teamCreate.getByRole('heading', { name: 'Member Details', exact: true }).count() === 1
    && await teamCreate.getByRole('heading', { name: 'Handoffs', exact: true }).count() === 1
    && await teamCreate.getByText('Team-local handoffs', { exact: true }).count() === 0
    && await teamCreate.getByText('MY TEAMS', { exact: true }).count() === 0
    && await teamCreate.getByText('Agent & Team Library', { exact: true }).count() === 0
    && await teamCreate.getByRole('button', { name: 'Add Team', exact: true }).count() === 0,
  { preservedBaselineStructure: ['Basics', 'Library', 'Canvas', 'Member Details', 'LLM config'], intentionalDelta: 'Agent-only library', teamLibrary: 0, addTeam: 0 });
record('AORG-RV12-045-team-builder-preserves-real-drag-source-and-drop-target',
  await productLibraryItem.getAttribute('draggable') === 'true'
    && await teamCanvasDropTarget.count() === 1
    && await teamCreate.locator('[data-test^="team-canvas-member-"]').count() === 0
    && await teamCreate.getByText('Select a member in Team Canvas to edit details.', { exact: true }).count() === 1,
  { dragSource: 'product_prototyper', initialCanvasMembers: 0, emptyMemberDetails: true });
await productLibraryItem.dragTo(teamCanvasDropTarget);
await teamCreate.getByRole('button', { name: 'Add prototype_bootstrapper', exact: true }).click();
const coordinatorSwitches = teamCreate.locator('[data-test="team-canvas"] [role="switch"]');
record('AORG-RV12-005-exactly-one-team-coordinator',
  await coordinatorSwitches.count() === 2
    && await coordinatorSwitches.evaluateAll((switches) => switches.filter((element) => element.getAttribute('aria-checked') === 'true').length === 1),
  { switches: await coordinatorSwitches.count(), checked: await coordinatorSwitches.evaluateAll((switches) => switches.filter((element) => element.getAttribute('aria-checked') === 'true').length) });
const memberDetails = teamCreate.locator('[data-test="member-details"]');
record('AORG-RV12-046-selected-canvas-member-has-real-editable-details',
  await teamCreate.locator('[data-test^="team-canvas-member-"]').count() === 2
    && await memberDetails.locator('[data-test="member-name-input"]').inputValue() === 'prototype_bootstrapper'
    && await memberDetails.getByText('Type', { exact: true }).count() === 1
    && await memberDetails.getByText('Agent', { exact: true }).count() === 1
    && await memberDetails.getByText('Source', { exact: true }).count() === 1
    && await memberDetails.getByText('prototype_bootstrapper', { exact: true }).count() === 1
    && await memberDetails.getByText('Scope', { exact: true }).count() === 1
    && await memberDetails.getByText('Shared', { exact: true }).count() === 1
    && await memberDetails.getByText('Coordinator', { exact: true }).count() === 1,
  { selectedMember: 'prototype_bootstrapper', fields: ['Member Name', 'Type', 'Source', 'Scope', 'Coordinator'] });
await memberDetails.locator('[data-test="member-name-input"]').fill('baseline_specialist');
await memberDetails.getByRole('switch', { name: 'Toggle coordinator for selected member baseline_specialist', exact: true }).click();
await teamCreate.waitForTimeout(200);
record('AORG-RV12-047-member-name-and-coordinator-edit-update-the-canvas',
  await teamCreate.locator('[data-test="team-canvas"]').getByText('baseline_specialist', { exact: true }).count() === 1
    && await coordinatorSwitches.evaluateAll((switches) => switches.filter((element) => element.getAttribute('aria-checked') === 'true').length === 1)
    && await memberDetails.getByText('Enabled', { exact: true }).count() === 1,
  { renamedMember: 'baseline_specialist', selectedCoordinator: true });
await capture(teamCreate, 'REV-AORG-RV12-002', 'REV-AORG-RV12-002-agent-team-authoring.png', 'Source-native drag-and-drop Agent-only Team builder with editable selected-member details');
await teamCreate.close();

const teamDetail = await openPage(`/agent-teams?${query({ view: 'team-detail', id: 'product-design-prototyping-team' })}`);
record('AORG-RV12-023-team-detail-preserves-baseline-card-hierarchy',
  await teamDetail.getByRole('heading', { name: 'Product Design & Prototyping', exact: true }).count() === 1
    && await teamDetail.getByRole('heading', { name: 'Description', exact: true }).count() === 1
    && await teamDetail.getByRole('heading', { name: 'Instructions', exact: true }).count() === 1
    && await teamDetail.getByText('Coordinate product experience work through product_prototyper and use the Team handoffs for specialist baseline work.', { exact: true }).count() === 1
    && await teamDetail.getByRole('heading', { name: 'Handoffs', exact: true }).count() === 1
    && await teamDetail.getByText('Team-local handoffs', { exact: true }).count() === 0
    && await teamDetail.getByRole('heading', { name: 'Members (2)', exact: true }).count() === 1
    && await teamDetail.locator('[data-test^="team-member-view-"]').count() === 2
    && await teamDetail.getByRole('button', { name: 'Run', exact: true }).count() === 1
    && await teamDetail.getByRole('button', { name: 'Edit', exact: true }).count() === 1,
  { baselineCards: ['header', 'description', 'instructions', 'handoffs', 'members'], actions: ['Run', 'Edit', 'member View'] });
record('AORG-RV12-024-team-detail-keeps-flat-semantics-without-cross-surface-chrome',
  await teamDetail.getByText('2 Agents', { exact: true }).count() === 1
    && await teamDetail.getByText('Nested Teams', { exact: true }).count() === 0
    && await teamDetail.getByText('Standalone & reusable', { exact: true }).count() === 0
    && await teamDetail.getByText('Agent Team', { exact: true }).count() === 0
    && await teamDetail.getByRole('heading', { name: 'Used by Agent Orgs', exact: true }).count() === 0
    && await teamDetail.getByRole('button', { name: 'View Agent Orgs', exact: false }).count() === 0,
  { nestedTeamUI: 0, redundantTypeBadges: 0, crossSurfacePromotion: 0 });
await capture(teamDetail, 'REV-AORG-RV12-018', 'REV-AORG-RV12-018-agent-team-detail.png', 'Baseline-native flat Team detail with members, coordinator, and handoffs');
const teamHandoffManager = teamDetail.locator('[data-test="handoff-manager-team"]');
await teamHandoffManager.evaluate((element) => element.scrollIntoView({ block: 'start' }));
record('AORG-RV12-031-team-handoff-detail-is-explicit-and-clean',
  await teamHandoffManager.locator('[data-test^="handoff-card-"]').count() === 2
    && await teamHandoffManager.getByText('/product_prototyper', { exact: true }).count() >= 1
    && await teamHandoffManager.getByText('/prototype_bootstrapper', { exact: true }).count() >= 1
    && await teamHandoffManager.getByText('From', { exact: true }).count() === 2
    && await teamHandoffManager.getByText('To', { exact: true }).count() === 2
    && await teamHandoffManager.getByText('When', { exact: true }).count() === 2
    && await teamHandoffManager.getByText(/\d+ handoffs? · \d+ When/i).count() === 0
    && await teamHandoffManager.getByText('Handoff', { exact: true }).count() === 0
    && await teamHandoffManager.getByText('Agent → coordinator', { exact: true }).count() === 0,
  { endpointFields: ['From', 'To', 'When'], countsInHeader: 0, genericSummaries: 0, scope: 'Team-local direct Agents only' });
await capture(teamDetail, 'REV-AORG-RV12-012', 'REV-AORG-RV12-012-team-local-handoff-detail.png', 'Clean Team-local From, To, and When handoff detail');
await teamDetail.getByRole('heading', { name: 'Members (2)', exact: true }).evaluate(element => element.scrollIntoView({ block: 'start' }));
await teamDetail.waitForTimeout(200);
await capture(teamDetail, 'REV-AORG-RV12-019', 'REV-AORG-RV12-019-agent-team-members.png', 'Preserved Team member cards with direct Agent detail actions');
await teamDetail.getByRole('button', { name: 'Open agent details for product_prototyper', exact: true }).click();
await teamDetail.waitForURL(/\/agents\?/);
record('AORG-RV12-025-team-member-opens-preserved-agent-detail',
  new URL(teamDetail.url()).searchParams.get('id') === 'product-prototyper'
    && new URL(teamDetail.url()).searchParams.get('returnToTeam') === 'product-design-prototyping-team'
    && new URL(teamDetail.url()).searchParams.get('prototypeReview') === 'agent-org-flat'
    && await teamDetail.getByRole('heading', { name: 'product_prototyper', exact: true }).count() === 1
    && await teamDetail.getByRole('heading', { name: 'Instructions', exact: true }).count() === 1
    && await teamDetail.getByText('Evolve accepted product experiences, coordinate focused prototype work, and return precise review evidence.', { exact: true }).count() === 1
    && await teamDetail.getByRole('button', { name: 'Back to team', exact: true }).count() === 1,
  { member: 'product_prototyper', detailSurface: 'accepted Agent detail', returnToTeam: 'product-design-prototyping-team' });
await capture(teamDetail, 'REV-AORG-RV12-011', 'REV-AORG-RV12-011-agent-member-detail.png', 'Preserved Agent detail reached from a Team member');
await teamDetail.getByRole('button', { name: 'Back to team', exact: true }).click();
await teamDetail.waitForURL(/\/agent-teams\?/);
record('AORG-RV12-026-agent-detail-returns-to-future-team-context',
  new URL(teamDetail.url()).searchParams.get('id') === 'product-design-prototyping-team'
    && new URL(teamDetail.url()).searchParams.get('view') === 'team-detail'
    && new URL(teamDetail.url()).searchParams.get('prototypeReview') === 'agent-org-flat'
    && await teamDetail.locator('[data-test="flat-agent-team-experience"]').count() === 1
    && await teamDetail.getByRole('heading', { name: 'Product Design & Prototyping', exact: true }).count() === 1,
  { returnedTo: 'future-state Team detail', prototypeReviewPreserved: true });
await teamDetail.close();

const narrowTeamDetail = await openPage(`/agent-teams?${query({ view: 'team-detail', id: 'product-design-prototyping-team' })}`, { width: 390, height: 844 });
const narrowTeamOverflow = await narrowTeamDetail.evaluate(() => ({ viewport: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
record('AORG-RV12-027-team-detail-narrow-preservation',
  narrowTeamOverflow.scrollWidth === narrowTeamOverflow.viewport
    && await narrowTeamDetail.getByRole('heading', { name: 'Instructions', exact: true }).count() === 1
    && await narrowTeamDetail.locator('[data-test^="team-member-view-"]').count() === 2,
  { overflow: narrowTeamOverflow, preserved: ['Instructions', 'member detail actions'] });
await narrowTeamDetail.close();

const narrowTeamCreate = await openPage(`/agent-teams?${query({ view: 'team-create' })}`, { width: 390, height: 844 });
await narrowTeamCreate.getByRole('button', { name: 'Add product_prototyper', exact: true }).click();
const narrowTeamCreateOverflow = await narrowTeamCreate.evaluate(() => ({ viewport: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
record('AORG-RV12-048-team-builder-preserves-click-fallback-and-narrow-layout',
  narrowTeamCreateOverflow.scrollWidth === narrowTeamCreateOverflow.viewport
    && await narrowTeamCreate.locator('[data-test^="team-canvas-member-"]').count() === 1
    && await narrowTeamCreate.locator('[data-test="member-name-input"]').inputValue() === 'product_prototyper',
  { overflow: narrowTeamCreateOverflow, clickFallback: true, selectedMemberDetails: true });
await capture(narrowTeamCreate, 'REV-AORG-RV12-016', 'REV-AORG-RV12-016-agent-team-builder-narrow.png', 'Narrow Team builder with click fallback and selected-member details');
await narrowTeamCreate.close();

const teamEdit = await openPage(`/agent-teams?${query({ view: 'team-edit', id: 'product-design-prototyping-team' })}`);
const teamEditManager = teamEdit.locator('[data-test="handoff-manager-team"]');
await teamEditManager.getByRole('button', { name: 'Edit', exact: true }).first().click();
record('AORG-RV12-032-team-local-editor-limits-endpoints-to-direct-agents',
  await teamEditManager.locator('select[data-test="handoff-from"] option').count() === 3
    && await teamEditManager.locator('select[data-test="handoff-to"] option').count() === 3
    && await teamEditManager.locator('optgroup[label="Team Agents"]').count() === 2
    && await teamEditManager.locator('optgroup[label="Teams"]').count() === 0,
  { fromChoices: ['product_prototyper', 'prototype_bootstrapper'], toChoices: ['product_prototyper', 'prototype_bootstrapper'], teamDestinations: 0 });
await capture(teamEdit, 'REV-AORG-RV12-013', 'REV-AORG-RV12-013-team-local-handoff-authoring.png', 'Team-local handoff editor with direct Agent endpoints only');
await teamEditManager.locator('[data-test="cancel-handoff-draft"]').click();
await teamEdit.getByRole('button', { name: 'Remove prototype_bootstrapper', exact: true }).click();
await teamEdit.getByRole('button', { name: 'Save Changes', exact: true }).click();
record('AORG-RV12-033-team-member-impact-blocks-atomic-save',
  await teamEditManager.locator('[data-test="handoff-validation-summary"]').count() === 1
    && await teamEdit.getByText('Resolve the highlighted handoffs before saving this Team.', { exact: true }).count() === 1
    && await teamEditManager.getByText('Unavailable · /prototype_bootstrapper', { exact: true }).count() >= 1,
  { removedMember: 'prototype_bootstrapper', silentRetarget: false, saveBlocked: true });
await teamEdit.close();

const orgList = await openPage(`/agent-orgs?${query({ view: 'org-list' })}`);
record('AORG-RV12-006-org-catalog',
  await orgList.getByRole('heading', { name: 'Agent Orgs', exact: true }).count() === 1
    && await orgList.locator('h1.sr-only').filter({ hasText: 'Agent Orgs' }).count() === 1
    && await orgList.locator('[data-test^="org-card-"]').count() === 2
    && await orgList.getByRole('button', { name: 'Create Agent Org', exact: true }).count() === 1
    && (await orgList.locator('[data-test="create-org"]').getAttribute('class'))?.includes('bg-blue-600')
    && await orgList.getByText('Fixed-depth collaboration roots', { exact: true }).count() === 0
    && await orgList.getByText('Agent Org', { exact: true }).count() === 0
    && await orgList.getByText('No coordinator', { exact: true }).count() === 0
    && await orgList.getByText('Department', { exact: true }).count() === 0
    && await orgList.getByText('Program', { exact: true }).count() === 0,
  { visiblePageTitle: false, accessiblePageHeading: true, cards: await orgList.locator('[data-test^="org-card-"]').count(), primaryAction: 'blue' });
record('AORG-RV12-007-org-direct-composition',
  await orgList.getByText('requirements_engineer', { exact: true }).count() >= 1
    && await orgList.getByText('Product Design & Prototyping', { exact: true }).count() >= 1
    && await orgList.locator('[data-test^="org-member-"]').count() === 6
    && await orgList.getByText('Direct composition', { exact: true }).count() === 0
    && await orgList.getByText('1 level', { exact: true }).count() === 0
    && await orgList.getByRole('heading', { name: 'Featured organizations', exact: true }).count() === 1,
  { directKinds: ['agent', 'team'], explicitTypeSuffixes: 0, explanatoryCompositionChrome: 0 });
const orgReloadButton = orgList.getByRole('button', { name: 'Reload', exact: true });
await orgReloadButton.click();
record('AORG-RV12-028-org-reload-feedback',
  await orgList.getByRole('button', { name: 'Reloading…', exact: true }).isDisabled(),
  { immediateFeedback: 'Reloading…', disabledDuringReload: true });
await orgList.waitForTimeout(500);
const orgSearch = orgList.getByPlaceholder('Search organizations by name');
await orgSearch.fill('Release');
record('AORG-RV12-029-org-search-behavior',
  await orgList.locator('[data-test^="org-card-"]').count() === 1
    && await orgList.getByRole('heading', { name: 'Featured organizations', exact: true }).count() === 0,
  { query: 'Release', matchingCards: 1 });
await orgSearch.fill('');
await capture(orgList, 'REV-AORG-RV12-003', 'REV-AORG-RV12-003-agent-org-catalog.png', 'Baseline-native Agent Org catalog with direct Agent and Team members');
await orgList.close();

const narrowOrgList = await openPage(`/agent-orgs?${query({ view: 'org-list' })}`, { width: 390, height: 844 });
const narrowOrgListOverflow = await narrowOrgList.evaluate(() => ({ viewport: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
record('AORG-RV12-030-org-catalog-narrow-layout',
  narrowOrgListOverflow.scrollWidth === narrowOrgListOverflow.viewport
    && await narrowOrgList.locator('[data-test^="org-card-"]').count() === 2
    && await narrowOrgList.getByRole('button', { name: 'Create Agent Org', exact: true }).count() === 1,
  { overflow: narrowOrgListOverflow, cards: 2 });
await narrowOrgList.close();

const orgCreate = await openPage(`/agent-orgs?${query({ view: 'org-create' })}`);
record('AORG-RV12-008-org-authoring-membership',
  await orgCreate.getByRole('heading', { name: 'Create Agent Org' }).count() === 1
    && await orgCreate.getByRole('button', { name: 'Add member', exact: true }).count() === 1
    && await orgCreate.getByRole('button', { name: 'Add Agent', exact: true }).count() === 0
    && await orgCreate.getByRole('button', { name: 'Add Team', exact: true }).count() === 0
    && await orgCreate.locator('[data-test="org-member-picker"]').count() === 0
    && await orgCreate.locator('[data-test="handoff-manager-org"]').count() === 1
    && await orgCreate.locator('[data-test="handoff-empty-state"]').count() === 1
    && await orgCreate.getByRole('button', { name: 'Add handoff', exact: true }).count() === 1
    && await orgCreate.getByRole('button', { name: 'Add rule', exact: true }).count() === 0
    && await orgCreate.getByLabel('Name', { exact: true }).inputValue() === ''
    && await orgCreate.getByLabel('Description', { exact: true }).inputValue() === ''
    && await orgCreate.getByLabel('Category', { exact: true }).count() === 0,
  { memberPicker: 'single inline responsive chooser', initialMembers: 0, initialFields: 'blank name and description', category: 0, handoffEmptyState: true, genericRuleUI: 0 });
await orgCreate.getByRole('button', { name: 'Add member', exact: true }).click();
record('AORG-RV12-049-org-inline-member-picker',
  await orgCreate.locator('[data-test="org-member-picker"]').count() === 1
    && await orgCreate.getByRole('tab', { name: 'Agents', exact: true }).count() === 1
    && await orgCreate.getByRole('tab', { name: 'Teams', exact: true }).count() === 1
    && await orgCreate.locator('[role="dialog"]').count() === 0
    && await orgCreate.locator('[data-test="member-picker-agents"]').count() === 1,
  { surface: 'in-flow section', overlay: false, memberKinds: ['Agents', 'Teams'] });
await orgCreate.getByRole('button', { name: 'Add requirements_engineer', exact: true }).click();
await orgCreate.getByRole('tab', { name: 'Teams', exact: true }).click();
await orgCreate.getByRole('button', { name: 'Add Product Design & Prototyping', exact: true }).click();
record('AORG-RV12-050-org-inline-member-picker-adds-both-member-kinds',
  await orgCreate.getByRole('button', { name: 'Product Design & Prototyping added', exact: true }).isDisabled()
    && await orgCreate.getByText('requirements_engineer', { exact: true }).count() >= 1
    && await orgCreate.getByText('Product Design & Prototyping', { exact: true }).count() >= 1,
  { added: ['direct Agent', 'referenced Team'] });
record('AORG-RV12-009-org-has-no-coordinator-control',
  await orgCreate.locator('input[type="radio"]').count() === 0
    && await orgCreate.getByText(/No (Org|Organization) coordinator/i).count() === 0
    && await orgCreate.getByRole('heading', { name: 'What makes this an Org?', exact: true }).count() === 0,
  { coordinatorControls: 0, explanatoryCoordinatorChrome: 0 });
await capture(orgCreate, 'REV-AORG-RV12-004', 'REV-AORG-RV12-004-agent-org-authoring.png', 'Agent Org authoring with independent Agents and referenced Teams');
await orgCreate.close();

const narrowOrgCreate = await openPage(`/agent-orgs?${query({ view: 'org-create' })}`, { width: 390, height: 844 });
await narrowOrgCreate.getByRole('button', { name: 'Add member', exact: true }).click();
const narrowOrgCreateOverflow = await narrowOrgCreate.evaluate(() => ({ viewport: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
record('AORG-RV12-053-org-inline-member-picker-narrow-layout',
  narrowOrgCreateOverflow.scrollWidth === narrowOrgCreateOverflow.viewport
    && await narrowOrgCreate.locator('[data-test="org-member-picker"]').count() === 1
    && await narrowOrgCreate.locator('[role="dialog"]').count() === 0
    && await narrowOrgCreate.getByRole('tab', { name: 'Agents', exact: true }).count() === 1
    && await narrowOrgCreate.getByRole('tab', { name: 'Teams', exact: true }).count() === 1,
  { overflow: narrowOrgCreateOverflow, overlay: false });
await capture(narrowOrgCreate, 'REV-AORG-RV12-020', 'REV-AORG-RV12-020-agent-org-inline-member-picker-narrow.png', 'Narrow in-flow member picker without an overlay');
await narrowOrgCreate.close();

const orgDetail = await openPage(`/agent-orgs?${query({ view: 'org-detail', id: 'software-development-department' })}`);
record('AORG-RV12-010-team-reference-preservation',
  await orgDetail.getByText('Same Team definition · standalone history preserved', { exact: true }).count() === 0
    && await orgDetail.getByText(/No (Org|Organization) coordinator/i).count() === 0
    && await orgDetail.getByRole('heading', { name: 'Members', exact: true }).count() === 1
    && await orgDetail.getByText('Coordinator: product_prototyper', { exact: true }).count() === 1
    && await orgDetail.getByText('Coordinator: architecture_designer', { exact: true }).count() === 1
    && await orgDetail.getByRole('heading', { name: 'Handoffs', exact: true }).count() === 1
    && await orgDetail.getByText('Department', { exact: true }).count() === 0
    && await orgDetail.getByText('Program', { exact: true }).count() === 0,
  { referencedTeams: 2, redundantSameDefinitionCopy: 0, explanatoryCoordinatorChrome: 0 });
const orgDescription = orgDetail.getByRole('heading', { name: 'Description', exact: true }).locator('..');
record('AORG-RV12-034-org-description-contains-no-invented-summary-data',
  await orgDescription.getByText('Agents', { exact: true }).count() === 0
    && await orgDescription.getByText('Teams', { exact: true }).count() === 0
    && await orgDescription.getByText('Handoffs', { exact: true }).count() === 0
    && await orgDescription.getByText('Last run', { exact: true }).count() === 0
    && await orgDetail.getByText(/^Runs:/).count() === 0,
  { removedSummaryFields: ['Agents', 'Teams', 'Handoffs', 'Last run', 'Runs'] });
await capture(orgDetail, 'REV-AORG-RV12-005', 'REV-AORG-RV12-005-agent-org-detail.png', 'Baseline-native Org detail with Agent and same-identity Team members');
const orgDetailHandoffManager = orgDetail.locator('[data-test="handoff-manager-org"]');
await orgDetailHandoffManager.evaluate((element) => element.scrollIntoView({ block: 'start' }));
record('AORG-RV12-035-org-handoff-detail-is-explicit-and-clean',
  await orgDetailHandoffManager.locator('[data-test^="handoff-card-"]').count() === 2
    && await orgDetailHandoffManager.getByText('From', { exact: true }).count() === 2
    && await orgDetailHandoffManager.getByText('To', { exact: true }).count() === 2
    && await orgDetailHandoffManager.getByText('When', { exact: true }).count() === 2
    && await orgDetailHandoffManager.getByText('/requirements_engineer', { exact: true }).count() === 1
    && await orgDetailHandoffManager.getByText('/product_design_prototyping_team', { exact: true }).count() === 1
    && await orgDetailHandoffManager.getByText(/Via coordinator/i).count() === 0
    && await orgDetailHandoffManager.getByText(/\d+ handoffs?|\d+ conditions?/i).count() === 0
    && await orgDetailHandoffManager.getByText('Handoff', { exact: true }).count() === 0,
  { endpointFields: ['From', 'To', 'When'], visibleCoordinatorDeliveryBlock: 0, countChrome: 0 });
const orgDetailVisibleOrdinals = await orgDetailHandoffManager.evaluate((element) => [...element.querySelectorAll('*')]
  .filter((node) => node.children.length === 0 && /^(1|2)$/.test((node.textContent || '').trim()))
  .filter((node) => { const style = getComputedStyle(node); return style.display !== 'none' && style.visibility !== 'hidden'; })
  .map((node) => (node.textContent || '').trim()));
record('AORG-RV12-055-handoff-detail-omits-visible-ordinals',
  orgDetailVisibleOrdinals.length === 0,
  { visibleOrdinals: orgDetailVisibleOrdinals, orderingCue: 'top-to-bottom' });
await capture(orgDetail, 'REV-AORG-RV12-014', 'REV-AORG-RV12-014-agent-org-handoff-detail.png', 'Clean Agent Org handoff detail with only From, To, and When');
await orgDetail.getByRole('button', { name: 'Run', exact: true }).click();
await orgDetail.waitForURL((url) => url.pathname === '/workspace' && url.searchParams.get('phase') === 'config');
record('AORG-RV12-011-org-run-opens-one-org-configuration',
  await orgDetail.locator('[data-test="agent-org-run-config"]').count() === 1
    && await orgDetail.locator('[data-test="org-launch-modal"]').count() === 0
    && !new URL(orgDetail.url()).searchParams.has('entry')
    && await orgDetail.getByText('Agent Org', { exact: true }).count() === 1
    && await orgDetail.getByText('Software Development Department', { exact: true }).count() >= 1
    && await orgDetail.getByRole('button', { name: 'Run Agent Org', exact: true }).isDisabled(),
  { separateEntrySelector: false, phase: 'config', runAction: 'Run Agent Org' });
record('AORG-RV12-012-org-configuration-preserves-baseline-run-language',
  await orgDetail.getByText('Runtime', { exact: true }).count() === 1
    && await orgDetail.getByText('Default LLM Model', { exact: true }).count() === 1
    && await orgDetail.getByText('Workspace Directory', { exact: true }).count() === 1
    && await orgDetail.getByText('Auto approve tools', { exact: true }).count() >= 1
    && await orgDetail.getByText('Member overrides', { exact: true }).count() === 1
    && await orgDetail.getByText('Workspace is required to run an Agent Org.', { exact: true }).count() === 1,
  { preservedSurface: 'baseline run configuration', rootSubject: 'Agent Org' });
record('AORG-RV12-013-config-history-has-definition-without-active-runtime',
  await orgDetail.locator('[data-test="history-org-definition"]').count() === 1
    && await orgDetail.locator('[data-test="history-standalone-team-definition"]').count() === 1
    && await orgDetail.locator('[data-test="history-org-root"]').count() === 0,
  { configurationPhase: true, activeOrgRun: false });
await capture(orgDetail, 'REV-AORG-RV12-006', 'REV-AORG-RV12-006-agent-org-configuration.png', 'Agent Org Run opens the baseline-native organization configuration directly');

await orgDetail.locator('[data-test="org-member-overrides-toggle"]').click();
record('AORG-RV12-014-org-placement-hierarchy-is-explicit',
  await orgDetail.locator('[data-test="org-member-overrides-panel"]').isVisible()
    && await orgDetail.getByText('/requirements_engineer', { exact: true }).count() === 1
    && await orgDetail.getByText('/product_design_prototyping_team', { exact: true }).count() === 1
    && await orgDetail.getByText('/product_design_prototyping_team/product_prototyper', { exact: true }).count() === 1
    && await orgDetail.getByText('/software_engineering_team', { exact: true }).count() === 1
    && await orgDetail.getByText('Coordinator: product_prototyper', { exact: true }).count() === 1
    && await orgDetail.getByText('Coordinator: architecture_designer', { exact: true }).count() === 1,
  { levels: ['Org root', 'Team placement', 'Agent placement'], exactAddresses: true });
await orgDetail.locator('[data-test="org-placement-team-product-design-prototyping-team"] > button').click();
await orgDetail.locator('[data-test="org-placement-team-product-design-prototyping-team"] input[type="checkbox"]').click();
await orgDetail.locator('[data-test="org-placement-agent-requirements-engineer"] > button').click();
await orgDetail.locator('[data-test="org-placement-agent-requirements-engineer"] input[type="checkbox"]').click();
record('AORG-RV12-015-team-and-agent-placement-overrides-are-editable',
  await orgDetail.locator('[data-test="org-placement-team-product-design-prototyping-team"]').getByText('Custom', { exact: true }).count() === 1
    && await orgDetail.locator('[data-test="org-placement-agent-requirements-engineer"]').getByText('Custom', { exact: true }).count() === 1,
  { teamPlacement: '/product_design_prototyping_team', agentPlacement: '/requirements_engineer' });
await capture(orgDetail, 'REV-AORG-RV12-007', 'REV-AORG-RV12-007-agent-org-placement-overrides.png', 'One clean configuration tree supports Team and Agent placement overrides');

await orgDetail.getByRole('button', { name: 'Select a workspace...', exact: true }).click();
await orgDetail.getByText('/synthetic/prototype-workspace', { exact: true }).click();
record('AORG-RV12-016-org-launch-validates-complete-configuration',
  await orgDetail.getByRole('button', { name: 'Run Agent Org', exact: true }).isEnabled(),
  { workspace: '/synthetic/prototype-workspace', fullScopeValidation: true });
await orgDetail.getByRole('button', { name: 'Run Agent Org', exact: true }).click();
await orgDetail.waitForURL((url) => url.searchParams.get('phase') === 'active');
await orgDetail.locator('[data-test="agent-org-active-unfocused"]').waitFor();
await orgDetail.waitForFunction(() => {
  const pinia = document.querySelector('#__nuxt')?.__vue_app__?.config?.globalProperties?.$pinia;
  return pinia?._s?.get('agentContexts')?.runs?.has('org-agent-run-requirements-engineer')
    && pinia?._s?.get('agentTeamContexts')?.teams?.has('org-team-run-product-design-prototyping-team');
});
record('AORG-RV12-017-full-scope-launch-has-no-initial-focus',
  await orgDetail.locator('[data-test="history-org-root"]').count() === 1
    && await orgDetail.locator('[data-test="agent-org-active-unfocused"]').count() === 1
    && await orgDetail.getByText('Choose an Agent or Team', { exact: true }).count() === 1
    && await orgDetail.locator('[data-test="history-org-agent-requirements-engineer"]').count() === 1
    && await orgDetail.locator('[data-test="history-org-team-product-design-prototyping-team"]').count() === 1
    && await orgDetail.locator('[data-test="history-org-team-software-engineering-team"]').count() === 1,
  { activeScope: 'complete Agent Org', initialRecipient: null });
record('AORG-RV12-018-task-agent-and-task-team-remain-runtime-lineage',
  await orgDetail.locator('[data-test="history-task-agent-row"]').count() === 1
    && await orgDetail.locator('[data-test="history-task-team-row"]').count() === 1
    && await orgDetail.locator('[data-test="history-task-team-child-row"]').count() === 1
    && await orgDetail.getByText('Task work', { exact: true }).count() === 0
    && await orgDetail.getByText('not authored nesting', { exact: false }).count() === 0,
  { taskPresentation: 'task-scoped rows under the active referenced Team' });
const hierarchyTree = orgDetail.locator('[data-test="history-org-execution-tree"]');
const hierarchyTreeItems = hierarchyTree.locator('[role="treeitem"]');
const hierarchyBranches = hierarchyTree.locator('[data-test="workspace-hierarchy-branches"]');
const hierarchyBranchGeometry = await hierarchyBranches.first().locator('.hierarchy-current-branch').evaluate((element) => {
  const before = getComputedStyle(element, '::before');
  const after = getComputedStyle(element, '::after');
  return { verticalWidth: before.width, horizontalHeight: after.height, horizontalWidth: after.width };
});
record('AORG-RV12-054-workspace-hierarchy-preserves-source-tree-branches',
  await hierarchyTree.getAttribute('role') === 'tree'
    && await hierarchyTreeItems.count() === await hierarchyBranches.count()
    && await hierarchyBranches.locator('.hierarchy-ancestor-rail').count() >= 1
    && hierarchyBranchGeometry.verticalWidth === '1px'
    && hierarchyBranchGeometry.horizontalHeight === '1px'
    && hierarchyBranchGeometry.horizontalWidth !== '0px',
  { treeItems: await hierarchyTreeItems.count(), branchDecorators: await hierarchyBranches.count(), ancestorRails: await hierarchyBranches.locator('.hierarchy-ancestor-rail').count(), geometry: hierarchyBranchGeometry });
await capture(orgDetail, 'REV-AORG-RV12-008', 'REV-AORG-RV12-008-agent-org-active-unfocused.png', 'Complete Agent Org scope active with no initial communication focus');

await orgDetail.locator('[data-test="history-org-agent-requirements-engineer"]').click();
await orgDetail.waitForFunction(() => document.querySelector('[data-test="workspace-center-content-shell"]')?.textContent?.includes('The current prototype evidence is deterministic and isolated.'));
record('AORG-RV12-019-sidebar-direct-agent-focus',
  await orgDetail.locator('[data-test="agent-org-active-unfocused"]').count() === 0
    && await orgDetail.getByText('requirements_engineer', { exact: true }).count() >= 1
    && await orgDetail.getByText('Summarize the controlled prototype evidence.', { exact: true }).count() === 1,
  { focused: '/requirements_engineer', surface: 'accepted Agent workspace' });
await capture(orgDetail, 'REV-AORG-RV12-009', 'REV-AORG-RV12-009-agent-org-direct-agent-focus.png', 'Exact direct Agent selected from the active Agent Org sidebar');

await orgDetail.reload({ waitUntil: 'networkidle' });
await orgDetail.locator('[data-test="agent-org-active-unfocused"]').waitFor();
await orgDetail.waitForFunction(() => document.querySelector('#__nuxt')?.__vue_app__?.config?.globalProperties?.$pinia?._s?.get('agentTeamContexts')?.teams?.has('org-team-run-product-design-prototyping-team'));
await orgDetail.locator('[data-test="history-org-team-product-design-prototyping-team"] > button').click();
await orgDetail.getByText('The Product Design & Prototyping workspace is active.', { exact: true }).waitFor();
record('AORG-RV12-020-sidebar-team-focus-enters-through-coordinator',
  await orgDetail.locator('[data-test="agent-org-active-unfocused"]').count() === 0
    && await orgDetail.getByText('product_prototyper', { exact: true }).count() >= 1
    && await orgDetail.locator('[data-test="history-org-team-agent-product-prototyper"]').getByLabel('Coordinator').count() === 1,
  { focusedTeam: '/product_design_prototyping_team', coordinator: 'product_prototyper' });
await capture(orgDetail, 'REV-AORG-RV12-010', 'REV-AORG-RV12-010-agent-org-team-coordinator-focus.png', 'Direct Team selected from the Agent Org sidebar and communication enters through its coordinator');
await orgDetail.locator('[data-test="history-org-team-agent-prototype-bootstrapper"]').click();
await orgDetail.getByText('This member is ready in the active organization run.', { exact: true }).waitFor();
record('AORG-RV12-021-sidebar-exact-team-agent-focus',
  await orgDetail.getByText('prototype_bootstrapper', { exact: true }).count() >= 1,
  { focused: '/product_design_prototyping_team/prototype_bootstrapper' });
await orgDetail.getByRole('tab', { name: 'Files', exact: true }).click();
record('AORG-RV12-022-agent-org-runtime-preserves-file-tree',
  await orgDetail.getByText('docs', { exact: true }).count() >= 1
    && await orgDetail.getByText('evidence.md', { exact: true }).count() >= 1
    && await orgDetail.getByText('requirements.md', { exact: true }).count() >= 1,
  { preservedTree: ['docs', 'evidence.md', 'requirements.md'] });
await orgDetail.close();

const orgEdit = await openPage(`/agent-orgs?${query({ view: 'org-edit', id: 'software-development-department' })}`);
const orgEditManager = orgEdit.locator('[data-test="handoff-manager-org"]');
await orgEditManager.getByRole('button', { name: 'Add handoff', exact: true }).click();
await orgEditManager.locator('[data-test="apply-handoff-draft"]').click();
record('AORG-RV12-036-org-handoff-editor-validates-complete-draft',
  await orgEditManager.getByText('Choose a source Agent.', { exact: true }).count() === 1
    && await orgEditManager.getByText('Choose a destination.', { exact: true }).count() === 1
    && await orgEditManager.getByText('Enter natural-language guidance for this condition.', { exact: true }).count() === 1,
  { requiredFields: ['From', 'To', 'When'] });
record('AORG-RV12-037-org-handoff-endpoint-eligibility',
  await orgEditManager.locator('select[data-test="handoff-from"] option').count() === 8
    && await orgEditManager.locator('select[data-test="handoff-to"] option').count() === 10
    && await orgEditManager.locator('select[data-test="handoff-from"] optgroup[label="Teams"]').count() === 0
    && await orgEditManager.locator('select[data-test="handoff-to"] optgroup[label="Teams"]').count() === 1,
  { from: 'direct and Team-mounted Agents', to: 'direct Agents, Team-mounted Agents, and direct Teams', teamSources: 0 });
await orgEditManager.locator('select[data-test="handoff-from"]').selectOption('/product_design_prototyping_team/prototype_bootstrapper');
await orgEditManager.locator('select[data-test="handoff-to"]').selectOption('/software_engineering_team/implementation_engineer');
const firstWhen = 'A reviewed experience specification is ready for implementation.';
const secondWhen = 'Implementation feedback requires a focused product revision.';
await orgEditManager.locator('[data-test="when-condition-0"]').fill(firstWhen);
await orgEditManager.locator('[data-test="add-when-condition"]').click();
await orgEditManager.locator('[data-test="when-condition-1"]').fill(secondWhen);
await orgEditManager.getByRole('button', { name: 'Move When condition 2 up', exact: true }).click();
record('AORG-RV12-038-when-conditions-are-orderable',
  await orgEditManager.locator('[data-test="when-condition-0"]').inputValue() === secondWhen
    && await orgEditManager.locator('[data-test="when-condition-1"]').inputValue() === firstWhen,
  { resultingOrder: [secondWhen, firstWhen] });
const orgEditorVisibleOrdinals = await orgEditManager.locator('[data-test="handoff-editor"]').evaluate((element) => [...element.querySelectorAll('*')]
  .filter((node) => node.children.length === 0 && /^(1|2)$/.test((node.textContent || '').trim()))
  .filter((node) => { const style = getComputedStyle(node); return style.display !== 'none' && style.visibility !== 'hidden'; })
  .map((node) => (node.textContent || '').trim()));
record('AORG-RV12-056-handoff-editor-omits-visible-ordinals',
  orgEditorVisibleOrdinals.length === 0,
  { visibleOrdinals: orgEditorVisibleOrdinals, reorderControls: true });
await orgEditManager.locator('[data-test="apply-handoff-draft"]').click();
await orgEditManager.getByRole('button', { name: 'Move handoff 3 up', exact: true }).click();
const addedHandoffCard = orgEditManager.locator('[data-test^="handoff-card-"]').filter({ hasText: secondWhen });
await addedHandoffCard.getByRole('button', { name: 'Edit', exact: true }).click();
await orgEditManager.locator('[data-test="when-condition-0"]').fill('This canceled edit must not persist.');
await orgEditManager.locator('[data-test="cancel-handoff-draft"]').click();
record('AORG-RV12-039-handoff-draft-can-be-canceled',
  await orgEditManager.getByText('This canceled edit must not persist.', { exact: true }).count() === 0
    && await orgEditManager.getByText(secondWhen, { exact: true }).count() === 1,
  { cancellationPreservedCommittedDraft: true });
await addedHandoffCard.getByRole('button', { name: 'Edit', exact: true }).click();
const updatedWhen = 'Implementation feedback needs a focused product revision.';
await orgEditManager.locator('[data-test="when-condition-0"]').fill(updatedWhen);
await orgEditManager.locator('[data-test="apply-handoff-draft"]').click();
await orgEditManager.locator('[data-test^="handoff-card-"]').last().getByRole('button', { name: 'Delete', exact: true }).click();
await orgEdit.getByRole('button', { name: 'Save changes', exact: true }).click();
record('AORG-RV12-040-handoff-authoring-supports-crud-reorder-and-atomic-save',
  await orgEditManager.locator('[data-test^="handoff-card-"]').count() === 2
    && await orgEditManager.getByText(updatedWhen, { exact: true }).count() === 1
    && await orgEdit.getByText('Saved locally for this prototype.', { exact: true }).count() === 1
    && await orgEditManager.getByText(/Via coordinator/i).count() === 0
    && await orgEditManager.getByText(/\d+ handoffs?|\d+ conditions?/i).count() === 0,
  { actions: ['add', 'edit', 'delete', 'reorder handoff', 'reorder When', 'cancel', 'save'], savedHandoffs: 2 });
await capture(orgEdit, 'REV-AORG-RV12-015', 'REV-AORG-RV12-015-agent-org-handoff-authoring.png', 'Clean Agent Org handoff authoring with From, To, and ordered When guidance');
await orgEdit.getByRole('button', { name: 'Cancel', exact: true }).click();
await orgEdit.locator('[data-test="org-card-software-development-department"]').getByRole('button', { name: 'View Details', exact: false }).click();
await orgEdit.waitForURL(/view=org-detail/);
await orgEdit.locator('[data-test="handoff-manager-org"]').waitFor();
record('AORG-RV12-041-saved-handoff-definition-is-inspectable',
  await orgEdit.locator('[data-test="handoff-manager-org"] [data-test^="handoff-card-"]').count() === 2
    && await orgEdit.getByText(updatedWhen, { exact: true }).count() === 1,
  { savedStateVisibleOnDetail: true });
await orgEdit.close();

const orgInvalidEdit = await openPage(`/agent-orgs?${query({ view: 'org-edit', id: 'software-development-department' })}`);
const orgInvalidManager = orgInvalidEdit.locator('[data-test="handoff-manager-org"]');
await orgInvalidManager.getByRole('button', { name: 'Add handoff', exact: true }).click();
await orgInvalidManager.locator('select[data-test="handoff-from"]').selectOption('/requirements_engineer');
await orgInvalidManager.locator('select[data-test="handoff-to"]').selectOption('/requirements_engineer');
await orgInvalidManager.locator('[data-test="when-condition-0"]').fill('The direct Agent would receive its own handoff.');
await orgInvalidManager.locator('[data-test="apply-handoff-draft"]').click();
record('AORG-RV12-042-self-resolving-delivery-is-rejected',
  await orgInvalidManager.getByText('This delivery resolves back to the source Agent.', { exact: true }).count() === 1,
  { from: '/requirements_engineer', to: '/requirements_engineer' });
await orgInvalidManager.locator('[data-test="cancel-handoff-draft"]').click();
await orgInvalidManager.getByRole('button', { name: 'Add handoff', exact: true }).click();
await orgInvalidManager.locator('select[data-test="handoff-from"]').selectOption('/requirements_engineer');
await orgInvalidManager.locator('select[data-test="handoff-to"]').selectOption('/product_design_prototyping_team');
await orgInvalidManager.locator('[data-test="when-condition-0"]').fill('Another condition belongs on the existing Handoff.');
await orgInvalidManager.locator('[data-test="apply-handoff-draft"]').click();
record('AORG-RV12-043-duplicate-effective-pair-is-rejected',
  await orgInvalidManager.getByText('This From/To pair already exists. Add another When condition to the existing handoff.', { exact: true }).count() === 1,
  { duplicatePair: ['/requirements_engineer', '/product_design_prototyping_team'] });
await orgInvalidManager.locator('[data-test="cancel-handoff-draft"]').click();
await orgInvalidEdit.getByRole('button', { name: 'Remove Product Design & Prototyping', exact: true }).click();
await orgInvalidEdit.getByRole('button', { name: 'Save changes', exact: true }).click();
record('AORG-RV12-044-org-member-impact-blocks-atomic-save',
  await orgInvalidManager.locator('[data-test="handoff-validation-summary"]').count() === 1
    && await orgInvalidEdit.getByText('Resolve the highlighted handoffs before saving this organization.', { exact: true }).count() === 1
    && await orgInvalidManager.getByText(/Unavailable · \/product_design_prototyping_team/).count() >= 1,
  { removedMember: 'Product Design & Prototyping', silentDeleteOrRetarget: false, saveBlocked: true });
await orgInvalidEdit.close();

const narrow = await openPage(`/agent-orgs?${query({ view: 'org-detail', id: 'software-development-department' })}`, { width: 390, height: 844 });
const overflow = await narrow.evaluate(() => ({ viewport: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
record('AORG-RV12-019-narrow-layout', overflow.scrollWidth === overflow.viewport
  && await narrow.getByRole('heading', { name: 'Software Development Department' }).count() === 1,
{ overflow });
await narrow.close();

const narrowConfig = await openPage(`/workspace?${query({ root: 'org', org: 'software-development-department', phase: 'config' })}`, { width: 390, height: 844 });
const narrowConfigOverflow = await narrowConfig.evaluate(() => ({ viewport: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
record('AORG-RV12-053-org-configuration-narrow-layout',
  narrowConfigOverflow.scrollWidth === narrowConfigOverflow.viewport
    && await narrowConfig.locator('[data-test="agent-org-run-config"]').count() === 1
    && await narrowConfig.locator('[data-test="org-launch-modal"]').count() === 0
    && await narrowConfig.getByRole('button', { name: 'Run Agent Org', exact: true }).count() === 1,
  { overflow: narrowConfigOverflow, overlay: false });
await capture(narrowConfig, 'REV-AORG-RV12-017', 'REV-AORG-RV12-017-agent-org-configuration-narrow.png', 'Responsive Agent Org configuration without an overlay');
await narrowConfig.close();

record('AORG-RV12-020-no-runtime-errors', runtimeErrors.length === 0, { runtimeErrors });

const result = {
  package: 'AORG-FLAT-TEAM-001',
  revision: 'RV-012',
  mode: 'Product Experience Prototyping',
  baseUrl,
  generatedAt: new Date().toISOString(),
  result: failures.length === 0 ? 'PASS' : 'FAIL',
  checks,
  failures,
  runtimeErrors,
  captures,
};
await fs.writeFile(path.join(ticketRoot, 'browser-validation-rv-012.json'), `${JSON.stringify(result, null, 2)}\n`);
await fs.writeFile(path.join(evidenceRoot, 'capture-manifest.json'), `${JSON.stringify({ package: result.package, revision: result.revision, captures, reviewStatus: 'Non-normative pending user approval' }, null, 2)}\n`);
await browser.close();

console.log(JSON.stringify({ result: result.result, checks: checks.length, failures, runtimeErrors, captures: captures.length }, null, 2));
if (failures.length > 0 || runtimeErrors.length > 0) process.exitCode = 1;
