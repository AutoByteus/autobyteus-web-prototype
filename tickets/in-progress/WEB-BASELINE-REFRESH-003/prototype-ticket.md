# Prototype Ticket

## Identity And Scope

- Product ticket: `WEB-BASELINE-REFRESH-003`
- Stable package: `cross-scope-agent-mentions` (this refresh is a prerequisite requested during its review)
- Title: Refresh the current-experience baseline to the released `origin/personal`
- Status: `Baseline Needed`
- Mode: `Product Experience Prototyping` — baseline refresh (Bootstrapper)
- Requester: user, 2026-09-30, during `cross-scope-agent-mentions` review
- User words: "I think the main project already don't have any to-do list anymore. I think the baseline is not updated."; "the remote personal has been updated. The remove web to do is already like released. Now you can update the baseline."

## Repository And Baseline

- Canonical prototype repository/root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`
- Product task worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/WEB-BASELINE-REFRESH-003`
- Product ticket branch: `prototype/web-baseline-refresh-003`
- Accepted prototype base: `df1377c4dde63c67fb5548f63e03c90c6b685d85` (`personal`, source pin `57df63f079363ccab4f2301213f9d8a3458f72fa`)
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- New source authority (explicitly selected by the user): `origin/personal@e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71` (v1.4.92-beta.3, fetched 2026-09-30; 14 commits after the pin)
- Established report: `prototype-bootstrap-report.md`
- Observed at intake: `autobyteus-web/components/workspace/agent/TodoListPanel.vue` is removed at the new authority; the prototype's Activity tab still shows the To-Do section.

## Runtime

- Reserved ports for the Bootstrapper: prototype `4196`, built preview `4195`, source `4296`, observation node `4396`
- Temporary state root: `/tmp/autobyteus-prototype-WEB-BASELINE-REFRESH-003`

## Dependent Ticket

- `cross-scope-agent-mentions` (`prototype/cross-scope-agent-mentions` @ `79a39c1`, `Awaiting User Review`) is paused for future-state edits until this refresh is accepted and integrated; it then merges the refreshed `personal` and revalidates.

## Status History

- 2026-09-30: opened on explicit user request; `Baseline Needed` (Refresh) sent to Bootstrapper.

## Finalization

- Integration result: `Pending`
- Cleanup result: `Pending`
