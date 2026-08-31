# Prototype Runbook

## Location And Stack

- Ticket: `AORG-FLAT-TEAM-001`
- Source: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web` at `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Prototype repository: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001`
- Branch: `prototype/aorg-flat-team-001`
- Accepted base: `893cde9dbcc5ccc8904cf08ba6b031668dff0041`
- Review candidate revision: `RV-003`; commit recorded after the revision validation package is committed
- Stack: Nuxt 3, Vue 3, TypeScript, Tailwind, deterministic prototype fixtures
- Ticket folder: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001`

## Install And Start

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4194
```

Review entry: `http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-list`

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

Validated desktop: `1440×900`. Validated narrow: `390×844`. The prototype uses synthetic, locally resettable fixtures and performs no production writes.
