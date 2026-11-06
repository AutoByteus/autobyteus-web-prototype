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
