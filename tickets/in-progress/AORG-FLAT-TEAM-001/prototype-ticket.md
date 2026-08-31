# Prototype Ticket

## Identity And Scope

- Ticket / request ID: `AORG-FLAT-TEAM-001`
- Title: AgentOrg and flat AgentTeam product experience
- Status: `Awaiting User Review`
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
- Accepted prototype base: `893cde9dbcc5ccc8904cf08ba6b031668dff0041`; local `personal` and `origin/personal` are synchronized at this revision and it is an ancestor of the ticket branch.
- Source repository: `/home/autobyteus/workspace/autobyteus-workspace`
- Selected frontend: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web`
- Pinned source revision: `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Baseline status: `Accepted after correction` under `PPA-AORG-BASE-001`; Task Agent and Task AgentTeam inventory corrections both pass exact pinned-source parity.
- Bootstrap report: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/prototype-bootstrap-report.md`
- Baseline acceptance: `/home/autobyteus/workspace/autobyteus-web-prototype/evidence/AORG-FLAT-TEAM-001/baseline-correction/product-acceptance/product-acceptance.md`
- Baseline gap record: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/baseline-gap-record.md`
- Requirements package: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model`
- Current review revision: `RV-007`; runnable candidate and non-normative review evidence are pending the ticket-branch review commit.

## Runtime Isolation

- Review server: `corepack pnpm dev --port 4194`; Product-owned parent PID `25138`, Nuxt child PID `25155`.
- Accepted-baseline comparison server: `http://127.0.0.1:4195/agent-teams?view=team-list`; read-only canonical `personal` comparison only.
- Temporary state root: `/tmp/autobyteus-prototype-AORG-FLAT-TEAM-001`
- Fixture boundary: ticket-local, deterministic, in-memory definitions, handoffs, launch, runs, and history; no production credentials, services, data, or writes.
- Reset: stop only the recorded `4194` process and remove the ticket-owned temporary state; do not affect unrelated previews.

## RV-007 Review Candidate

- Team catalog/create/detail remain baseline-native and self-contained. Team members are direct Agents only, exactly one direct Agent is coordinator, Instructions and Agent-detail navigation are preserved, and no Team-to-Org promotion is added.
- AgentOrg catalog/detail/form use the same neutral/blue product language as Agent Teams. Redundant type, reuse, no-coordinator, same-definition, composition, and invented summary/run copy are absent.
- Handoff detail shows only `From`, `To`, and ordered `When`, with exact addresses as secondary identity. It does not repeat aggregate counts, per-card condition counts, endpoint type badges, or a coordinator-delivery block.
- Team destinations remain inspectable through the referenced Team member and Team detail; the adjacent member card identifies the Team coordinator without repeating it on every handoff.
- Org authoring supports add/edit/delete/reorder/cancel for handoffs and ordered When conditions, complete-definition validation, duplicate/self-resolution rejection, and atomic local save feedback.
- Removing or renaming an endpoint never silently deletes or retargets a handoff; the affected card becomes unavailable and save is blocked until resolved.
- Team-local handoff authoring uses only direct Team Agents for From and To. Org surfaces edit only Org-owned handoffs.

## Delivery And Validation

- UI/UX specification: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/ui-ux-spec.md` — draft and non-normative.
- Review guide: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/review-guide.md`
- Review URL: `http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-detail&id=software-development-department`
- Handoff authoring URL: `http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-edit&id=software-development-department`
- Browser result: `browser-validation-rv-007.json` — `44/44` checks, `15` review captures, zero runtime errors.
- Review evidence: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/review-evidence/rv-007`
- Final visual references: pending explicit approval; no `REV-*` image is normative.
- User confirmation: explicit feedback has been applied through the removal of redundant count, rule, same-definition, coordinator-delivery, and invented run-summary chrome. Final approval is still pending.

## Outcome And Handoff

- Current outcome: `Awaiting User Review`.
- Next expected action: user reviews the clean Org detail and Handoff authoring states and either explicitly approves or requests another focused revision.
- Integration: baseline correction completed; future-state integration remains `Pending` until explicit approval and finalization.
- Cleanup: retain the ticket worktree and port `4194` during review.
- Handoff: none while awaiting user review; completed-package handoff occurs only after explicit approval, final references, repository finalization, and matching handoff rules.
