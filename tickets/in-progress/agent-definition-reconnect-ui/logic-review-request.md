# Logic Review Request — Reconnect UI (round 5)

- Ticket: `agent-definition-reconnect-ui` · package `run-continuity-after-agent-definition-rename` (SR-009)
- Requested by the user (2026-10-07): "i am fine with the UI" / "But i am not sure whether solution
  designer thinks the logic is correct or not".
- Review URL: <http://127.0.0.1:3291/workspace> (reload to restart the example)
- Design branch / revision: `design/agent-definition-reconnect-ui` @ `1254a69`
- Worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/agent-definition-reconnect-ui`
- Screenshots: `review-evidence/round-2/` in this folder.

## What the UI shows (round 5, user-accepted visuals)

- Composer, before sending: one amber line "⚠ Agent tutorial-video-producer no longer exists" + Reconnect.
- Conversation after a failed send: one red line "Agent X no longer exists" + Reconnect; stays
  (DEC-013); after reconnect a grey line "X reconnected to Y".
- Picker dialog: "Reconnect to an agent" · "Replaces X. History and session are kept." · search ·
  "Similar names" (max 3) · "All agents" A–Z · Cancel / Reconnect.
- After success: green line "✓ Reconnected to Y" (+ "· instructions apply from a new session" on
  Antigravity/Grok), ends at the next message or ×.
- Settings (⚙): one amber bar per missing agent of the run (configured members and collaborators),
  e.g. "editor: agent no longer exists" + Reconnect; after success a green bar.
- Workspaces tree: small amber ⚠ on the agent group (standalone) or on the member/collaborator row.

## Logic the design assumes — please confirm or correct

| # | Rule | Requirement link | Question |
| --- | --- | --- | --- |
| L1 | "Missing" is shown before any send when the run record's agent id is not in the client's agent catalog. Sending is not blocked; the server error still appears if the user sends. | REQ-001, AC-001, AC-010 | Is the client catalog check acceptable as the pre-send signal (server stays the authority)? |
| L2 | One Reconnect at a time: the composer bar hides while the newest conversation item is the missing-agent error (that card has its own Reconnect). | REQ-001, AC-010 | OK? |
| L3 | Reconnect is per agent run: the standalone run, a configured member and a collaborator are each reconnected separately, even when they used the same old id. | REQ-002, REQ-003 | The build's copy mentioned "{count} agent runs use this definition" (e.g. task copies). Which runs does one reconnect change, and should the success line show a count? |
| L4 | "Similar names": agents sharing at least half of the missing id's words (max 3) are listed first. Nothing is preselected; the user must pick. | Out of scope: "Automatically guessing the new definition" | Does a suggestion list conflict with "no auto-guessing"? |
| L5 | Busy: Reconnect stays available; if the server rejects because the agent run is running, the dialog shows "{name} is running. Stop it, then reconnect." and stays open. No pre-disable. | REQ-002, AC-004, DEC-004 | OK, or should the UI disable Reconnect when it knows the run is running? |
| L6 | The instructions note is shown per reconnected run whose runtime keeps session instructions (Antigravity, Grok); nothing extra for Claude, Codex, AutoByteus. | REQ-004, DEC-010 | OK? |
| L7 | A tree agent group whose agent is gone has no "+" (new run). | (new UI detail) | OK? New runs resolve current definitions only (BEH-004). |
| L8 | After reconnect: standalone run listed once under the new agent; collaborator row and header read "product video producer"; configured member keeps its address name ("editor"). | REQ-003, DEC-005, REQ-007, DEC-011, DEC-012, AC-009 rev | OK? |
| L9 | Settings lists missing collaborators too (they are not in the Members list), not only configured members. | REQ-002 "from the run's configuration" | OK? |
| L10 | No "remove from run" when there is no replacement agent. A standalone run can be archived/deleted with the existing row actions; a team member/collaborator can only be reconnected (or the whole team run archived/deleted). | (user question) | The user asked about this. Is a "remove collaborator from run" a requirement you want to add, or out of scope? |

## Next step

On your answer: corrections are applied as a focused design round; if none, the package is finalized
(final screenshots, `ui-ux-spec.md`, integration) and returned to you as `Design Completed`.
