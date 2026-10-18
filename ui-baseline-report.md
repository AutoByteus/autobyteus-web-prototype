# UI Baseline Report

Whole-frontend refresh of the AutoByteus Web current-experience baseline from
`origin/personal@73f7432` to `origin/personal@2f21134` (v1.5.6-beta.1), for Product
ticket `WEB-BASELINE-REFRESH-010`. The previous report (`WEB-BASELINE-REFRESH-009`,
pin `73f7432`) is kept in Git history at accepted base `d96a14f`.

## Status

- Status: `Completed`
- Request type: `Refresh`
- Refresh request: explicit user go-ahead (2026-10-18): "remember… we also need
  to update the UI/UX project for the baseline now". The Product UI/UX Designer
  selected `origin/personal@2f211340ee36b81cef74a74b2e042b5102c269d3` (fetched
  2026-10-18) for the whole selected frontend.
- Refresh policy:
  - Where the source implements a surface the UI reference had changed, the
    source version wins. This applies to Task keys and "depends on"
    (`task-keys-and-dependencies`, `task-keys-off-lists`).
  - Accepted design-only changes with no source equivalent are preserved.
- Result:
  - The baseline mirrors `2f21134` and runs on its own in a browser with
    synthetic data.
  - The shipped Task-key components replace the design-only ones.
  - Reconnect is re-applied onto the source.
  - The design-only example layers stay, adapted to the shipped data shape.
  - Every new or changed surface passed paired source-versus-baseline checks.
  - The approved design checks were re-run. Results and every visible
    difference from the approved references are below; no reference
    screenshot was overwritten.
- Next expected action: Product UI/UX Designer reviews the candidate and decides
  the reference questions below. Then it commits on
  `design/web-baseline-refresh-010` and integrates into `personal`.

## Source Identity

- Source project: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend: `autobyteus-web`
- Source root: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Governing authority: `origin/personal`, fetched 2026-10-18; equal to the pin.
- Pinned revision: `2f211340ee36b81cef74a74b2e042b5102c269d3`
- Previous pin: `73f743211c8b86c704acb33f216154e42b7a67b8`
- The source checkout was neither used for observation nor modified. Nothing
  was pulled.
- Applicable instructions: superrepo `AGENTS.md` (`DESIGN.md`, `TESTING.md`,
  `RELEASE.md`; nothing is merged, tagged or released here), the design
  repository `README.md`, and `ui-reference-runbook.md`.
- Source observation:
  - Exact `git archive` export of the pin at `/tmp/r010/src/` (`autobyteus-web`
    and the four contract packages).
  - `node_modules` links the source install read-only. Three contract packages
    link the exported pin.
  - `application-sdk-contracts` links the worktree's vendored build (its `src/`
    is unchanged in the range).
  - Served with `BACKEND_NODE_BASE_URL=http://127.0.0.1:4623 ENABLE_APPLICATIONS=true nuxt dev --host 127.0.0.1 --port 4622`.
  - Backed by `PROTOTYPE_MOCK_PORT=4623 node prototype/source-observation/mock-node.mjs`
    (synthetic fixtures only).

## Baseline & Repository Identity

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Product ticket: `WEB-BASELINE-REFRESH-010`
- Ticket branch: `design/web-baseline-refresh-010`
- Target worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-010`
- Accepted design base: `d96a14f`. Worktree `HEAD` `9a77130` is the Product
  ticket-open commit.
- Bootstrap candidate: uncommitted working-tree changes; the Bootstrapper made
  no commit. `package.json` and `pnpm-lock.yaml` are unchanged, because the
  source's dependencies did not change.
- Install: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start: `corepack pnpm dev --port 4620`
- Review: `http://127.0.0.1:4620/workspace` (see `ui-reference-runbook.md`).
- Built preview: `corepack pnpm build && PORT=4621 HOST=127.0.0.1 node .output/server/index.mjs`
- Ports used: `4620`–`4623` only (3210 not used). All are released.
- Scenario selection:
  - The existing keys are unchanged.
  - New scenario: `live_runs`.
  - Comparison scripts set `autobyteus.prototype.designOnlyLayers=off`.

## What Changed In The Refresh

Work followed the source diff `73f7432..2f21134`: 563 commits and 318 changed
files under `autobyteus-web`, of which 158 are non-test UI files.

| Commits | Surface | Change |
| --- | --- | --- |
| task-keys work, `29ca564` | Projects board, Task page, Edit/New task, tab Task view | Task keys (`<prefix>-<n>`, the Task page URL ID; a long-ID URL is replaced by the key URL). "Depends on":<br>• board badges: "Blocked by <key> +N" and "Dependency cancelled: <key>", with a tooltip listing every dependency;<br>• the Dependencies section: Depends on, Required by and the "Only informs" note;<br>• the key chip with Copy;<br>• the picker: search, Enter, Remove, and a loop greyed "Depends on this Task".<br>Keys show only where they link or refer to a Task. |
| `5dd930d`, `290d32d` | Workspaces tree, Settings, `@` | Collaborators removed: a run's only children are its delegated copies; `@` is mention-only. |
| `065430d` | Workspaces tree | Teams are flat (no Team inside a Team). |
| `b9cbb74`, `e3d1bfc` | Workspaces tree | Delegated Teams under an Agent run start collapsed. |
| `d1a66fe` | Workspaces tree | Universal Team status dot on every Team row (busy > error > idle > offline). |
| `0ac4e4b`, `3126536`, `0fb29b6`, `cd685b6` | Run Settings | Delegated copies section (collapsible copy rows with badge, source label and fallback notes). A stopped copy's model can be changed and saved. A running copy has a red Stop and a locked model ("Stop this copy to change its model."). Member defaults are also seeded on switcher starts. |
| `3126536`, `14f9b3c`, `61e20a0` | Workspaces tree | Red Stop on a running delegated copy's row. |
| `28fdf1d` | Conversation | Platform skill update notice labelled "Skill updated". |
| `cd28a00`, `5fe746a` | Token Meter | Per-call TPS card ("—" without a measured call; value, model, end-to-end qualifier, help). |
| `c57ab71` | Nodes | NFS Guide tab. |
| `151c813` | Team detail | Members right after the description. |
| `1262714`, `50f25f6`, `a3f65bf`, `47f74a7` | Layout, File Explorer, definitions | Right-panel width for prospective docks; File Explorer keeps unsaved drafts while a Save is pending; definition mutation fields. |

### Implementation sync

- **Synced to the pin:**
  - 117 changed files that were still identical to the previous pin were taken
    as they are;
  - 11 files were added and 1 removed (`RunDelegatedLaunchList.vue`);
  - 17 design-changed or design-only Task-key files were replaced by the
    source's.
- **3-way merged:** seven Reconnect files (base `73f7432`, ours the worktree,
  theirs `2f21134`), with three conflicts resolved by hand. The stable and
  transient tree rows render the source's structure when no agent is missing.
- **Audit:** 1034 design files that also exist in the source are byte-identical
  to the pin. The 14 that differ are Reconnect (10) and the design-owned
  `nuxt.config.ts`, `package.json`, `tsconfig.json` and `utils/apolloClient.ts`
  (`evidence/WEB-BASELINE-REFRESH-010/presentation-audit.json`).
- **Vendored contracts:** `src/` and `dist/` were synced to the pin
  (collaborators removed, flat Teams, user launch selections, output
  throughput). The `file:` dependency lines are kept, and the packages were
  reinstalled.

## Refresh Reconciliation

- Pins: `73f7432` → `2f21134`.
- **Accepted design changes superseded by the source version:**
  `task-keys-and-dependencies` and `task-keys-off-lists`. The design versions of
  these were replaced by the source's:
  - `TaskKey.vue`, `TaskKeyChip.vue`, `TaskDependencyBadge.vue`,
    `TaskDependenciesSection.vue`, `TaskDependencyPicker.vue`;
  - `ProjectTaskRow.vue`, `ProjectTaskDetail.vue`, `ProjectsPanelTaskDetail.vue`,
    `ProjectTaskDraftEditor.vue`, `ProjectsPanel.vue`;
  - `useProjectTaskDraft.ts`, `projectTaskStore.ts`,
    `utils/projects/taskDependencies.ts`, `types/project.ts`;
  - the query fields and the `projects` messages.

  The worker store and `TaskWorkerTaskSummary.vue` were already the source's.
  The design layer's own mutation hook (`applyTaskKeyMutation`) was removed: the
  base fixtures store keys and dependencies with the source's rule.
- **Accepted design-only changes preserved:**
  - `agent-definition-reconnect-ui`:
    - re-applied onto the source's run settings (with the new Delegated copies
      section), member rows, tree rows and composer;
    - all 7 of its review scripts pass;
    - its fixture follows the shipped shape: the former collaborator is now
      delegated copies, and the `/post_production` sub-team was removed.
  - Delegated-copy example data: its Tasks carry keys through the shared rule;
    4/4 checks pass.
  - Task-keys example data: the AutoByteus and Customer Onboarding Projects.
  - Skill sources example data.
  - All stay off with `designOnlyLayers=off`.
- **Surfaces where it is hard to tell which policy applies** (recorded for
  Product):
  1. **Reconnect's collaborator case** (`VIS-014`, `VIS-015`). The source
     removed collaborators, so a "collaborator whose agent no longer exists" has
     no product surface any more. I kept Reconnect working on delegated copies at
     the same address (same agent, "· 2 runs"). Product should decide whether
     that case and its references stay.
  2. **Reconnect's `/post_production` sub-team.** It was added for
     `collapsed-left-panel-expand-keeps-run` (a member two levels down). The
     source no longer allows a Team inside a Team, so it was removed.
- **Unchanged surfaces given a load-and-look pass:** the full route and state
  matrix, and the independent-run set.

## Experience Inventory (this refresh)

All rows were checked now with paired runs (`prototype/scripts/probe-refresh-010.mjs`).
Domain values (Task texts, key numbers, names, counts, model names, reasons) are
illustrative synthetic fixtures. UI-controlled text, including template text
around values, is exact.

| ID | Surface / behavior | States / outcomes | Synthetic fixture (illustrative) | Result |
| --- | --- | --- | --- | --- |
| TKY-001–021 | Task keys and "depends on" | <ul><li>board badges (+1, cancelled, all Done: none) and tooltip</li><li>long-ID URL replaced by key URL; key URL in another letter case</li><li>chip and Copy</li><li>Depends on (Done ✓), Required by, informs note; dependency row opens its Task</li><li>picker: list with a greyed loop, search, no match, Enter adds, Remove</li><li>Save; New task Create with the next key and its "Task created." notice</li><li>tab Task view, and a dependency opening inside the tab</li><li>Temp task without key</li><li>390, zh-CN</li></ul> | `prototype-launch-1..5`; dependencies: outline → retire (cancelled), review → publish (Done), translate → review + outline | `Pass` |
| DLG-001–006 | Delegated copies in a stopped run's Settings | collapsed rows with badge and source; agent copy card with skipped-default note; Team copy (settings, members, coordinator); model menu; choose a model (Save bar); Save, after which the row shows the chosen model | stored run's copies, `UpdateDelegatedLaunchSelections` recorded in memory | `Pass` |
| LIV-001–008 | Live stored runs (`live_runs`) | Team status dots (busy Team run, error copy Team, offline stored Team, tooltip); red Stop in the tree (hover, click) and in Settings (locked model hint, Stop) | one synthetic stream snapshot per live run | `Pass` |
| SKU-001 | Conversation | "Skill updated" notice | replayed notice entry | `Pass` |
| TPS-001–004 | Token Meter TPS card | "—"; generation value; help; end-to-end | the report is applied through the source's store | `Pass` |
| NFS-001–002 | Nodes → NFS Guide | desktop, 390 | — | `Pass` |
| NAR-001, ZH-001 | Samples | 390 drawer with live status; zh-CN Delegated copies | — | `Pass` |
| WBR-S024, `/projects/.../prototype-launch-3`, `…/prototype-launch-2/edit` | Matrix rows | live workspace; Task page and edit page by key | — | `Pass` |

## Implementation Simplifications

| Visible capability | Visible experience preserved | Baseline simulation | Absent |
| --- | --- | --- | --- |
| Task keys and dependencies | Keys, badges, Depends on / Required by, picker, saves | Base fixtures: key per Project in creation order, stored `dependsOnTaskIds`, deletes cleaned from dependents; the source's stores and components | Server numbering, change feed |
| Delegated copies' model change | Options, edit, Save, chosen model | `DelegatedLaunchModelOptions`, `UpdateDelegatedLaunchSelections` (in memory) and the source's draft store | Launch resolution, persistence |
| Live runs | Team status, running copy, Stop | `live_runs`: one CONNECTED + snapshot frame pair per live run, from `prototype/source-observation/live-streams.mjs`, played by the node and by the local WebSocket | Status events after the snapshot; a Stop does not take effect |
| TPS | Card states | None in the baseline (no model calls); comparisons apply a report through the source's store | Live model calls |
| Busy states | Disabled controls and focus after them | Local mutations and replaced store actions answer after 40 ms (longer than a frame) | Network |

Baseline-owned changes:

- `prototype/source-observation/fixtures.mjs`:
  - Task keys and dependencies, with create/update/delete handling and
    `ensureTaskKeys` / `taskKeyPrefix`;
  - collaborators removed, and an open copy Team with launch sources;
  - delegated-copy options, selections and Stop;
  - the skill update notice;
  - the stored Agent run made editable;
  - the `live_runs` scenario.
- New `prototype/source-observation/live-streams.mjs`; `mock-node.mjs` plays its
  frames.
- `plugins/00.prototype-state.client.ts`:
  - the local WebSocket plays the same frames;
  - `delegatedLaunchDraft` runs as a source-loaded store;
  - `existingRunConfig` read and reload actions run the source code.
- `utils/apolloClient.ts`: delegated mutations are answered locally, mutations
  after 40 ms, and the task-keys hook was removed.
- Design-only layers adapted: `prototype/task-keys/`, `prototype/agent-reconnect/`,
  and `prototype/delegated-copy-tasks/` (collaborators removed).
- Fixtures: `prototype/fixtures/` — 78 snapshots re-captured at the pin from the
  source on the synthetic node; `runtime-state.json` rebuilt (`sourceCommit`
  `2f21134`).
- Tests and scripts:
  - `fixture-contract.test.ts`: pin, 78 snapshots, `live_runs`, keys, selections;
  - `dump-source-state.mjs`, `validate-web-baseline-refresh.mjs`: `live_runs`
    and the key routes;
  - `validate-web-baseline-refresh-independent.mjs`: IND-033–039;
  - new `probe-refresh-010.mjs`;
  - `probe-refresh-009.mjs`: TSL-006 compared after the highlight;
  - `check-delegated-copy-example.mjs`: the AutoByteus name.
- Docs: `README.md`, `mock-boundaries.md`, `ui-reference-runbook.md`.

### Mock data

- Origin:
  - Every new value is invented and hand-written: keys, dependencies, statuses,
    model choices and the notice text.
  - Snapshots are captured only from the pinned source running on the synthetic
    node.
  - No real source data or content was copied.
- Checked:
  - `fixture-contract.test.ts` (17 tests): secret-like strings, local-only node
    URLs, every state.
  - The skill notice entry uses the product's header with invented skill paths.
- Independence and repeatability: no live service is used, and a reload resets
  every in-memory change.

## Validation

Every paired run used headless Chrome with the same viewport, locale, UTC
timezone, light theme, reduced motion and synthetic data, external requests
blocked, and design-only data off. A row passes only if all of these hold:

- text and route are identical;
- the element probe is identical;
- the screenshot differs at most by edge anti-aliasing or compositing rounding;
- the baseline shows no browser error and makes no non-local request.

Evidence root:
`/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-010/evidence/WEB-BASELINE-REFRESH-010/`.

- **New paired flows** (`probe-refresh-010.mjs`, `flows/`): **44/44 pass.**
  - `flow-results-final.json`: 42/43, 42 pixel-identical.
  - TKY-014 initially compared a frame at the edge of the 3 s "Task created."
    notice. After the fix it compares the settled board, and the new TKY-021
    compares the visible notice. `flow-results-final-recheck.json`: TKY-013,
    TKY-014 and TKY-021 all pass, pixel-identical.
  - The element probe compares on both sides:
    - keys, chips and badges;
    - dependency rows;
    - Team status dots with `data-status`;
    - stop buttons (style and focus);
    - member badges, summaries, notes and hints;
    - the Save bar;
    - the notice label;
    - the throughput card;
    - the NFS card.
- **Route and state matrix** (`matrix/`): 108 rows (59 routes in the primary
  configuration with sampled narrow/zh-CN rows, 21 state rows including the new
  S024 `live_runs`).
  - The dev-server run passed 106/108, 86 of them pixel-identical.
  - **WBR-S012** has no visible difference: the source logs the same "Failed to
    reload AGENT definition problems" line itself (as in REFRESH-009).
  - **WBR-S015** has no visible difference: it is the Nuxt dev-mode layout-CSS
    artifact recorded in REFRESH-009. It passes on the built preview, together
    with S013, S014 and S016 (`matrix-s015-built-preview/`, 4/4).
- **Regression flows re-run against the new pin:**
  - Chat, composer, run, Background Tasks, compaction (`chat-flows/`): 53/53.
  - Workspace runs, Org/Team runs, catalog Run (`flows-002/`): 13/13.
  - Projects/Tasks authoring, mentions, task rows, run config (`flows-004/`): 47/47.
  - Browse mode and Token tab (`flows-006/`, BRW and TOK): 8/8.
  - Projects tab, Task roots, run settings, Draft rows, desktop host, mentions
    (`flows-008/`): 41/41.
  - REFRESH-009 flows (`flows-009/`: Task summaries, strip, skill sources,
    definition issues, member defaults, token meter, Antigravity): 56/56. TSL-006
    now compares the state after the 2.4 s highlight
    (`flow-results-recheck.json`), because opening the run first makes the moment
    of locating latency-dependent on both sides; TSL-002 still compares the
    highlight.
  - Cancelled status (`cancelled-status/`): 38/38.
- **Design-only layers** (baseline only, design-only data on):
  - Reconnect 7/7;
  - delegated-copy example 4/4;
  - task-keys example via the approved check (14/14, below);
  - all with no browser error and no non-local request.
- **Independent run** (`independent-preview/`, built preview on `:4621`, source
  and observation node stopped): IND-001–039 pass 39/39, with zero browser
  errors and zero non-local requests; only the preview port was listening.
  - IND-033–039 are new: Task key page, Depends on picker, delegated copy model
    change, live copy Stop with status dots, skill update notice, TPS card, NFS
    guide.
- **Checks, all passing:**
  - `vue-tsc --noEmit -p tsconfig.prototype.json`: exit 0
  - `pnpm lint`: exit 0
  - `pnpm test`: 3 files, 17 tests
  - `validate:boundaries`: 13/13
  - `pnpm build`: exit 0
- Evidence folder: 77 MB (logs in `logs/`).
- Browser: Google Chrome (headless, playwright-core). Viewports 1440×900 and
  390×844; locales en and zh-CN (sampled).

### Approved design checks (re-run as requested)

The details are in `approved-checks/SUMMARY.md`. No approved reference
screenshot was overwritten.

- **`task-keys-and-dependencies/visual-references/final-validation.mjs`: 14/14
  pass.** Only the Playwright import and the browser path changed; no selector
  needed changing.
  - Re-captured references (`approved-checks/task-keys-and-dependencies/refreshed-captures/`,
    `reference-diff.json`):
    - VIS-002d is identical;
    - VIS-001–009c and 013–015 differ only by icon and corner anti-aliasing;
    - VIS-010–012 show two source changes in the tree: delegated Teams start
      collapsed, and Team rows have the status dot.
- **`delegated-copy-task-locator/visual-references/final-validation.mjs`: 10/13
  pass.** Selectors changed: the source's summary `data-test`, and the source's
  `taskLocator.locate(task, openRun)`.
  - SCN-002 and SCN-008 expect the Project name "Desktop App". The accepted
    task-keys ticket renamed it "AutoByteus" before this refresh; the located
    Task, focus and highlight pass.
  - SCN-011 expects collaborator rows, which the source removed.
  - Reference diffs come from those three causes (collapsed Teams with status
    dots, the renamed example Project with its Tasks, no collaborator rows).
- **Reconnect review scripts: 7/7 pass.** Visible differences from VIS-001–018
  are outside Reconnect:
  - Projects is the first right-panel tab;
  - one more navigation item;
  - Team status dots;
  - Settings list the Delegated copies.

  See the policy question on the collaborator case above.

## Known Gaps And Next Action

- **Simulated, not compared:**
  - Status events after a live run's snapshot. A Stop answers "stopped", but the
    copy stays running in both, because no event follows.
  - A copy resuming on its new model ("continue" needs a live model call).
  - Live TPS readings and the compaction note, which are compared through the
    source's own store.
  - The Team/Org launch outcome, carried over.
- **Not reachable at this pin:** the NFS guide's copy feedback. No release is
  published, so its Copy buttons are disabled in the source.
- **Timing:** local mutations and replaced store actions take 40 ms. This is
  modelled latency, not measured. Flows whose screenshot depends on a timer
  (the 3 s notice, the 2.4 s highlight) compare the settled state, plus one
  capture of the visible state.
- **Carried over, unchanged:** the legacy `workspace_*`/`mobile_*` injector rows
  and the older desktop-host rows were not re-run.
- **Remaining UI parity differences inside the verified scope:** none.
- **Recommended next action for `product_ui_ux_designer`:** decide on the two
  Reconnect questions and on the approved references affected by source changes
  (collapsed delegated Teams, Team status dots, no collaborators). Then accept,
  commit on `design/web-baseline-refresh-010` and integrate into `personal`.
