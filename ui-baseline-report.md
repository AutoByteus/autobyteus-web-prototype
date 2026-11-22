# UI Baseline Report

## Scoped refresh `extensions-nodes-baseline-refresh-516` (read this first)

**Settings → Extensions (the Voice Input card) and the Nodes page's Manage Nodes and Phone Setup tabs now reflect `origin/personal@b768c503f9761242089cdee35e47dc2bf65ab8ea`** (selected frontend `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`, read only; the pin is the explicit constraint of the request, verified with `git cat-file`; `origin/personal` is now `50af37b59b`, whose range from the pin touches none of these surfaces' files, checked with `git diff --stat`). Every other surface keeps its earlier pin (desktop `d74f75a51a` with the scoped exceptions below, Memory `8430d9ef12`, the phone `f7b4d68711`), including the Nodes page's Memory Sync, Docker Guide and NFS Guide tabs.

### Status

- Status: `Completed`, a candidate: uncommitted changes in the ticket worktree; the Bootstrapper made no commit. Integration into the default branch `personal` follows the Product UI/UX Designer's acceptance.
- Request type: Refresh (scoped, explicit), from the Product UI/UX Designer for `extensions-ui-516` (package `autobyteus-516-extensions`, autobyteus-516): UI parity with `b768c50` for the Voice Input card in each state and for `/nodes` Manage Nodes and Phone Setup with its phones list; source wins where it shipped; accepted design-only changes elsewhere preserved.
- Next expected action: the Product UI/UX Designer reviews and accepts, commits, integrates into `personal`, then merges `personal` into `design/extensions-ui-516` (ticket `tickets/in-progress/extensions-nodes-baseline-refresh-516/product-ticket.md`).

### Identity

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`; not touched). Ticket branch / worktree: `design/extensions-nodes-baseline-refresh-516` / `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/extensions-nodes-baseline-refresh-516`, dedicated to this ticket. Accepted design base: `437bad9aa27f6aa20a11cf86c7bd44f5cce27cfb` (worktree `HEAD` the same). Bootstrap candidate: the worktree's uncommitted changes (no commit).
- Previous pins of these surfaces: Settings → Extensions `d74f75a51a`; Manage Nodes `3b9dc912a1` with the approved design `manage-nodes-professional` on top; Phone Setup the approved designs `one-step-phone-pairing` and `phone-setup-remote-node-wording` (design-only panel `PhoneConnectPanel.vue`).
- Run: `corepack pnpm install --ignore-workspace --frozen-lockfile`, `corepack pnpm dev --port 4517`, then `http://127.0.0.1:4517/nodes?nodeTab=manage` or `/settings?section=extensions` (1440×900). `package.json`, `pnpm-lock.yaml`, `nuxt.config.ts` unchanged. Entries and starting states: `ui-reference-runbook.md`, section "extensions-nodes-baseline-refresh-516".

### What the source changed and what was done

Copied unchanged from `b768c50` (UI code; 46 files byte-identical, audit `evidence/extensions-nodes-baseline-refresh-516/copied-files-audit.txt`):
- Extensions: `components/settings/VoiceInputExtensionCard.vue` (the decorative microphone icon removed, autobyteus-320; the language choice typed `auto | en | zh`).
- Manage Nodes: `components/settings/nodes/{NodeRow,NodeChangeDialog,NodeServerUpdate,NodeConnectionDetails,NodeCollaborationSwitch,NodeNoticeIcon,AddNodePanel}.vue`, new `NodeAccessNotice.vue`, `NodeAutoUpdate.vue`; `components/settings/RemoteCollaborationOfferToggle.vue`; the stores `nodeAccessStore` (new), `nodeAutoUpdateStore` (new), `nodeStore`, `nodeRowStatus`, `nodeServerUpdateStore`, `nodeChangeDialogStore`, `remoteCollaborationStore`, `remoteCollaborationOffersStore`; `services/nodeCollaboration/{nodeChangePlan,nodeCollaborationApi,nodeCollaborationConnector,windowNodeCollaborationConnector}.ts`; the GraphQL documents `remoteCollaborationQueries.ts`, `remoteCollaborationMutations.ts`; `shared/{nodeAccessTypes,nodeAutoUpdateTypes,nodeUpdateContract}.ts` (new); `utils/{nodeConnectionErrorText,nodeIdentityProbe,nodeSettingsError}.ts`; the catalogs `nodesPage.ts` (en, zh-CN).
- Phone Setup: `components/settings/NodeManager.vue` (Phone Setup renders `PhonesPanel`), new `components/settings/phone/{PhonesPanel,PhoneWayTab,PhoneCodeBlock,ConnectedPhones}.vue`, `stores/phoneAccessStore.ts`, `utils/phoneAccessRemoteNode.ts`, new `utils/phoneAccess/{phoneConnectionWays,phoneSetupTextKey,tailscaleServeCommand}.ts`, the catalogs `phoneSetupRemoteNode.ts` (en, zh-CN, new; one import and one spread line per locale's `index.ts`, at the source's position).
- `settings.ts` (en, zh-CN): every `settings.components.settings.phone.*` key is the source's (105 keys, checked equal); the retired `PhoneAccessCard.*` / `PhoneSetupGuideCard.*` keys are removed (no file uses them). The other changed keys of the range (About/Updates, Docker Guide, NFS Guide) keep their earlier pin: those surfaces are outside this refresh.
- Removed: `components/settings/phone/PhoneConnectPanel.vue` (the design-only panel; nothing else imports it).

What changed for the user (source wins):
- Extensions: the Voice Input card's header has no microphone badge; the name and description stand alone.
- Manage Nodes: remote collaboration pairs two nodes once (autobyteus-437): the description and the dialog say "Two nodes pair once…" / "Paired nodes share a secret…"; the dialog's steps are "On <node>" (turn on), "On both nodes": "Pair this node with <node> (here it is called "<name>")" with "<node> calls this node "<name>""; a registration made before nodes paired shows "Not paired yet" and the fix **Pair again**; a failed pairing shows the Docker loopback hint without an address to try. Node access (autobyteus-437): a remote row this desktop holds no key for shows the amber "Needs connecting." notice with the setup-code field and **Connect** ("Connecting…", then the row is asked again), the refusals ("The setup code is not valid…", the network refusal, "<node> could not be connected: …"), and no server version; a connected remote row has the **Disconnect** icon. Automatic node updates (autobyteus-356): under the server version, the "Update automatically" switch with "Keep this node on this app's version.", "Updated automatically to <version>" with the New dot, "Automatic update failed. Nothing was changed." with the node's reason, "Couldn't save this setting. Try again."; the row grid keeps capsules and icons aligned across rows (363).
- Phone Setup: the source's Phones panel (autobyteus-395, wording of 426): title, subtitle with the node's name, the Phone access switch in the header, four ways as tabs (Same Wi-Fi or LAN, Tailscale, Your VPN, Company address) with a ready dot and Recommended, each tab's status, button (Show QR code / Allow and show QR code / Turn on and show QR code / Turn on, allow and show QR code), Check again, How it works (open by itself when a way is not ready), Tailscale's Advanced (the `tailscale serve` command with Copy, or "Set up."), the Wi-Fi question and the allowed switch, the Company address field, the code (QR, the way's line, Valid for m:ss, Close, New code after expiry, About this code), the blocked notices, and Connected phones (Revoke, Revoke all with its confirmation, empty, History (N) fold). A node on another computer is named in the wording ("Office Mac is reachable…").

### Reconciliation with accepted design changes

- `manage-nodes-professional` (approved design of Manage Nodes on `3b9dc912a1`): shipped by the source (the capsule switch, the notice icons, the grid); the source version wins in full. The differences were comments, `text-[13px]` → `text-[0.8125rem]`, and the row grid's spacing rule.
- `one-step-phone-pairing` and `phone-setup-remote-node-wording` (approved designs of Phone Setup): shipped by the source, differently in places (the four ways as tabs instead of one recommended way with other options, the code inside the tab, the phones list's wording and History fold); the source version wins on the desktop panel: `PhoneConnectPanel.vue` is replaced by the source's panel. The design's Android start screen (`/android`), the node sheet and the browser pairing page keep their accepted state (`prototype/phone-pairing/phonePairingFixture.ts` still serves them). The design's phone starting-state key `autobyteus.prototype.phonePairing` and its state names are kept and now choose the simulated network's facts (see below).
- No other accepted layer touches these files.

### Simulation beneath the UI (no backend; every value is invented)

- **Phone Setup** (`prototype/nodes/network-world.mjs`, `prototype/source-observation/rest-fixtures.mjs`): the node's REST `GET /rest/remote-access/network` answers each node's report of its computer's network by the phone state: this computer "Home Mac" (Tailscale `100.88.10.10` / `home-mac.tail0c0ffee.ts.net`, LAN `192.168.2.10`, VPN `10.8.0.6`, company address `https://autobyteus.example.com` by state), Docker 8001 in a container on it, "Office Mac" on another computer (`remote_*`). The panel's own address checks (`/rest/remote-access/status` at each candidate) are answered by the simulated network: an address answers with the node's ID when the state says it is reachable (the secure web address only once "served"; Docker's port only when published). The allowed local network is kept per node and network (`PUT …/local-networks/:id`, also from another node's window to the desktop's own node). Settings, status, devices, revoke, revoke all, a pairing session (`sessionId`, expiry 5 minutes, 4 s in `expired`; the QR holds the node's real link shape `<address>/mobile?pairing=<base64url payload>` with an inert invented code) and discard are answered in memory. Phones: Pixel 8 (Tailscale, 2 minutes ago), Galaxy Tab (Wi-Fi, yesterday), Phone (not used yet), 31 revoked phones (some without a recorded way); none in `no_phones`.
- **Node access** (`prototype/shared/install-host-scenario.js`, the simulated desktop shell): `getNodeAccessStates` (embedded connected; every remote entry connected except Docker 8001 in `nodes_access*`; a node added on the page needs connecting, as a new entry has no key), `connectNode` (any code accepted after 0.7 s, or the scenario's refusal), `disconnectNode` (0.4 s), with the change broadcast.
- **Automatic node updates** (same file): the registry field `autoUpdate` (`set-auto-update`; refused in `nodes_auto_save_fails`); the desktop checks a node at once when its switch turns on and, when the node is older and can update in place, asks it to update (the simulated node's scripted update, about 20 s) and follows it every 10 s as the desktop does; `markNodeAutoUpdateRead`, `recheckNodeAutoUpdate` (drops a failure the node has passed). The simulated node now keeps its last update result (C1 `update`) until the next request, as a node does.
- **Pairing** (`network-world.mjs`): `CreatePeerInvite` (the node's switch must be on; a single-use invite), `AcceptPeerInvite` (each node finds the other's address from its own addresses, both register each other `paired: true`; `PEER_INVITE_INVALID`, `PEER_ALREADY_REGISTERED`, `PEER_NAME_TAKEN`, `PEER_UNREACHABLE` with the loopback hint for 8004; 8005's first write fails as before), peers carry `paired`, and availability and offers answer `PEER_NOT_PAIRED` for a registration made before pairing. `nodes_states` gains the peer-only row **lab** (`192.168.2.45`) registered before pairing. `hostPortOf` takes 443 as an `https` address's default port.
- **Voice Input install** (same host file): Install and Reinstall now play the desktop's visible steps (manifest, runtime download 0–100 %, extract, runtime and model preparation; about 6 s, the store polls) before resolving installed. Before this refresh the install ended at once and the installing state was not reachable.
- Wiring: `plugins/00.prototype-state.client.ts` runs the source's `nodeAccess` and `nodeAutoUpdate` stores and `nodeStore.setNodeAutoUpdate` unstubbed, and passes the world to the REST fixture; `utils/apolloClient.ts` answers `CreatePeerInvite` / `AcceptPeerInvite` locally and reads the phone state into the fixture state; `prototype/source-observation/fixtures.mjs` binds an external window to "Office Mac" in the `remote_*` states and lists the new scenarios; `mock-node.mjs` takes `phonePairing` in `/__prototype/scenario`.

### Inventory and comparison (source `b768c50` vs baseline, matched; 1440×900, 1100 px and 700 px for the narrow passes)

Conditions: Chrome (headless) driven by disposable Playwright scripts under `/tmp/r516` (nothing added to the repository), a fresh context per side and state, the same scenario, context and phone state on both sides, timezone UTC, reduced motion. The pinned source is an exact `git archive` export of `b768c50` (`autobyteus-web`, the four contract packages; `autobyteus-application-sdk-contracts/dist` copied from the source checkout), dependencies from the source's lockfile, served by `nuxt dev --port 4518` with a disposable harness plugin in the export only: it installs the same simulated desktop shell (`install-host-scenario.js`), sends the node REST to the observation node (`mock-node.mjs`, port 4391) and forwards requests to other nodes' addresses to the observation node's simulated network (`/__network/request`). Per state the compared region (the Extensions page, the Manage Nodes panel, the change dialog, or the Phones panel) is compared as a screenshot (pixels), UI text with digits masked, element signature (tag and classes of every visible element) and the final route. Evidence: `evidence/extensions-nodes-baseline-refresh-516/` (each image: baseline left, source right; `pixel-differences.txt` per state; `copied-files-audit.txt`). 95 states: text, signature and route identical in all; pixels identical except the QR pattern (the code carries its own expiry time), 2–3 px of antialiasing at an info icon, and the illustrative backend address in a browser window.

| ID | Surface / state | Evidence | Result |
| --- | --- | --- | --- |
| EX-01 | Voice Input installed and enabled; disabled (Disable); error; not installed; Install → installed; the language choice | `E01`, `E03`–`E07` | pass: identical |
| EX-02 | Installing: fetching manifest, downloading, preparing the model; Reinstall | `E11`–`E13`, `E15` | pass: identical |
| EX-03 | Browser window ("only in the desktop app"); narrow 700 px; zh-CN (enabled, error, installing) | `E08`, `E09`, `E02`, `E10`, `E14` | pass: identical |
| MN-01 | Manage Nodes, the small network: This node, collaboration, Add node, a row with server version, Update to, Update automatically, Disconnect | `N01` | pass: identical |
| MN-02 | Every row state (`nodes_states`) incl. lab "Not paired yet" with Pair again; 1440, 1100, 700 px; zh-CN | `N02`, `N21`, `N20`, `N03` | pass (2–3 px antialiasing) |
| MN-03 | Needs connecting: the notice; Connecting…; connected (server version appears); refused code; network refused; not reachable; zh-CN | `N04`–`N09`, `N11` | pass: identical |
| MN-04 | Disconnect → needs connecting; a node added on the page needs connecting | `N10`, `N26` | pass: identical |
| MN-05 | Update automatically: updated (New), failed with reason (en, zh-CN), save fails, on → the update runs, on → "Updated to …" | `N12`, `N13`, `N17`, `N14`–`N16` | pass: identical |
| MN-06 | Update to: progress, done; refused with Copy command | `N22`–`N24` | pass: identical |
| MN-07 | Pairing dialog on Add node (en, zh-CN); done; Docker loopback hint; a restarting node; Pair again on lab and its result | `N25`, `N31`, `N27`, `N28`/`N28b`, `N32`/`N32b`, `N29`, `N30` | pass: identical |
| MN-08 | Browser window (no desktop shell: no access, no automatic updates); external window on Docker 8001 | `N18`, `N19` | pass (address illustrative) |
| PS-01 | Phones: Tailscale ready (Recommended), How it works and Advanced open ("Set up."), not served (command, Copy → Copied) | `P01`–`P04` | pass: identical |
| PS-02 | Company address; VPN; Same Wi-Fi asked, Allow and show QR code → code; allowed with its switch; switch off | `P05`–`P10` | pass (QR pattern) |
| PS-03 | No network (blocked); Docker window; Docker not published (blocked); Docker Advanced (`--https=8443`) | `P11`, `P30`–`P32` | pass: identical |
| PS-04 | Code shown with About this code; expired; New code; Close | `P12`–`P15` | pass (QR pattern) |
| PS-05 | No phones; phone access off; Turn on and show QR code; switch off | `P16`–`P19` | pass (QR pattern) |
| PS-06 | Revoke one; Revoke all confirmation and result; History open | `P20`–`P23` | pass: identical |
| PS-07 | Company address tab not ready; a typed address that does not reach the node; a typed address that does (code); VPN Check again ("Still no VPN found."); keyboard ArrowRight on the tabs; switching tabs | `P24`–`P29` | pass (QR pattern) |
| PS-08 | A node on another computer: reached on LAN, Tailscale, VPN; unreachable; no network; its Tailscale tab | `P33`–`P38` | pass: identical |
| PS-09 | zh-CN (history, Wi-Fi question, code, remote node); narrow 700 px (panel, code); browser window | `P39`–`P45` | pass (QR pattern) |
| RS-01 | The rest of the baseline: Memory Sync, Docker Guide, NFS Guide tabs, Settings, Workspace, Agents, Memory, Integrations, Chat, `/mobile`, `/android` | load-and-look | 12 routes render, no page error |

### Known gaps

- **Not refreshed though the range changed it** (outside this refresh's scope): the Nodes page's Memory Sync tab (`MemorySyncCard.vue`, `memorySyncStore.ts`, its GraphQL documents), Docker Guide (`dockerNodeLauncherCommands.ts`, the `updateAll` command and its strings), NFS Guide (`NfsGuideCard.vue` and its strings), Settings → Updates (`appUpdateStore`, `appUpdateTypes`, the About/Updates strings), and the other changes between the earlier pins and `b768c50`.
- The browser pairing page (`/mobile?pairing=…`), the node sheet and `/android` are the accepted design state, not refreshed; the desktop panel's QR now holds the node's real link shape with an invented code, which the design's pairing page is not asked to read.
- Voice Input's microphone test (Start Test) uses the browser's microphone in both sides; without microphone permission both show "Microphone access is denied…". Real capture and transcription were not validated.
- The automatic update plays in about 20 s (the desktop's first pass after 2 minutes and the hourly pass are not simulated; turning the switch on checks at once, as the source does). Node access codes are not checked: any code connects unless the scenario refuses.
- The QR pattern differs between the sides because the code holds its own expiry time; the timer is a real 5-minute countdown.
- Edits under `prototype/` and `plugins/` are not always picked up by the running dev server; restart it after changing them.
- Node, computer, phone and address names, versions, reasons, setup codes and pairing codes are illustrative. Real pairing, node credentials, node updates, network detection and phone connections were not validated. `typecheck`, `lint` and tests were not run (design work).

---

## Scoped refresh `memory-baseline-refresh-554`

**The Memory page (`/memory`: Browse, an agent's runs, Team and Org detail, the run inspector, Search, Index) and the Agents page's semantic memory card and field now reflect `origin/personal@8430d9ef12385bb77e9ee2f808bc123c891b97b7`** (selected frontend `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`, read only; the pin is the explicit constraint of the request, verified with `git rev-parse`: `origin/personal` = `HEAD` = `8430d9ef12`, the frontend directory clean). Every other surface keeps its earlier pin (desktop `d74f75a51a` with the scoped exceptions below, the phone `f7b4d68711`).

### Status

- Status: `Completed`, a candidate: uncommitted changes in the ticket worktree; the Bootstrapper made no commit. Integration into the default branch `personal` follows the Product UI/UX Designer's acceptance.
- Request type: Refresh (scoped, explicit), from the Product UI/UX Designer for `semantic-memory-view-554` (package `semantic-memory-for-every-agent`, autobyteus-554): bring `/memory` in full and the agent detail's and edit form's semantic memory to UI parity with `8430d9ef12`; source wins where it shipped; keep accepted design-only changes elsewhere.
- Next expected action: the Product UI/UX Designer reviews and accepts, commits, integrates into `personal`, then merges `personal` into `design/semantic-memory-view-554` (ticket `tickets/in-progress/memory-baseline-refresh-554/product-ticket.md`).

### Identity

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`; not touched). Ticket branch / worktree: `design/memory-baseline-refresh-554` / `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/memory-baseline-refresh-554`, dedicated to this ticket. Accepted design base: `5d46595ab4bbe995050cee124e458a6f041f48f4` (worktree `HEAD` the same). Bootstrap candidate: the worktree's uncommitted changes (no commit).
- Previous pin of these surfaces: `d74f75a51a` (the Memory page also carried the approved design `work-journal-search`; the agent pages the scoped refresh `package-clone-auto-update-457` at `f78b60dddd`).
- Run: `corepack pnpm install --ignore-workspace --frozen-lockfile`, `corepack pnpm dev --port 4555`, then `http://localhost:4555/memory` (1440×900). `package.json`, `pnpm-lock.yaml`, `nuxt.config.ts` unchanged. Entries and starting states: `ui-reference-runbook.md`, section "memory-baseline-refresh-554".

### What the source changed (`d74f75a51a..8430d9ef12`, the scoped files) and what was done

Copied unchanged from `8430d9ef12` (UI code; 39 files byte-identical, audit `evidence/memory-baseline-refresh-554/copied-files-audit.txt`): `pages/memory.vue`; `components/memory/*` (`AgentMemoryDetail`, `CollaborationMemoryDetail`, `MemoryBadges`, `MemoryHome`, `MemoryIndexPanel`, `MemoryInspector`, `MemorySearchPanel`, `MemorySearchResults`, `MemorySpinner` (new), `RawTracesTab`, `WorkJournalTab`, `collaborationMemberTree.ts`); `composables/useMemoryIndexView.ts`; the stores `memoryInspectorStore`, `memoryJournalStore`, `memorySearchStore` (the source's own, no longer the design's scripted stores); `types/memory.ts`, `types/memorySearch.ts` (new); the GraphQL documents `memorySearchQueries.ts`, `memorySearchMutations.ts` (new), `memoryExplorerQueries.ts`; voice input in Search: `components/voiceInput/VoiceTargetStatus.vue` (new), `types/voiceInput.ts`, the catalogs `voiceInput.ts` (new, en and zh-CN, + one import and one spread line per locale's `index.ts`); the catalogs `memory.ts` and `memory.generated.ts` (en, zh-CN); `components/agents/AgentDefinitionDetailSections.vue`, `AgentDefinitionForm.vue`, `AgentSemanticMemoryField.vue` (new), `stores/agentDefinitionStore.ts`, `agentDefinitionQueries.ts`, `agentDefinitionMutations.ts`, `types/personalSettings.ts` (`SEMANTIC_MEMORY`), the catalogs `personalSettings.ts` (en, zh-CN: the editor's note now names semantic memory). Added to existing catalogs: the five semantic memory keys in `agents.ts` (en, zh-CN), at the source's position; the other keys keep their text.

What changed for the user (source wins over the design `work-journal-search` where it shipped):
- Browse: Team cards carry no "Task team" tag (461), Team members are plain members (no "Task · <time>" line); dates and numbers follow the app's interface language (426).
- Search: a microphone in the search box when voice input is available (320): Starting, Recording with Cancel recording, Transcribing; the transcript joins the typed text and waits for Search. "No matches" (amber) when nothing matched; a text match's "Words: …" label; a match's day only when known.
- A result for a run the index knows only by its folder opens a Work Journal-only inspector (`view=folder-inspector`, title = the folder's name, no Raw Traces tab).
- Work Journal: a run without one says "No Work Journal yet. Index your memory to create it." with a link to Index; a run of an imported memory source says "No Work Journal". The raw-trace link at the end of an entry's last line is shown de-emphasised; `[--:--:--]` entries are read as entries.
- Index: an error with Retry when the status cannot be read; a refused Index now / Rebuild shows the node's reason under the steps; the spinner is a still ring under reduced motion (`MemorySpinner`); the Rebuild confirmation's accessible name is localized; the bar's width does not animate under reduced motion.
- Agents: the detail page has a **Semantic memory** card: "On. The agent keeps its reusable knowledge in this folder:" with the folder (selectable), or "Off". The editor has a **Semantic memory** checkbox under Avatar with its help text; for package and built-in agents it carries the Personal mark and Reset like the other personal settings.

### Reconciliation with accepted design changes

- `work-journal-search` (approved design of the Memory page on `d74f75a`): shipped by the source, differently in places; the source version wins everywhere on the page. Its scripted stores (`memorySearchStore`, `memoryJournalStore`: search and the build timer in the store) are replaced by the source's stores; the design's world (`prototype/memory-search/memoryDesignFixture.ts`) is kept and now answers those stores in the server's shapes. No design-only element of the page without a source equivalent remains (every `components/memory` file is the source's); the catalog keys the source dropped (`memory.browse.task_team*`, `memory.browse.filter_button`, `MemoryHome.localRunnableMemory`, …) are used by no other file.
- The Memory world is no longer a design-only layer: `autobyteus.prototype.designOnlyLayers=off` keeps it (the page is the source's now).
- `package-clone-auto-update-457` (scoped refresh of the personal settings): its fixture gains `SEMANTIC_MEMORY` as a third personal setting of the built-in Daily Assistant; its other states are unchanged.
- `agent-definition-reconnect-ui`, `skill-sources-dialog-redesign`, `integrations-page-r2`, the phone and the other accepted layers: untouched (none of their files is in the copied set).

### Simulation beneath the UI (no backend; every value is invented)

- `prototype/memory-search/memoryDesignFixture.ts` is the memory node (`memoryOperation`, answered from `utils/apolloClient.ts`): `memoryIndexStatus` (states `NOT_INDEXED`, `BUILDING`, `READY`, `FAILED`, `MODEL_CHANGED`, the four steps with their units), `startMemoryIndexing` / `rebuildMemoryIndex` (a 400 ms timer advances the steps; the page polls every 2 s as the source does), `memorySearch` (the scripted topics, now with the server's subjects `AGENT`, `TEAM_MEMBER`, `ORG_MEMBER`, `RUN_FOLDER`, its snippet rule: links removed, trimmed, from the first line with a search word, at most three lines; answers by words only while the meaning index was built with another model), and the four Work Journal reads (files with days, a window of lines; null while the runs have no journals or for an imported source). The generated journals follow the pinned server renderer's layout (three header lines, 11-space details, the link at the end of an entry's last line, a day line at each change of day). Answers arrive after 120 ms (several frames), so the source's "Loading the Work Journal…" view lays out between reads as with a real node.
- Lists: no task-team fields, members `CONFIGURED`; a run's "No Work Journal" badge before the index has made the journals; in `memory_imported_source` an imported source "Office Mac (imported)".
- New run: **writer** (`agent_teams/home_lab_team_0c4a7e19/writer_5d2e8b31`), a Team member whose Team record cannot be read, known only by its folder (the server's `nameFromFolder`).
- Scenarios (new): `memory_index_unavailable` (the first status read of a page load fails, Retry reads it), `memory_index_start_fails` (not indexed; Index now is refused with an invented reason), `memory_imported_source`; existing: `memory_not_indexed`, `memory_meaning_running`, `memory_index_failed`, `memory_model_changed`, `memory_search_fails`, `empty`.
- Voice input in Search: `prototype/memory-search/memorySearchVoice.ts` plays the voice store's visible sequence on its own state for the `memory-search` target only (the product records from the microphone and transcribes in the desktop app's extension). Other voice targets keep the baseline's earlier inert stand-in.
- Agents: `prototype/source-observation/personal-settings-fixtures.mjs` gives the built-in Daily Assistant semantic memory as a personal setting (on; built-in value off) and answers the folder as the node does (`<memory>/semantic/<encodeURIComponent(id)>`, the memory folder invented); `plugins/00.prototype-state.client.ts` answers the folder after a Save or create with the box checked. A Save does not make a setting personal (unchanged known gap of `package-clone-auto-update-457`).

### Inventory and comparison (source `8430d9ef12` vs baseline, matched, 1440×900; 1024×768 for the narrow pass)

Conditions: Chrome driven by disposable Playwright scripts under `/tmp/r554` (nothing added to the repository), a fresh context per state, the same scenario on both sides, timezone UTC, the browser's language for en / zh-CN (the app's system locale mode). The pinned source is an exact `git archive` export of `8430d9ef12` (`autobyteus-web` and the four contract packages; `autobyteus-application-sdk-contracts/dist` copied from the source checkout, which builds it), dependencies installed from the source's lockfile, served by `nuxt dev --port 4556` with `BACKEND_NODE_BASE_URL` at the observation node (`prototype/source-observation/mock-node.mjs`, port 4557, the source's `generated/graphql.ts`) and a disposable hook that serves the same memory world (it imports `memoryDesignFixture.ts` itself and answers `memoryOperation` and the lists; the scenario comes from a file). Per state: the page area right of the left panel compared as screenshots (pixel difference), UI text with digits masked, the element signature (tag and classes of every visible element) and the final route.
Evidence: `evidence/memory-baseline-refresh-554/` (each image: baseline left, source right; `pixel-differences.txt` with every pair's differing pixels and the text/signature/route result of each state; `copied-files-audit.txt`; `baseline-only-voice-*.png`). "Identical" below: 0 differing pixels and the same text, signature and route.

| ID | Surface / state (checked now) | Result |
| --- | --- | --- |
| MR-01 | Browse: Agents, Agent Teams (no "Task team" tag), Agent Orgs, populated (`b01`–`b03`) | pass: identical |
| MR-02 | Browse empty (`empty`): the three tabs' empty states (`b04`) | pass: identical |
| MR-03 | Browse filter: a match and no match (`b05`) | pass: identical (1 px: the text caret) |
| MR-04 | An agent's runs, and the Unattributed runs page (`a01`, `a02`) | pass: identical |
| MR-05 | Team detail (runs with member groups, plain members) and Org detail (`t01`, `o01`) | pass: identical |
| MR-06 | Run inspector, Work Journal: the file rail, a closed file, Go to line in a 48,213-line file, Jump to day, "↑ earlier lines" (`i01`–`i05`); trailing raw-trace links de-emphasised | pass: identical |
| MR-07 | Raw Traces tab (`i06`) | pass: identical |
| MR-08 | A Team member's and an Org member's inspector (`i07`, `i08`) | pass: identical |
| MR-09 | Search centered (`s01`); results for a strong cue, screen by screen (`s02`, three screens), `bunny and tortoise`, `域名 自动更新` (`s03`, `s04`) | pass: identical |
| MR-10 | Words notes: none of the words found (amber), some not found (gray) (`s05`, `s06`) | pass: identical |
| MR-11 | A match opens the Work Journal at its lines with the found banner; Match 2 (`s07`, `s08`); a Team member's match (`s10`); a match low in the list opens at the top of the page (`s09b`) | pass: identical |
| MR-12 | A run known only by its folder: the Work Journal-only inspector (`s09`) | pass: identical |
| MR-13 | Search fails (Retry) (`s11`); "No matches" (`memory_model_changed`, words only) (`s12`); not indexed (`s13`); model changed notice (`s14`); meaning index running notice (`s15`) | pass: identical (`s15`: the spinner's phase) |
| MR-14 | Index: up to date; not indexed (Index now); building after Index now; built to "Up to date" after 95 s (`x01`–`x04`) | pass: same text, signature and route; pixels differ only in the spinner's phase, the progress the timer reached and the finish time |
| MR-15 | Index: meaning index running; failed with Try again and after it; model changed, the Rebuild confirmation, rebuilding (`x05`–`x07`) | pass: as MR-14 |
| MR-16 | Index status cannot be read: the error with Retry, then the index (`x08`); Index now refused: the reason under the steps (`x09`) | pass: identical |
| MR-17 | Reduced motion: the still ring (`x10`); the Index tab's badge while building, seen from Browse (`x11`) | pass: identical (`x11`: the percentage the timer reached) |
| MR-18 | No Work Journal yet with the link to Index, and the link (`j01`, `j02`); an imported source's run: "No Work Journal" (`j03`); Browse badges before the build (`j04`) | pass: identical |
| MR-19 | zh-CN: Browse, search with a words note, a match's Work Journal, Index (model changed), No Work Journal yet, Team detail, No matches (`z01`–`z07`) | pass: identical |
| MR-20 | 1024×768: a match's Work Journal (file select instead of the rail), results (`n01`, `n02`) | pass: identical |
| MR-21 | Voice input in Search (desktop window): the microphone, Starting, Recording with Cancel recording, Transcribing, the transcript in the box, cancel, Search (en, zh-CN) | baseline only (`baseline-only-voice-*`): the source harness has no desktop window or microphone; the button and status line are the source's components, the capture is scripted (see Simulation) |
| AS-01 | Agent detail: Semantic memory On with the folder (Daily Assistant), Off (Research Assistant); zh-CN both (`g01`, `g02`, `g08`, `g09`) | pass: identical |
| AS-02 | Agent editor: the Semantic memory field with Personal and "Reset to the built-in setting"; the field off on a package agent; the create form; zh-CN (`g03`, `g04`, `g07`, `g10`); the note under the title names semantic memory | pass: identical pixels and text; the signature differs only in the Runtime select's `disabled:` classes (see Known gaps) |
| AS-03 | Check the box and Save: the detail page shows On with the folder (`g05`); Reset: the box off, the mark gone (`g06`) | pass: identical (`g06`: as AS-02) |
| AS-04 | The rest of the baseline (desktop routes, the phone, the Android start screen), design layers on and off | load-and-look: 16 routes render, no page error |

### Known gaps

- **Not refreshed though the range changed it** (outside this refresh's scope; a decision for the Product UI/UX Designer): `components/launch-config/RuntimeModelConfigFields.vue` (autobyteus-9: the model list's refresh control and the runtime select's locked state; the agent editor shows it, and its Runtime select's `disabled:` classes differ, with no visible difference while it is enabled), `stores/memorySyncStore.ts` and the `memorySyncSettings` catalog (Settings → Memory Sync's per-file failures), the left panel's workspace tree, and the other changes of the range.
- The source side's left panel shows the observation node's run-history answer rejected by the newer source's schema (an error text); it lies outside the compared page area and outside this refresh.
- MR-21 (voice input) is shown by the baseline only. Elsewhere voice targets (composer, Projects) keep the baseline's earlier inert stand-in: their microphone does nothing.
- The index build is accelerated (about 85 s); progress numbers, the spinner's phase and the finish time differ between the sides by timing only.
- A Save of the editor does not make a setting personal (the node decides that in the source); Reset is the scripted outcome.
- Edits under `prototype/` (and `plugins/`) are not always picked up by the running dev server; restart it after changing them.
- Names, IDs, runs, journals, search results, the memory folder, the imported source, the transcript and the reasons in the error states are illustrative. Real memory, real search, the real index and real transcription were not validated. `typecheck`, `lint` and tests were not run (design work).

---

## Scoped refresh `phone-baseline-refresh-279` (the phone; still current for `/mobile`)

**The phone (`/mobile`: the run list and its ⋮, the run screen, its ⋮ menu and views, Settings, the VNC Viewer) now reflects `origin/personal@f7b4d68711a0d0aa11ee3802b1264293d1c4ae8c`** (release 1.5.13; selected frontend `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`, read only; the pin is the explicit constraint of the request, verified with `git rev-parse`). Every desktop surface keeps its earlier pin (whole frontend `d74f75a51a` and the scoped exceptions listed in the next section). The browser pairing page and the design's Android start screen keep their accepted state.

### Status

- Status: `Completed`, a candidate: uncommitted changes in the ticket worktree; the Bootstrapper made no commit. Integration into the default branch `personal` follows the Product UI/UX Designer's acceptance.
- Request type: Refresh (scoped, explicit), from the Product UI/UX Designer for `ios-demo-mode-279` ("Apple reviews the current build"): bring `/mobile` to UI parity with `origin/personal@f7b4d68711`; source wins where a phone surface shipped since `e4f4b3e176`; keep accepted design-only changes without a source equivalent; desktop stays at its pins.
- Next expected action: the Product UI/UX Designer reviews and accepts, commits, integrates into `personal`, then merges `personal` into `design/ios-demo-mode-279` (ticket `tickets/in-progress/phone-baseline-refresh-279/product-ticket.md`).

### Identity

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`). Ticket branch / worktree: `design/phone-baseline-refresh-279` / `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/phone-baseline-refresh-279`, dedicated to this ticket. Accepted design base: `fc68a7a4d249029d672d6b398b6d6ce2835cbbdc` (worktree `HEAD` the same; the canonical checkout was not touched). Bootstrap candidate: the worktree's uncommitted changes (no commit).
- Previous phone pin: `e4f4b3e1765669cf2c411652770199234ff6c214` (refresh `phone-run-screen-baseline-refresh-506`), then the approved design `phone-conversation-readability-506` on top of it.
- Run: `corepack pnpm install --ignore-workspace --frozen-lockfile`, `corepack pnpm dev --port 4279`, then `http://localhost:4279/mobile` at 412 CSS px. `package.json`, `pnpm-lock.yaml`, `nuxt.config.ts` unchanged. Entries and starting states: `ui-reference-runbook.md`, section "phone-baseline-refresh-279".

### What the source changed (`e4f4b3e176..f7b4d68711`, phone files) and what was done

The diff touches 173 files of `autobyteus-web`; the phone's import closure (from `pages/mobile.vue` and `components/mobile/**`) holds 65 of them. Shipped for the phone: autobyteus-506 built in autobyteus-458 (the phone conversation layout), autobyteus-525 (one phone-wide Text size, the run list's ⋮), autobyteus-534 (three steps, a "Text size" header, Settings last in the run's ⋮), autobyteus-522 (Settings for every run, a run on another node says so), autobyteus-448 (an idle agent with running background tasks), the VNC Viewer's Control-mode Keyboard and Clipboard in the status row, the background tasks' end reasons and the restart reminder's local time.

Copied unchanged from `f7b4d68711` (UI code; 38 files `cmp` identical, audit `evidence/phone-baseline-refresh-279/copied-files-audit.txt`): `MobilePairedShell`, `MobileRemoteAccessShell`, `runList/MobileOnThisPhoneMenu` (new), `runList/MobileRunList`, `runList/MobileRunRow`, `runScreen/MobileRunMenu`, `runScreen/MobileRunTargetView`, `views/MobileBackgroundTasks`, `views/MobileNodeDesktop`; the conversation files `AIMessage`, `UserMessage`, `EventMonitorBrowseAssistantRow`, `SystemTaskNotificationSegment`, `AgentUserInputTextArea`, `assets/css/phone-conversation.css`, `assets/css/phone-text-size.css` (new); `useMobileNavigation`, `useBackgroundTaskPanelView`, the AgentBackgroundTaskView query; the Text size code (`display/fontSize/phoneTextSizeSteps.ts`, `appFontSizeDom.ts`, `stores/appFontSizeStore.ts`); `utils/agentActivityPresentation.ts`, `backgroundTaskEnd.ts`, `restartReminderLocalTime.ts`, `workspaceStatusDotPresentation.ts`, `workspaceTeamAggregateStatus.ts`, `utils/mobile/mobileRunStatusLabel.ts`, `mobileRunSubjectLine.ts`, `mobileRunSettingsScope.ts`; the types `AgentRunState` (the background count), `backgroundTask`, `backgroundTaskView`, `segments`; the catalogs `mobileOnThisPhone` and `mobileSettings` (en, zh-CN). Added to existing catalogs: the two imports per locale and the `workspace.agentActivity.*` keys (existing keys keep their text).

Two files are the source's with a named change:
- `components/workspace/agent/AgentEventMonitor.vue`: the source's, with the design-only `AgentReconnectComposerNotice` re-applied (two lines, as before).
- `components/mobile/views/MobileRunSettings.vue`: the source's template and script unchanged except three imports, which point at `prototype/mobile-runs/mobileRunSettingsStore.ts` (`useExistingRunConfigStore`, `useRunStopAction`, `mobileRunSettingsScope`). The source reads and saves through the desktop's saved-run settings store, which on the desktop of this UI reference keeps its earlier pin.

Shared files that the desktop also renders: the conversation components, `phone-conversation.css` (phone only by its `.phone-conversation` class), `workspaceStatusDotPresentation` (same classes for every status without background tasks), `appFontSizeStore` (the desktop branch unchanged). The desktop's own files from the diff (the workspace tree rows, `StatusDot`, `BackgroundTaskPanel`, `runStatusStore`, the stores and services) were not taken. The source's `plugins/06.appFontSize.client.ts` is represented by its phone branch only (`plugins/06.phone-text-size.client.ts`): the desktop branch is not run, so the desktop keeps its pin.

What changed for the user (source wins): the run list's header has a ⋮ whose menu is **Text size** with three "A" buttons (Standard, Large, Largest); a step applies at once to every phone screen through the root font size, stays chosen on the phone and survives a reload. The run's ⋮ is Artifacts, Files, Messages (members), Activity, VNC Viewer (with a node desktop), **Settings** last, and no Text size block. **Settings** (every run): the subject line with the run's activity; a run the node holds (idle or working) shows the small red stop icon and locked rows; a stopped run's Runtime and Model rows and Save; the node's refusal in its words, with Save off until another choice; a run on another node shows "This run is on <node>. Its runtime and model can be changed only on that node." and no Save. **448**: an idle agent with running background tasks shows "Background task running" / "N background tasks running" with a steady blue dot on its row, its run screen and its Settings; a Team row shows its agents' sum unless busy. **Activity** shows an ended task's end line ("Stopped: it reached its time limit — not a failure of the command" and the two others). **VNC Viewer** in Control: Keyboard and Clipboard sit at the end of the status row. **Another agent's message** shows the desktop's arrow and message line again (the source's version).

### Reconciliation with accepted design-only changes

- `phone-conversation-readability-506` (approved design of autobyteus-506 and autobyteus-458 on `e4f4b3e176`): the source has since shipped both, differently in places; the source version wins everywhere. Replaced: the four-step Text size in the run's ⋮ (Small 15, Standard 17, Large 19, Largest 21 px, conversation only; `composables/mobile/usePhoneTextSize.ts`, deleted) by the source's three steps in the run list's ⋮, scaling every phone screen; the design's Settings screen by the source's (localized words, the remote-run sentence, a held idle run shows the stop icon, the stop through the run's own stop, the refusal in the server's words `'<model>' is not offered by <Runtime> now. Refresh the model list and choose again.` with straight quotes); hiding another agent's message arrow and message line (the source keeps them). Kept because they are the source's too: the 388 px column, the turn header, 17 px Standard at a 1.5 line height, the composer's lower corners. The design's starting state `mobile_settings_refused` is kept as the way to see the refusal.
- `agent-definition-reconnect-ui` (design-only, no source equivalent): preserved (re-applied in `AgentEventMonitor.vue`).
- `one-step-phone-pairing`, the `/android` start screen and its simulated bridge, New run's design catalog of agents: untouched.

### Simulation beneath the UI (no backend; every value is invented)

- `prototype/mobile-runs/mobileRunSettingsStore.ts` (new): the selection is the open run's own config; "the node holds the run" is its status (a Team or Org run by the run's status); Save writes the config back after 300 ms; with `mobile_settings_refused` the first Save is refused in the node's words (`autobyteus-server-ts/src/llm-management/services/run-model-selection-refusal.ts`) and Save stays off until another choice, as the source's store does for a `MODEL_UNAVAILABLE` answer; the stop (400 ms) marks the run, and a Team's or Org's members, stopped; the scope answers `remote` for a run the simulated run tree names as another node's (the UI reference holds a peer's run as a local run underneath).
- `prototype/source-observation/mobile-world.mjs`: background tasks for an idle delegated agent (Agent Package Creator, two running), a Team member (`mx-set-0002-implementation_engineer`, one; its Team row shows the sum), and a fourth task of the rich run stopped at its time limit (`endReason: time_limit`); `backgroundTasksRunningOf(node)` counts the running ones. The rich run (Daily Assistant, idle) has one running task.
- `stores/mobileRunTreeStore.ts`, `utils/mobile/mobileRunListRows.ts`: rows carry `backgroundTasksRunning` where the product reads it: a listed agent run's from its live context in this window (so a listed run shows it after it was opened, as in the source), a delegated row's from the run status, a Team's as the sum by the source's Team rule; a run stopped from Settings shows Stopped.
- `composables/mobile/useMobileRunOpening.ts`: an opened run the node holds shows its status (idle or running; before this refresh only running) and its running background task count, as its stream's status would carry them.

### Inventory and comparison (source `f7b4d68711` vs baseline, matched, 412×915 CSS px, device scale 2; 360×780 for the narrow pass)

Conditions: Chrome driven by disposable Playwright scripts under `/tmp/r279` (nothing added to the repository), a fresh context per state, the same paired session ("Embedded Node"), the same world. The pinned source is an exact `git archive` export of `f7b4d68711` (`autobyteus-web` and the four contract packages, their committed `dist`), served by `nuxt dev --port 4508` with `BACKEND_NODE_BASE_URL` at the observation node (`prototype/source-observation/mock-node.mjs`, port 4507, the source's `generated/graphql.ts`) and a disposable hook serving the same world: run-status answers with background counts, held runs answered as active, the node's model options and Save answers (and the refusal while a flag file exists), the fake VNC server. Where the observation node plays no agent stream, the source side's opened run gets in the page the same synthetic status, count and rich conversation the baseline's simulation gives it ("seeded" below).
Evidence: `evidence/phone-baseline-refresh-279/` (each image: baseline left, source right; `pixel-differences.txt` the differing pixels of each pair; `copied-files-audit.txt`). "Identical" means the difference is only clock-dependent text (ages, times of day) or an animation phase (spinner, pulsing dot).

| ID | Surface / state (checked now) | Result |
| --- | --- | --- |
| PR-01 | Run list with the header ⋮; the "On this phone" menu (Text size header, three steps, Standard chosen); Large chosen; Largest chosen and the menu closed; Largest after a reload | pass: identical (01–05) |
| PR-02 | The run list at Large (rails and indents in rem follow the avatars) | pass: identical (06) |
| PR-03 | Rows' activity: Agent Package Creator "2 background tasks running" (steady blue dot), the Software Engineering Team row with a member's task (blue dot, Team rule), running rows pulsing; the listed Daily Assistant green until opened, blue after | pass: identical (01, 28; dot `data-status="background"`) |
| PR-04 | Run screen of an idle run with one running task: "Background task running", blue dot; its ⋮ (Settings last, no Text size) | pass: identical bar and menu (07, 08; the conversation behind sits at another scroll offset, see PR-05) |
| PR-05 | The rich conversation screen by screen at Standard (5 screens) and Largest (6 screens): the source's `phone-conversation.css`, another agent's message with its arrow and line | pass: pixel-identical (24–27, `pixel-differences.txt`: 0–130 px, the spinner) |
| PR-06 | Activity: four background tasks (Running, Completed exit code 0, Failed exit code 1, Stopped with the time-limit line) above the tool calls | pass: identical (09; times of day differ) |
| PR-07 | Settings of a held run (seeded): subject line with the activity, stop icon, rows locked, Save off | pass: pixel-identical (10) |
| PR-08 | Settings of a stopped run; the Model sheet; a model with settings chosen (Thinking, Advanced, Save on); Save → back to the conversation | pass: pixel-identical (11–15) |
| PR-09 | Save refused (`mobile_settings_refused` / the node's refusal): the red card in the node's words, Save off; then another runtime and model: card gone | pass: pixel-identical (16, 17) |
| PR-10 | Another runtime chosen: the model is cleared ("Choose"), Save off | pass: pixel-identical (18) |
| PR-11 | Stop from Settings: Stopped, the stop icon gone, rows open | pass: pixel-identical (19) |
| PR-12 | VNC Viewer: View only; Control with Keyboard and Clipboard in the status row; the Clipboard sheet | pass: pixel-identical (20, 21; 412 px) |
| PR-13 | 360 px at Largest: the On this phone menu; the VNC Viewer in Control | pass: identical (22, 23) |
| PR-14 | Settings of a run on another node (`docker`): the sentence, no rows, no Save | baseline only (29): the source harness cannot open a peer's run (`/ws/peer-run`), see Known gaps; the screen is the source's component and its scope rule |
| PR-15 | Run screen of a delegated agent with two tasks: "2 background tasks running · in Project Task Manager" | baseline only (30): the source harness does not open a delegated agent's row; the same subject line was compared on PR-04 |
| PR-16 | Unchanged phone surfaces (Files, Artifacts, Messages, New run, connection sheet, run list states) | unchanged files; seen on the way (list, run screen, menus), no page error. Accepted evidence: next section, PH-01…PH-16 |
| PR-17 | Desktop routes `/workspace`, `/chat`, `/agents`, `/agent-teams`, `/settings`, `/nodes`, `/integrations`, `/projects`, `/memory`, `/android` | load-and-look: render, no page error, root font size 16 px and no `data-phone-text-size` |

### Known gaps

- PR-14 and PR-15 are shown by the baseline only (harness limits named in the rows). Both are the source's components; under them only the simulated peer and delegated runs differ.
- After a Save, reopening Settings on the source harness shows the earlier model because the harness does not keep the Save; the baseline shows the saved model, as a node that keeps it does. The source's own result handling was compared up to the return to the conversation (PR-08).
- Opening the Model sheet (Settings and New run) logs `llmStore.refreshCatalog is not a function` in the baseline: the shared model rows call an action the desktop-pinned catalog store does not have (since the previous refresh). Nothing visible differs (the sheets are pixel-identical); the open-time catalog re-read does not happen.
- Team and Org Settings (a member's scope, a Team or Org stop) are simulated and seen on the baseline; the source side was compared on an agent run.
- Edits under `prototype/` are not always picked up by the running dev server; restart it after changing them.
- Names, titles, models, times, counts and the invented desktop picture are illustrative. Real runs, statuses, model lists and saves were not validated. `typecheck`, `lint` and tests were not run (design work).

---

## Scoped refresh `phone-run-screen-baseline-refresh-506` (superseded for the phone by `phone-baseline-refresh-279` above)

**The whole-frontend pin is still `d74f75a51ab7dc47d42a13f33e0f943c3a230ad7`, with the earlier scoped exceptions unchanged (Settings menu and GitHub card `e4bebdc858`, Manage Nodes `3b9dc912a1`, personal settings, update switch and required tools `f78b60dddd`).
The phone (`/mobile`: the run list, the run screen, its ⋯ menu and views, New run, the connection sheet) now reflects `origin/personal@e4f4b3e1765669cf2c411652770199234ff6c214`** (release 1.5.13-beta.7; selected frontend
`/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`, read only, `HEAD` = `origin/personal` = `e4f4b3e176`, the frontend directory clean). The browser pairing page (`MobilePairingBootstrap`) and the design's Android start screen (`/android`) keep their accepted state.

- Request: Refresh (scoped), selected by the Product UI/UX Designer, ticket `phone-run-screen-baseline-refresh-506`, branch `design/phone-run-screen-baseline-refresh-506`, worktree
  `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/phone-run-screen-baseline-refresh-506`, accepted design base `b017f0881e5e62551a1774dd40f95e00c6d655a4` (worktree `HEAD` the same). Design repository `/Users/normy/autobyteus_org/autobyteus-web-design`.
- Status: `Completed`, a candidate: uncommitted changes in the ticket worktree; the Bootstrapper made no commit; integration into the default branch follows the Product UI/UX Designer's acceptance. Items the source side did not exercise are listed under "Known gaps"; none is a known UI parity difference.
- Run: `corepack pnpm install --ignore-workspace --frozen-lockfile`, `corepack pnpm dev --port 4506`; entries and starting states in `ui-reference-runbook.md` ("phone-run-screen-baseline-refresh-506"). `package.json`, `pnpm-lock.yaml`, `nuxt.config.ts` unchanged.

### What the source changed (range `d74f75a51a..e4f4b3e176` for the phone) and what was done

The baseline's phone was the autobyteus-277 *design* (`MobileRunsScreen`, `MobileRunScreen`, `MobileChat`, `MobileResults`, … driven by `mobileRunTreeStore`). The source shipped the phone as `components/mobile/{runList,runScreen,views,newRun,connection}/*`, `MobilePairedShell`, `MobileBottomSheet`,
`MobileScreenBar` and `pages/mobile.vue` (autobyteus-277, 407, 426, 432, 433, 435, 436, 437, 450, 461, 471, 472, 473), and changed the shared conversation, composer and file-viewer components. Where the source implements a surface the design had made, the source version wins (refresh policy).

Copied unchanged from `e4f4b3e176` (UI code; `cmp` identical; 112 files, audit in the evidence folder): every `components/mobile/**` screen above (the old design screens are deleted), `MobileRemoteAccessShell`, `pages/mobile.vue`; the conversation and viewer components the diff touched
(`UserMessage`, `InterAgentMessageSegment`, `SystemTaskNotificationSegment`, `MarkdownRenderer`, `MessageAttachmentThumbnail`, `FileViewer` and its viewers, `AgentConversationFeed`, `ArtifactContentViewer`, `CollaborationMessageReferenceViewer`, the composer's `ContextFilePathInputArea`/`ContextFileErrorLines`,
`ModelListRefreshControl`, `SearchableGroupedSelect`, `SystemInstructionActivityItem`); the phone's composables (`useMobileNavigation`, `useMobileSubjectRestore`, `useMobileRouteRunSync`, `useMobileRunSetupController`, the file, attachment, download and zoom composables, the node-desktop composables, `useVncSession`,
`useBackgroundTaskPanelView`, `useTargetConversation`, `useRemoteRun*`, `useContextAttachmentComposer`, `useMarkdownSegments`, `useEventMonitorFilePreview`, `useAuthorizedObjectUrl`), their utils and types, `stores/mobileNodeSessionStore`, `stores/mobileRunOpeningStore`, `stores/contextFileUploadStore`,
`stores/agentBackgroundTaskStore`, `types/node.ts` and `utils/nodeEndpoints.ts` (the node desktop's stream endpoint), and the new localization keys (`mobileNodeDesktop.ts`, plus the keys the source added to `agentInput.generated`, `chat`, `workspace`, `workspace.generated`; existing keys keep their text).
Nothing in the data layer of the desktop (run history, streaming, hydration, the run tree) was taken from the new source: the desktop surfaces keep their accepted state. The conversation, composer and file-viewer components are shared with the desktop's run screen, so they now show the source's current version there too.

What changed for the user (from the source, shown by the copied components): the phone is **your runs with their delegated work** (a run row, its Team/agent/peer rows, "Show older (N)", the round "+"); a **run screen** with the status line ("Idle · in <parent>", "Not reachable"), the open run's conversation and composer; the **⋯ menu** (Artifacts, Files, Messages for a Team or Org member, Activity, VNC Viewer when the paired node has a node desktop);
**Activity** with the run's background tasks above its tool calls (autobyteus-473); **Files** (folder tree, search, a file's viewer, node files, message attachments) and **Artifacts**; **Messages** with a reference's full-screen viewer; the **VNC Viewer** (View only / Control, Keyboard, Clipboard, Fit/Fill, Full screen); **New run** (Agent, Folder, Runtime, Model sheets, Thinking, Advanced, Auto approve tools);
the **node sheet** (name, state, check, Switch node in the app, "Unpair from <node>") and the unpair confirmation; "Connected to <node> · Opening your runs…" after pairing; the run list's states (loading, empty, error, node not reachable, Phone access off, the unsupported notice).

### Reconciliation with accepted design-only changes (shared refresh policy)

- `mobile-experience-redesign` (the phone's design layer): its screens are replaced by the source's (the source version wins). Its data (`prototype/mobile-runs/mobileRunsFixture.ts`) is kept as the phone's synthetic world and moved to `prototype/source-observation/mobile-world.mjs` so the observation node can serve the same world to the pinned source.
- `one-step-phone-pairing` (accepted design): the browser pairing page and the Android start screen are untouched (only the session's storage key and shape follow the source's: `autobyteus.remote_access.mobile_session`, `entryId`, `nodeName`). The source's connection sheet already carries the design's **Switch node** (through the app's `window.AutoByteusShell`); the design's `/android` route now installs a simulated bridge
  (`plugins/11.android-shell-bridge.client.ts`), so the sheet shows it in the app and not in a plain tab, exactly as the source does.
- `agent-definition-reconnect-ui` (design-only, no source equivalent): preserved; its two additions to shared files (`AgentReconnectComposerNotice` in `AgentEventMonitor.vue`, `AgentMissingErrorCard` in `ErrorSegment.vue`) were re-applied on top of the source's `AgentEventMonitor.vue` (`ErrorSegment.vue` is unchanged). New run's Agent sheet lists the design layer's catalog agents (about forty) where the source lists only the node's own: that is the accepted design layer, not a parity difference.
- No other accepted design change touches the copied files (checked against `d74f75a` for each overwritten file).

### Simulation beneath the UI (the UI reference has no backend; every value is invented)

- The screens are the source's own components. Under them: `stores/mobileRunTreeStore.ts` (the world's runs as the phone's rows, folds, "Show older"), and stand-ins named like the product's stores and composables, so the copied screens import them unchanged: `stores/runListStore.ts`, `stores/runTreeStore.ts` (which agent runs another node runs),
  `stores/runStatusStore.ts` (the peer Retry), `composables/mobile/useMobileRunTree.ts`, `composables/mobile/useMobileRunOpening.ts` (tap → pending "Opening…" → the run opens through the baseline's own stored-run open → commit or fail), `composables/runHistory/useRunHistorySectionLoad.ts` (the first read answers by the scenario), `services/liveStreamLifecycle/closeAllLiveStreams.ts`,
  `utils/runListProjection.ts` and `utils/mobile/mobileRunListRows.ts` (row types and keys only). The product builds these from the node's run history and the server's run trees and run-status stream; none of that was ported.
- `prototype/source-observation/mobile-world.mjs` (new, plain data and functions): the runs and their trees, the rich conversation (a `Conversation` built in the page: the node's stored run has no such mix), projections of the other runs, Activity, background tasks, a participant's Team messages, file changes (Artifacts), the workspace search, a Team's stored execution tree.
  `prototype/mobile-runs/mobileRunsFixture.ts` answers the node's GraphQL reads for it from `utils/apolloClient.ts` (no longer a design-only layer; `designOnlyLayers` does not switch it off).
- `prototype/mobile-runs/mobileNodeRest.ts`: the node's answers to the phone's credential check, its public status, its node desktop (`/rest/node-desktop`) and a media file, by scenario. `prototype/source-observation/fake-rfb.mjs`: a minimal VNC server (one frame of an invented desktop, no input) played by the local WebSocket (`plugins/00`), so the VNC Viewer connects and shows a picture.
  `prototype/mobile-runs/mobileMessagesView.ts` + a one-line wrap in `stores/activeContextStore.ts`: a member's Messages rows (the product loads them with `collaborationParticipantMessages`).
- `plugins/00.prototype-state.client.ts`: `mobileNodeSession` and `mobileRunOpening` run the source's own code; the phone's screens are routes of one page, so the snapshot of the page is not re-applied on a route change within `/mobile`; the phone reads an opened workspace file and runs the workspace search through the source's own actions; the node desktop's stream is the fake VNC server;
  the seeded session follows the source's storage key. `components/mobile/MobilePairingBootstrap.vue` (the design's pairing page) writes that session and reloads the store.
- Server-side outcomes are scripted: a draft's first send, Retry on a down peer (stays down), the node desktop (View only, never any input), Create run (a draft run on the node).

### Starting-state selection (scenarios)

Set in the browser console, then reload (see the runbook for the list): `localStorage.setItem('autobyteus.prototype.scenario', '<name>')` with `mobile_runs_loading`, `mobile_runs_empty`, `mobile_runs_error`, `mobile_runs_node_offline`, `mobile_phone_access_off`, `mobile_session_revoked`, `mobile_node_desktop`, `mobile_node_desktop_busy`. The default is the populated list with the rich run.

### Inventory and comparison (source `e4f4b3e176` vs baseline, matched, 412×915 CSS px, device scale 2)

Conditions: the same browser (Chrome driven by a disposable Playwright script under `/tmp`, nothing added to the repository), one fresh context per state, the same paired session (node name "Embedded Node"), the same world. The pinned source is an exact `git archive` export of `e4f4b3e176` (`autobyteus-web` and the four contract packages, their built `dist` copied;
scratch `/tmp/r506/src`), served by `nuxt dev --port 4508` against the observation node (`mock-node.mjs`, `PROTOTYPE_MOCK_PORT=4507`, `PROTOTYPE_SCHEMA_PATH=<source>/generated/graphql.ts`) with a disposable hook (`PROTOTYPE_MOCK_HOOK=/tmp/r506/hook/hook.mjs`: it serves the same world as the node's GraphQL answers, run tree rows and `/ws/run-status`, `collaborationParticipantMessages`, file changes, the Team and Org inspections and the fake VNC server).
Compared per component and state: the screenshots side by side and a pixel difference of each pair (a pair is "identical" when the difference is nothing but clock-dependent text: the ages "2m/6h", times of day, a spinner's rotation). Where the source needed a state its node harness cannot play, the way is named in the row.
Evidence: `evidence/phone-run-screen-baseline-refresh-506/` (each image: baseline left, source right; `NN-name.png`; `pixel-differences.txt` has each pair's differing pixels, `copied-files-audit.txt` the byte audit). The rich conversation is set in the page on the source side (the observation node's stored run cannot carry the mix of segment types: `agentContexts` run's conversation, the same `Conversation` object the baseline's open sets).

| ID | Surface / state | Result |
| --- | --- | --- |
| PH-01 | Run list, populated: a run with delegated work (Team, agent, peer Team and agent on `docker`, a Team on `office-mac` that does not answer), an Org with members, "Show older (8)" opened (13 listed runs, full height) | pass: identical (1,559 of 4.28 M px differ: the ages "2m/6h" and the like) |
| PH-02 | Run list states: loading, empty ("No runs yet"), error ("Couldn't load your runs." + Retry) | pass: identical (the source's empty state is shown after setting `runHistory.loading` false in the page: in the observation node its history poll keeps `loading` set, the state itself is the same component; pixel difference 0) |
| PH-03 | Node state: not reachable (banner "Can't reach Embedded Node." + Check), Phone access off, the unsupported-route notice | pass: identical |
| PH-04 | Run screen header: name, status line ("Stopped", "Stopped · in <parent>" for a Team member), the ⋯ menu per target kind (Artifacts, Files, Activity; Messages for a member; VNC Viewer only with a node desktop) | pass: identical (agent run, Team member, Org member; the agent run's conversation sits 24 px lower on the source side only because its conversation was set in the page after the open) |
| PH-05 | The conversation of the rich run, top to bottom (6 screens of 694 px): user message with three attachment chips, think, text, tool-call cards (success, error), terminal, edit-file, write-file, a running terminal card, markdown (headings, numbered and bulleted lists, inline code, three code blocks, table, quote), image, error segment with Show Details, user message, inter-agent message, system task notification, text | pass: pixel-identical (243 px of the spinner differ) |
| PH-06 | The composer: placeholder, Context Files row, send button; "Type a message…" on a draft; typed text; after the first send | pass: identical |
| PH-07 | Run screen "Opening…" and a row that cannot open (a Team on a node that does not answer stays on the list); reload on a run screen restores it | pass: same outcome both sides |
| PH-08 | Activity: background tasks (Running, Completed, Failed, counts, times) above the tool calls (success, error with its text, terminal with Show details, executing) | pass: identical (task times differ by the clock) |
| PH-09 | Artifacts: the list of the run's files; an opened markdown artifact | pass: identical |
| PH-10 | Files: the folder, a subfolder with its breadcrumb, a file's viewer, the search with a result | pass: pixel-identical |
| PH-11 | Messages (a Team member: From/To rows, times, reference files) and a reference's full-screen viewer | pass: identical (times differ by the clock) |
| PH-12 | VNC Viewer: connected, View only (the picture); too many viewers (Retry) | pass: pixel-identical (connected); identical (refused) |
| PH-13 | New run: the form with its defaults, the Agent, Folder and Model sheets, Create run (the draft's run screen), typed message, the first send (the user message shows) | pass: identical, except the Agent sheet's list (design catalog, see reconciliation) |
| PH-14 | Connection sheet (Connected, check icon, Checking…, Unpair from <node>), the unpair confirmation, the pairing screen after Unpair | pass: identical |
| PH-15 | In the Android app: the sheet's "Switch node · N nodes on this phone", the app's node name; Switch node returns to the app's node list | pass: the source's component with a simulated bridge (the real app is native) |
| PH-16 | After pairing: "Connected to <node>" then the run list | pass: the source's component; played on the baseline ("Connected to Office Mac · Opening your runs…", then the list); the source's own pairing needs a real node |
| PH-17 | The rest of the baseline (desktop routes, Android start screen, pairing page) | unchanged: load-and-look pass of ten routes (`/workspace`, `/chat`, `/agents`, `/agent-teams`, `/settings`, `/nodes`, `/integrations`, `/projects`, `/memory`, `/android`), no page error |

### Known gaps

- The reachable peer run's screen (the remote chip beside the run name, the other node's name in the composer placeholder) and the unreachable peer's notice with Retry are shown by the baseline only: the pinned source opens a peer's run on the peer-run stream (`/ws/peer-run`), which the observation node does not play. Both are copied components (`RemoteNodeChip`, `RemoteRunNotice`, `useRemoteRunView`).
- An Org member's run screen was compared at its menu (Artifacts, Files, Messages, Activity). The source harness shows its own invented Org rows, whose "in <Org>" parent line did not appear for the harness's ids; the baseline shows the line. The Org member opens as a Team member in the baseline (the same screens).
- Not exercised on the source side, because they are copied components with nothing simulated under them that differs: the VNC Viewer's Control mode, Keyboard, Clipboard, Fit/Fill and Full screen; the PDF and image zoom in the file viewer, Download; the composer's upload progress and refusals; a file a conversation names opening in the Files screen. The fake VNC server plays View only and a picture; it takes no input.
- The pairing page is the design's, not the source's (`MobilePairingBootstrap`); it was out of this refresh's scope.
- The agent catalog of New run's Agent sheet (design layer) and the Org rows' invented ids are illustrative. Names, titles, times, counts, the invented desktop picture and the media picture are illustrative.
- The simulated run list, trees, statuses and opens are not the product's run history, run tree store or run-status stream; none of those was validated.
- `typecheck`, `lint` and tests were not run (design work).

---

## Scoped refresh `package-clone-auto-update-457` (read this first)

**The whole-frontend pin is still `d74f75a51ab7dc47d42a13f33e0f943c3a230ad7`; the Settings menu and GitHub card still reflect `e4bebdc858`, Manage Nodes `3b9dc912a1`. Three
surfaces now reflect `origin/personal@f78b60dddd0d1a3db97dfbf8b4bced3b61549010`** (release 1.5.13-beta.2; selected frontend
`/Users/normy/autobyteus_org/autobyteus-worktrees/package-clone-auto-update-457/autobyteus-web`, read only, `HEAD` = `f78b60dddd`, no uncommitted frontend change): (1) the Agents, Teams and
Orgs editors' personal settings, (2) the automatic-update switch and update notifications of Agent packages and Skill sources, (3) the Integrations required-tools row. Everything outside them is
unchanged. Everything below this section still describes the earlier pins.

- Request: Refresh (scoped), ticket `package-clone-auto-update-457`, branch `design/package-clone-auto-update-457`, worktree
  `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/package-clone-auto-update-457`, accepted design base `0341b3af9f1eca8b557765fea6a6ac00739edbae` (worktree `HEAD` `d1ed2987`, the ticket-open commit).
  Design repository `/Users/normy/autobyteus_org/autobyteus-web-design`.
- Status: `Completed`, a candidate: uncommitted changes in the ticket worktree; the Bootstrapper made no commit; integration into the default branch follows the Product UI/UX Designer's acceptance.
- Run: `corepack pnpm install --ignore-workspace --frozen-lockfile`, `corepack pnpm dev --port 4570`; entries and scenarios in `ui-reference-runbook.md` ("package-clone-auto-update-457"). `package.json`, `pnpm-lock.yaml`, `nuxt.config.ts` unchanged.

### What the source changed (range `d74f75a51a..f78b60dddd`, the scoped files) and what was done

Copied unchanged from `f78b60dddd` (UI code; `cmp` identical to the source file): `components/definitions/PersonalSettingsNote.vue`, `PersonalSettingMark.vue` (new), `components/agentOrgs/AgentOrgPersonalSettings.vue` (new),
`components/agents/AgentDefinitionForm.vue`, `AgentDetail.vue`, `AgentDefinitionDetailSections.vue`, `components/agentTeams/AgentTeamDefinitionForm.vue`, `components/agentOrgs/AgentOrgExperience.vue`,
`components/launch-config/DefinitionLaunchPreferencesSection.vue` (the runtime/model mark and Reset; a consumer the request did not name), `composables/usePersonalSettingReset.ts`, `types/personalSettings.ts`,
`localization/messages/{en,zh-CN}/personalSettings.ts` (+ one import and one spread line in each locale's `index.ts`), the three definition stores (`agentDefinitionStore`, `agentTeamDefinitionStore`, `agentOrgDefinitionStore`: the Reset actions) and the six
GraphQL documents they use (`personalSettings`, `personalSettingsBase` fields; the three Reset mutations);
`components/notifications/{AutoUpdateSwitch,NotificationRow,NotificationSection,NotificationCenter}.vue`, `components/skills/SkillSourceRow.vue`, `localization/messages/{en,zh-CN}/updateNotifications.ts`, `stores/updateNotificationsStore.ts`;
`components/integrations/IntegrationToolsRow.vue` (new).
Also copied because the files above need them (the same source change, **not asked for, the app's own switch**, autobyteus-356): `stores/appUpdateStore.ts`, `shared/appUpdateTypes.ts`, `types/electron.d.ts`, `components/layout/SidebarNotificationsEntry.vue`
(counts the automatic outcomes of every kind). `vendor/autobyteus-agent-presentation-contracts` gets the source's `agentRuntimeName` (`src/agent-runtime-names.ts`, `dist/agent-runtime-names.*`, the index export) because `AgentDefinitionDetailSections.vue` and
the store import it (the detail page now says "AutoByteus" where the baseline said `autobyteus`); the package's other change (remote task launches) is not taken.

What changed for the user, from the source:
- Editors (agent, Team, Org) of a definition from a package, and of a built-in agent: one note line under the title ("Tools, skills, avatar and runtime/model are your personal settings on this computer. Package updates keep them." /
  "… Restarts and AutoByteus updates keep them." for a built-in agent / Teams and Orgs: "Avatar and runtime/model …"). A setting that is personal carries a **Personal** mark and a link, **Reset to the package's setting** (built-in agent: **Reset to the built-in setting**), next to
  its label: agent Avatar, Skills, Tools and the Runtime/model block; Team Avatar and Runtime/model; Org Avatar (a mark under the avatar) and, when the runtime/model is personal, a line "Default runtime/model: <runtime> · <model>" with its mark. Reset saves at once, brings the
  package's value back, keeps the user's other unsaved edits, and a failed Reset shows "The setting could not be reset: <reason>" under the note. An agent made by hand has no note and no marks (nor does a create page).
- **The detail pages carry no personal marks in the source** (the diff of `AgentDetail.vue`, `AgentDefinitionDetailSections.vue`, and of the Team and Org detail views shows only the runtime's display name and the removal of broken `i-heroicons` spans of the three buttons); the request's "Personal marks on the detail page" has no source
  counterpart and none was built.
- Notifications: the switch's texts for Agent packages say that personal tools, skills, avatars and runtime/model are kept and the other local changes are replaced with a backup (explanation off/on, the confirmation dialog); `AUTO_UPDATED`/`AUTO_FAILED` rows now count for the sidebar entry for every kind; the time tooltip and layout of a handled row do not wrap. Skill sources' texts did not change.
- Required tools row: the same row as the baseline's own, now one component the Integrations page uses.

Simulation beneath the UI (the UI reference has no backend; every value is invented):
- `prototype/source-observation/personal-settings-fixtures.mjs` (new): which fixture definitions come from a package (Research Assistant, Documentation Writer, Product Review Team, Product Launch Org) or are built in (Daily Assistant), which settings are personal at the start and the
  package's own value that a Reset brings back; the three Reset mutations answer from it; a Reset of an unknown or non-personal setting changes nothing. Used by both the observation node (through `fixtures.mjs`) and the UI reference (`utils/apolloClient.ts`).
- `plugins/96.personal-settings.client.ts` (new): fills the two fields in the Agents, Teams and Orgs stores (the captured route snapshots carry none); any other definition (the design layer's catalog agents) is made by hand and has none.
- `plugins/00.prototype-state.client.ts`: the three Reset store actions run the source's own code (`localActions`) and their results survive navigation (`overlayAfterActions`); `appUpdate.setAutomaticUpdate` runs the source's action; the editor/detail page of another definition id takes the captured shell snapshot of the same page type (the tool catalog loads with it).
- `utils/apolloClient.ts`: the Reset mutations are answered locally; a no-op `cache` (the Org store publishes to the client cache); the resets start again with the scenario. `prototype/shared/install-host-scenario.js`: `setAppUpdateAutomatic` and `automaticUpdate`/`automaticInstallPreparing` in the simulated desktop's update state.
- Scenarios (new, in `scenarioCatalog`): `personal_settings` (Populated plus one more agent, "Release Notes Helper", made by hand), `personal_settings_reset_fails` (Reset answers an error). The notification scenarios (`updates_*`) are the existing ones.
- Server-side outcomes are scripted, not computed: a Save does **not** change which settings are personal (the source's node decides that; see known gaps).

### Reconciliation with accepted design-only changes (shared refresh policy)

- `agent-definition-reconnect-ui` (design-only layer: about forty catalog agents, the Video Team): untouched; its catalog agents are "made by hand" (no note, no marks), as any agent without a package. `AgentDefinitionForm.vue` and the other copied files were byte-identical to `d74f75a` before the copy (no design edit in them).
- `skill-sources-dialog-redesign`, `integrations-page-r2`: untouched, except the tools block of `integrations-page-r2` (below). `SkillSourceRow.vue` (copied; it only formats the check time in the interface language) is used by the redesigned dialog unchanged; the dialog opens and shows the same rows with the layers on.
- `integrations-page-r2` required-tools block: the baseline page was designed without the component, with the same markup inline. Reconciled: `IntegrationDetail.vue` now renders the source's `IntegrationToolsRow` (the inline block is removed, as in the source); a tool of the fixture is `{ tool, found }` (was `{ name, found }`: the component reads `check.tool`), so
  `IntegrationTile.vue` and `prototype/integrations/integrationsDesignFixture.ts` follow. The source's other Integrations changes (the source's own page, store, helper text, import errors) are outside this refresh and not taken; the page keeps its design. The page's tools block is SAME as before the refresh (old HEAD vs now, en and zh-CN).

### Comparison (source `f78b60dddd` vs baseline; details and sample screenshots in `evidence/package-clone-auto-update-457/`)

Conditions: the exact `git archive` of the pin served on :4572 beside the observation node :4573; the baseline on :4570 with design-only data off; fresh 1440×900 contexts (656 for narrow), same scenario, host context, locale. Per component: element tree, text, attributes, classes, geometry relative to the root, 29 computed
style properties. Disposable scripts under `/tmp/r457`; nothing was added to the repository for it.

| ID | Surface / state | Result |
| --- | --- | --- |
| PS-01 | Agent from a package, all four settings personal: note, Avatar / Skills / Tools / Runtime-model marks and Reset links (en, zh-CN, 656) | pass: identical |
| PS-02 | Agent from a package, nothing personal (note only); built-in agent (built-in note and Reset text); agent made by hand (no note); agent create | pass: identical |
| PS-03 | Team from a package (note, Avatar and Runtime/model marks); Team create | pass: identical (en, zh-CN) |
| PS-04 | Org from a package (note, avatar mark, "Default runtime/model" line with mark); Org create | pass: identical (en, zh-CN, 656) |
| PS-05 | Reset of each personal setting (agent tools with an unsaved Name edit kept, avatar, skills, runtime/model; built-in tools; Team avatar, runtime/model; Org avatar, runtime/model): mark gone, package value back | pass: identical |
| PS-06 | Reset fails: "The setting could not be reset: <reason>", unsaved edit kept | pass: identical |
| PS-07 | Agent, Team, Org detail pages (package and built-in agent) | pass: identical (no marks in the source either) |
| AU-01 | Notification Center, Agent packages and Skill sources sections, switch off (waiting rows) (en, zh-CN, 656, browser window) | pass: identical |
| AU-02 | Confirmation dialog for Agent packages and for Skill sources (en, zh-CN), Cancel/Esc | pass: identical |
| AU-03 | Turned on: switch on, then the automatic outcomes arrive (updated; failed with its reason) | pass: identical |
| AU-04 | Switch on with every outcome row (`updates_auto_on`): Updated automatically, Failed with a reason, Waiting; both kinds; en, zh-CN; browser window | pass: identical |
| AU-05 | `updates_outcomes_only` ("1 updated" entry and panel), `updates_off` (no-effect line), switch turned off | pass: identical |
| AU-06 | The app's own switch row (by-product) in the desktop window, on, zh-CN | pass: identical |
| AU-07 | Update checks card (switch off/on, confirmation from the card for both kinds, zh-CN): reads the same switch | pass: identical (hidden `<option>` boxes aside) |
| AU-08 | Skills → Sources dialog rows (SkillSourceRow): populated, `skill_source_issues`, zh-CN | pass: identical |
| RT-01 | Required-tools row: tool found; tool missing + "Check again" ("Checking…", disabled, back); several tools; en, zh-CN | pass: the component is byte-identical to the source's and the page's block is identical to before the refresh |

Quick load-and-look pass of the unchanged surfaces (agent, Team and Org lists, chat, workspace, skills, integrations, Nodes, Settings → Server Settings, About, Updates, Memory, Projects): no page error.
Unchanged in source and not touched (verified identical to the baseline): `AgentPackagesManager.vue`, `SkillSourcesModal.vue`, `UpdateChecksCard.vue`, `AgentList.vue`, `AgentTeamDetail.vue`, `AgentTeamList.vue`, `pages/{agents,agent-teams,agent-orgs,skills,settings}.vue`.

### Known gaps

- **Not refreshed though the range changed it** (other surfaces; a decision for the Product UI/UX Designer): Settings → About / `AutoUpdateSwitch` variant `settings` (the app's switch on the About page, autobyteus-356, `AboutSettingsManager.vue`); `components/settings/nodes/NodeAutoUpdate.vue`
  + `stores/nodeAutoUpdateStore.ts` (automatic update of remote nodes on Manage Nodes); `SystemTaskNotificationSegment.vue`; the source's own Integrations page and store; and all other changes of the range.
- The app's own switch and its automatic outcome rows (autobyteus-356) come with the copied notification files: the switch works in the simulated desktop (accepted, saved), but the app's automatic install and its outcome rows ("Updated automatically", "not retried") have no scripted timeline and were not compared; the simulated app update only plays "Download".
- A Save of an editor does not change which settings are personal (in the source the node decides, so the marks after a Save, and what a package update later does to them, are not simulated). Reset is the only scripted outcome.
- The Agent runtime section of the Notification Center and the Update checks card's runtime lines were not compared (the source harness does not reproduce the desktop's own window, so they do not show there); the baseline's are the accepted ones of `WEB-BASELINE-REFRESH-012`.
- The two new scenarios `personal_settings` and `personal_settings_reset_fails` are for review; the default Populated shows the notes and marks of the fixture's package and built-in definitions (the source shows them for any such definition).

---

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
