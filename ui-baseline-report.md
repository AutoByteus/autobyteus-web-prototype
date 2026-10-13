# UI Baseline Report

Whole-frontend refresh of the AutoByteus Web current-experience baseline to
`origin/personal@73f7432` (v1.5.3-beta.1), for Product ticket
`WEB-BASELINE-REFRESH-009`. It ends the mixed pin. Before this refresh the
Projects Task-status surfaces were at `ff227eb` and everything else at
`1cd1a3a`. The previous report (delegated-copy-task-locator focused refresh) is
kept in Git history at accepted base `5f5cdf8`.

## Status

- Status: `Completed`
- Request type: `Refresh`
- Refresh request: explicit user instruction (2026-10-13): "I guess the
  baseline maybe need to be updated". The Product UI/UX Designer selected
  `origin/personal@73f743211c8b86c704acb33f216154e42b7a67b8` (fetched
  2026-10-13) for the whole selected frontend.
- Refresh policy:
  - Where the source implements a surface the UI reference had changed, the
    source version wins.
  - Accepted design-only changes with no source equivalent are preserved.
- Result:
  - The baseline mirrors `73f7432` and runs on its own in a browser with
    synthetic data.
  - Three accepted design-only changes are now shipped by the source:
    delegated-copy Task locator, collapsed-left-panel Workspaces strip icon, and
    the skill sources dialog. Their source versions run unchanged, and the
    design-only code is removed.
  - Reconnect is re-applied onto the source.
  - The design-only example data stays, adapted to the source's data shape.
  - Every new or changed surface passed paired source-versus-baseline checks.
    The full route and state matrix also passed (see Validation).
- Next expected action: Product UI/UX Designer reviews and accepts the
  candidate, commits it on `design/web-baseline-refresh-009`, integrates it into
  `personal`, and then reconciles the paused `task-keys-and-dependencies` onto it.

## Source Identity

- Source project: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend: `autobyteus-web`
- Source root: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Governing authority: `origin/personal`, fetched 2026-10-13; equal to the pin.
- Pinned revision: `73f743211c8b86c704acb33f216154e42b7a67b8`
- Previous pins (mixed):
  - Projects Task-status surfaces: `ff227eb72ef08dca4188451141789d0e6d3af356`
  - Everything else: `1cd1a3abc126df820e334c023621d0fb82de5b7b`
- The source checkout was neither used for observation nor modified. Its local
  `personal` is behind `origin/personal` and has unrelated uncommitted changes.
  Nothing was pulled.
- Applicable instructions: superrepo `AGENTS.md` (`DESIGN.md`, `TESTING.md`),
  the design repository `README.md`, and `ui-reference-runbook.md`.
- Source observation:
  - Exact `git archive` export of the pin at `/tmp/r009/src/` (`autobyteus-web`
    and the four `@autobyteus/*` contract packages).
  - `node_modules` links the source install read-only. Three contract packages
    link the exported pin (their `dist/` is committed).
  - `application-sdk-contracts` has no committed `dist/`. It links the
    worktree's vendored build; its `src/` is byte-identical to the pin.
  - Served with `BACKEND_NODE_BASE_URL=http://127.0.0.1:4623 ENABLE_APPLICATIONS=true nuxt dev --host 127.0.0.1 --port 4622`.
  - Backed by `PROTOTYPE_MOCK_PORT=4623 node prototype/source-observation/mock-node.mjs`
    (synthetic fixtures only).

## Baseline & Repository Identity

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Product ticket: `WEB-BASELINE-REFRESH-009`
- Ticket branch: `design/web-baseline-refresh-009`
- Target worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-009`
- Accepted design base: `5f5cdf881b30689f103b418530c0bd1a22b1ed5a`. Worktree
  `HEAD` `c4fe636` is the Product ticket-open commit.
- Bootstrap candidate: uncommitted working-tree changes; the Bootstrapper made
  no commit. `package.json` and `pnpm-lock.yaml` are unchanged, because the
  source's dependencies did not change in the range.
- Install: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start: `corepack pnpm dev --port 4620`
- Review: `http://127.0.0.1:4620/workspace` (see `ui-reference-runbook.md`).
- Built preview: `corepack pnpm build && PORT=4621 HOST=127.0.0.1 node .output/server/index.mjs`
- Ports used: `4620`–`4623` only. Ports 4651 and 3210 were not used.
- Scenario selection:
  - The `autobyteus.prototype.scenario` and `autobyteus.prototype.context`
    keys are unchanged.
  - New scenarios: `definition_issues` and `agy_signed_out`.
  - `autobyteus.prototype.designOnlyLayers=off` (set only by comparison scripts)
    turns off design-only data.
- Framework: unchanged (Nuxt 3, Vue 3, TypeScript, Tailwind; source
  presentation code retained).

## What Changed In The Refresh

Work followed the source diff from each current pin to `73f7432`:

- From `1cd1a3a`: 397 commits and 266 changed files under `autobyteus-web`, of
  which 152 are non-test UI files.
- From `ff227eb`: 212 commits and 197 files.

### Surfaces added or changed by the source

| Commits | Surface | Change |
| --- | --- | --- |
| `6bd2b69`, `9679123`, `1949fa9`, `e97addd` | Workspaces tree, right panel Projects tab | Task summary under Task-worker rows (server `TaskWorkerTask`). Clicking it, or Enter/Space, shows the Task in Projects: the board is chosen, the card scrolls into view, takes focus and is highlighted for 2.4 s. A page without a right panel opens the run first. Tailwind now scans `utils/`. |
| `1639cba`, `d0bf3db` | Collapsed left strip | Workspaces icon after the page icons, lit while a run is open; it reopens the panel on the run. Chat is lit only on New chat. |
| `3fb98d2`, `a7d2fc8` | Skills → Sources dialog | Redesigned dialog: one add input (folder or GitHub URL), quieter rows, Try again only after a failed check, focus kept inside. |
| `f7fcf90`, `bd4c637`, `3cc1713`, `e89085f` | Agents, Teams, Orgs lists; Settings → Agent Packages | Card load-issue badges ("Using last working version", "Package folder unavailable", "Some members couldn't be loaded"). List problem notices with "Depends on". Reload runs `reloadAgentPackageDefinitions`. Package auto-refresh labels. Live `/ws/agent-package-definitions` feed. `AgentOrgCatalogCard`. |
| `035b208` | Run settings | Fresh Team and Org starts seed member rows from agent defaults (with a "can't be used" note). Saved-run settings list collaborators and delegated copies (`RunDelegatedLaunchList`) with their sources and skipped defaults. |
| `9e8e5bf`, `d6a89cb`, `8dd8fdf`, `c0f1b9a` | Token meter | Per-call readings. Auto-compaction marker and "Auto-compacts at" label. "Compacted — updates on the next model call" after a completed compaction. |
| `fdb7635` | Settings → API keys, Server settings | Remote AutoByteus LLM provider removed (no provider row, no "AutoByteus LLM Hosts" card). |
| `cec24ca` | Server settings → compaction card | No compaction model choice (`CompactionModelSettings` removed). |
| `87b246c` | Model menu | An unavailable runtime reads "Unavailable", with the server's reason under its name. |
| `e259a02`, `dbd2e9a` | Composer | Send needs text or a skill tag. Context-file drafts are deleted at their own locator. |
| `fd5f32b` | Workspace | An archived or deleted open run closes to the workspace empty view. |
| `24baaf7` | `@` mentions | Delegated copy members reach the Agent-run host (`focusedAgentRunId`). |
| `17e4299`, `814e41a`, `7f7b2c8` | Projects Task status | Cancelled status (already at `ff227eb`; unchanged). |

### Implementation sync

- **Presentation synced to the pin.** 96 changed files that were still identical
  to a pin were taken as they are. 21 files were added and 2 removed with the
  source. 19 design-changed files whose surface the source now implements were
  replaced by the source version.
- **3-way merged.** Nine files were 3-way merged (base `1cd1a3a`, ours the
  worktree, theirs `73f7432`): seven carrying Reconnect, and the en/zh-CN
  `workspace` messages, which merged to exactly the source's. Conflicts were
  resolved by hand; superseded delegated-copy code in the tree row was dropped.
- **Audit result.** 1018 design files that also exist in the source are
  byte-identical to the pin. The 14 that differ are Reconnect (10) and the
  design-owned `nuxt.config.ts`, `package.json`, `tsconfig.json` and
  `utils/apolloClient.ts`. Audit:
  `evidence/WEB-BASELINE-REFRESH-009/presentation-audit.json`.
- **Vendored contracts.** `src/` and `dist/` were synced to the pin. The new
  surfaces need the launch sources, effective-member functions, mention presence
  and token-usage threshold/revision fields. The `file:` dependency lines are
  kept. Reinstalled with `--force`.
- **Icons.** `heroicons:user` was added to the offline bundle.

## Refresh Reconciliation

- Pins: mixed (`ff227eb` / `1cd1a3a`) → `73f7432`.
- **Accepted design changes superseded by the source version.** The source
  shipped them. Its presentation now runs unchanged, and the design-only code
  was removed.

  | Design ticket | Source equivalent | Removed from the baseline |
  | --- | --- | --- |
  | `delegated-copy-task-locator` | `6bd2b69`, `9679123`, `1949fa9` | `composables/projects/useDelegatedCopyTask.ts`, the design `stores/taskLocatorStore.ts`, design row code in `WorkspaceTransientExecutionRow.vue`, `ProjectTaskRow.vue`, `ProjectTaskBoard.vue`, `TempTaskBoard.vue`, `ProjectsPanel.vue`, `WorkspaceToolShell.vue` (the source's `workspace` messages are identical to the design's) |
  | `collapsed-left-panel-expand-keeps-run` | `1639cba`, `d0bf3db` | design code in `AppLeftPanel.vue`, `LeftSidebarStrip.vue`, `WorkspaceAgentRunsTreePanel.vue`, `WorkspaceHistoryWorkspaceSection.vue`, `useShellPrimaryNavigation.ts`, `useWorkspaceHistoryTreeState.ts`, `useRevealSelectedTreeRow.ts`, `shell` messages |
  | `skill-sources-dialog-redesign` | `3fb98d2`, `a7d2fc8` | design code in `SkillSourcesModal.vue`, `SkillSourceRow.vue`, `skills` messages (`skillSourceDisplay.ts` was already identical) |

- **Accepted design-only changes preserved:**
  - `agent-definition-reconnect-ui` was re-applied onto the source's run settings
    (with the new delegated launch list), member rows and Workspaces rows.
    - A Task-worker row now renders the source's structure when no agent is
      missing.
    - All 7 of its review scripts pass, with no browser error and no non-local
      request (`reconnect-preserved/`).
  - Delegated-copy example data (`prototype/delegated-copy-tasks/`,
    `plugins/98.delegated-copy-tasks.client.ts`) is adapted to the source's data
    shape. Its Tasks answer `GetTaskWorkerTasks` through the same current-Task
    rule. 4/4 checks pass (`design-only-delegated-copy/`, new
    `prototype/scripts/check-delegated-copy-example.mjs`):
    - five copies, each showing its current Task (copy 3's follow-up, not its
      Done Task);
    - Desktop App and Temp tasks are located;
    - no errors.
  - Skill sources example data (`prototype/skill-sources/`) works on the source's
    dialog. Its review script passes 20/20 (`design-only-skill-sources/`).
- **Surfaces where it was hard to tell which policy applies:** none. All three
  superseded tickets have direct source commits, and Reconnect has none.
- **Retired comparison flows.** SKS-002–014 of `probe-refresh-006.mjs` drove the
  earlier dialog's controls (the GitHub/Folder mode buttons, "Add Folder",
  "Import repository"), which no longer exist on either side. SKN-001–015 of
  `probe-refresh-009.mjs` replace them on the new dialog.
- **Unchanged surfaces given a load-and-look pass:** the full route and state
  matrix, and the independent-run set (see Validation).

## Experience Inventory (this refresh)

All rows below were checked now with paired source and baseline runs. Domain
values (Task texts, counts, names, paths, reasons) are illustrative synthetic
fixtures. UI-controlled text, including template text around values, is exact.

| ID | Surface / behavior | States / outcomes | Synthetic fixture (illustrative values) | Result |
| --- | --- | --- | --- | --- |
| TSL-001–009 | Task summaries and locate | summaries on Task-worker rows, Project and Temp locate with highlight, highlight end, Enter, page without right panel, run open in Chat, 390 drawer | worker-writer-001 → "Review the synthetic navigation baseline."; worker-temp-researcher-001 → Temp task | `Pass` |
| CLP-001–004 | Collapsed left strip | Workspaces lit on an open run, reopens on the run, Chat lit on New chat, tooltip | — | `Pass` |
| SKN-001–015 | Skill sources dialog | open, add folder, GitHub URL, invalid URL, Tab stays inside, Update failed / Removal incomplete, Esc, Try again, Update confirm/outcome, Remove GitHub/local, Retry removal, Done | synthetic sources (`fixtures.mjs`) | `Pass` |
| DEF-001–008 | Definition issues and Reload | agent badges (last working version, folder unavailable), notices, Team badge (members), Org badge and notice, Reload (Agents, Teams; focus as in the source), package auto-refresh tooltip | `definition_issues` scenario | `Pass` |
| RSN-001–008 | Member defaults, delegated launches | heading switcher (no seeding), catalog Team Run with a seeded researcher (Customized) and the writer's "can't be used" note, expanded member, Org Run launch page, stored Agent run's delegated list (Agent default, Team default, Inherited with skipped default, Source not recorded), stored Team run without one | writer default `mock/gpt-retired`; launch sources on the stored run | `Pass` |
| TKN-001–003 | Token meter | marker and "Auto-compacts at", compacted note, stored run | threshold 102400 | `Pass` |
| ARC-001 | Archive all with the run open | closes to the workspace view | — | `Pass` |
| CHS-001 | Send rule | send unavailable without text | — | `Pass` |
| AGY-001–002 | Model menu | signed-out Antigravity "Unavailable" with reason, hover | `agy_signed_out` | `Pass` |
| ZH-001–003, NAR-001–002 | Samples | zh-CN tree/locate, load issues, members; 390 dialog, load issues | — | `Pass` |
| WBR-S019–S023 | State rows | definition_issues lists and packages; signed-out Antigravity in New chat | as above | `Pass` |

## Implementation Simplifications

| Visible capability | Visible experience preserved | Baseline simulation | Absent |
| --- | --- | --- | --- |
| Task-worker Tasks and locate | Summaries, locate steps, highlight | The source's `taskWorkerTaskStore` and `taskLocatorStore`; `GetTaskWorkerTasks` answered from the in-memory Project/Temp Task copy (open Task the worker is root of, else the latest) | Server assignment data |
| Agent package definitions | Badges, notices, Reload, auto-refresh labels | Fixtures per scenario; `ReloadAgentPackageDefinitions` → `true`; the definitions feed opens on the local `PrototypeWebSocket` and stays silent | Package watching, live reload |
| Member defaults, delegated launches | Seeded rows, notes, launch sources | Fixture defaults and recorded launch sources | Server launch resolution |
| Token meter compaction | Marker, label, compacted note | Fixture threshold; the note is live-session state, applied in comparisons through the source's own store | Live compaction stream |
| Busy states | "Reloading…", disabled inputs, focus after them | Local answers arrive on a later task (`utils/apolloClient.ts`); replaced store actions answer after 40 ms (`plugins/00`), like a node response | Network |

Baseline-owned changes:

- `prototype/source-observation/fixtures.mjs`:
  - `GetTaskWorkerTasks`, `GetDefinitionProblems`, `ReloadAgentPackageDefinitions`;
  - `loadIssue` / `loadIssues`;
  - `autoRefresh` and a second (missing-folder) package;
  - launch sources;
  - writer default;
  - scenarios `definition_issues` and `agy_signed_out`;
  - removed `Refresh*DefinitionCatalog`.
- `prototype/shared/token-usage-fixture.js`: `contextCompactionThresholdTokens`, `revision`.
- `utils/apolloClient.ts`:
  - `ReloadAgentPackageDefinitions` is answered locally;
  - answers arrive on a later task.
- `plugins/00.prototype-state.client.ts`:
  - `taskWorkerTasks`, `taskLocator` and `definitionProblems` run as
    source-loaded stores;
  - replaced async actions answer after 40 ms;
  - the primary-navigation height is seeded only where the left panel is docked
    (a narrow drawer measures itself, as in the source).
- `prototype/fixtures/`: 77 snapshots re-captured at the pin from the source
  running on the synthetic node; `runtime-state.json` rebuilt
  (`sourceCommit` `73f7432`).
- Tests and scripts:
  - `fixture-contract.test.ts`: pin, 77 snapshots, new scenarios, Task-worker
    and definition fixtures.
  - `dump-source-state.mjs` and `validate-web-baseline-refresh.mjs`:
    `definition_issues` and `agy_signed_out` rows.
  - `validate-web-baseline-refresh-independent.mjs`: IND-012 follows the
    accepted add flow; IND-025–032 added.
  - New: `probe-refresh-009.mjs`, `check-delegated-copy-example.mjs`.
- Docs: `README.md`, `mock-boundaries.md`, `ui-reference-runbook.md`.

### Mock data

- Origin:
  - Every new value is invented and hand-written in `fixtures.mjs`.
  - Snapshots are captured only from the pinned source running on that
    synthetic node. A capture taken while the source failed to resolve
    `@autobyteus/application-sdk-contracts` was discarded and re-taken (77
    clean captures, none with an error page).
- Checked:
  - `fixture-contract.test.ts` (16 tests): no secret-like strings, local-only
    node URLs, every Task-worker and definition state.
  - The `agy_signed_out` reason is product recovery wording of the same kind as
    the server's fixed text. It is not node or customer output.
- Independence and repeatability: no live service is used, and a reload resets
  every in-memory change.

## Validation

Every paired run used headless Chrome 154 with the same viewport, locale, UTC
timezone, light theme, reduced motion and synthetic data, external requests
blocked, and design-only data off. A row passes only if all of these hold:

- visible text and route are identical;
- the element probe (where present) is identical;
- the screenshot differs at most by edge anti-aliasing or compositing rounding;
- the baseline shows no browser error and makes no non-local request.

Evidence root:
`/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-009/evidence/WEB-BASELINE-REFRESH-009/`.

- **New paired flows** (`probe-refresh-009.mjs`, `flows/`): 56/56 pass.
  - Results files: `flow-results-final.json` 45/45 (37 pixel-identical, 8 edge
    anti-aliasing only), `-skn.json` 8/8 and `-rsn.json` 3/3.
  - The element probe compares on both sides:
    - Task summaries and located cards;
    - strip items and their `aria-current`;
    - the dialog, its rows and focus;
    - load-issue badges and notices;
    - delegated launch rows, sources and fallbacks, and member notes;
    - compaction marker, label and note;
    - runtime reason rows;
    - send-button state.
  - RSN-001–005 cover the heading-switcher path, which does not seed members (in
    the source too). RSN-006–008 cover the catalog **Run** path, which does.
- **Route and state matrix** (`matrix/`): 105 rows (57 routes in the primary
  configuration, sampled narrow and zh-CN rows, 20 state rows including the new
  S019–S023).
  - The final dev-server run passed 103/105, 79 of them pixel-identical.
  - Both remaining rows have no visible difference:
    - **WBR-S012** (error scenario) is text- and pixel-identical. Its only
      baseline browser message is "Failed to reload AGENT definition
      problems: Synthetic recoverable GraphQL failure". The source logs the
      same line itself (`loadedListReloader.ts`), because the definition
      problems store now runs the source's own code. It is a console log, not
      a UI difference.
    - **WBR-S015** (`/mobile?unsupported=desktopSettings`) is text- and
      pixel-identical. In Nuxt dev mode the baseline loads
      `layouts/default.vue`'s global `html, body, #__nuxt { height: 100% }` on
      this page, which has no layout, so the page root measures 844 px instead
      of 918 px. The same artifact was recorded in REFRESH-008. Against the
      built preview it passes, together with S013, S014 and S016
      (`matrix-s015-built-preview/`, 4/4).
  - An earlier full run (before the busy-state timing and nav-height fixes)
    passed 104/105 (`logs/matrix3.log`).
- **Regression flows re-run against the new pin:**
  - Chat, composer, run, Background Tasks, compaction (`chat-flows/`): 53/53.
  - Workspace runs, Org/Team runs, catalog Run (`flows-002/`): 13/13.
  - Projects/Tasks authoring, mentions, task rows, run config (`flows-004/`): 47/47.
  - Projects tab, Task roots, run settings, Draft rows, desktop host, mentions
    (`flows-008/`): 41/41. PRJ-006/012/013 and TSK-011 no longer differ: the
    Chat-row highlight and the strip icon are now the source's own.
  - Browse mode and Token tab (`flows-006/`): BRW-001–003 and TOK-001–005 pass
    8/8. SKS-002–014 are retired; SKN replaces them (see Reconciliation).
  - Cancelled status (`cancelled-status/`): 38/38. CAN-070/071 needed the
    design-only hide of the strip icon removed, because the icon is now the
    source's own (`flow-results-narrow-recheck.json`).
- **Design-only layers** (baseline only, design-only data on):
  - Reconnect 7/7;
  - delegated-copy example 4/4;
  - skill-sources example 20/20;
  - all with no browser error and no non-local request.
- **Independent run** (`independent-preview/`, built preview on `:4621`, source
  and observation node stopped): IND-001–032 pass 32/32, with zero browser
  errors and zero non-local requests; only the preview port was listening.
  - IND-025–032 are new: Task summary locate, definition issues, Reload, skill
    source add, signed-out Antigravity, member defaults, delegated launches,
    compaction marker.
- **Checks, all passing:**
  - `vue-tsc --noEmit -p tsconfig.prototype.json`: exit 0
  - `pnpm lint`: exit 0
  - `pnpm test`: 3 files, 16 tests
  - `validate:boundaries`: 13/13
  - `pnpm build`: exit 0
- Evidence folder: 64 MB.
- Viewports 1440×900 and 390×844; locales en and zh-CN (sampled).

## Known Gaps And Next Action

- **Simulated, not compared:**
  - Live updates from `/ws/projects` and `/ws/agent-package-definitions`
    (the feeds are silent).
  - A live compaction on a run stream (the note is compared through the store).
  - The Team/Org launch outcome, carried over from earlier refreshes.
- **Carried over, unchanged:** the legacy `workspace_*`/`mobile_*` scenario
  injector rows, MOB-001–014 and the older desktop-host rows were not re-run.
- **Non-visible, recorded:**
  - WBR-S012: the source's own console log in the error scenario.
  - WBR-S015: a Nuxt dev-mode layout-CSS artifact; it passes on the built
    preview.
- **Timing:** local answers and replaced store actions now take a later task or
  40 ms, so the source's busy states render and focus moves as in the source.
  This is modelled timing, not measured node latency.
- **Remaining UI parity differences inside the verified scope:** none.
- **Recommended next action for `product_ui_ux_designer`:** accept, commit on
  `design/web-baseline-refresh-009`, integrate into `personal`, then reconcile
  `task-keys-and-dependencies` (round 1 at `6d071fd`) onto the refreshed
  baseline.
