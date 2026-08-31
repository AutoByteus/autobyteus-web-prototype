# Requirement Impact Findings — AgentOrg And Flat AgentTeam

## RIF-AORG-001 — Handoff Semantics

- Original outcome: `Requirement Impact`
- Resolution: approved `RER-012`, commit `658d602a1`
- Product response: implemented and retained through RV-011

Requirements Engineering confirmed one Handoff as one ordered From Agent, one
eligible To endpoint, and one or more ordered natural-language When conditions.
It also confirmed endpoint eligibility, Team versus Org ownership, Team
destination coordinator resolution, CRUD/reorder/cancel, validation, atomic
save, duplicate/self-resolution rejection, and explicit stale-member
resolution.

RV-011 keeps the user-approved clean treatment: each Handoff shows From, To,
exact addresses, and ordered When. It omits aggregate counts, per-card condition
counts, type badges, repeated coordinator-delivery copy, and architecture
explanations. Org and Team-local editors retain the required interactions and
validation.

## RIF-AORG-002 — AgentOrg Launch And Post-Launch Focus

- Original outcome: `Requirement Impact`
- Trigger: user rejection of the RV-009 pre-launch exact-entry selector
- Historical rejected evidence: `review-evidence/rv-009/REV-AORG-RV9-006-agent-org-exact-entry-launch.png`
- Resolution: approved `RER-013`, commit `86df311c4`
- Status: `Resolved; Product response implemented in RV-011 and awaiting user review`

### Approved Canonical Resolution

1. AgentOrg Run opens one AgentOrg configuration journey with no separate exact-entry selector.
2. A valid launch activates the complete configured Org scope and starts with no communication focus.
3. Launch/configuration/inspection/history do not require focus. A recipient-requiring interaction requires an exact Agent or direct Team selection from the active workspace sidebar.
4. Direct Agent focus uses that exact mounted Agent. Direct Team focus communicates through that Team's exact coordinator.
5. There is no Org coordinator, first-member choice, name-based selection, automatic initial focus, or implicit fallback.
6. Configuration precedence is Org root choice, then containing Team placement override, then exact Agent placement override.
7. Referenced definitions retain their identity, standalone defaults, launchability, handoffs, coordinator, and history. Org-run configuration does not mutate them.

### RV-011 Product Response

- Deleted the RV-009 launch modal and `entry` query-state behavior.
- Run navigates directly to the baseline-native Org configuration.
- Added a compact mounted-scope override tree with Team and exact Agent placements.
- Run activates the complete Org hierarchy without preselecting a member.
- Added a clean unfocused center state and exact sidebar selection behavior.
- Preserved the accepted Agent/Team conversation workspaces, Workspace Files tree, Team coordinator ingress, standalone Team grouping, and task-scoped lineage.
- Added desktop and `390×844` review evidence and deterministic checks for no overlay, no implicit focus, exact Agent focus, Team coordinator focus, and task lineage.

No open requirement-impact finding remains. The concrete UI/UX proposal remains
non-normative until the user explicitly approves RV-011.
