# Product Ticket — work-journal-search

## Identity And Scope

- Ticket / request ID: `work-journal-search` (Project Task `autobyteus-185`, "Agent search over Work Journals across all agents"; first step of the memory work `autobyteus-233`)
- Title: The Memory page as the home of memory: memory search, the Work Journal view, the memory index pipeline
- Status: `Completed` (approved by the user 2026-10-26)
- Mode: Product Experience Design (changes the existing Memory page, so it evolved the accepted baseline in place)
- Requester: Solution Designer (run `solution_designer_80624588913d473bac3ef7d8c3d4d305`), Software Engineering Team
- Requirements basis (approved, SR-001): R-009, R-010, R-012, R-013, R-014, R-015; acceptance AC-008, AC-011 (UC-007, UC-008)
- Request and evidence: `/Users/normy/autobyteus_org/autobyteus-worktrees/work-journal-search/tickets/in-progress/work-journal-search/` (`product-design-request.md`, `requirements-doc.md`, `investigation-notes.md`, `memory-search-evaluation-report.md`)
- Approval: the user, 2026-10-26, after four review rounds ("Oh, I think that the UI is correct now. I feel it's good.")

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin` = `AutoByteus/autobyteus-web-prototype`)
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/work-journal-search` (removed at closure)
- Ticket branch: `design/work-journal-search` (deleted at closure)
- Accepted design base: `01290bf990342efc48918ce75d4dbffd05fffc59`; advanced to `205aff6ea07ccfe51738469a14230d15a16e70d9` by merging `origin/personal` before integration (the Model Routing design); the final check was repeated after the merge: 19 of the 24 references are pixel-identical, the other 5 are screens whose running-progress percentages depend on timing or whose select rendering differs by noise; no visible drift.
- Source pin: `origin/personal@d74f75a51ab7dc47d42a13f33e0f943c3a230ad7` (baseline `WEB-BASELINE-REFRESH-013`); no bootstrap request was needed.
- UI reference code revision before the merge: `5dedfcd84d7f32457192dfa8f81198479574d956`
- Integration target and result: `personal`, see "Integration Record" below.
- Runtime isolation: dev server port 4930 (stopped at closure); a temporary `public/zz-frame.html` viewer was never committed and was deleted; screenshots were captured with a disposable script outside the repository (`/tmp/wjs-tools`), not committed.
- Ticket folder: `tickets/done/work-journal-search/`

## Data Origin (mock data)

All data is invented: agents, runs, teams (including the task team), workspaces, IDs, days, paths, IPs (documentation ranges) and domains (`*.example.net`), search results (scripted by keywords) and journal lines (generated from word pools with a seeded generator, plus planted passages). No real run, journal, transcript or customer data was used or captured. No test, `validate:*` or `capture:*` script was added; `package.json` and the lockfile are unchanged.

## Outcome And Handoff

- Deliverables: `ui-ux-spec.md`, 24 final visual references (`visual-references/VIS-001`…`VIS-024`, 20 at 1440×900 and 4 at 390×844), `design-review-notes.md`, the runnable UI reference, runbook section, README entry.
- Handoff recipient: Solution Designer, run `solution_designer_80624588913d473bac3ef7d8c3d4d305`. Open points for the Solution Designer are listed in the spec's "Open Decisions And Risks".
