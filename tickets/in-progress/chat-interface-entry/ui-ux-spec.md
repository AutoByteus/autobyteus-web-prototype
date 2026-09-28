# UI/UX Specification — Chat entry (chat-interface-entry)

The canonical prototype-owned UI/UX supplement for the Chat experience in AutoByteus Web. The final screenshots in `visual-references/` are normative visual implementation references: every visible detail is requirements-defining unless this specification explicitly marks it illustrative or a permitted variation.

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: Product Design Requested (New Request) from Solution Designer, package `chat-interface-entry`; Product ticket `chat-interface-entry`
- Related requirements revision ID: `SR-001` (requirements `Draft`). This package resolves several open decisions and introduces new requirements; see "Requirement impact for Solution Designer".
- Related requirement, behavior, acceptance-criteria, and decision IDs: REQ-001–REQ-007, BEH-001, BEH-003–BEH-006, AC-001–AC-005, SCN-001–SCN-004, DEC-001–DEC-008
- Runnable prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype` (route `/chat`; also reachable from the first primary navigation item `Chat`)
- Review URL (during review): `http://127.0.0.1:3271/chat` (ticket worktree). After integration: run the canonical repository and open `/chat` (see `prototype-runbook.md`).
- Explicit user-confirmation reference: user message, 2026-09-28 — "please check one more time. If you think everything is consistent, then I think we're done with prototype UI … then you can create the details … so that [the] solution engineer [has] enough UI specification that will guide its implementation." Final consistency pass completed the same day (PC-035); no open visual or behavioral discrepancy remained.
- Final validation date: 2026-09-28 — `validate-chat-interface-entry.mjs` 30/30 pass, 0 browser errors (1 known pre-existing baseline upload error classified separately); typecheck pass.

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo` (remote `AutoByteus/autobyteus-workspace`)
- Selected frontend application or product surface: `autobyteus-web` — shell navigation, New chat, chat view, Workspaces tree, run-view message box
- Pinned source commit or revision: `origin/personal@fcd3e83a4ca931ba52ed19bd37b8df3050ee529e`
- Prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype` (remote `AutoByteus/autobyteus-web-prototype`, branch `personal`)
- Prototype revision or commit: recorded in `prototype-ticket.md` (ticket branch `prototype/chat-interface-entry`, accepted base `5ae0fe1`)
- Ticket folder: `tickets/done/chat-interface-entry/` in the prototype repository
- Bootstrap report path: `/Users/normy/autobyteus_org/autobyteus-web-prototype/prototype-bootstrap-report.md` (refresh `WEB-BASELINE-REFRESH-001`, accepted and integrated as `5ae0fe1`)

## Scope And Experience Goal

- User or actor: AutoByteus desktop/web user; primarily the product owner as a power user who develops and tests skills in chat before turning a proven setup into an agent, team or org.
- Context: AutoByteus opened on a definition-first catalog with no chat entry, and runtime/model selection was a multi-step form.
- Goal: a first-class **Chat** entry above Agents where the user can start a conversation in a few actions — by default with the general **Daily Assistant** (all installed skills available) — point it at a skill with `/`, address a specific agent or team with `@`, choose runtime/model/thinking quickly, and keep the same message box across Chat and existing run views.
- Observable success: from app launch, Chat → type → send starts a normal agent run without opening a configuration form; runtime + model are chosen from one compact menu; the run appears in the Workspaces tree like any other run.
- In-scope surfaces and journeys: primary navigation Chat item and New chat control (UIS-012); New chat page (UIS-001); message box (UIS-002) and its menus (UIS-003–UIS-007); chat view (UIS-008); right tool strip/panel in chat (UIS-009); unified message box in agent/team/org run views (UIS-010); Workspaces tree behavior for chats (UIS-011). Journeys UXJ-001–UXJ-011.
- Non-goals: a separate non-agent chat runtime; replacing the Agents / Agent Teams / Agent Orgs catalogs or their launch forms; "Save setup as agent" (removed, DEC-003); Agent Orgs addressed from Chat; per-member team configuration from Chat; a separate Chats list (DEC-004); `/` and `@` in run views; per-reply model provenance; changing the app's landing route (DEC-005 open).

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-001, AC-001, BEH-001 | `Chat` is the first primary-navigation item, above Agents, with a New chat (pencil) control on the item | UXJ-001; UIS-012; VIS-001 |
| REQ-002, REQ-003, AC-002, BEH-005 | New chat composes and sends; the first message starts a normal agent run shown in the chat view and the Workspaces tree | UXJ-001; UIS-001, UIS-008; VIS-001, VIS-015 |
| REQ-004, AC-003, BEH-004 | Temp workspace is the default; the user can pick another workspace or open a folder before the first message; the workspace is fixed afterwards | UXJ-003; UIS-005; VIS-001, VIS-009 |
| REQ-005, AC-004, BEH-003, DEC-001 | One compact runtime + model menu: Recent pairs, runtime rows with submenus, cross-runtime search, loading/error/not-installed states; thinking as its own control | UXJ-002; UIS-003, UIS-004; VIS-002–VIS-008, VIS-022, VIS-024 |
| REQ-006, DEC-002 | Chat is backed by **Daily Assistant** (general tools, all installed skills, lazy-loaded) unless `@` or a tree `+` addresses another agent or team | UXJ-001, UXJ-005, UXJ-006; VIS-012–VIS-014 |
| REQ-007, AC-005 | Agents / Teams / Orgs catalogs and launch forms unchanged; team runs started from Chat open in the existing Team view | UXJ-006; VIS-020 |
| DEC-004 | Chats are normal runs in the Workspaces tree (workspace → agent → run), product ordering, no separate list | UXJ-011; UIS-011; VIS-021 |
| DEC-006 | Runtime fixed per run; model/thinking editable before the first message or while the run is terminated (Offline); locked while the run is live | UXJ-007; VIS-015, VIS-017 |
| DEC-007 | Chat view: centered conversation; right side collapsed to the product tool strip by default; single-agent runs open in the chat view (Option B), team/org runs keep their view | UXJ-009, UXJ-011; VIS-018, VIS-019 |
| New (see impact) | `/` skill tagging; `@` addressing; team quick path; unified message box; auto-approve default; attachments as chips | UXJ-004–UXJ-006, UXJ-008, UXJ-010 |

## Requirement Impact For Solution Designer

The user made these decisions during review. They resolve open decisions or add requirements that the Draft requirements do not yet contain:

1. **DEC-001 (resolved):** compact, model-first runtime + model menu (UIS-003) with separate thinking control (UIS-004).
2. **DEC-002 (resolved):** Chat defaults to **Daily Assistant** — one general agent with general tools and every installed skill enabled (lazy-loaded). It is a normal agent (shown like any agent in the tree). Whether it ships as a built-in/internal agent or stays in the user's package is open (OPEN-003).
3. **DEC-003 (resolved: out of scope):** no "Save setup as agent" in Chat.
4. **DEC-004 (resolved):** chats live in the existing Workspaces tree under their agent, following normal product ordering.
5. **DEC-006 (resolved):** follow the server rule `runModelConfigEditability` — model config editable only when the run is not active (and not archived); runtime never changes for a run.
6. **DEC-007 (resolved):** single-agent runs (including chats) open in the chat view; team and org runs keep the existing workspace/Team view; the right side uses the product tool strip/panel, collapsed by default in chat.
7. **New — skill tagging:** `/` in the message box tags one or more skills of the addressed agent; the sent message is prefixed with a plain "use this skill" instruction (all skills stay available).
8. **New — addressing:** `@` in a New chat addresses an agent or an agent team; `+` on an agent in the tree starts a chat with that agent and workspace.
9. **New — team quick path:** a team started from Chat uses one runtime/model/thinking, one shared workspace and one approval setting for all members; the first message goes to the coordinator; per-member setup stays on the Agent Teams launch form.
10. **New — auto-approve default:** auto-approve tools is on by default for every new chat in any workspace, visible and switchable before the first message.
11. **New — unified message box:** the same message box (chips, attachments, footer controls, voice) in Chat and in agent/team/org run views.
12. **New — New chat control:** pencil button on the Chat navigation item.
13. **DEC-005 (open):** whether the app lands on Chat instead of Agents was not decided.
14. **DEC-008:** this design did not reuse the unfinished `codex/general-chat-entry` implementation; its disposition remains with Solution Designer and the user.

## Production-Quality Experience And Visual Specification

- Existing product language to preserve: AutoByteus Web shell (left panel, primary navigation, Workspaces tree, right tool strip/panel), Tailwind gray scale, `blue-600` primary, `indigo-50/900` selection in the tree, Heroicons outline icons, existing message avatars and typography, existing toasts, confirmation modal and status dots. Chat reuses the product's own `RightSidebarStrip`, `RightSideTabs`, Workspaces tree and status vocabulary.
- Information hierarchy: (1) conversation or the New chat heading; (2) the message box; (3) header context (agent · workspace · approval, status); (4) navigation and tree. Settings you can change sit in the message box footer; fixed facts sit in the header.
- Navigation and orientation: `Chat` is the first primary-navigation item (icon chat-bubbles) at `/chat`. The pencil button on the item opens a fresh New chat. Opening a chat (`/chat?id=<runId>`) expands its workspace and agent in the tree and selects its row (`bg-indigo-50 text-indigo-900`). The Chat item stays active on all chat routes.
- Grid, dimensions, layout, spacing, and density:
  - Primary-navigation split grows by one 40px row so all items stay visible with the added Chat row.
  - Chat item controls: pencil button (`p-2`, 18px icon, `right-10`) left of the existing collapse-panel button (`right-1.5`); item label padding-right 80px.
  - New chat page: content centered, `max-w-3xl` (768px) column, bottom padding 14vh; heading 28px; 8px gap to subtitle; 32px gap to the message box; 10px gap to the hint line.
  - Chat view: header 56px (`h-14`, bottom border gray-200, `px-4`); conversation column `max-w-3xl` centered, `px-6 py-6`, 24px between messages; message box pinned to the bottom of the column with 16px bottom padding.
  - Message box: textarea min height 52px (88px on New chat), max 240px, auto-grow; chip row `px-3 pt-3 gap-1.5`; footer `px-2 pb-2 pt-1 gap-0.5`.
  - Right side: tool strip 50px wide; panel at the product right-panel width.
  - Menus: model 304px (`w-[19rem]`), runtime submenu 272px, thinking 176px, workspace 384px, skill / agent-team menu 368px, all `max-w` clamped to the viewport.
- Typography, font assets, sizes, weights, line heights, and wrapping: product font stack. New chat heading 28px semibold, tracking-tight, gray-900. Subtitle 14px gray-500; inline `/` and `@` rendered as small `kbd` (bordered gray-50, 12px). Chat title 15px semibold gray-900, truncated; header sub-line 12px gray-500. Message text 15px/24px gray-900. Footer controls 13px/20px. Menu rows 13px; section labels 11px medium gray-400. Chips 12px medium. Model names never wrap (truncate).
- Color values and semantic roles: primary send `blue-600` (hover `blue-700`, disabled 40% opacity); stop `red-600`; skill chips `indigo-50` bg / `indigo-200` border / `indigo-700` text; attachment chips `gray-50` / `gray-200` / `gray-700`; sent-message attachments `sky-50` / `sky-200` / `sky-700` (existing product style); auto-approve on `gray-600`, `Ask first` `amber-700`; locked controls gray-500/gray-400 with lock icon; header status dots: Running `blue-500`, Idle `green-500`, Offline `gray-400`; menu current-item check `blue-600`; catalog error text `red-600`; drop overlay `blue-50/80` with dashed `blue-400` border and `blue-700` text; "sent as" tooltip `gray-900` bg, `gray-100` text, `gray-400` uppercase label.
- Surfaces, borders, radii, shadows, and elevation: message box `rounded-xl`, 1px `gray-200` (New chat: `gray-300`), `shadow-sm`, focus-within `gray-300` + `shadow-md`. Menus `rounded-lg`, 1px `gray-200`, `shadow-lg`, white, z-50; narrow viewports show menus as bottom sheets (`inset-x-2 bottom-2`) over a `black/20` scrim. Chips `rounded-md`. Image thumbnails 48×48 `rounded-md`. Header avatar 32×32 `rounded-md` bordered; message avatars 36px circles (user sky, agent emerald initials).
- Controls, icons, imagery, and media assets: Heroicons outline set (chat-bubble-left-right, pencil-square, paperclip, folder, shield-check / shield-exclamation, light-bulb, chevron-down, magnifying-glass, lock-closed, check, x-mark, sparkles, microphone, paper-airplane, stop). Footer buttons are borderless ghost buttons (`rounded-md px-2 py-1`, hover `gray-100`). Send/stop and mic are 32px circles.
- Hover, active, focus, selected, disabled, validation, and feedback treatment: ghost buttons `hover:bg-gray-100`, pressed/open `bg-gray-100`; keyboard focus `ring-2 ring-blue-500/40`; menu row hover/focus `bg-gray-100`; current selection check. Locked controls: lock icon, muted text, `aria-disabled`, no hover background, click does nothing, tooltip explains how to unlock. Send disabled until there is text, a tag or an attachment. Workspace path validation: "Enter an absolute folder path." Existing toasts for delete/archive.
- Motion, easing, duration, and reduced-motion behavior: color/shadow transitions 150ms (Tailwind default); runtime submenu opens after a 90ms hover intent; spinners for loading; tooltip fade 100ms. No motion is required for comprehension; reduced motion disables the non-essential animations.

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Any user, any page | App open | Start a chat with Daily Assistant | Live run in the chat view; run row selected in the tree | REQ-001–004, AC-001–003, SCN-001 |
| UXJ-002 | New chat | Model button shows last-used pair | Choose runtime + model (+ thinking) quickly | Button shows `model Runtime`; thinking shows level | REQ-005, AC-004, DEC-001, SCN-002 |
| UXJ-003 | New chat | Temp workspace | Use another workspace or folder | Workspace button shows it; hint shows its path | REQ-004, AC-003, SCN-003 |
| UXJ-004 | Chat (new or stopped/idle reply) | Empty box | Point the agent at one or more skills | Chips in the box; after send, chips on the message with "sent as" | New: skill tagging |
| UXJ-005 | New chat | Daily Assistant | Chat with a specific agent | Agent chip; subtitle "Chat with <agent>…"; `/` lists that agent's skills | DEC-002, new: addressing |
| UXJ-006 | New chat | Daily Assistant | Start an agent team quickly | Team run open in the existing Team view, coordinator focused | New: team quick path, REQ-007 |
| UXJ-007 | Existing chat | Live run | Change the run's model or thinking | New model applies when the run resumes with the next message | DEC-006 |
| UXJ-008 | Any message box | Empty box | Attach files, dictate, or choose Ask first | Chips/thumbnails; transcript in the textarea; Ask first shown | New: unified box, auto-approve |
| UXJ-009 | Chat view | Strip collapsed | Use Files / Terminal / Activity / Token / Artifacts / VNC | Panel open on the chosen tab; collapse returns to strip | DEC-007 |
| UXJ-010 | Team or org member view | Existing run | Send with the same message box as Chat | Same layout, attachments, voice, model/thinking lock rules | New: unified box |
| UXJ-011 | Workspaces tree | Chats exist | Reopen, archive, delete or terminate chats | Chat view opens / row removed with existing confirmation / run Offline | DEC-004, DEC-007 |

## Journey Details

**UXJ-001 — Start a chat.** Click `Chat` (or its pencil) → New chat (VIS-001): heading "What should we work on?", subtitle "All your skills are available. Type / to use a skill, or @ to chat with an agent or team.", focused textarea "Ask anything · / for skills · @ for an agent or team", footer `📎 · 📁 Temp workspace ⌄ · 🛡 Auto-approve … <model> <Runtime> ⌄ · 💡 <level> ⌄ · [🎤] · ➤`, hint "Files are saved in the temp workspace · ~/.autobyteus/temp_workspace". Type and press Enter (Shift+Enter = newline) or click send → button spinner and hint "Starting Daily Assistant on <Runtime>…" → route `/chat?id=<runId>`; the run row appears under workspace → Daily Assistant, titled from the first message (≤42 chars, ellipsis), selected; reply streams; header status Running → Idle (VIS-015). Failure: runtime unavailable → send disabled with the reason as its label; catalog error → UXJ-002 recovery.

**UXJ-002 — Choose runtime + model.** Click the model button → menu (VIS-002): search field "Search models"; `Recent` (up to 3 model + runtime pairs, runtime label right, check on current) — one click selects; `Runtimes` rows (label, blue dot on the current runtime, model count when loaded, `›`). Hover or click a runtime → side submenu with its models, provider sub-labels when there is more than one provider, check on current (VIS-003); the submenu opens left when there is no room on the right. Arrow keys move within a level, → opens a runtime, ← returns, Enter selects, Esc closes. Search matches across enabled runtimes and labels each result with its runtime (VIS-004); "Searching all runtimes…" while catalogs load; "No models match "<q>"". States: catalog loading row "Loading models…" (VIS-005); error "Couldn't load models" + `Retry` (VIS-006); runtime not installed: row muted with "Not installed", reason as tooltip, cannot open (VIS-007); first run: no Recent, AutoByteus default model (VIS-022); narrow: bottom sheet, runtime rows drill in with a back row (VIS-024). Choosing a model applies that model's default thinking. The thinking button (💡 <level> ⌄, VIS-008) appears only when the selected model supports thinking; its menu lists "Reasoning effort" levels with a check.

**UXJ-003 — Workspace.** Click the workspace button → menu (VIS-009): `Temp workspace` with a `Default` badge and "Scratch folder for quick chats"; `YOUR WORKSPACES` with name + path; footer "Open another folder…" → inline "Folder path" field, `Cancel` / `Use folder`, validation "Enter an absolute folder path.". The hint line updates to the chosen workspace and path. After the first message the workspace is fixed and shown in the chat header.

**UXJ-004 — Tag skills.** Type `/` at the start of a word → skill menu (VIS-010) headed "Skills matching /<q> · ↑↓ to move, Enter to add", rows with skill name + one-line description, ranked name-prefix → name-contains → description; a bare `/` lists all of the addressed agent's skills. Enter/Tab/click adds an indigo chip `✦ /<skill> ×` above the text and removes the typed `/<q>`; several chips allowed (VIS-011). Footer: "All skills are available" (Daily Assistant) or "This agent's skills", plus `Manage skills →` (Skills page). A message may consist of tags only. On send, the chips stay on the user message; hovering or focusing them shows the "SENT TO THE AGENT AS" tooltip with the exact text: one skill → `Use the <skill> skill for this request.`; several → `Use these skills for this request: <a>, <b>.`; then a blank line and the user's text (VIS-016).

**UXJ-005 — Address an agent.** In a New chat type `@` → menu (VIS-012) "Chat with @<q>", groups `Agents` and `Agent teams` (Daily Assistant is the default and not listed); choose Codex → gray agent chip with initials and `×`, subtitle "Chat with Codex, using its own tools and skills.", placeholder "Ask Codex anything…", `/` lists Codex's skills only (VIS-014). `×` returns to Daily Assistant. Alternative: `+` on an agent group in the tree starts a New chat with that agent and workspace preset. `@` is available only before the first message.

**UXJ-006 — Team quick path.** `@prod` → Enter → team chip (square initials), subtitle "Your message goes to Product Review Team's coordinator.", placeholder "Message Product Review Team…", note "All members use this model, the temp workspace and this approval setting. For per-member setup, start it from Agent Teams." with a link to Agent Teams (VIS-013). Send → the run opens in the existing Team workspace view with the coordinator focused, the team expanded in the tree and the Team tab available (VIS-020 shows the same view). Agent Orgs are not addressable from Chat.

**UXJ-007 — Change the model of an existing chat.** While the run is live (header status Running or Idle), the footer's model and thinking show a lock and are inert; tooltip "Locked while the run is live. Terminate the run from the Workspaces tree to change the model or thinking." (VIS-015). Terminate via the tree row's existing stop square ("Terminate run") → header status `Offline`, lock removed. The model menu then lists only the run's runtime models with the footer "Runtime fixed · <Runtime>" (VIS-017). The chosen settings apply when the next message resumes the run. No divider notes are added to the conversation.

**UXJ-008 — Attachments, voice, approval.** `📎` opens the file picker; dropping files anywhere on the box shows "Drop files to attach"; pasting files (e.g. a screenshot) attaches them, pasted text stays text. Files render as chips (name, open, `×`, uploading spinner) and images as 48px thumbnails (preview on click, `×` on hover); "Clear all" appears at two or more (VIS-011). Sent chat messages list them under "Context files". The 🎤 button appears before send only when the Voice Input extension is installed and enabled (VIS-025); recording/transcribing show the status row as today and the transcript is inserted into the textarea. The shield toggles `🛡 Auto-approve` (default, every new chat, any workspace) ↔ `🛡 Ask first` (amber) before the first message; tooltips "Tools run without asking. Click to ask before running tools." / "Tools ask before running. Click to let tools run without asking."; after sending, the header shows the mode.

**UXJ-009 — Workspace tools.** The chat view's right edge shows the product tool strip (VIS-019) with Files, Terminal, Activity, Token, Artifacts, VNC Viewer (plus Team/Browser where applicable) and hover labels. Clicking an icon opens `RightSideTabs` on that tab (VIS-018); its own collapse control returns to the strip. Collapsed by default in chat.

**UXJ-010 — Run views.** Team-member, org-member and agent run views use the same message box (VIS-020): chips row only when attachments exist, textarea "Type a message…", footer `📎 … <model> <Runtime> ⌄ · 💡 ⌄ · [🎤] · ➤/■`. Model/thinking follow UXJ-007 using the focused member's run status. `/` and `@` are not offered in run views.

**UXJ-011 — Chats in the tree.** Chats are runs under workspace → agent (Daily Assistant or the addressed agent), sorted like any run: workspaces and agents by name, runs newest first, collapsed unless holding the open chat (VIS-021). Clicking a single-agent run opens it in the chat view; team/org runs keep their view. Archive / delete (with the existing confirmation and toasts) and Terminate run use the existing row actions.

## Screen And Surface Specification

| Surface ID | Purpose | Entry Conditions | Structure And Hierarchy | Important States | Primary Actions | Exit / Next Action | Visual IDs |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UIS-001 | New chat | `/chat` (Chat item, pencil, tree `+`) | Heading, subtitle, message box (large), hint line | Default; agent-addressed; team-addressed; starting | Type, tag, address, send | Chat view or Team view | VIS-001, 011, 013, 014, 023, 025 |
| UIS-002 | Message box | Every chat and run view | Chip row (optional) → textarea → footer | Empty (send disabled); chips; drop overlay; voice status; running (stop) | Attach, tag, send/stop, dictate | — | VIS-001, 011, 015, 020, 025 |
| UIS-003 | Runtime + model menu | Model button | Search · Recent · Runtimes (+ submenu) | Loading, error, not installed, search, first run, locked-runtime list, narrow sheet | Pick a model | Closes; button updates | VIS-002–007, 017, 022, 024 |
| UIS-004 | Thinking control | Model supports thinking | Button with level; menu "Reasoning effort" | Locked while live | Pick a level | Closes | VIS-008, 015 |
| UIS-005 | Workspace menu | Workspace button (New chat) | Temp default · your workspaces · open folder | Folder form with validation | Pick / add | Closes; hint updates | VIS-009 |
| UIS-006 | Skill menu | `/` in the textarea | Header hint · ranked list · footer | Empty ("No skills match" / "This agent has no skills") | Add chip | Closes | VIS-010, 014 |
| UIS-007 | Agent / team menu | `@` in a New chat | Header hint · Agents · Agent teams · footer | No match | Address | Chip shown | VIS-012 |
| UIS-008 | Chat view | `/chat?id=<runId>` | Header (avatar, title, status, agent · workspace · approval) · conversation · message box · right strip | Running, Idle, Offline; locked footer | Reply, tag, open tools | Tree navigation | VIS-015–019 |
| UIS-009 | Right tool strip / panel | Chat view | 50px icon strip ↔ product tab panel | Collapsed (default), open | Open tab, collapse | — | VIS-018, 019 |
| UIS-010 | Run-view message box | Agent / team / org member views | As UIS-002 without `/` and `@` | Locked while live; attachment uploading | Send, attach, model when Offline | — | VIS-020 |
| UIS-011 | Workspaces tree (chats) | Left panel, all routes | Workspace → agent → runs; teams; orgs | Selected chat; live (terminate) / stored (archive, delete) | Open, terminate, archive, delete | Chat view | VIS-015, 021 |
| UIS-012 | Chat navigation item | Shell | Icon + "Chat" + pencil + collapse control | Active on chat routes | Go to Chat; New chat | New chat | VIS-001 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Any page | Click `Chat` or its pencil | Route `/chat`, textarea focused | New chat (fresh draft) | Draft reset: Daily Assistant, Temp workspace, Auto-approve, last-used model | Type, pickers, `/`, `@` |
| TR-002 | New chat | Send (Enter) | Send spinner; hint "Starting … on …" | Chat view, status Running | New normal agent run; tree row added and selected; recent pair remembered | Stop, reply after reply |
| TR-003 | Model menu | Hover/click runtime | Submenu (loading if catalog not loaded) | Runtime models listed | Catalog loaded on demand per runtime | Pick, search, back |
| TR-004 | Model menu | Pick model / Recent pair | Menu closes | Button shows model + runtime; thinking reset to model default | — | — |
| TR-005 | Textarea | Type `/` | Skill menu | Ranked list | — | ↑↓, Enter/Tab, Esc |
| TR-006 | Skill menu | Enter/Tab/click | `/q` removed, chip added | Chip row visible | Tag stored with the message draft | More tags, send |
| TR-007 | New chat textarea | Type `@`, choose target | `@q` removed, chip, subtitle/placeholder update | Agent- or team-addressed draft | Skills pool follows the addressed agent | Send, `×` to revert |
| TR-008 | Team-addressed New chat | Send | Starting hint | Team workspace view, coordinator focused | Team run with shared model/workspace/approval | Team view actions |
| TR-009 | Chat view, live | Tree row Terminate run | Existing terminate feedback | Status Offline; footer unlocked | Run no longer active | Change model/thinking, send |
| TR-010 | Chat view, Offline | Pick model / thinking | Menu closes; button updates | Settings pending | Applied when the next message resumes the run | Send |
| TR-011 | Message box | Drop / paste / 📎 files | Drop overlay while dragging; chips/thumbnails | Attachments listed | Upload per product rules | Remove, Clear all, send |
| TR-012 | New chat | Click shield | Label/colour toggle | Auto-approve ↔ Ask first | Applies to the new run (and all team members) | Send |
| TR-013 | Chat view | Click strip icon | Panel opens on that tab | Panel open | Active tab set | Collapse |
| TR-014 | Tree | Click a single-agent run | Row selected | Chat view for that run | — | Reply, tools |

## State Behavior

| Surface / State | Trigger | Required Presentation And Message | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Model menu / catalog loading | First open of a runtime | Spinner + "Loading models…"; count appears when loaded | Other runtimes, search | Automatic | VIS-005 |
| Model menu / catalog error | Catalog fails | "Couldn't load models" (red) + `Retry` | Retry, other runtimes | Retry reloads | VIS-006 |
| Model menu / runtime not installed | Runtime disabled | Muted row, "Not installed", reason on hover; not openable | Other runtimes | Install/enable elsewhere | VIS-007 |
| Model menu / search empty | No match | "No models match "<q>"" | Edit query | — | — |
| New chat / first run | No history | No Recent section; AutoByteus default model | All pickers | — | VIS-022 |
| Chat header status | Run lifecycle | Running (blue, streaming) · Idle (green, live) · Offline (gray, terminated/stored) | — | — | VIS-015, 017, 019 |
| Footer locked | Run live | Lock icon, muted, inert; tooltip "Locked while the run is live. Terminate the run from the Workspaces tree to change the model or thinking." | — | Terminate in tree | VIS-015 |
| Send disabled | No text/tag/attachment, or runtime unavailable | Disabled send; label shows the blocking reason when applicable | Type | — | VIS-001 |
| Skill menu empty | No skills / no match | "This agent has no skills" / "No skills match" | Edit | Esc | — |
| Drag over box | Files dragged over | Dashed blue overlay "Drop files to attach" | Drop | Leave | — |
| Voice | Extension installed | 🎤 before send; recording/transcribing status row | Stop recording | — | VIS-025 |
| Missing chat | Unknown `id` | "This chat no longer exists" + `New chat` | New chat | — | — |

## Responsive And Platform Behavior

- ≥1024px: as in the desktop references. The right tool strip/panel shows from `lg` (1024px).
- Narrow (<640px, e.g. 390×844): the left panel collapses to the product icon strip; the heading wraps; footer controls wrap to additional lines; the runtime label beside the model name is hidden (model name only); all menus become bottom sheets over a scrim; runtime rows drill in with a back row instead of a side submenu (VIS-023, VIS-024). No horizontal overflow.
- Desktop app: voice availability follows the Voice Input extension; otherwise identical.

## Accessibility And Keyboard Behavior

- Enter sends; Shift+Enter inserts a newline. In `/` and `@` menus: ↑/↓ move, Enter/Tab choose, Esc closes and returns focus to the textarea.
- Model menu: role `menu`; items `menuitemradio` with `aria-checked`; runtime rows `aria-haspopup="menu"`; → opens a submenu, ← returns; Esc closes and returns focus to the trigger. Other menus: role `listbox`/`option` or `menu`; focus moves into the menu on open.
- Triggers expose `aria-expanded`, descriptive `aria-label` (e.g. "Model: gpt-5.5-codex on Codex App Server. Change model"). Locked controls expose `aria-disabled="true"` and a label including the lock reason.
- Chips' remove buttons have labels ("Remove skill <name>", "Remove <file>"); the "sent as" tooltip has `role="tooltip"` and is reachable by keyboard focus on the chip group.
- Focus rings: `ring-2 ring-blue-500/40`. Text contrast follows the product scale; muted/locked text is never the only carrier of state (lock icon and label accompany it).

## Content, Labels, Validation, And Feedback

All strings below are normative UI copy.

- Navigation: `Chat`; pencil tooltip/label `New chat`.
- New chat: `What should we work on?`; subtitles: `All your skills are available. Type / to use a skill, or @ to chat with an agent or team.` · `Chat with <agent>, using its own tools and skills.` · `Your message goes to <team>'s coordinator.`
- Placeholders: `Ask anything · / for skills · @ for an agent or team` · `Ask <agent> anything…` · `Message <team>…` · chat reply `Reply, or type / to use a skill` (Daily Assistant) or `Message <agent>…` · run views `Type a message...`.
- Hint line: `Files are saved in the temp workspace · <path>` / `Files are saved in <workspace> · <path>` · starting `Starting <agent or team> on <Runtime>…` · team note `All members use this model, the <workspace> and this approval setting. For per-member setup, start it from Agent Teams.`
- Model menu: `Search models`, `Recent`, `Runtimes`, `Not installed`, `Loading models…`, `Couldn't load models`, `Retry`, `Searching all runtimes…`, `No models match "<q>"`, `Runtime fixed · <Runtime>`.
- Thinking: menu label `Reasoning effort` (levels are model-provided; see OPEN-001).
- Workspace: `Temp workspace`, badge `Default`, `Scratch folder for quick chats`, `YOUR WORKSPACES`, `Open another folder…`, `Folder path`, `Cancel`, `Use folder`, error `Enter an absolute folder path.`
- Approval: `Auto-approve` / `Ask first` + tooltips in UXJ-008; header shows the same word.
- Skills: `Skills matching /<q> · ↑↓ to move, Enter to add`, footer `All skills are available` / `This agent's skills`, `Manage skills →`, empty `No skills match` / `This agent has no skills`; tooltip label `SENT TO THE AGENT AS`; instruction wording in UXJ-004 (proposed default wording, may be refined by engineering without changing meaning).
- Addressing: `Chat with @<q> · ↑↓ to move, Enter to choose`, groups `Agents`, `Agent teams`, footer `Teams: your message goes to the coordinator`, empty `No agents or teams match`.
- Attachments: `Attach files (or drag, drop, paste)`, `Drop files to attach`, `Clear all`, sent `Context files`.
- Lock tooltip: `Locked while the run is live. Terminate the run from the Workspaces tree to change the model or thinking.`
- Status: `Running`, `Idle`, `Offline` (product vocabulary).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | Prototype Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Runtime availability + per-runtime model catalogs | UIS-003 | Synthetic catalogs with simulated latency, `chat_catalog_error`, `chat_runtime_unavailable` scenarios | Existing availability and runtime-scoped catalog APIs; cross-runtime search needs enabled catalogs loaded (RSK-001) |
| Recent model + runtime pairs | UIS-003 | Browser-local list | Persistence scope (per user/node) to decide in architecture |
| Thinking options | UIS-004 | Illustrative per-model effort levels | Schema-driven per runtime/model (`ModelConfigSection` / `llmThinkingConfigAdapter`): on/off toggle plus the model's own parameters (OPEN-001) |
| Daily Assistant with all skills | Default agent | Fixture agent listing all skills | Provisioning (built-in vs package) and "all installed skills, lazy-loaded" configuration (OPEN-003) |
| Skill tagging | UXJ-004 | Instruction prepended to the stored message; reply simulated | Instruction prepended to the text sent to the agent run; stored/displayed message shows chips + user text |
| Chat runs | UIS-008, UIS-011 | Prototype-native chat store projected into the real Workspaces tree; streaming simulated | Normal agent runs through existing run lifecycle, history and stream APIs |
| Team from Chat | UXJ-006 | Opens stored run `team-run-001` as a stand-in (toast explains) | Create a team run with shared runtime/model/thinking, shared workspace and approval for all members; first message to the coordinator |
| Model edit rule | UXJ-007 | Chat: local `active` flag; run views: member `currentStatus` (editable only when Offline) | Server `runModelConfigEditability` (RUN_ACTIVE / RUN_ARCHIVED) |
| Attachments | UXJ-008 | Chat: local object URLs; run views: product upload path, which never completes in the prototype (synthetic server gap, reproduced on baseline `5ae0fe1`) | Existing context-file upload/draft ownership |
| Voice input | UXJ-008 | Chat: simulated recording/transcript; availability from the real extension store | Existing voice input extension |
| Terminate / archive / delete | UIS-011 | Chat runs mapped to local state behind the product's own confirmation/toasts | Existing run mutations |

## Final Visual Reference Inventory

Paths are relative to this ticket folder.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 · UIS-001/012 · New chat default | 1440×900 | `visual-references/VIS-001-new-chat-default-1440x900.png` | Chat first in nav with pencil + collapse; tree collapsed in product order; heading, subtitle with `/` `@` kbd; large box; footer order; hint | Workspace names/paths, model name, effort level |
| VIS-002 | UXJ-002 · UIS-003 · menu open | 1440×900 | `visual-references/VIS-002-model-menu-recent-runtimes-1440x900.png` | Search; Recent pairs with runtime labels and check; Runtimes rows with current dot, counts, chevrons | Model names, counts, recent entries |
| VIS-003 | UXJ-002 · submenu | 1440×900 | `visual-references/VIS-003-model-menu-runtime-submenu-1440x900.png` | Side submenu, provider sub-labels, single-line rows | Model/provider names |
| VIS-004 | UXJ-002 · search | 1440×900 | `visual-references/VIS-004-model-menu-search-1440x900.png` | Cross-runtime results with runtime label on the right | Model names |
| VIS-005 | UXJ-002 · loading | 1440×900 | `visual-references/VIS-005-model-menu-loading-1440x900.png` | Loading row with spinner in the submenu | Runtime chosen |
| VIS-006 | UXJ-002 · error | 1440×900 | `visual-references/VIS-006-model-menu-catalog-error-1440x900.png` | Red "Couldn't load models" + Retry | Which runtime fails |
| VIS-007 | UXJ-002 · not installed | 1440×900 | `visual-references/VIS-007-model-menu-runtime-not-installed-1440x900.png` | Muted runtime row with "Not installed" | Which runtime is missing |
| VIS-008 | UXJ-002 · UIS-004 | 1440×900 | `visual-references/VIS-008-thinking-menu-1440x900.png` | Separate thinking control and menu placement | Level names and count (schema-driven, OPEN-001) |
| VIS-009 | UXJ-003 · UIS-005 | 1440×900 | `visual-references/VIS-009-workspace-menu-1440x900.png` | Temp default badge + description; your workspaces with paths; open folder row | Workspace names/paths |
| VIS-010 | UXJ-004 · UIS-006 | 1440×900 | `visual-references/VIS-010-skill-slash-menu-1440x900.png` | Header hint; ranked rows with descriptions; footer | Skill names/descriptions |
| VIS-011 | UXJ-004/008 · UIS-002 | 1440×900 | `visual-references/VIS-011-composer-chips-attachments-ask-first-1440x900.png` | Skill chips, file chip, image thumbnail, Clear all, Ask first (amber) | File names, image content, text |
| VIS-012 | UXJ-005 · UIS-007 | 1440×900 | `visual-references/VIS-012-at-agent-team-menu-1440x900.png` | Agents / Agent teams groups; avatars (circle vs square); footer | Agent/team names and descriptions |
| VIS-013 | UXJ-006 · team draft | 1440×900 | `visual-references/VIS-013-team-chat-draft-1440x900.png` | Team chip, coordinator subtitle, placeholder, quick-path note with link | Team name, text |
| VIS-014 | UXJ-005 · agent draft | 1440×900 | `visual-references/VIS-014-agent-chat-draft-codex-skills-1440x900.png` | Agent chip, agent subtitle, `/` lists only that agent's skills, "This agent's skills" | Agent and skill names |
| VIS-015 | UXJ-001/007 · live chat | 1440×900 | `visual-references/VIS-015-active-chat-live-locked-1440x900.png` | Header (title, Idle, agent · workspace · approval); chips on message; locked model + thinking; tree row selected with terminate square; right strip | Titles, reply text, timestamps |
| VIS-016 | UXJ-004 · sent as | 1440×900 | `visual-references/VIS-016-sent-as-tooltip-1440x900.png` | Dark tooltip with label and exact sent text | Message text |
| VIS-017 | UXJ-007 · Offline | 1440×900 | `visual-references/VIS-017-stopped-chat-model-menu-1440x900.png` | Offline status; unlocked controls; runtime-only model list; "Runtime fixed · <Runtime>"; no divider notes | Reply text, model names |
| VIS-018 | UXJ-009 · panel open | 1440×900 | `visual-references/VIS-018-right-tool-panel-open-1440x900.png` | Product RightSideTabs opened on the clicked tab | Panel contents |
| VIS-019 | UXJ-009 · stored chat | 1440×900 | `visual-references/VIS-019-stored-chat-strip-collapsed-1440x900.png` | Offline stored chat; right strip icons | Conversation content |
| VIS-020 | UXJ-010 · run view | 1440×900 | `visual-references/VIS-020-team-member-run-view-unified-box-1440x900.png` | Same box in a team member view; file chip row; footer model with runtime label | Upload spinner (prototype server gap — production shows the completed chip); names |
| VIS-021 | UXJ-011 · tree | 1440×900 | `visual-references/VIS-021-workspaces-tree-normal-order-1440x900.png` | Workspaces by name; Daily Assistant group like any agent; runs newest first | Names, ages |
| VIS-022 | UXJ-002 · first run | 1440×900 | `visual-references/VIS-022-first-run-model-menu-1440x900.png` | No Recent section; default model | Default model name |
| VIS-023 | UXJ-001 · narrow | 390×844 | `visual-references/VIS-023-narrow-new-chat-390x844.png` | Wrapping footer; model name without runtime label | Wrap positions may vary with content |
| VIS-024 | UXJ-002 · narrow sheet | 390×844 | `visual-references/VIS-024-narrow-model-bottom-sheet-390x844.png` | Bottom sheet with scrim; drill-in runtime rows | Model names |
| VIS-025 | UXJ-008 · voice | 1440×900 | `visual-references/VIS-025-chat-with-voice-available-1440x900.png` | Mic before send when voice is available | — |

`visual-references/manifest.json` records each file's viewport and SHA-256.

## Linked Prototype Evidence

- Runnable prototype: `/Users/normy/autobyteus_org/autobyteus-web-prototype` → `/chat`
- Prototype ticket record: `prototype-ticket.md`
- Run instructions: `prototype-runbook.md`
- Relevant supporting prototype artifacts: `prototype-change-log.md` (PC-001–PC-035), `ui-behavior-test-matrix.md`, `review-evidence/round-1` … `round-6`, `visual-references/manifest.json`
- Validation: `prototype/scripts/validate-chat-interface-entry.mjs` (30 checks); captures: `prototype/scripts/capture-chat-interface-entry-final.mjs`
- Relevant journey, transition, or scenario IDs: UXJ-001–UXJ-011, TR-001–TR-014; scenarios default, `chat_first_run`, `chat_catalog_error`, `chat_runtime_unavailable`
- Mocked boundaries and limitations: see "Data, Contract, And Mock Boundaries"

## Implementation Fidelity Boundary

- Exact behavior and visible design implementation must preserve: navigation placement and New chat control; New chat layout and copy; message box structure (chip row → textarea → footer), control order and styles; the "footer = changeable, header = fixed" rule; model menu structure and states; skill and agent/team menus; lock behavior tied to run activity; product status vocabulary; right tool strip/panel reuse; tree placement and ordering; unified box in run views.
- Prototype-only state, fixtures, and simulated mechanisms that do not prescribe production architecture: `usePrototypeChat`, chat fixtures, the chat → tree projection, simulated streaming and replies, stand-in team run, local recent pairs, local attachments/object URLs, simulated voice recording, run-view model changes applied locally.
- Fixture content or visible details explicitly allowed to vary: agent, team, skill, model, provider, workspace and chat names; descriptions; reply text; timestamps; model counts; which runtimes are installed; thinking level names and set.
- Permitted responsive or platform variation: wrap positions of footer controls on narrow widths; mic presence by extension availability.
- Existing design-system constraints: Tailwind tokens and Heroicons already used by the product; reuse `RightSidebarStrip`, `RightSideTabs`, Workspaces tree, `ConfirmationModal`, toasts and status dots.

## Out Of Scope

Save setup as agent; Agent Orgs from Chat; per-member team configuration from Chat; separate Chats list; `/` and `@` in run views; per-reply model provenance; landing route change (DEC-005); changes to Agents / Teams / Orgs launch forms; a non-agent chat runtime.

## Open Decisions And Risks

- OPEN-001: Thinking control content must follow each runtime/model's config schema (on/off where supported, plus effort/budget/level parameters); the prototype shows illustrative effort levels only. The user did not confirm the proposed schema-driven presentation.
- OPEN-002 (DEC-005): whether AutoByteus lands on Chat instead of Agents.
- OPEN-003: Daily Assistant provisioning — built-in/internal agent vs the user's package agent, and how "all installed skills" is maintained.
- OPEN-004: persistence scope for Recent model pairs.
- OPEN-005: exact wording of the skill instruction (meaning fixed: "use these skills for this request").
- RSK-001: cross-runtime search loads several catalogs.
- RSK-002: overlap with the unfinished `codex/general-chat-entry` branch (DEC-008).
- Removed behavior to note: the old "paste file paths as attachments" in the "Context Files" row is not carried over; drag from the Files tree still attaches.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Prototype repository/root, source pin, and prototype revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes` (missing-chat and drag-overlay states are specified in text)
- Prototype, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes` (VIS-020 upload spinner is a documented prototype limitation)
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Prototype-repository artifact and visual-reference paths agree with this specification: `Yes`
