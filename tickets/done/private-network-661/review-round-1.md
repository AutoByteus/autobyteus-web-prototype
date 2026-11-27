# Review Round 1: private-network-661

Review URL: `https://normys-macbook-pro.tail0347f8.ts.net:8449/` (founder's tailnet devices) or `http://127.0.0.1:4661/` on this Mac. Starting states are set in the browser console (runbook, section private-network-661). Interim captures: `review-captures/round-1/R1-*.png` (not normative).

Everything approved in extensions-ui-516 is unchanged unless listed in `design-change-log.md` (DC-091…DC-099).

## Answers to the six questions

1. **Tailscale only (DC-091). Hidden, not "later".** The page goes straight to "Join your private network" with Sign in with Tailscale (auth key as the second way). A list with one live choice and three greyed "later" choices gives the owner nothing to do now and invites questions; when Headscale or hosting ships, the choice comes back as in VIS-T1-03. "Your own VPN" is hidden too (non-goal; today's setting stays). Captures R1-01, R1-07.
2. **Tailscale's states (DC-092, DC-093).** Each is one amber notice on the page, named in the card's status line and in Manage Nodes → This node: approval (R1-02), sign-in expired with how to avoid it (R1-03), signed out (R1-04), unreachable, retrying by itself (R1-05), access rules blocking named machines (R1-06).
3. **Pair again (DC-094).** Rows stay where they were; an amber "Paired before the update" mark and Pair again in the Pair column. Own node: one click. Someone else's: Pair again → Waiting / Cancel → Paired. Older AutoByteus: disabled with "Update it, then pair again." beside the row's Update button. R1-08…R1-10.
4. **Pair by address (DC-095, DC-096).** In Paired nodes, as a band like Add a node: other people's nodes are what that section lists. The asking node shows the address with Waiting / Cancel, then Paired or "Its owner declined." with Pair again. The other node: "dana-mac at 192.168.1.30:29695 wants to pair" with Accept / Reject, with or without the private network. R1-11…R1-15.
5. **Join first (DC-097).** An amber notice under the Add a node form, Add node disabled, with Set up Private Network. R1-18.
6. **Shared machine (DC-098).** "shared by dana@other.example", or "shared with you" when Tailscale does not say; the owner-dependent texts fall back to "its owner". R1-16, R1-17.

## Alternatives considered

- Pair by address inside the Add a node form (a "someone else's node" option): mixes control and pairing in one form, against the founder's split (Controlled vs Paired). Rejected.
- A page-level "Pairings were reset by the update" banner: repeats what each row's mark says and stays after the last row is paired. Rejected; the per-row mark goes away by itself.
- "Pair again" opening the old confirmation dialog: the founder's rule is one click for own nodes. Rejected.

## Findings for the Solution Designer

- **F-1 (DC-099, contract):** after Leave and joining again, the node is a new Tailscale machine (new stable ID), so pairings recorded with the old `machine` are refused (pairing-contract §5). The Leave text says "pair those nodes again". Please confirm, or say if the pair record should follow the node key instead.
- **F-2 (REQ-017, provisional):** how the network program tells "blocked by access rules" from "not an AutoByteus machine" is not proved (PoC 2a). The design shows the state only for machines that run a node this one knows (controlled or paired).
- **F-3 (REQ-010):** the reference shows the join-first notice in Add a node. The same check and message apply wherever an access code is pasted (a Needs connecting row); please carry it into the requirement text.
- **F-4 (REQ-012):** for someone else's node on an older version, the asking side learns it only when it asks (the older node does not know `/pair`): it shows the address form's error "runs an older AutoByteus. It can pair once its owner updates it." For a teammate's node paired before the update, Pair again shows the same text on its row (specified, not scripted in the reference). Please confirm the older node answers in a way the new node can recognize.
- Wording change in an approved text (DC-098): "pairs as a teammate when {account} accepts" → "when they accept" (the account was repeated twice on one line).

## Provisional (drawn, not proved)

Real Tailscale sign-in, approval and expiry texts, shared machines' account, access-rule detection, the desktop relay (G1), the phone over mobile data.

## Solution Designer's workflow check (2026-11-26)

- The six answers fit UC-001…UC-011 and the pairing contract.
- F-1 confirmed: Leave makes a new machine; the pair record does not follow the node key. Leave text kept.
- F-2 accepted: "Blocked by access rules" only for nodes this node controls or is paired with; provisional.
- F-3 carried into REQ-010: join-first notice in Add a node, Needs connecting, Found → Control. Applied as DC-100 (R1-18, R1-23, R1-24).
- F-4: version note only on a controlled row; pair by address uses one plain "did not accept" text. Applied as DC-101 (R1-14).
- "…when they accept": fine.

## Solution Designer's capture check (2026-11-26)

1. R1-03 / R1-04 were taken before My machines was hidden; retaken (the list is hidden in both).
2. docker example made consistent (DC-102): current and Paired outside `after_update` (R1-15, R1-18); older with Update and Pair again disabled after the update (R1-08). The "Same version as this app" line beside "Update to 0.1.0-prototype" is today's product hint for the Update button (the update brings the node to this app's version, autobyteus-356, unchanged); it is not a statement about the node's current version.
3. R1-24 retaken with raspberrypi's own code (100.88.60.60): only the join-first line shows.
4. The trash on bob-laptop's old pairing is dropped (DC-102); the row keeps Pair again only.

## D-6: the local network (2026-11-27)

- DC-103 "Visible on my local network" under This node (R1-25…R1-27, R1-33); DC-104 "Found on your local network" (R1-28…R1-32, R1-34); DC-105 two sections, a node on both shown once under the private network (R1-32).
- Why not one list with a network tag: the two lists differ in what a row can say ("added by" vs. nothing) and in when they exist; a tag per row adds a word to every row, while a second section appears only when it has something to say.
- Every row offers Control and Pair: without accounts AutoByteus cannot tell a colleague's node from one of the owner's own machines, so the owner chooses (Control needs the node's access code, Pair needs its owner's Accept).
- Provisional: cross-computer discovery (announce, find, withdraw) is proved only on one Mac; two computers come in the founder's proof (PoC 2a). The Docker-node case (a bridged container cannot announce) is specified, not drawn: its address is typed (REQ-019).
- **F-5 (for the Solution Designer):** pairing with a node found on the local network needs this node to accept local-network connections too, because `/pair-accepted` comes back to the address this node gave. Today the reference lets Pair start while this node does not accept them. Should Pair then show the same "Accept connections from this network?" prompt first (recommended), or is the answer carried on the request's own connection?
