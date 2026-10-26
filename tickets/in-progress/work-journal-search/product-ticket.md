# Product Ticket — work-journal-search

## Identity And Scope

- Ticket / request ID: `work-journal-search` (Project Task `autobyteus-185`, "Agent search over Work Journals across all agents"; first step of the memory work `autobyteus-233`)
- Title: The Memory page as the home of memory: memory search, the Work Journal view, the memory index pipeline
- Status: `Awaiting User Review` (first design round, 2026-10-26)
- Mode: Product Experience Design (changes the existing Memory page, so it evolves the accepted baseline in place)
- Requester: Solution Designer (run `solution_designer_80624588913d473bac3ef7d8c3d4d305`), Software Engineering Team
- Requirements basis (approved, SR-001): R-013, R-014, R-009, R-010, R-012, R-015; acceptance AC-011, AC-008 (and UC-007, UC-008)
- Request and evidence: `/Users/normy/autobyteus_org/autobyteus-worktrees/work-journal-search/tickets/in-progress/work-journal-search/` (`product-design-request.md`, `requirements-doc.md`, `investigation-notes.md`, `memory-search-evaluation-report.md`)
- Approval authority: the user (he approved having the Product Team design it, 2026-10-23). He reviews with the Product UI/UX Designer.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin` = `AutoByteus/autobyteus-web-prototype`)
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/work-journal-search`
- Ticket branch: `design/work-journal-search`
- Accepted design base: `01290bf990342efc48918ce75d4dbffd05fffc59` (`origin/personal`, fetched 2026-10-26; baseline pin `d74f75a51ab7dc47d42a13f33e0f943c3a230ad7`)
- Baseline: accepted (`WEB-BASELINE-REFRESH-013`, integrated). No bootstrap request; the Memory page code in the worktree is the pinned source's own.
- Integration target and result: `personal`, `Pending`
- Runtime isolation: dev server `corepack pnpm dev --port 4930` (the design's other tickets use 3210, 4781–4789, 4820–4823, 4840, 4901); state is in-memory in the page and resets on reload; one temporary file `public/zz-frame.html` (a scaled-iframe viewer for checking a 1440 px layout) is untracked and is deleted before commit.
- Cleanup: `Pending`
- Ticket folder: `tickets/in-progress/work-journal-search/`

## Outcome And Handoff

- Next expected action: the user reviews the running reference and gives feedback (see `design-review-notes.md`); after his explicit approval the final references and `ui-ux-spec.md` are produced, the ticket is integrated into `personal`, and the approved package goes back to the Solution Designer.
- Handoff recipient on approval: Solution Designer, run `solution_designer_80624588913d473bac3ef7d8c3d4d305`.
