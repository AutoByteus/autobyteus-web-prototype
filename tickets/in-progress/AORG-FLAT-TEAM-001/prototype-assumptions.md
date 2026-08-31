# Prototype Assumptions

## Product Assumptions

| ID | Assumption | Why needed | Decision still required |
| --- | --- | --- | --- |
| `PA-AORG-001` | Team and Org fixture names illustrate the approved semantics | Review needs credible content | Names and counts are not production requirements |
| `PA-AORG-002` | Blue Team and violet Org identifiers extend the accepted neutral shell without redesigning it | Root subjects need rapid recognition | User approval of this visual treatment |
| `PA-AORG-003` | Source-current pale-indigo `Task:` rows are retained for Task Agent/Task Team execution identity | Baseline correction established this hierarchy | User approval of their placement inside the future Org runtime |

## Mocked Boundaries

| Boundary | Real in prototype | Mocked/simplified | Production gap |
| --- | --- | --- | --- |
| Catalog and authoring | Navigation, forms, controls, selection, save feedback | In-memory fixtures | Persistence, validation service, permissions |
| Launch | Required radio selection, disabled/enabled action, exact result URL | Synthetic start | Run service and orchestration |
| Runtime/history | Root selection, task disclosure, child focus, visible hierarchy | Deterministic runs and timestamps | Streams, restore, storage, stop lifecycle |
| Handoffs | Scope and labels | Illustrative rows | Address resolver and delivery |

## Deliberate Non-Goals

Recursive configured Teams/Orgs, Org coordinator, implicit launch fallback,
Org-specific Team copies, cross-run semantics, migration mechanics, backend
contracts, security, persistence, scalability, and operations are excluded.
