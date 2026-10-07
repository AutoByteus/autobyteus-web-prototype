# Product Ticket — restore-native-workspace-folder-picker

## Identity / current status
- Package and ticket: **restore-native-workspace-folder-picker**. No second ID.
- Mode: **Product Experience Design**.
- Status/outcome: **Awaiting User Review**, round 1, 2026-10-07. Focused UI proposal is runnable, browser-reviewed and committed; not user-approved or implementation-ready.
- Requester: `/solution_designer`, AgentRun `solution_designer_8993f6a03d49417985e8805609b803ce`.
- Product execution: `product_ui_ux_designer_f1b47b534b5e4da49ef50e43e23fbef3`.
- Assigning task `ad_hoc_task_45079b88-f602-4945-a4a3-57627cd9762e` remains open; assigning run owns closure.
- Requirements R2 Draft / SR-004; no approved baseline of this change. Related SCN-001..005, BEH-001..004, UC-001..003, REQ-001..004, AC-001..007, DEC-001.
- Canonical request and requirements: `/Users/normy/autobyteus_org/autobyteus-worktrees/restore-native-workspace-folder-picker/tickets/in-progress/restore-native-workspace-folder-picker/product-design-request.md`, `requirements-doc.md`, `investigation-notes.md`, `solution-revision-record.md` in that folder.
- Scope: folder selection across Chat Agent/Team setup, Org setup and currently editable placed-Team workspace controls.
- Preserve: local embedded Electron eligibility only; manual full paths; existing/temp search/selection; known-path reuse; pending-folder lifecycle; saved-run locks; existing apply/save/launch/data ownership.
- Non-goals: production implementation, remote filesystem browser, native browser/mobile picker, backend/persistence/migration changes, broad baseline refresh or fixture rewrite.

## Repository / source / acceptance
- Canonical design repository: `/Users/normy/autobyteus_org/autobyteus-web-design`.
- Remote: `https://github.com/AutoByteus/autobyteus-web-prototype.git`; default `personal`.
- Active worktree/UI reference root: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker`.
- Branch: `design/restore-native-workspace-folder-picker`; this Product execution owns it.
- Accepted design base/fetched default: `8cd41f886459630909e827d7df1b67910618aaac`. Canonical and origin/personal last verified at this revision; no local-only default commits at intake.
- UI proposal revision: `a677e01558b2b9d48253950bc2b8db821358625a`. Evidence/status checkpoint is the later commit containing this record.
- Source frontend (read-only): `/Users/normy/autobyteus_org/autobyteus-worktrees/restore-native-workspace-folder-picker/autobyteus-web`, source pin `88fad73cbd20201642acdcfe75e69b1897ec135c`.
- Baseline: existing accepted reference plus later integrated approved design work. Historical baseline `b4f3ed12c8402458391917d08945977ab80ea167`, report source `10fb69504f99a615e0728ffdd6c1fcab0104ff05`. The report pin alone does not describe later work.
- Applicable report: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker/ui-baseline-report.md`; scoped currency/provenance acceptance: [baseline-reevaluation.md](baseline-reevaluation.md), [scoped-baseline-check.json](scoped-baseline-check.json).
- Earlier broad refresh/fixture blocker **withdrawn**. Updated active guidance read at agents revision `9fd129728968a702fbbc6fc20b0cd0d4db2ece5b` (PR33 merged). Synthetic captures permitted by provenance; size not a defect. No blanket whole-app certification.
- Historical Bootstrapper dispatch run `ui_baseline_bootstrapper_9f22a91a249f48f7bf87803f910b026c` remains held/withdrawn; not resumed. [Correction](baseline-conclusion-correction.md) preserves history.

## Review / artifacts / evidence
- Review URL: **http://127.0.0.1:4581/chat** — normal entry; no review switch.
- [Review recommendation and decisions](review-round-1.md).
- [Scenario/state coverage, exact checks and limitations](ui-behavior-test-matrix.md).
- [Run/scenario/simulation instructions](ui-reference-runbook.md).
- [Durable Product handoff](product-handoff.md).
- Non-normative review screenshots and logs: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker/tickets/in-progress/restore-native-workspace-folder-picker/review-evidence/`.
- Browser evidence: Agent/Team/Org/placed-Team paths; chooser select/cancel/Escape/empty/error/retry; manual valid/invalid; known reuse/search; saved roots and editable saved-Org Team; remote/browser/mobile gating; desktop/narrow layout; keyboard pending state.
- Build, configured typecheck/lint, 14 existing tests and 13 boundary checks passed. Extra full-root vue-tsc failed with a stack overflow, cause unestablished. Configured typing/lint do not cover all Vue presentation files. All details retained, not converted into a pass.
- Native/production boundaries: chooser is an illustrative browser dialog; no real Electron bridge, disk, backend, OS permission, real mobile keyboard or save durability evidence. Existing synthetic fixtures unchanged.
- User-confirmation reference: **None**. “Work on the UI first” and “continue your work” authorize design only.
- Ticket-specific final `ui-ux-spec.md` and normative final references: **not produced**, pending explicit approval and final validation. Existing root/other-ticket specs do not approve this change.

## Runtime / integration / cleanup
- Initial owned Nuxt dev PID 80070/session 31571 stopped for build; first build refusal due active dev lock retained in validation narrative.
- Current owned built preview: `HOST=127.0.0.1 PORT=4581 node .output/server/index.mjs`; PID **41883**, execution session **78855**, bound loopback only. Build output stays in this worktree's `.output`.
- Browser: Chrome tab 1211486311, default viewport restored after 390×844 checks; retained for review.
- Mock state: separate loopback origin; fixture defaults restored local-electron/choose before commit. Reload/reset methods in runbook; no installed app data touched.
- Integration: **Pending user approval**. No ticket push or default merge. Local branch checkpoint only; canonical/source untouched.
- Default-entry validation after integration: not applicable yet. Ticket-branch built preview's normal `/chat` verified.
- Cleanup: **Pending active review**, intentionally keep worktree and current preview. No other process stopped.

## Next action / routing
Ask for explicit feedback on Browse discovery/placement, choose-then-Use-folder, and cancel/error/retry. Iterate within scope; after approval, final validation → normative captures/spec → repository integration → approved Product handoff for Solution Designer's requirements reconciliation. Do not close the assigning task during review.

Call current handoff rules for this interim status. No Baseline Needed outcome remains. If no rule matches, return this accurate interim package to the assigning run; it is not permission to implement or treat UI/requirements as approved.
