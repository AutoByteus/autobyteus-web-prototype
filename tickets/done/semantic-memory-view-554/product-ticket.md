# Product Ticket: semantic-memory-view-554

## Identity And Scope

- Ticket / request ID: `semantic-memory-view-554` (package `semantic-memory-for-every-agent`, Project Task autobyteus-554)
- Title: Semantic memory ON for every agent + a read-only view of each agent's semantic memory in the Memory area
- Status: `Completed` (approved by the founder 2026-11-20 after round 6: "Approved")
- Requested by: Solution Designer (`solution_designer_703182187282472484b90793eac8be40`), for the founder, 2026-11-19
- Related requirements revision: `requirements-doc.md` SR-006 (earlier rounds against SR-003) (`/Users/normy/autobyteus_org/autobyteus-worktrees/semantic-memory-for-every-agent/tickets/in-progress/semantic-memory-for-every-agent/requirements-doc.md`)
- Related IDs: REQ-004 … REQ-008, REQ-010 … REQ-012; AC-004 … AC-010; DEC-003, DEC-004, DEC-005, DEC-008 … DEC-014
- Critical journey: Memory → Browse → (the agents with semantic memory) → an agent's semantic folder → its files → a file's content; and Memory → Browse → Agents → an agent's runs page → its semantic memory. Agents page → an agent's detail shows its folder path.
- Decision questions: entry point; how the list of agents with semantic memory looks; how a folder's files are browsed; how a file's content is shown; empty, loading, error and edge states (empty / missing folder, symbolic link, truncated listing, imported memory source, internal agents).
- In scope: `/memory` Browse section and the agent's runs page; the new semantic memory view; the Agents page's agent detail (folder path for every agent; the switch is removed); en and zh-CN.
- In scope since round 6: Browse → Global, the node's global semantic folder `<memory>/semantic-global` (REQ-012).
- Non-goals: the phone; editing or deleting semantic files; server or runtime behavior.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Design ticket worktree / branch: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/semantic-memory-view-554` / `design/semantic-memory-view-554`
- Source repository and selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`, read only
- Pinned source revision for the scoped surfaces: `origin/personal@8430d9ef12` (after the refresh)
- Accepted base revision: `0e729ec82e44136c5930f59b4005e829dd6b688b` (`personal` after the baseline refresh `memory-baseline-refresh-554` was accepted and integrated)
- Baseline report: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md`
- Runtime isolation: dev server port 4554 owned by this ticket (`__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=normys-macbook-pro.tail0347f8.ts.net corepack pnpm dev --host 127.0.0.1 --port 4554`, the host name allowed for the Tailscale URL); in-memory state, reset by reload
- Ticket folder: `tickets/done/semantic-memory-view-554/`

## Delivery

- Review notes: `tickets/in-progress/semantic-memory-view-554/design-review-notes.md` (journeys J-1…J-5, starting states, alternatives, findings F-1…F-3)
- Review URL: http://localhost:4554/memory (dev server of this worktree, port 4554); on the founder's devices https://normys-macbook-pro.tail0347f8.ts.net:8445/memory (Tailscale Serve entry on 8445 added by this ticket; turn off with `tailscale serve --https=8445 off`)
- Round 2 (founder feedback → Requirement Impact to the Solution Designer → read-only Skills-style folder view): see design-review-notes.md, Round 2
- Checked in the browser (1440×900 and 1024×768, en and zh-CN): J-1…J-5; imported source; empty node; list error and Retry; truncated list; refused file; loading; Show internal agents on.

- UI/UX specification: `tickets/done/semantic-memory-view-554/ui-ux-spec.md`
- Final reference screenshots: `tickets/done/semantic-memory-view-554/visual-references/VIS-001 … VIS-019` (captured 2026-11-20 by clicking from `/` → Memory, 1440×900 and 390×844, 2×)
- Final check (2026-11-20): UXJ-001 … UXJ-006 clicked through from the normal entry point; Global with files, file open, missing; imported source; zh-CN; narrow; agent episodic, semantic (links, empty, missing); team and org members and runs; shared agent from a team; Agents page detail. No page errors.
- Post-approval cleanup (no visible change to the approved journeys): removed the round-1 entries that were no longer reachable from Browse (`view=semantic-detail`, `SemanticMemoryDetail.vue`, the runs page's "Semantic memory" button).

## Outcome And Handoff

- Outcome: `Design Completed`, returned to the Solution Designer (`solution_designer_703182187282472484b90793eac8be40`).
- Integration: see the Integration section (added by the integration record commit).

## Integration

- Result: `Completed` (2026-11-20). Final ticket commit `08e1dbe86924197a72acd35db9020a74e219854c` pushed to `origin/personal` as a fast-forward from the accepted base `0e729ec8`; the canonical checkout `/Users/normy/autobyteus_org/autobyteus-web-design` fast-forwarded to the same revision. This integration record is a later commit on `personal` (pushed the same way).
- Default-entry check: the approved journeys are on `personal` and reached from `/` → Memory → Browse (Global · Agents · Agent Teams · Agent Orgs) with no preview URL or preview-only state; final click-through and screenshots were made on that exact revision.
- Cleanup: dev server on port 4554 stopped; Tailscale Serve entry `https://normys-macbook-pro.tail0347f8.ts.net:8445` (added by this ticket) turned off, other entries unchanged; worktree `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/semantic-memory-view-554` removed; local branch `design/semantic-memory-view-554` deleted (never pushed).
