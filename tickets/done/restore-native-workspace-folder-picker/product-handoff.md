# Product handoff — restore-native-workspace-folder-picker

**Outcome: Design Completed.** Approved UCONF-001; Product Experience Design. Source solution SR-004 / R2 Draft remains for Solution Designer reconciliation. See successful [integration record](integration-record.md).

## Approved result
Existing workspace menu → Open another folder… → manual field with **Browse…** beside it on eligible local Electron → native directory choice fills field → **Use folder** applies through the existing owner. Non-destructive cancel/empty; inline failure, retry/manual fallback. Manual-only remote/browser/mobile. Existing saved-root locks and currently editable placed-Team policy unchanged.

User approval **UCONF-001**: “Hey, I think this UI is good. The, yeah, the, I just got that confirmed.” Full context in `/Users/normy/autobyteus_org/autobyteus-web-design/tickets/done/restore-native-workspace-folder-picker/user-confirmation.md`. It followed explicit native-dialog versus browser-simulation clarification. UI source `a677e01558b2b9d48253950bc2b8db821358625a`; no post-approval UI delta.

## Durable package paths
- Canonical UI/UX specification: `/Users/normy/autobyteus_org/autobyteus-web-design/tickets/done/restore-native-workspace-folder-picker/ui-ux-spec.md`
- Final normative app references VIS-001..012 and manifest: `/Users/normy/autobyteus_org/autobyteus-web-design/tickets/done/restore-native-workspace-folder-picker/visual-references/`
- Runnable UI reference/canonical design repository: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Ticket: `/Users/normy/autobyteus_org/autobyteus-web-design/tickets/done/restore-native-workspace-folder-picker/product-ticket.md`
- Confirmation: `/Users/normy/autobyteus_org/autobyteus-web-design/tickets/done/restore-native-workspace-folder-picker/user-confirmation.md`
- Final validation: `/Users/normy/autobyteus_org/autobyteus-web-design/tickets/done/restore-native-workspace-folder-picker/final-validation.md`
- Scenario coverage: `/Users/normy/autobyteus_org/autobyteus-web-design/tickets/done/restore-native-workspace-folder-picker/ui-behavior-test-matrix.md`
- Runbook/simulation/reset instructions: `/Users/normy/autobyteus_org/autobyteus-web-design/tickets/done/restore-native-workspace-folder-picker/ui-reference-runbook.md`
- Integration/cleanup: `/Users/normy/autobyteus_org/autobyteus-web-design/tickets/done/restore-native-workspace-folder-picker/integration-record.md`
- Baseline report: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md`; scoped reuse evidence `/Users/normy/autobyteus_org/autobyteus-web-design/tickets/done/restore-native-workspace-folder-picker/baseline-reevaluation.md`
- Historical decision rationale: `/Users/normy/autobyteus_org/autobyteus-web-design/tickets/done/restore-native-workspace-folder-picker/review-round-1.md`

## Provenance and boundaries
Source read-only `/Users/normy/autobyteus_org/autobyteus-worktrees/restore-native-workspace-folder-picker/autobyteus-web` @ `88fad73cbd20201642acdcfe75e69b1897ec135c`. Accepted design base `8cd41f886459630909e827d7df1b67910618aaac`; ticket branch `design/restore-native-workspace-folder-picker`; authoring worktree `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker` (not the durable final owner). Remote default `personal`.

All five scoped scenarios are specified with state/journey mapping. Final browser checks and build/configured typing/lint/14 existing tests/13 boundary checks passed; exact limitations retained. Extra full-root vue-tsc failed with TypeScript stack overflow during review and is not claimed fixed. Chinese strings authored, not independently QA-approved. Native chooser chrome/paths/data/host context are illustrative or simulated; no actual Electron/filesystem/backend/save durability/platform proof. No production software changed. No broad baseline/fixture replacement or blanket snapshot certification.

## Reconciliation finding / next owner
Production helper currently conflates caught picker failures with null cancellation. Approved UX distinguishes them: cancellation is silent; invocation failure gets the inline retry/manual-fallback message. This is a UX obligation, not a prescribed production adapter/architecture.

Return to assigning Solution Designer run `solution_designer_8993f6a03d49417985e8805609b803ce` for canonical requirements reconciliation (REQ-001..004, BEH-001..004, SCN-001..005, AC-001..007) and their normal downstream workflow. UI approval does not independently approve R2 requirements, architecture or production readiness. No open UI design decision remains; technical integration/platform validation belongs downstream. Assigning task `ad_hoc_task_45079b88-f602-4945-a4a3-57627cd9762e` may be closed by its owner only after the completed-design handoff.

## Finalization result
Approved package integrated to remote and canonical `personal` at `10d10419a1dd804204e52512044d4e0b8909f5dd`; normal-entry browser check passed on the canonical checkout. This evidence/status-only closure commit is published identically, with its exact final revision supplied in the delivery message. No UI code changed after approval. Processes stopped; isolated authoring worktree removed only after final publication/clean-state verification, with actual result in the completion receipt. Use the canonical paths above, not historical worktree URLs.
