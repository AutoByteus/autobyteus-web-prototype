# AORG-FLAT-TEAM-001 Review Guide

## Status

- Review state: `Awaiting User Review`
- Prototype revision: `RV-002` candidate; not approved and not normative
- Review server: `http://127.0.0.1:4194`
- Accepted current-experience correction: `PPA-AORG-BASE-001`
- Browser validation: `20/20` pass with zero runtime errors

## Review Journey

1. **Reusable Agent Teams** — [catalog](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-list) and [create](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-create)
   - Agents only; exactly one direct Agent coordinator; no Team member selector.
2. **Agent Orgs** — [catalog](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-list), [create](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-create), and [detail](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-detail&id=software-development-department)
   - Direct independent Agents plus references to reusable Teams; no Org coordinator.
3. **Exact launch entry** — on Org detail, choose **Run Organization**.
   - Start remains disabled until an exact Agent or Team entry is selected; Team entry names its coordinator.
4. **Shared runtime/history** — [AgentOrg runtime](http://127.0.0.1:4194/workspace?prototypeReview=agent-org-flat&root=org&org=software-development-department&entry=team%3Aproduct-design-prototyping-team)
   - Org and standalone Team roots are explicitly typed.
   - Task Agent and Task Team use the accepted source-current temporary-row pattern inside the owning Team execution.
   - Expand `Task: Accessibility evidence review`, then select `reviewer` to see the temporary execution focus.

## Questions For Approval

1. Is the distinction between a reusable AgentTeam and an AgentOrg immediately understandable?
2. Is the exact-entry launch chooser clear enough to prevent an assumed Org coordinator or fallback?
3. Does runtime/history correctly read as an Org or standalone Team root while keeping Task Agent/Task Team rows temporary and runtime-only?
4. Are the information density, labels, and visual hierarchy suitable as the downstream implementation reference?

## Review Images

`review-evidence/rv-002/REV-AORG-001` through `REV-AORG-008` are non-normative review captures. Final `VIS-*` references will be captured only after explicit approval and final validation.
