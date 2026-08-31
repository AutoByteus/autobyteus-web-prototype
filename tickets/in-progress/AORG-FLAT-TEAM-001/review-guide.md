# AORG-FLAT-TEAM-001 Review Guide

## Status

- Review state: `Awaiting User Review`
- Prototype revision: `RV-006` candidate at `e1282e15e274f7a3654364f131aa91d5af4d3602`; not approved and not normative
- Review server: `http://127.0.0.1:4194`
- Accepted baseline comparison: `http://127.0.0.1:4195/agent-teams?view=team-list`
- Accepted current-experience correction: `PPA-AORG-BASE-001`
- Browser validation: `30/30` pass with zero runtime errors

## Review Journey

1. **Agent Teams** — compare the [accepted baseline](http://127.0.0.1:4195/agent-teams?view=team-list) with the [revised catalog](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-list), then inspect [create](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-create) and [detail](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-detail&id=product-design-prototyping-team).
   - The catalog preserves the baseline toolbar, Featured/All grouping, cards, initials, categories, member chips, and action placement.
   - Only the obsolete nested-Team metric is replaced by Runs; members remain Agents only with exactly one direct Agent coordinator and no Team member selector.
   - Team detail preserves the baseline Description and Instructions cards. Each member has the baseline-style `View ↗` action; Agent detail uses the accepted product surface and **Back to team** returns to the same future-state Team context.
2. **Agent Orgs** — [catalog](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-list), [create](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-create), and [detail](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-detail&id=software-development-department)
   - The catalog now uses the same toolbar, card geometry, spacing, and blue action language as Agent Teams without repeating a visible page title, type badge, composition explainer, or coordinator disclaimer.
   - Create and detail keep Agents and Teams separate, preserve same-identity Team references, and expose no coordinator control.
3. **Exact launch entry** — on Org detail, choose **Run**.
   - Start remains disabled until an exact Agent or Team entry is selected; Team entry names its coordinator.
4. **Shared runtime/history** — [AgentOrg runtime](http://127.0.0.1:4194/workspace?prototypeReview=agent-org-flat&root=org&org=software-development-department&entry=team%3Aproduct-design-prototyping-team)
   - Org and standalone Team roots are explicitly typed.
   - Task Agent and Task Team use the accepted source-current temporary-row pattern inside the owning Team execution.
   - Expand `Task: Accessibility evidence review`, then select `reviewer` to see the temporary execution focus.

## Questions For Approval

1. Do the revised AgentTeam journey and self-contained Team detail now feel like a precise evolution of the accepted baseline?
2. Does the AgentOrg catalog/detail/authoring visual language now feel native to the existing product, and is exact-entry launch understandable without explanatory coordinator chrome?
3. Does runtime/history correctly read as an Org or standalone Team root while keeping Task Agent/Task Team rows temporary and runtime-only?
4. Are the information density, labels, and visual hierarchy suitable as the downstream implementation reference?

## Review Images

`review-evidence/rv-006/REV-AORG-001` through `REV-AORG-011` are non-normative review captures. `REV-AORG-009` shows Description/Instructions/Handoffs; `REV-AORG-010` shows preserved member actions; `REV-AORG-011` shows the reused Agent detail. Final `VIS-*` references will be captured only after explicit approval and final validation.
