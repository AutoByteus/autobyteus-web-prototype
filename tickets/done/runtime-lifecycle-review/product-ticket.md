# Product Ticket — runtime-lifecycle-review

## Identity And Scope

- Ticket / request ID: `runtime-lifecycle-review` (the Solution Designer's package identifier, solution revision SR-004). No second ID.
- Title: Settings → Agent Runtimes (renamed from "AI Runtimes" on the user's direction 2026-10-20; requirement impact for the Solution Designer) — show the four AI coding engines (Codex, Claude, Antigravity, Grok) for the current node, check for newer versions, update.
- Mode: `Product Experience Design` (evolves the accepted AutoByteus Web Settings page in place).
- Status: `Completed`
- Requester: Solution Designer (`solution_designer_01a89da60c294d39aa5390913af8a6f0`), for the user, 2026-10-20: "could you ask @Product Team to work on the UI first. so we could first pin down the ui design you know".
- Related requirements (draft, not approved): `requirements-doc.md` BEH-001…005, REQ-001…005, DEC-001…003; evidence E-R19, E-R20.
  Request package: `/Users/normy/autobyteus_org/autobyteus-worktrees/runtime-lifecycle-design-review/tickets/in-progress/runtime-lifecycle-review/`.
- Open decisions shown to the user (not settled by design): Q-1 no download/install by AutoByteus; Q-2 sign-in status only; Q-3 Update on the desktop's own node only.
- Non-goals: no AutoByteus-managed engine copies, no version catalogue, no automatic updates, no notifications outside this page.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin` = autobyteus-web-prototype)
- Ticket folder: `tickets/done/runtime-lifecycle-review/`
- Ticket worktree / branch: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/runtime-lifecycle-review`, `design/runtime-lifecycle-review`
- Accepted design base: `cb384e32c216048c5214410c435b854dc3fa96fd` (`origin/personal`, fetched 2026-10-20; local = origin)
- Source repository / frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`, `autobyteus-web`; request code `origin/personal@9227d61597`
- Baseline pin: `autobyteus-web@2f211340ee36` (`ui-baseline-report.md`).
- Baseline check (2026-10-20): `git diff 2f21134 9227d61597` over `pages/settings.vue` and `components/settings` shows only the Embedding section (already designed and integrated as `search-model-settings`) and unrelated NFS-guide copy. The Settings shell is current; no Bootstrapper request.
- Runtime isolation record: `corepack pnpm dev --port 4701 --host 127.0.0.1`; scratch scripts and captures in `/tmp/rlr/`; in-memory state, reset by reload.

## Design Summary (review candidate)

- New top-level Settings item **Agent Runtimes** (after API Keys), `/settings?section=agent-runtimes`. Name rationale: the product already says "runtime" (model menu "Runtimes", "Preferred runtime"); "AI" adds nothing; "provider" collides with API Keys providers. The page says "runtimes" (not "engines").
- One card in the Embedding visual language: title, one line of description, node line (name + "This computer" / "Remote node"), "Checked …" + **Check again**, and a four-row table: Engine · Installed · Updates · Account · action.
- Updates: Checking for updates… / Up to date / Update available (version X) / Check failed (+ "<Engine> still works") / for a missing engine, Not installed + Install instructions link.
- Update (dark button, desktop's own node only): Updating… with indeterminate bar and the vendor command + step; result "Updated from X to Y." then automatic re-check; failure shows the vendor's error and Try again. Disabled with the reason visible while the engine has agents running.
- Antigravity sign-in (user, 2026-10-20: "I first run agy, then Enter, then I can log in"): Sign in opens a terminal inside the row already running `agy` ("Press Enter in the terminal, then finish signing in to Antigravity in your browser." + Close); AutoByteus then sees it signed in. Terminal text is scripted and illustrative (the real agy screen was not observed). Product fact: the existing Terminal is the Workspace right-side tab, bound to a workspace folder; Settings has none, so a node-level terminal is new engineering work.
- Account: Signed in / Not signed in / Sign-in unknown; "–" when not installed. User direction 2026-10-20: the target is the FULL feature — detect, and a **Sign in** button on a Not signed in row (own node only) → "Signing in…" + "Finish signing in to <engine> in your browser." + Cancel → Signed in, or "Sign-in didn't finish. Try again." An engine without in-app sign-in (or a remote node) falls back to "Not signed in" + "Sign in from its command line." Installing stays terminal-only. Solution Designer answer (investigation-notes E-R21, 2026-10-20): detection works for all four; trigger works for Codex, Claude, Grok (not Antigravity: no login command); Claude needs Anthropic's approval, Codex needs the user's acceptance of OpenAI's open-source-local-app condition; remote = status only. The reference follows the recommendation: Sign in button on Codex and Grok; Claude and Antigravity show "Sign in from its command line." The per-engine choice is the user's decision (an Antigravity alternative: Sign in opens the built-in terminal panel running agy).
- Remote node: same rows, no Update button, one note "Status only. Update these engines on that node's computer."
- Design-only layers: `prototype/ai-runtimes/aiRuntimesFixture.ts` (module-level timeline), `components/settings/AiRuntimesManager.vue`, `pages/settings.vue` (nav item), localization `settings.aiRuntimes.*` en / zh-CN.
- Default view shows Grok as not installed (Not installed + Install instructions) so every state is visible at once; `runtimes_mac` installs Grok 1.0.62 as on the requester's Mac.
- Scenarios (starting state, `autobyteus.prototype.scenario`): default (the requester's Mac), `runtimes_all_current`, `runtimes_mixed`, `runtimes_agents_running` (agents finish at 12 s and 24 s), `runtimes_update_fails`, `runtimes_signed_out` (all four signed out: Codex and Grok have Sign in; Claude and Antigravity the command-line fallback), `runtimes_sign_in_fails`, `runtimes_check_failed`, `runtimes_load_failed`. Remote node: `autobyteus.prototype.context` = `electron_remote`.
- Versions are illustrative (values on the requester's Mac, 2026-10-20). Install URLs are illustrative and to be confirmed by the requirements.

## Delivery And Validation

- UI reference changes: `pages/settings.vue` (menu item `agent-runtimes`), `components/settings/AiRuntimesManager.vue`, `prototype/ai-runtimes/aiRuntimesFixture.ts`, localization en / zh-CN (`settings.aiRuntimes.*`, `settings.page.sections.aiRuntimes`). The `AiRuntimes*` file names and `ai-runtimes-*` test ids are historical; the product name is Agent Runtimes.
- Validation (port 4701): `visual-references/final-validation.mjs` 96/96 (RTM-001-020); `corepack pnpm typecheck` 0 errors; `lint` clean; `test` 17/17.
- User-confirmation reference (2026-10-20): "yes approved" after the final design summary; the user also said Q-1, Q-2 and Q-3 should be taken to the Solution Designer. Direction folded in during review: full sign-in as the target; Antigravity sign-in through a terminal running `agy` (Enter, then browser); name changed from "AI Runtimes" to "Agent Runtimes"; a not-installed runtime visible in the default view; the sign-in terminal polished ("perfect").
- Final references: 23 images `visual-references/VIS-001`-`VIS-023` captured after approval (`capture-references.mjs`); spec `ui-ux-spec.md` (`Approved`).
- Requirement impact reported to the Solution Designer: section renamed to Agent Runtimes; REQ-005 widened to Sign in (per-runtime, E-R21) with Cancel and time-out; a node-level terminal is new engineering work; runtime naming vs the model menu ("Claude SDK", "Grok Build") open; Q-1, Q-2, Q-3 and vendor terms remain the user's decisions via the Solution Designer.
- Design revision: `a74ecd4` (approved design, spec, 23 references, runbook; branch `design/runtime-lifecycle-review`, accepted base `cb384e3`); this record follows as the integration commit.
- Default-entry-point validation after integration: `Completed`. On the canonical checkout at `personal@a74ecd4`, `corepack pnpm dev --port 4703` with `final-validation.mjs` (BASE 4703) passed 96/96 (route `/settings?section=agent-runtimes`, no preview URL or preview-only state).
- Integration: `Completed`. Fast-forward push `cb384e3..a74ecd4` to `origin/personal`; the canonical checkout was fast-forwarded; local = origin.
- Cleanup: `Completed`. Dev servers on ports 4701 and 4703 stopped; the worktree and local branch removed after this record (no remote ticket branch pushed).

## Outcome And Handoff

- Next expected action: the Solution Designer takes Q-1, Q-2, Q-3 (and the Codex / Claude terms questions) to the user, writes acceptance criteria against `ui-ux-spec.md`, and brings the requirements to the user for approval.
- Handoff: `get_handoff_rules` returned only the Baseline Needed route, so the result goes back to the requester.
