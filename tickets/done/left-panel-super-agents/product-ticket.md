# Product Ticket — left-panel-super-agents

## Identity And Scope

- Ticket / request ID: `left-panel-super-agents` (Project Task `autobyteus-378`, Project `project_a1377344-25db-482a-97cc-ecfdb0fb495a`). No second ID.
- Title: A simpler left panel built around one general super agent.
- Mode: **Product Experience Design** (it replaces the run section of the left panel and the Chat entry's neighbours; all exist in the baseline).
- Status: **Completed** (finalization in progress until the integration record below says `Completed`)
- Date: 2026-11-03
- Requester: Solution Designer (`solution_designer_7591e3d191704d25a3396b3020a41127`), at the user's request.
- Request / evidence: `/Users/normy/autobyteus_org/autobyteus-worktrees/left-panel-super-agents/tickets/in-progress/left-panel-super-agents/` (`product-design-request.md`, `investigation-notes.md`, `requirements-doc.md`).
- Decision questions: what the left panel shows; keep, hide or remove Workspaces and Projects; older runs; Teams and Orgs; long and parallel conversations; where Stop, Archive, Delete, strip entry and highlight go.

## Design & Repository Context

- Design repository: `/Users/normy/autobyteus_org/autobyteus-web-design` (remote `https://github.com/AutoByteus/autobyteus-web-prototype.git`, default branch `personal`).
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/left-panel-super-agents`; branch `design/left-panel-super-agents`.
- Accepted base: fetched `origin/personal@88e0e322b6b638f29d3a666e72d64a849301a08a`.
- Source (read only): `/Users/normy/autobyteus_org/autobyteus-worktrees/left-panel-super-agents/autobyteus-web`, base `fe351591f2` (v1.5.11); baseline pin `d74f75a51a`.
- Baseline check (2026-11-03): the left panel of the baseline renders like the user's three screenshots of v1.5.11 (tabs, rows, delegated rows, chips); the source refactored the history components (`RunSectionSwitch`, `RunDefinitionGroups`, `ProjectHistorySection`) without a visible difference, and this ticket replaces that surface, so no refresh was requested.
- Runtime isolation: dev server `corepack pnpm dev --port 4970` (log `/tmp/left-panel-super-agents-dev.log`, pid file `/tmp/left-panel-super-agents-dev.pid`); fixture state is in memory and the browser's local storage.
- Mock data: invented (`prototype/conversations-list/conversationsFixture.ts`); no real conversation titles.

## Status Log

- 2026-11-03 In Progress: worktree created, baseline checked.
- 2026-11-03 Direction, from the user while designing: Workspaces, Projects, the tabs and a list of conversations are not needed; there is one super agent, delegated work is created under it and leaves when its Task closes; older runs are not shown in the panel.
- 2026-11-03 Awaiting User Review: round 1 (a Conversations list), then four more rounds in conversation; the design settled as your runs, newest first, each with its delegated work, "Show older" and "Archive all older".
- 2026-11-03 Approved: the user ("show older is nice … check the consistency and if everything is consistent then we are done"). Final consistency check done (see the spec); final screenshots captured (`visual-references/`, VIS-001…017); spec and change log written.

## Result

- UI/UX specification: `ui-ux-spec.md`; change log: `design-change-log.md`; run instructions: `ui-reference-runbook.md` (repository root), section `left-panel-super-agents`.
- Final screenshots: `visual-references/` (VIS-001…VIS-017).
- Decision DEC-001: the Workspaces and Projects views are removed (not hidden); nothing in the platform is removed.
- Open for the Solution Designer (details in the spec, Open Decisions): where the run history is loaded; the Chat row's behavior; removing a folder from the workspace list; the Memory page cannot resume archived runs.
- Parked design tickets seen in the design repository, untouched (the user is asked whether to finish, keep or close them): `agent-definition-reconnect-ui`, `project-centric-execution` (Blocked since 2026-10-13), `WEB-BASELINE-REFRESH-004`.

## Integration Record

- Integration: `Completed` (2026-11-03). Ticket result `1f6bac29316e5d250a9c5a94552e464025aaa5ec` pushed as a fast-forward to `origin/personal` (base unchanged at `88e0e322`, so no merge was needed); the canonical checkout `/Users/normy/autobyteus_org/autobyteus-web-design` fast-forwarded to it. Default branch `personal`; local and `origin` revisions equal at that point (the finalization commit below follows the same sequence).
- Default-entry-point check: the canonical checkout ran on its own dev server (port 4971); `/workspace` showed the run section with its runs, newest first, the Project Task Manager run with its delegated copies, and no preview URL or preview-only state.
- Runtime: the ticket's dev server (port 4970) and the canonical check server (port 4971) are stopped; no state outside the browser's local storage.
- Cleanup: worktree `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/left-panel-super-agents` and branch `design/left-panel-super-agents` removed after this record is pushed.
