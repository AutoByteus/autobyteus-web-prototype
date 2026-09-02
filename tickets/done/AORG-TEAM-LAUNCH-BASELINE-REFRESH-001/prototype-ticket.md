# Prototype Ticket

## Identity And Scope

- Product ticket: `AORG-TEAM-LAUNCH-BASELINE-REFRESH-001`
- Stable requirements package: `AORG-FLAT-TEAM-001`
- Title: AgentTeam launch current-experience baseline refresh
- Status: `Completed`
- Mode: `Current-experience baseline refresh supporting Product Experience Prototyping`
- Action boundary: independently refresh the established flat AgentTeam launch configuration current experience from the explicitly selected source authority. No future-state AgentOrg behavior is included.

## Repository And Baseline

- Canonical prototype repository/root: `/home/autobyteus/workspace/autobyteus-web-prototype`
- Product task worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-TEAM-LAUNCH-BASELINE-REFRESH-001`
- Product ticket branch: `prototype/aorg-team-launch-baseline-refresh-001`
- Integration/default branch: `personal`
- Accepted prototype base: `1edc1008a55b04d04dd2f07bd9004d53079e09a2`
- Selected frontend: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web`
- Explicit source authority: `origin/personal@5fb16658e7bd2aefd750f99eb596a17382e161ac`
- Bootstrap report: `/home/autobyteus/workspace/autobyteus-web-prototype/prototype-bootstrap-report.md`

## Accepted Current Experience

- The flat AgentTeam launch journey now matches the selected source for Team identity, runtime/model selection, Workspace Existing/New authoring, root auto-approval, collapsed Team Members Override disclosure, inherited member configuration, exact-Agent customization, launch readiness, keyboard behavior, and the narrow layout.
- The refresh imports no production services, credentials, filesystem writes, persistence, or runtime execution. Synthetic prototype-local fixtures remain the operational boundary.
- Product Prototyper inspected the paired source/prototype default, inherited-member, customized-Agent, and narrow captures and accepted the candidate as the current-experience baseline.

## Validation

- Paired source/prototype browser validation: `8/8` pass with exact semantics, geometry, action state, and zero browser errors. Six captures are byte-identical; three normalized raster pixels across the remaining two are non-perceptible.
- Static validation: typecheck, lint, `15/15` tests, `13/13` boundary checks, and production build pass.
- Independent built preview: HTTP 200, deterministic scenario applied, zero non-loopback requests, and zero browser errors.
- Product acceptance record: `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-TEAM-LAUNCH-BASELINE-REFRESH-001/validation/product-acceptance.txt`.
- Durable evidence: `/home/autobyteus/workspace/autobyteus-web-prototype/evidence/AORG-FLAT-TEAM-001/team-launch-baseline-refresh`.

## Runtime And Finalization

- Candidate review port: `4199`.
- Temporary state root: `/tmp/autobyteus-prototype-AORG-TEAM-LAUNCH-BASELINE-REFRESH-001`.
- Integration result: `Completed` — canonical `personal` fast-forwarded from `1edc1008a55b04d04dd2f07bd9004d53079e09a2` to accepted refresh revision `c32058042d28023a7da884c391b2350115597910`.
- Promoted baseline revision: `c32058042d28023a7da884c391b2350115597910`; the refreshed AgentTeam launch form is reached through the normal standalone Team Run journey without review-only query state.
- Cleanup result: `Pending` until the candidate/source/mock/post-integration servers are stopped and the integrated worktree/branch are removed safely.
- Post-integration validation: canonical `personal` on port `4202` passed the same `8/8` paired checks with zero browser errors after a single warm-up retry; the first attempt recorded transient Nuxt `Outdated Optimize Dep` errors before the dev server stabilized. Evidence is under `validation/post-integration/`.
- Next action: complete safe cleanup, then resume Product ticket `AORG-TEAM-OVERRIDES-001` from this refreshed baseline.
