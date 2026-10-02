# UI Brainstorm Record

Package `PROJ-TASK-MANAGER-20261002-001`, `SR-001`; Product ticket `project-task-manager-foundations`.

## Authority and provenance
This is clarification evidence, not an approved UI/UX specification or a second requirements document. No user decision has been received. Selected mode: Product Experience Prototyping; discussion only at this step.

Prototype root `/Users/normy/autobyteus_org/autobyteus-web-prototype`; active branch `prototype/project-task-manager-foundations` at worktree `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/project-task-manager-foundations`; accepted cumulative base `df2f5cdaf9b168298dcae79ac47c11f31dd82d7c`. Source handoff pin `e04cfef23550c3b78286a53befc6bd5d71fb1061`; existing prototype baseline pin differs (`e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71`). No rendered prototype/Projects baseline acceptance claimed.

Canonical draft intent and current-product context: `/Users/normy/autobyteus_org/autobyteus-worktrees/project-task-manager-foundations/tickets/in-progress/project-task-manager-foundations/product-design-handoff.md` and adjacent `requirements-doc.md`.

## Critical journey under discussion
Select a Project and explicit workspace context → give manager a goal → create durable Tasks → discover capable installed Agents/Teams → delegate independent A and B to distinct executions → show C waiting on A and B → inspect exact execution and returned evidence → manager assesses outputs before marking Done. All detailed policies remain open; task state is not runtime state, and specialist teams retain their own approval gates.

## Opening proposals — not approved
| ID | Proposal to discuss | Draft decision/requirement links | Tradeoff |
| --- | --- | --- | --- |
| BR-001 | Keep the full-width board. Explore a Project-local Manager tab beside Tasks and Workspaces, rather than a permanently squeezed split pane. Alternative: open manager in existing Workspace chat with explicit Project context. | DEC-007; REQ-007; SCN-002,005 | Project-local entry is easier to associate with work; existing chat reuses execution interaction and avoids another conversation surface. |
| BR-002 | Explore retaining To Do / In Progress / Done as business columns; add orthogonal explanations such as Ready, Waiting on task A, Needs attention or Awaiting review. A runtime error should not appear as accepted Done. | DEC-002,003,005,006; REQ-003,006,007; SCN-004,005 | Keeps board simple, but column and badge meaning must be unambiguous and user-approved. |
| BR-003 | Explore compact task cards with collaborator and current activity, while task detail carries prerequisites, distinct execution attempts, an Open execution link, returned result/artifacts and completion evidence. | DEC-004,005,006; REQ-005,007; SCN-003–005 | Preserves scanning without hiding exact run identity or retry history. Granularity/labels not finalized. |

Synthetic discussion example: A “Build import”, B “Write help”, C “Check combined flow” depends on A+B. These are invented domain values, not source/product data. Their concurrency is an illustration, not proof that shared-repository work is safe.

## First question presented
Should the manager conversation live in a Project Manager tab beside Tasks/Workspaces, or in the existing Workspace chat with explicit Project context? Project tab is a starting recommendation, not a settled behavior. Allow the user to propose another model.

## Review record
- Opening: Product proposes BR-001–003 and asks DEC-007 first, keeping other questions for subsequent discussion.
- User feedback/decisions: Pending.
- Explicit UI or requirements approval: None.
- Browser evidence: None; text discussion is sufficient for the first entry/context choice.

## User-requested inspection before discussion
- User: “Can you please first start the UI project so I can look at it? Then we will discuss.”
- Action: started the existing cumulative prototype from the isolated Product worktree, without implementing BR-001–003. User request is runtime inspection, not approval of a design alternative.
- Review URL: `http://127.0.0.1:3286/projects/project-prototype-launch`; index `http://127.0.0.1:3286/projects`.
- Verified via Chrome: Projects index → synthetic Project → full-width board with Tasks/Workspaces tabs and three populated columns. No browser console errors returned. Screenshot `review-evidence/current-project-board.jpg` (1512×806), non-normative and not evidence of new-feature behavior.
- Runtime: ticket-owned loopback port 3286, Nuxt PID 51024/session 75723, kept available. See prototype-ticket.md for start/reset/isolation details.
- Existing default `populated` scenario renders Projects with synthetic enabled state. Installed application remains untouched; no production feature enablement or calls.
- Baseline limitation: existing prototype source pin remains `e9aa4a7`; parity to the newer handoff pin not newly established. No Task Manager, dependencies or execution/result linkage added.
- Outcome: awaiting the user's inspection and discussion; all DEC decisions remain open.

## Unresolved and preserved boundaries
- All DEC-001–010 remain open. Do not infer approval from silence or from this record.
- ENABLE_PROJECTS stays default-off; user's installed setting/data untouched.
- Existing manual Tasks, workspace links, node-local records and run history preserved.
- Discovery and fresh delegation already exist; new Project tool/linkage/update capabilities are proposed, not implemented or tested here.
- No manual drag-to-change-status, global redesign, notification system, new scheduling dashboard or fixed management-Team composition added.
- If user asks for a rendered/runnable existing-product proposal, establish an applicable accepted baseline before future-state UI work. Discussion evidence alone is not a parity baseline.

## Next stage
Continue direct brainstorming with the user. Record exact decisions against DEC/REQ/SCN IDs; send clarified evidence and remaining unknowns to Solution Designer for canonical refinement and explicit approval when this stage closes. Do not label this work Prototype Completed.
