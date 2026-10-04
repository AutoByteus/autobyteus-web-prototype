# UI Baseline Report

Refresh of the AutoByteus Web current-experience baseline from
`origin/personal@e9aa4a7` to `origin/personal@0a32261` (v1.4.94-beta.3), for
Product ticket `WEB-BASELINE-REFRESH-004`. The previous report
(`WEB-BASELINE-REFRESH-003`, pin `e9aa4a7`) is preserved in Git history at
accepted base `a714bb2`.

## Status

- Status: `Completed`
- Request type: `Refresh`
- Result: the baseline mirrors `origin/personal@0a32261` and runs on its own in
  a browser with synthetic data. Every new or changed surface passed its paired
  source/baseline check, and the unchanged surfaces passed the load-and-look
  route matrix.
- Next expected action: Product UI/UX Designer reviews and accepts the
  candidate, creates the accepted commit on `design/web-baseline-refresh-004`,
  and integrates it into `personal`. `run-settings-ui-unification` is then
  rebuilt on the refreshed `personal` and revalidated.

## Source Identity

- Source project: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend: `autobyteus-web`
- Source root: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Governing authority: `origin/personal` (explicitly selected by the user,
  fetched 2026-10-04 11:04 +0200)
- Pinned revision: `0a32261d681e19491264a03a652ba23d1f8b8248`
  - `origin/personal` was re-fetched at kickoff and still equals the pin.
  - The source checkout's `HEAD` is `63aac59` (behind the pin) and has
    unrelated local changes. It was not used for observation and was not
    modified.
- Previous pin: `e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71`
- Applicable instructions: `autobyteus-web/AGENTS.md`, design repository
  `README.md` and `ui-reference-runbook.md`.
- Source observation:
  - An exact `git archive` export of the pin at
    `/tmp/autobyteus-design-WEB-BASELINE-REFRESH-004/new/autobyteus-web`.
  - Its `node_modules` links the source install read-only, except the four
    `@autobyteus/*` contract packages. Those changed after the checkout's
    `HEAD`, so they link `git archive` exports of the same pin instead
    (`application-sdk-contracts` built from its pinned `src`).
  - Served with
    `BACKEND_NODE_BASE_URL=http://127.0.0.1:4534 ENABLE_APPLICATIONS=true nuxt dev --host 127.0.0.1 --port 4533`.
  - Backed by the synthetic observation node:
    `PROTOTYPE_MOCK_PORT=4534 node prototype/source-observation/mock-node.mjs`.

## Baseline & Repository Identity

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Product ticket: `WEB-BASELINE-REFRESH-004`
- Ticket branch: `design/web-baseline-refresh-004`
- Target worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-004`
- Accepted design base: `a714bb234e0a609c7c704fb09b6562f831febce2`
  (worktree `HEAD` `5ccadcd` is the Product ticket-open commit on top of it)
- Bootstrap candidate: uncommitted working-tree changes on the ticket branch.
  The Bootstrapper created no commit.
  - `package.json` and `pnpm-lock.yaml` are unchanged.
  - The canonical checkout (`personal` at `a714bb2`) and the other ticket
    worktrees were not touched.
- Install: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start: `corepack pnpm dev --port 4531`
- Review URLs (start the server with the command above first):
  - `http://127.0.0.1:4531/chat`
  - `http://127.0.0.1:4531/workspace`
  - `http://127.0.0.1:4531/projects`
- Ports reserved for this ticket: UI reference dev `4531`, built preview
  `4532`, source `4533`, observation node `4534`. See "Validation" for which
  are still running.
- Stack: Nuxt 3, Vue 3, TypeScript, Pinia, Tailwind (unchanged)
- Scenario selection and reset: unchanged. Set
  `localStorage['autobyteus.prototype.scenario']` and
  `autobyteus.prototype.context`, then reload or open a fresh browser context.
  New scenario: `agy_runtime` (Antigravity runtime available). Project and Task
  edits live in one in-memory copy per browser context; a reload resets them.

## What Changed In The Refresh

Work followed the source diff `e9aa4a7..0a32261`: 266 commits, 391
`autobyteus-web` files, of which 198 are outside tests, docs and tickets.

- **Presentation synced to the pin:** 150 retained files updated, 38 new
  source files added, and 4 files the source deleted were removed. Afterwards
  978 design files that also exist in the source are byte-identical to the
  pin. The only exception is the design-owned `utils/apolloClient.ts`.
- **Vendored contracts:** `agent-presentation-contracts`,
  `collaboration-stream-contracts`, `team-stream-contracts` (`src` and `dist`)
  and `application-sdk-contracts` (`src`, `dist` rebuilt) match the pin.
- **Surfaces the source added or changed:**
  - **Projects and Tasks** are pages, not dialogs:
    - Project pages: `/projects/new` and `/projects/<id>/edit`, with optional
      Existing-workspace or New-folder rows and validation.
    - Project detail: Tasks and Workspaces tabs, a delete confirmation that
      names the task count, and created/saved notices.
    - Task pages: `/tasks/new`, `/tasks/<id>` and `/tasks/<id>/edit`, with
      context files, a voice button, delete confirmation and notices.
    - The task board shows task rows with a file count, plus search and a
      no-match state.
    - Projects sits after Agent Orgs in the primary navigation.
  - **Live-run `@` mentions** (`006fd69` and the collaborator work):
    - A live-run composer offers `@`, with the placeholder
      "Ask anything · @ for an agent or team".
    - The menu lists shared Agents and Teams from the server; it has a
      no-match hint and a "relay" footer.
    - A chosen mention is one native inline highlight in the text box.
    - A sent message shows `@Name` chips.
    - A rejected add shows the collaborator add-failure notice.
  - **Agent-to-agent delivery:** the receiver's block opens with
    "From <Sender>:".
  - **Agent-run task rows:** a standalone Agent run that brought collaborators
    in lists its task Agent and task Team under the run in the Workspaces
    tree. Selecting a row opens that child's conversation, and the Team tab
    lists their messages.
  - **Run settings:**
    - The run-level skill access option is gone (`cf401a5`).
    - Fresh launches default to auto-approve (`4bf2d44`).
    - Antigravity shows a locked, always-on auto-approve control (`e5edfaf`).
  - **Compaction:** settings now choose a compaction model
    (`CompactionModelSettings`). Compaction status rows and Activity items
    gained a `stopped` phase with a gray tone, and a completed item shows more
    details.
  - **Team messages panel:** a reference-count badge, and the reference list
    shows only under the selected message (with "Show all").
  - **General Agent:** the built-in agent is now named General Agent (server
    data; the fixture follows it).
- **Accepted design changes superseded by the source** (source wins):
  - `cross-scope-agent-mentions` and `cross-scope-agent-mentions-sr008`:
    - Removed: the prototype mention components (`RunMentionChips`,
      `RunMentionMenu`, `RunMentionNotices`, `useRunMentions`) and the
      scripted local run (`prototype/run-mentions/`,
      `plugins/20.prototype-run-mentions.client.ts`).
    - Restored to the pin: the prototype hooks in the mention-related source
      files (`activeContextStore`, `memberInputMessageHandler`, the Team/Org
      hydration and history files, `AgentWorkspaceSurface`, `UserMessage`, the
      composer files and the chat strings). Together with the Projects files
      below, 22 design-modified source files now equal the pin.
  - `project-task-manager-foundations`:
    - Removed: the prototype Project/Task pages and review stores
      (`ProjectEditorPage`, `ProjectTaskPage`, `TaskContextFileList`,
      `prototype/project-review/`) and their unit tests.
    - The source's shipped pages, components and stores replaced them.
  - `composer-mention-discoverability` (never integrated into the design repo):
    the source's shipped single inline highlight is now the baseline.
  - Preserved design-only changes: none. Left illustrative: none.
  - **The Product UI/UX Designer should confirm these supersessions.**
  - One visible consequence: sending a message in a live run no longer plays
    the scripted conversation. It now behaves exactly like the source against
    the synthetic node: the message is posted and no reply arrives.

## Implementation Simplifications

| Visible capability | Visible experience preserved | Baseline simulation | Absent |
| --- | --- | --- | --- |
| Projects and Tasks | All Project/Task pages, validation, notices, delete confirmations, workspace rows, task board and search | The source's own `projects`/`projectTasks` stores run unchanged. `utils/apolloClient.ts` answers their queries and mutations, and `CreateWorkspace`, from one in-memory copy of `fixtures.mjs` data per browser context | Persistence, server validation beyond the two scripted errors (name taken, required fields) |
| Task context files | Attach, file list, file count on the board | The prototype `fetch` boundary answers draft begin/upload/remove/discard with a synthetic file record (name, type, size of the chosen file) | File storage, upload, preview bytes |
| Live-run `@` menu | Candidates, filter, no-match hint, inline highlight, sent chips | `GetCollaboratorMentionCandidates` fixture with two synthetic candidates | Server candidate policy, adding a collaborator, the collaborator's run |
| Collaborator add failure, compaction status | Notice and rows exactly as the source renders them | Live-only in the source; checks apply the same synthetic values through the source's own context/store on both sides | Agent stream |
| Agent-run task rows | Task Agent and task Team rows, child conversations, Team tab message | `GetAgentRunCollaboration` and member-projection fixtures for the stored run `run-research-001` | Collaboration stream, restore |
| Runtime availability | Runtime list and the locked Antigravity toggle | Per-runtime availability fixtures; `agy_runtime` scenario | Runtime probing |
| Catalog, settings and page data | All routes | Pinia snapshots re-captured from the pinned source: 72 snapshots | GraphQL server |
| Everything else | — | Unchanged from `WEB-BASELINE-REFRESH-003` | — |

Baseline-owned changes:

- `plugins/00.prototype-state.client.ts`:
  - Removed the run-mention hooks.
  - Projects stores (`projects`, `projectTasks`) run unchanged and are never
    re-patched from route snapshots.
  - `workspace.createWorkspace` runs the source action.
  - The node binding revision is kept across route re-patches, so the source's
    node-scoped caches do not invalidate themselves.
  - Projects pages use their own captured snapshots, and created IDs fall back
    to the same page type.
  - Task context-file requests are answered locally.
- `utils/apolloClient.ts`:
  - One resettable fixture state per browser context.
  - Answers Project/Task mutations, `CreateWorkspace` and the Projects error
    contract shape (`PROJECT_NAME_TAKEN` and the required-field errors) as
    GraphQL errors.
  - Run-mention imports removed.
- `prototype/source-observation/fixtures.mjs` and `mock-node.mjs`:
  - New fixtures, all small hand-written synthetic values:
    - in-memory Project/Task mutations with `taskCount` and `contextFiles`;
    - task context-file REST;
    - per-runtime availability and the `agy_runtime` scenario;
    - `@` candidates;
    - the Agent-root collaboration view and member projections;
    - `GetAgentOrgRootHistory`;
    - one stored agent-to-agent delivery in the Team `writer` conversation.
  - Removed `skillAccessMode`, and added `collaborators`/`agent_input_states`
    to the run trees, as the pinned contracts require.
  - **Fixture shape correction:** the synthetic workspaces had `kind: 'local'`,
    which no real node returns (the server's kinds are `filesystem | skill |
    temp`). They now use `filesystem` and `temp`, and the display name is the
    folder name (`prototype-workspace`), as on a real node.
    - The source now shows the stored standalone Agent run (`Research
      Assistant` › `Compare current navigation states`) under
      `prototype-workspace`, and that workspace opens expanded.
    - The accepted design had made this run visible by patching
      `utils/runTreeProjection.ts`. That patch was reverted to the pin.
  - The built-in agent fixture is named `General Agent`.
- `prototype/shared/apply-experience-scenario.js`: `skillAccessMode` removed,
  `collaborators` added, workspace kind `filesystem`.
- `prototype/fixtures/`:
  - `source-state-snapshots.json` and `runtime-state.json` were re-captured at
    the pin: 72 snapshots, adding the five Projects pages and
    `agy_runtime|/chat`.
  - `pnpm fixtures:icons` added `heroicons:lock-closed`, `paper-clip` and
    `musical-note` to the offline icon bundle.
- Scripts:
  - New `prototype/scripts/probe-refresh-004.mjs` (PRJ/TSK/MEN/AGR/CFG rows).
  - `probe-chat-flows.mjs` gained CHT-032–035 and CMP-001–002, and locates
    the run composer as `textarea.composer-text`.
  - `probe-flow.mjs` retired FLW-007/008 (the dialogs are gone) and opens the
    workspace only when it is closed.
  - `validate-web-baseline-refresh.mjs` gained routes R050–R054 and state row
    S018.
  - `validate-web-baseline-refresh-independent.mjs` gained IND-008–011.
  - `dump-source-state.mjs` and `build-runtime-fixtures.mjs` were updated for
    the new routes and the pin.
- `prototype/tests/fixture-contract.test.ts`: pin, snapshot count, scenario
  set, and a new in-memory Projects test.
- Docs: `README.md`, `mock-boundaries.md` and `prototype-scenarios.md` name the
  new pin and describe the new simulations.

Data boundary:

- Sizes: `fixtures.mjs` is 72 KB, `icon-collections.json` 68 KB,
  `runtime-state.json` 3.5 MB, `source-state-snapshots.json` 5.5 MB.
- The two snapshot files are the established route-state capture of the source
  running against the synthetic observation node. They contain only fixture
  values, as before. They grew because six snapshots were added and because of
  new store state.
- No source API data, database or content was recorded or copied.

## Validation

Every paired run used headless Chrome with the same viewport, locale, UTC
timezone, light theme, reduced motion, identical synthetic data and external
requests blocked. The observation node's data was restored before every run.
A row passes only if visible text and route are identical, the screenshot
differs at most by edge anti-aliasing or compositing rounding, the prototype
logs no browser errors, and it makes no non-local request.

Evidence root:
`/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-004/evidence/WEB-BASELINE-REFRESH-004/`.

- **Changed surfaces (`node prototype/scripts/probe-refresh-004.mjs`)**: 47/47
  pass, all pixel-identical with matching text and routes. Evidence:
  `refresh-flows/`.
  - Projects (PRJ-001–015):
    - the create page;
    - validation: empty name, unchosen workspace, empty folder path, taken
      name;
    - create with an existing workspace or a new folder, landing with the
      "created" notice on the Workspaces tab;
    - edit and save ("Changes saved."), the Workspaces tab;
    - the delete confirmation, and deleting back to the empty list;
    - Project and task search with no match.
  - Tasks (TSK-001–012):
    - the new-task page and empty-description validation;
    - create with the "created" notice, attaching a context file, and the file
      count on the board;
    - the task detail, edit and save;
    - the delete confirmation and delete with the "deleted" notice;
    - the narrow viewport, and "Task not found".
  - Live-run `@` (MEN-001–010):
    - the placeholder;
    - the menu in a Team run and in an Org member run;
    - filter and the no-match hint;
    - keyboard and mouse choice leave one inline highlight;
    - Escape closes the menu;
    - the "From researcher:" delivery block and its details.
  - Agent-run task rows (AGR-001–005): task Agent and task Team rows, the
    child conversation, the task Team coordinator, back to the host, and the
    Team tab message.
  - Runtime and run forms (CFG-001–005):
    - Antigravity's locked auto-approve (`agy_runtime`);
    - the Agent and Team launch forms;
    - stored Team run settings;
    - compaction model settings.
  - AGR-004 first failed identically on both sides: the step could not find
    the run row's label. After the step was fixed it passed:
    `flow-results-rerun-AGR-004.json`.
- **Chat flows (`validate:chat-baseline-refresh-flows`)**: 47/47 pass, all
  pixel-identical. Evidence: `chat-flows/`.
  - CHT-001–035: CHT-032 is the `@` menu in a chat run; CHT-033 is a sent
    reply with an `@Documentation Writer` chip; CHT-034–035 show and dismiss
    the collaborator add-failure notice.
  - CMP-001–002: compaction rows and Activity items in the completed, failed,
    stopped and started phases.
  - BGT-001–009, SKL-001.
- **Workspace and catalog flows (`validate:web-baseline-refresh-flows`)**:
  13/13 pass (11 pixel-identical, 2 anti-aliasing only). Evidence: `flows/`.
  FLW-007 and FLW-008 were retired because the dialogs they opened no longer
  exist.
- **Route and state matrix (`validate:web-baseline-refresh`)**: the
  load-and-look pass for unchanged surfaces, plus the new Projects routes.
  - Scope: 97 rows:
    - 54 routes on desktop English, including R050–R054 (the five Projects
      pages);
    - 25 sampled narrow and zh-CN rows;
    - 18 state rows, including S018 `agy_runtime`.
  - Result: 97/97 pass, 75 of them pixel-identical; the rest differ only by
    anti-aliasing or compositing with identical text, controls and DOM
    geometry. Evidence: `matrix/`.
  - In the final run, S015 (`/mobile?unsupported=desktopSettings`) had
    identical pixels and text but one geometry difference. The cause was in
    the design dev server, not the UI: after hot reloads it had injected
    `layouts/default.vue`'s global `#__nuxt { height: 100% }` rule. A fresh
    dev server does not inject it, and S015 then passed:
    `results-rerun-S015.json`.
- **Independent run** (`validate-web-baseline-refresh-independent.mjs`):
  - Command: `PORT=4532 HOST=127.0.0.1 node .output/server/index.mjs`, with
    the source and the observation node stopped.
  - Checked: IND-001–007 as before, plus:
    - IND-008: create a Project;
    - IND-009: create a Task;
    - IND-010: the `@` menu in a Team run;
    - IND-011: Agent-run task rows.
  - Result: 11/11, zero browser errors and zero non-local requests.
    Evidence: `independent-preview/`.
- **Checks (all pass):**
  - `pnpm typecheck` (only the usual duplicate auto-import warnings);
  - `pnpm lint`;
  - `pnpm test` (3 files, 13 tests, including the new in-memory Projects
    test);
  - `pnpm validate:boundaries`;
  - `pnpm build`.
- **Presentation audit:** 978 design files that also exist in the source are
  byte-identical to the pin; the only exception is `utils/apolloClient.ts`.
  The four vendored contract packages match the pin.
- **Not re-run:** paired-mobile work tabs (MOB-001–014) and the desktop-host
  rows (HOST-001–008, STATE-009–013). See "Known Gaps".
- **Servers:** none is left running. Start the baseline with the documented
  command. The evidence folder is 29 MB.

## Refresh Reconciliation

- Previous and new pins: `e9aa4a7` → `0a32261`.
- Surfaces added, changed or removed: see "What Changed In The Refresh".
  Removed by the source: the Project, Task and workspace-link dialogs.
- Accepted design changes superseded by the source:
  - `cross-scope-agent-mentions` and `cross-scope-agent-mentions-sr008`;
  - the `project-task-manager-foundations` Projects/Tasks UI;
  - `composer-mention-discoverability` (never integrated).
- Accepted design-only changes preserved: none.
- Unchanged surfaces given a load-and-look pass: the full route and state
  matrix (see Validation).

## Known Gaps And Next Action

- **Carried over, unchanged:**
  - The legacy `workspace_*` / `mobile_*` scenario injector
    (`prototype/shared/apply-experience-scenario.js`) was already broken at the
    accepted base (reported by `WEB-BASELINE-REFRESH-003`). It was only kept
    consistent with the new contracts (`skillAccessMode`, `collaborators`) and
    remains unverified.
  - The paired-mobile work tabs (MOB-001–014) and the desktop-host rows were
    not re-run. Of their dependencies, only `MobileLaunchRunOptionsCard` (the
    skill access option removed) changed, and it is reachable only through
    that broken injector.
- **Not simulated, as in the source against the synthetic node:**
  - adding a collaborator on send, and its run;
  - agent replies, streaming and held/queued pending-input states;
  - live-recording voice input (the voice buttons render, as in the source
    without the desktop extension).
- **Remaining UI parity differences inside the verified scope:** none.
- **Recommended next action for `product_ui_ux_designer`:**
  - Review and accept the candidate, and confirm the three supersessions and
    the workspace fixture-kind correction.
  - Commit on `design/web-baseline-refresh-004` and integrate into `personal`.
  - Rebuild `run-settings-ui-unification` on the refreshed `personal`.
