import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire('/home/autobyteus/workspace/autobyteus-web-prototype/package.json');
const { chromium } = require('playwright-core');

const baseUrl = process.env.VISUALIZER_URL || 'http://127.0.0.1:4193/';
const ticketRoot = '/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001/tickets/in-progress/REQPKG-NTHUI-001';
const screenshotRoot = path.join(ticketRoot, 'visual-references');
const evidencePath = path.join(ticketRoot, 'validation', 'browser-validation.json');
await mkdir(screenshotRoot, { recursive: true });

const checks = [];
const failures = [];
const record = (id, pass, detail) => {
  checks.push({ id, pass, detail });
  if (!pass) failures.push({ id, detail });
};
const equal = (id, actual, expected) => record(id, Object.is(actual, expected), { actual, expected });
const truthy = (id, value, detail = {}) => record(id, Boolean(value), { value, ...detail });

const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'no-preference' });
const page = await context.newPage();
const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => pageErrors.push(String(error)));

try {
  const response = await page.goto(baseUrl, { waitUntil: 'networkidle' });
  equal('BROWSER-001-http-200', response?.status(), 200);
  equal('BROWSER-002-title', await page.title(), 'Nested team hierarchy · Requirements visualizer');
  equal('BROWSER-003-one-primary-question', await page.locator('h1').count(), 1);
  equal('BROWSER-004-one-interactive-panel', await page.locator('.history-panel').count(), 1);
  equal('BROWSER-005-three-decisions', await page.locator('.decision-tab').count(), 3);

  const baselineNames = await page.locator('[data-treeitem]').evaluateAll((rows) => rows.map((row) => row.getAttribute('data-treeitem')));
  truthy('BROWSER-006-diagnostic-fixture-depth', baselineNames.length >= 18, { visibleTreeItems: baselineNames.length });
  equal('BROWSER-007-three-run-group', await page.locator('.run-main').count(), 3);
  equal('BROWSER-008-one-run-expanded', await page.locator('.run-main[aria-expanded="true"]').count(), 1);
  equal('BROWSER-009-three-sibling-subteams', await page.locator('[data-treeitem="requirements"], [data-treeitem="product_design"], [data-treeitem="software_engineering"]').count(), 3);
  equal('BROWSER-010-transient-task-team', await page.locator('[data-treeitem="transient_incident"][data-kind="transient-team"]').count(), 1);
  equal('BROWSER-011-selected-leaf', await page.locator('[data-treeitem="api_e2e_engineer"][aria-selected="true"]').count(), 1);
  equal('BROWSER-012-selected-ancestor-cues', await page.locator('.tree-row.is-selected-ancestor').count(), 2);

  const verifyFixtureStable = async (id) => {
    const names = await page.locator('[data-treeitem]').evaluateAll((rows) => rows.map((row) => row.getAttribute('data-treeitem')));
    equal(id, JSON.stringify(names), JSON.stringify(baselineNames));
  };

  await page.getByRole('radio', { name: /Connector rails/ }).click();
  equal('BROWSER-013-rails-class', await page.locator('.history-panel').getAttribute('class').then((value) => value?.includes('grammar-rails')), true);
  const railBorder = await page.locator('.tree-children').first().evaluate((element) => getComputedStyle(element).borderLeftWidth);
  truthy('BROWSER-014-rails-continuous-cue', parseFloat(railBorder) > 0, { railBorder });
  await verifyFixtureStable('BROWSER-015-rails-identical-fixture');
  await page.locator('.stage-toolbar').hover();
  await page.locator('.comparison-stage').screenshot({ path: path.join(screenshotRoot, 'VIS-RV001-320-default-rails.png') });

  await page.getByRole('radio', { name: /Nested surfaces/ }).click();
  const surfaceStyle = await page.locator('.tree-children').first().evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    border: getComputedStyle(element).borderLeftWidth,
  }));
  truthy('BROWSER-016-surface-continuous-cue', parseFloat(surfaceStyle.border) >= 4 && surfaceStyle.background !== 'rgba(0, 0, 0, 0)', surfaceStyle);
  await verifyFixtureStable('BROWSER-017-surfaces-identical-fixture');
  await page.locator('.stage-toolbar').hover();
  await page.locator('.comparison-stage').screenshot({ path: path.join(screenshotRoot, 'VIS-RV001-320-default-surfaces.png') });

  await page.getByRole('radio', { name: /Compact hybrid/ }).click();
  await verifyFixtureStable('BROWSER-018-hybrid-identical-fixture');
  await page.locator('.stage-toolbar').hover();
  await page.locator('.comparison-stage').screenshot({ path: path.join(screenshotRoot, 'VIS-RV001-320-default-hybrid.png') });

  await page.getByRole('button', { name: /DEC-002 Metadata/ }).click();
  await page.getByRole('radio', { name: /Always visible/ }).click();
  await verifyFixtureStable('BROWSER-019-always-metadata-identical-fixture');
  truthy('BROWSER-020-always-metadata-age-column', (await page.locator('.node-age').count()) >= baselineNames.length, { ageCount: await page.locator('.node-age').count() });
  await page.getByRole('radio', { name: /Responsive priority/ }).click();

  const stress = page.locator('.stress-controls');
  if (!(await stress.getAttribute('open'))) await stress.locator('summary').click();
  await page.getByRole('button', { name: '260px', exact: true }).click();
  await page.getByRole('button', { name: 'Extra Large', exact: true }).click();
  const narrowMetrics = await page.locator('.history-panel').evaluate((element) => ({
    width: element.getBoundingClientRect().width,
    fontSize: getComputedStyle(element).fontSize,
    horizontalOverflow: element.scrollWidth - element.clientWidth,
  }));
  equal('BROWSER-021-narrow-exact-width', narrowMetrics.width, 260);
  equal('BROWSER-022-extra-large-font', narrowMetrics.fontSize, '17.5px');
  equal('BROWSER-023-no-narrow-horizontal-overflow', narrowMetrics.horizontalOverflow, 0);
  equal('BROWSER-024-responsive-child-ages-yield', await page.locator('.tree-row.kind-agent .node-age, .tree-row.kind-transient-agent .node-age').count(), 0);

  const longNameMetrics = await page.locator('[data-treeitem="implementation_engineer"] .node-name').evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  truthy('BROWSER-025-narrow-long-name-truncates', longNameMetrics.scrollWidth > longNameMetrics.clientWidth, longNameMetrics);
  const focusedRow = page.locator('[data-treeitem="implementation_engineer"]');
  await focusedRow.focus();
  equal('BROWSER-026-keyboard-tooltip-visible', await focusedRow.locator('.identity-tooltip').evaluate((element) => getComputedStyle(element).display), 'grid');
  truthy('BROWSER-027-tooltip-recovers-name-role-age', (await focusedRow.locator('.identity-tooltip').innerText()).includes('implementation_engineer_for_workspace_navigation\nTeam member · Agent\nActive · last activity 6m ago'));
  await focusedRow.hover();
  equal('BROWSER-028-pointer-tooltip-visible', await focusedRow.locator('.identity-tooltip').evaluate((element) => getComputedStyle(element).display), 'grid');

  const panelBox = await page.locator('.history-panel').boundingBox();
  const actionBox = await page.getByRole('button', { name: /Actions for Improve nested/ }).boundingBox();
  truthy('BROWSER-029-narrow-run-action-inside-panel', panelBox && actionBox && actionBox.x + actionBox.width <= panelBox.x + panelBox.width && actionBox.x >= panelBox.x, { panelBox, actionBox });

  const selectedBeforeTeamToggle = await page.locator('[aria-selected="true"]').getAttribute('data-treeitem');
  const productTeam = page.locator('[data-treeitem="product_design"]');
  const requirementsExpandedBefore = await page.locator('[data-treeitem="requirements"]').getAttribute('aria-expanded');
  await productTeam.focus();
  await productTeam.press('Enter');
  equal('BROWSER-030-structural-team-collapses', await productTeam.getAttribute('aria-expanded'), 'false');
  equal('BROWSER-031-structural-toggle-no-fabricated-selection', await page.locator('[aria-selected="true"]').getAttribute('data-treeitem'), selectedBeforeTeamToggle);
  equal('BROWSER-032-independent-sibling-disclosure', await page.locator('[data-treeitem="requirements"]').getAttribute('aria-expanded'), requirementsExpandedBefore);
  await productTeam.press('Enter');
  equal('BROWSER-033-structural-team-reopens', await productTeam.getAttribute('aria-expanded'), 'true');

  const coordinator = page.locator('[data-treeitem="coordinator"]');
  await coordinator.focus();
  await coordinator.press('ArrowDown');
  equal('BROWSER-034-roving-arrow-navigation', await page.locator('[data-treeitem="release_observer"]').evaluate((element) => document.activeElement === element), true);
  await page.locator('[data-treeitem="release_observer"]').press('Enter');
  equal('BROWSER-035-concrete-agent-selection', await page.locator('[aria-selected="true"]').getAttribute('data-treeitem'), 'release_observer');

  const select = page.locator('.select-control select');
  await select.selectOption('collapsed');
  equal('BROWSER-036-collapsed-preset', await page.locator('.tree-row[aria-expanded="true"]').count(), 0);
  await page.getByRole('button', { name: 'Reveal selected leaf', exact: true }).click();
  equal('BROWSER-037-reveal-selects-leaf', await page.locator('[aria-selected="true"]').getAttribute('data-treeitem'), 'api_e2e_engineer');
  equal('BROWSER-038-reveal-opens-parent', await page.locator('[data-treeitem="software_engineering"]').getAttribute('aria-expanded'), 'true');
  equal('BROWSER-039-reveal-opens-deeper-parent', await page.locator('[data-treeitem="runtime_quality"]').getAttribute('aria-expanded'), 'true');

  const disclosureBeforeRefresh = await page.locator('.tree-row[aria-expanded="true"]').evaluateAll((rows) => rows.map((row) => row.getAttribute('data-treeitem')));
  const selectionBeforeRefresh = await page.locator('[aria-selected="true"]').getAttribute('data-treeitem');
  await page.getByRole('button', { name: 'Quiet refresh', exact: true }).click();
  equal('BROWSER-040-quiet-refresh-expansion', JSON.stringify(await page.locator('.tree-row[aria-expanded="true"]').evaluateAll((rows) => rows.map((row) => row.getAttribute('data-treeitem')))), JSON.stringify(disclosureBeforeRefresh));
  equal('BROWSER-041-quiet-refresh-selection', await page.locator('[aria-selected="true"]').getAttribute('data-treeitem'), selectionBeforeRefresh);

  await page.getByRole('button', { name: /Actions for Improve nested/ }).click();
  equal('BROWSER-042-active-run-action-menu', await page.getByRole('menuitem', { name: 'Terminate run' }).count(), 1);
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Reset tree', exact: true }).click();
  await page.getByRole('radio', { name: /Child age on demand/ }).click();
  await page.getByRole('button', { name: /DEC-003 Team identity/ }).click();
  await page.getByRole('radio', { name: /Header typography/ }).click();
  equal('BROWSER-043-header-role-text-visible', await page.locator('[data-treeitem="software_engineering"] .role-kicker').evaluate((element) => getComputedStyle(element).display), 'block');
  await page.getByRole('radio', { name: /Compact team band/ }).click();
  const bandStyle = await page.locator('[data-treeitem="software_engineering"]').evaluate((element) => ({ borderLeftWidth: getComputedStyle(element).borderLeftWidth, fontWeight: getComputedStyle(element.querySelector('.node-name')).fontWeight }));
  truthy('BROWSER-044-band-noncolor-structure', parseFloat(bandStyle.borderLeftWidth) >= 4 && Number(bandStyle.fontWeight) >= 700, bandStyle);
  equal('BROWSER-045-transient-shape-differs', await page.locator('[data-treeitem="transient_incident"] .team-glyph').evaluate((element) => getComputedStyle(element).borderRadius), '3px');
  await verifyFixtureStable('BROWSER-046-team-identity-identical-fixture');
  await page.locator('.stage-toolbar').hover();
  await page.locator('.comparison-stage').screenshot({ path: path.join(screenshotRoot, 'VIS-RV001-260-extra-large-on-demand-band.png') });

  await page.getByRole('button', { name: '520px', exact: true }).click();
  await page.getByRole('button', { name: 'Default', exact: true }).click();
  const wideMetrics = await page.locator('.history-panel').evaluate((element) => ({ width: element.getBoundingClientRect().width, overflow: element.scrollWidth - element.clientWidth }));
  equal('BROWSER-047-wide-exact-width', wideMetrics.width, 520);
  equal('BROWSER-048-wide-no-horizontal-overflow', wideMetrics.overflow, 0);
  await page.locator('.stage-toolbar').hover();
  await page.locator('.comparison-stage').screenshot({ path: path.join(screenshotRoot, 'VIS-RV001-520-default-on-demand-band.png') });

  const ariaRows = await page.locator('[data-treeitem]').evaluateAll((rows) => rows.map((row) => ({
    id: row.getAttribute('data-treeitem'),
    level: row.getAttribute('aria-level'),
    pos: row.getAttribute('aria-posinset'),
    size: row.getAttribute('aria-setsize'),
    expanded: row.hasAttribute('aria-expanded') ? row.getAttribute('aria-expanded') : null,
  })));
  truthy('BROWSER-049-hierarchy-programmatic', ariaRows.every((row) => row.level && row.pos && row.size), { rows: ariaRows.length });
  truthy('BROWSER-050-team-expanded-programmatic', ariaRows.filter((row) => ['software_engineering', 'runtime_quality'].includes(row.id)).every((row) => row.expanded === 'true'));
  equal('BROWSER-051-reviewed-summary', await page.locator('.summary-button strong').innerText(), '3/3 reviewed');
  equal('BROWSER-052-no-console-errors', consoleErrors.length, 0);
  equal('BROWSER-053-no-page-errors', pageErrors.length, 0);

  const reducedContext = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(baseUrl, { waitUntil: 'networkidle' });
  const reducedTransition = await reducedPage.locator('.chevron').first().evaluate((element) => getComputedStyle(element).transitionDuration);
  truthy('BROWSER-054-reduced-motion-stable', ['0s', '1e-06s', '0.000001s'].includes(reducedTransition), { reducedTransition });
  equal('BROWSER-055-reduced-motion-content-complete', await reducedPage.locator('[data-treeitem="api_e2e_engineer"]').count(), 1);
  await reducedContext.close();
} catch (error) {
  failures.push({ id: 'VALIDATOR-EXCEPTION', detail: String(error?.stack || error) });
} finally {
  const result = {
    package: 'nested-team-hierarchy-ui',
    ticket: 'REQPKG-NTHUI-001',
    visualizerRevision: 'RV-001',
    url: baseUrl,
    viewport: '1440x1100',
    reducedMotionViewport: '1280x900',
    total: checks.length,
    passed: checks.filter((check) => check.pass).length,
    failed: failures.length,
    consoleErrors,
    pageErrors,
    checks,
    failures,
    completedAt: new Date().toISOString(),
  };
  await writeFile(evidencePath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  await context.close();
  await browser.close();
  console.log(JSON.stringify({ total: result.total, passed: result.passed, failed: result.failed, evidencePath }, null, 2));
  if (failures.length > 0) process.exitCode = 1;
}
