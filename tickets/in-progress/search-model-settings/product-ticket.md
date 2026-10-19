# Product Ticket — search-model-settings

## Identity And Scope

- Ticket / request ID: `search-model-settings` (the Solution Designer's package identifier). Supplied request identifier: Project Task `autobyteus-146`
  ("Search model settings: choose, download and index the embedding model from Settings"), follow-up FU-1 of `autobyteus-71`. There is no second ID.
- Title: Settings → Search: choose, download and index the embedding model.
- Mode: `Product Experience Design`. It evolves the accepted AutoByteus Web baseline in place: the Settings page gets one new top-level section.
- Status: `Awaiting User Review`
- Requester: the Solution Designer (`solution_designer_80624588913d473bac3ef7d8c3d4d305`), for the user, 2026-10-19.
- Related requirements: `requirements-doc.md` `SR-001` (`/Users/normy/autobyteus_org/autobyteus-worktrees/search-model-settings/tickets/in-progress/search-model-settings/`):
  UC-001–UC-004, REQ-001–REQ-009, AC-001–AC-009, SCN-001–SCN-004, DEC-001–DEC-008 (open: DEC-005).
- The user's direction: the model download "may take some time… in the setting area… users can… select a different model. And then the indexing… the user can
  actively click index." (2026-10-18); "maybe we need to do some UI design now" (2026-10-19).
- Decision questions: DEC-005 placement; page structure and how many model facts to show up front; many Projects; the confirmation dialog's wording and cost.
- Non-goals: no catalog browsing or adding models, no board change, no per-Project model, no automatic pre-indexing, no proxy support.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin` = autobyteus-web-prototype)
- Ticket folder: `tickets/in-progress/search-model-settings/`
- Ticket worktree / branch: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/search-model-settings`, `design/search-model-settings`
- Accepted design base: `10207c6badd8a14b7d286fcbffc41c6b0cb12c47` (`origin/personal`, fetched 2026-10-19; local `personal` equals `origin/personal`)
- Source repository and selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`, `autobyteus-web`
- Baseline pin: `autobyteus-web@2f211340ee36` (v1.5.6-beta.1; `ui-baseline-report.md`, `WEB-BASELINE-REFRESH-010`).
- Baseline check (2026-10-19): the request's code base is `origin/personal@8d40ba3b6c`. `git diff 2f21134 8d40ba3b6c` over `autobyteus-web/pages/settings.vue` and
  `autobyteus-web/components/settings` is empty; the only Settings change is NFS guide copy in `localization/messages/*/settings.ts`, which this ticket does not touch.
  The other changed UI file is `components/projects/ProjectTaskBoard.vue` (the board's meaning-search status line), which this ticket does not change either. The Settings
  shell is current, so no Bootstrapper request was made.
- Runtime isolation record: `corepack pnpm dev --port 4691 --host 127.0.0.1` (this ticket); scratch captures and scripts in `/tmp/sms/`; in-memory state, reset by reload.
- Design-only layers: `prototype/search-settings/searchSettingsFixture.ts` (module-level synthetic state and a 1 s scripted timeline: downloads, model preparation and
  indexing advance while the section is not mounted, so leaving and returning shows current state). Scenarios seed the starting state only, through the existing key
  `autobyteus.prototype.scenario`: `search_unavailable`, `search_offline`, `search_empty`, `search_many_projects`, `search_load_failed` (default: `populated`).
  Model facts follow the request's catalog table; Project names and Task counts are invented and illustrative.

## Delivery And Validation

- UI reference changes: `pages/settings.vue` (nav item and section), `components/settings/SearchSettingsManager.vue`, `SearchModelsCard.vue`,
  `SearchProjectIndexesCard.vue`, `SearchModelSwitchDialog.vue`, `prototype/search-settings/searchSettingsFixture.ts`, localization en / zh-CN (`settings.search.*`,
  `settings.page.sections.search`).
- Validation so far (port 4691): `visual-references/final-validation.mjs` 72/72 (SRCH-001–016); `corepack pnpm typecheck` 0 errors; `corepack pnpm test` 17/17; `corepack pnpm lint` clean.
- Review URL: <http://127.0.0.1:4691/settings?section=search>

## Outcome And Handoff

- Next expected action: the user reviews the design and answers the open choices in `design-review-notes.md`.
