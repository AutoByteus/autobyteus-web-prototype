# UI/UX Specification — cross-scope-agent-mentions (SR-008 revision)

This revision supersedes `tickets/done/cross-scope-agent-mentions/ui-ux-spec.md` (approved 2026-09-30). Changes: PC-028–PC-032 in `prototype-change-log.md`; everything else is unchanged from the approved package.

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `cross-scope-agent-mentions-sr008` (Product Design Requested, user-directed revision, from `/software_engineering_team/solution_designer`, 2026-10-01); prior ticket `cross-scope-agent-mentions`
- Related requirements revision ID: SR-008 (Approved 2026-10-01; D-R1 and D-R2 accepted)
- Related IDs: REQ-001/003/005/006/007/008/011/013; AC-003/004/005/006/008/011/015; SC-001/002/006/008; D-R1, D-R2; RD-001–RD-004 (`prototype-ticket.md`); prior DEC-001–DEC-006
- Runnable prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`
- Review URL (during review): http://127.0.0.1:3284/workspace — normal entry `/` → `/chat`, then Workspaces
- Explicit user-confirmation reference: user message 2026-10-01, "You checked yourself right? Everything's right? If you checked yourself everything's right then you're done. Yeah, it's correct." — after the SR-008 review and the RD-004 decision ("okayyyy. agreed"); Product Prototyper's own checks: 49/49 browser checks and visual review of every state. Prior approval: 2026-09-30, "Okay, finally I confirm now. All good now."
- Final validation date: 2026-10-01 (production build, `validate-cross-scope-agent-mentions.mjs` 49/49, 0 page errors, 0 external requests)

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application: `autobyteus-web`
- Pinned source revision: `origin/personal@e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71` (v1.4.92-beta.3; baseline refreshed by `WEB-BASELINE-REFRESH-003` during this ticket, on the user's request; the ticket started on `57df63f07`)
- Prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`
- Prototype revision: approved runnable behavior at `d9bf0f6` on `prototype/cross-scope-agent-mentions-sr008`; the final package and integration revisions are recorded in `prototype-ticket.md`
- Ticket folder: `tickets/done/cross-scope-agent-mentions-sr008/` (prior: `tickets/done/cross-scope-agent-mentions/`)
- Bootstrap report: `/Users/normy/autobyteus_org/autobyteus-web-prototype/prototype-bootstrap-report.md` (`WEB-BASELINE-REFRESH-003`, accepted)

## Scope And Experience Goal

- Actor: the user, chatting with one agent in a live run.
- Context: a standalone Agent run, a standalone Agent Team run, or an Agent Org run (focused on one member).
- Goal: in the middle of the work, reach a standalone Agent or Agent Team that is not part of the current run, without having launched an Org up front.
- Observable success: the user types `@` and picks a standalone Agent or Agent Team; when the user sends, the collaborator is added under the current run (one per definition and run, Offline until its first message); the agent the user is talking to receives the message and briefs the collaborator with `send_message_to` by address; the briefing and later messages appear in the Team/Org tab; the user can open the collaborator and chat with it directly.
- Purpose (user's words, recorded): teammates in a Team, and members of one Org, already reach each other by messages and configured handoff rules, so they are never offered. `@` is for reaching outside the current run.
- In-scope surfaces: live-run composer (`@` menu, chip row, sent message), Workspaces run tree (task rows under Team, Org and standalone Agent runs), center conversation of a task Agent, right-panel Team/Org tab, failure notice.
- Non-goals: hidden global Org; linking to runs in other roots; mentioning an Agent Org; changing New chat `@` (still picks the launch target); changing authored Org definitions or handoff rules; automatic handoff rules.

## Related Requirements And Acceptance Criteria

| ID | UI/UX obligation | Covered by |
| --- | --- | --- |
| REQ-001, AC-001, B-001 | `@` in every live run composer (standalone Agent, Team member, Org member) lists shared standalone Agents, then shared Agent Teams, that are **not in the current run**; no Agent Org; the default chat agent (Daily Assistant) is excluded as in New chat `@`. | UXJ-001, UXJ-004, UXJ-005; VIS-001, VIS-008, VIS-011, VIS-014 |
| REQ-002, AC-002 | Choosing an option writes `@Name ` into the text and shows a removable chip above the text; the sent user message shows `@Name` as an inline chip; the message goes to the focused agent. | UXJ-001; VIS-003, VIS-004 |
| REQ-003, REQ-013, AC-003, AC-015, D-R2 | The collaborator is added when the user sends the `@` message: one instance per definition and run, shown under the run with the product's existing task rows, Offline until its first message; it uses the run's runtime, model and workspace (not shown as extra text). The focused agent reaches it with `send_message_to` by address (`/product team`, `/computer use agent`); no `delegate_task`. | UXJ-001–UXJ-005; VIS-015, VIS-004, VIS-006, VIS-009, VIS-012 |
| REQ-005, AC-004 | The briefing is an ordinary message: a Team/Org tab row (from the focused agent to the collaborator) and the first message of the collaborator's conversation. No system task notice for collaborators. Every agent-to-agent message in a conversation shows its sender with the existing "From <sender>:" style (RD-004; product-wide). | UXJ-002; VIS-004, VIS-005, VIS-009, VIS-010, VIS-012, VIS-013 |
| REQ-006, AC-005, SC-005 | Anything already in the run (members, the run's own team, Org members/teams, collaborators already brought in) is not offered, so a second copy cannot be requested from the menu. | UXJ-001 step 8; VIS-001, VIS-008, VIS-011 |
| REQ-007, AC-006, SC-006, D-R1 | Adding is checked when the user sends. If it fails: nothing is added, the message is not sent, no agent turn starts, the draft text and chips stay in the composer, and the red notice above the composer says so; the tree is unchanged. | UXJ-003; VIS-007 |
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
- Failure notice (shown on send; the draft and chips stay in the composer below it): above the composer, full composer width, `red-50` fill, `red-200` border, radius `lg`, padding 0.5rem 0.75rem; warning icon 16px `red-500`; title 0.875rem medium "Couldn’t add <name> to this run"; detail 0.75rem `red-700` "<reason> Nothing was added."; dismiss × (`red-400`, hover `red-100` / `red-700`). `role="alert"`. It is replaced on the next send in that conversation.
- Success has no notice: the run tree shows the result.
- Agent-to-agent messages in a conversation (RD-004, product-wide): the existing `InterAgentMessageSegment` — 16px speech-bubble icon `slate-500`, label "From <Sender>:" (`slate-600` medium; sender name in readable title case), Markdown content 0.9375rem / 1.75rem leading `slate-800`, expandable details toggle on the right. It sits inside the receiving agent's message block, as the existing layout does. Replaces the user-style rendering of `send_message_to` deliveries.
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

UXJ-001 (VIS-001, VIS-002, VIS-003, VIS-004, VIS-006): 1. Open a Team run and focus a member (e.g. researcher). 2. Type `@` at a word start: the menu opens above the composer listing only Agents and Teams not in the run. 3. Typing filters by name or id; no match shows the empty state; Enter with no match does nothing; Escape closes the menu and keeps the text. 4. ↑/↓ move, Enter/Tab or click chooses: the `@query` token becomes `@Name ` and a chip appears. 5. Removing the chip keeps the words and drops the mention (`@Name` → `Name`); deleting the `@Name` text removes the chip. 6. Send (Enter): adding is checked; the composer clears; the collaborator (task Team row, opened once, members listed) appears under the run at once, Offline. The user message shows the inline `@Name` chip; the focused agent turns Running, says "I'll brief Product Team on this.", shows a `send_message_to` card to `/product team`, then confirms. The Team tab shows the briefing row "to product prototyper". 7. The collaborator's coordinator receives the briefing ("From Researcher:"), turns Running, works, and reports back with `send_message_to`; the report appears in the Team tab and as "From Product Prototyper:" in the focused agent's conversation. 8. Typing `@Product Team` again shows the empty state: it is in the run now and is not offered.

UXJ-002 (VIS-005): click a collaborator row (an Agent, or a Team member; a Team row opens its coordinator). The center shows its conversation: the briefing first, as an agent-to-agent message ("From Researcher:" …), then its work. The composer placeholder names it; a sent message goes to it and is answered.

UXJ-003 (VIS-007): mention a collaborator that cannot run with the run's settings and send. Adding fails on send: the message is not sent, no agent turn starts, nothing is added, the draft text and chip stay in the composer, and the red notice appears above it. The user can edit the draft (for example remove the chip) and send again. Dismiss with ×, or it is replaced on the next send.

UXJ-004 (VIS-008–VIS-010): Workspaces → `prototype-workspace` → `Product Launch Org` → run → `analyst`. Same menu (the Org, its members and its teams are not offered) and same send behavior. Task rows appear under the Org run after the configured members; the Org tab lists later messages; a task Agent can be opened and messaged.

UXJ-005 (VIS-011–VIS-013): Workspaces → `prototype-workspace` → `Research Assistant` → run (or send a first message from Chat). Same menu (the run's own agent is not offered) and send. Task rows appear under the run row; a "Team" tab appears in the right panel. Clicking a task row opens it (header = its name); clicking the run row returns to the run's own agent.

## Screen And Surface Specification

| Surface ID | Purpose | Entry | Structure | States | Actions | Visual IDs |
| --- | --- | --- | --- | --- | --- | --- |
| UIS-001 | `@` menu | `@` at a word start in a live-run composer | header, grouped options, footer | options, filtered, empty, small window | choose, move, close | VIS-001, VIS-002, VIS-008, VIS-011, VIS-014 |
| UIS-002 | Mention chip row | an option chosen | chips above the textarea | one or more chips | remove chip | VIS-003 |
| UIS-003 | Sent message mention | message sent | inline chip in user message | — | — | VIS-004 |
| UIS-004 | Task rows in the run tree | collaborator brought in | task Agent row; task Team row with members | Offline/Initializing/Running/Idle | select, expand/collapse | VIS-004, VIS-006, VIS-009, VIS-012 |
| UIS-005 | Collaborator conversation | collaborator row selected | header, briefing ("From <sender>:"), work, composer | idle, running | send | VIS-005, VIS-010, VIS-013 |
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
| TR-006 | composer with chip | Send (adding succeeds) | composer clears; collaborator row added, Offline; message with inline chip; focused agent Running | UXJ-001 step 6 |
| TR-007 | agent turn | `send_message_to` to the collaborator | Team/Org tab briefing row; collaborator receives "From …" message; its status Offline → Running → Idle | UIS-004, UIS-006 |
| TR-008 | composer with chip | Send (adding fails) | red notice; draft and chip stay; no message, no turn, no row | UIS-007 |
| TR-009 | collaborator | `send_message_to` back | Team/Org tab row "from <collaborator>" | UIS-006 |
| TR-010 | tree | click task row | center shows the collaborator | UIS-005 |
| TR-011 | tree (standalone Agent run) | click run row | center shows the run's own agent | — |

## State Behavior

| Surface / State | Trigger | Presentation | Actions | Visual |
| --- | --- | --- | --- | --- |
| Menu, nothing matches | query matches no candidate | "No agents or teams match" + "Agent Orgs can’t be mentioned." | edit, Escape | VIS-002 |
| Menu, everything in the run | all candidates already in the run | empty state as above | Escape | — |
| Task row statuses | collaborator status | solid dot: offline gray, initializing amber pulse, running blue pulse, idle green, error red | select | VIS-006 |
| Add failed on send | collaborator cannot run | red notice; draft and chips kept; no row, no message | edit and resend, dismiss | VIS-007 |
| Collaborator before first contact | just added | row with Offline (gray) dot | select | VIS-015 |

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
- Agent-to-agent message label: "From <Sender>:" (existing `InterAgentMessageSegment` copy). Prototype briefing prose ("The user asked: …") is illustrative; the focused agent writes the briefing.

## Data, Contract, And Mock Boundaries

| Boundary | UI dependency | Prototype behavior | Production behavior required / unknown |
| --- | --- | --- | --- |
| Catalog for `@` | shared Agent and Team definitions; what is in the run | store definitions + illustrative `Product Team`, `Marketing Team`, `Computer Use Agent`, `Code Reviewer` (live-run menu only) | server/catalog source; in-run set per run kind |
| Mention delivery | focused agent receives the text + mentioned definition identity | local script plays the turn | REQ-002 delivery contract (Solution Designer) |
| Collaborator entry | one collaborator per definition and run, with identity, execution IDs and inherited launch settings | added locally at send through the task-execution rows of each run kind (prototype registry supplies the source) | server collaborator entry (SR-008: run IDs stored in `collaborators`, started on first message) and address resolution for `send_message_to` |
| Task execution events | tree rows, statuses | `TASK_EXECUTION_STARTED` into the Team view; Org view rebuilt locally; standalone Agent run children held locally | Org and standalone Agent runs need a server model for children (F-001, F-005) |
| Team/Org tab messages | later `send_message_to` exchanges | local `TEAM_COMMUNICATION_MESSAGE` / Org communication events | existing communication projection |
| Failure | admission check on send + reason | scripted for `Marketing Team`; send blocked locally | server admission validates runnability before the message is accepted (D-R1) |
| Agent prose, timings, timestamps | — | scripted, illustrative | — |

## Final Visual Reference Inventory

All in `visual-references/` (SHA-256 in `visual-references/manifest.json`), captured from the production build after approval.

| Visual ID | Journey / Surface / State | Viewport | Image | Requirements-defining details | Illustrative |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 / UIS-001 menu open in a Team run | 1512x952 | `VIS-001-team-run-at-menu-1512x952.png` | menu frame, position above composer, header, groups, rows, footer, only out-of-run candidates | definition names/descriptions |
| VIS-002 | UIS-001 empty | 1512x952 | `VIS-002-team-run-at-menu-empty-1512x952.png` | empty text and Org note | — |
| VIS-003 | UIS-002 chip | 1512x952 | `VIS-003-team-run-composer-mention-chip-1512x952.png` | chip styling and placement; inline `@Name`; no hint line | typed text |
| VIS-004 | UXJ-001 after send | 1512x952 | `VIS-004-team-run-collaborator-briefed-1512x952.png` | inline mention in message; `send_message_to` card; "From Product Prototyper:" report; collaborator rows; Team tab briefing row and report row | agent prose, times |
| VIS-015 | UXJ-001 right after send | 1512x952 | `VIS-015-team-run-collaborator-offline-on-send-1512x952.png` | collaborator Team and members in the tree, Offline, before the briefing | prose |
| VIS-005 | UIS-005 collaborator member | 1512x952 | `VIS-005-team-run-task-member-conversation-1512x952.png` | briefing as "From Researcher:" at top, no task notice; composer to the member | prose |
| VIS-006 | UIS-004 task Agent + task Team | 1512x952 | `VIS-006-team-run-task-agent-and-task-team-1512x952.png` | task rows: markers, no "Started by", straight branch line, dashed outlines | names |
| VIS-007 | UXJ-003 failure on send | 1512x952 | `VIS-007-team-run-add-failed-notice-1512x952.png` | notice styling/text; draft and chip kept; no new message or turn; no row added | reason text |
| VIS-008 | UXJ-004 menu in Org run | 1512x952 | `VIS-008-org-run-at-menu-1512x952.png` | Org, members, teams not offered; footer names analyst | names |
| VIS-009 | UXJ-004 collaborator rows + Org tab | 1512x952 | `VIS-009-org-run-task-agent-and-task-team-1512x952.png` | Org collaborator rows (initials marker, no "Started by"); `send_message_to` cards; "From …" reports; Org tab briefing and report rows | prose, times |
| VIS-010 | UXJ-004 collaborator Agent open | 1512x952 | `VIS-010-org-run-task-agent-conversation-1512x952.png` | briefing as "From Analyst:"; live composer | prose |
| VIS-011 | UXJ-005 menu in Agent run | 1512x952 | `VIS-011-agent-run-at-menu-1512x952.png` | own agent not offered; footer names Research Assistant | names |
| VIS-012 | UXJ-005 collaborator rows + Team tab | 1512x952 | `VIS-012-agent-run-task-agent-and-task-team-1512x952.png` | collaborator rows under the run row; Team tab with briefing and report rows | prose, times |
| VIS-013 | UXJ-005 collaborator Agent open | 1512x952 | `VIS-013-agent-run-task-agent-conversation-1512x952.png` | briefing as "From Research Assistant:"; header titled by its name; run row not highlighted | prose |
| VIS-014 | UIS-001 small window | 1024x640 | `VIS-014-team-run-at-menu-small-window-1024x640.png` | menu stays in the window above the composer | — |

## Linked Prototype Evidence

- Runnable prototype: canonical repository root (`corepack pnpm dev --port 3210`), normal entry `/`.
- Prototype ticket record: `prototype-ticket.md`; change history `prototype-change-log.md` (PC-028–PC-032; PC-001–PC-027 in `tickets/done/cross-scope-agent-mentions/`).
- Behavior matrix: `ui-behavior-test-matrix.md`; validator `prototype/scripts/validate-cross-scope-agent-mentions.mjs`; capture `prototype/scripts/capture-cross-scope-agent-mentions-final.mjs`.
- Review evidence (non-normative): `review-evidence/round-1`, `round-2`, `final-validation/`.
- Mock boundaries: `/Users/normy/autobyteus_org/autobyteus-web-prototype/mock-boundaries.md` ("cross-scope-agent-mentions: local run").

## Implementation Fidelity Boundary

- Must preserve: all behavior in the journeys and transitions above; the listed strings; the menu, chip, inline-mention and notice styling; the task-row changes (no visible starter line, member marker for task Agents, centered marker, straight branch line); "not offered when already in the run"; add on send with Offline until first message; briefing by `send_message_to` as an ordinary message (Team/Org tab row + "From <sender>:" in the conversation); blocked send on failure with the draft kept; no success notice.
- Prototype-only: `prototype/run-mentions/*` (browser state, drivers, script), plugin hooks, the collaborator-source hooks in execution/hydration/index code, the resumed-run flags, the scripted chat reply, and the fixture correction that lists the stored standalone Agent run. None prescribes production architecture.
- May vary: agent prose, fixture names and descriptions, timestamps, run IDs, timings.
- Existing design-system constraints: reuse the composer, popover, tree rows, message list and segment components.

## Out Of Scope

The first message of a launch draft (New chat `@` stays the launch-target picker); mentioning Agent Orgs; linking to runs outside the current root; automatic handoff rules; showing inherited settings as extra text; a success notice.

## Open Decisions And Risks

- RD-004 (product-wide, decided): every agent-to-agent message in a conversation shows its sender ("From <sender>:"), not only collaborator briefings; today the product shows `send_message_to` deliveries user-style (live `MEMBER_INPUT_MESSAGE` with `inter_agent_delivery`, and stored role `user`).
- F-001 (requirements/architecture): the client resolves a task execution through a configured member at the same address (Team: `createTeamAgentContext`, `teamMemberProjectionHydrationService`; Org: `AgentOrgExecutionViewIndex`, `utils/agentOrgHistoryRows.ts`) and the task DTOs carry no definition identity or launch settings. A non-mounted collaborator needs both from the server.
- F-005 (requirements/architecture): a standalone Agent run has no collaboration root today (no children, no Team tab). The approved presentation (task rows under the run row, Team tab once a child exists) requires that model.
- Extra copies via `delegate_task` remain ordinary delegated children with the existing presentation (unchanged in this revision).
- Task-row changes (no visible "Started by", member marker, alignment) apply to every delegated child in the product, not only mention-added ones.
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
