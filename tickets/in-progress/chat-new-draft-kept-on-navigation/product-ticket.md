# Product Ticket — chat-new-draft-kept-on-navigation

## Identity And Scope

- Product ticket: `chat-new-draft-kept-on-navigation`. This is the stable package identifier; there is no second ID.
- Stable package: `chat-new-draft-kept-on-navigation`, solution revision `SR-002`.
- Title: Unsent New chats are kept as Draft rows directly under the Chat row.
- Mode: `Product Experience Design` (evolves the accepted AutoByteus Web baseline: left panel and New chat).
- Status: `Awaiting User Review` (round 3).
- Requester: Solution Designer (`/solution_designer`) for the user, 2026-10-07.
  - User: "could you delegate a task to Product Team to work on the UI first?"
- Request package:
  `/Users/normy/autobyteus_org/autobyteus-worktrees/chat-composer-draft-persistence/tickets/in-progress/chat-new-draft-kept-on-navigation/product-design-request.md`
- Requirements context: `requirements-doc.md` and `investigation-notes.md` in the same folder.
  Status `Ready for Approval` (SR-002); not approved yet.
- In-scope IDs: BEH-001, BEH-002, BEH-004, BEH-006, BEH-007; REQ-001–008; AC-001–007;
  SCN-001–004; open DEC-002, DEC-004, DEC-005.

## Round 3 Change (user feedback, 2026-10-07)

- User: "the two files is not even needed ... normally people just first write ... Only when there
  are text, then you save draft. Then that would be nice and easier." Then: "please make the UI as
  clean as possible. I think we don't need this vertical line."
- D-04 is replaced: a New chat becomes a Draft only when it has **typed text**. Attachments, `/`
  skills, target, model and workspace alone make no row. A New chat without text is not kept when
  another one starts (its attachments go with it). A lone `/command` being typed (skill menu open)
  is not text yet.
- D-02 (round 2) simplified: the row shows only the text preview. The "N files" and `/skill`
  previews are removed. An open draft whose text is cleared reads "Empty draft" until left, then
  goes (REQ-008, now "text cleared").
- D-01 changed: no vertical rail; the rows are grouped only by their indent under the Chat label.
- Requirement impact (for Solution Designer):
  - REQ-001 / DEC-004: "a New chat becomes a Draft once it has typed text"; attachments, skills
    and mentions without text do not.
  - REQ-002: "one-line preview of the text", no marker, no target, no attachment count.
  - REQ-008: "a draft whose text is fully cleared stops being listed once the user leaves it".

## Round 2 Change (user feedback, 2026-10-07)

- User: "I think here we can make it cleaner. We don't need to show the word, draft, and we don't need
  to show the name like Daily Assistant or other. Just the one line would be enough ... because people
  will click it anyway."
- D-02 is replaced: a Draft row is **one line**, the preview only (13px/20px, `gray-700`; selected
  `gray-900`), row height 32px. No "Draft" word, no target icon or name, no file count beside text.
  - No text → the chosen `/` skills; attachments only → paperclip + "1 file" / "N files" (`gray-500`);
    cleared while open → "Empty draft" (italic `gray-400`).
  - The tooltip shows the preview and, on a second line, the target name. The accessible name is
    "Draft: <preview> — <target>", so screen readers still hear both.
- Requirement impact (for Solution Designer): REQ-002 currently requires each row to show a "Draft"
  marker and the target. The user's feedback removes both from the visible row; REQ-002 should read
  "a one-line preview of the text (or the chosen skills / attachment count when there is no text)".
- The collapsed-strip badge (D-12) keeps its amber colour; nothing else changed.

## Proposed Design (round 1, not approved; D-02 superseded by round 2)

- D-01 Placement: Draft rows sit directly under the Chat row, inside the primary nav section, before
  Agents. A 1px `gray-200` rail at the Chat icon's centre (x = 20px) groups them under Chat.
- D-02 Row: two lines, text left-aligned with the "Chat" label (`pl-9`).
  - Line 1 (13px/20px, `gray-700`): one-line preview of the typed text. No text → the chosen
    `/` skills (`/prototype-research`). Attachments only → paperclip + "1 file" / "N files" (`gray-500`).
  - Line 2 (12px/16px, `gray-500`): **Draft** (`amber-700`, medium) · person icon (Agent) or
    group icon (Team) · target name, truncated · paperclip + count when the draft has text and files.
  - Long previews and target names truncate with an ellipsis; the full preview is the row tooltip.
- D-03 Order: newest started first. Editing a draft does not move it.
- D-04 Appears: the row appears as soon as the New chat has content (REQ-001), selected, with a 150 ms
  fade/height-in. Target, model or workspace alone add no row.
- D-05 Selected: while a draft is open on New chat, its row has the nav selected style
  (`bg-gray-100`, `gray-900`, `aria-current="page"`), and the Chat row is not highlighted. A fresh
  New chat (no content) highlights the Chat row as today. On a run (`/chat?id=…`), Chat keeps today's
  highlight and no row is selected.
- D-06 Re-enter: clicking a row opens New chat with that draft exactly as left: text, files, skills,
  target heading, workspace, model, Auto-approve and member customizations.
- D-07 Start fresh: Chat, the pencil, Run, "+" and the Org page's Agent/Team switch always open a fresh
  New chat. Every draft with content stays listed. No dialog.
- D-08 Discard: × (heroicons x-mark, 16px, `gray-400` → `gray-700` on `gray-200`) at the row's right.
  It shows on hover, on keyboard focus, always on the selected row, and always on touch screens. No
  confirmation. Discarding the open draft shows a fresh New chat; focus moves to the next row, else the
  previous one, else the Chat row.
- D-09 Cleared: an open draft whose content is all removed stays listed as "Empty draft" (italic
  `gray-400`) until the user leaves it, then the row goes (REQ-008).
- D-10 Send: a successful send removes that row (150 ms fade); other drafts stay. A failed send keeps
  the draft and its row (no visual change).
- D-11 Many drafts: rows stack; the primary nav section keeps its height and scrolls, and stays resizable.
- D-12 Collapsed panel: the Chat icon in the 50px strip carries an amber count badge (`amber-500`,
  white 10px semibold, white ring; "9+" above nine). Tooltip and accessible name: "Chat · 2 drafts".
- D-13 Narrow screens: the same rows in the navigation drawer; tapping a row opens the draft and closes
  the drawer.
- D-14 Lifetime (DEC-002): the UI is the same either way. The UI reference keeps drafts for the browser
  session only.

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
  - `AppLeftPanel.vue`: only the click wiring differs (`useRunStart().newChat()` instead of the store
    call). Markup and styles are identical.
  - `ChatNewSurface.vue` and `chatDraftStore.ts`: production implementation of the already-designed
    run-settings-ui-unification (renamed components, same visible UI).
  - No baseline refresh is needed.

## Runtime

- Review server: `corepack pnpm dev --port 4540` in the ticket worktree. The process is owned by this
  ticket; the log is `/tmp/autobyteus-design-chat-drafts-dev.log`.
- Entry: the normal product URL `/chat`. No preview switch or scenario is needed.
- State: drafts live in browser memory for the session; a reload starts with no drafts.

## Design Changes (UI reference)

- `stores/chatDraftStore.ts`: one draft becomes a list of kept drafts plus the open one
  (`keptDrafts`, `openDraft`, `discardDraft`, `finishSentDraft`, `chatDraftHasContent`). Starting a
  new chat drops only an open draft that has no content.
- `components/chat/ChatDraftRows.vue` (new): the Draft rows.
- `components/AppLeftPanel.vue`: renders the rows under Chat; Chat is not highlighted while a Draft row
  is selected; row click re-enters the draft. The Chat row's pencil/collapse buttons are now centred on
  the Chat button only.
- `components/layout/LeftSidebarStrip.vue`: draft count badge on the collapsed Chat icon.
- `components/chat/ChatNewSurface.vue`: the composer is keyed by draft id so re-entry shows that draft.
- `services/chat/chatLaunchService.ts`: a successful send removes the sent draft.
- `localization/messages/{en,zh-CN}/shell.ts`: Drafts, Draft, 1 file / N files, Empty draft,
  Discard draft, 1 draft / N drafts.

## Mock Data And Simulation

- No new fixtures. Drafts are created through the real New chat surface.
- `plugins/00.prototype-state.client.ts`: New chat attachments "upload" locally. The result is a
  browser-local preview of the chosen file; finalization on send is answered locally. Before this
  ticket the baseline stub returned nothing, so an attached file broke the composer when the draft was
  re-entered.

## Findings

- F-001: the baseline UI reference could not attach a file in New chat. The stub returned no attachment
  and the Team send failed on finalization. Both are now scripted locally (mock layer only, no visible
  product change).
- F-002: the collapsed strip's Chat icon reopens the panel and shows `/chat` without starting a fresh
  New chat (existing behavior). With drafts it then shows the open draft. Kept unchanged; noted for review.
- F-003: in the UI reference, a sent Team message does not show its image in the conversation (mock stream
  limitation, not part of this design).

## Validation (round 1, 2026-10-07)

- Browser, desktop 1280×800, through the normal entry `/chat`:
  - SCN-001: Team target + image + text → row appears selected (Chat row unhighlighted) → open a
    Research Assistant run (row stays, unselected) → click row → same heading, text, 1 context file.
  - SCN-002: pencil and Chat each open a fresh Daily Assistant New chat; earlier drafts stay listed.
  - Attachment-only Agent draft ("2 files"), skill-only draft ("/prototype-research"), long text
    (truncated with ellipsis): four rows, newest first; the primary nav section scrolls.
  - REQ-008: clearing an open draft shows "Empty draft"; pencil → that row is gone.
  - SCN-004: × on a non-open row removes it (focus to next row); × on the open row shows a fresh New
    chat.
  - SCN-003: send from the Team draft (text + image) → Team run opens with the message; that row is
    gone; the other draft stays.
  - Collapsed panel: badge "2"; name "Chat · 2 drafts".
- Narrow 390×844: rows in the drawer; tapping a row opens the draft and closes the drawer.
- Checks: `vue-tsc` (prototype tsconfig) passes; `pnpm lint` passes; `pnpm test` passes 14/14.

## Status History

- 2026-10-07: opened from the Solution Designer request (SR-002). Worktree created from
  `origin/personal@eb60aba`. Baseline applicable. `In Progress`.
- 2026-10-07: round 1 built and validated; review URL sent to the user. `Awaiting User Review`.
- 2026-10-07: user feedback: one-line rows, no "Draft" word, no target name. `In Progress`.
- 2026-10-07: round 2 built and validated (four drafts, Team/Agent/attachment-only/long, re-entry from a
  run, selected state). `Awaiting User Review`.
- 2026-10-07: user feedback: only text makes a draft; no files label; no vertical line. `In Progress`.
- 2026-10-07: round 3 built and validated:
  - attachment-only and skill-only New chats add no row and are not kept;
  - text + image Team draft re-entered intact from a run;
  - cleared text → "Empty draft" while open;
  - `vue-tsc`, lint and tests 14/14 pass.
  `Awaiting User Review`.
