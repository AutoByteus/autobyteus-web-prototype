# Product Ticket — remote-runs-in-tree

## Identity And Scope

- Ticket / request ID: `remote-runs-in-tree` (AutoByteus engineering Task `autobyteus-278`; engineering branch `codex/remote-runs-in-tree`)
- Title: Show a run delegated to another node under its delegator in the run tree; open it and talk to it
- Mode: `Product Experience Design` (it evolves the accepted run tree and run view)
- Status: `Completed` (user approval 2026-10-23: "Yeah, I think we're good. This looks perfect, I have to say. Yeah, it's done.")
- Requester: Solution Designer `solution_designer_fb26ec003e5d477c8604e2b140ba926c`, for the user ("good contact it to work on the UI now", 2026-10-23)
- Related requirements: `requirements-doc.md` (SR-002): UC-801…804, REQ-801…807, BEH-801…805, AC-801…807, DEC-801…807
- Critical journey: in the Workspaces tree the user's Project Task Manager run shows the Marketing Team it delegated to the node "docker" under it, like a local copy, marked with a computer icon and "docker", with its title and status; the user opens it, follows its conversation live, sends it a message and gets its answer; its Files, Terminal and Artifacts say it is on docker; an unreachable node shows a plain error and the rest of the tree works.
- Decisions resolved with the user: the node marker's form (chip left of the team icon and name; summary under the node's name; DC-801/802); **DEC-804 decided yes** by his approval of the design with the stop square shown (he was asked twice and gave no separate yes/no); PA-803/PA-805 shown and unchanged.
- Non-goals: files, terminal, workspace of remote runs; reconnecting and catch-up; messaging unlinked runs; attachments across nodes; the mobile shell.
- Authority files (read-only): `/Users/normy/autobyteus_org/autobyteus-worktrees/remote-runs-in-tree/tickets/in-progress/remote-runs-in-tree/{handoff-product-design,requirements-doc,investigation-notes}.md`

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin` = AutoByteus/autobyteus-web-prototype)
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/remote-runs-in-tree`
- Ticket branch: `design/remote-runs-in-tree`
- Accepted design base: `feed5c653e31692235c64680e7963e73afd27f6e` (`origin/personal`, fetched 2026-10-23; local `personal` had no unpushed commits)
- Source: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`, `autobyteus-web`; engineering worktree `/Users/normy/autobyteus_org/autobyteus-worktrees/remote-runs-in-tree` (read only) at `ffa2390275` (base `origin/personal@3b09fbe308`)
- Pinned source revision of the baseline: `origin/personal@9e7a45880865912442f4188e6d2a58d99b10a54c` (`ui-baseline-report.md`, `WEB-BASELINE-REFRESH-012`), plus the accepted `delegated-copy-task-locator`, `agent-definition-reconnect-ui` and `one-nodes-tab` designs
- Baseline check for this request (no refresh needed): between `9e7a458` and the engineering worktree, `components/workspace`, `components/conversation`, `components/layout`, `components/chat` have no change; `utils/runTreeProjection.ts` changes one line (the stored title is resolved for display, 269), which is data, not markup; the other changed files (Project Task comments, Nodes page, Agent Runtimes strings) are surfaces this design does not touch.
- Integration: see Final Integration below
- Ticket folder: `tickets/done/remote-runs-in-tree/`

## Runtime isolation

- Port `4901`: `corepack pnpm dev --port 4901` in the ticket worktree (started by the Product UI/UX Designer; log `/tmp/remote-runs-in-tree-dev.log`).
- State is in memory (a page reload resets it); no files, no production service, no other ticket's state used.

## Review (round 1)

- Review URL: `http://127.0.0.1:4901/workspace`
- No setup: the default data carries the remote runs. Optional starting states (existing scenario seeding, browser console):
  - every state at once: `localStorage.setItem('autobyteus.prototype.scenario','remote_states'); location.reload()`
  - Chinese: `localStorage['autobyteus.localization.preference-mode']='zh-CN'`
- Steps and what to look at are in `ui-reference-runbook.md`, section `remote-runs-in-tree`.

- Round 1 feedback (user, 2026-10-23): put the computer icon and node name on the left of the team name, not on the second line. Applied (DC-801): chip left of the team icon and name; the title (and the error line) starts under the node's name in the chip (the same column as a local copy's summary; the computer icon is 14 px). Long names truncate a little ("market researc…"); the tooltip shows them in full.

## Outcome And Handoff

- Next expected action: the Solution Designer integrates `ui-ux-spec.md` and the 21 final references into the requirements and starts the architecture design.
- Handoff target on completion: Solution Designer `solution_designer_fb26ec003e5d477c8604e2b140ba926c`.

## Delivery And Validation

- UI/UX specification: `ui-ux-spec.md` (Approved). Final references: `visual-references/VIS-001 … VIS-021`. Supporting: `design-change-log.md` (DC-801 … DC-811), `design-assumptions.md` (PA-801 … PA-809).
- Runnable UI reference entry point: `/workspace`; scenarios `remote_runs`, `remote_states`; fixture `prototype/remote-runs/remoteRunsFixture.ts`.
- User-confirmation reference: the user's message "Yeah, I think we're good. This looks perfect, I have to say. Yeah, it's done.", 2026-10-23, in the Product UI/UX Designer conversation.
- Final check (designer, in the browser, no committed scripts; disposable Playwright scripts in `/tmp`): the approved journeys through the normal entry point `/workspace` with the default data (tree, open, live update, send and answer, Files/Terminal/Activity, file path, Stop, not reachable, Retry, failed send), every state in `remote_states`, run settings, Chinese, and the 390 px layout. A gap found in the final pass (the narrow capture cut off before the remote rows) was re-captured.
- Baseline status: applicable accepted baseline `ui-baseline-report.md` (`WEB-BASELINE-REFRESH-012`) plus the accepted designs listed above; no refresh or correction was needed.
- Data-boundary check: every node, run, title, conversation, timing and failure is invented in `prototype/remote-runs/remoteRunsFixture.ts` (and the existing `delegatedCopyTasksFixture.ts`); nothing real, captured or replayed.

## Final Integration

- Integration: `Completed` (2026-10-23)
- Design result commit: `f828ca5` (spec, 21 final references, runbook, UI reference); ticket-record fix `e71e5d2`; this record follows. Pushed to `origin/personal` as fast-forwards from `design/remote-runs-in-tree` (base `feed5c653e31692235c64680e7963e73afd27f6e`, no advance in between); the canonical checkout `/Users/normy/autobyteus_org/autobyteus-web-design` was fast-forwarded to it.
- Default-entry-point check after integration: the canonical checkout started on port 4902 shows `/workspace` → Project Task Manager with three remote rows (three node chips), opens the marketing team's coordinator with the header chip, and the streamed tool call arrives; no preview URL or switch (the default data carries the remote runs).
- Runtime: ports 4901 (ticket worktree) and 4902 (canonical check) stopped.
- Cleanup: the ticket worktree and branch `design/remote-runs-in-tree` removed after this record is integrated.
