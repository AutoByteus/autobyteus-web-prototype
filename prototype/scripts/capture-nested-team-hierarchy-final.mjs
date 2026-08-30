import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const baseUrl = process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:4193';
const ticketRoot = path.resolve('tickets/in-progress/REQPKG-NTHUI-001');
const outputRoot = path.join(ticketRoot, 'visual-references');
await fs.mkdir(outputRoot, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking'],
});

const runtimeErrors = [];
const captures = [];

const params = (overrides = {}) => new URLSearchParams({
  prototypeReview: 'nested-team-hierarchy',
  reviewView: 'proposal',
  hierarchy: 'rails',
  metadata: 'responsive',
  teamIdentity: 'icon',
  panelWidth: '320',
  fontSize: 'default',
  treeState: 'collapsed',
  ...overrides,
});

const openPage = async (overrides) => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
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

const capture = async ({ id, filename, overrides, focusAddress, state }) => {
  const page = await openPage(overrides);
  if (focusAddress) {
    const focusedRow = page.locator(`[role="treeitem"][data-member-address="${focusAddress}"]`);
    await focusedRow.focus();
    await page.waitForTimeout(200);
  }
  const shell = page.locator('[data-test="app-left-panel-shell"]');
  const box = await shell.boundingBox();
  const tree = page.locator('[data-test="workspace-team-execution-tree"]');
  const outputPath = path.join(outputRoot, filename);
  await page.screenshot({
    path: outputPath,
    clip: {
      x: Math.max(0, box?.x || 0),
      y: 0,
      width: Math.min((box?.width || Number(overrides.panelWidth)) + 1, 1440),
      height: 1000,
    },
  });
  captures.push({
    id,
    filename,
    state,
    url: page.url(),
    viewport: { width: 1440, height: 1000 },
    panelWidth: Math.round(box?.width || 0),
    visibleRows: await tree.locator('[role="treeitem"]').count(),
    hierarchy: await tree.getAttribute('data-hierarchy-treatment'),
    metadata: await tree.getAttribute('data-metadata-treatment'),
    teamIdentity: await tree.getAttribute('data-team-identity'),
  });
  await page.close();
};

await capture({
  id: 'VIS-001',
  filename: 'VIS-001-workspace-hierarchy-default-320.png',
  overrides: { panelWidth: '320', fontSize: 'default', treeState: 'collapsed' },
  state: 'Approved default: active run expanded and nested teams collapsed',
});
await capture({
  id: 'VIS-002',
  filename: 'VIS-002-workspace-hierarchy-one-team-expanded-320.png',
  overrides: { panelWidth: '320', fontSize: 'default', treeState: 'one' },
  state: 'Product Design team expanded at the default panel width',
});
await capture({
  id: 'VIS-003',
  filename: 'VIS-003-workspace-hierarchy-selected-deep-leaf-320.png',
  overrides: { panelWidth: '320', fontSize: 'default', treeState: 'selected' },
  state: 'Deep leaf selected with required ancestor path revealed',
});
await capture({
  id: 'VIS-004',
  filename: 'VIS-004-workspace-hierarchy-focus-recovery-260-xl.png',
  overrides: { panelWidth: '260', fontSize: 'extra-large', treeState: 'selected' },
  focusAddress: '/product-design/research-operations',
  state: 'Narrowest panel and Extra Large font with full identity revealed on keyboard focus',
});
await capture({
  id: 'VIS-005',
  filename: 'VIS-005-workspace-hierarchy-deep-tree-520.png',
  overrides: { panelWidth: '520', fontSize: 'default', treeState: 'deep' },
  state: 'Widest panel with several sibling teams, deeper team, and transient task team expanded',
});

const manifest = {
  package: 'nested-team-hierarchy-ui',
  ticket: 'REQPKG-NTHUI-001',
  prototypeRevision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  capturedAfterUserApproval: true,
  capturedAt: new Date().toISOString(),
  result: runtimeErrors.length === 0 ? 'PASS' : 'FAIL',
  runtimeErrors,
  captures,
};
await fs.writeFile(path.join(outputRoot, 'visual-reference-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
await browser.close();

console.log(JSON.stringify({ result: manifest.result, captures: captures.length, runtimeErrors }, null, 2));
if (runtimeErrors.length > 0) process.exitCode = 1;
