# AORG-FLAT-TEAM-001 Review Guide

## Status

- Review state: `Awaiting User Review`
- Prototype revision: `RV-004` candidate; not approved and not normative
- Review server: `http://127.0.0.1:4194`
- Accepted baseline comparison: `http://127.0.0.1:4195/agent-teams?view=team-list`
- Accepted current-experience correction: `PPA-AORG-BASE-001`
- Browser validation: `24/24` pass with zero runtime errors

## Review Journey

1. **Agent Teams** — compare the [accepted baseline](http://127.0.0.1:4195/agent-teams?view=team-list) with the [revised catalog](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-list), then inspect [create](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-create) and [detail](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-detail&id=product-design-prototyping-team).
   - The catalog preserves the baseline toolbar, Featured/All grouping, cards, initials, categories, member chips, and action placement.
   - Only the obsolete nested-Team metric is replaced by Runs; members remain Agents only with exactly one direct Agent coordinator and no Team member selector.
2. **Agent Orgs** — [catalog](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-list), [create](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-create), and [detail](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-detail&id=software-development-department)
   - Direct independent Agents plus references to reusable Teams; no Org coordinator.
3. **Exact launch entry** — on Org detail, choose **Run Organization**.
   - Start remains disabled until an exact Agent or Team entry is selected; Team entry names its coordinator.
4. **Shared runtime/history** — [AgentOrg runtime](http://127.0.0.1:4194/workspace?prototypeReview=agent-org-flat&root=org&org=software-development-department&entry=team%3Aproduct-design-prototyping-team)
   - Org and standalone Team roots are explicitly typed.
   - Task Agent and Task Team use the accepted source-current temporary-row pattern inside the owning Team execution.
   - Expand `Task: Accessibility evidence review`, then select `reviewer` to see the temporary execution focus.

## Questions For Approval

1. Does the revised AgentTeam catalog now feel like the accepted baseline rather than a separate redesign?
2. Is the exact-entry launch chooser clear enough to prevent an assumed Org coordinator or fallback?
3. Does runtime/history correctly read as an Org or standalone Team root while keeping Task Agent/Task Team rows temporary and runtime-only?
4. Are the information density, labels, and visual hierarchy suitable as the downstream implementation reference?

## Review Images

`review-evidence/rv-004/REV-AORG-001` through `REV-AORG-009` are non-normative review captures. Final `VIS-*` references will be captured only after explicit approval and final validation.
