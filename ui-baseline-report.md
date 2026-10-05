# UI Baseline Report

Refresh of the AutoByteus Web current-experience baseline from
`origin/personal@4dee901` to `origin/personal@10fb695` (v1.4.94-beta.5), for
Product ticket `WEB-BASELINE-REFRESH-007`. The previous report
(`WEB-BASELINE-REFRESH-006`, pin `4dee901`) is preserved in Git history at
accepted base `ab8b23d`.

## Status

- Status: `Completed`
- Request type: `Refresh`
- Result: the baseline mirrors `origin/personal@10fb695` and runs on its own in
  a browser with synthetic data. The one changed surface (Background Tasks
  shell commands) passed every paired check, the whole Background Tasks
  section was re-checked, and the unchanged surfaces passed the load-and-look
  route matrix.
- Next expected action: Product UI/UX Designer reviews and accepts the
  candidate, commits it on `design/web-baseline-refresh-007`, and integrates it
  into `personal`.

## Source Identity

- Source project: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend: `autobyteus-web`
- Source root: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Governing authority: `origin/personal`, selected by the user and re-fetched
  on 2026-10-05; it still equals the pin.
- Pinned revision: `10fb69504f99a615e0728ffdd6c1fcab0104ff05`
- Previous pin: `4dee901d6163ca7053916fa1edc295afbfd7a6da`
- The source checkout was not used for observation and was not modified.
- Source observation:
  - An exact `git archive` export of the pin at
    `/tmp/autobyteus-design-WEB-BASELINE-REFRESH-007/new/autobyteus-web`.
  - `node_modules` links the source install read-only, except the four
    `@autobyteus/*` contract packages, which link `git archive` exports of the
    same pin.
  - Served with
    `BACKEND_NODE_BASE_URL=http://127.0.0.1:4544 ENABLE_APPLICATIONS=true nuxt dev --host 127.0.0.1 --port 4543`.
  - Backed by `PROTOTYPE_MOCK_PORT=4544 node prototype/source-observation/mock-node.mjs`.

## Baseline & Repository Identity

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Product ticket: `WEB-BASELINE-REFRESH-007`
- Ticket branch: `design/web-baseline-refresh-007`
- Target worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-007`
- Accepted design base: `ab8b23d` (worktree `HEAD` `47c977a` is the Product
  ticket-open commit).
- Bootstrap candidate: uncommitted working-tree changes; the Bootstrapper
  created no commit.
  - `package.json` and `pnpm-lock.yaml` are unchanged.
- Install: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start: `corepack pnpm dev --port 4541`
- Review: `http://127.0.0.1:4541/chat`. Send a message, then open Activity.
  The populated command rows come from live stream snapshots, so they are
  reached in the checks by applying synthetic task snapshots through the
  source's own store, as in earlier refreshes.
- Ports `4541`–`4544`: all released.
- Scenario selection: unchanged.

## What Changed In The Refresh

Work followed the source diff `4dee901..10fb695`: 5 commits. The UI change is
`3467656` (feat(background-tasks): show the shell command of background
tasks).

- **Presentation synced to the pin:** 5 retained files updated:
  - `BackgroundTaskPanel.vue`
  - `backgroundTaskHandler.ts`
  - `protocol/messageTypes.ts`
  - `teamStreamDtoAdapters.ts`
  - `types/backgroundTask.ts`

  Afterwards, 979 design files that also exist in the source are
  byte-identical to the pin. The only exception is the design-owned
  `utils/apolloClient.ts`.
- **Vendored contracts:** the background-task message DTOs gained `command`.
  `agent-presentation-contracts` (`src` and `dist`) and
  `team-stream-contracts` (`dist`) were synced, and all four vendored
  packages match the pin.
- **Surface changed by the source:** a Background Tasks row now shows the
  task's exact command after its kind label, as "Shell · <command>":
  - The command is monospace, truncated to one line, and shows in full on
    hover.
  - Clicking expands or collapses it, independently of a finished task's
    summary.
  - It is omitted when the command is unknown, blank, or equal to the title.
- **Accepted design changes superseded:** none. **Design-only changes
  preserved:** none.

## Implementation Simplifications

| Visible capability | Visible experience preserved | Baseline simulation | Absent |
| --- | --- | --- | --- |
| Background task commands | Command after the kind label, truncation, hover title, expand/collapse, hidden when equal to the title, narrow layout | The source's own panel and store. As before, the checks apply the same four synthetic task snapshots (now with `command`) through the store on both sides | Agent stream, task runtime |
| Everything else | — | Unchanged from `WEB-BASELINE-REFRESH-006`; 72 Pinia snapshots re-captured at the pin | — |

Baseline-owned changes:

- `prototype/scripts/probe-chat-flows.mjs`:
  - New BGT-010–015 rows: commands, long-command expand and collapse,
    independence from the summary, zh-CN, and 390×844.
  - Default ports and evidence folder updated for this ticket.
- `prototype/scripts/validate-web-baseline-refresh-independent.mjs`: new
  IND-014 (command row expands in the built preview).
- `prototype/scripts/build-runtime-fixtures.mjs` and
  `prototype/tests/fixture-contract.test.ts`: the new pin.
- `prototype/fixtures/`: snapshots re-captured at the pin. Apart from capture
  timestamps they are unchanged, and no snapshot is pending.
- `README.md`: names the new pin.
- No fixture or mock data changed. The legacy scenario injector's synthetic
  tasks carry no command and render as before.

## Validation

Every paired run used headless Chrome with the same viewport, locale, UTC
timezone, light theme, reduced motion and synthetic data, with external
requests blocked. A row passes only if visible text and route are identical,
the screenshot differs at most by edge anti-aliasing or compositing rounding,
and the prototype shows no browser error and makes no non-local request.

Evidence root:
`/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-007/evidence/WEB-BASELINE-REFRESH-007/`.

- **Background Tasks (`probe-chat-flows.mjs`)**: 16/16 pass, all
  pixel-identical. Evidence: `chat-flows/`.
  - BGT-010–015 are new: command rows, expand, collapse, independent of the
    summary, zh-CN Team run, and 390×844.
  - BGT-001–009 re-check the rest of the section.
  - CHT-017 re-checks the chat run it lives in.
  - BGT-015 first failed identically on both sides because the script used
    the desktop tab, which a narrow screen doesn't have. The fixed row
    (Activity button in the narrow rail) passed:
    `flow-results-bgt-015.json`.
- **Route and state matrix** (load-and-look): 97/97 pass, 73 pixel-identical.
  Evidence: `matrix/`.
- **Independent run** (built preview on `:4542`, source and observation node
  stopped): IND-001–014 pass 14/14, with zero browser errors and zero
  non-local requests. Evidence: `independent-preview/`.
- **Checks:** `pnpm typecheck`, `lint`, `test` (3 files, 14 tests),
  `validate:boundaries` and `build` all pass.
- **Presentation audit:** 979 design files byte-identical to the pin; the
  contracts match the pin.
- **Not re-run, because nothing they depend on changed:** the workspace,
  Projects, `@` mention, skill-source and Token flows, and the mobile and
  desktop-host rows.
- The evidence folder is 16 MB.

## Refresh Reconciliation

- Pins: `4dee901` → `10fb695`.
- Surface changed: Background Tasks rows (shell command). Nothing was added or
  removed.
- Accepted design changes superseded: none. Design-only changes preserved:
  none.
- Unchanged surfaces given a load-and-look pass: the full route and state
  matrix.

## Known Gaps And Next Action

- **Carried over, unchanged:** the legacy `workspace_*`/`mobile_*` scenario
  injector is still broken, and MOB-001–014 and the desktop-host rows were not
  re-run.
- **Remaining UI parity differences inside the verified scope:** none.
- **Recommended next action for `product_ui_ux_designer`:** accept, commit on
  `design/web-baseline-refresh-007`, and integrate into `personal`.
