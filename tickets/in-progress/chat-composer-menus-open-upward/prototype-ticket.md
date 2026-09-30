# Prototype Ticket

## Identity And Scope

- Product ticket: `chat-composer-menus-open-upward`
- Stable requirements package: `chat-composer-menus-open-upward` (SR-001, requirements Draft)
- Title: New-chat composer menus always open upward; composer moves lower
- Status: `Baseline Needed`
- Mode: `Product Experience Prototyping`
- Requester: Solution Designer (`/software_engineering_team/solution_designer`), Product Design Requested (New Request), 2026-09-30
- User words: "the input message box area is too hihg, causing the workspace dropdown goes down. i feel like its better to always make them go up and move down the input message box a bit."
- Requirements context: `/Users/normy/autobyteus_org/autobyteus-worktrees/chat-composer-menus-open-upward/tickets/in-progress/chat-composer-menus-open-upward/` (`requirements-doc.md`, `investigation-notes.md`, `solution-revision-record.md`, `product-design-request-handoff.md`, `user-screenshot-2026-09-30.png`)

## Decision Questions

- DEC-001 (REQ-001): `@`, `/`, Workspace, Model and Thinking menus on the new-chat page always open upward (wide windows).
- DEC-002 / OQ-002 (REQ-002): how far the composer group moves down.
- DEC-003 / OQ-001 (REQ-003): upward-menu behavior in short windows (minimum height, never flip down?).
- DEC-004 / OQ-003: position of the workspace hint line.
- Preserved: narrow (<640px) bottom sheet, running-conversation input, menu contents/search/keyboard/selection (REQ-004).
- Critical journey: open `/chat` new chat → type `@` → menu opens above → choose; open Workspace/Model/Thinking → menu opens above; repeat at 1440x900, ~1512x952 (user window), 1280x720, a short window, and 390px narrow.

## Repository And Baseline

- Canonical prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`
- Product task worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/chat-composer-menus-open-upward`
- Product ticket branch: `prototype/chat-composer-menus-open-upward`
- Accepted prototype base at creation: `ef5f90998a12dd42c52b422de3ea0634f0e2e887` (source pin `fcd3e83a4`)
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Source authority for this request: `origin/personal@57df63f079363ccab4f2301213f9d8a3458f72fa`
- Baseline status: stale for the affected surface — refresh opened as `WEB-BASELINE-REFRESH-002` (`/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/WEB-BASELINE-REFRESH-002`). Future-state work starts only after that refresh is accepted and merged into this branch.

## Runtime

- Review port (reserved): `3281`
- Temporary state root: `/tmp/autobyteus-prototype-chat-composer-menus-open-upward`

## Status History

- 2026-09-30: opened from Solution Designer request; baseline found stale for the new-chat surface (pin `fcd3e83a4` vs request source `57df63f07`); `Baseline Needed`, waiting for `WEB-BASELINE-REFRESH-002`.

## Finalization

- Integration result: Pending
- Cleanup result: Pending
