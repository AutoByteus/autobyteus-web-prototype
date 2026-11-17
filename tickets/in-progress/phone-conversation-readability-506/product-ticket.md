# Product Ticket: phone-conversation-readability-506 (Project Task autobyteus-506)

- Status: `Baseline Needed`
- Mode: Product Experience Design (evolves the accepted baseline of the phone run screen's conversation)
- Requested by: Project Task Manager (`project_task_manager_7c8dce0c4a8b44f88e776a83809dee03`), at the founder's request (2026-11-17)
- Design repository: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket branch / worktree: `design/phone-conversation-readability-506` / `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/phone-conversation-readability-506`
- Accepted design base at ticket open: `b017f0881e5e62551a1774dd40f95e00c6d655a4` (`origin/personal`, fetched 2026-11-17)
- Source pin (read only, clean): `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web` at `e4f4b3e1765669cf2c411652770199234ff6c214` (`origin/personal`, release 1.5.13-beta.7)
- Runtime: not started yet (port, process and state are recorded when the UI reference starts)

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

## Result

Pending.
