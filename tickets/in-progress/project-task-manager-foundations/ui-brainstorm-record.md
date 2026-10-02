# UI Brainstorm Record

Package `PROJ-TASK-MANAGER-20261002-001`, `SR-001`; Product ticket `project-task-manager-foundations`.

## Authority and provenance
This is clarification/review evidence, not an approved UI/UX specification or a second requirements document. User direction UF-001–004 is recorded below; no final UI/UX approval has been received. Selected mode: Product Experience Prototyping. Opening sections are historical; the current runnable candidate and evidence are in `review-round-1.md`.

Prototype root `/Users/normy/autobyteus_org/autobyteus-web-prototype`; active branch `prototype/project-task-manager-foundations` at worktree `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/project-task-manager-foundations`; accepted cumulative base `df2f5cdaf9b168298dcae79ac47c11f31dd82d7c`. Source handoff pin `e04cfef23550c3b78286a53befc6bd5d71fb1061`; existing accepted prototype baseline pin differs (`e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71`). Existing acceptance is retained; no new parity claim to the handoff pin is made.

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

## Overlay feedback — UF-001, 2026-10-02
- User feedback: “One question is it possible not to use overlay? You know, is it possible? Then do not use overlay? What are better like? Because overlay always give people, for example, overlay if people in the future use the phone, I'm just wondering if in the future we support phone. Overlay is really extremely bad for phone experience, you know. Are there other options for better UI?”
- Supplied evidence: `review-evidence/user-edit-project-overlay.png` and `review-evidence/user-new-project-overlay.png`; screenshots of the existing Edit project and New project modal dialogs with dimmed background. These are user-supplied review evidence, not prototype fixtures or normative future references.
- Confirmed direction: avoid overlay/modal treatment for the primary Projects forms shown. Explore non-overlay task/detail/manager flows consistently. Do not infer authorization to remove every dialog or navigation overlay throughout the application.
- Motivation: accommodate a potential future phone experience; user has not approved phone delivery scope or a final responsive design.
- BR-004 proposal (not approved): dedicated New project and Edit project content pages with an explicit back path, a readable desktop form width inside the preserved product shell, and a single-column full-page form on narrow screens. Save/Create leads to Project detail; Cancel returns to the originating screen and preserves useful navigation state. Exact routing, unsaved-change handling, focus, layout and mobile actions await reviewed design.
- BR-005 alternative: inline edit for small values on Project detail. Keeps context but becomes cluttered for longer descriptions or growing task details. A non-modal side panel is another desktop option, but it still narrows the board and needs a full-page phone fallback; not the recommended default.
- Suggested consistency: primary task detail as a page, Manager as a tab/page, no floating drawer substitution. This remains a recommendation, not approval of BR-001, BR-004 or BR-005.
- Requirement impact: REQ-007 (user-approved experience), REQ-009 (preserved manual authoring intentionally changes presentation); SCN-002,005,006; DEC-006,007 and their UI supplement. Avoid-overlays is new user feedback on preserved current CRUD, not a silent baseline correction. Deletion/active-work policies remain DEC-009 open; removing overlays must not remove confirmation safeguards.
- No UI source changed. Existing prototype continues running on 3286. No parity claim at the newer source pin; applicable baseline acceptance still required before rendered future-state work.
- Outcome for this feedback round: `Requirement Impact`, to Solution Designer for canonical draft refinement. Product brainstorm remains open; no final requirements or UI/UX approval received.

## Unresolved and preserved boundaries
- All DEC-001–010 remain open; UF-001 adds an explicit non-overlay direction for primary Projects forms, not a final design choice. Do not infer approval from silence or from this record.
- ENABLE_PROJECTS stays default-off; user's installed setting/data untouched.
- Existing manual Tasks, workspace links, node-local records and run history preserved.
- Discovery and fresh delegation already exist; new Project tool/linkage/update capabilities are proposed, not implemented or tested here.
- No manual drag-to-change-status, global redesign, notification system, new scheduling dashboard or fixed management-Team composition added.
- If user asks for a rendered/runnable existing-product proposal, establish an applicable accepted baseline before future-state UI work. Discussion evidence alone is not a parity baseline.

## Next stage
Continue direct brainstorming with the user. Record exact decisions against DEC/REQ/SCN IDs; send clarified evidence and remaining unknowns to Solution Designer for canonical refinement and explicit approval when this stage closes. Do not label this work Prototype Completed.

## Subsequent feedback and handoff timing
- UF-002: user asks to update the UI so they can inspect the suggested design. This authorizes a prototype review candidate, not production implementation or final UI approval.
- UF-003: user wants optional workspace additions, each with its own description, in the same New Project flow. Creating a Project without workspaces must remain possible; adding them later remains possible. Exact selection/registration UI is still under Product design.
- Received canonical SR-002 handoff at `/Users/normy/autobyteus_org/autobyteus-worktrees/project-task-manager-foundations/tickets/in-progress/project-task-manager-foundations/product-design-handoff-sr-002.md`: UF-001 incorporated, requirements still Draft, AC-013 added. No phone delivery/global modal removal/active-work policy implied.
- UF-004 exact user direction: “Wait, I think, hey, I want to tell you that we should focus on the product design first, okay? Only after product design is done, then you can send to solution designer. Not now, only after we finish, okay? If you look at your skill, you know?”
- Required review gate: keep Product design, runnable preview iterations and user feedback in Product ownership. Do not send further interim findings/requirements-impact messages to Solution Designer. Accumulate them here and hand off only after the user finishes the Product-design stage. Prior UF-001 delivery occurred before this gate; do not repeat it or infer permission for more early deliveries.
- Pending review slice: non-overlay New/Edit Project pages; optional workspace links/descriptions during creation. Broader Task Manager decisions remain open.

## Baseline scope and candidate preparation
- User feedback: “the UI from baseline is looking exactly like my real product”; preserve existing navigation, appearance, interactions and visible states with fake data. User allows internal refactoring but does not request a redesign or source refresh.
- Current authoring baseline remains accepted cumulative df2f5cd at source e9aa4a7. Established acceptance and paired Projects matrix evidence reviewed; e04cfef remains a separately recorded Solution investigation pin, not a new parity claim.
- DATA-001 concern reclassified after independent provenance audit: repeated synthetic UI state, not a proven production-data/API-response archive. No correction candidate made; broad cleanup held. Copied audit at `review-evidence/DATA-001-assessment.md` explains limitation. No new capture machinery is used for this future-state candidate.
- PC-001 candidate: New Project and Edit Project become normal content pages within the preserved shell. Cancel/Back return to origin; name validation stays inline; scripted save reflects local changes and gives feedback. Awaiting actual user review, not approved UI.
- PC-002 candidate: optional Workspaces section inside the same form; add/remove multiple draft entries, existing-workspace/native selector or new-folder path, individual optional descriptions. Create accepts zero entries. Edit also includes links so adding/editing later can use the same page without a secondary overlay.
- PC-003 candidate: normal Project detail/board remains the destination; a creation with workspace links opens Workspaces to show results, otherwise Tasks. Existing Task/deletion dialogs and global shell are not redesigned. No manager/task dependency model built.
- Prototype-native domain fixture module is kilobytes and hand-written; mock edits last only within the current browser page session. New folders are not created or registered on disk, and writes never reach the installed application.

## Runnable review round 1 — 2026-10-02
- PC-001–003 are implemented in the active Product branch and reviewed in Chrome: full-page New/Edit Project, optional workspace rows/descriptions, zero-workspace creation, and later editing through the same page. Original board and shell remain the context.
- Normal New/Edit entry links use the candidate, not a hidden preview flag. Existing Task dialogs, deletion confirmation and global navigation behavior are outside this change.
- Validation and non-normative screenshots: `review-round-1.md`; `review-evidence/round-1-browser-checks.json` records 23 passed checks. Desktop and narrow browser viewports inspected, not actual phone support certified.
- Current state: `Awaiting User Review`; URL `http://127.0.0.1:3286/projects/new`. No Product completion or final spec; no further Solution Designer messages. Next action is the user's inspection/feedback, then focused Product iteration.

## UF-005 — temporary success feedback, 2026-10-02
- User: “after i created the project, the green should dispappear forexample in 3 secons or something right? from the user experinece persepective”. Evidence: `review-evidence/user-success-notice-feedback.png`.
- Product response/refinement PC-004: a brief, non-actionable creation confirmation clears automatically after 3000ms; apply the same behavior to Changes saved. Keep the existing inline/non-overlay status treatment and do not steal focus. Errors or action-required feedback are not auto-dismissed.
- Implemented in the prototype only. The timer begins when a ready Project displays the success notice, clears the notice query marker without losing other query state, and is cleaned up on navigation. No action/Undo is hidden by this message.
- Seven focused browser checks passed: immediate creation/save feedback, expiry measured ~2.96s/3.01s, saved workspace content/selected tab retained, no resurfacing after tab changes, no console errors. Non-normative before/after screenshots and details are linked from `review-round-1.md`.
- This feedback does not approve the whole Product design. Continue review directly with the user; UF-004 handoff gate remains in force.

## UF-006 — Task flows without popups, 2026-10-02
- User: “possible to make tasks also not popup? think about how to improve the UI”. Screenshot: `review-evidence/user-task-popup-feedback.png`, New Task multiline description over a dimmed board.
- Recommendation/candidate PC-005: full-page New Task and Edit Task in the preserved shell, consistent with Project authoring. Keep one required description, first-line summary, inline validation and Ctrl/Meta+Enter. No separate title, priority, assignee or due-date fields invented.
- PC-006: card links open a full-page Task detail with Project context, readable multiline description, read-only status and Task ID/timestamps. Back to tasks retains search. Space is available for later dependencies/executions/results, but no speculative widgets or unapproved orchestration behavior are added now.
- PC-007: preserve explicit destructive confirmation as an inline warning panel on Task detail, with Cancel focus first. No task popup, dimmed backdrop or drawer, and no active-work cancellation policy is inferred. Project deletion confirmation/global shell overlays are outside this feedback.
- Relevant draft context REQ-007/009, SCN-002/005/006, DEC-006; AC-013 still covers primary Project forms only. Task presentation is new review evidence for later canonical refinement, not a silent amendment to the requirements.
- Implemented/validated Product candidate: `review-round-3.md` and TP-001–020 evidence. User has not approved the concrete design or finished the broader stage. UF-004 remains: no Solution Designer handoff yet.

## UF-007 — learn from agent input, 2026-10-02
- User: “i would like to ask you to learn from the agent input form, there we have one audio input, and also attachment in the task we should also support that thanks”.
- PC-008: agent-style Task composer with speech-to-editable-text mic, Context Files plus/list/removal/clear controls, recording/transcribing/recovery states. This interprets audio input consistently with the referenced agent input, not as automatic raw-audio storage.
- PC-009: saved context on Task Detail with inline image preview; Edit/Cancel preserve saved context; compact attachment count on cards. All primary Task flows remain pages.
- Reference learning, implementation, mocked boundaries and validation: `review-round-4.md`. Source upload/voice services are not reused; only the pure transcript-merge helper. Voice is scripted and files browser-local/session-only.
- Voice permission/privacy/availability, file storage/limits/agent access, attachment-only authoring and raw recorded audio remain open for explicit Product decisions and later canonical refinement. No new architecture or production capability is claimed.
- Awaiting user review, not approval. UF-004 gate remains; no interim Solution Designer handoff.

## UF-008–014 — simplify, 2026-10-02
- UF-008: “damn. the task detail page looks terrible. also after task created, i think it should jump back to the all the tasks page”. Evidence: user-task-detail-feedback.png and user-task-board-return-feedback.png. Create now returns to this Project’s full Tasks board, clears old search and shows a 3-second confirmation. Description appears once, not as a repeated giant heading.
- UF-009/010: user rejects the Task list and Project form’s visual quality; evidence user-task-list-design-feedback.png and user-project-form-design-feedback.png.
- UF-011 exact direction: “remove the list view, we only have board. dont make it complicated”; “i want to have clean and simple ui”; “basically 3 columsn. just like earlier. the earlier simplicity is already good”. Alternate List/Board and added status-filter controls were rejected; removed completely, not retained behind a flag. Evidence user-board-only-feedback.png.
- UF-012: user explains separate floating cards and vertical gaps become visually busy with many Tasks; each status should feel like one column with Tasks inside. Three continuous column containers with contiguous rows and subtle dividers replace individual bordered/shadowed cards. Evidence user-continuous-column-feedback.png.
- UF-013: user says Workspaces are over-engineered, including counts, and the design should continuously simplify. Keep direct optional workspace selection and description with Add/Remove only; no count, nested cards, compact-summary Edit/Done or source-mode switch. Folder-path choice is in the same native selector.
- UF-014: user says Delete hidden inside Task information is undiscoverable; remove the whole information section, Task ID and created/updated dates, and place Delete beside Edit. Implemented with Edit then Delete at top right; explicit inline destructive confirmation remains. Evidence user-task-actions-feedback.png.
- Current candidates PC-010–013 and exact validation are in review-round-5.md. Earlier alternatives/screenshots remain historical, not current UI or normative references. No final Product approval, canonical requirements amendment or engineering authorization. UF-004 continues to prohibit an interim Solution Designer handoff.
