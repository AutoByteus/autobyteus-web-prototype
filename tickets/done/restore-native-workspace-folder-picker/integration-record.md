# Integration record — restore-native-workspace-folder-picker

## Accepted and integrated revisions
- Approval UCONF-001; approved UI code `a677e01558b2b9d48253950bc2b8db821358625a`.
- Source pin `88fad73cbd20201642acdcfe75e69b1897ec135c` (production read-only).
- Separate canonical design repository `/Users/normy/autobyteus_org/autobyteus-web-design`; default `personal`.
- Accepted base `8cd41f886459630909e827d7df1b67910618aaac`; pre-integration fetch confirmed no base advancement or local-only default commits.
- Approved artifact integration **`10d10419a1dd804204e52512044d4e0b8909f5dd`**: ticket branch pushed to origin/personal fast-forward; clean canonical personal fast-forwarded to the same revision. Confirmed by Git tools.
- This receipt is a subsequent **evidence/status-only closure commit**, published with the same push-then-canonical-fast-forward sequence. Its exact SHA and final local/remote equality are carried in the completed handoff receipt. It changes no UI source, fixture defaults, dependencies or final normative images.

## Integrated normal-entry validation — Completed
Started canonical default checkout with `corepack pnpm dev --port 4582` on an available owned loopback port. Normal `/chat` loaded without any preview switch. Workspace → Open another folder → Browse → choose client-portal → path filled while Temp remained selected → Use folder closed menu and selected client-portal. Existing field Escape also verified: closes the popover, returns focus to workspace chip, does not apply. The written spec records this retained behavior; no source change.

Evidence: [before apply](final-evidence/default-branch-before-apply.jpg), [after apply DOM](final-evidence/default-branch-after-apply-dom.txt). Viewport restored; final tab closed. No unrelated canonical files modified. Raw check logs contain tool-emitted trailing spaces, so source/artifact whitespace checking excluded `*.log`; raw evidence was retained verbatim.

## Runtime and cleanup
- Historical review built-preview PID41883 stopped for final captures; final ticket dev PID87420 stopped for validation/build.
- Canonical verification dev PID50101/session64331 stopped after successful browser verification; loopback ports4581/4582 checked free before completion.
- Ticket branch `design/restore-native-workspace-folder-picker` retained as history. Authoring worktree `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker` is removed after closure publication and clean-status verification. The completion handoff verifies actual absence; if removal fails, it reports the exact cleanup limit rather than inferring success.
- Only owned ignored `.nuxt`, `.output` and installed `node_modules` remain disposable in that isolated worktree; no unrelated dirty/untracked files may be discarded. Canonical runnable root and committed ticket under `tickets/done/` remain durable.

## Limits retained
Git remote printed a dependency-vulnerability summary (3 high/4 moderate); not investigated or certified here, and no dependency/lockfile changed. Earlier full-root vue-tsc stack overflow remains an explicit validation limit. Native/production/platform limitations and Chinese locale QA are in the spec. Integration of a design reference is not production deployment.
