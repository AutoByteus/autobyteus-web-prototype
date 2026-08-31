# Prototype Runbook

## Location And Stack

- Ticket: `AORG-FLAT-TEAM-001`
- Source: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web` at `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Prototype repository: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001`
- Branch: `prototype/aorg-flat-team-001`
- Accepted base: `5561e3ac593a210ab7b3b8621c5daea31f95f08e`
- Approved prototype: `RV-012`; runnable behavior commit `891b4e667d51fffb92ebd85dd2dc90a8e0afcf2e`; visual-reference capture commit `3de2c08b6f3d8cfdb75714edaa88b00d04d67aaf`
- Stack: Nuxt 3, Vue 3, TypeScript, Tailwind, deterministic prototype fixtures
- Ticket folder: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001`

## Install And Start

```bash
cd /home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4194
```

Primary entries:

- Agent Teams: `http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-list`
- Agent Orgs: `http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-list`
- AgentOrg detail: `http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-detail&id=software-development-department`
- AgentOrg edit/Handoffs: `http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-edit&id=software-development-department`
- AgentOrg configuration: `http://127.0.0.1:4194/workspace?prototypeReview=agent-org-flat&root=org&org=software-development-department&phase=config`
- Active AgentOrg, unfocused: `http://127.0.0.1:4194/workspace?prototypeReview=agent-org-flat&root=org&org=software-development-department&phase=active`

The configuration starts with no active execution. Select
`/synthetic/prototype-workspace`, then use **Run Agent Org**. The active Org
starts with no communication focus; select an exact Agent or Team from the left
sidebar.

Team-detail preservation entry:
`http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-detail&id=product-design-prototyping-team`.
Use either member's `View ↗` action and **Back to team** to validate the
preserved Agent-detail journey.

The Product-owned preview uses only port `4194`; no production credentials or
services are required. Stop only the recorded process for this ticket.

## Scenario Selection

All review routes carry `prototypeReview=agent-org-flat`. The AgentOrg runtime
uses:

- `root=org&org=software-development-department&phase=config`
- `root=org&org=software-development-department&phase=active`

There is intentionally no `entry` query. Prototype state is deterministic and
locally resettable through the existing scenario bootstrap.

## Validation

```bash
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test
corepack pnpm validate:boundaries
PROTOTYPE_BASE_URL=http://127.0.0.1:4194 node prototype/scripts/validate-agent-org-rv12-review.mjs
NUXT_IGNORE_LOCK=1 corepack pnpm build
node prototype/scripts/capture-agent-org-final-references.mjs
node prototype/scripts/validate-agent-org-final-package.mjs
```

Post-approval final validation completed on `2026-08-31`. Validated desktop: `1440×900`. Validated narrow: `390×844`. RV-012 browser
result: `59/59` checks, `20` captures, zero runtime errors. Typecheck, lint,
`12/12` tests, `13/13` boundary checks, production build, and `6/6` final package integrity checks pass. The prototype
uses synthetic local fixtures and performs no production writes.
