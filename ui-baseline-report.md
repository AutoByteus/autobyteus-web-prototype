# UI Baseline Report

## Scoped refresh `WEB-BASELINE-REFRESH-015` (read this first)

**The baseline pin is still `d74f75a51ab7dc47d42a13f33e0f943c3a230ad7` for the whole frontend, with two further scoped exceptions: Settings menu and GitHub card
(`e4bebdc858`, see the next section) and now Nodes → Manage Nodes, which reflects `3b9dc912a14a19029db500c7e6bde1eb30725fd4` (beta v1.5.11-beta.10, branch
`codex/manage-nodes-professional`, checked out read only at `/Users/normy/autobyteus_org/autobyteus-worktrees/manage-nodes-professional/autobyteus-web`).**
The whole-frontend pin did not move. Everything below this section still describes `d74f75a` (or `e4bebdc858` where the next section says so), except Manage Nodes.

- Request: Refresh (scoped), selected by the Product UI/UX Designer, ticket `WEB-BASELINE-REFRESH-015`, branch `design/web-baseline-refresh-015`, worktree
  `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-015`, accepted design base `2f31380eb93ff5e22f1fc1594ed3c052cb988b2b`
  (worktree `HEAD` `2f31380e`). Design repository `/Users/normy/autobyteus_org/autobyteus-web-design`.
- Status: `Completed` (a candidate: uncommitted changes in the ticket worktree; the Bootstrapper made no commit; integration into the default branch follows the Product UI/UX Designer's acceptance).
- Scope: the Nodes → Manage Nodes surface (`/nodes?nodeTab=manage`) only. `git diff d74f75a51a 3b9dc912a1` touches these UI files of it: `components/settings/nodes/NodeRow.vue`,
  `components/settings/nodes/NodeServerUpdate.vue` (new), `stores/nodeServerUpdateStore.ts` (new), `localization/messages/{en,zh-CN}/nodesPage.ts` (18 new `update.*` strings each).
  What is new for the user: under the row of each remote node this window reaches, its **server version** ("Server 0.0.9-prototype"), an **"Update to <version>"** button
  when the node is older than this app and can update in place, the update's progress (checking, downloading, preparing, restarting), "Restarting…" and "Not reachable.", the result,
  and warning notices (a blocker, a refusal, a failure) with a **Copy command** button where the node needs a new image.
- Not refreshed, though the range changed it (outside the selected surface; it still shows `d74f75a`): the **Docker Guide** tab got one more command (`direct-update-all`, "Update the server in all
  Docker nodes": `utils/dockerNodeLauncherCommands.ts`, `DockerNodeStartGuideCard.*.commands.updateAll.*` strings of `settings.ts`) and the **NFS Guide** tab's texts were shortened
  (`NfsGuideCard`, `settings.ts`). Both tabs are on the same page but are other surfaces; they are a decision for the Product UI/UX Designer (one more refresh request if wanted).
  Also unrefreshed: all other changes of the 454 files in the range.

### What was done

- Copied unchanged from `3b9dc912a1` (byte-identical, checked with `cmp`): `components/settings/nodes/NodeRow.vue`, `components/settings/nodes/NodeServerUpdate.vue`,
  `stores/nodeServerUpdateStore.ts`, `localization/messages/en/nodesPage.ts`, `localization/messages/zh-CN/nodesPage.ts`. No accepted design-only change touches these files (before the copy the baseline's
  `NodeRow.vue` and `nodesPage.ts` were the `d74f75a` ones), so nothing was reconciled and nothing was added to the design.
- `plugins/00.prototype-state.client.ts`: `nodeServerUpdate` joins `sourceLoadedStores` (the source's own store runs; the plugin must not stub its actions), exactly like `nodeList`.
- **Simulation of the node's `GET/POST /rest/node-update`** (the production capability: each node's server reports its version and updates itself in place), in the existing simulated node network
  `prototype/nodes/network-world.mjs` (`windowRequest`, path `/rest/node-update`). The store's own `fetch` goes through the existing `node-network-fetch.js`, so nothing else changed. Each node
  carries a scripted `server` entry (version, whether this app is newer than the node, `available` / `unavailable` / `error` / no endpoint, optional blocker, how a requested update goes). A requested update plays on a
  fixed timeline from the request: checking 0–3 s, downloading 3–7 s, preparing 7–10 s, restarting 10–13 s, then no answer until 19 s, then the node answers with the new version and a
  succeeded result. `failed` stops at 7 s; `lost` stops answering at 13 s for good; `refused` answers HTTP 409 with `NEEDS_NEW_IMAGE`; `undelivered` answers HTTP 500 with no message. No process is started, nothing is
  downloaded, nothing is contacted; state is in memory and a reload resets it.
- This app's version for the offer is the simulated desktop's (`0.1.0-prototype`, `install-host-scenario.js`, unchanged). In a plain browser window (no desktop host) the app has no version, so nodes answer without a target
  and show only "Server <version>" with no offer (same in the source). All versions, notices and messages the node supplies ("Agents are running on this node…", "The download stopped…") are invented and illustrative.
- `prototype/source-observation/fixtures.mjs`: seven new scenario names in `scenarioCatalog` (the observation node and the baseline share the world). `package.json`, `pnpm-lock.yaml`, `nuxt.config.ts`, `tsconfig.json` unchanged.

### Scripted outcomes (the update button; the UI reference has no backend)

- Docker 8001 ("docker") is older than the app in every Nodes scenario: it shows "Server 0.0.9-prototype", **Update to 0.1.0-prototype**, "Same version as this app". Click: "Starting the update…", then
  "Checking the update to 0.1.0-prototype…", "Downloading 0.1.0-prototype…", "Preparing 0.1.0-prototype…", "Restarting…" (twice: while the node still answers, then while it does not), and finally "Server 0.1.0-prototype" with the green
  "Updated to 0.1.0-prototype." (about 20 s in all). A node added after (8003, 8004, 8005) shows "Server 0.1.0-prototype".
- The other scenarios change only Docker 8001's script (below). **Copy command** copies `autobyteus-docker upgrade --all --tag 0.1.0-prototype` and reads "Copied" for 2 s.

### Starting-state selection (scenarios)

Set in the browser console, then reload (remove the keys to reset): `localStorage.setItem('autobyteus.prototype.scenario', '<name>')` and `localStorage.setItem('autobyteus.prototype.context', 'electron_internal')`
(a desktop window on the embedded node; `electron_external` = a window opened on Docker 8001; remove the context key = a browser). Chinese: `localStorage['autobyteus.localization.preference-mode']='zh-CN'`.

| Scenario | Starting state of Manage Nodes |
| --- | --- |
| `nodes_user` | the happy path above (Docker 8001 older, offer, a full update) |
| `nodes_states` | one row in each collaboration state plus each server state: docker (offer), studio ("Server 0.1.0-prototype" only), spare (different node answering: "Server 0.1.0-prototype"), nas (an older server with no update endpoint: "Not reachable."), 8003 (blocker notice in amber, no button), laptop (a node newer than the app: "Newer than this app. Update this app.") |
| `nodes_update_refused` | the click is refused: "The update to 0.1.0-prototype did not happen. This node runs an image that cannot update itself." + Copy command |
| `nodes_update_failed` | the update stops while downloading: "The update to 0.1.0-prototype did not happen. The download stopped before it finished." and the button is offered again |
| `nodes_update_lost` | the node goes away while restarting: "Restarting…"; after 5 minutes "Not reachable. Last known: updating to 0.1.0-prototype." |
| `nodes_update_undelivered` | the request is answered with an error without a message: "… did not happen. HTTP 500" |
| `nodes_update_running` | an update started from another window is already running at page open ("Checking the update to 0.1.0-prototype…"), then the result is shown |
| `nodes_update_error` | the node's update service reports an error: its own message under the version, no button |
| `nodes_update_unknown` | "Server version unknown", no button |

The embedded node's row (This node card) shows no server line (the source has none: `v-if="!row.isEmbedded"`); a row whose node this window does not reach shows none either.

### Inventory and comparison (source `3b9dc912a1` vs baseline, matched)

Conditions: both run in the same browser; each compared state is a fresh 1440×900 same-origin frame (and 656×900 for narrow), same scenario, same simulated desktop context and, for zh-CN, same locale preference; the pinned source is an exact
`git archive` export of `3b9dc912a1` (scratch `/tmp/r015/src`) with a disposable harness plugin that installs the same host bridge and the same node-network fetch, served by the observation node (`mock-node.mjs`) that answers from the same
`network-world.mjs`. Compared per component: the server block's element tree, own text, rectangle relative to its row, 23 computed style properties of every element, titles and disabled state, spinner rotation ignored. "Identical" below means no difference in any of these.

| ID | Surface / state | Result |
| --- | --- | --- |
| NU-01 | Server version + offer (button, "Same version as this app"), 1440 | pass: identical |
| NU-02 | Click: "Starting the update…" (busy button), checking, downloading, preparing, "Restarting…" while answering, "Restarting…" with no answer, result "Updated to …" (green) with the new version | pass: every state identical (the 'starting' instant is one request long and was checked by its markup, which is the copied component's own) |
| NU-03 | Rows of `nodes_states`: version only; different node; no endpoint ("Not reachable."); blocker notice (amber); node newer than the app, 1440 and 656 px | pass: identical |
| NU-04 | Refusal notice with **Copy command**; Copy → "Copied" → "Copy command" after 2 s (the clipboard write stubbed in both frames, because an unfocused frame refuses it), 1440 and 656 px | pass: identical, the copied text is the same |
| NU-05 | Failed update notice + button offered again; undelivered ("HTTP 500"); node error message; "Server version unknown" | pass: identical |
| NU-06 | Update already running at page open, then success | pass: identical |
| NU-07 | Node lost: "Restarting…", then "Not reachable. Last known: updating to …" (the clock of the frame advanced by 6 minutes in both) | pass: identical |
| NU-08 | Browser window (no desktop host): "Server <version>" only; embedded window `electron_external`: no server lines | pass: identical |
| NU-09 | zh-CN: all of the above strings (offer, steps, "无法访问。", "比本应用新。请更新本应用。", refusal and failure notices with "复制命令", success "已更新到 …。") | pass: identical (the node-supplied messages stay English in both) |
| NU-10 | The rest of the Manage Nodes page (This node card, Add node, rows' other parts) | unchanged: `pages/nodes.vue`, `NodeManager.vue`, `NodeList.vue`, `ThisNodeCard.vue`, `AddNodePanel.vue`, `NodeConnectionDetails.vue`, `nodeListStore.ts` and the other node files are byte-identical to `3b9dc912a1`; one load-and-look pass |

Evidence (screenshots, the 717 px browser window: the narrow layout, the same scenario `nodes_states`, English): `evidence/WEB-BASELINE-REFRESH-015/source-3b9dc91-manage-nodes-states-narrow.png` and `baseline-manage-nodes-states-narrow.png`.
Comparison was done in the browser with disposable in-page scripts and a disposable receiver under `/tmp/r015`; nothing was added to the repository for it.

### Run

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4960
```

Review URL `http://127.0.0.1:4960/nodes?nodeTab=manage` with `nodes_user` + `electron_internal` (see the scenario table). Source observation (all disposable): `git archive` of `3b9dc912a1` (`autobyteus-web` and the four contract packages, the contract packages rebuilt with `tsc`),
`BACKEND_NODE_BASE_URL=http://127.0.0.1:4963 ENABLE_APPLICATIONS=true nuxt dev --port 4962`, backed by `PROTOTYPE_MOCK_PORT=4963 PROTOTYPE_SCHEMA_PATH=<source>/autobyteus-web/generated/graphql.ts node prototype/source-observation/mock-node.mjs`
(synthetic fixtures only; scenario and context changed with a POST to `/__prototype/scenario`). The source checkout was only read. All processes I started were stopped.

### Known gaps

- Docker Guide's new "Update the server in all Docker nodes" command and the NFS Guide's shortened texts are not refreshed (see Scope).
- The real update takes minutes and depends on the node's image; here it plays in about 20 s and is scripted. Nothing about the production update (download, restart, rollback, the node's starter) was validated.
- The 5-minute wait before "Not reachable. Last known: …" is the source's; it was checked by advancing the frame's clock, not by waiting.
- No other known UI parity difference for the Manage Nodes surface.

---

## Scoped refresh `WEB-BASELINE-REFRESH-014`

**The baseline pin is `d74f75a51ab7dc47d42a13f33e0f943c3a230ad7` for the whole frontend, except two surfaces, which reflect
`e4bebdc8585e070ab63992e4b427c41a11aabfa9` (`origin/personal` as checked out in the selected frontend's worktree
`/Users/normy/autobyteus_org/autobyteus-worktrees/integrations-page`, read only).** The whole-frontend pin did not move. Everything below this
section (the `WEB-BASELINE-REFRESH-013` report) still describes `d74f75a`, except where this section says otherwise.

- Request: Refresh (scoped), selected by the Product UI/UX Designer. Ticket `WEB-BASELINE-REFRESH-014`, branch `design/web-baseline-refresh-014`,
  worktree `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-014`, accepted design base
  `752b6b816c01350280f87cbd994146b8ff03832b`. Design repository `/Users/normy/autobyteus_org/autobyteus-web-design`.
- Status: `Completed` (a candidate: uncommitted changes in the ticket worktree; the Bootstrapper made no commit; integration into the default branch follows the Product UI/UX Designer's acceptance).
- Scope (only surfaces whose UI files changed in `d74f75a..e4bebdc858` and that a coming design touches):
  1. **Settings → Server Settings → Basics → GitHub card** (`components/settings/GitHubIntegrationCard.vue`, new, mounted in `ServerSettingsBasicsPanel.vue` after the web-search card).
  2. **Settings left menu** (`pages/settings.vue`): the icons beside the section names are gone; the Server Settings sub-list indent moved from `ml-10` to `ml-2`.
- Not refreshed, though the range changed them (the request excluded them): the Server Settings → Advanced table's Save button lost its check icon
  (`ServerSettingsManager.vue`); the NFS Guide card's texts were shortened (`NfsGuideCard`, `settings.ts` NfsGuideCard keys; the Advanced/deferred/limitations
  notes were removed); all other changes of the 341 files in the range (Memory, MCP forms, Tools, voice input removal, and others). These surfaces still show `d74f75a`.

### What was done

- Copied unchanged from `e4bebdc858` (byte-identical, checked with `cmp`): `pages/settings.vue`, `components/settings/GitHubIntegrationCard.vue`,
  `components/settings/ServerSettingsBasicsPanel.vue`, `stores/githubIntegrationStore.ts`, `graphql/queries/githubIntegrationQueries.ts`,
  `graphql/mutations/githubIntegrationMutations.ts`. The 29 `GitHubIntegrationCard.*` strings of `localization/messages/en/settings.ts` and `zh-CN/settings.ts`
  were added (identical to the source's).
- The source's own store runs against the local fixture layer (`githubIntegration` joins `sourceLoadedStores` in `plugins/00.prototype-state.client.ts`;
  `utils/apolloClient.ts` answers the GitHub query and mutations locally).
- New fixture module `prototype/source-observation/github-integration-fixtures.mjs` (hand-written, invented values; no GitHub contact, no vault, no real
  account; in-memory per browser load, reset by a reload and by switching scenario). The account (`synthetic-octocat`), the connection date (20 Aug 2026)
  and the agent names are illustrative. The observation node (`mock-node.mjs`) answers from the same module, so source and baseline show the same outcome.
  `mock-node.mjs` also accepts `PROTOTYPE_SCHEMA_PATH` (the schema file of the source being observed, since the repository's `generated/graphql.ts` is the older pin's).
- `fixtureState`/`applyScenario` reset `state.github`; the plugin's replaced `fetchAllAgentDefinitions` empties the agents in the `empty` scenario (the card's "No agents yet." state).
- `package.json`, `pnpm-lock.yaml`, `nuxt.config.ts`, `tsconfig.json` unchanged.

### Scripted outcomes (the card's actions; the UI reference has no backend)

- Save with a token containing `reject` → "GitHub rejected the token." (red); containing `offline` → "The token could not be checked with GitHub. Try again.";
  any other token → connected as `@synthetic-octocat`, the field clears, "GitHub connected as @synthetic-octocat.", the label becomes "Replace token", Test/Remove and "Connected since …" appear. Enter in the field saves too.
- Test → "The token works: @synthetic-octocat." Remove → "GitHub token removed. The agent choices are kept." and the card goes back to Not connected. Ticking or unticking an agent changes the list (no message).
- Starting states (browser console, then reload; remove the key to reset): `localStorage.setItem('autobyteus.prototype.scenario', '<scenario>')`:
  default = not connected, agents listed; `github_connected` (connected, two agents ticked); `github_load_failed` ("Failed to load the GitHub connection."); `github_test_rejected` (connected; Test shows "GitHub rejected the token.");
  `github_vault_unavailable` (Save and Remove refused: "The secret vault is unavailable, so the token cannot be changed."); `github_agents_fail` (connected; a tick shows "Failed to save the agent choice."); `empty` ("No agents yet.").

### Inventory and comparison (source `e4bebdc858` vs baseline, matched: desktop frame 1440×900, narrow 656 px, English and zh-CN, design-only layers off in the baseline so the agent catalog is the same three invented agents)

| ID | Surface / state | Result |
| --- | --- | --- |
| GH-01 | Settings menu, all 12 items and the Server Settings sub-list (no icons, sub-list indent), 1440 and 656 px, en and zh-CN | pass: row text, rectangles, padding, font, colors identical |
| GH-02 | GitHub card, not connected (title, description, chip, token field, hint, Save disabled, agent list) | pass: component tree, geometry, computed styles identical |
| GH-03 | Card, connected (chip green, "Replace token", Test, Remove, "Connected since", ticks) | pass: identical |
| GH-04 | Save: typed (enabled), busy, rejected token, token check failed, accepted by button and by Enter | pass: every settled state identical; the 5 ms busy snapshot differs only because the observation node answers faster than the baseline's deliberate 40 ms delay (the busy markup is the card's own: spinner, disabled field and button, checked in the baseline) |
| GH-05 | Test (busy "Testing…", passed), Test rejected | pass |
| GH-06 | Remove, replace-typed, agent tick/untick, agents-save failure | pass |
| GH-07 | Load failed; vault unavailable on Save; no agents | pass (after one fix: the baseline's `empty` scenario now empties the agents) |
| GH-08 | zh-CN card text, 656 px card | pass |

Evidence (screenshots, 1440 wide frame, connected state and menu): `evidence/WEB-BASELINE-REFRESH-014/` (`source-e4bebdc-*`, `baseline-*`). Comparison was done in the browser through
same-origin 1440×900 frames (the browser tool's own window is 717 px wide) with disposable in-page scripts; nothing was added to the repository for it.

### Run

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4830
```

Review URL `http://127.0.0.1:4830/settings?section=server-settings&mode=quick` (the GitHub card is below the web-search card). Source observation: an exact `git archive` of `e4bebdc858`
(`autobyteus-web` and the contract packages, scratch under `/tmp/r014/src`) served with `BACKEND_NODE_BASE_URL=http://127.0.0.1:4833 nuxt dev --port 4832`, backed by
`PROTOTYPE_MOCK_PORT=4833 PROTOTYPE_SCHEMA_PATH=<source>/autobyteus-web/generated/graphql.ts node prototype/source-observation/mock-node.mjs` (synthetic fixtures only; scenario changed with a POST to `/__prototype/scenario`).
The source checkout was only read. All processes I started were stopped.

### Known gaps

- Surfaces listed under "Not refreshed" show `d74f75a`, not `e4bebdc858`. No other known UI parity difference for the two surfaces.
- With the design-only example layers on (the default), the agent tick list shows the design examples' larger catalog (scrolling at 224 px); illustrative data only.

---

Whole-frontend refresh of the AutoByteus Web current-experience baseline from `origin/personal@9e7a458` to
`origin/personal@d74f75a51ab7dc47d42a13f33e0f943c3a230ad7`, for Product ticket `WEB-BASELINE-REFRESH-013`. The previous report
(`WEB-BASELINE-REFRESH-012`, pin `9e7a458`) is kept in Git history at accepted base `5f5fb4c`.

## Status

- Status: `Completed`
- Request type: `Refresh`
- Refresh request: the Product UI/UX Designer selected `origin/personal@d74f75a51ab7dc47d42a13f33e0f943c3a230ad7` as the single pin for the
  whole selected frontend (previous pin `9e7a45880865912442f4188e6d2a58d99b10a54c`).
- Refresh policy: where the source implements a surface the design had changed, the source wins; accepted design-only changes with no source
  equivalent are preserved (same as `WEB-BASELINE-REFRESH-012`).
- Result:
  - The baseline mirrors `d74f75a` and runs on its own in a browser with synthetic data.
  - New in the source and added: **Settings → Model Routing** ("Agent runtimes now"), the **"Show internal agents"** and **Claude one-hour
    cache** cards (Server Settings → Basics), Project **Task titles and comments**, the **NFS Guide** tab, runs on other nodes in the Workspaces tree
    with their conversation, composer and panel notes, and the remote-node variant of Agent Runtimes (Sign in where a desktop browser can open).
  - Shipped by the source, so its own components replace the design-only ones: `one-nodes-tab` (Nodes → Manage Nodes), `remote-runs-in-tree`
    (remote rows and views) and `update-checks-and-auto-updates` (check intervals, automatic-update switches, outcomes, app check).
  - Changed by the diff and carried: the changed delegated-copy rows (`utils/runSettings/delegatedLaunchRows.ts`), the Token cost breakdown's
    5-minute / 1-hour cache-write rows, the Phone Setup tab's node ID, internal-agent badge on Agent cards, run titles from the stored title.
  - Removed by the source and removed here: Nodes → Remote Collaboration (now inside Manage Nodes), `CurrentWindowNodeCard`,
    `RemoteCollaborationCard`, `RemoteCollaborationPeersSection`, `utils/projects/taskSummary.ts`.
  - Every new or changed surface was compared in the browser against the pinned source, with no known UI parity difference.
- Integration: this is a candidate (uncommitted changes in the ticket worktree, `HEAD` `a01ecb8`, the Product ticket-open commit). The design
  project (`personal`, at `5f5fb4c`) carries it only after the Product UI/UX Designer accepts it and integrates it into the default branch.
- Next expected action: the Product UI/UX Designer reviews the candidate and decides the reference questions below, integrates it into
  `personal`, records that in the baseline ticket; the design `delegated-runtime-model-routing` then merges `personal`.

## Source Identity

- Source project: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`; selected frontend `autobyteus-web`.
- Governing revision authority: the explicit pin in the request (`origin/personal`). Pinned revision `d74f75a51ab7dc47d42a13f33e0f943c3a230ad7`;
  previous pin `9e7a45880865912442f4188e6d2a58d99b10a54c`. Range `9e7a458..d74f75a`: 407 changed files under `autobyteus-web` (126 added,
  269 modified, 10 deleted, 2 renamed); of the contract packages only `autobyteus-agent-presentation-contracts`,
  `autobyteus-collaboration-stream-contracts` and `autobyteus-team-stream-contracts` changed (remote task executions), and they are updated in `vendor/`.
- The source checkout was neither used for observation nor modified, and nothing was pulled.
- Applicable repository instructions: the superrepo `AGENTS.md`, the design repository `README.md` and `ui-reference-runbook.md`.
- Source observation: an exact `git archive` export of the pin at `/tmp/r013/src/` (`autobyteus-web` and the contract packages), with
  `node_modules` linked read-only to the existing source install, served with
  `BACKEND_NODE_BASE_URL=http://127.0.0.1:4823 ENABLE_APPLICATIONS=true nuxt dev --host 127.0.0.1 --port 4822`, backed by
  `PROTOTYPE_MOCK_PORT=4823 node prototype/source-observation/mock-node.mjs` (synthetic fixtures only).

## Baseline & Repository Identity

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Product ticket: `WEB-BASELINE-REFRESH-013`; branch `design/web-baseline-refresh-013`
- Product-owned target worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-013`
- Accepted design base revision: `5f5fb4c9d1f0f1c6477653359d3952363ea728a7`. Worktree `HEAD` `a01ecb8` is the Product ticket-open commit.
- Bootstrap candidate: uncommitted working-tree changes; the Bootstrapper made no commit. `package.json`, `pnpm-lock.yaml`, `nuxt.config.ts`
  and `tsconfig.json` are unchanged (design-owned). The source's `xlsx` dependency moved to a vendor tarball; the baseline keeps `xlsx@0.18.5`
  (the viewer's code is unchanged and renders the same).
- Install command: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start command: `corepack pnpm dev --port 4820`
- Review URL: `http://127.0.0.1:4820/settings?section=model-routing` and the entries in `ui-reference-runbook.md`, section `WEB-BASELINE-REFRESH-013`
- Built preview: `corepack pnpm build && PORT=4821 HOST=127.0.0.1 node .output/server/index.mjs`
- Framework, language, styling: Nuxt 3, Vue 3, TypeScript, Tailwind (the source's own).
- Scenario selection and reset: local-storage keys `autobyteus.prototype.scenario` (fixture set) and `autobyteus.prototype.context`
  (`desktop`; `electron_internal` = the desktop's own node; `electron_external` = a window opened on Docker 8001). A reload resets all in-memory
  state. Comparison runs set `autobyteus.prototype.designOnlyLayers` to `off` (all design-only data off) or `no-reconnect` (the earlier designs' example data on).
- New scenarios: `routing_empty`, `routing_load_failed`, `routing_check_fails`, `routing_unknown`, `runtimes_remote_desktop`, `settings_save_fails`;
  `updates_auto_on`, `updates_outcomes_only`, `updates_backoff`, `updates_discover`, `update_*` are now listed in the observation node as well.
- Ports used: 4820 (baseline dev), 4821 (built preview), 4822 (source), 4823 (observation node). 3210 and 4781–4790 were not used.
  I stopped only processes I started.

## Experience Boundary

- Included UI boundary: the whole `autobyteus-web` frontend. This refresh worked from the diff.
- Surfaces added or changed by the diff: Settings → Model Routing; Server Settings → Basics (two cards, Update checks with intervals and automatic
  updates); Notification Center (automatic-update switches, outcomes, runtime rows, no-effect and applying notes, confirmation); Settings → Updates
  (automatic check, failure note); Settings → Agent Runtimes (remote node access); Nodes → Manage Nodes (This node card, node list, add form, rows,
  connection details, change address, the change dialog, rename, remove, Docker address hint), Phone Setup, NFS Guide; Workspaces tree rows,
  opened view, composer, right panel notes and Stop for runs on other nodes; Run settings' delegated copies; Agents (Internal badge);
  Projects (Task title, comments, validation, search); Token Statistics cost breakdown.
- Materially different contexts: browser window; the desktop's own node; a window opened on a remote node (Docker 8001); left panel docked,
  collapsed (strip) and in the narrow drawer; zh-CN; 390 px.
- Excluded: Electron, the server, other nodes, real update and runtime mechanisms, real pairing. They are not part of a UI reference.

## UI Experience Inventory

All rows were compared in headless Chrome, source against baseline, under matched viewport, locale, UTC time zone, light theme, reduced
motion and the same synthetic scenario, each side starting fresh. Domain values (names, versions, counts, times, node IDs, offers) are
illustrative synthetic fixtures; UI-controlled text, including the template text around values, is exact.
Evidence: `evidence/WEB-BASELINE-REFRESH-013/flows/` and `matrix/` (source and baseline screenshots, results JSON; `results-latest.json` is the
latest result per ID).

A row passes when the visible text, route and a per-component element probe (tag, role, text, geometry, computed color, background, font size and
weight, disabled) match, the screenshot differs at most by edge anti-aliasing or by a live clock time, the baseline shows no browser error or
non-local request, and the flow's own state is on screen on both sides. The results files also hold first runs that failed and were then fixed; the
result per flow is the latest one.

| ID | Route / surface | Exact obligations | States / operations / outcomes | Scenario / fixture (illustrative values) | Result |
| --- | --- | --- | --- | --- | --- |
| MR-001–014, NAR-001, ZH-001 | Settings → Model Routing | title, description, "Agent runtimes now", node line ("This computer" / "Remote node"), Checked time, Check again, runtime rows with limits (bars, "% left", "resets …"), model lists (count, blocked, context), sign-in note, AutoByteus providers (balance, cannot run, unknown), loading, read error, "Couldn't check again" note, empty text | open; Check again; the first read fails then Check again; Check again fails after a good read; unknown; empty; remote node; 390 px; zh-CN; entry from the Settings menu | default, `routing_*`; invented runtimes, limits, models, balances, times | `Pass` |
| NOD-001–057, NAR-002, NOD-052/053 | Nodes → Manage Nodes | This node card with the collaboration switch and the rules; node list; add form (validation, duplicate, unreachable, slow, not AutoByteus, checking); each row's dot, line, fix button, Agents/Teams counts, offers; Connection details (directions, steps, Check again, change address); the change dialog (turn on, finish, turn off, remove; steps, partial failure, Try again); rename (valid, taken, invalid); remove; Open; the Docker hint and Docker Guide link; the switch off and on | all of the above in `nodes_user` and `nodes_states`; the desktop's own window, the Docker window, a browser; zh-CN; 390 px | the simulated network of nodes `prototype/nodes/network-world.mjs` (invented nodes, addresses, IDs, offers, delays) | `Pass` |
| PHN-001–002, NAR-006, MEM-001, NFS-001, NAR-007, ZH-002 | Phone Setup, Memory Sync and NFS Guide tabs | tab content and the new NFS Guide tab | load; 390 px; zh-CN | default; invented Phone Access settings, addresses and a paired device | `Pass` |
| RUN-010–032, HST-001–003, NAR/RUN-028 | Workspaces tree, run views for runs on other nodes | node chip, titles, "Couldn't reach …", Retry ("Checking …"), expand a remote Team, opened view of a working member (a new tool call and message arrive), idle and offline, composer placeholder and text-only box, panel notes in Files, Terminal, Artifacts and VNC, file path note, send and the answer, send to an unreachable node (error block), Stop (and its failure), Run settings listing local copies only, `@` offers nothing in a remote run | default (design example data), `remote_states`; zh-CN; narrow strip | invented nodes `docker`, `office-mac`, runs, conversations, timings | `Pass` |
| BAS-001–011 | Server Settings → Basics | "Show internal agents" and Claude one-hour cache cards (switch, saving, error), internal agent in Agents with its badge and details, the card order and Update checks width | on, off, save fails, then the Agents list; zh-CN; 390 px | default, `settings_save_fails`; invented Agent Architect | `Pass` |
| UPD-001–044 | Notification Center, Update checks card, Settings → Updates | sidebar pill and tooltip, panel sections (software, runtimes, packages, skills), the automatic-update switch per section, its confirmation (turn on, Cancel, Esc), applying and no-effect notes, outcome rows (updated, failed, waiting for agents), Clear, intervals (saved, refused), GitHub wait, checks off, remote-node and browser windows, the app check rows | `updates_*` (waiting, many, one, off, auto on, outcomes only, backoff, discover), `update_*`; strip and narrow drawer; zh-CN; 390 px | invented packages, skill sources, runtimes, versions, times | `Pass` |
| RTM-030–039 | Settings → Agent Runtimes | node access (own, remote with a desktop browser, status only), Sign in on a remote node and its wording, the existing states | `runtimes_*`, `runtimes_remote_desktop` | invented versions | `Pass` |
| PRJ-001–050, NAR-004, ZH-003 | Projects: board, Task page, Task editor, Temp tasks | Task title (required, validation) and description, comment thread (numbered, times, add, empty), search over titles, delete, the right-panel Projects tab | create, edit, comment, validation, search, delete; zh-CN; 390 px | default; invented Tasks | `Pass` |
| TOK-001–003 | Token Statistics | cost breakdown with 5-minute and 1-hour cache-write rows | analytics, Run details, expanded rows | one invented writer aggregate carries the split | `Pass` |
| MTX-001–088 | Every route and scenario of the earlier matrix, load-and-look | unchanged surfaces still match the pin | 88 captured route and scenario pairs (desktop en; mobile paired and unpaired) | | `Pass` (see note) |

Note on the matrix: MTX-046 differs in two anti-aliased pixels (value 9 of 255). MTX-070 (the `error` scenario) is text and pixel identical; my
strict check reports a failure only because the two sides log their console error lines differently. MTX-017/018 (Applications) first failed because
my source export lacked one contract package build; after fixing the export they pass. Flows reported as `fail` in the results files for
clock times (`Checked 05:08`, `10/26/2026, 5:53:46 AM`, the GitHub wait time) differ only in a live clock value on both sides.

## Journey Inventory

| Journey | Starting scenario | Source and baseline outcome | Evidence | Result |
| --- | --- | --- | --- | --- |
| A node is added and connected (including a node that fails halfway and is finished with Try again) | `nodes_user` | add → confirmation → steps → connected; `8005` stops answering on its first write, then Try again finishes | NOD-015–019 | `Pass` |
| A node is renamed, its address changed, removed | `nodes_user` | rename (valid, taken, invalid), change address (refused, same), remove with the dialog | NOD-027–037 | `Pass` |
| A state of a node is fixed from its row | `nodes_states` | Turn on there, Register this node there, Check again, Turn on | NOD-040–047 | `Pass` |
| A run on another node is opened, answered, stopped, retried | default | open, live update, send and answer, Stop, Retry, unreachable send | RUN-012–025 | `Pass` |
| An automatic update is switched on | `updates_waiting` | switch → confirmation → applying → outcomes (packages; runtimes without confirmation) | UPD-007–010 | `Pass` |
| "Show internal agents" is turned on | default | switch → Agents lists the internal agent | BAS-002–004, BAS-010–011 | `Pass` |
| A Task is created, edited, commented | default | title and description validation → saved → comment added | PRJ-010–025 | `Pass` |
| A remote runtime is signed in | `runtimes_remote_desktop` | Sign in → waiting → signed in | RTM-032–033 | `Pass` |

## Exact Visual Fidelity Comparison

Each flow above is a visual comparison: source and baseline screenshot, element probe and text under the matched conditions listed before the
inventory. Remaining difference: `None`. Raw differences were 0 pixels on all but a few rows; the rest are edge anti-aliasing (at most 19 of 255),
a live clock value, or a transition caught at a different frame (at most a few hundred pixels).

## Implementation Simplifications

| Visible capability | Visible experience preserved | Baseline simulation | Production mechanism intentionally absent |
| --- | --- | --- | --- |
| Other nodes (identity, settings, peers, offers, availability, failures) | every row state, line, step, confirmation, failure text, the Docker hint | `prototype/nodes/network-world.mjs` (in-memory state of all nodes) answered through `utils/apolloClient.ts` and, for direct requests to another address, `prototype/shared/node-network-fetch.js` | any request to a node |
| Runs on other nodes | rows, titles, statuses, views, composer, notes, Stop, Retry | `remote_task_executions` in the Project Task Manager run's view and `remote_task_execution_summary` events (`prototype/remote-runs/remoteRunsFixture.ts`) through the local WebSocket | the delegating node's server |
| Available agent runtimes | limits, models, blocked, unknown | `AvailableAgentRuntimes` from `node-settings-fixtures.mjs` | reading each runtime live |
| Update automation | switches, confirmation, outcomes, intervals, applying | `node-settings-fixtures.mjs` (scripted passes after a few seconds; the product: within about a minute) | background checks, vendor updates |
| Server settings | the two switches and the internal agent | in-memory settings (`fixtures.mjs`) | persistence |
| Phone Setup REST | switch, addresses, devices, QR | `prototype/source-observation/rest-fixtures.mjs` through an axios adapter in `plugins/00.prototype-state.client.ts` | pairing |

- Presentation code reused: all of the source's components, stores, composables, styles, messages and connectors for these surfaces, unchanged.
  A byte audit against the pin: 1122 presentation files are identical; the ones that differ are the Reconnect design-only change (7 component
  files with its hook, 2 localization index files, and its own files) and `utils/apolloClient.ts` (answers the mutations and queries locally).
  `package.json`, `pnpm-lock.yaml`, `nuxt.config.ts` and `tsconfig.json` are design-owned and unchanged.
- Baseline-owned changes in this refresh:
  - New: `prototype/nodes/network-world.mjs`, `prototype/shared/node-network-fetch.js`, `prototype/source-observation/rest-fixtures.mjs`.
  - Updated: `prototype/source-observation/fixtures.mjs` (scenarios, Task titles and comments, server settings, internal agent, network, renamed memory-sync fields),
    `node-settings-fixtures.mjs` (shipped update-automation operations, `AvailableAgentRuntimes`, remote sign-in), `mock-node.mjs` (network, REST,
    the optional comparison hook, change feed), `embedding-fixtures.mjs` (search over titles), `prototype/shared/install-host-scenario.js`
    (entries, `nodeId`), `prototype/shared/token-statistics-refresh-fixture.js` (cache-write split), `prototype/shared/design-only-layers.ts`
    (Reconnect layer on its own), `prototype/remote-runs/remoteRunsFixture.ts`, `prototype/delegated-copy-tasks/delegatedCopyTasksFixture.ts`,
    `prototype/agent-reconnect/agentReconnectFixture.ts`, `prototype/run-settings/launchedOrgFixture.ts` (`remote_task_executions`),
    `utils/apolloClient.ts`, `plugins/00.prototype-state.client.ts`, `plugins/10.prototype-host-bootstrap.client.ts`, `plugins/97.agent-reconnect.client.ts`.
  - Design-only hooks kept on top of the copied source files: Reconnect (the notice and dialog in `AgentEventMonitor.vue`, `ExistingRunConfigEditor.vue`,
    `ExistingRunSettings.vue`, `RunMemberRow.vue`, `WorkspaceHistoryWorkspaceSection.vue`, `WorkspaceStableExecutionRow.vue`, `ErrorSegment.vue`, and the `reconnect`
    messages in both localization indexes); the example data layers are in `prototype/` and `plugins/`, not in the source files. The earlier `remote-runs-in-tree` hooks in source files
    (`useRemoteRun` filters in `AgentWorkspaceView`, `AgentUserInputForm`, `useComposerTarget`, `RightSideTabs`, `AgentRunCollaborationContext`,
    `delegatedLaunchRows`) are gone: the source ships them.
  - Removed design-only or superseded parts: `composables/useNodeText.ts`, `prototype/nodes/nodeWorld.ts`, `prototype/remote-collaboration/offersScript.ts`.
  - Vendor: the three changed contract packages (`src` and `dist`) replaced from the pin.
  - Fixtures: `prototype/fixtures/source-state-snapshots.json` and `runtime-state.json` re-captured from the pinned source on the synthetic node (88 snapshots).
  - Docs: `README.md`, `mock-boundaries.md`, `prototype-scenarios.md`, `ui-reference-runbook.md`.
- No test suite, check script or `validate:*` / `capture:*` script was added. The comparison harness is disposable and lives outside the repository
  (`/tmp/r013/scripts`, `/tmp/r013/hook`); only its screenshots and result files are kept as evidence. I did not run the repository's lint, unit tests or typecheck.
- Mock data origin: every new value is invented and written by hand (nodes, addresses, node IDs, offers, runtimes, limits, models, Task titles
  and comments, internal agent, devices). The 88 snapshots are captured only from the pinned source running on the synthetic node. No real source or
  customer content, credential or live service is used, and a reload resets every in-memory change. I checked the origin of what this refresh
  added; I did not re-audit the older snapshot content beyond that.
- Scripted asynchronous behavior: local answers after 40 ms; each node answers after its own scripted delay (0.3–1.4 s; 20 s for a node that does
  not answer); Retry on a remote run answers after 1.5 s; automatic updates apply 3.5 s after the switch is turned on.
- Browser simulation of host contexts: `electron_internal` and `electron_external` are the synthetic host bridge; no Electron is bundled.
- Retained production store, client, protocol or runtime: none beyond the source's own presentation stores, connectors and services, which run
  against the local fixtures (the node-to-node connector calls the simulated network, not a protocol).

## Validation

- Browser: Google Chrome (headless, playwright-core). Viewports 1440×900 and 390×844; locales en and zh-CN.
- Source observation: as above. Baseline start command: `corepack pnpm dev --port 4820`.
- New and changed surfaces: about 280 paired flows (see the inventory). Found and fixed on the way: the host bridge still used the old node model;
  Phone Setup read a field the source renamed; the Settings → Basics entry changes the left panel's split (the Applications entry is already
  there); server-setting saves answered without the confirmation text; Retry and live updates of remote runs; clock-independent text.
- Unchanged surfaces, load-and-look: the earlier route and state matrix, 88 desktop routes and scenarios, all equal (see the note under the inventory).
- Preserved design-only layers re-run: Reconnect review scripts 7/7; delegated-copy example DCE-001–004; skill-sources dialog review checks 20/20;
  task-keys and part-of example data load with no browser error.
- **Independent run:** the built preview (`pnpm build` exit 0) on `:4821`, with the source and the observation node stopped: 8/8 journeys pass
  (IND-001–008: Model Routing, add and connect a node, a remote run's view, "Show internal agents", a Task comment, Phone Setup, the
  Notification Center, NFS Guide), zero browser errors, zero non-local requests.
- Approved design checks were not re-run and no reference screenshot was changed: finished designs are a record of what the user approved.
  I did put the baseline beside ten approved reference screenshots (`evidence/WEB-BASELINE-REFRESH-013/refcmp/`); see the reference questions.
- Evidence: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-013/evidence/WEB-BASELINE-REFRESH-013/` (`flows/`, `matrix/`, `refcmp/`,
  `reconnect-preserved/`, `design-only-delegated-copy/`, `design-only/`; about 23 MB).
- Scenario reset and isolation: a fresh browser context and a reset of the observation node's scenario before every flow; a reload resets the baseline.
- Limitations: automatic updates apply after 3.5 s, not within about a minute; "Checked N min ago", relative times and the last-checked times use the real clock on both sides.

## Completion Check

- Selected source boundary and pinned revision are explicit: `Yes`
- Baseline starts independently at the documented URL: `Yes`
- Every distinct selected navigation destination and surface has exact source and baseline evidence: `Yes`
- Every distinct interaction, feedback, and meaningful state pattern is demonstrated at least once: `Yes`
- Every context that materially changes the UI is represented: `Yes`
- Every distinct supported journey and relevant recovery path is runnable with matching visible outcomes: `Yes`
- Desktop and narrow-mobile behavior are validated when applicable: `Yes`
- Interface structure and interactions are real rather than screenshot or hotspot substitutes: `Yes`
- Production capabilities are simulated locally and deterministically: `Yes`
- Production credentials, customer data, live dependencies, and production writes are absent: `Yes`
- UI parity differences remaining: `None`
- Unsubstantiated distinct UI inventory items remaining: `None`
- Mock data follows "Mock data origin" in the shared principles, with the evidence above and no real source or customer content: `Yes`
- UI parity achieved for every item in the recorded distinct inventory: `Yes`

## Refresh Reconciliation

- Previous and new source pins: `9e7a458` → `d74f75a`.
- Surfaces added, changed, or removed by the source diff: see "Experience Boundary" and the status list. Also changed, with no effect on the
  baseline: the Electron updater and main process, the server runtime environment, `client-data-migrations` (a browser-storage key rename the baseline
  does not need: a fresh browser has nothing to migrate), the localization audits and the e2e probes.
- **Accepted design changes superseded by the source version:**
  - `one-nodes-tab`: the source's Manage Nodes components, stores and connector run unchanged. The design's own components, `useNodeText` and the page's
    simulation were removed; its simulation of the network is kept as the world under the source's own code (`network-world.mjs`).
  - `remote-runs-in-tree`: the source's remote rows, views, composer and panel notes run unchanged; the design's component hooks were removed. The design's
    example run (the Project Task Manager with its remote copies) is kept as example data, now in the shipped shapes.
  - `update-checks-and-auto-updates`: the source's Update checks card, automatic-update switches, outcomes and Notification Center run unchanged.
- **Accepted design-only changes preserved:** `agent-definition-reconnect-ui`, and the delegated-copy, task-keys, task-part-of and skill-sources
  example data. All stay off with `designOnlyLayers=off`.
- **Surfaces where it is hard to tell which policy applies** (for Product to decide):
  1. **Approved reference screenshots of the three shipped designs** (`one-nodes-tab` VIS-001–031, `remote-runs-in-tree` VIS-001–021,
     `update-checks-and-auto-updates` VIS-001–037). I did not recapture them. Ten of them were placed beside the shipped surface
     (`evidence/WEB-BASELINE-REFRESH-013/refcmp/*.baseline.png`, same viewport) and I looked at three of them. The pixels differ there because the
     shipped pages have since gained more cards (the Update checks card sits lower in Basics; the Settings menu has the new Model Routing entry), and the
     remote-run tree shows the shipped row layout. I did not check the other seven by eye or compare their wording. Product should decide whether those
     references stay as the design's record or are re-captured on the shipped surfaces.
  2. **Default state of the remote-run example.** Source default data has no remote runs; the baseline keeps the design's example (the Project Task
     Manager run with `docker` and `office-mac` copies) as before, so a reviewer finds the remote rows without setup.
  3. **Applying time.** The design simulated automatic updates after about 3.5 s; the product applies them within about a minute.
  4. Carried over, still open: Reconnect's collaborator case shows on delegated copies.
- Unchanged surfaces given a load-and-look pass: the full route and state matrix (88), mobile, and the host-context routes.

## Known Gaps And Next Action

- Blocked or incomplete UI inventory IDs: none.
- User-facing differences or omissions: none known inside the verified scope.
- Illustrative fixture content or production mechanisms intentionally simplified without changing presentation: see Implementation
  Simplifications. Not simulated: real node-to-node requests, update checks and installs, runtime logins, pairing, status events after a run's snapshot
  other than the scripted ones (carried over).
- Source reachability or evidence limitations: none. The source ran from an exact export of the pin.
- Required correction: none.
- Optional data cleanup: none.
- Recommended next action for `product_ui_ux_designer`: decide the reference questions above, then accept, commit on
  `design/web-baseline-refresh-013`, integrate into `personal`, and record the integration in the baseline ticket.
