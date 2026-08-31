# Task Runtime Baseline-Correction Acceptance

## Decision

- Acceptance ID: `PPA-AORG-BASE-001`
- Date: `2026-08-31`
- Result: `Accepted`
- Stable package: `AORG-FLAT-TEAM-001`
- Accepted correction boundary: current-source Workspace organization and selection behavior for transient Task Agents and transient Task Teams
- Corrected inventory: `UXB-CORR-TASK-AGENT-001`, `UXB-CORR-TASK-TEAM-001`
- Source authority: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web` at `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Accepted prototype base: `32f879c01a04f23f8c4807f02006f6b0ebafea7b`
- Correction worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction`
- Correction branch: `prototype/aorg-flat-team-001-baseline-correction`
- Bootstrap report: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction/prototype-bootstrap-report.md`

## Product Review Basis

Product Prototyper accepted the runnable correction rather than accepting the
Bootstrapper summary by assertion.

1. Confirmed the report's selected frontend, exact source pin, disposable read-only source observation method, and synthetic runtime boundary.
2. Inspected the source and prototype evidence for the selected Task Agent and Task Team child states. The visible hierarchy, pale-indigo transient treatment, selection, and focused Event Monitor conversation agree.
3. Audited all five source/prototype evidence pairs: each pair has an identical SHA-256 hash; the returned machine result also records exact DOM, geometry, computed styles, actions/focus, and zero browser errors.
4. Exercised `workspace_team_task_agent` through the live prototype at port `4195`: expanded `Evidence Writer`, selected the transient task row, verified `aria-current=true`, exact focused run `task-agent-license-audit`, and the dedicated conversation.
5. Exercised `workspace_team_task_team`: verified the parent is initially collapsed, expanded it, selected `reviewer`, verified `aria-current=true`, exact focused run `task-team-review:reviewer`, and the dedicated conversation.
6. Re-ran Product-owned typecheck, lint, 12 tests, 13 boundary checks, the 24-check accepted hierarchy regression, and a production build; all passed with only documented accepted warnings.

## Evidence

- Browser result: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction/evidence/AORG-FLAT-TEAM-001/baseline-correction/product-acceptance/product-browser-acceptance.json`
- Task Agent acceptance capture: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction/evidence/AORG-FLAT-TEAM-001/baseline-correction/product-acceptance/PPA-AORG-BASE-001-task-agent.png`
- Task Team acceptance capture: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction/evidence/AORG-FLAT-TEAM-001/baseline-correction/product-acceptance/PPA-AORG-BASE-002-task-team.png`
- Product CLI log: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction/evidence/AORG-FLAT-TEAM-001/baseline-correction/product-acceptance/product-cli-validation.txt`
- Bootstrap machine summary: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction/evidence/AORG-FLAT-TEAM-001/baseline-correction/aorg-flat-team-baseline-correction-summary.json`
- Bootstrap machine results: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction/evidence/AORG-FLAT-TEAM-001/baseline-correction/aorg-flat-team-baseline-correction-results.json`

## Artifact Provenance

The root `prototype-bootstrap-report.md` now records this latest correction.
The previously accepted Token Statistics refresh report has been preserved at
`tickets/done/REQPKG-TSUI-001/prototype-bootstrap-report.md` so its historical
acceptance references remain durable rather than silently changing meaning.

## Acceptance Boundary And Next Action

This accepts current-experience parity for the two named Task-runtime surfaces.
It does not approve the paused AgentOrg future-state candidate or production
architecture. Product Prototyper must create the correction commit, integrate
it into the canonical accepted base, reconcile the paused
`prototype/aorg-flat-team-001` branch, rerun affected validation, and then
continue the Product Experience review loop.
