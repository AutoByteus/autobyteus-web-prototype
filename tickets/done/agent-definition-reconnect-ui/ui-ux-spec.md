# UI/UX Specification — Reconnect a run to an agent

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: Product ticket `agent-definition-reconnect-ui`; package `run-continuity-after-agent-definition-rename`
- Related requirements revision ID: `SR-009` (Solution Designer)
- Related IDs: REQ-001, REQ-002, REQ-003, REQ-004, REQ-007; AC-001, AC-002, AC-004, AC-006, AC-009 (rev SR-009), AC-010; DEC-002, DEC-004, DEC-005, DEC-010, DEC-011, DEC-012, DEC-013; BEH-003, BEH-004, BEH-005; SCN-001
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL (during review): `http://127.0.0.1:3291/workspace`
- Explicit user-confirmation reference: user, 2026-10-07, after round 5: "i am fine with the UI"; the user then asked for a Solution Designer logic check ("But i am not sure whether solution designer thinks the logic is correct or not"). Solution Designer logic review (`product-logic-review-response.md` in the request folder): 2 corrections (L1, L5) and 3 clarifications (L3, L10, live-only grey line), applied in round 6 without changing the accepted look. The only visible additions are the "· N runs" count and the rejection messages, both requested by that review. After confirmation, the missing-agent text was allowed to wrap instead of truncating in narrow windows (no change on desktop).
- Final validation date: 2026-10-07

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo` (read only)
- Selected frontend: `autobyteus-web`; current Reconnect build read from `/Users/normy/autobyteus_org/autobyteus-worktrees/run-continuity-after-agent-definition-rename/autobyteus-web` (base `5316a0cad`)
- Pinned source commit: baseline `origin/personal@10fb695` (WEB-BASELINE-REFRESH-007) plus accepted design tickets since; drift check of every touched component recorded in `product-ticket.md`
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (branch `personal`)
- UI reference revision: ticket branch `design/agent-definition-reconnect-ui`; integration revision recorded in `product-ticket.md`
- Ticket folder: `tickets/done/agent-definition-reconnect-ui/`
- Baseline report path: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md`

## Problem And Design Rationale

- User problem and intent: when an agent folder is renamed or removed, its runs cannot continue. The delivered Reconnect worked, but the user found its UI poor: a generic red "An Error Occurred" card, a yellow box at the top of Settings, a long dialog, and nothing visible before sending.
- Key UX decisions:
  - Show the problem before the user sends anything: one amber line above the message box with Reconnect, and a small ⚠ in the Workspaces tree.
  - Every surface is one short line with the action on the right (user, round 2: "too much texts? and the UI could be cleaner"). Same look in chat and in Settings (rounds 3–5). 13 px text (round 5).
  - Only one Reconnect visible at a time: after a failed send the error line carries it, and the composer line hides.
  - Picker in the product's dialog frame with the agent switcher's rows; "Similar names" first; nothing preselected.
  - Success shown in place (dialog closes): green line, renamed rows and header, run listed under the new agent.
- Alternatives considered and rejected:
  - Disable Send while the agent is missing: the server stays the authority (AC-001/AC-010 unchanged).
  - Popover picker that reconnects on click: Reconnect is not offered again after success (AC-006), so a confirm step is needed.
  - Grouping the picker by source: search plus a team badge is enough.
  - Success message inside the dialog with Done: the real outcome is visible in place.
  - Explanatory paragraphs (round 1): removed at the user's request.
  - "Remove from run" when there is no replacement agent: out of scope (L10); a standalone run can be archived/deleted with the existing row actions.

## Scope And Experience Goal

- User: a person continuing an older run whose agent folder was renamed or removed.
- Context: Workspaces tree, run conversation (standalone or team member / collaborator / delegated copy), run Settings (⚙).
- Goal: notice the problem, pick the agent to continue with, and continue the same conversation.
- Observable success: after Reconnect, the next message continues the same conversation; the run is listed under the new agent (standalone) or the collaborator row reads the new agent's name (DEC-012).
- In-scope surfaces: composer line, conversation error line, Reconnect dialog, success line, Settings lines and member prefix, Workspaces tree markers and names.
- Non-goals: renaming/aliasing agents, auto-guessing, removing members/collaborators, persisting reconnect feedback in history, dark theme (see Visual Language).

## Related Requirements And Acceptance Criteria

| ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-001, AC-001 | A specific "Agent X no longer exists" state with Reconnect, not a generic error | UXJ-001, UXJ-002; UIS-001, UIS-002; VIS-001, VIS-002 |
| AC-010, DEC-013 | The error line with Reconnect stays in the member's conversation | UXJ-002, UXJ-005; VIS-002, VIS-014 |
| REQ-002 | Reconnect from the error and from the run's configuration; any available agent | UIS-002, UIS-004, UIS-003; VIS-003, VIS-010, VIS-011 |
| AC-004, DEC-004 | No pre-disable; server rejections shown in the dialog | TR-007–TR-010; VIS-016, VIS-017 |
| REQ-003, DEC-005, AC-006 | Only the reference changes; standalone run listed once under the new agent; Reconnect gone after success | UXJ-003; VIS-006, VIS-007 |
| REQ-004, DEC-010 | Per-run note when instructions apply only from a new session (Antigravity, Grok) | UXJ-004; VIS-012, VIS-013 |
| REQ-007, DEC-011, DEC-012, AC-009 rev | Collaborator row and header read "product video producer"; configured member keeps "editor" | UXJ-005; VIS-013, VIS-015 |
| BEH-004 | No "+" (new run) on a Workspaces group whose agent is gone | UIS-006; VIS-001 |

## Visual Language

- Existing product language to preserve: the notice above the message box (`CollaboratorAddFailureNotice`), the run-settings panel, the agent switcher rows (`ChatTargetSwitcher`), the product dialog frame (`ProjectDialogFrame`), Workspaces tree rows. Everything outside the changed elements is unchanged.
- Layout and hierarchy: one-line bars sit directly above the message box (8 px gap, `mb-2`), in the conversation after the failed message (`my-3`, message column width), and under the run name in Settings (`-mt-1 mb-4`, 8 px between bars).
- Bars (composer, conversation error, Settings): `rounded-lg` (8 px), 1 px border, padding `py-1.5 pl-3 pr-1.5`, gap 8 px, icon 16 px, text 13 px (`text-[0.8125rem]`) weight 400, action 13 px weight 500 with `px-2 py-1 rounded-md` and a hover fill. Text wraps (never truncated) when narrow.
- Colors and roles (Tailwind):
  - Missing (warning): `border-amber-200 bg-amber-50 text-amber-900`, icon `exclamation-triangle-20-solid` `text-amber-500`, action `text-amber-900 hover:bg-amber-100`.
  - Error in conversation: `border-red-200 bg-red-50 text-red-800`, icon `exclamation-circle-20-solid` `text-red-500`, action `text-red-800 hover:bg-red-100`.
  - Success: `border-emerald-200 bg-emerald-50 text-emerald-900`, icon `check-circle-20-solid` `text-emerald-500`, secondary parts ("· 2 runs", "· instructions apply from a new session") `text-emerald-700`, dismiss × `text-emerald-500 hover:bg-emerald-100`.
  - Resolved error (history): no box, 13 px `text-gray-500`, icon 16 px `text-gray-400` (check while live, exclamation-circle after reopening).
  - Tree marker: `exclamation-triangle-20-solid`, 14 px (`h-3.5 w-3.5`), `text-amber-500`, 6 px left of it (`ml-1.5`).
  - Settings member prefix: "Agent missing" `text-xs font-medium text-amber-700` + `·` `text-gray-300`, before the existing summary (same pattern as "Customized ·").
- Dialog: overlay `bg-slate-900/40`; panel `max-w-lg` (512 px), `rounded-2xl`, `shadow-xl`, max height `min(40rem, 90vh)`; header `px-6 pb-4 pt-5` with title 18 px semibold `slate-900` and one line 14 px `slate-500` (truncate); search row `px-6 py-2.5`, 16 px magnifier `gray-400`, borderless 14 px input; list `px-3 py-2`, min height 192 px, scrolls; section labels 11 px medium `gray-400`; rows `rounded-lg px-2 py-1.5`, gap 10 px: 28 px initials circle (`border-emerald-200 bg-emerald-50`, 10 px semibold `slate-600`), name 13 px medium `gray-900`, folder id 12 px `gray-500`, team badge `rounded-full bg-violet-50 px-1.5 text-[10px] font-semibold text-violet-700`, selected `bg-blue-50 ring-1 ring-inset ring-blue-200` + 16 px `check` `text-blue-600`, hover `bg-gray-50`; footer `border-t border-slate-100 bg-slate-50 px-6 py-4`: error 12 px `text-red-600` with 14 px triangle on the left, Cancel (white, `border-gray-300`) and Reconnect (`bg-blue-600`, disabled `bg-blue-300`).
- Dark theme: N/A. The product has no app-wide dark theme on these surfaces (Tailwind `darkMode` not configured; run settings, tree and chat menus are light only). The old error card's stray `dark:` classes are not carried over.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Composer reconnect line | Missing-agent line and one-time success line above the message box | missing; hidden while the newest item is the missing-agent error; reconnected (+ count, + instructions note) | `components/workspace/reconnect/AgentReconnectComposerNotice.vue` |
| Missing-agent error line | `AGENT_DEFINITION_MISSING` in the conversation | open (red, Reconnect); resolved live (grey, "X reconnected to Y"); resolved after reopen (grey "Agent X no longer exists", no action) | `components/conversation/segments/AgentMissingErrorCard.vue` (via `ErrorSegment.vue`) |
| Reconnect dialog | Pick the agent | default (Similar names + All agents); search; no match; selected; reconnecting; four rejections | `components/workspace/reconnect/ReconnectAgentDialog.vue` |
| Settings reconnect lines | One bar per missing agent record of the run; success bar | missing; reconnected (+ count, + instructions note) | `components/run-settings/ExistingRunSettings.vue` |
| Member row prefix | "Agent missing ·" on a configured member row | missing / not | `components/run-settings/RunMemberRow.vue` |
| Tree markers and names | ⚠ on group / member / collaborator / copy rows; no "+" for a missing group; DEC-012 names | missing; reconnected | `WorkspaceHistoryWorkspaceSection.vue`, `WorkspaceStableExecutionRow.vue`, `WorkspaceTransientExecutionRow.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Opens a standalone run whose agent is gone | Tree group shows ⚠, no "+" | Reconnect before sending | Green line; run listed under the new agent | REQ-001, REQ-002, REQ-003, DEC-005 |
| UXJ-002 | Sends to the run anyway | Missing state | Recover from the error | Error line → Reconnect → grey "reconnected" line | AC-001, AC-010 |
| UXJ-003 | Continues after reconnect | Reconnected | Same conversation continues | Reply uses prior context; green line gone | REQ-003, REQ-004 |
| UXJ-004 | Team configured member on Antigravity, via Settings | Settings bar "editor: agent no longer exists" | Reconnect the member | Green bar with "· instructions apply from a new session"; member keeps "editor" | REQ-002, REQ-004, DEC-010, DEC-011 |
| UXJ-005 | Team collaborator with a delegated copy | Error line in the collaborator's conversation | Reconnect from the error | "Reconnected to Product Video Producer · 2 runs"; both rows "product video producer" | AC-009 rev, DEC-012, L3 |
| UXJ-006 | Server rejects | Dialog open with a selection | Understand and retry | Message in the footer; dialog stays open | AC-004, L5 |

## Journey Details

- UXJ-001: open prototype-workspace → Tutorial Video Producer ⚠ → run. The amber line shows above the message box (VIS-001). Click Reconnect → dialog (VIS-003): title, "Replaces tutorial-video-producer. History and session are kept.", search focused, nothing selected. Pick Product Video Producer (VIS-005) → Reconnect → dialog closes; green "Reconnected to Product Video Producer"; header avatar PV; the tree lists the run once under Product Video Producer; the old group and its ⚠ disappear (VIS-006).
- UXJ-002: send a message → the user's message is shown, then the red line "Agent tutorial-video-producer no longer exists · Reconnect"; header status Error; the composer line hides (VIS-002). Reconnect → same dialog → the red line becomes grey "tutorial-video-producer reconnected to Product Video Producer"; status Offline (VIS-006). Reopened later, the error shows as grey history "Agent tutorial-video-producer no longer exists" without an action (VIS-008).
- UXJ-003: send again → normal reply with prior context; the green line ends with this message (VIS-007).
- UXJ-004: TEAMS → Video Team → run → editor ⚠ → amber line (VIS-009) → ⚙ → Settings bars for every missing record (editor, tutorial video producer) and "Agent missing ·" on editor (VIS-010) → Reconnect on editor → dialog names "editor · replaces video-editor…" (VIS-011) → Video Clip Editor → green bar "editor reconnected to Video Clip Editor · instructions apply from a new session" (VIS-012). In editor's conversation: green line with the same note (VIS-013).
- UXJ-005: tutorial video producer → send → red line (VIS-014) → Reconnect → Product Video Producer → green "· 2 runs"; collaborator and delegated-copy rows read "product video producer" with PV initials; header "product video producer" (VIS-015).
- UXJ-006: see TR-007–TR-010 (VIS-016, VIS-017).

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Composer reconnect line | Any run conversation whose agent is missing | Reconnect before sending | One bar above the message box | VIS-001, VIS-006, VIS-013, VIS-015, VIS-018 |
| UIS-002 | Conversation error line | After a failed restore | Reconnect from the error | One bar in the agent's message column | VIS-002, VIS-014, VIS-006, VIS-008 |
| UIS-003 | Reconnect dialog | Reconnect on any surface | Choose the agent | Header, search, Similar names, All agents, footer | VIS-003, VIS-004, VIS-005, VIS-011, VIS-016, VIS-017 |
| UIS-004 | Settings lines | ⚙ of the run | Reconnect each missing record | Bars under the run name; member prefix | VIS-010, VIS-012 |
| UIS-005 | Run header | Run view | Name follows the record | Avatar initials and name (collaborator: row name) | VIS-006, VIS-015 |
| UIS-006 | Workspaces tree | Left panel | See broken runs before opening | ⚠ after names; no "+" on a missing group | VIS-001, VIS-009, VIS-015 |

## Interaction And State Transitions

| Transition ID | Surface / From State | Trigger | Immediate Feedback | Resulting State | Side Effect | Next Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Run opened, agent missing | Open | Amber line; tree ⚠ | Missing | — | Reconnect, type, send |
| TR-002 | Missing | Send | User message, then red error line; status Error; composer line hidden | Error shown | Server cannot restore | Reconnect |
| TR-003 | Any Reconnect | Click | Dialog, search focused, nothing selected | Picking | — | Search, ↑/↓, click, Esc |
| TR-004 | Picking | Choose + Reconnect / Enter / double-click | Button "Reconnecting…", controls disabled | Waiting | Server rebinds the record | — |
| TR-005 | Waiting | Success | Dialog closes; green line(s); names, header, tree update; error line grey | Reconnected | Record + inheriting copies changed | Send, × |
| TR-006 | Reconnected | Next message or × | Green line removed | Normal run | — | — |
| TR-007 | Waiting | AGENT_RUN_ACTIVE | Footer: "{name} is running. Stop it, then reconnect." | Picking (selection kept) | none | Retry, Cancel |
| TR-008 | Waiting | AGENT_DEFINITION_REBIND_PENDING | Footer: "Reconnect is still finishing. Try again." | Picking | none | Retry |
| TR-009 | Waiting | RUN_ACTIVE | Footer: "This run is in use by another workflow. Stop it, then reconnect." | Picking | none | Retry, Cancel |
| TR-010 | Waiting | DEFINITION_NOT_FOUND | Footer: "{agent} no longer exists. Choose another agent."; list refreshed without it; selection cleared | Picking | none | Choose another |
| TR-011 | Waiting | Other failure | Footer: "Couldn’t reconnect: {reason}" | Picking | none | Retry, Cancel |
| TR-012 | Resolved error line | Run reopened | Grey "Agent X no longer exists", no action | History | — | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Missing (rule) | Record's agent id not in the catalog AND exact `agentDefinition(id)` lookup finds nothing (L1). Org-/Application-owned agents absent from the catalog are not missing. | Composer line, tree ⚠, Settings bar | Reconnect | — | VIS-001 |
| Composer line hidden | Newest conversation item is the missing-agent error | Only the error line shows Reconnect | Reconnect on the error | — | VIS-002 |
| Dialog: no match | Search with no result | "No agents match “{query}”." centered, 14 px gray-500 | Edit search, Cancel | — | VIS-004 |
| Dialog: Similar names | Agents sharing at least half of the missing id's words (folder id + name), max 3, most shared first | Section "Similar names", then "All agents" A–Z | Pick any | — | VIS-003 |
| Success count | More than one run changed | "· {count} runs" after the agent name | × | Next message | VIS-015 |
| Instructions note | A changed run's runtime keeps session instructions (Antigravity, Grok) | "· instructions apply from a new session"; tooltip "{runtime} keeps this session’s instructions. Tools and skills apply now." | × | Next message | VIS-012, VIS-013 |
| Long text / narrow | Narrow window | Bar text wraps; action stays on the right | — | — | VIS-018 |

## Content, Labels, Validation, And Feedback

- Voice: short, factual, no explanations; agent ids as written (no quotes); "Reconnect" (no ellipsis).
- Exact copy (English; zh-CN in `localization/messages/zh-CN/reconnect.ts`):
  - Composer / error line: "Agent {id} no longer exists" · action "Reconnect" · aria "Reconnect {name} to an agent"
  - Resolved line (live): "{id} reconnected to {agent}"; after reopen: "Agent {id} no longer exists"
  - Success: "Reconnected to {agent}" · "· {count} runs" · "· instructions apply from a new session" · tooltip "{runtime} keeps this session’s instructions. Tools and skills apply now." · dismiss aria "Dismiss"
  - Dialog: title "Reconnect to an agent"; line "Replaces {id}. History and session are kept." / "{name} · replaces {id}. History and session are kept."; search "Search agents"; sections "Similar names", "All agents"; badge tooltip "Team-local agent of {team}"; empty "No agents match “{query}”."; buttons "Cancel", "Reconnect", "Reconnecting…"
  - Rejections: see TR-007–TR-011.
  - Settings: "Agent {id} no longer exists" (standalone) / "{name}: agent no longer exists" (tooltip "Agent {id} no longer exists"); success "Reconnected to {agent}" / "{name} reconnected to {agent}" + "· {count} runs" + "· instructions apply from a new session"; member prefix "Agent missing"
  - Tree tooltip / aria: "Agent {id} no longer exists"

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| Agent list | Single choice | Yes | One agent selected | Reconnect stays disabled until a choice | — |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop | 1440×900 reference | As specified | Hover fills on actions |
| Narrow | 390×844 | Bar text wraps; dialog uses full width minus 16 px margins; names in rows truncate | Touch: same actions |

## Accessibility And Keyboard Behavior

- Target: the existing product.
- Focus: opening the dialog focuses search; Esc closes; focus returns to the page.
- Keyboard: ↑/↓ select an agent (wraps; scrolls into view); Enter reconnects the selection; double-click reconnects.
- Roles: missing lines `role="status"`; conversation error and Settings missing bars `role="alert"`; success `role="status"`; dialog `role="dialog" aria-modal` labelled by its title and described by its line; list `role="listbox"`, rows `role="option"` with `aria-selected`; search `role="combobox"` with `aria-activedescendant`; tree marker `role="img"` with its aria label.
- Contrast: amber-900 on amber-50, red-800 on red-50, emerald-900 on emerald-50 at 13 px.

## Motion And Transitions

- Unchanged — follows baseline (no new motion; dialog appears without animation like `ProjectDialogFrame`).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Missing rule | Agent catalog + `agentDefinition(id)` | Catalog store + fixture lookup set (`OWNED_OUTSIDE_CATALOG`) | Exact lookup per id (CR-001 fix in the build) |
| Reconnect call | Result: success + `affectedAgentRunIds` with per-run `instructionsTakeEffect`, or a rejection code | Scripted (`reconnectSimulation.ts`), 450 ms; hidden seed `autobyteus.design.agentReconnect.failNext` for rejections | Server reconnect mutation |
| Affected runs | Count and per-run note | Owner + sourceless copies inheriting it | `affectedAgentRunIds`; catalog-started copies are separate records |
| Failed send | `AGENT_DEFINITION_MISSING` error | Scripted error after the user message | Server restore failure |
| Reconnect feedback | Green line, live grey line | Browser memory | Not persisted (live only) |
| History list | Standalone run under the new agent | Fixture re-read on refresh | DEC-005 history row projection |

## Final Visual Reference Inventory

Folder: `visual-references/`. Fixture content (run summaries, conversation text, agent names other than the missing/target pairs, catalog size, dates, "2d") is illustrative. In VIS-018 the header avatar "A" comes from opening the run by URL in the UI reference (illustrative).

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details |
| --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 missing before send; tree ⚠; no "+" on the group | 1440×900 | `visual-references/VIS-001-standalone-agent-missing-before-send-desktop-1440x900.png` | Amber line, copy, Reconnect, tree marker |
| VIS-002 | UXJ-002 error line; composer line hidden; status Error | 1440×900 | `visual-references/VIS-002-standalone-missing-agent-error-after-send-desktop-1440x900.png` | Red line, one Reconnect |
| VIS-003 | Dialog default with Similar names | 1440×900 | `visual-references/VIS-003-reconnect-dialog-similar-names-desktop-1440x900.png` | Header line, sections, rows, nothing selected |
| VIS-004 | Dialog no match | 1440×900 | `visual-references/VIS-004-reconnect-dialog-no-match-desktop-1440x900.png` | Empty copy |
| VIS-005 | Dialog with a selection | 1440×900 | `visual-references/VIS-005-reconnect-dialog-agent-selected-desktop-1440x900.png` | Selected row, enabled Reconnect |
| VIS-006 | Reconnected live; grey resolved line; run moved | 1440×900 | `visual-references/VIS-006-standalone-reconnected-live-desktop-1440x900.png` | Green line, grey line, tree |
| VIS-007 | Continued after reconnect | 1440×900 | `visual-references/VIS-007-standalone-continued-after-reconnect-desktop-1440x900.png` | Green line gone |
| VIS-008 | Reopened: error as grey history | 1440×900 | `visual-references/VIS-008-standalone-reopened-error-history-desktop-1440x900.png` | No action, no "reconnected" text |
| VIS-009 | Team member missing | 1440×900 | `visual-references/VIS-009-team-member-agent-missing-desktop-1440x900.png` | Amber line; ⚠ on editor, collaborator, copy |
| VIS-010 | Settings with missing records | 1440×900 | `visual-references/VIS-010-team-settings-agents-missing-desktop-1440x900.png` | Bars per record; "Agent missing ·" |
| VIS-011 | Dialog for a team member | 1440×900 | `visual-references/VIS-011-reconnect-dialog-team-member-desktop-1440x900.png` | "editor · replaces video-editor…" |
| VIS-012 | Settings after member reconnect (Antigravity) | 1440×900 | `visual-references/VIS-012-team-settings-member-reconnected-antigravity-desktop-1440x900.png` | Green bar with note; editor keeps its name |
| VIS-013 | Member conversation after reconnect (Antigravity) | 1440×900 | `visual-references/VIS-013-team-member-reconnected-antigravity-note-desktop-1440x900.png` | Green line with note |
| VIS-014 | Collaborator error line | 1440×900 | `visual-references/VIS-014-collaborator-missing-agent-error-desktop-1440x900.png` | Red line in collaborator conversation |
| VIS-015 | Collaborator reconnected, 2 runs | 1440×900 | `visual-references/VIS-015-collaborator-reconnected-two-runs-desktop-1440x900.png` | "· 2 runs"; rows and header "product video producer" |
| VIS-016 | Rejection AGENT_RUN_ACTIVE | 1440×900 | `visual-references/VIS-016-reconnect-dialog-agent-running-desktop-1440x900.png` | Footer message, dialog open |
| VIS-017 | Rejection DEFINITION_NOT_FOUND | 1440×900 | `visual-references/VIS-017-reconnect-dialog-agent-removed-refreshed-desktop-1440x900.png` | Message; agent removed from list |
| VIS-018 | Narrow composer line | 390×844 | `visual-references/VIS-018-standalone-agent-missing-narrow-390x844.png` | Text wraps; Reconnect stays right |

## Linked UI Reference Evidence

- Runnable UI reference: design repository `personal`, entry `/workspace`; run `corepack pnpm dev --port 3210` (reload restarts the example).
- Ticket record: `product-ticket.md`; review rounds: `review-round-1.md`, ticket history (rounds 2–6); logic review: `logic-review-request.md` and the Solution Designer's `product-logic-review-response.md`.
- Review scripts: `prototype/agent-reconnect/review-scripts/`.
- Mocked boundaries: see Data, Contract, And Mock Boundaries.

## Implementation Fidelity Boundary

- Must preserve: the copy, sizes, colors, placement, one-Reconnect-at-a-time rule, missing rule (L1), rejection messages (L5), count rule (L3), live-only grey line, DEC-011/012 names, no "+" on a missing group.
- Not prescribed: the UI reference's stores, fixtures, `useAgentReconnect` composable and simulation.
- May vary: illustrative fixture content listed above.
- Design-system constraints: existing Tailwind tokens and heroicons used by the product.

## Out Of Scope

- Removing a member or collaborator from a run (L10; possible separate ticket).
- Persisting reconnect feedback in history.
- Disabling Reconnect before the server answers.
- Dark theme.

## Open Decisions And Risks

- None for this design. The Solution Designer will raise "remove collaborator from run" with the user as a possible separate ticket.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed has a final visual reference: `Yes`
- Every section covers the affected scope or is marked: `Yes`
- Recorded values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality without unintended placeholders or clipping: `Yes`
- Every visible detail is requirements-defining unless marked illustrative: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Paths agree with this specification: `Yes`
