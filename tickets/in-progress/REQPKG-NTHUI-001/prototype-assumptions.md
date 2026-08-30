# Prototype Assumptions

## Product Assumptions

| Assumption ID | Assumption | Why Needed | Product Decision Still Required |
| --- | --- | --- | --- |
| PA-NTH-001 | The accepted Workspace shell and current history interactions remain the product authority outside the focused hierarchy treatment. | Direct user correction requires incremental baseline evolution. | None unless the user expands scope. |
| PA-NTH-002 | The starting Hybrid/Responsive/Header selections are a neutral review starting point, not a recommendation. | A deterministic review URL needs initial values. | `DEC-001`–`DEC-003`. |
| PA-NTH-003 | One representative deep fixture is sufficient to compare visual grammar when its content is identical across alternatives. | Prevents fixture differences from biasing the review. | User may request a second edge case within scope. |

## Mocked Boundaries

| Boundary / Integration | What Is Real In The Prototype | What Is Mocked Or Simplified | Deterministic Scenarios | Production Gap |
| --- | --- | --- | --- | --- |
| Workspace product UI | Real accepted Nuxt route, shell, layout, components, tokens, width policy, font-size store, disclosure and selection code | Backend operations remain blocked/synthetic | PS-NTH-001–006 | No production data or services |
| Run history data | Real product read model and component contracts | Topology, statuses, ages, messages, and prior run are in-memory fixtures | `workspace_team_hierarchy_review` | No live persistence or hydration |
| Team/member focus | Real selection/focus path over prototype Pinia stores | Agent conversations are short synthetic projections | PS-NTH-006 | No production stream/runtime |
| Quiet refresh | Real interval and local expansion ownership | Refresh action is a scripted no-op | TR-NTH-008 | No remote topology update |
| Review controls | Real query/state interaction and actual width/font setters | Controls are explicitly review-only and not proposed product UI | All | Must be removed from final product implementation |

## Deliberate Simplifications And Non-Goals

| Simplification / Non-Goal ID | Simplification or Non-Goal | Why Safe For This Decision | Product Decision Still Required |
| --- | --- | --- | --- |
| PS-NTH-NG-001 | No backend/topology/status/persistence change | Decisions concern presentation and interaction grammar | None |
| PS-NTH-NG-002 | No Team definition editor, overview panel, mobile shell, or global navigation redesign | Those surfaces do not affect left-history hierarchy choice | None |
| PS-NTH-NG-003 | Review captures are non-normative | User has not approved a direction | Explicit approval after `DEC-001`–`003` |
| PS-NTH-NG-004 | No final `ui-ux-spec.md` or final `VIS-*` references | The mode skill requires explicit user confirmation first | Approve a direction or request a focused revision |

## Production Readiness Gaps

- Security: No production authentication or authorization exercised.
- Persistence: Review choices and fixture data are local/query-driven; no server persistence.
- Integrations: External requests and production WebSockets are blocked.
- Performance / scalability: Representative depth only; no large-tree performance claim.
- Reliability / recovery: No production network recovery claim.
- Observability / operations: No production telemetry.
- Other: Review controls and synthetic scenario are prototype-only; UI details remain non-authoritative until user confirmation.
