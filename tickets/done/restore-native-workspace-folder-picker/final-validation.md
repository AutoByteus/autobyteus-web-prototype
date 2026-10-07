# Final validation — approved folder selection

Package `restore-native-workspace-folder-picker`; approval UCONF-001; UI source `a677e01558b2b9d48253950bc2b8db821358625a`; source pin `88fad73cbd20201642acdcfe75e69b1897ec135c`; accepted base `8cd41f886459630909e827d7df1b67910618aaac`. Date2026-10-07. Full provenance: [spec](ui-ux-spec.md).

## Post-confirmation browser validation
Normal `/chat` entry and normal target chooser/navigation: Agent choose/apply and chooser Escape with unchanged field/selection; Team manual apply; Org root browse/choose/apply; placed-Team browse/choose/apply with Org default unchanged; saved Agent root lock; invalid manual path; failure with preserved input/current selection, successful retry and known-path reuse; remote manual fallback; mobile-context390×844 and narrow local-desktop390×844. All observed expected states. Twelve newly captured final references, not promoted old review images: [manifest](visual-references/manifest.json).

Visual review: changed form hierarchy, inherited compact typography and neutral palette, input/Browse alignment, readable wrapped failure, panel containment, bottom-sheet fit and focus treatment inspected. No changed-surface clipping or unintended drift found. System native chrome is deliberately not normative. Browser observations model native outcomes, not native operation.

Temporary `hostFixture` starting values selected error/remote/mobile for deterministic checks; actual Browse caused the outcome. Restored `local-electron`/`choose` and verified zero source diff from approved revision. No reviewer UI/URL switch added. All actual UI source remains byte-identical to the approved revision. Clarified the written keyboard description to preserve the existing document-level Escape dismissal; this is not a source/behavior change.

A browser tool timeout was recovered by reading the existing tab's current state before continuing. User interruption later closed the old tab and dev process; resumption verified the free port, restarted only the ticket server and repeated error/retry in a fresh tab. No incomplete call is counted as a pass. Viewport overrides restored.

## Post-confirmation commands
From the ticket worktree, after restoring fixture defaults and stopping its owned dev server:
`corepack pnpm typecheck && corepack pnpm test && corepack pnpm lint && corepack pnpm validate:boundaries && corepack pnpm build`

Exit0. 3 existing test files/14 tests and13 boundary checks pass. Build complete; duplicate getters auto-import and large-chunk warnings remain in [checks.log](final-evidence/checks.log). Configured typing/lint are infrastructure-scoped, not a complete presentation typecheck. Earlier additional whole-root vue-tsc stack overflow is retained in [failure log](review-evidence/full-vue-tsc-failure.log), not rerun or misrepresented as fixed. [Boundary output](final-evidence/boundary-validation.json).

## Coverage reuse and limits
The unchanged code's round-1 matrix supplies empty-return, ordinary-browser gating, search/no-match, saved Team/Org root and already-editable saved-Org Team cases; see [matrix](ui-behavior-test-matrix.md). Post-confirmation validation is focused, not a new blanket full-app/72-state audit. English screenshot locale only; Chinese translation/layout QA not independently completed. No actual OS picker, filesystem, permission, mobile keyboard, Electron bridge, backend durability, production save or run-launch test.

## Integration validation
Default-branch normal-entry check and repository/cleanup receipts are in [integration-record.md](integration-record.md); final handoff must not claim integration until those checks succeed. UI source no-diff, final screenshot hashes/dimensions, relative links, requirement/approval references and known limitations were checked before integration.
