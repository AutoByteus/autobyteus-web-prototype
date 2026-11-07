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

## Review round 8 (2026-11-07) — Solution Designer SR-004 / DEC-012 (the user's VPN question)

- The user (in the Solution Designer's conversation): "we will use VPN a lot of times in the future … a lot of companies will use VPN … do we also support that?" then "Maybe use different sections … you know the best."
- Change: no sections per network. Result line is network-neutral: "Works anywhere through Tailscale" / "Works through <company address>" (new state, `company_address`) / "Works on this network". Question: "Use this network?" (button "Use this network"). Hint: "To connect away from this network, install Tailscale …". "Other options" is grouped by purpose: Network ("This network allowed"), Address (Secure web address, Enter an address by hand), Phone access ("Turn off phone access"). Android can't-reach body: "Connect to the same Wi-Fi or VPN as the computer, or turn on Tailscale."

## Review round 9 (2026-11-07) — Solution Designer relaying the user

- The user: "maybe mention, in VPN envionrment, see addtional section how about that? or op other options section".
- Change (Solution Designer's decision within DEC-012): a third parallel line under "Connect a phone": "Company VPN: turn the VPN on on your phone too. If your company gave this node its own address, enter it under Other options." — "Other options" is a link that opens the collapsed section, scrolls to its Address group and focuses "Enter an address by hand". Shown for the same cases as the other two lines (Tailscale not detected, no company address).

## Review round 10 (2026-11-07) — Solution Designer relaying the user

- The user: "what does this sentence mean, without encryption, people feel scared".
- Change (copy decided by the Solution Designer, no "encryption", no warning colour): the one-time question is a neutral card "Allow phones on this network?" / "Fine for home and office networks. On public Wi-Fi, use Tailscale instead." / buttons "Allow", "Not now". The switch "This network allowed": "For home and office networks. Applies to every node on this computer." and, smaller: "On public Wi-Fi (café, hotel, airport), use Tailscale instead: there, others on the network could see the connection." The declined hint reads "Phones can't connect until you allow this network. Or install Tailscale …".
- Not changed (flagged): the Android "Type an address" sheet still says "This address isn't encrypted. Only use it on a network you trust." for typed http addresses.

## Review round 11 (2026-11-07) — Solution Designer SR-005 (the user: "you know the different network environments more than me")

- Change: a VPN tunnel is trusted like Tailscale, no question; result line "Works through your VPN" (state `vpn`), with the plain hint "Turn the VPN on on your phone too." The switch covers only the local Wi-Fi/cable network: "Local Wi-Fi allowed", shown under Other options only when the computer is on a local network, with the remembered state "Allowed on this network, <network name>. We ask again on a new network." The question "Allow phones on this network?" is asked once per local network (footnote names it: "This network: Home-5G. We ask once for each network.") and again on a new one (state `wifi_new_network`, allowed earlier on another network). After "Not now": no QR and one line "On this network, use Tailscale or your VPN." (Tailscale is the download link). The company's fixed address, Tailscale, VPN, then allowed local Wi-Fi are tried in that order automatically; the user never selects an address.
- DEC-004 is settled by the Solution Designer as "once per network" (user's choice still to be confirmed in his words).
- Review states: home, nothing installed (`wifi_ask` → Allow); with Tailscale (`tailscale`); shared office with VPN (`vpn`); shared office with nothing (`wifi_new_network` → Not now); company fixed address (`company_address`).

## Review URLs (UI reference, port 3395, process owned by this ticket)

- Desktop panel: `/nodes?nodeTab=phoneSetup` (starting states below; window on the desktop's own node: scenario `nodes_user` + context `electron_internal`; Docker node window: context `electron_external`).
- Android app start screen: `/android`; node page inside the app (with Switch node / Add a node): reached from `/android` by tapping a node.
- Browser page for a phone without the app: `/mobile?pairing=<inert sample link>` (the QR on the desktop panel encodes one; scanning it with the phone camera opens it).
- Starting states: local-storage key `autobyteus.prototype.phonePairing` = desktop: `tailscale` (default), `tailscale_no_https`, `company_address`, `vpn`, `wifi_new_network`, `wifi_ask`, `wifi_allowed`, `nothing`, `docker_unpublished`, `expired`, `no_phones`; Android: `android_several` (default), `android_first_launch`, `android_unreachable`, `android_scan_cant_reach`. Reset: remove the `autobyteus.prototype.*` keys and reload.

## Result

Pending the user's confirmation and his DEC-004 choice.
