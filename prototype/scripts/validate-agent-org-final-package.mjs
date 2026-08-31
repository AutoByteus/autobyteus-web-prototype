import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const inProgressRoot = path.resolve('tickets/in-progress/AORG-FLAT-TEAM-001');
const doneRoot = path.resolve('tickets/done/AORG-FLAT-TEAM-001');
const ticketRoot = await fs.access(doneRoot).then(() => doneRoot).catch(() => inProgressRoot);
const outputRoot = path.join(ticketRoot, 'validation', 'final-package');
await fs.mkdir(outputRoot, { recursive: true });

const checks = [];
const record = (id, pass, evidence) => checks.push({ id, pass: Boolean(pass), evidence });
const read = (relativePath) => fs.readFile(path.join(ticketRoot, relativePath), 'utf8');

const [ticket, specification, decision, browserValidation, manifest] = await Promise.all([
  read('prototype-ticket.md'),
  read('ui-ux-spec.md'),
  read('user-decision-record.md'),
  read('browser-validation-rv-012.json').then(JSON.parse),
  read('visual-references/visual-reference-manifest.json').then(JSON.parse),
]);

record('AORG-FINAL-001-user-approval-recorded',
  decision.includes('- Product decision: `Approved`')
    && decision.includes('- Final screenshot authorization: `Granted after approval`')
    && decision.includes('2026-08-31'),
  { decision: 'Approved', date: '2026-08-31' });
record('AORG-FINAL-002-ui-ux-specification-approved',
  specification.includes('- Status: `Approved — normative UI/UX supplement`')
    && specification.includes('Normative `VIS-*` references: `VIS-001`–`VIS-020`')
    && !specification.includes('remain unapproved'),
  { revision: 'RV-012', references: 'VIS-001–VIS-020' });
record('AORG-FINAL-003-final-browser-journey',
  browserValidation.result === 'PASS'
    && browserValidation.revision === 'RV-012'
    && browserValidation.checks.length === 59
    && browserValidation.failures.length === 0
    && browserValidation.runtimeErrors.length === 0,
  { checks: browserValidation.checks.length, failures: browserValidation.failures.length, runtimeErrors: browserValidation.runtimeErrors.length });
record('AORG-FINAL-004-final-reference-manifest',
  manifest.package === 'AORG-FLAT-TEAM-001'
    && manifest.approvedPrototypeRevision === 'RV-012'
    && manifest.capturedAfterApproval === true
    && manifest.items.length === 20,
  { references: manifest.items.length, capturedAfterApproval: manifest.capturedAfterApproval });

const imageResults = [];
for (const item of manifest.items) {
  const filePath = path.join(ticketRoot, 'visual-references', item.filename);
  const bytes = await fs.readFile(filePath);
  const metadata = await sharp(bytes).metadata();
  const hash = crypto.createHash('sha256').update(bytes).digest('hex');
  imageResults.push({
    id: item.id,
    filename: item.filename,
    hashMatches: hash === item.sha256,
    dimensionsMatch: metadata.width === item.viewport.width && metadata.height === item.viewport.height,
    width: metadata.width,
    height: metadata.height,
  });
}
record('AORG-FINAL-005-final-reference-integrity',
  imageResults.length === 20 && imageResults.every((item) => item.hashMatches && item.dimensionsMatch),
  { images: imageResults });
record('AORG-FINAL-006-ticket-provenance',
  ticket.includes('AORG-FLAT-TEAM-001')
    && ticket.includes('891b4e667d51fffb92ebd85dd2dc90a8e0afcf2e')
    && ticket.includes('3de2c08b6f3d8cfdb75714edaa88b00d04d67aaf')
    && ticket.includes('8ef282ba77705180d985e7000d801f0e0068cdc1'),
  { package: 'AORG-FLAT-TEAM-001', behaviorCommit: '891b4e6', visualCaptureCommit: '3de2c08', sourcePin: '8ef282b' });

const failures = checks.filter((check) => !check.pass);
const result = {
  package: 'AORG-FLAT-TEAM-001',
  outcome: failures.length === 0 ? 'Prototype Completed' : 'FAIL',
  generatedAt: new Date().toISOString(),
  ticketRoot,
  checks,
  failures,
};
await fs.writeFile(path.join(outputRoot, 'final-package-validation.json'), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({ result: failures.length === 0 ? 'PASS' : 'FAIL', checks: checks.length, failures }, null, 2));
if (failures.length > 0) process.exitCode = 1;
