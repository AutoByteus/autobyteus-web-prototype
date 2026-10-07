# Product Ticket — chat-new-draft-kept-on-navigation

## Identity And Scope

- Product ticket: `chat-new-draft-kept-on-navigation`. This is the stable package identifier; there is no second ID.
- Stable package: `chat-new-draft-kept-on-navigation`, solution revision `SR-002`.
- Title: Unsent New chats are kept as Draft rows directly under the Chat row.
- Mode: `Product Experience Design` (evolves the accepted AutoByteus Web baseline: left panel and New chat).
- Status: `Completed` (user confirmation 2026-10-07: "i am satisfied. i confirm now").
- Requester: Solution Designer (`/solution_designer`) for the user, 2026-10-07.
  - User: "could you delegate a task to Product Team to work on the UI first?"
- Request package:
  `/Users/normy/autobyteus_org/autobyteus-worktrees/chat-composer-draft-persistence/tickets/in-progress/chat-new-draft-kept-on-navigation/product-design-request.md`
- Requirements context: `requirements-doc.md` and `investigation-notes.md` in the same folder.
  Status `Ready for Approval` (SR-002); not approved yet.
- In-scope IDs: BEH-001, BEH-002, BEH-004, BEH-006, BEH-007; REQ-001–008; AC-001–007;
  SCN-001–004; DEC-002, DEC-004, DEC-005.
- Canonical design result: `ui-ux-spec.md` and `visual-references/VIS-001`–`VIS-008` (this folder).

## Approved Design (summary; `ui-ux-spec.md` is canonical)

- A New chat becomes a Draft once it has typed text. Attachments, `/` skills, target, model or
  workspace alone do not, and a New chat without text is not kept when another starts. A lone
  `/command` being typed is not text yet.
- Draft rows sit directly under the Chat row, newest started first. Each row is one 32px line with the
  text preview only (13px, `gray-700`), aligned with the "Chat" label. There is no marker, target,
  count, icon or rail.
- The open draft's row is selected (`bg-gray-100`, `gray-900`), and the Chat row is then not selected.
- Clicking a row reopens the draft exactly as left.
- Chat, the pencil, Run and "+" always start a blank New chat and keep drafts.
- A × (hover, focus, selected row, touch) discards the draft, with no confirmation.
- A successful send removes the row.
- Clearing an open draft's text shows "Empty draft" until the user leaves it.
- The collapsed strip is unchanged (no count).
- The narrow drawer shows the same rows.

## Review Rounds

- Round 1: two-line rows (preview; amber "Draft" · Agent/Team icon · target · file count), a guide
  rail, an amber count badge on the collapsed Chat icon, and attachment-/skill-only drafts.
- Round 2 (user: "We don't need to show the word, draft ... the name ... Just the one line would be
  enough"): one-line preview rows.
- Round 3 (user: "Only when there are text, then you save draft" / "we don't need this vertical
  line"): text-only drafts; files/skill previews and the rail removed.
- User confirmation: "i am satisfied. i confirm now".
- After confirmation (user: "we don't need this number on the chat because it gives people confusion
  ... We don't need that extra thing"): collapsed-strip badge removed; strip restored to the baseline
  file. User-directed, so no further review round.

## Repository And Baseline

- Canonical design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
  (default branch `personal`, remote `origin` = `AutoByteus/autobyteus-web-prototype`).
- Ticket worktree:
  `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/chat-new-draft-kept-on-navigation`
- Ticket branch: `design/chat-new-draft-kept-on-navigation`
- Accepted design base: `origin/personal@eb60aba` (fetched 2026-10-07).
- Selected frontend: `autobyteus-web` (read-only); request source
  `/Users/normy/autobyteus_org/autobyteus-worktrees/chat-composer-draft-persistence/autobyteus-web`
  @ `cfeda548b`.
- Baseline source pin: `origin/personal@10fb695` (`ui-baseline-report.md`,
  WEB-BASELINE-REFRESH-007, accepted).
- Source drift at intake (`cfeda548b`):
  - `AppLeftPanel.vue`: only the click wiring differs (`useRunStart().newChat()`); markup and styles
    are identical.
  - `ChatNewSurface.vue` and `chatDraftStore.ts`: production implementation of the already-designed
    run-settings-ui-unification (same visible UI).
  - No baseline refresh is needed.

## Runtime

- Review server: `corepack pnpm dev --port 4540` in the ticket worktree. The process is owned by this
  ticket; the log is `/tmp/autobyteus-design-chat-drafts-dev.log`.
- Entry: the normal product URL `/chat`. No preview switch or scenario is needed.
- State: drafts live in browser memory for the session; a reload starts with no drafts.

## Design Changes (UI reference)

- `stores/chatDraftStore.ts`: one draft becomes a list of drafts plus the open one (`keptDrafts`,
  `openDraft`, `discardDraft`, `finishSentDraft`, `chatDraftHasContent` = typed text). Starting a new
  chat or opening another draft drops only an open draft without text.
- `components/chat/ChatDraftRows.vue` (new): the Draft rows.
- `components/AppLeftPanel.vue`:
  - renders the rows under Chat;
  - Chat is not selected while a Draft row is;
  - a row click reopens its draft (closing the narrow drawer);
  - the Chat row's pencil and collapse buttons stay centred on the Chat button.
- `components/chat/ChatNewSurface.vue`: the composer is keyed by draft id, so reopening shows that draft.
- `services/chat/chatLaunchService.ts`: a successful send removes the sent draft.
- `localization/messages/{en,zh-CN}/shell.ts`: Drafts, Draft, Discard draft, Empty draft.
- `components/layout/LeftSidebarStrip.vue`: unchanged (badge added in round 1, removed after
  confirmation).

## Mock Data And Simulation

- No new fixtures. Drafts are created through the real New chat surface; nothing is persisted.
- `plugins/00.prototype-state.client.ts`: New chat attachments "upload" locally (browser-local
  preview) and are finalized locally on send. Before this ticket, the baseline stub returned no
  attachment, and the Team send failed on finalization.

## Findings

- F-001: the baseline UI reference could not attach a file in New chat (stub returned nothing; Team send
  failed on finalization). Both are now scripted in the mock layer; there is no visible product change.
- F-002: the collapsed strip's Chat icon reopens the panel and shows `/chat` without starting a fresh
  New chat (existing behavior). Kept unchanged.
- F-003: in the UI reference, a sent Team message does not show its image in the conversation (mock
  stream limitation; out of scope).
- F-004: in a background browser tab, the 150 ms leave animation waits until the tab is visible (standard
  browser behavior; seen only in automated checks).

## Validation (final, 2026-10-07)

All in the browser through the normal entry `/chat`, desktop 800×738:

- **UXJ-001:** Team target + image + text → row appears selected (Chat not selected) → open a Research
  Assistant run (rows kept, none selected) → click the row → same heading, text, 1 context file,
  settings; row selected.
- **UXJ-002:** pencil and Chat each open a blank New chat; drafts with text stay listed.
- **REQ-001:**
  - attachment-only and skill-only New chats add no row and are not kept;
  - typing `/` or `/proto` adds no row;
  - the first real text adds one.
- **UXJ-005:** cleared text → "Empty draft" while open; after leaving, the row is gone.
- **Many drafts:** seven rows, newest first, ellipsis; the primary section scrolls (612 / 300 px).
- **UXJ-004:**
  - × on a non-open row removes it, and focus moves to the next row;
  - × on the open row shows a blank New chat with Chat selected.
- **UXJ-003:**
  - sending "hello" opened the run, and that row was removed while the others stayed;
  - an earlier Team send with an image also removed its row.
- **Collapsed strip:** no badge; Chat's accessible name is "Chat".
- **Narrow 390×844:** rows in the drawer; tapping a row opens the draft and closes the drawer.
- **Checks:** `vue-tsc -p tsconfig.prototype.json` passes; `pnpm lint` passes; `pnpm test` passes 14/14.
- **Final references:** VIS-001–008 in `visual-references/` (about 1.0 MB, browser-tool captures at
  device scale 2).

## Status History

- 2026-10-07: opened from the Solution Designer request (SR-002). Worktree created from
  `origin/personal@eb60aba`. Baseline applicable. `In Progress`.
- 2026-10-07: round 1 built and validated; review URL sent. `Awaiting User Review`.
- 2026-10-07: feedback: one-line rows without "Draft" or target. `In Progress` → round 2.
  `Awaiting User Review`.
- 2026-10-07: feedback: only text makes a draft; no files label; no vertical line. `In Progress` →
  round 3. `Awaiting User Review`.
- 2026-10-07: user confirmation "i am satisfied. i confirm now". Collapsed-strip count removed at the
  user's request. Final validation, VIS-001–008, `ui-ux-spec.md`. `Completed`.

## Finalization

- Integration: fast-forward push of `design/chat-new-draft-kept-on-navigation` to `origin/personal`,
  then a fast-forward of the canonical checkout. Revisions are in the handoff.
- Baseline promotion: not required separately. The approved experience is the default `/chat` UI (no
  preview state).
- Cleanup: stop the review server on 4540 and remove the ticket worktree after the handoff. The branch
  is kept under repository policy.
