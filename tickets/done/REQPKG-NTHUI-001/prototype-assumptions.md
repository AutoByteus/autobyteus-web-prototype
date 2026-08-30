# Prototype Assumptions

## Product Assumptions

| Assumption ID | Assumption | Why Needed | Status |
| --- | --- | --- | --- |
| `PA-NTH-001` | The accepted Workspace shell and current history interactions remain authoritative outside the focused hierarchy treatment. | The request is an incremental product evolution. | Validated and preserved |
| `PA-NTH-002` | The approved direction is printed file-tree rails, Responsive metadata, and the filled User group symbol. | Provides one deterministic product-facing result. | User approved 2026-08-30 |
| `PA-NTH-003` | Representative synthetic topology is sufficient to specify the hierarchy grammar; real names, statuses, ages, addresses, and node counts vary. | Separates product behavior from fixture content. | Explicitly illustrative in `ui-ux-spec.md` |

## Mocked Boundaries

| Boundary | Real In Prototype | Mocked / Simplified | Production Gap |
| --- | --- | --- | --- |
| Workspace product UI | Accepted Nuxt route, shell, layout, components, tokens, width policy, font-size store, disclosure, selection | Backend operations blocked/synthetic | No production services or credentials |
| Run history | Existing read model and component contracts | Topology, statuses, ages, summaries, and conversations are in-memory fixtures | Production data/hydration not exercised |
| Selection/focus | Real prototype selection and keyboard paths | Short synthetic conversations | No production runtime/stream |
| Quiet refresh | Real local expansion ownership and time passage | Scripted no-op data refresh | No remote topology update |
| Review scenario | Actual width/font behavior and clean product route | Query/localStorage fixture selection | Review query and fixtures must not ship as product UI |

## Deliberate Simplifications And Non-Goals

- No backend, topology, status, persistence, lifecycle, or contract change.
- No Team definition editor, Team overview, mobile shell, global navigation, full-page org chart, or drag/drop change.
- No production authentication, authorization, external integrations, telemetry, or network recovery claim.
- No performance claim for extremely large trees; the validated fixture covers the decision-relevant depth and sibling density.

## Production Readiness Boundary

The approved package is production-quality UI/UX evidence, not a production implementation. The prototype's stores, query controls, fixtures, blocked network, and capture scripts do not prescribe architecture. Requirements Engineering must reconcile canonical requirements; Software Engineering must design and implement the production change.
