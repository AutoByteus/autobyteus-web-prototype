# Prototype Ticket

## Identity And Scope

- Product ticket: `cross-scope-agent-mentions`
- Stable requirements package: `cross-scope-agent-mentions` (SR-001, requirements Draft, not approved)
- Title: `@` in a live run brings a shared Agent or Team into the current run
- Status: `In Progress`
- Mode: `Product Experience Prototyping`
- Requester: Solution Designer (`/software_engineering_team/solution_designer`), Product Design Requested (New Request), 2026-09-30
- User words: "send request to product prototyper, i need to work on the ui first. working with ui is easier for me to see them"
- Requirements context (read-only): `/Users/normy/autobyteus_org/autobyteus-worktrees/cross-scope-agent-mentions/tickets/in-progress/cross-scope-agent-mentions/` (`product-design-request-handoff.md`, `requirements-doc.md`, `investigation-notes.md`, `solution-revision-record.md`); user screenshot `/private/tmp/claude-501/-Users-normy-autobyteus-org-autobyteus-workspace-superrepo/a1b8d09c-a6f5-489a-98a3-a2a477297e3b/images/1.png`

## Decision Questions

- DEC-001 (REQ-001, SC-001, AC-001): the `@` menu in a live run composer, the mention chip in the composer, and the chip in the sent message.
- DEC-002 (REQ-002, Q1): how the user understands that the mention goes to the focused agent, which brings the collaborator in (option b); comparison with sending straight to the collaborator (option a).
- DEC-003 (REQ-003/004, SC-002/003/007, AC-003): how an added collaborator appears in the sidebar run tree under a standalone Team run and an Org run, distinct from configured members; status; focusing it to chat directly.
- DEC-004 (REQ-005, SC-004, AC-004): how messages between run members and the collaborator appear in the right-panel Team/Org tab.
- DEC-005 (REQ-006/007, SC-005/006, AC-005/006, Q3): already-in-run mention, failure to add, empty `@` results, and how inherited runtime/model/workspace is shown.
- DEC-006 (open): user-facing name for the concept ("added", "guest", "invited").
- Critical journey: live standalone Team run, focused on a member → type "…please talk to @Product Team to fix the UI first" → send → the focused agent brings Product Team in → Product Team appears under the run → the Team tab shows their messages → click the product prototyper and chat.
- Constraints / non-goals: no hidden global Org; Orgs are not `@`-mentionable; no linking to runs in other roots; collaborator confined to the current run; New chat `@` launch-target behavior preserved; no automatic handoff rules.

## Repository And Baseline

- Canonical prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype` (branch `personal`, remote `AutoByteus/autobyteus-web-prototype`)
- Product task worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/cross-scope-agent-mentions`
- Product ticket branch: `prototype/cross-scope-agent-mentions`
- Accepted prototype base: `df1377c4dde63c67fb5548f63e03c90c6b685d85` (`personal` = `origin/personal` at intake)
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Source pin: `origin/personal@57df63f079363ccab4f2301213f9d8a3458f72fa` — equal to the Solution Designer base for this package
- Baseline status: `Accepted` — `prototype-bootstrap-report.md` (`WEB-BASELINE-REFRESH-002`). Surfaces used by this ticket and their accepted evidence: stored Team run, member focus and run composer (FLW-002, FLW-011, FLW-012, FLW-013); stored Agent Org run and member conversation (FLW-003, FLW-015); New chat `@` menu (CHT-012–016).

## Runtime

- Review port (ticket-owned): `3282`; dev server log and temporary state root: `/tmp/autobyteus-prototype-cross-scope-agent-mentions`
- Reset: reload the page (all state is browser-local)

## Baseline Observations At Intake (not part of this ticket's change)

- The README/runbook "promoted default" deep links `/workspace?root=team&team=…&phase=active` and `/workspace?root=org&org=…&phase=active` render `Error 500 — Cannot read properties of undefined (reading 'trim')` on base `df1377c`. The bootstrap report lists "historical review scripts and URLs" and the legacy rich-state injector as not refreshed. `validate:default-baseline-promotion` also fails at its first step (it looks for `[data-test^="team-card-"]`, which the refreshed source no longer renders).
- The accepted click-through journeys work and are used here: Agent Teams → Run → Run Team, and opening stored Team/Org runs from the Workspaces tree.
- A live Org launch (Agent Orgs → Run → Run Agent Org) ends on "No agent or team run selected"; it is outside the verified refresh scope. The stored Org run is used for the Org variant.

## Status History

- 2026-09-30: opened from Solution Designer request; baseline applicable and accepted at the same source pin; `In Progress`.

## Finalization

- Integration result: `Pending`
- Cleanup result: `Pending`
