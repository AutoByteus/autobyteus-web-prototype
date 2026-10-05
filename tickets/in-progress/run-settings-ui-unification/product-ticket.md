# Product Ticket — run-settings-ui-unification

## Identity And Scope

- Product ticket: `run-settings-ui-unification` (same as the stable package identifier; no second ID)
- Stable package: `run-settings-ui-unification`, solution revision `SR-001`
- Title: One clean run-settings experience for Agent, Team and Org runs (new launch and saved run)
- Mode: `Product Experience Design` (evolves the accepted AutoByteus Web baseline)
- Status: `Awaiting User Review` (round 27, on baseline `origin/personal@b4f3ed1`, pin `10fb695`)
- Requester: Solution Designer (`/software_engineering_team/solution_designer`) for the user, 2026-10-04
- Request package: `/Users/normy/autobyteus_org/autobyteus-worktrees/run-settings-ui-unification/tickets/in-progress/run-settings-ui-unification/product-design-request.md`
- Requirements context (Draft, not approved): `requirements-doc.md`, `investigation-notes.md` in the same folder
- In-scope IDs: UC-001..004, SCN-001..005, BEH-001..005, REQ-001..004, QR-001, DEC-001, DEC-002
- User words (via request): the chat composer's four settings "look very clean and simple"; the Agent run form "not clean, not user-friendly"; Team and Org forms "a super long list of configuration".

## Decision Questions

- DEC-001: refresh the run panels with chat-style controls, or have Run open the chat composer?
- DEC-002: which settings do member overrides need?

## Repository And Baseline

- Canonical design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (branch `personal`)
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/run-settings-ui-unification`
- Ticket branch: `design/run-settings-ui-unification`
- Accepted design base: `a714bb234e0a609c7c704fb09b6562f831febce2` (`personal`)
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Baseline source pin: `origin/personal@e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71` (`ui-baseline-report.md`, WEB-BASELINE-REFRESH-003, accepted)
- Baseline applicability: accepted and applicable. Every in-scope run-config component in the baseline is byte-identical to the pin.
- Source delta to the Solution Designer's base `26b555126`: limited to the surfaces this ticket replaces (Antigravity "always auto-approve" lock, catalog Retry link, removed skill-access field, fresh launches default to auto-approve). No baseline refresh was requested: the request names `26b555126` as the code-reading base, not as a new design source authority, and the redesign supersedes those exact rows. The AGY lock is carried into the design from source `26b555126`. The auto-approve default for fresh launches stays at the baseline's behaviour. This is open for the user: a formal refresh can be requested if wanted.

## Runtime

- Review server: `corepack pnpm dev --port 4520` in the ticket worktree (process owned by this ticket)
- Temp/evidence scratch: `/tmp/autobyteus-design-run-settings-ui-unification`
- Fixture state: browser-local; reset with `localStorage.clear()`
- Design-only state switch for saved runs: `localStorage['autobyteus.design.runSettings.existingState'] = 'refresh_required' | 'model_unavailable'`

## Mock Data Added

- `prototype/run-settings/runtimeCatalogFixture.ts` (~4 KB, hand-written): three illustrative runtimes (Codex App Server, Claude Agent SDK, Antigravity CLI) with four invented models, so model+runtime choice, effort levels and the AGY lock are reviewable. The values are illustrative.
- `prototype/run-settings/autobyteusOrgFixture.ts` (~10 KB, hand-written, round 18, user request): the real
  "AutoByteus Org" structure from `autobyteus-agents` `origin/main@d5233c3`:
  - Product Team (2 members), Software Engineering Team (6) and Marketing Team (3, including the
    shared Computer Use Operator); 11 members in total.
  - Copied: IDs, display names, member names, coordinators, ownership and a one-line description.
  - Not copied: instructions, skills, tools, handoff text or account data.
  - No default model, as in the source definitions.
  - Added to the populated catalog in two places: the route store patch (`plugins/00.prototype-state.client.ts`)
    and the local GraphQL reads (`utils/apolloClient.ts`), which serve the Org's team-local member
    references.

## Findings

- F-001 (pre-existing, not caused by this ticket): `prototype/fixtures/runtime-state.json` (2.7 MB) and `source-state-snapshots.json` (4.4 MB) are store-state snapshots captured from the source app running against the synthetic observation node. The domain values are synthetic, but the size and the capture mechanism do not meet the current data-boundary rule. Recommend a separate baseline data-boundary correction ticket. This ticket adds none.
- F-002 (pre-existing, resolved in round 27): the saved Org run settings stayed on "Loading run configuration…" in the baseline fixture because the prototype stubbed `existingRunConfig.loadAgentOrgCanonical` and `agentOrgContexts.readRunConfig`; both now run against the local `AgentOrgRunConfig` fixture.
- F-003 (pre-existing): the legacy `workspace_*` scenarios error in the baseline. Saved runs are reviewed through the populated workspace tree instead.
- F-004 (pre-existing): Org Run in the review build lands on "No agent or team run selected", the same as the baseline.

## Status History

- 2026-10-04: opened from the Solution Designer handoff; worktree created from `a714bb2`; `In Progress`.
- 2026-10-04: round-1 proposal built and browser-validated; `Awaiting User Review`.
- 2026-10-04: user feedback — keep the Chat page's simple settings for every Run and reach member settings from there; `In Progress`.
- 2026-10-04: round 2 (Run opens Chat, Org as Chat target, "Customize members" line + inline member settings) built and browser-validated; `Awaiting User Review` (see `review-round-2.md`). Pending requirement impact recorded there.
- 2026-10-04: user asked for member settings in a right-side panel; round 3 built and browser-validated; `Awaiting User Review` (see `review-round-3.md`).
- 2026-10-04: user asked to show the target as the page heading instead of a chip in the message box; round 4 built and validated (see `review-round-4.md`).
- 2026-10-04: general agent shown with the same heading; team heading without member count; round 5 (see `review-round-5.md`).
- 2026-10-04: avatar beside the name only when present; heading moved up; round 6 (see `review-round-6.md`).
- 2026-10-04: removed redundant heading text and the back link; round 7 (see `review-round-7.md`).

## Finalization

- Integration: Pending
- Baseline promotion: Pending
- Cleanup: Pending

## Baseline Correction (2026-10-04)

- User found the live-run `@` mention on two lines in the design app; the product shipped the
  single inline mention (`006fd69`). Root cause (Product UI/UX Designer error): this ticket was
  branched from the canonical checkout's local `personal` without `git fetch`, and the baseline
  refresh was declined at intake on a too-narrow diff (run-config and chat components only,
  against `26b5551` rather than the latest fetched `origin/personal`).
- User direction: always fetch first and branch from `origin/personal`, never from the local
  checkout; keep the local design repo up to date. The user had the 15 unpushed local `personal`
  commits pushed; `origin/personal` = `a714bb2`.
- Refresh requested: `WEB-BASELINE-REFRESH-004` to source `origin/personal@0a32261`.
- After acceptance and integration: rebuild this ticket on the refreshed `origin/personal`
  (carry rounds 1–7a, `6436116`), revalidate, and resume review. Earlier "no refresh" note under
  Repository And Baseline is superseded.

## Rebuilt On The Refreshed Baseline (2026-10-04)

- `WEB-BASELINE-REFRESH-004` accepted and integrated: design `origin/personal` = `8fdf0b7`
  (pushed), baseline pin = source `origin/personal@0a32261` (source later advanced to `1b9739c`
  with no `autobyteus-web` UI change; one test file only).
- This ticket was squashed (history kept in tag `archive/run-settings-ui-unification-pre-refresh-004`)
  and rebased onto fetched `origin/personal@8fdf0b7`: accepted base is now `8fdf0b7`.
- Conflict resolution: product code wins where the refresh changed it (General Agent copy,
  skill-access removal, zh-CN AGY copy, scripted mention hooks removed); design changes re-applied
  on top (ChatApprovalToggle `muted`, chat draft Org target and member settings, Org run panel,
  run-settings runtime catalog fixture kept across route snapshots). The hand-made General Agent
  fixture rename was dropped; the Documentation Writer illustrative avatar re-applied.
- Revalidated in the browser on port 4520: General Agent heading; Agent/Team/Org Run → chat →
  send; member panel with Codex override carried into the Team launch; Org launch; saved Team
  run settings with Save on change; running Team composer shows the single inline `@` mention.
- Checks: repository typecheck pass, tests 13/13, lint pass; vue-tsc clean for ticket-owned files.

- 2026-10-04: round 8 — Team and Org "+" open New chat prefilled from the run (see `review-round-8.md`).
- 2026-10-05: before round 9, source `origin/personal` had advanced to `4dee901` (38 frontend files:
  Skills sources dialog, event monitor, token usage, small collaboration changes).
  `WEB-BASELINE-REFRESH-005` was opened (branch from fetched `origin/personal@8fdf0b7`) and sent to
  the Bootstrapper, then **withdrawn by the user** ("it belongs to new change in the current
  ticket"): the consistent `@` behaviour is a new design change owned by this ticket. The
  Bootstrapper stopped with no commits; its partial working-tree changes were discarded and the
  refresh worktree/branch removed. Baseline remains pin `0a32261` (design `origin/personal@8fdf0b7`).
- 2026-10-05: the user re-confirmed the refresh ("There are new changes in the baseline … keep it
  aligned now … After the baseline is up to date, then you can continue"). Round 9 work in
  progress committed as `f8615b7` (WIP) and paused; `WEB-BASELINE-REFRESH-006` (source
  `origin/personal@4dee901`) sent to the Bootstrapper from a fresh worktree on fetched
  `origin/personal@8fdf0b7`.
- 2026-10-05: `WEB-BASELINE-REFRESH-006` accepted, integrated and pushed (design
  `origin/personal@ab8b23d`, pin `4dee901`). Source advanced during it to `10fb695` (one frontend
  change: Background Tasks shell command); follow-up `WEB-BASELINE-REFRESH-007` sent. Round 9
  continues after 007 is integrated.
- 2026-10-05: `WEB-BASELINE-REFRESH-007` accepted, integrated and pushed (design
  `origin/personal@b4f3ed1`, pin `10fb695`, source unchanged at review). Ticket rebased cleanly onto
  it; round 9 (`@` always brings a collaborator in) completed and validated (see `review-round-9.md`).
- 2026-10-05: round 10 — flat member settings panel (see `review-round-10.md`).
- 2026-10-05: round 11 — menus stay inside the member panel; no sideways shift (see `review-round-11.md`).
- 2026-10-05: round 12 — redundant text removed from the member panel (see `review-round-12.md`).
- 2026-10-05: round 13 — member panel shows members only; defaults stay in the message box (see `review-round-13.md`).
- 2026-10-05: round 14 — clearer member rows: two-line summary, Customized label, one surface when opened (see `review-round-14.md`).
- 2026-10-05: round 15 — member panel text as clear as the message box; an opened member is a white bordered card (see `review-round-15.md`).
- 2026-10-05: round 16 — member panel resizable from its left edge (remembered width); dark setting labels (see `review-round-16.md`).
- 2026-10-05: round 17 — removed the "Files are saved in …" line under the message box (see `review-round-17.md`).
- 2026-10-05: round 18 — review fixture: the real AutoByteus Org (3 Teams, 11 members) for realistic member settings (see `review-round-18.md`).
- 2026-10-05: round 19 — removed the white grip on the panel's resize edge; the thin blue line on hover and the resize cursor remain.
- 2026-10-05: round 20 — consistency pass: saved-run settings use the New chat / member panel language; unreachable launch forms removed (see `review-round-20.md`).
- 2026-10-05: round 21 — saved-run header: no "Team run" / "Agent run" / "Org run" subtitle (the icon and panel title say it); status is a small badge beside the name (grey "● Stopped", green "● Running"); unused copy removed.
- 2026-10-05: round 22 — "Stop run" button in the saved-run settings status line while the run is running (same terminate action as the workspace tree); after stopping, the view shows Stopped / "Changes apply when this run resumes." and the model becomes editable.
- 2026-10-05: round 23 — no status sentences: a running run has only a stop icon button (tree's stop icon, tooltip "Stop run") at the right of the header; "they apply when this run resumes" moved into the Save bar; the status line remains only for refresh-required, a failed stop, and a stopped run whose settings cannot change.
- 2026-10-05: round 24 — the stop control is a small borderless red stop icon (28 px hit area, `text-red-500`, light red background on hover).
- 2026-10-05: round 25 — saved-run model menu matches the Chat model menu: same search box (searching only the run's runtime), the runtime as a section label with a small lock (tooltip "The runtime is fixed for this run"), then its models; the trigger tooltip no longer shows over an open menu.
- 2026-10-05: round 26 — the stop icon sits right after the Running badge instead of at the far right of the header.
- 2026-10-05: round 27 — UI reference fix (no design change): saved Org run settings now load (F-002). Validated: changing the Org-wide model updates every member including the members of the placed team; a placed team's workspace is editable; Save confirms.
