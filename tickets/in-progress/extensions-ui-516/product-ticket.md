# Product Ticket: extensions-ui-516 (AutoByteus Extensions UI, autobyteus-516)

## Identity And Scope

- Ticket / request ID: `extensions-ui-516`; package `autobyteus-516-extensions`; Task autobyteus-516, Project `project_a1377344-25db-482a-97cc-ecfdb0fb495a`
- Requested by: Solution Designer, Software Engineering Team (run `solution_designer_b2b085ced16d45479c46350d19ae49a2`), for the founder, 2026-11-22
- Request: `/Users/normy/autobyteus_org/autobyteus-worktrees/autobyteus-516-extensions/tickets/in-progress/autobyteus-516-extensions/product-design-request.md`
- Mode: Product Experience Design (changes existing surfaces: Settings → Extensions, the Voice Input card, the voice surfaces, Nodes)
- Status: `Awaiting User Review` (round 5, all 23 spines confirmed by the Solution Designer, 2026-11-25)

### Decision questions

Part A (Stage 1, approved requirements REQ-001..011, AC-001..012):
1. The common extension card frame (name, description incl. needs, version, states notAvailableHere / notInstalled / installing / installed on-off-ready-update / failed; Install, Turn on/off, Update, Remove, View log).
2. How a card opens its extension's own page (sandboxed HTML page; Voice Input: language and what is installed).
3. Where the microphone choice and Test recording live once they leave the Voice Input page.
4. How install progress and the long first transcription (~30 s) are communicated.

Part B (Private Network, exploratory; requirements not approved):
5. Private Network card: network choice, join, this machine, my machines, "Let my private network find this node" (off), "Trust machines I added to my private network" (off, opt-in, trade-off clear).
6. Nodes: "Found on your private network" (Pair own / Connect others / Allow-Reject incoming / unknown machine flagged / Unpair) next to today's nodes and peers.
7. "Add a machine" connection code (one-time, expiring, text + QR, a secret).
8. First-run page of a brand-new node (paste the code).

### Constraints and non-goals

- Signed first-party extensions only; no store or payments. Extension pages have no network access and talk only through the bridge. Owner-only management. Nothing public; found ≠ trusted. Keep Settings/Nodes visual language and en/zh-CN.
- Not proved (show provisional, never as certain): direct vs relayed, different networks, mobile data, Android, real Tailscale invites. Restart/revocation ~11–13 s ("connecting…").
- Out of scope: Shared Folder UI, local inference, hosted paid network, phone UI changes.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin`)
- Ticket worktree / branch: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/extensions-ui-516` / `design/extensions-ui-516`
- Accepted design base: `9bec8f39f3efb2c4f1addd23e8bc84c6c3d7f885` (`personal` after the baseline refresh `extensions-nodes-baseline-refresh-516` was accepted and integrated, 2026-11-22; fast-forwarded into this branch)
- Source pin: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web` at `origin/personal@b768c503f9` (read only)
- Runtime: port 4516 (this ticket's own dev server)

## Status history

- 2026-11-22 opened; `Baseline Needed`: scoped refresh `extensions-nodes-baseline-refresh-516` requested (Voice Input card and Nodes page changed in the source since their pins).
- 2026-11-22 baseline refresh accepted and integrated (`personal@9bec8f39`); merged into this branch.
- 2026-11-22 round 1 built and clicked through (desktop 1440, narrow 700 and 390, en and zh-CN); `Awaiting User Review`. Review notes `review-round-1.md`, changes `design-change-log.md` (DC-001…DC-017), runbook first section. Review URL <http://127.0.0.1:4516/settings?section=extensions> (desktop context, see the runbook).

## Mock data origin

Invented by hand for this ticket: the catalog entries (descriptions from `extension-contract.md`'s examples), versions, sizes (1.2 GB, 30 MB), log lines, accounts (`alex@example.com`, `bob@example.com`, `carol@example.com`), machine names, `100.88.x.x` addresses (CGNAT range), keys and connection codes (random), microphone names. No real node, account, device, credential or log. The browser's own microphone list is not used.
- 2026-11-24 the founder asked the Product Team to work the design through with the Solution Designer until it reflects the real workflow. Workflow-fidelity review requested (questions A1–A9, B1–B12, sent to run `solution_designer_b2b085ced16d45479c46350d19ae49a2`); status stays `Awaiting User Review` until the Solution Designer's answers are applied and the round goes back to the founder. Review share: `https://normys-macbook-pro.tail0347f8.ts.net:8445/` (Tailscale Serve, port 8445 only; local edits to `nuxt.config.ts` for the share are temporary and not committed).
- 2026-11-24 the Solution Designer's workflow-fidelity answers applied (round 2, DC-018…DC-028); interim review captures in `review-captures/round-2/` (not normative). Changed screens sent to the Solution Designer for confirmation; the round goes to the founder after it.
- 2026-11-24 the Solution Designer confirmed round 2 follows the validated workflow (A1, A2, A5, A6, A8, B1, B4, B5, B6, B8, B9, B10, B12; B2, B3, B7 OK). Note for `ui-ux-spec.md`: keep today's Remote collaboration text ("Two nodes pair once: they share a secret…") and mark it as text the Private Network stage's design will update (pairing-contract §1 node keys). Round 2 sent to the founder; `Awaiting User Review`.
- 2026-11-24 the founder asked for the Private Network design to cover every network type the extension supports; asked the Solution Designer for a workflow per type (Tailscale, Headscale, hosting a private network, NetBird, bring-your-own VPN / WireGuard, hosted network out of scope), with setup, join, what the network tells AutoByteus, Add a machine, type-specific UI, validation state, switching. Status: `In Progress` (waiting for the per-type workflows); round 2 stays live for review.
- 2026-11-24 round 3 built from private-network-types.md (DC-029…DC-036; captures review-captures/round-3/, interim); sent to the Solution Designer for its workflow check before the founder.
- 2026-11-24 the Solution Designer checked round 3 and asked for three changes and a Leave note (invite pasted only; invite per user, security; private ranges only; leave note): applied as DC-037…DC-040 (captures R3-14…R3-19).
- 2026-11-24 the Solution Designer confirmed round 3 (@ b7dd7685) and asked for the invite as a code: applied (DC-041). Round 3 sent to the founder; `Awaiting User Review`. Heads-up from the Solution Designer: the founder wants the Shared Folder extension (NFS) designed in this ticket too, not built; its data contract and workflow come first, from the Solution Designer.
- 2026-11-24 founder's decision (via the Solution Designer): node code made on the target node, pasted on the desktop (pairing-contract §6a). Round 4 built (DC-043…DC-046, captures review-captures/round-4/); sent to the Solution Designer for its check.
- 2026-11-24 the Solution Designer confirmed round 4 (a: This node is right; b: owner-only → DC-047; c: name read after reaching). Spec note: G4 (Docker first-run locality) provisional. Round 4 sent to the founder; `Awaiting User Review`.
- 2026-11-25 founder's wording for the node code applied (DC-048); no re-check needed (Solution Designer).
- 2026-11-25 founder's naming: "access code" (访问码) for the node code (DC-049); no re-check needed (Solution Designer).
- 2026-11-25 round 5 (Solution Designer): the whole design brought onto the rewritten contracts (DC-050…DC-057); every spine V1–V13, T1–T10 walked through the UI reference; coverage table round-5-coverage.md, captures review-captures/round-5/ (73). Sent to the Solution Designer for spine-by-spine validation; the round goes to the founder only after it confirms every spine.
- 2026-11-25 Solution Designer's validation of round 5: 19 spines match; corrections V2, V4, V13, T9 applied (DC-058…DC-061), changed captures sent for re-check.
- 2026-11-25 the Solution Designer confirmed all 23 spines (@ bfe0d0df) and added V13-05 (DC-062). Round 5 sent to the founder; `Awaiting User Review`.
- 2026-11-25 founder (phone screenshot): narrow-width fixes inside the changed area (DC-063). Asked whether the Settings page's narrow layout (menu list over the content, all sections) should be designed too: outside this ticket.
- 2026-11-25 founder asked for a mobile breadcrumb pattern on Settings: designed for every Settings section (DC-064, captures review-captures/round-6/); this widens the ticket to the Settings page shell (told the Solution Designer).
- 2026-11-25 Solution Designer: DC-063 stays in this package; DC-064 (Settings shell on narrow widths) split into Product ticket `settings-narrow-navigation` (worktree `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/settings-narrow-navigation`), follow-up FU-002; the Settings page here is back to the baseline.
- 2026-11-25 founder decision via the Solution Designer (pairing-contract §9): no Remote collaboration switch; Pair / Unpair are the only collaboration controls (DC-065, captures review-captures/round-7/). Sent to the Solution Designer for its check against T4–T6, T9; status stays `Awaiting User Review`.
- 2026-11-25 Solution Designer checked round 7: switch removal right; three corrections applied (DC-066 no disconnect icon, DC-067 one Unpair confirmation, DC-068 one Pair per node); captures R7-08…R7-17 sent back for confirmation.
