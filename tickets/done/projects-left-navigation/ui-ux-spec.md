# UI/UX Specification — A Projects View Beside Workspaces In The Left Panel

Canonical contract for the Projects mode of the AutoByteus Web left panel, the Project choice on the New chat start surface, and the coupling to the right Projects board. The final screenshots in `visual-references/` are normative: every visible detail in them is requirements-defining unless this specification marks it illustrative.

## Status And User Confirmation

- Status: `Approved` (2026-10-31)
- Request / ticket: `projects-left-navigation` (Project Task `autobyteus-347`, Project `project_a1377344-25db-482a-97cc-ecfdb0fb495a`). No second ID.
- Related requirements revision ID: SR-004 (`requirements-doc.md` R3, 2026-10-31); the design started from SR-002 and the Solution Designer accepted the Project choice on the start surface as SR-004 (DEC-014, SCN-011, AC-015) during this review.
- Related requirement, behavior, acceptance-criteria, and decision IDs: REQ-001…REQ-015; BEH-001…BEH-008; AC-001…AC-015; SCN-001…SCN-011; DEC-004, DEC-006, DEC-009, DEC-010, DEC-012, DEC-013, DEC-014.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Review URL: the product's normal entry point, `http://127.0.0.1:4960/workspace` while the ticket was in review (open **Projects** in the left panel; no preview switch).
- Explicit user-confirmation reference: the user, 2026-10-31, after eight review rounds in the Product UI/UX Designer's conversation: "cool. i am satisfied. lets go", then "approved". Decisions the user gave during review are listed under Key UX decisions.
- Final check date: 2026-10-31

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`; software worktree read by the design: `/Users/normy/autobyteus_org/autobyteus-worktrees/projects-left-navigation` (branch `codex/projects-left-navigation`, base `origin/personal` `8faae96899`), read only.
- Selected frontend application or product surface: `autobyteus-web`: the left panel (`AppLeftPanel`, `components/workspace/history/*`), the strip, the New chat start surface, the right Projects tab.
- Pinned source commit or revision: `origin/personal@d74f75a51ab7dc47d42a13f33e0f943c3a230ad7` (baseline `WEB-BASELINE-REFRESH-013`). Checked against `8faae96899`: `git diff d74f75a 8faae96899 -- autobyteus-web` changes 266 files; none of them changes a surface this design touches except an icon-component swap in `RunningTeamGroup.vue` / `RunningTeamRow.vue` (same glyphs), a type annotation in `WorkspaceHierarchyBranches.vue`, and the deletion of an unused form `WorkspaceConfigForm.vue`. The baseline is current for the scope.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Accepted design base: `752b6b816c01350280f87cbd994146b8ff03832b` (`origin/personal`, fetched 2026-10-31)
- UI reference revision or commit: ticket branch `design/projects-left-navigation`; the integrated revision is recorded in `product-ticket.md` (reviewed state `885c2186`).
- Ticket folder: `tickets/done/projects-left-navigation/` (the working copy was `tickets/in-progress/projects-left-navigation/`)
- Baseline report path: `ui-baseline-report.md` (repository root)

## Problem And Design Rationale

- **User problem and intent.** The left panel organizes runs only by workspace folder. The user works Project by Project, runs the Project Task Manager (any agent could do it) under a Project, and has many workspaces ("On the workspace view it's OK, but I have a lot of workspaces"). He wants Projects beside Workspaces in the left panel, with a tree like today's workspace tree ("the task management tree was already super nice to appear on each project"), any agent or team runnable under a Project, and the folder never mandatory.
- **Key UX decisions and why.** Most are the user's own decisions in review.
  1. **A flat text switch, "Workspaces | Projects", in the run-section header** (user, rounds 5–7: "completely flat… like text", "I wouldn't make the other one gray", "very, very light effect"). No track, pill, shadow, border or icon. The active tab is dark and semibold; the other is a normal medium gray; hover shows a very faint rounded highlight and a pointer cursor. Switching changes only the tree (REQ-001).
  2. **One icon for a Project, the briefcase, everywhere a Project is shown** (user: "if you use the briefcase in the menu area, you should also use the briefcase to stay consistent"). A folder reads as a workspace; other tools mark projects with their own icon, so the folder is kept only for workspaces. This changes the icon of the Projects entry in the left list and strips, the Projects tab in the right strip, and the Project cards and empty states on the Projects pages (a change in preserved areas, recorded as DC-004).
  3. **A Project in the tree looks like a workspace** (user: "the whole styling… was pretty much similar", and "let's not highlight the project name, just like Workspaces"). Same row, same groups, same runs, same nested delegated runs with their Task line. No selected highlight on the Project; the right board still follows the Project (REQ-002), shown by the board itself. A Project's "+" appears on hover and keyboard focus, like the workspace tree's hover controls, and always on touch and narrow layouts.
  4. **Name selects, chevron opens.** A Project row has two targets: the chevron only opens or closes it; the name selects the Project (the right board follows) and opens it when closed.
  5. **The start surface keeps one chip for where the run works** (user: "by default you still show the workspace… either you show project or either you show workspace"). By default it shows the folder (Temp workspace), as today. Its menu has the same flat Workspaces | Projects tabs; choosing a Project makes the chip show the Project (and the folder only when it differs from the Project's), the folder defaulting to the Project's first linked folder, else the Temp workspace. Nothing is added for people who do not use Projects (the Projects tab shows only when the node has a Project).
  6. **"+" on a Project opens New chat with the Project set** and any agent or team choosable in the heading; "+" on a group preselects that agent or team (REQ-004). A Project's agent picker lists Agents and Teams only (DEC-006).
  7. **Quiet states** (user: "looks extremely busy… dense… stressful"). Header and rows carry no extra borders, fills or outlines; empty, loading and error states are single text blocks.
- **Alternatives considered and why they were rejected.**
  - A track with a white pill (Claude Home | Code style) and tabs with icons: tried and rejected by the user as too busy; the flat text tabs replace it.
  - A highlighted, bold selected Project row: removed at the user's request; the board follows without a mark.
  - A Project chip and a folder chip side by side on the start surface: rejected by the user; a run works from one place, so one chip shows one of them and its menu switches.
  - A per-Project icon and color chosen by the user (ChatGPT and Asana do this): needs a new Project field; recorded as a follow-up for the Solution Designer, not designed here.
  - A "pick an agent" menu on the Project "+": New chat's heading already chooses any agent or team.
  - A folder icon for a Project: reads as a workspace.

## Scope And Experience Goal

- **User or actor:** the user, in the desktop app, node-local.
- **Context:** the left panel's run section, the New chat start surface, and the right panel's Projects tab.
- **Goal:** find, follow and start work Project by Project, with any agent or team, in a tree that looks like the workspace tree.
- **Observable success:** in Projects mode the user starts an agent under a Project (from its "+" or from plain Chat), sees it there, sees the work it dispatches nested below it with its Task line, opens any of it, and switches back to Workspaces with everything there as before.
- **In-scope surfaces and journeys:** UXJ-001…UXJ-009 below.
- **Non-goals:** a Task list in the left panel (Tasks stay on the right board); starting Agent Orgs under a Project; moving or attaching an existing run to a Project; viewing closed Tasks' conversations; mobile; cross-node Projects; choosing a Project's icon or color.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-001, AC-001 | Workspaces | Projects switch; remembered per node; switching changes only the tree | UXJ-001; UIS-001; VIS-001, VIS-002 |
| REQ-002, AC-002, AC-010 | Projects listed by name; Project rows with "+"; selecting a Project sets the board | UXJ-002; UIS-002; VIS-002, VIS-003 |
| REQ-003, REQ-008, AC-002, AC-007 | Runs grouped by agent and team; a run serving several Projects listed under each; delegated runs scoped to the Project's Tasks | UXJ-006; VIS-002, VIS-003 |
| REQ-004, REQ-005, REQ-006, AC-003, AC-004, AC-005 | "+" on a Project and on a group; start surface shows the Project and folder; folder changeable; no folder uses Temp workspace | UXJ-003, UXJ-005; UIS-003; VIS-009, VIS-013, VIS-014, VIS-015, VIS-017 |
| SCN-011, AC-015, DEC-014 | Project choice on plain New chat | UXJ-004; VIS-011, VIS-012, VIS-016 |
| REQ-007, AC-010 | Tasks stay on the right board, which follows the selected Project | UXJ-002; VIS-002, VIS-003 |
| REQ-009, AC-008 | Delegated work leaves the tree when its Task closes (existing mechanism) | UXJ-006; Out of the reference's live demo (see Data, Contract, And Mock Boundaries) |
| REQ-011, AC-011 | Loading, empty, error with Retry; a failed refresh keeps the last tree | UXJ-008; VIS-004…VIS-008 |
| REQ-012, AC-001 | The open run is marked in the mode that lists it and revealed there | UXJ-003; VIS-015 |
| REQ-013, AC-012 | Workspaces mode unchanged | VIS-001 |
| REQ-014, AC-012 | Archive / Stop / Delete as in Workspaces; "Archive all runs" on a group touches only the Project's runs | UXJ-007; VIS-020 |
| REQ-015, AC-013 | Keyboard; English and Chinese; narrow layouts; the strip icon opens the panel in the current mode | UXJ-009; VIS-018, VIS-019, VIS-021…VIS-025 |

## Visual Language

- **Existing product language to preserve:** the left panel's white surface, `text-sm` rows, gray text scale, indigo hover and focus accents, the avatar discs, the status dots, the nested tree connectors, the "TEAMS" / "ORGS" small-caps sub-headings, the folder-chip look of the start surface. The Projects tree reuses the workspace section's rows, groups and nested Task rows unchanged.
- **Layout structure and visual hierarchy:** run-section header (switch left, "+" right, one 1 px gray-200 divider above) → scrollable tree. In the tree, Project row → agent groups → runs → nested delegated rows; then "TEAMS", "ORGS". Nothing sticky or layered.
- **Grid, dimensions, spacing, and density:** header `px-3 py-2`, content row height as the workspace section. Switch tabs: `px-2 py-1`, 4 px gap, first tab's text aligned with the row chevrons (the switch sits `-ml-1`). Project row: chevron button `pl-2 pr-1.5 py-1.5` with a 16 px chevron; name button `py-1.5 pr-2`; briefcase 16 px with `mr-1.5`; "+" 20 px (`h-5 w-5`) with `mr-2`, aligned with the group "+" column. Header "+" 24 px (`h-6 w-6`).
- **Typography:** the product's Inter stack. Switch tabs: 14 px / 20 px, active semibold (600) `gray-900`, inactive medium (500) `gray-600`. Project name 14 px regular `gray-700`. Hint and state lines 12 px; empty-state title 14 px medium `gray-700`; help 12 px / 20 px `gray-500`.
- **Color values and semantic roles:** briefcase `gray-500`; chevron `gray-400`; row hover `gray-50`; "+" `gray-400` → hover `indigo-600` on `indigo-50`; no-runs hint `gray-400`; loading `gray-500`; error text `red-600`; refresh-error banner `bg-red-50` with `red-700` text and Retry; the Project start chip uses the folder chip's `gray-600` text with `gray-100` hover (no tint).
- **Surfaces, borders, radii, shadows, elevation, and layering:** no new shadows or borders. Switch tabs `rounded-md`; Project row `rounded-md`; the chip's menu is the existing workspace menu (white, `rounded-lg`, `border-gray-200`, `shadow-lg`).
- **Controls, icons, imagery, and media assets:** `heroicons:briefcase` for a Project (the same glyph in the left list, strips, rows, cards, chip, empty states); `heroicons:folder` stays for workspaces; `heroicons:plus-20-solid` for "+". The strip's run-tree entry keeps `ph:tree-view` in both modes (a briefcase there would duplicate the Projects page entry above it); its tooltip and accessible name say the mode.
- **Hover, active, focus, selected, disabled, validation, and feedback treatment:** tab hover: faint `gray-50` rounded highlight, `gray-900` text, pointer cursor; tab focus: 2 px indigo ring (keyboard); Project row hover `gray-50`; Project "+" visible on row hover, row focus-within and "+" focus; selected Project: no visual mark (`aria-current` for assistive technology only); disabled "Archive all" while archiving as in Workspaces.

### New Or Changed Components

The UI reference location is traceability only; it does not prescribe the production implementation.

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Run-section switch | Choose Workspaces or Projects; "+" per mode | tablist; active / inactive / hover / focus; "+" = add workspace (Workspaces) or New Project (Projects, opens `/projects/new`) | `components/workspace/history/WorkspaceAgentRunsTreePanel.vue` |
| Projects tree | The Projects mode body and its states | loading, empty (no Projects), error, refresh-error banner, list | `components/workspace/history/ProjectsRunsTree.vue` |
| Project row (a variant of the workspace section) | A Project with its groups and runs | expanded / collapsed, no runs, hover, focus | `components/workspace/history/WorkspaceHistoryWorkspaceSection.vue` (`projectScope`) |
| Project-scoped delegated rows | A run's delegated work for one Project | filtered by Task's Project; Temp-task work only under a run started under the Project | `components/workspace/history/AgentRunTaskRows.vue` (`projectScope`) |
| Folder / Project chip and menu | Where the run works; Project choice | chip: folder, Project, Project · folder; menu tabs Workspaces / Projects | `components/chat/ChatWorkspaceMenu.vue`, `components/chat/ChatNewSurface.vue` |
| Strip entry | Collapsed panel's run-tree icon | one icon; name and tooltip `Workspaces` / `Projects` by mode | `components/layout/LeftSidebarStrip.vue` |
| Projects tree state | Mode (per node), read state, runs started under a Project | design-only | `stores/projectsTreeStore.ts`, `prototype/projects-left-navigation/projectRunLinks.ts` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related Behavior / Requirement / AC IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Desktop, left panel open | Workspaces mode, any run open or none | Switch the tree between Workspaces and Projects | The chosen tree is shown and remembered; nothing opened, started or stopped | REQ-001, AC-001 |
| UXJ-002 | Projects mode | Projects exist | Find a Project's runs and the Project's board | The Project is expanded; the right board shows it | REQ-002, REQ-007, AC-002, AC-010 |
| UXJ-003 | Projects mode | A Project (with or without a linked folder) | Run any agent or team under it, from its "+" or a group's "+" | The run is listed under the Project, open and marked | REQ-004…006, REQ-012, AC-003, AC-005 |
| UXJ-004 | Plain New chat | Node has a Project | Start a run under a Project from Chat | The run is listed under the Project | SCN-011, AC-015 |
| UXJ-005 | New chat under a Project | Project chosen | Use another folder for this run | Chip reads "Project · folder"; the run works there | REQ-005, AC-004 |
| UXJ-006 | Projects mode | A run that dispatched Tasks of several Projects | Follow and open delegated work per Project | Each Project lists the same run with only its work; any row opens | REQ-003, REQ-008, REQ-010, AC-006, AC-007 |
| UXJ-007 | Projects mode | A group with saved runs | Archive all runs of a group within a Project | Only that Project's runs of the group are hidden | REQ-014, AC-012 |
| UXJ-008 | Projects mode | First read, empty node, failing read | Understand and recover from non-list states | Loading, empty, error with Retry, last tree kept on a failed refresh | REQ-011, AC-011 |
| UXJ-009 | Keyboard; zh-CN; narrow; collapsed | Any | Operate everything without a pointer, in Chinese, at narrow widths | Same actions reachable; strip opens the panel in the current mode | REQ-015, AC-013 |

## Journey Details

**UXJ-001 Switch.** Entry: the left panel shows the run section (a flat "Workspaces | Projects" text switch left, "+" right). Click a tab, or focus the switch and press Left / Right / Home / End. The tree below changes; the open conversation, selection and any running run do not. The choice is remembered per node (reload keeps it). The "+" follows the shown mode (add workspace; New Project). References: VIS-001, VIS-002.

**UXJ-002 Find a Project's runs.** Projects are listed by name in the order of the Projects pages. Click the name: the Project is selected (the right Projects board shows it) and opens if closed; click the chevron to open or close only. Project order and names come from the node's Projects. Under an open Project, agent groups (name, count, "+"), then "TEAMS" and "ORGS" groups when present. Runs, nested delegated runs and their Task lines are the workspace tree's rows; a delegated row's Task line opens the Task on the right board. References: VIS-002 (AutoByteus with the board), VIS-003 (Prototype Launch).

**UXJ-003 Run under a Project.** "+" on the Project row (hover or focus shows it) opens New chat with the default agent, the Project as the run's context and its folder preselected; the heading chooses any other agent or team. "+" on an agent or team group opens New chat for that agent or team under the Project. The Project is opened and selected on the left and on the board. Send the first message: the run is listed at once under the Project's group, opened, and marked as the open run; it is also under its folder in Workspaces. References: VIS-009, VIS-015, VIS-017.

**UXJ-004 Start under a Project from plain Chat.** Chat's pencil opens New chat as today, the chip showing the folder. When the node has a Project, the chip's menu has a Projects tab: "No project" and each Project, each with the folder it brings. Choosing one closes the menu; the chip shows the Project and the folder follows (unless the user already picked a folder). Sending lists the run under the Project. References: VIS-010, VIS-011, VIS-012, VIS-016.

**UXJ-005 Another folder.** After choosing a Project, open the chip's menu and use the Workspaces tab: the list is today's workspace list, with the Project's first folder marked "Project folder". Choosing another folder keeps the Project; the chip reads "Project · folder". A Project with no linked folder uses the Temp workspace and requires nothing; no folder is created, registered or linked. References: VIS-013, VIS-014.

**UXJ-006 Delegated work per Project.** A run that dispatched Tasks of several Projects is listed under each, as the same run; under Project P its nested rows are only its work for P's Tasks (and Temp-task work only when the run was started under P). Rows, Stop and open behave as in Workspaces. When a Task is closed its delegated rows leave, as today (the existing leave motion); top-level runs are not archived automatically. References: VIS-002, VIS-003.

**UXJ-007 Archive all in a Project.** Hover a group: "Archive all runs" appears before "+". It asks "Archive all runs?" with "{Group} · N run(s) will be hidden from history." and archives only that Project's listed runs of the group; running runs block it ("Stop running runs first."). Reference: VIS-020.

**UXJ-008 States.** First read: "Loading Projects…". No Projects: a briefcase, "No Projects yet", one help line and **New Project**. A Project without runs: one hint line under it. Failed first read: "Couldn't load Projects." and **Retry**. Failed refresh: the last tree stays with a red line "Couldn't refresh Projects." and **Retry**. References: VIS-004…VIS-008.

**UXJ-009 Keyboard, Chinese, narrow.** Tab reaches the switch (one stop), then the header "+", then each Project's chevron, name and "+". Narrow window: the left panel is the strip; its run-tree icon (the tree icon; its name says `Projects` in Projects mode) opens the drawer in the current mode. References: VIS-018, VIS-019, VIS-021…VIS-025.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Run section, Workspaces mode | `/workspace` (any page with the left panel) | Today's tree under the new switch | Switch + "+", workspace tree unchanged | VIS-001 |
| UIS-002 | Run section, Projects mode | same | Browse Projects, runs and delegated work | Switch + "+", Project rows, groups, runs | VIS-002, VIS-003, VIS-004 |
| UIS-003 | New chat under a Project | `/chat` after "+" or the chip | Start a run for a Project | Heading (agent or team), composer; footer chip (folder or Project), Auto-approve, model | VIS-009, VIS-013, VIS-014, VIS-016, VIS-017 |
| UIS-004 | Chip menu | New chat footer | Choose a folder or a Project | Tabs Workspaces / Projects; folder list or Project list | VIS-011, VIS-012 |
| UIS-005 | Strip and drawer | collapsed or narrow | Open the run tree in the current mode | Strip entry; drawer | VIS-021, VIS-024, VIS-025 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | UIS-001 / UIS-002 | Click or arrow to the other tab | The tab turns dark and semibold; the tree swaps | The other tree; mode remembered per node | View state only | Any tree action |
| TR-002 | UIS-002, Project closed | Click the Project name | The Project opens | Open and selected; the right board shows it | The Projects board's remembered choice changes | Open runs, "+" |
| TR-003 | UIS-002 | Click the chevron | Open or close only | Board unchanged | None | — |
| TR-004 | UIS-002 | "+" on a Project | New chat opens | Project preset, folder preselected, default agent; Project opened on the left and on the board | A draft with the Project | Choose agent or team; change folder; send |
| TR-005 | UIS-002 | "+" on a group | New chat for that agent or team | As TR-004 with that target | — | As TR-004 |
| TR-006 | UIS-003 | Send the first message | The run appears under the Project, marked open | Run listed under the Project and its folder | The run is recorded as started under the Project (production: new record) | Converse; the chip is gone with the draft |
| TR-007 | UIS-004 | Choose a Project on the Projects tab | Menu closes; chip shows the Project | Project set; folder follows unless the user picked one | Draft's Project and folder | Send; reopen the menu |
| TR-008 | UIS-004 | Choose "No project" | Chip shows the folder | Plain start | Draft's Project cleared | — |
| TR-009 | UIS-004 | Choose a folder on the Workspaces tab | Chip reads "Project · folder" when it differs from the Project's | Run works in that folder | Draft's folder (kept if a Project is chosen later) | — |
| TR-010 | UIS-002 | Group "Archive all runs" | Confirmation naming the group and run count | Only that Project's listed runs archived | Same archive as Workspaces | — |
| TR-011 | UIS-002 | Retry | The read repeats | Tree or the same error | — | — |
| TR-012 | UIS-005 | Click the strip entry | The drawer or panel opens | Panel in the current mode | — | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Projects mode, populated | Projects exist | Project rows; open Project shows groups and runs | All tree actions | — | VIS-002, VIS-003 |
| Project with no runs | Open a Project without runs | "No runs yet. Use + to run an agent or team for this Project." (12 px, gray-400) | "+" | Run an agent or team | VIS-004 |
| No Projects | The node has none | Briefcase; "No Projects yet"; "Create a Project to run agents and teams for it and follow their work here."; **New Project** | New Project | Create a Project | VIS-005 |
| Loading | First read | "Loading Projects…" | Switch back to Workspaces | Resolves to a list or an error | VIS-006 |
| Read error | First read fails | "Couldn't load Projects."; **Retry** | Retry | Retry | VIS-007 |
| Refresh error | A later read fails | The last tree stays; red banner "Couldn't refresh Projects." + **Retry** | Everything on the last tree | Retry | VIS-008 |
| Run serving several Projects | A run dispatched Tasks of several Projects | Listed under each, same run; each shows only its own delegated rows | Open, Stop | — | VIS-002, VIS-003 |
| Folder overridden | Project chosen, other folder picked | Chip "Project · folder" (truncates at 15 rem) | Reopen the menu | Choose the Project's folder again | VIS-014 |
| Project without a folder | Project has no linked folder | Chip shows the Project; menu says "Temp workspace" under it; the Workspaces tab marks nothing as "Project folder" | Choose any folder | — | VIS-013 |
| Chinese | zh-CN | All new copy translated | — | — | VIS-022, VIS-023 |
| Narrow / collapsed | Window narrow or panel collapsed | Strip entry; drawer shows the tree | As desktop | — | VIS-021, VIS-024, VIS-025 |

## Content, Labels, Validation, And Feedback

- **Product voice and wording conventions to follow:** the product's short sentences, sentence case, no exclamation marks; the Projects pages' "Project" / "项目".
- **Exact labels, headings, and action text for new or changed controls** (en / zh-CN):
  - Switch tabs: `Workspaces` / `工作区`, `Projects` / `项目`; switch label (screen readers): `Show runs by` / `运行列表分组方式`.
  - Header "+": `New Project` / `新建项目` in Projects mode; `Add workspace` as today in Workspaces mode.
  - Project chevron: `Expand {name}` / `展开 {name}`, `Collapse {name}` / `收起 {name}`; name tooltip: `Show {name} on the Projects board` / `在项目看板中显示 {name}`.
  - Project "+": `Run an agent or team under {name}` / `在 {name} 下运行智能体或团队`; team group "+": `New run with this team` / `用此团队新建运行`.
  - States: `No runs yet. Use + to run an agent or team for this Project.` / `还没有运行。点击 + 为此项目运行智能体或团队。`; `Loading Projects…` / `正在加载项目…`; `Couldn’t load Projects.` / `无法加载项目。`; `Couldn’t refresh Projects.` / `无法刷新项目。`; `Retry` / `重试`; `No Projects yet` / `还没有项目`; `Create a Project to run agents and teams for it and follow their work here.` / `创建项目后，可在此为它运行智能体和团队，并跟进它们的工作。`.
  - Chip: `No project` / `无项目`; menu list label `Projects`; Project option subtitle: the folder's name or `Temp workspace`; folder-menu mark `Project folder` / `项目文件夹`; chip label for assistive tech: `Project: {name}` / `项目：{name}`; tooltip: `This run is started under the Project {name}.` / `此运行将在项目 {name} 下启动。`.
  - Agent picker under a Project: search placeholder `Search agents and teams` / `搜索智能体和团队`.
- **Empty, error, and recovery messages:** as above; "Archive all runs" keeps the existing texts (`Archive all runs?`, `{name} · {runs} will be hidden from history.`, `Archive all`).

### Form And Input Validation

N/A — no new input fields. The chip's menu and the Project choice have no validation; the folder form keeps today's rules.

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop | The product's docked left panel | As the screenshots | Project "+" and group "Archive all" on hover or focus |
| Narrow desktop window | Strip + drawer (screenshot: 600 × 800) | The strip's run-tree entry opens the drawer; the drawer shows the same tree, switch and states | Hover-only controls are always visible in the drawer (existing behavior) |
| Collapsed panel | Any width | The strip's last entry: `ph:tree-view` in both modes; tooltip and name `Workspaces` / `Projects` by mode; click opens the panel in the current mode | — |
| Mobile | Out of scope | — | — |

## Accessibility And Keyboard Behavior

- **Accessibility target:** the existing product's (keyboard operable, names and focus, contrast), en and zh-CN.
- **Focus order, focus movement, and focus return:** header: switch (one tab stop on the active tab), "+"; then per Project: chevron, name, "+". After choosing a Project in the chip menu, focus returns to the chip. Collapsing the panel and expanding it again keeps today's focus rules.
- **Keyboard interaction for new or changed controls:** switch: Left / Right move between tabs, Home / End jump; Enter or Space on the name selects and opens; the chevron button toggles; the chip menu: Up / Down move through options, Enter chooses, Escape closes (existing popover).
- **Roles, names, states, and live announcements:** switch `role=tablist` with `role=tab` and `aria-selected`, controlling the tree `role=tabpanel`; Project chevron `aria-expanded` with the name in its label; the selected Project's name button `aria-current`; loading `role=status`, errors `role=alert`; menu `role=listbox` with `aria-selected` options.
- **Contrast of new or changed text and UI boundaries:** active tab `gray-900` on white; inactive `gray-600` on white (≥ 7:1); the hint line `gray-400` follows the workspace tree's existing hint; error `red-600`.

## Motion And Transitions

- **Motion for new or changed elements:** none new. Delegated rows leaving a closed Task use the existing row-leave transition; the "+" fades in on hover (150 ms opacity), as the workspace tree's hover controls.
- **Durations and easing:** the product's existing 150 ms.
- **Reduced-motion behavior:** unchanged; the existing leave transition honors `prefers-reduced-motion`.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Which runs belong to a Project | The Projects tree | `prototype/projects-left-navigation/projectRunLinks.ts`: example links (the Project Task Manager run under *AutoByteus* and *Prototype Launch*, a Research Assistant, a Tutorial Video Producer, a Video Team and an Org run under *Prototype Launch*); runs started during the session are recorded in memory | Production reads runs started under a Project (a new record) plus runs that host an assignment of the Project's Tasks (REQ-003); storage and live updates are the Solution Designer's design |
| Delegated rows per Project | Nested rows | Filtered by the Task's Project on the existing rows; Temp-task rows only under a run started under the Project | Server-side scoping (REQ-008) |
| Task closure leaving the tree | Existing leave motion | Not playable: the reference has no live Task-close event; the nested rows and the leave motion are the existing components | Real closure through the agent's Task update (AC-008) |
| Loading / error / empty | Projects tree | Local-storage seed `autobyteus.prototype.projectsTree` = `loading`, `error`, `stale-error`, `none` (no visible control) | Real read state (REQ-011) |
| Mode, remembered per node | The switch | `autobyteus.leftPanel.runSectionMode.<node>` in local storage | Remembered per node (REQ-001) |
| The run is told its Project | Not visible | N/A | REQ-006, per runtime (Solution Designer) |
| Run times ("2w", "now") | Row labels | Relative to the fixture dates and the clock | Illustrative |
| Project names, run titles, folders, Task lines | Everything | Invented | Illustrative |

## Final Visual Reference Inventory

All images are in `tickets/done/projects-left-navigation/visual-references/` (captured by `prototype/scripts/capture-projects-left-navigation-final.mjs` from the product's normal entry point after the user's approval). Desktop 1440 × 900, English, unless the row says otherwise.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001, UIS-001: Workspaces mode with a workspace open | 1440 × 900 | `visual-references/VIS-001-workspaces-mode-desktop-1440x900.png` | The flat switch (Workspaces active); "+" at the right; the workspace tree as in the baseline | Workspace, run names, times |
| VIS-002 | UXJ-002, UXJ-006, UIS-002: Projects mode, *AutoByteus* open with the Project Task Manager run and its delegated rows; right Projects tab on the same Project | 1440 × 900 | `visual-references/VIS-002-projects-mode-autobyteus-board-desktop-1440x900.png` | Project row styling (briefcase, no highlight); groups; nested rows with Task lines; the board following the Project | All names, Task titles, counts, times |
| VIS-003 | UXJ-006: *Prototype Launch* open: the same run with only its own delegated row; Teams and Orgs groups; right board on that Project | 1440 × 900 | `visual-references/VIS-003-projects-mode-prototype-launch-shared-run-desktop-1440x900.png` | The shared run under a second Project with scoped rows | As VIS-002 |
| VIS-004 | UXJ-008: a Project with no runs | 1440 × 900 | `visual-references/VIS-004-project-without-runs-desktop-1440x900.png` | The hint line and its wording | Project name |
| VIS-005 | UXJ-008: no Projects | 1440 × 900 | `visual-references/VIS-005-no-projects-desktop-1440x900.png` | Icon, title, help, New Project button | — |
| VIS-006 | UXJ-008: loading | 1440 × 900 | `visual-references/VIS-006-projects-loading-desktop-1440x900.png` | "Loading Projects…" | — |
| VIS-007 | UXJ-008: first read failed | 1440 × 900 | `visual-references/VIS-007-projects-read-error-desktop-1440x900.png` | Error line and Retry | — |
| VIS-008 | UXJ-008: refresh failed, last tree kept | 1440 × 900 | `visual-references/VIS-008-projects-refresh-error-keeps-tree-desktop-1440x900.png` | The banner and the tree beneath | Project names |
| VIS-009 | UXJ-003, UIS-003: New chat from a Project's "+" | 1440 × 900 | `visual-references/VIS-009-start-under-project-desktop-1440x900.png` | The chip showing the Project; the Project open in the tree; the default agent heading | Agent, model |
| VIS-010 | UIS-003: plain New chat (unchanged look) | 1440 × 900 | `visual-references/VIS-010-new-chat-plain-desktop-1440x900.png` | The chip shows "Temp workspace" as today | — |
| VIS-011 | UXJ-004, UIS-004: chip menu, Workspaces tab | 1440 × 900 | `visual-references/VIS-011-chip-menu-workspaces-tab-desktop-1440x900.png` | Flat tabs; today's workspace list | Workspace names |
| VIS-012 | UXJ-004, UIS-004: chip menu, Projects tab | 1440 × 900 | `visual-references/VIS-012-chip-menu-projects-tab-desktop-1440x900.png` | "No project" plus Projects with their folders | Project and folder names |
| VIS-013 | UXJ-005: a Project without a folder | 1440 × 900 | `visual-references/VIS-013-start-project-without-folder-desktop-1440x900.png` | Chip shows the Project only (Temp workspace is the folder) | Project name |
| VIS-014 | UXJ-005: folder overridden | 1440 × 900 | `visual-references/VIS-014-start-project-with-folder-overridden-desktop-1440x900.png` | Chip "Project · folder" | Names |
| VIS-015 | UXJ-003: after the first message | 1440 × 900 | `visual-references/VIS-015-run-listed-under-project-after-send-desktop-1440x900.png` | The run listed under the Project's group and marked open | Message text, run title, "now" |
| VIS-016 | UXJ-004: Project chosen from plain Chat | 1440 × 900 | `visual-references/VIS-016-start-from-plain-chat-choosing-project-desktop-1440x900.png` | The chip showing the chosen Project | Names |
| VIS-017 | UXJ-003: agent picker under a Project | 1440 × 900 | `visual-references/VIS-017-project-agent-picker-no-orgs-desktop-1440x900.png` | "Search agents and teams"; Agents and Teams only | Agents and teams listed |
| VIS-018 | UXJ-009: Project row hover | 1440 × 900 | `visual-references/VIS-018-project-row-hover-add-desktop-1440x900.png` | Row hover and the "+" | — |
| VIS-019 | UXJ-009: keyboard focus on a Project name | 1440 × 900 | `visual-references/VIS-019-project-row-keyboard-focus-desktop-1440x900.png` | Focus ring | — |
| VIS-020 | UXJ-007: Archive all in a Project | 1440 × 900 | `visual-references/VIS-020-group-archive-all-in-project-desktop-1440x900.png` | Archive icon before "+"; confirmation with group and run count | Names |
| VIS-021 | UXJ-009, UIS-005: collapsed strip, Projects mode | 1440 × 900 | `visual-references/VIS-021-collapsed-strip-projects-mode-desktop-1440x900.png` | The strip with the run-tree entry (tree icon) below the page entries; its tooltip reads Projects | — |
| VIS-022 | Chinese: Projects mode | 1440 × 900 zh-CN | `visual-references/VIS-022-projects-mode-zh-CN-desktop-1440x900.png` | Translated switch and rows | Names |
| VIS-023 | Chinese: chip menu, Projects tab | 1440 × 900 zh-CN | `visual-references/VIS-023-chip-menu-projects-tab-zh-CN-desktop-1440x900.png` | Translated menu | Names |
| VIS-024 | UXJ-009: narrow window, collapsed strip | 600 × 800 | `visual-references/VIS-024-collapsed-strip-narrow-600x800.png` | Strip with the run-tree entry | — |
| VIS-025 | UXJ-009: narrow window, drawer open on Projects | 600 × 800 | `visual-references/VIS-025-projects-drawer-narrow-600x800.png` | The drawer's switch and tree; always-visible controls | Names |

## Linked UI Reference Evidence

- Runnable UI reference: the design repository root; start with `corepack pnpm dev --port 4960`, open `http://127.0.0.1:4960/workspace`.
- Ticket record: `tickets/done/projects-left-navigation/product-ticket.md`
- Run instructions: `ui-reference-runbook.md`, section `projects-left-navigation`.
- Relevant supporting artifacts: `design-change-log.md` (DC-001…), `prototype/scripts/capture-projects-left-navigation-final.mjs`.
- Relevant journey, transition, or scenario IDs: UXJ-001…UXJ-009; TR-001…TR-012; scenarios by local storage: `autobyteus.prototype.projectsTree` (`loading`, `error`, `stale-error`, `none`) and the remembered mode.
- Mocked boundaries and limitations: see Data, Contract, And Mock Boundaries.

## Implementation Fidelity Boundary

- **Exact behavior and visible design implementation must preserve:** the flat switch and its states; Project rows styled as workspace rows with no selected mark; the briefcase everywhere a Project is shown; "+" on Project and groups; scoped delegated rows; the single chip with its Workspaces | Projects menu and its labels; the states and copy above; the Archive-all scope; keyboard and Chinese behavior.
- **UI reference state, fixtures, and simulated mechanisms that do not prescribe production architecture:** the example run links, the in-memory "started under" record, the local-storage seeds, the 350 ms and 6 s read delays.
- **Fixture content or visible details explicitly allowed to vary:** Project, agent, team, run and Task names; counts; relative times; which runs exist.
- **Permitted responsive or platform variation:** the product's existing breakpoints decide when the left panel is the strip and drawer.
- **Existing design-system constraints:** Tailwind scale and tokens of the product; heroicons and phosphor icons only.

## Out Of Scope

- A Task list in the left panel; Agent Orgs started under a Project; moving or attaching an existing run to a Project; a Project's icon or color; viewing a closed Task's conversations; mobile; cross-node Projects; changing delegation, closure or reactivation.

## Open Decisions And Risks

- **Follow-up for the Solution Designer (not designed):** a Project's own icon and color chosen by the user (ChatGPT and Asana do this). It needs a new Project field.
- **Not demonstrable in the reference:** a Task closing live and its delegated rows leaving. The rows and the leave motion are the existing components; verify in the integrated build (AC-008).
- **Decision for the Solution Designer:** remote delegated rows in the reference carry no Task line, so they show under a run's Project only because the run was started there; production decides which Project a remote row belongs to (REQ-008).
- **Changed preserved areas (decided by the user):** the briefcase replaces the folder on the Projects entry, the Project cards and the Projects empty states (DC-004). Part of the Project icon follow-up above.
- **Chosen defaults the user accepted:** opening a run does not change the board's Project; the team group's "+" exists in Projects mode only (not in Workspaces); no live demo of Task closure.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes` (Task closure is a stated limitation, not a visual state)
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes` (verified on the captured screenshots)
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes` (reviewed one by one)
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
