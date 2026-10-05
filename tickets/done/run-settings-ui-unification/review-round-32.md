# Review Round 32 — choose who to chat with from the New chat heading

User question (2026-10-05): should New chat again offer a quick way to pick an Agent or Agent Team
(as the old `@` "Chat with…" did), so the user can start that run straight from chat? The user
agreed on two points:

- It must **not** go through `@`. `@` keeps one meaning everywhere: bring a collaborator into the
  run, with the current agent relaying the message.
- It should use some other selection UI.

## Change

- The New chat heading is a switcher: the name (plus the avatar when present) and a chevron.
- Clicking it opens a menu under the heading, in the same style as the other chat menus:
  - a search box ("Search agents and teams");
  - "Agents" (General Agent first, then shared agents);
  - "Agent teams";
  - a check on the current target.
- **Agent Orgs are never listed:** an Org has no recipient (SR-003).
- Choosing one switches New chat at once:
  - the heading changes;
  - the placeholder changes ("Message {team}…", "Ask {agent} anything…");
  - the members line appears for Teams;
  - workspace, approval and model+thinking are kept;
  - focus moves to the message box.
- The first message starts that Agent or Team, as with Run.
- It is available only on New chat (before the first message). A running chat keeps its target.
  While a run is starting, the switcher is disabled.
- `@` is unchanged: it lists Agents and Agent Teams except the current target, and brings them in as
  collaborators.

## Copy (en / zh-CN)

- `chat.switch.aria`: "Choose who to chat with (now {{name}})" / "选择对话对象（当前：{{name}}）"
- `chat.switch.search`: "Search agents and teams" / "搜索智能体和团队"
- Reused: "Agents", "Agent teams", "No agents or teams match".

## Keyboard and accessibility

- The trigger is a button with `aria-haspopup="listbox"` and `aria-expanded`.
- Search focuses on open and is a combobox with `aria-activedescendant`.
- ↑/↓ move, Enter chooses, Escape closes and returns focus to the heading; an outside click closes
  the menu.
- The highlight starts on the current target.

## Validation (http://127.0.0.1:4520)

- General Agent → heading menu:
  - it lists GA, RA, DW, CU, then Product Review Team, Product Team, Software Engineering Team and
    Marketing Team; no Orgs;
  - search "review" + Enter → Product Review Team (heading, placeholder, members line);
  - focus moves to the message box; the model is kept.
- Choosing Documentation Writer shows its avatar beside the name; the highlight starts on it the next
  time the menu opens.
- Escape closes and returns focus. `@` excludes the current target.
- 390 px (fresh frame): the menu stays inside the window (14–382 px); on desktop it is centered under
  the heading.
- Checks: `vue-tsc` 0 errors; tests 14/14; lint passes.

## Requirement impact

This is new behaviour on top of SR-003. "Choose the New chat target from the heading" is to be
routed to the Solution Designer with this package.
