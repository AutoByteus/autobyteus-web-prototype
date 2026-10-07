# Review Round 1 — Reconnect a run to an agent

- Ticket: `agent-definition-reconnect-ui` (package `run-continuity-after-agent-definition-rename`, SR-009)
- Review URL: <http://127.0.0.1:3291/workspace> (normal product entry; no preview switch)
- Reload the page to start the example again (state is in browser memory).

## Example data (illustrative)

In `prototype-workspace`:

- **Tutorial Video Producer** › "Turn the v2 launch notes into a 60-second product video": a stopped
  Claude run of `tutorial-video-producer`, which was renamed to `product-video-producer`.
- **Video Team** › "Produce the v2 launch video" (stopped):
  - configured member `editor` used `video-editor` (renamed to `video-clip-editor`), on Antigravity;
  - collaborator `tutorial video producer` (added with `@`) used `tutorial-video-producer`, on Claude.
- The agent catalog has about forty agents (shared and team-local).

## The design (one recommendation)

| # | Surface | Design |
| --- | --- | --- |
| D1 | Composer, before sending | When the open run's agent no longer exists, an amber notice sits right above the message box (the product's place for send-related notices): **Agent “tutorial-video-producer” no longer exists** · "It was renamed or removed. Reconnect to an agent to continue. The conversation and session stay the same." · **Reconnect…** |
| D2 | Conversation, after a failed send | The generic red "An Error Occurred" card is replaced, for this error only, by a specific card: **Agent “x” no longer exists** · "It was renamed or removed, so this run could not continue. Reconnect to an agent, then send your message again." · **Reconnect…**. It stays (DEC-013). While it is the newest item, the composer notice hides, so there is one Reconnect at a time. After a reconnect the card turns grey: "✓ Reconnected to Product Video Producer." |
| D3 | Picker | A dialog in the product's dialog frame with the agent switcher's rows: what the run used, what is kept, search, then **Similar names** (agents sharing at least half of the missing id's words, max 3) and **All agents** A–Z. Each row: initials, name, folder id, a violet team badge for team-local agents. Nothing is preselected (no auto-guessing). ↑/↓ select, Enter reconnects, Esc cancels, double-click reconnects. |
| D4 | Success | The dialog closes immediately. Above the message box: green **Reconnected to Product Video Producer** · "Send a message to continue where you left off." On Antigravity/Grok, one more line: "Tools and skills apply from the next message. Antigravity keeps this session’s original instructions, so Video Clip Editor’s instructions apply from a new session." It ends with the next message or ×. |
| D5 | Busy / failure | Shown in the dialog footer, dialog stays open with the selection: "editor is running. Stop it, then reconnect." / "Couldn’t reconnect: <reason>." |
| D6 | Run settings (⚙) | No yellow box. The same small note line the panel already uses for "needs a refresh": "⚠ editor: agent “video-editor” no longer exists. **Reconnect…**", one per affected agent (members and collaborators). After success: "✓ editor reconnected to Video Clip Editor. Its instructions apply from a new session (Antigravity)." A configured member's row also says **Agent missing ·** before its settings summary, like "Customized ·". |
| D7 | Workspaces tree | A small amber ⚠ after the agent group name (standalone runs) or after a member/collaborator name, so a broken run is visible before opening it. A group whose agent is gone has no "+" (a new run with it cannot start). After reconnect: the standalone run is listed once under the new agent (DEC-005); the collaborator row reads "product video producer" (DEC-012); configured members keep their address name (DEC-011). |
| D8 | Header | No new element. Status returns from Error to Offline after reconnect; a collaborator's header follows its row name. |

## Alternatives considered (not built)

- **Block sending while the agent is missing** (disable Send). Rejected: the client's catalog can be
  stale and the server stays the authority; keeping the product's send path keeps AC-001/AC-010 as
  approved. The pre-send notice already tells the user before they type.
- **Popover picker that reconnects on click** (like the agent switcher). Rejected: Reconnect is not
  offered again after success (AC-006), so a mis-click cannot be undone from the UI; a dialog with a
  confirm button is safer.
- **Grouping the picker by source** (private / shared / team-local sections). Rejected for now: the
  user searches by name; source shows as a badge. "Similar names" covers the rename case.
- **Keeping the success message inside the dialog with a Done button** (current build). Rejected:
  closing the dialog shows the real outcome in place (row name, header, notice).

## Decisions for the user

1. Is the "Similar names" section acceptable? It never selects for you, but it does suggest.
2. The pre-send notice + error card pair (one Reconnect visible at a time) — right balance?
3. Wording: "Reconnect…" everywhere (the build said "Reconnect to agent…").

## Findings (for the Solution Designer)

- F-001 (DEC-012 / AC-009 rev): the collaborator **header** follows its row name ("product video
  producer"), as AC-009 rev says; configured member headers already show their address name.
- F-002: the product has no app-wide dark theme on these surfaces (Tailwind `darkMode` not
  configured; run settings, tree and chat menus define light styles only). The redesign specifies
  light styles; the old card's stray `dark:` classes are not carried over.
- F-003 (suggestion, not a requirement): "Similar names" is a new UI suggestion; it does not change
  "no auto-guessing" because nothing is chosen for the user. Needs user confirmation (decision 1).
