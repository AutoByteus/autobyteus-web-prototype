# Current-Experience Baseline Gap 2

## Classification

- Outcome: `Resolved — Accepted`
- Mode: `Correction`
- Stable package / Product ticket: `AORG-FLAT-TEAM-001`
- Date identified: `2026-08-31`
- Selected frontend: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web`
- Pinned source revision: `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Accepted prototype base before correction: `893cde9dbcc5ccc8904cf08ba6b031668dff0041`
- Accepted correction and canonical integration revision: `5561e3ac593a210ab7b3b8621c5daea31f95f08e`

## Named Failed Or Unsubstantiated Inventory

| Gap ID | Current-experience boundary | Current result |
| --- | --- | --- |
| `UXB-CORR-TEAM-RUN-CONFIG-001` | AgentTeam **Run** entry and transition, including the production configuration-first step before an actual run begins | `Pass — accepted` |
| `UXB-CORR-WORKSPACE-FILE-TREE-001` | Workspace left file-tree structure, hierarchy, geometry, and visible interaction treatment | `Pass — accepted` |

The IDs name current-experience parity gaps only. They do not prescribe the
source routes, fixtures, implementation, product architecture, or any future
AgentOrg behavior. Prototype Bootstrapper owns independent discovery and exact
source/prototype comparison for these items.

## Evidence Basis

- User-observed gap: the current prototype does not preserve the real product's configuration-first AgentTeam Run journey and its Workspace left file-tree structure differs visibly from the real product.
- Established bootstrap report: `/home/autobyteus/workspace/autobyteus-web-prototype/prototype-bootstrap-report.md`
- Earlier accepted correction remains valid only for its named Task Agent and Task AgentTeam coverage; it does not substantiate these newly named items.

## Recovery State

- Paused future-state worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001`
- Paused future-state branch: `prototype/aorg-flat-team-001`
- Paused branch revision before WIP preservation: `50686bc323acbb0d72af2fb7ee5bf879a28a0d2e`
- Product-assigned correction worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction-2`
- Product-assigned correction branch: `prototype/aorg-flat-team-001-baseline-correction-2`
- Delegated Bootstrapper task: `task_06c5ed4cdc58403192c82c7b0c28da5b`
- Active Bootstrapper task ingress: `prototype_bootstrapper_d109c470f86a40e486047cf9c2c4d50a`
- Future-state reconciliation commit: `3e81f334f131992a06936886c02b4493d1d43349`
- Historical future-state review status: RV-009 construction resumed at this point; RV-009 was later rejected/superseded, and final RV-012 was approved on 2026-08-31.

## Resolution

- Bootstrap candidate accepted and committed: `5561e3ac593a210ab7b3b8621c5daea31f95f08e`
- Canonical `personal`, `origin/personal`, and `origin/HEAD`: synchronized at `5561e3ac593a210ab7b3b8621c5daea31f95f08e`
- Matched current-experience comparison: `9/9` exact, byte-identical screenshots, zero source/prototype browser errors.
- Earlier Task Agent / Task AgentTeam regression: `5/5` pass.
- Product acceptance: `/home/autobyteus/workspace/autobyteus-web-prototype/evidence/AORG-FLAT-TEAM-001/baseline-correction-2/product-acceptance/product-acceptance.md`
- Product typecheck, lint, `12` tests, `13/13` boundary checks, build, direct live scenarios, integrated-base checks, and post-merge future-branch checks: pass.
- Correction preview: stopped after Product acceptance.
- Correction worktree: safely removed after integration and reconciliation.
- Correction branch: deleted after its accepted commit became reachable from `personal` and the future-state ticket branch.

## Required Recovery

1. Bootstrapper corrects only the two named current-experience inventory gaps in the Product-owned correction worktree.
2. Product Prototyper directly reviews the runnable candidate, source pin, exact comparison evidence, and complete named journey.
3. Product Prototyper commits and integrates the accepted correction into `personal` only after it passes.
4. Product Prototyper deliberately reconciles the paused future-state branch with the advanced accepted base, reruns affected preservation checks, and only then resumes user review.
