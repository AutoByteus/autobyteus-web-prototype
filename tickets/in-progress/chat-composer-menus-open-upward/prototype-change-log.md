# Prototype Change Log — chat-composer-menus-open-upward

Baseline: `personal@045a4f7` (source pin `origin/personal@57df63f07`, WEB-BASELINE-REFRESH-002).

## Round 1 (review)

| ID | Kind | Change | Requirement / Decision | Files |
| --- | --- | --- | --- | --- |
| PC-001 | Behavior change | New-chat composer menus (`@` agent/team, `/` skill, Workspace, Model, Thinking) always open upward on wide windows (≥640px). The popover gets an `above` placement policy; the running-conversation `/` menu keeps `auto`. | REQ-001, DEC-001 | `composables/popover/useAnchoredPopover.ts`, `ChatMessageInput.vue`, `ChatWorkspaceMenu.vue`, `ChatModelMenu.vue`, `ChatThinkingControl.vue` |
| PC-002 | Behavior change | Short windows: an upward menu's height = min(preferred height, space above its anchor − 6px gap − 16px viewport margin). The list scrolls inside; the menu never flips down and never leaves the window. Space is measured from the menu's real anchor box (`@`/`/` sit above the whole composer card). Height limit now also applies to `@`/`/`, Model and Thinking (previously only Workspace). | REQ-003, DEC-003 (OQ-001) | same + `ChatTargetMenu.vue`, `ChatSkillMenu.vue` (`min-h-0` so the list can shrink) |
| PC-003 | Behavior change | Model menu runtime flyout is bottom-aligned with its runtime row and grows upward (list max 320px, limited to the space above). It no longer drops below the composer onto the hint line. | REQ-001, DEC-001 | `ChatModelMenu.vue` |
| PC-004 | Layout change | Composer group moves down: column padding `pt-10 pb-[6vh]` → `pt-[14vh] pb-10` (still flex-centered). Net move = 10vh − 40px: 56px at 952px tall, 50px at 900, 32px at 720, 20px at 600. | REQ-002, DEC-002 (OQ-002) | `ChatNewSurface.vue` |

Preserved (validated): workspace hint line position under the composer (DEC-004 / OQ-003); narrow (<640px) bottom sheet for all five menus; running-conversation `/` menu; menu contents, search, keyboard and selection (code untouched).
