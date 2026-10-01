# Prototype Change Log — cross-scope-agent-mentions-sr008

Base: `personal@9ca5651` (approved package `tickets/done/cross-scope-agent-mentions/`, PC-001–PC-027). Source pin `origin/personal@e9aa4a7`.

| ID | Round | Change | Surface | IDs |
| --- | --- | --- | --- | --- |
| PC-028 | 1 | The collaborator is added when the user sends the `@` message (one per definition and run) and shows Offline until its first message. Supersedes the add-by-delegation of PC-004. | local run, run tree | REQ-003, REQ-013, D-R2 |
| PC-029 | 1 | The focused agent briefs the collaborator with a `send_message_to` card addressed to it (`/product team`, `/computer use agent`); no `delegate_task`. | conversation | REQ-003, REQ-005, SC-001/002 |
| PC-030 | 1 | The briefing is an ordinary message: a Team/Org tab row (from the focused agent to the collaborator) and an inter-agent delivery at the top of the collaborator's conversation, rendered as the product renders `send_message_to` deliveries today (user-style message). The system task notice is no longer used for collaborators. Supersedes PC-020 for collaborators. | Team/Org tab, collaborator conversation | REQ-005, AC-004 |
| PC-031 | 1 | Adding is checked on send. On failure nothing is added, the message is not sent, no agent turn starts, the draft text and chips stay in the composer, and the red notice shows. Supersedes PC-009's agent-turn failure. | composer, notice | REQ-007, D-R1 |
