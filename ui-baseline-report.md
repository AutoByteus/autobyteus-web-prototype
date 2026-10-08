# UI Baseline Report

Refresh of the AutoByteus Web current-experience baseline from
`origin/personal@10fb695` (v1.4.94-beta.5) to `origin/personal@1cd1a3a`
(v1.4.99-beta.1), for Product ticket `WEB-BASELINE-REFRESH-008`. The previous
report (`WEB-BASELINE-REFRESH-007`, pin `10fb695`) is preserved in Git history at
accepted base `afed67a`.

## Status

- Status: `Completed`
- Request type: `Refresh`
- Refresh request: explicit user instruction (2026-10-08): "I think the UI is not
  up to date ... the real application has the projects tab on the left side of
  files." Source authority `origin/personal@1cd1a3abc126df820e334c023621d0fb82de5b7b`
  (fetched 2026-10-08). Policy: the source wins where it implements a surface
  the UI reference had changed; accepted design-only changes are preserved.
- Result: the baseline mirrors `1cd1a3a` and runs on its own in a browser with
  synthetic data. Every new or changed surface passed paired source-versus-baseline
  checks, and the full route and state matrix passed. The accepted design-only
  Reconnect change is preserved and passes its own review scripts.
- Next expected action: Product UI/UX Designer reviews and accepts the
  candidate, commits it on `design/web-baseline-refresh-008`, integrates it into
  `personal`, and resumes `collapsed-left-panel-expand-keeps-run` on it.

## Source Identity

- Source project: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend: `autobyteus-web`
- Source root: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Governing authority: `origin/personal`, re-fetched 2026-10-08; equal to the pin.
- Pinned revision: `1cd1a3abc126df820e334c023621d0fb82de5b7b`
- Previous pin: `10fb69504f99a615e0728ffdd6c1fcab0104ff05`
- The source checkout was neither used for observation nor modified (its local
  `personal` is behind `origin/personal`; nothing was pulled).
- Source observation:
  - Exact `git archive` export of the pin at
    `/tmp/autobyteus-design-WEB-BASELINE-REFRESH-008/new/autobyteus-web`.
  - `node_modules` links the source install read-only. The four
    `@autobyteus/*` contract packages link the worktree's vendored copies, which
    are byte-identical to the pin's sources.
  - Served with
    `BACKEND_NODE_BASE_URL=http://127.0.0.1:4623 ENABLE_APPLICATIONS=true nuxt dev --host 127.0.0.1 --port 4622`.
  - Backed by `PROTOTYPE_MOCK_PORT=4623 node prototype/source-observation/mock-node.mjs`
    (synthetic fixtures only).

## Baseline & Repository Identity

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Product ticket: `WEB-BASELINE-REFRESH-008`
- Ticket branch: `design/web-baseline-refresh-008`
- Target worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-008`
- Accepted design base: `afed67a3c47af204f6b34bcd941c200093a3faf0` (worktree
  `HEAD` `37ef174` is the Product ticket-open commit).
- Bootstrap candidate: uncommitted working-tree changes; the Bootstrapper made
  no commit. `package.json` and `pnpm-lock.yaml` are unchanged.
- Install: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start: `corepack pnpm dev --port 4620` (any port; the runbook uses 3210)
- Review: `http://127.0.0.1:4620/workspace` → right panel **Projects**.
- Built preview: `corepack pnpm build && PORT=4621 HOST=127.0.0.1 node .output/server/index.mjs`
- Ports `4620`–`4623`: all released.
- Scenario selection: unchanged (`autobyteus.prototype.scenario`,
  `autobyteus.prototype.context`). New: `autobyteus.prototype.designOnlyLayers=off`
  turns off design-only data; only the comparison scripts set it.
- Framework: unchanged (Nuxt 3, Vue 3, TypeScript, Tailwind; source presentation
  code retained).

## What Changed In The Refresh

Work followed the source diff `10fb695..1cd1a3a`: 306 commits, 425 changed
files under `autobyteus-web`, about 230 of them non-test UI files.

### Surfaces added, changed, or removed by the source

| Commits | Surface | Change |
| --- | --- | --- |
| `0fd2656`, `0446c37` | Right panel | **Projects** tab, first (before Files): Project/Temp picker, compact live board, Task inside the tab. Projects is always on (the Projects capability, its Server Settings toggle card and the `projects_disabled` state are gone). |
| `4d469b0`, `8ef4676`, `7f08c33` | Projects pages | Task cards and Task pages show the Task's root (agent or team, its live status, Couldn't start, closed/muted). Temp tasks link, board and page. Compact cards. |
| `9dad89b` | Project editor / Workspaces tab | Absolute path-only workspace links; folder-name display; Available/Unregistered. |
| `d45fe62`, `81f9ff1`, `c37b81d`, `a92004c`, `83ab477` | New chat, Org launch page, saved runs | Unified run settings: heading target switcher, members line and settings drawer, Org launch page, other model settings (Codex **Fast**), start-surface tools toggle, saved-run settings with stop. The old launch/config forms were removed. |
| `eef9633`, `9e90200` | Left panel | Unsent New chats kept as Draft rows under Chat. |
| `9faa6bc` | Workspaces tree | "Archive all runs" on agent, team and Org group headers, with confirmation and summary toast. |
| `d27880b`, `c21d312` | Workspaces tree | People-group identity for Teams; clean delegated-row style. |
| `af690af`, `489268f`, `3570b8c` | Workspaces tree | Task runs closed by DONE leave the tree (with a leave animation). |
| `39d0e99` | Workspace menu (desktop host) | Native folder **Browse…** restored in the shared workspace menu and Workspaces "+". |
| `e08c4a8`, `a2a7b37` | Run composer | `@` addresses agents and teams already in the run; mention mirror. |
| `82960e9` | Settings › Token Statistics | Font sizes follow the app font-size setting. |
| `3d8395b`, `17e1e20` | Event monitor file preview | Selected previews reveal through the mounted workspace shell (desktop host). |

### Implementation sync

- **Presentation synced to the pin:** 145 retained files updated, 45 added, 20
  removed with the source. Afterwards 995 design files that also exist in the
  source are byte-identical to the pin. The 10 component and localization files
  that differ carry only the preserved Reconnect change (below); the other
  differences are the design-owned `utils/apolloClient.ts`, `nuxt.config.ts`,
  `package.json`, `tsconfig.json`, `.gitignore` and `README.md`. No source UI
  file is missing. Audit: `evidence/WEB-BASELINE-REFRESH-008/presentation-audit.json`.
- **Vendored contracts:** the four `@autobyteus/*` packages were synced to the
  pin (`closed_task_executions`, Task-execution closed/reopened events, team
  aggregate status, mention-note `inRun`). Their `file:` dependency lines are
  kept.
- **Icons:** 5 new icons added to the offline bundle (`queue-list`,
  `chevron-right-20-solid`, `exclamation-circle-20-solid`,
  `check-circle-20-solid`, `arrow-top-right-on-square`).

## Refresh Reconciliation

- Pins: `10fb695` → `1cd1a3a`.
- **Accepted design changes superseded by the source version** (the source
  shipped them; its presentation now runs unchanged, and the design-only files
  and simulation layers were removed):

  | Design ticket | Source equivalent | Removed from the baseline |
  | --- | --- | --- |
  | `run-settings-ui-unification` | `d45fe62` and follow-ups | `ChatTargetSwitcher`, `ChatTargetMembers`, `chatModelOptions`, `memberNodes`, `memberSettingsSource`, `runSettings.ts`, `useChatTargetMembers`, `useRunTargetSwitcher`, `useStartRunInChat`, `orgLaunchDraftStore`; the hand-written runtime catalog, the "AutoByteus Org" fixture (see Mock data) and its unused avatar asset |
  | `task-run-resources-workspace-cleanup` | `af690af` | `plugins/95.task-run-cleanup.client.ts`, `prototype/task-run-cleanup/` (scripted Project Task Manager run) |
  | `project-manager-ux` (rounds 1–2) | `4d469b0` | `plugins/96.project-manager.client.ts`, `prototype/project-manager/`, `AdHocTask*`, `useTaskWorkerNavigation`, `pages/projects/no-project/` (the source uses `/projects/temp-tasks`) |
  | `chat-new-draft-kept-on-navigation` | `eef9633` | none beyond the synced source files |
  | `restore-native-workspace-folder-picker` | `39d0e99` | the design's `ChatWorkspaceMenu` changes (the stand-in `prototype/folder-selection/` reference stays as ticket evidence and is not wired in) |

- **Accepted design-only changes preserved:** `agent-definition-reconnect-ui`
  (Reconnect a run to an agent). It was re-applied onto the source's new run
  settings (`ExistingRunSettings`, `RunMemberRow`, `ExistingRunConfigEditor`) and
  Workspaces rows. Its injection key moved from the retired `runSettings.ts` into
  `useAgentReconnect.ts`, and its Video Team fixture gained `closedTaskExecutions`.
  It is on by default and passes all 7 of its review scripts.
- **Retained baseline simulations** (scripted outcomes under the interface):
  launching a Team from New chat and an Org from the Org launch page opens the
  launched run (`prototype/run-settings/launched*Fixture.ts`), now reached through
  the source's new `agentOrgLaunchDraft` store.
- **Unchanged surfaces given a load-and-look pass:** the full route and state
  matrix (all 57 routes in the primary configuration plus sampled narrow and
  zh-CN rows and the state rows).

## Experience Inventory (this refresh)

New and changed items are checked now. Other items keep their accepted evidence
from earlier refreshes and were re-run where a dependency changed (see
Validation).

| ID | Surface / behavior | States / outcomes | Synthetic fixture (illustrative values) | Result |
| --- | --- | --- | --- | --- |
| PRJ-001–007 | Right panel Projects tab | board, Temp tasks, Task in tab, back, chat run, zh-CN | `project-prototype-launch`, two Temp tasks | `Pass` |
| PRJ-010–016 | Projects pages: Task roots, Temp tasks | Temp link/board/page, open running root, board root, search, couldn't start, closed team | Task roots: running writer, failed `/translator`, closed `/release_team` | `Pass` |
| PRJ-020–022 | Path-only Project workspaces | Workspaces edit tab, add row, Project Workspaces tab | `/synthetic/prototype-workspace` | `Pass` |
| WSH-001–005 | Workspaces tree | Task worker rows, closed team left out, Archive all hover/confirm/outcome | stored run with three Task workers | `Pass` |
| RST-001–012 | Run settings | switcher, search, Team members line, drawer, Org launch page, Codex effort + Fast, tools toggle, saved-run settings (chat, agent, team), narrow | Codex/Claude synthetic runtimes | `Pass` |
| DRF-001–003 | New chat Draft rows | row after leaving, reopen, discard | typed text | `Pass` |
| HOST-001–003 | Native folder picker (desktop host) | Browse… offered, chosen path filled, Workspaces + adds the folder | host bridge returns `/synthetic/selected-folder` | `Pass` |
| MEN-001 | Run composer `@` | agents and teams listed | — | `Pass` |
| FLW-013/014 | Catalog Run | opens New chat preset to the Team / Agent | — | `Pass` (rewritten: the source removed the launch forms) |
| RCN-j1–j7, narrow | Reconnect (design-only, preserved) | error card, dialog, search, reconnect, settings notes, member rows, narrow | `prototype/agent-reconnect/` | `Pass` (baseline only; no source equivalent) |

## Implementation Simplifications

| Visible capability | Visible experience preserved | Baseline simulation | Absent |
| --- | --- | --- | --- |
| Projects and Task roots | Boards, roots with live status words, Temp tasks, path-only links, validation | Source stores; `utils/apolloClient.ts` answers from `fixtures.mjs` (shared with the observation node) | Project/Task persistence, task execution |
| Live Projects change feed | Board and panel as loaded | `/ws/projects` opens on the local `PrototypeWebSocket` and stays silent | Server change feed |
| Workspaces history | Tree, Task worker rows, closed rows left out, Archive all | Desktop: the source's `fetchTree` against local fixtures; Archive all removes the group from this browser context's history | Run storage |
| Run settings | Runtimes, models, thinking, Fast, members, Org launch, saved runs | Shared fixtures add Codex and Claude runtimes; lazily read catalogs go through the source's own action; launches use the retained scripted Team/Org launch | Runtimes, inference |
| Native folder picker | Browse…, chosen path, new workspace | `install-host-scenario.js` bridge returns a synthetic folder; `CreateWorkspace` answered locally | Electron, filesystem |
| Reconnect (design-only) | Unchanged from its accepted design | Its own fixture and simulation, gated by `designOnlyLayers` | Server rebind |

Baseline-owned changes:

- `prototype/source-observation/fixtures.mjs`: Task executions on the stored
  agent run, `closed_task_executions`, path-only links with validation, Task roots,
  `tasksWithoutProject`, Archive all, Codex/Claude runtimes; Projects capability
  removed. `mock-node.mjs`: answers runtime checks in inventory order (the source
  lists runtimes in arrival order) and resets the archive state per scenario.
- `utils/apolloClient.ts`: retired layers removed; `ArchiveStoredAgentRunGroup`
  answered locally; Reconnect gated.
- `plugins/00.prototype-state.client.ts`: retired runtime/Org layers removed; desktop
  history loaded by the source; lazy model catalogs read through the source;
  `runHistory.createWorkspace` and `agentOrgLaunchDraft.launch` run the source
  code; scripted Team snapshot carries `closed_task_executions`; Temp task pages
  map to their captured snapshot.
- `prototype/shared/design-only-layers.ts` (new), `plugins/97.agent-reconnect.client.ts`
  (gated), Reconnect fixture and components (re-applied).
- `prototype/fixtures/`: 72 snapshots re-captured at the pin from the source
  running on the synthetic node; `icon-collections.json` +5 icons.
- Scripts: `probe-refresh-008.mjs` (new paired flows, with desktop-host flows),
  `check-reconnect-preserved.mjs` (new); matrix, chat, flow and Projects probes
  updated for the pin (ports, design-only flag, new routes, path-only selects,
  catalog Run); independent-run check +8 rows.
- Docs: `README.md`, `mock-boundaries.md`, `ui-reference-runbook.md`.

### Mock data

- Origin: every value is invented and hand-written in `fixtures.mjs` and the
  Reconnect fixture. Snapshots are captured from the pinned source running only
  on that synthetic node.
- Removed for origin reasons: the run-settings "AutoByteus Org" fixture was
  hand-written from the definition files of the real `autobyteus-agents`
  repository (real IDs, names and members). It conflicts with "never copy real
  source content" and was dropped with its superseded layer. The populated
  catalog keeps the synthetic Product Launch Org.
- Checked: unit test `fixture-contract.test.ts` (no secret-like strings,
  local-only node URLs, every Task root state, Temp tasks, path validation).
  Worker run IDs were renamed (`worker-*`) because `task-…` IDs tripped the
  secret pattern (false positive).
- Independence and repeatability: no live service; a reload resets every
  in-memory change.

## Validation

Every paired run used headless Chrome with the same viewport, locale, UTC
timezone, light theme, reduced motion and synthetic data, with external requests
blocked and design-only data off. A row passes only if visible text and route are
identical, the screenshot differs at most by edge anti-aliasing or compositing
rounding, and the baseline shows no browser error and makes no non-local request.

Evidence root:
`/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-008/evidence/WEB-BASELINE-REFRESH-008/`.

- **Route and state matrix** (`matrix/`): 100 rows (57 routes in the primary configuration, sampled narrow and zh-CN rows, 15 state rows). A full run passed 100/100 (83 pixel-identical). The final run passed 99/100 (73 pixel-identical): WBR-S015 differed only in the page root's height, because the dev server had loaded a stale layout stylesheet after repeated hot reloads. After a server restart it passed twice (`matrix/results-s015-recheck-*.json`). WBR-R008 was flaky against the source (runtime order by arrival) until the observation node answered runtime checks in order; it then passed 4/4.
- **New paired flows** (`probe-refresh-008.mjs`, `flows/`): 41/41 pass (PRJ, WSH, RST, DRF, HOST, MEN rows above).
- **Regression flows re-run because their dependencies changed:**
  - Chat, composer, run, Background Tasks, compaction (`chat-flows/`): 53/53 pass.
  - Workspace runs, Org/Team runs, catalog Run (`flows-002/`): 13/13 pass (FLW-013/014 rewritten for the new catalog Run).
  - Projects/Tasks authoring, mentions, task rows, run config (`flows-004/`): 47/47 pass (PRJ-006 now picks the workspace by path).
  - Skill sources, browse, token meter (`flows-006/`): 24/24 pass (run once
    in this refresh; nothing they depend on changed afterwards).
- **Reconnect preserved** (`reconnect-preserved/`, baseline only, design-only data
  on): 7/7 review scripts pass with no browser error and no non-local request.
- **Team launch outcome** (`team-launch-outcome/`): on the synthetic node the source
  stays at "Starting Product Review Team…" and an Org launch reports "Couldn't
  start this Agent Org", because the node plays no run stream. The baseline's
  retained scripted launch opens the run. This is a scripted outcome beyond what
  the observation node can show, recorded separately.
- **Independent run** (`independent-preview/`, built preview on `:4621`, source
  and observation node stopped): IND-001–022 pass 22/22 (IND-015–022 new: Projects tab, Task root opens the worker, Temp task page, Codex Fast, Draft row, Org launch, Archive all, Reconnect), with zero browser errors and zero non-local requests; only the preview port was listening.
- **Checks:** `pnpm typecheck`, `lint`, `test` (3 files, 15 tests),
  `validate:boundaries` (13/13) and `build`: all pass.
- The evidence folder is 45 MB.
- Browser: Google Chrome (headless, playwright-core). Viewports 1440×900 and
  390×844; locales en and zh-CN (sampled).

## Known Gaps And Next Action

- **Carried over, unchanged:** the legacy `workspace_*`/`mobile_*` scenario
  injector, MOB-001–014 and the older desktop-host rows were not re-run. The
  desktop-host folder picker rows (HOST-001–003) were run.
- **Simulated, not compared:** live change-feed updates (the feed is silent), and
  the Team/Org launch outcome (see above).
- **Non-visible:** the scripted Org launch logs Vue dev-mode "readonly" warnings
  for the app font-size store; nothing visible changes.
- **Remaining UI parity differences inside the verified scope:** none.
- **Recommended next action for `product_ui_ux_designer`:** accept, commit on
  `design/web-baseline-refresh-008`, integrate into `personal`, then resume
  `collapsed-left-panel-expand-keeps-run` on the refreshed baseline.
