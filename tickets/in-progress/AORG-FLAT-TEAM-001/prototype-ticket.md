# Prototype Ticket

## Identity And Scope

- Ticket / request ID: `AORG-FLAT-TEAM-001`
- Title: AgentOrg and flat AgentTeam product experience
- Status: `Awaiting User Review`
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
- Established bootstrap report: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/prototype-bootstrap-report.md` (latest correction report; both named task-runtime items pass).
- Baseline correction worktree: removed safely after accepted integration; historical path `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction`.
- Baseline correction branch: deleted safely after fast-forward integration into `personal`.
- Corrected inventory IDs: `UXB-CORR-TASK-AGENT-001`, `UXB-CORR-TASK-TEAM-001` — both `Pass`.
- Baseline Product acceptance: `/home/autobyteus/workspace/autobyteus-web-prototype/evidence/AORG-FLAT-TEAM-001/baseline-correction/product-acceptance/product-acceptance.md`
- Accepted baseline correction commit: `893cde9dbcc5ccc8904cf08ba6b031668dff0041`
- Current-state evidence: `/home/autobyteus/data/memory/agent_teams/software_development_department_d2b93633ad6b4d969e6e0d776dda7721/requirements_engineer_6568eac682114f2cb3ddb8f1d91d3c34/context_files/ctx_4cc02361f417__image.png` (evidence only, not an approved future-state reference).
- Requirements package: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model`
- Ticket folder: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001`
- Prototype revision: `RV-002` review candidate at `c619087229c08a5a90e0459132d57a2b3b1c5a92`; unapproved and unintegrated.

## Runtime Isolation

- Reserved prototype review port: `4194`
- Current process ownership: `corepack pnpm dev --port 4194`, parent PID `25138`, Nuxt child PID `25155`; owned only by this ticket.
- Temporary/runtime state root: `/tmp/autobyteus-prototype-AORG-FLAT-TEAM-001`
- Fixture ownership: Ticket-local synthetic definitions, runs, and history only; no production credentials, services, data, or writes.
- Reset method: Stop only the process recorded for this ticket and remove `/tmp/autobyteus-prototype-AORG-FLAT-TEAM-001`; do not stop or reuse another ticket's runtime.

## Delivery And Validation

- UI/UX specification: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/ui-ux-spec.md` — draft, non-normative pending explicit approval.
- Runnable prototype entry point: `http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-list`.
- Review guide: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/review-guide.md`
- Review-image directory: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/review-evidence`
- Final visual-reference directory: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/visual-references` (captures become normative only after explicit user approval and final validation).
- Validation performed: Baseline correction accepted after exact 5/5 source/prototype comparison. Reconciled future-state `RV-002`: browser journey `20/20` pass, `8` review captures, zero runtime errors; `1440×900` desktop and `390×844` narrow; typecheck, lint, `12` tests, `13` boundary checks, `24` accepted hierarchy regression checks, and production build pass. Existing accepted duplicate-getter and bundle-size warnings only.
- User-confirmation reference: The request for a Product Design prototype delivered as images is explicit under `RER-010`; no future-state visual or interaction model is approved yet.
- Mocked boundaries and known limitations: Backend, GraphQL, persistence, execution, launch, history, and task lineage will be synthetic and locally resettable. The prototype must not define competing production architecture.

## Outcome And Handoff

- Current outcome: `Awaiting User Review` — baseline prerequisite is accepted and integrated; `RV-002` is review-ready but not approved or normative.
- Next expected action: User reviews the Team, Org, exact-entry launch, and runtime/history journeys and explicitly approves the candidate or requests focused revisions. Final `VIS-*` references, approved `ui-ux-spec.md`, completion commit, integration, and Requirements Engineering handoff remain pending.
- Integration result: Baseline correction `Completed`; future-state ticket integration remains `Pending` until user approval and finalization.
- Cleanup result: Baseline-correction worktree/process/branch cleaned safely. Retain the active AORG worktree and port `4194` preview through user review and finalization.
- Handoff result: `Baseline Needed` route completed through `/product_design_prototyping_team/prototype_bootstrapper`; delegated task `task_dd50e47ec3c64e659cc9fac44ffb98a7` returned and Product acceptance succeeded. Next handoff is pending a review-ready or terminal Product Experience classification.
