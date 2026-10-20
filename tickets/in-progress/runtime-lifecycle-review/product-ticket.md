# Product Ticket — runtime-lifecycle-review

## Identity And Scope

- Ticket / request ID: `runtime-lifecycle-review` (the Solution Designer's package identifier, solution revision SR-004). No second ID.
- Title: Settings → Agent Runtimes (renamed from "AI Runtimes" on the user's direction 2026-10-20; requirement impact for the Solution Designer) — show the four AI coding engines (Codex, Claude, Antigravity, Grok) for the current node, check for newer versions, update.
- Mode: `Product Experience Design` (evolves the accepted AutoByteus Web Settings page in place).
- Status: `Awaiting User Review`
- Requester: Solution Designer (`solution_designer_01a89da60c294d39aa5390913af8a6f0`), for the user, 2026-10-20: "could you ask @Product Team to work on the UI first. so we could first pin down the ui design you know".
- Related requirements (draft, not approved): `requirements-doc.md` BEH-001…005, REQ-001…005, DEC-001…003; evidence E-R19, E-R20.
  Request package: `/Users/normy/autobyteus_org/autobyteus-worktrees/runtime-lifecycle-design-review/tickets/in-progress/runtime-lifecycle-review/`.
- Open decisions shown to the user (not settled by design): Q-1 no download/install by AutoByteus; Q-2 sign-in status only; Q-3 Update on the desktop's own node only.
- Non-goals: no AutoByteus-managed engine copies, no version catalogue, no automatic updates, no notifications outside this page.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin` = autobyteus-web-prototype)
- Ticket folder: `tickets/in-progress/runtime-lifecycle-review/`
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

- Validation so far: `corepack pnpm typecheck` 0 errors; `lint` clean; `test` 17/17; browser checks of default, mixed, remote, update, failed update, agents running, load error, check failed, zh-CN, 390 px.
- Review URL: <http://127.0.0.1:4701/settings?section=agent-runtimes>
- User-confirmation reference: pending.
- Final references / `ui-ux-spec.md`: not yet captured (only after confirmation).
- Integration: Pending. Cleanup: Pending.
