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
