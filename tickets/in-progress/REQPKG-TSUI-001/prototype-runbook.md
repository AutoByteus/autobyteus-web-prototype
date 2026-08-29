# Token Statistics Final Prototype Runbook

## Location And Stack

- Request / ticket: `REQPKG-TSUI-001`
- Source repository: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements`
- Selected frontend application or product surface: `/home/autobyteus/workspace/autobyteus-workspace-token-statistics-ui-requirements/autobyteus-web`; Settings > Token Statistics
- Pinned source commit or revision: required `origin/personal` at `9d0fd7c570d58da1af2c7a40279327c8a20a8093`
- Prototype repository/root: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Prototype ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001`
- Prototype ticket branch: `prototype/reqpkg-tsui-001`
- Accepted prototype base revision: implementation `6ba98942c669329f70ba902db4a2880375ad52ad`; integrated metadata tip `16638137bdb8ebe627507dac6c3c8bdbc5edf9d6`
- Prototype revision or commit: Review-candidate commit `3de6227769c33cfdbefa42f22b44a0de83329563`; final accepted revision pending user confirmation
- Ticket folder: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-TSUI-001/tickets/in-progress/REQPKG-TSUI-001`
- Package manager: Corepack pnpm
- Framework / stack: Nuxt 3, Vue 3, TypeScript, Tailwind CSS, Pinia, browser-local deterministic fixtures
- Entry route: `/settings?section=token-usage`

## Install And Start

- Install command: `corepack pnpm install --ignore-workspace --frozen-lockfile`
- Start command: `corepack pnpm dev --port 3210`
- Self-start review URL: `http://127.0.0.1:3210/settings?section=token-usage`
- Active Product review URL: `http://127.0.0.1:3261/settings?section=token-usage`
- Readiness signal: Nuxt reports a local URL and the entry route returns HTTP 200.
- Stop / cleanup: Stop only the ticket-owned launcher/process group after review and repository finalization; do not stop other worktrees' processes.
- Runtime ownership: Ticket launcher PID `30625`, Nuxt PID `30643`, port `3261`, temp root `/tmp/autobyteus-prototype-REQPKG-TSUI-001`.

## Reproducibility And Project State

- Prototype repository status at review validation: Active ticket branch with implementation and draft Product artifacts; final integration pending user confirmation.
- Scenario reset/isolation method: Set or remove the browser-local `autobyteus.prototype.scenario` key, then reload.
- Required environment variables or credentials: None. All data/services are synthetic and local.

## Critical Journeys To Review

| Journey / Scenario ID | Entry Condition | Steps | Expected Outcome |
| --- | --- | --- | --- |
| `UXJ-001` / `SCN-001` | `token_partial`, Analytics | Open entry route; scan toolbar, summary, trend, Detailed usage | Six equal peers and daily usage dominate; partial truth remains concise; no rejected/export UI |
| `UXJ-002` / `SCN-002` | `populated` | Switch Tokens → Cost | Same one-line chart uses authoritative USD scale/evidence |
| `UXJ-003` / `SCN-003` | `populated` | Open Filters; apply; change Detailed usage grouping; open a row | Count/context and exact contextual accounting remain coherent |
| `UXJ-004` / `SCN-004` | 390×844 or manually resized navigation | Use controls, chart, tables, tabs | No page overflow; chart meaning and primary controls remain usable |
| `UXJ-005` / `SCN-005` | `populated` | Open Run details; use Task/Model; fetch; sort/expand | Lightly unified view with unchanged creation-time/lifetime semantics |
| `UXJ-006` / `SCN-006` | State fixtures | Load loading/error/empty/uncovered/mixed/local | Each state is truthful and recoverable where applicable |
| `UXJ-007` / `SCN-007` | Cache fixtures | Load five cache states | Percent appears only when authoritative; exact cache write remains secondary |

## Scenario Selection

Run in the browser console, then reload:

```js
localStorage.setItem('autobyteus.prototype.scenario', 'token_partial')
location.assign('/settings?section=token-usage')
```

| Scenario ID | Purpose | How To Select | Expected Visible Result |
| --- | --- | --- | --- |
| `populated` | Complete populated Analytics and Run details | key = `populated` or remove key | Six peers, 29-point line, complete evidence |
| `token_partial` | Primary review state | key = `token_partial` | Partial coverage/pricing without comparison messaging |
| `token_empty` | Covered empty | key = `token_empty` | Explicit empty Analytics/Run details state |
| `token_unavailable` | Pre-coverage range | key = `token_unavailable` | Truthful unavailable state |
| `token_mixed_currency` | Unsafe aggregate Cost | key = `token_mixed_currency` | Mixed-currency truth; no false line/zero |
| `token_local` | Local/no bill and unsupported cache | key = `token_local` | Local cost text and `Not supported` cache |
| `token_cache_zero` | Authoritative zero cache | key = `token_cache_zero` | `0%` cache rate |
| `token_cache_not_reported` | No reported cache rate | key = `token_cache_not_reported` | `Not reported` |
| `token_cache_unknown` | Unknown cache state | key = `token_cache_unknown` | `Unknown` |
| `loading` | Busy state | key = `loading` | Intentional skeleton/live state |
| `error` | Retryable state | key = `error` | Actionable error/Retry |

Reset:

```js
localStorage.removeItem('autobyteus.prototype.scenario')
location.reload()
```

## Validated Viewports And Checks

- Desktop: Chromium 1440px representative viewport; populated, partial, Cost, filters, detail, Run details, cache/state matrix, Simplified Chinese.
- Narrow mobile-equivalent: Chromium 390×844; no page overflow, two equal peers, readable chart axes with three ticks, contained table overflow.
- Validation commands:

```bash
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test
corepack pnpm validate:boundaries
NUXT_IGNORE_LOCK=1 corepack pnpm build
corepack pnpm validate:token-statistics-final
```

- Review-candidate results: typecheck pass with accepted-base duplicate-getter warnings only; lint pass; 3 files / 12 tests pass; boundary 13/13 pass; Nuxt build pass; browser 19/19 pass with zero unexpected browser errors.
- Durable logs: `validation/final-prototype/` in this ticket folder.

## Known Limitations And Product Questions

- Synthetic fixture values and identities are illustrative; no production data or credentials are used.
- No backend, GraphQL, persistence, Electron runtime, or production write is present.
- There is deliberately no CSV/export/report/share/download capability.
- No product behavior decision remains open. Explicit confirmation of the actual final runnable is required before final screenshot capture and repository completion.
