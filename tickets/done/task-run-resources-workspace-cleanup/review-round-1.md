# Review Round 1 — task-run-resources-workspace-cleanup

> **Superseded (2026-10-06).** The user rejected the floating "Design review · simulation" panel and its A/B switches as not real UI/UX. Both were removed in round 2. DONE now comes from the Project Task Manager's own chat, and the cleaner delegated rows are the approved design. See `ui-ux-spec.md` and `product-ticket.md`. This file is kept as history only.

Review URL: <http://127.0.0.1:4530/workspace?prototypeReview=task-run-cleanup>
(ticket worktree, `corepack pnpm dev --port 4530`)

Nothing here is approved. It is a proposal for the user to decide DEC-001..006.

## Proposal

The rule: **a Task's runs are listed under the Manager while the Task is open. When the Task
becomes DONE, they leave the tree.** Nothing else changes. No new control, badge, toast, or
"archived" section is added.

| Decision | Proposal (default in the UI reference) | Alternative you can switch to |
| --- | --- | --- |
| DEC-001 How rows leave | **Fade out.** The Task's rows fade and their height closes in 200 ms (ease-out). The rows below move up and the branch lines redraw. There is no toast; the Manager's own conversation already says it marked the Task DONE. With reduced motion, the rows go at once. | **Instant**: the rows are gone in the same frame. |
| DEC-001 (cont.) Which rows | **Every run the Task started:** the assigned Agent, the runs that worker delegated to (for example *fact checker*), helpers it brought in, and a Team with all its members. | — |
| DEC-005 Worker conversation open at DONE | **Back to the Manager.** The main view shows the Manager's conversation and the Manager's run row is selected. This matches what the product already does when a selected child leaves the run. | **Stay, read-only.** The worker's conversation stays open, its status changes to Offline, the message box goes away, and a quiet notice appears: "This Task is done. Its runs have stopped and are no longer listed." with **Back to Project Task Manager**. Once you leave it, you cannot open it again from the tree. |
| DEC-003 Manager's Team tab | **Keep every message**, including messages with runs that are no longer listed. The messages show the sender or receiver name. They do not link into the runs, so they can't lead to a missing run. | — |
| DEC-004 Access to finished work | **None in the app**, as the requirements say (the data stays on disk). The tree has no "show finished" toggle. | Would be a new requirement (archive/browse view). Not built. |
| DEC-006 / REQ-005 Root kinds | The same rule and the same leave motion for Task rows under Agent, Agent Team and Agent Org roots. All three already draw Task rows with the same dashed row (`WorkspaceTransientExecutionRow`). Only the Agent root is built here; Team and Org follow the same spec. | — |

Unchanged: rows still appear at once when a Task run starts. `@` collaborators (*documentation
writer*) and delegations without a Task (*researcher*) are never removed. Other Tasks' rows and
the Manager row stay as they are. Rows of runs stopped without DONE (root Stop, idle, error) also
stay.

## Where To Look

1. Open the review URL. In the left tree, open **prototype-workspace → Project Task Manager →
   "Plan the v2 docs release…"**.
   - Under the Manager: *documentation writer* (`@`), *release notes writer* and *fact checker*
     (Task "Draft release notes"), *researcher* (no Task), and *docs review team* with
     *reviewer* and *editor* (Task "Review docs site").
2. In the **Design review · simulation** panel (bottom right; it stands in for the Manager's
   `update_project_task` call and is not product UI), click **Mark DONE** on *Draft release
   notes*.
   - *release notes writer* and *fact checker* fade out.
   - The Manager's conversation adds "I marked Draft release notes as DONE."
3. **Reload the page.** The closed rows stay hidden (REQ-004).
4. Click *reviewer*, then **Mark DONE** on *Review docs site*. You return to the Manager
   (DEC-005 proposal).
5. Click **Reopen** on a Task. This reopens the Task and delegates it again: new runs appear,
   and the old closed runs stay hidden (REQ-006).
6. Switch the two options in the panel to compare the alternatives (Instant; Stay, read-only).
7. Open the **Team** tab on the right. The messages with the closed runs are still there
   (DEC-003).
8. **Reset** (in the panel) restores the start state.

## Evidence

The files in `review-evidence/round-1/` are disposable review aids, not normative:

- R1-00: the baseline tree.
- R1-01: the Manager with its Task rows.
- R1-02: after Draft release notes is DONE.
- R1-03: an open worker conversation returns to the Manager.
- R1-04: the alternative, stay read-only.
- R1-05: the Team tab keeps its messages.

## Validated In Browser (1055×738 desktop tab)

- DONE removes exactly that Task's rows. Mid-transition the leaving rows are at opacity ≈ 0.56.
  After the transition they are gone, and the other rows and branch lines are correct.
- The Instant option removes the rows in the same frame.
- After a reload the closed rows stay hidden, and the open Task's rows are still shown.
- The open *reviewer* conversation returns to the Manager at DONE, and the Manager's run row is
  selected.
- Stay read-only: the status is Offline, the notice appears, the message box is removed, and
  **Back** selects the Manager.
- Reopen: the new runs `run-ptm-review-2-*` are listed, and the round-1 runs stay hidden.
- Team tab: all 3 messages are listed, with no error.
- Research Assistant's `@` rows are unchanged.
- Checks: `pnpm typecheck` passes, `vue-tsc` reports no errors in the changed files,
  `pnpm test` passes 14/14, and `pnpm lint` passes.

## Limits Of The UI Reference

- The Manager run is a stored run that shows "Offline". The worker statuses are illustrative
  (running/idle). In the product, the Manager would be running when it marks DONE.
- DONE is triggered from the review panel, not from a real tool call or the Projects page. The
  Projects page's Task list is not linked to this fixture.
- Agent root only. Team and Org roots are specified by the same rule, not separately built.
  Their tree containers (`WorkspaceTeamExecutionTree`, `WorkspaceAgentOrgHistoryCollection`)
  would get the same leave transition.
