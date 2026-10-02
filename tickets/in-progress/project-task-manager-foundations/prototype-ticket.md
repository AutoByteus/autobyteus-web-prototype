# Prototype Ticket — Project Task Manager Foundations

## Identity and scope
- Product ticket: `project-task-manager-foundations`.
- Stable package: `PROJ-TASK-MANAGER-20261002-001`; intake `SR-001`, latest received canonical draft `SR-002`.
- Status: `Awaiting User Review` — UF-016 earlier Existing workspace / New folder buttons restored and browser-validated. Other simplification changes preserved; broader Task Manager discussion remains open.
- Selected mode: Product Experience Prototyping; this concerns the existing Projects experience. No exploratory-visualizer mode.
- Request: Solution Designer's Product Design Requested handoff, 2026-10-02; user explicitly requested UI brainstorming.
- Scope: clarify manager entry/context, durable Tasks, dependencies, execution attempts, results and updates (DEC-001–010; SCN-001–006). Canonical requirements remain Draft.
- No production implementation, architecture authorization, feature enablement, or data changes.

## Repository and isolation
- Canonical prototype repository: `/Users/normy/autobyteus_org/autobyteus-web-prototype`.
- Active Product worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/project-task-manager-foundations`.
- Ticket branch: `prototype/project-task-manager-foundations`.
- Integration/default branch: `personal`.
- Accepted cumulative prototype base at intake: `df2f5cdaf9b168298dcae79ac47c11f31dd82d7c`.
- Source frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web` (read-only).
- Handoff's source pin: `e04cfef23550c3b78286a53befc6bd5d71fb1061`.
- Existing prototype baseline's source pin: `e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71`; report: `/Users/normy/autobyteus_org/autobyteus-web-prototype/prototype-bootstrap-report.md`.
- Current authoring authority: existing cumulative accepted prototype at source pin e9aa4a7, the experience the user inspected and confirmed visually identical to their product. No refresh was requested. Handoff source pin e04cfef remains separate investigation context, not a silent new parity claim.
- Baseline review: established refresh acceptance in `tickets/done/WEB-BASELINE-REFRESH-003/prototype-ticket.md` and paired Projects matrix rows WBR-R031-DEN/DZH/NEN, WBR-R032-DEN/NZH, WBR-S005/S008 pass at pinned source e9aa4a7. User screenshots show current New/Edit dialogs; user confirms current baseline look/navigation parity. Accepted for this focused evolution, not independently revalidated against newer e04cfef.
- DATA-001 reassessment: Bootstrapper confirms source UI/Pinia snapshots seeded by handwritten synthetic fixtures, not raw API-response archives; representative data trace to those fixtures. No copied production records found in inspected provenance. Byte repetition is an internal simplification concern, not a substantiated data-copy/UI-parity failure. Broad baseline correction remains held; no candidate/runtime/source changes. Evidence `review-evidence/DATA-001-assessment.md`. Baseline acceptance remains the existing accepted revision; no new corrected baseline is claimed.
- Repository instructions: no AGENTS.md found in the canonical prototype repository; README read. Shared ticket-template link in the skill is unavailable in this workspace; required lifecycle fields recorded here.
- Intake: canonical checkout clean on `personal`; no branch/worktree for this ticket existed. Existing `cross-node-agent-communication` worktree left untouched. New worktree created at recorded base, clean before ticket artifacts.

## Runtime and evidence boundary
- Ticket-owned runtime: `http://127.0.0.1:3286`; restarted after an interrupted turn, listener PID `80255` (Nuxt), exec session `23963`. Previous PID/session no longer live.
- Runtime files: isolated worktree-local `node_modules` and `.nuxt`; browser-local synthetic state scoped to origin `127.0.0.1:3286`. No source install/service reused.
- Install: `corepack pnpm install --ignore-workspace --frozen-lockfile`; success, lockfile unchanged. Start: `corepack pnpm dev --port 3286`; Nuxt ready. Existing duplicate-import warnings; no startup error.
- Current review URL: `http://127.0.0.1:3286/projects/project-prototype-launch`; existing Task detail at `/projects/project-prototype-launch/tasks/task-outline`. Project form at `/projects/new`; normal Projects index at `/projects`.
- Scenario: existing `populated` default with synthetic Projects visible. No installed-app feature toggle or production backend involved. Reload resets mutable fixtures; scenario reset via existing `window.__AUTOBYTEUS_PROTOTYPE__.reset()` when needed.
- Browser smoke verification: Projects index renders synthetic Project link; opening it renders the full-width Project page, Tasks/Workspaces tabs, and To Do/In Progress/Done columns. Browser console error log empty. This is not a source-parity comparison or comprehensive journey test.
- Non-normative screenshot: `review-evidence/current-project-board.jpg` (1512×806); existing prototype only, no future-state approval.
- Current-product policy context comes from Solution Designer's source-investigation handoff. Runtime inspection verifies the older cumulative prototype, not the handoff source pin.
- New candidate uses a separate handwritten prototype-native state module (`prototype/project-review/useProjectDesignStore.ts`, kilobytes), scripted memory-only saves, native selectors and page navigation. No new capture/replay fixture or production operation introduced. Existing baseline snapshot machinery is unchanged except mapping new routes to their accepted parent shell.
- Round-1 validation: lint passed (repository's configured scope), 16 Vitest tests passed, scoped TypeScript check passed, Nuxt build passed. First build refused the active dev lock; documented `NUXT_IGNORE_LOCK=1` rerun succeeded. Browser checks RV-001–023 passed across desktop and 390×844 narrow layouts; creation with zero/multiple links, descriptions, validation, Edit/Cancel, add later, normal entry and existing board verified. See `review-round-1.md` and `review-evidence/round-1-browser-checks.json`.
- Preview screenshots are non-normative review evidence, not final VIS references. Phone-width verification is not a claim of phone delivery or device/keyboard compatibility. No newer-source parity, backend or orchestration validation claimed.
- Round-2 refinement: Project-created and Changes-saved inline success notices clear after 3000ms while the Project content/tab remains. URL notice marker is removed to prevent resurfacing on tab navigation. Timers are cleaned up on leaving the component; error/action-required messages are unchanged. Seven focused browser checks passed (`review-evidence/round-2-notice-checks.json`), observed expiry ~2.96s/3.01s after visible checks; 16 tests still pass. No fresh build/phone/source-parity audit in this timer-only round.
- Round-3 candidate: Task creation, reading and description editing are pages. Task cards are links; Back to tasks retains per-project search. Deletion remains explicitly confirmed in an inline warning panel, not a popup. Task status remains read-only and no execution/status tools are simulated as real. Small handwritten `useTaskDesignStore.ts` supplies three illustrative baseline task states and scripted session-only changes/counts; existing inherited API store is not used for candidate saves.
- Round-3 validation: configured lint, 21 unit tests, scoped TypeScript check and Nuxt build pass. TP-001–020 browser checks pass across desktop and 390×844 narrow; native create/edit/Cancel, shortcut, identity/status, search context, delete safeguard/removal, not-found recovery, new-Project integration and counts inspected. See `review-round-3.md`. No new source-parity/phone delivery claim. Route generation/dev preparation reset the user's prior mock-created Project; its real installation/data were not involved. Review tab recovered through Projects to the stable baseline New Task page.
- Round-4: agent-style voice/context-file composer added to New/Edit Task, saved file list/inline image preview and board attachment count. Voice is a handwritten sample, not real microphone capture. Files are local metadata/image previews only; no upload or backend persistence. 24 unit tests, configured lint, scoped typecheck and Nuxt build pass; desktop/narrow browser TI-001–020 pass. Native picker fallback verified after extension-permission limitation; no permission changed. See `review-round-4.md`.
- No final ui-ux-spec.md or normative VIS references. Manager, dependencies, execution linkage and results proposals remain discussion-only.

## Review and finalization
- Review package: `ui-brainstorm-record.md` (historical proposals/feedback), `review-round-1.md` (Project candidate and timer supplement), `review-round-3.md` (Task-page candidate), `review-round-4.md` (voice/context-file candidate), `review-round-5.md` (simplification and superseded alternatives), `review-round-6.md` (restored workspace choices).
- Current review focus: simpler continuous three-column board, direct optional workspace authoring, clear adjacent Task Edit/Delete with no metadata disclosure, and creation returning to the board. Voice/context files and non-popup forms remain available. Wider manager/dependency/execution/result decisions remain open.
- User confirmation: no final design approval. UF-001–003 requested the non-overlay prototype and optional workspace authoring; the concrete candidate still needs user review.
- Ticket revision: round-6 is the commit introducing `review-round-6.md`; previous revision `240f2b7` and round-5 candidate `04a8e15`. Round-5 is the commit introducing `review-round-5.md` (resolve through git history); preceding round-4 `89234ba`. Round-3 candidate `ea6e3d2`; round-4 revision is the commit introducing `review-round-4.md` (resolve through git history). Discussion opening `66c4c40`; prior gate record `2788d75`; round-1 candidate commit is the commit introducing `review-round-1.md` (resolve via git history). Source changes are local to this unapproved ticket branch.
- Integration/promotion: Pending; no approved candidate, no integration performed.
- Cleanup: Pending; worktree and ticket-owned runtime retained for requested user inspection. Browser tab marked deliverable; do not stop while user reviews.
- Remote push: not performed.
- Handoff: UF-001 feedback round delivered and canonical SR-002 received. UF-004 user gate now prohibits further interim Solution Designer handoffs: finish Product design and user review first. Accumulate findings within Product artifacts. Overall Product discussion is not complete; no final prototype/spec handed off.

## Status history
- 2026-10-02: isolated Product ticket opened; `In Progress`.
- 2026-10-02: direct brainstorm opening prepared; `Awaiting User Review`.
- 2026-10-02: user asks to start the UI project first; existing cumulative prototype started and verified in Chrome, `Awaiting User Review`. No design choice inferred.
- 2026-10-02: UF-001 overlay feedback received, recorded (`In Progress` during evidence update), alternatives proposed; `Awaiting User Review`. Requirement Impact round prepared for canonical refinement; UI source unchanged. Tool receipt is the delivery authority.
- 2026-10-02: UF-002 requests a preview update; UF-003 adds optional workspace links/descriptions to creation; UF-004 requires Product design/review to finish before any further Solution Designer handoff. `In Progress`; no new handoff performed.
- 2026-10-02: DATA-001 internal provenance assessment returned, correction held with no runtime/UI changes; user's parity feedback preserved. Focused candidate built on the existing accepted baseline. Review validation underway; no further Solution Designer messages.
- 2026-10-02: PC-001–003 implemented and validated in the isolated prototype; round-1 screenshots and 23 browser checks persisted. `Awaiting User Review`; runtime retained, no approval/integration/handoff inferred.
- 2026-10-02: UF-005 asks whether the green creation confirmation should disappear in about three seconds. `In Progress` during localized timer change, then `Awaiting User Review` after create/save/expiry/tab regression checks. User's existing Project state preserved; test used a separate temporary tab. No Solution Designer handoff.
- 2026-10-02: UF-006 asks “possible to make tasks also not popup? think about how to improve the UI”, with New Task overlay screenshot. PC-005–007 page-based Task candidate built and browser-validated; `Awaiting User Review`. No final Product approval or handoff.

- 2026-10-02: UF-007 asks to reuse the agent input audio/attachment pattern. PC-008–009 browser-validated; `Awaiting User Review`. Small voice/file simulations only, no mic/upload/permission change, no Product approval or Solution Designer handoff.

## Canonical input references (read-only)
- `/Users/normy/autobyteus_org/autobyteus-worktrees/project-task-manager-foundations/tickets/in-progress/project-task-manager-foundations/product-design-handoff.md`
- `/Users/normy/autobyteus_org/autobyteus-worktrees/project-task-manager-foundations/tickets/in-progress/project-task-manager-foundations/product-design-handoff-sr-002.md`
- `/Users/normy/autobyteus_org/autobyteus-worktrees/project-task-manager-foundations/tickets/in-progress/project-task-manager-foundations/requirements-doc.md`
- Investigation/history references are linked from that handoff and remain Solution Designer-owned.

- 2026-10-02: UF-008–014 iteratively refined; rejected List view, filters, individual floating-card treatment, workspace counters/Edit/Done steps and Task-information disclosure removed. FS-001–009 browser checks, 24 tests, configured lint, scoped direct typecheck pass. `Awaiting User Review`; no new full build/prepare, Product approval, integration or handoff.

- 2026-10-02: UF-015 workspace-entry question clarified without UI changes; UF-016 explicitly restores earlier Existing/New choices. Template-only correction preserves active drafts. WC-001–006, 24 tests, configured lint, scoped typecheck pass. `Awaiting User Review`; no final approval, integration or handoff.
