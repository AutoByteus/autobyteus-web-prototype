# Prototype Ticket

## Identity And Scope

- Ticket / request ID: `AORG-FLAT-TEAM-001`
- Title: AgentOrg and flat AgentTeam product experience
- Status: `In Progress — Requirement Impact`
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
- Accepted prototype base revision: `893cde9dbcc5ccc8904cf08ba6b031668dff0041`; local `personal` and `origin/personal` are synchronized at this revision, and it is an ancestor of the ticket branch.
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
- Prototype revision: `RV-006` production-native Team/Org separation candidate at `e1282e15e274f7a3654364f131aa91d5af4d3602`. Committed on the ticket branch; unapproved and unintegrated.

## Runtime Isolation

- Reserved prototype review port: `4194`
- Current process ownership: `corepack pnpm dev --port 4194`, parent PID `25138`, Nuxt child PID `25155`; owned only by this ticket.
- Temporary accepted-baseline comparison preview: read-only canonical `personal` on port `4195`, exec session `25646`; opened only for direct visual comparison and not used as an editing checkout.
- Temporary/runtime state root: `/tmp/autobyteus-prototype-AORG-FLAT-TEAM-001`
- Fixture ownership: Ticket-local synthetic definitions, runs, and history only; no production credentials, services, data, or writes.
- Reset method: Stop only the process recorded for this ticket and remove `/tmp/autobyteus-prototype-AORG-FLAT-TEAM-001`; do not stop or reuse another ticket's runtime.

## Delivery And Validation

- UI/UX specification: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/ui-ux-spec.md` — draft, non-normative pending explicit approval.
- Runnable prototype entry point: `http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-list`.
- Review guide: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/review-guide.md`
- Review-image directory: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/review-evidence`
- Final visual-reference directory: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/visual-references` (captures become normative only after explicit user approval and final validation).
- Validation performed: Baseline correction accepted after exact 5/5 source/prototype comparison. `RV-006` browser journey passes `30/30` checks with `11` review captures and zero runtime errors. It verifies the self-contained Team detail, baseline-native Org catalog/search/Reload, blue product actions, absence of repeated Org/coordinator explanation, exact-entry launch, preserved Team Instructions/member details, and desktop/narrow layouts. Typecheck, lint, `12/12` tests, `13/13` boundary checks, `24/24` accepted hierarchy regression, production build, and browser validation pass. Existing duplicate-getter and bundle-size warnings remain accepted baseline warnings.
- User-confirmation reference: The request for a Product Design prototype delivered as images is explicit under `RER-010`. Review feedback requires both Team and Org surfaces to be precise evolutions of the accepted baseline: no repeated visible page/type/reuse/coordinator explanation, no Team-to-Org promotional block on Team detail, concise contextual `Handoffs`, blue product actions, and preserved Team Instructions plus member Agent-detail/return flow. Direct comparison confirmed the preserved Team behaviors already exist in the accepted `personal` baseline, so this remains future-state reconciliation rather than a baseline refresh. No future-state visual or interaction model is approved yet.
- Mocked boundaries and known limitations: Backend, GraphQL, persistence, execution, launch, history, and task lineage will be synthetic and locally resettable. The prototype must not define competing production architecture.

## Outcome And Handoff

- Current outcome: `Requirement Impact` — the user confirmed that AgentOrg handoffs must present explicit From, To, and When meaning and that edit requires a real Add rule interaction. The current condensed cards and inert action are not approval-ready. `RV-006` remains the last committed review revision; an uncommitted `RV-007` density cleanup is preserved while handoff behavior is paused for Requirements Engineering clarification.
- Next expected action: Requirements Engineering answers `RIF-AORG-001` with the canonical From/To/When display and Add/Edit/Delete/Reorder rule-authoring behavior. Product Design then implements and validates `RV-007` before returning to user review. Final `VIS-*` references and completion remain pending.
- Integration result: Baseline correction `Completed`; future-state ticket integration remains `Pending` until user approval and finalization.
- Cleanup result: Baseline-correction worktree/process/branch cleaned safely. Retain the active AORG worktree and port `4194` preview through user review and finalization.
- Handoff result: Baseline route completed previously. `Requirement Impact` handoff for `RIF-AORG-001` is pending delivery to the exact rule-configured Requirements Engineering recipient.
