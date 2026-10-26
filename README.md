# AutoByteus Web Design

Independently runnable, browser-only UI/UX baseline for pinned AutoByteus Web
commit `d74f75a51ab7dc47d42a13f33e0f943c3a230ad7` (`origin/personal`, refreshed
by `WEB-BASELINE-REFRESH-013`; previous pin
`9e7a45880865912442f4188e6d2a58d99b10a54c`). The refresh brings in Settings →
Model Routing ("Agent runtimes now"), the "Show internal agents" and Claude
one-hour cache cards of Server Settings → Basics, the Nodes page as it ships
(one list of nodes, Remote Collaboration merged into it, a Docker address hint, an NFS
Guide tab), runs on other nodes in the Workspaces tree, automatic updates and
check intervals in the Update checks card and the Notification Center, Project
Task titles and comments, and the remote-node variants of Agent Runtimes. The
source's own components replace the design-only versions of `one-nodes-tab`,
`remote-runs-in-tree` and `update-checks-and-auto-updates`; the accepted
design-only Reconnect change (`agent-definition-reconnect-ui`) and the example
data of the earlier designs are preserved. See
[ui-baseline-report.md](ui-baseline-report.md) for the refresh scope, evidence,
and known gaps.

The repository is the cumulative accepted Product baseline. Approved
Product tickets are integrated here and promoted to normal/default product
entry points before they are treated as the next baseline.

Canonical ownership: independent sibling repository
`https://github.com/AutoByteus/autobyteus-web-prototype.git`, checked out at
`/Users/normy/autobyteus_org/autobyteus-web-design` on branch `personal`.
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

Open <http://127.0.0.1:3210>. See [ui-reference-runbook.md](ui-reference-runbook.md)
for production-preview and scenario commands.

The promoted default product entries are:

- Agent Teams: <http://127.0.0.1:3210/agent-teams?view=team-list>
- Agent Orgs: <http://127.0.0.1:3210/agent-orgs?view=org-list>
- Workspace: <http://127.0.0.1:3210/workspace>
- Projects: <http://127.0.0.1:3210/projects>
- Token Statistics: <http://127.0.0.1:3210/settings?section=token-usage>
- Nodes (one Manage Nodes list, Remote Collaboration merged in; `one-nodes-tab`): <http://127.0.0.1:3210/nodes?nodeTab=manage> (scenarios `nodes_user` and `nodes_states`, see the runbook)

- Update checks, agent runtimes and automatic updates (`update-checks-and-auto-updates`, autobyteus-210): <http://127.0.0.1:3210/workspace>
  with `autobyteus.prototype.context` = `electron_internal` and `autobyteus.prototype.scenario` = `updates_waiting` (other scenarios in
  the runbook); the Notification Center opens on the right side of the window; Settings → Server Settings → Basics → Update checks;
  Settings → Updates. Spec: `tickets/done/update-checks-and-auto-updates/ui-ux-spec.md`.

- Model Routing (`delegated-runtime-model-routing`, autobyteus-32): <http://127.0.0.1:3210/settings?section=model-routing> (tabs Configuration, Decisions, Overview, Runtimes; the router's run `/chat?id=run-model-router`);
  starting states in the runbook. Spec: `tickets/done/delegated-runtime-model-routing/ui-ux-spec.md`.

- Memory (memory search, the memory index pipeline and the Work Journal view; `work-journal-search`, autobyteus-185): <http://127.0.0.1:3210/memory>
  (tabs Browse · Search · Index; starting states in the runbook). Spec: `tickets/done/work-journal-search/ui-ux-spec.md`.

Normal navigation and launch/configuration journeys do not depend on
`prototypeReview` or another preview-only route switch. Historical review URLs
remain evidence only and may still expose deterministic comparison controls.

For the Token Statistics final candidate, open
<http://127.0.0.1:3261/settings?section=token-usage> during the active Product
review, or use the documented default `3210` port after starting it yourself. Select deterministic
visible states with the `autobyteus.prototype.scenario` local-storage key; the
focused catalog and validation procedure are documented in the runbook.

## Evidence

- [ui-baseline-report.md](ui-baseline-report.md)
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


## Approved Projects / Tasks UI — 2026-10-02

> **Superseded by the source (WEB-BASELINE-REFRESH-004).** Source `0a32261`
> shipped its own page-based Project and Task authoring. The runnable Projects
> surfaces are now the source's pages and stores (the prototype review stores
> were removed); this section and its supplement remain the historical design
> record. See [ui-baseline-report.md](ui-baseline-report.md).

PROJ-TASK-MANAGER-20261002-001: the approved manual authoring/board slice is
reachable through normal Chat → Projects navigation. New/Edit Project and
Task flows are pages; Project forms optionally include direct Existing/New
workspace choices and descriptions. Tasks use only three continuous status
columns, with no alternate List view. Create returns to the Project board.
Task detail has adjacent Edit/Delete and no ID/date/information disclosure.
Voice and context files are explicitly local simulations, not real services.

The current contract for these intentionally changed surfaces is the
[approved UI/UX supplement](tickets/done/project-task-manager-foundations/ui-ux-spec.md),
with normative ticket-scoped VIS-001–020 references. See the
[ticket/runbook](tickets/done/project-task-manager-foundations/prototype-ticket.md)
for exact revisions, integration, validation and cleanup. Other inherited
baseline references remain preservation context. Broader Manager/dependency/
execution/result requirements are still Draft, not authorized for implementation.
Installed Projects remains experimental/default-off and was not changed.
