# Experience Story

## Prototype Scope

- Prototype request: one coherent product UI model for flat reusable AgentTeams and coordinator-free AgentOrgs.
- Related IDs: `BEH-001`, `BEH-004`, `BEH-006`; `REQ-001`–`REQ-004`, `REQ-011`, `REQ-016`, `REQ-018`, `REQ-019`; `AC-001`, `AC-002`, `AC-007`, `AC-011`, `AC-013`, `AC-014`; `SCN-001`, `SCN-002`, `SCN-006`, `SCN-007`.
- Decision questions: Team versus Org authoring, exact Org entry, root identity, and configured-versus-task runtime lineage.
- Critical journey: create/review a reusable Team; compose it into an Org; launch the Org through one exact entry; read the root and temporary task lineage truthfully.
- Non-goals: recursive configured Teams, Org coordinator, implicit fallback, copied Team variants, backend architecture, or unrelated redesign.

## Product Story

- Actor: AutoByteus operator configuring and running reusable collaboration units.
- Goal: reuse independently testable Teams inside a wider Org without obscuring who coordinates or where execution begins.
- Starting context: current Agent Teams surfaces and Workspace history/runtime language.
- Observable success: the operator can explain Team, Org, entry, root, and task lineage from the UI without assuming recursive configured membership.

## Screens And States

| Surface ID | Purpose | Important states and actions |
| --- | --- | --- |
| `UIS-AORG-001` | AgentTeam catalog/detail | Reusable Team identity, Agent membership, coordinator, standalone run/history |
| `UIS-AORG-002` | AgentTeam create/edit | Agent-only members; one checked coordinator radio; no Team selector |
| `UIS-AORG-003` | AgentOrg catalog/detail | Direct Agent and Team placements; referenced Team preservation; no coordinator |
| `UIS-AORG-004` | AgentOrg create/edit | Separate Agent and reusable-Team controls; Org-scoped handoffs |
| `UIS-AORG-005` | Org launch | No selection/disabled; exact Agent; exact Team through coordinator |
| `UIS-AORG-006` | Shared runtime/history | Typed Org/Team roots; configured snapshot; temporary Task Agent/Task Team rows |

## Critical Journey

| Step | Screen / State | User action | Visible result | Decision evidence |
| --- | --- | --- | --- | --- |
| 1 | Team catalog | Open reusable Team | Agents and one coordinator appear; prior standalone identity remains | Team is independent and reusable |
| 2 | Org authoring | Add Agent and Team references | Separate member columns; no Org coordinator control | Org and Team are distinct concepts |
| 3 | Org launch | Open launch then select Team | Start changes from disabled to enabled; selected Team coordinator is named | No implicit entry or fallback |
| 4 | Runtime | Inspect root and configured scope | `Agent Org run` badge and Team placements are explicit | Root subject is truthful |
| 5 | Runtime/history | Expand Task Team and select child | Temporary indigo `Task:` row reveals child; focused execution explains runtime-only identity | Task lineage is not configured nesting |
| 6 | Runtime/history | Select standalone Team root | `Standalone Agent Team run` and coordinator-led lifecycle appear | Standalone history remains distinct |

## Visual And Interaction Direction

- Preserve the accepted shell, left navigation, Workspace density, typography, and neutral product surfaces.
- Use blue for reusable Teams, violet for Orgs, and source-current pale indigo `Task:` rows for temporary executions.
- Keep definition snapshots and runtime lineage visibly separate.
- Maintain real controls, disabled states, disclosure, selection, focus feedback, and narrow layout without horizontal overflow.
