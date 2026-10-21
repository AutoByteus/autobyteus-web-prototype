# Product Ticket — WEB-BASELINE-REFRESH-012

## Identity And Scope

- Ticket / request ID: `WEB-BASELINE-REFRESH-012` (baseline ticket)
- Title: Refresh the AutoByteus Web baseline to `origin/personal@9e7a458808` (adds Nodes → Remote Collaboration)
- Status: `Completed` (accepted by Product 2026-10-21)
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
- Integration target and result: `personal`, see Integration below
- Runtime isolation: the Bootstrapper uses free ports other than 3210 and the design's 4781–4789.
- Cleanup: `Pending`
- Ticket folder: `tickets/done/WEB-BASELINE-REFRESH-012/`

## Outcome And Handoff

- Next expected action: the Bootstrapper returns `Completed` or `Blocked`; the Product UI/UX Designer reviews,
  accepts, and integrates the refresh into `personal`; the design `remote-nodes-page` then merges `personal`.

## Product Acceptance (2026-10-21)

- Bootstrapper result: `Completed` (Refresh), report `ui-baseline-report.md`, evidence `evidence/WEB-BASELINE-REFRESH-012/`.
- Sync check (Product): the Remote Collaboration files (`RemoteCollaborationCard.vue`, `RemoteCollaborationPeersSection.vue`,
  `NodeManager.vue`, `NodeManagerTabs.vue`, `FeatureCapabilityToggleCard.vue`, `remoteCollaborationStore.ts`, en and zh-CN messages)
  compared byte for byte with `9e7a458808:autobyteus-web/…`: all identical.
- Data origin (Product): the Remote Collaboration fixture (`prototype/source-observation/node-settings-fixtures.mjs`) is hand-written:
  two invented peers (`docker`, `studio`, private-range example URLs), synthetic refusals. Snapshots are captured from the pinned source
  running on the synthetic node, as accepted in earlier refreshes. No real data.
- Browser (Product, port 4790, scenario `collab_peers`): `/nodes?nodeTab=remoteCollaboration` shows the switch card, Peer nodes with two peers and
  Rename/Remove, and the add form; same as the source code renders.
- Decisions on the Bootstrapper's questions: (1) keep the earlier settings-update-notifications and runtime-lifecycle-review references as their
  design record (this ticket does not touch those surfaces); (2) the default scenario without waiting notifications is accepted;
  (3) the Reconnect collaborator case on delegated copies stays open and is out of scope here.
- Runtime: preview server 4790 stopped.
