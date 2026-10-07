# Product-owned handoff — restore-native-workspace-folder-picker

**Outcome: Awaiting User Review. UI proposal ready; NOT Design Completed.**
Date 2026-10-07; source solution SR-004 / R2 Draft. This replaces the historical Baseline Needed interim result; broad refresh/fixture rewrite was withdrawn. Reason and evidence: [baseline-reevaluation.md](baseline-reevaluation.md).

## Reviewable result
- Review URL: **http://127.0.0.1:4581/chat**.
- Recommended design: existing workspace menu → Open another folder… → manual field with local-desktop Browse beside it → chooser fills field → Use folder applies through the existing owner. Cancel/empty preserve state; inline picker error allows Browse retry/manual entry. Remote/browser/mobile have manual server-path entry only. Existing locks and launch/save lifecycle retained.
- User-confirmation reference: **None**. User asked to continue, not to approve a particular interaction. Product review remains open; this is not implementation authorization.
- Final ticket UI/UX spec / normative final screenshots: not produced before approval. All current images are non-normative review evidence.

## Durable artifacts (absolute)
- Ticket: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker/tickets/in-progress/restore-native-workspace-folder-picker/product-ticket.md`
- Recommendation/alternatives/findings/review images: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker/tickets/in-progress/restore-native-workspace-folder-picker/review-round-1.md`
- Scenario/state coverage and test limitations: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker/tickets/in-progress/restore-native-workspace-folder-picker/ui-behavior-test-matrix.md`
- Running/scenario/reset/mock-boundary instructions: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker/tickets/in-progress/restore-native-workspace-folder-picker/ui-reference-runbook.md`
- Review screenshots/logs: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker/tickets/in-progress/restore-native-workspace-folder-picker/review-evidence/`
- Scoped baseline reuse evidence: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker/tickets/in-progress/restore-native-workspace-folder-picker/baseline-reevaluation.md`
- Applicable historical baseline report: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker/ui-baseline-report.md`

## Source / design provenance
- Source (read-only): `/Users/normy/autobyteus_org/autobyteus-worktrees/restore-native-workspace-folder-picker/autobyteus-web` @ `88fad73cbd20201642acdcfe75e69b1897ec135c`.
- Canonical design repository: `/Users/normy/autobyteus_org/autobyteus-web-design`.
- Active runnable reference: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker`.
- Branch `design/restore-native-workspace-folder-picker`; accepted base `8cd41f886459630909e827d7df1b67910618aaac`.
- Review UI source revision **`a677e01558b2b9d48253950bc2b8db821358625a`**; subsequent evidence-only checkpoint contains this handoff.
- Integration pending explicit review approval; no production edits, push, default integration, ticket closure or worktree removal. Owned preview retained on port4581 (PID41883, session78855).

## Coverage / boundaries
Agent/Team setup, Org root and placed-Team overrides were exercised through normal UI, including existing saved-root locks and an already-editable saved-Org Team. Select/apply, cancel/Escape, empty, failure/retry, manual validation, known-path reuse, search, context gating, keyboard and narrow layout were checked. Build and configured checks passed; extra full-root typecheck crashed with TypeScript stack overflow (unresolved static-check limitation). English browser review completed; Chinese strings added but locale layout not independently reviewed. Details, including an inherited synthetic saved-Org duplicate-row state, are retained rather than hidden.

Chooser chrome, directories, state and host context are synthetic. No native OS dialog, filesystem, Electron bridge, backend, durable save, actual run/launch, permissions or real mobile keyboard has been proven. Production native validation belongs downstream after approval.

Source helper `useNativeFolderDialog.ts` collapses exceptions and cancel to null. If the proposed inline failure feedback is approved, cancellation versus invocation failure must be distinguishable for that UX. Product is not prescribing production architecture.

## Next expected action
Product asks the user to review/confirm the recommendation and continues revisions as needed. On explicit approval Product will produce the final spec and normative references, finalize its repository and return the approved package. Solution Designer then reconciles canonical requirements; until then R2 remains Draft and the assigning task stays open. Do not treat this interim status as a requirements approval, blanket parity certification, Bootstrapper resumption or implementation request.

Assigning Solution Designer run: `solution_designer_8993f6a03d49417985e8805609b803ce`. Stable package unchanged.
