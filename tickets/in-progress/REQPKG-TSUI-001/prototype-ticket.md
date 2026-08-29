# Prototype Ticket

## Identity And Scope

- Ticket / request ID: `REQPKG-TSUI-001`
- Title: Settings > Token Statistics final focused experience
- Status: `Awaiting User Review`
- Mode: `Final Prototype`
- Related requirements revision: `RER-009`; Requirements commit `6aa6ba066faf041ff1fa221cee5b956fd7e537b5`
- Related requirement, behavior, acceptance-criteria, scenario, and decision IDs: `BEH-001`–`BEH-006`; `REQ-001`–`REQ-016`; `AC-001`–`AC-016`; `SCN-001`–`SCN-007`; resolved `DEC-001`–`DEC-009`
- Critical journey or product decision: Review and confirm the actual runnable implementation of the user-selected RV-007 focused Analytics hierarchy and lightly unified Run-details treatment, including the later `DEC-009` removal of CSV export.
- In scope: The production-quality, browser-runnable final Token Statistics experience, Product-owned UI/UX specification, deterministic validation, final visual references after explicit confirmation, and Product repository finalization.
- Non-goals: Backend, GraphQL, persistence, accounting, pricing, migration, or historical-backfill changes; quota/budget/forecast/alert features; new Analytics dimensions; live Token Meter or other Settings redesign; automatic navigation collapse; a redundant content title; any export/report/share/download replacement; or an unsupported Run-details `Runs` count.

## Prototype Context

- Prototype repository/root (separate from source repository): `/home/autobyteus/workspace/autobyteus-web-prototype`
- Prototype ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001`
- Prototype ticket branch: `prototype/reqpkg-tsui-001`
- Source repository and selected frontend: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements`; `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/autobyteus-web`
- Required source authority and pinned source revision: `origin/personal` at `9d0fd7c570d58da1af2c7a40279327c8a20a8093`
- Accepted baseline revision: Token Statistics baseline implementation `6ba98942c669329f70ba902db4a2880375ad52ad`; accepted integration/metadata tip `16638137bdb8ebe627507dac6c3c8bdbc5edf9d6` on prototype `personal` / `origin/personal`
- Bootstrap report: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/prototype-bootstrap-report.md`
- Product acceptance result and date: Accepted 2026-08-29; see `baseline-acceptance.md` in this ticket folder.
- User-confirmed visualization provenance: content revision `726f414a4f1acf2e32e859c7b6e8a90584d1b6d6`; review metadata revision `578efc4e3d4929fcce55e1c130f1c6092fda7f44`
- Prototype revision for this ticket: Review-candidate commit `3de6227769c33cfdbefa42f22b44a0de83329563`; this is committed on the ticket branch but is not the final user-accepted/integrated revision.
- Integration target and result: Prototype `personal`; `Pending` until explicit user confirmation, final reference capture, and final validation.
- Runtime isolation record: Active ticket-owned Nuxt review server at `127.0.0.1:3261`; launcher PID `30625`, Nuxt PID `30643`; temporary/runtime state root `/tmp/autobyteus-prototype-REQPKG-TSUI-001`; localStorage scenario key `autobyteus.prototype.scenario`.
- Cleanup result or blocker: `Pending`; the review runtime and worktree remain available while user review is active.
- Ticket folder: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001`

## Delivery And Validation

- UI/UX specification: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/ui-ux-spec.md` — `Ready for User Review`; normative final visual inventory remains pending explicit confirmation of this actual runnable.
- Runnable prototype entry point: `http://127.0.0.1:3261/settings?section=token-usage`
- Future final visual-reference directory: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/visual-references`
- Non-normative review screenshot directory: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/review-evidence/final-prototype-review`
- Supporting artifact paths: `ui-behavior-test-matrix.md`, `prototype-assumptions.md`, `prototype-change-log.md`, `prototype-runbook.md`, and `experience-story.md` in this ticket folder; prior Requirements Visualization artifacts remain linked historical decision evidence.
- Validation commands and results: `corepack pnpm typecheck` passed with accepted-base duplicate-getter warnings only; `corepack pnpm lint` passed; `corepack pnpm test` passed 3 files / 12 tests; `corepack pnpm validate:boundaries` passed 13/13; `NUXT_IGNORE_LOCK=1 corepack pnpm build` passed; `corepack pnpm validate:token-statistics-final` passed 19/19 in Chromium with no unexpected browser errors.
- Validation evidence: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001/validation/final-prototype`
- User-confirmation reference: RV-007 and `DEC-009` define the selected direction and final delta. Explicit confirmation of the separate actual final runnable at port 3261 is still pending and is required before normative screenshot capture and completion.
- Mocked boundaries and known limitations: Synthetic, resettable local fixture/query state; no live backend, GraphQL, production data, credentials, Electron runtime, persistence, production writes, CSV/export path, or proof of production architecture. Fixture values are illustrative; visible behavior and state meanings are not.

## Outcome And Handoff

- Current outcome: `Awaiting User Review`
- Completed behavior and evidence: The worktree now contains the focused final Analytics and Run-details experience, `DEC-009` removal, responsive/localized states, 19/19 browser evidence, and draft Product artifacts. Review screenshots are intentionally non-normative.
- Remaining product decisions: None. The remaining gate is explicit user confirmation that this actual final runnable matches the approved direction.
- Next expected action: User reviews `http://127.0.0.1:3261/settings?section=token-usage` and explicitly confirms or requests focused corrections. After confirmation, Product captures final `VIS-*` screenshots, completes and approves `ui-ux-spec.md`, reruns final validation, commits/integrates the ticket, moves it to `tickets/done`, and sends the verified terminal package to Requirements Engineering.
- Handoff outcome from `get_handoff_rules`: Not requested at this non-terminal review gate.
- Matched recipient address, when a rule applies: Pending terminal result.
- Return context when no matching rule applies: Return the live review URL and confirmation request to the user/calling workflow.
