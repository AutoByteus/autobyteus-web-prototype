# UI/UX Specification — Phone Setup wording for a node on another computer (autobyteus-426, item 16)

A text specification: **no layout, style, control or flow changes**. The Phone Setup panel (Nodes › Phone Setup, "Phones") keeps every dimension, color and control of the approved autobyteus-395 design (`tickets/done/one-step-phone-pairing/ui-ux-spec.md`); only the strings below change, and only in the window of a node on another computer.

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: Project Task `autobyteus-426`, item 16, package `small-follow-ups-batch-426`; Product ticket `phone-setup-remote-node-wording`
- Related requirements revision ID: `SR-001` (round 2)
- Related IDs: REQ-016, BEH-016, SCN-011, E-16 (Solution Designer's `requirements-doc.md`, `investigation-notes.md`); decisions DEC-A (the wording) and DEC-B (the extension to How it works and the Wi-Fi-allowed note) of the Product ticket
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Review URL (while the review server ran): `http://127.0.0.1:3426/nodes?nodeTab=phoneSetup`
- Explicit user-confirmation reference: the user's "approved" in the Product UI/UX Designer's conversation, 2026-11-07, answering the review message that listed the full wording and asked DEC-B (recommended yes); both DEC-A and DEC-B are approved
- Final check date: 2026-11-07
- Item 15 ("Update <node> to connect a phone", older server): not designed. Dropped by the Solution Designer under the project's DESIGN.md rule 9 (message of 2026-11-07).

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-worktrees/small-follow-ups-batch-426` (branch `codex/small-follow-ups-batch-426`), read only
- Selected product surface: desktop Nodes › Phone Setup (`components/settings/phone/PhoneWayTab.vue`, `utils/phoneAccess/phoneConnectionWays.ts`, strings `autobyteus-web/localization/messages/en/settings.ts:305-324, 332-336, 359-377`)
- Pinned source revision: the 426 branch as read on 2026-11-07; its status lines equal the approved 395 spec's Content section
- Accepted design base: `34677c88cae86b25b0c600ece322857626c43e67` (`origin/personal`)
- UI reference revision: ticket commit `83b765f4` plus the finalization commit (see the integration record in `product-ticket.md`)
- Ticket folder: `/Users/normy/autobyteus_org/autobyteus-web-design/tickets/done/phone-setup-remote-node-wording/`
- Baseline report: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md` (existing, accepted; not refreshed — the changed panel is a design component and its strings equal the source)

## Problem And Design Rationale

- Problem: in the window of a node on another computer, the not-ready lines said "this computer" (e.g. "No VPN found on this computer. Connect it, then Check again."). Users read it as their desktop, but the line was about the node. Evidence: autobyteus-395 `evidence/API-10-remote-node.txt` §5.
- Decision: in a remote node's window the node is always **named**, and "this computer" always means the desktop (the check is made from the desktop: an address counts only when it answers there with the node's ID).
- Alternatives rejected: (a) drop "from this computer" and say only "isn't reachable" (loses who checks); (b) "the node"/"this node" instead of its name (the window can list several nodes; the name is what the user chose); (c) change only the not-ready lines (the ready lines and the "How it works" fold right beneath would still say "this computer" for the node, contradicting the new line — DEC-B).

## Scope And Experience Goal

- Actor/context: desktop user, in a node's window of kind `remote` (a node whose address is not on this computer: `recognizeNodeKind` = `remote`).
- Goal: every line that speaks of a computer says which one.
- In scope: the status line of Same Wi-Fi or LAN, Tailscale and Your VPN (ready and not ready); the "Still not reachable" note after Check again; the "no network" message; the Wi-Fi-allowed note; the How it works text of those three ways.
- Non-goals: the Docker/embedded text (unchanged), the Company address text (already says "this node"), the phone and Android screens, the code view, the update state of older nodes (item 15, dropped).

## Related Requirements And Acceptance Criteria

| ID | UI/UX Obligation | Covered Surface / State |
| --- | --- | --- |
| REQ-016 / BEH-016 / SCN-011 | Not-ready lines (and ready lines) worded for the remote node, per way | UIS-001; VIS-001…009 |
| Constraint | Embedded and local-container nodes keep today's text | UIS-001 (kind rule) |

## Visual Language

Unchanged — follows baseline (autobyteus-395 spec: Phones panel). Text uses the existing classes of each line (status 14px/24px medium, green when ready and slate when not; note 14px slate-500; fold 14px). Longer lines wrap inside the existing width; the VPN not-ready line takes two lines at 1059 px (VIS-002) and nothing clips or overlaps.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Phones panel status line, note, blocked message, How it works, Wi-Fi-allowed note | Say which computer | node kind `remote` vs other; way × ready/not ready | `components/settings/phone/PhoneConnectPanel.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Desktop user in a remote node's window | Phone Setup opens; some or no way reached | Understand which way works for that node | Reads node-named lines; Check again gives a node-named note | REQ-016 |

## Journey Details

**UXJ-001.** Entry: Nodes › Phone Setup in the window of a remote node. The panel opens as today (ways are checked from the desktop; the best ready way is selected). Each tab shows its line below. A not-ready Tailscale or VPN tab has **Check again**: "Checking…", then the note under the line. A Wi-Fi/LAN tab that is ready asks "Allow phones on this network?" the first time; afterwards the allowed row's note is the remote one. When the node reports no address at all, the message above the tabs is the remote "no network" message. No step is added or removed. Visuals: VIS-001…009.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Phones panel in a remote node's window | `/nodes?nodeTab=phoneSetup` | Show a code; wording names the node | Same as 395 | VIS-001…009 |

## Interaction And State Transitions

| Transition ID | Surface / From State | Trigger | Immediate Feedback | Resulting State | Next Actions |
| --- | --- | --- | --- | --- | --- |
| TR-001 | Remote, Tailscale/VPN not ready | Check again | "Checking…" about 1 s (reference timeline) | Note under the line (copy below), or ready | Check again, other tabs |

All other transitions: Unchanged — follows baseline.

## State Behavior and Content

`{{name}}` = the node's name as the desktop lists it (illustrative in the reference: "Office Mac"). Text is English source; the app localizes it. Apostrophes are typographic (’). **Rule of use: a node of kind `remote` uses the "Remote" column; kind `embedded` and `local_container` use today's text (the "Today" column, unchanged).** Suggested key scheme (engineering decides): the existing keys with a `.remote` sibling, e.g. `settings.components.settings.phone.status.remote.<way>.<ready|notReady>`.

### Status lines (UIS-001; VIS-001, 004, 005, 007, 008)

| Way | State | Today (embedded, local container) | Remote |
| --- | --- | --- | --- |
| Same Wi-Fi or LAN | ready | This computer is on a Wi-Fi or LAN network. | {{name}} is reachable on a Wi-Fi or LAN address from this computer. |
| Same Wi-Fi or LAN | not ready | This computer isn’t on a Wi-Fi or LAN network. | {{name}} isn’t reachable on a Wi-Fi or LAN address from this computer. |
| Tailscale | ready | Ready: Tailscale is on, on this computer. | Ready: {{name}} is reachable through Tailscale from this computer. |
| Tailscale | not ready | Not set up yet. | {{name}} isn’t reachable through Tailscale from this computer. |
| Your VPN | ready | Ready: a VPN is connected on this computer. | Ready: {{name}} is reachable through a VPN from this computer. |
| Your VPN | not ready | No VPN found on this computer. Connect it, then Check again. | {{name}} isn’t reachable through a VPN from this computer. Connect both to your VPN, then Check again. |
| Company address | ready / not ready | Ready: an address is set up for this node. / Not set up yet. | Unchanged (already says "this node") |

### Notes after Check again (VIS-002, 003)

| Way | Today | Remote |
| --- | --- | --- |
| Tailscale | Still not found. Tailscale isn’t on, on this computer. | Still not reachable. Tailscale must be on for {{name}} and for this computer. |
| Your VPN | Still no VPN found. | Still not reachable through a VPN. |
| Same Wi-Fi or LAN, Company address | Still not found. | Unchanged (these tabs have no Check again, so the note does not show) |

### No address at all (VIS-009)

| Today (embedded) | Remote |
| --- | --- |
| This computer isn’t on a network a phone could use. Connect it to your Wi-Fi or VPN, then try again. | {{name}} isn’t on a network a phone could use. Connect it to Wi-Fi or a VPN, then try again. |

The Docker message "{{name}} isn’t reachable from other devices. Publish its port on this computer’s network, then try again." is unchanged (local container only).

### Wi-Fi-allowed note (VIS-006)

Title unchanged ("Wi-Fi/LAN allowed on this network"). Note — today: "This network. Applies to every node on this computer. We ask again on a new network."; remote: "This network. {{name}} remembers it. We ask again on a new network." (the remote node keeps the answer itself — 395 API-10 §2).

### How it works for a remote node (VIS-006, 007, 008)

Only the lines below change; every other line (When for Tailscale, Safety for VPN, the whole Company address fold, the Get Tailscale link) is unchanged.

| Way | Part | Remote |
| --- | --- | --- |
| Same Wi-Fi or LAN | line | Your phone talks to {{name}} directly over your local network, like two devices at home. |
| | When | Your phone and {{name}} are on the same Wi-Fi or LAN, such as a home or office network. |
| | Safety | …(as today)… Works only while the phone is on the same network as {{name}}. |
| Tailscale | line | Tailscale builds a private, encrypted connection between your phone and {{name}}, wherever they are. |
| | Setup (not ready, two steps) | 1. Install Tailscale (free) on {{name}}, on this computer and on your phone. Get Tailscale. 2. Sign in to the same account on all three, and keep it on. |
| | Setup (ready) | Install Tailscale (free) on {{name}}, on this computer and on your phone, sign in to the same account on all three, and keep it on. AutoByteus finds it by itself. |
| | Safety | The connection is encrypted between your phone and {{name}}, and only devices signed in to your Tailscale account can reach it. |
| Your VPN | line | Your VPN puts your phone and {{name}} in the same private network. |
| | When | You already use your own VPN that connects your phone and {{name}}. |
| | Setup | Connect {{name}}, this computer and your phone to the VPN. AutoByteus finds it by itself. |

### Other behavior of a remote node's panel (already in the product; shown in the reference)

The Tailscale tab's Advanced › "Secure web address" is not offered for a remote node (the product offers it only for nodes on this computer). No design change.

### Long or empty names

A long name wraps with the line; no truncation. A node always has a name in the desktop's list, so no fallback text is specified.

## Content, Labels, Validation, And Feedback

Product voice: plain words, the node by name, "this computer" only for the desktop. Form validation: N/A (no field changes). Button labels: Unchanged — follows baseline.

## Responsive And Platform Behavior

Unchanged — follows baseline. Wrapping only; the strings add no controls. Captured at 1059×738 at 2× only. No narrow capture was made for this text change: the panel's narrow layout is as approved in 395 (VIS-017 there) and the strings add no control, only longer wrapping text; a narrow check of the longest line (VPN not ready) is left to engineering's rendered check.

## Accessibility And Keyboard Behavior

Unchanged — follows baseline. The status line stays one paragraph read in order; the longer text keeps the existing contrast (green-700 on white when ready, slate-700 when not).

## Motion And Transitions

Unchanged — follows baseline (Check again "Checking…" about 0.9 s in the reference; production defines the real check).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Node kind | Chooses the Remote or Today column | Starting states `remote_unreachable`, `remote_lan`, `remote_tailscale`, `remote_vpn`, `remote_nothing` (local storage key `autobyteus.prototype.phonePairing`) | Real: the store's `kind === 'remote'` (`recognizeNodeKind`) |
| Node name | `{{name}}` | "Office Mac" (illustrative) | The node's name in the desktop's list (`phoneAccessStore.nodeName`) |
| Reached / not reached | Ready vs not ready | Scripted per state; Check again always ends "not reachable" | Real address checks (2 s timeouts) |

## Final Visual Reference Inventory

All images: desktop window 1059×738 CSS px at 2× (2118×1476 px), full page, remote node "Office Mac" (illustrative), paths under `tickets/done/phone-setup-remote-node-wording/visual-references/`. Every visible text is requirements-defining except what is listed as illustrative: the node name, the paired phones list ("Pixel 8"…), and the left panel's workspace names.

| Visual ID | State | Image |
| --- | --- | --- |
| VIS-001 | `remote_unreachable`, Tailscale not ready | `VIS-001-remote-tailscale-not-ready-1059x738@2x.png` |
| VIS-002 | VPN not ready, after Check again | `VIS-002-remote-vpn-not-ready-after-check-again-1059x738@2x.png` |
| VIS-003 | Tailscale not ready, after Check again | `VIS-003-remote-tailscale-not-ready-after-check-again-1059x738@2x.png` |
| VIS-004 | Same Wi-Fi or LAN not ready | `VIS-004-remote-wifi-lan-not-ready-1059x738@2x.png` |
| VIS-005 | `remote_lan`, Wi-Fi/LAN ready, first time (question card) | `VIS-005-remote-wifi-lan-ready-first-time-1059x738@2x.png` |
| VIS-006 | Wi-Fi/LAN allowed note, How it works open | `VIS-006-remote-wifi-lan-allowed-how-it-works-open-1059x738@2x.png` |
| VIS-007 | `remote_tailscale`, ready, How it works open (no Advanced) | `VIS-007-remote-tailscale-ready-how-it-works-open-1059x738@2x.png` |
| VIS-008 | `remote_vpn`, ready, How it works open | `VIS-008-remote-vpn-ready-how-it-works-open-1059x738@2x.png` |
| VIS-009 | `remote_nothing`, no address message | `VIS-009-remote-no-address-1059x738@2x.png` |

Not re-captured (text unchanged): embedded and Docker-node states — the 395 references VIS-001…016.

## Linked UI Reference Evidence

- Runnable UI reference: design repository default branch `personal` after integration; run `corepack pnpm install --ignore-workspace --frozen-lockfile` then `corepack pnpm dev --port 3426`; set `autobyteus.prototype.scenario` = `nodes_user`, `autobyteus.prototype.context` = `electron_external` and `autobyteus.prototype.phonePairing` = a state above (remove the keys and reload to reset).
- Ticket record: `tickets/done/phone-setup-remote-node-wording/product-ticket.md`
- Mocked boundaries and limitations: the external window of the reference is bound to the simulated node "docker"; for `remote_*` states the panel shows "Office Mac" as the node's name (fixture seed, not a product control). Check again is scripted.

## Implementation Fidelity Boundary

- Must preserve: the strings above, byte for byte, for kind `remote`; today's strings for the other kinds; every other line of the panel.
- Does not prescribe: key names, how the kind or name reaches the strings, localization of the Chinese text.
- Existing design-system constraints: the panel's existing classes.

## Out Of Scope

Item 15 (older-server update state), phone/Android/iOS text, Company address text, the Docker-node text, a new "from this computer" explanation anywhere else.

## Open Decisions And Risks

- "Ready" means the desktop reached the node's address; the phone may still be on another network. Same as today's behavior; the How it works fold covers it.
- "Connect both to your VPN" means the node and this computer, named in the same sentence; the phone is covered in the fold's Setup.
- Engineering to confirm that the remote node keeps the Wi-Fi/LAN allowed answer itself (evidence: 395 API-10 §2) before shipping "{{name}} remembers it."

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed has a final visual reference: `Yes` for desktop; no narrow capture (text only, see Responsive)
- Every section covers the affected scope or is marked unchanged/N/A: `Yes`
- Recorded values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes` (strings read back from the running reference on 2026-11-07)
- Final visuals contain no clipping, overlap or visual drift: `Yes`
- Every visible detail is requirements-defining unless listed as illustrative: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Artifact and visual-reference paths agree with this specification: `Yes`
