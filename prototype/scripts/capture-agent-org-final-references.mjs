import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const ticketRoot = path.resolve('tickets/in-progress/AORG-FLAT-TEAM-001');
const reviewRoot = path.join(ticketRoot, 'review-evidence', 'rv-012');
const visualRoot = path.join(ticketRoot, 'visual-references');
const validationPath = path.join(ticketRoot, 'browser-validation-rv-012.json');
const decisionPath = path.join(ticketRoot, 'user-decision-record.md');

const mappings = [
  ['REV-AORG-RV12-001-agent-team-catalog.png', 'VIS-001-agent-team-catalog-desktop-1440x900.png'],
  ['REV-AORG-RV12-002-agent-team-authoring.png', 'VIS-002-agent-team-authoring-desktop-1440x900.png'],
  ['REV-AORG-RV12-018-agent-team-detail.png', 'VIS-003-agent-team-detail-desktop-1440x900.png'],
  ['REV-AORG-RV12-012-team-local-handoff-detail.png', 'VIS-004-team-handoff-detail-desktop-1440x900.png'],
  ['REV-AORG-RV12-019-agent-team-members.png', 'VIS-005-agent-team-members-desktop-1440x900.png'],
  ['REV-AORG-RV12-011-agent-member-detail.png', 'VIS-006-agent-member-detail-desktop-1440x900.png'],
  ['REV-AORG-RV12-016-agent-team-builder-narrow.png', 'VIS-007-agent-team-builder-narrow-390x844.png'],
  ['REV-AORG-RV12-013-team-local-handoff-authoring.png', 'VIS-008-team-handoff-authoring-desktop-1440x900.png'],
  ['REV-AORG-RV12-003-agent-org-catalog.png', 'VIS-009-agent-org-catalog-desktop-1440x900.png'],
  ['REV-AORG-RV12-004-agent-org-authoring.png', 'VIS-010-agent-org-authoring-desktop-1440x900.png'],
  ['REV-AORG-RV12-020-agent-org-inline-member-picker-narrow.png', 'VIS-011-agent-org-authoring-narrow-390x844.png'],
  ['REV-AORG-RV12-005-agent-org-detail.png', 'VIS-012-agent-org-detail-desktop-1440x900.png'],
  ['REV-AORG-RV12-014-agent-org-handoff-detail.png', 'VIS-013-agent-org-handoff-detail-desktop-1440x900.png'],
  ['REV-AORG-RV12-006-agent-org-configuration.png', 'VIS-014-agent-org-configuration-desktop-1440x900.png'],
  ['REV-AORG-RV12-007-agent-org-placement-overrides.png', 'VIS-015-agent-org-placement-overrides-desktop-1440x900.png'],
  ['REV-AORG-RV12-008-agent-org-active-unfocused.png', 'VIS-016-agent-org-active-unfocused-desktop-1440x900.png'],
  ['REV-AORG-RV12-009-agent-org-direct-agent-focus.png', 'VIS-017-agent-org-direct-agent-focus-desktop-1440x900.png'],
  ['REV-AORG-RV12-010-agent-org-team-coordinator-focus.png', 'VIS-018-agent-org-team-focus-desktop-1440x900.png'],
  ['REV-AORG-RV12-015-agent-org-handoff-authoring.png', 'VIS-019-agent-org-handoff-authoring-desktop-1440x900.png'],
  ['REV-AORG-RV12-017-agent-org-configuration-narrow.png', 'VIS-020-agent-org-configuration-narrow-390x844.png'],
];

const [validation, reviewManifest] = await Promise.all([
  fs.readFile(validationPath, 'utf8').then(JSON.parse),
  fs.readFile(path.join(reviewRoot, 'capture-manifest.json'), 'utf8').then(JSON.parse),
  fs.access(decisionPath),
]);

if (validation.result !== 'PASS' || validation.revision !== 'RV-012' || validation.checks.length !== 59 || validation.runtimeErrors.length !== 0) {
  throw new Error('RV-012 final browser validation is not a clean 59/59 pass.');
}
if (reviewManifest.captures.length !== 20) throw new Error('Expected 20 freshly validated capture states.');

await fs.mkdir(visualRoot, { recursive: true });
const captureByFilename = new Map(reviewManifest.captures.map((capture) => [capture.filename, capture]));
const items = [];
for (const [sourceFilename, filename] of mappings) {
  const capture = captureByFilename.get(sourceFilename);
  if (!capture) throw new Error(`Missing validated capture ${sourceFilename}`);
  const sourcePath = path.join(reviewRoot, sourceFilename);
  const targetPath = path.join(visualRoot, filename);
  await fs.copyFile(sourcePath, targetPath);
  const bytes = await fs.readFile(targetPath);
  items.push({
    id: filename.match(/^VIS-\d+/)?.[0],
    filename,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    viewport: capture.viewport,
    state: capture.state,
    route: new URL(capture.url).pathname + new URL(capture.url).search,
    fixtureContent: 'Illustrative deterministic prototype data; layout, labels, controls, state meaning, and interaction treatment are normative.',
  });
}

const manifest = {
  package: 'AORG-FLAT-TEAM-001',
  outcome: 'Prototype Completed',
  approvedPrototypeRevision: 'RV-012',
  approvedRunnableCommit: '891b4e667d51fffb92ebd85dd2dc90a8e0afcf2e',
  userApproval: 'user-decision-record.md',
  requirementsAuthority: { revision: 'RER-013', commit: '86df311c46ac407e52612a2150422756462a891c' },
  capturedAfterApproval: true,
  capturedAt: validation.generatedAt,
  validatedJourneyResult: { checks: validation.checks.length, failures: validation.failures.length, runtimeErrors: validation.runtimeErrors.length },
  items,
};
await fs.writeFile(path.join(visualRoot, 'visual-reference-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

const rows = items.map((item) => `| \`${item.id}\` | [${item.filename}](${item.filename}) | ${item.viewport.width}×${item.viewport.height} | ${item.state} |`).join('\n');
const readme = `# AORG-FLAT-TEAM-001 Normative Visual References\n\nThese screenshots were captured after explicit user approval of RV-012 and a\nclean 59/59 final browser-validation pass. They are normative implementation\nreferences together with \`../ui-ux-spec.md\`. Deterministic names, messages,\nrun IDs, timestamps, paths, and record values are illustrative; the visible\nlayout, hierarchy, styling, labels, controls, feedback, responsive behavior,\nand state meanings are requirements-defining.\n\n| ID | File | Viewport | Approved state |\n| --- | --- | --- | --- |\n${rows}\n\nHashes, routes, fixture boundaries, and capture provenance are recorded in\n[visual-reference-manifest.json](visual-reference-manifest.json).\n`;
await fs.writeFile(path.join(visualRoot, 'README.md'), readme);

console.log(JSON.stringify({ result: 'PASS', references: items.length, visualRoot }, null, 2));
