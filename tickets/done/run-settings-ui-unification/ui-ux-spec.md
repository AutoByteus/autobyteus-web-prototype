# UI/UX Specification — run-settings-ui-unification

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `run-settings-ui-unification` (stable package; Product ticket uses the same ID)
- Related requirements revision ID: `SR-005` (user-approved; this package revises the SR-001 result
  in SR-003 and adds the REQ-022 presentation in SR-005)
- Related IDs:
  - UC-001..006;
  - SCN-001..009 (SCN-009 is unsupported);
  - BEH-001..008;
  - REQ-001..018, REQ-022;
  - AC-001..012, AC-019;
  - BEH-009;
  - QR-001;
  - DEC-001..004.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL: http://127.0.0.1:4520 (`corepack pnpm dev --port 4520`)
- Explicit user-confirmation references:
  - SR-001 result (2026-10-05): "Okay, I like this UI. It's now much cleaner right now. I'm satisfied
    now." Self-validated in `review-round-30.md`.
  - SR-003 revision (2026-10-05): about the heading switcher, "that's a very, very smart UI design";
    asked to confirm the Org launch page and the switcher, the user replied "confimr" (rounds 31–32).
  - SR-003 final (2026-10-05, after rounds 33–38): "Anyway, I'm satisfied … I'm currently satisfied
    with the UI now … Let's finalize now … the ticket is done." (`review-round-33-38.md`)
  - SR-005 correction (2026-10-05, round 39, other model settings / Codex Fast mode): "perfect. i
    checked. its great" (`review-round-39.md`).
- Final validation date: 2026-10-05

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend: `autobyteus-web`
- Pinned source revision: `origin/personal@10fb695`. Re-checked at SR-003 finalization: source
  `origin/personal@fc79fad`. Its `autobyteus-web` changes since the pin are the default agent's display
  name ("Daily Assistant", server-provided data, reflected in the design fixtures; web only comments,
  tests and docs) and a release version bump (`package.json`). No UI code, copy or style changed, so
  no baseline refresh is needed.
  Re-checked at SR-005 finalization: source `origin/personal@19dee40`; its `autobyteus-web` changes
  since `fc79fad` are tests, docs, test fixtures and a version bump (no UI code, copy or style), so no
  baseline refresh is needed.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Accepted design base: `origin/personal@b8ce240`, the SR-001 result, which is built on baseline
  `b4f3ed1` (`WEB-BASELINE-REFRESH-007`).
- UI reference revision: ticket branch `design/run-settings-ui-unification`. The final integration
  revision is recorded in `product-ticket.md` and the handoff.
- Ticket folder: `tickets/done/run-settings-ui-unification/`
- Baseline report: `ui-baseline-report.md` at the design repository root (accepted refresh 007)

## Problem And Design Rationale

- **User problem.** The chat composer's four controls (workspace, auto-approve, model+runtime,
  thinking) are "very clean and simple". The Agent run form was "not clean, not user-friendly".
  The Team and Org forms were "a super long list of configuration", repeating near-full forms for
  every member.
- **Key decisions.**
  - **DEC-001 → D for Agents and Teams: every Run opens New chat.** The composer's four controls are
    the run's settings, and the first message starts the run.
  - **DEC-004 → A: an Agent Org is not a chat target.**
    - An Org has no coordinator or initial recipient (`autobyteus-web/docs/agent_orgs.md:56`,
      `:192-211`).
    - Run / "+" open a short **Org launch page** in the same visual language: the Org heading, a
      settings card where the message box would be, with **Run** as a round play-icon button in its
      lower-right corner (where Send sits in chat), and the same members line and drawer.
  - **Choosing what to run is a selection on the heading, never `@`.**
    - `@` keeps one meaning on every surface: bring a collaborator into the run, with the current
      agent relaying. It never lists Orgs.
    - The heading switcher on New chat and on the Org launch page lists Agents, Agent Teams and Agent
      Orgs. An Agent or Team starts in New chat; an Org opens the Org launch page (round 34).
  - **The right tools stay reachable on start surfaces behind one small icon** (round 35), so a
    folder path can be copied from the Terminal while choosing a workspace.
  - **Other model settings (SR-005, REQ-022) are their own small controls next to Thinking**, e.g.
    Codex Fast mode as a "⚡ Fast" toggle chip in the message box and a "Fast mode" row in labelled
    settings. Fast mode is about speed and cost, not thinking, so it is not placed in the Thinking
    menu.
  - **Member customization is secondary.** One quiet line opens a resizable right-side drawer that
    lists members only. The team-wide or org-wide settings live in the composer or the Org card.
  - **DEC-002 → member overrides cover model+runtime, thinking and tool approval.** A team placed in
    an Org also has a workspace.
  - **Saved-run settings use the same quiet language.**
    - Lock icons, a status badge, and a small red stop icon after it.
    - The stop label reuses the tree's verbs (DEC-003).
    - A Save bar appears only after a change.
- **Alternatives considered and rejected.**
  - **A+B+C** (keep the three run panels, restyled): rejected in round 2. It kept three surfaces and
    long forms.
  - **Org as a New chat target** (rounds 2–30): withdrawn in SR-003; an Org has no recipient.
  - **`@` as the target picker on New chat** (before round 9): two meanings for `@`. Replaced by the
    heading switcher (round 32).
  - **"Run Agent Org" in a card footer row** (rounds 31–35) and an action row under the card
    (round 36): the lone button looked odd; replaced by the round Run icon inside the card (round 38).
  - **Showing the tool strip on New chat**: rejected (round 33); one icon instead (round 35).
  - **Fast mode as a "Default / Fast" group inside the Thinking menu, summary "Medium · Fast"**
    (SR-005 provisional baseline): mislabelled under "Thinking", one click deeper, and awkward for a
    model with only Fast mode. The user chose the separate chip (round 39).
  - **Keeping the old Org form** (DEC-004 option B): rejected by the user. The Org launch page is
    consistent with the rest.
  - **An inline member list**, **an editable/read-only defaults block in the drawer**, a **boxed
    member list with "Default" tags**: replaced by the drawer with flat two-line rows (rounds 3–16).

## Scope And Experience Goal

- **User:** someone starting or adjusting runs of agents, teams and orgs.
- **Goal:** set the four run settings the same way everywhere, switch quickly between agents and
  teams in chat, customize members only when needed, start an Org without a message, and understand
  or change a saved run's settings without noise.
- **Observable success:**
  - Agent/Team Run and "+" land in New chat with the right heading and settings;
  - Org Run and "+" land on the Org launch page;
  - the heading switches the chat target;
  - member customization takes one line and one drawer;
  - the saved-run page shows only settings, status, a stop icon and Save.
- **In scope:**
  - New chat (Daily Assistant, Agent, Team) with the heading switcher;
  - the Org launch page;
  - the right-tools icon on New chat and the Org launch page;
  - the Member settings drawer;
  - every Run and "+" entry point;
  - `@` in New chat and running chats;
  - saved Agent/Team/Org run settings (Edit Config).
- **Non-goals:**
  - mobile paired-phone run setup;
  - Applications launch profiles;
  - the chat transcript;
  - the workspace tree layout;
  - backend behaviour;
  - starting an Org from chat or `@`-mentioning an Org (SCN-009, unsupported).

## Related Requirements And Acceptance Criteria

| ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-005 / AC-001 | Agent/Team Run → New chat with the target heading and the four controls; Org Run → Org launch page with the Org heading and settings card | UXJ-001..003, UIS-001, UIS-004 |
| REQ-006 / AC-002 | Agent/Team start only with a first message; Org starts only with Run (no message box); no model → Send / Run disabled with "Choose a model to start." | UXJ-001..003 |
| REQ-007 / AC-003 / DEC-004 | No Org entry point opens New chat (choosing an Org in the heading opens the Org launch page); Org launch page = heading switcher, settings card with Run, members line + drawer; success → the launched Org run view (choose an Agent/Team as today) | UXJ-003, UIS-004 |
| REQ-008 | New chat heading = target name (avatar only when present); the Daily Assistant (default agent) keeps its `/` `@` hint; the Org page heading = Org name | UIS-001, UIS-004 |
| REQ-009 / AC-006 | Member overrides per DEC-002; "Customized"; per-field Reset, row reset, Reset all | UXJ-004, UIS-002 |
| REQ-010 / AC-003 / AC-004 | Launch applies overrides: Team from New chat, Org from the Org launch page | TR-002, TR-013 |
| REQ-011 / AC-007 | `@` = "Bring into this run"; Agents and Agent Teams only, never Orgs; current target excluded; never switches the target | UXJ-007 |
| REQ-012 | The first message keeps its `@` mentions | UXJ-007 |
| REQ-013 / AC-008 | Agent/Team "+" → New chat prefilled; Org "+" → Org launch page prefilled (workspace, approval, model+thinking, member overrides) | UXJ-005 |
| REQ-014 / AC-009 / DEC-003 | Running saved run: red stop icon after the badge; tree wording per type; pending/failure copy | UXJ-006 |
| REQ-015..017 | Saved-run cascade + Save bar; special-state copy; runtime-locked model menu | UXJ-006, UIS-003 |
| REQ-018 | Superseded launch UI and copy removed | Implementation Fidelity Boundary |
| **New (rounds 32/34, requirement impact)** | The New chat and Org launch headings are one switcher for Agents, Agent Teams and Agent Orgs; settings carry across | UXJ-008, UIS-001, UIS-004 |
| **New (round 35, requirement impact)** | New chat and the Org launch page reach the right tools through one icon; Files/Terminal follow the chosen workspace | UXJ-009, UIS-005 |
| **Changed (round 37, requirement impact)** | The Org launch action is labelled "Run" (SR-003 said "Run Agent Org") | UIS-004 |
| REQ-022 / AC-019 / BEH-009 | The selected model's other (non-thinking) settings, e.g. Codex Fast mode, can be set in the message box, the Org card, member rows and stopped saved runs; read-only while running; nothing extra for models without them; a model with only other settings still offers them | UXJ-010, UIS-001..004 |
| REQ-003 | No raw addresses in user-facing copy | All copy |
| QR-001 | Keyboard-operable with accessible names | Accessibility |

## Visual Language

- **Existing product language to preserve:**
  - the chat composer (white rounded box, thin `gray-200`/`gray-300` border) and its controls
    `ChatWorkspaceMenu`, `ChatApprovalToggle`, `ChatModelMenu` and `ChatThinkingControl`;
  - Tailwind gray/blue/indigo; Inter type; heroicons.
- **Layout:**
  - New chat and the Org launch page share one composition: the target name centered as the page
    heading (`h1`, 28 px `sm`, semibold, tracking-tight); below it the composer (chat) or the
    settings card (Org); one members line centered under it (Team/Org).
  - On both pages the heading is a button with a chevron (the switcher).
  - Both pages sit outside the workspace tool shell's strip: the right tools appear only after the
    small icon in the top-right corner is used.
  - The Org card's Run button is pinned 12 px from the card's bottom-right corner; the rows above
    use the full card width.
  - The Member settings drawer docks right. On `lg` and wider the page pads by its width.
  - Saved-run settings: header (icon + name + status badge [+ stop icon]), settings card, optional
    note line, "Members", sticky Save bar.
- **Spacing and density:**
  - setting rows ≥ 36 px with a 96 px label column;
  - member rows: 32 px avatar, two lines;
  - list gap 6 px;
  - Org card `px-4 py-2`; Org status line 10 px under the card; members line 10 px under that.
- **Typography and colour:**
  - labels `gray-900`, 13 px;
  - values as in the composer (model `gray-800` medium, runtime `gray-400`, approval and workspace
    `gray-600`);
  - "Customized" `blue-700`;
  - members line `gray-400` with `blue-700` links;
  - Org status text (centered under the card): `gray-500` (info), `amber-700` (blocked), `red-600`
    (error), wrapping (never truncated);
  - Run: a 32 px round `blue-600` button (hover `blue-700`) with a white 16 px play icon, exactly the
    composer's Send button style;
  - primary text buttons indigo-600 (Save, Done).
- **Surfaces:**
  - settings card, Org card and opened member: `rounded-xl`, `gray-200` border, white, `shadow-sm`,
    no row dividers;
  - closed member rows have no border and a `gray-50` hover;
  - menus are `rounded-lg`, `gray-200` border, white, `shadow-lg`.
- **Badges:** Coordinator `bg-gray-100`; Running `bg-emerald-50 text-emerald-700` + dot; Stopped
  `bg-gray-100 text-gray-600` + dot.
- **Icons:**
  - `chevron-down` 20 px `gray-400` on the heading switcher;
  - `play-solid` 16 px white on Run; `arrow-path-solid` spinning while starting;
  - other model settings: `bolt` (Fast mode) / `adjustments-horizontal` (any other), 14 px; the
    solid variant when the setting is on;
  - the `panel-right` outline icon, 18 px `gray-400` (hover `gray-600` on `gray-100`), for "Show
    tools" — the same icon and corner as the panel's own close button;
  - `building-office-2` for Orgs in the switcher;
  - `user-group` / `building-office-2`;
  - agent initials circle `emerald-50`;
  - `lock-closed` for fixed values;
  - `stop-20-solid` 16 px `red-500`;
  - `arrow-uturn-left-solid` for a member reset;
  - `check` `blue-600` for the current item.
- **States:**
  - hover `gray-50`/`gray-100`; the heading switcher has a `gray-50` hover and an open background;
  - focus `ring-2 blue-500/40` (`red-500/40` for stop);
  - disabled 50–60 % opacity;
  - an Antigravity model locks approval with a lock icon.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Heading switcher | Choose what to run (New chat, Org launch page) | Closed / hover / open; search; sections Agents (Daily Assistant first), Agent teams, Agent orgs; current = check; disabled while starting | `components/chat/ChatTargetSwitcher.vue`, `composables/runSettings/useRunTargetSwitcher.ts` |
| Org launch page | Start an Org | Default, customized, model missing, runtime unavailable, preparing ("+"), launching, failed, unavailable; Run icon button inside the card | `components/run-settings/OrgLaunchPage.vue`, `stores/orgLaunchDraftStore.ts` |
| Other model setting control | One non-thinking model setting (e.g. Codex Fast mode) | Toggle chip: off (gray, outline icon) / on (`bg-blue-50 text-blue-700`, solid `blue-600` icon), `aria-pressed`, icon only < `sm` in the message box; menu chip for multi-value settings; row variant with own Customized/Reset; locked (value + lock) | `components/chat/ChatModelOptionControl.vue`, `components/chat/chatModelOptions.ts`, `components/run-settings/RunSettingsCard.vue` |
| Start-surface tools | Reach Files/Terminal/… before a run | Icon (closed) / docked panel / drawer (narrow); remembered | `components/layout/WorkspaceToolShell.vue` (`start-surface`), `StartSurfaceToolsToggle.vue`, `composables/layout/useStartSurfaceTools.ts` |
| Members line + drawer | Customize members (Team New chat, Org launch page) | Line: default / "● n of N customized · Edit · Reset"; drawer resizable 400–960 px, remembered; full width < `sm` | `components/run-settings/ChatTargetMembers.vue`, `memberSettingsSource.ts` |
| Member row | A member or placed team | Closed / hover / opened card; Customized; "N customized" for teams; "Choose a model" (amber); nested members | `components/run-settings/RunMemberRow.vue` |
| Settings rows | Workspace / Model / Thinking / Tool approval | Editable, locked, thinking unavailable, Antigravity approval lock, per-field Reset | `components/run-settings/RunSettingsCard.vue` |
| Saved-run settings | Edit Config | Running (stop), stopped, read-only, refresh required, model unavailable, unsaved → Save bar, saved | `components/run-settings/ExistingRunSettings.vue`, `RunSubjectHeader.vue` |
| Model menu (saved run) | Change the model within the run's runtime | Search + runtime label with lock + models | `components/chat/ChatModelMenu.vue` (`runtimeLocked`) |
| `@` menu | Bring a collaborator in | One mode; Agents + Agent teams; current excluded | `components/chat/ChatTargetMenu.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Agents (list/detail) | Agent defined | Start an agent run | New chat for the agent; first message starts it | REQ-005/006, AC-001/002 |
| UXJ-002 | Agent Teams | Team defined | Start a team run | New chat for the team; first message launches it | REQ-005/006, AC-001/002/004 |
| UXJ-003 | Agent Orgs (list/detail), or an Org chosen in the heading | Org defined | Start an Org run | Org launch page → Run → the launched Org run view | REQ-005..007, REQ-010, AC-001..003 |
| UXJ-004 | New chat (Team) or Org launch page | Members follow the defaults | Customize some members | "n of N customized"; the launch uses the overrides | REQ-009/010, AC-005/006 |
| UXJ-005 | A running/stored run | Run selected | "+" start another like it | Agent/Team: New chat prefilled; Org: Org launch page prefilled | REQ-013, AC-008 |
| UXJ-006 | A saved run | Edit Config | Review, stop, change model/thinking | Saved / stopped / read-only explained | REQ-014..017, AC-009..011 |
| UXJ-007 | Any composer | Composer focused | Bring in a collaborator with `@` | `@Name ` inserted; sent with the message | REQ-011/012, AC-007 |
| UXJ-008 | New chat / Org launch page | Any target, before starting | Switch to another Agent, Team or Org | Agent/Team: New chat; Org: Org launch page; settings kept | New (rounds 32/34) |
| UXJ-010 | Any model settings surface | A model with other settings selected | Set Codex Fast mode (or any other model setting) | Chip on; row value; summary "· Fast"; the run carries it | REQ-022, AC-019 |
| UXJ-009 | New chat / Org launch page | Tools closed | Use Files/Terminal (e.g. copy a folder path) | Tools open beside the page (or as the drawer); closing returns the icon | New (round 35) |

## Journey Details

**UXJ-001/002 Run → New chat**
- Run opens `/chat` with a fresh draft for the definition.
- The heading is its name (an avatar beside it only when the definition has one). The Daily Assistant
  keeps its `/` `@` hint.
- The composer shows workspace, approval, model and thinking. Teams also get the members line.
- Sending the first message starts the run and opens it; the message shows in the conversation
  (for a Team, in its coordinator's), and the run is listed in the workspace tree.
- No model → Send disabled ("Choose a model to start.").
- Visuals: VIS-001, VIS-002, VIS-010, VIS-019.

**UXJ-003 Org launch page**
1. Agent Orgs → Run opens `/workspace?rootSubjectKind=agent_org&definitionId=<id>&mode=configuration`
   with a fresh draft. Choosing an Org in the heading switcher opens the same page, carrying the
   workspace, model+thinking and approval.
2. The heading is the Org name (avatar if present) and is the heading switcher. The settings card
   shows Workspace, Model, Thinking and Tool approval, with Run in its lower-right corner.
   - Defaults: the Org's default launch config; else the last model used in chat; else the default
     runtime's first model.
   - Workspace defaults to the temp workspace; approval to Auto-approve.
3. Below the card, centered: "All N members use these settings · Customize members". The drawer
   lists placed teams (with their workspace) and their members, and direct agents.
4. **Run** (round play icon; tooltip "Run"):
   - the icon becomes a spinner; "Starting {Org} on {runtime}…" shows under the card;
   - the settings lock;
   - on success the launched Org run view opens (`mode=active`): the run is listed under its
     workspace as "New - {Org}" with its teams and agents, and the user chooses an exact Agent or
     Team, as today (VIS-018).
5. **Failure:** red "Couldn't start this Agent Org. Try again."; the page and values are kept; Run
   is enabled again.
6. **Blocked:** amber reason under the card ("Choose a model to start." or "{Runtime} is unavailable.
   Choose another runtime."); Run disabled, with the same reason as its tooltip and accessible name.
7. **Unavailable Org:** the heading + "This Agent Org isn't available. Choose another Agent Org." +
   "Back to Agent Orgs".
- Visuals: VIS-012..015, VIS-005, VIS-018.

**UXJ-004 Customize members (drawer)**
- As approved. It opens from "Customize members" / "Edit", with focus on Close.
- Rows show effective settings. A change marks the row "Customized" and updates the line.
- Choosing an Antigravity model locks that member's approval.
- Field "Reset", the row reset icon, and "Reset all" restore inheritance.
- Done, Close or Escape closes the drawer and returns focus. The drawer is resizable 400–960 px and
  the width is remembered.
- Visuals: VIS-003, VIS-004, VIS-005, VIS-011.

**UXJ-005 "+"**
- Agent and Team "+" open New chat with the run's workspace, approval and model+thinking. Team "+"
  also copies member overrides.
- Org "+" opens the Org launch page with `&sourceOrgRunId=…`. While it reads the run, "Copying the
  run's settings…" shows under the card and Run is disabled.
- Then the page shows the run's workspace, approval, model+thinking and member overrides. A placed
  team keeps its workspace only where it differs from the Org's.
- If copying fails, the definition's defaults are used.

**UXJ-006 Saved run settings**
- **Running:**
  - header: name · "● Running" · red stop icon; fixed values are locked;
  - stop tooltip/aria: Agent "Terminate run", Team "Terminate team", Org "Stop Agent Org";
  - pending: "Terminating…" (Agent/Team) or "Stopping…" (Org), icon disabled and pulsing;
  - success: "● Stopped", the icon disappears, model and thinking become editable;
  - failure: red note "Couldn't terminate this run. Try again." (Agent/Team) or "Couldn't stop this
    org. Try again." (Org).
- **Stopped and editable:**
  - the model menu has a search box, the runtime label with a lock, and that runtime's models;
  - the team- or org-wide model applies to non-customized members, including members of placed
    teams;
  - Save bar: "Unsaved changes · they apply when this run resumes · Cancel · Save" → "Saving…" →
    "Saved. Changes apply when this run resumes.".
- **Read-only:** "This run's settings can't be changed."
- **Refresh required:** "Saved settings need a refresh before you can change them. Refresh".
- **Model unavailable:** "No longer offered by {runtime}. Choose another model before this run
  resumes."
- Visuals: VIS-006..009.

**UXJ-007 `@`**
- `@` opens "Bring into this run @… · ↑↓ to move, Enter to choose". It lists Agents and Agent Teams
  only, excluding the current target.
- Enter or click inserts `@Name ` as one inline token. The footer reads "{agent} gets your message
  and brings them into this run" (the agent, or the team's coordinator).
- The first message keeps its mentions.

**UXJ-008 Heading switcher (New chat and the Org launch page)**
- Click the heading (name, avatar, chevron). A menu opens under it with focus in "Search agents,
  teams and orgs".
  - Sections: "Agents" (Daily Assistant first, then shared agents), "Agent teams", "Agent orgs"
    (Orgs with the building icon).
  - A check marks the current target; the highlight starts there. Empty search: "Nothing matches".
- ↑/↓ move, Enter chooses, Escape or an outside click closes (focus returns to the heading).
- Choosing an Agent or Team (on New chat) switches the draft at once:
  - the heading changes;
  - the placeholder changes ("Ask {agent} anything…", "Message {team}…", or the Daily Assistant copy
    and hint);
  - the members line shows for Teams;
  - member overrides reset when the target changes; workspace, approval and model+thinking are kept;
  - focus moves to the message box.
- Choosing an Org (from New chat) opens the Org launch page with the same workspace, approval and
  model+thinking. Choosing an Agent or Team on the Org launch page opens New chat with them.
- Only before starting; disabled while a run is starting. On a narrow screen the menu is nudged
  inside the window (8 px margin).
- Visuals: VIS-016, VIS-001.

**UXJ-010 Other model settings (SR-005, REQ-022)**
- Every config-schema parameter of the selected model that is not a thinking setting is an "other
  model setting", labelled by its schema title. Codex Fast mode: `service_tier`, title "Fast mode",
  one value "fast" ("Fast"); unset = Default.
- **Message box (New chat):** one chip per setting after the Thinking chip.
  - "Default or one value" (or a boolean): a toggle chip showing the value ("⚡ Fast"). Off: gray
    text, outline icon. On: blue text on light blue, solid icon. Click toggles; tooltip/aria
    "Fast mode: On" / "Fast mode: Off". Phones: icon only.
  - Several values: a menu chip ("{value} ⌄"), menu titled by the setting: Default, then the values,
    a check on the current one.
- **Labelled settings (Org card, member drawer, saved runs):** a row per setting directly under
  Thinking, labelled by the title ("Fast mode"), with the same chip.
  - Members: "Customized" and a Reset on that row when the member's value differs from its parent's;
    Reset sets it back to the parent's value. Thinking counts as customized only when the thinking
    settings differ, so each resets on its own. A member whose model settings match the parent again
    follows the parent again.
  - Saved runs: while running, locked (icon + "Fast" or "Off" + lock); when stopped, editable; a
    change shows the Save bar and non-customized members follow.
  - While starting or copying settings: locked like the other rows.
- **Member summary line:** the label of each setting that is on follows the model ("GPT-5.6 Sol ·
  Codex · Fast · Auto-approve").
- **Model with only other settings:** the message box shows only its chip (no Thinking chip); the card
  keeps "Thinking: Not available for this model" and adds the row.
- **Model without other settings:** nothing extra.
- Changing thinking keeps the other settings and vice versa; choosing another model resets them to
  that model's defaults (unset). "+" copy and the heading switcher carry them with the model config.
- Visuals: VIS-020..029.

**UXJ-009 Right tools on start surfaces**
- New chat and the Org launch page show a small `panel-right` icon in the top-right corner
  (tooltip/aria "Show tools"). The right tools are closed by default.
- Click: the right tools (Files, Terminal, Activity, Token, Artifacts, …) open docked beside the
  page when there is room, and the page narrows; otherwise they open as the drawer.
- Closing (the panel's own icon, or closing the drawer) brings the icon back. No icon strip is shown
  on these pages.
- The open/closed choice is remembered, holds across Agent/Team/Org switches, and a run started from
  the page keeps the panel open.
- Files and Terminal use the workspace chosen on the page; a typed folder that is not yet a known
  workspace has no files to show.
- Visuals: VIS-017 (open), VIS-001 (icon).

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | New chat | `/chat` via Agent/Team Run, Agent/Team "+", the workspace tree "+", the Chat nav, the switcher | Write the first message and start | Heading switcher; composer; members line (Team); tools icon | VIS-001..003, VIS-010, VIS-016, VIS-019 |
| UIS-002 | Member settings drawer | "Customize members" / "Edit" (New chat Team, Org launch page) | Customize members | Header; optional "Reset all"; rows; footer "Done"; left resize edge | VIS-004, VIS-005, VIS-011 |
| UIS-003 | Saved-run settings | Workspace → run → "Edit Config" (Org: select a member → "Edit Config") | Review, stop, change model/thinking, save | Header with status/stop; optional note; settings card; "Members"; Save bar | VIS-006..009 |
| UIS-004 | Org launch page | `/workspace?rootSubjectKind=agent_org&definitionId=…&mode=configuration[&sourceOrgRunId=…]` via Org Run / "+" / the switcher | Start the Org | Heading switcher; settings card with the Run icon button in its corner; status line; members line; tools icon | VIS-012..015, VIS-018 |
| UIS-005 | Start-surface tools | The icon on UIS-001 / UIS-004 | Use Files/Terminal before a run | Docked right panel (or drawer) with the run view's tabs | VIS-017 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Agents/Teams page | Run | Navigates | UIS-001 for the definition | New draft | Edit, switch, customize, send |
| TR-002 | UIS-001 | Send (ready) | "Starting {name} on {runtime}…" | Run view | Launch with settings + overrides + mentions | Chat |
| TR-003 | UIS-001 (Team) / UIS-004 | Customize members / Edit | Drawer slides in (200 ms) | UIS-002 open | Page pads on `lg`+ | Change, reset, Done |
| TR-004 | UIS-002 | Change a member control | "Customized"; line updates | Override stored | Only differing fields | Reset, Done |
| TR-005 | UIS-002 | Reset icon / Reset / Reset all | Label clears | Override removed | — | — |
| TR-006 | UIS-002 | Drag edge / ←→ / double-click | Blue edge line | Width 400–960 px, stored | `localStorage['autobyteus.chat.memberPanelWidth']` | — |
| TR-007 | Agent/Team run view | "+" | Navigates | UIS-001 prefilled | Copies workspace, approval, model/thinking (+ overrides) | Send |
| TR-008 | UIS-003 running | Stop icon | Icon pulses, disabled; "Terminating…"/"Stopping…" | Stopped, editable | Same action as the tree | Change model, Save |
| TR-009 | UIS-003 stopped | Change model/thinking | Save bar | Dirty | Non-customized members follow | Cancel, Save |
| TR-010 | UIS-003 dirty | Save | "Saving…" → "Saved. Changes apply when this run resumes." | Saved | Existing save path | — |
| TR-011 | Any composer | `@` + Enter/click | Menu; `@Name ` inserted | Mention in text | Sent with the message | Continue |
| TR-012 | Agent Orgs page | Run | Navigates | UIS-004 (default) | New Org draft | Edit, customize, Run |
| TR-013 | UIS-004 ready | Run | Spinner in the button + "Starting {Org} on {runtime}…"; settings locked | The launched Org run view (listed as "New - {Org}"); or failed (red copy, values kept) | Org launch with overrides; no recipient | Choose Agent/Team |
| TR-014 | Org run view | "+" | Navigates; "Copying the run's settings…" | UIS-004 prefilled | Reads the source run | Run |
| TR-015 | UIS-001 / UIS-004 | Heading → choose a target | Menu closes; Agent/Team: heading/placeholder/members line change, focus to input; Org: the Org launch page | Draft retargeted / Org draft started | Member overrides reset; workspace, approval, model+thinking kept | Send / Run |
| TR-017 | UIS-001..004 | Click an other-setting toggle (e.g. ⚡ Fast) | Chip on/off at once; row "Customized" (members); Save bar (stopped saved run) | Setting set / unset in the model config | `service_tier: "fast"` added / removed; thinking kept | Send / Run / Save |
| TR-016 | UIS-001 / UIS-004 | Tools icon / panel close | Panel docks (or drawer opens) / icon returns | UIS-005 open / closed | `localStorage['autobyteus.chat.startToolsOpen']` | Use tools |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 Daily Assistant | Chat nav | "Daily Assistant ⌄" + "All your skills are available. Type / to use a skill, or @ to bring in an agent or team."; placeholder "Ask anything · / for skills · @ for an agent or team"; tools icon top right | Switch, send, @, /, tools | — | VIS-001 |
| UIS-001 Codex model with Fast mode | Model chosen | "{model} Codex ⌄ · 💡 {effort} ⌄ · ⚡ Fast" (off: gray) | Toggle | — | VIS-020 |
| UIS-001 Fast mode on | ⚡ Fast | Chip blue with solid bolt; aria-pressed true | Toggle off | — | VIS-021, VIS-027 (phone, icon only) |
| UIS-001 model with only other settings | Model chosen | No Thinking chip; "⚡ Fast" only | Toggle | — | VIS-022 |
| UIS-001 `@` menu | `@` typed | "Bring into this run @ · ↑↓ to move, Enter to choose"; "Agents", "Agent teams"; footer "{agent} gets your message and brings them into this run" | Choose, Esc | Esc | VIS-030 |
| UIS-001 prefilled from a run "+" | "+" on an Agent run | Heading = the agent; the run's workspace, approval, model+thinking | Send | — | VIS-042 |
| UIS-001 switcher open | Heading click | Search "Search agents, teams and orgs"; "Agents" / "Agent teams" / "Agent orgs"; check on current; empty: "Nothing matches" | Choose, Esc | Esc / outside click | VIS-016 |
| UIS-001 Team default | Run / switch | "All {N} members use these settings · Customize members" | Customize | — | VIS-002 |
| UIS-001 customized | Override set | "● {n} of {N} customized · Edit · Reset" | Edit, Reset | Reset | VIS-003 |
| UIS-001 starting | Send | "Starting {name} on {runtime}…"; switcher disabled | — | — | — |
| UIS-004 default | Org Run | Org heading switcher; card with the round Run icon (tooltip "Run"); members line | Edit, customize, Run, switch, tools | — | VIS-012 |
| UIS-004 Fast mode row | Codex model with Fast mode | "Fast mode" row under Thinking with the chip | Toggle | — | VIS-023, VIS-028 (phone) |
| UIS-004 model with only other settings | Model chosen | "Thinking: Not available for this model" + "Fast mode" row | Toggle | — | VIS-029 |
| UIS-004 switcher open | Heading click | As UIS-001, current Org checked | Choose | Esc | VIS-035 |
| UIS-004 tools open | Tools icon | Docked panel beside the page | Use tools | Close icon | VIS-036 |
| UIS-004 blocked | No model / runtime unavailable | Amber "Choose a model to start." / "{Runtime} is unavailable. Choose another runtime."; Run disabled (tooltip = reason) | Choose model | — | VIS-031 |
| UIS-004 preparing | Org "+" | Spinner + "Copying the run's settings…"; settings locked; Run disabled | — | Defaults on failure | VIS-032 |
| UIS-004 prefilled | Org "+" read done | The run's workspace, approval, model+thinking, member overrides | Run | — | VIS-033 |
| UIS-004 launching | Run | Spinner in the button + "Starting {Org} on {runtime}…"; settings locked; Run disabled | — | — | VIS-034 |
| UIS-004 launched | Run succeeded | The Org run view: "New - {Org}" in the tree (live, all members idle); "Choose an Agent or Team" | Choose a member | — | VIS-018 |
| UIS-005 open | Tools icon | Docked panel (or drawer) with the run view's tabs; the page narrows | Use tools; close | Panel close icon | VIS-017 |
| UIS-004 failed | Launch error | Red "Couldn't start this Agent Org. Try again." (wraps) | Run again | — | VIS-013 |
| UIS-004 unavailable | Org missing | "This Agent Org isn't available. Choose another Agent Org." + "Back to Agent Orgs" | Back | — | VIS-014 |
| UIS-002 member customized | Change | "Customized · {model} · {runtime} · {approval}" (+ workspace for teams) | Reset icon, field Reset, Reset all | Reset | VIS-004, VIS-005 |
| UIS-002 member other setting customized | Member toggles Fast mode | Row "Customized"; Reset on the Fast mode row only; Thinking stays inherited | Row Reset | Reset | VIS-024 |
| UIS-002 model required | No model | "Choose a model" (amber) | Choose | — | — |
| UIS-002 Antigravity | AGY model | Approval "Auto-approve" + lock; tooltip "Antigravity always runs with auto-approve." | — | Another runtime | — |
| UIS-003 running | Active | "● Running" + red stop icon (tooltip per type); fixed values locked, including other model settings ("⚡ Fast 🔒") | Stop | — | VIS-006, VIS-025 |
| UIS-003 stopping | Stop clicked | Stop icon disabled and pulsing; tooltip "Terminating…" / "Stopping…" | — | — | VIS-037 |
| UIS-003 stop failed | Terminate error | "Couldn't terminate this run. Try again." / "Couldn't stop this org. Try again." | Retry | — | VIS-038 |
| UIS-003 stopped editable | Stopped | "● Stopped"; Model/Thinking menus; other model settings editable | Change, Save | Cancel | VIS-007, VIS-026 |
| UIS-003 read-only | Not editable | "🔒 This run's settings can't be changed." | — | — | VIS-039 |
| UIS-003 refresh / model unavailable | Stale config / missing model | "Saved settings need a refresh before you can change them. Refresh" / "No longer offered by {runtime}. Choose another model before this run resumes." | Refresh / choose | — | VIS-040, VIS-041 |
| UIS-003 model menu | Model trigger | Search; "{Runtime} 🔒" (tooltip "The runtime is fixed for this run"); models | Choose | Esc | VIS-008 |
| UIS-003 Org | Org run | Org card + members incl. placed team (workspace editable when stopped) | Change, Save | — | VIS-009 |

## Content, Labels, Validation, And Feedback

- **Voice:** short and plain; no sentence where a control, icon or badge shows the state; sentence
  case.
- **Exact strings** (en; zh-CN in `localization/messages/zh-CN/runSettings.ts` and `chat.ts`):
  - **Heading switcher:**
    - aria "Choose what to run (now {{name}})";
    - search "Search agents, teams and orgs";
    - sections "Agents", "Agent teams", "Agent orgs";
    - empty "Nothing matches".
  - **Start-surface tools:** "Show tools" (tooltip and aria).
  - **Other model settings (SR-005):** row label and toggle value come from the model's schema
    (title "Fast mode", value "fast" → "Fast"); "Default" (`chat.modelOption.default`, zh-CN "默认");
    toggle tooltip/aria "{{setting}}: {{state}}" with "On" / "Off" (zh-CN "{{setting}}：{{state}}",
    "开" / "关"); locked "Fast" / "Off".
  - **Org launch page:**
    - "Run" (tooltip and aria of the icon button; zh-CN "运行");
    - "Starting {{name}} on {{runtime}}…";
    - "Couldn't start this Agent Org. Try again.";
    - "This Agent Org isn't available. Choose another Agent Org.";
    - "Back to Agent Orgs";
    - "Copying the run's settings…";
    - "Choose a model to start.";
    - "{{runtime}} is unavailable. Choose another runtime." (existing chat copy).
  - **Members line and drawer:**
    - "All {{count}} members use these settings";
    - "Customize members";
    - "{{count}} of {{total}} customized";
    - "Edit";
    - "Reset";
    - "Member settings";
    - "Done";
    - aria "Close member settings";
    - resize aria "Resize member settings. Drag, or use the arrow keys; double-click to restore
      the width.".
  - **Rows:**
    - "Workspace", "Model", "Thinking", "Tool approval";
    - "Not available for this model";
    - "Customized", "{{count}} customized", "Coordinator", "Members", "Reset all", "Reset".
  - **Saved run:**
    - status "Running" / "Stopped";
    - stop: Agent "Terminate run", Team "Terminate team" (tree keys), Org "Stop Agent Org" (tree key);
    - pending "Terminating…" / "Stopping…";
    - failure "Couldn't terminate this run. Try again." / "Couldn't stop this org. Try again.";
    - notes "This run's settings can't be changed.", "Saved settings need a refresh before you can
      change them.", "Refresh";
    - Save bar "Unsaved changes · they apply when this run resumes", "Cancel", "Save", "Saving…",
      "Saved. Changes apply when this run resumes.".
  - **Model:** "The runtime is fixed for this run"; "No longer offered by {{runtime}}. Choose another
    model before this run resumes.".
  - **New chat (product copy):** "Message {{team}}…", "Ask {{agent}} anything…".
  - **`@`:** "Bring into this run"; "{{agent}} gets your message and brings them into this run";
    empty "No agents or teams match".
- **Removed copy** (must not appear):
  - "Files are saved in …"; "Team defaults" / "Org defaults"; "All use defaults"; "Default" tags;
  - "Team run" / "Agent run" / "Org run" subtitles; "Kept from the saved run: …";
  - "Stop this run to change its model or thinking."; a standing "Changes apply when this run
    resumes."; "Discard";
  - "Stop run" / "Stopping…" for Agent/Team and "Couldn't stop this run. Try again." (replaced by
    DEC-003 wording);
  - the "Chat with …" `@` header;
  - "Run Agent Org" (now "Run");
  - **Org-in-chat:** "Message {{org}}…", "This org is not available. Choose another org.", the
    `@` footer naming an Org.

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| Model (composer / Org card) | Menu | Yes | A model must be selected | Send / Run | "Choose a model to start." (button disabled) |
| Runtime (composer / Org card) | Menu | Yes | Runtime enabled | Send / Run | "{{runtime}} is unavailable. Choose another runtime." |
| Member model | Menu | Yes (if none) | Inherited or own | Row render | Summary "Choose a model" (amber) |
| Saved-run model | Menu | Yes | Exists on the run's runtime | Load | "No longer offered by {{runtime}}. Choose another model before this run resumes." |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop wide | ≥ `lg` (1024 px) | Drawer docks right; the page pads by its width. Start-surface tools dock beside the page when the shell has room | Drag/keyboard resize |
| Desktop narrow / tablet | `sm`–`lg` | Drawer overlays the page | Resize available |
| Phone message box | < `sm` | Other-setting toggle chips show the icon only (name in aria/tooltip) so Send stays inside the box | Tap |
| Desktop narrow / phone tools | The shell has no room to dock | Start-surface tools open as the drawer from the same icon | Tap / Escape |
| Phone | < `sm` (640 px) | Drawer full width, no resize edge; menus as bottom sheets; the composer's runtime label hides; the Org card rows keep the full width (Run is pinned to the corner; approval label never wraps); the members line wraps centered; the heading switcher menu is nudged inside the window | Tap |

## Accessibility And Keyboard Behavior

- Target: parity with the chat controls (QR-001).
- **Heading switcher:**
  - a button with `aria-haspopup="listbox"`, `aria-expanded` and an aria-label naming the current
    target;
  - search is a combobox with `aria-activedescendant`;
  - ↑/↓, Enter, Escape; an outside click closes;
  - focus returns to the heading on Escape and moves to the message box after choosing.
- **Org launch page:**
  - the card controls are the chat controls (keyboard-operable);
  - the status text is `role="status"`, or `role="alert"` on error, with `aria-live="polite"`;
  - Run is an icon button whose accessible name and title are "Run", or the blocking reason when
    disabled; `aria-busy` while starting.
- **Start-surface tools:** the icon is a button named "Show tools"; the panel's own close button is
  unchanged.
- **Other model settings:** toggles are buttons with `aria-pressed` and the name "{setting}: On/Off";
  menu chips use `aria-haspopup="menu"` and `menuitemradio` items like Thinking; locked rows read
  "{setting} is fixed for this run: {value}".
- **Drawer:**
  - `role="dialog"` "Member settings"; focus moves to Close on open and returns to the line on close;
  - Escape closes an open menu first;
  - the resize edge is a focusable `role="separator"` with value/min/max and ←/→ in 24 px steps.
- **Saved run:**
  - stop button aria/title per type;
  - status note `role="status"`, or `alert` for refresh/stop failure;
  - the Save bar text is `aria-live="polite"`.
- **Contrast:** labels and values `gray-900`/`gray-800`/`gray-600` on white; stop `red-500`;
  warnings `amber-700`; errors `red-600`.

## Motion And Transitions

- Drawer slides from the right: 200 ms ease-out in, 150 ms ease-in out. Page padding animates
  200 ms (not while dragging).
- Chevrons rotate in 150 ms. Spinners for preparing and launching.
- Reduced motion: transitions and spin disabled (`motion-reduce:`).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Agent/Team launch from New chat | First message starts the run with settings, overrides and mentions | Existing launch and send paths run against local fixtures: `CreateAgentTeamRun` answers with a new run per launch (`prototype/run-settings/launchedTeamFixture.ts`); the prototype socket plays the Team stream (connected, all idle, each message received, idle) | Mentions on the first message is a new requirement (REQ-012) |
| Org launch from the Org launch page | Run with root config + overrides | `orgLaunchDraftStore.launch` → the source's `agentOrgRun.launch` → local `CreateAgentOrgRun`; `prototype/run-settings/launchedOrgFixture.ts` serves each launched run (inspection, history, run config, empty member conversations) and the prototype socket plays its stream; Stop runs the source's stop against local `TerminateAgentOrgRun` | Real launch; production keeps or replaces the Org launch config store; the UI is normative |
| Other model settings | Codex Fast mode and future settings | Hand-written Codex models in the server parameter format: GPT-5.6 Sol (reasoning effort + `service_tier` Fast mode), GPT-5.6 Instant (Fast mode only), GPT-5.6 Mini (none) | Real catalog schemas (`codex-app-server-model-normalizer.ts`); launch/save carry `service_tier` in the model config |
| Start-surface tools | Files/Terminal for the chosen workspace | The shared right panel; the page provides the chosen workspace; demo files and terminal are synthetic | Real workspace files and terminal |
| Org "+" prefill | Source run settings | Reads `readAgentOrgRunInspection` + `buildEditableAgentOrgRunSeed` | Real read |
| Default model on the Org page | Initial card values | Org default → last chat model → default runtime's first model | Confirm with requirements (mirrors New chat) |
| Runtime catalogs | Model menus | Hand-written `prototype/run-settings/runtimeCatalogFixture.ts` (4 KB) | Real catalogs |
| AutoByteus Org | Realistic members | Hand-written `prototype/run-settings/autobyteusOrgFixture.ts` (10 KB; names only) | Real definitions |
| Stop run | Saved-run header | Terminate scripted to succeed; the open settings update; the tree is not updated in the reference | Real terminate; lifecycle refresh |
| Save saved-run settings | Save bar | Scripted local save | Existing save services |
| Review states | Design-only switches | `localStorage['autobyteus.design.runSettings.existingState']` = `refresh_required` / `model_unavailable`; `localStorage['autobyteus.design.runSettings.orgLaunchState']` = `launch_failed` / `unavailable` (reload after setting; remove afterwards) | Real reasons |

## Final Visual Reference Inventory

All captures were taken on 2026-10-05 after confirmation and final validation, in Chromium at
DPR 2. Each image is a frame of the recorded CSS width (1512-px captures are scaled 0.6 in the
frame). VIS-004, VIS-006..009 and VIS-011 are from the SR-001/round-31 captures and still match;
the others were recaptured after rounds 33–38. Phone is a 390 CSS-px frame.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Illustrative / Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001/008/009 / UIS-001 Daily Assistant | 804 | `visual-references/VIS-001-new-chat-daily-assistant-804.png` | Heading with chevron, hint, placeholder, four controls, no workspace line, tools icon top right (closed) | Names, model |
| VIS-002 | UXJ-002 / UIS-001 Team | 804 | `visual-references/VIS-002-new-chat-team-members-line-804.png` | Team heading with chevron, members line, tools icon | Names, counts |
| VIS-003 | UXJ-004 / UIS-001 customized | 804 | `visual-references/VIS-003-new-chat-team-members-customized-line-804.png` | "● 1 of 2 customized · Edit · Reset" after the drawer closed (focus on Edit) | Counts |
| VIS-004 | UXJ-004 / UIS-002 Team | 880 | `visual-references/VIS-004-member-panel-team-customized-880.png` | Drawer, Reset all, opened card, Customized, reset icon, field Reset | Names, models |
| VIS-005 | UXJ-003/004 / UIS-002 from the Org launch page | 804 | `visual-references/VIS-005-member-panel-org-launch-804.png` | Org drawer; placed team Customized with workspace + field Reset; MEMBERS; Coordinator | Org/team/member names (AutoByteus Org fixture) |
| VIS-006 | UXJ-006 / UIS-003 running | 880 | `visual-references/VIS-006-saved-team-running-stop-880.png` | Running badge + red stop icon; no note line; locks (tooltip text per type is specified in copy) | Names |
| VIS-007 | UXJ-006 / UIS-003 stopped, unsaved | 880 | `visual-references/VIS-007-saved-team-stopped-unsaved-880.png` | Stopped; editable; members follow; Save bar "· Cancel · Save" | Models |
| VIS-008 | UXJ-006 / UIS-003 model menu | 880 | `visual-references/VIS-008-saved-run-model-menu-locked-runtime-880.png` | Search, runtime label + lock, models, check | Models |
| VIS-009 | UXJ-006 / UIS-003 Org | 880 | `visual-references/VIS-009-saved-org-run-settings-880.png` | Org header, card, placed team with workspace and members | Names |
| VIS-010 | UXJ-002 / UIS-001 phone | 390 | `visual-references/VIS-010-new-chat-team-390.png` | Heading with chevron, composer fit, members line wraps, tools icon | Names |
| VIS-011 | UXJ-004 / UIS-002 phone | 390 | `visual-references/VIS-011-member-panel-team-390.png` | Full-width drawer, no resize edge | Names |
| VIS-012 | UXJ-003 / UIS-004 default | 804 | `visual-references/VIS-012-org-launch-page-804.png` | Org heading switcher; settings card with the round Run icon in its lower-right corner; members line centered; tools icon | Org name, counts, model |
| VIS-013 | UXJ-003 / UIS-004 failed | 1512 | `visual-references/VIS-013-org-launch-failed-1512.png` | Red error centered under the card (full text), values kept, Run enabled | — |
| VIS-014 | UXJ-003 / UIS-004 unavailable | 1512 | `visual-references/VIS-014-org-launch-unavailable-1512.png` | Heading, message, "Back to Agent Orgs" | Org name |
| VIS-015 | UXJ-003 / UIS-004 phone | 390 | `visual-references/VIS-015-org-launch-page-390.png` | Rows keep the full width ("Temp workspace" not truncated); Run pinned to the corner; approval on one line; members line wraps centered | Names |
| VIS-016 | UXJ-008 / UIS-001 switcher open | 804 | `visual-references/VIS-016-new-chat-target-switcher-804.png` | Open heading state, search "Search agents, teams and orgs", sections incl. "Agent orgs" with the building icon (list scrolled to the end) | Agent/team/org names and descriptions |
| VIS-017 | UXJ-009 / UIS-005 open | 1512 | `visual-references/VIS-017-new-chat-tools-open-1512.png` | New chat narrowed with the right tools docked (Files, Terminal, Activity, Token, Artifacts, close icon) | Terminal output |
| VIS-018 | UXJ-003 / UIS-004 launched | 1512 | `visual-references/VIS-018-org-run-after-run-1512.png` | Where Run lands: "New - AutoByteus Org" (live) under its workspace with its teams; "Choose an Agent or Team" | Names, workspace |
| VIS-019 | UXJ-002 / Team run after the first message | 1512 | `visual-references/VIS-019-team-run-first-message-1512.png` | The Team run with the coordinator focused, Idle, the first message shown, the run titled by it and dated "now" | Names, message |

| VIS-020 | UXJ-010 / UIS-001 Codex model, Fast off | 804 (shown at 666) | `visual-references/VIS-020-new-chat-codex-fast-off-804.png` | "GPT-5.6 Sol Codex ⌄ · 💡 Medium ⌄ · ⚡ Fast" (gray) | Model names |
| VIS-021 | UXJ-010 / UIS-001 Fast on | 804 (666) | `visual-references/VIS-021-new-chat-codex-fast-on-804.png` | ⚡ Fast blue on light blue, solid bolt | — |
| VIS-022 | UXJ-010 / UIS-001 only other settings | 804 (666) | `visual-references/VIS-022-new-chat-fast-only-model-804.png` | No Thinking chip; only ⚡ Fast | Model name |
| VIS-023 | UXJ-010 / UIS-004 Fast mode row | 804 (666) | `visual-references/VIS-023-org-launch-fast-mode-row-804.png` | "Fast mode" row under Thinking, chip on | Names |
| VIS-024 | UXJ-010 / UIS-002 member customized | 804 (666) | `visual-references/VIS-024-member-fast-mode-customized-804.png` | Team "Customized"; Reset on Fast mode only; Thinking inherited; other teams "· Fast ·" | Names |
| VIS-025 | UXJ-010 / UIS-003 running | 880 (666) | `visual-references/VIS-025-saved-run-running-fast-locked-880.png` | "Fast mode ⚡ Fast 🔒"; members "· Fast ·" | Names |
| VIS-026 | UXJ-010 / UIS-003 stopped, changed | 880 (666) | `visual-references/VIS-026-saved-run-stopped-fast-editable-880.png` | Fast toggled off (editable); members follow; Save bar | Names |
| VIS-027 | UXJ-010 / UIS-001 phone | 390 | `visual-references/VIS-027-new-chat-fast-on-390.png` | Icon-only ⚡ chip (on); Send inside the box | — |
| VIS-028 | UXJ-010 / UIS-004 phone | 390 | `visual-references/VIS-028-org-launch-fast-mode-390.png` | Fast mode row fits; rows keep full width | Names |
| VIS-029 | UXJ-010 / UIS-004 only other settings | 804 (666) | `visual-references/VIS-029-org-launch-fast-only-model-804.png` | "Thinking: Not available for this model" + "Fast mode" row | Model name |
| VIS-030 | UXJ-007 / UIS-001 `@` menu | 804 (666) | `visual-references/VIS-030-new-chat-at-menu-804.png` | "Bring into this run" header; Agents / Agent teams; relay footer | Names |
| VIS-031 | UXJ-003 / UIS-004 blocked | 804 (666) | `visual-references/VIS-031-org-launch-no-model-804.png` | "Choose a model" (amber) in the Model row; amber "Choose a model to start."; Run disabled | — |
| VIS-032 | UXJ-005 / UIS-004 copying | 804 (666) | `visual-references/VIS-032-org-launch-copying-settings-804.png` | Spinner + "Copying the run's settings…"; rows locked; Run disabled | — |
| VIS-033 | UXJ-005 / UIS-004 prefilled | 804 (666) | `visual-references/VIS-033-org-launch-prefilled-from-run-804.png` | The run's workspace, approval, model | Names |
| VIS-034 | UXJ-003 / UIS-004 starting | 804 (666) | `visual-references/VIS-034-org-launch-starting-804.png` | Spinner in Run; rows locked; "Starting {Org} on {runtime}…" | — |
| VIS-035 | UXJ-008 / UIS-004 switcher | 804 (666) | `visual-references/VIS-035-org-launch-switcher-open-804.png` | Same switcher; current Org checked | Names |
| VIS-036 | UXJ-009 / UIS-004 tools open | 1512 (666) | `visual-references/VIS-036-org-launch-tools-open-1512.png` | Org page narrowed; tools docked | Terminal output |
| VIS-037 | UXJ-006 / UIS-003 stopping | 880 (666) | `visual-references/VIS-037-saved-run-stopping-880.png` | Stop icon disabled/faded while pending | — |
| VIS-038 | UXJ-006 / UIS-003 stop failed | 880 (666) | `visual-references/VIS-038-saved-run-stop-failed-880.png` | Red "Couldn't terminate this run. Try again." | — |
| VIS-039 | UXJ-006 / UIS-003 read-only | 880 (666) | `visual-references/VIS-039-saved-run-read-only-880.png` | "This run's settings can't be changed."; all locked | — |
| VIS-040 | UXJ-006 / UIS-003 refresh | 880 (666) | `visual-references/VIS-040-saved-run-refresh-required-880.png` | Amber note + "Refresh" | — |
| VIS-041 | UXJ-006 / UIS-003 model unavailable | 880 (666) | `visual-references/VIS-041-saved-run-model-unavailable-880.png` | Amber "No longer offered by {runtime}…" under the model | — |
| VIS-042 | UXJ-005 / UIS-001 prefilled | 804 (666) | `visual-references/VIS-042-new-chat-prefilled-from-agent-run-804.png` | New chat for the run's agent with its workspace, approval, model | Names |

VIS-020..042 were captured on 2026-10-05 after the round-39 confirmation. The browser window was
666 CSS px wide, so 804/880/1512-px frames were scaled to fit (DPR 2 kept them sharp); the frame width
is the layout width.

Illustrative everywhere: agent, team, org, model and workspace names and descriptions, member
counts and the left navigation tree contents.

## Linked UI Reference Evidence

- Runnable UI reference: the design repository root, `corepack pnpm dev --port 4520`. Reset with
  `localStorage.clear()`.
- Ticket record: `product-ticket.md`
- Review rounds: `review-round-1.md` … `review-round-32.md`, `review-round-33-38.md`,
  `review-round-39.md`. SR-003 is in rounds 31–38; SR-005 in round 39; `review-evidence/round-31/`.
- Journeys UXJ-001..010; transitions TR-001..017.
- Limitations: in the automation browser, background tabs do not finish slide transitions (not a
  product issue).

## Implementation Fidelity Boundary

- **Must preserve:**
  - Agent/Team Run and "+" → New chat; Org Run and "+" → Org launch page;
  - the heading switcher on New chat and the Org launch page (Agents, Agent Teams, Agent Orgs;
    settings carried);
  - the start-surface tools icon (closed by default, docked or drawer, no strip, remembered, chosen
    workspace);
  - the members line and drawer (layout, copy, widths, limits);
  - flat two-line member rows with "Customized";
  - the Org page composition (heading switcher, card with the round Run icon in its corner, status
    line, members line) and states;
  - the saved-run header with the stop icon after the badge and the DEC-003 wording;
  - no standing note lines; the Save bar copy;
  - the runtime-locked model menu;
  - other model settings as their own controls next to Thinking (message-box chip, labelled row,
    per-setting Customized/Reset, locked while running, member summary label);
  - `@` = collaborator only, never Orgs, current excluded.
- **Removed surfaces that production should delete (REQ-018):**
  - the Agent/Team launch configuration forms and sub-forms (`AgentRunConfigForm`,
    `TeamRunConfigForm` and their sub-forms);
  - `DraftRunConfigEditor`;
  - the old Org launch form content (`AgentOrgRunConfigForm` and the long `AgentOrgRunConfigPanel`
    form), replaced by the Org launch page at the same route;
  - the pending-launch branch of `RunConfigPanel`; `useRunActions`;
  - the "Chat with" `@` mode; New chat's workspace line;
  - any Org-in-chat code (Org chat target, Org chat launch);
  - their localization keys.
- **Not prescriptive (UI reference internals):**
  - `components/run-settings/*` structure, including `memberSettingsSource.ts` and
    `orgLaunchDraftStore.ts`;
  - prototype plugin stubs; fixtures (`launchedTeamFixture.ts`, `launchedOrgFixture.ts`, the scripted
    prototype socket streams); scripted stop/save;
  - the Org config read through `apolloClient`.
- **May vary:** fixture names, counts and models; text rendering heights.
- **Design system:** existing Tailwind tokens and heroicons. Chat controls are reused with these
  additions:
  - `ChatModelMenu`: `runtimeLocked`, `placement`, `align`, `drillIn`;
  - `ChatThinkingControl`: `placement`, `align`;
  - `ChatWorkspaceMenu`: `placement`;
  - `ChatApprovalToggle`: the label never wraps.

## Out Of Scope

- Mobile paired-phone run setup; Applications launch profiles.
- Changing tool approval or workspace on a saved run (fixed, as in the product).
- Starting an Org from chat or `@`-mentioning an Org (SCN-009, unsupported by user decision).

## Open Decisions And Risks

- **Requirement impact (rounds 32/34):** the New chat and Org launch headings are one switcher for
  Agents, Agent Teams and Agent Orgs (settings carried; member overrides reset on a target change;
  only before starting). Orgs are reachable from New chat's heading but are still never chatted
  with. It needs a requirement and an AC.
- **Requirement impact (round 35):** start-surface tools behind one icon (UXJ-009). It needs a
  requirement and an AC.
- **Requirement impact (round 37):** the Org launch action label is "Run" (SR-003 said "Run Agent
  Org").
- **Requirement impact (SR-005, round 39):** REQ-022's provisional wording places other model
  settings in the Thinking menu with a combined summary ("Medium · Fast"). The confirmed design makes
  each one its own control next to Thinking (message-box chip, labelled row); the Thinking summary is
  unchanged and the member summary adds "Fast". Please align REQ-022 / AC-019 wording.
- **Follow-up question (not in this design):** an optional Org "entry point" (one team or agent
  where Run lands and the first message goes). Discussed with the user as an idea only; it would
  change the Org model and partly reopen DEC-004.
- **Org page default model order** (Org default → last chat model → default runtime's first model):
  mirrors New chat; confirm in requirements.
- **Members line count:** "n of N customized" counts customized agents and placed teams against N
  agent members.
- **Pre-existing fixture gaps:**
  - F-001: about 7 MB of captured store snapshots (data-boundary correction recommended separately);
  - F-003: legacy `workspace_*` scenarios;
  - F-004 (resolved): Run now opens the launched Org run in the reference.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual
  reference: `Yes`. Since SR-005 the secondary states (blocked, copying, prefilled, starting,
  stopping, stop failure, read-only, refresh, model unavailable, `@` menu, "+" prefill) also have
  visuals (VIS-030..042).
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals have no unintended placeholders, clipping, overlap, or drift: `Yes`
- Every visible detail is requirements-defining unless marked illustrative: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
