# Product Ticket — manage-nodes-professional (autobyteus-363)

## Identity And Scope

- Ticket / request ID: `manage-nodes-professional` (engineering ticket `manage-nodes-professional`, autobyteus-363)
- Title: Nodes → Manage Nodes: a professional look
- Status: `Completed` (user approval 2026-11-02: "i approve. looks good now.")
- Mode: Product Experience Design
- Related requirements revision: SR-001 (REQ-901…905, AC-901…905, BEH-900…908, DEC-901…904)
- Requester: Solution Designer `solution_designer_ab22860c1d5f4de5974921c0128991f5` (delegated by `/project_task_manager`)
- Requirements authority (read only): `/Users/normy/autobyteus_org/autobyteus-worktrees/manage-nodes-professional/tickets/in-progress/manage-nodes-professional/{handoff-product-design,requirements-doc,investigation-notes,solution-revision-record}.md` and `user-screenshot-2026-11-01-beta10.png`
- Non-goals: behavior, data, server; Memory Sync, Phone Setup, Docker Guide, NFS Guide tabs

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin`)
- Ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/manage-nodes-professional` (removed after integration; see Final Integration)
- Ticket branch: `design/manage-nodes-professional`
- Accepted design base: `8a71c842835bc4e67ba3f6eb0f7b3e5e60bcffa2` (`origin/personal`, fetched 2026-11-02; unchanged at finalization)
- Source: `/Users/normy/autobyteus_org/autobyteus-worktrees/manage-nodes-professional` (`autobyteus-web`, read only) at `3b9dc912a14a19029db500c7e6bde1eb30725fd4` (beta v1.5.11-beta.10)
- Baseline: the design repository's Manage Nodes predated autobyteus-305 (no server version/update UI), a verified gap. Baseline ticket `WEB-BASELINE-REFRESH-015` (`tickets/done/WEB-BASELINE-REFRESH-015/`) refreshed that one surface to `3b9dc912a1`; accepted by the Product UI/UX Designer 2026-11-01 (five files byte-identical to the source by `cmp`; the update simulation is scripted and invented) and integrated at `8a71c842`. Docker Guide and NFS Guide, which the same source diff changed, were not refreshed (outside the surface).
- Baseline report: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md`
- Ticket folder: `tickets/done/manage-nodes-professional/`

## Runtime isolation

- Port `4950`, `corepack pnpm dev --port 4950` in the ticket worktree; stopped at finalization. State in memory; no files, no production service. The capture scaffolding was disposable (`/tmp/mnp`, not committed).

## Review

- Round 1 (2026-11-01): review URL `http://127.0.0.1:4950/nodes?nodeTab=manage`, starting states in `ui-reference-runbook.md`. User questions: where is Open (a browser has none; the empty slot was removed, DC-912); the version in parentheses next to the name (answered; not built; a recommendation to try it was offered); why a row disappeared after turning collaboration off (a browser-context behavior of the shipped page, reproduced on the untouched baseline; reported as a finding, not changed).
- Approval (2026-11-02): "i approve. looks good now." Final check: each journey clicked through from the normal entry point; one visual defect found and fixed before the screenshots (empty-offer sentence truncated, DC-913).

## Artifacts

- `ui-ux-spec.md`, `design-change-log.md` (DC-901…914), `design-review-notes.md`, `visual-references/` (VIS-001…037), and the runbook section `manage-nodes-professional` (`ui-reference-runbook.md` at the repository root).

## Findings For The Solution Designer

- Browser-context row disappearance (behavior, unchanged): in a browser window (no desktop list of nodes), a node listed only because it is registered for collaboration disappears when its collaboration is turned off and confirmed, though the dialog says it "stays in your list". Same in the shipped store (`nodeListStore.ts`, identical to the baseline) and in the untouched baseline. The desktop window keeps the row.
- While this node's own switch is off, a row's version and offer are not asked (existing behavior), so the row looks emptier. A "paused" look was offered to the user; not requested.
- Option raised by the user, not built: the version in parentheses next to the name (spec, Alternatives A1).

## Final Integration

- Integration: `Pending` until the finalization commit below records it.
