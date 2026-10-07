# UI/UX Specification — project-manager-ux

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `project-manager-ux` (Product ticket and stable package identifier; no second ID)
- Related requirements revision ID: `SR-001` (requirements `Draft`, not yet approved)
- Related IDs: BEH-002, BEH-003, BEH-004, BEH-005; REQ-002 (changed, see Open Decisions), REQ-003, REQ-004;
  UC-002, UC-003; SCN-002, SCN-003; DEC-001–DEC-005 (answered below)
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL (during review): `http://127.0.0.1:4560/workspace`
- Explicit user-confirmation reference: 2026-10-07, user: "Perfect, I'm satisfied. I'm satisfied now. It's
  confirmed", after the consistency round and the left-panel click fix.
- Final validation date: 2026-10-07

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application: `autobyteus-web`
- Pinned source revision: baseline pin `origin/personal@10fb695` (WEB-BASELINE-REFRESH-007, accepted).
  Source checked at intake `f48dbfb` and finalization `cfeda54`: no change to the files this design
  touches (`components/projects/*`, `stores/projectTaskStore.ts`, `stores/projectStore.ts`,
  `types/project.ts`, `AgentRunTaskRows.vue`, `layouts/`).
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (branch `personal`)
- UI reference revision: ticket branch `design/project-manager-ux`, accepted base `a38bd6e`; final
  commit recorded in `product-ticket.md`
- Ticket folder: `tickets/done/project-manager-ux/` (in progress: `tickets/in-progress/project-manager-ux/`)
- Baseline report path: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md`

## Problem And Design Rationale

- **User problem:** the Project Task Manager creates Tasks and hands them to agents and teams, but
  the Projects board only changes after Refresh, and a Task does not say who works on it.
- **User intent (confirmed):** keep the Manager as an ordinary run in the left panel. While chatting,
  the user opens the Projects page, watches it change in real time, and clicks from a Task straight
  into the agent or team working on it. "The linking is really, really nice."
- **Key decisions:**
  1. The Projects pages are the whiteboard. A Project and its Tasks appear and move live; no Refresh.
  2. A Task shows its **root**: the one agent or team the Manager handed it to, with its status.
     Clicking it opens exactly that run; a team opens its coordinator.
  3. The left panel is part of the app frame. It keeps its runs and open/closed state across
     Chat and the Projects pages, and every row click opens its conversation from any page.
- **Alternatives built and rejected by the user (round 1):**
  - a Project Task Manager bar on the Project page ("Talk to manager", "New conversation");
  - a "Tasks" tab beside the Manager's chat;
  - listing Manager conversations under the Project's name in the left panel, with the workers
    grouped under Task labels;
  - Project and Task chips in the run header, and a "For <Project>" binding in New chat.
  The user: "we don't need the talk to manager ... our manager is already on the left side."
- **Also rejected:** listing every run linked to a Task (the root plus helpers a worker started).
  The user: "let's start simple. Let's just show the root."

## Scope And Experience Goal

- User: desktop user with Projects enabled (`ENABLE_PROJECTS`).
- Context: a Project Task Manager run (started like any agent run) plans, creates and delegates Tasks.
- Goal: see the Project's Tasks change as the Manager works, and reach the worker on any Task.
- Observable success: without Refresh, the board shows a Task when it is created and moves it when its
  status changes. A delegated Task names its agent or team with a status, and one click opens it.
- In scope: Projects list, Project board (Tasks tab), Task page, the left panel's run tree when used
  together with those pages.
- Non-goals: Task status control in the UI, auto-dispatch or auto-DONE, any Manager-specific entry,
  layout or marking, mobile, changes to the Task editor.

## Related Requirements And Acceptance Criteria

| ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-003 / BEH-002 | Agent-made Project and Task creations, edits and status changes appear on the Projects list, board and Task page without Refresh | UXJ-001; UIS-001–003; TR-001–004 |
| REQ-004 / BEH-003 | Each delegated Task shows its root agent or team with a status and opens it | UXJ-002; UIS-002, UIS-003; TR-005, TR-006 |
| BEH-004 | A DONE Task's root shows Stopped and cannot be opened; its runs leave the left panel (as designed in task-run-resources-workspace-cleanup) | UXJ-003; TR-007 |
| BEH-005 (preserved) | Projects list, board, search, Refresh, manual Task authoring and read-only status unchanged | UIS-001–003 |
| REQ-002 (changed) | The Tasks are seen on the Projects pages next to the left panel, not inside the conversation | UXJ-001 |
| New (F-005, F-006) | The left panel keeps runs and open/closed state across pages; a row click opens its conversation from any page | UXJ-004; TR-008 |
| REQ-001, REQ-005, REQ-006, BEH-001 | Dropped by the user (no Manager entry or marking). No UI change. | — |

## Visual Language

- **Preserved product language:** the Projects pages' slate/blue Tailwind palette, `rounded-xl` white
  sections with `border-slate-200`, board rows with `divide-slate-100`, the Workspaces tree status dots
  and initials avatars, and the team bolt icon (`heroicons:bolt-20-solid`, slate-500).
- **Layout:** unchanged. The root line sits inside the existing board row, under the Task text. On the
  Task page it is a new white section under Description, with the same padding as Description.
- **Spacing:**
  - board row: unchanged `px-4 py-3.5`; the root line is `mt-2`, `min-h-7`, `px-1.5 py-1`, aligned to
    the text by `-mx-1.5`;
  - Task page: section `p-5 sm:p-6`, `mt-4` below Description; the root row is `min-h-10`, `px-3 py-2`.
- **Typography (Inter, product default):**
  - board root line: 12 px (`text-xs`); an agent name is medium weight, a team name semibold, both
    slate-700;
  - Task page root line: 14 px (`text-sm`);
  - section label "Assigned to": `text-xs font-medium text-slate-500`, as "Description";
  - empty text: `text-sm text-slate-500`;
  - help line: `text-xs leading-5 text-slate-400`.
- **Root line, left to right:**
  - the identity: an initials avatar for an agent (gray-200 circle, gray-600 semibold initials; 16 px on
    the board, 20 px on the Task page) or the bolt for a team;
  - the name, which truncates;
  - on the right, a status dot plus label (`text-slate-500`);
  - a chevron-right (`heroicons:chevron-right-20-solid`, 14 px, slate-300, slate-500 on hover) when the
    root can be opened. A root that cannot be opened keeps a 14 px empty space instead, so every status
    lines up.
- **Status colors** (the product's `StatusDot`): Running = blue dot; Idle = green dot; Stopped = gray dot,
  with the name in slate-400. Couldn't start = `heroicons:exclamation-circle-20-solid` and the label in
  red-600, medium weight.
- **Hover and focus:**
  - an openable root: `hover:bg-slate-100`, `rounded-md`, focus `ring-2 ring-indigo-500`;
  - the board row keeps its `hover:bg-slate-50` and its whole-row link to the Task;
  - the root line sits above that link and opens the root, not the Task.
- **Live highlight:** indigo-50 (`#eef2ff`) background and a 2 px inset indigo-500 (`#6366f1`) left bar
  on the board row, fading to transparent (see Motion).

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Task root line | Who a Task is assigned to; opens it | agent / team; Running, Idle (openable); Couldn't start (reason in tooltip on the board, under the line on the Task page); Stopped. Densities: board row, Task page | `components/projects/ProjectTaskWorkers.vue` |
| Board Task row | Task text plus root line; live highlight | default, hover, arrived, moved | `components/projects/ProjectTaskRow.vue` |
| Task page "Assigned to" section | Root on the Task page | assigned (with help line only while Running/Idle), Couldn't start (reason), Stopped, not assigned | `components/projects/ProjectTaskDetail.vue` |
| Live Task/Project push | Board, Task page and Projects list follow agent changes | arrived, moved | `stores/projectTaskStore.ts` (`receiveLiveTasks`, `liveChanges`), `stores/projectStore.ts` (`receiveLiveProject`) |
| Worker row click in the left panel | Opens the conversation from any page | — | `components/workspace/history/AgentRunTaskRows.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | User chatting with a Project Task Manager run | Manager run open; Projects page not yet open | Watch the Project and Tasks being created | Projects list and board show them without Refresh | REQ-003, SCN-002 |
| UXJ-002 | User on the board or Task page | A Task delegated to an agent or team | Open the worker | That run's conversation is open, selected in the left panel | REQ-004, SCN-003 |
| UXJ-003 | User on the board | Manager marks a Task DONE, or a delegation fails | See the outcome on the Task | Stopped or Couldn't start shown; Task in its column | BEH-003, BEH-004 |
| UXJ-004 | User moving between Chat and Projects | Left panel expanded on the Manager run | Keep context; click any run | Left panel unchanged; a click opens the run | F-005, F-006 |

## Journey Details

**UXJ-001 — watch the Manager's work appear**
1. The user starts the Project Task Manager like any agent: with "+" next to it in the left panel, or
   from New chat. They send a request.
2. While the Manager works, the user clicks Projects in the left navigation.
3. When the Manager creates the Project, its card appears in the Projects list. Its counts follow its
   Tasks (VIS-001).
4. On the Project's board, each new Task enters the To Do column with the live highlight (VIS-002).
   Columns sort as today (latest change first), and the column counts update.
5. The Manager asks the user in chat before each dispatch. Nothing changes on the board until a Task
   is delegated and the Manager sets it IN_PROGRESS.
6. When that happens, the Task moves to In Progress with the moved highlight, and its root line appears
   (VIS-003, VIS-004).
- Failure: if a live update cannot be delivered, the board keeps its last state. Refresh stays
  available as today, and the existing "refresh failed" error and Retry apply.

**UXJ-002 — open the worker from a Task**
1. On the board (VIS-003) or the Task page (VIS-005), the user clicks the root line.
2. For an agent, the app opens its Manager conversation with that agent selected: route
   `/chat?id=<manager run>`, the agent row selected in the left panel, and the agent's conversation in
   the center.
3. A team opens the same way on its coordinator (VIS-009). The team is expanded in the left panel, so
   the other members are one click away.
4. Back on the Projects pages, the left panel is unchanged.

**UXJ-003 — outcomes on the Task**
- **DONE (set by the Manager):** the Task moves to Done with the highlight. The root shows Stopped, its
  name is muted, and it has no chevron and no click. Its runs leave the left panel as already designed.
  On the Task page the help line is hidden (VIS-008).
- **Couldn't start:** the Task stays in To Do. The root shows the red "Couldn't start". On the board the
  reason is in the tooltip; on the Task page it shows under the line (VIS-007). It cannot be opened.
  When the Manager delegates the Task again, the root shows the new delegation only.
- **Not delegated:** the board row has no root line. The Task page shows "Not assigned to an agent or
  team yet." (VIS-006).

**UXJ-004 — left panel across pages**
- Moving between Chat, Workspace, Projects, a board and a Task page does not collapse, reset or reload
  the left panel. Its runs, expanded groups and selection stay (VIS-003 shows it on the board).
- A click on any left-panel row (Manager run, worker, team, team member) opens that conversation, even
  when that run is already the selected run (VIS-009 reached from a Task page).

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Projects list | `/projects` | Find a Project; now also follows agent-created Projects live | Unchanged | VIS-001 |
| UIS-002 | Project board (Tasks tab) | `/projects/:id` | See Tasks by status; open a Task or its root | Unchanged toolbar and columns; root line inside each delegated Task row | VIS-002, VIS-003, VIS-004, VIS-010 |
| UIS-003 | Task page | `/projects/:id/tasks/:taskId` | Read a Task; see and open its root | Header with status badge (unchanged), Description (unchanged), new "Assigned to" section | VIS-005–VIS-008 |
| UIS-004 | Left panel run tree | all pages | Reach any run | Unchanged appearance; state kept across pages | VIS-003, VIS-009 |

## Interaction And State Transitions

| Transition ID | Surface / From State | Trigger | Immediate Feedback | Resulting State | Data / Side Effect | Next Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Projects list | An agent creates or edits a Project | Card appears or updates in place | List includes the Project | Live Project push | Open the Project |
| TR-002 | Board, any column | An agent creates a Task | Row enters at the top of To Do with the arrived highlight (2.4 s) | Count +1 | Live Task push | Open the Task |
| TR-003 | Board, Task in a column | An agent changes the Task's status | Row appears in the new column with the moved highlight (2.4 s) | Counts update | Live Task push | Open the Task or its root |
| TR-004 | Task page | An agent changes this Task | Status badge and "Assigned to" update in place | — | Live Task push | — |
| TR-005 | Board / Task page, root Running or Idle | Click the root line | Navigation | `/chat?id=<manager run>` with the root selected (a team opens its coordinator) | — | Chat with the worker |
| TR-006 | Board row | Click anywhere else on the row | Navigation | Task page | — | — |
| TR-007 | Board / Task page | The Manager sets the Task DONE | Root shows Stopped, no chevron, no click | Task in Done | Root runs stop and leave the left panel | — |
| TR-008 | Any page, left panel | Click a run row | Navigation | That conversation, selected | — | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Board row, not delegated | No root | Task text only (as today) | Open Task | — | VIS-003 ("Outline the launch checklist.") |
| Board row, Running / Idle | Root started | Root line with dot, "Running" / "Idle", › | Open root; open Task | — | VIS-003 |
| Board row, Couldn't start | Delegation failed | Red icon and "Couldn't start"; reason as tooltip | Open Task | Manager delegates again | VIS-004 |
| Board row, Stopped | Task DONE | Muted name, gray dot, "Stopped", no › | Open Task | — | VIS-004 |
| Board row, arrived / moved | Live push | Indigo highlight, 2.4 s | — | — | VIS-002 |
| Task page, not assigned | No root | "Assigned to" / "Not assigned to an agent or team yet." | — | — | VIS-006 |
| Task page, Running / Idle | Root started | Root row, › and the help line "When the Task is Done, this agent or team stops." | Open root | — | VIS-005 |
| Task page, Couldn't start | Delegation failed | Red "Couldn't start"; reason under the row in red-600; no help line | — | Manager delegates again | VIS-007 |
| Task page, Stopped | Task DONE | Muted root, "Stopped"; no help line | — | — | VIS-008 |
| Existing loading / error / empty / no-match states | — | Unchanged | — | — | — |

## Content, Labels, Validation, And Feedback

- Voice: the Projects pages' plain, short sentence case.
- Exact text (English / zh-CN):
  - Task page section label: "Assigned to" / "分配给"
  - empty: "Not assigned to an agent or team yet." / "还没有分配给智能体或团队。"
  - help line (Running/Idle only): "When the Task is Done, this agent or team stops." / "任务完成后，这个智能体或团队会停止。"
  - statuses: "Running" / "运行中", "Idle" / "空闲", "Couldn't start" / "无法启动", "Stopped" / "已停止"
  - root button accessible name: "Open {{name}}" / "打开 {{name}}"
  - root list accessible name: "Assigned to" / "分配给"
- The "Couldn't start" reason comes from the start result and is illustrative ("No model is set for
  frontend developer.").
- No new error messages: a failed live update falls back to the existing Refresh behavior.

### Form And Input Validation

N/A — no new inputs.

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop | Board container ≥ 752 px | Three columns (unchanged); root line fits in the column; the name truncates first | — |
| Narrow desktop | Board container < 752 px (e.g. 1024×768 window) | Columns stack (unchanged); root line spans the row | — (VIS-010) |
| Phone | — | N/A — Projects is desktop only | — |

## Accessibility And Keyboard Behavior

- Target: the existing product's level.
- Focus order on a board row: the row link (opens the Task), then the root button. On the Task page:
  the existing actions, then the root button.
- Keyboard: the root is a native `button`, activated with Enter or Space. A root that can't be opened
  is not focusable.
- Names: the list is "Assigned to"; the button is "Open <name>". A Couldn't start root has the reason as
  its `title`. Status is visible text, not color alone.
- Contrast:
  - slate-700 names and slate-500 statuses on white, as the existing tree rows;
  - red-600 for Couldn't start;
  - the muted slate-400 name for Stopped is a deliberate disabled treatment, with "Stopped" text beside it.

## Motion And Transitions

- Arrived Task:
  - opacity 0 → 1 and translateY(-4 px) → 0 over the first ~190 ms;
  - indigo highlight held to 35%, then faded out;
  - total 2400 ms, `ease-out`.
- Moved Task: the highlight only, 2400 ms `ease-out`.
- Reduced motion: no animation. The highlight shows statically for 2.4 s, then disappears.
- Root runs leaving the left panel on DONE: unchanged (200 ms fade and collapse, from the previous ticket).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Task root | Name, kind, status, run to open, Manager run, start error | Hand-written (`prototype/project-manager/projectManagerFixture.ts`, `workers` on each Task read) | Expose from the server's per-Task run resources (`task-agent-resources.ts`): the latest Manager-assigned root only, its live status, the coordinator run for a team, and the start failure message. Not exposed to GraphQL today. |
| Live Project/Task push | Board, Task page, Projects list | A local watcher pushes the fixture's Tasks into the store (`receiveLiveTasks`, `receiveLiveProject`) | A push or subscription for Project and Task changes made by agents (create, edit, status, delegation). Mechanism is for architecture. |
| Root status | Running / Idle / Stopped / Couldn't start | Scripted | Live run status; Stopped once the Task is DONE |
| Manager behavior | Creates the Project and Tasks, asks before each dispatch | Scripted turns on a new Project Task Manager chat (`plugins/96.project-manager.client.ts`) | The real agent from the agent repository; unchanged |
| Left panel state across pages | Kept | The reference no longer resets left-panel stores on `/projects*` (`plugins/00.prototype-state.client.ts`) | Already true in the product (`layouts/default.vue` keeps `AppLeftPanel` mounted) |
| Row click from another page | Opens the run | `AgentRunTaskRows.vue` also opens the run when not on its view | **Product change required:** the source has `if (!props.runSelected) emit('select-run')` (line 85), which does nothing when the run is already selected and the user is on a Projects page |

## Final Visual Reference Inventory

All screenshots are in `visual-references/`. They were captured at 1440×900 (VIS-010 at 1024×768),
light theme, English, through the normal entry points (no preview switches), after user confirmation.
VIS-002 was captured with reduced motion so the highlight is static. Capture steps are in
`review-evidence/capture-*.json`.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Illustrative Content / Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 / UIS-001 / Project created live | 1440×900 | `visual-references/VIS-001-projects-list-project-created-live-desktop-1440x900.png` | A Project created by the Manager appears in the list; left panel kept | Project names, descriptions and counts |
| VIS-002 | UXJ-001 / UIS-002 / Tasks arriving | 1440×900 | `visual-references/VIS-002-board-tasks-arriving-live-desktop-1440x900.png` | Arrived highlight (indigo-50 wash, indigo-500 left bar), new Tasks on top of To Do | Task texts; how many rows are highlighted at once |
| VIS-003 | UXJ-002, UXJ-004 / UIS-002 / roots Running | 1440×900 | `visual-references/VIS-003-board-assigned-roots-left-panel-kept-desktop-1440x900.png` | Root line for an agent and a team, Running with ›; no root line on non-delegated Tasks; left panel unchanged | Names, Tasks, tree contents |
| VIS-004 | UXJ-003 / UIS-002 / Couldn't start, Running, Stopped | 1440×900 | `visual-references/VIS-004-board-running-failed-stopped-desktop-1440x900.png` | The three states and their aligned status column | Names, Tasks |
| VIS-005 | UXJ-002 / UIS-003 / team Running | 1440×900 | `visual-references/VIS-005-task-assigned-team-running-desktop-1440x900.png` | "Assigned to" section, root row, help line | Names, description |
| VIS-006 | UIS-003 / not assigned | 1440×900 | `visual-references/VIS-006-task-not-assigned-desktop-1440x900.png` | "Not assigned to an agent or team yet." | Description |
| VIS-007 | UXJ-003 / UIS-003 / Couldn't start | 1440×900 | `visual-references/VIS-007-task-assigned-couldnt-start-desktop-1440x900.png` | Red status, reason under the row, no help line, To Do badge | Reason text, names |
| VIS-008 | UXJ-003 / UIS-003 / Stopped | 1440×900 | `visual-references/VIS-008-task-done-stopped-desktop-1440x900.png` | Muted root, "Stopped", no ›, no help line, Done badge | Names |
| VIS-009 | UXJ-002, UXJ-004 / team opens coordinator | 1440×900 | `visual-references/VIS-009-team-opens-coordinator-desktop-1440x900.png` | Coordinator's conversation open, coordinator row selected in the expanded team | Conversation and Team tab contents |
| VIS-010 | UIS-002 / narrow desktop | 1024×768 | `visual-references/VIS-010-board-assigned-roots-desktop-1024x768.png` | Stacked columns; root line spans the row with status on the right | Names, Tasks |

## Linked UI Reference Evidence

- Runnable UI reference: the design repository root. Run
  `corepack pnpm install --ignore-workspace --frozen-lockfile`, then `corepack pnpm dev --port <port>`,
  then open `/workspace`.
- Journey: click "+" next to Project Task Manager in prototype-workspace and send any request. Then send
  "yes", "yes", "build it anyway" and "the audit is done". Prototype Launch already has two delegated
  Tasks. Reset: `__resetProjectManager()` in the browser console.
- Ticket record: `product-ticket.md` in this folder.
- Capture driver: `prototype/scripts/project-manager-ux-drive.mjs`, with the step files in `review-evidence/`.
- Mocked boundaries: see Data, Contract, And Mock Boundaries. The fixtures are hand-written, about 32 KB
  in total; no captured or recorded data.

## Implementation Fidelity Boundary

- **Must preserve exactly:**
  - the root-only rule;
  - status labels, colors and alignment;
  - which states are openable;
  - a team opening its coordinator;
  - the Task page section and copy;
  - live updates without Refresh, and the highlight;
  - the left panel keeping its state;
  - row clicks opening from any page.
- **Does not prescribe:**
  - fixture modules, the scripted Manager, the WebSocket stand-in;
  - the `workers` array shape (at most one entry);
  - the `receiveLive*` store functions;
  - the `00.prototype-state` change.
- **May vary:** names, Task texts, Project descriptions, counts, the failure reason text.
- **Design system:** existing Tailwind tokens, `StatusDot`, the heroicons set.

## Out Of Scope

- Rejected by the user:
  - any Manager entry, bar, binding or special marking;
  - a Tasks tab beside the chat;
  - Task labels in the left panel;
  - showing helper runs on a Task.
- Not built (DEC-004): Task cards in the conversation in place of raw tool calls.
- Unchanged: the Task editor (source copy simplification noted as baseline drift), mobile.

## Open Decisions And Risks

- **For Solution Designer (user request):** could a Task later list every run linked to it, including
  helpers a worker started? The user would accept it if it is feasible. The investigation notes say the
  server records every run started for a Task, with role and assigner. Starting with the root only.
- **Requirements to update (user decisions):**
  - REQ-001, REQ-005 and REQ-006 are dropped.
  - REQ-002 becomes "seen on the Projects pages next to the left panel".
  - Two rules are new: the left panel keeps its state across pages, and a row click opens from any page.
- **DEC answers:**
  - DEC-001: no new entry point; the Manager is started like any agent.
  - DEC-002: moot. Any agent with the Project tools updates the board; the Projects pages don't single
    out a manager.
  - DEC-003: moot (no binding).
  - DEC-004: only live board + Task → root links in this delivery; chat cards not built.
  - DEC-005: stays behind `ENABLE_PROJECTS` (not questioned by the user).
- **Risks:**
  - The live push must cover every agent path that changes Tasks: create, update and status changes
    through `create_or_update_task`, and status changes that come from delegation.
  - Exposing the root needs the start failure message.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes`
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
