# Review round 6 — restore familiar workspace choices

PROJ-TASK-MANAGER-20261002-001 / SR-002 Draft. **Awaiting User Review**; not an approved or completed Product stage.

## Feedback and focused change
UF-016: “I still like the earlier like the ad workspace. There are two buttons which is existing and new. I can click the new and currently you made the user journey for ad workspace a little bit too complicated. I have to select the path and then ealirer there are two button existing and new, please use earlier please”.

Restore the familiar two visible choices, **Existing workspace / New folder**, for each optional workspace entry. Existing shows the existing-workspace selector; New directly shows Folder path. Remove “Link a folder by path…” from the selector. Switching modes preserves the previously chosen workspace, typed path and description. All fields remain directly editable, with Add/Remove only. Do not reintroduce counts, nested cards or Edit/Done steps. Three continuous Task columns, adjacent Task Edit/Delete, no metadata disclosure, page-based flows and Task voice/context files are unchanged.

This supersedes only Round 5’s dropdown-based source choice and its statement that source-mode buttons were removed. UF-015’s proposed label/placeholder changes were not implemented or approved; they are not bundled into this request. PC-012 now uses the user-requested earlier paired choices.

## Validation
WC-001–006 browser checks pass: both buttons visible; dropdown contains existing workspaces only; New shows path directly; selection/path/description preserved across switching; 390×844 no horizontal overflow; no console errors. Desktop capture is 1512×862. See `review-evidence/round-6-workspace-choice-checks.json`.

`corepack pnpm test`: 24 tests / 5 files pass. `corepack pnpm lint`: configured scope passes. `corepack pnpm exec vue-tsc --noEmit -p tsconfig.prototype.json`: scoped check passes. `git diff --check`: passes. Lint/typecheck are not comprehensive checks of the copied Vue feature files; changed template compiled and was exercised in live Nuxt. No full build/prepare rerun to avoid resetting active synthetic review drafts. No current-source parity, actual phone/device/keyboard or production filesystem validation claimed.

Non-normative review aids: `review-evidence/round-6-existing-workspace-desktop.jpg`, `round-6-new-folder-desktop.jpg`, `round-6-workspace-choices-narrow.jpg`. The change is template-only; existing user drafts/data were not reset. No new store, fixture or production capability. Folder linking remains a scripted memory-only operation, not actual folder creation/registration.

## Review and repository state
Live `http://127.0.0.1:3286/projects/project-prototype-launch/edit` (normal Project Edit entry). Desktop viewport restored; live tab retained. Runtime PID 80255 remains ticket-owned.

Canonical prototype `/Users/normy/autobyteus_org/autobyteus-web-prototype`; active worktree `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/project-task-manager-foundations`; branch `prototype/project-task-manager-foundations`; accepted base `df2f5cdaf9b168298dcae79ac47c11f31dd82d7c`; accepted source pin `e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71`; previous ticket revision `240f2b7`. Current candidate is the commit introducing this report. No integration, promotion, push, production/source change or installed Projects toggle.

No final UI/UX spec, normative VIS references or whole-stage approval. Wider Manager/dependency/execution/result decisions remain open. UF-004 remains: continue Product review directly; no interim Solution Designer handoff.
