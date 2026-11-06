# Product Ticket: mobile-experience-redesign (Project Task autobyteus-277)

- Status: `Awaiting User Review`
- Mode: Product Experience Design (evolves the accepted `/mobile` baseline)
- Requested by: Solution Designer run `solution_designer_acd8b3385f2a491897565fc9f80b0a97`, at the user's request (2026-11-06)
- Request: `/Users/normy/autobyteus_org/autobyteus-worktrees/mobile-experience-redesign/tickets/in-progress/mobile-experience-redesign/product-design-request.md` (with `requirements-doc.md` Draft SR-001 and `investigation-notes.md` in the same folder)
- Design repository: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket branch / worktree: `design/mobile-experience-redesign` / `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/mobile-experience-redesign`
- Accepted design base: `a0e18abb49320c8f3c4ad5cfad830863ca6684df` (`origin/personal`, fetched 2026-11-06)
- Source pin (read only): `origin/personal@e00581d485` (`autobyteus-web/components/mobile/*`), worktree `/Users/normy/autobyteus_org/autobyteus-worktrees/mobile-experience-redesign`
- Baseline: accepted (`ui-baseline-report.md`, pin `d74f75a51a`). Checked against the source pin on 2026-11-06 for the phone shell: every `components/mobile/*` file, `pages/mobile.vue`, `stores/mobileWorkStore.ts` and `utils/mobileFeatureGates.ts` match, except two visible differences the source gained since the pin (autobyteus-358): the Team messages screen shows a loading state and an "unavailable" state (`MobileTeamMessages.vue`, `MobileActivityDigest.vue`). They are on a screen this design keeps unchanged inside Results → Activity, so no correction was requested; engineering keeps the source's behavior. Recorded as a known baseline gap, not a design change.
- Runtime: UI reference `corepack pnpm exec nuxt dev --host 0.0.0.0 --port 3277`; process owned by this ticket; review URL on the user's phone over Tailscale `http://100.127.30.107:3277/mobile`, on the Mac `http://127.0.0.1:3277/mobile`. Reset: remove the local-storage keys below and reload.

## Local-storage keys (starting state / memory of the UI reference)

- `autobyteus.prototype.mobileSeeded`: set on the first visit to `/mobile`; that visit installs an inert fixture session (a paired phone). "Unpair this phone" then shows the pairing screen. Remove the key (and `autobyteus.remote_access.mobile_session.v1`) to start paired again.
- `autobyteus.prototype.scenario`: `populated` (default), `mobile_runs_loading`, `mobile_runs_empty`, `mobile_runs_error`, `mobile_runs_node_offline` (the paired node is not reachable).

## The user's words so far

- 2026-11-06 (request): "currently the mobile experience is really bad. for example, i can not see the task agent or agent team, many problems, ui experience also not good enough."
- 2026-11-06 (first design review, on the current Home header, screenshot): "Do we really need this like we have two words. We also like remote access blah blah blah. Do we really need they take quite a lot of the header, in general, this way should make the UI much better, cleaner, redundant words should be removed."

- 2026-11-06 (DEC-004 direction, in the review conversation): "on the mobile version … there's no need to switch between like a different workspace or project or something like that. We only show the existing, like the runs view. … a lot of times, users will simply talk to the project task manager, I mean the super agent or whatsoever, and they delegate tasks, which means under the screen … that's the majority of views, not just on the mobile, but also on desktop as well. So on mobile view, I feel like we don't have to have this kind of different workspace, project views switch, what do you think?" The Product Designer agreed (answer given in the same conversation); awaiting his explicit confirmation of the full DEC-004 list.

## Decisions asked of the user

- DEC-003 (remote nodes on the phone): open. The design builds A.
- DEC-004 (what is not on mobile): open. The design builds the recommended cut.
- The "needs you" marker (OPT-001, optional): open.

## Result

Pending the user's confirmation.

## Review round 2 (2026-11-06)

- The user: the run screen's static strip (sibling chips) under the top bar takes space from the conversation and is rarely used; the event monitor should be as large as possible; selecting another agent and the other controls belong behind a dropdown or a ⋯ menu that opens on demand ("you don't want to make those static things which are always on screen because they are not used very often").
- Change: the strip is removed. The run screen is one slim bar (back, the agent's name as a dropdown that opens the run tree to switch agent, ⋯ menu with Results and "Back to <delegator>") and the conversation below it.

## Review round 3 (2026-11-06)

- The user: the ⌄ plus the ⋮ with only "Results" is two controls where one will do; "Results" is unclear (it is just the current agent's artifacts, files and activity); and Artifacts should not ask "select an active run" since the screen always belongs to the current agent.
- Change: one control, the ⋮ menu: Switch agent (opens the run tree), Back to <delegator>, then Artifacts, Files, Activity, each opening its own screen for the current agent (no tabs, no "Results"). The title is plain text. The "choose work / select an active run" states are removed from Artifacts and Activity.

## Review round 4 (2026-11-06)

- The user: the Artifacts screen wastes vertical space at the top (a tall static header that also names the agent, a tall artifact card); "vertical space is a treasure on the phone"; the agent's name under "Artifacts" is not needed.
- Change: the Artifacts, Files and Activity screens have one 48px bar (← and the title, no agent name). A single artifact shows no list (its name is in the viewer's bar); several artifacts are 44px one-line rows (icon, name, status).
- Known fixture limit: the sample artifact opens with the baseline's "Content not available yet" placeholder; its content is illustrative.

## Review round 5 (2026-11-06)

- The user: New run is "extremely hard to select new agents" (a tiny inline list, a lot of scrolling) for both agent and team; a phone wants a big overlay from the bottom or a fly-out; clean and easy to navigate.
- Change: New run is two rows plus one button. "Run" (agent or team, one list with sections Agents and Teams, preselected: the Project Task Manager) and "Folder" (preselected: the first folder) each open a bottom sheet (85% of the screen height, search when the list is long, 60px rows, the chosen one marked and scrolled into view). The Agent|Team toggle, the inline lists and the path form are gone from the first view; Runtime and model, Auto approve tools and "Folder path on the node" sit under "More options" (closed). "Create run" is anchored at the bottom.

## Review round 6 (2026-11-06)

- The user: New run's UI is weird and not clean: different row styles ("Run", "Folder", "More options", "Runtime and model", a system dropdown, grey help text); the selection boxes and their styling are not good on a phone. He also stated that New run only supports a simple agent run (no team).
- Change: New run is agents only. One list of five rows with one pattern (label left, value right, chevron; 56px; hairlines; no captions or help text): Agent, Folder, Runtime, Model, Auto approve tools (a switch). Every choice (agent, folder, runtime, model) opens the same bottom sheet (no system dropdown); the sheet is as tall as its list (at most 85% of the screen) and the open-by-path field lives in the Folder sheet's footer. No "More options", no "Runtime and model" heading, no "This model has no adjustable settings", no auto-approve help text.

## Review round 7 (2026-11-06)

- The user: the Activity screen is ugly and strange: it mixes "Messages" and "Activity" behind two chips. Message is message, activity is activity: make them separate items in the menu, under Files.
- Change: the ⋮ menu is Switch agent, Back to <delegator>, then Artifacts, Files, Messages, Activity. Messages and Activity are two screens with the same bar (← and the title), no chips or counters, no cards: a flat list of rows with hairlines. Messages (the team's messages: the sender or receiver, the time and the text) shows only for a member of a team or Org. The empty states are one line: "No messages yet", "No activity yet". The combined Activity screen is removed.
- Design-only simulation: the reference carries no team context or run stream, so the invented Messages (`sampleTeamMessages`) and Activity (`sampleToolActivities`) are supplied by `prototype/mobile-runs/mobileRunsFixture.ts`.

## Review round 8 (2026-11-06)

- The user saw a card ("CHAT / Opening conversation / The run is selected. Messages will appear here when hydration finishes." with "Choose work" and "Open Runs") in the middle of the Project Task Manager's run screen, and asked what its logic is.
- Finding: it was the old Chat tab's fallback for "the conversation is not attached yet"; its buttons pointed at screens that no longer exist. The run screen could reach it when a run kept its selection but lost its conversation (browser Back then Forward, a quick switch).
- Change: the fallback is a quiet one-line "Opening…" (no title, no buttons, no internal word); and an open run whose conversation is not attached is attached again on its own, so the state does not stay. Requirement for engineering: the run screen never shows a state with navigation buttons; while the conversation loads it shows "Opening…".

## Review round 9 (2026-11-06)

- The user: "Switch agent" and "Back to <delegator>" are not needed: ← already goes back, and the first screen (the run list) is already clear.
- Change: both items and the run-tree sheet are removed. The ⋮ menu is Artifacts, Files, Messages (team members only) and Activity. Moving to another agent or to the delegator is ← to the run list (which keeps its scroll position and marks the open run) and one tap on the row.
