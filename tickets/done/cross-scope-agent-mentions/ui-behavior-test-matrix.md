# UI Behavior Test Matrix — cross-scope-agent-mentions

Executable form: `prototype/scripts/validate-cross-scope-agent-mentions.mjs`.
Final run: production build at `http://127.0.0.1:3283`, 2026-09-30T17:08:39.519Z, 46/46 passed
(`review-evidence/final-validation/results.json`). Transition IDs refer to `ui-ux-spec.md`.

| Check ID | Behavior (journey / transition) | Result |
| --- | --- | --- |
| V-01 | `@` opens the menu above the run composer (AC-001) | Pass |
| V-02 | Menu lists shared Agents and Teams and no Agent Org (AC-001) | Pass |
| V-03 | Menu says who receives the message | Pass |
| V-04 | Only what is not in the run is offered: the run's own team and its members are left out | Pass |
| V-05 | No match shows the empty state and the Org note | Pass |
| V-06 | Enter with no match does not send | Pass |
| V-07 | Escape closes the menu and keeps the text | Pass |
| V-08 | Enter chooses the highlighted option and inserts `@Product Team ` | Pass |
| V-09 | Composer shows the mention chip and no extra explanatory text | Pass |
| V-10 | Removing the chip keeps the words and drops the mention | Pass |
| V-11 | Sent message shows the mention as an inline chip (AC-002) | Pass |
| V-12 | Composer is cleared after send | Pass |
| V-13 | The Team and its members appear under the run (AC-003) | Pass |
| V-14 | It uses the existing task Team presentation with no "Added" text | Pass |
| V-15 | Success shows no notice above the composer; the tree is the signal | Pass |
| V-16 | Team tab shows the later message from the collaborator, not the delegated brief (AC-004) | Pass |
| V-17 | Clicking the task row focuses the collaborator with its conversation and no load error | Pass |
| V-18 | The user can chat with the added collaborator directly (SC-003) | Pass |
| V-19 | Once brought in, the Team is no longer offered (SC-005) | Pass |
| V-20 | Typing its name now shows the empty state | Pass |
| V-21 | No duplicate row exists (AC-005) | Pass |
| V-22 | Failure to add is visible and says nothing was added (AC-006) | Pass |
| V-23 | Failure leaves the run tree unchanged (AC-006) | Pass |
| V-24 | Notices can be dismissed | Pass |
| V-27 | Menu stays inside a 1024x640 window | Pass |
| V-28 | New chat `@` is unchanged: launch-target picker without run-only entries | Pass |
| V-31 | Org run: `@` opens the same menu; the Org, its members and its teams are not offered | Pass |
| V-32 | Org run: the task Agent appears under the Org run with member-style marker and no "Started by" | Pass |
| V-33 | Org run: the Org tab shows the later message, not the delegated brief | Pass |
| V-34 | Org run: clicking the task Agent opens its conversation with the system task notice | Pass |
| V-35 | Org run: the user can chat with the task Agent directly | Pass |
| V-36 | Org run: a task Team and its members appear under the Org run | Pass |
| V-37 | Org run: a failure shows the notice and adds nothing | Pass |
| V-38 | Agent run: the first chat message gets a reply and the run is Idle | Pass |
| V-39 | Agent run: `@` opens the menu in the run view | Pass |
| V-40 | Agent run: the task Agent appears under the run row and a Team tab shows its message | Pass |
| V-41 | Agent run: clicking the task Agent opens its conversation, titled by its name | Pass |
| V-42 | Agent run: the user can chat with the task Agent directly | Pass |
| V-43 | Agent run: clicking the run row returns to the run's own conversation | Pass |
| V-44 | Agent run: a task Team and its members appear under the run row | Pass |
| V-45 | A stored standalone Agent run is listed in the Workspaces tree | Pass |
| V-46 | Stored Agent run: the task Agent appears under the run and the run settles at Idle | Pass |
| V-47 | Opening a Team run after a standalone Agent run works | Pass |
| V-48 | Returning to the Agent run keeps its conversation and task row | Pass |
| V-29 | No page errors | Pass |
| V-30 | No external requests | Pass |

## Scenario Catalog

| Scenario ID | Purpose | Setup | Mocked boundary | Expected outcome | Selection |
| --- | --- | --- | --- | --- | --- |
| PS-001 | Team run mention | Workspaces → prototype-workspace → Product Review Team → run → researcher | local run (`teamRunDriver`) | task Team / task Agent under the run | normal navigation |
| PS-002 | Org run mention | … → Product Launch Org → run → analyst | local run (`orgRunDriver`) | task rows under the Org run | normal navigation |
| PS-003 | Standalone Agent run mention | … → Research Assistant → run; or Chat → first message | local run (`agentRunDriver`) | task rows under the run row; Team tab | normal navigation |
| PS-004 | Failure to add | mention `Marketing Team` | scripted `unrunnableReason` | notice, no row | fixture |

## Unresolved Behavior

| ID | Missing or ambiguous behavior | Prototype limitation | Decision needed |
| --- | --- | --- | --- |
| F-001 | Identity and launch settings of a non-mounted collaborator | supplied locally | server contract |
| F-005 | Children of a standalone Agent run | held locally | run model |
| F-003 | Rendering of inter-agent deliveries in the receiving conversation | existing client rendering | verify against the product |
