# UI Reference Runbook

## projects-left-navigation (Projects mode in the left panel; source pin `d74f75a`, design base `752b6b8`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4960
```

- Entry: `/workspace`; left panel → **Projects** (the flat tab next to Workspaces). The choice is remembered in local storage (`autobyteus.leftPanel.runSectionMode.embedded-local`).
- Projects (illustrative): *AutoByteus* (folder prototype-workspace; the Project Task Manager run with delegated copies and a Product Review Team), *Customer Onboarding Experience Redesign* (no runs, no folder), *Prototype Launch* (the same Project Task Manager run with only its own delegated row, a Research Assistant, a Tutorial Video Producer, a Video Team, the Product Launch Org). Example links: `prototype/projects-left-navigation/projectRunLinks.ts`.
- Start under a Project: a Project's "+" (hover), a group's "+", or Chat's pencil → the footer chip → **Projects** tab. Sending lists the run under the Project (in memory; reload resets).
- Right board: with the right panel on **Projects**, selecting a Project on the left changes its board.
- Starting states (browser console, then reload; remove the key to reset): `localStorage['autobyteus.prototype.projectsTree']` = `loading` | `error` | `stale-error` | `none`.
- Chinese: `localStorage['autobyteus.localization.preference-mode'] = 'zh-CN'`.
- Final screenshots: `PROTOTYPE_BASE_URL=http://127.0.0.1:4960 node prototype/scripts/capture-projects-left-navigation-final.mjs` (writes `visual-references/`; `ONLY=VIS-001,VIS-002` limits it).
- Not playable here: a Task closing live and its delegated rows leaving (existing mechanism; see the spec).
- Spec: `tickets/done/projects-left-navigation/ui-ux-spec.md`.

## integrations-page (Integrations page; source pin `d74f75a`, Settings surfaces `e4bebdc858`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4940
```

- Entry: `/integrations` (menu item Integrations, last, after Nodes). Default: one GitHub card, Not installed. Install on the card, then Connect (dialog): a token containing `bad`, `reject` or `revoked` is rejected, `offline` cannot be checked, anything else connects as `@alex-dev`.
- Starting states (browser console, reload; remove the key to reset): `localStorage.setItem('autobyteus.prototype.scenario', '<name>')` with `integrations_connected`, `integrations_several` (GitHub, Jira "Needs a newer AutoByteus", SSH), `integrations_tool_missing`, `integrations_install_clash`, `integrations_token_revoked`, `integrations_offline` (the first Retry fails again), `integrations_offline_installed`, `integrations_empty`.
- After Install the skill is on `/skills` and the source in Skills → Sources. Server Settings → Basics has no GitHub card.
- Data is invented in `prototype/integrations/integrationsDesignFixture.ts`; state is in `stores/integrationsStore.ts`; in memory, a reload resets it. Spec: `tickets/done/integrations-page/ui-ux-spec.md`.

## WEB-BASELINE-REFRESH-014 (scoped refresh: Settings menu and the GitHub card; those two surfaces reflect `e4bebdc858`, the rest `d74f75a`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4830
```

- Entry: `/settings?section=server-settings&mode=quick` (the GitHub card is below the web-search card); the left menu is on every Settings section.
- Starting states (browser console, then reload; remove the key to reset): `localStorage.setItem('autobyteus.prototype.scenario', '<name>')` with default (not connected),
  `github_connected`, `github_load_failed`, `github_test_rejected`, `github_vault_unavailable`, `github_agents_fail`, `empty` (no agents).
- Scripted outcomes: Save with a token containing `reject` is refused ("GitHub rejected the token."), containing `offline` cannot be checked, any other token connects as the invented `@synthetic-octocat`; Test passes; Remove disconnects and keeps the ticks.
  Data is invented in `prototype/source-observation/github-integration-fixtures.mjs`; state is in memory and a reload resets it.

## work-journal-search (Memory page: memory search, Work Journal, memory index; source pin `d74f75a`, design base `205aff6`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4930
```

- Entry: `/memory` opens Browse (no setup); tabs Browse · Search · Index (`?view=home&section=search|index`). Starting states (browser console, reload; remove the key to reset):
  `localStorage.setItem('autobyteus.prototype.scenario', '<scenario>')` with `memory_not_indexed`, `memory_meaning_running`, `memory_index_failed`,
  `memory_model_changed`, `memory_search_fails` (default = index ready).
- Try: search `ddns updater for the home domain` (strong, with two matches), `bunny and tortoise`, `域名 自动更新`, `purple elephant` (none of the words occur in any journal), `ddns updater cloudflare` (some words not found); open a match.
  With `memory_not_indexed`: **Index now**, watch the four steps (accelerated), search while the Text index is still running.
- The memory index, search results and journal files are invented and scripted in `prototype/memory-search/memoryDesignFixture.ts`; the stores are
  `stores/memorySearchStore.ts` (search and the pipeline timer) and `stores/memoryJournalStore.ts` (windows of lines); the Memory lists are answered through
  `utils/apolloClient.ts`. Nothing is read from a real node, run or journal. State is in memory: reload resets it.
- Spec: `tickets/in-progress/work-journal-search/ui-ux-spec.md` (once approved).

## delegated-runtime-model-routing (Settings → Model Routing, the router conversation, routed choices in run Settings; source pin `d74f75a`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4840
```

- Entry: `/settings?section=model-routing` (tabs Configuration, Decisions, Overview, Runtimes; `&tab=setup|decisions|overview|runtimes` and `&decision=` select one). Spec: `tickets/done/delegated-runtime-model-routing/ui-ux-spec.md`.
- Starting states (browser console, then reload; remove the key to reset): `localStorage.setItem('autobyteus.prototype.scenario', '<name>')` with `populated` (default: on, active, history),
  `routing_fresh` (off, nothing recorded), `routing_off` (off, history kept), `routing_on_empty`, `routing_not_set`, `routing_blocked`. Window context `autobyteus.prototype.context` = `electron_external`
  shows a peer node's page. Chinese: `localStorage['autobyteus.localization.preference-mode']='zh-CN'`.
- The router's conversation: Configuration → Talk to the router (or `/chat?id=run-model-router`). The router is listed in the sidebar and in Agents only while Settings → Server Settings → Basics → Show internal agents is on. The Project Task Manager run (`/chat?id=run-ptm-0001`) has three `delegate_task` calls (open Activity → Result) and
  its Settings (gear) lists the copies with their routed choices.
- State is in memory: a reload resets it. Data is invented in `prototype/model-routing/modelRoutingData.ts`; the page's state is `modelRoutingState.ts`; the router's conversation `modelRoutingFixture.ts`.

## WEB-BASELINE-REFRESH-013 (source pin `d74f75a`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4820
```

Set a starting state in the browser console and reload (remove the key to reset; a reload resets all in-memory state):
`localStorage.setItem('autobyteus.prototype.scenario', '<scenario>')`, and for a desktop window
`localStorage.setItem('autobyteus.prototype.context', 'electron_internal')` (the desktop's own node) or `'electron_external'` (a window opened on Docker 8001).

| New in this refresh | Entry | Starting state |
| --- | --- | --- |
| Settings → Model Routing, "Agent runtimes now" | `/settings?section=model-routing` | default; `routing_empty`, `routing_load_failed` (first read fails; Check again), `routing_check_fails` (Check again fails), `routing_unknown`; `electron_external` says "Remote node" |
| "Show internal agents" and Claude one-hour cache cards | `/settings?section=server-settings&mode=quick` | default; `settings_save_fails`. Turning "Show internal agents" on lists Agent Architect (Internal) in Agents |
| Nodes → Manage Nodes (as shipped), NFS Guide tab | `/nodes?nodeTab=manage` | `nodes_user` + `electron_internal`; `nodes_states` (one row in each state); `electron_external` (the Docker window); no context = a browser (no Open) |
| Phone Setup tab (its data is local now) | `/nodes?nodeTab=phoneSetup` | default |
| Runs on other nodes in the Workspaces tree | `/workspace` → prototype-workspace → Project Task Manager → the run | default (design example data: node `docker` reachable, `office-mac` not); `remote_states` |
| Update checks card with intervals and automatic updates, Notification Center switches and outcomes | `/settings?section=server-settings&mode=quick`, the Settings pill in the sidebar | `electron_internal` + `updates_waiting`, `updates_many`, `updates_one`, `updates_off`, `updates_auto_on`, `updates_outcomes_only`, `updates_backoff`, `updates_discover` |
| Agent Runtimes on a remote node whose desktop browser can sign in | `/settings?section=agent-runtimes` | `electron_external` + `runtimes_remote_desktop` |
| Project Task titles, comments, validation | `/projects/project-prototype-launch/tasks/task-review` | default |

- The simulated network of nodes is `prototype/nodes/network-world.mjs`: the Nodes page's switch, peers, addresses, offers and failures. Add these addresses:
  `http://localhost:8003` (off, reachable), `localhost:8004` (a Docker node that cannot find an address for this node: the hint),
  `localhost:8005` (goes away on its first write, back after 8 s: the partial state), a host containing `slow` (no answer), `nohost` (name not found),
  `notab` (not an AutoByteus node); any other unknown address is refused.
- Nothing is contacted: every other node answers from the world in the page (`prototype/shared/node-network-fetch.js`).
- The source observation node accepts the same scenarios: `PROTOTYPE_MOCK_PORT=4823 node prototype/source-observation/mock-node.mjs`.

## remote-runs-in-tree (runs another node runs, under their delegator in the run tree; source pin `9e7a458`, engineering base `3b09fbe308`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4901
```

- Entry: `/workspace`, **no setup**: the default data has the Project Task Manager run live, with its five local copies and three remote ones: a Marketing Team and a market researcher on the node `docker`, and a Support Team on `office-mac` that is not reachable. Optional starting states (browser console, reload; remove the key to reset):
  - every state at once: scenario `remote_states` — one remote row each: working, idle, waiting, offline, and a Team on `office-mac` that is not reachable (no local copies).
  - Chinese: `localStorage['autobyteus.localization.preference-mode']='zh-CN'`
- Try (default data): Workspaces → prototype-workspace → Project Task Manager → open the run row → expand `marketing team` → open `campaign lead`. About 3 s after you open it a new tool call and a message arrive (the other node's events, passed on by this node); the lead then goes idle. Send `status?`: the lead answers and the sent message shows as yours. Open Files, Terminal and Artifacts in the right panel: each says the run is on docker. Click the red stop square on the team row: the copy and its members go offline.
- Try the failure (default data): open `support team` → `triage lead`: the red notice and Retry; Retry on the row shows "Checking office-mac…" for 1.5 s; send a message: the existing red error block names the node. Stop on a working row.
- The nodes, runs, titles, conversations, timings and failures are invented in `prototype/remote-runs/remoteRunsFixture.ts` and answer through the existing mock GraphQL and WebSocket layers (`plugins/00.prototype-state.client.ts`, `utils/apolloClient.ts`). Nothing is read from a real node. State is in memory: reload resets it.
- Spec: `tickets/done/remote-runs-in-tree/ui-ux-spec.md` (once approved).

## one-nodes-tab (Nodes → Manage Nodes: one list of nodes, Remote Collaboration merged in; source pin `9e7a458`, engineering base `ca1f09e52a`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4801
```

- Entry: `/nodes?nodeTab=manage`. Select the starting state in the browser console and reload:
  - desktop window on the embedded node: `localStorage.setItem('autobyteus.prototype.scenario','nodes_user'); localStorage.setItem('autobyteus.prototype.context','electron_internal')`
  - a window opened on Docker 8001: context `electron_external`
  - a browser (no Open): remove the `autobyteus.prototype.context` key
  - one row in every state: scenario `nodes_states`
  - Chinese: `localStorage['autobyteus.localization.preference-mode']='zh-CN'`
- The nodes answer from `prototype/nodes/nodeWorld.ts`. Add these addresses: `http://localhost:8003` (off, reachable), `localhost:8004` (a Docker node that cannot find an address for this node: the hint), `localhost:8005` (goes away on its first write, back after 8 s: the partial state), a host containing `slow` (no answer in 20 s), `nohost` (name not found), `notab` (not an AutoByteus node), any other unknown address (refused). Port `8001` is already in the list.
- Try: Add node (unticked, then ticked); the Agents switch on a row; the confirmation, its running and failed views; Try again; ⋯ → Rename / Remove; expand a row, Change address (`http://127.0.0.1:29695` in the Docker window); Check again; the This node switch off and on.
- State is in memory: reload resets it. Nothing polls. Spec: `tickets/in-progress/one-nodes-tab/ui-ux-spec.md` (once approved).

## remote-nodes-page (historical: the Remote Collaboration tab it designed is merged into Manage Nodes by one-nodes-tab; the `collab_peers` scenario is gone)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4781
```

- Entry: `/nodes?nodeTab=remoteCollaboration`. Starting state: in the browser console run
  `localStorage.setItem('autobyteus.prototype.scenario', 'collab_peers')` and reload (switch on; six peers, one per state; remove the key to reset).
  Chinese: `localStorage['autobyteus.localization.preference-mode'] = 'zh-CN'`, then reload.
- The peers answer from `prototype/remote-collaboration/offersScript.ts`, by their registered name:
  `docker` (0.9 s, 7 Agents and 2 Teams), `studio` (3.2 s, 24 Agents and 7 Teams), `lab` (off there), `nas` (not registered there),
  `edge` (waits the full 20 s, then not reachable), `spare` (a different server), `empty` (available, shares nothing).
  An added peer is judged by its URL: it contains `off`, `unregistered`, `mismatch` or `slow` for the matching state; any other URL is available
  with three entries. A URL containing `unreachable` is still refused at add (the baseline's refusal).
- Try: the page opening (every peer shows Checking… and settles at its own pace); the refresh icon on one peer; expanding `studio` and
  searching "copy"; adding a peer named `empty`; turning the switch off and on; the "How peers' runs work" line.
- State is in memory: reload resets it. Nothing polls. Spec: `tickets/done/remote-nodes-page/ui-ux-spec.md`.

## update-checks-and-auto-updates (agent runtimes category, automatic-update switches, intervals, app check; source pin `9e7a458`, requirements SR-002)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4930
```

Open `/workspace` (the product's normal entry). The runtime category and the app row exist only in the desktop's own window, so set
the context once in the browser console, then reload:

```js
localStorage.setItem('autobyteus.prototype.context', 'electron_internal')   // the desktop's own node
localStorage.setItem('autobyteus.prototype.scenario', 'updates_waiting')   // or another scenario below
```

- `updates_waiting` (the starting point): Settings row "6 updates"; a software update, two runtime updates (Codex free to update, Claude
  with 2 agents running), two package updates, a skill update, an updated skill. All automatic-update switches are off. Turning a
  packages or skill-sources switch on opens the confirmation (Turn on / Cancel / Esc).
  - Turn on "Update automatically" at a category: after a few seconds (the product: within about a minute) its waiting updates
    are applied or answered: package "Research Pack" is updated, "Docs Pack…" fails, skill "review-skills" is updated,
    Codex is updated, Claude waits for its agents. Reload resets.
  - Update on Codex: Updating… → Updated to 0.164.0 (the vendor update of Settings → Agent Runtimes).
- `updates_auto_on`: all three switches on, with every outcome row already there (updated automatically, failed,
  runtime waiting for agents).
- `updates_outcomes_only`: nothing waits, one automatic update is unread: the Settings row says "1 updated".
- `updates_off`: Update checks off for the node: the switches say they have no effect. `updates_backoff`: Settings → Server Settings →
  Basics → Update checks says "GitHub asked this node to wait until …". `updates_discover`: a package update appears by itself about 7 s
  after load (the node's pass found it). `updates_many`, `updates_one`: as in 209.
- Update checks card: `/settings?section=server-settings` (Basics, last card). Intervals save when the field loses focus or Enter
  is pressed; try `5` minutes (refused) or `2` hours.
- Settings → Updates: `/settings?section=updates` with `update_up_to_date`, `update_available`, `update_check_failed` (a periodic
  check failed; quiet, no toast) or `update_checks_off`.
- Browser window (no runtimes, no software update): context `desktop` (the default). Remote node window: `electron_external`.
- Chinese: `localStorage['autobyteus.localization.preference-mode'] = 'zh-CN'`.
- Mock boundaries: the node's passes, the vendor update commands and the app's periodic timer are scripted in
  `prototype/source-observation/node-settings-fixtures.mjs` and `prototype/shared/install-host-scenario.js`; nothing is requested.
  Spec: `tickets/done/update-checks-and-auto-updates/ui-ux-spec.md` (approved 2026-10-23; the final references are VIS-001..037 beside it).

## settings-update-notifications (update notifications: sidebar entry, Notification Center, Update checks card; source pin `9227d61`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4681
```

- Open `/chat`. The Settings row shows "4 updates" (solid while unread). Click it to open the Notification Center
  over the page.
- Try:
  - Update on AutoByteus Agents (Updating… → Updated; Clear);
  - Update on "Research Assistant…" (fails once, then Try again);
  - Update on AutoByteus Skills (the existing confirmation);
  - Download on AutoByteus (progress → Install and restart);
  - click a name for its details;
  - close with ✕, Esc or a click outside.
  - Collapse the sidebar for the strip icon.
  - The setting is at Settings → Server Settings → Basics → Update checks.
- Scenarios: `localStorage.setItem('autobyteus.prototype.notifications', 'many' | 'empty' | 'off' | 'browser')`,
  then reload; remove the key to reset. Chinese: `localStorage['autobyteus.localization.preference-mode'] = 'zh-CN'`.
- Validation: `BASE=http://127.0.0.1:4681 node tickets/done/settings-update-notifications/visual-references/final-validation.mjs`
  (30 checks).
- References: `BASE=... OUT=tickets/done/settings-update-notifications/visual-references/ node tickets/done/settings-update-notifications/visual-references/capture-references.mjs`.
- Reset: reload (in-memory state). Spec: `tickets/done/settings-update-notifications/ui-ux-spec.md`.

## WEB-BASELINE-REFRESH-012 (source pin `9e7a458`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4820
```

Scenarios (`localStorage.setItem('autobyteus.prototype.scenario', '<name>')`, reload; remove the key to reset). The window
context is `autobyteus.prototype.context`: `desktop` (default browser window), `electron_internal` (the desktop's own node) or
`electron_external` (a remote-node window).

- Notification Center (the source's sidebar entry and panel): scenario `updates_waiting` (two agent package updates, one of which
  fails once; a skill source update; an updated skill source). Open `/workspace`: the "N updates" pill sits on the right of the
  Settings row (a count badge above the cog when the left panel is collapsed). `updates_many` (Show N more), `updates_one` (one
  update; clearing it leaves "No updates waiting"), `updates_off` (background checks off). With `electron_internal`, a Software
  update row also shows (Download → progress → Install and restart). Settings → Server Settings → Basics has the "Update checks"
  card.
- Agent Runtimes: `/settings?section=agent-runtimes` with `electron_internal` (Update and Sign in work) or `electron_external`
  (status only). Scenarios: default (Codex up to date, Claude update available, Antigravity signed out, Grok not installed),
  `runtimes_mixed`, `runtimes_blocked` (Update waits for running agents), `runtimes_update_fails`, `runtimes_sign_in_fails`,
  `runtimes_load_failed` (Retry). Work advances one step per read (every 2 s while busy).
- Remote Collaboration: `/nodes?nodeTab=remoteCollaboration`; scenario `collab_peers` has the switch on and two peers. Add a peer
  with a URL containing `unreachable` to see the refusal.
- Skill sources: `/skills` → Sources → Update opens the shared confirmation; `skill_source_issues` has a source whose later check
  failed but whose newer revision is known (it stays updatable).
- Reset: reload the page. Comparison runs set `autobyteus.prototype.designOnlyLayers=off`.

## WEB-BASELINE-REFRESH-011 (source pin `9227d61`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4620
```

- Embedding (the source's section): `/settings?section=server-settings&mode=embedding`. Download → progress → Cancel; Use this
  model → dialog → confirm (the model prepares, Projects are not indexed); Remove and Rebuild (inline confirmations); Index now,
  Index all Projects, filter tabs. Work advances one step per status read (the section reads every 2 s while busy).
- Scenarios (`autobyteus.prototype.scenario`, reload): `embedding_busy` (a download ahead and every index state),
  `embedding_many` (eleven Projects: Find), `embedding_offline` (each model's first download fails; Retry succeeds),
  `embedding_unavailable` (the active model is unavailable; Retry), `embedding_load_failed` (the first status read fails; Retry),
  `empty` (no Projects).
- Meaning search: `/projects/project-prototype-launch`, search `checklists` (related by meaning) or `launch` (exact first); after a
  model switch the board says meaning search is preparing; `embedding_unavailable` offers Retry.
- Part of: `/projects/project-prototype-launch/tasks/prototype-launch-1` (Parts: 1 of 2 done, 1 cancelled), a part's page
  (`prototype-launch-3`), Edit task ("Part of" picker), "New part".
- Bulk MCP import: Settings → MCP Servers → Bulk Import; an entry without `url` or `command` is listed under "These entries were not
  imported".
- Reset: reload the page. Comparison runs set `autobyteus.prototype.designOnlyLayers=off`.

## runtime-lifecycle-review (Settings -> Agent Runtimes; source pin unchanged `2f21134`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4701
```

- Open `/settings?section=agent-runtimes` (menu: Agent Runtimes, after API Keys). Default view: Codex up to date and not signed in (Sign in), Claude update available (Update), Antigravity not signed in (Sign in opens a terminal running `agy`: press Enter), Grok not installed (Install instructions).
- Try: Update on Claude (steps, result, re-check); Sign in on Codex (waiting, Cancel); Sign in on Antigravity (terminal, Enter); Check again; leave the page and return.
- Scenarios (starting state only; `localStorage.setItem('autobyteus.prototype.scenario', '<name>')`, reload; remove the key to reset): `runtimes_mac` (Grok installed), `runtimes_all_current`, `runtimes_mixed`, `runtimes_agents_running` (agents finish at 12 s / 24 s), `runtimes_update_fails`, `runtimes_signed_out`, `runtimes_sign_in_fails`, `runtimes_check_failed`, `runtimes_load_failed`.
- Remote/Docker node window: `localStorage.setItem('autobyteus.prototype.context', 'electron_remote')`, reload (remove or set `desktop` to reset). Chinese: `localStorage['autobyteus.localization.preference-mode'] = 'zh-CN'`.
- Validation: `BASE=http://127.0.0.1:4701 node tickets/done/runtime-lifecycle-review/visual-references/final-validation.mjs` (RTM-001-020, 96 checks; the page clock is paused and driven by the script).
  Final references: `BASE=... OUT=tickets/done/runtime-lifecycle-review/visual-references/ node tickets/done/runtime-lifecycle-review/visual-references/capture-references.mjs`.
- Reset: reload the page (in-memory state). Spec: `tickets/done/runtime-lifecycle-review/ui-ux-spec.md`.

## search-model-settings (Settings -> Server Settings -> Embedding; source pin unchanged `2f21134`)

> WEB-BASELINE-REFRESH-011: the source now ships this section, and its components replaced the design-only ones. The scenario
> names below are the design's; the baseline's are `embedding_*` (see above). The approved scripts in `tickets/done/` are
> unchanged; adjusted copies run in `evidence/WEB-BASELINE-REFRESH-011/approved-checks/search-model-settings/`.

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4691
```

- Open `/settings?section=server-settings&mode=embedding` (sidebar: Server Settings -> Embedding). Models: Download -> progress -> Cancel; Use this model -> dialog -> confirm;
  Remove (inline confirmation). Projects: Index now, Rebuild (inline confirmation), Index all Projects, filter tabs. Leave the section and return: work continues.
- Scenarios (starting state only; `localStorage.setItem('autobyteus.prototype.scenario', '<name>')`, reload): `search_offline` (first download fails, Retry works), `search_unavailable`,
  `search_many_projects`, `search_empty`, `search_load_failed`. Remove the key to reset to `populated`. Locale: `localStorage['autobyteus.localization.preference-mode'] = 'zh-CN'`.
- Validation: `BASE=http://127.0.0.1:4691 node tickets/done/search-model-settings/visual-references/final-validation.mjs` (SRCH-001-019, 87 checks; the page clock is paused and driven by the script).
  Final references: `BASE=... OUT=tickets/done/search-model-settings/visual-references/ node tickets/done/search-model-settings/visual-references/capture-references.mjs`.
- RV-001 (2026-10-28, one "Waiting…" state): `BASE=http://127.0.0.1:4940 OUT=tickets/done/search-model-settings/visual-references/ node tickets/done/search-model-settings/visual-references/capture-waiting-references.mjs` recaptures VIS-007, VIS-010 and VIS-022 against the current section (scenario `embedding_busy`).
- Reset: reload the page (in-memory state). Spec: `tickets/done/search-model-settings/ui-ux-spec.md`.

## task-part-of ("part of" between Project Tasks; source pin unchanged `2f21134`)

> WEB-BASELINE-REFRESH-011: the source now ships "part of"; its components run unchanged. The example Projects below are design-only data.

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4620
```

- Parents and parts: `/projects/project-desktop-app` (parent `autobyteus-25` with five parts; `-14` all done; `-10` none done;
  `-6` Done; `-3` Cancelled; `-1` only Cancelled parts), a Task page, Edit task ("Part of"), "New part" on a parent's page.
- Long keys: `/projects/project-onboarding-redesign`. Tab: `/chat?id=run-ptm-0001` → Projects.
- Validation: `BASE=http://127.0.0.1:4620 node tickets/done/task-part-of/visual-references/final-validation.mjs` (PART-001–009).
- Reset: reload the page. Spec: `tickets/done/task-part-of/ui-ux-spec.md`.

## WEB-BASELINE-REFRESH-010 (source pin `2f21134`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4620
```

- Task keys and "Depends on": `/projects/project-prototype-launch` (badges), a Task page
  (`/projects/project-prototype-launch/tasks/prototype-launch-3`), Edit task (picker).
- Delegated copies: `/workspace` → prototype-workspace → Research Assistant → its run →
  **Edit Config** → Delegated copies (stopped: change a copy's model and Save).
- Live runs: scenario `live_runs` (`autobyteus.prototype.scenario`): Team status dots, a
  running copy's red Stop in the tree and in Settings.
- Skill update notice: open the Research Assistant run. TPS card: New chat → send →
  Token tab (a value appears only with a live model call). NFS guide: Nodes → NFS Guide.
- Reset: reload the page. Comparison runs set `autobyteus.prototype.designOnlyLayers=off`.

## WEB-BASELINE-REFRESH-009 (source pin `73f7432`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4620
```

- Task summaries: `/workspace` → prototype-workspace → Research Assistant; a Task
  worker row's grey summary line shows its Task in the right panel's Projects tab.
- Collapsed left panel: open a run, collapse the left panel; the strip's
  Workspaces icon is lit and reopens the panel on the run.
- Skill sources: `/skills` → **Sources** (one input for a folder or a GitHub URL).
- Definition issues: scenario `definition_issues` (`autobyteus.prototype.scenario`)
  on `/agents?view=list`, `/agent-teams?view=team-list`, `/agent-orgs?view=org-list`
  and `/settings?section=agent-packages`.
- Member defaults: `/chat` → heading switcher → Product Review Team → members.
- Delegated launches: open the Research Assistant run → **Edit Config**.
- Signed-out Antigravity: scenario `agy_signed_out`, `/chat` → model menu.
- Reset: reload the page. Comparison runs set `autobyteus.prototype.designOnlyLayers=off`.

## WEB-BASELINE-REFRESH-008 (source pin `1cd1a3a`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 3210
```

- Projects tab: `/workspace` → right panel **Projects** (first tab); the picker
  switches between a Project and Temp tasks; a card opens its Task in the tab.
- Task roots: `/projects/project-prototype-launch` (running, couldn't start,
  closed team) and `/projects/temp-tasks`.
- Run settings: `/chat` → the heading switcher (Agent, Team, Org launch page);
  model menu → Codex App Server → GPT-5.6 Sol shows thinking effort and **Fast**.
- Reconnect (design-only): `/workspace` → prototype-workspace → Tutorial Video
  Producer / Video Team runs.
- Reset: reload the page (in-memory fixtures); scenarios use the existing
  `autobyteus.prototype.scenario` key. Comparison runs set
  `autobyteus.prototype.designOnlyLayers=off`.


## Promoted Default Product Baseline

Start the cumulative accepted prototype:

```bash
cd /home/autobyteus/workspace/autobyteus-web-prototype
corepack pnpm dev --port 3210
```

Use normal product routes without preview-only query state:

- Agent Teams: `http://127.0.0.1:3210/agent-teams?view=team-list`
- Agent Orgs: `http://127.0.0.1:3210/agent-orgs?view=org-list`
- Workspace: `http://127.0.0.1:3210/workspace`
- Token Statistics: `http://127.0.0.1:3210/settings?section=token-usage`

Agent Team Run navigates to
`/workspace?root=team&team=<id>&phase=config`. Agent Org Run navigates to
`/workspace?root=org&org=<id>&phase=config`. Successful synthetic launches
replace only `phase=config` with `phase=active`.

Validate default-entry promotion while the prototype is running:

```bash
PROTOTYPE_BASE_URL=http://127.0.0.1:3210 \
corepack pnpm validate:default-baseline-promotion
```

Historical `prototypeReview` URLs are retained only for review evidence and
comparison fixtures. The accepted baseline does not depend on them.

## AORG-FLAT-TEAM-001 Focused Current-Experience Correction

This Product-owned worktree exposes two deterministic current-source scenarios
for the `Baseline Needed` correction at source pin
`8ef282ba77705180d985e7000d801f0e0068cdc1`:

```js
localStorage.setItem('autobyteus.prototype.context', 'desktop')
localStorage.setItem('autobyteus.prototype.scenario', 'workspace_team_run_config_correction')
location.assign('/workspace')
```

The Team configuration scenario supports the exact source interactions for the
missing-workspace/disabled-run state, member disclosure, existing-workspace
selection, and auto-approve toggle. To inspect the selected-run read-only form,
switch to `workspace_team_active`, reload `/workspace`, and activate **Edit
Config** in the center header.

For the workspace file tree:

```js
localStorage.setItem('autobyteus.prototype.scenario', 'workspace_file_tree_correction')
location.assign('/workspace')
```

The Files surface has an expanded `docs` folder, two synthetic Markdown tabs,
a real active preview, folder collapse/expand, file selection, and the source
folder context menu. All state is browser-local and resettable; neither
scenario accesses a filesystem, runtime, model, backend, or production data.

Run the focused matched-browser validator while the exact pinned source,
prototype, and controlled observer are available:

```bash
SOURCE_BASE_URL=http://127.0.0.1:4283 \
PROTOTYPE_BASE_URL=http://127.0.0.1:4183 \
MOCK_BASE_URL=http://127.0.0.1:4383 \
corepack pnpm validate:aorg-team-config-file-tree-correction
```

The durable result is under
`evidence/AORG-FLAT-TEAM-001/baseline-correction-2/`. Ordinary prototype review
requires only `corepack pnpm dev --port 3210`; the source observer is evidence
infrastructure, not a runtime dependency.

## REQPKG-TSUI-001 Token Statistics Final Prototype Candidate

This ticket-scoped worktree contains the RER-009 **Final Prototype** for
**Settings > Token Statistics**, built on the accepted refresh from
`origin/personal` at exact source pin
`9d0fd7c570d58da1af2c7a40279327c8a20a8093`. The source repository remains
separate and read-only. The candidate is awaiting explicit user confirmation
of the actual final runnable; the approved project-wide baseline information
below remains historical context.

Run the candidate independently:

```bash
cd /home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 3210
```

Review <http://127.0.0.1:3210/settings?section=token-usage>, or use the active
ticket-owned review URL <http://127.0.0.1:3261/settings?section=token-usage>.
Choose a focused fixture in the browser console and reload:

```js
localStorage.setItem('autobyteus.prototype.scenario', 'token_partial')
location.assign('/settings?section=token-usage')
```

Available focused values are `populated`, `token_empty`, `token_partial`,
`token_unavailable`, `token_mixed_currency`, `token_local`,
`token_cache_zero`, `token_cache_not_reported`, `token_cache_unknown`,
`loading`, and `error`. Reset with:

```js
localStorage.removeItem('autobyteus.prototype.scenario')
location.reload()
```

Run proportional checks:

```bash
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test
corepack pnpm validate:boundaries
NUXT_IGNORE_LOCK=1 corepack pnpm build
corepack pnpm validate:token-statistics-final
```

The final browser validator passes 19/19 checks, including the approved six
equal summary peers, open-top 29-point line, filters and exact evidence,
Run-details semantics, truthful cache/state matrix, responsive/localized
behavior, accessibility/focus, and negative CSV/export assertions.

The source-versus-prototype validator requires the controlled source observer,
an exact temporary archive of the source pin, and both Nuxt dev servers. The
durable completed comparison is under `evidence/token-statistics-refresh/`;
the machine summary records the exact loopback URLs and matched environment.
No source observer, backend, Electron host, credential, or live service is
needed for ordinary prototype review.

## cross-scope-agent-mentions: `@` in a live run

Approved Product experience (ticket `tickets/done/cross-scope-agent-mentions/`). From the default
entry, open a run in Workspaces and type `@` in its composer:

- Team run: `prototype-workspace` → `Product Review Team` → `Review the current prototype baseline` → `researcher`
- Org run: `prototype-workspace` → `Product Launch Org` → `Coordinate the synthetic launch review` → `analyst`
- Standalone Agent run: `prototype-workspace` → `Research Assistant` → `Compare current navigation states` (or send a first message in Chat)

Sending plays a deterministic local run (`prototype/run-mentions/`); reload to reset. Validate with
`PROTOTYPE_BASE_URL=<url> node prototype/scripts/validate-cross-scope-agent-mentions.mjs`.

## Identity

- Package: `initial-prototype-baseline`
- Revision: `RER-017` independent-repository ownership of the approved
  `RER-009` correction; baseline pin established under `RER-002`
- Status: approved current-state baseline including the user-confirmed RER-009 correction (`PPA-002`)
- Approved source pin: `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Selected source repository: `/home/autobyteus/workspace/.codex/worktrees/initial-prototype-baseline/autobyteus-web`
- Prototype: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Owning repository: `https://github.com/AutoByteus/autobyteus-web-prototype.git`
- Owning branch: `personal`
- Canonical review URL: <http://127.0.0.1:3210>

The selected source worktree may be newer than the approved pin. Source-versus-prototype evidence must run from an exact export or detached worktree at `8ef282b...`; do not reset the selected source worktree and do not treat its current HEAD as correction authority.

The prototype is an isolated independent Git repository and root-level project.
Run both project and Git commands from
`/home/autobyteus/workspace/autobyteus-web-prototype`. The prototype is
ordinary tracked repository-root content, not a workspace package, nested
repository, submodule or gitlink; no backend or source checkout is required for
ordinary review.

## Clean Install And Run

Development:

```bash
cd /home/autobyteus/workspace/autobyteus-web-prototype
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 3210
```

Production-build review on any free loopback port:

```bash
cd /home/autobyteus/workspace/autobyteus-web-prototype
corepack pnpm build
PORT=3220 HOST=127.0.0.1 node .output/server/index.mjs
```

The independently runnable prototype needs no source observer, backend, Electron runtime, credentials, customer data, or network access after dependencies are installed. Monaco-backed viewers use the checked-in `public/prototype-assets/monaco/vs` mirror.

## Exercise The Corrected Team Launch Journey

Reset to the correction scenario from the browser console:

```js
localStorage.setItem('autobyteus.prototype.context', 'desktop')
localStorage.setItem('autobyteus.prototype.scenario', 'team_launch')
location.assign('/agent-teams?view=team-list')
```

Then:

1. Activate **Run** on `Product Review Team`.
2. Confirm navigation to `/workspace` and the Team launch draft.
3. Choose `/synthetic/prototype-workspace`.
4. Activate **Run Team**.
5. Confirm `Prototype Workspace` contains the selected `Product Review Team` row with `researcher` and `writer` members.
6. Activate the `/writer` member row and confirm it becomes selected while the center Team workspace header changes to `writer`.

The resulting IDs and state are synthetic and resettable. No real Team process starts.

## Select Other Scenarios

```js
window.__AUTOBYTEUS_PROTOTYPE__.setScenario('workspace_team_active', 'desktop')
location.assign('/workspace')
```

Examples:

```js
window.__AUTOBYTEUS_PROTOTYPE__.setScenario('empty', 'desktop')
location.assign('/agents?view=list')

window.__AUTOBYTEUS_PROTOTYPE__.setScenario('workspace_agent_error', 'desktop')
location.assign('/workspace')
```

The complete catalog is [prototype-scenarios.md](prototype-scenarios.md).

## Select An Electron Host Context

Electron-visible UI is a browser-side host simulation; no Electron package or process is present:

```js
localStorage.setItem('autobyteus.prototype.context', 'electron_internal')
localStorage.setItem('autobyteus.prototype.scenario', 'populated')
location.assign('/settings?section=extensions')
```

Use `electron_external` for the external-node window. Lifecycle scenarios include `electron_starting`, `electron_error`, `electron_restarting`, `electron_shutdown`, and `update_available`.

## Select Paired Mobile

Install the inert fixture session before `/mobile`:

```js
localStorage.setItem('autobyteus.remote_access.mobile_session.v1', JSON.stringify({
  version: 1,
  nodeId: 'mobile-paired-node',
  serverBaseUrl: 'http://127.0.0.1:4310',
  credential: 'prototype_mobile_session',
  device: {
    deviceId: 'prototype-phone', displayName: 'Prototype phone',
    clientFacingBaseUrl: 'http://127.0.0.1:4310',
    createdAt: '2026-08-22T04:00:00.000Z',
    lastSeenAt: '2026-08-22T04:00:00.000Z', revokedAt: null
  },
  pairedAt: '2026-08-22T04:00:00.000Z'
}))
localStorage.setItem('autobyteus.prototype.context', 'paired')
localStorage.setItem('autobyteus.prototype.scenario', 'mobile_team_active')
location.assign('/mobile')
```

## Reset

```js
localStorage.removeItem('autobyteus.remote_access.mobile_session.v1')
window.__AUTOBYTEUS_PROTOTYPE__.reset()
location.assign('/agents?view=list')
```

## Prototype Validation

```bash
cd /home/autobyteus/workspace/autobyteus-web-prototype
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test
corepack pnpm validate:boundaries
corepack pnpm build
corepack pnpm validate:gap-009-package
corepack pnpm validate:gap-010-package
corepack pnpm validate:independent-repository
```

Do not run `capture:final-references` or modify `ui-ux-spec.md` during bootstrap correction. Those are Product UI/UX Designer-owned post-acceptance artifacts.

## Reproduce PP-GAP-009 And PP-GAP-010 Source-Versus-Prototype Evidence

Create an exact temporary source export without changing the selected worktree:

```bash
SOURCE_REPO=/home/autobyteus/workspace/.codex/worktrees/initial-prototype-baseline/autobyteus-web
SOURCE_EXPORT=/tmp/autobyteus-pin-8ef282ba
rm -rf "$SOURCE_EXPORT"
mkdir -p "$SOURCE_EXPORT"
git -C "$SOURCE_REPO" archive 8ef282ba77705180d985e7000d801f0e0068cdc1 | tar -x -C "$SOURCE_EXPORT"
ln -s /home/autobyteus/workspace/.codex/worktrees/initial-prototype-baseline/node_modules "$SOURCE_EXPORT/node_modules"
```

Use three separate terminals:

```bash
# 1. Controlled source-observation node
cd /home/autobyteus/workspace/autobyteus-web-prototype
PROTOTYPE_MOCK_PORT=4311 corepack pnpm source-observation:start
```

```bash
# 2. Exact pinned source export
cd /tmp/autobyteus-pin-8ef282ba
BACKEND_NODE_BASE_URL=http://127.0.0.1:4311 \
ENABLE_APPLICATIONS=true \
corepack pnpm exec nuxt dev --host 127.0.0.1 --port 3110
```

```bash
# 3. Prototype
cd /home/autobyteus/workspace/autobyteus-web-prototype
corepack pnpm dev --port 3210
```

Then run:

```bash
cd /home/autobyteus/workspace/autobyteus-web-prototype
SOURCE_BASE_URL=http://127.0.0.1:3110 \
PROTOTYPE_BASE_URL=http://127.0.0.1:3210 \
MOCK_BASE_URL=http://127.0.0.1:4311 \
corepack pnpm validate:gap-010
```

Expected result: `JRN-050-A`–`JRN-050-E` all pass; `gap-010-summary.json` reports five passed checkpoints, no failures, zero source/prototype browser errors, and `journeyContractPassed: true`. The preserved `validate:gap-009` command remains available for the earlier four-checkpoint launch-only evidence.

## Capture And Validate The Approved Final Package

After explicit user confirmation and from the production-build review server:

```bash
cd /home/autobyteus/workspace/autobyteus-web-prototype
PROTOTYPE_BASE_URL=http://127.0.0.1:3210 corepack pnpm capture:final-references
corepack pnpm validate:gap-009-package
corepack pnpm validate:gap-010-package
corepack pnpm validate:final-package
```

Expected result: `VIS-001`–`VIS-017` capture without browser errors or external resources; the first 15 approved hashes remain exact; `VIS-016` and `VIS-017` anchor launch-ready and launched-writer-focus states; correction package checks pass 20/20 and 25/25; terminal final-package checks pass 86/86.

## Process Isolation

Use one terminal per long-running process and stop it with `Ctrl-C`. Evidence ports are correction-only. Ordinary prototype review needs only the prototype. Mutable state is browser-local and resettable; the source observer accepts only loopback synthetic requests; no process writes to production services.
