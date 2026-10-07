# Product Ticket — restore-native-workspace-folder-picker

## Identity And Scope
- Ticket / package: `restore-native-workspace-folder-picker` (unchanged; no second task ID).
- Title: Restore native workspace folder selection in the existing shared menu.
- Mode: **Product Experience Design**; an existing Chat/run-settings surface, not an abstract visualizer.
- Status: **In Progress** — reassessing baseline applicability; earlier refresh instruction on hold. See baseline-conclusion-correction.md.
- Date: 2026-10-07.
- Requester: `/solution_designer`, AgentRun `solution_designer_8993f6a03d49417985e8805609b803ce`.
- Product execution: `product_ui_ux_designer_f1b47b534b5e4da49ef50e43e23fbef3`.
- Assigning task: `ad_hoc_task_45079b88-f602-4945-a4a3-57627cd9762e`; remains open.
- Requirements: R2 Draft, SR-004; no requirements or UI approval.
- Canonical request: /Users/normy/autobyteus_org/autobyteus-worktrees/restore-native-workspace-folder-picker/tickets/in-progress/restore-native-workspace-folder-picker/product-design-request.md
- Canonical requirements: /Users/normy/autobyteus_org/autobyteus-worktrees/restore-native-workspace-folder-picker/tickets/in-progress/restore-native-workspace-folder-picker/requirements-doc.md
- Investigation and revision: /Users/normy/autobyteus_org/autobyteus-worktrees/restore-native-workspace-folder-picker/tickets/in-progress/restore-native-workspace-folder-picker/investigation-notes.md; /Users/normy/autobyteus_org/autobyteus-worktrees/restore-native-workspace-folder-picker/tickets/in-progress/restore-native-workspace-folder-picker/solution-revision-record.md
- IDs: SCN-001..005, BEH-001..004, UC-001..003, REQ-001..004, AC-001..007, DEC-001.
- Critical decision: where users discover native folder choice, how it coexists with typing, when a selected path becomes the workspace, and non-destructive cancel/error/retry.
- Scope: Chat Agent/Team setup; Org setup; currently editable placed-Team workspace controls.
- Preserve: local embedded Electron only, manual path entry, search/existing/temp, absolute-path validation, known-path reuse, pending-folder lifecycle, saved-run locks, save/launch ownership.
- Non-goals: remote filesystem browsing, browser/mobile native picker, production implementation, persistence/migration, unrelated redesign, deployment.

## Design & Repository Context
- Canonical design repository: /Users/normy/autobyteus_org/autobyteus-web-design
- Remote: `https://github.com/AutoByteus/autobyteus-web-prototype.git`.
- Default/integration branch: `personal`; `origin/HEAD` refreshed and points to it.
- Local and remote default revisions at intake: `8cd41f886459630909e827d7df1b67910618aaac`; no local-only commits; canonical checkout clean.
- Active ticket worktree: /Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker
- Branch: `design/restore-native-workspace-folder-picker`; created from freshly fetched `origin/personal`.
- Worktree ownership: this Product execution; Bootstrapper receives write authority for baseline source/evidence only. No other ticket worktree reused.
- Selected source frontend (read-only): /Users/normy/autobyteus_org/autobyteus-worktrees/restore-native-workspace-folder-picker/autobyteus-web
- Explicit source pin: `88fad73cbd20201642acdcfe75e69b1897ec135c` (request's isolated source HEAD confirmed).
- Historical accepted design baseline: `b4f3ed12c8402458391917d08945977ab80ea167`, source `10fb69504f99a615e0728ffdd6c1fcab0104ff05`, plus subsequent integrated approved Product changes at `8cd41f886459630909e827d7df1b67910618aaac`.
- Applicable current-experience acceptance: **not yet accepted** for this request. The root baseline report is stale relative to selected source; inherited captured fixtures violate the current boundary.
- Baseline report: /Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker/ui-baseline-report.md
- Product acceptance: historical only; no acceptance of a refreshed candidate yet.
- Ticket revision: see Git history for the intake checkpoint; no future-state source revision.
- Integration: Pending; do not integrate unaccepted baseline or claim UI completion.
- Default-entry-point validation: Not run this stage; baseline prerequisite unresolved.
- Runtime: ports 4581–4584 available at intake (not bound/reserved by an OS lock); intended reference dev/preview/source-observation/stub respectively. Recheck before use. No process started. Scratch ownership: `/tmp/autobyteus-design-restore-native-workspace-folder-picker`; no shared state. Future state must be synthetic/resettable; no user app/data.
- Cleanup: Pending; preserve this worktree for baseline handoff. No owned server to stop.
- Ticket folder: /Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker/tickets/in-progress/restore-native-workspace-folder-picker

## Delivery And Validation
- UI/UX spec: **not produced**; final behavior and user approval pending.
- Reviewable future-state UI/reference screenshots: **not produced**; do not present old references as this design.
- Planned normal entry: `/chat`; Org setup and editable members via normal Library/run navigation.
- Supporting records: `intake-review.md`, `baseline-request.md`, `product-handoff.md` in this folder.
- Validation: Git identity/status/worktree checks, source inspection and fixture provenance/size audit only. No browser, production test or native-dialog evidence this stage.
- User-confirmation reference: **None**. “Work on the UI first” authorizes design, not the draft Browse placement or fill-then-Use-folder sequence.
- Mock boundaries: eventual browser reference simulates native selection/cancel/failure and backend lifecycle; cannot prove actual OS picker, Electron bridge, filesystem or production save/launch.

## Outcome And Handoff
- Outcome: Earlier **Baseline Needed (Refresh)** conclusion under correction; no evidence yet that current UI itself is stale. Captured-data boundary remains a separate unresolved issue.
- Completed: intake, source/repository identity, preserved-boundary recording, isolated worktree, baseline acceptance audit.
- Remaining decisions: placement/discovery, manual versus browse hierarchy, apply step, feedback/cancel/retry/focus; all remain open for user review after a credible baseline.
- Next action: Bootstrapper returns an independently runnable source-current baseline with small hand-written synthetic state. Product then reviews/accepts and integrates the baseline before making the focused proposal.
- Matching rule: Baseline Needed → `/product_team/ui_baseline_bootstrapper`; send fixed payload only, no requirements/ticket package.
- Return on eventual user-reviewed package or blocker: assigning Solution Designer run above, with absolute `product-handoff.md` path; canonical requirements reconciliation remains theirs.
- Original dispatch confirmed: ui_baseline_bootstrapper_9f22a91a249f48f7bf87803f910b026c. Hold/correction requested after user challenge; see baseline-conclusion-correction.md.
