# AORG-FLAT-TEAM-001 Review Guide

## Status

- Review state: `Awaiting User Review`
- Prototype revision: `RV-008`; not approved and not normative
- Review server: `http://127.0.0.1:4194`
- Accepted builder comparison: `http://127.0.0.1:4195/agent-teams?view=team-create`
- Browser validation: `48/48` pass, `16` captures, zero runtime errors

## Recommended Review

1. Open [AgentTeam create](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-create).
   - Drag an Agent from Agent Library into Team Canvas, or click the Agent as a fallback.
   - Select different canvas members. Member Details edits Member Name and coordinator state; Type, Source, and Scope are inspectable.
   - The layout, empty state, drag interaction, selection, member editing, checklist, and narrow stacking are preserved from the accepted product. Only the Team library/member kind is removed.
2. Open [AgentOrg detail](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-detail&id=software-development-department).
   - The header is compact.
   - Description has no Agents/Teams/Handoffs/Last run summary strip.
   - Team cards identify the Team coordinator and provide `View ↗`.
   - Handoff cards show only From, To, exact addresses, and ordered When.
   - No `Via coordinator`, same-definition, type badge, aggregate count, or per-card condition count is repeated.
3. Open [AgentOrg edit](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-edit&id=software-development-department).
   - Add, edit, delete, and reorder Handoffs.
   - Add, delete, and reorder When guidance.
   - Cancel an open edit without changing the draft.
   - Remove a member and try Save to see explicit stale-Handoff resolution instead of silent deletion or retargeting.
4. Review [Team detail](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-detail&id=product-design-prototyping-team) and [Team edit](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-edit&id=product-design-prototyping-team).
   - Instructions and member Agent-detail navigation remain preserved.
   - Team-local Handoff endpoints are direct Team Agents only.
   - Team detail remains self-contained and contains no AgentOrg promotion.
5. On Org detail choose **Run**, select an exact Agent or Team entry, and continue to runtime/history.
   - Start is disabled until a selection exists.
   - Org and standalone-Team roots remain distinct.
   - Task Agent and Task Team stay runtime lineage rather than configured membership.

## Review Evidence

- Clean Org detail: `review-evidence/rv-008/REV-AORG-005-agent-org-detail.png`
- Clean Org Handoffs: `review-evidence/rv-008/REV-AORG-014-agent-org-handoff-detail.png`
- Functional Org authoring: `review-evidence/rv-008/REV-AORG-015-agent-org-handoff-authoring.png`
- Team-local Handoffs: `review-evidence/rv-008/REV-AORG-012-team-local-handoff-detail.png`
- Team-local editor: `review-evidence/rv-008/REV-AORG-013-team-local-handoff-authoring.png`
- Precise Team builder: `review-evidence/rv-008/REV-AORG-002-agent-team-authoring.png`
- Narrow Team builder: `review-evidence/rv-008/REV-AORG-016-agent-team-builder-narrow.png`
- Accepted-baseline audit: `review-evidence/rv-008/source-comparison/agent-team-builder-audit.md`

These are non-normative review captures. Final `VIS-*` images are captured only
after explicit approval and final validation.
