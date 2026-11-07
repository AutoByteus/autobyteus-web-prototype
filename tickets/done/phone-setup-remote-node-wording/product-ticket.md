# Product Ticket: phone-setup-remote-node-wording (Project Task autobyteus-426, item 16)

- Status: `Completed` (user approved 2026-11-07: "approved", covering DEC-A and DEC-B; integration record below)
- Mode: Product Experience Design (evolves the accepted autobyteus-395 Phone Setup design; text only, no layout change)
- Requested by: Solution Designer run `solution_designer_46519d6c265f4b23825027f460f14c1b` (package `small-follow-ups-batch-426`), at the user's word of 2026-11-07 ("Product UI/UX text first")
- Request: `/Users/normy/autobyteus_org/autobyteus-worktrees/small-follow-ups-batch-426/tickets/in-progress/small-follow-ups-batch-426/product-design-request.md` (REQ-016, BEH-016, E-16; also `requirements-doc.md`, `investigation-notes.md` there)
- Scope: **item 16 only** (wording for a node on another computer). Item 15 ("Update <node> to connect a phone") was first put on hold and then dropped by the Solution Designer under the project's DESIGN.md rule 9 (message 2026-11-07); no design was made for it.
- Design repository: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin`)
- Ticket branch / worktree: `design/phone-setup-remote-node-wording` / `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/phone-setup-remote-node-wording`
- Accepted design base: `34677c88cae86b25b0c600ece322857626c43e67` (`origin/personal`, fetched 2026-11-07; local `personal` equal to it)
- Baseline: accepted (autobyteus-395, `tickets/done/one-step-phone-pairing`). Not re-bootstrapped: the status lines of the 395 spec equal the strings in the source branch `codex/small-follow-ups-batch-426` (`autobyteus-web/localization/messages/en/settings.ts:313-324`); the changed panel is a design component read directly.
- Source pin (read only): `/Users/normy/autobyteus_org/autobyteus-worktrees/small-follow-ups-batch-426` branch `codex/small-follow-ups-batch-426` (`PhoneWayTab.vue`, `phoneConnectionWays.ts`, `phoneAccessStore.ts`).
- Runtime: `corepack pnpm exec nuxt dev --host 127.0.0.1 --port 3426` from the worktree; pid in `/tmp/phone-text-426-dev.pid`, log `/tmp/phone-text-426-dev.log`; owned by this ticket. State: `localStorage` keys listed under Review URL; remove them and reload to reset.
- Review URL: `http://127.0.0.1:3426/nodes?nodeTab=phoneSetup` after `localStorage.setItem('autobyteus.prototype.scenario','nodes_user'); localStorage.setItem('autobyteus.prototype.context','electron_external'); localStorage.setItem('autobyteus.prototype.phonePairing','<state>')` and a reload. States: `remote_unreachable`, `remote_lan`, `remote_tailscale`, `remote_vpn`, `remote_nothing` (node on another computer, shown as "Office Mac", illustrative); compare with `vpn`, `tailscale`, `docker_unpublished` (unchanged text).
- Integration: see the record at the end. Cleanup: see the record at the end.

## What changed in the UI reference

`components/settings/phone/PhoneConnectPanel.vue` and `prototype/phone-pairing/phonePairingFixture.ts`: five `remote_*` starting states; in them the status lines, "Still not reachable" notes, the no-address message and (extension, see below) the How it works and Wi-Fi-allowed lines name the node; the Advanced "Secure web address" is not offered (the product already offers it only for nodes on this computer). Embedded and Docker-node text is untouched.

## Decisions asked of the user

- DEC-A: the wording of item 16 — approved.
- DEC-B: the extension (approved, recommended yes) to How it works and the Wi-Fi-allowed note for a remote node (they show "this computer" for the phone's connection directly under the new status line). Recommended: yes, same panel, text only. (Would have left those lines as today for all kinds had it been refused.)

## Final artifacts

`ui-ux-spec.md` and `visual-references/VIS-001…009` in this folder (moved to `tickets/done/phone-setup-remote-node-wording/` on completion). Runbook: `ui-reference-runbook.md` at the repository root.

## Integration record (2026-11-07)

- Ticket commit pushed as a fast-forward to `origin/personal`: `34677c88..2041ce2e` (`git push origin design/phone-setup-remote-node-wording:personal`); the canonical checkout `/Users/normy/autobyteus_org/autobyteus-web-design` fast-forwarded to `2041ce2e`; local `personal` = `origin/personal` = `2041ce2e` (before this record's own commit, which follows the same push-then-update sequence).
- Default-entry-point check: the canonical checkout's reference was run (`nuxt dev --port 3427`), and with `remote_vpn` the Same Wi-Fi or LAN tab read "Office Mac isn’t reachable on a Wi-Fi or LAN address from this computer." — no preview URL or preview-only state.
- Cleanup: both review servers (ports 3426 and 3427) stopped; worktree and local branch removed after this record is integrated (see the result message).
