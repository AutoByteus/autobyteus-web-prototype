# Prototype Ticket

## Identity And Scope

- Product ticket: `cross-scope-agent-mentions`
- Stable requirements package: `cross-scope-agent-mentions` (SR-001, requirements Draft, not approved)
- Title: `@` in a live run brings a shared Agent or Team into the current run
- Status: `Awaiting User Review`
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
- Accepted prototype base at creation: `df1377c4dde63c67fb5548f63e03c90c6b685d85`
- Current accepted prototype base: `5da5a9f` (`WEB-BASELINE-REFRESH-003`), merged into this branch at `b7bf8f6`
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Source pin: `origin/personal@e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71` (v1.4.92-beta.3; refreshed on the user's request — was `57df63f07`, the Solution Designer base for this package)
- Baseline status: `Accepted` — `prototype-bootstrap-report.md` (`WEB-BASELINE-REFRESH-002`). Surfaces used by this ticket and their accepted evidence: stored Team run, member focus and run composer (FLW-002, FLW-011, FLW-012, FLW-013); stored Agent Org run and member conversation (FLW-003, FLW-015); New chat `@` menu (CHT-012–016).

## Runtime

- Review port (ticket-owned): `3282`; dev server log and temporary state root: `/tmp/autobyteus-prototype-cross-scope-agent-mentions`
- Reset: reload the page (all state is browser-local)

## Baseline Observations At Intake (not part of this ticket's change)

- The README/runbook "promoted default" deep links `/workspace?root=team&team=…&phase=active` and `/workspace?root=org&org=…&phase=active` render `Error 500 — Cannot read properties of undefined (reading 'trim')` on base `df1377c`. The bootstrap report lists "historical review scripts and URLs" and the legacy rich-state injector as not refreshed. `validate:default-baseline-promotion` also fails at its first step (it looks for `[data-test^="team-card-"]`, which the refreshed source no longer renders).
- The accepted click-through journeys work and are used here: Agent Teams → Run → Run Team, and opening stored Team/Org runs from the Workspaces tree.
- A live Org launch (Agent Orgs → Run → Run Agent Org) ends on "No agent or team run selected"; it is outside the verified refresh scope. The stored Org run is used for the Org variant.

## Review Round 1

- Review URL (recommended route): http://127.0.0.1:3282/workspace#mentionRoute=relay — then Workspaces → `prototype-workspace` → `Product Review Team` → `Review the current prototype baseline`
- Comparison URL (Q1 option a, review-only): http://127.0.0.1:3282/workspace#mentionRoute=direct (kept for the browser session)
- Changes: PC-001–PC-012 (`prototype-change-log.md`)
- Scope built: the full journey on a standalone Team run (SC-001–SC-006).
- Not built in this round: the Org run variant (SC-007) and standalone Agent runs. The Org run uses a different execution context that reloads from the server when a child starts, and a live Org launch is outside the verified baseline; the same presentation is proposed there. Decision requested from the user.
- Proposed answers: Q1 option b (relay) as default; concept word "Added"; inherited settings shown in the collaborator header; failures shown as a notice above the composer.
- Fixture note: `Product Team`, `Marketing Team`, `Computer Use Agent` and `Code Reviewer` are illustrative definitions that exist only in the live-run `@` menu; agent prose is scripted.
- Browser validation: `prototype/scripts/validate-cross-scope-agent-mentions.mjs` 30/30, 0 page errors, 0 external requests (`review-evidence/round-1/results.json`)
- Static checks: typecheck exit 0, lint pass, test 12/12, `validate:boundaries` pass
- Non-normative review screenshots: `review-evidence/round-1/` (`relay-*`, `direct-*`; `journey.mjs` reproduces them)

## Review Round 1 Feedback

- User, 2026-09-30 (after trying `@Product Team` in the Team run): "The task team itself is shown inside the product review team itself, right? That's a really, really good one … That's actually the experience I'm expecting". This is positive feedback on the relay route and the added-Team tree presentation; it is not yet final approval of the package.
- User request: "can you also add, like in the UI, I can also add another independent agent, for example, computer use agent." → PC-012 added; evidence `review-evidence/round-1/agent-01`–`agent-04`.

## Review Round 2

- User feedback, 2026-09-30: "there's no need to show added this kind of text … The UI should remain as clean as possible … we delegate a task to computer use agents. And then it should be shown as a task agent … remove the added this kind of text, and remove this added by this kind of text as well."
- Decisions recorded: DEC-006 — no separate concept word; a mention-added collaborator is a delegated task Agent/Team. DEC-003 — use the existing task row presentation. F-002 is resolved: no distinct "added by mention" presentation is needed.
- Change: PC-013. Evidence: `review-evidence/round-2/` (validation 30/30, `agent-01`–`agent-04`).
- Open: the existing task row shows "Started by <member>" for every delegated child in the product today. Hiding it is a change to existing behavior; asked the user.
- Status: `Awaiting User Review`.

## Review Round 3

- User feedback, 2026-09-30 (screenshot of `@Computer Use Agent`): "I don't think we need to show this open agent, this blue area, because it's very clear, it's right on the left side"; "why do I have this started by researcher stuff and also have this text, couldn't load activity retry?"
- Changes: PC-014 (join notice removed), PC-015 ("Started by" line removed from task rows — an existing-product change, flagged to the user), PC-016 (row click defect fixed).
- F-001 extended: selecting a task Agent row also requires a configured placement (`teamMemberProjectionHydrationService` → `findConfiguredAgentByAddress`), so a non-mounted collaborator cannot be opened from the tree without a client/server change.
- Evidence: `review-evidence/round-3/` (validation 30/30, `agent-row-clicked.png`).
- Status: `Awaiting User Review`.

## Review Round 4

- User feedback, 2026-09-30: the green circle on the task row "is not in the middle. It's like a little bit up"; "can we use other icons to represent task agents?"; "the vertical line is still not straight" on the task row.
- Changes: PC-017 (alignment; measured branch x = 49px on every depth-0 row, marker center = name center), PC-018 (task Agent marker proposal with two review-only alternatives).
- Evidence: `review-evidence/round-4/` (`tree-avatar.png`, `tree-bolt.png`, `tree-ring.png`, validation 30/30).
- Status: `Awaiting User Review`.

## Baseline Refresh In Progress

- 2026-09-30: the user asked to update the baseline after `origin/personal` moved to `e9aa4a74c` (v1.4.92-beta.3, To-Do panel removed). Refresh ticket `WEB-BASELINE-REFRESH-003` (`prototype/web-baseline-refresh-003`) opened and sent to the Bootstrapper.
- This ticket stays at `79a39c1` with no further future-state edits until the refresh is accepted and integrated into `personal`; then merge `personal` here, revalidate (`validate-cross-scope-agent-mentions.mjs`), and resume the review.
- 2026-09-30: refresh accepted (`personal@5da5a9f`) and merged (`b7bf8f6`; two generated files regenerated). Revalidated: browser validation 30/30 (`review-evidence/round-5/results.json`), typecheck exit 0, lint exit 0, test 12/12, `validate:boundaries` 0 failures. Activity tab shows Background Tasks and no To-Do (`round-5/activity-tab-refreshed.png`). Review resumed; `Awaiting User Review`.

## Findings For Requirements (observed, not decided)

- F-001 (REQ-003/004): the client can only build a conversation for a delegated child whose address is a configured member (`createTeamAgentContext` → `configuredAgentAtAddress`), and the task-execution DTO carries no definition identity or launch settings. A collaborator that is not mounted needs both from the server. The prototype supplies them locally.
- F-002 (DEC-003): today a delegated child renders as a dashed "temporary task" row with "Started by <agent>". The proposal gives a mention-added collaborator a member-style row instead, because REQ-003 persists it with the run. The UI therefore needs to tell "added by mention" apart from an ordinary task child.
- F-003 (DEC-004): an inter-agent delivery is rendered in the recipient's conversation by the existing code as a user-style message with no sender shown. Unchanged here; it is visible when the collaborator's conversation is opened.
- F-004 (REQ-001): the Org run and standalone Agent run composers are separate paths from the Team run composer path used here.

## Status History

- 2026-09-30: opened from Solution Designer request; baseline applicable and accepted at the same source pin; `In Progress`.
- 2026-09-30: round 1 review URL ready; `Awaiting User Review`.
- 2026-09-30: round 2 (PC-012, PC-013) applied from user feedback; `Awaiting User Review`.
- 2026-09-30: round 3 (PC-014–PC-016) applied from user feedback; `Awaiting User Review`.
- 2026-09-30: round 4 (PC-017, PC-018) applied from user feedback; `Awaiting User Review`.

## Finalization

- Integration result: `Pending`
- Cleanup result: `Pending`
