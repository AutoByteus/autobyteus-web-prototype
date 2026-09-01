# AutoByteus Web Product Prototype

Independently runnable, browser-only UI/UX baseline for pinned AutoByteus Web
commit `8ef282ba77705180d985e7000d801f0e0068cdc1`.

The repository is the cumulative accepted Product prototype baseline. Approved
Product tickets are integrated here and promoted to normal/default product
entry points before they are treated as the next baseline.

Canonical ownership: independent sibling repository
`https://github.com/AutoByteus/autobyteus-web-prototype.git`, checked out at
`/home/autobyteus/workspace/autobyteus-web-prototype` on branch `personal`.
RER-017 restores that repository as the sole active owner after the historical
RER-015 workspace interval; see
[independent-repository-restoration.md](independent-repository-restoration.md).

This project deliberately optimizes for **exact current experience** and
**simplified implementation**. It reuses source presentation code and assets,
but it does not include Electron, a backend, production credentials, production
data, or live service calls. Every visible record and runtime context is a
deterministic synthetic fixture.

## Run

```bash
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 3210
```

Open <http://127.0.0.1:3210>. See [prototype-runbook.md](prototype-runbook.md)
for production-preview and scenario commands.

The promoted default product entries are:

- Agent Teams: <http://127.0.0.1:3210/agent-teams?view=team-list>
- Agent Orgs: <http://127.0.0.1:3210/agent-orgs?view=org-list>
- Workspace: <http://127.0.0.1:3210/workspace>
- Token Statistics: <http://127.0.0.1:3210/settings?section=token-usage>

Normal navigation and launch/configuration journeys do not depend on
`prototypeReview` or another preview-only route switch. Historical review URLs
remain evidence only and may still expose deterministic comparison controls.

For the Token Statistics final candidate, open
<http://127.0.0.1:3261/settings?section=token-usage> during the active Product
review, or use the documented default `3210` port after starting it yourself. Select deterministic
visible states with the `autobyteus.prototype.scenario` local-storage key; the
focused catalog and validation procedure are documented in the runbook.

## Evidence

- [prototype-bootstrap-report.md](prototype-bootstrap-report.md)
- [pp-gap-009-correction.md](pp-gap-009-correction.md)
- [pp-gap-010-correction.md](pp-gap-010-correction.md)
- [parity-inventory.md](parity-inventory.md)
- [comparison-report.md](comparison-report.md)
- [prototype-scenarios.md](prototype-scenarios.md)
- [mock-boundaries.md](mock-boundaries.md)
- [evidence-index.md](evidence-index.md)
- [ui-ux-spec.md](ui-ux-spec.md)
- [final-reference-screenshots](final-reference-screenshots/README.md)
- [product-prototyper-baseline-review.md](product-prototyper-baseline-review.md)
- [independent-repository-restoration.md](independent-repository-restoration.md)
- [independent-repository-migration.md](independent-repository-migration.md)
- [workspace-repository-return.md](workspace-repository-return.md) (historical RER-015)

Bootstrap screenshots remain source-versus-prototype parity evidence. The
distinct images in `final-reference-screenshots/` were captured after explicit
user confirmation and are the normative current-state visual anchors defined
by `ui-ux-spec.md`.

## Final And Correction Validation

```bash
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test
corepack pnpm validate:boundaries
corepack pnpm build
corepack pnpm validate:gap-009-package
corepack pnpm validate:gap-010-package
corepack pnpm validate:independent-repository
corepack pnpm capture:final-references
corepack pnpm validate:final-package
corepack pnpm validate:default-baseline-promotion
SOURCE_BASE_URL=http://127.0.0.1:3110 \
PROTOTYPE_BASE_URL=http://127.0.0.1:3210 \
MOCK_BASE_URL=http://127.0.0.1:4311 \
corepack pnpm validate:gap-010
```

`validate:gap-010` preserves `JRN-050-A`–`D` and terminally enforces `JRN-050-E`; all five source-versus-prototype checkpoints must pass. `validate:final-package` makes that journey evidence, `PPA-002`, both user-confirmation references, and `VIS-001`–`VIS-017` part of terminal completion.

## REQPKG-TSUI-001 Final Prototype

The final runnable candidate is at the repository root in the Product ticket
worktree on `prototype/reqpkg-tsui-001`. The active review URL is:

- `http://127.0.0.1:3261/settings?section=token-usage`

The user-approved final prototype implements RER-009: six equal cache-aware summary columns, the
open-top 29-point daily Tokens/Cost line, focused range/filter/metric controls,
visible secondary `Detailed usage`, and lightly unified Run details. It renders
no prior-period, contributor/driver, Input/Output-ratio, or CSV-export UI and
contains no supported CSV preparation/download path. Exploratory RV-007 remains
historical decision evidence only. Normative final screenshots are
`VIS-009`–`VIS-015` under the ticket's `visual-references/` directory; files in
`review-evidence/` remain non-normative.
The approved runnable behavior revision is
`3de6227769c33cfdbefa42f22b44a0de83329563` on
`prototype/reqpkg-tsui-001`; the completed package/integration revision is
recorded in the Product ticket.

Review-package artifacts:

- [Final Prototype ticket](tickets/done/REQPKG-TSUI-001/prototype-ticket.md)
- [Draft final UI/UX specification](tickets/done/REQPKG-TSUI-001/ui-ux-spec.md)
- [Behavior matrix](tickets/done/REQPKG-TSUI-001/ui-behavior-test-matrix.md)
- [Ticket runbook](tickets/done/REQPKG-TSUI-001/prototype-runbook.md)
- [Non-normative review screenshots](tickets/done/REQPKG-TSUI-001/review-evidence/final-prototype-review)
