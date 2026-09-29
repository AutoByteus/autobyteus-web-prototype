# Prototype Ticket

## Identity And Scope

- Product ticket: `chat-interface-entry`
- Stable requirements package: `chat-interface-entry` (SR-001 → SR-003, requirements Approved)
- Title: Chat entry above Agents, New chat, and easy runtime/model selection
- Status: `Completed` (revision R3: chat run view top area and right-side tabs, SR-012)
- Mode: `Product Experience Prototyping`
- Requester: Solution Designer (`/software_engineering_team/solution_designer`), Product Design Requested (New Request), 2026-09-28
- Decision questions: DEC-001 (primary: runtime + model picker), DEC-002 to DEC-007 (supporting); REQ-001 to REQ-007 draft
- Requirements context: `/Users/normy/autobyteus_org/autobyteus-worktrees/chat-interface-entry/tickets/in-progress/chat-interface-entry/`

## Repository And Baseline

- Canonical prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`
- Product task worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/chat-interface-entry`
- Product ticket branch: `prototype/chat-interface-entry`
- Accepted prototype base at creation: `ba67ac069e6cf0bb95a7342a7e25185f08a0d4e4`
- Current accepted prototype base: `5ae0fe1` (`WEB-BASELINE-REFRESH-001`, source pin `origin/personal@fcd3e83a4ca931ba52ed19bd37b8df3050ee529e`)
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`

## Pause Reason (resolved)

On 2026-09-28 the user asked to bring the prototype baseline up to the latest source before continuing. `WEB-BASELINE-REFRESH-001` refreshes the baseline to `origin/personal@fcd3e83a4`. This ticket resumes on the refreshed accepted base, reconciling the uncommitted WIP deliberately.

## Review Round 1

- Review URL: http://127.0.0.1:3271/chat (ticket-owned dev server, port 3271)
- Scenario selection: `localStorage.setItem('autobyteus.prototype.scenario', 'chat_first_run' | 'chat_catalog_error')`, then reload; `localStorage.clear()` to reset.
- Change log: `tickets/done/chat-interface-entry/prototype-change-log.md` (PC-001..PC-010 in round 1)
- Browser validation: `node prototype/scripts/validate-chat-interface-entry.mjs` → 21/21 pass, 0 browser errors (`review-evidence/round-1/results.json`)
- Static checks: typecheck pass (pre-existing duplicate-import warnings only), lint pass, 12/12 tests.
- Non-normative review screenshots: `review-evidence/round-1/`

## Revision R2 (Chat box correction)

- Request: Solution Designer, Product Design Requested (Result Correction, Chat box only), SR-003 — `/Users/normy/autobyteus_org/autobyteus-worktrees/chat-interface-entry/tickets/in-progress/chat-interface-entry/product-design-revision-request-handoff.md`
- Approved requirements: SR-003 (`requirements-doc.md`, Approved 2026-09-28)
- Scope: DEC-014 (Chat box = existing message box + existing Context Files area; Chat adds footer controls, `/`, `@`, mic), DEC-011 (no Recent; New chat preselects last-used runtime + model), DEC-009 (thinking schema rule stated), DEC-013 (team/org run views unchanged: revert prototype run-view changes; UXJ-010/UIS-010/VIS-020 superseded), DEC-005 consistency (`/` lands on Chat).
- Worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/chat-interface-entry`, branch `prototype/chat-interface-entry`, base `personal@1579886`
- Review port: 3271

## Revision R3 (chat run view top area and right tabs)

- Request: Solution Designer, Product Design Requested (Result Correction), SR-012 — `/Users/normy/autobyteus_org/autobyteus-worktrees/chat-interface-entry/tickets/in-progress/chat-interface-entry/product-design-revision-request-r3-handoff.md`
- User words: "the chat page on top is not in line with the other page … the right side tabs are not the same as other area, workspace area."
- Worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/chat-interface-entry`, branch `prototype/chat-interface-entry-r3`, base `personal@8ac6cad`
- Review URL: http://127.0.0.1:3271/chat?id=chat-skill-review (port 3271)
- Changes: PC-042–PC-047. Validation 32/32, 0 browser errors (CHK-014/015/028 rewritten, CHK-032 added); typecheck pass.

## Final Package (R3)

- User confirmation: user message 2026-09-29 — "I think it looks correct." (after PC-042–PC-047)
- UI/UX specification: `tickets/done/chat-interface-entry/ui-ux-spec.md` (status `Approved`, R3)
- Final visual references: 26 files + `manifest.json`, all recaptured. New: VIS-026 (run settings, live), VIS-027 (narrow chat run view). Renamed: VIS-015 `chat-run-view-live`, VIS-017 `chat-run-settings-stopped`. VIS-020 still superseded.
- Final validation: `validate-chat-interface-entry.mjs` 32/32, 0 browser errors; typecheck pass — `review-evidence/r3/`
- Requirement impact for Solution Designer: REQ-016 (header no longer shows agent · workspace · approval), REQ-014 (after the first message the approval mode is shown under ⚙), REQ-011/REQ-013 (after the first message model/thinking only under ⚙; the run view box is the product box with `/`), DEC-007 (right panel open/collapsed is the shared product setting, product default open, instead of collapsed-by-default in chat).

## Final Package (R2)

- User confirmation: user message 2026-09-28 — "Do you have any more questions? I think now the chat box looks good." (after PC-036–PC-041)
- UI/UX specification: `tickets/done/chat-interface-entry/ui-ux-spec.md` (status `Approved`, R2)
- Final visual references: `tickets/done/chat-interface-entry/visual-references/` — VIS-001–VIS-019, VIS-021–VIS-025 (24 files, recaptured for R2) + `manifest.json` (SHA-256 per file); VIS-020 superseded (DEC-013) and removed; VIS-002 renamed `VIS-002-model-menu-search-runtimes-1440x900.png`
- Change log: PC-036–PC-041 (R2); PC-029–PC-031 superseded
- Final validation: `validate-chat-interface-entry.mjs` 31/31 pass, 0 browser errors; typecheck pass — `review-evidence/r2/`
- Default entry point: `/` lands on `/chat` (DEC-005)
- Open items: none (DEC-005, DEC-009, DEC-010, DEC-011, DEC-012, DEC-013, DEC-014 resolved in SR-003)

## Final Package (R1, superseded in part by R2)

- User confirmation: user message 2026-09-28 — approval conditional on a final consistency check ("If you think everything is consistent, then I think we're done with prototype UI … create the details … so that [the] solution engineer [has] enough UI specification"). Final consistency pass completed (PC-035); no discrepancy remained.
- UI/UX specification: `tickets/done/chat-interface-entry/ui-ux-spec.md` (status `Approved`)
- Final visual references: `tickets/done/chat-interface-entry/visual-references/VIS-001`…`VIS-025` + `manifest.json` (SHA-256 per file)
- Behavior matrix: `ui-behavior-test-matrix.md`; runbook: `prototype-runbook.md`; change log: `prototype-change-log.md` (PC-001–PC-035)
- Final validation: `validate-chat-interface-entry.mjs` 30/30 pass, 0 browser errors (1 known baseline upload error classified separately), typecheck pass — `review-evidence/final-validation/`
- Default entry point: `/chat`, reached from the first primary-navigation item `Chat` with no preview-only state (the approved experience is part of the normal product shell).
- Open items for Solution Designer: OPEN-001 thinking control shape (schema-driven), OPEN-002 landing route (DEC-005), OPEN-003 Daily Assistant provisioning, OPEN-004 Recent persistence scope, OPEN-005 instruction wording, DEC-008 disposition.

## Integration And Cleanup (R3)

- Ticket result revision: `39dbef1` on `prototype/chat-interface-entry-r3` (review commits `3286937`–`314a976`, final package `f898789`, move to done `39dbef1`)
- Integration: `Completed` — canonical `personal` fast-forwarded `8ac6cad` → `39dbef1` (this record is the following docs commit on `personal`).
- Baseline promotion: `Completed` — the chat run view is reached through the normal product shell (`/chat?id=<runId>`, Workspaces tree); no preview-only state.
- Post-integration validation: canonical `personal` on port 3212 — `validate-chat-interface-entry.mjs` 32/32 pass, 0 browser errors; `pnpm test` 12/12 (`review-evidence/post-integration-r3/results.json`). VIS manifest: 26/26 SHA-256 match.
- Remote: `personal` pushed to `origin` (`AutoByteus/autobyteus-web-prototype`).
- Cleanup: review server (3271) and canonical validation server (3212) stopped; ticket worktree and merged local branch `prototype/chat-interface-entry-r3` removed.

## Integration And Cleanup (R2)

- Ticket result revision: `efa5a97` on `prototype/chat-interface-entry` (R2 implementation `883751c`, final package `af5b6b0`, move to done `efa5a97`)
- Integration: `Completed` — canonical `personal` fast-forwarded `1579886` → `efa5a97` (this record is the following docs commit on `personal`).
- Baseline promotion: `Completed` — the approved experience is part of the normal product shell (`/` lands on `/chat`); no preview-only route or state.
- Post-integration validation: canonical `personal` on port 3212 — `validate-chat-interface-entry.mjs` 31/31 pass, 0 browser errors; `pnpm test` 12/12 (`review-evidence/post-integration-r2/results.json`). VIS manifest: 24/24 SHA-256 match.
- Remote: `personal` pushed to `origin` (`AutoByteus/autobyteus-web-prototype`).
- Cleanup: ticket dev server (3271) and canonical validation server (3212) stopped; ticket worktree and merged local branch `prototype/chat-interface-entry` removed.

## Integration And Cleanup (R1)

- Ticket result revision: `27f9b74` on `prototype/chat-interface-entry`
- Integration: `Completed` — canonical `personal` fast-forwarded `5ae0fe1` → `27f9b74` (this record is the following docs commit on `personal`).
- Baseline promotion: `Completed` — the approved experience is part of the normal product shell (`/chat`, first primary-navigation item); no preview-only route or state.
- Post-integration validation: canonical `personal` on port 3212 — `validate-chat-interface-entry.mjs` 30/30 pass, 0 browser errors; `pnpm test` 12/12 (`review-evidence/post-integration/results.json`).
- Remote: `personal` pushed to `origin` (`AutoByteus/autobyteus-web-prototype`).
- Cleanup: ticket dev server (3271) and canonical validation server (3212) stopped; ticket worktree and merged local branch `prototype/chat-interface-entry` removed.

## Intake Findings

- Current source (`fcd3e83a4`) supports replacing the model of an existing run while keeping the runtime locked (`ExistingRunModelChoice`, `RuntimeModelConfigFields` `originalModelIdentifier`). Relevant to DEC-006.

## Runtime

- Ticket review port: `3271` (ticket worktree dev server; stopped at cleanup).

## Status History

- 2026-09-28: opened, `In Progress`.
- 2026-09-28: paused for user-requested baseline refresh `WEB-BASELINE-REFRESH-001`.
- 2026-09-28: refresh accepted and integrated (`personal` fast-forwarded `ba67ac0` -> `5ae0fe1`); ticket branch fast-forwarded to `5ae0fe1` and WIP reapplied without conflict. Resumed `In Progress`.
- Note: the legacy `workspace_*` rich-state scenarios are not source-verified at the new pin; chat states use focused prototype-native fixtures in this ticket.
- 2026-09-28: round-1 prototype ready; `Awaiting User Review`.
- 2026-09-28: user feedback on round 1 picker: "This UI is terrible." `In Progress`; redesigned (PC-011..PC-013); round 2 `Awaiting User Review`. Validation 21/21, 0 browser errors (`review-evidence/round-2/`).
- 2026-09-28: user decisions: chats shown under Workspaces (DEC-004), Option B — single-agent runs open in the chat view, remove Save setup as agent and the ⋯ menu (DEC-003 out of scope). Implemented PC-014..PC-016; validation 22/22, 0 browser errors (`review-evidence/round-3/`). Round 3 `Awaiting User Review`.
- 2026-09-28: user feedback: New chat row not clean; asked for a button on the Chat menu item. Implemented PC-017; validation 23/23, 0 browser errors (`review-evidence/round-4/`). Round 4 `Awaiting User Review`.
- 2026-09-28: user flagged Grok Build shown as `Not installed`. That was a fixture choice to demonstrate the unavailable state; corrected: Grok Build available by default with an illustrative xAI catalog, unavailable state moved to scenario `chat_runtime_unavailable`. Validation 24/24, 0 browser errors.
- 2026-09-28: user flagged missing VNC Viewer and Artifacts tabs on the chat right side. Replaced the simplified panel with the product's own RightSideTabs (PC-018); tab set verified identical to /workspace. Validation 24/24, 0 browser errors.
- 2026-09-28: user reframed chat: one general agent with all skills enabled (lazy-loaded); user tags a specific skill in chat to test it; chat is the easier UI than launching agents from the Agents page. Implemented PC-019/PC-020 with defaults (tag = use this skill, `/` trigger, several tags, built-in "AutoByteus Assistant"). Requirement impact for Solution Designer: DEC-002 resolved to a built-in general agent; new skill-tagging requirement. Validation 24/24, 0 browser errors (`review-evidence/round-5/`).
- 2026-09-28: user: a tag prepends a 'use this skill' instruction to the sent message; Chat should also start agents and teams (team members share the chat model/workspace; full per-member setup stays on the Team page). User asked Product to choose the design. Implemented PC-021..PC-023 (`@` addressing, team quick path, team runs open in the existing Team view). Validation 26/26, 0 browser errors (`review-evidence/round-6/`).
- 2026-09-28: user: name the chat agent Daily Assistant, not AutoByteus Assistant. Merged into the existing Daily Assistant (PC-024). Validation 26/26, 0 browser errors. Discussed flattening assistant chats; user decided against it (chats with @agents/teams would make unlabeled chats ambiguous).
- 2026-09-28: user: Daily Assistant is a normal agent; keep chats organized exactly like the current Workspaces tree (agents, teams, orgs). Implemented PC-025 (removed Temp pin and default expansion; product ordering). Validation 27/27, 0 browser errors.
- 2026-09-28: user decision: auto-approve tools on by default in chat, same in every workspace, user can turn it off. Implemented PC-026. Validation 28/28, 0 browser errors.
- 2026-09-28: user: Skills button redundant with `/`. Removed (PC-027). Validation 28/28, 0 browser errors.
- 2026-09-28: user: collapsed right side should be the product's icon strip. Implemented PC-028 (RightSidebarStrip; header toggle removed). Validation 28/28, 0 browser errors. Pending user answer: schema-driven Thinking control proposal.
- 2026-09-28: user: keep the input box consistent across Chat and agent/team/org views. Implemented PC-029..PC-031 (one message box; attachments as chips with 📎/drop/paste; voice rule; run views show model + thinking with runtime fixed). Found and fixed a regression (agent/team chip not rendering). Validation 30/30, 0 browser errors (1 known baseline upload error classified separately). Pending: schema-driven Thinking control proposal.
- 2026-09-28: user: model settings can only change when a run is stopped, not while running. Verified against the server rule (`runModelConfigEditability`: RUN_ACTIVE). Implemented PC-032 (locked controls + Stop run; Stopped state; run views locked while live). Validation 30/30, 0 browser errors.
- 2026-09-28: user: no duplicate Stop run in the message box; just lock, stop via the tree. Implemented PC-033. Validation 30/30, 0 browser errors.
- 2026-09-28: user: divider notes not needed. Removed (PC-034). Validation 30/30, 0 browser errors.
- 2026-09-28: final consistency pass (PC-035); user confirmation recorded; final references VIS-001–VIS-025 captured; ui-ux-spec.md, behavior matrix and runbook written. `Completed`.
- 2026-09-28: reopened for revision R2 (Solution Designer SR-003 correction request). `In Progress`.
- 2026-09-28: R2 implemented (PC-036–PC-040). Validation 31/31, 0 browser errors; typecheck pass. `Awaiting User Review` for the revised Chat box.
- 2026-09-28: R2 review feedback: send button into the footer row (PC-041). Validation 31/31, 0 browser errors.
- 2026-09-28: user confirmed R2 ("I think now the chat box looks good"). Final references recaptured (24 + manifest), ui-ux-spec.md R2, matrix and runbook updated. `Completed`.
- 2026-09-28: R2 integrated (`personal` `1579886` → `efa5a97`), post-integration validation 31/31, pushed, cleaned up.
- 2026-09-29: reopened for R3 (SR-012). Implemented PC-042–PC-044; validation 31/31, 0 browser errors. `Awaiting User Review`.
- 2026-09-29: user review: simplify; the chat run view is an agent view. Implemented PC-045 (header avatar/title/status only; product run-view body). Validation 31/31, 0 browser errors; typecheck pass. `Awaiting User Review`.
- 2026-09-29: user: use the same view and the same settings as the agent view. Implemented PC-046 (⚙ product run settings, ＋ new run; shared right-panel state kept). Validation 32/32, 0 browser errors; typecheck pass. `Awaiting User Review`.
- 2026-09-29: user: remove model/thinking from the box after the chat has started (consistent with agent/team views); keep `/`. Implemented PC-047. Validation 32/32, 0 browser errors; typecheck pass. `Awaiting User Review`.
- 2026-09-29: user confirmed R3 ("I think it looks correct."). Removed obsolete picker lock code; final references recaptured (26 + manifest); spec R3, matrix, runbook updated. Validation 32/32. `Completed`.
- 2026-09-29: R3 integrated (`personal` `8ac6cad` → `39dbef1`), post-integration validation 32/32, pushed, cleaned up.
