# Prototype Runbook — chat-interface-entry

## Location And Stack

- Request / ticket: `chat-interface-entry` (Product Design request from Solution Designer)
- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web` — Chat entry, message box, runtime/model selection
- Pinned source commit or revision: `origin/personal@fcd3e83a4ca931ba52ed19bd37b8df3050ee529e`
- Prototype repository/root (separate Git repository): `/Users/normy/autobyteus_org/autobyteus-web-prototype` (`AutoByteus/autobyteus-web-prototype`, branch `personal`)
- Prototype ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/chat-interface-entry` (removed after integration)
- Prototype ticket branch: `prototype/chat-interface-entry`
- Accepted prototype base revision: `5ae0fe1` (R1); R2 based on `personal@1579886`
- Prototype revision or commit: see `prototype-ticket.md`
- Ticket folder: `tickets/done/chat-interface-entry/`
- Package manager: pnpm (via corepack)
- Framework / stack: Nuxt 3, Vue 3, TypeScript, Pinia, Tailwind
- Entry route: `/` lands on `/chat` (DEC-005); also the first primary-navigation item `Chat`

## Install And Start

- Install command: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start command: `corepack pnpm dev --port 3210` (from the prototype repository root)
- Review URL: `http://127.0.0.1:3210/` (lands on `/chat`)
- Readiness signal: `/chat` returns 200 and shows "What should we work on?"
- Stop / cleanup: stop the dev server process (Ctrl+C)
- Runtime port / process / temporary-state ownership: any free local port; all state is browser-local (localStorage + in-memory)

## Reproducibility And Project State

- Prototype repository status at validation: clean ticket branch
- Scenario reset/isolation method: `localStorage.clear()` and reload, or a fresh browser context
- Required environment variables or credentials: `None` (synthetic data only)

## Critical Journeys To Review

| Journey / Scenario ID | Entry Condition | Steps | Expected Outcome |
| --- | --- | --- | --- |
| UXJ-001 | `/` (lands on `/chat`) | Type, Enter | Live chat with Daily Assistant; run row in the tree |
| UXJ-002 | New chat (last-used gpt-5.5 · Codex preselected) | Model button → runtime submenu / search (no Recent) | Button shows the chosen model + runtime |
| UXJ-004 | New chat | Type `/sk`, Enter, write, send; hover chips | Chips; "Sent to the agent as" tooltip |
| UXJ-006 | New chat | Type `@prod`, Enter, send | Team view opens (stand-in run) |
| UXJ-007 | Live chat | Hover locked model; Terminate run in tree; change model | Offline; model editable; runtime fixed |
| UXJ-008 | New chat | Context Files `+` (or drag/paste), add a file; toggle shield | "Context Files (1)" list; Ask first |
| DEC-013 check | Tree → prototype-workspace → Product Review Team → run → member | Inspect the message box | Unchanged product box (UXJ-010 superseded) |

## Scenario Selection

| Scenario ID | Purpose | How To Select | Expected Visible Result |
| --- | --- | --- | --- |
| `chat_first_run` | New user | `localStorage.setItem('autobyteus.prototype.scenario','chat_first_run')` + reload | Runtime default model (no last-used); empty tree |
| `chat_catalog_error` | Catalog failure | `…'chat_catalog_error'` | Antigravity error + Retry |
| `chat_runtime_unavailable` | Missing runtime | `…'chat_runtime_unavailable'` | Grok Build "Not installed" |
| desktop-app context | Voice | `localStorage.setItem('autobyteus.prototype.context','electron_internal')` + reload | Mic before send in Chat |

## Validated Viewports And Checks

- Desktop: 1440×900
- Narrow mobile: 390×844
- Build / typecheck / lint / tests: typecheck pass; `node prototype/scripts/validate-chat-interface-entry.mjs` 31/31 (set `PROTOTYPE_BASE_URL`); final references: `node prototype/scripts/capture-chat-interface-entry-final.mjs` (set `PROTOTYPE_BASE_URL` and `VIS_DIR=tickets/done/chat-interface-entry/visual-references`)

## Known Limitations And Product Questions

- Team from Chat opens a stored stand-in team run.
- The Chat Context Files area is a prototype mirror of the product component using local files; the Daily Assistant fixture is not listed in the prototype Agents catalog.
- Thinking levels are illustrative (schema-driven rule, DEC-009). No open product decisions; see `ui-ux-spec.md`.
