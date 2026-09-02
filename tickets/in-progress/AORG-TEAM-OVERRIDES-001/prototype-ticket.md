# Prototype Ticket

## Identity And Scope

- Product ticket: `AORG-TEAM-OVERRIDES-001`
- Stable requirements package: `AORG-FLAT-TEAM-001`
- Title: AgentOrg mounted-Team Member-overrides hierarchy
- Status: `Awaiting User Review`
- Mode: `Product Experience Prototyping`
- Requirements authority: `RER-022@b985df2ed66b4b2874dd9dae66cd256b6348a795`
- In-scope IDs: `BEH-012`, `UC-014`, `REQ-029`, `AC-024`, `SCN-013`, `QR-009`, `DEC-016`, `ORG-CASE-059`–`ORG-CASE-061`, `ORG-VERIFY-012`.
- Critical journey: open AgentOrg run configuration; open outer Member overrides; expand exactly one mounted Team; selectively customize the Team scope and one exact Agent; collapse and reopen without losing the draft.
- Superseded presentation authority: only RV-012 `ui-ux-spec.md` lines 89–95 and `VIS-015`.
- Preserved authority: unrelated RV-012 behavior, `AORG-FLAT-TEAM-STATUS-001`, and every established AgentTeam launch visual/control behavior outside this focused reuse.
- Non-goals: direct-Agent placement redesign; Org coordinator; configured Team nesting; definition copying/mutation; recipient fallback; shared AgentOrg/AgentTeam runtime or payload ownership; `CR-FIND-019`.

## Repository And Baseline

- Canonical prototype repository/root: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Product ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-TEAM-OVERRIDES-001`
- Product ticket branch: `prototype/aorg-team-overrides-001`
- Integration/default branch: `personal`
- Accepted prototype base after current-experience refresh: `0d9f1bdc2a103abce050812b15160de250a4aa00`
- Source repository: `/home/autobyteus/workspace/autobyteus-workspace`
- Selected frontend: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web`
- Accepted baseline source pin: `5fb16658e7bd2aefd750f99eb596a17382e161ac`
- Accepted Bootstrapper report: `/home/autobyteus/workspace/autobyteus-web-prototype/prototype-bootstrap-report.md`
- Accepted baseline refresh ticket: `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-TEAM-LAUNCH-BASELINE-REFRESH-001/prototype-ticket.md`
- Established Team-launch authority: refreshed `TeamRunConfigForm.vue`, `TeamMemberConfigTree.vue`, `TeamScopeConfigEditor.vue`, and `MemberOverrideItem.vue` at the accepted prototype base.
- Superseded reference: `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-001/visual-references/VIS-015-agent-org-placement-overrides-desktop-1440x900.png`.

## Runtime Isolation

- Ticket-owned review port: `4198`
- Start command: `corepack pnpm dev --port 4198`
- Review URL: `http://127.0.0.1:4198/workspace?root=org&org=software-development-department&phase=config&prototypeReview=aorg-team-overrides`
- Temporary state root: `/tmp/autobyteus-prototype-AORG-TEAM-OVERRIDES-001`
- Reset method: reload the review URL; it restores outer Member overrides collapsed and clears the in-memory draft.
- Runtime process: active for user review; Product-owned process group recorded in `/tmp/autobyteus-prototype-AORG-TEAM-OVERRIDES-001/server.pid`.

## Focused Experience Contract

- Outer `Member overrides` is collapsed initially.
- Opening it leaves every mounted Team independently collapsed.
- Each Team row shows readable name, `TEAM`, exact mounted address, explicit `Inherited` or `Customized` Team-scope state, and an accessible disclosure. The coordinator appears only on the exact coordinator Agent row.
- Expanding a Team reveals Team-placement runtime/model/Workspace/auto-approve controls and exact direct-Agent rows in the accepted AgentTeam launch visual/control grammar. Sibling Teams remain collapsed.
- Team and Agent configuration state is exact-scope-local. Agent-only customization never relabels the Team scope.
- Valid Team and Agent drafts survive Team collapse/reopen. Effective precedence remains exact Agent → containing Team → Org root; launch validation remains unchanged.
- Direct Org Agent placement behavior and all unrelated AgentOrg journeys remain unchanged.

## Delivery And Validation

- UI/UX supplement: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-TEAM-OVERRIDES-001/tickets/in-progress/AORG-TEAM-OVERRIDES-001/ui-ux-spec.md`
- Review guide: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-TEAM-OVERRIDES-001/tickets/in-progress/AORG-TEAM-OVERRIDES-001/review-guide.md`
- Change log: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-TEAM-OVERRIDES-001/tickets/in-progress/AORG-TEAM-OVERRIDES-001/prototype-change-log.md`
- Review evidence: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-TEAM-OVERRIDES-001/tickets/in-progress/AORG-TEAM-OVERRIDES-001/review-evidence/rv-001`
- Browser validation: `11/11` pass at desktop and `390x844`, including draft preservation, Agent-only scope isolation, preserved AgentTeam launch behavior, and zero browser errors.
- Static validation: `git diff --check`, typecheck, lint, `15/15` tests, `13/13` boundaries, and production build pass; only the accepted duplicate-auto-import and large-chunk warnings remain.
- Ticket revision: review candidate commit pending in this worktree.
- Normative final `VIS-*` references: pending explicit user approval.
- Promoted default baseline revision: pending explicit user approval and repository finalization.

## Outcome And Next Action

- Current outcome/status: `Awaiting User Review`.
- Integration result: `Pending`.
- Promotion result: `Pending`; this review URL is non-normative evidence, not proof of default-route promotion.
- Cleanup result: `Pending` while the user review server remains available.
- Next action: user reviews the focused mounted-Team Member-overrides journey and explicitly approves or requests focused changes.
