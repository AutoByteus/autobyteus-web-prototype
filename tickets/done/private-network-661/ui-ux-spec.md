# UI/UX Specification: Private Network, Tailscale first; Pair again; pair by address; the local network (autobyteus-661, Stage 2)

The final screenshots in `visual-references/` are normative. Every visible detail is requirements-defining unless this specification names it as illustrative (Final Visual Reference Inventory, Implementation Fidelity Boundary). Everything approved in extensions-ui-516 (`tickets/done/extensions-ui-516/ui-ux-spec.md`, VIS-T*) stays as approved unless this specification changes it.

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: Product ticket `private-network-661` for autobyteus-661 (package `autobyteus-661-private-network`; Solution Designer run `solution_designer_b2b085ced16d45479c46350d19ae49a2`)
- Related requirements revision ID: requirements-doc.md (Approved; REQ-001…REQ-019, UC-001…UC-012, AC-001…AC-013) and pairing-contract.md as of 2026-11-27
- Related requirement, behavior, acceptance-criteria, and decision IDs: D-1…D-6; REQ-001…REQ-019; AC-001…AC-013; design changes DC-091…DC-106; findings F-1…F-5 (answered)
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Review URL (during review): `https://normys-macbook-pro.tail0347f8.ts.net:8449/` (Tailscale Serve to `http://127.0.0.1:4661/`)
- Explicit user-confirmation reference: the founder's rule for this round, 2026-11-27, in his conversation with the Solution Designer: "Always start with the contract and validate each use case based on your data flow spine. If it works, then it's one approved". The Solution Designer walked UC-001…UC-012 through the contract (use-case-spines.md), found the screens match, and relayed: "round 1, including DC-091…DC-105 and the F-5 prompt, is approved" (2026-11-27). Earlier checks: workflow check (F-1…F-4), capture check (DC-102), D-6 walk-through.
- Final check date: 2026-11-27. Every journey below was clicked through on the ticket branch; final screenshots captured the same day.

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web`: Settings → Extensions (the Private Network card and its page) and Nodes → Manage Nodes
- Pinned source commit or revision: `origin/personal@b768c503f9` for Manage Nodes (read only). Checked against `origin/personal@41f6894d9d` (2026-11-26): no Nodes UI file changed; Settings → Extensions shipped the approved 516 frame.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- UI reference revision or commit: ticket branch `design/private-network-661`, base `personal@825434bc` (extensions-ui-516 integrated). The revision integrated into `personal` is recorded in `product-ticket.md`.
- Ticket folder: `tickets/done/private-network-661/` (after closure)
- Baseline report path: `ui-baseline-report.md` (design repository root) plus the accepted extensions-ui-516 design

## Problem And Design Rationale

- **User problem and intent:** Stage 2 builds the Private Network extension on Tailscale only (D-1). Every connection pairs with node keys (D-2). Pairings from before the update are paired again (D-3). The collaboration switch is gone (D-4). Someone else's node is paired by typing its address, then its owner accepts (D-5). Colleagues in one office find each other's nodes on the local network without Tailscale (D-6).
- **Key UX decisions and why:**
  - **Tailscale only, other choices hidden (DC-091).** A list with one live choice and greyed "later" choices gives the owner nothing to do now. The page goes straight to "Join your private network".
  - **Tailscale's own conditions are named (DC-092, DC-093).** One amber notice per condition on the page. The same text is the card's status line and This node's line. Signed out and expired hide My machines (this machine is not on the network).
  - **Pair again where the node already is (DC-094).** The row keeps its section; an amber "Paired before the update" mark and Pair again in the Pair column. No page-level banner: the marks go away by themselves.
  - **Pair by address lives in Paired nodes (DC-095).** Paired nodes lists other people's nodes, so the way to add one is there, as a band like Add a node above Controlled nodes. Control and pairing stay separate (founder, 516).
  - **Join first wherever an access code is pasted (DC-097, DC-100).** A code with a private-network address cannot work until this computer's node is on the private network.
  - **Local network: its own switch and its own Found section (DC-103…DC-105).** The two Found lists differ in what a row can say ("added by" vs. nothing) and in when they exist. A node found on both shows once, under the private network.
  - **Every local Found row offers Control and Pair (DC-104).** Without accounts AutoByteus cannot tell a colleague's node from one of the owner's own machines; the owner chooses.
  - **Ask before pairing over the local network (DC-106, F-5).** The other owner's answer, and later the peer's requests, come back to this node as new local connections.
- **Alternatives considered and rejected:** "later" network choices (no value now); pair by address inside Add a node (mixes control and pairing); a "Pairings were reset" banner (duplicates the row marks); one tagged Found list (a word on every row, empty-state and lead conflated); an "older AutoByteus" error for someone else's node (DESIGN.md rule 9 forbids version checks there, F-4); a trash/"forget" action on someone else's old pairing (Remove means giving up control, DC-102).

## Scope And Experience Goal

- **User or actor:** the owner of an AutoByteus desktop app and its nodes; colleagues and teammates as other nodes.
- **Context:** the desktop app's own window (embedded node); a window on another node (e.g. a Docker node on the private network).
- **Goal:** put a node on the owner's tailnet; handle Tailscale's conditions; pair again after the update; pair with someone else's node by address or from a Found list; find nodes on the local network.
- **Observable success:** each journey below reaches its completion state with the feedback in its references.
- **In-scope surfaces and journeys:** the Private Network card and page (Settings → Extensions); Manage Nodes: This node (Private network, Local network), Asking to pair, Controlled nodes (Add a node, rows), Paired nodes (Pair with someone else's node, rows), Found on your private network, Found on your local network.
- **Non-goals:** Headscale, hosting a network, NetBird, an AutoByteus-hosted network, a settings screen for your own VPN; production network, discovery, pairing and signing mechanisms.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-001, REQ-002, AC-001 | Card names Tailscale only; "Needs no administrator password"; Join your private network: Sign in with Tailscale / Use an auth key instead; joined: This machine, My machines | UXJ-101; VIS-P1-01…05 |
| REQ-015 | Waiting for approval; Your Tailscale sign-in expired (Sign in again); Signed out of Tailscale (Sign in again); Tailscale can't be reached (Trying again…); same text on the card and This node | UXJ-102; VIS-P1-04, P1-06…08, P1-11 |
| REQ-017 | Access rules block AutoByteus: notice naming the machines; "Blocked by access rules" in My machines, only for nodes this node controls or is paired with | UXJ-102; VIS-P1-09, N-01 |
| REQ-012, UC-010, AC-011 | Pairings from before the update keep their rows with "Paired before the update" and Pair again; own node one click; someone else's node Waiting / Cancel → Paired; older controlled node: Pair again disabled with "Update it, then pair again." | UXJ-103; VIS-P2-01…07, N-02, L-02 |
| REQ-008, UC-006, AC-007 | Pair with someone else's node (address); Waiting / Cancel / declined / did not accept / no node / controlled-node errors; "{name} at {address} wants to pair" with Accept / Reject | UXJ-104; VIS-P3-01…10, N-03 |
| REQ-010 | Join-first notice in Add a node, Needs connecting, Found → Control | UXJ-105; VIS-P4-01…03 |
| REQ-016 | Found: "shared by {account}" / "shared with you"; "its owner" texts | UXJ-106; VIS-P5-01, P5-02 |
| REQ-018, REQ-019, UC-012, AC-013 | Visible on my local network (off; Accept connections from this network?); Found on your local network ("{name} at {address}", Control, Pair, empty hint); a node on both shown once; Allow and pair before pairing over the local network | UXJ-107; VIS-P6-01…10, N-04, N-05, L-03, L-04 |
| REQ-009, D-4 (preserved from 516) | Unpair, Remove, Leave; no collaboration switch | UXJ-101 (Leave), 516 UXJ-018; VIS-P1-10 |

## Visual Language

- **Existing product language to preserve:** unchanged from extensions-ui-516 (white `rounded-2xl` cards, `border-slate-200`, `shadow-sm` on `bg-slate-50`; slate text scale; blue primary `bg-blue-600`; outline secondary `border-slate-300`; emerald for On / Paired; amber for warnings and attention; red for destructive and errors).
- **Layout structure and visual hierarchy:**
  - Manage Nodes, top to bottom: This node (identity; Private network; **Local network**; Controlled by; Create access code) · Asking to pair (only with requests) · Controlled nodes (Add a node above the list) · Paired nodes (**Pair with someone else's node** above the list) · Found on your private network (only when the private network is ready) · **Found on your local network** (always).
  - The Private Network page (the extension's own page): a condition notice first, then This machine, My machines (hidden when expired or signed out), then Leave.
- **Grid, dimensions, spacing and density:** as 516. The Pair with someone else's node band uses Add a node's band (`border-y border-slate-200 bg-slate-50 px-5 pb-4 pt-3.5`), a 26 rem address field (`h-10`) and the primary Pair button (`h-10`); stacked below 640 px. Local Found rows `px-5 py-3.5`, divided by `divide-slate-100`. Local network block in This node: heading `px-5 pt-4 pb-1`, switch row `px-5 pb-4 pt-2`.
- **Typography:** system stack; section titles `text-base font-semibold`; This node block headings `text-xs font-semibold uppercase tracking-wide text-slate-500`; body `text-sm`; captions `text-xs`; addresses `font-mono` (`text-xs` in rows, `text-[0.8125rem]` in fields; the outgoing request title `font-mono text-sm font-semibold`).
- **Color values and semantic roles:**
  - "Paired before the update": `bg-amber-50 text-amber-800` mark; the older-version line `text-amber-800`.
  - Condition notices on the page: `background #fffbeb`, `border #fde68a`, text `#78350f`; the approval notice stays blue (`#eff6ff` / `#bfdbfe` / `#1e40af`).
  - "Blocked by access rules": dot `#f59e0b`, text `#b45309`.
  - Join-first and "Accept connections from this network?": `border-amber-200 bg-amber-50 text-amber-900`; the join-first line inside an existing amber notice is text only (no second box) with a blue link.
  - Outgoing request dot `bg-slate-300`; local Found dot `bg-emerald-500`.
- **Surfaces, borders, radii, shadows and layering:** as 516.
- **Controls, icons and imagery:** the pairing icon on Pair / Pair again in node rows and on the band's Pair button; Found rows (both networks) use text-only outline buttons, as in 516. The local switch is the 516 switch (44×24, emerald when On, "On"/"Off" label).
- **Hover, active, focus, selected, disabled, validation and feedback:** as 516. Disabled Pair again `opacity-50` with the reason in its tooltip. Field errors red with `role="alert"`. In-progress: spinner + "Pairing…", "Reaching the node…", "Waiting for its owner to accept", "Trying again…".

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Private Network page | The extension's own page, Tailscale only | not joined (sign in / auth key); signing in; waiting for approval; joined; sign-in expired; signed out; unreachable; access rules block; leave confirmation | `prototype/extensions/extensionPages.ts` (`PRIVATE_NETWORK_PAGE`) |
| Private Network card status | Card message and This node line | as above, extension status text | `stores/privateNetworkStore.ts` (`status`) |
| Node row: Pair again | A pairing from before the update | own: Pair again → Pairing… → Paired; older: disabled + note; teammate: Pair again → (Accept connections…) → Waiting + Cancel → Paired | `components/settings/nodes/NodeRow.vue` |
| Pair with someone else's node | Pair by address | empty; reaching; ask to accept local connections; errors | `components/settings/nodes/PairByAddressPanel.vue` |
| Outgoing request row | This node's request by address | waiting + Cancel; declined + Pair again + remove | `components/settings/nodes/NodeList.vue` |
| Asking to pair (by address) | "{name} at {address} wants to pair" | request; accepting | `components/settings/nodes/PrivateNetworkCard.vue` (part `requests`) |
| Join-first notice | REQ-010 | box (Add a node); inline line (Needs connecting, Found → Control) | `components/settings/nodes/NodeJoinFirstNotice.vue` |
| Found (private network) | shared machines | shared by; shared with you; "its owner" waiting / declined | `PrivateNetworkCard.vue` (part `found`) |
| Local network block | "Visible on my local network" | off; Accept connections from this network?; on with "Visible as …" | `components/settings/nodes/LocalNetworkVisibility.vue` |
| Found on your local network | Nodes announcing on this network | list; Accept connections… (Pair); waiting; declined; Control form; empty | `components/settings/nodes/LocalNetworkFoundCard.vue`, `LocalAllowPrompt.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-101 | Owner, own window | Private Network installed, not joined | Join with Tailscale (sign in or auth key); see this machine and my machines; leave | Joined; left | UC-001, REQ-001, REQ-002, AC-001 |
| UXJ-102 | Owner | Joined or joining | Understand and recover from Tailscale's conditions | Approved / signed in again / back online / rules fixed | UC-001, UC-011, REQ-015, REQ-017 |
| UXJ-103 | Owner after the update | Three pairings from before the update | Pair them again | Paired (own one click; teammate after Accept; older after Update) | UC-010, REQ-012, AC-011 |
| UXJ-104 | Owner and the other node's owner | No private network needed | Pair with someone else's node by its address | Paired (teammate), or declined / not accepted | UC-006, REQ-008, AC-007 |
| UXJ-105 | Owner | A code with a private-network address; this computer's node not on it | Understand why it cannot be used yet | Set up / Open Private Network | UC-003, REQ-010 |
| UXJ-106 | Owner | Joined; a teammate's machine shared with the owner | Pair with it | Waiting → Paired (teammate) | UC-005, REQ-016 |
| UXJ-107 | Owner and colleagues on one office network | Local network | Be visible; find colleagues' nodes; pair; control one of yours | Visible; paired; controlled | UC-012, REQ-018, REQ-019, AC-013 |

## Journey Details

- **UXJ-101:** Settings → Extensions → Private Network → Show settings. Not joined: "Join your private network" — "This node joins your tailnet as a machine of its own. Only AutoByteus uses the connection: nothing else on this computer changes, and AutoByteus is never opened to the internet." → **Sign in with Tailscale** ("Opens Tailscale's sign-in page in your browser. Sign in with the account your other machines use.") → "Finish signing in to Tailscale in your browser. This page continues by itself." with Open the sign-in page again / Cancel → joined. Or **Use an auth key instead** → Auth key field + Join, hint about untagged one-time keys, "Sign in instead". Joined: This machine (`home-mac 100.88.10.10 Tailscale · alex@example.com`), My machines (Name, Private address, Added by, State; tagged and shared machines marked), footnote. Leave this private network → "Leave this private network?" — "{machine} signs out of your tailnet. Its pairings over the private network stop working. After it joins again, pair those nodes again." (+ "It stays listed in your Tailscale admin console until you remove it there." while expired, signed out or unreachable) → Leave / Cancel. VIS-P1-01…05, P1-10.
- **UXJ-102:** each condition is a notice at the top of the page, the card's status line, and This node's line with Open Private Network (VIS-P1-11):
  - Waiting for approval (blue, spinner): "Waiting for approval in your Tailscale admin console. Your tailnet approves new machines by hand: an admin approves {machine} under Machines. This page continues by itself."
  - Sign-in expired: "Your Tailscale sign-in expired." — "{machine} can't reach your other machines, and they can't reach it. To keep it signed in, turn off key expiry for {machine} in the Tailscale admin console." → **Sign in again**. My machines hidden.
  - Signed out: "Signed out of Tailscale." — "{machine} was signed out or removed in your Tailscale admin console, so it is not on your private network." → **Sign in again**. My machines hidden.
  - Unreachable: "Tailscale can't be reached." — "This computer may be offline. Nodes already connected keep working for a while." + spinner "Trying again…" (no button; recovers by itself).
  - Access rules: "Your tailnet's access rules block AutoByteus." — "{machines} is/are online, but this node can't reach AutoByteus on it/them. In the Tailscale admin console, under Access controls, let your machines reach each other." The card stays On; its status: "Connected as {machine}, but your tailnet's access rules block AutoByteus on {machines}."; My machines State "Blocked by access rules".
- **UXJ-103:** Manage Nodes after the update (VIS-P2-01): docker and linux-box in Controlled nodes, bob-laptop in Paired nodes, each with "Paired before the update".
  - linux-box (controlled, current): Pair again → "Pairing…" → Paired · Unpair, "Agents on both nodes can work together." (VIS-P2-02, P2-03).
  - docker (controlled, older): Pair again disabled; "docker runs an older AutoByteus. Update it, then pair again."; the row's existing "Update to 0.1.0-prototype" → "Updated to 0.1.0-prototype." → Pair again enabled (VIS-P2-01, P2-04).
  - bob-laptop (someone else's): Pair again → when this node does not accept local-network connections, "Accept connections from this network?" → Allow and pair → "Waiting for its owner to accept" + Cancel → Paired, "Teammate · peer only" (VIS-P2-05…07). No Open, no Remove, no server version on this row. If the other node does not accept: "{address} did not accept the pair request. Check that it runs the latest AutoByteus." (specified, not scripted on this row).
- **UXJ-104:** Paired nodes → Pair with someone else's node: Address ("Address, for example 192.168.1.20:29695") + **Pair**; hint "Its owner accepts on that node. Pairing never gives control of either node." (VIS-P3-01).
  - A local address while this node does not accept local-network connections: "Accept connections from this network?" — "To pair, this node must accept connections from this local network: the other owner's answer comes back here. Fine for home and office networks, not for public Wi-Fi." → Allow and pair / Cancel (VIS-P3-02).
  - "Reaching the node…" → a row with the address and "Waiting for its owner to accept" + Cancel (VIS-P3-03) → Paired, "Teammate · peer only" (VIS-P3-04); or "Its owner declined." + Pair again + remove (VIS-P3-05).
  - Errors: "{address} did not accept the pair request. Check that it runs the latest AutoByteus." (P3-06); "No AutoByteus node answers at {address}. Check the address, and that the node is running." (P3-07); "{name} is one of your controlled nodes: pair it with Pair on its row." (P3-08; "Pair again" variant for a pairing from before the update); "{name} is already paired with this node."; "That is this node."; "Enter the node's address, for example 192.168.1.20:29695."
  - The other node: Asking to pair — "dana-mac at 192.168.1.30:29695 wants to pair" — "Accepting pairs it as a teammate: its agents can work with the agents this node shares. It never gets control of this node." → Accept ("Pairing…") → Paired nodes; or Reject (VIS-P3-09, P3-10). Shown with or without Private Network.
  - Unpair of a pairing made by address: "Unpair {name}? It leaves your list; to work together again, one of you pairs by address again."
- **UXJ-105:** "This access code is for a node on your private network ({address}). This computer's node must join your private network first." with **Set up Private Network** (not installed) or **Open Private Network** (installed, not on the network). Add a node: amber box under the form, Add node disabled (VIS-P4-01). Needs connecting row and Found → Control: one line inside the row's amber notice, Connect / Add disabled (VIS-P4-02, P4-03). A private-network address is in 100.64.0.0/10 or fd7a:115c:a1e0::/48.
- **UXJ-106:** Found on your private network: "{address} · shared by dana@other.example" and "dana@other.example's node: pairs as a teammate when they accept, never with control" (VIS-P5-01); when Tailscale does not report the account: "shared with you", "Someone else's node: pairs as a teammate when its owner accepts, never with control", "Waiting for its owner to accept", "Its owner declined" (VIS-P5-02).
- **UXJ-107:**
  - This node → Local network → "Visible on my local network" (off) — "Other AutoByteus nodes on this local network see this node's name and address and can ask to pair with it. Nothing outside this network sees it." (VIS-P6-01). Turning it on while this node does not accept connections from this local network: "Accept connections from this network?" — "To be visible, this node must accept connections from this local network. Fine for home and office networks, not for public Wi-Fi." → **Allow and make visible** / Cancel (VIS-P6-02) → On, "Visible as {name} at {address}" (VIS-P6-03). The switch is shown with or without Private Network.
  - Found on your local network: lead "AutoByteus nodes visible on this local network that are in neither list above. Nobody's account is known here: pair with a colleague's node when its owner accepts, or control one of yours with its access code."; Look again. Rows "{name} at {address}" with **Control** and **Pair** (VIS-P6-04).
  - Pair → (Accept connections from this network? → Allow and pair) → "Waiting for its owner to accept" + Cancel → the node moves to Paired nodes ("Teammate · peer only"), or "Its owner declined" + Pair again (VIS-P6-05…07, P6-09).
  - Control → "You did not add this node to AutoByteus. Check that the machine is really yours before you paste its access code." + Access code field + Add / Cancel; the hint as in 516; no join-first (the code carries a local address) (VIS-P6-08).
  - Empty: "No AutoByteus nodes visible on this network. A colleague's node appears here when they turn on Visible on my local network. Some office Wi-Fi blocks this: then type its address under Pair with someone else's node." (VIS-P6-01).
  - Both networks on: two sections; a node found on both appears once, under Found on your private network (VIS-P6-10).

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-101 | Private Network card and page | `/settings?section=extensions`, Show settings | Join the tailnet; handle conditions; leave | card (status line), condition notice, This machine, My machines, Leave | VIS-P1-*, N-01, L-01 |
| UIS-102 | This node | `/nodes?nodeTab=manage` | Identity; private and local visibility; Controlled by; Create access code | identity, Private network, Local network, Controlled by | VIS-P1-11, P6-02, P6-03, N-05, L-04 |
| UIS-103 | Controlled nodes | same | Add a node; rows with Pair / Pair again | header, Add a node, rows | VIS-P2-01…04, P4-01, P4-02, N-02 |
| UIS-104 | Paired nodes | same | Pair with someone else's node; teammate rows; outgoing requests | header, band, rows | VIS-P2-05…07, P3-*, P6-09, N-03, L-02 |
| UIS-105 | Asking to pair | same | Accept / Reject (network or address) | blue-bordered card | VIS-P3-09 |
| UIS-106 | Found on your private network | same (private network ready) | Control own machines; pair others | header, Look again, rows | VIS-P4-03, P5-* |
| UIS-107 | Found on your local network | same (always) | Control / Pair nodes on this network | header, Look again, rows or empty | VIS-P6-01, P6-04…08, P6-10, N-04, L-03 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-101 | Page / not joined | Sign in with Tailscale | "Finish signing in…" (spinner) | Joined (or Waiting for approval) | network program login (provisional) | Leave |
| TR-102 | Page / not joined | Auth key → Join | "Joining…" | Joined, or the key error | join with key | — |
| TR-103 | Page / waiting for approval | admin approves (actor: Tailscale admin) | page continues by itself | Joined | — | — |
| TR-104 | Page / expired or signed out | Sign in again | "Finish signing in…" | Joined | re-login (provisional) | — |
| TR-105 | Page / unreachable | Tailscale back (actor: network) | "Trying again…" | Joined | — | — |
| TR-106 | Page / joined | Leave → Leave | spinner | Not joined | logout; pairings over the network stop | Sign in |
| TR-107 | Controlled row / Paired before the update | Pair again | "Pairing…" | Paired | grant + `/pair` (own node) | Unpair |
| TR-108 | Controlled row / older | Update to … | Restarting… → "Updated to …" | Pair again enabled | node-update | Pair again |
| TR-109 | Paired row / before the update (teammate) | Pair again | (Accept connections…) → "Waiting for its owner to accept" + Cancel | Paired (teammate) | `/pair` with `requestId` → `/pair-accepted` | Unpair |
| TR-110 | Pair with someone else's node | Pair | (Accept connections…) → "Reaching the node…" → outgoing row Waiting | Paired / declined / error | `/pair` by address | Cancel, Pair again |
| TR-111 | Outgoing row / waiting | Cancel | row gone | none stored; a later Accept is refused | outstanding request dropped | — |
| TR-112 | Asking to pair (by address) | Accept / Reject | "Pairing…" / row gone | Paired nodes row / none | `/pair-accepted` / `/pair-rejected` | Unpair |
| TR-113 | Add a node / Needs connecting / Found → Control | paste a private-network code | join-first notice; Add / Connect disabled | unchanged | — | Set up / Open Private Network |
| TR-114 | Local network / off, not accepted | switch | "Accept connections from this network?" | — | — | Allow and make visible, Cancel |
| TR-115 | same | Allow and make visible | spinner | On, "Visible as …" | allowed-local-network setting on; DNS-SD announce | switch off |
| TR-116 | Local network / on | switch off | Off | not announced | announcement withdrawn | switch on |
| TR-117 | Local Found row | Pair | (Accept connections… → Allow and pair) → Waiting + Cancel | Paired nodes row / "Its owner declined" + Pair again | `/pair` by address (§4b) | Cancel |
| TR-118 | Local Found row | Control → code → Add | "Reaching the node at …", "Connecting to … as its owner…" | Controlled nodes row | setup exchange | Pair |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Card / not on the network | installed, not joined | status "Not on your private network yet. Sign in with Tailscale below." | Sign in | — | VIS-P1-01 |
| Card / signing in | sign-in opened | "Waiting for the sign-in to finish in your browser." | Open the sign-in page again, Cancel | — | VIS-P1-02 |
| Page / expired | key expiry | notice (UXJ-102), My machines hidden | Sign in again, Leave | — | VIS-P1-06 |
| Page / signed out | signed out or removed | notice, My machines hidden | Sign in again, Leave | — | VIS-P1-07 |
| Page / unreachable | Tailscale unreachable | notice with "Trying again…" | Leave | recovers by itself | VIS-P1-08 |
| Page / access rules | node unreachable through rules | notice; State "Blocked by access rules" | — | fix rules in the admin console | VIS-P1-09 |
| Paired nodes / empty | none | "No paired nodes of other people yet." | Pair with someone else's node | — | VIS-P3-01 |
| Found on your local network / empty | nothing announces | empty text (UXJ-107) | Look again | pair by address | VIS-P6-01 |
| This node / not ready | Tailscale condition | the card's status line in amber + Open Private Network | Open | — | VIS-P1-11 |

## Content, Labels, Validation, And Feedback

- **Product voice:** as 516: short plain sentences; "Pair", "Pair again", "Accept", "Reject", "Cancel", "Unpair", "Control", "Allow and pair", "Allow and make visible". "Its owner" where no account is known.
- **Exact labels, headings, action text and messages:** the UI reference's catalogs are the authority: `localization/messages/{en,zh-CN}/extensionsDesign.ts` (keys `nodes.privateNetwork.*`, `nodes.pairAgain.*`, `nodes.pairByAddress.*`, `nodes.localNetwork.*`, `nodes.nodeCode.needsJoin`), the extension's page texts in `prototype/extensions/extensionPages.ts` (with its zh-CN table), and the status messages in `stores/privateNetworkStore.ts`. Quotes in this specification come from them.
- **Changed approved texts:** the card description ("Connect your AutoByteus nodes through your Tailscale account. AutoByteus is never opened to the internet. Needs no administrator password; downloads about 30 MB on install."); the teammate line ("{account}'s node: pairs as a teammate when they accept, never with control"); "No paired nodes of other people yet."; the Leave text (UXJ-101).
- **Removed texts:** Headscale, hosting, invites, own VPN (page and This node), "older AutoByteus" for someone else's node.
- **The extension's own status messages** stay as the extension gives them (English), as in 516.

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| Pair with someone else's node · Address | text, mono | yes | `host[:port]`, optional `http(s)://`; port defaults to 29695 | Pair | "Enter the node's address, for example 192.168.1.20:29695." |
| same | — | — | not this node | Pair | "That is this node." |
| same | — | — | not a node in Controlled nodes | Pair | "{name} is one of your controlled nodes: pair it with Pair on its row." / "…with Pair again on its row." |
| same | — | — | not already paired | Pair | "{name} is already paired with this node." / "{name} is already in your list: pair it with Pair again on its row." |
| same | — | — | an AutoByteus node answers | after reaching | "No AutoByteus node answers at {address}. Check the address, and that the node is running." |
| same | — | — | the node accepts the request | after reaching | "{address} did not accept the pair request. Check that it runs the latest AutoByteus." |
| Access code (Add a node, Needs connecting, Found → Control) | text | — | a private-network address needs this computer's node on the private network | on paste | join-first notice (UXJ-105) |
| Private Network page · Auth key | text, mono | yes | `tskey-auth-…` accepted by Tailscale | Join | "Tailscale did not accept that auth key: it may be mistyped, used or expired. Make a new one in the admin console under Settings → Keys." |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Wide | ≥ 1280 px | as 516; the band: address field 26 rem + Pair in one row | — |
| Narrow / phone | < 640 px | the band stacks (field, full-width Pair, hint); outgoing and Found rows put their buttons below the text; the Local network switch keeps its label on one row with the switch, help text full width (VIS-N-01…05) | — |
| Window on another node | `electron_external` | This node is that node; the join-first check is about this computer's own node | — |
| My machines on narrow pages | < 560 px | Private address and Added by columns hidden (as 516) | — |

## Accessibility And Keyboard Behavior

- As 516. New: the local switch is `role="switch"` with `aria-checked` and `aria-labelledby` ("Visible on my local network"). "Accept connections from this network?" is `role="alertdialog"` with its title as label; buttons in order Allow…, Cancel. Status lines (`role="status"`): waiting, declined, Pairing…, join-first. Errors `role="alert"`. Pair again's name "Pair again with {name}"; its disabled reason in the tooltip.

## Motion And Transitions

- As 516 (spinners with `motion-reduce` variants; the 2.5 s row highlight when a node lands in a list).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Tailscale network program | sign-in, approval, expiry, signed out, unreachable, machine list, shared machines | scripted (`stores/privateNetworkStore.ts`); approval after ~10 s, back online after ~12 s | **Provisional:** real sign-in, approval and expiry texts; a shared machine's account; how blocking by access rules is detected (shown only for nodes this node controls or is paired with) |
| Pairing (pairing-contract §1–§5) | Pair, Pair again, Accept, Reject, Cancel, Unpair | scripted by address: 192.168.1.30 accepts, .40 declines, .50 does not accept, others no node | node keys, `/pair` with `requestId`, `/pair-accepted`, `/pair-rejected`, signed `/pair-confirm`, `/unpaired` |
| Transition (D-3) | rows "Paired before the update" | seed `autobyteus.prototype.pairing=after_update` | sealed migration of peers.json; synthesized data only (AC-011) |
| Version of a controlled node | the older-node note | the node-update connection (today's) | only for controlled nodes (DESIGN.md rule 9) |
| Local discovery (§4b) | Visible on my local network; Found on your local network | seed `autobyteus.prototype.localDiscovery` (`office`, `allowed`, `visible`) | DNS-SD `_autobyteus._tcp`; **provisional:** finding across two computers (proved on one Mac) |
| Allowed local network | Accept connections from this network? | in memory | the existing per-network setting (Phone Setup's "Wi-Fi/LAN allowed on this network") |
| Desktop relay (G1) | join-first; Add a node with a private address | the rule only | **Provisional:** the desktop reaching a private address through its own node |
| Phone over mobile data | — | not drawn | **Provisional** (PoC 2a) |
| "Design reference only" controls | Found → Control "paste {name}'s code" | dashed boxes | **Not product UI: do not build** |

## Final Visual Reference Inventory

Viewport: `1440w` / `390w` are element captures at that window width (the element's full height); `WxH` are viewport captures. Illustrative throughout: node, machine and account names, addresses, ports, codes, versions, agent counts, dates.

| Visual ID | Journey / Surface / State | Viewport | Image Path |
| --- | --- | --- | --- |
| VIS-P1-01 | UXJ-101 · not joined, sign in | 1440w | `visual-references/VIS-P1-01-not-joined-sign-in-1440w.png` |
| VIS-P1-02 | UXJ-101 · signing in | 1440w | `visual-references/VIS-P1-02-signing-in-1440w.png` |
| VIS-P1-03 | UXJ-101 · auth key | 1440w | `visual-references/VIS-P1-03-auth-key-1440w.png` |
| VIS-P1-04 | UXJ-102 · waiting for approval | 1440w | `visual-references/VIS-P1-04-waiting-for-approval-1440w.png` |
| VIS-P1-05 | UXJ-101 · joined | 1440w | `visual-references/VIS-P1-05-joined-1440w.png` |
| VIS-P1-06 | UXJ-102 · sign-in expired | 1440w | `visual-references/VIS-P1-06-sign-in-expired-1440w.png` |
| VIS-P1-07 | UXJ-102 · signed out | 1440w | `visual-references/VIS-P1-07-signed-out-1440w.png` |
| VIS-P1-08 | UXJ-102 · Tailscale unreachable | 1440w | `visual-references/VIS-P1-08-tailscale-unreachable-1440w.png` |
| VIS-P1-09 | UXJ-102 · access rules block | 1440w | `visual-references/VIS-P1-09-access-rules-block-1440w.png` |
| VIS-P1-10 | UXJ-101 · leave confirmation | 1440w | `visual-references/VIS-P1-10-leave-confirmation-1440w.png` |
| VIS-P1-11 | UXJ-102 · This node, sign-in expired | 1440w | `visual-references/VIS-P1-11-this-node-sign-in-expired-1440w.png` |
| VIS-P2-01 | UXJ-103 · Manage Nodes after the update | 1440×1800 | `visual-references/VIS-P2-01-manage-nodes-after-update-1440x1800.png` |
| VIS-P2-02 | UXJ-103 · controlled, pairing | 1440w | `visual-references/VIS-P2-02-controlled-pairing-1440w.png` |
| VIS-P2-03 | UXJ-103 · controlled, paired again | 1440w | `visual-references/VIS-P2-03-controlled-paired-again-1440w.png` |
| VIS-P2-04 | UXJ-103 · older node updated, Pair again enabled | 1440w | `visual-references/VIS-P2-04-older-node-updated-pair-again-enabled-1440w.png` |
| VIS-P2-05 | UXJ-103 · teammate, accept local connections | 1440w | `visual-references/VIS-P2-05-teammate-allow-local-network-1440w.png` |
| VIS-P2-06 | UXJ-103 · teammate, waiting | 1440w | `visual-references/VIS-P2-06-teammate-waiting-1440w.png` |
| VIS-P2-07 | UXJ-103 · teammate, paired | 1440w | `visual-references/VIS-P2-07-teammate-paired-1440w.png` |
| VIS-P3-01 | UXJ-104 · Pair with someone else's node | 1440w | `visual-references/VIS-P3-01-pair-with-someone-elses-node-1440w.png` |
| VIS-P3-02 | UXJ-104 · accept local connections first | 1440w | `visual-references/VIS-P3-02-allow-local-network-first-1440w.png` |
| VIS-P3-03 | UXJ-104 · waiting for its owner | 1440w | `visual-references/VIS-P3-03-waiting-for-its-owner-1440w.png` |
| VIS-P3-04 | UXJ-104 · accepted, paired | 1440w | `visual-references/VIS-P3-04-accepted-paired-1440w.png` |
| VIS-P3-05 | UXJ-104 · declined | 1440w | `visual-references/VIS-P3-05-declined-1440w.png` |
| VIS-P3-06 | UXJ-104 · did not accept | 1440w | `visual-references/VIS-P3-06-did-not-accept-1440w.png` |
| VIS-P3-07 | UXJ-104 · no node answers | 1440w | `visual-references/VIS-P3-07-no-node-answers-1440w.png` |
| VIS-P3-08 | UXJ-104 · a controlled node | 1440w | `visual-references/VIS-P3-08-a-controlled-node-1440w.png` |
| VIS-P3-09 | UXJ-104 · the other node: wants to pair | 1440×900 | `visual-references/VIS-P3-09-other-node-wants-to-pair-1440x900.png` |
| VIS-P3-10 | UXJ-104 · the other node: accepted | 1440w | `visual-references/VIS-P3-10-other-node-accepted-1440w.png` |
| VIS-P4-01 | UXJ-105 · Add a node, join first | 1440w | `visual-references/VIS-P4-01-add-node-join-first-1440w.png` |
| VIS-P4-02 | UXJ-105 · Needs connecting, join first | 1440w | `visual-references/VIS-P4-02-needs-connecting-join-first-1440w.png` |
| VIS-P4-03 | UXJ-105 · Found → Control, join first | 1440w | `visual-references/VIS-P4-03-found-control-join-first-1440w.png` |
| VIS-P5-01 | UXJ-106 · shared by | 1440w | `visual-references/VIS-P5-01-found-shared-by-1440w.png` |
| VIS-P5-02 | UXJ-106 · shared, account unknown, waiting | 1440w | `visual-references/VIS-P5-02-found-shared-account-unknown-waiting-1440w.png` |
| VIS-P6-01 | UXJ-107 · Manage Nodes, local network off, empty | 1440×2200 | `visual-references/VIS-P6-01-manage-nodes-local-network-off-1440x2200.png` |
| VIS-P6-02 | UXJ-107 · Allow and make visible | 1440w | `visual-references/VIS-P6-02-allow-and-make-visible-1440w.png` |
| VIS-P6-03 | UXJ-107 · visible on local network | 1440w | `visual-references/VIS-P6-03-visible-on-local-network-1440w.png` |
| VIS-P6-04 | UXJ-107 · Found on your local network | 1440w | `visual-references/VIS-P6-04-found-on-local-network-1440w.png` |
| VIS-P6-05 | UXJ-107 · Pair, accept local connections | 1440w | `visual-references/VIS-P6-05-pair-allow-local-network-1440w.png` |
| VIS-P6-06 | UXJ-107 · Pair, waiting | 1440w | `visual-references/VIS-P6-06-pair-waiting-1440w.png` |
| VIS-P6-07 | UXJ-107 · Pair, declined | 1440w | `visual-references/VIS-P6-07-pair-declined-1440w.png` |
| VIS-P6-08 | UXJ-107 · Control with access code | 1440w | `visual-references/VIS-P6-08-control-with-access-code-1440w.png` |
| VIS-P6-09 | UXJ-107 · paired, in Paired nodes | 1440w | `visual-references/VIS-P6-09-local-pair-accepted-paired-nodes-1440w.png` |
| VIS-P6-10 | UXJ-107 · both networks overview | 1440×3700 | `visual-references/VIS-P6-10-both-networks-overview-1440x3700.png` |
| VIS-N-01 | phone · Private Network page (access rules) | 390w | `visual-references/VIS-N-01-phone-private-network-page-390w.png` |
| VIS-N-02 | phone · Controlled nodes after the update | 390×844 | `visual-references/VIS-N-02-phone-controlled-after-update-390x844.png` |
| VIS-N-03 | phone · Paired nodes (declined row) | 390w | `visual-references/VIS-N-03-phone-paired-nodes-390w.png` |
| VIS-N-04 | phone · Found on your local network | 390w | `visual-references/VIS-N-04-phone-found-on-local-network-390w.png` |
| VIS-N-05 | phone · This node, both switches | 390w | `visual-references/VIS-N-05-phone-this-node-both-switches-390w.png` |
| VIS-L-01 | zh-CN · Private Network, signed out | 1440w | `visual-references/VIS-L-01-zh-private-network-signed-out-1440w.png` |
| VIS-L-02 | zh-CN · Paired nodes after the update | 1440w | `visual-references/VIS-L-02-zh-paired-nodes-after-update-1440w.png` |
| VIS-L-03 | zh-CN · Found on your local network | 1440w | `visual-references/VIS-L-03-zh-found-on-local-network-1440w.png` |
| VIS-L-04 | zh-CN · This node, local network | 1440w | `visual-references/VIS-L-04-zh-this-node-local-network-1440w.png` |

Requirements-defining in every reference: layout, section order, copy, controls, states. The "Design reference only" box in VIS-P4-03 and VIS-P6-08 is a review aid, not product UI.

## Linked UI Reference Evidence

- **Runnable UI reference:** the design repository `personal` (after integration): `corepack pnpm install --ignore-workspace --frozen-lockfile && corepack pnpm dev --port 4661`. Starting states: `ui-reference-runbook.md`, section private-network-661.
- **Ticket record:** `product-ticket.md`
- **Supporting artifacts:** `design-change-log.md` (DC-091…DC-106), `review-round-1.md` (answers, checks, findings F-1…F-5), interim captures `review-captures/round-1/` (not normative).
- **Journey, transition and scenario IDs:** UXJ-101…UXJ-107, TR-101…TR-118.
- **Limitations:** the docker node's in-place update is scripted; the teammate's "did not accept" on a Pair again row is specified, not scripted; the Docker-node local-network case (cannot announce, REQ-019) is specified, not drawn.

## Implementation Fidelity Boundary

- **Must preserve:** Tailscale as the only network choice; the condition notices and their copy; Pair again on the node's own row (one click for controlled nodes; Accept for others; disabled with the note for an older controlled node); Pair with someone else's node in Paired nodes; the join-first rule everywhere a code is pasted; "Accept connections from this network?" before visibility and before pairing over the local network; two Found sections, a node on both shown once under the private network; Control and Pair on local Found rows; no version check for someone else's node; everything preserved from 516.
- **Does not prescribe production architecture:** the stores, seeds, timings, simulated networks, locally generated codes.
- **Illustrative:** names, addresses, ports, accounts, codes, versions, counts, dates.
- **Permitted responsive variation:** exact breakpoints may follow production container widths, keeping the narrow order and wrapping of VIS-N-*.
- **Existing design-system constraints:** Tailwind classes and colors as in the product; existing notice, switch and dialog patterns.

## Out Of Scope

- Headscale, hosting, NetBird, an AutoByteus-hosted network; a settings screen for your own VPN; the Shared Folder extension (Stage 3).

## Open Decisions And Risks

- None open for the UI. Provisional, drawn but not proved (PoC 2a on the founder's devices): real Tailscale sign-in, approval and expiry; a shared machine's account; how blocking by access rules is detected; the desktop relay (G1); the phone over mobile data; finding on the local network across two computers.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes` (except the teammate "did not accept" on a Pair again row and the Docker-node local case, specified in text)
- Every section covers the affected scope or is marked: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality without placeholders, clipping, overlap, or drift: `Yes`
- Every visible detail is requirements-defining unless marked illustrative: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
