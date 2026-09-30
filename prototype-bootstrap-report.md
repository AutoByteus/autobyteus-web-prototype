# Prototype Bootstrap Report

Refresh of the AutoByteus Web current-experience baseline to
`origin/personal@57df63f`, for Product ticket `WEB-BASELINE-REFRESH-002`
(stable package `chat-composer-menus-open-upward`; this refresh is its
prerequisite). The previous report (`WEB-BASELINE-REFRESH-001`, pin `fcd3e83`)
is preserved in Git history at accepted base `ef5f909`.

## Status

- Status: `Completed`
- Request type: `Refresh`
- Result: the prototype mirrors `origin/personal@57df63f` and runs on its own
  in a browser with synthetic data. The shipped Chat surface replaced the
  prototype-only `chat-interface-entry` implementation.
  - Every changed surface passes its paired source/prototype check:
    - Chat entry, composer menus, thinking, `/` skills, `@` targets, send,
      chat run view, run settings, and reopening a chat from the tree;
    - skill-scope chips, the D-19 skill-name banner, the temp-workspace launch
      default, and the right tool shell.
  - Unchanged surfaces got one load-and-look pass through the route matrix.
- Next expected action: Product Prototyper reviews and accepts the candidate,
  creates the accepted commit on `prototype/web-baseline-refresh-002`, and
  integrates it into `personal`. `chat-composer-menus-open-upward` then merges
  the refreshed `personal` and resumes.

## Source Identity

- Source project: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend: `autobyteus-web`
- Governing authority: `origin/personal` (explicit constraint from Product Prototyper)
- Pinned revision: `57df63f079363ccab4f2301213f9d8a3458f72fa`
  - Fetched on 2026-09-30. Source `HEAD` and `origin/personal` both equal the pin.
  - `autobyteus-web` and the contract packages are clean.
- Previous primary pin: `fcd3e83a4ca931ba52ed19bd37b8df3050ee529e`
- Instructions read: `autobyteus-web/AGENTS.md` at the pin. Its only change
  since `fcd3e83` is a link to the workspace `TESTING.md`. The source tree was
  not modified.
- Source observation:
  - An exact `git archive` export of the pin at
    `/tmp/autobyteus-prototype-WEB-BASELINE-REFRESH-002/source-export/autobyteus-web`,
    with its `node_modules` symlinked read-only to the source install.
  - Served with
    `BACKEND_NODE_BASE_URL=http://127.0.0.1:4391 ENABLE_APPLICATIONS=true nuxt dev --host 127.0.0.1 --port 4291`.
  - Backed by the synthetic observation node:
    `PROTOTYPE_MOCK_PORT=4391 node prototype/source-observation/mock-node.mjs`.

## Prototype Identity

- Prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`
- Product ticket: `WEB-BASELINE-REFRESH-002`
- Ticket branch: `prototype/web-baseline-refresh-002`
- Target worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/WEB-BASELINE-REFRESH-002`
- Accepted base: `ef5f90998a12dd42c52b422de3ea0634f0e2e887` (worktree `HEAD`
  `57b7431` is the Product ticket-open commit on top of it)
- Bootstrap candidate: uncommitted working-tree changes on the ticket branch.
  The Bootstrapper created no commit.
  - `pnpm-lock.yaml` is unchanged.
  - The canonical checkout and the `chat-composer-menus-open-upward` worktree
    were not touched.
- Install: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start: `corepack pnpm dev --port 4199`
- Review URLs:
  - `http://127.0.0.1:4199/chat` (the app now lands on Chat)
  - `http://127.0.0.1:4199/workspace`
- Bootstrapper ports: prototype `4199`, built preview `4198`, source `4291`,
  observation node `4391`. Earlier checks briefly used `4292`/`4392`.
- Stack: Nuxt 3, Vue 3, TypeScript, Pinia, Tailwind (unchanged)
- Scenario selection and reset:
  - Set `localStorage['autobyteus.prototype.scenario']` to `populated`
    (default), `empty`, `apps_disabled`, `projects_disabled`, `loading`,
    `error`, `permission_denied` or the new `skill_name_issues`.
  - Set the context key `autobyteus.prototype.context` to `desktop`,
    `paired`, `unpaired`, `electron_internal` or `electron_external`.
  - Reload, or open a fresh browser context, to reset.

## What Changed In The Refresh

Work followed the source diff `fcd3e83..57df63f`: 389 `autobyteus-web` files
changed, of which 218 are outside tests.

- **Presentation synced to the pin:**
  - 107 retained files updated, 46 new source files added, and 16 files the
    source deleted were removed.
  - Every synced path was byte-verified against the pin.
  - `README.md` and `package.json` keep their prototype versions; the source
    only changed its version and e2e scripts.
  - No source plugin changed.
- **Vendored contracts:** `collaboration-stream-contracts` and
  `team-stream-contracts` were updated to the pin (`src/` and `dist/`). They
  drop `schemaVersion`/`schema_version` and `task_records`, and delegated-task
  records become `TASK_EXECUTION_STARTED`.
- **New surfaces now present:**
  - Chat entry (`/chat`, landing route) with its composer menus: workspace
    with search and "Open another folder…", model with runtime drill-in and
    search, schema-driven thinking single list, `/` skill menu and chips,
    `@` agent/team targets, and the Auto-approve/Ask first toggle.
  - Chat first send → chat run view (`/chat?id=…`) in the workspace frame, with:
    - header ⚙ run settings and ＋ New chat;
    - the right tool shell (`WorkspaceToolShell`);
    - the run composer with `/`.
  - Chat nav New chat pencil, and ＋ on a tree agent row.
  - Agent skill scope ("All installed skills" chip, editor, detail).
  - D-19 skill-name banner, conflict dialog and notices.
  - Composer primary action and voice buttons, and delegated Team row collapse.
  - Temp workspace preselected in launch forms; toasts above dialogs.
- **Removed by the source:** the delegated-task navigator and detail panes
  (`TeamDelegatedTask*`, `CollaborationDelegatedTasksSection`,
  `CollaborationTaskHeading`, `TeamTaskReferenceViewer`) and their services.
- **Accepted prototype changes:** superseded by the source.
  - The source now ships its own Chat (`codex/chat-interface-entry` merged,
    plus `chat-composer-polish`). Per the rule, the source version wins for
    all of `chat-interface-entry` PC-001–PC-047.
  - Removed as prototype-only implementation:
    - `components/chat/Chat{AutoApproveToggle,ContextFilesArea,EffortPicker,Glyph,ModelPicker,RunSettingsPanel,RuntimeBadge,WorkspacePicker}.vue`;
    - `composables/chat/{chatTreeProjection,useChatPopover,usePrototypeChat}.ts`;
    - `prototype/chat/chat-fixtures.ts`;
    - the plugin's `+40px` primary-nav tweak (PC-003). The source snapshots
      now include the Chat row, so the split is 300px.
  - Replaced by the source file of the same name: `ChatComposer.vue`,
    `pages/chat.vue`, `pages/index.vue`, `AppLeftPanel.vue`,
    `WorkspaceAdaptiveLayout.vue`, `WorkspaceAgentRunsTreePanel.vue`,
    `useShellPrimaryNavigation.ts`, `layouts/default.vue`, and shell locale
    files.
  - Preserved prototype-only changes: none.
  - Left illustrative: none.
  - Known drift the ticket named is now source-exact:
    - New-chat vertical bias (`pb-[6vh]`): route rows WBR-R049 and WBR-R001.
    - Workspace menu search: CHT-002.
    - Thinking single list: CHT-008 and CHT-009.
  - The historical `chat-interface-entry` scripts
    (`capture-chat-interface-entry-final.mjs`,
    `validate-chat-interface-entry.mjs`, `chat-review-shot.mjs`) target the
    removed implementation. They were kept as history and not re-run. One unused
    function was deleted so `pnpm lint` passes.
  - **Product Prototyper should confirm these supersessions.**

## Implementation Simplifications

| Visible capability | Prototype simulation | Absent |
| --- | --- | --- |
| Catalog, settings and page data | Pinia snapshots re-captured from the pinned source: 66 snapshots, including `/chat` and `skill_name_issues` `/skills` | GraphQL server |
| Direct source reads (open run, resume config, model options, skill-name issues, Org references, history) | `utils/apolloClient.ts` answers queries locally from the observation fixtures | Apollo, network |
| Chat first send | The source's `launchAgentChat` → `sendUserInputAndSubscribe` run as-is. `PrepareAgentRun` is answered locally (`run-prepared-fixture`), and the stream is the local `PrototypeWebSocket` | Run preparation, model inference, agent stream |
| Chat run settings (Edit Config) | The source's `existingRunConfig.loadAgentCanonical`/`loadTeamCanonical`/`refreshModelOptions` run against local reads | Run config service |
| Skill-name checks (D-19) | The source's `skillNames.fetchIssues`/`runWithSkillNameChecks` run. The wrapped import action stays stubbed | Skill catalog server |
| Team launch, desktop host, streams | Unchanged from the previous refresh | Scheduler, Electron, stream servers |

Interceptor changes in `plugins/00.prototype-state.client.ts`:

- The new enumerated source-run actions listed above.
- After a chat send, route snapshots are no longer re-applied to the
  run-owning stores. The run stays in the Workspaces tree across navigation,
  as in the single-page source.
- `/chat?id=…` routes do not re-apply a snapshot on navigation.
- Live file-explorer Maps (`workspace` sessions, `fileExplorer` trees) survive
  a route re-patch. Before this, the launch-form Files tab lost the temp
  workspace tree.

Observation fixtures (`prototype/source-observation/fixtures.mjs`) gained
synthetic data the new surfaces need:

- the built-in Daily Assistant (`ALL_INSTALLED` skills);
- the built-in temp workspace;
- a `mock/reasoning-prototype` model with a thinking switch and effort levels;
- explicit `CONFIGURED` skill scope for the two existing agents;
- the `skill_name_issues` scenario;
- a successful `PrepareAgentRun`;
- a run-aware agent resume config with `modelConfigEditability`;
- the contract-shape updates.

The new `prototype/scripts/build-icon-collections.mjs`
(`pnpm fixtures:icons`) added 5 icons to the offline bundle, including
`shield-check`, `light-bulb` and `folder-plus`.

## Validation Evidence

All paired runs used headless Chrome with the same viewport, locale, UTC
timezone, light theme and reduced motion, identical synthetic data, and
external requests blocked. Evidence root:
`/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/WEB-BASELINE-REFRESH-002/evidence/WEB-BASELINE-REFRESH-002/`.

- **Route and state matrix (`validate:web-baseline-refresh`)**
  - Scope: 86 rows.
    - All 49 routes on desktop English. `/chat` is new as WBR-R049.
    - 20 sampled narrow/zh-CN rows.
    - 17 state rows. WBR-S017 (`skill_name_issues`) is new.
  - Results: 85 pass. 62 are pixel-identical. 23 are edge anti-aliasing and 1
    is compositing rounding, each with identical text, controls, DOM geometry
    and styles.
  - WBR-S015 (`/mobile?unsupported=desktopSettings`, narrow) shows no
    perceptible difference:
    - The viewport, full-page and scrolled screenshots are byte-identical.
    - Scroll is identical.
    - Only the `html`/`body` box height differs (844 vs 918px). The
      prototype's Nuxt 3.21.11 dev renderer preloads the default layout's
      global `height: 100%` stylesheet; the source runs 3.21.1.
    - Recorded in `matrix/s015-height-note/`.
  - Evidence: `matrix/`
- **Changed-surface Chat flows (`validate:chat-baseline-refresh-flows`)**
  - Results: 30/30 pass, all pixel-identical. The 2 narrow bottom-sheet rows
    also pass (`flow-results-narrow.json`).
  - Evidence: `chat-flows/`
  - CHT-001–006, 021: workspace menu, search, existing workspace, and "Open
    another folder…" relative-path validation; model menu, search, and
    runtime drill-in.
  - CHT-007–009: choose the thinking model, open the thinking menu, choose High.
  - CHT-010–016: approval toggle, `/` menu and chip, `@` menu, address a team
    or agent, and typing.
  - CHT-017, 022–029: send → chat run view; Edit Config; header ＋; reply;
    Files tab; collapse tool shell; reopen from the tree after leaving; ＋ on
    the Daily Assistant tree row; `/` in the run composer.
  - CHT-018–020: Chat nav, collapse left panel, New chat pencil.
  - SKL-001: D-19 banner Show details.
  - CHT-030–031: model and workspace menus as narrow bottom sheets.
- **Workspace and catalog flows (`validate:web-baseline-refresh-flows`)**
  - Results: FLW-001–015 pass 15/15 (12 pixel-identical, 3 anti-aliasing only).
  - FLW-013/014 were updated because the source now preselects the temp
    workspace and lists Daily Assistant (no default model) first.
  - FLW-014's route carries a `Date.now()` draft id. The probes compare it by
    shape; see `flow-results-flw014-recheck.json`.
  - Evidence: `flows/`
- **Desktop-host rows**
  - Scope: HOST-001–008 and STATE-009–013.
  - Results: 12/13 pass under the older script's strict rule.
  - HOST-006 (Extensions, external window) differs by 1 pixel with a channel
    delta of 6 and identical semantics. That is anti-aliasing noise under the
    matrix rule.
  - Evidence: `host/`
- **Independent run**
  - Command: `PORT=4198 node .output/server/index.mjs` with the source and
    observation node stopped.
  - Checked: Chat; model → thinking menu; send → chat run view; Workspace Team
    run; D-19 banner; Agents.
  - Result: zero browser errors and zero non-local requests.
  - Evidence: `independent-preview/`
- **Checks:** all pass.
  - `pnpm typecheck` passes, with the usual duplicate auto-import warnings.
  - `pnpm lint`
  - `pnpm test`: 3 files, 12 tests.
  - `pnpm validate:boundaries`: 13/13.
  - `pnpm build`

## Known Gaps And Next Action

- **Not re-run or not refreshed:** carried over from `WEB-BASELINE-REFRESH-001`
  and unchanged by this refresh.
  - The legacy rich-state injector `apply-experience-scenario.js`
    (`workspace_*`/`mobile_*` streaming, error and interrupted states).
  - Paired-mobile work tabs MOB-001–014.
  - Historical review scripts and URLs.
  - Streaming or completed chat replies are not simulated. The synthetic
    stream stays silent, so a sent chat shows the user message with status
    Offline, identically in source and prototype. If
    `chat-composer-menus-open-upward` needs reply states, add them as focused
    fixtures in that ticket.
- **Fixture notes:** the populated catalog now has 3 agents, 2 workspaces
  (including Temp Workspace) and 2 models. Every compared screen used the same
  values in the source.
- **Perceptible or behavioral differences remaining inside the verified
  scope:** none.
- **Recommended next action for `product_prototyper`:**
  - Accept and commit the candidate; the evidence folder is 20 MB.
  - Confirm the `chat-interface-entry` supersession.
  - Integrate into `personal`, then resume `chat-composer-menus-open-upward`
    on the refreshed base. The Chat composer menus open downward/anchored
    today; see CHT-001, CHT-005 and CHT-008.
