# Prototype Ticket

## Identity And Scope

- Ticket / request ID: `AORG-FLAT-TEAM-001`
- Title: AgentOrg and flat AgentTeam product experience
- Status: `In Progress`
- Mode: `Product Experience Prototyping`
- Requirements authority: approved `RER-012`, commit `658d602a1`
- Architecture context: held `AD-REV-001` at `36bc02deca363798b6eda878e5eb4850e624da6f`; architecture impact check remains downstream of Product approval.
- Related IDs: `BEH-001`, `BEH-003`, `BEH-004`, `BEH-006`; `REQ-001`–`REQ-004`, `REQ-006`, `REQ-011`, `REQ-016`, `REQ-018`–`REQ-023`; `AC-001`–`AC-003`, `AC-007`, `AC-011`, `AC-013`–`AC-018`; `SCN-001`–`SCN-003`, `SCN-006`–`SCN-008`; `DEC-007`–`DEC-010`; `ORG-CASE-032`–`ORG-CASE-042`.
- Critical journey: distinguish reusable Agent-only Teams from coordinator-free Orgs; author the correct members and owned handoffs; launch an Org through one exact Agent or Team entry; and read Org/standalone-Team roots plus task runtime lineage truthfully.
- Non-goals: recursive configured Teams/Orgs, an Org coordinator, copied Team variants, implicit launch fallback, production backend or architecture, cross-run/shared-member semantics, and unrelated redesign.

## Repository And Baseline

- Canonical prototype repository/root: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Active Product ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001`
- Product ticket branch: `prototype/aorg-flat-team-001`
- Integration/default branch: `personal`
- Accepted prototype base: `5561e3ac593a210ab7b3b8621c5daea31f95f08e`; local `personal`, `origin/personal`, and `origin/HEAD` are synchronized at this revision. It is merged into the ticket branch by reconciliation commit `3e81f334f131992a06936886c02b4493d1d43349`.
- Source repository: `/home/autobyteus/workspace/autobyteus-workspace`
- Selected frontend: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web`
- Pinned source revision: `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Baseline status: `Accepted after correction 2`. The earlier Task Agent / Task AgentTeam correction remains `5/5` pass; AgentTeam Run configuration-first and Workspace file-tree correction is accepted at `9/9` exact matched cases with zero browser errors.
- Bootstrap report: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/prototype-bootstrap-report.md`
- Baseline acceptance: `/home/autobyteus/workspace/autobyteus-web-prototype/evidence/AORG-FLAT-TEAM-001/baseline-correction/product-acceptance/product-acceptance.md`
- Baseline gap record: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/baseline-gap-record.md`
- Current baseline correction record: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/baseline-gap-record-2.md`
- Completed Bootstrapper correction task: `task_06c5ed4cdc58403192c82c7b0c28da5b`, ingress `prototype_bootstrapper_d109c470f86a40e486047cf9c2c4d50a`.
- Current correction acceptance: `/home/autobyteus/workspace/autobyteus-web-prototype/evidence/AORG-FLAT-TEAM-001/baseline-correction-2/product-acceptance/product-acceptance.md`
- Requirements package: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model`
- Current review revision: validated `RV-009` at `c3221cf3faa6b7c6abab0b4c555b6b88f547cfd1`, now rejected specifically for its separate pre-launch exact-entry selector. `RIF-AORG-002` is open; RV-009 remains non-normative historical review evidence.

## Runtime Isolation

- Review server: `corepack pnpm dev --port 4194`; Product-owned parent PID `871`, shell PID `888`, Nuxt PID `889` (process IDs are runtime-local and may change after restart).
- Accepted-baseline comparison server: `http://127.0.0.1:4195/agent-teams?view=team-list`; read-only canonical `personal` comparison only.
- Temporary state root: `/tmp/autobyteus-prototype-AORG-FLAT-TEAM-001`
- Fixture boundary: ticket-local, deterministic, in-memory definitions, handoffs, launch, runs, and history; no production credentials, services, data, or writes.
- Reset: stop only the recorded `4194` process and remove the ticket-owned temporary state; do not affect unrelated previews.

## Current Review Candidate — RV-009

- The pinned source and accepted `personal` baseline were re-audited after user feedback. Team create/edit now preserves real library-to-canvas HTML drag/drop, click fallback, the initially empty Canvas, selected canvas cards, editable Member Details, automatic unique member names, first-Agent coordinator assignment, coordinator switches, member removal, and responsive stacking. The only builder delta is requirements-driven: Agent-only library/membership, with no Team library.
- Team catalog/create/detail remain baseline-native and self-contained. Team members are direct Agents only, exactly one direct Agent is coordinator, Instructions and Agent-detail navigation are preserved, and no Team-to-Org promotion is added.
- AgentOrg catalog/detail/form use the same neutral/blue product language as Agent Teams. Redundant type, reuse, no-coordinator, same-definition, composition, and invented summary/run copy are absent.
- Handoff detail shows only `From`, `To`, and ordered `When`, with exact addresses as secondary identity. It does not repeat aggregate counts, per-card condition counts, endpoint type badges, or a coordinator-delivery block.
- Team destinations remain inspectable through the referenced Team member and Team detail; the adjacent member card identifies the Team coordinator without repeating it on every handoff.
- Org authoring supports add/edit/delete/reorder/cancel for handoffs and ordered When conditions, complete-definition validation, duplicate/self-resolution rejection, and atomic local save feedback.
- Removing or renaming an endpoint never silently deletes or retargets a handoff; the affected card becomes unavailable and save is blocked until resolved.
- Team-local handoff authoring uses only direct Team Agents for From and To. Org surfaces edit only Org-owned handoffs.

- AgentOrg create/edit uses one explicit **Add member** action. The chooser expands in the document flow, uses Agent/Team tabs and search, and remains usable at `390×844` without a modal or document overflow. Category is absent; create starts with blank Name and Description.
- Exact AgentOrg launch now enters the accepted configuration-first product journey. A Team entry opens the accepted Team configuration and launches the accepted Team workspace; an Agent entry opens the accepted Agent configuration and launches the accepted Agent workspace.
- AgentOrg runtime no longer uses a custom dashboard. The accepted conversation, Team, Files, Terminal, Activity, Token, Artifacts, and VNC surfaces remain intact. The accepted Workspace Files tree is preserved.
- Shared history distinguishes the AgentOrg definition/run from standalone Team definitions without type badges or explanatory runtime chrome. Task Agent and Task Team rows appear only under the entered Team execution and focus their accepted conversations.

## Delivery And Validation

- UI/UX specification: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/ui-ux-spec.md` — draft and non-normative.
- Review guide: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/review-guide.md`
- Review URL: `http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-detail&id=software-development-department`
- Handoff authoring URL: `http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-edit&id=software-development-department`
- Current browser result: `browser-validation-rv-009.json` — `55/55` checks, `17` non-normative review captures, zero page/console errors. It covers preserved Team surfaces, Org authoring/Handoffs, desktop/narrow layouts, exact-entry configuration, Team/Agent runtime, task lineage, and the Workspace Files tree.
- Static validation: `validation-rv-009/static-validation.txt` — typecheck, lint, `12/12` tests, `13/13` boundary checks, and build pass.
- Historical RV-008 result remains preserved as prior review evidence.
- Team-builder preservation audit: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/review-evidence/rv-008/source-comparison/agent-team-builder-audit.md`
- Review evidence: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/review-evidence/rv-009`
- Final visual references: pending explicit approval; no `REV-*` image is normative.
- User confirmation: explicit feedback has been applied through the removal of redundant count, rule, same-definition, coordinator-delivery, and invented run-summary chrome. Final approval is still pending.

## Outcome And Handoff

- Current outcome: `Requirement Impact` (`RIF-AORG-002`).
- Next expected action: Requirements Engineering reconciles the user-requested configuration-first, focus-after-launch AgentOrg journey with `REQ-004`, `REQ-019`, `AC-002`, `SCN-002`, `SCN-007`, and `DEC-002`, then returns an approved revision before Product changes the prototype.
- Integration: baseline correction 2 is committed at `5561e3ac593a210ab7b3b8621c5daea31f95f08e`, integrated and pushed to `personal`, and merged into the future-state branch at `3e81f334f131992a06936886c02b4493d1d43349`; future-state integration remains `Pending`.
- Cleanup: retain the ticket worktree and port `4194` during active user review.
- Handoff: route `Requirement Impact` with the exact user feedback and `RIF-AORG-002` through dynamic handoff rules. The Bootstrapper correction task remains complete; no new baseline work is required.
