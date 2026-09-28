# Prototype Runbook — chat-interface-entry

## Location And Stack

- Request / ticket: `chat-interface-entry` (Product Design request from Solution Designer)
- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web` — Chat entry, message box, runtime/model selection
- Pinned source commit or revision: `origin/personal@fcd3e83a4ca931ba52ed19bd37b8df3050ee529e`
- Prototype repository/root (separate Git repository): `/Users/normy/autobyteus_org/autobyteus-web-prototype` (`AutoByteus/autobyteus-web-prototype`, branch `personal`)
- Prototype ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/chat-interface-entry` (removed after integration)
- Prototype ticket branch: `prototype/chat-interface-entry`
- Accepted prototype base revision: `5ae0fe1`
- Prototype revision or commit: see `prototype-ticket.md`
- Ticket folder: `tickets/done/chat-interface-entry/`
- Package manager: pnpm (via corepack)
- Framework / stack: Nuxt 3, Vue 3, TypeScript, Pinia, Tailwind
- Entry route: `/chat` (first primary-navigation item `Chat`)

## Install And Start

- Install command: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start command: `corepack pnpm dev --port 3210` (from the prototype repository root)
- Review URL: `http://127.0.0.1:3210/chat`
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
| UXJ-001 | `/chat` | Type, Enter | Live chat with Daily Assistant; run row in the tree |
| UXJ-002 | New chat | Model button → Recent / runtime submenu / search | Button shows the chosen model + runtime |
| UXJ-004 | New chat | Type `/sk`, Enter, write, send; hover chips | Chips; "Sent to the agent as" tooltip |
| UXJ-006 | New chat | Type `@prod`, Enter, send | Team view opens (stand-in run) |
| UXJ-007 | Live chat | Hover locked model; Terminate run in tree; change model | Offline; model editable; runtime fixed |
| UXJ-010 | Tree → prototype-workspace → Product Review Team → run → researcher | Inspect the message box | Same box as Chat |

## Scenario Selection

| Scenario ID | Purpose | How To Select | Expected Visible Result |
| --- | --- | --- | --- |
| `chat_first_run` | New user | `localStorage.setItem('autobyteus.prototype.scenario','chat_first_run')` + reload | No Recent; empty tree |
| `chat_catalog_error` | Catalog failure | `…'chat_catalog_error'` | Antigravity error + Retry |
| `chat_runtime_unavailable` | Missing runtime | `…'chat_runtime_unavailable'` | Grok Build "Not installed" |
| desktop-app context | Voice | `localStorage.setItem('autobyteus.prototype.context','electron_internal')` + reload | Mic before send in Chat |

## Validated Viewports And Checks

- Desktop: 1440×900
- Narrow mobile: 390×844
- Build / typecheck / lint / tests: typecheck pass; `node prototype/scripts/validate-chat-interface-entry.mjs` 30/30 (set `PROTOTYPE_BASE_URL`); final references: `node prototype/scripts/capture-chat-interface-entry-final.mjs` (set `PROTOTYPE_BASE_URL` and `VIS_DIR=tickets/done/chat-interface-entry/visual-references`)

## Known Limitations And Product Questions

- Team from Chat opens a stored stand-in team run; run-view attachment uploads never complete (baseline synthetic-server gap); run-view mic only visible in the desktop-app context where the stored team run does not open.
- Open: thinking control shape (OPEN-001), landing route (DEC-005), Daily Assistant provisioning (OPEN-003). See `ui-ux-spec.md`.
