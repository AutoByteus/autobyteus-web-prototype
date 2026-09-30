# Prototype Ticket

## Identity And Scope

- Product ticket: `chat-composer-menus-open-upward`
- Stable requirements package: `chat-composer-menus-open-upward` (SR-001, requirements Draft)
- Title: New-chat composer menus always open upward; composer moves lower
- Status: `Completed`
- Mode: `Product Experience Prototyping`
- Requester: Solution Designer (`/software_engineering_team/solution_designer`), Product Design Requested (New Request), 2026-09-30
- User words: "the input message box area is too hihg, causing the workspace dropdown goes down. i feel like its better to always make them go up and move down the input message box a bit."
- Requirements context: `/Users/normy/autobyteus_org/autobyteus-worktrees/chat-composer-menus-open-upward/tickets/done/chat-composer-menus-open-upward/` (`requirements-doc.md`, `investigation-notes.md`, `solution-revision-record.md`, `product-design-request-handoff.md`, `user-screenshot-2026-09-30.png`)

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
- Current accepted prototype base: `045a4f7` (`WEB-BASELINE-REFRESH-002`, source pin `origin/personal@57df63f079363ccab4f2301213f9d8a3458f72fa`), merged into this branch
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Source authority for this request: `origin/personal@57df63f079363ccab4f2301213f9d8a3458f72fa`
- Baseline status: `Accepted` — refreshed by `WEB-BASELINE-REFRESH-002` (`tickets/done/WEB-BASELINE-REFRESH-002/`), integrated into `personal` and merged here.

## Runtime

- Review port (reserved): `3281`
- Temporary state root: `/tmp/autobyteus-prototype-chat-composer-menus-open-upward`

## Review Round 1

- Review URL: http://127.0.0.1:3281/chat (ticket-owned dev server, port 3281)
- Changes: PC-001–PC-004 (`prototype-change-log.md`)
- Proposed answers:
  - OQ-001 / DEC-003: always up at every window height; height = min(preferred, space above anchor − 6px − 16px); list scrolls; never flips down, never off-screen. No minimum floor is needed: the heading and subtitle always sit above the composer, so a 1024x440 window still gives the `@` menu 166px.
  - OQ-002 / DEC-002: `pt-10 pb-[6vh]` → `pt-[14vh] pb-10`: 56px lower at 952px tall (user window), 50px at 900, 32px at 720.
  - OQ-003 / DEC-004: hint line stays directly under the composer; no menu covers it anymore.
- Browser validation (`review-evidence/round-1/geom.mjs`, 0 page errors): all five menus open above at 1512x952, 1280x720, 1024x520, 1024x440, and stay on screen; narrow 390x844 keeps the bottom sheet; the running-conversation `/` menu still opens above.
- Static checks: typecheck exit 0, lint pass, test 12/12.
- Non-normative review screenshots: `review-evidence/round-1/` (`refresh-4199-at.png` = current behavior).

## Final Package

- User confirmation: user message 2026-09-30 — "Okay, I'm satisfied. The work is done." (after confirming "they will always go upward … instead of downward" and being told the full rule)
- UI/UX specification: `tickets/done/chat-composer-menus-open-upward/ui-ux-spec.md` (`Approved`)
- Final visual references: `visual-references/VIS-001`–`VIS-010` + `manifest.json` (SHA-256)
- Behavior matrix: `ui-behavior-test-matrix.md`; change log: `prototype-change-log.md` (PC-001–PC-004)
- Final validation from the default entry `/`: `prototype/scripts/validate-chat-composer-menus-open-upward.mjs` 15/15, 0 page errors, 0 external requests (`review-evidence/final-validation/results.json`); typecheck exit 0, lint pass, test 12/12
- Decisions: DEC-001 always up (≥640px); DEC-002 padding `pt-[14vh] pb-10` (56px lower at 952px tall); DEC-003 height = min(preferred, space above − 22px), list scrolls, never flips, no floor; DEC-004 hint stays under the composer
- Default entry point: `/` → `/chat`; the approved behavior is the normal product shell, no preview-only state

## Status History

- 2026-09-30: opened from Solution Designer request; baseline found stale for the new-chat surface (pin `fcd3e83a4` vs request source `57df63f07`); `Baseline Needed`, waiting for `WEB-BASELINE-REFRESH-002`.
- 2026-09-30: refresh accepted and integrated (`personal@045a4f7`), merged; `In Progress`.
- 2026-09-30: round 1 review URL ready; `Awaiting User Review`.
- 2026-09-30: user approved; final validation 15/15, references captured; `Completed`.

## Finalization

- Integration result: Pending
- Cleanup result: Pending
