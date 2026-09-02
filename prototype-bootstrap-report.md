# Prototype Bootstrap Report

This report records the independent current-experience refresh of the flat
AgentTeam launch-configuration baseline for stable package
`AORG-FLAT-TEAM-001`. The selected source frontend is the authority. This work
does not select future behavior, validate production services, or replace the
Product Prototyper's accepted future-state Agent Org work.

## Status

- Status: `Completed`
- Request type: `Refresh`
- Stable package: `AORG-FLAT-TEAM-001`
- Result: the refreshed launch baseline is independently runnable and all
  `8/8` controlled pinned-source-versus-prototype comparisons pass.
- Exactness: semantic values, control states, action results, geometry and
  browser-error state are exact in every row. Six screenshots are pixel
  identical; the other two contain only three normalized raster pixels in
  total (one pixel in the New-workspace row and two max-delta-1 pixels in the
  narrow row), with no perceptible or geometric difference.
- Candidate state: uncommitted working-tree candidate. The Bootstrapper did
  not commit, integrate, move the ticket, or alter either repository's history.
- Next expected action: Product Prototyper acceptance review and the
  Product-owned ticket-branch commit.

## Source Identity

- Selected frontend:
  `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web`
- Explicit source authority:
  `origin/personal@5fb16658e7bd2aefd750f99eb596a17382e161ac`
- Observed source `HEAD`: `5fb16658e7bd2aefd750f99eb596a17382e161ac`
- Observed `origin/personal`: `5fb16658e7bd2aefd750f99eb596a17382e161ac`
- Source working tree at final provenance capture: clean.
- Source instructions: the selected frontend's `AGENTS.md` was read and
  followed. The source tree remained read-only.
- Observation runtime: the source was served directly from the pinned clean
  tree at `http://127.0.0.1:4283` against the controlled loopback observer at
  `http://127.0.0.1:4383`. The observer supplied deterministic Team, workspace,
  model-catalog and GraphQL results; it did not modify source presentation.
- Durable identity, selected-file hashes and adaptation classification:
  `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-TEAM-LAUNCH-BASELINE-REFRESH-001/evidence/AORG-FLAT-TEAM-001/team-launch-baseline-refresh/source-provenance.json`
- Exact source-file parity: 35 refreshed component, localization, store, type,
  utility and GraphQL files are byte-for-byte SHA-256 matches to the pin.

Representative source observation command:

```bash
BACKEND_NODE_BASE_URL=http://127.0.0.1:4383 \
ENABLE_APPLICATIONS=true \
corepack pnpm dev --port 4283
```

## Prototype Identity And Run Instructions

- Canonical prototype repository/root:
  `/home/autobyteus/workspace/autobyteus-web-prototype`
- Product-assigned ticket worktree:
  `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-TEAM-LAUNCH-BASELINE-REFRESH-001`
- Ticket branch: `prototype/aorg-team-launch-baseline-refresh-001`
- Accepted prototype base: `1edc1008a55b04d04dd2f07bd9004d53079e09a2`
- Worktree `HEAD`: `1edc1008a55b04d04dd2f07bd9004d53079e09a2`
- Bootstrap candidate: uncommitted changes based on that accepted revision.
- Install command: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start command: `corepack pnpm dev --port 4199`
- Review URL: `http://127.0.0.1:4199/workspace`
- Framework retained: Nuxt 3, Vue 3, TypeScript, Pinia, Tailwind and source
  assets.

Select the refreshed deterministic experience before loading `/workspace`:

```js
localStorage.setItem('autobyteus.prototype.context', 'desktop')
localStorage.setItem('autobyteus.prototype.scenario', 'workspace_team_launch_refresh')
location.assign('/workspace')
```

Reset:

```js
localStorage.removeItem('autobyteus.prototype.scenario')
localStorage.removeItem('autobyteus.prototype.context')
location.reload()
```

## Selected Current-Experience Boundary

The refreshed boundary is the browser-rendered flat AgentTeam new-launch
configuration in the `/workspace` center pane:

- Team identity and runtime backend selection.
- Runtime-scoped global model trigger, help text and searchable picker.
- Existing-versus-new Workspace authoring, selection/path feedback and launch
  readiness.
- Root **Auto approve tools** behavior.
- Keyboard-operable Team Members disclosure, inherited member values and a
  per-Agent override.
- Disabled/enabled **Run Team** states and missing-workspace recovery message.
- Desktop `1440x900` and narrow web `390x844` presentations.

Out of scope for this focused baseline: production launch/execution, workspace
creation or persistence, live runtime/model discovery, credentials, existing
run history/editor journeys, active conversations, native desktop behavior,
and Product-owned accepted future-state Agent Org/right-tool-panel behavior.
Those future-state prototype surfaces were preserved rather than source-matched.

## UI Experience Inventory

Durable evidence root:

`/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-TEAM-LAUNCH-BASELINE-REFRESH-001/evidence/AORG-FLAT-TEAM-001/team-launch-baseline-refresh`

| Inventory ID | Observable obligation | Paired visual rows | Result |
| --- | --- | --- | --- |
| `UXB-TEAM-LAUNCH-ROOT-001` | Exact Team Definition, runtime, global model, picker/help, root auto-approve and launch-block presentation | `UXV-TEAM-LAUNCH-REFRESH-001`, `002`, `005` | **Pass** |
| `UXB-TEAM-LAUNCH-WORKSPACE-001` | Exact Existing/New workspace authoring and readiness transition | `UXV-TEAM-LAUNCH-REFRESH-003`, `004` | **Pass** |
| `UXB-TEAM-LAUNCH-MEMBERS-001` | Exact keyboard disclosure, two inherited Agent rows and per-Agent customized state | `UXV-TEAM-LAUNCH-REFRESH-006`, `007` | **Pass** |
| `UXB-TEAM-LAUNCH-RESPONSIVE-001` | Exact narrow launch form, disabled launch and recovery feedback | `UXV-TEAM-LAUNCH-REFRESH-008` | **Pass** |

Every row used English, light theme, reduced motion, UTC, a fresh browser
context, identical deterministic values, local assets and blocked non-loopback
requests. Comparison is scoped from the Workspace center pane through the
viewport edge. The accepted future-state right panel is masked, and the
future-state Agent Orgs left-navigation item is outside this source boundary.

## Journey Inventory

| Journey ID | Steps and source/prototype outcome | Deterministic recovery | Result |
| --- | --- | --- | --- |
| `UXJ-TEAM-LAUNCH-RECOVERY-001` | Load the Team draft; observe current defaults, disabled Run Team and `Team / needs a workspace before launch.` | Fresh context/reload restores the same missing-workspace state | **Pass** |
| `UXJ-TEAM-LAUNCH-WORKSPACE-001` | Select `Prototype Workspace`; exact workspace metadata appears and Run Team becomes enabled | Fresh context restores no selection | **Pass** |
| `UXJ-TEAM-LAUNCH-WORKSPACE-002` | Select New, enter `/synthetic/new-team-workspace`; readiness becomes launchable | Fresh context restores Existing mode and empty selection | **Pass** |
| `UXJ-TEAM-LAUNCH-MEMBERS-001` | Focus the disclosure, press Enter, inspect inherited rows, then create a per-Agent auto-approve override and observe `Overridden` | Fresh context restores collapsed inherited members | **Pass** |

The model picker and root auto-approve states are also exercised by real Vue
interactions in paired rows `002` and `005`.

## Exact Comparison Evidence

- Human-readable matrix:
  `evidence/AORG-FLAT-TEAM-001/team-launch-baseline-refresh/comparison-summary.md`
- Machine summary:
  `evidence/AORG-FLAT-TEAM-001/team-launch-baseline-refresh/team-launch-refresh-summary.json`
- Complete paired records:
  `evidence/AORG-FLAT-TEAM-001/team-launch-baseline-refresh/team-launch-refresh-results.json`
- Pinned-source screenshots: `evidence/AORG-FLAT-TEAM-001/team-launch-baseline-refresh/source/`
- Prototype screenshots: `evidence/AORG-FLAT-TEAM-001/team-launch-baseline-refresh/prototype/`
- Amplified pixel diffs: `evidence/AORG-FLAT-TEAM-001/team-launch-baseline-refresh/comparison/`
- Direct browser-tool replay:
  `evidence/AORG-FLAT-TEAM-001/team-launch-baseline-refresh/direct-browser-tool-replay.txt`
- Direct browser-tool source/prototype images:
  `direct-browser-source-default.png`, `direct-browser-prototype-default.png`

All eight rows have exact semantic, geometry and action JSON. Both browsers
reported zero page or console errors. The screenshot matrix has zero changed
pixels in rows `001`, `002`, `003`, `005`, `006`, and `007`; row `004` has one
normalized pixel; row `008` has two max-channel-delta-1 pixels. The machine
records contain screenshot, semantic, geometry and action SHA-256 hashes.

## Implementation And Deliberate Simplifications

| Visible production capability | Preserved experience | Prototype simulation | Intentionally absent |
| --- | --- | --- | --- |
| Team launch configuration | Current source components, labels, hierarchy, keyboard behavior, validation and geometry | Deterministic Team draft in existing prototype Pinia stores | Launch service, runtime execution, persistence |
| Runtime-scoped model catalog | Current picker/help and model selection contract | Fixed `Prototype Models / mock/gpt-prototype` catalog through the fixture-backed provider store | Provider credentials, discovery and model API |
| Workspace choice | Current Existing/New authoring, metadata and readiness | One fixed existing workspace and local new-path authoring | Filesystem creation, backend workspace APIs |
| Auto approve and member overrides | Current root/member controls and inherited/customized display | Browser-local draft mutation only | Permission/runtime enforcement |

- Presentation parity: current source presentation/state files were copied
  directly. `source-provenance.json` records 35 byte-identical files.
- Prototype-native compatibility: two composables adapt the current source
  interface to the accepted fixture-backed model store rather than copying the
  production catalog protocol.
- Synthetic state: Product Review Team, researcher/writer, Prototype Workspace,
  model/provider, IDs and paths are fixed, non-customer and resettable.
- Current source observer: GraphQL fixture operations exist only to observe the
  source UI against equivalent deterministic data.
- Local assets: three current Heroicons were added to the existing checked-in
  Iconify fixture so independent review does not require an icon CDN.
- Retained production store/client/protocol/runtime for capability: `None`.

## Validation

Paired browser command:

```bash
SOURCE_BASE_URL=http://127.0.0.1:4283 \
PROTOTYPE_BASE_URL=http://127.0.0.1:4199 \
MOCK_BASE_URL=http://127.0.0.1:4383 \
CHROMIUM_PATH=/usr/bin/chromium \
corepack pnpm validate:team-launch-baseline-refresh
```

Results:

- Paired browser comparison: `8/8` pass; exact semantic, geometry and action
  state; zero browser errors; six byte-identical screenshots and three total
  normalized raster pixels in the other two.
- Direct browser-tool source observation and prototype replay: pass; durable
  screenshots and replay transcript recorded.
- Independent built preview: source and mock servers stopped; HTTP 200 and
  deterministic launch form rendered from local state. Evidence:
  `tickets/done/AORG-TEAM-LAUNCH-BASELINE-REFRESH-001/validation/independent-preview-browser.txt` and
  `evidence/AORG-FLAT-TEAM-001/team-launch-baseline-refresh/independent-preview.png`.
- `corepack pnpm typecheck`: pass; pre-existing duplicate auto-import warnings
  only.
- `corepack pnpm lint`: pass.
- `corepack pnpm test`: 4 files / 15 tests pass.
- `corepack pnpm validate:boundaries`: 13/13 pass.
- `corepack pnpm build`: pass; node-server output. Existing duplicate-import
  and large-chunk warnings remain non-blocking and do not affect parity.
- Logs: `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-TEAM-LAUNCH-BASELINE-REFRESH-001/validation/`.

## Completion Check

- Assigned Product worktree and supplied accepted base verified: `Yes`
- Selected frontend, branch authority and exact pin verified: `Yes`
- Source remained read-only and clean: `Yes`
- Independent local run documented and browser-proven: `Yes`
- Named surface/state/interaction inventory has paired evidence: `Yes`
- Journeys and deterministic recovery work: `Yes`
- Observable parity in the selected boundary: `Yes`
- Production capabilities replaced by lightweight local simulation: `Yes`
- Credentials, customer data, live services and filesystem writes absent: `Yes`
- Failed or unsubstantiated inventory IDs: `None`

## Remaining Parity Gaps And Next Action

- Known perceptible or behavioral gap inside the selected baseline: `None`.
- Remaining raster difference: three normalized, non-perceptible pixels across
  two of eight rows; exact state and geometry confirm no experience divergence.
- Illustrative values are synthetic by design; no production capability claim
  is made.
- Next action: Product Prototyper should review the uncommitted candidate and
  evidence, run any Product-owned acceptance session, and create the accepted
  ticket-branch commit. Bootstrapper intentionally did not modify ticket state,
  `ui-ux-spec.md`, normative future-state screenshots, integration, cleanup or
  repository history.
