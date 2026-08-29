# Token Statistics Final UI Behavior Test Matrix

Validation base URL: `http://127.0.0.1:3261`. Durable machine evidence:
`validation/final-prototype/browser-validation.json`.

| Transition / Scenario ID | Related Requirement / AC IDs | Screen / Flow | Trigger | From State | To State | Expected Visible Feedback | Service Scenario | Result / Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `FPV-001` | `REQ-002`, `REQ-016`; `AC-001`, `AC-016` | Analytics summary | Open populated desktop | Initial Analytics | Six-peer result | Approved labels/order; six widths equal; Total emphasized without extra width | `populated` | **Pass** — all six `185.5px` |
| `FPV-002` | `REQ-003`–`REQ-006`, `REQ-012`; `AC-001`–`AC-005` | Analytics hierarchy | Inspect DOM/body/accessibility text | Populated Analytics | Clean hierarchy | No comparison, contributor, driver, ratio, or export presentation | `token_partial` | **Pass** |
| `FPV-003` | `REQ-005`, `REQ-015`; `AC-004`, `AC-015` | Trend | Open monthly Tokens | Daily result | Open-top line | 29 markers, 1 series, 1 midpoint guide, 5 ticks, left/bottom axes only | `populated` | **Pass** |
| `FPV-004` | `REQ-005`, `REQ-011`, `REQ-015`; `AC-004`, `AC-010`, `AC-015` | Trend accessibility | Focus chart | Visual line | Exact text equivalent | Accessible name contains all 29 daily buckets | `populated` | **Pass** — 629-char label |
| `FPV-005` | `REQ-006`, `REQ-016`; `AC-006`, `AC-016` | Summary/detail | Inspect uncached help and open exact row | Summary | Exact accounting | Precise uncached definition; cache write remains separately visible | `populated` | **Pass** |
| `FPV-006` | `REQ-005`, `REQ-012`, `REQ-015`; `AC-004`, `AC-011`, `AC-015` | Trend metric | Activate Cost | Tokens line | Cost line | Same chart uses `Cost (USD)` and authoritative cost values | `populated` | **Pass** |
| `FPV-007` | `REQ-003`, `REQ-012`; `AC-002`, `AC-011` | Filter panel | Open, choose runtime/provider/model, Apply | All usage | Filtered result | Count/context update; exactly one coherent result row | `populated` | **Pass** |
| `FPV-008` | `REQ-006`, `REQ-012`; `AC-005`, `AC-006` | Detailed usage | Change grouping and open row | Runtime + model | Provider / expanded | Visible section/grouping and exact token/cost components | `populated` | **Pass** |
| `FPV-009` | `REQ-009`, `REQ-014`; `AC-002`, `AC-013` | Settings shell | Keyboard resize navigation | 256px navigation | 240px navigation | Width changes only through manual control | `populated` | **Pass** |
| `FPV-010` | `REQ-013`; `AC-012` | Run details | Open tab | Analytics | Run details | Creation-time selection and lifetime-total helper remain explicit | `populated` | **Pass** |
| `FPV-011` | `REQ-013`; `AC-012` | Run details Task | Fetch/sort/expand Team | Task rows | Expanded hierarchy | Task hierarchy, lifetime values, sorting, expansion, cost disclosure operate | `populated` | **Pass** |
| `FPV-012` | `REQ-013`; `AC-012` | Run details Model | Activate Model | Task grouping | Model table | Model evidence appears with no unsupported Runs count | `populated` | **Pass** |
| `FPV-013` | `REQ-010`, `REQ-016`; `AC-009`, `AC-016` | Cache state | Load five cache fixtures | Various | Truthful cache card | `13.9%`, `0%`, `Not reported`, `Not supported`, `Unknown` as authoritative | cache matrix | **Pass** |
| `FPV-014` | `REQ-010`–`REQ-012`; `AC-009`–`AC-011` | Analytics states | Load state matrix | Query state | Intentional result/state | Loading, error, empty, uncovered, mixed, and local remain truthful | state matrix | **Pass** |
| `FPV-015` | `REQ-009`, `REQ-015`; `AC-002`, `AC-005`, `AC-015` | Narrow Analytics | Set 390×844 | Desktop | Narrow | No page overflow; equal two-peer summary; readable axes; three ticks | `token_partial` | **Pass** — document width 390px |
| `FPV-016` | `REQ-007`, `REQ-008`, `REQ-011`; `AC-007`, `AC-008`, `AC-010` | Localization | Switch locale | English | Simplified Chinese | Final hierarchy and controls remain localized and usable | `populated`, zh-CN | **Pass** |
| `FPV-017` | `REQ-003`, `REQ-011`; `AC-002`, `AC-010` | Keyboard focus | Close disclosure with keyboard | Filters open | Filters closed | Focus returns to named `Filters` trigger | `populated` | **Pass** |
| `FPV-018` | `REQ-003`, `REQ-012`; `AC-001`, `AC-002`, `AC-010`, `AC-011` | Negative export boundary | Inspect DOM/a11y/client/files/requests | Any Analytics state | No export capability | No Export CSV name/action, object URL, download click, utility file, or request | all relevant states | **Pass** |
| `FPV-019` | All | Full browser matrix | Complete journey suite | Initial | Terminal evidence | No unexpected browser errors | all above | **Pass** |

## Scenario Catalog

| Scenario ID | Purpose | Inputs / Setup | Mocked Boundary Behavior | Expected Product Outcome | Selection Method |
| --- | --- | --- | --- | --- | --- |
| `SCN-001` / `token_partial` | Populated partial-coverage primary review | Monthly synthetic usage | Local coherent result | Current usage dominates; partial truth remains proportionate | localStorage scenario key |
| `SCN-002` / `populated` | Full/comparable contract with no visible comparison | Monthly complete fixture | Returned comparison may exist but is not rendered | Tokens/Cost and cache composition stay coherent | localStorage scenario key |
| `SCN-003` / `populated` | Filtering/grouping/exact disclosure | Multiple runtime/provider/model rows | Local deterministic projection | Exact contextual on-page evidence | UI controls |
| `SCN-004` | Constrained layout | 390×844 or manual nav resize | Browser-only viewport/state | No page overflow or blocked action | viewport / shell control |
| `SCN-005` / `populated` | Run details | Task/Team/Model rows | Local deterministic lifetime fixtures | Preserved run semantics in unified presentation | Run details tab |
| `SCN-006` | Result-state truth | `loading`, `error`, `token_empty`, `token_unavailable`, `token_mixed_currency`, `token_local` | Local scripted state | Calm truthful state/recovery | localStorage scenario key |
| `SCN-007` | Cache truth | `populated`, `token_cache_zero`, `token_cache_not_reported`, `token_local`, `token_cache_unknown` | Local authoritative fixture states | No false cache percentage | localStorage scenario key |

## Unresolved Behavior

| Requirement / Decision ID | Missing Or Ambiguous Behavior | Prototype Limitation | Required Product Decision |
| --- | --- | --- | --- |
| None | `DEC-001`–`DEC-009` are resolved | Final actual-runnable confirmation is a process gate, not a behavior ambiguity | User confirms or requests focused corrections |
