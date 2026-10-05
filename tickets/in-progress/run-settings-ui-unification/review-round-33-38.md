# Review Rounds 33–38 — SR-003 follow-ups and final confirmation

All rounds were user-driven on 2026-10-05 and reviewed live at http://127.0.0.1:4520. Final
confirmation: "Anyway, I'm satisfied … I'm currently satisfied with the UI now … Let's finalize now
… the ticket is done."

## Round 33 — Org launch page outside the tool shell

- User: the Org page should look like the chat page; the right-side tool tabs, and the member
  drawer overlaying them, looked strange.
- The Org launch page renders outside the workspace tool shell (`pages/workspace.vue`), like New
  chat. Runs keep the workspace layout.

## Round 34 — the heading switcher also lists Agent Orgs

- User proposal: in the chat page, also select an Agent Org; choosing one changes to the Org form.
- The switcher (search "Search agents, teams and orgs") has three sections: "Agents", "Agent teams",
  "Agent orgs". Orgs are shown with the `building-office-2` icon.
- Choosing an Org opens the Org launch page. Workspace, model+thinking and approval carry across.
- The Org page heading is the same switcher. Choosing an Agent or Team there opens New chat with the
  same settings carried.
- Agent Orgs → Run and "+" always start a fresh Org draft.
- `@` is unchanged: Agents and Agent Teams only, never Orgs.
- Requirement impact: SR-003 REQ-005/007 (Orgs are reachable from the New chat heading; they are
  still never chatted with).

## Round 35 — right tools behind one small icon on start surfaces

- User (server in Docker): to add a workspace they must copy a folder path from the Terminal, but
  New chat had no right tools.
- New chat and the Org launch page show one small panel icon (top right, the panel's own
  `panel-right` icon, 18 px `gray-400`, tooltip/aria "Show tools").
  - Closed by default.
  - Click: the right tools open docked beside the page when there is room, otherwise as the drawer.
  - Close (the panel's own icon or the drawer) brings the icon back; there is no icon strip.
  - The choice is remembered (`localStorage['autobyteus.chat.startToolsOpen']`), it holds across
    Agent/Team/Org switches, and a run started from there keeps the panel open.
  - Files and Terminal use the workspace chosen on the page (not the last selected run's).
- Run views are unchanged.

## Rounds 36–38 — the Org launch action

- User: the lone "Run Agent Org" button on its own card footer, with an empty left side, looked
  odd.
- Round 36 (interim): the action moved under the card beside the members line.
- Round 37 (user decision): the label is "Run" (zh-CN "运行"), as on the Agent/Team/Org cards and "a
  run" in the app; "Launch" is only used in the Applications area. The heading already names the Org.
- Round 38 (final): Run sits inside the card in the lower-right corner as a round blue play-icon
  button, like Send in the chat box (32 px, `blue-600`, `heroicons:play-solid`; tooltip/aria "Run",
  or the blocking reason; a spinner while starting). It is pinned to the corner so the rows above
  keep the full width (no truncation at 390 px). The members line is centered under the card, as on
  New chat; status and errors show centered between the card and the line.
- Requirement impact: SR-003 named the button "Run Agent Org".

## UI reference fixes in the same period (no design change)

User: "even though we use mock data, we should make it at least UI work … the navigation should
work"; "you should have correct UI UX". Every launch path was self-tested in the browser.

- Any Team launched from New chat opens its own run, with its coordinator; each launch is its own
  run (a second launch no longer fails with "TeamRun … is already registered"). The first and
  follow-up messages show, members are Idle, the run is dated "now", and new members have empty
  conversations.
- Run on the Org page opens the launched Org run (pre-existing gap F-004 resolved): live, every
  member idle, listed under its workspace as "New - {Org}". Choosing a Team focuses its
  coordinator. Its settings show "Running". Stop from settings works and keeps the settings open.
  "+" on that run prefills the launch page, including team-local member overrides.
- An Org whose default model has thinking settings (Product Launch Org) failed to load its run;
  fixed.
- Resetting one member on the Org page threw an error (null settings); fixed.
- The switcher's empty search reads "Nothing matches" (the `@` menu keeps "No agents or teams
  match").
- The mock agent "General Agent" is now "Daily Assistant" (fixture data, at the user's request).

## Validation

- Browser (http://127.0.0.1:4520): launch Product Launch Org and AutoByteus Org; open members; stop
  from settings; customize, reset one member, relaunch; "+" prefill; run from the switcher; Team
  launch with first and follow-up messages; a second Team launch; Daily Assistant chat; saved Org
  run; tools icon at 916 px (drawer) and 1500 px (docked); Org page at 390 px.
- `corepack pnpm test` 14/14; `corepack pnpm lint` clean; `vue-tsc` (with a larger Node stack): no
  errors in the files this ticket changed. The remaining errors are pre-existing product files.
- Visual references recaptured: VIS-001/002/003/005/010/012–016; added VIS-017 (tools open),
  VIS-018 (where Run lands), VIS-019 (Team first message).
