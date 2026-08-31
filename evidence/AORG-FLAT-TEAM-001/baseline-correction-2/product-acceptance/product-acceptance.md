# Product Acceptance — Baseline Correction 2

## Decision

- Stable package: `AORG-FLAT-TEAM-001`
- Outcome: `Accepted current-experience correction`
- Accepted inventory: `UXB-CORR-TEAM-RUN-CONFIG-001`, `UXB-CORR-WORKSPACE-FILE-TREE-001`
- Product reviewer: Product Prototyper
- Review date: `2026-08-31`
- Selected frontend: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web`
- Exact source pin: `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Accepted prototype base: `893cde9dbcc5ccc8904cf08ba6b031668dff0041`
- Correction branch: `prototype/aorg-flat-team-001-baseline-correction-2`
- Correction worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction-2`

Product Prototyper accepts the candidate for the two named current-experience
gaps. This is baseline acceptance, not user approval of the still-paused
future-state AgentOrg proposal.

## Evidence Reviewed

- Bootstrap report: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction-2/prototype-bootstrap-report.md`
- Matched comparison result: `9/9` pass at desktop `1440x900`.
- Every row matches exact semantic/state, geometry, computed style,
  action/focus, and screenshot bytes; `changedPixels=0` and
  `maximumChannelDelta=0`; source and prototype browser errors are both empty.
- Pinned-source provenance confirms the nine selected presentation files are
  SHA-256 identical between source and prototype.
- The previously accepted Task Agent / Task Team comparison remains `5/5`
  pass.

Durable machine evidence:

- `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction-2/evidence/AORG-FLAT-TEAM-001/baseline-correction-2/aorg-team-config-file-tree-correction-results.json`
- `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction-2/evidence/AORG-FLAT-TEAM-001/baseline-correction-2/aorg-team-config-file-tree-correction-summary.json`
- `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction-2/evidence/AORG-FLAT-TEAM-001/baseline-correction-2/source-provenance.json`
- `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction-2/evidence/AORG-FLAT-TEAM-001/baseline-correction-2/validation/browser-comparison.txt`
- `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction-2/evidence/AORG-FLAT-TEAM-001/baseline-correction-2/validation/accepted-baseline-regression.txt`

## Direct Product Acceptance Test

Product Prototyper independently started the uncommitted candidate at
`http://127.0.0.1:4196/workspace` and exercised the real rendered controls:

1. `workspace_team_run_config_correction`
   - observed the missing-workspace state and disabled **Run Team**;
   - expanded **Team Members Override (2)** and inspected both member cards;
   - selected `prototype-workspace` and observed **Run Team** become enabled;
   - changed **Auto approve tools** and observed its exact active visual state.
2. `workspace_team_active`
   - activated **Edit Config** from the selected Team run;
   - observed the complete Team configuration, read-only notice, and disabled
     runtime and auto-approve controls.
3. `workspace_file_tree_correction`
   - observed the expanded `docs` folder, active Markdown tab, and real preview;
   - collapsed the folder and verified its child row disappeared;
   - reset and selected `evidence.md`, then observed the matching active preview;
   - opened the folder context menu and observed **Add File**, **Add Folder**,
     **Rename**, and **Delete**.

Product acceptance captures:

- `PPA-AORG-BASE-003-team-run-config.png`
- `PPA-AORG-BASE-004-team-run-config-readonly.png`
- `PPA-AORG-BASE-005-workspace-file-tree.png`

## Product Validation

Product Prototyper reran:

- `corepack pnpm typecheck` — pass (retained duplicate-getter warnings only)
- `corepack pnpm lint` — pass
- `corepack pnpm test` — `3` files / `12` tests pass
- `corepack pnpm validate:boundaries` — `13/13` pass
- `NUXT_IGNORE_LOCK=1 corepack pnpm build` — pass

Log:
`/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction-2/evidence/AORG-FLAT-TEAM-001/baseline-correction-2/product-acceptance/acceptance-static-validation.txt`.

## Mocked Boundary And Residual Risk

- Definitions, workspaces, files, model labels, messages, IDs, timestamps, and
  content are deterministic synthetic fixtures.
- No production runtime, model, filesystem, persistence, service, credentials,
  customer data, external network dependency, or writes are used.
- No known perceptible or behavioral gap remains inside either accepted
  inventory ID under the matched desktop conditions.
- Narrow/mobile is not a permutation of these named desktop Workspace items;
  previously accepted responsive inventory remains outside this focused
  correction.

## Repository Next Step

Commit this accepted candidate on the correction branch, integrate it into
`personal`, revalidate the integrated revision, then deliberately merge the
advanced accepted base into the paused `prototype/aorg-flat-team-001` branch
before resuming future-state design and review.
