# UI/UX Specification Supplement — AgentOrg Mounted-Team Member Overrides

## Status And Authority

- Status: `RV-003 — awaiting explicit user approval`.
- Product ticket: `AORG-TEAM-OVERRIDES-001`.
- Stable requirements package: `AORG-FLAT-TEAM-001`.
- Requirements revision: `RER-022@b985df2ed66b4b2874dd9dae66cd256b6348a795`.
- Related IDs: `BEH-012`, `UC-014`, `REQ-029`, `AC-024`, `SCN-013`, `QR-009`, `DEC-016`, `ORG-CASE-059`–`ORG-CASE-061`, `ORG-VERIFY-012`.
- Supersession boundary: replace only RV-012 Placement Overrides lines 89–95 and `VIS-015`. Preserve unrelated RV-012 and mounted-Team status authority.
- Current-experience authority: AgentTeam launch baseline refreshed from `origin/personal@5fb16658e7bd2aefd750f99eb596a17382e161ac`, accepted in prototype revision `0d9f1bdc2a103abce050812b15160de250a4aa00`.
- Review candidate implementation revision: `432e117243f777239f79ffb05d4eb95bdfa1402e`.

## Intended Product Experience

### Initial state

`Member overrides` is a single compact disclosure after the AgentOrg root configuration and is collapsed whenever a new configuration draft opens. The page therefore retains the existing AgentOrg configuration hierarchy and does not introduce a second setup step.

The disclosure reads `Member overrides (N)`, where `N` is the count of exact Agent placements configurable below it: direct Org Agents plus Agents inside each mounted Team. The disclosure chevron sits immediately beside that label, using the established AgentTeam disclosure grouping rather than occupying the far edge of the configuration panel.

### Mounted Team rows

Opening `Member overrides` displays the preserved direct Org Agent placement first, followed by the mounted Teams in their configured order. Every mounted Team starts independently collapsed. The Team row reuses the accepted AgentTeam launch disclosure grammar:

- readable Team name;
- neutral `TEAM` marker;
- exact mounted address in monospace;
- explicit Team-scope `Inherited` or `Customized` state;
- focus-visible, keyboard-operable disclosure with `aria-expanded` and controlled-panel relationship.

The Team row does not add Org coordination, runtime status, launch controls, copied-definition language, or a second lifecycle owner. Coordinator identity is secondary and appears on the exact coordinator Agent row inside the expanded Team.

### Expanded Team scope

Expanding a mounted Team reveals that placement's Runtime, Default LLM Model, Workspace Directory, and Auto approve controls using the same labels, density, quiet fields, helper hierarchy, inherited values, and control treatment as the accepted AgentTeam launch form. Beneath those Team-level controls, the Team's exact direct-Agent rows use the accepted AgentTeam member override component. A sibling Team remains collapsed unless the user explicitly opens it.

For this flat-Team AgentOrg context, the model helper reads `Agents in this Team inherit this value unless customized.` It intentionally does not imply configured Team nesting.

### Exact-scope configuration state

- `Inherited` on a Team means that Team placement itself has no override.
- `Customized` on a Team appears only after a Team-placement field differs from the Org root.
- An Agent row is overridden only after that exact mounted Agent receives an override.
- An Agent-only override leaves its Team row `Inherited`.
- Effective settings remain exact Agent override → containing Team placement override → AgentOrg root choice.
- Team `Reset` clears only the Team-placement override. It does not remove exact-Agent overrides or mutate the reusable Team definition.

### Draft continuity

The outer panel and each Team panel use visibility-preserving disclosures rather than remounting their forms. Valid edits remain in the in-memory draft when a Team is collapsed and reopened. The visible Team and Agent state markers, switches, and inherited field values restore exactly. Reloading the review URL intentionally resets the synthetic prototype draft.

## Layout And Responsive Behavior

- Desktop preserves the existing three-pane Workspace shell and scroll ownership: only the central configuration pane scrolls, while the launch action remains docked.
- Mounted Team rows use one compact hierarchy card below the separately preserved direct-Agent placement card.
- At `390x844`, existing adaptive navigation rails remain intact; Team name/address content truncates without creating horizontal overflow, while `TEAM`, inheritance state, and the disclosure remain available.
- No modal, popover, side overlay, or viewport-covering member selector is introduced.

## Interaction And Accessibility

- Outer and Team disclosures are native buttons with accessible expanded state.
- Disclosure chevrons rotate but are not the only state signal; text labels remain visible.
- `Inherited`, `Customized`, `Coordinator`, and exact-Agent `Overridden` labels communicate configuration meaning without color alone.
- Keyboard focus styling comes from the accepted AgentTeam launch components.
- The four required review states are reached through real component interactions, not static image swaps.

## Preserved Behavior

The change does not alter direct Org Agent placement behavior; AgentOrg root fields; Workspace validation; Run Agent Org behavior; Org launch semantics; focus/recipient semantics; handoffs; catalog/detail/edit surfaces; active/history hierarchy; mounted-Team status; or standalone AgentTeam launch behavior. The browser regression explicitly exercises the accepted standalone AgentTeam launch form after the shared component extension.

## Mocked And Production Boundaries

The prototype uses deterministic local AgentOrg, Team, Agent, model, Workspace, and draft data. No production runtime launch, persistence, API, authorization, filesystem write, or definition mutation is performed. The UI specifies the reviewed interaction and visual contract only; Software Engineering owns production architecture and implementation.

## Validation And Review Evidence

- Review URL: `http://127.0.0.1:4198/workspace?root=org&org=software-development-department&phase=config&prototypeReview=aorg-team-overrides`.
- Browser result: `14/14` pass with zero browser errors. The fixture label is `Member overrides (7)`, the outer label-to-chevron gap measures `6px`, and computed font family, size, weight, line height, letter spacing, color, padding, and radius exactly match the accepted AgentTeam disclosure.
- Required states:
  - `RV3-001-initial-outer-collapsed-1440x900.png`
  - `RV3-002-outer-open-teams-collapsed-1440x900.png`
  - `RV3-003-team-expanded-inherited-1440x900.png`
  - `RV3-004-team-agent-customized-reopened-1440x900.png`
- Responsive evidence: `RV3-005-outer-open-teams-collapsed-narrow-390x844.png`.
- Machine evidence: `review-evidence/rv-003/browser-validation.json`.
- Static evidence: `validation/static-validation-rv-003.txt`.

These `RV-*` captures are review evidence only. They are not normative final references and will not be promoted or handed off as approved visuals until the user explicitly approves the live candidate.

## Approval And Final References

- User approval: `Pending`.
- User-confirmation reference: `Pending`.
- Normative `VIS-*` references: capture after approval and final validation.
- Default-route promotion validation: pending approval and integration.
