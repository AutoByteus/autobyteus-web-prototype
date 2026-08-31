# Prototype Ticket

## Identity And Scope

- Ticket / request ID: `AORG-FLAT-TEAM-001`
- Title: AgentOrg and flat AgentTeam product experience
- Status: `In Progress`
- Mode: `Product Experience Prototyping`
- Related requirements revision: `RER-010`; Requirements handoff commit `376ba649a`; Architecture context `AD-REV-001` at `36bc02deca363798b6eda878e5eb4850e624da6f`
- Related IDs: `BEH-001`, `BEH-004`, `BEH-006`; `REQ-001`–`REQ-004`, `REQ-011`, `REQ-016`, `REQ-018`, `REQ-019`; `AC-001`, `AC-002`, `AC-007`, `AC-011`, `AC-013`, `AC-014`; `SCN-001`, `SCN-002`, `SCN-006`, `SCN-007`
- Critical journey: Distinguish reusable, Agent-only AgentTeams from coordinator-free AgentOrgs; author each structure truthfully; launch an Org through an exact Agent or Team entry; and identify Org versus standalone-Team roots in active/history views without representing task-scoped Team lineage as configured nesting.
- In scope: AgentTeam catalog/create-edit/detail; AgentOrg catalog/create-edit/detail; AgentOrg exact-entry launch; shared active/history root and task-lineage presentation; user-review images and a runnable prototype.
- Non-goals: Recursive Team or Org authoring; an Org coordinator; copied or Org-specific Team variants; implicit launch fallback; cross-run/shared-member semantics; backend architecture, persistence, APIs, migration, or unrelated visual redesign.

## Prototype Context

- Canonical prototype repository/root: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Active Product ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001`
- Product ticket branch: `prototype/aorg-flat-team-001`
- Integration/default branch: `personal`
- Accepted prototype base revision: `893cde9dbcc5ccc8904cf08ba6b031668dff0041`
- Source repository: `/home/autobyteus/workspace/autobyteus-workspace`
- Selected frontend: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web`
- Applicable accepted current-experience source pin: `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Baseline status: `Accepted after correction`. Product acceptance `PPA-AORG-BASE-001` confirms exact pinned-source parity for the task-agent and task-AgentTeam organization gaps. The accepted correction commit was fast-forward integrated into canonical `personal`, then reconciled into this ticket branch before future-state work resumed.
- Baseline gap record: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/baseline-gap-record.md`
- Established bootstrap report: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/prototype-bootstrap-report.md` (its recorded inventory does not substantiate the named task-agent/task-Team surfaces).
- Baseline correction worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction`
- Baseline correction branch: `prototype/aorg-flat-team-001-baseline-correction`
- Corrected inventory IDs: `UXB-CORR-TASK-AGENT-001`, `UXB-CORR-TASK-TEAM-001` — both `Pass`.
- Baseline Product acceptance: `/home/autobyteus/workspace/autobyteus-web-prototype/evidence/AORG-FLAT-TEAM-001/baseline-correction/product-acceptance/product-acceptance.md`
- Accepted baseline correction commit: `893cde9dbcc5ccc8904cf08ba6b031668dff0041`
- Current-state evidence: `/home/autobyteus/data/memory/agent_teams/software_development_department_d2b93633ad6b4d969e6e0d776dda7721/requirements_engineer_6568eac682114f2cb3ddb8f1d91d3c34/context_files/ctx_4cc02361f417__image.png` (evidence only, not an approved future-state reference).
- Requirements package: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model`
- Ticket folder: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001`
- Prototype revision: Pending.

## Runtime Isolation

- Reserved prototype review port: `4194`
- Current process ownership: None. The ticket review server previously on port `4194` was stopped when the baseline gap was accepted for correction.
- Temporary/runtime state root: `/tmp/autobyteus-prototype-AORG-FLAT-TEAM-001`
- Fixture ownership: Ticket-local synthetic definitions, runs, and history only; no production credentials, services, data, or writes.
- Reset method: Stop only the process recorded for this ticket and remove `/tmp/autobyteus-prototype-AORG-FLAT-TEAM-001`; do not stop or reuse another ticket's runtime.

## Delivery And Validation

- UI/UX specification: Pending prototype and explicit user approval.
- Runnable prototype entry point: Pending implementation; reserved base URL `http://127.0.0.1:4194`.
- Review-image directory: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/review-evidence`
- Final visual-reference directory: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/visual-references` (captures become normative only after explicit user approval and final validation).
- Validation performed: Baseline correction accepted after exact 5/5 source/prototype comparison, Product-owned live Task Agent and Task Team journeys, typecheck, lint, 12 tests, 13 boundary checks, 24 hierarchy regression checks, and production build. The earlier future-state review candidate remains unapproved and must be revalidated after reconciliation and focused revision.
- User-confirmation reference: The request for a Product Design prototype delivered as images is explicit under `RER-010`; no future-state visual or interaction model is approved yet.
- Mocked boundaries and known limitations: Backend, GraphQL, persistence, execution, launch, history, and task lineage will be synthetic and locally resettable. The prototype must not define competing production architecture.

## Outcome And Handoff

- Current outcome: `In Progress` — the baseline prerequisite is corrected, accepted, integrated, and reconciled; Product Experience work has resumed.
- Next expected action: Revise the AgentOrg/flat-Team candidate against the accepted source-current task-runtime organization model, keep transient Task Agent/Task Team rows truthful and runtime-only, remove the candidate's over-prominent generic “Task work” treatment, rerun browser and regression validation, and present a new non-normative review package.
- Integration result: Baseline correction `Completed`; future-state ticket integration remains `Pending` until user approval and finalization.
- Cleanup result: `Pending`; retain the worktree through user review and finalization.
- Handoff result: `Baseline Needed` route completed through `/product_design_prototyping_team/prototype_bootstrapper`; delegated task `task_dd50e47ec3c64e659cc9fac44ffb98a7` returned and Product acceptance succeeded. Next handoff is pending a review-ready or terminal Product Experience classification.
