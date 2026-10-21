# Product Ticket — WEB-BASELINE-REFRESH-012

## Identity And Scope

- Ticket / request ID: `WEB-BASELINE-REFRESH-012` (baseline ticket)
- Title: Refresh the AutoByteus Web baseline to `origin/personal@9e7a458808` (adds Nodes → Remote Collaboration)
- Status: `Baseline Needed` (request sent to the UI Baseline Bootstrapper 2026-10-21)
- Requester: Product UI/UX Designer, 2026-10-21, for the design `remote-nodes-page` (engineering Task autobyteus-267).
- Reason, verified with git: the Remote Collaboration tab (`components/settings/RemoteCollaborationCard.vue`,
  `RemoteCollaborationPeersSection.vue`) came in with source commits `8491e0d916` (autobyteus-191) and
  `fbfb8dddde` (autobyteus-245). Neither is an ancestor of the current pin `9227d61597`. The baseline's Nodes
  page therefore has no Remote Collaboration tab, and the design cannot evolve a surface the baseline lacks.
- Refresh policy: the source wins where it implements a surface; accepted design-only changes are kept.
  Single pin, whole frontend, as in earlier refreshes.
- Selected source authority: `origin/personal@9e7a45880865912442f4188e6d2a58d99b10a54c`, the engineering base of
  autobyteus-267 (contains both commits above).
- Previous pin: `9227d61597fd7ef8f6324fc9092be24ed1684c8a` (`WEB-BASELINE-REFRESH-011`).

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-012`
- Ticket branch: `design/web-baseline-refresh-012`
- Accepted design base: `288ef06f5ed49e4bc636a6560fd6ca6b4f92d5b9` (`origin/personal`, fetched 2026-10-21)
- Integration target and result: `personal`, `Pending`
- Runtime isolation: the Bootstrapper uses free ports other than 3210 and the design's 4781–4789.
- Cleanup: `Pending`
- Ticket folder: `tickets/in-progress/WEB-BASELINE-REFRESH-012/`

## Outcome And Handoff

- Next expected action: the Bootstrapper returns `Completed` or `Blocked`; the Product UI/UX Designer reviews,
  accepts, and integrates the refresh into `personal`; the design `remote-nodes-page` then merges `personal`.
