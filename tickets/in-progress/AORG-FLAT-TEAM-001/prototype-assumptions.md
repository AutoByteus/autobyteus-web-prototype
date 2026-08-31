# Prototype Assumptions

## Product Assumptions

| ID | Assumption | Review boundary |
| --- | --- | --- |
| `PA-AORG-001` | Fixture names and natural-language When text illustrate the approved endpoint/condition semantics | Exact fixture content is not a production requirement |
| `PA-AORG-002` | AgentOrg uses the same neutral/blue product language as Agent Teams | No new purple Org sub-brand is proposed |
| `PA-AORG-003` | Source-current pale-indigo Task rows remain the accepted runtime identity pattern | User approval of their placement inside the future Org runtime is pending |
| `PA-AORG-004` | Team coordinator inspection through the adjacent Team member card and Team detail is sufficient; the Handoff card need not repeat `Via coordinator` | This implements the user's explicit clean-UI correction while preserving inspectability |
| `PA-AORG-005` | The accepted Team builder is preserved as interaction authority; the future flat-Team change removes only Team library items and Team member placements | User approval of the resulting precise Agent-only evolution remains pending |
| `PA-AORG-006` | AgentOrg launch reuses the accepted Agent/Team run-configuration and Workspace surfaces rather than introducing an Org-specific runtime | The selected entry, Org/standalone-Team distinction, and placement of task lineage are the future-state proposal; runtime services remain mocked |

## Mocked Boundaries

| Boundary | Real in prototype | Mocked/simplified | Production gap |
| --- | --- | --- | --- |
| Catalog and authoring | Navigation, fields, endpoint eligibility, CRUD, reorder, validation, cancel/save feedback | In-memory fixtures | API, persistence, permissions, concurrency |
| Referential integrity | Unavailable endpoints and blocked save | Client-local definition state | Server transaction and migration |
| Launch | Exact selection and accepted configuration-first navigation | Synthetic start | Run service and orchestration |
| Runtime/history | Accepted Agent/Team Workspace, root selection, Files tree, task disclosure, child focus | Deterministic runs/timestamps | Streams, restore, storage, stop lifecycle |

## Deliberate Non-Goals

Recursive configured Teams/Orgs, Org coordinator, implicit launch fallback,
Org-specific Team copies, cross-run semantics, backend contracts, security,
persistence, scalability, and operations are excluded.
