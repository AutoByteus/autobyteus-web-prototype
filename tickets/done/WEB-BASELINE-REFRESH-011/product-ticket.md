# Product Ticket — WEB-BASELINE-REFRESH-011

## Identity And Scope

- Ticket / request ID: `WEB-BASELINE-REFRESH-011` (baseline ticket)
- Title: Refresh the AutoByteus Web baseline to `origin/personal@9227d61597`
- Status: `Completed` (accepted by Product 2026-10-20)
- Requester: Product UI/UX Designer, 2026-10-20, for the design `settings-update-notifications` (Project Task
  autobyteus-212).
- Reason, verified with git: `git diff 2f21134 origin/personal@9227d61597 -- autobyteus-web` changes 176
  files. The Settings page this design evolves changed: a Server Settings → **Embedding** sub-section
  (`pages/settings.vue`, `components/settings/embedding/*`, `ServerSettingsManager.vue`, the settings
  messages). Other UI changed too. A full refresh keeps the pin single.
- Refresh policy:
  - where the source implements a surface the UI reference changed, the source wins;
  - accepted design-only changes are kept (Reconnect; the design-only example layers).
- Previous pin: `2f211340ee36b81cef74a74b2e042b5102c269d3` (`WEB-BASELINE-REFRESH-010`).
- Runs in parallel with the design worktree `settings-update-notifications`, which merges this refresh
  before its final references.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-011`
- Ticket branch: `design/web-baseline-refresh-011`
- Accepted design base: `cb384e3` (`origin/personal`, 2026-10-20)
- Source: `autobyteus-web`, selected authority `origin/personal@9227d61597fd7ef8f6324fc9092be24ed1684c8a`
- Product acceptance result and date: `Accepted`, 2026-10-20 (see Product Acceptance)
- Integration target and result: `personal`, `Completed`: the refresh `788c230` plus the merge of the advanced default branch (`runtime-lifecycle-review`, `43d2d7d`), integrated as `15057b4`. Conflicts in the settings messages (en, zh-CN) were resolved as the source's file plus the 59 Agent Runtimes lines. The runbook keeps both sections. tsc 0, tests 20/20; Agent Runtimes and Embedding verified in the browser.
- Runtime isolation: the Bootstrapper uses free ports other than 3210 and 4681–4689 (design review).
- Cleanup result or blocker: `Completed`: preview server 4684 stopped, worktree removed, branch deleted.
- Ticket folder: `tickets/done/WEB-BASELINE-REFRESH-011/`

## Outcome And Handoff

- Bootstrapper result: `Completed` (Refresh), report `ui-baseline-report.md`, evidence
  `evidence/WEB-BASELINE-REFRESH-011/`.
- Next expected action: `settings-update-notifications` merges `personal`.

## Product Acceptance (2026-10-20)

- **Sync check (Product).** 15 files compared byte for byte with `9227d61:autobyteus-web/…`; all identical:
  - every file the active design touches: `pages/settings.vue`, `ServerSettingsManager.vue`,
    `ServerSettingsBasicsPanel.vue`, `AppLeftPanel.vue`, `LeftSidebarStrip.vue`, `app.vue`, `AppUpdateNotice.vue`,
    `appUpdateStore.ts`, and the settings messages (en, zh-CN);
  - `components/settings/embedding/*` and `composables/settings/*`.
  - This agrees with the Bootstrapper's audit: 1058 identical; 14 design-owned or Reconnect.
- **Data origin (Product).** `prototype/source-observation/embedding-fixtures.mjs` (168 lines) is hand-written:
  - three catalog entries with invented sizes;
  - invented Projects ("Marketing Site", "Support Portal", "Release Notes"), counts and reasons;
  - no copied user data or content, and no live service.
- **Browser (Product, port 4684).** Settings → Server Settings → Basics, Embedding (default: model list,
  Project indexes) and `/chat` render with no page errors. Basics carries the same cards as before.
- **Bootstrapper evidence reviewed:**
  - paired flows 56/56, and every regression suite passes;
  - matrix 113/114 (the known WBR-S012);
  - independent run 46/46;
  - tsc, lint, build, tests 20/20, boundaries 13/13.
- **Decisions on the Bootstrapper's questions:**
  1. Removing the design's search-settings simulation is correct: the source shipped the section, so the
     source wins. No design-only layer is wanted.
  2. The `search-model-settings` references (VIS-001–021) stay as that completed ticket's record of the
     approved design. They are not re-captured; the shipped section now governs.
  3. SRCH-002b's `search-pill-*` check is retired: the shipped status line has the same words and state without
     those hooks.
  4. Reconnect's collaborator case on delegated copies stays a carried-over open item, outside this ticket.
- **Runtime-isolation incident.** A broad `pkill -f "nuxt.mjs dev"` twice stopped the design review server on
  4681. The Bootstrapper now stops only its own processes, by PID or worktree path.
