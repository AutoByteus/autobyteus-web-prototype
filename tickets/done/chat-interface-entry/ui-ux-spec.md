# UI/UX Specification — Chat entry (chat-interface-entry), revision R3

This is the canonical, prototype-owned UI/UX supplement for the Chat experience in AutoByteus Web. The final screenshots in `visual-references/` are normative visual references for implementation. Every visible detail defines requirements unless this specification marks it as illustrative or as a permitted variation.

Revision R2 applies the Solution Designer correction for SR-003:

- DEC-014, DEC-011, DEC-009 and DEC-013;
- the DEC-005 landing on Chat;
- the user's R2 review change: the send button moves into the footer row.

Where R2 differs from R1 (`personal@1579886`), R2 wins.

Revision R3 applies the Solution Designer correction for SR-012 (chat run view top area and right-side tabs) and the user's R3 review decisions. After the first message, a chat is a normal agent run and is shown as the product's agent run view:

- the chat run view renders inside the product workspace frame: a full-height right tabs column from the top of the window, the header over the middle column only, and the same tabs, strip, resize handle, collapse control and responsive behavior as the Team and Org views;
- the header is the product run header: avatar, run title, status, ⚙ and ＋ (no agent · workspace · approval line);
- ⚙ opens the product run settings (Agent Configuration), where model, thinking and auto-approve are shown; model and thinking are edited only there after the first message;
- the Chat box after the first message is the product box (Context Files, textarea, mic and send inside it), with `/` skill tags kept;
- the right panel's open/collapsed state is the one shared product setting.

Where R3 differs from R2 (`personal@8ac6cad`), R3 wins. The New chat page, the Chat box before the first message and the menus are unchanged.

## Status And User Confirmation

- Status: `Approved` (R3)
- Request / ticket: from Solution Designer. SR-001 is a Product Design Requested — New Request. SR-003 (Chat box) and SR-012 (chat run view top area and right tabs) are Result Corrections. Package and Product ticket: `chat-interface-entry`.
- Related requirements revision ID: `SR-012` (requirements `Approved`); R2 was based on SR-003.
- Related requirement, behavior, acceptance-criteria, and decision IDs: REQ-001–REQ-020, BEH-001–BEH-014, AC-001–AC-017, SCN-001–SCN-009, DEC-001–DEC-014
- Runnable prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`. The app lands on `/chat`, which is also the first primary-navigation item, `Chat`.
- Review URL: during review, `http://127.0.0.1:3271/chat` (ticket worktree). After integration, run the canonical repository and open `/` or `/chat` (see `prototype-runbook.md`).
- Explicit user-confirmation references:
  - R1: user message, 2026-09-28 — "If you think everything is consistent, then I think we're done with prototype UI …". This followed the final consistency pass (PC-035).
  - R2: user message, 2026-09-28 — "I think now the chat box looks good." This followed PC-036–PC-041.
  - R3: user message, 2026-09-29 — "I think it looks correct." This followed PC-042–PC-047.
- Final validation date: 2026-09-29.
  - `validate-chat-interface-entry.mjs`: 32/32 checks pass, 0 browser errors.
  - Typecheck passes.

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo` (remote `AutoByteus/autobyteus-workspace`)
- Selected frontend application or product surface: `autobyteus-web`. Surfaces: landing, shell navigation, New chat, Chat box, chat run view (workspace frame, run header, run settings), Workspaces tree.
- Pinned source commit or revision: `origin/personal@fcd3e83a4ca931ba52ed19bd37b8df3050ee529e`
- Prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype` (remote `AutoByteus/autobyteus-web-prototype`, branch `personal`)
- Prototype revision or commit: recorded in `prototype-ticket.md`. R3 was built on ticket branch `prototype/chat-interface-entry-r3`, from `personal@8ac6cad` (R2).
- Ticket folder: `tickets/done/chat-interface-entry/` in the prototype repository
- Bootstrap report path: `/Users/normy/autobyteus_org/autobyteus-web-prototype/prototype-bootstrap-report.md` (refresh `WEB-BASELINE-REFRESH-001`, accepted as `5ae0fe1`)

## Scope And Experience Goal

- **User or actor:** an AutoByteus desktop or web user. The primary user is the product owner acting as a power user, who develops and tests skills in chat before turning a proven setup into an agent, team or org.
- **Context:** AutoByteus opened on a catalog of definitions, with no chat entry. Choosing a runtime and model required a multi-step form.
- **Goal:** a first-class **Chat** entry, and the app lands on it. From Chat, the user can:
  - start a conversation in a few actions with the general **Daily Assistant**, which has all installed skills;
  - point it at a skill with `/`;
  - address a specific agent or team with `@`;
  - choose runtime, model and thinking quickly.

  All of this happens in a message box that looks like the product's existing one.
- **Observable success:**
  - From app launch, type and send starts a normal agent run, with no configuration form.
  - Runtime and model come from one compact menu.
  - The run appears in the Workspaces tree like any other run.
- **In-scope surfaces:**
  - the landing;
  - the primary-navigation Chat item and its New chat control (UIS-012);
  - the New chat page (UIS-001);
  - the Chat box (UIS-002) and its menus (UIS-003–UIS-007);
  - the chat run view (UIS-008), in the product workspace frame;
  - the right tabs column and strip in the chat run view (UIS-009);
  - the run settings view opened by ⚙ (UIS-013);
  - Workspaces tree behavior for chats (UIS-011).
- **In-scope journeys:** UXJ-001–UXJ-009 and UXJ-011.
- **Non-goals:**
  - any change to team-member and org-member run views (DEC-013);
  - a separate chat runtime that is not an agent;
  - changes to the Agents, Agent Teams or Agent Orgs catalogs, or to their launch forms;
  - "Save setup as agent" (DEC-003);
  - addressing Agent Orgs from Chat;
  - configuring individual team members from Chat;
  - a separate Chats list;
  - a Recent model list;
  - showing which model produced each reply.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-001, AC-001, BEH-001 | `Chat` is the first primary-navigation item, with a New chat (pencil) control; it stays active on all chat routes | UXJ-001; UIS-012; VIS-001 |
| REQ-020, AC-017, DEC-005 | The app lands on Chat (New chat) at startup (`/`) | UXJ-001; TR-000; VIS-001 |
| REQ-002, REQ-003, AC-002, BEH-005 | New chat composes and sends. The first message starts a normal agent run, shown in the chat run view and in the Workspaces tree | UXJ-001; UIS-001, UIS-008; VIS-001, VIS-015 |
| REQ-004, AC-003, BEH-004 | Temp workspace is the default. The user can pick another workspace or open a folder before the first message; after that it is fixed | UXJ-003; UIS-005; VIS-001, VIS-009 |
| REQ-005, AC-004, BEH-003, DEC-001, DEC-011 | One compact menu: search across enabled runtimes, runtime rows that open that runtime's models, and the loading, error + Retry and Not installed states. No Recent list | UXJ-002; UIS-003; VIS-002–VIS-007, VIS-022, VIS-024 |
| REQ-006, AC-005, DEC-009 | Thinking is a separate control driven by the model's config schema, hidden when the model has no thinking parameters | UXJ-002; UIS-004; VIS-008 |
| REQ-019, AC-016, DEC-011 | A New chat preselects the last-used runtime + model. If there is none, it uses Daily Assistant's default launch config, and otherwise the runtime default | UXJ-002; VIS-001, VIS-022 |
| REQ-007, DEC-002, DEC-010 | Daily Assistant backs Chat by default | UXJ-001 |
| REQ-008, AC-006, BEH-007, DEC-012 | `/` adds skill tags. The sent text is prefixed with the accepted instruction wording, and a "sent as" tooltip shows it | UXJ-004; UIS-006; VIS-010, VIS-011, VIS-016 |
| REQ-009, AC-007, BEH-008 | `@` or the tree `+` addresses a specific agent | UXJ-005; UIS-007; VIS-012, VIS-014 |
| REQ-010, AC-008, BEH-009 | Team quick path from `@` | UXJ-006; VIS-013 |
| REQ-011, AC-009, BEH-010, DEC-006 | Before the first message, model and thinking are chosen in the Chat box footer. After it, they are changed only in the run settings (⚙), like any agent run: locked while the run is live, editable when it is Offline; the runtime never changes | UXJ-007; UIS-013; VIS-017, VIS-026 |
| REQ-012, AC-010, BEH-011, DEC-007 | Single-agent runs open in the chat run view, which uses the product workspace frame: full-height right tabs column, header over the middle column, same tabs, strip, resize handle, collapse control and shared open/collapsed setting as the Team/Org views; a strip icon opens that tab | UXJ-009, UXJ-011; UIS-008/009; VIS-015, VIS-018, VIS-019, VIS-027 |
| REQ-013, AC-011, BEH-012, DEC-014 | The Chat box is the product's existing message box, with its existing Context Files area. On New chat, Chat adds the chips, `/`, `@`, and a footer with workspace, approval, model, thinking, mic and send. After the first message the box is the product box (mic and send inside the text area) with `/` skill tags | UXJ-004, UXJ-008; UIS-002; VIS-001, VIS-011, VIS-015, VIS-025 |
| REQ-013, DEC-013 | Team-member and org-member run views are unchanged | Out of scope (UXJ-010, UIS-010 and VIS-020 are superseded) |
| REQ-014, AC-012, BEH-013 | Auto-approve is on by default, with a toggle to Ask first before the first message. After it, the mode is shown in the run settings (⚙) as "Auto approve tools" | UXJ-008; VIS-011, VIS-017 |
| REQ-015, AC-013, BEH-014, DEC-004 | Chats are normal runs in the Workspaces tree, with the existing row actions. An unknown id shows the missing-chat state | UXJ-011; UIS-011; VIS-021 |
| REQ-016 | The chat run header is the product run header: avatar, run title (from the first message), status, ⚙ and ＋. Agent, workspace and approval are not repeated in the header (the tree and ⚙ show them). There are no divider notes | UIS-008; VIS-015 |
| REQ-017, AC-014 | The catalogs and launch forms are unchanged | Out of scope |
| REQ-018, AC-015 | The visuals match VIS-001–VIS-027, except illustrative content and VIS-020 (superseded) | All |

## Decision Status (SR-003)

All product decisions are resolved:

| Decision | Resolution |
| --- | --- |
| DEC-001 | Compact model menu |
| DEC-002 / DEC-010 | Daily Assistant backs Chat. It is an internal agent in the platform Built-in agent package, has all installed skills, and is visible and configurable like any agent |
| DEC-003 | No "Save setup as agent" |
| DEC-004 | Chats live in the Workspaces tree |
| DEC-005 | The app lands on Chat |
| DEC-006 | Model edit rule |
| DEC-007 | Chat view and right-side tools |
| DEC-008 | The old branch has been deleted |
| DEC-009 | Thinking is schema-driven |
| DEC-011 | No Recent list; a New chat preselects the last-used runtime + model |
| DEC-012 | Skill instruction wording accepted |
| DEC-013 | Team and org run views unchanged |
| DEC-014 | The Chat box is the existing box plus the Chat features |
| R3 (SR-012 + user review) | After the first message a chat is a normal agent run view: workspace frame, product run header with ⚙ ＋, product run settings, product box with `/`; shared right-panel setting |

## Production-Quality Experience And Visual Specification

### Existing product language to preserve

- The AutoByteus Web shell: the left panel, primary navigation, Workspaces tree, and right tool strip/panel.
- The Tailwind gray scale, with `blue-600` as the primary colour and `indigo-50` / `indigo-900` for tree selection.
- Heroicons.
- The existing message avatars and typography, toasts, confirmation modal and status dots.
- The Chat box reuses the product's existing message box and Context Files area.

### Information hierarchy

1. The conversation, or the New chat heading.
2. The Chat box.
3. The run header: run title and status (chat run view).
4. Navigation and the tree.

Before the first message, the settings the user can change live in the Chat box footer. After it, the chat is a normal agent run: its settings live under ⚙ and the tree shows its agent and workspace.

### Navigation and orientation

- The app lands on `/chat`.
- `Chat` is the first primary-navigation item, with a chat-bubbles icon. The pencil button on the item opens a fresh New chat.
- Opening a chat (`/chat?id=<runId>`) expands its workspace and agent in the tree, and selects its row (`bg-indigo-50 text-indigo-900`).

### Layout, dimensions and spacing

- **Primary navigation:** the split grows by one 40px row, so every item stays visible with the new Chat row.
  - The pencil (`p-2`, 18px icon, `right-10`) sits to the left of the existing collapse-panel button.
  - The label has 80px of right padding.
- **New chat page:** a centered `max-w-3xl` (768px) column with 14vh of bottom padding.
  - Heading: 28px.
  - 8px from heading to subtitle, 32px to the Chat box, and 10px from the box to the hint line.
- **Chat run view** (the product workspace frame, `WorkspaceAdaptiveLayout`, with the chat as its center pane):
  - Three columns: left panel · center pane (`bg-white`, flex-1, product center minimum width) · right tabs column. The right column is full height from the top of the window; the header spans only the center pane.
  - Header: the product run header — `px-3 py-2 sm:px-4`, bottom border gray-200, 57px total (aligned with the right tab bar's bottom border); 32×32 `rounded-lg bg-slate-100` avatar with initials (10px semibold slate-600); run title `text-base font-medium text-gray-800`, truncated; product status (`AgentStatusDisplay`: 12px dot + `text-sm font-medium text-gray-600`); right: ⚙ and ＋ (product `WorkspaceHeaderActions`, 40px round buttons, 20px icons, ⚙ gray-500, ＋ blue-500).
  - Body: the product run-view frame — `p-4`, 12px gap; the conversation is full width with each message `px-2 py-3`; the Chat box spans the full center width at the bottom.
  - Right side: the product docked panel (`RightSideTabs`, shadow, product width, 4px resize handle) or, when collapsed, the product 50px `RightSidebarStrip`; below the product breakpoint, the product strip + drawer policy.
- **Chat box**, from top to bottom:
  1. Context Files area (`px-3 py-2`, the product component).
  2. A 1px `gray-100` divider.
  3. An optional chip row (`px-3 pt-2.5`, gap 6px).
  4. The textarea: `px-3 py-2.5`, full width, auto-growing from 56px to a maximum of 220px.
  5. On New chat only: a 1px `gray-100` divider, then the footer row (`px-2 py-1.5`, gap 2px):
     - left group: workspace, then approval;
     - right group: model, thinking, a 4px spacer, mic, then send/stop.

     Send, stop and mic are 32px circles.
  6. After the first message (chat run view): no footer. The textarea reserves right padding (`pr-14`, or `pr-28` with the mic); send/stop sits inside it at `absolute bottom-2 right-2` and the mic at `bottom-2 right-14` (product box: `p-2` round buttons, 20px icons). Box geometry equals the Team/agent view box.
- **Right side:** as in the product workspace frame (see Chat run view).
- **Menu widths**, all clamped to the viewport:

  | Menu | Width |
  | --- | --- |
  | Model | 304px (`w-[19rem]`) |
  | Runtime submenu | 272px |
  | Thinking | 176px |
  | Workspace | 384px |
  | Skill / agent-team | 368px |

### Typography

Everything uses the product font stack.

| Element | Treatment |
| --- | --- |
| New chat heading | 28px, semibold, tracking-tight, gray-900 |
| Subtitle | 14px gray-500, with `/` and `@` shown as small `kbd` |
| Chat run title | `text-base font-medium text-gray-800`, truncated (product run header) |
| Run header status | product `AgentStatusDisplay` (dot 12px, `text-sm font-medium text-gray-600`) |
| Message and textarea text | 15px / 24px |
| Context Files label / hint | 12px medium gray-700 / 12px gray-400 |
| Footer controls | 13px / 20px |
| Menu rows | 13px |
| Menu section labels | 11px medium gray-400 |
| Chips | 12px medium |

Model names never wrap.

### Colours and semantic roles

| Element | Colour |
| --- | --- |
| Send | `blue-600`, hover `blue-700`, 50% opacity when disabled |
| Stop | `red-600` |
| Mic | `slate-100` / `slate-700`; while recording, `red-600` / white |
| Context Files `+` | `blue-500`; on hover, white on `blue-500` |
| Context Files rows | `gray-100`, hover `gray-200`, `red-500` remove |
| Image remove badge | `#ef4444` |
| "Clear All" | `blue-600` text, `blue-100` border |
| Skill chips | `indigo-50` / `indigo-200` / `indigo-700` |
| Context files on sent messages | `sky-50` / `sky-200` / `sky-700` |
| `Ask first` | `amber-700` |
| Locked run settings | product disabled form controls; amber note `bg-amber-50 text-amber-700` with 🔒 |
| Run status dots | product status visuals: Running `blue-500` (pulse), Idle `green-500`, Offline `gray-400` |
| Menu check | `blue-600` |
| Catalog error | `red-600` |
| "Sent as" tooltip | `gray-900` background, `gray-100` text |

### Surfaces, borders, radii and shadows

- **Chat box:** `rounded-xl`, 1px `gray-200` border, `shadow-sm`. On focus-within: `ring-2 ring-blue-500/20` and `border-blue-300`. This is the product box treatment.
- **Menus:** `rounded-lg`, 1px `gray-200` border, `shadow-lg`, z-50. On narrow viewports, menus become bottom sheets over a `black/20` scrim.
- **Image thumbnails:** 42×42, `rounded-md`, 1px `gray-300` border (product).
- **Chips:** `rounded-md`.
- **Avatars:** the run header avatar is 32×32 `rounded-lg bg-slate-100` (product); message avatars are 36px circles.

### Controls and icons

- Heroicons: chat-bubble-left-right, pencil-square, folder, shield-check / shield-exclamation, light-bulb, chevron-down, magnifying-glass, lock-closed, check, x-mark, sparkles, microphone, paper-airplane, stop.
- The Context Files area uses the product component's own icons.
- Footer controls are borderless ghost buttons (`rounded-md px-2 py-1`, hover `gray-100`).

### Interaction states and feedback

- **Hover and focus:** ghost buttons use `hover:bg-gray-100`. Keyboard focus shows `ring-2 ring-blue-500/40`.
- **Menus:** rows use `bg-gray-100` on hover and focus. The current selection shows a check.
- **Locked settings (run settings, ⚙):** the product form's disabled model/thinking controls and its amber note "Stop this run before changing model settings."
- **Send:** disabled until there is text, a tag or a context file.
- **Workspace path validation:** "Enter an absolute folder path."
- **Delete and archive:** the existing toasts.

### Motion

- 150–200ms colour and shadow transitions (product).
- The runtime submenu opens after a 90ms hover intent.
- Spinners show loading.
- Tooltips fade in over 100ms.
- Reduced motion turns off non-essential animation.

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Any user; app start or any page | App open | Start a chat with Daily Assistant | Live run in the chat run view; row selected in the tree | REQ-001–004, REQ-007, REQ-020 |
| UXJ-002 | New chat | Last-used runtime + model preselected | Choose runtime + model (+ thinking) | Button shows `model Runtime`; thinking follows the model's schema | REQ-005, REQ-006, REQ-019 |
| UXJ-003 | New chat | Temp workspace | Use another workspace or folder | Workspace button and hint updated | REQ-004 |
| UXJ-004 | Chat (new or reply) | Empty box | Point the agent at skills | Chips; after sending, chips on the message with "sent as" | REQ-008 |
| UXJ-005 | New chat | Daily Assistant | Chat with a specific agent | Agent chip; the agent's skills in `/` | REQ-009 |
| UXJ-006 | New chat | Daily Assistant | Start an agent team quickly | Team run in the existing Team view | REQ-010 |
| UXJ-007 | Existing chat | Live or Offline run | Change model or thinking | ⚙ run settings saved while Offline; applies when the next message resumes the run | REQ-011 |
| UXJ-008 | Chat box | Empty box | Attach context files, dictate, choose Ask first | Context Files list; transcript; Ask first | REQ-013, REQ-014 |
| UXJ-009 | Chat run view | Right tabs column (shared open/collapsed setting) | Use workspace tools | Panel open on the chosen tab | REQ-012 |
| UXJ-010 | — | — | **Superseded (DEC-013):** team and org run views are unchanged | — | DEC-013 |
| UXJ-011 | Workspaces tree | Chats exist | Reopen, archive, delete or terminate chats | Chat view, row removed, or Offline | REQ-015 |

## Journey Details

### UXJ-001 — Start a chat

1. The app lands on Chat. The user can also click `Chat` or its pencil. This opens New chat (VIS-001), which shows:
   - Heading: "What should we work on?"
   - Subtitle: "All your skills are available. Type / to use a skill, or @ to chat with an agent or team."
   - The Chat box:
     - the Context Files row, "Context Files (0) (drag, paste, or upload) +";
     - the focused textarea, with the placeholder "Ask anything · / for skills · @ for an agent or team";
     - the footer: `📁 Temp workspace ⌄ · 🛡 Auto-approve … <model> <Runtime> ⌄ · 💡 <level> ⌄ · [🎤] · ➤`.
   - Hint line: "Files are saved in the temp workspace · ~/.autobyteus/temp_workspace".
2. Enter sends; Shift+Enter inserts a newline. On send:
   - the send button shows a spinner;
   - the hint changes to "Starting Daily Assistant on <Runtime>…";
   - the route changes to `/chat?id=<runId>`.
3. The run row appears under workspace → Daily Assistant and is selected. Its title comes from the first message (at most 42 characters, then an ellipsis).
4. The reply streams, and the header status goes from Running to Idle (VIS-015).

### UXJ-002 — Choose runtime and model

**Preselection.** A New chat preselects, in order of preference:

1. the last-used runtime + model (one value remembered on this device);
2. otherwise, Daily Assistant's default launch config;
3. otherwise, the runtime default (VIS-022).

Addressing an agent or team does not change the preselection.

**The menu.** Clicking the model button opens the menu (VIS-002):

- A search field, "Search models".
- A `Runtimes` section. Each row shows the label, a blue dot on the current runtime, the model count once loaded, and `›`.
- Hovering or clicking a runtime opens a side submenu with its models (VIS-003):
  - provider sub-labels appear when a runtime has more than one provider;
  - the current model has a check;
  - the submenu opens to the left when there is no room on the right.

**Keyboard.** Arrow keys move within a level. → opens a runtime and ← returns. Enter selects. Esc closes.

**Search.** Search matches models across all enabled runtimes, and each result is labelled with its runtime (VIS-004). While loading it shows "Searching all runtimes…". With no results it shows "No models match "<q>"".

**States:**

| State | Presentation |
| --- | --- |
| Loading | "Loading models…" (VIS-005) |
| Error | "Couldn't load models" + `Retry` (VIS-006) |
| Runtime not installed | A muted row, "Not installed", with the reason on hover; it cannot be opened (VIS-007) |
| Narrow | A bottom sheet with drill-in and a back row (VIS-024) |

Choosing a model applies that model's default thinking.

**Thinking rule (DEC-009).** The thinking control shows only the parameters that the selected runtime/model exposes in its config schema: on/off, effort, budget or level. The control is hidden when the model has none. VIS-008 shows an effort menu ("Reasoning effort" levels); it is an illustrative example of one schema.

### UXJ-003 — Workspace

The workspace button opens a menu (VIS-009):

- `Temp workspace`, with a `Default` badge and the description "Scratch folder for quick chats".
- `YOUR WORKSPACES`, each with its name and path.
- "Open another folder…", which shows:
  - a "Folder path" field;
  - `Cancel` and `Use folder`;
  - the validation message "Enter an absolute folder path."

The hint line follows the choice. After the first message, the workspace is fixed; the tree shows it, and ⚙ shows it as fixed.

### UXJ-004 — Tag skills

**Opening the menu.** Typing `/` at the start of a word opens the skill menu (VIS-010):

- Header: "Skills matching /<q> · ↑↓ to move, Enter to add".
- Ranking: name prefix first, then name contains, then description.
- A bare `/` lists all of the addressed agent's skills.
- Footer: "All skills are available" for Daily Assistant; for another agent, "This agent's skills" + `Manage skills →`.

**Adding tags.** Enter, Tab or a click adds an indigo chip, `✦ /<skill> ×`, above the text, and removes `/<q>` from the text.

- Several tags are allowed.
- A message may contain tags only.

**After sending.** Sent messages keep their chips. Hover or keyboard focus shows "SENT TO THE AGENT AS" with the exact text that was sent (VIS-016):

1. the instruction — `Use the <skill> skill for this request.` for one skill, or `Use these skills for this request: <a>, <b>.` for several;
2. a blank line;
3. the user's text.

### UXJ-005 — Address an agent

**Using `@`.** In a New chat, `@` opens a menu (VIS-012):

- Header: "Chat with @<q>".
- Groups: `Agents` and `Agent teams`. Daily Assistant is the default and is not listed.

**Choosing an agent.** Choosing Codex (VIS-014):

- shows an agent chip with `×`;
- changes the subtitle to "Chat with Codex, using its own tools and skills.";
- changes the placeholder to "Ask Codex anything…";
- makes `/` list only Codex's skills.

**From the tree.** `+` on an agent in the tree starts a New chat with that agent and workspace.

`@` is available only before the first message.

### UXJ-006 — Team quick path

1. `@prod` then Enter adds a team chip (VIS-013) and updates the New chat:
   - Subtitle: "Your message goes to Product Review Team's coordinator."
   - Placeholder: "Message Product Review Team…"
   - Note: "All members use this model, the temp workspace and this approval setting. For per-member setup, start it from Agent Teams."
2. Send opens the existing Team view, with the coordinator focused.

Agent Orgs cannot be addressed.

### UXJ-007 — Change the model of an existing chat

After the first message, the Chat box has no model or thinking controls. The chat is a normal agent run, and its settings live under ⚙ in the run header, exactly as for any agent run.

1. ⚙ opens the product run settings in the center pane (UIS-013): "Agent Configuration" with a back arrow (`←`, returns to the conversation), then:
   - Agent Definition (read-only, e.g. Daily Assistant);
   - Runtime (fixed; "Runtime is fixed for this saved run.");
   - LLM Model (models of this runtime only) and the model's thinking settings, driven by its config schema (DEC-009; the prototype shows a Thinking toggle and "Reasoning effort");
   - Workspace Directory (fixed; "Workspace is fixed for existing runs.");
   - Auto approve tools (the run's setting, read-only);
   - the product status note and a full-width `Save` button in the footer.
2. **While the run is live** (Running or Idle): model and thinking are disabled and the note reads "Stop this run before changing model settings." (VIS-026). `Save` stays disabled.
3. **After terminating** from the tree row ("Terminate run"): the status becomes `Offline`, model and thinking are editable, and the note reads "This run is stopped. Saved model settings will be used when it resumes." (VIS-017). `Save` is enabled once something changes.

Saved settings apply when the next message resumes the run. There are no divider notes in the conversation.

＋ in the run header starts a new run of this agent: a New chat preset to this agent and workspace (as the tree's `+`).

### UXJ-008 — Context files, voice, approval

**Context Files.** The Chat box uses the product's Context Files area:

- Header: "Context Files (N)", followed by the hint "(drag, paste, or upload)" when empty, and a `+` upload button.
- Adding files: drag files onto the area, or paste. Pasted files are added as files; pasted text lines are added as paths.
- The list is collapsible with its chevron (VIS-011). It shows:
  - 42px image thumbnails — click to preview; a red remove badge appears on hover;
  - file rows, each with the name and a red `×`;
  - "Clear All".
- Sent chat messages list their files under "Context files".

**Voice.** The 🎤 button appears before send only when the Voice Input extension is installed and enabled (VIS-025).

- While recording or transcribing, the product status row shows "Recording... Tap stop when you are done." or "Transcribing voice input...".
- The transcript goes into the textarea.

**Approval.** Before the first message, the shield toggles between `🛡 Auto-approve` and `🛡 Ask first`.

- Auto-approve is the default for every new chat, in any workspace.
- After the first message, the mode is shown in the run settings (⚙) as "Auto approve tools".

### UXJ-009 — Workspace tools

The chat run view uses the product workspace frame, so its right side is identical to the Team and Org views:

- Open: the full-height `RightSideTabs` column (Files, Terminal, Activity, Token, Artifacts, VNC Viewer, plus Team and Browser where they apply), with the product tab bar aligned to the run header, the resize handle and the collapse control (VIS-015, VIS-018).
- Collapsed: the product 50px strip with one icon per tab (VIS-019). Clicking an icon reopens the panel on exactly that tab (VIS-018). A contextual default tab must not override the clicked tab.
- The open/collapsed state is the one shared product setting: collapsing it in a Team view also collapses it in Chat, and the other way round. The product default is open.
- Narrow viewports follow the product responsive policy (left and right strips, drawer; VIS-027).

### UXJ-010 — Superseded (DEC-013)

Team-member and org-member run views keep their existing message box. They change the model through the existing gear settings editor. No Chat changes apply there.

### UXJ-011 — Chats in the tree

Chats are runs under workspace → agent (VIS-021).

- They are sorted like any run: workspaces and agents by name, runs newest first.
- Groups stay collapsed unless they hold the open chat.

Clicking a single-agent run opens the chat run view; team and org runs keep their own view. Archive, delete (with the existing confirmation and toasts) and Terminate run use the existing row actions. An unknown chat id shows "This chat no longer exists" + `New chat`.

## Screen And Surface Specification

| Surface ID | Purpose | Entry Conditions | Structure And Hierarchy | Important States | Primary Actions | Exit / Next Action | Visual IDs |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UIS-001 | New chat | App start (`/`), `/chat`, Chat item, pencil, tree `+` | Heading, subtitle, Chat box, hint line | Default; agent-addressed; team-addressed; starting | Type, tag, address, send | Chat view or Team view | VIS-001, 011, 013, 014, 023, 025 |
| UIS-002 | Chat box | New chat and chat run view | New chat: Context Files area → divider → chip row (optional) → textarea → divider → footer (left: workspace, approval; right: model, thinking, mic, send/stop). Chat run view: the product box — Context Files → chip row (optional) → textarea with mic and send/stop inside | Empty (send disabled); files listed; chips; voice status; running (stop) | Upload/drag/paste, tag, send/stop, dictate | — | VIS-001, 011, 015, 025 |
| UIS-003 | Runtime + model menu | Model button | Search · Runtimes (+ submenu) | Loading, error, not installed, search, narrow sheet (New chat) | Pick a model | Closes; button updates | VIS-002–007, 017, 022, 024 |
| UIS-004 | Thinking control | New chat, model exposes thinking parameters | Button with current value; menu of the model's parameters | Hidden when none (after the first message: in the run settings, UIS-013) | Change value | Closes | VIS-008 |
| UIS-005 | Workspace menu | Workspace button (New chat) | Temp default · your workspaces · open folder | Folder form with validation | Pick / add | Closes | VIS-009 |
| UIS-006 | Skill menu | `/` | Header hint · ranked list · footer | Empty messages | Add chip | Closes | VIS-010, 014 |
| UIS-007 | Agent / team menu | `@` (New chat) | Header hint · Agents · Agent teams · footer | No match | Address | Chip shown | VIS-012 |
| UIS-008 | Chat run view | `/chat?id=<runId>` | Product workspace frame: run header (avatar, title, status, ⚙ ＋) · conversation · product box · full-height right tabs column | Running, Idle, Offline; missing chat | Reply, tag, ⚙, ＋, tools | Tree; New chat (＋) | VIS-015, 016, 018, 019, 027 |
| UIS-009 | Right tabs column / strip | Chat run view | Product `RightSideTabs` column (resizable) ↔ product 50px strip; drawer on narrow | Open (product default) / collapsed — one shared setting with the Team/Org views | Open tab, collapse, resize | — | VIS-015, 018, 019, 027 |
| UIS-010 | **Superseded (DEC-013)** | — | Team and org run views unchanged | — | — | — | — |
| UIS-011 | Workspaces tree (chats) | Left panel, all routes | Workspace → agent → runs; teams; orgs | Selected; live (terminate); stored (archive, delete) | Open, terminate, archive, delete | Chat view | VIS-015, 021 |
| UIS-013 | Run settings (⚙) | ⚙ in the chat run header | Product "Agent Configuration": back arrow · Agent Definition · Runtime (fixed) · LLM Model + thinking settings · Workspace (fixed) · Auto approve tools · status note · Save | Live (locked) / Offline (editable) | Change model/thinking, Save, back | Conversation | VIS-017, 026 |
| UIS-012 | Chat navigation item | Shell | Icon + "Chat" + pencil + collapse control | Active on chat routes | Go to Chat; New chat | New chat | VIS-001 |

\* The workspace control appears only on New chat. After the first message the workspace is fixed; the tree and the run settings (⚙) show it.

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-000 | App start | Open the app (`/`) | "Opening Chat..." | New chat | — | As in TR-001 |
| TR-001 | Any page | Click `Chat` or its pencil | Route `/chat`; textarea focused | New chat (fresh draft) | Draft: Daily Assistant, Temp workspace, Auto-approve, last-used runtime + model (REQ-019), no files, no tags | Type, pickers, `/`, `@` |
| TR-002 | New chat | Send | Send spinner; "Starting … on …" | Chat view, Running | A new normal agent run; the tree row is added and selected; the last-used value is updated | Stop; reply |
| TR-003 | Model menu | Hover or click a runtime | Submenu (loading if needed) | Runtime's models listed | Catalog loaded on demand | Pick, search, back |
| TR-004 | Model menu | Pick a model | Menu closes | Button shows model + runtime; thinking reset to the model's default | — | — |
| TR-005 | Textarea | Type `/` | Skill menu | Ranked list | — | ↑↓, Enter/Tab, Esc |
| TR-006 | Skill menu | Choose a skill | `/q` removed, chip added | Chip row visible | Tag kept with the draft | More tags, send |
| TR-007 | New chat | Type `@`, choose | `@q` removed; chip shown; subtitle and placeholder update | Addressed draft | The skills pool follows the agent; the model is unchanged | Send, `×` |
| TR-008 | Team-addressed New chat | Send | Starting hint | Team view, coordinator focused | Team run with shared model, workspace and approval | Team view |
| TR-009 | Chat run view, live | Terminate run in the tree | Existing feedback | Offline; run settings editable | Run inactive | ⚙ change model/thinking, send |
| TR-010 | Run settings, Offline | Change model or thinking, Save | Save disables (nothing left to save) | Saved settings | Applied when the next message resumes the run | Back, send |
| TR-011 | Context Files area | `+`, drag or paste | Count and list update | Files listed | Upload follows the product rules | Remove, Clear All, send |
| TR-012 | New chat | Click the shield | Label and colour toggle | Auto-approve ↔ Ask first | Applies to the run (and to all team members) | Send |
| TR-013 | Chat run view, strip | Click a strip icon | Panel opens on exactly that tab | Panel open | Active tab set; shared open state | Collapse, resize |
| TR-015 | Chat run view | Click ⚙ | Center pane shows the run settings | Run settings | — | Back, Save |
| TR-016 | Chat run view | Click ＋ | Route `/chat` | New chat preset to this agent and workspace | Draft agent/workspace set | Type, send |
| TR-014 | Tree | Click a single-agent run | Row selected | Chat view | — | Reply, tools |

## State Behavior

| Surface / State | Trigger | Required Presentation And Message | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Model menu / catalog loading | First open of a runtime | Spinner + "Loading models…" | Other runtimes, search | Automatic | VIS-005 |
| Model menu / catalog error | Catalog fails to load | "Couldn't load models" (red) + `Retry` | Retry | Retry reloads | VIS-006 |
| Model menu / runtime not installed | Runtime disabled | Muted row, "Not installed", reason on hover | Other runtimes | Install elsewhere | VIS-007 |
| Model menu / search empty | No match | "No models match "<q>"" | Edit the query | — | — |
| New chat / no last-used value | First use | Daily Assistant's default launch config if it has one, otherwise the runtime default | All pickers | — | VIS-022 |
| Thinking / not supported | Model has no thinking parameters | Control hidden | — | — | — |
| Run header status | Run lifecycle | Product status: Running (blue, pulse) · Idle (green) · Offline (gray) | — | — | VIS-015, 019 |
| Run settings locked | Run is live | Model and thinking disabled; "Stop this run before changing model settings."; Save disabled | Back | Terminate from the tree | VIS-026 |
| Send disabled | No text, tag or context file; or runtime unavailable | Disabled send; its label gives the blocking reason when there is one | Type | — | VIS-001 |
| Context Files empty | No files | "Context Files (0) (drag, paste, or upload)" + `+` | Upload, drag, paste | — | VIS-001 |
| Context Files listed | Files added | Count, collapsible list, thumbnails, file rows, "Clear All" | Preview, remove, clear | — | VIS-011 |
| Skill menu empty | No skills, or no match | "This agent has no skills" / "No skills match" | Edit | Esc | — |
| Voice | Extension installed and enabled | 🎤 before send; the product status row while recording or transcribing | Stop recording | — | VIS-025 |
| Missing chat | Unknown `id` | "This chat no longer exists" + `New chat` | New chat | — | — |

## Responsive And Platform Behavior

- **Desktop:** as shown in the desktop references. The chat run view follows the product workspace responsive policy (docked panel, strip, or drawer by available width).
- **Narrow (below 640px, e.g. 390×844),** shown in VIS-023 and VIS-024:
  - The left panel collapses to the product icon strip.
  - The heading wraps.
  - The Context Files row keeps its label, hint and `+`.
  - New chat: the footer wraps: the left group on the first line; the right group (model, thinking, send) on the next.
  - Chat run view: left and right product strips; the title truncates; the box keeps mic and send inside the text area (VIS-027).
  - The runtime label beside the model name is hidden.
  - Menus become bottom sheets over a scrim, with drill-in for runtimes.
  - There is no horizontal overflow.
- **Desktop app:** identical, except that the mic follows the Voice Input extension.

## Accessibility And Keyboard Behavior

- **Chat box:** Enter sends; Shift+Enter inserts a newline.
- **`/` and `@` menus:** ↑/↓ move, Enter or Tab chooses, and Esc closes and returns focus to the textarea.
- **Model menu:**
  - the menu has role `menu`;
  - items are `menuitemradio` with `aria-checked`;
  - runtime rows have `aria-haspopup="menu"`;
  - → opens a runtime, ← returns, and Esc closes and returns focus to the trigger.
- **Triggers** expose `aria-expanded` and descriptive labels.
- **Run settings** use the product form's labels, disabled states and status note; the back arrow is labelled "Back to event view"; ⚙ and ＋ use the product labels.
- **Context Files area** keeps the product's labels ("Upload files", "Remove file", "Open image preview") and the list's `aria-controls` / `aria-expanded`.
- **Chips:** remove buttons are labelled. The "sent as" tooltip has `role="tooltip"` and opens on keyboard focus of the chip group.
- **Focus** rings are `ring-2 ring-blue-500/40`.
- **Locked or muted state** is never shown by colour alone: the run settings pair disabled controls with the product status note.

## Content, Labels, Validation, And Feedback

All strings below are normative UI copy.

- **Landing:** `Opening Chat...` (a brief redirect state).
- **Navigation:** `Chat`; the pencil is `New chat`.
- **New chat subtitles:**
  - `What should we work on?` (heading)
  - `All your skills are available. Type / to use a skill, or @ to chat with an agent or team.`
  - `Chat with <agent>, using its own tools and skills.`
  - `Your message goes to <team>'s coordinator.`
- **Placeholders:**
  - `Ask anything · / for skills · @ for an agent or team`
  - `Ask <agent> anything…`
  - `Message <team>…`
  - replies: `Reply, or type / to use a skill` (Daily Assistant), or `Message <agent>…`
- **Hint line:**
  - `Files are saved in the temp workspace · <path>`
  - `Files are saved in <workspace> · <path>`
  - while starting: `Starting <agent or team> on <Runtime>…`
  - team note: `All members use this model, the <workspace> and this approval setting. For per-member setup, start it from Agent Teams.`
- **Context Files** (product copy): `Context Files (<n>)`, `(drag, paste, or upload)`, `Upload files`, `Remove this file`, `Remove file`, `Open image preview`, `Clear All`. On sent messages: `Context files`.
- **Voice** (product copy): `Start voice input`, `Stop recording`, `Recording... Tap stop when you are done.`, `Transcribing voice input...`.
- **Model menu:** `Search models`, `Runtimes`, `Not installed`, `Loading models…`, `Couldn't load models`, `Retry`, `Searching all runtimes…`, `No models match "<q>"`.
- **Thinking:** labels come from the model's config schema. The prototype's `Reasoning effort` levels are illustrative.
- **Workspace:** `Temp workspace`, `Default`, `Scratch folder for quick chats`, `YOUR WORKSPACES`, `Open another folder…`, `Folder path`, `Cancel`, `Use folder`, `Enter an absolute folder path.`
- **Approval:** `Auto-approve` / `Ask first`, with the tooltips:
  - `Tools run without asking. Click to ask before running tools.`
  - `Tools ask before running. Click to let tools run without asking.`
- **Skills:** `Skills matching /<q> · ↑↓ to move, Enter to add`, `All skills are available` / `This agent's skills`, `Manage skills →`, `No skills match` / `This agent has no skills`. The tooltip label is `SENT TO THE AGENT AS`. The instruction wording is as in UXJ-004 (DEC-012).
- **Addressing:** `Chat with @<q> · ↑↓ to move, Enter to choose`, `Agents`, `Agent teams`, `Teams: your message goes to the coordinator`, `No agents or teams match`.
- **Run settings (product copy):** `Agent Configuration`, `Agent Definition`, `Runtime`, `Runtime is fixed for this saved run.`, `LLM Model`, `Workspace Directory`, `Workspace is fixed for existing runs.`, `Auto approve tools`, `Stop this run before changing model settings.`, `This run is stopped. Saved model settings will be used when it resumes.`, `Save`.
- **Status:** `Running`, `Idle`, `Offline`.
- **Missing chat:** `This chat no longer exists`, `New chat`.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | Prototype Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Runtime availability + per-runtime catalogs | UIS-003 | Synthetic catalogs with simulated latency; the `chat_catalog_error` and `chat_runtime_unavailable` scenarios | Existing availability and runtime-scoped catalog APIs; cross-runtime search loads the enabled catalogs (RSK-001) |
| Last-used runtime + model | REQ-019 | One value stored locally in the browser | One value remembered on this device (storage per the architecture) |
| Thinking parameters | UIS-004 | Illustrative per-model effort levels | Driven by the runtime/model config schema (`ModelConfigSection`, `llmThinkingConfigAdapter`) |
| Daily Assistant with all skills | Default agent | A fixture agent that lists all skills. It is not shown in the prototype's Agents catalog fixture | An internal agent in the platform Built-in package, with all installed skills, visible and configurable like any agent (DEC-010) |
| Skill tagging | UXJ-004 | Instruction prepended to the stored message; the reply is simulated | Instruction prepended to the text sent to the run; the display shows the chips and the user's text. Client or server placement is decided in the architecture |
| Chat runs | UIS-008, UIS-011 | A prototype-only chat store, projected into the real Workspaces tree; streaming simulated | Normal agent runs through the existing run lifecycle, history and stream APIs |
| Team from Chat | UXJ-006 | Opens stored run `team-run-001` as a stand-in, with a toast that explains this | Create a team run with shared settings; the first message goes to the coordinator |
| Model edit rule | UXJ-007 | A local `active` flag; the product run settings form fed with the chat run (prototype glue registers its runtime and workspace in product stores) | Server `runModelConfigEditability`; reuse the product existing-run settings editor for this agent run |
| Context Files in Chat | UXJ-008 | A prototype mirror of the product component (same markup, styles and behavior), using local files and object URLs | Reuse the product `ContextFilePathInputArea`, with its upload and draft ownership |
| Voice | UXJ-008 | Simulated recording and transcript; availability comes from the real extension store | Existing voice input |
| Terminate / archive / delete | UIS-011 | Chat runs mapped to local state, behind the product's confirmation and toasts | Existing run mutations |

## Final Visual Reference Inventory

Paths are relative to this ticket folder. All R2 references were captured again after the user confirmed R2.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 · UIS-001/002/012 · New chat | 1440×900 | `visual-references/VIS-001-new-chat-default-1440x900.png` | Nav with Chat first and the pencil; heading and subtitle; Chat box with the Context Files row, the textarea, and the footer in order ending with send; hint | Workspace names and paths, model, level |
| VIS-002 | UXJ-002 · menu (no Recent) | 1440×900 | `visual-references/VIS-002-model-menu-search-runtimes-1440x900.png` | Search; Runtimes rows with the current dot, counts and chevrons; no Recent | Counts, names |
| VIS-003 | UXJ-002 · submenu | 1440×900 | `visual-references/VIS-003-model-menu-runtime-submenu-1440x900.png` | Side submenu; provider sub-labels | Model and provider names |
| VIS-004 | UXJ-002 · search | 1440×900 | `visual-references/VIS-004-model-menu-search-1440x900.png` | Results across runtimes, labelled by runtime | Names |
| VIS-005 | UXJ-002 · loading | 1440×900 | `visual-references/VIS-005-model-menu-loading-1440x900.png` | Loading row | Runtime |
| VIS-006 | UXJ-002 · error | 1440×900 | `visual-references/VIS-006-model-menu-catalog-error-1440x900.png` | Error + Retry | Runtime |
| VIS-007 | UXJ-002 · not installed | 1440×900 | `visual-references/VIS-007-model-menu-runtime-not-installed-1440x900.png` | Muted "Not installed" row | Runtime |
| VIS-008 | UXJ-002 · UIS-004 | 1440×900 | `visual-references/VIS-008-thinking-menu-1440x900.png` | A separate thinking control, and where its menu opens | Parameter type, labels and values (schema-driven, DEC-009) |
| VIS-009 | UXJ-003 · UIS-005 | 1440×900 | `visual-references/VIS-009-workspace-menu-1440x900.png` | Temp workspace as default, with its badge; workspaces with paths; open folder | Names, paths |
| VIS-010 | UXJ-004 · UIS-006 | 1440×900 | `visual-references/VIS-010-skill-slash-menu-1440x900.png` | Header hint; ranked rows; footer | Skill names |
| VIS-011 | UXJ-004/008 · UIS-002 | 1440×900 | `visual-references/VIS-011-composer-chips-attachments-ask-first-1440x900.png` | The product Context Files list (thumbnail, file row, Clear All) above the skill chips, the text, and a footer with Ask first and send | File names, image, text |
| VIS-012 | UXJ-005 · UIS-007 | 1440×900 | `visual-references/VIS-012-at-agent-team-menu-1440x900.png` | Agents and Agent teams groups; footer | Names |
| VIS-013 | UXJ-006 · team draft | 1440×900 | `visual-references/VIS-013-team-chat-draft-1440x900.png` | Team chip; coordinator subtitle; note with link | Names |
| VIS-014 | UXJ-005 · agent draft | 1440×900 | `visual-references/VIS-014-agent-chat-draft-codex-skills-1440x900.png` | Agent chip; `/` lists that agent's skills | Names |
| VIS-015 | UXJ-001/009 · chat run view, live | 1440×900 | `visual-references/VIS-015-chat-run-view-live-1440x900.png` | Workspace frame (full-height right tabs column, header over the middle column, aligned bars); product run header (avatar, title, Idle, ⚙ ＋); chips on the message; product box with send inside, no model/thinking; tree row selected with Terminate | Titles, reply text, open tab |
| VIS-016 | UXJ-004 · sent as | 1440×900 | `visual-references/VIS-016-sent-as-tooltip-1440x900.png` | Tooltip with the exact sent text, in the chat run view | Message text |
| VIS-017 | UXJ-007 · run settings, Offline | 1440×900 | `visual-references/VIS-017-chat-run-settings-stopped-1440x900.png` | Product Agent Configuration: fixed runtime and workspace, editable model + thinking, Auto approve tools, stopped note, Save | Model names, thinking parameter |
| VIS-018 | UXJ-009 · panel from strip | 1440×900 | `visual-references/VIS-018-right-tool-panel-open-1440x900.png` | Panel reopened from the strip on the clicked tab (Artifacts) | Panel contents |
| VIS-019 | UXJ-009 · collapsed | 1440×900 | `visual-references/VIS-019-stored-chat-strip-collapsed-1440x900.png` | Stored chat (Offline); right tabs collapsed to the product strip; box across the full center width | Content |
| VIS-020 | **Superseded (DEC-013)** | — | — (removed) | Team and org run views unchanged | — |
| VIS-026 | UXJ-007 · run settings, live | 1440×900 | `visual-references/VIS-026-chat-run-settings-live-locked-1440x900.png` | Model and thinking disabled; "Stop this run before changing model settings." | Model names |
| VIS-027 | UXJ-001/009 · narrow chat run view | 390×844 | `visual-references/VIS-027-narrow-chat-run-view-390x844.png` | Left and right product strips; product header; product box | Wrap positions |
| VIS-021 | UXJ-011 · tree | 1440×900 | `visual-references/VIS-021-workspaces-tree-normal-order-1440x900.png` | Product ordering; Daily Assistant group | Names, ages |
| VIS-022 | UXJ-002 · first use | 1440×900 | `visual-references/VIS-022-first-run-model-menu-1440x900.png` | With no last-used value, the runtime default is preselected; no Recent | Default model name |
| VIS-023 | UXJ-001 · narrow | 390×844 | `visual-references/VIS-023-narrow-new-chat-390x844.png` | Narrow Chat box: Context Files row, textarea, wrapped footer | Wrap positions |
| VIS-024 | UXJ-002 · narrow sheet | 390×844 | `visual-references/VIS-024-narrow-model-bottom-sheet-390x844.png` | Bottom sheet; drill-in rows | Names |
| VIS-025 | UXJ-008 · voice | 1440×900 | `visual-references/VIS-025-chat-with-voice-available-1440x900.png` | New chat: mic just before send, at the end of the footer | — |

`visual-references/manifest.json` records each file's viewport and SHA-256 hash.

## Linked Prototype Evidence

- Runnable prototype: `/Users/normy/autobyteus_org/autobyteus-web-prototype`; open `/`, which lands on `/chat`.
- Prototype ticket record: `prototype-ticket.md`.
- Run instructions: `prototype-runbook.md`.
- Supporting artifacts: `prototype-change-log.md` (PC-001–PC-047), `ui-behavior-test-matrix.md`, `review-evidence/`, `visual-references/manifest.json`.
- Validation: `prototype/scripts/validate-chat-interface-entry.mjs` (32 checks).
- Captures: `prototype/scripts/capture-chat-interface-entry-final.mjs`.
- Journeys: UXJ-001–UXJ-011 (UXJ-010 superseded).
- Transitions: TR-000–TR-014.
- Scenarios: default, `chat_first_run`, `chat_catalog_error`, `chat_runtime_unavailable`.
- Mocked boundaries and limitations: see "Data, Contract, And Mock Boundaries".

## Implementation Fidelity Boundary

**Must preserve:**

- the landing on Chat;
- the navigation placement and the New chat control;
- the New chat layout and copy;
- the Chat box as the product's existing box and Context Files area; on New chat, plus Chat's chip row and footer (control order, with send last); after the first message, the product box with `/`;
- after the first message, the chat run view is the product agent run view: workspace frame, run header with ⚙ ＋, run settings;
- the model menu structure and states, with no Recent;
- the last-used preselection;
- schema-driven thinking;
- the skill and agent/team menus;
- the lock behavior;
- the status vocabulary;
- reuse of the product workspace frame for the right side (`RightSideTabs`, `RightSidebarStrip`, resize handle, drawer, shared open/collapsed setting);
- tree placement and ordering;
- unchanged team and org run views.

**Prototype-only:**

- `usePrototypeChat` and the chat fixtures;
- the projection of chats into the tree;
- the Context Files mirror;
- simulated streaming, replies and voice;
- the stand-in team run;
- the locally stored last-used value.

**Allowed to vary:**

- names of agents, teams, skills, models, providers, workspaces and chats;
- descriptions and reply text;
- timestamps and model counts;
- which runtimes are installed;
- thinking parameter types, labels and values.

**Responsive variation:** where the New chat footer wraps, and whether the mic is present (it depends on the extension).

**Design-system constraints:** reuse these rather than rebuilding them:

- the product message box and `ContextFilePathInputArea`;
- `WorkspaceAdaptiveLayout`, `RightSidebarStrip` and `RightSideTabs`;
- the run header (`AgentStatusDisplay`, `WorkspaceHeaderActions`) and the existing-run settings editor (`AgentRunConfigForm`);
- the Workspaces tree and `ConfirmationModal`;
- toasts and status dots;
- Tailwind tokens and Heroicons.

## Out Of Scope

- Team-member and org-member run views (DEC-013).
- Save setup as agent.
- Agent Orgs from Chat.
- Configuring individual team members from Chat.
- A separate Chats list.
- A Recent model list.
- Showing which model produced each reply.
- Changes to the Agents, Teams and Orgs launch forms.
- A chat runtime that is not an agent.

## Open Decisions And Risks

- There are no open product decisions.
- RSK-001: cross-runtime search loads several catalogs.
- Known baseline gap: the Font Awesome file-type icons in the Context Files list render blank, because the product loads only the SVG core. The prototype mirror matches the product here; this is not a Chat change.

## Final Consistency Check

- User confirmation is recorded: `Yes` (R1 and R2)
- Prototype repository/root, source pin, and prototype revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes`. The missing-chat and hidden-thinking states are specified in text.
- Prototype, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality, with no unintended placeholders, clipping, overlap, or drift: `Yes`
- Every visible detail defines requirements unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Prototype-repository artifact and visual-reference paths agree with this specification: `Yes`
