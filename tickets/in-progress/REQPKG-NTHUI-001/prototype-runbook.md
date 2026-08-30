# Prototype Runbook

## Location And Stack

- Request / ticket: `REQPKG-NTHUI-001`; package `nested-team-hierarchy-ui`
- Source repository: `/home/autobyteus/workspace/autobyteus-workspace-nested-team-hierarchy-ui-requirements`
- Selected frontend application or product surface: `/home/autobyteus/workspace/autobyteus-workspace-nested-team-hierarchy-ui-requirements/autobyteus-web`; Workspace history sidebar
- Pinned source commit or revision: `5cb39c65630b5b0baae7b4813f6e8cd798851e97` observed context, not an explicit refresh constraint
- Prototype repository/root (separate Git repository): `/home/autobyteus/workspace/autobyteus-web-prototype`
- Prototype ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001`
- Prototype ticket branch: `prototype/reqpkg-nthui-001`
- Accepted prototype base revision: `550e8bd8737ddb645cc12f674d693bed76a09e9f`
- Prototype revision or commit: RV-002 review implementation `f4bb01d5968be1c5e37aa8e879b37692ac7f3099`
- Ticket folder: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001/tickets/in-progress/REQPKG-NTHUI-001`
- Package manager: `pnpm@10.15.0`
- Framework / stack: Nuxt 3, Vue 3, TypeScript, Pinia, Tailwind, Iconify, synthetic browser-only fixture
- Entry route: `/workspace?prototypeReview=nested-team-hierarchy`

## Install And Start

- Install command: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start command: `corepack pnpm dev --port 4193`
- Review URL: `http://127.0.0.1:4193/workspace?prototypeReview=nested-team-hierarchy&hierarchy=hybrid&metadata=responsive&teamIdentity=header&panelWidth=320&fontSize=default&treeState=deep`
- Readiness signal: Nuxt prints `Local: http://127.0.0.1:4193/`; the review URL returns HTTP 200 and renders `[data-test="workspace-team-execution-tree"]`.
- Stop / cleanup: Stop only the Product-owned Nuxt process recorded in `prototype-ticket.md`; do not stop port 4180 or other ticket runtimes.
- Runtime port / process / temporary-state ownership: Port `4193`; Nuxt PID `77045`; Product ticket `REQPKG-NTHUI-001`; localStorage scenario `workspace_team_hierarchy_review`; query controls reset every review dimension. Loopback HTTP check returned `200` with a 2,893-byte Nuxt shell response after restart.

## Reproducibility And Project State

- Prototype repository status at validation: Dedicated Product worktree and branch; no production/source writes; review candidate committed before handoff.
- Scenario reset/isolation method: Reload the review URL. It applies `workspace_team_hierarchy_review`; use the control panel to reset Hybrid / Responsive / Header / 320 / Default / Deeper team expanded.
- Required environment variables or credentials: None. Synthetic/local only.

## Critical Journeys To Review

| Journey / Scenario ID | Entry Condition | Steps | Expected Outcome |
| --- | --- | --- | --- |
| JRN-NTH-001 | Default review URL | Change only DEC-001 across Rails/Surfaces/Hybrid | Same 17 rows and shell; ancestry treatment alone changes |
| JRN-NTH-002 | Same URL | Change DEC-002 across Full/Responsive/On focus | Status/age density changes; identity and hierarchy remain |
| JRN-NTH-003 | Same URL | Change DEC-003 across Icon/Header/Band | Team emphasis changes; agent rows and tree content remain |
| JRN-NTH-004 | 260px + Extra Large + Selected deep leaf | Focus the truncated selected row | Full role/name/address tooltip and accessible label appear; no horizontal overflow |
| JRN-NTH-005 | Deeper team expanded | Toggle sibling/deeper/temporary teams by pointer and keyboard | Only intended subtree changes; concrete selection remains valid |

## Scenario Selection

| Scenario ID | Purpose | How To Select | Expected Visible Result |
| --- | --- | --- | --- |
| PS-NTH-001 | Full deep comparison | Open review URL | Three sibling teams, deeper team, transient task team, mixed statuses |
| PS-NTH-002–006 | Disclosure/selection presets | Use `Tree state` selector | 5→8→13→17 visible rows, then selected deep leaf |
| Width/font matrix | Density stress | Use Actual panel width and Actual app font | Product's real 260/320/520px and 100%/125% settings apply |

## Validated Viewports And Checks

- Desktop: Browser viewport 1440×1000; actual left panel 260, 320, 520px; Default and Extra Large.
- Narrow mobile: Out of scope; the affected product boundary is the desktop/web docked history sidebar.
- Build / typecheck / lint / tests: `pnpm typecheck` pass; `pnpm lint` pass; `pnpm test` 12/12 pass; `pnpm validate:boundaries` 13/13 pass; `pnpm build` pass; focused browser validation 19/19 pass.

## Known Limitations And Product Questions

- `DEC-001`–`DEC-003` remain open. No default is a recommendation.
- Review controls and synthetic fixture are not proposed production UI.
- Captures under `review-evidence/rv-002/` are review aids, not final/normative visual references.
- No `ui-ux-spec.md` is created until explicit user confirmation.
