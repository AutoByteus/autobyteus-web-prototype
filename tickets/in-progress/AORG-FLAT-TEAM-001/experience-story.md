# Experience Story

## Prototype Scope

- Prototype request: one coherent product UI model for flat reusable AgentTeams and coordinator-free AgentOrgs.
- Related IDs: `BEH-001`, `BEH-003`, `BEH-004`, `BEH-006`; `REQ-001`–`REQ-004`, `REQ-006`, `REQ-011`, `REQ-016`, `REQ-018`–`REQ-024`; `AC-001`–`AC-003`, `AC-007`, `AC-011`, `AC-013`–`AC-019`.
- Decision questions: Team versus Org authoring, explicit Handoff construction, one full-scope configuration-first Org launch, post-launch exact communication focus, root identity, and configured-versus-task runtime lineage.
- Critical journey: create/review a reusable Team; compose it into an Org; inspect and edit owned From/To/When handoffs; configure and launch the complete Org scope unfocused; focus an exact Agent or direct Team from the active sidebar when needed; read the root and temporary task lineage truthfully.
- Non-goals: recursive configured Teams, Org coordinator, implicit fallback, copied Team variants, backend architecture, or unrelated redesign.

## Product Story

- Actor: AutoByteus operator configuring and running reusable collaboration units.
- Goal: reuse independently testable Teams inside a wider Org without inventing an Org coordinator or conflating full-scope activation with later communication focus.
- Starting context: current Agent Teams surfaces and Workspace history/runtime language.
- Observable success: the operator can explain Team, Org, configuration precedence, full-scope activation, exact communication focus, root identity, and task lineage without assuming recursive configured membership.

## Screens And States

| Surface ID | Purpose | Important states and actions |
| --- | --- | --- |
| `UIS-AORG-001` | AgentTeam catalog/detail | Accepted baseline catalog language, Agent membership, coordinator, standalone run/history |
| `UIS-AORG-002` | AgentTeam create/edit | Source-native Agent Library drag/drop and click fallback; selectable canvas placements; editable Member Details; exactly one coordinator in a valid definition; no Team library |
| `UIS-AORG-003` | AgentOrg catalog/detail | Direct Agent and Team placements; referenced Team preservation; no coordinator |
| `UIS-AORG-004` | AgentOrg create/edit | Separate Agent and reusable-Team controls; functional Org-owned From/To/When handoffs |
| `UIS-AORG-005` | Org configuration and launch | One root configuration with Team/exact-Agent overrides; full scope activates unfocused |
| `UIS-AORG-006` | Shared runtime/history | Production-style Org/Team/Agent tree; later exact Agent or Team focus; temporary Task Agent/Task Team rows |

## Critical Journey

| Step | Screen / State | User action | Visible result | Decision evidence |
| --- | --- | --- | --- | --- |
| 1 | Team create | Drag or click an Agent into Team Canvas | Placement is added/selected, first Agent becomes coordinator, Member Details becomes editable | Future Team stays grounded in accepted product interaction |
| 2 | Team create/edit | Rename/select members and change coordinator | Canvas and Member Details agree; valid Team has exactly one coordinator | Direct Agent placements are precise and inspectable |
| 3 | Team catalog | Open reusable Team | Agents and one coordinator appear; prior standalone identity remains | Team is independent and reusable |
| 4 | Org authoring | Add Agent and Team references | Separate member columns; no Org coordinator control | Org and Team are distinct concepts |
| 5 | Org authoring | Add/edit/reorder a Handoff and When guidance | Explicit From, To, and ordered When update; invalid/stale endpoints block Save | Handoff meaning and ownership are truthful |
| 6 | Org configuration | Select runtime/model/workspace and optionally edit Team/exact-Agent overrides | One baseline-native configuration controls the complete mounted scope; no recipient selector appears | Configuration precedence is explicit and does not choose a recipient |
| 7 | Org launch | Run the valid configuration | Every configured placement becomes active; no Agent or Team is initially focused | Full-scope activation has no Org coordinator or fallback |
| 8 | Active Workspace | Select a direct Agent or direct Team from the production-style hierarchy | Exact Agent focus opens that Agent; Team focus enters through the Team's exact coordinator | Communication focus is explicit and post-launch |
| 9 | Runtime/history | Inspect Task Agent/Task Team rows and standalone Team definitions | Task rows remain under the owning execution; standalone Team roots remain separate | Task lineage is not configured nesting and standalone history remains distinct |

## Visual And Interaction Direction

- Preserve the accepted shell, left navigation, Workspace density, typography, and neutral product surfaces.
- Preserve the accepted AgentTeam toolbar, Featured/All sections, cards, initials, category, Agent chips, actions, spacing, and typography; preserve the Basics/library/canvas/member-details authoring hierarchy and the neutral detail-card hierarchy; change only semantics made obsolete by flat Teams.
- Use the accepted blue interaction language for Teams and Orgs, and source-current pale indigo `Task:` rows for temporary executions.
- Keep AgentOrg description and handoff records clean: no fabricated run summaries, aggregate Handoff/condition counts, repeated type badges, same-definition copy, or `Via coordinator` block. A Handoff reads simply as From, To, and When; top-to-bottom placement carries order without visible ordinal badges.
- Keep definition snapshots and runtime lineage visibly separate.
- Maintain real controls, disabled states, disclosure, selection, focus feedback, and narrow layout without horizontal overflow.
