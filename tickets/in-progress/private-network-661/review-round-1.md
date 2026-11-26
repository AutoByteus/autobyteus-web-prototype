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
