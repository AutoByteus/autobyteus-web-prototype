# Product Ticket: semantic-memory-view-554

## Identity And Scope

- Ticket / request ID: `semantic-memory-view-554` (package `semantic-memory-for-every-agent`, Project Task autobyteus-554)
- Title: Semantic memory ON for every agent + a read-only view of each agent's semantic memory in the Memory area
- Status: `Awaiting User Review` (round 1 sent 2026-11-19; the founder approves)
- Requested by: Solution Designer (`solution_designer_703182187282472484b90793eac8be40`), for the founder, 2026-11-19
- Related requirements revision: `requirements-doc.md` SR-003 (`/Users/normy/autobyteus_org/autobyteus-worktrees/semantic-memory-for-every-agent/tickets/in-progress/semantic-memory-for-every-agent/requirements-doc.md`)
- Related IDs: REQ-004, REQ-005, REQ-006, REQ-007, REQ-008; AC-004 … AC-008; DEC-003, DEC-004, DEC-005, DEC-008, DEC-009
- Critical journey: Memory → Browse → (the agents with semantic memory) → an agent's semantic folder → its files → a file's content; and Memory → Browse → Agents → an agent's runs page → its semantic memory. Agents page → an agent's detail shows its folder path.
- Decision questions: entry point; how the list of agents with semantic memory looks; how a folder's files are browsed; how a file's content is shown; empty, loading, error and edge states (empty / missing folder, symbolic link, truncated listing, imported memory source, internal agents).
- In scope: `/memory` Browse section and the agent's runs page; the new semantic memory view; the Agents page's agent detail (folder path for every agent; the switch is removed); en and zh-CN.
- Non-goals: the phone; editing or deleting semantic files; global semantic memory (autobyteus-555, room only); server or runtime behavior.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Design ticket worktree / branch: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/semantic-memory-view-554` / `design/semantic-memory-view-554`
- Source repository and selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`, read only
- Pinned source revision for the scoped surfaces: `origin/personal@8430d9ef12` (after the refresh)
- Accepted base revision: `0e729ec82e44136c5930f59b4005e829dd6b688b` (`personal` after the baseline refresh `memory-baseline-refresh-554` was accepted and integrated)
- Baseline report: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md`
- Runtime isolation: dev server port 4554 owned by this ticket; in-memory state, reset by reload
- Ticket folder: `tickets/in-progress/semantic-memory-view-554/`

## Delivery (in progress)

- Review notes: `tickets/in-progress/semantic-memory-view-554/design-review-notes.md` (journeys J-1…J-5, starting states, alternatives, findings F-1…F-3)
- Review URL: http://localhost:4554/memory (dev server of this worktree, port 4554)
- Checked in the browser (1440×900 and 1024×768, en and zh-CN): J-1…J-5; imported source; empty node; list error and Retry; truncated list; refused file; loading; Show internal agents on.

## Outcome And Handoff

- Next expected action: the founder reviews round 1 (through the Solution Designer); feedback → `In Progress`; approval → final screenshots and `ui-ux-spec.md`.
