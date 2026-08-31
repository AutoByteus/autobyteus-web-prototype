# Prototype Bootstrap Report

This report records the focused current-experience correction for the two
Product Prototyper inventory IDs `UXB-CORR-TEAM-RUN-CONFIG-001` and
`UXB-CORR-WORKSPACE-FILE-TREE-001`. It does not redesign either surface,
validate production capabilities, or alter Product-owned future-state
specifications or reference screenshots.

## Status

- Status: `Completed`
- Request type: `Correction`
- Stable package / Product ticket: `AORG-FLAT-TEAM-001`
- Corrected inventory IDs: `UXB-CORR-TEAM-RUN-CONFIG-001`,
  `UXB-CORR-WORKSPACE-FILE-TREE-001`
- Result: both named items have independently runnable deterministic scenarios
  and controlled pinned-source-versus-prototype evidence. All nine distinct
  visual/interaction states pass with exact DOM/state, geometry, computed-style,
  action, focus, and byte-identical screenshot results; neither browser emitted
  an error.
- Next expected action: Product Prototyper should inspect and acceptance-test
  this uncommitted correction candidate, then create the accepted ticket-branch
  commit. Bootstrapper did not commit, integrate, move the ticket, or alter the
  canonical prototype checkout.

## Source Identity

- Source repository: `/home/autobyteus/workspace/autobyteus-workspace`
- Selected frontend: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web`
- Exact pinned source revision:
  `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Selected boundary: desktop `/workspace` Team run configuration in the center
  pane and the Files workspace tree/viewer in the docked right panel.
- Applicable source instructions: the selected frontend `AGENTS.md` was read;
  the selected source repository remained read-only.
- Source observation: an exact `git archive` of the pinned `autobyteus-web`
  tree was served at `http://127.0.0.1:4283` against the controlled loopback
  observer at `http://127.0.0.1:4383`.
- Disposable observation normalization: automatic Electron module discovery
  was disabled, the temporary dev-handler compatibility registration was
  omitted, and the canonical prototype dependency installation was reused.
  No pinned presentation file was edited.
- Durable provenance and selected-file hashes:
  `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction-2/evidence/AORG-FLAT-TEAM-001/baseline-correction-2/source-provenance.json`.
  All nine selected prototype presentation files are SHA-256 identical to the
  pinned source files.
- Representative source command:

  ```bash
  NODE_ENV=development \
  BACKEND_NODE_BASE_URL=http://127.0.0.1:4383 \
  ENABLE_APPLICATIONS=true \
  NUXT_IGNORE_LOCK=1 \
  corepack pnpm exec nuxt dev --host 127.0.0.1 --port 4283
  ```

## Prototype Identity

- Canonical prototype repository/root:
  `/home/autobyteus/workspace/autobyteus-web-prototype`
- Product ticket branch: `prototype/aorg-flat-team-001-baseline-correction-2`
- Product-owned target worktree:
  `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction-2`
- Accepted prototype base revision:
  `893cde9dbcc5ccc8904cf08ba6b031668dff0041`
- Bootstrap candidate revision: uncommitted working-tree candidate based on
  the accepted revision above. Product Prototyper owns the accepted commit.
- Install command: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start command: `corepack pnpm dev --port 3210`
- Review URL: `http://127.0.0.1:3210/workspace`
- Framework: retained Nuxt 3, Vue 3, TypeScript, Pinia, Tailwind, source assets,
  and exact pinned presentation components.

### Scenario selection

Editable Team run configuration:

```js
localStorage.setItem('autobyteus.prototype.context', 'desktop')
localStorage.setItem('autobyteus.prototype.scenario', 'workspace_team_run_config_correction')
location.assign('/workspace')
```

Selected existing Team configuration: use `workspace_team_active`, reload
`/workspace`, and activate **Edit Config**.

Workspace file tree:

```js
localStorage.setItem('autobyteus.prototype.context', 'desktop')
localStorage.setItem('autobyteus.prototype.scenario', 'workspace_file_tree_correction')
location.assign('/workspace')
```

Reset:
`localStorage.removeItem('autobyteus.prototype.scenario'); location.reload()`.

## Correction Boundary And Root Cause

The existing prototype retained the exact source presentation, but the two
named experiences lacked reliable current-state substantiation:

1. The Team launch draft appeared in an earlier journey capture, but there was
   no direct, independently selectable inventory scenario for its validation,
   member disclosure, workspace-readiness, or auto-approve states. The active
   Team fixture also exposed only a partial configuration view, so opening
   **Edit Config** could fail instead of rendering the source read-only form.
2. Earlier Files evidence pre-seeded a lowercase non-source file type, which
   rendered “Preview not available,” and the prototype boundary intercepted
   the otherwise local file-selection actions. It therefore did not
   substantiate a source-shaped Markdown preview, folder disclosure, active
   file transition, or folder context menu.

The correction adds two small browser-local scenarios, provides the complete
source-shaped Team configuration projection, uses source-shaped `Text` file
records for the focused Files scenario, and permits only the necessary local
file-tab/selection actions. It changes no pinned presentation component and
introduces no production service, filesystem, runtime, persistence, protocol,
or credential dependency.

## UI Experience Inventory

The durable evidence root is:

`/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001-baseline-correction-2/evidence/AORG-FLAT-TEAM-001/baseline-correction-2`

| ID | Route / Surface | Exact observable obligations | States / operations | Scenario | Source evidence | Prototype evidence | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `UXB-CORR-TEAM-RUN-CONFIG-001` | `/workspace` center Team run configuration | Exact Team Definition, runtime/model fields and help, workspace mode/selector/feedback, auto-approve switch, member override disclosure/cards, Run Team readiness, and selected-run read-only treatment | Missing workspace + disabled Run; member disclosure expanded; existing workspace selected + enabled Run; auto-approve on; selected active Team opened read-only | `workspace_team_run_config_correction`; `workspace_team_active` for selected-run state | `source/UXV-CORR-TEAM-RUN-CONFIG-001-source.png` through `005` plus machine rows | `prototype/UXV-CORR-TEAM-RUN-CONFIG-001-prototype.png` through `005` plus machine rows | **Pass** |
| `UXB-CORR-WORKSPACE-FILE-TREE-001` | `/workspace` Files tree, tabs, and viewer | Exact search/tree geometry; folder/file icons, labels, indentation and active row; correct Markdown tab/preview; folder disclosure; file selection; source folder context actions | Populated/expanded; collapsed; `evidence.md` selected with matching active tab/preview; folder context menu open | `workspace_file_tree_correction` | `source/UXV-CORR-WORKSPACE-FILE-TREE-001-source.png` through `004` plus machine rows | `prototype/UXV-CORR-WORKSPACE-FILE-TREE-001-prototype.png` through `004` plus machine rows | **Pass** |

Material matched context for every row: Chromium 149, English, light theme,
reduced motion, UTC, desktop `1440x900`, identical synthetic fixture values,
local assets, and blocked non-loopback requests. Narrow/mobile is not a
permutation of these named desktop Workspace inventory IDs; previously accepted
narrow and mobile inventory remains outside this focused correction.

## Journey Inventory

| Journey ID | Starting scenario | Steps and visible outcomes in source and prototype | Recovery | Result |
| --- | --- | --- | --- | --- |
| `UXJ-CORR-TEAM-RUN-CONFIG-001` | `workspace_team_run_config_correction` | Observe missing-workspace feedback and disabled Run; expand Team Members; select `Prototype Workspace`; Run becomes enabled; activate auto-approve and observe the switch/draft state | Fresh context/reload restores the deterministic missing-workspace draft and collapsed members | **Pass** |
| `UXJ-CORR-TEAM-RUN-CONFIG-002` | `workspace_team_active` | Activate **Edit Config** on the selected Team; exact Team configuration renders with disabled runtime/workspace/auto-approve controls and the read-only notice | Fresh context/reload returns to the active Team conversation | **Pass** |
| `UXJ-CORR-WORKSPACE-FILE-TREE-001` | `workspace_file_tree_correction` | Observe expanded `docs` and active `requirements.md` Markdown preview; collapse the folder; in a fresh context select `evidence.md` and observe exact active row/tab/preview; open the folder context menu and observe Add File, Add Folder, Rename, Delete | Fresh context/reload restores expanded `docs` and active `requirements.md` | **Pass** |

## Exact Visual Fidelity Comparison

| Visual IDs | Surface / state | Comparison result |
| --- | --- | --- |
| `UXV-CORR-TEAM-RUN-CONFIG-001`–`005` | Editable validation, member disclosure, workspace-ready, auto-approve-on, and selected-run read-only Team configuration | Exact semantic/state, geometry, computed style, action/focus and screenshot bytes; zero errors |
| `UXV-CORR-WORKSPACE-FILE-TREE-001`–`004` | Populated Markdown tree/viewer, collapsed folder, selected file/preview, and folder context menu | Exact semantic/state, geometry, computed style, action/focus and screenshot bytes; zero errors |

All nine source/prototype screenshots are byte-identical (`changedPixels: 0`,
`maximumChannelDelta: 0`). Machine results:

- `aorg-team-config-file-tree-correction-results.json`
- `aorg-team-config-file-tree-correction-summary.json`
- `validation/browser-comparison.txt`

## Implementation Simplifications

| Production capability visible in the UI | Preserved experience | Prototype simulation | Intentionally absent |
| --- | --- | --- | --- |
| Team launch configuration | Exact editable fields, validation, member inspection, workspace readiness and local control changes | Fixed Team definition/model/workspace, deterministic draft ID and Pinia-local edits | Team launch service, runtime/model calls, persistence |
| Selected Team configuration | Exact disabled controls and read-only notice reached from the real header action | Complete fixed configuration view attached to the synthetic Team context | Historical metadata API and execution backend |
| Workspace filesystem tree | Exact tree/tabs/Markdown viewer, folder disclosure, file selection and context menu | Fixed `TreeNode` hierarchy, two source-shaped in-memory `Text` files, local open-folder/tab state | Filesystem, file API, live file watcher, mutations and writes |

- Retained presentation files: nine source presentation components are exact
  byte matches to the pin; no user-visible component was recreated or edited.
- Prototype-native state: existing Pinia presentation stores plus two
  deterministic scenario projections.
- Synthetic values: Product Review Team, Prototype Workspace, two members,
  runtime/model labels, file paths/content, IDs, conversations, and timestamps.
- Scripted asynchronous behavior: browser settling and fixture installation
  only; disclosures, selections, menu activation, validation and switches are
  real Vue interactions.
- Retained production store/client/protocol/runtime for capability: `None`.

## Validation

- Matched browser command:

  ```bash
  SOURCE_BASE_URL=http://127.0.0.1:4283 \
  PROTOTYPE_BASE_URL=http://127.0.0.1:4183 \
  MOCK_BASE_URL=http://127.0.0.1:4383 \
  corepack pnpm validate:aorg-team-config-file-tree-correction
  ```

- Matched browser result: `9/9` pass; exact DOM/state, geometry, computed-style,
  action/focus and byte-identical screenshots; zero browser errors.
- Independent documented start: `corepack pnpm dev --port 4184`; both new
  scenarios returned HTTP 200 and rendered their exact deterministic state
  after the source server and observer were stopped. Zero browser errors and
  zero non-loopback requests (`validation/independent-start.txt`).
- `corepack pnpm typecheck`: pass; retained duplicate-getter warnings only.
- `corepack pnpm lint`: pass.
- `corepack pnpm test`: 3 files / 12 tests pass.
- `corepack pnpm validate:boundaries`: 13/13 pass.
- `NUXT_IGNORE_LOCK=1 corepack pnpm build`: pass; node-server output.
- Accepted Task Agent / Task Team baseline regression:
  `5/5` matched comparisons pass with zero errors
  (`validation/accepted-baseline-regression.txt`).
- Scenario isolation: every matched comparison used a fresh context, cleared
  storage, explicit scenario/context, deterministic state, reduced motion and
  blocked external requests.
- Known source-observation limitation: the disposable pinned archive required
  the browser-only runtime normalization recorded above. It changed no selected
  source presentation and all selected file hashes are recorded.

## Completion Check

- Explicit separate prototype repository and dedicated Product worktree: `Yes`
- Supplied branch and accepted base verified: `Yes`
- Selected frontend and exact source pin verified: `Yes`
- Independently runnable with documented command: `Yes`
- Every named surface/state/interaction has source and prototype evidence: `Yes`
- Every named journey and deterministic reset works: `Yes`
- Exact browser appearance and behavior for all nine rows: `Yes`
- Production capabilities replaced by local deterministic simulation: `Yes`
- Production credentials, customer data, live dependencies and writes absent: `Yes`
- Known perceptible or behavioral discrepancy in either named ID: `None`
- Failed or unsubstantiated named inventory IDs: `None`

## Known Gaps And Next Action

- Blocked or incomplete named UI inventory IDs: `None`
- User-facing differences or omissions inside the correction boundary: `None`
- Illustrative fixture content: all domain values and file content are
  synthetic and resettable; their presentation and interaction are exact.
- Required Bootstrapper correction: `None`
- Next action: Product Prototyper acceptance review and accepted ticket-branch
  commit. Bootstrapper intentionally did not modify ticket status, user
  approval, `ui-ux-spec.md`, final normative screenshots, canonical prototype
  integration, or repository history.
