# Design Review Notes — Model Routing (autobyteus-32), round 1

## What the user is asked to look at

Open `http://127.0.0.1:4840/settings?section=model-routing` (a browser; nothing to set up). The scenarios below are a starting state, set in the
browser console with `localStorage.setItem('autobyteus.prototype.scenario', '<name>')` and a reload; remove the key to return to the default.

| Scenario | Starting state |
| --- | --- |
| (default) `populated` | On, router active (Claude), a month of decisions, a taught knowledge note |
| `routing_fresh` | A node that never used it: off, nothing recorded |
| `routing_off` | Switched off after use: history and knowledge kept |
| `routing_on_empty` | On and active, nothing recorded yet (empty Decisions, Overview, Knowledge) |
| `routing_not_set` | On, the router has no runtime/model yet |
| `routing_blocked` | On, the router's model is blocked by a used-up limit |
| `autobyteus.prototype.context` = `electron_external` | The window of a peer node |

Journeys to click: (1) `routing_fresh` → Setup → the switch → the router's runtime and model → type into "What the router should know" → Save. (2) Decisions → Open run → the
run's Settings (gear) → Delegated copies → View decision. (3) Overview: 7 days / 30 days / All time, Details. (4) Setup → the text box, Undo last change; Open conversation.
(5) The Project Task Manager run (Workspaces → prototype-workspace → Project Task Manager): the three `delegate_task` calls, Activity → Result.

## Answers to the four open questions

1. **One page with tabs, in the Token Statistics pattern.** A status line is always on top (on / off / not active and why), then five tabs:
   Setup, Decisions, Overview, Agent runtimes now (round 2: Knowledge became the one text box on Setup). One long page would put the 30-row list between the switch and the knowledge note; sub-pages
   would hide the status. The existing "Agent runtimes now" section is unchanged and is the last tab. The page opens on Decisions once the router works, and on
   Setup when it is off or not set.
2. **Statistics: summary tiles, one stacked bar for router versus defaults, then a row per task kind** with a stacked bar of runtimes (one colour per runtime,
   the same in Decisions) whose length shows the volume, and Details for the models (the Token Statistics "Details" pattern). A task kind × runtime matrix was
   considered and rejected: eight kinds × five runtimes is mostly empty cells and cannot show models. Agents that no router decided are one row, "Not routed".
3. **Navigation.** Decision → delegating run: "Open run" on every delegation. Run Settings row → decision: "View decision" under the row's reason.
   Page → router conversation: "Open conversation" (Setup and Knowledge). Router conversation → page: Decisions · Knowledge · Setup links under its header.
   A routing request is not linked to a single decision (the conversation has no anchors); the decision list says when and for which Task.
4. **Run header: no change.** A header carries identity and status only, today for every run; the model and runtime live in the run's Settings. A routed copy's
   gear opens the delegating run's Settings, where the copy's row now says "Model Router · task kind", the reason and View decision. A header chip would be the
   only settings fact in any header. The router's own run has an "Internal" mark and a one-line strip with the page links (a header is where the user finds out what the run is).

## Where a choice shows (REQ-009)

- `delegate_task` result (Activity → Result of the call): one line per agent: "implementation_engineer: runs on Codex / gpt-prototype-codex, chosen by the Model Router
  (implementation): …", a line per skipped layer, and "Model Router could not choose: …" on failure. No UI change; the text is the contract.
- Run Settings → Delegated copies: source "Model Router · <task kind>", the reason, "View decision", the skipped-default note (existing amber note); a remote copy has the
  node chip (`docker`). Older runs keep "Source not recorded".
- Router conversation: a routing request is a system notice with the label "Routing request" in a bordered card; the router's calls are the existing tool cards (its
  rejected answer is the red card); the user's teaching is an ordinary message.

## Data each screen needs, checked against the server design (`design-spec.md` SR-012 and the requirements)

| Screen / element | Data it shows | Source in the server design | Status |
| --- | --- | --- | --- |
| Status line, Setup router dropdowns | enabled, router runtime/model, active, reason, runtimes and models with blocks | `modelRoutingStatus {enabled, routerLaunch, active, reason?, conversationRunId?}` + the runtime report (autobyteus-303) | Matches. The reason is the server's text (English; localizing server texts is out of scope, 303 FU-004): the UI shows it as given (the reference composes it from the report and translates it, which the product cannot do without reason codes). |
| Switch, router runtime/model | writes | `setModelRoutingEnabled`, `setModelRouterLaunch` | Matches |
| Text box (knowledge) | current note, time, undo | `modelRoutingKnowledge`, `updateModelRoutingKnowledge`, `undoModelRoutingKnowledge`; the node keeps the current and one previous note | Matches after round 11: one Undo, no Redo, no author (only the file's time). **Needs:** a version/time with the note, so a Save over a note the router rewrote meanwhile is refused with a message |
| Open conversation | the router's run | `openModelRouterConversation` (ensures it, returns the run ID) | Matches |
| Decisions: Task key and title | key, title | record has `taskTitle` only | **Needs `taskKey` (null for a delegation that is not for a saved Project Task)**; the delegate_task call must know the Task (the resolution runs before the Task text exists, A-03) |
| Decisions: delegated to, time, Open run | target, time, delegating run | `copyAddress`, `recordedAt`, `delegatingRunId` | Matches |
| Decisions: per agent | agent, runtime, model, source, reason, task kind, skipped default | `agentAddress`, `runtimeKind`, `llmModelIdentifier`, `source`, `choiceReason`, `taskKind?`, `notes[]` | Matches. The task kind is the router's own short label (REQ-011 changed by the user: no list to manage) |
| Decisions: filter (All / Model Router / Not routed) | records by source | `modelRoutingDecisions(before, limit)` has no filter | **Needs an optional `source` filter** (or the filter is dropped); grouping by Task is done in the page over the loaded records |
| Decisions: copies on another node | — | the peer records them in its own log; this node keeps them on the run's link | Matches after round 11: this node's Decisions list only this node's decisions; a peer's page lists what other nodes delegated to it ("from office-mac", no Open run: that run is on the other node) |
| Overview | per kind: runtimes, models, counts; source totals; failures | `modelRoutingStatistics(period)` derived from the log | Matches if it also returns the records with no kind (the "Not routed" row), the source totals and the count of router failures (`router_failed` notes) |
| Run Settings rows | source "Model Router", task kind, reason, skipped default; remote copies | `LaunchConfigurationSource` origin `model_router` + `choiceReason`, `taskKind`; peer answer carries launches | Matches. "View decision" finds its record by the delegating run, the copy address and the agent address (all in the record); no new ID |
| Router conversation | requests, tool calls, answers | the router's own run | **Needs:** a routing request is stored with a marker the UI can recognise (the reference uses sender `system.model_router`, like `system.skill_update_notifier`); the run's header name "Model Router" and the Internal mark come from the run record, not the agent catalog (internal agents are hidden from it) |

## Assumptions to confirm (for the Solution Designer)

- A1. The task kind is recorded only when the router decided; defaults and inherited launches have none ("Not routed").
- A2. While Model Routing is off, nothing new is recorded (`design-spec.md`: records only while on); earlier decisions stay and the page says so.
- A3. Each node shows its own decisions; copies delegated to a peer are shown on the run's Settings rows and in the delegate_task result, the peer's page lists them.
- A4. Decisions load 8 Tasks at a time and "Show more" asks for the next records; Overview periods are 7 days, 30 days and all time (default 30 days).
- A5. The router's run is never a row in the Workspaces tree.

## Round 2 (user feedback: simpler)

The user asked for a clean page where the only thing to type is one text box. Done: no task-kind list to edit (the router labels each choice itself; Decisions and Overview show its labels),
no Knowledge tab (the note is the text box on Setup, the router's rewrites appear in it, "Undo last change" restores the previous version), and the off state shows only the switch.
Assumption A4 (translated initial kinds) and the kind filter are removed; A7 now describes the box.
