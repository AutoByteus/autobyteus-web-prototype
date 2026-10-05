# UI/UX Specification — run-settings-ui-unification

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `run-settings-ui-unification` (stable package; Product ticket uses the same ID)
- Related requirements revision ID: `SR-001` (draft requirements in the Solution Designer package)
- Related IDs: UC-001..004, SCN-001..005, BEH-001..005, REQ-001..004, QR-001, DEC-001, DEC-002
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL: http://127.0.0.1:4520 (`corepack pnpm dev --port 4520`)
- Explicit user-confirmation reference:
  - 2026-10-05: "Okay, I like this UI. It's now much cleaner right now. I'm satisfied now."
  - Then: "self-validate further … if everything is consistent, then we can finish the tickets."
  - The self-validation is recorded in `review-round-30.md`.
- Final validation date: 2026-10-05

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend: `autobyteus-web`
- Pinned source revision: `origin/personal@10fb695`. Re-checked at finalization: source
  `origin/personal@02d6ddf` has no `autobyteus-web` change since the pin.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Accepted design base: `origin/personal@b4f3ed1` (`WEB-BASELINE-REFRESH-007`)
- UI reference revision: ticket branch `design/run-settings-ui-unification`. The final integration
  revision is recorded in `product-ticket.md`.
- Ticket folder: `tickets/done/run-settings-ui-unification/`
- Baseline report: `ui-baseline-report.md` at the design repository root (accepted refresh 007)

## Problem And Design Rationale

- **User problem.** The chat composer's four controls (workspace, auto-approve, model+runtime,
  thinking) are "very clean and simple". The Agent run form was "not clean, not user-friendly".
  The Team and Org forms were "a super long list of configuration", repeating near-full forms for
  every member.
- **Key decisions.**
  - **DEC-001 → D: every Run opens New chat.** The composer's four controls are the run's
    settings, and the first message starts the run. One configuration surface replaces three forms.
  - **Member customization is secondary.** One quiet line under the composer opens a resizable
    right-side panel that lists members only. The team-wide settings live in the composer, the one
    place to change them.
  - **DEC-002 → member overrides cover model+runtime, thinking and tool approval.** A team placed
    in an Org also has a workspace.
  - **Who you talk to is the page heading.** `@` always means "bring in a collaborator"; it never
    switches the target.
  - **The saved-run settings use the same language as the member panel.** No banners and no
    explanatory sentences: lock icons show what is fixed, a status badge shows the state, and a
    small red stop icon stops a running run.
- **Alternatives considered and rejected.**
  - **A+B+C** (keep the three run panels and restyle them with chat controls): rejected in round 2.
    It kept three surfaces, and the forms stayed long.
  - **Inline member list under the composer** (round 2): replaced by the right-side panel in round 3
    to keep the chat page light.
  - **An editable or read-only "defaults" block at the top of the member panel**: removed in rounds
    12 and 13 to avoid two places to change the same setting.
  - **A boxed and divided member list**, **"Default" tags**, and **muted inherited values**: replaced
    by flat two-line rows with a "Customized" label (rounds 10–16).

## Scope And Experience Goal

- **User:** someone starting or adjusting runs of agents, teams and orgs.
- **Goal:** set the four run settings the same way everywhere. Customize team members only when
  needed. Understand and change a saved run's settings without noise.
- **Observable success:**
  - every Run / "+" lands in New chat with the right heading and settings;
  - member customization takes one line and one panel;
  - the saved-run settings page shows only settings, status, a stop icon and Save.
- **In scope:**
  - New chat for General Agent, Agent, Team and Org;
  - the member settings panel;
  - every Run and "+" entry point;
  - `@` mentions in New chat and in running chats;
  - saved Agent, Team and Org run settings (Edit Config).
- **Non-goals:**
  - mobile paired-phone run setup (`MobileRunSetup`);
  - Applications launch profiles;
  - the chat transcript;
  - the workspace tree layout;
  - backend behaviour.

## Related Requirements And Acceptance Criteria

| ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| UC-001 / SCN-001 / BEH-001 | Agent Run → New chat addressed to the agent; the four controls; the first message starts the run | UXJ-001, UIS-001 |
| UC-002 / SCN-002 / BEH-002 | Team Run → New chat; optional member customization in the panel; the first message launches the Team with its overrides | UXJ-002, UXJ-004, UIS-001, UIS-002 |
| UC-003 / SCN-003 / BEH-003 | Org Run → New chat; member panel with placed teams (workspace + model/thinking/approval) and their members | UXJ-003, UXJ-004, UIS-002 |
| UC-004 / SCN-004 / BEH-004 | Saved run settings: fixed values locked, model/thinking editable when stopped, stop icon while running, Save bar only after a change, refresh and model-unavailable states | UXJ-006, UIS-003 |
| SCN-005 / BEH-005 | Chat composer controls are the reference and are reused everywhere | All |
| REQ-001 | The four decisions are presented with the same controls on every surface | UIS-001..003 |
| REQ-002 | Member customization is compact; customized members are labelled "Customized"; inherited values are not repeated as forms | UIS-002 |
| REQ-003 | No raw member addresses (such as `/`) in user-facing copy | All copy below |
| REQ-004 | Lock/edit semantics preserved without banners: lock icons, a status badge, one line only where nothing else shows the state | UIS-003 |
| QR-001 | All controls are keyboard-operable with accessible names | Accessibility section |
| DEC-001 | Decided: D (Run opens chat) | — |
| DEC-002 | Decided: model+runtime, thinking, approval; placed teams add workspace | UIS-002 |

## Visual Language

- **Existing product language to preserve:**
  - the chat composer (white rounded box, thin `gray-200`/`gray-300` border);
  - its footer controls `ChatWorkspaceMenu`, `ChatApprovalToggle`, `ChatModelMenu` and
    `ChatThinkingControl`, unchanged in look;
  - the product's Tailwind gray/blue/indigo palette and Inter-based type.
- **Layout:**
  - New chat centres the target name as a page heading (`h1`, 28 px `sm`, semibold, tracking-tight),
    with the composer below it and one members line under the composer.
  - The member panel is a right-side drawer over the page. On `lg` and wider, the page pads itself
    by the drawer's width so the composer stays visible.
  - Saved-run settings stack a header (icon + name + status badge [+ stop icon]), one settings card,
    an optional single note line, a "Members" list and a sticky Save bar.
- **Spacing and density:**
  - setting rows are at least 36 px tall, with a 96 px label column (`w-24`);
  - member rows have a 32 px avatar and two lines (name 14 px medium; summary 12 px);
  - the list gap is 6 px (`space-y-1.5`);
  - an opened member card has `px-3`, with its settings indented to the name column (`pl-[3.25rem]`).
- **Typography and colour:**
  - setting labels are `gray-900`, 13 px;
  - values use the composer's weights: model `gray-800` medium, runtime `gray-400`, approval and
    workspace `gray-600`;
  - member summary lines are `gray-600`;
  - "Customized" is `blue-700` medium;
  - the members line is `gray-400`, with blue `blue-700` links.
- **Surfaces:**
  - the settings card and an opened member are `rounded-xl` with a `gray-200` border, a white
    background and `shadow-sm`, with no row dividers;
  - closed member rows have no border and a `gray-50` background on hover;
  - the drawer is white with a left `gray-200` border, a soft left shadow, a header bottom border,
    and a `gray-50` footer with a single indigo "Done" button.
- **Badges:**
  - Coordinator: `rounded-full bg-gray-100 text-gray-600`, 11 px;
  - status Running: `bg-emerald-50 text-emerald-700` with an `emerald-500` dot;
  - status Stopped: `bg-gray-100 text-gray-600` with a `gray-400` dot.
- **Icons (heroicons):**
  - `user-group` for teams and `building-office-2` for orgs;
  - initials in a 32 px `emerald-50` circle with an `emerald-100` ring for agents;
  - `lock-closed` 12 px `gray-300`/`gray-400` for fixed values;
  - `stop-20-solid` 16 px `red-500` for stop;
  - `arrow-uturn-left-solid` for a member reset.
- **States:**
  - hover: `gray-50`/`gray-100` backgrounds; the stop icon gets `red-50` and `red-600`;
  - focus: `ring-2` in `blue-500/40` (`red-500/40` for stop);
  - disabled: opacity 60 %;
  - an Antigravity model locks Tool approval (lock icon, no hover).

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| New chat heading | Target identity | General Agent (+ `/` `@` hint), Agent (avatar only when one exists), Team, Org | `components/chat/ChatNewSurface.vue` |
| Members line | Entry to member customization | "All N members use these settings · Customize members" / "● N of M customized · Edit · Reset" | `components/run-settings/ChatTargetMembers.vue` |
| Member settings drawer | Customize members | Closed / open; resizable 400–960 px (≥360 px left for the page), remembered; full width < `sm` | `ChatTargetMembers.vue` |
| Member row | One member or placed team | Closed / hover / opened card; Customized; "N customized" for teams; model required (amber "Choose a model"); nested members under "MEMBERS" | `components/run-settings/RunMemberRow.vue` |
| Settings rows | Workspace / Model / Thinking / Tool approval | Editable (chat controls), locked (value + lock), thinking unavailable, Antigravity approval lock, per-field "Reset" for a customized field | `components/run-settings/RunSettingsCard.vue` |
| Members list | Rows + optional heading + "Reset all" | Panel (no heading, rows bleed into padding); saved run ("Members" heading, aligned with the card) | `components/run-settings/RunMembersSection.vue` |
| Saved-run settings | Edit Config for Agent / Team / Org runs | Running (stop icon), stopped (editable), read-only, refresh required, model unavailable, unsaved → Save bar, saved feedback | `components/run-settings/ExistingRunSettings.vue`, `RunSubjectHeader.vue` |
| Model menu (saved run) | Change the model within the run's runtime | Search + runtime label with lock + that runtime's models | `components/chat/ChatModelMenu.vue` (`runtimeLocked`) |
| `@` menu | Bring a collaborator into the run | Single mode: "Bring into this run", footer "{agent} gets your message and brings them into this run"; current target excluded | `components/chat/ChatTargetMenu.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | User on Agents (list or detail) | Agent defined | Start an agent run | New chat for the agent; first message starts the run | UC-001, SCN-001 |
| UXJ-002 | User on Agent Teams | Team defined | Start a team run | New chat for the team; first message launches the team | UC-002, SCN-002 |
| UXJ-003 | User on Agent Orgs | Org defined | Start an org run | New chat for the org; first message launches the org | UC-003, SCN-003 |
| UXJ-004 | User in New chat (Team/Org) | Members follow the composer | Customize some members | Line shows "N of M customized"; launch uses the overrides | REQ-002, DEC-002 |
| UXJ-005 | User on a running/stored run | Run selected | "+" start another run like this one | New chat prefilled with the run's workspace, approval, model/thinking (and member overrides for Team/Org) | UC-001..003 |
| UXJ-006 | User on a saved run | Run selected → Edit Config | Review, stop or change model/thinking | Saved; or stopped; or read-only explained | UC-004, REQ-004 |
| UXJ-007 | User typing in any chat | Composer focused | Bring in a collaborator with `@` | `@Name ` inserted as a single mention; it is sent with the message | SCN-005 |

## Journey Details

**UXJ-001..003 Run → New chat**
- Run on a list card or detail page opens `/chat` with a fresh draft addressed to the definition.
- The heading is the target's name: an avatar shows beside it only when the definition has one, and
  the General Agent keeps its `/` `@` hint.
- The composer shows workspace, approval, model and thinking with the definition's defaults.
  Teams and Orgs also get the members line.
- Sending the first message starts the run through the existing launch path.
- The result is the run's chat (Agent) or the run's workspace view (Team/Org).
- If no model is chosen, Send stays disabled with the product's existing reason ("Choose a model to
  start."). An unavailable Org shows "This org is not available. Choose another org."
- Visuals: VIS-001, VIS-002, VIS-010.

**UXJ-004 Customize members**
1. "Customize members" opens the drawer from the right. Focus moves to Close.
2. Rows show each member's effective settings. A placed team shows its workspace first.
3. Opening a row reveals its controls in a white card. Changing any control marks the row
   "Customized" and updates the members line ("● 1 of 2 customized · Edit · Reset").
4. Choosing an Antigravity model locks that member's approval to Auto-approve.
5. A field's "Reset" or the row's reset icon returns the member to the team settings. "Reset all"
   (shown only when something is customized) clears every override.
6. Done, Close or Escape closes the drawer and returns focus to the line. Escape first closes an
   open menu inside the drawer.
- Visuals: VIS-003, VIS-004, VIS-005, VIS-011.

**UXJ-005 "+"**
- "+" on an Agent, Team or Org run (workspace header) opens New chat for the same definition.
- It copies workspace, approval and model+thinking. Team and Org also copy member overrides; a
  placed team keeps its workspace only where it differs from the Org's.
- If copying fails, New chat still opens with the definition's defaults.

**UXJ-006 Saved run settings**
- **Running:** the header is name · "● Running" · red stop icon (tooltip "Stop run"). Workspace,
  model and approval are locked; thinking is shown read-only.
  - Clicking stop disables the icon ("Stopping…" tooltip, pulsing) and calls the same terminate
    action as the workspace tree.
  - On success the badge turns "● Stopped", the icon disappears, and model/thinking become editable.
  - On failure the note line reads "Couldn't stop this run. Try again." in red.
- **Stopped and editable:**
  - The model menu lists only the run's runtime models.
  - Changing the team- or org-wide model updates every member that is not customized, including
    members of placed teams.
  - Any change shows the Save bar: "Unsaved changes · they apply when this run resumes · Cancel ·
    Save". Cancel restores the saved values. Save shows "Saving…", then "Saved. Changes apply when
    this run resumes." (green), and the bar closes.
- **Read-only stopped run:** "🔒 This run's settings can't be changed."
- **Refresh required:** an amber "Saved settings need a refresh before you can change them.
  Refresh"; model and thinking stay locked until refreshed.
- **Model unavailable:** under Model, "No longer offered by {runtime}. Choose another model before
  this run resumes."
- Visuals: VIS-006, VIS-007, VIS-008, VIS-009.

**UXJ-007 `@`**
- Typing `@` opens "Bring into this run @… · ↑↓ to move, Enter to choose". It lists agents and teams
  except the current target.
- Enter or click inserts `@Name ` and highlights it inline as one token. The footer reads
  "{focused agent} gets your message and brings them into this run". The focused agent is the
  agent, the team's coordinator, or the org.
- The first message of a new run keeps the mentions.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | New chat | `/chat` via Run, "+", the workspace tree "+", the Chat nav | Write the first message and start the run | Heading; composer (context files, input, workspace, approval, model, thinking, send); members line (Team/Org) | VIS-001, VIS-002, VIS-003, VIS-010 |
| UIS-002 | Member settings drawer | "Customize members" / "Edit" on the members line | Customize members | Header (icon, "Member settings", target name, close); optional "Reset all"; member rows; footer "Done"; left resize edge | VIS-004, VIS-005, VIS-011 |
| UIS-003 | Saved-run settings | Workspace → run → "Edit Config"; Org: select a member → "Edit Config" | Review, stop, change model/thinking, save | Header with status/stop; optional note; settings card; "Members"; Save bar | VIS-006..009 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Agents/Teams/Orgs page | Run | Navigates | UIS-001 for the definition | New draft; target set | Edit settings, customize, send |
| TR-002 | UIS-001 | Send (message present, ready) | Composer shows "Starting {name} on {runtime}…" | Run view | Run launched with the draft settings + member overrides + mentions | Chat |
| TR-003 | UIS-001 (Team/Org) | Customize members / Edit | Drawer slides in (200 ms) | UIS-002 open | Page pads by the drawer width on `lg`+ | Change, reset, Done |
| TR-004 | UIS-002 | Change a member control | Row shows "Customized"; line updates | Draft member override stored | Only fields that differ are stored | Reset, Done |
| TR-005 | UIS-002 | Reset icon / "Reset" / "Reset all" | Label clears; line returns to "All N members use these settings" | Override removed | — | — |
| TR-006 | UIS-002 | Drag left edge / ←→ on edge / double-click | Blue edge line; width follows | Width 400–960 px (page keeps ≥360 px), stored | `localStorage['autobyteus.chat.memberPanelWidth']` | — |
| TR-007 | Run view | "+" | Navigates | UIS-001 prefilled from the run | Copies workspace, approval, model/thinking (+ member overrides) | Send |
| TR-008 | UIS-003 running | Stop icon | Icon pulses, disabled | Stopped, editable | Same terminate action as the tree | Change model, Save |
| TR-009 | UIS-003 stopped | Change model/thinking | Save bar appears | Dirty | Non-customized members follow | Cancel, Save |
| TR-010 | UIS-003 dirty | Save | "Saving…" → "Saved. Changes apply when this run resumes." | Saved | Existing save path | — |
| TR-011 | Any composer | `@` + Enter/click | Menu opens; selection inserts `@Name ` | Mention in text | Sent with the message | Continue typing |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 General Agent | Chat nav | "General Agent" + "All your skills are available. Type / to use a skill, or @ to bring in an agent or team."; placeholder "Ask anything · / for skills · @ for an agent or team" | Send, @, / | — | VIS-001 |
| UIS-001 Team/Org default | Run | Members line "All {N} members use these settings · Customize members" | Customize | — | VIS-002 |
| UIS-001 customized | Override set | "● {n} of {N} customized · Edit · Reset" | Edit, Reset | Reset | VIS-003 |
| UIS-001 starting | Send | "Starting {name} on {runtime}…" (members line hidden) | — | — | — |
| UIS-002 member customized | Change | "Customized · {model} · {runtime} · {approval}" (+ workspace for teams) | Reset icon, per-field Reset, Reset all | Reset | VIS-004 |
| UIS-002 team with customized members | Change inside a team | "{n} customized · …" on the team row | Open | — | — |
| UIS-002 model required | No model | Summary "Choose a model" (amber) | Choose model | — | — |
| UIS-002 Antigravity | Gemini/AGY model | Tool approval "Auto-approve" + lock, tooltip "Antigravity always runs with auto-approve." | — | Choose another runtime | — |
| UIS-003 running | Active run | "● Running" + red stop icon (tooltip "Stop run"); fixed values locked | Stop | — | VIS-006 |
| UIS-003 stopping / failed | Stop | Icon disabled + pulse; failure: "Couldn't stop this run. Try again." | Retry | — | — |
| UIS-003 stopped editable | Stopped | "● Stopped"; Model/Thinking menus; no note line | Change, Save | Cancel | VIS-007 |
| UIS-003 read-only | Not editable | "🔒 This run's settings can't be changed." | — | — | — |
| UIS-003 refresh required | Stale config | Amber "Saved settings need a refresh before you can change them. Refresh" | Refresh | Refresh | — |
| UIS-003 model unavailable | Saved model missing | "No longer offered by {runtime}. Choose another model before this run resumes." | Choose model | — | — |
| UIS-003 model menu | Model trigger | Search; "{Runtime} 🔒" label (tooltip "The runtime is fixed for this run"); models | Choose | Escape | VIS-008 |
| UIS-003 Org | Org run | Org card + members incl. placed team (workspace editable when stopped) | Change, Save | — | VIS-009 |

## Content, Labels, Validation, And Feedback

- **Voice:** short and plain. No sentence where a control, icon or badge already shows the state.
  Use sentence case.
- **Exact strings (en; zh-CN in `localization/messages/zh-CN/runSettings.ts` and `chat.ts`):**
  - members line: "All {{count}} members use these settings", "Customize members",
    "{{count}} of {{total}} customized", "Edit", "Reset";
  - drawer: "Member settings", "Done"; aria "Close member settings";
  - resize edge aria: "Resize member settings. Drag, or use the arrow keys; double-click to restore
    the width.";
  - rows: "Workspace", "Model", "Thinking", "Tool approval", "Not available for this model";
  - row labels: "Customized", "{{count}} customized", "Coordinator", "Members", "Reset all",
    "Reset" (per field);
  - saved run:
    - status: "Running", "Stopped";
    - stop: "Stop run", "Stopping…", "Couldn't stop this run. Try again.";
    - notes: "This run's settings can't be changed.", "Saved settings need a refresh before you can
      change them.", "Refresh";
    - Save bar: "Unsaved changes · they apply when this run resumes", "Cancel", "Save", "Saving…",
      "Saved. Changes apply when this run resumes.";
  - model: "The runtime is fixed for this run" (tooltip), "No longer offered by {{runtime}}. Choose
    another model before this run resumes.";
  - New chat: "Message {{team}}…", "Message {{org}}…", "Ask {{agent}} anything…" (product copy);
  - `@` menu: "Bring into this run", "{{agent}} gets your message and brings them into this run".
- **Removed copy** (must not appear):
  - "Files are saved in …" (New chat and saved run);
  - "Team defaults" / "Org defaults" titles;
  - "All use defaults" and the per-row "Team defaults" text;
  - "Default" tags;
  - "Team run" / "Agent run" / "Org run" subtitles;
  - "Kept from the saved run: …";
  - "Stop this run to change its model or thinking.";
  - "Changes apply when this run resumes." as a standing line;
  - "Discard";
  - the "Chat with …" `@` header.

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| Model (composer) | Menu | Yes | A model must be selected | Send | Product copy "Choose a model to start." (send disabled) |
| Member model | Menu | Yes (if the member has no model) | Inherited or own model | Row render | Row summary "Choose a model" (amber) |
| Saved-run model | Menu | Yes | Must exist on the run's runtime | Load | "No longer offered by {{runtime}}. Choose another model before this run resumes." |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop wide | ≥ `lg` (1024 px) | The drawer docks right; the page pads by the drawer width | Drag/keyboard resize |
| Desktop narrow / tablet | `sm`–`lg` | The drawer overlays the page (no padding) | Resize available |
| Phone | < `sm` (640 px) | The drawer is full width; no resize edge; menus open as bottom sheets; the composer runtime label hides | Tap |

## Accessibility And Keyboard Behavior

- Target: parity with the chat controls (QR-001).
- **Focus:**
  - opening the drawer focuses Close, and closing returns focus to the members line link;
  - Escape closes an open menu first, then the drawer;
  - menu focus moves into search on open.
- **Keyboard:**
  - every row toggle, reset and control is a button;
  - the resize edge is a focusable `role="separator"` with `aria-valuenow`/`min`/`max`; ←/→ resize
    by 24 px;
  - menus use ↑/↓ and Enter;
  - the `@` menu uses ↑/↓ and Enter.
- **Names and roles:**
  - the drawer is `role="dialog"` with aria-label "Member settings";
  - each row toggle has `aria-expanded` and "Customize {name}";
  - each reset has "Reset {name} to defaults";
  - locked values have "{setting}: {value}. Fixed for this run";
  - the stop button has aria-label and title "Stop run" / "Stopping…";
  - the status note has `role="status"`, or `alert` for refresh and stop failure;
  - the Save bar text is `aria-live="polite"`.
- **Contrast:** labels and values meet body-text contrast (`gray-900`/`gray-800`/`gray-600` on
  white); red-500 for the stop icon; amber-700 for warnings.

## Motion And Transitions

- Drawer: slide from the right, 200 ms ease-out in and 150 ms ease-in out. The page padding animates
  200 ms but not during a drag.
- Chevron rotation 150 ms; colour/border transitions on hover.
- Reduced motion: transitions are disabled (`motion-reduce:transition-none`).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Launch from New chat (Agent/Team/Org) | First message starts the run with settings + member overrides + mentions | Existing launch services; the Team `sendMessageToFocusedMember` stub launches the draft; the first message is not played | Org as a chat target and the first-message mentions are new requirements (see Open Decisions) |
| Runtime catalogs | Model menus | Hand-written `prototype/run-settings/runtimeCatalogFixture.ts` (4 KB; Codex, Claude, Antigravity) | Real catalogs |
| AutoByteus Org | Realistic member panel | Hand-written `prototype/run-settings/autobyteusOrgFixture.ts` (10 KB; structure and names from `autobyteus-agents` `origin/main@d5233c3`) | Real definitions |
| Stop run | Saved-run header | `terminateRun` / `terminateTeamRun` scripted to succeed; the open settings update directly; the tree status is not updated in the reference | Real terminate; lifecycle update refreshes editability |
| Save saved-run settings | Save bar | Scripted local save + confirmation | Existing save/patch services |
| Saved Org run config | UIS-003 Org | Loads from the local `AgentOrgRunConfig` fixture | Real read |
| Review states | Refresh required / model unavailable | `localStorage['autobyteus.design.runSettings.existingState']` | Real editability reasons |

## Final Visual Reference Inventory

All captures were taken on 2026-10-05 after confirmation and final validation, in Chromium at
DPR 2. Desktop is an 880 × 740 CSS viewport. Phone is a 390 CSS-px frame.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 / UIS-001 General Agent | 880 | `visual-references/VIS-001-new-chat-general-agent-880.png` | Heading, hint, placeholder, four controls, no workspace line | Model/workspace names |
| VIS-002 | UXJ-002 / UIS-001 Team default | 880 | `visual-references/VIS-002-new-chat-team-members-line-880.png` | Heading, members line | Team name, member count |
| VIS-003 | UXJ-004 / UIS-001 customized | 880 | `visual-references/VIS-003-new-chat-team-members-customized-line-880.png` | "● 1 of 2 customized · Edit · Reset" | Counts |
| VIS-004 | UXJ-004 / UIS-002 Team | 880 | `visual-references/VIS-004-member-panel-team-customized-880.png` | Drawer header/footer, Reset all, opened card, Customized label, reset icon, per-field Reset, "Ask first" amber | Member names, models |
| VIS-005 | UXJ-004 / UIS-002 Org | 880 | `visual-references/VIS-005-member-panel-autobyteus-org-880.png` | Team rows with workspace summary, opened team card, MEMBERS label, Coordinator badge | Org/team/member names (from the AutoByteus Org fixture) |
| VIS-006 | UXJ-006 / UIS-003 running | 880 | `visual-references/VIS-006-saved-team-running-stop-880.png` | Running badge + red stop icon right after it; no note line; locks | Names, models |
| VIS-007 | UXJ-006 / UIS-003 stopped, unsaved | 880 | `visual-references/VIS-007-saved-team-stopped-unsaved-880.png` | Stopped badge; editable model/thinking; members follow; Save bar copy and buttons | Model names |
| VIS-008 | UXJ-006 / UIS-003 model menu | 880 | `visual-references/VIS-008-saved-run-model-menu-locked-runtime-880.png` | Search, runtime label + lock, model rows, check | Model names/descriptions |
| VIS-009 | UXJ-006 / UIS-003 Org | 880 | `visual-references/VIS-009-saved-org-run-settings-880.png` | Org header, card, placed team with editable workspace and members | Names |
| VIS-010 | UXJ-002 / UIS-001 phone | 390 | `visual-references/VIS-010-new-chat-team-390.png` | Wrapped members line, composer fit | Names |
| VIS-011 | UXJ-004 / UIS-002 phone | 390 | `visual-references/VIS-011-member-panel-team-390.png` | Full-width drawer, no resize edge, truncated summaries | Names |

Illustrative everywhere: agent, team, org, model and workspace names and descriptions, member
counts and the left navigation tree contents.

## Linked UI Reference Evidence

- Runnable UI reference: the design repository root, `corepack pnpm dev --port 4520`. Reset
  fixture state with `localStorage.clear()`.
- Ticket record: `product-ticket.md`
- Review rounds: `review-round-1.md` … `review-round-30.md` (history, findings, validation)
- Journeys: UXJ-001..007; transitions TR-001..011
- Mocked boundaries and limitations: see the Data section. In the automation browser, background
  tabs do not finish slide transitions; this is not a product issue.

## Implementation Fidelity Boundary

- **Must preserve:**
  - every Run and "+" opens New chat;
  - the members line and drawer behaviour, layout, copy, widths and limits;
  - the flat two-line member rows and the Customized label;
  - the saved-run header (status badge + red stop icon after it);
  - no standing note lines; the Save bar copy;
  - the runtime-locked model menu with search;
  - `@` always brings in a collaborator; the current target is excluded.
- **Removed surfaces that production should delete:**
  - the launch configuration forms (`AgentRunConfigForm`, `TeamRunConfigForm`,
    `AgentOrgRunConfigForm` and their sub-forms);
  - `DraftRunConfigEditor`;
  - `AgentOrgRunConfigPanel` and the `mode=configuration` Org route;
  - the pending-launch branch of `RunConfigPanel`;
  - `useRunActions`;
  - the "Chat with" `@` mode;
  - the New chat workspace line;
  - their localization keys.
- **Not prescriptive (UI reference internals):**
  - `components/run-settings/*` structure;
  - the prototype plugin stubs;
  - the fixtures;
  - the scripted stop and save;
  - the Org config read path through `apolloClient`.
- **May vary:** fixture names, counts and models; exact pixel heights of text from font rendering.
- **Design system:** existing Tailwind tokens and heroicons; the chat controls are reused unchanged
  except for `ChatModelMenu` (`runtimeLocked`, `placement`, `align`, `drillIn`), `ChatThinkingControl`
  (`placement`, `align`) and `ChatWorkspaceMenu` (`placement`), plus boundary-aware positioning.

## Out Of Scope

- The mobile paired-phone run setup.
- Applications launch profiles.
- Changing tool approval or workspace on a saved run (fixed, as in the product).
- An Org "+" deeper than copying the source run.

## Open Decisions And Risks

These are requirement impacts to route to the Solution Designer:

1. Run opens New chat; a first message is required to start a run (DEC-001 = D).
2. Org as a New chat target (new launch path `launchOrgChat`).
3. `@` always brings in a collaborator; the earlier "switch chat target" behaviour is removed.
4. The first message of a new run keeps its `@` mentions.
5. The member override set (DEC-002): model+runtime, thinking, approval; placed teams add workspace.
6. "+" on Agent, Team and Org copies the run's settings (and member overrides).
7. The saved-run Stop control and the new read-only note copy (fixing "Stopped" + "Stop this run…").
8. The launch configuration forms and the New chat workspace line are removed.

Further points:
- **Wording:** "Stop run" here vs. the tree tooltip "Terminate run" / "Terminate team". The user did
  not ask to align them, so the product may want one verb.
- **Members line count:** "N of M customized" counts customized agents and placed teams against
  M agent members. It reads correctly in practice.
- **Pre-existing fixture gaps, unchanged:**
  - F-001: store-state capture fixtures are about 7 MB (data-boundary correction recommended);
  - F-003: legacy `workspace_*` scenarios;
  - F-004: Org launch lands on an empty view in the reference.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual
  reference: `Yes`. The secondary states (refresh, model unavailable, read-only, stop failure) are
  specified by copy above.
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals have no unintended placeholders, clipping, overlap, or drift: `Yes`
- Every visible detail is requirements-defining unless marked illustrative: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
