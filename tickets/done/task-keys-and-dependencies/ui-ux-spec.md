# UI/UX Specification — Readable Task keys and "depends on"

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: Product ticket `task-keys-and-dependencies`; Project Task
  `project_task_21c58d74-129a-454e-ae56-cffec4274aaf` (requested by `/project_task_manager`), step 1 of Task
  relationships.
- Related requirements revision ID: none (design first; a separate implementation Task follows).
- Related IDs: DEC-001 to DEC-009 in `product-ticket.md`; journeys UXJ-001 to UXJ-005 and checks KEY-001 to
  KEY-003 and DEP-001 to DEP-010 below.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL: `http://127.0.0.1:4651/projects/project-desktop-app` (`corepack pnpm dev --port 4651`)
- Explicit user-confirmation reference (2026-10-17): "sounds good. i like the UI. its approved". This came
  after the user confirmed the model:

  > so basically we only have depends on, but translated to different wording

  The user approved the design as shown. That settles the two open questions:
  - the "Depends on" field stays on New / Edit task (DEC-005);
  - a card whose dependencies are all Done shows no dependency line.
- Final validation date: 2026-10-17

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web`:
  - the Projects board (Projects page and the right panel's Projects tab);
  - the Task page and the tab's Task view;
  - the New / Edit task page;
  - the Workspaces tree's Task summary on delegated-copy rows.
- Pinned source commit or revision: `73f743211c8b86c704acb33f216154e42b7a67b8` (single pin, from
  `WEB-BASELINE-REFRESH-009`)
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
  (`https://github.com/AutoByteus/autobyteus-web-prototype.git`, default branch `personal`)
- UI reference revision or commit: recorded in `product-ticket.md` at finalization (branch
  `design/task-keys-and-dependencies`; accepted base `b31a5b1`).
- Ticket folder: `tickets/done/task-keys-and-dependencies/`
- Baseline report path: `ui-baseline-report.md` (repository root)

## Problem And Design Rationale

- User problem and intent:
  - Task IDs (`project_task_0e310af7-…`) are unreadable, so the user often cannot tell which Task is meant.
  - Relationships ("what waits for what", follow-ups) exist only as prose, so the board cannot show them.
  - The user wants only the simplest valuable part now.
- The agreed model (from the requester, 2026-10-11, and confirmed by the user):
  - **Keys** are `<project name in lower case>-<number>` (e.g. `autobyteus-42`). They are numbered per
    Project in creation order, existing Tasks get keys too, and a key never changes, even after a Project
    rename. The long ID stays underneath.
  - **One stored relationship:** "depends on", set on the later Task. It covers ordering ("can't go ahead
    until 37 is done") and follow-ups ("builds on 37"; often 37 is already Done).
  - **Derived, never stored:**
    - "Blocked by <key>" on the card, only while a dependency is not Done;
    - "Required by <key>" on the other Task;
    - "Dependency cancelled: <key>" when the only remaining issue is a cancelled dependency.
  - It informs and never prevents work.
- Key UX decisions:
  - **Card key:** a quiet line above the title. It is easy to scan and does not compete with the title.
  - **Badge:** only on open cards, and only for something that needs attention. Several blockers show as
    one badge with "+N"; hovering lists them all.
  - **Task page:**
    - the key sits next to the status, with a copy button;
    - "Depends on" lists every dependency, including Done ones, so follow-ups stay visible;
    - "Required by" lists the reverse.
  - **Editing:** users set dependencies on New / Edit task with a same-Project search that prevents loops.
    Agents set the same field through tools.
  - **Tree:** the Task summary on delegated-copy rows leads with the key.
- Alternatives considered and rejected:
  - the key inline before the title, or in the card footer;
  - a badge listing every blocker;
  - "Followed up by" as the inverse label (wrong for pure ordering), replaced by "Required by";
  - "Waiting for" as the badge wording (offered; the user kept "Blocked by");
  - read-only dependencies (the user approved in-app editing);
  - a grey "Depends on" line on cards with only Done dependencies (offered; the user approved without it);
  - `temp-N` keys for Temp tasks.

## Scope And Experience Goal

- User or actor: a user tracking Project Tasks and the agents working on them.
- Context: desktop app; the Projects pages, the right panel's Projects tab and the Workspaces tree.
- Goal: refer to a Task by a short key, and see what a Task waits for and what waits for it.
- Observable success:
  - every Project Task shows its key;
  - an open Task with an unfinished dependency says "Blocked by <key>" on its card;
  - the Task page lists dependencies and dependents with links;
  - a user can set dependencies when creating or editing a Task.
- In scope:
  - keys on cards, the Task page, the tab's Task view and the tree's Task summary;
  - the badge;
  - the Depends on / Required by lists;
  - the Depends on field;
  - en / zh-CN strings.
- Non-goals:
  - parent / child, duplicate / merged-into, graphs, filters, automatic notices;
  - keys or dependencies for Temp tasks;
  - dependencies across Projects;
  - agent tool input and output (implementation step);
  - searching the board by key (today's board search matches the description only; a later step can add
    keys).

## Related Requirements And Acceptance Criteria

| ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| DEC-001 | Every Project Task card shows its key above the summary | UXJ-001, VIS-001, VIS-002*, VIS-010, VIS-015 |
| DEC-002 | The Task page and the tab's Task view show the key chip with copy | UXJ-002, VIS-003–006, VIS-011 |
| DEC-003 | The badge on open cards: Blocked by (+N) / Dependency cancelled / none | UXJ-001, VIS-002a–d |
| DEC-004 | Depends on (all, Done included) and Required by (derived), each linked | UXJ-002, VIS-003–005, VIS-011 |
| DEC-005 | The "Depends on (optional)" field on New / Edit task; same Project only; no loops | UXJ-003, VIS-007a/b, VIS-008, VIS-009a |
| DEC-006 | No cross-Project dependencies | UXJ-003 (the search offers only this Project) |
| DEC-007 | Long keys stay readable; the number is always visible | UXJ-005, VIS-013, VIS-014 |
| DEC-008 | The tree's Task summary leads with the key | UXJ-004, VIS-012 |
| DEC-009 | Temp tasks have no key and no dependencies | VIS-012 (the Temp task row has no key) |

## Visual Language

- Existing product language to preserve:
  - the board cards, status pills (`taskStatusPillClass`), section cards (`rounded-xl` slate-200 border,
    white), and the 12 px medium slate-500 section labels;
  - the editor form;
  - the approved tree Task summary.
- Layout and hierarchy:
  - **Card:** key (secondary) → summary (primary) → preview → badge → file count → worker line.
  - **Task page header:** "Task details" · status pill · key chip, with the actions on the right.
  - **Task page body:** Description → Dependencies card ("Depends on", then "Required by") → Assigned to.
  - **Tab Task view:** the key chip and status sit at the right of the Description label; the
    Dependencies card follows the description.
- Dimensions and spacing:
  - card key line: 20 px high, 2 px below;
  - badge: 20 px high, 2 px × 8 px padding, 4 px icon gap, 8 px above;
  - key chip: 30 px high, padding 2 px 2 px 2 px 8 px, copy button 24 px;
  - dependency row: 32 px high, padding 6 px × 8 px, 8 px gaps, at most `80ch` wide;
  - between "Depends on" and "Required by": 20 px;
  - editor field: a 1 px slate-100 divider and 20 px above; selected rows 36 px; search input 44 px; the
    list shows at most 8 options and is up to 288 px tall.
- Typography (product sans):
  - card key: 12 / 20 px, 500;
  - badge: 12 / 16 px, 500;
  - key chip: 14 / 20 px, 500;
  - dependency row: key 14 px, 500, slate-800; summary 14 px, 400, slate-600, truncated;
  - group labels ("Depends on", "Required by"): 12 / 16 px, 500, slate-500;
  - editor help: 12 / 20 px, slate-500.
- Colours:
  - card key: `#64748b`;
  - **Blocked** badge: background `#fffbeb`, text `#92400e`, 1 px inset ring `#fde68a`, link icon
    `#d97706`;
  - **Dependency cancelled** badge: background `#ffffff`, text `#475569`, ring `#cbd5e1`, x-circle icon
    `#94a3b8`;
  - key chip: text `#334155`, white, 1 px border slate-200; the copy icon is slate-400, hover slate-700 on
    slate-100; "Copied" is emerald-700 with a check;
  - status pills: the existing ones (Done `#ecfdf5` / `#065f46` / ring `#a7f3d0`, with a 14 px check in the
    dependency lists).
- Radii: badges and pills full; key chip 6 px; dependency rows 6 px; editor rows and list 8 px.
- Icons (heroicons): `link-20-solid` (blocked), `x-circle-20-solid` (cancelled), `clipboard-document` /
  `check-20-solid` (copy), `x-mark-20-solid` (remove), `magnifying-glass` (search).
- States:
  - dependency row: hover slate-50;
  - focus: 2 px blue-500 ring on rows, the copy button, remove and the input;
  - search list: the active option is slate-100; a loop option is slate-400 with "Depends on this Task" and
    `not-allowed`.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Task key | One-piece key text; splits only when it overflows (middle shortened, number kept) | fits / overflows | `components/projects/TaskKey.vue` |
| Key chip | The key with copy on the Task page and the tab's Task view | rest, hover, focus, Copied (1.5 s) | `TaskKeyChip.vue` |
| Dependency badge | Derived card badge | blocked, blocked +N, cancelled, none | `TaskDependencyBadge.vue`, `utils/projects/taskDependencies.ts` |
| Dependencies card | Depends on / Required by | rows, None, "Only informs…" note when blocked; page (links) / tab (opens in the tab) | `TaskDependenciesSection.vue` |
| Depends on field | Set dependencies | empty, chosen rows, list open, no match, loop option disabled, saving (disabled) | `TaskDependencyPicker.vue` in `ProjectTaskDraftEditor.vue` |
| Task card | Key line and badge | — | `ProjectTaskRow.vue` |
| Tree Task summary | The key leads the summary | — | `components/workspace/history/TaskWorkerTaskSummary.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | User on a board | Project with Tasks and dependencies | See keys and what is blocked | Keys on every card; badges on blocked / cancelled-dependency open cards | DEC-001, DEC-003; KEY-001, DEP-001–004 |
| UXJ-002 | User opens a Task | Board | See and copy the key; see dependencies both ways | Chip; Depends on (all) and Required by, linked | DEC-002, DEC-004; KEY-003, DEP-009 |
| UXJ-003 | User creates or edits a Task | Task page / board | Set what it depends on | Saved; the card badge and both Tasks' lists update | DEC-005, DEC-006; DEP-005–008, DEP-010, KEY-002 |
| UXJ-004 | User in the Workspaces tree | Delegated copies listed | See which Task (by key) a copy works on | The summary shows "<key> <summary>" | DEC-008 |
| UXJ-005 | Project with a long name | Board / Task page | Read the keys | Whole keys where they fit; middle-shortened with the number where not | DEC-007 |

## Journey Details

- **UXJ-001 Board.**
  - Every Project Task card shows its key above the summary (VIS-001).
  - On To Do and In Progress cards with dependencies:
    - any dependency To Do or In Progress → amber "Blocked by <first open key>", plus "+N" for the other open
      ones (VIS-002a/b). The first is the lowest key number.
    - else any Cancelled → grey "Dependency cancelled: <first cancelled key>", "+N" (VIS-002c).
    - else (all Done) → no badge (VIS-002d).
  - Done and Cancelled cards never show a badge.
  - Hovering the badge gives the tooltip "Depends on: autobyteus-38 (To Do), autobyteus-39 (In Progress)".
  - The badge disappears by itself when the dependencies become Done.
- **UXJ-002 Task page.**
  - The header shows the key chip after the status. Copy writes the key to the clipboard and shows
    "✓ Copied" for 1.5 s (VIS-006).
  - The Dependencies card shows:
    - "Depends on": every dependency in key order: key · status pill (Done with ✓) · summary. Each row opens
      that Task.
    - "Only informs: work on this Task can start at any time." under the list while the Task is blocked
      (VIS-003).
    - "Required by": the Tasks that depend on this one (VIS-005).
    - An empty list shows "None".
  - A follow-up keeps showing its Done dependency (VIS-004).
  - In the right panel's tab (VIS-011) the same card is shown; a row opens that Task inside the tab.
- **UXJ-003 Editing.**
  - New task and Edit task show "Depends on (optional)" with help text, below the description (VIS-007a).
  - Choosing a Task:
    - the search ("Add a Task · Search by key or text") opens on click or typing and lists up to 8 Tasks of
      this Project, newest key first, each with key, summary and status (VIS-007b);
    - mouse click or arrows + Enter adds the Task; Esc closes the list; the list closes after a choice;
    - "No other Tasks in this Project match." when nothing matches;
    - the Task itself and Tasks already chosen are not listed;
    - a Task that already depends on this one, directly or not, is listed greyed out with "Depends on this
      Task" and cannot be chosen (VIS-008).
  - Chosen Tasks are rows (key, summary, status) with a remove ×.
  - Save stores the choice. The board badge, this Task's "Depends on" and the other Task's "Required by"
    update.
  - A new Task gets the Project's next number (VIS-009a/b: `autobyteus-41`, Blocked by `autobyteus-39`).
- **UXJ-004 Tree.**
  - A delegated copy's Task summary reads "<key> <summary>": the key in medium weight, then a space
    (VIS-012).
  - Its tooltip and accessible name read "Show Task in Projects: <key> <summary>".
  - A Temp task's summary has no key.
- **UXJ-005 Long keys.**
  - A key is shown whole wherever it fits (card key line, chip, dependency rows: VIS-013, VIS-014).
  - Where it does not fit, the Project part is shortened in the middle with "…" and the number stays
    ("customer-onboarding-experie…-12"). The full key is in the tooltip.
- Failure and recovery:
  - a dependency that was deleted is not listed and does not count;
  - a save error shows the editor's existing error line;
  - if the clipboard is unavailable, the key stays selectable and "Copied" still confirms the action
    attempt. The implementation should show the existing error pattern if the write fails.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Project board (page) | `/projects/:id` | Scan Tasks; open one | Cards: key, summary, preview, badge, files, worker | VIS-001, VIS-002*, VIS-015 |
| UIS-002 | Project board (right-panel tab) | Projects tab | Same, beside a run | As UIS-001 (compact) | VIS-010 |
| UIS-003 | Task page | `/projects/:id/tasks/:taskId` | Read; copy the key; follow links | Header (status, key chip, actions); Description; Dependencies; Assigned to | VIS-003–006, VIS-014 |
| UIS-004 | Task view (tab) | Card in the Projects tab | Same, compact | Description card (key chip + status), Dependencies, Assigned to | VIS-011 |
| UIS-005 | New / Edit task | `/projects/:id/tasks/new`, `…/:taskId/edit` | Set Depends on | Description; Depends on field | VIS-007a/b, VIS-008, VIS-009a |
| UIS-006 | Workspaces tree | Left panel | Identify copies by Task key | Copy row + "<key> <summary>" | VIS-012 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | UIS-001/002 card | A dependency becomes Done (agent) | Badge updates live | No badge when none is open or cancelled | — | — |
| TR-002 | UIS-001/002 card | A dependency becomes Cancelled | Blocked → Dependency cancelled (when none is open) | Grey badge | — | Edit to remove it |
| TR-003 | UIS-003 | Copy | "✓ Copied" 1.5 s | Key in the clipboard | — | — |
| TR-004 | UIS-003/004 | Click a dependency row | Navigates / opens in the tab | That Task's page / view | — | Back |
| TR-005 | UIS-005 | Type / click in the search | List opens | Filtered options | — | Arrows, Enter, Esc, click |
| TR-006 | UIS-005 | Choose an option | Row added; list closes; focus stays in the search | Chosen | — | Add more, remove, Save |
| TR-007 | UIS-005 | Option would loop | No change | — | — | Choose another |
| TR-008 | UIS-005 | Remove × | Row removed; focus to the search | — | — | Save |
| TR-009 | UIS-005 | Save | Existing save flow and notice | The Task page (Edit) / board (New) | `dependsOnTaskIds` stored on this Task; a new Task gets its key | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Card, blocked (one) | A dependency To Do / In Progress | "Blocked by autobyteus-35" | Open the Task | Clears when Done | VIS-002b |
| Card, blocked (several) | 2+ open | "Blocked by autobyteus-38 +1"; tooltip lists all with status | — | — | VIS-002a |
| Card, cancelled dependency | No open; ≥1 Cancelled | "Dependency cancelled: autobyteus-31" (+N) | Edit to remove | — | VIS-002c |
| Card, all Done | — | No badge | — | — | VIS-002d |
| Task page, blocked | — | Rows with pills; "Only informs: work on this Task can start at any time." | Row links | — | VIS-003 |
| Task page, follow-up | Dependency Done | Row "autobyteus-28 · Done ✓ · …" | Row link | — | VIS-004 |
| Task page, empty list | — | "None" | Edit task | — | VIS-003 (Required by), VIS-005 (Depends on) |
| Editor, no match | Query without results | "No other Tasks in this Project match." | Change the query | — | — |
| Editor, loop | Option depends on this Task | Greyed out, "Depends on this Task" | — | — | VIS-008 |
| Temp task | Task with no Project | No key, no badge, no Dependencies card | — | — | VIS-012 |

## Content, Labels, Validation, And Feedback

- Product voice: "Task" capitalised; sentence case; status words are the existing ones.
- Exact strings (en / zh-CN):

| Key | en | zh-CN |
| --- | --- | --- |
| `projects.deps.blockedBy` + key | Blocked by | 等待 |
| `projects.deps.cancelled` + key | Dependency cancelled: | 依赖已取消： |
| `projects.deps.more` | +{{count}} | +{{count}} |
| `projects.deps.badgeTitle` | Depends on: {{list}} | 依赖于：{{list}} |
| `projects.deps.heading` (screen readers) | Dependencies | 依赖关系 |
| `projects.deps.dependsOn` | Depends on | 依赖于 |
| `projects.deps.requiredBy` | Required by | 被以下任务依赖 |
| `projects.deps.none` | None | 无 |
| `projects.deps.informs` | Only informs: work on this Task can start at any time. | 仅作提示：此任务的工作随时可以开始。 |
| `projects.deps.editorHelp` | Tasks in {{project}} that come first, including a Task this one follows up. It never stops work on this Task. | {{project}} 中应先完成的任务，包括此任务所跟进的任务。它不会阻止此任务的工作。 |
| `projects.deps.add` · `searchPlaceholder` | Add a Task · Search by key or text | 添加任务 · 按编号或内容搜索 |
| `projects.deps.remove` | Remove {{key}} | 移除 {{key}} |
| `projects.deps.cycle` | Depends on this Task | 依赖于此任务 |
| `projects.deps.noMatch` | No other Tasks in this Project match. | 此项目中没有其他匹配的任务。 |
| `projects.key.copy` (tooltip) | Copy key | 复制编号 |
| `projects.key.copyLabel` (accessible name) | Copy Task key {{key}} | 复制任务编号 {{key}} |
| `projects.key.copied` | Copied | 已复制 |
| The field label uses `projects.deps.dependsOn` + `projects.ui.optional` | Depends on (optional) | 依赖于（选填） |

- Key format: the Project name in lower case, runs of non-alphanumeric characters become "-", trimmed,
  then `-<number>`. Examples: "AutoByteus" → `autobyteus-42`; "AutoByteus Agents" → `autobyteus-agents-7`;
  "Customer Onboarding Experience Redesign" → `customer-onboarding-experience-redesign-12`. Numbers are never
  reused. Engineering decides the handling of non-Latin names (see Open Decisions).

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| Depends on | Search + chosen list | No | Same Project only; not itself; no loop | Offered options (prevented, not reported) | Option note "Depends on this Task" |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Board (page) | Board container ≥ 752 px | 3 lanes (4 with Cancelled); the key line and badge inside cards | — |
| Board narrow / right-panel tab | Container < 752 px | One column; the badge wraps under the preview (VIS-015, VIS-010) | — |
| Task view in the tab | Panel width | The key chip shrinks (middle-shortened) before the status pill | — |
| Long keys | The key does not fit | Middle-shortened Project part; number kept | Full key in the tooltip |

## Accessibility And Keyboard Behavior

- Target: the existing product's keyboard and screen-reader support.
- Focus:
  - the editor: description → Depends on rows' remove buttons → search → Cancel / Save;
  - after a choice, focus stays in the search; after a remove, focus goes to the search.
- Keyboard in the search: Arrow Up/Down move over the options (skipping loop options); Enter adds;
  Esc closes.
- Roles and names:
  - the search is `combobox` with `aria-expanded`, `aria-controls` and `aria-activedescendant`;
  - options are `option`; a loop option has `aria-disabled`;
  - the copy button: "Copy Task key <key>"; "Copied" is announced as `role=status`;
  - the Dependencies card is labelled "Dependencies";
  - the tree summary's name includes the key.
- Contrast: the badge text `#92400e` on `#fffbeb` and `#475569` on white; the key `#64748b` on white
  (secondary text, as the product's other secondary card text).

## Motion And Transitions

- No new motion. The board's existing live-change highlight applies when a Task changes.
- "Copied" shows for 1.5 s with no animation.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| `ProjectTask.taskKey` | Cards, chip, rows, search | Assigned in the browser fixture at seed / create; never changed | The server assigns it at creation (and backfills existing Tasks in creation order); it never changes on rename; it is returned with Project Tasks and change-feed upserts |
| `ProjectTask.dependsOnTaskIds` | Badge, lists, editor | Stored by the fixture on save | Stored on the later Task; same Project only; the server rejects self, cross-Project and loops; returned with the Task; agents set it through tools |
| Derived: Blocked by / Required by / Dependency cancelled | Card and page | Computed in the browser from the Project's Task list | Same derivation (client or server); never stored |
| `TaskWorkerTask.taskKey` | Tree summary | Added to `GetTaskWorkerTasks` answers by the design-only layer | Add `taskKey` to the Task worker answer |
| Example data | Review | The "AutoByteus" Project (renamed from the earlier example "Desktop App"), dependency Tasks and the long-name Project are invented (`prototype/task-keys/`) | — |

## Final Visual Reference Inventory

All captured on 2026-10-17 after user approval, in Chromium, from the normal entry points. Domain values
are illustrative throughout (Project names, Task texts, numbers, statuses, workers). The structure, wording,
colours and rules are normative.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details |
| --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 board | 1440×900 | `visual-references/VIS-001-board-keys-and-dependency-badges-1440x900.png` | Key on every card; badges only on open blocked / cancelled-dependency cards |
| VIS-002a | Several blockers | 2× | `visual-references/VIS-002a-card-blocked-by-several-2x.png` | "Blocked by autobyteus-38 +1", amber |
| VIS-002b | One blocker | 2× | `visual-references/VIS-002b-card-blocked-by-one-2x.png` | "Blocked by autobyteus-35" |
| VIS-002c | Cancelled dependency | 2× | `visual-references/VIS-002c-card-dependency-cancelled-2x.png` | Grey "Dependency cancelled: autobyteus-31" |
| VIS-002d | All dependencies Done | 2× | `visual-references/VIS-002d-card-dependencies-done-no-badge-2x.png` | No badge |
| VIS-003 | Task page, blocked | 1440×900 | `visual-references/VIS-003-detail-depends-on-blocked-1440x900.png` | Key chip; Depends on rows (key, pill, summary); informs note; Required by "None" |
| VIS-004 | Follow-up | 1440×900 | `visual-references/VIS-004-detail-depends-on-done-follow-up-1440x900.png` | "autobyteus-28 · Done ✓ · …" listed |
| VIS-005 | Required by | 1440×900 | `visual-references/VIS-005-detail-required-by-1440x900.png` | Depends on "None"; Required by autobyteus-38 |
| VIS-006 | Copy | 2× | `visual-references/VIS-006-key-chip-copied-2x.png` | "✓ Copied" in emerald inside the chip |
| VIS-007a | Editor field | 1440×900 full page | `visual-references/VIS-007a-edit-depends-on-field-1440x900.png` | Label, help, chosen row, search |
| VIS-007b | Search open | 1440×900 full page | `visual-references/VIS-007b-edit-depends-on-search-open-1440x900.png` | Options: key, summary, status; newest first |
| VIS-008 | Loop prevented | 1440×900 full page | `visual-references/VIS-008-edit-depends-on-loop-not-allowed-1440x900.png` | Greyed option "Depends on this Task" |
| VIS-009a | New task, chosen | 2× | `visual-references/VIS-009a-new-task-depends-on-chosen-2x.png` | Chosen row with remove |
| VIS-009b | New task saved | 2× | `visual-references/VIS-009b-new-task-gets-next-key-2x.png` | Next key `autobyteus-41`; Blocked by autobyteus-39 |
| VIS-010 | Right-panel board | 1440×900 | `visual-references/VIS-010-right-panel-board-keys-badges-1440x900.png` | Keys and badges in the compact board |
| VIS-011 | Right-panel Task view | 1440×900 | `visual-references/VIS-011-right-panel-task-key-and-dependencies-1440x900.png` | Key chip beside status; Dependencies card |
| VIS-012 | Tree | 2× | `visual-references/VIS-012-tree-task-summary-with-key-2x.png` | "<key> <summary>" on copy rows; Temp task without key |
| VIS-013 | Long keys, board | 2× | `visual-references/VIS-013-long-keys-board-2x.png` | Whole key on cards; the badge middle-shortened with "-12" kept |
| VIS-014 | Long key, Task page | 2× | `visual-references/VIS-014-long-key-detail-2x.png` | Whole key in the chip and rows |
| VIS-015 | Narrow board | 760×900 | `visual-references/VIS-015-board-narrow-760x900.png` | One column; keys and badges |

## Linked UI Reference Evidence

- Runnable UI reference: `corepack pnpm dev --port 4651` (any port) →
  - `/projects/project-desktop-app`;
  - `/projects/project-onboarding-redesign`;
  - `/chat?id=run-ptm-0001`.
  Reloading resets the in-memory example data.
- Ticket record: `product-ticket.md`.
- Validation:
  - `visual-references/final-validation.mjs`: 13/13 (KEY-001 to KEY-003, DEP-001 to DEP-010);
  - capture scripts `capture-references.mjs` and `capture-new-task.mjs`;
  - `review-evidence/round-1/`.
- Mocked boundaries: see the table above.

## Implementation Fidelity Boundary

- Must preserve:
  - the key format and its immutability;
  - where keys appear and their styles;
  - the badge rules (open cards only; open blockers first, then cancelled, then nothing) with exact wording
    and colours;
  - the "+N" and the hover list;
  - Depends on listing every dependency, including Done; Required by derived;
  - row content and order (key, status, summary), with links;
  - the editor field's behaviour (same Project, no self, no loops, keyboard, list closing);
  - the copy feedback;
  - the tree summary's key;
  - all strings.
- Does not prescribe:
  - `taskKeysFixture.ts`, client-side derivation, or the GraphQL field names (`taskKey`, `dependsOnTaskIds`
    are suggestions);
  - the `TaskKey` overflow-measuring approach (any approach that keeps the number visible and copies as
    one string).
- Illustrative: all domain values.
- Design-system constraints: the existing status pills, section cards and Tailwind palette.

## Out Of Scope

- Other relationship types.
- Dependency graphs, filters ("blocked only"), automatic notices.
- Cross-Project dependencies.
- Keys for Temp tasks.
- Agent tool display and input of keys and dependencies (implementation step).

## Open Decisions And Risks

- **Prefix uniqueness after a rename** (engineering): a renamed Project keeps its old prefix, so a new
  Project could take the old name and produce the same prefix. Reserve each Project's prefix (or reject /
  suffix a colliding new prefix).
- **Non-Latin Project names** (engineering): the UI reference drops non-alphanumeric characters (fallback
  `project`). Choose a transliteration or fallback rule.
- **Deleting a Task others depend on** (engineering): dependents should drop it from their lists, which the
  UI already tolerates.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes` (the revision in
  `product-ticket.md`)
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
