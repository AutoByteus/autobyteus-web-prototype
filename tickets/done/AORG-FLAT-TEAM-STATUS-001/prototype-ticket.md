# Prototype Ticket

## Identity And Scope

- Product ticket: `AORG-FLAT-TEAM-STATUS-001`
- Stable requirements package: `AORG-FLAT-TEAM-001`
- Title: Mounted AgentOrg Team aggregate status supplement
- Status: `Approved — Finalization In Progress`
- Mode: `Product Experience Prototyping`
- Requirements authority: `RER-020@bf5951867f87d1e5bb6eaa8bfc7b82b2c6f6cba5`
- In-scope IDs: `BEH-011`, `REQ-028`, `AC-023`, `SCN-012`, `AORG-CONTRACT-001` `ORG-CASE-056`–`ORG-CASE-058`.
- Critical journey: inspect a direct reusable Team mounted in an AgentOrg while expanded, collapse it without losing the Team aggregate signal, then inspect truthful stopped/historical projected status.
- Preserved approved authority: `AORG-FLAT-TEAM-001` RV-012 `VIS-001`–`VIS-020` and `BASELINE-PROMOTION-001` remain closed and approved except for the named `API-FIND-007` omission.
- Non-goals: catalog, authoring, handoff, configuration, launch, focus, conversation, hierarchy, responsive redesign, standalone mounted-Team lifecycle, Team-root persistence/transport, or changes to Org-owned Stop/restore/archive.

## Repository And Baseline

- Canonical prototype repository/root: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Product ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-STATUS-001`
- Product ticket branch: `prototype/aorg-flat-team-status-001`
- Integration/default branch: `personal`
- Accepted prototype base: `12c014eff49cf53c58725683b5aa2efa75d921c3`
- Source repository: `/home/autobyteus/workspace/autobyteus-workspace`
- Selected frontend: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web`
- Accepted baseline source pin: `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Accepted Bootstrapper report: `/home/autobyteus/workspace/autobyteus-web-prototype/prototype-bootstrap-report.md`
- Current omission evidence: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-001/resumed-crr008/screenshots/ORG-005-direct-agent-conversation.png`
- Original Team-row signal evidence: `/home/autobyteus/data/memory/agent_teams/software_development_department_d2b93633ad6b4d969e6e0d776dda7721/software_engineering_team_570be46d520142849ac61785be03dca1/api_e2e_engineer_d23a092db04042b69d944416be75d3b9/context_files/ctx_8cd213e66142__image.png`

## Runtime Isolation

- Ticket-owned review port: `4197`
- Start command: `corepack pnpm dev --port 4197`
- Temporary state root: `/tmp/autobyteus-prototype-AORG-FLAT-TEAM-STATUS-001`
- Reset method: fresh browser context and direct deterministic review URL.
- Runtime process: `Running` — port `4197`, PID `14144`, execution session `80222`.
- Existing canonical baseline server on `4194` is user-owned review context and must not be stopped or reused by this ticket.

## Decision Contract

- Team-row aggregate precedence: `running > initializing > error > idle > offline`.
- Inputs: exact configured and task-scoped descendant Agent statuses inside that Team branch only.
- Exclusions: Team container, direct Org Agents, ancestors, sibling Teams, and outside rows.
- Empty, missing, or unknown input: `offline`.
- Presentation: established status position between disclosure and Team identity; visible expanded and collapsed; accessible label/title without relying on color.
- Historical truth: stopped/history uses terminal projected descendant Agent states and never retains unowned live `running`/`initializing`.
- Lifecycle boundary: no mounted-Team Stop/restore/archive, polling, persistence, transport, recipient fallback, readiness/routing/command effect, or second lifecycle owner.

## Delivery And Validation

- UI/UX supplement: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-STATUS-001/tickets/done/AORG-FLAT-TEAM-STATUS-001/ui-ux-spec.md`
- Review guide: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-STATUS-001/tickets/done/AORG-FLAT-TEAM-STATUS-001/review-guide.md`
- Review evidence: `9/9` focused browser checks passed with zero browser errors, including the clean/default active route; active-expanded, active-collapsed, and stopped/historical captures are under `review-evidence/rv-001/`.
- Static validation: `Passed` — diff check, typecheck, lint, `15/15` tests, `13/13` boundary checks, and production build. Durable log: `validation/static-validation.txt`.
- Ticket revision: pre-approval review candidate in the ticket working tree at accepted base `12c014eff49cf53c58725683b5aa2efa75d921c3`; commit intentionally pending explicit user approval.
- Promoted default baseline revision: `Pending`

## Outcome And Next Action

- Current outcome/status: `Approved — Finalization In Progress`.
- Integration result: `Pending`.
- Promotion result: `Pending`.
- Cleanup result: `Pending`.
- Next action: complete final static validation, commit the accepted ticket result, integrate and validate the clean default baseline, close the ticket, and complete the required Requirements Engineering handoff.
