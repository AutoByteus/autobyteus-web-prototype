# Product Ticket — WEB-BASELINE-REFRESH-015

- Ticket / request ID: `WEB-BASELINE-REFRESH-015` (baseline ticket for design ticket `manage-nodes-professional`, autobyteus-363)
- Status: `Completed` (accepted 2026-11-01 by the Product UI/UX Designer)
- Mode: Scoped refresh of one surface (Nodes → Manage Nodes)
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`; worktree `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/WEB-BASELINE-REFRESH-015`; branch `design/web-baseline-refresh-015`
- Accepted design base: `2f31380eb93ff5e22f1fc1594ed3c052cb988b2b`
- Source: `/Users/normy/autobyteus_org/autobyteus-worktrees/manage-nodes-professional` (`autobyteus-web`) at `3b9dc912a1` (beta v1.5.11-beta.10), read only
- Scope: Manage Nodes tab; files changed after the baseline pin `d74f75a`: NodeRow.vue, NodeServerUpdate.vue (new), nodeServerUpdateStore.ts (new), nodesPage localization (en, zh-CN)
- Reason (verified gap): autobyteus-305 added the server version line, "Update to <version>", progress, restarting, result/blocker notices and Copy command; the baseline has none of it (no NodeServerUpdate component or store). The coming design touches this surface.

- Result: Manage Nodes at UI parity with `3b9dc912a1`; five files byte-identical to the source (`cmp`), update simulation in `prototype/nodes/network-world.mjs` (invented values). Report: `ui-baseline-report.md` section WEB-BASELINE-REFRESH-015; runbook section of the same name; evidence `evidence/WEB-BASELINE-REFRESH-015/`.
- Not refreshed (outside the surface): Docker Guide (one more command, 2 strings) and NFS Guide (shortened texts) still show `d74f75a`.
- Acceptance check: the Product UI/UX Designer ran the reference (`nodes_states`, `electron_internal`) and looked at it beside the source files; data origin: scripted and invented.
