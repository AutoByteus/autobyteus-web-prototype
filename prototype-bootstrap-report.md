# Prototype Bootstrap Report

Refresh of the AutoByteus Web current-experience baseline to
`origin/personal@e9aa4a7` (v1.4.92-beta.3), for Product ticket
`WEB-BASELINE-REFRESH-003` (stable package `cross-scope-agent-mentions`; this
refresh is its prerequisite). The previous report (`WEB-BASELINE-REFRESH-002`,
pin `57df63f`) is preserved in Git history at accepted base `df1377c`.

## Status

- Status: `Completed`
- Request type: `Refresh`
- Result: the prototype mirrors `origin/personal@e9aa4a7` and runs on its own
  in a browser with synthetic data.
  - The Activity tab shows the source's **Background Tasks** section; the
    To-Do list is gone.
  - The Chat composer menus are the source's shipped upward-opening version.
  - Every changed surface passes its paired source/prototype check, and the
    unchanged surfaces passed one load-and-look pass through the route matrix.
- One finding outside this refresh, for Product Prototyper to decide on: the
  legacy `workspace_*` scenario injector is already broken at the accepted
  base. See "Known Gaps And Next Action".
- Next expected action: Product Prototyper reviews and accepts the candidate,
  creates the accepted commit on `prototype/web-baseline-refresh-003`, and
  integrates it into `personal`. `cross-scope-agent-mentions` then merges the
  refreshed `personal` and revalidates.

## Source Identity

- Source project: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend: `autobyteus-web`
- Governing authority: `origin/personal` (explicitly selected by the user)
- Pinned revision: `e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71`
  - `origin/personal` equals the pin on 2026-09-30.
  - The source checkout's `HEAD` is `cbf9ac9`, one commit behind the pin. The
    only difference is the version string in `autobyteus-web/package.json`.
    The checkout was not used for observation and was not modified.
- Previous primary pin: `57df63f079363ccab4f2301213f9d8a3458f72fa`
- Source observation:
  - An exact `git archive` export of the pin at
    `/tmp/autobyteus-prototype-WEB-BASELINE-REFRESH-003/source-export/autobyteus-web`,
    with its `node_modules` symlinked read-only to the source install. The
    linked contract packages in the checkout are byte-identical to the pin.
  - Served with
    `BACKEND_NODE_BASE_URL=http://127.0.0.1:4396 ENABLE_APPLICATIONS=true nuxt dev --host 127.0.0.1 --port 4296`.
  - Backed by the synthetic observation node:
    `PROTOTYPE_MOCK_PORT=4396 node prototype/source-observation/mock-node.mjs`.

## Prototype Identity

- Prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`
- Product ticket: `WEB-BASELINE-REFRESH-003`
- Ticket branch: `prototype/web-baseline-refresh-003`
- Target worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/WEB-BASELINE-REFRESH-003`
- Accepted base: `df1377c4dde63c67fb5548f63e03c90c6b685d85` (worktree `HEAD`
  `96831d5` is the Product ticket-open commit on top of it)
- Bootstrap candidate: uncommitted working-tree changes on the ticket branch.
  The Bootstrapper created no commit.
  - `pnpm-lock.yaml` and `package.json` are unchanged.
  - The canonical checkout (still `df1377c`, clean) and the
    `cross-scope-agent-mentions` worktree were not touched.
- Install: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start: `corepack pnpm dev --port 4196`
- Review URLs (no server is left running; start it with the command above):
  - `http://127.0.0.1:4196/chat`
  - `http://127.0.0.1:4196/workspace`
- Bootstrapper ports: prototype `4196`, built preview `4195`, source `4296`,
  observation node `4396`. All are released.
- Stack: Nuxt 3, Vue 3, TypeScript, Pinia, Tailwind (unchanged)
- Scenario selection and reset: unchanged from `WEB-BASELINE-REFRESH-002`.
  Set `localStorage['autobyteus.prototype.scenario']` and
  `autobyteus.prototype.context`, then reload or open a fresh browser context.

## What Changed In The Refresh

Work followed the source diff `57df63f..e9aa4a7`: 14 commits, 52
`autobyteus-web` files, of which 29 are outside tests and docs.

- **Presentation synced to the pin:**
  - 20 retained files updated, 4 new source files added, and the 4 files the
    source deleted were removed.
  - After the sync, every prototype file that also exists in the source is
    byte-identical to the pin, except the known prototype-owned files
    (`README.md`, `package.json`, `nuxt.config.ts`, `tsconfig.json`,
    `.gitignore`, `utils/apolloClient.ts`).
  - `package.json` keeps its prototype version; the source only changed its
    version and e2e scripts.
- **Vendored contracts:** `agent-presentation-contracts` and
  `team-stream-contracts` were updated to the pin (`src/` and `dist/`). They
  replace the to-do message with `BACKGROUND_TASK_UPDATED`. All four vendored
  packages match the pin.
- **Added by the source:** the Background Tasks section of the Activity tab
  (`BackgroundTaskPanel.vue`, `agentBackgroundTaskStore.ts`,
  `backgroundTaskHandler.ts`, `types/backgroundTask.ts`) with English and
  zh-CN strings.
  - It sits above Activity, collapsed by default, with a
    "N running · N total" count.
  - Each task shows a status icon and chip (Running, Completed, Failed,
    Stopped), a kind label, and a finished task's summary that expands on click.
  - An untitled task shows "Background task".
- **Removed by the source:** the To-Do list (`TodoListPanel.vue`,
  `agentTodoStore.ts`, `todoHandler.ts`, `types/todo.ts`), its strings, and
  the right panel's automatic switch to Activity when to-dos arrived.
- **Changed by the source:** the new-chat composer menus open upward
  (`useAnchoredPopover.ts` and the Chat menu components).
- **Accepted prototype changes:**
  - Superseded by the source: `chat-composer-menus-open-upward`. The source
    shipped its own version (`codex/chat-composer-menus-open-upward`), so the
    source files replaced the prototype's in `ChatMessageInput.vue`,
    `ChatModelMenu.vue`, `ChatSkillMenu.vue`, `ChatTargetMenu.vue` and
    `useAnchoredPopover.ts`. The differences were code structure, comments and
    class order; `ChatNewSurface.vue`, `ChatThinkingControl.vue` and
    `ChatWorkspaceMenu.vue` already matched the pin.
  - Preserved prototype-only changes: none.
  - Left illustrative: none.
  - The historical `validate-chat-composer-menus-open-upward.mjs` script was
    kept as history and not re-run.
  - **Product Prototyper should confirm this supersession.**

## Implementation Simplifications

| Visible capability | Prototype simulation | Absent |
| --- | --- | --- |
| Background Tasks (Activity tab) | The source's own store and panel. The store is live-only in the source (one upsert per stream message), so `upsertTask` runs locally in the prototype | Agent stream, runtime task reporting |
| Catalog, settings and page data | Pinia snapshots re-captured from the pinned source: 66 snapshots | GraphQL server |
| Everything else | Unchanged from `WEB-BASELINE-REFRESH-002` | — |

Prototype-owned changes:

- `plugins/00.prototype-state.client.ts`: `agentTodo` replaced by
  `agentBackgroundTask` (`upsertTask`) in the local-action and run-owned store
  lists.
- `prototype/shared/apply-experience-scenario.js`: the to-do seeding was
  replaced by four synthetic background tasks. This path was not exercised
  successfully; see the legacy-scenario finding below.
- `prototype/fixtures/`: snapshots re-captured and `runtime-state.json`
  rebuilt at the new pin. Against the previous capture they differ only by the
  removed `agentTodo` store, observation port numbers inside synthetic URLs,
  and timestamps.
- `pnpm fixtures:icons` added `heroicons:stop-circle-solid` to the offline
  icon bundle.
- `prototype/scripts/probe-chat-flows.mjs` gained the `BGT-*` rows and a
  per-flow locale; `validate-web-baseline-refresh-independent.mjs` takes its
  port from `BASE` and gained `IND-007`.
- `README.md`, `prototype-scenarios.md` and `mock-boundaries.md` name the new
  pin and Background Tasks.

## Validation Evidence

All paired runs used headless Chrome 154 with the same viewport, locale, UTC
timezone, light theme and reduced motion, identical synthetic data, and
external requests blocked. Evidence root:
`/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/WEB-BASELINE-REFRESH-003/evidence/WEB-BASELINE-REFRESH-003/`.

- **Changed-surface flows (`validate:chat-baseline-refresh-flows`)**
  - Results: 41/41 pass, all pixel-identical, with matching text and routes.
  - Evidence: `chat-flows/`
  - Background Tasks (new):
    - BGT-001–002: a chat run's Activity tab shows the collapsed section with
      "0 running · 0 total"; expanding it shows "No background tasks".
    - BGT-003–006: four task snapshots arrive; the collapsed count updates;
      the list shows all four statuses and the untitled fallback; a summary
      expands; the section collapses again.
    - BGT-007: tasks arriving while on the Files tab do not switch tabs.
    - BGT-008–009: the same list for a stored team run's focused member, in
      English and zh-CN.
    - The populated rows upsert the same four synthetic tasks through the
      store in the source and the prototype.
  - Chat composer (changed): CHT-001–031 and SKL-001, including the workspace,
    model, thinking, `/` and `@` menus opening upward and the two narrow
    bottom-sheet rows.
  - An earlier run of this set had 40/41: CHT-003 was pixel- and
    text-identical but logged two 503 console errors in the prototype while
    `pnpm typecheck` was regenerating the dev server's build directory. The
    recorded results are the clean rerun.
- **Workspace and catalog flows (`validate:web-baseline-refresh-flows`)**
  - Results: FLW-001–015 pass 15/15 (12 pixel-identical, 3 anti-aliasing only).
  - Evidence: `flows/`
- **Route and state matrix (`validate:web-baseline-refresh`)** — the
  load-and-look pass for unchanged surfaces.
  - Scope: 86 rows (49 routes on desktop English, 20 sampled narrow/zh-CN
    rows, 17 state rows).
  - Results: 86/86 pass. 61 are pixel-identical; the rest are anti-aliasing or
    compositing noise with identical text and DOM geometry.
  - Evidence: `matrix/`
- **Independent run**
  - Command: `PORT=4195 HOST=127.0.0.1 node .output/server/index.mjs` with the
    source and observation node stopped.
  - Checked: Chat; model → thinking menu; send → chat run view; Workspace Team
    run; D-19 banner; Agents; chat run → expand Background Tasks (empty state).
  - Result: 7/7, zero browser errors and zero non-local requests.
  - Evidence: `independent-preview/`
- **Checks:** all pass.
  - `pnpm typecheck` passes, with the usual duplicate auto-import warnings.
  - `pnpm lint`
  - `pnpm test`: 3 files, 12 tests.
  - `pnpm validate:boundaries`
  - `pnpm build`
- **Not re-run:** the desktop-host rows (HOST-001–008, STATE-009–013). Nothing
  they depend on changed in this diff.

## Known Gaps And Next Action

- **Legacy `workspace_*` scenarios are broken at the accepted base.**
  - Setting the scenario to `workspace_agent_active` and opening `/workspace`
    redirects to `/chat?id=run-prototype-active`, leaves the Workspaces tree
    empty, and can throw `TypeError: Cannot read properties of undefined
    (reading 'trim')` from the tree.
  - The accepted base `df1377c` does the same, with the shell collapsed as
    well. Evidence: `legacy-scenario-note/` holds both screenshots.
  - This comes from `prototype/shared/apply-experience-scenario.js`, which the
    two previous refreshes listed as "not re-run or not refreshed". It has no
    source equivalent and is outside this refresh's diff, so it was not fixed.
  - Consequence for this refresh: the background-task seeding added to that
    injector is unverified, and the scenario shows an empty Background Tasks
    section.
- **No selectable populated Background Tasks scenario.** The populated state
  is reached only by upserting tasks into the store, as the `BGT-*` rows do. If
  `cross-scope-agent-mentions` needs it on screen, add a focused fixture in
  that ticket.
- **Carried over unchanged from `WEB-BASELINE-REFRESH-002`:**
  - Paired-mobile work tabs MOB-001–014 and the historical review scripts and
    URLs were not re-run.
  - Streaming or completed chat replies are not simulated. A sent chat shows
    the user message with status Offline, identically in source and prototype.
- **Perceptible or behavioral differences remaining inside the verified
  scope:** none.
- **Recommended next action for `product_prototyper`:**
  - Accept and commit the candidate; the evidence folder is 19 MB.
  - Confirm the `chat-composer-menus-open-upward` supersession.
  - Decide whether the legacy `workspace_*` scenarios should be repaired or
    retired, as a separate correction.
  - Integrate into `personal`, then merge it into `cross-scope-agent-mentions`
    and revalidate.
