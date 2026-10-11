# UI/UX Specification — Delegated copy → its Task

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: Product ticket `delegated-copy-task-locator`; Project Task
  `project_task_be04657c-3a63-4215-b68f-dc2d0447baac` (requested by `/project_task_manager`).
- Related requirements revision ID: none (no `requirements-doc.md`; this design precedes a separate
  Software Engineering implementation Task).
- Related requirement, behavior, acceptance-criteria, and decision IDs: DEC-001 (final form, summary line),
  DEC-004 to DEC-008 in `product-ticket.md`.
  - Withdrawn by the user: DEC-002 (row icon) and DEC-003 (header chip).
  - Journeys UXJ-001 to UXJ-004 and scenarios SCN-001 to SCN-011 below.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL: `http://127.0.0.1:4641/chat?id=run-ptm-0001` (`corepack pnpm dev --port 4641`)
- Explicit user-confirmation reference (2026-10-11), after comparing variant A (icon, port 4641) with
  variant B (summary, port 4642):

  > I also think summary is better. I like the summary version. I also think we use summary. Let's do it

- Final validation date: 2026-10-11

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web`: the Workspaces tree (left panel) and
  the right panel's Projects tab.
- Pinned source commit or revision (mixed pin, recorded in `ui-baseline-report.md`):
  - Projects Task-status surfaces at `ff227eb72ef08dca4188451141789d0e6d3af356`;
  - everything else at `1cd1a3abc126df820e334c023621d0fb82de5b7b`.
  - The Workspaces tree and run views are unchanged between the two.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
  (`https://github.com/AutoByteus/autobyteus-web-prototype.git`, default branch `personal`)
- UI reference revision or commit: recorded in `product-ticket.md` at finalization (ticket branch
  `design/delegated-copy-task-locator`, base `dd89b84`, accepted refresh `a55ced2`).
- Ticket folder: `tickets/done/delegated-copy-task-locator/`
- Baseline report path: `ui-baseline-report.md` (repository root)

## Problem And Design Rationale

- User problem and intent:
  - A Project Task Manager run delegates Tasks to copies of agents and teams. In the Workspaces tree the
    copies appear as look-alike rows ("software engineering team", "agent package creator"), with no way
    to see or reach the Task each one works on (user screenshot 23.png).
  - The reverse path, Task card → worker, already exists (24.png).
- Key UX decisions and why they were chosen:
  - **The Task summary is shown under the copy's name**, so look-alike copies can be told apart at a
    glance.
  - **The summary is the link.** Clicking it shows the Task in Projects, so there is no extra icon.
  - **Team copies and agent copies are treated alike.** Members of a team copy do not repeat the team's
    Task.
  - **Locate shows the Task on its board, not the Task detail.** The lane shows the status and the
    neighbouring Tasks, and the focused card opens with Enter or a click.
  - The highlight reuses the board's live-change highlight, which matches the tree's selected-row colours.
- Alternatives considered and why they were rejected:
  - Row-end Task icon (variant A, built and compared): tidier, but copies still look alike until each
    icon is hovered. The user chose the summary.
  - Task chip in the copy's run header (built in round 1): withdrawn by the user, because the tree link is
    enough.
  - Opening the Task detail instead of the board; a text label without a link; labels only on look-alike
    rows (inconsistent); Task history on the row (clutter; the board already shows earlier Tasks). None of
    these was built.

## Scope And Experience Goal

- User or actor: a user supervising delegated work (typically a Project Task Manager run).
- Context: desktop app, the run tree in the left panel's Workspaces section, and the right panel.
- Goal: see which Task each delegated copy is on, and go to that Task.
- Observable success:
  - every task Agent / task Team row with a Task shows that Task's summary;
  - one click on the summary shows that Task, focused and highlighted, in the Projects tab on the right
    Project.
- In-scope surfaces and journeys:
  - Task-worker rows (`task_agent`, `task_team`) of the shared Workspaces-tree Task-worker row, as used under
    a standalone agent run;
  - the right panel reveal;
  - the Projects tab picker, board, search, Cancelled toggle, Temp tasks "Show all", and Task card focus and
    highlight.
- Non-goals:
  - the copy's run header (unchanged);
  - `@` collaborator rows and team member rows (unchanged);
  - the full Projects pages (`/projects/...`);
  - Task history per copy;
  - `/mobile`;
  - server or API changes, beyond what is listed under Data, Contract, And Mock Boundaries.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| DEC-001 (final) | A task Agent or task Team row whose copy has a Task shows the Task summary as a second line; it is a link to the Task | UXJ-001, UIS-001, VIS-001–004, VIS-012, VIS-014 |
| DEC-004 | Locate = reveal Projects, choose the Task's Project or Temp tasks, show the board, scroll, focus, highlight | UXJ-002, UIS-002, VIS-005–008, VIS-011, VIS-013 |
| DEC-005 | Make a hidden Task visible: clear a hiding search; Cancelled → Cancelled lane on; Done Temp task past ten → Show all | UXJ-003, VIS-009a/b, VIS-010 |
| DEC-006 | Done / Cancelled copies leave the tree (existing behaviour); locating a just-closed Task still works | UXJ-003, VIS-010 |
| DEC-007 | A copy with a follow-up Task shows and locates its current Task | UXJ-002, VIS-008 |
| DEC-008 | A Task with no Project locates on the Temp tasks board | UXJ-002, VIS-007 |

## Visual Language

- Existing product language to preserve:
  - the tree's row anatomy (branch rails, disclosure, status dot, avatar or people icon, name);
  - the Projects tab's board, picker and cards;
  - the board's live-change highlight;
  - the right panel's tool reveal (docked or drawer).
- Layout structure and visual hierarchy:
  - The summary is a second line inside the row's name column, directly under the name and left-aligned
    with it.
  - The name stays the primary line. The summary is secondary: smaller and lighter.
- Grid, dimensions, spacing, and density:
  - A copy row with a summary is 46 px tall (one-line rows stay 28 px).
  - The summary is 16 px tall, with 2 px above it; its box has 4 px horizontal padding and is pulled 4 px
    left, so the text aligns with the name.
  - The summary is as wide as the name column and truncates with an ellipsis.
  - The branch elbow and the team disclosure chevron stay centred on the **name** line, 14 px from the
    row top, not on the row centre.
- Typography:
  - The product's sans stack (`ui-sans-serif, system-ui, sans-serif, …`), 11 px / 16 px, weight 400.
  - It stays regular even on a team row, whose name is semibold.
  - One line, ellipsis.
- Color values and semantic roles (the product palette):
  - summary text at rest: `#808080` (`gray-500`);
  - on a selected row: `#4338ca` (`indigo-700`), matching the selected name;
  - hover: `#4338ca` with an underline (2 px offset);
  - located card: `#eef2ff` background and an inset 2 px `#6366f1` left bar (existing live-change values).
- Surfaces, borders, radii, shadows, elevation, and layering:
  - the summary has no surface of its own, and a 4 px radius for its focus ring;
  - the row's hover and selected surfaces cover both lines (existing styles).
- Controls, icons, imagery, and media assets: no new icon. The summary is a text button.
- Hover, active, focus, selected, disabled, validation, and feedback treatment:
  - **Hover:** `#4338ca`, underlined.
  - **Keyboard focus:** 2 px `indigo-500` ring around the summary box (VIS-012).
  - **Selected row:** summary `#4338ca`.
  - **Feedback:** the Projects tab appears with the card highlighted for 2.4 s and focused.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Task-worker tree row | Shows the copy's Task summary as a link | with / without Task; rest, hover, focus, selected; team (with disclosure) / agent | `components/workspace/history/WorkspaceTransientExecutionRow.vue` |
| Task card (compact board) | Located state: scroll, focus, highlight | located (2.4 s fade) | `components/projects/ProjectTaskRow.vue` |
| Projects tab and boards | Respond to a locate request | Project / Temp tasks; search cleared; Cancelled lane on; Show all Done | `components/projects/panel/ProjectsPanel.vue`, `ProjectTaskBoard.vue`, `TempTaskBoard.vue` |
| Right panel reveal | Show the Projects tab | docked; drawer (narrow); reopened after collapse | `components/layout/WorkspaceToolShell.vue` |
| Locate request and copy → Task lookup | Shared state for the above | — | `stores/taskLocatorStore.ts`, `composables/projects/useDelegatedCopyTask.ts` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Supervisor, Workspaces tree | A run with delegated copies is listed | Tell copies apart | Each copy row shows its Task summary | DEC-001; SCN-001, SCN-011 |
| UXJ-002 | Supervisor, Workspaces tree | Same; the right panel in any state | Go to a copy's Task | Projects tab on the Task's Project / Temp tasks, the card centred, focused and highlighted | DEC-004, DEC-007, DEC-008; SCN-002–005, SCN-008, SCN-010 |
| UXJ-003 | Supervisor | The Projects tab filtered, showing a Task, or the Task just closed | Go to a copy's Task | The Task made visible and located | DEC-005, DEC-006; SCN-006a–c |
| UXJ-004 | Keyboard user | Focus in the tree | Go to a copy's Task without a mouse | Focus on the located card; Enter opens it | SCN-009 |

## Journey Details

- **UXJ-001 Tell copies apart.**
  - The user expands a run in the Workspaces tree. Every task Agent or task Team row whose copy has a Task
    shows the Task summary under its name (VIS-001, VIS-002).
  - Rows with no summary:
    - team members (they share the team row's Task);
    - `@` collaborators (no Task, VIS-014);
    - copies whose Task is unknown.
  - Opening a copy (clicking its name or the rest of the row) is unchanged and does not navigate to the
    Task (VIS-004).
- **UXJ-002 Go to the Task.**
  1. The user clicks a summary (hover: indigo with an underline, VIS-003).
  2. The right panel shows **Projects**: docked; reopened if collapsed (VIS-011a/b); or the right drawer in
     narrow windows (VIS-013).
  3. The picker chooses the Task's Project, or **Temp tasks** for a Task with no Project (VIS-006,
     VIS-007). The choice is remembered like a manual pick.
  4. A Task open inside the tab returns to the board.
  5. The card scrolls to the centre of the tab, takes keyboard focus and shows the highlight, which fades
     over 2.4 s (VIS-005).
  - The center view and the tree selection do not change.
  - A copy given a follow-up Task shows and locates its **current** Task: the open one updated last, else
    the one updated last. Its earlier Done Task stays in Done with the same worker (VIS-008).
- **UXJ-003 Hidden Task.**
  - A search that hides the Task is cleared (VIS-009a/b); a search that still shows it is kept.
  - A Cancelled Task turns on "Cancelled (N)" and is located in the Cancelled lane (VIS-010).
  - A Done Temp task past the first ten turns on "Show all".
  - Note: in the product, a copy's row leaves the tree when its Task becomes Done or Cancelled, so this
    case arises only when the Task closes just before the click (DEC-006).
- **UXJ-004 Keyboard.**
  1. Tab from a copy row moves focus to its summary (ring, VIS-012).
  2. Enter or Space locates the Task and moves focus to the card.
  3. Enter on the card opens the Task inside the tab (existing behaviour).
- Failure and recovery:
  - If the Task is deleted or not found, the row shows no summary, so there is nothing to click.
  - If the board fails to load, the board's existing error and Retry apply; no card is focused.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Workspaces tree, Task-worker rows | Left panel → Workspaces → workspace → agent → run | Identify copies; click the summary to locate | Row: rails, disclosure (team), status dot / people icon, avatar, name; second line: Task summary | VIS-001–004, VIS-012, VIS-014 |
| UIS-002 | Right panel, Projects tab | Revealed by locate (docked or drawer) | Show the located Task | Picker; search, Cancelled (N), Refresh; lanes; located card | VIS-005–011, VIS-013 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | UIS-001 row at rest | Pointer over summary | Indigo + underline; native tooltip "Show Task in Projects: <Task>" | Hover | — | Click |
| TR-002 | UIS-001 | Click summary / Enter / Space on it | Right panel shows Projects | UIS-002 with the located card | Picker choice saved | Enter opens the Task; continue in the tree |
| TR-003 | Right panel collapsed or drawer closed | TR-002 | Panel reopens (docked) or the drawer opens | As TR-002 | Right panel visibility preference set to visible (same as the strip) | Close as usual |
| TR-004 | UIS-002 showing another Project / Temp tasks / an open Task | TR-002 | The picker switches; the board replaces the Task view | As TR-002 | — | — |
| TR-005 | UIS-002 search hides the Task | TR-002 | The search field is emptied | All Tasks visible; the card located | The per-Project search is cleared | Type a new search |
| TR-006 | Task is Cancelled | TR-002 | "Cancelled (N)" pressed; Cancelled lane shown | The card located in Cancelled | — | Toggle off |
| TR-007 | Temp Done Task past 10 | TR-002 | "Show all" expanded | The card located in Done | — | Show fewer |
| TR-008 | Located card | 2.4 s elapse / another locate | Highlight fades; a new locate removes the previous highlight at once | Only the latest located card is highlighted | — | — |
| TR-009 | UIS-001 | Click name / rest of row | (existing) opens the copy's conversation | Copy open, row selected | — | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Copy row with Task | Task lists loaded; a Task's root is this copy | Name + summary line (`#808080`, 11/16) | Open the copy; locate | — | VIS-001, VIS-002 |
| Copy row, selected | Copy (or a member) open | Selected row styles unchanged; summary `#4338ca` on the selected row itself | Same | — | VIS-004 |
| Copy row without a known Task | `@` collaborator, member, Task not found, lists not loaded yet | One line, as today | Open the copy | A summary appears once the Task is known | VIS-014 |
| Long Task title | Any | First line of the description, shortened at a word boundary for the label, then CSS ellipsis | — | Full title in the tooltip | VIS-002 |
| Located card | TR-002 | Centred, focused, `#eef2ff` + 2 px `#6366f1` bar, fading over 2.4 s | Enter / click opens the Task | Fades | VIS-005 |
| Reduced motion | `prefers-reduced-motion: reduce` | Instant scroll; highlight held without animation for 2.4 s, then removed | Same | — | — |

## Content, Labels, Validation, And Feedback

- Product voice and wording conventions to follow: Task capitalised; sentence case.
- Exact labels, headings, and action text for new or changed controls:
  - Summary text: the Task description's first non-empty line (the card's summary), shortened at a word
    boundary for one-line labels (`taskSummaryLabel`).
  - Tooltip and accessible name of the summary:
    - en `workspace.history.copyTask.locate` = "Show Task in Projects: {{title}}";
    - zh-CN = "在项目中显示任务：{{title}}".
  - The row's accessible name ends with ", " + `workspace.history.copyTask.accessible`:
    - en "Task: {{title}}";
    - zh-CN "任务：{{title}}".
- Empty, error, and recovery messages: none new.

### Form And Input Validation

N/A — no form input.

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Docked right panel | Right panel presentation `docked` | Projects tab shown in the docked panel | — |
| Narrow window | Right panel presentation not `docked` (e.g. 900 × 800) | Locate opens the right drawer on Projects (VIS-013) | Drawer closes as usual |
| Collapsed right panel | User hid the panel | Locate reopens it (VIS-011a/b) | — |
| `/mobile` | — | N/A (Projects is desktop only) | — |

## Accessibility And Keyboard Behavior

- Accessibility target: the existing product's keyboard and screen-reader support for the tree and the
  board.
- Focus order, focus movement, and focus return:
  - the summary is a focusable button after its row;
  - after locate, focus moves to the located card's button;
  - focus is not returned to the tree automatically.
- Keyboard interaction:
  - Enter or Space on the summary locates the Task and does not toggle or open the row;
  - Enter on the card opens the Task inside the tab.
- Roles, names, states, and live announcements:
  - the summary is a `button` named "Show Task in Projects: <Task>";
  - the row `treeitem` name gains ", Task: <Task>";
  - focus on the card announces the Task.
- Contrast: the summary at rest is `#808080` on white (secondary text, as the product's other secondary
  tree text); on hover and when selected it is `#4338ca`.

## Motion And Transitions

- The card scroll is smooth, to the centre.
- The highlight is the existing `task-live` keyframes: the wash and bar hold to 35 %, then fade; 2.4 s,
  ease-out.
- Reduced motion: instant scroll; a static highlight for 2.4 s.
- The tree adds no motion.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Copy → current Task | The summary and the locate target for a task Agent (`agentRunId`) or task Team (`teamRunId`) row | Reads every Project's Task list and the Temp tasks list in the browser; matches `root.ingressAgentRunId` (agent copy) or `root.teamRunId` (team copy); current = the open Task updated last, else the one updated last | Use the server's assignment data (`list_project_tasks` assignments carry `agentRunId` / `teamRunId` / `teamCoordinatorAgentRunId`) or an equivalent field on the collaboration view. Do not load every Project's Tasks per row. Keep it live when a Task is reassigned or renamed. |
| Task's Project | Picker choice | From the list the Task was found in | The Task's `projectId` (null → Temp tasks) |
| Example data | Review only | The design-only "Project Task Manager" run, "Desktop App" Project and its Tasks are invented (`prototype/delegated-copy-tasks/`) | — |

## Final Visual Reference Inventory

All captured on 2026-10-11 after user confirmation, in Chromium, from the normal entry point.
Domain values are illustrative throughout: run, Project and Task names and texts, member names, statuses,
counts and times. The Cancelled scenario (VIS-010) was triggered beneath the UI as an agent's close just
before the click; it has no user control.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 PTM run, copies with summaries | 1440×900 | `visual-references/VIS-001-ptm-run-copies-with-task-summaries-desktop-1440x900.png` | Summary under each team and agent copy; none under members | Names, Task texts |
| VIS-002 | UIS-001 rows at rest | 2× crop | `visual-references/VIS-002-copy-rows-task-summary-closeup-2x.png` | Type size, colour, alignment with the name, elbow and chevron on the name line, ellipsis | Texts |
| VIS-003 | TR-001 hover | 2× crop | `visual-references/VIS-003-task-summary-hover-closeup-2x.png` | Indigo underline on hover; row hover surface covers both lines | Texts |
| VIS-004 | TR-009 copy open | 2× crop | `visual-references/VIS-004-copy-open-row-summary-unchanged-closeup-2x.png` | Opening a member/copy keeps the summaries; selection styles unchanged | Texts |
| VIS-005 | UXJ-002 located, same Project | 1440×900 | `visual-references/VIS-005-summary-click-task-located-desktop-app-1440x900.png` | Projects tab, picker, card centred with wash and bar; center unchanged | Board content; highlight captured mid-fade |
| VIS-006 | TR-004 other Project | 1440×900 | `visual-references/VIS-006-task-located-other-project-prototype-launch-1440x900.png` | Picker switched; card located | Project, Tasks |
| VIS-007 | DEC-008 Temp tasks | 1440×900 | `visual-references/VIS-007-task-located-temp-tasks-1440x900.png` | Picker "Temp tasks"; card located in Open | Tasks |
| VIS-008 | DEC-007 follow-up | 1440×900 | `visual-references/VIS-008-follow-up-copy-current-task-located-1440x900.png` | Current (In Progress) Task located; earlier Done Task stays in Done | Tasks |
| VIS-009a | TR-005 before | 1440×900 | `visual-references/VIS-009a-panel-search-hides-task-1440x900.png` | Search "release" hides the Task | Query |
| VIS-009b | TR-005 after | 1440×900 | `visual-references/VIS-009b-search-cleared-task-located-1440x900.png` | Search empty; card located | — |
| VIS-010 | TR-006 Cancelled | 1440×900 | `visual-references/VIS-010-cancelled-task-located-cancelled-lane-1440x900.png` | Cancelled lane shown; the Cancelled card located | Tasks |
| VIS-011a | TR-003 before | 1440×900 | `visual-references/VIS-011a-right-panel-collapsed-1440x900.png` | Panel collapsed, summaries visible | — |
| VIS-011b | TR-003 after | 1440×900 | `visual-references/VIS-011b-right-panel-reopened-task-located-1440x900.png` | Panel reopened on Projects; card located | — |
| VIS-012 | UXJ-004 focus | 2× crop | `visual-references/VIS-012-task-summary-keyboard-focus-closeup-2x.png` | Focus ring around the summary | Text |
| VIS-013 | Narrow drawer | 900×800 | `visual-references/VIS-013-narrow-window-drawer-task-located-900x800.png` | Right drawer on Projects; card located | — |
| VIS-014 | Collaborators vs Task workers | 2× crop | `visual-references/VIS-014-collaborators-without-summary-task-workers-with-closeup-2x.png` | `@` collaborators one line; Task workers with summary | Names, texts |

## Linked UI Reference Evidence

- Runnable UI reference: `corepack pnpm dev --port 4641` → `/workspace` → prototype-workspace → Project
  Task Manager → "Dispatch the approved desktop app Tasks" (also `/chat?id=run-ptm-0001`; the Research
  Assistant run shows collaborators beside Task workers).
- Ticket record: `product-ticket.md`.
- Run instructions: as above; reload resets the in-memory fixtures.
- Relevant supporting artifacts:
  - `visual-references/final-validation.mjs` and `final-validation-results.json` (13/13 pass);
  - `review-evidence/round-1` to `round-4`.
- Relevant journey, transition, or scenario IDs: UXJ-001 to UXJ-004, TR-001 to TR-009, SCN-001 to
  SCN-011.
- Mocked boundaries and limitations:
  - the copy → Task lookup is a browser-side scan (see the table above);
  - the Cancelled case is triggered beneath the UI.

## Implementation Fidelity Boundary

- Exact behavior and visible design implementation must preserve:
  - which rows get a summary;
  - summary typography, colours, hover, focus and truncation;
  - the name-line alignment of the elbow and chevron;
  - the summary as a separate click target from the row;
  - every locate step (reveal, picker, board, search, Cancelled, Show all, scroll, focus, highlight, single
    highlight);
  - the en / zh-CN strings.
- UI reference state, fixtures, and simulated mechanisms that do not prescribe production architecture:
  - `taskLocatorStore` (request, `take`, the 3 s freshness window);
  - `useDelegatedCopyTask` (client scan);
  - the design-only fixture and plugin.
- Fixture content or visible details explicitly allowed to vary: all domain values, as listed above.
- Permitted responsive or platform variation: none beyond the existing docked / drawer policy.
- Existing design-system constraints: the product Tailwind palette (`gray-500` = `#808080`, `indigo-700` =
  `#4338ca`) and the existing live-change keyframes.

## Out Of Scope

- A Task link in the copy's run header (removed by the user).
- A row-end Task icon (not chosen).
- Task history per copy.
- Locating from the full `/projects` pages.
- Org-run Task workers, which use the Org tree's own rows: same treatment recommended, not designed or
  validated here.

## Open Decisions And Risks

- Production data source for the copy → current Task mapping (server assignment vs collaboration view):
  an engineering decision; the visible behaviour above is fixed.
- Source observation from the baseline refresh, unrelated to this change: the Cancelled pill's
  `ring-slate-300` class is not generated by the source's Tailwind config (it does not scan `utils/`).

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes` (the revision is
  recorded in `product-ticket.md` at finalization)
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual
  reference: `Yes`
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or
  the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling,
  clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry
  says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
