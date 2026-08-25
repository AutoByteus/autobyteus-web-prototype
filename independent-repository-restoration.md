# Independent Repository Ownership Restoration — RER-017

## Status And Scope

- Package: `initial-prototype-baseline`
- Requirements revision: `RER-017`
- Canonical repository: `https://github.com/AutoByteus/autobyteus-web-prototype.git`
- Canonical checkout/root: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Branch: `personal`
- Preserved independent base: `0b02b0e1fbdbdefb78b91b1705bd497663694e0f`
- Protected workspace source commit at execution: `56397ba1ac0741198ff88387f419bf216d798661`
- Protected workspace project tree: `21c400d2903a362737f3ce41d876be3fbe2abab5`
- Approved source pin: `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Approved UI/UX: `PPA-001` / `PPA-002`; unchanged
- Observable UI/UX change: **none**

The existing independent remote was complete for the prior RER-013 cutover, but
it was not yet the complete current package: its root contained 2,006 tracked
files, while the protected workspace project contained 2,010 rows and four
later RER-015 ownership artifacts. The workspace copy therefore remained
protected while the independent checkout was restored, updated, validated and
pushed. This is a repository-ownership correction only; it adds no redesign,
source refresh, backend, production integration or production write.

## History And Materialization

Both remotes were fetched before mutation. The sibling checkout was cloned from
the existing independent `personal` branch and verified clean/equal at
`0b02b0e1fbdbdefb78b91b1705bd497663694e0f`. Its `.git` directory and ancestry
were preserved. Only repository-root worktree content was replaced from the
exact workspace subtree at tree `21c400d2903a362737f3ce41d876be3fbe2abab5`;
no workspace `.git` metadata or commit history was copied or imported.

The current 2,010-row source inventory is recorded at
`evidence/repository-independence/rer-017-current-workspace-tree-inventory.json`.
Every source row remains present. Differences are limited to the enumerated
active ownership, package, run, evidence, provenance, canonical-locator and
path-validator text files plus RER-017 ticket/cutover evidence.

## Identity And Approval Preservation

- All **2,001/2,001** files from the approved tree remain present.
- All **848/848** approved binary evidence/assets retain exact Git blob
  identity.
- `VIS-001`–`VIS-017` retain the exact approved SHA-256 hashes.
- `JRN-050-A`–`JRN-050-E` remain 5/5 exact with zero source/prototype browser
  errors.
- Source pin `8ef282ba77705180d985e7000d801f0e0068cdc1` remains unchanged.
- `PPA-001`, `PPA-002`, **“approved”**, and
  **“done. i checked. thanks”** remain authoritative.
- RER-015 artifacts remain present as explicitly historical provenance.
- No user-facing label, layout, state, transition, behavior or visual asset is
  changed; renewed UI review is not required.

## Target-First Cutover Contract

The independent candidate must pass typecheck, lint, 2 files / 8 focused tests,
13/13 boundary checks, 369/369 retained-presentation checks, 20/20 PP-GAP-009,
25/25 PP-GAP-010, 86/86 final-package consistency, production build, clean
VIS-001–VIS-017 browser recapture, loopback HTTP review and independent Git
ownership/path validation. It is then committed and pushed normally on
`personal`, and local/remote equality and clean status are proven.

Only after that target proof may the workspace project be removed. The focused
workspace follow-up removes `autobyteus-web-prototype/`, updates only
workspace-owned active and canonical requirements locators, and is committed
and pushed normally. Terminal proof requires both repositories clean/equal,
no workspace duplicate, nested Git, `.gitmodules`, submodule or gitlink, and no
stale active workspace locator.

Machine-readable preservation and operation-order evidence is stored in
`evidence/repository-independence/rer-017-restoration-proof.json` and
`evidence/repository-independence/rer-017-operation-order.txt`. Full command
output is stored in
`evidence/repository-independence/rer-017-validation.txt`. The tracked records
do not embed their own final commit; live ref equality is the terminal commit
and push proof returned with the handoff.
