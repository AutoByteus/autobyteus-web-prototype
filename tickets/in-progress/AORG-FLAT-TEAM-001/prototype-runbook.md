# Prototype Runbook

## Location And Stack

- Ticket: `AORG-FLAT-TEAM-001`
- Source: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web` at `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Prototype repository: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001`
- Branch: `prototype/aorg-flat-team-001`
- Accepted base: `5561e3ac593a210ab7b3b8621c5daea31f95f08e`
- Review candidate revision: `RV-009`; runnable candidate commit `c3221cf3faa6b7c6abab0b4c555b6b88f547cfd1`
- Stack: Nuxt 3, Vue 3, TypeScript, Tailwind, deterministic prototype fixtures
- Ticket folder: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001`

## Install And Start

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4194
```

Review entries: `http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-list` and `http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-list`

Handoff review entries: `http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-detail&id=software-development-department` and `http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-edit&id=software-development-department`.

Exact-entry configuration examples:

- Team: `http://127.0.0.1:4194/workspace?prototypeReview=agent-org-flat&root=org&org=software-development-department&entry=team%3Aproduct-design-prototyping-team&phase=config`
- Agent: `http://127.0.0.1:4194/workspace?prototypeReview=agent-org-flat&root=org&org=software-development-department&entry=agent%3Arequirements-engineer&phase=config`

These routes deliberately begin at the accepted configuration surface. Select
`/synthetic/prototype-workspace`, then use **Run Team** or **Run Agent**.

Team-detail preservation review: `http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-detail&id=product-design-prototyping-team`. Use either member's `View ↗` action and **Back to team** to validate the preserved Agent-detail journey.

Temporary accepted-baseline comparison: `http://127.0.0.1:4195/agent-teams?view=team-list`. This comparison server runs the read-only canonical `personal` checkout; it is not the ticket editing worktree.

The Product-owned preview process uses only port `4194`; no production credentials or services are required. Stop only the recorded `4194` process for this ticket.

## Critical Journeys

See `review-guide.md`. Every prototype route carries `prototypeReview=agent-org-flat`. Query parameters select deterministic views, IDs, root subject, exact entry, and focused temporary execution.

## Validation

```bash
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test
corepack pnpm validate:boundaries
PROTOTYPE_BASE_URL=http://127.0.0.1:4194 corepack pnpm validate:aorg-flat-team-review
PROTOTYPE_BASE_URL=http://127.0.0.1:4194 corepack pnpm validate:nested-team-hierarchy-review
NUXT_IGNORE_LOCK=1 corepack pnpm build
```

Validated desktop: `1440×900`. Validated narrow: `390×844`. RV-009 browser result: `55/55` checks, `17` captures, zero runtime errors. Typecheck, lint, `12/12` tests, `13/13` boundary checks, and build pass. The prototype uses synthetic, locally resettable fixtures and performs no production writes.
