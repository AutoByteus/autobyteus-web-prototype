# Approved prototype runbook

Package PROJ-TASK-MANAGER-20261002-001 / Draft SR-002. Approved UI revision 84ed47bac6877e2cdc6350cca789b0c30ffb55a3, source e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71, base df2f5cdaf9b168298dcae79ac47c11f31dd82d7c. Final integration/cleanup in prototype-ticket.md.

## Run the canonical accepted prototype
```bash
cd /Users/normy/autobyteus_org/autobyteus-web-prototype
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 3210
```
Use an unused, explicitly owned loopback port if 3210 is occupied. Do not stop another ticket's process. Root `/` opens Chat; click Projects. The default populated synthetic scenario provides Prototype Launch. Its Project Edit, Workspaces Add/Edit, New Task and Task row links are all normal entry points, not hidden previews.

Review this slice via `/projects`, `/projects/project-prototype-launch`, `/projects/new`, `/projects/project-prototype-launch/edit`, `/projects/project-prototype-launch/tasks/new`, `/projects/project-prototype-launch/tasks/task-outline` and `/projects/project-prototype-launch/tasks/task-outline/edit`. Query `tab=workspaces` is ordinary tab state, not preview promotion. Historical review port was 3286.

All values are synthetic. Project/Task save is browser memory only; full reload resets the new stores and any unsaved changes. Do not rely on mock IDs or file object URLs across reload. Existing scenario catalog uses `autobyteus.prototype.scenario` (default populated; empty for empty records); change only a test-owned origin/session. Voice success is the default sample; optional `voiceDemo=error` or `voiceDemo=no-speech` exercises recovery without microphone access. These demo query switches are not needed for normal approved UI.

Workspace New folder accepts a fake path and simulates a link, not actual folder creation/registration. Task Attach Files reads local metadata, and images get a browser object URL for inline preview; no network upload. Native picker can test fixture files in this ticket's review-evidence/test-fixtures/ folder. Do not enable extension file URL permissions merely for validation; native picker fallback is sufficient.

## Validation
```bash
corepack pnpm test
corepack pnpm lint
corepack pnpm exec vue-tsc --noEmit -p tsconfig.prototype.json
corepack pnpm build
```
Stop your own dev process before the build; Nuxt prepare/build can invalidate session-only mock drafts during active review. Lint/TS scope is limited (see matrix). UI validation uses browser-visible actions and normal navigation, desktop and narrow viewports. Final references are in visual-references/; domain values/counts may differ after reset, exact design may not.

## Ownership and cleanup
Authoring worktree: /Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/project-task-manager-foundations, branch prototype/project-task-manager-foundations. Runtime PID 80255 was stopped for final build; no production/source service was changed. Final integration smoke runtime ownership and stop state are recorded in prototype-ticket.md. Start a new owned runtime for subsequent review. Retained ticket worktree is archival/resumption material, not a new canonical owner; no remote push performed.
