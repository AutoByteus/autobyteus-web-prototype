# Product Ticket — integrations-page

## Identity And Scope

- Ticket / request ID: `integrations-page` (Project Task `autobyteus-337`, Project `project_a1377344-25db-482a-97cc-ecfdb0fb495a`)
- Title: An Integrations page: one card per integration; install, connect, check; agent access follows the skill
- Status: `Completed` (2026-10-31)
- Mode: Product Experience Design (adds a main-menu page and removes a card from Server Settings → Basics, so it evolves the accepted baseline in place)
- Requester: Solution Designer (run `solution_designer_9a83b5676cdb4488a7e25094626f527c`), Software Engineering Team
- Requirements basis: REQ-001…REQ-010, UC-001…UC-004, AC-001…AC-003, AC-005, AC-006; open decisions DEC-001, DEC-002 (user)
- Request and evidence: this folder (`product-design-request.md`, `requirements-doc.md`, `investigation-notes.md`, `solution-revision-record.md`)
- Approval: the user, 2026-10-31, after four review rounds: "its much better now. approve" (revision 4)

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin` = `AutoByteus/autobyteus-web-prototype`)
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/integrations-page`
- Ticket branch: `design/integrations-page`
- Accepted design base: `e9d5a22ebb3295dd8102cd9b96c54fa1560bde14` (`origin/personal` after the baseline refresh below; first fetched at `752b6b8`)
- Source: `/Users/normy/autobyteus_org/autobyteus-worktrees/integrations-page` (`autobyteus-web`), base `origin/personal@e4bebdc858`; read only
- Source pin of the baseline: `d74f75a51ab7dc47d42a13f33e0f943c3a230ad7` (`WEB-BASELINE-REFRESH-013`)
- Ticket folder: `tickets/in-progress/integrations-page/`

## Baseline Check (2026-10-31)

Files changed between the pin `d74f75a` and `e4bebdc858`, for the surfaces this design touches:

| Surface | Result |
| --- | --- |
| Primary navigation (`composables/useShellPrimaryNavigation.ts`) | unchanged |
| Skills page and components, Agent edit, layout | unchanged |
| Settings → Server Settings → Basics | **changed**: `GitHubIntegrationCard.vue` is new (207 lines) and `ServerSettingsBasicsPanel.vue` mounts it; the baseline has no such card |
| Settings page left menu (`pages/settings.vue`) | **changed**: the icons beside the section names are gone |

The GitHub card is the element this design removes, so its current look must be in the baseline. Verified gap -> Baseline Needed: a scoped refresh of those two surfaces (baseline ticket `WEB-BASELINE-REFRESH-014`). The rest of the baseline keeps its pin.

## Baseline Request

- Baseline ticket: `WEB-BASELINE-REFRESH-014`, worktree `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-014`, branch `design/web-baseline-refresh-014`, base `752b6b8`
- Sent to `/product_team/ui_baseline_bootstrapper` on 2026-10-31; returned `Completed`; accepted (GitHub card and Settings menu byte-identical to `e4bebdc858`, synthetic fixtures) and integrated into `personal` at `345a439`, closing commit `e9d5a22`. Its worktree and branch are removed.
- Runtime: dev server on port 4940 (this ticket); review captures by a disposable script in `/tmp/integ-tools`, not committed.

## Outcome And Handoff

- Deliverables: `ui-ux-spec.md`, 19 final visual references (`visual-references/VIS-001`…`VIS-019`; 17 at 1440×900, 2 at 390×844), `design-review-notes.md`, the runnable UI reference (route `/integrations`), runbook section, README entry.
- Open decisions kept open in the spec: DEC-001, DEC-002; the chip wording "Installed, needs a token" (for the Solution Designer).
- Handoff recipient: Solution Designer, run `solution_designer_9a83b5676cdb4488a7e25094626f527c`.
- Data origin: all data invented (`prototype/integrations/integrationsDesignFixture.ts`); no test, `validate:*` or `capture:*` script was added; `package.json` and the lockfile are unchanged. Final references were captured with a disposable script outside the repository (`/tmp/integ-tools`, not committed).

## Integration Record

- Result commit (spec, 19 references, UI reference, ticket record): `365a8ac0b9b06076d051f734839784c8d2813555`, pushed to `origin/personal` as a fast-forward (`e9d5a22..365a8ac`) and fast-forwarded into the canonical checkout. The UI reference code revision is that commit.
- Accepted design base: `e9d5a22` (after `WEB-BASELINE-REFRESH-014`, integrated at `345a439`/`e9d5a22`); `origin/personal` had not moved before the push.
- Default-entry check after integration: the canonical checkout (`personal`) was run on its own port (4941) and opened at `/integrations`: the menu shows Integrations after Nodes; Install, then Connect opened the dialog with the help link, token field and three steps; no page errors.
- Dev servers (4940, 4941) stopped; the ticket worktree and branch removed. The record commit that carries this note is the final `personal` revision.
