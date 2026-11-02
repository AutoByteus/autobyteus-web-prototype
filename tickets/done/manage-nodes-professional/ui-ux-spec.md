# UI/UX Specification — manage-nodes-professional (Nodes → Manage Nodes, a professional look)

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: autobyteus-363, Product ticket `manage-nodes-professional` (`tickets/done/manage-nodes-professional/`)
- Related requirements revision ID: SR-001 (engineering `requirements-doc.md`)
- Related IDs: REQ-901…905, AC-901…905, BEH-900…908, DEC-901…904, SCN-901…903 (engineering ticket `/Users/normy/autobyteus_org/autobyteus-worktrees/manage-nodes-professional/tickets/in-progress/manage-nodes-professional/`)
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Review URL (during review): `http://127.0.0.1:4950/nodes?nodeTab=manage` (scenarios in `ui-reference-runbook.md`, section `manage-nodes-professional`)
- Explicit user-confirmation reference: the user's message "i approve. looks good now.", 2026-11-02, in the Product UI/UX Designer conversation, after one review round that also produced two changes the user asked about (the Open slot collapses in a browser, DC-912; the empty-offer sentence wraps, found in the final check, DC-913). He asked about showing the version in parentheses next to the name; that variant was **not built** and is not part of the approval (Alternatives, A1).
- Final check date: 2026-11-02

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web`, Nodes page, tab Manage Nodes
- Pinned source commit or revision: `3b9dc912a14a19029db500c7e6bde1eb30725fd4` for this surface (beta v1.5.11-beta.10, branch `codex/manage-nodes-professional`, read only at `/Users/normy/autobyteus_org/autobyteus-worktrees/manage-nodes-professional`). The baseline for the surface was refreshed to it by `WEB-BASELINE-REFRESH-015` (integrated at `8a71c842`); the whole-frontend pin stays `d74f75a`.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Accepted base: `8a71c842835bc4e67ba3f6eb0f7b3e5e60bcffa2`; UI reference revision: see `product-ticket.md` ("Final Integration")
- Ticket folder: `tickets/done/manage-nodes-professional/`
- Baseline report path: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md` (section "Scoped refresh WEB-BASELINE-REFRESH-015")
- Authority split: the 268 spec (`tickets/done/one-nodes-tab/ui-ux-spec.md`) and the 305 design stay normative for **behavior, states, transitions, validation and copy meaning**. This spec replaces their **look** (layout, hierarchy, spacing, controls, how state and actions read) for the Manage Nodes tab. Where this spec and 268 differ on appearance, this spec wins.

## Problem And Design Rationale

- User problem and intent: "the manage nodes page UI should definitely be improved. It looks very unprofessional if you look at it." (2026-11-01, beta.10). He named no single defect; the design found them (below).
- Diagnosis of the beta.10 page (screenshot `user-screenshot-2026-11-01-beta10.png`; details in `design-review-notes.md`):
  1. A node row stacked four text lines in four styles (name, mono address, a body-weight "Server …" line, a summary with a long name list), about 160 px tall, with no columns and about 780 px of empty space between identity and controls: rows did not scan.
  2. The version line (autobyteus-305, no Product pass) was the darkest, largest line under the address and related to nothing.
  3. The right cluster mixed four control idioms (bare icon, switch, two 40 px bordered icon boxes) and the icon-and-switch had no label.
  4. The summary ended in a hard-cut list of names.
  5. "This node" had an inverted hierarchy (small heading, larger name, blue pill, grey mono box) and a 170-character explanation measure with its switch at the far edge.
  6. The two cards, the add band and the row notices each had a different frame and shape.
- Key UX decisions and why:
  - **One row anatomy with fixed columns** (who · server · offer · collaboration · actions), so a list of nodes scans like a table. The columns follow the width of the Nodes card, so narrow windows stack in a fixed order instead of drifting.
  - **One control language.** The remote-collaboration icon and its switch are one capsule (green when on, grey when off), the same in every row and in the add form. Open and Remove are quiet 32 px icons with no boxes (they were rejected as text buttons and as a ⋯ menu in 268, so they stay icons).
  - **One notice shape** for every line under a row: the checking line, the fixing line (with its one button), and the server result and blocker lines. A 16 px tone icon, text, one small white button; tone is amber, red, slate or green. The old ✓ ⚠ ✗ ⓘ text marks are replaced by the same icons everywhere (row notices, connection details, Docker hint, duplicate message).
  - **The version is a quiet column** ("Server 1.5.11-beta.10", 13 px slate-600), and "Update to …" is a small blue chip under it; progress and restarting show in the same cell. Nothing about the update changed except where it sits.
  - **Names no longer trail the offer summary.** The collapsed row says "7 Agents · 2 Agent Teams" only; the names are the button's tooltip and the full list is in the panel that opens.
  - **Calmer frames.** Both cards share one frame (white, slate-200, rounded-2xl, shadow-sm); "This node" loses its blue border and its pill; the Nodes header is white; the add form is a slate-50 band.
  - **The offer list and connection details open in one framed panel** under the row, so they read as part of the row.
- Alternatives considered and why rejected:
  - A1. The version in parentheses next to the name (the user's question). Cleaner for the common row, but the update chip, progress, restarting, "Not reachable. Last known …" and "Newer than this app" still need a place, so a column would remain; a long name would also push the version out. **Not built; the user approved without it.** The Solution Designer may take it as a follow-up option.
  - A2. Column headings above the list: needs new labels in two languages (DEC-903 forbids new messages).
  - A3. A card per node: wastes width for many nodes.
  - A4. A plain switch with no icon: simpler, but an unlabeled switch in a row; kept the capsule.
  - A5. Reintroducing a ⋯ menu, text buttons, a row chevron, an "Added" toast, or an "Agents" switch label: rejected by the user in 268; not used.
- Finding reported to the Solution Designer (not changed here; behavior): in a **browser window** (no desktop list of nodes), a node that is listed only because it is registered for collaboration disappears from the list when its collaboration is turned off and confirmed (the dialog says it stays in the list). In the desktop window the row stays. The unmodified baseline and the shipped store behave the same.

## Scope And Experience Goal

- User or actor: the owner of the desktop app and his nodes.
- Context: Settings → Nodes → Manage Nodes: a desktop window on the embedded node, a window on a Docker node, a browser (no Open), English and Chinese, narrow windows.
- Goal: the same page, every function and state unchanged, presented as one consistent, professional design.
- Observable success: the delivered page matches VIS-001…037 (AC-901), with every function of BEH-901…908 working (AC-902).
- In-scope surfaces: This node card, the Nodes card (header, add form, rows, notices, panel), the server version/update cell, the connection details and Docker hint (look only). Out of scope: the confirmation dialog's look and content (product frame, unchanged), the Memory Sync, Phone Setup, Docker Guide and NFS Guide tabs, the tab bar, any behavior, data or server.
- Non-goals: new information, new functions, new or removed messages.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-901, AC-901, BEH-900 | The redesigned look | all VIS |
| REQ-902, AC-902, BEH-901…908 | Every function and state remains, same meaning and outcome | UXJ-901…905, VIS-001…037 |
| REQ-903, AC-903 | Rare states designed | checking VIS-003; each line kind VIS-002; partial VIS-028/029; Docker hint VIS-024; update offer/progress/restarting/notices VIS-015…022, 037; not reachable VIS-002, 037; empty list VIS-026; empty offer VIS-027; this node off VIS-005 |
| REQ-904, AC-904 | Every context | Docker window VIS-023/024; browser VIS-025; zh-CN VIS-030…032, 036; narrow VIS-033…036 |
| REQ-905, AC-905 | Presentation only | see "Implementation Fidelity Boundary" |

## Visual Language

- Existing product language preserved: Tailwind slate/blue/emerald/amber/red palette, product sans, rounded-2xl white cards with `border-slate-200 shadow-sm`, blue-600 primary button, the 24×44 px emerald/slate switch, the product confirmation frame (unchanged), focus rings `ring-2 ring-blue-500` (red for Remove), the Integrations page's chip and notice conventions.
- Layout structure and hierarchy: page content `max-w-7xl`, `space-y-6` between the two cards. Order: (1) This node card, (2) Nodes card: header, add band, rows (each with optional notices and an optional panel).
- **This node card** (`rounded-2xl border-slate-200 bg-white shadow-sm`, no blue border):
  - Identity block `px-5 pb-4 pt-5`: overline "This node" `text-xs font-semibold uppercase tracking-wide text-slate-500`; name `text-lg font-semibold leading-7 text-slate-900` (mt 6 px); type tag beside it `rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize leading-4 text-slate-600`; address under it `font-mono text-xs text-slate-500` (break-all).
  - Collaboration block `border-t border-slate-100 px-5 py-4`: one header row, `justify-between gap-4`: left a 36 px tile (`rounded-lg`; on `bg-emerald-50 text-emerald-600`, off `bg-slate-100 text-slate-400`) with the 20 px collaboration icon and the title "Remote collaboration" `text-sm font-semibold`; right the status word `text-sm font-medium` (on `text-emerald-700`, off `text-slate-500`, saving `text-slate-600`) and the switch (24×44, emerald-500 / slate-300). Below, `mt-3 max-w-3xl text-sm leading-6 text-slate-500` the explanation; when off, `mt-3 max-w-3xl rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-5 text-slate-700` with the 16 px info icon `text-slate-400`; then the rules toggle `-ml-1.5 mt-2 rounded-md px-1.5 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900` with a 16 px chevron (rotates 90° when open); the rules panel `mt-2 max-w-3xl rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600`, a bulleted list `space-y-1 pl-5`.
- **Nodes card** (same frame, `overflow-hidden`; it is a CSS size container: `container-type: inline-size`):
  - Header `px-5 pb-4 pt-5`: title `text-base font-semibold text-slate-900`; description `mt-1 text-sm text-slate-500`.
  - Add band `border-y border-slate-200 bg-slate-50 px-5 py-3.5`; grid `[minmax(0,2fr) minmax(0,1fr) auto auto]`, gap 12 px (stacked below 768 px). Inputs `h-10 rounded-lg border-slate-300 bg-white px-3 shadow-sm`, focus `border-blue-500 ring-2 ring-blue-500/20`; the address text is `font-mono text-[13px]`, its placeholder and the name field are the product sans `text-sm text-slate-400`. The collaboration capsule at 40 px (`tall`). **Add node**: `h-10 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700`, a 16 px plus icon before the label; while checking, a 14 px white spinner replaces the plus. Field errors `mt-1.5 text-sm text-red-600`. Duplicate: `mt-3 flex gap-2 text-sm text-blue-700`, info icon.
  - List `divide-y divide-slate-100`. Empty list: `px-5 py-8 text-center text-sm text-slate-500`.
- **Row** (`px-5 py-3.5`; hover `bg-slate-50/60`; the new or duplicate row flash `bg-blue-50/70`, 2.5 s, fades over 700 ms). Cells and values:
  - Who: status dot (10 px, `mt` 5 px; checking = 12 px spinner) and the name `text-sm font-semibold leading-6 text-slate-900` (click to rename: `-mx-1.5 rounded-md px-1.5`, hover `bg-slate-100`, a 14 px pencil on hover/focus; rename field `h-7 rounded-md border-blue-400 px-2 text-sm font-semibold`, focus `ring-2 ring-blue-100`); under it the address `font-mono text-xs leading-4 text-slate-500` (break-all). The embedded node's name is plain text.
  - Server (remote nodes only): `text-[13px] leading-5 text-slate-600`. Version `tabular-nums`, truncated; **Update to …** chip `h-7 rounded-md border border-blue-200 bg-blue-50 px-2.5 text-xs font-medium text-blue-700 hover:bg-blue-100`; "Same version as this app" `text-xs text-slate-500` beside or under it; progress = 12 px spinner + text; restarting and not reachable `text-slate-500`; "Newer than this app. Update this app." `text-xs text-slate-500`.
  - Offer: a button `-ml-1.5 rounded-md px-1.5 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100`, a 16 px chevron `text-slate-400` (rotates 90° when open) and the summary ("7 Agents · 2 Agent Teams", "Connection details", or "<name> shares no Agents or Agent Teams."; wraps, never truncated). The names are its `title` tooltip. Shown only when collaborating and not checking.
  - Collaboration capsule: `h-9 rounded-full border pl-3 pr-2` with 10 px gap; on `border-emerald-200 bg-emerald-50`, off `border-slate-200 bg-white`; 20 px icon (`text-emerald-600` / `text-slate-400`) and the switch (emerald-500 / slate-300). Disabled: the switch `opacity-50`; this node off and row on: the whole capsule `opacity-60`. Tooltip: the collaboration hint, or "<name> is not reachable, so agents cannot start working with it yet." when disabled for that reason. The icon keeps `role="img"` with the hint as its label.
  - Actions: Open and Remove, 32 px square `rounded-md`, 18 px icons `text-slate-500`, hover `bg-slate-100 text-slate-900` (Remove: `bg-red-50 text-red-700`), gap 4 px. A slot is reserved for Open only when the host can open windows (so a browser shows no gap), and for Remove on the embedded node (so the icons stay in line).
  - Row grid (container query on the Nodes card; column gap 16 px, row gap 8 px; items align to the top, with 2 px/6 px offsets so the text baselines line up with the 36 px controls):
    - card ≥ 64 rem (1024 px): one line, columns `minmax(0,1.3fr) 16rem minmax(0,1fr) auto auto` = who · server · offer · collaboration · actions (VIS-001, VIS-002);
    - 38–64 rem: `1fr auto auto`: who · collaboration · actions, and under them server then offer (server indented 24 px);
    - below 38 rem (and every phone width): who + actions; then server; offer; collaboration capsule, each indented 24 px to the name.
- **Notices under a row** (indented to the name, `sm:pl-[2.75rem]`, `px-5` below 640 px; `space-y-2`; live region `polite`): `flex flex-wrap items-start justify-between gap-x-3 gap-y-2 rounded-lg border px-3 py-2 text-sm leading-5`; the icon (16 px) and text `flex-1 basis-56`; the one button `h-7 rounded-md border bg-white px-2.5 text-xs font-medium` (wraps under the text when the row is narrow). Tones: **error** `border-red-200 bg-red-50 text-red-900`, button `border-red-300 text-red-800 hover:bg-red-100`; **warn** `border-amber-200 bg-amber-50 text-amber-900`, button `border-amber-300 text-amber-900 hover:bg-amber-100`; **info** `border-slate-200 bg-slate-50 text-slate-700`, button `border-slate-300 text-slate-700 hover:bg-slate-50`; **ok** (update succeeded) `border-emerald-200 bg-emerald-50 text-emerald-900`. Icons: warn = triangle, error = circle with cross, info = circle with "i", ok = circle with check (`stroke 1.7`). The checking line is plain `text-sm leading-5 text-slate-500`. The server notice (update result, refusal, blocker) uses warn or ok; **Copy command** is the warn button (`title` = the command; label "Copied" for 2 s).
- **Panel** (open offer and connection details), under the row, indented as the notices: `rounded-xl border border-slate-200 bg-white p-4 shadow-sm`; the offer list (unchanged component: search above 6, two columns when both kinds exist), then `mt-4 border-t border-slate-100 pt-4` the connection details: direction rows `text-sm gap-y-2.5` (label `font-medium text-slate-800`, tone icon + status, `via` address in mono 12 px, **Change address** link), the address editor, unfinished steps (error icon), and a footer `border-t border-slate-100 pt-3 text-xs text-slate-500` with the node ID (mono) and "Checked hh:mm" plus the 28 px refresh button.
- **Docker hint**: unchanged block (`rounded-lg border-red-200 bg-red-50 px-3 py-2.5`), with the error icon in place of the ✗ text mark; its lines and buttons are indented 24 px under the icon.
- Typography: product sans throughout; mono only for addresses and the node ID.
- Hover, focus, disabled, validation: as above; every control keeps `focus-visible:ring-2 ring-blue-500`.

### New Or Changed Components

The UI reference location is traceability only; it does not prescribe the production implementation.

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| ThisNodeCard | Identity + collaboration header, explanation, off note, rules | on, off (note), saving, rules open | `components/settings/nodes/ThisNodeCard.vue` |
| NodeList | The Nodes card (container for row layout) | empty, populated | `components/settings/nodes/NodeList.vue` |
| AddNodePanel | Add band | idle, checking, field errors, duplicate | `components/settings/nodes/AddNodePanel.vue` |
| NodeRow | One node in the fixed columns, its notices and panel | every state of 268/305 | `components/settings/nodes/NodeRow.vue` |
| NodeCollaborationSwitch (new) | The collaboration capsule (icon + switch) | on, off, disabled, dimmed; 36/40 px | `components/settings/nodes/NodeCollaborationSwitch.vue` |
| NodeNoticeIcon (new) | The tone icon of notices, details and hints | info, warn, error, ok | `components/settings/nodes/NodeNoticeIcon.vue` |
| NodeServerUpdate | Server cell and server notice (two parts) | version, offer, progress, restarting, not reachable, newer, notices | `components/settings/nodes/NodeServerUpdate.vue` |
| RemoteCollaborationOfferToggle (new; replaces `RemoteCollaborationOfferDisclosure`) | The offer summary as the button that opens the panel | collapsed, open, empty offer | `components/settings/RemoteCollaborationOfferToggle.vue` |
| NodeConnectionDetails, NodeAddressHint | Panel contents | look only | same folder |
| NodeChangeDialog, RemoteCollaborationOfferList | Unchanged | — | — |

## Journey Inventory

The journeys, their steps, copy and outcomes are those of 268 (UXJ-701…710) and 305 (version and update). This package re-presents them; the walk-through below is the check that each still works.

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-901 | Owner, desktop window | `nodes_user` + `electron_internal` | Read this node and every node at a glance | VIS-001, VIS-002 | SCN-901, REQ-901 |
| UXJ-902 | Same | Same | Add 8003 once, confirm once (268 UXJ-701/702), duplicate, validation | VIS-007…011 | SCN-902, REQ-902 |
| UXJ-903 | Same | `nodes_states` | Fix what a row line says; change address; stop; remove; rename (268 UXJ-703…706) | VIS-002, 012…014, 028, 029 | SCN-903 |
| UXJ-904 | Same | `nodes_user`, `nodes_update_*` | Update a remote node's server (305) | VIS-015…022, 037 | SCN-903, REQ-903 |
| UXJ-905 | Docker window; browser; zh-CN; narrow | `electron_external`; no context; zh-CN; 390 px | Same page in every context | VIS-023…036 | REQ-904 |

## Journey Details

Each journey below was clicked through in the UI reference from `/nodes?nodeTab=manage` before the screenshots (final check, 2026-11-02).

- UXJ-901: the tab opens; every row is asked once (spinner dots and "Checking <name>… up to 20 seconds." VIS-003); rows settle at their own pace (VIS-002). This node's switch off: rows quiet, off note shown (VIS-005); "How remote collaboration works" opens the rules (VIS-006).
- UXJ-902: Add node with empty fields: both messages (VIS-007). `localhost:8001` again: "This is docker, already in your list." and the row flashes (VIS-008). `http://localhost:8003` + `8003`: "Checking address…", the row appears and the confirmation opens at once (VIS-009); Turn on shows each step running (VIS-010) and, on success, the dialog closes and the row shows its offer (VIS-011). `localhost:8005` goes away on its first write: the dialog keeps ✓ ✗ ○ with Close / Try again (VIS-028), and after Close the row keeps "Turned on here, but not finished on 8005. …" with Try again (VIS-029).
- UXJ-903: a working row's switch off opens "Stop agents working with docker?" (VIS-012); the trash icon opens "Remove docker?" (VIS-013); each row line's one button is as listed in VIS-002 (Turn on there, Register this node there, Change address, Check again, Turn on); a name click renames, an invalid name keeps the field and shows the message (VIS-014); Change address and the Docker hint are in VIS-024.
- UXJ-904: "Update to 0.1.0-prototype" starts the update; the cell shows "Starting the update…", "Checking the update to …", "Downloading …", "Preparing …", "Restarting…" (VIS-015…017), then "Server 0.1.0-prototype" and the green notice "Updated to 0.1.0-prototype." (VIS-018). A refusal shows the amber notice with **Copy command** (VIS-019); a failed download shows the amber notice and the offer again (VIS-020); an update already running when the page opens resumes in the cell (VIS-021); an unknown version shows "Server version unknown" (VIS-022); a node that stops answering shows "Not reachable. Last known: updating to …" (VIS-037); blocker and "Newer than this app" rows are in VIS-002.
- UXJ-905: Docker window (the embedded node is a row, "This node" is docker, VIS-023); browser (no Open, VIS-025); empty list (VIS-026); empty offer (VIS-027); Chinese (VIS-030…032); narrow (VIS-033…036).

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Manage Nodes tab | `/nodes?nodeTab=manage` | See and manage all nodes | This node card, Nodes card | VIS-001, VIS-002 |
| UIS-002 | Node row | inside Nodes | One node: state, version, offer, collaboration, open, remove | the five columns; notices; panel | VIS-002, VIS-015…022 |
| UIS-003 | Add band | top of Nodes | Add a node once | address, name, capsule, Add node | VIS-007…009 |
| UIS-004 | Confirmation dialog | switch, form, fixing buttons, trash | Confirm every change once | unchanged product frame | VIS-009, 010, 012, 013, 028, 031, 035 |
| UIS-005 | Panel (offer + connection details) | the row's offer button | Offer list, directions, Change address, steps | framed panel | VIS-004, VIS-024 |
| UIS-006 | Docker hint | under Change address, or in the dialog | Explain loopback in Docker | red block | VIS-024 |

## Interaction And State Transitions

Transitions TR-701…715 of 268 and the 305 update transitions are unchanged (same triggers, feedback, results, side effects). Only these presentation rules are new:

| Transition ID | Surface / From State | Trigger | Immediate Feedback | Resulting State |
| --- | --- | --- | --- | --- |
| TR-901 | UIS-002 | Card width crosses 64 rem or 38 rem | Columns reflow (the Nodes card, not the window, decides) | Same content, other layout |
| TR-902 | UIS-002 | Offer button | Chevron rotates; panel opens under the row; the summary stays | Panel open/closed (= 268 TR-710) |
| TR-903 | UIS-002 notice | Fix button | As 268 TR-712 | As 268 |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Visual ID |
| --- | --- | --- | --- | --- |
| Default, working node | Tab open | Green dot, version, offer button, green capsule, Open, Remove | all | VIS-001 |
| Checking | Open, add, Check again | Spinner dot; plain line "Checking <name>… up to 20 seconds."; capsule disabled | — | VIS-003 |
| Off there / not registered there | 268 | amber notice + one button | button | VIS-002 |
| Different node | 268 | red dot; red notice + Change address | button | VIS-002 |
| Not reachable | 268 | hollow dot; info notice with cause + Check again; capsule off, disabled | Check again | VIS-002 |
| Step not finished | partial run | amber notice + Try again; steps in the panel | Try again | VIS-029 |
| Registered only by the other node; not collaborating | 268 | info notice + Turn on | Turn on | VIS-002 |
| This node off | This node's switch | status "Off", off note; row capsules dimmed | switch | VIS-005 |
| Update offer / progress / restarting / result / refusal / failure / running / unknown / lost / blocker / newer | 305 | server cell and server notice as specified | Update to …, Copy command | VIS-002, VIS-015…022, VIS-037 |
| Empty list | no other node | "No other nodes yet. Add one to open its window or let agents work with it." | add band | VIS-026 |
| Empty offer | node shares nothing | the summary reads "<name> shares no Agents or Agent Teams." (wraps) | open panel | VIS-027 |

## Content, Labels, Validation, And Feedback

- All copy is that of `localization/messages/{en,zh-CN}/nodesPage.ts` and `remoteCollaborationSettings.ts` at `3b9dc912a1`; **no message is added, removed or reworded** by this design. The type tag is shown in sentence case ("Embedded", "Remote") by styling (`capitalize`), the overline "This node" in uppercase by styling.
- Validation, messages and feedback: unchanged (268 "Form And Input Validation").

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Wide | Nodes card ≥ 64 rem (about a 1440 px window with the sidebar) | one line per row, five columns | as specified |
| Medium | card 38–64 rem | who · capsule · actions; server and offer beneath | none |
| Narrow | card < 38 rem; checked at 390 px (VIS-033…036) | who + icons; server; offer; capsule; add band stacks (address, name, capsule, Add node); notice buttons wrap under their text; "This node" header row keeps the switch beside the title | none |
| Desktop window, embedded node | Electron | Open slot shown | Open opens the window |
| Window on a Docker node | Electron, node ≠ embedded | "This node" is that node; the embedded node is a row (no Remove) | same |
| Browser | no desktop bridge | no Open icon and **no reserved slot** | same |
| zh-CN | locale | same layouts; Chinese copy wraps inside the same cells | same |

## Accessibility And Keyboard Behavior

- As 268: switches `role="switch"` with `aria-checked` and the name "Let agents work with <name>"; the dot `role="img"` with its label; icon buttons have their tooltip as accessible name; notices `aria-live="polite"`; field errors `role="alert"` with `aria-invalid`; the dialog `role="dialog" aria-modal`.
- Focus order per row (DOM order): name, the update chip, the offer button, the capsule switch, Open, Remove, then the notice's button, then the panel. Esc cancels a rename, an address edit and the dialog; Enter saves.
- The capsule's icon is decorative-with-label (`role="img"`); status is never colour alone (words and tone icons).
- Contrast: text uses slate-500 or darker on white/slate-50; notices use the `-900` text on `-50` fills.

## Motion And Transitions

- Unchanged: `transition-colors` and `transition-transform` (150 ms) on switches, capsules and chevrons; row flash fade 700 ms; spinners `animate-spin`. No other motion.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| The nodes' servers and addresses | Reachability, ids, switch, offers, causes | `prototype/nodes/network-world.mjs` answers by address with scripted delays (illustrative nodes, ids, addresses, offers, versions) | Real calls (unchanged) |
| Server version and update | Version, offer, steps, notices | Scripted in `network-world.mjs`; an update plays in about 20 s (`nodes_update_*` scenarios) | The real update takes minutes and depends on the node image (305) |
| Desktop list | Add, rename, remove, Open | Host mock registry (`electron_*` contexts); none in a browser | `nodeRegistryStore` (unchanged) |
| `nodes_empty_offer` | Empty offer | docker shares nothing | — |

## Final Visual Reference Inventory

Images are in `tickets/done/manage-nodes-professional/visual-references/` (desktop Chromium, device scale 1, animations frozen, captured after the user's approval and the final check). Every visible detail is normative except what the last column marks illustrative.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- |
| VIS-001 | UIS-001 default, desktop window (`nodes_user`, `electron_internal`) | 1440×900 | `VIS-001-default-desktop-window-1440x900.png` | node names, addresses, ids, versions, agent counts; the port in this node's address |
| VIS-002 | Every row state (`nodes_states`) | 1440×2300 | `VIS-002-all-row-states-desktop-1440x2300.png` | same |
| VIS-003 | Checking | 1440×900 | `VIS-003-checking-desktop-1440x900.png` | same |
| VIS-004 | Offer list and connection details open | 1440×1500 | `VIS-004-offer-list-and-details-open-desktop-1440x1500.png` | names, descriptions, ids, time |
| VIS-005 | This node off | 1440×900 | `VIS-005-this-node-off-desktop-1440x900.png` | — |
| VIS-006 | "How remote collaboration works" open | 1440×900 | `VIS-006-how-it-works-open-desktop-1440x900.png` | — |
| VIS-007 | Add validation | 1440×900 | `VIS-007-add-validation-desktop-1440x900.png` | — |
| VIS-008 | Add duplicate | 1440×900 | `VIS-008-add-duplicate-desktop-1440x900.png` | typed text |
| VIS-009 | Confirm turn on | 1440×900 | `VIS-009-confirm-turn-on-desktop-1440x900.png` | names, addresses |
| VIS-010 | Confirm running | 1440×900 | `VIS-010-confirm-running-desktop-1440x900.png` | step timing |
| VIS-011 | Added and working | 1440×900 | `VIS-011-added-and-working-desktop-1440x900.png` | counts |
| VIS-012 | Confirm turn off | 1440×900 | `VIS-012-confirm-turn-off-desktop-1440x900.png` | — |
| VIS-013 | Confirm remove | 1440×900 | `VIS-013-confirm-remove-desktop-1440x900.png` | — |
| VIS-014 | Rename error | 1440×900 | `VIS-014-rename-error-desktop-1440x900.png` | typed text |
| VIS-015 | Update starting / checking | 1440×900 | `VIS-015-update-starting-checking-desktop-1440x900.png` | versions |
| VIS-016 | Update downloading | 1440×900 | `VIS-016-update-downloading-desktop-1440x900.png` | versions |
| VIS-017 | Update restarting | 1440×900 | `VIS-017-update-restarting-desktop-1440x900.png` | — |
| VIS-018 | Update succeeded | 1440×900 | `VIS-018-update-succeeded-desktop-1440x900.png` | versions |
| VIS-019 | Update refused, Copy command | 1440×900 | `VIS-019-update-refused-copy-command-desktop-1440x900.png` | the node's message text |
| VIS-020 | Update failed | 1440×900 | `VIS-020-update-failed-desktop-1440x900.png` | the node's message text |
| VIS-021 | Update already running at open | 1440×900 | `VIS-021-update-running-at-open-desktop-1440x900.png` | step shown |
| VIS-022 | Version unknown | 1440×900 | `VIS-022-version-unknown-desktop-1440x900.png` | — |
| VIS-023 | Docker window, default | 1440×900 | `VIS-023-docker-window-default-1440x900.png` | names, addresses |
| VIS-024 | Docker window, Change address and loopback hint | 1440×1100 | `VIS-024-docker-window-loopback-hint-1440x1100.png` | addresses, ids |
| VIS-025 | Browser, no Open | 1440×900 | `VIS-025-browser-no-open-1440x900.png` | — |
| VIS-026 | Empty list | 1440×900 | `VIS-026-empty-list-1440x900.png` | — |
| VIS-027 | Empty offer | 1440×900 | `VIS-027-empty-offer-desktop-1440x900.png` | — |
| VIS-028 | Partial result dialog | 1440×900 | `VIS-028-partial-result-dialog-desktop-1440x900.png` | cause text |
| VIS-029 | Step-not-finished row | 1440×1100 | `VIS-029-step-not-finished-row-desktop-1440x1100.png` | cause text |
| VIS-030 | zh-CN, every row state | 1440×2300 | `VIS-030-zh-CN-all-row-states-1440x2300.png` | node names |
| VIS-031 | zh-CN confirmation | 1440×900 | `VIS-031-zh-CN-confirm-1440x900.png` | — |
| VIS-032 | zh-CN update progress | 1440×1500 | `VIS-032-zh-CN-update-and-details-1440x1500.png` | versions |
| VIS-033 | Narrow, every row state | 390×4000 | `VIS-033-narrow-all-row-states-390x4000.png` | — |
| VIS-034 | Narrow, panel open | 390×1700 | `VIS-034-narrow-details-and-update-390x1700.png` | — |
| VIS-035 | Narrow, confirmation | 390×844 | `VIS-035-narrow-confirm-390x844.png` | — |
| VIS-036 | Narrow zh-CN, every row state | 390×4000 | `VIS-036-narrow-zh-CN-all-row-states-390x4000.png` | — |
| VIS-037 | Update lost: "Not reachable. Last known: …" | 1440×900 | `VIS-037-update-lost-not-reachable-last-known-desktop-1440x900.png` | — |

Notes: the window is a desktop shell with the product sidebar; the sidebar and tab bar are unchanged baseline. VIS-001 and VIS-025 show the address of this node as the simulated node's (`127.0.0.1:29695` vs `127.0.0.1:4823`): illustrative.

## Linked UI Reference Evidence

- UI reference: the design repository root at the integrated revision; run `corepack pnpm dev --port 4950`, entry `/nodes?nodeTab=manage`; starting states in `ui-reference-runbook.md` (`manage-nodes-professional`).
- Change log: `design-change-log.md` (DC-901…913). Review notes and diagnosis: `design-review-notes.md`.

## Implementation Fidelity Boundary

- Presentation only (AC-905): the engineering change touches `components/settings/nodes/*`, `RemoteCollaborationOfferDisclosure` (replaced by `RemoteCollaborationOfferToggle`), `NodeManager.vue` spacing, and no store, server, Electron registry, localization or stored format. The row grid uses a CSS size container; production may use any equivalent technique that reproduces the three layouts at the same card widths.
- Engineering note: `NodeServerUpdate` is rendered twice per remote row (cell and notice) with one `part` prop; only the cell asks the server. Tests that look for the version, update, progress and notice `data-testid`s keep their ids.

## Out Of Scope

Behavior, data or server changes; the browser-only disappearance finding above (reported, not changed); the Docker Guide and NFS Guide tabs (their baseline refresh is not done); Memory Sync and Phone Setup; the confirmation dialog's look.

## Open Decisions And Risks

- A1 (version beside the name) is an option the user raised; not decided, not built.
- The browser-context row disappearance (above) is for the Solution Designer.
- Risk: the real update runs for minutes (305); the reference compresses it to about 20 s.

## Final Consistency Check

Spec, UI reference and final screenshots agree (2026-11-02). Every VIS was captured from the running reference after the approval and the last two fixes (DC-912, DC-913); VIS-001 and VIS-004 were recaptured after the last fix, the others render identically.
