# UI Baseline Report

Focused refresh of the AutoByteus Web current-experience baseline for Product
ticket `delegated-copy-task-locator`. The Projects Task-status surfaces now
follow `origin/personal@ff227eb` (Cancelled Task status). Everything else stays
at `origin/personal@1cd1a3a`. The previous report (`WEB-BASELINE-REFRESH-008`,
pin `1cd1a3a`) is kept in Git history at accepted base `dd89b84`.

## Status

- Status: `Completed`
- Request type: `Refresh` (focused)
- Refresh request: Product UI/UX Designer, 2026-10-11, "Baseline Needed / Refresh".
  Selected source authority: `origin/personal@ff227eb72ef08dca4188451141789d0e6d3af356`
  (fetched 2026-10-11), only for the Projects Task-status surfaces. Explicit
  source constraint: none.
- Result: the baseline now has the source's CANCELLED Task status. This covers the
  "Cancelled (N)" toggle, the Cancelled lane (last, after Done), the Cancelled
  pills, and open counts that leave Cancelled out. These appear on the full
  Projects pages and in the right panel's compact Projects tab. All 38 paired
  Cancelled-status flows pass, with identical text, route, element probe and
  screenshot (allowing only anti-aliasing noise). The 44 Projects regression
  flows also pass. Their only remaining differences are accepted design-only
  changes (see Refresh Reconciliation).
- Next expected action: Product UI/UX Designer reviews and accepts the candidate,
  commits it on `design/delegated-copy-task-locator`, and continues the ticket on it.

## Source Identity

- Source project: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend: `autobyteus-web`
- Source root: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Governing authority: `origin/personal`, fetched 2026-10-11, equal to the new pin.
- **Mixed pin:**
  - Projects Task-status surfaces: `ff227eb72ef08dca4188451141789d0e6d3af356` (2026-10-10).
  - Everything else: `1cd1a3abc126df820e334c023621d0fb82de5b7b` (unchanged).
- The source checkout was neither used for observation nor modified. Its local
  `personal` is 32 commits behind `origin/personal`, and it has unrelated
  uncommitted changes. Nothing was pulled.
- Applicable instructions: superrepo `AGENTS.md` (`DESIGN.md`, `TESTING.md`), the
  design repository `README.md`, and `ui-reference-runbook.md`.
- Source observation:
  - Exact `git archive` export of `ff227eb` (`autobyteus-web` and the four
    `@autobyteus/*` contract packages, whose `dist/` is committed) at
    `/tmp/autobyteus-design-delegated-copy-task-locator/src/`.
  - `node_modules` entries link the source install read-only. `@autobyteus/*` links
    the exported contracts at `ff227eb`.
  - Served with `BACKEND_NODE_BASE_URL=http://127.0.0.1:4623 ENABLE_APPLICATIONS=true nuxt dev --host 127.0.0.1 --port 4622`.
  - Backed by `PROTOTYPE_MOCK_PORT=4623 node prototype/source-observation/mock-node.mjs`
    (synthetic fixtures only, run from the ticket worktree).

## Baseline & Repository Identity

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Product ticket: `delegated-copy-task-locator`
- Ticket branch: `design/delegated-copy-task-locator`
- Target worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/delegated-copy-task-locator`
- Accepted design base: `dd89b84e70ad72afe6f847c229c17b1622b1da53`. Worktree
  `HEAD` `06d3c32` is the Product ticket-open commit.
- Bootstrap candidate: uncommitted working-tree changes. The Bootstrapper made no
  commit. `package.json` and `pnpm-lock.yaml` are unchanged.
- Install: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start: `corepack pnpm dev --port 4620`
- Review URLs: `http://127.0.0.1:4620/projects/project-prototype-launch`,
  `/projects/temp-tasks`, `/workspace` → right panel **Projects**.
- Built preview: `corepack pnpm build && PORT=4621 HOST=127.0.0.1 node .output/server/index.mjs`
- Ports `4620`–`4623` are all released.
- Scenario selection: unchanged (`autobyteus.prototype.scenario`,
  `autobyteus.prototype.context`; `autobyteus.prototype.designOnlyLayers=off` is
  used only by comparison scripts). A reload resets every in-memory change.
- Framework: unchanged (Nuxt 3, Vue 3, TypeScript, Tailwind). Source presentation
  code is retained.

## Experience Boundary

- Included: the surfaces rendered by the files Product named, on full pages and
  in the compact right-panel Projects tab:
  - `CancelledTasksToggle.vue` (new)
  - `ProjectTaskBoard.vue` and `TempTaskBoard.vue`
  - `ProjectTaskDetail.vue` and `TempTaskDetail.vue`
  - `TempTasksLink.vue` and `ProjectCard.vue`
  - `panel/ProjectsPanelTaskDetail.vue`
  - `utils/projects/taskStatusPresentation.ts` (replaces `taskStatusLabelKey.ts`)
  - `types/project.ts`, `stores/projectTaskStore.ts`
  - the en/zh-CN `projects` messages
- Excluded on purpose (they stay at `1cd1a3a`): the skills dialog, composer context
  files, chat, and mention candidates. This includes the
  `GetCollaboratorMentionCandidates` `focusedAgentRunId` change in
  `generated/graphql.ts` and the `collaborator-mention-note` contract change.
- Contexts: desktop 1440×900 en is primary. zh-CN and 390×844 are sampled. The
  compact panel has its own rows because its container is narrower than 752 px,
  so lanes stack in one column there.

## What Changed In The Refresh

Work followed the source diff `1cd1a3a..ff227eb` for the selected files. The
relevant commits are `17e4299` (add CLOSED), `814e41a` (Closed lane as the last
column) and `7f7b2c8` (rename CLOSED → CANCELLED). `c387ce7` and `24baaf7` touched
only docs and tests, or excluded surfaces.

| Surface | Source change now in the baseline |
| --- | --- |
| Project board (page and compact tab) | "Cancelled (N)" toggle before Refresh, only when the board has Cancelled Tasks. `aria-pressed`, title "Show/Hide cancelled tasks", `bg-white`/`bg-slate-100`. When on, a Cancelled lane appears after Done and the grid has 4 columns (≥752 px container). Cancelled Tasks are hidden from lanes and search while off. "No match" appears when only hidden Tasks match. Every visit starts with the toggle off. |
| Temp tasks board (page and compact tab) | Same toggle. Lanes Open, Done, then Cancelled (3 columns when on). |
| Project Task page | Status pill colours from `taskStatusPillClass` (Cancelled: `bg-white text-slate-500`). |
| Temp task page | Pill label and colour by lane (Open / Done / Cancelled). |
| Right-panel Task view | Pill now has `ring-1 ring-inset` plus status colours, for Project and Temp tasks (previously plain `bg-slate-100`). |
| Projects list | Card open count and Temp tasks count leave Done and Cancelled out. |
| Messages (en, zh-CN) | `projects.task.status.CANCELLED`, `projects.board.cancelledToggle` ("Cancelled ({{count}})" / "已取消（{{count}}）"), `showCancelled`, `hideCancelled`, `projects.temp.lane.cancelled`. |

Implementation sync (audit: `evidence/delegated-copy-task-locator/presentation-audit.json`):

- The 13 named files are byte-identical to `ff227eb`. Before the refresh, all of
  them were byte-identical to `1cd1a3a`, so no design change was overwritten.
- `utils/projects/taskStatusLabelKey.ts` was removed, as in the source. No other
  baseline file imported it or `PROJECT_TASK_STATUSES`.
- `generated/graphql.ts`: only the `ProjectTaskStatus.Cancelled` enum member was
  taken from `ff227eb`.
- Offline icon bundle: `heroicons:archive-box` was added
  (`prototype/scripts/build-icon-collections.mjs`).

## UI Experience Inventory (checked now)

All rows were checked in this refresh with paired source and baseline runs
(`prototype/scripts/probe-cancelled-status.mjs`). Task descriptions, counts and
root names are illustrative synthetic values. All UI-controlled text is exact,
including "Cancelled ({{count}})", the titles and the pill labels.

| ID | Surface | State / outcome | Fixture | Result |
| --- | --- | --- | --- | --- |
| CAN-001 | Project board | Toggle shown, off: `aria-pressed=false`, title "Show cancelled tasks", 3 lanes (To Do, In Progress, Done), Cancelled Task hidden | `project-prototype-launch`, `task-retire` | `Pass` (exact) |
| CAN-002 / 003 | Project board | Toggle on: `aria-pressed=true`, title "Hide cancelled tasks", Cancelled lane last, 4 columns. Toggle off again: back to 3 | same | `Pass` (exact) |
| CAN-004 / 005 | Project board | Hover; keyboard Tab from search onto the toggle, then Space turns it on (focus ring, `bg-slate-100`) | same | `Pass` (exact) |
| CAN-006 / 007 | Project board | Search that matches only the hidden Task shows "No tasks match" (toggle still present). With the toggle on, the match appears in the Cancelled lane | query `banner` | `Pass` (exact) |
| CAN-008 / 009 | Project board → Task page | A Cancelled card opens its page. "Back to tasks" returns with the toggle off again (every visit starts hidden) | same | `Pass` (exact) |
| CAN-010–013 | Project Task page | Pills: Cancelled (with closed agent root), To Do, In Progress, Done | four Tasks | `Pass` (exact) |
| CAN-014 | Project board, no Cancelled Tasks | Delete the only Cancelled Task: board without the toggle, Refresh keeps `ml-auto` | in-memory delete | `Pass` (edge AA) |
| CAN-020 | Projects list | Card shows 3 open Tasks; Temp tasks link shows 2 (Done and Cancelled left out) | counts illustrative | `Pass` (edge AA) |
| CAN-030 / 031 | Temp tasks board | Toggle off: Open and Done lanes. Toggle on: Cancelled lane last, 3 columns | `temp-task-faq` | `Pass` |
| CAN-032 / 033 | Temp tasks board | Search that matches only the hidden task shows No match. Toggle on shows it | query `FAQ` | `Pass` (exact) |
| CAN-034 / 035 | Temp task page | Cancelled pill; Open pill | — | `Pass` (exact) |
| CAN-036 | Temp tasks board, no Cancelled Tasks | Empty scenario: no toggle | `empty` scenario | `Pass` (edge AA) |
| CAN-040 / 041 | Right panel Projects tab | Compact board with toggle off and on. Single-column stack with Cancelled last; toggle before Refresh | — | `Pass` |
| CAN-042–045 | Right panel Task view | Pills with ring: Cancelled, To Do, In Progress, Done | — | `Pass` (exact) |
| CAN-046–050 | Right panel Temp tasks | Toggle off and on; Cancelled Temp task pill; Open pill; search with only hidden matches | — | `Pass` (exact) |
| CAN-060–062 | zh-CN | Board toggle on and off ("已取消（1）", "显示/隐藏已取消的任务"); Temp Cancelled page ("已取消") | — | `Pass` |
| CAN-070 / 071 | 390×844 | Project and Temp boards with toggle on, single column | — | `Pass` (see Reconciliation for the design-only strip icon) |

Each row compares body text, route, screenshot, and an element probe that must be
identical on both sides. The probe covers:

- the toggle's `aria-pressed`, title, text, rect, and computed background, colour,
  border, radius, padding, font, min-height, gap and margin-left;
- the Refresh button;
- the lane container's `grid-template-columns` and the lane order;
- every status pill's text, rect, and computed background, colour and box-shadow;
- the No match text;
- the focused element.

Results: `evidence/delegated-copy-task-locator/cancelled-status/flow-results-final.json`
(38/38; 31 pixel-identical, 7 edge anti-aliasing only).

Items not checked now keep their accepted evidence from `WEB-BASELINE-REFRESH-008`
and earlier refreshes (see the previous report in Git history).

## Implementation Simplifications

| Visible capability | Visible experience preserved | Baseline simulation | Absent |
| --- | --- | --- | --- |
| Task status (agent-set) | Lanes, toggle, pills, counts | Fixture statuses. The UI has no status control, as in the source | Task status changes by agents (the change feed stays silent) |
| Cancelled toggle | Off on every visit, on/off, reset when the count reaches 0 | The source component's own local state | — |
| Deleting a Task | Board without the toggle afterwards | In-memory fixture delete, reset on reload | Persistence |

- Reused presentation: the 13 source files above, unchanged.
- Baseline-owned changes:
  - `prototype/source-observation/fixtures.mjs`:
    - `task-retire`: "Retire the unused synthetic welcome banner.", CANCELLED,
      closed agent root `/documentation_writer`.
    - `temp-task-faq`: "Draft a synthetic FAQ for the paused pilot.", CANCELLED.
    - Project `taskCount` 5. `openTaskCount` counts only TODO and IN_PROGRESS, as
      `isOpenTaskStatus` does.
  - `plugins/00.prototype-state.client.ts`: in a non-default scenario, a
    `/projects/*` sub-page uses that scenario's captured `/projects` shell
    snapshot. Before, it fell back to the populated shell, so the empty-scenario
    left panel listed workspaces where the source shows "No run history yet."
    Projects and Task stores still load through the source code.
  - `prototype/tests/fixture-contract.test.ts`: covers the CANCELLED statuses and
    the new counts.
  - `prototype/scripts/probe-cancelled-status.mjs` (new paired probe).
  - `prototype/scripts/validate-web-baseline-refresh-independent.mjs`:
    - IND-023 and IND-024 added.
    - IND-012 updated to the accepted `skill-sources-dialog-redesign` add flow.
      The old GitHub/Import buttons no longer exist in the accepted design.
  - `mock-boundaries.md`: new section.
- Mock data origin: every new value is invented and hand-written. No snapshot was
  re-captured. `runtime-state.json` and `source-state-snapshots.json` are
  unchanged. The Projects and Task stores never read snapshots. Real source
  content was not copied.
- Independence and repeatability: no live service. A reload or scenario switch
  resets the in-memory delete.
- Retained production code: none beyond the source presentation and stores that
  the baseline already ran.

## Validation

- Browser: Google Chrome 154.0.8037.98, headless via playwright-core.
- Matched conditions: same viewport, locale, UTC, light theme, reduced motion and
  synthetic node, with external requests blocked and design-only data off.
- Viewports: 1440×900 (primary) and 390×844. Locales: en (primary), zh-CN (sampled).
- Paired Cancelled-status flows: 38/38 pass (above).
- Regression flows re-run because the board, store or pills they render changed:
  - `regression-004/` (Projects/Tasks authoring PRJ-001–015, TSK-001–012): 26/27
    pass. TSK-011 (narrow New task) differs only by the design-only strip icon.
  - `regression-008/` (Projects tab, Task roots, Temp tasks, path-only workspaces
    PRJ-001–007, 010–016, 020–022): 14/17 pass. PRJ-006, PRJ-012 and PRJ-013
    (a run opened beside the board) differ only by the design-only Chat-row
    highlight.
  - Measured diff boxes: `evidence/delegated-copy-task-locator/design-only-differences.json`.
  - The mention, run-config and agent-run rows of `probe-refresh-004.mjs` were not
    re-run, because they belong to excluded surfaces that changed at `ff227eb`.
- Independent run (`independent-preview/`): built preview on `:4621` with the
  source and observation node stopped. IND-001–024 pass 24/24, with zero browser
  errors and zero non-local requests.
- Checks, all passing:
  - `vue-tsc --noEmit -p tsconfig.prototype.json`: exit 0
  - `pnpm lint`: exit 0
  - `pnpm test`: 3 files, 15 tests
  - `validate:boundaries`: 13/13
  - `pnpm build`: exit 0
- Evidence root: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/delegated-copy-task-locator/evidence/delegated-copy-task-locator/` (14 MB).

## Refresh Reconciliation

- Pins: `1cd1a3a` → mixed. Projects Task-status surfaces are at `ff227eb`;
  everything else stays at `1cd1a3a`.
- Accepted design changes superseded by the source: none. The 13 files had no
  design changes.
- Accepted design-only changes preserved (no source equivalent):
  - `collapsed-left-panel-expand-keeps-run`:
    - The narrow strip's Workspaces icon and divider after Nodes. In CAN-070/071
      they are hidden on the baseline side only for the screenshot; they sit after
      every source item, so nothing else moves.
    - Chat lit only on New chat, never on an open run.
  - `skill-sources-dialog-redesign`: unaffected, apart from the IND-012 script update.
  - `agent-definition-reconnect-ui`: unaffected (IND-022 passes).
- Unchanged surfaces given a load-and-look pass: the independent-run set
  IND-001–022 (chat, run, Team/Org, skills, agents, Projects authoring, Background
  Tasks, Codex Fast, Draft rows, Org launch, Archive all, Reconnect).

## Known Gaps And Next Action

- Blocked or incomplete inventory IDs: none.
- Source observation to note (not a parity gap):
  - The `ring-*` colour of the status pills is defined only in
    `utils/projects/taskStatusPresentation.ts`.
  - The source's `tailwind.config.js` content globs do not scan `utils/`, so
    utilities such as `ring-slate-300` are generated only if a scanned file also
    uses them.
  - The Cancelled pill (CAN-010, CAN-042) therefore shows Tailwind's default blue
    ring at 50 % in the source. The baseline uses the same config, so it
    reproduces this exactly.
  - Product may want to raise this with Software Engineering.
- Simulated, not compared: the toggle resetting when a live change makes the
  count 0 while the toggle is on. The change feed is silent, so nothing reaches
  this state without navigation. The delete journey (CAN-014) remounts the board.
- Carried over, unchanged: the gaps listed in the previous report (legacy
  `workspace_*`/`mobile_*` injector rows, MOB rows and older desktop-host rows not
  re-run; Team/Org launch outcome scripted).
- Remaining UI parity differences inside the selected scope: none.
- Recommended next action for `product_ui_ux_designer`: review the candidate,
  commit it on `design/delegated-copy-task-locator`, and continue the ticket on
  the refreshed baseline.
