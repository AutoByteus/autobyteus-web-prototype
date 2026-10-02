# UI behavior validation matrix

Package PROJ-TASK-MANAGER-20261002-001 / Draft SR-002; UI approval UF-017 on 2026-10-02. Exact UI 84ed47bac6877e2cdc6350cca789b0c30ffb55a3; source e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71; accepted base df2f5cdaf9b168298dcae79ac47c11f31dd82d7c. Canonical repository /Users/normy/autobyteus_org/autobyteus-web-prototype; final artifact/integration state in prototype-ticket.md. This is focused prototype validation, not production AC completion.

## Post-approval browser checks
Normal entry `/` → Chat → Projects, no preview switch; user installation untouched. Browser controlled through cua_repl. Values handwritten, session-only.

| Check | Result | Observed evidence |
|---|---|---|
| FV-001 | Pass | Root redirected to Chat; normal Projects navigation opened /projects without preview switches. |
| FV-002 | Pass | New Task is a normal page; empty save displays Describe the task. and focuses description. |
| FV-003 | Pass | Sample voice transcription inserted editable text; save blocked while recording/transcribing. Native picker attached handwritten 87-byte review-note.txt; no permission changed (extension chooser blocked file-URL access). |
| FV-004 | Pass | Create returns to all Tasks in this Project; new To Do task, context preview and 1 file visible; success marker expires. |
| FV-005 | Pass | Description appears once; files retained. Edit followed by Delete visible; no Task information/ID/timestamp section. |
| FV-006 | Pass | Delete opens inline confirmation, focuses Cancel; Cancel closes it and restores Delete focus. No deletion performed in final screenshot journey. |
| FV-007 | Pass | Task edit returns to same identity/status detail; description updated and saved context file retained. |
| FV-008 | Pass | Nonmatching search shows No matching tasks/Clear search; clear restores three continuous columns and focuses search. |
| FV-009 | Pass | Edit entered via normal link. Existing/New visible; New directly reveals path; return preserves original selection and description, no counts/Edit-Done steps. |
| FV-010 | Pass | Workspaces Add navigates to same Project form with existing and blank entries; Documentation selection/description saved, returns to Workspaces with original link intact. |
| FV-011 | Pass | Blank project name shows Enter a project name. and focuses Name; valid name creates with zero workspaces and opens three empty Tasks groups. |
| FV-012 | Pass | 390x844 board, Project form, Task composer and Task actions inspected; no document horizontal overflow in all references; same three groups stack, actions remain reachable. Viewport override reset. |
| FV-013 | Pass | No browser console errors returned. |

DOM column count uses section[data-testid^="project-task-column-"]; an earlier broad prefix also matched header count spans and was corrected before persisting the final record. Three actual containers; row shadow none, border/radius/margins 0px. Review FS checks additionally measured inter-row gap 0px. Screenshots were visually inspected: hierarchy, continuous density, paired choices and narrow action fit. Natural scroll below form viewport is permitted, not clipped overflow.

## Applicable earlier deterministic regressions
| Evidence | Coverage / result | Boundary |
|---|---|---|
| Round 1 RV-001–023 | Zero/multiple links and descriptions, validation, Add/Edit/Cancel/later links, normal entry; Pass | Prior visual form refinements superseded by VIS final refs |
| Round 2 notice checks | Create/save notice visible then expiry ~2.96/3.01s; query/tab preserved; Pass | Final same timer code; no notification system |
| Round 3 TP-001–020 | Task create/edit/Cancel/keyboard shortcut, identity/status/search, explicit deletion/removal, not-found/new Project/counts; Pass | Metadata presentation subsequently removed |
| Round 4 TI-001–020 | Voice success/no-speech/error, text merge/pending/cancel; files/removal/clear/save/cancel/image preview; Pass | Simulated voice, no real microphone; local files |
| Round 5 FS-001–009 | Continuous three columns, create-to-board, action adjacency/confirmation/focus; narrow fit; Pass | Dropdown New-folder alternative superseded |
| Round 6 WC-001–006 | Existing/New direct choices, mode draft preservation, narrow overflow; Pass | No filesystem action |

Historical RF/SB alternate-view comparisons and review screenshots are not current normative design. Links resolve under review-evidence/ and review-round-*.md.

## Final command validation, 2026-10-02
- `corepack pnpm test`: **Pass**, 24 tests / 5 files (4 Project-store tests, 8 Task-store tests, inherited fixture/scenario tests).
- `corepack pnpm lint`: **Pass**, configured scripts/plugins/tests scope. Does not lint all copied Vue feature components.
- `corepack pnpm exec vue-tsc --noEmit -p tsconfig.prototype.json`: **Pass**, configured prototype plugins/tests scope. Not comprehensive copied-feature TypeScript coverage.
- `corepack pnpm build`: **Pass**, after stopping only ticket-owned dev PID 80255. Final changed templates compiled; Nuxt/Nitro build complete. Existing duplicate-import/chunk-size warnings, not production performance assurance. Durable [build log](final-build-output.txt).
- `git diff --check`: **Pass**.
- Browser console error log: empty for final test tab. Native filechooser API hit extension file-URL permission limitation; native macOS picker successfully selected only the handwritten 87-byte review-note.txt. No browser permissions/settings changed.
- Desktop actual native viewports 1512×862 / 1512×806, narrow 390×844; temporary override reset.
- Post-integration default-entry smoke evidence is appended to final-browser-validation.json and ticket before completion.

## Not validated / not approved by these checks
Production persistence or API/MCP parity; node rebinding of prototype-native authoring state; real mic/transcription/file upload; attachment storage/security/permissions; status tools/ownership; agents/teams/dependencies/dispatch/results; actual phone keyboard/device/AT; exhaustive source parity at e04cfef; exhaustive WCAG or performance. Known inherited Project-delete open-count issue remains a requirement gap, not a passed deletion count criterion.
