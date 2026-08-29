# Token Statistics Final Prototype Assumptions

## Product Assumptions

| Assumption ID | Assumption | Why Needed | Product Decision Still Required |
| --- | --- | --- | --- |
| `PA-001` | RV-007 plus `DEC-009` is the complete intended final UI/UX direction. | Governing RER-009 says all behavior decisions are resolved. | None; actual runnable confirmation remains required. |
| `PA-002` | Existing analytics and Run-details data meanings remain authoritative. | The package is a focused UI/UX change and authorizes no backend/accounting change. | None. |
| `PA-003` | Representative fixture values are illustrative, while labels/state meanings/behaviors are normative. | A deterministic prototype needs stable review data without making the values product requirements. | None. |

## Mocked Boundaries

| Boundary / Integration | What Is Real In The Prototype | What Is Mocked Or Simplified | Deterministic Scenarios | Production Gap |
| --- | --- | --- | --- | --- |
| Browser UI | Real responsive Vue/Nuxt interface, tabs, controls, disclosures, tables, focus, localization, and visible states | None for reviewed UI behavior | All | None for UI specification; production implementation is separate. |
| Analytics query/state | One coherent result object and genuine client transitions | Local fixture/store instead of GraphQL/backend | `populated`, `token_*`, `loading`, `error` | Reuse current production query/store semantics; no contract change. |
| Token/cost/cache data | Exact field meanings and truth-state presentation | Synthetic counts, dates, prices, identities, and currencies | `SCN-001`–`SCN-007` | Production supplies authoritative records/aggregates. |
| Filtering/grouping | Real UI selection, Apply/Clear, context, regrouping, disclosure | Deterministic local projection | `SCN-003` | Production uses current approved query/filter path. |
| Run details | Real date validation, Task/Model selection, sorting, hierarchy, expansion, and cost presentation | Synthetic local run records and scripted query state | `SCN-005`, `loading`, `error`, `token_empty` | Production preserves existing creation-time/lifetime query semantics. |
| CSV/export | Complete absence in UI, accessibility tree, source utility, object URL/download, and requests | No mock replacement exists | `FPV-018` | Production removes the former local feature completely. |
| Runtime/platform | Real browser layout and interactions | No Electron process, native bridge, backend, credentials, or persistence | desktop/narrow/locale | Downstream production architecture is not prescribed. |

## Deliberate Simplifications And Non-Goals

| Simplification / Non-Goal ID | Simplification or Non-Goal | Why Safe For This Decision | Product Decision Still Required |
| --- | --- | --- | --- |
| `PS-001` | Use deterministic local fixtures instead of services. | Service mechanics are not visible or under review. | None. |
| `PS-002` | Use representative rows rather than production volume. | Exact hierarchy, overflow, disclosure, and sorting can be reviewed with stable fixtures. | None. |
| `PS-003` | Do not implement production persistence, telemetry, accounting, migration, security, or operations. | The prototype defines experience, not architecture/readiness. | None in Product Design. |
| `PS-004` | Do not provide CSV/export/report/share/download functionality. | This is an explicit final requirement, not merely a prototype simplification. | None. |
| `PS-005` | Do not redesign other Settings surfaces or navigation policy. | Prevents unrelated scope expansion and preserves accepted baseline parity. | None. |

## Production Readiness Gaps

- Security: No authentication/authorization/security mechanism is exercised or claimed.
- Persistence: All mutable prototype state is browser-local and resettable.
- Integrations: No GraphQL/backend/pricing service/Electron/native integration is present.
- Performance / scalability: Representative UI density is validated; production data volume and network performance are not.
- Reliability / recovery: User-facing loading/error/retry states are real; failure mechanics are scripted.
- Observability / operations: No production telemetry, logs, deployment, or operational controls are included.
- Other: The prototype is evidence that the experience is achievable with the current visible data contract, not proof of production implementation readiness or architecture.
