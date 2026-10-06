# UI/UX Specification — Delegated runs leave the Workspaces tree when their Task is DONE

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `task-run-resources-workspace-cleanup` (Product ticket = stable package identifier)
- Related requirements revision ID: `SR-002` (requirements `Ready for Approval`; the user asked for UI first)
- Related IDs: BEH-001–006, REQ-001–009, AC-001, AC-002, AC-004, AC-005, AC-006, AC-008, AC-009, SCN-001–004, DEC-001–006
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL (normal entry point, no preview switch): `http://127.0.0.1:4530/workspace`
- Explicit user-confirmation reference (2026-10-06):
  - On the cleaner rows: "really really nice design. I like that."
  - On delegated agents and Teams behaving as designed: "I like the current design."
  - Final: "perfect. i like the UI. now i confirm"
- Final validation date: 2026-10-06

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web`, the Workspaces tree (left panel) and the Agent run view
- Pinned source commit or revision: `origin/personal@10fb695` (baseline pin).
  - Re-checked at finalization against `origin/personal@d9ffaa7`.
  - The Task-row files (`WorkspaceTransientExecutionRow.vue`, `AgentRunTaskRows.vue`, `services/agentCollaboration/*`, `agentRunCollaborationStore.ts`) are unchanged.
  - The other changes are production's implementation of the already-designed run-settings unification, plus non-visible wiring in `WorkspaceAgentRunsTreePanel.vue`. No baseline refresh is needed.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- UI reference revision or commit: recorded in `product-ticket.md` (Finalization)
- Ticket folder: `tickets/done/task-run-resources-workspace-cleanup/`
- Baseline report path: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md` (WEB-BASELINE-REFRESH-007, accepted)

## Problem And Design Rationale

- **User problem and intent:**
  - A Project Task Manager delegates Tasks, and their runs appear under it in the Workspaces tree.
  - When a Task is DONE those runs are stopped, but their rows stay forever (Offline), so the tree becomes unmanageable.
  - User: "when it's created, it appears; when it's done, cleaned up, it disappears."
- **Key UX decisions:**
  1. **The tree shows live work only.** Every run delegated for a Task leaves the tree when the Task is DONE: the assigned agent, runs it delegated further, helpers it brought in, and a delegated Team with its members. Nothing new is added: no toast, badge, "finished" section or toggle. The Manager's own conversation already states that it marked the Task DONE (its `update_project_task` tool call and reply), and that is the feedback.
  2. **Rows leave with a short fade** (200 ms), so the change is perceived as "finished and gone", not as a glitch. New rows still appear at once, as today.
  3. **An open worker conversation returns to the Manager** when its Task becomes DONE. The product already returns to the host when a selected child leaves the run's view.
  4. **The Manager's Team tab keeps its messages** with runs that are no longer listed. These are the Manager's own communication record, and they contain no links into runs.
  5. **Delegated rows read like every other tree row.** The dashed indigo box and tint are removed, and a delegated Team keeps only its bolt icon, in the tree's slate. The user confirmed this cleaner look: "really really nice design".
- **Alternatives considered:**
  - Instant removal: rejected as abrupt, since the row jumps away mid-scan.
  - Keeping a closed worker's conversation open read-only with a notice: rejected because it adds UI and leaves a selection with no row in the tree.
  - A "show finished" toggle or archive view: out of scope; it would be a new requirement.
  - A new marker on every Task-linked run: discussed with the user. The user chose the current design: delegated agents use the normal row, and delegated Teams use the bolt.

## Scope And Experience Goal

- **User or actor:** the user watching the Workspaces tree; the Project Task Manager (or any agent that assigns Task work).
- **Context:** a root run (Agent, Agent Team or Agent Org) with runs delegated for Tasks.
- **Goal:** the tree reflects work that is alive.
- **Observable success:**
  - When a Task is DONE, all of its delegated rows fade out of the tree live.
  - They stay hidden after a reload.
  - A reopened Task that is delegated again shows only its new runs.
  - Everything else is unchanged.
- **In-scope surfaces and journeys:**
  - The Workspaces tree rows under a root run.
  - The Agent run view (selection fallback).
  - The Team tab (unchanged content).
  - The Projects board (unchanged; it reflects Task status).
- **Non-goals:**
  - Deleting data.
  - Hiding runs stopped without DONE (root Stop, idle, error).
  - Rows for `@` collaborators and delegations without a Task.
  - A UI to browse finished work.
  - A user control for Task status. The product has none: Task status is changed only by agent tools.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| BEH-002, REQ-001, AC-001, AC-002, DEC-001 | Every run of the DONE Task leaves the tree (agent, further delegations, helpers, Team and members). | UXJ-001, TR-001, VIS-002 |
| REQ-002, QR-001 | Removal is live, at stream latency, with no reload. The leave motion takes 200 ms. | UXJ-001, TR-001 |
| REQ-003, DEC-002 | Visibility follows closure (DONE), not stop success. | TR-001 (no stop-result state is shown) |
| BEH-003/004, REQ-004, AC-004 | Closed runs stay hidden after reload, restart and Task delete, and when the root was not active at DONE. | UXJ-003, TR-004 |
| REQ-005, AC-005, DEC-004/006 | The same rule, row style and motion under Agent, Agent Team and Agent Org roots. | UIS-001 |
| BEH-001/005, REQ-006, AC-006 | Non-Task rows and other Tasks' rows are unchanged. A reopened and re-delegated Task shows only its new runs. | UXJ-004, VIS-006 |
| REQ-007 | Nothing is deleted; the rows are only not listed. | Data boundaries |
| REQ-008, AC-008, DEC-003 | The Team tab keeps messages with closed runs. | UXJ-005, VIS-005 |
| REQ-009, AC-009, DEC-005 | An open conversation of a closed run returns to the root (Manager) run. | UXJ-002, TR-002, VIS-003/004 |

## Visual Language

- **Existing product language to preserve:** the Workspaces tree: workspace → agent/team group → run row → child rows with branch lines; status dots; initials avatars; the selected-row treatment.
- **Layout structure:** delegated rows sit under their root run row, indented by `(depth + 1) × 0.875rem`, with the existing branch lines (`WorkspaceHierarchyBranches`). Order: `@` collaborators first, then delegated runs in start order. (Changed: none.)
- **Grid, dimensions, spacing, density (delegated row, changed):**
  - minimum height `1.75rem` (28 px); rows `0.125rem` (2 px) apart;
  - disclosure slot `0.875rem`;
  - status dot, then a 16 px avatar or icon with a 6 px gap;
  - name truncates on one line, with a right padding of `0.5rem`.
- **Typography:** `text-sm` (14 px), the product font. An agent name is regular weight; a delegated Team name is `font-semibold`. (Unchanged.)
- **Color values and semantic roles (changed):**
  - row text `gray-600` (`#666666`);
  - no background at rest; hover `gray-50` (`#f2f2f2`);
  - no border.
  - Removed: the dashed `indigo-200` border and the `indigo-50/40` tint.
  - Selected (unchanged; identical to member rows): background `#eef2ff`, inset left bar `2px #6366f1`, text `indigo-900`, square corners.
- **Surfaces, borders, radii:** at rest the row is flat with `rounded-md` (6 px) for hover and focus. The selected row is square, as for member rows.
- **Controls, icons, imagery:**
  - A delegated agent: status dot plus a 16 px initials avatar (`gray-200` circle, 9 px semibold `gray-600` initials). Unchanged.
  - A delegated Team: disclosure chevron, then `heroicons:bolt-20-solid` at 16 px in `slate-500` (`#64748b`). The dashed box around the bolt is removed.
- **Hover, focus, selected:**
  - Hover: `gray-50` background.
  - Focus: a `2px indigo-500` ring (was `1px indigo-300`), the same as member rows. Focus also shows the existing identity tooltip.
  - Selected: as above.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Delegated run row | One delegated agent, delegated Team, or Team member under a root run. | Agent; Team (collapsed/expanded); member. Rest, hover, focus, selected; loading/error inspection line (unchanged). | `components/workspace/history/WorkspaceTransientExecutionRow.vue` |
| Delegated rows list | The rows under a root run; DONE rows leave with motion. | Rows present; a row leaving (200 ms); empty (the list is not rendered). | `components/workspace/history/AgentRunTaskRows.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | User watching a live Manager run | The Manager has delegated runs for two Tasks, one delegation without a Task, and one `@` collaborator. | A finished Task's runs disappear. | That Task's rows are gone; the other rows are unchanged; the Manager shows its `update_project_task` call and reply. | BEH-002, REQ-001/002, AC-001/002 |
| UXJ-002 | User reading a worker's conversation | A worker of an open Task is selected and its conversation is shown. | Not left on a run that no longer exists. | At DONE, the view shows the Manager run and the Manager's run row is selected. | REQ-009, AC-009 |
| UXJ-003 | User reloads the app | Some Tasks are DONE. | A consistent tree. | Closed runs are not listed; open runs are. | REQ-004, AC-004 |
| UXJ-004 | The Manager reopens a Task and delegates it again | The Task is DONE and its rows are hidden. | See the new work. | Only the new runs appear; the old ones stay hidden. | REQ-006, AC-006 |
| UXJ-005 | User opens the Manager's Team tab | Some delegated runs are closed. | Read the Manager's history. | Every message is listed, including those with closed runs. | REQ-008, AC-008 |

## Journey Details

- **UXJ-001** (VIS-001 → VIS-002)
  1. The user opens the Manager run (Idle) and sees its delegated rows.
  2. The Manager marks a Task DONE. In the reference, the user asks it in its chat ("The release notes look good, please close that task."). The Manager shows Running, then an `update_project_task` tool call and its reply.
  3. At that moment the Task's rows (here *release notes writer* and *fact checker*) fade out together over 200 ms, and the rows below move up. The branch lines redraw for the remaining rows.
  4. Nothing else changes: no toast, and no change to the run row.
- **UXJ-002** (VIS-003 → VIS-004)
  1. The user selects *reviewer* under *docs review team* and reads its conversation.
  2. The Manager closes "Review docs site" by itself. In the reference, the user earlier asked it to "Close the docs review when the team reports back."
  3. The Team row and its members fade out. The main view switches to the Manager's conversation, which ends with the report, the `update_project_task` call and "I marked Review docs site DONE, and its runs are stopped." The Manager's run row becomes the selected row.
- **UXJ-003:** a page reload or app restart lists only open delegated runs. Closed runs are never shown, even briefly.
- **UXJ-004** (VIS-006): after "delegate the docs review again", the Manager shows `update_project_task` (IN_PROGRESS) and `delegate_task`. The new *docs review team* with its members appears at once, with no enter motion; the earlier, closed instance stays hidden.
- **UXJ-005** (VIS-005): the Team tab lists the same messages as before DONE, including "from release notes writer". Opening a message works as today.
- **Failure and recovery:** a stop that fails after DONE still hides the rows (REQ-003); the failure stays in the server log only, as today. Removal has no error state.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Workspaces tree, delegated rows | Left panel, any route; under a root Agent, Agent Team or Agent Org run | Show the live delegated work; select a row to open its conversation. | Root run row, then delegated rows with branch lines | VIS-001, VIS-002, VIS-006, VIS-008 |
| UIS-002 | Agent run view | `/workspace`, a selected run or child | Conversation and message box of the selected run. | Header (name, status), conversation, message box | VIS-003, VIS-004 |
| UIS-003 | Team tab | Right panel, Team | The Manager's messages with its children. | Message list, message detail | VIS-005 |
| UIS-004 | Project Tasks board (unchanged) | `/projects/<id>` | Shows the Task status the Manager set. | To Do / In Progress / Done groups | VIS-007 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | UIS-001: the Task's rows are listed | The Task becomes DONE (Manager tool call or any client). | The Task's rows fade out (200 ms ease-out); the rows below move up. | The rows are not listed. | The Task's runs are closed and stopped; the records are kept. | Other rows stay selectable. |
| TR-002 | UIS-002: a conversation of a run of that Task is open | Same as TR-001. | The view switches to the root run's conversation. | The root run is selected. | None. | Continue with the Manager. |
| TR-003 | UIS-001: a delegated Team is expanded | Same as TR-001. | The Team row and all its members leave together. | Gone. | None. | — |
| TR-004 | Any | Reload, restart, or opening a root that was not active at DONE. | None. | Closed runs are absent from the first render. | None. | — |
| TR-005 | UIS-001: the Task is DONE and its rows are hidden | The Task is reopened and delegated again. | The new rows appear immediately. | New runs are listed; old runs stay hidden. | — | Select the new rows. |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001: rows present | Delegated runs are open. | Clean rows as specified; a delegated Team with the bolt. | Select, expand/collapse | — | VIS-001 |
| UIS-001: a row leaving | TR-001 | 200 ms fade and height collapse; the row is not interactive while it leaves. | — | — | — |
| UIS-001: no delegated rows | All closed, or none started. | The list is not rendered; the root run row stands alone. | — | — | — |
| UIS-001: narrow viewport | ≤ 390 px | Same rows; names truncate with an ellipsis; no clipping. | Same | — | VIS-008 |

## Content, Labels, Validation, And Feedback

- No new or changed UI text.
- The accessible names of rows are unchanged ("{role} {name}, …").
- Feedback for DONE is the Manager's own conversation; the tree adds no message.
- Form and input validation: N/A (no input).

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop | ≥ 1024 px | Unchanged; rows as specified | — |
| Narrow / mobile | 390 px | The left panel as the existing mobile menu; rows identical and truncating | — |
| Electron / browser | All | Unchanged | — |

## Accessibility And Keyboard Behavior

- Accessibility target: same as the existing tree.
- **Focus:**
  - Focus ring changed to `2px indigo-500`, matching member rows.
  - If the focused row leaves, focus moves to the root run row.
  - Selection fallback (TR-002) does not move keyboard focus out of the tree.
- **Keyboard:** unchanged (Enter or Space to select or toggle).
- **Roles and states:** `treeitem` with `aria-level`, `aria-selected` and `aria-expanded`, unchanged. A leaving row is removed from the accessibility tree when it starts to leave. No live announcement: the Manager's conversation carries the change.
- **Contrast:** `gray-600` on white (5.7:1) and `slate-500` icon on white (4.8:1).

## Motion And Transitions

- **Leave:**
  - opacity `1 → 0`;
  - max-height `2rem → 0`, with the top margin collapsing.
- **Move:** the remaining rows translate with `200ms ease-out`.
- **Enter:** none (unchanged).
- **Durations and easing:** `200ms ease-out` for every property.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, rows are removed immediately.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Task closure (DONE) per delegated run | Whether a row is listed | Hand-written closure facts per delegation round (`prototype/task-run-cleanup/taskManagerRunFixture.ts`), kept in localStorage across reloads. | The server knows closure (`closedAt` in Task run resources). Where the filter lives (server projection or client) and the live signal are architecture decisions (U-001). |
| Live removal signal | TR-001 timing | Client-side reaction to the scripted closure. | A stream event or snapshot refresh; to be designed. |
| Team-tab participant identity of closed runs | UXJ-005 | The collaboration view keeps closed runs as message participants; only the tree list leaves them out. | R-001: separate the visible rows from the participant index. |
| Manager's actions | Trigger | A live Manager run: the prototype socket answers its streams (Idle status, tree snapshot). A message to the Manager gets a scripted turn (`plugins/95.task-run-cleanup.client.ts`), including "close … when the team reports back", a scripted timeline that closes a Task a few seconds later. | A real model and its `update_project_task` / `delegate_task` tools. |
| Project Tasks | VIS-007 | The two Tasks are added to the Prototype Launch fixture project and follow the Manager's status. | Unchanged product behavior. |

## Final Visual Reference Inventory

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 start; UIS-001 rows present | Desktop 1055×738 @2x | `visual-references/VIS-001-manager-with-delegated-runs-desktop-1055x738.png` | Clean delegated rows (no box or tint), bolt-only Team icon, branch lines, live Manager run | Names, messages, ages, status colours of individual workers |
| VIS-002 | UXJ-001 end; TR-001 result | Desktop 1055×738 @2x | `visual-references/VIS-002-task-done-rows-left-desktop-1055x738.png` | The Task's rows are gone and the other rows are unchanged; DONE feedback lives in the Manager's conversation | Manager wording; tool call card content |
| VIS-003 | UXJ-002 start | Desktop 1055×738 @2x | `visual-references/VIS-003-reading-worker-before-done-desktop-1055x738.png` | Selected member row treatment | Worker conversation text |
| VIS-004 | UXJ-002 end; TR-002 | Desktop 1055×738 @2x | `visual-references/VIS-004-open-worker-returns-to-manager-desktop-1055x738.png` | The Manager conversation is shown and the Manager run row is selected; the Team rows are gone | Manager wording |
| VIS-005 | UXJ-005 | Desktop 1055×738 @2x | `visual-references/VIS-005-team-tab-keeps-messages-desktop-1055x738.png` | Messages with closed runs are still listed | Message content and times |
| VIS-006 | UXJ-004; TR-005 | Desktop 1055×738 @2x | `visual-references/VIS-006-reopen-delegate-again-desktop-1055x738.png` | Only the new Team instance is listed | Wording |
| VIS-007 | UIS-004 (unchanged) | Desktop 1055×738 @2x | `visual-references/VIS-007-projects-board-reflects-done-desktop-1055x738.png` | The Task status groups follow DONE and reopen (existing UI) | Other fixture tasks |
| VIS-008 | UIS-001 narrow | Mobile 390×844 @2x | `visual-references/VIS-008-tree-narrow-mobile-390x844.png` | Rows identical, truncating, not clipped | Same as VIS-001 |

## Linked UI Reference Evidence

- **Runnable UI reference:**
  - `corepack pnpm dev --port 4530` in the design repository.
  - Open `/workspace` → prototype-workspace → Project Task Manager → "Plan the v2 docs release…".
- **Ticket record:** `product-ticket.md`.
- **Run instructions:** reset the example with `__resetTaskRunCleanup()` in the browser console.
- **Supporting artifacts:**
  - `review-round-1.md`: superseded. The round-1 control panel and switches were rejected and removed.
  - `review-evidence/round-1/`: historical.
- **Scenario:** populated (default).
- **Mocked boundaries:** see the table above.

## Implementation Fidelity Boundary

- **Must preserve exactly:**
  - the removal rule (all runs of the DONE Task; nothing else);
  - live removal with the 200 ms leave motion, no enter motion, and the reduced-motion fallback;
  - the selection fallback to the root run;
  - the Team tab keeping its messages;
  - the clean delegated-row style (values above) under all three root kinds.
- **Does not prescribe production:** the fixture closure store, the scripted Manager turns, the prototype socket answers, and the client-side filter.
- **May vary:** fixture names, messages, statuses and times.
- **Design-system constraints:** the existing tree components and tokens.

## Out Of Scope

- Data deletion.
- A browse or archive view for finished runs.
- Hiding runs stopped without DONE.
- A user control for Task status.
- A Task-name marker on rows.

## Open Decisions And Risks

- U-001 (architecture): where the filter lives and the live signal.
- R-001 (architecture): Team-tab participant identity for hidden runs.
- R-002 (accepted by design): there is no in-app way to reopen a closed worker's own conversation; the data stays on disk.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes` (revision in `product-ticket.md`)
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed has a final visual reference: `Yes` (motion is specified in text)
- Every section covers the affected scope or is marked unchanged / N/A: `Yes`
- Recorded values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality, with no placeholders, clipping or drift: `Yes`
- Visible details are requirements-defining unless marked illustrative: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Artifact and visual-reference paths agree: `Yes`
