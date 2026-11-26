# Product Ticket: private-network-661 (Private Network, Tailscale first; autobyteus-661, Stage 2)

## Identity And Scope

- Ticket / request ID: `private-network-661`; package `autobyteus-661-private-network`; Task autobyteus-661, Project `project_a1377344-25db-482a-97cc-ecfdb0fb495a`
- Requested by: Solution Designer (run `solution_designer_b2b085ced16d45479c46350d19ae49a2`), for the founder, 2026-11-26
- Request: `/Users/normy/autobyteus_org/autobyteus-worktrees/autobyteus-661-private-network/tickets/in-progress/autobyteus-661-private-network/product-design-request.md`
- Requirements: same folder, `requirements-doc.md` (Approved, SR-001; REQ-001…REQ-017), `pairing-contract.md` (2026-11-26)
- Mode: Product Experience Design (changes the approved Private Network card and Manage Nodes of extensions-ui-516)
- Status: `Awaiting User Review` (round 1)

### Decision questions (product-design-request.md)

1. Tailscale only: how the card reads; other network choices hidden or shown as later.
2. Tailscale's own states: approval, sign-in expired, signed out, unreachable, access rules blocking (REQ-015, REQ-017).
3. "Pair again" after the update (REQ-012, UC-010): one click for a controlled node; a note while the other node runs an older version.
4. Pair by address with someone else's node (REQ-008, UC-006): where it is typed; "<name> at <address> wants to pair"; Waiting / Cancel / declined.
5. Add a node by an access code with a private address while this computer's node is not on the private network (REQ-010).
6. A teammate's node shared through Tailscale: the Found row's "added by" (REQ-016).

### Constraints and non-goals

- Keep everything approved in extensions-ui-516 (VIS-T*). Provisional: real Tailscale sign-in, approval and expiry, shared machines' account, the desktop relay (G1), the phone over mobile data. No real codes or keys. Nothing exposed to the internet.
- Non-goals: Headscale, hosting, NetBird, local discovery, a settings screen for your own VPN.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin`)
- Ticket worktree / branch: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/private-network-661` / `design/private-network-661`
- Accepted design base: `825434bc7b12584ef091393a59865d1750f977ab` (`origin/personal`, extensions-ui-516 integrated)
- Source pin: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web` at `origin/personal@b768c503f9` for Manage Nodes (read only). Checked 2026-11-26 against `origin/personal@41f6894d9d`: no Nodes UI file changed since the pin (the shipped Stage-1 change touches Settings → Extensions only, which implements the approved 516 design); the accepted 516 design is the baseline for this round; no baseline refresh needed.
- Runtime: port 4661 (dev server on 127.0.0.1, process started from this worktree); review share Tailscale Serve `https://normys-macbook-pro.tail0347f8.ts.net:8449/` (entry added by this ticket; other entries 443, 8443, 8444, 8446, 8448 untouched; `tailscale serve --https=8449 off` to remove). State is in memory; a reload resets it.

## Mock data origin

Invented by hand for this ticket: accounts (`alex@example.com`, `bob@example.com`, `carol@example.com`, `dana@other.example`), machine and node names, `100.88.x.x` and `192.168.x.x` addresses, node IDs, the fixture access code in the runbook (setup code `DSGN-ONLY-6610`, never valid anywhere). No real node, account, key, code or log.

## Status history

- 2026-11-26 opened; worktree from `origin/personal@825434bc`; baseline check (above): no refresh needed.
- 2026-11-26 round 1 built and clicked through (desktop 1440, phone 390, en and zh-CN): DC-091…DC-099 (`design-change-log.md`); review notes `review-round-1.md`; interim captures `review-captures/round-1/` (not normative). Sent to the Solution Designer for its workflow check and the founder's review; `Awaiting User Review`.

## Final Package

Pending approval.

## Integration And Cleanup

Pending.
