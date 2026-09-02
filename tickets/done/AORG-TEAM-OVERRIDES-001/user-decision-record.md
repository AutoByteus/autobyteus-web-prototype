# User Decision Record — AORG-TEAM-OVERRIDES-001

## Decision

- Date: `2026-09-02`
- Decision: `Approved`
- User confirmation: `“Okay, now I approve. Thanks, I confirm it's done.”`
- Approved review revision: `RV-003`
- Approved implementation revision: `432e117243f777239f79ffb05d4eb95bdfa1402e`
- Review metadata revision: `3def7c6`
- Accepted Product ticket and promoted baseline revision: `b21b192959f80c55ca08e0fe302c434817c4f1cb`

## Approved Experience

- AgentOrg run configuration presents one initially collapsed `Member overrides (N)` disclosure using the established AgentTeam typography and disclosure styling.
- `N` counts exact configurable Agent placements: direct Org Agents plus Agents inside mounted Teams.
- Opening the outer disclosure preserves the direct Agent placement and shows every mounted Team independently collapsed.
- A mounted Team row presents its readable name, `TEAM` marker, exact mounted address, Team-scope `Inherited` or `Customized` state, and adjacent accessible disclosure.
- Expanding a Team uses the established AgentTeam Team-scope and exact-Agent controls. A sibling Team remains collapsed.
- Team and exact-Agent override states remain scope-local, and valid draft changes survive collapse and reopen.

## Approval Context

The user reviewed the live candidate at port `4198`, corrected the outer chevron placement, requested the member count, and required visual parity with the original AgentTeam Member-overrides experience. The approved candidate incorporates those corrections. The final normative references were captured only after this confirmation through the clean route without `prototypeReview` state.

## Remaining Decisions

None within `RER-022` scope.
