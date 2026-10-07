# UI/UX Specification — Unsent New chats are kept as Draft rows under the Chat row

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `chat-new-draft-kept-on-navigation` (Product ticket = stable package identifier)
- Related requirements revision ID: `SR-002` (requirements `Ready for Approval`; the user asked for UI first)
- Related IDs: BEH-001, BEH-002, BEH-004, BEH-006, BEH-007; REQ-001–008; AC-001–007; SCN-001–004;
  DEC-004, DEC-005 (decided by this design); DEC-002 (open, no UI impact)
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL (normal entry point, no preview switch): `http://127.0.0.1:4540/chat`
- Explicit user-confirmation reference (2026-10-07):
  - Round 2: "We don't need to show the word, draft, and we don't need to show the name ... Just the one
    line would be enough ... because people will click it anyway."
  - Round 3: "Only when there are text, then you save draft. Then that would be nice and easier" and
    "make the UI as clean as possible. I think we don't need this vertical line."
  - Final: "i am satisfied. i confirm now"
  - After confirmation, the user removed the collapsed-strip count: "we don't need this number on the
    chat because it gives people confusion ... We don't need that extra thing." Applied; the collapsed
    strip is unchanged from today (VIS-007).
- Final validation date: 2026-10-07

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo` (request worktree
  `/Users/normy/autobyteus_org/autobyteus-worktrees/chat-composer-draft-persistence`)
- Selected frontend application or product surface: `autobyteus-web`, the left panel (primary nav, Chat
  row) and the New chat surface (`/chat`)
- Pinned source commit or revision: baseline pin `origin/personal@10fb695`.
  - Re-checked at intake against `cfeda548b`.
  - `AppLeftPanel.vue` differs only in click wiring (`useRunStart().newChat()`).
  - `ChatNewSurface.vue` and `chatDraftStore.ts` contain production's implementation of the already-designed
    run-settings unification. The visible UI is the same, so no baseline refresh is needed.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- UI reference revision or commit: recorded in `product-ticket.md` (Finalization)
- Ticket folder: `tickets/done/chat-new-draft-kept-on-navigation/`
- Baseline report path: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md`
  (WEB-BASELINE-REFRESH-007, accepted)

## Problem And Design Rationale

- **User problem and intent:**
  - The user writes a New chat, then opens another run to copy details.
  - Coming back through Chat discards everything typed, so they must collect everything first.
  - User's proposal: unsent chats become Draft rows directly under the Chat row; clicking one reopens it
    exactly as left; Chat and the pencil always start a new chat and never destroy a draft.
- **Key UX decisions:**
  1. **A draft is its text.** A New chat becomes a Draft as soon as it has typed text. Attachments, a `/`
     skill, the target, model or workspace alone do not make one. This matches how people work: they
     write first. (User, round 3.)
  2. **One quiet line per draft.** The row shows only the text preview, indented under the Chat label.
     There is no "Draft" word, target name, file count, icon or guide line. The position under Chat
     already says "unsent chat", and people recognise their own words. (User, rounds 2–3.)
  3. **The open draft is the selected row.** While a draft is open on New chat, its row carries the nav
     selected style and the Chat row does not. A blank New chat selects the Chat row as today.
  4. **Starting a new chat never loses a draft.** Chat, the pencil, Run and "+" always open a blank New
     chat. Every draft with text stays listed. No dialog.
  5. **Discard is one click.** An × at the right of the row, visible on hover/focus and on the selected
     row. No confirmation (the user confirmed the design as built).
  6. **Nothing extra elsewhere.** The collapsed strip shows no count (the user found a number confusing).
- **Alternatives considered and rejected:**
  - Two-line rows with an amber "Draft" marker, Agent/Team icon and target name (round 1). The user found
    them too busy.
  - Attachment-count and `/skill` previews for drafts without text (rounds 1–2). Rejected with rule 1.
  - A vertical guide line grouping the rows (rounds 1–2). Removed for a cleaner look.
  - An amber draft-count badge on the collapsed Chat icon. Rejected because it reads like unread
    messages.
  - "Show N more" collapsing of a long list. Not built; the existing scrolling section is used.

## Scope And Experience Goal

- **User or actor:** a desktop or web user composing the first message of a new Agent or Team run.
- **Context:** the left panel's primary nav section and the New chat surface (`/chat`).
- **Goal:** leave a half-written New chat to look elsewhere, and come back to it intact.
- **Observable success:**
  1. Type text (and, for example, attach an image and pick a Team).
  2. Open any run. A row with that text is under Chat.
  3. Click it. The same text, files, target, workspace, model, Auto-approve and member customizations
     are back.
- **In-scope surfaces and journeys:** Draft rows under the Chat row; Chat row and pencil selection;
  New chat re-entry; discard; send; narrow drawer.
- **Non-goals:**
  - drafts of existing runs (their composers keep their text already);
  - Org launch drafts;
  - server or cross-device storage;
  - any confirmation dialog;
  - a draft count or indicator on the collapsed strip.

## Related Requirements And Acceptance Criteria

The requirement wording below reflects the approved design. Several differ from SR-002's proposed
wording; see *Requirement impact* under Open Decisions.

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-001, AC-001, DEC-004 | A row appears once the New chat has typed text. Attachments, skills, target, model or workspace alone add none. A lone `/command` being typed (skill menu open) is not text yet. | UXJ-001; VIS-001, VIS-002 |
| REQ-002, AC-001 | Rows directly under the Chat row, newest started first; each row is one line with the text preview only | UXJ-001, UXJ-002; VIS-003, VIS-006 |
| REQ-003, AC-002 | Row click reopens New chat exactly as left (text, files, `/` skills, `@` mentions, target, workspace, model and model config, Auto-approve, member customizations); the row is selected and Chat is not | UXJ-001; VIS-004 |
| REQ-004, AC-003, BEH-001/002 | Chat and pencil open a blank New chat; drafts with text stay listed; Chat row selected | UXJ-002; VIS-001, VIS-003 |
| REQ-005, AC-004, BEH-006 | Run / "+" (and the Org page's Agent/Team switch) start fresh; drafts with text stay listed | UXJ-002 |
| REQ-006, AC-005, BEH-004 | A successful send removes that row; other rows stay; a failed send keeps the draft and its row unchanged | UXJ-003 |
| REQ-007, AC-006 | × discards the draft; discarding the open draft shows a blank New chat | UXJ-004 |
| REQ-008, AC-007 | Clearing an open draft's text shows "Empty draft" until the user leaves it; then the row and draft are gone | UXJ-005; VIS-005 |
| DEC-005 | Multiple drafts | VIS-006 |

## Visual Language

- **Existing product language to preserve:** the left panel's white primary nav section; nav rows
  (`rounded-md`, `px-3 py-2`, 14px medium, `gray-700`, hover `gray-100`, selected `bg-gray-100 gray-900`);
  heroicons; the resizable primary section and its divider. The Chat row, pencil and collapse buttons are
  unchanged.
- **Layout structure:** Draft rows are a list directly after the Chat row and before Agents, inside the
  same scrolling primary nav section. 2px gap below the Chat row (`mt-0.5`); 1px between rows (`space-y-px`).
- **Dimensions and spacing:**
  - Row height 32px (`py-1.5` + 20px line), full width of the nav column, `rounded-md` (6px).
  - Text starts at 36px from the row's left edge (`pl-9`), aligned with the "Chat" label.
  - Right padding 36px (`pr-9`) reserves the × area.
- **Typography:**
  - Inter, as in the product; 13px / 20px, regular weight, one line, truncated with an ellipsis.
  - "Empty draft": the same size, italic.
- **Colors:**
  - Row text `gray-700` (#374151); selected `gray-900` (#111827) on `gray-100` (#F3F4F6); hover background
    `gray-100`.
  - "Empty draft" `gray-400` (#9CA3AF).
  - × `gray-400`, hover `gray-700` on `gray-200` (#E5E7EB).
  - Focus ring `indigo-500` (#6366F1), 2px, inset on the row.
- **Surfaces:** no borders, shadows, rails or badges.
- **Controls and icons:** × is heroicons `x-mark`, 16px, in a 24px button (`p-1`, `rounded-md`), 6px from the row's right edge, vertically centred.
- **Hover, focus and selected treatment:**
  - The × is hidden at rest (opacity 0). It shows on row hover, on keyboard focus, always on the
    selected row, and always on touch screens (`hover: none`).
  - The Chat row loses its selected style while a Draft row is selected.

### New Or Changed Components

The UI reference location is traceability only; it does not prescribe the production implementation.

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Draft rows list | Kept New chats under Chat | rest, hover, keyboard focus, selected, "Empty draft" (open + text cleared), entering, leaving | `components/chat/ChatDraftRows.vue` |
| Chat primary nav row | Start a blank New chat | selected (blank New chat or a chat run), not selected (a Draft row is selected or another page) | `components/AppLeftPanel.vue` |
| New chat draft collection | Many drafts, one open; text decides "is a draft" | — | `stores/chatDraftStore.ts` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Composing a New chat | Blank New chat | Leave to copy details, then continue | Draft reopened intact, row selected | SCN-001, REQ-001–003, AC-001/002 |
| UXJ-002 | Draft with text exists | A draft open or listed | Start another chat | Blank New chat; earlier drafts listed | SCN-002, REQ-004/005, AC-003/004 |
| UXJ-003 | Draft open | Draft with text | Send it | Run opens; that row gone | SCN-003, REQ-006, AC-005 |
| UXJ-004 | Drafts listed | Any | Throw one away | Row gone; blank New chat if it was open | SCN-004, REQ-007, AC-006 |
| UXJ-005 | Draft open | Text cleared | Leave it | Row gone | REQ-008, AC-007 |

## Journey Details

- **UXJ-001 (critical journey):**
  1. On a blank New chat, pick Software Engineering Team, attach an image and type.
  2. At the first typed character, a row with that text fades in under Chat, selected. The Chat row
     loses its selected style (VIS-002).
  3. Open a run in the Workspaces tree. The row stays and is no longer selected; the Chat row shows its
     usual style for a chat run (VIS-003).
  4. Click the row. New chat shows the same heading, image, text, workspace, model and Auto-approve, and
     the row is selected (VIS-004). The text caret is in the message box.
  5. Continue writing and send (see UXJ-003).
- **UXJ-002:** with a draft open or listed, click Chat or the pencil (or Run / "+" elsewhere). A blank
  New chat opens with the Chat row selected; every draft with text stays listed (VIS-001 + rows). A blank
  New chat that had only attachments or a skill is not kept.
- **UXJ-003:**
  1. Open a draft and send. The run opens as today; that row fades out (150 ms); other rows stay.
  2. If the send fails, the user stays on New chat with the draft and its row unchanged.
- **UXJ-004:**
  1. Hover a row (or Tab to it) and click ×. The row fades out (150 ms) and keyboard focus moves to the
     next row, else the previous row, else the Chat row.
  2. If the discarded draft was open, a blank New chat is shown with the Chat row selected.
- **UXJ-005:** in an open draft, delete all text. The row stays, selected, reading "Empty draft" (VIS-005).
  When the user starts another chat, opens another draft or leaves, the row and the draft are gone
  (attachments in it go with it).

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Left panel primary nav with Draft rows | every page with the left panel | Re-enter a kept draft | Chat row → Draft rows → Agents … in the resizable, scrolling primary section | VIS-002–006 |
| UIS-002 | New chat surface | `/chat` | Compose; shows the open draft | Unchanged layout; content is the open draft | VIS-001, VIS-002, VIS-004, VIS-005 |
| UIS-003 | Navigation drawer (narrow) | strip icon tap | Same rows; tap opens the draft and closes the drawer | As UIS-001 inside the drawer | VIS-008 |
| UIS-004 | Collapsed strip | panel collapsed | Unchanged | No draft indicator | VIS-007 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Blank New chat | First typed character (not a lone `/command`) | Row fades in (150 ms), selected; Chat row unselected | Open draft listed | Draft is kept | Keep typing, leave, discard |
| TR-002 | Any page | Click a Draft row | Row selected; New chat shows that draft | Open draft | Previous open New chat without text is dropped | Edit, send, discard |
| TR-003 | Open draft / listed | Click Chat or pencil, Run, "+" | Blank New chat; Chat row selected | Blank New chat | Drafts with text kept | Type, open a row |
| TR-004 | Open draft | Send succeeds | Run opens; row fades out (150 ms) | Run view | Draft becomes the run | — |
| TR-005 | Open draft | Send fails | Today's failure presentation | Same open draft and row | Nothing removed | Retry, edit |
| TR-006 | Listed row | Click × | Row fades out; focus to neighbour row or Chat | Row gone | Draft deleted | — |
| TR-007 | Open draft | Click its × | Row fades out; blank New chat; Chat row selected | Blank New chat | Draft deleted | Type |
| TR-008 | Open draft | Delete all text | Row reads "Empty draft" | Open, still listed | — | Type again, leave |
| TR-009 | "Empty draft" open | Leave (TR-002/003, other page) | Row fades out | Row gone | Draft (and its attachments) dropped | — |
| TR-010 | Narrow drawer open | Tap a Draft row | Drawer closes; New chat shows the draft | Open draft | — | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| No drafts | No New chat with text | No list; panel exactly as today | — | — | VIS-001 |
| Draft open | TR-001/002 | Row `bg-gray-100`, `gray-900`, × visible; Chat row not selected | Edit, ×, send | Chat/pencil | VIS-002, VIS-004 |
| Drafts listed, elsewhere | On a run or another page | Rows `gray-700`, no selection, × on hover | Click, × | — | VIS-003 |
| Long text | Preview wider than the row | One line, ellipsis; full text in the tooltip | — | — | VIS-006 |
| Many drafts | More rows than the section height | Section scrolls; remains resizable; Agents etc. follow the rows | Scroll, resize | — | VIS-006 |
| Text cleared while open | TR-008 | "Empty draft", italic `gray-400`, selected | Type, × | Leave → gone | VIS-005 |
| Collapsed panel | Collapse button | Strip unchanged; no count | Strip icons as today | Redock | VIS-007 |
| Narrow drawer | Strip tap on narrow screens | Same rows; × always visible on touch | Tap, × | — | VIS-008 |

## Content, Labels, Validation, And Feedback

- **Product voice:** short sentence-case English, as elsewhere in the left panel.
- **Visible copy:**
  - Row: the draft's text, whitespace collapsed to single spaces, one line.
  - Cleared open draft: **Empty draft** (zh-CN: 空草稿).
- **Non-visible labels:**
  - List accessible name: **Drafts** (zh-CN: 草稿).
  - Row accessible name: **Draft: ‹text› — ‹target name›**; tooltip: ‹text›, then a new line, then
    ‹target name›.
  - × tooltip: **Discard draft**; accessible name: **Discard draft: ‹text›** (zh-CN: 丢弃草稿).
- **Errors:** none new; send failure keeps today's presentation.

### Form And Input Validation

N/A — no new inputs or validation.

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Docked left panel | Product's docked breakpoint | Rows in the primary section (VIS-002–006) | Hover reveals × |
| Collapsed strip | Panel collapsed | Unchanged (VIS-007) | Unchanged |
| Navigation drawer | Narrow screens (390×844 validated) | Same rows inside the drawer (VIS-008) | Tapping a row opens the draft and closes the drawer; × always visible on touch (`hover: none`) |

## Accessibility And Keyboard Behavior

- **Target:** the existing product's level.
- **Focus order:** Chat row → pencil → collapse → each Draft row → its × → Agents …
- **Focus after discard:** focus moves to the next row, else the previous row, else the Chat row.
- **Keyboard:**
  - Rows and × are buttons (Enter/Space).
  - The × becomes visible when focused.
  - The focus ring is 2px `indigo-500`, inset on rows.
- **Roles, names and states:**
  - The list is named "Drafts".
  - The open row has `aria-current="page"`.
  - Row and × names are given under Content.
- **Contrast:** `gray-700` and `gray-900` text on white or `gray-100` meet AA. "Empty draft" (`gray-400`)
  is a transient placeholder and matches the composer placeholder's treatment.

## Motion And Transitions

- **Rows:** fade and height in and out, 150 ms `ease-out` (opacity and max-height), on appear, discard,
  send and when an empty draft is dropped. Hover and selection colours use the product's
  `transition-colors`.
- **Reduced motion:** no row animation.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Draft storage | Rows and re-entry | In browser memory for the session; a reload starts with no drafts | DEC-002 (open): keep across restart on this device, or session only. The UI is identical either way. |
| Draft identity and route | Which draft New chat shows | `/chat` shows the open draft; no draft id in the URL | Architecture decision (route identity is not prescribed) |
| Attachment upload | Re-entry with files | Scripted locally: browser-local preview, local finalization on send | Real upload/finalize, and whether previews still resolve after re-entry or restart (requirements' technical facts) |
| Send | Row removal | Existing local launch path; failure not scriptable in the UI reference | Failed send keeps the draft and row |

## Final Visual Reference Inventory

All captured on 2026-10-07 after confirmation, through `http://127.0.0.1:4540/chat` (no preview state),
in the AutoByteus browser tool at device scale 2. Paths are relative to the ticket folder.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UIS-001/002 — no drafts, blank New chat | desktop 800×738 | `visual-references/VIS-001-new-chat-no-drafts-desktop-800x738.png` | Panel exactly as today; Chat row selected | Nav items shown depend on capabilities; workspace names |
| VIS-002 | UXJ-001 — first text typed, row selected | desktop 800×738 | `visual-references/VIS-002-first-text-draft-row-selected-desktop-800x738.png` | One-line row under Chat, aligned with the label, selected with ×; Chat row not selected | Draft text, team, image |
| VIS-003 | UXJ-001 — on a run, drafts kept | desktop 800×738 | `visual-references/VIS-003-drafts-kept-while-on-a-run-desktop-800x738.png` | Three rows newest first, none selected, no ×; no rail | Texts; run and tree content |
| VIS-004 | UXJ-001 — draft reopened intact | desktop 800×738 | `visual-references/VIS-004-draft-reentered-restored-selected-desktop-800x738.png` | Row selected; heading, file, text, settings restored | Texts, file, tree expansion |
| VIS-005 | UXJ-005 — open draft with text cleared | desktop 800×738 | `visual-references/VIS-005-open-draft-text-cleared-empty-draft-desktop-800x738.png` | "Empty draft" italic grey, selected, × visible | Other rows' text |
| VIS-006 | Many drafts, long text | desktop 800×738 | `visual-references/VIS-006-many-drafts-section-scrolls-desktop-800x738.png` | Seven one-line rows with ellipsis; section scrolls (Agents below) | Texts; section height is user-resizable |
| VIS-007 | UIS-004 — collapsed strip with drafts | desktop 800×738 | `visual-references/VIS-007-collapsed-strip-unchanged-desktop-800x738.png` | No count or indicator on Chat | Nav items by capability |
| VIS-008 | UIS-003 — narrow drawer | narrow-mobile 390×844 | `visual-references/VIS-008-drawer-draft-rows-narrow-mobile-390x844.png` | Same rows in the drawer; selected row with × | Texts, tree content |

## Linked UI Reference Evidence

- Runnable UI reference: ticket worktree root, integrated into the design repository's `personal` branch.
  Start it with `corepack pnpm dev --port 3210` and open `/chat`.
- Ticket record: `product-ticket.md` (same folder).
- Run instructions: repository `README.md` and `ui-reference-runbook.md`. No scenario is needed; create
  drafts through New chat.
- Journeys: UXJ-001–005; transitions TR-001–010.
- Mocked boundaries: see the table above. In the UI reference a sent Team message does not show its image
  in the conversation (mock stream; out of scope).

## Implementation Fidelity Boundary

- **Must preserve:**
  - the "text makes a draft" rule;
  - one-line rows (no marker, target, count, icon or rail);
  - placement and alignment;
  - selected and hover styles;
  - × visibility rules;
  - newest-first order (by start time; editing does not reorder);
  - Chat/pencil/Run/"+" keeping drafts;
  - re-entry restoring every draft field;
  - send removal and discard focus movement;
  - "Empty draft" until leaving;
  - 150 ms motion with reduced-motion off;
  - the unchanged collapsed strip.
- **Not prescriptive:** the store shape, the composer key, the route model, the local upload script.
- **May vary:** draft texts, names, tree content and capability-dependent nav items.
- **Responsive:** exact drawer width follows the product's existing drawer.
- **Design-system constraints:** Tailwind grey and indigo tokens, heroicons, and the existing nav row
  styles.

## Out Of Scope

- Drafts for existing runs.
- Org launch drafts.
- Server or cross-device storage.
- Undo after discard.
- "Show more" collapsing.
- Any indicator on the collapsed strip.
- Changing the collapsed strip's Chat icon behavior: today it reopens the panel and shows the open New
  chat; unchanged.

## Open Decisions And Risks

- **DEC-002 (open, user):** should drafts survive an app restart? There is no UI difference. Persisting
  attachments must keep previews working.
- **Requirement impact (for Solution Designer), approved by the user in this review:**
  - REQ-001 / DEC-004: a New chat becomes a Draft once it has **typed text**. Attachments, `/` skills,
    `@`-free target choice, model or workspace alone do not, and such a New chat is not kept when
    another one starts.
  - REQ-002: each row shows **only a one-line preview of the text**. No "Draft" marker, no target and
    no attachment count.
  - REQ-008: a draft whose **text** is fully cleared stops being listed once the user leaves it (its
    attachments go with it).
  - DEC-005: multiple drafts (confirmed as built).
  - REQ-007: discard has no confirmation (confirmed as built).
- **Risk:** a user who attaches files first and starts another chat before typing loses those
  attachments. The user accepted this ("normally people just first write").

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes` (revision in
  `product-ticket.md`)
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes`. Hover × and the fade are specified in text: the browser tool cannot hold a hover, and motion is not a still.
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
