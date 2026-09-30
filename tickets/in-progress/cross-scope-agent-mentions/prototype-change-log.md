# Prototype Change Log — cross-scope-agent-mentions

Base: `personal@df1377c` (source pin `origin/personal@57df63f`). All changes are proposals until the user approves them.

| ID | Round | Change | Surface | IDs |
| --- | --- | --- | --- | --- |
| PC-001 | 1 | `@` in a Team run composer opens a "Bring into this run" menu above the box: shared Agents, then shared Teams; no Agent Orgs. What can still be brought in is listed first; definitions already reachable are tagged "In this run". Footer says who receives the message. | `RunMentionMenu.vue`, `useRunMentionMenu.ts`, `AgentUserInputTextArea.vue` | DEC-001, REQ-001, AC-001 |
| PC-002 | 1 | Choosing an option writes `@Name ` into the text and adds a removable chip row with a one-line routing hint. Removing the chip keeps the words and drops the mention; deleting the `@Name` text removes the chip. | `RunMentionChips.vue`, `AgentUserInputForm.vue` | DEC-001, DEC-002, REQ-002 |
| PC-003 | 1 | The sent user message shows each mention as an inline chip. | `UserMessage.vue` | DEC-001, REQ-002, AC-002 |
| PC-004 | 1 | Recommended route (Q1 option b): the focused agent receives the message, calls `delegate_task`, and the collaborator joins the run. A join notice above the composer offers "Open <entry agent>". | `RunMentionNotices.vue`, `TeamWorkspaceSurface.vue`, local run | DEC-002, SC-001, SC-002 |
| PC-005 | 1 | Added collaborator in the run tree: solid member-style row under the run (not the dashed temporary-task style), Team icon or Agent initials, status dot, an "Added" badge and "Added by <member>" on the added row; an added Team opens once to show its members. | `WorkspaceTransientExecutionRow.vue` | DEC-003, DEC-006, REQ-003, AC-003 |
| PC-006 | 1 | Focusing an added collaborator: header "Added" badge and a settings line "Added to this run · uses this run's settings: <runtime> · <model> · <workspace>"; the composer works as for any member. | `TeamWorkspaceSurface.vue` | DEC-003, DEC-005, REQ-004, SC-003 |
| PC-007 | 1 | Team tab shows the brief and the report exchanged between the run member and the collaborator through the existing message list (no layout change). | existing `CollaborationMessagesPanel.vue` | DEC-004, REQ-005, AC-004 |
| PC-008 | 1 | Re-mention of something already in the run: gray chip "· In this run", hint "No second copy is started", the agent messages the existing member, no new row. | composer, local run | DEC-005, REQ-006, AC-005 |
| PC-009 | 1 | Failure to add: failed `delegate_task`, agent explanation, and a red notice "Couldn't add <name> to this run … Nothing was added."; the tree is unchanged. | `RunMentionNotices.vue`, local run | DEC-005, REQ-007, AC-006 |
| PC-010 | 1 | Empty `@` result: "No agents or teams match" plus "Agent Orgs can't be mentioned."; Enter does not send a half-typed mention. | `RunMentionMenu.vue` | DEC-005, REQ-001 |
| PC-011 | 1 | Review-only comparison (Q1 option a), selected with `#mentionRoute=direct`: the message goes straight to the collaborator, the view follows it there, the row says "Added by you", and the original agent and the Team tab see nothing. | local run, hint/footer copy | DEC-002 |

Prototype-only support (not product behavior): `prototype/run-mentions/*` (browser-local state, illustrative definitions, scripted run), `plugins/20.prototype-run-mentions.client.ts`, the send hook in `plugins/00.prototype-state.client.ts`, the added-collaborator source hook in `teamExecutionContextFactory.ts` / `teamRunContextHydrationService.ts`, the resumed-run flag in `utils/apolloClient.ts`, and one icon in `prototype/fixtures/icon-collections.json`.
