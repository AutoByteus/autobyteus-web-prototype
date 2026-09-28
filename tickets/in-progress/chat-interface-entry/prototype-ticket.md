# Prototype Ticket

## Identity And Scope

- Product ticket: `chat-interface-entry`
- Stable requirements package: `chat-interface-entry` (SR-001, requirements Draft)
- Title: Chat entry above Agents, New chat, and easy runtime/model selection
- Status: `Awaiting User Review` (round 6)
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
- Change log: `tickets/in-progress/chat-interface-entry/prototype-change-log.md` (PC-001..PC-010)
- Browser validation: `node prototype/scripts/validate-chat-interface-entry.mjs` → 21/21 pass, 0 browser errors (`review-evidence/round-1/results.json`)
- Static checks: typecheck pass (pre-existing duplicate-import warnings only), lint pass, 12/12 tests.
- Non-normative review screenshots: `review-evidence/round-1/`

## Intake Findings

- Current source (`fcd3e83a4`) supports replacing the model of an existing run while keeping the runtime locked (`ExistingRunModelChoice`, `RuntimeModelConfigFields` `originalModelIdentifier`). Relevant to DEC-006.

## Runtime

- Ticket review port: `3271` (stopped while paused).

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
