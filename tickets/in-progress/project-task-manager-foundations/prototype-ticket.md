# Prototype Ticket — Project Task Manager Foundations

## Identity and scope
- Product ticket: `project-task-manager-foundations`.
- Stable package: `PROJ-TASK-MANAGER-20261002-001`; Solution revision `SR-001`.
- Status: `Awaiting User Review` — existing cumulative prototype started for user inspection before brainstorming. No Task Manager proposal implemented.
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
- Projects baseline applicability: not established for the handoff pin. No UI source or future-state UI is being built in this clarification turn. A runnable existing-product proposal requires an applicable accepted baseline first; do not silently treat the cumulative baseline as a verified Projects baseline.
- Repository instructions: no AGENTS.md found in the canonical prototype repository; README read. Shared ticket-template link in the skill is unavailable in this workspace; required lifecycle fields recorded here.
- Intake: canonical checkout clean on `personal`; no branch/worktree for this ticket existed. Existing `cross-node-agent-communication` worktree left untouched. New worktree created at recorded base, clean before ticket artifacts.

## Runtime and evidence boundary
- Ticket-owned runtime: `http://127.0.0.1:3286`; available port verified before launch. Listener PID `51024` (Nuxt), exec session `75723`.
- Runtime files: isolated worktree-local `node_modules` and `.nuxt`; browser-local synthetic state scoped to origin `127.0.0.1:3286`. No source install/service reused.
- Install: `corepack pnpm install --ignore-workspace --frozen-lockfile`; success, lockfile unchanged. Start: `corepack pnpm dev --port 3286`; Nuxt ready. Existing duplicate-import warnings; no startup error.
- Review URL: `http://127.0.0.1:3286/projects/project-prototype-launch`; Projects index at `/projects`.
- Scenario: existing `populated` default with synthetic Projects visible. No installed-app feature toggle or production backend involved. Reload resets mutable fixtures; scenario reset via existing `window.__AUTOBYTEUS_PROTOTYPE__.reset()` when needed.
- Browser smoke verification: Projects index renders synthetic Project link; opening it renders the full-width Project page, Tasks/Workspaces tabs, and To Do/In Progress/Done columns. Browser console error log empty. This is not a source-parity comparison or comprehensive journey test.
- Non-normative screenshot: `review-evidence/current-project-board.jpg` (1512×806); existing prototype only, no future-state approval.
- Current-product policy context comes from Solution Designer's source-investigation handoff. Runtime inspection verifies the older cumulative prototype, not the handoff source pin.
- No final ui-ux-spec.md or normative VIS references. Manager, dependencies, execution linkage and results proposals remain discussion-only.

## Review and finalization
- Review package: `ui-brainstorm-record.md`, BR-001–003 (proposals, not decisions).
- First review focus: DEC-007, manager conversation location relative to the full-width board and existing execution UI.
- User confirmation: no final design approval; UF-001 requests avoiding overlays in primary Projects forms. Exact replacement remains under discussion.
- Ticket revision: discussion opening `66c4c40`; runtime evidence in following ticket commit, see git history. UI source unchanged from accepted cumulative base.
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

## Canonical input references (read-only)
- `/Users/normy/autobyteus_org/autobyteus-worktrees/project-task-manager-foundations/tickets/in-progress/project-task-manager-foundations/product-design-handoff.md`
- `/Users/normy/autobyteus_org/autobyteus-worktrees/project-task-manager-foundations/tickets/in-progress/project-task-manager-foundations/requirements-doc.md`
- Investigation/history references are linked from that handoff and remain Solution Designer-owned.
