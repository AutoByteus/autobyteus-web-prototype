# Product Ticket — one-nodes-tab

## Identity And Scope

- Ticket / request ID: `one-nodes-tab` (engineering package `one-nodes-tab`, branch `codex/one-nodes-tab`)
- Title: Nodes → Manage Nodes: one list of nodes, each added once; Remote Collaboration merged in
- Status: `Awaiting User Review` (round 1)
- Related requirements revision: SR-004/SR-005 (`requirements-doc.md`; DEC-709 pending the user)
- Related IDs: UC-701…706, REQ-701…714, BEH-701…707, AC-701…713, DEC-701…709, SCN-701…706
- Critical journey: staying in the embedded node's window, the owner adds a node (8003) once, turns on its "Agents" switch, confirms once, and sees 8003's Agents and Agent Teams — without opening 8003's window.
- Decisions to resolve with the user: (1) Agents and Teams before the switch is on? (2) DEC-709 wording of the address line; (3) how a partly finished step looks (designed; he should judge it). Added by the design: adding a node no longer opens its window; Remove also removes this node on the other side when reachable.
- Non-goals: starting or messaging remote runs; Memory Sync, Phone Setup and the guides; polling; peer authentication.
- Requester: Solution Designer `solution_designer_ab22860c1d5f4de5974921c0128991f5` (delegated by `/project_task_manager`)
- Authority files (read-only): `/Users/normy/autobyteus_org/autobyteus-worktrees/one-nodes-tab/tickets/in-progress/one-nodes-tab/{handoff-product-design,requirements-doc,investigation-notes,ui-sketch,design-spec}.md`

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin` = AutoByteus/autobyteus-web-prototype)
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/one-nodes-tab`
- Ticket branch: `design/one-nodes-tab`
- Accepted design base: `d9e25db6bc9562030a1959261517d2586fee3db1` (`origin/personal`, fetched 2026-10-22; local `personal` had no unpushed commits)
- Source: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`, `autobyteus-web`; engineering worktree `/Users/normy/autobyteus_org/autobyteus-worktrees/one-nodes-tab` (read only) at `origin/personal@ca1f09e52a`
- Pinned source revision of the baseline: `origin/personal@9e7a45880865912442f4188e6d2a58d99b10a54c` (`ui-baseline-report.md`, `WEB-BASELINE-REFRESH-012`), plus the accepted `remote-nodes-page` design (267)
- Baseline check for this request (no refresh needed): between `9e7a458` and `ca1f09e52a`, `NodeManager.vue`, `NodeManagerTabs.vue`, `CurrentWindowNodeCard.vue` and `FeatureCapabilityToggleCard.vue` are identical to the design repository; the Remote Collaboration components differ only in internal state names (`checking` vs `waiting`) and the offers store, not in markup or copy. The one changed Nodes-area surface, `NfsGuideCard.vue` (sticky copy feedback, release line), is a tab this design does not touch and is not refreshed here.
- Integration: `Pending`
- Ticket folder: `tickets/in-progress/one-nodes-tab/`

## Runtime isolation

- Port `4801`, `corepack pnpm dev --port 4801` in the ticket worktree (process started by the Product UI/UX Designer; log `/tmp/one-nodes-tab-dev.log`).
- State is in memory (a page reload resets it); no files, no production service, no other ticket's state used.

## Review (round 1)

- Review URL: `http://127.0.0.1:4801/nodes?nodeTab=manage`
- Starting states are seeded from the browser console (this is the product's existing scenario/context seeding, not a review control):
  - Desktop window on the embedded node (his real setup: Embedded Node + docker 8001 working; 8003, 8004, 8005 are running and can be added): `localStorage.setItem('autobyteus.prototype.scenario','nodes_user'); localStorage.setItem('autobyteus.prototype.context','electron_internal'); location.reload()`
  - Window opened on Docker 8001 (the embedded node is a row): same, with context `electron_external`.
  - One row in every state: scenario `nodes_states`.
  - Browser (no Open): remove the `autobyteus.prototype.context` key.
  - Chinese: `localStorage['autobyteus.localization.preference-mode']='zh-CN'`.
- Try, in the desktop window: Add node → `http://localhost:8003`, name `8003`, leave the box unticked → turn the row's Agents switch on → read the confirmation → Turn on → the row opens and shows both directions and 8003's Agents and Agent Teams. Then: add `localhost:8005` with the box ticked (8005 goes away mid-way: the partial state, then Try again after ~8 s); add `localhost:8004` (the Docker address hint with Use this); ⋯ → Rename / Remove; the This node switch off and on.

- Round 1 feedback (user, 2026-10-22): the Agents switch is hard to understand; adding a node should connect agents without a separate toggle. Applied as option B (DC-714): the Add form's box is ticked by default with clearer words, the one confirmation still follows (it changes the other node), and an unconnected row says so in plain words with a Turn on button. **Requirement impact for the Solution Designer:** REQ-704 / DEC-707 (collaboration off by default when adding) is replaced by "ticked by default, confirmed once"; QR-702 (explicit confirmation) still holds. Waiting for the user's look and approval of this version.

## Outcome And Handoff

- Next expected action: the user reviews and approves or sends feedback; then final screenshots, `ui-ux-spec.md`, repository finalization, and the handoff to the Solution Designer.
- Handoff target on completion: Solution Designer, run `solution_designer_ab22860c1d5f4de5974921c0128991f5`.
