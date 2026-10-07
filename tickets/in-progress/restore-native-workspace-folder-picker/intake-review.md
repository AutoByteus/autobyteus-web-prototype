> **Superseding correction (2026-10-07):** Earlier source-staleness inference withdrawn; refresh on hold pending evidence review. See `baseline-conclusion-correction.md`. The fixture-boundary issue is separate from UI currency.

# Intake and baseline acceptance review

Package `restore-native-workspace-folder-picker`; R2 Draft / SR-004. 2026-10-07.
Design root /Users/normy/autobyteus_org/autobyteus-web-design; worktree /Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker; base `8cd41f886459630909e827d7df1b67910618aaac`; source `88fad73cbd20201642acdcfe75e69b1897ec135c` at /Users/normy/autobyteus_org/autobyteus-worktrees/restore-native-workspace-folder-picker/autobyteus-web.

## Evidence and acceptance decision
1. Read request first; selected `product-experience-design`, repository-management skill, shared principles, project DESIGN.md, testing guidance, frontend AGENTS.md, current baseline report and related accepted run-settings/draft tickets.
2. Refreshed design origin and origin/HEAD. Canonical checkout is clean `personal`, local=remote `8cd41f886459630909e827d7df1b67910618aaac` and ahead count zero. Created only this isolated branch/worktree. Source checkout has only the assigning ticket's untracked documents and remains read-only.
3. Root baseline report pins `10fb695…`, not request source `88fad73…`. Source diff since that pin includes run-settings unification and Chat draft changes. Current design contains approved counterparts, but source-current parity must be reconciled, not assumed from earlier approval.
4. **DATA-001 (existing, blocking current acceptance):** `prototype/fixtures/runtime-state.json` is 2,911,993 bytes; `source-state-snapshots.json` is 4,989,853 bytes. Top-level metadata and baseline report explicitly identify source/store captures. The historical WEB-BASELINE-REFRESH-007 ticket carried this as user-deferred; current Product principles explicitly prohibit carrying captured fixtures forward. No assertion that these contain private customer data: reported provenance is synthetic source observation. Nonetheless captures/size fail the current fixture boundary. They must be replaced by small hand-written state, not recaptured.
5. Root report also carries broken legacy workspace/mobile scenarios and un-rechecked host/mobile rows. Old evidence does not substantiate today's changed-context parity. These are baseline evidence gaps, not permission to add future product controls.
6. No source files, app processes, user data or canonical requirements changed. No browser/native behavior tested.

**Decision: Baseline Needed, Refresh.** No future-state editing before candidate acceptance. Existing accepted design-only changes with no source equivalent must be preserved; where the selected source now implements a changed surface, reconcile to source authority. Bootstrap scope is current experience only, not folder-restoration design.

## Supported current journey (source evidence, not a runtime claim)
- `components/chat/ChatWorkspaceMenu.vue`: workspace trigger → search/existing/temp menu → Open another folder → labelled path input → Cancel/Use folder. `startFolder` opens/clears form; `confirmFolder` trims, validates absolute path and emits existing/folder choice, then closes.
- `components/run-settings/RunSettingsCard.vue`: editable workspace renders that menu, locked state renders label/lock instead.
- `OrgLaunchPage.vue`: existing Org configuration entry `/workspace?rootSubjectKind=agent_org&definitionId=…&mode=configuration`; busy settings locked.
- `ExistingRunSettings.vue`: saved root workspace always locked; member workspace only editable for Org when `canEdit` permits it. No new unlock implied.
- `composables/useNativeFolderDialog.ts`: picker exists but returns null on cancel/no path/exception; current shared menu has no picker call. Explicit failure feedback may need downstream differentiation of outcomes; Product will specify user behavior, not production architecture.
- Existing Run/Chat and member entry paths come from the supplied investigation EV-001..010. Retired forms are not current design targets.

## Review coverage to build after baseline acceptance — not executed
| Scenario | Review focus | Preserved check |
|---|---|---|
| SCN-001 | Agent/Team local selection discovery, choose and apply | No auto-send/start or early workspace registration |
| SCN-002 | Org root and editable placed-Team setting | Intended field only; saved root/non-editable members locked |
| SCN-003 | Browser/remote/mobile manual absolute path | No local-machine picker offered for remote filesystem |
| SCN-004 | Cancel, no path, failure, repeat attempt, typing fallback | Typed draft and selected workspace retained |
| SCN-005 | Search/temp/existing, known path and new pending path | Existing launch/save lifecycle and reuse |

Desktop, narrow layout, keyboard activation/focus return, long paths and field-level errors are part of later review. Native chrome is OS-owned; browser simulation will be labelled and will not certify actual chooser behavior.

## Questions for the later user review
- Is native browsing discoverable in the workspace menu without obscuring recent/existing choices?
- Does the recommended choose/apply sequence avoid accidental changes while staying quick?
- Are manual entry, cancellation and recoverable failure clear and non-destructive?
No answer or approval inferred; the draft's exact Browse placement and extra confirmation are options, not constraints. Do not ask the user to approve before a validated proposal is visible.
