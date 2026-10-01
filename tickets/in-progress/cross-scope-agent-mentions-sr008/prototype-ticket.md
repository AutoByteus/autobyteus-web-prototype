# Prototype Ticket

## Identity And Scope

- Product ticket: `cross-scope-agent-mentions-sr008`
- Stable requirements package: `cross-scope-agent-mentions`, SR-008 (Approved 2026-10-01)
- Title: Collaborator reached with `send_message_to`; briefing as an ordinary message; add checked on send
- Status: `Awaiting User Review`
- Mode: `Product Experience Prototyping` (user-directed revision of the approved package `tickets/done/cross-scope-agent-mentions/`)
- Requester: Solution Designer (`/software_engineering_team/solution_designer`), Product Design Requested (New Request), 2026-10-01
- User words: "approved. ask product prototyper to update UI thanks"
- Requirements context (read-only): `/Users/normy/autobyteus_org/autobyteus-worktrees/cross-scope-agent-mentions/tickets/in-progress/cross-scope-agent-mentions/` (`product-design-revision-request-handoff.md`, `requirements-doc.md`, `solution-revision-record.md`)

## Decision Questions

- RD-001 (REQ-003/005/013, SC-001/002): the focused agent reaches the collaborator with `send_message_to` by address; the collaborator is added when the user sends and shows Offline until its first message (D-R2).
- RD-002 (REQ-005, AC-004): the briefing is an ordinary message — a Team/Org tab row and an inter-agent delivery in the collaborator's conversation; no system task notice for collaborators.
- RD-003 (REQ-007, D-R1): adding is checked on send; on failure nothing is added, the message is not sent, the draft and chips stay, and the red notice shows.
- RD-004 (open, presentation): how the inter-agent briefing looks in the collaborator's conversation (product today: user-style message without a sender).
- Unchanged: `@` menu, chips, inline mentions, empty states, task-row look, standalone-run rows, Team tab presence, small window, accessibility.

## Repository And Baseline

- Canonical prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`
- Product task worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/cross-scope-agent-mentions-sr008`
- Product ticket branch: `prototype/cross-scope-agent-mentions-sr008`
- Accepted prototype base: `9ca5651` (`personal` = `origin/personal`), which includes the approved package
- Source pin: `origin/personal@e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71` (accepted baseline `WEB-BASELINE-REFRESH-003`; no refresh requested)
- Baseline status: `Accepted`

## Runtime

- Review port (ticket-owned): `3284`; temporary state root: `/tmp/autobyteus-prototype-cross-scope-agent-mentions-sr008`

## Evidence At Intake

- RD-004 product behavior (source `origin/personal@8caa610ff`): a `send_message_to` delivery reaches the recipient as `MEMBER_INPUT_MESSAGE` with `input_origin: inter_agent_delivery`; `memberInputMessageHandler` → `buildUserMessageFromProjectionPayload` renders it as a user-style message without a sender. Stored conversations do the same (`runProjectionConversation`: role `user`). The `InterAgentMessageSegment` ("From <sender>:") exists but its `INTER_AGENT_MESSAGE` event is filtered out of Team/Org streams (`collaboration-agent-presentation-adapter.ts`: `filtered_collaboration_duplicate`). F-003 is therefore confirmed: user-style today.

## Review Round 1

- Review URL: http://127.0.0.1:3284/workspace (ticket-owned dev server)
- Changes: PC-028–PC-031 (`prototype-change-log.md`)
- Browser validation: `validate-cross-scope-agent-mentions.mjs` 49/49 (new V-49 Offline before first message, V-50 `send_message_to` not `delegate_task`, V-51 blocked send), 0 page errors (`review-evidence/round-1/results.json`)
- Non-normative screenshots: `review-evidence/round-1/` (VIS-004/005/007/010/012/013 states)
- Question to the user (RD-004): keep the briefing in the collaborator's conversation as the product shows `send_message_to` deliveries today (user-style message, no sender), or show it with its sender?

## Review Round 2

- Question RD-004 asked; user: "what do you think then?" → recommendation: show the sender with the existing "From <sender>:" style for all agent-to-agent messages, flagged as product-wide. User: "okayyyy. agreed".
- Change: PC-032. Evidence: `review-evidence/round-2/` (`r2-focused.png`, `r2-collaborator.png`, validation 49/49).

## Status History

- 2026-10-01: opened from Solution Designer request (SR-008); `In Progress`.
- 2026-10-01: round 1 review URL ready; `Awaiting User Review`.

## Finalization

- Integration result: `Pending`
- Cleanup result: `Pending`
