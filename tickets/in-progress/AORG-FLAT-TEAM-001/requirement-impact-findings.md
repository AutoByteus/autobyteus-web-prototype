# Requirement Impact Findings — AgentOrg Handoff UI

## Status

- Package: `AORG-FLAT-TEAM-001`
- Prototype revision under review: committed `RV-006` at `e1282e15e274f7a3654364f131aa91d5af4d3602`
- Finding: `RIF-AORG-001`
- Outcome: `Requirement Impact`
- Date: `2026-08-31`

## User Feedback

The user identified that the AgentOrg handoff presentation is not complete:

1. A handoff has explicit **From**, **To**, and **When** meaning, but the current
   detail cards do not expose those fields clearly.
2. The AgentOrg edit page shows an **Add rule** action, but no usable rule
   authoring interaction is implemented.
3. Product Design should ask Requirements Engineering for the correct handoff
   presentation and authoring model before continuing.

The user also asked to remove redundant Team-reference copy such as
`Same Team definition · standalone history preserved`. That density cleanup is
clear and is being preserved as an in-progress, uncommitted `RV-007` change; it
does not resolve the handoff gap.

## Current Requirements Evidence

- `BEH-003` preserves Agent-only handoff sources, Agent-or-Team destinations,
  ordered rules, canonical rooted addresses, and failure-closed resolution.
- `REQ-006` requires Org-scoped handoffs from a mounted Agent source to a mounted
  Agent or Team destination, including cross-Team destinations; Team-local
  handoffs remain Team-scoped and may be rebased once when mounted.
- `REQ-007` constrains recipient resolution to the active Org/Team scope.
- `AC-013` requires Org handoffs to reach a referenced Team/coordinator or its
  Agents without mutating the Team definition.

These requirements establish domain behavior but do not yet give Product Design
an explicit, reviewable authoring interaction for the user's requested
**From / To / When** model.

## Clarification Requested From Requirements Engineering

Please confirm or revise the canonical requirements for the following UI-visible
behavior:

1. **Rule fields:** Must every Org handoff row/editor expose labeled `When`,
   `From`, and `To` fields? What is the canonical meaning and user-facing form of
   `When`—a display label, a natural-language condition, an outcome selector, or
   another established value?
2. **From choices:** Does `From` include every mounted Agent in the Org,
   including Agents inside referenced Teams, while excluding Team and Org
   subjects as sources?
3. **To choices:** Does `To` include direct Agents, referenced Teams, and Agents
   inside referenced Teams? When a Team is selected, should the editor/detail
   show that delivery enters through the Team coordinator, and at what level of
   prominence?
4. **Address display:** Should canonical rooted recipient/source addresses be
   always visible, secondary metadata, or shown only in the chooser/detail?
5. **Authoring actions:** What are the required Add/Edit/Delete/Reorder behaviors,
   validation, disabled states, empty state, cancellation, and save feedback?
6. **Scope separation:** Should the Org editor show only Org-owned rules, while
   Team-local handoffs remain editable only on the referenced Team surface?

## Prototype Impact

- Affected surfaces: AgentOrg detail and AgentOrg create/edit.
- Affected IDs: `BEH-003`; `REQ-006`, `REQ-007`, `REQ-016`, `REQ-019`;
  `AC-003`, `AC-013`, `AC-014`; `SCN-003`, `SCN-006`.
- Current handoff cards and the inert Add rule action are not approval-ready.
- Product Design will not invent the missing rule editor while clarification is
  pending.
- AgentTeam/AgentOrg catalog, membership, launch, and runtime/history work remain
  preserved and runnable.
