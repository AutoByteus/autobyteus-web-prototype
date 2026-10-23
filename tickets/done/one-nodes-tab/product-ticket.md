# Product Ticket — one-nodes-tab

## Identity And Scope

- Ticket / request ID: `one-nodes-tab` (engineering package `one-nodes-tab`, branch `codex/one-nodes-tab`)
- Title: Nodes → Manage Nodes: one list of nodes, each added once; Remote Collaboration merged in
- Status: `Completed` (user approval 2026-10-23: "i think we are ready. approved"; eight rounds of review, DC-714 … DC-723)
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
- Integration: `Completed` (see Final Integration below)
- Ticket folder: `tickets/done/one-nodes-tab/`

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
- Try, in the desktop window: type `http://localhost:8003` and `8003` in the always-open form (the switch next to the name is on by default) → confirm → read the confirmation → Turn on → the row opens and shows both directions and 8003's Agents and Agent Teams. Then: add `localhost:8005` with the box ticked (8005 goes away mid-way: the partial state, then Try again after ~8 s); add `localhost:8004` (the Docker address hint with Use this); ⋯ → Rename / Remove; the This node switch off and on.

- Round 1 feedback (user, 2026-10-22): the Agents switch is hard to understand; adding a node should connect agents without a separate toggle. Applied as option B (DC-714): the Add form's box is ticked by default with clearer words, the one confirmation still follows (it changes the other node), and an unconnected row says so in plain words with a Turn on button. **Requirement impact for the Solution Designer:** REQ-704 / DEC-707 (collaboration off by default when adding) is replaced by "ticked by default, confirmed once"; QR-702 (explicit confirmation) still holds. Waiting for the user's look and approval of this version.
- Round 1 feedback 2 (user, 2026-10-22): the ⋯ menu for Rename and Remove is not clean. Applied (DC-715): click the name to rename (Enter saves); Remove is a plain line in the expanded row. No menu.
- Round 1 feedback 3 (user, 2026-10-23): keep Remove visible and move the expand chevron to the left. Applied (DC-716): chevron on the left; a quiet trash icon at the right end of the row opens the confirmation.
- Round 1 feedback 4 (user, 2026-10-23): one icon for remote collaboration in the section and on each row. Applied (DC-717).
- Round 1 feedback 5 (user, 2026-10-23): Open as an icon. Applied (DC-718).
- Round 1 feedback 6 (user, 2026-10-23): counts of Agents and Teams under the bar once collaboration is on (click for details), no left chevron, bigger Open and Remove. Applied (DC-719).
- Round 1 feedback 7 (user, 2026-10-23): the add inputs always visible; the collaboration toggle to the right of the name. Applied (DC-720).
- Round 1 feedback 8 (user, 2026-10-23): remove the "Added …" notice. Applied (DC-721).
- Round 1 decisions delegated to the designer (user, 2026-10-23: "you decide … you understand and could reason"): DEC-709 → option (b); Remove also removes this node on the other side when reachable (PA-703); Agents and Teams show once the switch is on (PA-701); no toast when a node is added, the row carries the notice for an unavailable node (PA-707). The user has not yet given the explicit final approval of the page.

## Outcome And Handoff

- Next expected action: the Solution Designer integrates `ui-ux-spec.md` and the 31 final references into the requirements (the requirement impacts are listed in the spec's "Open Decisions And Risks"), finishes the design and sends it to architecture review round 2.
- Handoff target on completion: Solution Designer, run `solution_designer_ab22860c1d5f4de5974921c0128991f5`.

## Delivery And Validation

- UI/UX specification: `ui-ux-spec.md` (Approved). Final references: `visual-references/VIS-001 … VIS-031`. Supporting: `design-change-log.md` (DC-701 … DC-723), `design-assumptions.md`.
- Runnable UI reference entry point: `/nodes?nodeTab=manage`; scenarios `nodes_user`, `nodes_states`; contexts `electron_internal`, `electron_external`, browser; runbook section `one-nodes-tab`.
- User-confirmation reference: the user's message "i think we are ready. approved", 2026-10-23, in the Product UI/UX Designer conversation.
- Final check (designer, in the browser, no committed scripts; a disposable Playwright capture script in `/tmp`): the approved journeys through the product's normal entry point: add 8003 and confirm (running, done, counts under the bar, details open); add with the switch off (plain line, Turn on); turn off, Remove, rename (error, click away, Esc); duplicate and invalid fields; not reachable on add; `localhost:8005` partial result, Try again; `localhost:8004` Docker hint with Use this; all row states in `nodes_states` (off there, not registered there, different node, not reachable, checking up to 20 s, registered only by the other node, not collaborating, laptop's numbered name and address); Change address; This node switch off and on; the Docker window and its loopback hint; the browser (no Open); Chinese; 390 px; the old `?nodeTab=remoteCollaboration` URL opens Manage Nodes; the Docker Guide link opens the Docker Guide tab. A gap found in the final pass (only the address error showed when the name was also invalid) was fixed and re-captured before finalizing.
- Data-boundary check: all nodes, names, IDs, addresses, agent names and delays are invented (`prototype/nodes/nodeWorld.ts`, `prototype/remote-collaboration/offersScript.ts`); nothing real, captured or replayed; the host mock seeds the desktop list with invented entries.
- Baseline status: applicable accepted baseline `ui-baseline-report.md` (`WEB-BASELINE-REFRESH-012`) plus the accepted `remote-nodes-page` design; no refresh or correction was needed (see "Design & Repository Context").
- Obsolete reference code removed with the Remote Collaboration tab: `RemoteCollaborationCard.vue`, `RemoteCollaborationPeersSection.vue`, `CurrentWindowNodeCard.vue`, the remote-collaboration stores, GraphQL documents and fixtures, `nodeCapabilityProbe.ts`, `nodeHostValidation.ts`, the `collab_peers` scenario and their strings.

## Final Integration

- Integration result: `Completed`. The ticket result was pushed as a fast-forward to the remote default branch (`git push origin design/one-nodes-tab:personal`, `d9e25db..371e2ef`) and the canonical checkout `/Users/normy/autobyteus_org/autobyteus-web-design` was fast-forwarded to it.
- Design result commit (UI reference, spec, 31 final references, runbook, change log): `371e2ef0510d6b0dae471e63bd49f48d357e6cf6` on `design/one-nodes-tab`. This integration record is the finalization commit after it; the final local and `origin` revisions of `personal` are in the handoff (the record cannot name its own commit).
- Default-entry-point check (from the canonical checkout at `371e2ef`, `corepack pnpm dev --port 4802`, scenario `nodes_user`): `/nodes?nodeTab=manage` shows the five tabs (no Remote Collaboration), adding `http://localhost:8003` opens "Let agents work with 8003?", Turn on ends with "3 Agents · 1 Agent Team" under the row, no notice, no console error. No preview URL or preview-only state was used.
- Ticket moved to `tickets/done/one-nodes-tab/` in the finalization.
- Runtime: the review dev server on port 4801 and the check server on 4802 (both started by this ticket) were stopped.
- Cleanup: the ticket worktree `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/one-nodes-tab` is removed after this record is pushed; the branch `design/one-nodes-tab` is kept locally (no remote branch was pushed).
