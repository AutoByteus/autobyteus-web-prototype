# UI/UX Specification — cross-scope-agent-mentions

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `cross-scope-agent-mentions` (Product Design Requested, New Request, from `/software_engineering_team/solution_designer`, 2026-09-30)
- Related requirements revision ID: SR-001 (requirements Draft; this package is the Product Design result for it)
- Related IDs: SC-001–SC-007; B-001–B-004; REQ-001–REQ-007; AC-001–AC-006; Q1, Q3, Q4, Q5; DEC-001–DEC-006 (`prototype-ticket.md`)
- Runnable prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`
- Review URL (during review): http://127.0.0.1:3282/workspace — normal entry `/` → `/chat`, then Workspaces
- Explicit user-confirmation reference: user message 2026-09-30, "Okay, finally I confirm now. All good now." — after trying the Team run, Org run and standalone Agent run journeys, and after the decisions recorded in rounds 2–10 of `prototype-ticket.md`
- Final validation date: 2026-09-30 (production build, `validate-cross-scope-agent-mentions.mjs` 46/46, 0 page errors, 0 external requests)

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application: `autobyteus-web`
- Pinned source revision: `origin/personal@e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71` (v1.4.92-beta.3; baseline refreshed by `WEB-BASELINE-REFRESH-003` during this ticket, on the user's request; the ticket started on `57df63f07`)
- Prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`
- Prototype revision: approved runnable behavior at `270d05e` on `prototype/cross-scope-agent-mentions`; the final package and integration revisions are recorded in `prototype-ticket.md`
- Ticket folder: `tickets/done/cross-scope-agent-mentions/`
- Bootstrap report: `/Users/normy/autobyteus_org/autobyteus-web-prototype/prototype-bootstrap-report.md` (`WEB-BASELINE-REFRESH-003`, accepted)

## Scope And Experience Goal

- Actor: the user, chatting with one agent in a live run.
- Context: a standalone Agent run, a standalone Agent Team run, or an Agent Org run (focused on one member).
- Goal: in the middle of the work, reach a standalone Agent or Agent Team that is not part of the current run, without having launched an Org up front.
- Observable success: the user types `@` and picks a standalone Agent or Agent Team; the agent the user is talking to receives the message and brings the collaborator in by delegating a task; the collaborator appears under the current run as a task Agent or task Team; later messages between them appear in the Team/Org tab; the user can open the collaborator and chat with it directly.
- Purpose (user's words, recorded): teammates in a Team, and members of one Org, already reach each other by messages and configured handoff rules, so they are never offered. `@` is for reaching outside the current run.
- In-scope surfaces: live-run composer (`@` menu, chip row, sent message), Workspaces run tree (task rows under Team, Org and standalone Agent runs), center conversation of a task Agent, right-panel Team/Org tab, failure notice.
- Non-goals: hidden global Org; linking to runs in other roots; mentioning an Agent Org; changing New chat `@` (still picks the launch target); changing authored Org definitions or handoff rules; automatic handoff rules.

## Related Requirements And Acceptance Criteria

| ID | UI/UX obligation | Covered by |
| --- | --- | --- |
| REQ-001, AC-001, B-001 | `@` in every live run composer (standalone Agent, Team member, Org member) lists shared standalone Agents, then shared Agent Teams, that are **not in the current run**; no Agent Org; the default chat agent (Daily Assistant) is excluded as in New chat `@`. | UXJ-001, UXJ-004, UXJ-005; VIS-001, VIS-008, VIS-011, VIS-014 |
| REQ-002, AC-002 | Choosing an option writes `@Name ` into the text and shows a removable chip above the text; the sent user message shows `@Name` as an inline chip; the message goes to the focused agent. | UXJ-001; VIS-003, VIS-004 |
| REQ-003, REQ-004, AC-003, B-002, B-004 | The focused agent calls `delegate_task`; the collaborator appears under the run as a task Agent or task Team using the product's existing task rows; it uses the run's runtime, model and workspace (not shown as extra text). | UXJ-001–UXJ-005; VIS-004, VIS-006, VIS-009, VIS-012 |
| REQ-005, AC-004, B-003 | The delegated brief is **not** a Team/Org tab message; it is the system task notice at the top of the collaborator's conversation (as in the product today). Later `send_message_to` exchanges appear in the Team/Org tab. | UXJ-002; VIS-004, VIS-005, VIS-010, VIS-013 |
| REQ-006, AC-005, SC-005 | Anything already in the run (members, the run's own team, Org members/teams, collaborators already brought in) is not offered, so a second copy cannot be requested from the menu. | UXJ-001 step 8; VIS-001, VIS-008, VIS-011 |
| REQ-007, AC-006, SC-006 | When a collaborator cannot be brought in, a red notice above the composer says so and that nothing was added; the tree is unchanged. | UXJ-003; VIS-007 |
| SC-003 | Clicking a task row opens that collaborator's conversation; the composer sends to it directly. | UXJ-002; VIS-005, VIS-010, VIS-013 |
| SC-007 | Same behavior in an Org run. | UXJ-004; VIS-008–VIS-010 |

## Production-Quality Experience And Visual Specification

- Existing product language to preserve: the run composer box (Context Files header, textarea, mic, send), the `/` skill menu pattern, the New chat `@` target menu pattern, the Workspaces tree rows and hierarchy branches, the Team/Org tab message list, tool-call cards, the system task notification segment. The feature adds no new visual language beyond the items below.
- `@` menu (`RunMentionMenu`): same frame as the New chat target menu — width 23rem (max viewport − 1rem), white, 1px `gray-200` border, radius `lg`, `shadow-lg`, opens **above** the composer, left-aligned 0.5rem inside it, max height = min(300px, space above − 22px), list scrolls. Header line 0.6875rem `gray-400`: "Bring into this run `@query` · ↑↓ to move, Enter to choose" (query in `gray-600` medium). Group labels "Agents" / "Agent teams" 0.6875rem medium `gray-400`. Option row: 24px initials badge (Agent: round, `emerald-50` fill, `emerald-200` border; Team: rounded-md, `gray-50` fill, `gray-200` border; 0.5625rem semibold `slate-600`), name 0.8125rem medium `gray-900`, description 0.75rem `gray-500`, both truncated; highlighted row `gray-100`, hover `gray-50`. Footer 0.75rem `gray-400`: "<focused agent> gets your message and brings them into this run". Order: Agents, then Teams; catalog order within each.
- Empty state: "No agents or teams match" (0.8125rem `gray-500`) and "Agent Orgs can’t be mentioned." (0.75rem `gray-400`).
- Chip row: above the textarea, padding 0.75rem sides / 0.625rem top; chip = `sky-50` fill, `sky-200` border, `sky-800` text, 0.75rem medium, radius `md`, person icon (Agent) or user-group icon (Team) 14px, text `@Name`, × button 12px (`sky-500`, hover `sky-100` / `sky-800`). No explanatory line next to the chip (removed on the user's request).
- Sent message: `@Name` rendered inline as `sky-50` fill, `sky-800` medium text, 1px inset `sky-200` ring, radius, 0.25rem horizontal padding; other text unchanged.
- Run tree task rows: the product's existing task rows, with three changes that apply to **every** task row: (1) no visible "Started by <member>" line (the starter stays in the accessible label); (2) a task Agent shows the member marker — solid status dot (8px) plus a 16px initials circle (`gray-200`, 0.5625rem semibold `gray-600`) — instead of the dotted ring; (3) marker and icon are centered on the name line (20px line box) and the hierarchy branch line is drawn from the row's border edge so it runs straight through member and task rows. Team tree: dashed `indigo-200` outline, `indigo-50/40` fill, task Team = bolt in a dashed square. Org tree: existing Org task rows (no outline; task Team = indigo user-group icon). A task Team brought in by `@` opens once when it appears so its members are visible.
- Standalone Agent run (new presentation; the product has none today): task rows listed under the run row with the Team tree's task rows and branches; clicking a task row focuses it and the run row loses its highlight; clicking the run row returns to the run's own agent. The center header of a task Agent is titled by its name. A right-panel "Team" tab appears once the run has a task Agent, with the standard message list.
- Failure notice: above the composer, full composer width, `red-50` fill, `red-200` border, radius `lg`, padding 0.5rem 0.75rem; warning icon 16px `red-500`; title 0.875rem medium "Couldn’t add <name> to this run"; detail 0.75rem `red-700` "<reason> Nothing was added."; dismiss × (`red-400`, hover `red-100` / `red-700`). `role="alert"`. It is replaced when the user sends the next message in that conversation.
- Success has no notice: the run tree shows the result.
- Motion: none added; menu open/close follows the existing popover.

## Journey Inventory

| Journey ID | Context | Starting state | Goal | Completion state | IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Team run, focused on a member | Stored Team run open | Bring an Agent Team into the run | Task Team under the run; Team tab shows its later message | SC-001, SC-002, SC-005, REQ-001–004, REQ-006 |
| UXJ-002 | Team run | Task Team or task Agent present | Talk to the collaborator directly | Collaborator focused, message answered | SC-003, SC-004, REQ-005 |
| UXJ-003 | Any live run | Collaborator cannot run with the run's settings | See the failure | Failure notice; tree unchanged | SC-006, REQ-007 |
| UXJ-004 | Org run, focused on a member | Stored Org run open | Bring an Agent and a Team into the Org run | Task Agent and task Team under the Org run; Org tab messages | SC-007 |
| UXJ-005 | Standalone Agent run | Stored or chat-started Agent run | Bring an Agent and a Team into the run | Task rows under the run row; Team tab appears | REQ-001, REQ-003–005 |

## Journey Details

UXJ-001 (VIS-001, VIS-002, VIS-003, VIS-004, VIS-006): 1. Open a Team run and focus a member (e.g. researcher). 2. Type `@` at a word start: the menu opens above the composer listing only Agents and Teams not in the run. 3. Typing filters by name or id; no match shows the empty state; Enter with no match does nothing; Escape closes the menu and keeps the text. 4. ↑/↓ move, Enter/Tab or click chooses: the `@query` token becomes `@Name ` and a chip appears. 5. Removing the chip keeps the words and drops the mention (`@Name` → `Name`); deleting the `@Name` text removes the chip. 6. Send (Enter): the composer clears; the user message shows the inline `@Name` chip; the focused agent turns Running, says it will bring the collaborator in, shows a `delegate_task` call, then confirms. 7. The task Team row appears under the run (opened once, members listed with status); later the task Team's coordinator reports back with `send_message_to`, which appears in the Team tab. 8. Typing `@Product Team` again shows the empty state: it is in the run now and is not offered.

UXJ-002 (VIS-005): click a task row (task Agent, or a task Team member; a task Team row opens its coordinator). The center shows its conversation: the system task notice ("Task delegator address …", "Task delegator AgentRun ID …", "Description:" …) at the top, then its work. The composer placeholder names it; a sent message goes to it and is answered.

UXJ-003 (VIS-007): mention a collaborator that cannot run with the run's settings and send. The focused agent calls `delegate_task`; the call returns without a run ID (normal result, not a failed tool card), the agent explains, and the red notice appears. No row is added. Dismiss with ×, or it is replaced by the next message.

UXJ-004 (VIS-008–VIS-010): Workspaces → `prototype-workspace` → `Product Launch Org` → run → `analyst`. Same menu (the Org, its members and its teams are not offered) and same send behavior. Task rows appear under the Org run after the configured members; the Org tab lists later messages; a task Agent can be opened and messaged.

UXJ-005 (VIS-011–VIS-013): Workspaces → `prototype-workspace` → `Research Assistant` → run (or send a first message from Chat). Same menu (the run's own agent is not offered) and send. Task rows appear under the run row; a "Team" tab appears in the right panel. Clicking a task row opens it (header = its name); clicking the run row returns to the run's own agent.

## Screen And Surface Specification

| Surface ID | Purpose | Entry | Structure | States | Actions | Visual IDs |
| --- | --- | --- | --- | --- | --- | --- |
| UIS-001 | `@` menu | `@` at a word start in a live-run composer | header, grouped options, footer | options, filtered, empty, small window | choose, move, close | VIS-001, VIS-002, VIS-008, VIS-011, VIS-014 |
| UIS-002 | Mention chip row | an option chosen | chips above the textarea | one or more chips | remove chip | VIS-003 |
| UIS-003 | Sent message mention | message sent | inline chip in user message | — | — | VIS-004 |
| UIS-004 | Task rows in the run tree | collaborator brought in | task Agent row; task Team row with members | Offline/Initializing/Running/Idle | select, expand/collapse | VIS-004, VIS-006, VIS-009, VIS-012 |
| UIS-005 | Collaborator conversation | task row selected | header, system task notice, work, composer | idle, running | send | VIS-005, VIS-010, VIS-013 |
| UIS-006 | Team/Org tab messages | collaborator reports back | existing message list | messages | select message | VIS-004, VIS-009, VIS-012 |
| UIS-007 | Failure notice | collaborator cannot be brought in | notice above composer | shown, dismissed | dismiss | VIS-007 |

## Interaction And State Transitions

| ID | From | Trigger | Feedback | Result |
| --- | --- | --- | --- | --- |
| TR-001 | composer | `@` typed at a word start (live run, not a launch draft) | menu opens above | UIS-001 |
| TR-002 | menu | text typed after `@` | list filters; empty state when nothing matches | UIS-001 |
| TR-003 | menu | Enter/Tab/click on option | token replaced by `@Name `, chip shown, menu closes | UIS-002 |
| TR-004 | menu | Escape; Enter with no match | menu closes / nothing happens | composer |
| TR-005 | chip | × | chip removed, `@Name` → `Name` in text | composer |
| TR-006 | composer with chip | Send | composer clears; message with inline chip; focused agent Running | UXJ-001 step 6 |
| TR-007 | agent turn | `delegate_task` succeeds | task row appears (Initializing → Running → Idle) | UIS-004 |
| TR-008 | agent turn | `delegate_task` returns no run ID | agent explains; failure notice | UIS-007 |
| TR-009 | collaborator | `send_message_to` back | Team/Org tab row "from <collaborator>" | UIS-006 |
| TR-010 | tree | click task row | center shows the collaborator | UIS-005 |
| TR-011 | tree (standalone Agent run) | click run row | center shows the run's own agent | — |

## State Behavior

| Surface / State | Trigger | Presentation | Actions | Visual |
| --- | --- | --- | --- | --- |
| Menu, nothing matches | query matches no candidate | "No agents or teams match" + "Agent Orgs can’t be mentioned." | edit, Escape | VIS-002 |
| Menu, everything in the run | all candidates already in the run | empty state as above | Escape | — |
| Task row statuses | collaborator status | solid dot: offline gray, initializing amber pulse, running blue pulse, idle green, error red | select | VIS-006 |
| Add failed | collaborator cannot run | red notice; no row | dismiss | VIS-007 |

## Responsive And Platform Behavior

- Desktop: the menu opens upward and stays inside the window (verified at 1512x952 and 1024x640; VIS-014). Below 640px the menu becomes the existing bottom sheet (shared popover behavior; not changed).
- The desktop right panel may collapse to its icon strip at narrow widths (existing behavior, VIS-014).

## Accessibility And Keyboard Behavior

- The menu is a `listbox` labelled "Agents and teams you can bring into this run"; options are `option` with `aria-selected`. The run composer textarea should expose the same combobox semantics as the New chat composer (`aria-expanded`, `aria-controls`, `aria-activedescendant`); the prototype's run composer does not yet do this, and production must.
- ↑/↓ move, Enter/Tab choose, Escape closes (and does not close outer surfaces); Enter with an empty result is swallowed.
- Chip remove buttons have `aria-label` "Remove mention <name>". Failure notice is `role="alert"` with a labelled dismiss button.
- Task rows keep `treeitem`, `aria-level`, `aria-selected`; the accessible label still includes the starter ("Started by <member>").

## Content, Labels, Validation, And Feedback

UI-controlled strings (English; zh-CN in `localization/messages/zh-CN/chat.ts`):

- Menu header: "Bring into this run" + `@query` + "↑↓ to move, Enter to choose"; list label "Agents and teams you can bring into this run"; groups "Agents" / "Agent teams"; Team description "{count} members · coordinator {coordinator}"; footer "{agent} gets your message and brings them into this run".
- Empty: "No agents or teams match" / "Agent Orgs can’t be mentioned."
- Chip remove: "Remove mention {name}".
- Failure: "Couldn’t add {name} to this run" / "{reason} Nothing was added." / "Dismiss".
- System task notice text is the product's work packet: `Task delegator address: <address>` / `Task delegator AgentRun ID: <run id>` / blank / `Description:` / `<description>` (+ `Reference files:` list when given).

## Data, Contract, And Mock Boundaries

| Boundary | UI dependency | Prototype behavior | Production behavior required / unknown |
| --- | --- | --- | --- |
| Catalog for `@` | shared Agent and Team definitions; what is in the run | store definitions + illustrative `Product Team`, `Marketing Team`, `Computer Use Agent`, `Code Reviewer` (live-run menu only) | server/catalog source; in-run set per run kind |
| Mention delivery | focused agent receives the text + mentioned definition identity | local script plays the turn | REQ-002 delivery contract (Solution Designer) |
| Delegation of a non-mounted definition | task execution with definition identity and inherited launch settings | prototype registry supplies the configured-member-shaped source (F-001) | server must make the mentioned definition delegable and carry identity/launch config to the client |
| Task execution events | tree rows, statuses | `TASK_EXECUTION_STARTED` into the Team view; Org view rebuilt locally; standalone Agent run children held locally | Org and standalone Agent runs need a server model for children (F-001, F-005) |
| Team/Org tab messages | later `send_message_to` exchanges | local `TEAM_COMMUNICATION_MESSAGE` / Org communication events | existing communication projection |
| Failure | delegate result without run ID + reason | scripted for `Marketing Team` | real validation of runtime/model availability |
| Agent prose, timings, timestamps | — | scripted, illustrative | — |

## Final Visual Reference Inventory

All in `visual-references/` (SHA-256 in `visual-references/manifest.json`), captured from the production build after approval.

| Visual ID | Journey / Surface / State | Viewport | Image | Requirements-defining details | Illustrative |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 / UIS-001 menu open in a Team run | 1512x952 | `VIS-001-team-run-at-menu-1512x952.png` | menu frame, position above composer, header, groups, rows, footer, only out-of-run candidates | definition names/descriptions |
| VIS-002 | UIS-001 empty | 1512x952 | `VIS-002-team-run-at-menu-empty-1512x952.png` | empty text and Org note | — |
| VIS-003 | UIS-002 chip | 1512x952 | `VIS-003-team-run-composer-mention-chip-1512x952.png` | chip styling and placement; inline `@Name`; no hint line | typed text |
| VIS-004 | UXJ-001 after send | 1512x952 | `VIS-004-team-run-task-team-added-1512x952.png` | inline mention in message; `delegate_task` card; task Team rows; Team tab row | agent prose, times |
| VIS-005 | UIS-005 task member | 1512x952 | `VIS-005-team-run-task-member-conversation-1512x952.png` | system task notice at top; composer to the member | prose |
| VIS-006 | UIS-004 task Agent + task Team | 1512x952 | `VIS-006-team-run-task-agent-and-task-team-1512x952.png` | task rows: markers, no "Started by", straight branch line, dashed outlines | names |
| VIS-007 | UXJ-003 failure | 1512x952 | `VIS-007-team-run-add-failed-notice-1512x952.png` | notice styling/text; no row added; delegate card not failed | reason text |
| VIS-008 | UXJ-004 menu in Org run | 1512x952 | `VIS-008-org-run-at-menu-1512x952.png` | Org, members, teams not offered; footer names analyst | names |
| VIS-009 | UXJ-004 task rows + Org tab | 1512x952 | `VIS-009-org-run-task-agent-and-task-team-1512x952.png` | Org task rows (initials marker, no "Started by"), Org tab rows | prose, times |
| VIS-010 | UXJ-004 task Agent open | 1512x952 | `VIS-010-org-run-task-agent-conversation-1512x952.png` | system task notice; live composer | prose |
| VIS-011 | UXJ-005 menu in Agent run | 1512x952 | `VIS-011-agent-run-at-menu-1512x952.png` | own agent not offered; footer names Research Assistant | names |
| VIS-012 | UXJ-005 task rows + Team tab | 1512x952 | `VIS-012-agent-run-task-agent-and-task-team-1512x952.png` | task rows under the run row; Team tab present | prose, times |
| VIS-013 | UXJ-005 task Agent open | 1512x952 | `VIS-013-agent-run-task-agent-conversation-1512x952.png` | header titled by the task Agent's name; run row not highlighted | prose |
| VIS-014 | UIS-001 small window | 1024x640 | `VIS-014-team-run-at-menu-small-window-1024x640.png` | menu stays in the window above the composer | — |

## Linked Prototype Evidence

- Runnable prototype: canonical repository root (`corepack pnpm dev --port 3210`), normal entry `/`.
- Prototype ticket record: `prototype-ticket.md`; change history `prototype-change-log.md` (PC-001–PC-027).
- Behavior matrix: `ui-behavior-test-matrix.md`; validator `prototype/scripts/validate-cross-scope-agent-mentions.mjs`; capture `prototype/scripts/capture-cross-scope-agent-mentions-final.mjs`.
- Review evidence (non-normative): `review-evidence/round-1` … `round-10`, `final-validation/`.
- Mock boundaries: `/Users/normy/autobyteus_org/autobyteus-web-prototype/mock-boundaries.md` ("cross-scope-agent-mentions: local run").

## Implementation Fidelity Boundary

- Must preserve: all behavior in the journeys and transitions above; the listed strings; the menu, chip, inline-mention and notice styling; the task-row changes (no visible starter line, member marker for task Agents, centered marker, straight branch line); "not offered when already in the run"; the brief as a system task notice, not a Team/Org tab message; no success notice.
- Prototype-only: `prototype/run-mentions/*` (browser state, drivers, script), plugin hooks, the collaborator-source hooks in execution/hydration/index code, the resumed-run flags, the scripted chat reply, and the fixture correction that lists the stored standalone Agent run. None prescribes production architecture.
- May vary: agent prose, fixture names and descriptions, timestamps, run IDs, timings.
- Existing design-system constraints: reuse the composer, popover, tree rows, message list and segment components.

## Out Of Scope

The first message of a launch draft (New chat `@` stays the launch-target picker); mentioning Agent Orgs; linking to runs outside the current root; automatic handoff rules; showing inherited settings as extra text; a success notice.

## Open Decisions And Risks

- F-001 (requirements/architecture): the client resolves a task execution through a configured member at the same address (Team: `createTeamAgentContext`, `teamMemberProjectionHydrationService`; Org: `AgentOrgExecutionViewIndex`, `utils/agentOrgHistoryRows.ts`) and the task DTOs carry no definition identity or launch settings. A non-mounted collaborator needs both from the server.
- F-005 (requirements/architecture): a standalone Agent run has no collaboration root today (no children, no Team tab). The approved presentation (task rows under the run row, Team tab once a child exists) requires that model.
- REQ-006/SC-005 wording change: "not offered" replaces "shown as already available".
- Task-row changes (no visible "Started by", member marker, alignment) apply to every delegated child in the product, not only mention-added ones.
- F-003 (not verified): how the product renders an agent-to-agent `send_message_to` delivery inside the receiving conversation; the prototype shows it as a user-style message (existing client behavior for `MEMBER_INPUT_MESSAGE`).
- Baseline finding B-001: the accepted baseline hides stored standalone Agent history (fixture workspace kind `local`) and drops an opened Team context on a route change; both are corrected locally in this ticket and should be folded into the next baseline correction.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Prototype repository/root, source pin, and prototype revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes`
- Prototype, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Prototype-repository artifact and visual-reference paths agree with this specification: `Yes`
