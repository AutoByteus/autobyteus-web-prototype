# Product Ticket: one-step-phone-pairing (Project Task autobyteus-395)

- Status: `Awaiting User Review` (review round 1 sent 2026-11-07)
- Mode: Product Experience Design (evolves the accepted `/mobile` and Nodes › Phone Setup baseline; the Android app's native start screen is a design-only route)
- Requested by: Solution Designer run `solution_designer_03f4f2aaf88941a0a3030151229dc1fa`, at the user's request on 2026-11-07 ("yes send to product team")
- Request: `/Users/normy/autobyteus_org/autobyteus-worktrees/one-step-phone-pairing/tickets/in-progress/one-step-phone-pairing/product-design-request.md` (with `requirements-doc.md` SR-002 and `investigation-notes.md` in the same folder)
- Design repository: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin` = `AutoByteus/autobyteus-web-prototype`)
- Ticket branch / worktree: `design/one-step-phone-pairing` / `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/one-step-phone-pairing`
- Accepted design base: `e0a52bcfa554d474bcfc2ad5e58621e690c05499` (`origin/personal`, fetched 2026-11-07; local `personal` equal to it)
- Source pin (read only): baseline `ui-baseline-report.md` pin `d74f75a51a`; 277 phone shell as integrated (`tickets/done/mobile-experience-redesign`). Android native screen (`ConnectionScreen.kt`) is not in the web baseline; its current look is known only from the user's screenshot 26.jpg (reference only, not copied).
- Baseline: accepted (existing). Not re-bootstrapped: the changed surfaces (Phone Setup tab components, `/mobile` pairing page, connection sheet) are in the baseline as source components and were read directly.
- Runtime: UI reference `corepack pnpm exec nuxt dev --host 0.0.0.0 --port 3395`; process owned by this ticket. Local state keys: `autobyteus.prototype.phonePairing` (starting state, see runbook section), reset by removing the keys listed there and reloading.

## Decisions asked of the user

- DEC-004: show the home Wi-Fi warning once per computer (recommended; built) or never (described in the spec).

## The user's words so far

- 2026-11-06 / 2026-11-07: see the request. "no matter they connect tailscale or not. they just want to genreate a qrcode, and scan immediately you know. and they want to be able to connect multiple nodes so that they could switch between different nodes on phone"; today's setup is "complicated and ugly".
- DEC-004 choice: not yet given.

## Review round 1 (2026-11-07)

- The user (during the build): the start screen's primary button can say "Scan" instead of "Scan QR code", because it is clear. Changed: the button and the scanner's title say "Scan"; the first-launch headline keeps "Scan the QR code on your computer".

## Review round 2 (2026-11-07)

- The user (about the node sheet): the Switch node screen already has Scan, so "Add a node" under it is not needed; "Yeah, let's remove it. Make it cleaner." and, about Peer nodes: "remove peer nodes as well".
- Change: the node sheet in the Android app is now status + Check connection, **Switch node** ("N nodes on this phone"), Unpair this phone. "Add a node" and the read-only "Peer nodes" list are gone from the sheet (also in a plain browser, where the sheet is otherwise unchanged). The "docker" / "office-mac" chips on runs stay. This removes part of the approved 277 sheet (UIS-010 / VIS-019, DEC-003 A peer list) at his word: recorded for the Solution Designer.

## Review round 3 (2026-11-07)

- The user: the desktop Phone Setup tab was never designed before and is hard to understand (asked the Solution Designer how it is updated: message sent, answer pending); asked what button replaces "Check connection".
- Change (proposal, awaiting his word): in the node sheet "Check connection" is a 48px refresh icon button (spins while checking) when the node is reachable, and the outlined word "Retry" when it is not. Industry pattern: icon refresh while healthy, a named action ("Retry"/"Reconnect") when something is wrong.

## Review round 4 (2026-11-07)

- The user: yes to the Tailscale download link, and "at least give users some kind of information … on the page, we don't even have a [guide], the user have no idea that they need to install tailscale".
- Change: when Tailscale is not detected, the panel says so before any click: an information line under "Connect a phone" ("Phones connect over your home Wi-Fi. To connect from anywhere, install Tailscale on this computer and your phone."); "Tailscale" is a link to the download page, also in the hint under the Wi-Fi QR and after "Not now". When Tailscale works, there is no such line.

## Review round 5 (2026-11-07)

- The user: at home on the sofa Tailscale is not needed; away from home it is. Asked whether a separate section is better.
- Change: no new section. The information line (shown when Tailscale is not detected) is split into the two cases: "At home, on this Wi-Fi: nothing to install." / "Away from home: install Tailscale on this computer and your phone, and sign in to the same account." The hint under a Wi-Fi QR reads "Away from home, install Tailscale … and sign in to the same account."

## Review round 6 (2026-11-07)

- The user: "Phones for Embedded Node? or connected devices, what are the right words?"
- Change (proposal): panel title "Phones"; the node's name moves into the line under it ("… to connect a phone to <node name>"); the list heading is "Connected phones".

## Review round 7 (2026-11-07)

- The user: "At home, on this Wi-Fi: nothing to install" vs LAN / travelling / outside — which wording is more accurate?
- Change (proposal): "Same Wi-Fi as this computer: nothing to install." / "Anywhere else: install Tailscale on this computer and your phone, and sign in to the same account." Hint under a Wi-Fi QR: "On another network, install Tailscale …". The remembered-answer row reads "Wi-Fi allowed" (no "home"; the SD's working term was "Home Wi-Fi allowed").

## Review URLs (UI reference, port 3395, process owned by this ticket)

- Desktop panel: `/nodes?nodeTab=phoneSetup` (starting states below; window on the desktop's own node: scenario `nodes_user` + context `electron_internal`; Docker node window: context `electron_external`).
- Android app start screen: `/android`; node page inside the app (with Switch node / Add a node): reached from `/android` by tapping a node.
- Browser page for a phone without the app: `/mobile?pairing=<inert sample link>` (the QR on the desktop panel encodes one; scanning it with the phone camera opens it).
- Starting states: local-storage key `autobyteus.prototype.phonePairing` = desktop: `tailscale` (default), `tailscale_no_https`, `wifi_ask`, `wifi_allowed`, `nothing`, `docker_unpublished`, `expired`, `no_phones`; Android: `android_several` (default), `android_first_launch`, `android_unreachable`, `android_scan_cant_reach`. Reset: remove the `autobyteus.prototype.*` keys and reload.

## Result

Pending the user's confirmation and his DEC-004 choice.
