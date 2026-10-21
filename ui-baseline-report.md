# UI Baseline Report

Whole-frontend refresh of the AutoByteus Web current-experience baseline from `origin/personal@9227d61` to
`origin/personal@9e7a458`, for Product ticket `WEB-BASELINE-REFRESH-012`. The previous report
(`WEB-BASELINE-REFRESH-011`, pin `9227d61`) is kept in Git history at accepted base `288ef06`.

## Status

- Status: `Completed`
- Request type: `Refresh`
- Refresh request: the Product UI/UX Designer selected
  `origin/personal@9e7a45880865912442f4188e6d2a58d99b10a54c` as the single pin for the whole selected frontend
  (previous pin `9227d61597fd7ef8f6324fc9092be24ed1684c8a`).
- Refresh policy: where the source implements a surface the design had changed, the source wins; accepted design-only
  changes with no source equivalent are preserved.
- Result:
  - The baseline mirrors `9e7a458` and runs on its own in a browser with synthetic data.
  - The source now ships three things the design had designed or simulated. Its own components replace the design-only ones: the
    Notification Center with its "Update checks" setting (`settings-update-notifications`), Settings → Agent Runtimes
    (`runtime-lifecycle-review`), and the skill-source update confirmation.
  - New in the source and added: Nodes → Remote Collaboration.
  - Removed by the source and removed here: Skill Improvement (the Basics card and the composer button) and the self-opening app-update card.
  - Every new or changed surface was compared in the browser against the pinned source, with no known UI parity difference.
- Integration: this is a candidate (uncommitted changes in the ticket worktree, `HEAD` `216257f`). The design project
  (`personal`, at `288ef06`) carries it only after the Product UI/UX Designer accepts it and integrates it into the default branch.
- Next expected action: the Product UI/UX Designer reviews the candidate and decides the reference questions below, then
  integrates it into `personal` and records that in the baseline ticket.

## Source Identity

- Source project: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend: `autobyteus-web`
- Source root: `autobyteus-web/` (the `autobyteus-*-contracts` packages are read only for what the frontend imports)
- Governing revision authority: the explicit pin in the request (`origin/personal`)
- Pinned revision: `9e7a45880865912442f4188e6d2a58d99b10a54c`
- Previous pin: `9227d61597fd7ef8f6324fc9092be24ed1684c8a`. Range `9227d61..9e7a458`: 145 changed files under `autobyteus-web`.
- The source checkout was neither used for observation nor modified, and nothing was pulled.
- Applicable repository instructions: the superrepo `AGENTS.md` (`DESIGN.md`, `TESTING.md`, `RELEASE.md`; nothing is merged,
  tagged or released here), the design repository `README.md`, and `ui-reference-runbook.md`.
- Source observation: an exact `git archive` export of the pin at `/tmp/r012/src/` (`autobyteus-web` and the contract packages), with
  `node_modules` linked read-only to the existing source install, served with
  `BACKEND_NODE_BASE_URL=http://127.0.0.1:4823 ENABLE_APPLICATIONS=true nuxt dev --host 127.0.0.1 --port 4822`, backed by
  `PROTOTYPE_MOCK_PORT=4823 node prototype/source-observation/mock-node.mjs` (synthetic fixtures only).

## Baseline & Repository Identity

- Design repository/root (separate Git repository): `/Users/normy/autobyteus_org/autobyteus-web-design`
- Product ticket: `WEB-BASELINE-REFRESH-012`
- Product ticket branch: `design/web-baseline-refresh-012`
- Product-owned target worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-012`
- Accepted design base revision: `288ef06f5ed49e4bc636a6560fd6ca6b4f92d5b9`. Worktree `HEAD` `216257f` is the Product ticket-open commit.
- Bootstrap candidate: uncommitted working-tree changes; the Bootstrapper made no commit. `package.json` and `pnpm-lock.yaml` are unchanged.
- Install command: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start command: `corepack pnpm dev --port 4820`
- Review URL: `http://127.0.0.1:4820/workspace` (and the entries in `ui-reference-runbook.md`, section `WEB-BASELINE-REFRESH-012`)
- Built preview: `corepack pnpm build && PORT=4821 HOST=127.0.0.1 node .output/server/index.mjs`
- Framework, language, styling: Nuxt 3, Vue 3, TypeScript, Tailwind (the source's own).
- Scenario selection and reset: local-storage keys `autobyteus.prototype.scenario` (fixture set) and `autobyteus.prototype.context`
  (`desktop`; `electron_internal` = the desktop's own node; `electron_external` = a remote-node window). A reload resets all in-memory
  state. Comparison runs also set `autobyteus.prototype.designOnlyLayers=off`.
- New scenarios: `updates_waiting`, `updates_many`, `updates_one`, `updates_off`, `runtimes_mixed`, `runtimes_blocked`,
  `runtimes_update_fails`, `runtimes_sign_in_fails`, `runtimes_load_failed`, `collab_peers`. The default (`populated`) has no waiting
  update notification, so the sidebar and every earlier route look as before.
- Ports used: 4820 (baseline dev), 4821 (built preview), 4822 (source), 4823 (observation node). 3210 and 4781–4789 were not used.
  All are released. I stopped only processes I started, by recorded PID.

## Experience Boundary

- Included UI boundary: the whole `autobyteus-web` frontend. This refresh worked from the diff.
- Surfaces added or changed by the diff:
  - the sidebar Notification Center entry and panel;
  - Settings → Server Settings → Basics ("Update checks" replaces "Skill improvement");
  - Settings → Agent Runtimes;
  - Nodes → Remote Collaboration;
  - the Skill Sources dialog (shared update confirmation; Update stays offered after a failed check);
  - the app-update card is gone, and the composer has no Skill improvement button.
- Materially different contexts: browser window; the desktop's own node (adds the Software update row, and working runtime Update and
  Sign in); a remote-node window (runtimes are status only); left panel docked, collapsed (strip) and in the narrow drawer; zh-CN; 390 px.
- Excluded: nothing new. Electron, the server, and the real update and runtime mechanisms are not part of a UI reference.

## UI Experience Inventory

All rows were compared in headless Chrome, source against baseline, under matched viewport, locale, UTC time zone, light theme,
reduced motion and the same synthetic scenario, each side starting fresh. Domain values (names, versions, counts, times, error
reasons) are illustrative synthetic fixtures. UI-controlled text, including the template text around values, is exact.
Evidence: `evidence/WEB-BASELINE-REFRESH-012/flows/` and `matrix/` (source and baseline screenshots, results JSON).

A row passes when the text, route and a per-component element probe (computed styles, geometry, focus) match, the screenshot differs at
most by edge anti-aliasing, the baseline shows no browser error or non-local request, and the flow's own state is on screen on both
sides. The results files also hold first runs that failed and were then fixed, so the result per flow is the latest one (`-ntf2`, `-rcl`,
`-rtm2`, `-loading`, and the rest).

| ID | Route / surface | Exact obligations | States / operations / outcomes | Scenario / fixture (illustrative values) | Result |
| --- | --- | --- | --- | --- | --- |
| NTF-001–027 | Sidebar entry and Notification Center (browser window) | "N updates" pill (solid while unread, soft once read) and its tooltip lines; panel with sections, rows, "New" dots, Show N more / Show less, row details with the compare link; Update, Updating, Try again with the failure text, "Updated to …" with Clear; empty text (checks on / off); strip icon with count badge; ✕, Esc, outside click and the entry again close it | package Update (success; fails once, then succeeds); skill source Update with its confirmation (Cancel, confirm); Clear; collapsed strip; zh-CN; 390 px | `updates_waiting`, `updates_many`, `updates_one`, `updates_off`; invented packages, skill sources, revisions and times | `Pass` |
| NTF-030–037 | Notification Center in a desktop window | "Software update" row, release notes and release page, Download → progress → Install and restart → installing; the pill counts the app update; Settings → Updates; no floating update card | `updates_waiting` with `electron_internal`; `update_available` | the host bridge's invented app update (0.1.0 → 0.2.0 "prototype") | `Pass` |
| UCK-001–005 | Settings → Server Settings → Basics | "Update checks" card (on, off, toggle); no "Skill improvement" card; zh-CN; 390 px | the toggle saves in memory | default, `updates_off` | `Pass` |
| RTM-001–020 | Settings → Agent Runtimes | list (table at width, stacked at 390), Installed, Updates, Account, Check again and "Checked just now"; Update, progress line and result; failed update with its output and Try again; Update blocked by running agents (one / several); Install instructions; Sign in (waiting, Cancel, did not finish, completes); "Sign in from its command line."; load error with Retry; remote-node window is status only; zh-CN; Settings menu entry | default, mixed, blocked, update fails, sign-in fails, load failed | `runtimes_*`; invented versions, counts and failure output; work advances one step per read | `Pass` |
| RCL-001–012 | Nodes → Remote Collaboration | the tab in the Nodes tab list; switch (off by default, on); peer list; add, rename, remove; refusal text; hint while off; availability note; zh-CN; 390 px | `/nodes?nodeTab=remoteCollaboration`; a peer URL containing `unreachable` is refused | default, `collab_peers`; invented peers | `Pass` |
| SKC-001–004 | Skills → Sources | the shared "Update entire skill source?" confirmation with source and revisions, Cancel; Update offered after a failed check when a newer revision is known | | `skill_source_issues` (one new invented source), `populated` | `Pass` |
| MTX-001–083 | Every route and scenario of the earlier matrix (desktop, en), load-and-look | unchanged surfaces still match the pin, including the removal of "Skill improvement" and of the update card | 83 captured route and scenario pairs | MTX-069 (`error` scenario) is pixel and text identical; my strict check failed it only because the baseline logs its console error line in a different order. The other 82 passed. | `Pass` |
| MOB-001–004, UPD-001–006 | Mobile (unpaired, paired); Settings → Updates and Extensions in a desktop window | unchanged | | | `Pass` |

## Journey Inventory

| Journey | Starting scenario | Source and baseline outcome | Evidence | Result |
| --- | --- | --- | --- | --- |
| A waiting update is read and updated | `updates_waiting` | pill → panel → details → Update → "Updated to …" → Clear; a failing package's Try again succeeds | NTF-003–013 | `Pass` |
| A skill source update is confirmed | `updates_waiting` | Update → confirmation → Cancel (nothing changes) or confirm (updated) | NTF-010–012, SKC-001–004 | `Pass` |
| The desktop app update | `updates_waiting` + `electron_internal` | Download → progress → Install and restart → installing | NTF-030–034 | `Pass` |
| A runtime is updated or signed in | default, `runtimes_*` | Update → steps → "Updated from … to …" or the failure; Sign in → waiting → signed in / Cancel / did not finish | RTM-004–014 | `Pass` |
| A peer is registered | `collab_peers` | switch on → add → rename → remove; an unreachable peer is refused | RCL-002–009 | `Pass` |

## Exact Visual Fidelity Comparison

Each flow above is a visual comparison: source and baseline screenshot, element probe and text, under the matched conditions listed before
the inventory. Remaining difference: `None`. Raw differences were at most edge anti-aliasing or compositing rounding (a handful to a few
thousand pixels, at most 19 of 255 in value; the Settings menu page differs by at most 9 inside a gradient).

## Implementation Simplifications

| Visible capability | Visible experience preserved | Baseline simulation | Production mechanism intentionally absent |
| --- | --- | --- | --- |
| Update notifications and "Update checks" | every row state, counts, read and cleared state, the setting | `node-settings-fixtures.mjs`: in-memory notifications; the source's package and skill-source update mutations also mark the notification handled; one package's first update fails (scripted) | background checks, GitHub, the server |
| The desktop app update | row, progress, install | the host bridge's record (`install-host-scenario.js`): read, clear; Download plays progress in steps | Electron updater, downloads, restart |
| Agent Runtimes | every check, update and sign-in state and result | in-memory runtimes; each read of `AgentRuntimes` advances checks, updates and sign-ins one step | runtime CLIs, updaters, logins, version sources |
| Remote Collaboration | switch, peers, refusals | in-memory switch and peers | contacting a peer node |

- Presentation code reused: all of the source's components, stores, composables, styles and messages for these surfaces, unchanged.
  1078 design files that also exist in the source are byte-identical to the pin. The ones that differ are Reconnect (10 files),
  `utils/apolloClient.ts` and the two localization index files (they add the Reconnect messages). `nuxt.config.ts`, `package.json` and
  `tsconfig.json` are design-owned.
- UI code recreated: none.
- Baseline-owned changes in this refresh:
  - `prototype/source-observation/node-settings-fixtures.mjs` (new); `fixtures.mjs` (the scenarios, the update hooks, one new skill source in
    `skill_source_issues`); `mock-node.mjs` (resets the new state, greets `/ws/update-notifications`, no longer stops when a browser aborts a request).
  - `utils/apolloClient.ts` (answers the new mutations locally); `plugins/00.prototype-state.client.ts` (the new stores run the source's own
    code, `agentPackages.updateAgentPackage` and `appUpdate.markNotificationRead` / `clearNotification` run, and the local WebSocket greets the
    notifications feed); `prototype/shared/install-host-scenario.js` (app-update record, staged Download).
  - `prototype/scripts/dump-source-state.mjs` and `build-runtime-fixtures.mjs` (the new routes, the new pin). The 87 snapshots in
    `prototype/fixtures/` were re-captured from the pinned source on the synthetic node; the runtime availability of all of them matches the
    accepted base.
  - Removed design-only parts that the source now ships: `plugins/99.update-notifications.client.ts`, `components/notifications/NotificationEntry.vue`,
    `NotificationCard.vue`, `notificationTime.ts`, `components/settings/AiRuntimesManager.vue`, `prototype/ai-runtimes/`.
  - Docs: `README.md`, `mock-boundaries.md`, `ui-reference-runbook.md`.
- No test suite, check script or `validate:*` / `capture:*` script was added. The comparison harness is disposable and lives outside the
  repository (`/tmp/r012/scripts`); only its screenshots and result files are kept as evidence. I did not run the repository's lint, unit
  tests or boundary check; I ran `vue-tsc` once early on (exit 0).
- Mock data origin: every new value is invented and written by hand (packages, skill sources, revisions, times, runtimes, versions, peers,
  failure texts). The 87 snapshots are captured only from the pinned source running on the synthetic node. No real source or customer
  content, credential or live service is used, and a reload resets every in-memory change. I checked the origin of what this refresh added;
  I did not re-audit the older snapshot content beyond that.
- Scripted asynchronous behavior: local mutations answer after 40 ms; runtime checks, updates and sign-ins move one step per read (every 2 s
  while busy); the app Download plays five steps over 2.5 s.
- Browser simulation of host contexts: `electron_internal` and `electron_external` are the synthetic host bridge; no Electron is bundled.
- Retained production store, client, protocol or runtime: none beyond the source's own presentation stores.

## Validation

- Browser: Google Chrome (headless, playwright-core). Viewports 1440×900 and 390×844; locales en and zh-CN (sampled).
- Source observation: as above. Baseline start command: `corepack pnpm dev --port 4820`.
- New surfaces: **76/76** paired flows pass (NTF 35, UCK 5, RCL 12, RTM 20, SKC 4). Found and fixed on the way: the baseline did not mark the
  app update read (the pill stayed solid), the host's Download jumped straight to "downloaded", and my first Remote Collaboration route was
  wrong (`nodeTab`, not `tab`).
- Unchanged surfaces, load-and-look: the earlier route and state matrix, 83 desktop routes and scenarios, all equal (see MTX-069 above);
  mobile 4/4; Settings → Updates and Extensions 6/6.
- Preserved design-only layers re-run: Reconnect review scripts 7/7, delegated-copy example DCE-001–004; no browser error.
- **Independent run:** the built preview (`pnpm build` exit 0) on `:4821`, with the source and the observation node stopped and only 4821
  listening: 6/6 pass (IND-050–055: Notification Center and package Update, desktop app Download, runtime Update to the end, Remote
  Collaboration add a peer, "Update checks" card, skill source confirmation), zero browser errors, zero non-local requests.
- Approved design checks were not re-run and no reference screenshot was changed: finished designs are a record of what the user approved.
- Evidence: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-012/evidence/WEB-BASELINE-REFRESH-012/`
  (`flows/`, `matrix/`; 26 MB).
- Scenario reset and isolation: a fresh browser context and a reset of the observation node's scenario before every flow; a reload resets
  the baseline.
- Limitations: runtime and notification work advances by read count, not time (a screenshot compares a moment between two reads); "Checked
  N min ago" and relative times ("3 hr. ago") use the real clock on both sides.

## Completion Check

- Selected source boundary and pinned revision are explicit: `Yes`
- Baseline starts independently at the documented URL: `Yes`
- Every distinct selected navigation destination and surface has exact source and baseline evidence: `Yes`
- Every distinct interaction, feedback, and meaningful state pattern is demonstrated at least once: `Yes`
- Every context that materially changes the UI is represented: `Yes`
- Every distinct supported journey and relevant recovery path is runnable with matching visible outcomes: `Yes`
- Desktop and narrow-mobile behavior are validated when applicable: `Yes`
- Interface structure and interactions are real rather than screenshot or hotspot substitutes: `Yes`
- Production capabilities are simulated locally and deterministically: `Yes`
- Production credentials, customer data, live dependencies, and production writes are absent: `Yes`
- UI parity differences remaining: `None`
- Unsubstantiated distinct UI inventory items remaining: `None`
- Mock data follows "Mock data origin" in the shared principles, with the evidence above and no real source or customer content: `Yes`
- UI parity achieved for every item in the recorded distinct inventory: `Yes`

## Refresh Reconciliation

- Previous and new source pins: `9227d61` → `9e7a458`.
- Surfaces added, changed, or removed by the source diff: see "Experience Boundary". Also changed, with no effect on the baseline: the
  Electron updater, the server runtime environment, the localization audit and the e2e probes.
- **Accepted design changes superseded by the source version:**
  - `settings-update-notifications`: the source's panel, rows, sidebar entry (a pill on the Settings row, a count badge on the strip) and
    "Update checks" card run unchanged. The design's own components, plugin and demo scenarios were removed.
  - `runtime-lifecycle-review`: the source's Agent Runtimes components run unchanged. The design's component and timeline simulation were removed.
- **Accepted design-only changes preserved:** `agent-definition-reconnect-ui`, and the delegated-copy, task-keys, task-part-of and
  skill-sources example data. All stay off with `designOnlyLayers=off`.
- **Surfaces where it is hard to tell which policy applies** (for Product to decide):
  1. **The two approved reference sets the source now ships** (`settings-update-notifications` VIS-001–028 and `runtime-lifecycle-review`
     VIS-001–023). I did not re-check or recapture them. Opened side by side in a sample, the shipped Notification Center panel and the
     shipped runtime list look like the references (same layout, rows, text and states). One difference I noticed: Antigravity shows "Sign in
     from its command line." with no Sign in button, where the design's Sign in opened an in-row terminal. Product should decide whether those
     references stay as the design's record or are re-captured on the shipped surfaces.
  2. **Default state.** The design showed waiting notifications by default. The baseline's default has none, so earlier routes are
     unchanged; the notification states are in the `updates_*` scenarios.
  3. Carried over, still open: Reconnect's collaborator case shows on delegated copies.
- Unchanged surfaces given a load-and-look pass: the full route and state matrix, mobile, and the host-context routes.

## Known Gaps And Next Action

- Blocked or incomplete UI inventory IDs: none.
- User-facing differences or omissions: none known inside the verified scope.
- Illustrative fixture content or production mechanisms intentionally simplified without changing presentation: see Implementation
  Simplifications. Not simulated: real update checks, downloads and installs; runtime updaters and sign-ins; contacting a peer node; status
  events after a run's snapshot (carried over).
- Source reachability or evidence limitations: none. The source ran from an exact export of the pin.
- Required correction: none.
- Optional data cleanup: none.
- Recommended next action for `product_ui_ux_designer`: decide the reference questions above, then accept, commit on
  `design/web-baseline-refresh-012`, integrate into `personal`, and record the integration in the baseline ticket.
