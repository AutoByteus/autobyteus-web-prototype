# Product Ticket — projects-left-navigation

## Identity And Scope

- Ticket / request ID: `projects-left-navigation` (Project Task `autobyteus-347`, Project `project_a1377344-25db-482a-97cc-ecfdb0fb495a`). No second ID.
- Title: A Projects view beside Workspaces in the left panel.
- Mode: **Product Experience Design** (it changes the left panel's run section, the New chat start surface and the right Projects board's coupling; all exist in the baseline).
- Status: **Completed** (finalization in progress until the integration record below says `Completed`)
- Date: 2026-10-31
- Requester: Solution Designer (`solution_designer_7591e3d191704d25a3396b3020a41127`), at the user's request ("i think we could first work on the UI? you can task @Product Team to work on the UI").
- Requirements: `/Users/normy/autobyteus_org/autobyteus-worktrees/projects-left-navigation/tickets/in-progress/projects-left-navigation/requirements-doc.md` at SR-004 (R3: REQ-001…015, AC-001…015, DEC-014, SCN-011; the Project choice on the start surface was added during this review and accepted by the Solution Designer, commit `97b4b6cbcf`), request `product-design-request.md`, evidence `investigation-notes.md`.
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
- 2026-10-31 Awaiting User Review: first review round sent to the user in the Product UI/UX Designer's conversation.
- 2026-10-31 Requirement Impact: the user asked for a Project choice on plain New chat; sent to the Solution Designer, accepted as SR-004.
- 2026-10-31 Approved: the user, after eight review rounds ("cool. i am satisfied. lets go", "approved"). Final check done; final screenshots captured (`visual-references/`, VIS-001…VIS-025); spec and change log written.

## Result

- UI/UX specification: `ui-ux-spec.md`; change log: `design-change-log.md`; run instructions: `ui-reference-runbook.md` (repository root), section `projects-left-navigation`.
- Final screenshots: `visual-references/` (VIS-001…VIS-025), captured by `prototype/scripts/capture-projects-left-navigation-final.mjs`.
- Reviewed state of the UI reference: `885c2186` (and the strip-icon correction `DC-010` found in the final check, in the finalization commit).
- Open for the Solution Designer: a Project icon and color picker (follow-up, not designed); production decision for remote delegated rows' Project (REQ-008); Task closure leaving the tree is not playable in the reference (existing mechanism).
- Accepted defaults the user agreed to: opening a run does not change the board's Project; the team group's "+" is in Projects mode only; no live Task-closure demo.
- Integration / cleanup: see the final record below (written at finalization).
- 2026-10-31 Base advanced: `origin/personal` moved to `31fc0bc` (integrations-page, WEB-BASELINE-REFRESH-014) during the review; merged into the ticket branch (conflicts only in the icon bundle, regenerated, and the runbook, both sections kept); the left panel, switch, tree, strip, drawer and start surface were looked at again; all 25 screenshots recaptured.

## Integration Record

- Integration: `Completed` (2026-10-31). Ticket result `0675adcaf73642b513dcdbc7d6e98474d260a057` pushed as a fast-forward to `origin/personal` (it carried the merge of `origin/personal@31fc0bc`); the canonical checkout `/Users/normy/autobyteus_org/autobyteus-web-design` fast-forwarded to it. Default branch `personal`; local and `origin` revisions equal at that point (finalization commit below follows the same sequence).
- Default-entry-point check: the canonical checkout ran on its own dev server (port 4961); `/workspace` → left panel → **Projects** → a Project → its run and delegated row opened with no preview URL or preview-only state.
- Runtime: the ticket's dev server (port 4960) and the canonical check server (port 4961) are stopped; no state outside the browser's local storage.
- Cleanup: worktree `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/projects-left-navigation` and branch `design/projects-left-navigation` removed after this record is pushed. The parked blocked ticket `project-centric-execution` (worktree `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/project-centric-execution`, branch `design/project-centric-execution`, Blocked since 2026-10-13, an earlier version of this request) was left untouched; the user is asked whether to finish, keep or close it.
