# UI Baseline Report

Whole-frontend refresh of the AutoByteus Web current-experience baseline from
`origin/personal@2f21134` to `origin/personal@9227d61`, for Product ticket
`WEB-BASELINE-REFRESH-011`. The previous report (`WEB-BASELINE-REFRESH-010`, pin
`2f21134`) is kept in Git history at accepted base `cb384e3`.

## Status

- Status: `Completed`
- Request type: `Refresh`
- Refresh request: the Product UI/UX Designer selected
  `origin/personal@9227d61597fd7ef8f6324fc9092be24ed1684c8a` (fetched 2026-10-20) for the whole selected
  frontend, keeping a single pin.
- Refresh policy:
  - Where the source implements a surface the UI reference had changed, the source version wins. This
    applies to `task-part-of` (179ddb9) and `search-model-settings` (8469d4b, 70bb036; design commits ab28b40
    and 4e4ac06).
  - Accepted design-only changes with no source equivalent are preserved.
- Result:
  - The baseline mirrors `9227d61` and runs on its own in a browser with synthetic data.
  - The shipped "part of" and Embedding components replace the design-only ones.
  - Reconnect is re-applied onto the source.
  - The design-only example layers stay.
  - Every new or changed surface passed paired source-versus-baseline checks.
  - The approved design checks were re-run. Results and every visible difference from the approved
    references are below; no reference screenshot was overwritten.
- Integration: this is a candidate (uncommitted changes in the ticket worktree). The design project
  (`personal`, still at `cb384e3`) carries it only after the Product UI/UX Designer accepts it and integrates
  it into the default branch.
- Next expected action: the Product UI/UX Designer reviews the candidate, decides the reference questions
  below, then integrates it into `personal` and records that in the baseline ticket.

## Source Identity

- Source project: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend: `autobyteus-web`
- Pinned revision: `9227d61597fd7ef8f6324fc9092be24ed1684c8a`
- Previous pin: `2f211340ee36b81cef74a74b2e042b5102c269d3`
- `origin/personal` has since moved on (`dc530fd`). That is outside this refresh; a newer pin is a new
  refresh request.
- The source checkout was neither used for observation nor modified, and nothing was pulled.
- Applicable instructions: the superrepo `AGENTS.md` (`DESIGN.md`, `TESTING.md`, `RELEASE.md`; nothing is
  merged, tagged or released here), the design repository `README.md`, and `ui-reference-runbook.md`.
- Source observation:
  - an exact `git archive` export of the pin at `/tmp/r011/src/` (`autobyteus-web` and the contract
    packages);
  - `node_modules` links the source install read-only, and the contract packages link the exported pin
    (`application-sdk-contracts` links the vendored build; its `src/` is unchanged in the range);
  - served with `BACKEND_NODE_BASE_URL=http://127.0.0.1:4623 ENABLE_APPLICATIONS=true nuxt dev --host 127.0.0.1 --port 4622`;
  - backed by `PROTOTYPE_MOCK_PORT=4623 node prototype/source-observation/mock-node.mjs` (synthetic fixtures
    only).

## Baseline & Repository Identity

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Product ticket: `WEB-BASELINE-REFRESH-011`
- Ticket branch: `design/web-baseline-refresh-011`
- Target worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-011`
- Accepted design base: `cb384e3`. Worktree `HEAD` `7ca2ff0` is the Product ticket-open commit.
- Bootstrap candidate: uncommitted working-tree changes; the Bootstrapper made no commit. `package.json` and
  `pnpm-lock.yaml` are unchanged.
- Install: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start: `corepack pnpm dev --port 4620`
- Review: `http://127.0.0.1:4620/settings?section=server-settings&mode=embedding` and the rest of
  `ui-reference-runbook.md` (new section `WEB-BASELINE-REFRESH-011`).
- Built preview: `corepack pnpm build && PORT=4621 HOST=127.0.0.1 node .output/server/index.mjs`
- Ports: only `4620`–`4623`, all released (3210 and 4681–4689 not used).
  - An incident while stopping my servers: twice (about 09:16 and 09:53 CEST) a broad `pkill -f "nuxt.mjs dev"`
    also stopped the Designer's review server on 4681. After the Designer reported it, I stop only my own
    processes, by recorded PID or by a pattern containing this worktree's path.
- Scenario selection:
  - The existing keys are unchanged.
  - New scenarios: `embedding_busy`, `embedding_many`, `embedding_offline`, `embedding_unavailable`,
    `embedding_load_failed`.
  - Comparison scripts set `autobyteus.prototype.designOnlyLayers=off`.

## What Changed In The Refresh

Work followed the source diff `2f21134..9227d61`: 176 changed files under `autobyteus-web`.

| Commits | Surface | Change |
| --- | --- | --- |
| `8469d4b`, `70bb036` | Settings → Server Settings → Embedding | Models card and Project indexes card. Shipped from the approved `search-model-settings` design:<br>• download ahead, progress and Cancel;<br>• Remove and Rebuild with inline confirmations;<br>• the switch dialog (download size), preparing then ready;<br>• Index now, Index all Projects, filter tabs, Find (more than 8 Projects);<br>• unavailable model with Retry, a failed download with Retry;<br>• load error with Retry, no Projects;<br>• announcements. |
| `54e26d7`, `722b9b3` | Projects board | Meaning search: exact matches first, then related by meaning; a status line while meaning search prepares or is unavailable (Retry); new placeholder "Describe the task you're looking for". |
| `179ddb9` | Board, Task page, Edit/New task, tab | "Part of": a part marker and the parent's progress on cards; the Parts and Part of sections; the editor picker (a Task with parts cannot be a part); "New part". Shipped from the approved `task-part-of` design. |
| `df15c43`, `c5161ed` | Settings → MCP Servers → Bulk Import | Failed entries listed under "These entries were not imported"; partial ("Imported N; M failed. See the entries below.") and none notices. |
| `7d68945`, `96de77e`, `35675e3` | Run Settings → Delegated copies | Copies shown and edited from their recorded source; every Team copy member records its launch and `followsTeam`. |
| `291545c` | Workspaces tree | A hub's copies load when opened; owner-scoped file-change reads. |
| `fbc0f80` (`ffeea43` revert), `be00680` | Run history, streams | Retiring adopted runs (reverted at the pin); sequenced content batch frames (no visible change). |

### Implementation sync

- **Synced to the pin:** 40 changed files that were still identical to the previous pin, and 22 added files.
  The added files include `components/settings/embedding/*`, `composables/settings/useEmbeddingSettings.ts`,
  `composables/projects/useProjectTaskSearch.ts`, the embedding and task-search queries and mutations,
  `types/embeddingSettings.ts` and the `embeddingSettings` messages.
- **Source wins:** the design-changed "part of" and Embedding files were replaced by the source's:
  - `ProjectTaskDetail`, `ProjectTaskDraftEditor`, `ProjectTaskRow`, `ProjectsPanelTaskDetail` and
    `TaskPartOfPicker`;
  - `useProjectTaskDraft`, `projectTaskQueries`, `projectTaskStore`, `types/project` and
    `generated/graphql.ts`;
  - `ServerSettingsManager`, `pages/settings.vue`, and the `projects` and `settings` messages (en, zh-CN).

  The design-only `SearchSettingsManager.vue`, `SearchModelsCard.vue`, `SearchProjectIndexesCard.vue`,
  `SearchModelSwitchDialog.vue` and `prototype/search-settings/` were removed.
- **3-way merged** (base `2f21134`, ours the worktree, theirs `9227d61`; clean): `AgentEventMonitor.vue`,
  `ExistingRunConfigEditor.vue` and `localization/messages/{en,zh-CN}/index.ts`.
- **Audit:** 1058 design files that also exist in the source are byte-identical to the pin. The 14 that
  differ are Reconnect (10) and the design-owned `nuxt.config.ts`, `package.json`, `tsconfig.json` and
  `utils/apolloClient.ts` (`evidence/WEB-BASELINE-REFRESH-011/presentation-audit.json`). The source files the
  baseline replaces (Electron, Docker, build and source plugins) did not change in the range.
- **Vendored contracts:** `src/` and `dist/` synced to the pin (31 files) and reinstalled; the `file:`
  dependency lines are kept.

## Refresh Reconciliation

- Pins: `2f21134` → `9227d61`.
- **Accepted design changes superseded by the source version:**
  - `task-part-of`: the source's components, store and messages run unchanged. The base fixtures now carry
    `partOfTaskId`: `prototype-launch-3`, `-4` and `-5` are parts of `prototype-launch-1` (in progress,
    done, cancelled). The design-only example data (`prototype/task-part-of/`) already used the source's
    shape and stays.
  - `search-model-settings`: the shipped Embedding section replaces the design's components. The design's
    in-browser simulation (`prototype/search-settings/`) was removed rather than kept as a design-only
    layer, because it implemented the design's own components rather than example data on the source's
    API. The section is now answered by base GraphQL fixtures shared with the source observation
    (`prototype/source-observation/embedding-fixtures.mjs`). They reuse the design's invented catalog
    (three models, 55/24/346 MB).
- **Accepted design-only changes preserved:**
  - `agent-definition-reconnect-ui`: 7/7 review scripts pass;
  - the delegated-copy example data: 4/4;
  - the task-keys, task-part-of and skill-sources example data.

  All stay off with `designOnlyLayers=off`.
- **Surfaces where it is hard to tell which policy applies** (recorded for Product):
  1. **The search-model-settings simulation.** I treated it as superseded, not as preserved design-only
     data, for the reason above. If Product wants the design's example Projects and mixed default index
     states back as design-only example data on the shipped section, that is a new design-only layer.
  2. **The search-model-settings references (VIS-001–021).** They show the design's default with mixed
     index states and the design's Projects. The shipped baseline shows the same states in `embedding_busy`,
     and its default scenario has every Project ready. Product should decide whether those references
     stay as the design's record or are re-captured on the shipped section.
  3. **SRCH-002b's status pills.** The approved check expects `search-pill-*` hooks; the shipped status line
     has none (the same words and state). Product should decide whether that check is retired.
  4. Carried over from REFRESH-010, still open: Reconnect's collaborator case now shows on delegated copies.
- **Unchanged surfaces given a load-and-look pass:** the full route and state matrix, and the independent-run
  set.

## Experience Inventory (this refresh)

All rows were checked with paired runs (`prototype/scripts/probe-refresh-011.mjs`). Each flow states the UI
state it is about, and that state must appear on both sides (new in this refresh), so a flow cannot pass with
both sides in the same wrong state. Domain values (names, counts, sizes, reasons) are illustrative synthetic
fixtures; UI-controlled text, including the template text around values, is exact.

| ID | Surface / behavior | States / outcomes | Synthetic fixture (illustrative) | Result |
| --- | --- | --- | --- | --- |
| EMB-001–035 | Settings → Server Settings → Embedding | <ul><li>default; download ahead, progress, complete (announced); Cancel</li><li>Remove: confirmation, keep, confirm</li><li>switch dialog for a model not downloaded and for a downloaded one; confirm, preparing, ready; Index all after the switch</li><li>Rebuild confirmation and indexing; Index now</li><li>busy: every index state, Indexing filter; many Projects: Find, no match, Needs indexing filter</li><li>unavailable and Retry; first read fails and Retry</li><li>offline: a failed download, Retry completes; a switch whose download fails, Retry downloads again, Index all waits for the model</li><li>no Projects; Basics → Embedding; Back to Workspace; 390, zh-CN</li></ul> | the design's invented catalog; Projects from the base data plus index-only extras in `embedding_busy` / `embedding_many`; work moves one step per status read | `Pass` |
| SRC-001–006 | Board meaning search | exact first; related by meaning; no match; preparing after a model switch; unavailable with Retry | `SearchProjectTasks`: substring, then a shared four-letter word prefix | `Pass` |
| PRT-001–011 | "Part of" | board markers and progress; Parts (progress, cancelled part); Part of; the editor (a parent offers nothing; open the list; remove and Save); New part and Create; tab; zh-CN; 390 | `prototype-launch-1` with three parts | `Pass` |
| MCP-001–004 | Bulk MCP import | the view; one failing entry (partial notice, failures listed and in view); all imported; all failed | an entry without `url` or `command` fails | `Pass` |
| WBR-S025–S029 | Matrix state rows | Embedding busy, unavailable, load failed, empty, many | — | `Pass` |

## Implementation Simplifications

| Visible capability | Visible experience preserved | Baseline simulation | Absent |
| --- | --- | --- | --- |
| Embedding models and indexes | Every state, control and outcome of the section | `embedding-fixtures.mjs`: in-memory node state per caller, reset with the scenario; work advances one step per status or search read, on both sides alike | Real downloads, model files, indexing, timers |
| Meaning search | Exact and related results, preparing and unavailable status | Substring, then shared word-prefix matches | Embeddings |
| Part of | Markers, progress, sections, picker, cascade note | Stored `partOfTaskId`; the source's store and components | Server-side cascade |
| Bulk MCP import | Partial and none outcomes, failure list | `mcpImportResult`: no transport → failed; the source's store action runs against the local answer | Real server validation |

Baseline-owned changes:

- `prototype/source-observation/embedding-fixtures.mjs` (new) and `fixtures.mjs`:
  - the Embedding and meaning-search fixtures and five scenarios;
  - part-of data;
  - `mcpImportResult` (a result with failures is not a success);
  - Team copy members with launch and `followsTeam`;
  - empty copy file-change reads.
- `mock-node.mjs` resets the embedding state with the scenario.
- `utils/apolloClient.ts`:
  - Embedding mutations and `ImportMcpServerConfigs` answered locally;
  - scripted read failures answer a GraphQL error.
- `plugins/00.prototype-state.client.ts`:
  - `importMcpServerConfigs` runs the source action;
  - an entry route without the docked left panel (Settings) seeds the panel split from the scenario's
    workspace snapshot, as the source measures it when it later mounts.
- `prototype/delegated-copy-tasks/` Team copies carry the member launch fields.
- Fixtures: `prototype/fixtures/` — 85 snapshots re-captured at the pin from the source on the synthetic
  node; `runtime-state.json` rebuilt (`sourceCommit` `9227d61`). The capture now waits for runtime
  availability reads, because one capture on a busy machine had recorded Codex and Claude as pending.
- Tests and scripts:
  - `fixture-contract.test.ts`: 20 tests, including embedding/search/part-of, MCP import results, and the
    stored run's collaboration views parsed with the pinned contract;
  - the new `probe-refresh-011.mjs`;
  - every paired probe now fails a flow whose page shows a contract (zod) rejection;
  - `probe-refresh-008.mjs` PRJ-014 and the `probe-cancelled-status.mjs` search helper find the board search
    by its test id or label (the placeholder changed);
  - `validate-web-baseline-refresh.mjs`: the Embedding route and S025–S029;
  - `validate-web-baseline-refresh-independent.mjs`: IND-040–046;
  - `dump-source-state.mjs`, `build-runtime-fixtures.mjs`.
- Docs: `README.md`, `mock-boundaries.md`, `ui-reference-runbook.md`.

### Mock data

- Origin: every new value is invented and hand-written (models, sizes, Project names, counts, reasons, MCP
  entries). Snapshots are captured only from the pinned source running on the synthetic node. No real source
  data or content was copied.
- Checked: `fixture-contract.test.ts` (20 tests): secret-like strings, local-only node URLs, every state, and
  the pinned collaboration contract.
- Independence and repeatability: no live service is used, and a reload resets every in-memory change.

## Validation

Every paired run used headless Chrome with the same viewport, locale, UTC timezone, light theme, reduced
motion and synthetic data, external requests blocked, and design-only data off. Both sides get the same
synthetic values, so the comparison is stricter than the shared principles' per-component method. A row
passes only if all of these hold:

- the text and route are identical;
- the element probe (per component: computed styles, geometry, focus, text) is identical;
- the screenshot differs at most by edge anti-aliasing or compositing rounding;
- the baseline shows no browser error and makes no non-local request;
- the flow's own state is on screen, and no contract rejection is shown.

Evidence root: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-011/evidence/WEB-BASELINE-REFRESH-011/`.

- **New paired flows** (`flows/`): **56/56 pass.**
  - `flow-results-final.json` has 54/56. MCP-002 and MCP-004 differed only in focus, because the baseline's
    replaced import action did not disable the Import button. The source action now runs, and
    `flow-results-recheck5.json` has MCP-001–004 passing, pixel-identical.
  - The busy and many-Projects flows were re-checked after an index-only extra Project was renamed
    (`flow-results-recheck6.json`, 9/9).
- **Found and fixed during this refresh:** fixture faults that both sides had shown the same way:
  - the Team copy members lacked the launch fields the pinned contract requires, so both sides showed the
    same zod error in Run Settings;
  - the MCP import answered success with failures, so the failure state could never show;
  - offline Retry never succeeded.

  Each is fixed, guarded (contract test, expected-state check, contract-rejection guard) and re-compared.
- **Route and state matrix** (`matrix/`): 114 rows, re-run on the final snapshots. **113/114 pass**, 88 pixel-identical.
  - **WBR-S012** has no visible difference: the source logs the same "Failed to reload AGENT definition
    problems" line itself (as in REFRESH-009 and -010).
  - WBR-S015 passed on the dev server this time.
  - S025–S029 re-checked after the last fixture change (`matrix-embedding-recheck/`, 5/5, pixel-identical).
- **Regression flows re-run against the new pin:**
  - REFRESH-010 flows (`flows-010/`): 44/44. They first failed DLG-002–006 and LIV-002–005 on both sides
    because of the copy contract fault above. After the fix, all pass.
  - REFRESH-009 (`flows-009/`): 56/56.
  - REFRESH-008 (`flows-008/`): 41/41. PRJ-014 was re-pointed at the board search's test id (new
    placeholder).
  - Cancelled status (`cancelled-status/`): 38/38.
  - Chat (`chat-flows/`): 53/53.
  - `flows-002/`: 13/13.
  - `flows-004/`: 47/47.
  - `flows-006/` BRW and TOK: 8/8.
- **Independent run** (`independent-preview/`, built preview on `:4621`, source and observation node
  stopped): **IND-001–046 pass 46/46**, with zero browser errors and zero non-local requests; only the preview port was
  listening. IND-040–046 are new: Embedding download, switch, Rebuild and unavailable Retry; board meaning search;
  Parts on a Task page; bulk MCP import with failures. (One earlier run failed IND-018 because a capture had recorded
  the Codex runtime as pending. The capture now waits for runtime availability; re-captured, the runtime availability
  of all 85 snapshots matches the accepted base.)
- **Checks:**
  - `vue-tsc --noEmit -p tsconfig.prototype.json`: exit 0;
  - `pnpm lint`: exit 0;
  - `pnpm test`: 3 files, 20 tests;
  - `validate:boundaries`: 13/13;
  - `pnpm build`: exit 0.
- Logs: `logs/`. Browser: Google Chrome (headless, playwright-core). Viewports 1440×900 and 390×844; locales
  en and zh-CN (sampled).

### Approved design checks (re-run as requested)

Details are in `approved-checks/SUMMARY.md`. No approved reference screenshot was overwritten
(`git status tickets/` is clean).

- **search-model-settings (SRCH-001–019): 60 passed, 18 failed.** It now tests the shipped section.
  - Copy changes: selectors `search-*` → `embedding-*`, the scenario keys, case-insensitive `data-state`, and
    a harness that records an aborted block as one FAIL.
  - 17 failures are illustrative values only:
    - the design's example Projects and counts;
    - the server's failure reasons;
    - the design default's mixed index states, which are in `embedding_busy`;
    - zh-CN Project names the allow-list does not know.

    Every UI string and state these blocks exercise appears in the baseline and is compared in EMB-001–035.
  - 1 failure (SRCH-002b) is a design-only hook (`search-pill-*`) the shipped UI does not have.
  - Two fixture behaviours were corrected because of this check: offline Retry succeeds, and Retry
    re-downloads a missing model.
- **task-part-of: 56/56 pass.** The visible reference change is the new board search placeholder.
- **task-keys-and-dependencies: 14/14 pass.** The visible reference changes come from "part of": a Parts
  section on Task pages, part lines on cards, and the placeholder.
- **delegated-copy-task-locator: 10/13 pass.** These are the same three as in REFRESH-010: the renamed
  "AutoByteus" Project (SCN-002, SCN-008) and the removed collaborators (SCN-011). The located card's scroll
  position moved because the board is longer.
- **Reconnect review scripts: 7/7 pass.** The delegated-copy example passes 4/4.

## Known Gaps And Next Action

- **Simulated, not compared:** real downloads and indexing (one step per status read stands in for time);
  status events after a live run's snapshot; a copy resuming on its new model; live TPS readings; the
  Team/Org launch outcome (carried over).
- **Timing:** local mutations and replaced store actions take 40 ms (modelled, not measured). Flows whose
  screenshot depends on polling compare a moment between two status reads.
- **Carried over, unchanged:** the legacy `workspace_*`/`mobile_*` injector rows and the older desktop-host
  rows were not re-run.
- **Remaining UI parity differences inside the verified scope:** none.
- **Recommended next action for `product_ui_ux_designer`:**
  - decide the four reference questions above;
  - then accept, commit on `design/web-baseline-refresh-011`, integrate into `personal`, and record the
    integration in the baseline ticket.
