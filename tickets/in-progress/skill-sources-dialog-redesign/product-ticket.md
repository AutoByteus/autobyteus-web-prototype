# Product Ticket — skill-sources-dialog-redesign

## Identity And Scope

- Ticket / request ID: `skill-sources-dialog-redesign` (package identifier `skill-sources-dialog-redesign`; no second ID)
- Title: Redesign the Manage Skill Sources popup (Skills → Sources)
- Mode: Product Experience Design
- Status: `Awaiting User Review` (round 3, 2026-10-10)
- Requester: `/software_engineering_team/solution_designer`, AgentRun `solution_designer_d2d3585653ca415d8e218f580a890588`; Project Task `project_task_957c30cd-001d-4766-9bbe-47ee71700ef1`
- Related requirements revision: `SR-001` (Draft) — `/Users/normy/autobyteus_org/autobyteus-worktrees/skill-sources-dialog-redesign/tickets/in-progress/skill-sources-dialog-redesign/requirements-doc.md`
- Related IDs: REQ-001..REQ-009, BEH-001..BEH-007, AC-001..AC-008, UC-001..UC-005, SCN-001..SCN-004, QR-001, ASM-001, DEC-001, DEC-002
- Critical journey: Skills → Sources → scan sources and counts → add local folder / import GitHub → check / update / remove with confirmation → close.
- In scope: `SkillSourcesModal.vue`, `SkillSourceRow.vue`, the confirmation body, new UI strings (en, zh-CN).
- Non-goals: store/GraphQL/server, new source types, reordering/renaming, bulk actions, Settings → Agent Packages, app-wide dark theme, `ConfirmationModal` / conflict dialog redesign.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (remote `https://github.com/AutoByteus/autobyteus-web-prototype.git`, default `personal`)
- Design ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/skill-sources-dialog-redesign`
- Design ticket branch: `design/skill-sources-dialog-redesign`
- Source repository and selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`, `autobyteus-web`; current code read from `/Users/normy/autobyteus_org/autobyteus-worktrees/skill-sources-dialog-redesign/autobyteus-web` (`origin/personal@d28c56d5d`, read only)
- Pinned source revision: baseline report pin `1cd1a3abc126df820e334c023621d0fb82de5b7b`. Currency check: `git diff --stat 1cd1a3a d28c56d5d` over `components/skills`, `stores/skillSourcesStore.ts`, `components/common/{ConfirmationModal,CopyButton}.vue`, `pages/skills.vue` and the en skills strings shows no change; `SkillSourcesModal.vue`, `SkillSourceRow.vue`, `ConfirmationModal.vue`, `SkillsList.vue`, `CopyButton.vue`, `AgentPackagesManager.vue`, `SkillNameConflictDialog.vue` are byte-identical between the design base and `d28c56d5d`. No refresh or correction needed.
- Accepted baseline revision (fetched `origin/personal`, design base): `8740ada0d0e43a434ea8e331aa366b67df83bb3b`
- Baseline report: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md` (WEB-BASELINE-REFRESH-008; skill-source flows 24/24 pass)
- Product acceptance result and date: existing accepted baseline reused, 2026-10-10
- Design revision for this ticket: round-1 to round-3 commits on `design/skill-sources-dialog-redesign` (see `git log`)
- Default-entry-point validation after integration: Pending
- Integration target and result: `personal` — Pending
- Runtime isolation: dev server `corepack pnpm dev --port 4731 --host 127.0.0.1` (this ticket only), log `/tmp/skill-sources-dialog-redesign-dev.log`; capture/validation output `/tmp/ssdr/`; fixture state is in-memory per browser tab (reload resets).
- Cleanup result: Pending
- Ticket folder: `tickets/in-progress/skill-sources-dialog-redesign/`

## Delivery And Validation

- UI/UX specification: pending approval (`ui-ux-spec.md`)
- Runnable UI reference entry point: `http://127.0.0.1:4731/skills` → **Sources**
- Review notes: [review-round-1.md](review-round-1.md), [review-round-2.md](review-round-2.md), [review-round-3.md](review-round-3.md); evidence [review-evidence/round-1/](review-evidence/round-1/), [review-evidence/round-2/](review-evidence/round-2/), [review-evidence/round-3/](review-evidence/round-3/)
- Review/validation scripts: `prototype/skill-sources/review-scripts/capture.mjs`, `validate.mjs`
- Design-only data: `prototype/skill-sources/skillSourcesDesignFixture.ts` (synthetic; scenarios `populated`, `skill_source_issues`, `skill_sources_many`, `skill_sources_registry_error`; scripted add/import outcomes; fixed operation delays). Off when `autobyteus.prototype.designOnlyLayers=off`.
- Validation (round 1): validate 17/17 pass; capture 23/23; 0 browser errors; 0 non-local requests; `pnpm typecheck` exit 0, `pnpm lint` pass, `pnpm test` 15/15. Targeted vue-tsc over the changed files reports only the pre-existing Nuxt auto-import (`useLocalization`) and store `fetchPolicy` typing noise.
- User-confirmation reference: pending
- Mocked boundaries: GraphQL operations answered locally from synthetic fixtures; native folder dialog returns `/synthetic/selected-folder`; clipboard is the browser clipboard.

## Outcome And Handoff

- Remaining product decisions: DEC-001, DEC-002, ASM-001 (user)
- Next expected action: user review of round 3
- Handoff outcome: none yet (interim review)

## Review History

- 2026-10-10 round 1 sent for review.
- 2026-10-10 user feedback: the GitHub row is busy; branch/installed details are not needed; the ↻ icon reads like a second Update. Status `In Progress`.
- 2026-10-10 round 2 (DC-011–DC-014) validated: validate 19/19, capture 23/23, typecheck/lint exit 0, test 15/15, 0 browser errors. Status `Awaiting User Review`. REQ-007/AC-006 note for Solution Designer recorded in `review-round-2.md`.
- 2026-10-10 user feedback on round 2: drop the separate "GitHub" word; replace the Local folder / GitHub switch with one input. Round 3 (DC-015–DC-019) validated: validate 20/20, capture 23/23, typecheck/lint exit 0, test 15/15, 0 browser errors. Status `Awaiting User Review`.
- Base note: `origin/personal` moved `8740ada` → `6fdf576` (restore of `collapsed-left-panel-expand-keeps-run`). Merge it here before integration and revalidate.
