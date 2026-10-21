# Product Ticket — remote-nodes-page

## Identity And Scope

- Ticket / request ID: `remote-nodes-page` (engineering Task autobyteus-267)
- Title: Nodes → Remote Collaboration: peers' Agents and Teams, and this node's shared offer
- Status: `Awaiting User Review` (round 1; baseline `WEB-BASELINE-REFRESH-012` accepted and integrated 2026-10-21)
- Related requirements revision: SR-001 (`requirements-doc.md`, Ready for Approval)
- Related IDs: UC-501…503, REQ-501…510, BEH-501…503, AC-501…507, DEC-501…504, SCN-501…503
- Critical journey: owner opens Nodes → Remote Collaboration; sees each peer's state and offer; sees this
  node's shared Agents/Teams with readiness; follows a link to fix a default; refreshes.
- Decisions to resolve: DEC-502 (when a peer is asked), the short default view and search, the flag/link/reason
  placement, how the rules paragraph fits.
- Non-goals: starting or messaging remote runs; changing what is shared; live updates.
- Requester: Solution Designer `solution_designer_fb26ec003e5d477c8604e2b140ba926c`
- Authority files (read-only): `/Users/normy/autobyteus_org/autobyteus-worktrees/remote-nodes-page/tickets/in-progress/remote-nodes-page/{handoff-product-design,requirements-doc,investigation-notes}.md`

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/remote-nodes-page`
- Ticket branch: `design/remote-nodes-page`
- Source: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`, `autobyteus-web`
- Accepted design base: `d711b817115b9456732e5be03f6b53c7a0e1ca4f` (`personal`, after the baseline refresh; merged into this branch).
- Pinned source revision: `origin/personal@9e7a45880865912442f4188e6d2a58d99b10a54c`
- Integration: `Pending`. Cleanup: `Pending`.
- Ticket folder: `tickets/in-progress/remote-nodes-page/`

## Outcome And Handoff

- Next expected action: user review of round 1 (review URL below); feedback, then final references and `ui-ux-spec.md`.
- Handoff target on completion: Solution Designer, run `solution_designer_fb26ec003e5d477c8604e2b140ba926c`.

## Review (round 1)

- Review URL: `http://127.0.0.1:4781/nodes?nodeTab=remoteCollaboration` (dev server of this worktree). Starting state: in the browser console run
  `localStorage.setItem('autobyteus.prototype.scenario','collab_peers')` and reload (switch on, six peers in six states).
- Runtime isolation: port 4781, `corepack pnpm dev --port 4781` in this worktree; state is in memory, reload resets it.
- Round 1 feedback from the user: the first layout had too much text and was not clean. Reworked: every peer is one line by default
  (state + counts + the first names), expanded on demand; the rules paragraph is collapsed under "How peers' runs work"; Refresh is an icon.

- Round 1 feedback 2 (user, 2026-10-21; superseded by feedback 3): the list of this node's own Agents and Teams is redundant (he knows them from the Agents page).
  Decision: the "available to peers" card shows only the entries a peer could not start (reason + settings link), or one "all ready" line;
  no ready list, no search there. **Requirement impact** for the Solution Designer: REQ-505 (lists the shared set) and REQ-507 for this
  node's list (short default view, search) no longer apply to this card. AC-503 (three flags, one ready entry) becomes three flags and an
  all-ready line once defaults are fixed; AC-504 applies to peers' lists only. Scenario `collab_all_ready` shows the all-ready state.
- Round 1 feedback 3 (user, 2026-10-21): "remove it" meant the whole card "Agents and Agent Teams available to peers" (he knows his own
  agents from the Agents page). Decision: the card, its list, its readiness flags and its settings links are removed. The page is now the
  switch card and "Peer nodes". The rules (temp workspace, auto-approve, local login, no default is refused) stay, as one collapsed line
  "How peers' runs work" at the bottom of the Peer nodes card, so the preserved rules are still stated.
  **Requirement impact (larger than feedback 2)**: UC-502, REQ-505, REQ-506, AC-503, SCN-502, DEC-501, DEC-503 and the "this node's list"
  part of REQ-507 no longer have a UI. The server work for readiness (E-05) is not needed by this page. The earlier card (flagged-only
  version) is in git history at `e8f76d6`, if the user wants it back.
