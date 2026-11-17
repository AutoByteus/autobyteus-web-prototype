# UI/UX Specification — Phone conversation readability (autobyteus-506) and Settings for a run's runtime and model (autobyteus-458)

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: Project Task `autobyteus-506` (ticket `phone-conversation-readability-506`); second screen `autobyteus-458` designed in the same ticket at the founder's routing (2026-11-17).
- Related requirement and decision IDs: autobyteus-458 `requirements-doc.md` SR-001 REQ-001 to REQ-006, UC-001 to UC-004, DEC-001 (the founder's: the phone key may stop a run and change its runtime and model: **yes, "stop run on the mobile phone we really need it"**), DEC-002 (this design). autobyteus-506 has no requirements document; its goal is the founder's request below. autobyteus-509 (phone language) is served by the UI text list below.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`).
- Review URL (live during review, turned off at closing): `https://normys-macbook-pro.tail0347f8.ts.net:8444/mobile` (recommended design), `:8445` and `:8446` (the two alternatives, not approved).
- Explicit user-confirmation reference: the founder, 2026-11-17, in the Product conversation: "I agree with your recommendation … I accepted your recommendation and I think the way neat is just stop run on the mobile phone we really need it." The recommendation is design **B** with the 17 px Standard text size and a one-tap Stop run without a confirmation. His earlier corrections are all in this specification: Settings in one word (reviews 2 to 5), no arrow on another agent's message, the composer's bottom edge, no usage-limit texts or marks, no next-message text.
- Final check date: 2026-11-17 (the approved journeys clicked through on the running UI reference at 412 px, 3x, and 360 px).

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`, frontend `autobyteus-web`.
- Selected frontend application or product surface: the phone (`/mobile`): the run screen's conversation (event monitor) and its ⋮ menu.
- Pinned source commit: `e4f4b3e1765669cf2c411652770199234ff6c214` (`origin/personal`, release 1.5.13-beta.7).
- Design repository/root: as above. Accepted base: `012e825e09e66e13bf6b8fa78cb008758e31556c` (the scoped baseline refresh of the phone, ticket `phone-run-screen-baseline-refresh-506`, integrated before this design).
- UI reference revision or commit: recorded in the integration record of `product-ticket.md`.
- Ticket folder: `tickets/done/phone-conversation-readability-506/` (while open: `tickets/in-progress/…`).
- Baseline report path: `ui-baseline-report.md` (the scoped refresh section on top).

## Problem And Design Rationale

- User problem and intent: on the phone (412 CSS px wide) the conversation uses only about 69% of the width for text: 284 px of 412 (24 px side margins, a 36 px avatar column, a 12 px gap, 32 px right padding), lines break after 4 to 6 words, lists and tool cards are narrower still, text is 16 px with a 28 px (1.75) line height, so few lines fit and the type feels small. The founder wanted more readable text per screen without crowding, and a way to choose the text size. Separately (458) he cannot see or change a run's model and runtime on the phone, which matters when a model's usage runs out away from the laptop.
- Key UX decisions and why:
  1. **The text uses the full width**: 12 px side margins, no avatar column and no right padding: the text column is 388 px (94%). Words per line rise by about 36%.
  2. **Who speaks** is one small line (22 px avatar and the name) once per speaker turn, above the full-width text (Design B). It keeps who-is-who without spending width on a column.
  3. **Standard text is 17 px with a 1.5 line height** (was 16 px / 1.75): bigger type, and the same conversation is about 17% shorter to scroll.
  4. **One phone-wide Text size control, four steps** (15, 17, 19, 21 px), in the run's ⋮ menu, applying at once.
  5. **Tool cards, code blocks, tables and the error card use the whole column.**
  6. **A message from another agent is shown as it is** (no arrow, no message-type line) on the phone.
  7. **Settings** is one ⋮ menu entry and one small screen (Runtime, Model, Save) reusing the New run rows and sheets; a running run shows one plain **Stop run** button above the rows (the node only changes a stopped run), as the desktop has one button. No explanatory or usage text anywhere on the screen.
- Alternatives considered and why rejected (both were built and shown, then not approved): **A** a slim 24 px avatar column (text 356 px, 86%): keeps a column of space, less gain. **C** no avatars, the founder's messages in a soft blue block (388 px): widest and leanest, but loses who-spoke at a glance in runs with several speakers. Also rejected: a runtime/model summary under the menu entry; usage-limit marks and notes (the desktop has no such information, the founder's word); a saved card and an "applies at the next message" line (the founder's word); a Text size section in the Settings screen (the founder prefers the menu).

## Scope And Experience Goal

- User or actor: the founder or any user of the phone web app / Android app (a paired phone).
- Context: reading and steering a run on the phone, often away from the desk.
- Goal: read more per screen comfortably; change a stopped run's runtime and model from the phone.
- Observable success: text column 388 px (94% of 412 px); 17 px Standard text; Settings changes a stopped run's runtime and model and returns to the conversation.
- In-scope surfaces and journeys: the run screen's conversation (user messages, agent answers with markdown, tool cards, code blocks, tables, errors, think, media, messages from other agents, system notices), the composer's bottom edge, the ⋮ menu's Settings entry and Text size block, the Settings screen (stopped, running, refusal).
- Non-goals: the desktop's conversation view (the same shared components render it and stay as they are; see "Build notes"), the phone file viewer, the VNC Viewer, the run list, New run, a Language row (autobyteus-509 later), usage limits, the model settings beyond the New run rows.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| 506 goal | wider text column, smaller margins and indents, readable size and line spacing for messages, lists, tool cards, code blocks, tables; a stepped size choice; the avatar decision | UXJ-001, UXJ-002; UIS-001, UIS-002; VIS-001 to VIS-008, VIS-018, VIS-019 |
| 458 REQ-001 | the run menu has an entry for the run's runtime and model | UXJ-003; UIS-002 (Settings), UIS-003; VIS-005, VIS-009 |
| 458 REQ-002 | choose another runtime and model from the same lists as New run | UXJ-003; VIS-010, VIS-013, VIS-014. **Usage-limit marks dropped by the founder** |
| 458 REQ-003 | saved through the node's rules; the node's refusals in plain words | UXJ-003, UXJ-005; VIS-012, VIS-015. **The "applies at the next message" wording is dropped from the screen by the founder; the behavior is unchanged** |
| 458 REQ-004 / AC-002 | a running run: Stop run first, then choose | UXJ-004; VIS-016, VIS-017 |
| 458 REQ-005 | a Team or Org member: the open member's own settings | the Settings screen always belongs to the run screen's open run; its header says `<name> · <status> · in <Team>` |
| 458 REQ-006 / DEC-001 | the phone key may stop a run and change its runtime and model | the founder: allowed |
| 458 AC-003 | a refusal shows the node's plain message, nothing changes | VIS-012 |
| 458 AC-004 | a model with no usage left is marked | **dropped by the founder** (requirement impact, reported to the Solution Designer) |

## Visual Language

- Existing product language to preserve: the phone's white screens, slate text, blue-600 primary actions, 48 px screen bar, rounded-xl cards, the New run rows and bottom sheets (`MobileChoiceSheet`, `MobileBottomSheet`), the product's markdown styling, tool cards, and colors. Everything not listed here is unchanged from the baseline.
- Layout structure and hierarchy: the conversation is a single scrolling column inside the run screen, composer pinned at the bottom.
- Grid, dimensions, spacing, density (412 px phone; all values scale to other widths, the text column is always the screen width minus 24 px):
  - side margin 12 px (rows, composer); conversation root padding `0 0 8px`, gap 8 px; the composer wrapper `padding: 0 12px`.
  - row (one message): padding `10px 12px`; a user row that follows another row: `14px` top.
  - turn header (one per speaker turn): grid of two columns `22px 1fr`, column gap 8 px, row gap 4 px: avatar (22 px circle) and name on the first row, the body spanning both columns on the second row. A second agent row directly after an agent row hides its avatar and name and puts its body in the first row.
  - tool cards: full column width, at least 44 px tall.
  - code blocks and tables: full column width.
- Typography: the conversation size `S` is the chosen step: Small 15, **Standard 17 (default)**, Large 19, Largest 21 px; line height 1.5 for everything in the conversation (`line-height: 1.5` on the feed). Inside the conversation: text-xs = 0.8 em (line 1.4), text-sm = 0.9 em (1.45), 0.9375 rem classes = 0.95 em, 0.6875 rem classes = 0.75 em. Speaker name: 13 px / 20 px, weight 600, `#475569` (not scaled). Markdown (all in em of `S`): paragraphs `margin 0 0 0.6em`; h1 1.4 em / 1.25, margin `0.9em 0 0.4em`; h2 1.25 em / 1.3, `0.9em 0 0.35em`; h3 and h4 1.1 em / 1.35, `0.8em 0 0.3em`; lists `padding-left 1.3em`, margin `0.4em 0 0.6em`, items `margin 0.2em 0`, `padding-left 0.15em`, nested lists margin `0.15em 0`; blockquote margin `0.7em 0`, `padding-left 0.8em`; code blocks `font-size 0.82em`, line 1.5, padding `0.65em 0.75em`, radius 8 px, margin `0.6em 0`; inline code 0.88 em; tables 0.9 em, cell padding `0.45em 0.6em`, margin `0.6em 0`. Text segments end with `margin-bottom 0.7em`. Other segments: the error card margin `0.6em 0`, padding `0.7em 0.8em`; the system notice `margin-bottom 0.7em`; the think segment margin `0.4em 0`, its content padding `0.7em 0.8em`; media margin `0.6em 0`.
- Color values and semantic roles: unchanged from the baseline; new: speaker name `#475569`; Text size selected step `border-blue-600 / bg-blue-50 / text-blue-700`; **Stop run** button white, 1 px `slate-300` border, `slate-800` semibold 16 px text, 48 px tall, radius 12 px, full width, 8 px above the rows (pressed `bg-slate-100`); refusal card `bg-red-50`, border `red-200`, text `red-700`.
- Surfaces, borders, radii: composer box `rounded-xl` (12 px) with a 1 px `gray-200` border; **the text area's white background carries `rounded-b-[11px]`** so it no longer paints over the border at the two lower corners (see VIS-019 and Build notes). Menu card as the baseline (rounded-xl, border slate-200, shadow-lg, `w-72`). Settings cards `rounded-xl`; Save `rounded-2xl`.
- Controls: the ⋮ menu gets **Settings** (a gear icon, 20 px, slate-500, same row as the others: 48 px tall, 15 px text) and, below a 1 px slate-200 divider, a **Text size** block: label 12 px medium slate-500; four buttons in a 4-column grid with 6 px gap, each 44 px tall, radius 8 px, 1 px border, the letter "A" at 13, 16, 19 and 22 px; the chosen one in the selected colors above.
- Hover, active, focus, selected, disabled, validation, feedback: as the baseline's phone rows (active `bg-slate-100`, focus ring `blue-500`); Text size steps `aria-pressed`; Save disabled at 50% opacity; the running run's rows disabled at 50% (the New run row's disabled look).

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Conversation phone layout | full-width column, turn header, type scale, markdown, cards | the four text sizes; browse and live paths use the same turn markup | `assets/css/phone-conversation.css`; `components/conversation/AIMessage.vue`, `UserMessage.vue`; `components/workspace/agent/EventMonitorBrowseAssistantRow.vue`, `AgentConversationFeed.vue`, `AgentEventMonitor.vue` |
| Text size (phone-wide) | the four steps, kept on the phone | Small, Standard, Large, Largest | `composables/mobile/usePhoneTextSize.ts`; `components/mobile/runScreen/MobileRunMenu.vue` |
| Settings screen | runtime and model of the open run | stopped, running (Stop run card), refused | `components/mobile/views/MobileRunSettings.vue`; `prototype/mobile-runs/runModelFixture.ts` (invented) |
| Composer bottom corners | continuous 1 px border | none | `components/agentInput/AgentUserInputTextArea.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | a paired phone user | a run open | read the conversation comfortably | the text uses the full width at 17 px | 506 |
| UXJ-002 | same | run open | make the text bigger or smaller | the whole phone shows the chosen size | 506 |
| UXJ-003 | same | a stopped run open | change its runtime and model | back in the conversation; Settings shows the new values | REQ-001 to 003 |
| UXJ-004 | same | a running run open | stop it, then change | the run shows Stopped and the rows are open | REQ-004 |
| UXJ-005 | same | a model the node no longer offers is chosen | recover from the refusal | the list is refreshed and another model saved | REQ-003, AC-003 |

## Journey Details

**UXJ-001.** Run list → tap a run → the conversation opens at the end. A user message shows the 22 px avatar and "You" on one line, then the text across 388 px; an agent turn shows the avatar and the agent's name once, then its text, tool cards (full width, 44 px tall), headings, lists (1.3 em indent), code blocks, tables (scroll sideways inside their box when wider than the column), quotes. Another agent's message shows "From <name>:" and its text, no arrow and no message-type line. VIS-001 to VIS-004, VIS-018.

**UXJ-002.** ⋮ → the Text size block at the bottom of the menu → tap a step. The conversation behind the open menu changes at once; the choice is kept on this phone (one setting for every run) and survives a reload. Default Standard. VIS-005 to VIS-008.

**UXJ-003.** ⋮ → Settings → Runtime and Model rows (value right, chevron; tap opens the sheet; one tap picks and closes, as New run). Choosing another runtime clears the model (it shows "Choose") and the model list is that runtime's; Save is enabled only when something changed and a model is chosen. Save → back to the conversation with nothing else said. ⋮ → Settings shows the new values. The next message the user sends runs on them (behavior of the node; not said on the screen). VIS-009, VIS-010, VIS-013 to VIS-015.

**UXJ-004.** For a running (or starting) run the Settings screen shows one **Stop run** button under the run's name (no card, no sentence); Runtime and Model are disabled. Stop run (one tap, no confirmation: the founder: "stop run on the mobile phone we really need it") → the status line shows Stopped, the card disappears, the rows open. VIS-016, VIS-017.

**UXJ-005.** Save is refused (the chosen model is no longer offered): a red card under the rows with the node's words, "“<model>” is not offered by <runtime> now. Refresh the model list and choose again."; nothing changes; open the Model sheet, "Refresh models" drops the model, choose another, Save. VIS-012.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Run conversation (phone) | `/mobile` run screen | read and answer | bar (unchanged), conversation column, composer | VIS-001 to VIS-004, VIS-006 to VIS-008, VIS-015, VIS-018, VIS-019 |
| UIS-002 | ⋮ menu | the bar's ⋮ | views and the text size | Artifacts, Files, Messages (members), Activity, **Settings**, divider, **Text size** | VIS-005 |
| UIS-003 | Settings | `/mobile?screen=settings` (⋮ → Settings) | change the open run's runtime and model | 48 px bar "Settings" with ←; subject line (status dot, name, `<status> · in <Team>`); Runtime row; Model row; (running: the Stop run button first); refusal card under the rows; a footer with Save (56 px tall, full width, 16 px side margins, 12 px below a 1 px slate-100 line) | VIS-009 to VIS-014, VIS-016, VIS-017 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | UIS-002 | tap a Text size step | the conversation reflows at once | the step is selected (blue) | stored on the phone | any step; close |
| TR-002 | UIS-002 | tap Settings | the Settings screen opens | UIS-003 | route `screen=settings` | ← back |
| TR-003 | UIS-003 stopped | tap Runtime / Model | the choice sheet opens | picked and closed | the model is cleared when the runtime changes | Save |
| TR-004 | UIS-003 changed | Save | back to the conversation | UIS-001 | the node saves the stopped run's selection; applies at the next message | ⋮ → Settings |
| TR-005 | UIS-003 refused | Save | red card with the node's message | unchanged | none | Refresh models, choose again |
| TR-006 | UIS-003 running | Stop run | the status turns Stopped | rows enabled | the node stops the run | choose, Save |
| TR-007 | UIS-003 | ← | back to the conversation | UIS-001 | unsaved choices dropped | |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Settings, stopped, unchanged | open | rows with current values, Save disabled | choose | ← | VIS-009 |
| Settings, model list | tap Model | sheet, current model checked, "Refresh models" in the footer | pick, refresh | close | VIS-010 |
| Settings, changed | picked | Save enabled | Save | ← | VIS-011 |
| Settings, runtime changed | picked | Model "Choose" (blue), Save disabled | pick a model | ← | VIS-014 |
| Settings, refused | Save refused | red card, node wording | Refresh models | | VIS-012 |
| Settings, running/starting | open | one Stop run button, rows disabled, Save disabled | Stop run | ← | VIS-016 |
| Settings, after stop | Stop run | Stopped, rows open | choose | | VIS-017 |
| Conversation, Small/Large/Largest | Text size | the whole conversation at 15/19/21 px | | | VIS-006 to VIS-008 |

## Content, Labels, Validation, And Feedback

- Product voice: the phone's short plain words; names only, never node addresses.
- Exact labels (also the translation keys, for autobyteus-509): see "UI text" below.
- Messages: the node's refusals are shown as the node words them. Empty and loading states are the baseline's.
- Form validation: Save is enabled only for a stopped run with a changed selection and a chosen model; no typed input.

### UI text (stable keys for autobyteus-509)

Names follow the product's phone namespace (`mobile.nodeDesktop.title`): `mobile.settings.*`.

| Key | English | Where |
| --- | --- | --- |
| `mobile.settings.menuEntry` / `mobile.settings.title` | Settings | ⋮ menu entry and the screen bar (one word; nothing under it) |
| `mobile.settings.runtime` / `mobile.settings.model` | Runtime / Model | row labels: the New run keys |
| `mobile.settings.stopRun` | Stop run | the button (the only text of the running state) |
| `mobile.settings.save` | Save | footer button |
| `mobile.settings.textSize` | Text size | ⋮ menu label |
| `mobile.settings.textSize.small` / `.standard` / `.large` / `.largest` | Small / Standard / Large / Largest | accessible names of the four steps (the "A" glyphs are not text) |

Not the phone's: the node's refusal messages (`run-model-selection-refusal.ts`), e.g. "“{model}” is not offered by {runtime} now. Refresh the model list and choose again.": the build decides with 509 whether node or phone translates them. 506 adds no other text: the speaker line shows the agent's name or the existing "You". A **Language row** (autobyteus-509), when it comes, joins the ⋮ menu's bottom block next to Text size ("Language   System language ›", the same bottom sheet: System language, English, Chinese); the Settings screen stays the run's own.

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Phone web app and Android app | `/mobile` (the phone runtime) | everything above | touch targets at least 44 px (tool cards, Text size steps, rows) |
| 360 px phone | narrower | the same rules; the text column is 336 px | VIS-018 |
| Desktop | not the phone runtime | **unchanged**: none of the phone rules apply (they are scoped to the phone runtime); the speaker name line is hidden | none |

## Accessibility And Keyboard Behavior

- Target: the phone's existing (WCAG AA contrast, 44 px targets, visible focus).
- Focus: Settings opens with the screen bar's back button reachable first; sheets focus the current choice, return focus to the row on close (as New run). The ⋮ menu is unchanged and closes with Escape.
- Roles: Text size block `role="group"` named "Text size", each step a button with `aria-pressed` and the step's name; the Stop run button is a plain button; the refusal `role="alert"`; the Save button's disabled state is real (`disabled`).
- Contrast: speaker name `#475569` on white (7.6:1); the refusal card uses the product's red-700 text on red-50.

## Motion And Transitions

- Text size reflows without animation; screen and sheet transitions follow the existing phone ones; reduced motion: no new motion.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| a run's runtime and model | rows and lists | `prototype/mobile-runs/runModelFixture.ts`: invented runtimes (Claude Code, Codex, AutoByteus, Gemini CLI) and models, the selection kept in memory/session per run | the node's lists and `agentRunModelOptions`/`teamRunModelOptions`, `updateStoppedAgentRunSelection`/`updateStoppedTeamRunSelections`/`updateStoppedAgentOrgRunConfig` as the desktop uses them (`ExistingRunConfigEditor.vue`, `services/runConfigEditing`) |
| stopped only | Stop run first | Stop run sets the run Stopped locally | the node answers `RUN_ACTIVE` to a running run; Stop uses the desktop's stop action |
| the refusal | red card | one invented model ("Sonnet (earlier version)") is refused until "Refresh models" | the node's `MODEL_UNAVAILABLE` message in plain words |
| the phone key | Settings | allowed | DEC-001: allowed; autobyteus-441 must keep stop and change on the phone's allowed list |
| Text size | the four steps | stored in `localStorage` key `autobyteus.phone.textSize` | stored on the phone |
| running runs | the Stop run button | a run the list shows as running opens as Running | the node's live status |

Build notes (what engineering changes, in the product's `autobyteus-web`):
- The phone styles are scoped to the phone runtime (`isMobileRemoteAccessRuntime()`, already used by the event monitor); the shared components stay as they are on the desktop. The speaker line (`conv-speaker`, hidden by default) and the turn grid are phone-only.
- Another agent's message: on the phone `InterAgentMessageSegment` renders without the toggle button and without the message-type line (the desktop component has both today; the founder asked for the phone only).
- The composer's lower corners: `rounded-b-[11px]` on the root of `AgentUserInputTextArea.vue` (its square white background painted over the curved border; the box cannot clip because the `/` and `@` menus open above it). The component is shared, so the desktop gets the same fix.
- Text size is one phone-wide setting; the Settings screen is the open run's own and never holds phone-wide settings.
- The UI reference's `useMobileRunOpening` change (a list-running run opens as Running) exists only to show Stop run; the product already knows the run's live status.

## Final Visual Reference Inventory

All images: `visual-references/`, captured from the running UI reference after the founder's confirmation, 412 CSS px wide at 3x (1236 × 2745 px) unless noted. Fixture content (names, run text, model names) is illustrative; layout, spacing, type, colors, texts and states are normative.

| Visual ID | Surface / State | Viewport | File |
| --- | --- | --- | --- |
| VIS-001 | conversation, top: your message, agent turn, tool cards | 412 | `VIS-001-conversation-top-412.png` |
| VIS-002 | conversation: headings, numbered and bulleted lists | 412 | `VIS-002-conversation-lists-412.png` |
| VIS-003 | conversation: code blocks, table, quote | 412 | `VIS-003-conversation-code-table-412.png` |
| VIS-004 | conversation end: error card, message from another agent (no arrow), system notice | 412 | `VIS-004-conversation-end-412.png` |
| VIS-005 | ⋮ menu: Settings and Text size | 412 | `VIS-005-menu-settings-textsize-412.png` |
| VIS-006 | Text size Small (15 px) | 412 | `VIS-006-text-small-412.png` |
| VIS-007 | Text size Large (19 px) | 412 | `VIS-007-text-large-412.png` |
| VIS-008 | Text size Largest (21 px) | 412 | `VIS-008-text-largest-412.png` |
| VIS-009 | Settings, stopped run | 412 | `VIS-009-settings-stopped-412.png` |
| VIS-010 | Settings, model list | 412 | `VIS-010-settings-model-list-412.png` |
| VIS-011 | Settings, model chosen (Save enabled) | 412 | `VIS-011-settings-model-chosen-412.png` |
| VIS-012 | Settings, the node's refusal | 412 | `VIS-012-settings-refused-412.png` |
| VIS-013 | Settings, runtime list | 412 | `VIS-013-settings-runtime-list-412.png` |
| VIS-014 | Settings, runtime changed (Model "Choose") | 412 | `VIS-014-settings-runtime-changed-412.png` |
| VIS-015 | back in the conversation after Save | 412 | `VIS-015-after-save-conversation-412.png` |
| VIS-016 | Settings, running run: the Stop run button | 412 | `VIS-016-settings-running-412.png` |
| VIS-017 | Settings, after Stop run | 412 | `VIS-017-settings-after-stop-412.png` |
| VIS-018 | conversation at 360 px | 360 × 780 | `VIS-018-conversation-lists-360.png` |
| VIS-019 | composer bottom edge, continuous corners (crop 412 × 155) | 412 | `VIS-019-composer-bottom-edge-412.png` |

Review evidence (not normative): `evidence/review-1/` (today versus options A, B, C), `evidence/review-4/`, `evidence/composer-bottom-edge-before-after.png`.

## Change Record (design changes from the baseline)

DC-001 full-width text column and 12 px margins; DC-002 turn header (avatar and name once per speaker); DC-003 17 px / 1.5 type and the markdown and card values above; DC-004 four-step Text size in the ⋮ menu; DC-005 another agent's message without arrow or type line (phone only); DC-006 Settings entry and screen (458); DC-007 Stop run for a running run (458); DC-008 composer lower-corner fix; DC-009 a run the list shows as running opens as Running (UI reference only). Dropped after review: the amber "This run is working" card and its two sentences (the founder: one button, as on the desktop), usage-limit marks and notes, the runtime/model summary under Settings, the saved card, the next-message line, the member note, a Text size section in Settings.

## Open Decisions

None for the founder. For the Solution Designers: 458's UC-004/REQ-002 usage-limit marks and AC-004, and REQ-003's on-screen wording, are dropped by the founder's word; the desktop's inter-agent arrow and the composer-corner fix on the desktop are the build teams' call (the corner fix is safe and recommended).
