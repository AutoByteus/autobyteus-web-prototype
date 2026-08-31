# AORG-FLAT-TEAM-001 Review Guide

## Status

- Review state: `Paused — Requirement Impact RIF-AORG-002`
- Prototype revision: `RV-009`; its separate exact-entry launch selector was rejected and remains non-normative
- Runnable candidate: `c3221cf3faa6b7c6abab0b4c555b6b88f547cfd1`
- Review server: `http://127.0.0.1:4194`
- Browser validation: `55/55` pass, `17` captures, zero runtime errors
- Static validation: typecheck, lint, `12/12` tests, `13/13` boundaries, and build pass

## Recommended Review

> **Launch review paused:** The user rejected the separate exact-entry selector.
> AgentOrg should enter configuration directly, then allow member focus from the
> left sidebar after launch. Product will revise this journey only after the
> approved launch contract is reconciled. Other RV-009 surfaces remain review
> evidence, not approval.


1. Open [AgentOrg create](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-create).
   - Name and Description start blank; Category is absent.
   - Select **Add member**. The chooser opens in the page rather than in an overlay.
   - Search and switch between **Agents** and **Teams**, then add either kind.
   - The same in-flow chooser remains usable on a narrow screen.
2. Open [AgentOrg detail](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-detail&id=software-development-department).
   - Description has no fabricated Agents/Teams/Handoffs/Last run summary strip.
   - Team cards identify the Team coordinator and provide `View ↗`.
   - Handoff cards show only From, To, exact addresses, and ordered When.
3. On AgentOrg detail select **Run**.
   - Start is disabled until an exact Agent or Team entry is selected.
   - A Team entry names its coordinator, then opens the accepted Team run configuration.
   - Choose `/synthetic/prototype-workspace`; only then does **Run Team** become available.
   - Run opens the accepted Team Workspace rather than an Org-specific dashboard.
   - The left history shows the AgentOrg run, the entered Team, Task Agent/Task Team lineage, and a separate standalone-Team section.
   - Select the Task Agent and Task Team child; each focuses its accepted conversation. Open **Files** to inspect the preserved tree.
4. Repeat launch with the direct `requirements_engineer` Agent.
   - The accepted Agent configuration and Agent Workspace are reused.
   - The non-entered Product Design Team remains collapsed, with no Task lineage shown.
5. Review [AgentOrg edit](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-edit&id=software-development-department).
   - Add, edit, delete, and reorder Handoffs and ordered When guidance.
   - Cancel an open edit without changing the draft.
   - Remove a member and try Save to see explicit stale-Handoff resolution.
6. Review [AgentTeam create](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-create), [detail](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-detail&id=product-design-prototyping-team), and [edit](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-edit&id=product-design-prototyping-team).
   - The accepted product layout, drag/drop, click fallback, Instructions, Member Details, Agent-detail navigation, and Team-local Handoffs remain preserved.
   - The only structural Team-builder delta is Agent-only membership.

## Review Evidence

- AgentOrg authoring: `review-evidence/rv-009/REV-AORG-RV9-004-agent-org-authoring.png`
- Exact-entry launch: `review-evidence/rv-009/REV-AORG-RV9-006-agent-org-exact-entry-launch.png`
- Team configuration: `review-evidence/rv-009/REV-AORG-RV9-007-agent-org-team-entry-config.png`
- Team runtime/history/Files: `review-evidence/rv-009/REV-AORG-RV9-008-agent-org-team-runtime.png`
- Clean Org Handoffs: `review-evidence/rv-009/REV-AORG-RV9-014-agent-org-handoff-detail.png`
- Functional Org Handoff authoring: `review-evidence/rv-009/REV-AORG-RV9-015-agent-org-handoff-authoring.png`
- Narrow in-flow member picker: `review-evidence/rv-009/REV-AORG-RV9-017-agent-org-inline-member-picker-narrow.png`

These are non-normative review captures. Final `VIS-*` images are captured only
after explicit approval and final validation.
