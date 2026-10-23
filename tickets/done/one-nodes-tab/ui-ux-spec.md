# UI/UX Specification — one-nodes-tab (Nodes → Manage Nodes: one list of nodes, Remote Collaboration merged in)

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `one-nodes-tab` (engineering package `one-nodes-tab`, branch `codex/one-nodes-tab`; Product ticket `tickets/done/one-nodes-tab/`)
- Related requirements revision ID: SR-004/SR-005 (`requirements-doc.md` in the engineering ticket), plus the requirement impacts listed in "Open Decisions And Risks"
- Related IDs: UC-701…706, REQ-701…714, BEH-701…707, AC-701…713, QR-701…703, DEC-701…709, SCN-701…706
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Review URL (during review): `http://127.0.0.1:4801/nodes?nodeTab=manage`, scenario `nodes_user` (see `ui-reference-runbook.md`, section `one-nodes-tab`)
- Explicit user-confirmation reference: the user's message "i think we are ready. approved", 2026-10-23, in the Product UI/UX Designer conversation, after eight rounds of feedback recorded in `product-ticket.md` and `design-change-log.md` (DC-714 … DC-723). Decisions the user delegated to the designer ("you decide", 2026-10-23): DEC-709, the Remove rule, no toast, Agents/Teams after the switch.
- Final check date: 2026-10-23

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web`, Nodes page (`/nodes`, tab Manage Nodes)
- Pinned source commit or revision: `origin/personal@9e7a45880865912442f4188e6d2a58d99b10a54c` (baseline report pin) plus the accepted `remote-nodes-page` (267) design; engineering base for this request `origin/personal@ca1f09e52a` (read only, `/Users/normy/autobyteus_org/autobyteus-worktrees/one-nodes-tab`)
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- UI reference revision or commit: see `product-ticket.md` ("Final Integration")
- Ticket folder: `tickets/done/one-nodes-tab/`
- Baseline report path: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md`
- Baseline check for this request: between `9e7a458` and `ca1f09e52a` the Nodes components `NodeManager.vue`, `NodeManagerTabs.vue`, `CurrentWindowNodeCard.vue`, `FeatureCapabilityToggleCard.vue` are identical to the design repository; the Remote Collaboration components differ only in internal state names; `NfsGuideCard.vue` changed in the source and is not touched here (no refresh).

## Problem And Design Rationale

- User problem and intent: the Nodes page kept two lists of the same nodes (Manage Nodes for opening windows, Remote Collaboration → Peer nodes for agents), so a node was entered up to four times, with addresses that must be right for the node that calls, and failed with "fetch failed". The owner wants one list where each node is added once and agents on both nodes can work together after one confirmation.
- Key UX decisions and why:
  - **One list, one row per node**, joined by node ID. A row is a status dot, the name (click to rename), the address, the remote-collaboration icon with its switch, Open and Remove as icon buttons. Quiet when fine; a line with one fixing button only when something needs the owner.
  - **Adding a node connects agents by default.** The add form is always visible: Address, Name, the collaboration icon with its switch (on), Add node. Adding changes the other node, so one confirmation lists every change on both nodes, grouped by the node it happens on. Untick (switch off) to only list and open a node. The owner's reasoning: people add a node expecting agents to use it; a separate hidden toggle confuses.
  - **One icon for remote collaboration** (two nodes exchanging arrows) in the "This node" section heading, on every row's switch, in the add form and in the confirmation title, green when on, grey when off, so every switch reads as the same setting.
  - **Agents and Agent Teams under the bar**, only once collaboration with that node is on: "7 Agents · 2 Agent Teams  Build Runner, …" (the existing 267 summary line); click opens the full list (267 list, search above 6) and, below it, the connection details. Rows with a problem show "Connection details" instead.
  - **Success is silent, only problems speak.** No "Added" notice, no toast. An unavailable node says so in its own row (hollow dot, cause, Check again, switch off and disabled).
  - **Everything that changes another node is confirmed once**, in one dialog that also shows each step while it runs, a partial result and Try again. Fixing buttons on a row open the same dialog.
  - **No menu.** Rename is click-the-name; Remove is a visible icon.
- Alternatives considered and why rejected:
  - A switch labelled "Agents" off by default (the first draft): users did not understand what it was for → replaced by the icon, default on, one confirmation.
  - Fully automatic collaboration with no confirmation: it changes another node (turns on its collaboration, registers this node there); the approved QR-702 requires the owner's explicit confirmation.
  - A ⋯ menu for Rename/Remove, a row chevron, a "Remove" link inside the expanded row, text buttons for Open/Remove, an "Added" banner or toast: tried in review and rejected by the user as unclean or redundant.
  - Showing a node's Agents/Teams before collaboration is on: needs a new read path on the other node and mixes "what exists" with "what my agents can use".
  - Joining the two stored lists: out of scope of the UI (DEC-701, screens join by node ID).

## Scope And Experience Goal

- User or actor: the owner of the desktop app and his nodes (embedded node, Docker nodes, other machines on his private network).
- Context: Settings → Nodes → Manage Nodes, in a desktop window opened on the embedded node, in a window opened on a Docker node ("this node" is then the Docker node and the embedded node is a row), and in a browser (no Open). English and Chinese.
- Goal: see every node once, add a node once, make agents on both nodes work together in one confirmation, and understand and fix what is missing.
- Observable success: add `http://localhost:8003` once, confirm once, and see "3 Agents · 1 Agent Team" under its row without opening 8003's window; both directions work.
- In-scope surfaces and journeys: the Manage Nodes tab (This node card, add form, node list, confirmations, connection details), the removal of the Remote Collaboration tab, the Docker hint and the link to the Docker Guide tab.
- Non-goals: starting or messaging remote runs; Memory Sync, Phone Setup, Docker Guide and NFS Guide content and look; polling or live updates; peer authentication; a list of this node's own shared agents or readiness flags (removed in 267, not brought back).

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-701, AC-701, UC-705 | No Remote Collaboration tab; its switch, explanation and rules are a section of "This node" | UXJ-707, UIS-001, VIS-001, VIS-007 |
| REQ-702, REQ-711, AC-702, UC-701 | One row per node; the node the window is opened on is "This node" | UIS-001, UIS-002, VIS-019, VIS-025 |
| REQ-703, UC-701 | Row: name, reachable now (dot), Open, Rename, Remove, collaboration state, offer when expanded | UIS-002, UXJ-701, UXJ-706 |
| REQ-704, AC-703, UC-702, DEC-707 | One add form; **collaboration on by default (requirement change)**, confirmed once; an unreachable node is still added with its cause shown in its row; a node already listed is not added again and the owner is told which | UXJ-701, UXJ-702, VIS-002, VIS-011, VIS-013 |
| REQ-705, AC-704, AC-705, UC-703, QR-702 | One confirmation listing every change on both nodes, then per-step progress; turning off removes both registrations and never turns off the other node's switch | UXJ-701, UXJ-703, VIS-003, VIS-004, VIS-008 |
| REQ-706, AC-706 | Direction states in connection details; one line and one fixing button on the row | UXJ-704, VIS-019, VIS-020, VIS-022 |
| REQ-707, REQ-708, AC-707, UC-704 | Named causes; the Docker hint with Use this and a Docker Guide link | UXJ-705, VIS-018, VIS-026 |
| REQ-709 | This node's switch, explanation and "How remote collaboration works" | UXJ-707, VIS-001, VIS-007, VIS-024 |
| REQ-710, AC-708, AC-709, UC-706 | One name, click to rename, rule message; Remove confirmation lists what is removed | UXJ-706, VIS-009, VIS-010 |
| REQ-712, AC-710, QR-701 | Each row answers at its own pace, up to 20 s, the page is never blocked | VIS-019 (edge), UIS-002 |
| REQ-713, AC-711, QR-703 | Docker window, browser, English, Chinese, narrow | UXJ-708, UXJ-709, UXJ-710 |
| DEC-703 | Memory Sync, Phone Setup, Docker Guide, NFS Guide remain tabs | UIS-001 |
| DEC-706 | A node only this node knows has Open once this window reaches its address; its first Open adds a desktop entry | UIS-002 |
| DEC-709 (decided: option b) | "8003 finds this node's address once it is on." while the other switch is off; the address once it is on | VIS-003, VIS-021 |

## Visual Language

- Existing product language to preserve: Nodes page cards (`rounded-2xl`, `border-slate-200`, `shadow-sm`, white; "This node" keeps `border-blue-100`), the tab bar, Tailwind slate/blue/emerald/amber/red palette, the product confirmation frame (`ConfirmationModal`: `rounded-lg`, `bg-black/50` overlay, `p-6`, `shadow-xl`), the switch of `FeatureCapabilityToggleCard` (24×44 px, emerald on, slate off), the 267 offer view (`RemoteCollaborationOfferDisclosure`, `OfferList`, reused; one slot and an optional open state added to the disclosure).
- Layout structure and visual hierarchy: Manage Nodes = (1) "This node" card, (2) "Nodes" card with a header, the add form, then the rows. Content max width 80 rem, page padding as the baseline.
- Grid, dimensions, spacing, density: card padding `p-5`; "Nodes" header `px-5 py-4` on `bg-slate-50`; add form `px-5 py-4` on white, grid `[2fr 1fr auto auto]` with 12 px gaps (stacked below 768 px); row `px-5 py-4`, left cluster dot + text with 12 px gap, controls cluster right with 12 px gaps; the line and details under a row are indented to the name (`pl-[2.75rem]`); inputs 38 px high; icon buttons 40×40 px, icons 20 px; switch 24×44 px; collaboration icon 24 px in rows and in the add form, 20 px in a 32 px tinted square in the section heading, 24 px in the dialog title.
- Typography: product sans; row name `text-sm font-semibold` (14/20); address `font-mono text-xs` (12/16) `text-slate-500`; section titles `text-sm font-semibold`; descriptions `text-sm text-gray-500`; lines under rows `text-sm`; dialog title `text-lg font-semibold`; dialog group labels `text-xs font-semibold text-slate-500` (not uppercased, node names are shown as written).
- Color values and semantic roles: on / working `emerald-500` switch track, `emerald-600` icon and ✓, `emerald-700` text; off `slate-300` track, `slate-400` icon; primary `blue-600`/`blue-700` hover; warning (needs the owner) `amber-50` fill, `amber-200` border, `amber-900` text; error (a different node, a failed step) `red-50`, `red-200`, `red-900`; information `slate-600` on white, no box; status dot: reachable `emerald-500`, different node `red-500`, not reachable hollow `slate-400` ring on white, checking spinner `slate-500` on `slate-200`; flash of a new or duplicate row `blue-50/70` for 2.5 s.
- Surfaces, borders, radii, shadows, elevation: cards as above; lines under rows `rounded-lg`; icon buttons `rounded-lg border-slate-300`; dialog `rounded-lg shadow-xl` on a `bg-black/50` overlay, `z-50`, `max-w-lg`.
- Controls, icons, imagery: remote-collaboration icon (24-unit stroke icon, 1.7 stroke: two rounded squares at top-left and bottom-right joined by two arrows; `RemoteCollaborationIcon.vue`), open-in-new-window icon, trash icon, pencil (14 px, on hover over a name), refresh icon (from 267). No imagery.
- Hover, active, focus, selected, disabled, validation, feedback treatment: focus rings `ring-2 ring-blue-500` (red for Remove, red for the hint buttons); Open/Remove hover `border-slate-400 bg-slate-50` and `border-red-300 bg-red-50 text-red-700`; a name hovers `bg-slate-100` with the pencil; the switch of an unreachable, unregistered node is `opacity-50` and disabled with a tooltip; a switch that is on while this node's switch is off is `opacity-60`; invalid fields get a `red-300` border and `text-sm text-red-600` message under them.

### New Or Changed Components

The UI reference location is traceability only; it does not prescribe the production implementation.

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| ThisNodeCard | This node's name, type, address, remote-collaboration switch, explanation, "How remote collaboration works" | on, off (with note), saving | `components/settings/nodes/ThisNodeCard.vue` |
| NodeList | "Nodes" card: header, always-open add form, rows | empty, populated | `components/settings/nodes/NodeList.vue` |
| AddNodePanel | Address, Name, collaboration switch, Add node | idle, checking address, field errors, duplicate | `components/settings/nodes/AddNodePanel.vue` |
| NodeRow | One node | checking, working, off, off there, not registered there, different node, not reachable, step not finished, registered only by the other node, this node off; renaming; collapsed/open details | `components/settings/nodes/NodeRow.vue` |
| NodeChangeDialog | One confirmation for turn on, finish, turn off, remove, with running and failed views | confirm, running, failed (Try again), failed remove | `components/settings/nodes/NodeChangeDialog.vue` |
| NodeAddressHint | Docker loopback hint with Use this and Docker Guide | with suggestion, without | `components/settings/nodes/NodeAddressHint.vue` |
| RemoteCollaborationIcon | The one icon | sizes 20/24 px, green/grey by context | `components/settings/nodes/RemoteCollaborationIcon.vue` |
| RemoteCollaborationOfferDisclosure (267, reused) | Under-the-bar summary and list | collapsed, open; one extra slot for the connection details; optional controlled open state; no list when there are no entries | `components/settings/RemoteCollaborationOfferDisclosure.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related Behavior / Requirement / AC IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-701 | Owner, desktop window on the embedded node | `nodes_user`: Embedded Node + docker working | Add 8003 once and let agents work together | 8003 listed, both directions working, "3 Agents · 1 Agent Team" under its row | REQ-702…706, AC-702…704, SCN-701, SCN-702 |
| UXJ-702 | Same | Same | List and open a node without agent collaboration, turn it on later | Row says agents can't work with it yet with Turn on; later working | REQ-704, DEC-707 (changed) |
| UXJ-703 | Same | A working row | Stop agents working with a node | Both registrations removed; node stays; the other node's own switch untouched | REQ-705, AC-705, SCN-702 |
| UXJ-704 | Same | `nodes_states` rows; `localhost:8005` | Fix what is missing: off there, not registered there, a step not finished | The row is working | REQ-706, AC-704, AC-706 |
| UXJ-705 | Same, Docker window | A wrong or loopback address | Understand the cause and fix it | Address changed, or the Docker hint with Use this | REQ-707, 708, AC-707, SCN-704 |
| UXJ-706 | Same | Any row | Rename and remove | One name everywhere; node gone | REQ-710, AC-708, AC-709, SCN-706 |
| UXJ-707 | Same | This node's switch on | Turn this node's collaboration off and on | Rows quiet / active | REQ-709, AC-701, SCN-705 |
| UXJ-708 | Owner, window opened on Docker 8001 | `electron_external` | Same list from the Docker node | Embedded Node is a row; "This node" is docker | REQ-713 |
| UXJ-709 | Owner in a browser | context `desktop` | Same page without Open | No Open icon | REQ-713 |
| UXJ-710 | Owner, Chinese, narrow window | zh-CN; 390 px | Same journeys | Same behavior, stacked layout | REQ-713, QR-703 |

## Journey Details

### UXJ-701 — add 8003 once, confirm once (VIS-001 … VIS-006)

- Entry: Settings → Nodes opens Manage Nodes. Every row is asked once when the tab opens (a spinner dot and "Checking <name>… up to 20 seconds." until it answers). No other asks happen; nothing polls.
- Actions: type `http://localhost:8003` in Address and `8003` in Name (the collaboration switch beside them is on). Press Enter or click Add node. The button reads "Checking address…" for at most 1.5 s.
- Feedback: the new row appears and is highlighted for 2.5 s; no notice. The confirmation opens at once: "Let agents work with 8003?", lead "Agents on this node and on 8003 will be able to work with each other. These changes happen:", then **On this node (Embedded Node)** • Register 8003 as "8003"; **On 8003** • Turn on remote collaboration (it is off) • Register this node as "Embedded Node" with "8003 finds this node's address once it is on." (DEC-709 option b); footer "Trusted private network only: nodes are not authenticated." Buttons Cancel / Turn on.
- Turn on: each line shows a spinner, then ✓; the button reads "Working…". On success the dialog closes after about 0.7 s. The row's switch is on, its icon green, and under its bar appears "3 Agents · 1 Agent Team  Code Reviewer, Researcher, Software Team, Writer".
- Completion: click that line to open the Agents and Agent Teams list (267 view) and the connection details (VIS-006): "This node → 8003 ✓ Working via http://localhost:8003  Change address", "8003 → this node ✓ Working via http://host.docker.internal:29695", node ID, "Checked hh:mm" and a refresh icon.
- Alternate: invalid address or name → messages under the fields, nothing added (VIS-012). Address already listed (or another address of a listed node) → "This is docker, already in your list." under the form, nothing added, that row is highlighted (VIS-011). Not reachable → the row is added, with its cause line (VIS-013); no confirmation opens and the switch stays off. Cancel in the confirmation → the node stays listed with its switch off and the line "Agents here can't work with 8003 yet." and Turn on.

### UXJ-702 — list a node without collaboration

- Switch the form's switch off before adding. The node is listed, can be opened, nothing is registered on either node. The row shows the grey icon, the switch off, and "ⓘ Agents here can't work with 8003 yet.  [Turn on]". Turn on (or the switch) opens the confirmation of UXJ-701.

### UXJ-703 — stop agents working with a node (VIS-008, VIS-023)

- Switch a working row off. Confirmation "Stop agents working with docker?" lists in one plain list: "Remove docker from this node", "Remove this node from docker", and "docker stays in your list, and its own remote collaboration stays on." Buttons Cancel / Turn off. If the other node cannot be reached, the dialog stays with the failed line and the cause, and says what could not be done; the row then shows its line.

### UXJ-704 — fix what is missing (VIS-014 … VIS-017, VIS-019, VIS-021, VIS-022)

- The row shows one line and one button: "Remote collaboration is off on studio. [Turn on there]"; "laptop doesn't know this node yet. [Register this node there]"; "Turned on here, but not finished on 8005. Nothing answers at that address and port. [Try again]"; "nas has registered this node. Its agents can reach this node once you turn collaboration on for nas. [Turn on]".
- Every one of these buttons opens the confirmation first, titled "Finish connecting <name>?" (or "Let agents work with <name>?" for Turn on) and listing only the changes still missing. When the other node's collaboration is already on, the address line shows "laptop reaches this node at http://192.168.2.10:29695."; when the registration name is taken the line says "“Embedded Node” is already used there, so it gets a number." and shows "Embedded Node 2" (VIS-021).
- A partial result stays visible: the dialog shows ✓ for what was done, ✗ with the cause for what failed, ○ for what was not run, "Not everything could be done. What was done stays done." and Close / Try again (VIS-014); after Close the row keeps the "Turned on here, but not finished…" line with Try again (VIS-015) and the connection details list the steps. Try again runs only what is left (VIS-016, VIS-017).

### UXJ-705 — wrong address, causes and the Docker hint (VIS-013, VIS-018, VIS-026)

- Causes in plain words: "Nothing answers at that address and port.", "No answer within 20 seconds.", "<host> can't be found from here." (or "…from <node>."), "Something answers there, but it isn't an AutoByteus node.", "A different node answers at this address." (red dot, [Change address]), "Remote collaboration is off on <name>." "fetch failed" is never shown.
- Change address: in the open connection details click "Change address" beside "via <address>" (or the warning's button, which opens the details itself); an input with Save/Cancel; Enter saves, Esc cancels; "Checking…" while the node checks who answers; a wrong node → "A different node answers there than the one registered."
- Docker hint: when a node running in Docker cannot find an address for another node and the first address it tried is loopback (typing `http://127.0.0.1:29695` in the Docker window, or registering this node on `localhost:8004`): a red block "docker can't reach http://127.0.0.1:29695." / "docker runs in Docker, where 127.0.0.1 is the container itself." / "Try http://host.docker.internal:29695 [Use this] Docker Guide". Use this retries with that address first and never changes the address the desktop opens. Docker Guide switches to the Docker Guide tab. The hint never appears in the add form (its address is the desktop's, where loopback is right).

### UXJ-706 — rename and remove (VIS-009, VIS-010)

- Rename: click the name (a pencil shows on hover). The name becomes a field, selected; Enter or clicking away saves, Esc cancels. Invalid → "Use 1–64 letters, digits, spaces, _ . or - (start with a letter or digit)." under the field and the field stays; a name used by another node → "Another node is already named <name>." The embedded node's name is not editable.
- Remove: the trash icon (tooltip "Remove docker") opens "Remove docker?" listing "Remove docker from this node", "Remove this node from docker" (only when collaborating), "Remove docker from your list" and "The node and its data are not touched." Buttons Cancel / Remove (red). The registration on the other node is removed too when it can be reached; otherwise the dialog stays open after the list entry is removed and says "Removed here. <name> could not be reached, so this node is still registered there." with Close. The embedded node has no trash icon.

### UXJ-707 — this node's switch (VIS-001, VIS-007, VIS-024)

- The "Remote collaboration" section of "This node": icon (green when on), title, switch with "On/Off/Saving…", the explanation, and the collapsed line "How remote collaboration works" (rules: temp workspace, auto-approved tool calls, local login, no default is refused). Off → a note "Off by default. While it is off, this node asks no other node and refuses their requests." and no warnings on the rows; row switches that are on are dimmed; a row's connection details say "Off on this node". Turning a row on while this node is off adds "Turn on remote collaboration (it is off)" to the confirmation.

### UXJ-708 … UXJ-710

- Docker window (VIS-025, VIS-026): "This node" is docker (type REMOTE); the embedded node is a row (Open shown, no Remove, name not editable); addresses on rows are where the desktop opens them; the address the Docker node uses appears in the connection details ("via http://host.docker.internal:29695").
- Browser (VIS-027): same page; no Open icon (a spacer keeps the alignment).
- Chinese and narrow (VIS-028 … VIS-031): same behavior; below 768 px the add form stacks (Address, Name, switch, Add node) and a row stacks its controls under the name; lines, details and the dialog fit 390 px without clipping.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Manage Nodes tab | `/nodes?nodeTab=manage` (default tab); tabs Manage Nodes, Memory Sync, Phone Setup, Docker Guide, NFS Guide; `?nodeTab=remoteCollaboration` opens Manage Nodes | See and manage all nodes | "This node" card, "Nodes" card | VIS-001, VIS-019 |
| UIS-002 | Node row | inside "Nodes" | One node: status, collaboration, open, remove, offer | dot, name, address, icon + switch, Open, Remove; optional line; under-the-bar summary | VIS-005, VIS-015, VIS-019 |
| UIS-003 | Add form | top of the "Nodes" card | Add a node once | Address, Name, icon + switch, Add node; messages below | VIS-002, VIS-011, VIS-012 |
| UIS-004 | Confirmation dialog | opened by the switch, the form, a fixing button, the trash icon | Confirm every change on both nodes once | title with icon, lead, grouped lines, note, buttons | VIS-003, VIS-004, VIS-008, VIS-009, VIS-014, VIS-016, VIS-021 … VIS-023 |
| UIS-005 | Connection details | open area under a row's summary | Directions, addresses, change address, steps, node ID, refresh | two direction lines, editor, steps, footer | VIS-006, VIS-020 |
| UIS-006 | Docker hint | in the dialog or under Change address | Explain loopback in Docker | red block with Use this, Docker Guide | VIS-018, VIS-026 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-701 | UIS-001 | Tab opens | Every row: spinner dot, "Checking … up to 20 seconds." | Each row settles at its own pace | One ask per row; this node's switch does not stop the window's checks; nothing polls | all |
| TR-702 | UIS-003 | Enter / Add node with valid fields | Button "Checking address…" ≤ 1.5 s | Row added and highlighted; fields clear and the switch is on again; confirmation opens when reachable and the switch is on | Desktop entry added **without opening its window**; remembers the node ID | UIS-004 |
| TR-703 | UIS-003 | Invalid or duplicate | Messages under the fields / "This is X, already in your list." | Nothing added; a duplicate row is highlighted | — | edit and retry |
| TR-704 | UIS-002 off | Switch on, or Turn on | Confirmation | See TR-705 | — | cancel, confirm |
| TR-705 | UIS-004 confirm | Turn on / Make these changes | Lines show spinner then ✓, button "Working…" | Success: dialog closes after 0.7 s, row on, counts line shown; failure: dialog stays with ✗, cause, Try again | Registers here; turns on there if off; registers this node there under the shown name | Close, Try again, Use this |
| TR-706 | UIS-002 on | Switch off | Confirmation "Stop agents working with X?" | Both registrations removed; X stays listed; other node's switch untouched | Failure shows what could not be removed | — |
| TR-707 | UIS-002 | Click the name | Name becomes a field | Rename mode | — | Enter, click away, Esc |
| TR-708 | Rename | Enter / blur / Esc | Saves silently / cancels | New name everywhere, including the name agents use; or message and the field stays | Desktop entry and this node's peer renamed | — |
| TR-709 | UIS-002 | Trash icon | Confirmation "Remove X?" | Row removed; both registrations removed when reachable | — | — |
| TR-710 | UIS-002 | Click the summary line | List and details open | Open/closed | — | search, Change address, refresh |
| TR-711 | UIS-005 | Change address → Save | "Checking…" | Saved; or "A different node answers there…"; or the Docker hint | The address this node uses; never the desktop's | Use this |
| TR-712 | UIS-002 problem | Fixing button | Confirmation (or Check again: row spinner) | See TR-705 / row settles again | — | — |
| TR-713 | This node | Switch off/on | "Saving…" then On/Off | Rows re-asked; off: rows quiet, no peer asked by this node | — | — |
| TR-714 | UIS-002 | Open icon | Host opens the node's window | Window opens | A node only this node knows gets a desktop entry at its first Open | — |
| TR-715 | UIS-006 | Docker Guide | Tab switches | Docker Guide tab | — | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Default, one working node | Tab open | Row with green dot, green icon and switch, Open, Remove; summary "7 Agents · 2 Agent Teams  names…" | all | — | VIS-001 |
| Checking | Open, add, Check again | Spinner dot; "Checking <name>… up to 20 seconds."; switch disabled | — | settles ≤ 20 s | VIS-019 (edge) |
| Off there | B's switch off | `amber` line "Remote collaboration is off on <name>." [Turn on there] + "Connection details" | button | confirmation | VIS-019 |
| Not registered there | B lacks this node | `amber` "<name> doesn't know this node yet." [Register this node there] | button | confirmation | VIS-019 |
| Different node | ID mismatch | Red dot; `red` "A different node answers at this address." [Change address] | button | Change address | VIS-019, VIS-020 |
| Not reachable | refused / timeout / name | Hollow dot; plain "Not reachable. <cause>" [Check again]; switch off+disabled if not registered | Check again | answers again | VIS-013, VIS-019 |
| Step not finished | partial run | `amber` "Turned on here, but not finished on <name>. <cause>" [Try again]; steps in details | Try again | confirmation | VIS-015 |
| Registered only by the other node | B has this node | Plain "<name> has registered this node. Its agents can reach this node once you turn collaboration on for <name>." [Turn on] | Turn on | confirmation | VIS-019 |
| Not collaborating | switch off | Grey icon; "Agents here can't work with <name> yet." [Turn on] | Turn on | confirmation | VIS-019 |
| This node off | This node's switch off | Section note; no warnings; dimmed row switches; details "Off on this node" | all | switch on | VIS-024 |
| Empty list | no other node | "No other nodes yet. Add one to open its window or let agents work with it." | add form | — | N/A (add form always shown) |
| Empty offer | node shares nothing | "<name> shares no Agents or Agent Teams." as the summary | open details | — | — |

## Content, Labels, Validation, And Feedback

- Product voice and wording conventions: short plain sentences, no "peer" or "fetch failed"; "remote collaboration" for the setting, "agents work together" for the effect; node names are shown as written. All strings: `localization/messages/en/nodesPage.ts` and `zh-CN/nodesPage.ts` (normative copy, English and Chinese). The 267 offer strings stay in `remoteCollaborationSettings.ts`.
- Exact labels, headings, and action text: "This node", "Remote collaboration", "How remote collaboration works", "Nodes", "Every node you use, listed once. Open its window, or let agents work with it.", placeholders "Address, for example http://localhost:8003" and "Name", "Add node", "Checking address…", tooltips "Remote collaboration: let agents on this node and on that node work together", "Open <name> in its own window", "Remove <name>", "Click to rename", buttons "Turn on there", "Register this node there", "Change address", "Check again", "Try again", "Turn on", dialog buttons "Cancel", "Turn on", "Make these changes", "Turn off", "Remove", "Close", "Try again", "Working…", "Use this", "Docker Guide".
- Empty, error, and recovery messages: see UXJ-704, UXJ-705 and State Behavior. Success never shows text.

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| Address | text | Yes | `host:port` with optional `http://`/`https://`; no path | Submit | "Enter an address like http://host:port." |
| Name (add, rename) | text | Yes | 1–64 characters, letters, digits, spaces, `_ . -`, starting with a letter or digit | Submit / Enter / click away | "Use 1–64 letters, digits, spaces, _ . or - (start with a letter or digit)." |
| Name (rename) | text | Yes | not used by another node (case-insensitive) | Enter / click away | "Another node is already named <name>." |
| Address (already listed) | text | — | same host:port or same node ID as a row | Submit | "This is <name>, already in your list." |
| Change address | text | Yes | the node answering must be the registered one | Save / Enter | "A different node answers there than the one registered." and the causes |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop | ≥ 768 px | add form on one line; row: text left, controls right; line and details under the name | as specified |
| Narrow | < 768 px (checked at 390 px) | add form stacks (Address, Name, switch, Add node); row controls wrap under the name; lines stack text then button; tab bar wraps as in the baseline | none |
| Desktop window on the embedded node | Electron context | Open icon shown | Open opens the window |
| Window on a Docker node | Electron, node ≠ embedded | "This node" is that node; the embedded node is a row | same |
| Browser | no desktop bridge | no Open icon | same |

## Accessibility And Keyboard Behavior

- Accessibility target: keyboard and screen-reader states as 267 (QR-703).
- Focus order, focus movement, and focus return: add form (Address, Name, switch, Add node), then rows in order (name, switch, Open, Remove, summary, line button). The confirmation moves focus to its confirm button when it opens; Esc cancels (or closes after a failure).
- Keyboard interaction: Enter submits the add form, saves a rename and saves an address; Esc cancels a rename, an address edit and the dialog; the summary line, switches and icon buttons are native buttons.
- Roles, names, states, and live announcements: switches are `role="switch"` with `aria-checked` and the name "Let agents work with <name>"; the status dot is an image with the label "Reachable now / Not reachable now / Checking"; icon buttons carry accessible names equal to their tooltips; lines under rows are `aria-live="polite"`; the dialog is `role="dialog" aria-modal` with its title; field errors are `role="alert"` with `aria-invalid`.
- Contrast: text and boundaries use the product's slate/amber/red/emerald values on white or their 50-tint fills; status is never colour alone (✓ ⚠ ✗ ⓘ marks and words).

## Motion And Transitions

- Existing conventions: `transition-colors`, `transition-transform` (150 ms) for switches and the summary chevron; row highlight fades over 700 ms; spinners `animate-spin`. No other motion.
- Reduced-motion behavior: unchanged from the baseline (spinners and transitions are the only motion).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| The nodes' servers | Reachability, node ID, switch, peers, offers, causes | `prototype/nodes/nodeWorld.ts` answers by address with scripted delays (illustrative nodes, IDs, addresses and offers) | Real calls and identity pinning; this node's server may ask the other node on the window's behalf (architecture) |
| Address resolution | "reaches this node at …", the unique name, the hint | Candidates tried in order, kept when the node ID matches; names made unique with " 2" | The Naming Rule and Loopback Hint Surface of `design-spec.md` |
| Desktop list | Add, rename, remove, Open | host mock registry; entries remember the node ID | `nodeRegistryStore` change; `addRemoteNode` must not open the window |
| Docker detection | the hint | scripted per node | server-computed `loopbackInContainer` |

## Final Visual Reference Inventory

Images are under `tickets/done/one-nodes-tab/visual-references/` (captured in a desktop Chromium at the stated viewport, device scale 1, after the user's approval and the final check). Every visible detail is normative except what the last column marks illustrative.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UIS-001 default, desktop window | 1440×900 | `VIS-001-nodes-default-desktop-1440x900.png` | This node card, add form with switch, one working row, summary line | node names, addresses, IDs, agent names |
| VIS-002 | UIS-003 filled | 1440×900 | `VIS-002-add-form-filled-desktop-1440x900.png` | form content, switch on | text typed |
| VIS-003 | UIS-004 turn on (DEC-709 b) | 1440×900 | `VIS-003-confirm-turn-on-desktop-1440x900.png` | grouped lines, address line, note, buttons | names |
| VIS-004 | UIS-004 running | 1440×900 | `VIS-004-confirm-running-desktop-1440x900.png` | ✓ and spinner, "Working…" | — |
| VIS-005 | Counts under the bar | 1440×900 | `VIS-005-agents-teams-under-bar-desktop-1440x900.png` | row after turn on, summary lines, no notice | agent names |
| VIS-006 | Details open | 1440×900 | `VIS-006-details-open-desktop-1440x900.png` | 267 list and Agent Teams column | agent names |
| VIS-007 | How remote collaboration works | 1440×900 | `VIS-007-how-it-works-open-desktop-1440x900.png` | rules text | — |
| VIS-008 | Turn off | 1440×900 | `VIS-008-confirm-turn-off-desktop-1440x900.png` | plain list and note | names |
| VIS-009 | Remove | 1440×900 | `VIS-009-confirm-remove-desktop-1440x900.png` | list, red title and button | names |
| VIS-010 | Rename error | 1440×900 | `VIS-010-rename-error-desktop-1440x900.png` | field, message | text typed |
| VIS-011 | Duplicate | 1440×900 | `VIS-011-add-duplicate-desktop-1440x900.png` | message, highlighted row | names |
| VIS-012 | Validation | 1440×900 | `VIS-012-add-validation-desktop-1440x900.png` | both messages | text typed |
| VIS-013 | Not reachable on add | 1440×900 | `VIS-013-add-unreachable-desktop-1440x900.png` | hollow dot, line, disabled switch, no notice | names, address |
| VIS-014 | Partial result | 1440×900 | `VIS-014-confirm-partial-failed-desktop-1440x900.png` | ✓ ✗ ○, summary, Close / Try again | — |
| VIS-015 | Row step not finished | 1440×900 | `VIS-015-row-step-not-finished-desktop-1440x900.png` | amber line with Try again | — |
| VIS-016 | Finish connecting | 1440×900 | `VIS-016-confirm-finish-desktop-1440x900.png` | remaining lines only | — |
| VIS-017 | Finished | 1440×900 | `VIS-017-finished-desktop-1440x900.png` | row working | — |
| VIS-018 | Docker hint in the dialog | 1440×900 | `VIS-018-docker-address-hint-desktop-1440x900.png` | red hint block, Use this, Docker Guide | addresses |
| VIS-019 | All row states | 1440×1560 | `VIS-019-all-row-states-desktop-1440x1560.png` | every state's dot, line, button, switch and icon | all names/addresses |
| VIS-020 | Connection details and Change address | 1440×1560 | `VIS-020-connection-details-change-address-desktop-1440x1560.png` | directions, editor, footer | all |
| VIS-021 | Register there, address shown, numbered name | 1440×1560 | `VIS-021-confirm-register-there-address-desktop-1440x1560.png` | lines and notes | names |
| VIS-022 | Turn on there | 1440×1560 | `VIS-022-confirm-turn-on-there-desktop-1440x1560.png` | lines | names |
| VIS-023 | Stop | 1440×1560 | `VIS-023-confirm-stop-desktop-1440x1560.png` | lines | names |
| VIS-024 | This node off | 1440×900 | `VIS-024-this-node-off-desktop-1440x900.png` | note, dimmed switches, details | names |
| VIS-025 | Docker window | 1440×900 | `VIS-025-docker-window-default-1440x900.png` | This node = docker, embedded row | names |
| VIS-026 | Docker window loopback hint | 1440×900 | `VIS-026-docker-window-loopback-hint-1440x900.png` | editor and hint | addresses |
| VIS-027 | Browser, no Open | 1440×900 | `VIS-027-browser-no-open-1440x900.png` | no Open icon, alignment | names |
| VIS-028 | Chinese, all states | 1440×1560 | `VIS-028-zh-CN-all-row-states-1440x1560.png` | Chinese copy and layout | names (not translated) |
| VIS-029 | Chinese confirmation | 1440×1560 | `VIS-029-zh-CN-confirm-1440x1560.png` | Chinese dialog | names |
| VIS-030 | Narrow all states | 390×2400 | `VIS-030-narrow-all-row-states-390x2400.png` | stacked layout | names |
| VIS-031 | Narrow confirmation | 390×2400 | `VIS-031-narrow-confirm-390x2400.png` | dialog at 390 px | names |

## Linked UI Reference Evidence

- Runnable UI reference: the design repository root (`corepack pnpm dev --port <port>`), entry `/nodes?nodeTab=manage`.
- Ticket record: `tickets/done/one-nodes-tab/product-ticket.md`
- Run instructions: `ui-reference-runbook.md`, section `one-nodes-tab` (scenario and context selection, addresses to try).
- Relevant supporting artifacts: `design-change-log.md` (DC-701 … DC-723), `design-assumptions.md`, `product-ticket.md`.
- Journey, transition, or scenario IDs: UXJ-701…710, TR-701…715, scenarios `nodes_user`, `nodes_states`, contexts `electron_internal`, `electron_external`, browser.
- Mocked boundaries and limitations: see "Data, Contract, And Mock Boundaries" and `design-assumptions.md`.

## Implementation Fidelity Boundary

- Exact behavior and visible design implementation must preserve: everything in the screenshots and in this specification: one row per node, the control set and order, the icon, the one-line problem rows with one fixing button, the confirmation's content and grouping, the silent success rule, the copy in `nodesPage.ts`.
- UI reference state, fixtures, and simulated mechanisms that do not prescribe production architecture: `nodeWorld.ts`, `nodeListStore.ts`, the scripted delays, the scenario keys.
- Fixture content or visible details explicitly allowed to vary: node names, addresses, IDs, agent and team names, descriptions, delays, timestamps.
- Permitted responsive or platform variation: the stacking below 768 px as shown; the browser's native input look.
- Existing design-system constraints: the Nodes page cards, buttons, the switch and the 267 offer view are reused; the dialog follows the product's confirmation frame.

## Out Of Scope

- Starting or messaging remote runs; Memory Sync, Phone Setup, Docker Guide, NFS Guide; polling; authentication; this node's own shared-agent list; a toast or notice on success.

## Open Decisions And Risks

- **Requirement impacts for the Solution Designer** (decided in this review; each replaces or adds to the requirements text):
  1. REQ-704 / DEC-707 / BEH-701: collaboration is **on by default** in the add form (ticked switch), and still confirmed once (QR-702 holds); the user can switch it off to only list and open a node.
  2. BEH-701 "Open preserved" / `nodeStore.addRemoteNode`: adding a node **does not open its window**.
  3. REQ-710: Remove also removes this node's registration on the other node when it can be reached; the confirmation lists it; when it cannot, the list entry is removed and the result says this node stays registered there.
  4. DEC-709: decided by delegation, option (b): "8003 finds this node's address once it is on."; the address is shown when that node's collaboration is already on.
  5. REQ-703 / BEH-707: a node's Agents and Agent Teams are shown only once collaboration with it is on, as the 267 summary line under the row (answers open question 1).
  6. DEC-706: Open for a node only this node knows appears once this window reaches its address; its first Open adds a desktop entry.
  7. REQ-706: the row line has these kinds: off there, not registered there, a different node (red dot), not reachable, step not finished (Try again), registered only by the other node (Turn on), not collaborating (Turn on); "checking" shows as a spinner dot and "up to 20 seconds".
  8. REQ-714: the page says "remote collaboration" and "How remote collaboration works"; no "peer" wording.
  9. A row's name is the peer name when it is a peer, the desktop label otherwise (DEC-705); this node is registered on the other node under this node's row name, made unique with " 2", " 3" and shown in the confirmation.
- Risks: a node whose address only another node can use (for example `host.docker.internal`) is shown not reachable by this window while agents may still reach it (the line then offers Check again and Change address); the reference does not model it. Peers are not authenticated (RSK-401/701); the confirmation says so.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes` (revision in `product-ticket.md`)
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes` (empty list and empty offer are not reachable in the reference: the add form is always shown and no scripted node shares nothing; they are specified in text)
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
