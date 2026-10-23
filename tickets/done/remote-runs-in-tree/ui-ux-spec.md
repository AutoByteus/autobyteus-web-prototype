# UI/UX Specification — remote-runs-in-tree (a run delegated to another node, in the run tree, opened and talked to)

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `remote-runs-in-tree` (AutoByteus engineering Task `autobyteus-278`, branch `codex/remote-runs-in-tree`; Product ticket `tickets/done/remote-runs-in-tree/`)
- Related requirements revision ID: SR-002 (`requirements-doc.md` in the engineering ticket)
- Related IDs: UC-801…804, REQ-801…807, BEH-801…805, AC-801…807, DEC-801…807
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Review URL (during review): `http://127.0.0.1:4901/workspace` (the default data carries the remote runs; scenario `remote_states` shows every state; see `ui-reference-runbook.md`, section `remote-runs-in-tree`)
- Explicit user-confirmation reference: the user's message "Yeah, I think we're good. This looks perfect, I have to say. Yeah, it's done.", 2026-10-23, in the Product UI/UX Designer conversation, after the review rounds recorded in `product-ticket.md` and `design-change-log.md`. The user's direction on the node marker (computer icon and node name on the left of the team name; the summary aligned under the node name) is built in (DC-801, DC-802).
- **DEC-804 (Stop and Terminate from the delegator's window): decided (a) yes.** The user approved the UI reference with the red stop square shown on live remote rows (and Stop in the composer) after being asked twice for a separate yes/no; he gave no separate answer, and his approval of the design as shown is the record. The Solution Designer can confirm with him if a separate answer is wanted. Reversing it removes the stop square on remote rows only (DC-809).
- Final check date: 2026-10-23

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web`: the Workspaces run tree (left sidebar) and the run view (main area, right panel)
- Pinned source commit or revision: `origin/personal@9e7a45880865912442f4188e6d2a58d99b10a54c` (baseline report pin) plus the accepted designs `delegated-copy-task-locator`, `agent-definition-reconnect-ui`, `one-nodes-tab`; engineering base for this request `origin/personal@3b09fbe308` (read only, `/Users/normy/autobyteus_org/autobyteus-worktrees/remote-runs-in-tree`)
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- UI reference revision or commit: see `product-ticket.md` ("Final Integration")
- Ticket folder: `tickets/done/remote-runs-in-tree/`
- Baseline report path: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md`
- Baseline check for this request (no refresh needed): between `9e7a458` and the engineering worktree, `components/workspace`, `components/conversation`, `components/layout`, `components/chat` have no change; `utils/runTreeProjection.ts` changes one line (the stored title is resolved for display, 269), which is data, not markup.

## Problem And Design Rationale

- User problem and intent: when the user's Project Task Manager delegates to a Team on another node (the Marketing Team on his Docker node), the run is invisible in his run tree, while local delegated copies show under their delegator. He wants "no difference": see the Team under the delegator, open it, talk to it.
- Key UX decisions and why:
  - **A remote run is an ordinary delegated row plus a node marker.** Same tree lines, status dot, identity icon, name weight, expand chevron, member rows and stop square as a local copy; the only addition is the marker. This is the user's "no difference".
  - **The node marker is a small chip: a computer icon and the node's name**, on the row's first line, between the status dot and the team icon (or agent avatar), so the row reads "● 🖥 docker 👥 marketing team". The user's direction: "on the left side you put a computer icon and give a node name … this is definitely a remote node agent team", and later "on the left side of the team name". The icon is 14 px so the chip reads as a computer at a glance.
  - **The title line aligns with the node's name in the chip**, which is the same column as a local copy's summary line, so every summary in the tree lines up (the user: "more balanced").
  - **The opened view is the local run view** with the same chip in its header and the controls that cannot work for a run on another node removed (⚙, ＋, attachments, `@`), and Files, Terminal, Artifacts and Screen replaced by a note that says where the run is.
  - **Failures are plain, local and recoverable.** A node that does not answer leaves the row in place with a red line and Retry; the opened view shows a red notice with Retry; a failed send shows the existing error block; the rest of the tree works. No reconnecting or polished offline states (DEC-807).
  - **Stop is the existing control** (DEC-804): the same red stop square, the same pulse.
- Alternatives considered and why rejected:
  - Chip on the row's second line, before the title (built first): the user said it did not feel right; moved to the left of the team icon and name.
  - Chip with only the computer icon and the node's name in the tooltip: the user asked for the name on the row.
  - A separate "Remote" section or a different row style for remote runs: contradicts "no difference".
  - Showing Files and Terminal with the other node's data: out of scope (DEC-802, follow-up FU-001).
  - Graying the whole row when the node is unreachable: the dot is already grey for offline; the red line says why.

## Scope And Experience Goal

- User or actor: the owner of the desktop or web window whose agent delegated a run to another node.
- Context: the Workspaces run tree and the run view in the desktop window (embedded node or a window opened on a Docker node) and the web window; English and Chinese. The `/mobile` shell does not render delegated runs yet; a separate mobile Task uses the same tree data. The row is identical at the 320 px sidebar width of the narrow layout (VIS-021).
- Goal: see a remote delegated Agent or Team (with its members) under its delegator, open it, follow its conversation live, talk to it, and understand plainly what is on the other node and when the node cannot be reached.
- Observable success: the Marketing Team on docker appears under the Project Task Manager with a "docker" chip, its title and status; opening its coordinator shows its conversation, a new tool call and message arrive without a reload, and a sent "status?" is answered in the same window.
- In-scope surfaces and journeys: the remote delegated row (Agent, Team, Team member) under a standalone delegator; the opened run view (header, conversation, composer); the right panel notes; failures; Stop; English and Chinese.
- Non-goals: files, terminal and workspace of remote runs; reconnecting and catch-up; messaging unlinked runs on other nodes; attachments across nodes; the mobile shell; the remote run's model and settings; the Memory page for remote runs.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| BEH-801, REQ-801, AC-801, UC-801 | A remote delegated Agent or Team with members is a row under its delegator, with the node chip, its title and its status | UXJ-801, UIS-001, VIS-001, VIS-016, VIS-021 |
| BEH-802, REQ-802, AC-802, UC-802 | Opening it shows messages, reasoning, tool calls with results and status; new events appear without a reload | UXJ-802, UIS-002, VIS-002, VIS-004, VIS-009, VIS-010 |
| BEH-803, REQ-803, AC-803, UC-803 | The user sends a message from the composer; it appears as the user's message and the answer streams into the same view | UXJ-803, UIS-003, VIS-005, VIS-006 |
| DEC-802 | Files, Terminal, Artifacts and Screen say the run is on the other node; file paths in the conversation say so too | UXJ-804, UIS-004, VIS-007, VIS-008, VIS-011 |
| BEH-804, REQ-804, AC-804, UC-804, DEC-807 | A node that does not answer: red line and Retry on the row, red notice in the view, red error on a failed send; the rest of the tree works | UXJ-805, UIS-001, UIS-005, VIS-013, VIS-014, VIS-015, VIS-020 |
| BEH-805, REQ-805, AC-805, DEC-804 | The row always shows the real state (working, idle, waiting, offline); Stop on a live remote row; a stopped copy shows offline, not gone | UXJ-806, UIS-001, VIS-012, VIS-016 |
| REQ-806, AC-806 | Agent and Team rows are identical for Agent and Team copies and for every delegator root (same row component); web and desktop | UIS-001; PA-808 |
| REQ-807 | Documentation | Engineering (not a UI obligation) |

## Visual Language

- Existing product language to preserve: the Workspaces tree row (14 px indentation per level, 28 px minimum row height, status dot, slate identity icon, 11 px summary line, indigo selected row with a 2 px left bar, red stop square), the run header (avatar, name, status), the conversation, the composer, the right panel tabs, the red alert pattern of errors, the amber file-preview note. Unchanged — follows baseline.
- Layout structure and visual hierarchy: a remote row's first line is `status dot · node chip · identity icon · name`; the second line is the title; an error or checking line is the third. The node chip is the only new element on the row. In the opened view the header reads `avatar · name · node chip · status`.
- Grid, dimensions, spacing, and density:
  - Row chip: height 16 px, horizontal padding 4 px, gap 4 px between icon and name, computer icon 14 × 14 px, maximum width 5.5 rem (88 px) then the name truncates; 6 px (`mr-1.5`) to the identity icon; it sits after the status dot's 6 px margin.
  - Second and third lines start 36 px (2.25 rem) from the row content's left edge (status dot 8 px + 6 px + chip padding 4 px + icon 14 px + gap 4 px), i.e. under the node's name; 2 px above the first line (`mt-0.5`).
  - Header chip: height 20 px, padding 6 px, gap 4 px, icon 14 px, maximum width 7 rem; 12 px (`space-x-3`) from the name.
  - The remote header keeps the local header's minimum height (56 px) although ⚙ and ＋ are absent.
  - Panel note: icon 32 px, title and text centered, text maximum width 20 rem, horizontal padding 24 px.
  - Opened-view notice: margin 12 px (16 px from `sm`), padding 8 × 12 px, radius 8 px.
- Typography: chip name 10 px (0.625 rem), weight 500, line height 1; header chip name 12 px, weight 500; title line 11 px (0.6875 rem), weight 400, line height 16 px, truncated with an ellipsis; error and checking lines 11 px, weight 500; notice title 14 px weight 500, notice detail 12 px; panel note title 14 px weight 500, text 14 px. Font family: the product's.
- Color values and semantic roles: chip background `slate-100`, chip text and icon `slate-600`; title line `gray-500`, `indigo-700` when the row is selected; error line `red-700`; checking line `indigo-700`; notice border `red-200`, background `red-50`, title `red-800`, detail `red-700`, icon `red-500`; panel note icon `slate-400`, title `gray-700`, text `gray-500`. Status dots are the product's: running blue (pulsing), idle green, initializing amber (pulsing), error red, offline grey.
- Surfaces, borders, radii, shadows, elevation, and layering: chip radius 4 px, no border or shadow; the notice has a 1 px border and 8 px radius; no new shadows. The row's hover tooltip is the product's.
- Controls, icons, imagery, and media assets: the chip icon is Heroicons `computer-desktop` (solid 20 in the chip; outline in the panel note, 32 px); the stop square is the product's `stop-20-solid`; the warning triangle is `exclamation-triangle-20-solid`. No images.
- Hover, active, focus, selected, disabled, validation, and feedback treatment: unchanged for the row (selected row indigo with left bar; focus ring 2 px indigo). Retry: underlined text, `focus-visible` ring 1 px red (row) or 2 px red (notice), hover `red-100` in the notice. The chip is not interactive.

### New Or Changed Components

The UI reference location is traceability only; it does not prescribe the production implementation.

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Remote node chip | Marks a run another node runs: computer icon and the node's name | Row size and header size; name truncated at the maximum width; always shows the node's name as given in Nodes; tooltip and accessible name "Runs on {node}" | `components/workspace/remote/RemoteNodeChip.vue` |
| Delegated row (changed) | The Workspaces row of a delegated copy | Local (unchanged); remote Agent, remote Team, remote Team member (no chip of its own); working, idle, waiting, offline; not reachable (grey dot, red line, Retry); checking; stop failed | `components/workspace/history/WorkspaceTransientExecutionRow.vue` |
| Remote run notice | The opened run's node did not answer | Red alert with title, detail and Retry | `components/workspace/remote/RemoteRunNotice.vue` |
| Remote run panel note | Replaces Files, Terminal, Artifacts and Screen content | Four texts, one per panel | `components/workspace/remote/RemoteRunPanelNote.vue` |
| Run header (changed) | Node chip beside the name; no ⚙ and ＋; keeps its height | Local (unchanged), remote | `components/workspace/agent/AgentWorkspaceSurface.vue` |
| Composer (changed) | Text only for a remote run | Local (unchanged), remote: no Context Files bar, no `@`, placeholder naming the agent and node | `components/agentInput/AgentUserInputForm.vue`, `useComposerTarget.ts`, `AgentWorkspaceView.vue` |
| Delegated stop button (changed) | Emits `started` and `failed` so the row can show a stop error | unchanged look | `components/workspace/history/DelegatedStopButton.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related Behavior / Requirement / AC IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-801 | Owner, Workspaces tree | The Project Task Manager delegated a Team and an Agent to docker and a Team to office-mac | See them under their delegator | The rows show the node chip, title and status | BEH-801, REQ-801, AC-801 |
| UXJ-802 | Owner | The tree shows the remote Team | Follow its coordinator live | Conversation open; a new tool call and message arrived without a reload | BEH-802, REQ-802, AC-802 |
| UXJ-803 | Owner | The coordinator's view is open and idle | Ask it for a status | The message shows as the user's; the answer streams in; the lead is idle again | BEH-803, REQ-803, AC-803 |
| UXJ-804 | Owner | A remote run is open | Look for its files or terminal | The panel says the run is on docker | DEC-802 |
| UXJ-805 | Owner | office-mac is down | Open or message its run | A plain error; Retry; the rest of the tree works | BEH-804, REQ-804, AC-804 |
| UXJ-806 | Owner | docker's run is live | Stop it from the tree | The row shows offline and loses its stop square; a failure says why | BEH-805, REQ-805, DEC-804 |

## Journey Details

**UXJ-801 — see it**
- Entry: Workspaces → the delegator's workspace → the delegator's run row (here "Project Task Manager", run "Dispatch the approved desktop app Tasks", expanded).
- The delegator's local delegated copies and its remote ones are one list in the order they were delegated. Each remote row shows: status dot, node chip, identity icon (team icon for a Team, initials avatar for an Agent), the name (Team names bold), and below, from the chip's name column, the run's title (the first message's content from its node, truncated). A Team row has the expand chevron; its members are rows below it (idle/working dots, no chip of their own).
- A remote copy that has a Project Task keeps the Task summary link on its second line (unchanged behavior; the title shows only when there is none), PA-803.
- Alternate: the node does not answer: see UXJ-805. A row whose run was shut down for being idle shows offline (grey), not gone.
- Visuals: VIS-001, VIS-016, VIS-021.

**UXJ-802 — open it and follow it**
- Click a remote Agent row, or a Team row (which opens its coordinator), or a Team member. The Team row also expands its members. The main view shows the run's header with the name, the node chip and the status, then the conversation: the message it received ("From Project Task Manager: …"), reasoning ("Thinking"), tool calls with their arguments and result, assistant messages. While the run works, its status reads Running and the composer's action is the red stop button; new events appear as they arrive (a tool call with a spinner that turns to a check, then streamed text) and the Team row's dot follows the members' statuses. The Activity tab lists the tool calls from the same events.
- Failure: UXJ-805. Visuals: VIS-002, VIS-003, VIS-004, VIS-009, VIS-010.

**UXJ-803 — talk to it**
- Precondition: the run is idle (while it works the action is Stop; pressing Enter stops it, as for a local run). Type in the box ("Message campaign lead on docker…") and press Enter or the send button. The message appears at once as the user's message (user avatar); the run goes Running, its answer streams in, then Idle. The message is recorded on both nodes as from this node's owner (engineering). `@`, attachments and drag-and-drop are not offered.
- Failure: UXJ-805. Visuals: VIS-005, VIS-006.

**UXJ-804 — the panels that stay on the other node**
- With a remote run open, Files, Terminal, Artifacts and Screen show the note "On docker" and a line stating the panel's content is on that node and to open it in that node's window. Projects, Team, Activity, Usage and Browser behave as for a local run. A file path clicked in the conversation shows the amber note "That file is on docker: open the run in that node's window to see it." and opens nothing.
- Visuals: VIS-007, VIS-008, VIS-011.

**UXJ-805 — the node does not answer (first version)**
- The row keeps its place with a grey dot and a third line in red "Couldn't reach {node}." with Retry (the title is not shown because it comes from the node). Retry shows "Checking {node}…" in indigo (up to the 20 s bound in the product; 1.5 s in the UI reference) and asks again, and re-opens the run. Opening it shows, under the header, the red notice "{node} isn't reachable" with "This run's conversation can't be loaded right now. Your other runs work. Retry when the node is back." and Retry; the composer stays, and a send shows the existing red "An Error Occurred" block with the node's message. Everything else in the tree and the other runs work. No automatic reconnect, no catch-up.
- Visuals: VIS-013, VIS-014, VIS-015, VIS-020.

**UXJ-806 — Stop**
- A live remote Team or Agent row (any member not offline) shows the red stop square at the end of the row, as a local delegated copy does. Click: the square pulses while stopping; the node stops the copy and the copies it started; the row's members report offline, the dot turns grey, the square disappears; its next message wakes it. If the node does not answer, the row shows "Couldn't stop it: {node} isn't reachable." (no Retry link; the square stays and can be pressed again). The composer's red stop (interrupt) works for a working remote agent and returns it to Idle.
- Visuals: VIS-003, VIS-012.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Remote delegated row in the Workspaces tree | `/workspace` (and the left drawer in the narrow layout), under the delegator's run row | See a remote copy and its state; open it; stop it; retry | Dot · chip · icon · name; title line from the chip's name column; error or checking line; stop square at the end | VIS-001, VIS-016, VIS-021 |
| UIS-002 | Opened remote run | `/workspace`, a remote row selected | Follow the run's conversation | Header (avatar · name · chip · status), conversation, composer; right panel tabs | VIS-002, VIS-004, VIS-009, VIS-010 |
| UIS-003 | Remote composer | the opened remote run | Send text to the run, stop it while it works | One text box ("Message {agent} on {node}…"), send or stop button; no Context Files bar, no `@` menu | VIS-003, VIS-005, VIS-006 |
| UIS-004 | Right panel notes | Files, Terminal, Artifacts, Screen tabs of a remote run | Say the run's files, terminal, artifacts or screen are on the other node | Centered computer icon, "On {node}", one sentence | VIS-007, VIS-008 |
| UIS-005 | Not-reachable view | A remote run whose node did not answer | Say so plainly; Retry | Red notice under the header; conversation empty; composer present | VIS-013, VIS-015, VIS-020 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-801 | UIS-001 | Click a remote Agent row | Row selected (indigo, left bar) | UIS-002 for that agent | Conversation fetched from the node by this node's server | Send, Stop, switch row |
| TR-802 | UIS-001 | Click a remote Team row | Row selected, members expand | UIS-002 for the coordinator | as TR-801 | Open a member, Stop |
| TR-803 | UIS-002 | The node pushes an event | New segment, tool call or status appears; the row dot follows | Conversation and status updated | Events relayed by this node's server (DEC-801) | as before |
| TR-804 | UIS-003 (idle) | Enter or send | The message appears as the user's; the status goes Running | The answer streams in; Idle | Recorded on both nodes as from the owner | Send again |
| TR-805 | UIS-003 (working) | Enter or the red stop button | The status returns to Idle | Run interrupted | Interrupt relayed to the node | Send |
| TR-806 | UIS-004 | Select Files, Terminal, Artifacts or Screen | The tab shows the note | Note shown | None | Other tabs |
| TR-807 | UIS-002 | Click a file path in the conversation | Amber note above the composer | Note shown, nothing opens | None | Other actions |
| TR-808 | UIS-001 | Click the stop square | The square pulses | The node stops the copy; members offline; the square is gone | Stop relayed to the node | Message it to wake it |
| TR-809 | UIS-001 | Stop request fails | Red line "Couldn't stop it: {node} isn't reachable." | Row unchanged otherwise | None | Press the square again |
| TR-810 | UIS-001 (not reachable) | Retry | "Checking {node}…" | Answers: row as UXJ-801; still not: red line again | New request to the node | Retry |
| TR-811 | UIS-005 | Send | The message shows, then the red error block with the node's message | Draft stays; view unchanged | None delivered | Retry the notice, resend |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Row · working | Any member running | Blue pulsing dot; stop square | Open, Stop | Becomes idle | VIS-001, VIS-016 |
| Row · idle | All members idle | Green dot; stop square | Open, Stop, Send | — | VIS-001, VIS-016 |
| Row · waiting | The node is starting the run (`initializing`) | Amber pulsing dot; stop square (PA-802) | Open, Stop | Becomes idle or working | VIS-016 |
| Row · offline | Shut down (idle shutdown) or stopped | Grey dot; no stop square; still listed | Open (stored view), Send (wakes it) | — | VIS-012, VIS-016 |
| Row · not reachable | The node did not answer | Grey dot; red line "Couldn't reach {node}." and Retry; no title | Retry, Open (shows the notice) | Retry | VIS-016, VIS-013 |
| Row · checking | Retry in progress | Indigo line "Checking {node}…" | — | Resolves | VIS-014 |
| Row · stop failed | The stop request failed | Red line "Couldn't stop it: {node} isn't reachable." | Stop again | — | not captured (text only, UXJ-806) |
| Opened view · not reachable | Opening a run of an unreachable node | Red notice "{node} isn't reachable" with the sentence and Retry; conversation empty | Retry, Send (fails visibly) | Retry | VIS-013, VIS-015 |
| Panel · Files / Terminal / Artifacts / Screen | A remote run is open and the tab is selected | "On {node}" and the panel sentence | Other tabs | — | VIS-007, VIS-008 |
| Long names | A node name or run name too long for the row | Chip name truncates at 88 px, name truncates; tooltip shows the full identity and "on {node}" | — | Widen the sidebar | VIS-001, VIS-021 |

## Content, Labels, Validation, And Feedback

- Product voice and wording conventions to follow: short, plain sentences; the node's name exactly as the owner gave it in Nodes; no technical codes in the UI.
- Exact labels (English / 中文):
  - Chip label (tooltip and accessible name): "Runs on {node}" / "运行在 {node} 上"
  - Row accessible label suffix and tooltip suffix: "on {node}" / "在 {node} 上"
  - Row not reachable: "Couldn't reach {node}." / "无法连接 {node}。"; Retry: "Retry" / "重试" (accessible: "Retry reaching {node}" / "重试连接 {node}")
  - Row checking: "Checking {node}…" / "正在检查 {node}…"
  - Row stop failed: "Couldn't stop it: {node} isn't reachable." / "无法停止：{node} 无法连接。"
  - Notice title: "{node} isn't reachable" / "无法连接 {node}"; notice detail: "This run's conversation can't be loaded right now. Your other runs work. Retry when the node is back." / "暂时无法加载此运行的对话。你的其他运行不受影响。节点恢复后请重试。"
  - Send failed (message in the existing error block): "{node} is not reachable. The request timed out after 20 seconds." (the node's message; the UI-controlled summary string "Not sent: {node} isn't reachable." / "未发送：{node} 无法连接。" is available for the product to use where it shows a one-line failure)
  - Panel title: "On {node}" / "在 {node} 上"
  - Files: "The files of this run are on {node}. Open it in that node's window to see them." / "此运行的文件在 {node} 上。请在该节点的窗口中打开它来查看。"
  - Terminal: "The terminal of this run is on {node}. Open it in that node's window to use it." / "此运行的终端在 {node} 上。请在该节点的窗口中打开它来使用。"
  - Artifacts: "The files this run wrote are on {node}. Open it in that node's window to see them." / "此运行写入的文件在 {node} 上。请在该节点的窗口中打开它来查看。"
  - Screen: "The screen of this run is on {node}. Open it in that node's window to see it." / "此运行的屏幕在 {node} 上。请在该节点的窗口中打开它来查看。"
  - File path clicked: "That file is on {node}: open the run in that node's window to see it." / "该文件在 {node} 上：请在该节点的窗口中打开此运行来查看。"
  - Composer placeholder: "Message {agent} on {node}…" / "向 {node} 上的 {agent} 发消息…"
- Empty, error, and recovery messages: above. The strings are in `localization/messages/{en,zh-CN}/remoteRuns.ts` of the design repository.

### Form And Input Validation

N/A — no new form. The composer's validation is the product's.

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop and web window | ≥ the product's desktop width | As specified; the sidebar is 320 px wide by default and can be resized | None |
| Narrow layout | 390 px wide (strips and drawers) | The left drawer is the same 320 px tree: rows are identical (VIS-021); the opened view and right panel use the product's narrow drawers | None |
| Window opened on a Docker node | "docker" is this node's peer's name as that node's owner gave it | The chip names the other node as this node knows it | None |
| `/mobile` shell | Does not render delegated runs yet | Out of this ticket; it uses the same tree data (node name, title, status, reachable) | — |
| English and Chinese | UI language | Same layout; Chinese strings above | None |

## Accessibility And Keyboard Behavior

- Accessibility target: the product's existing level.
- Focus order, focus movement, and focus return: unchanged. Within a row: the chevron, the row, Retry, the stop square. After Retry, focus stays on the row.
- Keyboard interaction for new or changed controls: Retry is a button (Enter, Space); the stop square keeps Enter and Space and does not open the row; the composer stops on Enter while working, as locally.
- Roles, names, states, and live announcements: the chip has `role="img"` and the name "Runs on {node}"; the row's accessible label adds ", on {node}"; the checking line is `role="status"`; the error line and the notice are `role="alert"`; the panel note is `role="note"`.
- Contrast of new or changed text and UI boundaries: chip text `slate-600` on `slate-100`; red lines `red-700` on white; notice `red-800` on `red-50`; panel text `gray-500` on white — the product's existing pairs.

## Motion And Transitions

- Motion for new or changed elements: none new. The existing status-dot pulses (working, waiting), the stop square's pulse while stopping, the tool call spinner, and the row leave transition are unchanged.
- Durations and easing: unchanged (the product's).
- Reduced-motion behavior: unchanged (the product honors it).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Tree data for a remote run | The row needs: whether the run is an Agent or a Team (members with address and run ID), the node's name (as in Nodes), the run's title from the node, its status (working, idle, waiting, offline), and whether the node answered | A fixture table keyed by run ID (`prototype/remote-runs/remoteRunsFixture.ts`) | Engineering: the delegating node's history DTOs carry these (REQ-801) |
| Status | Five product states; "waiting" is `initializing` (PA-802) | Scripted statuses; a Stop and a send change them through the collaboration stream | The status must reach the window without a reload |
| Conversation and live events | The same conversation view as a local run | Scripted history; scripted tool call, text and status events pushed over the existing collaboration stream mock about 3 s after the coordinator's view is opened | Engineering: DEC-801 (this node relays the other node's events) |
| Send, interrupt | The composer | Scripted accept, status and answer; a failed send for an unreachable node | Engineering: DEC-803; interrupt relayed |
| Stop | The stop square | Scripted success and offline status; scripted failure for an unreachable node | Engineering: DEC-804 |
| Unreachable node | Red line, notice, error block | `office-mac` always fails; Retry fails again after 1.5 s | The 20 s bound; the real error message |
| Files, Terminal, Artifacts, Screen | The note | Static notes | Follow-up FU-001 serves them |
| Run settings | The "Delegated copies" list in the delegator's settings | Lists only local copies; remote copies are excluded (DC-810) | The remote copy's model and settings stay on its node |

## Final Visual Reference Inventory

All images were captured on 2026-10-23 from the approved UI reference through its normal entry point `/workspace`, in Chrome, at 1440 × 900 unless noted, after the user's approval and the final check. Stored in `visual-references/`.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-801 / UIS-001: remote rows under the delegator, default data | 1440×900 | `visual-references/VIS-001-tree-remote-rows-under-delegator-desktop-1440x900.png` | Chip left of the icon and name; title under the node's name aligned with local summaries; dots; stop squares; "Couldn't reach" line | Node, run, team and title texts; the five local copies |
| VIS-002 | UXJ-802 / UIS-002: the coordinator opened, Running | 1440×900 | `…/VIS-002-opened-remote-member-working-desktop-1440x900.png` | Header with chip and Running; conversation; composer with the red stop | Conversation text, run names |
| VIS-003 | UXJ-806 / UIS-003: composer while working | 1440×900 | `…/VIS-003-composer-working-stop-desktop-1440x900.png` | Red stop button; tool call spinner | as above |
| VIS-004 | UXJ-802: a new tool call and message arrived, Idle | 1440×900 | `…/VIS-004-live-update-arrived-idle-desktop-1440x900.png` | Completed tool call, new message, Idle, the send button | as above |
| VIS-005 | UXJ-803: message sent, answer streaming | 1440×900 | `…/VIS-005-sent-message-answer-streaming-desktop-1440x900.png` | User message with avatar; partial answer; Running | Message and answer texts |
| VIS-006 | UXJ-803: answered | 1440×900 | `…/VIS-006-sent-message-answered-desktop-1440x900.png` | Full answer; Idle; placeholder "Message campaign lead on docker…" | as above |
| VIS-007 | UXJ-804 / UIS-004: Files tab | 1440×900 | `…/VIS-007-files-panel-on-docker-desktop-1440x900.png` | Icon, "On docker", the Files sentence | — |
| VIS-008 | UXJ-804: Terminal tab | 1440×900 | `…/VIS-008-terminal-panel-on-docker-desktop-1440x900.png` | Same, Terminal sentence | — |
| VIS-009 | UXJ-802: Activity tab from the streamed events | 1440×900 | `…/VIS-009-activity-panel-from-stream-desktop-1440x900.png` | Tool calls listed | Tool names, ids |
| VIS-010 | UIS-002: a remote Agent opened (market researcher) | 1440×900 | `…/VIS-010-remote-agent-opened-desktop-1440x900.png` | Header chip; tool call; the amber/clickable path | Texts |
| VIS-011 | UXJ-804: file path clicked | 1440×900 | `…/VIS-011-file-path-note-desktop-1440x900.png` | Amber note above the composer | Path and node name |
| VIS-012 | UXJ-806: after Stop, the researcher offline | 1440×900 | `…/VIS-012-after-stop-researcher-offline-desktop-1440x900.png` | Header Offline; row without a stop square | — |
| VIS-013 | UXJ-805 / UIS-005: not-reachable opened view | 1440×900 | `…/VIS-013-not-reachable-opened-view-desktop-1440x900.png` | Red notice with Retry; row's red line | Node name |
| VIS-014 | TR-810: Retry, checking | 1440×900 | `…/VIS-014-retry-checking-row-desktop-1440x900.png` | "Checking office-mac…" in indigo | — |
| VIS-015 | TR-811: send fails | 1440×900 | `…/VIS-015-send-fails-not-reachable-desktop-1440x900.png` | The existing red error block with the node's message | Message text |
| VIS-016 | Every row state (scenario `remote_states`) | 1440×900 | `…/VIS-016-every-state-desktop-1440x900.png` | working, idle, waiting, offline, not reachable | Names, titles |
| VIS-017 | DC-810: run settings lists local copies only | 1440×900 | `…/VIS-017-run-settings-lists-local-copies-only-desktop-1440x900.png` | The Delegated copies list has no remote copy | Local copy texts |
| VIS-018 | Chinese: the opened remote run | 1440×900 | `…/VIS-018-chinese-opened-remote-member-desktop-1440x900.png` | Chinese chrome; chip; Chinese placeholder | Conversation text stays as the node wrote it |
| VIS-019 | Chinese: Files note | 1440×900 | `…/VIS-019-chinese-files-panel-desktop-1440x900.png` | Chinese panel note | — |
| VIS-020 | Chinese: not reachable | 1440×900 | `…/VIS-020-chinese-not-reachable-desktop-1440x900.png` | Chinese notice and row line | — |
| VIS-021 | Narrow layout: the left drawer with the remote rows | 390×844 | `…/VIS-021-narrow-tree-remote-rows-390x844.png` | Identical rows in the 320 px drawer | Texts |

## Linked UI Reference Evidence

- Runnable UI reference: the design repository root, `corepack pnpm dev --port <port>`, `/workspace`.
- Ticket record: `tickets/done/remote-runs-in-tree/product-ticket.md`.
- Run instructions: `ui-reference-runbook.md`, section `remote-runs-in-tree`.
- Relevant supporting artifacts: `design-change-log.md` (DC-801 … DC-811), `design-assumptions.md` (PA-801 … PA-809).
- Relevant journey, transition, or scenario IDs: UXJ-801…806, TR-801…811, scenario `remote_states` (the default data is the journey).
- Mocked boundaries and limitations: see "Data, Contract, And Mock Boundaries". The Team and Org delegators are not shown with a remote copy in the UI reference (PA-808); the stop-failed row and the Artifacts and Screen notes were not captured as separate images.

## Implementation Fidelity Boundary

- Exact behavior and visible design implementation must preserve: the chip's content and position (between the status dot and the identity icon on a remote row; beside the name in the header); the title line's column (under the node's name); the red line, notice and checking texts; the controls removed from a remote run (⚙, ＋, Context Files, `@`); the panel notes; the stop square on live remote rows; the unchanged look of every local row.
- UI reference state, fixtures, and simulated mechanisms that do not prescribe production architecture: the fixture table, the scripted stream, the 3 s timeline, the 1.5 s Retry, the in-memory state.
- Fixture content or visible details explicitly allowed to vary: node, run, team and member names, titles, conversation text, tool names, timings, statuses of the sample rows.
- Permitted responsive or platform variation: the product's existing responsive behavior; name truncation depends on the sidebar width.
- Existing design-system constraints: Tailwind and the product's tokens; Heroicons.

## Out Of Scope

- Files, terminal and workspace of remote runs (FU-001); reconnecting and catch-up; polished offline states; messaging unlinked runs on other nodes; attachments across nodes; the mobile shell; the remote run's model and settings; the Memory page for remote runs.

## Open Decisions And Risks

- **DEC-804** decided yes by the user's approval of the design as shown (see "Status"); the Solution Designer can confirm with him if wanted.
- **PA-803** (a Task summary replaces the title on a copy that has a Task) and **PA-805** (Activity, Team, Usage and Browser stay available for a remote run because they come from the streamed events; Files, Terminal, Artifacts and Screen are replaced) were shown to the user and not changed; the engineering feasibility of PA-805 is for the Solution Designer.
- Team and Org delegators use the same row component but were not shown with a remote copy (PA-808).
- Requirement impact for the Solution Designer: none — REQ-801 … REQ-806 are covered as written; REQ-801's "title" is the second line, and the row also needs "did the node answer" (the red state).
- Risk: long names truncate at the default sidebar width because the chip takes about 90 px; the tooltip carries the full identity.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes` (stop-failed row, Artifacts and Screen notes: specified in text and share the captured components)
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
