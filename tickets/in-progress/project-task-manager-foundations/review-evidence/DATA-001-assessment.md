# DATA-001 provenance assessment — correction held

Date: 2026-10-02. Package/ticket context: `project-task-manager-baseline-correction` / `DATA-001` (no separate stable package identifier supplied).

- Prototype root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`
- Assigned worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/project-task-manager-baseline-correction`
- Branch: `prototype/project-task-manager-baseline-correction`
- Accepted base supplied: `df2f5cdaf9b168298dcae79ac47c11f31dd82d7c`; inspected worktree HEAD: `dc4a55300d43e0f6860a3270827f39bc4d18461f`.
- Unchanged source authority: `e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71`, as recorded in the established `prototype-bootstrap-report.md`. This is not a refresh.

## Findings

1. **These files capture UI state, not raw API responses.** `dump-source-state.mjs` serializes `pinia.state.value` after visiting the source routes; it also records store metadata, body text, routes and diagnostics. `build-runtime-fixtures.mjs` retains the state and route/context fields for runtime hydration. All 66 current runtime states exactly equal their corresponding captured states.
2. **The inspected provenance supports synthetic inputs, not copied production records.** The report names a source export backed only by the local synthetic observation node. `mock-node.mjs` constructs responses from `fixtures.mjs` and schema defaults, rather than reading a production database or recorded-response archive. Representative agent, workspace, project-task, history and analytics values trace to that fixture code (`agent-researcher`, `/synthetic/prototype-workspace`, `task-outline`, synthetic pricing identifiers). One built-in Daily Assistant identity is explicitly source-aligned; that is not evidence of a production-data export.
3. **File size alone does not establish real-data copying.** Capture: 4,412,557 bytes; runtime: 2,686,667 bytes. The runtime repeats 1,507 store states across 66 route/scenario snapshots, with only 168 distinct per-store values. Deduplicated minified store values total about 259 KB; minified whole runtime is about 1.43 MB. Much of the bulk is duplication, formatting and diagnostic/derived state; node timestamps alone produce 66 distinct node-store values.
4. **A separate simplification concern remains.** Runtime fixtures are generated from observed synthetic source UI state, not directly hand-authored prototype state. The snapshot hydration mechanism is large and coupled to source store shapes. That can justify a lightweight-state refactor under the small-fixture/prototype-native-state principles, but should not be described as substantiated replay of real production data or API responses. This read-only audit does not independently prove every historical input was synthetic or revalidate UI parity.

## Work performed and disposition

Correction implementation is held as requested. No runtime, fixture, presentation, established report, source, inventory, branch, commit or integration changes were made. No servers were started. The worktree was clean before this audit. The only new file is this assessment. No corrected candidate or new baseline acceptance is claimed. Product Prototyper should reassess DATA-001's classification before authorizing any implementation.

Evidence inspected (relative to assigned worktree): `prototype-bootstrap-report.md`, `prototype/scripts/dump-source-state.mjs`, `prototype/scripts/build-runtime-fixtures.mjs`, `prototype/source-observation/{fixtures,mock-node,schema-filler}.mjs`, `prototype/shared/token-{usage,statistics-refresh}-fixture.js`, `prototype/fixtures/{runtime-state,source-state-snapshots}.json`, and `plugins/00.prototype-state.client.ts`.
