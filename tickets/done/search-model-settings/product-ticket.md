# Product Ticket — search-model-settings

## Identity And Scope

- Ticket / request ID: `search-model-settings` (the Solution Designer's package identifier). Supplied request identifier: Project Task `autobyteus-146`
  ("Search model settings: choose, download and index the embedding model from Settings"), follow-up FU-1 of `autobyteus-71`. There is no second ID.
- Title: Settings → Server Settings → Embedding: choose, download and index the embedding model.
- Mode: `Product Experience Design`. It evolves the accepted AutoByteus Web baseline in place: Server Settings gets one new sub-section, **Embedding** (the user's direction, 2026-10-19: under Server Settings, technical wording).
- Status: `Completed` (revision RV-001, 2026-10-28, one "Waiting…" state, approved by the user; see "Revision RV-001")
- Requester: the Solution Designer (`solution_designer_80624588913d473bac3ef7d8c3d4d305`), for the user, 2026-10-19.
- Related requirements: `requirements-doc.md` `SR-001` (`/Users/normy/autobyteus_org/autobyteus-worktrees/search-model-settings/tickets/in-progress/search-model-settings/`):
  UC-001–UC-004, REQ-001–REQ-009, AC-001–AC-009, SCN-001–SCN-004, DEC-001–DEC-008 (open: DEC-005).
- The user's direction: the model download "may take some time… in the setting area… users can… select a different model. And then the indexing… the user can
  actively click index." (2026-10-18); "maybe we need to do some UI design now" (2026-10-19).
- Decision questions: DEC-005 placement; page structure and how many model facts to show up front; many Projects; the confirmation dialog's wording and cost.
- Non-goals: no catalog browsing or adding models, no board change, no per-Project model, no automatic pre-indexing, no proxy support.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin` = autobyteus-web-prototype)
- Ticket folder: `tickets/done/search-model-settings/`
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
  Each model shows name, state, language label and download size only (user direction); Project names and Task counts are invented and illustrative.

## Delivery And Validation

- UI reference changes: `pages/settings.vue` (Server Settings sub-nav item and mode), `components/settings/ServerSettingsManager.vue` (renders the panel before the raw-settings gate), `components/settings/SearchSettingsManager.vue`,
  `SearchModelsCard.vue`, `SearchProjectIndexesCard.vue`, `SearchModelSwitchDialog.vue`, `prototype/search-settings/searchSettingsFixture.ts`, localization en / zh-CN (`settings.search.*` keys,
  `settings.page.serverSettings.embedding`). The `Search*` file names and `search-*` test ids are historical; the product name is Embedding.
- Validation (port 4691): `visual-references/final-validation.mjs` 87/87 (SRCH-001-019); `corepack pnpm typecheck` 0 errors; `corepack pnpm test` 17/17; `corepack pnpm lint` clean.
- User-confirmation reference (2026-10-19): the user replied "done" to the final review package (with the self-validation round), after directing: placement under Server Settings named Embedding with technical wording;
  a cleaner UI; only the necessary facts per model; the Hugging Face source said once; much less text. D-1-D-5 were recorded as approved because the user did not object.
- Final references: 23 images `visual-references/VIS-001`-`VIS-021` captured after approval (`capture-references.mjs`); spec `ui-ux-spec.md` (`Approved`).
- Requirement impact reported to the Solution Designer: DEC-005 resolved (Server Settings -> Embedding); REQ-001 facts narrowed (no licence, indexing speed, memory); REQ-004 / DEC-008 cost narrowed to download size; minimal copy.
- Design revision: `4e4ac06` (approved design, spec, 23 references, runbook; branch `design/search-model-settings`, accepted base `10207c6`); this record follows as the integration commit.
- Default-entry-point validation after integration: `Completed`. On the canonical checkout at `personal@4e4ac06`, `corepack pnpm dev --port 4693` with `final-validation.mjs` (BASE 4693) passed 87/87 (route `/settings?section=server-settings&mode=embedding`, no preview URL or preview-only state).
- Integration: `Completed`. Fast-forward push `10207c6..4e4ac06` to `origin/personal`; the canonical checkout was fast-forwarded; local = origin.
- Cleanup: `Completed`. Servers on ports 4691 and 4693 stopped; the worktree and local branch removed after this record (no remote ticket branch pushed).

## Outcome And Handoff

- Next expected action: the Solution Designer reconciles the approved package with the requirements (next solution revision, including the requirement impact above) and starts the architecture design.
- Handoff: `get_handoff_rules` returned only the Baseline Needed route, so the result goes back to the requester (see the message sent).

## Revision RV-001 (2026-10-28): one "Waiting…" state

- Requested by: the Solution Designer (run `solution_designer_8dc321539e5e490ea700d6e7f58d14ff`), Project Task `autobyteus-320` (web UI cleanup round, item 3, was `autobyteus-196`; package `web-ui-cleanup-round`, REQ-005, REQ-006, AC-007, AC-008). App ticket folder: `/Users/normy/autobyteus_org/autobyteus-worktrees/web-ui-cleanup-round/tickets/in-progress/web-ui-cleanup-round/` (`requirements-doc.md`).
- Approval: the user, 2026-10-28 ("That's also fine if you want to change"; requirements DEC-004). No new design decision; recorded as an approved state change.
- Mode: Product Experience Design, evolving the accepted Embedding section in place.
- Worktree / branch: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/search-model-settings-waiting`, `design/search-model-settings-waiting`, from `origin/personal` `a0b6410395513288e453af5904fd0a9fa88f78ac`; the ticket folder was moved back to `tickets/in-progress/` while open.
- Runtime: dev server on port 4940 (stopped at closure); capture scripts and scratch output in `/tmp/sms-waiting/` (not committed except `visual-references/capture-waiting-references.mjs`); in-memory state, reset by reload. `node_modules` was a temporary symlink to the canonical checkout's, removed before the commit.
- Changed: the states table row "Project: Waiting" is one state, "Waiting…" (zh-CN "等待中…"); UXJ-005, TR-013, the copy list and the VIS-007/VIS-010 text follow. UI reference: `ProjectIndexesCard.vue`, `localization/messages/{en,zh-CN}/embeddingSettings.ts`. VIS-007 and VIS-010 recaptured; VIS-022 (zh-CN Waiting) added.
- Checked in the browser: model preparing (Gemma downloading, after Use this model + Index all): all three Projects read "Waiting…"; model ready (scenario `embedding_busy`, Release Notes): "Waiting…"; Index now on Prototype Launch: "Waiting…" then "Indexing 2 of 5"; zh-CN: "等待中…"; no other state changed.
- Limitations (recorded, not introduced here): the Embedding section's reference screenshots VIS-001…VIS-021 other than VIS-007 and VIS-010 were captured at ticket time and are not recaptured (the surrounding Settings sidebar and the default Projects list have since changed through other accepted tickets; this revision changes only the waiting text). `visual-references/final-validation.mjs` and `capture-references.mjs` use the ticket-time test ids (`search-*`) and no longer run against the current section (see `ui-reference-runbook.md`); only the one expectation that named the old wording was updated.
- Data origin: unchanged; all fixtures are invented.

## Integration Record — Revision RV-001

- Revision commit `a4e5674eb605324f323e93e51142d8ee115e9b4a` pushed to `origin/personal` as a fast-forward (`a0b6410..a4e5674`) and fast-forwarded into the canonical checkout; the default branch had not moved since the branch point (no merge needed).
- Default-entry check after integration (canonical checkout `personal`, `corepack pnpm dev --port 4941`, `/settings?section=server-settings&mode=embedding`, no preview-only state): model preparing + Index all → every Project "Waiting…"; `embedding_busy` → "Waiting…" with the model ready; Index now → "Waiting…" then "Indexing 2 of 5"; zh-CN → "等待中…"; no page errors. Neither "Waiting to start…" nor "Waiting for the model…" appears anywhere.
- Dev servers (4940, 4941) stopped; the revision worktree and branch removed. The final revision of the default branch is recorded in the result sent to the Solution Designer.
