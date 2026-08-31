# Prototype Bootstrap Report

This report records a focused current-experience refresh. It substantiates the
observable **Settings > Token Statistics** experience only; it does not prove a
production integration and it does not replace canonical requirements or a
Product-owned `ui-ux-spec.md`.

## Status

- Status: `Completed`
- Request type: `Refresh`
- Stable package / Product ticket: `REQPKG-TSUI-001`
- Result: the selected Token Statistics surface is independently runnable and
  every recorded distinct item has matched source-versus-prototype evidence.
- Next expected action: Product Prototyper should inspect the working-tree
  candidate and evidence, run acceptance checks, and create the accepted
  prototype commit before any future-state visualization work.

## Source Identity

- Source project: AutoByteus workspace repository
  `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements`
- Selected frontend application or product surface:
  `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/autobyteus-web`,
  limited to **Settings > Token Statistics**
- Source root:
  `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements`
- Governing branch or revision authority: `origin/personal`, explicitly selected
  by Product Prototyper
- Pinned source commit: `9d0fd7c570d58da1af2c7a40279327c8a20a8093`
- Explicit exclusion: Requirements commit
  `1b5c401e8c2ed7af7630a840e7294541cbf7ad6f` was **not** used as
  current-experience authority.
- Applicable repository instructions: selected frontend `AGENTS.md`; source was
  read-only and no release or repository-management operation was performed.
- Source observation: exact `git archive` of the pinned commit at
  `/tmp/autobyteus-web-source-9d0fd7c.WBhmLX`, served at
  `http://127.0.0.1:4261` against the loopback synthetic observer at
  `http://127.0.0.1:4361`. The archive's automatic Electron module load was
  disabled and a temporary Nuxt dev-handler compatibility line was removed in
  the disposable export so the unchanged browser presentation could run. No
  source presentation file used for parity was edited.
- Representative source start command:

  ```bash
  BACKEND_NODE_BASE_URL=http://127.0.0.1:4361 \
  ENABLE_APPLICATIONS=true \
  corepack pnpm exec nuxt dev --host 127.0.0.1 --port 4261
  ```

## Prototype Identity

- Prototype repository/root (separate Git repository):
  `/home/autobyteus/workspace/autobyteus-web-prototype`
- Product ticket: `REQPKG-TSUI-001`
- Product ticket branch: `prototype/reqpkg-tsui-001`
- Product-owned target worktree:
  `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001`
- Accepted prototype base revision:
  `0e43f9d6e638c67f0f82bb1a5d7c7cd2fd930fd9`
- Bootstrap candidate revision or commit: uncommitted working-tree candidate at
  the accepted base; no commit was created because Product Prototyper owns the
  accepted prototype commit.
- Install command: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start command: `corepack pnpm dev --port 3210`
- Review URL: `http://127.0.0.1:3210/settings?section=token-usage`
- Framework, language, and styling: Nuxt 3, Vue 3, TypeScript, Pinia, Tailwind,
  Chart.js, and the pinned source presentation conventions.
- Scenario selection:
  `localStorage.setItem('autobyteus.prototype.scenario', '<scenario>'); location.reload()`
- Reset:
  `localStorage.removeItem('autobyteus.prototype.scenario'); location.reload()`

## Refresh Reconciliation

The accepted base's other routes, historical scenarios, correction evidence,
and approved experience files were preserved. The refresh added only the
newer Token Statistics presentation and its minimum browser-local support:
Analytics and Run details tabs, analytics subcomponents, current localization,
presentation utilities, prototype-native stores, deterministic fixtures,
source-observer query fixtures, proportional tests, and matched evidence. No
future requirement or redesign from the Requirements commit was introduced.

## Experience Boundary

- Included UI boundary: the `Token Statistics` section selected from Settings.
- Destinations/surfaces: the default `Analytics` tab and `Run details` tab.
- Interaction/feedback patterns: range presets, custom date validation/apply,
  filters/clear, token-versus-cost metric, composition grouping, CSV export,
  retry, run-range fetch, task/model grouping, sorting, Team expansion, and cost
  detail disclosure.
- Visible-state patterns: loading, full populated, covered empty, partial
  coverage/pricing, unavailable coverage, mixed currency, local/no-API-bill,
  and retryable error.
- Material contexts: English desktop (`1440x900`), English narrow (`390x844`),
  and Simplified Chinese desktop; UTC, light theme, reduced motion, local assets.
- Equivalent contexts: fixture values are shared across source and prototype;
  operations with the same rendered terminal state share the same scenario.
- Excluded: every Settings section other than Token Statistics, unrelated
  product routes, production persistence/protocols/Electron/runtime behavior,
  and future-state requirements or design. Those surfaces were not affected by
  the selected refresh.

## UI Experience Inventory

All evidence references are relative to the durable evidence root
`/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/evidence/token-statistics-refresh`.
The machine result record resolves every cited visual ID to its exact source and
prototype screenshots, DOM/geometry/style capture, action result, and diff.

| ID | Route / Surface | Exact Visual And UI-Controlled Content Obligations | States / Operations / Outcomes | Contexts | Scenario | Evidence | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UXB-TS-001 | Analytics | Tabs, heading, description, presets, range, filters, metric/grouping controls, summary metrics, charts, table, status announcement | Default full-coverage comparable result | Desktop + narrow | `populated` | UXV-TS-001/002 | **Pass** |
| UXB-TS-002 | Analytics | Covered-range empty copy and retained controls | No tracked usage | Desktop | `token_empty` | UXV-TS-003 | **Pass** |
| UXB-TS-003 | Analytics | Partial-coverage notice, missing-price disclosure, non-comparable prior period | Partial usage/pricing | Desktop | `token_partial` | UXV-TS-004 | **Pass** |
| UXB-TS-004 | Analytics | Unavailable coverage notice and no-data result | Range predates coverage | Desktop | `token_unavailable` | UXV-TS-005 | **Pass** |
| UXB-TS-005 | Analytics | Alert copy and Retry control | Error; retry remains recoverable | Desktop | `error` | UXV-TS-006/022 | **Pass** |
| UXB-TS-006 | Analytics | Source skeleton geometry and busy semantics | Loading | Desktop | `loading` | UXV-TS-007 | **Pass** |
| UXB-TS-007 | Analytics cost | Currency-quality notices and cost rendering | Mixed currency; local/no API bill | Desktop | `token_mixed_currency`, `token_local` | UXV-TS-008/026 | **Pass** |
| UXB-TS-008 | Analytics custom range | Date inputs, inline alert, disabled/applicable action | Invalid validation; valid apply | Desktop | `populated` | UXV-TS-009/021 | **Pass** |
| UXB-TS-009 | Analytics filters | Active-filter summary, reduced metrics/rows, clear control | Filter and restore | Desktop | `populated` | UXV-TS-010/020 | **Pass** |
| UXB-TS-010 | Run details | Date range, grouping, Fetch Statistics, task table | Default and narrow | Desktop + narrow | `populated` | UXV-TS-011/018 | **Pass** |
| UXB-TS-011 | Run details task table | Task/run headings, values, sortable header, stable row ordering | Sort; Team row | Desktop | `populated` | UXV-TS-012/023 | **Pass** |
| UXB-TS-012 | Run details task table | Cost disclosure labels and breakdown values | Show Team cost details | Desktop | `populated` | UXV-TS-013 | **Pass** |
| UXB-TS-013 | Run details model table | Model grouping selector and runtime/model rows | Switch grouping | Desktop | `populated` | UXV-TS-014 | **Pass** |
| UXB-TS-014 | Run details | Explicit no-statistics message | Covered empty result | Desktop | `token_empty` | UXV-TS-015 | **Pass** |
| UXB-TS-015 | Run details | Alert and retry feedback | Retryable fetch error | Desktop | `error` | UXV-TS-016 | **Pass** |
| UXB-TS-016 | Analytics | All source-owned labels, dates, messages, controls, table headings in zh-CN | Localized full result | Desktop zh-CN | `populated` | UXV-TS-017 | **Pass** |
| UXB-TS-017 | Analytics range presets | Selected control and recalculated visible range | Last month; custom apply | Desktop | `populated` | UXV-TS-019/021 | **Pass** |
| UXB-TS-018 | Analytics export | Export control and exact suggested CSV filename | Browser download | Desktop | `populated` | UXV-TS-024 | **Pass** |
| UXB-TS-019 | Run details range | Edited dates and Fetch Statistics transition | Manual date fetch | Desktop | `populated` | UXV-TS-025 | **Pass** |

## Journey Inventory

| Journey ID | Starting Scenario | Source And Prototype Steps / Visible Outcome | Recovery / Alternate Path | Evidence | Result |
| --- | --- | --- | --- | --- | --- |
| UXJ-TS-001 | `populated` | Open Settings query; Token Statistics appears with Analytics selected and full populated result | Narrow layout retains the same controls/content | UXV-TS-001/002 | **Pass** |
| UXJ-TS-002 | `populated` | Select Last month or Custom, edit dates, apply, and see the selected range/result refresh | Invalid end-before-start displays exact inline alert | UXV-TS-009/019/021 | **Pass** |
| UXJ-TS-003 | `populated` | Select runtime filter; metrics/table reduce to matching usage; Clear filters restores all tracked usage | N/A | UXV-TS-010/020 | **Pass** |
| UXJ-TS-004 | cost-quality scenarios | Select Estimated cost; mixed-currency and local-only fixtures render their distinct quality guidance | Token metric remains available | UXV-TS-008/026 | **Pass** |
| UXJ-TS-005 | `populated` | Activate Export CSV; browser receives `token-usage-analytics_2026-08-01_2026-08-29.csv` | N/A | UXV-TS-024 action result | **Pass** |
| UXJ-TS-006 | `populated` | Select Run details; fetch dates; switch task/model grouping and see corresponding rows | Empty and error terminal states | UXV-TS-011/014/015/016/025 | **Pass** |
| UXJ-TS-007 | `populated` | Sort Task / Run, expand Team members, disclose Team cost details | Collapse/disclosure controls remain reversible | UXV-TS-012/013/023 | **Pass** |
| UXJ-TS-008 | `error` | See retryable alert; activate Retry; recoverable error remains correctly rendered under deterministic fixture | Normal scenario reset restores populated state | UXV-TS-006/022 | **Pass** |
| UXJ-TS-009 | `populated` | Repeat primary surfaces at 390x844 and analytics in zh-CN | N/A | UXV-TS-002/017/018 | **Pass** |

## Exact Visual Fidelity Comparison

Every row used Chromium at the stated viewport, UTC, light theme, reduced
motion, identical locale/scenario/fixture values, local Iconify assets, and
blocked non-loopback requests. Source and prototype body text, semantic state,
geometry, and source-owned behavior are exact. Thirteen screenshots are byte
exact; other pixels differ only by normalized canvas/subpixel raster noise
(`changedPixelRatio <= 0.000104`, maximum channel delta `<= 4`), with no known
human-perceptible difference.

| Visual IDs | Surface / State / Context | Source Screenshot | Prototype Screenshot | Method | Remaining Difference | Result |
| --- | --- | --- | --- | --- | --- | --- |
| UXV-TS-001–008 | Analytics populated desktop/narrow, empty, partial, unavailable, error, loading, mixed cost | `source/UXV-TS-*.png` | `prototype/UXV-TS-*.png` | DOM text, semantics, geometry/style, screenshot hash/perceptual diff, browser errors | None | **Pass** |
| UXV-TS-009–010 | Custom validation; filtered result | same ID prefix | same ID prefix | Interaction terminal state + matched capture | None | **Pass** |
| UXV-TS-011–016 | Run task, expanded Team, cost disclosure, model grouping, empty, error | same ID prefix | same ID prefix | Interaction terminal state + matched capture | None | **Pass** |
| UXV-TS-017–018 | zh-CN Analytics; narrow Run details | same ID prefix | same ID prefix | Locale/responsive DOM and screenshot comparison | None | **Pass** |
| UXV-TS-019–025 | Last month, clear, valid custom, retry, sort, CSV, run date fetch | same ID prefix | same ID prefix | Interaction/result/DOM and screenshot comparison | None | **Pass** |
| UXV-TS-026 | Local-only cost evidence | same ID prefix | same ID prefix | Cost-metric terminal state + matched capture | None | **Pass** |

The complete one-row-per-visual record is
`machine/token-statistics-refresh-results.json`; summary is
`machine/token-statistics-refresh-summary.json`. Direct Browser Tool evidence
for Analytics to Run details to expanded-Team interaction is
`machine/browser-tool-run-details.json`.

## Implementation Simplifications

| Production Capability Visible In The UI | Visible Experience Preserved | Prototype Simulation | Production Mechanism Absent |
| --- | --- | --- | --- |
| Analytics fetch/range/filter/retry | Loading, success, coverage, quality, error, filtering, ranges | Prototype-native Pinia store + deterministic result builder | GraphQL client, backend, persistence |
| Run statistics fetch/group/sort | Task/model tables, hierarchy, date fetch, retry | Prototype-native Pinia store + synthetic task/model rows | Production query client and run history |
| Cost/pricing state | Exact values, disclosures, mixed/local/partial semantics | Fixed synthetic aggregates and cost-quality fixtures | Billing/pricing service and customer usage |
| CSV export | Exact control, filename, and generated download | Source presentation utility over synthetic rows | Server export/storage |
| Charts | Exact source chart components and terminal rendering | Chart.js over deterministic buckets | Analytics warehouse |
| Localization/responsive UI | Exact source English/zh-CN strings and layouts | Reused source localization/presentation | Production runtime contexts |

- Presentation reused: 18/18 selected source-pin Vue, presentation utility,
  CSV, and localization files are SHA-256 exact; see
  `machine/presentation-source-hash-audit.json`.
- UI code recreated: none for the selected source presentation; only minimal
  prototype store/type/fixture adapters were added.
- Prototype state: two small Pinia stores with browser-local, resettable state.
- Synthetic data: fixed analytics aggregates/buckets/options plus task/model/Team
  rows; no customer or production data.
- Scripted async behavior: deterministic loading delay and recoverable error.
- Host simulation: ordinary browser only; Electron and backend contexts are not
  needed for this surface.
- Retained production store/client/protocol/runtime: none.

## Validation

- Browser: Playwright-controlled system Chromium
  `/usr/bin/chromium`; direct Browser Tool validation also completed.
- Viewports: `1440x900` and `390x844`.
- Source method: read-only exact pin archive, controlled loopback mock, and
  matched source dev server.
- Prototype dev evidence URL: `http://127.0.0.1:3261` during comparison; the
  ordinary documented review port is `3210`.
- Clean documented install completed and the documented `3210` review URL
  returned HTTP 200 (`validation/install.txt`,
  `validation/install-and-start.txt`).
- Browser command:

  ```bash
  SOURCE_BASE_URL=http://127.0.0.1:4261 \
  PROTOTYPE_BASE_URL=http://127.0.0.1:3261 \
  MOCK_BASE_URL=http://127.0.0.1:4361 \
  corepack pnpm validate:token-statistics-refresh
  ```

- Browser result: 26/26 passed; zero unexpected source browser errors; zero
  unexpected prototype browser errors.
- `corepack pnpm typecheck`: pass; only the accepted base's pre-existing Nuxt
  duplicate-getter warnings (`validation/typecheck.txt`).
- `corepack pnpm lint`: pass (`validation/lint.txt`).
- `corepack pnpm test`: 3 files / 11 tests pass, including focused fixture coverage
  (`validation/test.txt`).
- `corepack pnpm validate:boundaries`: 13/13 pass
  (`validation/boundaries.txt`).
- `NUXT_IGNORE_LOCK=1 corepack pnpm build`: pass, node-server output
  (`validation/build.txt`).
- Browser comparison log: `validation/browser-comparison.txt`.
- Screenshots: `source/`, `prototype/`, and normalized `comparison/` directories.
- Scenario reset/isolation: each browser context clears local storage, selects
  one fixture, blocks non-loopback access, and closes after capture; pass.
- Limitation: disposable source runtime normalization was necessary to observe
  the browser presentation outside Electron. This does not change the UI files,
  and direct source/prototype interaction plus hash audit substantiates the
  selected boundary.

## Completion Check

- Selected source boundary and pinned revision explicit: `Yes`
- Prototype starts independently at documented URL: `Yes`
- Every selected navigation destination and surface has exact evidence: `Yes`
- Every distinct interaction, feedback, and meaningful state demonstrated: `Yes`
- Every materially different context represented: `Yes`
- Every selected journey and recovery path runnable with matching outcome: `Yes`
- Desktop and narrow behavior validated: `Yes`
- Interface structure/interactions are real: `Yes`
- Production capabilities locally and deterministically simulated: `Yes`
- Production credentials, customer data, live dependencies, writes absent: `Yes`
- Remaining perceptible appearance or client-behavior discrepancies: `None`
- Remaining unsubstantiated inventory items: `None`
- 100% observable parity for the recorded distinct inventory: `Yes`

## Known Gaps And Next Action

- Blocked or incomplete IDs: `None`
- User-facing differences or omissions inside selected boundary: `None`
- Intentional simplifications: all records, token/cost amounts, dates, models,
  providers, tasks, runs, Team members, loading timing, and errors are
  illustrative deterministic fixtures; production data and mechanisms are
  absent without changing presentation.
- Source reachability limitation: exact pin required a disposable browser-only
  runtime normalization documented above; all selected source presentation
  files remained exact.
- Required correction: `None`
- Recommended next action: Product Prototyper acceptance review, accepted
  ticket-branch commit, then mode-appropriate future-state work. Bootstrapper
  intentionally did not edit Product-owned approval records, `ui-ux-spec.md`,
  final reference screenshots, ticket status, repository state, or commits.
