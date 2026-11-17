# Product Ticket: phone-conversation-readability-506 (Project Task autobyteus-506)

- Status: `Completed` (user-approved 2026-11-17; integrated into `personal`, see the integration record)
- Mode: Product Experience Design (evolves the accepted baseline of the phone run screen's conversation)
- Requested by: Project Task Manager (`project_task_manager_7c8dce0c4a8b44f88e776a83809dee03`), at the founder's request (2026-11-17)
- Design repository: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket branch / worktree: `design/phone-conversation-readability-506` / `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/phone-conversation-readability-506`
- Accepted design base at ticket open: `b017f0881e5e62551a1774dd40f95e00c6d655a4` (`origin/personal`, fetched 2026-11-17)
- Source pin (read only, clean): `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web` at `e4f4b3e1765669cf2c411652770199234ff6c214` (`origin/personal`, release 1.5.13-beta.7)
- Runtime (ticket-owned; dev servers started with `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=.ts.net`, bound to 127.0.0.1; reset: clear `localStorage` keys `autobyteus.phone.textSize`, `autobyteus.prototype.*`, `sessionStorage` `autobyteus.prototype.runModelSelections`):
  - B (recommended, ticket worktree): `corepack pnpm dev --port 4507` -> Tailscale Serve `https://normys-macbook-pro.tail0347f8.ts.net:8444/mobile`
  - A (worktree `phone-conversation-readability-506-opt-a`, branch `design/phone-conversation-readability-506-opt-a`): port 4508 -> `:8445/mobile`
  - C (worktree `phone-conversation-readability-506-opt-c`, branch `design/phone-conversation-readability-506-opt-c`): port 4509 -> `:8446/mobile`
  - Tailscale: before-status `/tmp/d506/ts/serve-before.json` (entries 443 -> 127.0.0.1:29695 and 8443 -> 127.0.0.1:4731 unchanged); added 8444, 8445, 8446 only; turn off with `tailscale serve --https=<port> off`.
  - Only B carries the autobyteus-458 screen; A and C differ from B in one constant (`PHONE_IDENTITY` in `AgentEventMonitor.vue`).

## The user's words (via the PM, 2026-11-17, two phone screenshots, 1236x2750 px)

On the phone the width is limited, so the number of words per line in the middle is already small, and there is still a lot of empty space on both sides of the text; the text size also feels a little too small for the eyes. How can the events monitor (the conversation view of a run on the phone) be better?

PM observations (not decisions): an agent answer's text column starts about one fifth in from the left edge (the avatar column and the left indent stay as space where there is no avatar); a margin remains on the right; lines break after about 4 to 6 words; numbered and bulleted lists indent further; tool-call cards are narrower than the screen; the line spacing is wide.

## Scope

Goal: more readable text per screen on the phone without crowding: wider text column, smaller wasted margins and indents, readable text size and line spacing; the same for user messages, lists, tool cards, code blocks and tables. Possibly a stepped text-size setting for the phone; a decision on the avatar column. Desktop unchanged unless the same fix is clearly right there. Do not break the phone file viewer or the VNC viewer. The PM suggests two or three options as runnable prototypes at the phone's device-pixel-correct width (412 CSS px = 1236 px at 3x); the founder picks. Core Design Rule 4 asks for one recommended design; the options the PM asks for are built only as real variants reached through normal product UI, never as a toggle (decision recorded below).

## Baseline check (2026-11-17)

The design repository's phone screens (`components/mobile/MobileRunScreen.vue`, `MobileChat.vue`, ...) are the autobyteus-277 version. The source has since rebuilt the phone (`components/mobile/runScreen/MobileRunTargetView.vue`, `views/*`, `runList/*`, `newRun/*`, `connection/*`; autobyteus-407, 436, 461, 471, 472, 473), and the shared conversation components (`UserMessage.vue`, `ErrorSegment.vue`, `InterAgentMessageSegment.vue`, `SystemTaskNotificationSegment.vue`, `renderer/MarkdownRenderer.vue`) differ from the baseline. Verified gap in the exact surface this task changes: Baseline Needed (scoped refresh of the phone run screen and its conversation).

## Baseline ticket

- Branch / worktree: `design/phone-run-screen-baseline-refresh-506` / `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/phone-run-screen-baseline-refresh-506`
- Bootstrapper result: pending; scoped Refresh requested 2026-11-17 (run ui_baseline_bootstrapper_6ad2aea9c2274132af4a83d42f8dee25), report ui-baseline-report.md in the baseline worktree

## Second screen added to this ticket (2026-11-17, from the PM)

autobyteus-458, "change the model and runtime of a run from the phone" (Solution Designer brief: `/Users/normy/autobyteus_org/autobyteus-worktrees/phone-run-model-runtime-458/tickets/in-progress/phone-run-model-runtime-458/`, REQ-001..006, DEC-001 founder, DEC-002 this design). Designed in the same ticket so both screens share the phone's rows, sheets and spacing.

## Design under review (review 1)

autobyteus-506, three options that differ only in how a speaker is shown; every option has the same text size/spacing/lists/cards/code/tables rules:
- Today: text column 284 px of 412 (69%), 16 px / 28 px line height; avatar 36 px + 12 px gap + 32 px right padding + 24 px side margins.
- A: 24 px avatar column, text 356 px (86%).
- B (recommended): one line with a 22 px avatar and the name once per speaker, text 388 px (94%).
- C: no avatar; your messages in a soft blue block; text 388 px (94%).
Common: side margin 12 px (was 24 + 32), text 17 px / line height 1.5 (was 16 px / 1.75), tool cards, code blocks, tables and the error card span the full column, 44 px tool cards, list indent 1.3 em, headings smaller, a four-step Text size control (15/17/19/21 px) in the run's ⋮ menu (one setting for the phone). Scroll length of the rich conversation: 3697 px today, about 3050 px now.
autobyteus-458: ⋮ menu entry "Runtime & model" (current value under it), a full view: Runtime and Model rows (the New run rows and sheets), "Stop run" first for a running run, usage-limit marks (clock, "Limit reached · back at <time>", not selectable), "applies when you send your next message", Save, saved and refused states.
Evidence: `evidence/review-1/` (506 options screens 1 to 3; 458 flows 1 and 2; Stop run and text sizes).

## Review 2 (2026-11-17, the founder on his phone, screenshot of the ⋮ menu) — superseded by review 3

The founder: simplify it, use "Settings" instead of "Runtime & model", it looks not clean. Change: the ⋮ menu is back to one line per entry (Artifacts, Files, Messages, Activity, **Settings**); the two-line "Runtime & model / Claude Code · Opus" and the Text size block are gone from the menu. Settings is one screen with two sections: THIS RUN (Runtime, Model, usage-limit note, next-message note, Save; Stop run first for a running run) and TEXT SIZE (four steps, a sample line at the chosen size). Evidence: `evidence/review-2/`; the review-1 458 sheets were removed (they showed the old menu).

## Review 3 (2026-11-17, the founder on his phone, two screenshots)

The founder: I only asked to change the words "Runtime & model" to "Settings"; the earlier version was much better, you made Settings too complicated. And on a message from another agent: why this small arrow, I don't need it, show the message as it is, as on the desktop. Changes: (1) back to the review-1 structure with only the words changed: the ⋮ menu entry is **Settings** (the run's current value under it, the Text size block in the menu as in review 1) and the screen is titled **Settings** with Runtime, Model, the usage-limit note, the next-message note and Save (no "This run" heading, no Text size section in the screen). (2) A message from another agent ("From <name>:") shows on the phone without the arrow and without the message-type line ("agent_message"); the product's component keeps both on the desktop (same component today), so the build hides them for the phone only. Evidence: `evidence/review-3/review-3-settings-and-message.png` (conversation end without the arrow, menu, Settings screen, menu after Save); `evidence/review-2/` was removed (superseded).

## Composer bottom edge (2026-11-17, the founder's phone screenshot 9:17, via the PM)

Seen: the composer's border at the lower left and lower right is not continuous. Checked at 412 px, 3x, in the baseline (same in the pinned source: the code is identical) and on the review page. **Cause**: not the safe area, not a double border, not a sub-pixel gap. `AgentUserInputTextArea.vue`'s root (`flex flex-col bg-white`, rect 13..399 x 832..906) has a square-cornered white background that fills the box to its inner corners, and the box (`AgentUserInputForm.vue`, `rounded-xl border border-gray-200`) does not clip its children when it has the `/` and `@` menus (`hasMenus`: no `overflow-hidden`, so the menus can open above it). The square white corners paint over the 12 px curve of the 1 px border, so on the lower left and right the side lines stop short and the bottom line starts apart (about 12 css px = 36 device px at 3x). The top corners are fine: the Context Files area is clipped (`overflow-hidden rounded-t-xl`). The box with no menus (`overflow-hidden`) is also fine. **Fix (in the design, shared by desktop, which has the same defect but at 1x it is barely visible)**: `rounded-b-[11px]` on the text area's root (box radius 12 px minus the 1 px border). Nothing is clipped, so the menus still open above the box. Bottom spacing: 8 px below the box in the phone conversation. Evidence: `evidence/composer-bottom-edge-before-after.png`.

## Review 4 (2026-11-17, the founder on his phone, 9:34 and 9:35 screenshots)

The founder: do not show the runtime and model under the word Settings in the menu; do not show texts like "<model> has no usage left until …" because the desktop has no such information; keep the UI clean. Changes: the ⋮ menu entry is the single word **Settings** (Text size block as before); the Settings screen has Runtime, Model (and Stop run first, Save, Saved) only: the usage-limit note is gone, the usage-limit marks in the runtime and model lists are gone ("Limit reached · back at …"), and the always-visible "A change applies when you send your next message." is gone; the saved card says it once ("Saved. It applies when you send your next message."), which keeps REQ-003. **Requirement impact for autobyteus-458** (his word): UC-004 / REQ-002's usage-limit marks and AC-004 are dropped from the phone; if the node's limit data should show on the phone, it must first exist on the desktop. Evidence: `evidence/review-4/review-4-settings-clean.png` (menu, Settings, model list, saved); review-3 evidence removed (superseded).

## Review 5 (2026-11-17, the founder, right after review 4)

The founder: also remove "A change applies when you send your next message"; make the UI as clean as possible. Change: Save on a stopped run takes the user straight back to the conversation (that is the feedback; opening Settings again shows the new values); no saved card, no next-message text anywhere, and the Team/Org member note is gone too (the header already says "<name> · Stopped · in <Team>"). What is left on the Settings screen: the run's name and status, Runtime, Model, Save; for a running run the "This run is working … Stop run" card; and the node's refusal in plain words when a Save is refused (the screen stays). This drops the stated "applies at the next message" wording of REQ-003 from the screen (requirement impact for 458: the behavior stays, the text goes). Evidence: `evidence/review-4/review-4-settings-clean.png` (menu, Settings, model list, back in the conversation after Save).

## Approval (2026-11-17)

The founder: "I agree with your recommendation … I accepted your recommendation and I think the way neat is just stop run on the mobile phone we really need it." Approved: design B (speaker line once per speaker, full-width column), Standard 17 px with the four steps, Stop run on the phone (DEC-001 of 458: allowed). The alternatives A and C (branches and worktrees) were deleted; the live Tailscale entries 8444/8445/8446 were turned off (the status equals the one saved before: 443 and 8443 unchanged). Final artifacts: `ui-ux-spec.md` (VIS-001 to VIS-019 in `visual-references/`), `ui-reference-runbook.md`, `ui-text-inventory.md` (its table is the spec's "UI text").

## Questions for the user (all answered)

1. 506: A, B or C? (recommendation B). 2. Text size default 17 px and the four steps. 3. (answered by review 4: no usage-limit marks at all) 4. Is one tap on Stop run without a confirmation right (the desktop does the same)?

## Result

Design Completed: see `ui-ux-spec.md`. Integration record below.
