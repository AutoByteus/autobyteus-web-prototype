# Design Change Log — remote-runs-in-tree

Changes the design makes to the accepted baseline (the run tree and the run view). Every other behaviour is preserved.

| ID | Change | Where |
| --- | --- | --- |
| DC-801 | A run another node runs gets a **node marker**: a small chip with a computer icon and the node's name, on the row's first line, right of the status dot and left of the team icon (or agent avatar) and the name (the user's direction, round 1; a first version on the second line was rejected). The row, its tree lines, status dot, identity icon, name weight and expand chevron are otherwise a local delegated copy's. | `WorkspaceTransientExecutionRow.vue`, `RemoteNodeChip.vue` |
| DC-802 | The second line starts under the node chip's computer icon (the user's direction, round 1), and carries the run's **title** (its first message, from its node) when no Project Task names the copy; with a Task the existing Task summary link stays. | same |
| DC-803 | Status uses the product's existing dots. Working = blue, idle = green, waiting (the node is starting it) = amber, offline = grey. An unreachable run shows grey. | same, no change to the dots |
| DC-804 | **Not reachable:** the row keeps its place and shows a red line "Couldn't reach {node}." with Retry (the same line and Retry as a failed activity load). Retry shows "Checking {node}…" while it asks again. The opened view shows a red notice at the top with Retry; a send that fails shows the existing red error block with the node's message. The rest of the tree works. | same, `RemoteRunNotice.vue` |
| DC-805 | **Opened view:** the header shows the node chip next to the name; ⚙ and ＋ are hidden (they copy and edit configuration that lives on the other node); the header keeps its height. | `AgentWorkspaceSurface.vue` |
| DC-806 | **Composer:** text only. The Context Files bar and attachments are not offered, `@` is off, and the box says "Message {agent} on {node}…". Stop while it works and Send are the local controls. | `AgentUserInputForm.vue`, `AgentWorkspaceView.vue`, `useComposerTarget.ts` |
| DC-807 | **Panels:** Files, Terminal, Artifacts and the screen (VNC) say "On {node}" and that the run's files, terminal, artifacts or screen are on that node and are opened in that node's window. Projects, Team, Activity, Usage and Browser are unchanged. | `RightSideTabs.vue`, `RemoteRunPanelNote.vue` |
| DC-808 | A file path clicked in a remote run's conversation shows the amber note "That file is on {node}: …" (the existing file-preview notice) instead of opening a file. | `AgentEventMonitor.vue` |
| DC-809 | **Stop (DEC-804, recommended yes):** the existing red stop square of a delegated copy appears on a live remote Team or Agent row, with the same pulse while stopping; Stop on a failed request shows "Couldn't stop it: {node} isn't reachable." | `DelegatedStopButton.vue` |
| DC-810 | The run's Delegated copies list in its settings lists only this node's copies; a remote copy's model and settings stay on its node. | `delegatedLaunchRows.ts` |
| DC-811 | The row's hover/focus tooltip and its accessible label add "on {node}". | row |
