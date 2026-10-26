# Product Ticket — delegated-runtime-model-routing

## Identity And Scope

- Ticket / request ID: `delegated-runtime-model-routing` (the package identifier of Project Task autobyteus-32, Model Router).
- Title: Model Routing: the Settings page, the router conversation, and where a routed choice shows.
- Mode: `Product Experience Design` (evolves Settings → Model Routing, the run Settings "Delegated copies" rows, the run view of an agent, and the system-notice segment of a conversation).
- Status: `Awaiting User Review` (round 1 sent through the Solution Designer, 2026-10-26)
- Requester: Solution Designer (run `solution_designer_ab383b2a28394f6ba52dde1f7083f5bd`), 2026-10-26. The user's words: "i feel UI should be designed first. do you think so i think you can contact @Product Team to work on the UI design first".
- Requirements (read in full): `/Users/normy/autobyteus_org/autobyteus-worktrees/delegated-runtime-model-routing/tickets/in-progress/delegated-runtime-model-routing/requirements-doc.md` (REQ-002…REQ-012, AC-008, AC-009, AC-012), `launch-selection-order.md` (SR-007), `product-design-request.md`.
- Critical journeys:
  1. Turn Model Routing on, choose the router's runtime and model, see why it is (not) active.
  2. Watch it: Decisions (with the delegating run), Overview (7 days / 30 days / all), then open a decision's run.
  3. Teach it: Open conversation → write → Knowledge changes → Undo.
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
