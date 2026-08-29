# AutoByteus Web Current-Experience Prototype

Independently runnable, browser-only UI/UX baseline for pinned AutoByteus Web
commit `8ef282ba77705180d985e7000d801f0e0068cdc1`.

Ticket `REQPKG-TSUI-001` contains a Product-review candidate refresh of only
**Settings > Token Statistics** from the explicitly selected `origin/personal`
authority at `9d0fd7c570d58da1af2c7a40279327c8a20a8093`. It preserves the accepted
baseline outside that surface and is not an accepted Product commit yet. See
[prototype-bootstrap-report.md](prototype-bootstrap-report.md) and
[`evidence/token-statistics-refresh`](evidence/token-statistics-refresh/).

Status: **Approved current-state baseline, including the user-confirmed RER-009 `PP-GAP-009`/`PP-GAP-010` parity correction (`PPA-002`).** The package contains no future-state redesign.

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

For the Token Statistics candidate, open
<http://127.0.0.1:3210/settings?section=token-usage>. Select deterministic
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
SOURCE_BASE_URL=http://127.0.0.1:3110 \
PROTOTYPE_BASE_URL=http://127.0.0.1:3210 \
MOCK_BASE_URL=http://127.0.0.1:4311 \
corepack pnpm validate:gap-010
```

`validate:gap-010` preserves `JRN-050-A`–`D` and terminally enforces `JRN-050-E`; all five source-versus-prototype checkpoints must pass. `validate:final-package` makes that journey evidence, `PPA-002`, both user-confirmation references, and `VIS-001`–`VIS-017` part of terminal completion.

## REQPKG-TSUI-001 Requirements Visualization

Exploratory revision `RV-006` is isolated in the Product ticket worktree on
`prototype/reqpkg-tsui-001`; it is not integrated into the accepted baseline
on `origin/personal`. Clean review URLs are:

- `http://127.0.0.1:3262/?direction=focus`
- `http://127.0.0.1:3262/?direction=dense`

This revision keeps monthly usage, estimated cost, input/output composition,
and the point-marked daily Tokens/Cost line primary. The chart now has an
explicit Tokens/Cost Y-axis and a date-ticked X-axis, with the confusing short
vertical point guides removed. It also removes visible
prior-period comparison, the standalone dominant-contributor callout, and all
visible `driver` terminology. Exact runtime/model evidence remains secondary
under `Detailed usage`. The result is classified `Requirement Impact` until
Requirements Engineering records the user-directed removals in the canonical
requirements.
