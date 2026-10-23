# Design Assumptions — remote-runs-in-tree

Simulation boundaries and design decisions the user has not yet confirmed. IDs are stable.

| ID | Assumption | Status |
| --- | --- | --- |
| PA-801 | The node's name on the chip is the name the owner gave the peer in Nodes (DEC-806). It is shown as given, truncated at 7 rem in a row. | From the requirements |
| PA-802 | The product has no separate "waiting" status. The requirement's four states map to the existing dots: working = running, idle = idle, waiting = initializing (the node is waking the run), offline = offline. | Designer |
| PA-803 | Where a copy has a Project Task, the second line keeps the Task summary link (delegated-copy-task-locator); the run's own title shows when it has none. | Designer, for the user to judge |
| PA-804 | A member of a remote Team carries no chip of its own; the Team row above it does. Its opened view does (header). | Designer |
| PA-805 | Activity, Team messages, Usage and Browser stay available for a remote run because they are built from the conversation events this node streams; Files, Terminal, Artifacts and the screen read the other node's disk, processes or screen and are replaced by a note. | Designer; the Solution Designer confirms it is feasible |
| PA-806 | Attachments, `@` mentions, ⚙ (run settings) and ＋ (new chat from this run) are not offered for a remote run. | Designer |
| PA-807 | Retry asks the node again; it is not a reconnection or a catch-up. In the UI reference it answers after 1.5 s; in the product it is bounded at 20 s. | Designer |
| PA-808 | Team and Org delegators render a remote copy with the same row component (`WorkspaceTransientExecutionRow`, shared by the standalone, Team and Org trees). The UI reference demonstrates a standalone delegator (the user's Project Task Manager case). | Designer |
| PA-809 | Simulation: the other node is a fixture under the existing GraphQL and WebSocket mock layers: its status, titles and conversations are scripted; its events arrive through the same collaboration stream a local copy uses; a Stop or a sent message is answered by a script. | Boundary |
