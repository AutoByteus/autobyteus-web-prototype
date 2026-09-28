# Prototype Bootstrap Report

Refresh of the AutoByteus Web current-experience baseline to the latest source,
for Product ticket `WEB-BASELINE-REFRESH-001` (stable package
`chat-interface-entry`). The previous report is preserved in Git history
(accepted base `ba67ac0`).

## Status

- Status: `Completed`
- Request type: `Refresh`
- User request: "bring … the baseline to the latest, like the original
  project … so that we can develop on top of the latest."
- Result: the prototype mirrors `origin/personal@fcd3e83` and runs
  independently in a browser with synthetic data. All 82 page/state rows, 15
  changed-surface flows, and 13 desktop-host rows match the pinned source.
- Next expected action: Product Prototyper reviews and accepts the candidate,
  creates the accepted commit, integrates it into `personal`, then resumes
  `chat-interface-entry` on the refreshed base.

## Source Identity

- Source project: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend: `autobyteus-web`
- Governing authority: `origin/personal`
- Pinned revision: `fcd3e83a4ca931ba52ed19bd37b8df3050ee529e` (source `HEAD`
  and `origin/personal` both equal the pin; `autobyteus-web` working tree clean)
- Previous pins: primary `8ef282ba77705180d985e7000d801f0e0068cdc1`, plus the
  focused Team-launch refresh at `5fb16658e7bd2aefd750f99eb596a17382e161ac`
- Instructions read: `autobyteus-web/AGENTS.md`. The source tree was not
  modified.
- Source observation: an exact `git archive` export of the pin at
  `/tmp/autobyteus-prototype-WEB-BASELINE-REFRESH-001/source-export`, served
  with `BACKEND_NODE_BASE_URL=http://127.0.0.1:4391 ENABLE_APPLICATIONS=true
  nuxt dev --port 4291` against the synthetic observation node
  (`PROTOTYPE_MOCK_PORT=4391 node prototype/source-observation/mock-node.mjs`)

## Prototype Identity

- Prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`
- Product ticket: `WEB-BASELINE-REFRESH-001`
- Ticket branch: `prototype/web-baseline-refresh-001`
- Target worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/WEB-BASELINE-REFRESH-001`
- Accepted base: `ba67ac069e6cf0bb95a7342a7e25185f08a0d4e4`
- Bootstrap candidate: uncommitted working-tree changes on the ticket branch.
  The Bootstrapper created no commit.
- Install: `corepack pnpm install --ignore-workspace` (the lockfile was
  regenerated because two vendored contract packages were added; Product
  Prototyper should commit `pnpm-lock.yaml` with the candidate)
- Start: `corepack pnpm dev --port 4199`
- Review URL: `http://127.0.0.1:4199/workspace`
- Stack: Nuxt 3, Vue 3, TypeScript, Pinia, Tailwind (unchanged)
- Scenario selection and reset: `localStorage['autobyteus.prototype.scenario']`
  set to `populated` (default), `empty`, `apps_disabled`, `projects_disabled`,
  `loading`, `error` or `permission_denied`; context key
  `autobyteus.prototype.context` (`desktop`, `paired`, `unpaired`,
  `electron_internal`, `electron_external`). Reload, or open a fresh browser
  context, to reset.

## What Changed In The Refresh

Work followed the source diff (707 `autobyteus-web` files changed since the
last focused pin; 852 since the primary pin).

- **Presentation synced to the pin:** 242 retained files updated, 136 new
  source files added, and 61 files the source deleted were removed. Source
  plugins stay replaced by the prototype plugins, as before.
- **New surfaces now present:** Agent Orgs (catalog, detail, create/edit,
  Org launch, Org runs in workspace history), Projects (capability-gated
  navigation, list, detail, task board, dialogs, settings toggle), the Memory
  Orgs tab and org detail, the new Applications launch-defaults setup, the
  provider model sections, collaboration message/task panels, and
  stopped-run model replacement.
- **Removed by the source:** the Settings → Messaging section and its
  components/stores.
- **Vendored contracts:** `agent-presentation-contracts` and
  `collaboration-stream-contracts` added; `application-sdk-contracts` and
  `team-stream-contracts` updated to the pin (`vendor/`).
- **Accepted prototype changes:** the user asked for the baseline to match the
  source, so the source now wins everywhere.
  - Superseded by source implementations: accepted AgentOrg flat-team
    experience, AgentTeam member overrides, mounted-Team status, nested-Team
    hierarchy review, the Token Statistics presentation, and the prototype
    Handoff manager. The source now ships its own versions.
  - Removed as prototype-only review scaffolding: `FlatAgentTeamExperience.vue`,
    `components/handoffs/HandoffManager.vue`,
    `NestedTeamHierarchyReviewPanel.vue`, the three `use*PrototypeReview`
    composables, `utils/aggregateAgentStatuses.ts`, and
    `prototype/aorg-*.ts`.
  - Product Prototyper should confirm these removals.

## Implementation Simplifications

| Visible capability | Prototype simulation | Absent |
| --- | --- | --- |
| Catalog, settings and page data | Pinia snapshots re-captured from the pinned source (`prototype/fixtures/runtime-state.json`, 64 snapshots) | GraphQL server |
| Direct source reads (open stored run, model descriptors, Org references, history refresh) | `utils/apolloClient.ts` answers GraphQL *queries* locally from the same synthetic fixtures the source observation uses; it also mirrors the `loading`, `error` and `permission_denied` scenarios | Apollo client, network |
| Team launch | The source's own `launchDraft`/`hydrateRun` run as-is; the adapter answers `CreateAgentTeamRun` with a deterministic created run, which later history reads list as active | Run scheduler, model calls |
| Node health, application launch setup | Answered in the prototype fetch boundary | Node server |
| Streams | Local `PrototypeWebSocket`, which now also dispatches `open`/`close` events | Stream servers |
| Desktop host (updates, extensions, embedded server) | Unchanged `install-host-scenario.js` fake `window.electronAPI` | Electron |

Interceptor changes in `plugins/00.prototype-state.client.ts`:

- Only `async` store actions (the backend boundary) are stubbed; synchronous
  actions now run as in the source.
- Map/Set-typed state is restored after each snapshot patch.
- Run-opening actions (`runHistory` and `agentSelection` intents) execute the
  source code.
- The initial navigation/workspace split height is taken from each captured
  source snapshot.

The source-observation node gained a schema-aware completion step
(`prototype/source-observation/schema-filler.mjs`, driven by the pinned
`generated/graphql.ts`) and fixtures for Agent Orgs, Projects, Org memory,
execution trees, conversations, and application launch configuration. It is
used only for comparison.

## Validation Evidence

All runs used headless Chrome with the same viewport, locale, UTC timezone,
light theme and reduced motion, identical synthetic data, and external
requests blocked.

- **Pages and states (`validate:web-baseline-refresh`):** 82/82 pass.
  - Every one of the 48 routes on desktop English, plus 18 sampled
    narrow/zh-CN rows and 16 state rows: empty, apps/projects disabled,
    loading, error, and mobile unpaired/paired/unsupported/denied.
  - 55 rows are pixel-identical. 27 differ only by rendering noise, with
    identical text, controls, DOM geometry and computed styles:
    - 26 edge-antialiasing rows: ≤0.01% of the frame.
    - 1 compositing-rounding row: ≥99% of changed pixels within 2/255, none
      above 16/255 (API Keys, alpha-blend rounding).
  - Evidence: `evidence/WEB-BASELINE-REFRESH-001/matrix/`
    (`summary.json`, `results.json`, `source/`, `prototype/`, `diff/`)
- **Changed-surface flows (`validate:web-baseline-refresh-flows`):** 15/15
  pass (12 pixel-identical, 3 edge-antialiasing only). Evidence:
  `evidence/WEB-BASELINE-REFRESH-001/flows/`
  - FLW-001–003, 011, 015: expand workspace history; open a stored Team run;
    open a stored Agent Org run; focus a Team member; open an Org member
    conversation.
  - FLW-004–006: Agent, Team and Org catalog **Run** open the current launch
    forms.
  - FLW-012: compose a chat message in a Team run.
  - FLW-013: Team launch end-to-end (catalog → workspace → **Run Team** →
    new active Team projected), compared after the source's 5 s history
    refresh.
  - FLW-014: Agent launch end-to-end.
  - FLW-007–010: Projects create dialog, Project new-task dialog, Org create
    validation, navigation to Projects.
- **Desktop-host rows:** HOST-001–008 and STATE-009–013 pass 13/13. These are
  browser-simulated desktop screens (updates, extensions, embedded-server
  states), re-checked because those source screens changed. The first run's
  HOST-005 difference was the synthetic endpoint port, fixed by aligning the
  host fixture default to 4391. Evidence:
  `evidence/WEB-BASELINE-REFRESH-001/host/` and `host-recheck/`
- **Independent run:** the built preview (`node .output/server/index.mjs`) was
  run with the source and observation node stopped. `/workspace` (including
  opening a stored Team run), Agent Orgs, Project detail and API Keys all
  rendered with zero browser errors and zero requests outside the prototype.
  Evidence: `evidence/WEB-BASELINE-REFRESH-001/independent-preview/`
- **Checks:** `pnpm lint` passes. `pnpm typecheck` passes (pre-existing
  duplicate auto-import warnings only). `pnpm test` passes 3 files / 12 tests.
  `pnpm validate:boundaries` passes 13/13. `pnpm build` passes.

## Known Gaps And Next Action

- **Legacy rich-state injector not refreshed:**
  - `prototype/shared/apply-experience-scenario.js` (the `workspace_*` and
    `mobile_*` scenarios: streaming, completed, error, interrupted,
    active-mobile work) targets the previous store shapes. It still renders,
    but it is not source-verified at this pin, and it crashes the new source
    when injected there.
  - Stored and launched runs now come from the source's own code paths
    instead (FLW-001–015).
  - Recommendation: if `chat-interface-entry` needs streaming or error chat
    states, add them as focused fixtures in that ticket rather than reviving
    the injector.
- **Not re-run:**
  - Historical review URLs (`/workspace?root=org|team`) and historical
    validation scripts (`validate:gap-009/010`, `validate:aorg-*`,
    `validate:final-package`, `capture:*-final`, `validate:correction-journeys`)
    target the previous baseline.
  - Paired-mobile work tabs (MOB-001–014) were not re-checked; they depend on
    the injector.
- **Harness and fixture notes:**
  - `validate-browser`, `capture-correction-parity`,
    `validate-correction-journeys` and `validate-gap-009/010` gained an
    `EVIDENCE_ROOT` override so new runs don't overwrite historical evidence.
  - The synthetic standalone agent run is not listed in workspace history in
    either app; source and prototype agree.
- **Perceptible or behavioral differences remaining inside the verified
  scope:** none.
