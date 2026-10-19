# UI/UX Specification — "Part of" between Project Tasks

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: Product ticket `task-part-of`; Project Task `autobyteus-171` (step 2 of Task relationships), requested by the
  Solution Designer for the user.
- Related requirements revision ID: `SR-003` (`/Users/normy/autobyteus_org/autobyteus-worktrees/task-part-of/tickets/in-progress/task-part-of/requirements-doc.md`)
- Related IDs: REQ-008–REQ-012 (visuals), REQ-003, REQ-005, REQ-006, REQ-016; AC-009–AC-013, AC-017; SCN-001, 003, 004, 006, 007, 010, 011; DEC-005, DEC-006, DEC-012, DEC-013.
  Checks PART-001 to PART-009 in `visual-references/final-validation.mjs`.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL: `http://127.0.0.1:4671/projects/project-desktop-app` (`corepack pnpm dev --port 4671`)
- Explicit user-confirmation reference (2026-10-19): the user replied "approved" to the review package that described the design
  below and listed three open choices (the parent's key on a part's card; the three extras "New part", close hint, delete note;
  the empty Parts card). The user approved the package as shown, so the recommended choice of each stands: key on a part's card,
  all three extras, and the empty Parts card.
- Final validation date: 2026-10-19

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web` Projects: board (page and right-panel tab), Task page, tab Task
  view, New / Edit task, the Task page's delete confirmation.
- Pinned source commit or revision: `2f211340ee36b81cef74a74b2e042b5102c269d3` (baseline; v1.5.6-beta.1). Current source
  `origin/personal@cba6b85122` (v1.5.6-beta.8) was checked: every component changed here is identical in both revisions; only the
  board's "meaning search" status line differs and is not part of this design.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (`personal`)
- UI reference revision or commit: recorded in `product-ticket.md` at finalization (branch `design/task-part-of`, accepted base `e5ad9d8`).
- Ticket folder: `tickets/done/task-part-of/` after finalization
- Baseline report path: `ui-baseline-report.md` (repository root)

## Problem And Design Rationale

- User problem and intent: big work is a loose group of Tasks tied only by `depends on` and "follow-up of X" notes. The user wants
  to see a bigger Task with its parts and how many are done, simply and practically.
- Key UX decisions and why:
  - **One card, not two relations in one.** A Task shows either "Part of" (it has a parent) or "Parts" (everything else), between
    Description and Dependencies. One level only means the two never appear together. The Dependencies card is untouched: belonging
    and order are different facts, and that card carries the "Only informs" note.
  - **Same row pattern as Dependencies** (key · status pill · summary, each row opens that Task), so nothing new has to be learned.
    The parent's status pill makes a Done or Cancelled parent visible without extra text.
  - **Progress counts only what still counts.** "N of M done": M excludes Cancelled parts, which stay listed and are noted as
    "· 1 cancelled". No parts counted (only Cancelled) means no progress text.
  - **Cards stay flat and quiet.** A parent's card gets one small pill with its progress; a part's card gets a plain, un-boxed
    "↳ Part of <key>" line. Only the Blocked / Dependency-cancelled badge keeps its colour; a relation that merely informs does not
    ask for attention. The key appears because it refers to the parent (as in the Blocked badge); the hover title gives the parent's
    summary and status.
  - **Editor field mirrors "Depends on"** (search by key or text, chosen row with ×) but holds one Task. Tasks that are already
    parts are listed greyed out and unchoosable, so the one-level rule is visible, not just refused. A Task that has parts shows
    an explanation instead of a search.
  - **Three small extras (approved):** "New part" on a parent's page; a static close hint while the parent has open parts; the
    parent's delete confirmation says its parts stay.
- Alternatives considered and rejected: parts inside the Dependencies card; grouping or nesting parts under parents on the board;
  a progress bar or graph; the parent's summary instead of its key on a part's card (too long on a narrow card); a "Blocked by"
  style coloured pill for "Part of"; a notice or warning when closing a parent; blocking the Part of field with an error instead of
  greying out Tasks that are parts.

## Scope And Experience Goal

- User or actor: the user tracking Project Tasks, and the Project Task Manager agent (read through the same Task data).
- Context: desktop app; Projects board (page and right-panel tab), Task page, tab Task view, New / Edit task.
- Goal: see a bigger Task with its parts and progress; see what a Task is part of; set the parent in the app.
- Observable success: AC-009 to AC-013 (parts and progress; part's parent and its status; parent progress on the card; parent
  field search; strings in en and zh-CN).
- In-scope surfaces and journeys: UXJ-001 to UXJ-006 below.
- Non-goals: grouping, tree, graph, filter or search by parent on the board; notices; automatic status changes (the app only
  displays status); Workspaces-tree Task summary; agent tools and server; parent or parts for Temp tasks (they show nothing).

## Related Requirements And Acceptance Criteria

| ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-008, AC-009 | Parent shows every part (Done and Cancelled too) with key, status, summary; "N of M done"; empty state | UXJ-002; VIS-003–VIS-006b, VIS-009 |
| REQ-009, AC-010 | Part shows its parent (key, summary, status), opening it; indication on its card | UXJ-003; VIS-002d/e, VIS-007a–c, VIS-010 |
| REQ-010, AC-011 | Parent's card shows progress; board stays flat | UXJ-001; VIS-001, VIS-002a–f, VIS-017 |
| REQ-011, AC-012 | New / Edit task: choose, change, clear the parent; Tasks that are parts cannot be chosen; a Task with parts cannot get one | UXJ-004; VIS-011a–e, VIS-012 |
| REQ-012, AC-013 | Every new string in en and zh-CN | Content table; VIS-016a–d |
| REQ-006 | A deleted parent's parts stay, without a parent; confirmation says so | UXJ-005; VIS-013 |
| REQ-016, REQ-005 | App displays status only; hint that closing a parent closes its open parts | State Behavior; VIS-003 |
| REQ-004 | `depends on` unchanged and independent | VIS-002d, VIS-007a (both shown together) |

## Visual Language

- Existing product language to preserve: section cards (`rounded-xl`, 1 px slate-200 border, white), 12 px medium slate-500
  section labels, the dependency-row pattern, status pills (`taskStatusPillClass`), the step-1 picker, keys only where they link
  or refer to a Task. Board cards keep their order: summary → preview → relation line → files → worker.
- Layout and hierarchy:
  - **Task page:** header → Description → **Part of / Parts** → Dependencies → Assigned to. Tab Task view: same order, compact.
  - **Card:** one wrapping relation line (`gap-x 12 px, gap-y 6 px`, 8 px above) holding, in this order: Blocked / cancelled badge,
    parent progress pill, "Part of" line. A Task is never both a parent and a part, so at most two of the three appear.
  - **Editor:** "Part of (optional)" sits directly above "Depends on (optional)", each under a 1 px slate-100 divider with 20 px above.
- Dimensions and spacing:
  - Part of / Parts card: 16 px below Description and 16 px above Dependencies (page; the tab uses its 12 px stack); padding 24 px
    (page) / 16 px (tab). Rows 32 px high, padding 6 px × 8 px, 8 px gaps, at most `80ch` wide (as Dependencies).
  - Header line: label left; on a parent, the summary right-aligned on the same baseline.
  - Close hint 6 px under the list; "New part" 12 px under the hint or list, 32 px high.
  - Progress pill 20 px high, padding 2 px × 8 px, 4 px icon gap. "Part of" line 16 px high, 4 px gaps.
- Typography (product sans):
  - section label: 12 / 16, 500, slate-500 ("Part of" / "Parts");
  - parent summary: "N of M done" 12 / 16, 500, `#475569`; "· N cancelled" 12 / 16, 400, `#94a3b8`;
  - rows: key 14 px 500 slate-800; summary 14 px 400 slate-600, truncated;
  - progress pill: 12 / 16, 500; "Part of" line: 12 / 16, 400, `#64748b`, key 500 `#475569`;
  - close hint: 12 / 20, 400, `#94a3b8`; "New part": 14 / 20, 500, `#1d4ed8`;
  - editor help 12 / 20 slate-500 (as Depends on); delete note 14 / 24, red-800.
- Colours:
  - progress pill, not complete: background `#f8fafc`, text `#475569`, 1 px inset ring `#e2e8f0`, icon `squares-2x2` `#94a3b8`;
  - progress pill, complete (all counted parts Done): background `#ecfdf5`, text `#047857`, ring `#a7f3d0`, icon `check-circle` `#10b981`;
  - status pills: the existing ones; Done rows carry the 14 px check.
  - "Part of" line has no background or ring.
- Radii: progress pill full; rows 6 px; selected row and options 8 px; card 12 px.
- Icons (heroicons): `squares-2x2-20-solid` (progress), `check-circle-20-solid` (complete), `arrow-turn-down-right-20-solid`
  (Part of line, 14 px, `#94a3b8`), `plus-20-solid` (New part), `x-mark-20-solid` (remove), `magnifying-glass`.
- States: rows hover slate-50; focus 2 px blue-500 ring on rows, "New part", remove and input; options: active slate-100;
  unchoosable option text slate-400, `not-allowed`.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Parts card | "Part of" (parent row) or "Parts" (rows, summary, close hint, New part) | part; parent with / without counted parts; empty "No parts yet."; page (links, New part) / tab (opens in the tab, no New part) | `components/projects/TaskPartsSection.vue` |
| Parts progress pill | Card progress | incomplete, complete, hidden (no counted part) | `TaskPartsProgress.vue` |
| Part-of line | Card indication | with key; hover title | `TaskPartOfMarker.vue` |
| Part of field | Choose / change / clear the parent | empty, chosen, list open, no match, parts unchoosable, Task has parts, saving (disabled) | `TaskPartOfPicker.vue` in `ProjectTaskDraftEditor.vue` |
| Task card | Relation line (badge, pill, line) | see Journey Details UXJ-001 | `ProjectTaskRow.vue` |
| Delete confirmation | Parts note | shown only for a parent | `ProjectTaskDetail.vue` |
| Derivations | parent, parts, progress, unchoosable ids | — | `utils/projects/taskParts.ts` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | User on a board (page or tab) | Project with parents and parts | See progress and what belongs to what | Pills and lines on cards, lanes unchanged | REQ-010; PART-001, PART-005 |
| UXJ-002 | User opens a parent | Board | See parts and how far | Parts rows, "N of M done" | REQ-008; PART-002, PART-003 |
| UXJ-003 | User opens a part | Board or parent | See and open its parent | Part of row with parent status | REQ-009; PART-004 |
| UXJ-004 | User sets a parent | Edit / New task, or "New part" | Choose, change, clear | Saved; both Tasks update | REQ-011; PART-006 |
| UXJ-005 | User deletes a parent | Task page | Delete knowing parts remain | Parts stay, without a parent | REQ-006; PART-007 |
| UXJ-006 | Same views in the tab and in zh-CN, long keys, narrow board | — | Read and use them | No clipping | PART-005, 008, 009 |

## Journey Details

- **UXJ-001 Board.** Cards stay in their status lanes in the usual order; search and the Cancelled toggle are unchanged (VIS-001,
  VIS-017). A parent's card shows a pill "2 of 4 done" (VIS-002a), green and "3 of 3 done" when every counted part is Done
  (VIS-002b), "0 of 2 done" when none is (VIS-002c). A parent whose parts are all Cancelled shows no pill (VIS-002f). A part's
  card shows "↳ Part of autobyteus-25" (VIS-002e), beside the Blocked badge when it has one (VIS-002d). A Cancelled or Done
  parent's card shows its progress the same way (VIS-017). Hovering the pill gives "2 of 4 done · 1 cancelled"; hovering the line
  gives "Part of autobyteus-25: <summary> (To Do)". The compact tab board shows the same (VIS-008). Cards of a Task with no relation
  are unchanged.
- **UXJ-002 Parent.** The Parts card lists every part in key order: key · status pill (Done with ✓) · summary; each row opens that
  Task (page: link; tab: inside the tab). The header shows "2 of 4 done · 1 cancelled" (VIS-003, VIS-009). All Done: "3 of 3 done",
  parent status unchanged (VIS-004). Only Cancelled parts: just "1 cancelled" (VIS-006b). Cancelled parent: "1 of 1 done · 1 cancelled"
  (VIS-006). No parts: "No parts yet." and "New part" (VIS-005). While the parent is To Do or In Progress and has an open part, a
  static line reads "Setting this Task to Done or Cancelled also sets its open parts the same way." "New part" (page only) opens New
  task with this Task already chosen as the parent (VIS-012).
- **UXJ-003 Part.** The card titled "Part of" has one row: the parent's key · status pill · summary, opening the parent. A To Do
  (VIS-007a), Done (VIS-007b) or Cancelled (VIS-007c) parent shows its status in the pill. No Parts card, no New part. Tab: VIS-010.
- **UXJ-004 Editing.**
  - "Part of (optional)" with help text, a chosen row (key, summary, status, ×) and a search "Choose a Task · Search by key or text"
    ("Choose another Task · …" once one is chosen) (VIS-011a, VIS-011c).
  - Typing or clicking opens up to 8 matching Tasks of this Project, newest key first. The Task itself is not listed. A Task that is
    already a part is listed greyed out with "Already part of a Task" and cannot be chosen (VIS-011b). No match: "No other Tasks in
    this Project match." (VIS-011d).
  - Click or arrows + Enter chooses and replaces the current parent; the list closes and focus stays in the search. × clears the
    parent and moves focus to the search. Esc closes the list.
  - A Task that has parts shows "This Task has parts, so it can't be part of another Task." instead of a search (VIS-011e).
  - Save stores the choice; the Task page, the old and new parents' Parts cards and the cards update. A server refusal shows in the
    editor's existing error line.
  - "New part" opens New task with the parent chosen (VIS-012).
- **UXJ-005 Delete.** A parent's confirmation adds "Its 5 parts stay as separate Tasks." ("Its part stays as a separate Task." for
  one) below the usual message (VIS-013). A part or a Task without parts shows the usual message only. After deleting, the parts
  remain on the board without the "Part of" line.
- **UXJ-006.** Long keys: the "Part of" line and rows shorten the Project part in the middle and keep the number (VIS-014a–c);
  long summaries truncate in rows and clamp to 2 lines on cards. Narrow board: relation line wraps and stays inside the card
  (VIS-015).
- Failure and recovery: a parent that no longer exists is not shown and not counted; a save error shows the editor's error line.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Project board (page) | `/projects/:id` | Scan; open a Task | Cards with relation line | VIS-001, VIS-002a–f, VIS-015, VIS-017 |
| UIS-002 | Project board (tab) | Projects tab | Same, compact | Same | VIS-008 |
| UIS-003 | Task page | `/projects/:id/tasks/:ref` | Read; follow rows; New part | Description; Part of / Parts; Dependencies; Assigned to | VIS-003–VIS-007c, VIS-013, VIS-014b/c |
| UIS-004 | Task view (tab) | Card in the tab | Same, compact, read only | Same, rows open in the tab, no New part | VIS-009, VIS-010 |
| UIS-005 | New / Edit task | `…/tasks/new[?partOf=<task ID>]`, `…/:ref/edit` | Set the parent | Description; Part of; Depends on | VIS-011a–e, VIS-012 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | UIS-001/002 | A part's status changes (agent) | Card pill / line update live | Progress recounted | Derived, never stored | — |
| TR-002 | UIS-003/004 | Click a row | Navigates / opens in the tab | That Task | — | Back |
| TR-003 | UIS-003 | "New part" | New task opens | Parent chosen | `?partOf=<parent ID>` | Edit, Save, Cancel |
| TR-004 | UIS-005 | Type / click in the search | List opens | Filtered options | — | Arrows, Enter, Esc, click |
| TR-005 | UIS-005 | Choose an option | Row replaces the parent; list closes; focus stays | Chosen | — | Remove, Save |
| TR-006 | UIS-005 | Choose a Task that is a part | No change | — | — | Choose another |
| TR-007 | UIS-005 | Remove × | Row removed; focus to the search | No parent | — | Save |
| TR-008 | UIS-005 | Save | Existing save flow and notice | Task page (Edit) / board (New) | `partOfTaskId` stored on this Task; omitted keeps it, null clears it | — |
| TR-009 | UIS-003 | Delete a parent, confirm | Confirmation shows the parts note | Parts remain without a parent | Parts' `updatedAt` unchanged | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Parent, some done | — | "2 of 4 done · 1 cancelled"; rows | Row links, New part | — | VIS-003 |
| Parent, all counted done | — | "3 of 3 done" (green pill on card); parent status unchanged | Same | The agent closes the parent | VIS-004, VIS-002b |
| Parent, none done | — | "0 of 2 done" | Same | — | VIS-002c |
| Parent, only Cancelled parts | — | "1 cancelled"; no card pill | Same | — | VIS-006b, VIS-002f |
| Parent, no parts | — | "No parts yet." | New part | — | VIS-005 |
| Parent Done / Cancelled | — | Progress shown; no close hint | Same | — | VIS-006, VIS-017 |
| Part of To Do / Done / Cancelled parent | — | Parent row with its status pill | Open parent | — | VIS-007a–c |
| Editor, parts unchoosable | Query matches a part | Greyed "Already part of a Task" | Choose another | — | VIS-011b |
| Editor, Task has parts | — | "This Task has parts, so it can't be part of another Task." | — | — | VIS-011e |
| Editor, no match | No result | "No other Tasks in this Project match." | Change query | — | VIS-011d |
| Temp task | — | No Parts or Part of card, no card relation line | — | — | — |

## Content, Labels, Validation, And Feedback

- Product voice: "Task" capitalised; sentence case; status words are the existing ones.
- Exact strings (en / zh-CN):

| Key | en | zh-CN |
| --- | --- | --- |
| `projects.parts.partOf` | Part of | 所属任务 |
| `projects.parts.parts` | Parts | 子任务 |
| `projects.parts.progress` | {{done}} of {{total}} done | {{total}} 个中已完成 {{done}} 个 |
| `projects.parts.cancelledCount` | {{count}} cancelled | {{count}} 个已取消 |
| `projects.parts.none` | No parts yet. | 暂无子任务。 |
| `projects.parts.newPart` | New part | 新建子任务 |
| `projects.parts.closeHint` | Setting this Task to Done or Cancelled also sets its open parts the same way. | 将此任务设为已完成或已取消时，其未完成的子任务也会同样设置。 |
| `projects.parts.markerTitle` | Part of {{key}}: {{summary}} ({{status}}) | 所属任务 {{key}}：{{summary}}（{{status}}） |
| `projects.parts.editorHelp` | The bigger Task in {{project}} that this Task is part of. One level only: a part can't have parts of its own. | 此任务所属的 {{project}} 中更大的任务。仅限一层：子任务不能再有自己的子任务。 |
| `projects.parts.hasParts` | This Task has parts, so it can't be part of another Task. | 此任务有子任务，因此不能成为其他任务的子任务。 |
| `projects.parts.choose` | Choose a Task | 选择任务 |
| `projects.parts.chooseOther` | Choose another Task | 选择其他任务 |
| `projects.parts.remove` | Remove {{key}} | 移除 {{key}} |
| `projects.parts.alreadyPart` | Already part of a Task | 已属于其他任务 |
| `projects.parts.noMatch` | No other Tasks in this Project match. | 此项目中没有其他匹配的任务。 |
| `projects.parts.deleteNoteOne` | Its part stays as a separate Task. | 它的子任务将保留为独立任务。 |
| `projects.parts.deleteNote` | Its {{count}} parts stay as separate Tasks. | 它的 {{count}} 个子任务将保留为独立任务。 |
| Field label: `projects.parts.partOf` + `projects.ui.optional` | Part of (optional) | 所属任务（选填） |
| Search placeholder: `choose` / `chooseOther` + " · " + `projects.deps.searchPlaceholder` | Choose a Task · Search by key or text | 选择任务 · 按编号或内容搜索 |

  The reference's keys are suggestions; the strings are normative. The progress pill's accessible text and its hover title are
  `progress` (plus ` · ` + `cancelledCount` when any part is Cancelled).

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| Part of | Search + one chosen row | No | Same Project; not itself; not a Task that is a part; not offered at all for a Task that has parts | Prevented in the options (not reported) | Option note "Already part of a Task"; field note "This Task has parts, so it can't be part of another Task." |
| Server refusal | — | — | Server rules (REQ-002, REQ-003) | Save | Shown in the editor's existing error line (text from the server) |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Board (page) | ≥ 752 px container | 3 lanes (4 with Cancelled); relation line inside cards | — |
| Board narrow / tab | < 752 px | One column; the relation line wraps under the summary or preview | — |
| Task view in the tab | Panel width | Compact card (16 px padding); rows truncate summaries; no New part | Rows open inside the tab |
| Long keys | Does not fit | Project part shortened in the middle, number kept (the existing key component) | Full key in the tooltip |

## Accessibility And Keyboard Behavior

- Target: the existing product's support; the step-1 combobox pattern.
- Focus: editor order description → Part of (remove, search) → Depends on → Cancel / Save. After a choice focus stays in the
  search; after remove it goes to the search.
- Keyboard: Arrow Up/Down skip unchoosable options; Enter chooses; Esc closes.
- Roles and names: search is `combobox` with `aria-expanded`, `aria-controls`, `aria-activedescendant`, `aria-describedby` (help or
  has-parts note); options `option`; a part's option has `aria-disabled`; remove: "Remove <key>"; the card is a section labelled
  "Part of" or "Parts"; the card pill and line have hover titles as above.
- Contrast: pill text `#475569` on `#f8fafc`, `#047857` on `#ecfdf5`; line text `#64748b` on white; hint `#94a3b8` is
  deliberately quiet (as the existing "Only informs" note).

## Motion And Transitions

No new motion. The board's existing live-change highlight applies when a Task changes. Reduced motion: unchanged.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| `ProjectTask.partOfTaskId` (suggested name) | Cards, Parts card, editor | Stored by the fixture on save; null clears; omitted keeps | Stored on the part, same Project, one level, any parent status; returned with Project Tasks and live changes; the server refuses invalid parents |
| Derived parts, progress, unchoosable options | All surfaces | Computed in the browser from the Project's Task list (`utils/projects/taskParts.ts`) | Same derivation from the list the app holds; never stored |
| Parent closes its open parts | Hint text only | Not simulated: the app only displays status; Cancelled / Done parents are seeded with the statuses that closing would leave | Agent-side behavior (REQ-016); the app updates live |
| Deleted parent | Parts remain without a parent | Fixture clears the parts' parent | REQ-006 |
| Example data | Review | Invented Tasks, keys and statuses in `prototype/task-part-of/` (illustrative) | — |

## Final Visual Reference Inventory

All captured on 2026-10-19 in Chromium after the user's approval, from the normal entry points (`BASE=http://127.0.0.1:4671`).
Domain values (Project and Task names, numbers, statuses) are illustrative. Structure, wording, colours and rules are normative.
Paths are under `visual-references/` of the ticket folder.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details |
| --- | --- | --- | --- | --- |
| VIS-001 | Board | 1440×900 | `VIS-001-board-parents-and-parts-1440x900.png` | Pills and lines; flat lanes |
| VIS-002a | Parent card 2 of 4 | 2× | `VIS-002a-card-parent-2-of-4-2x.png` | Slate pill |
| VIS-002b | Parent card all done | 2× | `VIS-002b-card-parent-all-done-2x.png` | Green pill "3 of 3 done" |
| VIS-002c | Parent card none done | 2× | `VIS-002c-card-parent-none-done-2x.png` | "0 of 2 done" |
| VIS-002d | Part card with Blocked badge | 2× | `VIS-002d-card-part-with-blocked-badge-2x.png` | Badge and line on one wrapping line |
| VIS-002e | Part card | 2× | `VIS-002e-card-part-2x.png` | "↳ Part of autobyteus-25" |
| VIS-002f | Parent, only Cancelled parts | 2× | `VIS-002f-card-parent-only-cancelled-parts-no-progress-2x.png` | No pill |
| VIS-003 | Parent page, 2 of 4 | 1440×900 | `VIS-003-page-parent-2-of-4-1440x900.png` | Rows, summary, hint, New part |
| VIS-004 | Parent, all parts done | 1440×900 | `VIS-004-page-parent-all-parts-done-1440x900.png` | Parent still In Progress |
| VIS-005 | Parent, no parts | 1440×900 | `VIS-005-page-parent-no-parts-1440x900.png` | "No parts yet." + New part |
| VIS-006 | Cancelled parent | 1440×900 | `VIS-006-page-cancelled-parent-1440x900.png` | No hint |
| VIS-006b | Only Cancelled parts | 1440×900 | `VIS-006b-page-parent-only-cancelled-parts-1440x900.png` | "1 cancelled" alone |
| VIS-007a | Part of a To Do parent | 1440×900 | `VIS-007a-page-part-of-todo-parent-1440x900.png` | Part of row with Depends on beside it |
| VIS-007b | Part of a Done parent | 1440×900 | `VIS-007b-page-part-of-done-parent-1440x900.png` | Done pill with ✓ |
| VIS-007c | Part of a Cancelled parent | 1440×900 | `VIS-007c-page-part-of-cancelled-parent-1440x900.png` | Cancelled pill |
| VIS-008 | Tab board | 1440×900 | `VIS-008-tab-board-1440x900.png` | Compact cards |
| VIS-009 | Tab parent view | 1440×900 | `VIS-009-tab-parent-1440x900.png` | No New part |
| VIS-010 | Tab part view | 1440×900 | `VIS-010-tab-part-1440x900.png` | Part of row |
| VIS-011a | Editor, empty | 1440×900 full | `VIS-011a-editor-part-of-empty-1440x900-full.png` | Label, help, search |
| VIS-011b | Search, parts unchoosable | 1440×900 full | `VIS-011b-editor-part-of-search-parts-blocked-1440x900-full.png` | Greyed "Already part of a Task" |
| VIS-011c | Chosen | 1440×900 full | `VIS-011c-editor-part-of-chosen-1440x900-full.png` | Chosen row with ×; "Choose another Task" |
| VIS-011d | No match | 1440×900 full | `VIS-011d-editor-part-of-no-match-1440x900-full.png` | No-match line |
| VIS-011e | Task with parts | 1440×900 full | `VIS-011e-editor-task-with-parts-1440x900-full.png` | Explanation, no search |
| VIS-012 | New part | 1440×900 full | `VIS-012-new-part-parent-chosen-1440x900-full.png` | Parent chosen |
| VIS-013 | Delete a parent | 1440×900 | `VIS-013-delete-parent-confirmation-1440x900.png` | "Its 5 parts stay as separate Tasks." |
| VIS-014a | Long keys, board | 2× | `VIS-014a-long-keys-board-2x.png` | Number kept |
| VIS-014b | Long keys, parent page | 2× | `VIS-014b-long-keys-parent-page-2x.png` | Whole keys in rows |
| VIS-014c | Long keys, part page | 2× | `VIS-014c-long-keys-part-page-2x.png` | Long summary truncated |
| VIS-015 | Narrow board | 760×900 | `VIS-015-board-narrow-760x900.png` | Relation line wraps |
| VIS-016a–d | zh-CN: parent page, part page, editor search, board | 1440×900 | `VIS-016a-zh-CN-page-parent-1440x900.png`, `VIS-016b-zh-CN-page-part-1440x900.png`, `VIS-016c-zh-CN-editor-search-1440x900-full.png`, `VIS-016d-zh-CN-board-1440x900.png` | Strings |
| VIS-017 | Board with Cancelled lane | 1440×900 | `VIS-017-board-cancelled-lane-shown-1440x900.png` | Parts and parents in the Cancelled lane |

Explicitly illustrative: all Task texts, keys, counts, Project names and statuses; the order of fixture Tasks; the app shell
(unchanged baseline).

## Linked UI Reference Evidence

- Runnable UI reference: `corepack pnpm install --ignore-workspace --frozen-lockfile`, `corepack pnpm dev --port <port>` →
  `/projects/project-desktop-app` (parents: autobyteus-25, -14, -10, -6, -3, -1; parts: -19 to -23, -22 with a dependency),
  `/projects/project-onboarding-redesign` (long keys), `/chat?id=run-ptm-0001` (tab). Reload resets the example data.
- Ticket record: `product-ticket.md`.
- Validation: `visual-references/final-validation.mjs` (PART-001 to PART-009) and the step-1 `final-validation.mjs` (14/14);
  capture script `capture-references.mjs`.
- Mocked boundaries: see the data table.

## Implementation Fidelity Boundary

- Exact behavior and visible design implementation must preserve: one card, either "Part of" or "Parts", between Description and
  Dependencies, never inside Dependencies; row content and order; "N of M done" counting rule; Cancelled parts listed and noted
  but not counted; no pill when no counted part; card pill and line styles, order after the Blocked badge, no key line otherwise;
  the editor field's rules and strings; "New part", close hint and delete note as specified; flat board; all strings; the
  Dependencies card, badge and picker unchanged.
- Simulated and non-prescriptive: `partOfTaskId` naming, client-side derivation, fixture rules.
- Allowed to vary: illustrative content; the exact shortening of long keys (number stays).
- Design-system constraints: existing status pills, section cards, Tailwind palette, heroicons.

## Out Of Scope

Several parents; parts of parts; cross-Project parents; Temp-task parents; grouping, nesting, filtering or searching the board by
parent; tree or graph views; automatic status changes (the app displays only); notices; agent tools and server.

## Open Decisions And Risks

- The close hint is static text; it does not announce which parts closed (agents list them in the tool result, REQ-017).
- The board's "meaning search" status line (source v1.5.6-beta.8) is not in this baseline; a later baseline refresh can add it.
- One call can close several parts and stop their task agents (the user's decision; no UI warning by design).

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes` (revision in `product-ticket.md`)
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed has a final visual reference: `Yes`
- Every section covers the affected scope or is marked: `Yes`
- Values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality without placeholders, clipping, overlap, or drift: `Yes`
- Every visible detail is requirements-defining unless marked illustrative: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Artifact and visual-reference paths agree with this specification: `Yes`
