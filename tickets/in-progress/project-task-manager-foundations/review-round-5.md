# Review round 5 — simplification

PROJ-TASK-MANAGER-20261002-001 / SR-002 Draft. Product experience candidate only; **Awaiting User Review**, not a completed or approved Product stage.

## User direction and current candidate
- UF-008: Task detail looks poor; creating a Task should return to the Project’s Tasks page, not open detail.
- UF-009/010: Task board and Project form need better visual hierarchy.
- UF-011: “remove the list view, we only have board. dont make it complicated”; “i want to have clean and simple ui”; “basically 3 columsn. just like earlier. the earlier simplicity is already good”. The added alternate List view and status-filter controls were rejected and removed, including their uncommitted preference module/tests. This is not approval of the full Product stage.
- UF-012: each status should read as one column, not many floating cards with vertical gaps. Three continuous white column surfaces now contain contiguous Task rows, thin dividers, no individual row borders/radii/shadows or vertical gaps. Keep the original Search + New task and To Do / In Progress / Done structure. No new drag/status controls. Narrow layout stacks the same status groups.
- UF-013: Workspaces became over-engineered; simplify rather than add. Optional workspace selection and description are directly editable. Keep Add/Remove only; remove workspace counts, compact summaries, Edit/Done steps, nested cards and source-mode buttons. A native selector also offers folder-path linking; the path field appears only when chosen. No actual filesystem registration or file movement.
- UF-014: remove Task information/ID/timestamps; Delete should be next to Edit. The detail page shows description once, optional saved context, read-only status, Edit then Delete at the top right. No information disclosure or visible ID/date metadata. Delete still opens explicit inline confirmation with Cancel focused first; Cancel restores Delete focus. No active-work/deletion policy inferred.
- PC-010: create returns to the full Project Tasks board with old search cleared so the new row is visible; green success notice clears after 3000ms. Edit still returns to detail.
- PC-011: board-only continuous status columns, superseding the rejected List/Board comparison and separate-card presentation.
- PC-012: plain optional workspace authoring in the single Project form, superseding the compact-summary/Edit/Done proposal.
- PC-013: visible adjacent Task Edit/Delete actions, no Task information section.

## Validation and evidence
Final browser checks **FS-001–009 pass**: three continuous containers; measured inter-row gap 0px and no row shadow/border/radius; create-to-board; description/detail navigation; Delete beside Edit; no Task information/ID; inline delete confirmation/Cancel focus; direct workspace authoring, folder-path selection/Add/Remove; Project save; 390×844 action fit and horizontal overflow checks; no console errors. See `review-evidence/round-5-final-simplification-checks.json`.

Commands: `corepack pnpm test` (24 tests / 5 files pass), `corepack pnpm lint` (configured scope passes), `corepack pnpm exec vue-tsc --noEmit -p tsconfig.prototype.json` (scoped check passes), `git diff --check` passes. Configured lint/typecheck do not comprehensively check copied Vue feature components; those changed templates were compiled and inspected in the live Nuxt browser. No new full Nuxt build/prepare was run in this round to avoid invalidating the user’s active session-only review drafts; Round 4’s build is historical, not a Round 5 build claim.

Earlier RF-001–032 and SB-001–006 checks/screenshots preserve iteration history. Their List/Board, separate-card, compact workspace and Task-information states are **superseded**, not current approval references. Earlier zero-workspace creation, required-name validation and per-workspace save/cancel were inspected before the final template simplification; no fresh final zero-task creation was completed after the review tab changed. The final board template keeps all three columns even when empty. Browser action timeouts/detached nodes during live review were recovered through fresh state or separate tabs; no user record was deleted/reset. Final form changes were template-only to avoid remounting active workspace drafts.

Current non-normative review screenshots:
- `review-evidence/round-5-continuous-columns-desktop.jpg` — 1512×806, continuous Task columns.
- `review-evidence/round-5-continuous-columns-narrow.jpg` — 390×844, stacked continuous status groups.
- `review-evidence/round-5-simple-task-actions-desktop.jpg` and `round-5-simple-task-actions-narrow.jpg` — adjacent Edit/Delete, no metadata disclosure.
- `review-evidence/round-5-simple-project-form-desktop.jpg` and `round-5-simple-project-form-narrow.jpg` — direct optional workspace fields.

## Boundaries and review state
Preserved accepted product shell, primary navigation, Project Tasks/Workspaces tabs, page-based authoring, voice/context files and existing confirmation safeguards. All data remain synthetic and session-only. Voice is scripted, files are local metadata/image previews; no real mic/transcription/upload/persistence, phone keyboard/device compatibility, backend or orchestration claim. Manager, dependencies, execution linkage and results remain open discussion. Draft REQ-007/009, SCN-002/005/006 and DEC-006 remain traceability context; canonical requirements were not edited.

Live: `http://127.0.0.1:3286/projects/project-prototype-launch`; Project edit `/projects/project-prototype-launch/edit`; stable Task detail `/projects/project-prototype-launch/tasks/task-outline`. Existing user drafts/tabs left intact; temporary viewport reset to desktop. Runtime PID 80255 remains ticket-owned.

Canonical repository `/Users/normy/autobyteus_org/autobyteus-web-prototype`; active worktree `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/project-task-manager-foundations`; branch `prototype/project-task-manager-foundations`; accepted base `df2f5cdaf9b168298dcae79ac47c11f31dd82d7c`; accepted source pin `e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71`. Ticket revision is the commit introducing this report; previous candidate `89234ba`. No integration, promotion, push or source/installed-app change. Projects default-off remains untouched.

No final `ui-ux-spec.md` or normative VIS references; no final approval. UF-004 gate remains: continue direct Product review, **no Solution Designer handoff until the user finishes and confirms the design**.
