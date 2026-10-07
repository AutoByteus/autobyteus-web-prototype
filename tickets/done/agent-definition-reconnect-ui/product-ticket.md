# Product Ticket — agent-definition-reconnect-ui

## Identity And Scope

- Product ticket: `agent-definition-reconnect-ui`.
- Stable package: `run-continuity-after-agent-definition-rename` (Solution Designer), solution
  revision `SR-009`. No second package ID.
- Title: Reconnect a run to an agent — UI/UX redesign.
- Mode: `Product Experience Design` (evolves the accepted AutoByteus Web baseline: conversation,
  composer, run settings, Workspaces tree).
- Status: `Completed` (user confirmation 2026-10-07: "i am fine with the UI"; Solution Designer logic review applied).
- Requester: Solution Designer (`/solution_designer`, run
  `solution_designer_3082838c83f24535972a43836b65e1c7`) for the user, 2026-10-07.
  - User: "I want to work on the UI first. Please delegate task to Product Team to work on UI" /
    "I am not satisfied with the UI you designed" / "The UI was really bad".
- Request package:
  `/Users/normy/autobyteus_org/autobyteus-worktrees/run-continuity-after-agent-definition-rename/tickets/in-progress/run-continuity-after-agent-definition-rename/product-design-request.md`
- Requirements context (approved, SR-009): `requirements-doc.md` and `investigation-notes.md` in the
  same folder.
- In-scope IDs: REQ-001, REQ-002, REQ-003, REQ-004, REQ-007; AC-001, AC-002, AC-004, AC-006, AC-009
  (rev SR-009), AC-010; DEC-002, DEC-004, DEC-005, DEC-010, DEC-011, DEC-012, DEC-013; SCN-001.
- Fixed behavior (not redesigned): identity and address kept, no auto-guessing, any available agent,
  per-run note when instructions apply only from a new session (Antigravity/Grok).
- Decision questions (from the request): discoverability before sending; a picker for many agents;
  placement for a configured member vs a collaborator and the header after reconnect; wording and
  placement of success, the instructions note, busy and failure states.

## Repository And Baseline

- Canonical design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
  (default branch `personal`, remote `origin` = `AutoByteus/autobyteus-web-prototype`).
- Ticket worktree:
  `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/agent-definition-reconnect-ui`
- Ticket branch: `design/agent-definition-reconnect-ui`
- Accepted design base: `origin/personal@15cb0d9` (fetched 2026-10-07; local default branch had no
  unpushed commits).
- Selected frontend: `autobyteus-web` (read-only). Request source: the feature worktree
  `/Users/normy/autobyteus_org/autobyteus-worktrees/run-continuity-after-agent-definition-rename/autobyteus-web`,
  based on `5316a0cad`; current Reconnect UI read from its working tree.
- Baseline source pin: `origin/personal@10fb695` (`ui-baseline-report.md`, WEB-BASELINE-REFRESH-007,
  accepted) plus accepted design tickets since (run-settings-ui-unification, chat tickets).
- Drift check at intake (`10fb695`/design base vs `5316a0cad`) for every component this ticket
  touches:
  - `ErrorSegment.vue`, `TeamWorkspaceSurface.vue`, `WorkspaceHistoryWorkspaceSection.vue`,
    `WorkspaceStableExecutionRow.vue`, `CollaboratorAddFailureNotice.vue`: identical.
  - `AgentEventMonitor.vue`, `AgentWorkspaceSurface.vue`: script-only differences (file-preview
    origin guard; ⚙ hidden for `temp-*` contexts). Same visible UI for saved runs.
  - `ExistingRunSettings.vue`, `RunMemberRow.vue`, `RunSubjectHeader.vue`, `ChatTargetSwitcher.vue`:
    the production implementation of the accepted run-settings-ui-unification design (same note
    line, header, rows and menu).
  - Conclusion: the accepted baseline applies; no correction or refresh is needed.

## Runtime

- Review server: `corepack pnpm dev --port 3291 --host 127.0.0.1` in the ticket worktree, owned by
  this ticket; log `/tmp/adr-dev-3291.log`.
- Entry: the normal product URL `/workspace`. No preview switch.
- State: browser memory; reloading the page restores the start of the example.

## Status History

- 2026-10-07: opened from the Solution Designer request. Worktree created from
  `origin/personal@15cb0d9`. Baseline applicable. `In Progress`.
- 2026-10-07: round 1 built and validated in the browser (standalone, team member, collaborator,
  Settings, busy/failure, empty search, narrow 390 px, regression on the Research Assistant run).
  Review notes `review-round-1.md`. Review URL `http://127.0.0.1:3291/workspace`.
  `Awaiting User Review`.
- 2026-10-07: feedback round 1: "too much texts? and the UI could be cleaner". `In Progress` →
  round 2: every surface is one short line with the action on the right (composer notice, error
  card, success line); the dialog header is one line; explanations removed; button "Reconnect";
  Settings member line "editor: agent no longer exists" (id in tooltip); resolved card is a grey
  one-line note. `Awaiting User Review`.
- 2026-10-07: feedback: the yellow Settings text is too small to see. `In Progress` → round 3:
  Settings lines are 14px dark grey with a solid amber ⚠ / green ✓ icon; Reconnect 14px blue.
  `Awaiting User Review`.
- 2026-10-07: feedback "color?" on the grey Settings line. `In Progress` → round 4: Settings uses the
  same one-line amber / green bars as the message-box notice (14px, amber-900 on amber-50; emerald-900
  on emerald-50; Reconnect on the right). `Awaiting User Review`.
- 2026-10-07: feedback "maybe only a little bit smaller font". Round 5: all Reconnect bars and the
  error card use 13px (`text-[0.8125rem]`, the product menus' size). `Awaiting User Review`.
- 2026-10-07: user: "i am fine with the UI" / "But i am not sure whether solution designer thinks the
  logic is correct or not". Logic review sent to the Solution Designer (`logic-review-request.md`,
  L1–L10). Finalization waits for that answer.
- 2026-10-07: Solution Designer logic review (`product-logic-review-response.md` in the request folder):
  L1 corrected (missing = not in catalog AND exact `agentDefinition(id)` lookup finds nothing);
  L5 corrected (one message each for AGENT_RUN_ACTIVE, AGENT_DEFINITION_REBIND_PENDING, RUN_ACTIVE,
  DEFINITION_NOT_FOUND → list refreshed); L3 (one reconnect also changes sourceless delegated copies;
  count shown when > 1 — example adds a delegated copy of the collaborator); L10 out of scope; grey
  "reconnected to" line is live-only. L2, L4, L6–L9 confirmed. Round 6 applied and validated (no
  visual change to the accepted look besides "· 2 runs").
- 2026-10-07: after confirmation, missing-agent text wraps instead of truncating in narrow windows
  (no desktop change). Final validation through `/workspace` (desktop 1440×900 and 390×844):
  standalone, team member (Settings, Antigravity note), collaborator + delegated copy (· 2 runs),
  four rejections, live-only grey line, regression on the Research Assistant run. Scoped vue-tsc
  clean; `pnpm lint` and `pnpm test` (14/14) pass. Final references VIS-001–VIS-018 and
  `ui-ux-spec.md`. `Completed`.

## Canonical Result

- `ui-ux-spec.md` and `visual-references/VIS-001`–`VIS-018` (this folder).
- Supporting: `review-round-1.md`, `logic-review-request.md`, `review-evidence/`.

## Finalization

- Integration: fast-forward push of `design/agent-definition-reconnect-ui` to `origin/personal`, then a
  fast-forward of the canonical checkout. Revisions are in the handoff.
- Cleanup: stop the review server on 3291 and remove the ticket worktree after integration; the
  branch is kept under repository policy.
