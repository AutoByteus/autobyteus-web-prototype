# Product Ticket — projects-left-navigation

## Identity And Scope

- Ticket / request ID: `projects-left-navigation` (Project Task `autobyteus-347`, Project `project_a1377344-25db-482a-97cc-ecfdb0fb495a`). No second ID.
- Title: A Projects view beside Workspaces in the left panel.
- Mode: **Product Experience Design** (it changes the left panel's run section, the New chat start surface and the right Projects board's coupling; all exist in the baseline).
- Status: **In Progress**
- Date: 2026-10-31
- Requester: Solution Designer (`solution_designer_7591e3d191704d25a3396b3020a41127`), at the user's request ("i think we could first work on the UI? you can task @Product Team to work on the UI").
- Requirements: `/Users/normy/autobyteus_org/autobyteus-worktrees/projects-left-navigation/tickets/in-progress/projects-left-navigation/requirements-doc.md` at SR-002 (REQ-001…015, AC-001…014), request `product-design-request.md`, evidence `investigation-notes.md`.
- Critical journey: Workspaces | Projects switch → a Project in the tree → "+" → New chat under the Project with its folder → the run listed under the Project → delegated work nested with its Task line → the right board follows the Project → closing a Task removes the delegated work.
- Decision questions: the five questions of the request (switch and collapsed strip; Project rows, groups and "+"; start surface; right-board coupling; states).
- Non-goals: production implementation, a Task list in the left panel, Agent Orgs started under a Project, moving runs between Projects, closed Tasks' conversations, mobile.

## Design & Repository Context

- Design repository: `/Users/normy/autobyteus_org/autobyteus-web-design` (remote `https://github.com/AutoByteus/autobyteus-web-prototype.git`, default branch `personal`).
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/projects-left-navigation`; branch `design/projects-left-navigation`.
- Accepted base: fetched `origin/personal@752b6b816c01350280f87cbd994146b8ff03832b` (canonical checkout clean, no unpushed commits).
- Source: `/Users/normy/autobyteus_org/autobyteus-worktrees/projects-left-navigation` (read only), `autobyteus-web`; baseline pin `d74f75a51ab7dc47d42a13f33e0f943c3a230ad7`, source base `8faae96899`.
- Baseline check (2026-10-31): `git diff d74f75a 8faae96899 -- autobyteus-web` changes 266 files. In scope: `AppLeftPanel.vue` unchanged; `components/workspace/history/*` only `WorkspaceHierarchyBranches.vue` (a type annotation); `running/RunningTeamGroup.vue` and `RunningTeamRow.vue` (icon component swap, same glyphs); the start surface (`ChatNewSurface`, `ChatWorkspaceMenu`, `RunTargetSwitcher`) unchanged; `WorkspaceConfigForm.vue` deleted (not on any shown surface); Projects pages: voice-status component swap only. The baseline is current for the scoped surfaces; no refresh needed.
- Runtime isolation: dev server `corepack pnpm dev --port 4960`, log `/tmp/projects-left-nav-dev.log`; fixture state is in the browser's local storage (reset by clearing it); no shared process or state.

## Status Log

- 2026-10-31 In Progress: worktree created; baseline checked; design built in the reference.
