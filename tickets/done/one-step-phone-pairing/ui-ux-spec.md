# UI/UX Specification — one-step-phone-pairing (autobyteus-395)

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: Project Task `autobyteus-395` (also covers the cancelled `autobyteus-391`); Product ticket `one-step-phone-pairing`
- Related requirements revision ID: `SR-005` (Solution Designer; requirements doc `/Users/normy/autobyteus_org/autobyteus-worktrees/one-step-phone-pairing/tickets/in-progress/one-step-phone-pairing/requirements-doc.md`). Later requirement changes this design carries are listed in "Requirement impact and findings".
- Related requirement, behavior, acceptance-criteria and decision IDs: REQ-001…REQ-005, REQ-008, REQ-010…REQ-015, REQ-018, REQ-019 (peer list removed, refresh/Retry); AC-001, AC-002, AC-006, AC-008…AC-013, AC-015; BEH-001…BEH-006; DEC-001 (B, narrowed: "Switch node" only), DEC-002 (A), DEC-003, DEC-004, DEC-012.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Review URL (while the ticket was open): `http://127.0.0.1:3395` — desktop `/nodes?nodeTab=phoneSetup`, phone `/android`
- Explicit user-confirmation reference: the user, 2026-11-07, in the Product UI/UX Designer's conversation: **"if things are consistant. then i approve"** (after the design review pass; consistency was then checked: UI reference, final screenshots and this specification agree). Earlier confirmations: "Yes, this is much cleaner now." (tabs and panel); "Yes, exactly like that." (tabs, relayed by the Solution Designer). **Node-sheet changes, in his words** (2026-11-07): "Yeah, let's remove it. Make it cleaner. If you think like a pure note is not needed, let's remove pure notes as well." followed by "peer nodes" (remove the **Add a node** row and the **Peer nodes** list; "pure notes" = peer nodes); and, about the sheet's check button: asked "Is the check connection could be replaced by a button or? any idea what button in industry people use?", then accepted the proposed refresh icon / "Retry" in the review ("if things are consistant. then i approve"). **Start-screen button:** "the SCan QRCode can be replaced by Scan directly right? because its really clear there" → the button says "Scan".
- **DEC-004 (home network question).** The user did not state "once", "per network" or "never" in his own words. He left the network decisions to the Solution Designer ("you know the different network environments more than me", relayed 2026-11-07) and approved the design that asks "Allow phones on this network?" **once for each local network**. This specification records that approved behavior; the Solution Designer must record DEC-004 against it. The "never ask" variant is described under Open Decisions.
- Final check date: 2026-11-07

## Repository And Baseline Provenance

- Source repository: AutoByteus workspace (`autobyteus-web` desktop/web and `autobyteus-android`); read only. The native Android start screen (`ConnectionScreen.kt`) has no web source: it is a design-only route.
- Selected frontend application or product surface: Nodes › Phone Setup (desktop), the `/mobile` phone shell (connection sheet, pairing page), and the Android app's native start screen.
- Pinned source commit or revision: baseline `ui-baseline-report.md` pin `d74f75a51a`; the `/mobile` shell as accepted by `tickets/done/mobile-experience-redesign` (autobyteus-277).
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`; ticket branch `design/one-step-phone-pairing`; accepted design base `e0a52bcfa554d474bcfc2ad5e58621e690c05499` (`origin/personal`, 2026-11-07).
- UI reference revision or commit: recorded in `product-ticket.md` (Integration record).
- Ticket folder: `tickets/done/one-step-phone-pairing/` (while open: `tickets/in-progress/one-step-phone-pairing/`)
- Baseline report path: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md`

## Problem And Design Rationale

- **User problem and intent.** Connecting a phone takes a Tailscale terminal guide, a typed or chosen address (often a useless link-local one), a cleartext checkbox on the desktop, another on the phone, and one more tap. Several nodes on one phone all look the same and cannot be switched from inside a page. The user wants: "no matter they connect tailscale or not, they just want to generate a QR code, and scan immediately", and "connect multiple nodes so that they could switch between different nodes on phone". He finds today's setup "complicated and ugly" and is put off by technical words.
- **Key UX decisions and why.**
  1. *Desktop: four tabs, one per way to connect, with the best ready one pre-selected.* The user first asked for one button and no choices, then asked for each network type to be "very transparent" so users do not feel insecure. The tabs give transparency (each says how it works, when to use it, how to set it up, how safe it is) while the pre-selection and "Recommended" badge keep "just press the button" as the default path.
  2. *Everything explanatory is folded.* The user found the page "too much text". Each tab shows only a status line and one button; "How it works" (one line, When, Setup, Safety) is one closed fold per tab, opened by itself only where the user must do something (the way is not ready).
  3. *Plain words, network-neutral.* "Same Wi-Fi or LAN", "Your VPN", "Company address", "Tailscale". No "encryption", "cleartext", "URL", "candidate", and no warning colour for the home-network question (the user: "people feel scared").
  4. *Phone access is one visible switch in the panel header*, per node, not a buried "turn off" link ("user gets lost when do they need to turn off phone access").
  5. *Android: scan first, one list.* One bottom-anchored "Scan" button, the nodes as a named list with online state, and everything technical under "Other ways to connect". Opening the app still goes straight into the last node.
  6. *Switch node is one row in the node sheet.* The app's node list already has the Scan button, so "Add a node" in the sheet was redundant; "Peer nodes" (what the node can reach) was confusable with "nodes on this phone" (what the phone can reach) and was removed at the user's word.
  7. *The Wi-Fi name is not shown.* Reading it on macOS needs the Location permission; no new permission is acceptable.
- **Alternatives considered and why they were rejected.** A single panel with a "Connect a phone" button and an automatic address (first design: dropped for the tabs at the user's request, the automatic choice is kept as the pre-selection); separate sections per network type on the main path (rejected by the Solution Designer, DEC-012: the choice that confused him; the tabs keep it off the main path); "Add a node" in the sheet (redundant); a "How does this work?" section of four cards (replaced by the per-tab fold); scan button at the top of the start screen (bottom-anchored chosen for thumb reach and consistency across states; can be flipped on request).

## Scope And Experience Goal

- User or actor: the user at the desktop, and the same user on his Android phone with one or several nodes (the desktop's own node, Docker nodes, nodes on other machines).
- Context: desktop window of a node (Nodes › Phone Setup), Android app, a plain phone browser.
- Goal: open the panel, press one button, scan, be connected; keep several nodes on one phone and switch from anywhere.
- Observable success: from the default state the user presses **Show QR code** once and scans; on the phone he opens the app, taps **Scan**, and lands in the node's runs; the phone lists nodes under their own names and switches between them in two taps from inside any page.
- In-scope surfaces and journeys: UIS-001…UIS-011 below; UXJ-001…UXJ-008.
- Non-goals: iOS; one node at two addresses with one pairing (FU-002); native secure credential storage; starting runs on peers; changing the node pages of the 277 redesign other than the connection sheet; the network-name display.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-001, REQ-005; AC-001, AC-002 | One action shows a QR; one plain line says how the phone will connect; the way is chosen automatically (pre-selected tab) | UXJ-001, UXJ-002; UIS-001…UIS-003; VIS-001, 002, 006, 007, 008, 010 |
| REQ-004 (DEC-004); AC-002 | The home/office network question, once for each local network, calm words, remembered and changeable | UXJ-002; UIS-003; VIS-006, 007 |
| REQ-008; AC-006 | The optional secure web address command under "Advanced" (AutoByteus shows it, does not run it); "Get Tailscale" and "Check again" when Tailscale is not ready | UXJ-001, UXJ-003; UIS-002; VIS-004, 005 |
| REQ-006, REQ-007 | The same panel in a Docker or remote node window; a way that is not ready says so in plain words | UXJ-004; UIS-001; VIS-014, 015 |
| REQ-014; AC-012 | Connected phones: name, how they connect, last seen, Revoke; "Revoke all" quiet; revoked phones behind "History (n)" | UXJ-005; UIS-004; VIS-016 |
| REQ-015; AC-013 | QR with time left, "New code" when it expires, closing discards it | UXJ-001; UIS-001; VIS-002, 012 |
| REQ-016, REQ-017 | The note about the one-time code, revoke and "never opened to the public internet"; nothing in the design asks to pair again | UIS-001 (About this code) |
| REQ-018; AC-015 | A phone without the app: one "Connect to <name>" button and "Get the Android app" | UXJ-007; UIS-010; VIS-032, 033 |
| REQ-010, REQ-011, REQ-012; AC-008, AC-009, AC-010 | Android: scan first, named nodes with online state, "Other ways to connect", connecting / connected / can't-reach states with a plain reason | UXJ-006; UIS-006…UIS-009; VIS-018…VIS-027, 034 |
| REQ-013 (DEC-001 B, narrowed); AC-011 | The node sheet has "Switch node" (the app's node list, with reachability and Scan); no "Add a node" row | UXJ-008; UIS-005, UIS-007; VIS-028, 029 |
| REQ-019 | "Peer nodes" removed from the node sheet; "Check connection" is a refresh icon when reachable and "Retry" when not | UIS-005; VIS-029, 030, 031 |

## Visual Language

- **Existing product language to preserve.** Desktop: the Nodes page (rounded-2xl white cards, `slate-200` borders, `blue-600` primary buttons, emerald switches as in the "This node" card, the segmented pill tabs of the Nodes page). Phone: the 277 mobile shell (white, `slate-900` text, `blue-600` primary, bottom sheets with a 40×4 handle, 56px rows, 16px/500 labels). The Android native screens use the same language so the screen around the page matches the page.
- **Layout structure and visual hierarchy.** Desktop panel, top to bottom, in one white card (`rounded-2xl`, `border-slate-200`, `shadow-sm`, max width 56rem, centered): header (title "Phones", one line naming the node; right: "Phone access" label, On/Off, switch, one small line) → four tabs → open tab box (status line, then either the button or the shown code, "How it works" fold, "Advanced" fold on Tailscale) → "Connected phones" → "History (n)". Android start screen: 56px header (logo, "AutoByteus") → scrolling area ("Your nodes", rows, "Other ways to connect") → bottom bar with the full-width "Scan" button.
- **Grid, dimensions, spacing, density.** Desktop card padding 24px (`p-6`); tab box padding 20px (`p-5`), radius 12px, `border-slate-200`; folds are 40px rows (`py-2.5`) separated by `slate-100` hairlines; phone rows 36px circle avatar, 12px/16px text lines. QR 208×208 in a 12px-radius bordered box with 10px padding. Android (dp at 390 wide): header 56; rows min 64 (40 avatar, 3 status dot with 2px white ring); scan button 56 high, radius 16, 16 side margins, 12 above, bottom inset ≥16; sheet header 56; sheet rows 56–60; text field 48; sheet buttons 48 (radius 12). Vertical room is scarce on the phone: nothing static is added to the page header.
- **Typography.** The product's system sans (Inter-class) as in the baseline. Desktop: panel title 18px/600; body 14px/24; status line 14px/500 (emerald-700 when ready, slate-700 otherwise); labels "When/Setup/Safety" 14px/500 `slate-800`; footnotes 12px/20 `slate-500`; tab labels 14px/600. Android: header title 18/600; section heading 12/600 uppercase `slate-500`; node name 16/600; state line 13; hero headline 22/600 (line 28); body 15/24; buttons 17/600 (Scan) and 15/600 (sheet buttons).
- **Color values and semantic roles.** `blue-600` primary action and selected tab text (`blue-700`); `emerald-500/700` ready, on, online; `amber-500/700` not reachable or limited-protection line dot and "Not reachable" text; `red-700/600` revoke, remove, unpair; `slate` neutrals. The home-network question uses neutral `slate-50` / `slate-200`, never amber or red (user: "people feel scared").
- **Surfaces, borders, radii, shadows, elevation, layering.** Cards `rounded-2xl`; tab box `rounded-xl` 1px `slate-200`; the tab strip is a `slate-100` pill with a white selected pill and `shadow-sm`; sheets `rounded-t-2xl`, backdrop `slate-900/40`, `shadow-xl`; the scanner is a full-screen `slate-900` layer with white 40px corner brackets (4px stroke, 12px radius) around a 240px square.
- **Controls, icons, imagery, media.** Heroicons (solid 20): `qr-code`, `arrow-path`, `clock`, `chevron-right/down`, `ellipsis-vertical`, `arrows-right-left`, `device-phone-mobile`, `computer-desktop`, `check`, `exclamation-triangle`, `arrow-top-right-on-square`, `link`, `clipboard-document`. The AutoByteus mark (`autobyteus-icon.svg`, 28px) on the Android header and the browser page. The QR is a standard QR, `errorCorrectionLevel M`, black on white.
- **Hover, active, focus, selected, disabled, validation, feedback.** Primary button: `blue-600`, hover `blue-700`, focus ring 2px `blue-500` with 2px offset, disabled `slate-200` background with `slate-500` text and no shadow. Selected tab: white pill, `blue-700` text. Disabled "Show QR code" stays visible beside the reason (status line). Phone: `active:bg-slate-100` (or `slate-50` on rows, `blue-700` darkening on blue buttons). "Copied" replaces "Copy" for 1.6 s. The timer turns `amber-700`/600 in the last 60 s.

### New Or Changed Components

The UI reference location is traceability only; it does not prescribe the production implementation.

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Phones panel (replaces the old Phone Access and Phone Setup guide cards) | Connect a phone to the window's node: header with Phone access switch, four tabs, code, connected phones | Four tabs × ready / not ready; code shown / expired; access on / off; first-time network question; blocked (no network / Docker port not published) | `components/settings/phone/PhoneConnectPanel.vue` (mounted by `NodeManager.vue`; the old `PhoneAccessCard.vue`, `PhoneSetupGuideCard.vue`, `utils/phoneSetupGuideCommands.ts` are removed) |
| Android start screen / Switch node list | Scan-first start, node list with online state, remove, "Other ways to connect"; the same screen with a back arrow and the current node marked is "Switch node" | First launch; several nodes; one unreachable; checking; other ways open; type-an-address sheet; remove sheet; scanner; connecting; connected; can't reach | `components/android/AndroidAppScreens.vue`, `pages/android.vue` |
| Connection sheet (changed) | Status, refresh/Retry, Switch node, Unpair | In the app / in a browser; reachable / not reachable | `components/mobile/MobileConnectionSheet.vue` |
| Browser pairing page (changed) | One "Connect to <name>" button, "Get the Android app" | With a pairing link; without a link; connecting | `components/mobile/MobilePairingBootstrap.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related Behavior / Requirement / AC IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | User at the desktop, any node window | Panel open, a way ready (e.g. Tailscale) | Show a code and connect a phone | Code shown with how it connects and the time left | REQ-001, 005, 015; AC-001, 013 |
| UXJ-002 | Same, only the local network is ready | First time on this network | Allow the network and show a code | Code shown; the answer remembered, changeable | REQ-004; AC-002 |
| UXJ-003 | Same, Tailscale not ready or no VPN | A tab that is not ready | Understand what is missing and set it up | Status turns ready (after "Check again" in a real product) | REQ-005, 008; AC-006 |
| UXJ-004 | Same, Docker node window or no network | Nothing works | Understand why, in plain words | Message names the fix | REQ-006, 007 |
| UXJ-005 | User manages phones | Phones connected | Revoke one, revoke all, see history | List updated, history kept | REQ-014; AC-012 |
| UXJ-006 | User on the phone | First launch, or several nodes | Scan a code and be connected; add another node | Node listed by name, node page open | REQ-010…012; AC-008…010 |
| UXJ-007 | A phone without the app | Camera opened the pairing link | Connect with one tap | Node page open | REQ-018; AC-015 |
| UXJ-008 | User inside a node's page in the app | Two or more nodes | Switch to another node, or add one | The other node's runs / a new node listed | REQ-013, 019; AC-011 |

## Journey Details

**UXJ-001 — Show a code (desktop).**
Entry: Nodes › Phone Setup in the node's window. The tab of the best ready way is selected and carries "Recommended" (order: address set up for this node, Tailscale, your VPN, same Wi-Fi or LAN). The user presses **Show QR code**. Phone access, if off, turns on (the click is the consent; the button then reads "Turn on and show QR code"). The button gives way to: the QR, the result line naming the way (see Content), "Open the AutoByteus app on your phone and scan this code.", "Valid for 5:00" counting down (amber under 1 minute), **Close**, the footnote and the "About this code" fold. After 5 minutes the QR is dimmed with "This code has expired", **New code** and Close appear. Close, switching tab, or leaving the page discards the code. Related visuals: VIS-001, 002, 012, 017.

**UXJ-002 — Allow the local network (desktop).**
On the **Same Wi-Fi or LAN** tab, while this network is not yet allowed, a neutral card shows "Allow phones on this network?", "Fine for home and office networks. Not for public Wi-Fi.", "This network. We ask once for each network." and the button reads **Allow and show QR code** (pressing it is the decision). Afterwards the card is replaced by the row "Wi-Fi/LAN allowed on this network" with a switch (on): "This network. Applies to every node on this computer. We ask again on a new network." The button then reads **Show QR code**. Turning the switch off discards a shown code and asks again next time. A different local network is a new network and asks again. The Wi-Fi name is never shown. Visuals: VIS-006, 007.

**UXJ-003 — A way that is not ready (desktop).**
Tailscale not ready: status "Not set up yet."; **Show QR code** disabled; **Check again** beside it; "How it works" opens by itself, Setup shows two numbered steps with a **Get Tailscale** link (tailscale.com/download). Your VPN not ready: "No VPN found on this computer. Connect it, then Check again." with **Check again**. Company address not ready: "Not set up yet." and the field "Enter the address your IT gave you" with **Use this address** (the typed address is used for that code only; the line reads "Works through the address you entered (<address>)"). **Check again** shows "Checking…" for about one second and then a plain note ("Still not found. Tailscale isn't on, on this computer." / "Still no VPN found."). Tailscale ready: under **Advanced**, "Secure web address": one optional command with **Copy** and **Check again** (AutoByteus shows it and does not run it); once set up: "Set up. Phones can use the https:// address." Visuals: VIS-004, 005, 009, 011.

**UXJ-004 — Nothing works / Docker node.**
A plain message sits above the tabs: "This computer isn't on a network a phone could use. Connect it to your Wi-Fi or VPN, then try again." or "<node> isn't reachable from other devices. Publish its port on this computer's network, then try again." Every tab shows its own status; no tab is "Recommended"; every **Show QR code** is disabled. The panel is the same in a Docker node's window (title line names that node). Visuals: VIS-014, 015.

**UXJ-005 — Connected phones.**
Each row: phone icon, name, "Connects through Tailscale|Wi-Fi · Last seen <when>", **Revoke** (outlined, red text). Revoke moves the row into history at once. **Revoke all** (quiet text, top right) opens an inline confirmation "Revoke all N phones? Each one must connect again." with **Revoke all** / **Cancel**. **History (n)** is closed by default; open it lists revoked phones ("Revoked Oct 28 · Connected through Wi-Fi") in a list that scrolls after 18rem. Nothing is deleted. Visual: VIS-016.

**UXJ-006 — Scan and be connected (Android).**
Start screen: tap **Scan** → the camera view (back arrow, title "Scan", brackets, "Point the camera at the QR code on your computer."). When a code is found the brackets turn green ("Code found") and the app shows **Connecting to <node>** with Cancel, then **Connected to <node>** ("Opening your runs…") for one second, then the node's run list. No acknowledgement, no device name. If no address answers: **Can't reach <node>** with the reason, **Retry** (when retrying can help) and **Scan again**; the back arrow returns to the list. Tapping a node row runs the same connecting → connected / can't-reach path. A node that is not reachable shows an amber dot and "Not reachable" in its row; the list shows "Checking…" (grey dot) for about one second when it opens. Row ⋮ opens a sheet: **Remove from this phone**, then "Remove <node> from this phone? Scan its QR code again to add it back." with Cancel / Remove. "Other ways to connect" (closed) opens **Type an address** (a sheet: field, a checkbox "This address isn't encrypted. Only use it on a network you trust." appears only for an `http://` address, **Connect** disabled until valid and acknowledged) and **Paste a link** (connects at once). First launch shows the headline "Scan the QR code on your computer" with one line "On your computer, open Nodes › Phone Setup and choose Connect a phone." Visuals: VIS-018…027, 034.

**UXJ-007 — Phone without the app.**
The camera opens the pairing link in the browser: card with the AutoByteus mark, the node's name as the headline, "Connect this phone to use its runs.", **Connect to <node>** (full width), **Get the Android app** (link to the APK page). Pressing connects (shows "Connecting…" with a spinner) and opens the run list. Without a link the page says "Connect this phone / Scan the QR code on your computer with this phone's camera.", **Get the Android app**, and a closed "Other ways to connect" with a paste field and **Connect**. Visuals: VIS-032, 033.

**UXJ-008 — Switch node inside a page (Android app only).**
Tap the node name (top bar) → the connection sheet: node name, address line, status with the refresh icon (or **Retry** when not reachable), **Switch node** ("N nodes on this phone"), **Unpair this phone**. **Switch node** opens the app's node list (title "Switch node", back arrow; the current node has a `blue-50` row and a check; other rows show online state; the **Scan** button adds a node). Tapping another node runs connecting → connected and opens its runs; tapping the current node returns to the page. In a plain browser the sheet has no Switch node row. No credential leaves its node's page. Visuals: VIS-028…031.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Phones panel — tab with code | Nodes › Phone Setup | Show a code for the open way | Header with Phone access switch; tabs; tab box; code block | VIS-001, 002, 007, 008, 010, 012, 013, 017 |
| UIS-002 | Phones panel — a way's details and setup | Same | Explain and set up a way | Status; Show QR code (+ Check again); How it works fold; Advanced fold (Tailscale) | VIS-003, 004, 005, 009, 011 |
| UIS-003 | Same Wi-Fi or LAN tab | Same | Allow this network, show a code | Question card or "allowed" switch row | VIS-006, 007 |
| UIS-004 | Connected phones and History | Same | Revoke, revoke all, history | Rows, inline confirmation, history list | VIS-016 |
| UIS-005 | Node sheet (changed UIS-010 of 277) | Top bar node name | Status, Switch node, Unpair | Header; status + refresh/Retry; Switch node row; Unpair | VIS-029, 030, 031 |
| UIS-006 | Android start screen | App start (design route `/android`) | Scan; list of nodes | Header; first-launch hero or node list; Other ways; Scan bar | VIS-018, 019, 020, 021, 034 |
| UIS-007 | Switch node list | Node sheet › Switch node | Pick a node | Same list with back arrow, current node marked | VIS-028 |
| UIS-008 | Scanner, connecting, connected, can't reach | Scan / tap a node | Connect and report | Full-screen states | VIS-024…027 |
| UIS-009 | Android sheets | Row ⋮ / Type an address | Remove a node; type an address | Bottom sheets | VIS-022, 023 |
| UIS-010 | Browser pairing page | Pairing link opened in a browser | One-tap connect | Card | VIS-032, 033 |
| UIS-011 | Blocked message (panel) | Phones panel | Say why no way works | Message above the tabs | VIS-014, 015 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Panel opens | Page load | Best ready tab selected, "Recommended" | Tab of that way open | Detection results | Click a tab or Show QR code |
| TR-002 | Tab | Click another tab | Tab changes; a shown code is discarded | That tab's status | Code discarded | Show QR code |
| TR-003 | Ready tab | Show QR code | Button gives way to the QR; timer 5:00 | Code shown | Access turns on if off | Close; wait; scan |
| TR-004 | Code shown | 5 minutes pass | QR dims, "This code has expired" | Expired | — | New code; Close |
| TR-005 | Wi-Fi/LAN first time | Allow and show QR code | Code appears; question becomes the allowed row | Network allowed | Answer remembered per network | Show QR code; switch off |
| TR-006 | Allowed row | Switch off | Row returns to the question; shown code discarded | Not allowed | Answer forgotten | Allow and show QR code |
| TR-007 | Not ready tab | Check again | "Checking…" ~1 s, then a plain note | Still not ready (reference) | — | Check again |
| TR-008 | Company tab, no address | Use this address | Code shown, "Works through the address you entered (…)" | Code shown | Address used for that code | Close |
| TR-009 | Header | Phone access switch | On/Off, line changes; a shown code is discarded when turned off | Access on/off | Per node; phones stay connected | Show QR code ("Turn on and show QR code" while off) |
| TR-010 | Connected phones | Revoke | Row moves to History | History count +1 | Credential revoked | — |
| TR-011 | Connected phones | Revoke all → confirm | Inline confirmation, then all rows move | No active phones | All revoked | — |
| TR-012 | Android start | Scan | Scanner opens; found → green brackets | Connecting | — | Cancel |
| TR-013 | Connecting | Address answers / none answers | Connected screen then run list / Can't reach screen | Node page / Can't reach | Node saved under its name | Retry; Scan again; back |
| TR-014 | Node row | Tap row | Connecting screen | Connected / Can't reach | — | — |
| TR-015 | Node row | ⋮ → Remove → Remove | Sheet closes, row disappears | Node removed from this phone | Local entry deleted | Scan |
| TR-016 | Node sheet | Switch node | App's node list opens | Switch node list | No credential leaves the page | Pick a node; Scan; back |
| TR-017 | Node sheet | Refresh icon / Retry | Icon spins / "Checking…" | Status updated | Status request | — |
| TR-018 | Browser page | Connect to <node> | "Connecting…" with spinner | Node page open | Phone paired | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Panel — default (Tailscale ready, recommended) | Page load | Tab "Tailscale · Recommended" open; "Ready: Tailscale is on, on this computer."; Show QR code; closed folds | Show QR code | — | VIS-001 |
| Panel — code shown | Show QR code | See UXJ-001; result line "Works anywhere through Tailscale" | Close | New code after expiry | VIS-002 |
| Panel — how it works open | Click fold | Line, When, Setup, Safety (texts below) | Close fold | — | VIS-003 |
| Panel — Advanced open (Tailscale ready, no https address) | Click Advanced | "Secure web address": command, Copy, Check again | Copy; Check again | — | VIS-004 |
| Panel — Tailscale not ready | Tab click | "Not set up yet."; disabled button; Check again; Setup open with two steps and Get Tailscale | Check again | — | VIS-005 |
| Panel — Wi-Fi/LAN first time (recommended when nothing else is ready) | Page load | Question card; "Allow and show QR code" | Allow and show QR code | — | VIS-006 |
| Panel — Wi-Fi/LAN code shown | Allow | Allowed row with switch; result line "Works on this network" (amber dot) | Close; switch off | — | VIS-007 |
| Panel — VPN ready, code shown | Show QR code | "Works through your VPN" (emerald) | Close | — | VIS-008 |
| Panel — VPN not ready | Tab click | "No VPN found on this computer. Connect it, then Check again." | Check again | — | VIS-009 |
| Panel — company address ready, code shown | Show QR code | "Works through the address set up for this node (<address>)"; the address in a monospace chip | Close | — | VIS-010 |
| Panel — company address not ready | Tab click | Field "Enter the address your IT gave you"; Use this address | Use this address | — | VIS-011 |
| Panel — code expired | 5 minutes | Dimmed QR, "This code has expired" | New code; Close | — | VIS-012 |
| Panel — phone access off | Switch off | "Off"; "No phone can reach this node. Your phones stay connected and work again when you turn it back on."; button "Turn on and show QR code" | Turn on and show QR code; switch on | — | VIS-013 |
| Panel — no network | Page load | Message above the tabs; no tab recommended | Check again (Tailscale, VPN) | Connect the computer | VIS-014 |
| Panel — Docker node, port not published | Page load in a Docker window | "<node> isn't reachable from other devices. Publish its port on this computer's network, then try again." | — | Publish the port | VIS-015 |
| Panel — history open | Click History (n) | Revoked rows | Close | — | VIS-016 |
| Panel — narrow desktop (900) | Window width | Tabs wrap; QR and text stack as needed | — | — | VIS-017 |
| Android — first launch | No nodes | Hero, one line, Other ways, Scan | Scan; Other ways | — | VIS-018 |
| Android — several nodes | ≥1 node | "Your nodes", rows (name, "Online"), Other ways, Scan | Tap node; ⋮; Scan | — | VIS-019 |
| Android — one node unreachable | A node does not answer | Amber dot, amber "Not reachable" | Tap → Can't reach | — | VIS-020 |
| Android — other ways open | Click | "Type an address", "Paste a link" | Either | — | VIS-021 |
| Android — type an address (http) | Typing `http://…` | Checkbox "This address isn't encrypted. Only use it on a network you trust."; Connect disabled until ticked | Connect | Close | VIS-022 |
| Android — remove node | ⋮ → Remove from this phone | Confirmation text, Cancel / Remove | Remove; Cancel | — | VIS-023 |
| Android — scanner | Scan | Camera view | Close (back arrow) | — | VIS-024 |
| Android — connecting | Scan found / node tapped | "Connecting to <node>", spinner, Cancel | Cancel | — | VIS-025 |
| Android — connected | Success | Green check, "Connected to <node>", "Opening your runs…" | — | — | VIS-026 |
| Android — can't reach | No address answers | "Can't reach <node>" and the reason (below); Retry; Scan again; Open Tailscale link when the reason names it | Retry; Scan again; back | — | VIS-027 |
| Android — Switch node | Node sheet › Switch node | List with check on the current node | Pick; Scan; back | — | VIS-028 |
| Node sheet — in the app | Tap node name | Status (refresh icon), Switch node, Unpair | Switch node; refresh; Unpair | Close | VIS-029 |
| Node sheet — browser | Tap node name | Status (refresh icon), Unpair; no Switch node | Refresh; Unpair | Close | VIS-030 |
| Node sheet — not reachable | Node down | "Not reachable" (amber), **Retry** | Retry | — | VIS-031 |
| Browser — pairing link | Link opened | Node name, one button, app link | Connect to <node> | — | VIS-032 |
| Browser — no link | Page opened without link | Instruction, app link, Other ways (closed) | Paste a link | — | VIS-033 |

## Content, Labels, Validation, And Feedback

- **Product voice and wording conventions.** Plain, short, calm; "connect", "scan", "phone", "node"; no "encryption", "cleartext", "URL", "candidate", "pairing code", "HTTP". Sentence case. Network-neutral (Wi-Fi, LAN, VPN). The Wi-Fi name is not shown.
- **Exact labels, headings and action text — desktop.**
  - Header: "Phones"; "Show a code, then scan it with the AutoByteus app to connect a phone to <node name>." (the node name in 500 weight); "Phone access" · "On|Off" · switch; on: "Phones you connected can reach this node."; off: "No phone can reach this node. Your phones stay connected and work again when you turn it back on."
  - Tabs: "Same Wi-Fi or LAN", "Tailscale", "Your VPN", "Company address"; badge "Recommended".
  - Status lines: Wi-Fi/LAN ready "This computer is on a Wi-Fi or LAN network." / not "This computer isn't on a Wi-Fi or LAN network."; Tailscale ready "Ready: Tailscale is on, on this computer." / not "Not set up yet."; VPN ready "Ready: a VPN is connected on this computer." / not "No VPN found on this computer. Connect it, then Check again."; company ready "Ready: an address is set up for this node." / not "Not set up yet."
  - Buttons: "Show QR code"; "Allow and show QR code" (first time on a Wi-Fi/LAN network); "Turn on and show QR code" (access off; "Turn on, allow and show QR code" for a first-time network while access is off); "Check again"; "Checking…"; "Use this address"; "New code"; "Close"; "Copy" / "Copied"; "Revoke"; "Revoke all"; "Cancel".
  - Result lines: "Works anywhere through Tailscale"; "Works through your VPN"; "Works through the address set up for this node (<address>)"; "Works on this network"; "Works through the address you entered (<address>)". Then "Open the AutoByteus app on your phone and scan this code." and "Valid for m:ss".
  - Footnote: "Works once, for 5 minutes. No app yet? Scan with the phone's camera to connect in the browser." Fold "About this code": "The QR code holds a one-time code, not a password. After scanning, the phone stays connected and you don't need the code again. Lost a phone? Revoke it below and it can no longer connect. AutoByteus never opens this computer to the public internet."
  - **How it works** fold (per tab), line then When / Setup / Safety:
    - Same Wi-Fi or LAN — "Your phone talks to this computer directly over your local network, like two devices at home." When: "Your phone and this computer are on the same Wi-Fi or LAN, such as a home or office network." Setup: "Nothing to install. The first time on a network, AutoByteus asks for your OK." Safety: "The connection has no extra protection, so others on the same network could see it. Fine at home and in your office. On public Wi-Fi (café, hotel, airport) use Tailscale instead. Works only while the phone is on this network."
    - Tailscale — "Tailscale builds a private, encrypted connection between your phone and this computer, wherever they are." When: "You want to use your phone away from home, on mobile data or any Wi-Fi." Setup (ready): "Install Tailscale (free) on this computer and on your phone, sign in to the same account on both, and keep it on. AutoByteus finds it by itself."; (not ready) "1. Install Tailscale (free) on this computer and on your phone. Get Tailscale. 2. Sign in to the same account on both, and keep it on." Safety: "The connection is encrypted between your phone and this computer, and only devices signed in to your Tailscale account can reach it."
    - Your VPN — "Your VPN puts your phone and this computer in the same private network." When: "You already use your own VPN that connects your phone and this computer." Setup: "Connect both to the VPN. AutoByteus finds it by itself." Safety: "As protected as your VPN: the connection is encrypted between your devices."
    - Company address — "Your phone reaches the node at the address your company set up, through the company network or its VPN." When: "The node runs on a company server and your IT gave it an address, such as autobyteus.company.com." Setup: "Your IT sets the address once on the node. On your phone, turn on the company VPN if your company uses one." Safety: "Protected by your company's network: usually a secure (https) address reachable only inside the company or through its VPN."
  - Wi-Fi/LAN question card: "Allow phones on this network?" / "Fine for home and office networks. Not for public Wi-Fi." / "This network. We ask once for each network." Allowed row: "Wi-Fi/LAN allowed on this network" / "This network. Applies to every node on this computer. We ask again on a new network."
  - Advanced › "Secure web address": "Optional. Run this once in a terminal on this computer to give <node name> an https:// address on your Tailscale network. AutoByteus shows it and does not run it." The command shown is illustrative (`tailscale serve --bg --https=8443 <node port>`; the port is the node's own); after Check again: "Set up. Phones can use the https:// address."
  - Company field: "Enter the address your IT gave you"; placeholder `https://node.example.com`.
  - Blocked messages: "This computer isn't on a network a phone could use. Connect it to your Wi-Fi or VPN, then try again." / "<node> isn't reachable from other devices. Publish its port on this computer's network, then try again."
  - Phones: "Connected phones"; "Connects through Tailscale|Wi-Fi · Last seen 2 minutes ago"; "No phones are connected yet."; "Revoke all N phones? Each one must connect again."; "History (n)"; "Revoked Oct 28 · Connected through Wi-Fi".
- **Exact labels — Android and node sheet.** Header "AutoByteus"; "Your nodes"; states "Online", "Not reachable", "Checking…"; button "Scan"; scanner title "Scan", hint "Point the camera at the QR code on your computer.", "Code found"; first launch "Scan the QR code on your computer" / "On your computer, open Nodes › Phone Setup and choose Connect a phone."; "Other ways to connect" › "Type an address", "Paste a link"; sheet "Type an address" (placeholder `https://node.example.com`, checkbox "This address isn't encrypted. Only use it on a network you trust.", "Connect"); node sheet "Remove from this phone" / "Remove <node> from this phone? Scan its QR code again to add it back." / "Cancel" / "Remove"; "Connecting to <node>" / "Cancel"; "Connected to <node>" / "Opening your runs…"; "Can't reach <node>"; "Retry"; "Scan again"; "Open Tailscale"; title "Switch node". Connection sheet: "<node name>", address line, "Connected" / "Not reachable", icon button (aria-label "Check connection"), "Retry", "Switch node" / "N nodes on this phone", "Unpair this phone".
- **Browser page.** "AutoByteus"; "<node name>"; "Connect this phone to use its runs."; "Connect to <node name>"; "Connecting…"; "Get the Android app"; no link: "Connect this phone", "Scan the QR code on your computer with this phone's camera.", "Other ways to connect", "Paste a pairing link", "Paste the link from your computer", "Connect".
- **Empty, error and recovery messages — the phone's can't-reach reasons** (the body under "Can't reach <node>"): not on the same network and no Tailscale: "Connect to the same Wi-Fi or VPN as the computer, or turn on Tailscale." (shown in the design); node asleep: "<node> didn't answer. Check that the computer is on and awake."; expired: "This code has expired. Make a new one on your computer."; used: "This code was already used. Make a new one on your computer."; not an AutoByteus QR: "That isn't an AutoByteus QR code." Only the first is drawn (VIS-027); the others use the same screen with the body replaced and no "Retry" for the last three.

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| Company address (desktop) | Text | Yes, to use it | Non-empty; the button is disabled until then. A plain `http://` address on a local network follows the Wi-Fi/LAN rule (production decides; not drawn) | Typing | (button disabled; no message) |
| Type an address (Android) | URL | Yes | Non-empty; for `http://` the acknowledgement must be ticked | Typing / tick | The checkbox text above; Connect stays disabled |
| Paste a pairing link (browser) | Text area | Yes | Non-empty | Typing | (button disabled) |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop window | ≥1024 px (reference 1440 × 1200) | Panel centered, max 56rem; header on one row (title left, Phone access right); tabs on one row | Mouse and keyboard |
| Narrow desktop | ~900 px window (VIS-017) | Header stacks if needed; tabs wrap to a second row; code and text stack when the box is narrow | Same |
| Android phone | 360–412 dp wide (VIS-034 at 360) | Bottom Scan bar, list scrolls; sheets at most 85% high; inset-safe bottom padding | Touch; system Back walks sheet → list → page |
| Browser phone | Any width ≤ 28rem card | Centered card on `slate-100` | Touch |

## Accessibility And Keyboard Behavior

- Accessibility target: the product's existing level (labelled controls, visible focus, ≥44px touch targets on the phone, readable contrast).
- Focus order, movement and return: header switch → tabs → open tab content → folds → Connected phones. Tabs follow the WAI-ARIA tab pattern: `role="tablist"`, `role="tab"` with `aria-selected`/`aria-controls`, roving `tabindex`; Left/Right/Home/End move and select. Opening a fold keeps focus on its button.
- Roles, names, states and live announcements: the Phone access switch is `role="switch"` with `aria-checked` and label "Phone access"; the timer is `role="timer"`; the blocked message and Android connecting/connected/scanner hint are `role="status"`; the revoke-all confirmation is `role="alertdialog"`; icon buttons carry labels ("Check connection", "Close", "More for <node>", "Back to nodes"); status dots are decorative (`aria-hidden`) and every state also has text; node rows are named "<node>, Online|Not reachable[, current node]".
- Contrast: body text `slate-600/700` on white; ready status `emerald-700`; links `blue-700`; amber text `amber-700`; disabled controls are labelled by the status line beside them.

## Motion And Transitions

- Motion for new or changed elements: fold chevrons rotate 90° (0.15 s, ease); the Android spinner rotates continuously; the refresh icon spins while checking; sheets and the scanner appear without extra motion beyond the product's existing sheet behavior; the QR timer ticks once per second. No decorative animation.
- Durations and easing: 150 ms ease for hover/rotation; scripted timeline of the reference (not product requirements): list check 0.9 s, scan found after 2.2 s, connecting 1.5 s, connected 1.0 s, Check again 0.9 s.
- Reduced-motion behavior: spinners and rotations are replaced by static equivalents (the text "Connecting…" / "Checking…" carries the state).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Detection of ways (Tailscale, VPN, company address, local network, Docker port) | Which tab is ready and Recommended; status lines | Fixed per starting state (`autobyteus.prototype.phonePairing`) | Architecture (U-001: detecting Tailscale/VPN reliably per OS; Docker host addresses); the order company address → Tailscale → VPN → local network |
| Network identity for "once for each network" | Question asked again on a new network | An invented internal id kept in local storage; never shown | Architecture decides how a network is recognised; per computer when it cannot be |
| Phone-facing addresses in the QR | Nothing visible | Inert sample link (`/mobile?pairing=…`, sample code) | Several addresses; the first that answers wins; only the way the tab names |
| Pairing exchange, connecting, reachability | Phone screens | Scripted timeline; unreachable node stays unreachable | Real exchange; no new Android permission |
| Phone access switch | Per node | Local state | Per node; phones stay paired; new codes and phone access stop while off |
| Connected phones and history | List | Synthetic phones (31 revoked) | Existing paired-device records; history kept |
| Android saved nodes | List | Synthetic nodes in local storage | Existing saved nodes keep opening; names come from the QR |
| Page ↔ app signal for Switch node | Node sheet row | Row shown when the page was opened by the design's `/android` route | The page learns it runs in the app without a new permission; no credential crosses |

## Final Visual Reference Inventory

All images are in `visual-references/` of this ticket folder. Desktop images are 1440×1200 browser windows (VIS-017: 900×1500); phone images are 390×844 at 2× (VIS-034: 360×800). The QR in every image is an inert sample; the time left reads 5:00 at capture.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | Panel, Tailscale ready and recommended | 1440×1200 | `visual-references/VIS-001-desktop-tailscale-recommended-ready-1440x1200.png` | Header with switch, four tabs, Recommended, status, button, folds | Node name, phone names, "2 minutes ago" |
| VIS-002 | Tailscale, code shown | 1440×1200 | `visual-references/VIS-002-desktop-tailscale-code-shown-1440x1200.png` | Code inside the tab, result line, timer, Close, footnote, About fold | The QR pattern |
| VIS-003 | Tailscale, How it works open | 1440×1200 | `visual-references/VIS-003-desktop-tailscale-how-it-works-open-1440x1200.png` | Line + When/Setup/Safety | — |
| VIS-004 | Tailscale, Advanced open | 1440×1200 | `visual-references/VIS-004-desktop-tailscale-advanced-secure-address-1440x1200.png` | Secure web address, command, Copy, Check again | The command's port |
| VIS-005 | Tailscale not ready | 1440×1200 | `visual-references/VIS-005-desktop-tailscale-not-ready-1440x1200.png` | Not set up yet, disabled button, Check again, Setup steps with Get Tailscale | — |
| VIS-006 | Same Wi-Fi or LAN, first time (recommended) | 1440×1200 | `visual-references/VIS-006-desktop-wifi-lan-first-time-recommended-1440x1200.png` | Question card, "Allow and show QR code" | — |
| VIS-007 | Wi-Fi/LAN, code shown after Allow | 1440×1200 | `visual-references/VIS-007-desktop-wifi-lan-code-shown-allowed-1440x1200.png` | Allowed row with switch, amber result line | — |
| VIS-008 | Your VPN ready, code shown | 1440×1200 | `visual-references/VIS-008-desktop-vpn-ready-code-shown-1440x1200.png` | "Works through your VPN" | — |
| VIS-009 | Your VPN not ready | 1440×1200 | `visual-references/VIS-009-desktop-vpn-not-ready-1440x1200.png` | "No VPN found…", Check again, fold open | — |
| VIS-010 | Company address ready, code shown | 1440×1200 | `visual-references/VIS-010-desktop-company-address-ready-code-shown-1440x1200.png` | Address chip, result line naming it | The address `autobyteus.example.com` |
| VIS-011 | Company address not ready | 1440×1200 | `visual-references/VIS-011-desktop-company-address-not-ready-1440x1200.png` | Field and button | — |
| VIS-012 | Code expired | 1440×1200 | `visual-references/VIS-012-desktop-code-expired-1440x1200.png` | Dimmed QR, expired text, New code, Close | — |
| VIS-013 | Phone access off | 1440×1200 | `visual-references/VIS-013-desktop-phone-access-off-1440x1200.png` | Off state and line, "Turn on and show QR code" | — |
| VIS-014 | No network | 1440×1200 | `visual-references/VIS-014-desktop-no-network-1440x1200.png` | Message above tabs, no Recommended, disabled buttons | — |
| VIS-015 | Docker node window, port not published | 1440×1200 | `visual-references/VIS-015-desktop-docker-node-port-not-published-1440x1200.png` | Message naming the node | Node name "docker" |
| VIS-016 | Connected phones, History open | 1440×1200 | `visual-references/VIS-016-desktop-history-open-1440x1200.png` | Revoked rows format | Names and dates |
| VIS-017 | Narrow desktop, code shown | 900×1500 | `visual-references/VIS-017-desktop-narrow-code-shown-900x1500.png` | Tabs wrap, stacked layout | — |
| VIS-018 | Android first launch | 390×844 | `visual-references/VIS-018-android-first-launch-phone-390x844.png` | Hero, one line, Other ways, Scan | — |
| VIS-019 | Android, several nodes | 390×844 | `visual-references/VIS-019-android-several-nodes-phone-390x844.png` | Rows, dots, ⋮, Other ways, Scan | Node names |
| VIS-020 | Android, one node unreachable | 390×844 | `visual-references/VIS-020-android-one-node-unreachable-phone-390x844.png` | Amber dot and text | — |
| VIS-021 | Android, Other ways open | 390×844 | `visual-references/VIS-021-android-other-ways-open-phone-390x844.png` | Type an address, Paste a link | — |
| VIS-022 | Android, Type an address (http) | 390×844 | `visual-references/VIS-022-android-type-an-address-http-phone-390x844.png` | Sheet, acknowledgement, disabled Connect | The address `192.0.2.20` |
| VIS-023 | Android, remove node | 390×844 | `visual-references/VIS-023-android-remove-node-confirm-phone-390x844.png` | Sheet text and buttons | — |
| VIS-024 | Android, scanner | 390×844 | `visual-references/VIS-024-android-scanner-phone-390x844.png` | Brackets, title, hint | The dark backdrop stands for the camera image |
| VIS-025 | Android, connecting | 390×844 | `visual-references/VIS-025-android-connecting-phone-390x844.png` | Spinner, text, Cancel | — |
| VIS-026 | Android, connected | 390×844 | `visual-references/VIS-026-android-connected-phone-390x844.png` | Check, text | — |
| VIS-027 | Android, can't reach | 390×844 | `visual-references/VIS-027-android-cant-reach-phone-390x844.png` | Title, reason, Open Tailscale, Retry, Scan again | Node name |
| VIS-028 | Switch node list | 390×844 | `visual-references/VIS-028-android-switch-node-list-phone-390x844.png` | Back arrow, title, current node check, Scan | — |
| VIS-029 | Node sheet in the app | 390×844 | `visual-references/VIS-029-node-sheet-in-app-switch-node-phone-390x844.png` | Refresh icon, Switch node, Unpair; no Add a node, no Peer nodes | The run list behind; the address line |
| VIS-030 | Node sheet in a browser | 390×844 | `visual-references/VIS-030-node-sheet-browser-no-switch-node-phone-390x844.png` | No Switch node row | Node name |
| VIS-031 | Node sheet, not reachable | 390×844 | `visual-references/VIS-031-node-sheet-not-reachable-retry-phone-390x844.png` | Amber status, Retry | — |
| VIS-032 | Browser page with a link | 390×844 | `visual-references/VIS-032-browser-connect-to-node-phone-390x844.png` | Name, one button, app link | Node name |
| VIS-033 | Browser page without a link | 390×844 | `visual-references/VIS-033-browser-no-link-phone-390x844.png` | Instruction, app link, Other ways | The unpair confirmation was dismissed to reach this page |
| VIS-034 | Android start, 360 wide | 360×800 | `visual-references/VIS-034-android-several-nodes-phone-360x800.png` | Layout at the narrow width | Node names |

## Linked UI Reference Evidence

- Runnable UI reference: the design repository root; start `corepack pnpm install --ignore-workspace --frozen-lockfile` then `corepack pnpm dev --port 3210`. Entry points: desktop `http://127.0.0.1:3210/nodes?nodeTab=phoneSetup` (set the starting state below); phone `http://127.0.0.1:3210/android`; browser page `/mobile?pairing=<sample link>` (the desktop panel's QR encodes one; scanning it with a phone camera opens it).
- Ticket record: `product-ticket.md` (this folder).
- Run instructions and starting states: `ui-reference-runbook.md` section "one-step-phone-pairing". State key `autobyteus.prototype.phonePairing`: desktop `tailscale` (default), `tailscale_no_https`, `company_address`, `vpn`, `wifi_ask`, `wifi_allowed`, `wifi_new_network`, `nothing`, `docker_unpublished` (with context `electron_external`), `expired`, `no_phones`, `access_off`; Android `android_several` (default), `android_first_launch`, `android_unreachable`, `android_scan_cant_reach`.
- Relevant journey, transition or scenario IDs: UXJ-001…UXJ-008, TR-001…TR-018.
- Mocked boundaries and limitations: see "Data, Contract, And Mock Boundaries". The Android start screen is a design route, not the app's launcher; the real app opens the last node directly.

## Implementation Fidelity Boundary

- Exact behavior and visible design implementation must preserve: the tab structure and order (Same Wi-Fi or LAN, Tailscale, Your VPN, Company address), the pre-selection and "Recommended" badge, the per-tab status → button → "How it works" structure and all texts above, the Phone access switch in the header, the code inside the tab with the result line, time left and the About fold, the node sheet contents (status + refresh/Retry, Switch node, Unpair), the Android start screen and node list, the connecting / connected / can't-reach screens, and the browser page.
- UI reference state, fixtures and simulated mechanisms that do not prescribe production architecture: detection results, network identity, scripted timeline, synthetic phones and nodes, the `/android` route and `inAndroidApp` flag, the inert sample QR link.
- Fixture content or visible details explicitly allowed to vary: node names, phone names and dates, the company address, network identity (never shown), QR pattern, the QR timer reading, the camera backdrop.
- Permitted responsive or platform variation: tab wrapping and stacking per the table above; Android system insets; the platform's own sheet and keyboard behavior.
- Existing design-system constraints: Nodes-page card/tab/switch styles; 277 sheet styles; Heroicons.

## Out Of Scope

- iOS (FU-001); one node at two addresses with one pairing (FU-002); native secure credential storage; any new Android permission; the Wi-Fi network name; AutoByteus running Tailscale commands; a "never ask" mode (see Open Decisions); starting runs on peers from the phone.

## Open Decisions And Risks

- **DEC-004 wording.** The approved design asks the local-network question once for each network. The user has not said "once" or "never" in his own words; the Solution Designer records the decision. **"Never ask" variant:** the question card and the "Wi-Fi/LAN allowed" row disappear; **Show QR code** on the Wi-Fi/LAN tab shows a code at once; the Safety line still says others on the network could see the connection.
- **Network recognition** (architecture): when a network cannot be recognised the answer is remembered per computer instead.
- **Node names.** The desktop's own node is "Embedded Node" in the registry fixture and would travel to the phone under that name; the design uses friendly names on the phone ("Desktop", "Docker node 1"). A friendlier default name or a rename is a product decision for the Solution Designer.
- **Typed `http://` address on the phone** keeps the current acknowledgement wording ("This address isn't encrypted…"). The user did not ask to change it; the calm-wording rule used elsewhere could be applied if he wishes.
- **"Unpair this phone"** keeps its label though it now affects only the open node; reword if confusing.
- **"Check again"** results are scripted; production defines the real checks and their timing.
- **Docker "port not published"** and "no network" messages assume detection from the desktop side (architecture U-003).
- **Requirement impact (for the Solution Designer).** The node sheet loses "Peer nodes" (277 REQ-008 / DEC-003 A peer-list part), at the user's word; "Add a node" is dropped from the sheet (REQ-013 narrowed); the "Connect a phone" button label is replaced by each tab's "Show QR code".

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes` (UI reference revision in `product-ticket.md` Integration record)
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes` (states with no own image: "wifi_new_network" looks like VIS-006; "wifi_allowed" before showing a code looks like VIS-007 without the code; Paste a link and Revoke-all confirmation are specified in text only)
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
