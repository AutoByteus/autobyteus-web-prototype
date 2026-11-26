# UI/UX Specification: AutoByteus Extensions (Voice Input, Private Network) and Manage Nodes (autobyteus-516)

The final screenshots in `visual-references/` are normative. Every visible detail is requirements-defining unless this specification names it as illustrative (see Final Visual Reference Inventory and Implementation Fidelity Boundary).

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: Product ticket `extensions-ui-516` for autobyteus-516 "AutoByteus Extensions" (Solution Designer run `solution_designer_b2b085ced16d45479c46350d19ae49a2`)
- Related requirements revision ID: SR-005 (requirements-doc.md, extension-contract.md, pairing-contract.md, private-network-types.md and use-case-spines.md as of 2026-11-26)
- Related requirement, behavior, acceptance-criteria, and decision IDs: REQ-001…REQ-011, BEH-001…BEH-009, AC-001…AC-012, use-case spines V1–V13 and T1–T9 (T10 removed), design changes DC-001…DC-090, decision DEC-015
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Review URL (during review): `http://127.0.0.1:4516/settings?section=extensions`, `/nodes?nodeTab=manage`, `/nodes?nodeTab=dockerGuide` (shared over Tailscale Serve `https://normys-macbook-pro.tail0347f8.ts.net:8445/`)
- Explicit user-confirmation reference:
  - The founder, in this conversation on 2026-11-26: "ask the solution designer to validate based on its business flow, data flow … if no problem, then we're good".
  - The Solution Designer's final validation, 2026-11-26 (@ 374aa79c): every spine matches; one text fix applied as DC-081.
  - The founder's approval relayed by the Solution Designer, 2026-11-26: "if everything, based on your self-verification for each use case, will work, then let's go … let's say I approve the design".
  - DEC-015, 2026-11-26: the founder delegated the open items to the Solution Designer ("based on your reasoning, what is the most reasonable solution"). Applied as DC-083…DC-090 and confirmed by the Solution Designer (@ da118b6b): every spine V1–V13, T1–T9 matches the contracts and the founder's decisions.
- Final check date: 2026-11-26. All journeys were clicked through on the merged ticket branch, and the final screenshots were captured.

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web` (Nuxt desktop/web app): Settings → Extensions, the voice surfaces, Nodes → Manage Nodes, and Nodes → Docker Guide
- Pinned source commit or revision: `origin/personal@b768c503f9` (read only)
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- UI reference revision or commit: ticket branch `design/extensions-ui-516`. The revision integrated into `personal` is recorded in `product-ticket.md`.
- Ticket folder: `tickets/done/extensions-ui-516/` (after closure)
- Baseline report path: `ui-baseline-report.md` (design repository root; accepted baseline refresh `extensions-nodes-baseline-refresh-516`, base `9bec8f39`)

## Problem And Design Rationale

- **User problem and intent:**
  - Voice Input becomes the first extension of a common extension foundation. Every extension has the same card, its own sandboxed page, and AutoByteus's own controls.
  - A second extension, Private Network, connects the user's AutoByteus nodes without typing addresses.
  - Manage Nodes shows clearly which nodes this AutoByteus controls, which nodes this node works with (pairing), and which nodes the network found.
- **Key UX decisions and why:**
  - **One common extension card.** It carries the state pill, switch, Install / Update / Install again, View log, Remove and Show settings. The extension's own page opens in place inside its card, so state, log and Remove stay in view.
  - **AutoByteus keeps what belongs to the app.** The microphone choice and the Test are drawn by AutoByteus under Voice Input's page. The private-network switch belongs to This node, because pairing policy is AutoByteus's, not the extension's.
  - **Control and pairing are two separate things** (founder, 2026-11-25/26):
    - Control is the owner credential, obtained with an access code.
    - Pairing means agents on both nodes work together.
    - Manage Nodes shows each node in exactly one section: This node, Asking to pair, Controlled nodes, Paired nodes, Found on your private network.
  - **One control per action** (founder):
    - no Remote collaboration switch, no Trust switch, no disconnect icon;
    - Pair / Unpair are the only collaboration controls;
    - Remove gives up control;
    - a node this AutoByteus controls pairs in one click;
    - another person's node pairs only through their Accept.
  - **Access code from the node's own command** (founder: "I would rather run the setup code"). `autobyteus-docker access-code <node>` prints it, and it is pasted in the single Add node form or on a "Needs connecting" row. There is no browser first-run page.
  - **DEC-015** (founder delegated the open items): install ends On; translations; folder Copy; one click for own nodes; no "Pair with it"; "Create access code" only where another computer can reach the address; "Controlled by … Revoke" on This node; Voice Input warms its model in the background.
- **Alternatives considered and rejected** (review-round-1.md):
  - A side panel or a route per extension page: hides the list and adds a second pattern.
  - A "Voice" Settings section: splits voice in two places.
  - Found nodes mixed into the Nodes list: finding would look like trust.
  - A first-run page on the new node: replaced by the command.
  - A separate "paste an access code" mode: merged into one form.
  - A trust switch: removed; Accept is mandatory for nodes not controlled.

## Scope And Experience Goal

- **User or actor:** the owner of an AutoByteus desktop app and its nodes. Teammates (other accounts) appear as other nodes.
- **Context:** the desktop app's own window (embedded node), a desktop window bound to a Docker/remote node, a window without owner access, and a browser window.
- **Goal:** install and manage extensions per node; dictate with Voice Input from any window; connect nodes over a private network; control nodes with an access code; pair nodes so their agents work together.
- **Observable success:** each journey below reaches its completion state with the feedback shown in its references.
- **In-scope surfaces and journeys:**
  - Settings → Extensions: list, cards, the extension pages, the microphone panel, the log and Remove dialogs, and the catalog notes;
  - the voice status on voice surfaces (the Memory search shown as representative);
  - Nodes → Manage Nodes: This node, Asking to pair, Controlled nodes with Add a node, Paired nodes, Found on your private network, the Remove dialog;
  - Nodes → Docker Guide: the access-code command and the connect steps.
- **Non-goals:**
  - the Settings page's own narrow-width navigation (split into Product ticket `settings-narrow-navigation`, follow-up FU-002);
  - the Shared Folder extension (designed later);
  - production network, pairing, signing and runtime mechanisms.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-001, REQ-002, AC-001 | Settings → Extensions lists signed catalog extensions per node, with name, description, version and state | UXJ-001; UIS-001; VIS-V1-01 |
| REQ-003, AC-002, DEC-015 | Install shows its phases. A Voice Input install shows "Downloading…" then "Preparing the speech model (downloads about 2 GB once…)" with a moving bar and no percent; Private Network shows a percent. The install ends **On**: Voice Input "Installed and on. Getting ready…"; Private Network continues into Choose a network. On/Off switch; Remove + Install replaces Reinstall; Voice Input's page shows its folder with Copy | UXJ-002, UXJ-003, UXJ-010; VIS-V2-*, V4-*, V10-*, T1-02, T1-03 |
| REQ-003, AC-003 | Update when the catalog is newer; settings kept; "1.1.0 needs a newer AutoByteus" when the catalog's newer version needs a newer app | UXJ-005; VIS-V9-*, V13-05 |
| REQ-003, REQ-011, AC-004, AC-010 | A Docker node's window lists that node's extensions; Voice Input is not offered there (it belongs to this computer), with the note | UXJ-001; VIS-V1-02, T1-18 |
| REQ-004, AC-005 | Message, last error and View log from the card | UXJ-006; VIS-V11-01, V12-*, V13-02 |
| REQ-005, AC-006 | A window without owner access shows only "This AutoByteus does not control {node} yet." with a link; a browser window shows a note and no list | UXJ-001; VIS-V1-03, V1-04 |
| REQ-006, AC-007 | Dictation states on every voice surface; a slow note after about 2 s on the first transcription | UXJ-004; VIS-V5-* |
| REQ-007, AC-008 | An existing install is adopted (runtime, speech model, language and folder shown on its page) | UXJ-003; VIS-V3-01, V7-01 |
| REQ-008, AC-009 | Dictation in a Docker node's window uses this computer's Voice Input | UXJ-004; VIS-V6-01 |
| REQ-009, AC-011 | A broken or unreadable extension affects only its card | UXJ-006; VIS-V12-01, V12-02 |
| REQ-012 | When Voice Input is on, its model warms in the background after AutoByteus starts and after turning it on; the card shows "Getting ready…"; dictation is never blocked | UXJ-003; VIS-V2-04, V2-06, V4-02 |
| DEC-015 (contract §1, §5) | Translated name/description on the card; the app's language sent to the extension page on load | UXJ-001; VIS-L-01…L-05 |
| Private Network stage (pairing-contract §0–§9, private-network-types, spines T1–T9) | Join (Tailscale, Headscale, host, own VPN), visibility, pairing, access code, control, unpair, remove, leave | UXJ-010…UXJ-018 |

## Visual Language

- **Existing product language to preserve:** the Settings shell and section list; the Nodes tab bar; white cards (`rounded-2xl`, `border-slate-200`, `shadow-sm`) on `bg-slate-50`; slate text scale; blue primary buttons (`bg-blue-600`); outline secondary buttons (`border-slate-300`); emerald for On, Paired and success; amber for warnings; red for destructive actions and errors.
- **Layout structure and visual hierarchy:**
  - **Extensions:** an eyebrow "EXTENSIONS", the title "Optional capabilities", a lead line, and the node line ("Extensions of {node} · {address}"). Then one card per extension, followed by notes.
  - **Card:** the name row (name, version, state pill, "x available" badge) shares its first line with the action (Install, or the switch). The description and the message span the card below. The footer holds Show/Hide settings, View log and Remove. The extension page opens in place below the footer, followed by AutoByteus's own panel.
  - **Manage Nodes:** sections top to bottom (UIS-004…UIS-008), each a card with a 16 px semibold title and a slate-500 lead.
- **Grid, dimensions, spacing and density:**
  - Cards use `px-5` with `pt-5 pb-4` headers. Rows are `py-3.5`, and lists are separated by `divide-slate-100`.
  - Node rows use container queries on the card. Wide (≥ 64 rem): name | server 16 rem | offers | Pair column 6 rem | actions. Medium (≥ 38 rem): name | Pair | actions. Narrow: name | actions, with the paired line, server, offers and Pair stacked under the name.
  - The Add node form is a grid of five columns from `xl`, two columns from `md`, and stacked on phones.
- **Typography:** the product's system font stack; titles `text-base font-semibold`; body `text-sm`; captions `text-xs`; addresses and codes `font-mono`.
- **Color values and semantic roles:**
  - Paired mark: `bg-emerald-50 text-emerald-700`.
  - "Private network" tag: `bg-slate-100 text-slate-600`.
  - Asking to pair: a card with `border-blue-200`, rows `bg-blue-50/40`.
  - Unknown machine warning: `border-amber-200 bg-amber-50 text-amber-900`.
  - Needs connecting: an amber notice.
  - Remove dialog: red title and red confirm button.
  - "Design reference only" controls: dashed slate border; these are not product UI.
- **Surfaces, borders, radii, shadows and layering:** cards `rounded-2xl`; inner panels `rounded-xl` / `rounded-lg`; dialogs `rounded-lg shadow-xl` over `bg-black/50`.
- **Controls, icons and imagery:**
  - The pairing icon (`RemoteCollaborationIcon`) appears on the Pair button and the Paired mark.
  - The node row has Open (external link) and Remove (trash) icons. The crossed-link icon is removed.
  - Switches: 44×24, emerald when On.
  - Access codes and invite codes show a QR code, the code text, Copy, the expiry and a password warning.
- **Hover, active, focus, selected, disabled, validation and feedback:**
  - Focus: `ring-2 ring-blue-500` (red ring on destructive controls).
  - Disabled: `opacity-50/60`, with a reason in the tooltip (Pair on an unreachable node).
  - Field errors: red border and a red message with `role="alert"`.
  - In-progress states: a spinner with a status line ("Pairing…", "Unpairing…", "Reaching the node at …", "Creating a code…").

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Extensions page | List extensions of the window's node | own window; Docker window (no Voice Input + note); no owner access; browser; catalog unverified/offline notes | `components/settings/ExtensionsManager.vue` |
| Extension card | Common frame for every extension | notAvailableHere (platform, contract); notInstalled; installing (phases, percent or moving bar); installed Off / Not ready / On / On + Getting ready (spinner); update available / updating / needs newer app; failed (Install again); removing; translated name and description | `components/settings/extensions/ExtensionCard.vue` |
| Extension page frame | The extension's own page, sandboxed, sized by `{ resize: { height } }`; receives `{ locale }` once on the frame's load event | loading; page; page in the app's language | `components/settings/extensions/ExtensionPageFrame.vue`, pages in `prototype/extensions/extensionPages.ts` |
| Log and Remove dialogs | Read the log; confirm removal | per extension text | `components/settings/extensions/ExtensionDialogs.vue` |
| Microphone on this computer | AutoByteus's microphone choice and Test | idle; recording; transcribing with slow note; result | `components/settings/extensions/VoiceMicrophonePanel.vue` |
| Visibility offer | Offered once on joining: "Make this node visible on your private network?" | offer; dismissed | `components/settings/extensions/PrivateNetworkFindingPanel.vue` |
| This node | Name, type, address; private network line with "Visible on my private network"; Controlled by; Create access code | network joined / not set up / off / not ready / own VPN only; Create access code only in owner windows and only when another computer can reach the node's address | `components/settings/nodes/ThisNodeCard.vue`, `PrivateNetworkCard.vue` (part `thisNode`), `NodeCodePanel.vue` |
| Controlled by | The AutoByteus apps holding this node's owner credential | list (desktopName · since · last used / never used; This AutoByteus marked); Revoke → inline confirmation → Revoking… → gone | `components/settings/nodes/ThisNodeControllers.vue` |
| Asking to pair | Requests from nodes not controlled | request; accepting | `PrivateNetworkCard.vue` (part `requests`) |
| Controlled nodes | Nodes this AutoByteus controls, with Add a node above the list | rows: not paired (Pair), pairing, paired (Paired · [Private network] · Unpair), needs connecting, unreachable, checking; empty | `components/settings/nodes/NodeList.vue`, `NodeRow.vue`, `AddNodePanel.vue`, `NodeAccessNotice.vue` |
| Paired nodes | Paired nodes this AutoByteus does not control | teammate row (no Open), unpair confirmation; empty | `NodeList.vue`, `NodeRow.vue` |
| Found on your private network | Nodes in neither list | someone else's node: Pair → waiting / Cancel / declined → Pair again; machine your account added: Control → inline access code → connecting; unknown warning; empty | `PrivateNetworkCard.vue` (part `found`) |
| Docker Guide access code | Command card and connect steps | with a "Design reference only" printed-output box (not product UI) | `components/settings/DockerNodeStartGuideCard.vue`, `utils/dockerNodeLauncherCommands.ts` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Owner, any window | Settings → Extensions | See which extensions this window's node has | List or the right note | V1, AC-001, AC-004, AC-006, AC-010 |
| UXJ-002 | Owner, own window | Voice Input not installed | Install Voice Input | Installed and on, getting ready, then ready | V2, AC-002, REQ-012 |
| UXJ-003 | Owner | Voice Input installed | Turn on/off (warm-up), choose language, check what is installed (copy the folder), choose microphone, Test | On, settings saved, test result | V3, V4, V7, V8, AC-007, AC-008, REQ-012 |
| UXJ-004 | User dictating | Voice Input On | Dictate in any window | Transcript in the field | V5, V6, AC-007, AC-009 |
| UXJ-005 | Owner | Update available | Update | Updated, still On | V9, V13-05, AC-003 |
| UXJ-006 | Owner | Failure / broken / catalog problems | Understand and recover | Message, log, Install again | V11, V12, V13, AC-005, AC-011 |
| UXJ-007 | Owner | Installed | Remove an extension | Not installed | V10 |
| UXJ-010 | Owner, a node's window | Private Network not installed | Install and join (Tailscale sign-in or auth key; Headscale key or invite; host; own VPN) | Joined: This machine, My machines | T1 |
| UXJ-011 | Owner | Node restarted | Rejoin | Joined again | T2 |
| UXJ-012 | Owner | Joined | Make this node visible / hidden | Switch On/Off | T3 |
| UXJ-013 | Owner | Joined | See nodes in sections | Each node in one section | T4 |
| UXJ-014 | Owner | Controlled node not paired; found machine of the owner's account | Pair own node (one click); Control a found machine with its access code | Paired; moved to Controlled nodes | T5 |
| UXJ-015 | Owner and teammate | Request from carol; bob found | Accept / Reject; Pair → their Accept | In Paired nodes | T6 |
| UXJ-016 | Owner | Paired | See what a paired node shares | Offer list open | T7 |
| UXJ-017 | Owner | New Docker node | Run access-code, add the node with its code, pair it from its row, recover on a Needs-connecting row, create a code on This node where it can work | Controlled, then paired | T8 |
| UXJ-019 | Owner | Node controlled by several apps | See who controls this node; revoke another app | That app removed from Controlled by | T8, DEC-015 |
| UXJ-020 | User of the Chinese app | Settings → Language 中文 | Read extensions in Chinese | Card names/descriptions and the extension pages in Chinese | DEC-015 |
| UXJ-018 | Owner | Paired / controlled / joined | Unpair, Remove (gives up control), Leave the network | Unpaired / removed / left | T9 |

## Journey Details

The ordered steps, feedback and visual references for each journey are in `round-5-coverage.md` (V1–V13, unchanged since round 5) and in the final references `VIS-<spine>-<step>`. Steps that changed after round 5 are below.

- **UXJ-010 (T1):** the node's own window → Settings → Extensions → Private Network → Install (percent) → switch On ("Starting the network program…") → Not ready "Not connected to a private network yet. Choose one below." → choose one of:
  - **Tailscale account:** "Sign in with Tailscale", or "Use an auth key instead";
  - **My own Headscale server:** server address and key, or "I have an invite code", which shows "Joins as …" before joining;
  - **Host a private network on this machine:** domain and port, steps, reachability check.
  
  The install ends On: "Starting the network program…", then the page opens at Join a private network. Once joined, the page shows This machine and My machines, and AutoByteus offers "Make this node visible on your private network?" (Make it visible / Not now).
  - **Your own VPN:** private ranges only. Public ranges are refused and a range larger than /16 is warned.
  - **Problem states:** "Waiting for approval…", "Signed out of Tailscale… Sign in again", "server cannot be reached".
  - **Hosting:** shows Hosting facts and "Invite someone": first "For one of my machines" or "For a teammate" (the teammate's own name), then an invite code with QR.
  - VIS-T1-01…T1-18.
- **UXJ-013 (T4): Manage Nodes, top to bottom:**
  - This node;
  - Asking to pair (only with requests);
  - Controlled nodes (Add a node above the list);
  - Paired nodes;
  - Found on your private network (only when Private Network is On and joined).
  
  Without a private network, This node shows "Private network: Find your other AutoByteus nodes and pair with other people's nodes without typing addresses…" with **Set up Private Network**, and there are no Asking or Found sections (VIS-T4-02).
- **UXJ-014 (T5):**
  - **Controlled node, not paired:** the row's **Pair** (one click, no Accept, no dialog) → "Pairing…" → "Paired · Private network · Unpair" with "Agents on both nodes can work together."
  - **Found machine of the owner's account:** **Control** → an inline Access code field → Add → "Reaching the node at …" → "Connecting to … as its owner…" → it moves to Controlled nodes, where Pair is one click.
  - The warning reads "You did not add this node to AutoByteus. Check that the machine is really yours before you paste its access code."
  - VIS-T5-01…T5-06.
- **UXJ-015 (T6):**
  - **Asking to pair:** "carol-server, added by carol, wants to pair" → **Accept** ("Pairing…") or **Reject**. An accepted node appears in Paired nodes as "Teammate · carol's node · peer only".
  - **Found, someone else's node:** **Pair** → "Waiting for bob to accept" with Cancel → accepted → Paired nodes. A refusal shows "bob declined" with **Pair again** (specified, not captured).
  - VIS-T6-01…T6-04.
- **UXJ-017 (T8):**
  1. On the node's computer, `autobyteus-docker new-container` prints an access code at the end, or `autobyteus-docker access-code <node-name>` (or `node dist/node-access-cli.js access-code --data-dir <dir>`) prints a new one.
  2. In Manage Nodes → Add a node, paste it in **Access code**. It fills in the address and confirms "Access code for the node at {address}: this AutoByteus will control it." Name is optional.
  3. Add node → "Reaching the node at …" → "Connecting to {name} as its owner…" → listed under Controlled nodes with **Pair** on its row (the only pairing control). Pair → "Pairing…" → Paired.
  
  - **Without a code:** add by address. The row shows "Needs connecting. This AutoByteus does not control {name} yet. Run the access-code command on {name}'s computer: … Or create one in an AutoByteus that controls it: This node → Create access code. Then paste it here." It has a field and Connect, and no Pair until controlled.
  - **For a node this AutoByteus already controls:** This node → **Create access code** (QR, code, Copy, "Expires in 30:00 · works once", password warning) to give another AutoByteus control. Shown only when another computer can reach the address the code carries (the node's private-network address, or a local-network address it is published on). Hidden for a node on 127.0.0.1/localhost only: the Embedded node without a private network, or a Docker node published on 127.0.0.1.
  - **Controlled by** (owner windows): "{desktopName} · since {date} · last used {date}" or "never used", "This AutoByteus" marked, **Revoke** on every other entry → "{name} loses control of this node; it can control it again only with a new access code." → "Revoking…" → removed. A node no other computer can reach shows only This AutoByteus.
  - **Docker Guide:** the "Create access code" command card and "Connect the new node to AutoByteus" steps 1–3.
  - VIS-T8-01…T8-18.
- **UXJ-018 (T9):**
  - **Unpair (every paired row):** an inline confirmation below the row. Controlled: "Unpair {name}? Agents here stop working with it. It stays in your Nodes list, and you can pair it again." Teammate: "Unpair {name}? It leaves your list; {account}'s node has to ask to pair again."
  - **After unpairing:** a teammate returns to Found.
  - **Remove (trash):** "Remove {name} from this AutoByteus?" — "This AutoByteus gives up control of it (its access is revoked on the node). To control it again, paste a new access code." A paired node adds "It is unpaired first." The dialog ends with "The node and its data are not touched."
  - **Leave the network** from the Private Network page, with a confirmation.
  - VIS-T9-01…T9-07.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Extensions | `/settings?section=extensions` | Manage this node's extensions; Install / switch | header, node line, cards, notes | VIS-V1-01, V1-02…05, N-01 |
| UIS-002 | Extension card with page | Show settings on a card | The extension's own page; AutoByteus panel under it | card, footer, frame, panel | VIS-V3-01, V8-01, T1-05, N-02 |
| UIS-003 | Voice status on voice surfaces | Microphone button on a voice surface | Dictate | field, mic button, status line | VIS-V5-01…05, V6-01 |
| UIS-004 | This node | `/nodes?nodeTab=manage` | Identity, visibility, Create access code | name/type/address; Private network line + switch; disclosure | VIS-T3-01, T3-02, T8-11, T2-03 |
| UIS-005 | Asking to pair | same | Accept / Reject requests | blue-bordered card with rows | VIS-T6-01, T6-02 |
| UIS-006 | Controlled nodes | same | Add a node; open, remove, pair, unpair | header, Add a node form, rows | VIS-T5-01…03, T8-03…10, N-05 |
| UIS-007 | Paired nodes | same | See and unpair teammates' nodes | header, rows or empty | VIS-T6-04, T9-03 |
| UIS-008 | Found on your private network | same | Control own machines; pair with others' nodes | header with Look again, rows | VIS-T4-01, T5-04, T6-03, N-06 |
| UIS-009 | Remove node dialog | trash on a row | Give up control | red dialog | VIS-T9-05 |
| UIS-010 | Docker Guide access code | `/nodes?nodeTab=dockerGuide` | Command and connect steps | command card, connect box | VIS-T8-01, T8-02 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Card / Not installed | Install | Installing pill; phase text; percent or moving bar | Installed and On. Voice Input: "Installed and on. Getting ready: the speech model is loading (about 30 seconds)." Private Network: "Starting the network program…", then its page at Join a private network | extension manager install, then enable/start | switch, Remove, View log |
| TR-002 | Card / Off | Switch on | Voice Input: On with "Getting ready…" (spinner) until its model is loaded. Private Network: Not ready "Starting the network program…" | On / Not ready | enable; `start` warms the model | switch off, Show settings |
| TR-003 | Card / update available | Update to x.y.z | Updating | Updated, settings kept | update | — |
| TR-004 | Card / any | Remove → confirm | Removing | Not installed | remove | Install |
| TR-005 | Voice surface / idle | Mic click; mic click | Recording; Transcribing (slow note after about 2 s) | Transcript inserted | this computer's Voice Input | dictate again |
| TR-010 | This node / joined | "Visible on my private network" switch | On/Off label | visible / hidden | `/autobyteus/info` answered or not | — |
| TR-011 | Controlled row / not paired | Pair | "Pairing…" in the Pair column | Paired · [Private network] · Unpair + line | grant + `/pair` (own node), or both sides by address | Unpair |
| TR-012 | Found / own-account machine | Control → paste code → Add | "Reaching the node at …", "Connecting to … as its owner…" | row moves to Controlled nodes | setup exchange → owner credential | Pair |
| TR-013 | Found / someone else's node | Pair | "Waiting for {account} to accept" + Cancel | accepted → Paired nodes; declined → "{account} declined" + Pair again | `/pair` → `/pair-accepted` or `/pair-rejected` | Cancel |
| TR-014 | Asking to pair | Accept / Reject | "Pairing…" / row gone | Paired nodes row / none | peer record stored; `/pair-accepted` / `/pair-rejected` | Unpair |
| TR-015 | Add a node | Paste code | address filled + "Access code for the node at …" | ready to add | — | Add node |
| TR-016 | Add a node | Add node (code) | steps line | Controlled, with Pair on its row | setup exchange | Pair |
| TR-017 | Add a node | Add node (address only) | "Checking…" | row "Needs connecting" | entry only | paste a code on the row |
| TR-018 | Needs connecting row | paste code → Connect | Connecting… | controlled | setup exchange | Pair |
| TR-019 | Paired row | Unpair → Unpair | "Unpairing…" | controlled: stays, Pair; teammate: back in Found | signed `/unpaired`, or both sides by address | Pair |
| TR-020 | Controlled row | trash → Remove | dialog steps only on failure | removed from the list | access revoked; unpaired first | Add again with a new code |
| TR-021 | This node (address reachable by others) | Create access code | "Creating a code…" | code with QR, expiry, Copy, Done; expired → Create a new code | setup code made | — |
| TR-022 | Controlled by | Revoke → Revoke | "Revoking…" | entry removed | `DELETE /rest/node-access/owner-credentials/:id` | — |
| TR-023 | Extension page | the frame's load event | — | page shows its texts in the app's language | `{ locale }` to the page, once | — |
| TR-024 | Voice Input card | AutoByteus starts / turned on | "Getting ready: the speech model is loading (about 30 seconds)." with spinner | message gone (Ready) | the extension's `start` warms the model | dictate (never blocked) |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Extensions / browser window | not the desktop app | "Extensions are managed in the AutoByteus desktop app, by the owner of the node." | — | open the desktop app | VIS-V1-04 |
| Extensions / no owner access | window without the owner credential | "This AutoByteus does not control {node} yet." + "Connect this node in Nodes to manage its extensions." | link | connect in Nodes | VIS-V1-03 |
| Extensions / catalog unverified | signature mismatch | red note "AutoByteus could not verify the list of extensions…" | Install/Update disabled | later | VIS-V13-01 |
| Extensions / catalog offline | unreachable | grey note "Could not reach the list of extensions…" | Install/Update disabled | later | VIS-V13-03 |
| Card / not available | platform or contract | "Not available on this computer" / "Not available" + text | — | update AutoByteus | VIS-V1-05, V13-04 |
| Card / failed | install or use failure | Failed pill, message, last error | Install again, View log, Remove | retry | VIS-V13-02, V12-01 |
| Card / unreadable state | record unreadable | every extension Off, message | switch on | — | VIS-V12-02 |
| Controlled / empty | no entries | "No nodes yet. Add one above with its access code." | Add a node | — | — |
| Controlled row / checking | tab opened | "Checking {name}… up to 20 seconds." + spinner dot | — | — | VIS-T2-03 |
| Controlled row / not reachable | probe failed | "Not reachable." + cause + Check again; Pair disabled with its reason | Check again | — | VIS-T8-09 |
| Controlled row / needs connecting | no credential | amber notice, field, Connect; no Pair | Connect | paste a code | VIS-T8-09, T8-10 |
| Paired / empty | none | "No paired nodes of other people. Pair with one found on your private network, or accept a request." | — | — | VIS-T4-01 |
| Found / empty | none visible | "No other AutoByteus nodes found. A node appears here when its owner makes it visible on your private network." | Look again | — | — |
| This node / network not ready | waiting, signed out, server down, rejoining | the network's message in amber + Open Private Network | open | — | VIS-T2-03 |
| This node / own VPN only | ranges, not joined | "Your own VPN (…) cannot find nodes or tell who is calling. Add nodes below with their access code." | — | — | — |

## Content, Labels, Validation, And Feedback

- **Product voice:** short, plain sentences in the user's terms (node, pair, control, access code). No "desktop" in access-code texts. No "setup code" (access code only). "Pair" / "Accept" / "Reject" / "Unpair" / "Remove" / "Revoke". "Controlled nodes", "Paired nodes", "Visible on my private network", "Create access code", "Controlled by".
- **Exact labels, headings, action text and messages:** the authority for every AutoByteus-owned string is the UI reference's catalogs:
  - `localization/messages/en/extensionsDesign.ts` and `localization/messages/zh-CN/extensionsDesign.ts`;
  - the changed keys in `localization/messages/{en,zh-CN}/nodesPage.ts` (Pair/Unpair dialog and lines, Remove dialog, access errors);
  - `localization/messages/{en,zh-CN}/settings.ts` (Docker Guide command cards);
  - the state messages in `stores/extensionsStore.ts`.
  
  The quotes in this specification are taken from them.
- **The extensions' own texts** belong to each extension. The catalog entry may carry `translations` (zh-CN: 语音输入 / 私有网络 with translated descriptions), which the card shows in the app's language. Each page (`prototype/extensions/extensionPages.ts`) gets `{ locale }` once on load and shows its own texts from its own table. The extension's status messages and errors stay as the extension gives them (English): status is per node, not per window (an optional `ctx.locale` may come later).
- **Empty, error and recovery messages:** see State Behavior and Form And Input Validation.

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| Add a node · Access code | text, mono | no | starts with `abps_` and decodes | on input | "This is not an access code. Copy the whole code from the node, starting with abps_." |
| Add a node · Access code | — | — | not expired | Add node | "This access code expired before it was used. Create a new one on the node." |
| Add a node · Access code | — | — | not used | Add node | "This access code was already used. Create a new one on the node." |
| Add a node · Address with a code | text | no | equals the code's address | Add node | "This access code is for the node at {address}. Clear the address, or use that one." |
| Add a node · Address (no code) | text | yes | `host:port`, optional `http(s)://` | Add node | today's address error (nodesPage `add.errorAddress`) |
| Add a node · Name | text | no with a code ("Name (optional)"); yes without | node name rule | Add node | today's name error (`add.errorName`) |
| Add a node · duplicate | — | — | node not listed yet | Add node | "{name} is already in your list." (today's `add.duplicate`) |
| Needs connecting · code | text | yes | as above, plus the row's node | Connect | as above; "This access code is for another node, not {name}. Create one on {name}."; exchange refused: "This access code is not valid: it was used, expired or mistyped. Create a new one on the node." |
| Found · Control · code | text | yes | as above, for that node | Add | as above (other node, expired, used) |
| Private Network · Your own VPN range | CIDR | — | private ranges only (10/8, 172.16/12, 192.168/16, 100.64/10, fd00::/8) | Accept range | the extension page's refusal; a range larger than /16 is warned |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Wide | ≥ 1280 px | Add node in one row (Address · Name · Access code · Add node); node rows in five columns with a fixed 6 rem Pair column | — |
| Medium | 768–1279 px | Add node in two columns; rows: name, Pair, actions, then server and offers below | — |
| Narrow / phone | < 768 px (container < 38 rem) | Cards stack. On extension cards the action stays on the name row and "Update to …" moves under the description. Node rows: name and icons, then the paired line full width, then server, offers and Pair. Found rows: buttons below the text. The Unpair confirmation wraps its buttons below the text. | — |
| Desktop app own window | `electron_internal` | full Extensions (Voice Input offered) | — |
| Docker node window | `electron_external` | Voice Input not listed, with a note; Private Network installable | dictation uses this computer |
| Browser window | not the desktop app | Extensions note only | — |

## Accessibility And Keyboard Behavior

- **Accessibility target:** the existing product's (semantic controls, visible focus, WCAG AA contrast for text).
- **Focus order:** the visual order of each section. The Unpair confirmation receives focus on its buttons in order. Dialogs keep focus inside and return it to the trigger on close. Escape and the backdrop close dialogs that are not running.
- **Keyboard:** every control is a native button, input or checkbox. Switches are `role="switch"` with `aria-checked` and a label (`aria-labelledby` for "Visible on my private network").
- **Roles, names and live announcements:**
  - Status lines use `role="status"` ("Pairing…", "Unpairing…", steps).
  - Errors use `role="alert"`.
  - The Unpair confirmation is `role="alertdialog"`.
  - The Pair button's name is "Pair with {name}".
  - Status dots have `aria-label` ("Reachable now", "Online").
- **Contrast:** text uses slate-500 and darker on white. Amber and emerald use their -700/-900 text shades.

## Motion And Transitions

- **Motion:** spinners for in-progress states. A new or changed row flashes `bg-blue-50/70` for about 2.5 s. Switch knobs slide.
- **Durations and easing:** the product's Tailwind `transition` defaults; the row highlight is 700 ms.
- **Reduced motion:** spinners and switch transitions use `motion-reduce:` variants (no animation).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Extension manager per node (extension-contract) | list, state, install/enable/update/remove, log | scripted store `stores/extensionsStore.ts`; seeds via `localStorage['autobyteus.prototype.extensions']` | real per-node manager and signed catalog |
| Extension page bridge | `{id, call, input}` / `{id, ok, output|error}`, `{ resize: { height } }` | real sandboxed iframes (`allow-scripts`, CSP `connect-src 'none'`) with scripted actions | the extension's own server part |
| Voice Input runtime and microphone | transcription, devices, warm-up | scripted; no microphone is opened; first transcription about 5 s; warm-up 6 s (about 30 s in the product) | real runtime (about 2 GB speech model). **The honest "Getting ready…" readiness depends on voice runtime 0.3.1 (prerequisite PRE-001, a separate Task).** |
| Owner credentials (NA-11) | Controlled by, Revoke | fixed list (home-mac, work-laptop, studio-mac) | `GET/DELETE /rest/node-access/owner-credentials`: `credentialId`, `desktopName`, `createdAt`, `lastSeenAt` |
| Catalog translations and page locale (contract §1, §5) | names, descriptions, page texts | zh-CN translations in the catalog fixture and per-page tables | each extension's own translations |
| Private network program | join, status, machines, invites | scripted `stores/privateNetworkStore.ts` | real Tailscale / Headscale / hosting. **Provisional:** Tailscale sign-in, auth keys, device approval, key expiry, sharing; hosting a private network |
| Discovery and pairing (pairing-contract §1–§5) | found, requests, pair, accept, unpair | scripted, with timings shortened (pair about 2 s, teammate accepts after about 7 s) | `/autobyteus/info`, `/pair`, `/pair-accepted`, `/pair-rejected`, signed `/unpaired`, signed requests |
| Access code (§6) | add with code, Needs connecting, Create access code, Control | codes generated and checked locally; used codes remembered in the browser | node-made code; setup exchange for the owner credential. **Provisional (G1):** the app reaching a private address through its own node's relay |
| "Design reference only" controls | Docker Guide printed output; Found "paste {name}'s code" | dashed boxes that produce a code the reference accepts | **Not product UI: do not build** |
| Window bound to another node | node window states | design seed `autobyteus.prototype.windowEntry` (e.g. `remote-linux-box`) | the desktop's own window binding |
| Nodes and peers | rows, offers, versions | simulated network of nodes (`prototype/nodes/network-world.mjs`) | real nodes |

## Final Visual Reference Inventory

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-L-01 | L (zh-CN) · zh extensions translated names | 1440×900 | `visual-references/VIS-L-01-zh-extensions-translated-names.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-L-02 | L (zh-CN) · zh voice input page | 1440×900 | `visual-references/VIS-L-02-zh-voice-input-page.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-L-03 | L (zh-CN) · zh private network choose network | 1440×900 | `visual-references/VIS-L-03-zh-private-network-choose-network.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-L-04 | L (zh-CN) · zh private network joined | 1440×900 | `visual-references/VIS-L-04-zh-private-network-joined.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-L-05 | L (zh-CN) · zh manage nodes | 1440×2400 | `visual-references/VIS-L-05-zh-manage-nodes.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-N-01 | N · phone extensions | 390×844 (phone) | `visual-references/VIS-N-01-phone-extensions.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-N-02 | N · phone voice input page | 390×844 (phone) | `visual-references/VIS-N-02-phone-voice-input-page.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-N-03 | N · phone update below description | 390×844 (phone) | `visual-references/VIS-N-03-phone-update-below-description.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-N-04 | N · phone this node | 390×844 (phone) | `visual-references/VIS-N-04-phone-this-node.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-N-05 | N · phone controlled nodes | 390×844 (phone) | `visual-references/VIS-N-05-phone-controlled-nodes.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-N-06 | N · phone found | 390×844 (phone) | `visual-references/VIS-N-06-phone-found.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-01 | T1 · installing | 1440×900 | `visual-references/VIS-T1-01-installing.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-02 | T1 · installed and on starting network program | 1440×900 | `visual-references/VIS-T1-02-installed-and-on-starting-network-program.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-03 | T1 · not ready choose network | 1440×900 | `visual-references/VIS-T1-03-not-ready-choose-network.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-04 | T1 · sign in waiting | 1440×900 | `visual-references/VIS-T1-04-sign-in-waiting.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-05 | T1 · joined this machine my machines | 1440×900 | `visual-references/VIS-T1-05-joined-this-machine-my-machines.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-06 | T1 · offer make this node visible | 1440×900 | `visual-references/VIS-T1-06-offer-make-this-node-visible.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-07 | T1 · auth key option | 1440×900 | `visual-references/VIS-T1-07-auth-key-option.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-08 | T1 · headscale server and key | 1440×900 | `visual-references/VIS-T1-08-headscale-server-and-key.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-09 | T1 · invite code joins as bob | 1440×900 | `visual-references/VIS-T1-09-invite-code-joins-as-bob.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-10 | T1 · host a private network form | 1440×900 | `visual-references/VIS-T1-10-host-a-private-network-form.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-11 | T1 · your own vpn ranges | 1440×900 | `visual-references/VIS-T1-11-your-own-vpn-ranges.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-12 | T1 · waiting for approval | 1440×900 | `visual-references/VIS-T1-12-waiting-for-approval.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-13 | T1 · signed out sign in again | 1440×900 | `visual-references/VIS-T1-13-signed-out-sign-in-again.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-14 | T1 · joined headscale | 1440×900 | `visual-references/VIS-T1-14-joined-headscale.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-15 | T1 · headscale server cannot be reached | 1440×900 | `visual-references/VIS-T1-15-headscale-server-cannot-be-reached.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-16 | T1 · hosting facts | 1440×900 | `visual-references/VIS-T1-16-hosting-facts.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-17 | T1 · invite code for a teammate | 1440×900 | `visual-references/VIS-T1-17-invite-code-for-a-teammate.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T1-18 | T1 · docker node window extensions | 1440×900 | `visual-references/VIS-T1-18-docker-node-window-extensions.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T2-01 | T2 · rejoining after restart | 1440×900 | `visual-references/VIS-T2-01-rejoining-after-restart.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T2-02 | T2 · rejoined | 1440×900 | `visual-references/VIS-T2-02-rejoined.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T2-03 | T2 · this node while rejoining | 1440×900 | `visual-references/VIS-T2-03-this-node-while-rejoining.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T3-01 | T3 · this node visible on my private network | 1440×900 | `visual-references/VIS-T3-01-this-node-visible-on-my-private-network.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T3-02 | T3 · visible off | 1440×900 | `visual-references/VIS-T3-02-visible-off.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T4-01 | T4 · manage nodes sections overview | 1440×2400 | `visual-references/VIS-T4-01-manage-nodes-sections-overview.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T4-02 | T4 · manage nodes without private network | 1440×1500 | `visual-references/VIS-T4-02-manage-nodes-without-private-network.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T5-01 | T5 · controlled node not paired | 1440×900 | `visual-references/VIS-T5-01-controlled-node-not-paired.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T5-02 | T5 · pairing on its row | 1440×900 | `visual-references/VIS-T5-02-pairing-on-its-row.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T5-03 | T5 · paired private network | 1440×900 | `visual-references/VIS-T5-03-paired-private-network.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T5-04 | T5 · found control with access code | 1440×900 | `visual-references/VIS-T5-04-found-control-with-access-code.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T5-05 | T5 · control connecting | 1440×900 | `visual-references/VIS-T5-05-control-connecting.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T5-06 | T5 · now a controlled node | 1440×900 | `visual-references/VIS-T5-06-now-a-controlled-node.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T6-01 | T6 · asking to pair accept reject | 1440×900 | `visual-references/VIS-T6-01-asking-to-pair-accept-reject.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T6-02 | T6 · accepting | 1440×900 | `visual-references/VIS-T6-02-accepting.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T6-03 | T6 · found waiting for bob to accept cancel | 1440×900 | `visual-references/VIS-T6-03-found-waiting-for-bob-to-accept-cancel.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T6-04 | T6 · paired nodes teammates | 1440×900 | `visual-references/VIS-T6-04-paired-nodes-teammates.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T7-01 | T7 · paired node what it shares | 1440×900 | `visual-references/VIS-T7-01-paired-node-what-it-shares.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-01 | T8 · docker guide access code command | 1440×900 | `visual-references/VIS-T8-01-docker-guide-access-code-command.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-02 | T8 · docker guide connect steps design only output | 1440×900 | `visual-references/VIS-T8-02-docker-guide-connect-steps-design-only-output.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-03 | T8 · add a node form | 1440×900 | `visual-references/VIS-T8-03-add-a-node-form.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-04 | T8 · access code fills address | 1440×900 | `visual-references/VIS-T8-04-access-code-fills-address.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-05 | T8 · adding reaching the node | 1440×900 | `visual-references/VIS-T8-05-adding-reaching-the-node.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-06 | T8 · added controlled pair on its row | 1440×900 | `visual-references/VIS-T8-06-added-controlled-pair-on-its-row.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-07 | T8 · pairing on its row | 1440×900 | `visual-references/VIS-T8-07-pairing-on-its-row.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-08 | T8 · paired | 1440×900 | `visual-references/VIS-T8-08-paired.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-09 | T8 · used access code refused | 1440×900 | `visual-references/VIS-T8-09-used-access-code-refused.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-10 | T8 · needs connecting paste access code | 1440×900 | `visual-references/VIS-T8-10-needs-connecting-paste-access-code.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-11 | T8 · needs connecting not a code | 1440×900 | `visual-references/VIS-T8-11-needs-connecting-not-a-code.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-12 | T8 · embedded no network no create access code | 1440×900 | `visual-references/VIS-T8-12-embedded-no-network-no-create-access-code.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-13 | T8 · docker on localhost no create access code | 1440×900 | `visual-references/VIS-T8-13-docker-on-localhost-no-create-access-code.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-14 | T8 · node on local network controlled by | 1440×900 | `visual-references/VIS-T8-14-node-on-local-network-controlled-by.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-15 | T8 · create access code | 1440×900 | `visual-references/VIS-T8-15-create-access-code.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-16 | T8 · revoke confirmation | 1440×900 | `visual-references/VIS-T8-16-revoke-confirmation.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-17 | T8 · revoked | 1440×900 | `visual-references/VIS-T8-17-revoked.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T8-18 | T8 · embedded on private network create access code | 1440×900 | `visual-references/VIS-T8-18-embedded-on-private-network-create-access-code.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T9-01 | T9 · unpair controlled node confirmation | 1440×900 | `visual-references/VIS-T9-01-unpair-controlled-node-confirmation.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T9-02 | T9 · unpaired stays controlled | 1440×900 | `visual-references/VIS-T9-02-unpaired-stays-controlled.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T9-03 | T9 · unpair teammate confirmation | 1440×900 | `visual-references/VIS-T9-03-unpair-teammate-confirmation.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T9-04 | T9 · teammate back in found | 1440×900 | `visual-references/VIS-T9-04-teammate-back-in-found.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T9-05 | T9 · remove gives up control | 1440×900 | `visual-references/VIS-T9-05-remove-gives-up-control.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T9-06 | T9 · leave confirmation | 1440×900 | `visual-references/VIS-T9-06-leave-confirmation.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-T9-07 | T9 · left join again | 1440×900 | `visual-references/VIS-T9-07-left-join-again.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V1-01 | V1 · list this computer | 1440×900 | `visual-references/VIS-V1-01-list-this-computer.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V1-02 | V1 · list docker window no voice | 1440×900 | `visual-references/VIS-V1-02-list-docker-window-no-voice.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V1-03 | V1 · no owner credential note only | 1440×900 | `visual-references/VIS-V1-03-no-owner-credential-note-only.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V1-04 | V1 · browser window note | 1440×900 | `visual-references/VIS-V1-04-browser-window-note.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V1-05 | V1 · not available on this computer | 1440×900 | `visual-references/VIS-V1-05-not-available-on-this-computer.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V2-01 | V2 · not installed | 1440×900 | `visual-references/VIS-V2-01-not-installed.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V2-02 | V2 · installing downloading the package | 1440×900 | `visual-references/VIS-V2-02-installing-downloading-the-package.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V2-03 | V2 · installing preparing speech model no percent | 1440×900 | `visual-references/VIS-V2-03-installing-preparing-speech-model-no-percent.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V2-04 | V2 · installed and on getting ready | 1440×900 | `visual-references/VIS-V2-04-installed-and-on-getting-ready.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V2-05 | V2 · ready | 1440×900 | `visual-references/VIS-V2-05-ready.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V2-06 | V2 · app start getting ready | 1440×900 | `visual-references/VIS-V2-06-app-start-getting-ready.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V3-01 | V3 · adopted on english folder | 1440×900 | `visual-references/VIS-V3-01-adopted-on-english-folder.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V4-01 | V4 · off | 1440×900 | `visual-references/VIS-V4-01-off.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V4-02 | V4 · on getting ready | 1440×900 | `visual-references/VIS-V4-02-on-getting-ready.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V4-03 | V4 · on ready | 1440×900 | `visual-references/VIS-V4-03-on-ready.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V4-04 | V4 · off again | 1440×900 | `visual-references/VIS-V4-04-off-again.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V5-01 | V5 · microphone button memory search | 1440×900 | `visual-references/VIS-V5-01-microphone-button-memory-search.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V5-02 | V5 · recording | 1440×900 | `visual-references/VIS-V5-02-recording.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V5-03 | V5 · transcribing slow note | 1440×900 | `visual-references/VIS-V5-03-transcribing-slow-note.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V5-04 | V5 · transcript in search box | 1440×900 | `visual-references/VIS-V5-04-transcript-in-search-box.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V5-05 | V5 · no microphone when voice not ready | 1440×900 | `visual-references/VIS-V5-05-no-microphone-when-voice-not-ready.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V6-01 | V6 · docker window microphone uses this computer | 1440×900 | `visual-references/VIS-V6-01-docker-window-microphone-uses-this-computer.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V7-01 | V7 · language saved on extension page | 1440×900 | `visual-references/VIS-V7-01-language-saved-on-extension-page.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V8-01 | V8 · microphone choice autobyteus section | 1440×900 | `visual-references/VIS-V8-01-microphone-choice-autobyteus-section.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V8-02 | V8 · test recording | 1440×900 | `visual-references/VIS-V8-02-test-recording.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V8-03 | V8 · test transcribing slow note | 1440×900 | `visual-references/VIS-V8-03-test-transcribing-slow-note.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V8-04 | V8 · test result | 1440×900 | `visual-references/VIS-V8-04-test-result.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V9-01 | V9 · update available | 1440×900 | `visual-references/VIS-V9-01-update-available.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V9-02 | V9 · updating | 1440×900 | `visual-references/VIS-V9-02-updating.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V9-03 | V9 · updated still on | 1440×900 | `visual-references/VIS-V9-03-updated-still-on.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V10-01 | V10 · remove confirmation | 1440×900 | `visual-references/VIS-V10-01-remove-confirmation.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V10-02 | V10 · removing | 1440×900 | `visual-references/VIS-V10-02-removing.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V10-03 | V10 · not installed | 1440×900 | `visual-references/VIS-V10-03-not-installed.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V11-01 | V11 · log | 1440×900 | `visual-references/VIS-V11-01-log.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V12-01 | V12 · broken extension failed other works | 1440×900 | `visual-references/VIS-V12-01-broken-extension-failed-other-works.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V12-02 | V12 · unreadable state everything off | 1440×900 | `visual-references/VIS-V12-02-unreadable-state-everything-off.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V13-01 | V13 · catalog unverified | 1440×900 | `visual-references/VIS-V13-01-catalog-unverified.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V13-02 | V13 · install refused checksum failed | 1440×900 | `visual-references/VIS-V13-02-install-refused-checksum-failed.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V13-03 | V13 · catalog not reachable | 1440×900 | `visual-references/VIS-V13-03-catalog-not-reachable.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V13-04 | V13 · needs a newer autobyteus | 1440×900 | `visual-references/VIS-V13-04-needs-a-newer-autobyteus.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |
| VIS-V13-05 | V13 · update needs a newer autobyteus | 1440×900 | `visual-references/VIS-V13-05-update-needs-a-newer-autobyteus.png` | layout, section order, copy, controls, states | names, addresses, accounts, codes, QR images, versions, sizes, counts, agent lists, dates, log lines |

Reference groups: `V*` Voice Input and the extension foundation (spines V1–V13); `T*` Private Network and Manage Nodes (spines T1–T9); `L*` the Chinese app (DEC-015); `N*` phone width. The "Design reference only" boxes in VIS-T8-02 and VIS-T5-04 are review aids, not product UI.

## Linked UI Reference Evidence

- **Runnable UI reference:** the design repository `personal` (after integration). Run `corepack pnpm install --ignore-workspace --frozen-lockfile && corepack pnpm dev --port 4516`. Starting states are in `ui-reference-runbook.md` (section extensions-ui-516).
- **Ticket record:** `product-ticket.md`
- **Run instructions:** `ui-reference-runbook.md`
- **Relevant supporting artifacts:**
  - `design-change-log.md` (DC-001…DC-090);
  - `review-round-1.md` (rounds 1–10);
  - `round-5-coverage.md` (spine-by-spine coverage);
  - the interim captures in `review-captures/` (not normative).
- **Relevant journey, transition and scenario IDs:** UXJ-001…UXJ-020, TR-001…TR-024, spines V1–V13 and T1–T9.
- **Mocked boundaries and limitations:** see Data, Contract, And Mock Boundaries. "bob declined → Pair again" is specified but not captured, because the reference's teammate always accepts.

## Implementation Fidelity Boundary

- **Must preserve:**
  - the section structure and order of Manage Nodes, with each node in exactly one section;
  - one control per action (no collaboration switch, no trust switch, no disconnect icon);
  - Pair one click for controlled nodes, and Accept for nodes not controlled;
  - the single Add a node form (Address · Name · Access code) with the Access code field filling the address, and Pair on the row as the only pairing control;
  - install ends On; Create access code only where the address is reachable by others; Controlled by with Revoke; translations and the page locale; the Voice Input warm-up message;
  - the card frame and its states, the in-place extension page, and AutoByteus's own microphone panel and visibility switch;
  - all copy as in the catalogs.
- **Does not prescribe production architecture:** the stores, seeds, timings, the simulated network, and the locally generated codes.
- **Illustrative:** node, machine and account names, addresses, ports, codes, QR images, versions, sizes, counts, agent and team lists, log lines and timestamps.
- **Permitted responsive variation:** exact breakpoints may follow the production container widths, as long as the narrow layouts in VIS-N-* keep their order and wrapping.
- **Existing design-system constraints:** Tailwind classes and colors as in the product; existing dialog, notice and switch patterns.

## Out Of Scope

- the Settings page's narrow-width navigation (`settings-narrow-navigation`, FU-002);
- the Shared Folder extension;
- the transition of today's stored "remote collaboration" setting and the peers registered under it (decided by the Private Network stage's engineering design).

## Open Decisions And Risks

Decided by DEC-015 (2026-11-26; the founder can change any of these later):

- an install ends **On** (AC-002);
- extensions' names, descriptions and pages are **translated** when the extension provides it (catalog `translations`, page `{ locale }`); status messages stay as the extension gives them;
- **no Reinstall / Open Folder** (Remove + Install; Voice Input's page shows its folder with Copy);
- **one click** for your own nodes (pairing-contract §3 case 1);
- **no "Pair with it"**: the row's Pair is the only pairing control;
- **Create access code** only where another computer can reach the address;
- **Controlled by … Revoke** on This node.

Provisional, drawn but not proved: Tailscale sign-in, auth keys, device approval, key expiry and sharing; hosting a private network; G1 (the app reaching a private address through its own node's relay).

Dependency: Voice Input's honest readiness ("Getting ready…") needs voice runtime 0.3.1 (PRE-001, a separate Task).

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes` (except "{account} declined", specified in text)
- Every section covers the affected scope or is marked: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality without placeholders, clipping, overlap, or drift: `Yes`
- Every visible detail is requirements-defining unless marked illustrative: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
