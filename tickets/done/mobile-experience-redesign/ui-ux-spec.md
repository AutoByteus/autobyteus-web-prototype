# UI/UX Specification — The Phone (`/mobile`): Your Runs With Their Delegated Work, One Slim Run Screen

Canonical contract for the AutoByteus mobile web shell (`/mobile`, wrapped by the Android shell; iOS later) after the redesign. The final screenshots in `visual-references/` are normative: every visible detail is a requirement unless this document marks it illustrative. Run names, agent and team names, node names (`docker`, `office-mac`), ages, message and file texts, and the node name "Embedded Node" in them are **illustrative** (invented; the product shows the paired node's own name, for example "AutoByteus Desktop"). The desktop is unchanged.

## Status And User Confirmation

- Status: `Approved` (2026-11-06): "okayyy. everything is good now. i approve". DEC-003 and the composer row were not answered separately; they are recorded under Decisions as approved through the design as built.
- Request / ticket: `mobile-experience-redesign` (Project Task `autobyteus-277`, Project `project_a1377344-25db-482a-97cc-ecfdb0fb495a`). No second ID.
- Related requirements revision ID: `SR-003` (the user-approved requirements of `requirements-doc.md`; this design was first written against `SR-001`).
- Related IDs: REQ-001…REQ-009; BEH-001…BEH-006; AC-001…AC-010; DEC-001…DEC-006; follow-up FU-001 = Project Task `autobyteus-391`.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`).
- Review URL: the product's normal entry point, `http://127.0.0.1:3277/mobile` (the user's phone: `http://100.127.30.107:3277/mobile` over Tailscale). No preview switch.
- Explicit user-confirmation reference (the user, in the Product UI/UX Designer's conversation, 2026-11-06): final approval "okayyy. everything is good now. i approve", after "Perfect, I think I just experienced it and the user experience is really nice. … I'm fine with the user experience now." His design decisions during the review are under Key UX decisions.
- Final check date: 2026-11-06.
- As shipped: implemented, merged into `personal` (`562c7a2333`) and released in `v1.5.12-beta.4`. Two points differ from the first approved screenshots, both decided by the user during engineering and now reflected in this spec and in the retaken screenshots (VIS-001…006, 024…026): **DEC-009** (placement) "follow how it is from the desktop": a task agent started by a team member sits at the same level as the member, not under it; **DEC-010** (the second line): a row's second line shows only real data (a Task's summary or a remote run's title), members show just their name.

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`; software worktree read (read only): `/Users/normy/autobyteus_org/autobyteus-worktrees/mobile-experience-redesign` (branch `codex/mobile-experience-redesign`, base `origin/personal@e00581d485`).
- Selected frontend: `autobyteus-web`, the `/mobile` shell (`pages/mobile.vue`, `components/mobile/*`, `composables/mobile/*`, `stores/mobileWorkStore.ts`).
- Pinned source revision: baseline `origin/personal@d74f75a51a`; checked against `e00581d485` for the phone shell (see the ticket record): the shell files match except the Team messages screen's loading and unavailable states (autobyteus-358), a known baseline gap on a screen this design keeps. Engineering keeps the source's behavior there.
- Accepted design base: `a0e18abb49320c8f3c4ad5cfad830863ca6684df`.
- UI reference revision: ticket branch `design/mobile-experience-redesign` (the committed revision is in `product-ticket.md`).
- Ticket folder: `tickets/done/mobile-experience-redesign/` (design repository).
- Baseline report: `ui-baseline-report.md` (repository root).

## Problem And Design Rationale

- **User problem and intent.** "currently the mobile experience is really bad. for example, i can not see the task agent or agent team, many problems, ui experience also not good enough." The phone showed a flat list of top-level runs only; delegated task agents and task teams (and Org runs, and runs on other nodes) were invisible. Navigation spread over Home, a "Switch work" sheet and five bottom tabs, with three copies of the run list; fixed headers, cards inside cards and static controls took the screen. He uses the phone outside for a few things: see what is running, answer, approve, start a task, read results.
- **The worst problems he named** (his words, with his screenshots; secrets none):
  1. The Home header "AUTOBYTEUS REMOTE ACCESS / AutoByteus" and Refresh: "Do we really need this … we have two words … take quite a lot of the header … redundant words should be removed."
  2. Fixed bars on the run screen (the sibling strip, the dropdown plus the menu): "the event monitor area, you want to make it as big as possible … you don't want to make those static things which are always on screen because they are not used very often."
  3. "Results" is unclear; why "select an active run" under Artifacts: the screens belong to the current agent.
  4. Vertical space: "on the phone, vertical space is very … a treasure" (Artifacts header).
  5. New run: "extremely hard to select new agents … so small area and you have to scroll a lot"; "different … roles, you have a run, you have folder … not clean"; a system dropdown "not very good".
  6. Activity: messages and activity in one screen with chips: "message is message, activity is activity".
  7. A card "Opening conversation / Choose work / Open Runs" in the middle of a run: "what's the logic?" (a leftover of the old shell).
  8. Switch agent and Back to the delegator in the menu: not needed, "there's already a navigation, the backward".
  9. Messages without file references (the desktop has them).
  10. Files: a fixed search box and filters: "we do not have any filter" on the desktop.
  11. The start button: "just a plus … the plus in the middle".
  12. The member count next to a team: "distracting".
  13. Borders between runs: "why?".
- **Key UX decisions and why** (most are the user's own):
  1. **One main screen: the run list.** It is the desktop Runs view of autobyteus-385 on a phone: every non-archived Agent, Team and Org run, newest first by last activity, the newest 5 then "Show older (N)", with the delegation tree under each run (task agents and task teams under an Agent run; members under a Team and an Org run; a task agent a member started at the member's own level (DEC-009); runs on other nodes with their node's chip). No Workspaces or Projects views and no switch between views (the user: "we don't have to have this kind of different workspace, project views switch"; most of the time you talk to one orchestrating agent that delegates).
  2. **A tap on any row opens that agent's conversation with its composer**; a team or Org run opens its coordinator (its first member), as the desktop's target resolver does.
  3. **The run screen is one 56px bar and the full conversation.** Back (←), the agent's name with its state and where it is ("Idle · in Software Engineering Team"), and one ⋮ menu: Artifacts, Files, Messages (members of a team or Org only), Activity. Nothing else is fixed on the screen. Moving to another agent or to the delegator is ← to the run list (which keeps its scroll position and marks the open run) and one tap on the row.
  4. **New run is for agents only** (the user: "For new run we only support to create a simple agent run"), five uniform rows and one button; every choice opens the same bottom sheet.
  5. **Start work is one round "+" button** (bottom right, within thumb reach, no words).
  6. **Connection, pairing status, peers and unpair are one bottom sheet** opened from the node name in the top bar (the old Home status card and Troubleshoot page are gone).
  7. **Nothing the desktop does not have** (the user's rule): no Files filters, no "Attach" button on a file, no run counts, no mobile-only labels.
- **Alternatives considered and why they were rejected.**
  - Five bottom tabs plus a Home screen: rejected by the user; three copies of the run list.
  - A sibling strip and a tree sheet on the run screen (built, shown in review, removed by the user): static or rarely used controls on the conversation.
  - A "Results" screen with Artifacts | Files | Activity tabs (built, removed by the user): unclear name, one more level.
  - Agent | Team toggle with an inline list in New run (built, replaced): hard to use on a phone.
  - A Files filter sheet (Recent, Attached, Markdown/code, whole-workspace switch; built, removed by the user): the desktop has no filters.
  - A card per run with borders between runs (built, removed): noise; the rail beside delegated work shows the group.

## Scope And Experience Goal

- **User or actor:** the user outside his desk, on his Android phone (iOS later through the same web shell), connected to his paired node over Tailscale.
- **Context:** the `/mobile` web shell served by the paired node; phone viewports 360–430 CSS px wide.
- **Goal:** see what is running and what it delegated (including work on other nodes), open and talk to any of it, answer, approve, start an agent run, read results (artifacts, files, messages, activity) — on one hand, with the screen used for content.
- **Observable success:** on the phone, a Project Task Manager run shows its task agents and task teams under it with members and live states, including runs on another node; a tap opens that agent's conversation with a composer.
- **In-scope surfaces and journeys:** UXJ-001…UXJ-008 below.
- **Non-goals:** the desktop; pairing, re-pairing and the pairing screens (unchanged, baseline); Android shell changes; iOS shell work; push notifications; remote files, terminal; editing definitions; a switch between several paired nodes (FU-001, autobyteus-391); starting a run directly on a peer node (DEC-003 option C).

## What Is Not On The Phone (DEC-004)

The user's direction (2026-11-06): the phone shows the runs view only, no Workspaces or Projects views; New run only creates an agent run; Files has no filters; no explanatory text for an absent feature. The approved list:

- **On the phone:** runs with their delegation tree (local and remote); the agent's conversation (talk, answer, approve, stop through the shared composer); New run (an agent); Artifacts, Files (read, search), Messages, Activity of the open agent; the connection sheet (status, check, read-only peers, unpair); pairing and its troubleshooting as today.
- **Not on the phone (simply absent, no filler):** the Workspaces and Projects groupings and any view switch; editing agent, team or Org definitions; starting a Team or an Org run; Archive, Delete and Stop on rows; settings and updates; terminal, VNC, browser, applications; the folder picker (a folder is chosen from the list or opened by path); Files filters (Recent, Attached, Markdown/code); an "Attach to chat context" button on an opened file (the desktop's file panel has none; the composer's own + attaches); a Home screen; a "Switch work" sheet.
- A desktop route opened on the phone keeps today's notice (`?unsupported=…`), shown above the run list.

## Related Requirements And Acceptance Criteria

| ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-001 / AC-001 | The same runs and order as the desktop Runs view; newest 5, then "Show older (N)"; empty state | UXJ-001; UIS-001; VIS-001, 003, 004, 022 |
| REQ-002 / AC-002 | Delegated task agents and task teams, members, Org members under their run, each with its live state | UXJ-001; VIS-001, 002 |
| REQ-003 / AC-003 | Tapping any row opens that agent's conversation with its composer | UXJ-002; VIS-005, 014 |
| REQ-004 / AC-004 | A run on another node sits under its delegator with the node's chip; unreachable node: clear state, never blocks the list | UXJ-003; VIS-001, 020 |
| REQ-005 / AC-005 | One navigation designed for a phone; touch targets ≥ 44×44 CSS px; no horizontal scrolling at 360×800 | all; VIS-025…028 |
| REQ-006 / AC-006 | Start work in one tap from the main screen; configure → create → first message in Chat | UXJ-004; VIS-001, 015…018 |
| REQ-007 / AC-007 | Read a run's results (artifacts, files) | UXJ-005; VIS-007…011 |
| REQ-008 / AC-008 | Remote nodes on the phone per DEC-003 (option A built; B is autobyteus-391) | UXJ-003, UXJ-006; VIS-019, 020 |
| REQ-009 / AC-009 | Only the approved features appear; no filler | "What is not on the phone"; the whole reference |
| QR-001 | Touch targets ≥ 44×44; text ≥ 12px except badges | Visual Language |
| QR-002 | No mobile-only explanatory filler | Content |

## Visual Language

Existing language preserved: the mobile shell's slate neutrals with blue-600 as the one primary (Tailwind `slate-*`, `blue-600`), the system font, the shared conversation view and composer, the shared status dot colors (`utils/workspaceStatusDotPresentation.ts`), the remote node chip (`RemoteNodeChip`) and the remote-run notice (`RemoteRunNotice`). The redesign removes cards, nested boxes, large radii and shadows from the changed screens: flat white screens, hairlines, one primary color.

- **Layout.** Every screen is a full-viewport column (`100dvh`): a bar, a scrolling body, nothing else fixed except the "+" button on the run list, the composer on the run screen, and "Create run" on New run. Safe-area insets are respected (`env(safe-area-inset-bottom)`).
- **Bars.** Run list bar 56px (white, 1px `slate-200` bottom border): the node button (32px circle `slate-100` with a computer icon and a 10px status dot with a 2px white ring; name 16px/600; state 12px `slate-500`, amber-700 when not reachable; a 16px chevron `slate-400`), 48px tall target. Run screen bar 56px: ← (48×48), a 10px status dot, the name 16px/600 (one line, truncated), the line below 12px `slate-500` (state · "in <parent>"; for a run on another node the node chip first), ⋮ (48×48). Artifacts, Messages, Activity and the reference viewer bars 48px: ← and the title 16px/600. Files bar 48px: ←, "Files", a search icon (48×48).
- **Run row.** Top-level row min-height 64px (padding 12px 0 12px 16px); delegated row 56px. Left: an avatar (top-level 36px, delegated 28px; agents and members: initials in a `slate-200` circle, 12px/11px 600 `slate-600`; teams: the people icon in a `slate-100` circle; Org: the building icon in a `slate-100` rounded square) with a status dot at its bottom right (10px, 2px ring white, or `blue-50` when the row is the open run): `blue-500` pulsing running, `green-500` idle, `amber-500` pulsing starting, `red-500` error and a run on an unreachable node, `gray-400` stopped. Text: the name 15px/500 (teams and Orgs 600) `slate-900`, one line; the second line 13px `slate-500`, one line, only real data: a run's title, a Task's summary, a remote run's title (a team or Org member shows just its name, centered on its row; DEC-010); for a run on another node a third line with the node chip (`RemoteNodeChip`, 10px text, `slate-100`) and, when unreachable, "Not reachable" 12px/500 `red-700`;. The age (top-level rows only) 12px `slate-400`, top right ("now", "6m", "2h", "3d", "1w"). The open run's row is `blue-50`.
- **Tree.** A run's delegated work and members are a nested list: a 1px `slate-200` vertical rail with its left margin 34px under a top-level row (aligned to the avatar's center) and 20px at deeper levels; no separators between rows or runs; no counts. A chevron button (48×48, `slate-400`, 20px, rotated −90° when folded) at the right of a row that has children; tapping the row's body opens the conversation, tapping the chevron folds or unfolds. Default: a run with delegated work and an Org run are unfolded, a team's members are folded. Folding never stops anything. 
- **"+" button.** 56px circle `blue-600` (pressed `blue-700`), a 28px white plus, `shadow-lg` tinted blue-900/25, fixed 16px from the right and `max(16px, safe-area)` from the bottom; accessible name "New run". The list has 112px bottom padding so the last row clears it.
- **Fold row.** "Show older (N)" / "Show fewer": a 48px tall centered button, 14px/600 `blue-700`, under the list.
- **⋮ menu.** A popup under the ⋮ at the right edge: 288px wide, `rounded-xl`, 1px `slate-200` border, `shadow-lg`, white; items 48px tall, 15px `slate-800`, a 20px `slate-500` icon, 16px side padding; a click outside closes it. Items in this order: Artifacts, Files, Messages (only for a member of a team or Org), Activity.
- **Bottom sheets** (the connection sheet and every New run choice): the backdrop `slate-900` at 40%, the sheet white with `rounded-t-2xl`, a 40×4px `slate-300` handle, a 56px header (title 18px/600, a 48×48 close), at most 85% of the screen height, as tall as its content; rows min 56–60px, 16px/500 `slate-900`, a secondary line 13px `slate-500`; the chosen row `blue-50` with a 24px `blue-600` check, scrolled into view when the sheet opens; section headings (12px/600 uppercase `slate-500`, sticky) only when there is more than one section; a 48px search field when there are more than six rows. A footer (the folder sheet) is a 48px field and a 48px blue "Open" button.
- **New run rows.** One pattern for every row: 56px, label left (15px `slate-500`, a 96px column), value right (16px/500 `slate-900`, one line, truncated; blue-700 "Choose" when empty), a 20px chevron `slate-300`, a 1px `slate-100` line under. "Auto approve tools" is the same row with a switch (56×32 track, `blue-600` on and `slate-300` off, a 24px white knob). "Create run": 56px tall, full width, `blue-600`, 16px/700 white, `rounded-2xl`, anchored at the bottom on a white strip.
- **Files.** Path line 44px tall, 14px, `workspace › folder › …` scrolling horizontally, the last part 600 `slate-900`, the others `slate-500` (each tappable), a 1px `slate-100` bottom line. Rows min 56px: a 24px folder icon (`amber-400`) or file icon (`slate-400`), the name 15px/500 (the path 12px `slate-500` only in a search), a chevron on folders. Search: the bar's title becomes a 40px field (`slate-100`, `rounded-lg`, 16px text, "Search files") with a 48×48 ✕.
- **Messages.** Rows with 16px padding, a bottom line `slate-100`: "From <name>" or "To <name>" 15px/600 and the time 12px `slate-400` on one line, the text 15px/24px `slate-700`, then each file reference as a 44px row (the file type icon, the name 14px/500). Activity rows: the tool name 15px/600 and its state chip right, the context line 14px.
- **Remote notice.** The product's `RemoteRunNotice` (red-bordered, `red-50`) at the top of a run on an unreachable node, in place of the conversation and the composer.
- **Focus.** The product's 2px indigo/blue ring on keyboard focus (`focus-visible:ring-2`); touch uses the pressed backgrounds above (`active:bg-slate-100`).

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Run list screen | The only main screen | populated, loading, empty, read error, node not reachable, notice (unsupported route) | `components/mobile/MobileRunsScreen.vue` |
| Run row (recursive) | A run or a delegated child with its tree | agent, team, Org, member; idle, running, starting, error, stopped; folded, unfolded; open; remote (reachable, not reachable) | `MobileRunRow.vue`, `stores/mobileRunTreeStore.ts` |
| Run screen | One agent's conversation | root run, delegated child, team member, remote not reachable, "Opening…" | `MobileRunScreen.vue`, `MobileChat.vue` |
| ⋮ menu | The agent's other views | with or without Messages | `MobileRunScreen.vue` |
| View screens | Artifacts, Files, Messages, Activity, a reference file | populated, empty, remote note | `MobileResults.vue`, `MobileArtifacts.vue`, `MobileFiles.vue`, `MobileTeamMessages.vue`, `MobileRunActivityList.vue`, `MobileTeamReferenceViewer.vue` |
| New run | Start an agent run | preselected, choosing, creating, blocked, error | `MobileNewRun.vue`, `MobileRunSetup.vue` |
| Choice sheet | Agent, Folder, Runtime, Model | list, search, footer | `MobileLaunchTargetPicker.vue` |
| Connection sheet | Status, check, peers (read-only), unpair | connected, not reachable, checking | `MobileConnectionSheet.vue` |

Removed (no longer in the product's phone shell): Home, the work shell with its five bottom tabs, the "Switch work" sheet, the Runs tab, the team member focus bar, the Troubleshoot page, the combined Activity screen.

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | The user, paired, node reachable | Opens the app | See what is running and what it delegated | The run list with its tree and live states | REQ-001, REQ-002; AC-001, AC-002 |
| UXJ-002 | The user | A delegated child exists | Talk to it, answer, approve | Its conversation with the composer; ← returns to the list | REQ-003; AC-003 |
| UXJ-003 | The user | A run delegated to a peer node | See and talk to work on another node | The remote row under its delegator; opened like a local one; not reachable: a clear state | REQ-004; AC-004 |
| UXJ-004 | The user | Anywhere in the list | Start an agent run | A new run at the top of the list; its Chat open for the first message | REQ-006; AC-006 |
| UXJ-005 | The user | A run open | Read results | Artifacts, Files, Messages or Activity of that agent | REQ-007; AC-007 |
| UXJ-006 | The user | Anywhere | Check the connection, see peers, unpair | The sheet; unpair confirm | REQ-008 |
| UXJ-007 | The user | The list is empty, loading, failed, or the node is down | Recover | The state's action | AC-001 |
| UXJ-008 | The user | A 360×800 phone | Use every screen without horizontal scrolling | Same screens, no horizontal scroll | AC-005 |

## Journey Details

### UXJ-001 — The run list

1. Open the app (paired): the run list is the first screen. Top bar: the node's name and its state. Rows newest first by last activity; the newest 5 runs show, then "Show older (N)".
2. A run with delegated work is unfolded: its task agents and task teams are nested under it (rail, no counts); a task team shows folded (chevron); tap the chevron to see its members; a task agent started by a member sits at the member's level, not under it (DEC-009). A run on another node carries its node's chip.
3. Each row shows its live state as a dot. VIS-001, 002.
4. "Show older (N)" opens the rest in the same list ("Show fewer" closes). VIS-003, 004.

### UXJ-002 — Open any run

1. Tap a row's body. The run screen opens: the bar (← , the agent's name, state and "in <parent>", ⋮), the conversation, the shared composer. A team or Org run opens its coordinator. While the conversation attaches the screen says "Opening…" only. VIS-005, 014.
2. Send, answer, approve through the shared conversation and composer (unchanged). After a new run's first message the run keeps its place and stays open (its id changes).
3. ← returns to the list at the same scroll position with the run marked. To go elsewhere: tap another row. No sibling strip, no delegator shortcut, no tree sheet.

### UXJ-003 — A run on another node

1. The row sits under its delegator with the node's chip (`docker`). It opens and is talked to like a local one through the paired node (278: text-only composer; no files or terminal on that node).
2. Not reachable (`office-mac`): the row stays, its dot is red, "Not reachable" next to the chip; opening it shows the remote notice ("<node> isn't reachable … Retry when the node is back") and no composer; the other runs work. Artifacts and Files of a remote run say the files are on that node (the desktop's wording). VIS-020.

### UXJ-004 — New run

1. Tap the round "+" (bottom right). New run opens: five rows. Agent is preselected (the agent of the run you came from, else the Project Task Manager, else the first agent); Folder the first folder; Runtime and Model their defaults; Auto approve tools its default. VIS-015.
2. Tap Agent, Folder, Runtime or Model: a bottom sheet with the list (search when long); one tap picks and closes. The Folder sheet's footer opens a folder by its path. VIS-016…018.
3. "Create run" (disabled with the reason shown when something is missing, for example "Choose a model before creating the run.") creates the run and opens its Chat; the first message is sent there. The new run is listed at the top.

### UXJ-005 — Read results

1. On a run, ⋮ → Artifacts, Files, Messages (members of a team or Org) or Activity. Each opens its own screen with a 48px bar (← and the title). ← returns to the conversation. VIS-006…013.
2. Artifacts: the artifacts of that agent (one: no list, the viewer's bar shows the name; several: 44px one-line rows). Files: the tree, one search field over the workspace, no filters; a tapped file opens full screen on a 48px bar (← and the name) with nothing else. Messages: the team messages with their file references; tapping a reference opens the file full screen (← closes it). Activity: the agent's tool calls. Empty: one line ("No Artifacts yet", "No messages yet", "No activity yet").

### UXJ-006 — Connection

1. Tap the node name (top bar). The sheet: the node's name and URL, its state, "Check connection", **Peer nodes** (read-only: name, reachable or not, what it offers — "6 agents · 3 teams"), "Unpair this phone". VIS-019.
2. "Unpair this phone" opens the baseline confirmation ("Unpair this phone?", Cancel, Unpair); unpairing shows the pairing screen (unchanged).
3. Not reachable: the top bar says "Not reachable" in amber and a banner under it says "Can't reach <node>." with "Check" (opens this sheet). VIS-024.

### UXJ-007 — States

Loading: six placeholder rows. Empty: "No runs yet / Start with New run. Work an agent delegates appears under its run and leaves when it is done." Read error: "Couldn't load your runs." and Retry. VIS-021…024.

### UXJ-008 — Small phone

The same screens at 360×800: no horizontal scrolling (checked: the document is 360 px wide), long names truncate, targets stay ≥ 44×44. VIS-025…028.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Run list | `/mobile` | See runs; open one; "+" | Bar, optional banner and notice, the tree, fold row, "+" | VIS-001…004, 021…025 |
| UIS-002 | Run screen | tap a row | Talk to that agent | Bar, conversation, composer | VIS-005, 014, 020 |
| UIS-003 | ⋮ menu | ⋮ on the run screen | Open the agent's views | Popup, 3–4 items | VIS-006, 026 |
| UIS-004 | Artifacts | ⋮ → Artifacts | Read the agent's artifacts | 48px bar, viewer | VIS-007 |
| UIS-005 | Files and an opened file | ⋮ → Files | Browse, search and read files | 48px bar, path line, rows; an opened file: a 48px bar (← and the name) and the file full screen | VIS-008, 009, 029 |
| UIS-006 | Messages and a reference file | ⋮ → Messages | Read team messages and their files | 48px bar, rows, references; file viewer | VIS-010, 011, 027 |
| UIS-007 | Activity | ⋮ → Activity | Read the agent's tool calls | 48px bar, rows | VIS-012, 013 |
| UIS-008 | New run | "+" | Start an agent run | 48px bar, five rows, Create run | VIS-015, 028 |
| UIS-009 | Choice sheet | a New run row | Choose an agent, folder, runtime or model | Bottom sheet | VIS-016…018 |
| UIS-010 | Connection sheet | the node name | Connection, peers, unpair | Bottom sheet | VIS-019 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Next Available Actions |
| --- | --- | --- | --- | --- | --- |
| TR-001 | List | Tap a row body | Row pressed `slate-100` | Run screen (a team/Org: its coordinator); history entry added | ⋮, composer, ← |
| TR-002 | List | Tap a chevron | Chevron rotates | Children shown or hidden | — |
| TR-003 | List | "Show older (N)" | Rows appear | The button reads "Show fewer" | — |
| TR-004 | List | "+" | — | New run | — |
| TR-005 | List | The node name | — | Connection sheet | Check, unpair, close |
| TR-006 | Run screen | ← or the system Back | — | The list, same scroll, run marked | — |
| TR-007 | Run screen | ⋮ | Menu appears | Menu | an item; tap outside closes |
| TR-008 | Menu | Artifacts, Files, Messages, Activity | Menu closes | That screen (history entry added) | ← |
| TR-009 | Messages | A file reference | — | The file full screen | ← closes the file |
| TR-010 | Files | The search icon | The title becomes a focused field | Search | ✕ closes search |
| TR-011 | Files | A folder row or a path part | Path line updates | That folder | — |
| TR-012 | New run | A row | A bottom sheet | The sheet | one tap picks and closes |
| TR-013 | New run | Create run | "Creating…" | The new run's screen; listed at the top | first message |
| TR-014 | Run screen | First message of a new run | The conversation continues | The run keeps its place with its permanent id | — |
| TR-015 | Run on an unreachable node | Open | The remote notice | Retry (re-checks) | ← |
| TR-016 | Run screen | The conversation is not attached | "Opening…" | Attached automatically | — |
| TR-017 | Run list, read error | Retry | Loading rows | The list | — |
| TR-018 | Connection sheet | Unpair this phone | Confirmation | The pairing screen | — |
| TR-019 | Files | A file row | "Opening…" until it loads | The file full screen on a 48px bar (← and the file name), no Attach button, no card; ← returns to the folder | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| List, populated | Runs exist | As Visual Language | open, fold, "+", node | — | VIS-001…004 |
| List, loading | First read | Six placeholder rows (avatar and two lines, pulsing) | "+" | — | VIS-021 |
| List, empty | No run | "No runs yet" / "Start with New run. Work an agent delegates appears under its run and leaves when it is done." | "+" | — | VIS-022 |
| List, read error | First read failed | "Couldn’t load your runs." and Retry | Retry, "+" | Retry | VIS-023 |
| Paired node not reachable | Node down | The bar's second line "Not reachable" (amber); a banner "Can’t reach <node>." with "Check" | Check, open runs as last loaded | Check connection | VIS-024 |
| Remote row, not reachable | Peer down | Red dot, node chip, "Not reachable" | open (notice) | Retry | VIS-001, 020 |
| Run, conversation not attached | Switching, Back/Forward | "Opening…" (12–14px `slate-400`, centered), no buttons | — | automatic | — |
| Artifacts / Messages / Activity empty | Nothing yet | "No Artifacts yet" (with "Generated or edited files for this run will appear here as they become available."), "No messages yet", "No activity yet" | ← | — | VIS-012 |
| New run, blocked | Something missing | One amber line with the reason (for example "Choose a model before creating the run.") above the disabled button | the row | fix it | — |

## Content, Labels, Validation, And Feedback

- Wording follows the product's voice: short, no explanation of what is absent, no internal words ("hydration", "context").
- Labels: bar titles "Files", "Artifacts", "Messages", "Activity", "New run"; New run rows "Agent", "Folder", "Runtime", "Model", "Auto approve tools"; button "Create run"; sheets "Agent", "Folder", "Runtime", "Model"; fold "Show older (N)" / "Show fewer"; connection sheet "Check connection", "Peer nodes", "Unpair this phone"; search "Search files"; folder footer "Open a folder by path" / "Open".
- Run states in the run screen's second line: Running, Idle, Starting, Error, Stopped; "· in <parent name>" when delegated.
- Remote texts are the product's (278): chip "Runs on <node>" (accessible name), "<node> isn't reachable", "This run's conversation can't be loaded right now. Your other runs work. Retry when the node is back.", Retry.
- Pairing, unpair confirmation, the unsupported-route notice: baseline text (the notice's desktop-workspace line reads "The desktop workspace isn’t on the phone. Your runs are here.").
- No form validation beyond the baseline's New run readiness messages and the folder-path load error ("Open a folder by path" shows the product's error under the field).

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Phone | 360–430 CSS px wide | One column; the screens above | Touch targets ≥ 44×44; the system Back key walks: View screen → Run screen → List (each screen adds a history entry) |
| 360×800 | smallest supported | Same; long names truncate; no horizontal scroll | — |
| Android WebView / iOS WKWebView | shared web shell | Only standard web APIs (`history`, `dvh`, `env(safe-area-inset-*)`); no Android-only API | The "+" and the composer respect the bottom safe area |
| Desktop | any | Unchanged (not part of this design) | — |

## Accessibility And Keyboard Behavior

- Target: touch targets ≥ 44×44 CSS px (QR-001); text ≥ 12px except badges and chips.
- The list is a tree: the list has `role="tree"` and the name "Your runs", each row `role="treeitem"` with `aria-level`, `aria-expanded` for a row with children and `aria-current` for the open run; each row's button has an accessible name (name, title, node, state); the chevron "Show/Hide members (delegated work) of <name>".
- The "+" is "New run". The ⋮ is "More" with `aria-haspopup="menu"` and `aria-expanded`; the menu `role="menu"` with `menuitem`s. Bottom sheets are `role="dialog"` `aria-modal` with the heading as their name; the close button "Close"; the switch has `role="switch"` and `aria-checked`.
- Focus: opening a sheet or search moves focus into it (search field focused); closing returns it to the control; the Files search field is focused on opening.
- Contrast: the amber (`amber-700` on white), red (`red-700`) and `slate-500` secondary texts are at least 4.5:1 on white; the status dot is never the only signal (the state is also in the accessible name and the run screen's second line).

## Motion And Transitions

- The product's existing motion only: the running dot pulses (`animate-pulse`), the chevron rotates 90° with `transition-transform`, the switch knob slides with `transition`, loading rows pulse. Screens change without a slide.
- Reduced motion: the pulse and the transitions follow the user's reduced-motion setting (the product's default behavior).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| The run list and its tree | Rows, order, fold, delegation | A design-only store and fixture (`stores/mobileRunTreeStore.ts`, `prototype/mobile-runs/mobileRunsFixture.ts`): 17 invented runs with delegated work (local, `docker`, `office-mac`) | Product: the desktop Runs view's own read window and projection (`runListStore`, `runListProjection`, the collaboration store) — one owner shared with the desktop |
| An opened run's conversation | Run screen | An invented stored conversation per run; the real conversation view and composer | The desktop's target resolver (`activeContextStore.activeWorkspaceTarget`) for any child, local or remote |
| Remote runs | Chip, not-reachable state, notice | Fixture: `docker` reachable, `office-mac` not | 278: the paired node relays; the composer is text-only for a remote run (the reference shows the shared composer unchanged: a known gap of the reference) |
| Peer nodes list | Connection sheet | Fixture (`docker` 6 agents · 3 teams, `office-mac` not reachable) | The paired node's `peerNodeOffer`, availability |
| Messages, Activity, a reference file | Screens | Invented rows and file texts (`sampleTeamMessages`, `sampleToolActivities`, `sampleReferenceText`) | The team context and the run's stream; the file read through the team's message |
| Files search | Files | Looks through the files of the loaded tree | The workspace search on the node |
| An opened file | Files | After a moment the viewer shows invented text (`sampleReferenceText`; the reference has no file service) | The file read through the authorized workspace file API; "Opening…" while it loads; "Couldn’t open this file." on an error; "This file can’t be shown on the phone." / "too large" |
| First message of a new run | Run keeps its place | Re-keyed by the shell | The run's id changes at its first message; the phone's selection must follow it |
| Node name "Embedded Node" | Bar, sheet | The baseline's sample value | The paired node's own name ("AutoByteus Desktop") |
| Scenario starting states | Review | `autobyteus.prototype.scenario`: `mobile_runs_loading`, `mobile_runs_empty`, `mobile_runs_error`, `mobile_runs_node_offline`; the first visit installs an inert paired session (`autobyteus.prototype.mobileSeeded`) | — |

## Decisions

| ID | Question | The user's answer | Status |
| --- | --- | --- | --- |
| DEC-003 | How far remote nodes go on the phone | Not stated separately. Approved through the design as built: **A** (the paired node only: remote delegated runs under their delegator, see and talk, a read-only peer list). His interest in B, in his words: "if we are able to pair with multiple ones, we can just switch between different nodes, right? That would be very convenient." **B** (switch between several paired nodes inside the page) is the follow-up Task **autobyteus-391** (FU-001; not started; it waits for his word). One phone can already be paired with several nodes (one session per node origin); the missing piece is a "Switch node" entry in the web shell, a small Android bridge, no new permission. **C** (start a run on a peer) has no API. | Answered by the approval (A); B waits as autobyteus-391 |
| DEC-004 | What is not on the phone | His direction in the review, in his words: "on the mobile version … there's no need to switch between … a different workspace or project"; "For new run we only support to create a simple agent run"; no filters on Files ("we do not have any filter" on the desktop); the Attach button removed. The list under "What Is Not On The Phone" is approved with the design. | Answered |
| DEC-005 | A "needs you" marker on runs waiting for an answer or approval | The user, 2026-11-06, after seeing it: "I suggest that don't like hallucinate and invent things up, remove those, please … Those are not possible in the application, I think." **Removed from the design** (it was an optional, unproven idea with invented texts); the screenshots were retaken without it. If it is ever wanted, it needs its own Task: the app has no status for a run waiting on the user. | Dropped |
| — | Compact composer | Not designed; the shared composer is unchanged (approved as shown). | Unchanged |

## Final Visual Reference Inventory

All images are in this ticket's `visual-references/`; 390×844 at 2× unless noted. Every visible detail is normative except the illustrative data named in the status section.

| Screenshot ID | File | Viewport | Surface / State | Journey / Transition | Content |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | `VIS-001-run-list-default-phone-390x844.png` | 390×844 | Run list, default | UXJ-001 | Layout normative; names illustrative |
| VIS-002 | `VIS-002-run-list-delegation-tree-expanded-phone-390x844.png` | 390×844 | A task team unfolded: its members and the task agent a member started, at one level (DEC-009) | UXJ-001, TR-002 | same |
| VIS-003 | `VIS-003-run-list-fold-show-older-phone-390x844.png` | 390×844 | List end, "Show older (8)" | TR-003 | same |
| VIS-004 | `VIS-004-run-list-older-runs-open-phone-390x844.png` | 390×844 | Older runs open, "Show fewer" | TR-003 | same |
| VIS-005 | `VIS-005-run-screen-team-member-phone-390x844.png` | 390×844 | Run screen, a delegated team member | UXJ-002 | same |
| VIS-006 | `VIS-006-run-menu-team-member-phone-390x844.png` | 390×844 | ⋮ menu with Messages | TR-007 | same |
| VIS-007 | `VIS-007-artifacts-phone-390x844.png` | 390×844 | Artifacts (one) | UXJ-005 | The viewer's placeholder is the sample's |
| VIS-008 | `VIS-008-files-phone-390x844.png` | 390×844 | Files | UXJ-005 | same |
| VIS-009 | `VIS-009-files-search-phone-390x844.png` | 390×844 | Files search | TR-010 | same |
| VIS-010 | `VIS-010-messages-with-references-phone-390x844.png` | 390×844 | Messages with references | UXJ-005 | same |
| VIS-011 | `VIS-011-reference-file-open-phone-390x844.png` | 390×844 | A reference file open | TR-009 | File text illustrative |
| VIS-012 | `VIS-012-activity-empty-phone-390x844.png` | 390×844 | Activity, empty | State | Text normative |
| VIS-013 | `VIS-013-activity-phone-390x844.png` | 390×844 | Activity, populated | UXJ-005 | same |
| VIS-014 | `VIS-014-run-screen-delegator-phone-390x844.png` | 390×844 | Run screen, the delegating run | UXJ-002 | same |
| VIS-015 | `VIS-015-new-run-phone-390x844.png` | 390×844 | New run | UXJ-004 | same |
| VIS-016 | `VIS-016-new-run-agent-sheet-phone-390x844.png` | 390×844 | Agent sheet | TR-012 | same |
| VIS-017 | `VIS-017-new-run-folder-sheet-phone-390x844.png` | 390×844 | Folder sheet with the path footer | TR-012 | same |
| VIS-018 | `VIS-018-new-run-runtime-sheet-phone-390x844.png` | 390×844 | Runtime sheet | TR-012 | same |
| VIS-019 | `VIS-019-connection-sheet-peers-phone-390x844.png` | 390×844 | Connection sheet with peers | UXJ-006 | Peers illustrative |
| VIS-020 | `VIS-020-remote-run-not-reachable-phone-390x844.png` | 390×844 | A run on an unreachable node | UXJ-003 | Notice text normative (278) |
| VIS-021 | `VIS-021-run-list-loading-phone-390x844.png` | 390×844 | Loading | UXJ-007 | — |
| VIS-022 | `VIS-022-run-list-empty-phone-390x844.png` | 390×844 | Empty | UXJ-007 | Text normative |
| VIS-023 | `VIS-023-run-list-read-error-phone-390x844.png` | 390×844 | Read error | UXJ-007 | Text normative |
| VIS-024 | `VIS-024-run-list-node-not-reachable-phone-390x844.png` | 390×844 | Paired node not reachable | UXJ-006 | Text normative |
| VIS-025 | `VIS-025-run-list-phone-360x800.png` | 360×800 | Run list | UXJ-008 | same as VIS-001 |
| VIS-026 | `VIS-026-run-menu-phone-360x800.png` | 360×800 | ⋮ menu | UXJ-008 | — |
| VIS-027 | `VIS-027-messages-phone-360x800.png` | 360×800 | Messages | UXJ-008 | — |
| VIS-028 | `VIS-028-new-run-phone-360x800.png` | 360×800 | New run | UXJ-008 | — |
| VIS-029 | `VIS-029-file-open-phone-390x844.png` | 390×844 | An opened file (Files) | TR-019 | File text illustrative |

## Linked UI Reference Evidence

- Runnable UI reference: the design repository, `corepack pnpm install --ignore-workspace --frozen-lockfile`, then `corepack pnpm exec nuxt dev --host 0.0.0.0 --port 3277`; entry `/mobile`. Runbook: `ui-reference-runbook.md`, section "mobile-experience-redesign".
- Ticket record and review rounds: `product-ticket.md` (this folder).

## Implementation Fidelity Boundary

Engineering matches the screenshots and this document for layout, copy, states and behavior on the phone; it keeps the shared conversation view and composer, the remote components of 278 and the shared status dot colors. The reference's stores, fixtures, scenario keys and component split are not a prescription.

Findings for engineering (observed in this design, not new requirements): (1) after a new run's first message its id changes: the phone's selection and open screen must follow it; (2) the run screen must never show a state with navigation buttons: while a conversation attaches it shows "Opening…"; (3) a reference file opened from Messages is an overlay: the system Back key and ← should close it before leaving Messages; (4) a remote run's composer is text-only (278) — the reference shows the shared composer; (5) the node's own name comes from the paired node.

## Out Of Scope

The desktop and its left panel (385); pairing screens; Android and iOS shell changes (autobyteus-391 for switching nodes); the iOS App Store question; push notifications; remote files and terminal (278 FU-001); editing definitions; starting a run on a peer (DEC-003 option C); starting a Team or Org run from the phone.

## Open Decisions And Risks

1. **DEC-003** — approved as built (A); autobyteus-391 (B) waits for the user's word; C would be its own Task.
2. **Compact composer** — unchanged (not designed).
3. **Read window and polling** (R-001, QR-003): the run list needs the complete history window; engineering measures it on his real history over Tailscale.
4. **The reference's invented content** (messages, activity, file texts, node names) is illustrative; it is not real data.
