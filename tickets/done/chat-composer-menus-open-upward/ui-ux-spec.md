# UI/UX Specification — New-chat composer menus open upward

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `chat-composer-menus-open-upward` (Solution Designer, Product Design Requested, New Request, 2026-09-30)
- Related requirements revision ID: `SR-001` (requirements `Draft` at request time)
- Related IDs: REQ-001–REQ-004, BEH-001–BEH-004, AC-001–AC-005, SCN-001–SCN-004, OQ-001–OQ-003 (answered here as DEC-003, DEC-002, DEC-004), DEC-001
- Runnable prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`
- Review URL (round 1): http://127.0.0.1:3281/chat
- Explicit user confirmation (2026-09-30, after reviewing the live prototype): the user restated the behavior ("either for workspace or for model … they will always go upward … instead of downward"), was told the full rule (all five menus, short-window shrink/scroll, narrow bottom sheet kept, composer ~56px lower), then said: "Okay, I'm satisfied. The work is done."
- Final validation date: 2026-09-30

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend: `autobyteus-web`
- Pinned source revision: `origin/personal@57df63f079363ccab4f2301213f9d8a3458f72fa`
- Prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`
- Accepted base: `personal@045a4f7` (`WEB-BASELINE-REFRESH-002`)
- Ticket branch: `prototype/chat-composer-menus-open-upward`; prototype revision: recorded in `prototype-ticket.md` (Finalization)
- Ticket folder: `tickets/done/chat-composer-menus-open-upward/`
- Bootstrap report: `/Users/normy/autobyteus_org/autobyteus-web-prototype/prototype-bootstrap-report.md` (refresh `WEB-BASELINE-REFRESH-002`, acceptance `tickets/done/WEB-BASELINE-REFRESH-002/validation/product-acceptance.md`)

## Scope And Experience Goal

- User: desktop/web user starting a new chat.
- Context: `/chat` new-chat surface (heading, subtitle, composer, workspace hint).
- Goal: pick an agent/team, skill, workspace, model or thinking level without the menu dropping below the composer, covering the hint line or being cut off at the window bottom (user screenshot 2026-09-30).
- Observable success: every composer menu appears above; the composer group sits lower; nothing is clipped at any window height.
- In scope: the five new-chat composer menus (`@`, `/`, Workspace, Model incl. runtime flyout, Thinking) and the vertical position of the new-chat group.
- Non-goals: composer redesign; menu contents, search, keyboard and selection logic; running-conversation input; other popovers.

## Related Requirements And Acceptance Criteria

| ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-001 / BEH-001 / AC-001 | `@` and `/` menus open above the composer card on windows ≥640px wide | UXJ-001, TR-001, TR-002, VIS-002, VIS-003, VIS-007 |
| REQ-001 / AC-002 | Workspace, Model (and its runtime flyout) and Thinking menus open above their trigger | UXJ-002, TR-003–TR-005, VIS-004–VIS-006 |
| REQ-002 / BEH-002 / AC-003 | Composer group sits lower: padding `pt-[14vh] pb-10` (was `pt-10 pb-[6vh]`) | UXJ-003, VIS-001 |
| REQ-003 / SCN-004 / AC-004 | Short windows: menu stays up, height-limited, list scrolls, fully on screen | UXJ-004, TR-006, VIS-008 |
| REQ-004 / BEH-003 / AC-005 | <640px bottom sheet unchanged | VIS-009 |
| REQ-004 / BEH-004 / AC-005 | Running-conversation `/` menu unchanged | VIS-010 |

## Production-Quality Experience And Visual Specification

- Existing product language to preserve: every menu keeps its current look (white surface, `border-gray-200`, `rounded-lg`/`rounded-xl` as today, `shadow-lg`, widths `w-[23rem]` for `@`/`/`, `w-96` Workspace, `w-[19rem]` Model, `w-[17rem]` runtime flyout, `w-44` Thinking), its header/search/footer rows, typography and highlight states. Only placement and height limits change.
- Layout of the new-chat group (DEC-002 / OQ-002): the column stays `flex flex-1 flex-col items-center justify-center px-4 sm:px-6`; vertical padding becomes `pt-[14vh] pb-10`. Heading `mt-0`, subtitle `mt-2`, composer `mt-8 max-w-3xl`, hint `mt-2.5` are unchanged. Net downward move versus the shipped build = 10vh − 40px: 56px at 952px tall (heading top 323 → 379), 50px at 900, 32px at 720, 20px at 600.
- Hint line (DEC-004 / OQ-003): stays directly under the composer (`mt-2.5`, `text-xs text-gray-400`, folder icon). No menu may cover it.
- Menu placement (DEC-001): on windows ≥640px wide the five menus always use the "above" presentation:
  - `@` / `/`: positioned against the composer card: `absolute left-2 bottom-full mb-1.5` (menu bottom 6px above the card's top border). They may overlap the heading/subtitle.
  - Workspace: `absolute left-0 bottom-full mb-1.5` against its trigger wrapper.
  - Model: `absolute right-0 bottom-full mb-1.5` against its trigger wrapper.
  - Model runtime flyout (desktop hover/click): bottom-aligned with its runtime row (`bottom: -5px`, left or right side as today) so it grows upward; list max height 320px.
  - Thinking: `absolute right-0 bottom-full mb-1.5` against its trigger wrapper.
- Height rule (DEC-003 / OQ-001): menu max height = min(preferred height, space above its positioning box − 6px gap − 16px viewport margin), rounded down. Preferred heights: `@`/`/` 300px, Workspace 420px, Model 360px, Thinking 240px. The list area shrinks (`min-h-0`) and scrolls (`overflow-y-auto`); header and footer rows stay visible. Flyout list max = min(320px, row bottom + 5px − 12px − 10px). The menu never flips down, and there is no minimum height floor: the heading and subtitle always sit above the composer, so even a 1024x440 window leaves the `@` menu 166px (validated).
- Motion: unchanged (no new animation).

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Desktop, new chat | `/chat` idle | Address an agent/team with `@` or add a skill with `/` | Menu above the composer; choice applied as today | REQ-001, AC-001 |
| UXJ-002 | Desktop, new chat | `/chat` idle | Change workspace, model or thinking | Menu above its trigger; choice applied as today | REQ-001, AC-002 |
| UXJ-003 | Desktop, new chat | App opened at `/` → `/chat` | See the composer at the new lower position | VIS-001 layout | REQ-002, AC-003 |
| UXJ-004 | Desktop, short window | `/chat` in a window ≤ ~600px tall | Use any composer menu | Menu above, height-limited, list scrolls, fully visible | REQ-003, AC-004 |

## Journey Details

- UXJ-001: focus the message box → type `@` (or `/`) → menu appears above the card, first row highlighted; typing filters, ↑/↓ move, Enter chooses, Escape/outside click closes (unchanged). VIS-002, VIS-003, VIS-007.
- UXJ-002: click `Temp workspace` / model / bulb trigger → menu opens above with focus as today (Workspace search focused, Model search focused). Hovering or clicking a runtime in the Model menu opens its model list to the side, bottom-aligned, growing upward. VIS-004–VIS-006.
- UXJ-003: open the app; the new-chat group renders at the lower position. VIS-001.
- UXJ-004: same actions as UXJ-001/002 in a short window; a long list shows fewer rows and scrolls. VIS-008.

## Screen And Surface Specification

| Surface ID | Purpose | Entry Conditions | Structure And Hierarchy | Important States | Primary Actions | Exit / Next Action | Visual IDs |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UIS-001 | New-chat surface | `/chat` without a run id | Heading, subtitle, composer card (context files, message box, footer controls), hint line; column padding `pt-[14vh] pb-10` | Idle; menu open (above) | Type, `@`, `/`, footer menus, send | Send → chat run view | VIS-001–VIS-008 |
| UIS-002 | Composer menus (≥640px) | Trigger as today | Floating menu above its positioning box | Normal; height-limited + scrolling | Choose, filter, dismiss | Close on choose/Escape/outside click | VIS-002–VIS-008 |
| UIS-003 | Composer menus (<640px) | Trigger as today | Bottom sheet (unchanged) | — | as today | as today | VIS-009 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | UIS-001 idle, width ≥640 | Type `@` in the message box | Target menu opens above the card | UXJ-001 menu open | none | filter, ↑/↓, Enter, Escape |
| TR-002 | UIS-001 idle, width ≥640 | Type `/` | Skill menu opens above the card | menu open | none | as today |
| TR-003 | UIS-001 idle, width ≥640 | Click Workspace trigger | Workspace menu above the trigger, search focused | menu open | none | as today |
| TR-004 | UIS-001 idle, width ≥640 | Click Model trigger, hover/click a runtime | Model menu above; runtime flyout bottom-aligned, growing upward | menu + flyout open | catalog load as today | choose model |
| TR-005 | UIS-001 idle, width ≥640 | Click Thinking trigger | Thinking menu above the trigger | menu open | none | choose level |
| TR-006 | Any of TR-001–TR-005 when the space above < preferred height | same | Menu opens above with reduced height; list scrolls | menu open | none | as today |

## State Behavior

| Surface / State | Trigger | Required Presentation And Message | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 idle | Open `/chat` | Group at lower position, hint under composer | all | — | VIS-001 |
| UIS-002 normal | TR-001–TR-005 | Full preferred-height menu above | as today | Escape/outside/choose | VIS-002–VIS-007 |
| UIS-002 short | TR-006 | Height-limited menu above, scrolling list, fully on screen | as today | as today | VIS-008 |
| UIS-003 | width <640 | Bottom sheet with dim backdrop (unchanged) | as today | as today | VIS-009 |

## Responsive And Platform Behavior

- ≥640px wide: always-above rule at every window height (validated 1512x952, 1280x720, 1024x520, 1024x440).
- <640px wide: unchanged bottom sheet (`fixed inset-x-2 bottom-2`, backdrop `bg-black/20`); the lower padding also applies (heading at 271px on 390x844, VIS-009).
- Measurement is taken when the menu opens (as today); resizing while open is not re-measured (unchanged behavior).

## Accessibility And Keyboard Behavior

Unchanged: combobox/listbox/menu roles, `aria-expanded`, `aria-activedescendant`, focus on open, Escape returns focus to the trigger, arrow-key movement. Placement does not change DOM order or focus order.

## Content, Labels, Validation, And Feedback

No label or message changes. Visible menu content in the references is synthetic fixture content (see illustrative list below).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | Prototype Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Agents/teams, skills, workspaces, runtimes/models | Menu rows | Synthetic `populated` fixtures | Real catalogs; placement rule is independent of list length |
| Chat send / run | Run view (VIS-010) | Scripted local run, status Offline | Unchanged by this ticket |

## Final Visual Reference Inventory

All captured 2026-09-30 after user approval from the default entry `/` (lands on `/chat`), `deviceScaleFactor` 1, en-US, scenario `populated`. SHA-256 in `visual-references/manifest.json`.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-003 / UIS-001 idle | 1512x952 | `visual-references/VIS-001-new-chat-composer-lower-1512x952.png` | Heading top 379px, composer card 481–641, hint 651; hint under composer | Sidebar entries, workspace names/paths, model name |
| VIS-002 | UXJ-001 / `@` menu | 1512x952 | `visual-references/VIS-002-at-menu-above-1512x952.png` | Menu 216–476, bottom 6px above card top 481; overlaps heading; hint uncovered | Agent/team names and descriptions |
| VIS-003 | UXJ-001 / `/` menu | 1512x952 | `visual-references/VIS-003-slash-menu-above-1512x952.png` | Menu above the card, bottom 476 | Skill names |
| VIS-004 | UXJ-002 / Workspace menu | 1512x952 | `visual-references/VIS-004-workspace-menu-above-1512x952.png` | Menu above trigger (382–598, trigger wrapper top 604), search row on top | Workspace names/paths |
| VIS-005 | UXJ-002 / Model menu + flyout | 1512x952 | `visual-references/VIS-005-model-menu-runtime-flyout-above-1512x952.png` | Menu above trigger (495–598); flyout bottom-aligned (489–598) to the left, not below the composer | Runtime/model names, counts |
| VIS-006 | UXJ-002 / Thinking menu | 1512x952 | `visual-references/VIS-006-thinking-menu-above-1512x952.png` | Menu above bulb trigger (439–598) | Effort levels come from the model schema |
| VIS-007 | UXJ-001 / `@` menu | 1280x720 | `visual-references/VIS-007-at-menu-above-1280x720.png` | Menu 83–343 above card top 348; heading 246 | Fixture rows |
| VIS-008 | UXJ-004 / short window | 1024x520 | `visual-references/VIS-008-at-menu-short-window-scrolls-1024x520.png` | Menu 17–229 above card top 234, list shortened and scrollable, header/footer visible | Fixture rows; exact number of visible rows depends on list length |
| VIS-009 | UIS-003 / narrow `@` bottom sheet (preserved) | 390x844 | `visual-references/VIS-009-narrow-bottom-sheet-preserved-390x844.png` | Bottom sheet 8px from the bottom with backdrop, as today | Fixture rows |
| VIS-010 | Running-conversation `/` menu (preserved) | 1512x952 | `visual-references/VIS-010-run-view-slash-menu-preserved-1512x952.png` | Opens above the run composer, as today | Run title, fixture skill, Offline status |

## Linked Prototype Evidence

- Runnable prototype: `corepack pnpm dev --port <port>` at the prototype root, open `/` (lands on `/chat`).
- Prototype ticket record: `tickets/done/chat-composer-menus-open-upward/prototype-ticket.md`
- Change log: `prototype-change-log.md` (PC-001–PC-004)
- Behavior matrix: `ui-behavior-test-matrix.md`; validation script: `prototype/scripts/validate-chat-composer-menus-open-upward.mjs` (15/15, `review-evidence/final-validation/results.json`)
- Prototype code touched (reference only, not prescriptive): `composables/popover/useAnchoredPopover.ts` (`placement: 'above'` policy; measures the menu's positioning box), `ChatNewSurface.vue`, `ChatMessageInput.vue`, `ChatWorkspaceMenu.vue`, `ChatModelMenu.vue`, `ChatThinkingControl.vue`, `ChatTargetMenu.vue`, `ChatSkillMenu.vue`.

## Implementation Fidelity Boundary

- Must preserve exactly: always-above on ≥640px for the five new-chat menus; height rule and scroll; flyout grows upward; group padding `pt-[14vh] pb-10`; hint position; unchanged bottom sheet and running-conversation `/` menu; all menu content and interaction.
- Prototype-only: synthetic fixtures, scripted run. The shape of the popover option is illustrative.
- Permitted variation: pixel positions shift with real content (e.g. long agent lists, longer workspace names) as long as the rules above hold.

## Out Of Scope

Menu contents/search/selection, running-conversation input, other app popovers, composer redesign, re-measuring on window resize while a menu is open.

## Open Decisions And Risks

None open. Note for engineering: the `@`/`/` menu is positioned against the composer card (the message-input root is not positioned), so the available space must be measured from that box, not from the textarea. Measuring from the textarea put the menu 31px off-screen at 1024x520 during prototyping.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Prototype repository/root, source pin, and prototype revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes`
- Prototype, screenshots, and this specification agree: `Yes` (15/15 validation from `/`)
- Final visuals are production-quality with no unintended placeholders, clipping, overlap or drift: `Yes`
- Every visible detail is requirements-defining unless listed as illustrative: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Artifact and visual-reference paths agree with this specification: `Yes`
