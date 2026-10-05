# UI Baseline Report

Refresh of the AutoByteus Web current-experience baseline from
`origin/personal@0a32261` to `origin/personal@4dee901` (v1.4.94-beta.5), for
Product ticket `WEB-BASELINE-REFRESH-006`. It replaces the withdrawn
`WEB-BASELINE-REFRESH-005`; nothing from that worktree was reused. The previous
report (`WEB-BASELINE-REFRESH-004`, pin `0a32261`) is preserved in Git history
at accepted base `8fdf0b7`.

## Status

- Status: `Completed`
- Request type: `Refresh`
- Result: the baseline mirrors `origin/personal@4dee901` and runs on its own in
  a browser with synthetic data. Every new or changed surface passed its paired
  source/baseline check, the dependent earlier journeys were re-checked, and
  the unchanged surfaces passed the load-and-look route matrix.
- Next expected action: Product UI/UX Designer reviews and accepts the
  candidate, commits it on `design/web-baseline-refresh-006`, and integrates it
  into `personal`. `run-settings-ui-unification` is then rebased onto the
  refreshed `personal` and revalidated.

## Source Identity

- Source project: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend: `autobyteus-web`
- Source root: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Governing authority: `origin/personal`, selected by the user and re-fetched
  on 2026-10-05; it still equals the pin.
- Pinned revision: `4dee901d6163ca7053916fa1edc295afbfd7a6da`
  (2026-10-05 04:51 +0200)
- Previous pin: `0a32261d681e19491264a03a652ba23d1f8b8248`
- The source checkout was not used for observation and was not modified.
- Applicable instructions: `autobyteus-web/AGENTS.md`, design repository
  `README.md` and `ui-reference-runbook.md`.
- Source observation:
  - An exact `git archive` export of the pin at
    `/tmp/autobyteus-design-WEB-BASELINE-REFRESH-006/new/autobyteus-web`.
  - Its `node_modules` links the source install read-only, except the four
    `@autobyteus/*` contract packages, which link `git archive` exports of the
    same pin (`application-sdk-contracts` built from its pinned `src`).
  - Served with
    `BACKEND_NODE_BASE_URL=http://127.0.0.1:4544 ENABLE_APPLICATIONS=true nuxt dev --host 127.0.0.1 --port 4543`.
  - Backed by the synthetic observation node:
    `PROTOTYPE_MOCK_PORT=4544 node prototype/source-observation/mock-node.mjs`.

## Baseline & Repository Identity

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Product ticket: `WEB-BASELINE-REFRESH-006`
- Ticket branch: `design/web-baseline-refresh-006`
- Target worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-006`
- Accepted design base: `8fdf0b7` (worktree `HEAD` `a721044` is the Product
  ticket-open commit on top of it).
- Bootstrap candidate: uncommitted working-tree changes; the Bootstrapper
  created no commit.
  - `package.json` and `pnpm-lock.yaml` are unchanged.
  - The canonical checkout and other worktrees were not touched.
- Install: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start: `corepack pnpm dev --port 4541`
- Review URLs: `http://127.0.0.1:4541/skills` (press Sources) and
  `http://127.0.0.1:4541/workspace`
- Ports reserved for this ticket: dev `4541`, built preview `4542`, source
  `4543`, observation node `4544`. All are released.
- Stack: Nuxt 3, Vue 3, TypeScript, Pinia, Tailwind (unchanged).
- Scenario selection: unchanged (`localStorage['autobyteus.prototype.scenario']`
  and `autobyteus.prototype.context`, then reload).
  - New scenario `skill_source_issues`.
  - Skill-source edits live in one in-memory copy per browser context; a
    reload resets them.

## What Changed In The Refresh

Work followed the source diff `0a32261..4dee901`: 63 commits and 38
`autobyteus-web` files, of which 22 are outside tests, docs and tickets. The
four contract packages did not change.

- **Presentation synced to the pin:**
  - 20 retained files updated and 1 new file added; nothing was deleted.
  - Afterwards, 979 design files that also exist in the source are
    byte-identical to the pin. The only exception is the design-owned
    `utils/apolloClient.ts`.
  - Before the sync, the design repository had no presentation change on top
    of the previous pin, so there was nothing to reconcile.
- **Surfaces the source added or changed:**
  - **Managed skill sources** (`c6c4afb`). The Skills › Sources dialog now
    lists Default, Local folder and GitHub sources with:
    - the source's status (up to date, update available, check failed, update
      failed, incomplete removal);
    - its installed, latest and checked metadata and last error;
    - per-source actions: Check again, Update (with a whole-source
      confirmation), Remove (delete confirmation for GitHub, unlink
      confirmation for a local folder) and Retry removal.
    - The add form has Local folder and GitHub modes, a trust hint, and
      success and error notices.
  - **Event-monitor browse mode** (`bccb1c0`, `782ec9f`):
    - Agent-to-agent deliveries render as "From <Sender>:" rows.
    - A task Agent of a standalone run loads its earlier events from the host's
      collaboration package.
    - The run's own agent reads as its title name, for example
      "From Research Assistant:" and "to Research Assistant".
  - **Token tab:** a standalone run shows usage including its collaborators
    and task copies (`GetStandaloneRunTokenUsageSummary`).
  - **Skill detail:** re-registers its file workspace when the skill's root
    path changes (no visible change with a fixed catalog).
  - **Delivery header:** now also carries `sender address`; both forms parse.
- **Accepted design changes superseded by the source:** none.
  **Preserved design-only changes:** none.

## Implementation Simplifications

| Visible capability | Visible experience preserved | Baseline simulation | Absent |
| --- | --- | --- | --- |
| Skill sources | Dialog, every source status, actions, confirmations, notices, validation, narrow layout | The source's own `skillSources` store runs unchanged; `utils/apolloClient.ts` answers the query and the add/remove/import/check/update/remove-GitHub mutations from one in-memory copy of `fixtures.mjs` data. Checks are scripted: each source keeps its fixed synthetic status | GitHub access, downloads, the managed copy on disk |
| Task Agent browse pages | Scroll-up loading, "From <Sender>:" rows, jump to latest | `GetAgentRunCollaborationMemberEventMonitorActiveTracePage` fixture: two earlier events plus the current window | Event store |
| Token tab | Stored Agent run roll-up, task Agent, Team member, Org member, chat run | The source's own `tokenUsageMeter` store runs against the existing synthetic summaries plus `GetStandaloneRunTokenUsageSummary` | Usage ingestion |
| Everything else | — | Unchanged from `WEB-BASELINE-REFRESH-004`; 72 Pinia snapshots re-captured at the pin | — |

Baseline-owned changes:

- `plugins/00.prototype-state.client.ts`: `skillSources` and `tokenUsageMeter`
  now join the stores that run the source's own code.
  - The old prototype rule that made `fetchAgentRunSummary`,
    `fetchTeamRunSummary` and `fetchTeamMemberSummary` throw was removed.
  - **Correction of an older difference.** That rule had made the Token tab of
    a stored Team member show "Token usage is temporarily unavailable", while
    the source shows the synthetic usage. For an Org member it was the
    reverse: the baseline said "No token usage has been reported" where the
    source shows "temporarily unavailable".
  - No earlier check covered these tabs. This refresh found the difference
    because the token meter store changed, and now checks it (TOK-004,
    TOK-005).
- `utils/apolloClient.ts`: answers the skill-source mutations and resets their
  in-memory copy with the scenario.
- `prototype/source-observation/fixtures.mjs` and `mock-node.mjs`, all small,
  hand-written synthetic values:
  - skill sources: default, local folder and three GitHub repositories;
    `skill_source_issues` adds update-failed and incomplete-removal sources;
    in-memory import, check, update and remove, plus a scripted error for an
    invalid repository URL;
  - the task Agent's earlier-events page and `hasEarlierActiveTraceEvents`;
  - a longer synthetic reply so the task Agent's conversation can scroll;
  - the standalone token summary;
  - the `sender address` header in the two stored deliveries.
- `prototype/fixtures/`: `source-state-snapshots.json` and
  `runtime-state.json` re-captured at the pin (72 snapshots, unchanged set).
- Scripts:
  - New `prototype/scripts/probe-refresh-006.mjs` (SKS, BRW and TOK rows).
  - `validate-web-baseline-refresh-independent.mjs` gained IND-012 and
    IND-013.
  - `build-runtime-fixtures.mjs` names the new pin.
- `prototype/tests/fixture-contract.test.ts`: the new pin, plus an in-memory
  skill-source test.
- Docs: `README.md`, `prototype-scenarios.md` and `mock-boundaries.md`.

Data boundary:

- Sizes: `fixtures.mjs` 80 KB, `icon-collections.json` 68 KB,
  `runtime-state.json` 3.5 MB and `source-state-snapshots.json` 5.5 MB.
- The two snapshot files are the established capture of the source running
  against the synthetic node, so they hold fixture values only.
- No source data was recorded or copied.

## Validation

Every paired run used headless Chrome with the same viewport, locale, UTC
timezone, light theme, reduced motion and synthetic data, with external
requests blocked. The observation node's data was restored before every run.
A row passes only if:

- visible text and route are identical;
- the screenshot differs at most by edge anti-aliasing or compositing rounding;
- the prototype shows no browser error and makes no non-local request.

Evidence root:
`/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-006/evidence/WEB-BASELINE-REFRESH-006/`.

- **Changed surfaces (`node prototype/scripts/probe-refresh-006.mjs`)**: 24/24
  pass, all pixel-identical, with matching text and routes. Evidence:
  `refresh-flows/`.
  - Skill sources (SKS-001–016):
    - the dialog and its scrolled list; GitHub mode;
    - importing a repository, and rejecting an invalid URL;
    - adding a local folder; Check again;
    - the Update confirmation and the confirmed update with its success notice;
    - the GitHub Remove confirmation, confirmed removal, and the local-folder
      unlink confirmation;
    - the update-failed and incomplete-removal states, and Retry removal;
    - Done, and the narrow layout.
  - Browse mode (BRW-001–003): the scrollable task Agent conversation;
    scrolling up loads the earlier page from the host package with
    "From Research Assistant:" rows; jump to latest.
  - Token tab (TOK-001–005): the stored Agent run roll-up, the task Agent, the
    chat run, a stored Team member and a stored Org member.
- **Dependent journeys re-checked** (the collaboration store changed):
  `probe-refresh-004.mjs MEN AGR`, 15/15, all pixel-identical. Evidence:
  `refresh-004-regression/`.
- **Chat flows:** 47/47, all pixel-identical. Evidence: `chat-flows/`.
- **Workspace and catalog flows:** 13/13 (12 pixel-identical, 1 anti-aliasing
  only). Evidence: `flows/`.
- **Route and state matrix** (load-and-look):
  - Result: 97/97 pass, 72 pixel-identical; the rest are anti-aliasing or
    compositing noise with identical text, controls and geometry. Evidence:
    `matrix/`.
  - The first matrix run failed `/nodes?tab=manage`: the source-state capture
    had recorded that route before the source app finished booting
    (`bootstrapPending`), so the baseline showed its startup gate. The capture
    was redone (no pending snapshot remains); the matrix and the changed-surface
    probe were rerun on a fresh dev server, and these are the recorded results.
  - The chat, workspace and dependent-journey suites ran against the first
    capture, whose only defect was that one `/nodes` snapshot.
- **Production preview spot check:**
  - Ran SKS-001, SKS-009, BRW-002 and TOK-001 against the built preview
    (`:4542`), source still running.
  - Result: 4/4 pass, anti-aliasing only. Evidence: `preview-spotcheck/`.
- **Independent run** (`validate-web-baseline-refresh-independent.mjs`):
  - Command: `PORT=4542 HOST=127.0.0.1 node .output/server/index.mjs`, with
    the source and the observation node stopped.
  - Checked: IND-001–011, plus IND-012 (import a GitHub skill source) and
    IND-013 (task Agent Token tab).
  - Result: 13/13, zero browser errors and zero non-local requests. Evidence:
    `independent-preview/`.
- **Checks, all pass:**
  - `pnpm typecheck` (only the usual duplicate auto-import warnings);
  - `pnpm lint`;
  - `pnpm test` (3 files, 14 tests);
  - `pnpm validate:boundaries`;
  - `pnpm build`.
- **Presentation audit:** 979 design files that also exist in the source are
  byte-identical to the pin; the only exception is `utils/apolloClient.ts`.
- **Not re-run:** MOB-001–014 and the desktop-host rows (see Known Gaps).
- **Servers and evidence:** no server is left running; the evidence folder is
  31 MB.

## Refresh Reconciliation

- Pins: `0a32261` → `4dee901`.
- Surfaces added, changed or removed: see "What Changed In The Refresh".
  Nothing was removed.
- Accepted design changes superseded by the source: none.
- Accepted design-only changes preserved: none.
- Unchanged surfaces given a load-and-look pass: the full route and state
  matrix.
- Re-checked dependent journeys: the `@` mention and Agent-run task-row
  journeys (the collaboration store changed), the workspace and catalog flows,
  and the chat flows.

## Known Gaps And Next Action

- **Carried over, unchanged:** the legacy `workspace_*`/`mobile_*` scenario
  injector is still broken (it was already broken before
  `WEB-BASELINE-REFRESH-003`). MOB-001–014 and the desktop-host rows were not
  re-run, and none of their dependencies changed in this diff.
- **Not simulated, as in the source against the synthetic node:** real GitHub
  checks and downloads; live streaming, which is what moves a run's usage on.
- **Remaining UI parity differences inside the verified scope:** none.
- **Recommended next action for `product_ui_ux_designer`:**
  1. Accept the candidate and confirm the Token tab correction.
  2. Commit and integrate into `personal`.
  3. Rebase `run-settings-ui-unification` onto it. That ticket touches the
     collaboration surfaces; note the host-name labels ("From Research
     Assistant:", "to Research Assistant") that shipped in this pin.
