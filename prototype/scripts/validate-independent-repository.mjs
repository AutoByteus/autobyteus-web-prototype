#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { lstat, readFile, readlink, readdir } from 'node:fs/promises'
import { basename, resolve } from 'node:path'

const root = resolve(new URL('../..', import.meta.url).pathname)
const expectedRoot = '/home/autobyteus/workspace/autobyteus-web-prototype'
const expectedRemote = 'https://github.com/AutoByteus/autobyteus-web-prototype.git'
const workspaceRepository = '/home/autobyteus/workspace/autobyteus-workspace'
const oldWorkspaceRoot = `${workspaceRepository}/autobyteus-web-prototype`
const oldTaskRoot = '/home/autobyteus/workspace/.codex/worktrees/initial-prototype-baseline/autobyteus-web-prototype'
const sourcePin = '8ef282ba77705180d985e7000d801f0e0068cdc1'
const independentBase = '0b02b0e1fbdbdefb78b91b1705bd497663694e0f'
const protectedWorkspaceCommit = '56397ba1ac0741198ff88387f419bf216d798661'
const requirementsWorkspaceBasis = 'fb1335867a4223b2499e4513f58c609b6ac33ab4'
const protectedWorkspaceTree = '21c400d2903a362737f3ce41d876be3fbe2abab5'
const approvedTree = 'ca1d3f9ed58f0fc1f673ff013a351841bf78e575'
const priorIntegrationCommit = '0100f78d34344d87cf8b6f3627d5df2b50c935d4'
const requireRemoteSync = process.env.REQUIRE_REMOTE_SYNC === '1'
const requireWorkspaceRemoval = process.env.REQUIRE_WORKSPACE_REMOVAL === '1'

const activeDocs = [
  'README.md', 'ui-ux-spec.md', 'prototype-bootstrap-report.md',
  'prototype-runbook.md', 'comparison-report.md', 'evidence-index.md',
  'pp-gap-009-correction.md', 'pp-gap-010-correction.md',
  'final-reference-screenshots/manifest.json',
  'independent-repository-restoration.md',
]
const authorizedCurrentTreeChanges = new Set([
  'README.md', 'comparison-report.md', 'evidence-index.md',
  'evidence/presentation-code/presentation-code-parity-summary.json',
  'evidence/presentation-code/presentation-code-parity.json',
  'evidence/runtime/boundary-validation.json',
  'final-reference-screenshots/manifest.json',
  'independent-repository-migration.md', 'package.json',
  'personal-integration-record.md', 'pp-gap-009-correction.md',
  'pp-gap-010-correction.md', 'product-prototyper-baseline-review.md',
  'prototype-bootstrap-report.md', 'prototype-runbook.md',
  'prototype/scripts/audit-presentation-parity.mjs',
  'prototype/scripts/validate-final-package.mjs',
  'prototype/scripts/validate-gap-009-package.mjs',
  'prototype/scripts/validate-gap-010-package.mjs',
  'prototype/scripts/validate-independent-repository.mjs',
  'prototype/scripts/validate-personal-integration.mjs',
  'prototype/scripts/validate-repository-placement.mjs',
  'repository-placement-correction.md', 'ui-ux-spec.md',
  'workspace-repository-return.md',
])
const allowedRer017Additions = new Set([
  'independent-repository-restoration.md',
  'evidence/repository-independence/rer-017-current-workspace-tree-inventory.json',
  'evidence/repository-independence/rer-017-restoration-proof.json',
  'evidence/repository-independence/rer-017-operation-order.txt',
  'evidence/repository-independence/rer-017-validation.txt',
  'tickets/done/initial-prototype-baseline/prototype-ticket.md',
])

const checks = []
function check(name, pass, detail = '') {
  checks.push({ name, pass, detail })
  process.stdout.write(`${pass ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}\n`)
}
function gitRaw(...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
}
function git(...args) { return gitRaw(...args).trim() }
function gitExists(revision) {
  try { gitRaw('cat-file', '-e', revision); return true } catch { return false }
}
function isAncestor(ancestor, descendant = 'HEAD') {
  try { gitRaw('merge-base', '--is-ancestor', ancestor, descendant); return true } catch { return false }
}
async function exists(path) {
  try { await lstat(path); return true } catch { return false }
}
function gitBlobId(buffer) {
  return createHash('sha1').update(`blob ${buffer.length}\0`).update(buffer).digest('hex')
}
async function currentBlobId(path) {
  const absolute = resolve(root, path)
  const info = await lstat(absolute)
  const bytes = info.isSymbolicLink() ? Buffer.from(await readlink(absolute)) : await readFile(absolute)
  return gitBlobId(bytes)
}
async function findNestedGit(dir, relative = '') {
  const found = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!relative && entry.name === '.git') continue
    if (['node_modules', '.nuxt', '.output'].includes(entry.name)) continue
    const childRelative = relative ? `${relative}/${entry.name}` : entry.name
    if (entry.name === '.git') { found.push(childRelative); continue }
    if (entry.isDirectory()) found.push(...await findNestedGit(resolve(dir, entry.name), childRelative))
  }
  return found
}

check('validator runs from the canonical independent sibling root', root === expectedRoot)
check('Git top-level is the independent prototype root', git('rev-parse', '--show-toplevel') === root)
check('active branch is personal', git('branch', '--show-current') === 'personal')
check('origin is the established independent GitHub remote', git('remote', 'get-url', 'origin') === expectedRemote)
check('RER-013 independent base commit exists', gitExists(`${independentBase}^{commit}`))
check('current independent history descends from RER-013 base', isAncestor(independentBase))
check('repository has no merge commit after the independent base', gitRaw('rev-list', '--merges', `${independentBase}..HEAD`).trim() === '')
check('workspace commit history was not imported', !gitExists(`${protectedWorkspaceCommit}^{commit}`) && !gitExists(`${requirementsWorkspaceBasis}^{commit}`) && !gitExists(`${priorIntegrationCommit}^{commit}`))
check('approved source repository history was not imported', !gitExists(`${sourcePin}^{commit}`))
check('repository has no .gitmodules file', !await exists(resolve(root, '.gitmodules')))
check('repository has no configured submodule', gitRaw('submodule', 'status').trim() === '')
const indexRows = gitRaw('ls-files', '--stage').trimEnd().split('\n').filter(Boolean)
check('Git index contains no gitlink', indexRows.every(row => !row.startsWith('160000 ')))
check('Git index modes are ordinary files or symlinks', indexRows.every(row => /^(100644|100755|120000) /.test(row)))
const nestedGit = await findNestedGit(root)
check('repository content contains no nested .git metadata', nestedGit.length === 0, nestedGit.join(', '))
check('selected source frontend was not copied into prototype repository', !await exists(resolve(root, 'autobyteus-web')))

const currentInventory = JSON.parse(await readFile(resolve(root, 'evidence/repository-independence/rer-017-current-workspace-tree-inventory.json'), 'utf8'))
check('protected workspace project tree is recorded exactly', currentInventory.protectedPrototypeTree === protectedWorkspaceTree)
check('current workspace commit and requirements basis are recorded', currentInventory.protectedWorkspaceCommit === protectedWorkspaceCommit && currentInventory.requirementsSpecifiedWorkspaceBasisCommit === requirementsWorkspaceBasis)
check('current inventory records all 2,010 tracked project rows', currentInventory.trackedRowCount === 2010 && currentInventory.rows.length === 2010)
const currentMissing = []
const currentModified = []
for (const row of currentInventory.rows) {
  if (!await exists(resolve(root, row.path))) { currentMissing.push(row.path); continue }
  if (await currentBlobId(row.path) !== row.blob) currentModified.push(row.path)
}
check('all 2,010 current workspace project rows remain present', currentMissing.length === 0, currentMissing.slice(0, 5).join(', '))
const unauthorizedCurrentModified = currentModified.filter(path => !authorizedCurrentTreeChanges.has(path))
check('current-tree changes are only enumerated locator/provenance/validator files', unauthorizedCurrentModified.length === 0, `${currentModified.length} authorized; ${unauthorizedCurrentModified.join(', ')}`)
const currentBinaryRows = currentInventory.rows.filter(row => /\.(?:png|jpe?g|gif|webp|ico|woff2?|ttf|otf|pdf)$/i.test(row.path))
const changedCurrentBinary = currentBinaryRows.filter(row => currentModified.includes(row.path))
check('all 848 current binary evidence/assets retain exact identity', currentBinaryRows.length === 848 && changedCurrentBinary.length === 0, `${currentBinaryRows.length - changedCurrentBinary.length}/${currentBinaryRows.length}`)

const approvedInventory = JSON.parse(await readFile(resolve(root, 'evidence/repository-independence/rer-013-approved-tree-inventory.json'), 'utf8'))
check('approved source-tree identity remains exact', approvedInventory.approvedPrototypeTree === approvedTree)
check('approved inventory records all 2,001 files', approvedInventory.approvedFileCount === 2001 && approvedInventory.rows.length === 2001)
const approvedMissing = []
const approvedModified = []
for (const row of approvedInventory.rows) {
  if (!await exists(resolve(root, row.path))) { approvedMissing.push(row.path); continue }
  if (await currentBlobId(row.path) !== row.blob) approvedModified.push(row.path)
}
check('all 2,001 approved files remain present', approvedMissing.length === 0, approvedMissing.slice(0, 5).join(', '))
const unauthorizedApprovedModified = approvedModified.filter(path => !authorizedCurrentTreeChanges.has(path))
check('approved-tree differences remain limited to enumerated active text', unauthorizedApprovedModified.length === 0, `${approvedModified.length} authorized; ${unauthorizedApprovedModified.join(', ')}`)
const approvedBinaryRows = approvedInventory.rows.filter(row => /\.(?:png|jpe?g|gif|webp|ico|woff2?|ttf|otf|pdf)$/i.test(row.path))
const changedApprovedBinary = approvedBinaryRows.filter(row => approvedModified.includes(row.path))
check('all approved binary evidence/assets preserve exact Git blobs', approvedBinaryRows.length === 848 && changedApprovedBinary.length === 0, `${approvedBinaryRows.length - changedApprovedBinary.length}/${approvedBinaryRows.length}`)

const baselinePaths = new Set(currentInventory.rows.map(row => row.path))
const trackedPaths = gitRaw('ls-files').trimEnd().split('\n').filter(Boolean)
const unexpectedTrackedAdditions = trackedPaths.filter(path => !baselinePaths.has(path) && !allowedRer017Additions.has(path))
check('tracked additions contain only enumerated RER-017 ticket/evidence files', unexpectedTrackedAdditions.length === 0, unexpectedTrackedAdditions.join(', '))
const missingAdditions = []
for (const path of allowedRer017Additions) if (!await exists(resolve(root, path))) missingAdditions.push(path)
check('all RER-017 ticket/evidence additions are present', missingAdditions.length === 0, missingAdditions.join(', '))
check('terminal RER-017 additions are tracked after push', !requireRemoteSync || [...allowedRer017Additions].every(path => trackedPaths.includes(path)))

const activeText = Object.fromEntries(await Promise.all(activeDocs.map(async path => [path, await readFile(resolve(root, path), 'utf8')])))
const combinedActive = Object.values(activeText).join('\n')
check('active package locators use only the independent sibling root', combinedActive.includes(expectedRoot) && !combinedActive.includes(oldWorkspaceRoot) && !combinedActive.includes(oldTaskRoot))
check('active ownership names the independent GitHub repository', combinedActive.includes(expectedRemote))
check('active requirements revision is RER-017', ['README.md', 'ui-ux-spec.md', 'prototype-runbook.md', 'evidence-index.md', 'independent-repository-restoration.md'].every(path => activeText[path].includes('RER-017')))
check('approved source pin remains explicit across identity artifacts', ['README.md', 'ui-ux-spec.md', 'prototype-runbook.md', 'prototype-bootstrap-report.md', 'comparison-report.md'].every(path => activeText[path].includes(sourcePin)))
check('PPA-001 and PPA-002 remain explicit', combinedActive.includes('PPA-001') && combinedActive.includes('PPA-002'))
check('both user confirmations remain explicit', combinedActive.includes('“approved”') && combinedActive.includes('“done. i checked. thanks”'))
check('RER-015 workspace return is explicitly historical', (await readFile(resolve(root, 'workspace-repository-return.md'), 'utf8')).includes('Historical RER-015 Record') && (await readFile(resolve(root, 'workspace-repository-return.md'), 'utf8')).includes('Superseded by RER-017'))
check('historical placement and integration records identify RER-017 owner', (await readFile(resolve(root, 'repository-placement-correction.md'), 'utf8')).includes('Current RER-017 canonical root') && (await readFile(resolve(root, 'personal-integration-record.md'), 'utf8')).includes('RER-017 now restores'))

const manifest = JSON.parse(await readFile(resolve(root, 'final-reference-screenshots/manifest.json'), 'utf8'))
const visualIds = Array.from({ length: 17 }, (_, index) => `VIS-${String(index + 1).padStart(3, '0')}`)
check('final-reference manifest retains VIS-001 through VIS-017', manifest.results.map(row => row.id).join(',') === visualIds.join(','))
check('final-reference manifest retains source pin and user confirmation', manifest.sourceCommit === sourcePin && manifest.approvalReference.includes('done. i checked. thanks'))
check('all final-reference paths use independent root', manifest.results.every(row => row.imagePath.startsWith(`${root}/final-reference-screenshots/`)))
for (const row of manifest.results) {
  const bytes = await readFile(resolve(root, 'final-reference-screenshots', basename(row.imagePath)))
  check(`${row.id} hash remains exact`, createHash('sha256').update(bytes).digest('hex') === row.screenshotSha256)
}

const gapSummary = JSON.parse(await readFile(resolve(root, 'evidence/gap-010/gap-010-summary.json'), 'utf8'))
const gapResults = JSON.parse(await readFile(resolve(root, 'evidence/gap-010/gap-010-results.json'), 'utf8'))
check('JRN-050-A through JRN-050-E remain 5/5 exact with zero browser errors', gapSummary.total === 5 && gapSummary.passed === 5 && gapSummary.failed.length === 0 && gapSummary.sourceBrowserErrors.length === 0 && gapSummary.prototypeBrowserErrors.length === 0 && gapResults.checkpoints.map(row => row.checkpoint.id).join(',') === 'JRN-050-A,JRN-050-B,JRN-050-C,JRN-050-D,JRN-050-E')
check('JRN-050-E member-focus contract remains exact', ['source', 'prototype'].every(target => gapResults.checkpoints.at(-1)?.[target]?.state?.selectedTeam?.focusedMemberAddress === '/writer' && gapResults.checkpoints.at(-1)?.[target]?.semantic?.teamWorkspaceHeader === 'writer'))

const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
check('active placement and integration scripts use independent validator', ['validate:repository-placement', 'validate:personal-integration', 'validate:independent-repository'].every(name => packageJson.scripts[name] === 'node prototype/scripts/validate-independent-repository.mjs'))

const proof = JSON.parse(await readFile(resolve(root, 'evidence/repository-independence/rer-017-restoration-proof.json'), 'utf8'))
check('RER-017 proof records target-first source protection', proof.requirementsRevision === 'RER-017' && proof.independentBaseCommit === independentBase && proof.protectedWorkspaceProjectTree === protectedWorkspaceTree && proof.workspaceSourceRemovedBeforeIndependentPush === false)
check('RER-017 proof preserves approval and visual identities', proof.approvedFileCount === 2001 && proof.approvedBinaryEvidenceAndAssetsCount === 848 && proof.visualReferences.length === 17 && proof.ppa.join(',') === 'PPA-001,PPA-002')
check('RER-017 operation-order log records no source-first deletion', (await readFile(resolve(root, 'evidence/repository-independence/rer-017-operation-order.txt'), 'utf8')).includes('source_removed_before_target_push=no'))

let remoteHead = ''
try { remoteHead = git('rev-parse', 'refs/remotes/origin/personal') } catch {
  // A missing remote-tracking ref is permitted only before the first fetch/push.
}
const localHead = git('rev-parse', 'HEAD')
check('origin/personal is pre-push base or equals local personal', requireRemoteSync ? remoteHead === localHead : (remoteHead === independentBase || remoteHead === localHead), remoteHead || 'missing')
const status = gitRaw('status', '--porcelain').trim()
check('working tree is clean when terminal remote verification is required', !requireRemoteSync || status === '', status ? `${status.split('\n').length} candidate changes` : 'clean')
check('workspace source remains protected before independent push', requireRemoteSync || await exists(oldWorkspaceRoot))
check('workspace duplicate is absent only for terminal cutover validation', !requireWorkspaceRemoval || !await exists(oldWorkspaceRoot), requireWorkspaceRemoval ? 'terminal' : 'pre-removal candidate')

const failed = checks.filter(row => !row.pass)
if (failed.length) {
  process.stderr.write(`\n${failed.length} independent-repository check(s) failed.\n`)
  process.exitCode = 1
} else {
  process.stdout.write(`\n${checks.length}/${checks.length} independent-repository checks passed.\n`)
}
