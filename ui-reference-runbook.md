# UI Reference Runbook

## private-network-661 (Private Network, Tailscale first; Pair again; pair by address; autobyteus-661)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4661
```

Desktop window and Nodes list: `localStorage.setItem('autobyteus.prototype.context','electron_internal'); localStorage.setItem('autobyteus.prototype.scenario','nodes_user')`, then reload. Chinese: `localStorage['autobyteus.localization.preference-mode']='zh-CN'`. State is in memory: a reload resets it.

- **Private Network** (`/settings?section=extensions`, Show settings on its card): `autobyteus.prototype.extensions` = `network_not_joined` · `network_approval` (approved after about 10 s) · `network_joined` · `network_expired` · `network_signed_out` · `network_unreachable` (back after about 12 s) · `network_blocked` · `network_shared_unknown` · `network_restarting`. Without a `network_*` value Private Network is not installed (Install plays the install).
- **Pair again** (`/nodes?nodeTab=manage`): `autobyteus.prototype.pairing` = `after_update`: docker (older AutoByteus: Update, then Pair again), linux-box (one click), bob-laptop (someone else's: accepts after about 7 s).
- **Pair by address** (Paired nodes → Pair with someone else's node): `192.168.1.30` accepts after about 7 s (dana-mac), `192.168.1.40` declines after about 6 s, `192.168.1.50` runs an older AutoByteus; any other address has no node. `localhost:8001`, `192.168.2.50:29695` are controlled nodes; `127.0.0.1:29695` is this node.
- **The other node's side**: `autobyteus.prototype.pairing` = `address_request` ("dana-mac at 192.168.1.30:29695 wants to pair").
- **Join first** (Add a node, without `network_*`): paste this fixture code (design only, never valid anywhere) in Access code:
  `abps_eyJub2RlSWQiOiJzcnZfYnUxbGRTM3J2M3JOMGRlQzBkZVF4N1JmMkxtOVBkWnQ0V24iLCJhZGRyZXNzIjoiMTAwLjg4Ljc1Ljc1OjI5Njk1Iiwic2V0dXBDb2RlIjoiRFNHTi1PTkxZLTY2MTAiLCJleHBpcmVzQXQiOiIyMDk5LTAxLTAxVDAwOjAwOjAwWiJ9`
- **Shared machine**: `network_joined` (dana-desktop "shared by dana@other.example"), `network_shared_unknown` ("shared with you").
- The world: `stores/privateNetworkStore.ts`, `prototype/extensions/extensionPages.ts` (the extension's page), `prototype/nodes/network-world.mjs` (`setPaired`, `addPeerAt`). Review notes: `tickets/in-progress/private-network-661/review-round-1.md`.

## extensions-ui-516 (design, round 1: Settings → Extensions on the extension foundation, Manage Nodes → private network and pairing, the access code; autobyteus-516)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4516
```

The desktop app's own window: `localStorage.setItem('autobyteus.prototype.context', 'electron_internal')` and, for the Nodes list, `localStorage.setItem('autobyteus.prototype.scenario', 'nodes_user')`, then reload. A Docker node's window: context `electron_external` (Voice Input is not listed there). Chinese: `localStorage['autobyteus.localization.preference-mode'] = 'zh-CN'`. State is in memory: a reload resets it.

- **Settings → Extensions**: <http://127.0.0.1:4516/settings?section=extensions>. Starting state `autobyteus.prototype.extensions` = (none) Voice Input on, Private Network not installed · `fresh` · `voice_failed` · `voice_update` · `voice_not_available` (this computer is linux-arm64) · `network_*` (superseded by private-network-661 above: Headscale, hosting and own-VPN states were removed).
- **Manage Nodes**: <http://127.0.0.1:4516/nodes?nodeTab=manage> with `nodes_user` and `network_joined`: Found on your private network (bob-laptop Pair: bob accepts after about 7 s; raspberrypi flagged, declines; carol-server Accept/Reject), the two switches; Nodes list with Pair, Paired + Unpair (linux-box pairs from its row in one click).
- **A node window on another entry**: `localStorage.setItem('autobyteus.prototype.windowEntry', 'remote-linux-box')` with context `electron_external` (a node published on 192.168.2.50: Create access code shown, Controlled by with Revoke).
- **Chinese**: `localStorage['autobyteus.localization.preference-mode'] = 'zh-CN'` (translated extension names, descriptions and pages).
- **Access code** (pairing-contract §6, no first-run page): Nodes → Docker Guide → "Design reference only: show what access-code prints" gives a working code for `autobyteus-node-2`; paste it under Manage Nodes → Add node → "Have an access code? Paste it instead", or on a "Needs connecting" row.
- The world is invented: `stores/extensionsStore.ts` (each node's extension manager and the two server parts), `stores/privateNetworkStore.ts` (the private network, discovery, pairing), `prototype/extensions/extensionPages.ts` (the two extensions' own pages, real sandboxed frames and bridge). A paired node joins the simulated network of nodes (`prototype/nodes/network-world.mjs` `addPrivateNode`). Times are shortened (pairing about 4.5 s, the first transcription about 5 s).
- Review notes: `tickets/in-progress/extensions-ui-516/review-round-1.md`; changes: `design-change-log.md`.

## extensions-nodes-baseline-refresh-516 (Settings → Extensions, the Nodes page's Manage Nodes and Phone Setup; these reflect `origin/personal@b768c503f9`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4517
```

Starting states: in the browser console set the keys, then reload; remove them to reset. A desktop window: `localStorage.setItem('autobyteus.prototype.context', 'electron_internal')` (the desktop's own node) or `'electron_external'` (a window on Docker 8001, or on "Office Mac" in the `remote_*` phone states); no context key = a browser window. Chinese: `localStorage['autobyteus.localization.preference-mode'] = 'zh-CN'`. State is in memory: a reload resets it.

- **Extensions**: <http://127.0.0.1:4517/settings?section=extensions> (desktop window). `autobyteus.prototype.scenario` = `populated` (installed, enabled; Disable / Enable, the language and audio source, Reinstall), `extension_error`, `extension_missing` (Install plays the install steps for about 6 s). A browser window shows "only in the desktop app".
- **Manage Nodes**: <http://127.0.0.1:4517/nodes?nodeTab=manage>, scenario (desktop window):
  - `nodes_user` (embedded node and Docker 8001; Add node `http://localhost:8003` with a name opens the pairing dialog; 8004 fails with the Docker loopback hint; 8005 restarts once), `nodes_states` (a row in every state; **lab** is registered before pairing: "Not paired yet", Pair again);
  - node access: `nodes_access` (Docker 8001 "Needs connecting.": any setup code connects after 0.7 s), `nodes_access_code_invalid`, `nodes_access_network_refused`, `nodes_access_unreachable`; a connected remote row's Disconnect icon makes it need connecting; a node added on the page needs connecting;
  - automatic node updates: turn "Update automatically" on for Docker 8001 in `nodes_user` (the update runs at once, about 20 s, then "Updated to …"); `nodes_auto_updated`, `nodes_auto_failed`, `nodes_auto_save_fails`; the earlier `nodes_update_*` scenarios (Update to …) are unchanged.
- **Phone Setup**: <http://127.0.0.1:4517/nodes?nodeTab=phoneSetup> with scenario `nodes_user` and a desktop context. The source's Phones panel; `autobyteus.prototype.phonePairing` chooses the network facts: `tailscale` (default; the secure web address set up), `tailscale_no_https` (Advanced shows the command), `company_address`, `vpn`, `wifi_ask`, `wifi_new_network`, `wifi_allowed`, `nothing` (blocked), `docker_unpublished` (with `electron_external`), `remote_lan`, `remote_tailscale`, `remote_vpn`, `remote_unreachable`, `remote_nothing` (with `electron_external`: a window on "Office Mac"), `expired` (a shown code expires after 4 s), `no_phones` (empty list), `access_off`. On the Company address tab, `http://192.168.2.10:29695` reaches this node; another address does not.
- The world is invented: `prototype/nodes/network-world.mjs` (nodes, addresses, pairing, phone facts), `prototype/source-observation/rest-fixtures.mjs` (phone access, phones, codes), `prototype/shared/install-host-scenario.js` (the desktop shell: node access, automatic updates, the Voice Input install). Restart the dev server after editing files under `prototype/` or `plugins/`.
- Evidence: `ui-baseline-report.md` (first section), `evidence/extensions-nodes-baseline-refresh-516/` (left: the baseline, right: the pinned source).
- The desktop panel of `one-step-phone-pairing` and `phone-setup-remote-node-wording` below (`PhoneConnectPanel`) is replaced by the source's panel; their `/android`, node sheet and browser pairing page entries still apply.

## memory-baseline-refresh-554 (the Memory page `/memory` and the Agents page's semantic memory card and field; these reflect `origin/personal@8430d9ef12`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4555
```

- **Memory**: <http://localhost:4555/memory> opens Browse (Agents, Agent Teams, Agent Orgs); Search and Index are the other two tabs (`?view=home&section=search|index`). A card opens an agent's runs, a Team's or Org's runs with their members; a run or member opens the run inspector (Work Journal, Raw Traces).
- Search: `ddns updater for the home domain` (nine runs; the last, **writer**, is a run the index knows only by its folder and opens a Work Journal-only inspector), `bunny and tortoise`, `域名 自动更新`, `purple elephant` (none of the words found), `ddns updater cloudflare` (some words not found). A match opens the run's Work Journal at the matched lines; Match 1 / Match 2 switch between them.
- Voice input in Search shows in the desktop app's window only (voice input is an installed extension there): `localStorage.setItem('autobyteus.prototype.context', 'electron_internal')`, reload. The microphone button plays a scripted capture (Starting, Recording with Cancel recording, Transcribing); the invented transcript joins the typed text and the search waits for **Search**.
- Starting states (browser console, then reload; remove the key to reset): `localStorage.setItem('autobyteus.prototype.scenario', '<name>')` with
  `memory_not_indexed` (Index now; the runs have no Work Journal until the build has made them: "No Work Journal yet. Index your memory to create it."),
  `memory_meaning_running`, `memory_index_failed` (Try again), `memory_model_changed` (Rebuild and its confirmation; search answers by words only, so `purple elephant` shows "No matches"),
  `memory_search_fails`, `memory_index_unavailable` (the first index status read fails: the error with Retry), `memory_index_start_fails` (not indexed; Index now is refused, the reason shows under the steps),
  `memory_imported_source` (the source selector lists "Office Mac (imported)"; its runs have no Work Journal: "No Work Journal"), `empty`. The default is an index that is up to date.
- The build is accelerated: a 400 ms tick per step, about 85 s from Index now to "Up to date"; the page reads the status every 2 s as the source does.
- **Agents**: the detail page has a **Semantic memory** card: Daily Assistant (built in) is On with its folder (a personal setting), every other agent Off. Edit → the **Semantic memory** checkbox under Avatar; Daily Assistant's carries **Personal** and **Reset to the built-in setting** (Reset turns it Off). Checking it on another agent and saving shows On with the folder on its detail page.
- The world is invented: `prototype/memory-search/memoryDesignFixture.ts` (lists, the scripted search, generated journals, the index timer: `memoryOperation`), answered through `utils/apolloClient.ts`; the agents' semantic memory in `prototype/source-observation/personal-settings-fixtures.mjs`. State is in memory: a reload resets it. Restart the dev server after editing files under `prototype/` if a change does not show.
- Evidence: `ui-baseline-report.md` (first section), `evidence/memory-baseline-refresh-554/` (left: the baseline, right: the pinned source).

## ios-demo-mode-279 (autobyteus-279: the iOS app's demo for App Review; design base `fc68a7a4`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 3279
```

- The iOS app's first screen (design route, not the real app): <http://127.0.0.1:3279/ios>, at 440×956 (iPhone 17 Pro Max) or 820×1180 / 1180×820 (iPad Air 11-inch). It is the approved scan-first start screen with **Try demo** under **Scan**.
- **Try demo**, or **Scan** (the camera finds the demo QR code `autobyteus://demo` after 2.2 s: "Demo code found"), opens `/mobile` in the demo: the same phone screens on the sample world, everything on the demo (no other nodes), the showcase conversation without failure states, sample model names.
- Scripted in the demo: a message to an agent gets an answer (a `read_file` tool call, then text) on the agent's own stream (`prototype/ios-demo/iosDemo.ts` `demoReplyFrames`, played by `plugins/00`); Stop makes a working agent Idle (`plugins/95.ios-demo.client.ts`); New run, Settings Save, Text size and the VNC Viewer (view only) work as in the reference. Read only: Files, Artifacts, Messages, Activity.
- Leave: tap **Demo** (top left) › **Leave demo** → `/ios`. A new tab is a cold launch (first screen).
- Share to AutoByteus (D6): `/ios-share?text=<shared text>` is the iOS share extension's screen (`?text=` stands in for the other app). Done goes to `/ios`, which acts on the kept text as Android does: a pairing link (`…?pairing=…`) connects, `autobyteus://demo` opens the demo, other text opens Type an address pre-filled. The kept text is in `localStorage` `autobyteus.prototype.iosPendingShare`, used once.
- iPad landscape (1024 px and wider): the run list is a 380 px pane on the left and what it opens fills the right (`components/mobile/MobilePairedShell.vue`); sheets are centered 512 px cards from 768 px.
- Starting states: `localStorage.setItem('autobyteus.prototype.iosStart', 'ios_several')` (two saved nodes; the next scan finds a node, not the demo code); remove the key for the default first launch. Demo state is in `sessionStorage` (`autobyteus.prototype.iosDemo`, `autobyteus.prototype.inIosApp`, `autobyteus.prototype.iosDemoWelcomeClosed`).
- The demo QR code for the review notes: `tickets/done/ios-demo-mode-279/app-review/`.
- Spec: `tickets/done/ios-demo-mode-279/ui-ux-spec.md`; final references `visual-references/VIS-001…037`.

## phone-baseline-refresh-279 (the phone, `/mobile`; reflects `origin/personal@f7b4d68711`, release 1.5.13)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4279
```

Open <http://localhost:4279/mobile> at a phone width (412 CSS px). The world, the reset and the starting states are those of the section below; restart the dev server after editing files under `prototype/`. What this refresh added:

- **Text size**: the ⋮ at the right of the run list's header → Text size: Standard, Large, Largest. It applies at once to every phone screen and is kept on the phone (`autobyteus.phone.textSize`; remove it to return to Standard).
- **Background tasks (autobyteus-448)**: Project Task Manager's delegated **Agent Package Creator** shows "2 background tasks running"; the second **Software Engineering Team** row (folded) shows a member's task; **Daily Assistant** (the rich run) shows "Background task running" on its run screen and Settings, and on its row once it has been opened. Its Activity has a task stopped at its time limit.
- **Settings** (the run's ⋮, last entry): a held run (idle or running, e.g. Daily Assistant) shows the red stop icon and locked rows; the stop makes it Stopped. A stopped run (Show older → Codex) has Runtime, Model and Save; Save returns to the conversation. Starting state `mobile_settings_refused`: the first Save is refused in the node's words and Save stays off until another choice. A run on another node (Market Researcher on `docker`) shows only the sentence.
- **VNC Viewer** (starting state `mobile_node_desktop`): Control puts Keyboard and Clipboard at the end of the status row.
- Evidence: `ui-baseline-report.md` (first section), `evidence/phone-baseline-refresh-279/` (left: the baseline, right: the pinned source).

## phone-run-screen-baseline-refresh-506 (the phone, `/mobile`: run list, run screen and its views, New run, connection sheet; reflects `origin/personal@e4f4b3e176`, release 1.5.13-beta.7)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4506
```

Open <http://127.0.0.1:4506/mobile> at a phone width (412 CSS px; browser devtools device mode). The first visit installs an inert paired session (the page opens on the run list); reset it by removing `autobyteus.prototype.mobileSeeded`,
`autobyteus.remote_access.mobile_session` and `autobyteus.prototype.scenario` from local storage and reloading. Everything is invented (`prototype/source-observation/mobile-world.mjs`); times are offsets from the page load.

- Runs (default): Project Task Manager (2m) with its delegated work (a Team and an agent of this node, a Team and an agent on `docker`, a Team on `office-mac` that does not answer), **Daily Assistant (6m): the run whose conversation shows every message and segment type**, the Product Launch Org,
  older runs under "Show older (8)", Teams with members (older). Tap a row to open it; the chevron folds.
- The rich conversation (Daily Assistant, "Summarize the 1.6 release notes for the pilot customers"): user message with three attachments, think, text, tool-call cards (success, error), terminal, edit-file and write-file cards (one still running), a long markdown answer
  (headings, numbered and bulleted lists, inline code, `bash`/`json`/`ts` code blocks, a table, a quote), an image, an error segment, a second user message, an inter-agent message, a system task notification and a closing text.
- The ⋯ menu: Artifacts (three files of the rich run), Files (the folder tree `docs/evidence.md`, `requirements.md`; search "evi"), Messages (a member of a Team or the Org: open Show older → Software Engineering Team → unfold → a member), Activity (background tasks above the tool calls; the rich run and Project Task Manager have them), VNC Viewer (only in the scenarios below).
- Starting states (`localStorage.setItem('autobyteus.prototype.scenario', '<name>')`, then reload; no visible control): `mobile_runs_loading`, `mobile_runs_empty`, `mobile_runs_error` (Retry shows the list), `mobile_runs_node_offline` (the node does not answer: "Not reachable", the banner, Retry in the sheet),
  `mobile_phone_access_off` ("Phone access off"), `mobile_session_revoked` (the credential is refused: the pairing screen), `mobile_node_desktop` (VNC Viewer offered; View only shows an invented desktop), `mobile_node_desktop_busy` ("Too many viewers on this node right now", Retry).
  A notice above the list: `/mobile?unsupported=desktopSettings`.
- New run: the round + button; Agent, Folder, Runtime, Model sheets; Create run opens the draft; the first send gives it its permanent id (the route follows).
- The Android app (design route, not the real launcher): `/android`; a connected node opens `/mobile` "in the app", where the page's `window.AutoByteusShell` (`plugins/11.android-shell-bridge.client.ts`) answers the page, so the connection sheet offers **Switch node** (N nodes on this phone) and the node's own name shows. A plain browser tab has none.
- Browser pairing page: `/mobile?pairing=<link>` (unchanged by this refresh; the design's one-step pairing page).
- Comparison runs set `autobyteus.prototype.designOnlyLayers` to `off` on the baseline side where a surface has no source counterpart (the agent catalog of New run's Agent sheet and the Reconnect notice are design-only layers: the source's Agent sheet lists only the node's own agents).
- Evidence: `ui-baseline-report.md` (first section), `evidence/phone-run-screen-baseline-refresh-506/` (left: the baseline, right: the pinned source, both at 412 px).

## package-clone-auto-update-457 (personal settings of package and built-in definitions, the automatic-update switch for Agent packages and Skill sources, the required-tools row; these surfaces reflect `origin/personal@f78b60dddd`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4570
```

- Personal settings: `/agents?view=edit&id=agent-researcher` (a package agent, all four settings personal), `agent-writer` (package, none personal), `autobyteus-daily-assistant` (built-in); `/agent-teams?view=team-edit&id=team-product`;
  `/agent-orgs?view=org-edit&id=org-product-launch`. Each **Reset to the package's setting** / **Reset to the built-in setting** brings that setting's package value back and keeps your other unsaved edits; a reload restores the fixture.
  Detail pages carry no marks. An agent made by hand: `localStorage.setItem('autobyteus.prototype.scenario', 'personal_settings')`, reload, `/agents?view=edit&id=agent-release-notes` (no note, no marks).
  `personal_settings_reset_fails`: every Reset fails ("The setting could not be reset: The package files could not be read."). Data is invented in `prototype/source-observation/personal-settings-fixtures.mjs`.
- Automatic updates: `localStorage.setItem('autobyteus.prototype.context', 'electron_internal')` and `'autobyteus.prototype.scenario'` = `updates_waiting` (switches off; turning Agent packages or Skill sources on opens the confirmation) or `updates_auto_on` (every outcome row);
  open `/chat`, then the Settings row's "N updates" entry. The Update checks card: `/settings?section=server-settings`. Same scenarios as `update-checks-and-auto-updates`; Chinese: `localStorage['autobyteus.localization.preference-mode'] = 'zh-CN'`.
- Required tools: `/integrations`, open a card (scenario `integrations_tool_missing`: **Check again**).
- Comparison runs set `autobyteus.prototype.designOnlyLayers` to `off` on the baseline side. Evidence: `ui-baseline-report.md`, `evidence/package-clone-auto-update-457/`.

## phone-setup-remote-node-wording (autobyteus-426 item 16: Phone Setup wording for a node on another computer; design base `34677c88`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 3426
```

- Entry: `/nodes?nodeTab=phoneSetup` in the external window: `localStorage` `autobyteus.prototype.scenario` = `nodes_user`, `autobyteus.prototype.context` = `electron_external`, then `autobyteus.prototype.phonePairing` = `remote_unreachable` | `remote_lan` | `remote_tailscale` | `remote_vpn` | `remote_nothing`; reload. The node shows as "Office Mac" (illustrative). Compare with `vpn`, `tailscale`, `docker_unpublished` (today's text).
- Reset: remove `autobyteus.prototype.phonePairing` and `autobyteus.prototype.phoneWifiAllowedNetwork`, reload.
- Spec: `tickets/done/phone-setup-remote-node-wording/ui-ux-spec.md`.

## one-step-phone-pairing (autobyteus-395: Nodes › Phone Setup, the Android start screen, the node sheet, the browser pairing page; source pin `d74f75a`, design base `e0a52bcf`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 3210
```

- Desktop panel: `/nodes?nodeTab=phoneSetup` (window of the desktop's own node: `localStorage` `autobyteus.prototype.scenario` = `nodes_user` and `autobyteus.prototype.context` = `electron_internal`; a Docker node window: context `electron_external`).
- Android app start screen (design route, not the real launcher): `/android`. Tap **Scan** (the camera finds a code by itself), a node, a node's ⋮, or **Other ways to connect**. Tapping a connected node opens its page at `/mobile` inside the "app"; its top-bar node name opens the connection sheet with **Switch node** (only inside the app). A plain `/mobile` is a browser: no Switch node.
- Browser pairing page: `/mobile?pairing=<sample link>`; the desktop panel's QR encodes one (an inert sample code), so scanning it with a phone camera opens it. Without a link the page shows the "Connect this phone" instructions.
- Starting states: `localStorage.setItem('autobyteus.prototype.phonePairing', '<name>')`, reload; remove the key to reset (also remove `autobyteus.prototype.androidNodes`, `autobyteus.prototype.androidSeededFor`, `autobyteus.prototype.androidActiveNode`, `autobyteus.prototype.phoneWifiAllowedNetwork`, and `sessionStorage` `autobyteus.prototype.inAndroidApp`).
  - Desktop: `tailscale` (default), `tailscale_no_https`, `company_address`, `vpn`, `wifi_ask` (nothing installed, first time), `wifi_allowed`, `wifi_new_network` (asks again), `nothing`, `docker_unpublished` (use with the Docker window), `expired`, `no_phones`, `access_off`.
  - Android: `android_several` (default), `android_first_launch`, `android_unreachable`, `android_scan_cant_reach` (the next scan cannot reach its node). A node not reachable on the node sheet: `autobyteus.prototype.scenario` = `mobile_runs_node_offline` with the in-app flag.
- Everything is synthetic: node and phone names, the company address `autobyteus.example.com`, the sample QR link, the scripted timeline (list check 0.9 s, scan found 2.2 s, connecting 1.5 s, connected 1.0 s). The QR timer counts down in real time; **Check again** keeps a way "not found" (the reference only shows the states).
- Final screenshots: captured from the running reference with a disposable script (not kept in the repository); see the spec's inventory.
- Spec: `tickets/done/one-step-phone-pairing/ui-ux-spec.md`.

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

## integrations-page (Integrations page, import from a link or a folder; revision `integrations-page-r2`; source pin `d74f75a`, Settings surfaces `e4bebdc858`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4950
```

- Entry: `/integrations` (menu item Integrations, last, after Nodes). Default: nothing imported, the empty state. **Import** takes a GitHub repository link or a folder path (typed, or Browse… where the native picker exists); a web address is a repository, anything else a folder.
- Scripted outcomes (typed into the Import field): a link or path containing `empty` → "No integrations in this repository/folder"; `clash` → skill-name clash; a link containing `offline` → GitHub unreachable with the reason; a path containing `missing` → "Directory not found"; an already-imported link or path → "already imported"; a link containing `ops` → imports SSH and Jira (Jira "Needs a newer AutoByteus"); any other link → imports GitHub; any other folder → imports SSH; neither a GitHub link nor an absolute path → "Enter a GitHub repository link … or the full path of a folder." Importing a second source that holds an already-imported integration is a skill-name clash.
- Connect (dialog): a token containing `bad`, `reject` or `revoked` is rejected, `offline` cannot be checked, anything else connects as `@alex-dev`.
- Starting states (browser console, reload; remove the key to reset): `localStorage.setItem('autobyteus.prototype.scenario', '<name>')` with `integrations_connected`, `integrations_several` (two sources: GitHub; SSH and Jira from an ops repository), `integrations_local_folder` (GitHub from a repository, SSH from the folder `/Users/alex/Projects/my-integrations`), `integrations_tool_missing`, `integrations_token_revoked`, `integrations_update_available`, `integrations_update_offline` (Update cannot reach GitHub).
- After Import the skills are on `/skills` (an "Integration" label links to the card) and the sources in Skills → Sources; removing a source there removes its card. Server Settings → Basics has no GitHub card.
- Data is invented in `prototype/integrations/integrationsDesignFixture.ts`; state is in `stores/integrationsStore.ts`; in memory, a reload resets it. Spec: `tickets/done/integrations-page-r2/ui-ux-spec.md`; the first approved design: `tickets/done/integrations-page/ui-ux-spec.md`.

## manage-nodes-professional (Nodes → Manage Nodes, a professional look; autobyteus-363; design `tickets/done/manage-nodes-professional/ui-ux-spec.md`, source pin `3b9dc912a1`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4950
```

- Entry: `/nodes?nodeTab=manage` (the product's normal entry; no review control). Set a starting state in the browser console and reload (remove a key to reset; a reload resets all in-memory state):
  - desktop window on the embedded node: `localStorage.setItem('autobyteus.prototype.scenario','nodes_user'); localStorage.setItem('autobyteus.prototype.context','electron_internal')`
  - one row in every state: scenario `nodes_states`
  - a window opened on Docker 8001: context `electron_external`
  - a browser (no Open; a node known only as a registration leaves the list when turned off, as in the product): remove the `autobyteus.prototype.context` key
  - Chinese: `localStorage['autobyteus.localization.preference-mode']='zh-CN'`
  - update states (Docker 8001): `nodes_update_refused`, `nodes_update_failed`, `nodes_update_lost`, `nodes_update_undelivered`, `nodes_update_running`, `nodes_update_error`, `nodes_update_unknown`; the empty offer: `nodes_empty_offer`.
- Try: Update to 0.1.0-prototype on docker (about 20 s); add `http://localhost:8003` and `localhost:8005` (partial); click the offer button; this node's switch; rename; resize the window or use a 390 px viewport (the row reflows by the width of the Nodes card).
- Nothing is contacted; the nodes answer from `prototype/nodes/network-world.mjs`.

## WEB-BASELINE-REFRESH-015 (scoped refresh: Nodes → Manage Nodes, the server version and in-place update of remote nodes; this surface reflects `3b9dc912a1`, the rest `d74f75a`/`e4bebdc858`)

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4960
```

- Entry: `/nodes?nodeTab=manage`. Select the starting state in the browser console and reload (remove the keys to reset; a reload resets all in-memory state):
  `localStorage.setItem('autobyteus.prototype.scenario','<scenario>'); localStorage.setItem('autobyteus.prototype.context','electron_internal')`
  (`electron_external` = a window opened on Docker 8001, which lists no server lines; remove the context key = a browser, which shows the versions but offers no update). Chinese: `localStorage['autobyteus.localization.preference-mode']='zh-CN'`.
- Starting states (scenarios): `nodes_user` (Docker 8001 older than the app: **Update to 0.1.0-prototype**; click it to watch a whole update, about 20 s); `nodes_states` (one row in each state: offer, version only, no update endpoint
  "Not reachable.", a blocker notice, a node newer than the app); `nodes_update_refused` (the click is refused; Copy command), `nodes_update_failed`, `nodes_update_lost` (Restarting…, then after 5 minutes "Not reachable. Last known: …"),
  `nodes_update_undelivered` (HTTP 500), `nodes_update_running` (an update from another window is running at page open), `nodes_update_error`, `nodes_update_unknown` ("Server version unknown").
- The nodes' update answers are scripted in `prototype/nodes/network-world.mjs` (`serverOf`, `nodeUpdate`); the page's own store (`stores/nodeServerUpdateStore.ts`, copied) asks them through the existing simulated network. The embedded node's row never shows a server line.
- Not in this refresh: the Docker Guide tab's new "Update the server in all Docker nodes" command and the NFS Guide's shorter texts (they still show `d74f75a`).

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

> Superseded for the Memory page by `memory-baseline-refresh-554` above: the page is now the source's (`8430d9ef12`); the stores below are the source's own, answered by `memoryOperation`.

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

## mobile-experience-redesign (autobyteus-277)

The phone (`/mobile`): the run list with its delegation tree, the run screen, New run, the connection sheet. Spec: `tickets/done/mobile-experience-redesign/ui-ux-spec.md`.

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm exec nuxt dev --host 0.0.0.0 --port 3277
```

Open <http://127.0.0.1:3277/mobile> (a phone on Tailscale: `http://<this machine's tailnet IP>:3277/mobile`). The first visit in a browser installs an inert paired session, so the page opens on the run list; the cold first compile after a cache wipe can take about 20 seconds (a blank page: wait and reload).

Starting states (local storage, then reload; no visible control):

- `autobyteus.prototype.scenario` = `mobile_runs_loading` | `mobile_runs_empty` | `mobile_runs_error` | `mobile_runs_node_offline` (default: the populated list, with `docker` reachable and `office-mac` not).
- Reset: remove `autobyteus.prototype.mobileSeeded`, `autobyteus.remote_access.mobile_session.v1`, `autobyteus.prototype.context` and the scenario key, then reload. "Unpair this phone" shows the pairing screen.

Design-only layers (turned off with `autobyteus.prototype.designOnlyLayers=off`): `prototype/mobile-runs/mobileRunsFixture.ts` (runs, delegation tree, an opened run's conversation, messages, activity, file texts, peers), `stores/mobileRunTreeStore.ts`. Simulated under the interface: the node's run history and tree, the stream (the activity is seeded when a run opens), the team context behind Messages, the workspace search (Files searches the loaded tree), the peers.
