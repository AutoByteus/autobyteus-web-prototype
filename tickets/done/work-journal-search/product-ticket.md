# Product Ticket — work-journal-search

## Identity And Scope

- Ticket / request ID: `work-journal-search` (Project Task `autobyteus-185`, "Agent search over Work Journals across all agents"; first step of the memory work `autobyteus-233`)
- Title: The Memory page as the home of memory: memory search, the Work Journal view, the memory index pipeline
- Status: `Completed` — revision SR-006 (2026-10-27, no strength labels, UD-020) approved by the user ("its done"); the first approval of 2026-10-26 was integrated at `d011922`
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
- Integration target and result: `personal`, `Completed` (see "Integration Record").
- Runtime isolation: dev server port 4930 (stopped at closure); a temporary `public/zz-frame.html` viewer was never committed and was deleted; screenshots were captured with a disposable script outside the repository (`/tmp/wjs-tools`), not committed.
- Ticket folder: `tickets/done/work-journal-search/`

## Data Origin (mock data)

All data is invented: agents, runs, teams (including the task team), workspaces, IDs, days, paths, IPs (documentation ranges) and domains (`*.example.net`), search results (scripted by keywords) and journal lines (generated from word pools with a seeded generator, plus planted passages). No real run, journal, transcript or customer data was used or captured. No test, `validate:*` or `capture:*` script was added; `package.json` and the lockfile are unchanged.

## Outcome And Handoff

- Deliverables: `ui-ux-spec.md`, 24 final visual references (`visual-references/VIS-001`…`VIS-024`, 20 at 1440×900 and 4 at 390×844), `design-review-notes.md`, the runnable UI reference, runbook section, README entry.
- Handoff recipient: Solution Designer, run `solution_designer_80624588913d473bac3ef7d8c3d4d305`. Open points for the Solution Designer are listed in the spec's "Open Decisions And Risks".

## Integration Record

- Result commit (spec, 24 references, ticket record): `c315ca9bb1b08eb16bed9f175f20d65f8d7bcf40`, pushed to `origin/personal` as a fast-forward (`205aff6..c315ca9`) and fast-forwarded into the canonical checkout.
- Default-entry check after integration: the canonical checkout (`personal`) was run on its own port and opened at `/memory`: tabs Browse · Search · Index; Browse cards; the Search tab centred; a search returned 8 results; a match opened the Work Journal with the banner `From your search “ddns updater” · lines 5353–5355 · Matched by words, strong`; the run tabs were Work Journal and Raw Traces; Back returned the 8 results; the Index tab showed "Up to date" with four steps; no page errors.
- Ticket moved to `tickets/done/work-journal-search/` in the closing commit; dev servers on 4930 and 4931 stopped; the ticket worktree and branch removed after the push. The final local and remote `personal` revisions are recorded in the closing commit message and the result sent to the Solution Designer.

## Revision SR-006 (2026-10-27)

- Requested by: the Solution Designer, on the user's decision UD-020 (remove Strong / Fair / Weak; show facts). Request: `product-design-revision-request.md` in the engineering ticket folder.
- Reopened on worktree `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/work-journal-search-sr006`, branch `design/work-journal-search-sr006`, from `origin/personal` `d01192275ca34c648cd0364144796daadae01a19`; ticket folder moved back to `tickets/in-progress/`.
- Runtime: dev server on port 4932; recapture script outside the repository (`/tmp/wjs-tools`, not committed).
- Changed: the match label and journal banner, the notes for missing words, the scripted cues and fixtures, strings (en, zh-CN), spec text; recaptured VIS-006, 007, 008, 017, 022, 024; new VIS-025, VIS-026.
- User changes during the review of the revision: no "Related by meaning" label anywhere; the not-found note is only the fact; no "Mentioned" prefix; run ID and workspace on one line; a match's day only when needed; no Open button (the match lifts on hover).
- Approved by the user, 2026-10-27 ("its done"). Data origin unchanged: all fixtures invented; the facts (found words, words not found) are computed from the invented journals' text.

## Integration Record — Revision SR-006

- Revision commit `a55923a3f26622ed7b347a33c567797974eac97c` pushed to `origin/personal` as a fast-forward (`d011922..a55923a`) and fast-forwarded into the canonical checkout; local and remote `personal` are the same revision. The default branch had not moved since the branch point (no merge needed).
- Default-entry check after integration (canonical checkout run on its own port, `/memory`): tabs Browse · Search · Index; `purple elephant` shows `None of these words appear in your memory: purple, elephant.` and no `Words:` label; `ddns updater cloudflare` shows `Not found in your memory: cloudflare.`, the first match `Words: ddns`, and the Work Journal banner `lines 5353–5355 · Words: ddns`; no Strong / Fair / Weak / Related by meaning text anywhere; no page errors.
- Dev servers (4932, 4933) stopped; the revision worktree and branch removed.
