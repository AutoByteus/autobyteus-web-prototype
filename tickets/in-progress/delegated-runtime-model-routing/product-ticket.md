# Product Ticket — delegated-runtime-model-routing

## Identity And Scope

- Ticket / request ID: `delegated-runtime-model-routing` (the package identifier of Project Task autobyteus-32, Model Router).
- Title: Model Routing: the Settings page, the router conversation, and where a routed choice shows.
- Mode: `Product Experience Design` (evolves Settings → Model Routing, the run Settings "Delegated copies" rows, the run view of an agent, and the system-notice segment of a conversation).
- Status: `Awaiting User Review` (round 1 sent through the Solution Designer, 2026-10-26)
- Requester: Solution Designer (run `solution_designer_ab383b2a28394f6ba52dde1f7083f5bd`), 2026-10-26. The user's words: "i feel UI should be designed first. do you think so i think you can contact @Product Team to work on the UI design first".
- Requirements (read in full): `/Users/normy/autobyteus_org/autobyteus-worktrees/delegated-runtime-model-routing/tickets/in-progress/delegated-runtime-model-routing/requirements-doc.md` (REQ-002…REQ-012, AC-008, AC-009, AC-012), `launch-selection-order.md` (SR-007), `product-design-request.md`.
- Critical journeys:
  1. Turn Model Routing on, choose the router's runtime and model, type what the router should know, see why it is (not) active.
  2. Watch it: Decisions (with the delegating run), Overview (7 days / 30 days / all), then open a decision's run.
  3. Teach it: type in the one text box on Setup, or Open conversation → write → the box shows what the router saved → Undo.
  4. See a choice where it was made: the `delegate_task` result, the run's Settings rows (local and remote copies), then View decision.
- Non-goals: learning from outcomes (REQ-013), model settings (reasoning effort).

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin`)
- Ticket worktree / branch: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/delegated-runtime-model-routing`, `design/delegated-runtime-model-routing`
- Accepted design base: `01290bf` (`origin/personal` after `WEB-BASELINE-REFRESH-013`, 2026-10-26)
- Source repository / frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`, `autobyteus-web`, pin `d74f75a51ab7dc47d42a13f33e0f943c3a230ad7` (the Model Routing page "Agent runtimes now", "Show internal agents", the delegated-copy rows are in the pin; the baseline was refreshed to it by `WEB-BASELINE-REFRESH-013` first).
- Runtime isolation: dev server on port `4840` (this ticket), log `/tmp/dmr-dev.log`; disposable review aids in `/tmp/dmr-tools` (not committed); screenshots in `/tmp/dmr-shots`.
- Data origin: every value is invented (runtimes, limits, models, Tasks, reasons, times, node names). The anchor "now" is fixed (2026-10-26 09:40 UTC). Nothing is read from a real node.
- Integration: `Pending`. Cleanup: `Pending`.
- Ticket folder: `tickets/in-progress/delegated-runtime-model-routing/`

## Review Rounds

### Round 1 — 2026-10-26: first design, sent for user review

- Review entry: `http://127.0.0.1:4840/settings?section=model-routing` (scenario `populated`: on, router active, a month of decisions). Other starting states: see `ui-reference-runbook.md`, section `delegated-runtime-model-routing`.
- Design decisions: `design-review-notes.md`.

### Round 2 — 2026-10-26: the user simplified the page (Requirement Impact)

- The user's feedback (in the Product UI/UX Designer conversation, 2026-10-26): "I remove this. This task kind is too complicated. … Why does the user have to edit those? … we should make the
  configuration page UI very, very easy … the knowledge area or user inputs, there's one user input area where user just inputs [text], that's it … the agents is able to learn, but the user just gives them
  some kind of professional knowledge … clean means that when user sees it, they feel it's very easy to see. It's not like a huge abundance of information."
- Changes: (1) the editable task-kind list is gone (REQ-011 as written no longer applies: the router still labels each choice with a short kind of its own; nothing to manage);
  (2) Knowledge is no longer a tab: it is the one text box on Setup ("What the router should know", plain text, Save, Undo last change);
  (3) while the switch is off, Setup shows only the switch and one sentence; the router and the text box appear once it is on; (4) shorter texts; the Decisions kind filter is gone;
  (5) tabs: Setup · Decisions · Overview · Agent runtimes now.
- Routed to the Solution Designer as a requirement impact (REQ-007 box in Setup, REQ-010, REQ-011, REQ-012 grouping by the router's own labels).

### Round 3 — 2026-10-26: Decisions are organised by Task

- The user's question: should a decision be based on the Task ID (a Task is delegated; the agent, task agent or team gets its members' runtime/model), because the list "is very hard to see what it is doing".
- Answer and change: yes. Decisions is now one block per Project Task: its key and title (for example `autobyteus-59 Image context files …`), then each delegation of that Task
  ("Delegated to software engineering team by Project Task Manager · Today, 10:12 · Open run"), then one line per agent: name, runtime · model, who chose it, and under it the task kind and the reason.
  The column headings and the separate task-kind column are gone. A Task delegated more than once lists each delegation under the same block.

### Round 4 — 2026-10-26: cleaner layout on every tab

- The user's feedback: the page looks busy on Setup, Decisions, Overview and Agent runtimes now; look at the UI while working (a screenshot of each page after each change).
- Changes (each checked in a screenshot): the green status box became one quiet line under the title ("On · Claude · prototype-sonnet chooses for agents no default covers.");
  no card, no repeated tab heading and no boxed sections inside any tab (content sits on the page in a narrower column: 48 rem on Setup, 56 rem on Decisions and Overview, 64 rem on Agent runtimes now);
  Setup has three sections (switch, router, one text box) with whitespace instead of borders, and the router's "active" line is only shown when something is wrong;
  Decisions: Tasks separated by a hairline, no grey headers, the source is quiet text, one "All sources" filter;
  Overview: one number and one bar (router vs defaults) instead of four tiles, then one thin bar per task kind, no table header, Details by clicking the row;
  Agent runtimes now: no card, one gray line (node · read live · checked time · Check again), runtimes separated by hairlines.
- A raw message key that showed in the Overview table header (found in a screenshot) was removed with the table header.

### Round 5 — 2026-10-26: responsive check of every tab

- The user's window is wider than the 1440 px the earlier screenshots used, and the user saw a layout problem. Earlier rounds looked at each tab at 1440 px only; this round checked every tab at 1512, 1180, 900 and 390 px (screenshots, and no horizontal scrolling at any width).
- Fixed: one content width for the title, tabs and every tab (64 rem), so the tab bar and the content line up and the empty area on the right is small on wide windows; Setup's text box grows with its text (it clipped its last line at 900 px);
  Task titles wrap instead of being cut; the delegation line (to whom, by whom, when, Open run) wraps cleanly at 900 and 390 px.

### Round 6 — 2026-10-26: less repeated text

- The user's feedback: too much redundant text (for example "Delegated to … by …" on every Task); look at the live page in the browser tool while working.
- Changes (checked in the live tab with the screenshot tool, and in Playwright at 853 and 1512 px): the delegation line is only the target and the time ("software engineering team  Today, 10:12 AM  Open run"; the delegator is in the link's tooltip);
  "Model Router" is no longer written on every routed row (a row with a reason was chosen by the router; only defaults and inherited rows say so); the task kind sits under the agent name instead of in front of the reason; the Decisions and Overview intro lines and the status sentence are gone
  ("On  Claude · prototype-sonnet"); the filter has three entries (All, Model Router, Defaults and inherited); the Setup switch text and the knowledge hint are one short sentence each; Agent runtimes now keeps only the node and the checked time (the "reading spends no tokens" note is the Check again tooltip).
- A blank Runtime and Model while the runtime list loads (seen in the live tab) now shows the saved choice.

### Round 7 — 2026-10-26: space around the content

- The user's feedback: the page content sat directly against the Settings menu's divider line. The page now has its own margins (32 px at the sides, 24 px at the top, like Token Statistics), the tab labels start on the same line as the content, and each tab was checked again in the live tab with the screenshot tool.

### Round 8 — 2026-10-26: one control per tab, in the tab row

- The user's feedback: on Decisions the filter sat alone on its own row with the left side empty (the Overview period control did the same).
- Change: the control of a tab sits at the right end of the tab row, the same segmented control on both tabs: Decisions "All · Model Router · Not routed", Overview "7 days · 30 days · All time". No row of its own; on a narrow window it wraps under the tabs, right-aligned. The first Task starts right under the tab line.
  Checked in the live tab and at 1512 and 390 px.

### Round 9 — 2026-10-26: the tab "Agent runtimes now" is called "Runtimes"

- The user asked what "Agent runtimes now" means. It is the name of the existing section (autobyteus-303): the runtimes available on this node at this moment. Inside Model Routing "agent" and "now" add nothing and the name sounds like Settings → Agent Runtimes (install, sign in), so the tab is "Runtimes" (zh-CN 运行时). The section itself (limits, models, blocked, Check again) is unchanged.

### Round 10 — 2026-10-26: what the Overview counts

- The user asked how the counts on Overview are decided. Every number counts AGENTS (the members of delegated copies), not Tasks: the total is every agent started in a delegated copy in the period; a task-kind row is the agents the Model Router labelled with that kind
  (the router writes the label per agent, from the Task text and the agent's role, and it is stored in the decision record); "Not routed" is the agents on a default or the delegating run's launch (no router decision, so no kind); the source bar splits the same total by who chose the launch.
  One Task can appear under several kinds (designer, engineer, reviewer). The rows now read "6 agents" so a count is not taken for a Task count. A count of distinct Tasks per kind was not chosen because a Task has no single kind.

### Round 11 — 2026-10-26: the design checked against the server design

- The user: validate that the UI is consistent with what can be built, not hallucinated. Every element was checked against `design-spec.md` and the requirements (table in `design-review-notes.md`).
- Removed because the server cannot provide it: Redo of the knowledge note, "changed by the router / by you" (the node keeps the current and one previous note, no author), copies delegated to a peer in this node's Decisions list (the peer records them; this node shows them on the run's link),
  a "View decision" link for a remote copy (its decision is on the peer), and a decision ID in "View decision" (the record is found by delegating run, copy address and agent address).
- A peer's own page now lists what other nodes delegated to it ("from office-mac", no Open run).
- Needs from the server side (sent to the Solution Designer): `taskKey` in the decision record; an optional `source` filter on `modelRoutingDecisions`; a version with the knowledge note; statistics including the "Not routed" group and the failure count; a recognisable marker on a routing request; the router run's name and Internal mark from the run record.

### Round 12 — 2026-10-26: the Solution Designer's answers to the data audit (SR-013)

- All seven needs accepted. Applied in the UI: the "changed by the router / by you" label is back (the server gives `updatedBy`); Undo swaps the current and the previous note (a second Undo brings the newer one back; there is still no Redo); the "No Project Task" group for a delegation that has no saved Project Task;
  copies delegated to another node are listed again in this node's Decisions (node chip, Open run) and not counted in Overview; "Open conversation" is enabled as soon as the router's runtime and model are set (the SD's recommendation, A5 of the earlier notes, still to be confirmed by the user);
  the fallback notice says 40 seconds (a correction).

### Round 13 — 2026-10-26: no task kind under the agent name in Decisions

- The user: the grey "Implementation" under implementation_engineer and "Code review" under code_reviewer only repeat the agent's name. The task kind is the router's own label per agent; it is kept in the record and shown where it helps (Overview groups by it; run Settings rows say "Model Router · implementation"; the delegate_task result names it), and no longer in Decisions rows.

### Round 14 — 2026-10-26: the Task card header

- The user: the time beside the team name crowded the line. Now: line 1 is the Task key and title with the time at the far right; line 2 is the team (or agent, with the node chip) with "Open run" at the far right. When a Task has several delegations, or no Project Task, each delegation's time sits on its own line 2 beside "Open run". On a narrow window the time drops under the title.

### Round 15 — 2026-10-26: Decisions as a calm list (Task key links, folded teams, time and Open run together)

- The user: the Task key looked clickable but was not; a team's members were always open, which made the page crowded; "Open run" belongs at the right of the time.
- Changes (each checked in the live tab and at 1512 and 390 px, English and zh-CN):
  1. The Task key is a link to the Task's page (`/projects/<project>/tasks/<key>`, the product's existing Task page; verified by clicking it) while the Task exists; for a Task since deleted the key is plain grey text with a tooltip. The decision record therefore needs `projectId` and `taskId` (SR-013 has them).
  2. A team is one folded row (chevron, name, a coloured square per runtime used, "3 agents", an amber triangle when a default was skipped or the router failed); the members open on click. A Task opened from the Settings "View decision" link has its team open.
  3. Line 1: key, title, then the time and "Open run" together at the far right. A single agent has no folded row: its name and launch sit under the title. A Task delegated more than once (or with no Project Task) shows each delegation's time and Open run on its own line.
  4. The source of an agent ("Agent default", "Team default", "Inherited from the run") follows its model on the same line instead of a far-right column.

### Round 16 — 2026-10-26: only this node's own decisions

- The user: each node's Model Router decides for its own node, so the page must not list decisions of another node (a copy on `docker` was decided by docker's router). Removed: copies delegated to other nodes from this node's Decisions (they stay on the run's Settings rows and in the delegate_task result, REQ-009), the node chip and "from <node>" labels in Decisions, and "This computer" / "Remote node" wording on the Runtimes tab and the status line (the node's name is shown only in a peer's window).
- This reverses the Solution Designer's round-11 request (A3, "recorded on both nodes"), on the user's say; the "Task key" row of the data table keeps `taskKey` etc. Statistics are unchanged (they never counted other nodes' copies).

### Round 17 — 2026-10-26: a simpler Configuration tab and header

- The user: Setup is too complicated; call it Configuration; the switch belongs at the top right with the description under the title; the runtime and model need no extra "On · Claude · …" line because they are shown below.
- Changes: the tab is "Configuration" (zh 配置). The switch sits at the top right of the page header, on the title's line, for every tab; the one-sentence description is directly under the title. The "On · Claude · prototype-sonnet" status line is gone; a line appears under the description only when the router is on but cannot answer (for example "Codex · gpt-prototype-codex-mini is blocked until Oct 27, 04:00 AM (5 hours)." with a "Go to Configuration" link from the other tabs), and a peer's window shows its node name there.
  Configuration is now only: Model Router (runtime, model, Open conversation) and "What the router should know" (the text box). While the switch is off the router fields are disabled and the text box stays editable. The "Use the Model Router" row and the "Show internal agents" link are removed.

### Round 18 — 2026-10-26: the router is an ordinary agent

- The user: the Model Router is a normal agent like any other; its conversation needs no decisions, knowledge links or customisation. Removed everything this design had added to it: the "Internal" mark and the "Model Router" header name, the strip with the Decisions and Knowledge links, and the special "Routing request" card and label. The files that carried them (`SystemTaskNotificationSegment.vue`, `AgentWorkspaceSurface.vue`) are identical to the baseline again.
  The only trace left of the router outside the page is its run (opened by "Open conversation"), which shows like any other run; the product's existing system notice carries each routing request. The "Undo" in Configuration is unchanged.

### Round 19 — 2026-10-26: no knowledge on the page; the router is talked to

- The user: the router is an ordinary agent; it consults a knowledge file it keeps up to date itself; the user configures it on this page and then simply talks to it; there is no knowledge area, and no Undo. The router may have its own workspace (a question for the Solution Designer; UI only needs "Talk to the router" to open the run).
- Changes: the "What the router should know" text box, its Save, "Undo last change" and "last changed" line are removed; Configuration is now only the Model Router's runtime and model and one button, "Talk to the router" (was "Open conversation"), with one hint line ("Tell it what you prefer, for example "use Antigravity for writing". It remembers what it learns."). The switch, tabs and the other pages are unchanged.
- Consequences for the requirements (sent to the Solution Designer): REQ-007's user view/edit/undo of the note on the page is withdrawn; the knowledge note becomes the router's own file; `updateModelRoutingKnowledge`, `undoModelRoutingKnowledge` and the versioned note are not needed by the page.
