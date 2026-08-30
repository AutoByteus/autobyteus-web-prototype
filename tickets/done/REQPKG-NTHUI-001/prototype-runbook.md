# Prototype Runbook — Workspace Nested-Team Hierarchy

## Location And Stack

- Package / ticket: `nested-team-hierarchy-ui` / `REQPKG-NTHUI-001`
- Selected source frontend: `/home/autobyteus/workspace/autobyteus-workspace-nested-team-hierarchy-ui-requirements/autobyteus-web`
- Source context revision: `5cb39c65630b5b0baae7b4813f6e8cd798851e97`
- Prototype repository/root: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Ticket worktree / branch: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001` / `prototype/reqpkg-nthui-001`
- Accepted prototype base: `550e8bd8737ddb645cc12f674d693bed76a09e9f`
- Approved UI implementation revision: `801b571093a3388eb21efea17515529ff9b89f51`
- Final package revision: Pending final artifact commit
- Ticket folder: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001/tickets/done/REQPKG-NTHUI-001`
- Stack: Nuxt 3, Vue 3, TypeScript, Pinia, Tailwind, Iconify, Playwright Core, synthetic browser-only fixture

## Install And Start

- Install: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start: `corepack pnpm dev --port 4193`
- Approved URL: `http://127.0.0.1:4193/workspace?prototypeReview=nested-team-hierarchy&reviewView=proposal&hierarchy=rails&metadata=responsive&teamIdentity=icon&panelWidth=320&fontSize=default&treeState=collapsed`
- Readiness: URL returns HTTP 200 and renders `[data-test="workspace-team-execution-tree"]`.
- Scenario reset: Reload the approved URL. It applies `workspace_team_hierarchy_review`, 320px, Default font, collapsed teams, file-tree rails, Responsive metadata, and filled User group identity.
- Credentials/environment variables: None.

## Review States

| State | Query |
| --- | --- |
| Default collapsed | `treeState=collapsed` |
| One team expanded | `treeState=one` |
| Several siblings | `treeState=several` |
| Deep tree | `treeState=deep` |
| Selected deep leaf | `treeState=selected` |
| Narrow Extra Large | `panelWidth=260&fontSize=extra-large&treeState=selected` |
| Wide | `panelWidth=520&fontSize=default&treeState=deep` |

## Validation Commands And Results

| Command | Result |
| --- | --- |
| `corepack pnpm typecheck` | Pass; only pre-existing duplicate-import warnings |
| `corepack pnpm lint` | Pass |
| `corepack pnpm test` | Pass — 12/12 |
| `corepack pnpm validate:boundaries` | Pass — 13/13 |
| `corepack pnpm build` | Pass; only pre-existing duplicate-import and chunk-size warnings |
| `corepack pnpm validate:nested-team-hierarchy-review` | Pass — 24/24, zero page/console errors |
| `corepack pnpm capture:nested-team-hierarchy-final` | Pass — five post-approval captures, zero runtime errors |

The browser suite covers the real Workspace entry, preserved shell, deterministic fixture, identical historical comparison content, state progression, pointer/keyboard disclosure, selected-member ancestor reveal, full identity recovery, tree semantics, quiet refresh, 260/320/520px × Default/Extra Large, responsive metadata, no review chrome, file-tree junction geometry, orthogonal 2px selection, filled User group identity, focus-tooltip stacking, and runtime errors.

## Runtime Isolation And Cleanup

- Review runtime: Product-owned port `4193`; current Nuxt PID `94401` in managed session `80423`.
- Do not stop or reuse unrelated port `4180`.
- Mutable state: localStorage scenario only; reset by reloading approved URL.
- Final cleanup: Pending completion handoff; stop only the Product-owned 4193 session, then remove the ticket worktree after integration and durable handoff.

## Final Artifacts

- UI/UX specification: `ui-ux-spec.md`
- User decision: `user-decision-record.md`
- Requirement impact: `requirement-impact.md`
- Final visuals: `visual-references/`
- Browser validation: `browser-validation-rv-006.json`
- Historical review evidence: `review-evidence/`

## Known Boundaries

Synthetic names, topology, statuses, ages, conversations, and refresh behavior demonstrate the UI decision but do not prescribe production data. The prototype proves observable UI/UX only; it does not prove backend, persistence, security, operations, performance, or production readiness.
