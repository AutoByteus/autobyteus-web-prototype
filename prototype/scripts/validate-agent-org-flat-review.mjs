import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4194';
const ticketRoot = path.resolve('tickets/in-progress/AORG-FLAT-TEAM-001');
const evidenceRoot = path.join(ticketRoot, 'review-evidence', 'rv-008');
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
record('AORG-RV8-001-team-catalog',
  await teamList.getByRole('heading', { name: 'Agent Teams', exact: true }).count() === 1
    && await teamList.locator('h1.sr-only').filter({ hasText: 'Agent Teams' }).count() === 1
    && await teamList.locator('[data-test^="team-card-"]').count() === 3
    && await teamList.getByRole('button', { name: 'Create Team', exact: true }).count() === 1,
  { visiblePageTitle: false, accessiblePageHeading: true, cards: await teamList.locator('[data-test^="team-card-"]').count() });
record('AORG-RV8-002-separated-primary-navigation',
  await teamList.getByRole('button', { name: 'Agent Teams', exact: true }).count() === 1
    && await teamList.getByRole('button', { name: 'Agent Orgs', exact: true }).count() === 1,
  { navigation: ['Agent Teams', 'Agent Orgs'] });
record('AORG-RV8-003-team-catalog-preserves-baseline-visual-language',
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
record('AORG-RV8-021-baseline-reload-feedback',
  await teamList.getByRole('button', { name: 'Reloading…', exact: true }).isDisabled(),
  { immediateFeedback: 'Reloading…', disabledDuringReload: true });
await teamList.waitForTimeout(500);
const teamSearch = teamList.getByPlaceholder('Search teams by name');
await teamSearch.fill('Release');
record('AORG-RV8-022-baseline-search-behavior',
  await teamList.locator('[data-test^="team-card-"]').count() === 1
    && await teamList.getByRole('heading', { name: 'Featured teams', exact: true }).count() === 0
    && await teamList.getByRole('heading', { name: 'All teams', exact: true }).count() === 0,
  { query: 'Release', matchingCards: 1 });
await teamSearch.fill('');
await capture(teamList, 'REV-AORG-001', 'REV-AORG-001-agent-team-catalog.png', 'Baseline-native flat Agent Team catalog; only obsolete nesting semantics are removed');
await teamList.close();

const teamCreate = await openPage(`/agent-teams?${query({ view: 'team-create' })}`);
const productLibraryItem = teamCreate.locator('[data-test="team-library-agent-product-prototyper"]');
const teamCanvasDropTarget = teamCreate.locator('[data-test="team-canvas-drop-target"]');
record('AORG-RV8-004-team-authoring-agent-only',
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
record('AORG-RV8-045-team-builder-preserves-real-drag-source-and-drop-target',
  await productLibraryItem.getAttribute('draggable') === 'true'
    && await teamCanvasDropTarget.count() === 1
    && await teamCreate.locator('[data-test^="team-canvas-member-"]').count() === 0
    && await teamCreate.getByText('Select a member in Team Canvas to edit details.', { exact: true }).count() === 1,
  { dragSource: 'product_prototyper', initialCanvasMembers: 0, emptyMemberDetails: true });
await productLibraryItem.dragTo(teamCanvasDropTarget);
await teamCreate.getByRole('button', { name: 'Add prototype_bootstrapper', exact: true }).click();
const coordinatorSwitches = teamCreate.locator('[data-test="team-canvas"] [role="switch"]');
record('AORG-RV8-005-exactly-one-team-coordinator',
  await coordinatorSwitches.count() === 2
    && await coordinatorSwitches.evaluateAll((switches) => switches.filter((element) => element.getAttribute('aria-checked') === 'true').length === 1),
  { switches: await coordinatorSwitches.count(), checked: await coordinatorSwitches.evaluateAll((switches) => switches.filter((element) => element.getAttribute('aria-checked') === 'true').length) });
const memberDetails = teamCreate.locator('[data-test="member-details"]');
record('AORG-RV8-046-selected-canvas-member-has-real-editable-details',
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
record('AORG-RV8-047-member-name-and-coordinator-edit-update-the-canvas',
  await teamCreate.locator('[data-test="team-canvas"]').getByText('baseline_specialist', { exact: true }).count() === 1
    && await coordinatorSwitches.evaluateAll((switches) => switches.filter((element) => element.getAttribute('aria-checked') === 'true').length === 1)
    && await memberDetails.getByText('Enabled', { exact: true }).count() === 1,
  { renamedMember: 'baseline_specialist', selectedCoordinator: true });
await capture(teamCreate, 'REV-AORG-002', 'REV-AORG-002-agent-team-authoring.png', 'Source-native drag-and-drop Agent-only Team builder with editable selected-member details');
await teamCreate.close();

const teamDetail = await openPage(`/agent-teams?${query({ view: 'team-detail', id: 'product-design-prototyping-team' })}`);
record('AORG-RV8-023-team-detail-preserves-baseline-card-hierarchy',
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
record('AORG-RV8-024-team-detail-keeps-flat-semantics-without-cross-surface-chrome',
  await teamDetail.getByText('2 Agents', { exact: true }).count() === 1
    && await teamDetail.getByText('Nested Teams', { exact: true }).count() === 0
    && await teamDetail.getByText('Standalone & reusable', { exact: true }).count() === 0
    && await teamDetail.getByText('Agent Team', { exact: true }).count() === 0
    && await teamDetail.getByRole('heading', { name: 'Used by Agent Orgs', exact: true }).count() === 0
    && await teamDetail.getByRole('button', { name: 'View Agent Orgs', exact: false }).count() === 0,
  { nestedTeamUI: 0, redundantTypeBadges: 0, crossSurfacePromotion: 0 });
await capture(teamDetail, 'REV-AORG-009', 'REV-AORG-009-agent-team-detail.png', 'Baseline-native flat Team detail with members, coordinator, and handoffs');
const teamHandoffManager = teamDetail.locator('[data-test="handoff-manager-team"]');
await teamHandoffManager.evaluate((element) => element.scrollIntoView({ block: 'start' }));
record('AORG-RV8-031-team-handoff-detail-is-explicit-and-clean',
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
await capture(teamDetail, 'REV-AORG-012', 'REV-AORG-012-team-local-handoff-detail.png', 'Clean Team-local From, To, and When handoff detail');
await teamDetail.getByRole('heading', { name: 'Members (2)', exact: true }).evaluate(element => element.scrollIntoView({ block: 'start' }));
await teamDetail.waitForTimeout(200);
await capture(teamDetail, 'REV-AORG-010', 'REV-AORG-010-agent-team-members.png', 'Preserved Team member cards with direct Agent detail actions');
await teamDetail.getByRole('button', { name: 'Open agent details for product_prototyper', exact: true }).click();
await teamDetail.waitForURL(/\/agents\?/);
record('AORG-RV8-025-team-member-opens-preserved-agent-detail',
  new URL(teamDetail.url()).searchParams.get('id') === 'product-prototyper'
    && new URL(teamDetail.url()).searchParams.get('returnToTeam') === 'product-design-prototyping-team'
    && new URL(teamDetail.url()).searchParams.get('prototypeReview') === 'agent-org-flat'
    && await teamDetail.getByRole('heading', { name: 'product_prototyper', exact: true }).count() === 1
    && await teamDetail.getByRole('heading', { name: 'Instructions', exact: true }).count() === 1
    && await teamDetail.getByText('Evolve accepted product experiences, coordinate focused prototype work, and return precise review evidence.', { exact: true }).count() === 1
    && await teamDetail.getByRole('button', { name: 'Back to team', exact: true }).count() === 1,
  { member: 'product_prototyper', detailSurface: 'accepted Agent detail', returnToTeam: 'product-design-prototyping-team' });
await capture(teamDetail, 'REV-AORG-011', 'REV-AORG-011-agent-member-detail.png', 'Preserved Agent detail reached from a Team member');
await teamDetail.getByRole('button', { name: 'Back to team', exact: true }).click();
await teamDetail.waitForURL(/\/agent-teams\?/);
record('AORG-RV8-026-agent-detail-returns-to-future-team-context',
  new URL(teamDetail.url()).searchParams.get('id') === 'product-design-prototyping-team'
    && new URL(teamDetail.url()).searchParams.get('view') === 'team-detail'
    && new URL(teamDetail.url()).searchParams.get('prototypeReview') === 'agent-org-flat'
    && await teamDetail.locator('[data-test="flat-agent-team-experience"]').count() === 1
    && await teamDetail.getByRole('heading', { name: 'Product Design & Prototyping', exact: true }).count() === 1,
  { returnedTo: 'future-state Team detail', prototypeReviewPreserved: true });
await teamDetail.close();

const narrowTeamDetail = await openPage(`/agent-teams?${query({ view: 'team-detail', id: 'product-design-prototyping-team' })}`, { width: 390, height: 844 });
const narrowTeamOverflow = await narrowTeamDetail.evaluate(() => ({ viewport: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
record('AORG-RV8-027-team-detail-narrow-preservation',
  narrowTeamOverflow.scrollWidth === narrowTeamOverflow.viewport
    && await narrowTeamDetail.getByRole('heading', { name: 'Instructions', exact: true }).count() === 1
    && await narrowTeamDetail.locator('[data-test^="team-member-view-"]').count() === 2,
  { overflow: narrowTeamOverflow, preserved: ['Instructions', 'member detail actions'] });
await narrowTeamDetail.close();

const narrowTeamCreate = await openPage(`/agent-teams?${query({ view: 'team-create' })}`, { width: 390, height: 844 });
await narrowTeamCreate.getByRole('button', { name: 'Add product_prototyper', exact: true }).click();
const narrowTeamCreateOverflow = await narrowTeamCreate.evaluate(() => ({ viewport: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
record('AORG-RV8-048-team-builder-preserves-click-fallback-and-narrow-layout',
  narrowTeamCreateOverflow.scrollWidth === narrowTeamCreateOverflow.viewport
    && await narrowTeamCreate.locator('[data-test^="team-canvas-member-"]').count() === 1
    && await narrowTeamCreate.locator('[data-test="member-name-input"]').inputValue() === 'product_prototyper',
  { overflow: narrowTeamCreateOverflow, clickFallback: true, selectedMemberDetails: true });
await capture(narrowTeamCreate, 'REV-AORG-016', 'REV-AORG-016-agent-team-builder-narrow.png', 'Narrow Team builder with click fallback and selected-member details');
await narrowTeamCreate.close();

const teamEdit = await openPage(`/agent-teams?${query({ view: 'team-edit', id: 'product-design-prototyping-team' })}`);
const teamEditManager = teamEdit.locator('[data-test="handoff-manager-team"]');
await teamEditManager.getByRole('button', { name: 'Edit', exact: true }).first().click();
record('AORG-RV8-032-team-local-editor-limits-endpoints-to-direct-agents',
  await teamEditManager.locator('select[data-test="handoff-from"] option').count() === 3
    && await teamEditManager.locator('select[data-test="handoff-to"] option').count() === 3
    && await teamEditManager.locator('optgroup[label="Team Agents"]').count() === 2
    && await teamEditManager.locator('optgroup[label="Teams"]').count() === 0,
  { fromChoices: ['product_prototyper', 'prototype_bootstrapper'], toChoices: ['product_prototyper', 'prototype_bootstrapper'], teamDestinations: 0 });
await capture(teamEdit, 'REV-AORG-013', 'REV-AORG-013-team-local-handoff-authoring.png', 'Team-local handoff editor with direct Agent endpoints only');
await teamEditManager.locator('[data-test="cancel-handoff-draft"]').click();
await teamEdit.getByRole('button', { name: 'Remove prototype_bootstrapper', exact: true }).click();
await teamEdit.getByRole('button', { name: 'Save Changes', exact: true }).click();
record('AORG-RV8-033-team-member-impact-blocks-atomic-save',
  await teamEditManager.locator('[data-test="handoff-validation-summary"]').count() === 1
    && await teamEdit.getByText('Resolve the highlighted handoffs before saving this Team.', { exact: true }).count() === 1
    && await teamEditManager.getByText('Unavailable · /prototype_bootstrapper', { exact: true }).count() >= 1,
  { removedMember: 'prototype_bootstrapper', silentRetarget: false, saveBlocked: true });
await teamEdit.close();

const orgList = await openPage(`/agent-orgs?${query({ view: 'org-list' })}`);
record('AORG-RV8-006-org-catalog',
  await orgList.getByRole('heading', { name: 'Agent Orgs', exact: true }).count() === 1
    && await orgList.locator('h1.sr-only').filter({ hasText: 'Agent Orgs' }).count() === 1
    && await orgList.locator('[data-test^="org-card-"]').count() === 2
    && await orgList.getByRole('button', { name: 'Create Agent Org', exact: true }).count() === 1
    && (await orgList.locator('[data-test="create-org"]').getAttribute('class'))?.includes('bg-blue-600')
    && await orgList.getByText('Fixed-depth collaboration roots', { exact: true }).count() === 0
    && await orgList.getByText('Agent Org', { exact: true }).count() === 0
    && await orgList.getByText('No coordinator', { exact: true }).count() === 0,
  { visiblePageTitle: false, accessiblePageHeading: true, cards: await orgList.locator('[data-test^="org-card-"]').count(), primaryAction: 'blue' });
record('AORG-RV8-007-org-direct-composition',
  await orgList.getByText('requirements_engineer', { exact: true }).count() >= 1
    && await orgList.getByText('Product Design & Prototyping', { exact: true }).count() >= 1
    && await orgList.locator('[data-test^="org-member-"]').count() === 6
    && await orgList.getByText('Direct composition', { exact: true }).count() === 0
    && await orgList.getByText('1 level', { exact: true }).count() === 0
    && await orgList.getByRole('heading', { name: 'Featured organizations', exact: true }).count() === 1,
  { directKinds: ['agent', 'team'], explicitTypeSuffixes: 0, explanatoryCompositionChrome: 0 });
const orgReloadButton = orgList.getByRole('button', { name: 'Reload', exact: true });
await orgReloadButton.click();
record('AORG-RV8-028-org-reload-feedback',
  await orgList.getByRole('button', { name: 'Reloading…', exact: true }).isDisabled(),
  { immediateFeedback: 'Reloading…', disabledDuringReload: true });
await orgList.waitForTimeout(500);
const orgSearch = orgList.getByPlaceholder('Search organizations by name');
await orgSearch.fill('Release');
record('AORG-RV8-029-org-search-behavior',
  await orgList.locator('[data-test^="org-card-"]').count() === 1
    && await orgList.getByRole('heading', { name: 'Featured organizations', exact: true }).count() === 0,
  { query: 'Release', matchingCards: 1 });
await orgSearch.fill('');
await capture(orgList, 'REV-AORG-003', 'REV-AORG-003-agent-org-catalog.png', 'Baseline-native Agent Org catalog with direct Agent and Team members');
await orgList.close();

const narrowOrgList = await openPage(`/agent-orgs?${query({ view: 'org-list' })}`, { width: 390, height: 844 });
const narrowOrgListOverflow = await narrowOrgList.evaluate(() => ({ viewport: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
record('AORG-RV8-030-org-catalog-narrow-layout',
  narrowOrgListOverflow.scrollWidth === narrowOrgListOverflow.viewport
    && await narrowOrgList.locator('[data-test^="org-card-"]').count() === 2
    && await narrowOrgList.getByRole('button', { name: 'Create Agent Org', exact: true }).count() === 1,
  { overflow: narrowOrgListOverflow, cards: 2 });
await narrowOrgList.close();

const orgCreate = await openPage(`/agent-orgs?${query({ view: 'org-create' })}`);
record('AORG-RV8-008-org-authoring-membership',
  await orgCreate.getByRole('heading', { name: 'Create Agent Org' }).count() === 1
    && await orgCreate.getByRole('button', { name: 'Add Agent' }).count() === 1
    && await orgCreate.getByRole('button', { name: 'Add Team' }).count() === 1
    && await orgCreate.locator('[data-test="handoff-manager-org"]').count() === 1
    && await orgCreate.locator('[data-test="handoff-empty-state"]').count() === 1
    && await orgCreate.getByRole('button', { name: 'Add handoff', exact: true }).count() === 1
    && await orgCreate.getByRole('button', { name: 'Add rule', exact: true }).count() === 0,
  { memberPickers: ['Agent', 'Team'], handoffEmptyState: true, genericRuleUI: 0 });
record('AORG-RV8-009-org-has-no-coordinator-control',
  await orgCreate.locator('input[type="radio"]').count() === 0
    && await orgCreate.getByText(/No (Org|Organization) coordinator/i).count() === 0
    && await orgCreate.getByRole('heading', { name: 'What makes this an Org?', exact: true }).count() === 0,
  { coordinatorControls: 0, explanatoryCoordinatorChrome: 0 });
await capture(orgCreate, 'REV-AORG-004', 'REV-AORG-004-agent-org-authoring.png', 'Agent Org authoring with independent Agents and referenced Teams');
await orgCreate.close();

const orgDetail = await openPage(`/agent-orgs?${query({ view: 'org-detail', id: 'software-development-department' })}`);
record('AORG-RV8-010-team-reference-preservation',
  await orgDetail.getByText('Same Team definition · standalone history preserved', { exact: true }).count() === 0
    && await orgDetail.getByText(/No (Org|Organization) coordinator/i).count() === 0
    && await orgDetail.getByRole('heading', { name: 'Members', exact: true }).count() === 1
    && await orgDetail.getByText('Coordinator: product_prototyper', { exact: true }).count() === 1
    && await orgDetail.getByText('Coordinator: architecture_designer', { exact: true }).count() === 1
    && await orgDetail.getByRole('heading', { name: 'Handoffs', exact: true }).count() === 1,
  { referencedTeams: 2, redundantSameDefinitionCopy: 0, explanatoryCoordinatorChrome: 0 });
const orgDescription = orgDetail.getByRole('heading', { name: 'Description', exact: true }).locator('..');
record('AORG-RV8-034-org-description-contains-no-invented-summary-data',
  await orgDescription.getByText('Agents', { exact: true }).count() === 0
    && await orgDescription.getByText('Teams', { exact: true }).count() === 0
    && await orgDescription.getByText('Handoffs', { exact: true }).count() === 0
    && await orgDescription.getByText('Last run', { exact: true }).count() === 0
    && await orgDetail.getByText(/^Runs:/).count() === 0,
  { removedSummaryFields: ['Agents', 'Teams', 'Handoffs', 'Last run', 'Runs'] });
await capture(orgDetail, 'REV-AORG-005', 'REV-AORG-005-agent-org-detail.png', 'Baseline-native Org detail with Agent and same-identity Team members');
const orgDetailHandoffManager = orgDetail.locator('[data-test="handoff-manager-org"]');
await orgDetailHandoffManager.evaluate((element) => element.scrollIntoView({ block: 'start' }));
record('AORG-RV8-035-org-handoff-detail-is-explicit-and-clean',
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
await capture(orgDetail, 'REV-AORG-014', 'REV-AORG-014-agent-org-handoff-detail.png', 'Clean Agent Org handoff detail with only From, To, and When');
await orgDetail.getByRole('button', { name: 'Run', exact: true }).click();
await orgDetail.locator('[data-test="org-launch-modal"]').waitFor();
record('AORG-RV8-011-org-launch-requires-entry',
  await orgDetail.locator('[data-test="start-org-run"]').isDisabled()
    && await orgDetail.getByText('Select the Agent or Team that should receive the first message.', { exact: true }).count() === 1
    && await orgDetail.getByText(/no coordinator|default recipient/i).count() === 0,
  { initialStartDisabled: true, selectionInstruction: 'direct' });
await orgDetail.locator('input[value="team:product-design-prototyping-team"]').check();
record('AORG-RV8-012-team-entry-resolves-through-coordinator',
  await orgDetail.locator('[data-test="start-org-run"]').isEnabled()
    && await orgDetail.getByText('Product Design & Prototyping through product_prototyper', { exact: false }).count() === 1,
  { entry: 'team:product-design-prototyping-team', coordinator: 'product_prototyper' });
await capture(orgDetail, 'REV-AORG-006', 'REV-AORG-006-agent-org-exact-entry-launch.png', 'Exact Team entry selected; Team coordinator is explicit');
await orgDetail.locator('[data-test="start-org-run"]').click();
await orgDetail.waitForURL(/\/workspace/);
await orgDetail.locator('[data-test="agent-org-runtime-experience"]').waitFor();
record('AORG-RV8-013-launch-carries-exact-entry',
  new URL(orgDetail.url()).searchParams.get('entry') === 'team:product-design-prototyping-team'
    && await orgDetail.getByText('Through coordinator product_prototyper', { exact: true }).count() === 1,
  { url: orgDetail.url() });
record('AORG-RV8-014-runtime-root-kinds',
  await orgDetail.locator('[data-test="history-org-root"]').count() === 1
    && await orgDetail.locator('[data-test="history-team-root"]').count() === 1,
  { roots: ['Org', 'Team'] });
record('AORG-RV8-015-task-team-is-runtime-lineage',
  await orgDetail.getByText('Task work', { exact: true }).count() === 0
    && await orgDetail.getByText('Runtime execution lineage', { exact: true }).count() === 1
    && await orgDetail.locator('[data-test="history-task-agent-row"]').count() === 1
    && await orgDetail.locator('[data-test="history-task-team-row"]').count() === 1
    && await orgDetail.getByText('not authored nesting', { exact: false }).count() === 1,
  { taskPresentation: 'source-current temporary rows within owning Team execution', genericTaskWorkSections: 0 });
record('AORG-RV8-016-task-team-disclosure-and-child-focus',
  await orgDetail.locator('[data-test="history-task-team-row"]').getAttribute('aria-expanded') === 'false',
  { initialTaskTeamDisclosure: 'collapsed' });
await orgDetail.locator('[data-test="history-task-team-row"]').click();
await orgDetail.locator('[data-test="history-task-team-child-row"]').waitFor();
await orgDetail.locator('[data-test="history-task-team-child-row"]').click();
await orgDetail.waitForURL(/focus=task-team-accessibility/);
await orgDetail.locator('[data-test="selected-runtime-execution"]').waitFor();
record('AORG-RV8-017-task-team-child-is-selectable-runtime-identity',
  new URL(orgDetail.url()).searchParams.get('focus') === 'task-team-accessibility:reviewer'
    && await orgDetail.locator('[data-test="selected-runtime-execution"]').count() === 1
    && await orgDetail.locator('[data-test="selected-runtime-execution"]').filter({ hasText: 'Temporary child AgentRun inside the Task Team execution.' }).count() === 1,
  { focusedExecution: 'task-team-accessibility:reviewer' });
await capture(orgDetail, 'REV-AORG-007', 'REV-AORG-007-agent-org-runtime-history.png', 'Shared runtime/history with explicit Agent Org root and task lineage');
await orgDetail.locator('[data-test="history-team-root"]').click();
await orgDetail.waitForURL(/root=team/);
record('AORG-RV8-018-standalone-team-history-remains-distinct',
  await orgDetail.getByText('Standalone Agent Team run', { exact: true }).count() === 1
    && await orgDetail.getByText('Coordinator-led lifecycle', { exact: true }).count() === 1,
  { root: 'standalone Agent Team' });
await capture(orgDetail, 'REV-AORG-008', 'REV-AORG-008-standalone-team-runtime-history.png', 'Shared runtime/history with standalone Team root');
await orgDetail.close();

const orgEdit = await openPage(`/agent-orgs?${query({ view: 'org-edit', id: 'software-development-department' })}`);
const orgEditManager = orgEdit.locator('[data-test="handoff-manager-org"]');
await orgEditManager.getByRole('button', { name: 'Add handoff', exact: true }).click();
await orgEditManager.locator('[data-test="apply-handoff-draft"]').click();
record('AORG-RV8-036-org-handoff-editor-validates-complete-draft',
  await orgEditManager.getByText('Choose a source Agent.', { exact: true }).count() === 1
    && await orgEditManager.getByText('Choose a destination.', { exact: true }).count() === 1
    && await orgEditManager.getByText('Enter natural-language guidance for this condition.', { exact: true }).count() === 1,
  { requiredFields: ['From', 'To', 'When'] });
record('AORG-RV8-037-org-handoff-endpoint-eligibility',
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
record('AORG-RV8-038-when-conditions-are-orderable',
  await orgEditManager.locator('[data-test="when-condition-0"]').inputValue() === secondWhen
    && await orgEditManager.locator('[data-test="when-condition-1"]').inputValue() === firstWhen,
  { resultingOrder: [secondWhen, firstWhen] });
await orgEditManager.locator('[data-test="apply-handoff-draft"]').click();
await orgEditManager.getByRole('button', { name: 'Move handoff 3 up', exact: true }).click();
const addedHandoffCard = orgEditManager.locator('[data-test^="handoff-card-"]').filter({ hasText: secondWhen });
await addedHandoffCard.getByRole('button', { name: 'Edit', exact: true }).click();
await orgEditManager.locator('[data-test="when-condition-0"]').fill('This canceled edit must not persist.');
await orgEditManager.locator('[data-test="cancel-handoff-draft"]').click();
record('AORG-RV8-039-handoff-draft-can-be-canceled',
  await orgEditManager.getByText('This canceled edit must not persist.', { exact: true }).count() === 0
    && await orgEditManager.getByText(secondWhen, { exact: true }).count() === 1,
  { cancellationPreservedCommittedDraft: true });
await addedHandoffCard.getByRole('button', { name: 'Edit', exact: true }).click();
const updatedWhen = 'Implementation feedback needs a focused product revision.';
await orgEditManager.locator('[data-test="when-condition-0"]').fill(updatedWhen);
await orgEditManager.locator('[data-test="apply-handoff-draft"]').click();
await orgEditManager.locator('[data-test^="handoff-card-"]').last().getByRole('button', { name: 'Delete', exact: true }).click();
await orgEdit.getByRole('button', { name: 'Save changes', exact: true }).click();
record('AORG-RV8-040-handoff-authoring-supports-crud-reorder-and-atomic-save',
  await orgEditManager.locator('[data-test^="handoff-card-"]').count() === 2
    && await orgEditManager.getByText(updatedWhen, { exact: true }).count() === 1
    && await orgEdit.getByText('Saved locally for this prototype.', { exact: true }).count() === 1
    && await orgEditManager.getByText(/Via coordinator/i).count() === 0
    && await orgEditManager.getByText(/\d+ handoffs?|\d+ conditions?/i).count() === 0,
  { actions: ['add', 'edit', 'delete', 'reorder handoff', 'reorder When', 'cancel', 'save'], savedHandoffs: 2 });
await capture(orgEdit, 'REV-AORG-015', 'REV-AORG-015-agent-org-handoff-authoring.png', 'Clean Agent Org handoff authoring with From, To, and ordered When guidance');
await orgEdit.getByRole('button', { name: 'Cancel', exact: true }).click();
await orgEdit.locator('[data-test="org-card-software-development-department"]').getByRole('button', { name: 'View Details', exact: false }).click();
await orgEdit.waitForURL(/view=org-detail/);
await orgEdit.locator('[data-test="handoff-manager-org"]').waitFor();
record('AORG-RV8-041-saved-handoff-definition-is-inspectable',
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
record('AORG-RV8-042-self-resolving-delivery-is-rejected',
  await orgInvalidManager.getByText('This delivery resolves back to the source Agent.', { exact: true }).count() === 1,
  { from: '/requirements_engineer', to: '/requirements_engineer' });
await orgInvalidManager.locator('[data-test="cancel-handoff-draft"]').click();
await orgInvalidManager.getByRole('button', { name: 'Add handoff', exact: true }).click();
await orgInvalidManager.locator('select[data-test="handoff-from"]').selectOption('/requirements_engineer');
await orgInvalidManager.locator('select[data-test="handoff-to"]').selectOption('/product_design_prototyping_team');
await orgInvalidManager.locator('[data-test="when-condition-0"]').fill('Another condition belongs on the existing Handoff.');
await orgInvalidManager.locator('[data-test="apply-handoff-draft"]').click();
record('AORG-RV8-043-duplicate-effective-pair-is-rejected',
  await orgInvalidManager.getByText('This From/To pair already exists. Add another When condition to the existing handoff.', { exact: true }).count() === 1,
  { duplicatePair: ['/requirements_engineer', '/product_design_prototyping_team'] });
await orgInvalidManager.locator('[data-test="cancel-handoff-draft"]').click();
await orgInvalidEdit.getByRole('button', { name: 'Remove Product Design & Prototyping', exact: true }).click();
await orgInvalidEdit.getByRole('button', { name: 'Save changes', exact: true }).click();
record('AORG-RV8-044-org-member-impact-blocks-atomic-save',
  await orgInvalidManager.locator('[data-test="handoff-validation-summary"]').count() === 1
    && await orgInvalidEdit.getByText('Resolve the highlighted handoffs before saving this organization.', { exact: true }).count() === 1
    && await orgInvalidManager.getByText(/Unavailable · \/product_design_prototyping_team/).count() >= 1,
  { removedMember: 'Product Design & Prototyping', silentDeleteOrRetarget: false, saveBlocked: true });
await orgInvalidEdit.close();

const narrow = await openPage(`/agent-orgs?${query({ view: 'org-detail', id: 'software-development-department' })}`, { width: 390, height: 844 });
const overflow = await narrow.evaluate(() => ({ viewport: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
record('AORG-RV8-019-narrow-layout', overflow.scrollWidth === overflow.viewport
  && await narrow.getByRole('heading', { name: 'Software Development Department' }).count() === 1,
{ overflow });
await narrow.close();

record('AORG-RV8-020-no-runtime-errors', runtimeErrors.length === 0, { runtimeErrors });

const result = {
  package: 'AORG-FLAT-TEAM-001',
  revision: 'RV-008',
  mode: 'Product Experience Prototyping',
  baseUrl,
  generatedAt: new Date().toISOString(),
  result: failures.length === 0 ? 'PASS' : 'FAIL',
  checks,
  failures,
  runtimeErrors,
  captures,
};
await fs.writeFile(path.join(ticketRoot, 'browser-validation-rv-008.json'), `${JSON.stringify(result, null, 2)}\n`);
await fs.writeFile(path.join(evidenceRoot, 'capture-manifest.json'), `${JSON.stringify({ package: result.package, revision: result.revision, captures, reviewStatus: 'Non-normative pending user approval' }, null, 2)}\n`);
await browser.close();

console.log(JSON.stringify({ result: result.result, checks: checks.length, failures, runtimeErrors, captures: captures.length }, null, 2));
if (failures.length > 0 || runtimeErrors.length > 0) process.exitCode = 1;
