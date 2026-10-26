# UI/UX Specification: Model Routing (autobyteus-32, Model Router)

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: Product ticket `delegated-runtime-model-routing` (package identifier of Project Task autobyteus-32), requested by the Solution Designer (run `solution_designer_ab383b2a28394f6ba52dde1f7083f5bd`) on 2026-10-26. The user's request, verbatim: "i feel UI should be designed first. do you think so i think you can contact @Product Team to work on the UI design first".
- Related requirements revision ID: SR-010 (requirements-doc.md) with SR-013 (the data contract the Solution Designer wrote for this design, `design-spec.md` § "SR-013 — Data contract for the Product Design", D1–D9) and the decisions recorded after the user's feedback: DEC-023 (the router has its own internal workspace).
- Related requirement, behavior, acceptance-criteria, and decision IDs: REQ-002, 003, 004, 005, 007, 008, 009, 010, 011 (changed by the user, see Problem And Design Rationale), 012; BEH-004, BEH-005; AC-008, AC-009, AC-012; SCN-006, SCN-007, SCN-008; DEC-020 (the user asked for a design first), DEC-022, DEC-023.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Review URL (rounds 1–22): `http://127.0.0.1:4840/settings?section=model-routing` (the product's normal entry point; the starting state is seeded from local storage, see the runbook; no preview-only control exists).
- Explicit user-confirmation reference: the user, 2026-10-26, in the Product UI/UX Designer conversation after round 22: "Perfect, I think the UI, now I think everything is working now. Or you want to do one self-validation, if everything is consistent, then we're done with this task, UI." The self-validation was then run and is recorded in `product-ticket.md` (Final check).
  - Decisions the user gave on the way (each in `product-ticket.md`, Rounds 2–22): no editable task-kind list; no knowledge area on the page (the router is an ordinary agent that keeps its own knowledge and is talked to); Decisions organised by Project Task; teams folded; no decisions of other nodes on a node's page; the router follows the global "Show internal agents" setting and nothing else; the switch at the top right of the page header; fewer words and no repeated text everywhere.
- Final check date: 2026-10-26 (112 tab × scenario × locale × width combinations with no page error, no raw message key, no horizontal scrolling; every journey in this specification clicked through; see `product-ticket.md`).

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web` — Settings → Model Routing (the page with "Agent runtimes now", autobyteus-303), the run Settings "Delegated copies" rows, the run view of an agent, "Show internal agents" (autobyteus-308).
- Pinned source commit or revision: `d74f75a51ab7dc47d42a13f33e0f943c3a230ad7` (`origin/personal`, the engineering base of autobyteus-32). The design baseline was refreshed to it first (`WEB-BASELINE-REFRESH-013`, integrated before this design started).
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- UI reference revision or commit: recorded in `product-ticket.md` (Delivery And Validation) after integration; accepted base `01290bf`; ticket branch `design/delegated-runtime-model-routing`.
- Ticket folder: `tickets/done/delegated-runtime-model-routing/` (moved there when the ticket closed; during review `tickets/in-progress/delegated-runtime-model-routing/`).
- Baseline report path: `ui-baseline-report.md` at the design repository root (`WEB-BASELINE-REFRESH-013`).

## Problem And Design Rationale

- **User problem and intent.** With Model Routing on, a node's built-in Model Router agent chooses a runtime and model for each delegated agent that no default covers. The user wants to turn it on, point it at a runtime and model, teach it, and see over time which kind of work went where and why. The user asked for the UI to be designed before it is built.
- **Key UX decisions and why** (rounds are in `product-ticket.md`):
  1. **One page with four tabs: Configuration · Decisions · Overview · Runtimes**, in the pattern of Token Statistics (Analytics / Run details). One long page would put a 30-row list between the settings and the statistics; sub-pages would hide the router's state. The page header holds the switch (top right of the title line) and one description line; the tab row holds the one control of the tab at its right (the Decisions filter, the Overview period).
  2. **The router is an ordinary agent.** Nothing about its conversation is special: no mark, strip, card or label. The page only configures it (runtime, model) and offers "Talk to the router", which opens its run. The user teaches it by talking; the router keeps its own knowledge. (The user removed the editable knowledge note, its Undo, the editable task-kind list and every router-specific element.)
  3. **Decisions are organised by Project Task** (the Task key as a link to its page, the title, the time and "Open run" at the right). A team delegation is one folded row (runtime squares, agent count, an amber triangle when a default was skipped or the router failed); its members open on click. A single agent shows its launch under the title. The source ("Agent default", "Team default", "Inherited from the run") is quiet text beside the model; a router choice carries its reason instead of a label.
  4. **Overview counts agents, not Tasks**: one number and one stacked bar for who chose the launches (Model Router / Agent default / Team default / Inherited), then one thin stacked runtime bar per task kind (length = volume, one fixed colour per runtime, the same in Decisions), "Details" for the models. A kind × runtime matrix was rejected (mostly empty cells, no models).
  5. **Each node shows only its own decisions.** A copy delegated to another node was decided by that node's router; it shows only on the delegating run's Settings rows and in the `delegate_task` result (REQ-009), and in the peer's own Decisions.
  6. **The router follows the global "Show internal agents" setting** (Server Settings → Basics) exactly like every internal agent: hidden by default, listed in the sidebar and in Agents while the setting is on. The Model Routing page does not repeat that setting.
  7. **The run header does not show the routed choice.** A header carries identity and status only; the model and runtime of a copy live in the run's Settings, where the copy's row now says "Model Router · <task kind>", the reason and "View decision".
- **Alternatives considered and rejected:** one long page; sub-pages; a statistics matrix; an editable task-kind list; a Knowledge tab and a text box with Undo (the user: the router is a normal agent and the user just talks to it); a "Show internal agents" row on this page (it is one global setting); a router-only visibility setting (a new server setting and a second visibility rule for the router's run and workspace); a header chip for the routed choice; a special router conversation (strip, mark, card).
- **Changes to the requirements made by the user's feedback** (sent to the Solution Designer as Requirement Impact, recorded in their SR-013): REQ-011 (no editable task-kind list; the router writes a short free-text kind per choice), REQ-007/REQ-010 (no knowledge area, edit or undo on the page), REQ-012 (Decisions record the Project Task key; Overview counts agents), REQ-008 (the router's run is an ordinary run, hidden or shown by the global setting), DEC-023 (own internal workspace).

## Scope And Experience Goal

- **User or actor:** the node owner (the user), who turns Model Routing on, configures and talks to the router, and watches its decisions. The Model Router agent, delegating agents and peer nodes cause the changes under the interface.
- **Context:** Settings → Model Routing in a desktop or browser window of a node, or of a peer node's window; the run Settings of a run that has delegated copies; the `delegate_task` calls of such a run; the router's own run.
- **Goal:** enable the router and choose what it runs on; talk to it; see per delegation what each agent runs on, who chose it and why; see statistics per task kind; find the live runtimes and limits the router uses; follow a choice to the Task, the delegating run and the router.
- **Observable success:** the journeys UXJ-001..008 below, VIS-001..026.
- **In-scope surfaces and journeys:** UIS-001..008; UXJ-001..008.
- **Non-goals:** learning from outcomes (REQ-013, a later Task); model settings such as reasoning effort; any route to change a started copy's launch; a router-specific setting for visibility.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-002 | A switch per node, off by default; off: nothing new (the router's fields are disabled, "Talk to the router" disabled). | UIS-001, UXJ-001, VIS-001, 002 |
| REQ-003, REQ-005 | The router's runtime and model are chosen on the page; the page says why the router is not active (not set, blocked until …, no longer offered, runtime unavailable, unreadable). | UIS-001, UXJ-001, VIS-003, 004 |
| REQ-004, REQ-008, AC-008 | One conversation per node, opened by "Talk to the router" whatever "Show internal agents" is; its run is an ordinary agent run. | UIS-007, UXJ-003, VIS-019, 020 |
| REQ-007 (changed) | The router keeps its own knowledge and is taught by talking to it; the page has no note. | UXJ-003 |
| REQ-009, AC-012 | `delegate_task` result lines, run Settings rows (local and remote copies) with source, task kind and reason, "View decision". | UIS-005, 006, UXJ-005, VIS-016, 017, 018 |
| REQ-010, AC-009 | The page's sections: Configuration, Decisions, Overview, Runtimes (the existing "Agent runtimes now" content). | UIS-001..004 |
| REQ-011 (changed) | The task kind is the router's own short free-text label; no list to manage. | UIS-003, VIS-012, 013 |
| REQ-012, AC-009 | Decisions per Project Task and delegation: time, Task key and title, agent → runtime/model, source, reason; Overview per task kind for 7 days / 30 days / all time; router vs defaults. | UIS-002, 003, UXJ-002, 004, VIS-005..014 |
| SCN-006, SCN-007, SCN-008 | See what ran and why; set up and watch; show or hide internal agents. | UXJ-002..006 |

## Visual Language

- **Existing product language to preserve:** the Settings shell (left menu, content area); Tailwind slate/gray neutrals, `blue-600/700` for the selected tab and primary buttons; the Token Statistics tab bar (`border-b-2`, `text-sm font-semibold`) and its segmented control (`rounded-lg bg-slate-100 p-0.5`, selected `bg-white shadow-sm`); the Basics-style switch (`h-6 w-11`, on `bg-blue-600`, off `bg-slate-300`); the delegated-copy rows of run Settings; the product's tool cards, system notices and Internal badge; `TaskKey` for Task keys; `RemoteNodeChip` for a node.
- **Layout structure and visual hierarchy.** The Model Routing content is one column, `max-w-5xl` (64 rem), with `px-5 py-6` (`sm:px-8`) around it and `gap-6` between header, tabs and tab content; the whole page is on the white content surface (no cards, no boxed sections). Header: the title (`text-2xl font-semibold`) with the switch at the far right of the same line; below it the description (`text-sm text-gray-500`, `max-w-2xl`); then, only when needed, one problem line (amber dot, `text-sm text-amber-800`, with "Go to Configuration" from the other tabs) and, in a peer's window, the node's name at the right (`text-sm font-medium text-gray-700`). Tab row: the four tabs (`gap-7`, `pb-[11px]`), the selected one `border-blue-600 text-blue-700`; at the right end of the row, the tab's one control (wraps below the tabs, right-aligned, on a narrow window).
- **Grid, dimensions, spacing, and density:** sections separated by whitespace (`mt-8`) or a hairline (`border-t border-slate-100`); Task blocks in Decisions `py-5` with a hairline between; agent rows `py-1.5`; the agent name column `14rem` (in a team, `sm:grid-cols-[14rem_minmax(0,1fr)]`); Overview kind rows `py-3` (`sm:grid-cols-[9rem_minmax(0,1fr)_1.5rem]`).
- **Typography:** the product's font (system sans). Page title `text-2xl font-semibold`; section title `text-base font-semibold text-gray-900`; Task title `text-base font-semibold`; Task key `text-sm text-gray-500` (underlined `decoration-gray-300` when it links); delegation and agent names `text-sm` (team/agent `font-medium text-gray-800`); reasons and notes `text-xs text-gray-500`; the skipped-default note `text-xs text-amber-700` with the product's `exclamation-triangle` icon; Overview total `text-3xl font-semibold` with its label `text-base text-gray-600`.
- **Color values and semantic roles:** one fixed colour per runtime, used for the small square beside every runtime name and for the Overview bars, in this order (the validated categorical palette): Codex `#2a78d6`, Claude `#eb6834`, Antigravity `#1baf7a`, Grok `#e87ba4`, AutoByteus `#eda100`. The source bar: Model Router `#1e293b`, Agent default `#94a3b8`, Team default `#cbd5e1`, Inherited from the run `#f59e0b`. Status: on = `emerald`/blue switch; problems `amber-500/800`; errors `red-600`. Text never wears a series colour.
- **Surfaces, borders, radii, shadows:** no card or shadow on this page; hairlines `slate-100`; dropdowns `rounded-md border-gray-300`; the primary button `rounded-md bg-blue-600`; segmented control as above; bars `h-2` (Overview kinds) and `h-2.5` (source bar) with `rounded` ends and a 2 px gap between segments.
- **Controls, icons, imagery:** native `select` for runtime and model (the product's own pattern in run Settings uses its menus; the reference uses the platform select; the production implementation may use the product's existing model menu, with the same blocked-until suffix); `heroicons` outline/20-solid: `chevron-right-20-solid` (folded team, rotates 90° when open), `chevron-down` (Overview details), `exclamation-triangle`, `arrow-top-right-on-square` (Open run), `computer-desktop` in the node chip.
- **Hover, active, focus, selected, disabled, validation, and feedback treatment:** keyboard focus rings `ring-2 ring-blue-500` on every control; hover `bg-slate-50` on a folded team row, `text-blue-700` on the Task key; disabled controls `opacity-50/60` with `cursor-not-allowed` and a tooltip that says what to do ("Turn Model Routing on and choose the router's runtime and model first."); the Setup problem line replaces nothing, it appears under the description.

### New Or Changed Components

The UI reference location is traceability only; it does not prescribe the production implementation.

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Model Routing page frame | Title, switch, description, problem line, tabs, tab control | on / off / on and not active; own node / peer node's window | `components/settings/model-routing/ModelRoutingManager.vue`, `ModelRoutingStatusStrip.vue`, `ModelRoutingSegmented.vue` |
| Configuration tab | Router runtime and model, "Talk to the router" | on, off (disabled), not set, blocked, loading (saved choice shown) | `ModelRoutingSetup.vue` |
| Decisions tab | Task blocks, folded teams, agent rows, filter | default, team open, filtered, empty (on / off), off with history, router failure, peer window, "No Project Task" | `ModelRoutingDecisions.vue` |
| Overview tab | Period control, source bar, per-kind bars, details | 7 days / 30 days / all time, empty, details open | `ModelRoutingOverview.vue` |
| Runtimes tab | The existing "Agent runtimes now" content, restyled without its card and heading | loading, ready, check failed, empty | `AgentRuntimesNowSection.vue`, `AvailableAgentRuntimeRow.vue` |
| Run Settings routed rows | Source "Model Router", task kind, reason, "View decision", node chip | routed local copy, skipped default note, remote copy | `components/run-settings/RunMemberRow.vue`, `utils/runSettings/runMemberTree.ts`, `prototype/model-routing/routingRows.ts` |
| `delegate_task` result text | One line per agent and a note per skipped layer or failure | routed, defaults, inherited after failure | `prototype/model-routing/modelRoutingFixture.ts` (`delegationResult`) |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related Behavior / Requirement / AC IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Node owner | Model Routing off, router not set | Turn it on and choose the router's runtime and model | On and active; "Talk to the router" enabled | REQ-002, 003, 005 |
| UXJ-002 | Node owner | On, decisions exist | See what each delegated agent runs on, who chose it, why | Task blocks read; a team opened; the filter used | REQ-009, 012; AC-009 |
| UXJ-003 | Node owner | On and set | Teach the router | The router's run open; the user's message sent | REQ-004, 007, 008; AC-008 |
| UXJ-004 | Node owner | On, decisions exist | See statistics per task kind and who decided | Overview read for 7 / 30 / all; details open | REQ-012; AC-009 |
| UXJ-005 | Node owner | A run with routed and remote copies | See the choice where it was made, and follow it | Result line read; Settings rows read; "View decision" opens the decision; the Task key opens the Task; "Open run" opens the delegating run | REQ-009; AC-012 |
| UXJ-006 | Node owner | Internal agents hidden | Show or hide the router in the sidebar | The router listed or not (the global setting) | REQ-008; AC-008 |
| UXJ-007 | Node owner | On, router blocked or not set | Understand why delegations do not use the router | The problem line read; the cause fixed in Configuration | REQ-003 |
| UXJ-008 | Node owner of a peer node | A window of a peer node | See that node's own decisions and runtimes | Its Decisions read | REQ-002, 009 |

## Journey Details

**UXJ-001 — Turn it on.** Entry: Settings → Model Routing (Configuration while off or not set; Decisions once on and set). Steps: the switch at the top right turns on (immediate; the fields become enabled); choose a Runtime from "Choose a runtime" (the list is the node's runtimes), then a Model (blocked models are listed with "· blocked until <time>"; choosing the runtime clears the model); "Talk to the router" becomes enabled when both are set. Feedback: while the router cannot answer, the problem line under the description says why (VIS-003, VIS-004). Alternate: turning off disables the fields and the button (the choices are kept; VIS-002). Related: VIS-001..004.

**UXJ-002 — Read the decisions.** Entry: Decisions. Each Task block: the Task key (a link while the Task exists), the title, the time and "Open run" at the right. A team delegation is a folded row (click or Enter to open); an agent's launch is shown under the title. The filter at the right of the tab row: All · Model Router · Not routed. "Show more" loads the next 8 Task blocks. Alternate: empty (VIS-009), off with history kept (VIS-010), router failure (VIS-008), a peer node's window (VIS-011). Related: VIS-005..011.

**UXJ-003 — Teach the router.** "Talk to the router" (Configuration) opens the router's run like any agent run (conversation, tool cards, Activity tab). The user types in the box; the router answers and keeps what it learns. Related: VIS-019.

**UXJ-004 — Read the statistics.** Overview: the period control (7 days · 30 days · All time; default 30 days) in the tab row; the number of delegated agents with the source bar and its legend; a line when agents ran on the delegating run's launch after a router failure; "By task kind": a row per kind, count "N agents" (singular "1 agent"), a thin bar of runtimes (colour = runtime), a chevron; clicking a row lists its models with counts and shares (VIS-013). The last row "Not routed — Defaults and inherited launches" holds agents no router decided. Related: VIS-012..014.

**UXJ-005 — Follow a choice.** In the run's conversation, the `delegate_task` call's Result (Activity tab) lists one line per agent ("<agent>: runs on <runtime> / <model>, chosen by the Model Router (<kind>): <reason>"), a line for each skipped layer, and "Model Router could not choose: … The agents above run on this run's launch." on failure (VIS-018). In the run's Settings (gear), the Delegated copies rows say "<model> · <runtime> · <approval> · Model Router · <kind>", the reason under it and "View decision" (opens Decisions at that delegation with its team open); a copy on another node has the node chip and no "View decision" (VIS-016, VIS-017). From Decisions, the Task key opens the Task's page and "Open run" opens the delegating run. Related: VIS-016..018.

**UXJ-006 — Show the router in the sidebar.** Settings → Server Settings → Basics → "Show internal agents" (the existing setting). On: the router is listed under its workspace in the sidebar and in Agents with the product's Internal badge (VIS-020); off: it is in no list; "Talk to the router" opens its run either way. Related: VIS-020.

**UXJ-007 — Why is it not used?** On but unable: one amber line under the description names the cause and, from the other tabs, "Go to Configuration". Related: VIS-003, VIS-004.

**UXJ-008 — A peer node's window.** The page is that node's: its switch, router, decisions and runtimes. The node's name is at the right of the description row. Its Decisions list what other nodes delegated to it (no "Open run": the delegating run is on the other node). Related: VIS-011.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Configuration | `/settings?section=model-routing&tab=setup` | Choose the router's runtime and model; open its conversation | Section "Model Router" (Runtime, Model), button "Talk to the router", one hint line | VIS-001..004, 021, 024 |
| UIS-002 | Decisions | `…&tab=decisions` | Read each delegation's choices | Tab control (filter); Task blocks; folded teams; agent rows; "Show more" | VIS-005..011, 022, 025 |
| UIS-003 | Overview | `…&tab=overview` | Read the statistics | Period control; total and source bar; "By task kind" rows; details | VIS-012..014, 023, 026 |
| UIS-004 | Runtimes | `…&tab=runtimes` | The node's live runtimes, limits and models | Node name, checked time, Check again; a section per runtime (Limits, Models) | VIS-015 |
| UIS-005 | Run Settings rows of delegated copies | a run's Settings (gear) → Delegated copies | Source, kind, reason, View decision | Rows of copies; remote copies with the node chip | VIS-016, 017 |
| UIS-006 | `delegate_task` result | the run's Activity tab → the call → Result | One line per agent, notes | Plain text result | VIS-018 |
| UIS-007 | The router's run | "Talk to the router" or the sidebar | Teach the router | An ordinary agent run | VIS-019, 020 |
| UIS-008 | Page frame (header, switch, problem line, tabs) | every tab | Enable; show problems; switch tabs | Described in Visual Language | all |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Page, off | Switch on | Knob moves; fields enable | On; the problem line appears if the router is not set or cannot answer | `setModelRoutingEnabled(true)` | Choose runtime and model |
| TR-002 | Page, on | Switch off | Fields and "Talk to the router" disable | Off; history and the router's choices kept | `setModelRoutingEnabled(false)` | Switch on |
| TR-003 | Configuration | Choose a runtime | The Model list refills, Model clears | Router not set until a model is chosen | `setModelRouterLaunch` when both are set | Choose a model |
| TR-004 | Configuration | Choose a model | The problem line appears (blocked, not offered) or disappears | Router active or not | `setModelRouterLaunch` | Talk to the router |
| TR-005 | Configuration | "Talk to the router" | Navigates | The router's run opens | `openModelRouterConversation` returns the run ID | Type to the router |
| TR-006 | Decisions | Click a folded team row | Chevron rotates; members appear | Team open (kept while the page is open) | — | Click again to fold |
| TR-007 | Decisions | Choose a filter | List filters in place; counts per folded team follow | Filtered | — | Choose All |
| TR-008 | Decisions | "Show more" | Next 8 Task blocks append | — | `modelRoutingDecisions(before, limit, source)` | — |
| TR-009 | Decisions | Task key | Navigates | The Task's page in Projects | route `/projects/<project>/tasks/<task>` | — |
| TR-010 | Decisions | "Open run" | Navigates | The delegating run | route `/chat?id=<run>` | — |
| TR-011 | Overview | Choose a period | Numbers, bars and rows update in place | The period selected | `modelRoutingStatistics(period)` | — |
| TR-012 | Overview | Click a kind row | Chevron rotates; models listed | Row open | — | Click again |
| TR-013 | Run Settings | "View decision" | Navigates | Decisions at that delegation, team open | record found by delegating run + copy address + agent address | — |
| TR-014 | Runtimes | Check again | Button shows "Checking…" | Report refreshed, or "Couldn't check again. Showing the last answer." | the existing availability read | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Configuration, on and set | default | Router fields set; button enabled | all | — | VIS-001 |
| Configuration, off | switch off or never used | Switch off; Runtime/Model show "Choose …" or the saved choice, disabled; button disabled | switch | Switch on | VIS-002 |
| Configuration, not set | on, no runtime or model | Problem line: "choose a runtime and model for the router."; button disabled | choose | Choose both | VIS-003 |
| Configuration, blocked | on, the router's model blocked | Problem line: "Codex · gpt-prototype-codex-mini is blocked until Oct 27, 04:00 AM (5 hours)."; the model list marks blocked models | choose another model | Choose another | VIS-004 |
| Decisions, default | on, decisions exist | Task blocks newest first; teams folded | filter, open, links | — | VIS-005, 006, 007 |
| Decisions, router failure | a delegation where the router did not answer | In the team: "The Model Router could not choose: no valid answer within 40 seconds. The agents started on the delegating run's runtime and model."; agents marked "Inherited from the run" in amber | — | — | VIS-008 |
| Decisions, empty | on, nothing recorded; or off, never used | "No decisions yet." with one hint (on) / "Nothing recorded yet." with "Turn Model Routing on in Configuration…" (off) | Go to Configuration | — | VIS-009 |
| Decisions, off with history | switched off after use | One line: "Model Routing is off. New delegations are not recorded here; earlier decisions stay." | all | — | VIS-010 |
| Decisions, a peer's window | window of a peer node | That node's own decisions; "No Project Task" blocks; no "Open run" | filter, open team | — | VIS-011 |
| Decisions, filter with no match | a filter that matches nothing | "No decisions match these filters." and "Clear filters" | Clear filters | — | (text only) |
| Overview, data | on, records in the period | Total, bar, rows | period, details | — | VIS-012, 013 |
| Overview, empty | no records / none in the period | "No statistics yet." with a hint, or "No delegated agents in this period." | period | — | VIS-014 |
| Runtimes, loading / error / check failed / empty | the existing states of autobyteus-303 | Unchanged texts | Check again | — | VIS-015 (ready) |
| Long content | a long Task title or reason | Titles and reasons wrap; agent names never push the layout | — | — | VIS-022 |

## Content, Labels, Validation, And Feedback

- **Product voice and wording conventions:** short, factual, no repeated explanation; English and Simplified Chinese; the router is called "Model Router" (模型路由器); sources use the product's existing words (Agent default, Team default, Inherited from the run).
- **Exact labels** (the message keys are in `localization/messages/{en,zh-CN}/modelRoutingSettings.ts`, `runSettings.ts`): page title "Model Routing" (模型路由); description "Chooses the runtime and model for delegated agents that have no default."; tabs "Configuration", "Decisions", "Overview", "Runtimes" (配置, 决策, 概览, 运行时); section "Model Router"; fields "Runtime", "Model"; button "Talk to the router" (和路由器对话); hint "Tell it what you prefer, for example "use Antigravity for writing". It remembers what it learns."; filter "All · Model Router · Not routed"; "Open run"; "Show more"; "Showing N of M Tasks"; periods "7 days · 30 days · All time"; Overview "N delegated agents in this period", "By task kind", "N agents" / "1 agent", "Not routed — Defaults and inherited launches", "Details"; run Settings "Model Router", "View decision".
- **Empty, error, and recovery messages:** as in State Behavior. Fallback wait in the router-failure note: 40 seconds (SD correction).
- **Router status reasons** are shown from the server's reason codes (OFF, ROUTER_NOT_SET, RUNTIME_UNAVAILABLE, SIGNED_OUT, MODEL_NOT_OFFERED, MODEL_BLOCKED, REPORT_UNREADABLE) translated by the page; launch notes inside `delegate_task` results stay in English (SR-013).

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| Runtime | select | to be active | one of the node's runtimes | change | problem line while empty: "choose a runtime and model for the router." |
| Model | select | to be active | one of the runtime's models; a blocked one can be chosen but the router is then not active | change | "<runtime> · <model> is blocked until <time> (<limit>)." |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop | ≥ 1024 px | Content column 64 rem; agent rows in two columns (name, launch); Overview rows in columns | — |
| Tablet | 640–1023 px | The same; the tab control wraps under the tabs when it does not fit | — |
| Narrow mobile | < 640 px | One column; padding `px-5`; the tab bar scrolls sideways; the tab control sits under the tabs, right-aligned; a Task's time and "Open run" wrap under its title; agent name above its launch; Overview rows stack (kind, bar, count) | — (VIS-021..023) |
| Peer node window | `electron_external` | The node's name at the right of the description row | The same controls act on that node |
| zh-CN | locale | The same layout; texts translated (VIS-024..026) | — |

## Accessibility And Keyboard Behavior

- **Accessibility target:** the product's existing Settings pages (keyboard-operable controls, visible focus, labelled switches and selects).
- **Focus order, movement, and return:** title → switch → tabs → the tab's control → content in reading order.
- **Keyboard interaction:** the tabs are a `tablist` (Left/Right move and select, the selected tab is the one tab stop); the switch is a `role="switch"` with `aria-checked`, Space/Enter toggle; the segmented control is a `radiogroup`; a folded team row is a button with `aria-expanded` (Enter/Space); Overview rows are buttons with `aria-expanded`; links and buttons are native.
- **Roles, names, states, live announcements:** the problem line is `role="status"`; each switch and select has a label ("Use the Model Router"); the runtime squares are decorative (`aria-hidden`) and the runtime name is always text; bars have an `aria-label` that lists their values.
- **Contrast:** text on white at the product's gray scale (`gray-500` minimum for secondary text); amber text `amber-700/800`; no information is carried by colour alone (runtime names, source words and counts are text).

## Motion And Transitions

- **Motion:** the chevrons rotate 90°/180° (`transition-transform`, 150 ms); the switch knob slides (`transition-transform`); the segmented control and tab colours change with `transition-colors`/`transition`; nothing else moves.
- **Durations and easing:** the product's defaults (Tailwind 150 ms ease).
- **Reduced-motion behavior:** the product's existing handling; no animation is needed to understand a state.

## Data, Contract, And Mock Boundaries

The Solution Designer's data contract for this design is `design-spec.md` § SR-013 (D1–D9) of the engineering ticket.

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Router status, switch, router runtime/model | Header problem line, Configuration | `prototype/model-routing/modelRoutingState.ts` (in memory; scenario from local storage) | `modelRoutingStatus` (`reasonCode`, `reasonParams`, English `reasonText`), `setModelRoutingEnabled`, `setModelRouterLaunch`; the page translates by reason code |
| Decision records | Decisions, "View decision" | Invented delegations (`modelRoutingData.ts`) | Records carry `taskKey` (null without a saved Project Task), `projectId`, `taskId`, `taskTitle`, delegating run ID, copy address, agent address, runtime, model, source, `choiceReason`, optional free-text `taskKind`, notes; `modelRoutingDecisions(before, limit, source: ROUTER \| NOT_ROUTER)` returns Task groups newest first |
| Statistics | Overview | Derived from the same records | `modelRoutingStatistics(period)`: per kind runtime/model counts, the "not routed" group, source totals, router failures; this node's own records only |
| Router run | UIS-007 | A stored run answered through the mock GraphQL layer | An ordinary agent run in its own internal workspace (DEC-023), opened by its run ID; its workspace listed only while "Show internal agents" is on (the server marks a workspace created for an internal agent as internal) |
| Routed launch source | Run Settings rows | Rows overlaid from the records (`routingRows.ts`) | A new launch-source origin `model_router` with reason and task kind; the peer's answer carries the launches of a remote copy |
| `delegate_task` result lines | UIS-006 | Text from `delegationResult` | The tool's result text, English |
| Show internal agents | UXJ-006 | The existing fixture | The existing autobyteus-308 setting; nothing router-specific |
| Not simulated | — | Real routing, the 60→40 s wait, concurrent requests, the knowledge file | Server |

## Final Visual Reference Inventory

Stored in `visual-references/` (this ticket folder). Every visible detail is requirements-defining unless the last column says otherwise.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UIS-001 Configuration, on and set | 1440×900 | `visual-references/VIS-001-configuration-on-1440x900.png` | Header with switch at the top right; tabs; Model Router fields; button; hint | Runtime/model names |
| VIS-002 | UIS-001 off | 1440×900 | `visual-references/VIS-002-configuration-off-1440x900.png` | Switch off; disabled fields and button | — |
| VIS-003 | UIS-001 on, router not set | 1440×900 | `visual-references/VIS-003-configuration-router-not-set-1440x900.png` | Problem line under the description; disabled button | — |
| VIS-004 | UIS-001 on, router blocked | 1440×900 | `visual-references/VIS-004-configuration-router-blocked-1440x900.png` | Problem line with the blocked-until text; blocked suffix in the model list | Model name, times |
| VIS-005 | UIS-002 Decisions | 1440×900 | `visual-references/VIS-005-decisions-1440x900.png` | Tab control (filter); Task blocks; folded team rows with runtime squares, count and triangle; single agent launch | Task keys, titles, times, reasons |
| VIS-006 | UIS-002 team open | 1440×900 | `visual-references/VIS-006-decisions-team-open-1440x900.png` | Open team: members in two columns, reason, skipped-default note | Texts |
| VIS-007 | UIS-002 filter | 1440×900 | `visual-references/VIS-007-decisions-filter-model-router-1440x900.png` | Filtered team counts, singular "1 agent" | Texts |
| VIS-008 | UIS-002 router failure | 1440×900 | `visual-references/VIS-008-decisions-router-failure-1440x900.png` | Failure note; "Inherited from the run" rows | Texts |
| VIS-009 | UIS-002 empty | 1440×900 | `visual-references/VIS-009-decisions-empty-1440x900.png` | Empty text and hint | — |
| VIS-010 | UIS-002 off, history kept | 1440×900 | `visual-references/VIS-010-decisions-off-history-kept-1440x900.png` | The one-line note above the list | Records |
| VIS-011 | UIS-002 peer window | 1440×900 | `visual-references/VIS-011-decisions-peer-node-1440x900.png` | Node name at the right of the description; "No Project Task" blocks; no Open run | Node name, records |
| VIS-012 | UIS-003 Overview | 1440×900 | `visual-references/VIS-012-overview-30-days-1440x900.png` | Period control in the tab row; total, source bar, legend, failure line, per-kind bars with "N agents" | Numbers |
| VIS-013 | UIS-003 details open | 1440×900 | `visual-references/VIS-013-overview-details-open-1440x900.png` | Models per kind with counts and shares | Numbers |
| VIS-014 | UIS-003 empty | 1440×900 | `visual-references/VIS-014-overview-empty-1440x900.png` | Empty text | — |
| VIS-015 | UIS-004 Runtimes | 1440×900 | `visual-references/VIS-015-runtimes-1440x900.png` | Node line, checked time, Check again, runtime sections without a card | Runtimes, limits, models, times |
| VIS-016 | UIS-005 Settings rows | 1440×1000 | `visual-references/VIS-016-run-settings-delegated-copies-1440x1000.png` | Rows with "Model Router · kind", reasons, node chips | Copies, texts |
| VIS-017 | UIS-005 a team copy open | 1440×1000 | `visual-references/VIS-017-run-settings-team-copy-open-1440x1000.png` | Members with source, kind, skipped-default note | Texts |
| VIS-018 | UIS-006 result | 1440×1000 | `visual-references/VIS-018-delegate-task-result-1440x1000.png` | One line per agent; skipped layer line | Texts |
| VIS-019 | UIS-007 router conversation | 1440×900 | `visual-references/VIS-019-router-conversation-1440x900.png` | An ordinary agent run (header, conversation, tool cards, Activity) | The conversation's content |
| VIS-020 | UXJ-006 sidebar | 1440×900 | `visual-references/VIS-020-sidebar-internal-agents-shown-1440x900.png` | "Model Router" listed like any agent (setting on) | Other agents |
| VIS-021 | UIS-001 narrow | 390×844 | `visual-references/VIS-021-configuration-390x844.png` | Single column; the tab bar scrolls | — |
| VIS-022 | UIS-002 narrow | 390×844 | `visual-references/VIS-022-decisions-team-open-390x844.png` | Title wraps; time and Open run under it | Texts |
| VIS-023 | UIS-003 narrow | 390×844 | `visual-references/VIS-023-overview-390x844.png` | Stacked rows | Numbers |
| VIS-024 | UIS-001 zh-CN | 1440×900 | `visual-references/VIS-024-configuration-zh-CN-1440x900.png` | All page texts in Simplified Chinese | — |
| VIS-025 | UIS-002 zh-CN | 1440×900 | `visual-references/VIS-025-decisions-zh-CN-1440x900.png` | The same | Task titles and reasons stay in the fixture's language |
| VIS-026 | UIS-003 zh-CN | 1440×900 | `visual-references/VIS-026-overview-zh-CN-1440x900.png` | The same | Task kind labels are the router's free text |

## Linked UI Reference Evidence

- Runnable UI reference: the design repository root; `corepack pnpm install --ignore-workspace --frozen-lockfile`, `corepack pnpm dev --port 3210`, entry `http://127.0.0.1:3210/settings?section=model-routing`.
- Ticket record: `product-ticket.md` (this folder); review notes and the data table: `design-review-notes.md`.
- Run instructions and starting states: `ui-reference-runbook.md` (section `delegated-runtime-model-routing`): scenarios `populated` (default), `routing_fresh`, `routing_off`, `routing_on_empty`, `routing_not_set`, `routing_blocked` (local-storage key `autobyteus.prototype.scenario`); `autobyteus.prototype.context` = `electron_external` for a peer node's window; `autobyteus.localization.preference-mode` = `zh-CN`.
- Relevant supporting artifacts: `mock-boundaries.md` (section "Model Routing"), `prototype-scenarios.md`.
- Mocked boundaries and limitations: see Data, Contract, And Mock Boundaries.

## Implementation Fidelity Boundary

- **Must preserve:** the page structure (header with the switch at the top right, four tabs, one control in the tab row); the Task-block layout and the folded team row; one fixed colour per runtime in Decisions and Overview; the wording and what each element shows; the absence of anything router-specific in the router's conversation; the router following the global "Show internal agents" setting; each node listing only its own decisions.
- **Reference state and mechanisms that do not prescribe production architecture:** the in-memory state and scenario seeding; the mock GraphQL answers; `routingRows.ts`; the native selects.
- **Fixture content allowed to vary:** Task keys and titles, agent names, runtimes, models, limits, reasons, times, counts.
- **Permitted responsive or platform variation:** the pixel breakpoints follow the product's existing ones; the platform's native select may be replaced by the product's model menu.
- **Existing design-system constraints:** the product's Tailwind tokens and components named in Visual Language.

## Out Of Scope

- Learning from outcomes (REQ-013), model settings, a router-only visibility setting, an editable knowledge note or task-kind list, a header chip for the routed choice, recording or showing another node's decisions on this node's page.

## Open Decisions And Risks

- **The "missing agent" mark (Reconnect design).** The accepted `agent-definition-reconnect-ui` design marks a run whose agent definition is absent from the catalog. The server's catalog omits internal agents while "Show internal agents" is off, so the router's open run would be marked "missing" in the sidebar tree. Whoever builds Reconnect must not apply the mark to runs of internal agents (the reference avoids it in VIS-019 by showing internal agents).
- **The router's workspace** is the engineering decision DEC-023: its own internal workspace, listed only while "Show internal agents" is on. The reference shows no router workspace (the run uses the demo workspace).
- **Data the server must provide** is listed under Data, Contract, And Mock Boundaries; if any item is not delivered the UI element that depends on it is removed, not approximated (for example: without `taskKey` Decisions groups by title and shows "No Project Task").
- **Task kind labels** are the router's free text, so the same kind may read differently in languages other than the one the router wrote in; Overview groups case-insensitively (SR-013 D7).

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes` (the revision is recorded in `product-ticket.md` after integration)
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes` (the "filter with no match" and "Runtimes loading/error" states are text-only; the latter is the unchanged autobyteus-303 content)
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
