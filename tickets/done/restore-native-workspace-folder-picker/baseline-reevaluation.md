# Re-evaluation under the updated Product skills

Date: 2026-10-07. Package: restore-native-workspace-folder-picker; R2 Draft/SR-004. No UI or requirements approval.

## Authority and workspace
- Reloaded active Product Experience Design, repository-management and shared principles after user direction. Active package checkout/local skill symlinks use merged revision `9fd129728968a702fbbc6fc20b0cd0d4db2ece5b` (PR #33); GitHub merge and local HEAD=origin/main verified. Unrelated canonical changes untouched.
- Product design root: `/Users/normy/autobyteus_org/autobyteus-web-design`.
- Resumed worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker`; branch `design/restore-native-workspace-folder-picker`. No second setup/worktree.
- Design base remains freshly fetched `origin/personal@8cd41f886459630909e827d7df1b67910618aaac`; canonical default did not advance.
- Source remains `/Users/normy/autobyteus_org/autobyteus-worktrees/restore-native-workspace-folder-picker/autobyteus-web` @ `88fad73cbd20201642acdcfe75e69b1897ec135c`.

## Revised decision
**Use the existing accepted UI reference as the starting point for the focused folder-selection design. No broad source refresh or replacement of generated synthetic fixtures is justified by the previous age/size/capture arguments. Those blockers are withdrawn.** The prior Bootstrapper refresh request remains withdrawn/on hold; no new bootstrap request or resumption is sent.

This is reuse of the historical accepted baseline plus subsequent approved design work, supported by a scoped source comparison—not a claim that the entire application has just passed fresh parity testing.

## Actual evidence collected
### Mock-data origin
- Read `prototype/source-observation/fixtures.mjs`: explicit invented agent/team/workspace records and scenario catalog.
- Read `prototype/source-observation/mock-node.mjs` references: serves those fixtures and controlled outcomes.
- Read `prototype/scripts/dump-source-state.mjs`: resets the mock scenario, creates a fresh browser context, captures Pinia state and related observation metadata per route.
- Read `prototype/scripts/build-runtime-fixtures.mjs`: extracts application state from those observations into deterministic runtime snapshots; derives a loading frame only when necessary.
- Read reference plugin imports and applicable existing `mock-boundaries.md`/`ui-baseline-report.md` evidence: local state, intercepted boundaries, resettable contexts and previously tested independent preview with no nonlocal requests.
- Together with earlier JSON inspection, this establishes that the documented method is mock-state capture, which the updated rule expressly allows. Neither file size nor serialization is a violation. No real-data defect demonstrated; no fixture rewrite required by this evidence.
- Limit: not a new content-by-content audit of all 72 snapshots or a fresh independent-run test. Applicable accepted evidence is reused for unchanged data as the updated skill directs.

### Folder-selection UI
- Used `git diff --name-only 10fb695..88fad73 -- autobyteus-web` to identify changes since the historical report. There are UI changes, so did not infer whole-app currency. Compared the actual current reference, not just the old report.
- `ChatWorkspaceMenu.vue`: same complete menu markup after normalizing one equivalent static/dynamic gray-text class expression. Differences otherwise are type names/import order/comments. All state/handlers from `const inBoundary` onward match exactly, including search/temp/existing/pending, opening the path form, absolute-path validation, known-path reuse, selection emission and close/focus behavior.
- Workspace types have the same existing/folder union; differing type/module names do not alter the interface.
- `useAnchoredPopover.ts`: byte-identical. `useMenuInBoundary.ts`: comment-only difference.
- Workspace search filter: exact same function.
- Workspace UI text: all 14 keys match in each of English and Chinese.
- `RunSettingsCard.vue`: editable workspace uses shared menu; locked workspace uses folder/name/lock presentation. Source/reference event contracts differ internally. Reference also contains a no-workspace fallback; reachability was not freshly tested, and no blanket caller parity is asserted.
- Saved root lock and editable-Org-member workspace rule are present on both sides. Outer Chat/Org/member implementations differ because production and reference use different state owners; missing same-named files alone are not missing UI.
- There are unrelated Chat delegation-copy differences (bring-in versus delegate wording). This is not a whole-app up-to-date claim and does not justify blocking the folder-picker work on an app-wide rebuild.
- Machine-checked scoped static comparisons: `scoped-baseline-check.json` (all six checks pass; bilingual copy checks include key counts).

## What is not claimed / next action
No fresh browser rendering, interaction or OS-native picker test ran in this re-evaluation. Those remain part of the focused runnable design/validation and later Engineering native verification. No reference source, fixture, production source or canonical requirements changed.

Next Product stage: keep the existing shell and shared workspace control, design the smallest local-Electron browsing addition, validate the actual affected Chat/Agent/Team/Org/member journeys in the browser, then present a review URL for explicit user confirmation. Existing manual entry, local/remote boundary, locks and launch/save lifecycle remain constraints. Exact placement/application flow remains unapproved.
